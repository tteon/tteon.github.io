---
title: Docs Home
description: Developer-first documentation for loading data into SEOCHO and querying it safely.
---

> *Synced automatically from `seocho/docs/README.md`*

SEOCHO is easiest to understand as a developer runtime:

- put your data into a graph target
- query through the semantic layer first
- enable bounded repair for hard questions
- use advanced debate only when you explicitly want cross-graph comparison

## Start Here

- [`/docs/quickstart/`](/docs/quickstart/): shortest successful local run
- [`/docs/apply_your_data/`](/docs/apply_your_data/): how to ingest your own records
- [`/docs/python_sdk/`](/docs/python_sdk/): Python SDK for runtime access

## Recommended Reading Order

1. Quick Start
2. Bring Your Data
3. Python SDK
4. Architecture
5. Workflow

## Developer Query Flow

For developer-facing query execution, use this order:

1. semantic layer first
2. bounded repair when slot fill is insufficient
3. explicit advanced debate only for cross-graph comparison

## Core References

- [`/docs/architecture/`](/docs/architecture/): system modules and runtime flow
- [`/docs/workflow/`](/docs/workflow/): operator workflow and automation rules
- [`/docs/open_source_playbook/`](/docs/open_source_playbook/): contribution path
- [`/sdk/api-reference/`](/sdk/api-reference/): public SDK surface
- [`/sdk/examples/`](/sdk/examples/): copy-pasteable runtime examples
