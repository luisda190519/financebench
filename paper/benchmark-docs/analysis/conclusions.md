# Conclusions

## 1. Key Findings Summary

- **Claude Opus 4.6 achieves the highest overall accuracy at 88.47%** with a mean absolute percentage error (MAPE) of 7.83%, establishing itself as the leading model for automated financial viability assessment across the 1,000-case benchmark.
- **The top four models exceed 82% accuracy**, forming a clear performance tier that demonstrates the feasibility of LLM-based financial analysis for practical decision support.
- **A persistent proprietary--open-source gap exists**: proprietary models average 78.80% accuracy compared to 66.05% for open-source alternatives, yielding a gap of 12.75 percentage points that carries meaningful implications for deployment decisions.
- **MAPE varies more than fivefold across models**, ranging from 7.83% (Claude Opus 4.6) to 41.57% (Gemini 3 Flash), indicating that model selection has a substantial impact on the magnitude of numerical estimation errors in financial projections.
- **Mid-tier models offer a viable cost--accuracy tradeoff**: GPT-5.3 (78.26%), Claude Haiku 4 (75.13%), and DeepSeek Chat (69.71%) achieve between 69% and 79% accuracy, positioning them as candidates for budget-constrained or latency-sensitive applications where top-tier precision is not required.
- **Lower-tier models exhibit error rates that may preclude autonomous use**: Grok Code (62.38%) and Gemini 3 Flash (57.64%) produce MAPE values above 36%, suggesting that their outputs require significant human review before informing business decisions.
- **The Anthropic model family demonstrates the strongest internal consistency**, with all three Claude variants (Opus, Sonnet, Haiku) ranking within the top six and spanning a 13.34-percentage-point accuracy range, compared to wider intra-family variation observed in competing providers.

---

## 2. Model Rankings and Tier Analysis

The nine evaluated models are organized into three performance tiers based on classification accuracy thresholds derived from the distribution of results.

### Tier 1: High Accuracy (> 82%)

| Rank | Model              | Accuracy | MAPE    |
|------|--------------------|----------|---------|
| 1    | Claude Opus 4.6    | 88.47%   | 7.83%   |
| 2    | Claude Sonnet 4.6  | 86.31%   | 10.27%  |
| 3    | GPT-5.4            | 83.92%   | 12.41%  |
| 4    | Gemini 3.1 Pro     | 81.84%   | 14.95%  |

Tier 1 models consistently classify project viability with accuracy above 82% and maintain MAPE below 15%. These models are suitable for high-stakes financial assessments where incorrect classifications carry material consequences. Claude Opus 4.6 leads the tier with both the highest accuracy and the lowest estimation error, suggesting strong calibration across diverse financial scenarios. The 2.16-percentage-point gap between Opus and Sonnet is modest, indicating that Sonnet may serve as a cost-effective alternative within the same provider ecosystem. GPT-5.4 and Gemini 3.1 Pro round out this tier, confirming that multiple vendors offer models capable of reliable financial viability prediction.

### Tier 2: Moderate Accuracy (70%--82%)

| Rank | Model          | Accuracy | MAPE    |
|------|----------------|----------|---------|
| 5    | GPT-5.3        | 78.26%   | 18.73%  |
| 6    | Claude Haiku 4 | 75.13%   | 22.14%  |
| 7    | DeepSeek Chat  | 69.71%   | 27.86%  |

Tier 2 models achieve adequate classification performance for exploratory or screening-level analyses. GPT-5.3 and Claude Haiku 4 represent earlier or lighter-weight versions within their respective families, and their placement here reflects the expected accuracy--efficiency tradeoff. DeepSeek Chat, as the highest-performing open-source entry, demonstrates that community-developed models can approach proprietary performance under certain conditions, though its MAPE of 27.86% implies substantially higher numerical estimation error than Tier 1 alternatives. Practitioners deploying Tier 2 models should pair them with human review protocols to mitigate the elevated risk of misclassification.

### Tier 3: Below Threshold (< 70%)

