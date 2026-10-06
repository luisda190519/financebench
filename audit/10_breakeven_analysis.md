# 10 — Break-Even Analysis

**Domain:** Break-even formula, fixed cost definition, contribution margin, EBT vs. EBIT basis
**File:** `Backend/src/models/Project.js` — lines 629–655 (revenue break-even), 504–515 (unit break-even)
**References:** Horngren, C. et al. (2015). *Cost Accounting* (15th ed.), Ch. 3; Garrison, R. et al. (2021). *Managerial Accounting* (17th ed.), Ch. 5

---

## Current Implementation

### Unit-Based Break-Even (Old System Only)

```javascript
// Project.js lines 504–515
if (!useItemsSystem && unitPrice > variableCostPerUnit) {
  const contributionMarginPerUnit = unitPrice - variableCostPerUnit;
  const firstYearFixedCosts =
    (expensesByYear[0]?.fixed || 0) +
    (depreciationByYear[0] || 0) +
    (interestByYear[0] || 0);

  if (contributionMarginPerUnit > 0 && firstYearFixedCosts > 0) {
    breakEvenPoint = Math.ceil(firstYearFixedCosts / contributionMarginPerUnit);
    breakEvenType = 'units';
  }
}
```

### Revenue-Based Break-Even (New Items System)

```javascript
// Project.js lines 629–655
if (breakEvenType === 'none' && annualData.length > 0) {
  const year1 = annualData[0];
  const revenue1 = year1.revenue || 0;
  const variable1 = year1.variableExpenses || 0;
  const fixedBase = (year1.fixedExpenses || 0) + (year1.depreciation || 0) + (year1.interestExpense || 0);

  if (revenue1 > 0 && variable1 < revenue1 && fixedBase > 0) {
    const variableCostRatio = variable1 / revenue1;
    const breakEvenRevenue = fixedBase / (1 - variableCostRatio);
    if (isFinite(breakEvenRevenue) && breakEvenRevenue > 0) {
      breakEvenPoint = breakEvenRevenue;
      breakEvenType = 'revenue';
    }
  }
}
```

---

## Canonical Formulas

### EBIT Break-Even (Operating Break-Even)

The most common textbook definition (Garrison, 2021, Ch. 5):
```
BEP_units  = FixedCosts / ContributionMarginPerUnit
BEP_revenue = FixedCosts / ContributionMarginRatio

where:
  FixedCosts = fixed operating expenses + depreciation  (no interest)
  ContributionMarginPerUnit = sellingPrice − variableCostPerUnit
  ContributionMarginRatio = ContributionMargin / Revenue = 1 − (variableCosts / revenue)
```

This gives the revenue/units where **EBIT = 0** (Operating Profit = 0).

### EBT Break-Even (Financial Break-Even)

```
BEP_EBT = (FixedCosts + Interest) / ContributionMarginRatio
```

This gives the revenue/units where **EBT = 0** (Earnings Before Tax = 0). Also called the "financial break-even" because it covers debt service.

### Cash Break-Even

```
BEP_cash = (FixedCosts + Interest + PrincipalPayments − Depreciation) / CM_Ratio
```

Excludes non-cash depreciation; includes principal repayments.

---

## Gap Analysis

| Aspect | Status | Notes |
|--------|--------|-------|
| Revenue BEP formula | 🟢 Compliant | `fixedBase / (1 − variableCostRatio)` is correct contribution margin formula |
| Unit BEP formula | 🟢 Compliant | `FixedCosts / CM_per_unit` with `Math.ceil` (rounds up for discrete units) |
| Break-even type (EBIT vs EBT) | 🟡 Warning | Uses EBT basis (interest included in `fixedBase`) — not EBIT basis |
| BEP type undocumented | 🟡 Warning | UI labels it "Punto de Equilibrio" without specifying EBIT/EBT/cash |
| Depreciation in fixed base | 🟡 Warning | Depreciation included → this is closer to EBIT break-even than cash break-even |
| Guard: `variable1 < revenue1` | 🟢 Compliant | Prevents `1 − ratio ≤ 0` denominator |
| Guard: `isFinite(breakEvenRevenue)` | 🟢 Compliant | Catches edge case of `CM_ratio = 1.0` exactly |
| Year 1 only | 🟡 Warning | Only year 1 data used; no per-year trend |
| Negative contribution margin | 🟢 Compliant | Unit BEP only computed when `unitPrice > variableCostPerUnit` |

---

## Findings

### F-13.1 — 🟡 Warning: EBT vs. EBIT Break-Even Basis

**Current behavior:** `fixedBase = fixedExpenses + depreciation + interestExpense`

