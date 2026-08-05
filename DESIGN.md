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

## Visual language

The intended mood is an elegant terminal-like workstation, not a literal shell
emulator.

- Near-black background with restrained tonal separation between surfaces.
- Warm off-white primary text and quieter cool-gray secondary text.
- A vibrant but controlled purple accent; a small warm accent may identify
  Cosmo.
- Editorial sans-serif typography for content.
- Monospace typography for prompts, metadata, system state, and ASCII art.
- Geist Sans and Geist Mono are the current working type pairing.
- Thin rules, disciplined alignment, generous negative space, and compact
  controls.
- Minimal ornament. Content blocks provide most of the visual variety.
- Motion is used for streaming state, block arrival, and spatial reordering.

The navigation is a minimal sticky bar. It uses slightly more vertical and
horizontal space at the top of a page, then condenses once the page scrolls.

## Content principles

- Lead with demonstrated work, decisions, and outcomes.
- Keep claims specific and support them with artifacts where possible.
- Do not invent missing project context merely to fill a layout.
- Mark archival work clearly when it no longer represents current practice.
- Author content once and make it retrievable through both adaptive and
  conventional paths.

## Current implementation phase

The current visual pass establishes the consolidated, viewport-height
workstation, minimal adaptive navigation, workspace default state, prompt
controls, responsive behavior, and quiet connection states. Detailed case
studies, current positioning, richer semantic block renderers, and generated
widgets are subsequent content/product phases.
