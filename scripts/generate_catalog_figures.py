#!/usr/bin/env python3
"""Generate 9 publication-grade figures4papers PNGs for synthesized local experiment catalog on tteon.github.io.

Every coordinate plotted here is transcribed verbatim from verified primary files inspected on disk.
"""
from __future__ import annotations

import sys
from pathlib import Path

SKILL_SCRIPTS = Path.home() / ".agents/skills/experiment-storytelling/scripts"
sys.path.insert(0, str(SKILL_SCRIPTS))

import matplotlib.pyplot as plt
import numpy as np

from pubfig import (
    PALETTE,
    FigureStyle,
    apply_publication_style,
    create_subplots,
    finalize_figure,
    make_grouped_bar,
)

OUT_DIR = Path(__file__).resolve().parent.parent / "public" / "figures"


def _err(vals: list[float], lows: list[float], highs: list[float]) -> np.ndarray:
    m = np.asarray(vals, dtype=float)
    return np.vstack([np.clip(m - np.asarray(lows, float), 0.0, None), np.clip(np.asarray(highs, float) - m, 0.0, None)])


def plot_aura_study_profile_and_rewrite() -> list[Path]:
    """Post A Fig 1: PROFILE overhead inflation vs non-PROFILE server ms, plus 16x W4 DP rewrite."""
    apply_publication_style(FigureStyle(font_size=13.5, axes_linewidth=2.0))
    fig, axes = create_subplots(1, 2, figsize=(15.5, 5.8))

    runtimes = ["Slotted", "Pipelined", "Parallel"]
    prof_ms = [2186.0, 872.0, 406.0]
    nonprof_med = [1226.5, 901.0, 498.0]
    nonprof_err = _err(nonprof_med, [1158.0, 761.0, 248.0], [1378.0, 1112.0, 619.0])

    make_grouped_bar(
        axes[0],
        runtimes,
        [prof_ms, nonprof_med],
        ["With PROFILE (artifact inflation)", "No PROFILE (10-round server med & range)"],
        ylabel="Server Execution Time (ms)",
        colors=[PALETTE["red_2"], PALETTE["blue_main"]],
        hatches=["///", ""],
        yerr=[None, nonprof_err],
        annotate=False,
    )
    axes[0].set_ylim(0, 2750)
    axes[0].annotate(
        "PROFILE inflates Slotted\n2,186 → 1,226.5 ms\n(True Parallel gain: 2.46×)",
        xy=(0.2, 1390),
        xytext=(0.75, 1980),
        fontsize=10,
        fontweight="bold",
        color=PALETTE["red_strong"],
        bbox={"boxstyle": "round,pad=0.35", "facecolor": "#FEF2F2", "edgecolor": PALETTE["red_strong"], "linewidth": 1.0},
        arrowprops={"arrowstyle": "->", "color": PALETTE["red_strong"], "lw": 1.5},
    )
    axes[0].set_title("W4 Server Latency: PROFILE Artifact vs True Speedup", pad=12)
    axes[0].legend(loc="upper right", fontsize=9.5, frameon=False)

    orig_ms = [1244.0, 798.0, 312.0]
    dp_ms = [77.0, 84.0, 61.0]
    make_grouped_bar(
        axes[1],
        runtimes,
        [orig_ms, dp_ms],
        ["Original 3-Hop Query (6.14M–9.98M hits)", "Pre-Aggregated DP Rewrite (0.27M–0.42M hits)"],
        ylabel="Server Median Latency (ms)",
        colors=[PALETTE["neutral"], PALETTE["green_3"]],
        hatches=["///", ""],
        annotate=True,
        fmt="{:.0f}",
        fontsize=10.5,
    )
    axes[1].set_ylim(0, 1620)
    axes[1].annotate(
        "16.2× faster (1,244 → 77 ms)\n+122 paths (1,791,878 → 1,792,000)\ndue to 8 self-loops: trail vs walk",
        xy=(0.22, 115),
        xytext=(0.78, 1080),
        fontsize=9.6,
        fontweight="bold",
        color="#15803d",
        bbox={"boxstyle": "round,pad=0.35", "facecolor": "#F0FDF4", "edgecolor": "#16A34A", "linewidth": 1.2},
        arrowprops={"arrowstyle": "->", "color": "#15803d", "lw": 1.5},
    )
    axes[1].set_title("Query Rewrite Beats Runtime Switching (n=5)", pad=12)
    axes[1].legend(loc="upper right", fontsize=9.5, frameon=False)

    return finalize_figure(fig, OUT_DIR / "aura-study-profile-and-rewrite.png", dpi=300, tight_pad=2.1)


