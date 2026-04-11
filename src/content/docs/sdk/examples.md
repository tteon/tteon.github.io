---
title: Examples
description: Copy-pasteable patterns for building knowledge graphs with SEOCHO
---

# Examples

## Index Files from a Directory

The easiest way to bring your own data:

```python
from seocho import Seocho, Ontology, NodeDef, RelDef, P
from seocho.graph_store import Neo4jGraphStore
from seocho.llm_backend import OpenAIBackend

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

s = Seocho(
    ontology=ontology,
    graph_store=Neo4jGraphStore("bolt://localhost:7687", "neo4j", "pass"),
    llm=OpenAIBackend(model="gpt-4o"),
)

# Index a whole directory
results = s.index_directory("./my_data/", database="mydb")
print(f"Indexed {results['files_indexed']} files")

# Re-run — only changed files are processed
results = s.index_directory("./my_data/", database="mydb")
# files_unchanged: 5, files_indexed: 0
```

### Supported formats

| Format | How it's processed |
|--------|--------------------|
| `.txt`, `.md` | Entire file → one document |
| `.csv` | Each row → one document (auto-detects `content` column) |
| `.json` | Array of objects → each is a document |
| `.jsonl` | One JSON object per line |

## News Article Pipeline

```python
ontology = Ontology(
    name="news",
    nodes={
        "Person":       NodeDef(properties={"name": P(str, unique=True), "title": P(str)}),
        "Organization": NodeDef(properties={"name": P(str, unique=True), "sector": P(str)}),
        "Event":        NodeDef(properties={"name": P(str, unique=True), "date": P(str)}),
    },
    relationships={
        "WORKS_AT":    RelDef(source="Person", target="Organization", cardinality="MANY_TO_ONE"),
        "INVOLVED_IN": RelDef(source="Person", target="Event"),
    },
)

s = Seocho(ontology=ontology, graph_store=store, llm=llm)

for article in articles:
    s.add(article, database="news_kg")

print(s.ask("What happened at WWDC?", database="news_kg"))
```

## Extract and Validate Before Writing

```python
extracted = s.extract("Tesla reported Q4 revenue of $25.2B.")
scores = ontology.score_extraction(extracted)
print(f"Quality: {scores['overall']}")

errors = ontology.validate_with_shacl(extracted)
if errors:
    print("Issues:", errors)
```

## Reasoning Mode (Auto-Retry)

```python
answer = s.ask(
    "Which companies are in chip supply?",
    database="news_kg",
    reasoning_mode=True,
    repair_budget=2,
)
```

## Multi-Ontology per Database

```python
s.register_ontology("finance_db", Ontology.from_jsonld("finance.jsonld"))
s.register_ontology("hr_db", Ontology.from_jsonld("hr.jsonld"))

s.add("Q4 revenue was $10B", database="finance_db")
s.add("Alice joined engineering", database="hr_db")
```

## Incremental Re-indexing

```python
mem = s.add("Initial version.", database="mydb")
s.reindex(mem.memory_id, "Updated version.", database="mydb")
s.delete_source(mem.memory_id, database="mydb")
```

## Denormalized Export

```python
flat = ontology.to_denormalized_view(nodes, relationships)
# Person now has company_name, company_ticker embedded
```

## HTTP Mode

```python
s = Seocho(base_url="http://localhost:8001")
s.add("Some content")
print(s.ask("What do you know?"))
```
