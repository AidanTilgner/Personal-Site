# Chat knowledge base

The website treats source files as canonical and the local SQLite database as a
disposable retrieval index. The backend synchronizes the index before it begins
serving requests.

## Authoring quick reference

Use this decision guide before changing content:

| Goal                                                              | Source to change                                                                           |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Give the assistant factual context without changing the workspace | Add or edit `knowledge/**/*.md`                                                            |
| Add a visible workspace widget                                    | Add an entry to `app/blocks/blocks.json` and its presentation                              |
| Make retrieved knowledge display a widget                         | Set the Markdown document's `block` field to the widget's stable ID                        |
| Update Aidan's general description, skills, or links              | Edit `app/config/gpt-config.json`                                                          |
| Make important content directly browsable and shareable           | Add or update its conventional Astro route as well                                         |
| Add a project page and make it retrievable                        | Add an entry under `src/content/projects/`                                                 |
| Add a writing page and make it retrievable                        | Add a published entry under `src/content/blog/` or publish to the configured Substack feed |

The most common complete change is:

1. Author the factual source in `knowledge/`.
2. Register and implement a trusted widget.
3. Link the source to the widget with `block: <widget-id>`.
4. Restart the backend so it synchronizes the source files into SQLite.
5. Verify an exact alias and at least one natural-language query.

Do not put unsupported resume claims or invented outcomes into either source.
The Markdown should carry the detailed facts; the widget should present those
facts rather than becoming the only copy of them.

## Sources

Six adapters currently contribute searchable documents:

- `knowledge/**/*.md` for low-overhead authored facts and long-form context.
- `src/content/projects/**/*.{md,mdx}` for project pages and project context.
- `src/content/blog/**/*.{md,mdx}` for published writing and article context.
- The Software and Synapses RSS feed for automatically published Substack writing.
- `app/blocks/blocks.json` plus `app/public/blocks/*.html` for existing widgets.
- `app/config/gpt-config.json` for the owner profile and skills.

Markdown files need no frontmatter. Their relative path becomes the stable ID,
the first level-one heading becomes the title, and the complete body becomes
retrievable context.

Optional frontmatter supports:

```yaml
---
id: stable-custom-id
title: Human-readable title
aliases: [exact phrase, alternate name]
tags: [searchable, terms]
block: existing-block-id
index: true
---
```

All fields are optional. `block` links a Markdown document to an existing
trusted widget. Set `index: false` only for Markdown that lives in the directory
but should not be available to the agent.

Project entries use the stricter schema documented in `docs/projects.md`. They
are indexed as `project:<collection-id>` documents so the same authored source
drives the public project page and assistant context. Draft projects and
projects with `index: false` are excluded.

Published blog entries are indexed as `blog:<collection-id>` documents using
their title, description, author, publication date, tags, and body. Draft posts
and entries with `index: false` are excluded. Their conventional route is
`/blog/posts/<collection-id>`.

Substack entries are fetched from `SUBSTACK_FEED_URL`, sanitized, and indexed
with their complete article text as `blog:substack:<post-slug>` documents. Their
preview metadata points to the native `/blog/posts/<post-slug>` route, while the
canonical Substack URL remains available for attribution. If the remote feed is
temporarily unavailable, local knowledge synchronization continues without it.

### Add knowledge

Create a Markdown file anywhere below `knowledge/`. Subdirectories are allowed.
A minimal document is sufficient:

```markdown
# Project Name

Factual, authored context about the project.
```

For durable professional content, prefer explicit discovery metadata:

```markdown
---
id: project-name
title: Project Name
aliases: [project name, alternate spelling]
tags: [ai, infrastructure]
---

# Project Name

Factual context, decisions, outcomes, and supporting links.
```

Choose aliases that a visitor might actually type. Exact aliases receive the
strongest lexical retrieval score and continue to work without an OpenAI API
key. `tags` and `aliases` are combined by the source adapter, so use tags for
useful topical terms and aliases for names or phrases.

Without an explicit `id`, the stable ID is
`markdown:<path-relative-to-knowledge>`. Moving such a file therefore changes
its ID. Set an explicit `id` if other content or external tooling may need a
path-independent identity.

Knowledge without a `block` can inform the assistant, but it cannot select a
visible widget. If no retrieved result selects a widget, the workspace displays
the fallback block.

## Widget authoring

