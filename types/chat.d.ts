import type { Block } from "./blocks";
import type { Message } from "./conversation";

export interface ChatRequest {
  type: "chat.request";
  requestId: string;
  conversation: Message[];
}

export type ChatServerMessage =
  | {
      type: "content.blocks";
      requestId: string;
      blocks: Block[];
    }
  | {
      type: "assistant.delta";
      requestId: string;
      index: number;
      text: string;
    }
  | {
      type: "assistant.done";
      requestId: string;
      message: string;
    }
  | {
      type: "assistant.suggestions";
      requestId: string;
      suggestions: string[];
    }
  | {
      type: "error";
      requestId: string;
      code:
        | "INVALID_REQUEST"
        | "RATE_LIMITED"
        | "SERVER_BUSY"
        | "MONTHLY_BUDGET_REACHED"
        | "RESPONSE_GENERATION_FAILED";
      message: string;
    };
