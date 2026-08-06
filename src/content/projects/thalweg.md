---
title: "Thalweg"
description: "A local-first chronological event mesh for immutable typed events, private device synchronization, temporal queries, and durable downstream processing."
status: "active"
started: "2026-04-13"
tags: ["distributed systems", "local-first", "event processing", "privacy"]
technologies: ["Go", "BadgerDB", "libp2p", "TypeScript", "Python", "Bubble Tea"]
highlights:
  - "Tri-temporal event fields preserve event time, local acceptance time, and propagation time."
  - "Inventory reconciliation, anti-entropy, and backoff support synchronization across intermittently connected devices."
  - "Lossless conflict handling preserves both immutable variants instead of silently overwriting history."
links:
  - label: "Source repository"
    href: "https://github.com/QuasarBrains/Thalweg"
featured: true
order: 90
aliases: ["Thalweg", "event mesh", "local-first mesh", "temporal event system"]
index: true
---

## Overview

Thalweg is a local-first temporal layer for personal and device data. It treats raw activity as an immutable chronological event stream that can be queried, subscribed to, processed, and selectively promoted into a durable knowledge system such as Noeko.

## The systems problem

Personal data is noisy, private, late-arriving, and often created while devices are offline. A semantic knowledge graph should not become an unbounded archive of every raw signal. Thalweg makes chronology, access, replication, conflict behavior, and downstream processing explicit before meaning is assigned.

## System design

The current MVP is a Go daemon with a newline-delimited local Unix-socket protocol and BadgerDB-backed storage. Events are immutable, typed, and network-scoped. Each records `occurredAt`, `insertedAt`, and `propagatedAt`; a persistent Hybrid Logical Clock provides deterministic ordering, while network-scoped event IDs make repeated ingestion idempotent.

The private mesh uses restart-stable libp2p identities, separately scoped logical networks, peer-ID-bound membership proofs, bounded inventory reconciliation, bidirectional missing-envelope transfer, periodic anti-entropy, and bounded exponential backoff. Durable siphons persist consumer definitions, receipt-order cursors, acknowledgements, and one outstanding batch so downstream workers can recover with at-least-once delivery.

The operator surface includes a lifecycle and diagnostics CLI, a Bubble Tea terminal UI, a loopback browser Console, a constrained Mesh Lab, and TypeScript and Python SDKs. Tests and two-device acceptance scenarios cover restarts, offline recovery, duplicate delivery, isolation, conflicts, and convergence.

## What the work demonstrates

Thalweg shows systems engineering at the boundary between local-first product design and distributed data correctness. Its public implementation burst in late July and early August 2026 moved from the event timeline into enrollment, synchronization, conflict recovery, operational visibility, and multi-language client surfaces.

## Engineering boundary

Thalweg is a working MVP, not a finished personal-data mesh. Credential rotation and revocation, WAN traversal, durable sync cursors, policy-driven retention, blob transfer, mobile clients, and mature durable-compute scheduling remain explicitly deferred.
