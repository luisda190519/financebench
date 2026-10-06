'use strict';
/**
 * Dataset Generator — creates 1000 diverse business case JSON files.
 * Run with: node benchmark/generator/index.js
 *
 * Output:
 *   benchmark/dataset/cases/case_0001.json ... case_1000.json
 *   benchmark/dataset/index.json
 *   benchmark/dataset/all_cases.json
 */

const fs   = require('fs');
const path = require('path');

const { generateCafeteriaCase }    = require('./templates/cafeteria');
const { generateSoftwareCase }     = require('./templates/software');
const { generateRetailCase }       = require('./templates/retail');
const { generateConstruccionCase } = require('./templates/construccion');
const { generateManufacturaCase }  = require('./templates/manufactura');
const { generateConsultoriaCase }  = require('./templates/consultoria');
const { generateEcommerceCase }    = require('./templates/ecommerce');
const { generateAgriculturaCase }  = require('./templates/agricultura');
const { generateFincaRaizCase }    = require('./templates/fincaRaiz');
const { generateHospedajeCase }    = require('./templates/hospedaje');

const TEMPLATES = [
  { name: 'cafeteria',    fn: generateCafeteriaCase },
  { name: 'software',     fn: generateSoftwareCase },
  { name: 'retail',       fn: generateRetailCase },
  { name: 'construccion', fn: generateConstruccionCase },
  { name: 'manufactura',  fn: generateManufacturaCase },
  { name: 'consultoria',  fn: generateConsultoriaCase },
  { name: 'ecommerce',    fn: generateEcommerceCase },
  { name: 'agricultura',  fn: generateAgriculturaCase },
  { name: 'fincaRaiz',    fn: generateFincaRaizCase },
  { name: 'hospedaje',    fn: generateHospedajeCase },
];

const CASES_PER_TYPE = 100;
const TOTAL_CASES    = TEMPLATES.length * CASES_PER_TYPE;

// Output paths
const OUTPUT_DIR  = path.join(__dirname, '../dataset/cases');
const INDEX_FILE  = path.join(__dirname, '../dataset/index.json');
const ALL_FILE    = path.join(__dirname, '../dataset/all_cases.json');

// Ensure output directory exists
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const index    = [];
const allCases = [];

let globalIndex = 1;
let errorCount  = 0;

console.log(`\n🚀 Benchmark Dataset Generator`);
console.log(`   Templates: ${TEMPLATES.length} project types`);
console.log(`   Cases per type: ${CASES_PER_TYPE}`);
console.log(`   Total: ${TOTAL_CASES} cases\n`);

for (const template of TEMPLATES) {
  for (let i = 0; i < CASES_PER_TYPE; i++) {
    const seed = globalIndex;
    // Difficulty: 0=simple (0-39), 1=medium (40-79), 2=complex (80-99)
    const difficulty = i < 40 ? 0 : i < 80 ? 1 : 2;
    const diffName   = ['simple', 'medium', 'complex'][difficulty];
    const caseId     = `case_${String(globalIndex).padStart(4, '0')}`;

    let caseData;
    try {
      caseData = template.fn(difficulty, seed);
    } catch (err) {
      console.error(`\n❌ Generation error for ${caseId} (${template.name}): ${err.message}`);
      errorCount++;
      globalIndex++;
      continue;
    }

    const fullCase = {
      meta: {
        exportVersion: '1.0',
        caseId,
        projectType: template.name,
        difficulty:  diffName,
        seed,
        generatedAt: new Date().toISOString()
      },
      inputs: caseData.inputs
    };

    // Write individual file
    const filename = path.join(OUTPUT_DIR, `${caseId}.json`);
    fs.writeFileSync(filename, JSON.stringify(fullCase, null, 2), 'utf-8');

    // Add to index
    index.push({
      id:         caseId,
      type:       template.name,
      difficulty: diffName,
      seed,
      filename:   `cases/${caseId}.json`
    });

    allCases.push(fullCase);

    process.stdout.write(`\r   Progress: ${globalIndex}/${TOTAL_CASES} (${template.name} / ${diffName})   `);
    globalIndex++;
  }
}

// Write index and all_cases
fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2), 'utf-8');
fs.writeFileSync(ALL_FILE, JSON.stringify(allCases, null, 2), 'utf-8');

console.log(`\n\n✅ Generation complete!`);
console.log(`   Cases generated: ${allCases.length}`);
if (errorCount > 0) console.log(`   Errors: ${errorCount}`);
console.log(`   Individual files: ${OUTPUT_DIR}`);
console.log(`   Index: ${INDEX_FILE}`);
console.log(`   All cases: ${ALL_FILE}`);
console.log(`\n   Run 'node benchmark/generator/validate.js' to validate all cases.\n`);
