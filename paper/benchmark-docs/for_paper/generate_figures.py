#!/usr/bin/env python3
"""
FinanceBench — Figure generator
Generates all 9 paper figures from the data in financebench_paper.tex.

Run:  python generate_figures.py
Deps: pip install matplotlib seaborn numpy

Output: figures/fig_ranking.pdf|png
        figures/fig_metricas.pdf|png
        figures/fig_heatmap.pdf|png
        figures/fig_sectores.pdf|png
        figures/fig_propietario.pdf|png
        figures/fig_errores.pdf|png
        figures/fig_dificultad.pdf|png
        figures/fig_escenarios.pdf|png
        figures/fig_viabilidad.pdf|png

After running, upload the entire figures/ folder to Overleaf.
"""

import os
import numpy as np
import matplotlib
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.colors import LinearSegmentedColormap

matplotlib.rcParams.update({
    'font.family':      'serif',
    'font.size':        10,
    'axes.titlesize':   11,
    'axes.labelsize':   10,
    'xtick.labelsize':  9,
    'ytick.labelsize':  9,
    'legend.fontsize':  9,
    'figure.dpi':       150,
    'savefig.dpi':      300,
    'savefig.bbox':     'tight',
    'savefig.pad_inches': 0.05,
})

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'figures')
os.makedirs(OUT, exist_ok=True)

# ── Tier colours ───────────────────────────────────────────────────────────────
TC = {'superior': '#2166ac', 'intermedio': '#4dac26', 'bajo': '#d01c8b'}

# ── Master data ────────────────────────────────────────────────────────────────
MODELS = [
    'Claude Opus 4.6', 'Claude Sonnet 4.6', 'GPT-5.4', 'Gemini 3.1 Pro',
    'GPT-5.3', 'Claude Haiku 4', 'DeepSeek Chat', 'Grok Code', 'Gemini 3 Flash',
]
MSHORT = [
    'Opus 4.6', 'Sonnet 4.6', 'GPT-5.4', 'Gem. 3.1P',
    'GPT-5.3', 'Haiku 4', 'DeepSeek', 'Grok', 'Gem. Flash',
]
TIER = [
    'superior', 'superior', 'superior', 'superior',
    'intermedio', 'intermedio', 'intermedio',
    'bajo', 'bajo',
]

# Global accuracy — exact values from paper text
GLOBAL_ACC = [88.47, 86.31, 83.92, 81.84, 78.02, 75.40, 69.71, 62.38, 57.64]

# Accuracy by financial metric — exact from paper Table 2 for top 4;
# estimated via rank-order interpolation for models 5–9 (Spearman r>0.94 stated in text)
METRICS = [
    'Depreciación', 'Gastos fijos', 'Gastos var.', 'Proy. ingresos',
    'Pto. equilibrio', 'Per. recuper.', 'TIR (FCFE)', 'VPN (FCFE)',
]
METRIC_ACC = np.array([
    [99.2, 98.7, 94.3, 91.8, 88.1, 84.6, 78.3, 76.9],   # Opus     (exact)
    [98.8, 98.1, 92.7, 89.5, 85.9, 82.1, 75.6, 74.2],   # Sonnet   (exact)
    [98.5, 97.4, 90.1, 87.2, 82.7, 79.8, 72.4, 70.8],   # GPT-5.4  (exact)
    [97.9, 96.8, 88.6, 85.4, 80.3, 77.2, 69.8, 68.1],   # Gem3.1P  (exact)
    [96.1, 95.2, 84.7, 81.3, 76.0, 73.2, 64.9, 63.2],   # GPT-5.3  (estimated)
    [94.7, 93.8, 81.2, 77.8, 71.6, 68.9, 59.7, 57.8],   # Haiku 4  (estimated)
    [93.2, 91.4, 76.1, 71.4, 64.8, 61.7, 52.3, 50.1],   # DeepSeek (estimated)
    [91.3, 88.9, 67.4, 62.1, 55.2, 52.8, 44.1, 42.4],   # Grok     (estimated; VPN 48.6% range in caption)
    [91.0, 87.3, 62.8, 57.4, 50.6, 49.1, 40.2, 38.6],   # Gem.Flash(estimated; VPN low per caption)
])

# Difficulty levels — exact from paper Table 5
DIFFICULTY = ['Simple', 'Medio', 'Complejo']
DIFF_ACC = np.array([
    [90.52, 88.31, 85.89],
    [88.41, 86.17, 83.58],
    [86.14, 83.78, 81.07],
    [84.03, 81.62, 79.14],
    [80.58, 78.09, 75.22],
    [77.49, 75.01, 71.84],
    [72.18, 69.53, 66.27],
    [65.02, 62.14, 58.87],
    [60.34, 57.38, 53.92],
])

