# 12 — Sensitivity Analysis & Scenario Comparisons

**Domain:** Discount rate sensitivity (exact), growth/volume sensitivity (approximate), tornado chart, scenario independence
**File:** `Frontend/src/components/SensitivityAnalysis.jsx` — lines 56–165
**References:** Damodaran, *Investment Valuation* (3rd ed.), Ch. 5 — Scenario Analysis; Brealey, Myers & Allen, *Principles of Corporate Finance* (13th ed.), Ch. 10

---

## Current Implementation

### Discount Rate Sensitivity (Exact)

```javascript
// SensitivityAnalysis.jsx lines 56–75
const variations = [-10, -5, -2, 0, 2, 5, 10];
return variations.map(variation => {
  const testRate = baseDiscountRate + variation;
  const cashFlows = [-initialInvestment, ...currentScenario.annualData.map(d => d.leveredCashFlow || 0)];
  const testNPV = safeNPV(cashFlows, testRate, 0);
  return {
    variation: variation > 0 ? `+${variation}%` : `${variation}%`,
    rate: testRate,
    npv: testNPV,
    change: testNPV - baseNPV,
    changePercent: baseNPV !== 0 ? ((testNPV - baseNPV) / Math.abs(baseNPV)) * 100 : 0
  };
});
```

### Growth Rate Sensitivity (Approximation)

```javascript
// SensitivityAnalysis.jsx lines 78–99
return variations.map(variation => {
  const growthImpact = (variation / 100) * 0.3;   // ← F-10.2: hardcoded factor
  const testNPV = baseNPV * (1 + growthImpact);
  return { variation, growth: baseGrowth + variation, npv: testNPV, ... };
});
```

### Volume Sensitivity (Approximation)

```javascript
// SensitivityAnalysis.jsx lines 103–122
return variations.map(variation => {
  const volumeImpact = (variation / 100) * 0.4;   // ← F-10.3: hardcoded factor
  const testNPV = baseNPV * (1 + volumeImpact);
  return { ... };
});
```

### Scenario Comparison

```javascript
// Lines 158–165
return financialMetrics.map(scenario => ({
  name: scenario.name.charAt(0).toUpperCase() + scenario.name.slice(1),
  npv: safeNumber(scenario.npv, 0),
  irr: safeNumber(scenario.irr, null),
  paybackPeriod: safeNumber(scenario.paybackPeriod, null)
}));
```

---

## Canonical Approaches

### Discount Rate Sensitivity

The exact NPV at a different discount rate:
```
NPV(r') = Σ CF_t / (1 + r')^t
```
This is a closed-form calculation — no approximation needed. Current implementation does this correctly.

### Growth Rate / Volume Sensitivity (Exact Method)

The correct approach rebuilds the cash flows with the modified parameter and recalculates NPV from scratch:
```
NPV(g + Δg) = Σ [CF_t(g + Δg)] / (1 + r)^t
```

Where `CF_t(g + Δg)` requires re-running the entire revenue → expense → P&L → CF pipeline with the modified growth rate. This cannot be done in a pure frontend component without either:
1. Re-running the full calculation in the frontend (duplicating backend logic), or
2. Calling a backend endpoint that accepts parameter overrides

### Sensitivity Factor Derivation (If Approximation Must Be Used)

For a project where revenue = `R₀ × (1+g)^(t-1)` and all other things equal:
```
dNPV/dg ≈ Σ [t-1] × CF_t / (1+g)(1+r)^t
```

This elasticity varies by: operating leverage (high fixed costs → high sensitivity), discount rate, and project life. A universal factor of 0.3 or 0.4 is not derivable from any formula — it is an arbitrary guess.

---

## Gap Analysis

| Aspect | Status | Notes |
|--------|--------|-------|
| Discount rate sensitivity — exact | 🟢 Compliant | Uses `safeNPV()` with actual CFs |
| Discount rate uses levered CFs | 🟡 Note | Consistent with IRR; but inconsistent with primary NPV (unlevered) until F-09.1 is fixed |
| Growth sensitivity — approximation | 🟡 Warning | 0.3× factor is arbitrary (F-10.2) |
| Volume sensitivity — approximation | 🟡 Warning | 0.4× factor is arbitrary (F-10.3) |
| Approximations disclosed in UI | 🟢 Compliant | UI banner at lines 277–279 labels these "Estimación aproximada" |
| Tornado chart — mixed exact/approx | 🟡 Warning | Apples-to-oranges comparison in same chart |
| 4 scenarios fully independent | 🟢 Compliant | Each computed independently in backend (lines 476–704) |
| Scenario comparison uses stored metrics | 🟢 Compliant | Reads from `financialMetrics.scenarios[]` — no re-computation |

---

## Findings

### F-10.1 — 🟢 Compliant: Discount Rate Sensitivity

The discount rate sensitivity correctly recalculates NPV for each test rate using the exact NPV formula with actual levered cash flows. This is the most important sensitivity axis (most elastic for most projects) and it is computed exactly.

