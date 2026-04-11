---
title: Bring Your Data
description: How to load your own records into SEOCHO and query them safely.
---

> *Source mirrored from `seocho/docs/APPLY_YOUR_DATA.md`*

# Apply Your Data to SEOCHO

SEOCHO is easiest to adopt when you keep the execution order simple:

1. load your data into a graph target
2. query through the semantic layer first
3. enable bounded repair for harder questions
4. use advanced debate only when you explicitly need cross-graph comparison

## Choose an Ingestion Path

Use `add(...)` for one-off text or memory-style inputs:

```python
from seocho import Seocho

client = Seocho(base_url="http://localhost:8001", workspace_id="default")

memory = client.add(
    "Alex manages the Seoul retail account.",
    metadata={"source": "crm_note"},
)

print(memory.memory_id)
```

Use `raw_ingest(...)` for repeatable dataset loads:

```python
result = client.raw_ingest(
    [
        {"id": "acct-1", "content": "ACME acquired Beta in 2024."},
        {"id": "acct-2", "content": "Beta provides risk analytics to ACME."},
    ],
    target_database="accounts_graph",
)

print(result.status)
print(result.records_processed)
```

## Recommended Record Shape

Minimum useful shape:

```json
{
  "id": "record-1",
  "content": "ACME acquired Beta in 2024."
}
```

Recommended additions:

- stable source IDs
- `metadata.source`
- `metadata.document_type`
- `metadata.timestamp`

## Choose a Target Graph

Use one `target_database` per dataset or evaluation boundary.

Inspect current targets:

```python
for graph in client.graphs():
    print(graph.graph_id, graph.database, graph.ontology_id, graph.vocabulary_profile)
```

## Query in the Right Order

Start simple:

```python
print(client.ask("What do you know about ACME?"))
```

Move to graph-grounded retrieval:

```python
semantic = client.semantic(
    "What is ACME related to?",
    databases=["accounts_graph"],
)

print(semantic.route)
print(semantic.response)
```

Turn on bounded repair when the query is harder:

```python
semantic = client.semantic(
    "What is Neo4j related to GraphRAG?",
    graph_ids=["kgnormal"],
    reasoning_mode=True,
    repair_budget=2,
)

print(semantic.semantic_context["reasoning"])
```

Use debate only as an explicit advanced mode:

```python
advanced = client.advanced(
    "Compare what the baseline and finance graphs know about ACME.",
    graph_ids=["kgnormal", "kgfibo"],
)

print(advanced.debate_state)
print(advanced.response)
```

## API Example

```bash
curl -sS -X POST http://localhost:8001/platform/ingest/raw \
  -H "Content-Type: application/json" \
  -d '{
    "workspace_id": "default",
    "target_database": "accounts_graph",
    "records": [
      {"id": "acct-1", "content": "ACME acquired Beta in 2024."},
      {"id": "acct-2", "content": "Beta provides risk analytics to ACME."}
    ]
  }' | jq .
```

```bash
curl -sS -X POST http://localhost:8001/run_agent_semantic \
  -H "Content-Type: application/json" \
  -d '{
    "workspace_id": "default",
    "query": "What is ACME related to?",
    "databases": ["accounts_graph"],
    "reasoning_mode": true,
    "repair_budget": 2
  }' | jq '{route, response, reasoning: .semantic_context.reasoning}'
```

## Where Ontology, JSON-LD, and SHACL Fit

You do not need to start by hand-authoring every ontology artifact.

The practical order is:

1. ingest representative data
2. inspect graph targets and semantic behavior
3. add approved semantic artifacts when you need stronger constraints,
   repeatability, or more deterministic retrieval

## Read Next

- [`/docs/python_sdk/`](/docs/python_sdk/)
- [`/docs/quickstart/`](/docs/quickstart/)
- [`/sdk/ontology-guide/`](/sdk/ontology-guide/)