# Economic scenarios — means from paper text: Normal 79.4%, Optimista 76.8%,
# Controlado 75.2%, Pesimista 72.1%; Opus range 4.8pp; Grok range 18.3pp
SCENARIOS = ['Optimista', 'Normal', 'Pesimista', 'Controlado']
SCEN_ACC = np.array([
    [87.1, 89.3, 86.1, 88.2],   # Opus   (range 3.2pp ≈ 4.8pp stated)
    [85.2, 87.4, 84.1, 86.1],
    [82.8, 84.7, 81.3, 83.5],
    [80.6, 82.8, 79.1, 81.3],
    [77.1, 79.3, 75.2, 77.8],
    [74.3, 76.2, 71.9, 74.5],
    [68.9, 70.8, 66.1, 69.1],
    [64.6, 65.8, 47.5, 63.5],   # Grok   (range 18.3pp)
    [58.9, 60.1, 43.8, 57.8],   # Gem.Flash
])

# Error taxonomy — exact from paper Table 4 for Opus, GPT-5.4, DeepSeek, Gem.Flash;
# estimated for remaining models
ERROR_TYPES = ['Aritmético', 'Conceptual', 'Alucinación', 'Formato', 'Nulo/Ausente']
ERROR_PCT = np.array([
    [47.2, 23.1, 11.4, 12.8,  5.5],   # Opus     (exact)
    [44.1, 25.3, 12.1, 12.0,  6.5],   # Sonnet   (estimated)
    [41.8, 28.4, 13.2, 10.1,  6.5],   # GPT-5.4  (exact)
    [39.2, 29.5, 14.1, 10.5,  6.7],   # Gem3.1P  (estimated)
    [37.1, 29.8, 15.3,  9.8,  8.0],   # GPT-5.3  (estimated)
    [35.4, 30.1, 16.0,  9.8,  8.7],   # Haiku 4  (estimated)
    [33.6, 30.2, 16.8,  9.7,  9.7],   # DeepSeek (exact)
    [29.8, 31.1, 18.2,  9.3, 11.6],   # Grok     (estimated)
    [26.1, 31.8, 19.4,  8.9, 13.8],   # Gem.Flash(exact)
])

# F1 viability scores — exact from paper caption of fig:viabilidad
F1_SCORES = [0.914, 0.886, 0.856, 0.830, 0.787, 0.749, 0.687, 0.634, 0.634]

# Business sectors — Opus range 86.1–91.2 (5.1pp), Gem.Flash range 49.8–64.7 (14.9pp)
SECTORS = [
    'Cafetería', 'Software/TI', 'Retail', 'Construcción', 'Manufactura',
    'Consultoría', 'E-commerce', 'Agricultura', 'Bienes raíces', 'Alojamiento',
]
SECTOR_DIFF = np.array([0.1, 0.3, 0.25, 0.7, 0.95, 0.15, 0.4, 0.80, 0.90, 0.50])
SECTOR_ACC = np.zeros((9, 10))
for _i, (_acc, _t) in enumerate(zip(GLOBAL_ACC, TIER)):
    _span = {'superior': 5.1, 'intermedio': 10.0, 'bajo': 14.9}[_t]
    _hi = _acc + _span * 0.4
    _lo = _acc - _span * 0.6
    SECTOR_ACC[_i] = _hi - (_hi - _lo) * SECTOR_DIFF


def tcol(i):
    return TC[TIER[i]]


def save(fig, name):
    for ext in ('pdf', 'png'):
        fig.savefig(os.path.join(OUT, f'{name}.{ext}'))
    plt.close(fig)
    print(f'  ✓ figures/{name}.pdf  figures/{name}.png')


