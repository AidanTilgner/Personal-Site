# Site-wide Cosmo Assistant

## Status

The shared session foundation and floating-assistant first release are
implemented. Page-context protocol changes and richer conventional block links
remain subsequent work.

## Summary

Cosmo should make the adaptive knowledge system available throughout the site
without turning every route into the homepage workstation.

On conventional pages, Cosmo appears as a fixed launcher near the lower-right
corner. Activating the launcher opens a compact conversation panel. The panel
supports the same conversation as the homepage, but renders retrieved context
as concise evidence summaries rather than full content blocks. A visitor can
move the conversation into the homepage workspace when they want the complete
material.

Cosmo is anchored rather than literally wandering around the page. Small idle
motion may give the character life, but the control must remain predictable and
must not obscure reading or navigation.

## Product goals

- Make the site's defining conversational interaction discoverable from Work,
  Writing, Lab, and long-form detail pages.
- Preserve the conventional page as the visual center of gravity until the
  visitor intentionally opens Cosmo.
- Keep one conversation continuous as the visitor moves between routes.
- Show why an answer is credible through compact references to retrieved
  authored content.
- Provide a clear path from a compact answer to the full adaptive workspace.
- Retain Cosmo's warmth without resembling a customer-support widget.

## Non-goals for the first release

- Rendering arbitrary full HTML widgets inside the floating panel.
- Generating new UI or content blocks at runtime.
- Letting Cosmo move unpredictably around the viewport.
- Replacing the homepage's full workspace.
- Persisting conversations across devices or beyond the current browser
  session.
- Adding the assistant to the Petting Zoo before that route receives its own
  design pass.

## Route behavior

### Home

The existing embedded workstation remains the primary experience. The floating
launcher is not rendered, preventing duplicate chat clients and competing
controls.

### Work, Writing, Lab, and detail pages

Render the floating launcher and compact assistant. Page content remains
fully usable with the assistant closed, connecting, or offline.

### Petting Zoo

Do not render the launcher in the first release. Revisit its placement and
character relationship when the Petting Zoo is redesigned.

## Interaction model

### 1. Dormant launcher

- Fixed to the lower-right safe area.
- Presents the Cosmo ASCII silhouette inside a quiet, high-contrast control.
- Minimum hit target: 56 by 56 CSS pixels.
- Tooltip or accessible name: `Ask Cosmo about Aidan`.
- May use a restrained one-time entrance or idle movement.
- Displays a small status dot only when connection state is useful.

### 2. Open panel

Desktop and large tablet:

- Width: approximately 380 to 420 pixels.
- Maximum height: the smaller of 680 pixels or 76 percent of the viewport.
- Anchored above the launcher with 16 to 24 pixels of viewport clearance.
- A subtle border and raised near-black surface distinguish it from the page.

Mobile:

- Opens as a bottom sheet rather than a narrow floating card.
- Width: viewport minus a 12 to 16 pixel margin on each side.
- Maximum height: approximately 78 percent of the viewport, respecting safe
  areas and the software keyboard.
- Uses a quiet backdrop to separate the sheet from the page.
- Can be dismissed with the close control, Escape, or a backdrop press when no
  request is being composed.

The panel contains, in order:

1. Cosmo, connection state, and close/minimize controls.
2. The most recent visitor question using the established `You asked` pattern.
3. Cosmo's streaming or completed response.
4. A condensed context shelf when relevant blocks are returned.
5. Suggested prompts when the conversation is empty.
6. The question composer.

### 3. Condensed context shelf

The compact assistant must not inject the current trusted HTML blocks directly.
Those blocks were authored for the larger workspace and may contain scripts,
wide layouts, or dense content.

For the first release, each returned block becomes a compact evidence item:

- block name;
- block description, limited to two or three lines;
- a content-type or collection label when available;
- an optional stable conventional link; and
- an `Open in workspace` action for the whole response.

The shelf should display no more than three evidence items initially. Additional
items can be disclosed with `Show more`. It should appear after the response
begins so that retrieved evidence and conversational prose feel coordinated.

`Open in workspace` navigates to the homepage and restores the current
conversation, latest response, and selected blocks into the full workspace.

### 4. Close and return

- Closing the panel minimizes it without clearing the conversation.
- A completed response received while minimized adds a restrained unread dot.
- Reopening returns to the previous scroll position and composer state.
- A `Clear conversation` action is available in both the embedded station and
  floating assistant. It clears the transcript, retrieved blocks, latest
  question, and persisted session only after an intentional click; closing the
  panel never clears it.

## Page-aware behavior

The current route should influence the assistant without silently narrowing the
visitor's question.

First release:

- Use route-specific suggested prompts supplied by the frontend.
- After a completed response, replace the starter prompts with three generated
  follow-up questions grounded in the recent conversation, completed answer,
  and retrieved authored sources.
- Reject repeated, duplicate, malformed, or overlong generated questions and
  fall back to the authored prompts when the optional generation pass fails.
- Examples on a project page may ask about decisions, outcomes, or related
  capabilities.
- Examples on a post may ask for the connection between the article and
  Aidan's work.
- The visitor can always ask an unrestricted question.

Later release:

- Extend `ChatRequest` with optional page context:

```ts
interface PageContext {
  path: string;
  title: string;
  kind?: "project" | "post" | "lab" | "index";
  entityId?: string;
}
```

- Treat this context as a relevance hint, not a factual source.
- Knowledge retrieval must still cite or return authored knowledge blocks.

## Session and navigation model

