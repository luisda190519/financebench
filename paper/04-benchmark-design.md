# 4. Benchmark Design

The design of FinanceBench addresses a fundamental gap in existing evaluation frameworks: the absence of a benchmark that requires large language models to perform complete, multi-step financial computations with verifiable numerical ground truth. In this section, we describe the five design principles that guided our work, the task taxonomy covering ten categories of financial analysis, the data generation pipeline that produces one thousand deterministic test cases, the computational oracle that establishes ground truth, the comparison engine that scores LLM outputs, and concrete examples illustrating the benchmark in practice.

## 4.1 Design Principles

Five principles guided the construction of FinanceBench, each motivated by limitations observed in prior benchmarks.

**Deterministic Reproducibility.** All test cases are generated from a seeded pseudo-random number generator, specifically the Mulberry32 algorithm [1]. Given a 32-bit integer seed, Mulberry32 produces an identical sequence of floating-point values across platforms and runtime environments, with no external library dependencies. The generator assigns seed values sequentially (seed 1 through seed 1000), ensuring that the entire dataset can be regenerated from scratch with bit-exact results. This stands in contrast to benchmarks relying on web-scraped or crowd-sourced data, where collection conditions are difficult to replicate precisely.

**Oracle-Based Ground Truth.** Rather than relying on human expert annotations—which introduce inter-annotator disagreement, particularly on multi-step financial calculations where reasonable conventions may differ [2]—FinanceBench employs a computational oracle. This oracle is a deterministic calculation engine that takes structured business inputs and produces exact numerical outputs using verified financial formulas. Every metric in the ground truth is computed programmatically, eliminating annotation subjectivity for quantitative tasks.

**Realistic Complexity.** Test cases model real business scenarios with the structural complexity that a financial analyst would encounter in practice. Each case includes multiple income items (products or services) with per-item pricing, cost, and growth parameters; expense categories operating on different frequencies (monthly, quarterly, annual, and one-time); fixed assets with individual depreciation schedules; and multi-source financing structures with independent loan amortization. This complexity ensures that the benchmark evaluates applied financial reasoning, not simplified textbook exercises.

**Multi-Scenario Coverage.** Each test case requires complete financial analysis under four distinct economic scenarios: *optimista* (optimistic), *normal* (baseline), *pesimista* (pessimistic), and *controlado* (conservative). These scenarios vary income parameters—selling prices, quantities, and discounts—while holding costs and investments constant. Evaluating across scenarios tests whether a model maintains consistent reasoning when the same business is analyzed under different market conditions, and whether it correctly propagates parameter changes through the entire computation chain.

**Graduated Difficulty.** The benchmark includes three difficulty levels calibrated by structural complexity. Simple cases contain two income items, three expense categories, and basic single-source financing. Medium cases expand to four income items, four to five expense categories, and additional depreciable assets. Complex cases feature seven or more income items, six or more expense categories, custom investment fields with depreciation, and multiple debt sources with distinct interest rates and repayment terms. This graduated structure enables fine-grained assessment of how model performance degrades as problem complexity increases.

## 4.2 Task Taxonomy

FinanceBench organizes financial analysis into ten task categories, each corresponding to a specific computation or set of computations performed by the oracle. Table 1 presents the complete taxonomy.

**Table 1.** Task taxonomy. Each category maps to specific oracle computations, a reasoning type reflecting the cognitive demands of the task, and the number of output fields per scenario.

