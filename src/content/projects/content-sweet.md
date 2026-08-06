---
title: "ContentSweet / WriteSweet"
description: "A multi-publication writing workspace that brought rich editing, audience personas, comments, conversations, and AI-assisted creator tools into one workflow."
status: "archived"
started: "2024-05-23"
tags: ["writing tools", "editorial systems", "AI assistance", "real-time UX"]
technologies: ["TypeScript", "React", "Express", "SQLite", "TypeORM", "Socket.IO", "Tiptap"]
highlights:
  - "A structured authoring model for publications, posts, personas, comments, tags, and publishing stages."
  - "Two assistance surfaces: inline generation/rephrasing and the publication-level Eddy conversation agent."
  - "An audio-to-post flow that transcribed uploaded audio with Whisper and created a new draft."
links:
  - label: "Source repository"
    href: "https://github.com/AidanTilgner/ContentSweet"
image:
  src: "/project-media/content-sweet/mark.svg"
  alt: "ContentSweet project mark"
order: 70
aliases: ["ContentSweet", "WriteSweet", "writing app", "Eddy writing assistant"]
index: true
---

## Overview

ContentSweet—called WriteSweet in part of the source—was an exploration of writing software as a complete editorial environment rather than a blank document. The product brought together drafting, review, publishing, audience perspective, and assistance across multiple publications.

## The product challenge

Writers move between composing, organizing, revising, and thinking about an audience. Those activities usually live in separate tools. The project’s central question was whether one workspace could support the full loop without turning the editor into a crowded control panel.

## Product and technical approach

The TypeScript application paired a React client with an Express server, SQLite persistence through TypeORM, JWT access and refresh tokens, and Socket.IO conversation updates. The Tiptap/ProseMirror editor supported headings, lists, links, images, code blocks, typography, export-as-HTML, themes, responsive behavior, and inline comments stored alongside selected content.

Publications could define audience personas and hold persistent conversations. Eddy was configured as a writing assistant, while DreamWriter could generate or rephrase selected text through structured model outputs. A separate creator workflow accepted audio, sent it through Whisper transcription, and used the result to create a post.

## What the work demonstrates

The strongest signal is end-to-end product thinking around an AI-assisted editor: content models, rich interaction, authentication, persistence, real-time delivery, media processing, and model integration were designed as one system. The public development record runs from May through December 2024 and shows deliberate iteration across writing UX, comments, conversation, account operations, and responsive presentation.

## Honest boundaries

This was an archived prototype, not a verified public launch. The reviewed source still marked stronger comment workflows, fuller draft/review/publish UI, and Substack import as unfinished. The project is best understood as a substantial exploration of editorial workflow design and contextual assistance.
