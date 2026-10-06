# 09 — Payback Period

**Domain:** Simple payback period — cumulative cash flow interpolation, edge cases
**File:** `Backend/src/models/Project.js` — lines 624–640
**References:** Brealey, Myers & Allen, *Principles of Corporate Finance* (13th ed.), Ch. 5.2

---

## Current Implementation

```javascript
// Project.js lines 469, 471, 624–640
let cumulativeCashFlow = -initialInvestment;  // starts at −I₀ (year 0)
let paybackPeriodResult = null;
const cashFlows = [-initialInvestment];

// Per-year loop:
const previousCumulative = cumulativeCashFlow;
cumulativeCashFlow += leveredCashFlow;
cashFlows.push(leveredCashFlow);

if (paybackPeriodResult === null && cumulativeCashFlow >= 0 && previousCumulative < 0) {
  if (Math.abs(leveredCashFlow) > 0.01) {
    const fraction = Math.abs(previousCumulative) / leveredCashFlow;
    paybackPeriodResult = (year - 1) + fraction;
  } else {
    paybackPeriodResult = year;
  }
}
```

**Stored result (line 713):**
```javascript
paybackPeriod: paybackPeriodResult !== null ? Math.round(paybackPeriodResult * 100) / 100 : null
```

---

## Canonical Formula

**Simple payback period** (Brealey et al., 2020, Ch. 5.2):

The payback period is the number of years required for the cumulative cash flows to recover the initial investment.

```
Payback = (year_before_recovery) + |Cumulative_CF_{year_before}| / CF_{recovery_year}
```

Where:
- `year_before_recovery` = last year where cumulative CF is still negative
- `|Cumulative_CF_{year_before}|` = absolute value of the deficit going into the recovery year
- `CF_{recovery_year}` = cash flow in the year where cumulative CF turns non-negative

The fractional component assumes cash flows arrive uniformly throughout the year.

**Discounted payback** (not implemented): Uses discounted CFs instead of nominal CFs, giving the period to recover the PV-adjusted investment.

---

## Gap Analysis

| Aspect | Status | Notes |
|--------|--------|-------|
| Cumulative CF starts at −I₀ | 🟢 Compliant | `cumulativeCashFlow = -initialInvestment` at year 0 |
| Year-crossing detection | 🟢 Compliant | Checks `cumulativeCashFlow >= 0 && previousCumulative < 0` |
| Linear interpolation formula | 🟢 Compliant | `fraction = |previousCumulative| / leveredCashFlow` |
| Uses levered (equity) CFs | 🟢 Compliant | Consistent with IRR |
| Near-zero CF guard | 🟢 Compliant | `Math.abs(leveredCashFlow) > 0.01` prevents division by near-zero |
| First sign-change only | 🟢 Compliant | `paybackPeriodResult === null` ensures only first crossing counted |
| Result stored to 2dp | 🟢 Compliant | `Math.round(result × 100) / 100` |
| Project never pays back | 🟢 Compliant | Returns `null` if no crossing found |
| Instant payback (CF_0 positive) | 🟡 Warning | If initialInvestment=0, cumulativeCashFlow starts at 0, payback=0 — edge case |
| Discounted payback | 🟡 Note | Not implemented; documented as a known limitation |

---

## Findings

### F-09-PAY.1 — 🟢 Compliant: Linear Interpolation Formula

The sub-year interpolation `(year - 1) + |previousCumulative| / leveredCashFlow` is mathematically correct. Given:
- End of year `y-1`: cumulative = `−D` (D > 0, still in deficit)
- Year `y` cash flow: `CF_y > 0` (turns positive)
- Recovery occurs `D / CF_y` of the way through year `y`
- Total payback = `(y−1) + D/CF_y` years ✓

### F-09-PAY.2 — 🟢 Compliant: Cash Flow Series Consistency

Payback uses `leveredCashFlow`, consistent with the IRR calculation. For the post-F-09.1 fix where NPV also uses levered CFs, all three metrics (NPV, IRR, payback) will use the same CF series — fully consistent.

### F-09-PAY.3 — 🟡 Note: Discounted Payback Not Implemented

The discounted payback period accounts for the time value of money by using present-valued cash flows. It is generally preferred in academic research and always ≥ simple payback.

```
Discounted payback: same algorithm applied to
  DCF_t = leveredCashFlow_t / (1 + discountRate)^t
```

Not currently implemented. For the FinanceBench research context, the simple payback is what's evaluated. Discounted payback would be an enhancement.

### F-09-PAY.4 — 🟡 Warning: Zero Initial Investment

If `initialInvestment = 0`, `cumulativeCashFlow` starts at 0. The first year with any positive `leveredCashFlow` would see `cumulativeCashFlow > 0` but `previousCumulative = 0`, so `previousCumulative < 0` is false and no payback is recorded. The `paybackPeriodResult` stays `null`, implying "never recovers" — which is incorrect for a zero-investment project (payback should be 0).

This is an extreme edge case unlikely in practice (a project with zero investment is not a viability analysis). No fix required, but worth documenting.

---

## Test Cases

### TC-09-A: Standard Interpolation
```
initialInvestment = 100,000
Year 1 leveredCF = 40,000  → cumulative = -60,000
Year 2 leveredCF = 40,000  → cumulative = -20,000
Year 3 leveredCF = 40,000  → cumulative = +20,000  ← payback year

fraction = |-(-20,000)| / 40,000 = 0.5
payback = (3-1) + 0.5 = 2.5 years
Expected: paybackPeriodResult = 2.50
```

### TC-09-B: Exact Year Payback
```
initialInvestment = 120,000
Year 1 leveredCF = 60,000  → cumulative = -60,000
Year 2 leveredCF = 60,000  → cumulative = 0  ← exactly zero

fraction = |-(-60,000)| / 60,000 = 1.0
payback = (2-1) + 1.0 = 2.0 years
Expected: paybackPeriodResult = 2.00
```

### TC-09-C: Never Pays Back
```
initialInvestment = 500,000
All years leveredCF = 50,000 (projectLife = 5)
Cumulative at year 5 = -500,000 + 250,000 = -250,000 (still negative)
Expected: paybackPeriodResult = null
```

### TC-09-D: Payback in Year 1
```
initialInvestment = 50,000
Year 1 leveredCF = 100,000  → cumulative = +50,000

fraction = |-(-50,000)| / 100,000 = 0.5
payback = 0 + 0.5 = 0.5 years
Expected: paybackPeriodResult = 0.50
```

### TC-09-E: Near-Zero Recovery CF
```
previousCumulative = -1,000
leveredCashFlow = 0.005 (less than 0.01 guard)
Expected: paybackPeriodResult = year (falls into else branch — no fraction computed)
```

---

*References:*
- Brealey, R., Myers, S. & Allen, F. (2020). *Principles of Corporate Finance*, 13th ed., Ch. 5.2
- Ross, S., Westerfield, R. & Jordan, B. (2019). *Corporate Finance Fundamentals* (12th ed.) — Payback Period
