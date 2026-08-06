import { describe, expect, test } from "bun:test";
import { AIBudgetExceededError, AIBudgetLedger } from "./ai-budget";

describe("monthly AI budget", () => {
  test("persists conservative reservations and rejects overspend", () => {
    const ledger = new AIBudgetLedger(
      {
        budgetUsd: 0.00001,
        databasePath: ":memory:",
        safetyMultiplier: 1,
      },
      () => new Date("2026-08-06T00:00:00Z"),
    );

    ledger.reserve({ input: "12345", inputUsdPerMillion: 1 });
    expect(ledger.status()).toMatchObject({
      enabled: true,
      period: "2026-08",
      reservedUsd: 0.000005,
      remainingUsd: 0.000005,
    });
    expect(() =>
      ledger.reserve({ input: "123456", inputUsdPerMillion: 1 }),
    ).toThrow(AIBudgetExceededError);
    expect(ledger.status().reservedUsd).toBe(0.000005);
    ledger.close();
  });

  test("starts a fresh ledger period each UTC month", () => {
    let now = new Date("2026-08-31T23:59:59Z");
    const ledger = new AIBudgetLedger(
      {
        budgetUsd: 1,
        databasePath: ":memory:",
        safetyMultiplier: 1,
      },
      () => now,
    );
    ledger.reserve({ input: "hello", inputUsdPerMillion: 1 });
    now = new Date("2026-09-01T00:00:00Z");
    expect(ledger.status()).toMatchObject({
      period: "2026-09",
      reservedUsd: 0,
      remainingUsd: 1,
    });
    ledger.close();
  });
});
