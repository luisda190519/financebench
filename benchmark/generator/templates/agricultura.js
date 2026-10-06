'use strict';
const { seededRandom, round2, makeId, buildFinancing } = require('../utils');

const NAMES = [
  'Cultivos del Valle', 'Finca La Esperanza', 'Agro del Sur', 'Campo Verde SAS',
  'Hacienda Los Pinos', 'Agropecuaria Andina', 'Productos del Campo', 'Cosecha Viva'
];

const CROPS = [
  { name: 'Café pergamino',  priceMin: 5000,  priceMax: 10000, costPct: 0.55, yieldMin: 500,  yieldMax: 3000, periods: 2 },
  { name: 'Papa criolla',    priceMin: 800,   priceMax: 2000,  costPct: 0.60, yieldMin: 5000, yieldMax: 30000,periods: 3 },
  { name: 'Aguacate Hass',   priceMin: 2000,  priceMax: 5000,  costPct: 0.45, yieldMin: 2000, yieldMax: 15000,periods: 2 },
  { name: 'Tomate',          priceMin: 1000,  priceMax: 3000,  costPct: 0.58, yieldMin: 3000, yieldMax: 20000,periods: 3 },
  { name: 'Leche (litros)',  priceMin: 1200,  priceMax: 1800,  costPct: 0.55, yieldMin: 5000, yieldMax: 30000,periods: 12 },
];

function generateAgriculturaCase(difficulty, seed) {
  const r = seededRandom(seed);
  const projectLife = r.int(4, 10);

  const land       = r.int(20, [80, 200, 500][difficulty]) * 1000000;
  const equipment  = r.int(10, [40, 100, 250][difficulty]) * 1000000;
  const seeds      = r.int(2, [10, 25, 60][difficulty]) * 1000000;
  const workingCap = r.int(10, 30) * 1000000;
  const totalInvest = land + equipment + seeds + workingCap;

  const cropCount = [1, 2, 3][difficulty];
  const items = CROPS.slice(0, cropCount).map((crop, i) => {
    const basePrice = r.int(crop.priceMin, crop.priceMax);
    const unitCost  = Math.round(basePrice * crop.costPct);
    const baseYield = r.int(crop.yieldMin, crop.yieldMax);
    const growthRate = round2(r.float(0.01, 0.05));

    return {
      id: makeId('crop', i + 1),
      name: crop.name,
      type: 'product',
      category: 'agriculture',
      growthRate,
      periodsPerYear: crop.periods,
      scenarios: {
        optimista:  { sellingPrice: Math.round(basePrice * 1.2), unitCost, quantity: Math.round(baseYield * 1.25), discount: 0 },
        normal:     { sellingPrice: basePrice,                   unitCost, quantity: baseYield,                    discount: 0 },
        pesimista:  { sellingPrice: Math.round(basePrice * 0.7), unitCost, quantity: Math.round(baseYield * 0.65), discount: 0 },
        controlado: { sellingPrice: basePrice,                   unitCost, quantity: Math.round(baseYield * 0.85), discount: 0 }
      }
    };
  });

  const staffSalary = r.int(2, [6, 15, 30][difficulty]) * 1000000;

  const expenses = {
    items: [
      { name: 'Jornales y mano de obra', amount: staffSalary, type: 'fijo', frequency: 'monthly', category: 'Personal', growthRate: round2(r.float(3, 6)), addedBy: 'user' },
      { name: 'Insumos agrícolas', amount: r.int(1, [5, 15, 30][difficulty]) * 1000000, type: 'variable', frequency: 'monthly', category: 'Operacional', growthRate: 5, addedBy: 'user' },
      { name: 'Agua y riego', amount: r.int(200000, 1500000), type: 'fijo', frequency: 'monthly', category: 'Operacional', growthRate: 4, addedBy: 'user' },
      ...(difficulty >= 1 ? [
        { name: 'Transporte y distribución', amount: r.int(500000, 3000000), type: 'variable', frequency: 'monthly', category: 'Operacional', growthRate: 5, addedBy: 'user' }
      ] : []),
      ...(difficulty >= 2 ? [
        { name: 'Seguros agrícolas', amount: r.int(1, 5) * 1000000, type: 'fijo', frequency: 'annual', category: 'Administrativo', growthRate: 3, addedBy: 'user' },
        { name: 'Certificaciones calidad', amount: r.int(500000, 2000000), type: 'fijo', frequency: 'annual', category: 'Administrativo', growthRate: 3, addedBy: 'user' }
      ] : [])
    ]
  };

  return {
    inputs: {
      general: {
        projectName: r.pick(NAMES),
        projectType: 'agriculture',
        projectLife,
        projectLifeUnit: 'años',
        currency: 'COP',
        taxRate: r.pick([15, 25, 30]),
        discountRate: r.pick([10, 12]),
        startDate: '2025-01-01T00:00:00.000Z'
      },
      investmentAssets: {
        civilWorks: land,
        laborCost: 0,
        materials: seeds,
        licenses: r.int(500000, 2000000),
        furniture: r.int(500000, 1500000),
        cash: workingCap,
        bank: 0,
        inventory: r.int(1, 5) * 1000000,
        fixedAssets: [{ name: 'Maquinaria agrícola', value: equipment, usefulLife: 8, description: '' }],
        customFields: []
      },
      financing: buildFinancing(totalInvest, r, 0.60),
      income: { periodsPerYear: 2, items, scenarios: [] },
      expenses
    }
  };
}

module.exports = { generateAgriculturaCase };
