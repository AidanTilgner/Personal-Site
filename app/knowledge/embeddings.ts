import OpenAI from "openai";

export const EMBEDDING_MODEL =
  process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-small";
export const EMBEDDING_DIMENSIONS = Number(
  process.env.OPENAI_EMBEDDING_DIMENSIONS ?? 1_536,
);

let client: OpenAI | undefined;

const getClient = () => {
  if (!process.env.OPENAI_API_KEY || process.env.NODE_ENV === "test") return;
  client ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return client;
};

export const embeddingsAvailable = () => !!getClient();

export const embedTexts = async (texts: string[]) => {
  if (!texts.length) return [];
  const openai = getClient();
  if (!openai) return undefined;
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    dimensions: EMBEDDING_DIMENSIONS,
    input: texts,
    encoding_format: "float",
  });
  return response.data
    .sort((a, b) => a.index - b.index)
    .map((item) => item.embedding);
};
