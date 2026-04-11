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

## Two Ways to Use

### Local mode — no server needed

```python
from seocho import Seocho, Ontology, NodeDef, RelDef, P
from seocho.store import Neo4jGraphStore, OpenAIBackend
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

s = Seocho(
    ontology=ontology,
    graph_store=Neo4jGraphStore("bolt://localhost:7687", "neo4j", "pass"),
    llm=OpenAIBackend(model="gpt-4o"),
)

s.add("Marie Curie worked at the University of Paris.")
print(s.ask("Where did Marie Curie work?"))
```

### HTTP mode — against a running server

```python
s = Seocho(base_url="http://localhost:8001")
s.add("Marie Curie worked at the University of Paris.")
print(s.ask("Where did Marie Curie work?"))
```

## What the Ontology Controls

Your ontology feeds into **every stage**:

| Stage | What the ontology provides |
|-------|---------------------------|
| **Extraction** | Entity types, relationship types, property constraints → system prompt |
| **Querying** | Full graph schema, cardinality, query hints → Cypher generation prompt |
| **Validation** | SHACL shapes derived automatically → post-extraction check |
| **Graph constraints** | Cypher UNIQUE/INDEX statements generated from property definitions |
| **Denormalization** | Cardinality-based safety rules for flattening graph data |
| **Linking** | Ontology context for entity deduplication |

## Key Features

- **File-based indexing**: `s.index_directory("./data/")` — drop files and index
- **Automatic chunking**: long documents split with overlap
- **Content deduplication**: same text won't be indexed twice
- **SHACL validation gate**: reject invalid extractions before writing
- **Reasoning mode**: `s.ask(question, reasoning_mode=True, repair_budget=2)` — auto-retry with relaxed queries
- **Multi-ontology**: `s.register_ontology("finance_db", finance_onto)` — per-database schemas
- **Confidence scoring**: `ontology.score_extraction(data)` — quality metrics
- **JSON-LD storage**: `ontology.to_jsonld("schema.jsonld")` — version-controlled schemas
- **Incremental indexing**: `s.reindex(source_id, new_content)` — update without duplicates

## Next

- [Getting Started](/sdk/getting-started/) — 5-minute walkthrough
- [Ontology Guide](/sdk/ontology-guide/) — schema design, JSON-LD, SHACL, denormalization
- [API Reference](/sdk/api-reference/) — full method reference
- [Examples](/sdk/examples/) — real-world patterns
