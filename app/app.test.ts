import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { createApp } from "./app";

let app: Awaited<ReturnType<typeof createApp>>;
const testDirectory = mkdtempSync(path.join(tmpdir(), "personal-site-app-"));
process.env.KNOWLEDGE_DB_PATH = path.join(testDirectory, "knowledge.sqlite");

beforeAll(async () => {
  app = await createApp();
});

afterAll(() => {
  rmSync(testDirectory, { recursive: true, force: true });
});

describe("Elysia HTTP contracts", () => {
  test("returns a quiet 404 for unmatched API paths", async () => {
    const response = await app.handle(new Request("http://localhost/"));

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ message: "Not found." });
  });

  test("reports knowledge readiness", async () => {
    const response = await app.handle(new Request("http://localhost/health"));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      status: "ok",
      knowledgeReady: true,
      knowledge: { ready: true },
    });
  });

  test("selects project and resume blocks", async () => {
    const response = await app.handle(
      new Request("http://localhost/v1/blocks/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation: [{ role: "user", content: "Projects." }],
        }),
      }),
    );
    const body = (await response.json()) as {
      data: { blocks: { id: string }[] };
    };
    expect(response.status).toBe(200);
    expect(body.data.blocks.map((block) => block.id)).toContain(
      "adf0a95abd7db02d",
    );
    expect(body.data.blocks.map((block) => block.id)).toContain(
      "8208ae3c9f95814d",
    );
  });

  test("selects the donut widget through an exact alias", async () => {
    const response = await app.handle(
      new Request("http://localhost/v1/blocks/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation: [{ role: "user", content: "donut" }],
        }),
      }),
    );
    const body = (await response.json()) as {
      data: { blocks: { name: string }[] };
    };
    expect(body.data.blocks.map((block) => block.name)).toEqual(["donut"]);
  });

  test("creates previews for indexed projects and writing", async () => {
    const projectResponse = await app.handle(
      new Request("http://localhost/v1/blocks/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation: [{ role: "user", content: "Simple Vector Store" }],
        }),
      }),
    );
    const projectBody = (await projectResponse.json()) as {
      data: {
        blocks: {
          name: string;
          kind?: string;
          href?: string;
          content: { data: string };
        }[];
      };
    };
    expect(projectBody.data.blocks).toContainEqual(
      expect.objectContaining({
        name: "Simple Vector Store",
        kind: "project-preview",
        href: "/projects/simple-vector-store",
      }),
    );

    const blogResponse = await app.handle(
      new Request("http://localhost/v1/blocks/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation: [
            {
              role: "user",
              content: "principles of the linguistic engineer",
            },
          ],
        }),
      }),
    );
    const blogBody = (await blogResponse.json()) as {
      data: { blocks: { name: string; kind?: string; href?: string }[] };
    };
    expect(blogBody.data.blocks).toContainEqual(
      expect.objectContaining({
        name: "principles of the linguistic engineer",
        kind: "blog-preview",
        href: "/blog/posts/principles-of-the-linguistic-engineer",
      }),
    );
  });

  test("returns the fallback block for an unknown prompt", async () => {
    const response = await app.handle(
      new Request("http://localhost/v1/blocks/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation: [{ role: "user", content: "quantum turnip orchestra" }],
        }),
      }),
    );
    const body = (await response.json()) as {
      data: { blocks: { id: string }[] };
    };
    expect(body.data.blocks.map((block) => block.id)).toEqual([
      "fallback-block",
    ]);
  });

  test("serves parsed block HTML and rejects invalid IDs", async () => {
    const valid = await app.handle(
      new Request("http://localhost/v1/blocks/adf0a95abd7db02d/content"),
    );
    expect(valid.status).toBe(200);
    expect(valid.headers.get("content-type")).toContain("text/html");
    expect(await valid.text()).toContain("/projects");

    const invalid = await app.handle(
      new Request("http://localhost/v1/blocks/not-a-block/content"),
    );
    expect(invalid.status).toBe(404);
  });

  test("validates conversation input", async () => {
    const response = await app.handle(
      new Request("http://localhost/v1/blocks/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation: [] }),
      }),
    );
    expect(response.status).toBe(400);
  });
});