Widgets are trusted, pre-authored blocks. Runtime model output never creates or
chooses widget code.

### Add a standard local widget

Add a stable entry to `app/blocks/blocks.json`:

```json
{
  "id": "unique-stable-id",
  "name": "project-name",
  "description": "A concise factual description of this widget",
  "content": {
    "type": "url",
    "data": "[SELF_BLOCK_FILE]"
  },
  "aliases": ["project name", "show me project name"]
}
```

Then create `app/public/blocks/project-name.html`. For a self-hosted widget, the
filename must be exactly `<name>.html`; the backend exposes it at
`GET /v1/blocks/:id/content`. Keep the ID stable after publishing because
Markdown documents link to it directly.

The block description, aliases, and visible text extracted from its HTML are
automatically indexed as knowledge. This is enough for a small, self-contained
widget. Add a separate Markdown document when the assistant needs richer facts
than the widget should visibly contain.

The manifest also accepts `content.type: "raw"`, with HTML stored directly in
`content.data`, or a fetchable URL. Prefer the self-hosted form above for normal
repository-owned widgets: it keeps presentation in a reviewable HTML file and
uses the existing versioned endpoint.

### Use the authoring CLI

The Go CLI can register a widget and create its HTML boilerplate:

```bash
export PERSONAL_SITE_ROOT=/absolute/path/to/personal-site
./cli/pscli blocks add
```

Select `self` for a standard local widget. The CLI generates the ID, appends the
manifest entry, and creates `app/public/blocks/<name>.html`. Review both outputs
afterward; the generated boilerplate is only a starting point.

### Link knowledge and presentation

Use the widget's exact manifest ID in Markdown frontmatter:

```markdown
---
id: project-name
title: Project Name
aliases: [project name]
block: unique-stable-id
---

# Project Name

Detailed factual context for retrieval and assistant responses.
```

When this document is retrieved, its `block` value becomes `blockId` in the
index. The application deduplicates retrieved block IDs, resolves them against
the trusted manifest, and sends those widgets to the browser in retrieval
order. A missing or mistyped ID silently produces no widget, so verify it
against `app/blocks/blocks.json`.

### Interactive widget behavior

The browser sanitizes widget HTML before inserting it. It removes `script`,
`iframe`, `object`, `embed`, and `form` elements; inline scripts from the CLI
boilerplate therefore do not execute.

Static HTML and CSS can live in the widget file. Behavior requiring JavaScript
must currently be implemented as trusted activation and cleanup code in
`src/components/Experience/Chat/Content/Content.tsx`, keyed by a stable widget
name. Follow the donut behavior's cleanup pattern for timers or listeners. New
interactions must be keyboard accessible, visibly focusable, and respect
reduced-motion preferences.

Important content should also be represented on a conventional Astro route for
direct browsing, accessibility, stable sharing, and search indexing. Widget
registration does not create that route automatically.

## Synchronization

Documents and chunks are identified independently. Content hashes ensure only
new or changed chunks are re-embedded. Deleted files remove their documents and
chunks. The embedding model and dimensions are recorded with the index so a
configuration change triggers a compatible rebuild.

Small documents receive one broad chunk. Longer documents retain a broad
document chunk and also receive large overlapping sections. Retrieval expands
the winning chunk back to generous document context, intentionally favoring
recall over aggressive context trimming.

The default generated database is `app/data/knowledge.sqlite` and is ignored by
Git. Persist this path in production to avoid rebuilding embeddings on every
restart.

Synchronization runs at backend startup and refreshes lazily when retrieval is
requested after `KNOWLEDGE_REFRESH_INTERVAL_MS`. Content hashes keep unchanged
chunks from being re-embedded. Restart the backend when immediate visibility is
needed after changing Markdown, widget definitions, widget HTML, or the owner
profile; otherwise the next refresh picks them up. Remote Substack entries use
the same refresh path and retain their last successful in-process snapshot
during a temporary feed outage.

## Retrieval and widgets

Retrieval combines lexical relevance with cosine similarity over OpenAI
embeddings. Exact aliases have the strongest lexical weight, so requests such as
`donut` reliably show the donut widget without an intent classifier. Semantic
similarity handles natural-language questions that do not match an alias.

Embeddings are stored as compact Float32 blobs in SQLite. The initial
implementation computes exact cosine similarity in-process because the expected
corpus is small; this avoids a native SQLite extension and its deployment
constraints. The storage boundary can adopt `sqlite-vec` later without changing
the source adapters or chat contracts if corpus size makes approximate or
extension-backed search worthwhile.

