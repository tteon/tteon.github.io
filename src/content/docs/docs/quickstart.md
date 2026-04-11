---
title: Quickstart
description: Get SEOCHO up and running in 5 minutes.
---

> *Source mirrored from `seocho/docs/QUICKSTART.md`*

# SEOCHO Quick Start

Goal: one successful local run in under 5 minutes.

If you only read one runtime document first, read this one.

If you want the Python SDK path immediately, continue with
[`/docs/python_sdk/`](/docs/python_sdk/).
If your first question is how to load your own records, continue with
[`/docs/apply_your_data/`](/docs/apply_your_data/).

## 1. Prerequisites

- Docker and Docker Compose
- `OPENAI_API_KEY` recommended
- `curl` and `jq` for optional API checks

Without `OPENAI_API_KEY`, SEOCHO can still boot in local fallback mode for
basic verification.

## 2. Setup

```bash
git clone https://github.com/tteon/seocho.git
cd seocho
make setup-env
```

## 3. Start the Runtime

```bash
make up
docker compose ps
```

Or through the local CLI:

```bash
pip install -e ".[dev]"
seocho serve
```

Expected local surfaces:

- Platform UI: `http://localhost:8501`
- Backend API docs: `http://localhost:8001/docs`
- DozerDB browser: `http://localhost:7474`

## 4. First Success: UI Path

1. Open `http://localhost:8501`
2. Use the ingest panel or click the sample flow
3. Ask a semantic question

The default product path is:

- ingest data
- run semantic retrieval
- use bounded repair only when needed
- reserve debate for explicit advanced use

## 5. First Success: Direct API Path

Ingest two records:

```bash
curl -sS -X POST http://localhost:8001/platform/ingest/raw \
  -H "Content-Type: application/json" \
  -d '{
    "workspace_id": "default",
    "target_database": "kgruntime",
    "records": [
      {"id": "r1", "content": "ACME acquired Beta in 2024."},
      {"id": "r2", "content": "Beta provides risk analytics to ACME."}
    ]
  }' | jq .
```

Ask through the semantic endpoint:

```bash
curl -sS -X POST http://localhost:8001/run_agent_semantic \
  -H "Content-Type: application/json" \
  -d '{
    "workspace_id": "default",
    "query": "What is ACME related to?",
    "databases": ["kgruntime"],
    "reasoning_mode": true,
    "repair_budget": 2
  }' | jq '{route, response, reasoning: .semantic_context.reasoning}'
```

## 6. First Success: Python SDK Path

```python
from seocho import Seocho

client = Seocho(base_url="http://localhost:8001", workspace_id="default")

client.raw_ingest(
    [
        {"id": "r1", "content": "ACME acquired Beta in 2024."},
        {"id": "r2", "content": "Beta provides risk analytics to ACME."},
    ],
    target_database="kgruntime",
)

semantic = client.semantic(
    "What is ACME related to?",
    databases=["kgruntime"],
    reasoning_mode=True,
    repair_budget=2,
)

print(semantic.response)
print(semantic.semantic_context["reasoning"])
```

If your next step is loading your own production-like records instead of sample
data, read `/docs/apply_your_data/`.

## 7. Use Debate Only as an Advanced Mode

If you explicitly want cross-graph comparison:

```python
advanced = client.advanced(
    "Compare what each graph knows about ACME.",
    graph_ids=["kgnormal", "kgfibo"],
)

print(advanced.debate_state)
```

## 8. Validate the Runtime

```bash
make e2e-smoke
```

## 9. Troubleshooting

Check service state:

```bash
docker compose ps
docker compose logs --tail=200 extraction-service
docker compose logs --tail=200 evaluation-interface
```

Common issues:

- `OPENAI_API_KEY` missing or placeholder only
- port collision on `8001`, `8501`, `7474`, or `7687`
- graph database not ready yet

## 10. Read Next

- [`/docs/python_sdk/`](/docs/python_sdk/)
- [`/docs/apply_your_data/`](/docs/apply_your_data/)
- [`/docs/tutorial/`](/docs/tutorial/)
- [`/docs/architecture/`](/docs/architecture/)
