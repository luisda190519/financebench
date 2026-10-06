# 8. Limitations

We acknowledge several limitations of the current work.

**1. Task scope.** FinanceBench evaluates business viability analysis exclusively, covering 10 task categories from revenue projection to NPV/IRR computation. Financial analysis is considerably broader—encompassing portfolio optimization, risk management, market analysis, trading strategies, and tax planning—and our benchmark should be understood as a first step rather than a comprehensive financial evaluation suite.

**2. Geographic context.** The 10 business templates reflect Colombian and Latin American SME characteristics: COP currency, local business naming conventions, tax rates of 25–33%, and business types typical of emerging economies (cafeterias, agriculture, construction). Generalizability to other regions with different financial conventions, currencies, and regulatory frameworks has not been tested. Future work should incorporate multi-geography templates.

**3. Synthetic data.** All 1,000 test cases are algorithmically generated rather than drawn from real company financials. Real-world data exhibits messier distributions, missing fields, and edge cases that synthetic generation may not fully capture. However, synthetic generation eliminates privacy concerns and enables perfect ground truth—a trade-off we consider favorable for a benchmark focused on computational accuracy.

**4. Zero-shot baseline.** We evaluate models under a single zero-shot prompt template with 17 explicit calculation rules. Optimized prompting strategies—chain-of-thought reasoning (Wei et al., 2022), few-shot examples, or iterative refinement—would likely improve performance. This design is intentional: we establish a reproducible baseline that future work can systematically improve upon.

**5. Threshold granularity.** The three-tier error classification (≤1%, 1–5%, >5%) treats all fields equally. In practice, a 2% error on a \$500M NPV has far greater economic consequence than a 2% error on a \$10K expense item. Future iterations could incorporate magnitude-weighted error metrics that account for the financial significance of each field.

**6. Oracle convention assumptions.** The ground-truth oracle implements specific financial conventions: straight-line depreciation (not declining balance), French amortization (not German or American systems), and IRR computed on levered cash flows. Alternative conventions that are equally valid in practice would produce different "correct" answers; a model applying a different but legitimate convention would be penalized under our evaluation. Documenting the oracle's conventions transparently mitigates but does not eliminate this limitation.

**7. Model version volatility.** LLM capabilities evolve rapidly through retraining and API updates. Our results reflect specific model snapshots at the time of evaluation. Performance may differ on subsequent model versions—an inherent limitation of any LLM benchmark (Xie et al., 2024). We mitigate this by publishing all seeds, code, and prompts for re-evaluation as models are updated.
