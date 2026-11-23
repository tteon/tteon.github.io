---
title: "Auto-Ontology × Postgres/Neo4j Benchmark (1,600 Requests)"
date: 2026-11-15
host: "Local Benchmark Harness"
hypothesis: "Supplying explicit ontology context improves query accuracy uniformly across all five reasoning tiers on both Postgres and Neo4j."
falsification: "Any statistically significant accuracy drop (paired McNemar p < 0.05) in any reasoning tier under ontology grounding refutes uniform improvement."
verdict: "Mixed"
keyMetric: "Tier 2 +0.725 (p=4.74e-15) vs Tier 3 -0.225 (p=4.01e-05) on Postgres"
repoUrl: "https://github.com/tteon/auto-ontology-bench"
environment:
  machine: "Local benchmark harness (~/lab/auto-ontology-bench)"
  runtime: "Postgres + Neo4j dual-engine SQL/Cypher harness (Stage A + Stage B replay)"
  dataset: "5 reasoning tiers × 80 paired questions per engine condition (Tier 5 measures abstention)"
  repeats: "1,600 Stage A LLM+DB requests (400 per condition) + Stage B concurrency sweep (1..256)"
figures:
  - src: "/figures/auto-ontology-postgres-vs-neo4j.png"
    alt: "Paired grouped bar charts with 95% bootstrap confidence intervals comparing without-ontology vs with-ontology accuracy across Tier 1 to Tier 5 and Overall on Postgres and Neo4j."
    caption: "Figure 1. Paired Stage A accuracy across Tiers 1–5 (n=80 pairs/tier; 400 requests per condition) with 95% bootstrap CIs. Ontology injection produces massive Tier 2 gains (+0.725 Postgres, +0.525 Neo4j) but causes statistically significant Tier 3 regressions (-0.225 Postgres, -0.125 Neo4j)."
tags: ["auto-ontology", "neo4j", "postgres", "benchmark", "mcnemar"]
summary: "Paired McNemar evaluation over 1,600 requests showing massive Tier 2 accuracy gains alongside statistically significant Tier 3 regressions."
---

## 1. Motivation & System Bottleneck

When LLM query agents fail on domain databases, engineering teams typically respond by stuffing richer ontology schemas and constraints into the prompt. However, injecting static ontology context indiscriminately can either disambiguate schema linking or overload query synthesis on complex multi-constraint questions.

## 2. Hypothesis, Falsification Criteria & Setup

We evaluated four paired configurations—`neo-no-onto`, `neo-onto`, `pg-no-onto`, and `pg-onto`—over identical questions across **5 reasoning tiers** (`80` pairs per tier; `400` requests per condition; `1,600` requests total in Stage A):

- **Scoring**: Lenient result-set match against gold outputs for Tiers 1–4; expected abstention/declined classification for Tier 5.
- **Statistical Test**: Two-sided paired McNemar test on identical `(question, repeat)` pairs alongside 95% bootstrap confidence intervals (`[lo–hi]`).

## 3. Environment & Reproducibility Protocol

- **Stage A (End-to-End LLM + DB)**: Recorded e2e p50/p90 latency, prompt/completion/reasoning/cached tokens, DB server/wall latency, and fine-grained error taxonomies (`wrong result`, `empty result`, `syntax error`, `false rejection`).
- **Stage B (DB-Only Concurrency Replay)**: Isolated DB server and client latency at concurrency `1, 8, 32, 64, 128, 256` (`stageB-real` and warm-c1 checks) to decouple storage scaling from LLM latency.

## 4. Visual Evidence & Quantitative Results

### Stage A Accuracy Across Tiers (95% Bootstrap CI)

| Condition | Tier 1 | Tier 2 | Tier 3 | Tier 4 | Tier 5 | Overall (n=400) |
|---|---|---|---|---|---|---|
| `neo-no-onto` | 0.39 [0.28–0.50] | 0.07 [0.03–0.14] | 0.28 [0.19–0.38] | 0.16 [0.09–0.24] | 0.86 [0.79–0.94] | **0.35** [0.31–0.40] |
| `neo-onto` | 0.36 [0.26–0.47] | 0.60 [0.50–0.71] | 0.15 [0.07–0.24] | 0.12 [0.05–0.20] | 0.88 [0.80–0.95] | **0.42** [0.37–0.47] |
| `pg-no-onto` | 0.78 [0.68–0.86] | 0.17 [0.10–0.26] | 0.49 [0.38–0.60] | 0.26 [0.17–0.36] | 0.90 [0.82–0.96] | **0.52** [0.47–0.57] |
| `pg-onto` | 0.78 [0.68–0.86] | 0.90 [0.82–0.96] | 0.26 [0.16–0.36] | 0.15 [0.07–0.24] | 0.86 [0.79–0.94] | **0.59** [0.54–0.64] |

### Outcome & Median Latency Breakdown

| Condition | Correct (T1–4) | Empty Result | Syntax Error | e2e p50 (ms) | LLM Total p50 (ms) | DB Wall p50 (ms) | Prompt Tokens |
|---|---|---|---|---:|---:|---:|---:|
| `neo-no-onto` | 72 / 320 | 205 | 6 | 7,567 | 7,443 | 122.1 | 881 |
| `neo-onto` | 99 / 320 | 198 | 2 | 10,341 | 10,153 | 119.1 | 2,517 |
| `pg-no-onto` | 136 / 320 | 136 | 13 | 5,698 | 5,697 | 1.1 | 1,357 |
| `pg-onto` | 167 / 320 | 97 | 38 | 7,901 | 7,836 | 2.6 | 2,788 |

## 5. Mechanism Breakdown (Why Ontology Helped Tier 2 But Hurt Tier 3)

- **Tier 2 Disambiguation Surge (`+0.725` Postgres, `+0.525` Neo4j)**: Without ontology, schema linking collapses (`0.17` Postgres, `0.07` Neo4j) with high empty/wrong-result rates (`205` empty results on `neo-no-onto`, `136` on `pg-no-onto`). Adding ontology drops wrong results (`34 → 15` on Postgres, `26 → 11` on Neo4j) and empties (`136 → 97` on Postgres).
- **Tier 3 Over-Constrained Syntax Regression (`-0.225` Postgres, `-0.125` Neo4j)**: Prompt size roughly doubled (`1,357 → 2,788` prompt tokens on Postgres; `881 → 2,517` on Neo4j), shifting failure modes from empty answers into **SQL syntax errors (`13 → 38` on `pg-onto`)** and raising end-to-end median latency by `~2.2–2.8 s` (`LLM` dominates >98% of e2e latency).
- **Engine Gap**: `pg-onto` outperformed `neo-onto` overall (`0.59` vs `0.42`, Δ `-0.168`, `p=1.36e-11`), and in Stage B Postgres scaled up to `5,321.8 QPS` at concurrency 32 (`1.9 ms` server p50) whereas Neo4j plateaued at `1,355.0 QPS` at concurrency 256 (`679.0 ms` server p99).

## 6. Scope Limits & Next Experiment

- **Mixed Hypothesis Outcome**: Static all-or-nothing ontology injection improves aggregate accuracy (`+0.070` on both engines) only as a net average across opposing tier effects; it fails uniform monotonicity.
- **Next Hypothesis (`selective competency routing`)**: Inject only question-scoped minimal ontology subgraphs for schema-ambiguous queries (Tier 2 signature) while stripping non-essential axioms on complex analytical shapes (Tier 3–4) to recover accuracy without inflating syntax errors.
