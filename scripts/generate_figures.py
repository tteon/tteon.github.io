#!/usr/bin/env python3
"""Generate publication-grade figures (figures4papers style) for tteon.github.io experiment posts.

All numbers are transcribed verbatim from verified local lab reports, measurements.csv, and records.jsonl.
"""
from __future__ import annotations

import sys
from pathlib import Path

SKILL_SCRIPTS = Path.home() / ".agents/skills/experiment-storytelling/scripts"
sys.path.insert(0, str(SKILL_SCRIPTS))

import numpy as np

from pubfig import (
    PALETTE,
    FigureStyle,
    annotate_bars,
    apply_publication_style,
    create_subplots,
    finalize_figure,
    make_grouped_bar,
    make_trend,
)

OUT_DIR = Path(__file__).resolve().parent.parent / "public" / "figures"


def _asymmetric_err(means: list[float], lowers: list[float], uppers: list[float]) -> np.ndarray:
    m = np.asarray(means, dtype=float)
    lo = np.clip(m - np.asarray(lowers, dtype=float), 0.0, None)
    hi = np.clip(np.asarray(uppers, dtype=float) - m, 0.0, None)
    return np.vstack([lo, hi])


def plot_auto_ontology() -> list[Path]:
    """Paired Stage A accuracy across Tiers 1-5 on Postgres and Neo4j (n=80/tier, 1600 total)."""
    apply_publication_style(FigureStyle(font_size=14, axes_linewidth=2.0))
    fig, axes = create_subplots(1, 2, figsize=(15.5, 5.8))

    tiers = ["Tier 1\nLookup", "Tier 2\nComputed", "Tier 3\nMulti-Cond", "Tier 4\nRecursive", "Tier 5\nAbstain", "Overall\n(n=400)"]

    pg_no = [0.78, 0.17, 0.49, 0.26, 0.90, 0.52]
    pg_no_err = _asymmetric_err(pg_no, [0.68, 0.10, 0.38, 0.17, 0.82, 0.47], [0.86, 0.26, 0.60, 0.36, 0.96, 0.57])
    pg_on = [0.78, 0.90, 0.26, 0.15, 0.86, 0.59]
    pg_on_err = _asymmetric_err(pg_on, [0.68, 0.82, 0.16, 0.07, 0.79, 0.54], [0.86, 0.96, 0.36, 0.24, 0.94, 0.64])

    make_grouped_bar(
        axes[0],
        tiers,
        [pg_no, pg_on],
        ["Without Ontology", "With Ontology"],
        ylabel="Accuracy (95% Bootstrap CI)",
        colors=[PALETTE["red_2"], PALETTE["blue_main"]],
        hatches=["///", ""],
        yerr=[pg_no_err, pg_on_err],
        annotate=False,
    )
    axes[0].set_title("Postgres (pg-no-onto vs pg-onto)", pad=12)
    axes[0].set_ylim(0.0, 1.14)
    axes[0].annotate(
        "Tier 2: +0.725\n(p = 4.74e-15)",
        xy=(1.18, 0.96),
        xytext=(1.62, 1.02),
        fontsize=10.5,
        fontweight="bold",
        color=PALETTE["blue_main"],
        arrowprops={"arrowstyle": "->", "color": PALETTE["blue_main"], "lw": 1.5},
    )
    axes[0].annotate(
        "Tier 3: -0.225\n(p = 4.01e-05)",
        xy=(2.18, 0.37),
        xytext=(2.55, 0.58),
        fontsize=10.5,
        fontweight="bold",
        color=PALETTE["red_strong"],
        arrowprops={"arrowstyle": "->", "color": PALETTE["red_strong"], "lw": 1.5},
    )

    neo_no = [0.39, 0.07, 0.28, 0.16, 0.86, 0.35]
    neo_no_err = _asymmetric_err(neo_no, [0.28, 0.03, 0.19, 0.09, 0.79, 0.31], [0.50, 0.14, 0.38, 0.24, 0.94, 0.40])
    neo_on = [0.36, 0.60, 0.15, 0.12, 0.88, 0.42]
    neo_on_err = _asymmetric_err(neo_on, [0.26, 0.50, 0.07, 0.05, 0.80, 0.37], [0.47, 0.71, 0.24, 0.20, 0.95, 0.47])

    make_grouped_bar(
        axes[1],
        tiers,
        [neo_no, neo_on],
        ["Without Ontology", "With Ontology"],
        ylabel="Accuracy (95% Bootstrap CI)",
        colors=[PALETTE["red_2"], PALETTE["blue_main"]],
        hatches=["///", ""],
        yerr=[neo_no_err, neo_on_err],
        annotate=False,
    )
    axes[1].set_title("Neo4j (neo-no-onto vs neo-onto)", pad=12)
    axes[1].set_ylim(0.0, 1.14)
    axes[1].annotate(
        "Tier 2: +0.525\n(p = 4.46e-10)",
        xy=(1.18, 0.71),
        xytext=(1.55, 0.88),
        fontsize=10.5,
        fontweight="bold",
        color=PALETTE["blue_main"],
        arrowprops={"arrowstyle": "->", "color": PALETTE["blue_main"], "lw": 1.5},
    )
    axes[1].annotate(
        "Tier 3: -0.125\n(p = 0.0129)",
        xy=(2.18, 0.24),
        xytext=(2.55, 0.46),
        fontsize=10.5,
        fontweight="bold",
        color=PALETTE["red_strong"],
        arrowprops={"arrowstyle": "->", "color": PALETTE["red_strong"], "lw": 1.5},
    )

    handles, labels = axes[0].get_legend_handles_labels()
    fig.legend(handles, labels, loc="upper center", bbox_to_anchor=(0.5, 1.03), ncol=2, frameon=False, fontsize=14)
    return finalize_figure(fig, OUT_DIR / "auto-ontology-postgres-vs-neo4j.png", dpi=300, tight_pad=2.2)


