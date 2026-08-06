import type { Block } from "../../types/blocks";
import type { ChatServerMessage } from "../../types/chat";
import type { Message } from "../../types/conversation";

const errorCodes = new Set([
  "INVALID_REQUEST",
  "RATE_LIMITED",
  "SERVER_BUSY",
  "RESPONSE_GENERATION_FAILED",
]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const isBlock = (value: unknown): value is Block =>
  isRecord(value) &&
  typeof value.id === "string" &&
  typeof value.name === "string" &&
  typeof value.description === "string" &&
  isRecord(value.content) &&
  (value.content.type === "raw" || value.content.type === "url") &&
  typeof value.content.data === "string" &&
  (value.aliases === undefined ||
    (Array.isArray(value.aliases) &&
      value.aliases.every((alias) => typeof alias === "string")));

export const parseChatServerMessage = (
  value: unknown,
): ChatServerMessage | undefined => {
  let message = value;
  if (typeof value === "string") {
    try {
      message = JSON.parse(value) as unknown;
    } catch {
      return;
    }
  }
  if (
    !isRecord(message) ||
    typeof message.type !== "string" ||
    typeof message.requestId !== "string"
  ) {
    return;
  }
  if (
    message.type === "content.blocks" &&
    Array.isArray(message.blocks) &&
    message.blocks.every(isBlock)
  ) {
    return message as unknown as ChatServerMessage;
  }
  if (
    message.type === "assistant.delta" &&
    typeof message.index === "number" &&
    Number.isInteger(message.index) &&
    message.index >= 0 &&
    typeof message.text === "string"
  ) {
    return message as unknown as ChatServerMessage;
  }
  if (
    message.type === "assistant.done" &&
    typeof message.message === "string"
  ) {
    return message as unknown as ChatServerMessage;
  }
  if (
    message.type === "error" &&
    typeof message.code === "string" &&
    errorCodes.has(message.code) &&
    typeof message.message === "string"
  ) {
    return message as unknown as ChatServerMessage;
  }
};

export const parseStoredConversation = (value: string | null): Message[] => {
  if (!value?.startsWith("[")) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (message): message is Message =>
        isRecord(message) &&
        (message.role === "assistant" || message.role === "user") &&
        typeof message.content === "string",
    );
  } catch {
    return [];
  }
};

export const trimConversation = (messages: Message[]) => {
  const kept: Message[] = [];
  let characters = 0;
  for (const message of messages.slice(-20).reverse()) {
    if (characters + message.content.length > 16_000 && kept.length) break;
    kept.push(message);
    characters += message.content.length;
  }
  return kept.reverse();
};

export const getChatWebSocketURL = () => {
  const backendURL = import.meta.env.PUBLIC_BACKEND_URL;
  if (!backendURL) {
    throw new Error("PUBLIC_BACKEND_URL is required for chat.");
  }

  const url = new URL("/v1/chat", backendURL);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  return url.toString();
};

export const createChatSocket = () => new WebSocket(getChatWebSocketURL());

export const createRequestId = () => crypto.randomUUID();
