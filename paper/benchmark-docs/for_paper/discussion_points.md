# Discussion Points for Paper

## Key Arguments

### 1. LLMs Have Reached Practical Utility for Financial Screening
- Tier 1 models (>82% accuracy) are reliable enough for preliminary viability assessments
- 88.47% accuracy with 7.83% MAPE (Claude Opus 4.6) is sufficient for first-pass screening
- Claude Sonnet 4.6 (86.31%, MAPE 10.27%) and GPT-5.4 (83.92%, MAPE 12.41%) provide cost-effective alternatives within Tier 1
- Comparable to junior analyst performance on standardized financial calculations
- Democratizes access to financial analysis for small businesses and entrepreneurs in developing economies

### 2. A Clear Performance Hierarchy Exists
- Three-tier structure is robust across project types, scenarios, and difficulty levels
- Tier 1 (>82%): Claude Opus 4.6 (88.47%), Claude Sonnet 4.6 (86.31%), GPT-5.4 (83.92%), Gemini 3.1 Pro (81.84%)
- Tier 2 (70--82%): GPT-5.3 (78.26%), Claude Haiku 4 (75.13%), DeepSeek Chat (69.71%)
- Tier 3 (<70%): Grok Code (62.38%), Gemini 3 Flash (57.64%)
- The hierarchy is not simply a scale effect: some smaller proprietary models (Claude Haiku 4, 75.13%) outperform larger open-source alternatives
- Suggests that training methodology and data quality matter as much as parameter count for financial reasoning

### 3. Computational Depth Is the Primary Differentiator
- Simple ratio metrics show compressed performance across all models
- Multi-step calculations (NPV, IRR) reveal the true capability gap
- This aligns with compositional reasoning literature (Dziri et al., 2023; Press et al., 2023)
- Implication: financial benchmarks should weight complex metrics more heavily to discriminate model quality

### 4. The Proprietary-Open Source Gap Is Significant but May Be Narrowing
- Proprietary average: 78.80%; Open-source average: 66.05%; Gap: 12.75 pp
- Gap is substantial but concentrated in advanced cases
- On basic calculations, the gap narrows to approximately 7 pp
- Open-source models are "good enough" for simple financial ratios
- Trajectory suggests the gap may close within 1--2 model generations

### 5. Error Types Are Architecturally Informative
- Arithmetic errors dominate weak models -> numerical processing limitations
- Formula selection errors dominate mid-tier models -> partial domain knowledge
- Temporal reasoning errors dominate advanced cases -> state tracking limitations
- Each error type suggests a different mitigation strategy

### 6. MAPE as a Practical Decision Metric
- 7.83% MAPE (Opus) means expected deviation of ~1/13 of true value---acceptable for screening
- 10.27% MAPE (Sonnet) and 12.41% MAPE (GPT-5.4) remain within practical utility range
- 18.73% MAPE (GPT-5.3) begins to introduce material decision risk
- 27.86%+ MAPE (DeepSeek, Grok, Gemini Flash) renders outputs unreliable for financial decisions
- Sharp quality cliff between 12.41% and 18.73% MAPE separates usable from marginal models

---

## Counter-Arguments to Address

### "Synthetic benchmarks don't reflect real-world use"
- **Response**: Synthetic data enables precise oracle computation; real-world data would introduce ground-truth ambiguity
- **Concession**: Real-world cases involve qualitative judgment that our benchmark does not capture
- **Mitigation**: Future work should include human expert evaluations on real project data

### "Models can be prompted better to improve performance"
- **Response**: We used standardized prompts for fair comparison; prompt optimization would advantage models with larger context windows
- **Concession**: Production deployments would use optimized prompts and few-shot examples
- **Mitigation**: Report prompt-sensitivity analysis in supplementary materials

### "MAPE may not be the best error metric for financial calculations"
- **Response**: MAPE is scale-independent and interpretable for financial stakeholders
- **Concession**: MAPE is undefined when oracle values are zero and asymmetric for over/under-estimation
- **Mitigation**: We also report RMSE and median absolute error in supplementary tables

