---
id: experience-dossier
title: Technical Experience Dossier
aliases: [technical background, technical experience, skills, engineering experience, project experience]
tags: [experience, engineering, product, ai, agents, retrieval, distributed systems]
---

# Technical Experience Dossier

This is an evidence-led working dossier compiled from the project research in
`tmp/projects/` on 2026-08-05. It is source material for a cofounder or writing
agent, not a finished resume. Project repositories and research notes establish
what a project contains; they do not automatically establish Aidan's exact
personal ownership, title, leadership scope, customer outcomes, or production
status. Use the phrases marked as safe below until those details are confirmed.

## Executive synthesis

Aidan's work shows a consistent interest in building useful systems around
messy human and machine information. The work spans:

- full-stack product engineering: React/TypeScript frontends, Go and
  TypeScript/Python backends, SQLite/TypeORM/SurrealDB/BadgerDB persistence,
  authentication, APIs, background workflows, and operational interfaces;
- AI-native product design: rich writing assistance, audio transcription and
  extraction, tool-using agents, semantic memory, hybrid retrieval, grounded
  answers, and provider-flexible model integration;
- information architecture: graph-shaped knowledge, category-aware product
  schemas, structured content, source-to-draft workflows, and local file-backed
  indexes;
- reliability and systems thinking: durable jobs, retries, idempotency,
  conflict semantics, event ordering, peer synchronization, diagnostics, and
  end-to-end validation;
- human control and legibility: observable agent state, reviewable AI drafts,
  access-aware retrieval, self-hosting, data portability, and explicit product
  limitations.

The strongest current specialization signal is **AI-native knowledge and data
systems**: making unstructured material capturable, searchable, connected, and
useful while preserving user control. Thalweg adds a newer systems layer:
local-first temporal infrastructure for collecting, ordering, synchronizing,
and selectively promoting events into durable knowledge.

## High-confidence capability inventory

### AI products and applied model integration

- Built or explored workflows that connect browser/audio input, transcription,
  structured extraction, editing, search, and conversational assistance.
- Used OpenAI Whisper for audio transcription and function-call/structured
  outputs for notes, writing generation, rephrasing, and catalog drafts.
- Designed model-facing tools with names, descriptions, parameter schemas,
  dispatch, results, logging, and iterative control flow.
- Worked with provider abstractions spanning OpenAI, Anthropic, Google, xAI,
  and deterministic test providers in different projects.
- Treated model output as a draft or bounded answer that needs source context,
  access checks, review, lifecycle state, and failure handling.

### Agents and agent UX

- Prototyped explicit perception → inference → action loops combining
  environment, memory, agency, tasks, and tool results.
- Modeled goals and completion state rather than relying only on implicit chat
  context; explored long-, middle-, and immediate-term agency.
- Built role-specific toolsets for helpful-assistant, developer, and researcher
  workflows, with an extensible toolbox/registry.
- Added local control surfaces for conversations, agent state, model history,
  logs, projects, search, pause behavior, and real-time updates.
- Demonstrated an important safety lesson: tool calling and role separation are
  not sufficient safeguards for filesystem or shell access; serious agents
  need consent, scoped permissions, sandboxing, review, rollback, and recovery.

### Retrieval, memory, and knowledge systems

- Built a local file-backed semantic search service with CLI and REST APIs,
  multiple named stores, title/content embeddings, incremental sync, deletion
  handling, retries, truncation, and source exclusions.
- Integrated semantic and episodic memory into an agent through a pluggable
  vector-store interface and Markdown-backed records.
- Worked on hybrid retrieval combining lexical BM25 search and embedding-based
  nearest-neighbor search, with score merging, ranking, filtering, and exact
  title preference.
- Worked on graph-shaped knowledge models connecting ideas, tasks, sources,
  and excerpts, with graph visualization and retrieval-aware access paths.
- Designed grounded answer experiences that retrieve from a user's scoped
  knowledge rather than returning a generic chatbot response.
- Treated embeddings as derived data with provider/model/dimension metadata,
  content hashes, rebuild paths, lifecycle state, and failure handling.

### Distributed and local-first systems

- Designed a local-first chronological event mesh in Thalweg using immutable
  typed events, event/receipt/propagation timestamps, persistent Hybrid Logical
  Clocks, idempotent ingestion, and BadgerDB storage.
- Implemented or documented private peer synchronization with libp2p identity,
  logical network membership, HMAC membership proofs, bounded inventory/digest
  reconciliation, missing-envelope transfer, anti-entropy, retries, and peer
  health.
- Explored explicit conflict behavior that preserves both variants and audit
  history rather than silently applying last-write-wins.
