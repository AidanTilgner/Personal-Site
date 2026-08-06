# Working Agreement

Read `DESIGN.md` before changing the product surface. Read
`docs/express-to-elysia.md` before changing the backend or chat protocol.
Read `docs/knowledge-base.md` before adding or updating retrievable knowledge,
widgets, block aliases, or other adaptive-workspace content.
Read `docs/projects.md` before adding or updating a project or project page.
When a project begins as a folder of loose notes or assets, also follow
`docs/project-intake.md` from inventory through browser preview.
Read `docs/sitewide-cosmo.md` before changing the assistant outside the home
workspace or changing cross-route conversation persistence.

## Product intent

This site is an adaptive professional front page for Aidan Tilgner. Its defining
interaction is not a conventional portfolio with a chat widget attached. A
visitor asks a question and the site assembles relevant, pre-authored evidence
into a content workspace.

The interface should demonstrate the same product and engineering judgment that
the content describes.

## Durable decisions

- Keep the conversational interface central to the home page.
- Keep conventional routes for direct browsing, sharing, accessibility, and
  search indexing.
- Keep Cosmo the ASCII camel as the site guide and a source of restrained
  personality.
- Prefer semantic, reusable content blocks over page-specific markup.
- Let professional work and capabilities lead. Writing, experiments, the
  petting zoo, and collected material remain discoverable but secondary.
- Preserve the two-process Astro + Elysia architecture unless a later decision
  explicitly replaces it.
- Treat `types/chat.d.ts` as the chat protocol contract.

## Visual guardrails

- Aim for a Mid-Century Terminal: dark, quiet, precise, content-forward, and
  reminiscent of premium vintage hardware documentation.
- Use JetBrains Mono for sentence-case or lowercase headings and IBM Plex Mono
  for body copy, interface text, prompts, metadata, chat, and ASCII work.
- Establish hierarchy with generous whitespace and restrained type scale. Cap
  the home identity at 56px, section headings at 28px, and body copy at 16px.
- Keep construction sharp and grid-bound. Avoid pill controls and large radii;
  interactive corners should be square or no more than 2px.
- Limit prose to 65ch and use thin, low-opacity structural rules.
- Use vibrant purple as the primary accent against the black, white, and gray
  palette.
- Avoid generic SaaS dashboards, glassmorphism, excessive gradients, neon
  overload, and decorative terminal clichés.
- Motion must explain state or spatial change and respect reduced-motion
  preferences.
- New interactions must be keyboard accessible and have visible focus states.

## Implementation expectations

- Do not silently replace user-authored content with invented résumé claims or
  project outcomes.
- Keep the home page useful before the visitor submits a prompt and while the
  backend is unavailable.
- A content block should be able to appear in the adaptive workspace and on a
  stable conventional route.
- Preserve unrelated worktree changes.
- Run `bun run check`, `bun run build:astro`, and `bun test` after material
  frontend or protocol changes. Run `cd cli && go test ./...` after CLI changes.
