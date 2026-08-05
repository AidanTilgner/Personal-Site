import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";
import blocksJSON from "../blocks/blocks.json";
import profileJSON from "../config/gpt-config.json";
import type { Block } from "../../types/blocks";
import type { KnowledgeDocument } from "./types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "../..");
const defaultKnowledgeDirectory = path.join(projectRoot, "knowledge");
const defaultProjectsDirectory = path.join(projectRoot, "src/content/projects");
const blocksDirectory = path.join(projectRoot, "app/public/blocks");

type MarkdownMetadata = {
  id?: unknown;
  title?: unknown;
  aliases?: unknown;
  tags?: unknown;
  block?: unknown;
  blockId?: unknown;
  index?: unknown;
  display?: unknown;
  [key: string]: unknown;
};

const strings = (value: unknown) =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : typeof value === "string"
      ? [value]
      : [];

const parseFrontmatter = (markdown: string) => {
  if (!markdown.startsWith("---\n") && !markdown.startsWith("---\r\n")) {
    return { metadata: {} as MarkdownMetadata, content: markdown };
  }
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { metadata: {} as MarkdownMetadata, content: markdown };
  const parsed = parseYaml(match[1]);
  return {
    metadata:
      parsed && typeof parsed === "object"
        ? (parsed as MarkdownMetadata)
        : ({} as MarkdownMetadata),
    content: markdown.slice(match[0].length),
  };
};

