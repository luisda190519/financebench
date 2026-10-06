const mongoose = require('mongoose');
const { irr, npv, paybackPeriod } = require('financial');

const assetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: Number, required: true, default: 0 },
  usefulLife: { type: Number, required: true, default: 5 },
  salvageValue: { type: Number, default: 0 }, // IAS 16.50: depreciable amount = cost − salvage
  description: { type: String, default: '' }
});

// Custom investment fields added by user or AI
const customInvestmentFieldSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  value: { type: Number, default: 0 },
  category: { type: String, default: 'other' },
  description: { type: String, default: '' },
  isDepreciable: { type: Boolean, default: false },
  usefulLife: { type: Number, default: 5 },
  addedBy: { type: String, enum: ['user', 'ai', 'catalog'], default: 'user' }
}, { _id: false });

const partnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contribution: { type: Number, required: true, default: 0 }
});

// Custom financing sources beyond partners + external loan
const customFinancingSourceSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  amount: { type: Number, default: 0 },
  type: { type: String, enum: ['equity', 'debt', 'grant', 'other'], default: 'other' },
  interestRate: { type: Number, default: 0 },
  termMonths: { type: Number, default: 0 },
  addedBy: { type: String, enum: ['user', 'ai', 'catalog'], default: 'user' }
}, { _id: false });

const incomeScenarioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'normal'
  },
  unitPrice: { type: Number, default: 0 },
  unitsPerPeriod: { type: Number, default: 0 },
  occupancyRate: { type: Number, default: 80, min: 0, max: 100 },
  growthRate: { type: Number, default: 5 },
  variableCostPerUnit: { type: Number, default: 0 },
  // Custom revenue streams per scenario
  customRevenueStreams: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    amount: { type: Number, default: 0 },
    type: { type: String, enum: ['recurring', 'one-time', 'seasonal'], default: 'recurring' },
    growthRate: { type: Number, default: 0 },
    addedBy: { type: String, enum: ['user', 'ai', 'catalog'], default: 'user' }
  }]
});

// New: per-scenario values for each income item
const incomeItemScenarioSchema = new mongoose.Schema({
  sellingPrice: { type: Number, default: 0 },
  unitCost:     { type: Number, default: 0 },
  quantity:     { type: Number, default: 0 },
  discount:     { type: Number, default: 0, min: 0, max: 100 }
}, { _id: false });

// New: individual product/service income items (Task 49)
const incomeItemSchema = new mongoose.Schema({
  id:             { type: String, required: true },
  name:           { type: String, required: true },
  type:           { type: String, enum: ['product', 'service'], default: 'product' },
  category:       { type: String, default: '' },
  growthRate:     { type: Number, default: 0 },
  periodsPerYear: { type: Number, default: 0 }, // 0 = use global income.periodsPerYear
  scenarios: {
    optimista:  { type: incomeItemScenarioSchema, default: () => ({}) },
    normal:     { type: incomeItemScenarioSchema, default: () => ({}) },
    pesimista:  { type: incomeItemScenarioSchema, default: () => ({}) },
    controlado: { type: incomeItemScenarioSchema, default: () => ({}) }
  },
  dailyBreakdown: {
    enabled:  { type: Boolean, default: false },
    schedule: { type: mongoose.Schema.Types.Mixed, default: () => ({}) }
  }
}, { _id: false });

const payrollItemSchema = new mongoose.Schema({
  id:           { type: String },
  title:        { type: String, required: true },
  salary:       { type: Number, default: 0 },
  count:        { type: Number, default: 1 },
  contractType: { type: String, default: 'indefinido' },
  factor:       { type: Number, default: 52 },
  bonuses:      { type: Number, default: 0 }
}, { _id: false });

const expenseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true, default: 0 },
  type: {
    type: String,
    enum: ['fijo', 'variable'],
    default: 'fijo'
  },
  frequency: {
    type: String,
    // All frequencies the frontend form can send
    enum: ['daily', 'weekdays', 'weekdays-holidays', 'weekends', 'holidays',
           'weekly', 'monthly', 'quarterly', 'annual', 'one-time'],
    default: 'monthly'
  },
  category: { type: String, default: 'Operacional' },
  unitCost:  { type: Number, default: 0 },
  quantity:  { type: Number, default: 0 },
  growthRate: { type: Number, default: 0 },
  addedBy: { type: String, enum: ['user', 'ai', 'catalog', 'payroll', 'suggested'], default: 'user' }
});

const annualDataSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  revenue: { type: Number, default: 0 },
  totalCOGS: { type: Number, default: 0 },        // Sum of item unitCost × qty (Task 49)
  grossProfit: { type: Number, default: 0 },       // revenue - totalCOGS
  grossMarginPct: { type: Number, default: 0 },    // grossProfit / revenue × 100
  fixedExpenses: { type: Number, default: 0 },
  variableExpenses: { type: Number, default: 0 },
  totalExpenses: { type: Number, default: 0 },
  ebitda: { type: Number, default: 0 },
  depreciation: { type: Number, default: 0 },
  operationalProfit: { type: Number, default: 0 },
  interestExpense: { type: Number, default: 0 },
  taxes: { type: Number, default: 0 },
  netProfit: { type: Number, default: 0 },
  unleveredCashFlow: { type: Number, default: 0 },
  leveredCashFlow: { type: Number, default: 0 }
}, { _id: false });

const scenarioResultSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    enum: ['optimista', 'normal', 'pesimista', 'controlado']
  },
  annualData: [annualDataSchema],
  breakEvenPoint: { type: Number, default: 0 },
  breakEvenType: { type: String, enum: ['units', 'revenue', 'none'], default: 'units' },
  paybackPeriod: { type: Number, default: null },
  npv: { type: Number, default: 0 },
  irr: { type: Number, default: null }
}, { _id: false });

const chatMessageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  fieldUpdates: { type: mongoose.Schema.Types.Mixed, default: null },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

// ── Execution Intelligence Module Sub-schemas ─────────────────────────────────

const actualExpenseLineSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  amount:   { type: Number, default: 0 },
  category: { type: String, default: 'Operacional' }
}, { _id: false });

const monthlyRecordSchema = new mongoose.Schema({
  year:               { type: Number, required: true },
  month:              { type: Number, required: true, min: 1, max: 12 },
  actualRevenue:      { type: Number, default: 0 },
  actualExpenses:     { type: Number, default: 0 },
  expenseLines:       [actualExpenseLineSchema],
  projectedRevenue:   { type: Number, default: 0 },
  projectedExpenses:  { type: Number, default: 0 },
  revenueVariancePct: { type: Number, default: 0 },
  expenseVariancePct: { type: Number, default: 0 },
  netProfit:          { type: Number, default: 0 },
  status:             { type: String, enum: ['on_track', 'warning', 'critical'], default: 'on_track' },
  notes:              { type: String, default: '' },
  enteredAt:          { type: Date, default: Date.now }
}, { _id: false });

const cachedInsightSchema = new mongoose.Schema({
  year:             { type: Number, required: true },
  month:            { type: Number, required: true },
  content:          { type: String, required: true },
  fieldUpdates:     { type: mongoose.Schema.Types.Mixed, default: null },
  newFields:        { type: mongoose.Schema.Types.Mixed, default: null },
  viabilityPlan:    { type: mongoose.Schema.Types.Mixed, default: null },
  generatedAt:      { type: Date, default: Date.now },
  promptTokens:     { type: Number, default: 0 },
  completionTokens: { type: Number, default: 0 }
}, { _id: false });

const monthlyProjectionSchema = new mongoose.Schema({
  year:               { type: Number, required: true },
  month:              { type: Number, required: true },
  projectedRevenue:   { type: Number, default: 0 },
  projectedExpenses:  { type: Number, default: 0 },
  projectedNetProfit: { type: Number, default: 0 }
}, { _id: false });

const executionDataSchema = new mongoose.Schema({
  isLaunched:         { type: Boolean, default: false },
  launchedAt:         { type: Date, default: null },
  launchScenario:     { type: String, enum: ['optimista', 'normal', 'pesimista', 'controlado'], default: 'normal' },
  monthlyProjections: [monthlyProjectionSchema],
  monthlyRecords:     [monthlyRecordSchema],
  cachedInsights:     [cachedInsightSchema],
  cachedTimelineInsight: {
    content:          { type: String,  default: null },
    fieldUpdates:     { type: mongoose.Schema.Types.Mixed, default: null },
    newFields:        { type: mongoose.Schema.Types.Mixed, default: null },
    viabilityPlan:    { type: mongoose.Schema.Types.Mixed, default: null },
    generatedAt:      { type: Date,    default: null },
    recordsSnapshot:  { type: Number,  default: 0 },
    promptTokens:     { type: Number,  default: 0 },
    completionTokens: { type: Number,  default: 0 }
  },
  aiCallsThisMonth:   { type: Number, default: 0 },
  aiCallsResetDate:   { type: Date, default: null },
  totalAiCostUsd:     { type: Number, default: 0 }
}, { _id: false });

// ─────────────────────────────────────────────────────────────────────────────

const projectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  general: {
    projectName: { type: String, default: 'Nuevo Proyecto' },
    projectDescription: { type: String, default: '', maxlength: 500 },
    projectType: {
      type: String,
      enum: ['general', 'software', 'retail', 'services', 'construction', 'manufacturing', 'hospitality', 'agriculture', 'restaurant'],
      default: 'general'
    },
    projectLife: { type: Number, default: 5 },
    projectLifeUnit: { 
      type: String, 
      enum: ['años', 'meses'], 
      default: 'años' 
    },
    taxRate: { type: Number, default: 35 }, // Art. 240 ET, Ley 2155/2021 (vigente 2022–presente)
    discountRate: { type: Number, default: 10 },
    currency: { type: String, default: 'COP' }
  },
  investmentAssets: {
    initialInvestment: { type: Number, default: 0 },
    civilWorks: { type: Number, default: 0 },
    laborCost: { type: Number, default: 0 },
    materials: { type: Number, default: 0 },
    licenses: { type: Number, default: 0 },
    furniture: { type: Number, default: 0 },
    cash: { type: Number, default: 0 },
    bank: { type: Number, default: 0 },
    inventory: { type: Number, default: 0 },
    fixedAssets: [assetSchema],
    customFields: [customInvestmentFieldSchema]
  },
  financing: {
    partners: [partnerSchema],
    customSources: [customFinancingSourceSchema],
    externalLoan: { type: Number, default: 0 },
    interestRate: { type: Number, default: 10 },
    loanTermMonths: { type: Number, default: 48 },
    bankFinancingConfirmed: { type: Boolean, default: false }
  },
  income: {
    scenarios: [incomeScenarioSchema],   // kept for backward compatibility
    items: [incomeItemSchema],            // new product/service items (Task 49)
    periodsPerYear: { type: Number, default: 12 },
    scenarioMultipliers: { type: mongoose.Schema.Types.Mixed, default: () => ({ normal: 0.75, controlado: 0.60, pesimista: 0.45 }) }
  },
  expenses: {
    items:   [expenseSchema],
    payroll: [payrollItemSchema]
  },
  financialMetrics: {
    scenarios: [scenarioResultSchema],
    lastCalculated: { type: Date, default: null }
  },
  chatHistory: {
    messages: [chatMessageSchema],
    lastInteraction: { type: Date, default: null }
  },
  aiConclusions: {
    text:         { type: String, default: '' },
    scenarioName: { type: String, default: '' },
    generatedAt:  { type: Date, default: null }
  },
  // Benchmark comparison data (populated when importing Complete JSON with analysis)
  benchmarkComparison: {
    hasComparison: { type: Boolean, default: false },
    importedAt:    { type: Date, default: null },
    summary: {
      totalFields:       { type: Number },
      exactMatches:      { type: Number },
      smallDifferences:  { type: Number },
      largeDifferences:  { type: Number },
      notApplicable:     { type: Number },
      avgErrorPercent:   { type: Number },
      overallAccuracy:   { type: Number }
    },
    by_section: { type: mongoose.Schema.Types.Mixed }
  },
  executionData: {
    type: executionDataSchema,
    default: () => ({
      isLaunched: false,
      launchedAt: null,
      launchScenario: 'normal',
      monthlyProjections: [],
      monthlyRecords: [],
      cachedInsights: [],
      aiCallsThisMonth: 0,
      aiCallsResetDate: null,
      totalAiCostUsd: 0
    })
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate total investment before saving
projectSchema.pre('save', function(next) {
  const inv = this.investmentAssets || {};

  // Calculate fixed assets total (handle null/undefined arrays)
  const fixedAssetsTotal = (inv.fixedAssets || []).reduce(
    (sum, asset) => sum + (parseFloat(asset.value) || 0), 0
  );

  // Calculate custom fields total
  const customFieldsTotal = (inv.customFields || []).reduce(
    (sum, field) => sum + (parseFloat(field.value) || 0), 0
  );

  // Calculate total investment (handle null/undefined values)
  this.investmentAssets.initialInvestment =
    (parseFloat(inv.civilWorks) || 0) +
    (parseFloat(inv.laborCost) || 0) +
    (parseFloat(inv.materials) || 0) +
    (parseFloat(inv.licenses) || 0) +
    (parseFloat(inv.furniture) || 0) +
    (parseFloat(inv.cash) || 0) +
    (parseFloat(inv.bank) || 0) +
    (parseFloat(inv.inventory) || 0) +
    fixedAssetsTotal +
    customFieldsTotal;

  // Calculate external loan needed
  const partnersTotal = (this.financing.partners || []).reduce(
    (sum, partner) => sum + (parseFloat(partner.contribution) || 0), 0
  );

  // Include custom financing sources in own capital
  const customSourcesTotal = (this.financing.customSources || []).reduce(
    (sum, source) => sum + (parseFloat(source.amount) || 0), 0
  );

  this.financing.externalLoan = Math.max(
    0,
    this.investmentAssets.initialInvestment - partnersTotal - customSourcesTotal
  );

  next();
});

// FIXED: Enhanced calculation method with corrected logic
projectSchema.methods.calculateMetrics = function() {
  try {
    const project = this;
    const projectLife = parseInt(project.general.projectLife) || 5;
    const taxRate = (parseFloat(project.general.taxRate) || 35) / 100;
    const discountRate = (parseFloat(project.general.discountRate) || 10) / 100;
    
    // Recalculate initial investment to ensure accuracy
    const calculateInitialInvestment = () => {
      const inv = project.investmentAssets || {};
      const fixedAssetsTotal = (inv.fixedAssets || []).reduce(
        (sum, asset) => sum + (parseFloat(asset.value) || 0), 0
      );
      const customFieldsTotal = (inv.customFields || []).reduce(
        (sum, field) => sum + (parseFloat(field.value) || 0), 0
      );
      return (
        (parseFloat(inv.civilWorks) || 0) +
        (parseFloat(inv.laborCost) || 0) +
        (parseFloat(inv.materials) || 0) +
        (parseFloat(inv.licenses) || 0) +
        (parseFloat(inv.furniture) || 0) +
        (parseFloat(inv.cash) || 0) +
        (parseFloat(inv.bank) || 0) +
        (parseFloat(inv.inventory) || 0) +
        fixedAssetsTotal +
        customFieldsTotal
      );
    };
    
    const initialInvestment = calculateInitialInvestment();
    // F-01.2: write back the authoritative value so stored field stays in sync
    if (project.investmentAssets) {
      project.investmentAssets.initialInvestment = initialInvestment;
    }

    // Calculate financing
    const partnersTotal = (project.financing.partners || []).reduce(
      (sum, partner) => sum + (parseFloat(partner.contribution) || 0), 0
    );

    // All custom sources reduce the financing gap (regardless of type)
    const customSourcesTotal = (project.financing.customSources || []).reduce(
      (sum, source) => sum + (parseFloat(source.amount) || 0), 0
    );

    const externalLoan = Math.max(0, initialInvestment - partnersTotal - customSourcesTotal);

    // Loan amortization — supports multiple debt sources with individual rates/terms
    const calculateLoanPayments = () => {
      const interestByYear = {};
      const principalByYear = {};

      for (let year = 0; year < projectLife; year++) {
        interestByYear[year] = 0;
        principalByYear[year] = 0;
      }

      // Amortize a single loan and accumulate interest/principal into per-year maps
      const amortize = (principal, annualRate, termMonths) => {
        if (principal <= 0 || termMonths <= 0) return;
        const monthlyRate = annualRate / 100 / 12; // = 0 for zero-interest loans

        let monthlyPayment;
        if (monthlyRate === 0) {
          monthlyPayment = principal / termMonths; // equal principal installments
        } else {
          monthlyPayment = principal *
            (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
            (Math.pow(1 + monthlyRate, termMonths) - 1);
        }
        let balance = principal;
        for (let month = 0; month < termMonths && balance > 0; month++) {
          const year = Math.floor(month / 12);
          if (year >= projectLife) break;
          const interestPayment = balance * monthlyRate;
          const principalPayment = Math.min(monthlyPayment - interestPayment, balance);
          interestByYear[year] += interestPayment;
          principalByYear[year] += principalPayment;
          balance -= principalPayment;
        }
        // F-02.2: if the loan term exceeds the project horizon, the remaining balance
        // is a balloon (bullet) payment due at project end — treated as a terminal
        // cash outflow in the last project year.
        if (balance > 0.01) {
          principalByYear[projectLife - 1] = (principalByYear[projectLife - 1] || 0) + balance;
        }
      };

      // 1. Primary external loan (the auto-calculated financing gap)
      const loan = project.financing || {};
      amortize(externalLoan, parseFloat(loan.interestRate) || 0, parseInt(loan.loanTermMonths) || 0);

      // 2. Custom debt sources — each with its own rate and term
      (project.financing.customSources || [])
        .filter(s => s.type === 'debt')
        .forEach(s => amortize(
          parseFloat(s.amount) || 0,
          parseFloat(s.interestRate) || 0,
          parseInt(s.termMonths) || 0
        ));

      return { interestByYear, principalByYear };
    };
    
    const { interestByYear, principalByYear } = calculateLoanPayments();
    
    // FIXED: Depreciation calculation (includes custom depreciable fields)
    const calculateDepreciation = () => {
      const depreciationByYear = {};

      for (let year = 0; year < projectLife; year++) {
        depreciationByYear[year] = 0;
      }

      const salvageRecoveryByYear = {};
      for (let year = 0; year < projectLife; year++) salvageRecoveryByYear[year] = 0;

      // Depreciate fixed assets (IAS 16.50: depreciable amount = cost − salvage value)
      if (project.investmentAssets?.fixedAssets) {
        project.investmentAssets.fixedAssets.forEach(asset => {
          const assetValue = parseFloat(asset.value) || 0;
          const salvage = Math.max(0, parseFloat(asset.salvageValue) || 0);
          const usefulLife = Math.max(1, parseInt(asset.usefulLife) || 1);

          if (assetValue > 0) {
            const depreciableAmount = Math.max(0, assetValue - salvage);
            const annualDepreciation = depreciableAmount / usefulLife;
            const depreciationYears = Math.min(usefulLife, projectLife);

            for (let year = 0; year < depreciationYears; year++) {
              depreciationByYear[year] += annualDepreciation;
            }

            // Salvage cash inflow at end of asset life (or end of project, whichever is first)
            if (salvage > 0) {
              salvageRecoveryByYear[depreciationYears - 1] += salvage;
            }
          }
        });
      }

      // Depreciate custom fields marked as depreciable (no salvage value in custom field schema)
      if (project.investmentAssets?.customFields) {
        project.investmentAssets.customFields.forEach(field => {
          if (field.isDepreciable) {
            const fieldValue = parseFloat(field.value) || 0;
            const usefulLife = Math.max(1, parseInt(field.usefulLife) || 5);

            if (fieldValue > 0) {
              const annualDepreciation = fieldValue / usefulLife;
              const depreciationYears = Math.min(usefulLife, projectLife);

              for (let year = 0; year < depreciationYears; year++) {
                depreciationByYear[year] += annualDepreciation;
              }
            }
          }
        });
      }

      return { depreciationByYear, salvageRecoveryByYear };
    };

    const { depreciationByYear, salvageRecoveryByYear } = calculateDepreciation();
    
    // Expenses calculation — supports frequency (monthly/quarterly/annual/one-time) and unitCost×qty
    const calculateExpenses = () => {
      const expensesByYear = {};

      for (let year = 0; year < projectLife; year++) {
        expensesByYear[year] = { fixed: 0, variable: 0 };
      }

      // Normalize expense amount to annual equivalent based on frequency (Task 50)
      const getAnnualAmount = (expense, yearIndex) => {
        // Prefer unitCost × quantity over flat amount when both are set
        const base = (expense.unitCost > 0 && expense.quantity > 0)
          ? (parseFloat(expense.unitCost) || 0) * (parseFloat(expense.quantity) || 0)
          : (parseFloat(expense.amount) || 0);

        if (base <= 0) return 0;

        const freq = expense.frequency || 'monthly'; // backward compat: default monthly

        if (freq === 'one-time') {
          return yearIndex === 0 ? base : 0; // no growth on one-time costs
        }

        const annualBase = (() => {
          const frequencyMap = {
            daily: 365, weekdays: 260, 'weekdays-holidays': 278, weekends: 104,
            holidays: 18, weekly: 52,
            monthly: 12, quarterly: 4, annual: 1
          };
          const multiplier = frequencyMap[freq];
          return multiplier !== undefined ? base * multiplier : base * 12;
        })();

        const growthRate = (parseFloat(expense.growthRate) || 0) / 100;
        return annualBase * Math.pow(1 + growthRate, yearIndex);
      };

      if (project.expenses?.items) {
        project.expenses.items.forEach(expense => {
          for (let year = 0; year < projectLife; year++) {
            const annualAmount = getAnnualAmount(expense, year);
            if (annualAmount > 0) {
              if (expense.type === 'fijo') {
                expensesByYear[year].fixed += annualAmount;
              } else {
                expensesByYear[year].variable += annualAmount;
              }
            }
          }
        });
      }

      return expensesByYear;
    };
    
    const expensesByYear = calculateExpenses();
    
    const scenarioResults = [];

    // Detect which income system to use:
    // - New (Task 49): income.items[] has entries  → product/service level tracking
    // - Old (backward compat): income.scenarios[] → single unitPrice × units × occupancy
    const useItemsSystem = (project.income.items || []).length > 0;

    // When using items, iterate over 4 fixed scenario names.
    // When using old system, iterate over income.scenarios[] as before.
    const scenariosToProcess = useItemsSystem
      ? ['optimista', 'normal', 'pesimista', 'controlado'].map(name => ({ name }))
      : (project.income.scenarios || []);

    // Process each scenario
    scenariosToProcess.forEach(scenario => {
      try {
        const annualData = [];
        let cumulativeCashFlow = -initialInvestment;
        let paybackPeriodResult = null;
        const cashFlows = [-initialInvestment];
        let taxLossCarryforward = 0;

        const globalPeriodsPerYear = parseInt(project.income.periodsPerYear) || 12;

        // Old system variables (only used when !useItemsSystem)
        const baseUnitsPerPeriod = parseFloat(scenario.unitsPerPeriod) || 0;
        const unitPrice = parseFloat(scenario.unitPrice) || 0;
        const variableCostPerUnit = parseFloat(scenario.variableCostPerUnit) || 0;
        const occupancyRate = Math.min(100, Math.max(0, parseFloat(scenario.occupancyRate) || 100)) / 100;
        const growthRate = (parseFloat(scenario.growthRate) || 0) / 100;

        // Break-even (unit-based only for old single-product system)
        let breakEvenPoint = 0;
        let breakEvenType = 'none';
        if (!useItemsSystem && unitPrice > variableCostPerUnit) {
          const contributionMarginPerUnit = unitPrice - variableCostPerUnit;
          const firstYearFixedCosts =
            (expensesByYear[0]?.fixed || 0) +
            (depreciationByYear[0] || 0) +
            (interestByYear[0] || 0);

          if (contributionMarginPerUnit > 0 && firstYearFixedCosts > 0) {
            breakEvenPoint = Math.ceil(firstYearFixedCosts / contributionMarginPerUnit);
            breakEvenType = 'units';
          }
        }

        // Calculate yearly data
        for (let year = 1; year <= projectLife; year++) {
          const yearIndex = year - 1;

          let revenue = 0;
          let totalCOGS = 0;

          if (useItemsSystem) {
            // NEW SYSTEM: aggregate revenue and COGS across all income items
            const scenarioMultipliers = project.income.scenarioMultipliers;
            const useMultipliers = !!scenarioMultipliers;
            const scenarioMult = (useMultipliers && scenario.name !== 'optimista')
              ? (scenarioMultipliers[scenario.name] ?? 1.0)
              : 1.0;

            (project.income.items || []).forEach(item => {
              const scenarioGrowthRate = (parseFloat(scenario.growthRate) || parseFloat(item.growthRate) || 0) / 100;
              const growthFactor = Math.pow(1 + scenarioGrowthRate, yearIndex);

              if (item.dailyBreakdown?.enabled) {
                // Daily schedule: sum (unitsPerDay × price) across active days × 52 weeks
                // scenarioMult scales quantity (units), price stays fixed (optimista values)
                const schedule = item.dailyBreakdown.schedule || {};
                let weeklyRev = 0, weeklyUnits = 0;
                Object.values(schedule).forEach(d => {
                  if (!d.enabled) return;
                  weeklyRev   += (parseFloat(d.unitsPerDay) || 0) * (parseFloat(d.price) || 0);
                  weeklyUnits += (parseFloat(d.unitsPerDay) || 0);
                });
                const unitCost = parseFloat(item.scenarios?.optimista?.unitCost) || 0;
                revenue    += weeklyRev   * 52 * growthFactor * scenarioMult;
                totalCOGS  += weeklyUnits * 52 * unitCost * growthFactor * scenarioMult;
              } else {
                // Scenario-based: price/cost/discount from optimista (or own slot), quantity scaled
                const baseSlot = (useMultipliers ? item.scenarios?.optimista : item.scenarios?.[scenario.name]) || {};
                const sv = baseSlot;
                const sellingPrice = parseFloat(sv.sellingPrice) || 0;
                const unitCost = parseFloat(sv.unitCost) || 0;
                const quantity = (parseFloat(sv.quantity) || 0) * scenarioMult;
                const discount = Math.min(100, Math.max(0, parseFloat(sv.discount) || 0));
                const effectivePrice = sellingPrice * (1 - discount / 100);
                const itemPeriods = parseInt(item.periodsPerYear) || globalPeriodsPerYear;
                const annualQty = quantity * itemPeriods * growthFactor;
                revenue    += effectivePrice * annualQty;
                totalCOGS  += unitCost * annualQty;
              }
            });
          } else {
            // OLD SYSTEM: single unitPrice × unitsPerPeriod × occupancyRate
            if (unitPrice > 0 && baseUnitsPerPeriod > 0) {
              const unitsThisYear = baseUnitsPerPeriod * Math.pow(1 + growthRate, yearIndex);
              const effectiveUnits = unitsThisYear * occupancyRate;
              const totalUnitsPerYear = effectiveUnits * globalPeriodsPerYear;
              revenue = unitPrice * totalUnitsPerYear;
              totalCOGS = variableCostPerUnit * totalUnitsPerYear;
            }

            // Custom revenue streams (old system only)
            if (scenario.customRevenueStreams) {
              scenario.customRevenueStreams.forEach(stream => {
                const streamAmount = parseFloat(stream.amount) || 0;
                const streamGrowth = (parseFloat(stream.growthRate) || 0) / 100;
                if (streamAmount > 0) {
                  if (stream.type === 'one-time' && yearIndex === 0) {
                    revenue += streamAmount;
                  } else if (stream.type !== 'one-time') {
                    revenue += streamAmount * Math.pow(1 + streamGrowth, yearIndex);
                  }
                }
              });
            }
          }

          // Gross profit metrics (new fields — zero for old projects without items)
          const grossProfit = revenue - totalCOGS;
          const grossMarginPct = revenue > 0 ? (grossProfit / revenue) * 100 : 0;

          // Expense totals from expenses.items
          // totalCOGS (from items) acts as the variable cost of goods; other variable expenses are opex
          const itemVariableCosts = expensesByYear[yearIndex]?.variable || 0;
          const totalVariableExpenses = totalCOGS + itemVariableCosts;
          const fixedExpenses = expensesByYear[yearIndex]?.fixed || 0;
          const totalExpenses = fixedExpenses + totalVariableExpenses;

          const ebitda = revenue - totalExpenses;
          const depreciation = depreciationByYear[yearIndex] || 0;
          const operationalProfit = ebitda - depreciation;
          const interestExpense = interestByYear[yearIndex] || 0;
          const ebt = operationalProfit - interestExpense;

          // Tax calculation with loss carryforward (Colombian ET Art. 147 — unlimited carryforward)
          // Carryforward is applied ONLY against positive EBT; losses accumulate independently.
          let taxes = 0;
          let taxableEBT = ebt;

          if (taxableEBT > 0 && taxLossCarryforward > 0) {
            const relief = Math.min(taxableEBT, taxLossCarryforward);
            taxableEBT -= relief;
            taxLossCarryforward -= relief;
          }

          if (taxableEBT > 0) {
            taxes = taxableEBT * taxRate;
          } else if (ebt < 0) {
            // Only accumulate genuine loss years — not years where carryforward fully absorbed a profit
            taxLossCarryforward += Math.abs(ebt);
          }

          const netProfit = ebt - taxes;

          // Cash flow calculations
          const salvageRecovery = salvageRecoveryByYear[yearIndex] || 0;
          const unleveredCashFlow = operationalProfit + depreciation - taxes + salvageRecovery;
          const principalPayment = principalByYear[yearIndex] || 0;
          const leveredCashFlow = netProfit + depreciation - principalPayment + salvageRecovery;

          const roundedData = {
            year,
            revenue: Math.round(revenue * 100) / 100,
            totalCOGS: Math.round(totalCOGS * 100) / 100,
            grossProfit: Math.round(grossProfit * 100) / 100,
            grossMarginPct: Math.round(grossMarginPct * 100) / 100,
            fixedExpenses: Math.round(fixedExpenses * 100) / 100,
            variableExpenses: Math.round(totalVariableExpenses * 100) / 100,
            totalExpenses: Math.round(totalExpenses * 100) / 100,
            ebitda: Math.round(ebitda * 100) / 100,
            depreciation: Math.round(depreciation * 100) / 100,
            operationalProfit: Math.round(operationalProfit * 100) / 100,
            interestExpense: Math.round(interestExpense * 100) / 100,
            taxes: Math.round(taxes * 100) / 100,
            netProfit: Math.round(netProfit * 100) / 100,
            salvageRecovery: Math.round(salvageRecovery * 100) / 100,
            principalPayment: Math.round(principalPayment * 100) / 100,
            unleveredCashFlow: Math.round(unleveredCashFlow * 100) / 100,
            leveredCashFlow: Math.round(leveredCashFlow * 100) / 100
          };

          annualData.push(roundedData);

          // Payback period calculation
          const previousCumulative = cumulativeCashFlow;
          cumulativeCashFlow += leveredCashFlow;
          cashFlows.push(leveredCashFlow);

          if (paybackPeriodResult === null && cumulativeCashFlow >= 0 && previousCumulative < 0) {
            if (Math.abs(leveredCashFlow) > 0.01) {
              const fraction = Math.abs(previousCumulative) / leveredCashFlow;
              paybackPeriodResult = (year - 1) + fraction;
            } else {
              paybackPeriodResult = year;
            }
          }
        }

        // Revenue-based break-even (for items system and old-system fallback)
        // variableExpenses includes totalCOGS, so variable cost ratio is already correct
        if (breakEvenType === 'none' && annualData.length > 0) {
          const year1 = annualData[0];
          const revenue1 = year1.revenue || 0;
          const variable1 = year1.variableExpenses || 0;
          // F-13.1: Break-even uses EBIT basis (fixed costs + depreciation only).
          // Interest is excluded — break-even measures operating viability before financing costs.
          const fixedBase = (year1.fixedExpenses || 0) + (year1.depreciation || 0);

          if (revenue1 > 0 && variable1 < revenue1 && fixedBase > 0) {
            const variableCostRatio = variable1 / revenue1;
            const breakEvenRevenue = fixedBase / (1 - variableCostRatio);
            if (isFinite(breakEvenRevenue) && breakEvenRevenue > 0) {
              breakEvenPoint = breakEvenRevenue;
              breakEvenType = 'revenue';
            }
          }
        }

        // NPV and IRR both use levered (equity) cash flows for consistency.
        // cashFlows = [-initialInvestment, ...leveredCashFlows] — built above in the year loop.
        // discountRate is interpreted as the equity required return (ke).
        // NOTE: For non-conventional cash flows (multiple sign changes), there may be multiple IRRs.
        let npvResult = 0;
        let irrResult = null;

        try {
          npvResult = npv(discountRate, cashFlows);

          const hasPositiveCashFlow = cashFlows.slice(1).some(cf => cf > 0);
          const hasNegativeInitial = cashFlows[0] < 0;

          if (hasNegativeInitial && hasPositiveCashFlow) {
            try {
              irrResult = irr(cashFlows);

              if (isNaN(irrResult) || !isFinite(irrResult)) {
                irrResult = null;
              } else {
                irrResult = Math.round(irrResult * 10000) / 100; // decimal → percentage
                if (irrResult < -99 || irrResult > 10000) irrResult = null;
              }
            } catch (irrError) {
              irrResult = this.calculateIRRCustom(cashFlows);
            }
          }
        } catch (error) {
          console.warn('NPV/IRR calculation error:', error.message);
          npvResult = this.calculateNPVCustom(cashFlows, discountRate);
          irrResult = this.calculateIRRCustom(cashFlows);
        }
        
        scenarioResults.push({
          name: scenario.name,
          annualData,
          breakEvenPoint: Math.max(0, breakEvenType === 'units'
            ? Math.round(breakEvenPoint)
            : Math.round(breakEvenPoint * 100) / 100),
          breakEvenType,
          paybackPeriod: paybackPeriodResult !== null ? Math.round(paybackPeriodResult * 100) / 100 : null,
          npv: Math.round(npvResult * 100) / 100,
          irr: irrResult
        });

      } catch (error) {
        console.error('Scenario calculation error:', error);
        scenarioResults.push({
          name: scenario.name,
          annualData: [],
          breakEvenPoint: 0,
          breakEvenType: 'none',
          paybackPeriod: null,
          npv: 0,
          irr: null
        });
      }
    });
    
    this.financialMetrics = {
      scenarios: scenarioResults,
      lastCalculated: new Date()
    };
    
    return this;
    
  } catch (error) {
    console.error('CalculateMetrics error:', error);
    this.financialMetrics = { 
      scenarios: [], 
      lastCalculated: new Date() 
    };
    return this;
  }
};

// Custom NPV calculation (fallback)
projectSchema.methods.calculateNPVCustom = function(cashFlows, discountRate) {
  try {
    return cashFlows.reduce((sum, cashFlow, index) => {
      return sum + (cashFlow / Math.pow(1 + discountRate, index));
    }, 0);
  } catch (error) {
    return 0;
  }
};

// FIXED: Custom IRR calculation with improved Newton-Raphson
projectSchema.methods.calculateIRRCustom = function(cashFlows) {
  try {
    // Newton-Raphson method
    let rate = 0.1; // Start with 10%
    const maxIterations = 100;
    const tolerance = 1e-6;
    
    for (let i = 0; i < maxIterations; i++) {
      let npv = 0;
      let derivative = 0;
      
      for (let j = 0; j < cashFlows.length; j++) {
        const cashFlow = parseFloat(cashFlows[j]) || 0;
        const denominator = Math.pow(1 + rate, j);
        
        npv += cashFlow / denominator;
        
        if (j > 0) {
          derivative -= j * cashFlow / (denominator * (1 + rate));
        }
      }
      
      if (Math.abs(npv) < tolerance) {
        return Math.round(rate * 10000) / 100;
      }
      
      if (Math.abs(derivative) < tolerance) {
        break; // Avoid division by zero
      }
      
      const newRate = rate - npv / derivative;
      
      if (Math.abs(newRate - rate) < tolerance) {
        return Math.round(newRate * 10000) / 100;
      }
      
      // Keep rate within reasonable bounds
      rate = Math.max(-0.99, Math.min(100, newRate));
    }
    
    // Fallback to bisection method
    return this.calculateIRRBisection(cashFlows);
    
  } catch (error) {
    return null;
  }
};

// FIXED: Bisection method for IRR
projectSchema.methods.calculateIRRBisection = function(cashFlows) {
  try {
    let lowerBound = -0.99;
    let upperBound = 100;
    const maxIterations = 100;
    const tolerance = 1e-6;

    const calculateNPV = (rate) => {
      return cashFlows.reduce((sum, cf, i) => {
        return sum + (parseFloat(cf) || 0) / Math.pow(1 + rate, i);
      }, 0);
    };

    let npvLower = calculateNPV(lowerBound);
    let npvUpper = calculateNPV(upperBound);

    // Check if there's a root in the interval
    if (npvLower * npvUpper >= 0) {
      return null;
    }

    for (let i = 0; i < maxIterations; i++) {
      const midPoint = (lowerBound + upperBound) / 2;
      const npvMid = calculateNPV(midPoint);

      if (Math.abs(npvMid) < tolerance) {
        return Math.round(midPoint * 10000) / 100;
      }

      if (npvMid * npvLower < 0) {
        upperBound = midPoint;
        npvUpper = npvMid;
      } else {
        lowerBound = midPoint;
        npvLower = npvMid;
      }

      if (Math.abs(upperBound - lowerBound) < tolerance) {
        break;
      }
    }
    
    const result = (lowerBound + upperBound) / 2;
    return Math.round(result * 10000) / 100;
    
  } catch (error) {
    return null;
  }
};

// Method to recalculate and save
projectSchema.methods.recalculateMetrics = async function() {
  try {
    // Re-fetch from DB so Mixed type fields (e.g. dailyBreakdown.schedule) are
    // fully hydrated — findByIdAndUpdate with {new:true} can return stale {} for Mixed subdocs
    const fresh = await this.constructor.findById(this._id);
    if (!fresh) return this;
    fresh.calculateMetrics();

    const updated = await this.constructor.findByIdAndUpdate(
      this._id,
      {
        financialMetrics: fresh.financialMetrics,
        updatedAt: new Date()
      },
      {
        new: true,
        runValidators: false
      }
    );

    return updated;
  } catch (error) {
    console.error('Error in recalculateMetrics:', error);
    throw error;
  }
};

// Check if recalculation is needed
projectSchema.methods.needsRecalculation = function() {
  if (!this.financialMetrics || !this.financialMetrics.lastCalculated) {
    return true;
  }
  
  const incomeScenarioNames = (this.income.scenarios || []).map(s => s.name).sort();
  const metricsScenarioNames = (this.financialMetrics.scenarios || []).map(s => s.name).sort();
  
  if (JSON.stringify(incomeScenarioNames) !== JSON.stringify(metricsScenarioNames)) {
    return true;
  }
  
  // Recalculate if data changed after last calculation
  if (this.updatedAt > this.financialMetrics.lastCalculated) {
    return true;
  }
  
  return false;
};

// Static method to recalculate metrics for multiple projects
projectSchema.statics.recalculateAllMetrics = async function() {
  try {
    const projects = await this.find({});
    const results = [];
    
    for (const project of projects) {
      try {
        await project.recalculateMetrics();
        results.push({ projectId: project._id, success: true });
      } catch (error) {
        results.push({ projectId: project._id, success: false, error: error.message });
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    return { 
      success: true, 
      totalProjects: projects.length,
      successfullyUpdated: successCount,
      results 
    };
  } catch (error) {
    console.error('Error recalculating all metrics:', error);
    return { success: false, error: error.message };
  }
};

module.exports = mongoose.model('Project', projectSchema);