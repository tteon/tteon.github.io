---
title: API Reference
description: Complete method reference for the SEOCHO Python SDK
---

# API Reference

## Seocho

### Construction

```python
from seocho import Seocho
from seocho.store import Neo4jGraphStore, OpenAIBackend

s = Seocho(
    ontology=ontology,
    graph_store=Neo4jGraphStore("bolt://localhost:7687", "neo4j", "pass"),
    llm=OpenAIBackend(model="gpt-4o"),
    extraction_prompt=PRESET_PROMPTS["finance"],  # optional
    vector_store=vs,                               # optional
)
```

### Indexing

| Method | Description |
|--------|-------------|
| `s.add(content, *, database, category, metadata, strict_validation)` | Index text with chunking + validation |
| `s.add_batch(documents, *, database, on_progress)` | Batch index multiple documents |
| `s.index_file(path, *, database, force)` | Index a file (.txt, .md, .csv, .json, .jsonl, .pdf) |
| `s.index_directory(directory, *, database, recursive, force)` | Index all supported files in a directory |
| `s.reindex(source_id, content, *, database)` | Delete old data and re-index fresh |
| `s.delete_source(source_id, *, database)` | Remove all graph data for a source |
| `s.extract(content, *, category)` | Extract without writing (inspect/debug) |

### Querying

| Method | Description |
|--------|-------------|
| `s.ask(message, *, database, reasoning_mode, repair_budget)` | Natural language → Cypher → answer |
| `s.query(cypher, *, params, database)` | Execute raw Cypher |
| `s.search_similar(query, *, limit)` | Vector similarity search |

### Graph Management

| Method | Description |
|--------|-------------|
| `s.ensure_constraints(*, database)` | Apply ontology-derived UNIQUE/INDEX constraints |
| `s.register_ontology(database, ontology)` | Bind per-database ontology |

---

## Ontology

### Construction

```python
from seocho import Ontology, NodeDef, RelDef, P

ontology = Ontology(name="domain", nodes={...}, relationships={...})
ontology = Ontology.from_jsonld("schema.jsonld")
ontology = Ontology.from_yaml("schema.yaml")
```

### Serialization

| Method | Description |
|--------|-------------|
| `to_jsonld(path?)` | Export as JSON-LD (canonical) |
| `to_yaml(path)` | Export as YAML |

### Validation & Scoring

| Method | Description |
|--------|-------------|
| `validate()` | Ontology consistency check |
| `validate_with_shacl(data)` | Full SHACL validation (types + cardinality) |
| `score_extraction(data)` | Quality scores (0.0–1.0) per node/rel |
| `to_shacl()` | View derived SHACL shapes |
| `to_cypher_constraints()` | View Cypher constraint statements |

### Denormalization

| Method | Description |
|--------|-------------|
| `denormalization_plan()` | What's safe to embed (based on cardinality) |
| `to_denormalized_view(nodes, rels)` | Flatten graph data |
| `normalize_view(denorm_nodes)` | Reverse to normalized form |

---

## PromptTemplate

```python
from seocho.query import PromptTemplate, PRESET_PROMPTS

# Custom
custom = PromptTemplate(
    system="You are a FIBO expert.\n{{entity_types}}\n{{relationship_types}}",
    user="Financial document:\n{{text}}",
)

# Presets: general, finance, legal, medical, research
PRESET_PROMPTS["finance"]
```

Available `{{variables}}`: `ontology_name`, `entity_types`, `relationship_types`, `constraints_summary`, `text`

---

## Experiment Workbench

```python
from seocho.experiment import Workbench

wb = Workbench(input_texts=["text..."])
wb.vary("ontology", ["v1.jsonld", "v2.jsonld"])
wb.vary("model", ["gpt-4o", "gpt-4o-mini"])
wb.vary("prompt_template", [PRESET_PROMPTS["general"], PRESET_PROMPTS["finance"]])
wb.vary("chunk_size", [4000, 8000])

results = wb.run_all()
```

| Method | Description |
|--------|-------------|
| `wb.vary(axis, values)` | Add a parameter axis |
| `wb.run_all()` | Execute all combinations |
| `results.leaderboard()` | Ranked table |
| `results.best_by(metric)` | Top result |
| `results.to_dataframe()` | Pandas DataFrame |
| `results.save(path)` | Save to directory |

---

## Tracing

```python
from seocho.tracing import enable_tracing

enable_tracing(backend="console")                    # stdout
enable_tracing(backend="jsonl", output="trace.jsonl") # raw file
enable_tracing(backend="opik", project_name="proj")   # Opik
enable_tracing(backend=["console", "jsonl"])           # multiple
```

---

## Storage Backends

```python
from seocho.store import Neo4jGraphStore, OpenAIBackend, FAISSVectorStore

store = Neo4jGraphStore("bolt://localhost:7687", "neo4j", "password")
llm = OpenAIBackend(model="gpt-4o", timeout=120.0)
vs = FAISSVectorStore(model="text-embedding-3-small")
```
