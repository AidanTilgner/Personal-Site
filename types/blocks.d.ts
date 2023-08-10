type ContentTypes = "raw" | "url";

export interface Block {
  id: string;
  name: string;
  description: string;
  content: {
    type: ContentTypes;
    data: string;
  };
  when_intents: string[];
}
