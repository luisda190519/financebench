'use strict';
const { seededRandom, round2, makeId, buildFinancing } = require('../utils');

const NAMES = [
  'TiendaOnline.co', 'Compra Fácil', 'E-Market Colombia', 'Digital Shop', 'Click & Buy',
  'MercaDigital', 'ShopLatam', 'Venta Directa Online', 'E-Commerce Andes', 'MiTienda.co'
];

const CATEGORIES = [
  { name: 'Ropa y moda',         priceMin: 30000, priceMax: 150000, costPct: 0.55, qtyMin: 50,  qtyMax: 500,  periods: 12 },
  { name: 'Electrónica',         priceMin: 80000, priceMax: 500000, costPct: 0.68, qtyMin: 20,  qtyMax: 200,  periods: 12 },
  { name: 'Salud y belleza',     priceMin: 15000, priceMax: 80000,  costPct: 0.45, qtyMin: 80,  qtyMax: 600,  periods: 12 },
  { name: 'Hogar y decoración',  priceMin: 20000, priceMax: 120000, costPct: 0.50, qtyMin: 30,  qtyMax: 300,  periods: 12 },
  { name: 'Deportes y fitness',  priceMin: 25000, priceMax: 200000, costPct: 0.52, qtyMin: 20,  qtyMax: 200,  periods: 12 },
];

function generateEcommerceCase(difficulty, seed) {
  const r = seededRandom(seed);
  const projectLife = r.int(3, 6);

  const website    = r.int(3, [10, 25, 50][difficulty]) * 1000000;
  const inventory  = r.int(5, [20, 60, 150][difficulty]) * 1000000;
  const logistics  = r.int(2, [8, 20, 40][difficulty]) * 1000000;
  const workingCap = r.int(3, 10) * 1000000;
  const totalInvest = website + inventory + logistics + workingCap;

  const catCount = [2, 3, 5][difficulty];
  const items = CATEGORIES.slice(0, catCount).map((cat, i) => {
    const basePrice = r.int(cat.priceMin, cat.priceMax);
    const unitCost  = Math.round(basePrice * cat.costPct);
    const baseQty   = r.int(cat.qtyMin, cat.qtyMax);
    const growthRate = round2(r.float(0.05, 0.20));

    return {
      id: makeId('cat', i + 1),
      name: cat.name,
      type: 'product',
      category: 'ecommerce',
      growthRate,
      periodsPerYear: cat.periods,
      scenarios: {
        optimista:  { sellingPrice: basePrice, unitCost, quantity: Math.round(baseQty * 1.4),  discount: 0 },
        normal:     { sellingPrice: basePrice, unitCost, quantity: baseQty,                    discount: 0 },
        pesimista:  { sellingPrice: Math.round(basePrice * 0.90), unitCost, quantity: Math.round(baseQty * 0.60), discount: 0 },
        controlado: { sellingPrice: basePrice, unitCost, quantity: Math.round(baseQty * 0.82), discount: 0 }
      }
    };
  });

  const expenses = {
    items: [
      { name: 'Plataforma e-commerce', amount: r.int(300000, 1500000), type: 'fijo', frequency: 'monthly', category: 'Tecnología', growthRate: 5, addedBy: 'user' },
      { name: 'Logística y envíos', amount: r.int(1, 8) * 1000000, type: 'variable', frequency: 'monthly', category: 'Operacional', growthRate: round2(r.float(8, 20)), addedBy: 'user' },
      { name: 'Marketing digital', amount: r.int(1, [5, 12, 25][difficulty]) * 1000000, type: 'variable', frequency: 'monthly', category: 'Ventas', growthRate: 10, addedBy: 'user' },
      { name: 'Nómina', amount: r.int(1, [4, 8, 15][difficulty]) * 1000000, type: 'fijo', frequency: 'monthly', category: 'Personal', growthRate: 5, addedBy: 'user' },
      ...(difficulty >= 1 ? [
        { name: 'Pasarela de pagos (comisiones)', amount: r.int(500000, 3000000), type: 'variable', frequency: 'monthly', category: 'Ventas', growthRate: 10, addedBy: 'user' }
      ] : []),
      ...(difficulty >= 2 ? [
        { name: 'Bodega y almacenamiento', amount: r.int(1, 5) * 1000000, type: 'fijo', frequency: 'monthly', category: 'Operacional', growthRate: 4, addedBy: 'user' },
        { name: 'Servicio al cliente', amount: r.int(500000, 2000000), type: 'fijo', frequency: 'monthly', category: 'Operacional', growthRate: 5, addedBy: 'user' }
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
        taxRate: r.pick([25, 30, 33]),
        discountRate: r.pick([12, 15]),
        startDate: '2025-01-01T00:00:00.000Z'
      },
      investmentAssets: {
        civilWorks: 0,
        laborCost: website,
        materials: 0,
        licenses: r.int(500000, 2000000),
        furniture: r.int(500000, 2000000),
        cash: workingCap,
        bank: 0,
        inventory,
        fixedAssets: [{ name: 'Equipo de logística', value: logistics, usefulLife: 5, description: '' }],
        customFields: []
      },
      financing: buildFinancing(totalInvest, r, 0.50),
      income: { periodsPerYear: 12, items, scenarios: [] },
      expenses
    }
  };
}

module.exports = { generateEcommerceCase };