def plot_mfg_pyoxigraph_vs_neo4j() -> list[Path]:
    """Post A Fig 2: PyOxigraph vs Neo4j (5 FMEA scenarios) + Graph-CoT 0.47% DB stall attribution."""
    apply_publication_style(FigureStyle(font_size=13.5, axes_linewidth=2.0))
    fig, axes = create_subplots(1, 2, figsize=(15.8, 5.6))

    scenarios = ["S1\nRCA", "S2\nContam", "S3\nAnomaly", "S4a\nTBox", "S4b\nA+TBox", "S5\nUpsert"]
    pyox_ms = [0.52, 0.20, 1.88, 0.03, 0.24, 1.49]
    neo_ms = [1.73, 2.55, 3.04, 3.05, 5.53, 5.02]
    make_grouped_bar(
        axes[0],
        scenarios,
        [neo_ms, pyox_ms],
        ["Neo4j Cypher (100% P/R)", "PyOxigraph SPARQL (100% P/R)"],
        ylabel="Query Median Latency (ms, 1,362 quads)",
        colors=[PALETTE["red_strong"], PALETTE["blue_main"]],
        hatches=["///", ""],
        annotate=True,
        fmt="{:.2f}",
        fontsize=9.2,
    )
    axes[0].set_ylim(0, 6.8)
    axes[0].set_title("Single-Query Persistency: Embedded RDF vs Neo4j", pad=12)
    axes[0].legend(loc="upper left", fontsize=10, frameon=False)

    cats = ["Graph-CoT\nDB Tool p50", "Graph-CoT\nLLM Turn p50", "MFG LPG\nTool p50 (c=16)", "MFG LPG\nE2E p50 (c=16)"]
    vals = [2.79, 1151.67, 207.30, 6742.70]
    cols = [PALETTE["green_3"], PALETTE["blue_main"], PALETTE["teal"], PALETTE["red_strong"]]
    bars_b = axes[1].bar(np.arange(len(cats)), vals, width=0.55, color=cols, edgecolor="black", linewidth=1.6, zorder=3)
    axes[1].set_yscale("log")
    axes[1].set_ylim(1.0, 22000)
    axes[1].set_xticks(np.arange(len(cats)))
    axes[1].set_xticklabels(cats, fontsize=10)
    axes[1].set_ylabel("Latency (ms, log scale)")
    axes[1].yaxis.grid(True, linestyle="--", alpha=0.25, zorder=0)
    for rect, v in zip(bars_b, vals):
        axes[1].text(rect.get_x() + rect.get_width() / 2.0, v * 1.18, f"{v:.1f} ms" if v >= 10 else f"{v:.2f} ms", ha="center", va="bottom", fontsize=10, fontweight="bold")
    axes[1].annotate(
        "DB stall = 0.47% of wall time\n(breakeven = 45.48 ms/turn)",
        xy=(0, 3.3),
        xytext=(0.15, 220),
        fontsize=9.8,
        fontweight="bold",
        color="#15803d",
        bbox={"boxstyle": "round,pad=0.35", "facecolor": "#F0FDF4", "edgecolor": "#16A34A", "linewidth": 1.1},
        arrowprops={"arrowstyle": "->", "color": "#15803d", "lw": 1.3},
    )
    axes[1].set_title("LLM Turn vs DB Execution Time (n=270 & n=32)", pad=12)

    return finalize_figure(fig, OUT_DIR / "mfg-pyoxigraph-vs-neo4j.png", dpi=300, tight_pad=2.1)


