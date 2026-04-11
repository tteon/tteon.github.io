---
title: Examples
description: Real-world patterns for applying your data to SEOCHO
---

# Examples

Practical patterns for common use cases. Each example is copy-pasteable.

## News Article Indexing

Build a knowledge graph from news articles:

```python
from seocho import Seocho, Ontology, NodeDef, RelDef, P
from seocho.graph_store import Neo4jGraphStore
from seocho.llm_backend import OpenAIBackend

ontology = Ontology(
    name="news",
    nodes={
        "Person":       NodeDef(description="Public figure", properties={"name": P(str, unique=True), "title": P(str)}),
        "Organization": NodeDef(description="Company or institution", properties={"name": P(str, unique=True), "sector": P(str)}),
        "Location":     NodeDef(description="City, country, or region", properties={"name": P(str, unique=True)}),
        "Event":        NodeDef(description="Named event or incident", properties={"name": P(str, unique=True), "date": P(str)}),
    },
    relationships={
        "WORKS_AT":     RelDef(source="Person", target="Organization", cardinality="MANY_TO_ONE"),
        "LOCATED_IN":   RelDef(source="Organization", target="Location"),
        "INVOLVED_IN":  RelDef(source="Person", target="Event"),
        "OCCURRED_AT":  RelDef(source="Event", target="Location", cardinality="MANY_TO_ONE"),
    },
)

s = Seocho(
    ontology=ontology,
    graph_store=Neo4jGraphStore("bolt://localhost:7687", "neo4j", "pass"),
    llm=OpenAIBackend(model="gpt-4o"),
)
s.ensure_constraints(database="news_kg")

# Index articles
articles = [
    "Apple CEO Tim Cook announced new AI features at WWDC 2025 in Cupertino.",
    "Samsung's Jay Y. Lee met with NVIDIA's Jensen Huang in Seoul to discuss chip supply.",
    "The European Commission fined Meta €1.2B for data transfer violations in Brussels.",
]
for article in articles:
    s.add(article, database="news_kg", category="news")

# Query
print(s.ask("What happened in Seoul?", database="news_kg"))
print(s.ask("Which companies are involved in chip supply?", database="news_kg"))
```

## Research Paper Extraction

Extract structured knowledge from academic abstracts:

```python
ontology = Ontology(
    name="research",
    nodes={
        "Paper":      NodeDef(properties={"title": P(str, unique=True), "year": P(int)}),
        "Author":     NodeDef(properties={"name": P(str, unique=True), "affiliation": P(str)}),
        "Method":     NodeDef(description="Algorithm or technique", properties={"name": P(str, unique=True)}),
        "Dataset":    NodeDef(properties={"name": P(str, unique=True)}),
        "Metric":     NodeDef(properties={"name": P(str, unique=True), "value": P(str)}),
    },
    relationships={
        "AUTHORED":    RelDef(source="Author", target="Paper"),
        "USES":        RelDef(source="Paper", target="Method"),
        "EVALUATED_ON": RelDef(source="Paper", target="Dataset"),
        "ACHIEVES":    RelDef(source="Paper", target="Metric"),
    },
)
```

## Extract → Validate → Write (Manual Pipeline)

For full control over each step:

```python
# Step 1: Extract
extracted = s.extract(
    "Tesla reported Q4 revenue of $25.2B, up 2% year-over-year.",
    category="earnings",
)
print(extracted)

# Step 2: Validate with SHACL
errors = ontology.validate_with_shacl(extracted)
if errors:
    print("Validation issues:", errors)
    # fix or skip

# Step 3: Write to graph (only if valid)
if not errors:
    s.graph_store.write(
        extracted["nodes"],
        extracted["relationships"],
        database="finance_kg",
        workspace_id="default",
    )
```

## Batch Indexing from CSV

```python
import csv

ontology = Ontology(
    name="employees",
    nodes={
        "Employee":   NodeDef(properties={"name": P(str, unique=True), "department": P(str)}),
        "Department": NodeDef(properties={"name": P(str, unique=True)}),
    },
    relationships={
        "BELONGS_TO": RelDef(source="Employee", target="Department", cardinality="MANY_TO_ONE"),
    },
)

s = Seocho(ontology=ontology, graph_store=store, llm=llm)

with open("employees.csv") as f:
    for row in csv.DictReader(f):
        text = f"{row['name']} works in the {row['department']} department."
        s.add(text, database="hr_kg")
```

## Ontology from JSON-LD File

Keep your ontology in version control:

```bash
# schema.jsonld — commit this to your repo
```

```python
ontology = Ontology.from_jsonld("schema.jsonld")
s = Seocho(ontology=ontology, graph_store=store, llm=llm)

# Update and save back
# (after adding new node types programmatically)
ontology.to_jsonld("schema.jsonld")
```

## Denormalized Export for Vector Search

Create rich text documents from graph data for embedding:

```python
# After indexing...
nodes = [
    {"id": "p1", "label": "Person", "properties": {"name": "Tim Cook", "title": "CEO"}},
    {"id": "c1", "label": "Organization", "properties": {"name": "Apple", "sector": "Tech"}},
]
rels = [
    {"source": "p1", "target": "c1", "type": "WORKS_AT"},
]

# Flatten — embed company info into person records
flat = ontology.to_denormalized_view(nodes, rels)
for record in flat:
    if record["label"] == "Person":
        # "Tim Cook | CEO | organization_name: Apple | organization_sector: Tech"
        text = " | ".join(f"{k}: {v}" for k, v in record["properties"].items())
        # → feed this into your vector store
```

## HTTP Mode (Existing Server)

If you have a running SEOCHO server, skip local setup:

```python
s = Seocho(base_url="http://localhost:8001")

# Same API, different backend
s.add("Some content to index")
answer = s.ask("What do you know about X?")
results = s.search("find entities related to Y")
```
