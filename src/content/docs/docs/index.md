---
title: Docs Home
description: Central Documentation Index for SEOCHO
---

> *Source mirrored from `seocho/docs/README.md`*


SEOCHO docs are organized around one question: what do you need to do right
now?

[![Quickstart](https://img.shields.io/badge/Quickstart-First_Run-2563eb)](/docs/quickstart/)
[![Python SDK](https://img.shields.io/badge/Python_SDK-Examples-0f766e)](/docs/python_sdk/)
[![Architecture Deep Dive](https://img.shields.io/badge/Architecture-Deep_Dive-7c3aed)](/docs/architecture/)

## Start Here

| If you need to... | Start here |
|---|---|
| get a first local success path | [QUICKSTART.md](/docs/quickstart/) |
| use the Python SDK directly | [PYTHON_INTERFACE_QUICKSTART.md](/docs/python_sdk/) |
| bring your own ontology and data | [APPLY_YOUR_DATA.md](/docs/apply_your_data/) |
| inspect files, artifacts, and traces | [FILES_AND_ARTIFACTS.md](/docs/files_and_artifacts/) |
| understand the system design | [ARCHITECTURE.md](/docs/architecture/) |
| measure behavior with FinDER and benchmark tracks | [BENCHMARKS.md](https://github.com/tteon/seocho/blob/main/docs/BENCHMARKS.md) |

Recommended onboarding order:

1. [WHY_SEOCHO.md](/docs/why_seocho/)
2. [QUICKSTART.md](/docs/quickstart/)
3. [PYTHON_INTERFACE_QUICKSTART.md](/docs/python_sdk/)
4. [APPLY_YOUR_DATA.md](/docs/apply_your_data/)
5. [FILES_AND_ARTIFACTS.md](/docs/files_and_artifacts/)
6. [ARCHITECTURE.md](/docs/architecture/)

## Product Entry Points

- [WHY_SEOCHO.md](/docs/why_seocho/): product framing and ontology-aligned value
  proposition
- [QUICKSTART.md](/docs/quickstart/): shortest local success path
- [PYTHON_INTERFACE_QUICKSTART.md](/docs/python_sdk/): public
  Python SDK path and API examples
- [APPLY_YOUR_DATA.md](/docs/apply_your_data/): ingest your own records and query
  them safely
- [FILES_AND_ARTIFACTS.md](/docs/files_and_artifacts/): where ontology files,
  semantic artifacts, rule profiles, and traces live
- [BENCHMARKS.md](https://github.com/tteon/seocho/blob/main/docs/BENCHMARKS.md): FinDER and GraphRAG benchmark tracks
- [ARCHITECTURE.md](/docs/architecture/): architecture deep dive and module map

## Architecture And Operations

- [ARCHITECTURE.md](/docs/architecture/): system architecture and runtime/module map
- [RUNTIME_PACKAGE_MIGRATION.md](https://github.com/tteon/seocho/blob/main/docs/RUNTIME_PACKAGE_MIGRATION.md): staged
  `extraction/` to `runtime/` migration plan
- [GRAPH_RAG_AGENT_HANDOFF_SPEC.md](https://github.com/tteon/seocho/blob/main/docs/GRAPH_RAG_AGENT_HANDOFF_SPEC.md):
  intent-first graph answer contract
- [ONTOLOGY_RUN_CONTEXT_STRATEGY.md](https://github.com/tteon/seocho/blob/main/docs/ONTOLOGY_RUN_CONTEXT_STRATEGY.md):
  ontology context contract across indexing, query, and agents
- [PROPERTY_GRAPH_LENS_STRATEGY.md](https://github.com/tteon/seocho/blob/main/docs/PROPERTY_GRAPH_LENS_STRATEGY.md):
  semantic overlay strategy for property graphs
- [WORKFLOW.md](/docs/workflow/): operational workflow

## Contributor References

- [ISSUE_TASK_SYSTEM.md](https://github.com/tteon/seocho/blob/main/docs/ISSUE_TASK_SYSTEM.md): sprint and task governance
- [BEADS_OPERATING_MODEL.md](https://github.com/tteon/seocho/blob/main/docs/BEADS_OPERATING_MODEL.md): `.beads` execution
  contract
- [OPEN_SOURCE_PLAYBOOK.md](/docs/open_source_playbook/): contributor onboarding
- [decisions/DECISION_LOG.md](https://github.com/tteon/seocho/blob/main/docs/decisions/DECISION_LOG.md): architecture decision
  history
- [../CONTRIBUTING.md](https://github.com/tteon/seocho/blob/main/CONTRIBUTING.md): contribution flow and PR rules

## Docs Sync Integration

- GitHub `README.md` is the fastest product landing page.
- `docs/*` is the source of truth for long-form product, operator, and system
  contracts.
- `tteon.github.io/` mirrors selected pages for `https://seocho.blog`.
- If a source doc changes materially, update the mirrored website page and
  validate drift with the website repo checks.
