# Task 79 — Statistical Analysis

## Objective
Perform rigorous statistical tests to determine significance of performance differences between models.

## Dependencies
- Task 78 (metrics data)

---

## Analysis Plan

### 1. Pairwise Model Comparisons

**Goal**: Determine which models significantly outperform others.

**Method — McNemar's Test** (for binary accuracy):
- For each pair of models (36 pairs from 9 models):
  - Build 2×2 contingency table: cases where Model A correct/incorrect vs Model B correct/incorrect
  - Apply McNemar's test (chi-squared with continuity correction)
  - Report p-value and effect size (odds ratio)
- Apply **Bonferroni correction** for multiple comparisons (α = 0.05/36 = 0.00139)

**Method — Paired t-test** (for continuous error):
- For each model pair, compare percentage errors across all 1000 cases
- Test H₀: mean error difference = 0
- Report: t-statistic, p-value, 95% CI of mean difference
- Use **Wilcoxon signed-rank test** as non-parametric alternative (errors likely non-normal)

**Output**: 9×9 significance matrix with p-values, annotated with *, **, *** for p < 0.05, 0.01, 0.001

### 2. Correlation Analysis

**Spearman rank correlation**:
- Model accuracy on Task A vs Task B (do models that excel at NPV also excel at IRR?)
- Correlation matrix across all metric categories
- Identify clusters of related tasks

**Pearson correlation** (if approximately normal):
- Error magnitudes across scenarios (do errors in optimista predict errors in pesimista?)

**Model size vs accuracy** (if parameter counts available):
- Approximate sizes: GPT-5.4 (~1.8T?), Claude Opus (~500B?), Haiku (~20B?), etc.
- Spearman correlation: parameter count vs overall accuracy
- Note: exact sizes may not be public; use published estimates

### 3. Error Pattern Analysis

**Chi-square test for error type distribution**:
- H₀: Error type distribution is independent of model
- Contingency table: Models × Error Types (arithmetic, conceptual, hallucination, format)
- Report: χ² statistic, df, p-value, Cramér's V (effect size)

**Per-model error profiles**:
- Which error types are over/under-represented for each model?
- Standardized residuals to identify significant deviations

### 4. Difficulty Analysis

**ANOVA / Kruskal-Wallis**:
- H₀: Accuracy is the same across difficulty levels (simple/medium/complex)
- If significant, post-hoc Tukey HSD or Dunn's test for pairwise comparisons

**Case difficulty ranking**:
- For each case, count how many models got it correct
- Identify "easy" cases (9/9 correct) and "hard" cases (0/9 or 1/9 correct)
- Analyze characteristics of hard cases: project type, difficulty level, financial features

**Item Response Theory (IRT)** (optional):
- 1-parameter Rasch model to estimate case difficulty and model ability
- Provides principled difficulty calibration

### 5. Project Type Effects

**Two-way ANOVA**:
- Factors: Model (9 levels) × Project Type (10 levels)
- DV: Accuracy or MAPE
- Test for main effects and interaction
- If interaction significant: simple effects analysis

### 6. Scenario Effects

**Repeated measures analysis**:
- Within-case comparison across 4 scenarios
- Are certain scenarios (e.g., pesimista) systematically harder?
- Friedman test (non-parametric) for scenario × accuracy

---

## Implementation

**Technology**: Node.js with `simple-statistics` library, or Python with `scipy.stats` + `statsmodels`

**Recommended**: Python for this task (richer statistical libraries)

```python
# Key libraries
from scipy import stats
from statsmodels.stats.contingency_tables import mcnemar
from statsmodels.stats.multicomp import pairwise_tukeyhsd
import numpy as np
import pandas as pd
```

**Script**: `Backend/benchmark/scripts/statisticalAnalysis.py` (new)

---

## Output

- `docs/benchmark/analysis/reports/significance_matrix.json` — 9×9 pairwise p-values
- `docs/benchmark/analysis/reports/correlation_matrix.json` — Task correlation matrix
- `docs/benchmark/analysis/reports/error_chi_square.json` — Error type independence test
- `docs/benchmark/analysis/reports/difficulty_ranking.json` — Cases ranked by difficulty
- `docs/benchmark/analysis/reports/anova_results.json` — Model × Type interaction
- `docs/benchmark/analysis/reports/statistical_summary.md` — Human-readable summary

## Acceptance Criteria
- [ ] Pairwise significance tests completed with Bonferroni correction
- [ ] Correlation matrices generated (Spearman + Pearson)
- [ ] Error type chi-square test with Cramér's V
- [ ] Difficulty analysis with case ranking
- [ ] All p-values reported with appropriate corrections
- [ ] Effect sizes reported alongside p-values
