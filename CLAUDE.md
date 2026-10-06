# CLAUDE.md — FinanceBench

## Qué es

Benchmark de LLMs sobre evaluación financiera de proyectos de inversión: 1000
casos sintéticos de solo entradas (`benchmark/dataset/`), un oráculo
determinista (`engine/Project.js`, motor congelado de Viabilidad Negocios en el
commit `31f24a0`) y un motor de comparación campo a campo
(`src/compareAnalysis.js`). Incluye el paper en borrador (`paper/`) y los
resultados de 9 modelos (`benchmark/prompts/results/`). Ver `README.md` y
`.claude/context.md` (contexto de investigación).

## Reglas

- **`engine/Project.js` no se edita** para "arreglar" algo: es el oráculo con el
  que se calcularon los resultados publicados. Cambiarlo es una versión nueva
  del benchmark (ver `engine/README.md`).
- **El dataset es determinista** (semilla por caso en `benchmark/generator/index.js`, PRNG Mulberry32 en
  `benchmark/generator/utils.js`).
  Después de tocar el generador, `npm run generate:dataset` y `git diff --stat
  benchmark/dataset` tienen que salir vacíos, salvo que el cambio sea a
  propósito y se versione.
- **Los pesos de la métrica y el esquema de los casos son fijos**
  (`docs/decisions/001-models-and-metrics.md`).
- Nunca se commitea un `.env` ni una API key; solo `benchmark/.env.example`.
- `investigacion/` es material de referencia del paper: solo lectura.
- `importAll.js` y `aggregate.js` dependen de la app privada (API en
  `localhost:5000` y su MongoDB); el resto corre solo.

## Comandos

```
npm install
npm run generate:dataset
npm run benchmark:validate
npm test
```

## Agentes

- `evaluator` — aplica la métrica compuesta 0-100 a respuestas de modelos.
- `academic-writer` — redacción del paper en `paper/`.