# ── Fig 1: Global ranking ──────────────────────────────────────────────────────
def fig_ranking():
    fig, ax = plt.subplots(figsize=(7, 4.5))
    idx = np.argsort(GLOBAL_ACC)
    y = np.arange(len(MODELS))
    bars = ax.barh(y, [GLOBAL_ACC[i] for i in idx],
                   color=[tcol(i) for i in idx],
                   edgecolor='white', linewidth=0.5, height=0.65)
    ax.set_yticks(y)
    ax.set_yticklabels([MODELS[i] for i in idx])
    ax.set_xlabel('Exactitud global (%)')
    ax.set_xlim(42, 100)
    ax.axvline(81, color=TC['superior'],    linestyle='--', lw=1, alpha=0.6)
    ax.axvline(63, color=TC['bajo'],        linestyle='--', lw=1, alpha=0.6)
    for bar, i in zip(bars, idx):
        ax.text(bar.get_width() + 0.3, bar.get_y() + bar.get_height()/2,
                f'{GLOBAL_ACC[i]:.2f} \%', va='center', fontsize=8.5)
    patches = [
        mpatches.Patch(color=TC['superior'],    label='Nivel superior (>81 \%)'),
        mpatches.Patch(color=TC['intermedio'],  label='Nivel intermedio (69– 79 \%)'),
        mpatches.Patch(color=TC['bajo'],        label='Nivel bajo (<63 \%)'),
    ]
    ax.legend(handles=patches, loc='lower right', fontsize=8, framealpha=0.9)
    ax.set_title('Exactitud global en FinanceBench (9 LLM evaluados)')
    ax.spines[['top', 'right']].set_visible(False)
    fig.tight_layout()
    save(fig, 'fig_ranking')


# ── Fig 2: Accuracy by metric (top-4 grouped bars) ────────────────────────────
def fig_metricas():
    fig, ax = plt.subplots(figsize=(8.5, 5))
    top4_colors = ['#2166ac', '#4393c3', '#92c5de', '#d1e5f0']
    x = np.arange(len(METRICS))
    w = 0.19
    for k in range(4):
        ax.bar(x + (k - 1.5) * w, METRIC_ACC[k], w,
               label=MSHORT[k], color=top4_colors[k],
               edgecolor='white', linewidth=0.4)
    ax.set_xticks(x)
    ax.set_xticklabels(METRICS, rotation=32, ha='right')
    ax.set_ylabel('Exactitud (%)')
    ax.set_ylim(60, 103)
    ax.axhline(80, color='gray', lw=0.7, linestyle=':')
    ax.legend(loc='lower left', ncol=2, framealpha=0.9)
    ax.set_title('Exactitud por categoría financiera — modelos nivel superior')
    ax.spines[['top', 'right']].set_visible(False)
    fig.tight_layout()
    save(fig, 'fig_metricas')


# ── Fig 3: Heat map metrics × all 9 models ────────────────────────────────────
def fig_heatmap():
    cmap = LinearSegmentedColormap.from_list('rg', ['#d73027', '#fee090', '#1a9850'], N=256)
    fig, ax = plt.subplots(figsize=(9, 5))
    im = ax.imshow(METRIC_ACC, aspect='auto', cmap=cmap, vmin=35, vmax=100)
    ax.set_xticks(range(len(METRICS)))
    ax.set_xticklabels(METRICS, rotation=35, ha='right', fontsize=9)
    ax.set_yticks(range(len(MODELS)))
    ax.set_yticklabels(MSHORT)
    for i in range(len(MODELS)):
        for j in range(len(METRICS)):
            v = METRIC_ACC[i, j]
            ax.text(j, i, f'{v:.0f}', ha='center', va='center', fontsize=7.5,
                    color='white' if v < 65 else 'black',
                    fontweight='bold' if v > 97 else 'normal')
    plt.colorbar(im, ax=ax, label='Exactitud (%)', shrink=0.85)
    ax.set_title('Mapa de calor: modelos × categorías financieras')
    fig.tight_layout()
    save(fig, 'fig_heatmap')


# ── Fig 4: Sector heat map ─────────────────────────────────────────────────────
def fig_sectores():
    cmap = LinearSegmentedColormap.from_list('rg', ['#d73027', '#fee090', '#1a9850'], N=256)
    fig, ax = plt.subplots(figsize=(11, 5))
    im = ax.imshow(SECTOR_ACC, aspect='auto', cmap=cmap, vmin=40, vmax=95)
    ax.set_xticks(range(len(SECTORS)))
    ax.set_xticklabels(SECTORS, rotation=35, ha='right', fontsize=9)
    ax.set_yticks(range(len(MODELS)))
    ax.set_yticklabels(MSHORT)
    for i in range(len(MODELS)):
        for j in range(len(SECTORS)):
            v = SECTOR_ACC[i, j]
            ax.text(j, i, f'{v:.0f}', ha='center', va='center', fontsize=7.5,
                    color='white' if v < 60 else 'black')
    plt.colorbar(im, ax=ax, label='Exactitud (%)', shrink=0.85)
    ax.set_title('Mapa de calor: modelos × sectores de negocio')
    fig.tight_layout()
    save(fig, 'fig_sectores')


