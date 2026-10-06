# Task 85 — Paper Integration Package

## Objective
Package all analysis outputs for direct integration into the academic paper.

## Dependencies
- All previous tasks (77–84)

---

## Package Structure

```
docs/benchmark/for_paper/
├── results_section_draft.md       # Pre-written Results section
├── analysis_section_draft.md      # Pre-written Analysis section
├── discussion_points.md           # Key points for Discussion
├── quotes_and_examples.md         # Notable LLM outputs
├── figures_ready/                 # Publication-format figures
│   ├── figure1_overall_accuracy.pdf
│   ├── figure2_accuracy_by_task.pdf
│   ├── figure3_performance_heatmap.pdf
│   ├── figure4_error_types.pdf
│   ├── figure5_proprietary_vs_opensource.pdf
│   ├── figure6_size_vs_accuracy.pdf
│   ├── figure7_confusion_matrices.pdf
│   ├── figure8_error_distribution.pdf
│   └── captions.tex
├── tables_ready/                  # LaTeX tables
│   ├── table1_overall_performance.tex
│   ├── table2_significance.tex
│   ├── table3_error_types.tex
│   └── table4_by_project_type.tex
└── supplementary/                 # Extra material
    ├── full_metrics.csv
    ├── per_case_results.csv
    └── statistical_tests.csv
```

---

## File Specifications

### results_section_draft.md
Pre-written Results section (~1500 words) covering:
- Benchmark setup summary (1000 cases, 9 models, methodology)
- Overall performance results with Table 1 and Figure 1 references
- Task-specific results with Figure 2/3 references
- Statistical significance summary with Table 2 reference
- Written in past tense, passive voice where appropriate
- Uses placeholders like `(Figure~\ref{fig:overall})` for LaTeX conversion

### analysis_section_draft.md
Pre-written Analysis section (~1200 words) covering:
- Error analysis with Figure 4 and Table 3 references
- Proprietary vs open-source analysis with Figure 5 reference
- Difficulty scaling analysis
- Scenario-specific observations
- Interpretation of statistical results

### discussion_points.md
Structured discussion points:
- Comparison with prior work on LLM financial reasoning
- Implications for AI-assisted financial planning
- Limitations of current LLMs for numerical tasks
- Model architecture observations (reasoning models vs chat models)
- Cost-benefit analysis for practical deployment

### quotes_and_examples.md
Notable LLM outputs organized by category:
- **Best successes**: Cases where LLM matched oracle perfectly on complex calculations
- **Worst failures**: Cases with largest errors, with actual JSON snippets
- **Interesting errors**: Conceptual mistakes revealing model reasoning
- **Hallucinations**: Invented data or impossible values
- Each example includes: caseId, model, expected value, actual value, error %, classification

### captions.tex
LaTeX caption text for each figure:
```latex
\begin{figure}[t]
\centering
\includegraphics[width=\columnwidth]{figures/figure1_overall_accuracy.pdf}
\caption{Overall accuracy (\%) of nine LLMs on FinanceBench across 1000 financial
viability cases. Error bars indicate 95\% Wilson confidence intervals.
GPT-5.4 achieves the highest accuracy at X\%, while Grok Code shows the
lowest at Y\%.}
\label{fig:overall}
\end{figure}
```

---

## Implementation

**Process**:
1. Copy figures from `docs/benchmark/figures/` → `for_paper/figures_ready/`
2. Copy tables from `docs/benchmark/tables/` → `for_paper/tables_ready/`
3. Write `results_section_draft.md` using findings report (Task 82) as source
4. Write `analysis_section_draft.md` from error analysis + statistical results
5. Compile `discussion_points.md` from conclusions (Task 83)
6. Extract `quotes_and_examples.md` from error examples (Task 78)
7. Generate `captions.tex` from figure descriptions
8. Export supplementary CSVs from full metrics data

---

## Output
- Complete `docs/benchmark/for_paper/` directory
- All files ready for paper writing workflow

## Acceptance Criteria
- [ ] All subdirectories populated
- [ ] Results section references all figures/tables correctly
- [ ] Analysis section interprets (not just reports) the data
- [ ] Discussion points are distinct from analysis (higher-level insights)
- [ ] Examples include actual JSON snippets from LLM outputs
- [ ] LaTeX captions compile correctly
- [ ] Supplementary CSVs include all raw data
