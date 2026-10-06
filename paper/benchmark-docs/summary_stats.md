# Benchmark Summary Statistics

Corrected values as of 2026-03-16.

## Overview

| Parameter              | Value       |
|------------------------|-------------|
| Total Cases            | 1,000       |
| Total Models           | 9           |
| Total Evaluations      | 9,000       |
| Project Types          | 10          |
| Difficulty Levels      | 3           |
| Scenarios per Case     | 4           |
| Total Field Comparisons| 2,660,000   |

## Rankings

| Rank | Model              | Accuracy (%) | MAPE (%) |
|------|--------------------|--------------|----------|
| 1    | Claude Opus 4.6    | 88.47        | 7.83     |
| 2    | Claude Sonnet 4.6  | 86.31        | 10.27    |
| 3    | GPT-5.4            | 83.92        | 12.41    |
| 4    | Gemini 3.1 Pro     | 81.84        | 14.95    |
| 5    | GPT-5.3            | 78.26        | 18.73    |
| 6    | Claude Haiku 4     | 75.13        | 22.14    |
| 7    | DeepSeek Chat      | 69.71        | 27.86    |
| 8    | Grok Code          | 62.38        | 36.29    |
| 9    | Gemini 3 Flash     | 57.64        | 41.57    |

## Group Comparison

| Group       | Models | Avg Accuracy (%) |
|-------------|--------|-------------------|
| Proprietary | 7      | 78.80             |
| Open Source | 2      | 66.05             |
| **Gap**     |        | **12.75 pp**      |

Gap direction: proprietary leads. Difference is not statistically significant.

## Best per Metric

| Metric        | Best Model        | Accuracy (%) |
|---------------|-------------------|--------------|
| NPV           | Claude Opus 4.6   | 75.14        |
| IRR           | Claude Opus 4.6   | 79.87        |
| Payback       | Claude Opus 4.6   | 97.23        |
| BreakEven     | Claude Opus 4.6   | 76.18        |
| Revenue       | Claude Opus 4.6   | 92.81        |
| COGS          | Claude Opus 4.6   | 91.94        |
| GrossProfit   | Claude Opus 4.6   | 90.17        |
| EBITDA        | Claude Opus 4.6   | 86.72        |
| NetProfit     | Claude Opus 4.6   | 80.49        |
| CashFlow      | Claude Opus 4.6   | 77.03        |
| FixedExpenses | Claude Opus 4.6   | 99.98        |
| Depreciation  | Claude Opus 4.6   | 100.00       |

## Difficulty Breakdown

| Difficulty | Avg Accuracy (%) |
|------------|-------------------|
| Simple     | 80.73             |
| Medium     | 76.41             |
| Complex    | 72.38             |
