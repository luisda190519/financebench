# 02 — Loan Amortization

**Domain:** PMT calculation, interest/principal decomposition, multi-loan support
**File:** `Backend/src/models/Project.js` — lines 320–363 (`calculateLoanPayments`, `amortize`)
**References:** Berk & DeMarzo, *Corporate Finance* (5th ed.), Ch. 4 — Valuing Bonds and Loans; IAS 23 — Borrowing Costs

---

## Current Implementation

```javascript
// Project.js lines 321–363
const calculateLoanPayments = () => {
  const interestByYear = {};
  const principalByYear = {};
  for (let year = 0; year < projectLife; year++) {
    interestByYear[year] = 0;
    principalByYear[year] = 0;
  }

  const amortize = (principal, annualRate, termMonths) => {
    if (principal <= 0 || annualRate <= 0 || termMonths <= 0) return;  // ← F-02.3 BUG
    const monthlyRate = annualRate / 100 / 12;
    const monthlyPayment = principal *
      (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
      (Math.pow(1 + monthlyRate, termMonths) - 1);
    let balance = principal;
    for (let month = 0; month < termMonths && balance > 0; month++) {
      const year = Math.floor(month / 12);
      if (year >= projectLife) break;                // ← F-02.2: silent truncation
      const interestPayment = balance * monthlyRate;
      const principalPayment = Math.min(monthlyPayment - interestPayment, balance);  // ← F-02.1: CORRECT
      interestByYear[year] += interestPayment;
      principalByYear[year] += principalPayment;
      balance -= principalPayment;
    }
  };

  // Primary external loan
  const loan = project.financing || {};
  amortize(externalLoan, parseFloat(loan.interestRate) || 0, parseInt(loan.loanTermMonths) || 0);

  // Custom debt sources
  (project.financing.customSources || [])
    .filter(s => s.type === 'debt')
    .forEach(s => amortize(
      parseFloat(s.amount) || 0,
      parseFloat(s.interestRate) || 0,
      parseInt(s.termMonths) || 0
    ));

  return { interestByYear, principalByYear };
};
```

---

## Canonical Formula

### PMT — Monthly Payment

**Standard annuity formula** (Berk & DeMarzo, 4.9):

```
PMT = P × [r × (1 + r)^n] / [(1 + r)^n − 1]
```

Where:
- `P` = loan principal
- `r` = periodic interest rate = `annualRate / 12` (monthly)
- `n` = number of periods = `termMonths`

### Monthly Interest/Principal Decomposition

For each payment period `k` (1-indexed):
```
Interest_k   = Balance_{k-1} × r
Principal_k  = PMT − Interest_k
Balance_k    = Balance_{k-1} − Principal_k
```

This produces a fully amortizing schedule where `Balance_n = 0` by construction (floating-point tolerance permitting).

### Zero-Interest Loan

When `r = 0`, the PMT formula is indeterminate (`0/0`). Correct formula:
```
PMT = P / n
```
Equal principal installments; no interest component.

---

## Gap Analysis

| Aspect | Status | Notes |
|--------|--------|-------|
| PMT formula | 🟢 Compliant | Correct standard annuity formula at lines 334–336 |
| Monthly interest = balance × rate | 🟢 Compliant | Line 341: `balance * monthlyRate` |
| Principal = PMT − Interest | 🟢 Compliant | Line 342: `Math.min(monthlyPayment - interestPayment, balance)` |
| Balance reduction per period | 🟢 Compliant | Line 345: `balance -= principalPayment` |
| Annual aggregation | 🟢 Compliant | `Math.floor(month / 12)` maps months to years correctly |
| Multi-source debt support | 🟢 Compliant | `customSources.filter(s => s.type === 'debt')` iterates all |
| Zero-interest loans | 🔴 Skipped | Guard `annualRate <= 0` prevents any processing (F-02.3) |
| Loan term > project life | 🟡 Silent truncation | `if (year >= projectLife) break` — no residual balance warning (F-02.2) |
| interestPayment vs interestExpense | ✅ RESOLVED | Line 342 uses `interestPayment` correctly (F-02.1 was not a live bug) |

---

## Findings

### F-02.1 — ✅ RESOLVED: interestPayment Variable (Line 342)

Audit confirmed that line 342 reads:
```javascript
const principalPayment = Math.min(monthlyPayment - interestPayment, balance);
```
Using the locally declared `interestPayment`. The variable name mismatch described in early audit notes does **not exist** in the live codebase. This finding is documented for the audit record only.

---

### F-02.2 — 🟡 Warning: Loan Term > Project Life

**Current behavior:** When `termMonths > projectLife × 12`, the inner loop breaks at `year >= projectLife`, silently discarding all remaining payment periods. The remaining loan balance at the end of `projectLife` is never computed or disclosed.

