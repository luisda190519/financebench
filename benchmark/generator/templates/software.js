'use strict';
const { seededRandom, round2, makeId, buildFinancing } = require('../utils');

const NAMES = [
  'AppSoluciones', 'TechLab Colombia', 'CloudPyme', 'DataSync Pro', 'SaaS Andino',
  'CodeCo', 'DigitalFlow', 'SoftBiz', 'NexaCloud', 'DevBridge'
];

function generateSoftwareCase(difficulty, seed) {
  const r = seededRandom(seed);
  const projectLife = r.int(3, 7);

  // Software/SaaS investment is mostly human capital + infra
  const devCost     = r.int(5, [20, 50, 100][difficulty]) * 1000000;
  const infra       = r.int(1, [5, 15, 30][difficulty]) * 1000000;
  const licenses    = r.int(500000, 3000000);
  const workingCap  = r.int(2, 8) * 1000000;
  const totalInvest = devCost + infra + licenses + workingCap;

  // Revenue: subscription tiers (monthly billing = periodsPerYear 12)
  const tierCount = [1, 2, 3][difficulty];
  const TIERS = [
    { name: 'Plan Básico',      priceMin: 50000,  priceMax: 150000,  qtyMin: 20, qtyMax: 200 },
    { name: 'Plan Profesional', priceMin: 150000, priceMax: 500000,  qtyMin: 5,  qtyMax: 80  },
    { name: 'Plan Empresarial', priceMin: 500000, priceMax: 2000000, qtyMin: 1,  qtyMax: 20  },
  ];

  const items = TIERS.slice(0, tierCount).map((tier, i) => {
    const basePrice = r.int(tier.priceMin, tier.priceMax);
    const unitCost  = Math.round(basePrice * 0.12); // software COGS ~12%
    const baseQty   = r.int(tier.qtyMin, tier.qtyMax);
    const growthRate = round2(r.float(0.08, 0.30));

    return {
      id: makeId('tier', i + 1),
      name: tier.name,
      type: 'service',
      category: 'subscription',
      growthRate,
      periodsPerYear: 12,
      scenarios: {
        optimista:  { sellingPrice: basePrice, unitCost, quantity: Math.round(baseQty * 1.4),  discount: 0 },
        normal:     { sellingPrice: basePrice, unitCost, quantity: baseQty,                    discount: 0 },
        pesimista:  { sellingPrice: basePrice, unitCost, quantity: Math.round(baseQty * 0.6),  discount: 0 },
        controlado: { sellingPrice: basePrice, unitCost, quantity: Math.round(baseQty * 0.85), discount: 0 }
      }
    };
  });

  const teamSalary   = r.int(4, [10, 20, 40][difficulty]) * 1000000;
  const hosting      = r.int(500000, 3000000);
  const tools        = r.int(300000, 1500000);

  const expenses = {
    items: [
      { name: 'Equipo de desarrollo', amount: teamSalary, type: 'fijo', frequency: 'monthly', category: 'Personal', growthRate: round2(r.float(4, 8)), addedBy: 'user' },
      { name: 'Hosting / infraestructura', amount: hosting, type: 'variable', frequency: 'monthly', category: 'Tecnología', growthRate: round2(r.float(5, 15)), addedBy: 'user' },
      { name: 'Herramientas SaaS', amount: tools, type: 'fijo', frequency: 'monthly', category: 'Tecnología', growthRate: 5, addedBy: 'user' },
      ...(difficulty >= 1 ? [
        { name: 'Marketing digital', amount: r.int(1, 5) * 1000000, type: 'variable', frequency: 'monthly', category: 'Ventas', growthRate: 10, addedBy: 'user' }
      ] : []),
      ...(difficulty >= 2 ? [
        { name: 'Soporte cliente', amount: r.int(1, 4) * 1000000, type: 'fijo', frequency: 'monthly', category: 'Operacional', growthRate: 5, addedBy: 'user' },
        { name: 'Legal & compliance', amount: r.int(500000, 2000000), type: 'fijo', frequency: 'quarterly', category: 'Administrativo', growthRate: 3, addedBy: 'user' }
      ] : [])
    ]
  };

  const fixedAssets = [
    { name: 'Equipos de cómputo', value: infra, usefulLife: 3, description: '' }
  ];

  return {
    inputs: {
      general: {
        projectName: r.pick(NAMES),
        projectType: 'software',
        projectLife,
        projectLifeUnit: 'años',
        currency: 'COP',
        taxRate: r.pick([25, 30, 33]),
        discountRate: r.pick([12, 15, 18]),
        startDate: '2025-01-01T00:00:00.000Z'
      },
      investmentAssets: {
        civilWorks: 0,
        laborCost: devCost,
        materials: 0,
        licenses,
        furniture: r.int(500000, 2000000),
        cash: workingCap,
        bank: 0,
        inventory: 0,
        fixedAssets,
        customFields: []
      },
      financing: buildFinancing(totalInvest, r, 0.40),
      income: { periodsPerYear: 12, items, scenarios: [] },
      expenses
    }
  };
}

module.exports = { generateSoftwareCase };
