# Aidan Tilgner — Personal Site

An adaptive professional front page built around a conversational content
workspace. Visitors can ask about Aidan's work, experience, or capabilities;
the site retrieves relevant knowledge, streams a concise response, and
populates the workspace with trusted content blocks.

The product and visual decisions are documented in [`DESIGN.md`](DESIGN.md).
Repository working agreements are documented in [`AGENTS.md`](AGENTS.md).

## Architecture

The application intentionally runs as two processes:

- **Astro + React** renders the site and adaptive workspace.
- **Bun + Elysia** retrieves knowledge, selects blocks, and streams chat events
  over a native WebSocket connection.

During local development the frontend runs at `http://localhost:4321` and the
backend runs at `http://localhost:8080`.

The browser sends a `chat.request` to `/v1/chat`. The backend responds with
`content.blocks`, zero or more `assistant.delta` events, and a final
`assistant.done` event. See [`types/chat.d.ts`](types/chat.d.ts) for the source
contract and [`docs/express-to-elysia.md`](docs/express-to-elysia.md) for the
migration record.

## Local development

Requires [Bun](https://bun.sh/) 1.3 or newer.

```bash
bun install
cp .env.example .env
bun run dev
```

The local retrieval and pre-authored blocks work without external credentials.
Set `OPENAI_API_KEY` in `.env` to enable generated assistant responses.

## Content

- `knowledge/` contains the indexed professional source material.
- `app/blocks/blocks.json` defines trusted widgets and their retrieval aliases.
- `app/public/blocks/` contains the current HTML widget implementations.
- `src/content/blog/` contains schema-validated Markdown writing.

Content should be authored as durable evidence and remain accessible through a
stable route as well as the conversational workspace. Do not add unsupported
professional claims simply to fill a layout.

## Checks

```bash
bun run check
bun run lint
bun run build:astro
bun test
cd cli && go test ./...
```

## Current phase

The backend modernization and first adaptive-workstation visual foundation are
complete. Current follow-up areas include richer semantic block renderers,
updated case studies and experience content, conventional professional index
pages, structured observability, and production routing documentation.
