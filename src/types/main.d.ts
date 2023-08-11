export interface Message {
  role: "assistant" | "user" | "system";
  content: string;
}

export interface BlogPost {
  title: string;
  author: string;
  description: string;
  postdate: string;
  updatedate: string;
  tags: string[];
  url?: string;
  image?: string;
}
