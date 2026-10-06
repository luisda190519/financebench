'use strict';
// benchmark/generator/utils.js
// Deterministic random utilities for reproducible dataset generation.

/**
 * Mulberry32 — fast, deterministic seeded PRNG (no external dependencies).
 * Given the same seed, always produces the same sequence.
 */
function mulberry32(seed) {
  let s = seed;
  return function () {
    s |= 0;
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), s | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Returns a helper object with typed random methods, all driven by the given seed.
 */
function seededRandom(seed) {
  const rand = mulberry32(seed);
  return {
    next: rand,
    /** Float in [min, max) */
    float: (min, max) => min + rand() * (max - min),
    /** Integer in [min, max] inclusive */
    int: (min, max) => Math.floor(min + rand() * (max - min + 1)),
    /** Boolean with given probability of true (default 0.5) */
    bool: (prob = 0.5) => rand() < prob,
    /** Pick one element uniformly */
    pick: (arr) => arr[Math.floor(rand() * arr.length)],
    /** Pick one element according to weight array */
    weightedPick: (arr, weights) => {
      const total = weights.reduce((a, b) => a + b, 0);
      let r = rand() * total;
      for (let i = 0; i < arr.length; i++) {
        r -= weights[i];
        if (r <= 0) return arr[i];
      }
      return arr[arr.length - 1];
    }
  };
}

/** Round to 2 decimal places */
function round2(n) {
  return Math.round(n * 100) / 100;
}

/** Generate a simple id string (not UUID — deterministic from generator context) */
function makeId(prefix, index) {
  return `${prefix}_${index}`;
}

/**
 * Build a standard financing block for a given total investment amount.
 * Debt ratio is randomly chosen within [0, maxDebtRatio].
 */
function buildFinancing(totalInvestment, r, maxDebtRatio = 0.7) {
  const debtRatio = round2(r.float(0, maxDebtRatio));
  const debtAmount = Math.round(totalInvestment * debtRatio);
  const equityAmount = totalInvestment - debtAmount;

  const BANK_NAMES = ['Banco Bogotá', 'Bancolombia', 'Davivienda', 'BBVA Colombia', 'Banco de Occidente', 'Finagro'];
  const PARTNER_NAMES = ['Socio Principal', 'Inversionista Ángel', 'Capital Fundador', 'Socio Estratégico'];

  const partners = [{
    name: r.pick(PARTNER_NAMES),
    contribution: equityAmount
  }];

  const customSources = debtAmount > 0 ? [{
    id: 'cs_1',
    name: r.pick(BANK_NAMES),
    amount: debtAmount,
    type: 'debt',
    interestRate: round2(r.float(0.12, 0.28)),
    termMonths: r.pick([24, 36, 48, 60]),
    addedBy: 'user'
  }] : [];

  return {
    partners,
    customSources,
    externalLoan: 0,
    interestRate: 18,
    loanTermMonths: 36,
    bankFinancingConfirmed: debtAmount > 0
  };
}

module.exports = { seededRandom, round2, makeId, buildFinancing };
