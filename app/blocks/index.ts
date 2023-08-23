import blocksJSON from "./blocks.json";
import type { Block } from "../../types/blocks";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { train, processQuery, getClassificationFilteredBlocks } from "./nlp";
import { generateMetaData } from "./metadata";

await train().then(() => {
  generateMetaData();
});

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const blocks = blocksJSON as Block[];

export const getBlocks = async (query?: string | undefined) => {
  if (query) {
    const blks = await getQueriedBlocks(query);
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

export const getQueriedBlocks = async (query: string) => {
  const parsedBlocks = await getParsedBlocks(blocks);
  const { classifications } = await processQuery(query);
  const filteredBlocks = await getClassificationFilteredBlocks(
    parsedBlocks,
    classifications,
  );
  return filteredBlocks;
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
  return readFileSync(
    path.join(__dirname, `../public/blocks/${filename}`),
    "utf-8",
  ).toString();
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
    when_intents: ["None"],
  };
  return fallback satisfies Block;
};
