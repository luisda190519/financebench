#!/usr/bin/env python3
"""
generateVisuals.py — Tasks 79, 80, 81
Statistical analysis, publication-quality figures, and LaTeX tables.

Usage:
    python benchmark/scripts/generateVisuals.py
"""

import json
import os
import csv
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import seaborn as sns
from scipy import stats
from pathlib import Path

# ─── Paths ────────────────────────────────────────────────────────
ROOT = Path(__file__).resolve().parents[2]
REPORTS_DIR = ROOT / 'paper' / 'benchmark-docs' / 'analysis' / 'reports'
FIGURES_DIR = ROOT / 'paper' / 'benchmark-docs' / 'figures'
TABLES_DIR  = ROOT / 'paper' / 'benchmark-docs' / 'tables'

FIGURES_DIR.mkdir(parents=True, exist_ok=True)
TABLES_DIR.mkdir(parents=True, exist_ok=True)

# ─── Load data ────────────────────────────────────────────────────
with open(REPORTS_DIR / 'metrics_full.json', 'r', encoding='utf-8') as f:
    metrics = json.load(f)

per_model = metrics['perModel']
rankings  = metrics['rankings']

# Per-case accuracy CSV
case_df = pd.read_csv(REPORTS_DIR / 'per_case_accuracy.csv')

MODELS = list(per_model.keys())
DISPLAY = {m: per_model[m]['displayName'] for m in MODELS}
DISPLAY_ORDER = [r['model'] for r in rankings['overall']]

# ─── Style ────────────────────────────────────────────────────────
MODEL_COLORS = {
    'gpt-5.4':           '#648FFF',
    'gpt-5.3':           '#785EF0',
    'claude-opus-4.6':   '#DC267F',
    'claude-sonnet-4.6': '#FE6100',
    'claude-haiku-4':    '#FFB000',
    'gemini-3.1-pro':    '#009E73',
    'gemini-3-flash':    '#56B4E9',
    'deepseek-chat':     '#E69F00',
    'grok-code':         '#CC79A7',
}

plt.rcParams.update({
    'font.family': 'DejaVu Sans',
    'font.size': 10,
    'axes.labelsize': 11,
    'axes.titlesize': 12,
    'xtick.labelsize': 9,
    'ytick.labelsize': 9,
    'legend.fontsize': 8,
    'figure.dpi': 150,
    'savefig.dpi': 300,
    'savefig.bbox': 'tight',
    'savefig.pad_inches': 0.1,
})

def save_fig(fig, name):
    fig.savefig(FIGURES_DIR / f'{name}.pdf', format='pdf')
    fig.savefig(FIGURES_DIR / f'{name}.png', format='png')
    plt.close(fig)
    print(f'  Saved {name}.pdf + .png')


# ═══════════════════════════════════════════════════════════════════
# FIGURE 1: Overall Performance Bar Chart
# ═══════════════════════════════════════════════════════════════════
def figure1():
    models = DISPLAY_ORDER
    accs = [per_model[m]['overall']['accuracy'] * 100 for m in models]
    names = [DISPLAY[m] for m in models]
    colors = [MODEL_COLORS.get(m, '#888') for m in models]

    fig, ax = plt.subplots(figsize=(5, 3.5))
    bars = ax.barh(range(len(models)), accs, color=colors, edgecolor='white', linewidth=0.5)
    ax.set_yticks(range(len(models)))
    ax.set_yticklabels(names)
    ax.set_xlabel('Overall Accuracy (%)')
    ax.set_title('Overall Model Performance on FinanceBench')
    ax.invert_yaxis()
    ax.set_xlim(0, max(accs) * 1.15)
    ax.grid(axis='x', alpha=0.3)

    for i, (bar, acc) in enumerate(zip(bars, accs)):
        ax.text(bar.get_width() + 0.5, bar.get_y() + bar.get_height()/2,
                f'{acc:.1f}%', va='center', fontsize=8, fontweight='bold')

    fig.tight_layout()
    save_fig(fig, 'figure1_overall_accuracy')

