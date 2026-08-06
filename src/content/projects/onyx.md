---
title: "Onyx / Onyx Systems"
description: "A formative personal-assistant systems family that connected natural-language interpretation, voice, action dispatch, dashboards, identity, and personal knowledge workflows."
status: "archived"
started: "2021-12-23"
completed: "2023-07-07"
tags: ["personal assistants", "voice interfaces", "NLU", "systems architecture"]
technologies: ["JavaScript", "TypeScript", "Python", "Svelte", "React", "Express", "Flask", "Go", "SQLite", "SurrealDB"]
highlights:
  - "Evolved from command routing and Rasa experiments into a modular applications/interpretation/action/speech architecture."
  - "Explored intent classification, entities, confidence, forms, action mappings, speech-to-text, and text-to-speech."
  - "Later narrowed into a personal-management dashboard with notes, search, authentication, API keys, and a Go CLI."
links:
  - label: "Onyx Personal Management Dashboard"
    href: "https://github.com/AidanTilgner/Onyx-Personal-Management-Dashboard"
  - label: "Onyx Systems"
    href: "https://github.com/AidanTilgner/Onyx-Personal"
  - label: "Onyx Speech"
    href: "https://github.com/AidanTilgner/Onyx-Speech"
  - label: "Early Onyx prototype"
    href: "https://github.com/AidanTilgner/Onyx-dead"
image:
  src: "/project-media/onyx/mark.svg"
  alt: "Onyx project mark"
order: 5
aliases: ["Onyx", "Onyx Systems", "personal assistant", "voice assistant architecture"]
index: true
---

## Overview

Onyx was a multi-year exploration of a personal assistant that could turn natural-language requests into useful actions. The project family should be understood as one evolving system, not four unrelated applications: an early command assistant, a Rasa/NLU experiment, a modular Onyx Systems architecture, a dedicated speech service, and a later personal-management dashboard.

## The systems problem

The project asked how an assistant could move beyond conversation and coordinate real work. Input, interpretation, action execution, voice, identity, dashboards, integrations, and personal knowledge each have different responsibilities and failure modes. Onyx explored those boundaries directly.

## Product and technical approach

The main Onyx Systems design separated an applications gateway, interpretation/NLU, action dispatch, and speech services, with supporting areas for automation, awareness, collections, images, people, and third-party integrations. The interpretation path evolved from keyword and Rasa experiments toward NLP.js training, intent and entity classification, confidence handling, forms, unknown-input behavior, and action mappings.

The voice layer explored Python/Flask speech-to-text and text-to-speech, local Silero model loading, Torch/ONNX tooling, and a Svelte voice-input surface that exposed both the user utterance and system response. The applications layer included dashboards, action cards, console views, Socket.IO events, authentication, and direct dispatch. The later dashboard narrowed the product into notes, search, email, user/API-key management, and a Go CLI.

## What the work demonstrates

Onyx is formative systems thinking: AI behavior is more useful when it has explicit interfaces, action schemas, event paths, operator surfaces, and durable data. The public record spans December 2021 through July 2023 and shows a progression from small vertical slices toward service decomposition and then a more focused management product.

## Honest boundaries

Onyx was an archived experimental family, not a verifiably deployed unified assistant. The repositories mix working implementations, prototypes, plans, generated artifacts, and fixtures. The architecture is valuable evidence of design direction and concrete experiments, but it should not be presented as a completed autonomous platform or a current technology recommendation.
