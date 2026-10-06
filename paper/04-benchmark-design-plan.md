# Section 4: Benchmark Design — Plan

## Objective
The core technical section. Describe the complete benchmark architecture with enough detail for replication. This is where the codebase advantage shines — reference actual formulas, algorithms, and data structures.

## Word Count Target
1500–1800 words

## Figures & Tables
- **Table 1**: Task taxonomy (10 categories)
- **Table 2**: Business type summary (10 types)
- **Figure 1**: FinanceBench pipeline architecture diagram
- **Figure 2**: Example case walkthrough

## Structure (6 subsections)

---

### 4.1 Design Principles (200–250 words)

Five guiding principles with brief justification:

1. **Deterministic Reproducibility**
   - All test cases generated from Mulberry32 seeded PRNG
   - Implementation: `mulberry32(seed)` in `Backend/benchmark/generator/utils.js`
   - Algorithm: `s = (s + 0x6D2B79F5) | 0; t = Math.imul(s ^ (s >>> 15), s | 1); ...`
   - No external dependencies; platform-independent; same seed → identical dataset
   - Cite: follow HELM's emphasis on reproducible evaluation conditions

2. **Oracle-Based Ground Truth**
   - Unlike benchmarks relying on human annotations (subject to disagreement), FinanceBench uses a computational oracle
   - `calculateMetrics()` in `Backend/src/models/Project.js` produces exact numerical answers
   - Eliminates inter-annotator disagreement for numerical tasks
   - Cite: Artstein & Poesio [Cat 5] for annotation limitations; position oracle as superior for numerical evaluation

3. **Realistic Complexity**
   - Cases model real businesses with: multiple income items (product/service level), expense categories with 4 frequency types, fixed assets with depreciation, multi-source financing with individual amortization
   - Not toy examples — comparable to what a financial analyst would encounter

4. **Multi-Scenario Coverage**
   - Each case analyzed under 4 economic scenarios (optimista, normal, pesimista, controlado)
   - Tests whether model maintains consistent reasoning across parameter variations
   - Scenario ordering constraint: optimista revenue ≥ normal ≥ pesimista

5. **Graduated Difficulty**
   - Simple (40/type): 2 income items, 3 expenses, basic financing
   - Medium (40/type): 4 income items, 4–5 expenses, additional fixed assets
   - Complex (20/type): 7+ items, 6+ expenses, custom fields, multiple debt sources
   - Enables fine-grained capability assessment across complexity levels

**Figure 1**: Pipeline diagram
```
Seed → [Generator] → Input-Only JSON → [LLM] → Complete JSON → [Oracle] → Ground Truth
                                                                     ↓
                                              [Comparison Engine] ← ─┘
                                                     ↓
                                              Match/Small/Large per field
                                                     ↓
                                              Accuracy Report
```

---

### 4.2 Task Taxonomy (300–400 words)

**Table 1**: The 10 task categories, each mapped to specific oracle computation.

| # | Task Category | Oracle Computation | Reasoning Type | Difficulty | # Metrics |
|---|--------------|-------------------|---------------|-----------|-----------|
| 1 | NPV Calculation | `npv(discountRate, unleveredCashFlows)` — financial library + custom fallback (`Σ CF_t/(1+r)^t`) | Arithmetic + Financial | Medium | 1/scenario |
| 2 | IRR Calculation | `irr()` library → Newton-Raphson (100 iter, tol 1e-6) → Bisection fallback | Root-finding | Hard | 1/scenario |
| 3 | Cash Flow Projection | `unleveredCF = EBIT + depreciation - taxes`; `leveredCF = netProfit + depreciation - principal` per year | Multi-step sequential | Medium | 2/year/scenario |
| 4 | Scenario Generation | 4 scenarios with per-item price/quantity/discount variation | Parametric variation | Medium | All × 4 |
| 5 | Break-Even Analysis | Units: `fixedCosts / (price - variableCost)`; Revenue: `fixedCosts / (1 - varCostRatio)` | Algebraic | Easy–Medium | 1/scenario |
| 6 | Capital Structure | French amortization: `PMT = P × r / (1-(1+r)^-n)`, monthly → annual interest/principal split | Amortization schedule | Medium–Hard | Interest + principal/year |
| 7 | Financial Indicators | Revenue, COGS, grossProfit, grossMargin%, EBITDA, operationalProfit, netProfit | Multi-metric | Easy–Medium | 8+/year |
| 8 | Income Statement | Full cascading chain: revenue → COGS → gross → expenses → EBITDA → depreciation → EBIT → interest → EBT → taxes → net | Sequential chain (12 steps) | Hard | 15 fields/year |
| 9 | Sensitivity Analysis | NPV/IRR variation under ±2%, ±5%, ±10% discount rate changes | Parametric sweep | Medium | Derived |
| 10 | Viability Recommendation | Synthesis: NPV sign + IRR vs discountRate + payback < projectLife | Judgment | Medium | Qualitative |

