---
title: Docs Home
description: Central Documentation Index for SEOCHO
slug: docs
---

> *Source mirrored from `seocho/docs/README.md`*


SEOCHO is ontology-aligned middleware for agents that need graph memory they can
inspect, govern, and reuse. Read this page as the project map: it explains the
core loop first, then points you to the smallest useful next document.

If you are reading on `seocho.blog`, the fastest one-page map is the
[Concept Guide](https://seocho.blog/learn/).

## What SEOCHO Is

SEOCHO keeps one ontology contract aligned across ingestion, graph writes,
retrieval, answer synthesis, and runtime APIs.

| Piece | Plain meaning |
|---|---|
| Ontology | the allowed entities, relationships, and properties |
| Indexing | turns raw text or records into graph-shaped facts |
| Graph memory | stores facts, provenance, constraints, and query evidence |
| Semantic query | resolves intent against the ontology before generating graph queries |
| Runtime | exposes the same graph contract over HTTP for agents and apps |

The fastest first run is `Seocho.local(...)`. It does not require Neo4j,
DozerDB, or a web server. Use the runtime only when another process needs a
shared API, UI, or deployment boundary.

## The Core Loop

```text
ontology
  -> ingest records or documents
  -> extract graph facts that fit the ontology
  -> write graph state with provenance
  -> ask ontology-aware questions
  -> inspect traces, artifacts, and evidence
```

That loop is the product. Everything else in the repository exists to make the
loop more repeatable, observable, or deployable.

## Choose Your Path

| If you want to... | Start here | Stop when you can... |
|---|---|---|
| understand why SEOCHO exists | [Why SEOCHO](/docs/why_seocho/) | explain ontology-first graph memory in one paragraph |
| get a first local success | [Quickstart](/docs/quickstart/) | define one ontology, add text, ask one question |
| use the Python SDK | [Python SDK](/docs/python_sdk/) | choose local, remote, or explicit backend mode |
| load your own records or files | [Bring Your Data](/docs/apply_your_data/) | pick an ingest path and target graph |
| run the platform stack | [Runtime Deployment](/docs/runtime_deployment/) | start UI, API, and graph services locally |
| describe repeatable runs in YAML | [Run Specs](/docs/run_specs/) | declare ontology, documents, questions, and sweeps |
| contribute publicly | [Open Source Playbook](/docs/open_source_playbook/) | open a scoped issue or PR with validation evidence |

## Read In Order

New users should not read the repository tree top to bottom. Use this sequence:

1. [Why SEOCHO](/docs/why_seocho/)
2. [Quickstart](/docs/quickstart/)
3. [Python SDK](/docs/python_sdk/)
4. [Bring Your Data](/docs/apply_your_data/)
5. [Files and Artifacts](/docs/files_and_artifacts/)
6. [Architecture](/docs/architecture/)

## Concept Map

| Concept | What to remember | Read next |
|---|---|---|
| Ontology contract | one schema-like object should guide extraction and querying | [Why SEOCHO](/docs/why_seocho/) |
| Embedded local path | use `Seocho.local(...)` for first success and experiments | [Quickstart](/docs/quickstart/) |
| Explicit graph backend | use Neo4j or DozerDB when graph state must be shared or inspected externally | [Python SDK](/docs/python_sdk/) |
| Runtime shell | HTTP boundary for UI, policy, traces, and multi-agent consumers | [Runtime Deployment](/docs/runtime_deployment/) |
| Run spec | YAML declaration for repeatable ontology, document, model, and question runs | [Run Specs](/docs/run_specs/) |
| Evidence and traces | generated files should make graph behavior auditable | [Files and Artifacts](/docs/files_and_artifacts/) |
| Debate mode | advanced comparison mode, not the default retrieval path | [Python SDK](/docs/python_sdk/) |

## System Surfaces

| Surface | Owner path | Main question |
|---|---|---|
| Public SDK | `src/seocho/` | how do users ingest, query, and configure SEOCHO from Python? |
| Query and retrieval | `src/seocho/query/` | how does intent become graph-grounded evidence? |
| Indexing and graph shaping | `src/seocho/index/` | how do documents become graph facts? |
| Runtime API | `runtime/` | how do external agents and apps consume the graph contract? |
| Extraction compatibility | `extraction/` | which legacy imports or batch paths still need to work? |
| Examples | `examples/` | what should a real user copy first? |
| Docs and governance | `docs/` | what contract should future contributors preserve? |

## Common Questions

| Question | Short answer | Read next |
|---|---|---|
| Do I need Neo4j or DozerDB for hello world? | No. `Seocho.local(...)` uses the embedded local path by default. | [Quickstart](/docs/quickstart/) |
| When should I use the runtime? | When another process or agent needs the same graph contract over HTTP. | [Runtime Deployment](/docs/runtime_deployment/) |
| Where do generated artifacts go? | Local graph data, semantic artifacts, rule profiles, and traces are filesystem-visible. | [Files and Artifacts](/docs/files_and_artifacts/) |
| Is debate the default mode? | No. Start with semantic graph QA and use debate only for explicit comparison work. | [Python SDK](/docs/python_sdk/) |
| Where are release and Discord rules? | GitHub releases and docs are canonical; Discord is for curated community updates. | [Release And Community Operations](/docs/release_and_community_operations/) |

## Builder References

- [Run Specs](/docs/run_specs/): declare ontology, documents, questions, and sweeps in YAML.
- [Tutorial First Run](/docs/tutorial/): end-to-end local runtime tutorial.
- [Agent Design Specs](https://github.com/tteon/seocho/blob/main/docs/AGENT_DESIGN_SPECS.md): YAML-backed agent patterns with ontology bindings.
- [Indexing Design Specs](https://github.com/tteon/seocho/blob/main/docs/INDEXING_DESIGN_SPECS.md): graph-model-aware indexing variants.
- [Benchmarks](https://github.com/tteon/seocho/blob/main/docs/BENCHMARKS.md): FinDER and GraphRAG benchmark tracks.

## Architecture And Operations

- [Architecture](/docs/architecture/): system architecture and module map.
- [Workflow](/docs/workflow/): canonical development and operations workflow.
- [Graph-RAG Agent Handoff Spec](https://github.com/tteon/seocho/blob/main/docs/GRAPH_RAG_AGENT_HANDOFF_SPEC.md): intent-first graph answer contract.
- [Repository Layout](https://github.com/tteon/seocho/blob/main/docs/REPOSITORY_LAYOUT.md): root directory intent and canonical edit surfaces.
- [GitHub Automation](https://github.com/tteon/seocho/blob/main/docs/GITHUB_AUTOMATION.md): CI, docs deploy, labels, Discord, and maintainer automation.
- [Release And Community Operations](/docs/release_and_community_operations/): release gates and `#seocho` community rules.

## Contributor References

- [Open Source Playbook](/docs/open_source_playbook/): contributor onboarding.
- [Issue Task System](https://github.com/tteon/seocho/blob/main/docs/ISSUE_TASK_SYSTEM.md): public issue and task metadata.
- [Decision Log](https://github.com/tteon/seocho/blob/main/docs/decisions/DECISION_LOG.md): architecture decision history.
- [Contributing](https://github.com/tteon/seocho/blob/main/CONTRIBUTING.md): PR and contribution flow.

## Internal And Maintainer Docs

These are useful after you know the product path. They are not part of the
first-read sequence.

- [Architecture Health](https://github.com/tteon/seocho/blob/main/docs/ARCHITECTURE_HEALTH.md)
- [Internal Class Design](https://github.com/tteon/seocho/blob/main/docs/INTERNAL_CLASS_DESIGN.md)
- [Runtime Package Migration](https://github.com/tteon/seocho/blob/main/docs/RUNTIME_PACKAGE_MIGRATION.md)
- [Repository Hierarchy Review](https://github.com/tteon/seocho/blob/main/docs/REPOSITORY_HIERARCHY_REVIEW.md)
- [Philosophy Feasibility Review](/blog/feasibility-review-framework/)
- [Known Issue](https://github.com/tteon/seocho/blob/main/docs/KNOWN_ISSUE.md)

## Docs Site Integration

- GitHub `README.md` is the fastest product landing page.
- `docs/*` is the source of truth for long-form product, operator, and system
  contracts.
- `website/` is the tracked Astro/Starlight source app in this repository.
- Current live deployment for `https://seocho.blog` is still owned by
  `tteon/tteon.github.io` GitHub Pages until Pages is enabled on `tteon/seocho`.
- `website/scripts/generate-docs.mjs` materializes selected `/docs/*` and
  `/blog/*` pages from repo-root source docs for the in-repo site app.
- the `scripts/sync.mjs` helper in `tteon/tteon.github.io` mirrors selected
  source docs into the live GitHub Pages repository.
- Generated mirror files under `website/src/content/docs/docs/` are derived
  artifacts; edit the repo-root source docs instead.
- Validate the site with `cd website && npm ci && npm run check:docs && npm run build && bash scripts/check-built-links.sh`.
