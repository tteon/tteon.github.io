---
title: Docs Home
description: Central Documentation Index for SEOCHO
---

> *Source mirrored from `seocho/docs/README.md`*


SEOCHO docs are organized around jobs, not around the repository tree. Start
with the path that matches what you are trying to do today, then move deeper
only when you need the extra detail.

## Choose Your Path

| I want to... | Start here | What you should get |
|---|---|---|
| understand the product idea | [Why SEOCHO](/docs/why_seocho/) | why ontology-first graph memory is different from generic AI memory |
| get a first local success | [Quickstart](/docs/quickstart/) | install, define a tiny ontology, add text, ask a question |
| use SEOCHO from Python | [Python SDK](/docs/python_sdk/) | local SDK, HTTP client, semantic query, and artifact examples |
| bring my own records or files | [Bring Your Data](/docs/apply_your_data/) | ingestion paths, graph targets, query order, and inspection points |
| run the local platform | [Runtime Deployment](/docs/runtime_deployment/) | UI, API, DozerDB, environment, and troubleshooting |
| contribute to the project | [Open Source Playbook](/docs/open_source_playbook/) | issue/PR workflow, labels, examples, and review expectations |

If you are new, use this order:

1. [Why SEOCHO](/docs/why_seocho/)
2. [Quickstart](/docs/quickstart/)
3. [Python SDK](/docs/python_sdk/)
4. [Bring Your Data](/docs/apply_your_data/)
5. [Files and Artifacts](/docs/files_and_artifacts/)
6. [Architecture](/docs/architecture/)

## The Mental Model

SEOCHO keeps one ontology contract aligned across four surfaces:

| Surface | What the ontology controls |
|---|---|
| Ingestion | which entities, relationships, and properties should be extracted |
| Graph writes | constraints, provenance, and schema-shaped payloads |
| Querying | schema-aware retrieval, Cypher generation, and bounded repair |
| Runtime | HTTP-facing semantic artifacts, traces, policy, and `workspace_id` scope |

The fastest first run is `Seocho.local(...)`. The runtime path is for teams that
want a shared API, UI, and DozerDB-backed deployment.

## Common Questions

| Question | Short answer | Read next |
|---|---|---|
| Do I need Neo4j or DozerDB for hello world? | No. `Seocho.local(...)` uses the embedded local path by default. | [Quickstart](/docs/quickstart/) |
| When should I use the runtime? | When another process or agent needs to consume the same graph contract over HTTP. | [Runtime Deployment](/docs/runtime_deployment/) |
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