**Key narrative points**:
- Tasks 1–8 have **exact numerical ground truth** from oracle
- Tasks 9–10 are evaluated via **derived metrics** or qualitative assessment
- Tasks form a natural hierarchy: Task 7 (indicators) feeds Task 8 (statements), which feeds Task 3 (cash flows), which feeds Tasks 1–2 (NPV/IRR)
- This cascading dependency means errors in simpler tasks propagate to complex ones

---

### 4.3 Data Generation (400–500 words)

**Template system**:
- 10 template files in `Backend/benchmark/generator/templates/`
- Each template generates cases for one business type with realistic Colombian parameters

**Table 2**: Business types

| Type | Template File | Investment Range (COP) | Products (Simple/Med/Complex) | Key Characteristics |
|------|-------------|----------------------|------------------------------|-------------------|
| Cafetería | cafeteria.js | $20M–$150M | 2/4/7 | Daily sales (365 periods/year), food & beverage |
| Software/SaaS | software.js | $5M–$80M | 2/4/7 | Monthly subscriptions (12/year), low COGS (~12%) |
| Retail | retail.js | $15M–$200M | 2/4/7 | Physical store, seasonal variation |
| Construcción | construccion.js | $50M–$1B | 2/4/7 | High capex, project-based revenue |
| Manufactura | manufactura.js | $30M–$500M | 2/4/7 | Production with complex cost structure |
| Consultoría | consultoria.js | $3M–$30M | 2/4/7 | Services-based, minimal capex |
| E-commerce | ecommerce.js | $5M–$50M | 2/4/7 | Online sales, inventory-heavy |
| Agricultura | agricultura.js | $10M–$100M | 2/4/7 | Seasonal, long gestation periods |
| Finca Raíz | fincaRaiz.js | $80M–$1B | 2/4/7 | Real estate, long amortization, high ticket |
| Hospedaje | hospedaje.js | $50M–$500M | 2/4/7 | Occupancy-based, tourism seasonality |

**Generation anatomy** (using cafeteria as example):
- Product catalog with realistic COP prices (Café Espresso COP 4,000–6,000, cost ratio 28%)
- Investment components: renovation, equipment (espresso machine, grinder), furniture
- Expenses: rent (monthly), payroll (monthly), raw materials (monthly), marketing (quarterly)
- Financing: `buildFinancing(totalInvestment, r, maxDebtRatio=0.7)` distributes between partners + external loan
- Scenario parameters: optimista (+30% quantity, +10% price), pesimista (−35% quantity, −10% price)

**Difficulty calibration details**:
- **Simple**: 2 income items, 3 expense items, 1 financing source, no custom fields
- **Medium**: 4 income items, 4–5 expenses, 1–2 fixed assets, marketing expenses added
- **Complex**: 7+ income items, 6+ expenses, custom investment fields (e.g., "Software POS" with depreciation), multiple debt sources with different rates/terms

**Scale**: 1,000 total = 10 types × (40 simple + 40 medium + 20 complex)

**Validation** (`Backend/benchmark/generator/validate.js`):
- Structural checks: required fields present (projectName, projectLife 1–50, taxRate, discountRate)
- Numeric checks: all amounts non-negative and finite
- Income checks: at least one income source per case
- Scenario ordering: optimista revenue ≥ pesimista
- All 1,000 cases must pass validation before the dataset is finalized

---

### 4.4 Oracle Engine (300–350 words)

**The 12-step computation chain** from `calculateMetrics()` in `Backend/src/models/Project.js` (lines 276–858):

1. **Initial Investment** (lines 245–255): Sum of 8 standard fields + Σ(fixedAssets.value) + Σ(customFields.value)

2. **Financing Gap** (lines 267–270): `externalLoan = max(0, initialInvestment - partners - customSources)`

3. **Loan Amortization** (lines 321–362): French system
   - `monthlyRate = annualRate / 100 / 12`
   - `monthlyPayment = principal × monthlyRate × (1+monthlyRate)^n / ((1+monthlyRate)^n - 1)`
   - Per-month interest/principal split accumulated into year buckets
   - Multiple debt sources amortized independently

4. **Depreciation** (lines 368–414): Straight-line
   - `annualDepreciation = assetValue / usefulLife` for min(usefulLife, projectLife) years
   - Includes fixed assets + depreciable custom fields

5. **Revenue** (lines 523–565): Per item, per scenario, per year:
   - `revenue = sellingPrice × (1 - discount%) × quantity × periodsPerYear × (1 + growthRate)^(year-1)`

6. **COGS** (line 524): `unitCost × quantity × periodsPerYear × (1 + growthRate)^(year-1)`

7. **Expenses** (lines 417–468): Frequency-normalized with growth:
   - monthly ×12, quarterly ×4, annual ×1, one-time at year 0 only
   - `annualAmount = base × frequencyMultiplier × (1 + growthRate)^(year-1)`

8. **EBITDA** (line 578): `revenue - totalExpenses`

9. **EBIT** (line 580): `EBITDA - depreciation`

