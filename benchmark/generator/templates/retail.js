'use strict';
const { seededRandom, round2, makeId, buildFinancing } = require('../utils');

const NAMES = [
  'Tienda Moda Hoy', 'Almacén El Sol', 'Boutique Central', 'Distribuidora La Esperanza',
  'Comercial Andino', 'Punto de Venta Express', 'Tienda Moderna', 'El Buen Precio',
  'Mercado Fresco', 'Almacén Superior'
];

const PRODUCT_LINES = [
  { name: 'Ropa casual',       priceMin: 30000, priceMax: 120000, costPct: 0.52, qtyMin: 20, qtyMax: 100, periods: 12 },
  { name: 'Calzado',           priceMin: 60000, priceMax: 200000, costPct: 0.55, qtyMin: 15, qtyMax: 60,  periods: 12 },
  { name: 'Accesorios',        priceMin: 10000, priceMax: 50000,  costPct: 0.45, qtyMin: 30, qtyMax: 120, periods: 12 },
  { name: 'Electrodomésticos', priceMin: 200000, priceMax: 800000, costPct: 0.65, qtyMin: 5,  qtyMax: 25,  periods: 12 },
  { name: 'Belleza y cuidado', priceMin: 15000, priceMax: 60000,  costPct: 0.48, qtyMin: 30, qtyMax: 100, periods: 12 },
];

function generateRetailCase(difficulty, seed) {
  const r = seededRandom(seed);
  const projectLife = r.int(3, 6);

  const localCost   = r.int(10, [30, 60, 100][difficulty]) * 1000000;
  const inventory   = r.int(10, [30, 70, 150][difficulty]) * 1000000;
  const furniture   = r.int(5, [15, 30, 50][difficulty]) * 1000000;
  const workingCap  = r.int(5, 15) * 1000000;
  const totalInvest = localCost + inventory + furniture + workingCap;

  const lineCount = [2, 3, 5][difficulty];
  const items = PRODUCT_LINES.slice(0, lineCount).map((pl, i) => {
    const basePrice = r.int(pl.priceMin, pl.priceMax);
    const unitCost  = Math.round(basePrice * pl.costPct);
    const baseQty   = r.int(pl.qtyMin, pl.qtyMax);
    const growthRate = round2(r.float(0.02, 0.07));

    return {
      id: makeId('prod', i + 1),
      name: pl.name,
      type: 'product',
      category: 'retail',
      growthRate,
      periodsPerYear: pl.periods,
      scenarios: {
        optimista:  { sellingPrice: basePrice, unitCost, quantity: Math.round(baseQty * 1.25), discount: 0 },
        normal:     { sellingPrice: basePrice, unitCost, quantity: baseQty,                    discount: 0 },
        pesimista:  { sellingPrice: Math.round(basePrice * 0.92), unitCost, quantity: Math.round(baseQty * 0.7), discount: 0 },
        controlado: { sellingPrice: basePrice, unitCost, quantity: Math.round(baseQty * 0.85), discount: 0 }
      }
    };
  });

  const rent     = r.int(3, [8, 15, 25][difficulty]) * 1000000;
  const salaries = r.int(2, [6, 12, 20][difficulty]) * 1000000;

  const expenses = {
    items: [
      { name: 'Arriendo local',    amount: rent,     type: 'fijo',    frequency: 'monthly', category: 'Operacional', growthRate: 4, addedBy: 'user' },
      { name: 'Nómina vendedores', amount: salaries, type: 'fijo',    frequency: 'monthly', category: 'Personal',    growthRate: round2(r.float(3, 6)), addedBy: 'user' },
      { name: 'Servicios',         amount: r.int(300000, 700000), type: 'fijo', frequency: 'monthly', category: 'Operacional', growthRate: 4, addedBy: 'user' },
      ...(difficulty >= 1 ? [
        { name: 'Publicidad local', amount: r.int(300000, 1000000), type: 'variable', frequency: 'monthly', category: 'Ventas', growthRate: 5, addedBy: 'user' }
      ] : []),
      ...(difficulty >= 2 ? [
        { name: 'Seguridad',         amount: r.int(200000, 500000), type: 'fijo', frequency: 'monthly', category: 'Operacional', growthRate: 3, addedBy: 'user' },
        { name: 'Sistema POS / ERP', amount: r.int(100000, 400000), type: 'fijo', frequency: 'monthly', category: 'Tecnología',  growthRate: 0, addedBy: 'user' }
      ] : [])
    ]
  };

  return {
    inputs: {
      general: {
        projectName: r.pick(NAMES),
        projectType: 'retail',
        projectLife,
        projectLifeUnit: 'años',
        currency: 'COP',
        taxRate: r.pick([25, 30, 33]),
        discountRate: r.pick([10, 12, 15]),
        startDate: '2025-01-01T00:00:00.000Z'
      },
      investmentAssets: {
        civilWorks: localCost,
        laborCost: 0,
        materials: 0,
        licenses: r.int(500000, 1500000),
        furniture,
        cash: workingCap,
        bank: 0,
        inventory,
        fixedAssets: [{ name: 'Estantería metálica', value: r.int(2, 8) * 1000000, usefulLife: 7, description: '' }],
        customFields: []
      },
      financing: buildFinancing(totalInvest, r, 0.60),
      income: { periodsPerYear: 12, items, scenarios: [] },
      expenses
    }
  };
}

module.exports = { generateRetailCase };
