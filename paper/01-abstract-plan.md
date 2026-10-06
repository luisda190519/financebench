# Section 1: Abstract — Plan

## Objective
Provide a concise, impactful summary of the entire paper in a single paragraph. No citations. Must hook readers from AI *and* finance communities.

## Word Count Target
200 words (strict: 150–250)

## Structure (9–10 sentences)

### Sentences 1–2: Context & Motivation
- LLMs are increasingly used for financial analysis (viability assessments, NPV, cash flow projections) by entrepreneurs and SMEs
- No standardized benchmark exists to measure their accuracy on structured numerical financial tasks with exact ground truth

### Sentences 3–4: Contribution
- We introduce FinanceBench: 1,000 deterministic test cases across 10 financial analysis task categories
- Generated from a ground-truth oracle that computes 15+ metrics per scenario using verified financial formulas (NPV, IRR, amortization, depreciation, tax with loss carryforward)

### Sentences 5–6: Methodology
- 10 diverse business types representative of Latin American SMEs, 3 difficulty levels, 4 economic scenarios per case
- We evaluate [N] state-of-the-art LLMs (proprietary and open-source) using standardized zero-shot prompts with structured JSON output

### Sentences 7–8: Key Findings [PLACEHOLDER — fill after experiments]
- "[Model X] achieves Y% field-level accuracy overall; open-source models average Z%"
- "IRR calculation proves most challenging (W% accuracy); all models show systematic errors in multi-year tax loss carryforward"

### Sentences 9–10: Impact
- FinanceBench provides the first reproducible evaluation framework for financial LLMs with exact numerical ground truth
- Enables evidence-based model selection and identifies critical gaps in LLM numerical reasoning for financial applications

## Key Claims to Include
- "first benchmark with deterministic ground-truth oracle for structured financial analysis"
- "1,000 test cases, 10 task categories, 10 business types, 4 scenarios"
- "field-by-field comparison with tolerance thresholds"

## Data Needed
- Final accuracy numbers from experiments (placeholder for now)
- Top-performing model name and accuracy
- Most challenging task category and accuracy

## References
- None (abstracts have no citations)

## Technical Details from Codebase
- Mention "15+ metrics per scenario" (from calculateMetrics: revenue, COGS, gross profit, margins, EBITDA, depreciation, EBIT, interest, taxes, net profit, unlevered CF, levered CF, NPV, IRR, payback, break-even)
- Mention "ground-truth oracle" (calculateMetrics in Project.js)
- Mention "deterministic" (Mulberry32 PRNG)

## Writing Notes
- Write this section LAST (after all other sections are complete)
- Every word counts — no filler, no hedging
- Must be self-contained: a reader should understand the contribution from the abstract alone
