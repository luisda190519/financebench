'use strict';
const { seededRandom, round2, makeId, buildFinancing } = require('../utils');

const NAMES = [
  'Consultoría Estratégica', 'Tech Advisors SAS', 'Gestión & Talento', 'Soluciones Empresariales',
  'BizConsult Colombia', 'Expert Partners', 'Advisory Hub', 'Consulting Pro'
];

function generateConsultoriaCase(difficulty, seed) {
  const r = seededRandom(seed);
  const projectLife = r.int(3, 6);

  // Very low investment for consulting
  const equipos     = r.int(3, [8, 20, 40][difficulty]) * 1000000;
  const licencias   = r.int(500000, 3000000);
  const workingCap  = r.int(2, 8) * 1000000;
  const totalInvest = equipos + licencias + workingCap;

  const SERVICE_TYPES = [
    { name: 'Consultoría gerencial',      priceMin: 2000000, priceMax: 8000000,  costPct: 0.25, qtyMin: 2,  qtyMax: 8,  periods: 12 },
    { name: 'Auditoría financiera',       priceMin: 3000000, priceMax: 12000000, costPct: 0.28, qtyMin: 1,  qtyMax: 5,  periods: 12 },
    { name: 'Capacitación corporativa',   priceMin: 500000,  priceMax: 3000000,  costPct: 0.20, qtyMin: 4,  qtyMax: 20, periods: 12 },
    { name: 'Diagnóstico organizacional', priceMin: 1500000, priceMax: 6000000,  costPct: 0.22, qtyMin: 2,  qtyMax: 10, periods: 12 },
  ];

  const serviceCount = [1, 2, 3][difficulty];
  const items = SERVICE_TYPES.slice(0, serviceCount).map((st, i) => {
    const basePrice = r.int(st.priceMin, st.priceMax);
    const unitCost  = Math.round(basePrice * st.costPct);
    const baseQty   = r.int(st.qtyMin, st.qtyMax);
    const growthRate = round2(r.float(0.04, 0.12));

    return {
      id: makeId('svc', i + 1),
      name: st.name,
      type: 'service',
      category: 'consulting',
      growthRate,
      periodsPerYear: st.periods,
      scenarios: {
        optimista:  { sellingPrice: Math.round(basePrice * 1.15), unitCost, quantity: Math.round(baseQty * 1.5),  discount: 0 },
        normal:     { sellingPrice: basePrice,                    unitCost, quantity: baseQty,                    discount: 0 },
        pesimista:  { sellingPrice: Math.round(basePrice * 0.85), unitCost, quantity: Math.round(baseQty * 0.55), discount: 0 },
        controlado: { sellingPrice: basePrice,                    unitCost, quantity: Math.round(baseQty * 0.80), discount: 0 }
      }
    };
  });

  const staffSalary = r.int(3, [8, 18, 35][difficulty]) * 1000000;

  const expenses = {
    items: [
      { name: 'Equipo consultor', amount: staffSalary, type: 'fijo', frequency: 'monthly', category: 'Personal', growthRate: round2(r.float(4, 8)), addedBy: 'user' },
      { name: 'Oficina',          amount: r.int(500000, 3000000), type: 'fijo', frequency: 'monthly', category: 'Operacional', growthRate: 3, addedBy: 'user' },
      { name: 'Software profesional', amount: r.int(200000, 1000000), type: 'fijo', frequency: 'monthly', category: 'Tecnología', growthRate: 5, addedBy: 'user' },
      ...(difficulty >= 1 ? [
        { name: 'Marketing y BD', amount: r.int(500000, 2000000), type: 'variable', frequency: 'monthly', category: 'Ventas', growthRate: 8, addedBy: 'user' }
      ] : []),
      ...(difficulty >= 2 ? [
        { name: 'Viajes y viáticos', amount: r.int(500000, 2000000), type: 'variable', frequency: 'monthly', category: 'Operacional', growthRate: 5, addedBy: 'user' },
        { name: 'Suscripciones de datos', amount: r.int(300000, 800000), type: 'fijo', frequency: 'monthly', category: 'Tecnología', growthRate: 5, addedBy: 'user' }
      ] : [])
    ]
  };

  return {
    inputs: {
      general: {
        projectName: r.pick(NAMES),
        projectType: 'services',
        projectLife,
        projectLifeUnit: 'años',
        currency: 'COP',
        taxRate: r.pick([25, 30, 33]),
        discountRate: r.pick([12, 15, 18]),
        startDate: '2025-01-01T00:00:00.000Z'
      },
      investmentAssets: {
        civilWorks: 0,
        laborCost: 0,
        materials: 0,
        licenses: licencias,
        furniture: r.int(500000, 3000000),
        cash: workingCap,
        bank: 0,
        inventory: 0,
        fixedAssets: [{ name: 'Equipos de cómputo', value: equipos, usefulLife: 3, description: '' }],
        customFields: []
      },
      financing: buildFinancing(totalInvest, r, 0.30),
      income: { periodsPerYear: 12, items, scenarios: [] },
      expenses
    }
  };
}

module.exports = { generateConsultoriaCase };