def plot_modality_paradox_and_construction() -> list[Path]:
    """Post C: gnnllm_lab (n=2,542) modality paradox + verbalization 3.4x lift & LoG construction tax."""
    apply_publication_style(FigureStyle(font_size=13.5, axes_linewidth=2.0))
    fig, axes = create_subplots(1, 2, figsize=(15.8, 5.8))

    modes = ["Text\n(370.5 tok)", "LPG\n(96.5 tok)", "RDF\n(24.2 tok)", "RDF-Hop\n(66.7 tok)", "RDF-Verb\n(48.3 tok)"]
    idf_recall = [0.2861, 0.0637, 0.0183, 0.0236, 0.0624]
    idf_prec = [0.2435, 0.1723, 0.0919, 0.0610, 0.2980]
    make_grouped_bar(
        axes[0],
        modes,
        [idf_recall, idf_prec],
        ["Answer IDF Recall (n=2,542)", "Answer IDF Precision (n=2,542)"],
        ylabel="Mean Lexical Alignment Score",
        colors=[PALETTE["blue_main"], PALETTE["teal"]],
        hatches=["", ".."],
        annotate=True,
        fmt="{:.3f}",
        fontsize=9.5,
    )
    axes[0].set_ylim(0, 0.39)
    axes[0].annotate(
        "Verbalization lifts RDF recall 3.4×\n(0.018 → 0.062, beats LPG precision)",
        xy=(3.82, 0.072),
        xytext=(1.35, 0.265),
        fontsize=9.3,
        fontweight="bold",
        color=PALETTE["blue_main"],
        bbox={"boxstyle": "round,pad=0.35", "facecolor": "#EFF6FF", "edgecolor": PALETTE["blue_main"], "linewidth": 1.0},
        arrowprops={"arrowstyle": "->", "color": PALETTE["blue_main"], "lw": 1.4},
    )
    axes[0].set_title("Modality Paradox & Verbalization Rescue (FinDER n=2,542)", pad=12)
    axes[0].legend(loc="upper center", bbox_to_anchor=(0.45, 1.01), fontsize=9.5, frameon=False)

    models_b = ["DeepSeek-V3.1\nMed Parse", "MiniMax-M2.7\nMed Parse", "gpt-oss-120b\nMed Org%", "Finding 1.4\nAgreement (n=16)"]
    base_g = [1.00, 0.85, 0.9298, 0.375]
    onto_o = [1.00, 0.50, 0.6000, 0.193]
    make_grouped_bar(
        axes[1],
        models_b,
        [base_g, onto_o],
        ["Unconstrained / Baseline (G / Cond A)", "Ontology-Constrained (O / Cond C)"],
        ylabel="Rate / Cross-Model Agreement [0–1]",
        colors=[PALETTE["green_3"], PALETTE["red_strong"]],
        hatches=["", "///"],
        annotate=True,
        fmt="{:.2f}",
        fontsize=10.0,
    )
    axes[1].set_ylim(0, 1.22)
    axes[1].set_title("Ontology Constraint Tax: Parse, Org-Rate & Agreement", pad=12)
    axes[1].legend(loc="upper right", fontsize=9.5, frameon=False)

    return finalize_figure(fig, OUT_DIR / "modality-paradox-and-construction.png", dpi=300, tight_pad=2.1)