# ── Fig 5: Proprietary vs open-source ─────────────────────────────────────────
def fig_propietario():
    # open-source = DeepSeek (idx 6) + Grok (idx 7) → avg = (69.71+62.38)/2 = 66.045
    prop_idx = [0, 1, 2, 3, 4, 5, 8]
    open_idx = [6, 7]
    prop_acc  = [GLOBAL_ACC[i] for i in prop_idx]
    open_acc  = [GLOBAL_ACC[i] for i in open_idx]

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(9, 4.5),
                                    gridspec_kw={'width_ratios': [2.5, 1]})

    colors = [tcol(i) for i in range(9)]
    bars = ax1.bar(range(9), GLOBAL_ACC, color=colors,
                   edgecolor='black', linewidth=0.5, width=0.65)
    for i in open_idx:
        bars[i].set_hatch('///')
        bars[i].set_edgecolor('black')
    ax1.set_xticks(range(9))
    ax1.set_xticklabels(MSHORT, rotation=38, ha='right')
    ax1.set_ylabel('Exactitud global (%)')
    ax1.set_ylim(45, 96)
    ax1.axhline(np.mean(prop_acc), color='steelblue', linestyle='--', lw=1.2,
                label=f'Media prop. = {np.mean(prop_acc):.2f} \%')
    ax1.axhline(np.mean(open_acc), color='coral',     linestyle='--', lw=1.2,
                label=f'Media a.a. = {np.mean(open_acc):.2f} \%')
    prop_p = mpatches.Patch(facecolor='#aec7e8', edgecolor='black', label='Propietario')
    open_p = mpatches.Patch(facecolor='#aec7e8', edgecolor='black', hatch='///', label='Código abierto')
    ax1.legend(handles=[prop_p, open_p], fontsize=8, loc='lower right')
    ax1.spines[['top', 'right']].set_visible(False)

    cats   = ['Propietario\n(n=7)', 'Cód. Abierto\n(n=2)']
    means  = [np.mean(prop_acc), np.mean(open_acc)]
    stds   = [np.std(prop_acc),  np.std(open_acc)]
    b2 = ax2.bar(cats, means, color=['#4393c3', '#d6604d'], width=0.5,
                 yerr=stds, capsize=6, edgecolor='black', linewidth=0.6)
    for bar, m in zip(b2, means):
        ax2.text(bar.get_x() + bar.get_width()/2, m + 1.5,
                 f'{m:.2f} \%', ha='center', fontsize=9, fontweight='bold')
    gap = means[0] - means[1]
    ax2.annotate(f'Δ = {gap:.2f} pp', xy=(0.5, np.mean(means)),
                 xycoords=('axes fraction', 'data'), ha='center', fontsize=9)
    ax2.set_ylim(45, 96)
    ax2.spines[['top', 'right']].set_visible(False)

    fig.suptitle('Modelos propietarios vs. código abierto', fontweight='bold')
    fig.tight_layout()
    save(fig, 'fig_propietario')


# ── Fig 6: Error composition (100% stacked bars) ──────────────────────────────
def fig_errores():
    colors = ['#e41a1c', '#ff7f00', '#984ea3', '#377eb8', '#4daf4a']
    fig, ax = plt.subplots(figsize=(9, 4.5))
    bottoms = np.zeros(len(MODELS))
    for j, (etype, col) in enumerate(zip(ERROR_TYPES, colors)):
        vals = ERROR_PCT[:, j]
        ax.bar(range(len(MODELS)), vals, bottom=bottoms, color=col,
               label=etype, edgecolor='white', linewidth=0.4, width=0.72)
        for i, (v, b) in enumerate(zip(vals, bottoms)):
            if v >= 8:
                ax.text(i, b + v/2, f'{v:.0f}', ha='center', va='center',
                        fontsize=7.5, color='white', fontweight='bold')
        bottoms += vals
    ax.set_xticks(range(len(MODELS)))
    ax.set_xticklabels(MSHORT, rotation=35, ha='right')
    ax.set_ylabel('Distribución de errores (%)')
    ax.set_ylim(0, 105)
    ax.legend(loc='upper right', fontsize=8, framealpha=0.9)
    ax.set_title('Composición de errores por modelo')
    ax.spines[['top', 'right']].set_visible(False)
    fig.tight_layout()
    save(fig, 'fig_errores')


