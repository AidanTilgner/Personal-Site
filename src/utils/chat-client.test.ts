import { describe, expect, test } from "bun:test";
import {
  parseChatServerMessage,
  parseStoredConversation,
  trimConversation,
} from "./chat-client";

describe("chat client validation", () => {
  test("accepts a valid server event", () => {
    expect(
      parseChatServerMessage(
        JSON.stringify({
          type: "assistant.delta",
          requestId: "request-1",
          index: 0,
          text: "Hello",
        }),
      ),
    ).toEqual({
      type: "assistant.delta",
      requestId: "request-1",
      index: 0,
      text: "Hello",
    });
  });

  test("rejects malformed and unknown events", () => {
    expect(parseChatServerMessage("not json")).toBeUndefined();
    expect(
      parseChatServerMessage({
        type: "assistant.delta",
        requestId: "request-1",
        index: -1,
        text: "Hello",
      }),
    ).toBeUndefined();
  });

  test("validates and bounds stored conversation history", () => {
    const stored = JSON.stringify([
      { role: "user", content: "valid" },
      { role: "system", content: "discard" },
      { role: "assistant", content: "also valid" },
    ]);
    expect(parseStoredConversation(stored)).toHaveLength(2);
    expect(
      trimConversation(
        Array.from({ length: 30 }, (_, index) => ({
          role: "user" as const,
          content: String(index),
        })),
      ),
    ).toHaveLength(20);
  });
});
