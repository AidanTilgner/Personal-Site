---
title: "LiveSearch"
description: "An archived audio-to-notes experiment that turned browser recordings into traceable transcripts and structured contextual notes."
status: "archived"
started: "2023-06-27"
completed: "2024-05-02"
tags: ["multimodal AI", "audio capture", "structured extraction", "knowledge capture"]
technologies: ["Next.js", "React", "TypeScript", "OpenAI Whisper", "MediaRecorder", "Tailwind"]
highlights:
  - "Connected browser microphone capture to server-side Whisper transcription."
  - "Used structured model output to turn transcripts into titled notes rather than plain text."
  - "Kept source transcript and generated notes visible together for traceability."
links:
  - label: "Source repository"
    href: "https://github.com/AidanTilgner/LiveSearch"
order: 10
aliases: ["LiveSearch", "Livesearch", "audio to notes", "voice notes"]
index: true
---

## Overview

LiveSearch was an early experiment in turning short spoken recordings into useful context. A user held a browser control to record audio, received a transcript, and saw the system extract structured notes beside the source recording.

## The product challenge

Transcription preserves words but not necessarily usefulness. The project explored a tighter feedback loop: capture a thought or conversation, retain the original transcript, and produce a readable note with a title and content that could be revisited later.

## Product and technical approach

The browser used `MediaRecorder` to capture WebM audio and sent it to a Next.js API route. The server passed the file to OpenAI Whisper, returned the transcription to the interface, then sent the text to a second extraction route. A function-call schema returned structured note objects, which the responsive React UI associated with the selected transcript.

The repository also contains early PocketBase identity exploration and audio/noise utilities for a possible automatic-recording path. The visible implementation kept recording manual; automatic mode remained future work.

## What the work demonstrates

LiveSearch is a focused example of multimodal product engineering across browser media APIs, multipart uploads, server routes, transcription, structured model output, and a traceable UI. It is also an early antecedent to later work involving audio ingestion, agent memory, and knowledge systems.

## Honest boundaries

The project is archived and explicitly unfinished. Its sparse Git history does not support deployment, adoption, accuracy, or usefulness claims, and the older model integration should be read as historical implementation evidence rather than current API guidance.
