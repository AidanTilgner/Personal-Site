import { createApp } from "./app";
import { getServerPort } from "./config/env";

const port = getServerPort();
const app = await createApp();

app.listen(port);

console.info(`Elysia server listening on http://localhost:${port}`);

const shutdown = () => {
  app.stop();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
