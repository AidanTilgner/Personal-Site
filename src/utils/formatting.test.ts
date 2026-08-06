import { describe, expect, test } from "bun:test";
import { getPrettyDate } from "./formatting";

describe("date formatting", () => {
  test("does not shift a date-only value across time zones", () => {
    expect(getPrettyDate("2025-02-03")).toBe("Monday, Feb 3, 2025");
  });
});
