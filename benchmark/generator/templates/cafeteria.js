'use strict';
const { seededRandom, round2, makeId, buildFinancing } = require('../utils');

const NAMES = [
  'Café Aroma', 'El Rincón del Café', 'Tierra Negra Café', 'Cafetería Central',
  'Java Colombia', 'Tostado & Co.', 'Café Andino', 'La Pausa', 'Brew Bar', 'El Grano'
];

const PRODUCTS = [
  { key: 'espresso',   name: 'Café Espresso',    priceMin: 4000, priceMax: 6000,  costPct: 0.28, qtyMin: 40,  qtyMax: 100 },
  { key: 'cappuccino', name: 'Cappuccino',        priceMin: 5000, priceMax: 7000,  costPct: 0.28, qtyMin: 30,  qtyMax: 80  },
  { key: 'tinto',      name: 'Tinto',             priceMin: 1500, priceMax: 2500,  costPct: 0.20, qtyMin: 50,  qtyMax: 150 },
  { key: 'pasteleria', name: 'Pastelería',        priceMin: 3000, priceMax: 5000,  costPct: 0.45, qtyMin: 20,  qtyMax: 60  },
  { key: 'almuerzo',   name: 'Almuerzo del Día',  priceMin: 12000, priceMax: 18000, costPct: 0.42, qtyMin: 15,  qtyMax: 40  },
  { key: 'torta',      name: 'Torta Especial',    priceMin: 6000, priceMax: 10000, costPct: 0.40, qtyMin: 10,  qtyMax: 30  },
  { key: 'batido',     name: 'Batido de Frutas',  priceMin: 5000, priceMax: 8000,  costPct: 0.35, qtyMin: 10,  qtyMax: 40  },
  { key: 'sandwich',   name: 'Sándwich',          priceMin: 7000, priceMax: 12000, costPct: 0.40, qtyMin: 10,  qtyMax: 30  },
];

/**
 * Generates a realistic cafetería / restaurante Input-Only JSON case.
 * @param {0|1|2} difficulty — 0=simple, 1=medium, 2=complex
 * @param {number} seed — deterministic seed
 */
function generateCafeteriaCase(difficulty, seed) {
  const r = seededRandom(seed);
  const projectLife = r.int(3, 7);

  // Difficulty controls item count and complexity
  const productCount = [2, 4, 7][difficulty];
  const products = PRODUCTS.slice(0, productCount);

  // Investment scales with difficulty
  const renovation = r.int(10, [30, 50, 80][difficulty]) * 1000000;
  const equipment   = r.int(15, [40, 70, 120][difficulty]) * 1000000;
  const furniture   = r.int(3, [10, 20, 35][difficulty]) * 1000000;
  const inventory   = r.int(1, 5) * 1000000;
  const workingCap  = r.int(3, 10) * 1000000;
  const totalInvest = renovation + equipment + furniture + inventory + workingCap;

  // Build income items
  const items = products.map((p, i) => {
    const basePrice = r.int(p.priceMin, p.priceMax);
    const unitCost  = Math.round(basePrice * p.costPct);
    const baseQty   = r.int(p.qtyMin, p.qtyMax);
    const growthRate = round2(r.float(0.02, 0.08));

    return {
      id: makeId('item', i + 1),
      name: p.name,
      type: 'product',
      category: 'food_beverage',
      growthRate,
      periodsPerYear: 365,
      scenarios: {
        optimista:  { sellingPrice: Math.round(basePrice * 1.1), unitCost, quantity: Math.round(baseQty * 1.3),  discount: 0 },
        normal:     { sellingPrice: basePrice,                   unitCost, quantity: baseQty,                    discount: 0 },
        pesimista:  { sellingPrice: Math.round(basePrice * 0.9), unitCost, quantity: Math.round(baseQty * 0.65), discount: 0 },
        controlado: { sellingPrice: basePrice,                   unitCost, quantity: Math.round(baseQty * 0.85), discount: 0 }
      }
    };
  });

  // Build expenses
  const rent      = r.int(2, difficulty === 2 ? 8 : 5) * 1000000;
  const salaries  = r.int(3, difficulty === 2 ? 15 : 8) * 1000000;
  const utilities = r.int(300000, 900000);
  const expenses = {
    items: [
      { name: 'Arriendo local', amount: rent,      type: 'fijo',     frequency: 'monthly', category: 'Operacional',  growthRate: 3, addedBy: 'user' },
      { name: 'Nómina',         amount: salaries,  type: 'fijo',     frequency: 'monthly', category: 'Personal',     growthRate: round2(r.float(3, 6)), addedBy: 'user' },
      { name: 'Servicios',      amount: utilities, type: 'fijo',     frequency: 'monthly', category: 'Operacional',  growthRate: 4, addedBy: 'user' },
      ...(difficulty >= 1 ? [
        { name: 'Marketing',    amount: r.int(200000, 800000), type: 'variable', frequency: 'monthly', category: 'Ventas', growthRate: 5, addedBy: 'user' }
      ] : []),
      ...(difficulty >= 2 ? [
        { name: 'Mantenimiento', amount: r.int(200000, 600000), type: 'fijo', frequency: 'monthly', category: 'Operacional', growthRate: 3, addedBy: 'user' },
        { name: 'Contador',      amount: r.int(300000, 700000), type: 'fijo', frequency: 'monthly', category: 'Administrativo', growthRate: 0, addedBy: 'user' }
      ] : [])
    ]
  };

  // Fixed assets
  const fixedAssets = [
    { name: 'Máquina espresso',  value: equipment, usefulLife: 5, description: '' }
  ];
  if (difficulty >= 1) {
    fixedAssets.push({ name: 'Horno industrial', value: r.int(3, 10) * 1000000, usefulLife: 7, description: '' });
  }

  // Custom investment fields (complex only)
  const customFields = difficulty >= 2 ? [
    { id: 'cf_1', name: 'Software POS', value: r.int(500000, 2000000), category: 'tecnologia', description: '', isDepreciable: true, usefulLife: 3, addedBy: 'user' },
    { id: 'cf_2', name: 'Aviso luminoso', value: r.int(500000, 1500000), category: 'marketing', description: '', isDepreciable: false, usefulLife: 5, addedBy: 'user' }
  ] : [];

  return {
    inputs: {
      general: {
        projectName: r.pick(NAMES),
        projectType: 'restaurant',
        projectLife,
        projectLifeUnit: 'años',
        currency: 'COP',
        taxRate: r.pick([25, 30, 33]),
        discountRate: r.pick([10, 12, 15]),
        startDate: '2025-01-01T00:00:00.000Z'
      },
      investmentAssets: {
        civilWorks: renovation,
        laborCost: Math.round(renovation * 0.2),
        materials: 0,
        licenses: r.int(500000, 2000000),
        furniture,
        cash: workingCap,
        bank: 0,
        inventory,
        fixedAssets,
        customFields
      },
      financing: buildFinancing(totalInvest, r, 0.65),
      income: { periodsPerYear: 365, items, scenarios: [] },
      expenses
    }
  };
}

module.exports = { generateCafeteriaCase };