Extract the existing connection and request state from `Experience` into a
shared `useChatSession` hook or equivalent controller. Both the embedded home
station and floating assistant consume this state machine, but only one is
mounted on a route.

Because Astro currently performs full-page navigation, persist a versioned
session snapshot in `sessionStorage`:

```ts
interface AssistantSessionV1 {
  version: 1;
  conversation: Message[];
  latestQuestion: string | null;
  assistantMessage: string;
  suggestions: string[];
  blocks: Block[];
  panelOpen: boolean;
  updatedAt: number;
}
```

Requirements:

- Validate stored data before use and apply the existing conversation bounds.
- Restore the response and blocks immediately on navigation; reconnect the
  socket independently.
- Do not store connection state, active request IDs, or streaming state.
- If navigation interrupts an active response, reconnect in an idle state and
  explain that the previous response was interrupted.
- Expire or ignore malformed and significantly old session snapshots.

## Component architecture

Recommended structure:

```text
Chat/
├── useChatSession.ts
├── chat-session-storage.ts
├── AssistantComposer.tsx
├── CosmoCharacter.tsx
├── LatestQuestion.tsx
├── AssistantResponse.tsx
├── ContextSummaryList.tsx
├── EmbeddedExperience.tsx
└── FloatingAssistant/
    ├── FloatingAssistant.tsx
    └── FloatingAssistant.module.scss
```

Integration:

- `Layout.astro` renders `FloatingAssistant client:load` on eligible routes.
- The home route continues rendering `EmbeddedExperience` and opts out of the
  floating assistant.
- `BlogLayout.astro` inherits the assistant through `Layout.astro`.
- Route eligibility is decided server-side from `Astro.url.pathname` and passed
  as explicit props rather than inferred from the browser after rendering.
- The launcher and panel use the existing WebSocket protocol in the first
  release.

Do not attempt to share React context between independent Astro islands. Shared
behavior belongs in the extracted hook/controller and durable session snapshot.

## Visual direction

- Reuse the current near-black grid surface, darker purple accent, off-white
  text, JetBrains Mono headings, and IBM Plex Mono interface text.
- Keep the launcher and panel mechanically sharp with square corners and crisp,
  low-opacity structural rules.
- Keep the launcher visibly authored: Cosmo should be recognizable as ASCII,
  not reduced to a generic circular chat icon.
- Avoid a speech-bubble silhouette, bright support badge, or generic SaaS
  header.
- Condensed context should look like an evidence index: thin rules, concise
  labels, and strong text hierarchy.
- Panel motion should use opacity and a short vertical translation. Respect
  `prefers-reduced-motion`.

## Accessibility and interaction requirements

- Launcher, close, minimize, `Show more`, and context actions are native
  buttons or links.
- Opening moves focus to the panel heading or composer; closing returns focus
  to the launcher.
- The panel is labelled as a complementary assistant region. On mobile, the
  bottom sheet uses dialog semantics and traps focus while open.
- Escape closes the panel when appropriate.
- Streaming prose uses the existing polite live region without repeatedly
  announcing the entire transcript.
- Connection state and disabled controls must retain readable contrast.
- The panel must remain usable at 320 CSS pixels wide, 200 percent zoom, and
  with the software keyboard open.
- Page content behind the desktop panel remains scrollable. Page content behind
  the mobile dialog does not.

## Failure behavior

- The launcher remains available when offline so it can explain browse mode.
- Suggested prompts remain legible but non-interactive while connecting or
  offline.
- The panel links directly to Work, Writing, and contact paths when generation
  is unavailable.
- Failure never removes or covers the underlying page content.

## Delivery phases

### Phase 1: shared assistant foundation

1. Extract the chat state machine and shared presentational components from the
   homepage `Experience` component.
2. Add validated, versioned session persistence for response and blocks.
3. Keep the homepage behavior visually unchanged.
4. Add unit tests for restoration, expiration, malformed storage, and request
   interruption.

### Phase 2: floating assistant

1. Add the launcher and responsive panel to eligible layouts.
2. Add latest-question display, streaming answer, starter or contextual
   follow-up prompts, and composer.
3. Add the condensed context shelf and homepage handoff.
4. Verify collisions with sticky navigation, page footers, and mobile safe
   areas.

### Phase 3: contextual refinement

1. Add route-specific starter prompts.
2. Add optional page context to the protocol and retrieval layer.
3. Add conventional links and richer metadata to block summaries.
4. Evaluate whether Astro view transitions improve continuity enough to adopt.

## Acceptance criteria for the first release

- Cosmo is available on Work, Writing, Lab, and their detail pages, but not on
  Home or Petting Zoo.
- Opening and closing the assistant never changes or loses the current page
  position.
- A visitor can ask a question and receive a streaming answer in the panel.
- Returned blocks appear as readable condensed evidence items rather than raw
  widgets.
- The visitor can open the same response and blocks in the full homepage
  workspace without re-asking the question.
- Conversation state survives navigation within the same tab.
- Only one WebSocket connection is created per page.
- The assistant remains useful and dismissible when the backend is unavailable.
- Desktop, mobile, keyboard, reduced-motion, and 200 percent zoom behavior are
  verified before release.

## Decisions to revisit after the first prototype

- Whether the desktop panel should be resizable.
- Whether an unread response should persist after a full browser restart.
- Whether individual evidence items should deep-link to conventional pages or
  expand inline.
- Whether route context materially improves retrieval enough to justify the
  protocol addition.
- How Cosmo should coexist with the future Petting Zoo experience.
