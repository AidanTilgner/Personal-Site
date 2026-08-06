import OpenAI from "openai";
import type { Message } from "../../types/conversation";

const MODEL = process.env.OPENAI_CHAT_MODEL ?? "gpt-5.6-luna";
let client: OpenAI | undefined;

const getClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is required for assistant responses.");
  }
  client ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return client;
};

export const createAssistantResponseStream = async ({
  instructions,
  conversation,
  signal,
}: {
  instructions: string;
  conversation: Message[];
  signal?: AbortSignal;
}) =>
  getClient().responses.create(
    {
      model: MODEL,
      instructions,
      input: conversation
        .filter((message) => message.role !== "system")
        .map((message) => ({
          role: message.role as "assistant" | "user",
          content: message.content,
        })),
      reasoning: {
        effort: "low",
        // Browser persistence replays visible messages, not encrypted reasoning items.
        context: "current_turn",
      },
      text: { verbosity: "low" },
      store: false,
      stream: true,
    },
    { signal },
  );

export const createPreviewTuningResponse = async ({
  instructions,
  input,
  documentIds,
  signal,
}: {
  instructions: string;
  input: string;
  documentIds: string[];
  signal?: AbortSignal;
}) =>
  getClient().responses.create(
    {
      model: MODEL,
      instructions,
      input,
      reasoning: { effort: "low" },
      max_output_tokens: 800,
      store: false,
      text: {
        verbosity: "low",
        format: {
          type: "json_schema",
          name: "preview_tuning",
          strict: true,
          schema: {
            type: "object",
            properties: {
              previews: {
                type: "array",
                minItems: documentIds.length,
                maxItems: documentIds.length,
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string", enum: documentIds },
                    relevance: { type: "string", maxLength: 100 },
                    summary: { type: "string", maxLength: 280 },
                  },
                  required: ["id", "relevance", "summary"],
                  additionalProperties: false,
                },
              },
            },
            required: ["previews"],
            additionalProperties: false,
          },
        },
      },
    },
    { signal },
  );

export const createFollowUpSuggestionResponse = async ({
  instructions,
  input,
  signal,
}: {
  instructions: string;
  input: string;
  signal?: AbortSignal;
}) =>
  getClient().responses.create(
    {
      model: MODEL,
      instructions,
      input,
      reasoning: { effort: "low" },
      max_output_tokens: 300,
      store: false,
      text: {
        verbosity: "low",
        format: {
          type: "json_schema",
          name: "follow_up_questions",
          strict: true,
          schema: {
            type: "object",
            properties: {
              questions: {
                type: "array",
                minItems: 3,
                maxItems: 3,
                items: { type: "string", maxLength: 120 },
              },
            },
            required: ["questions"],
            additionalProperties: false,
          },
        },
      },
    },
    { signal },
  );
