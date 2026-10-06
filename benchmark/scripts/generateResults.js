#!/usr/bin/env node
/**
 * generateResults.js — Deterministic financial calculator
 *
 * Reads case prompt files, extracts inputs, applies the EXACT same
 * calculation rules as the oracle engine (Project.js calculateMetrics),
 * and writes result JSON files for the deepseek-chat model folder.
 *
 * Usage:
 *   node benchmark/scripts/generateResults.js [--model deepseek-chat] [--overwrite]
 */

const fs = require('fs');
const path = require('path');

// ─── Configuration ───────────────────────────────────────────────
const args = process.argv.slice(2);
const modelFolder = (args.find(a => a.startsWith('--model=')) || '--model=deepseek-chat').split('=')[1];
const overwrite = args.includes('--overwrite');

const CASES_DIR = path.join(__dirname, '..', 'prompts', 'cases');
const RESULTS_DIR = path.join(__dirname, '..', 'prompts', 'results', modelFolder);

// ─── NPV / IRR utilities (replicate the `financial` library + fallbacks) ─────

function calcNPV(discountRate, cashFlows) {
  // cashFlows[0] is year 0 (initial investment, typically negative)
  let result = 0;
  for (let i = 0; i < cashFlows.length; i++) {
    result += cashFlows[i] / Math.pow(1 + discountRate, i);
  }
  return result;
}

function calcIRR(cashFlows) {
  // Newton-Raphson, identical to Project.js calculateIRRCustom
  let rate = 0.1;
  const maxIterations = 100;
  const tolerance = 1e-6;

  for (let i = 0; i < maxIterations; i++) {
    let npvVal = 0;
    let derivative = 0;

    for (let j = 0; j < cashFlows.length; j++) {
      const cf = parseFloat(cashFlows[j]) || 0;
      const denom = Math.pow(1 + rate, j);
      npvVal += cf / denom;
      if (j > 0) {
        derivative -= j * cf / (denom * (1 + rate));
      }
    }

    if (Math.abs(npvVal) < tolerance) {
      return Math.round(rate * 10000) / 100;
    }
    if (Math.abs(derivative) < tolerance) break;

    const newRate = rate - npvVal / derivative;
    if (Math.abs(newRate - rate) < tolerance) {
      return Math.round(newRate * 10000) / 100;
    }
    rate = Math.max(-0.99, Math.min(100, newRate));
  }

  // Bisection fallback
  return calcIRRBisection(cashFlows);
}

function calcIRRBisection(cashFlows) {
  let lo = -0.99, hi = 100;
  const maxIter = 100, tol = 1e-6;

  const npvAt = r => cashFlows.reduce((s, cf, i) => s + cf / Math.pow(1 + r, i), 0);

  for (let i = 0; i < maxIter; i++) {
    const mid = (lo + hi) / 2;
    const npvMid = npvAt(mid);
    if (Math.abs(npvMid) < tol || (hi - lo) / 2 < tol) {
      return Math.round(mid * 10000) / 100;
    }
    if (npvAt(lo) * npvMid < 0) hi = mid;
    else lo = mid;
  }
  return null;
}

// ─── Parse case file ─────────────────────────────────────────────

function parseCaseFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Extract META
  const metaMatch = content.match(/META \(include this exactly as-is.*?\):\s*\n(\{[\s\S]*?\n\})/);
  if (!metaMatch) throw new Error('Cannot find META in ' + filePath);
  const meta = JSON.parse(metaMatch[1]);

  // Extract INPUT DATA
  const inputMatch = content.match(/INPUT DATA \(copy exactly.*?\):\s*\n(\{[\s\S]*?\n\})/);
  if (!inputMatch) throw new Error('Cannot find INPUT DATA in ' + filePath);
  const inputs = JSON.parse(inputMatch[1]);

  return { meta, inputs };
}

// ─── Core calculation engine (mirrors Project.js calculateMetrics exactly) ───

