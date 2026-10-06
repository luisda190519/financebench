# Task 84 — Export Summary Statistics

## Objective
Generate quick-reference statistics files (JSON + Markdown) for easy consumption.

## Dependencies
- Task 78 (metrics data)

---

## JSON Output

**File**: `docs/benchmark/summary_stats.json`

```json
{
  "benchmark": {
    "name": "FinanceBench",
    "version": "1.0",
    "generatedAt": "ISO timestamp",
    "totalCases": 1000,
    "modelsEvaluated": 9,
    "totalComparisons": 9000,
    "scenariosPerCase": 4,
    "fieldsPerScenario": "4 summary + 14×projectLife annual",
    "projectTypes": 10,
    "difficultyLevels": 3
  },
  "overall": {
    "bestModel": { "name": "?", "accuracy": 0, "mape": 0 },
    "worstModel": { "name": "?", "accuracy": 0, "mape": 0 },
    "avgAccuracy": 0,
    "medianAccuracy": 0,
    "stdAccuracy": 0
  },
  "rankings": [
    { "rank": 1, "model": "?", "accuracy": 0, "mape": 0 },
    { "rank": 2, "model": "?", "accuracy": 0, "mape": 0 }
  ],
  "bestByTask": {
    "npv": { "model": "?", "accuracy": 0 },
    "irr": { "model": "?", "accuracy": 0 },
    "paybackPeriod": { "model": "?", "accuracy": 0 },
    "breakEvenPoint": { "model": "?", "accuracy": 0 },
    "revenue": { "model": "?", "accuracy": 0 },
    "totalCOGS": { "model": "?", "accuracy": 0 },
    "grossProfit": { "model": "?", "accuracy": 0 },
    "ebitda": { "model": "?", "accuracy": 0 },
    "netProfit": { "model": "?", "accuracy": 0 },
    "leveredCashFlow": { "model": "?", "accuracy": 0 }
  },
  "groups": {
    "proprietary": { "models": 7, "avgAccuracy": 0 },
    "openSource": { "models": 2, "avgAccuracy": 0 },
    "gap": 0,
    "gapPValue": 0
  },
  "difficulty": {
    "simple": { "avgAccuracy": 0 },
    "medium": { "avgAccuracy": 0 },
    "complex": { "avgAccuracy": 0 }
  },
  "hardestTask": { "name": "?", "avgAccuracy": 0 },
  "easiestTask": { "name": "?", "avgAccuracy": 0 },
  "universalFailures": { "count": 0, "description": "Cases where 0/9 models succeeded" },
  "universalSuccesses": { "count": 0, "description": "Cases where 9/9 models succeeded" }
}
```

## Markdown Output

**File**: `docs/benchmark/summary_stats.md`

```markdown
# FinanceBench — Summary Statistics

## Quick Numbers
- **1000** test cases × **9** models = **9000** evaluations
- **10** project types, **3** difficulty levels, **4** scenarios per case
- Best overall: **[Model]** at **[X]%** accuracy
- Proprietary avg: **[X]%** vs Open-source avg: **[Y]%** (gap: **[Z] pp**)

## Model Rankings
| Rank | Model | Accuracy | MAPE |
|------|-------|----------|------|
| 1 | ... | ...% | ...% |
...

## Best by Task
| Task | Best Model | Accuracy |
|------|-----------|----------|
| NPV | ... | ...% |
...
```

---

## Implementation

**Technology**: Node.js
**Script**: `Backend/benchmark/scripts/exportSummary.js` (new)

**Process**:
1. Load `metrics_full.json` from Task 78
2. Extract top-level statistics
3. Generate JSON and Markdown files

---

## Output
- `docs/benchmark/summary_stats.json`
- `docs/benchmark/summary_stats.md`

## Acceptance Criteria
- [ ] JSON file is valid and complete
- [ ] Markdown file is human-readable
- [ ] All rankings correct (verified against full metrics)
- [ ] Group comparisons include p-values
- [ ] Difficulty breakdown included
