export type KnowledgeSourceType = "markdown" | "project" | "block" | "profile";

export interface KnowledgeDocument {
  id: string;
  sourceType: KnowledgeSourceType;
  path: string;
  title: string;
  content: string;
  aliases: string[];
  blockId?: string;
  metadata: Record<string, unknown>;
}

export interface KnowledgeChunk {
  id: string;
  documentId: string;
  ordinal: number;
  heading?: string;
  content: string;
  contentHash: string;
}

export interface KnowledgeMatch {
  document: KnowledgeDocument;
  matchedContent: string;
  score: number;
  lexicalScore: number;
  vectorScore?: number;
}

export interface KnowledgeStatus {
  ready: boolean;
  degraded: boolean;
  documentCount: number;
  chunkCount: number;
  embeddedChunkCount: number;
  message?: string;
}