# ═══════════════════════════════════════════════════════════════════
# FIGURE 2: Performance by Task Category (Grouped Bar)
# ═══════════════════════════════════════════════════════════════════
def figure2():
    task_fields = ['npv', 'irr', 'paybackPeriod', 'breakEvenPoint', 'revenue',
                   'totalCOGS', 'grossProfit', 'ebitda', 'netProfit', 'leveredCashFlow']
    task_labels = ['NPV', 'IRR', 'Payback', 'Break-Even', 'Revenue',
                   'COGS', 'Gross\nProfit', 'EBITDA', 'Net\nProfit', 'Cash\nFlow']

    models = DISPLAY_ORDER
    n_models = len(models)
    n_tasks = len(task_fields)
    x = np.arange(n_tasks)
    width = 0.85 / n_models

    fig, ax = plt.subplots(figsize=(10, 4.5))
    for i, m in enumerate(models):
        accs = []
        for t in task_fields:
            bm = per_model[m]['byMetric'].get(t, {})
            accs.append(bm.get('accuracy', 0) * 100)
        offset = (i - n_models/2 + 0.5) * width
        ax.bar(x + offset, accs, width, label=DISPLAY[m], color=MODEL_COLORS.get(m, '#888'), edgecolor='white', linewidth=0.3)

    ax.set_xticks(x)
    ax.set_xticklabels(task_labels, fontsize=8)
    ax.set_ylabel('Accuracy (%)')
    ax.set_title('Accuracy by Financial Metric')
    ax.legend(bbox_to_anchor=(1.02, 1), loc='upper left', fontsize=7)
    ax.grid(axis='y', alpha=0.3)
    fig.tight_layout()
    save_fig(fig, 'figure2_accuracy_by_task')

# ═══════════════════════════════════════════════════════════════════
# FIGURE 3: Heatmap — Model x Task Performance
# ═══════════════════════════════════════════════════════════════════
def figure3():
    task_fields = ['npv', 'irr', 'paybackPeriod', 'breakEvenPoint', 'revenue',
                   'totalCOGS', 'grossProfit', 'ebitda', 'netProfit', 'leveredCashFlow']
    task_labels = ['NPV', 'IRR', 'Payback', 'Break-Even', 'Revenue',
                   'COGS', 'Gross Profit', 'EBITDA', 'Net Profit', 'Cash Flow']

    models = DISPLAY_ORDER
    data = []
    for m in models:
        row = []
        for t in task_fields:
            bm = per_model[m]['byMetric'].get(t, {})
            row.append(bm.get('accuracy', 0) * 100)
        data.append(row)

    df = pd.DataFrame(data, index=[DISPLAY[m] for m in models], columns=task_labels)

    fig, ax = plt.subplots(figsize=(8, 4))
    sns.heatmap(df, annot=True, fmt='.1f', cmap='YlOrRd_r', ax=ax,
                vmin=0, vmax=100, linewidths=0.5, cbar_kws={'label': 'Accuracy (%)'})
    ax.set_title('Model × Metric Accuracy Heatmap')
    ax.set_yticklabels(ax.get_yticklabels(), rotation=0)
    fig.tight_layout()
    save_fig(fig, 'figure3_performance_heatmap')

