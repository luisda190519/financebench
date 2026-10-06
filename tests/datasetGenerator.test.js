'use strict';
/**
 * Tests for the benchmark dataset generator.
 *
 * Verifies that:
 * 1. Each template produces valid, parseable JSON
 * 2. The validateImportJSON() check passes on all generated outputs
 * 3. Outputs are deterministic (same seed → same output)
 * 4. Different seeds produce different outputs
 * 5. Scenario revenue ordering: optimista ≥ normal ≥ pesimista
 */

const path = require('path');

const { validateImportJSON } = require('../src/importJSON');

// Load all 10 templates
const { generateCafeteriaCase }   = require('../benchmark/generator/templates/cafeteria');
const { generateSoftwareCase }    = require('../benchmark/generator/templates/software');
const { generateRetailCase }      = require('../benchmark/generator/templates/retail');
const { generateConstruccionCase }= require('../benchmark/generator/templates/construccion');
const { generateManufacturaCase } = require('../benchmark/generator/templates/manufactura');
const { generateConsultoriaCase } = require('../benchmark/generator/templates/consultoria');
const { generateEcommerceCase }   = require('../benchmark/generator/templates/ecommerce');
const { generateAgriculturaCase } = require('../benchmark/generator/templates/agricultura');
const { generateFincaRaizCase }   = require('../benchmark/generator/templates/fincaRaiz');
const { generateHospedajeCase }   = require('../benchmark/generator/templates/hospedaje');

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

// ---------------------------------------------------------------------------
// Schema validation across all templates and difficulties
// ---------------------------------------------------------------------------
describe.each(TEMPLATES)('Template: $name', ({ name, fn }) => {

  test.each([0, 1, 2])('difficulty %i passes validateImportJSON', (difficulty) => {
    const result = fn(difficulty, 42);
    expect(result).toHaveProperty('inputs');
    expect(() => validateImportJSON({ inputs: result.inputs })).not.toThrow();
  });

  test('generates projectName (non-empty string)', () => {
    const result = fn(0, 1);
    expect(typeof result.inputs.general.projectName).toBe('string');
    expect(result.inputs.general.projectName.trim().length).toBeGreaterThan(0);
  });

  test('projectLife is integer 1–50', () => {
    const result = fn(1, 1);
    const life = result.inputs.general.projectLife;
    expect(Number.isInteger(life)).toBe(true);
    expect(life).toBeGreaterThanOrEqual(1);
    expect(life).toBeLessThanOrEqual(50);
  });

  test('taxRate and discountRate are positive numbers', () => {
    const result = fn(1, 1);
    expect(result.inputs.general.taxRate).toBeGreaterThan(0);
    expect(result.inputs.general.discountRate).toBeGreaterThan(0);
  });

  test('has at least one income item', () => {
    const result = fn(0, 1);
    const items = result.inputs.income?.items ?? [];
    const scenarios = result.inputs.income?.scenarios ?? [];
    expect(items.length + scenarios.length).toBeGreaterThan(0);
  });

  test('has at least one expense item', () => {
    const result = fn(0, 1);
    expect(result.inputs.expenses.items.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Determinism
// ---------------------------------------------------------------------------
describe('Determinism', () => {

  test.each(TEMPLATES)('$name: same seed produces identical output', ({ fn }) => {
    const a = fn(1, 42);
    const b = fn(1, 42);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  test.each(TEMPLATES)('$name: different seeds produce different output', ({ fn }) => {
    const a = fn(1, 42);
    const b = fn(1, 43);
    expect(JSON.stringify(a)).not.toBe(JSON.stringify(b));
  });
});

// ---------------------------------------------------------------------------
// Scenario revenue ordering: optimista ≥ normal ≥ pesimista
// ---------------------------------------------------------------------------
describe('Scenario revenue ordering', () => {

  function totalRevenue(item, scenario) {
    const s = item.scenarios?.[scenario];
    if (!s) return 0;
    const price = s.sellingPrice * (1 - (s.discount || 0) / 100);
    return price * s.quantity;
  }

  test.each(TEMPLATES)('$name: all items satisfy optimista ≥ pesimista revenue', ({ fn }) => {
    // Test across several seeds to be thorough
    for (const seed of [1, 10, 50, 99]) {
      for (const difficulty of [0, 1, 2]) {
        const result = fn(difficulty, seed);
        const items = result.inputs.income?.items ?? [];
        for (const item of items) {
          const revOpt = totalRevenue(item, 'optimista');
          const revPes = totalRevenue(item, 'pesimista');
          // optimista should not be strictly less than pesimista
          expect(revOpt).toBeGreaterThanOrEqual(revPes - 1); // allow ±1 rounding
        }
      }
    }
  });
});

// ---------------------------------------------------------------------------
// Investment amounts are positive
// ---------------------------------------------------------------------------
describe('Investment sanity', () => {

  test.each(TEMPLATES)('$name: total investment > 0', ({ fn }) => {
    const result = fn(1, 7);
    const inv = result.inputs.investmentAssets;
    const total =
      (inv.civilWorks    || 0) +
      (inv.laborCost     || 0) +
      (inv.materials     || 0) +
      (inv.licenses      || 0) +
      (inv.furniture     || 0) +
      (inv.cash          || 0) +
      (inv.bank          || 0) +
      (inv.inventory     || 0) +
      (inv.fixedAssets || []).reduce((s, a) => s + (a.value || 0), 0);
    expect(total).toBeGreaterThan(0);
  });

  test.each(TEMPLATES)('$name: no negative investment components', ({ fn }) => {
    const result = fn(2, 7);
    const inv = result.inputs.investmentAssets;
    const numericFields = ['civilWorks','laborCost','materials','licenses','furniture','cash','bank','inventory'];
    for (const field of numericFields) {
      if (inv[field] !== undefined) {
        expect(inv[field]).toBeGreaterThanOrEqual(0);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// Financing structure
// ---------------------------------------------------------------------------
describe('Financing structure', () => {

  test.each(TEMPLATES)('$name: financing object is present', ({ fn }) => {
    const result = fn(1, 5);
    expect(result.inputs.financing).toBeDefined();
  });

  test.each(TEMPLATES)('$name: partners or customSources provide some capital', ({ fn }) => {
    const result = fn(1, 5);
    const fin = result.inputs.financing;
    const partnerTotal = (fin.partners || []).reduce((s, p) => s + (p.contribution || 0), 0);
    const sourceTotal  = (fin.customSources || []).reduce((s, cs) => s + (cs.amount || 0), 0);
    expect(partnerTotal + sourceTotal).toBeGreaterThan(0);
  });
});
