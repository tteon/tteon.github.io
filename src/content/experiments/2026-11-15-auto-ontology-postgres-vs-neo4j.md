---
title: "Auto-Ontology × Postgres/Neo4j Benchmark (1,600 Requests)"
date: 2026-11-15
host: "Local Benchmark Harness"
hypothesis: "Supplying explicit ontology context improves query accuracy uniformly across all reasoning tiers on both Postgres and Neo4j."
verdict: "Mixed"
keyMetric: "Tier 2 +0.725 (p=4.74e-15) vs Tier 3 -0.225 (p=4.01e-05) on Postgres"
repoUrl: "https://github.com/tteon/auto-ontology-bench"
tags: ["auto-ontology", "neo4j", "postgres", "benchmark", "mcnemar"]
summary: "Paired McNemar evaluation over 1,600 requests showing massive Tier 2 accuracy gains alongside statistically significant Tier 3 regressions."
---

## Experiment Setup

Stage A evaluated four conditions (`neo-no-onto`, `neo-onto`, `pg-no-onto`, `pg-onto`) across 5 query tiers (80 pairs per tier; 400 requests per condition; 1,600 requests total). Correctness uses lenient result-set matching against gold (Tier 5 measures expected abstention/decline). Bracketed ranges denote 95% bootstrap confidence intervals.

## Accuracy Across Tiers

| Condition | Tier 1 | Tier 2 | Tier 3 | Tier 4 | Tier 5 | Overall (n=400) |
|---|---|---|---|---|---|---|
| `neo-no-onto` | 0.39 [0.28–0.50] | 0.07 [0.03–0.14] | 0.28 [0.19–0.38] | 0.16 [0.09–0.24] | 0.86 [0.79–0.94] | **0.35** [0.31–0.40] |
| `neo-onto` | 0.36 [0.26–0.47] | 0.60 [0.50–0.71] | 0.15 [0.07–0.24] | 0.12 [0.05–0.20] | 0.88 [0.80–0.95] | **0.42** [0.37–0.47] |
| `pg-no-onto` | 0.78 [0.68–0.86] | 0.17 [0.10–0.26] | 0.49 [0.38–0.60] | 0.26 [0.17–0.36] | 0.90 [0.82–0.96] | **0.52** [0.47–0.57] |
| `pg-onto` | 0.78 [0.68–0.86] | 0.90 [0.82–0.96] | 0.26 [0.16–0.36] | 0.15 [0.07–0.24] | 0.86 [0.79–0.94] | **0.59** [0.54–0.64] |

## Paired Effects & Latency (Medians)

- **Tier 2 Surge**: Adding ontology context lifted Tier 2 accuracy by **+0.725** on Postgres (`McNemar p=4.74e-15`) and **+0.525** on Neo4j (`p=4.46e-10`).
- **Tier 3 Regression**: On Tier 3, adding ontology *reduced* accuracy by **-0.225** on Postgres (`p=4.01e-05`) and **-0.125** on Neo4j (`p=0.0129`), accompanied by a jump in syntax errors on `pg-onto` (38 vs 13 without ontology).
- **End-to-End Bottleneck**: Median DB wall latency was `2.6 ms` (`pg-onto`) vs `119.1 ms` (`neo-onto`), while total LLM latency dominated end-to-end p50 at `7,836 ms` vs `10,153 ms` respectively.

## Verdict & Next Step

**Mixed**: Ontology grounding does not lift every tier monotonically—prompting an LLM with dense ontology constraints can solve schema-linking failures (Tier 2) while inducing over-constrained syntax errors on more complex queries (Tier 3). Next step: selective competency-filtered ontology injection per query tier.