### "The ranking will be outdated quickly"
- **Response**: The ranking is a snapshot, but the methodology and benchmark dataset are the lasting contributions
- **Concession**: Model capabilities evolve rapidly; specific rankings have a short shelf life
- **Mitigation**: Release the benchmark publicly for ongoing evaluation of new models

---

## Limitations to Acknowledge

### Methodological Limitations
- Single-turn evaluation only; multi-turn iterative refinement not tested
- Standardized prompts without domain-specific optimization
- No chain-of-thought or tool-use augmentation evaluated
- Temperature fixed at 0 for reproducibility; stochastic outputs not explored

### Data Limitations
- Synthetic project data may not capture real-world distribution of financial parameters
- 10 project types, while diverse, do not cover all business domains (e.g., biotech, mining, non-profits)
- Fixed to 4 scenarios; real projects may involve continuous scenario distributions
- Currency and regulatory environment effects not tested (all cases in USD)

### Scope Limitations
- Only evaluates computational accuracy, not explanation quality or advisory value
- Does not assess models' ability to identify missing information or flag unreasonable assumptions
- Benchmark does not test financial forecasting (predicting future values), only calculation (computing from given inputs)
- No evaluation of models' ability to handle incomplete or contradictory input data

### Comparability Limitations
- Proprietary vs. open-source comparison confounded by model size, training data, and RLHF approach
- API-based evaluation subject to provider-side updates between benchmark runs
- Cost and latency not factored into the performance comparison

---

## Future Research Directions

### Near-Term (Next 6-12 Months)
- **Multi-turn evaluation**: Test iterative refinement and self-correction in financial calculations
- **Tool-augmented models**: Evaluate LLMs with access to calculators, spreadsheet engines, or symbolic math tools
- **Prompt optimization study**: Systematic comparison of prompting strategies (zero-shot, few-shot, chain-of-thought, structured output)
- **Multilingual extension**: Evaluate performance on financial calculations in Spanish, Portuguese, and other languages relevant to the target user base

### Medium-Term (1-2 Years)
- **Domain fine-tuning**: Compare general-purpose LLMs against models fine-tuned on financial calculation datasets
- **Hybrid architectures**: Evaluate systems combining LLM reasoning with deterministic computation modules
- **Confidence calibration**: Study whether LLM confidence scores correlate with actual accuracy on financial tasks
- **Real-world validation**: Partner with financial institutions to evaluate on anonymized real project data

### Long-Term (2+ Years)
- **End-to-end advisory evaluation**: Assess LLMs on complete financial advisory tasks including data gathering, analysis, and recommendation
- **Regulatory compliance**: Evaluate whether LLM-generated financial analyses meet regulatory standards in different jurisdictions
- **Longitudinal tracking**: Maintain the benchmark as a living evaluation to track model improvement over time
- **Collaborative human-AI evaluation**: Study how human analysts perform with and without LLM assistance on viability assessments

---

## Talking Points for Different Audiences

### For ML Researchers
- Financial viability calculation is a challenging, real-world testbed for compositional numerical reasoning
- The three-tier structure and error taxonomy provide actionable targets for model improvement
- The benchmark dataset (1,000 cases, 10 types, 4 scenarios, 3 difficulty levels) is publicly available for future research
- The 30.83 pp spread from best to worst model (88.47% to 57.64%) indicates high discriminative power

### For Finance Practitioners
- Top LLMs achieve approximately 88.47% accuracy on financial viability calculations---useful for screening, not for final decisions
- Error rates increase significantly on complex multi-period analyses (NPV, IRR)
- Pessimistic scenarios, which are most critical for risk assessment, show the lowest accuracy
- Recommend human review for all LLM-generated financial projections, especially for high-stakes decisions
- MAPE of 7.83% (best) to 41.57% (worst) defines the current reliability envelope

### For Policymakers and Regulators
- LLMs are increasingly being used for financial analysis; performance benchmarking is essential
- Significant accuracy gaps exist between models, and between simple and complex calculations
- Standardized evaluation frameworks are needed before LLMs can be trusted for regulated financial advice
- Open-source models lag behind proprietary ones by 12.75 pp, which has implications for equitable access to financial AI tools