| # | Task Category | Description | Reasoning Type | Output Fields |
|---|--------------|-------------|---------------|:---:|
| 1 | Revenue & COGS Projection | Compute annual revenue and cost of goods sold from item-level price, cost, quantity, discount, frequency, and growth parameters | Arithmetic | 2 per year |
| 2 | Expense Aggregation | Normalize expenses by frequency (monthly ×12, quarterly ×4, annual ×1, one-time at year 0) and apply annual growth compounding | Frequency conversion + growth | 3 per year |
| 3 | Gross Profit & Margins | Derive gross profit and gross margin percentage from revenue and COGS | Single-step derivation | 2 per year |
| 4 | Income Statement Construction | Build the complete cascading chain: EBITDA → depreciation → EBIT → interest → EBT → taxes (with loss carryforward) → net profit | Multi-step sequential | 8 per year |
| 5 | Depreciation Scheduling | Compute straight-line depreciation across multiple assets with different useful lives | Asset-level aggregation | 1 per year |
| 6 | Loan Amortization | Calculate monthly payments using the French system, then accumulate interest and principal into annual totals across multiple debt sources | Iterative monthly computation | 2 per year |
| 7 | Cash Flow Computation | Derive unlevered cash flow (EBIT + depreciation − taxes) and levered cash flow (net profit + depreciation − principal) | Multi-input derivation | 2 per year |
| 8 | Net Present Value | Discount unlevered cash flows at the project discount rate and sum, then subtract initial investment | Discounted summation | 1 per scenario |
| 9 | Internal Rate of Return | Find the discount rate at which NPV equals zero, requiring numerical root-finding | Root-finding algorithm | 1 per scenario |
| 10 | Payback & Break-Even | Determine payback period via linear interpolation of cumulative cash flows; compute break-even revenue using contribution margin analysis | Interpolation + algebraic | 2 per scenario |

Several properties of this taxonomy merit discussion. First, the tasks form a natural dependency chain: Task 1 (revenue) feeds Task 3 (gross profit), which feeds Task 4 (income statement), which feeds Task 7 (cash flows), which feeds Tasks 8–10 (NPV, IRR, payback). An error in revenue computation therefore propagates through all downstream metrics. Second, the tasks span a range of reasoning demands, from direct arithmetic (Task 1) through conditional multi-year logic (tax loss carryforward in Task 4) to numerical optimization (IRR root-finding in Task 9). Third, tasks 1–7 produce per-year outputs repeated across the project life (typically three to seven years), while tasks 8–10 produce per-scenario summary metrics. For a five-year project evaluated across four scenarios, the complete output encompasses 4 × (15 × 5 + 4) = 316 individual numerical fields.

## 4.3 Data Generation

The dataset generation pipeline produces 1,000 test cases following a structured template system. Ten business type templates, each implemented as a parameterized generator function, produce cases representative of common Latin American small and medium enterprises. Table 2 summarizes the templates.

**Table 2.** Business type templates. Investment ranges are in Colombian Pesos (COP). Product count varies by difficulty level (simple / medium / complex).

| Business Type | Investment Range (COP M) | Products | Revenue Frequency | Key Characteristics |
|--------------|:---:|:---:|:---:|---|
| Cafetería | 20–150 | 2/4/7 | Daily (365/yr) | Food & beverage, high frequency, multiple SKUs |
| Software/SaaS | 5–80 | 2/4/7 | Monthly (12/yr) | Subscriptions, low COGS (~12%), high margins |
| Retail | 15–200 | 2/4/7 | Monthly (12/yr) | Physical store, inventory-driven |
| Construcción | 50–1,000 | 2/4/7 | Annual (1/yr) | Project-based, high capex, lumpy revenue |
| Manufactura | 30–500 | 2/4/7 | Monthly (12/yr) | Production line, complex cost structure |
| Consultoría | 3–30 | 2/4/7 | Monthly (12/yr) | Services-based, minimal fixed assets |
| E-commerce | 5–50 | 2/4/7 | Monthly (12/yr) | Online sales, logistics costs |
| Agricultura | 10–100 | 2/4/7 | Annual (1/yr) | Seasonal, long gestation, weather exposure |
| Finca Raíz | 80–1,000 | 2/4/7 | Monthly (12/yr) | Real estate, high ticket, long amortization |
| Hospedaje | 50–500 | 2/4/7 | Daily (365/yr) | Accommodation, occupancy-based pricing |

Each template encapsulates domain knowledge for its business type: realistic product catalogs with Colombian price ranges, appropriate cost ratios (e.g., 28% for coffee beverages, 45% for bakery items), expense categories matching industry norms (rent, payroll, utilities, marketing), and investment components typical of each sector. For instance, the cafetería template generates Café Espresso items priced between COP 4,000 and COP 6,000 with a 28% cost-of-goods ratio and daily sales frequency (365 periods per year).

