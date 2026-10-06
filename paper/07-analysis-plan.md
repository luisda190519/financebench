# Section 7: Analysis — Plan

## Objective
Go beyond raw results to identify deeper patterns, test hypotheses about LLM capabilities, and provide insights that inform both research and practice.

## Word Count Target
800–1000 words

## Tables & Figures
- **Figure 4**: Model size vs. accuracy (scatter plot)
- **Figure 5**: Proprietary vs. open-source gap (grouped bar chart)
- **Table 6**: Accuracy by scenario and difficulty

## Structure (4 subsections)

---

### 7.1 Model Size vs. Performance (200–250 words)

**Figure 4**: Scatter plot — x-axis: estimated parameter count (log scale), y-axis: overall field-level accuracy

**Questions to answer**:
- Does larger model size correlate with better financial analysis accuracy?
- Is the relationship linear, logarithmic, or does it plateau?
- Hypothesis: "We observe a logarithmic relationship: doubling model size yields ~X% accuracy gain. However, this plateaus beyond ~100B parameters, suggesting task-specific tuning may be more impactful than scale alone for financial computation."
- Compare: BIG-bench found "breakthrough" behaviors at certain scales — do we see analogous effects?

**Analysis approach**:
- Plot all 10 models
- Fit logarithmic regression
- Identify outliers (models that over- or under-perform relative to size)
- Discuss implications: for practitioners, is a larger (more expensive) model worth the marginal accuracy gain?

**References**:
- BIG-bench [Cat 1] — scaling analysis methodology
- NumericBench [Cat 2] — numeracy vs. model size findings

---

### 7.2 Proprietary vs. Open-Source Gap (200–250 words)

**Figure 5**: Grouped bar chart — task categories on x-axis, accuracy on y-axis, grouped by proprietary (blue) and open-source (orange)

**Questions to answer**:
- How large is the gap overall? Per task category?
- Are there tasks where open-source models are competitive?
- Hypothesis: "The gap is smallest for direct arithmetic tasks (revenue, COGS) at X pp and largest for multi-step reasoning tasks (IRR, tax carryforward) at Y pp."
- What drives the gap? Possible factors:
  - Training data quality and diversity
  - RLHF / instruction tuning quality
  - Proprietary techniques for numerical reasoning
  - Larger effective context for complex JSON outputs

**Implications**:
- For cost-sensitive deployments: open-source viable for simpler tasks, proprietary needed for complex analysis
- Gap may narrow as open-source models improve (cite LLM-Eval evolution paper)

**References**:
- FinBen [Cat 3] — reported proprietary vs. open-source gap on financial tasks
- Chatbot Arena [Cat 4] — general capability rankings
- Open FinLLM Leaderboard [Cat 4] — financial-specific rankings

---

### 7.3 Failure Modes (200–250 words)

**Table 6**: Accuracy breakdown by scenario and difficulty

| Dimension | Level | Avg Accuracy | Key Observation |
|-----------|-------|:---:|---|
| **Difficulty** | Simple | [X]% | Baseline capability |
| | Medium | [X]% | Expected degradation |
| | Complex | [X]% | Stress test |
| **Scenario** | Optimista | [X]% | [observation] |
| | Normal | [X]% | Baseline scenario |
| | Pesimista | [X]% | May have negative values |
| | Controlado | [X]% | Conservative parameters |

**Questions to answer**:
- Does difficulty level significantly affect accuracy? (Expected: yes, monotonically decreasing)
- Do models perform differently across scenarios? (Hypothesis: pesimista may be harder due to negative values, loss carryforward triggers)
- Cases where ALL models fail: what characterizes these?
  - Expected: multi-year tax loss carryforward, complex amortization with multiple debt sources, high product count
- What is the relationship between product count (income items) and accuracy?

**Specific failure analysis**:
- Tax loss carryforward: the conditional logic `if (taxableIncome + carryforward > 0)` is likely a universal failure point
- French amortization: monthly-to-annual accumulation requires precise iterative computation
- Scenario consistency: does a model that gets normal scenario right also get optimista right?

**References**:
- Minerva [Cat 2] — limitations of math-trained models
- Mathematical reasoning survey [Cat 2] — categorization of failure modes
- MATH dataset [Cat 2] — local error analysis in multi-step problems

---

### 7.4 Correlation with General Benchmarks (150–200 words)

**Question**: Does a model's general capability predict its FinanceBench performance?

**Analysis approach**:
- Correlate FinanceBench overall accuracy with:
  - MMLU score (knowledge breadth)
  - Chatbot Arena Elo (general capability)
  - GSM8K accuracy (math reasoning)
- Compute Pearson/Spearman correlation
- Hypothesis: "MMLU shows moderate correlation (r ≈ 0.6–0.7), suggesting that general knowledge is necessary but insufficient for financial analysis. GSM8K shows stronger correlation (r ≈ 0.7–0.8), confirming that mathematical reasoning is a better predictor."
- Key implication: FinanceBench captures a distinct capability dimension not fully captured by existing benchmarks — this justifies its existence as a standalone benchmark

**References**:
- MMLU [Cat 1] — knowledge benchmark for correlation
- Chatbot Arena [Cat 1/4] — Elo rankings
- GSM8K [Cat 2] — math benchmark for correlation

---

## Data Needed [All placeholder until experiments run]
- All model accuracy numbers
- External benchmark scores for each model (MMLU, Chatbot Arena Elo, GSM8K)
- Per-difficulty and per-scenario breakdowns from aggregation script
- Specific failing cases for qualitative analysis

## Writing Notes
- Write after Results section
- This section allows more speculation than Results, but every claim must be supported by data
- Use hedging language for hypotheses: "suggests," "may indicate," "consistent with"
- Connect findings to practical implications throughout