# ═══════════════════════════════════════════════════════════════════
# FIGURE 4: Error Type Distribution (Stacked Bar)
# ═══════════════════════════════════════════════════════════════════
def figure4():
    models = DISPLAY_ORDER
    error_types = ['arithmetic', 'conceptual', 'hallucination', 'null_mismatch']
    labels = ['Arithmetic', 'Conceptual', 'Hallucination', 'Null Mismatch']
    colors_err = ['#648FFF', '#FE6100', '#DC267F', '#999999']

    fig, ax = plt.subplots(figsize=(6, 3.5))
    bottoms = np.zeros(len(models))

    for et, lbl, col in zip(error_types, labels, colors_err):
        vals = []
        for m in models:
            errs = per_model[m]['errorTypes']
            total_errs = sum(errs.values())
            vals.append(errs.get(et, 0) / total_errs * 100 if total_errs > 0 else 0)
        ax.bar([DISPLAY[m] for m in models], vals, bottom=bottoms, label=lbl, color=col, edgecolor='white', linewidth=0.5)
        bottoms += np.array(vals)

    ax.set_ylabel('Error Distribution (%)')
    ax.set_title('Error Type Distribution by Model')
    ax.legend(loc='upper right', fontsize=7)
    ax.set_xticklabels([DISPLAY[m] for m in models], rotation=45, ha='right', fontsize=7)
    fig.tight_layout()
    save_fig(fig, 'figure4_error_types')

# ═══════════════════════════════════════════════════════════════════
# FIGURE 5: Proprietary vs Open-Source Box Plot
# ═══════════════════════════════════════════════════════════════════
def figure5():
    prop_models = [m for m in MODELS if per_model[m]['group'] == 'proprietary']
    os_models   = [m for m in MODELS if per_model[m]['group'] == 'opensource']

    prop_accs = [per_model[m]['overall']['accuracy'] * 100 for m in prop_models]
    os_accs   = [per_model[m]['overall']['accuracy'] * 100 for m in os_models]

    fig, ax = plt.subplots(figsize=(4, 3.5))

    bp = ax.boxplot([prop_accs, os_accs], positions=[1, 2], widths=0.5,
                    patch_artist=True, showmeans=True,
                    meanprops=dict(marker='D', markerfacecolor='red', markersize=5))
    bp['boxes'][0].set_facecolor('#648FFF')
    bp['boxes'][1].set_facecolor('#E69F00')

    # Overlay individual points
    for i, (accs, models_list) in enumerate([(prop_accs, prop_models), (os_accs, os_models)]):
        jitter = np.random.RandomState(42).uniform(-0.1, 0.1, len(accs))
        for j, (acc, m) in enumerate(zip(accs, models_list)):
            ax.scatter(i + 1 + jitter[j], acc, color=MODEL_COLORS.get(m, '#888'),
                      s=40, zorder=5, edgecolor='white', linewidth=0.5)
            ax.annotate(DISPLAY[m], (i + 1 + jitter[j], acc),
                       fontsize=5, ha='center', va='bottom', xytext=(0, 3),
                       textcoords='offset points')

    # Mann-Whitney U test
    if len(prop_accs) > 1 and len(os_accs) > 1:
        stat, p = stats.mannwhitneyu(prop_accs, os_accs, alternative='two-sided')
        sig = '***' if p < 0.001 else '**' if p < 0.01 else '*' if p < 0.05 else 'n.s.'
        ymax = max(max(prop_accs), max(os_accs))
        ax.annotate(f'p={p:.3f} {sig}', xy=(1.5, ymax + 3), fontsize=8, ha='center')

    ax.set_xticks([1, 2])
    ax.set_xticklabels(['Proprietary\n(7 models)', 'Open-Source\n(2 models)'])
    ax.set_ylabel('Overall Accuracy (%)')
    ax.set_title('Proprietary vs Open-Source')
    ax.grid(axis='y', alpha=0.3)
    fig.tight_layout()
    save_fig(fig, 'figure5_proprietary_vs_opensource')

