export interface BlogPost {
  title: string;
  author: string;
  description: string;
  postdate: string;
  updatedate?: string;
  tags: string[];
  url?: string;
  image?: string;
  draft?: boolean;
  source?: "local" | "substack";
  sourceLabel?: string;
  canonicalUrl?: string;
  audioUrl?: string;
  thumbnailUrl?: string;
}
