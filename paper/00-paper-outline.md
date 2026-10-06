# FinanceBench — Complete Paper Outline

## Paper Identity

**Title**: FinanceBench: A Comprehensive Benchmark for Evaluating Large Language Models on Financial Analysis Tasks

**Target Venue**: NeurIPS 2025 — Datasets & Benchmarks Track

**Core Thesis**: FinanceBench is the first benchmark for structured financial analysis that provides a deterministic ground-truth oracle, enabling exact numerical comparison of LLM outputs against verified calculations across 1,000 test cases spanning 10 business types, 4 scenarios, and 15+ financial metrics per year.

**Positioning vs. Prior Work**:
- **FinBen/PIXIU** focus on NLP tasks (sentiment, NER, summarization, stock prediction). FinanceBench evaluates *numerical computation accuracy* with exact ground truth.
- **MMLU/HELM/BIG-bench** test knowledge retrieval via multiple choice. FinanceBench requires *multi-step calculation* producing numerical outputs.
- **FinQA** involves reading comprehension over existing tables. FinanceBench requires *generating complete financial projections* from raw business inputs.
- **GSM8K/MATH** test general math. FinanceBench tests *domain-specific financial reasoning* with real-world conventions (amortization, depreciation, tax carryforward).

---

## Section Flow

| # | Section | Words | References | Tables/Figures |
|---|---------|-------|------------|----------------|
| 1 | Abstract | 150–250 | 0 | — |
| 2 | Introduction | 1000–1200 | 13–15 | — |
| 3 | Related Work | 800–1000 | 21–25 | — |
| 4 | Benchmark Design | 1500–1800 | ~6 | Table 1, Table 2, Figure 1, Figure 2 |
| 5 | Experimental Setup | 600–800 | ~6 | Table 3 |
| 6 | Results | 1000–1200 | ~3 | Table 4, Table 5, Figure 3 |
| 7 | Analysis | 800–1000 | ~7 | Figure 4, Figure 5, Table 6 |
| 8 | Discussion | 600–800 | ~7 | — |
| 9 | Limitations | 300–400 | ~2 | — |
| 10 | Conclusion | 250–350 | 0 | — |
| 11 | Ethics Statement | 150–200 | ~4 | — |
| **Total** | | **~7500–9000** | **~70** | **6 Tables + 5 Figures** |

---

## Figure & Table Inventory

### Tables

| ID | Section | Content |
|----|---------|---------|
| Table 1 | 4.2 Task Taxonomy | 10 task categories: name, description, oracle computation, reasoning type, difficulty, # metrics |
| Table 2 | 4.3 Data Generation | 10 business types: type name, Colombian context, COP investment range, product count by difficulty, key characteristics |
| Table 3 | 5.1 Models | 10 LLMs: model name, provider, type (proprietary/open-source), estimated params, API version |
| Table 4 | 6.1 Overall Results | Accuracy matrix: 10 models (rows) × aggregated task categories (columns) + overall accuracy |
| Table 5 | 6.3 Error Analysis | Error taxonomy: type, frequency %, example, affected metrics |
| Table 6 | 7.3 Failure Modes | Accuracy by scenario (optimista/normal/pesimista/controlado) and difficulty (simple/medium/complex) |

### Figures

| ID | Section | Content | Type |
|----|---------|---------|------|
| Figure 1 | 4.1 Design Principles | FinanceBench pipeline: Generator → JSON → LLM → Complete JSON → Oracle → Comparison → Report | Architecture diagram |
| Figure 2 | 4.6 Example Cases | One cafeteria case: input snippet → expected output snippet → comparison result | Annotated example |
| Figure 3 | 6.2 By Task Category | Accuracy by task category, top 3 models highlighted | Heatmap or grouped bar chart |
| Figure 4 | 7.1 Model Size | Parameter count (x) vs overall accuracy (y) | Scatter plot |
| Figure 5 | 7.2 Proprietary vs OSS | Accuracy per task category, grouped by proprietary vs open-source | Grouped bar chart |

---

## Reference Distribution

| Section | Cat 1 (Benchmarks) | Cat 2 (Numerical) | Cat 3 (Financial AI) | Cat 4 (Model Comparison) | Cat 5 (Validation) | Cat 6 (Prompt Eng) | Cat 7 (Democratization) | Cat 8 (Ethics) |
|---------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Introduction | 4 | 2 | 3 | 1 | — | — | 2 | 1 |
| Related Work | 5 | 4 | 5 | 3 | 2 | 2 | — | — |
| Benchmark Design | 1 | 1 | 2 | — | 2 | — | — | — |
| Experimental Setup | — | 1 | — | 2 | — | 3 | — | — |
| Results | — | 1 | 1 | 1 | — | — | — | — |
| Analysis | 1 | 2 | 2 | 2 | — | — | — | — |
| Discussion | 1 | — | 1 | — | — | 1 | 2 | 2 |
| Limitations | — | — | 1 | — | 1 | — | — | — |
| Ethics | — | — | — | — | — | — | 1 | 3 |

