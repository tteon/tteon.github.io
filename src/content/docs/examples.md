---
title: Examples
description: Practical patterns for building knowledge graphs with SEOCHO
---

# Examples

## Python SDK

Ready-to-run patterns — see [SDK Examples](/docs/sdk/examples/) for full code.

| Pattern | What it shows |
|---------|---------------|
| **News Article Indexing** | Multi-entity extraction with Person, Organization, Location, Event |
| **Research Paper Extraction** | Academic domain: Paper, Author, Method, Dataset |
| **Manual Pipeline** | Step-by-step extract → SHACL validate → write |
| **CSV Batch Indexing** | Bulk import from structured data files |
| **JSON-LD Ontology** | Version-controlled schema files for teams |
| **Denormalized Export** | Flatten graph data for vector search or tabular export |

### Minimal example

```python
from seocho import Seocho, Ontology, NodeDef, RelDef, P
from seocho.graph_store import Neo4jGraphStore
from seocho.llm_backend import OpenAIBackend

onto = Ontology(
    name="demo",
    nodes={
        "Person":  NodeDef(properties={"name": P(str, unique=True)}),
        "Company": NodeDef(properties={"name": P(str, unique=True)}),
    },
    relationships={
        "WORKS_AT": RelDef(source="Person", target="Company"),
    },
)

s = Seocho(
    ontology=onto,
    graph_store=Neo4jGraphStore("bolt://localhost:7687", "neo4j", "pass"),
    llm=OpenAIBackend(model="gpt-4o"),
)

s.add("Elon Musk is the CEO of Tesla and SpaceX.")
print(s.ask("What companies does Elon Musk lead?"))
```

## Platform (Docker Stack)

### Ingest raw data

```bash
curl -X POST http://localhost:8001/platform/ingest/raw \
  -H "Content-Type: application/json" \
  -d '{
    "workspace_id": "default",
    "target_database": "mydb",
    "records": [
      {"id": "1", "content": "ACME acquired Beta Corp in 2024."}
    ]
  }'
```

### Semantic query

```bash
curl -X POST http://localhost:8501/api/chat/send \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "demo",
    "message": "What companies are mentioned?",
    "mode": "semantic",
    "workspace_id": "default",
    "databases": ["mydb"]
  }'
```

### Multi-agent debate

```bash
curl -X POST http://localhost:8501/api/chat/send \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "demo",
    "message": "Compare entities across all databases",
    "mode": "debate",
    "workspace_id": "default"
  }'
```

## Domain Examples

| Domain | Ontology approach |
|--------|------------------|
| **Financial** | FIBO ontology with Organization, Asset, Transaction entities |
| **Medical** | Drug, Symptom, Side-Effect extraction from clinical manuscripts |
| **Legal** | Contract, Party, Clause, Obligation relationship mapping |
| **HR/Org** | Employee, Department, Role hierarchy with MANY_TO_ONE cardinality |