def plot_temporal_and_ecommerce_ontology() -> list[Path]:
    """Post D: SEC Temporal (n=102) + Opik real answerability (0.30 vs 0.80) & SOL Exp 1/2/3."""
    apply_publication_style(FigureStyle(font_size=13.5, axes_linewidth=2.0))
    fig, axes = create_subplots(1, 2, figsize=(15.8, 5.8))

    cats_a = ["SEC All\n(n=102)", "SEC Fresh\n(n=68)", "SEC FY25 Stale\n(n=34)", "Opik E2E\nvs Real Ans"]
    closed_or_proxy = [0.412, 0.588, 0.059, 0.800]
    grounded_or_real = [1.000, 1.000, 1.000, 0.300]
    make_grouped_bar(
        axes[0],
        cats_a,
        [closed_or_proxy, grounded_or_real],
        ["Closed-Book / Text Proxy Score", "Grounded Graph / Real DB Record"],
        ylabel="Accuracy / Answerability Rate",
        colors=[PALETTE["red_2"], PALETTE["blue_main"]],
        hatches=["///", ""],
        annotate=True,
        fmt="{:.3f}",
        fontsize=9.8,
    )
    axes[0].set_ylim(0, 1.32)
    axes[0].legend(loc="upper left", bbox_to_anchor=(0.0, 1.01), ncol=1, fontsize=9.2, frameon=False)
    axes[0].annotate(
        "Post-cutoff rescue:\n5.9% → 100.0% (34/34)",
        xy=(2.18, 1.04),
        xytext=(2.35, 1.15),
        fontsize=9.3,
        fontweight="bold",
        color=PALETTE["blue_main"],
        bbox={"boxstyle": "round,pad=0.32", "facecolor": "#EFF6FF", "edgecolor": PALETTE["blue_main"], "linewidth": 1.0},
        arrowprops={"arrowstyle": "->", "color": PALETTE["blue_main"], "lw": 1.3},
    )
    axes[0].set_title("Temporal Grounding Gain vs Answerability Proxy Trap", pad=12)

    sol_arms = ["Exp1 Raw\n(2.3K tok)", "Exp1 Onto\n(431 tok)", "Exp3 RAG\n(1.2K tok)", "Exp3 Onto\n(440 tok)", "Exp2 Unif.\n(1 call)", "Exp2 Free\n(4 calls)", "Exp2 JSON\n(4 calls, n=9)"]
    sol_acc = [91.0, 98.0, 88.0, 100.0, 90.0, 50.0, 88.9]
    sol_cols = [PALETTE["neutral"], PALETTE["blue_main"], PALETTE["neutral"], PALETTE["blue_main"], PALETTE["green_3"], PALETTE["red_strong"], PALETTE["highlight"]]
    bars_s = axes[1].bar(np.arange(len(sol_arms)), sol_acc, width=0.58, color=sol_cols, edgecolor="black", linewidth=1.5, zorder=3)
    axes[1].set_ylim(0, 122)
    axes[1].set_xticks(np.arange(len(sol_arms)))
    axes[1].set_xticklabels(sol_arms, fontsize=8.6)
    axes[1].set_ylabel("Task Accuracy / Pass Rate (%)")
    axes[1].yaxis.grid(True, linestyle="--", alpha=0.25, zorder=0)
    for rect, v in zip(bars_s, sol_acc):
        axes[1].text(rect.get_x() + rect.get_width() / 2.0, v + 2.2, f"{v:.1f}%", ha="center", va="bottom", fontsize=9.0, fontweight="bold")
    axes[1].text(1.5, 112, "Ontology: −81.4% prompt tokens · 0% hallucination", ha="center", fontsize=9.4, fontweight="bold", color=PALETTE["blue_main"], bbox={"boxstyle": "round,pad=0.3", "facecolor": "#EFF6FF", "edgecolor": PALETTE["blue_main"], "linewidth": 1.0})
    axes[1].set_title("SOL E-Commerce: Schema Compression vs Multi-Agent Split", pad=12)

    return finalize_figure(fig, OUT_DIR / "temporal-and-ecommerce-ontology.png", dpi=300, tight_pad=2.1)


def plot_icml_factorial_and_judge_swap() -> list[Path]:
    """Post E: ICML cross-judge bias swap (0.97->0.49) & tool interference / planner collapse."""
    apply_publication_style(FigureStyle(font_size=13.5, axes_linewidth=2.0))
    fig, axes = create_subplots(1, 2, figsize=(15.8, 5.8))

    kimi_self = [0.880, 0.970, 0.920, 0.920]
    gpt4o_rescore = [0.580, 0.490, 0.450, 0.420]
    make_grouped_bar(
        axes[0],
        ["Text Only", "Hybrid All", "Hybrid Routed", "Graph CoT+GFM"],
        [kimi_self, gpt4o_rescore],
        ["Kimi Self-Judge (M1, n=10)", "GPT-4o Independent Judge (M1, n=10)"],
        ylabel="Evaluated Answer Quality (M1)",
        colors=[PALETTE["red_2"], PALETTE["blue_main"]],
        hatches=["///", ""],
        annotate=True,
        fmt="{:.2f}",
        fontsize=10.0,
    )
    axes[0].set_ylim(0, 1.28)
    axes[0].legend(loc="upper right", fontsize=9.2, frameon=False)
    axes[0].annotate(
        "Self-judge illusion:\n0.97 → 0.49 (−0.48)",
        xy=(1.2, 0.54),
        xytext=(0.15, 1.09),
        fontsize=9.4,
        fontweight="bold",
        color=PALETTE["red_strong"],
        bbox={"boxstyle": "round,pad=0.32", "facecolor": "#FEF2F2", "edgecolor": PALETTE["red_strong"], "linewidth": 1.0},
        arrowprops={"arrowstyle": "->", "color": PALETTE["red_strong"], "lw": 1.4},
    )
    axes[0].set_title("Cross-Judge Swap Collapse on Random Slice (n=10)", pad=12)

    groups = ["Robust\n(n=30)", "8-Cat\n(n=72)", "Graph-Only\n(n=152)", "KGC Planner\n(n=200)"]
    baseline_or_best = [0.8467, 0.6069, 0.5757, 0.6590]
    stacked_or_react = [0.7433, 0.5444, 0.3013, 0.2765]
    make_grouped_bar(
        axes[1],
        groups,
        [baseline_or_best, stacked_or_react],
        ["Focused / Single Strategy", "Stacked a+b+c / ReAct / PlannerAgent"],
        ylabel="Mean M1 Judge Score",
        colors=[PALETTE["green_3"], PALETTE["red_strong"]],
        hatches=["", "///"],
        annotate=True,
        fmt="{:.3f}",
        fontsize=9.8,
    )
    axes[1].set_ylim(0, 1.12)
    axes[1].legend(loc="upper right", fontsize=9.2, frameon=False)
    axes[1].annotate("Stacking drops −0.103\n(p = 0.040)", xy=(0.18, 0.78), xytext=(0.45, 0.94), fontsize=9.0, fontweight="bold", color=PALETTE["red_strong"], arrowprops={"arrowstyle": "->", "color": PALETTE["red_strong"], "lw": 1.2})
    axes[1].text(3.0, 0.72, "Single 0.659 vs\nPlanner 0.277", ha="center", fontsize=9.0, fontweight="bold", color=PALETTE["red_strong"])
    axes[1].set_title("Tool Interference & Multi-Step Planner Collapse", pad=12)

    return finalize_figure(fig, OUT_DIR / "icml-factorial-and-judge-swap.png", dpi=300, tight_pad=2.1)