**Difficulty calibration** governs structural complexity independently of business type. Of the 100 cases per business type, 40 are simple, 40 medium, and 20 complex. Difficulty affects the number of income items (2, 4, or 7+), the number of expense categories (3, 4–5, or 6+), the presence of depreciable custom investment fields (complex only), and the number of independent debt financing sources (one for simple/medium, multiple for complex). This yields a distribution of 400 simple cases, 400 medium cases, and 200 complex cases across the full dataset.

**Scenario parameter variation** ensures that each case exercises the model across different economic conditions. The optimistic scenario increases base quantities by approximately 30% and prices by 10% relative to the normal baseline. The pessimistic scenario reduces quantities by approximately 35% and prices by 10%. The controlled scenario applies a moderate quantity reduction of approximately 15% while keeping prices at baseline. This systematic variation tests whether models correctly adjust downstream calculations when input parameters change.

**Financing generation** uses a utility function that distributes total investment between equity partners and debt sources, with debt ratios randomly drawn between 0% and 65–70% of total investment. Debt sources are assigned realistic Colombian bank names (Bancolombia, Davivienda, BBVA Colombia), annual interest rates between 12% and 28%, and repayment terms of 24 to 60 months. This produces diverse financing structures that test the model's ability to compute loan amortization schedules across varying configurations.

**Structural validation** runs automatically after generation. A validation script checks all 1,000 cases for required fields (non-empty project name, project life between 1 and 50 years, defined tax and discount rates, at least one income source), non-negative and finite numerical values for all expenses and income quantities, and proper structure of the investment and financing sections. Any case failing validation triggers an error that halts the pipeline, ensuring dataset integrity before evaluation begins.

## 4.4 The Oracle Engine

The ground-truth oracle is a calculation engine that takes structured business inputs and produces a complete set of financial metrics for each of the four scenarios. The computation follows a twelve-step chain, where each step consumes outputs from prior steps.

**Step 1: Initial Investment.** The oracle sums eight standard investment categories (civil works, labor, materials, licenses, furniture, cash, bank deposits, and inventory) plus the values of all named fixed assets and any custom investment fields to produce the total initial investment.

**Step 2: Financing Gap.** Total partner equity contributions and custom financing source amounts are subtracted from the initial investment. Any remaining shortfall becomes the external loan amount: *externalLoan = max(0, initialInvestment − partnersTotal − customSourcesTotal)*.

**Step 3: Loan Amortization.** Each debt source (the external loan and any custom debt sources) is amortized independently using the French (constant payment) system. The monthly payment is computed as:

*PMT = P × r(1+r)^n / ((1+r)^n − 1)*

where *P* is the principal, *r* is the monthly interest rate (annual rate / 1200), and *n* is the term in months. A monthly loop tracks the interest payment (*balance × r*), principal payment (*PMT − interest*), and remaining balance, accumulating interest and principal into annual totals for each year of the project life.

**Step 4: Depreciation.** Straight-line depreciation is computed for each depreciable asset: *annual depreciation = asset value / useful life*. Depreciation is applied for the lesser of the asset's useful life and the project duration. The oracle supports both standard fixed assets and custom investment fields marked as depreciable, each with individual useful lives.

**Step 5: Revenue.** For each income item *i* in scenario *s* at year *t*:

*Revenue_{i,s,t} = sellingPrice_{i,s} × (1 − discount_{i,s}/100) × quantity_{i,s} × periodsPerYear_i × (1 + growthRate_i)^{t−1}*

Total revenue is the sum across all items. The growth factor applies compound annual growth starting from the base year.

**Step 6: Cost of Goods Sold.** Computed analogously to revenue:

*COGS_{i,s,t} = unitCost_{i,s} × quantity_{i,s} × periodsPerYear_i × (1 + growthRate_i)^{t−1}*

**Step 7: Expenses.** Each expense item has a base amount (or unit cost × quantity) and a frequency. The oracle normalizes to annual equivalents: monthly amounts are multiplied by 12, quarterly by 4, annual amounts remain unchanged, and one-time costs are applied only in year zero. Annual growth is then compounded: *expense_t = annualBase × (1 + growthRate)^{t−1}*. Expenses are classified as fixed or variable, enabling contribution margin analysis.

