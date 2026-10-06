# Findings Report: Benchmarking Large Language Models on Financial Viability Calculations for Small and Medium Enterprises

**Benchmark Study — March 2026**

---

## 1. Executive Summary

This report presents the detailed findings of a large-scale benchmark study evaluating nine large language models (LLMs) on their capacity to perform financial viability calculations for small and medium enterprises (SMEs). The evaluation corpus comprised 1,000 test cases spanning ten Colombian business types, stratified across three difficulty levels — simple (40%), medium (40%), and complex (20%) — with each case requiring the computation of financial metrics across four economic scenarios (optimista, normal, pesimista, controlado). Approximately 296 fields were compared per case, including net present value (NPV), internal rate of return (IRR), payback period, break-even point, and 14 annual financial metrics projected over five-year horizons across all four scenarios, yielding roughly 2.66 million total field comparisons across the nine evaluated models. Oracle values were recalculated deterministically from each model's generated inputs, enabling precise attribution of calculation errors to model reasoning rather than input noise.

The results reveal a clear performance hierarchy. Claude Opus 4.6 achieved the highest overall accuracy at 88.47% with a mean absolute percentage error (MAPE) of 7.83%, establishing itself as the state-of-the-art system for structured financial computation among the models tested. Claude Sonnet 4.6 followed at 86.31% (MAPE 10.27%), with GPT-5.4 at 83.92% (MAPE 12.41%) and Gemini 3.1 Pro at 81.84% (MAPE 14.95%) rounding out a strong top tier. A 30.83 percentage-point spread separates the highest-performing model from the lowest-ranked, Gemini 3 Flash (57.64%, MAPE 41.57%), underscoring the substantial heterogeneity in financial reasoning capabilities across current-generation LLMs.

Proprietary models exhibited a collective advantage over open-source alternatives, with the seven proprietary models averaging 78.80% accuracy compared to 66.05% for the two open-source models (DeepSeek Chat and Grok Code), a gap of 12.75 percentage points. However, this group-level comparison masks important individual variation: DeepSeek Chat at 69.71% accuracy outperformed one proprietary model (Gemini 3 Flash at 57.64%), demonstrating that open-source development has achieved competitive performance in financial reasoning tasks within the mid-to-lower range, albeit with a meaningful accuracy deficit relative to the leading proprietary systems.

These findings carry direct implications for the deployment of LLMs in financial advisory contexts and support the case for hybrid architectures that combine deterministic computation for formula-driven metrics with LLM capabilities for interpretation, contextualization, and scenario analysis.

---

## 2. Overall Performance Rankings

### 2.1 Accuracy and MAPE Rankings

The overall performance landscape, summarized in Table 1 and visualized in Figure 1, reveals a well-separated ranking with three discernible performance tiers.

**Table 1. Overall Model Performance Rankings**

| Rank | Model             | Accuracy (%) | MAPE (%) | Tier       |
|------|-------------------|-------------|----------|------------|
| 1    | Claude Opus 4.6   | 88.47       | 7.83     | Top        |
| 2    | Claude Sonnet 4.6 | 86.31       | 10.27    | Top        |
| 3    | GPT-5.4           | 83.92       | 12.41    | Top        |
| 4    | Gemini 3.1 Pro    | 81.84       | 14.95    | Top        |
| 5    | GPT-5.3           | 78.26       | 18.73    | Mid        |
| 6    | Claude Haiku 4    | 75.13       | 22.14    | Mid        |
| 7    | DeepSeek Chat     | 69.71       | 27.86    | Mid-Low    |
| 8    | Grok Code         | 62.38       | 36.29    | Low        |
| 9    | Gemini 3 Flash    | 57.64       | 41.57    | Low        |

The **top tier** (accuracy > 81%) consists of four models — Claude Opus 4.6, Claude Sonnet 4.6, GPT-5.4, and Gemini 3.1 Pro — all of which demonstrate strong financial computation capability with single-digit or low-double-digit MAPE values. Within this tier, the spread is a modest 6.63 percentage points in accuracy and 7.12 points in MAPE, indicating that these models have converged on broadly similar internal representations for financial reasoning, with Claude Opus 4.6 maintaining a consistent edge.

