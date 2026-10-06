# 06 — Cash Flow Statements

**Domain:** Levered and unlevered free cash flow definitions, year 0 cash flow, intermediate rounding
**File:** `Backend/src/models/Project.js` — lines 597–601, 603–620
**References:** Damodaran, *Investment Valuation* (3rd ed.), Ch. 3–4; Berk & DeMarzo, *Corporate Finance* (5th ed.), Ch. 18

---

## Current Implementation

```javascript
// Project.js lines 597–601
// NOTE: Unlevered CF uses taxes calculated after interest deduction (includes interest tax shield).
const unleveredCashFlow = operationalProfit + depreciation - taxes;
const principalPayment = principalByYear[yearIndex] || 0;
const leveredCashFlow = netProfit + depreciation - principalPayment;

// Project.js lines 603–620 — intermediate rounding
const roundedData = {
  year,
  revenue: Math.round(revenue * 100) / 100,
  // ... all fields rounded to 2 decimal places
  unleveredCashFlow: Math.round(unleveredCashFlow * 100) / 100,
  leveredCashFlow: Math.round(leveredCashFlow * 100) / 100
};
```

**Year 0 cash flow (lines 469, 631–633):**
```javascript
let cumulativeCashFlow = -initialInvestment;  // Year 0
const cashFlows = [-initialInvestment];       // First element = Year 0
```

---

## Canonical Formulas

### Unlevered Free Cash Flow (UFCF) — Damodaran Method

For WACC-based valuation (discount at WACC, unlevered firm):
```
UFCF_t = EBIT_t × (1 − taxRate) + Depreciation_t − ΔNWC_t − CapEx_t
```

Expanded:
```
UFCF_t = EBIT × (1−t) + D
```
Where `EBIT × (1−t)` = NOPAT (Net Operating Profit After Tax using *unlevered* taxes).

The critical difference: unlevered taxes are computed on EBIT, **not on EBT**. The interest tax shield (ITS) is captured separately in the WACC.

### Equity/Levered Free Cash Flow (EFCF) — Berk & DeMarzo

For equity valuation (discount at cost of equity):
```
EFCF_t = NetProfit_t + Depreciation_t − PrincipalPayment_t − ΔNWC_t − CapEx_t
```

This equals the residual cash flow to shareholders after all debt service.

### Year 0 Cash Flow

```
CF_0 = −InitialInvestment
```

This is already in present value (no discounting at t=0); appears as index 0 in the cash flow array.

---

## Gap Analysis

| Aspect | Status | Notes |
|--------|--------|-------|
| Levered CF formula | 🟢 Compliant | `netProfit + depreciation − principalPayment` is standard EFCF |
| Depreciation add-back | 🟢 Compliant | Non-cash item correctly added back to net profit |
| Principal payment (not full debt service) | 🟢 Compliant | Uses `principalByYear[]`, not total payment |
| Year 0 = −InitialInvestment | 🟢 Compliant | `cashFlows = [-initialInvestment, ...]` |
| Unlevered CF — ITS inclusion | 🟡 Warning | Taxes used are from EBT (after interest) — includes ITS (F-08.1) |
| Working capital changes | 🟡 Warning | ΔNWC not modeled (F-08.3) |
| CapEx not separately modeled | 🟡 Warning | Only initial investment; ongoing CapEx = 0 assumed |
| Intermediate rounding | 🟡 Warning | `annualData` rounded to 2dp; fed into NPV (F-INT.1) |

---

## Findings

### F-08.1 — 🟡 Warning [RESEARCH CRITICAL]: Interest Tax Shield in "Unlevered" CF

**Current formula:**
```javascript
const unleveredCashFlow = operationalProfit + depreciation - taxes;
```

Where `taxes = max(0, (ebt + taxLossCarryforward)) × taxRate`, and `ebt = EBIT − interestExpense`.

This means `taxes` = `max(0, EBIT − interest) × taxRate` (when no carryforward).

**True UFCF formula:**
```
UFCF = EBIT × (1 − t) + D  =  operationalProfit × (1 − taxRate) + depreciation
```

