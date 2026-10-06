# 08 — IRR Calculation

**Domain:** Internal Rate of Return — Newton-Raphson implementation, bisection fallback, convergence, multiple IRR problem
**File:** `Backend/src/models/Project.js` — lines 678–697 (primary), 761–807 (Newton-Raphson), 810–858 (Bisection)
**Library:** `financial` npm package (primary path)
**References:** Brealey, Myers & Allen, *Principles of Corporate Finance* (13th ed.), Ch. 5; Press et al., *Numerical Recipes*, Ch. 9

---

## Current Implementation

### Primary Path (financial library)

```javascript
// Project.js lines 678–697
irrResult = irr(cashFlows);   // cashFlows = [-initialInvestment, ...leveredCashFlows]

if (isNaN(irrResult) || !isFinite(irrResult)) {
  irrResult = null;
} else {
  irrResult = Math.round(irrResult * 10000) / 100;  // decimal → percentage
  if (irrResult < -99 || irrResult > 10000) irrResult = null;
}
```

### Fallback 1: Newton-Raphson (lines 761–807)

```javascript
projectSchema.methods.calculateIRRCustom = function(cashFlows) {
  let rate = 0.1;  // initial guess: 10%
  const maxIterations = 100;
  const tolerance = 1e-6;

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let derivative = 0;

    for (let j = 0; j < cashFlows.length; j++) {
      const cashFlow = parseFloat(cashFlows[j]) || 0;
      const denominator = Math.pow(1 + rate, j);
      npv += cashFlow / denominator;
      if (j > 0) {
        derivative -= j * cashFlow / (denominator * (1 + rate));
      }
    }

    if (Math.abs(npv) < tolerance) {
      return Math.round(rate * 10000) / 100;
    }
    if (Math.abs(derivative) < tolerance) break;  // avoid division by zero

    const newRate = rate - npv / derivative;
    if (Math.abs(newRate - rate) < tolerance) {
      return Math.round(newRate * 10000) / 100;
    }
    rate = Math.max(-0.99, Math.min(100, newRate));  // bound the rate
  }
  return this.calculateIRRBisection(cashFlows);
};
```

### Fallback 2: Bisection (lines 810–858)

```javascript
projectSchema.methods.calculateIRRBisection = function(cashFlows) {
  let lowerBound = -0.99;
  let upperBound = 100;
  const maxIterations = 100;
  const tolerance = 1e-6;

  const calculateNPV = (rate) =>
    cashFlows.reduce((sum, cf, i) => sum + cf / Math.pow(1 + rate, i), 0);

  let npvLower = calculateNPV(lowerBound);
  let npvUpper = calculateNPV(upperBound);

  if (npvLower * npvUpper >= 0) return null;  // no root in interval

  for (let i = 0; i < maxIterations; i++) {
    const midPoint = (lowerBound + upperBound) / 2;
    const npvMid = calculateNPV(midPoint);

    if (Math.abs(npvMid) < tolerance) return Math.round(midPoint * 10000) / 100;

    if (npvMid * npvLower < 0) { upperBound = midPoint; npvUpper = npvMid; }
    else { lowerBound = midPoint; npvLower = npvMid; }

    if (Math.abs(upperBound - lowerBound) < tolerance) break;
  }
  return Math.round(((lowerBound + upperBound) / 2) * 10000) / 100;
};
```

---

## Canonical Formula

**IRR definition:** The rate `r*` that makes `NPV = 0`:
```
Σ[t=0 to n] CF_t / (1 + r*)^t = 0
```

**Newton-Raphson iteration:**
```
r_{k+1} = r_k − f(r_k) / f'(r_k)

f(r) = Σ CF_t / (1+r)^t          [NPV function]
f'(r) = Σ [−t × CF_t / (1+r)^(t+1)]   [derivative]
```

**Bisection:** Given two rates `a`, `b` where `NPV(a) × NPV(b) < 0` (sign change), the root lies in `[a, b]`. Repeatedly halve the interval.

---

## Gap Analysis

| Aspect | Status | Notes |
|--------|--------|-------|
| Primary library call | 🟢 Compliant | `financial.irr()` is a well-tested library |
| NaN/Infinity validation | 🟢 Compliant | Lines 683–684 catch non-finite results |
| Storage format | 🟢 Compliant | `×10000/100` converts decimal to percentage correctly |
| Reasonable bounds check | 🟢 Compliant | `-99` to `10000` percent filters unreasonable results |
| Newton-Raphson derivative formula | 🟢 Compliant | `−j × CF_j / (1+r)^(j+1)` is correct |
| N-R tolerance | 🟡 Warning | `1e-6` is adequate for display purposes; research standard recommends `≤1e-8` |
| N-R initial guess | 🟡 Warning | Fixed `0.10` (10%); may fail to converge for IRR far from 10% |
| Bisection interval `[-0.99, 100]` | 🟡 Warning | Upper bound 100 (10000%) is correct but extreme; some valid high-return projects with short payback may hit issues |
| Multiple IRR warning | 🟡 Warning | No detection of non-conventional cash flows (>1 sign change) |
| Zero-investment edge case | 🟡 Warning | `cashFlows = [0, ...]` → denominator 0 in derivation |
| IRR when NPV always negative | 🟢 Compliant | `if (!hasPositiveCashFlow) irrResult = null` prevents attempt |
| Fallback chain integrity | 🟢 Compliant | library → Newton-Raphson → Bisection → null |

