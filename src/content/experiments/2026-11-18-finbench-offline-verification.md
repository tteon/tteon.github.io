---
title: "Re-verifying FinBench & GARE2E Evidence Across 713 Raw Artifacts"
date: 2026-11-18
host: "Local Offline Replay"
hypothesis: "All published FinBench validation, probe, and DB-replay summary figures can be deterministically reproduced from preserved SHA-256 raw artifacts."
falsification: "Any contract test failure across the 4 suites, any SHA-256 mismatch across preserved run bundles, or any analyzer summary discrepancy refutes deterministic reproducibility."
verdict: "Mixed"
keyMetric: "56/56 contract tests pass · 713/713 SHA-256 files match · 4/4 JSON analyzers match"
beadsId: "sr-9jb6"
repoUrl: "https://github.com/tteon/gare2e"
environment:
  machine: "Local offline audit workspace (~/lab/seocho-rust, no Vast.ai live GPU access)"
  runtime: "Python unittest suites + 4 deterministic summary analyzer scripts"
  dataset: "6 preserved run bundles (validation r1/r2, probes r1, db-replay r1/r2, ablation r1)"
  repeats: "56 contract/unit checks · 713 manifest files · 17 source & 18 chart hashes"
  artifactSha256: "713/713 files matched manifest SHA-256; permissions 0700/0600 (0 mismatches)"
figures:
  - src: "/figures/finbench-verification-audit.png"
    alt: "Two-panel bar chart showing 100% pass rates across offline FinBench suites and raw file counts per run bundle alongside historical live run scope limits."
    caption: "Figure 1. Left: Offline contract test pass rates (56/56 total) and SHA-256 integrity checks across exported charts (18/18), analyzers (4/4), and preserved raw artifacts (713/713). Right: Manifest file breakdown across the 6 preserved run directories, explicitly bounding un-rerun historical live inference observations (8/13 baseline pass, 180 general replay runs, 30 query pairs)."
tags: ["finbench", "reproducibility", "sha256", "audit"]
summary: "Offline integrity audit confirming 713 preserved run files and 4 analyzer outputs, while explicitly bounding live-inference generalization claims."
---

## 1. Motivation & System Bottleneck

Experimental claims in graph-agentic RAG pipelines decay rapidly once temporary cloud instances are torn down. Without cryptographic integrity checks and deterministic analyzer replay, downstream write-ups risk drifting away from raw execution traces—or conflating offline bundle consistency with live statistical generalization.

## 2. Hypothesis, Falsification Criteria & Setup

This audit tested whether every published validation, interface probe, and DB-replay table in the FinBench / GARE2E package (`sr-9jb6`) reproduces identically from preserved local bundles without touching external cloud state:

- **Pre-registered test suites**: `vast_finbench_validation`, `vast_finbench_probes`, `vast_finbench_db_replay`, and `test_evidence.py` (56 tests total).
- **Cryptographic verification**: Verify file paths, byte sizes, SHA-256 manifests, and permissions (`0700` dirs / `0600` files) across all 6 preserved run bundles, plus regenerate all 4 summary JSONs in isolated `/tmp` output paths.

## 3. Environment & Reproducibility Protocol

- **Network & Remote State**: Strictly offline read-only audit; no Vast.ai GPU inference or GitHub remote state was modified.
- **Historical Live Scope (Distinguished from Offline Replay)**: Earlier live Vast.ai runs remain scoped to 13 baseline Cypher runs (`8/13` passed original grading, `7/13` separate answer-contract checks), 3 probe questions × 7 conditions (`1` run per condition), `180` general DB replay runs, and `30` query pairs (`60` runs).
- **Replay Commands**:

```bash
python3 -m unittest discover -s experiments/vast_finbench_validation -p 'test_*.py' -v
python3 -m unittest discover -s experiments/vast_finbench_probes -p 'test_*.py' -v
python3 -m unittest discover -s experiments/vast_finbench_db_replay -p 'test_*.py' -v
python3 -m unittest discover -s docs/blog/text2cypher-bottlenecks -p 'test_*.py' -v
python3 docs/blog/text2cypher-bottlenecks/verify_package.py
```

## 4. Visual Evidence & Quantitative Results

| Target | Suite / Check | Result |
|---|---|---|
| Full case validation | `vast_finbench_validation` | 17 / 17 pass |
| Interface diagnostic probes | `vast_finbench_probes` | 12 / 12 pass |
| DB replay & query comparison | `vast_finbench_db_replay` | 19 / 19 pass |
| Blog evidence & chart hashes | `test_evidence.py` | 8 / 8 pass (17 sources, 18 charts matched) |
| Preserved raw bundles | SHA-256 manifest verification | 6 folders · 713 / 713 files match |
| Analyzer regeneration | 4 analyzer scripts vs `summary.json` | 4 / 4 exact JSON match |

## 5. Mechanism Breakdown

- **Offline Determinism Holds**: Re-running `analyze_run.py` (`validation-r2`), `analyze_probes.py` (`probes-r1`), `analyze_replay.py` (`db-replay-r2`), and `analyze_ablation.py` (`db-ablation-r1`) into `/tmp` yielded 100% JSON identity against stored summaries, confirming that zero post-hoc editing occurred after raw capture.
- **Why Verdict Is Mixed**: Deterministically replaying preserved archives proves *capture-to-publication integrity*, NOT end-to-end live generalization or root-cause latency attribution. Separating those two epistemic layers prevented over-claiming live pass rates (`8/13` / `7/13`) as universal accuracy guarantees.

## 6. Scope Limits & Next Experiment

- **Mock Paths & Offline Boundary**: Unit suites include mocked paths (`test_*.py`) and do not re-exercise live vLLM or Neo4j instances.
- **Unresolved Bottleneck Attribution**: Separating page-cache misses from CPU, I/O, or lock stalls requires isolated hardware-counter profiling runs on dedicated hosts.
- **Repository Provenance**: As confirmed against `tteon/gare2e@07d7453c`, `gare2e` branched cleanly from `tteon/seocho` history (`5422522` parent `c3a1871`), explaining why SEOCHO metadata remains in its root manifest.
