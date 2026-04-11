---
title: Quick Start
description: Get SEOCHO up and running in 5 minutes.
---

# Quick Start

Two paths to get started — pick the one that fits:

| Path | When to use | Time |
|------|-------------|------|
| **[A. Python SDK](#a-python-sdk)** | You want to index and query data from Python code | 3 min |
| **[B. Docker Stack](#b-docker-stack)** | You want the full platform with UI, multi-agent debate, etc. | 5 min |

---

## A. Python SDK

### 1. Install

```bash
pip install seocho
```

### 2. Define your schema

```python
from seocho import Ontology, NodeDef, RelDef, P

ontology = Ontology(
    name="my_domain",
    nodes={
        "Person":  NodeDef(properties={"name": P(str, unique=True)}),
        "Company": NodeDef(properties={"name": P(str, unique=True)}),
    },
    relationships={
        "WORKS_AT": RelDef(source="Person", target="Company"),
    },
)
```

### 3. Connect and index

```python
from seocho import Seocho
from seocho.graph_store import Neo4jGraphStore
from seocho.llm_backend import OpenAIBackend

s = Seocho(
    ontology=ontology,
    graph_store=Neo4jGraphStore("bolt://localhost:7687", "neo4j", "password"),
    llm=OpenAIBackend(model="gpt-4o"),
)

s.ensure_constraints()
s.add("Marie Curie worked at the University of Paris.")
```

### 4. Query

```python
print(s.ask("Where did Marie Curie work?"))
# → "Marie Curie worked at the University of Paris."
```

That's it. For more details see the [SDK documentation](/sdk/).

---

## B. Docker Stack

The full platform gives you multi-agent debate, a web UI, and all extraction services.

### Prerequisites

- Docker + Docker Compose
- OpenAI API key (`OPENAI_API_KEY`)
- `jq` (optional, for pretty API responses)

### 1. Clone and configure

```bash
git clone https://github.com/tteon/seocho.git
cd seocho

cp .env.example .env
# edit .env — required: OPENAI_API_KEY=sk-...
```

### 2. Start services

```bash
make up
docker compose ps
```

Expected services: `neo4j`, `extraction-service`, `semantic-service`, `evaluation-interface`

### 3. Verify

```bash
curl -sS http://localhost:8001/databases | jq .
```

Default URLs:

- Platform UI: `http://localhost:8501`
- API docs: `http://localhost:8001/docs`
- DozerDB browser: `http://localhost:7474`

### 4. Ingest data

```bash
curl -sS -X POST http://localhost:8001/platform/ingest/raw \
  -H "Content-Type: application/json" \
  -d '{
    "workspace_id":"default",
    "target_database":"kgruntime",
    "records":[
      {"id":"raw_1","content":"ACME acquired Beta in 2024."},
      {"id":"raw_2","content":"Beta provides risk analytics to ACME."}
    ]
  }' | jq .
```

### 5. Ensure fulltext index

```bash
curl -sS -X POST http://localhost:8001/indexes/fulltext/ensure \
  -H "Content-Type: application/json" \
  -d '{
    "workspace_id":"default",
    "databases":["kgruntime"],
    "index_name":"entity_fulltext",
    "create_if_missing":true
  }' | jq .
```

### 6. Ask questions

**Semantic mode:**

```bash
curl -sS -X POST http://localhost:8501/api/chat/send \
  -H "Content-Type: application/json" \
  -d '{
    "session_id":"qs_1",
    "message":"Show entities in kgruntime",
    "mode":"semantic",
    "workspace_id":"default",
    "databases":["kgruntime"]
  }' | jq '{assistant_message}'
```

**Debate mode:**

```bash
curl -sS -X POST http://localhost:8501/api/chat/send \
  -H "Content-Type: application/json" \
  -d '{
    "session_id":"qs_2",
    "message":"Compare known entities across databases",
    "mode":"debate",
    "workspace_id":"default"
  }' | jq '{assistant_message}'
```

### 7. Smoke test

```bash
make e2e-smoke
```

### 8. Or use the Python SDK against the running server

```python
from seocho import Seocho

s = Seocho(base_url="http://localhost:8001")
s.add("ACME acquired Beta in 2024.", database="kgruntime")
print(s.ask("What happened with ACME?"))
```

---

## Next Steps

| Goal | Link |
|------|------|
| Design a richer ontology | [Ontology Guide](/sdk/ontology-guide/) |
| Full SDK method reference | [API Reference](/sdk/api-reference/) |
| Real-world examples | [Examples](/sdk/examples/) |
| Architecture deep-dive | [Architecture](/docs/architecture/) |