def plot_mara_single_vs_multiagent() -> list[Path]:
    """Post F: AIsummit26 Stage C N=1,260 (Direct vs Multi) + AIE E1/E2/E4 DeepSeek reversal."""
    apply_publication_style(FigureStyle(font_size=13.5, axes_linewidth=2.0))
    fig, axes = create_subplots(1, 2, figsize=(15.8, 5.8))

    models = ["gpt-oss\n(med)", "gpt-oss\n(high)", "DeepSeek\nV3.1", "DeepSeek\nV3.2", "gemma-4\n31B", "MiniMax\nM2.7*"]
    direct = [48, 51, 33, 45, 42, 45]
    multi_typed = [33, 27, 24, 15, 36, 21]
    multi_env = [33, 27, 24, 15, 36, 22]

    make_grouped_bar(
        axes[0],
        models,
        [direct, multi_typed, multi_env],
        ["Direct Single (max 60)", "Multi Typed (max 60)", "Multi Envelope (max 60)"],
        ylabel="Correct Answers (out of 60, n=1,260 total)",
        colors=[PALETTE["blue_main"], PALETTE["red_2"], PALETTE["red_strong"]],
        hatches=["", "//", "\\\\"],
        annotate=True,
        fmt="{:.0f}",
        fontsize=8.8,
    )
    axes[0].set_ylim(0, 72)
    axes[0].set_title("MARA Stage C Factorial: Direct Beats Multi Across Every Model", pad=12)
    axes[0].legend(loc="upper center", bbox_to_anchor=(0.5, 1.01), ncol=3, fontsize=8.5, frameon=False)

    regimes = ["gpt-oss agg\nSF1..100 (n=117)", "gpt-oss rows\n(n=52)", "DeepSeek-V3.2\nagg (n=26)"]
    naive_pct = [82.9, 25.0, 76.9]
    eng_pct = [92.3, 34.6, 69.2]
    make_grouped_bar(
        axes[1],
        regimes,
        [naive_pct, eng_pct],
        ["Naive Stack (labels + JSON)", "Engineered Stack (ontology + CSV + guardrails)"],
        ylabel="Correct Episode Rate (%)",
        colors=[PALETTE["neutral"], PALETTE["teal"]],
        hatches=["///", ""],
        annotate=True,
        fmt="{:.1f}%",
        fontsize=9.8,
    )
    axes[1].set_ylim(0, 114)
    axes[1].annotate(
        "Model reversal on V3.2:\nNaive 76.9% > Engineered 69.2%\n(p50 29s vs 48–52s)",
        xy=(2.2, 74.5),
        xytext=(0.82, 84),
        fontsize=9.2,
        fontweight="bold",
        color=PALETTE["red_strong"],
        bbox={"boxstyle": "round,pad=0.32", "facecolor": "#FEF2F2", "edgecolor": PALETTE["red_strong"], "linewidth": 1.0},
        arrowprops={"arrowstyle": "->", "color": PALETTE["red_strong"], "lw": 1.4},
    )
    axes[1].set_title("FinBench Interface Engineering: Regime & Model Limits", pad=12)
    axes[1].legend(loc="upper left", fontsize=9.0, frameon=False)

    return finalize_figure(fig, OUT_DIR / "mara-single-vs-multiagent.png", dpi=300, tight_pad=2.1)


