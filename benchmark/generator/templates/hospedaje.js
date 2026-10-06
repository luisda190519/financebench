'use strict';
const { seededRandom, round2, makeId, buildFinancing } = require('../utils');

const NAMES = [
  'Hotel Andino', 'Posada del Valle', 'Hostal Nómada', 'Suite Colonial', 'EcoLodge Colombia',
  'Casa Campestre Turismo', 'Boutique Hotel La Montaña', 'Cabaña del Sol'
];

function generateHospedajeCase(difficulty, seed) {
  const r = seededRandom(seed);
  const projectLife = r.int(5, 10);

  const building   = r.int(80, [200, 500, 1000][difficulty]) * 1000000;
  const furnishing = r.int(20, [60, 150, 300][difficulty]) * 1000000;
  const equipment  = r.int(10, [30, 80, 200][difficulty]) * 1000000;
  const workingCap = r.int(10, 30) * 1000000;
  const totalInvest = building + furnishing + equipment + workingCap;

  const roomTypes = [1, 2, 3][difficulty];
  const ROOM_TYPES = [
    { name: 'Habitación estándar', priceMin: 80000, priceMax: 200000, costPct: 0.35, rooms: [5, 20] },
    { name: 'Habitación deluxe',  priceMin: 150000, priceMax: 400000, costPct: 0.35, rooms: [2, 10] },
    { name: 'Suite ejecutiva',    priceMin: 300000, priceMax: 800000, costPct: 0.35, rooms: [1, 5] },
  ];

  // Hotel: occupancy × available rooms = quantity
  const items = ROOM_TYPES.slice(0, roomTypes).map((rt, i) => {
    const basePrice     = r.int(rt.priceMin, rt.priceMax);
    const unitCost      = Math.round(basePrice * rt.costPct);
    const roomCount     = r.int(rt.rooms[0], rt.rooms[1]);
    const occupancyNorm = r.float(0.55, 0.75);

    return {
      id: makeId('room', i + 1),
      name: rt.name,
      type: 'service',
      category: 'hospitality',
      growthRate: round2(r.float(0.03, 0.08)),
      periodsPerYear: 365,
      scenarios: {
        optimista:  { sellingPrice: Math.round(basePrice * 1.1), unitCost, quantity: Math.round(roomCount * 0.85), discount: 0 },
        normal:     { sellingPrice: basePrice, unitCost, quantity: Math.round(roomCount * occupancyNorm),           discount: 0 },
        pesimista:  { sellingPrice: Math.round(basePrice * 0.85), unitCost, quantity: Math.round(roomCount * 0.40), discount: 0 },
        controlado: { sellingPrice: basePrice, unitCost, quantity: Math.round(roomCount * 0.65),                   discount: 0 }
      }
    };
  });

  const staffSalary = r.int(5, [15, 35, 70][difficulty]) * 1000000;

  const expenses = {
    items: [
      { name: 'Nómina personal', amount: staffSalary, type: 'fijo', frequency: 'monthly', category: 'Personal', growthRate: round2(r.float(3, 6)), addedBy: 'user' },
      { name: 'Servicios públicos', amount: r.int(1, [5, 15, 35][difficulty]) * 1000000, type: 'fijo', frequency: 'monthly', category: 'Operacional', growthRate: 5, addedBy: 'user' },
      { name: 'Limpieza y lavandería', amount: r.int(500000, 3000000), type: 'variable', frequency: 'monthly', category: 'Operacional', growthRate: 4, addedBy: 'user' },
      { name: 'Mantenimiento hotel', amount: r.int(1, 8) * 1000000, type: 'fijo', frequency: 'monthly', category: 'Operacional', growthRate: 4, addedBy: 'user' },
      ...(difficulty >= 1 ? [
        { name: 'Marketing y OTAs (comisiones)', amount: r.int(1, 8) * 1000000, type: 'variable', frequency: 'monthly', category: 'Ventas', growthRate: 8, addedBy: 'user' }
      ] : []),
      ...(difficulty >= 2 ? [
        { name: 'Alimentos y bebidas (F&B)', amount: r.int(2, 10) * 1000000, type: 'variable', frequency: 'monthly', category: 'Operacional', growthRate: 5, addedBy: 'user' },
        { name: 'Seguros hoteleros', amount: r.int(1, 5) * 1000000, type: 'fijo', frequency: 'annual', category: 'Administrativo', growthRate: 3, addedBy: 'user' }
      ] : [])
    ]
  };

  return {
    inputs: {
      general: {
        projectName: r.pick(NAMES),
        projectType: 'hospitality',
        projectLife,
        projectLifeUnit: 'años',
        currency: 'COP',
        taxRate: r.pick([25, 30, 33]),
        discountRate: r.pick([12, 15]),
        startDate: '2025-01-01T00:00:00.000Z'
      },
      investmentAssets: {
        civilWorks: building,
        laborCost: 0,
        materials: 0,
        licenses: r.int(2, 10) * 1000000,
        furniture: furnishing,
        cash: workingCap,
        bank: 0,
        inventory: r.int(2, 8) * 1000000,
        fixedAssets: [{ name: 'Equipos hoteleros', value: equipment, usefulLife: 7, description: '' }],
        customFields: []
      },
      financing: buildFinancing(totalInvest, r, 0.65),
      income: { periodsPerYear: 365, items, scenarios: [] },
      expenses
    }
  };
}

module.exports = { generateHospedajeCase };
