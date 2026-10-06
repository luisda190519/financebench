# Illustrative Examples of Model Outputs

The following examples are drawn from representative cases in the benchmark suite. Each example highlights a specific error type, project type, or performance differential observed during evaluation. Oracle values were computed using deterministic financial formulas applied to the input data.

---

## Example 1: NPV Calculation on a Complex Agricultural Project

**Case**: A 7-year cacao plantation in rural Colombia with staged planting, a 3-year maturation delay before revenue onset, annual maintenance costs of $18,500, and a harvest revenue projection of $95,000/year at maturity. Discount rate: 12%.

| Model | NPV Output | Oracle Value | Error |
|---|---|---|---|
| Claude Opus 4.6 (88.47% overall) | $127,340 | $129,180 | 1.4% |
| Claude Sonnet 4.6 (86.31% overall) | $131,520 | $129,180 | 1.8% |
| GPT-5.4 (83.92% overall) | $118,900 | $129,180 | 8.0% |
| DeepSeek Chat (69.71% overall) | $89,450 | $129,180 | 30.8% |
| Gemini 3 Flash (57.64% overall) | $162,700 | $129,180 | 25.9% |

**Analysis**: Claude Opus 4.6 correctly handled the 3-year revenue delay by applying zero cash inflows for years 1--3 and discounting subsequent revenues from year 4 onward. DeepSeek Chat applied the discount factor correctly but failed to account for the maturation delay, effectively shifting all revenues forward by three years and underestimating NPV. Gemini 3 Flash omitted discounting on the cost side entirely, overstating NPV by treating maintenance costs at face value while discounting revenues.

**Error type**: Temporal reasoning (DeepSeek), Formula selection (Gemini Flash)

---

## Example 2: IRR Estimation for a Technology Startup

**Case**: A SaaS startup with initial investment of $250,000, monthly recurring revenue growing from $8,000 in month 6 to $45,000 by month 36, server costs scaling at 15% of revenue, and a 3-year evaluation horizon.

| Model | IRR Output | Oracle Value | Error |
|---|---|---|---|
| Claude Opus 4.6 (88.47%) | 34.2% | 33.8% | 0.4 pp |
| GPT-5.4 (83.92%) | 31.7% | 33.8% | 2.1 pp |
| Claude Haiku 4 (75.13%) | 28.5% | 33.8% | 5.3 pp |
| Grok Code (62.38%) | 19.4% | 33.8% | 14.4 pp |

**Analysis**: IRR computation requires iterative root-finding on the net cash flow polynomial. Claude Opus 4.6 produced a result consistent with Newton-Raphson convergence on monthly cash flows. Grok Code appeared to approximate IRR using a simplified annual aggregation, collapsing 36 months into 3 annual periods and losing the compounding effect of monthly revenue growth. Claude Haiku 4 used the correct monthly granularity but introduced a rounding error in the server cost deduction that propagated across all periods.

**Error type**: Arithmetic (Haiku), Formula selection (Grok Code)

---

## Example 3: Break-Even Analysis for a Retail Bakery

**Case**: A neighborhood bakery with fixed costs of $4,200/month (rent, utilities, insurance), variable cost per unit of $1.85 (ingredients, packaging), and average selling price of $4.50 per unit across a product mix of 12 items.

| Model | Break-Even Units/Month | Oracle Value | Error |
|---|---|---|---|
| Claude Opus 4.6 (88.47%) | 1,585 | 1,585 | 0.0% |
| Claude Sonnet 4.6 (86.31%) | 1,585 | 1,585 | 0.0% |
| GPT-5.4 (83.92%) | 1,585 | 1,585 | 0.0% |
| Gemini 3.1 Pro (81.84%) | 1,585 | 1,585 | 0.0% |
| GPT-5.3 (78.26%) | 1,584 | 1,585 | 0.1% |
| DeepSeek Chat (69.71%) | 1,600 | 1,585 | 0.9% |
| Grok Code (62.38%) | 933 | 1,585 | 41.1% |
| Gemini 3 Flash (57.64%) | 2,334 | 1,585 | 47.3% |

