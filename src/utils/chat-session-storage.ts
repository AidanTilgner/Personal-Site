import type { Block } from "../../types/blocks";
import type { Message } from "../../types/conversation";
import {
  isBlock,
  parseStoredConversation,
  trimConversation,
} from "./chat-client";

export const ASSISTANT_SESSION_KEY = "cosmo-assistant-session-v1";
export const ASSISTANT_SESSION_MAX_AGE = 12 * 60 * 60 * 1_000;

export interface AssistantSessionV1 {
  version: 1;
  conversation: Message[];
  latestQuestion: string | null;
  assistantMessage: string;
  blocks: Block[];
  panelOpen: boolean;
  updatedAt: number;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const parseAssistantSession = (
  value: string | null,
  now = Date.now(),
): AssistantSessionV1 | undefined => {
  if (!value?.startsWith("{")) return;

  try {
    const parsed = JSON.parse(value) as unknown;
    if (
      !isRecord(parsed) ||
      parsed.version !== 1 ||
      typeof parsed.updatedAt !== "number" ||
      now - parsed.updatedAt > ASSISTANT_SESSION_MAX_AGE ||
      now < parsed.updatedAt ||
      typeof parsed.assistantMessage !== "string" ||
      (parsed.latestQuestion !== null &&
        typeof parsed.latestQuestion !== "string") ||
      typeof parsed.panelOpen !== "boolean" ||
      !Array.isArray(parsed.blocks) ||
      !parsed.blocks.every(isBlock) ||
      !Array.isArray(parsed.conversation)
    ) {
      return;
    }

    const conversation = trimConversation(
      parseStoredConversation(JSON.stringify(parsed.conversation)),
    );

    return {
      version: 1,
      conversation,
      latestQuestion: parsed.latestQuestion,
      assistantMessage: parsed.assistantMessage,
      blocks: parsed.blocks,
      panelOpen: parsed.panelOpen,
      updatedAt: parsed.updatedAt,
    };
  } catch {
    return;
  }
};

export const createAssistantSession = (
  session: Omit<AssistantSessionV1, "version" | "updatedAt">,
  now = Date.now(),
): AssistantSessionV1 => ({
  version: 1,
  ...session,
  conversation: trimConversation(session.conversation),
  updatedAt: now,
});
