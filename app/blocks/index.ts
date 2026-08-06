import blocksJSON from "./blocks.json";
import type { Block } from "../../types/blocks";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import {
  getKnowledgeStatus,
  initializeKnowledge,
  retrieveKnowledge,
  type KnowledgeMatch,
} from "../knowledge";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const blocks = blocksJSON as Block[];

const escapeHTML = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const metadataString = (metadata: Record<string, unknown>, key: string) =>
  typeof metadata[key] === "string" ? metadata[key] : undefined;

const metadataStrings = (metadata: Record<string, unknown>, key: string) =>
  Array.isArray(metadata[key])
    ? metadata[key].filter(
        (value): value is string => typeof value === "string",
      )
    : [];

export type PreviewFraming = {
  relevance?: string;
  summary?: string;
};

export const createPreviewBlock = (
  match: KnowledgeMatch,
  framing: PreviewFraming = {},
): Block | undefined => {
  const { document } = match;
  if (document.sourceType !== "project" && document.sourceType !== "blog") {
    return;
  }

  const isProject = document.sourceType === "project";
  const slug =
    metadataString(document.metadata, "slug") ??
    document.id.slice(document.id.indexOf(":") + 1);
  const href = isProject ? `/projects/${slug}` : `/blog/posts/${slug}`;
  const authoredDescription =
    metadataString(document.metadata, "description") ??
    document.content.replace(/\s+/g, " ").slice(0, 220);
  const description = framing.summary ?? authoredDescription;
  const tags = metadataStrings(document.metadata, "tags").slice(0, 5);
  const status = isProject
    ? metadataString(document.metadata, "status")
    : metadataString(document.metadata, "postdate");
  const label = isProject ? "Project" : "Writing";
  const tagMarkup = tags.length
    ? `<ul class="retrieval-preview__tags" aria-label="Topics">${tags
        .map((tag) => `<li>${escapeHTML(tag)}</li>`)
        .join("")}</ul>`
    : "";
  const statusMarkup = status ? `<span>${escapeHTML(status)}</span>` : "";
  const relevanceMarkup = framing.relevance
    ? `<p class="retrieval-preview__relevance">${escapeHTML(framing.relevance)}</p>`
    : "";

  return {
    id: `preview:${document.id}`,
    name: document.title,
    description,
    kind: isProject ? "project-preview" : "blog-preview",
    href,
    aliases: document.aliases,
    content: {
      type: "raw",
      data: `<article class="retrieval-preview">
  <div class="retrieval-preview__meta"><span>${label}</span>${statusMarkup}</div>
  <h2><a href="${escapeHTML(href)}">${escapeHTML(document.title)}</a></h2>
  ${relevanceMarkup}
  <p>${escapeHTML(description)}</p>
  ${tagMarkup}
  <a class="retrieval-preview__action" href="${escapeHTML(href)}">Open ${isProject ? "case study" : "article"}<span aria-hidden="true">↗</span></a>
</article>`,
    },
  };
};

export const initializeBlocks = async () => {
  await initializeKnowledge();
};

export const areBlocksReady = () => getKnowledgeStatus().ready;

export const getBlocks = async (
  query?: string | undefined,
  matches?: KnowledgeMatch[],
) => {
  await initializeBlocks();
  if (query) {
    const blks = await getQueriedBlocks(query, matches);
    if (!blks.length) {
      return [getFallbackBlock()];
    }
    return blks;
  }
  const blks = await getParsedBlocks(blocks);
  if (!blks.length) {
    return [getFallbackBlock()];
  }
  return blks;
};

export const getBlock = async (id: string) => {
  if (id === "fallback-block") {
    return getFallbackBlock();
  }
  const block = blocks.find((block) => block.id === id);
  if (!block) {
    return undefined;
  }
  const content = await parseBlockContent(block.content.data, block);
  return {
    ...block,
    content: {
      ...block.content,
      data: content,
    },
  } satisfies Block;
};

export const getQueriedBlocks = async (
  query: string,
  matches?: KnowledgeMatch[],
) => {
  const parsedBlocks = await getParsedBlocks(blocks);
  const retrieval = matches ?? (await retrieveKnowledge(query));
  const previewBlocks = retrieval
    .filter((match) => !match.document.blockId)
    .map((match) => createPreviewBlock(match))
    .filter((block): block is Block => !!block);
  const blockIds = retrieval
    .map((match) => match.document.blockId)
    .filter((blockId): blockId is string => !!blockId);
  const explicitBlocks = [...new Set(blockIds)]
    .map((blockId) => parsedBlocks.find((block) => block.id === blockId))
    .filter((block): block is Block => !!block);
  return [...previewBlocks, ...explicitBlocks].filter(
    (block, index, selected) =>
      selected.findIndex((candidate) => candidate.id === block.id) === index,
  );
};

export const parseBlockContent = async (content: string, block: Block) => {
  const fields: [[string, (b: Block) => string]] = [
    ["{{id}}", (b: Block) => b.id],
  ];
  fields.forEach((field) => {
    content = content.replaceAll(field[0], field[1](block));
  });
  return content;
};

export const getParsedBlocks = async (blocks: Block[]) => {
  const ps = blocks.map(async (block) => {
    return {
      ...block,
      content: {
        ...block.content,
        data: await parseBlockContent(block.content.data, block),
      },
    } satisfies Block;
  });
  return Promise.all(ps);
};

export const getBlockFile = (filename: string) => {
  if (path.basename(filename) !== filename) return undefined;
  try {
    return readFileSync(
      path.join(__dirname, `../public/blocks/${filename}`),
      "utf-8",
    ).toString();
  } catch {
    return undefined;
  }
};

export const getFallbackBlock = () => {
  const fallback = {
    id: "fallback-block",
    name: "fallback",
    description: "A fallback block when no other block is found.",
    content: {
      type: "url" as const,
      data: "[SELF_BLOCK_FILE]",
    },
    aliases: [],
  };
  return fallback satisfies Block;
};
