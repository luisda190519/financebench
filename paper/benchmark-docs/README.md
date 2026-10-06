# Benchmark System — Overview

## What Is This?

The AppViabilidadNegocios Benchmark is a **ground-truth evaluation framework** for measuring
how accurately Large Language Models (LLMs) perform financial viability analysis of Latin
American business projects.

The app implements deterministic financial formulas (NPV, IRR, payback period, EBITDA, cash
flow projections) that serve as the authoritative "correct" answer. LLM outputs are compared
against these calculations field-by-field.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    BENCHMARK PIPELINE                │
│                                                     │
│  [Dataset Generator]                                │
│    ↓ 1000 Input-Only JSONs (10 types × 100 cases)  │
│                                                     │
│  [LLM Under Test]                                   │
│    ↓ LLM reads inputs → produces analysis JSON      │
│                                                     │
│  [Import API] POST /api/projects/import/json        │
│    ↓ App recalculates metrics from same inputs      │
│    ↓ Comparison engine diffs LLM vs App values      │
│    ↓ Result stored in MongoDB benchmarkComparison   │
│                                                     │
│  [Aggregator] aggregate.js                          │
│    ↓ Reads all stored comparisons                   │
│    ↓ Computes accuracy by metric / type / scenario  │
│                                                     │
│  [CSV Export] exportResults.js                      │
│    ↓ Publication-ready CSVs for pandas/R            │
└─────────────────────────────────────────────────────┘
```

## Quickstart

```bash
# Step 1 — Generate dataset
npm run generate:dataset      # creates 1000 cases in Backend/benchmark/dataset/
npm run benchmark:validate    # verify all 1000 cases pass validation

# Step 2 — Run LLM (external step)
# Feed each input-only JSON to your LLM.
# Ask: "Perform a complete financial viability analysis for this business."
# Save each LLM output as a "complete" JSON in a folder, e.g. benchmark/llm-outputs/

# Step 3 — Import and compare
npm run benchmark:import-all  # imports LLM outputs, stores comparisons in MongoDB

# Step 4 — Aggregate results
npm run benchmark:aggregate   # reads MongoDB → writes results/aggregate-[date].json

# Step 5 — Export for analysis
npm run benchmark:export-results  # writes results/csv/*.csv
```

## Key Documents

| File | Purpose |
|------|---------|
| [JSON_FORMAT.md](JSON_FORMAT.md) | Complete JSON schema for input-only and complete formats |
| [USAGE.md](USAGE.md) | Step-by-step guide for running the full benchmark |
| [RESEARCH.md](RESEARCH.md) | Methodology for academic paper reproducibility |
| [examples/](examples/) | Sample JSON files |

## Metrics Evaluated

| Metric | Description |
|--------|-------------|
| `npv` | Net Present Value |
| `irr` | Internal Rate of Return |
| `paybackPeriod` | Years to recover investment |
| `totalRevenue` | Cumulative revenue over project life |
| `totalExpenses` | Cumulative operating expenses |
| `grossMargin` | Gross margin percentage |
| `ebitda` | EBITDA for each year (per annualData) |
| `cashFlow` | Free cash flow per year (per annualData) |

## Comparison Thresholds

| Status | Threshold | Color |
|--------|-----------|-------|
| Match | < 1% error | Green |
| Small difference | 1%–5% error | Yellow |
| Large difference | ≥ 5% error | Red |

## Citation

If you use this benchmark in academic work, please cite:

```bibtex
@misc{viabilidad-benchmark-2025,
  title  = {AppViabilidadNegocios Benchmark: Evaluating LLM Financial Analysis Accuracy},
  year   = {2025},
  note   = {Ground-truth oracle for Latin American business viability analysis}
}
```
