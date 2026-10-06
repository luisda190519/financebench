'use strict';
const { seededRandom, round2, makeId, buildFinancing } = require('../utils');

const NAMES = [
  'Industrias Andinas', 'Manufactura del Sur', 'Planta Productiva SAS', 'Fábrica Moderna',
  'Producciones Colombia', 'Industrial Tech', 'Fabricaciones Unidas', 'ManuCo'
];

const PRODUCT_TYPES = [
  { name: 'Producto alimenticio',  priceMin: 3000,   priceMax: 15000,  costPct: 0.55, qtyMin: 500,  qtyMax: 5000,  periods: 12 },
  { name: 'Producto textil',       priceMin: 10000,  priceMax: 60000,  costPct: 0.58, qtyMin: 100,  qtyMax: 1000,  periods: 12 },
  { name: 'Producto plástico',     priceMin: 2000,   priceMax: 12000,  costPct: 0.52, qtyMin: 1000, qtyMax: 10000, periods: 12 },
  { name: 'Componente electrónico',priceMin: 20000,  priceMax: 100000, costPct: 0.60, qtyMin: 50,   qtyMax: 500,   periods: 12 },
  { name: 'Mueble de madera',      priceMin: 150000, priceMax: 600000, costPct: 0.50, qtyMin: 20,   qtyMax: 200,   periods: 12 },
];

function generateManufacturaCase(difficulty, seed) {
  const r = seededRandom(seed);
  const projectLife = r.int(4, 8);

  const machinery   = r.int(30, [100, 300, 700][difficulty]) * 1000000;
  const installation= Math.round(machinery * 0.15);
  const materials   = r.int(5, [20, 50, 100][difficulty]) * 1000000;
  const workingCap  = r.int(10, 25) * 1000000;
  const totalInvest = machinery + installation + materials + workingCap;

  const productCount = [1, 2, 3][difficulty];
  const items = PRODUCT_TYPES.slice(0, productCount).map((pt, i) => {
    const basePrice = r.int(pt.priceMin, pt.priceMax);
    const unitCost  = Math.round(basePrice * pt.costPct);
    const baseQty   = r.int(pt.qtyMin, pt.qtyMax);
    const growthRate = round2(r.float(0.02, 0.08));

    return {
      id: makeId('prod', i + 1),
      name: pt.name,
      type: 'product',
      category: 'manufacturing',
      growthRate,
      periodsPerYear: pt.periods,
      scenarios: {
        optimista:  { sellingPrice: Math.round(basePrice * 1.05), unitCost, quantity: Math.round(baseQty * 1.3),  discount: 0 },
        normal:     { sellingPrice: basePrice,                    unitCost, quantity: baseQty,                    discount: 0 },
        pesimista:  { sellingPrice: Math.round(basePrice * 0.92), unitCost, quantity: Math.round(baseQty * 0.70), discount: 0 },
        controlado: { sellingPrice: basePrice,                    unitCost, quantity: Math.round(baseQty * 0.88), discount: 0 }
      }
    };
  });

  const staffSalary  = r.int(5, [15, 35, 70][difficulty]) * 1000000;
  const maintenance  = r.int(1, [5, 12, 25][difficulty]) * 1000000;

  const expenses = {
    items: [
      { name: 'Nómina producción', amount: staffSalary, type: 'fijo', frequency: 'monthly', category: 'Personal', growthRate: round2(r.float(3, 6)), addedBy: 'user' },
      { name: 'Energía industrial', amount: r.int(2, 10) * 1000000, type: 'variable', frequency: 'monthly', category: 'Operacional', growthRate: 5, addedBy: 'user' },
      { name: 'Mantenimiento maquinaria', amount: maintenance, type: 'fijo', frequency: 'monthly', category: 'Operacional', growthRate: 4, addedBy: 'user' },
      ...(difficulty >= 1 ? [
        { name: 'Logística y transporte', amount: r.int(1, 5) * 1000000, type: 'variable', frequency: 'monthly', category: 'Operacional', growthRate: 5, addedBy: 'user' }
      ] : []),
      ...(difficulty >= 2 ? [
        { name: 'Control de calidad', amount: r.int(1, 4) * 1000000, type: 'fijo', frequency: 'monthly', category: 'Operacional', growthRate: 3, addedBy: 'user' },
        { name: 'Administración', amount: r.int(1, 5) * 1000000, type: 'fijo', frequency: 'monthly', category: 'Administrativo', growthRate: 4, addedBy: 'user' }
      ] : [])
    ]
  };

  return {
    inputs: {
      general: {
        projectName: r.pick(NAMES),
        projectType: 'manufacturing',
        projectLife,
        projectLifeUnit: 'años',
        currency: 'COP',
        taxRate: r.pick([25, 30, 33]),
        discountRate: r.pick([12, 15]),
        startDate: '2025-01-01T00:00:00.000Z'
      },
      investmentAssets: {
        civilWorks: r.int(5, 30) * 1000000,
        laborCost: installation,
        materials,
        licenses: r.int(1, 5) * 1000000,
        furniture: r.int(1, 5) * 1000000,
        cash: workingCap,
        bank: 0,
        inventory: r.int(5, 20) * 1000000,
        fixedAssets: [
          { name: 'Maquinaria de producción', value: machinery, usefulLife: 10, description: '' }
        ],
        customFields: []
      },
      financing: buildFinancing(totalInvest, r, 0.65),
      income: { periodsPerYear: 12, items, scenarios: [] },
      expenses
    }
  };
}

module.exports = { generateManufacturaCase };