def plot_auto_ontology_failures_and_stage_b() -> list[Path]:
    """Per-tier Postgres failure taxonomy (n=80/tier from records.jsonl) + Stage B QPS scaling."""
    apply_publication_style(FigureStyle(font_size=13.5, axes_linewidth=2.0))
    fig, axes = create_subplots(1, 2, figsize=(15.5, 5.6))

    # Panel A: Exact per-tier failure taxonomy (T1..T4, n=80/tier) from test-noonto & test-onto records.jsonl
    labels_x = ["T1\nno", "T1\nonto", "T2\nno", "T2\nonto", "T3\nno", "T3\nonto", "T4\nno", "T4\nonto"]
    correct = np.array([62, 62, 14, 72, 39, 21, 21, 12])
    empty = np.array([13, 15, 36, 6, 41, 50, 46, 26])
    wrong = np.array([5, 3, 29, 1, 0, 8, 1, 3])  # includes 1 false_rej in T2 no-onto
    err = np.array([0, 0, 1, 1, 0, 1, 12, 39])   # syntax + exec errors

    x = np.array([0, 0.8, 2.2, 3.0, 4.4, 5.2, 6.6, 7.4])
    w = 0.68
    axes[0].bar(x, correct, width=w, color=PALETTE["blue_main"], edgecolor="black", linewidth=1.4, label="Correct")
    axes[0].bar(x, empty, bottom=correct, width=w, color=PALETTE["neutral"], edgecolor="black", linewidth=1.4, label="Empty Result")
    axes[0].bar(x, wrong, bottom=correct + empty, width=w, color=PALETTE["highlight"], edgecolor="black", linewidth=1.4, label="Wrong / False Rej")
    axes[0].bar(x, err, bottom=correct + empty + wrong, width=w, color=PALETTE["red_strong"], edgecolor="black", linewidth=1.4, label="Syntax / Exec Error")

    axes[0].set_xticks(x)
    axes[0].set_xticklabels(labels_x, fontsize=10.5)
    axes[0].set_ylabel("Requests per Tier (n = 80)")
    axes[0].set_ylim(0, 108)
    axes[0].set_yticks([0, 20, 40, 60, 80])
    axes[0].yaxis.grid(True, linestyle="--", alpha=0.25, zorder=0)
    axes[0].set_title("Postgres Failure Shift by Tier (records.jsonl)", pad=12)
    axes[0].legend(loc="upper center", bbox_to_anchor=(0.5, 1.01), ncol=2, fontsize=10, frameon=False)
    axes[0].text(2.6, 82.0, "T2 won:\n14→72", ha="center", va="bottom", fontsize=9.2, fontweight="bold", color=PALETTE["blue_main"])
    axes[0].text(4.8, 82.0, "T3 empty:\n41→50 (syn=1)", ha="center", va="bottom", fontsize=9.2, fontweight="bold", color="#52525B")
    axes[0].text(7.0, 82.0, "T4 syntax:\n12→39", ha="center", va="bottom", fontsize=9.2, fontweight="bold", color=PALETTE["red_strong"])

    # Panel B: Stage B DB-only replay QPS scaling (REPORT.md lines 67-78)
    concs = [1, 8, 32, 64, 128, 256]
    pos = np.arange(len(concs))
    pg_qps = [1210.1, 4872.8, 5321.8, 5244.8, 4991.1, 4764.1]
    neo_qps = [8.8, 97.5, 414.2, 837.7, 1291.1, 1355.0]
    make_trend(
        axes[1],
        pos,
        [pg_qps, neo_qps],
        ["Postgres (stageB-real QPS)", "Neo4j (stageB-real QPS)"],
        colors=[PALETTE["blue_main"], PALETTE["red_strong"]],
        ylabel="Queries per Second (QPS)",
        xlabel="Client Concurrency",
        show_shadow=False,
    )
    axes[1].set_xticks(pos)
    axes[1].set_xticklabels([str(c) for c in concs])
    axes[1].set_ylim(0, 6100)
    axes[1].legend(loc="center right", fontsize=11, frameon=False)
    axes[1].set_title("Stage B DB-Only Throughput Ceiling", pad=12)
    axes[1].annotate("5,321.8 QPS\n(1.9 ms p50)", xy=(2, 5321.8), xytext=(2.4, 5450), fontsize=10, fontweight="bold", color=PALETTE["blue_main"])
    axes[1].annotate("1,355.0 QPS\n(679 ms p99)", xy=(5, 1355.0), xytext=(3.1, 1850), fontsize=10, fontweight="bold", color=PALETTE["red_strong"], arrowprops={"arrowstyle": "->", "color": PALETTE["red_strong"], "lw": 1.3})

    return finalize_figure(fig, OUT_DIR / "auto-ontology-failure-modes.png", dpi=300, tight_pad=2.1)


