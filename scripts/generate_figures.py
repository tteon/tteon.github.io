#!/usr/bin/env python3
"""Generate publication-grade figures (figures4papers style) for tteon.github.io experiment posts.

All numeric values are transcribed verbatim from verified local lab reports.
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
)

OUT_DIR = Path(__file__).resolve().parent.parent / "public" / "figures"


def _asymmetric_err(means: list[float], lowers: list[float], uppers: list[float]) -> np.ndarray:
    m = np.asarray(means, dtype=float)
    lo = np.clip(m - np.asarray(lowers, dtype=float), 0.0, None)
    hi = np.clip(np.asarray(uppers, dtype=float) - m, 0.0, None)
    return np.vstack([lo, hi])


def plot_auto_ontology() -> list[Path]:
    """Paired accuracy across Tier 1-5 & Overall on Postgres and Neo4j (n=80/tier, 1600 total)."""
    apply_publication_style(FigureStyle(font_size=14, axes_linewidth=2.0))
    fig, axes = create_subplots(1, 2, figsize=(15.5, 5.8))

    tiers = ["Tier 1", "Tier 2", "Tier 3", "Tier 4", "Tier 5", "Overall\n(n=400)"]

    # Postgres (from auto-ontology-bench/results/REPORT.md lines 11-12)
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
    axes[0].set_title("Postgres Engine (pg-no-onto vs pg-onto)", pad=12)
    axes[0].set_ylim(0.0, 1.12)
    axes[0].annotate(
        "Tier 2: +0.725\n(p = 4.74e-15)",
        xy=(1.18, 0.96),
        xytext=(1.65, 1.02),
        fontsize=10.5,
        fontweight="bold",
        color=PALETTE["blue_main"],
        arrowprops={"arrowstyle": "->", "color": PALETTE["blue_main"], "lw": 1.5},
    )
    axes[0].annotate(
        "Tier 3: -0.225\n(p = 4.01e-05)",
        xy=(2.18, 0.37),
        xytext=(2.55, 0.55),
        fontsize=10.5,
        fontweight="bold",
        color=PALETTE["red_strong"],
        arrowprops={"arrowstyle": "->", "color": PALETTE["red_strong"], "lw": 1.5},
    )

    # Neo4j (from auto-ontology-bench/results/REPORT.md lines 9-10)
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
    axes[1].set_title("Neo4j Engine (neo-no-onto vs neo-onto)", pad=12)
    axes[1].set_ylim(0.0, 1.12)
    axes[1].annotate(
        "Tier 2: +0.525\n(p = 4.46e-10)",
        xy=(1.18, 0.71),
        xytext=(1.55, 0.86),
        fontsize=10.5,
        fontweight="bold",
        color=PALETTE["blue_main"],
        arrowprops={"arrowstyle": "->", "color": PALETTE["blue_main"], "lw": 1.5},
    )
    axes[1].annotate(
        "Tier 3: -0.125\n(p = 0.0129)",
        xy=(2.18, 0.24),
        xytext=(2.55, 0.43),
        fontsize=10.5,
        fontweight="bold",
        color=PALETTE["red_strong"],
        arrowprops={"arrowstyle": "->", "color": PALETTE["red_strong"], "lw": 1.5},
    )

    handles, labels = axes[0].get_legend_handles_labels()
    fig.legend(
        handles,
        labels,
        loc="upper center",
        bbox_to_anchor=(0.5, 1.03),
        ncol=2,
        frameon=False,
        fontsize=14,
    )
    return finalize_figure(fig, OUT_DIR / "auto-ontology-postgres-vs-neo4j.png", dpi=300, tight_pad=2.2)


def plot_aura_runtime() -> list[Path]:
    """Neo4j Aura 6-workload runtime latency (log ms) & Speedup over Slotted."""
    apply_publication_style(FigureStyle(font_size=14, axes_linewidth=2.0))
    fig, axes = create_subplots(1, 2, figsize=(16.0, 5.8))

    workloads = [
        "W1\nLookup",
        "W2\nLocal 3-hop",
        "W3\nGlobal Agg",
        "W4\nGlobal 3-hop",
        "W5\nTop-k",
        "W6\nSupernode",
    ]
    slotted = [100.58, 103.41, 139.09, 2324.62, 100.97, 137.13]
    pipelined = [100.50, 104.78, 137.26, 975.65, 101.40, 133.88]
    parallel = [103.98, 106.68, 118.93, 565.39, 105.85, 117.49]

    make_grouped_bar(
        axes[0],
        workloads,
        [slotted, pipelined, parallel],
        ["Slotted", "Pipelined", "Parallel"],
        ylabel="Median Client Wall Time (ms, log scale)",
        colors=[PALETTE["red_strong"], PALETTE["green_2"], PALETTE["blue_main"]],
        hatches=["///", "", ""],
        annotate=False,
    )
    axes[0].set_yscale("log")
    axes[0].set_ylim(60, 5200)
    axes[0].axhline(100.0, color="#3F3F46", linestyle=":", linewidth=1.8, zorder=2)
    axes[0].annotate(
        "~100 ms Bolt RTT floor\n(W1, W2, W5 network-bound)",
        xy=(0.5, 108),
        xytext=(0.05, 310),
        fontsize=10.5,
        color="#27272A",
        bbox={"boxstyle": "round,pad=0.35", "facecolor": "#F4F4F5", "edgecolor": "#A1A1AA", "linewidth": 1.0},
        arrowprops={"arrowstyle": "->", "color": "#52525B", "lw": 1.2},
    )
    axes[0].annotate(
        "2,325 → 565 ms",
        xy=(3.24, 585),
        xytext=(3.4, 2100),
        fontsize=10.5,
        fontweight="bold",
        color=PALETTE["blue_main"],
        arrowprops={"arrowstyle": "->", "color": PALETTE["blue_main"], "lw": 1.5},
    )
    axes[0].set_title("Median Client Wall Latency (5 runs / workload)", pad=12)

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
    axes[1].axhline(1.0, color=PALETTE["red_strong"], linestyle="--", linewidth=1.8, zorder=2, label="Slotted (1.0×)")
    axes[1].set_ylim(0.5, 4.8)
    annotate_bars(axes[1], bars, fmt="{:.2f}×", fontsize=10.5, padding=4)
    axes[1].text(2.83, speedup_pipe[3] + 0.10, f"{speedup_pipe[3]:.2f}×", ha="center", va="bottom", fontsize=10.5, color="#18181b")
    axes[1].legend(loc="upper left", fontsize=11, frameon=False)
    axes[1].set_title("Speedup Factor Relative to Slotted", pad=12)

    handles0, labels0 = axes[0].get_legend_handles_labels()
    fig.legend(handles0, labels0, loc="upper center", bbox_to_anchor=(0.5, 1.03), ncol=3, frameon=False, fontsize=14)
    return finalize_figure(fig, OUT_DIR / "aura-runtime-routing.png", dpi=300, tight_pad=2.2)


def plot_finbench_audit() -> list[Path]:
    """FinBench offline replay verification: deterministic suite coverage & preserved bundle sizes."""
    apply_publication_style(FigureStyle(font_size=13.5, axes_linewidth=2.0))
    fig, axes = create_subplots(1, 2, figsize=(15.5, 5.4))

    checks = [
        "Validation\nSuite",
        "Probes\nSuite",
        "DB Replay\nSuite",
        "Evidence\nTests",
        "Exported\nCharts",
        "Summary\nAnalyzers",
        "Preserved\nFiles",
    ]
    pct = [100.0] * len(checks)
    ratios = ["17/17", "12/12", "19/19", "8/8", "18/18", "4/4", "713/713"]

    bars = axes[0].bar(
        np.arange(len(checks)),
        pct,
        width=0.62,
        color=[PALETTE["blue_main"]] * 4 + [PALETTE["green_3"]] * 3,
        edgecolor="black",
        linewidth=1.6,
        zorder=3,
    )
    axes[0].set_xticks(np.arange(len(checks)))
    axes[0].set_xticklabels(checks, fontsize=11)
    axes[0].set_ylabel("Offline Pass / Hash Match (%)")
    axes[0].set_ylim(0, 118)
    axes[0].yaxis.grid(True, linestyle="--", alpha=0.25, zorder=0)
    axes[0].set_title("Offline Contract Tests & SHA-256 Re-verification", pad=12)
    for rect, ratio in zip(bars, ratios):
        axes[0].text(
            rect.get_x() + rect.get_width() / 2.0,
            102.5,
            f"100%\n({ratio})",
            ha="center",
            va="bottom",
            fontsize=10,
            fontweight="bold",
            color="#18181b",
        )

    bundles = [
        "val-r1",
        "val-r2",
        "probes-r1",
        "replay-r1",
        "replay-r2",
        "ablation-r1",
    ]
    file_counts = [24, 345, 212, 31, 51, 50]
    b_bars = axes[1].bar(
        np.arange(len(bundles)),
        file_counts,
        width=0.58,
        color=[PALETTE["blue_secondary"]] * 3 + [PALETTE["teal"]] * 3,
        edgecolor="black",
        linewidth=1.6,
        zorder=3,
    )
    axes[1].set_xticks(np.arange(len(bundles)))
    axes[1].set_xticklabels(bundles, fontsize=11)
    axes[1].set_ylabel("Manifest Files Verified (SHA-256)")
    axes[1].set_ylim(0, 410)
    axes[1].yaxis.grid(True, linestyle="--", alpha=0.25, zorder=0)
    axes[1].set_title("Preserved Raw Artifacts (713 Total) vs Live Scope", pad=12)
    annotate_bars(axes[1], b_bars, fmt="{:.0f}", fontsize=11)
    axes[1].text(
        0.46,
        0.93,
        "Historical live runs NOT re-executed:\n"
        "• Baseline/protocol: 8/13 pass (7/13 contract)\n"
        "• Probes: 3 questions × 7 conditions (1 run each)\n"
        "• General replay: 180 runs · Pairs: 30 (60 runs)",
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
    saved.extend(plot_aura_runtime())
    saved.extend(plot_finbench_audit())
    for p in saved:
        print(f"Generated: {p}")


if __name__ == "__main__":
    main()
