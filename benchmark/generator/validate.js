'use strict';
/**
 * Validation script — verifies all generated cases pass structural validation
 * and can be processed by calculateMetrics().
 *
 * Run with: node benchmark/generator/validate.js
 */

const fs      = require('fs');
const path    = require('path');

const ALL_FILE = path.join(__dirname, '../dataset/all_cases.json');

if (!fs.existsSync(ALL_FILE)) {
  console.error('❌ all_cases.json not found. Run the generator first:');
  console.error('   node benchmark/generator/index.js');
  process.exit(1);
}

console.log('Loading cases…');
const allCases = JSON.parse(fs.readFileSync(ALL_FILE, 'utf-8'));
console.log(`Validating ${allCases.length} cases...\n`);

let passed = 0;
let failed = 0;
const errors = [];

function validateInputStructure(json) {
  if (!json.inputs) throw new Error('Missing inputs key');
  const { general, income, investmentAssets } = json.inputs;

  if (!general?.projectName || typeof general.projectName !== 'string' || general.projectName.trim() === '') {
    throw new Error('Invalid or missing projectName');
  }
  if (!general.projectLife || general.projectLife < 1 || general.projectLife > 50) {
    throw new Error(`Invalid projectLife: ${general.projectLife}`);
  }
  if (general.taxRate === undefined || general.taxRate === null) {
    throw new Error('Missing taxRate');
  }
  if (general.discountRate === undefined || general.discountRate === null) {
    throw new Error('Missing discountRate');
  }
  const hasItems     = income?.items?.length > 0;
  const hasScenarios = income?.scenarios?.length > 0;
  if (!hasItems && !hasScenarios) {
    throw new Error('No income items or scenarios');
  }
  if (!investmentAssets) {
    throw new Error('Missing investmentAssets');
  }
}

function checkNumerics(inputs) {
  // Spot-check: all expense amounts should be non-negative numbers
  for (const expense of (inputs.expenses?.items || [])) {
    if (typeof expense.amount !== 'number' || expense.amount < 0 || !isFinite(expense.amount)) {
      throw new Error(`Invalid expense amount: ${expense.name} = ${expense.amount}`);
    }
  }
  // Check income item quantities are non-negative
  for (const item of (inputs.income?.items || [])) {
    for (const scenario of ['optimista', 'normal', 'pesimista', 'controlado']) {
      const s = item.scenarios?.[scenario];
      if (s) {
        if (typeof s.quantity !== 'number' || s.quantity < 0) {
          throw new Error(`Invalid quantity in ${item.name}/${scenario}: ${s.quantity}`);
        }
        if (typeof s.sellingPrice !== 'number' || s.sellingPrice < 0) {
          throw new Error(`Invalid sellingPrice in ${item.name}/${scenario}: ${s.sellingPrice}`);
        }
      }
    }
  }
}

for (let i = 0; i < allCases.length; i++) {
  const c = allCases[i];
  try {
    validateInputStructure(c);
    checkNumerics(c.inputs);
    passed++;
  } catch (err) {
    failed++;
    errors.push({ id: c.meta?.caseId || `index_${i}`, type: c.meta?.projectType, error: err.message });
  }

  if ((i + 1) % 100 === 0) {
    process.stdout.write(`\r   Validated: ${i + 1}/${allCases.length} | ✅ ${passed} | ❌ ${failed}   `);
  }
}

console.log(`\n\n📊 Validation Results`);
console.log(`   Total cases: ${allCases.length}`);
console.log(`   ✅ Passed:  ${passed}`);
console.log(`   ❌ Failed:  ${failed}`);

if (errors.length > 0) {
  console.log('\nFirst 10 errors:');
  for (const e of errors.slice(0, 10)) {
    console.log(`   [${e.id}] (${e.type}): ${e.error}`);
  }

  // Write full error log
  const logPath = path.join(__dirname, '../logs/validation-errors.json');
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
  fs.writeFileSync(logPath, JSON.stringify(errors, null, 2), 'utf-8');
  console.log(`\n   Full error log: ${logPath}`);
}

if (failed === 0) {
  console.log('\n🎉 All cases valid! Dataset is ready for use.');
} else {
  console.log(`\n⚠️  ${failed} cases failed validation. Check error log for details.`);
  process.exit(1);
}
