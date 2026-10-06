'use strict';
/**
 * Aggregate benchmark comparison results from MongoDB.
 *
 * Usage:
 *   node benchmark/scripts/aggregate.js
 *
 * Environment variables:
 *   MONGODB_URI — MongoDB connection string
 *
 * Output:
 *   benchmark/results/aggregate-YYYY-MM-DD.json
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const mongoose = require('mongoose');
const fs       = require('fs');
const path     = require('path');

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/viabilidad';

async function main() {
  console.log('\n🔗 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('   Connected.\n');

  const Project = require('../../engine/Project');

  const projects = await Project.find(
    { 'benchmarkComparison.hasComparison': true },
    'general.projectName general.projectType benchmarkComparison'
  ).lean();

  if (projects.length === 0) {
    console.log('⚠️  No benchmark comparison data found.');
    await mongoose.disconnect();
    return;
  }

  console.log(`Found ${projects.length} projects with comparison data.\n`);

  const SCENARIOS = ['optimista', 'normal', 'pesimista', 'controlado'];
  const METRICS   = ['npv', 'irr', 'paybackPeriod', 'breakEvenPoint'];
  const ANNUAL_METRICS = ['revenue', 'totalCOGS', 'grossProfit', 'ebitda', 'netProfit', 'leveredCashFlow'];

  let totalFields = 0, totalMatches = 0;
  const byType    = {};
  const byMetric  = {};
  const byScenario = {};

  for (const project of projects) {
    const bc   = project.benchmarkComparison;
    const ptype = project.general?.projectType || 'unknown';

    if (!byType[ptype]) byType[ptype] = { n: 0, matches: 0, fields: 0, totalErr: 0 };
    byType[ptype].n++;
    byType[ptype].matches += bc.summary?.exactMatches || 0;
    byType[ptype].fields  += bc.summary?.totalFields  || 0;
    byType[ptype].totalErr += bc.summary?.avgErrorPercent || 0;

    totalFields  += bc.summary?.totalFields  || 0;
    totalMatches += bc.summary?.exactMatches || 0;

    for (const scenario of SCENARIOS) {
      if (!byScenario[scenario]) byScenario[scenario] = { n: 0, totalErr: 0 };
      byScenario[scenario].n++;
      byScenario[scenario].totalErr += bc.summary?.avgErrorPercent || 0;

      const scenarioData = bc.by_section?.[scenario]?.metrics || {};
      for (const metric of METRICS) {
        if (!byMetric[metric]) byMetric[metric] = { total: 0, matches: 0, totalDiff: 0, validDiffs: 0 };
        const m = scenarioData[metric];
        if (m) {
          byMetric[metric].total++;
          if (m.status === 'match') byMetric[metric].matches++;
          if (m.diffPercent !== null && m.diffPercent !== undefined) {
            byMetric[metric].totalDiff += m.diffPercent;
            byMetric[metric].validDiffs++;
          }
        }
      }
    }
  }

  const aggregated = {
    generatedAt:      new Date().toISOString(),
    n_cases:          projects.length,
    overall_accuracy: totalFields > 0 ? parseFloat((totalMatches / totalFields).toFixed(4)) : 0,
    overall_avg_error_percent: projects.length > 0
      ? parseFloat((projects.reduce((s, p) => s + (p.benchmarkComparison?.summary?.avgErrorPercent || 0), 0) / projects.length).toFixed(4))
      : 0,
    by_project_type: Object.fromEntries(
      Object.entries(byType).map(([type, d]) => [type, {
        n_cases:       d.n,
        accuracy:      d.fields > 0 ? parseFloat((d.matches / d.fields).toFixed(4)) : 0,
        avg_error_pct: d.n > 0 ? parseFloat((d.totalErr / d.n).toFixed(4)) : 0
      }])
    ),
    by_metric: Object.fromEntries(
      Object.entries(byMetric).map(([metric, d]) => [metric, {
        accuracy:      d.total > 0 ? parseFloat((d.matches / d.total).toFixed(4)) : 0,
        avg_error_pct: d.validDiffs > 0 ? parseFloat(((d.totalDiff / d.validDiffs) * 100).toFixed(4)) : 0
      }])
    ),
    by_scenario: Object.fromEntries(
      Object.entries(byScenario).map(([s, d]) => [s, {
        avg_error_pct: d.n > 0 ? parseFloat((d.totalErr / d.n).toFixed(4)) : 0
      }])
    )
  };

  const resultsDir = path.join(__dirname, '../results');
  fs.mkdirSync(resultsDir, { recursive: true });
  const outFile = path.join(resultsDir, `aggregate-${new Date().toISOString().split('T')[0]}.json`);
  fs.writeFileSync(outFile, JSON.stringify(aggregated, null, 2));

  console.log('📊 Aggregate Results');
  console.log(`   Cases analyzed:    ${aggregated.n_cases}`);
  console.log(`   Overall accuracy:  ${(aggregated.overall_accuracy * 100).toFixed(1)}%`);
  console.log(`   Avg error:         ${aggregated.overall_avg_error_percent.toFixed(2)}%`);
  console.log(`\n   By project type:`);
  for (const [type, d] of Object.entries(aggregated.by_project_type)) {
    console.log(`     ${type.padEnd(15)}: ${(d.accuracy * 100).toFixed(1)}% accuracy (n=${d.n_cases})`);
  }
  console.log(`\n   Results written to: ${outFile}`);

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
