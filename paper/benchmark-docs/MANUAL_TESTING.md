# Manual Benchmark Testing Guide

How to test any AI (ChatGPT, Claude, Gemini, etc.) without API access.

---

## Overview

1. Copy a test case JSON → paste into chatbot with the prompt below
2. Copy the AI's JSON response → wrap it into the "Complete" format
3. Import via the app UI → view the comparison dashboard
4. Record the score

---

## Step 1 — The Prompt

Copy the entire content of any file from `Backend/benchmark/dataset/cases/` (e.g. `case_0001.json`).

Then use this prompt:

---

```
Eres un analista financiero experto en viabilidad de negocios en Colombia.

A continuación te doy los datos de entrada de un proyecto de negocio. Tu tarea es calcular el análisis financiero COMPLETO para los 4 escenarios: optimista, normal, pesimista, controlado.

DATOS DE ENTRADA:
[PEGA AQUÍ EL JSON COMPLETO DEL CASO]

Responde ÚNICAMENTE con un objeto JSON válido con esta estructura exacta (sin texto adicional, sin markdown, solo JSON puro):

{
  "inputs": [COPIA LOS INPUTS EXACTAMENTE COMO LOS RECIBISTE],
  "analysis": {
    "lastCalculated": "[fecha actual en ISO 8601]",
    "scenarios": {
      "optimista": {
        "npv": <número>,
        "irr": <número o null si no converge>,
        "paybackPeriod": <número de años o null>,
        "breakEvenPoint": <unidades>,
        "annualData": [
          {
            "year": 1,
            "revenue": <número>,
            "totalCOGS": <número>,
            "grossProfit": <número>,
            "fixedExpenses": <número>,
            "variableExpenses": <número>,
            "totalExpenses": <número>,
            "ebitda": <número>,
            "depreciation": <número>,
            "operationalProfit": <número>,
            "interestExpense": <número>,
            "taxes": <número>,
            "netProfit": <número>,
            "unleveredCashFlow": <número>,
            "leveredCashFlow": <número>
          }
          ... (un objeto por cada año del proyecto)
        ]
      },
      "normal": { ... misma estructura ... },
      "pesimista": { ... misma estructura ... },
      "controlado": { ... misma estructura ... }
    }
  }
}

REGLAS DE CÁLCULO:
- Revenue año 1 = sum(sellingPrice × quantity × periodsPerYear) para cada item en el escenario
- Revenue año N = Revenue año N-1 × (1 + growthRate/100)
- totalCOGS = sum(unitCost × quantity × periodsPerYear) para cada item
- grossProfit = revenue - totalCOGS
- Los gastos con frequency="monthly" se multiplican por 12 para el año; "quarterly" por 4; "annual" por 1
- Los gastos crecen cada año según su growthRate (en %)
- fixedExpenses = suma de gastos de type="fijo" del año
- variableExpenses = suma de gastos de type="variable" del año
- totalExpenses = fixedExpenses + variableExpenses
- ebitda = grossProfit - totalExpenses
- depreciation = suma(valor_activo / vida_útil) para activos fijos (solo durante su vida útil)
- operationalProfit = ebitda - depreciation
- interestExpense = interés del préstamo para ese año (amortización mensual estándar)
- taxes = max(0, operationalProfit - interestExpense - pérdidas_anteriores) × (taxRate / 100)
- netProfit = operationalProfit - interestExpense - taxes
- unleveredCashFlow = ebitda - taxes_sin_deuda (aproximado como ebitda × (1 - taxRate/100))
- leveredCashFlow = netProfit + depreciation - cuota_capital_préstamo_año
- NPV = -inversión_inicial + Σ(leveredCashFlow_t / (1 + discountRate/100)^t)
- IRR = tasa que hace NPV = 0 (null si no converge)
- paybackPeriod = año en que el flujo acumulado se vuelve positivo (interpolado, null si nunca)
- breakEvenPoint = fixedExpenses_año1 / (precio_promedio - costo_variable_promedio)

Todos los valores monetarios en la misma moneda del proyecto (ver inputs.general.currency).
```

---

## Step 2 — Prepare the Complete JSON

The AI should return a JSON directly. If it returns it inside markdown backticks, strip those. Save it as a `.json` file, for example:

