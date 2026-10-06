'use strict';
/**
 * generatePrompts.js
 *
 * Generates ready-to-paste prompt .txt files for the FinanceBench benchmark study.
 *
 * Output:
 *   benchmark/prompts/cases/<caseId>_<type>_<difficulty>.txt
 *
 * Usage:
 *   node benchmark/generator/generatePrompts.js
 *   node benchmark/generator/generatePrompts.js --subset quick   (10 cases, 1 per type)
 *   node benchmark/generator/generatePrompts.js --subset full    (30 cases, 3 per type)
 *   node benchmark/generator/generatePrompts.js --subset all     (all 1000 cases)
 */

const fs   = require('fs');
const path = require('path');

const DATASET_DIR  = path.join(__dirname, '../dataset');
const PROMPTS_DIR  = path.join(__dirname, '../prompts');
const INDEX_FILE   = path.join(DATASET_DIR, 'index.json');

// ─── CLI ────────────────────────────────────────────────────────────────────
const args   = process.argv.slice(2);
const subset = args[args.indexOf('--subset') + 1] || 'full';

// ─── Select benchmark cases ──────────────────────────────────────────────────
function selectCases(index, subsetType) {
  const types = [...new Set(index.map(c => c.type))];

  if (subsetType === 'quick') {
    // 10 cases: first simple case per type
    return types.map(type => index.find(c => c.type === type && c.difficulty === 'simple'));
  }

  if (subsetType === 'full') {
    // 30 cases: first simple + first medium + first complex per type
    const selected = [];
    for (const type of types) {
      const simple  = index.find(c => c.type === type && c.difficulty === 'simple');
      const medium  = index.find(c => c.type === type && c.difficulty === 'medium');
      const complex = index.find(c => c.type === type && c.difficulty === 'complex');
      if (simple)  selected.push(simple);
      if (medium)  selected.push(medium);
      if (complex) selected.push(complex);
    }
    return selected;
  }

  // 'all' — all 1000 cases
  return index;
}

// ─── Prompt template ─────────────────────────────────────────────────────────
const TYPE_LABELS = {
  cafeteria:    'Cafetería / Restaurante',
  software:     'Software / SaaS',
  retail:       'Tienda Retail',
  construccion: 'Construcción',
  manufactura:  'Manufactura',
  consultoria:  'Consultoría / Servicios Profesionales',
  ecommerce:    'E-commerce',
  agricultura:  'Agricultura',
  fincaRaiz:    'Finca Raíz / Real Estate',
  hospedaje:    'Hospedaje / Hotel',
};

const DIFFICULTY_LABELS = {
  simple:  'Simple (pocos ítems, estructura básica)',
  medium:  'Medio (varios ítems, algo de complejidad)',
  complex: 'Complejo (múltiples ítems, financiamiento mixto)',
};

