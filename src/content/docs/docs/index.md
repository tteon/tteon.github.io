---
title: Docs Home
description: Central Documentation Index for SEOCHO
---

> *Source mirrored from `seocho/docs/README.md`*


Welcome to the central documentation index for SEOCHO. This directory tracks the active systems, decisions, and capabilities comprising our multi-agent platform.

## Documentation Surfaces

SEOCHO is easiest to understand if you separate three surfaces:

- GitHub `README.md`: fastest product overview and install path choice
- `docs/*`: operational guides, ontology workflow, runtime files, and system
  contracts
- website docs and SDK pages: public onboarding and mirrored developer guides

## Choose Your Entry Path

Start from the path that matches your actual job:

| If you need... | Start here |
|---|---|
| the product framing and why SEOCHO is ontology-first | [WHY_SEOCHO.md](/docs/why_seocho/) |
| the shortest local success path | [QUICKSTART.md](/docs/quickstart/) |
| local SDK authoring with your own ontology and graph | [PYTHON_INTERFACE_QUICKSTART.md](/docs/python_sdk/) |
| file locations for ontology, artifacts, traces, and rule profiles | [FILES_AND_ARTIFACTS.md](/docs/files_and_artifacts/) |
| benchmark tracks and measurement rules | [BENCHMARKS.md](BENCHMARKS.md) |
| long-term runtime package migration plan | [RUNTIME_PACKAGE_MIGRATION.md](RUNTIME_PACKAGE_MIGRATION.md) |
| bring-your-own-data ingestion | [APPLY_YOUR_DATA.md](/docs/apply_your_data/) |

## Canonical Start Docs

Read these first unless you already know exactly which area you need:

- [WHY_SEOCHO.md](/docs/why_seocho/): product positioning and ontology-first value proposition
- [QUICKSTART.md](/docs/quickstart/): shortest local success path
- [PYTHON_INTERFACE_QUICKSTART.md](/docs/python_sdk/): public Python SDK and pip-install path
- [APPLY_YOUR_DATA.md](/docs/apply_your_data/): how to ingest your own records and query them safely
- [FILES_AND_ARTIFACTS.md](/docs/files_and_artifacts/): where ontology, rule, trace, and runtime files live
- [BENCHMARKS.md](BENCHMARKS.md): benchmark tracks, peer baselines, and measurement order
- [RUNTIME_PACKAGE_MIGRATION.md](RUNTIME_PACKAGE_MIGRATION.md): staged `extraction/` to `runtime/` migration plan
- [WORKFLOW.md](/docs/workflow/): canonical operational workflow
- `PRD_MVP.md`: current product scope and MVP contract
- `GRAPH_MEMORY_API.md`: target public memory-first API
- `GRAPH_RAG_AGENT_HANDOFF_SPEC.md`: intent-first graph answer contract
- `AGENT_DEVELOPMENT.md`: coding-agent execution guide
- `CODING_STYLE.md`: implementation and test conventions
- `DEVELOPER_INPUT_CONVENTIONS.md`: required `DEV-*` prefixes for document-first development
- `ISSUE_TASK_SYSTEM.md`: sprint and task governance
- `BEADS_OPERATING_MODEL.md`: `.beads` execution contract
- `decisions/DECISION_LOG.md`: architecture decision history

## Onboarding Order

Use this path if you are new to the repository:

1. [WHY_SEOCHO.md](/docs/why_seocho/)
2. [QUICKSTART.md](/docs/quickstart/)
3. [PYTHON_INTERFACE_QUICKSTART.md](/docs/python_sdk/)
4. [APPLY_YOUR_DATA.md](/docs/apply_your_data/)
5. [FILES_AND_ARTIFACTS.md](/docs/files_and_artifacts/)
6. [TUTORIAL_FIRST_RUN.md](/docs/tutorial/)
7. `BEGINNER_PIPELINES_DEMO.md`
8. [OPEN_SOURCE_PLAYBOOK.md](/docs/open_source_playbook/)

Role split:

- [WHY_SEOCHO.md](/docs/why_seocho/) explains why SEOCHO is ontology-first instead of generic memory-first
- [QUICKSTART.md](/docs/quickstart/) is the shortest successful run
- [PYTHON_INTERFACE_QUICKSTART.md](/docs/python_sdk/) is the public Python SDK quickstart
- [APPLY_YOUR_DATA.md](/docs/apply_your_data/) is the bring-your-own-data ingestion and query guide
- [FILES_AND_ARTIFACTS.md](/docs/files_and_artifacts/) explains where ontology and runtime artifacts live
- [TUTORIAL_FIRST_RUN.md](/docs/tutorial/) is the manual API verification path
- `BEGINNER_PIPELINES_DEMO.md` is the scripted demo path
- [OPEN_SOURCE_PLAYBOOK.md](/docs/open_source_playbook/) is the contributor path

