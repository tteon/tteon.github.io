---
title: What is SEOCHO?
description: An introduction to the SEOCHO Agent-Driven Knowledge Graph Platform.
---

SEOCHO is an open-source, agent-driven platform that converts unstructured text into a structured, queryable Knowledge Graph using dynamic Neo4j databases and parallel AI reasoning.

## 3-Line Summary

1. **Extracts & Links**: Automatically processes documents (CSV, JSON, APIs) to extract and deduplicate entities using LLMs and embeddings.
2. **Dynamic DBs**: Spawns isolated Neo4j instances on the fly for specific datasets, applying dynamic schemas.
3. **Parallel Debate**: Employs multiple specialized AI agents running concurrently to debate and synthesize the most accurate answers to user queries.

## Core Concepts

* **Data Plane**: Ingestion, extraction, semantic linking, and Neo4j loading pipelines.
* **Control Plane**: Orchestrates routing, authorization, and parallel agent debates.
* **Semantic Layer**: Improves answer accuracy by semantically disambiguating user queries before Cypher generation.
* **Observability**: Gated integration with Opik for complete observability into your agent's thought processes.
