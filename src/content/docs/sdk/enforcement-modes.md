---
title: Ontology Enforcement Modes
description: What guided, strict, and open mean when SEOCHO indexes documents against an ontology.
---

# Ontology Enforcement Modes

When SEOCHO indexes a document it extracts entities and relationships and
checks them against your ontology. **Enforcement** decides what happens to
material that does *not* fit the ontology's declared types: is it admitted,
guided toward the schema, rejected, or admitted-but-flagged?

You set it in one line:

```yaml
ontology:
  path: ./schema.yaml
  enforcement: guided      # guided | strict | open
```

In a [sweep](/sdk/getting-started/) it becomes the axis you compare:

```yaml
variants:
  - name: guided
    vars: { enforcement: guided }
  - name: strict
    vars: { enforcement: strict }
  - name: open
    vars: { enforcement: open }
```

`enforcement` is an **admission policy for extracted data** — not a
reasoning regime. It does not change query-time inference; it changes which
extracted nodes and relationships are allowed into the graph and how
out-of-vocabulary material is handled. (It is the SHACL closed-shape idea,
not the OWA/CWA distinction.)

## The three modes at a glance

| | **guided** (default) | **strict** | **open** |
|---|---|---|---|
| Extraction prompt | ontology guides | + closed-vocabulary instruction | ontology guides |
| Empty-result retry | yes | **no** | yes |
| Generic `Entity` fallback | yes | **no** | yes |
| Heuristic fallback (LLM fails) | yes | **no** | yes |
| On validation error | **warn** & write | **reject** chunk | **warn** & write |
| Closed validation¹ | no | **yes** | no |
| Out-of-vocabulary tagging | no | no | **`_out_of_ontology`** |

¹ *Closed validation* drops the `Entity` exemption and additionally checks
that every relationship endpoint references an extracted node and conforms
to the relationship's declared source/target type (following the ontology's
`broader` subclass chain).

## guided — the default

The ontology *guides* extraction but does not gate it. The model is told
which entity and relationship types to prefer; anything that does not fit
cleanly still gets written, and validation problems are recorded as warnings
rather than blocking the write. If extraction comes back empty, SEOCHO
retries once in a relaxed mode and may fall back to a generic `Entity` node.

This is the mode SEOCHO's retrieval quality was tuned against. **Use it when
you want maximum recall** and you treat the ontology as a strong hint, not a
contract — most question-answering workloads.

## strict — closed vocabulary

Only what the ontology declares is admitted. Concretely:

- a constant "use only the listed types; never invent an `Entity`"
  instruction is appended to the extraction prompt;
- the relaxed-empty retry and the generic-`Entity` / heuristic fallbacks are
  **disabled** — an empty extraction is a legitimate outcome for text that
  contains nothing in your vocabulary;
- validation runs **closed**: unknown labels, dangling relationship
  endpoints, and endpoints that violate a relationship's declared
  source/target type are all errors;
- a chunk that produces any validation error is **rejected** (not written),
  and the rejection is counted in the report.

**Use it when the graph must be trustworthy** — audit, compliance, or
regulated domains where a single off-ontology fact is worse than a missing
one. Expect fewer nodes than guided, and accept that some chunks contribute
nothing.

> A strict run that indexes fewer nodes than guided is working as intended —
> it admitted only schema-conformant facts.

## open — admit everything, but mark it

Everything extracted is written, exactly like guided — **plus** every node
or relationship whose type is not in the ontology is stamped with a
`_out_of_ontology: "true"` property. Nothing is rejected.

That tag is the point: it lets you keep full recall while still being able to
separate sanctioned facts from unsanctioned ones, and it is the signal an
offline governance pass uses to find **schema-induction candidates** — types
the data wants that your ontology does not yet have.

```cypher
// What is the data asking me to add to the ontology?
MATCH (n) WHERE n._out_of_ontology = 'true'
RETURN labels(n) AS undeclared_type, count(*) AS hits
ORDER BY hits DESC
```

**Use it while you are still designing the ontology**, or to audit how much
of a corpus your current schema actually covers.

## Choosing

- **guided** — most QA workloads; ontology as a strong hint. *(default)*
- **strict** — trust matters more than recall; reject anything off-schema.
- **open** — discovery / ontology design; keep everything, label the gaps.

A quick way to *see* the difference on your own corpus is to sweep all three
and read the comparison table:

```bash
seocho sweep examples/run/sweep-enforcement/sweep.yaml
```

The bundled example indexes the same documents and questions under all three
modes and prints node/relationship counts side by side. See
[Getting Started](/sdk/getting-started/) for the full `seocho run` /
`seocho sweep` interface and [the Ontology Guide](/sdk/ontology-guide/) for
designing the schema these modes enforce.