**Step 8: Income Statement.** The oracle constructs the full cascading chain:

- *Gross Profit = Revenue − COGS*
- *Total Expenses = Fixed Expenses + Variable Expenses* (where variable expenses include COGS plus operating variable costs)
- *EBITDA = Revenue − Total Expenses*
- *EBIT = EBITDA − Depreciation*
- *EBT = EBIT − Interest Expense*

**Step 9: Taxes with Loss Carryforward.** Tax computation incorporates a loss carryforward mechanism. The oracle maintains a running carryforward balance initialized to zero. At each year:

- *Taxable Income = EBT + Carryforward*
- If *Taxable Income > 0*: *Taxes = Taxable Income × Tax Rate*; carryforward resets to zero
- If *Taxable Income ≤ 0*: *Taxes = 0*; carryforward absorbs the loss: *Carryforward = |Taxable Income|*

This models the standard corporate finance convention where operating losses in early years offset taxable income in subsequent profitable years, a feature particularly relevant for startup scenarios where initial years often produce negative earnings.

**Step 10: Cash Flows.** Two cash flow measures are computed:

- *Unlevered Cash Flow = EBIT + Depreciation − Taxes* (project value independent of financing structure)
- *Levered Cash Flow = Net Profit + Depreciation − Principal Payment* (actual cash available to equity holders after debt service)

**Step 11: Net Present Value.** NPV is computed by discounting unlevered cash flows:

*NPV = −Initial Investment + Σ_{t=1}^{T} UCF_t / (1 + r)^t*

where *r* is the discount rate and *T* is the project life. The oracle uses the `financial` JavaScript library's NPV function as the primary implementation, with a custom summation fallback if the library call fails.

**Step 12: Internal Rate of Return.** IRR is the rate at which NPV equals zero. The oracle implements a three-level fallback strategy: (1) the `financial` library's IRR function; (2) a Newton-Raphson implementation with a maximum of 100 iterations and convergence tolerance of 10^{-6}, using the derivative *dNPV/dr = −Σ j × CF_j / (1+r)^{j+1}*; and (3) a bisection method over the interval [−0.99, 100] as a final fallback. The result is validated to lie within the bounds [−99%, 10,000%] and converted to a percentage. IRR is computed on levered cash flows and is only attempted for conventional cash flow patterns (negative initial investment followed by at least one positive cash flow).

**Payback period** is determined by tracking cumulative levered cash flows. When the cumulative total crosses zero between year *t−1* and year *t*, linear interpolation yields the fractional payback period: *Payback = (t − 1) + |cumulative_{t-1}| / leveredCF_t*.

**Break-even** is computed as revenue-based for the items system: *Break-even Revenue = (Fixed Costs + Depreciation + Interest) / (1 − Variable Cost Ratio)*, where the variable cost ratio is year-one variable expenses divided by year-one revenue.

All numerical outputs are rounded to two decimal places to avoid spurious precision in comparisons.

## 4.5 Comparison Engine

The comparison engine evaluates LLM outputs against oracle ground truth using a field-by-field approach with threshold-based classification. When a model's complete JSON output—containing both inputs and pre-computed analysis—is imported into the system, the oracle independently recalculates all metrics from the inputs. The comparison engine then examines each numerical field in the model's output against the corresponding oracle value.

**Relative error** is computed as:

*ε = |v_{model} − v_{oracle}| / |v_{oracle}|*   when *v_{oracle} ≠ 0*

When the oracle value is zero, the error is defined as 1.0 if the model value is nonzero, and 0.0 otherwise.

**Three-tier classification** maps each field to one of three statuses:

- **Match** (ε ≤ 0.01): The model value is within 1% of ground truth. The field is essentially correct.
- **Small difference** (0.01 < ε ≤ 0.05): The model value deviates by 1–5%. This may reflect rounding differences, minor arithmetic errors, or alternative but reasonable computational conventions.
- **Large difference** (ε > 0.05): The model value deviates by more than 5%. This indicates a substantive error in calculation or formula application.

