# Code Development — FinanceBench / benchmark-financiero

## Contexto rápido

Stack: Express 5.1.0 + React 19 + Vite 6.3.5 + MongoDB + Mongoose 8.16.1
AI: Groq SDK + OpenAI 6.33.0 + Claude API
Estado: React Context API (CurrencyContext, ScenarioContext, AIChatContext)
Charts: Chart.js + Recharts

## Restricciones críticas

1. **Project.js es el núcleo**: 2248 líneas de cálculos financieros — toda modificación requiere validar contra 249 casos del dataset
2. **Schema del dataset es fijo**: no cambiar estructura de `Backend/benchmark/dataset/` sin migración explícita
3. **Scoring 0-100**: cualquier función de evaluación usa escala 0-100 con subcriterios ponderados
4. **Determinismo**: cálculos financieros deben ser deterministas (mismos inputs → mismos outputs)
5. **Archivos en Investigacion/ son solo lectura**

## Prompts por tipo de tarea

### Modificar cálculo financiero en Project.js

```
Modifica el cálculo de [TIPO: NPV | IRR | Flujo de Caja | Break-even | etc.] en Backend/src/models/Project.js.

CRÍTICO: Antes de modificar, identificar los casos de prueba relevantes en Backend/benchmark/dataset/.
Después de modificar, validar que los 249 casos sigan pasando.

Fórmula a implementar: [FÓRMULA MATEMÁTICA]
Inputs: [LISTA con tipos y unidades]
Output esperado: [DESCRIPCIÓN con ejemplo numérico]

Para IRR: usar Newton-Raphson primero, Bisección como fallback si no converge en 100 iteraciones.

Edge cases a manejar:
- [caso edge 1]
- [caso edge 2]

Casos de prueba de referencia (del dataset): [IDs o descripción]
```

### Agregar nueva categoría al benchmark

```
Agrega [NOMBRE_CATEGORÍA] como categoría #[11+] del benchmark FinanceBench.

Pasos:
1. Crear template en Backend/benchmark/generator/templates/[nombre].js
2. Generar 20-25 casos de prueba en Backend/benchmark/dataset/
3. Schema del caso: { id, category, difficulty, inputs, expected_output, scoring_rubric }
4. Los casos deben ser deterministas y validados manualmente
5. Actualizar Backend/benchmark/generator/index.js para incluir la nueva template
6. Actualizar docs/benchmark-results.md con la nueva categoría

Descripción de la categoría: [DESCRIPCIÓN]
Fórmulas involucradas: [LISTA]
Dificultades (easy/medium/hard): distribución 30%/50%/20%
```

### Evaluar nuevo modelo

```
Escribe script de evaluación para [NOMBRE_MODELO] en FinanceBench.

Categorías a evaluar: [todas | lista específica]
Script de entrada: Backend/benchmark/scripts/evaluate.js (o crear nuevo si no existe)

El script debe:
1. Leer casos de Backend/benchmark/dataset/
2. Enviar cada caso al modelo via su API
3. Puntuar con rubric 0-100 (Accuracy 35%, Conceptual 25%, Reasoning 20%, Completeness 15%, Consistency 5%)
4. Guardar resultados en Backend/benchmark/results/[modelo]_results.json
5. Generar reporte de resumen en docs/benchmark-results.md

API del modelo: [DETALLES o SERVICE FILE]
Rate limits a respetar: [LIMITS]
```

### Feature frontend (React 19 + Charts)

```
Implementa [COMPONENTE/FEATURE] en el frontend de FinanceBench.
Stack: React 19, Vite 6.3.5, Chart.js + Recharts

Estado: React Context API
- CurrencyContext — conversión de moneda
- ScenarioContext — escenarios (optimista/pesimista/normal)
- AIChatContext — chat con AI advisor

Si es visualización de resultados del benchmark:
- Usar Recharts para comparaciones multi-modelo
- Datos desde Backend/benchmark/results/
- Exportable a Excel/JSON

Componente padre: [NOMBRE]
Datos requeridos: [LISTA]
Tipo de gráfico: [bar | line | radar | scatter]
```

## Mapa de archivos clave

```
Backend/
  src/
    models/
      Project.js        ← 2248 líneas, núcleo de cálculos
    services/
      claudeService.js
      aiAdvisor.js
      groqChatService.js
  benchmark/
    generator/
      templates/        ← 10 templates (una por categoría)
      index.js
    dataset/
      cases/            ← 249 casos validados (NO modificar schema)
    results/            ← resultados por modelo evaluado
    scripts/            ← scripts de evaluación y análisis

docs/
  paper/                ← 11 secciones del paper
  audit/                ← 12 archivos de auditoría de fórmulas
  benchmark-results.md  ← tabla comparativa de modelos
  code-intelligence.md  ← mapa del código

Investigacion/          ← SOLO LECTURA
  Contexto_Del_Proyecto.md
  Instrucciones_Redaccion.md
  Referencias.md
```
