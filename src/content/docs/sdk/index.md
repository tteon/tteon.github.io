---
title: SDK Overview
description: The practical entry point for SEOCHO's ontology-first Python SDK.
slug: sdk
---

The SDK is the easiest way to understand SEOCHO. It gives you the same core
contract in three shapes: embedded local mode, explicit graph backend mode, and
remote runtime mode.

## Pick A Mode

| Mode | Constructor | Use when |
|---|---|---|
| Embedded local | `Seocho.local(ontology)` | you want the fastest first run |
| Explicit backend | `Seocho(ontology=..., graph_store=..., llm=...)` | you want Neo4j or DozerDB control |
| Remote runtime | `Seocho(base_url="http://localhost:8001")` | another process owns the runtime |

Most people should start with embedded local mode.

## Install

```bash
uv pip install "seocho[local]"
```

For HTTP client mode only:

```bash
uv pip install seocho
```

For repository development:

```bash
uv sync --extra dev
```

## Minimal Example

```python
from seocho import Seocho, Ontology, NodeDef, RelDef, Property

ontology = Ontology(
    name="work",
    nodes={
        "Person": NodeDef(properties={"name": Property(str, unique=True)}),
        "Company": NodeDef(properties={"name": Property(str, unique=True)}),
    },
    relationships={
        "WORKS_AT": RelDef(source="Person", target="Company"),
    },
)

client = Seocho.local(ontology, llm="mara/MiniMax-M2.5")
client.add("Marie Curie worked at the University of Paris.")

print(client.ask("Where did Marie Curie work?"))
```

## What The Ontology Controls

| Stage | What happens |
|---|---|
| Extraction | tells the model which facts should become graph nodes and edges |
| Graph writes | keeps generated facts shaped by constraints and provenance |
| Querying | gives retrieval and Cypher generation the same schema context |
| Repair | keeps retries bounded when the first query is too weak |
| Runtime | produces artifacts that other agents can consume through HTTP |

## API You Will Use First

| API | What it is for |
|---|---|
| `client.add(text)` | index one text item |
| `client.add_batch(items)` | index multiple text items |
| `client.index_directory(path)` | index files from disk |
| `client.ask(question)` | ask the semantic graph path |
| `client.ask(..., reasoning_mode=True)` | allow bounded repair |
| `client.session(name)` | keep context across a sequence of operations |

## Next

- [Getting Started](/sdk/getting-started/) for a step-by-step walkthrough.
- [Ontology Guide](/sdk/ontology-guide/) for schema design and artifacts.
- [API Reference](/sdk/api-reference/) for full method detail.
- [Concept Guide](/learn/) for the project map.
- [Files and Artifacts](/docs/files_and_artifacts/) for generated state.