- Designed durable event consumers with persisted cursors, acknowledgements,
  one outstanding batch, and at-least-once restart recovery.
- Exposed versioned local protocols through typed TypeScript and async Python
  SDKs, alongside Go daemon, CLI, TUI, browser Console, diagnostics, and
  deterministic replication labs.

### Product and frontend engineering

- Built complex React interfaces for writing, knowledge management, product
  catalogs, agent monitoring, comparison, onboarding, graph exploration, and
  responsive mobile workflows.
- Extended Tiptap/ProseMirror for formatting, images, code blocks, menus,
  placeholders, keyboard behavior, and custom inline comments.
- Worked with real-time collaboration through Socket.IO, Yjs, and Hocuspocus;
  bridged live document state with durable application records.
- Considered accessibility and product polish through responsive layouts,
  keyboard shortcuts, themes, localization, tours, loading/failure states, and
  low-distraction writing modes.

### Data modeling and decision-support products

- Designed category-aware product schemas combining shared comparison fields
  with product-type-specific attributes, tags, images, and source links.
- Built catalog search and side-by-side comparison experiences using SQLite FTS5
  and structured metadata.
- Created an AI-assisted source-to-draft intake flow that extracts structured
  fields from manufacturer-page text for human review.
- Used editorial and provenance concepts—source links, notes, captions,
  privacy fields, review steps, and exclusions—to keep automation from becoming
  an unquestioned source of truth.

### Operational discipline

- Worked across migrations, local/self-hosted deployment, Docker Compose,
  database backups/exports, embedding rebuilds, CLI lifecycle commands,
  diagnostics, and production-start paths.
- Added or worked with tests covering authentication, core CRUD, streaming and
  durable AI runs, agent behavior, mesh lifecycle, identity, synchronization,
  conflicts, fuzz targets, SDKs, and multi-device acceptance scenarios.
- The maturity varies by project: several early prototypes have no visible test
  suite or production hardening, while Noeko and Thalweg contain substantially
  stronger validation evidence.

## Project catalog

### Noeko — collaborative personal knowledge management

**Evidence status:** public beta; public product at `https://www.noeko.app/`;
repository at `https://github.com/noekohq/Noeko`. The notes identify Aidan as
maintainer and Bilal Azhar as a founding design contributor. Confirm current
status, exact titles, division of ownership, and any outcome metrics.

Noeko is an open-source, self-hostable collaborative knowledge system designed
to reduce the maintenance burden of organizing notes without giving up
retrieval and connections. Supported product capabilities include note capture,
an interactive Constellation graph, collaboration/sharing, lexical and
semantic search, and Markdown import/export. Spyglass is described as a beta
personal answer engine grounded in a user's knowledge; Rabbitholes, source/PDF
ingestion, themes, and internationalization have varying work-in-progress
status and should be checked before publication.

Technical evidence includes a TypeScript monorepo with React/Vite and Bun/
Express, SurrealDB graph-shaped records, BM25 plus HNSW vector retrieval,
weighted result merging/reciprocal-rank fusion, provider-configurable language
models and embeddings, and embedding lifecycle metadata. Real-time editing uses
Tiptap, Yjs, and Hocuspocus with access-aware WebSocket authentication and
persistence. Spyglass supports immediate SSE streaming and queued Deep Focus
runs with persisted events, worker leases, cancellation, recovery, and replay.
The client includes responsive dashboards, rich editing, graph interaction,
keyboard shortcuts, onboarding, themes, English/Spanish/French catalogs, and
routes for ideas, tasks, agenda, tags, files, sources, sharing, import/export,
and administration. Docker Compose, migrations, backup/export scripts, and
unit/Playwright coverage support self-hosting and ongoing delivery.

**Safe narrative:** worked on a knowledge product that combined graph-based
information architecture, hybrid retrieval, collaborative editing, grounded AI
answers, and self-hostable deployment.

**Do not claim without confirmation:** user count, growth, market success,
accuracy/factuality, production scale, formal leadership title, or that Aidan
personally authored every subsystem.

### Thalweg — local-first temporal event mesh

**Evidence status:** active work in progress; repository at
`https://github.com/QuasarBrains/Thalweg`. Confirm Aidan's role, QuasarBrains
relationship, intended use case, and which behavior has run on real devices
versus deterministic acceptance environments.

Thalweg is a local-first chronological event mesh. It accepts heterogeneous
typed events, preserves immutable history, allows local queries/subscriptions,
and synchronizes permitted history across explicitly connected authenticated
devices. It is designed as a temporal layer beneath AI/personal-data products;
Noeko is the separate durable semantic-knowledge layer, so raw telemetry does
not automatically become graph data.