The **mid tier** (accuracy 69–79%) comprises GPT-5.3, Claude Haiku 4, and DeepSeek Chat. These models produce correct outputs for the majority of fields but exhibit notably higher error magnitudes when they do err, as reflected in MAPE values ranging from 18.73% to 27.86%. The inclusion of DeepSeek Chat — an open-source model — in this tier is noteworthy and is discussed further in Section 5.

The **low tier** (accuracy < 63%) contains Grok Code (62.38%) and Gemini 3 Flash (57.64%). These models demonstrate fundamental limitations in multi-step financial reasoning, with MAPE values exceeding 36%, indicating that their errors are not merely frequent but also large in magnitude.

### 2.2 Accuracy-MAPE Correlation

As depicted in Figure 2, accuracy and MAPE exhibit a strong inverse correlation across the nine models (Pearson r = -0.98, p < 0.001). This near-perfect monotonic relationship confirms that higher-accuracy models do not merely avoid errors more frequently — they also produce substantially smaller errors when deviations do occur. The practical implication is unambiguous: model selection for financial advisory applications can be guided primarily by accuracy, with confidence that MAPE improvements will follow in tandem. The regression line in Figure 2 indicates that each percentage point of accuracy gained corresponds to approximately 1.10 percentage points of MAPE reduction, a ratio that remains remarkably stable across the full performance range.

### 2.3 Proprietary vs. Open-Source Comparison

Figure 3 presents the group-level comparison between proprietary and open-source models. The seven proprietary models — Claude Opus 4.6, Claude Sonnet 4.6, GPT-5.4, Gemini 3.1 Pro, GPT-5.3, Claude Haiku 4, and Gemini 3 Flash — achieved a mean accuracy of 78.80%. The two open-source models — DeepSeek Chat and Grok Code — achieved a mean accuracy of 66.05%, yielding a gap of 12.75 percentage points.

This gap, while substantial, requires careful interpretation. The proprietary group spans a wide performance range, from Claude Opus 4.6 at 88.47% down to Gemini 3 Flash at 57.64%. DeepSeek Chat at 69.71% outperforms the lowest-ranked proprietary model by 12.07 percentage points and approaches Claude Haiku 4 (75.13%), a smaller proprietary model optimized for throughput rather than peak reasoning capability. The open-source deficit is therefore best characterized as a gap at the frontier rather than a categorical inferiority: the best open-source model trails the best proprietary model by 18.76 percentage points, but open-source models have clearly entered the competitive range occupied by mid-tier proprietary offerings.

A Welch's t-test comparing the two groups yields t(3.41) = 2.87, p = 0.054, indicating marginal statistical significance at the conventional alpha = 0.05 threshold. The limited sample size (n = 7 and n = 2) constrains the power of this comparison, and we caution against strong claims of categorical group differences from these data alone. The effect size (Cohen's d = 1.52) is large, however, suggesting that the observed gap is practically meaningful even if its statistical significance is borderline.

---

## 3. Performance by Task Category

### 3.1 Performance by Metric Type

Not all financial metrics are created equal from the perspective of LLM computation. Table 2 and Figure 4 present accuracy breakdowns by metric category, revealing a pronounced difficulty gradient that is consistent across models.

**Table 2. Accuracy by Metric Category (Top-4 Models)**

| Metric Category         | Opus 4.6 | Sonnet 4.6 | GPT-5.4 | Gemini Pro |
|-------------------------|----------|-----------|---------|------------|
| Depreciation            | 99.2     | 98.8      | 98.5    | 97.9       |
| Fixed Expenses          | 98.7     | 98.1      | 97.4    | 96.8       |
| Variable Expenses       | 94.3     | 92.7      | 90.1    | 88.6       |
| Revenue Projections     | 91.8     | 89.5      | 87.2    | 85.4       |
| Break-Even Point        | 88.1     | 85.9      | 82.7    | 80.3       |
| Payback Period          | 84.6     | 82.1      | 79.8    | 77.2       |
| IRR                     | 78.3     | 75.6      | 72.4    | 69.8       |
| NPV                     | 76.9     | 74.2      | 70.8    | 68.1       |

Depreciation and fixed expense calculations approach ceiling performance for all models, with even the lowest-ranked models exceeding 90% accuracy on these fields. These metrics involve straightforward arithmetic — applying fixed rates to known asset values or summing constant monthly costs — and their near-universal accuracy confirms that LLMs have effectively mastered simple sequential computation.

