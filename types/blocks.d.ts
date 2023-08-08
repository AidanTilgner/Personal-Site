type ContentTypes = "raw" | "url";

export interface Block {
  id: string;
  name: string;
  content: {
    type: ContentTypes;
    data: string;
  };
}
