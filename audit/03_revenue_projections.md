# 03 — Revenue Projections

**Domain:** Revenue formula, growth compounding convention, occupancy rate, periodsPerYear
**File:** `Backend/src/models/Project.js` — lines 475–570 (scenario revenue loop)
**References:** Damodaran, *Investment Valuation* (3rd ed.), Ch. 3 — Revenue Forecasting

---

## Current Implementation

### New Items System (Task 49)

```javascript
// Project.js lines 530–545 — revenue per item, per scenario, per year
(project.income.items || []).forEach(item => {
  const sv = item.scenarios?.[scenario.name] || {};
  const sellingPrice = parseFloat(sv.sellingPrice) || 0;
  const unitCost = parseFloat(sv.unitCost) || 0;
  const quantity = parseFloat(sv.quantity) || 0;
  const discount = Math.min(100, Math.max(0, parseFloat(sv.discount) || 0));
  const effectivePrice = sellingPrice * (1 - discount / 100);
  const itemPeriods = parseInt(item.periodsPerYear) || globalPeriodsPerYear;
  const growthFactor = Math.pow(1 + (parseFloat(item.growthRate) || 0) / 100, yearIndex);
  const annualQty = quantity * itemPeriods * growthFactor;
  revenue += effectivePrice * annualQty;
  totalCOGS += unitCost * annualQty;
});
```

Where `yearIndex = year - 1` (so year 1 → yearIndex 0).

### Old System (Backward Compatibility)

```javascript
// Old single-product model
const unitsThisYear = baseUnitsPerPeriod * Math.pow(1 + growthRate, yearIndex);
const effectiveUnits = unitsThisYear * occupancyRate;
const totalUnitsPerYear = effectiveUnits * globalPeriodsPerYear;
revenue = unitPrice * totalUnitsPerYear;
totalCOGS = variableCostPerUnit * totalUnitsPerYear;
```

---

## Canonical Formula

**Standard DCF revenue projection** (Damodaran, 2012):
```
Revenue_t = Revenue_0 × (1 + g)^(t−1)   for t = 1, 2, ..., n
```

Expanded with item-level detail:
```
Revenue_t = Σ_items [ EffectivePrice × Quantity × PeriodsPerYear × (1 + g_item)^(t−1) ]
```

Where:
- `t` = year number (1-indexed)
- `g_item` = annual growth rate of item i
- `(1 + g)^(t−1)` = `(1 + g)^yearIndex` since `yearIndex = t − 1`
- `EffectivePrice = SellingPrice × (1 − Discount/100)`

**Discount application (IAS 18.10):** Revenue is measured at the fair value of consideration received; discounts reduce the transaction price.

---

## Gap Analysis

| Aspect | Status | Notes |
|--------|--------|-------|
| Growth formula: `(1+g)^yearIndex` | 🟢 Compliant | `yearIndex = year-1` → no growth in year 1 (base year convention) |
| Growth convention documented | 🟡 Warning | `(1+g)^(t-1)` convention not in code comments or UI — LLM error source |
| Discount validation | 🟢 Compliant | `Math.min(100, Math.max(0, ...))` clamps to [0,100] |
| Zero growth | 🟢 Compliant | `g=0` → `(1+0)^0=1` always, revenue flat |
| Negative growth | 🟢 Compliant | `g=-0.5` → `0.5^yearIndex` → revenue decays (handled) |
| periodsPerYear fallback | 🟢 Compliant | Falls back to `globalPeriodsPerYear` when per-item not set |
| 4 scenarios independent | 🟢 Compliant | Each scenario processes its own `sv` parameters |
| COGS aggregated with revenue | 🟢 Compliant | `totalCOGS += unitCost * annualQty` runs in same loop |
| occupancyRate bounds | 🟢 Compliant | Clamped to [0,100] range then divided by 100 |

---

## Findings

### F-05.1 — 🟢 Compliant: Revenue Formula

The formula `EffectivePrice × Quantity × PeriodsPerYear × (1 + g)^(year−1)` is mathematically correct and internally consistent. Revenue in year 1 equals the base (no compounding), and each subsequent year applies cumulative growth. This is the "end-of-year 1 as base" or "zero-growth-in-year-1" convention.

### F-05.2 — 🟡 Warning [RESEARCH CRITICAL]: Growth Year Indexing Convention Undocumented

**Issue:** The `(1+g)^(t-1)` convention is:
- Not mentioned in any code comment in the revenue or expense calculation loops
- Not documented in the UI (the growth rate input shows no hint about when growth first applies)
- The opposite of what many LLMs assume (`(1+g)^t`, applying growth from year 1)

**Why this matters for FinanceBench:** The benchmark evaluates LLM performance on revenue calculations. Per benchmark analysis documents, the `(1+g)^t` vs `(1+g)^(t-1)` distinction is the **single most common systematic error** in LLM outputs. An LLM using `(1+g)^t` will overstate year 1 revenue by a factor of `(1+g)`, and this error compounds across all years.

**Example — 5-year project, g=10%, base revenue 1,000,000:**

| Year | App (`(1+g)^(t-1)`) | LLM typical (`(1+g)^t`) | Overstatement |
|------|---------------------|-------------------------|---------------|
| 1 | 1,000,000 | 1,100,000 | +100,000 (+10%) |
| 2 | 1,100,000 | 1,210,000 | +110,000 (+10%) |
| 3 | 1,210,000 | 1,331,000 | +121,000 (+10%) |

**Proposed documentation fix:** Add a comment in the revenue calculation loop and in the UI tooltip for growthRate:
```
// Growth convention: year 1 uses base values (growthFactor = 1).
// Year 2 applies (1+g)^1, year 3 applies (1+g)^2, etc.
// This is the "base year = year 1" convention.
```

### F-05.3 — 🟢 Compliant: Scenario Independence

The four scenarios (`optimista`, `normal`, `pesimista`, `controlado`) each process their own `item.scenarios[scenarioName]` parameters independently. There is no parameter blending between scenarios. Correct.

### F-05.4 — 🟡 Warning: Old System Growth-Occupancy Interaction

In the old system, occupancy rate is applied to the already-grown units:
```javascript
const unitsThisYear = baseUnitsPerPeriod * Math.pow(1 + growthRate, yearIndex);
const effectiveUnits = unitsThisYear * occupancyRate;
```

This means occupancy applies as a fixed multiplier regardless of year, which is a reasonable simplification but may not reflect real startup ramp-up dynamics (where occupancy typically starts low and grows). Documented as a design choice, not a bug.

---

## Test Cases

| TC | Input | Expected Year 1 Revenue | Expected Year 3 Revenue |
|----|-------|------------------------|------------------------|
| TC-05-A | `price=1000, qty=100, periods=12, growth=10%` | `1000×100×12×1.0^0 = 1,200,000` | `1000×100×12×1.1^2 = 1,452,000` |
| TC-05-B | `price=500, qty=50, periods=365 (daily), growth=0%` | `500×50×365 = 9,125,000` | `9,125,000` (no growth) |
| TC-05-C | `price=1000, qty=100, periods=12, discount=20%` | `800×100×12 = 960,000` | `800×100×12×1.1^2 = 1,161,600` |
| TC-05-D | Two items: item1(price=500,qty=100,periods=12), item2(price=1000,qty=50,periods=4) | `500×100×12 + 1000×50×4 = 800,000` | verify additive |
| TC-05-E | `growth=-100%` (impossible collapse) | Base year: normal | Year 2: 0 (product gone) |

---

*References:*
- Damodaran, A. (2012). *Investment Valuation*, 3rd ed. Wiley Finance.
- IAS 18.10 — Revenue measurement at fair value
