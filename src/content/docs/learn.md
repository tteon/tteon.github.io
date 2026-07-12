---
title: SEOCHO Concept Guide
description: A one-page map of SEOCHO's concepts, runtime surfaces, and reading order.
---

# Concept Guide

Use this page when the docs feel too spread out. It is the project map before
you open the deeper reference pages.

## The Project In One Sentence

SEOCHO lets agents build and query graph memory through one ontology contract
instead of letting extraction prompts, graph schemas, retrieval logic, and
runtime APIs drift apart.

## The Core Loop

```text
Define ontology
  -> ingest documents or records
  -> extract graph facts that fit the ontology
  -> store graph state and provenance
  -> ask ontology-aware questions
  -> inspect evidence, traces, and artifacts
```

## Five Objects To Recognize

| Object | What it means | Where you meet it first |
|---|---|---|
| `Ontology` | entity, relationship, and property contract | [Quickstart](/docs/quickstart/) |
| `Seocho.local(...)` | serverless local engine for first runs | [Python SDK](/docs/python_sdk/) |
| `Run Spec` | YAML plan for ontology, docs, questions, and sweeps | [Run Specs](/docs/run_specs/) |
| Runtime API | shared HTTP surface for apps and agents | [Runtime Deployment](/docs/runtime_deployment/) |
| Artifacts | files that explain what SEOCHO generated or used | [Files and Artifacts](/docs/files_and_artifacts/) |

## Which Mode Should I Use?

| Mode | Use it when | Avoid it when |
|---|---|---|
| Embedded local | you want the fastest proof that the ontology works | another service needs shared state |
| Explicit graph backend | you need Neo4j or DozerDB state you can inspect externally | you are still learning the API |
| Runtime | another agent, UI, or server needs HTTP access | you only need a local notebook/script |
| Debate | the task is explicit comparison across graph views | ordinary Q&A is enough |

## How A Question Moves Through SEOCHO

```text
question
  -> infer intent and candidate entities
  -> load ontology and graph context
  -> resolve graph evidence
  -> generate a guarded query
  -> repair within budget if needed
  -> answer with support status and traces
```

The important part is the guardrail: SEOCHO tries to keep the answer connected
to ontology and graph evidence instead of treating graph retrieval as a loose
prompting trick.

## Code Ownership Map

| Concern | Start in | Why it matters |
|---|---|---|
| Public Python API | `src/seocho/` | user-facing classes and stable contracts |
| Indexing | `src/seocho/index/` | document parsing, extraction, linking, graph writes |
| Querying | `src/seocho/query/` | semantic retrieval, Cypher safety, answer synthesis |
| Runtime | `runtime/` | HTTP routes, policy, health, deployment boundaries |
| Examples | `examples/` | copyable user workflows |
| Docs and decisions | `docs/` | public contracts and architecture history |

## Recommended Reading Order

1. [Docs Home](/docs/)
2. [Why SEOCHO](/docs/why_seocho/)
3. [Quickstart](/docs/quickstart/)
4. [Python SDK](/docs/python_sdk/)
5. [Bring Your Data](/docs/apply_your_data/)
6. [Architecture](/docs/architecture/)

## What To Ignore At First

You do not need to understand every benchmark, ADR, compatibility shim, or
maintainer workflow before using SEOCHO. Start with the ontology, local run,
and one real dataset. Come back to runtime, release, and governance docs when
you need to share the system with other agents or contributors.
