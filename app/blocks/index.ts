import blocksJSON from "./blocks.json";
import type { Block } from "../../types/blocks";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const blocks = blocksJSON as Block[];

export const getBlocks = (query?: string | undefined) => {
  if (query) {
    return getQueriedBlocks(query);
  }
  return getParsedBlocks(blocks);
};

export const getBlock = (id: string) => {
  const block = blocks.find((block) => block.id === id);
  if (!block) {
    return undefined;
  }
  const content = parseBlockContent(block.content.data, block);
  return {
    ...block,
    content: {
      ...block.content,
      data: content,
    },
  } satisfies Block;
};

export const getQueriedBlocks = (query: string) => {
  const parsedBlocks = getParsedBlocks(blocks);
  return parsedBlocks;
};

export const parseContent = (content: string) => {};

export const parseBlockContent = (content: string, block: Block) => {
  const fields: [[string, (b: Block) => string]] = [
    ["{{id}}", (b: Block) => b.id],
  ];
  fields.forEach((field) => {
    content = content.replaceAll(field[0], field[1](block));
  });
  return content;
};

export const getParsedBlocks = (blocks: Block[]) => {
  return blocks.map((block) => {
    return {
      ...block,
      content: {
        ...block.content,
        data: parseBlockContent(block.content.data, block),
      },
    } satisfies Block;
  });
};

export const getBlockFile = (filename: string) => {
  return readFileSync(
    path.join(__dirname, `../public/blocks/${filename}`),
    "utf-8"
  ).toString();
};
