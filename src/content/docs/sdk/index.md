---
title: SDK Overview
description: Overview of the public Python SDK and how it fits the SEOCHO runtime.
---

# Python SDK Overview

The public Python SDK is a developer-facing client for the running SEOCHO
runtime.

It is not just a thin wrapper around a chatbot endpoint. The intended order is:

1. ingest your data
2. query through the semantic layer
3. enable bounded repair for harder graph questions
4. use advanced debate only when you explicitly need graph comparison

## Start Here

- [`/docs/python_sdk/`](/docs/python_sdk/) for the main quickstart
- [`/docs/apply_your_data/`](/docs/apply_your_data/) if your immediate goal is to load your own records
- [`/sdk/api-reference/`](/sdk/api-reference/) for the method-level surface
- [`/sdk/examples/`](/sdk/examples/) for copy-pasteable usage patterns

## Mental Model

Use these surfaces in order:

- `add(...)` and `raw_ingest(...)` to load data
- `ask(...)` and `chat(...)` for simple memory-first interactions
- `semantic(...)` for graph-grounded retrieval
- `reasoning_mode=True` and `repair_budget` when the query is harder
- `advanced(...)` when you explicitly want multi-agent comparison
- `plan(...).on_graph(...).with_repair_budget(...).run()` when you want one explicit execution plan

## Working With Graph Targets

The SDK is graph-aware:

- ingest goes to a `target_database`
- semantic and debate flows can target `graph_ids`
- `client.graphs()` exposes graph metadata such as `graph_id`, `database`,
  `ontology_id`, and `vocabulary_profile`

That means you can keep datasets separated, then compare them later only when
needed.
