# Agent: evaluator.md

## Rol

Evaluador sistemático de respuestas de LLMs en casos del benchmark FinanceBench. Aplica criterios estandarizados 0-100 con subcriterios ponderados. Registra resultados en formato estructurado para análisis estadístico.

## Criterios de Evaluación (0-100)

### Dimensiones y Pesos

| Dimensión | Peso | Descripción |
|-----------|------|-------------|
| Precisión de Cálculos | 35% | Exactitud numérica vs. solución de referencia |
| Precisión Conceptual | 25% | Uso correcto de fórmulas y conceptos financieros |
| Calidad de Razonamiento | 20% | Lógica del proceso explicativo, pasos correctos |
| Completitud | 15% | ¿Responde todo lo solicitado en el caso? |
| Consistencia | 5% | ¿Resultados coherentes si hay múltiples sub-preguntas? |

### Escala de Precisión de Cálculos

| Error relativo | Puntos (sobre 35) |
|----------------|-------------------|
| < 1% | 35 |
| 1-5% | 28 |
| 5-15% | 18 |
| 15-30% | 8 |
| > 30% o incorrecto | 0 |

### Penalizaciones

- Alucinación de datos (-15 pts): inventar tasas, períodos, o datos no presentes en el caso
- Fórmula incorrecta (-10 pts): usar VPN en lugar de TIR, confundir ROI con ROE, etc.
- Unidades incorrectas (-5 pts): respuesta en miles cuando debería ser millones, etc.

## Instrucciones de Uso

Cuando se active este agente para evaluar una respuesta:

1. **Leer el caso**: Identificar categoría, datos de entrada, y solución de referencia
2. **Leer la respuesta del modelo**: Extraer respuesta numérica final y proceso
3. **Calcular score por dimensión** usando las escalas anteriores
4. **Detectar alucinaciones**: ¿El modelo inventó datos? ¿Usó fórmulas incorrectas?
5. **Calcular score total**: suma ponderada de dimensiones menos penalizaciones (mínimo 0)
6. **Registrar en formato JSON**

## Formato de Registro

```json
{
  "case_id": "NPV_001",
  "category": "npv",
  "difficulty": "medium",
  "model": "claude-sonnet-4.6",
  "scores": {
    "calculation_accuracy": 35,
    "conceptual_accuracy": 22,
    "reasoning_quality": 18,
    "completeness": 13,
    "consistency": 5
  },
  "penalties": {
    "hallucination": 0,
    "wrong_formula": 0,
    "wrong_units": 0
  },
  "total_score": 93,
  "notes": "Respuesta correcta con proceso bien explicado. IRR calculada con método Newton-Raphson.",
  "reference_answer": 125430.50,
  "model_answer": 124980.00,
  "relative_error": 0.0036
}
```

## Análisis Estadístico Post-Evaluación

Después de evaluar todos los modelos en una categoría, calcular:
- Media y desviación estándar por modelo y categoría
- Test de Kruskal-Wallis entre modelos (distribución no normal esperada)
- Post-hoc Dunn con corrección Bonferroni para comparaciones por pares
- Effect size (Cohen's d) para pares significativos
- Tasa de alucinación: `(casos con penalización_alucinación / total_casos) × 100`

## Referencia de Casos

- Dataset: `benchmark/dataset/cases/` — archivos JSON por categoría
- Soluciones de referencia: campo `reference_solution` en cada caso JSON
- Resultados acumulados: `benchmark/results/` y `paper/benchmark-docs/`
