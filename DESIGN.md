# Design Direction

## Product statement

This is an adaptive professional front page. A visitor expresses an interest
through a suggested prompt, a typed question, or eventually another contextual
signal. The site retrieves relevant knowledge and assembles the strongest
pre-authored evidence about Aidan into a workspace.

The experience should establish professional credibility and simultaneously
demonstrate how Aidan approaches agents, information architecture, and adaptive
interfaces.

## Audiences

The primary audiences are:

1. A potential investor evaluating Aidan or a company he is building.
2. A potential employer evaluating previous work and technical range.
3. A potential client looking for product engineering, a one-off site, or
   consultation.

Personal publishing and experiments are part of the site, but they do not lead
the default professional experience.

## The aha moment

The defining moment occurs when a visitor selects a useful starter prompt or
asks a natural-language question and the site responds in two coordinated ways:

1. Cosmo gives a concise conversational answer.
2. The workspace populates with relevant, authored content blocks.

The response should feel fast and legible. The visitor should immediately
understand that the workspace changed because of their request.

Generating new widget code at runtime is a future experiment, not part of the
current product contract.

## Experience model

### Arrival

The first viewport must communicate, without requiring interaction:

- who Aidan is;
- the kind of work he does;
- that the page can be queried;
- several credible questions worth asking; and
- where retrieved evidence will appear.

The visitor should not be forced through an intro animation before reaching the
professional content.

The identity content is the workspace's default state, not a separate hero
above the experience. When a query resolves, retrieved evidence replaces that
default state in the same surface.

### Conversation station

The prompt is a primary control, not a floating support widget. Suggested
prompts should be audience-aware and phrased around intent rather than database
categories. Examples include asking about AI work, selected projects,
capabilities, or ways to work together.

Cosmo is the site guide, response narrator, and streaming-status indicator. The
character should add warmth without making the professional surface feel like a
novelty site.

The conversation station is part of the page itself. It should not be framed as
a floating card or explained with labels, panel numbers, instructional copy, or
dashboard chrome. Connection state may be communicated through a restrained
status affordance with a tooltip.

### Content workspace

The workspace is the visual center of gravity. It starts with Aidan's identity,
positioning, short description, and primary actions, then becomes an ordered
collection of relevant blocks. The system should favor evidence over
self-description.

On the home route, the combined workspace and conversation station fills the
viewport beneath the navigation. The document does not scroll; only the dynamic
workspace may scroll when its content exceeds the available height.

Longer term, blocks should use semantic presentation types such as:

- case-study summary;
- project gallery;
- role or experience timeline;
- capability group;
- outcome, testimonial, or proof point;
- long-form text;
- link collection;
- contact action; and
- interactive experiment.

The existing trusted HTML block format remains supported during the transition.

## Information architecture

The primary layer is professional:

- Home / adaptive workspace
- Work
- Experience and capabilities
- About and contact

The secondary layer is exploratory:

- Writing
- Experiments and collected material
- Petting zoo

Conventional URLs remain important even when the agent can retrieve the same
material. They provide predictable browsing, stable sharing, graceful failure,
accessibility, and indexing.

## Visual language: Mid-Century Terminal

The intended mood is premium vintage hardware documentation: an early IBM
mainframe manual translated into a precise, contemporary workstation. It is not
a literal shell emulator. The system should communicate intentional utility,
mechanical construction, and editorial confidence.

### Core principles

- Use generous, deliberate whitespace to establish hierarchy. Do not substitute
  oversized display type for composition.
- Keep surfaces sharp, crisp, and grid-bound. Controls and content frames use
  square corners, with a maximum radius of 2px only when technically necessary.
- Preserve the near-black grid background and use restrained tonal separation
  between surfaces.
- Use thin, low-opacity structural rules. The conversation panel divider should
  match the grid rather than read as an accent flourish.
- Keep ornament minimal. Authored content, ASCII work, and interaction state
  provide the visual character.
- Use motion only for streaming state, block arrival, and meaningful spatial
  reordering.

### Typography

- JetBrains Mono is the heading face for H1–H3. Headings use sentence case or
  lowercase, 600 weight, and tight tracking between `-0.02em` and `-0.04em`.
- IBM Plex Mono is the body, interface, chat, prompt, metadata, and ASCII face.
  It uses neutral to slightly relaxed tracking between `0` and `0.01em`.
- The home identity has a hard ceiling of `3.5rem` / `56px`.
- Section headings top out at `1.75rem` / `28px`.
- Body copy remains between `0.95rem` / `15px` and `1rem` / `16px`.
- Conversational responses may increase to `1.15rem` / `18.5px` in the full
  station so generated answers remain comfortably readable; the compact
  assistant uses `0.95rem` / `15px`.
- UI and metadata default to `0.8rem` / `13px` or smaller when the label is
  genuinely secondary.
- Prose paragraphs use a maximum measure of `65ch`.

### Color and interaction

- The background remains near-black with the existing subtle grid.
- Primary headings use `#F3F4F6`; body text uses `#D1D5DB`; secondary UI uses
  `#9CA3AF` with careful opacity rather than pure white.
- The darker vibrant purple remains the primary syntax and interaction accent.
  A small warm accent may identify Cosmo.
- Buttons use square corners and explicit state swaps. Hover should invert the
  surface or exchange a sharp neutral and accent border, not merely fade.
- Focus states remain visible, high contrast, and keyboard accessible.

The navigation is a minimal sticky bar. It uses slightly more vertical and
horizontal space at the top of a page, then condenses once the page scrolls.

## Site-wide assistant direction

The homepage keeps the full embedded conversation station and adaptive
workspace. Conventional routes may expose Cosmo through a compact floating
assistant that stays secondary to the page until opened. Retrieved blocks are
represented there as concise evidence summaries, with an explicit handoff to
the full homepage workspace.

The assistant should remain anchored and predictable rather than wandering
around the viewport. Conversation and selected context persist during navigation
within the current browser tab. The first release covers Work, Writing, Lab, and
their detail pages; the Petting Zoo is excluded until its separate redesign.

The complete product and implementation specification lives in
`docs/sitewide-cosmo.md`.

## Content principles

- Lead with demonstrated work, decisions, and outcomes.
- Keep claims specific and support them with artifacts where possible.
- Do not invent missing project context merely to fill a layout.
- Mark archival work clearly when it no longer represents current practice.
- Author content once and make it retrievable through both adaptive and
  conventional paths.

## Current implementation phase

The current visual pass establishes the consolidated, viewport-height
workstation, the Mid-Century Terminal token system, minimal adaptive navigation,
workspace default state, prompt controls, responsive behavior, quiet connection
states, and the site-wide Cosmo assistant on eligible conventional routes.
Detailed case studies, current positioning, richer semantic block renderers,
page-context retrieval, and generated widgets are subsequent content/product
phases.
