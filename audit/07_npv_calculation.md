# 07 — NPV Calculation

**Domain:** Net Present Value formula, discount rate application, CF series consistency, fallback path
**File:** `Backend/src/models/Project.js` — lines 657–703
**Library:** `financial` npm package (line 2: `const { irr, npv } = require('financial')`)
**References:** Brealey, Myers & Allen, *Principles of Corporate Finance* (13th ed.), Ch. 2; Damodaran, *Investment Valuation* (3rd ed.), Ch. 5

---

## Current Implementation

```javascript
// Project.js lines 657–703
let npvResult = 0;
let irrResult = null;

try {
  // Primary path: NPV on unlevered cash flows
  const unleveredCashFlows = [-initialInvestment];
  annualData.forEach(data => {
    unleveredCashFlows.push(data.unleveredCashFlow);   // ITS-inclusive (F-08.1)
  });

  npvResult = npv(discountRate, unleveredCashFlows);   // ← financial library call

  // IRR on levered cash flows (inconsistent with NPV series — F-09.1)
  if (hasNegativeInitial && hasPositiveCashFlow) {
    try {
      irrResult = irr(cashFlows);                       // cashFlows = levered
      irrResult = Math.round(irrResult * 10000) / 100;
    } catch (irrError) {
      irrResult = this.calculateIRRCustom(cashFlows);   // fallback
    }
  }
} catch (error) {
  console.warn('NPV/IRR calculation error:', error.message);
  // Fallback: uses LEVERED cashFlows — inconsistent with primary unlevered path
  npvResult = this.calculateNPVCustom(cashFlows, discountRate);
  irrResult = this.calculateIRRCustom(cashFlows);
}
```

**Custom NPV fallback (lines 750–758):**
```javascript
projectSchema.methods.calculateNPVCustom = function(cashFlows, discountRate) {
  try {
    return cashFlows.reduce((sum, cashFlow, index) => {
      return sum + (cashFlow / Math.pow(1 + discountRate, index));
    }, 0);
  } catch (error) {
    return 0;
  }
};
```

---

## Canonical Formula

**NPV definition (Brealey et al., 2020, Ch. 2):**
```
NPV = Σ[t=0 to n] CF_t / (1 + r)^t
```

Where:
- `CF_0 = −InitialInvestment` (already in present value; divided by `(1+r)^0 = 1`)
- `r` = discount rate (expressed as decimal, e.g., 0.10 for 10%)
- `t` = period index (0 = investment, 1 = year 1, ..., n = year n)

**Discount rate interpretations:**
- If `r` = WACC → use unlevered FCF (UFCF)
- If `r` = cost of equity (ke) → use levered/equity CF (EFCF)

The two methods yield the same NPV when the same discount rate framework is applied consistently. Mixing CF series and discount rates produces an incorrect NPV.

---

## Gap Analysis

| Aspect | Status | Notes |
|--------|--------|-------|
| NPV formula: `Σ CF_t / (1+r)^t` | 🟢 Compliant | Both primary and fallback implement correctly |
| t=0 investment included at factor 1 | 🟢 Compliant | `financial.npv()` applies `(1+r)^0=1` to first element |
| Discount rate stored as decimal | 🟢 Compliant | Line 281: `discountRate / 100` before use |
| CF series: unlevered | 🟡 Warning (F-08.1) | Unlevered CF includes ITS — not true UFCF |
| CF series: NPV vs IRR consistency | 🔴 Mixed (F-09.1) | NPV uses unlevered; IRR uses levered |
| Fallback NPV uses levered CFs | 🔴 Inconsistency (F-09.2) | Silent switch on error |
| Intermediate rounding before NPV | 🟡 Warning (F-INT.1) | `annualData` values are pre-rounded to 2dp |
| r=-1 edge case | 🟡 Undefined | `1 + (-1) = 0` → division by zero — not guarded |
| All-negative CF series | 🟡 Warning | NPV will be negative; no special handling needed |

---

## Findings

### F-09.1 — 🟡 Warning [RESEARCH CRITICAL]: Mixed Cash Flow Bases

**Issue:** NPV uses `unleveredCashFlows` (ITS-inclusive), while IRR uses `cashFlows` (levered/equity CFs).

These two series are not coherent. A project where `IRR_levered > discountRate` does not imply `NPV_unlevered > 0`, and vice versa. The two metrics are measured on different theoretical bases.

**Canonical choice (one must be selected):**

