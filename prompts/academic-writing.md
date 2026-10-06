# Academic Writing — FinanceBench / NeurIPS/ACL

## Estilo: inglés técnico, primera persona plural, formato NeurIPS/ACL

### Reglas de estilo

- **Persona**: primera persona plural — "We evaluate", "We propose", "We demonstrate", "Our results show"
- **Citas NeurIPS**: numéricas — [1], [2], [3] — ordenadas por orden de aparición
- **Citas ACL**: (Apellido, año) — si target cambia a ACL/EMNLP
- **Párrafos**: 4-8 oraciones, UNA idea principal por párrafo
- **Sin bullets en prosa** — convertir a oraciones conectadas
- **Sin lenguaje vago** — no "various", "numerous", "it is worth noting"
- **Cada afirmación empírica**: número exacto + cita — "we observe a 23.4% improvement [1]"
- **Reproducibilidad**: suficiente detalle metodológico para que otro lab replique

### Estructura paper NeurIPS

1. **Abstract** — 150-250 palabras: problema, propuesta, método, resultados clave
2. **Introduction** — motivación, gap, contribuciones (bulleted list), structure
3. **Related Work** — 4-6 categorías, 2-3 papers por categoría, cómo nos diferenciamos
4. **Methodology** — dataset construction, evaluation framework, scoring rubric
5. **Experiments** — setup, models, metrics
6. **Results** — tablas, figuras, análisis por categoría
7. **Discussion** — patrones, limitaciones, implications
8. **Conclusion** — summary, future work
9. **References** — formato NeurIPS

### Contribuciones declaradas (para Introduction)

1. FinanceBench: 249 validated test cases across 10 financial analysis categories
2. Scoring rubric: weighted 0-100 scale with 5 sub-criteria for financial accuracy
3. Comprehensive evaluation of 8 state-of-the-art LLMs
4. Open-source dataset and evaluation framework for financial AI research

### Prompt de redacción de sección

```
Act as co-author of FinanceBench (Fuentes Licero, [afiliación institucional omitida], 2026).

Write [SECTION NAME] with these constraints:
- Style: NeurIPS technical English, first person plural
- Length: [X words / X paragraphs]
- Must include: [specific evidence, citations, numbers]
- Avoid: hedging language, bullets in prose, uncited claims
- Tone: precise, reproducible, technical

Previous section ends with:
[PASTE LAST PARAGRAPH]

Notes/draft to develop:
[PASTE NOTES]
```

### Prompt de revisión NeurIPS

```
Review the following text for FinanceBench (NeurIPS submission):
1. Are there empirical claims without citations or exact numbers?
2. Are there paragraphs with more than one main idea?
3. Is the language precise enough for reproducibility?
4. Are citations in correct NeurIPS format [N]?
5. Does the text read as first person plural throughout?

For each issue: cite the problematic sentence and suggest a revised version.

Text:
[PASTE TEXT]
```

### Referencias clave del benchmark (ya validadas)

**LLM evaluation frameworks**: HELM [1], MMLU [2], BIG-bench [3]
**Numerical reasoning**: Chain-of-Thought [4], GSM8K [5], NumericBench [6]
**Financial LLMs**: FinQA [7], BloombergGPT [8], FinBen/PIXIU [9]
**Comparative evaluation**: Chatbot Arena [10], Nadeau et al. [11]
**Benchmark validation**: Artstein & Poesio [12], Krippendorff [13], BERTScore [14]
**Prompt engineering**: Sahoo et al. [15], ProTeGi [16]
**Financial democratization**: Polanco RCT [17], Yang et al. [18]
**AI ethics in finance**: FSB [19], BIS FSI [20]

Ver referencias completas en `Investigacion/Referencias.md` y `prompts-library/mis-prompts-anteriores/Referencias.md`.
