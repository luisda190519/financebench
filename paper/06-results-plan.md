# Section 6: Results — Plan

## Objective
Present evaluation findings with data, tables, and figures. Note: actual numbers are placeholders until experiments are run. Focus on defining the *structure* for presenting results.

## Word Count Target
1000–1200 words

## Tables & Figures
- **Table 4**: Overall results (accuracy matrix)
- **Table 5**: Error taxonomy
- **Figure 3**: Performance heatmap by task category

## Structure (3 subsections)

---

### 6.1 Overall Performance (300–400 words)

**Table 4**: Main results — accuracy (% of fields within ≤1% tolerance) by model

| Model | Revenue/COGS | P&L Chain | Cash Flow | NPV | IRR | Break-Even | Overall |
|-------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| GPT-4o | [X]% | [X]% | [X]% | [X]% | [X]% | [X]% | [X]% |
| GPT-4-Turbo | ... | ... | ... | ... | ... | ... | ... |
| Claude 3.5 Sonnet | ... | ... | ... | ... | ... | ... | ... |
| Claude 3 Opus | ... | ... | ... | ... | ... | ... | ... |
| Gemini 2.0 Flash | ... | ... | ... | ... | ... | ... | ... |
| Gemini 1.5 Pro | ... | ... | ... | ... | ... | ... | ... |
| LLaMA 3 70B | ... | ... | ... | ... | ... | ... | ... |
| Mistral Large | ... | ... | ... | ... | ... | ... | ... |
| DeepSeek R1 | ... | ... | ... | ... | ... | ... | ... |
| Qwen 2.5 72B | ... | ... | ... | ... | ... | ... | ... |

**Narrative structure**:
- Open with headline finding: "Model X achieves the highest overall field-level accuracy at Y%, followed by..."
- Report the proprietary vs. open-source gap: "Proprietary models average Z% while open-source models average W%"
- Note statistical significance where applicable
- Highlight surprises (if any model performs unexpectedly well/poorly)

**Metrics reported**:
- `overallAccuracy` (% match at ≤1% threshold)
- `avgErrorPercent` (mean relative error)
- Distribution: % match vs. % small vs. % large per model

---

### 6.2 Performance by Task Category (300–350 words)

**Figure 3**: Heatmap or grouped bar chart showing accuracy by model × task category

**Expected patterns to discuss**:
- **Easiest tasks** (hypothesis): Basic revenue/COGS calculation (direct arithmetic, fewer steps)
- **Moderate tasks**: EBITDA, gross margin (require correct expense aggregation)
- **Hardest tasks** (hypothesis):
  - IRR (requires numerical root-finding — models likely approximate or use wrong method)
  - Tax with loss carryforward (conditional multi-year logic)
  - Levered cash flow (depends on correct amortization schedule)
  - NPV (depends on correct cash flows → cascading error)

**Breakdown dimensions**:
- By aggregated task group:
  - **Input metrics** (revenue, COGS): directly from business inputs
  - **Derived metrics** (gross profit, margins, EBITDA): one computation step
  - **Cascading metrics** (taxes, net profit, cash flows): multiple dependency steps
  - **Summary metrics** (NPV, IRR, payback, break-even): final aggregation
- Compare per-field accuracy across the cascading chain to show error accumulation

**Key question to answer**: "At which step in the financial computation chain do LLMs begin to diverge from ground truth?"

---

### 6.3 Error Analysis (400–450 words)

**Table 5**: Error taxonomy derived from comparison engine analysis

| Error Type | Frequency | Description | Example | Impact |
|-----------|-----------|-------------|---------|--------|
| Arithmetic mistake | [X]% | Correct formula, wrong computation | Growth factor: used 1.05^5 = 1.25 instead of 1.276 | Individual field |
| Formula error | [X]% | Wrong formula entirely | Simple interest instead of compound for amortization | Cascading |
| Cascading propagation | [X]% | Early mistake flows downstream | Wrong revenue → wrong EBITDA → wrong NPV | Systemic |
| Structural error | [X]% | Wrong JSON structure | Missing scenarios, wrong number of years, malformed JSON | Complete failure |
| Convention mismatch | [X]% | Different interpretation of conventions | NPV discounting from period 1 vs period 0; IRR as decimal (0.28) vs percentage (28%) | Systematic |
| Hallucinated values | [X]% | Numbers not derivable from inputs | Invented discount rate, fabricated expense items | Random |
| Tax carryforward error | [X]% | Failed conditional logic | Taxed negative EBT, or forgot to carry forward losses | Multi-year |
| Rounding differences | [X]% | Minor arithmetic differences due to precision | Off by < COP 100 on large values | Negligible |

**Qualitative error analysis** (2–3 detailed examples):
- Example 1: Show a case where the model gets revenue correct but miscalculates depreciation, leading to cascading errors in EBIT → EBT → taxes → net profit → cash flow → NPV
- Example 2: Show an IRR error where the model approximates instead of solving NPV=0
- Example 3: Show a tax loss carryforward failure where the model taxes a negative EBT

**Error distribution across models**:
- Are error types consistent across models (systemic LLM limitation) or model-specific?
- Do proprietary models make fewer errors or just different types?

---

## Data Needed [All placeholder until experiments run]
- Accuracy numbers per model per task category
- Error type frequencies
- Per-field accuracy along the computation chain
- Concrete error examples from actual LLM outputs
- Statistical significance tests (paired t-test or Wilcoxon signed-rank)

## References (~3 total)
- NumericBench [Cat 2] — comparison of numerical error types
- FinBen [Cat 3] — compare our accuracy ranges with their results
- FinQA [Cat 3] — compare error types on numerical financial tasks

## Writing Notes
- Write this section AFTER experiments are run (structure now, fill data later)
- Present data first, interpret second
- Use boldface for key findings
- Every table and figure must have an informative caption
- Don't editorialize in Results — save interpretation for Analysis