def plot_kvcache_decode_and_lru_cliff() -> list[Path]:
    """Post G: H200 Prefix Speedup vs LRU Cliff + GraphKV stage dominance."""
    apply_publication_style(FigureStyle(font_size=13.5, axes_linewidth=2.0))
    fig, axes = create_subplots(1, 2, figsize=(15.8, 5.8))

    tokens = ["1.8K", "6.8K", "26.9K", "54.5K", "99.75%\nPressure"]
    cold_s = [0.0985, 0.2164, 0.9519, 2.3137, 2.3137]
    warm_s = [0.0411, 0.0537, 0.0998, 0.1571, 1.8289]
    make_grouped_bar(
        axes[0],
        tokens,
        [cold_s, warm_s],
        ["Cold Prefill TTFT (s)", "Warm / Pressured Prefix TTFT (s)"],
        ylabel="TTFT Latency (seconds, H200 gpt-oss-120b)",
        colors=[PALETTE["red_strong"], PALETTE["blue_main"]],
        hatches=["///", ""],
        annotate=True,
        fmt="{:.2f}s",
        fontsize=9.0,
    )
    axes[0].set_ylim(0, 3.10)
    axes[0].annotate(
        "14.8× TTFT gain\n(2.31s → 0.16s)",
        xy=(3.2, 0.26),
        xytext=(1.65, 1.35),
        fontsize=9.4,
        fontweight="bold",
        color=PALETTE["blue_main"],
        arrowprops={"arrowstyle": "->", "color": PALETTE["blue_main"], "lw": 1.4},
    )
    axes[0].annotate(
        "LRU cliff @ 99.75% KV:\nhit drops to 0.2% (1.83s)",
        xy=(4.2, 1.95),
        xytext=(2.15, 2.62),
        fontsize=9.4,
        fontweight="bold",
        color=PALETTE["red_strong"],
        bbox={"boxstyle": "round,pad=0.30", "facecolor": "#FEF2F2", "edgecolor": PALETTE["red_strong"], "linewidth": 1.0},
        arrowprops={"arrowstyle": "->", "color": PALETTE["red_strong"], "lw": 1.4},
    )
    axes[0].set_title("H200 Prefix Cache Speedup vs 99.75% Capacity Cliff", pad=12)
    axes[0].legend(loc="upper left", fontsize=9.0, frameon=False)

    arms = ["B0 (FIFO, r=16)", "B1 (Cost+Age, r=16)", "B2 (Deadline, r=16)"]
    g_ms = [0.70, 0.61, 0.65]
    v_ms = [3885.3, 3738.3, 3391.9]
    l_ms = [1122.0, 1025.6, 1090.8]
    make_grouped_bar(
        axes[1],
        arms,
        [g_ms, v_ms, l_ms],
        ["Graph (<0.7 ms)", "Validator+Dispatch (~3.5s)", "Next LLM (~1.1s)"],
        ylabel="Stage Median Latency (ms, log scale)",
        colors=[PALETTE["green_3"], PALETTE["red_strong"], PALETTE["blue_main"]],
        hatches=["", "///", ".."],
        annotate=False,
    )
    axes[1].set_yscale("log")
    axes[1].set_ylim(0.3, 32000)
    axes[1].legend(loc="upper center", bbox_to_anchor=(0.5, 1.02), ncol=3, fontsize=8.6, frameon=False)
    axes[1].text(1.0, 6200, "Graph < 0.7 ms vs LLM+Validator ~4,800 ms (Holm p = 0.625 / 0.875)", ha="center", fontsize=9.3, fontweight="bold", color="#18181b")
    axes[1].set_title("Co-Scheduling Bottleneck: Graph Is <0.1% of Wall (n=200/arm)", pad=12)

    return finalize_figure(fig, OUT_DIR / "kvcache-decode-and-lru-cliff.png", dpi=300, tight_pad=2.1)


