import { Database } from "bun:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";

const DEFAULT_DATABASE_PATH = path.resolve("app/data/ai-budget.sqlite");
const DEFAULT_SAFETY_MULTIPLIER = 1.25;

type BudgetConfig = {
  budgetUsd: number;
  databasePath: string;
  safetyMultiplier: number;
};

type Reservation = {
  input: string | string[];
  inputUsdPerMillion: number;
  maxOutputTokens?: number;
  outputUsdPerMillion?: number;
};

export type AIBudgetStatus = {
  enabled: boolean;
  period?: string;
  budgetUsd?: number;
  reservedUsd?: number;
  remainingUsd?: number;
};

const configuredNumber = (
  name: string,
  fallback?: number,
  maximum = 1_000_000,
) => {
  const raw = process.env[name];
  if (raw === undefined && fallback === undefined) return;
  const value = Number(raw ?? fallback);
  if (!Number.isFinite(value) || value < 0 || value > maximum) {
    throw new Error(`${name} must be a number between 0 and ${maximum}.`);
  }
  return value;
};

const getConfig = (): BudgetConfig | undefined => {
  const budgetUsd = configuredNumber("AI_MONTHLY_BUDGET_USD");
  if (budgetUsd === undefined) return;
  const safetyMultiplier =
    configuredNumber(
      "AI_BUDGET_SAFETY_MULTIPLIER",
      DEFAULT_SAFETY_MULTIPLIER,
      10,
    ) ?? DEFAULT_SAFETY_MULTIPLIER;
  if (safetyMultiplier < 1) {
    throw new Error("AI_BUDGET_SAFETY_MULTIPLIER must be between 1 and 10.");
  }
  return {
    budgetUsd,
    databasePath:
      process.env.AI_BUDGET_DB_PATH?.trim() || DEFAULT_DATABASE_PATH,
    safetyMultiplier,
  };
};

const currentPeriod = (date = new Date()) =>
  `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;

const toMicroUsd = (usd: number) => Math.ceil(usd * 1_000_000);
const fromMicroUsd = (microUsd: number) => microUsd / 1_000_000;

export class AIBudgetExceededError extends Error {
  constructor() {
    super("The configured monthly AI budget has been reached.");
    this.name = "AIBudgetExceededError";
  }
}

export class AIBudgetLedger {
  private database: Database;

  constructor(
    private config: BudgetConfig,
    private now: () => Date = () => new Date(),
  ) {
    if (config.databasePath !== ":memory:") {
      mkdirSync(path.dirname(config.databasePath), { recursive: true });
    }
    this.database = new Database(config.databasePath, { strict: true });
    this.database.run("PRAGMA journal_mode = WAL");
    this.database.run("PRAGMA busy_timeout = 5000");
    this.database.run(`
      CREATE TABLE IF NOT EXISTS ai_budget_usage (
        period TEXT PRIMARY KEY,
        reserved_micro_usd INTEGER NOT NULL
      )
    `);
  }

  reserve({
    input,
    inputUsdPerMillion,
    maxOutputTokens = 0,
    outputUsdPerMillion = 0,
  }: Reservation) {
    const inputBytes = (Array.isArray(input) ? input : [input]).reduce(
      (total, value) => total + Buffer.byteLength(value, "utf8"),
      0,
    );
    // A UTF-8 byte is a conservative upper bound for one tokenizer token.
    const estimatedUsd =
      ((inputBytes * inputUsdPerMillion +
        maxOutputTokens * outputUsdPerMillion) /
        1_000_000) *
      this.config.safetyMultiplier;
    const reservation = Math.max(1, toMicroUsd(estimatedUsd));
    const budget = toMicroUsd(this.config.budgetUsd);
    const period = currentPeriod(this.now());

    this.database.transaction(() => {
      const current =
        this.database
          .query<{ reserved_micro_usd: number }, [string]>(
            "SELECT reserved_micro_usd FROM ai_budget_usage WHERE period = ?",
          )
          .get(period)?.reserved_micro_usd ?? 0;
      if (current + reservation > budget) throw new AIBudgetExceededError();
      this.database.run(
        `INSERT INTO ai_budget_usage (period, reserved_micro_usd)
         VALUES (?, ?)
         ON CONFLICT(period) DO UPDATE SET
           reserved_micro_usd = excluded.reserved_micro_usd`,
        [period, current + reservation],
      );
    })();

    return fromMicroUsd(reservation);
  }

  status(): AIBudgetStatus {
    const period = currentPeriod(this.now());
    const reservedMicroUsd =
      this.database
        .query<{ reserved_micro_usd: number }, [string]>(
          "SELECT reserved_micro_usd FROM ai_budget_usage WHERE period = ?",
        )
        .get(period)?.reserved_micro_usd ?? 0;
    const reservedUsd = fromMicroUsd(reservedMicroUsd);
    return {
      enabled: true,
      period,
      budgetUsd: this.config.budgetUsd,
      reservedUsd,
      remainingUsd: Math.max(0, this.config.budgetUsd - reservedUsd),
    };
  }

  close() {
    this.database.close();
  }
}

let ledger: AIBudgetLedger | undefined;

const getLedger = () => {
  const config = getConfig();
  if (!config) return;
  return (ledger ??= new AIBudgetLedger(config));
};

const pricingForModel = (
  environmentName: string,
  model: string,
  defaultModel: string,
  defaultPrice: number,
) => {
  const configured = configuredNumber(environmentName);
  if (configured !== undefined) return configured;
  if (model === defaultModel) return defaultPrice;
  throw new Error(
    `${environmentName} is required when AI_MONTHLY_BUDGET_USD is enabled with ${model}.`,
  );
};

export const reserveAIResponseBudget = ({
  model,
  input,
  maxOutputTokens,
}: {
  model: string;
  input: string | string[];
  maxOutputTokens: number;
}) => {
  const budget = getLedger();
  if (!budget) return;
  const inputBytes = (Array.isArray(input) ? input : [input]).reduce(
    (total, value) => total + Buffer.byteLength(value, "utf8"),
    0,
  );
  const longContext = inputBytes > 272_000;
  return budget.reserve({
    input,
    maxOutputTokens,
    inputUsdPerMillion:
      pricingForModel(
        "AI_CHAT_INPUT_USD_PER_MILLION",
        model,
        "gpt-5.6-luna",
        1,
      ) * (longContext ? 2 : 1),
    outputUsdPerMillion:
      pricingForModel(
        "AI_CHAT_OUTPUT_USD_PER_MILLION",
        model,
        "gpt-5.6-luna",
        6,
      ) * (longContext ? 1.5 : 1),
  });
};

export const reserveAIEmbeddingBudget = ({
  model,
  input,
}: {
  model: string;
  input: string[];
}) => {
  const budget = getLedger();
  if (!budget) return;
  return budget.reserve({
    input,
    inputUsdPerMillion: pricingForModel(
      "AI_EMBEDDING_INPUT_USD_PER_MILLION",
      model,
      "text-embedding-3-small",
      0.02,
    ),
  });
};

export const getAIBudgetStatus = (): AIBudgetStatus =>
  getLedger()?.status() ?? { enabled: false };

export const isAIBudgetExceeded = (error: unknown) =>
  error instanceof AIBudgetExceededError;
