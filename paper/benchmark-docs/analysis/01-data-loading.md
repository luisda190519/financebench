# Task 77 — Data Loading & Validation

## Objective
Load all 9000 result files (9 models × 1000 cases) and validate data integrity before analysis.

## Data Sources

| Source | Path | Format |
|--------|------|--------|
| LLM Results | `Backend/benchmark/prompts/results/<model>/case_XXXX_<type>_<difficulty>.json` | Minified JSON |
| Ground Truth Cases | `Backend/benchmark/dataset/cases/case_XXXX.json` | Pretty JSON |
| Case Index | `Backend/benchmark/dataset/index.json` | JSON array of metadata |

### Models (9)
```
claude-haiku-4, claude-opus-4.6, claude-sonnet-4.6,
deepseek-chat, gemini-3-flash, gemini-3.1-pro,
gpt-5.3, gpt-5.4, grok-code
```

### Expected Files Per Model: 1000
- File naming: `case_XXXX_<projectType>_<difficulty>.json`
- Case IDs: `case_0001` through `case_1000`

---

## Methodology

### Step 1: Directory Structure Verification
1. Enumerate all subdirectories in `Backend/benchmark/prompts/results/`
2. Confirm exactly 9 model folders exist
3. For each model folder:
   - Count total `.json` files
   - List any missing case IDs (expected: case_0001 to case_1000)
   - Flag unexpected files

### Step 2: JSON Parsing & Validation
For each of the 9000 files:
1. Read file and attempt `JSON.parse()`
2. Validate required top-level keys: `meta`, `inputs`, `analysis`
3. Validate `meta` fields: `caseId`, `projectType`, `difficulty`, `seed`
4. Validate `analysis` has all 4 scenarios: `optimista`, `normal`, `pesimista`, `controlado`
5. Validate each scenario has: `npv`, `irr`, `paybackPeriod`, `breakEvenPoint`, `annualData`
6. Validate `annualData` is an array with expected year count (from `inputs.general.projectLife`)
7. Validate each annual record has all 14 fields:
   - `year`, `revenue`, `totalCOGS`, `grossProfit`, `fixedExpenses`, `variableExpenses`
   - `totalExpenses`, `ebitda`, `depreciation`, `operationalProfit`
   - `interestExpense`, `taxes`, `netProfit`, `unleveredCashFlow`, `leveredCashFlow`

### Step 3: Data Alignment
1. Load `Backend/benchmark/dataset/index.json` as reference
2. For each model, verify that every result file's `meta.caseId` matches the filename
3. Verify `inputs` section is identical across all 9 models for the same caseId (ground truth consistency)
4. Flag any case where inputs differ between models (would indicate corrupted data)

### Step 4: Initial Statistics
Generate a validation report with:
- Total files found per model
- Valid JSON parse rate per model
- Missing files list (if any)
- Malformed files list (if any)
- Schema violations list
- Input consistency check results

---

## Implementation

**Technology**: Node.js
**Script**: `Backend/benchmark/scripts/analyzeData.js` (new)

**Key reusable code**:
- File enumeration pattern from `Backend/benchmark/scripts/importAll.js`
- JSON structure knowledge from `Backend/benchmark/scripts/generateResults.js`

**Data structure output**:
```javascript
{
  models: {
    "gpt-5.4": {
      totalFiles: 1000,
      validFiles: 998,
      malformed: ["case_0512_retail_medium.json"],
      missing: [],
      cases: {
        "case_0001": { meta, inputs, analysis } // parsed data
      }
    },
    // ... 8 more models
  },
  groundTruth: {
    "case_0001": { meta, inputs } // from dataset/cases/
  },
  validation: {
    inputConsistency: true,
    totalErrors: 2,
    errors: [...]
  }
}
```

---

## Output
- Loaded data structures ready for Task 78 (comparison)
- `docs/benchmark/analysis/reports/validation_report.json`
- `docs/benchmark/analysis/reports/validation_report.md` (human-readable)
- Console summary with pass/fail counts

## Acceptance Criteria
- [ ] All 9 model folders verified
- [ ] 9000 files parsed (or failures documented)
- [ ] Schema validation passes for all valid files
- [ ] Input consistency confirmed across models
- [ ] Validation report generated
