# 5. Experimental Setup

This section details the models evaluated, the prompting strategy used to elicit financial analysis from each model, and the end-to-end implementation pipeline from prompt generation through result aggregation.

## 5.1 Models Evaluated

We evaluate ten large language models spanning three proprietary providers and four open-source model families. Table 3 lists the models with their key characteristics.

**Table 3.** Models evaluated in the FinanceBench study. Parameter counts for proprietary models are estimates based on publicly available information. All models are accessed via their respective APIs at the versions available during the evaluation period.

| Model | Provider | Type | Est. Parameters | Access |
|-------|----------|:---:|:---:|---|
| GPT-4o | OpenAI | Proprietary | ~200B | OpenAI API |
| GPT-4-Turbo | OpenAI | Proprietary | ~200B | OpenAI API |
| Claude 3.5 Sonnet | Anthropic | Proprietary | ~100B | Anthropic API |
| Claude 3 Opus | Anthropic | Proprietary | ~200B | Anthropic API |
| Gemini 2.0 Flash | Google | Proprietary | ~100B | Google AI API |
| Gemini 1.5 Pro | Google | Proprietary | ~200B | Google AI API |
| LLaMA 3 70B | Meta | Open-source | 70B | Groq API |
| Mistral Large | Mistral AI | Open-source | ~123B | Mistral API |
| DeepSeek R1 | DeepSeek | Open-source | ~70B | DeepSeek API |
| Qwen 2.5 72B | Alibaba | Open-source | 72B | Together API |

The selection criteria balance breadth and practicality. We include the leading model from each major proprietary provider (OpenAI, Anthropic, Google), at least two model sizes per provider where available, and the top-performing open-source models from the Chatbot Arena leaderboard [3] at the time of evaluation. The resulting set of six proprietary and four open-source models enables meaningful comparison across the proprietary–open-source divide, across model families, and, to a limited extent, across model sizes. We deliberately include models with strong reported performance on mathematical benchmarks (GPT-4o, DeepSeek R1) alongside those known primarily for language fluency (Claude 3.5 Sonnet, Gemini 2.0 Flash), hypothesizing that mathematical reasoning ability may predict financial analysis accuracy.

## 5.2 Prompting Strategy

We design a single prompt template applied uniformly across all models and cases. The prompt consists of four components: role assignment, calculation rules, input data, and output format specification.

**Role assignment.** The prompt opens with: *"You are an expert financial analyst specializing in business viability assessment for Latin American small and medium enterprises."* This establishes domain context without biasing the model toward any specific calculation methodology.

**Calculation rules.** The prompt includes seventeen numbered rules specifying exactly how each financial metric should be computed. These rules cover:

- Revenue computation from item-level parameters with compound annual growth (Rule 1)
- Cost of goods sold as unit cost × quantity × periods with the same growth rate (Rule 2)
- Expense frequency normalization: monthly ×12, quarterly ×4, annual ×1, one-time ×1 (Rule 4)
- Straight-line depreciation over each asset's useful life (Rule 6)
- Interest expense via standard monthly amortization with the French constant-payment formula (Rule 8)
- Tax loss carryforward logic: negative earnings carried to offset future taxable income (Rule 9)
- Taxes as the product of positive taxable income and the tax rate (Rule 10)
- Unlevered and levered cash flows with their respective formulas (Rules 12–13)
- NPV as discounted levered cash flows minus initial investment (Rule 14)
- IRR as the rate at which NPV equals zero (Rule 15)
- Payback period via linear interpolation (Rule 16)
- Break-even point via contribution margin analysis (Rule 17)

We provide these explicit rules for two reasons. First, financial conventions vary (e.g., whether NPV should discount unlevered or levered cash flows, whether depreciation belongs in expense totals or is deducted separately), and specifying conventions reduces ambiguity that would confound evaluation. Second, providing rules shifts the evaluation from *knowledge retrieval* (does the model know the NPV formula?) to *instruction following with computation* (can the model correctly apply the formula across multiple years and scenarios?), which we argue is the more practically relevant capability.

**Input data.** The complete case input—general parameters, investment assets, financing structure, income items with per-scenario values, and expense items—is embedded in the prompt as formatted JSON. For complex cases with seven income items and six expense categories, the input JSON spans approximately 2,000–3,000 tokens.

**Output format.** The prompt specifies the exact JSON schema the model must produce, including field names, nesting structure, and data types. The model is instructed to return *only* a valid JSON object with no surrounding text, markdown formatting, or code blocks. This structured output requirement is essential for automated parsing by the comparison engine.

