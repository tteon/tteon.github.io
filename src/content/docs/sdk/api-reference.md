---
title: API Reference
description: Public Python SDK reference for ingestion, semantic retrieval, and advanced debate.
---

# API Reference

## Client Construction

```python
from seocho import Seocho

client = Seocho(
    base_url="http://localhost:8001",
    workspace_id="default",
    user_id="alex",
)
```

Module-level convenience:

```python
import seocho

seocho.configure(base_url="http://localhost:8001", workspace_id="default")
```

## Ingestion

### `add(content, *, metadata=None, ...) -> Memory`

Memory-style text ingestion.

```python
memory = client.add("Alex manages the Seoul retail account.")
```

### `raw_ingest(records, *, target_database, ...) -> RawIngestResult`

Batch ingestion for repeatable datasets.

```python
result = client.raw_ingest(records, target_database="accounts_graph")
```

## Memory and Search

### `ask(message, *, graph_ids=None, databases=None) -> str`

Fast developer-facing memory answer.

### `chat(message, *, graph_ids=None, databases=None) -> ChatResponse`

Structured chat response with evidence information.

### `search(query, *, graph_ids=None, databases=None) -> list[SearchResult]`

Memory search without full answer generation.

## Semantic Retrieval

### `semantic(query, *, graph_ids=None, databases=None, entity_overrides=None, reasoning_mode=False, repair_budget=0) -> SemanticRunResponse`

Primary graph-grounded query surface.

```python
semantic = client.semantic(
    "Who manages the Seoul retail account?",
    graph_ids=["kgnormal"],
    reasoning_mode=True,
    repair_budget=2,
)
```

Important fields on the response:

- `response`
- `route`
- `semantic_context`
- `semantic_context["reasoning"]`
- `semantic_context["evidence_bundle_preview"]`

## Advanced Debate

### `advanced(query, *, graph_ids=None) -> DebateRunResponse`

Explicit advanced mode for cross-graph comparison.

```python
advanced = client.advanced(
    "Compare what the baseline and finance graphs know about ACME.",
    graph_ids=["kgnormal", "kgfibo"],
)
```

Important fields:

- `response`
- `debate_state`
- `debate_results`
- `agent_statuses`

## Planning Surface

### `plan(query) -> ExecutionPlanBuilder`

Builder for an explicit execution plan.

```python
result = (
    client.plan("Who manages the Seoul retail account?")
    .on_graph("kgnormal")
    .with_repair_budget(2)
    .run()
)
```

Useful builder methods:

- `.on_graph(...)`
- `.on_graphs(...)`
- `.with_ontology(...)`
- `.with_vocabulary(...)`
- `.with_repair_budget(...)`
- `.direct()`
- `.react()`
- `.advanced()`
- `.run()`

## Graph and Runtime Inspection

### `graphs() -> list[GraphTarget]`

Inspect available graph targets and their semantic metadata.

### `databases() -> list[str]`

List runtime databases.

### `agents() -> list[str]`

List currently available graph-specialist agents.

### `ensure_fulltext_indexes(...) -> FulltextIndexResponse`

Ensure full-text lookup surfaces exist for retrieval.

## Platform Runtime Surfaces

### `platform_chat(message, *, mode="semantic", ...) -> PlatformChatResponse`

Structured chat surface used by the platform UI.

### `session_history(session_id) -> PlatformSessionResponse`

Fetch chat session history.

### `reset_session(session_id) -> PlatformSessionResponse`

Reset a chat session.

## Async Client

```python
from seocho import AsyncSeocho

client = AsyncSeocho()
semantic = await client.semantic("What is ACME related to?")
await client.aclose()
```