| Approach | NPV Cash Flows | IRR Cash Flows | Discount Rate Interpretation |
|---------|----------------|----------------|------------------------------|
| **All-Levered** | EFCF (current `leveredCashFlow`) | EFCF | Cost of equity `ke` |
| **All-Unlevered** | True UFCF = `EBIT×(1−t)+D` | True UFCF | WACC |

**Recommendation for FinanceBench:** Use **all-levered** approach. Reasons:
1. `leveredCashFlow` is already correctly computed
2. The existing fallback `calculateNPVCustom(cashFlows, ...)` uses levered CFs — aligning with the fallback is a smaller change
3. For startup entrepreneurs without a WACC estimate, the equity CF approach is simpler to explain
4. Fixes F-09.1 and F-09.2 simultaneously with a 2-line change

**Proposed fix:**
```javascript
// Replace lines 663–666:
// Change: use levered CFs for NPV (consistent with IRR)
const leveredCashFlowsForNPV = [-initialInvestment, ...annualData.map(d => d.leveredCashFlow)];
npvResult = npv(discountRate, leveredCashFlowsForNPV);
```

*The IRR calculation at lines 680 already uses `cashFlows` (levered) — no change needed there.*

### F-09.2 — 🟡 Warning: Fallback NPV Path Uses Levered CFs

**Issue (line 702):**
```javascript
// Error fallback:
npvResult = this.calculateNPVCustom(cashFlows, discountRate);  // cashFlows = levered
```

While the primary path at line 668 uses `unleveredCashFlows`, the error fallback uses `cashFlows` (levered). If the `financial` npm library throws for any reason, the NPV result silently switches to a different CF series.

**Fix:** After implementing F-09.1 (both use levered), this inconsistency is automatically resolved because both primary and fallback will use the same levered series.

### F-09.3 — 🟢 Compliant: IRR Storage Format

**Line 687:**
```javascript
irrResult = Math.round(irrResult * 10000) / 100;
```

The `financial.irr()` library returns a decimal (e.g., `0.1545` for 15.45%). Multiplying by `10000` then dividing by `100` converts to percentage with 2 decimal places: `15.45`. This is stored in the database and displayed with "%" appended in the UI.

The UI components correctly interpret this as a percentage (e.g., `CashFlow.jsx` comment: "IRR is already stored as percentage from backend"). Consistent throughout. No error.

### F-NPV.4 — 🟡 Warning: Edge Case r = −1 or r < −1

If `discountRate = -100%` (or worse), `(1 + r) = 0` causes division by zero. The `financial` library may throw or return NaN. The outer `try/catch` at line 699 catches this and falls through to the fallback, which also divides by 0. Both paths return NaN or throw.

For financial viability modeling, a discount rate of ≤ −100% is nonsensical. Validation at the input layer should prevent `discountRate < -99%`.

---

## Test Cases

All calculated with `discountRate = 10% = 0.10`, `initialInvestment = 100,000`:

### TC-07-A: Simple 2-Year Project
```
CF_0 = -100,000
CF_1 = +60,000
CF_2 = +70,000

NPV = -100,000 + 60,000/1.10 + 70,000/1.21
    = -100,000 + 54,545.45 + 57,851.24
    = +12,396.69 COP
```
**Verify current output matches (regardless of levered vs unlevered — same CFs for zero-debt project).**

### TC-07-B: r = 0 (No Discount)
```
CF_0 = -100,000; CF_1 = 40,000; CF_2 = 40,000; CF_3 = 40,000
NPV = -100,000 + 40,000 + 40,000 + 40,000 = +20,000
```

### TC-07-C: All-Negative Project (No Viable IRR)
```
CF_0 = -100,000; CF_1 = -10,000; CF_2 = -5,000
NPV at 10% = -100,000 − 9,090.91 − 4,132.23 = -113,223.14
```
IRR should be `null` (no positive cash flows). Verify `irrResult = null`.

### TC-07-D: NPV/IRR Consistency Check (Zero-Debt Project)
- For an unlevered project, `unleveredCF ≡ leveredCF`
- Verify: `IRR > 10%` if and only if `NPV_at_10% > 0`
- If the fix is applied (all-levered), this should hold for leveraged projects too

---

*References:*
- Brealey, R., Myers, S. & Allen, F. (2020). *Principles of Corporate Finance*, 13th ed., Ch. 2
- Damodaran, A. (2012). *Investment Valuation*, 3rd ed., Ch. 5 — NPV and Other Investment Rules
- npm `financial` package documentation — `npv(rate, cashFlows)` where `cashFlows[0]` is the t=0 flow
