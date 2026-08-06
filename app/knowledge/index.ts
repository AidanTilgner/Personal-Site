import { loadKnowledgeDocuments } from "./sources";
import { KnowledgeStore } from "./store";
import type { KnowledgeMatch, KnowledgeStatus } from "./types";

let store: KnowledgeStore | undefined;
let initialization: Promise<KnowledgeStatus> | undefined;
let initializedAt = 0;
const DEFAULT_REFRESH_INTERVAL_MS = 15 * 60 * 1000;
let currentStatus: KnowledgeStatus = {
  ready: false,
  degraded: false,
  documentCount: 0,
  chunkCount: 0,
  embeddedChunkCount: 0,
};

const getStore = () => (store ??= new KnowledgeStore());

const refreshInterval = () => {
  const configured = Number(process.env.KNOWLEDGE_REFRESH_INTERVAL_MS);
  return Number.isFinite(configured) && configured >= 0
    ? configured
    : DEFAULT_REFRESH_INTERVAL_MS;
};

export const initializeKnowledge = async () => {
  if (currentStatus.ready && Date.now() - initializedAt < refreshInterval()) {
    return currentStatus;
  }
  if (initialization) return initialization;

  const run = async () => {
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
    initializedAt = Date.now();
    return currentStatus;
  };
  initialization = run();
  try {
    return await initialization;
  } finally {
    initialization = undefined;
  }
};

export const getKnowledgeStatus = () => currentStatus;

export const retrieveKnowledge = async (
  query: string,
): Promise<KnowledgeMatch[]> => {
  await initializeKnowledge();
  return getStore().search(query);
};

export type { KnowledgeMatch, KnowledgeStatus } from "./types";
