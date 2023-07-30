export interface Message {
  role: "assistant" | "user" | "system";
  content: string;
}