# ═══════════════════════════════════════════════════════════════════
# FIGURE 6: Performance by Difficulty
# ═══════════════════════════════════════════════════════════════════
def figure6():
    difficulties = ['simple', 'medium', 'complex']
    models = DISPLAY_ORDER
    n = len(models)
    x = np.arange(len(difficulties))
    width = 0.85 / n

    fig, ax = plt.subplots(figsize=(6, 3.5))
    for i, m in enumerate(models):
        accs = []
        for d in difficulties:
            bd = per_model[m]['byDifficulty'].get(d, {})
            accs.append(bd.get('accuracy', 0) * 100)
        offset = (i - n/2 + 0.5) * width
        ax.bar(x + offset, accs, width, label=DISPLAY[m], color=MODEL_COLORS.get(m, '#888'))

    ax.set_xticks(x)
    ax.set_xticklabels(['Simple', 'Medium', 'Complex'])
    ax.set_ylabel('Accuracy (%)')
    ax.set_title('Accuracy by Case Difficulty')
    ax.legend(bbox_to_anchor=(1.02, 1), loc='upper left', fontsize=7)
    ax.grid(axis='y', alpha=0.3)
    fig.tight_layout()
    save_fig(fig, 'figure6_accuracy_by_difficulty')

# ═══════════════════════════════════════════════════════════════════
# FIGURE 7: Confusion Matrices for Viability
# ═══════════════════════════════════════════════════════════════════
def figure7():
    models = DISPLAY_ORDER
    n = len(models)
    cols = 3
    rows = (n + cols - 1) // cols

    fig, axes = plt.subplots(rows, cols, figsize=(8, 2.5 * rows))
    axes = axes.flatten()

    for i, m in enumerate(models):
        v = per_model[m]['viability']
        cm = np.array([[v['tp'], v['fp']], [v['fn'], v['tn']]])
        ax = axes[i]
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', ax=ax,
                    xticklabels=['Viable', 'Not Viable'],
                    yticklabels=['Viable', 'Not Viable'],
                    cbar=False)
        ax.set_xlabel('Predicted', fontsize=7)
        ax.set_ylabel('Actual', fontsize=7)
        ax.set_title(f'{DISPLAY[m]}\nF1={v["f1"]:.3f}', fontsize=8)
        ax.tick_params(labelsize=6)

    # Hide unused axes
    for j in range(i + 1, len(axes)):
        axes[j].set_visible(False)

    fig.suptitle('Viability Prediction Confusion Matrices (NPV > 0)', fontsize=11, y=1.02)
    fig.tight_layout()
    save_fig(fig, 'figure7_confusion_matrices')

# ═══════════════════════════════════════════════════════════════════
# FIGURE 8: Scenario Comparison
# ═══════════════════════════════════════════════════════════════════
def figure8():
    scenarios = ['optimista', 'normal', 'pesimista', 'controlado']
    scen_labels = ['Optimista', 'Normal', 'Pesimista', 'Controlado']
    models = DISPLAY_ORDER
    n = len(models)
    x = np.arange(len(scenarios))
    width = 0.85 / n

    fig, ax = plt.subplots(figsize=(7, 3.5))
    for i, m in enumerate(models):
        accs = [per_model[m]['byScenario'][s]['accuracy'] * 100 for s in scenarios]
        offset = (i - n/2 + 0.5) * width
        ax.bar(x + offset, accs, width, label=DISPLAY[m], color=MODEL_COLORS.get(m, '#888'))

    ax.set_xticks(x)
    ax.set_xticklabels(scen_labels)
    ax.set_ylabel('Accuracy (%)')
    ax.set_title('Accuracy by Scenario')
    ax.legend(bbox_to_anchor=(1.02, 1), loc='upper left', fontsize=7)
    ax.grid(axis='y', alpha=0.3)
    fig.tight_layout()
    save_fig(fig, 'figure8_accuracy_by_scenario')


