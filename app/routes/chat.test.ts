import { describe, expect, test } from "bun:test";
import type { Block } from "../../types/blocks";
import type { ChatRequest, ChatServerMessage } from "../../types/chat";
import { processChatRequest } from "./chat";

const block: Block = {
  id: "test-block",
  name: "test",
  description: "Test block",
  content: { type: "raw", data: "test" },
  aliases: ["testing"],
};

const request: ChatRequest = {
  type: "chat.request",
  requestId: "request-1",
  conversation: [{ role: "user", content: "Test." }],
};

describe("chat protocol", () => {
  test("orders block, delta, and completion messages by request ID", async () => {
    const messages: ChatServerMessage[] = [];

    await processChatRequest(
      request,
      (message) => messages.push(message),
      undefined,
      {
        retrieveContext: async () => [],
        selectBlocks: async () => [block],
        streamResponse: async (_blocks, _conversation, callbacks) => {
          callbacks.onDelta("Hello ", 0);
          callbacks.onDelta("there", 1);
          callbacks.onDone("Hello there");
        },
      },
    );

    expect(messages.map((message) => message.type)).toEqual([
      "content.blocks",
      "assistant.delta",
      "assistant.delta",
      "assistant.done",
    ]);
    expect(messages.every((message) => message.requestId === "request-1")).toBe(
      true,
    );
  });

  test("stops sending after cancellation", async () => {
    const controller = new AbortController();
    const messages: ChatServerMessage[] = [];

    await processChatRequest(
      request,
      (message) => {
        messages.push(message);
        controller.abort();
      },
      controller.signal,
      {
        retrieveContext: async () => [],
        selectBlocks: async () => [block],
        streamResponse: async () => {
          throw new Error("Streaming should not begin after cancellation.");
        },
      },
    );

    expect(messages.map((message) => message.type)).toEqual(["content.blocks"]);
  });

  test("keeps selected blocks and returns a typed generation error", async () => {
    const messages: ChatServerMessage[] = [];

    await processChatRequest(
      request,
      (message) => messages.push(message),
      undefined,
      {
        retrieveContext: async () => [],
        selectBlocks: async () => [block],
        streamResponse: async () => {
          throw new Error("Provider unavailable");
        },
        reportError: () => undefined,
      },
    );

    expect(messages.map((message) => message.type)).toEqual([
      "content.blocks",
      "error",
    ]);
    expect(messages.at(-1)).toEqual({
      type: "error",
      requestId: "request-1",
      code: "RESPONSE_GENERATION_FAILED",
      message: "Something went wrong.",
    });
  });
});
