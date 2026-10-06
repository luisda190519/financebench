# 05 — Income Statement & EBITDA

**Domain:** EBITDA definition, EBIT, EBT, tax calculation, loss carryforward, net profit
**File:** `Backend/src/models/Project.js` — lines 578–595
**References:** IAS 1 — Presentation of Financial Statements; IFRS Practice Statement 1; Colombian Estatuto Tributario Art. 240, Art. 147

---

## Current Implementation

```javascript
// Project.js lines 578–595
const ebitda = revenue - totalExpenses;
const depreciation = depreciationByYear[yearIndex] || 0;
const operationalProfit = ebitda - depreciation;   // = EBIT
const interestExpense = interestByYear[yearIndex] || 0;
const ebt = operationalProfit - interestExpense;

// Tax calculation with loss carryforward
let taxableIncome = ebt + taxLossCarryforward;
let taxes = 0;
if (taxableIncome > 0) {
  taxes = taxableIncome * taxRate;
  taxLossCarryforward = 0;
} else {
  taxLossCarryforward = -taxableIncome;  // ← F-07.1 BUG
}

const netProfit = ebt - taxes;
```

Where `totalExpenses = fixedExpenses + totalVariableExpenses` and `totalVariableExpenses = totalCOGS + itemVariableCosts`.

---

## Canonical Income Statement Structure

**IFRS/NIIF income statement by nature (IAS 1.102):**

```
Revenue
− Cost of Goods Sold (COGS)
= Gross Profit
− Operating Expenses (SG&A, R&D, etc.)
= EBITDA   [Earnings Before Interest, Tax, Depreciation & Amortization]
− Depreciation & Amortization
= EBIT     [Operating Profit / Earnings Before Interest & Tax]
− Interest Expense
= EBT      [Earnings Before Tax]
− Income Tax Expense
= Net Profit (Net Income)
```

**Colombian corporate tax (Estatuto Tributario Art. 240):**
- Rate: **35%** for income year 2022 and subsequent (Ley 2155/2021)
- Prior rate: 31% (2019–2021)
- The app default of 30% is therefore **outdated** for 2024–2025 benchmark cases

**Loss carryforward (Art. 147 ET, as amended by Ley 1111/2006):**
- Losses can be carried forward for an **unlimited number of years**
- Losses carried forward are used to reduce taxable income in future profitable years
- **Critically:** the carryforward is a deduction from *positive* taxable income only. You cannot apply it against a loss year.

---

## Gap Analysis

| Aspect | Status | Notes |
|--------|--------|-------|
| EBITDA = Revenue − OpEx (before depreciation) | 🟢 Compliant | Correct; depreciation NOT in `totalExpenses` |
| EBIT = EBITDA − Depreciation | 🟢 Compliant | `operationalProfit = ebitda - depreciation` |
| EBT = EBIT − Interest | 🟢 Compliant | `ebt = operationalProfit - interestExpense` |
| Taxes on EBT (not EBITDA) | 🟢 Compliant | `taxableIncome = ebt + taxLossCarryforward` |
| Net Profit = EBT − Taxes | 🟢 Compliant | `netProfit = ebt - taxes` |
| Colombian tax rate default | 🟡 Warning | Default 30%; current statutory rate is 35% |
| Loss carryforward — single loss year | 🟢 Compliant | Single loss year followed by profit works correctly |
| Loss carryforward — consecutive loss years | 🔴 **Critical Bug** | F-07.1: accumulation error for 2+ consecutive loss years |
| No time limit on carryforward | 🟢 Compliant | Matches Colombian tax law (unlimited) |
| COGS in EBITDA base | 🟡 Warning | COGS included in `totalExpenses` → subtracted before depreciation; correctly labeled as EBITDA |
| Naming `operationalProfit` vs `EBIT` | 🟡 Warning | Variable named `operationalProfit` but conceptually = EBIT; no calculation error |

---

## Findings

### F-06.1 — 🟢 Compliant: Income Statement Pipeline

The chain `EBITDA → EBIT → EBT → taxes → netProfit` is structurally correct per IFRS/NIIF. Depreciation is correctly not included in operating expenses — it appears on its own line. Interest is correctly applied after depreciation. Taxes are computed on EBT, not EBITDA. This is the standard NIIF income statement structure.

### F-06.2 — 🟡 Warning: Colombian Tax Rate Default

The default `taxRate = 30%` (line 280) is outdated. Ley 2155/2021 raised the statutory rate to **35%** for income year 2022 onward. Benchmark cases for 2024–2025 projects should use 35%. If a benchmark case uses 35% and the user doesn't change the default, the output will use 30% and produce systematically lower taxes, higher net profit, and higher NPV.

**Proposed fix:** Change default on line 280 from `30` to `35`:
```javascript
const taxRate = (parseFloat(project.general.taxRate) || 35) / 100;
```

*Note: This is a default change only — users who explicitly set their tax rate are unaffected.*

### F-07.1 — 🔴 Critical [RESEARCH CRITICAL]: Tax Loss Carryforward Accumulation Bug

**Current code (lines 585–592):**
```javascript
let taxableIncome = ebt + taxLossCarryforward;
let taxes = 0;
if (taxableIncome > 0) {
  taxes = taxableIncome * taxRate;
  taxLossCarryforward = 0;
} else {
  taxLossCarryforward = -taxableIncome;  // BUG
}
```

