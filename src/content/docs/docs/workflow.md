---
title: Workflow
description: End-to-end operational workflow for SEOCHO
---

# Workflow

Canonical workflow reference for SEOCHO operations.

## Stack Baseline

- Agent runtime: OpenAI Agents SDK
- Tracing/evaluation: Opik
- Graph backend: DozerDB
- MVP tenancy: single-tenant with `workspace_id` propagated end-to-end

## Planes

### Control Plane

- Agent definitions and routing policy
- Runtime authorization policy
- Deployment, versioning, and quality gates
- Decision records (ADRs) and change governance

Surfaces: `extraction/agent_server.py`, `extraction/policy.py`, `docs/decisions/`, `docs/BEADS_OPERATING_MODEL.md`

### Data Plane

- Data ingestion from CSV/JSON/API
- Extraction, linking, deduplication
- Rule inference and validation
- Graph load/query execution against DozerDB

Surfaces: `extraction/pipeline.py`, `extraction/rule_constraints.py`, `extraction/data_source.py`, `extraction/graph_loader.py`

## End-to-End Workflow

### 1. Intake

- Define issue scope and acceptance criteria
- Assign `workspace_id`
- Fill or update `docs/*` sections using `DEV-*` prefixes
- Capture work item: `scripts/pm/new-issue.sh` / `scripts/pm/new-task.sh`
- For graph-grounded work, align with `docs/GRAPH_RAG_AGENT_HANDOFF_SPEC.md`
- Confirm philosophy alignment against `docs/PHILOSOPHY.md`

### 2. Ingestion and Graph Build

- Run extraction pipeline or ingest raw text via `/platform/ingest/raw`
- Parse heterogeneous sources (`text`/`csv`/`pdf`) to normalized text
- Run LLM 3-pass semantic extraction:
  1. Ontology candidate extraction
  2. SHACL candidate extraction
  3. Entity graph extraction with ontology + SHACL context
- Evaluate relatedness against known entities; link only when gate passes
- Select semantic artifact policy (`auto`, `draft_only`, `approved_only`)
- For governance review: persist draft artifacts and promote via `/semantic/artifacts/*`
- Apply SHACL-like rule inference/validation
- Run readiness check with `/rules/assess`
- Save rule profiles (`/rules/profiles`) in durable registry
- Export governance artifacts (`/rules/export/cypher`, `/rules/export/shacl`)
- Load graph into DozerDB

### 3. Agent Execution

- Run `/run_agent` (router mode) or `/run_debate` (parallel debate)
- For query-time entity disambiguation: `/run_agent_semantic`
- For interactive UX: `/platform/chat/send`
- Monitor health: `/health/runtime`, `/health/batch`
- Enforce runtime policy checks
- Capture traces in Opik

**Semantic path:**

1. Extract entities from question
2. Ensure fulltext index (`/indexes/fulltext/ensure`)
3. Fulltext search resolves candidates
4. Dedup/disambiguation reranks
5. Router dispatches to LPG or RDF agent
6. Answer agent synthesizes response

### 4. Validation and Landing

- Run code and ops gates
- Run runtime smoke gate: `make e2e-smoke`
- Run quickstart reproducibility check (raw ingest → semantic/debate chat)
- Optional one-command landing: `scripts/land.sh --task-id <id> --fix --pull --push`
- Run sprint label lint: `scripts/pm/lint-items.sh --sprint <id>`
- Close issue, rebase, sync, push

## CI Automation

### Claude Daily Review

- **Schedule**: daily at 01:00 UTC (10:00 KST)
- **Scope**: test gaps, type hints, dead code, doc drift
- **Output**: draft PR on `claude/daily-review` branch

### Claude Weekly SDK Review

- **Schedule**: Monday at 02:00 UTC (11:00 KST)
- **Scope**: API surface audit, ontology consistency, prompt quality, refactor opportunities
- **Output**: draft PR on `claude/weekly-sdk-review` branch

### Python Package Publish

- **Trigger**: manual `workflow_dispatch` or `v*` tag push
- **Gate**: `python -m build` + `twine check dist/*`
- **Targets**: TestPyPI and PyPI via trusted publishing

### Comment-Based Merge

- **Trigger**: `/go` comment on PR
- **Auth**: commenter must have write/maintain/admin permission
- **Method**: squash merge with branch protection

## Governance Loop

- Log architecture decisions as ADRs
- Track context graph events and quality metrics
- Schedule follow-up issues for unresolved risks
