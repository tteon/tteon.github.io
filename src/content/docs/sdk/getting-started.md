---
title: Getting Started
description: Set up SEOCHO SDK and index your first data in 5 minutes
---

# Getting Started

This guide gets you from zero to a working knowledge graph in 5 minutes.

## Prerequisites

- Python 3.11+
- A running Neo4j or DozerDB instance
- An OpenAI API key

## Step 1: Install

```bash
pip install seocho
```

## Step 2: Define Your Ontology

An ontology tells SEOCHO what entities and relationships exist in your domain. Start simple — you can always expand later.

```python
from seocho import Ontology, NodeDef, RelDef, P

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
```

**What `P(str, unique=True)` means:** Property of type string, must be unique in the database. This single declaration drives:
- The extraction prompt (tells the LLM what to look for)
- The query prompt (tells the LLM the schema)
- A Neo4j UNIQUE constraint
- Post-extraction validation

## Step 3: Connect and Index

```python
from seocho import Seocho
from seocho.graph_store import Neo4jGraphStore
from seocho.llm_backend import OpenAIBackend

s = Seocho(
    ontology=ontology,
    graph_store=Neo4jGraphStore("bolt://localhost:7687", "neo4j", "password"),
    llm=OpenAIBackend(model="gpt-4o"),
)

# Apply schema constraints to the database
s.ensure_constraints()

# Index a document
s.add("Marie Curie worked at the University of Paris.")
```

That's it. SEOCHO:
1. Sent your text to the LLM with an ontology-aware extraction prompt
2. Got back `Person(name="Marie Curie")` and `Company(name="University of Paris")`
3. Linked and deduplicated entities
4. Wrote them to Neo4j with a `WORKS_AT` relationship

## Step 4: Query

```python
answer = s.ask("Where did Marie Curie work?")
print(answer)
# → "Marie Curie worked at the University of Paris."
```

Behind the scenes, SEOCHO generated a Cypher query using your ontology as context — it knows `Person` and `Company` exist, that `WORKS_AT` connects them, and that `name` is the unique lookup key.

## Step 5: Inspect What Was Extracted

```python
# Run extraction without writing to the graph
result = s.extract("Elon Musk is the CEO of Tesla and SpaceX.")
print(result)
```

```json
{
  "nodes": [
    {"id": "elon_musk", "label": "Person", "properties": {"name": "Elon Musk"}},
    {"id": "tesla", "label": "Company", "properties": {"name": "Tesla"}},
    {"id": "spacex", "label": "Company", "properties": {"name": "SpaceX"}}
  ],
  "relationships": [
    {"source": "elon_musk", "target": "tesla", "type": "WORKS_AT"},
    {"source": "elon_musk", "target": "spacex", "type": "WORKS_AT"}
  ]
}
```

## What's Next

| I want to... | Read this |
|---|---|
| Design a richer ontology | [Ontology Guide](/sdk/ontology-guide/) |
| Validate data before writing | [Ontology Guide → Validation](/sdk/ontology-guide/#validation) |
| Save my ontology as a file | [Ontology Guide → JSON-LD](/sdk/ontology-guide/#json-ld) |
| See the full method list | [API Reference](/sdk/api-reference/) |
| See real-world patterns | [Examples](/sdk/examples/) |
