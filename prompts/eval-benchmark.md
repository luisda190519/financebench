# Eval Benchmark — FinanceBench / benchmark-financiero

## Scoring Rubric 0-100

| Criterio | Peso | Sub-criterios |
|----------|------|---------------|
| Calculation Accuracy | 35% | Resultado numérico, unidades, precisión decimal |
| Conceptual Accuracy | 25% | Definición correcta, interpretación financiera |
| Reasoning Quality | 20% | Pasos lógicos, justificación, manejo de asunciones |
| Completeness | 15% | Todos los componentes requeridos presentes |
| Consistency | 5% | Sin contradicciones internas en la respuesta |

## Sub-criterios detallados

### Calculation Accuracy (35 pts)
- **35**: Resultado exacto (±0.01% tolerancia), unidades correctas, precisión decimal apropiada
- **25-34**: Resultado correcto pero error menor de redondeo o unidades inconsistentes
- **15-24**: Metodología correcta pero error en cálculo intermedio que propaga al resultado
- **5-14**: Metodología parcialmente correcta, resultado incorrecto por error conceptual menor
- **0-4**: Metodología incorrecta, resultado sin relación con el esperado

### Conceptual Accuracy (25 pts)
- **25**: Interpreta correctamente el significado del resultado (ej. "NPV > 0 → proyecto viable"), define correctamente el concepto, aplica criterios de decisión correctos
- **18-24**: Interpretación correcta con omisión menor de matiz
- **10-17**: Confusión parcial entre conceptos relacionados (ej. TIR vs WACC)
- **3-9**: Definición incorrecta del concepto central, aunque el cálculo pueda ser correcto
- **0-2**: Conceptualmente erróneo o responde con definición de otro indicador

### Reasoning Quality (20 pts)
- **20**: Pasos ordenados y explícitos, identifica asunciones (tasa de descuento, período, etc.), maneja correctamente edge cases si se presentan, razonamiento reproducible
- **14-19**: Pasos correctos pero alguna asunción implícita no declarada
- **8-13**: Omite pasos intermedios importantes, razonamiento difícil de seguir
- **3-7**: Saltos lógicos injustificados o contradicción entre pasos
- **0-2**: Sin razonamiento discernible

### Completeness (15 pts)
- **15**: Responde todos los componentes solicitados (cálculo + interpretación + recomendación si aplica)
- **10-14**: Omite un componente secundario (ej. da el número pero no la interpretación)
- **5-9**: Omite un componente principal
- **1-4**: Respuesta fragmentaria, solo aborda parte de la pregunta
- **0**: No responde lo solicitado

### Consistency (5 pts)
- **5**: Sin contradicciones — cifras consistentes entre párrafos, conclusión alineada con cálculo
- **3-4**: Inconsistencia menor que no afecta la conclusión
- **1-2**: Contradicción interna en las cifras o entre el cálculo y la conclusión
- **0**: Contradicción mayor (ej. afirma viabilidad con NPV negativo)

---

## Prompt de evaluación

```
You are evaluating a model response for FinanceBench (Fuentes Licero, [afiliación institucional omitida], 2026).

## Test Case
Category: [CATEGORÍA]
Difficulty: [easy | medium | hard]
Case ID: [ID]

Input:
[PEGAR INPUTS DEL CASO]

Expected output:
[PEGAR EXPECTED_OUTPUT DEL CASO]

## Model response
[PEGAR RESPUESTA DEL MODELO]

## Evaluation instructions

Score the response on each criterion. For each, state:
1. The score (numeric)
2. A one-sentence justification citing a specific line or calculation from the response

### Scoring rubric

**Calculation Accuracy (0-35)**
Does the numerical result match expected_output within ±0.01%?
Are units and decimal precision correct?

**Conceptual Accuracy (0-25)**
Does the model correctly define and interpret the financial concept?
Does it apply the correct decision criterion (NPV>0, IRR>WACC, etc.)?

**Reasoning Quality (0-20)**
Are intermediate steps explicit and correct?
Are key assumptions stated (discount rate, periods, currency)?

**Completeness (0-15)**
Does the response address all required components (calculation + interpretation + recommendation if requested)?

**Consistency (0-5)**
Are figures consistent throughout? Does the conclusion match the numerical result?

## Output format (JSON)
{
  "case_id": "[ID]",
  "model": "[NOMBRE_MODELO]",
  "scores": {
    "calculation_accuracy": { "score": 0, "justification": "" },
    "conceptual_accuracy": { "score": 0, "justification": "" },
    "reasoning_quality": { "score": 0, "justification": "" },
    "completeness": { "score": 0, "justification": "" },
    "consistency": { "score": 0, "justification": "" }
  },
  "total": 0,
  "grade": "[A: 90-100 | B: 75-89 | C: 60-74 | D: 40-59 | F: <40]",
  "critical_errors": [],
  "notable_strengths": []
}
```

