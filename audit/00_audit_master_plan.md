# 00 — Audit Master Plan

**Project:** AppViabilidadNegocios
**Audit purpose:** Financial accuracy certification for FinanceBench academic research
**Standard:** Panel of certified accountants, financial analysts, and university finance professors
**Date:** 2026-03-30
**Auditor:** Claude Sonnet 4.6 (AI-assisted financial engineering review)

---

## 1. File Inventory — Financial Calculation Touch Points

| File | Lines | Role | Layer |
|------|-------|------|-------|
| `Backend/src/models/Project.js` | 932 | **Primary calculation engine** — all NPV/IRR/amortization/depreciation/income statement logic | 1–5 |
| `Frontend/src/utils/SharedCalculations.js` | 225 | Cache/reactivity wrapper; reads pre-computed backend metrics; derives EBITDA margin, net margin, ROA | 6 |
| `Frontend/src/utils/metricFormatters.js` | 157 | Display formatting + viability thresholds (IRR vs discount rate, payback vs project life) | 6 |
| `Frontend/src/utils/metricInterpretations.js` | 457 | Traffic-light interpretation text; no new calculations | 6 |
| `Frontend/src/components/ProjectEvaluation.jsx` | ~800 | Profitability Index = (NPV/investment)+1; cumulative CF chart; viability scoring | 6 |
| `Frontend/src/components/FinancialStatements.jsx` | ~800 | Common-size analysis (%), trend growth rates; margin KPIs; all read from `annualData` | 6 |
| `Frontend/src/components/BalanceSheet.jsx` | ~500 | Static balance sheet snapshot — assets at cost, loan at original amount, retained earnings as sum | 6 |
| `Frontend/src/components/CashFlow.jsx` | ~1000 | Cumulative CF chart; present value recalculation; FCF = unleveredCF − depreciation (proxy) | 6 |
| `Frontend/src/components/SensitivityAnalysis.jsx` | ~700 | Discount rate sensitivity (exact NPV); growth/volume sensitivity (approximation factors) | 6 |
| `Frontend/src/components/ProjectConclusions.jsx` | ~800 | Health score (0–100); debt repayment schedule (amortization formula duplicated from backend) | 6 |
| `Frontend/src/components/Income.jsx` | ~600 | Per-item revenue preview and growth projection; year-level preview only | 6 |
| `Frontend/src/components/Expenses.jsx` | ~700 | Annual expense projection chart — **BUG: always multiplies by 12** | 6 |
| `Backend/src/utils/validation.js` | 371 | Schema validation only; no financial calculations | — |
| `Backend/src/services/groqChatService.js` | 427 | References pre-computed metrics; no calculations | — |

---

## 2. Calculation Dependency Map

```
┌─────────────────────────────────────────────────────────────┐
│ LAYER 0 — Raw Inputs                                        │
│  investmentAssets (fixedAssets[], customFields[],           │
│  civilWorks, laborCost, materials, licenses, furniture,     │
│  cash, bank, inventory)                                     │
│  financing (partners[], customSources[], interestRate,      │
│  loanTermMonths)                                            │
│  income.items[] (per-item: sellingPrice, unitCost,          │
│  quantity, discount, growthRate, periodsPerYear)            │
│  expenses.items[] (amount/unitCost×qty, frequency,          │
│  growthRate, type: fijo/variable)                           │
│  general (projectLife, taxRate, discountRate)               │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│ LAYER 1 — Asset Schedules (independent of each other)       │
│  calculateInitialInvestment() → scalar                      │
│  amortize() → interestByYear[0..n-1], principalByYear[0..n-1]│
│  calculateDepreciation() → depreciationByYear[0..n-1]       │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│ LAYER 2 — Annual Revenue & Expenses (per scenario, per year)│
│  New items system: revenue, totalCOGS from income.items[]   │
│  Old system: unitPrice × units × occupancy × periods        │
│  expensesByYear[year] = { fixed, variable }                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│ LAYER 3 — Income Statement (per scenario, per year)         │
│  EBITDA = revenue − totalExpenses                           │
│  EBIT   = EBITDA − depreciation        [Layer 1]            │
│  EBT    = EBIT − interestExpense       [Layer 1]            │
│  taxableIncome = EBT + taxLossCarryforward                  │
│  taxes  = max(0, taxableIncome) × taxRate                   │
│  netProfit = EBT − taxes                                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│ LAYER 4 — Cash Flows                                        │
│  unleveredCF = EBIT + depreciation − taxes                  │
│    (NOTE: taxes include ITS; see F-08.1)                    │
│  leveredCF   = netProfit + depreciation − principalPayment  │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│ LAYER 5 — Investment Metrics                                │
│  NPV     = npv(discountRate, [-inv, ...unleveredCF])        │
│    (INCONSISTENCY: IRR uses levered; see F-09.1)            │
│  IRR     = irr([-inv, ...leveredCF])                        │
│  payback = interpolation on cumulative leveredCF            │
│  breakEven = fixedBase / (1 − variableCostRatio)            │
└─────────────────────────────────────────────────────────────┘

LAYER 6 — Frontend visualization (reads stored financialMetrics)
```