**Fields compared.** For each of the four scenarios, the engine compares four scenario-level metrics (NPV, IRR, payback period, break-even point) and fifteen annual metrics per year (revenue, COGS, gross profit, gross margin percentage, fixed expenses, variable expenses, total expenses, EBITDA, depreciation, operating profit, interest expense, taxes, net profit, unlevered cash flow, and levered cash flow). For a five-year project, this yields 4 × (4 + 15 × 5) = 316 individual field comparisons per test case.

**Null handling.** If either the model output or the oracle value for a field is null or undefined (for example, IRR when cash flows do not follow conventional patterns), the comparison assigns a status of "N/A" and excludes the field from accuracy calculations.

**Summary statistics** aggregate comparison results into an overall accuracy score (proportion of fields classified as "match"), average error percentage across all valid comparisons, and counts of match, small, and large differences. These statistics can be further broken down by scenario, by metric, by year, by project type, and by difficulty level.

## 4.6 Example Cases

To illustrate the benchmark concretely, consider a cafetería test case generated with seed 42 at simple difficulty. The case models a small coffee shop named "Café Andino" with a five-year project life, 33% corporate tax rate, and 12% discount rate.

**Inputs.** The business sells two products daily (365 periods per year): Café Espresso (normal scenario: COP 4,800 selling price, COP 1,344 unit cost, 72 units/day, 5.3% annual growth) and Cappuccino (normal scenario: COP 6,200 selling price, COP 1,736 unit cost, 48 units/day, 4.1% annual growth). Fixed expenses include rent (COP 3,000,000/month, 3% growth), payroll (COP 5,500,000/month, 4.5% growth), and utilities (COP 600,000/month, 4% growth). Investment totals approximately COP 85,000,000 including renovation, equipment (espresso machine with 5-year depreciation), furniture, and working capital. Financing comes from a founding partner contributing 55% equity and a Bancolombia debt source at 18% annual interest over 48 months for the remainder.

**Oracle output** (normal scenario, year 1). The oracle computes: revenue of COP 234,768,000 (from both products × 365 days), COGS of COP 66,124,800, gross profit of COP 168,643,200 (71.8% margin), total expenses of COP 175,924,800 (including COP 109,200,000 in fixed operating expenses), EBITDA of COP 58,843,200, depreciation of COP 12,400,000, operating profit of COP 46,443,200, interest expense of COP 6,732,000, taxes of COP 13,105,000 (on positive EBT), net profit of COP 26,606,200, and levered cash flow of COP 30,118,200. Over five years, the oracle produces NPV of COP 48,200,000 (positive—project is viable), IRR of 24.6%, and payback period of 3.2 years.

**Illustrative comparison.** When a hypothetical LLM processes this case, its outputs might look like:

| Metric (Year 1) | LLM Output | Oracle | Relative Error | Status |
|---|---:|---:|---:|:---:|
| Revenue | 234,768,000 | 234,768,000 | 0.00% | Match |
| COGS | 66,500,000 | 66,124,800 | 0.57% | Match |
| EBITDA | 57,200,000 | 58,843,200 | 2.79% | Small |
| Net Profit | 24,100,000 | 26,606,200 | 9.42% | Large |
| NPV | 38,500,000 | 48,200,000 | 20.12% | Large |
| IRR | 19.8% | 24.6% | 19.51% | Large |

This example demonstrates the cascading error phenomenon: a small COGS error (0.57%) produces a moderate EBITDA deviation (2.79%), which amplifies through tax calculations into a large net profit error (9.42%), ultimately producing a significantly incorrect NPV (20.12% deviation) and IRR (19.51% deviation). The model gets the revenue exactly right and approximates early-stage metrics reasonably, but errors compound through the multi-step chain. This pattern—where accuracy degrades along the computation sequence—is precisely the type of insight that FinanceBench is designed to reveal.

---

*[1] The Mulberry32 implementation uses the recurrence: s = (s + 0x6D2B79F5) | 0; t = Math.imul(s ^ (s >>> 15), s | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296. No external dependencies are required.*

*[2] Artstein, R., & Poesio, M. (2008). Inter-coder agreement for computational linguistics. Computational Linguistics, 34(4), 555–596.*
