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

`P(str, unique=True)` = string property, must be unique. This drives the extraction prompt, query prompt, a Neo4j UNIQUE constraint, and SHACL validation — all from one declaration.

## 3. Connect

```python
from seocho import Seocho
from seocho.store import Neo4jGraphStore, OpenAIBackend

s = Seocho(
    ontology=ontology,
    graph_store=Neo4jGraphStore("bolt://localhost:7687", "neo4j", "password"),
    llm=OpenAIBackend(model="gpt-4o"),
)

s.ensure_constraints()
```

## 4. Index data

```python
# Single text
s.add("Marie Curie worked at the University of Paris.")

# From files
s.index_directory("./my_data/")

# Batch
s.add_batch([
    "Apple CEO Tim Cook announced new AI features.",
    "Samsung's Jay Y. Lee met with NVIDIA's Jensen Huang.",
])
```

## 5. Query

```python
print(s.ask("Where did Marie Curie work?"))

# With auto-retry for hard questions
print(s.ask("Which companies are involved in chip supply?",
            reasoning_mode=True, repair_budget=2))
```

## 6. Inspect extraction

```python
# Preview what gets extracted (without writing)
result = s.extract("Elon Musk is the CEO of Tesla and SpaceX.")
print(result)

# Check quality
scores = ontology.score_extraction(result)
print(f"Quality: {scores['overall']:.0%}")
```

## 7. Save your schema

```python
ontology.to_jsonld("schema.jsonld")   # commit this to version control
ontology = Ontology.from_jsonld("schema.jsonld")  # load it back
```

## 8. Use domain-specific prompts

```python
from seocho.query import PRESET_PROMPTS

s = Seocho(
    ontology=ontology,
    graph_store=store,
    llm=llm,
    extraction_prompt=PRESET_PROMPTS["finance"],  # or: legal, medical, research
)
```

## What's Next

| Goal | Link |
|------|------|
| Design a richer ontology | [Ontology Guide](/sdk/ontology-guide/) |
| Full method reference | [API Reference](/sdk/api-reference/) |
| Real-world patterns | [Examples](/sdk/examples/) |