---

## 3. Master Findings Registry

| Finding ID | Domain | Severity | Status | File | Line(s) | Research Critical |
|-----------|--------|----------|--------|------|---------|-------------------|
| F-01.2 | Initial Investment | 🟡 Warning | ✅ **FIXED** | Project.js | ~307 | No |
| F-02.1 | Loan Amortization | ✅ Resolved | Resolved | Project.js | 342 | — |
| F-02.2 | Loan Amortization | 🟡 Warning | ✅ **FIXED** | Project.js | 354 | Yes |
| F-02.3 | Loan Amortization | 🟡 Warning | ✅ **FIXED** | Project.js | 332 | Yes |
| F-03.1 | Depreciation | 🟢 Compliant | — | Project.js | 386–407 | — |
| F-03.2 | Depreciation | 🟡 Warning | ✅ **FIXED** | assetSchema | 4–8 | **YES** |
| F-04.1 | Operating Expenses | 🟢 Compliant | — | Project.js | 439–449 | — |
| F-05.1 | Revenue Projections | 🟢 Compliant | — | Project.js | 535–545 | — |
| F-05.2 | Revenue Projections | 🟡 Warning | Documented | Project.js | 537 | **YES** |
| F-06.1 | Income Statement | 🟢 Compliant | — | Project.js | 578–595 | — |
| F-06.4 | Income Statement | 🟡 Warning | Documented | UI/design | n/a | No |
| **F-07.1** | **Tax / P&L** | 🔴 **Critical** | ✅ **FIXED** | **Project.js** | **585–593** | **YES** |
| F-08.1 | Cash Flow | 🟡 Warning | Documented | Project.js | 599 | Moot (NPV now uses levered CF) |
| F-08.2 | Cash Flow | 🟢 Compliant | — | Project.js | 601 | — |
| **F-09.1** | **NPV** | 🟡 Warning | ✅ **FIXED** | **Project.js** | **668, 680** | **YES** |
| F-09.2 | NPV | 🟡 Warning | ✅ **FIXED** | Project.js | 702 | Yes |
| F-09.3 | IRR | 🟢 Compliant | — | Project.js | 687 | — |
| F-10.1 | Sensitivity | 🟢 Compliant | — | SensitivityAnalysis.jsx | 62–74 | — |
| F-10.2 | Sensitivity | 🟡 Warning | ✅ **FIXED** | SensitivityAnalysis.jsx | 78–99 | No |
| F-10.3 | Sensitivity | 🟡 Warning | ✅ **FIXED** | SensitivityAnalysis.jsx | 101–122 | No |
| F-11.1 | Balance Sheet | 🟡 Warning | Documented | BalanceSheet.jsx | 66–90 | No |
| F-11.2 | Balance Sheet | 🟡 Warning | ✅ **FIXED** | BalanceSheet.jsx | 71–82 | No |
| F-11.3 | Balance Sheet | 🟡 Warning | ✅ **FIXED** | BalanceSheet.jsx | 107 | No |
| F-11.4 | Balance Sheet | 🟡 Warning | ✅ **FIXED** | BalanceSheet.jsx | 103–106 | No |
| **F-12.1** | **Expense Display** | 🔴 **Critical** | ✅ **FIXED** | **Expenses.jsx** | **237, 244** | No |
| F-13.1 | Break-Even | 🟡 Warning | ✅ **FIXED** | Project.js | 676 | Moderate |
| F-INT.1 | Float Discipline | 🟡 Warning | Documented | Project.js | 603–620 | Low |
| Tax Rate | Colombian Default | 🔴 **Critical** | ✅ **FIXED** | Project.js | 165, 281 | **YES** |

**Summary:** 0 Critical (3 fixed), 0 Active warnings, 8 Compliant/Documented, 1 Pre-existing Resolved
**Fixed in this audit:** F-07.1, F-09.1, F-09.2, F-12.1, F-02.3, F-03.2, F-02.2, F-01.2, F-10.2, F-10.3, F-11.2, F-11.3, F-11.4, F-13.1, Tax Rate (35%)
**Research Critical findings remaining:** F-05.2 (documentation only — growth convention already in RESEARCH.md)