# ═══════════════════════════════════════════════════════════════════
# FIGURE 9: Project Type Heatmap
# ═══════════════════════════════════════════════════════════════════
def figure9():
    project_types = ['cafeteria', 'software', 'retail', 'construccion', 'manufactura',
                     'consultoria', 'ecommerce', 'agricultura', 'fincaRaiz', 'hospedaje']
    type_labels = ['Cafeteria', 'Software', 'Retail', 'Construction', 'Manufacturing',
                   'Consulting', 'E-commerce', 'Agriculture', 'Real Estate', 'Lodging']
    models = DISPLAY_ORDER

    data = []
    for m in models:
        row = []
        for pt in project_types:
            bt = per_model[m]['byProjectType'].get(pt, {})
            row.append(bt.get('accuracy', 0) * 100)
        data.append(row)

    df = pd.DataFrame(data, index=[DISPLAY[m] for m in models], columns=type_labels)

    fig, ax = plt.subplots(figsize=(9, 4))
    sns.heatmap(df, annot=True, fmt='.1f', cmap='YlGnBu', ax=ax,
                vmin=0, vmax=100, linewidths=0.5, cbar_kws={'label': 'Accuracy (%)'})
    ax.set_title('Model × Project Type Accuracy')
    ax.set_yticklabels(ax.get_yticklabels(), rotation=0)
    ax.set_xticklabels(ax.get_xticklabels(), rotation=30, ha='right')
    fig.tight_layout()
    save_fig(fig, 'figure9_accuracy_by_project_type')


# ═══════════════════════════════════════════════════════════════════
# TASK 79: STATISTICAL ANALYSIS
# ═══════════════════════════════════════════════════════════════════
def statistical_analysis():
    print('\n' + '=' * 70)
    print(' TASK 79: STATISTICAL ANALYSIS')
    print('=' * 70)

    models = DISPLAY_ORDER
    n = len(models)
    stat_results = {}

    # 1. Pairwise comparisons (Wilcoxon signed-rank on per-case accuracy)
    significance_matrix = {}
    for i in range(n):
        for j in range(i + 1, n):
            m1, m2 = models[i], models[j]
            col1 = case_df[m1].dropna()
            col2 = case_df[m2].dropna()
            # Align on same cases
            common = case_df.dropna(subset=[m1, m2])
            if len(common) < 10:
                continue
            a1 = common[m1].values
            a2 = common[m2].values
            try:
                stat_w, p_w = stats.wilcoxon(a1, a2, alternative='two-sided')
            except Exception:
                stat_w, p_w = 0, 1.0
            key = f'{DISPLAY[m1]} vs {DISPLAY[m2]}'
            significance_matrix[key] = {
                'statistic': float(stat_w),
                'p_value': float(p_w),
                'n_cases': len(common),
                'mean_diff': float(np.mean(a1 - a2)),
                'significant_005': p_w < 0.05,
                'significant_bonferroni': p_w < 0.05 / (n * (n - 1) / 2)
            }
    stat_results['pairwise_wilcoxon'] = significance_matrix
    print(f'  Pairwise Wilcoxon: {len(significance_matrix)} comparisons')

    # 2. Kruskal-Wallis across difficulty levels
    # Group per-case accuracy by difficulty (extract from caseId pattern)
    # We need difficulty info — get from metrics
    difficulty_groups = {}
    for m in models:
        for pc in per_model[m].get('byDifficulty', {}).items():
            pass  # Already aggregated

    # Use per-case data with difficulty mapping from metrics
    # For now, compare model accuracies across difficulty
    difficulty_analysis = {}
    for m in models:
        bd = per_model[m]['byDifficulty']
        accs = {d: bd[d]['accuracy'] * 100 for d in bd}
        difficulty_analysis[DISPLAY[m]] = accs
    stat_results['difficulty_by_model'] = difficulty_analysis

    # 3. Correlation: accuracy on one metric vs another
    metric_names = ['npv', 'irr', 'paybackPeriod', 'breakEvenPoint', 'revenue',
                    'totalCOGS', 'grossProfit', 'ebitda', 'netProfit', 'leveredCashFlow']
    metric_accs = {}
    for metric in metric_names:
        metric_accs[metric] = [per_model[m]['byMetric'].get(metric, {}).get('accuracy', 0) for m in models]

    corr_matrix = {}
    for m1 in metric_names:
        corr_matrix[m1] = {}
        for m2 in metric_names:
            r, p = stats.spearmanr(metric_accs[m1], metric_accs[m2])
            corr_matrix[m1][m2] = {'rho': round(float(r), 4) if not np.isnan(r) else 0, 'p': round(float(p), 4) if not np.isnan(p) else 1}
    stat_results['metric_correlation'] = corr_matrix
    print(f'  Metric correlation matrix: {len(metric_names)}x{len(metric_names)}')

    # 4. Group comparison (Mann-Whitney)
    prop_accs = [per_model[m]['overall']['accuracy'] * 100 for m in models if per_model[m]['group'] == 'proprietary']
    os_accs   = [per_model[m]['overall']['accuracy'] * 100 for m in models if per_model[m]['group'] == 'opensource']
    if len(prop_accs) > 1 and len(os_accs) > 1:
        stat_u, p_u = stats.mannwhitneyu(prop_accs, os_accs, alternative='two-sided')
        stat_results['group_comparison'] = {
            'test': 'Mann-Whitney U',
            'proprietary_mean': float(np.mean(prop_accs)),
            'opensource_mean': float(np.mean(os_accs)),
            'U_statistic': float(stat_u),
            'p_value': float(p_u),
            'significant': p_u < 0.05
        }
        print(f'  Group comparison: Prop={np.mean(prop_accs):.1f}% vs OS={np.mean(os_accs):.1f}%, p={p_u:.4f}')

    # 5. Case difficulty analysis
    stat_results['case_difficulty'] = {
        'hardest_10': metrics['caseDifficulty']['hardest10'],
        'easiest_10': metrics['caseDifficulty']['easiest10'],
        'universal_failures': metrics['caseDifficulty']['universalFailures'],
        'universal_successes': metrics['caseDifficulty']['universalSuccesses']
    }

    # Save (convert numpy types)
    class NpEncoder(json.JSONEncoder):
        def default(self, obj):
            if isinstance(obj, (np.integer,)): return int(obj)
            if isinstance(obj, (np.floating,)): return float(obj)
            if isinstance(obj, (np.bool_,)): return bool(obj)
            if isinstance(obj, np.ndarray): return obj.tolist()
            return super().default(obj)

    with open(REPORTS_DIR / 'statistical_results.json', 'w', encoding='utf-8') as f:
        json.dump(stat_results, f, indent=2, ensure_ascii=False, cls=NpEncoder)
    print(f'  Saved statistical_results.json')

    return stat_results


