---
title: "Per-Agent BDI Mental State Ontology + Beads Coordination Synergy"
date: 2026-11-24
host: "Local Sandbox (Codex + Claude + Dolt Beads)"
hypothesis: "Modeling per-agent Beliefs, Desires, Intentions, and WorldState provenance as named RDF graphs coupled to Beads (bd) catches ungrounded/stale mutations via SPARQL and converts cross-agent disagreement into actionable issue blockers at <2% LLM latency overhead."
falsification: "If SPARQL gates miss injected ungrounded/expired/drifted beliefs, fail to block conflicting live Codex/Claude proposals in Beads, or double-claiming bypasses arbitration, the BDI+Beads synergy design is refuted."
verdict: "Supported"
keyMetric: "12/12 gate accuracy (38.6 ms median) · 2 live blocks + 1 clean claim · 191.6 ms RDF/SPARQL vs 26.0 s LLMs"
repoUrl: "https://github.com/tteon/yitaewiki"
environment:
  machine: "Local Ubuntu workstation running Paseo daemon, Dolt shared server, Codex CLI, and Claude CLI"
  runtime: "Python 3.14 + rdflib 7.6.0 + Beads (bd) Dolt backend + live codex exec & claude -p"
  dataset: "Trial 1: 12 structured assertions (4 valid, 8 adversarial); Trial 2: 3 live multi-agent Beads scenarios"
  repeats: "Single controlled end-to-end suite (3 live LLM invocations: 6.7 s Codex, 9.7 s & 9.6 s Claude)"
figures:
  - src: "/figures/bdi-beads-synergy.png"
    alt: "Two-panel chart comparing adversarial guardrail yield (12/12 BDI+SPARQL vs 0/8 plain bd CLI) and wall-clock latency across RDF, SPARQL, bd CLI, and live Codex/Claude invocations."
    caption: "Figure 1. Left: Guardrail acceptance/block rates across 12 valid and adversarial agent assertions (`38.55 ms` median gate time). Right: Component wall-clock latency on log scale showing total RDF+SPARQL reasoning (`191.6 ms`) accounts for `0.74%` of live LLM time (`26,033 ms`)."
tags: ["multi-agent", "bdi", "ontology", "sparql", "beads", "codex", "claude"]
summary: "Controlled test combining per-agent FOSSR/DOLCE-aligned BDI named graphs (`codex`, `claude`, `antigravity`) with Beads (`bd`) task state, demonstrating 12/12 gate accuracy and automated conflict blocking with <1% overhead."
---

## 1. Motivation & System Bottleneck

Multi-agent harnesses (`codex`, `claude`, `antigravity`) sharing a single task queue (`bd`) easily fail in three subtle ways: an agent overwrites issue state from stale file hashes, confuses an infrastructure timeout (`exit_code=1`) with hypothesis refutation, or duplicates work because no formal record separates **what each agent believes (`WorldState` provenance)** from **which issue an agent intends to claim**.

## 2. Hypothesis, Falsification Criteria & Setup

We implemented per-agent BDI named graphs (`urn:yitaewiki:world`, `urn:yitaewiki:agent:codex`, `urn:yitaewiki:agent:claude`, `urn:yitaewiki:agent:antigravity`) backed by `rdflib` 7.6.0 and wired them into `bd` Dolt issue state via a compact 9-class T2B2T bridge (`bdi_ontology.py`):

- **Trial 1 (12-Case Integrity Gate)**: 4 valid grounded assertions vs 8 injected flaws (2 missing justifications, 2 phantom `WorldState` refs, 2 expired `TimeInterval` bounds, 2 drifted `WorldState` SHA-256 checksums).
- **Trial 2 (Live Codex + Claude + Antigravity Coordination)**: Isolated sandbox repo (`synexp-th0`, 3 tasks: failed `ubuntu` SSH timeout `synexp-th0.1`, contested Postgres full-ontology rollout `synexp-th0.2`, clean Aura W4 `Parallel` routing `synexp-th0.3`).
- **Trial 3 (Latency Accounting)**: Direct wall-clock timing of `ingest`, `record_agent_cycle`, cross-graph SPARQL queries, `bd` CLI commits, and live LLM calls.

## 3. Environment & Reproducibility Protocol

