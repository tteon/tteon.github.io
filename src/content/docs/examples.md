---
title: Examples
description: Copyable SEOCHO examples from local graph memory to runtime APIs.
slug: examples
---

Start local. Move to runtime when another process needs to consume the same
graph contract.

## 1. Local Graph Memory

```python
from seocho import Seocho, Ontology, NodeDef, RelDef, Property

ontology = Ontology(
    name="accounts",
    nodes={
        "Company": NodeDef(properties={"name": Property(str, unique=True)}),
        "Product": NodeDef(properties={"name": Property(str, unique=True)}),
    },
    relationships={
        "PROVIDES": RelDef(source="Company", target="Product"),
    },
)

client = Seocho.local(ontology, llm="mara/MiniMax-M2.5")
client.add("Beta provides risk analytics to ACME.")

print(client.ask("What does Beta provide?"))
```

## 2. Index Multiple Records

```python
client.add_batch([
    "ACME acquired Beta in 2024.",
    "Beta provides risk analytics to ACME.",
    "ACME uses the risk analytics product for compliance review.",
])

print(client.ask("How is Beta related to ACME?", reasoning_mode=True))
```

## 3. Use A Running Runtime

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
```

## 4. Query With Bounded Repair

```python
semantic = client.semantic(
    "What is ACME related to?",
    databases=["accounts_graph"],
    reasoning_mode=True,
    repair_budget=2,
)

print(semantic.response)
```

## 5. Direct Runtime API

```bash
curl -sS -X POST http://localhost:8001/platform/ingest/raw \
  -H "Content-Type: application/json" \
  -d '{
    "workspace_id": "default",
    "target_database": "accounts_graph",
    "records": [
      {"id": "doc-1", "content": "ACME acquired Beta in 2024."}
    ]
  }'
```

## Next

- [Quickstart](/docs/quickstart/)
- [Concept Guide](/learn/)
- [Bring Your Data](/docs/apply_your_data/)
- [Python SDK](/docs/python_sdk/)
- [SDK Examples](/sdk/examples/)
