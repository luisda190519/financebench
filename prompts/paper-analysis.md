# Paper Analysis — FinanceBench

## Propósito

Analizar papers académicos para situar FinanceBench en la literatura de evaluación de LLMs y análisis financiero con IA.

## Campos de interés

- Benchmarks para evaluar LLMs (HELM, MMLU, BIG-bench, SuperGLUE)
- Razonamiento numérico y matemático en LLMs (GSM8K, MathBench)
- LLMs aplicados a finanzas (FinQA, BloombergGPT, FinBen, PIXIU)
- Evaluación comparativa de modelos (Chatbot Arena, MT-Bench)
- Metodología de construcción de benchmarks (validación, anotación, kappa)
- Prompt engineering para tareas financieras
- Democratización del conocimiento financiero con IA

## Prompt de análisis

```
Analyze the following paper for FinanceBench positioning (Fuentes Licero, [afiliación institucional omitida], 2026).

Extract:
1. **Full citation** — NeurIPS format [N] or (Author, Year) for ACL
2. **Research question** — one sentence
3. **Methodology** — benchmark construction approach, evaluation metrics, number of test cases
4. **Key findings** — max 5 with exact numbers (accuracy %, improvements, model rankings)
5. **Models evaluated** — which LLMs, which versions
6. **Financial tasks covered** — if any (NPV, IRR, ratio analysis, etc.)
7. **Limitations declared** — what the paper acknowledges
8. **Gap for FinanceBench** — what this paper doesn't cover that our benchmark addresses
9. **Related Work category** — [LLM evaluation | numerical reasoning | financial LLMs | comparative evaluation | methodology]
10. **Direct comparison possible** — can we benchmark against their dataset/metrics?

Paper:
[PASTE ABSTRACT OR FULL TEXT]
```

## Obsidian note format

Save in `01-PROJECTS/benchmark-financiero/papers/Author_Year_keywords.md`:

```markdown
---
tags: [paper/llm-evaluation, paper/finance-ai, YYYY]
author: Last, F.
year: YYYY
category: [llm-evaluation | numerical-reasoning | financial-llms | comparative | methodology]
---
# [Author, Year] — [Short title]

**Citation**: [NeurIPS format]

**Research question**: [one sentence]

**Benchmark**: [N] test cases, [N] categories, [N] models

**Key findings**:
- [finding with number]
- [finding with number]

**Models evaluated**: [list]

**Financial tasks**: [list or "none"]

**Limitations**: [list]

**Gap for FinanceBench**: [what we cover that they don't]

**Related Work category**: [category name]
```

## Papers already reviewed and integrated

See `Investigacion/Referencias.md` for the full categorized reference list (8 categories, 40+ papers).

### Categories in FinanceBench Related Work

1. **LLM Evaluation Benchmarks** — HELM, MMLU, BIG-bench, SuperGLUE, TruthfulQA
2. **Numerical and Mathematical Reasoning** — CoT, GSM8K, NumericBench, MathBench
3. **LLMs in Finance** — FinQA, BloombergGPT, FinBen/PIXIU, FinanceBench (FP), DocFinQA
4. **Comparative LLM Evaluation** — Chatbot Arena, Nadeau et al., FinBen leaderboard
5. **Benchmark Validation Methodology** — Artstein & Poesio, Krippendorff, LLMs-as-Judges
6. **Prompt Engineering** — Sahoo et al., ProTeGi, Promptomatix, CoT variants
7. **Financial Democratization** — Polanco RCT, Yang et al., Finlingo
8. **AI Ethics in Finance** — FSB, BIS FSI, CFA Institute, MAS
