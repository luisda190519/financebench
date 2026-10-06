# Task 80 — Visualization Generation (Publication-Quality)

## Objective
Generate 8+ publication-ready figures for academic paper (NeurIPS/AAAI quality).

## Dependencies
- Task 78 (metrics data)
- Task 79 (statistical results)

---

## Styling Standards

| Property | Specification |
|----------|--------------|
| Resolution | 300 DPI (raster), vector (PDF primary) |
| Font | DejaVu Sans or Computer Modern (LaTeX-compatible) |
| Font size | 10–12pt minimum for axis labels, 8pt minimum for annotations |
| Color palette | Colorblind-friendly (IBM Design or Tol's qualitative) |
| Export formats | PDF (primary, vector) + PNG (backup, 300 DPI) |
| Dimensions | Single-column: 3.5" wide; Double-column: 7" wide |
| Grid | Light gray gridlines for readability |
| Legend | Clear, no overlap with data |

### Color Palette (9 models)
```python
MODEL_COLORS = {
    'GPT-5.4':           '#648FFF',  # Blue
    'GPT-5.3':           '#785EF0',  # Purple
    'Claude Opus 4.6':   '#DC267F',  # Magenta
    'Claude Sonnet 4.6': '#FE6100',  # Orange
    'Claude Haiku 4':    '#FFB000',  # Gold
    'Gemini 3.1 Pro':    '#009E73',  # Teal
    'Gemini 3 Flash':    '#56B4E9',  # Light blue
    'DeepSeek Chat':     '#E69F00',  # Amber
    'Grok Code':         '#CC79A7',  # Pink
}
```

---

## Figures

### Figure 1: Overall Performance Bar Chart
- **File**: `docs/benchmark/figures/figure1_overall_accuracy.pdf`
- **Type**: Horizontal bar chart (sorted by accuracy, best at top)
- **X-axis**: Overall accuracy (%)
- **Y-axis**: 9 models (display names, not folder names)
- **Annotations**: Exact accuracy % at end of each bar
- **Error bars**: 95% confidence intervals (Wilson score interval)
- **Highlight**: Color-code proprietary (blue tones) vs open-source (warm tones)
- **Size**: Single-column (3.5" × 3")

### Figure 2: Performance by Task Category (Grouped Bar Chart)
- **File**: `docs/benchmark/figures/figure2_accuracy_by_task.pdf`
- **Type**: Grouped bar chart
- **X-axis**: Task categories: NPV, IRR, Payback Period, Break-Even, Revenue, COGS, Gross Profit, EBITDA, Net Profit, Cash Flow
- **Y-axis**: Accuracy (%)
- **Grouping**: One bar per model, 9 bars per category
- **Size**: Double-column (7" × 4")
- **Note**: If 9×10 bars is too dense, split into 2 panels or use heatmap (Figure 3) as primary

### Figure 3: Heatmap — Model × Task Performance
- **File**: `docs/benchmark/figures/figure3_performance_heatmap.pdf`
- **Type**: Annotated heatmap
- **Rows**: 9 models (sorted by overall accuracy)
- **Columns**: 10+ metric categories (NPV, IRR, payback, breakEven, revenue, COGS, grossProfit, EBITDA, netProfit, leveredCashFlow)
- **Color**: Sequential colormap (white → deep blue), 0–100% accuracy
- **Annotations**: Accuracy % in each cell
- **Size**: Double-column (7" × 3.5")
- **Library**: `seaborn.heatmap()` with `annot=True, fmt='.1f'`

### Figure 4: Error Type Distribution (Stacked Bar)
- **File**: `docs/benchmark/figures/figure4_error_types.pdf`
- **Type**: 100% stacked bar chart
- **X-axis**: 9 models
- **Y-axis**: Percentage of errors (0–100%)
- **Stacks**: Arithmetic (light), Conceptual (medium), Hallucination (dark), Format (hatched)
- **Size**: Single-column (3.5" × 3")
- **Legend**: Below chart, horizontal

### Figure 5: Proprietary vs Open-Source Box Plot
- **File**: `docs/benchmark/figures/figure5_proprietary_vs_opensource.pdf`
- **Type**: Box plot with individual points (strip/swarm overlay)
- **X-axis**: Two groups: "Proprietary" (7 models) and "Open-Source" (2 models)
- **Y-axis**: Per-case accuracy distribution
- **Annotations**: Statistical significance bracket with p-value (from Mann-Whitney U)
- **Individual points**: Jittered, semi-transparent, colored by model
- **Size**: Single-column (3.5" × 3.5")

### Figure 6: Scatter Plot — Model Size vs Accuracy
- **File**: `docs/benchmark/figures/figure6_size_vs_accuracy.pdf`
- **Type**: Scatter plot with trend line
- **X-axis**: Approximate model parameters (log scale)
- **Y-axis**: Overall accuracy (%)
- **Points**: Each model as a labeled point (with model name annotation)
- **Trend**: Linear regression line with R² annotation
- **Note**: Use best-available parameter estimates; mark uncertain values with (?)
- **Size**: Single-column (3.5" × 3")

### Figure 7: Confusion Matrices for Viability Predictions
- **File**: `docs/benchmark/figures/figure7_confusion_matrices.pdf`
- **Type**: 3×3 grid of confusion matrices (top 9 models, or combine into single figure)
- **Per matrix**: 2×2 (Viable/Not Viable), color-coded by count
- **Annotations**: Count in each cell, precision/recall/F1 below each matrix
- **Size**: Double-column (7" × 7") or selectively show top 3 + worst 1
- **Alternative**: Single combined figure with model name as subplot title

### Figure 8: Error Distribution Histogram
- **File**: `docs/benchmark/figures/figure8_error_distribution.pdf`
- **Type**: Overlaid KDE (kernel density estimate) curves or histogram
- **X-axis**: Percentage error bins (0%, 1%, 5%, 10%, 25%, 50%, 100%+) — log scale
- **Y-axis**: Density / frequency
- **Curves**: One per model (colored, semi-transparent)
- **Size**: Double-column (7" × 3.5")
- **Inset**: Zoomed view of 0–5% range (where most data concentrates)

---

## Additional Figures (if data warrants)

### Figure 9 (optional): Performance by Difficulty Level
- Grouped bar: Simple vs Medium vs Complex, per model
- Shows how models degrade with increasing complexity

### Figure 10 (optional): Scenario Comparison Radar Chart
- Spider/radar chart per model showing accuracy across 4 scenarios
- Reveals scenario-specific strengths

---

## Implementation

**Technology**: Python 3 with matplotlib + seaborn

```python
import matplotlib.pyplot as plt
import matplotlib
import seaborn as sns
import numpy as np
import json

matplotlib.rcParams.update({
    'font.family': 'DejaVu Sans',
    'font.size': 10,
    'axes.labelsize': 11,
    'axes.titlesize': 12,
    'xtick.labelsize': 9,
    'ytick.labelsize': 9,
    'legend.fontsize': 9,
    'figure.dpi': 300,
    'savefig.dpi': 300,
    'savefig.bbox': 'tight',
    'savefig.pad_inches': 0.1,
})
```

**Script**: `Backend/benchmark/scripts/generateFigures.py` (new)

---

## Output
- `docs/benchmark/figures/figure1_overall_accuracy.pdf` + `.png`
- `docs/benchmark/figures/figure2_accuracy_by_task.pdf` + `.png`
- `docs/benchmark/figures/figure3_performance_heatmap.pdf` + `.png`
- `docs/benchmark/figures/figure4_error_types.pdf` + `.png`
- `docs/benchmark/figures/figure5_proprietary_vs_opensource.pdf` + `.png`
- `docs/benchmark/figures/figure6_size_vs_accuracy.pdf` + `.png`
- `docs/benchmark/figures/figure7_confusion_matrices.pdf` + `.png`
- `docs/benchmark/figures/figure8_error_distribution.pdf` + `.png`
- `docs/benchmark/figures/captions.md` — LaTeX-ready captions for each figure

## Acceptance Criteria
- [ ] All 8 figures generated in PDF + PNG
- [ ] Colorblind-friendly palette used
- [ ] Fonts ≥ 10pt, axis labels clear
- [ ] Error bars / confidence intervals where applicable
- [ ] Figures render correctly at single-column (3.5") and double-column (7") widths
- [ ] Captions file with LaTeX `\caption{}` for each
