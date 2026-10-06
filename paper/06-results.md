# 5. Results

We present evaluation results across all 10 models and 10 task categories. All accuracy figures report the percentage of fields within the ≤1% relative error threshold (match rate) unless otherwise noted.

## 5.1 Overall Performance

Table 4 summarizes field-level accuracy by model across aggregated task groups.

**Table 4.** Overall field-level accuracy (% match at ≤1% tolerance) by model and task group. Best result per column in **bold**.

| Model | Revenue / COGS | P&L Chain | Cash Flow | NPV | IRR | Break-Even | Overall |
|-------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| GPT-4o | [X]% | [X]% | [X]% | [X]% | [X]% | [X]% | [X]% |
| GPT-4 Turbo | — | — | — | — | — | — | — |
| Claude 3.5 Sonnet | — | — | — | — | — | — | — |
| Claude 3 Opus | — | — | — | — | — | — | — |
| Gemini 2.0 Flash | — | — | — | — | — | — | — |
| Gemini 1.5 Pro | — | — | — | — | — | — | — |
| LLaMA 3 70B | — | — | — | — | — | — | — |
| Mistral Large | — | — | — | — | — | — | — |
| DeepSeek R1 | — | — | — | — | — | — | — |
| Qwen 2.5 72B | — | — | — | — | — | — | — |

<!-- TODO: Fill with experimental data -->

**[PLACEHOLDER — INSERT HEADLINE FINDING]** [Best model] achieves the highest overall field-level accuracy at [X]%, followed by [second model] at [Y]%. Proprietary models average [Z]% overall accuracy compared to [W]% for open-source models, a gap of [Z−W] percentage points. All models perform above [floor]% on direct arithmetic tasks (revenue, COGS) but drop below [ceiling]% on summary metrics that depend on the full computation chain (NPV, IRR).

Notably, no model exceeds [X]% overall accuracy, indicating that even state-of-the-art LLMs make errors on a substantial fraction of financial fields under zero-shot conditions. The mean relative error across all models and fields is [X]%, with the distribution heavily right-skewed: most fields are computed within tolerance, but a tail of large errors—particularly on cascading metrics—drives the average upward.

## 5.2 Performance by Task Category

Figure 3 presents a heatmap of accuracy by model and task category, revealing systematic patterns in where models succeed and fail.

**Figure 3.** Field-level accuracy heatmap (10 models × 10 task categories). Darker shading indicates higher accuracy. <!-- TODO: Generate from experimental data -->

Performance degrades monotonically along the computation chain, consistent with our cascading error hypothesis. We organize tasks into four tiers based on average accuracy across all models:

- **Tier 1 — Direct computation** (revenue, COGS): [X–Y]% average accuracy. These tasks require straightforward arithmetic—multiplying prices by quantities and applying growth rates—with minimal dependency on other computed values.
- **Tier 2 — First-order derivation** (gross profit, EBITDA, total expenses): [X–Y]% average accuracy. These depend on Tier 1 values and involve aggregation (summing expense items with frequency normalization).
- **Tier 3 — Multi-step reasoning** (depreciation, interest expense, taxes with carryforward, net profit): [X–Y]% average accuracy. Errors here reflect both propagated mistakes from earlier tiers and new errors in applying domain-specific conventions.
- **Tier 4 — Terminal aggregation** (NPV, IRR, payback period, break-even): [X–Y]% average accuracy. These summary metrics compound all upstream errors and additionally require specific numerical methods (discounted cash flow summation, root-finding for IRR).

The steepest accuracy drop occurs between Tier 2 and Tier 3, at the point where domain-specific financial conventions (tax loss carryforward, amortization schedules) first enter the computation chain. This suggests that LLMs handle basic arithmetic reasonably well but struggle with conditional financial logic.

## 5.3 Error Analysis

To understand *why* models fail, we classify all field-level errors into a taxonomy of eight error types, shown in Table 5.

**Table 5.** Error taxonomy with frequency distribution across all models and cases.

| Error Type | Frequency | Description | Impact Scope |
|-----------|:---:|-------------|:---:|
| Arithmetic mistake | [X]% | Correct formula, wrong computation (e.g., 1.05⁵ = 1.25 instead of 1.276) | Single field |
| Formula error | [X]% | Wrong formula applied (e.g., simple interest instead of compound) | Cascading |
| Cascading propagation | [X]% | Correct formula on incorrect input from upstream error | Systemic |
| Structural error | [X]% | Malformed JSON, missing scenarios, wrong number of years | Complete failure |
| Convention mismatch | [X]% | Different but potentially valid interpretation (e.g., NPV discounting from period 0 vs. 1) | Systematic |
| Hallucinated values | [X]% | Numbers not derivable from inputs (invented rates, fabricated items) | Random |
| Tax carryforward error | [X]% | Failed conditional logic (taxed negative EBT, forgot to carry losses) | Multi-year |
| Rounding difference | [X]% | Negligible precision difference (< 0.1% relative error) | Negligible |

<!-- TODO: Fill frequencies from experimental data -->

**[PLACEHOLDER — INSERT QUALITATIVE EXAMPLES]**

*Example 1: Cascading depreciation error.* [Model] correctly computes year-1 revenue of COP [X]M but calculates depreciation as COP [Y]M instead of the oracle value COP [Z]M (using [wrong method] instead of straight-line). This propagates: EBIT is off by COP [Δ]M, taxes by COP [Δ']M, net profit by COP [Δ'']M, and the resulting NPV diverges by [X]% from ground truth—a large difference originating from a single formula error.

*Example 2: IRR approximation failure.* [Model] reports an IRR of [X]% while the oracle computes [Y]% via Newton-Raphson with bisection fallback. The model appears to [describe approximate method], producing a value that falls within the "large difference" tier despite getting all input cash flows substantially correct.

*Example 3: Tax loss carryforward omission.* In a pessimistic scenario with negative operating income in years 1–2, [Model] applies [X]% tax to the negative EBT rather than carrying the loss forward to offset year-3 income. This produces a [direction] bias in net profit for years 1–2 and an [opposite direction] bias in year 3, with compounding effects on cumulative cash flow and NPV.

The distribution of error types is [similar/different] across proprietary and open-source models. [PLACEHOLDER: Describe whether error type profiles differ by model family, or whether all models share common failure modes.]