The MVP evidence includes a Go daemon with newline-delimited JSON over a local
Unix socket, BadgerDB event storage, occurred/inserted/propagated timestamps,
persistent HLC ordering, network-scoped idempotent event IDs, versioned IPC,
bounded frames, machine-readable errors, live subscriptions, durable siphons,
network status, and mesh commands. The peer mesh uses restart-stable libp2p
identities, logical network memberships, peer-bound HMAC handshakes, inventory/
digest reconciliation, bidirectional missing-event transfer, coalesced sync,
anti-entropy, peer health, and backoff. Conflicts are preserved losslessly for
operator inspection. Durable siphons provide receipt-order cursors,
acknowledgement, and at-least-once restart retry. Go CLI/TUI/Console surfaces,
TypeScript and Python SDKs, diagnostics, Mesh Lab operations, Go tests, fuzzing,
and two-device acceptance scenarios make the system inspectable.

**Safe narrative:** built toward a private local-first event layer that makes
chronology, replication, conflict behavior, processing reliability, and
operator visibility explicit before selected context becomes durable knowledge.

**Known boundary:** credential rotation/revocation, WAN relay/NAT traversal,
policy-driven retention, blob transfer, mobile clients, durable compute
scheduling, and a production remote dashboard remain deferred or incomplete.
Do not call it a finished distributed platform or enterprise security system.

### ContentSweet / WriteSweet — AI-assisted writing workspace

**Evidence status:** substantial prototype; user-designated Graveyard project;
repository at `https://github.com/AidanTilgner/ContentSweet`. The source uses
both ContentSweet and WriteSweet; confirm the preferred name, role,
collaborators, and whether it was deployed or used.

This TypeScript React/Express application combines publications, posts,
personas, rich editing, comments, conversations, and creator tools. The
Tiptap/ProseMirror editor includes headings, lists, links, images, code blocks,
typography, underline, placeholders, menus, copy/export-as-HTML behavior,
keyboard work, and a custom inline-comment node. TypeORM/SQLite models users,
publications, posts, personas, conversations, messages, tags, and tokens.
JWT access/refresh tokens, protected routes, admin checks, Socket.IO
subscriptions, and real-time message delivery are evidenced.

The AI layer includes publication-scoped assistant Eddy with persisted context,
mention-triggering, and a tool-call loop, plus DreamWriter generation and
rephrasing through structured GPT-4o outputs intended for editor insertion.
Audio uploads are chunked for Whisper transcription and converted into a new
publication post. Substack import is present only as an unfinished/coming-soon
surface.

**Safe narrative:** built a full-stack AI-assisted writing workspace spanning
rich authoring, editorial comments, audience personas, real-time conversation,
structured generation, and audio-to-post transcription.

**Known boundary:** no verified launch, users, outcomes, or production
reliability; visible TODOs remain; the reviewed snapshot has no visible test
suite, permissive CORS, and unfinished product areas.

### Simple Agent — experimental agent framework and CLI

**Evidence status:** work in progress; repository at
`https://github.com/QuasarBrains/Simple-Agent`. Confirm ownership, dates,
relationship to companion projects, and whether it is archival or active.

Simple Agent is a Python experiment organized around perception → inference →
action. The loop collects stimuli and tool results, recalls relevant memory
and incomplete tasks, sends the assembled context to a model, then executes
tool calls or returns a user message. Tasks have descriptions, requirements,
notes, and completion state. A pub/sub layer separates input, tool output,
logs, errors, and responses.

The project abstracts OpenAI, Anthropic, and Google model providers; exposes a
tool contract and Toolbox registry; supports Helpful Assistant, Developer, and
Researcher roles; and optionally connects semantic/episodic Markdown memory to
Simple Vector Store. Tools include project search, filesystem operations, shell,
web requests/search/scraping, and Python execution. Rich terminal output,
dotenv configuration, documentation, and activity logs support experimentation.

**Safe narrative:** prototyped an extensible LLM-agent loop with explicit
context, task state, tool contracts, role-specific capabilities, provider
abstraction, and optional persistent memory.

**Critical limitation:** the reviewed shell tool uses `subprocess.run(...,
shell=True)` and filesystem/tool access lacks an apparent sandbox, approval
gate, path policy, or isolation. Present this as an early systems experiment
and a source of safety lessons, not as a secure autonomous-agent framework.

### Simple Vector Store — local semantic-search infrastructure

**Evidence status:** early release; repository at
`https://github.com/AidanTilgner/Simple-Vector-Store`. Confirm build context,
audience, actual use, and whether it should be presented independently or as
Simple Agent infrastructure.