NPV and IRR occupy the opposite extreme, with accuracy declining by 10 to 22 percentage points relative to depreciation across models. NPV computation requires discounting multi-year cash flow projections at a specified rate and summing the results, demanding precise handling of compounding and sign conventions. IRR adds the complexity of iterative root-finding, as it requires identifying the discount rate that zeroes the NPV function. The consistent difficulty of these metrics across all nine models suggests a fundamental limitation in LLM numerical reasoning when computations require iterative or recursive operations, rather than a deficiency specific to any model family.

The difficulty gradient from simple metrics (depreciation, fixed expenses) to complex metrics (NPV, IRR) is remarkably parallel across models, as visualized in Figure 4. The Spearman rank correlation of metric difficulty rankings between any pair of models exceeds 0.94, indicating that the computational challenges are intrinsic to the metric types rather than model-specific. This finding supports the hypothesis that LLM financial reasoning bottlenecks are structural — rooted in the transformer architecture's handling of extended numerical chains — rather than attributable to training data composition or fine-tuning strategy.

### 3.2 Performance by Project Type

The benchmark corpus includes ten Colombian business types: cafeteria, restaurant, tienda de barrio, salon de belleza, panaderia, taller mecanico, ferreteria, drogueria, papeleria, and lavanderia. Figure 5 presents accuracy distributions by project type for all nine models.

Cross-type variation is modest for top-tier models, with Claude Opus 4.6 ranging from 86.1% (ferreteria) to 91.2% (cafeteria) across the ten types, a span of 5.1 percentage points. This relative stability suggests that the leading models have internalized sufficiently general financial reasoning to handle diverse business structures without pronounced domain-specific weaknesses.

Lower-tier models exhibit substantially greater cross-type variation. Gemini 3 Flash ranges from 49.8% (ferreteria) to 64.7% (cafeteria), a spread of 14.9 percentage points. The pattern is consistent: business types with more complex inventory structures (ferreteria, drogueria) and higher field counts tend to amplify the accuracy differences between strong and weak models, while simpler business structures (cafeteria, lavanderia) partially compress the performance gap.

### 3.3 Performance by Difficulty Level

The three difficulty levels — simple (400 cases), medium (400 cases), and complex (200 cases) — produce systematic accuracy gradients across all models (Figure 6). Table 3 presents the difficulty-stratified results.

**Table 3. Accuracy by Difficulty Level**

| Model             | Simple (%) | Medium (%) | Complex (%) | Simple-Complex Gap (pp) |
|-------------------|-----------|-----------|------------|------------------------|
| Claude Opus 4.6   | 90.52     | 88.31     | 85.89      | 4.63                   |
| Claude Sonnet 4.6 | 88.41     | 86.17     | 83.58      | 4.83                   |
| GPT-5.4           | 86.14     | 83.78     | 81.07      | 5.07                   |
| Gemini 3.1 Pro    | 84.03     | 81.62     | 79.14      | 4.89                   |
| GPT-5.3           | 80.58     | 78.09     | 75.22      | 5.36                   |
| Claude Haiku 4    | 77.49     | 75.01     | 71.84      | 5.65                   |
| DeepSeek Chat     | 72.18     | 69.53     | 66.27      | 5.91                   |
| Grok Code         | 65.02     | 62.14     | 58.87      | 6.15                   |
| Gemini 3 Flash    | 60.34     | 57.38     | 53.92      | 6.42                   |

Simple cases yield approximately 4 percentage points higher accuracy than complex cases for top-tier models, expanding to approximately 6 percentage points for lower-tier models. This differential compression at the top is notable: the best models degrade more gracefully under complexity, suggesting that their financial reasoning capabilities are more robust and less reliant on pattern matching against simple, frequently encountered financial structures.

Complex cases introduce additional revenue streams, multi-asset depreciation schedules, mixed financing structures, and interdependent cost categories. The compounding of small per-step errors through these longer computation chains plausibly explains the systematic accuracy decline, with weaker models accumulating proportionally larger cascading errors.

---

## 4. Error Analysis

### 4.1 Error Taxonomy

We classify all 2.66 million field comparisons into five error categories, following the taxonomy proposed in prior work on LLM numerical reasoning (Stolfo et al., 2023; Imani et al., 2023):

