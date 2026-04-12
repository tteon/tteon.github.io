---
title: SDK Overview
description: Ontology-first Python SDK for knowledge graph construction and querying
---

# Python SDK

Define your schema once — it drives extraction, querying, validation, and graph constraints automatically.

## Install

```bash
pip install seocho
```

## Quick Example

```python
from seocho import Seocho, Ontology, NodeDef, RelDef, P
from seocho.store import Neo4jGraphStore, OpenAIBackend

# 1. Define your schema
ontology = Ontology(
    name="my_domain",
    nodes={
        "Person":  NodeDef(properties={"name": P(str, unique=True)}),
        "Company": NodeDef(properties={"name": P(str, unique=True)}),
    },
    relationships={
        "WORKS_AT": RelDef(source="Person", target="Company"),
    },
)

# 2. Connect
s = Seocho(
    ontology=ontology,
    graph_store=Neo4jGraphStore("bolt://localhost:7687", "neo4j", "pass"),
    llm=OpenAIBackend(model="gpt-4o"),
)

# 3. Index your data
s.add("Marie Curie worked at the University of Paris.")
s.index_directory("./my_data/")

# 4. Query
print(s.ask("Where did Marie Curie work?"))
```

## What the Ontology Controls

| Stage | What happens |
|-------|-------------|
| **Extraction** | Ontology tells the LLM what entity types and relationships to look for |
| **Querying** | Ontology gives the LLM full schema context for Cypher generation |
| **Validation** | SHACL shapes are derived → catches type errors and cardinality violations |
| **Constraints** | `UNIQUE`/`INDEX` statements generated and applied to Neo4j |
| **Denormalization** | Cardinality rules determine what's safe to flatten |

## Key Features

| Feature | What it does |
|---------|-------------|
| `s.index_directory("./data/")` | Index .txt, .md, .csv, .json, .jsonl, .pdf files |
| `s.ask("question", reasoning_mode=True)` | Auto-retry with relaxed queries if first attempt fails |
| `s.session("name")` | Agent session with context persistence across operations |
| `AgentConfig(execution_mode="agent")` | LLM agent with tool use (extract/validate/score/write) |
| `AgentConfig(execution_mode="supervisor", handoff=True)` | Sub-agent hand-off between IndexingAgent and QueryAgent |
| `RoutingPolicy(latency=0.1, information_quality=0.8)` | 3-axis trade-off for routing decisions |
| `onto_a.merge(onto_b)` | Combine two ontologies with conflict resolution |
| `onto.migration_plan(new_onto)` | Schema evolution with generated Cypher statements |
| `s.register_ontology("db", onto)` | Different schema per database |
| `ontology.to_jsonld("schema.jsonld")` | Version-controlled schema files |
| `Workbench` | Compare ontology/model/prompt combinations at scale |
| `enable_tracing(backend="console")` | Pluggable observability (console, JSONL, Opik) |

## Agent Sessions

```python
with s.session("analysis") as sess:
    sess.add("Samsung CEO Jay Y. Lee reported $234B revenue.")
    sess.add("Apple CEO Tim Cook reported $383B revenue.")
    answer = sess.ask("Compare Samsung and Apple revenue")
    # Structured entity context passed to QueryAgent
```

Three execution modes: `pipeline` (default, deterministic), `agent` (tool use), `supervisor` (hand-off).

## Next

- [Getting Started](/sdk/getting-started/) — 5-minute walkthrough
- [Ontology Guide](/sdk/ontology-guide/) — schema design, JSON-LD, SHACL
- [API Reference](/sdk/api-reference/) — full method reference
- [Examples](/sdk/examples/) — real-world patterns