Simple Vector Store turns a directory of text or source files into a local
semantic-searchable store. A Python Click CLI manages named stores, build,
search, sync, rename, and removal. A Flask/Gunicorn API provides store and
search endpoints. A registry SQLite database tracks stores while each store
uses SQLite/Sqlean and `sqlite-vss`; OpenAI embeddings are generated separately
for filenames/titles and file content.

The lifecycle includes directory walking and extension filtering, initial
build, change detection, re-embedding, stale-record deletion, retries, pacing,
truncation, progress output, and query thresholds. `_private` paths,
frontmatter `private: true`, and `.svsignore` provide basic source exclusions.
Simple Agent's optional memory adapter consumes this service for semantic and
episodic Markdown memory.

**Safe narrative:** built a compact file-backed semantic-search tool with CLI
and REST interfaces, multiple stores, incremental synchronization, and an
integration path for agent memory.

**Known boundary:** early release, no visible API authentication, older
`text-embedding-ada-002` integration, single-record file indexing rather than
a sophisticated chunking/reranking pipeline, and no visible automated test
suite.

### KitSmith — structured product catalog and comparison

**Evidence status:** public source with no verified release/deployment status;
repository at `https://github.com/KitSmith-us/KitSmith`. Confirm ownership,
commercial context, dates, role, users, and whether the tactical-equipment
domain is appropriate for public framing.

KitSmith is an authenticated catalog and comparison application for specialized
equipment. Products have common fields—manufacturer, purpose, descriptions,
MSRP, links, notes, tags, and media—plus product-type-specific field
definitions and domain attributes. SQLite/TypeORM manage products, types,
tags, images, users, and refresh tokens. SQLite FTS5 indexes product names and
descriptions; the React client provides search, filters, product pages, cards,
and structured side-by-side comparison.

The admin workflow covers products, types, tags, users, rich descriptions, and
image metadata. A Puppeteer/OpenAI function-call flow retrieves relevant text
from a product page and returns an editable structured draft for human review.

**Safe narrative:** developed a category-aware product information system that
combined structured data modeling, full-text search, comparison UX, admin
workflows, and human-reviewed AI-assisted intake.

**Known boundary:** AI extraction is source-to-draft, not proof of correctness
or automatic publication. The reviewed router snapshot raises authorization/
CORS concerns; do not describe it as security-hardened, production-ready, or
validated by catalog/customer metrics without further evidence.

### QuasarBrains Developer / JuniorGPT — developer-agent prototype

**Evidence status:** pre-release, explicitly unreliable partial prototype;
user-designated Graveyard project; repository at
`https://github.com/QuasarBrains/Developer`. The source uses Developer,
JuniorGPT, and Developer Agent; confirm the preferred name and Aidan's role.

The project explores a local developer-supporting agent rather than a model
alone. A Go executable initializes SQLite, an in-process pub/sub bus, an agent
loop, and local web server. The runtime assembles perception from environment,
memory, and agency; calls an OpenAI GPT-4 wrapper; parses function calls;
dispatches toolbox actions; logs history; and publishes events. Agency has
long-, middle-, and immediate-term horizons, with pause behavior around errors.

The React/TypeScript UI includes conversation, projects, settings, and a
Logbook for model history and logs. Socket.IO sends conversation and state
updates; SQLite persists messages, logs, model history, and project metadata.
The working toolbox includes communication, scratch notes, goal-setting, and
self-pausing. TextIDE, direct codebase navigation/editing/shell/version-control
operations, robust developer tooling, multi-agent specialization, and several
cost/safety controls are planned rather than demonstrated as complete.

**Safe narrative:** explored a local-first developer-agent architecture with
explicit environment/memory/agency state, tool calling, human-visible logs,
real-time control surfaces, and project context.

**Known boundary:** do not present planned IDE or autonomous coding features as
shipped; the snapshot lacks visible authentication and strong path/origin
controls and is not a production-ready coding agent.

### LiveSearch — audio-to-structured-notes experiment

**Evidence status:** unfinished; user-designated Graveyard project; repository
at `https://github.com/AidanTilgner/LiveSearch`. Confirm title, role, audience,
and whether it was deployed or demoed.

LiveSearch is a Next.js/React/TypeScript prototype where browser `MediaRecorder`
captures WebM audio, a server route sends it to OpenAI Whisper, and a second
route sends the transcript to GPT-3.5 function-call extraction in `notes` mode.
The interface keeps a transcript list and generated title/content notes side
by side, preserving a visible relationship between source and synthesis.
Tailwind/Sass provide the responsive UI. PocketBase login routes and audio
utility code indicate adjacent experimentation; automatic recording is marked
as coming soon.