**Analysis**: This case illustrates the bimodal distribution observed in break-even calculations (Section 4.3). All Tier 1 models and most Tier 2 models correctly applied the formula Q = FC / (P - VC) = 4200 / (4.50 - 1.85) = 1,585. Grok Code divided fixed costs by the selling price alone (4200 / 4.50 = 933), neglecting to subtract variable costs. Gemini 3 Flash divided fixed costs by the variable cost (4200 / 1.85 = 2,270, then applied an unexplained adjustment to reach 2,334). These are canonical formula selection errors where the model retrieves a structurally similar but incorrect formula.

**Error type**: Formula selection (Grok Code, Gemini Flash)

---

## Example 4: Multi-Scenario Sensitivity in a Real Estate Development

**Case**: A mixed-use residential/commercial development with total investment of $3.8M, 18-month construction period, projected annual rental income of $620,000 (normal scenario), and operating expenses of $185,000/year. Pessimistic scenario assumes 30% vacancy rate and 15% cost overrun.

| Model | Pessimistic ROI | Oracle Value | Error |
|---|---|---|---|
| Claude Opus 4.6 (88.47%) | 4.8% | 4.6% | 0.2 pp |
| Claude Sonnet 4.6 (86.31%) | 5.1% | 4.6% | 0.5 pp |
| GPT-5.3 (78.26%) | 6.9% | 4.6% | 2.3 pp |
| Grok Code (62.38%) | 11.2% | 4.6% | 6.6 pp |

**Analysis**: The pessimistic scenario requires two simultaneous adjustments: reducing rental income by the vacancy rate (620,000 x 0.70 = $434,000) and increasing total investment by the cost overrun (3,800,000 x 1.15 = $4,370,000). Claude Opus 4.6 applied both adjustments correctly. GPT-5.3 applied the vacancy adjustment but used the original investment figure, overstating ROI. Grok Code applied neither adjustment to the denominator and only partially adjusted revenue, producing an estimate closer to the normal-scenario ROI. This example illustrates how pessimistic scenarios amplify errors through the compounding of multiple parameter adjustments.

**Error type**: Logical reasoning (GPT-5.3), Compound error (Grok Code)

---

## Example 5: Unit/Scale Error in a Manufacturing Project

**Case**: A furniture manufacturing operation with monthly production capacity of 450 units, unit cost of $320, selling price of $580, and annual fixed overhead of $1,440,000.

| Model | Annual Profit | Oracle Value | Error |
|---|---|---|---|
| Claude Opus 4.6 (88.47%) | -$36,000 | -$36,000 | 0.0% |
| GPT-5.4 (83.92%) | -$36,000 | -$36,000 | 0.0% |
| DeepSeek Chat (69.71%) | $1,368,000 | -$36,000 | >100% |
| Gemini 3 Flash (57.64%) | $117,000 | -$36,000 | >100% |

**Analysis**: The oracle computation is: annual revenue = 450 x 12 x $580 = $3,132,000; annual variable cost = 450 x 12 x $320 = $1,728,000; annual profit = $3,132,000 - $1,728,000 - $1,440,000 = -$36,000 (a loss). DeepSeek Chat treated the monthly capacity of 450 as already annualized, computing revenue as 450 x $580 = $261,000/month = $3,132,000/year but then applied fixed costs monthly ($1,440,000 / 12 = $120,000), producing a monthly profit of $114,000 and annual profit of $1,368,000. The model mixed monthly and annual figures inconsistently. Gemini 3 Flash made a similar partial error, annualizing revenue correctly but treating $1,440,000 as monthly overhead.

**Error type**: Unit/scale error (DeepSeek, Gemini Flash)

---

## Example 6: Payback Period for a Solar Energy Installation

**Case**: A commercial solar panel installation costing $185,000 with annual energy savings of $32,500, a government rebate of $25,000 in year 1, annual maintenance of $2,800, and a panel degradation rate of 0.5% per year on energy output.

