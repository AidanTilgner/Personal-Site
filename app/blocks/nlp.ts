import { dockStart } from "@nlpjs/basic";
import { fileURLToPath } from "url";
import path from "path";
import blocksJSON from "./blocks.json";
import type { Block } from "../../types/blocks";
import { readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const blocks = blocksJSON as Block[];

interface ProcessedResponse {
  locale: string;
  utterance: string;
  localeIso2: string;
  language: string;
  nluAnswer: {
    classifications: { intent: string; score: number }[];
  };
  classifications: { intent: string; score: number }[];
  intent: string;
  score: number;
  domain: string;
  answers: string[];
  answer: string | undefined;
  sentiment: {
    score: number;
    numWords: number;
    numHits: number;
    average: number;
    type: string | undefined;
    locale: string | undefined;
    vote: string;
  };
}

let manager: any = null;

export const train = async () => {
  const dock = await dockStart({
    use: ["Basic"],
  });
  const nlp = dock.get("nlp");
  nlp.settings.autoSave = false;
  nlp.settings.autoLoad = false;
  nlp.settings.log = false;
  await nlp.addCorpus(path.join(__dirname, "intents.json"));
  await nlp.train();
  manager = nlp;
  return nlp;
};

export const processQuery = async (query: string) => {
  if (!manager) {
    await train();
  }
  const response = (await manager.process("en", query)) as ProcessedResponse;
  return response;
};

export const getAllWhenIntents = async () => {
  const when_intents = blocks.map((b) => {
    return [...b.when_intents];
  });
  const flat = when_intents.flat();
  return flat;
};

export const getAllCorpusIntents = async () => {
  const corpus = readFileSync(path.join(__dirname, "intents.json"), "utf-8");
  const intents = JSON.parse(corpus).data.map((d: any) => d.intent);
  return intents;
};

export const getIntentFilteredBlocks = async (
  blocks: Block[],
  intent: string,
) => {
  return blocks.filter((b) => b.when_intents.includes(intent));
};

const CLASSIFICATION_THRESHOLD = 0.51;

export const getClassificationFilteredBlocks = async (
  blocks: Block[],
  classifications: ProcessedResponse["classifications"],
) => {
  // get all the blocks which match one of the classifications
  const intents = classifications
    .filter((c) => c.score >= CLASSIFICATION_THRESHOLD)
    .map((c) => c.intent);
  const filteredBlocks = blocks.filter((b) => {
    return b.when_intents.some((i) => intents.includes(i));
  });
  const sortedBlocks = filteredBlocks.sort((a, b) => {
    const aScore = classifications.find((c) => c.intent === a.id)?.score;
    const bScore = classifications.find((c) => c.intent === b.id)?.score;
    if (!aScore || !bScore) {
      return 0;
    }
    return bScore - aScore;
  });
  return sortedBlocks;
};
