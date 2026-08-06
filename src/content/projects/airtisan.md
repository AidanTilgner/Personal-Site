---
title: "AIrtisan"
description: "An archived self-serve chatbot platform prototype for configuring, training, testing, reviewing, and embedding custom bots."
status: "archived"
started: "2023-05-11"
completed: "2023-11-15"
tags: ["chatbot platforms", "NLP", "human-in-the-loop", "embeddable integrations"]
technologies: ["TypeScript", "React", "Express", "SQLite", "TypeORM", "NLP.js", "OpenAI", "Puppeteer"]
highlights:
  - "Bot workspaces covered corpus, context, training, review, testing, settings, and integrations."
  - "Hybrid responses combined curated intent matching with optional LLM enhancement."
  - "Embeddable widgets, API keys, visibility controls, and organization access connected the platform to external sites."
links:
  - label: "Source repository"
    href: "https://github.com/AidanTilgner/AIrtisan"
  - label: "Documentation repository"
    href: "https://github.com/AidanTilgner/AIrtisan-Docs"
image:
  src: "/project-media/airtisan/mark.svg"
  alt: "AIrtisan project mark"
order: 20
aliases: ["AIrtisan", "chatbot platform", "custom chatbot", "embedded chatbot"]
index: true
---

## Overview

AIrtisan was an early platform for building and operating custom website chatbots. Rather than reducing the product to a chat endpoint, it explored the surrounding developer workflow: define a bot, curate its knowledge, train and test it, review conversations, and deliver it through an embeddable widget or scoped API.

## The product challenge

Chatbot quality depends on more than model selection. Developers and organizations need control over intents, context, visibility, feedback, access, and failure cases. AIrtisan explored how those controls could become a self-serve product surface.

## Product and technical approach

The TypeScript/React and Express application modeled bots, templates, organizations, administrators, invitations, API keys, sessions, conversations, feedback, and flows. Bots held corpus, context, model, language, version, and visibility data. Admin surfaces supported intent and utterance editing, response buttons, context updates, retraining, interactive testing, conversation review, and feedback.

The response pipeline matched messages against curated intents first, then optionally used an LLM to enhance selected responses with bot and conversation context. Website-context tooling used Puppeteer to collect page text and constrained model output to structured key/value context. Multiple widget bundles and an integration-preview surface turned a configured bot into an external-site embed.

## What the work demonstrates

AIrtisan is an early example of treating conversational AI as a product system: quality workflows, multi-tenant access, model boundaries, integrations, and operations mattered alongside the chat response itself.

## Honest boundaries

AIrtisan is a dead/archived project with sparse public history. Its “hallucination-free” language was an aspiration, not a demonstrated outcome; the project documentation explicitly acknowledged that enhanced responses could hallucinate. It is best presented as formative platform engineering, not a production reliability claim.
