import { loadKnowledgeDocuments } from "./sources";
import { KnowledgeStore } from "./store";
import type { KnowledgeMatch, KnowledgeStatus } from "./types";

let store: KnowledgeStore | undefined;
let initialization: Promise<KnowledgeStatus> | undefined;
let currentStatus: KnowledgeStatus = {
  ready: false,
  degraded: false,
  documentCount: 0,
  chunkCount: 0,
  embeddedChunkCount: 0,
};

const getStore = () => (store ??= new KnowledgeStore());

export const initializeKnowledge = async () => {
  initialization ??= (async () => {
    try {
      currentStatus = await getStore().synchronize(
        await loadKnowledgeDocuments(),
      );
    } catch (error) {
      const previous = getStore().status();
      currentStatus = {
        ...previous,
        degraded: true,
        message:
          error instanceof Error
            ? `Knowledge synchronization failed: ${error.message}`
            : "Knowledge synchronization failed.",
      };
      if (!previous.ready) throw error;
      console.warn(currentStatus.message);
    }
    return currentStatus;
  })().catch((error) => {
    initialization = undefined;
    throw error;
  });
  return initialization;
};

export const getKnowledgeStatus = () => currentStatus;

export const retrieveKnowledge = async (
  query: string,
): Promise<KnowledgeMatch[]> => {
  await initializeKnowledge();
  return getStore().search(query);
};

export type { KnowledgeMatch, KnowledgeStatus } from "./types";
