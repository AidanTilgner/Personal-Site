# Adding a project

Project entries are the shared source for the `/projects` index, conventional
case-study routes, and the chat knowledge index. Put every public project in
`src/content/projects/`, including projects whose visible page is implemented
as a custom Astro route.

For a loose folder of notes, images, exports, or PDFs, start with
`docs/project-intake.md`. It defines the evidence-review, asset-publishing, and
browser-preview process an agent should complete before this authoring guide.

Do not invent outcomes, metrics, roles, collaborators, or implementation
details. If the supplied source material does not support a claim, omit it or
ask for clarification.

## Choose a page type

- Use Markdown (`.md`) for a straightforward case study using the default
  project layout.
- Use MDX (`.mdx`) when the default layout is sufficient but the article body
  needs imported Astro components or other custom content.
- Use `page: custom` plus a matching `.astro` route when the entire page needs a
  bespoke structure, data integration, or interaction. Keep the collection
  entry because its metadata and body remain the project's canonical context
  for the index and retrieval system.

The entry's relative filename is its URL. For example,
`src/content/projects/cosmo.mdx` maps to `/projects/cosmo`; nested files such as
`src/content/projects/labs/cosmo.md` map to `/projects/labs/cosmo`.

## Default project template

Copy `src/content/projects/_template.mdx` to
`src/content/projects/<slug>.md` or `.mdx`, then replace its placeholders. The
template itself stays hidden and excluded from retrieval:

```md
---
title: "Project name"
description: "A concise, factual summary used in cards, metadata, and retrieval."
status: "active"
started: "2026-01-15"
role: "Product engineer"
tags: ["agents", "developer tools"]
technologies: ["Astro", "Bun"]
highlights:
  - "A specific, supported decision, artifact, or result."
links:
  - label: "Live site"
    href: "https://example.com"
image:
  src: "/projects/project-name/hero.webp"
  alt: "Accurate description of the project interface"
gallery:
  - src: "/projects/project-name/detail.webp"
    alt: "Accurate description of this project artifact"
    caption: "Optional factual context for the artifact."
featured: true
order: 10
draft: false
page: "default"
aliases: ["project name", "phrase a visitor may ask"]
index: true
---

## The problem

Explain the real context and constraints.

## The approach

Describe decisions, tradeoffs, and implementation details.

## The result

Record supported outcomes and link to evidence where possible.

## What I learned

Capture lessons, limitations, and what you would change.
```

All dates use `YYYY-MM-DD`. Valid statuses are `active`, `maintained`,
`completed`, `paused`, `archived`, and `concept`. The only required fields are
`title`, `description`, and `status`; the schema supplies safe defaults for the
array, ordering, draft, page, and indexing fields.

Optional fields:

| Field          | Purpose                                                                 |
| -------------- | ----------------------------------------------------------------------- |
| `completed`    | Completion or archive date in `YYYY-MM-DD` format.                      |
| `role`         | Aidan's factual role on the project.                                    |
| `tags`         | Topics used in the index and retrieval.                                 |
| `technologies` | Material tools or platforms used by the project.                        |
| `highlights`   | Short, supported proof points shown by the default layout.              |
| `links`        | Labeled internal or external project links.                             |
| `image`        | `{ src, alt }` hero image; `alt` may be empty for decorative art.       |
| `gallery`      | Ordered project images with `src`, `alt`, and optional `caption`.       |
| `featured`     | Sorts the project ahead of non-featured entries.                        |
| `order`        | Higher numbers sort first within the same featured group.               |
| `draft`        | Hides the route and index card and excludes it from retrieval.          |
| `page`         | `default` for collection rendering or `custom` for an Astro route.      |
| `aliases`      | Exact names or phrases visitors may use when asking about it.           |
| `block`        | Stable ID of an existing trusted workspace widget to show on retrieval. |
| `index`        | Set to `false` to keep the project out of agent retrieval.              |

The project body should contain the details the assistant needs to answer
questions. Metadata is included in retrieval, but it is not a substitute for a
factual narrative with constraints, decisions, evidence, and limitations.

## Custom Astro page

Set `page: "custom"` in the collection entry, then create the matching route.
For `src/content/projects/cosmo.mdx`, that route is
`src/pages/projects/cosmo.astro`:

```astro
---
import { getEntry } from "astro:content";
import ProjectLayout from "../../layouts/ProjectLayout.astro";

const entry = await getEntry("projects", "cosmo");
if (!entry) throw new Error("Missing projects/cosmo collection entry");
if (entry.data.draft && import.meta.env.PROD) {
  return new Response("Not found", { status: 404 });
}
---

<ProjectLayout project={entry.data}>
  <!-- Bespoke components, data integrations, and layout go here. -->
</ProjectLayout>
```

The catch-all default route deliberately skips custom entries, preventing a
route collision. A custom page may use `ProjectLayout` for shared framing or
use the base `Layout` and take full control. Keep the production draft guard in
custom routes; unlike the catch-all route, Astro cannot infer that an exact
custom route belongs to a draft collection entry.

## Retrieval and workspace blocks

At backend startup, every non-draft project with `index: true` becomes a
`project:<collection-id>` knowledge document. The index includes its summary,
status, role, technologies, highlights, tags, aliases, and authored body.

Use aliases for real phrases a visitor may type. Every retrieved project gets a
deterministic preview block from its authored title, description, status, tags,
and conventional route. If the project has a purpose-built workspace widget,
set `block` to the widget's exact stable ID from `app/blocks/blocks.json`; that
explicit widget replaces the automatic preview. Follow `docs/knowledge-base.md`
when creating or changing a widget. During a chat request, the model may tailor
only the preview's relevance line and short summary to the visitor's question.
The project entry remains the factual source and all canonical preview fields
stay fixed; tuning failure falls back to the authored description.

Restart the Elysia backend after project content changes so the disposable
SQLite index synchronizes. Verify both an exact alias and a natural-language
question, then run:

```bash
bun run check
bun run build:astro
bun test
```

## Agent completion checklist

1. Confirm the source material supports every claim.
2. Add or update the collection entry and choose `default`, MDX, or `custom`.
3. Ensure the entry appears in the correct current or past-work index section.
4. Confirm `/projects/<slug>` renders and works on a narrow viewport.
5. Confirm the project is indexed unless `draft: true` or `index: false` is intentional.
6. Confirm retrieval selects the automatic project preview, or the explicit
   widget when `block` is set. In chat, confirm any tuned framing remains
   supported by the project source.
7. Run the required checks and report any missing source information.