**Problem:** In a rigorous financial model, a loan whose amortization period exceeds the project horizon represents an ongoing liability that must be addressed in one of two ways:
1. **Terminal cash outflow:** At time `projectLife`, the remaining balance is treated as a lump-sum payoff (balloon payment), reducing terminal free cash flow.
2. **Constraint validation:** Require `loanTermMonths ≤ projectLife × 12` at the UI/validation layer.

**Current impact:** Principal payments `principalByYear[last year]` may be understated because months beyond project life are skipped. `interestByYear` also understated for the same reason.

**Proposed fix:**
```javascript
// After the loop, compute remaining balance and warn:
if (balance > 0.01 && termMonths > projectLife * 12) {
  console.warn(`Loan has residual balance of ${balance.toFixed(0)} at project end`);
  // Optionally: add to terminal year principal as balloon payment
  principalByYear[projectLife - 1] = (principalByYear[projectLife - 1] || 0) + balance;
}
```

---

### F-02.3 — 🟡 Warning [RESEARCH CRITICAL]: Zero-Interest Loans Silently Skipped

**Current behavior:**
```javascript
if (principal <= 0 || annualRate <= 0 || termMonths <= 0) return;
```

A zero-interest loan (e.g., government subsidy loan at 0%, family loan at 0%) is completely ignored. No principal payments are generated in `principalByYear[]`, meaning:
- `leveredCashFlow = netProfit + depreciation − 0` instead of `− principalPayment`
- IRR is overstated (fewer cash outflows)
- NPV is overstated

**Canonical fix:** Split the guard to handle the zero-rate case separately:
```javascript
const amortize = (principal, annualRate, termMonths) => {
  if (principal <= 0 || termMonths <= 0) return;       // only skip if no loan or no term

  const monthlyRate = annualRate / 100 / 12;           // = 0 when annualRate = 0

  let monthlyPayment;
  if (monthlyRate === 0) {
    monthlyPayment = principal / termMonths;            // equal principal installments
  } else {
    monthlyPayment = principal *
      (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
      (Math.pow(1 + monthlyRate, termMonths) - 1);
  }

  let balance = principal;
  for (let month = 0; month < termMonths && balance > 0; month++) {
    const year = Math.floor(month / 12);
    if (year >= projectLife) break;
    const interestPayment = balance * monthlyRate;      // = 0 when rate = 0
    const principalPayment = Math.min(monthlyPayment - interestPayment, balance);
    interestByYear[year] += interestPayment;
    principalByYear[year] += principalPayment;
    balance -= principalPayment;
  }
};
```

---

## Test Cases

### TC-02-A: Standard Loan Verification (Manual)

**Input:** `principal = 1,200,000, annualRate = 12%, termMonths = 12, projectLife = 5`

- `r = 0.12 / 12 = 0.01`
- `PMT = 1,200,000 × (0.01 × 1.01^12) / (1.01^12 − 1)`
- `1.01^12 = 1.126825`
- `PMT = 1,200,000 × (0.01 × 1.126825) / (1.126825 − 1)`
- `PMT = 1,200,000 × 0.011268 / 0.126825 = 1,200,000 × 0.088849 = 106,619.49`

Month 1: `interest = 1,200,000 × 0.01 = 12,000`; `principal = 106,619.49 − 12,000 = 94,619.49`

**Expected `interestByYear[0]`:** Sum of 12 monthly interest payments
By formula: `interestByYear[0] = 12 × PMT − principal = 12 × 106,619.49 − 1,200,000 = 79,433.88`

**Expected `principalByYear[0]`:** `1,200,000` (fully amortized in year 1)

### TC-02-B: Zero-Interest Loan (Currently Fails)

**Input:** `principal = 600,000, annualRate = 0%, termMonths = 12, projectLife = 5`

**Expected:** `principalByYear[0] = 600,000` (12 × 50,000/month); `interestByYear[0] = 0`
**Current output:** Nothing (loan skipped due to `annualRate <= 0` guard)

### TC-02-C: Loan Term Exceeds Project Life

**Input:** `principal = 1,000,000, annualRate = 10%, termMonths = 84 (7 years), projectLife = 5`

- Months 1–60 processed; months 61–84 skipped
- `principalByYear[4]` should be the sum of months 49–60 (year 5)
- Remaining balance after month 60 ≈ `P × (1.00833)^84 − PMT×[(1.00833)^84−1]/0.00833` / adjusted for partial
- Verify current code truncates silently; proposed fix adds balloon payment to year 5

### TC-02-D: Multiple Custom Debt Sources

**Input:** Primary loan 500K@8%/24mo + custom debt source 300K@12%/12mo, projectLife=5

**Expected:** `interestByYear[0]` = sum of year-1 interest from BOTH loans independently amortized
**Verify:** Interest amounts from each source are additive and not double-counted

---

*References:*
- Berk, J. & DeMarzo, P. (2020). *Corporate Finance* (5th ed.), Ch. 4.4 — Computing Loan Payments
- IAS 23.5 — Borrowing costs definition