- Isolated temporary Git repo initialized with `bd init -p synexp --shared-server` to avoid mutating production `yw-*` epics.
- Real CLI invocations (`codex exec --ephemeral -s read-only` and `claude -p --permission-mode plan`) constrained by identical JSON schemas emitting `belief_label`, `justification`, `polarity`, `confidence`, `desire_label`, `intention_label`, and `recommended_beads_status`.
- Reproducible script and raw telemetry stored at `~/lab/bdi-beads-synergy-exp/run_synergy_eval.py` and `results/run.json`.

## 4. Visual Evidence & Quantitative Results

### Guardrail Fidelity & Live Multi-Agent Outcomes

| Scenario / Trial | BDI + SPARQL + `bd` Result | Final Beads State |
|---|---|---|
| Trial 1: 12-case integrity gate | **4/4** valid accepted, **8/8** adversarial blocked (`100%` vs `0/8` plain `bd`) | No corrupted triples persisted (`strict=True`) |
| `synexp-th0.1` (`ubuntu` SSH timeout trap) | Live Codex (`6.69s`, conf `1.0`) & Claude (`9.73s`, conf `0.96`) both refuted false refutation claim | `status: blocked` (`[BDI-CONSENSUS-BLOCK agents=claude+codex]`) |
| `synexp-th0.2` (Tier 3 `-0.225` vs `+0.070` overall) | Codex (`support`, `0.72`) vs Claude (`9.62s`, `refute`, `0.93`) caught by `Q_CONFLICT` | `status: blocked` (`[BDI-CONFLICT]`) |
| `synexp-th0.3` (Aura W4 `Parallel` `4.11×`) | Single clean Antigravity execution plan; subsequent Codex `--claim` rejected (`true`) | `status: in_progress`, `assignee: bdi:antigravity` |

### Measured Wall-Clock Breakdown

| Component | Measured Wall Time (ms) | Share / Note |
|---|---:|---|
| `ingest_world_and_beads` (`world.ttl`) | 42.39 | Projects Beads + host registry + hashes |
| `record_agent_cycle` (Codex / Claude) | 27.52 / 38.23 | Median Trial 1 gate check: `38.55 ms` (max `78.33 ms`) |
| `detect_cross_agent_coordination` | 83.43 | `V1–V5` + `Q_CONFLICT` + `Q_DOUBLE_CLAIM` SPARQL |
| `sync_bdi_to_beads_and_obsidian` | 775.61 | Includes 3× `bd update` Dolt subprocess calls |
| Live LLM total (Codex + 2× Claude) | 26,033.1 | RDF+SPARQL (`191.6 ms`) adds `0.74%` of LLM wall time |

## 5. Mechanism Breakdown (Bugs Caught Only by Running Live)

1. **WorldState Preservation Across Syncs**: During the first prototype run, calling `ingest_world_and_beads()` inside `sync` regenerated `world.ttl` from scratch and accidentally dropped external telemetry `WorldState` triples. Gate `V2_belief_ungrounded_worldstate` immediately flagged all 5 downstream beliefs (`FAIL`) and halted `bd` mutations before corrupting task state—leading us to preserve non-prefix custom `WorldState` nodes during incremental ingests.
2. **Separating Audit Target from Execution Ownership**: Initially mapping `target_issue_id` unconditionally into `Plan -> hasComponent -> Task` caused reviewer (`claude`) and critic (`codex`) audits on `synexp-th0.1` to look like duplicate task claims (`double_claims_count = 2`). Splitting `yw:targetIssue` (epistemic assessment target) from `plan_tasks` (execution claim) allowed peer consensus blocking (`claude+codex` both blocking `synexp-th0.1`) while preserving strict `Q_DOUBLE_CLAIM` enforcement on execution plans (`synexp-th0.3`).

## 6. Scope Limits & Next Experiment

- **Shared `claimKey` Normalization Dependency**: `Q_CONFLICT` matches opposing polarities only when agents reference the same normalized `WorldState` URI and `claimKey`; free-text synonyms under different keys will not automatically trigger `Q_CONFLICT`.
- **Scaling Horizon**: Individual Turtle stores measured `70–123 lines` (`antigravity.ttl` `70`, `claude.ttl` `117`, `codex.ttl` `123`). Over months of continuous cron runs, periodic archival rotation by validity interval will be required to keep in-memory `rdflib` queries under 100 ms.
- **Next Step**: Evaluate `V5_stale_world_hash` auto-invalidation during multi-day Paseo `yitaewiki-morning` runs when edited vault notes drift behind prior agent reviews.
