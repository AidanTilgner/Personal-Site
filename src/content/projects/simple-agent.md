---
title: "Simple Agent"
description: "A living Python agent framework and CLI built around an explicit perception → inference → action loop, tools, roles, tasks, and optional memory."
status: "active"
started: "2024-08-10"
tags: ["agents", "LLM systems", "tool use", "memory"]
technologies: ["Python", "OpenAI", "Anthropic", "Google", "Rich", "Simple Vector Store"]
highlights:
  - "Models agency as explicit tasks with requirements, notes, and completion state."
  - "Separates model providers, tools, roles, memory, and event handling behind small interfaces."
  - "Connects to Simple Vector Store for persistent semantic and episodic Markdown memory."
links:
  - label: "Source repository"
    href: "https://github.com/QuasarBrains/Simple-Agent"
image:
  src: "/project-media/simple-agent/terminal-demo.gif"
  alt: "Simple Agent terminal demonstration showing an agent responding to a programming task"
  caption: "Terminal demonstration of a request to create and test a small JavaScript program."
order: 40
aliases: ["Simple Agent", "Simmy", "perception inference action", "agent loop"]
index: true
---

## Overview

Simple Agent is a deliberately small, living framework for experimenting with LLM agents. Its central loop is explicit: collect perception, infer the next step, perform an action, and continue until the system has no new stimuli or incomplete tasks.

## The design problem

An agent is more than a model response. It needs current context, durable memory, a goal representation, bounded capabilities, a way to report activity, and a stopping condition. Simple Agent isolates those concerns so they can be changed and tested independently.

## System design

The `Agent` class gathers messages and tool outputs, recalls relevant memory and incomplete tasks, builds a prompt from environment, memory, and agency, then routes model responses or tool calls through a central `Toolbox`. Tasks carry descriptions, requirements, notes, and completion state rather than existing only as implicit prompt instructions.

Provider adapters cover OpenAI, Anthropic, and Google. Roles such as Helpful Assistant, Developer, and Researcher compose different tool sets. Optional semantic and episodic memory is stored as Markdown through a vector-store interface, with Simple Vector Store supplying a local retrieval backend. Rich, dotenv configuration, and event logging keep the command-line experience inspectable.

## What the work demonstrates

The project shows hands-on understanding of agent control flow, tool contracts, provider abstraction, role-specific capability sets, and retrieval-backed memory. Its public development record runs from August 2024 through April 2025, with periodic updates continuing after the initial feature burst.

## Engineering boundary

The framework intentionally exposes powerful tools, including file operations and shell execution. The reviewed snapshot does not show a sandbox, approval gate, path policy, or isolation layer. That limitation is part of the project’s value as an engineering study: capability needs consent, scoped permissions, review, rollback, and recovery before it can be treated as safe autonomy.
