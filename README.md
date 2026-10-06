# FinanceBench

Benchmark de modelos de lenguaje (LLM) sobre **evaluación financiera de
proyectos de inversión**: dado un negocio descrito solo por sus entradas
(inversión, financiamiento, ingresos, gastos, tasas), ¿qué tan bien calcula un
LLM el flujo de caja, el VPN, la TIR, el payback, el punto de equilibrio y los
estados financieros, y qué tan bien razona sobre su viabilidad?

- **1000 casos sintéticos de solo entradas** (`benchmark/dataset/`), generados
  de forma determinista (una semilla por caso) a partir de 10 plantillas de industria
  (cafetería, software, retail, construcción, manufactura, consultoría,
  e-commerce, agricultura, finca raíz, hospedaje) y tres niveles de dificultad.
- **El oráculo es determinista**: la respuesta correcta la calcula el motor
  congelado en `engine/Project.js`, no un humano ni otro modelo. Ver
  [`engine/README.md`](engine/README.md).
- **Comparación campo a campo** (`src/compareAnalysis.js`): cada valor del LLM
  se compara contra el oráculo y se clasifica como *match* (< 1 %), *small*
  (1-5 %) o *large* (> 5 %).
- Resultados de 9 modelos en `benchmark/prompts/results/` y el borrador del
  paper en `paper/`.

## Estructura

```
benchmark/          generador del dataset, dataset, prompts, resultados y scripts
  generator/        index.js (genera los 1000 casos), validate.js, generatePrompts.js, templates/
  dataset/          cases/*.json, index.json, all_cases.json
  prompts/          cases/*.txt (un prompt por caso), results/<modelo>/, tracking/
  scripts/          runAPI.js, importAll.js, aggregate.js, exportResults.js, analyzeAll.js, ...
engine/             Project.js: motor de cálculo congelado (oráculo) + README con su origen
src/                compareAnalysis.js e importJSON.js, extraídos del producto
tests/              tests de Jest del generador y del motor de comparación
paper/              secciones del paper (00-11) y benchmark-docs/ (análisis, tablas, figuras)
audit/              auditoría de las fórmulas financieras del motor (12 notas)
investigacion/      contexto, referencias e instrucciones de redacción del paper
prompts/            prompts de trabajo usados durante la investigación
docs/decisions/     decisiones de diseño del benchmark (categorías y métrica)
.claude/            contexto y agentes (evaluator, academic-writer) para Claude Code
```

## Instalar y correr

Requiere Node.js 18 o superior.

```bash
npm install
npm run generate:dataset      # regenera los 1000 casos (determinista: no cambia el dataset publicado)
npm run benchmark:validate    # chequeo estructural de los 1000 casos
npm test                      # tests de Jest
```

Otros comandos:

| Comando | Qué hace | Necesita |
|---|---|---|
| `npm run generate:prompts` / `:quick` / `:all` | Genera los prompts `.txt` a partir del dataset | nada |
| `npm run benchmark:run-groq` / `:run-deepseek` / `:run-api` | Manda los prompts a la API del modelo y guarda las respuestas | `GROQ_API_KEY` o `DEEPSEEK_API_KEY` en `.env` |
| `node benchmark/scripts/analyzeAll.js` | Carga las respuestas de `prompts/results/`, recalcula el oráculo, compara y calcula las métricas; escribe en `paper/benchmark-docs/analysis/reports/` | nada |
| `npm run benchmark:export-results` | Exporta resultados agregados a CSV | resultados previos |
| `npm run benchmark:import-all` | Importa respuestas de LLM para compararlas | **requiere la app** (ver abajo) |
| `npm run benchmark:aggregate` | Agrega las comparaciones guardadas | **requiere la app** (MongoDB con datos de la app) |

Para las variables de entorno, copiá `benchmark/.env.example` a `.env` en la
raíz y completá solo lo que vayas a usar. Nunca se commitea un `.env`.

### Lo que requiere la app

`benchmark/scripts/importAll.js` postea cada caso a la API HTTP de Viabilidad
Negocios (`http://localhost:5000/api`, con un JWT en `BENCHMARK_TOKEN`), que
recalcula con su motor y guarda la comparación en MongoDB;
`benchmark/scripts/aggregate.js` lee esas comparaciones de MongoDB. Esa app es
privada y no está en este repo: estos dos scripts se conservan para documentar
cómo se produjeron los resultados, no para correrlos sin ella. El resto del
benchmark (dataset, prompts, ejecución contra las APIs, análisis y tests) corre
solo.

Nota: los prompts de `benchmark/prompts/cases/` mencionan la ruta
`Backend/benchmark/prompts/results/...` como destino de la respuesta. Es la ruta
que tenían cuando se corrió el benchmark; se dejó tal cual para que los prompts
sean idénticos a los evaluados. En este repo esa carpeta es
`benchmark/prompts/results/`.

## Licencias

- **Código**: MIT, ver [`LICENSE`](LICENSE).
- **Datos** (dataset, prompts, resultados de modelos, tablas y figuras):
  CC-BY-4.0, ver [`LICENSE-DATA`](LICENSE-DATA).

Titular de ambas: Luis (luisda190519).

## Cómo citarlo

```bibtex
@misc{financebench2026,
  author = {Luis},
  title  = {FinanceBench: A Benchmark for Evaluating Large Language Models on Financial Project Appraisal},
  year   = {2026},
  note   = {URL pendiente}
}
```

## Origen

La afiliación institucional del autor se omitió en esta publicación (aparece como «[afiliación institucional omitida]» en el paper y los prompts).


FinanceBench nació dentro de **Viabilidad Negocios**, un producto privado para
evaluar la viabilidad financiera de negocios, y se separó a este repo el
2026-10-05 a partir del commit `31f24a0` de aquel repo, sin su historia. El
motor de cálculo de `engine/` es una copia congelada de ese commit y no se
sincroniza con el producto.