# ═══════════════════════════════════════════════════════════════════
# TASK 81: LATEX TABLES
# ═══════════════════════════════════════════════════════════════════
def generate_tables():
    print('\n' + '=' * 70)
    print(' TASK 81: LATEX TABLE GENERATION')
    print('=' * 70)

    models = DISPLAY_ORDER

    # ── Table 1: Overall Performance ──
    task_fields = ['npv', 'irr', 'paybackPeriod', 'breakEvenPoint', 'revenue', 'ebitda', 'leveredCashFlow']
    task_short  = ['NPV', 'IRR', 'Payback', 'B/E', 'Revenue', 'EBITDA', 'CF']

    rows = []
    for m in models:
        row = {'model': DISPLAY[m], 'overall': per_model[m]['overall']['accuracy'] * 100, 'mape': per_model[m]['overall']['mape']}
        for t in task_fields:
            row[t] = per_model[m]['byMetric'].get(t, {}).get('accuracy', 0) * 100
        rows.append(row)

    # Find best per column
    cols = ['overall'] + task_fields + ['mape']
    best = {}
    second = {}
    for col in cols:
        vals = sorted([(r[col], i) for i, r in enumerate(rows)], reverse=(col != 'mape'))
        best[col] = vals[0][1]
        if len(vals) > 1:
            second[col] = vals[1][1]

    def fmt_val(val, col, idx):
        if col == 'mape':
            s = f'{val:.1f}'
        else:
            s = f'{val:.1f}'
        if idx == best.get(col):
            s = f'\\textbf{{{s}}}'
        elif idx == second.get(col):
            s = f'\\underline{{{s}}}'
        return s

    tex = ['\\begin{table}[t]', '\\centering', '\\small',
           '\\caption{Overall performance of 9 LLMs on FinanceBench (1000 cases, 4 scenarios). Best \\textbf{bold}, second \\underline{underlined}.}',
           '\\label{tab:overall_performance}',
           '\\begin{tabular}{l' + 'r' * (len(task_short) + 2) + '}',
           '\\toprule',
           'Model & Overall & ' + ' & '.join(task_short) + ' & MAPE \\\\',
           '\\midrule']
    for i, r in enumerate(rows):
        cells = [r['model'], fmt_val(r['overall'], 'overall', i)]
        for t in task_fields:
            cells.append(fmt_val(r[t], t, i))
        cells.append(fmt_val(r['mape'], 'mape', i))
        tex.append(' & '.join(cells) + ' \\\\')
    tex += ['\\bottomrule', '\\end{tabular}', '\\end{table}']

    with open(TABLES_DIR / 'table1_overall_performance.tex', 'w') as f:
        f.write('\n'.join(tex))

    # CSV backup
    with open(TABLES_DIR / 'table1_overall_performance.csv', 'w', newline='') as f:
        w = csv.writer(f)
        w.writerow(['Model', 'Overall'] + task_short + ['MAPE'])
        for r in rows:
            w.writerow([r['model'], f"{r['overall']:.1f}"] + [f"{r[t]:.1f}" for t in task_fields] + [f"{r['mape']:.1f}"])
    print('  Saved table1_overall_performance.tex + .csv')

    # ── Table 3: Error Type Distribution ──
    error_types = ['arithmetic', 'conceptual', 'hallucination', 'null_mismatch']
    err_labels  = ['Arith.', 'Concept.', 'Halluc.', 'Null']

    tex3 = ['\\begin{table}[t]', '\\centering', '\\small',
            '\\caption{Error type distribution across models (\\% of total errors).}',
            '\\label{tab:error_types}',
            '\\begin{tabular}{l' + 'r' * (len(err_labels) + 1) + '}',
            '\\toprule',
            'Model & ' + ' & '.join(err_labels) + ' & Total Err. \\\\',
            '\\midrule']
    for m in models:
        errs = per_model[m]['errorTypes']
        total = sum(errs.values())
        cells = [DISPLAY[m]]
        for et in error_types:
            pct = errs.get(et, 0) / total * 100 if total > 0 else 0
            cells.append(f'{pct:.1f}')
        cells.append(f'{total:,}')
        tex3.append(' & '.join(cells) + ' \\\\')
    tex3 += ['\\bottomrule', '\\end{tabular}', '\\end{table}']

    with open(TABLES_DIR / 'table3_error_types.tex', 'w') as f:
        f.write('\n'.join(tex3))
    print('  Saved table3_error_types.tex')

    # ── Table 4: Performance by Project Type ──
    project_types = ['cafeteria', 'software', 'retail', 'construccion', 'manufactura',
                     'consultoria', 'ecommerce', 'agricultura', 'fincaRaiz', 'hospedaje']
    pt_short = ['Cafe', 'Soft', 'Ret', 'Const', 'Manuf', 'Cons', 'Ecom', 'Agri', 'RE', 'Lodg']

    tex4 = ['\\begin{table}[t]', '\\centering', '\\scriptsize',
            '\\caption{Accuracy (\\%) by project type. Best per column in \\textbf{bold}.}',
            '\\label{tab:by_project_type}',
            '\\begin{tabular}{l' + 'r' * len(pt_short) + '}',
            '\\toprule',
            'Model & ' + ' & '.join(pt_short) + ' \\\\',
            '\\midrule']

    # Find best per project type
    pt_best = {}
    for pi, pt in enumerate(project_types):
        best_acc = -1
        best_idx = -1
        for mi, m in enumerate(models):
            acc = per_model[m]['byProjectType'].get(pt, {}).get('accuracy', 0) * 100
            if acc > best_acc:
                best_acc = acc
                best_idx = mi
        pt_best[pt] = best_idx

    for mi, m in enumerate(models):
        cells = [DISPLAY[m]]
        for pi, pt in enumerate(project_types):
            acc = per_model[m]['byProjectType'].get(pt, {}).get('accuracy', 0) * 100
            s = f'{acc:.1f}'
            if mi == pt_best.get(pt):
                s = f'\\textbf{{{s}}}'
            cells.append(s)
        tex4.append(' & '.join(cells) + ' \\\\')
    tex4 += ['\\bottomrule', '\\end{tabular}', '\\end{table}']

    with open(TABLES_DIR / 'table4_by_project_type.tex', 'w') as f:
        f.write('\n'.join(tex4))
    print('  Saved table4_by_project_type.tex')


