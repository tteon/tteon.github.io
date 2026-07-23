---
title: Docs Home
description: Central Documentation Index for SEOCHO
source_repo: tteon/seocho
source_path: docs/README.md
source_commit: fac6f941edac5e780e1d8af1384ec04b735ea1db
---

> *Source mirrored from `seocho/docs/README.md`*


SEOCHO helps agents use graph memory with an explicit ontology contract.

This page is the front door. It explains what SEOCHO does, which document to
read first, and which words matter before you go deeper.

## Start Here

| Goal | Read | You are done when |
|---|---|---|
| Understand the idea | [Why SEOCHO](/docs/why_seocho/) | you can explain ontology-aligned graph memory in one paragraph |
| Run the smallest example | [Quickstart](/docs/quickstart/) | you can define one ontology, add text, and ask one question |
| Use Python directly | [Python SDK](/docs/python_sdk/) | you know when to use local, remote, or explicit backend mode |
| Bring files and connectors | [Bring Your Data](/docs/apply_your_data/) -> [Connectors](https://github.com/tteon/seocho/blob/main/docs/CONNECTORS.md) | you know how records from your tools enter the graph |
| Run a service | [Runtime Deployment](/docs/runtime_deployment/) | you can start the API, UI, and graph services |
| Contribute | [Open Source Playbook](/docs/open_source_playbook/) | you know how to open a scoped issue or PR |

If you only have ten minutes, read [Why SEOCHO](/docs/why_seocho/), then run the
[Quickstart](/docs/quickstart/).

## Reader Map

Do not read the docs tree from top to bottom. Pick the path closest to your job
and move one step at a time.

<figure class="docs-figure">
  <img src="/images/docs-reader-map.svg" alt="SEOCHO documentation reader paths">
  <figcaption>SEOCHO docs follow a common open-source pattern: understand the idea, try the smallest example, then move into build, operate, or contribute paths.</figcaption>
</figure>

## The Core Loop

SEOCHO keeps the same ontology contract across ingestion, graph writes,
retrieval, answer synthesis, and runtime APIs.

<figure class="docs-figure">
  <img src="/images/docs-core-loop.svg" alt="SEOCHO core loop">
  <figcaption>The product loop is small on purpose: define the contract, ingest data, shape graph facts, query evidence, and improve the contract.</figcaption>
</figure>

In plain terms:

| Step | What happens | What you can inspect |
|---|---|---|
| Define ontology | Name the allowed entities, relationships, and properties. | ontology file or Python object |
| Ingest data | Load text, records, or files. | input files and run config |
| Shape graph facts | Extract entities and relationships that fit the ontology. | graph payloads and validation notes |
| Query graph memory | Ask questions with schema-aware retrieval. | Cypher, evidence, and traces |
| Improve the contract | Review failures, add rules, and rerun. | artifacts, reports, and PRs |

Everything else in the repository exists to make this loop repeatable,
observable, or deployable.

## Quick Vocabulary

| Term | Meaning here | Simple example |
|---|---|---|
| Ontology | The schema the agent must respect. | `Person WORKS_AT Company` |
| Graph memory | Stored facts plus provenance and constraints. | who said a fact, where it came from, and how it links |
| Indexing | Turning documents into graph-shaped facts. | extracting companies, incidents, controls, and relationships |
| Semantic query | Resolving intent before generating a graph query. | mapping "risk owner" to the right node and relation |
| Runtime | The HTTP service for shared usage. | an app or agent calls SEOCHO instead of local Python |
| Artifact | A generated file you can review. | trace, rule profile, report, or graph export |

## Choose A Path

| Reader | Best first path |
|---|---|
| New user | [Quickstart](/docs/quickstart/) -> [Python SDK](/docs/python_sdk/) |
| Data or RAG builder | [Bring Your Data](/docs/apply_your_data/) -> [Connectors](https://github.com/tteon/seocho/blob/main/docs/CONNECTORS.md) -> [Run Specs](/docs/run_specs/) |
| Agent developer | [Python SDK](/docs/python_sdk/) -> [Files and Artifacts](/docs/files_and_artifacts/) |
| Operator | [Runtime Deployment](/docs/runtime_deployment/) -> [Workflow](/docs/workflow/) |
| Contributor | [Open Source Playbook](/docs/open_source_playbook/) -> [Issue Task System](https://github.com/tteon/seocho/blob/main/docs/ISSUE_TASK_SYSTEM.md) |
| Maintainer | [Release And Community Operations](/docs/release_and_community_operations/) -> [Decision Log](https://github.com/tteon/seocho/blob/main/docs/decisions/DECISION_LOG.md) |

## First Local Success

The fastest path is local. It does not require Neo4j, DozerDB, Docker, or a
web server.

```bash
uv pip install "seocho[local]"
```

Then run the quickstart from a checkout:

```bash
export MARA_API_KEY=...
uv run python examples/finance-compliance/quickstart.py --llm mara/MiniMax-M2.5
```

Use the runtime later, when another process needs the same graph contract over
HTTP.

## Evidence And Artifacts

SEOCHO docs should make evidence visible. Every serious run should leave files
or links that another person can inspect.

<figure class="docs-figure">
  <img src="/images/docs-evidence-loop.svg" alt="SEOCHO evidence and artifact loop">
  <figcaption>Artifacts turn graph behavior into reviewable evidence. Use them to debug extraction, validate answers, and decide the next ontology or rule change.</figcaption>
</figure>

| Artifact | Why it exists | Read next |
|---|---|---|
| Run config | shows which ontology, documents, questions, and models were used | [Run Specs](/docs/run_specs/) |
| Graph payloads | show the nodes, relationships, and evidence before or after write | [Files and Artifacts](/docs/files_and_artifacts/) |
| Traces | show how retrieval, routing, and answer synthesis behaved | [Files and Artifacts](/docs/files_and_artifacts/) |
| Reports | compare runs, gaps, costs, and failure modes | [Tutorial First Run](/docs/tutorial/) |
| PRs and issues | keep public work reviewable and scoped | [Open Source Playbook](/docs/open_source_playbook/) |

## Document Map

| Area | Documents |
|---|---|
| Product idea | [Why SEOCHO](/docs/why_seocho/), [Philosophy](/docs/philosophy/), [Architecture Overview](/docs/architecture/) |
| Getting started | [Quickstart](/docs/quickstart/), [Python SDK](/docs/python_sdk/), [Bring Your Data](/docs/apply_your_data/), [Connectors](https://github.com/tteon/seocho/blob/main/docs/CONNECTORS.md) |
| Repeatable runs | [Run Specs](/docs/run_specs/), [Tutorial First Run](/docs/tutorial/), [Files and Artifacts](/docs/files_and_artifacts/) |
| Operations | [Runtime Deployment](/docs/runtime_deployment/), [Runtime Architecture](/docs/runtime_architecture/), [Workflow](/docs/workflow/), [Release And Community Operations](/docs/release_and_community_operations/) |
| Open source work | [Open Source Playbook](/docs/open_source_playbook/), [Issue Task System](https://github.com/tteon/seocho/blob/main/docs/ISSUE_TASK_SYSTEM.md), [Contributing](https://github.com/tteon/seocho/blob/main/CONTRIBUTING.md) |

The map follows this structure:

| Docs pattern | Purpose | SEOCHO examples |
|---|---|---|
| Concepts | explain why the system exists and which words matter | [Why SEOCHO](/docs/why_seocho/), [Architecture Overview](/docs/architecture/) |
| Tutorials | guide a first successful run | [Quickstart](/docs/quickstart/), [Tutorial First Run](/docs/tutorial/) |
| How-to guides | solve a concrete task | [Bring Your Data](/docs/apply_your_data/), [Connectors](https://github.com/tteon/seocho/blob/main/docs/CONNECTORS.md), [Run Specs](/docs/run_specs/) |
| Reference | preserve contracts, surfaces, and decisions | [Files and Artifacts](/docs/files_and_artifacts/), [Query Architecture](/docs/query_architecture/), [Decision Log](https://github.com/tteon/seocho/blob/main/docs/decisions/DECISION_LOG.md) |

## System Deep-Dive Map

Generated code indexes such as [DeepWiki](https://deepwiki.com/tteon/seocho)
are useful as secondary maps, but the source docs in this repository remain the
contract. Use this table to move from a system area to the maintained guide.

| System area | What you are trying to understand | Maintained docs |
|---|---|---|
| Product overview | why SEOCHO exists and where it fits | [Why SEOCHO](/docs/why_seocho/), [Architecture Overview](/docs/architecture/) |
| SDK and client interface | how users call SEOCHO from Python | [Python SDK](/docs/python_sdk/), [Quickstart](/docs/quickstart/) |
| Ontology system | how schema, context, drift checks, and governance shape behavior | [Why SEOCHO](/docs/why_seocho/), [SDK Ontology Guide](https://seocho.blog/sdk/ontology-guide/), [Maintainer Architecture Notes](/docs/maintainer_architecture_notes/) |
| Indexing and ingestion | how documents become graph facts | [Bring Your Data](/docs/apply_your_data/), [Connectors](https://github.com/tteon/seocho/blob/main/docs/CONNECTORS.md), [Run Specs](/docs/run_specs/), [Files and Artifacts](/docs/files_and_artifacts/) |
| Query and agent orchestration | how questions become evidence-backed answers | [Query Architecture](/docs/query_architecture/), [Graph-RAG Agent Handoff Spec](https://github.com/tteon/seocho/blob/main/docs/GRAPH_RAG_AGENT_HANDOFF_SPEC.md) |
| Runtime and HTTP API | how the shared service is composed and operated | [Runtime Deployment](/docs/runtime_deployment/), [Runtime Architecture](/docs/runtime_architecture/) |
| Storage and graph backends | where graph state, generated files, and backend assumptions live | [Files and Artifacts](/docs/files_and_artifacts/), [Runtime Architecture](/docs/runtime_architecture/) |
| LLM, tracing, and evaluation | how runs stay inspectable and how claims are validated | [Files and Artifacts](/docs/files_and_artifacts/), [Runtime Architecture](/docs/runtime_architecture/), [Workflow](/docs/workflow/) |
| Developer tooling and CI | how contributors keep changes reviewable and deployable | [Open Source Playbook](/docs/open_source_playbook/), [Workflow](/docs/workflow/), [Maintainer Architecture Notes](/docs/maintainer_architecture_notes/) |

Current gap list:

| Gap | Current workaround | Good future doc |
|---|---|---|
| ontology internals are split across product, SDK, and maintainer docs | start from the SDK ontology guide, then read maintainer notes | `Ontology Architecture` |
| indexing/data-plane internals are spread across how-to and artifact docs | start from Bring Your Data, Run Specs, and Files and Artifacts | `Indexing Architecture` |
| graph backend details are mostly operational today | start from Files and Artifacts and Runtime Architecture | `Storage And Backend Guide` |
| tracing/evaluation guidance is distributed across workflow and runtime docs | start from Files and Artifacts, Runtime Architecture, and Workflow | `Tracing And Evaluation Guide` |

## Common Questions

| Question | Short answer | Read next |
|---|---|---|
| Do I need a graph database for hello world? | No. Start with the embedded local path. | [Quickstart](/docs/quickstart/) |
| When should I use the runtime? | When another app or agent needs a shared HTTP boundary. | [Runtime Deployment](/docs/runtime_deployment/) |
| What does the ontology control? | It guides extraction, validation, graph writes, retrieval, and answers. | [Why SEOCHO](/docs/why_seocho/) |
| Where do generated files go? | SEOCHO writes reviewable artifacts such as traces, reports, and profiles. | [Files and Artifacts](/docs/files_and_artifacts/) |
| Is debate mode the default? | No. Start with semantic graph QA. Use debate for explicit comparison. | [Python SDK](/docs/python_sdk/) |
| How do GitHub, Ghost, and Discord fit together? | GitHub is source of truth, Ghost is the public archive, Discord is real-time discussion. | [Release And Community Operations](/docs/release_and_community_operations/) |

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

## Deeper References

Use these after the first local success:

| Topic | Reference |
|---|---|
| Architecture details | [Architecture Overview](/docs/architecture/), [Runtime Architecture](/docs/runtime_architecture/), [Query Architecture](/docs/query_architecture/), [Maintainer Architecture Notes](/docs/maintainer_architecture_notes/), [Internal Class Design](https://github.com/tteon/seocho/blob/main/docs/INTERNAL_CLASS_DESIGN.md) |
| Repository shape | [Repository Layout](https://github.com/tteon/seocho/blob/main/docs/REPOSITORY_LAYOUT.md), [Workflow](/docs/workflow/) |
| Automation | [GitHub Automation](https://github.com/tteon/seocho/blob/main/docs/GITHUB_AUTOMATION.md), [Release And Community Operations](/docs/release_and_community_operations/) |
| Design history | [Decision Log](https://github.com/tteon/seocho/blob/main/docs/decisions/DECISION_LOG.md), [Reference Docs](https://github.com/tteon/seocho/blob/main/docs/reference/README.md) |
| Historical material | [Archive](https://github.com/tteon/seocho/blob/main/docs/archive/README.md), [Maintainer Docs](https://github.com/tteon/seocho/blob/main/docs/maintainers/README.md) |

## Docs Site Integration

- GitHub `README.md` is the fastest product landing page.
- `docs/*` is the source of truth for long-form product, operator, and system
  contracts.
- `website/` is the tracked Astro/Starlight source app in this repository.
- `website/scripts/generate-docs.mjs` materializes selected `/docs/*` and
  `/blog/*` pages from repo-root source docs for the in-repo site app.
- Generated mirror files under `website/src/content/docs/docs/` are derived
  site artifacts. Do not edit them by hand; regenerate them when source docs
  change.
- Validate the site with `cd website && npm run check:docs && npm run build`.