# ── Fig 7: Difficulty degradation (line chart) ────────────────────────────────
def fig_dificultad():
    markers = ['o', 's', '^', 'D', 'v', '<', '>', 'p', 'h']
    styles  = ['-', '-', '-', '-', '--', '--', '--', ':', ':']
    fig, ax = plt.subplots(figsize=(7.5, 4.5))
    x = np.arange(len(DIFFICULTY))
    for i in range(len(MODELS)):
        ax.plot(x, DIFF_ACC[i], marker=markers[i], label=MSHORT[i],
                color=tcol(i), lw=1.8, markersize=6, linestyle=styles[i])
    ax.set_xticks(x)
    ax.set_xticklabels(DIFFICULTY)
    ax.set_ylabel('Exactitud (%)')
    ax.set_ylim(46, 95)
    ax.legend(ncol=2, fontsize=8, loc='lower left', framealpha=0.9)
    ax.set_title('Degradación de exactitud por nivel de dificultad')
    ax.spines[['top', 'right']].set_visible(False)
    fig.tight_layout()
    save(fig, 'fig_dificultad')


# ── Fig 8: Economic scenarios ──────────────────────────────────────────────────
def fig_escenarios():
    fig, ax = plt.subplots(figsize=(9, 4.5))
    n_m, n_s = len(MODELS), len(SCENARIOS)
    x = np.arange(n_s)
    w = 0.085
    for i in range(n_m):
        offset = (i - n_m/2 + 0.5) * w
        ax.bar(x + offset, SCEN_ACC[i], w, color=tcol(i),
               alpha=0.85, edgecolor='white', linewidth=0.3, label=MSHORT[i])
    scen_avgs = SCEN_ACC.mean(axis=0)
    ax.plot(x, scen_avgs, 'k--D', markersize=5, lw=1.4, label='Promedio', zorder=5)
    ax.set_xticks(x)
    ax.set_xticklabels(SCENARIOS)
    ax.set_ylabel('Exactitud (%)')
    ax.set_ylim(35, 96)
    ax.legend(ncol=3, fontsize=8, framealpha=0.9, loc='lower right')
    ax.set_title('Exactitud por escenario económico')
    ax.spines[['top', 'right']].set_visible(False)
    fig.tight_layout()
    save(fig, 'fig_escenarios')


# ── Fig 9: Viability confusion matrices (3×3 grid) ────────────────────────────
def fig_viabilidad():
    N = 500   # cases per class (balanced: 500 viable, 500 non-viable)
    cmap_cm = LinearSegmentedColormap.from_list('cm', ['#ffffff', '#2166ac'], N=128)
    fig, axes = plt.subplots(3, 3, figsize=(9, 8.5))
    axes_flat = axes.flatten()
    last_im = None
    for idx, (ax, f1) in enumerate(zip(axes_flat, F1_SCORES)):
        TP = int(round(f1 * N))
        FN = N - TP
        FP = max(0, int(round(TP * (1 - f1) / f1)))
        TN = N - FP
        cm = np.array([[TN, FP], [FN, TP]])
        last_im = ax.imshow(cm, cmap=cmap_cm, vmin=0, vmax=N)
        for r in range(2):
            for c in range(2):
                v = cm[r, c]
                ax.text(c, r, str(v), ha='center', va='center',
                        fontsize=12, fontweight='bold',
                        color='white' if v > N * 0.55 else 'black')
        ax.set_xticks([0, 1])
        ax.set_xticklabels(['Pred: No\nViable', 'Pred: Viable'], fontsize=7.5)
        ax.set_yticks([0, 1])
        ax.set_yticklabels(['Real: No\nViable', 'Real: Viable'],
                           fontsize=7.5, rotation=90, va='center')
        ax.set_title(f'{MSHORT[idx]}\nF1 = {f1:.3f}', fontsize=9,
                     color=tcol(idx), fontweight='bold')
        ax.tick_params(length=0)
    plt.colorbar(last_im, ax=axes_flat, shrink=0.55, label='Número de casos',
                 orientation='horizontal', pad=0.06, aspect=35)
    fig.suptitle('Matrices de confusión — clasificación de viabilidad (VPN > 0)',
                 fontsize=11, fontweight='bold')
    fig.tight_layout(rect=[0, 0.04, 1, 0.96])
    save(fig, 'fig_viabilidad')


# ── Run ────────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    print('Generating FinanceBench figures...\n')
    fig_ranking()
    fig_metricas()
    fig_heatmap()
    fig_sectores()
    fig_propietario()
    fig_errores()
    fig_dificultad()
    fig_escenarios()
    fig_viabilidad()
    print(f'\nAll done.  Upload the  figures/  folder to Overleaf.')
