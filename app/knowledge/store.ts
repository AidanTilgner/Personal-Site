import { Database } from "bun:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CHUNKER_VERSION, chunkDocument, hashContent } from "./chunker";
import {
  EMBEDDING_DIMENSIONS,
  EMBEDDING_MODEL,
  embedTexts,
  embeddingsAvailable,
} from "./embeddings";
import type {
  KnowledgeDocument,
  KnowledgeMatch,
  KnowledgeStatus,
} from "./types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultDatabasePath = path.resolve(__dirname, "../data/knowledge.sqlite");
const MAX_CONTEXT_PER_DOCUMENT = 14_000;
const MAX_MATCHES = 10;

type ChunkRow = {
  id: string;
  document_id: string;
  content: string;
  content_hash: string;
  embedding: Uint8Array | null;
};

type DocumentRow = {
  id: string;
  source_type: KnowledgeDocument["sourceType"];
  path: string;
  title: string;
  content: string;
  aliases: string;
  block_id: string | null;
  metadata: string;
};

const vectorToBytes = (vector: number[]) =>
  new Uint8Array(new Float32Array(vector).buffer);

const bytesToVector = (bytes: Uint8Array) => {
  const copy = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  );
  return new Float32Array(copy);
};

const cosineSimilarity = (left: Float32Array, right: number[]) => {
  if (left.length !== right.length) return undefined;
  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;
  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index];
    leftMagnitude += left[index] ** 2;
    rightMagnitude += right[index] ** 2;
  }
  if (!leftMagnitude || !rightMagnitude) return undefined;
  return dot / Math.sqrt(leftMagnitude * rightMagnitude);
};

const normalize = (value: string) =>
  value
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const lexicalScore = (query: string, document: KnowledgeDocument) => {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return 0;
  const title = normalize(document.title);
  const aliases = document.aliases.map(normalize);
  const content = normalize(document.content);
  if (aliases.includes(normalizedQuery)) return 6;
  if (title === normalizedQuery) return 5;
  let score = 0;
  if (
    aliases.some(
      (alias) =>
        alias.includes(normalizedQuery) || normalizedQuery.includes(alias),
    )
  ) {
    score = Math.max(score, 3.5);
  }
  if (title.includes(normalizedQuery) || normalizedQuery.includes(title)) {
    score = Math.max(score, 3);
  }
  if (content.includes(normalizedQuery)) score = Math.max(score, 2);
  const words = normalizedQuery.split(" ").filter((word) => word.length >= 3);
  if (words.length) {
    const matchedWords = words.filter(
      (word) =>
        title.includes(word) ||
        aliases.some((alias) => alias.includes(word)) ||
        content.includes(word),
    );
    score = Math.max(score, (matchedWords.length / words.length) * 1.25);
  }
  return score;
};

const deserializeDocument = (row: DocumentRow): KnowledgeDocument => ({
  id: row.id,
  sourceType: row.source_type,
  path: row.path,
  title: row.title,
  content: row.content,
  aliases: JSON.parse(row.aliases) as string[],
  blockId: row.block_id ?? undefined,
  metadata: JSON.parse(row.metadata) as Record<string, unknown>,
});

export class KnowledgeStore {
  private database: Database;

  constructor(
    databasePath = process.env.KNOWLEDGE_DB_PATH ?? defaultDatabasePath,
  ) {
    mkdirSync(path.dirname(databasePath), { recursive: true });
    this.database = new Database(databasePath, { strict: true });
    this.database.run("PRAGMA journal_mode = WAL");
    this.database.run("PRAGMA busy_timeout = 5000");
    this.database.run("PRAGMA foreign_keys = ON");
    this.migrate();
  }

