---
title: Ontology and Semantic Artifacts
description: How graph targets, ontology metadata, JSON-LD, SHACL, and vocabulary profiles shape retrieval.
---

# Ontology and Semantic Artifacts

SEOCHO does not treat ontology as a decorative prompt appendix. It uses graph
metadata and approved semantic artifacts to constrain retrieval and improve
query quality.

## Graph Targets Are First-Class

Each graph target can carry:

- `graph_id`
- `database`
- `ontology_id`
- `vocabulary_profile`

You can inspect them through the SDK:

```python
for graph in client.graphs():
    print(graph.graph_id, graph.database, graph.ontology_id, graph.vocabulary_profile)
```

## `graph_ids` vs `databases`

Use `graph_ids` when you want the public routing surface.

Use `databases` when you already know the physical ingest target and want the
lowest-level runtime reference.

Typical developer flow:

- ingest to `target_database`
- inspect `client.graphs()`
- query through `graph_ids` when you want graph-aware routing

## What the Semantic Layer Uses

The runtime can combine:

- ontology summaries
- JSON-LD context
- SHACL-like shape constraints
- vocabulary aliases
- graph profile metadata

That combined slice is used to narrow labels, relations, properties, and path
choices before query execution.

## Why This Matters

The goal is not unconstrained text-to-cypher generation.

The goal is:

1. semantic-layer-first retrieval
2. inspectable evidence bundles
3. bounded repair when the first attempt is insufficient

This is why `reasoning_mode=True` is more useful than jumping immediately to
full debate for most hard questions.

## When to Add Approved Semantic Artifacts

Add stronger ontology or shape artifacts when:

- a graph needs more deterministic relation constraints
- query behavior drifts across runs
- you want governance around approved semantic contracts
- multiple datasets need explicit vocabulary normalization

## Practical Adoption Path

1. ingest representative data
2. test `semantic(...)`
3. inspect graph metadata and evidence bundles
4. add approved semantic artifacts where ambiguity remains
5. use `advanced(...)` only when the task is genuinely cross-graph
