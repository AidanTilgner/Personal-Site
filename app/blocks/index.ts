import blocksJSON from "./blocks.json";
import type { Block } from "../../types/blocks";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { train, processQuery, getIntentFilteredBlocks } from "./nlp";
import { generateMetaData } from "./metadata";

train();
generateMetaData();

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const blocks = blocksJSON as Block[];

export const getBlocks = async (query?: string | undefined) => {
  if (query) {
    return getQueriedBlocks(query);
  }
  return getParsedBlocks(blocks);
};

export const getBlock = async (id: string) => {
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
  const { intent } = await processQuery(query);
  const filteredBlocks = getIntentFilteredBlocks(parsedBlocks, intent);
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
    "utf-8"
  ).toString();
};
