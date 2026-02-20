---
title: System Architecture
description: Learn how SEOCHO's Data Pipeline and Debate Orchestrator work.
---

SEOCHO transforms unstructured data into structured knowledge. Below is the full diagram of our agent-driven pipeline.

```mermaid
graph TD
    %% Styling
    classDef external fill:transparent,stroke:#52525B,stroke-width:1px,stroke-dasharray:5 5,color:#A1A1AA
    classDef pipeline fill:#3a82f61a,stroke:#3A82F6,stroke-width:1px,color:#60A5FA
    classDef db fill:#10b9811a,stroke:#10B981,stroke-width:1px,color:#34D399
    classDef agent fill:#6366f11a,stroke:#6366F1,stroke-width:1px,color:#818CF8
    classDef user fill:transparent,stroke:none,color:#E4E4E7,font-weight:bold

    User(("User Query")):::user

    subgraph DataPlane["Data Extraction Pipeline"]
        DS["Data Sources<br/>CSV / JSON / API"]:::external
        Extractor["LLM Extractor"]:::pipeline
        Linker["Entity Linker<br/>& Semantics"]:::pipeline
        DBManager["Database Manager<br/>Dynamic Schema"]:::pipeline
    end

    subgraph ControlPlane["Parallel Debate Orchestrator"]
        Router["Router/Debate<br/>Controller"]:::agent
        Agent1["Agent kgnormal"]:::agent
        Agent2["Agent kgfibo"]:::agent
        AgentN["Agent n..."]:::agent
        Supervisor["Synthesis<br/>Supervisor"]:::agent
    end

    Neo4j[("Neo4j / DozerDB<br/>Multiple Distinct DBs")]:::db

    %% Pipeline Flow
    DS --> Extractor
    Extractor --> Linker
    Linker --> DBManager
    DBManager --> Neo4j

    %% Query Flow
    User --> Router
    Router -->|Fan-Out| Agent1
    Router -->|Fan-Out| Agent2
    Router -->|Fan-Out| AgentN
    
    Agent1 -.-> Neo4j
    Agent2 -.-> Neo4j
    AgentN -.-> Neo4j

    Agent1 -->|Collect| Supervisor
    Agent2 -->|Collect| Supervisor
    AgentN -->|Collect| Supervisor

    Supervisor -->|Final Answer| User
```

## The Data Plane

The pipeline revolves around four primary stages:
1. **Extraction (LLM Extractor)**: Consumes flat documents and queries language models using strict ontology schemas to extract structured relationships.
2. **Entity Linking**: Refines the LLM's raw entities by clustering similar descriptions into root identifiers.
3. **Semantic Verification**: Cosine-similarity checks enforce strict deduplication over FAISS embeddings.
4. **Data Management**: Provisions partitioned graph subsets dynamically and inserts the final knowledge representation into a generalized Neo4j host engine.

## The Control Plane

1. **Parallel Debate Fan-Out**: When queries are submitted, the `DebateOrchestrator` fans out the prompt to explicitly isolated sub-agent populations that run concurrently with independent states.
2. **Collection Loop**: The `SharedMemory` interface collates the findings in real-time. 
3. **Synthesis**: The `Supervisor` agent evaluates conflicting conclusions and responds with a single, highly-grounded summary.
