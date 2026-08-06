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
        generateSuggestions: async () => [
          "What decisions shaped this work?",
          "Which capabilities does it demonstrate?",
          "How could we work together?",
        ],
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
      "assistant.suggestions",
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

  test("keeps authored previews when optional tuning fails", async () => {
    const preview: Block = {
      ...block,
      id: "preview:project:test",
      kind: "project-preview",
      href: "/projects/test",
      description: "Authored preview",
    };
    const previewErrors: unknown[] = [];
    const messages: ChatServerMessage[] = [];

    await processChatRequest(
      request,
      (message) => messages.push(message),
      undefined,
      {
        retrieveContext: async () => [],
        selectBlocks: async () => [preview],
        tuneBlocks: async () => {
          throw new Error("Provider unavailable");
        },
        reportPreviewError: (error) => previewErrors.push(error),
        generateSuggestions: async () => [],
        streamResponse: async (_blocks, _conversation, callbacks) => {
          callbacks.onDone("Still answered");
        },
      },
    );

    expect(previewErrors).toHaveLength(1);
    expect(messages[0]).toEqual({
      type: "content.blocks",
      requestId: "request-1",
      blocks: [preview],
    });
    expect(messages.map((message) => message.type)).toEqual([
      "content.blocks",
      "assistant.done",
      "assistant.suggestions",
    ]);
  });

  test("keeps the completed answer when optional suggestions fail", async () => {
    const suggestionErrors: unknown[] = [];
    const messages: ChatServerMessage[] = [];

    await processChatRequest(
      request,
      (message) => messages.push(message),
      undefined,
      {
        retrieveContext: async () => [],
        selectBlocks: async () => [block],
        generateSuggestions: async () => {
          throw new Error("Provider unavailable");
        },
        reportSuggestionError: (error) => suggestionErrors.push(error),
        streamResponse: async (_blocks, _conversation, callbacks) => {
          callbacks.onDone("Still answered");
        },
      },
    );

    expect(suggestionErrors).toHaveLength(1);
    expect(messages.at(-1)).toEqual({
      type: "assistant.suggestions",
      requestId: "request-1",
      suggestions: [],
    });
  });
});