**Design rationale.** We evaluate under zero-shot conditions with temperature 0 (deterministic output) and no few-shot examples. This design choice establishes a performance *baseline*: it measures the model's raw capability to perform financial calculations when given clear instructions. We intentionally do not optimize prompts per model, as our goal is fair cross-model comparison under uniform conditions. Future work using this benchmark can measure the effect of advanced prompting techniques—chain-of-thought decomposition [4], few-shot exemplars, or tool-augmented generation—against this baseline.

## 5.3 Implementation Details

The evaluation pipeline consists of five stages: prompt generation, model inference, output import, oracle comparison, and result aggregation.

**Prompt generation.** A generation script reads the benchmark dataset index and produces one prompt text file per selected case. Three subset sizes are supported: *quick* (10 cases: one simple case per business type), *full* (30 cases: one simple, one medium, and one complex per type), and *all* (the complete 1,000-case dataset). The *full* subset of 30 cases serves as the primary evaluation set, balancing coverage across all ten business types and three difficulty levels while keeping API costs manageable. The prompt files include metadata headers identifying the case ID, business type, and difficulty level.

**Model inference.** Each prompt is submitted to the respective model's API with the following shared parameters:

- *Temperature*: 0 (greedy decoding for deterministic, reproducible outputs)
- *Maximum output tokens*: 8,192 (sufficient for the complete JSON response, which typically ranges from 3,000 to 6,000 tokens depending on project life)
- *System message*: None beyond what is included in the prompt itself
- *Runs per case*: 1 (with temperature 0, repeated runs produce identical outputs)

The model's JSON response is saved to a per-model results directory following the naming convention `{caseId}_{type}_{difficulty}.json`. A tracking CSV file records which cases have been evaluated for each model.

**Output import and oracle comparison.** Each saved JSON response is submitted to the application's import endpoint (`POST /api/projects/import/json`). The import pipeline performs four operations sequentially: (1) structural validation checks that all required fields are present and well-formed; (2) mode detection identifies the response as a "complete" import (containing both inputs and pre-computed analysis); (3) the oracle independently computes ground-truth metrics from the inputs via `calculateMetrics()`; and (4) the comparison engine executes field-by-field comparison between the model's analysis and the oracle's analysis, storing the result in the project's `benchmarkComparison` field in MongoDB. Cases where the model produces invalid JSON or fails structural validation are recorded as complete failures.

**Batch processing.** A batch import script automates the import of an entire results directory. The script reads all JSON files, submits each to the import endpoint with JWT authentication, and produces a detailed log recording success or failure for each case along with comparison summaries for successful imports.

**Result aggregation.** An aggregation script queries MongoDB for all projects with benchmark comparisons and computes statistics across multiple dimensions:

- *By model*: overall accuracy (proportion of "match" fields), average error percentage, and distribution of match / small difference / large difference across all fields
- *By task category*: accuracy for scenario-level metrics (NPV, IRR, payback, break-even) and for each annual metric (revenue, COGS, gross profit, EBITDA, net profit, levered cash flow)
- *By business type*: per-type accuracy to identify whether certain business structures are systematically harder
- *By difficulty level*: accuracy at simple, medium, and complex to quantify the effect of structural complexity
- *By scenario*: per-scenario accuracy to test whether optimistic or pessimistic projections are systematically more or less accurate

The aggregation output is a structured JSON report that feeds directly into the tables and figures presented in Section 6.

**Reproducibility.** All components necessary to replicate the evaluation are included in the open-source release: the Mulberry32-seeded dataset generator, the prompt generation script with the exact template, the oracle engine, the comparison engine with its threshold constants, and the aggregation scripts. Researchers can regenerate the identical dataset from seeds, evaluate new models using the same prompts, and produce comparable accuracy metrics using the same comparison methodology.

**Cost estimation.** [PLACEHOLDER: To be filled after evaluation with actual per-model costs. Expected format: "Total API cost for the full 30-case evaluation across 10 models was approximately $X, with per-case costs ranging from $Y (Gemini 2.0 Flash) to $Z (Claude 3 Opus)."]

---

*[3] Chiang, W.-L., Zheng, L., Sheng, Y., et al. (2024). Chatbot Arena: An open platform for evaluating LLMs by human preference. arXiv:2403.04132.*

*[4] Wei, J., Wang, X., Schuurmans, D., et al. (2022). Chain-of-thought prompting elicits reasoning in large language models. NeurIPS 2022.*
