import { createHash } from "node:crypto";
import type { KnowledgeChunk, KnowledgeDocument } from "./types";

const SECTION_SIZE = 6_000;
const SECTION_OVERLAP = 750;
const DOCUMENT_EMBEDDING_LIMIT = 16_000;
export const CHUNKER_VERSION = "1";

export const hashContent = (content: string) =>
  createHash("sha256").update(content).digest("hex");

const findSectionEnd = (content: string, target: number) => {
  const nextHeading = content.indexOf("\n#", target);
  if (nextHeading !== -1 && nextHeading <= target + 1_000) return nextHeading;
  const nextParagraph = content.indexOf("\n\n", target);
  if (nextParagraph !== -1 && nextParagraph <= target + 1_000) {
    return nextParagraph;
  }
  return Math.min(target, content.length);
};

const getHeading = (content: string) => {
  const headings = [...content.matchAll(/^#{1,6}\s+(.+)$/gm)];
  return headings.at(-1)?.[1]?.trim();
};

export const chunkDocument = (
  document: KnowledgeDocument,
): KnowledgeChunk[] => {
  const prefix = [document.title, document.aliases.join(", ")]
    .filter(Boolean)
    .join("\n");
  const fullContent = `${prefix}\n\n${document.content}`.trim();
  const chunks: KnowledgeChunk[] = [];

  const addChunk = (
    idSuffix: string,
    ordinal: number,
    content: string,
    heading?: string,
  ) => {
    const normalized = content.trim();
    chunks.push({
      id: `${document.id}:${idSuffix}`,
      documentId: document.id,
      ordinal,
      heading,
      content: normalized,
      contentHash: hashContent(normalized),
    });
  };

  addChunk(
    "document",
    0,
    fullContent.slice(0, DOCUMENT_EMBEDDING_LIMIT),
    document.title,
  );

  if (fullContent.length <= SECTION_SIZE) return chunks;

  let start = 0;
  let ordinal = 1;
  while (start < fullContent.length) {
    const target = Math.min(start + SECTION_SIZE, fullContent.length);
    const end = findSectionEnd(fullContent, target);
    const content = fullContent.slice(start, end);
    addChunk(`section:${ordinal}`, ordinal, content, getHeading(content));
    if (end >= fullContent.length) break;
    start = Math.max(start + 1, end - SECTION_OVERLAP);
    ordinal += 1;
  }

  return chunks;
};
