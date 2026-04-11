---
title: Examples
description: Copy-pasteable SDK examples for loading data and querying graphs.
---

# Examples

## Batch Ingest Your Own Records

```python
from seocho import Seocho

client = Seocho(base_url="http://localhost:8001", workspace_id="default")

result = client.raw_ingest(
    [
        {"id": "doc-1", "content": "ACME acquired Beta in 2024."},
        {"id": "doc-2", "content": "Beta provides risk analytics to ACME."},
    ],
    target_database="accounts_graph",
)

print(result.status)
print(result.records_processed)
```

## One-Off Memory Add

```python
memory = client.add(
    "Alex manages the Seoul retail account.",
    metadata={"source": "crm_note"},
)

print(memory.memory_id)
```

## Semantic Query with Repair

```python
semantic = client.semantic(
    "What is Neo4j related to GraphRAG?",
    graph_ids=["kgnormal"],
    reasoning_mode=True,
    repair_budget=2,
)

print(semantic.route)
print(semantic.semantic_context["reasoning"])
print(semantic.response)
```

## Explicit Execution Plan

```python
result = (
    client.plan("Who manages the Seoul retail account?")
    .on_graph("kgnormal")
    .with_repair_budget(2)
    .run()
)

print(result.route)
print(result.response)
```

## Cross-Graph Comparison

```python
advanced = client.advanced(
    "Compare what the baseline and finance graphs know about ACME.",
    graph_ids=["kgnormal", "kgfibo"],
)

print(advanced.debate_state)
print(advanced.response)
```

## Module-Level Convenience API

```python
import seocho

seocho.configure(base_url="http://localhost:8001", workspace_id="default")

print(seocho.ask("What do you know about ACME?"))
```

## Inspect Graph Targets

```python
for graph in client.graphs():
    print(graph.graph_id, graph.database, graph.ontology_id, graph.vocabulary_profile)
```