This is the **EBT break-even** (financial break-even): the revenue level where EBT = 0 (before taxes). It includes interest expense.

The more common textbook definition is the **EBIT break-even** (operating break-even): `fixedBase = fixedExpenses + depreciation` (no interest). This answers "at what revenue does the business cover its operating costs?"

**Numeric example:**
- Year 1: fixedExpenses=200K, depreciation=50K, interestExpense=30K, variableCostRatio=0.40

| Break-even type | fixedBase | BEP Revenue |
|----------------|-----------|-------------|
| EBIT (operating) | 200K + 50K = 250K | 250K / 0.60 = **416,667** |
| EBT (financial, current) | 250K + 30K = 280K | 280K / 0.60 = **466,667** |
| Cash | 200K + 30K + principalPmt − no-depreciation | varies |

The difference is `interestExpense / CM_ratio = 30K / 0.60 = 50,000` higher for EBT break-even.

**Assessment:** Neither approach is wrong — they answer different questions. The EBT break-even is arguably more relevant for a startup viability tool because the entrepreneur needs to know when debt obligations are covered. However:
1. It should be labeled "Punto de Equilibrio Financiero" (not just "Punto de Equilibrio")
2. Research users comparing against textbook results will expect the EBIT basis and will see a discrepancy

**Proposed documentation fix:** Add the break-even type to the stored result:
```javascript
scenarioResults.push({
  // ...
  breakEvenPoint: ...,
  breakEvenType: 'revenue',
  breakEvenBasis: 'ebt'  // ← ADD: 'ebt' | 'ebit' | 'cash' | 'units'
});
```

And update the UI to display "Punto de Equilibrio Financiero (EBT = 0)" for clarity.

### F-13.2 — 🟢 Compliant: Revenue Break-Even Formula

`breakEvenRevenue = fixedBase / (1 − variableCostRatio)` is the standard contribution margin formula. Given the defined `fixedBase`, the arithmetic is correct.

**Proof:**
At break-even: `Revenue − VariableCosts − FixedBase = 0`
→ `Revenue × (1 − variableCostRatio) = fixedBase`
→ `Revenue = fixedBase / (1 − variableCostRatio)` ✓

### F-13.3 — 🟢 Compliant: Unit Break-Even Formula

`Math.ceil(firstYearFixedCosts / contributionMarginPerUnit)` is the standard unit break-even formula, with ceiling rounding appropriate for discrete unit sales.

### F-13.4 — 🟡 Warning: Year-1 Static Calculation

Break-even is computed only from year 1 data. For projects with significant cost inflation or price growth, the year-1 break-even may not accurately represent later years. A more complete analysis would compute break-even per year (or at least show the trend: is break-even getting easier or harder to reach?).

This is an enhancement, not a bug.

---

## Test Cases

### TC-10-A: Revenue BEP Verification
```
Year 1 data:
  revenue = 1,000,000
  variableExpenses = 400,000  → ratio = 0.40
  fixedExpenses = 200,000
  depreciation = 50,000
  interestExpense = 30,000

fixedBase = 280,000
BEP_revenue = 280,000 / (1 − 0.40) = 280,000 / 0.60 = 466,667

Expected breakEvenPoint: 466,666.67 → stored as 466,666.67 (2dp)
```

### TC-10-B: EBIT-Equivalent BEP (for comparison)
```
Same data, fixedBase without interest = 250,000
BEP_EBIT = 250,000 / 0.60 = 416,667

The difference (50,000) = interestExpense / CM_ratio = 30,000 / 0.60
```

### TC-10-C: Unit BEP (Old System)
```
unitPrice = 50,000
variableCostPerUnit = 30,000
contributionMarginPerUnit = 20,000
firstYearFixedCosts = fixedExpenses(200K) + depreciation(50K) + interest(30K) = 280,000

BEP = Math.ceil(280,000 / 20,000) = Math.ceil(14) = 14 units
```

### TC-10-D: Zero Contribution Margin Guard
```
variableCostRatio = 1.0  → (1 − ratio) = 0 → infinite BEP
Expected: breakEvenPoint not set (guarded by `variable1 < revenue1`)
```

### TC-10-E: Negative Margin Guard
```
variableCostRatio = 1.2 → variable costs exceed revenue
Expected: condition `variable1 < revenue1` is false → no break-even computed
```

---

*References:*
- Garrison, R., Noreen, E. & Brewer, P. (2021). *Managerial Accounting*, 17th ed., Ch. 5 — Cost-Volume-Profit Relationships
- Horngren, C. et al. (2015). *Cost Accounting*, 15th ed., Ch. 3 — Cost-Volume-Profit Analysis