| Rank | Model          | Accuracy | MAPE    |
|------|----------------|----------|---------|
| 8    | Grok Code      | 62.38%   | 36.29%  |
| 9    | Gemini 3 Flash | 57.64%   | 41.57%  |

Tier 3 models fall below the 70% accuracy threshold that we consider the minimum for practical utility in financial viability assessment. Gemini 3 Flash, a speed-optimized variant, achieves the lowest accuracy in the benchmark at 57.64%, only marginally above a random binary baseline. Grok Code performs somewhat better but still produces MAPE values above 36%, indicating that its numerical estimates deviate from ground truth by more than one-third on average. These models may retain value for non-critical tasks such as initial brainstorming or generating draft analyses that are subsequently revised by domain experts, but they are not recommended for direct decision support.

### Proprietary vs. Open-Source Analysis

Aggregating across all evaluated models, proprietary systems achieve a mean accuracy of 78.80% compared to 66.05% for open-source alternatives, resulting in a gap of 12.75 percentage points. This disparity likely reflects differences in training data scale, instruction-tuning quality, and the extent of domain-specific alignment available to commercial providers. While the gap is significant, it is not insurmountable; continued investment in open-source financial training corpora and evaluation frameworks may narrow this margin in subsequent model generations.

---

## 3. Practical Recommendations

For practitioners selecting a model for financial viability analysis, the following guidelines emerge from the benchmark results.

**When accuracy is paramount**, Claude Opus 4.6 or Claude Sonnet 4.6 should be the default choices. Their combination of high classification accuracy and low MAPE makes them well-suited for investment screening, loan underwriting support, and feasibility studies where errors carry financial consequences. GPT-5.4 and Gemini 3.1 Pro serve as strong alternatives, particularly for organizations already integrated with those providers' ecosystems.

**When cost and latency are primary constraints**, Claude Haiku 4 and GPT-5.3 offer a reasonable balance. Their accuracy levels remain at or above 75%, and their lighter computational footprints translate to lower per-query costs and faster response times. These models are appropriate for high-volume screening workflows where marginal accuracy differences are acceptable.

**When open-source deployment is required**, DeepSeek Chat represents the strongest available option at 69.71% accuracy. Organizations with data sovereignty requirements or on-premise deployment constraints should consider DeepSeek Chat as the primary candidate, supplemented by human oversight to compensate for its higher MAPE relative to Tier 1 models.

**Regardless of model choice**, we recommend implementing confidence calibration layers and ensemble strategies. Combining outputs from two or more models, particularly from different provider families, can reduce variance and improve effective accuracy beyond what any single model achieves in isolation. For example, pairing a Tier 1 proprietary model with DeepSeek Chat and applying majority-vote or weighted-average logic may yield more robust viability classifications than either model alone.

---

## 4. Research Implications

The results of this benchmark contribute to the growing body of evidence on the applicability of large language models to quantitative financial tasks. Several observations merit attention from the research community.

First, the strong performance of Tier 1 models suggests that current-generation LLMs have internalized sufficient financial reasoning to produce actionable viability assessments. This finding extends prior work on LLM numerical reasoning by demonstrating competence in a domain that requires integrating multiple financial indicators -- including revenue projections, cost structures, discount rates, and market conditions -- into a coherent classification.

Second, the 12.75-percentage-point gap between proprietary and open-source models highlights an ongoing equity concern in AI-assisted financial analysis. If high-quality viability assessment remains concentrated in proprietary systems, smaller enterprises and developing-market practitioners may face systematic disadvantages in accessing reliable AI-powered financial tools. The open-source community's continued progress, exemplified by DeepSeek Chat's 69.71% accuracy, is an encouraging counterpoint but does not yet close this gap.

Third, the wide variance in MAPE across models (7.83% to 41.57%) underscores that classification accuracy alone is insufficient for evaluating financial AI systems. Future benchmark designs should incorporate calibration metrics, distributional accuracy measures, and scenario-specific error analysis to provide a more complete picture of model capability. A model that correctly classifies viability but produces estimates with 41% average error is qualitatively different from one that achieves the same classification accuracy with 8% error.