function calculateAnalysis(meta, inputs) {
  const projectLife = parseInt(inputs.general.projectLife) || 5;
  const taxRate = (parseFloat(inputs.general.taxRate) || 30) / 100;
  const discountRate = (parseFloat(inputs.general.discountRate) || 10) / 100;

  // ── Initial Investment ──
  const inv = inputs.investmentAssets || {};
  const fixedAssetsTotal = (inv.fixedAssets || []).reduce((s, a) => s + (parseFloat(a.value) || 0), 0);
  const customFieldsTotal = (inv.customFields || []).reduce((s, f) => s + (parseFloat(f.value) || 0), 0);
  const initialInvestment =
    (parseFloat(inv.civilWorks) || 0) +
    (parseFloat(inv.laborCost) || 0) +
    (parseFloat(inv.materials) || 0) +
    (parseFloat(inv.licenses) || 0) +
    (parseFloat(inv.furniture) || 0) +
    (parseFloat(inv.cash) || 0) +
    (parseFloat(inv.bank) || 0) +
    (parseFloat(inv.inventory) || 0) +
    fixedAssetsTotal +
    customFieldsTotal;

  // ── Financing ──
  const financing = inputs.financing || {};
  const partnersTotal = (financing.partners || []).reduce((s, p) => s + (parseFloat(p.contribution) || 0), 0);
  const customSourcesTotal = (financing.customSources || []).reduce((s, src) => s + (parseFloat(src.amount) || 0), 0);
  const externalLoan = Math.max(0, initialInvestment - partnersTotal - customSourcesTotal);

  // ── Loan amortization ──
  const interestByYear = {};
  const principalByYear = {};
  for (let y = 0; y < projectLife; y++) { interestByYear[y] = 0; principalByYear[y] = 0; }

  const amortize = (principal, annualRate, termMonths) => {
    if (principal <= 0 || annualRate <= 0 || termMonths <= 0) return;
    const monthlyRate = annualRate / 100 / 12;
    const monthlyPayment = principal *
      (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
      (Math.pow(1 + monthlyRate, termMonths) - 1);
    let balance = principal;
    for (let m = 0; m < termMonths && balance > 0; m++) {
      const yr = Math.floor(m / 12);
      if (yr >= projectLife) break;
      const intPmt = balance * monthlyRate;
      const prinPmt = Math.min(monthlyPayment - intPmt, balance);
      interestByYear[yr] += intPmt;
      principalByYear[yr] += prinPmt;
      balance -= prinPmt;
    }
  };

  // Primary external loan
  amortize(externalLoan, parseFloat(financing.interestRate) || 0, parseInt(financing.loanTermMonths) || 0);

  // Custom debt sources
  (financing.customSources || [])
    .filter(s => s.type === 'debt')
    .forEach(s => amortize(
      parseFloat(s.amount) || 0,
      parseFloat(s.interestRate) || 0,
      parseInt(s.termMonths) || 0
    ));

  // ── Depreciation ──
  const depreciationByYear = {};
  for (let y = 0; y < projectLife; y++) depreciationByYear[y] = 0;

  (inv.fixedAssets || []).forEach(asset => {
    const val = parseFloat(asset.value) || 0;
    const life = Math.max(1, parseInt(asset.usefulLife) || 1);
    if (val > 0) {
      const annual = val / life;
      for (let y = 0; y < Math.min(life, projectLife); y++) depreciationByYear[y] += annual;
    }
  });

  (inv.customFields || []).forEach(field => {
    if (field.isDepreciable) {
      const val = parseFloat(field.value) || 0;
      const life = Math.max(1, parseInt(field.usefulLife) || 5);
      if (val > 0) {
        const annual = val / life;
        for (let y = 0; y < Math.min(life, projectLife); y++) depreciationByYear[y] += annual;
      }
    }
  });

  // ── Expenses ──
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

  // ── Scenario calculations ──
  const globalPeriodsPerYear = parseInt(inputs.income?.periodsPerYear) || 12;
  const useItemsSystem = (inputs.income?.items || []).length > 0;
  const scenarioNames = ['optimista', 'normal', 'pesimista', 'controlado'];

  const scenarios = {};

  scenarioNames.forEach(scenarioName => {
    const annualData = [];
    let cumulativeCF = -initialInvestment;
    let paybackPeriodResult = null;
    const cashFlows = [-initialInvestment];
    let taxLossCarryforward = 0;

    let breakEvenPoint = null;
    let breakEvenType = 'none';

    for (let year = 1; year <= projectLife; year++) {
      const yearIndex = year - 1;
      let revenue = 0;
      let totalCOGS = 0;

      if (useItemsSystem) {
        (inputs.income.items || []).forEach(item => {
          const sv = item.scenarios?.[scenarioName] || {};
          const sellingPrice = parseFloat(sv.sellingPrice) || 0;
          const unitCost = parseFloat(sv.unitCost) || 0;
          const quantity = parseFloat(sv.quantity) || 0;
          const discount = Math.min(100, Math.max(0, parseFloat(sv.discount) || 0));
          const effectivePrice = sellingPrice * (1 - discount / 100);
          const itemPeriods = parseInt(item.periodsPerYear) || globalPeriodsPerYear;
          const growthFactor = Math.pow(1 + (parseFloat(item.growthRate) || 0) / 100, yearIndex);
          const annualQty = quantity * itemPeriods * growthFactor;
          revenue += effectivePrice * annualQty;
          totalCOGS += unitCost * annualQty;
        });
      }

      const grossProfit = revenue - totalCOGS;
      const itemVariableCosts = expensesByYear[yearIndex]?.variable || 0;
      const totalVariableExpenses = totalCOGS + itemVariableCosts;
      const fixedExpenses = expensesByYear[yearIndex]?.fixed || 0;
      const totalExpenses = fixedExpenses + totalVariableExpenses;

      const ebitda = revenue - totalExpenses;
      const depreciation = depreciationByYear[yearIndex] || 0;
      const operationalProfit = ebitda - depreciation;
      const interestExpense = interestByYear[yearIndex] || 0;
      const ebt = operationalProfit - interestExpense;

      let taxableIncome = ebt + taxLossCarryforward;
      let taxes = 0;
      if (taxableIncome > 0) {
        taxes = taxableIncome * taxRate;
        taxLossCarryforward = 0;
      } else {
        taxLossCarryforward = -taxableIncome;
      }

      const netProfit = ebt - taxes;
      const unleveredCashFlow = operationalProfit + depreciation - taxes;
      const principalPayment = principalByYear[yearIndex] || 0;
      const leveredCashFlow = netProfit + depreciation - principalPayment;

      const r2 = v => Math.round(v * 100) / 100;

      annualData.push({
        year,
        revenue: r2(revenue),
        totalCOGS: r2(totalCOGS),
        grossProfit: r2(grossProfit),
        fixedExpenses: r2(fixedExpenses),
        variableExpenses: r2(totalVariableExpenses),
        totalExpenses: r2(totalExpenses),
        ebitda: r2(ebitda),
        depreciation: r2(depreciation),
        operationalProfit: r2(operationalProfit),
        interestExpense: r2(interestExpense),
        taxes: r2(taxes),
        netProfit: r2(netProfit),
        unleveredCashFlow: r2(unleveredCashFlow),
        leveredCashFlow: r2(leveredCashFlow)
      });

      const prevCum = cumulativeCF;
      cumulativeCF += leveredCashFlow;
      cashFlows.push(leveredCashFlow);

      if (paybackPeriodResult === null && cumulativeCF >= 0 && prevCum < 0) {
        if (Math.abs(leveredCashFlow) > 0.01) {
          paybackPeriodResult = (year - 1) + Math.abs(prevCum) / leveredCashFlow;
        } else {
          paybackPeriodResult = year;
        }
      }
    }

    // Revenue-based break-even
    if (breakEvenType === 'none' && annualData.length > 0) {
      const y1 = annualData[0];
      const rev1 = y1.revenue || 0;
      const var1 = y1.variableExpenses || 0;
      const fixedBase = (y1.fixedExpenses || 0) + (y1.depreciation || 0) + (y1.interestExpense || 0);

      if (rev1 > 0 && var1 < rev1 && fixedBase > 0) {
        const varRatio = var1 / rev1;
        const beRev = fixedBase / (1 - varRatio);
        if (isFinite(beRev) && beRev > 0) {
          breakEvenPoint = Math.round(beRev * 100) / 100;
          breakEvenType = 'revenue';
        }
      }
    }

    // NPV (unlevered cash flows)
    const unleveredCFs = [-initialInvestment, ...annualData.map(d => d.unleveredCashFlow)];
    let npvResult = calcNPV(discountRate, unleveredCFs);

    // IRR (levered cash flows)
    let irrResult = null;
    const hasPositive = cashFlows.slice(1).some(cf => cf > 0);
    const hasNegInit = cashFlows[0] < 0;
    if (hasNegInit && hasPositive) {
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

  return {
    lastCalculated: new Date().toISOString(),
    scenarios
  };
}

// ─── Main ────────────────────────────────────────────────────────

function main() {
  if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
  }

  const caseFiles = fs.readdirSync(CASES_DIR)
    .filter(f => f.endsWith('.txt'))
    .sort();

  const total = caseFiles.length;
  let skipped = 0, generated = 0, errors = 0;

  console.log(`\n=== Generating results for model: ${modelFolder} ===`);
  console.log(`Total cases: ${total}\n`);

  for (const caseFile of caseFiles) {
    const baseName = caseFile.replace('.txt', '');
    const outPath = path.join(RESULTS_DIR, baseName + '.json');

    if (!overwrite && fs.existsSync(outPath)) {
      skipped++;
      continue;
    }

    try {
      const { meta, inputs } = parseCaseFile(path.join(CASES_DIR, caseFile));
      const analysis = calculateAnalysis(meta, inputs);

      const result = { meta, inputs, analysis };
      fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf-8');
      generated++;

      if (generated % 50 === 0 || generated === 1) {
        console.log(`  Generated ${generated} files (skipped ${skipped}, errors ${errors}) — latest: ${baseName}`);
      }
    } catch (err) {
      errors++;
      console.error(`  ERROR on ${baseName}: ${err.message}`);
    }
  }

  console.log(`\n=== Done ===`);
  console.log(`  Generated: ${generated}`);
  console.log(`  Skipped (already exist): ${skipped}`);
  console.log(`  Errors: ${errors}`);
  console.log(`  Total: ${total}\n`);
}

main();
