# Express to Bun + Elysia migration

## Status

Implemented in August 2026. The backend now runs directly on Bun with Elysia,
the browser uses a native WebSocket protocol, and Express, Socket.IO, Axios, and
the Astro API proxy have been removed. The follow-up knowledge modernization is
also complete: nlp.js has been replaced by synchronized hybrid retrieval, and
generation now uses GPT-5.6 Luna through the OpenAI Responses API.

The implementation keeps Astro and Elysia as separate processes. It includes
runtime-validated request and response schemas, a required origin allowlist,
payload and backpressure limits, rate and concurrency controls, explicit
knowledge readiness, disconnect cancellation, and Bun contract tests.

## Goals

- Run the content backend directly on Bun with Elysia.
- Preserve the current block selection, block HTML, conversation persistence,
  and streamed assistant-response behavior.
- Replace the untyped Express request surface with runtime-validated contracts.
- Remove the race-prone coupling between an HTTP request and a Socket.IO client
  ID.
- Make the server testable without binding a port.

## Non-goals

- Redesigning the site or removing its modular content widgets.
- Moving the Go authoring CLI.
- Combining Astro and Elysia into one production process during the first
  migration. Keeping their deploy lifecycles separate makes rollback simpler.

## Migrated contracts

| Surface                      | Behavior                                                                     |
| ---------------------------- | ---------------------------------------------------------------------------- |
| `GET /health`                | Returns process and knowledge-index readiness                                |
| `POST /v1/blocks/query`      | Versioned deterministic block-retrieval endpoint                             |
| `GET /v1/blocks/:id/content` | Versioned parsed block HTML route used by the frontend                       |
| `WS /v1/chat`                | Selects blocks and streams assistant events on one request-correlated socket |
| `SERVER_PORT`                | Defaults to `8080`                                                           |
| `ASTRO_PORT`                 | Defaults to `4321` in development and `3004` in production                   |
| `PUBLIC_BACKEND_URL`         | Build-time frontend backend URL                                              |
| `CORS_ORIGINS`               | Comma-separated HTTP and WebSocket origin allowlist                          |
| `AI_MONTHLY_BUDGET_USD`      | Optional persistent UTC-month AI spending ceiling                           |
| `AI_BUDGET_DB_PATH`          | Budget reservation ledger; defaults to `app/data/ai-budget.sqlite`           |

## Current architecture

Keep two processes initially:

```text
Browser
  ├─ HTTP → Astro (ASTRO_PORT; 4321 dev / 3004 production by default)
  └─ WebSocket + block HTTP → Elysia (SERVER_PORT; 8080 by default)
```

The Elysia application is created separately from the listening process:

```text
app/
  app.ts                     # createApp(); no listen side effect
  index.ts                   # reads config and calls app.listen()
  blocks/                    # trusted widget definitions and HTML parsing
  knowledge/                 # source adapters, chunking, SQLite sync, retrieval
  gpt/                       # prompt assembly and Responses API event streaming
  routes/
    chat.ts                  # /v1/chat WebSocket and framework-free handler
    schemas.ts               # Elysia runtime request schemas
```

The existing `app/blocks` domain code should move with minimal behavioral
change. Framework context objects must not enter the service layer.

## WebSocket protocol

Do not attempt to connect the existing Socket.IO client to Elysia's native
WebSocket endpoint; the protocols are not compatible. Replace both ends in one
phase.

Client request:

```json
{
  "type": "chat.request",
  "requestId": "client-generated-id",
  "conversation": [{ "role": "user", "content": "Projects." }]
}
```

Server messages, in order:

```json
{ "type": "content.blocks", "requestId": "...", "blocks": [] }
{ "type": "assistant.delta", "requestId": "...", "index": 0, "text": "..." }
{ "type": "assistant.done", "requestId": "...", "message": "..." }
{ "type": "assistant.suggestions", "requestId": "...", "suggestions": ["..."] }
```

`assistant.suggestions` is an optional enrichment step after the completed
answer. The server asks the model for three grounded next questions using the
recent visitor questions, completed answer, and retrieved knowledge excerpts.
The payload is schema-constrained and validated before it reaches the client.
If this secondary request fails or returns invalid questions, the server sends
an empty list so the client can restore authored defaults; the successful
answer must not become an error.

Failures use one envelope:

```json
{
  "type": "error",
  "requestId": "...",
  "code": "RESPONSE_GENERATION_FAILED",
  "message": "Something went wrong."
}
```

When the local monthly AI ceiling is exhausted, the same envelope uses
`MONTHLY_BUDGET_REACHED`. This is a deliberate availability state, not a model
failure, and the frontend should show the server-provided explanation.

Sending block selection and assistant deltas over the same connection removes
the current global connection registry, `x-socket-id` header, and timing race
between Socket.IO connection setup and `POST /api/content`.

All incoming and outgoing messages should use Elysia `t.Object()` schemas.
Set an explicit maximum message size, validate conversation length and message
length, and reject unknown message types.

## HTTP API

The HTTP surface is fully versioned:

