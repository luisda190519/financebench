'use strict';
const { seededRandom, round2, makeId, buildFinancing } = require('../utils');

const NAMES = [
  'Constructora El Futuro', 'Obras y Proyectos SAS', 'Ingeniería Andina', 'BuildCo Colombia',
  'Construcciones del Valle', 'Edificadora Central', 'Proyectos y Soluciones', 'Arquitectura Moderna'
];

function generateConstruccionCase(difficulty, seed) {
  const r = seededRandom(seed);
  const projectLife = r.int(2, 5);

  // Construction: heavy equipment + materials
  const equipment  = r.int(20, [80, 200, 500][difficulty]) * 1000000;
  const tools      = r.int(5, [20, 50, 100][difficulty]) * 1000000;
  const workingCap = r.int(10, 30) * 1000000;
  const totalInvest = equipment + tools + workingCap;

  // Revenue: contracts per year (1–4 projects/year, sold as periodic income)
  const contractCount = [1, 2, 3][difficulty];
  const CONTRACT_TYPES = [
    { name: 'Contrato residencial', priceMin: 50, priceMax: 200, qtyMin: 1, qtyMax: 3 },
    { name: 'Contrato comercial',   priceMin: 150, priceMax: 600, qtyMin: 1, qtyMax: 2 },
    { name: 'Contrato industrial',  priceMin: 300, priceMax: 1000, qtyMin: 1, qtyMax: 1 },
  ];

  const items = CONTRACT_TYPES.slice(0, contractCount).map((ct, i) => {
    const basePrice = r.int(ct.priceMin, ct.priceMax) * 1000000;
    const unitCost  = Math.round(basePrice * r.float(0.55, 0.70)); // 55-70% COGS
    const baseQty   = r.int(ct.qtyMin, ct.qtyMax);
    const growthRate = round2(r.float(0.02, 0.06));

    return {
      id: makeId('contract', i + 1),
      name: ct.name,
      type: 'service',
      category: 'construction',
      growthRate,
      periodsPerYear: 4, // quarterly
      scenarios: {
        optimista:  { sellingPrice: Math.round(basePrice * 1.1), unitCost, quantity: Math.min(ct.qtyMax, baseQty + 1), discount: 0 },
        normal:     { sellingPrice: basePrice, unitCost, quantity: baseQty, discount: 0 },
        pesimista:  { sellingPrice: Math.round(basePrice * 0.88), unitCost, quantity: Math.max(1, baseQty - 1), discount: 0 },
        controlado: { sellingPrice: basePrice, unitCost, quantity: baseQty, discount: 0 }
      }
    };
  });

  const staffSalary = r.int(5, [15, 30, 60][difficulty]) * 1000000;

  const expenses = {
    items: [
      { name: 'Nómina operativa', amount: staffSalary, type: 'fijo', frequency: 'monthly', category: 'Personal', growthRate: round2(r.float(3, 6)), addedBy: 'user' },
      { name: 'Mantenimiento equipos', amount: r.int(500000, 3000000), type: 'fijo', frequency: 'monthly', category: 'Operacional', growthRate: 4, addedBy: 'user' },
      { name: 'Seguros', amount: r.int(1, 5) * 1000000, type: 'fijo', frequency: 'annual', category: 'Administrativo', growthRate: 3, addedBy: 'user' },
      ...(difficulty >= 1 ? [
        { name: 'Combustibles', amount: r.int(1, 4) * 1000000, type: 'variable', frequency: 'monthly', category: 'Operacional', growthRate: 5, addedBy: 'user' }
      ] : []),
      ...(difficulty >= 2 ? [
        { name: 'Alquiler equipos especiales', amount: r.int(2, 8) * 1000000, type: 'variable', frequency: 'monthly', category: 'Operacional', growthRate: 5, addedBy: 'user' },
        { name: 'Oficina administrativa', amount: r.int(1, 4) * 1000000, type: 'fijo', frequency: 'monthly', category: 'Operacional', growthRate: 3, addedBy: 'user' }
      ] : [])
    ]
  };

  return {
    inputs: {
      general: {
        projectName: r.pick(NAMES),
        projectType: 'construction',
        projectLife,
        projectLifeUnit: 'años',
        currency: 'COP',
        taxRate: r.pick([25, 30, 33]),
        discountRate: r.pick([12, 15, 18]),
        startDate: '2025-01-01T00:00:00.000Z'
      },
      investmentAssets: {
        civilWorks: r.int(2, 10) * 1000000,
        laborCost: 0,
        materials: 0,
        licenses: r.int(1, 5) * 1000000,
        furniture: r.int(1, 3) * 1000000,
        cash: workingCap,
        bank: 0,
        inventory: 0,
        fixedAssets: [
          { name: 'Maquinaria pesada', value: equipment, usefulLife: 10, description: '' },
          { name: 'Herramientas y equipos', value: tools, usefulLife: 5, description: '' }
        ],
        customFields: []
      },
      financing: buildFinancing(totalInvest, r, 0.70),
      income: { periodsPerYear: 4, items, scenarios: [] },
      expenses
    }
  };
}

module.exports = { generateConstruccionCase };
