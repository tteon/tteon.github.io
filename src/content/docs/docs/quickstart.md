---
title: Quickstart
description: Get SEOCHO up and running in 5 minutes.
---

## 🚀 5-Minute Quickstart

Ready to spin up a fully-functioning knowledge graph and multi-agent debate platform? Let's go!

### Step 1: Clone and Configure Environment
Clone the repository and set your API keys locally.
```bash
git clone https://github.com/tteon/seocho.git
cd seocho
cp .env.example .env
```
Inside `.env`, make sure to set your `OPENAI_API_KEY` and the default Neo4j credentials.

### Step 2: Spin Up Services
We use Docker for simplicity to launch Neo4j and the core services.
```bash
make up
```

### Step 3: Initialize Your First Graph
Once everything is running, ingest a baseline dataset to automatically provision your database and load the graph nodes.
```bash
python scripts/ingest_finder.py +recipe=baseline
```

### Step 4: Run a Debate Query
You can now ask questions to the specialized agents asynchronously. The `Router` will kick off parallel processes and compile a summary.
```bash
curl -X POST http://localhost:8001/run_debate \
     -H "Content-Type: application/json" \
     -d '{"query": "What are the relationships extracted in the baseline database?"}'
```

🎉 That's it! Your platform is active and resolving unstructured queries over your Neo4j database natively.
