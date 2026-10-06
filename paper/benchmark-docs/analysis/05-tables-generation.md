# Task 81 — Tables Generation (LaTeX Format)

## Objective
Generate 4 publication-ready tables in LaTeX format for direct inclusion in the paper.

## Dependencies
- Task 78 (metrics data)
- Task 79 (statistical results)

---

## Tables

### Table 1: Overall Model Performance
**File**: `docs/benchmark/tables/table1_overall_performance.tex`

| Column | Description |
|--------|-------------|
| Model | Display name |
| Overall Acc. (%) | Exact match rate across all fields |
| NPV Acc. (%) | NPV exact match rate |
| IRR Acc. (%) | IRR exact match rate |
| Payback Acc. (%) | Payback period match rate |
| Break-Even Acc. (%) | Break-even match rate |
| Revenue Acc. (%) | Annual revenue match rate |
| EBITDA Acc. (%) | EBITDA match rate |
| Cash Flow Acc. (%) | Levered cash flow match rate |
| MAPE (%) | Mean absolute percentage error |

**Formatting**:
- Bold the best value in each column
- Underline second-best
- Sort rows by Overall Accuracy (descending)
- Use `\toprule`, `\midrule`, `\bottomrule` (booktabs package)

```latex
\begin{table}[t]
\centering
\caption{Overall performance of 9 LLMs on FinanceBench (1000 cases, 4 scenarios each).
Best result per column in \textbf{bold}, second-best \underline{underlined}.}
\label{tab:overall_performance}
\begin{tabular}{l*{9}{r}}
\toprule
Model & Overall & NPV & IRR & Payback & B/E & Revenue & EBITDA & CF & MAPE \\
\midrule
GPT-5.4 & \textbf{87.3} & \textbf{92.1} & ... \\
...
\bottomrule
\end{tabular}
\end{table}
```

### Table 2: Statistical Significance (Pairwise)
**File**: `docs/benchmark/tables/table2_significance.tex`

- 9×9 lower-triangular matrix
- Cell values: p-values from McNemar's test
- Significance markers: * (p<0.05), ** (p<0.01), *** (p<0.001)
- Diagonal: model name (or em-dash)
- Color-code cells (if journal allows): green (significant) / gray (not significant)

```latex
\begin{table}[t]
\centering
\caption{Pairwise McNemar's test p-values (Bonferroni-corrected, $\alpha=0.00139$).
$^{***}$: $p<0.001$, $^{**}$: $p<0.01$, $^{*}$: $p<0.05$.}
\label{tab:significance}
\begin{tabular}{l*{8}{c}}
\toprule
 & GPT-5.4 & GPT-5.3 & Opus & Sonnet & Haiku & Gem.Pro & Gem.Flash & DeepSeek \\
\midrule
GPT-5.3     & 0.023$^*$ \\
Claude Opus & 0.142     & 0.003$^{**}$ \\
...
\bottomrule
\end{tabular}
\end{table}
```

### Table 3: Error Type Distribution
**File**: `docs/benchmark/tables/table3_error_types.tex`

| Column | Description |
|--------|-------------|
| Model | Display name |
| Arithmetic (%) | % of errors that are arithmetic |
| Conceptual (%) | % of errors that are conceptual |
| Hallucination (%) | % of errors that are hallucinations |
| Format (%) | % of errors that are format issues |
| Null Mismatch (%) | % of errors with null disagreement |
| Total Errors (N) | Absolute count of errors |

### Table 4: Performance by Project Type
**File**: `docs/benchmark/tables/table4_by_project_type.tex`

- Rows: 9 models
- Columns: 10 project types (cafeteria, software, retail, construccion, manufactura, consultoria, ecommerce, agricultura, fincaRaiz, hospedaje)
- Cell values: Accuracy (%)
- Bold best per column
- May need landscape orientation or split into two tables

---

## Implementation

**Technology**: Node.js or Python (template-based generation)

**Script**: `Backend/benchmark/scripts/generateTables.py` (new)

**Process**:
1. Load metrics from Task 78 output (`metrics_full.json`)
2. Load statistical results from Task 79 output (`significance_matrix.json`)
3. Format values (1 decimal place for %, 3 decimal places for p-values)
4. Generate LaTeX using string templates
5. Also export CSV versions for backup/spreadsheet use

---

## Output
- `docs/benchmark/tables/table1_overall_performance.tex` + `.csv`
- `docs/benchmark/tables/table2_significance.tex` + `.csv`
- `docs/benchmark/tables/table3_error_types.tex` + `.csv`
- `docs/benchmark/tables/table4_by_project_type.tex` + `.csv`

## Acceptance Criteria
- [ ] All 4 LaTeX tables compile without errors
- [ ] Best values bolded per column
- [ ] Booktabs formatting (professional appearance)
- [ ] CSV backups generated
- [ ] Tables fit within column/page width constraints