- `GET /health` returns process and knowledge-index status.
- `GET /v1/blocks/:id/content` returns `text/html; charset=utf-8`.
- `POST /v1/blocks/query` exposes deterministic block retrieval for tests and
  tooling.

Use a narrow configurable CORS allowlist rather than `origin: "*"`. Return
consistent JSON errors and never expose provider errors or API keys.

## Migration record

The sections below describe the rollout that was used. All four migration
phases are complete; production-hardening items remain useful follow-up work.

### 1. Characterize and extract — complete (historical)

- Add Bun tests around representative queries and their selected block IDs.
- Add contract tests for the two current HTTP endpoints.
- Move block and generation logic behind framework-free services.

### 2. Add the Elysia HTTP application — complete

- Add `elysia` and the official CORS plugin.
- Build `createApp()` and Elysia versions of the health and block routes.
- Validate bodies, params, headers, and response shapes.
- Test routes through `app.handle(new Request(...))` using `bun:test`.
- Run Express and Elysia contract suites against the same fixtures before
  removing Express HTTP routing.

### 3. Replace Socket.IO — complete

- Add the `/v1/chat` Elysia WebSocket route and message schemas.
- Replace `socket.io-client` with a small native WebSocket client module.
- Correlate every event with `requestId`; allow only one active response per
  request and support cancellation when the socket closes.
- Apply backpressure limits and stop reading the provider stream when a client
  disconnects.
- Remove the Astro `/api/content` proxy after the client has fully cut over.

### 4. Remove compatibility code — complete

- Remove Express, CORS middleware, Socket.IO, Socket.IO client, Axios, and the old
  route modules.
- Keep Elysia-owned block HTML under `app/public/blocks` for now.
- Add graceful shutdown for WebSockets and in-flight streams.

### 5. Knowledge and model modernization — complete

- Synchronize Markdown, block, and owner-profile sources into local SQLite.
- Index broad documents and conservative overlapping sections.
- Combine exact aliases and lexical matching with OpenAI embedding similarity.
- Select trusted widgets deterministically from retrieval metadata.
- Add optional, structured, source-grounded tuning for automatic project and
  writing preview copy without giving the model block-selection authority.
- Remove nlp.js, its training corpus, and its generated metadata.
- Replace `openai-edge` and the legacy `ai` adapter with the official OpenAI SDK.
- Stream typed GPT-5.6 Luna Responses API events through the existing WebSocket.
- Remove the context-insensitive JSON response cache.

### 6. Production hardening — substantially complete

- Enforce origin, payload-size, rate-limit, concurrency, and idle-timeout
  policies.
- Bound conversations to 20 messages and 16,000 total characters before
  retrieval or model calls.
- Optionally enforce `AI_MONTHLY_BUDGET_USD` through a persistent SQLite
  reservation ledger. Each API call reserves against UTF-8 input bytes (a
  conservative token upper bound), configured per-million-token prices,
  maximum output tokens, long-context multipliers, and a 1.25 safety factor.
  Reservations are intentionally not refunded, so provider errors cannot make
  the local accounting optimistic.
- Sanitize trusted block HTML, replace embedded scripts with registered widget
  behaviors, and render assistant Markdown without raw HTML.
- Bound persisted conversations and validate server events in the browser.
- Add structured request logs, request IDs, and redacted error reporting.
- Document the reverse-proxy routing for Astro and Elysia.

## Test plan and acceptance criteria

The migration is complete when all of the following pass:

```bash
bun install --frozen-lockfile
bun run check
bun run lint
bun run build:astro
bun test
cd cli && go test ./...
```

- `Projects.` selects the projects and résumé blocks through hybrid retrieval.
- `donut` deterministically selects the existing donut widget.
- An unknown prompt returns the fallback block.
- Block HTML substitution handles valid and invalid IDs correctly.
- WebSocket messages are schema validated and ordered by `requestId`.
- Disconnecting cancels provider streaming without an unhandled rejection.
- Missing `OPENAI_API_KEY` leaves lexical block selection operational and
  produces a typed generation error.
- Home, blog, projects, stuff, and petting-zoo pages remain visually unchanged.

## Risks and rollback

- Elysia native WebSockets are not Socket.IO compatible, so server and client
  cutover must ship together.
- The generated SQLite database must live on persistent storage in production or
  embeddings will be rebuilt after ephemeral restarts.
- The AI budget database must also be persistent. A local SQLite ledger is
  appropriate for one backend instance; horizontally scaled backends need a
  shared transactional budget store.
- Changes to the embedding model, dimensions, or chunker require a compatible
  index refresh; these values are recorded in the database.

## References

- [Elysia migration guide from Express](https://elysiajs.com/migrate/from-express)
- [Elysia validation](https://elysiajs.com/essential/validation)
- [Elysia WebSockets](https://elysiajs.com/patterns/websocket)
- [Testing Elysia with Bun](https://elysiajs.com/patterns/unit-test)
- [Bun package manager lockfiles](https://bun.sh/docs/pm/lockfile)
