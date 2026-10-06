'use strict';
/**
 * Motor de comparación campo a campo entre el análisis de un JSON (respuesta de un
 * LLM) y el análisis del oráculo (engine/Project.js).
 *
 * Extraído sin cambios de Viabilidad Negocios,
 * Backend/src/controllers/projectController.js (commit 31f24a0, L637-713).
 */

/**
 * Comparison engine: computes field-by-field diff between jsonAnalysis and appAnalysis.
 * Returns { summary, by_section }.
 */
const compareAnalysis = (jsonAnalysis, appAnalysis) => {
  const THRESHOLD_MATCH = 0.01;  // <1% = green
  const THRESHOLD_SMALL = 0.05;  // 1–5% = yellow
  const SCENARIOS = ['optimista', 'normal', 'pesimista', 'controlado'];
  const SCENARIO_METRICS = ['npv', 'irr', 'paybackPeriod', 'breakEvenPoint'];
  const ANNUAL_METRICS = [
    'revenue', 'totalCOGS', 'grossProfit', 'grossMarginPct',
    'fixedExpenses', 'variableExpenses', 'totalExpenses',
    'ebitda', 'depreciation', 'operationalProfit',
    'interestExpense', 'taxes', 'netProfit', 'unleveredCashFlow', 'leveredCashFlow'
  ];

  const compareValues = (jsonVal, appVal) => {
    if (jsonVal === null || jsonVal === undefined || appVal === null || appVal === undefined) {
      return { json: jsonVal ?? null, app: appVal ?? null, diff: null, diffPercent: null, status: 'N/A' };
    }
    const diff = jsonVal - appVal;
    const diffPercent = appVal !== 0 ? Math.abs(diff / appVal) : (diff !== 0 ? 1 : 0);
    const status = diffPercent <= THRESHOLD_MATCH ? 'match' : diffPercent <= THRESHOLD_SMALL ? 'small' : 'large';
    return { json: jsonVal, app: appVal, diff: parseFloat(diff.toFixed(4)), diffPercent: parseFloat(diffPercent.toFixed(6)), status };
  };

  let totalFields = 0, exactMatches = 0, smallDifferences = 0, largeDifferences = 0;
  let sumDiffPercent = 0, validDiffCount = 0;
  const by_section = {};

  for (const scenario of SCENARIOS) {
    const jsonS = jsonAnalysis?.scenarios?.[scenario] || {};
    const appS  = appAnalysis?.scenarios?.[scenario] || {};
    by_section[scenario] = { metrics: {}, annualData: [] };

    for (const metric of SCENARIO_METRICS) {
      const result = compareValues(jsonS[metric], appS[metric]);
      by_section[scenario].metrics[metric] = result;
      totalFields++;
      if (result.status === 'match') exactMatches++;
      else if (result.status === 'small') smallDifferences++;
      else if (result.status === 'large') largeDifferences++;
      if (result.diffPercent !== null) { sumDiffPercent += result.diffPercent; validDiffCount++; }
    }

    const maxYears = Math.max(jsonS.annualData?.length || 0, appS.annualData?.length || 0);
    for (let y = 0; y < maxYears; y++) {
      const jsonYear = jsonS.annualData?.[y] || {};
      const appYear  = appS.annualData?.[y] || {};
      const yearComp = { year: y + 1, fields: {} };
      for (const metric of ANNUAL_METRICS) {
        const result = compareValues(jsonYear[metric], appYear[metric]);
        yearComp.fields[metric] = result;
        totalFields++;
        if (result.status === 'match') exactMatches++;
        else if (result.status === 'small') smallDifferences++;
        else if (result.status === 'large') largeDifferences++;
        if (result.diffPercent !== null) { sumDiffPercent += result.diffPercent; validDiffCount++; }
      }
      by_section[scenario].annualData.push(yearComp);
    }
  }

  const avgErrorPercent = validDiffCount > 0 ? (sumDiffPercent / validDiffCount) * 100 : 0;
  const summary = {
    totalFields,
    exactMatches,
    smallDifferences,
    largeDifferences,
    notApplicable: totalFields - exactMatches - smallDifferences - largeDifferences,
    avgErrorPercent: parseFloat(avgErrorPercent.toFixed(4)),
    overallAccuracy: totalFields > 0 ? parseFloat((exactMatches / totalFields).toFixed(4)) : 0
  };

  return { summary, by_section };
};


module.exports = { compareAnalysis };
