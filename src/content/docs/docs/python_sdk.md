---
title: Python SDK
description: Developer-first guide to ingest data and query SEOCHO through the Python SDK.
---

> *Synced automatically from `seocho/docs/PYTHON_INTERFACE_QUICKSTART.md`*

# Python Interface Quickstart

SEOCHO's Python SDK is designed around a simple rule:

- default to the semantic layer
- turn on bounded repair when retrieval is insufficient
- use debate only as an explicit advanced mode

If you already have the runtime running at `http://localhost:8001`, you can
start here immediately.

If your first question is how to load your own records safely, read
`/docs/apply_your_data/` alongside this guide.

## 1. Install

Published package:

```bash
pip install seocho
```

Repository development install:

```bash
pip install -e ".[dev]"
```

## 2. Configure

Fastest script-style setup:

```python
import seocho

seocho.configure(base_url="http://localhost:8001", workspace_id="default")
```

Application-style setup:

```python
from seocho import Seocho

client = Seocho(base_url="http://localhost:8001", workspace_id="default")
```

## 3. Put Your Data In

### 3.1 Add one memory

```python
memory = client.add(
    "Alex manages the Seoul retail account and prefers ontology-aware retrieval.",
    metadata={"source": "sdk_quickstart"},
)

print(memory.memory_id)
```

### 3.2 Ingest a batch of raw records

```python
result = client.raw_ingest(
    [
        {"id": "r1", "content": "ACME acquired Beta in 2024."},
        {"id": "r2", "content": "Beta provides risk analytics to ACME."},
    ],
    target_database="kgruntime",
)

print(result.status)
print(result.records_processed)
```

If you want a fuller ingestion guide with target-graph and record-shape advice,
continue with `/docs/apply_your_data/`.

## 4. Ask the Simple Way

```python
print(client.ask("What do you know about Alex?"))
```

```python
response = client.chat("What do you know about Alex?")

print(response.assistant_message)
print(response.evidence_bundle)
```

## 5. Use the Semantic Layer First

```python
semantic = client.semantic(
    "Who manages the Seoul retail account?",
    graph_ids=["kgnormal"],
)

print(semantic.route)
print(semantic.response)
print(semantic.semantic_context["evidence_bundle_preview"])
```

## 6. Turn On Repair When the Query Is Hard

```python
semantic = client.semantic(
    "What is Neo4j related to GraphRAG?",
    graph_ids=["kgnormal"],
    reasoning_mode=True,
    repair_budget=2,
)

print(semantic.route)
print(semantic.semantic_context["reasoning"])
print(semantic.semantic_context["evidence_bundle_preview"])
```

## 7. Use the Builder Surface

```python
result = (
    client.plan("Who manages the Seoul retail account?")
    .on_graph("kgnormal")
    .with_repair_budget(2)
    .run()
)

print(result.route)
```

## 8. Use Advanced Mode Only When You Really Need Debate

```python
advanced = client.advanced(
    "Compare what the baseline and finance graphs know about Alex.",
    graph_ids=["kgnormal", "kgfibo"],
)

print(advanced.debate_state)
print(advanced.response)
```

## 9. Inspect Graph Targets

```python
for graph in client.graphs():
    print(graph.graph_id, graph.database, graph.ontology_id, graph.vocabulary_profile)
```

## 10. Module-Level Convenience API

```python
import seocho

seocho.configure(base_url="http://localhost:8001", workspace_id="default")

print(seocho.ask("What do you know about Alex?"))

semantic = seocho.semantic(
    "Who manages the Seoul retail account?",
    graph_ids=["kgnormal"],
    reasoning_mode=True,
    repair_budget=2,
)
print(semantic.response)
```

## 11. Async API

```python
import asyncio
from seocho import AsyncSeocho


async def main() -> None:
    client = AsyncSeocho()
    answer = await client.ask("What does SEOCHO do?")
    print(answer)
    await client.aclose()


asyncio.run(main())
```

## 12. Mental Model

1. Start with `ask` or `chat` for memory-first use.
2. Use `semantic(...)` for graph-grounded retrieval.
3. Add `reasoning_mode=True` before reaching for debate.
4. Use `advanced()` only when you explicitly want multi-agent comparison.

## 13. Read Next

- [`/docs/apply_your_data/`](/docs/apply_your_data/)
- [`/sdk/api-reference/`](/sdk/api-reference/)
- [`/sdk/examples/`](/sdk/examples/)
