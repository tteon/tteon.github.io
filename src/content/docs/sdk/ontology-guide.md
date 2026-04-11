---
title: Ontology Guide
description: Design the schema that drives your knowledge graph
---

# Ontology Guide

Your ontology is the single source of truth. It defines what entities exist, how they connect, and what constraints apply — then SEOCHO uses it everywhere.

## Basics

An ontology has three building blocks:

```python
from seocho import Ontology, NodeDef, RelDef, P

ontology = Ontology(
    name="finance",
    nodes={...},          # entity types
    relationships={...},  # how they connect
)
```

### Nodes

A node is an entity type with properties:

```python
"Company": NodeDef(
    description="A registered business entity",
    properties={
        "name":         P(str, unique=True),    # required, unique
        "ticker":       P(str, index=True),     # indexed for fast lookup
        "founded_year": P(int),                 # typed as integer
        "is_public":    P(bool),                # typed as boolean
    },
    aliases=["기업", "회사", "Corp"],  # alternative names the LLM might use
)
```

**Property shorthand — `P(...)`:**

| Parameter | Effect |
|---|---|
| `P(str)` | String property, no constraints |
| `P(str, unique=True)` | UNIQUE constraint + required |
| `P(str, index=True)` | Indexed for fast lookups |
| `P(int)` | Integer type — validated after extraction |
| `P(str, required=True)` | Must be present in extracted data |
| `P(str, description="ISO country code")` | Hint shown in LLM prompts |

### Relationships

A relationship connects two node types:

```python
"CEO_OF": RelDef(
    source="Person",
    target="Company",
    cardinality="MANY_TO_ONE",  # each person is CEO of at most one company
    description="Chief executive relationship",
)
```

**Cardinality options:**

| Value | Meaning | Example |
|---|---|---|
| `MANY_TO_MANY` | No limit (default) | Fund INVESTED_IN Company |
| `MANY_TO_ONE` | Each source has at most 1 target | Person CEO_OF Company |
| `ONE_TO_MANY` | Each target has at most 1 source | Company HAS_CEO Person |
| `ONE_TO_ONE` | Exclusive both ways | Person HAS_PASSPORT Passport |

Cardinality matters — it drives [validation](#validation) and [denormalization safety](#denormalization).

## JSON-LD: Save and Load {#json-ld}

JSON-LD is the canonical storage format. Your ontology connects to standard vocabularies via `@context`.

### Save

```python
ontology.to_jsonld("schema.jsonld")
```

Produces:

```json
{
  "@context": {
    "schema": "https://schema.org/",
    "skos": "http://www.w3.org/2004/02/skos/core#",
    "seocho": "https://seocho.dev/ontology/"
  },
  "@id": "seocho:finance",
  "@type": "seocho:Ontology",
  "name": "finance",
  "nodes": {
    "Company": {
      "@type": "seocho:NodeType",
      "description": "A registered business entity",
      "sameAs": "schema:Organization",
      "properties": {
        "name": { "type": "string", "unique": true },
        "ticker": { "type": "string", "index": true }
      }
    }
  },
  "relationships": {
    "CEO_OF": {
      "source": "Person",
      "target": "Company",
      "cardinality": "MANY_TO_ONE",
      "sameAs": "schema:worksFor"
    }
  }
}
```

### Load

```python
ontology = Ontology.from_jsonld("schema.jsonld")
```

Also supports YAML:

```python
ontology = Ontology.from_yaml("schema.yaml")
```

### Linking to Standard Vocabularies

Use `same_as` to connect your types to schema.org or other standards:

```python
"Company": NodeDef(
    same_as="schema:Organization",  # maps to schema.org
    ...
)
```

This makes your knowledge graph interoperable with the broader semantic web.

## Validation {#validation}

### Ontology Self-Check

```python
errors = ontology.validate()
# ["Node 'Event' has no UNIQUE property — consider adding one"]
```

### Post-Extraction Validation (SHACL)

After the LLM extracts data, validate it against your ontology:

```python
extracted = s.extract("Some text...")

errors = ontology.validate_with_shacl(extracted)
for e in errors:
    print(e)
# "Node 'p1' (Person).age: expected integer, got str"
# "Node 'p1' (Person) has 2 [:CEO_OF] relationships but cardinality is MANY_TO_ONE (max 1)"
```

This catches:
- Unknown labels (not in your ontology)
- Missing required properties
- Wrong data types (string where integer expected)
- Cardinality violations (too many relationships)

### View SHACL Shapes

```python
import json
shacl = ontology.to_shacl()
print(json.dumps(shacl, indent=2))
```

SHACL shapes are derived automatically from your ontology — you never write them manually.

## Denormalization {#denormalization}

When querying, you sometimes want flat records instead of a graph. SEOCHO uses cardinality to determine what's safe to flatten.

### The Rule

| Cardinality | Can embed target into source? | Why |
|---|---|---|
| `MANY_TO_ONE` | **Yes** | At most 1 target per source |
| `ONE_TO_ONE` | **Yes** (both ways) | Exactly 1 in each direction |
| `ONE_TO_MANY` | Target can embed source | Reverse of MANY_TO_ONE |
| `MANY_TO_MANY` | **Never** | Ambiguous — which one to embed? |

### In Practice

```python
# See what's safe to embed
plan = ontology.denormalization_plan()

# Flatten graph data
flat = ontology.to_denormalized_view(nodes, relationships)
# Person now has company_name, company_ticker embedded

# Reverse it
clean_nodes, clean_rels = ontology.normalize_view(flat)
# Back to pure normalized graph
```

This is useful for building LLM context, vector search documents, or tabular exports.

## Generating Database Constraints

```python
for stmt in ontology.to_cypher_constraints():
    print(stmt)
# CREATE CONSTRAINT constraint_Company_name_unique IF NOT EXISTS
#   FOR (n:Company) REQUIRE n.name IS UNIQUE
# CREATE INDEX index_Company_ticker IF NOT EXISTS
#   FOR (n:Company) ON (n.ticker)
```

Or apply them directly:

```python
s.ensure_constraints(database="mydb")
```
