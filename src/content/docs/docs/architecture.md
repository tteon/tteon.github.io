---
title: Architecture
description: System Architecture and Module Map
---

# Architecture

> *Source mirrored from `seocho/docs/ARCHITECTURE.md`*

## Overview

SEOCHO transforms unstructured data into structured Knowledge Graphs. It implements an asynchronous, dynamic Agent Pool architecture leveraging a **Parallel Debate** pattern to answer complex queries against dynamically provisioned databases.

- Agent runtime: OpenAI Agents SDK
- Trace/evaluation: Opik
- Graph backend: DozerDB (Neo4j protocol compatible)
- Python SDK: `pip install seocho`

## Control Plane vs Data Plane

### Control Plane

- Agent orchestration and routing policies
- Runtime authorization policy enforcement
- Deployment quality gates and ADR governance

Modules: `extraction/agent_server.py`, `extraction/policy.py`, `docs/decisions/`

### Data Plane

- Data ingestion and extraction pipeline
- SHACL-like rule inference and validation
- Graph loading/query execution on DozerDB

Modules: `extraction/pipeline.py`, `extraction/rule_constraints.py`, `extraction/graph_loader.py`

## End-to-End Data Flow

```
External Data
    │
    ▼
DataSource (CSV/JSON/API)
    │
    ▼
OntologyPromptBridge ──── Ontology (YAML/JSON-LD)
    │                         │
    ▼                         ▼
EntityExtractor ────── ontology-aware LLM prompt
    │
    ▼
EntityLinker (entity resolution)
    │
    ▼
EntityDeduplicator (embedding cosine similarity)
    │
    ▼
RuleConstraints (SHACL-like validation)
    │
    ▼
DatabaseManager ────── Neo4j/DozerDB
    │
    ▼
AgentFactory (per-DB agent creation)
    │
    ▼
Router / DebateOrchestrator
    │
    ▼
Answer
```

## Query-Time Semantic Flow

For graph QA with entity disambiguation:

```
User Question
    │
    ▼
┌─────────────────────────────────────────┐
│  Semantic Layer                         │
│  - extract question entities            │
│  - fulltext lookup on DozerDB           │
│  - semantic dedup/disambiguation        │
│  - label hints from ontology            │
└──────────────┬──────────────────────────┘
               │
               ▼
         RouterAgent
        ┌──────┴──────┐
        ▼             ▼
    LPGAgent      RDFAgent
    (Cypher)      (SPARQL)
        └──────┬──────┘
               ▼
     AnswerGenerationAgent
        (final synthesis)
```

Why this path exists:

- Query-time entity mapping is the hardest failure point in graph QA
- Fulltext-first lookup improves recall for imperfect user entity strings
- Semantic re-ranking + dedup reduces wrong-node selection before Cypher generation

## Three Execution Modes

### 1. Router Mode (`POST /run_agent`)

```
User ──▶ Router ──▶ GraphAgent / VectorAgent / WebAgent ──▶ Supervisor ──▶ Answer
```

Legacy static 7-agent pipeline. Router delegates to exactly 1 specialist.

### 2. Parallel Debate Mode (`POST /run_debate`)

```
User ──▶ DebateOrchestrator
              │
              ├──▶ Agent_db1  ──┐
              ├──▶ Agent_db2  ──┤──▶ SharedMemory ──▶ Supervisor ──▶ Answer
              └──▶ Agent_dbN  ──┘
                  (parallel)
```

All database-bound agents execute concurrently via `asyncio.gather()`. Each stores its conclusion in SharedMemory. Supervisor synthesizes. Fault-isolated: if one agent fails, others still contribute.

### 3. Semantic QA Mode (`POST /run_agent_semantic`)

```
User ──▶ SemanticLayer ──▶ RouterAgent ──▶ LPGAgent / RDFAgent ──▶ AnswerAgent
```

4-agent model for query-time disambiguation. Semantic layer performs fulltext search, dedup, and ontology-hint boosting before routing.

## Module Map

### Data Ingestion

| Module | File | Purpose |
|--------|------|---------|
| DataSource | `extraction/data_source.py` | ABC + File/API sources |
| DataCollector | `extraction/collector.py` | Legacy HuggingFace collector |

