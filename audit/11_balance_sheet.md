# 11 — Balance Sheet

**Domain:** Balance sheet construction, accumulated depreciation, loan balance, retained earnings
**File:** `Frontend/src/components/BalanceSheet.jsx` — lines 66–130
**References:** IAS 1 — Presentation of Financial Statements; IAS 16 — Property, Plant and Equipment

---

## Current Implementation

```javascript
// BalanceSheet.jsx lines 66–108
// Asset side
const currentAssets = safeNumber(investmentAssets?.cash, 0) +
                      safeNumber(investmentAssets?.bank, 0) +
                      safeNumber(investmentAssets?.inventory, 0);

const nonCurrentAssets = (investmentAssets?.fixedAssets || []).reduce(
  (sum, asset) => sum + safeNumber(asset.value, 0), 0   // ← original cost, no depreciation
);

const investmentCosts = safeNumber(investmentAssets?.civilWorks, 0) + ...;
const customFieldsTotal = (investmentAssets?.customFields || []).reduce(...);

const totalAssets = currentAssets + nonCurrentAssets + investmentCosts + customFieldsTotal;

// Liability side
const nonCurrentLiabilities = safeNumber(financing?.externalLoan, 0);  // ← original loan, not reduced
const totalLiabilities = nonCurrentLiabilities;

// Equity
const partnerEquity = (financing?.partners || []).reduce(
  (sum, partner) => sum + safeNumber(partner.contribution, 0), 0
);
const retainedEarnings = (scenarioData?.annualData || []).reduce(
  (sum, yearData) => sum + safeNumber(yearData.netProfit, 0), 0   // ← cumulative all years
);
const equity = partnerEquity + Math.max(0, retainedEarnings);   // ← floors at 0
const totalLiabilitiesAndEquity = totalLiabilities + equity;

// Balance check
const balanceDifference = totalAssets - totalLiabilitiesAndEquity;
const isBalanceCorrect = Math.abs(balanceDifference) < 0.01;
```

---

## Canonical Balance Sheet Structure

**IAS 1.54 — Minimum line items on the balance sheet:**

```
ASSETS
  Current Assets:
    Cash and cash equivalents
    Inventories
    Trade and other receivables

  Non-Current Assets:
    Property, plant and equipment (PP&E) — at net book value
      = Cost − Accumulated Depreciation

LIABILITIES
  Current Liabilities:
    Short-term portion of long-term debt

  Non-Current Liabilities:
    Long-term loans — at outstanding (remaining) balance

EQUITY
  Share capital / Partner contributions
  Retained earnings (accumulated net profit/loss)
    (CAN be negative if cumulative losses exceed contributions)

Accounting equation: ASSETS = LIABILITIES + EQUITY  (must hold exactly)
```

**IAS 16.30:** An item of PPE is measured at its **cost less accumulated depreciation**.

---

## Gap Analysis

| Aspect | Status | Notes |
|--------|--------|-------|
| Asset categories | 🟢 Compliant | Current vs. non-current split is present |
| Fixed assets at original cost | 🔴 Non-compliant | F-11.2: No accumulated depreciation deducted |
| Loan at outstanding balance | 🔴 Non-compliant | F-11.4: Uses original loan amount, not remaining balance |
| Retained earnings accumulation | 🟢 Compliant | Sums all `netProfit` values |
| Negative retained earnings floor | 🟡 Warning | F-11.3: `Math.max(0, retainedEarnings)` hides insolvency |
| Accounting equation check | 🟡 Note | Check exists but is meaningless due to F-11.2 and F-11.4 |
| Year-by-year balance sheets | 🟡 Warning | F-11.1: Only one static snapshot, not per-year statements |
| Short-term debt portion | 🟡 Warning | Current liabilities = 0 (principal payments not tracked as current) |

---

## Findings

### F-11.1 — 🟡 Warning: Static Snapshot (Not Year-by-Year)

The component renders a single balance sheet that mixes:
- Assets at **initial cost** (opening values)
- Retained earnings at **end of project** (cumulative sum of all net profits)

This is neither an opening balance sheet (Year 0) nor any specific year-end balance sheet. It is a hybrid that cannot be reconciled to a standard financial reporting date.

A proper balance sheet model would compute for each year `t`:
- `netFixedAssets_t = originalCost − Σ[k=1 to t] annualDepreciation_k`
- `loanBalance_t = originalLoan − Σ[k=1 to t] principalPayment_k`
- `retainedEarnings_t = Σ[k=1 to t] netProfit_k`