Current developer-facing execution order:

1. semantic layer first
2. bounded repair when slot fill is insufficient
3. explicit advanced debate only when cross-graph comparison is required

## Specialized Reference Docs

Use these when changing a specific subsystem or workflow:

- `ARCHITECTURE.md`: system architecture and module map
- `BENCHMARKS.md`: benchmark tracks and baseline measurement contract
- `RUNTIME_PACKAGE_MIGRATION.md`: staged package-boundary migration plan
- `../seocho/ontology_governance.py`: offline ontology governance helpers used by `seocho ontology *`
- `GRAPH_RAG_AGENT_HANDOFF_SPEC.md`: intent-first Graph-RAG design brief
- `AGENT_SERVER_REFACTOR_PLAN.md`: staged decomposition plan for `extraction/agent_server.py`
- `GRAPH_MODEL_STRATEGY.md`: ontology and graph representation choices
- `SHACL_PRACTICAL_GUIDE.md`: SHACL-like adoption and readiness flow
- `PHILOSOPHY.md`: design philosophy charter
- `PHILOSOPHY_FEASIBILITY_REVIEW.md`: multi-role Go/No-Go review framework
- `CONTEXT_GRAPH_BLUEPRINT.md`: context event model and rollout
- `RUNTIME_FILE_ISOLATION.md`: tracked vs untracked runtime file policy
- `EMBEDDED_GIT_CLONE_POLICY.md`: embedded clone policy
- `schemas/context-event.schema.json`: canonical `cg.v0` event contract
- `BEGINNER_PIPELINES_DEMO.md`: staged demo path
- `TUTORIAL_FIRST_RUN.md`: extended first-run API walkthrough
- `OPEN_SOURCE_PLAYBOOK.md`: open-source onboarding and contribution path
- `ROADMAP.md`: planned product and engineering milestones

## Root-Level Contributor Docs

- `../CONTRIBUTING.md`: contribution flow, coding standards, and PR requirements
- `../LICENSE`: repository license (MIT)
- `../SECURITY.md`: vulnerability reporting process

## Automation References

- `../scripts/ci/run_basic_ci.sh`: canonical local command behind the repo
  basic CI workflow
- `../scripts/ci/create_or_update_bot_pr.sh`: canonical PR publication helper
  for scheduled Codex automation
- `../scripts/ci/validate_pr_body.sh`: enforces the required automation PR body
  headings before publication
- `../.agents/skills/daily-maintenance-pr/SKILL.md`: repo-local skill for
  bounded maintenance work
- `../.agents/skills/periodic-review-pr/SKILL.md`: repo-local skill for
  bounded review/refactor work
- `../.github/codex/prompts/daily-maintenance-pr.md`: prompt for daily Codex
  maintenance
- `../.github/codex/prompts/periodic-review-pr.md`: prompt for periodic Codex
  review
- `../.github/workflows/ci-basic.yml`: minimal required GitHub check surface
- `../.github/workflows/daily-codex-maintenance.yml`: scheduled Codex draft-PR
  maintenance workflow
- `../.github/workflows/periodic-codex-review.yml`: scheduled Codex draft-PR
  review workflow
- `../.github/workflows/pr-comment-merge.yml`: maintainer-triggered `/go`
  squash merge workflow

## Docs Sync Integration

- `README.md` and selected `docs/*` pages are the source material for website docs.
- publish-critical sync sources:
  - [`/docs/why_seocho/`](/docs/why_seocho/)
  - [`/docs/`](/docs/)
  - [`/docs/quickstart/`](/docs/quickstart/)
  - [`/docs/apply_your_data/`](/docs/apply_your_data/)
  - [`/docs/python_sdk/`](/docs/python_sdk/)
  - [`/docs/architecture/`](/docs/architecture/)
  - [`/docs/workflow/`](/docs/workflow/)
- Website updates are currently maintained directly in the local `tteon.github.io/`
  workspace.
- Repo-side docs consistency checks now run in `.github/workflows/docs-consistency.yml`
  via `bash scripts/ci/check-doc-contracts.sh`.
- Website-side mirrored-doc drift checks run in
  `tteon.github.io/.github/workflows/docs-quality.yml` via `npm run check:sync`.
- `tteon.github.io/scripts/sync.mjs` may be used as a local helper, but mirrored
  pages are still reviewed website content, not a blind publish target.

## Archive

Archived docs are moved under `docs/archive/` when no longer part of current
operational guidance.

Current archive status:

- `archive/ADD_PLAYBOOK.md`: replaced by `WORKFLOW.md` + `BEADS_OPERATING_MODEL.md`
- `archive/AGENT_DEVELOPMENT_AUDIT.md`: historical audit snapshot only
- `archive/README.md`: archive rationale and index
