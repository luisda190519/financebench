'use strict';
/**
 * Integration-style tests for the comparison engine.
 *
 * Focuses on edge cases: zero denominators, mismatched array lengths,
 * mixed null/non-null pairs, and summary arithmetic invariants.
 */

const { compareAnalysis } = require('../src/compareAnalysis');

// ---------------------------------------------------------------------------
// Helper — build a full mock analysis with 4 scenarios
// ---------------------------------------------------------------------------
function buildAnalysis(normalNpv = 50000, opts = {}) {
  // Use 'in' checks so that explicit null values are preserved (not replaced by defaults)
  return {
    scenarios: {
      normal: {
        npv: normalNpv,
        irr:           'irr'      in opts ? opts.irr      : 20,
        paybackPeriod: 'payback'  in opts ? opts.payback  : 3,
        breakEvenPoint:'bep'      in opts ? opts.bep      : 200,
        annualData:    opts.annualData ?? []
      },
      optimista:  { npv: 80000, irr: 30, paybackPeriod: 2,    breakEvenPoint: 150, annualData: [] },
      pesimista:  { npv: -5000, irr: null, paybackPeriod: null, breakEvenPoint: 400, annualData: [] },
      controlado: { npv: 35000, irr: 16, paybackPeriod: 3.5,  breakEvenPoint: 250, annualData: [] }
    }
  };
}

// ---------------------------------------------------------------------------
// Zero-denominator handling
// ---------------------------------------------------------------------------
describe('Edge case: zero app value', () => {
  test('diffPercent = 0 when both values are 0 (no division by zero)', () => {
    const json = buildAnalysis();
    const app  = buildAnalysis();
    json.scenarios.normal.npv = 0;
    app.scenarios.normal.npv  = 0;
    const result = compareAnalysis(json, app);
    const npvResult = result.by_section.normal.metrics.npv;
    expect(npvResult.diffPercent).toBe(0);
    expect(npvResult.status).toBe('match');
  });

  test('diffPercent = 1 (100%) when json=non-zero, app=0', () => {
    const json = buildAnalysis(5000);
    const app  = buildAnalysis(0);
    const result = compareAnalysis(json, app);
    const npvResult = result.by_section.normal.metrics.npv;
    expect(npvResult.diffPercent).toBe(1); // capped at 100%
    expect(npvResult.status).toBe('large');
  });
});

// ---------------------------------------------------------------------------
// Null / undefined propagation
// ---------------------------------------------------------------------------
describe('Null/undefined handling', () => {
  test('both null → status N/A, diffPercent null', () => {
    const json = buildAnalysis(50000, { payback: null });
    const app  = buildAnalysis(50000, { payback: null });
    const result = compareAnalysis(json, app);
    const pb = result.by_section.normal.metrics.paybackPeriod;
    expect(pb.status).toBe('N/A');
    expect(pb.diffPercent).toBeNull();
  });

  test('json null, app defined → status N/A', () => {
    const json = buildAnalysis(50000, { payback: null });
    const app  = buildAnalysis(50000, { payback: 3 });
    const result = compareAnalysis(json, app);
    expect(result.by_section.normal.metrics.paybackPeriod.status).toBe('N/A');
  });

  test('json defined, app null → status N/A', () => {
    const json = buildAnalysis(50000, { payback: 3 });
    const app  = buildAnalysis(50000, { payback: null });
    const result = compareAnalysis(json, app);
    expect(result.by_section.normal.metrics.paybackPeriod.status).toBe('N/A');
  });
});

// ---------------------------------------------------------------------------
// annualData length mismatch
// ---------------------------------------------------------------------------
describe('Annual data length mismatch', () => {
  const yearRow = {
    revenue: 100000, totalCOGS: 30000, grossProfit: 70000,
    fixedExpenses: 40000, variableExpenses: 0, totalExpenses: 40000,
    ebitda: 30000, depreciation: 5000, operationalProfit: 25000,
    interestExpense: 2000, taxes: 6900, netProfit: 16100,
    unleveredCashFlow: 35000, leveredCashFlow: 21100
  };

  test('json has 2 years, app has 1 year — second year is N/A', () => {
    const json = buildAnalysis(50000, { annualData: [yearRow, yearRow] });
    const app  = buildAnalysis(50000, { annualData: [yearRow] });
    const result = compareAnalysis(json, app);
    // 2 year entries should be present
    expect(result.by_section.normal.annualData).toHaveLength(2);
    // Year 2: app values are undefined → all N/A
    const year2Fields = result.by_section.normal.annualData[1].fields;
    Object.values(year2Fields).forEach(f => {
      expect(f.status).toBe('N/A');
    });
  });

  test('json has 0 years, app has 1 year — year is N/A', () => {
    const json = buildAnalysis(50000, { annualData: [] });
    const app  = buildAnalysis(50000, { annualData: [yearRow] });
    const result = compareAnalysis(json, app);
    expect(result.by_section.normal.annualData).toHaveLength(1);
    const year1Fields = result.by_section.normal.annualData[0].fields;
    Object.values(year1Fields).forEach(f => {
      expect(f.status).toBe('N/A');
    });
  });
});

// ---------------------------------------------------------------------------
// Summary arithmetic invariant
// ---------------------------------------------------------------------------
describe('Summary invariant', () => {
  test('exactMatches + smallDifferences + largeDifferences + notApplicable === totalFields', () => {
    const json = buildAnalysis(103000); // 3% diff on npv → "small"
    const app  = buildAnalysis(100000);
    const result = compareAnalysis(json, app);
    const { exactMatches, smallDifferences, largeDifferences, notApplicable, totalFields } = result.summary;
    expect(exactMatches + smallDifferences + largeDifferences + notApplicable).toBe(totalFields);
  });

  test('avgErrorPercent is non-negative', () => {
    const json = buildAnalysis(110000); // 10% diff
    const app  = buildAnalysis(100000);
    const result = compareAnalysis(json, app);
    expect(result.summary.avgErrorPercent).toBeGreaterThanOrEqual(0);
  });

  test('overallAccuracy is in range [0, 1]', () => {
    const result = compareAnalysis(buildAnalysis(), buildAnalysis());
    expect(result.summary.overallAccuracy).toBeGreaterThanOrEqual(0);
    expect(result.summary.overallAccuracy).toBeLessThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------
// Threshold boundary precision
// ---------------------------------------------------------------------------
describe('Threshold boundary precision', () => {
  // MATCH threshold is ≤ 1%, SMALL is 1–5%, LARGE is >5%
  const app = buildAnalysis(100000);

  test('exactly 1% diff → match (boundary inclusive)', () => {
    const json = buildAnalysis(101000); // exactly 1%
    const result = compareAnalysis(json, app);
    expect(result.by_section.normal.metrics.npv.status).toBe('match');
  });

  test('1.1% diff → small', () => {
    const json = buildAnalysis(101100); // 1.1%
    const result = compareAnalysis(json, app);
    expect(result.by_section.normal.metrics.npv.status).toBe('small');
  });

  test('exactly 5% diff → small (boundary inclusive)', () => {
    const json = buildAnalysis(105000); // exactly 5%
    const result = compareAnalysis(json, app);
    expect(result.by_section.normal.metrics.npv.status).toBe('small');
  });

  test('5.1% diff → large', () => {
    const json = buildAnalysis(105100); // 5.1%
    const result = compareAnalysis(json, app);
    expect(result.by_section.normal.metrics.npv.status).toBe('large');
  });
});