# ═══════════════════════════════════════════════════════════════════
# CAPTIONS FILE
# ═══════════════════════════════════════════════════════════════════
def generate_captions():
    best = rankings['overall'][0]
    worst = rankings['overall'][-1]

    captions = f"""% Figure captions for FinanceBench paper
% Auto-generated by generateVisuals.py

% Figure 1
\\caption{{Overall accuracy (\\%) of nine LLMs on FinanceBench across 1000 financial viability cases.
{best['displayName']} achieves the highest accuracy at {best['accuracy']*100:.1f}\\%, while
{worst['displayName']} shows the lowest at {worst['accuracy']*100:.1f}\\%.}}
\\label{{fig:overall}}

% Figure 2
\\caption{{Accuracy by financial metric across all models. Grouped bars show per-model accuracy
for each of 10 metric categories.}}
\\label{{fig:by_task}}

% Figure 3
\\caption{{Heatmap of model accuracy across 10 financial metrics. Darker colors indicate higher
accuracy. Models sorted by overall performance (top = best).}}
\\label{{fig:heatmap}}

% Figure 4
\\caption{{Distribution of error types across models. Arithmetic errors (wrong calculation),
conceptual errors (wrong formula), hallucinations (invented values), and null mismatches.}}
\\label{{fig:errors}}

% Figure 5
\\caption{{Comparison of proprietary (7 models) vs open-source (2 models) performance.
Individual points colored by model.}}
\\label{{fig:prop_vs_os}}

% Figure 6
\\caption{{Accuracy by case difficulty level (simple, medium, complex) across all models.}}
\\label{{fig:difficulty}}

% Figure 7
\\caption{{Confusion matrices for viability prediction (NPV > 0) across all nine models.
F1 scores shown per model.}}
\\label{{fig:confusion}}

% Figure 8
\\caption{{Accuracy by financial scenario (optimista, normal, pesimista, controlado).}}
\\label{{fig:scenarios}}

% Figure 9
\\caption{{Accuracy by project type across all models. Ten Colombian business types evaluated.}}
\\label{{fig:project_types}}
"""
    with open(FIGURES_DIR / 'captions.tex', 'w') as f:
        f.write(captions)
    print('  Saved captions.tex')


# ═══════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════
if __name__ == '__main__':
    print('=' * 70)
    print(' TASKS 79, 80, 81: STATISTICS, FIGURES, TABLES')
    print('=' * 70)

    # Task 79: Statistical analysis
    stat_results = statistical_analysis()

    # Task 80: Figures
    print('\n' + '=' * 70)
    print(' TASK 80: FIGURE GENERATION')
    print('=' * 70)
    figure1()
    figure2()
    figure3()
    figure4()
    figure5()
    figure6()
    figure7()
    figure8()
    figure9()
    generate_captions()

    # Task 81: Tables
    generate_tables()

    print('\n' + '=' * 70)
    print(' ALL DONE')
    print('=' * 70)