def plot_aura_runtime() -> list[Path]:
    """Neo4j Aura 6-workload runtime latency (log ms with exact n=5 min-max spread) & Speedup."""
    apply_publication_style(FigureStyle(font_size=14, axes_linewidth=2.0))
    fig, axes = create_subplots(1, 2, figsize=(16.0, 5.8))

    workloads = ["W1\nLookup", "W2\nLocal 3-hop", "W3\nGlobal Agg", "W4\nGlobal 3-hop", "W5\nTop-k", "W6\nSupernode"]
    slotted = [100.58, 103.41, 139.09, 2324.62, 100.97, 137.13]
    pipelined = [100.50, 104.78, 137.26, 975.65, 101.40, 133.88]
    parallel = [103.98, 106.68, 118.93, 565.39, 105.85, 117.49]

    # Exact n=5 min/max asymmetric spread from measurements.csv
    s_err = _asymmetric_err(slotted, [100.2, 102.1, 138.1, 2206.9, 99.8, 135.6], [102.0, 104.8, 142.2, 2405.7, 101.2, 139.7])
    p_err = _asymmetric_err(pipelined, [100.0, 103.5, 124.7, 950.5, 100.0, 124.2], [101.2, 106.6, 141.9, 1177.8, 102.4, 137.4])
    r_err = _asymmetric_err(parallel, [101.2, 104.4, 112.0, 374.7, 104.4, 114.8], [105.8, 107.7, 127.6, 710.7, 111.8, 122.5])

    make_grouped_bar(
        axes[0],
        workloads,
        [slotted, pipelined, parallel],
        ["Slotted", "Pipelined", "Parallel"],
        ylabel="Median Client Wall Time (ms, log scale)",
        colors=[PALETTE["red_strong"], PALETTE["green_2"], PALETTE["blue_main"]],
        hatches=["///", "", ""],
        yerr=[s_err, p_err, r_err],
        annotate=False,
    )
    axes[0].set_yscale("log")
    axes[0].set_ylim(60, 5200)
    axes[0].axhline(100.0, color="#3F3F46", linestyle=":", linewidth=1.8, zorder=2)
    axes[0].annotate(
        "~100 ms Bolt TLS RTT floor\n(W1, W2, W5 network-bound)",
        xy=(0.5, 108),
        xytext=(0.04, 330),
        fontsize=10.5,
        color="#27272A",
        bbox={"boxstyle": "round,pad=0.35", "facecolor": "#F4F4F5", "edgecolor": "#A1A1AA", "linewidth": 1.0},
        arrowprops={"arrowstyle": "->", "color": "#52525B", "lw": 1.2},
    )
    axes[0].annotate(
        "2,325 → 565 ms\n(range 375–711 ms)",
        xy=(3.24, 710.7),
        xytext=(3.4, 2100),
        fontsize=10.5,
        fontweight="bold",
        color=PALETTE["blue_main"],
        arrowprops={"arrowstyle": "->", "color": PALETTE["blue_main"], "lw": 1.5},
    )
    axes[0].set_title("Client Wall Latency (Median & Min–Max Range, n=5)", pad=12)

    speedup_pipe = [s / p for s, p in zip(slotted, pipelined)]
    speedup_par = [s / p for s, p in zip(slotted, parallel)]
    bars = make_grouped_bar(
        axes[1],
        workloads,
        [speedup_pipe, speedup_par],
        ["Pipelined vs Slotted", "Parallel vs Slotted"],
        ylabel="Speedup vs Slotted (×)",
        colors=[PALETTE["green_3"], PALETTE["blue_main"]],
        hatches=["..", ""],
        annotate=False,
    )
    axes[1].axhline(1.0, color=PALETTE["red_strong"], linestyle="--", linewidth=1.8, zorder=2, label="Slotted baseline (1.0×)")
    axes[1].set_ylim(0.5, 4.8)
    annotate_bars(axes[1], bars, fmt="{:.2f}×", fontsize=10.5, padding=4)
    axes[1].text(2.83, speedup_pipe[3] + 0.10, f"{speedup_pipe[3]:.2f}×", ha="center", va="bottom", fontsize=10.5, color="#18181b")
    axes[1].legend(loc="upper left", fontsize=11, frameon=False)
    axes[1].set_title("Speedup Factor Relative to Slotted", pad=12)

    handles0, labels0 = axes[0].get_legend_handles_labels()
    fig.legend(handles0, labels0, loc="upper center", bbox_to_anchor=(0.5, 1.03), ncol=3, frameon=False, fontsize=14)
    return finalize_figure(fig, OUT_DIR / "aura-runtime-routing.png", dpi=300, tight_pad=2.2)