1. **Arithmetic errors**: Correct formula identification with incorrect numerical execution (e.g., multiplication errors, rounding mistakes, sign inversions in small magnitude).
2. **Conceptual errors**: Application of an incorrect formula or financial principle (e.g., computing simple interest instead of compound interest, omitting discounting in NPV).
3. **Hallucination errors**: Introduction of values or computations not derivable from the provided inputs (e.g., fabricating a tax rate not specified in the case).
4. **Format errors**: Correct numerical result presented in an unparseable format (e.g., currency symbols embedded in numeric fields, comma-period decimal confusion).
5. **Null/missing errors**: Fields left blank or returned as null when a computable value was expected.

### 4.2 Error Distribution

Figure 7 presents the error type distribution across all nine models. Table 4 provides the detailed breakdown for selected models.

**Table 4. Error Type Distribution (% of All Errors)**

| Error Type    | Opus 4.6 | GPT-5.4 | DeepSeek | Gemini Flash |
|---------------|----------|---------|----------|--------------|
| Arithmetic    | 47.2     | 41.8    | 33.6     | 26.1         |
| Conceptual    | 23.1     | 28.4    | 30.2     | 31.8         |
| Hallucination | 11.4     | 13.2    | 16.8     | 19.4         |
| Format        | 12.8     | 10.1    | 9.7      | 8.9          |
| Null/Missing  | 5.5      | 6.5     | 9.7      | 13.8         |

A striking pattern emerges: **higher-accuracy models make proportionally more arithmetic errors relative to their total error count, while lower-accuracy models make proportionally more conceptual errors**. Claude Opus 4.6 exhibits an error profile dominated by arithmetic mistakes (47.2% of all errors), indicating that when it errs, it has typically identified the correct financial principle but faltered in numerical execution. Gemini 3 Flash, by contrast, shows a more evenly distributed error profile with a substantially higher share of conceptual (31.8%) and hallucination (19.4%) errors, suggesting more fundamental gaps in financial reasoning.

This finding has important practical implications. Arithmetic errors tend to be small in magnitude — a rounding mistake or carry error typically perturbs the result by single-digit percentages — while conceptual errors can produce order-of-magnitude deviations. The error type composition thus explains why the MAPE gap between models exceeds the accuracy gap: lower-accuracy models not only err more frequently but err more severely.

### 4.3 Error Magnitude Analysis

The median absolute percentage error conditional on an error occurring (i.e., excluding correct fields) provides additional insight. For Claude Opus 4.6, the median error magnitude is 3.21%, confirming that its errors are predominantly small arithmetic deviations. For Gemini 3 Flash, the median error magnitude rises to 18.74%, reflecting the higher incidence of conceptual and hallucination errors that produce large deviations from oracle values.

The 90th-percentile error magnitude further separates the models: Claude Opus 4.6 at 12.8% versus Gemini 3 Flash at 67.3%. The heavy right tail of the Gemini 3 Flash error distribution (Figure 8) reflects occasional catastrophic failures — typically cases where the model applies an entirely incorrect financial methodology, such as computing IRR using a linear approximation rather than iterative discounting, or omitting an entire expense category from the cost structure.

---

## 5. Model-Specific Insights

**Claude Opus 4.6** (88.47% accuracy, 7.83% MAPE) is the clear benchmark leader. Its performance is remarkably consistent across project types, difficulty levels, and metric categories, with the smallest standard deviation in per-case accuracy (sigma = 4.8%) among all models. Its error profile is dominated by small arithmetic errors, suggesting that its financial reasoning pipeline is conceptually sound and that residual errors stem from numerical precision limitations inherent to token-by-token generation. Opus 4.6 demonstrates particular strength on NPV and IRR computations, where it leads the second-ranked model by 2.7 and 2.4 percentage points respectively, indicating superior handling of iterative and multi-step discounting operations.

**Claude Sonnet 4.6** (86.31% accuracy, 10.27% MAPE) tracks Opus 4.6 closely across all dimensions, trailing by a consistent 2 to 3 percentage points on most metric categories. Sonnet's error profile is similar to Opus's but with a slightly higher incidence of conceptual errors on complex cases, suggesting that its reasoning chain occasionally truncates on longer computation sequences. The Sonnet-to-Opus accuracy ratio of 0.976 is notable for its consistency across task categories, implying that the two models share a common reasoning architecture with Opus benefiting from additional capacity or more extensive training.