**Current formula result:**
```
current = operationalProfit + depreciation − taxes
        = EBIT + D − (EBIT − interest) × t
        = EBIT + D − EBIT×t + interest×t
        = EBIT×(1−t) + D + interest×t
        = UFCF_true + ITS
```

So current "unlevered" CF = true UFCF + Interest Tax Shield.

**Numerical example:**
- EBIT = 300,000; interest = 50,000; taxRate = 35%; depreciation = 30,000
- True UFCF: `300,000 × 0.65 + 30,000 = 225,000`
- Current formula: `300,000 + 30,000 − (300,000−50,000)×0.35 = 330,000 − 87,500 = 242,500`
- Difference: `242,500 − 225,000 = 17,500 = ITS = 50,000 × 0.35`

**Developer comment (line 598)** acknowledges this: "NOTE: Unlevered CF uses taxes calculated after interest deduction (includes interest tax shield)." The choice is intentional but creates the NPV/IRR inconsistency documented in F-09.1.

**Impact for benchmarking:** Any levered project will have `unleveredCashFlow_stored > UFCF_true`. NPV will be overstated relative to the WACC-discounting textbook approach.

### F-08.2 — 🟢 Compliant: Levered (Equity) Cash Flow

```javascript
const leveredCashFlow = netProfit + depreciation - principalPayment;
```

This is the standard equity cash flow (ECF). It includes:
- Net profit (after all expenses, interest, and taxes including ITS) ✓
- Depreciation add-back (non-cash) ✓
- Principal repayment (cash outflow to debtholders) ✓

This is consistent with Berk & DeMarzo's "Free Cash Flow to Equity" (FCFE) approach.

### F-INT.1 — 🟡 Warning: Intermediate Rounding

Lines 603–620 store all `annualData` values rounded to 2 decimal places:
```javascript
unleveredCashFlow: Math.round(unleveredCashFlow * 100) / 100,
leveredCashFlow: Math.round(leveredCashFlow * 100) / 100
```

The NPV at lines 663–666 then uses `data.unleveredCashFlow` — the already-rounded value.

**Quantitative impact:** For a 10-year projection with values in billions of COP, rounding to 2 decimal places (centavos) introduces at most `±0.005 × 10 = ±0.05 COP` of NPV error. This is negligible for financial purposes.

**Compliance with floating-point discipline requirement:** The prompt specifies "never round intermediate values used in further calculations." Technically, the 2dp rounding violates this rule. However, the actual error magnitude is negligible for COP amounts.

**Recommended approach:** Store two versions in `annualData`:
- `unleveredCashFlowRaw` (full precision, used for NPV/IRR calculations)
- `unleveredCashFlow` (2dp, used for display)

Or alternatively, pass raw values directly to `npv()` before rounding.

---

## Test Cases

| TC | EBIT | Interest | DepR | TaxRate | Expected UFCF_true | Expected current | Difference = ITS |
|----|------|---------|------|---------|-------------------|-----------------|-----------------|
| TC-08-A | 300K | 50K | 30K | 35% | 225K | 242.5K | 17.5K |
| TC-08-B | 300K | 0 | 30K | 35% | 225K | 225K | 0 (no debt) |
| TC-08-C | −100K | 20K | 30K | 35% | -65K+30K=-35K | -100K+30K−0=−70K | taxes=0 when EBT<0 |

| TC | NetProfit | DepR | Principal | Expected EFCF |
|----|-----------|------|-----------|--------------|
| TC-08-D | 200K | 50K | 80K | 170K |
| TC-08-E | -50K | 50K | 0 | 0 (no debt service) |

---

*References:*
- Damodaran, A. (2012). *Investment Valuation*, 3rd ed., Ch. 3 — Free Cash Flows to the Firm
- Berk, J. & DeMarzo, P. (2020). *Corporate Finance*, 5th ed., Ch. 18.1 — Free Cash Flow
- IAS 7 — Statement of Cash Flows