### Extraction

| Module | File | Purpose |
|--------|------|---------|
| OntologyPromptBridge | `extraction/ontology_prompt_bridge.py` | Ontology → LLM prompt variables |
| EntityExtractor | `extraction/extractor.py` | LLM-based entity/relationship extraction |
| EntityLinker | `extraction/linker.py` | Entity resolution and canonicalization |
| EntityDeduplicator | `extraction/deduplicator.py` | Embedding cosine similarity dedup |
| RuleConstraints | `extraction/rule_constraints.py` | SHACL-like inference + validation |
| PromptManager | `extraction/prompt_manager.py` | Jinja2 templating + history logging |

### Database

| Module | File | Purpose |
|--------|------|---------|
| DatabaseRegistry | `extraction/config.py` | Runtime-extensible DB name allowlist |
| DatabaseManager | `extraction/database_manager.py` | DB provisioning + schema + loading |
| GraphLoader | `extraction/graph_loader.py` | Neo4j MERGE operations |
| SchemaManager | `extraction/schema_manager.py` | Constraint/index application |

### Agent

| Module | File | Purpose |
|--------|------|---------|
| AgentFactory | `extraction/agent_factory.py` | Per-database Agent creation |
| SharedMemory | `extraction/shared_memory.py` | Request-scoped memory + query cache |
| DebateOrchestrator | `extraction/debate.py` | Parallel Debate (fan-out → collect → synthesize) |
| Agent Server | `extraction/agent_server.py` | FastAPI endpoints |
| Platform Agents | `extraction/platform_agents.py` | Backend/Frontend specialists |

### Observability

| Module | File | Purpose |
|--------|------|---------|
| Tracing | `extraction/tracing.py` | Opik: `@track`, `wrap_openai_client()` |
| Config | `extraction/config.py` | OPIK_URL, OPIK_WORKSPACE, OPIK_ENABLED |

## Opik Span Tree (Debate)

```
agent_server.run_debate                    [debate-mode]
  └─ debate.run_debate                     [orchestration, N agents]
       ├─ debate.run_single_agent          [fan-out, db: kgnormal]
       │    └─ OpenAI chat.completions     [auto-traced]
       ├─ debate.run_single_agent          [fan-out, db: kgfibo]
       │    └─ OpenAI chat.completions     [auto-traced]
       └─ debate.supervisor_synthesis      [synthesis]
            └─ OpenAI chat.completions     [auto-traced]
```

## Frontend Trace Topology

```
FANOUT ──────────┬──────────┬──────────┐
                 ▼          ▼          ▼
             Agent_db1  Agent_db2  Agent_dbN
             (DEBATE)   (DEBATE)   (DEBATE)
                 │          │          │
                 └──────┬───┘──────────┘
                        ▼
                    COLLECT
                        │
                        ▼
                   SYNTHESIS
                  (Supervisor)
```

Rendered via `metadata.parent` (fan-out) and `metadata.sources` (collection) in the UI payload.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/run_agent` | POST | Legacy router mode |
| `/run_agent_semantic` | POST | Semantic entity-resolution flow |
| `/run_debate` | POST | Parallel debate mode |
| `/indexes/fulltext/ensure` | POST | Ensure fulltext index for semantic routing |
| `/platform/chat/send` | POST | Platform chat endpoint |
| `/platform/ingest/raw` | POST | Raw data ingestion |
| `/databases` | GET | List registered databases |
| `/agents` | GET | List active agents |
| `/health/runtime` | GET | Runtime health |
| `/health/batch` | GET | Batch process health |

## Configuration

### Environment (`.env`)

```
OPENAI_API_KEY=sk-...
NEO4J_URI=bolt://neo4j:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password
OPIK_URL=http://opik-backend:8080/api  (opt-in)
```

### Prompt Config (`extraction/conf/`)

```
conf/
├── prompts/
│   ├── default.yaml     # Extraction (supports ontology variables)
│   ├── linking.yaml     # Entity linking
│   └── router.yaml      # Router agent
├── schemas/
│   ├── baseline.yaml    # kgnormal schema
│   └── fibo.yaml        # kgfibo schema
└── graphs/
    └── default.yaml     # Graph registry config
```