def plot_rdma_ucx_rails_and_sd_audit() -> list[Path]:
    """Post H: 2-Node ConnectX-5 RoCEv2 NIXL BW/Overhead + MARA 3-Window Contract Gate."""
    apply_publication_style(FigureStyle(font_size=13.5, axes_linewidth=2.0))
    fig, axes = create_subplots(1, 2, figsize=(15.8, 5.8))

    sizes = ["1 KB", "16 KB", "64 KB", "256 KB", "1 MB", "4 MB"]
    bw_gbs = [0.08, 1.41, 3.63, 8.08, 11.30, 24.39]
    oh_pct = [59.0, 57.0, 40.0, 23.0, 8.0, 5.0]
    x = np.arange(len(sizes))
    b1 = axes[0].bar(x - 0.18, bw_gbs, width=0.36, color=PALETTE["blue_main"], edgecolor="black", linewidth=1.4, label="Bandwidth (GB/s, 4-rail)")
    axes[0].set_ylabel("Bandwidth (GB/s, NIXL+UCX)", color=PALETTE["blue_main"], fontweight="bold")
    axes[0].set_ylim(0, 32)
    axes[0].set_xticks(x)
    axes[0].set_xticklabels(sizes)
    axes[0].yaxis.grid(True, linestyle="--", alpha=0.25, zorder=0)
    for rect, v in zip(b1, bw_gbs):
        axes[0].text(rect.get_x() + rect.get_width() / 2.0, v + 0.6, f"{v:.1f}", ha="center", va="bottom", fontsize=8.8, fontweight="bold", color=PALETTE["blue_main"])

    ax2 = axes[0].twinx()
    ax2.spines["top"].set_visible(False)
    b2 = ax2.bar(x + 0.18, oh_pct, width=0.36, color=PALETTE["red_2"], hatch="///", edgecolor="black", linewidth=1.4, label="Protocol Overhead (%)")
    ax2.set_ylabel("Protocol Overhead (% of transfer)", color=PALETTE["red_strong"], fontweight="bold")
    ax2.set_ylim(0, 76)
    h1, l1 = axes[0].get_legend_handles_labels()
    h2, l2 = ax2.get_legend_handles_labels()
    axes[0].legend(h1 + h2, l1 + l2, loc="upper left", fontsize=8.8, frameon=False)
    axes[0].annotate("RAILS=1 default: 13.10 GB/s\nRAILS=4 fix: 24.39 GB/s (1.86×)", xy=(5 - 0.18, 24.39), xytext=(2.1, 25.5), fontsize=9.0, fontweight="bold", color=PALETTE["blue_main"], bbox={"boxstyle": "round,pad=0.3", "facecolor": "#EFF6FF", "edgecolor": PALETTE["blue_main"], "linewidth": 1.0}, arrowprops={"arrowstyle": "->", "color": PALETTE["blue_main"], "lw": 1.3})
    axes[0].set_title("2-Node ConnectX-5 RoCEv2 Scaling (4×100GbE)", pad=12)

    models_m = ["DeepSeek-V3.1\n(valid=0.50!)", "MiniMax-M2.5\n(valid=1.00)", "MiniMax-M2.7\n(valid=1.00)", "gpt-oss-120b\n(valid=1.00)"]
    w1_p95 = [11.072, 4.069, 1.136, 11.580]
    w2_p95 = [2.930, 12.438, 5.692, 3.850]
    w3_p95 = [2.346, 1.801, 2.709, 7.473]
    make_grouped_bar(
        axes[1],
        models_m,
        [w1_p95, w2_p95, w3_p95],
        ["Window 1 p95 (s, 07-13)", "Window 2 p95 (s, 07-14)", "Window 3 p95 (s, 07-15)"],
        ylabel="Window p95 Latency (seconds, N=100/day)",
        colors=[PALETTE["blue_main"], PALETTE["teal"], PALETTE["green_3"]],
        hatches=["", "//", ".."],
        annotate=True,
        fmt="{:.1f}",
        fontsize=8.8,
    )
    axes[1].set_ylim(0, 15.2)
    axes[1].set_title("MARA 3-Window Contract Gate (1,200 reqs across 3 days)", pad=12)
    axes[1].legend(loc="upper right", fontsize=9.0, frameon=False)

    return finalize_figure(fig, OUT_DIR / "rdma-ucx-rails-and-sd-audit.png", dpi=300, tight_pad=2.1)


