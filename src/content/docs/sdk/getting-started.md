---
title: Getting Started
description: From zero to a working knowledge graph in 5 minutes
---

# Getting Started

## 1. Install

```bash
pip install seocho
```

## 2. Define your schema

An ontology tells SEOCHO what entities and relationships exist in your domain.

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

`P(str, unique=True)` means: string property, must be unique. This single declaration drives the extraction prompt, query prompt, a Neo4j UNIQUE constraint, and SHACL validation.

## 3. Connect and index

```python
from seocho import Seocho
from seocho.graph_store import Neo4jGraphStore
from seocho.llm_backend import OpenAIBackend

s = Seocho(
    ontology=ontology,
    graph_store=Neo4jGraphStore("bolt://localhost:7687", "neo4j", "password"),
    llm=OpenAIBackend(model="gpt-4o"),
)

s.ensure_constraints()  # apply UNIQUE/INDEX to the database
s.add("Marie Curie worked at the University of Paris.")
```

SEOCHO automatically: sends an ontology-aware extraction prompt to the LLM → gets back Person and Company nodes → validates against SHACL → deduplicates → writes to Neo4j.

## 4. Query

```python
print(s.ask("Where did Marie Curie work?"))
# → "Marie Curie worked at the University of Paris."
```

The LLM generates Cypher using your ontology as context — it knows `Person` and `Company` exist, `WORKS_AT` connects them, and `name` is the unique lookup key.

## 5. Index files from a directory

The easiest way to bring your own data:

```python
results = s.index_directory("./my_data/", database="mydb")
print(f"Indexed {results['files_indexed']} files")
```

Supports `.txt`, `.md`, `.csv`, `.json`, `.jsonl`. Changed files are auto-detected on re-run.

## 6. Inspect what was extracted

```python
result = s.extract("Elon Musk is the CEO of Tesla and SpaceX.")
print(result)
# {"nodes": [...], "relationships": [...]}

# Check extraction quality
scores = ontology.score_extraction(result)
print(f"Quality: {scores['overall']}")
```

## 7. Save your ontology

```python
ontology.to_jsonld("schema.jsonld")  # version control this

# Load it back
ontology = Ontology.from_jsonld("schema.jsonld")
```

## What's Next

| Goal | Link |
|------|------|
| Design a richer ontology | [Ontology Guide](/sdk/ontology-guide/) |
| Full method reference | [API Reference](/sdk/api-reference/) |
| Real-world patterns | [Examples](/sdk/examples/) |
