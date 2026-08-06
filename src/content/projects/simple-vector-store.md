---
title: "Simple Vector Store"
description: "A living, file-backed semantic search system that turns local text and source trees into searchable stores through a CLI and REST API."
status: "active"
started: "2023-11-29"
tags: ["retrieval", "developer tools", "semantic search", "local-first"]
technologies: ["Python", "Click", "Flask", "SQLite", "Sqlean", "sqlite-vss", "OpenAI embeddings"]
highlights:
  - "Build, search, sync, rename, remove, and multiple named stores share one operational model."
  - "Incremental synchronization handles changed files, deleted files, retries, truncation, and source exclusions."
  - "A CLI and Flask API expose the same retrieval system to people and programs."
links:
  - label: "Source repository"
    href: "https://github.com/AidanTilgner/Simple-Vector-Store"
order: 30
aliases: ["Simple Vector Store", "SVS", "vector store", "file-backed semantic search"]
index: true
---

## Overview

Simple Vector Store is a compact retrieval system for developers who want to search ordinary local files semantically. A source directory becomes a named store that can be built, queried, synchronized, renamed, or removed through a command line or HTTP API.

## The engineering problem

Semantic search is not only nearest-neighbor lookup. A useful local tool must decide what enters the index, keep the index synchronized with a changing source tree, remove stale records, tolerate embedding failures, and make the same store usable from both scripts and a human terminal.

## System design

Click commands manage named stores and invoke build, search, and sync operations. A central SQLite registry tracks source directories, while each store has its own SQLite database using Sqlean and `sqlite-vss`. The ingestion path walks supported text and code files, derives titles from filenames, and creates separate vectors for titles and content.

Sync compares the source tree with indexed records, deletes missing files, adds new files, and regenerates vectors for changed content. Retry logic, character truncation, pacing, file limits, progress feedback, `_private` path exclusions, `private: true` Markdown frontmatter, and `.svsignore` patterns keep the workflow practical for local development.

## What the work demonstrates

The project treats retrieval as an operational lifecycle and a developer experience. It provides a useful bridge between ordinary file trees and semantic memory, and its REST interface later serves as an optional memory backend for Simple Agent. The public record runs from November 2023 through April 2025, with periodic maintenance continuing afterward.

## Engineering boundary

This is intentionally simple retrieval infrastructure: files are stored as single content records, without a chunking or reranking pipeline. The visible API has no authentication layer, so the project is best understood as a trusted-local or development integration rather than a hosted security boundary.
