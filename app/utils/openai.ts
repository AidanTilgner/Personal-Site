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
