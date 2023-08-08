import blocksJSON from "./blocks.json";
import type { Block } from "../../types/blocks";

const blocks = blocksJSON as Block[];

export const getBlocks = (query?: string | undefined) => {
  if (query) {
    return getQueriedBlocks(query);
  }
  return blocks;
};

export const getBlock = (id: string) => {
  return blocks.find((block) => block.id === id);
};

export const getQueriedBlocks = (query: string) => {
  return blocks;
};
