# Section 9: Limitations — Plan

## Objective
Honest acknowledgment of limitations without undermining the contribution. Reviewers value self-awareness — being upfront about limitations strengthens the paper.

## Word Count Target
300–400 words

## Structure
Single section with 7 numbered limitations, each 40–60 words.

---

### Limitations to Acknowledge

**1. Task Scope**
- FinanceBench covers only business viability analysis (10 task categories)
- Financial analysis is much broader: portfolio optimization, risk management, market analysis, trading strategies, tax planning, audit
- Our benchmark is a first step, not a comprehensive financial evaluation suite

**2. Geographic Context**
- Business templates reflect Colombian/Latin American SME context: COP currency, local business names (Cafetería Aroma del Valle), tax rates 25–33%, business types typical of emerging markets
- Generalizability to other regions (US, EU, Asia) with different financial conventions, currencies, and regulatory frameworks is untested
- Future work should include multi-geography templates

**3. Synthetic Data**
- All 1,000 cases are algorithmically generated, not drawn from real company financials
- Real-world data has messier distributions, missing fields, inconsistencies, and edge cases that synthetic generation may not capture
- However, synthetic generation ensures no privacy concerns and enables perfect ground truth

**4. Prompting Baseline**
- We evaluate zero-shot performance with a single prompt template containing explicit rules
- Optimized prompting (chain-of-thought, few-shot examples, iterative refinement) would likely improve results
- This is intentional — we establish a baseline that future work can improve upon

**5. Evaluation Threshold Granularity**
- The three-tier classification (≤1%, 1–5%, >5%) treats all fields equally
- In practice, a 2% error on a $100M NPV ($2M) has very different implications than a 2% error on a $10K expense item
- Future work could incorporate magnitude-weighted error metrics

**6. Oracle Convention Assumptions**
- The ground-truth oracle implements specific financial conventions:
  - Unlevered cash flow uses taxes calculated after interest deduction
  - IRR computed on levered cash flows
  - Straight-line depreciation only (not declining balance or units-of-production)
  - French amortization (not German or American systems)
- Alternative valid conventions would produce different "correct" answers
- A model using a different but valid convention would be penalized

**7. Model Version Volatility**
- LLM capabilities evolve rapidly through retraining and updates
- Results reflect specific model snapshots (API versions to be recorded)
- Performance may differ on future model versions
- This is an inherent limitation of any LLM benchmark — we mitigate by publishing seeds and code for re-evaluation

---

## References (~2 total)
- FinBen [Cat 3] — cite their limitations discussion as parallel
- Artstein & Poesio [Cat 5] — validation methodology limitations for qualitative tasks

## Writing Notes
- Tone: honest, measured, not apologetic
- Each limitation should acknowledge the issue AND explain why it doesn't invalidate the contribution
- Limitations 3 and 4 are actually strengths in disguise (privacy, baseline for improvement)
- Keep concise — this section should not exceed 400 words
