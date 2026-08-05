import { Elysia } from "elysia";
import { getBlocks } from "../blocks";
import { streamBlockResponse } from "../gpt";
import { retrieveKnowledge } from "../knowledge";
import { getChatLimits } from "../config/env";
import { createFixedWindowRateLimiter } from "../utils/rate-limit";
import type { ChatRequest, ChatServerMessage } from "../../types/chat";
import { ChatRequestSchema, ChatServerMessageSchema } from "./schemas";

type SendMessage = (message: ChatServerMessage) => void;

export type ChatDependencies = {
  selectBlocks?: typeof getBlocks;
  retrieveContext?: typeof retrieveKnowledge;
  streamResponse?: typeof streamBlockResponse;
  reportError?: (error: unknown) => void;
};

export const processChatRequest = async (
  request: ChatRequest,
  send: SendMessage,
  signal?: AbortSignal,
  dependencies: ChatDependencies = {},
) => {
  const selectBlocks = dependencies.selectBlocks ?? getBlocks;
  const retrieveContext = dependencies.retrieveContext ?? retrieveKnowledge;
  const streamResponse = dependencies.streamResponse ?? streamBlockResponse;
  const reportError =
    dependencies.reportError ??
    ((error) => console.error("Chat response failed.", error));
  const query = request.conversation.at(-1)?.content;

  if (!query) {
    send({
      type: "error",
      requestId: request.requestId,
      code: "INVALID_REQUEST",
      message: "Conversation must contain a message.",
    });
    return;
  }

  try {
    const knowledge = await retrieveContext(query);
    if (signal?.aborted) return;
    const blocks = await selectBlocks(query, knowledge);
    if (signal?.aborted) return;

    send({
      type: "content.blocks",
      requestId: request.requestId,
      blocks,
    });
    if (signal?.aborted) return;

    await streamResponse(
      blocks,
      request.conversation,
      {
        signal,
        onDelta: (text, index) => {
          if (!signal?.aborted) {
            send({
              type: "assistant.delta",
              requestId: request.requestId,
              index,
              text,
            });
          }
        },
        onDone: (message) => {
          if (!signal?.aborted) {
            send({
              type: "assistant.done",
              requestId: request.requestId,
              message,
            });
          }
        },
      },
      knowledge,
    );
  } catch (error) {
    reportError(error);
    if (!signal?.aborted) {
      send({
        type: "error",
        requestId: request.requestId,
        code: "RESPONSE_GENERATION_FAILED",
        message: "Something went wrong.",
      });
    }
  }
};

export const chatRoutes = (allowedOrigins: string[]) => {
  const activeResponses = new Map<string, AbortController>();
  const { requestsPerMinute, maxConcurrent } = getChatLimits();
  const rateLimiter = createFixedWindowRateLimiter({
    limit: requestsPerMinute,
    windowMs: 60_000,
  });

  return new Elysia().ws("/v1/chat", {
    body: ChatRequestSchema,
    response: ChatServerMessageSchema,
    open(ws) {
      const origin = ws.data.request.headers.get("origin");
      if (!origin || !allowedOrigins.includes(origin)) {
        ws.close(1008, "Origin is not allowed.");
      }
    },
    async message(ws, message) {
      const origin = ws.data.request.headers.get("origin");
      if (!origin || !allowedOrigins.includes(origin)) {
        ws.close(1008, "Origin is not allowed.");
        return;
      }

      const address = ws.remoteAddress || "unknown";
      if (!rateLimiter.allow(address)) {
        ws.send({
          type: "error",
          requestId: message.requestId,
          code: "RATE_LIMITED",
          message: "Please wait a moment before asking another question.",
        });
        return;
      }

      const previous = activeResponses.get(ws.id);
      if (previous) {
        previous.abort();
        activeResponses.delete(ws.id);
      }
      if (activeResponses.size >= maxConcurrent) {
        ws.send({
          type: "error",
          requestId: message.requestId,
          code: "SERVER_BUSY",
          message: "The guide is busy right now. Please try again shortly.",
        });
        return;
      }

      const controller = new AbortController();
      activeResponses.set(ws.id, controller);

      await processChatRequest(
        message,
        (event) => {
          ws.send(event);
        },
        controller.signal,
      ).finally(() => {
        if (activeResponses.get(ws.id) === controller) {
          activeResponses.delete(ws.id);
        }
      });
    },
    close(ws) {
      activeResponses.get(ws.id)?.abort();
      activeResponses.delete(ws.id);
    },
  });
};