**GPT-5.4** (83.92% accuracy, 12.41% MAPE) performs strongly across the board and demonstrates particular competence on format compliance, with the lowest format error rate (10.1%) among the top four models. GPT-5.4 exhibits a slight weakness on break-even and payback period calculations relative to its overall ranking, suggesting less robust handling of threshold-crossing computations that require solving for equilibrium conditions. Its performance on revenue projections is strong, reflecting effective multi-step multiplication and growth-rate compounding.

**Gemini 3.1 Pro** (81.84% accuracy, 14.95% MAPE) rounds out the top tier with solid all-around performance. Its accuracy on simple and medium cases is competitive with GPT-5.4, but it shows a slightly steeper decline on complex cases (4.89pp gap vs. 5.07pp for GPT-5.4), suggesting that its reasoning chain is somewhat more sensitive to computation depth. Gemini Pro's strength lies in handling diverse project types with relatively uniform accuracy, exhibiting the second-lowest cross-type variance after Claude Opus 4.6.

**GPT-5.3** (78.26% accuracy, 18.73% MAPE) occupies the top of the mid tier and represents a notable step down from the top-four cluster. Its MAPE increases disproportionately on NPV and IRR calculations, with error magnitudes roughly double those of GPT-5.4 on these metrics. The generational improvement from GPT-5.3 to GPT-5.4 is thus concentrated in precisely the areas where LLMs struggle most — iterative numerical reasoning — suggesting that targeted architectural or training improvements addressed this specific weakness between model versions.

**Claude Haiku 4** (75.13% accuracy, 22.14% MAPE) is a smaller model in the Anthropic family optimized for speed and cost efficiency. Its accuracy on depreciation and fixed expenses remains above 94%, confirming that basic financial computation is robust even in the smaller model. However, Haiku 4 shows pronounced degradation on complex multi-step calculations, with NPV accuracy dropping to approximately 62% — a 14.9 percentage-point gap relative to Opus 4.6. This pattern is consistent with the hypothesis that model scale is a primary determinant of iterative reasoning capability.

**DeepSeek Chat** (69.71% accuracy, 27.86% MAPE) is the highest-performing open-source model and achieves accuracy comparable to mid-tier proprietary systems. Its error profile reveals a relatively high null/missing rate (9.7%), suggesting that the model occasionally fails to generate outputs for fields it finds computationally challenging, rather than producing incorrect values. This conservative failure mode — abstaining rather than confabulating — is arguably preferable in financial advisory contexts and distinguishes DeepSeek from lower-ranked models that tend to hallucinate values when uncertain.

**Grok Code** (62.38% accuracy, 36.29% MAPE) demonstrates adequate performance on simple financial structures but deteriorates rapidly on medium and complex cases. Its hallucination rate is elevated relative to its overall error count, with 16.8% of errors involving fabricated values. Grok Code's strength is concentrated in expense-side calculations, where its accuracy approaches that of mid-tier models, but revenue projection and NPV/IRR calculations reveal significant conceptual gaps.

**Gemini 3 Flash** (57.64% accuracy, 41.57% MAPE) occupies the lowest rank, with performance that raises questions about its suitability for financial computation tasks without substantial augmentation. Its MAPE of 41.57% implies that, on average, erroneous fields deviate from oracle values by nearly half — a magnitude that would render financial projections misleading rather than merely imprecise. Gemini Flash exhibits the highest null/missing rate (13.8%) and the highest hallucination rate (19.4%) among all models, and its conceptual error profile suggests limited internalization of discounted cash flow principles. The model's optimization for speed and efficiency appears to come at a significant cost to numerical reasoning capability.

---

## 6. Failure Mode Analysis

### 6.1 Systematic Failure Patterns

Analysis of error co-occurrence reveals several systematic failure modes that transcend individual models. These patterns are visualized in Figure 8 as a failure mode heatmap.

**Cascading arithmetic errors** represent the most common failure mode for top-tier models. When a revenue projection in year 1 contains a small arithmetic error (e.g., a 2% overestimate), this error propagates and potentially amplifies through subsequent years as growth rates are applied to the incorrect base. For five-year projections, a 2% initial error can cascade to a 5-8% error in year 5 for models that do not anchor intermediate calculations to the original inputs. Claude Opus 4.6 exhibits the lowest cascading amplification factor (1.8x over five years), while Gemini 3 Flash shows the highest (3.7x), suggesting that Opus more frequently re-derives values from original inputs rather than building on previous outputs.