```
my-ai-tests/
├── chatgpt4o_case_0001.json
├── claude_case_0001.json
└── gemini_case_0001.json
```

**Add the `meta` key at the top** so you can identify which case and AI it was:

```json
{
  "meta": {
    "exportVersion": "1.0",
    "exportDate": "2025-01-20T10:00:00.000Z",
    "modelTag": "gpt-4o",
    "caseId": "case_0001",
    "difficulty": "simple"
  },
  "inputs": { ... AI's copy of inputs ... },
  "analysis": { ... AI's analysis ... }
}
```

---

## Step 3 — Import via the App

1. Make sure the app is running (frontend + backend)
2. Go to the **Project List** page
3. Click **"Importar JSON"**
4. Select your prepared `.json` file
5. The app will:
   - Recalculate all metrics from the inputs (ground truth)
   - Compare the AI's analysis field-by-field
   - Redirect you to the **Comparison Dashboard**

---

## Step 4 — Read the Comparison Dashboard

The dashboard shows:

| Column | Meaning |
|--------|---------|
| **Valor JSON** | What the AI calculated |
| **Valor App** | The correct value (ground truth) |
| **% Error** | How far off the AI was |
| **Estado** | ✅ match (<1%) / ⚠️ small (1–5%) / ❌ large (>5%) |

Switch between scenario tabs (Optimista / Normal / Pesimista / Controlado) to see all results.

Click **"Descargar Reporte CSV"** to export the comparison for spreadsheet analysis.

---

## Step 5 — Track Your Results

Keep a simple spreadsheet:

| Case | Model | NPV Error % | IRR Error % | Payback Error % | Overall Accuracy |
|------|-------|-------------|-------------|-----------------|-----------------|
| case_0001 | GPT-4o | 2.3% | 0.8% | 1.1% | 78% |
| case_0001 | Claude | 0.4% | 0.2% | 0.3% | 95% |
| case_0002 | GPT-4o | 5.1% | 3.2% | 0.6% | 71% |

The **Overall Accuracy** is shown on the dashboard summary card.

---

## Tips for Better Results

### Getting Valid JSON from the AI

If the AI returns text with the JSON embedded, ask:
> "Return ONLY the JSON, no explanation, no markdown."

If the AI's JSON has syntax errors, paste it into [jsonlint.com](https://jsonlint.com) to find the issue.

### When the AI Gets confused

Some AIs struggle with:
- **Large datasets** (many income items) → start with `difficulty: simple` cases
- **Spanish field names** → the prompt already uses English field names
- **COP amounts** (large numbers) → the AI may use scientific notation; replace with integers

### Suggested Testing Set

For a quick comparison across 3 models, test 10 cases:
- 4 simple (case_0001–case_0010 range, filter by `"difficulty": "simple"`)
- 4 medium (case_0041–case_0080 range)
- 2 complex (case_0081–case_0100 range)

Use the index file to pick cases by difficulty:
```bash
# List all simple cafeteria cases
node -e "
const idx = require('./Backend/benchmark/dataset/index.json');
console.log(idx.filter(c => c.difficulty==='simple' && c.type==='cafeteria').slice(0,5).map(c=>c.caseId).join('\n'))
"
```

---

## Interpreting Results

### What Good Looks Like
- NPV within 5% → the AI understood compound discounting
- IRR within 2% → the AI solved the rate numerically
- Annual revenue exactly matching → the AI applied growth rates correctly

### Common AI Mistakes
| Error Pattern | Likely Cause |
|---------------|-------------|
| Revenue much higher than expected | AI forgot to use `quantity × price` (used totals directly) |
| NPV too high | AI forgot to subtract initial investment |
| All taxes = 0 | AI didn't apply tax rate or confused taxRate format |
| IRR = "N/A" string | AI didn't know how to compute IRR numerically |
| Payback = null for viable projects | AI computed wrong sign for cumulative cash flow |
| EBITDA ≠ grossProfit - totalExpenses | AI included depreciation in operating expenses |

---

## Aggregating Multiple Results

After importing several AI outputs, run:

```bash
cd Backend
npm run benchmark:aggregate
```

This reads all projects with comparison data from MongoDB and generates:
- Accuracy by metric (NPV, IRR, payback, etc.)
- Accuracy by project type
- Average error percentage

Output: `Backend/benchmark/results/aggregate-YYYY-MM-DD.json`
