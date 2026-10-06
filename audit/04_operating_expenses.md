# 04 — Operating Expenses

**Domain:** Expense normalization by frequency, growth compounding, fixed vs. variable classification
**Files:**
- `Backend/src/models/Project.js` — lines 420–470 (`calculateExpenses`)
- `Frontend/src/components/Expenses.jsx` — lines 230–263 (annual projection chart)
**References:** IAS 1 — Presentation of Financial Statements; standard contribution margin analysis

---

## A. Backend Expense Calculation

### Current Implementation

```javascript
// Project.js lines 420–470
const getAnnualAmount = (expense, yearIndex) => {
  const base = (expense.unitCost > 0 && expense.quantity > 0)
    ? (parseFloat(expense.unitCost) || 0) * (parseFloat(expense.quantity) || 0)
    : (parseFloat(expense.amount) || 0);

  if (base <= 0) return 0;

  const freq = expense.frequency || 'monthly';

  if (freq === 'one-time') {
    return yearIndex === 0 ? base : 0;  // no growth on one-time costs
  }

  const annualBase = (() => {
    switch (freq) {
      case 'monthly':   return base * 12;
      case 'quarterly': return base * 4;
      case 'annual':    return base;
      default:          return base * 12;
    }
  })();

  const growthRate = (parseFloat(expense.growthRate) || 0) / 100;
  return annualBase * Math.pow(1 + growthRate, yearIndex);
};
```

### Canonical Formula

```
AnnualExpense_t = BaseAmount × FrequencyMultiplier × (1 + g)^(t−1)
```

Where:
- `FrequencyMultiplier`: monthly=12, quarterly=4, annual=1, one-time=1 (year 1 only)
- `(1+g)^(t−1)` = `(1+g)^yearIndex` (consistent with revenue convention)
- One-time costs: no growth, appear only in year 0 (t=1)

---

## Gap Analysis

| Aspect | Status | Notes |
|--------|--------|-------|
| Monthly × 12 | 🟢 Compliant | Correct |
| Quarterly × 4 | 🟢 Compliant | Correct |
| Annual × 1 | 🟢 Compliant | Correct |
| One-time in year 0 only | 🟢 Compliant | `yearIndex === 0 ? base : 0` |
| Growth convention | 🟢 Compliant | Same `(1+g)^yearIndex` as revenue — internally consistent |
| UnitCost × Quantity priority | 🟢 Compliant | Preferred when both fields positive |
| NaN guards | 🟢 Compliant | `parseFloat || 0` throughout |
| Default frequency | 🟢 Compliant | Falls back to `'monthly'` for backward compatibility |
| Growth rate stored as percent | 🟢 Compliant | Divided by 100 before use |

### Findings

#### F-04.1 — 🟢 Compliant: Backend Frequency Normalization

All four frequency types are handled correctly. The formula is mathematically sound and internally consistent with the revenue growth convention. No corrections needed.

### Test Cases — Backend (All Should Pass)

| TC | Input | Expected Year 1 | Expected Year 3 |
|----|-------|-----------------|-----------------|
| TC-04-A | Monthly 1,000, g=10% | `1000×12×1.0^0=12,000` | `1000×12×1.1^2=14,520` |
| TC-04-B | Quarterly 3,000, g=0% | `3000×4=12,000` | `12,000` |
| TC-04-C | Annual 12,000, g=5% | `12,000` | `12,000×1.05^2=13,230` |
| TC-04-D | One-time 5,000 | `5,000` | `0` |
| TC-04-E | `unitCost=100, qty=20, freq=monthly` | `2000×12=24,000` | `24,000 (g=0)` |

---

## B. Frontend Expense Projection (Expenses.jsx)

### Current Implementation

```javascript
// Expenses.jsx lines 230–253
const annualProjectionData = Array.from({ length: projectionYears }, (_, i) => {
  const year = i + 1;

  const fixedExpenses = formData.items
    .filter(e => e.type === 'fijo')
    .reduce((sum, expense) => {
      const growth = Math.pow(1 + (expense.growthRate / 100), i);
      return sum + (expense.amount * 12 * growth);   // ← BUG: always ×12
    }, 0);

  const variableExpenses = formData.items
    .filter(e => e.type === 'variable')
    .reduce((sum, expense) => {
      const growth = Math.pow(1 + (expense.growthRate / 100), i);
      return sum + (expense.amount * 12 * growth);   // ← BUG: always ×12
    }, 0);
  // ...
});
```

**Table row display (correct — line 300):**
```javascript
const freqMultipliers = { monthly: 12, quarterly: 4, annual: 1, 'one-time': 1 };
const annualCost = (expense.amount || 0) * (freqMultipliers[expense.frequency] || 12);
```

### Canonical Formula

```
AnnualProjection_t = Σ_expenses [ Amount × FrequencyMultiplier × (1 + g)^(t−1) ]
```

---

## Findings

### F-12.1 — 🔴 Critical: Frontend Projection Always ×12

**Issue:** The chart data generator (`annualProjectionData`) uses `expense.amount * 12` for **all** expenses, ignoring `expense.frequency`. The table row display at line 300 uses the correct multiplier, creating an internal inconsistency within the same component.

**Quantitative impact by frequency type:**

| Frequency | Correct multiplier | Applied multiplier | Error factor |
|-----------|-------------------|-------------------|--------------|
| monthly | 12 | 12 | 1× (no error) |
| quarterly | 4 | 12 | **3× overstatement** |
| annual | 1 | 12 | **12× overstatement** |
| one-time | 1 | 12 | **12× overstatement** (and not limited to year 1) |

**Example:** Rent expense of 3,000,000 COP/quarter (correct annual = 12,000,000) is displayed in the projection chart as 36,000,000 — an overstatement of 24,000,000 COP.

**Scope:** Display-only bug. Does not affect stored `financialMetrics` in MongoDB (backend calculates correctly). Does not affect NPV/IRR/payback calculations.

**Proposed fix:**
```javascript
// Add multiplier lookup at top of component (or near existing freqMultipliers at line 297):
const FREQ_MULTIPLIERS = { monthly: 12, quarterly: 4, annual: 1, 'one-time': 1 };

const annualProjectionData = Array.from({ length: projectionYears }, (_, i) => {
  const fixedExpenses = formData.items
    .filter(e => e.type === 'fijo')
    .reduce((sum, expense) => {
      const growth = Math.pow(1 + ((expense.growthRate || 0) / 100), i);
      const multiplier = FREQ_MULTIPLIERS[expense.frequency] || 12;
      // One-time: only year 0
      if (expense.frequency === 'one-time') {
        return sum + (i === 0 ? expense.amount * growth : 0);
      }
      return sum + (expense.amount * multiplier * growth);
    }, 0);
  // Same fix for variableExpenses
```

### Test Cases — Frontend Projection

| TC | Input | Expected chart year 1 | Current buggy output |
|----|-------|-----------------------|----------------------|
| TC-12-A | Quarterly 3,000, g=0% | 12,000 | **36,000** |
| TC-12-B | Annual 12,000, g=0% | 12,000 | **144,000** |
| TC-12-C | Monthly 1,000, g=0% | 12,000 | 12,000 (correct by coincidence) |
| TC-12-D | One-time 5,000 | 5,000 (year 1 only) | **60,000 every year** |

---

*References:*
- IAS 1.99 — Presentation of expenses by nature or function
- Horngren, C. et al. (2015). *Cost Accounting* (15th ed.) — Fixed vs. variable cost classification