This enhancement would make the balance sheet useful for year-by-year financial health monitoring.

### F-11.2 — 🟡 Warning: Fixed Assets Not Reduced by Accumulated Depreciation

**Current:**
```javascript
const nonCurrentAssets = fixedAssets.reduce(
  (sum, asset) => sum + safeNumber(asset.value, 0), 0  // original cost
);
```

**IAS 16.30 requires:** `Carrying amount = Cost − Accumulated Depreciation`

For a 5-year project where an asset worth 10,000,000 COP has a 5-year life, by year 5 the carrying amount is 0. The current balance sheet always shows 10,000,000.

**Example overstatement:** For a project with 50,000,000 COP in fixed assets, 10-year life, after 5 years:
- Correct book value: `50M − 5×5M = 25,000,000`
- Current output: `50,000,000` (overstated by 25M)

**Proposed fix (requires passing `depreciationByYear` or current year index):**
```javascript
// If rendering for a specific year t (1-indexed):
const accumulatedDepreciation = fixedAssets.reduce((total, asset) => {
  const annualDepr = safeNumber(asset.value, 0) / Math.max(1, asset.usefulLife || 5);
  const yearsDepreciated = Math.min(t, asset.usefulLife || 5);
  return total + annualDepr * yearsDepreciated;
}, 0);
const netFixedAssets = Math.max(0, nonCurrentAssets - accumulatedDepreciation);
```

### F-11.3 — 🟡 Warning: Equity Floor Hides Insolvency

```javascript
const equity = partnerEquity + Math.max(0, retainedEarnings);
```

The `Math.max(0, ...)` prevents equity from going negative. In real balance sheets, if cumulative losses exceed partner contributions, equity becomes negative — indicating technical insolvency. This is an important signal for viability analysis.

**Proposed fix:** Remove the floor:
```javascript
const equity = partnerEquity + retainedEarnings;
// Then display negative equity with a warning indicator in the UI
```

### F-11.4 — 🟡 Warning: Loan Balance Not Reduced by Principal Repayments

**Current:**
```javascript
const nonCurrentLiabilities = safeNumber(financing?.externalLoan, 0);  // original amount
```

The loan balance should decrease each year by the principal paid. After full repayment, it should be 0.

**Proposed fix:** Subtract cumulative principal payments:
```javascript
const cumulativePrincipal = (scenarioData?.annualData || []).reduce(
  (sum, yearData) => sum + safeNumber(yearData.principalPayment, 0), 0
);
// Note: principalPayment must be added to annualData — currently not stored there
const outstandingLoan = Math.max(0,
  safeNumber(financing?.externalLoan, 0) - cumulativePrincipal
);
```

*Note: `principalPayment` is not currently stored in `annualData`; it is used in `leveredCashFlow` calculation but not exported. Adding it to `roundedData` would enable this fix.*

---

## Test Cases

### TC-11-A: Asset Depreciation on Balance Sheet
```
fixedAssets = [{ value: 10,000,000, usefulLife: 5 }]
projectLife = 5 (all 5 years have passed)

Current output: nonCurrentAssets = 10,000,000
Expected (correct): netFixedAssets = 10M − 5×2M = 0
```

### TC-11-B: Loan Balance Reduction
```
externalLoan = 1,200,000
Year 1 principal paid = 1,200,000 (12-month loan)

Current output: nonCurrentLiabilities = 1,200,000
Expected: outstanding loan = 0 (fully repaid)
```

### TC-11-C: Negative Retained Earnings
```
partnerEquity = 5,000,000
Cumulative net profit (all years) = -8,000,000 (loss-heavy project)

Current output: equity = 5,000,000 + max(0, -8,000,000) = 5,000,000
Expected: equity = 5,000,000 + (-8,000,000) = -3,000,000 (insolvent)
```

### TC-11-D: Accounting Equation
```
For balance sheet to satisfy ASSETS = LIABILITIES + EQUITY exactly, F-11.2 and F-11.4
must be fixed simultaneously. After fix:
  Assets = netFixedAssets + currentAssets + investmentCosts + customFields
  Liabilities = outstandingLoan
  Equity = partnerEquity + retainedEarnings
  Verify: |Assets − (Liabilities + Equity)| < 0.01
```

---

*References:*
- IAS 1.54 — Balance sheet line items
- IAS 16.30 — Carrying amount of PPE
- IAS 32.35 — Equity classification
