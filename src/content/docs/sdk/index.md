---
title: SDK Overview
description: Ontology-first Python SDK for knowledge graph construction and querying
---

# SEOCHO SDK

Python SDK that puts **ontology at the center** of knowledge graph construction and querying. Define your schema once — it drives extraction prompts, query prompts, graph constraints, and validation automatically.

## Install

```bash
pip install seocho
```

## 30-Second Example

```python
from seocho import Seocho, Ontology, NodeDef, RelDef, P
from seocho.graph_store import Neo4jGraphStore
from seocho.llm_backend import OpenAIBackend

# 1. Define your ontology
ontology = Ontology(
    name="my_knowledge_base",
    nodes={
        "Company": NodeDef(
            description="A business entity",
            properties={"name": P(str, unique=True), "sector": P(str)},
        ),
        "Person": NodeDef(
            description="An individual",
            properties={"name": P(str, unique=True), "role": P(str)},
        ),
    },
    relationships={
        "WORKS_AT": RelDef(
            source="Person", target="Company",
            cardinality="MANY_TO_ONE",
        ),
    },
)

# 2. Connect
store = Neo4jGraphStore("bolt://localhost:7687", "neo4j", "password")
llm = OpenAIBackend(model="gpt-4o")
s = Seocho(ontology=ontology, graph_store=store, llm=llm)

# 3. Index your data — ontology shapes the extraction prompt
s.add("Jay Y. Lee is the chairman of Samsung Electronics.")

# 4. Query — ontology shapes the Cypher generation prompt
answer = s.ask("Who leads Samsung?")
print(answer)
# → "Jay Y. Lee is the chairman of Samsung Electronics."
```

## How It Works

```
Your Data                    Your Ontology
    │                             │
    ▼                             ▼
┌──────────┐  ontology context  ┌────────────────┐
│ s.add()  │ ◄──────────────── │ ExtractionStrat │
└────┬─────┘                    └────────────────┘
     │ extracted nodes/rels           │
     ▼                                ▼
┌──────────┐  SHACL validation  ┌────────────────┐
│ Validate │ ◄──────────────── │ onto.to_shacl() │
└────┬─────┘                    └────────────────┘
     │ validated data                 │
     ▼                                ▼
┌──────────┐  constraints       ┌────────────────┐
│ DozerDB  │ ◄──────────────── │ Cypher gen      │
└──────────┘                    └────────────────┘

┌──────────┐  schema context    ┌────────────────┐
│ s.ask()  │ ◄──────────────── │ QueryStrategy   │
└────┬─────┘                    └────────────────┘
     │ Cypher + results               │
     ▼                                ▼
┌──────────┐                    ┌────────────────┐
│ Answer   │ ◄──────────────── │ Answer synth    │
└──────────┘                    └────────────────┘
```

The ontology feeds into **every stage** — extraction prompts know what entity types exist, query prompts know the schema and constraints, and validation catches mismatches before they hit the database.

## Next Steps

- [Getting Started](/docs/sdk/getting-started/) — Full setup walkthrough
- [Ontology Guide](/docs/sdk/ontology-guide/) — Design your schema
- [API Reference](/docs/sdk/api-reference/) — Complete method reference
- [Examples](/docs/sdk/examples/) — Real-world patterns