**Safe narrative:** prototyped an audio-to-notes workflow connecting browser
recording, Whisper transcription, structured GPT extraction, and a traceable
responsive interface.

**Known boundary:** unfinished, sparse two-commit history, no visible test
suite, no evidence of accuracy/adoption, manual recording in the visible flow,
and older model/SDK patterns.

### Airtisan — insufficient evidence

The intake contains only `assets/airtisan-favicon.svg`. There are no project
notes, repository findings, timeline, role, implementation details, or status
evidence. Do not include Airtisan in a skills narrative until source material is
provided.

## Cross-project progression

The catalog supports a coherent technical arc, provided it is described as an
interpretation of the work rather than a claim about continuous employment:

1. **Structured product systems (2023):** KitSmith explored category-aware
   schemas, search, comparison, admin workflows, and source-to-draft AI intake.
2. **Agent architecture (2023–2024):** Developer/JuniorGPT and Simple Agent
   made environment, memory, agency, tools, roles, goals, observability, and
   stop conditions explicit.
3. **Multimodal and editorial workflows (2023–2024):** LiveSearch and
   ContentSweet connected audio, transcription, structured extraction, writing,
   editing, personas, and conversations.
4. **Retrieval foundations (2023–2025):** Simple Vector Store turned ordinary
   file trees into maintainable local semantic indexes and became an optional
   memory backend for Simple Agent.
5. **Knowledge product (2025–2026):** Noeko combined graph information
   architecture, hybrid retrieval, collaboration, grounded answers, durable AI
   workflows, self-hosting, and product/team practice.
6. **Temporal infrastructure (2026):** Thalweg separates raw chronological
   event processing from durable knowledge, adding identity, replication,
   conflict semantics, durable consumers, SDKs, and operational visibility.

## Chronology supported by repository activity

These dates describe visible repository activity, not necessarily employment,
release, or continuous work:

| Period | Evidence |
| --- | --- |
| 2023-06 to 2024-05 | LiveSearch audio-notes experiment; sparse public history. |
| 2023-10 to 2023-12 | KitSmith catalog/search/comparison build; Simple Vector Store initial build. |
| 2023-12 to 2024-03 | Developer/JuniorGPT agent prototype. |
| 2024-05 to 2024-12 | ContentSweet/WriteSweet writing workspace and AI/conversation work. |
| 2024-08 to 2025-04 | Simple Agent agent-loop, memory, roles, tools, and provider work. |
| 2025-02 to 2026-08 | Noeko sustained product, retrieval, collaboration, AI, and testing work. |
| 2026-04 to 2026-08 | Thalweg local-first event mesh, synchronization, conflicts, SDKs, and Console. |

## Claims requiring confirmation before a pitch deck

The following details are not safely inferable from the project catalog and
should be collected directly from Aidan:

- preferred public name and status for every project;
- exact role, ownership, collaborators, and division of labor;
- employment, client, company, or cofounder context and dates;
- users, deployments, revenue, adoption, performance, accuracy, or other
  outcomes;
- which Noeko systems Aidan personally implemented, led, reviewed, or directed;
- Noeko team size, leadership examples, acquisition experiments, and concrete
  user feedback;
- the motivating real-world use case and intended audience for Thalweg;
- which Thalweg tests ran across actual devices and what remains lab-only;
- approved screenshots, demos, diagrams, logos, and rights/clearance for all
  visual assets;
- whether archival projects should appear in a pitch narrative at all.

Do not turn repository activity into claims such as “launched,” “scaled,”
“improved accuracy,” “saved time,” “led a team,” or “served customers” without
direct supporting evidence.

## Source inventory and visual notes

The reviewed intake includes project research, skills notes, timelines, asset
manifests, and a Graveyard queue. Candidate visual assets are mostly logos or
icons. Noeko has a README demo video; Simple Agent has a terminal demo GIF;
Thalweg has no standalone publishable visual; Developer's old README preview
URL returned 404; ContentSweet and KitSmith contain branding assets but no
approved product screenshots. Treat all assets as evidence/candidates pending
public-use confirmation. Do not publish screenshots containing private data,
credentials, customer information, or unfinished features represented as
complete.

## Suggested short positioning

“I build AI-native products and the systems around them: tools that turn messy
human or machine input into structured, searchable, connected knowledge. My
work spans full-stack product engineering, agent workflows, retrieval, rich
collaboration, and local-first infrastructure. I care about making intelligent
systems observable, reviewable, resilient, and respectful of user control.”

This is a synthesis of the catalog, not a verified first-person statement;
adjust it after confirming Aidan's preferred voice and scope.