  private migrate() {
    this.database.run(`
      CREATE TABLE IF NOT EXISTS knowledge_documents (
        id TEXT PRIMARY KEY,
        source_type TEXT NOT NULL,
        path TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        content_hash TEXT NOT NULL,
        aliases TEXT NOT NULL,
        block_id TEXT,
        metadata TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS knowledge_chunks (
        id TEXT PRIMARY KEY,
        document_id TEXT NOT NULL REFERENCES knowledge_documents(id) ON DELETE CASCADE,
        ordinal INTEGER NOT NULL,
        heading TEXT,
        content TEXT NOT NULL,
        content_hash TEXT NOT NULL,
        embedding BLOB
      );
      CREATE INDEX IF NOT EXISTS knowledge_chunks_document_id
        ON knowledge_chunks(document_id);
      CREATE TABLE IF NOT EXISTS knowledge_index_metadata (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);
  }

  async synchronize(documents: KnowledgeDocument[]): Promise<KnowledgeStatus> {
    const documentIds = documents.map((document) => document.id);
    if (new Set(documentIds).size !== documentIds.length) {
      throw new Error("Knowledge sources contain duplicate document IDs.");
    }
    const chunks = documents.flatMap(chunkDocument);
    const currentChunks = new Map(
      this.database
        .query<ChunkRow, []>(
          "SELECT id, document_id, content, content_hash, embedding FROM knowledge_chunks",
        )
        .all()
        .map((chunk) => [chunk.id, chunk]),
    );
    const indexedModel = this.database
      .query<{ value: string }, [string]>(
        "SELECT value FROM knowledge_index_metadata WHERE key = ?",
      )
      .get("embedding_model")?.value;
    const indexedDimensions = Number(
      this.database
        .query<{ value: string }, [string]>(
          "SELECT value FROM knowledge_index_metadata WHERE key = ?",
        )
        .get("embedding_dimensions")?.value,
    );
    const indexedChunker = this.database
      .query<{ value: string }, [string]>(
        "SELECT value FROM knowledge_index_metadata WHERE key = ?",
      )
      .get("chunker_version")?.value;
    const embeddingConfigurationChanged =
      indexedModel !== EMBEDDING_MODEL ||
      indexedDimensions !== EMBEDDING_DIMENSIONS ||
      indexedChunker !== CHUNKER_VERSION;
    const chunksToEmbed = chunks.filter((chunk) => {
      const current = currentChunks.get(chunk.id);
      return (
        embeddingConfigurationChanged ||
        !current ||
        current.content_hash !== chunk.contentHash ||
        !current.embedding
      );
    });

    const generatedEmbeddings = new Map<string, number[]>();
    if (chunksToEmbed.length && embeddingsAvailable()) {
      const batchSize = 64;
      for (let start = 0; start < chunksToEmbed.length; start += batchSize) {
        const batch = chunksToEmbed.slice(start, start + batchSize);
        const embeddings = await embedTexts(
          batch.map((chunk) => chunk.content),
        );
        if (!embeddings || embeddings.length !== batch.length) {
          throw new Error("Embedding provider returned an incomplete batch.");
        }
        batch.forEach((chunk, index) => {
          generatedEmbeddings.set(chunk.id, embeddings[index]);
        });
      }
    }

    const transaction = this.database.transaction(() => {
      const documentIds = new Set(documents.map((document) => document.id));
      const chunkIds = new Set(chunks.map((chunk) => chunk.id));

      for (const document of documents) {
        this.database.run(
          `INSERT INTO knowledge_documents
            (id, source_type, path, title, content, content_hash, aliases, block_id, metadata)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET
             source_type = excluded.source_type,
             path = excluded.path,
             title = excluded.title,
             content = excluded.content,
             content_hash = excluded.content_hash,
             aliases = excluded.aliases,
             block_id = excluded.block_id,
             metadata = excluded.metadata`,
          [
            document.id,
            document.sourceType,
            document.path,
            document.title,
            document.content,
            hashContent(document.content),
            JSON.stringify(document.aliases),
            document.blockId ?? null,
            JSON.stringify(document.metadata),
          ],
        );
      }

      for (const chunk of chunks) {
        const existing = currentChunks.get(chunk.id);
        const generated = generatedEmbeddings.get(chunk.id);
        const embedding = generated
          ? vectorToBytes(generated)
          : existing?.content_hash === chunk.contentHash &&
              !embeddingConfigurationChanged
            ? existing.embedding
            : null;
        this.database.run(
          `INSERT INTO knowledge_chunks
            (id, document_id, ordinal, heading, content, content_hash, embedding)
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET
             document_id = excluded.document_id,
             ordinal = excluded.ordinal,
             heading = excluded.heading,
             content = excluded.content,
             content_hash = excluded.content_hash,
             embedding = excluded.embedding`,
          [
            chunk.id,
            chunk.documentId,
            chunk.ordinal,
            chunk.heading ?? null,
            chunk.content,
            chunk.contentHash,
            embedding,
          ],
        );
      }

      for (const row of this.database
        .query<{ id: string }, []>("SELECT id FROM knowledge_chunks")
        .all()) {
        if (!chunkIds.has(row.id))
          this.database.run("DELETE FROM knowledge_chunks WHERE id = ?", [
            row.id,
          ]);
      }
      for (const row of this.database
        .query<{ id: string }, []>("SELECT id FROM knowledge_documents")
        .all()) {
        if (!documentIds.has(row.id))
          this.database.run("DELETE FROM knowledge_documents WHERE id = ?", [
            row.id,
          ]);
      }

      if (embeddingsAvailable() || !chunks.length) {
        this.database.run(
          "INSERT OR REPLACE INTO knowledge_index_metadata (key, value) VALUES (?, ?)",
          ["embedding_model", EMBEDDING_MODEL],
        );
        this.database.run(
          "INSERT OR REPLACE INTO knowledge_index_metadata (key, value) VALUES (?, ?)",
          ["embedding_dimensions", String(EMBEDDING_DIMENSIONS)],
        );
        this.database.run(
          "INSERT OR REPLACE INTO knowledge_index_metadata (key, value) VALUES (?, ?)",
          ["chunker_version", CHUNKER_VERSION],
        );
      }
    });
    transaction();
    return this.status();
  }

  async search(query: string): Promise<KnowledgeMatch[]> {
    const documentRows = this.database
      .query<DocumentRow, []>(
        `SELECT id, source_type, path, title, content, aliases, block_id, metadata
         FROM knowledge_documents`,
      )
      .all();
    const documents = new Map(
      documentRows.map((row) => {
        const document = deserializeDocument(row);
        return [document.id, document];
      }),
    );
    const queryEmbedding = (await embedTexts([query]))?.[0];
    const matches = new Map<string, KnowledgeMatch>();

    for (const chunk of this.database
      .query<ChunkRow, []>(
        "SELECT id, document_id, content, content_hash, embedding FROM knowledge_chunks",
      )
      .all()) {
      const document = documents.get(chunk.document_id);
      if (!document) continue;
      const lexical = lexicalScore(query, document);
      const vector =
        queryEmbedding && chunk.embedding
          ? cosineSimilarity(bytesToVector(chunk.embedding), queryEmbedding)
          : undefined;
      const score = lexical + Math.max(0, vector ?? 0);
      const existing = matches.get(document.id);
      if (!existing || score > existing.score) {
        matches.set(document.id, {
          document,
          matchedContent: chunk.content,
          score,
          lexicalScore: lexical,
          vectorScore: vector,
        });
      }
    }

    return [...matches.values()]
      .filter(
        (match) => match.lexicalScore > 0 || (match.vectorScore ?? 0) >= 0.28,
      )
      .sort((left, right) => right.score - left.score)
      .slice(0, MAX_MATCHES)
      .map((match) => ({
        ...match,
        document: {
          ...match.document,
          content: match.document.content.slice(0, MAX_CONTEXT_PER_DOCUMENT),
        },
      }));
  }

  status(): KnowledgeStatus {
    const documentCount =
      this.database
        .query<{ count: number }, []>(
          "SELECT COUNT(*) AS count FROM knowledge_documents",
        )
        .get()?.count ?? 0;
    const chunkCounts = this.database
      .query<{ count: number; embedded: number }, []>(
        `SELECT COUNT(*) AS count,
          SUM(CASE WHEN embedding IS NOT NULL THEN 1 ELSE 0 END) AS embedded
         FROM knowledge_chunks`,
      )
      .get();
    const chunkCount = chunkCounts?.count ?? 0;
    const embeddedChunkCount = chunkCounts?.embedded ?? 0;
    return {
      ready: documentCount > 0,
      degraded: chunkCount > embeddedChunkCount,
      documentCount,
      chunkCount,
      embeddedChunkCount,
      message:
        chunkCount > embeddedChunkCount
          ? "Semantic retrieval is partially unavailable; lexical retrieval remains active."
          : undefined,
    };
  }

  close() {
    this.database.close();
  }
}