---

## Flujo de evaluación por lote

```
Evaluate the following batch of FinanceBench cases for model [NOMBRE_MODELO].

Model API: [ENDPOINT O SERVICE FILE]
Dataset path: Backend/benchmark/dataset/cases/
Results output: Backend/benchmark/results/[model]_results.json

Steps:
1. For each case in the dataset:
   a. Send input to model via API
   b. Record raw response and latency_ms
   c. Score using the 0-100 rubric above
   d. Append result to output file

2. After all cases, compute:
   - Overall mean score (μ) and std dev (σ) per criterion
   - Mean score by category (10 categories)
   - Mean score by difficulty (easy/medium/hard)
   - Percentage of cases with total ≥ 60 (passing rate)
   - Percentage of cases with Calculation Accuracy < 15 (critical failure rate)

3. Generate summary row for docs/benchmark-results.md:
   | Model | NPV | IRR | CF | Scenarios | Break-even | Capital | Ratios | FS | Sensitivity | Viability | Overall |

Rate limiting: [ESPECIFICAR DELAYS ENTRE LLAMADAS]
Timeout per call: 30s
Retry on timeout: 1 time only
Log failed cases to: Backend/benchmark/results/[model]_errors.json
```

---

## Criterios por categoría

### 1. NPV (Valor Presente Neto)
- Accuracy check: `result.npv ≈ expected.npv` (±0.01%)
- Conceptual: "NPV > 0 → proyecto viable / NPV < 0 → rechazar"
- Edge cases: flujo = 0 en año 0, tasa = 0%, períodos = 1

### 2. IRR (Tasa Interna de Retorno)
- Accuracy check: `result.irr ≈ expected.irr` (±0.1% — convergencia numérica)
- Conceptual: "IRR > WACC → aceptar / IRR < WACC → rechazar"
- Edge cases: IRR negativa, múltiples IRRs (cambios de signo > 1), no convergencia

### 3. Flujo de Caja
- Accuracy check: flujo neto de cada período y acumulado
- Completeness: flujo operativo + inversión + financiamiento si se solicita
- Edge cases: depreciación, capital de trabajo, valor residual

### 4. Escenarios
- Accuracy check: los tres escenarios (optimista/normal/pesimista) con sus probabilidades
- Conceptual: expected value = Σ(prob × NPV)
- Consistency: valor esperado ponderado coherente con los tres valores

### 5. Break-even
- Accuracy check: `Q_be = CF / (P - CV)` o `S_be = CF / (1 - CV/P)`
- Conceptual: interpretar como unidades o ventas mínimas para cubrir costos fijos
- Edge cases: margen de contribución = 0 (división por cero)

### 6. Estructura de Capital
- Accuracy check: WACC = Σ(w_i × k_i × (1-T) si deuda)
- Conceptual: efecto escudo fiscal correcto
- Completeness: componentes equity + debt + tax shield

### 7. Indicadores Financieros
- Accuracy check: ROI, ROE, margen bruto según fórmulas estándar
- Conceptual: benchmark sectorial si se provee (ej. ROE > 15%)
- Consistency: denominadores correctos (patrimonio promedio vs. final)

### 8. Estados Financieros
- Completeness: todos los ítems del estado solicitado
- Conceptual: ecuación contable (Activos = Pasivos + Patrimonio)
- Consistency: cifras coherentes entre estados relacionados

### 9. Sensibilidad
- Accuracy check: variación % en VPN dado variación % en parámetro
- Completeness: análisis de al menos las 2 variables solicitadas
- Reasoning: identifica variable más sensible correctamente

### 10. Viabilidad
- Completeness: integra al menos 3 indicadores (NPV, IRR, PB, etc.)
- Conceptual: recomendación alineada con los indicadores calculados
- Reasoning: condiciones de viabilidad explicitadas

---

## Registro en benchmark-results.md

Después de evaluar un modelo, agregar fila a `docs/benchmark-results.md`:

```markdown
| [Modelo] | [v] | [Score NPV] | [Score IRR] | [Score CF] | [Score Escenarios] | [Score BE] | [Score Capital] | [Score Ratios] | [Score FS] | [Score Sens] | [Score Viab] | **[Overall]** | [Fecha] |
```

Y agregar bloque de análisis:

```markdown
### [Modelo] — [Overall]/100

**Strengths**: [categorías con score ≥ 80]
**Weaknesses**: [categorías con score < 60]
**Critical failures**: [casos con Calculation Accuracy < 15]
**Passing rate** (≥60): [X]% of 249 cases
```

---

## Threshold de publicación

Para incluir resultados de un modelo en el paper NeurIPS:
- Mínimo 249 casos evaluados (dataset completo)
- Resultados en `Backend/benchmark/results/[model]_results.json`
- Sin errores de API en más del 5% de los casos
- Score registrado en `docs/benchmark-results.md`
