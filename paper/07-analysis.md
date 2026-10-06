# 6. Analysis

We analyze the results along four dimensions: the relationship between model scale and financial accuracy, the proprietary–open-source performance gap, systematic failure modes, and correlation with general-purpose benchmarks.

## 6.1 Model Size vs. Performance

Figure 4 plots overall field-level accuracy against estimated parameter count for all 10 models.

**Figure 4.** Overall field-level accuracy (%) vs. estimated model size (log-scale parameters). Dashed line shows logarithmic fit. <!-- TODO: Generate from experimental data -->

**[PLACEHOLDER — INSERT SCALING ANALYSIS]** We observe a [logarithmic/sublinear] relationship between model size and financial analysis accuracy (Pearson r = [X], p < [Y]). However, the relationship [plateaus/continues] beyond approximately [X]B parameters, suggesting that [scale alone is insufficient / scale continues to help] for financial computation. [Model] is a notable [positive/negative] outlier, achieving [higher/lower] accuracy than its parameter count would predict, potentially due to [training data composition / instruction tuning quality / architectural differences].

This finding has practical implications: for deployments where cost is a constraint, the marginal accuracy gain from a [X]B to a [Y]B model is approximately [Z] percentage points—a [meaningful/modest] improvement that must be weighed against [N]× higher inference cost. BIG-bench (Srivastava et al., 2022) observed "breakthrough" behaviors at certain model scales for reasoning tasks; we [do/do not] observe analogous phase transitions for financial computation, which appears to improve [gradually/in steps] with scale.

## 6.2 Proprietary vs. Open-Source Gap

Figure 5 presents a grouped comparison of proprietary and open-source models across task categories.

**Figure 5.** Mean field-level accuracy by task category, grouped by model type (proprietary vs. open-source). Error bars show standard deviation across models within each group. <!-- TODO: Generate from experimental data -->

**[PLACEHOLDER — INSERT GAP ANALYSIS]** The overall gap between proprietary models (mean [X]%) and open-source models (mean [Y]%) is [Z] percentage points. However, this gap varies substantially by task category: it is narrowest for direct arithmetic tasks (revenue/COGS: [X] pp) and widest for multi-step reasoning tasks (IRR: [Y] pp, tax carryforward: [Z] pp).

This pattern suggests that the proprietary advantage is concentrated in complex reasoning rather than basic computation. Open-source models may be competitive for applications requiring only revenue projections or simple P&L statements, while proprietary models remain substantially more reliable for complete financial analysis. As open-source models continue to improve—FinBen (Xie et al., 2024) documented narrowing gaps on NLP-oriented financial tasks—this division may shift, making periodic re-evaluation on FinanceBench valuable for the community.

## 6.3 Failure Modes

Table 6 breaks down accuracy by case difficulty and economic scenario.

**Table 6.** Mean field-level accuracy (%) by difficulty level and economic scenario, averaged across all models.

| Dimension | Level | Mean Accuracy | Δ from Baseline |
|-----------|-------|:---:|:---:|
| **Difficulty** | Simple | [X]% | — |
| | Medium | [X]% | [−Y] pp |
| | Complex | [X]% | [−Z] pp |
| **Scenario** | Normal | [X]% | — |
| | Optimista | [X]% | [±Y] pp |
| | Pesimista | [X]% | [±Z] pp |
| | Controlado | [X]% | [±W] pp |

<!-- TODO: Fill from experimental data -->

**[PLACEHOLDER — INSERT FAILURE MODE ANALYSIS]** Difficulty has a [strong/moderate] effect on accuracy: complex cases (multiple income items, mixed financing sources, longer project horizons) yield [X] percentage points lower accuracy than simple cases. This degradation is [uniform/concentrated in specific task categories], with the largest impact on [task categories].

Across scenarios, the pessimistic scenario shows [lower/comparable] accuracy than normal, likely because negative operating income triggers tax loss carryforward logic—a conditional computation that models frequently mishandle. The controlled scenario, which uses conservative parameter values, achieves [higher/similar] accuracy, consistent with the hypothesis that smaller numerical magnitudes and simpler computation paths reduce error accumulation.

Three systematic failure patterns emerge across all models: (1) **tax loss carryforward**: the conditional logic of accumulating losses to offset future taxable income is a near-universal failure point; (2) **French amortization**: computing monthly payments and accumulating annual interest/principal totals requires precise iterative computation that models approximate; and (3) **multi-scenario consistency**: models occasionally produce internally inconsistent results across scenarios (e.g., pessimistic revenue higher than optimistic for the same product).

## 6.4 Correlation with General Benchmarks

To assess whether FinanceBench captures a distinct capability dimension, we correlate model rankings on our benchmark with published scores on MMLU (Hendrycks et al., 2021), Chatbot Arena Elo (Wang et al., 2024), and GSM8K (Cobbe et al., 2021).

**[PLACEHOLDER — INSERT CORRELATION ANALYSIS]** MMLU scores show a [moderate/strong] Spearman correlation with FinanceBench accuracy (ρ = [X], p = [Y]), indicating that general knowledge is [necessary but insufficient / a reasonable predictor] of financial analysis capability. GSM8K accuracy shows a [stronger/similar] correlation (ρ = [X]), confirming that mathematical reasoning ability is more predictive than broad knowledge for our tasks. Chatbot Arena Elo correlates at ρ = [X], reflecting that conversational ability and financial computation are [related/largely orthogonal] dimensions.

Critically, the imperfect correlations indicate that FinanceBench measures a capability not fully captured by existing benchmarks. A model that excels at grade-school math (GSM8K) may still fail at financial analysis due to domain-specific conventions (amortization systems, tax rules) and the longer computation chains involved. This justifies FinanceBench as a standalone evaluation instrument rather than a subset of existing mathematical reasoning benchmarks.