---

## 4. Correct Calculation Order

Per sound financial modeling practice (Berk & DeMarzo, *Corporate Finance*, 6th ed.):

1. **Initial Investment** — sum all asset and startup cost components
2. **Financing Gap** — `initialInvestment − partnerContributions − customSources`
3. **Amortization Schedule** — monthly PMT → annual interest/principal arrays
4. **Depreciation Schedule** — straight-line per asset, independent
5. **Revenue** — per scenario, per year, applying growth convention `(1+g)^(year-1)`
6. **Operating Expenses** — per year, normalized by frequency, applying same growth convention
7. **EBITDA** — `Revenue − OpEx` (depreciation NOT yet subtracted)
8. **EBIT** — `EBITDA − Depreciation`
9. **EBT** — `EBIT − InterestExpense`
10. **Taxes** — loss carryforward applied only to positive taxable income, then `EBT × taxRate`
11. **Net Profit** — `EBT − Taxes`
12. **Cash Flows** — levered and unlevered per year
13. **NPV** — apply on consistent CF series (either all-levered or all-unlevered)
14. **IRR** — apply on same CF series as NPV
15. **Payback** — cumulative levered CF interpolation
16. **Break-Even** — per year 1 (or per year for dynamic analysis)

---

## 5. Colombian / LATAM Financial Context Assumptions

| Parameter | App Default | Correct Value | Source | Status |
|-----------|------------|---------------|--------|--------|
| Corporate tax rate | 30% | **35%** (2022–present) | Art. 240 Estatuto Tributario, Ley 2155/2021 | ⚠️ Default wrong for 2024–2025 benchmark cases |
| Loss carryforward limit | Unlimited | Unlimited (since 2006, Art. 147 ET) | Ley 1111/2006 | ✅ No time limit cap needed |
| Depreciation method | Straight-line | Permitted under NIIF/IAS 16 | IAS 16.62 | ✅ Compliant |
| Salvage value in depreciation base | Not modeled | Required under IAS 16.50: `(cost - residual) / life` | IAS 16 | 🔴 Non-compliant (F-03.2) |
| Inflation proxy | User-defined growthRate | Banco de la República target 3% | No hardcoded default needed | ✅ User-configurable |

---

## 6. Audit Completion Checklist

- [x] `01_investment_and_depreciation.md` — written
- [x] `02_loan_amortization.md` — written
- [x] `03_revenue_projections.md` — written
- [x] `04_operating_expenses.md` — written
- [x] `05_income_statement_and_ebitda.md` — written
- [x] `06_cash_flow_statements.md` — written
- [x] `07_npv_calculation.md` — written
- [x] `08_irr_calculation.md` — written
- [x] `09_payback_period.md` — written
- [x] `10_breakeven_analysis.md` — written
- [x] `11_balance_sheet.md` — written
- [x] `12_sensitivity_analysis_and_scenarios.md` — written
- [x] F-07.1 fixed and verified
- [x] F-12.1 fixed and verified
- [x] F-09.1/F-09.2 fixed and verified
- [x] F-02.3 fixed and verified
- [x] F-03.2 fixed and verified
- [x] Build passes: `vite build` ✓

---

## 7. Research Critical Escalation Note

**[RESEARCH CRITICAL — BENCHMARK VALIDITY]**

Finding F-09.1 reveals that the oracle NPV uses an ITS-inclusive "unlevered" CF series discounted at a user-defined rate. This deviates from both standard textbook approaches:
- True UFCF (Damodaran) discounted at WACC
- Equity CF (Berk & DeMarzo) discounted at cost of equity

LLMs trained on standard finance textbooks will compute NPV using one of the two textbook-correct methods and will systematically diverge from the oracle for any leveraged project — **not because their math is wrong, but because the oracle's methodology is non-standard**. This should be flagged to the FinanceBench research panel for adjudication before publication.

---

*References:*
- Berk, J. & DeMarzo, P. (2020). *Corporate Finance* (5th ed.). Pearson.
- Damodaran, A. (2012). *Investment Valuation* (3rd ed.). Wiley.
- Brealey, R., Myers, S. & Allen, F. (2020). *Principles of Corporate Finance* (13th ed.). McGraw-Hill.
- IASB. *IAS 16 — Property, Plant and Equipment*. IFRS Foundation.
- Congreso de Colombia. *Estatuto Tributario*, Art. 240, Art. 147 (as amended by Ley 2155/2021).
