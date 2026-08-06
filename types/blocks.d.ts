type ContentTypes = "raw" | "url";

export interface Block {
  id: string;
  name: string;
  description: string;
  kind?: "project-preview" | "blog-preview";
  href?: string;
  content: {
    type: ContentTypes;
    data: string;
  };
  aliases?: string[];
}
