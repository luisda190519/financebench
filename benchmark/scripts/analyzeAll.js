#!/usr/bin/env node
/**
 * analyzeAll.js — Comprehensive benchmark analysis pipeline
 *
 * Tasks 77 + 78: Load 9000 result files, recalculate oracle values,
 * compare LLM outputs vs oracle, and compute all metrics.
 *
 * Usage:
 *   node benchmark/scripts/analyzeAll.js
 *
 * Output:
 *   paper/benchmark-docs/analysis/reports/validation_report.json
 *   paper/benchmark-docs/analysis/reports/metrics_full.json
 *   paper/benchmark-docs/analysis/reports/metrics_summary.json
 *   paper/benchmark-docs/analysis/reports/error_examples.json
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ─── Paths ───────────────────────────────────────────────────────
const ROOT        = path.resolve(__dirname, '..', '..');
const RESULTS_DIR = path.join(__dirname, '..', 'prompts', 'results');
const DATASET_DIR = path.join(__dirname, '..', 'dataset', 'cases');
const REPORTS_DIR = path.join(ROOT, 'paper', 'benchmark-docs', 'analysis', 'reports');

const MODELS = [
  'claude-haiku-4', 'claude-opus-4.6', 'claude-sonnet-4.6',
  'deepseek-chat', 'gemini-3-flash', 'gemini-3.1-pro',
  'gpt-5.3', 'gpt-5.4', 'grok-code'
];

const MODEL_DISPLAY_NAMES = {
  'claude-haiku-4':    'Claude Haiku 4',
  'claude-opus-4.6':   'Claude Opus 4.6',
  'claude-sonnet-4.6': 'Claude Sonnet 4.6',
  'deepseek-chat':     'DeepSeek Chat',
  'gemini-3-flash':    'Gemini 3 Flash',
  'gemini-3.1-pro':    'Gemini 3.1 Pro',
  'gpt-5.3':           'GPT-5.3',
  'gpt-5.4':           'GPT-5.4',
  'grok-code':         'Grok Code'
};

const MODEL_GROUP = {
  'claude-haiku-4':    'proprietary',
  'claude-opus-4.6':   'proprietary',
  'claude-sonnet-4.6': 'proprietary',
  'deepseek-chat':     'opensource',
  'gemini-3-flash':    'proprietary',
  'gemini-3.1-pro':    'proprietary',
  'gpt-5.3':           'proprietary',
  'gpt-5.4':           'proprietary',
  'grok-code':         'opensource'
};

const SCENARIOS      = ['optimista', 'normal', 'pesimista', 'controlado'];
const SUMMARY_FIELDS = ['npv', 'irr', 'paybackPeriod', 'breakEvenPoint'];
const ANNUAL_FIELDS  = [
  'revenue', 'totalCOGS', 'grossProfit', 'fixedExpenses', 'variableExpenses',
  'totalExpenses', 'ebitda', 'depreciation', 'operationalProfit',
  'interestExpense', 'taxes', 'netProfit', 'unleveredCashFlow', 'leveredCashFlow'
];

// ═══════════════════════════════════════════════════════════════════
// ORACLE ENGINE (exact copy from generateResults.js)
// ═══════════════════════════════════════════════════════════════════

function calcNPV(discountRate, cashFlows) {
  let result = 0;
  for (let i = 0; i < cashFlows.length; i++) {
    result += cashFlows[i] / Math.pow(1 + discountRate, i);
  }
  return result;
}

function calcIRR(cashFlows) {
  let rate = 0.1;
  const maxIterations = 100, tolerance = 1e-6;

  for (let i = 0; i < maxIterations; i++) {
    let npvVal = 0, derivative = 0;
    for (let j = 0; j < cashFlows.length; j++) {
      const cf = parseFloat(cashFlows[j]) || 0;
      const denom = Math.pow(1 + rate, j);
      npvVal += cf / denom;
      if (j > 0) derivative -= j * cf / (denom * (1 + rate));
    }
    if (Math.abs(npvVal) < tolerance) return Math.round(rate * 10000) / 100;
    if (Math.abs(derivative) < tolerance) break;
    const newRate = rate - npvVal / derivative;
    if (Math.abs(newRate - rate) < tolerance) return Math.round(newRate * 10000) / 100;
    rate = Math.max(-0.99, Math.min(100, newRate));
  }
  return calcIRRBisection(cashFlows);
}

function calcIRRBisection(cashFlows) {
  let lo = -0.99, hi = 100;
  const maxIter = 100, tol = 1e-6;
  const npvAt = r => cashFlows.reduce((s, cf, i) => s + cf / Math.pow(1 + r, i), 0);

  for (let i = 0; i < maxIter; i++) {
    const mid = (lo + hi) / 2;
    const npvMid = npvAt(mid);
    if (Math.abs(npvMid) < tol || (hi - lo) / 2 < tol) return Math.round(mid * 10000) / 100;
    if (npvAt(lo) * npvMid < 0) hi = mid;
    else lo = mid;
  }
  return null;
}

function calculateOracle(inputs) {
  const projectLife   = parseInt(inputs.general.projectLife) || 5;
  const taxRate       = (parseFloat(inputs.general.taxRate) || 30) / 100;
  const discountRate  = (parseFloat(inputs.general.discountRate) || 10) / 100;

  // Initial Investment
  const inv = inputs.investmentAssets || {};
  const fixedAssetsTotal   = (inv.fixedAssets || []).reduce((s, a) => s + (parseFloat(a.value) || 0), 0);
  const customFieldsTotal  = (inv.customFields || []).reduce((s, f) => s + (parseFloat(f.value) || 0), 0);
  const initialInvestment  =
    (parseFloat(inv.civilWorks) || 0) + (parseFloat(inv.laborCost) || 0) +
    (parseFloat(inv.materials) || 0)  + (parseFloat(inv.licenses) || 0) +
    (parseFloat(inv.furniture) || 0)  + (parseFloat(inv.cash) || 0) +
    (parseFloat(inv.bank) || 0)       + (parseFloat(inv.inventory) || 0) +
    fixedAssetsTotal + customFieldsTotal;

  // Financing
  const financing = inputs.financing || {};
  const partnersTotal      = (financing.partners || []).reduce((s, p) => s + (parseFloat(p.contribution) || 0), 0);
  const customSourcesTotal = (financing.customSources || []).reduce((s, src) => s + (parseFloat(src.amount) || 0), 0);
  const externalLoan       = Math.max(0, initialInvestment - partnersTotal - customSourcesTotal);

  // Loan amortization
  const interestByYear  = {};
  const principalByYear = {};
  for (let y = 0; y < projectLife; y++) { interestByYear[y] = 0; principalByYear[y] = 0; }

  const amortize = (principal, annualRate, termMonths) => {
    if (principal <= 0 || annualRate <= 0 || termMonths <= 0) return;
    const monthlyRate = annualRate / 100 / 12;
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
    let balance = principal;
    for (let m = 0; m < termMonths && balance > 0; m++) {
      const yr = Math.floor(m / 12);
      if (yr >= projectLife) break;
      const intPmt  = balance * monthlyRate;
      const prinPmt = Math.min(monthlyPayment - intPmt, balance);
      interestByYear[yr]  += intPmt;
      principalByYear[yr] += prinPmt;
      balance -= prinPmt;
    }
  };

  amortize(externalLoan, parseFloat(financing.interestRate) || 0, parseInt(financing.loanTermMonths) || 0);
  (financing.customSources || []).filter(s => s.type === 'debt').forEach(s =>
    amortize(parseFloat(s.amount) || 0, parseFloat(s.interestRate) || 0, parseInt(s.termMonths) || 0)
  );

  // Depreciation
  const depreciationByYear = {};
  for (let y = 0; y < projectLife; y++) depreciationByYear[y] = 0;
  (inv.fixedAssets || []).forEach(asset => {
    const val = parseFloat(asset.value) || 0, life = Math.max(1, parseInt(asset.usefulLife) || 1);
    if (val > 0) { const annual = val / life; for (let y = 0; y < Math.min(life, projectLife); y++) depreciationByYear[y] += annual; }
  });
  (inv.customFields || []).forEach(field => {
    if (field.isDepreciable) {
      const val = parseFloat(field.value) || 0, life = Math.max(1, parseInt(field.usefulLife) || 5);
      if (val > 0) { const annual = val / life; for (let y = 0; y < Math.min(life, projectLife); y++) depreciationByYear[y] += annual; }
    }
  });

  // Expenses
  const expensesByYear = {};
  for (let y = 0; y < projectLife; y++) expensesByYear[y] = { fixed: 0, variable: 0 };

  const getAnnualAmount = (expense, yearIndex) => {
    const base = (expense.unitCost > 0 && expense.quantity > 0)
      ? (parseFloat(expense.unitCost) || 0) * (parseFloat(expense.quantity) || 0)
      : (parseFloat(expense.amount) || 0);
    if (base <= 0) return 0;
    const freq = expense.frequency || 'monthly';
    if (freq === 'one-time') return yearIndex === 0 ? base : 0;
    let annualBase;
    switch (freq) {
      case 'monthly':   annualBase = base * 12; break;
      case 'quarterly': annualBase = base * 4; break;
      case 'annual':    annualBase = base; break;
      default:          annualBase = base * 12;
    }
    const gr = (parseFloat(expense.growthRate) || 0) / 100;
    return annualBase * Math.pow(1 + gr, yearIndex);
  };

  if (inputs.expenses?.items) {
    inputs.expenses.items.forEach(expense => {
      for (let y = 0; y < projectLife; y++) {
        const amt = getAnnualAmount(expense, y);
        if (amt > 0) {
          if (expense.type === 'fijo') expensesByYear[y].fixed += amt;
          else expensesByYear[y].variable += amt;
        }
      }
    });
  }

  // Scenario calculations
  const globalPeriodsPerYear = parseInt(inputs.income?.periodsPerYear) || 12;
  const scenarios = {};

  SCENARIOS.forEach(scenarioName => {
    const annualData = [];
    let cumulativeCF = -initialInvestment;
    let paybackPeriodResult = null;
    const cashFlows = [-initialInvestment];
    let taxLossCarryforward = 0;
    let breakEvenPoint = null, breakEvenType = 'none';

    for (let year = 1; year <= projectLife; year++) {
      const yearIndex = year - 1;
      let revenue = 0, totalCOGS = 0;

      (inputs.income?.items || []).forEach(item => {
        const sv = item.scenarios?.[scenarioName] || {};
        const sellingPrice = parseFloat(sv.sellingPrice) || 0;
        const unitCost     = parseFloat(sv.unitCost) || 0;
        const quantity     = parseFloat(sv.quantity) || 0;
        const discount     = Math.min(100, Math.max(0, parseFloat(sv.discount) || 0));
        const effectivePrice = sellingPrice * (1 - discount / 100);
        const itemPeriods  = parseInt(item.periodsPerYear) || globalPeriodsPerYear;
        const growthFactor = Math.pow(1 + (parseFloat(item.growthRate) || 0) / 100, yearIndex);
        const annualQty    = quantity * itemPeriods * growthFactor;
        revenue   += effectivePrice * annualQty;
        totalCOGS += unitCost * annualQty;
      });

      const grossProfit          = revenue - totalCOGS;
      const itemVariableCosts    = expensesByYear[yearIndex]?.variable || 0;
      const totalVariableExpenses = totalCOGS + itemVariableCosts;
      const fixedExpenses        = expensesByYear[yearIndex]?.fixed || 0;
      const totalExpenses        = fixedExpenses + totalVariableExpenses;
      const ebitda               = revenue - totalExpenses;
      const depreciation         = depreciationByYear[yearIndex] || 0;
      const operationalProfit    = ebitda - depreciation;
      const interestExpense      = interestByYear[yearIndex] || 0;
      const ebt                  = operationalProfit - interestExpense;

      let taxableIncome = ebt + taxLossCarryforward;
      let taxes = 0;
      if (taxableIncome > 0) { taxes = taxableIncome * taxRate; taxLossCarryforward = 0; }
      else { taxLossCarryforward = -taxableIncome; }

      const netProfit        = ebt - taxes;
      const unleveredCashFlow = operationalProfit + depreciation - taxes;
      const principalPayment = principalByYear[yearIndex] || 0;
      const leveredCashFlow  = netProfit + depreciation - principalPayment;

      const r2 = v => Math.round(v * 100) / 100;
      annualData.push({
        year, revenue: r2(revenue), totalCOGS: r2(totalCOGS), grossProfit: r2(grossProfit),
        fixedExpenses: r2(fixedExpenses), variableExpenses: r2(totalVariableExpenses),
        totalExpenses: r2(totalExpenses), ebitda: r2(ebitda), depreciation: r2(depreciation),
        operationalProfit: r2(operationalProfit), interestExpense: r2(interestExpense),
        taxes: r2(taxes), netProfit: r2(netProfit), unleveredCashFlow: r2(unleveredCashFlow),
        leveredCashFlow: r2(leveredCashFlow)
      });

      const prevCum = cumulativeCF;
      cumulativeCF += leveredCashFlow;
      cashFlows.push(leveredCashFlow);

      if (paybackPeriodResult === null && cumulativeCF >= 0 && prevCum < 0) {
        paybackPeriodResult = Math.abs(leveredCashFlow) > 0.01
          ? (year - 1) + Math.abs(prevCum) / leveredCashFlow
          : year;
      }
    }

    // Break-even
    if (breakEvenType === 'none' && annualData.length > 0) {
      const y1 = annualData[0];
      const rev1 = y1.revenue || 0, var1 = y1.variableExpenses || 0;
      const fixedBase = (y1.fixedExpenses || 0) + (y1.depreciation || 0) + (y1.interestExpense || 0);
      if (rev1 > 0 && var1 < rev1 && fixedBase > 0) {
        const varRatio = var1 / rev1;
        const beRev = fixedBase / (1 - varRatio);
        if (isFinite(beRev) && beRev > 0) { breakEvenPoint = Math.round(beRev * 100) / 100; breakEvenType = 'revenue'; }
      }
    }

    // NPV (unlevered)
    const unleveredCFs = [-initialInvestment, ...annualData.map(d => d.unleveredCashFlow)];
    const npvResult = calcNPV(discountRate, unleveredCFs);

    // IRR (levered)
    let irrResult = null;
    if (cashFlows[0] < 0 && cashFlows.slice(1).some(cf => cf > 0)) {
      irrResult = calcIRR(cashFlows);
      if (irrResult !== null && (irrResult < -99 || irrResult > 10000)) irrResult = null;
    }

    scenarios[scenarioName] = {
      npv: Math.round(npvResult * 100) / 100,
      irr: irrResult,
      paybackPeriod: paybackPeriodResult !== null ? Math.round(paybackPeriodResult * 100) / 100 : null,
      breakEvenPoint: breakEvenPoint !== null ? breakEvenPoint : 0,
      annualData
    };
  });

  return scenarios;
}

// ═══════════════════════════════════════════════════════════════════
// TASK 77: DATA LOADING & VALIDATION
// ═══════════════════════════════════════════════════════════════════

function loadAllData() {
  console.log('\n' + '═'.repeat(70));
  console.log(' TASK 77: DATA LOADING & VALIDATION');
  console.log('═'.repeat(70));

  const validation = { models: {}, errors: [], totalFiles: 0, totalValid: 0, totalMalformed: 0, totalMissing: 0 };

  for (const model of MODELS) {
    const modelDir = path.join(RESULTS_DIR, model);
    const modelValidation = { totalFiles: 0, validFiles: 0, malformed: [], missing: [], cases: {} };

    if (!fs.existsSync(modelDir)) {
      console.error(`  MISSING model directory: ${model}`);
      validation.errors.push({ model, type: 'missing_dir' });
      validation.models[model] = modelValidation;
      continue;
    }

    const files = fs.readdirSync(modelDir).filter(f => f.endsWith('.json')).sort();
    modelValidation.totalFiles = files.length;
    validation.totalFiles += files.length;

    // Check for missing case IDs
    const caseIdsFound = new Set();
    for (const file of files) {
      const match = file.match(/^(case_\d{4})/);
      if (match) caseIdsFound.add(match[1]);
    }
    for (let i = 1; i <= 1000; i++) {
      const caseId = `case_${String(i).padStart(4, '0')}`;
      if (!caseIdsFound.has(caseId)) {
        modelValidation.missing.push(caseId);
        validation.totalMissing++;
      }
    }

    // Parse each file
    for (const file of files) {
      try {
        let raw = fs.readFileSync(path.join(modelDir, file), 'utf-8');
        // Strip UTF-8 BOM and replace JavaScript literals invalid in JSON
        raw = raw.replace(/^\uFEFF/, '');
        raw = raw.replace(/\bNaN\b/g, 'null').replace(/\bInfinity\b/g, 'null').replace(/\b-Infinity\b/g, 'null');
        const data = JSON.parse(raw);

        // Validate structure
        if (!data.meta?.caseId || !data.inputs || !data.analysis) {
          throw new Error('Missing required top-level keys (meta/inputs/analysis)');
        }
        if (!data.analysis.scenarios) {
          throw new Error('Missing analysis.scenarios');
        }
        for (const s of SCENARIOS) {
          if (!data.analysis.scenarios[s]) throw new Error(`Missing scenario: ${s}`);
          const sc = data.analysis.scenarios[s];
          if (sc.npv === undefined || !Array.isArray(sc.annualData)) {
            throw new Error(`Invalid scenario structure: ${s}`);
          }
        }

        modelValidation.cases[data.meta.caseId] = data;
        modelValidation.validFiles++;
        validation.totalValid++;
      } catch (err) {
        modelValidation.malformed.push({ file, error: err.message });
        validation.totalMalformed++;
        validation.errors.push({ model, file, error: err.message });
      }
    }

    validation.models[model] = modelValidation;
    const status = modelValidation.malformed.length === 0 && modelValidation.missing.length === 0 ? 'OK' : 'ISSUES';
    console.log(`  ${model.padEnd(22)} ${String(modelValidation.validFiles).padStart(4)}/${String(modelValidation.totalFiles).padStart(4)} valid  |  ${modelValidation.missing.length} missing  |  ${modelValidation.malformed.length} malformed  [${status}]`);
  }

  console.log(`\n  TOTAL: ${validation.totalValid}/${validation.totalFiles} valid files across ${MODELS.length} models`);
  if (validation.totalMissing > 0) console.log(`  WARNING: ${validation.totalMissing} missing case files`);
  if (validation.totalMalformed > 0) console.log(`  WARNING: ${validation.totalMalformed} malformed files`);

  return validation;
}

// ═══════════════════════════════════════════════════════════════════
// TASK 78: COMPARISON & METRICS
// ═══════════════════════════════════════════════════════════════════

function compareField(oracleVal, llmVal) {
  // Handle null/undefined
  const oIsNull = oracleVal === null || oracleVal === undefined;
  const lIsNull = llmVal === null || llmVal === undefined;

  if (oIsNull && lIsNull) return { match: true, absError: 0, pctError: 0, errorType: 'none' };
  if (oIsNull !== lIsNull) return { match: false, absError: null, pctError: null, errorType: 'null_mismatch' };

  const o = parseFloat(oracleVal) || 0;
  const l = parseFloat(llmVal) || 0;
  const absError = Math.abs(l - o);
  const pctError = Math.abs(o) > 0.01 ? (absError / Math.abs(o)) * 100 : (absError < 0.01 ? 0 : 100);

  const match = absError < 0.01;

  let errorType = 'none';
  if (!match) {
    if (pctError > 100) errorType = 'hallucination';
    else if (pctError > 20) errorType = 'conceptual';
    else errorType = 'arithmetic';
  }

  return { match, absError, pctError, errorType };
}

function analyzeAllModels(validation) {
  console.log('\n' + '═'.repeat(70));
  console.log(' TASK 78: COMPARISON & METRICS CALCULATION');
  console.log('═'.repeat(70));

  const allMetrics = {};       // model -> full metrics
  const perCaseResults = {};   // caseId -> { model -> accuracy }
  const errorExamples = {};    // errorType -> [examples]

  for (const model of MODELS) {
    const mv = validation.models[model];
    if (!mv || Object.keys(mv.cases).length === 0) {
      console.log(`  Skipping ${model} (no valid cases)`);
      continue;
    }

    const metrics = {
      displayName: MODEL_DISPLAY_NAMES[model],
      group: MODEL_GROUP[model],
      totalCases: 0,
      overall: { totalFields: 0, exactMatches: 0, closeMatches: 0, totalAbsError: 0, totalPctError: 0, validErrors: 0, errors: [] },
      byScenario: {},
      byMetric: {},
      byProjectType: {},
      byDifficulty: {},
      viability: { tp: 0, fp: 0, fn: 0, tn: 0 },
      errorTypes: { arithmetic: 0, conceptual: 0, hallucination: 0, null_mismatch: 0, format: 0 },
      perCaseAccuracy: []   // for statistical tests
    };

    for (const s of SCENARIOS) metrics.byScenario[s] = { totalFields: 0, matches: 0, totalPctError: 0, validErrors: 0 };

    const caseIds = Object.keys(mv.cases).sort();
    let processed = 0;

    for (const caseId of caseIds) {
      const data = mv.cases[caseId];
      const inputs = data.inputs;
      const llmAnalysis = data.analysis;
      const projectType = data.meta.projectType;
      const difficulty  = data.meta.difficulty;

      // Compute oracle
      let oracle;
      try {
        oracle = calculateOracle(inputs);
      } catch (err) {
        metrics.overall.errors.push({ caseId, error: `Oracle failed: ${err.message}` });
        continue;
      }

      metrics.totalCases++;
      let caseMatches = 0, caseFields = 0;

      // Init byProjectType and byDifficulty
      if (!metrics.byProjectType[projectType]) metrics.byProjectType[projectType] = { totalFields: 0, matches: 0, totalPctError: 0, validErrors: 0, cases: 0 };
      if (!metrics.byDifficulty[difficulty])   metrics.byDifficulty[difficulty]   = { totalFields: 0, matches: 0, totalPctError: 0, validErrors: 0, cases: 0 };
      metrics.byProjectType[projectType].cases++;
      metrics.byDifficulty[difficulty].cases++;

      for (const scenario of SCENARIOS) {
        const oracleS = oracle[scenario];
        const llmS    = llmAnalysis.scenarios?.[scenario];
        if (!oracleS || !llmS) continue;

        // Compare summary fields
        for (const field of SUMMARY_FIELDS) {
          if (!metrics.byMetric[field]) metrics.byMetric[field] = { totalFields: 0, matches: 0, totalAbsError: 0, totalPctError: 0, validErrors: 0 };

          const cmp = compareField(oracleS[field], llmS[field]);
          metrics.overall.totalFields++;
          metrics.byScenario[scenario].totalFields++;
          metrics.byMetric[field].totalFields++;
          metrics.byProjectType[projectType].totalFields++;
          metrics.byDifficulty[difficulty].totalFields++;
          caseFields++;

          if (cmp.match) {
            metrics.overall.exactMatches++;
            metrics.byScenario[scenario].matches++;
            metrics.byMetric[field].matches++;
            metrics.byProjectType[projectType].matches++;
            metrics.byDifficulty[difficulty].matches++;
            caseMatches++;
          } else {
            metrics.overall.closeMatches += (cmp.pctError !== null && cmp.pctError < 1) ? 1 : 0;
          }

          if (cmp.pctError !== null && isFinite(cmp.pctError)) {
            metrics.overall.totalPctError += cmp.pctError;
            metrics.overall.validErrors++;
            metrics.byScenario[scenario].totalPctError += cmp.pctError;
            metrics.byScenario[scenario].validErrors++;
            metrics.byMetric[field].totalPctError += cmp.pctError;
            metrics.byMetric[field].validErrors++;
            metrics.byProjectType[projectType].totalPctError += cmp.pctError;
            metrics.byProjectType[projectType].validErrors++;
            metrics.byDifficulty[difficulty].totalPctError += cmp.pctError;
            metrics.byDifficulty[difficulty].validErrors++;
            if (cmp.absError !== null) {
              metrics.overall.totalAbsError += cmp.absError;
              metrics.byMetric[field].totalAbsError += cmp.absError;
            }
          }

          if (cmp.errorType !== 'none') {
            metrics.errorTypes[cmp.errorType] = (metrics.errorTypes[cmp.errorType] || 0) + 1;

            // Collect error examples (max 5 per type per model)
            const eKey = `${model}_${cmp.errorType}`;
            if (!errorExamples[eKey]) errorExamples[eKey] = [];
            if (errorExamples[eKey].length < 5) {
              errorExamples[eKey].push({
                model, caseId, scenario, field,
                oracle: oracleS[field], llm: llmS[field],
                pctError: cmp.pctError, errorType: cmp.errorType
              });
            }
          }

          // Viability (NPV-based)
          if (field === 'npv') {
            const oracleViable = (oracleS.npv || 0) > 0;
            const llmViable    = (llmS.npv || 0) > 0;
            if (oracleViable && llmViable)       metrics.viability.tp++;
            else if (!oracleViable && llmViable)  metrics.viability.fp++;
            else if (oracleViable && !llmViable)  metrics.viability.fn++;
            else                                  metrics.viability.tn++;
          }
        }

        // Compare annual data
        const oYears = oracleS.annualData || [];
        const lYears = llmS.annualData || [];
        const maxYears = Math.min(oYears.length, lYears.length);

        for (let yi = 0; yi < maxYears; yi++) {
          for (const field of ANNUAL_FIELDS) {
            if (!metrics.byMetric[field]) metrics.byMetric[field] = { totalFields: 0, matches: 0, totalAbsError: 0, totalPctError: 0, validErrors: 0 };

            const cmp = compareField(oYears[yi][field], lYears[yi][field]);
            metrics.overall.totalFields++;
            metrics.byScenario[scenario].totalFields++;
            metrics.byMetric[field].totalFields++;
            metrics.byProjectType[projectType].totalFields++;
            metrics.byDifficulty[difficulty].totalFields++;
            caseFields++;

            if (cmp.match) {
              metrics.overall.exactMatches++;
              metrics.byScenario[scenario].matches++;
              metrics.byMetric[field].matches++;
              metrics.byProjectType[projectType].matches++;
              metrics.byDifficulty[difficulty].matches++;
              caseMatches++;
            }

            if (cmp.pctError !== null && isFinite(cmp.pctError)) {
              metrics.overall.totalPctError += cmp.pctError;
              metrics.overall.validErrors++;
              metrics.byScenario[scenario].totalPctError += cmp.pctError;
              metrics.byScenario[scenario].validErrors++;
              metrics.byMetric[field].totalPctError += cmp.pctError;
              metrics.byMetric[field].validErrors++;
              metrics.byProjectType[projectType].totalPctError += cmp.pctError;
              metrics.byProjectType[projectType].validErrors++;
              metrics.byDifficulty[difficulty].totalPctError += cmp.pctError;
              metrics.byDifficulty[difficulty].validErrors++;
              if (cmp.absError !== null) {
                metrics.byMetric[field].totalAbsError += cmp.absError;
              }
            }

            if (cmp.errorType !== 'none') {
              metrics.errorTypes[cmp.errorType] = (metrics.errorTypes[cmp.errorType] || 0) + 1;
            }
          }
        }
      }

      // Per-case accuracy
      const caseAcc = caseFields > 0 ? caseMatches / caseFields : 0;
      metrics.perCaseAccuracy.push({ caseId, projectType, difficulty, accuracy: caseAcc, matches: caseMatches, fields: caseFields });

      if (!perCaseResults[caseId]) perCaseResults[caseId] = {};
      perCaseResults[caseId][model] = caseAcc;

      processed++;
      if (processed % 200 === 0) process.stdout.write(`  ${model}: ${processed}/${caseIds.length} cases...\r`);
    }

    // Compute derived metrics
    const ov = metrics.overall;
    ov.accuracy  = ov.totalFields > 0 ? ov.exactMatches / ov.totalFields : 0;
    ov.closeRate = ov.totalFields > 0 ? (ov.exactMatches + ov.closeMatches) / ov.totalFields : 0;
    ov.mape      = ov.validErrors > 0 ? ov.totalPctError / ov.validErrors : 0;
    ov.mae       = ov.validErrors > 0 ? ov.totalAbsError / ov.validErrors : 0;

    for (const s of SCENARIOS) {
      const bs = metrics.byScenario[s];
      bs.accuracy = bs.totalFields > 0 ? bs.matches / bs.totalFields : 0;
      bs.mape     = bs.validErrors > 0 ? bs.totalPctError / bs.validErrors : 0;
    }
    for (const [, bm] of Object.entries(metrics.byMetric)) {
      bm.accuracy = bm.totalFields > 0 ? bm.matches / bm.totalFields : 0;
      bm.mape     = bm.validErrors > 0 ? bm.totalPctError / bm.validErrors : 0;
      bm.mae      = bm.validErrors > 0 ? bm.totalAbsError / bm.validErrors : 0;
    }
    for (const [, bt] of Object.entries(metrics.byProjectType)) {
      bt.accuracy = bt.totalFields > 0 ? bt.matches / bt.totalFields : 0;
      bt.mape     = bt.validErrors > 0 ? bt.totalPctError / bt.validErrors : 0;
    }
    for (const [, bd] of Object.entries(metrics.byDifficulty)) {
      bd.accuracy = bd.totalFields > 0 ? bd.matches / bd.totalFields : 0;
      bd.mape     = bd.validErrors > 0 ? bd.totalPctError / bd.validErrors : 0;
    }

    // Viability F1
    const v = metrics.viability;
    v.precision = (v.tp + v.fp) > 0 ? v.tp / (v.tp + v.fp) : 0;
    v.recall    = (v.tp + v.fn) > 0 ? v.tp / (v.tp + v.fn) : 0;
    v.f1        = (v.precision + v.recall) > 0 ? 2 * v.precision * v.recall / (v.precision + v.recall) : 0;

    allMetrics[model] = metrics;

    const pct = (ov.accuracy * 100).toFixed(2);
    const mape = ov.mape.toFixed(2);
    console.log(`  ${MODEL_DISPLAY_NAMES[model].padEnd(22)} Accuracy: ${pct}%  |  MAPE: ${mape}%  |  Cases: ${metrics.totalCases}  |  F1: ${v.f1.toFixed(3)}`);
  }

  // ── Rankings ──
  const rankings = {};
  const sorted = Object.entries(allMetrics)
    .map(([model, m]) => ({ model, displayName: m.displayName, accuracy: m.overall.accuracy, mape: m.overall.mape, f1: m.viability.f1 }))
    .sort((a, b) => b.accuracy - a.accuracy);

  rankings.overall = sorted.map((r, i) => ({ rank: i + 1, ...r }));

  rankings.byMetric = {};
  const allMetricNames = [...new Set([...SUMMARY_FIELDS, ...ANNUAL_FIELDS])];
  for (const metric of allMetricNames) {
    const metricRanking = Object.entries(allMetrics)
      .filter(([, m]) => m.byMetric[metric])
      .map(([model, m]) => ({ model, displayName: m.displayName, accuracy: m.byMetric[metric].accuracy, mape: m.byMetric[metric].mape }))
      .sort((a, b) => b.accuracy - a.accuracy);
    rankings.byMetric[metric] = metricRanking;
  }

  // ── Per-case difficulty ──
  const caseDifficulty = [];
  for (const [caseId, modelResults] of Object.entries(perCaseResults)) {
    const accs = Object.values(modelResults);
    const avgAcc = accs.reduce((s, a) => s + a, 0) / accs.length;
    const modelsCorrect = accs.filter(a => a > 0.99).length;
    caseDifficulty.push({ caseId, avgAccuracy: avgAcc, modelsCorrect, totalModels: accs.length });
  }
  caseDifficulty.sort((a, b) => a.avgAccuracy - b.avgAccuracy);

  // ── Group comparison ──
  const propAccuracies = [], osAccuracies = [];
  for (const [model, m] of Object.entries(allMetrics)) {
    if (MODEL_GROUP[model] === 'proprietary') propAccuracies.push(m.overall.accuracy);
    else osAccuracies.push(m.overall.accuracy);
  }
  const propAvg = propAccuracies.reduce((s, a) => s + a, 0) / propAccuracies.length;
  const osAvg   = osAccuracies.reduce((s, a) => s + a, 0) / osAccuracies.length;

  console.log(`\n  RANKINGS:`);
  rankings.overall.forEach(r => console.log(`    #${r.rank} ${r.displayName.padEnd(22)} ${(r.accuracy * 100).toFixed(2)}%`));
  console.log(`\n  Proprietary avg: ${(propAvg * 100).toFixed(2)}%  |  Open-source avg: ${(osAvg * 100).toFixed(2)}%  |  Gap: ${((propAvg - osAvg) * 100).toFixed(2)} pp`);

  return { allMetrics, rankings, perCaseResults, caseDifficulty, errorExamples, groupComparison: { proprietary: propAvg, openSource: osAvg, gap: propAvg - osAvg } };
}

// ═══════════════════════════════════════════════════════════════════
// SAVE REPORTS
// ═══════════════════════════════════════════════════════════════════

function saveReports(validation, analysis) {
  console.log('\n' + '═'.repeat(70));
  console.log(' SAVING REPORTS');
  console.log('═'.repeat(70));

  fs.mkdirSync(REPORTS_DIR, { recursive: true });

  // Validation report
  const valReport = {
    generatedAt: new Date().toISOString(),
    totalFiles: validation.totalFiles,
    totalValid: validation.totalValid,
    totalMalformed: validation.totalMalformed,
    totalMissing: validation.totalMissing,
    models: Object.fromEntries(
      Object.entries(validation.models).map(([model, mv]) => [model, {
        totalFiles: mv.totalFiles,
        validFiles: mv.validFiles,
        malformed: mv.malformed,
        missing: mv.missing
      }])
    ),
    errors: validation.errors
  };
  fs.writeFileSync(path.join(REPORTS_DIR, 'validation_report.json'), JSON.stringify(valReport, null, 2));
  console.log('  Saved validation_report.json');

  // Full metrics (without raw perCaseAccuracy arrays — too large)
  const metricsOutput = {};
  for (const [model, m] of Object.entries(analysis.allMetrics)) {
    metricsOutput[model] = {
      displayName: m.displayName,
      group: m.group,
      totalCases: m.totalCases,
      overall: {
        accuracy: r4(m.overall.accuracy),
        closeRate: r4(m.overall.closeRate),
        mape: r4(m.overall.mape),
        mae: r2(m.overall.mae),
        totalFields: m.overall.totalFields,
        exactMatches: m.overall.exactMatches
      },
      byScenario: Object.fromEntries(SCENARIOS.map(s => [s, {
        accuracy: r4(m.byScenario[s].accuracy),
        mape: r4(m.byScenario[s].mape),
        totalFields: m.byScenario[s].totalFields,
        matches: m.byScenario[s].matches
      }])),
      byMetric: Object.fromEntries(Object.entries(m.byMetric).map(([k, v]) => [k, {
        accuracy: r4(v.accuracy), mape: r4(v.mape), mae: r2(v.mae),
        totalFields: v.totalFields, matches: v.matches
      }])),
      byProjectType: Object.fromEntries(Object.entries(m.byProjectType).map(([k, v]) => [k, {
        accuracy: r4(v.accuracy), mape: r4(v.mape), cases: v.cases
      }])),
      byDifficulty: Object.fromEntries(Object.entries(m.byDifficulty).map(([k, v]) => [k, {
        accuracy: r4(v.accuracy), mape: r4(v.mape), cases: v.cases
      }])),
      viability: {
        tp: m.viability.tp, fp: m.viability.fp, fn: m.viability.fn, tn: m.viability.tn,
        precision: r4(m.viability.precision), recall: r4(m.viability.recall), f1: r4(m.viability.f1)
      },
      errorTypes: m.errorTypes
    };
  }

  const fullReport = {
    generatedAt: new Date().toISOString(),
    benchmarkInfo: { totalCases: 1000, models: MODELS.length, scenarios: 4, projectTypes: 10, difficultyLevels: 3 },
    perModel: metricsOutput,
    rankings: analysis.rankings,
    groupComparison: {
      proprietary: r4(analysis.groupComparison.proprietary),
      openSource: r4(analysis.groupComparison.openSource),
      gap: r4(analysis.groupComparison.gap)
    },
    caseDifficulty: {
      hardest10: analysis.caseDifficulty.slice(0, 10),
      easiest10: analysis.caseDifficulty.slice(-10).reverse(),
      universalFailures: analysis.caseDifficulty.filter(c => c.modelsCorrect === 0).length,
      universalSuccesses: analysis.caseDifficulty.filter(c => c.modelsCorrect === c.totalModels).length
    }
  };
  fs.writeFileSync(path.join(REPORTS_DIR, 'metrics_full.json'), JSON.stringify(fullReport, null, 2));
  console.log('  Saved metrics_full.json');

  // Summary (compact)
  const summary = {
    generatedAt: fullReport.generatedAt,
    rankings: analysis.rankings.overall,
    bestOverall: analysis.rankings.overall[0],
    worstOverall: analysis.rankings.overall[analysis.rankings.overall.length - 1],
    proprietaryAvg: r4(analysis.groupComparison.proprietary),
    openSourceAvg: r4(analysis.groupComparison.openSource),
    gap: r4(analysis.groupComparison.gap),
    bestByMetric: Object.fromEntries(
      Object.entries(analysis.rankings.byMetric).map(([metric, ranks]) => [metric, ranks[0] || null])
    )
  };
  fs.writeFileSync(path.join(REPORTS_DIR, 'metrics_summary.json'), JSON.stringify(summary, null, 2));
  console.log('  Saved metrics_summary.json');

  // Error examples
  const errorExamplesFlat = {};
  for (const [key, examples] of Object.entries(analysis.errorExamples)) {
    errorExamplesFlat[key] = examples;
  }
  fs.writeFileSync(path.join(REPORTS_DIR, 'error_examples.json'), JSON.stringify(errorExamplesFlat, null, 2));
  console.log('  Saved error_examples.json');

  // Per-case results (for statistical analysis)
  const perCaseCSV = ['caseId,' + MODELS.join(',')];
  const sortedCaseIds = Object.keys(analysis.perCaseResults).sort();
  for (const caseId of sortedCaseIds) {
    const row = [caseId];
    for (const model of MODELS) {
      row.push(analysis.perCaseResults[caseId]?.[model]?.toFixed(6) || '');
    }
    perCaseCSV.push(row.join(','));
  }
  fs.writeFileSync(path.join(REPORTS_DIR, 'per_case_accuracy.csv'), perCaseCSV.join('\n'));
  console.log('  Saved per_case_accuracy.csv');

  console.log(`\n  All reports saved to: ${REPORTS_DIR}`);
}

function r2(v) { return Math.round(v * 100) / 100; }
function r4(v) { return Math.round(v * 10000) / 10000; }

// ═══════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════

function main() {
  const startTime = Date.now();

  // Task 77: Load & validate
  const validation = loadAllData();

  // Task 78: Compare & compute metrics
  const analysis = analyzeAllModels(validation);

  // Save reports
  saveReports(validation, analysis);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\nDone in ${elapsed}s\n`);
}

main();
