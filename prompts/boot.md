# Boot — FinanceBench / benchmark-financiero

## Identidad del proyecto

**FinanceBench** — A Comprehensive Benchmark for Evaluating Large Language Models on Financial Analysis Tasks
**Investigador**: Luis Daniel Fuentes Licero
**Institución**: [afiliación institucional omitida]
**Línea**: IA para Democratización del Conocimiento Financiero
**Target de publicación**: NeurIPS 2025 (Datasets & Benchmarks Track) / AAAI / ICLR

## Estado actual

- 249 casos de prueba validados en `Backend/benchmark/dataset/`
- 8 modelos evaluados: claude-haiku-4, claude-opus-4.6, claude-sonnet-4.6, deepseek-chat, gemini-3-flash, gpt-5.3, gpt-5.4, grok-code
- Paper en borrador: 11 secciones en `docs/paper/`
- Pendiente: Results y Discussion completos, análisis estadístico final

## Stack

```
Backend: Node.js + Express 5.1.0 + MongoDB + Mongoose 8.16.1
Frontend: React 19 + Vite 6.3.5 + Chart.js + Recharts
AI providers: Groq SDK + OpenAI 6.33.0 + Claude API (claudeService.js)
Export: Excel/JSON
Estado: React Context API (CurrencyContext, ScenarioContext, AIChatContext)
```

## 10 Categorías del Benchmark

1. Cálculo de NPV (Valor Presente Neto)
2. Cálculo de IRR (Tasa Interna de Retorno) — Newton-Raphson + Bisección
3. Proyección de Flujo de Caja
4. Generación de Escenarios (Optimista/Pesimista/Normal)
5. Análisis de Punto de Equilibrio
6. Evaluación de Estructura de Capital
7. Indicadores Financieros (ROI, ROE, margen bruto)
8. Interpretación de Estados Financieros
9. Análisis de Sensibilidad
10. Recomendaciones de Viabilidad

## Archivos que requieren cuidado especial

| Archivo | Por qué |
|---------|---------|
| `Backend/src/models/Project.js` (2248 líneas) | Núcleo de TODOS los cálculos financieros — validar contra 249 casos antes de modificar |
| `Backend/benchmark/dataset/` | Schema fijo — no cambiar estructura sin migración explícita |
| `Investigacion/Contexto_Del_Proyecto.md` | Prompt definitivo del investigador — solo lectura |
| `Investigacion/Instrucciones_Redaccion.md` | Guía de escritura NeurIPS/ACL — solo lectura |
| `docs/paper/` | 11 secciones del paper en borrador |

## Scoring rubric (0-100)

| Criterio | Peso |
|----------|------|
| Calculation Accuracy | 35% |
| Conceptual Accuracy | 25% |
| Reasoning Quality | 20% |
| Completeness | 15% |
| Consistency | 5% |

## Reglas de desarrollo

1. Cualquier modificación a `Project.js` requiere validación contra los 249 casos del dataset
2. Nuevos modelos evaluados → registrar en `docs/benchmark-results.md` y `Backend/benchmark/results/`
3. No modificar archivos en `Investigacion/` — solo lectura
4. Después de cambios estructurales: actualizar `docs/code-intelligence.md`
