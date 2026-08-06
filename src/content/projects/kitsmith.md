---
title: "KitSmith"
description: "A category-aware product catalog and comparison application for turning specialized equipment research into structured, searchable, reviewable data."
status: "concept"
started: "2023-10-05"
tags: ["catalog systems", "search", "comparison UX", "AI-assisted data entry"]
technologies: ["TypeScript", "React", "Express", "SQLite", "TypeORM", "FTS5", "Puppeteer"]
highlights:
  - "Product-type field definitions preserved category-specific comparison criteria."
  - "SQLite FTS5 supported search across product names and descriptions."
  - "AI-assisted source extraction created structured drafts for human review."
links:
  - label: "Source repository"
    href: "https://github.com/KitSmith-us/KitSmith"
image:
  src: "/project-media/kitsmith/wordmark.svg"
  alt: "KitSmith logo lockup"
order: 50
aliases: ["KitSmith", "kit builder", "equipment comparison", "product catalog"]
index: true
---

## Overview

KitSmith was a structured product research and comparison application for specialized equipment. Its core idea was simple: common fields make products searchable, but category-specific fields preserve the distinctions that actually matter when comparing complex gear.

## The product challenge

Manufacturer information is fragmented and inconsistent. A useful catalog has to normalize that information without erasing domain detail, then make the resulting data useful to both the person entering it and the person comparing products.

## Product and technical approach

The application modeled products, manufacturers, product types, tags, images, users, and type-defined fields. The React client supported global search, filters, product pages, product cards, and structured comparison tables. SQLite and TypeORM handled persistence, while an FTS5 table and triggers kept name and description search data synchronized.

The administrative workflow supported product entry, tag and type management, rich descriptions, image metadata, and user management. A Puppeteer-based collection endpoint could retrieve relevant text from a product page, then an OpenAI function call shaped it into a structured draft. The draft remained in the human review flow rather than being treated as automatic publication.

## What the work demonstrates

KitSmith is evidence of flexible schema design, search-oriented information architecture, role-aware workflow design, and practical AI-assisted data collection. Its public development record runs from October through December 2023, moving from foundational models through search, comparison, and auto-population.

## Honest boundaries

The source does not establish catalog size, customer adoption, launch, or production readiness. The AI workflow accelerated data entry; it did not prove that extracted product claims were correct without review.
