---
title: "Re-verifying FinBench & GARE2E Evidence Across 713 Raw Artifacts"
date: 2026-11-18
host: "Local Offline Replay"
hypothesis: "All published FinBench validation, probe, and DB-replay figures can be deterministically reproduced from preserved SHA-256 raw artifacts."
verdict: "Mixed"
keyMetric: "56/56 contract tests pass · 713/713 SHA-256 files match · 4/4 JSON analyzers match"
repoUrl: "https://github.com/tteon/gare2e"
tags: ["finbench", "reproducibility", "sha256", "audit"]
summary: "Offline integrity audit confirming 713 preserved run files and 4 analyzer outputs, while explicitly bounding live-inference generalization claims."
---

## Experiment Setup

This offline verification pass audited four FinBench / GARE2E validation suites (`vast_finbench_validation`, `vast_finbench_probes`, `vast_finbench_db_replay`, and `test_evidence.py`) against 6 preserved raw run bundles without re-running live Vast.ai GPU inference.

## Verification Results

| Target | Suite / Check | Result |
|---|---|---|
| Full case validation | `vast_finbench_validation` | 17 / 17 pass |
| Interface diagnostic probes | `vast_finbench_probes` | 12 / 12 pass |
| DB replay & query comparison | `vast_finbench_db_replay` | 19 / 19 pass |
| Blog evidence & chart hashes | `test_evidence.py` | 8 / 8 pass (17 sources, 18 charts matched) |
| Preserved raw bundles | SHA-256 manifest verification | 6 folders · 713 / 713 files match |
| Analyzer regeneration | 4 analyzer scripts vs `summary.json` | 4 / 4 exact JSON match |

## Historical Live Observations (Scoped)

- Baseline Cypher execution: 13 / 13 ran, 8 / 13 passed original grading, 7 / 13 matched separate answer-contract checks.
- Interface comparison covered 7 conditions over 3 questions (1 trial per condition).
- General DB replay covered 180 runs; two-query representation comparison covered 30 pairs (60 runs).

## Why Mixed (Explicit Scope Boundaries)

- **What is Supported**: Preserved raw bundles and deterministic analyzer outputs are 100% intact (`713/713` files, `56/56` tests).
- **What Remains Unproven**: Checksum integrity proves non-tampering after capture, not causal generalization across unseen questions or multi-tenant concurrency. Page-cache miss attribution vs CPU/I/O/lock stalls remains unconfirmed until isolated profiling runs complete.
