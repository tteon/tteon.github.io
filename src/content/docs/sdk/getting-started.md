---
title: SDK Getting Started
description: Install the Python package, configure the client, ingest records, and query safely.
---

# SDK Getting Started

## Install

Published package:

```bash
pip install seocho
```

Repository install:

```bash
pip install -e ".[dev]"
```

## Configure

```python
from seocho import Seocho

client = Seocho(base_url="http://localhost:8001", workspace_id="default")
```

Or with the module-level API:

```python
import seocho

seocho.configure(base_url="http://localhost:8001", workspace_id="default")
```

## Ingest Records

```python
client.raw_ingest(
    [
        {"id": "r1", "content": "ACME acquired Beta in 2024."},
        {"id": "r2", "content": "Beta provides risk analytics to ACME."},
    ],
    target_database="accounts_graph",
)
```

## Query Through the Semantic Layer

```python
semantic = client.semantic(
    "What is ACME related to?",
    databases=["accounts_graph"],
    reasoning_mode=True,
    repair_budget=2,
)

print(semantic.route)
print(semantic.response)
```

## Use Advanced Debate Explicitly

```python
advanced = client.advanced(
    "Compare what the baseline and finance graphs know about ACME.",
    graph_ids=["kgnormal", "kgfibo"],
)

print(advanced.debate_state)
```

## Next

- [`/docs/apply_your_data/`](/docs/apply_your_data/)
- [`/sdk/api-reference/`](/sdk/api-reference/)
- [`/sdk/examples/`](/sdk/examples/)