Every result may contribute agent context. A result with a `blockId` contributes
its explicitly authored widget. Retrieved project and blog documents without a
`blockId` deterministically produce a safe preview block using their authored
metadata, tags, summary, and conventional route. Explicit widgets take
precedence over automatic previews. In the chat flow only, a structured model
pass may rewrite the preview's short relevance line and summary around the
visitor's current prompt. The model receives only the retrieved source data and
cannot alter the preview's identity, title, route, status/date, tags, order, or
HTML structure. Invalid output or provider failure silently preserves the
authored preview. The deterministic `POST /v1/blocks/query` endpoint never runs
this presentation pass. The application, not the language model, selects and
renders all blocks.

If embeddings are unavailable, startup records the content without vectors and
reports degraded status while lexical retrieval remains functional. If an
embedding refresh fails and a prior usable database exists, that database is
preserved.

## Configuration

| Variable                        | Default                     | Purpose                     |
| ------------------------------- | --------------------------- | --------------------------- |
| `KNOWLEDGE_DIRECTORY`           | `knowledge`                 | Markdown source directory   |
| `PROJECTS_DIRECTORY`            | `src/content/projects`      | Project source directory    |
| `BLOG_DIRECTORY`                | `src/content/blog`          | Published writing source    |
| `SUBSTACK_FEED_URL`             | Software and Synapses feed  | Remote writing source       |
| `SUBSTACK_CACHE_TTL_MS`         | `900000`                    | Remote feed cache lifetime  |
| `KNOWLEDGE_REFRESH_INTERVAL_MS` | `900000`                    | Lazy index refresh interval |
| `KNOWLEDGE_DB_PATH`             | `app/data/knowledge.sqlite` | Generated SQLite index      |
| `OPENAI_EMBEDDING_MODEL`        | `text-embedding-3-small`    | Embedding model             |
| `OPENAI_EMBEDDING_DIMENSIONS`   | `1536`                      | Stored vector dimensions    |
| `OPENAI_CHAT_MODEL`             | `gpt-5.6-luna`              | Responses API model         |

The generation route uses the official OpenAI SDK, the Responses API, explicit
low reasoning effort, and typed streaming events forwarded over the existing
application WebSocket protocol. Preview tuning uses the same configured chat
model with strict structured output and degrades independently from the
conversational response.

## Verification checklist

After authoring content:

1. Restart the Elysia backend and inspect `GET /health`. Confirm
   `knowledge.ready` is true; degraded mode means lexical retrieval remains
   available but embeddings may not be current.
2. Query an exact alias through the UI or `POST /v1/blocks/query` and confirm the
   expected widget or project/writing preview is returned.
3. Ask a natural-language question and confirm the assistant answer is grounded
   in the Markdown and the expected widget appears. For a project or writing
   preview, confirm the relevance line addresses the question without changing
   canonical facts; repeat without provider access to confirm authored fallback.
4. Open `GET /v1/blocks/<id>/content` for a local widget and inspect its rendered
   state in the workspace, including narrow screens and keyboard focus.
5. Confirm important material also works on its conventional route and remains
   useful if the chat backend is unavailable.
6. Run the checks proportional to the change:

```bash
bun test
bun run check
bun run build:astro
```

Run `cd cli && go test ./...` as well after changing the authoring CLI. Add or
update retrieval tests when introducing important aliases or block-linking
behavior; representative examples live in `app/knowledge/knowledge.test.ts`
and `app/app.test.ts`.

## Implementation map

| Concern                                     | Implementation                                       |
| ------------------------------------------- | ---------------------------------------------------- |
| Markdown, widget, and profile adapters      | `app/knowledge/sources.ts`                           |
| Chunking and content hashes                 | `app/knowledge/chunker.ts`                           |
| SQLite synchronization and hybrid retrieval | `app/knowledge/store.ts`                             |
| Knowledge initialization lifecycle          | `app/knowledge/index.ts`                             |
| Widget manifest lookup and selection        | `app/blocks/index.ts`                                |
| Widget HTTP endpoints                       | `app/app.ts`                                         |
| Widget loading, sanitization, and behavior  | `src/components/Experience/Chat/Content/Content.tsx` |
| Chat event contract                         | `types/chat.d.ts`                                    |