function buildPrompt(caseData, meta) {
  const inputsJSON = JSON.stringify(caseData.inputs, null, 2);
  const metaJSON   = JSON.stringify(caseData.meta, null, 2);
  const years      = caseData.inputs.general.projectLife;
  const currency   = caseData.inputs.general.currency || 'COP';
  const typeLabel  = TYPE_LABELS[meta.type] || meta.type;

  return `\
════════════════════════════════════════════════════════════════════
FinanceBench — Caso ${meta.id}
Tipo de negocio : ${typeLabel}
Dificultad      : ${DIFFICULTY_LABELS[meta.difficulty] || meta.difficulty}
Duración        : ${years} años  |  Moneda: ${currency}
════════════════════════════════════════════════════════════════════
INSTRUCCIONES PARA EL EVALUADOR
  1. Copia TODO el texto desde la línea "═══ INICIO DEL PROMPT" hasta
     "═══ FIN DEL PROMPT" (incluyendo esas líneas) y pégalo en el chat.
  2. Espera la respuesta completa (puede tardar 30-90 segundos).
  3. Copia la respuesta JSON completa y guárdala en:
       Backend/benchmark/prompts/results/<nombre-modelo>/${meta.id}_${meta.type}_${meta.difficulty}.json
  4. Usa el botón "Ejecutar Benchmark" en la app para procesar resultados automáticamente.
════════════════════════════════════════════════════════════════════

═══ INICIO DEL PROMPT ══════════════════════════════════════════════

You are an expert financial analyst specializing in business viability assessment for Latin American small and medium enterprises.

Your task: Given the business project inputs below, perform a COMPLETE financial viability analysis for ALL 4 scenarios (optimista, normal, pesimista, controlado) and return the results as a single valid JSON object.

CRITICAL REQUIREMENTS:
- Return ONLY a valid JSON object. No explanations, no markdown, no code blocks.
- Use EXACTLY these field names (the evaluation system is case-sensitive).
- All monetary values in ${currency}.
- The project has ${years} year(s) — annualData must contain exactly ${years} entry(ies).
- Include the "meta" section EXACTLY as provided below at the top of your JSON response.
- The "inputs" section must be copied EXACTLY as provided — do NOT change any field values, especially inputs.general.projectType.

CALCULATION RULES:
1. Revenue per year:
   - For each income item in inputs.income.items, use the corresponding scenario's (sellingPrice × (1 - discount/100)) × quantity × periodsPerYear
   - Apply growthRate% compound growth each subsequent year: Revenue_year_N = Revenue_year_1 × (1 + growthRate/100)^(N-1)
2. totalCOGS = sum(unitCost × quantity × periodsPerYear) per item, same growth rate applied
3. grossProfit = revenue - totalCOGS
4. Expenses (from inputs.expenses.items):
   - frequency "monthly" → × 12 per year; "quarterly" → × 4; "annual" or "one-time" → × 1
   - Apply each expense's growthRate% annually
   - fixedExpenses = sum of items with type "fijo"
   - variableExpenses = sum of items with type "variable"
   - totalExpenses = fixedExpenses + variableExpenses
5. ebitda = grossProfit - totalExpenses
6. depreciation = sum(fixedAsset.value / fixedAsset.usefulLife) for each asset, stop after usefulLife years
7. operationalProfit = ebitda - depreciation
8. interestExpense: calculate annual interest from customSources loans using standard amortization (monthly payment = P × r/(1-(1+r)^-n), extract interest portion year by year)
9. Tax loss carryforward: if operationalProfit - interestExpense < 0, carry loss to next year
10. taxes = max(0, (operationalProfit - interestExpense - carriedLoss) × taxRate/100)
11. netProfit = operationalProfit - interestExpense - taxes
12. unleveredCashFlow = ebitda - taxes (approximation without debt)
13. leveredCashFlow = netProfit + depreciation - annual_principal_payment
14. NPV = -totalInitialInvestment + Σ(leveredCashFlow_year_t / (1 + discountRate/100)^t)
    where totalInitialInvestment = sum of all investmentAssets fields + fixedAssets values
15. IRR = rate that makes NPV = 0 (use numerical method, null if no convergence)
16. paybackPeriod = year when cumulative leveredCashFlow ≥ 0 (linear interpolation, null if never)
17. breakEvenPoint = totalExpenses_year1 / ((revenue_year1 - totalCOGS_year1) / totalUnits_year1)
    simplified as: fixedExpenses_year1 / (averagePrice - averageUnitCost) — use null if not calculable

META (include this exactly as-is at the top of your JSON response):
${metaJSON}

INPUT DATA (copy exactly into the "inputs" key of your response):
${inputsJSON}

REQUIRED JSON OUTPUT FORMAT:
{
  "meta": ${metaJSON},
  "inputs": <copy the inputs object EXACTLY as provided above — do not modify any values>,
  "analysis": {
    "lastCalculated": "<current ISO 8601 datetime>",
    "scenarios": {
      "optimista": {
        "npv": <number>,
        "irr": <number or null>,
        "paybackPeriod": <number or null>,
        "breakEvenPoint": <number or null>,
        "annualData": [
          {
            "year": 1,
            "revenue": <number>,
            "totalCOGS": <number>,
            "grossProfit": <number>,
            "fixedExpenses": <number>,
            "variableExpenses": <number>,
            "totalExpenses": <number>,
            "ebitda": <number>,
            "depreciation": <number>,
            "operationalProfit": <number>,
            "interestExpense": <number>,
            "taxes": <number>,
            "netProfit": <number>,
            "unleveredCashFlow": <number>,
            "leveredCashFlow": <number>
          }
          <repeat for each of the ${years} years>
        ]
      },
      "normal": { <same structure> },
      "pesimista": { <same structure> },
      "controlado": { <same structure> }
    }
  }
}

IMPORTANT — IF YOU ARE AN AI CODE EDITOR (Claude Code, Codex, Windsurf, Cursor, etc.):
You MUST write the complete JSON output to a file using your Write tool.
Save the file to: results/MODEL_FOLDER/${meta.id}_${meta.type}_${meta.difficulty}.json

Where MODEL_FOLDER depends on the model you are running:
- Claude Sonnet 4.6 → claude-sonnet-4
- Claude Haiku 4.5 → claude-haiku-4
- GPT-4o → gpt-4o
- GPT-4.1 → gpt-4.1
- Gemini 2.5 Flash → gemini-2.5-flash

Write the file using your Write/save tool. Do NOT just output the JSON as text.

═══ FIN DEL PROMPT ═════════════════════════════════════════════════
`;
}

