# context.md — FinanceBench

## Pregunta de Investigación

¿Cuál es el rendimiento comparativo de Large Language Models en tareas fundamentales de análisis financiero, y qué patrones de fortalezas y debilidades caracterizan a cada modelo?

## Estado Actual

### Dataset
- **249 casos** de prueba generados y validados
- **10 categorías** financieras, ~25 casos por categoría (distribución variable)
- Dificultad: fácil / medio / difícil en cada categoría
- Validación: panel de expertos financieros (contadores, analistas)

### Modelos Evaluados (8)
| Modelo | Proveedor | Tipo |
|--------|-----------|------|
| claude-haiku-4 | Anthropic | Propietario |
| claude-sonnet-4.6 | Anthropic | Propietario |
| claude-opus-4.6 | Anthropic | Propietario |
| gpt-5.3 | OpenAI | Propietario |
| gpt-5.4 | OpenAI | Propietario |
| gemini-3-flash | Google | Propietario |
| deepseek-chat | DeepSeek | Propietario/Open |
| grok-code | xAI | Propietario |

### Paper (11 secciones en paper/)
- Secciones completadas: Abstract, Introduction, Related Work, Methodology, Dataset Construction, Benchmark Design, Evaluation Metrics, Limitations, Conclusion
- **Pendientes**: Results (análisis estadístico final), Discussion (interpretación comparativa)

## Decisiones Arquitectónicas

| Decisión | Razón | Implicación |
|----------|-------|-------------|
| 10 categorías financieras | Cobertura completa de análisis de viabilidad de negocios | Nuevas categorías requieren >25 casos validados |
| Métrica compuesta 0-100 | Comparabilidad entre categorías heterogéneas | Ver `agents/evaluator.md` para desglose de subcriterios |
| Newton-Raphson + Bisección para IRR | Convergencia robusta con fallback | Ambos algoritmos en `Project.js` — no cambiar sin validar |
| MongoDB para dataset | Flexibilidad de schema, query por categoría/dificultad | Schema en `benchmark/dataset/` |
| Open-source en GitHub | Reproducibilidad, impacto en comunidad | Dataset y código serán públicos al publicar |
| Prompting estándar (zero-shot) | Baseline comparable entre modelos | Evaluar prompt engineering en estudio derivado |

## Próximos Pasos

1. Completar análisis estadístico (pruebas de significancia, intervalos de confianza, effect sizes)
2. Redactar sección Results con tablas ACL/NeurIPS
3. Redactar sección Discussion con comparación a literatura
4. Preparar submission a NeurIPS 2025 (Datasets & Benchmarks Track)
5. Publicar dataset en GitHub como open-source

## Extensiones Futuras (post-publicación)

- Estudio de Prompt Engineering: qué estrategias mejoran rendimiento por tarea
- Detección de alucinaciones: métodos para identificar outputs financieros incorrectos
- Fine-tuning especializado: modelos específicos para finanzas
- Evaluación multilingüe: español vs. inglés

## Variables de Entorno Requeridas

```
MONGODB_URI=
OPENAI_API_KEY=
GROQ_API_KEY=
ANTHROPIC_API_KEY=
```

## Institución y Contexto

- **Institución**: [afiliación institucional omitida]
- **Línea**: IA para Democratización del Conocimiento Financiero
- **Nivel**: Investigación de Maestría / Publicación en conferencias Q1
- **Contexto geográfico**: América Latina — enfoque en emprendedores colombianos y PYMEs
