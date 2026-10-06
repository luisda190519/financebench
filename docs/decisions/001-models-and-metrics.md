# ADR 001 — Categorías Financieras y Métrica Compuesta 0-100

**Fecha**: 2025 (diseño del benchmark)
**Estado**: Aprobado — implementado en producción

## Contexto

FinanceBench requería (a) una taxonomía de tareas financieras representativa de análisis de viabilidad de negocios y (b) una métrica de evaluación que permitiera comparar modelos de forma objetiva y reproducible. Las decisiones debían ser justificables académicamente para la publicación en NeurIPS/AAAI.

## Decisión 1: 10 Categorías Financieras

Se seleccionaron las 10 tareas financieras más relevantes para análisis de viabilidad de negocios en PYMEs y startups latinoamericanas:

1. **NPV** — Valor Presente Neto (viabilidad de inversión)
2. **IRR** — Tasa Interna de Retorno (rentabilidad)
3. **Cash Flow** — Proyección de Flujo de Caja (liquidez)
4. **Scenarios** — Análisis de Escenarios Optimista/Normal/Pesimista (riesgo)
5. **Break-even** — Punto de Equilibrio (umbral de rentabilidad)
6. **Capital Structure** — Estructura de Capital, WACC (financiamiento)
7. **Financial Indicators** — ROI, ROE, márgenes (eficiencia)
8. **Financial Statements** — Interpretación de P&G y Balance (comprensión)
9. **Sensitivity Analysis** — Sensibilidad de NPV a variables clave (robustez)
10. **Viability** — Recomendación de viabilidad integrada (síntesis y decisión)

**Justificación**: Estas 10 categorías cubren el ciclo completo de evaluación financiera que un emprendedor o analista realiza al evaluar un proyecto de inversión. La selección fue validada por un panel de expertos financieros (contadores y analistas certificados).

## Decisión 2: Métrica Compuesta 0-100

Se diseñó una métrica compuesta que evalúa 5 dimensiones con pesos diferenciados:

| Dimensión | Peso | Justificación |
|-----------|------|---------------|
| Precisión de Cálculos | 35% | Error numérico es el criterio más objetivamente medible y más crítico para uso real |
| Precisión Conceptual | 25% | Uso correcto de fórmulas refleja comprensión, no solo cómputo |
| Calidad de Razonamiento | 20% | Proceso explicativo evalúa capacidad pedagógica del modelo |
| Completitud | 15% | ¿Responde todo lo solicitado? |
| Consistencia | 5% | Coherencia interna en casos multi-parte |

**Penalizaciones** adicionales por alucinación (-15 pts), fórmula incorrecta (-10 pts), y unidades incorrectas (-5 pts).

## Evidencia en Código

- `Backend/benchmark/generator/templates/` — Un template por industria que genera casos para las 10 categorías
- `Backend/benchmark/dataset/cases/` — 249 casos con campo `category` y `reference_solution`
- `.claude/agents/evaluator.md` — Especificación completa de la métrica con tablas de scoring
- `Investigacion/Contexto_Del_Proyecto.md` — Justificación académica de la taxonomía

## Consecuencias

**Positivas:**
- Taxonomía justificada por expertos → defensible académicamente
- Métrica ponderada permite análisis por dimensión (¿falla en cálculo o en razonamiento?)
- 249 casos permiten análisis estadístico con potencia suficiente por categoría (~25 casos)

**Restricciones:**
- Nuevas categorías requieren ≥25 casos validados por expertos antes de incluir en el benchmark
- Los pesos de la métrica son fijos — no cambiarlos sin re-evaluación de todos los modelos
- El schema de `dataset/cases/` es inmutable — cambios requieren migración de los 249 casos existentes

## Alternativas Consideradas

- **Exactitud binaria** (correcto/incorrecto): Descartado — demasiado rígido para respuestas que son parcialmente correctas o que tienen errores menores de redondeo
- **BLEU/ROUGE scores**: Descartado — métricas de NLP no son apropiadas para evaluar cálculos numéricos financieros
- **Human evaluation only**: Descartado — no reproducible ni escalable para 249 casos × 15+ modelos
