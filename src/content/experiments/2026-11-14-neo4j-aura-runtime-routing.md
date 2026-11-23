---
title: "Neo4j Aura Runtime Benchmark: Slotted vs Pipelined vs Parallel"
date: 2026-11-14
host: "Neo4j Aura"
hypothesis: "Routing heavy 3-hop analytics and supernode fan-out queries to Pipelined/Parallel runtimes significantly lowers wall latency over Slotted, while point lookups remain network-RTT bound."
verdict: "Supported"
keyMetric: "W4 analytics: 2,324.6 ms (Slotted) → 975.7 ms (Pipelined) → 565.4 ms (Parallel)"
tags: ["neo4j", "runtime", "slotted", "pipelined", "parallel"]
summary: "6-workload × 3-runtime comparison showing ~4.1× wall-time reduction on global 3-hop analytics, whereas 1-hop lookups hit a ~100 ms Bolt RTT floor."
---

## Experiment Setup

Six synthetic graph workloads (`W1` through `W6`, 5 runs each) were executed against Neo4j Aura under explicit `slotted`, `pipelined`, and `parallel` Cypher runtime hints, checking result-digest consistency across every runtime.

## Median Client Wall Time (ms)

| Workload | Slotted | Pipelined | Parallel | Consistency |
|---|---:|---:|---:|---|
| `W1_point_lookup` | 100.58 | 100.50 | 103.98 | PASS (1 digest) |
| `W2_local_3hop` | 103.41 | 104.78 | 106.68 | PASS (1 digest) |
| `W3_global_aggregation` | 139.09 | 137.26 | **118.93** | PASS (1 digest) |
| `W4_global_3hop_analytics` | 2,324.62 | 975.65 | **565.39** | PASS (1 digest) |
| `W5_indexed_topk` | 100.97 | 101.40 | 105.85 | PASS (1 digest) |
| `W6_supernode_fanout` | 137.13 | 133.88 | **117.49** | PASS (1 digest) |

## Reasoning & Scope Limits

- **Supported**: For compute-heavy global traversals (`W4_global_3hop_analytics`), switching from `slotted` (`2,324.62 ms`) to `pipelined` (`975.65 ms`) and `parallel` (`565.39 ms`) cut median client wall time by **2.38×** and **4.11×** respectively with identical result digests.
- **Scope Limit**: Client-side wall time includes Bolt/network round trips (~100 ms floor on Aura) and `PROFILE` overhead, so sub-few-millisecond differences on `W1`, `W2`, and `W5` are noise. Operator-level `DB Hits` and `Page Cache Hits/Misses` in query plans must be inspected separately for storage-level cost, and concurrent multi-agent load remains to be tested since `parallel` can trade away multi-query throughput.