def plot_postmortem_anisotropy_and_silent_failures() -> list[Path]:
    """Post I: CodeGraph Anisotropy + Dev-10/QAT collapse vs DataLab 146/197 silent cron bug."""
    apply_publication_style(FigureStyle(font_size=13.5, axes_linewidth=2.0))
    fig, axes = create_subplots(1, 2, figsize=(15.8, 5.8))

    pcts = ["Min", "p05", "Median", "p95", "Max"]
    cos_vals = [0.2643, 0.6046, 0.9412, 0.9976, 1.0000]
    bars_p = axes[0].bar(np.arange(len(pcts)), cos_vals, width=0.55, color=[PALETTE["green_3"], PALETTE["neutral"], PALETTE["red_strong"], PALETTE["red_strong"], PALETTE["red_strong"]], edgecolor="black", linewidth=1.6, zorder=3)
    axes[0].set_xticks(np.arange(len(pcts)))
    axes[0].set_xticklabels(pcts)
    axes[0].set_ylabel("Off-Diagonal Cosine Similarity (273,430 pairs)")
    axes[0].set_ylim(0, 1.24)
    axes[0].yaxis.grid(True, linestyle="--", alpha=0.25, zorder=0)
    for rect, v in zip(bars_p, cos_vals):
        axes[0].text(rect.get_x() + rect.get_width() / 2.0, v + 0.02, f"{v:.3f}", ha="center", va="bottom", fontsize=10, fontweight="bold")
    axes[0].text(-0.25, 1.12, 'Anisotropy: median 0.941 → "SSE" matches "Item" (1.000)', fontsize=9.1, fontweight="bold", color=PALETTE["red_strong"])
    axes[0].set_title("CodeGraph Vector Anisotropy Distribution (httpx, 729 vecs)", pad=12)

    labels_f = [
        "DataLab\nStatus='ok'\n(N=197)",
        "DataLab\nNeo4j OK\n(until 04-15)",
        "DataLab\nExtracted\n(until 07-30)",
        "Kaggle QAT\nValid Fixes\n(N=12 cells)",
        "Dev-10 C\nGraph Calls\n(N=8 tasks)",
    ]
    logged_or_ok = [197, 49, 51, 0, 0]
    failed_or_empty = [0, 145, 146, 12, 8]
    make_grouped_bar(
        axes[1],
        labels_f,
        [logged_or_ok, failed_or_empty],
        ["Succeeded / Logged OK", "Failed / Empty / Zero-Use"],
        ylabel="Run / Cell Count",
        colors=[PALETTE["blue_main"], PALETTE["red_strong"]],
        hatches=["", "///"],
        annotate=True,
        fmt="{:.0f}",
        fontsize=9.5,
    )
    axes[1].set_ylim(0, 245)
    axes[1].annotate(
        "146/197 empty extractions +\n145/197 Neo4j errors logged 'success'!",
        xy=(1.18, 162),
        xytext=(0.68, 200),
        fontsize=9.2,
        fontweight="bold",
        color=PALETTE["red_strong"],
        bbox={"boxstyle": "round,pad=0.30", "facecolor": "#FEF2F2", "edgecolor": PALETTE["red_strong"], "linewidth": 1.0},
        arrowprops={"arrowstyle": "->", "color": PALETTE["red_strong"], "lw": 1.3},
    )
    axes[1].set_title("Silent Harness Failures Exposed by Raw Artifact Audit", pad=12)
    axes[1].legend(loc="upper right", fontsize=9.2, frameon=False)

    return finalize_figure(fig, OUT_DIR / "postmortem-anisotropy-and-silent-failures.png", dpi=300, tight_pad=2.1)


def main() -> None:
    saved = []
    for fn in [
        plot_aura_study_profile_and_rewrite,
        plot_mfg_pyoxigraph_vs_neo4j,
        plot_modality_paradox_and_construction,
        plot_temporal_and_ecommerce_ontology,
        plot_icml_factorial_and_judge_swap,
        plot_mara_single_vs_multiagent,
        plot_kvcache_decode_and_lru_cliff,
        plot_rdma_ucx_rails_and_sd_audit,
        plot_postmortem_anisotropy_and_silent_failures,
    ]:
        saved.extend(fn())
    for p in saved:
        print(f"Generated: {p}")


if __name__ == "__main__":
    main()
