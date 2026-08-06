---
title: "Noeko"
description: "An open-source, self-hostable knowledge system that makes connected ideas, hybrid retrieval, collaboration, and AI-assisted answers part of one everyday workspace."
status: "active"
started: "2025-02-23"
tags: ["knowledge systems", "retrieval", "collaboration", "AI products"]
technologies: ["TypeScript", "React", "Bun", "Express", "SurrealDB", "Tiptap", "Yjs"]
highlights:
  - "Hybrid retrieval combines full-text ranking, embeddings, graph relationships, and access-aware context."
  - "Collaborative editing uses Tiptap, Yjs, and Hocuspocus with server-side persistence."
  - "Self-hosting, Markdown portability, provider configuration, and end-to-end tests are treated as product concerns."
links:
  - label: "Live product"
    href: "https://www.noeko.app/"
  - label: "Source repository"
    href: "https://github.com/noekohq/Noeko"
video:
  src: "https://www.youtube-nocookie.com/embed/ndP8Sc2CGZw?rel=0"
  title: "Noeko product walkthrough"
  caption: "Product walkthrough of Noeko's knowledge capture, graph, retrieval, and AI-assisted workspace."
featured: true
order: 100
aliases: ["Noeko", "knowledge graph", "Spyglass", "Constellation", "personal knowledge management"]
index: true
---

## Overview

Noeko is an open-source, self-hostable collaborative personal knowledge system. It is designed around a product tension: capturing an idea should feel easy, but finding and connecting that idea later should be powerful enough to justify keeping it.

## The product challenge

Traditional notes are easy to create but difficult to recover in context. More structured tools can offer richer retrieval and relationships while imposing more maintenance. Noeko treats capture, graph structure, search, collaboration, and AI synthesis as one product problem instead of separate features.

## Product and technical approach

Ideas, tasks, sources, and excerpts live in a graph-shaped model backed by SurrealDB. Search combines BM25 full-text results with embedding-based semantic search, weighted result merging, reciprocal-rank fusion, and exact-title signals. Embedding metadata and content hashes make provider and lifecycle changes explicit.

Spyglass streams access-checked answers over Server-Sent Events and supports persisted Deep Focus runs. The application also includes Constellation graph views, tags, Rabbitholes, sharing, Markdown import/export, and a collaborative Tiptap editor backed by Yjs and Hocuspocus.

The TypeScript monorepo pairs a React/Vite client with a Bun/Express API. Docker Compose provides a self-hostable path, while configurable Google, xAI, OpenAI, and deterministic providers support both production and development workflows.

## What the work demonstrates

Noeko shows how product design, information architecture, retrieval engineering, real-time collaboration, authorization, and operational portability reinforce one another. The public development record runs from February 2025 through August 2026, expanding from graph experiments into a public beta with collaboration, AI workflows, self-hosting, migrations, and end-to-end testing.

Noeko was built with cofounder and designer Bilal Azhar. The repository credits Aidan Tilgner as maintainer and Bilal as a founding design contributor; this page does not assign a more specific division of responsibility than the public record supports.

## Honest boundaries

The project remains a public beta. Internationalization, themes, Rabbitholes, and source/PDF ingestion have had varying maturity across the reviewed source. The strongest claim is not that Noeko solved personal knowledge management, but that it is a serious, evolving attempt to make structure useful without making maintenance the product.
