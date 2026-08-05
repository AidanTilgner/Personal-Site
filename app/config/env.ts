const positiveInteger = (name: string, fallback: number, maximum: number) => {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isSafeInteger(value) || value < 1 || value > maximum) {
    throw new Error(`${name} must be an integer between 1 and ${maximum}.`);
  }
  return value;
};

export const getServerPort = () =>
  positiveInteger("SERVER_PORT", 8_080, 65_535);

export const getChatLimits = () => ({
  requestsPerMinute: positiveInteger("CHAT_REQUESTS_PER_MINUTE", 10, 1_000),
  maxConcurrent: positiveInteger("CHAT_MAX_CONCURRENT", 4, 100),
});

export const getAllowedOrigins = () => {
  const configured = process.env.CORS_ORIGINS?.split(",") ?? [
    "http://localhost:4321",
    "http://127.0.0.1:4321",
    "http://localhost:3004",
    "http://127.0.0.1:3004",
  ];
  return configured.map((value) => {
    const origin = value.trim();
    const parsed = new URL(origin);
    if (
      parsed.origin !== origin ||
      !["http:", "https:"].includes(parsed.protocol)
    ) {
      throw new Error(`Invalid CORS origin: ${origin}`);
    }
    return origin;
  });
};
