# Project intake from a loose source folder

This is the agent workflow for turning an unstructured folder of notes and
visual material into a project page and a local browser preview. The source
folder may be anywhere on the computer, or it may be a subdirectory of the
Git-ignored `.project-intake/` inbox.

The intake folder is evidence, not publishable content. Treat it as read-only.
Never rename, reorganize, edit, or delete its files. Do not copy the full folder
into the repository.

## Prompt to give an agent

Replace the path and paste this prompt while the agent is working in this
repository:

```text
Create and preview a project page from this source folder:
<absolute path to source folder>

Follow AGENTS.md, docs/project-intake.md, docs/projects.md, and
docs/knowledge-base.md. Treat the source folder as read-only evidence. Inspect
all relevant notes and visual assets, do not invent unsupported facts, and do
not publish private or sensitive material. Use the default MDX project page
unless the evidence clearly benefits from a custom Astro presentation. Copy
only selected publishable assets into the site, build the page, run the required
checks, start a local preview, inspect the project index and detail page at wide
and narrow viewport sizes, and give me the preview URL plus any unresolved
questions or omitted claims.
```

The agent should proceed without asking for a formal brief when the folder has
enough evidence. It should ask before publishing only when identity, ownership,
privacy, project status, or a material claim cannot be resolved safely from the
source.

## Accepted source material

No fixed folder structure is required. Useful inputs include:

- a rough `notes.md`, text file, voice-transcript export, or document;
- screenshots, mockups, photos, diagrams, GIFs, or short videos;
- PDFs, slide decks, exported webpages, or product specifications;
- a text file containing relevant links;
- filenames or subfolders that suggest chronology or grouping.

If you can, include a short note covering the project name, Aidan's role,
current status, approximate dates, what can be public, and any claims that must
or must not appear. This improves the result but is not required.

## Required agent workflow

### 1. Inventory without changing the source

List the files recursively, group them by type, and identify likely duplicates,
generated exports, sensitive files, and unsupported formats. Read textual
sources and extract facts into working notes under these headings:

- project identity and one-sentence description;
- problem and constraints;
- Aidan's role and collaborators;
- decisions and implementation;
- supported outcomes and artifacts;
- dates, status, technologies, and links;
- open questions, contradictions, and privacy concerns.

Facts repeated across sources may be treated as stronger evidence. Conflicting
facts must not be silently reconciled. Prefer the most direct or newest source,
and report a consequential conflict to the user.

### 2. Inspect the visual evidence

Open every image that might be published; do not select images by filename
alone. Record its dimensions, subject, legibility, duplication, and whether it
contains personal data, credentials, customer information, private messages,
or other material that should not be public.

Choose one strong hero only when it improves the page. Choose a small ordered
gallery that advances the project story rather than publishing every image.
Screenshots should be readable at their rendered size. Do not crop away
material context or retouch evidence in a way that changes its meaning.

Write alt text from what is visibly present. Use an empty `alt` only for a truly
decorative image. Captions should explain why an artifact matters and must not
introduce claims absent from the source material.

### 3. Create safe site assets

Copy only selected public assets to `public/projects/<slug>/`. Use stable,
lowercase, hyphenated filenames with no spaces. Keep the original source files
untouched.

Prefer web-friendly formats and sensible dimensions, but preserve sharp text in
screenshots and diagrams. Avoid adding a large original when a visually
equivalent optimized copy is sufficient. Never publish source documents merely
so the page can link to them unless the user explicitly approved that.

Reference copied assets with root-relative paths such as
`/projects/<slug>/hero.webp`. The default schema supports one `image` and an
ordered `gallery`; MDX or custom Astro pages may compose the same assets more
freely.

### 4. Author from evidence

Follow `docs/projects.md` and start from
`src/content/projects/_template.mdx`. Use `page: default` unless bespoke layout,
data loading, or interaction materially improves the story. A visually rich
page does not by itself require `page: custom`: MDX components can extend the
default case-study frame.

The collection entry must remain the factual RAG source even when a custom
Astro page controls presentation. Write enough plain-language context in its
body for the assistant to answer questions without interpreting screenshots.
Use real visitor phrases in `aliases`. Set `block` only when an appropriate
trusted workspace block actually exists.

Keep `draft: true` while building when important privacy or factual questions
remain. Drafts appear locally in development with a visible draft label, but
production builds omit default draft routes and the retrieval index excludes
them. A custom Astro route must use the production draft guard shown in
`docs/projects.md`. Do not mark a page public merely to make previewing
convenient.

### 5. Validate and preview

Run:

```bash
bun run check
bun run build:astro
bun test
```

Start the existing Astro development server and use the exact local URL it
prints. Open both `/projects` and `/projects/<slug>` in the available browser.
Inspect at a wide desktop size and a narrow mobile size. Confirm:

- the index card has the correct status, summary, tags, and destination;
- the case study has a coherent evidence-led reading order;
- every selected asset loads, remains legible, and has appropriate alt text;
- long captions, links, code, and media do not overflow;
- keyboard focus is visible on interactive elements;
- reduced-motion behavior remains usable if custom interaction was added.

Restart the backend before checking retrieval. Verify an exact project alias
and at least one natural-language question. Confirm the assistant uses the
entry's prose as factual context and, when `block` is present, selects the
expected trusted widget.

### 6. Hand off the result

Leave the source folder untouched and report:

- the local preview URL;
- the collection entry, custom route if any, and copied asset directory;
- which source materials informed the page;
- images or claims intentionally omitted and why;
- unresolved questions or contradictions;
- validation and retrieval results.

Do not publish or deploy the site unless the user explicitly asks for that
separate action.