10. **Taxes with Loss Carryforward** (lines 584–593):
    - `taxableIncome = EBT + carryforward`
    - If positive: `taxes = taxableIncome × taxRate`; carryforward = 0
    - If negative: taxes = 0; carryforward = |taxableIncome|

11. **Cash Flows** (lines 599–601):
    - `unleveredCF = EBIT + depreciation - taxes`
    - `leveredCF = netProfit + depreciation - principalPayment`

12. **NPV/IRR/Payback** (lines 657–716):
    - NPV: `financial.npv()` with custom fallback
    - IRR: `financial.irr()` → Newton-Raphson (100 iter, tol 1e-6, bounds [-0.99, 100]) → Bisection
    - Payback: linear interpolation when cumulative leveredCF ≥ 0

**Key technical narrative**: Emphasize that this is a production system used by real entrepreneurs, not a simplified academic prototype. The formulas follow standard corporate finance practice.

---

### 4.5 Comparison Engine (200–250 words)

From `compareAnalysis()` in `Backend/src/controllers/projectController.js` (lines 619–690):

**Three-tier classification**:
- **Match** (green): relative error ≤ 1% → field is essentially correct
- **Small difference** (yellow): 1% < relative error ≤ 5% → minor deviation, likely rounding or convention difference
- **Large difference** (red): relative error > 5% → significant error requiring investigation

**Relative error computation**:
```
diffPercent = |jsonValue - appValue| / |appValue|    (if appValue ≠ 0)
diffPercent = (jsonValue ≠ 0) ? 1.0 : 0.0           (if appValue = 0)
```

**Fields compared per scenario** (4 scenarios each):
- 4 scenario-level metrics: NPV, IRR, paybackPeriod, breakEvenPoint
- 15 annual metrics × N years: revenue, totalCOGS, grossProfit, grossMarginPct, fixedExpenses, variableExpenses, totalExpenses, ebitda, depreciation, operationalProfit, interestExpense, taxes, netProfit, unleveredCashFlow, leveredCashFlow

**Total fields** for 5-year project: 4 scenarios × (4 + 15×5) = 4 × 79 = **316 individual comparisons**

**Summary statistics**:
- `overallAccuracy = exactMatches / totalFields`
- `avgErrorPercent = mean(diffPercent)` across non-N/A fields
- Breakdown by scenario, by metric, by year

**Null handling**: If either JSON or oracle value is null/undefined → status = "N/A", excluded from accuracy calculation

---

### 4.6 Example Cases (200–250 words)

**Figure 2**: Walk through one concrete case (cafeteria, simple difficulty, seed=42):

**Input snippet**:
```json
{
  "general": { "projectName": "Cafetería Aroma del Valle", "projectLife": 5, "taxRate": 33, "discountRate": 12 },
  "income": {
    "periodsPerYear": 365,
    "items": [
      { "name": "Café Espresso", "scenarios": { "normal": { "sellingPrice": 4500, "unitCost": 1260, "quantity": 85, "discount": 0 } } },
      { "name": "Cappuccino", "scenarios": { "normal": { "sellingPrice": 6000, "unitCost": 1680, "quantity": 55, "discount": 0 } } }
    ]
  }
}
```

**Expected oracle output** (normal scenario, year 1):
- Revenue: COP 259,237,500
- COGS: COP 72,687,000
- Gross Profit: COP 186,550,500
- ... (cascade through to NPV, IRR)

**Comparison result example**:
| Metric | LLM Output | Oracle | Diff% | Status |
|--------|-----------|--------|-------|--------|
| Revenue Y1 | 259,237,500 | 259,237,500 | 0.00% | ✅ Match |
| COGS Y1 | 73,000,000 | 72,687,000 | 0.43% | ✅ Match |
| NPV | 145,200,000 | 152,340,000 | 4.69% | ⚠️ Small |
| IRR | 28.5% | 31.2% | 8.65% | ❌ Large |

**Narrative**: Show how a model can get revenue right but accumulate errors through the cascade, resulting in significant NPV/IRR deviation.

---

## References (~6 total)
- HELM [Cat 1] — reproducibility standards
- FinBen [Cat 3] — complementary positioning
- FinQA [Cat 3] — closest prior numerical financial benchmark
- Artstein & Poesio [Cat 5] — annotation limitations that oracle solves
- Krippendorff [Cat 5] — inter-coder reliability context
- GSM8K [Cat 2] — comparison of problem complexity

## Technical Details from Codebase
- **Every formula** from `calculateMetrics()` with line references
- **Mulberry32 algorithm** from utils.js
- **Comparison thresholds** from compareAnalysis()
- **Template structure** from cafeteria.js
- **Validation rules** from validate.js

## Writing Notes
- Write this section FIRST — it is the heart of the paper
- Be precise about formulas and algorithms — this is what reviewers will scrutinize
- Use the example case to make the abstract concepts concrete
- The oracle description must convince reviewers that the ground truth is correct
