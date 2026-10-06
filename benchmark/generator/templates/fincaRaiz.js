'use strict';
const { seededRandom, round2, makeId, buildFinancing } = require('../utils');

const NAMES = [
  'Inmobiliaria Central', 'Finca Raíz Andina', 'Arriendos del Valle', 'Proyectos Inmobiliarios SAS',
  'Rentahogar', 'Inmuebles Colombia', 'Capital Inmobiliario', 'Fincas y Propiedades'
];

function generateFincaRaizCase(difficulty, seed) {
  const r = seededRandom(seed);
  const projectLife = r.int(5, 15);

  // Real estate: mostly property acquisition
  const propertyValue = r.int(100, [300, 700, 1500][difficulty]) * 1000000;
  const remodeling    = r.int(5, [20, 50, 120][difficulty]) * 1000000;
  const legal         = r.int(3, 15) * 1000000;
  const workingCap    = r.int(5, 15) * 1000000;
  const totalInvest   = propertyValue + remodeling + legal + workingCap;

  // Revenue: monthly rent from 1–3 units
  const unitCount = [1, 2, 3][difficulty];
  const UNIT_TYPES = [
    { name: 'Apartamento arriendo',   priceMin: 800000, priceMax: 3000000, costPct: 0.10, qtyMin: 1, qtyMax: 1 },
    { name: 'Local comercial arriendo', priceMin: 1500000, priceMax: 8000000, costPct: 0.10, qtyMin: 1, qtyMax: 1 },
    { name: 'Bodega industrial',      priceMin: 2000000, priceMax: 12000000, costPct: 0.08, qtyMin: 1, qtyMax: 1 },
  ];

  const items = UNIT_TYPES.slice(0, unitCount).map((ut, i) => {
    const baseRent  = r.int(ut.priceMin, ut.priceMax);
    const unitCost  = Math.round(baseRent * ut.costPct); // admin costs
    const growthRate = round2(r.float(0.03, 0.06));

    return {
      id: makeId('unit', i + 1),
      name: ut.name,
      type: 'service',
      category: 'real_estate',
      growthRate,
      periodsPerYear: 12,
      scenarios: {
        optimista:  { sellingPrice: Math.round(baseRent * 1.1), unitCost, quantity: 1, discount: 0 },
        normal:     { sellingPrice: baseRent,                   unitCost, quantity: 1, discount: 0 },
        pesimista:  { sellingPrice: Math.round(baseRent * 0.85), unitCost, quantity: 1, discount: r.int(1, 2) },  // vacancy
        controlado: { sellingPrice: baseRent,                   unitCost, quantity: 1, discount: 0 }
      }
    };
  });

  const expenses = {
    items: [
      { name: 'Administración propiedad', amount: r.int(100000, 500000), type: 'fijo', frequency: 'monthly', category: 'Operacional', growthRate: 3, addedBy: 'user' },
      { name: 'Impuesto predial', amount: r.int(500000, 5000000), type: 'fijo', frequency: 'annual', category: 'Administrativo', growthRate: 3, addedBy: 'user' },
      { name: 'Mantenimiento', amount: r.int(200000, 2000000), type: 'fijo', frequency: 'monthly', category: 'Operacional', growthRate: 4, addedBy: 'user' },
      ...(difficulty >= 1 ? [
        { name: 'Seguros', amount: r.int(300000, 2000000), type: 'fijo', frequency: 'annual', category: 'Administrativo', growthRate: 3, addedBy: 'user' }
      ] : []),
      ...(difficulty >= 2 ? [
        { name: 'Agencia inmobiliaria', amount: r.int(200000, 800000), type: 'variable', frequency: 'monthly', category: 'Ventas', growthRate: 3, addedBy: 'user' }
      ] : [])
    ]
  };

  return {
    inputs: {
      general: {
        projectName: r.pick(NAMES),
        projectType: 'general',
        projectLife,
        projectLifeUnit: 'años',
        currency: 'COP',
        taxRate: r.pick([20, 25, 33]),
        discountRate: r.pick([10, 12]),
        startDate: '2025-01-01T00:00:00.000Z'
      },
      investmentAssets: {
        civilWorks: remodeling,
        laborCost: 0,
        materials: 0,
        licenses: legal,
        furniture: r.int(2, 10) * 1000000,
        cash: workingCap,
        bank: 0,
        inventory: 0,
        fixedAssets: [{ name: 'Propiedad inmueble', value: propertyValue, usefulLife: 40, description: '' }],
        customFields: []
      },
      financing: buildFinancing(totalInvest, r, 0.70),
      income: { periodsPerYear: 12, items, scenarios: [] },
      expenses
    }
  };
}

module.exports = { generateFincaRaizCase };