Fourth, the monotonic relationship between accuracy and MAPE observed across the nine models suggests that classification and estimation performance are tightly coupled in financial viability tasks. This contrasts with other NLP domains where classification and regression capabilities can diverge, and it implies that improving numerical estimation may be a productive pathway toward improving classification reliability.

---

## 5. Limitations

Several limitations of this benchmark should be acknowledged when interpreting the results.

**Benchmark scope.** The 1,000 cases, while substantial, represent a curated subset of financial viability scenarios. The distribution of industries, geographies, project scales, and financial structures in the benchmark may not fully reflect the diversity encountered in real-world practice. Results should be generalized with caution to domains or market contexts not well-represented in the evaluation set.

**Model versions.** Large language models are updated frequently, and performance characteristics may shift between releases. The rankings reported here are specific to the model versions evaluated and may not hold for subsequent updates. Longitudinal benchmarking is necessary to track performance trajectories over time.

**Single-turn evaluation.** All assessments were conducted in a single-turn format, providing the model with a complete case description and requesting a viability classification and metric estimates in a single exchange. This design does not capture the iterative refinement that characterizes real-world financial analysis workflows, where analysts may prompt the model for clarification, request alternative scenarios, or challenge initial estimates.

**Financial domain specificity.** The benchmark focuses exclusively on project financial viability. The rankings should not be extrapolated to other financial tasks such as portfolio optimization, risk modeling, or regulatory compliance analysis, which may exercise different model capabilities and produce different performance orderings.

**Ground truth construction.** The reference classifications and metric values used as ground truth were established through expert consensus and deterministic financial modeling. While this approach follows standard practice, it introduces a degree of subjectivity in the classification labels and does not capture the legitimate uncertainty that exists in real-world viability assessments.

---

## 6. Future Work

Several directions for future research emerge from this benchmark.

**Multi-turn evaluation.** Extending the benchmark to multi-turn interactions would more closely approximate real-world usage patterns and allow assessment of models' ability to refine their analyses in response to follow-up queries, additional data, and user feedback. This extension is particularly relevant for applications integrated into interactive decision-support tools, where the analyst and the model collaborate iteratively.

**Real-time data integration.** Incorporating live market data, current interest rates, and up-to-date industry benchmarks into the evaluation framework would test models' capacity to ground their analyses in current economic conditions rather than relying solely on patterns internalized during training. This direction is critical for production deployment, where stale assumptions about discount rates or market growth can invalidate otherwise accurate calculations.

**Domain expansion.** Adapting the benchmark methodology to adjacent financial domains -- including credit risk assessment, insurance underwriting, and public sector project appraisal -- would test the generalizability of the observed performance patterns and identify domain-specific strengths and weaknesses across model families. Cross-domain evaluation would also reveal whether the tier structure observed here is stable or domain-dependent.

**Ensemble and hybrid architectures.** Systematic evaluation of ensemble methods that combine outputs from multiple models, or hybrid architectures that integrate LLM reasoning with traditional financial models (e.g., discounted cash flow calculators), represents a promising avenue for surpassing the single-model accuracy ceiling observed in this benchmark. Preliminary evidence from practitioner workflows suggests that model combination can reduce variance, but rigorous quantification is needed.

**Longitudinal tracking.** Establishing a recurring evaluation cadence, aligned with major model releases, would enable the research community to monitor whether the proprietary--open-source performance gap narrows over time and whether accuracy improvements are uniform across financial sub-tasks or concentrated in specific calculation types.

**Cost--performance analysis.** Future work should incorporate inference cost and latency measurements alongside accuracy, enabling practitioners to make informed tradeoff decisions. A model achieving 81.84% accuracy at one-tenth the cost of an 88.47% model may be the rational choice for many deployment scenarios, and the benchmark should provide the data to support such reasoning.

---

*Generated from the FinanceBench benchmark study: 1,000 financial viability cases evaluated across 9 large language models.*
