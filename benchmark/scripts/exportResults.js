'use strict';
/**
 * Export benchmark results to CSV for research analysis.
 *
 * Usage:
 *   node benchmark/scripts/exportResults.js
 *
 * Reads the latest aggregate JSON and produces CSV files.
 */

const fs   = require('fs');
const path = require('path');

const RESULTS_DIR = path.join(__dirname, '../results');
const OUTPUT_DIR  = path.join(__dirname, '../results/csv');

function latestAggregateFile() {
  if (!fs.existsSync(RESULTS_DIR)) return null;
  const files = fs.readdirSync(RESULTS_DIR)
    .filter(f => f.startsWith('aggregate-') && f.endsWith('.json'))
    .sort()
    .reverse();
  return files.length > 0 ? path.join(RESULTS_DIR, files[0]) : null;
}

function toCSV(rows) {
  return rows.map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
}

function main() {
  const aggFile = latestAggregateFile();
  if (!aggFile) {
    console.error('❌ No aggregate file found. Run aggregate.js first.');
    process.exit(1);
  }

  console.log(`\n📂 Loading: ${aggFile}`);
  const agg = JSON.parse(fs.readFileSync(aggFile, 'utf-8'));

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // ── Summary CSV ───────────────────────────────────────────────────
  const summaryRows = [
    ['Generated At', 'N Cases', 'Overall Accuracy', 'Avg Error %'],
    [agg.generatedAt, agg.n_cases, agg.overall_accuracy, agg.overall_avg_error_percent]
  ];
  const summaryFile = path.join(OUTPUT_DIR, 'summary.csv');
  fs.writeFileSync(summaryFile, '\uFEFF' + toCSV(summaryRows));
  console.log(`   ✅ Summary: ${summaryFile}`);

  // ── By Project Type CSV ───────────────────────────────────────────
  const typeRows = [['Project Type', 'N Cases', 'Accuracy', 'Avg Error %']];
  for (const [type, d] of Object.entries(agg.by_project_type || {})) {
    typeRows.push([type, d.n_cases, d.accuracy, d.avg_error_pct]);
  }
  const typeFile = path.join(OUTPUT_DIR, 'by_project_type.csv');
  fs.writeFileSync(typeFile, '\uFEFF' + toCSV(typeRows));
  console.log(`   ✅ By type: ${typeFile}`);

  // ── By Metric CSV ─────────────────────────────────────────────────
  const metricRows = [['Metric', 'Accuracy', 'Avg Error %']];
  for (const [metric, d] of Object.entries(agg.by_metric || {})) {
    metricRows.push([metric, d.accuracy, d.avg_error_pct]);
  }
  const metricFile = path.join(OUTPUT_DIR, 'by_metric.csv');
  fs.writeFileSync(metricFile, '\uFEFF' + toCSV(metricRows));
  console.log(`   ✅ By metric: ${metricFile}`);

  // ── By Scenario CSV ───────────────────────────────────────────────
  const scenarioRows = [['Scenario', 'Avg Error %']];
  for (const [s, d] of Object.entries(agg.by_scenario || {})) {
    scenarioRows.push([s, d.avg_error_pct]);
  }
  const scenarioFile = path.join(OUTPUT_DIR, 'by_scenario.csv');
  fs.writeFileSync(scenarioFile, '\uFEFF' + toCSV(scenarioRows));
  console.log(`   ✅ By scenario: ${scenarioFile}`);

  console.log(`\n   All CSV files written to: ${OUTPUT_DIR}\n`);
}

main();