**The Bug — Step-by-step proof:**

The formula `taxableIncome = ebt + taxLossCarryforward` uses `+` which means it adds the accumulated loss (positive value stored in `taxLossCarryforward`) to EBT. This is economically backward: a carryforward reduces taxable income (it's a deduction), not an increase. The sign should produce `ebt - taxLossCarryforward` conceptually... but wait — the carryforward is stored as a **positive number** representing the loss amount (negative EBT), so adding it to EBT would be wrong if EBT is also negative.

Actually the sign issue is subtler. Tracing through with consecutive loss years:

```
Year 1: ebt = -100,000,  taxLossCarryforward_initial = 0
  taxableIncome = -100,000 + 0 = -100,000
  → taxLossCarryforward = -(-100,000) = 100,000  ← stores "I have 100K of losses to carry"

Year 2: ebt = -200,000,  taxLossCarryforward = 100,000
  taxableIncome = -200,000 + 100,000 = -100,000
  → taxLossCarryforward = -(-100,000) = 100,000  ← WRONG! Should be 300,000

  What happened: The formula "used" the year-1 carryforward against year-2's loss.
  You cannot apply a tax loss carryforward against a loss year —
  it can only offset FUTURE POSITIVE TAXABLE INCOME.

Year 3: ebt = +400,000,  taxLossCarryforward = 100,000 (buggy — should be 300,000)
  taxableIncome = +400,000 + 100,000 = 500,000  ← WRONG: should be 400,000 + 300,000 = 700,000
  taxes = 500,000 × 0.35 = 175,000              ← WRONG: should be 700,000 × 0.35 = 245,000
  netProfit = 400,000 − 175,000 = 225,000        ← OVERSTATED by 70,000
```

The error magnitude scales with: `|year2_loss| × taxRate = 200,000 × 0.35 = 70,000 COP per year of error`.

**Canonical fix (Colombian Estatuto Tributario Art. 147):**

The loss carryforward should only be applied against positive EBT. Losses in loss years should accumulate independently:

```javascript
// Correct two-step approach:
let taxes = 0;
let taxableEBT = ebt;

// Step 1: Apply accumulated carryforward ONLY if current year is profitable
if (taxableEBT > 0 && taxLossCarryforward > 0) {
  const relief = Math.min(taxableEBT, taxLossCarryforward);
  taxableEBT -= relief;
  taxLossCarryforward -= relief;
}

// Step 2: Compute taxes on remaining positive taxable income
if (taxableEBT > 0) {
  taxes = taxableEBT * taxRate;
} else {
  // This year has a loss — add it to the carryforward pool
  taxLossCarryforward += Math.abs(ebt);
}

const netProfit = ebt - taxes;
```

**Verification of fix with same inputs:**

```
Year 1: ebt=-100K, lcf=0
  taxableEBT=-100K (not positive → skip relief step)
  taxableEBT <= 0 → lcf += 100K = 100K ✓

Year 2: ebt=-200K, lcf=100K
  taxableEBT=-200K (not positive → skip relief step)
  taxableEBT <= 0 → lcf += 200K = 300K ✓

Year 3: ebt=+400K, lcf=300K
  taxableEBT=+400K → relief = min(400K, 300K) = 300K
  taxableEBT = 400K - 300K = 100K; lcf = 0
  taxes = 100K × 0.35 = 35,000 ✓ (previously: 175,000)
  netProfit = 400K − 35K = 365,000 ✓
```

### F-06.4 — 🟡 Warning: COGS Double-Counting Risk

`totalExpenses = fixedExpenses + totalVariableExpenses` where `totalVariableExpenses = totalCOGS + itemVariableCosts`. The `totalCOGS` comes from income item `unitCost × qty`. If a user also enters a `variable` expense item in `expenses.items` for the same cost (e.g., "raw materials" expense entered both as item unitCost AND as a separate variable expense), costs will be double-counted.

**No code fix needed** — this is a UX/validation concern. Recommendation: add a note in the expenses UI warning users not to duplicate costs that are already captured as income item unit costs.

---

## Test Cases

| TC | Inputs | Expected |
|----|--------|----------|
| TC-06-A | Revenue=1M, COGS=300K, fixedOpEx=200K, varOpEx=100K, depreciation=50K, interest=30K, taxRate=35% | EBITDA=400K; EBIT=350K; EBT=320K; taxes=112K; netProfit=208K |
| TC-06-B | EBT=-100K year1, EBT=+200K year2, taxRate=35% (single loss year — should work in old code too) | Y1:taxes=0,netProfit=-100K; Y2:taxableIncome=200-100=100K,taxes=35K,netProfit=165K |
| TC-06-C (regression) | EBT=-100K year1, EBT=-200K year2, EBT=+400K year3, taxRate=35% | Y3:taxableIncome=400-300=100K,taxes=35K,netProfit=365K |
| TC-06-D | EBT=0 all years | taxes=0 all years; no carryforward accumulation |
| TC-06-E | EBT=+100K, taxRate=0% | taxes=0, netProfit=100K |

---

*References:*
- IAS 12 — Income Taxes
- IAS 1.82(d) — Income statement line items
- Congreso de Colombia, Estatuto Tributario Art. 240 (tax rate), Art. 147 (loss carryforward)
- Ley 2155/2021, Art. 10 — 35% rate effective 2022