| Model | Payback Period | Oracle Value | Error |
|---|---|---|---|
| Claude Opus 4.6 (88.47%) | 5.4 years | 5.5 years | 1.8% |
| Claude Sonnet 4.6 (86.31%) | 5.5 years | 5.5 years | 0.0% |
| Gemini 3.1 Pro (81.84%) | 5.7 years | 5.5 years | 3.6% |
| Claude Haiku 4 (75.13%) | 4.9 years | 5.5 years | 10.9% |
| Gemini 3 Flash (57.64%) | 4.3 years | 5.5 years | 21.8% |

**Analysis**: This case requires tracking a diminishing annual net benefit (savings decline at 0.5%/year due to panel degradation) and incorporating the one-time rebate correctly in year 1 only. Claude Haiku 4 correctly applied the rebate in year 1 but failed to model the degradation, treating savings as constant at $32,500/year. Gemini 3 Flash both applied the rebate as a recurring annual benefit and ignored degradation, producing an unrealistically short payback period. The case demonstrates how compounding small modeling errors---each individually minor---can produce substantially distorted outputs.

**Error type**: Temporal reasoning (Haiku), Compound error (Gemini Flash)

---

## Example 7: Debt Service Coverage Ratio for a Hotel Project

**Case**: A boutique hotel with projected annual net operating income (NOI) of $890,000, annual debt service of $620,000 (principal + interest on a $5.2M loan at 7.5% over 20 years), and a reserve requirement of 4% of gross revenue ($1,850,000 gross).

| Model | DSCR | Oracle Value | Error |
|---|---|---|---|
| Claude Opus 4.6 (88.47%) | 1.315 | 1.316 | 0.1% |
| GPT-5.4 (83.92%) | 1.310 | 1.316 | 0.5% |
| GPT-5.3 (78.26%) | 1.435 | 1.316 | 9.0% |
| Grok Code (62.38%) | 1.435 | 1.316 | 9.0% |

**Analysis**: The oracle computes DSCR as (NOI - reserve) / debt service = (890,000 - 74,000) / 620,000 = 1.316. GPT-5.3 and Grok Code both omitted the reserve requirement deduction from NOI, computing 890,000 / 620,000 = 1.435. This is a logical reasoning error: the models recognized the DSCR formula but failed to incorporate the reserve as a mandatory pre-debt-service deduction. In a real advisory context, this overstatement could lead to an incorrect assessment that the project comfortably meets lender covenants when it is in fact marginal.

**Error type**: Logical reasoning (GPT-5.3, Grok Code)

---

## Example 8: Weighted Average Cost of Capital for a Mixed-Financing Project

**Case**: A logistics company seeking $2.4M in financing: $1.2M equity (expected return 18%), $800K bank loan (6.5% interest), and $400K government subsidy (0% cost). Corporate tax rate: 25%.

| Model | WACC | Oracle Value | Error |
|---|---|---|---|
| Claude Opus 4.6 (88.47%) | 10.63% | 10.63% | 0.0% |
| Claude Sonnet 4.6 (86.31%) | 10.63% | 10.63% | 0.0% |
| GPT-5.4 (83.92%) | 10.80% | 10.63% | 0.17 pp |
| DeepSeek Chat (69.71%) | 12.70% | 10.63% | 2.07 pp |
| Gemini 3 Flash (57.64%) | 9.25% | 10.63% | 1.38 pp |

**Analysis**: The oracle computation weights each source: (1.2/2.4 x 18%) + (0.8/2.4 x 6.5% x (1-0.25)) + (0.4/2.4 x 0%) = 9.0% + 1.625% + 0% = 10.625%, rounded to 10.63%. DeepSeek Chat failed to apply the tax shield to the debt component, computing the debt cost as 0.8/2.4 x 6.5% = 2.167% instead of the after-tax 1.625%, yielding an inflated WACC. Gemini 3 Flash correctly applied the tax shield but miscalculated the equity weight, using $1.2M / $2.8M instead of $1.2M / $2.4M, apparently adding the subsidy to the denominator twice.

**Error type**: Formula selection (DeepSeek), Arithmetic (Gemini Flash)
