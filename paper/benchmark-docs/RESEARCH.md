# Research Methodology

This document describes how to conduct a rigorous academic benchmark study using this
framework, with reproducibility requirements suitable for NeurIPS/AAAI submission.

---

## Study Design

### Research Question

*To what extent can current LLMs accurately replicate ground-truth financial viability
analysis for Latin American SME business cases?*

### Ground Truth Oracle

The AppViabilidadNegocios app implements the following deterministic financial models:

1. **Revenue projection**: Unit-based or scenario-based, with annual growth rates applied
   using compound growth formula `R_t = R_0 × (1 + g)^(t-1)`

2. **Cost of Goods Sold**: Per-unit cost × quantity per scenario

3. **EBITDA**: Gross profit minus operating expenses (frequency-normalized to annual)

4. **Depreciation**: Straight-line over useful life with salvage value

5. **Loan amortization**: Monthly payments, interest extracted per year

6. **Net Profit**: `EBITDA - Depreciation - Interest - Taxes`
   where `Taxes = max(0, taxableIncome) × taxRate`

7. **Cash Flow**: `Net Profit + Depreciation`

8. **NPV**: `Σ(CashFlow_t / (1 + r)^t) - InitialInvestment`
   where r = discountRate/100

9. **IRR**: Solved numerically using bisection (20 iterations, ±0.001% precision)

10. **Payback Period**: Linearly interpolated year at which cumulative cash flow ≥ 0

### Dataset Composition

| Dimension | Values | N per cell |
|-----------|--------|-----------|
| Project type | 10 types | 100 |
| Difficulty | simple / medium / complex | 40 / 40 / 20 |
| Viability bias | viable (~65%) / non-viable (~35%) | per difficulty |
| **Total** | | **1000** |

### Reproducibility

- All cases are seeded: `seed = caseIndex` (0–999)
- Generator uses Mulberry32 PRNG — identical output on every run
- Dataset version: `all_cases.json` SHA-256 hash should be recorded in your paper
- App version: record from `Backend/package.json` version field

---

## Evaluation Protocol

### For Each LLM Under Test

1. Use the same `all_cases.json` for every model
2. Apply the same prompt template (see [USAGE.md](USAGE.md#step-2))
3. Set temperature to 0 (or minimum available) for determinism
4. Allow max 8,000 tokens output
5. Record: model name, version, API date, temperature, token counts

### Parsing LLM Output

LLMs may not always return valid JSON. Implement a parser with these fallbacks:

```python
import json, re

def extract_json(text):
    # Try direct parse
    try:
        return json.loads(text)
    except:
        pass
    # Try extracting JSON block from markdown
    match = re.search(r'```(?:json)?\n?([\s\S]+?)\n?```', text)
    if match:
        try:
            return json.loads(match.group(1))
        except:
            pass
    # Try finding first { ... } block
    match = re.search(r'\{[\s\S]+\}', text)
    if match:
        try:
            return json.loads(match.group(0))
        except:
            pass
    return None
```

Record parse failure rate as a separate metric.

### Metrics

**Primary Metrics (per case, per scenario)**

| Metric | Weight | Rationale |
|--------|--------|-----------|
| NPV accuracy | 25% | Most important decision metric |
| IRR accuracy | 20% | |
| Payback accuracy | 15% | |
| Total Revenue accuracy | 15% | |
| EBITDA accuracy (year 1) | 15% | |
| Cash Flow accuracy (year 1) | 10% | |

**Accuracy Definition**

A prediction is "accurate" if `|predicted - ground_truth| / |ground_truth| < 0.05` (5% threshold).

**Aggregate Metrics**

- `accuracy@1%`: % fields within 1% of ground truth
- `accuracy@5%`: % fields within 5% of ground truth
- `accuracy@10%`: % fields within 10% of ground truth
- `mean_absolute_percentage_error` (MAPE): average % deviation across all fields

---

## Statistical Analysis

### Significance Testing

Use Wilcoxon signed-rank test to compare two models on the same cases:
```python
from scipy.stats import wilcoxon
stat, p = wilcoxon(model_a_errors, model_b_errors)
```

### Confidence Intervals

Report 95% CI using bootstrap (1000 samples) for accuracy rates.

### Breakdown Analysis

Report accuracy split by:
- Project type (10 categories)
- Difficulty level (simple / medium / complex)
- Financial metric (NPV, IRR, payback, etc.)
- Analysis scenario (optimista / normal / pesimista / controlado)

---

## Reporting Template

In your paper, include a table of this form:

| Model | N Valid | Acc@1% | Acc@5% | MAPE | NPV MAPE | IRR MAPE | Payback MAPE |
|-------|---------|--------|--------|------|----------|----------|--------------|
| GPT-4o | 973/1000 | 45.2% | 78.3% | 6.8% | 9.2% | 5.1% | 3.4% |
| Claude 3.5 | 981/1000 | 52.1% | 83.7% | 5.2% | 7.8% | 4.3% | 2.9% |
| Gemini Pro | 965/1000 | 41.8% | 74.9% | 8.1% | 11.2% | 6.7% | 4.2% |

---

## Ethical Considerations

- All business cases are **synthetic** — no real company data is used
- Names are randomized Latin American business names
- No personally identifiable information in the dataset
- Financial figures are parameterized from realistic Colombian/LatAm market ranges
  but are not tied to any real business

---

## Limitations

1. **Single domain**: Only financial viability analysis; not generalizable to other domains
2. **Formula specificity**: Results are specific to the formulas implemented in this app
3. **Language bias**: Cases use Spanish names/context; LLMs may perform differently in English
4. **Template diversity**: 10 template types may not cover all real business structures
5. **No multi-turn**: LLMs receive inputs in a single prompt; multi-turn might improve results

---

## Dataset Versioning

Record these values in your paper for reproducibility:

```bash
# SHA-256 of the generated dataset
sha256sum Backend/benchmark/dataset/all_cases.json

# App version
node -e "console.log(require('./Backend/package.json').version)"

# Generator seed range
echo "Seeds: 0–999, PRNG: Mulberry32"
```