---

## Writing Order

| Priority | Section | Rationale |
|----------|---------|-----------|
| 1 | 04 — Benchmark Design | Core contribution; entirely grounded in existing codebase |
| 2 | 05 — Experimental Setup | Models and prompting strategy already defined in code |
| 3 | 03 — Related Work | Positions the work; all references available |
| 4 | 02 — Introduction | Narrative clearer after technical sections written |
| 5 | 09 — Limitations | Straightforward, factual |
| 6 | 11 — Ethics Statement | Straightforward |
| 7 | 06 — Results | After experiments are run (placeholder structure now) |
| 8 | 07 — Analysis | After results written |
| 9 | 08 — Discussion | Synthesizes results + analysis |
| 10 | 10 — Conclusion | Summarizes everything |
| 11 | 01 — Abstract | Write LAST — distills entire paper |

---

## Critical Codebase Files

| File | Relevance | Key Lines |
|------|-----------|-----------|
| `Backend/src/models/Project.js` | Oracle engine: `calculateMetrics()` | 276–858 (NPV, IRR, cash flows, depreciation, amortization, tax carryforward) |
| `Backend/benchmark/generator/utils.js` | Mulberry32 PRNG, `seededRandom()` helpers | Full file |
| `Backend/benchmark/generator/index.js` | Dataset generation loop (10 types × 100 cases) | Full file |
| `Backend/benchmark/generator/templates/*.js` | 10 business type templates | cafeteria.js as representative example |
| `Backend/benchmark/generator/validate.js` | Structural + numeric validation | Full file |
| `Backend/src/controllers/projectController.js` | `compareAnalysis()`, `importProjectJSON()`, `buildExportJSON()` | 517–790 |
| `Frontend/src/components/BenchmarkComparison.jsx` | Comparison UI + CSV export | Full file |
| `Frontend/src/components/SensitivityAnalysis.jsx` | Sensitivity analysis calculations | 26–155 |

---

## Key Technical Details to Thread Throughout

1. **Mulberry32 PRNG** — Platform-independent determinism without dependencies
2. **12-step calculateMetrics() chain** — Investment → Revenue → COGS → Expenses → EBITDA → Depreciation → Amortization → Taxes (w/ loss carryforward) → Cash Flows → NPV → IRR → Payback
3. **IRR triple-method** — `financial` library → Newton-Raphson (100 iter, tol 1e-6) → Bisection fallback
4. **French amortization** — Monthly PMT formula, per-year interest/principal accumulation
5. **Tax loss carryforward** — Negative EBT accumulated, offsets future taxable income
6. **Frequency normalization** — monthly ×12, quarterly ×4, annual ×1, one-time at year 0
7. **Three-tier comparison** — ≤1% match, 1–5% small, >5% large
8. **316 comparison fields** — Per 5-year project: 4 scenarios × (4 metrics + 15 annual × 5 years)
9. **10 Colombian business templates** — COP currency, local names, realistic parameters
10. **Difficulty calibration** — Simple (2 items), Medium (4 items), Complex (7+ items)

---

## Questions Answered During Planning

1. **What does the app calculate?** 15+ metrics: revenue, COGS, gross profit, gross margin, EBITDA, depreciation, EBIT, interest, EBT, taxes, net profit, unlevered CF, levered CF, NPV, IRR, payback, break-even
2. **How accurate?** Formulas are standard corporate finance (DCF, French amortization, straight-line depreciation); verified against `financial` npm library with custom fallbacks
3. **How are 1000 cases generated?** Mulberry32 PRNG with deterministic seeds, 10 templates × 100 cases (40 simple + 40 medium + 20 complex)
4. **What makes a good test case?** Realistic parameters, validated structure, deterministic reproducibility, scenario ordering (optimista ≥ normal ≥ pesimista)
5. **How does comparison work?** `compareAnalysis()` computes relative error per field, classifies into 3 tiers, aggregates into summary statistics
6. **Expected results?** Hypothesis: proprietary models (GPT-4o, Claude) outperform open-source; arithmetic tasks easier than multi-step cascading; IRR hardest
7. **Main challenges?** Multi-step error propagation, financial convention adherence, structured JSON output parsing
8. **Main contributions?** (1) Ground-truth oracle, (2) 1000 deterministic cases, (3) comparison engine, (4) multi-model evaluation, (5) open-source release
