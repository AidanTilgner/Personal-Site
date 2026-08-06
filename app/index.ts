import { createApp } from "./app";
import { getServerPort } from "./config/env";
import { getAIBudgetStatus } from "./utils/ai-budget";

const port = getServerPort();
const app = await createApp();

app.listen(port);

console.info(`Elysia server listening on http://localhost:${port}`);
const budget = getAIBudgetStatus();
if (budget.enabled) {
  console.info(
    `Monthly AI budget: $${budget.reservedUsd?.toFixed(4)} reserved of $${budget.budgetUsd?.toFixed(2)} for ${budget.period}.`,
  );
}

const shutdown = () => {
  app.stop();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
