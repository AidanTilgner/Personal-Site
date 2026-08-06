import { describe, expect, test } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { chunkDocument } from "./chunker";
import { loadMarkdownDocuments, loadProjectDocuments } from "./sources";
import { KnowledgeStore } from "./store";
import type { KnowledgeDocument } from "./types";

const withTemporaryDirectory = async (
  run: (directory: string) => Promise<void>,
) => {
  const directory = mkdtempSync(
    path.join(tmpdir(), "personal-site-knowledge-"),
  );
  try {
    await run(directory);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
};

describe("knowledge sources", () => {
  test("indexes plain Markdown without requiring frontmatter", async () => {
    await withTemporaryDirectory(async (directory) => {
      writeFileSync(
        path.join(directory, "project.md"),
        "# Tiny Project\n\nA useful fact.",
      );
      const documents = await loadMarkdownDocuments(directory);
      expect(documents).toHaveLength(1);
      expect(documents[0]).toMatchObject({
        id: "markdown:project.md",
        title: "Tiny Project",
        aliases: [],
      });
    });
  });

  test("accepts optional aliases and a linked widget", async () => {
    await withTemporaryDirectory(async (directory) => {
      writeFileSync(
        path.join(directory, "project.md"),
        "---\ntitle: Vector Things\naliases: [semantic search]\nblock: project-widget\n---\nUseful content.",
      );
      const [document] = await loadMarkdownDocuments(directory);
      expect(document.aliases).toEqual(["semantic search"]);
      expect(document.blockId).toBe("project-widget");
    });
  });

  test("indexes project Markdown and MDX as enriched project context", async () => {
    await withTemporaryDirectory(async (directory) => {
      writeFileSync(
        path.join(directory, "tiny-project.mdx"),
        "---\ntitle: Tiny Project\ndescription: A small useful thing.\nstatus: active\nrole: Builder\nstarted: 2026-01-15\ntags: [tools]\naliases: [tiny]\ntechnologies: [Astro]\nhighlights: [Shipped carefully]\nlinks: [{ label: Source, href: https://example.com/source }]\ngallery: [{ src: /projects/tiny/detail.webp, alt: A detailed interface, caption: The result screen }]\n---\n\n## Why it exists\n\nA factual project detail.",
      );

      const [document] = await loadProjectDocuments(directory);

      expect(document).toMatchObject({
        id: "project:tiny-project",
        sourceType: "project",
        title: "Tiny Project",
        aliases: ["tiny", "tools"],
      });
      expect(document.content).toContain("Summary: A small useful thing.");
      expect(document.content).toContain("Technologies: Astro");
      expect(document.content).toContain("Source: https://example.com/source");
      expect(document.content).toContain("The result screen");
      expect(document.content).toContain("A factual project detail.");
    });
  });

  test("does not index draft or explicitly excluded projects", async () => {
    await withTemporaryDirectory(async (directory) => {
      writeFileSync(
        path.join(directory, "draft.md"),
        "---\ndraft: true\n---\nDraft",
      );
      writeFileSync(
        path.join(directory, "private.md"),
        "---\nindex: false\n---\nPrivate",
      );

      expect(await loadProjectDocuments(directory)).toEqual([]);
    });
  });
});

describe("knowledge indexing", () => {
  test("keeps a broad document chunk alongside conservative sections", () => {
    const document: KnowledgeDocument = {
      id: "long",
      sourceType: "markdown",
      path: "long.md",
      title: "Long",
      aliases: [],
      content: `# First\n${"alpha ".repeat(1_300)}\n# Second\n${"beta ".repeat(1_300)}`,
      metadata: {},
    };
    const chunks = chunkDocument(document);
    expect(chunks[0].id).toBe("long:document");
    expect(chunks.length).toBeGreaterThan(2);
  });

  test("synchronizes additions, changes, and deletions with lexical fallback", async () => {
    await withTemporaryDirectory(async (directory) => {
      const store = new KnowledgeStore(
        path.join(directory, "knowledge.sqlite"),
      );
      const donut: KnowledgeDocument = {
        id: "block:donut",
        sourceType: "block",
        path: "donut.html",
        title: "donut",
        aliases: ["donut", "doughnut"],
        content: "A spinning ASCII donut.",
        blockId: "donut-widget",
        metadata: {},
      };
      await store.synchronize([donut]);
      expect(
        (await store.search("show me a doughnut"))[0].document.blockId,
      ).toBe("donut-widget");

      await store.synchronize([]);
      expect(await store.search("donut")).toEqual([]);
      store.close();
    });
  });
});