---

## Findings

### F-IRR.1 — 🟢 Compliant: Newton-Raphson Derivative Formula

The derivative of NPV with respect to `r`:
```
d(NPV)/dr = Σ[j=1 to n] [−j × CF_j / (1+r)^(j+1)]
```

Current code (line 776):
```javascript
derivative -= j * cashFlow / (denominator * (1 + rate));
```

Expanding: `denominator = (1+r)^j`, so `denominator × (1+r) = (1+r)^(j+1)`.
Therefore: `derivative -= j × CF_j / (1+r)^(j+1)` ✓ Correct.

### F-IRR.2 — 🟡 Warning: Convergence Tolerance

Current tolerance: `1e-6` for both N-R and Bisection. At this tolerance, the IRR error is at most `±0.0001%` (1 basis point). For display purposes (shown to 2dp as `15.45%`), this is more than adequate.

For research-grade accuracy, `1e-8` is recommended (ensures `NPV(IRR_result) < 0.01 COP` for billion-COP projects). The current `1e-6` is acceptable given intermediate rounding introduces larger errors.

### F-IRR.3 — 🟡 Warning: Multiple IRR Problem Not Detected

Non-conventional cash flows (more than one sign change after the initial negative investment) can have multiple real IRR values. The current implementation finds the first one via N-R from the 10% initial guess or bisection, but does **not**:
- Count sign changes to detect non-conventional cash flows
- Warn the user that multiple IRRs may exist
- Use MIRR (Modified IRR) as an alternative

The code comment at line 671–674 acknowledges this: "For non-conventional cash flows (multiple sign changes), there may be multiple IRRs."

**Risk for FinanceBench:** If benchmark cases include projects with mid-project reinvestment costs (sign changes), the IRR returned may not be the economically meaningful one.

**Proposed detection (non-breaking):**
```javascript
const signChanges = cashFlows.reduce((count, cf, i) => {
  if (i === 0) return 0;
  const prev = cashFlows[i - 1];
  return count + (prev * cf < 0 ? 1 : 0);
}, 0);
if (signChanges > 1) {
  console.warn('Multiple IRR warning: non-conventional cash flows detected');
}
```

### F-IRR.4 — 🟡 Warning: Fixed 10% Initial Guess for Newton-Raphson

Starting from `rate = 0.10` works well for typical projects with IRR in the 0–50% range. For extreme projects (very high-return micro-investments or very low-return long-horizon projects), N-R may diverge or converge slowly, falling through to bisection. This is acceptable given the bisection fallback.

### F-09.3 — 🟢 Compliant: IRR Storage and Display Format

```javascript
irrResult = Math.round(irrResult * 10000) / 100;
```

`financial.irr()` returns decimal (e.g., `0.1545`):
- `0.1545 × 10000 = 1545`
- `1545 / 100 = 15.45` → stored as `15.45` (percentage)

UI components display as `"15.45%"`. Consistent throughout all components. No error.

---

## Test Cases

### TC-08-A: Textbook IRR Verification
```
CFs: [-100,000, +40,000, +40,000, +40,000]

NPV(r) = -100,000 + 40,000/(1+r) + 40,000/(1+r)² + 40,000/(1+r)³ = 0

By trial: r ≈ 9.70% (solve numerically)
PV annuity factor at 9.70% for 3 periods ≈ 2.500
40,000 × 2.500 = 100,000 ✓

Expected irrResult: ≈ 9.70
```

### TC-08-B: High-IRR Project
```
CFs: [-10,000, +8,000, +6,000]

NPV = 0: -10,000 + 8,000/(1+r) + 6,000/(1+r)² = 0
By quadratic: 6,000x² + 8,000x - 10,000 = 0  where x = 1/(1+r)
x = (-8,000 ± √(64,000,000 + 240,000,000)) / 12,000
x = (-8,000 + 17,435.9) / 12,000 = 0.786
1+r = 1/0.786 = 1.2722 → r = 27.22%

Expected irrResult: ≈ 27.22
```

### TC-08-C: No Positive Cash Flow
```
CFs: [-50,000, -10,000, -5,000]
Expected: irrResult = null (no positive CF)
```

### TC-08-D: IRR Display Format
```
If library returns 0.2345 (decimal)
Expected stored value: Math.round(0.2345 × 10000) / 100 = Math.round(2345) / 100 = 23.45
Expected UI display: "23.45%"
```

### TC-08-E: Convergence at Exact Root
```
CFs: [-100, +110]  → IRR = 10% exactly
NPV(0.10) = -100 + 110/1.10 = -100 + 100 = 0
Expected irrResult: 10.00
```

---

*References:*
- Brealey, R., Myers, S. & Allen, F. (2020). *Principles of Corporate Finance*, 13th ed., Ch. 5.3
- Press, W. et al. (2007). *Numerical Recipes* (3rd ed.), Ch. 9 — Root Finding
- Damodaran, A. (2012). *Investment Valuation*, 3rd ed., Appendix 5A — Multiple IRR