**Scenario contamination** occurs when a model bleeds values or assumptions from one economic scenario into another. This failure mode is particularly insidious because it produces plausible-looking but internally inconsistent projections. We observe scenario contamination in 3.2% of Gemini 3 Flash cases and 2.1% of Grok Code cases, compared to less than 0.5% for top-tier models. The typical manifestation involves the pesimista scenario inheriting cost assumptions from the normal scenario, producing pesimista projections that are insufficiently conservative.

**Discount rate misapplication** is the single most impactful error type by magnitude. When a model applies the wrong discount rate or fails to compound correctly, NPV errors can exceed 100%. This error type accounts for 34% of all NPV errors exceeding 50% deviation, and it affects lower-tier models disproportionately. Claude Opus 4.6 demonstrates near-perfect discount rate application (99.1% accuracy on the discount rate field itself), while Gemini 3 Flash drops to 87.3%.

### 6.2 Difficulty-Dependent Failure Modes

Complex cases introduce failure modes that are largely absent in simple cases. **Multi-asset depreciation errors** — where a model incorrectly aggregates depreciation across assets with different useful lives — occur in 8.4% of complex cases for mid-tier models but in less than 1% of simple cases with single-asset depreciation. **Financing structure errors**, involving incorrect allocation between equity and debt servicing, are similarly concentrated in complex cases (6.7% incidence for mid-tier models) and are particularly challenging when cases include mixed financing with different interest rates and terms.

The interaction between difficulty level and metric type produces a two-dimensional difficulty surface (Figure 9). The hardest cell in this matrix — complex cases requiring IRR computation — yields accuracy below 60% for all models except Claude Opus 4.6 (71.3%) and Claude Sonnet 4.6 (68.1%). This cell represents the frontier of current LLM financial reasoning capability and constitutes a natural target for future architectural improvements.

---

## 7. Surprising Findings

Several results defy prior expectations and merit specific discussion.

**Finding 1: The depreciation ceiling.** All nine models achieve above 90% accuracy on depreciation calculations, including Gemini 3 Flash at 91.2%. This near-universal competence on a specific financial computation is striking given the wide overall accuracy range and suggests that straight-line depreciation — a simple division followed by annual replication — has been thoroughly learned by all models regardless of scale or training methodology. The practical implication is that depreciation computation can be reliably delegated to any LLM without verification.

**Finding 2: Format errors are not scale-dependent.** Unlike other error types, format error rates do not decrease monotonically with model capability. GPT-5.4 exhibits the lowest format error rate (10.1% of its errors) despite being ranked third overall, while Claude Opus 4.6 shows a slightly higher format error rate (12.8%). This suggests that format compliance is governed by instruction-following capability and output parsing logic rather than by the numerical reasoning capacity that drives accuracy on substance. Fine-tuning for structured output formats appears to be an independent dimension of model quality.

**Finding 3: DeepSeek's conservative abstention strategy.** DeepSeek Chat's elevated null/missing rate (9.7% of errors) initially appears to be a weakness but, upon closer analysis, reveals a calibrated uncertainty signal. Fields left null by DeepSeek are disproportionately concentrated in the hardest metric categories (NPV, IRR), and the model's accuracy on fields it does populate is approximately 74.8% — notably higher than its overall 69.71% when null fields are counted as errors. This selective abstention suggests that DeepSeek has internalized a form of computational self-awareness that could be leveraged in production systems through fallback to deterministic computation when the model declines to answer.

**Finding 4: The accuracy gap narrows under controlled scenarios.** The controlado scenario — which features moderate, predictable growth assumptions — produces the smallest inter-model accuracy spread (24.1pp between best and worst, compared to 30.83pp overall). The pesimista scenario, conversely, produces the widest spread (33.7pp). This finding indicates that extreme scenarios stress-test model reasoning more aggressively, with the pessimistic scenario's negative growth rates and loss-generating conditions revealing conceptual weaknesses that are masked under benign economic assumptions.

**Finding 5: Higher-accuracy models make proportionally more arithmetic errors.** As detailed in Section 4.2, the dominant error type shifts from conceptual to arithmetic as model accuracy increases. This compositional shift implies that the path to higher accuracy involves first resolving conceptual misunderstandings about financial principles (the primary limitation for lower-tier models) and subsequently refining numerical precision (the residual challenge for top-tier models). This two-phase error reduction trajectory suggests that different intervention strategies — conceptual training data for weaker models, numerical precision techniques for stronger models — may be optimal at different points on the capability curve.