def plot_finbench_audit() -> list[Path]:
    """FinBench offline replay verification: 713 preserved files + historical live-run boundaries."""
    apply_publication_style(FigureStyle(font_size=13.5, axes_linewidth=2.0))
    fig, axes = create_subplots(1, 2, figsize=(15.5, 5.2))

    bundles = ["val-r1", "val-r2", "probes-r1", "replay-r1", "replay-r2", "ablation-r1"]
    file_counts = [24, 345, 212, 31, 51, 50]
    b_bars = axes[0].bar(
        np.arange(len(bundles)),
        file_counts,
        width=0.58,
        color=[PALETTE["blue_main"]] * 3 + [PALETTE["teal"]] * 3,
        edgecolor="black",
        linewidth=1.6,
        zorder=3,
    )
    axes[0].set_xticks(np.arange(len(bundles)))
    axes[0].set_xticklabels(bundles, fontsize=11)
    axes[0].set_ylabel("SHA-256 Verified Files")
    axes[0].set_ylim(0, 405)
    axes[0].yaxis.grid(True, linestyle="--", alpha=0.25, zorder=0)
    axes[0].set_title("Preserved Raw Artifacts Verified (713 / 713 Match)", pad=12)
    annotate_bars(axes[0], b_bars, fmt="{:.0f}", fontsize=11)
    axes[0].text(
        0.52,
        0.93,
        "Deterministic Offline Re-run:\n• 56 / 56 contract tests pass\n• 4 / 4 analyzers match summary.json\n• 17 source & 18 chart hashes match",
        transform=axes[0].transAxes,
        fontsize=10,
        verticalalignment="top",
        bbox={"boxstyle": "round,pad=0.45", "facecolor": "#EFF6FF", "edgecolor": PALETTE["blue_main"], "linewidth": 1.2},
        color="#18181B",
    )

    live_labels = ["Cypher\nExecuted\n(n=13)", "Original\nGrading\n(n=13)", "Strict Answer\nContract\n(n=13)"]
    live_vals = [13, 8, 7]
    l_bars = axes[1].bar(
        np.arange(len(live_labels)),
        live_vals,
        width=0.48,
        color=[PALETTE["neutral"], PALETTE["green_3"], PALETTE["red_2"]],
        edgecolor="black",
        linewidth=1.6,
        zorder=3,
    )
    axes[1].set_xticks(np.arange(len(live_labels)))
    axes[1].set_xticklabels(live_labels, fontsize=11)
    axes[1].set_ylabel("Cases Passed (Historical Live Capture)")
    axes[1].set_ylim(0, 16)
    axes[1].yaxis.grid(True, linestyle="--", alpha=0.25, zorder=0)
    axes[1].set_title("Historical Live Runs Bounded Here (Not Re-executed)", pad=12)
    for rect, v in zip(l_bars, live_vals):
        axes[1].text(rect.get_x() + rect.get_width() / 2.0, v + 0.35, f"{v} / 13", ha="center", va="bottom", fontsize=11, fontweight="bold")
    axes[1].text(
        0.44,
        0.93,
        "Why Provenance Audit Matters:\n• Preserved checksums prove non-tampering\n• They do NOT upgrade historical 7/13\n  or 180 replay / 30 pair (60 run) limits",
        transform=axes[1].transAxes,
        fontsize=10,
        verticalalignment="top",
        bbox={"boxstyle": "round,pad=0.45", "facecolor": "#FFF9EB", "edgecolor": "#D97706", "linewidth": 1.2},
        color="#27272A",
    )

    return finalize_figure(fig, OUT_DIR / "finbench-verification-audit.png", dpi=300, tight_pad=2.0)


def main() -> None:
    saved = []
    saved.extend(plot_auto_ontology())
    saved.extend(plot_auto_ontology_failures_and_stage_b())
    saved.extend(plot_aura_runtime())
    saved.extend(plot_finbench_audit())
    for p in saved:
        print(f"Generated: {p}")


if __name__ == "__main__":
    main()
