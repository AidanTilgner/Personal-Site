import { describe, expect, test } from "bun:test";
import { createFixedWindowRateLimiter } from "./rate-limit";

describe("fixed-window rate limiter", () => {
  test("rejects excess requests and recovers after the window", () => {
    let currentTime = 1_000;
    const limiter = createFixedWindowRateLimiter({
      limit: 2,
      windowMs: 60_000,
      now: () => currentTime,
    });

    expect(limiter.allow("visitor")).toBe(true);
    expect(limiter.allow("visitor")).toBe(true);
    expect(limiter.allow("visitor")).toBe(false);
    expect(limiter.allow("someone-else")).toBe(true);

    currentTime += 60_001;
    expect(limiter.allow("visitor")).toBe(true);
  });
});
