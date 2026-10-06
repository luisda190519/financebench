# Task 78 — Comparison Algorithm & Metrics Calculation

## Objective
Compare LLM outputs vs oracle (ground truth recalculated from inputs) and calculate comprehensive accuracy metrics.

## Dependencies
- Task 77 (loaded & validated data)

## Oracle Calculation

The oracle recalculates all financial metrics from `inputs` using the **exact same formulas** as the app's `Project.js calculateMetrics()`. Reference implementation exists in:
- `Backend/benchmark/scripts/generateResults.js` — NPV, IRR (Newton-Raphson + bisection fallback), annual calculations

### Oracle Pipeline (per case, per scenario)
1. Calculate annual revenue: `sum(item.scenarios[s].sellingPrice * quantity * periodsPerYear)` with growth
2. Calculate COGS: `sum(item.scenarios[s].unitCost * quantity * periodsPerYear)` with growth
3. Gross Profit = Revenue - COGS
4. Normalize expenses by frequency (monthly×12, quarterly×4, annual×1, one-time÷projectLife)
5. Apply expense growth rates year-over-year
6. EBITDA = Gross Profit - Total Expenses
7. Depreciation = sum(fixedAsset.value / usefulLife) while year ≤ usefulLife
8. Operational Profit = EBITDA - Depreciation
9. Interest Expense from loan amortization schedule (customSources with type="debt")
10. Taxes = max(0, (Operational Profit - Interest) × taxRate/100) with loss carryforward
11. Net Profit = Operational Profit - Interest - Taxes
12. Unlevered Cash Flow = Net Profit + Depreciation (simplified)
13. Levered Cash Flow = Unlevered - principal payments
14. NPV = discounted sum of levered cash flows - initial investment
15. IRR = rate where NPV = 0 (Newton-Raphson, bisection fallback)
16. Payback Period = interpolated year where cumulative cash flow turns positive
17. Break-Even Point = fixed expenses / (weighted avg price - weighted avg unit cost)

---

## Comparison Methodology

### Field-by-Field Comparison
For each case × model × scenario, compare LLM value vs Oracle value for:

**Summary metrics (4 per scenario)**:
| Field | Type | Comparison |
|-------|------|------------|
| `npv` | Numeric | Absolute & percentage error |
| `irr` | Numeric/null | Absolute error; null-match check |
| `paybackPeriod` | Numeric | Absolute & percentage error |
| `breakEvenPoint` | Numeric | Absolute & percentage error |

**Annual data (14 fields × projectLife years per scenario)**:
| Field | Type |
|-------|------|
| `revenue`, `totalCOGS`, `grossProfit` | Numeric |
| `fixedExpenses`, `variableExpenses`, `totalExpenses` | Numeric |
| `ebitda`, `depreciation`, `operationalProfit` | Numeric |
| `interestExpense`, `taxes`, `netProfit` | Numeric |
| `unleveredCashFlow`, `leveredCashFlow` | Numeric |

### Tolerance & Match Criteria
- **Exact match**: |LLM - Oracle| < 0.01 (within 1 cent for monetary values)
- **Close match**: percentage error < 1%
- **IRR special case**: |LLM_irr - Oracle_irr| < 0.01 percentage points
- **Null handling**: Both null = match; one null = mismatch

---

## Metrics to Calculate

### 1. Accuracy Metrics (per model)
- **Exact Match Rate**: % of fields within tolerance
- **Close Match Rate**: % of fields within 1% error
- **By scenario**: Accuracy split across optimista/normal/pesimista/controlado
- **By metric**: Accuracy for each of the 18 field types
- **By project type**: Accuracy across 10 business types
- **By difficulty**: Accuracy across simple/medium/complex

### 2. Error Metrics (per model)
- **Mean Absolute Error (MAE)**: avg(|LLM - Oracle|) per metric
- **Root Mean Square Error (RMSE)**: sqrt(avg((LLM - Oracle)²)) per metric
- **Mean Absolute Percentage Error (MAPE)**: avg(|LLM - Oracle| / |Oracle|) × 100
- **Max Error**: worst-case error per metric per model
- **Median Error**: robust central tendency

### 3. Categorical Metrics
For viability classification (NPV > 0 → "Viable", NPV ≤ 0 → "Not Viable"):
- **True Positive**: Both Oracle and LLM say viable
- **False Positive**: Oracle says not viable, LLM says viable
- **False Negative**: Oracle says viable, LLM says not viable
- **True Negative**: Both say not viable
- **Precision, Recall, F1 Score** per model

### 4. Error Type Classification
For each mismatch, classify error type:
- **Arithmetic error**: Correct approach, wrong calculation (error < 20%)
- **Conceptual error**: Wrong formula/approach (error > 20% or wrong sign)
- **Hallucination**: Value has no relationship to inputs (error > 100%)
- **Format error**: Missing field, wrong type, or unparseable
- **Null mismatch**: LLM returned null when Oracle has value, or vice versa

### 5. Aggregate Metrics
- **Overall accuracy ranking** across all 9 models
- **Per-task-category ranking** (NPV accuracy, IRR accuracy, etc.)
- **Proprietary vs Open-Source** group comparison
  - Proprietary: GPT-5.3, GPT-5.4, Claude Haiku/Sonnet/Opus, Gemini Flash/Pro
  - Open-Source: DeepSeek Chat, Grok Code

---

## Implementation

**Technology**: Node.js
**Script**: `Backend/benchmark/scripts/calculateMetrics.js` (new)

**Reuse from**:
- `Backend/benchmark/scripts/generateResults.js` — `calcNPV()`, `calcIRR()`, `calcIRRBisection()`, annual calculation logic
- `Backend/benchmark/scripts/aggregate.js` — aggregation patterns (byType, byMetric, byScenario)

**Output data structure**:
```javascript
{
  perModel: {
    "gpt-5.4": {
      overall: { exactMatchRate, closeMatchRate, mae, rmse, mape },
      byScenario: { optimista: {...}, normal: {...}, ... },
      byMetric: { npv: {...}, irr: {...}, revenue: {...}, ... },
      byProjectType: { cafeteria: {...}, software: {...}, ... },
      byDifficulty: { simple: {...}, medium: {...}, complex: {...} },
      viability: { tp, fp, fn, tn, precision, recall, f1 },
      errorTypes: { arithmetic: N, conceptual: N, hallucination: N, format: N }
    },
    // ... 8 more models
  },
  rankings: {
    overall: ["gpt-5.4", "claude-opus-4.6", ...],
    byTask: { npv: [...], irr: [...], ... }
  }
}
```

---

## Output
- `docs/benchmark/analysis/reports/metrics_full.json` — Complete metrics dataset
- `docs/benchmark/analysis/reports/metrics_summary.json` — Condensed per-model summary
- `docs/benchmark/analysis/reports/error_examples.json` — Sample errors per type per model
- Console ranking table

## Acceptance Criteria
- [ ] Oracle recalculation matches `generateResults.js` output
- [ ] All 9 models compared across all fields
- [ ] MAE, RMSE, MAPE calculated per metric per model
- [ ] Viability confusion matrix computed
- [ ] Error types classified
- [ ] Rankings generated