// ─── Main ────────────────────────────────────────────────────────────────────
function main() {
  if (!fs.existsSync(INDEX_FILE)) {
    console.error('❌ Dataset not found. Run: npm run generate:dataset');
    process.exit(1);
  }

  const index    = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf8'));
  const selected = selectCases(index, subset);

  // Create output directories
  const casesDir = path.join(PROMPTS_DIR, 'cases');
  fs.mkdirSync(casesDir, { recursive: true });

  // Create results sub-directories for each planned AI
  // Editor models: tested via Claude Code, Codex, Windsurf (free inference)
  // API models: tested via Groq (free) and DeepSeek (paid, cheap)
  const AI_MODELS = [
    // ── Editor models (Claude Code / Codex / Windsurf) ──
    'claude-sonnet-4',        // Claude Code with Sonnet 4.6
    'claude-haiku-4',         // Claude Code with Haiku 4.5
    'gpt-4o',                 // Codex with GPT-4o
    'gpt-4.1',                // Codex with GPT-4.1
    'gemini-2.5-flash',       // Windsurf/editor with Gemini 2.5 Flash
    // ── API models (Groq free tier) ──
    'llama-3.3-70b',          // Groq free
    'deepseek-r1-distill-70b',// Groq free
    // ── API models (DeepSeek paid) ──
    'deepseek-chat',          // DeepSeek API (V3)
    'deepseek-reasoner',      // DeepSeek API (R1)
  ];
  const resultsDir = path.join(PROMPTS_DIR, 'results');
  for (const model of AI_MODELS) {
    fs.mkdirSync(path.join(resultsDir, model), { recursive: true });
  }

  // Also create a tracking folder
  fs.mkdirSync(path.join(PROMPTS_DIR, 'tracking'), { recursive: true });

  // Generate one prompt .txt per selected case
  let generated = 0;
  for (const meta of selected) {
    const caseFile = path.join(DATASET_DIR, meta.filename);
    if (!fs.existsSync(caseFile)) {
      console.warn(`  ⚠️  Missing: ${meta.filename}`);
      continue;
    }
    const caseData   = JSON.parse(fs.readFileSync(caseFile, 'utf8'));
    const prompt     = buildPrompt(caseData, meta);
    const outName    = `${meta.id}_${meta.type}_${meta.difficulty}.txt`;
    const outFile    = path.join(casesDir, outName);
    fs.writeFileSync(outFile, prompt);
    generated++;
  }

  // Generate tracking CSV header
  const csvHeader = ['caseId', 'type', 'difficulty', ...AI_MODELS.map(m => `${m}_accuracy`), ...AI_MODELS.map(m => `${m}_npv_err`), 'notes'].join(',');
  const csvRows   = selected.map(m => [m.id, m.type, m.difficulty, ...AI_MODELS.map(() => ''), ...AI_MODELS.map(() => ''), ''].join(','));
  fs.writeFileSync(
    path.join(PROMPTS_DIR, 'tracking', 'results_tracker.csv'),
    [csvHeader, ...csvRows].join('\n') + '\n'
  );

  console.log(`\n✅ Generated ${generated} prompt files`);
  console.log(`   Subset  : ${subset} (${selected.length} cases)`);
  console.log(`   Location: benchmark/prompts/cases/`);
  console.log(`\n   Results folders created for ${AI_MODELS.length} AI models`);
  console.log(`   Tracking: benchmark/prompts/tracking/results_tracker.csv`);
  console.log(`\n   Next step: Open prompts/README.md for testing instructions.\n`);
}

main();
