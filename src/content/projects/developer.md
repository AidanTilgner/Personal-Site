---
title: "Developer / JuniorGPT"
description: "An early developer-agent prototype that made project context, goals, tools, human communication, state, and observability explicit parts of the product."
status: "archived"
started: "2023-12-07"
tags: ["developer agents", "agent architecture", "observability", "human-in-the-loop"]
technologies: ["Go", "React", "TypeScript", "SQLite", "Socket.IO", "OpenAI"]
highlights:
  - "A perception model built from environment, memory, and multi-horizon agency."
  - "Persistent conversation, project metadata, model history, logs, and agent-state events."
  - "A local React interface with conversation, project, settings, and Logbook views."
links:
  - label: "Source repository"
    href: "https://github.com/QuasarBrains/Developer"
image:
  src: "/project-media/developer/mark.svg"
  alt: "JuniorGPT project mark"
order: 60
aliases: ["Developer", "JuniorGPT", "Developer Agent", "QuasarBrains Developer"]
index: true
---

## Overview

Developer/JuniorGPT was an early exploration of what a coding agent needs around the reasoning model. Its premise was that a useful developer agent is an operational system: it needs a view of the environment, memory, agency, tools, monitoring, and a human interface.

## The product challenge

An agent that can produce text is not automatically an agent that can help develop software. It needs to understand the current project, maintain goals across steps, expose what it is doing, pause when something goes wrong, and keep a person in the loop. The prototype focused on making those concerns visible and separable.

## System design

The Go runtime initialized SQLite, a local pub/sub bus, an agent loop, and a local web server. Each cycle assembled a perception from environment, memory, and agency, sent it through an OpenAI wrapper, parsed function calls, dispatched toolbox actions, recorded history, and published user-facing state.

The React and TypeScript client provided conversation, project, settings, and Logbook views. Socket.IO carried conversation and agent-state updates. The initial toolbox centered on communication, scratch notes, goal setting, and self-pausing behavior, while the broader TextIDE plan explored files, terminal context, search, and developer operations.

## What the work demonstrates

This project shows an early but clear approach to agent UX: state and control flow should be inspectable rather than hidden in a prompt. The public record runs from December 2023 to March 2024 and includes a real interaction prototype, local persistence, tool dispatch, pause behavior, and an observable history surface.

## Honest boundaries

The project was archived as a pre-release, partial prototype. Direct codebase editing, shell execution, version control, and robust developer-tool access were not demonstrated as complete. It should not be presented as a reliable autonomous coding product; permissioning, sandboxing, scoped access, review, rollback, and recovery remained necessary next steps.