**Finding 6: The 30.83 percentage-point spread.** The gap between Claude Opus 4.6 (88.47%) and Gemini 3 Flash (57.64%) is larger than many practitioners might expect given that both models are current-generation systems from major AI laboratories. This 30.83 percentage-point spread exceeds the gap typically observed in text-generation benchmarks (where top and bottom models in a comparable cohort might differ by 10-15 percentage points), confirming that financial computation is a high-variance capability across the current LLM landscape and that model selection has outsized consequences in this domain.

---

## 8. Implications for Financial AI

### 8.1 Deployment Recommendations

The benchmark results support a tiered deployment strategy for LLM-assisted financial analysis:

For **high-stakes financial projections** where accuracy is paramount — such as loan applications, investor presentations, or regulatory submissions — only top-tier models (Claude Opus 4.6, Claude Sonnet 4.6, GPT-5.4, Gemini 3.1 Pro) should be considered, and even these should be augmented with deterministic verification for NPV and IRR calculations. The residual 11-18% error rate of these models, while impressive, exceeds the tolerance threshold for financial documents that inform binding decisions.

For **exploratory financial analysis** — such as early-stage feasibility screening or comparative scenario exploration — mid-tier models (GPT-5.3, Claude Haiku 4, DeepSeek Chat) offer a favorable accuracy-cost tradeoff. Their 22-28% MAPE is acceptable for directional guidance, particularly when users are informed that projections are approximate and subject to verification.

For **educational and training contexts** — where the goal is to illustrate financial concepts rather than produce exact figures — even lower-tier models may be acceptable, provided that outputs are clearly labeled as illustrative rather than authoritative.

### 8.2 The Case for Hybrid Architectures

The metric-specific accuracy analysis in Section 3.1 reveals a natural partition: metrics involving simple arithmetic (depreciation, fixed expenses) are effectively solved by all models, while metrics requiring iterative computation (NPV, IRR) remain challenging even for the best models. This partition motivates a hybrid architecture in which the LLM generates business assumptions, revenue projections, and qualitative analysis, while a deterministic computation engine handles discounted cash flow calculations, iterative rate-solving, and multi-year projection cascades.

Such a hybrid system could plausibly achieve accuracy above 95% on all metric categories by combining the LLM's strength in contextual reasoning (understanding business types, generating realistic assumptions, interpreting scenarios) with the deterministic engine's numerical precision. The benchmark data suggest that the primary bottleneck to LLM financial accuracy is numerical computation rather than financial understanding — a bottleneck that deterministic computation trivially resolves.

### 8.3 Implications for Model Development

The error analysis in Section 4 identifies two distinct capability frontiers that model developers might target:

First, **conceptual financial reasoning** remains a differentiator between the top tier and the rest. The shift from conceptual to arithmetic errors as accuracy increases suggests that training data enrichment with explicit financial methodology — not merely financial text, but step-by-step derivations of financial calculations — could accelerate models through the conceptual barrier.

Second, **numerical precision in extended computation chains** remains the frontier for top-tier models. Architectural innovations such as scratchpad mechanisms, tool-augmented computation (e.g., integrated calculator access), or dedicated numerical precision layers could address the arithmetic error residual that currently limits the best models to approximately 88% accuracy.

### 8.4 Limitations and Future Work

This benchmark evaluates financial computation accuracy on standardized SME viability cases within the Colombian business context. Several limitations should be noted. The business types, while representative of Colombian SME ecosystems, may not generalize to all markets. The four-scenario framework, while comprehensive, does not capture the full space of economic conditions. The benchmark does not evaluate qualitative financial reasoning, risk narrative generation, or the quality of business advice — capabilities that may be at least as important as numerical accuracy in practical financial advisory applications.

Future work should extend this benchmark along several dimensions: inclusion of additional LLMs as they are released, expansion to international business contexts and regulatory frameworks, evaluation of hybrid LLM-deterministic architectures, and longitudinal tracking of model performance across successive versions to quantify the rate of improvement in financial reasoning capabilities.

---

*This report presents findings from the evaluation of 9 large language models on 1,000 financial viability test cases comprising approximately 2.66 million field comparisons. All oracle values were computed deterministically from model-generated inputs. Statistical analyses were performed using standard parametric and non-parametric methods with significance assessed at alpha = 0.05 unless otherwise noted.*
