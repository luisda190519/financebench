# Usage Guide

Step-by-step instructions for running the full benchmark pipeline.

---

## Prerequisites

- Node.js ≥ 18
- MongoDB running locally (or MONGODB_URI set)
- App backend running on `http://localhost:5000`
- A valid JWT token (obtained by logging into the app)

## Step 0 — Configuration

Copy `.env.example` and fill in your values:

```bash
cp Backend/benchmark/.env.example .env
```

Edit `.env`:

```
BENCHMARK_TOKEN=<your JWT token>
BENCHMARK_API_URL=http://localhost:5000/api
MONGODB_URI=mongodb://localhost:27017/viabilidad
BENCHMARK_MODEL_TAG=gpt-4o   # tag for this LLM run
```

---

## Step 1 — Generate the Dataset

Run the generator to create 1000 synthetic business cases:

```bash
npm run generate:dataset
```

Output:
```
Backend/benchmark/dataset/
├── cases/
│   ├── case_0001.json
│   ├── case_0002.json
│   └── ... (1000 files)
├── index.json        ← metadata index
└── all_cases.json    ← all cases in one array
```

Each case is an Input-Only JSON (no pre-calculated analysis). See [JSON_FORMAT.md](JSON_FORMAT.md).

### Validate the Dataset

```bash
npm run benchmark:validate
```

Expected output:
```
📊 Validation Results
   Total cases: 1000
   ✅ Passed:  1000
   ❌ Failed:  0

🎉 All cases valid! Dataset is ready for use.
```

---

## Step 2 — Run the LLM (External Step)

This step is performed outside the app. For each case in `dataset/cases/`, present the
JSON to your LLM and ask it to perform a complete financial viability analysis.

**Recommended prompt template:**

```
You are a financial analyst specializing in Latin American business viability assessment.

Given the following business project inputs, perform a complete financial analysis and
return the result as a JSON object in the "Complete Format" described at [link to JSON_FORMAT.md].

Your response must include:
- The original inputs unchanged under the "inputs" key
- Your analysis under the "analysis" key with all 4 scenarios:
  (optimista, normal, pesimista, controlado)
- For each scenario: npv, irr, paybackPeriod, totalRevenue, totalExpenses,
  grossMargin, breakevenRevenue, and annualData[]

Business inputs:
<paste input-only JSON here>
```

Save each LLM response as a JSON file in a folder, e.g.:
```
benchmark/llm-outputs/
├── gpt4o_case_0001.json
├── gpt4o_case_0002.json
└── ...
```

---

## Step 3 — Import LLM Results

Use the batch import script to upload all LLM outputs, trigger recalculation, and store
comparison results in MongoDB:

```bash
npm run benchmark:import-all -- --dir Backend/benchmark/llm-outputs
```

Options:
- `--dir` (required): Directory containing LLM output JSON files
- `--limit N`: Process only first N files (useful for testing)

Progress output:
```
📥 Importing benchmark cases from: Backend/benchmark/llm-outputs
   Found: 1000 JSON files

   [▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░] 850/1000  ✅ 823  ❌ 27

✅ Import complete
   Processed: 1000
   Imported:  973
   Errors:    27

📄 Run log: Backend/benchmark/logs/import-run-2025-01-15T14-30-00Z.json
```

Error logs are written to `Backend/benchmark/logs/`.

---

## Step 4 — Aggregate Results

Read all stored comparisons from MongoDB and compute aggregate accuracy metrics:

```bash
npm run benchmark:aggregate
```

Output file: `Backend/benchmark/results/aggregate-2025-01-15.json`

Sample output structure:
```json
{
  "model": "gpt-4o",
  "generatedAt": "2025-01-15T15:00:00Z",
  "n_cases": 973,
  "overall_accuracy": 0.912,
  "overall_avg_error_percent": 3.24,
  "by_metric": {
    "npv":           { "accuracy": 0.87, "avg_error_pct": 5.12 },
    "irr":           { "accuracy": 0.91, "avg_error_pct": 3.80 },
    "paybackPeriod": { "accuracy": 0.95, "avg_error_pct": 1.95 }
  },
  "by_project_type": {
    "cafeteria":   { "n_cases": 98, "accuracy": 0.89, "avg_error_pct": 4.10 },
    "software":    { "n_cases": 97, "accuracy": 0.94, "avg_error_pct": 2.30 }
  },
  "by_scenario": {
    "optimista":   { "avg_error_pct": 3.45 },
    "normal":      { "avg_error_pct": 2.90 }
  }
}
```

---

## Step 5 — Export to CSV

Export the aggregate results as CSV files suitable for pandas or R:

```bash
npm run benchmark:export-results
```

Output files in `Backend/benchmark/results/csv/`:
- `summary.csv` — overall metrics
- `by_project_type.csv` — breakdown by business type
- `by_metric.csv` — breakdown by financial metric
- `by_scenario.csv` — breakdown by analysis scenario

---

## Using the Web UI

You can also import and view comparisons through the web interface:

1. **Import a single project**: Go to the Projects list → click "Importar JSON" → select a Complete JSON file.
2. **View comparison**: After import (Mode B), you're redirected to the Comparison Dashboard.
3. **Export comparison**: Click "Descargar Reporte CSV" on the comparison page.

---

## Troubleshooting

| Problem | Solution |
|---------|---------|
| `BENCHMARK_TOKEN` expired | Log in to the app again and copy a fresh token |
| MongoDB connection refused | Ensure MongoDB is running and MONGODB_URI is correct |
| Import returns 401 | Token is missing or invalid |
| Import returns 400 VALIDATION_ERROR | LLM output is missing required fields; check the JSON_FORMAT.md |
| 0 projects found in aggregate | Verify projects were imported successfully with `hasComparison: true` |
