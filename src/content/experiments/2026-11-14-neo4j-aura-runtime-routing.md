---
title: "Neo4j Aura Runtime Benchmark: Slotted vs Pipelined vs Parallel"
date: 2026-11-14
host: "Neo4j Aura"
hypothesis: "Routing heavy global 3-hop analytics and supernode fan-out queries to Pipelined/Parallel runtimes significantly lowers wall latency over Slotted, while point lookups remain network-RTT bound."
falsification: "If Parallel fails to outperform Slotted on global 3-hop traversals (W4) or produces inconsistent result digests across runtimes, runtime-aware routing is refuted."
verdict: "Supported"
keyMetric: "W4 analytics: 2,324.6 ms (Slotted) → 975.7 ms (Pipelined) → 565.4 ms (Parallel)"
repoUrl: "https://github.com/tteon/seocho"
environment:
  machine: "Neo4j Aura managed instance accessed via remote Bolt/TLS"
  runtime: "Cypher explicit runtime hints (slotted | pipelined | parallel) + PROFILE"
  dataset: "6 canonical graph workloads (W1 point lookup through W6 supernode fan-out)"
  repeats: "5 measured runs per (workload, runtime) cell · 90 runs total · digest-verified"
figures:
  - src: "/figures/aura-runtime-routing.png"
    alt: "Two-panel chart showing log-scale median client wall latency across W1-W6 workloads with a 100ms RTT floor callout and speedup factor relative to Slotted."
    caption: "Figure 1. Left: Median client wall time (ms, log scale; n=5 runs/cell) across Slotted, Pipelined, and Parallel runtimes, illustrating the ~100 ms Bolt RTT floor on W1/W2/W5 vs steep compute gains on W4. Right: Normalized speedup relative to Slotted, reaching 4.11× (Parallel) and 2.38× (Pipelined) on global 3-hop analytics."
tags: ["neo4j", "runtime", "slotted", "pipelined", "parallel"]
summary: "6-workload × 3-runtime comparison showing ~4.11× wall-time reduction on global 3-hop analytics, whereas 1-hop lookups hit a ~100 ms Bolt RTT floor."
---

## 1. Motivation & System Bottleneck

Graph agent middleware often dispatches heterogeneous Cypher traffic—single-entity lookups alongside deep multi-hop neighborhood aggregations—onto Neo4j's default execution runtime without differentiating compute vs network-bound shapes. Before building workload-aware routing inside Rust Bolt middleware, we needed direct empirical bounds on when Cypher runtime hints (`slotted`, `pipelined`, `parallel`) actually buy speed.

## 2. Hypothesis, Falsification Criteria & Setup

We executed 6 representative query shapes (`W1`–`W6`) under explicit `CYPHER runtime=slotted`, `pipelined`, and `parallel` hints on Neo4j Aura (`5` runs per combination), checking deterministic result-digest equality across every runtime.

- **Expected Separation**: Global CPU/traversal workloads (`W3`, `W4`, `W6`) should accelerate substantially under `pipelined`/`parallel`, while shallow lookups (`W1`, `W2`, `W5`) should flatten at remote Bolt network RTT (~100 ms).

## 3. Environment & Reproducibility Protocol

- **Measurement Boundary**: Client-side wall time includes remote Bolt/TLS round trip and `PROFILE` instrumentation overhead. Sub-few-millisecond variance (such as `100.50 ms` vs `103.98 ms`) is within network noise rather than storage engine divergence.
- **Correctness Check**: Every workload verified identical result digests (`PASS (1 result digest(s))`) across all three runtimes.

## 4. Visual Evidence & Quantitative Results

| Workload | Slotted (ms) | Pipelined (ms) | Parallel (ms) | Speedup (Par/Slot) | Digest Consistency |
|---|---:|---:|---:|---:|---|
| `W1_point_lookup` | 100.58 | 100.50 | 103.98 | 0.97× | PASS (1 digest) |
| `W2_local_3hop` | 103.41 | 104.78 | 106.68 | 0.97× | PASS (1 digest) |
| `W3_global_aggregation` | 139.09 | 137.26 | **118.93** | 1.17× | PASS (1 digest) |
| `W4_global_3hop_analytics` | 2,324.62 | 975.65 | **565.39** | **4.11×** | PASS (1 digest) |
| `W5_indexed_topk` | 100.97 | 101.40 | 105.85 | 0.95× | PASS (1 digest) |
| `W6_supernode_fanout` | 137.13 | 133.88 | **117.49** | 1.17× | PASS (1 digest) |

## 5. Mechanism Breakdown

- **Global Compute Saturation (`W4`)**: Removing row-by-row slotted volcano overhead yields a `2.38×` speedup in `pipelined` (`2,324.62 → 975.65 ms`) and `4.11×` in `parallel` (`→ 565.39 ms`).
- **Moderate Fan-out (`W3`, `W6`)**: Both global aggregation and supernode expansion gain `~17%` (`1.17×`) from `parallel` worker utilization once executor cost exceeds the `~100 ms` Bolt envelope.
- **RTT-Bound Ceiling (`W1`, `W2`, `W5`)**: Point lookups and indexed top-k finish server work well below the network RTT floor, meaning spawning `parallel` workers adds slight coordination overhead (`0.95–0.97×`) for zero net gain.

## 6. Scope Limits & Next Experiment

- **Operator-Level Telemetry**: Client wall time + `PROFILE` does not isolate storage `DB Hits` or `Page Cache Hits/Misses`; logical operators inside `plans/*.txt` must be compared directly for cache-efficiency claims.
- **Concurrency Contention (Untested Here)**: Single-stream median latency favors `parallel` on `W4`, but under high concurrent agent load, `parallel` worker contention can reduce aggregate QPS. Next step: measure multi-client admission control and queue routing in the Rust Bolt proxy.