### F-10.2 — 🟡 Warning: Growth Rate Sensitivity Approximation

**Current:** `testNPV = baseNPV × (1 + (Δg / 100) × 0.3)`

**Why 0.3 is wrong:** The actual growth sensitivity coefficient is:

```
elasticity = (dNPV/dg) × g / NPV
```

This depends on:
- Operating leverage ratio (FixedCosts / Revenue)
- Discount rate and project life
- Current growth rate level

**Illustration of error:** For a high-leverage project with 80% fixed costs:
- True growth sensitivity may be 0.8× (every 1% growth → 0.8% NPV change)
- Approximation assumes 0.3× → error = (0.8 − 0.3) / 0.8 = **62.5% relative error**

For a low-leverage project with 20% fixed costs:
- True sensitivity may be 0.15×
- Approximation (0.3×) → **100% relative error** in the other direction

**Proposed fix:** Pass the full income data to the sensitivity calculator and rebuild cash flows for each scenario:
```javascript
// Pseudocode for exact growth sensitivity:
const exactGrowthSensitivity = variations.map(Δg => {
  const modifiedCFs = projectData.income.items.map(item => ({
    ...item, growthRate: (parseFloat(item.growthRate) || 0) + Δg
  }));
  // Recalculate NPV with modifiedCFs... (requires backend call or frontend CF engine)
  return { variation: Δg, npv: recalculatedNPV, ... };
});
```

Until a full recalculation is feasible, the approximation is acceptable with the existing "Estimación aproximada" disclaimer.

### F-10.3 — 🟡 Warning: Volume Sensitivity Approximation

Same issue as F-10.2 with a 0.4× factor. The 0.4 vs 0.3 distinction (volume is more elastic than growth) has no derivable basis.

### F-10.4 — 🟡 Warning: Tornado Chart Compares Exact and Approximate

The tornado chart (`impact range`) aggregates:
- Discount rate: **exact** NPV range
- Growth: **approximated** NPV range (0.3× factor)
- Volume: **approximated** NPV range (0.4× factor)

Comparing exact and approximate values in the same ranking chart may rank variables incorrectly. For example, if the true growth sensitivity is 0.8× but the approximation uses 0.3×, the tornado chart will show growth as less important than discount rate even if growth is actually the dominant driver.

**Proposed fix:** Either use exact for all three axes (backend call) or add a note in the chart legend distinguishing exact from approximate calculations.

### F-10.5 — 🟢 Compliant: Scenario Independence

The four scenarios (`optimista`, `normal`, `pesimista`, `controlado`) in `SensitivityAnalysis.jsx` read directly from `financialMetrics.scenarios[]` — the stored results from independent backend calculations. There is no mixing of parameters between scenarios. Each scenario's NPV, IRR, and payback are independently computed (confirmed in `Project.js` lines 476–730). Compliant.

---

## Test Cases

### TC-12-A: Discount Rate Sensitivity (Exact)
```
Base scenario: leveredCFs = [-100K, 40K, 40K, 40K], discountRate = 10%

NPV at 10% = -100K + 40K/1.1 + 40K/1.21 + 40K/1.331
           = -100K + 36,363.64 + 33,057.85 + 30,052.59 = -527 (just underwater)

NPV at 0% = -100K + 40K + 40K + 40K = +20,000

Verify: safeNPV([-100K, 40K, 40K, 40K], 0) = 20,000
Verify: safeNPV([-100K, 40K, 40K, 40K], 0.10) ≈ -527
Verify: variation=0 → testNPV = baseNPV exactly
```

### TC-12-B: Growth Approximation Error Magnitude
```
High-leverage project: 80% fixed costs, baseNPV = 500,000

With 0.3× factor: NPV(g+1%) = 500,000 × (1 + 0.003) = 501,500
True NPV change for 1% growth on high-leverage project: likely 4,000+ (>0.3%)
Expected approximation error: >60% of true sensitivity
```

### TC-12-C: Scenario Comparison Read Integrity
```
normalScenario.npv = 250,000 (stored in DB)
Read in sensitivity chart: should display 250,000
Expected: no recalculation, direct passthrough
```

### TC-12-D: Tornado Chart Rank Order
```
discountRate impact (exact) = ±80,000 range (for ±10% variation)
growthRate impact (approximate 0.3×) = ±30,000 range
volumeImpact (approximate 0.4×) = ±40,000 range

tornado shows: discountRate > volume > growth
But if true growth sensitivity is 0.8×:
  true growth range = ±80,000
  true ranking: discountRate ≈ growth > volume (different ranking)
```

---

*References:*
- Damodaran, A. (2012). *Investment Valuation*, 3rd ed., Ch. 5 — Risk and Return in Investment Analysis
- Brealey, R., Myers, S. & Allen, F. (2020). *Principles of Corporate Finance*, 13th ed., Ch. 10 — Project Analysis
- Saltelli, A. et al. (2008). *Global Sensitivity Analysis: The Primer*. Wiley.
