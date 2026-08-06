// Bun loads .env files before this entrypoint runs. Astro's standalone Node
// adapter reads PORT, while the site exposes ASTRO_PORT as its public setting.
export {};

process.env.PORT ??= process.env.ASTRO_PORT ?? "3004";

await import("../dist/server/entry.mjs");
