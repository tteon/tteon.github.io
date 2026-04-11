---
title: API Reference
description: Complete method reference for the SEOCHO Python SDK
---

# API Reference

## Seocho

### Construction

```python
# Local mode — all processing in-process
s = Seocho(ontology=onto, graph_store=store, llm=llm)

# With vector search
s = Seocho(ontology=onto, graph_store=store, llm=llm, vector_store=vs)

# HTTP mode — delegates to a running server
s = Seocho(base_url="http://localhost:8001")
```

### Indexing

| Method | Description |
|--------|-------------|
| `s.add(content, *, database, category, metadata, strict_validation)` | Index text with chunking + validation |
| `s.add_batch(documents, *, database, strict_validation, on_progress)` | Batch index multiple documents |
| `s.index_file(path, *, database, force)` | Index a single file (.txt, .md, .csv, .json, .jsonl) |
| `s.index_directory(directory, *, database, recursive, force, on_file)` | Index all supported files in a directory |
| `s.reindex(source_id, content, *, database)` | Delete old data and re-index fresh |
| `s.delete_source(source_id, *, database)` | Remove all graph data for a source |
| `s.extract(content, *, category)` | Extract without writing (inspection/debugging) |

### Querying

| Method | Description |
|--------|-------------|
| `s.ask(message, *, database, reasoning_mode, repair_budget)` | Natural language → Cypher → answer |
| `s.query(cypher, *, params, database)` | Execute raw Cypher |
| `s.search_similar(query, *, limit)` | Vector similarity search (requires vector_store) |

### Graph Management

| Method | Description |
|--------|-------------|
| `s.ensure_constraints(*, database)` | Apply ontology-derived UNIQUE/INDEX constraints |
| `s.register_ontology(database, ontology)` | Bind per-database ontology |
| `s.get_ontology(database)` | Get ontology for a database |

### HTTP-Mode Methods

| Method | Description |
|--------|-------------|
| `s.chat(message)` | Structured chat response |
| `s.search(query)` | Memory search |
| `s.semantic(query, *, databases, reasoning_mode)` | Graph-grounded retrieval |
| `s.debate(query, *, graph_ids)` | Multi-agent debate |
| `s.platform_chat(message, *, mode)` | Platform UI chat |
| `s.raw_ingest(records, *, target_database)` | Batch ingestion via server |
| `s.graphs()` | List graph targets |
| `s.databases()` | List databases |
| `s.health()` | Runtime health check |

---

## Ontology

### Construction

```python
Ontology(name="domain", nodes={...}, relationships={...})
Ontology.from_jsonld("schema.jsonld")  # canonical format
Ontology.from_yaml("schema.yaml")
Ontology.from_dict({...})
```

### Serialization

| Method | Description |
|--------|-------------|
| `to_jsonld(path?)` | Export as JSON-LD (canonical) |
| `to_yaml(path)` | Export as YAML |
| `to_dict()` | Plain dict |

### Prompt Context

| Method | Description |
|--------|-------------|
| `to_extraction_context()` | Dict for extraction prompts |
| `to_query_context()` | Dict for query prompts (schema + hints) |
| `to_linking_context()` | Dict for entity linking prompts |

### Validation

| Method | Description |
|--------|-------------|
| `validate()` | Ontology consistency check |
| `validate_extraction(data)` | Check nodes/rels against schema |
| `validate_with_shacl(data)` | Full SHACL validation (types + cardinality) |
| `score_extraction(data)` | Quality scores (0.0–1.0) per node/rel |

### Constraints & Shapes

| Method | Description |
|--------|-------------|
| `to_cypher_constraints()` | Cypher CREATE CONSTRAINT/INDEX statements |
| `to_shacl()` | Derived SHACL shapes |

### Denormalization

| Method | Description |
|--------|-------------|
| `denormalization_plan()` | What's safe to embed (based on cardinality) |
| `to_denormalized_view(nodes, rels)` | Flatten graph data |
| `normalize_view(denorm_nodes)` | Reverse to normalized form |

---

## NodeDef

```python
NodeDef(
    description="Human-readable",
    properties={"name": P(str, unique=True)},
    aliases=["Alt Name"],
    same_as="schema:Organization",
)
```

## RelDef

```python
RelDef(
    source="Person", target="Company",
    cardinality="MANY_TO_ONE",
    same_as="schema:worksFor",
)
```

## P (Property)

```python
P(type, unique=False, index=False, required=False, description="", aliases=[])
```

Types: `str`, `int`, `float`, `bool` or `PropertyType` enum.

---

## GraphStore

```python
from seocho.store import Neo4jGraphStore

store = Neo4jGraphStore("bolt://localhost:7687", "neo4j", "password")
store.write(nodes, rels, database="mydb")
store.query("MATCH (n) RETURN n LIMIT 5", database="mydb")
store.ensure_constraints(ontology, database="mydb")
store.delete_by_source(source_id, database="mydb")
store.close()
```

## LLMBackend

```python
from seocho.store import OpenAIBackend
llm = OpenAIBackend(model="gpt-4o", timeout=120.0)
response = llm.complete(system="...", user="...")
print(response.text)
parsed = response.json()  # auto-strips markdown fences
```

## VectorStore

```python
from seocho.store import FAISSVectorStore

vs = FAISSVectorStore(model="text-embedding-3-small")
vs.add("doc-1", "Samsung is a Korean tech company.")
results = vs.search("Korean electronics", limit=5)
```

---

## Experiment Workbench

```python
from seocho.experiment import Workbench, WorkbenchResults

wb = Workbench(input_texts=["text..."])
wb.vary("ontology", ["v1.jsonld", "v2.jsonld"])
wb.vary("model", ["gpt-4o", "gpt-4o-mini"])
wb.vary("chunk_size", [4000, 8000])
wb.vary("temperature", [0.0, 0.2])

results = wb.run_all()
```

| Method | Description |
|--------|-------------|
| `wb.vary(axis, values)` | Add a parameter axis to explore |
| `wb.total_combinations` | Number of runs that will execute |
| `wb.run_all()` | Execute all combinations → `WorkbenchResults` |
| `wb.on_run(callback)` | Progress callback `(run_idx, total, params)` |
| `results.best_by(metric)` | Highest scoring result |
| `results.worst_by(metric)` | Lowest scoring result |
| `results.leaderboard()` | Ranked table (human-readable) |
| `results.to_dataframe()` | Pandas DataFrame (requires pandas) |
| `results.save(path)` | Save to directory (results.json + summary.md) |