const firstHeading = (markdown: string) =>
  markdown.match(/^#\s+(.+)$/m)?.[1]?.trim();

const getDisplayBlockId = (metadata: MarkdownMetadata) => {
  if (typeof metadata.blockId === "string") return metadata.blockId;
  if (typeof metadata.block === "string") return metadata.block;
  if (metadata.display && typeof metadata.display === "object") {
    const display = metadata.display as Record<string, unknown>;
    if (typeof display.blockId === "string") return display.blockId;
    if (typeof display.block === "string") return display.block;
  }
  return undefined;
};

const walkMarkdown = async (directory: string): Promise<string[]> => {
  try {
    const entries = await readdir(directory, { withFileTypes: true });
    const nested = await Promise.all(
      entries.map(async (entry) => {
        const entryPath = path.join(directory, entry.name);
        if (entry.isDirectory()) return walkMarkdown(entryPath);
        if (entry.isFile() && /\.(?:md|mdx|markdown)$/i.test(entry.name)) {
          return [entryPath];
        }
        return [];
      }),
    );
    return nested.flat();
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
};

const projectContext = (metadata: MarkdownMetadata, content: string) => {
  const lines = [
    typeof metadata.description === "string"
      ? `Summary: ${metadata.description}`
      : undefined,
    typeof metadata.status === "string"
      ? `Status: ${metadata.status}`
      : undefined,
    typeof metadata.role === "string" ? `Role: ${metadata.role}` : undefined,
    strings(metadata.technologies).length
      ? `Technologies: ${strings(metadata.technologies).join(", ")}`
      : undefined,
    strings(metadata.highlights).length
      ? `Highlights:\n${strings(metadata.highlights)
          .map((highlight) => `- ${highlight}`)
          .join("\n")}`
      : undefined,
  ].filter((line): line is string => Boolean(line));

  return [...lines, content.trim()].filter(Boolean).join("\n\n");
};

export const loadProjectDocuments = async (
  directory = process.env.PROJECTS_DIRECTORY ?? defaultProjectsDirectory,
): Promise<KnowledgeDocument[]> => {
  const files = await walkMarkdown(directory);
  const documents = await Promise.all(
    files.map(async (filename): Promise<KnowledgeDocument | undefined> => {
      const source = await readFile(filename, "utf8");
      const { metadata, content } = parseFrontmatter(source);
      if (metadata.index === false || metadata.draft === true) return undefined;

      const relativePath = path.relative(directory, filename);
      const idPath = relativePath
        .replaceAll(path.sep, "/")
        .replace(/\.(?:md|mdx|markdown)$/i, "");
      const title =
        typeof metadata.title === "string"
          ? metadata.title
          : (firstHeading(content) ??
            path.basename(filename, path.extname(filename)));

      return {
        id: `project:${idPath}`,
        sourceType: "project" as const,
        path: `src/content/projects/${relativePath.replaceAll(path.sep, "/")}`,
        title,
        content: projectContext(metadata, content),
        aliases: [...strings(metadata.aliases), ...strings(metadata.tags)],
        blockId: getDisplayBlockId(metadata),
        metadata,
      };
    }),
  );

  return documents.filter(
    (document): document is KnowledgeDocument => document !== undefined,
  );
};

export const loadMarkdownDocuments = async (
  directory = process.env.KNOWLEDGE_DIRECTORY ?? defaultKnowledgeDirectory,
): Promise<KnowledgeDocument[]> => {
  const files = await walkMarkdown(directory);
  const documents = await Promise.all(
    files.map(async (filename): Promise<KnowledgeDocument | undefined> => {
      const markdown = await readFile(filename, "utf8");
      const { metadata, content } = parseFrontmatter(markdown);
      if (metadata.index === false) return undefined;
      const relativePath = path.relative(directory, filename);
      const id =
        typeof metadata.id === "string"
          ? metadata.id
          : `markdown:${relativePath.replaceAll(path.sep, "/")}`;
      const title =
        typeof metadata.title === "string"
          ? metadata.title
          : (firstHeading(content) ??
            path.basename(filename, path.extname(filename)));
      const aliases = [...strings(metadata.aliases), ...strings(metadata.tags)];
      return {
        id,
        sourceType: "markdown" as const,
        path: relativePath,
        title,
        content: content.trim(),
        aliases,
        blockId: getDisplayBlockId(metadata),
        metadata,
      };
    }),
  );
  return documents.filter(
    (document): document is KnowledgeDocument => document !== undefined,
  );
};

const decodeEntities = (value: string) =>
  value
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");

const visibleHTMLText = (html: string) =>
  decodeEntities(
    html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<!--([\s\S]*?)-->/g, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();

export const loadBlockDocuments = async (): Promise<KnowledgeDocument[]> => {
  const blocks = blocksJSON as Block[];
  return Promise.all(
    blocks.map(async (block) => {
      let visibleText = "";
      if (block.content.type === "url") {
        try {
          visibleText = visibleHTMLText(
            await readFile(
              path.join(blocksDirectory, `${block.name}.html`),
              "utf8",
            ),
          );
        } catch {
          // The block description remains searchable if its optional file is absent.
        }
      } else {
        visibleText = visibleHTMLText(block.content.data);
      }
      return {
        id: `block:${block.id}`,
        sourceType: "block" as const,
        path: `app/public/blocks/${block.name}.html`,
        title: block.name,
        content: [block.description, visibleText].filter(Boolean).join("\n\n"),
        aliases: block.aliases ?? [],
        blockId: block.id,
        metadata: { name: block.name },
      };
    }),
  );
};

export const loadProfileDocument = (): KnowledgeDocument => {
  const profile = profileJSON.owner;
  const skills = profile.skills.map(
    ([name, description]) => `${name}: ${description}`,
  );
  const links = profile.links.map(([name, href]) => `${name}: ${href}`);
  return {
    id: "profile:owner",
    sourceType: "profile",
    path: "app/config/gpt-config.json",
    title: profile.name,
    aliases: [
      "Aidan",
      "Aidan Tilgner",
      "about Aidan",
      ...profile.skills.map(([name]) => name),
    ],
    content: [
      profile.description,
      "Skills:",
      ...skills,
      "Links:",
      ...links,
    ].join("\n"),
    metadata: {},
  };
};

export const loadKnowledgeDocuments = async () => [
  loadProfileDocument(),
  ...(await loadBlockDocuments()),
  ...(await loadMarkdownDocuments()),
  ...(await loadProjectDocuments()),
];
