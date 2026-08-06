import { Elysia } from "elysia";
import { getBlocks } from "../blocks";
import {
  generateFollowUpSuggestions,
  streamBlockResponse,
  tunePreviewBlocks,
} from "../gpt";
import { retrieveKnowledge } from "../knowledge";
import { getChatLimits } from "../config/env";
import { createFixedWindowRateLimiter } from "../utils/rate-limit";
import { isAIBudgetExceeded } from "../utils/ai-budget";
import type { ChatRequest, ChatServerMessage } from "../../types/chat";
import { ChatRequestSchema, ChatServerMessageSchema } from "./schemas";

type SendMessage = (message: ChatServerMessage) => void;

export type ChatDependencies = {
  selectBlocks?: typeof getBlocks;
  retrieveContext?: typeof retrieveKnowledge;
  streamResponse?: typeof streamBlockResponse;
  tuneBlocks?: typeof tunePreviewBlocks;
  generateSuggestions?: typeof generateFollowUpSuggestions;
  reportError?: (error: unknown) => void;
  reportPreviewError?: (error: unknown) => void;
  reportSuggestionError?: (error: unknown) => void;
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
  const tuneBlocks = dependencies.tuneBlocks ?? tunePreviewBlocks;
  const generateSuggestions =
    dependencies.generateSuggestions ?? generateFollowUpSuggestions;
  const reportError =
    dependencies.reportError ??
    ((error) => console.error("Chat response failed.", error));
  const reportPreviewError =
    dependencies.reportPreviewError ??
    ((error) =>
      console.warn("Preview tuning failed; using authored copy.", error));
  const reportSuggestionError =
    dependencies.reportSuggestionError ??
    ((error) =>
      console.warn("Follow-up generation failed; using defaults.", error));
  const query = request.conversation.at(-1)?.content;
  const conversationCharacters = request.conversation.reduce(
    (total, message) => total + message.content.length,
    0,
  );

  if (!query || conversationCharacters > 16_000) {
    send({
      type: "error",
      requestId: request.requestId,
      code: "INVALID_REQUEST",
      message:
        conversationCharacters > 16_000
          ? "Conversation history is too large. Clear the conversation and try again."
          : "Conversation must contain a message.",
    });
    return;
  }

  try {
    const knowledge = await retrieveContext(query);
    if (signal?.aborted) return;
    let blocks = await selectBlocks(query, knowledge);
    if (signal?.aborted) return;

    try {
      blocks = await tuneBlocks(query, blocks, knowledge, signal);
    } catch (error) {
      reportPreviewError(error);
    }
    if (signal?.aborted) return;

    send({
      type: "content.blocks",
      requestId: request.requestId,
      blocks,
    });
    if (signal?.aborted) return;

    let completedMessage = "";
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
            completedMessage = message;
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
    if (signal?.aborted || !completedMessage) return;

    let suggestions: string[] = [];
    try {
      suggestions = await generateSuggestions(
        request.conversation,
        completedMessage,
        knowledge,
        signal,
      );
    } catch (error) {
      reportSuggestionError(error);
    }
    if (!signal?.aborted) {
      send({
        type: "assistant.suggestions",
        requestId: request.requestId,
        suggestions,
      });
    }
  } catch (error) {
    reportError(error);
    if (!signal?.aborted) {
      send({
        type: "error",
        requestId: request.requestId,
        code: isAIBudgetExceeded(error)
          ? "MONTHLY_BUDGET_REACHED"
          : "RESPONSE_GENERATION_FAILED",
        message: isAIBudgetExceeded(error)
          ? "Cosmo has reached this month's conversation budget. Please try again next month."
          : "Something went wrong.",
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
