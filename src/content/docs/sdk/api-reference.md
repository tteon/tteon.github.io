---
title: API Reference
description: Complete method reference for the SEOCHO SDK
---

# API Reference

## Seocho

The main client. Works in two modes:

```python
# Local mode — all processing in-process
s = Seocho(ontology=onto, graph_store=store, llm=llm)

# HTTP mode — delegates to a running SEOCHO server
s = Seocho(base_url="http://localhost:8001")
```

### Core Methods

#### `s.add(content, *, database, category, metadata) → Memory`

Extract entities and relationships from text, then write to the graph.

```python
mem = s.add(
    "Samsung was founded in 1938 by Lee Byung-chul.",
    database="company_kg",
    category="history",
)
print(mem.memory_id)     # unique ID
print(mem.entities)      # [{"id": "samsung", "label": "Company"}, ...]
```

#### `s.ask(message, *, database) → str`

Ask a natural-language question. Generates ontology-aware Cypher, executes it, and synthesizes an answer.

```python
answer = s.ask("When was Samsung founded?", database="company_kg")
# → "Samsung was founded in 1938."
```

#### `s.extract(content, *, category, metadata) → dict`

Extract without writing to the graph. Useful for inspection and debugging.

```python
result = s.extract("Elon Musk runs Tesla.")
# {"nodes": [...], "relationships": [...]}
```

*Local mode only.*

#### `s.query(cypher, *, params, database) → list[dict]`

Execute raw Cypher against the graph store.

```python
records = s.query(
    "MATCH (p:Person)-[:WORKS_AT]->(c:Company) RETURN p.name, c.name",
    database="company_kg",
)
```

*Local mode only.*

#### `s.ensure_constraints(*, database) → dict`

Apply ontology-derived constraints (UNIQUE, INDEX) to the database.

```python
result = s.ensure_constraints(database="company_kg")
# {"success": 3, "errors": []}
```

*Local mode only.*

#### `s.close()`

Release all resources.

---

## Ontology

### Constructors

```python
# From code
onto = Ontology(name="domain", nodes={...}, relationships={...})

# From files
onto = Ontology.from_jsonld("schema.jsonld")  # canonical
onto = Ontology.from_yaml("schema.yaml")
onto = Ontology.from_dict({...})
```

### Serialization

```python
onto.to_jsonld("schema.jsonld")    # save as JSON-LD (canonical)
onto.to_yaml("schema.yaml")       # save as YAML
doc = onto.to_jsonld()             # returns dict without saving
data = onto.to_dict()              # plain dict
```

### Prompt Context

```python
onto.to_extraction_context()  # → dict for extraction prompts
onto.to_query_context()       # → dict for query prompts
onto.to_linking_context()     # → dict for entity linking prompts
```

### Validation

```python
onto.validate()                    # → list[str] — ontology consistency errors
onto.validate_extraction(data)     # → list[str] — check nodes/rels against schema
onto.validate_with_shacl(data)     # → list[str] — full SHACL validation (types + cardinality)
```

### Constraints & Shapes

```python
onto.to_cypher_constraints()  # → list[str] — CREATE CONSTRAINT / INDEX statements
onto.to_shacl()               # → dict — derived SHACL shapes
```

### Denormalization

```python
onto.denormalization_plan()                        # → dict — what's safe to embed
onto.to_denormalized_view(nodes, relationships)    # → list[dict] — flattened nodes
onto.normalize_view(denormalized_nodes)            # → (nodes, rels) — back to normalized
```

### Label Safety

```python
onto.is_valid_label("Company")     # True
onto.sanitize_label("Unknown")     # "Entity" (fallback)
```

---

## NodeDef

```python
NodeDef(
    description="Human-readable description",
    properties={"name": P(str, unique=True)},
    aliases=["Alt Name 1", "Alt Name 2"],
    broader=["ParentType"],
    same_as="schema:Organization",
)
```

| Attribute | Type | Description |
|---|---|---|
| `description` | str | Shown in LLM prompts |
| `properties` | dict[str, P] | Property definitions |
| `aliases` | list[str] | Alternative names for LLM extraction |
| `broader` | list[str] | Parent types (hierarchy) |
| `same_as` | str \| None | Standard vocabulary mapping (e.g. `schema:Person`) |
| `.unique_properties` | list[str] | Properties with UNIQUE constraint |
| `.indexed_properties` | list[str] | Properties with INDEX |
| `.required_properties` | list[str] | Properties that must be present |

---

## RelDef

```python
RelDef(
    source="Person",
    target="Company",
    cardinality="MANY_TO_ONE",
    description="Employment relationship",
    aliases=["works for", "employed by"],
    same_as="schema:worksFor",
)
```

| Attribute | Type | Description |
|---|---|---|
| `source` | str | Source node label |
| `target` | str | Target node label |
| `cardinality` | str | ONE_TO_ONE, ONE_TO_MANY, MANY_TO_ONE, MANY_TO_MANY |
| `description` | str | Shown in LLM prompts |
| `aliases` | list[str] | Alternative names for LLM |
| `same_as` | str \| None | Standard vocabulary mapping |

---

## P (Property)

```python
P(type, unique=False, index=False, required=False, description="", aliases=[])
```

| Parameter | Type | Default | Effect |
|---|---|---|---|
| `type` | type \| PropertyType | str | Python type: `str`, `int`, `float`, `bool` |
| `unique` | bool | False | UNIQUE constraint + auto-required |
| `index` | bool | False | Database index for fast lookups |
| `required` | bool | False | Must be present in extracted data |
| `description` | str | "" | Shown in LLM prompts |
| `aliases` | list[str] | [] | Alternative property names |

---

## GraphStore

Abstract interface. Use `Neo4jGraphStore` for DozerDB/Neo4j:

```python
from seocho.graph_store import Neo4jGraphStore

store = Neo4jGraphStore("bolt://localhost:7687", "neo4j", "password")
store.write(nodes, relationships, database="mydb")
store.query("MATCH (n) RETURN n LIMIT 5", database="mydb")
store.ensure_constraints(ontology, database="mydb")
store.get_schema(database="mydb")
store.close()
```

---

## LLMBackend

Abstract interface. Use `OpenAIBackend`:

```python
from seocho.llm_backend import OpenAIBackend

llm = OpenAIBackend(model="gpt-4o", api_key="sk-...")  # api_key optional if env set
response = llm.complete(system="You are...", user="Extract...")
print(response.text)
print(response.usage)  # {"prompt_tokens": 150, "completion_tokens": 80, ...}
parsed = response.json()  # auto-strips markdown fences
```

---

## PromptStrategy

For advanced users who want to customize prompt generation:

```python
from seocho.prompt_strategy import ExtractionStrategy, QueryStrategy, LinkingStrategy

ext = ExtractionStrategy(ontology, category="finance")
system_prompt, user_prompt = ext.render("Some text to extract...")

qs = QueryStrategy(ontology, schema_info={"total_nodes": 5000})
system_prompt, user_prompt = qs.render("Who is the CEO of Samsung?")
system_prompt, user_prompt = qs.render_answer(question, cypher_results)
```
