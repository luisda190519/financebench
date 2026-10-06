# Section 5: Experimental Setup — Plan

## Objective
Provide sufficient detail for exact replication of the evaluation. Models, prompts, and infrastructure must be precisely documented.

## Word Count Target
600–800 words

## Tables
- **Table 3**: Models evaluated

## Structure (3 subsections)

---

### 5.1 Models Evaluated (200–250 words)

**Table 3**: 10 LLMs spanning proprietary and open-source

| Model | Provider | Type | Est. Params | API/Access |
|-------|----------|------|-------------|------------|
| GPT-4o | OpenAI | Proprietary | ~200B | OpenAI API |
| GPT-4-Turbo | OpenAI | Proprietary | ~200B | OpenAI API |
| Claude 3.5 Sonnet | Anthropic | Proprietary | ~100B | Anthropic API |
| Claude 3 Opus | Anthropic | Proprietary | ~200B | Anthropic API |
| Gemini 2.0 Flash | Google | Proprietary | ~100B | Google AI API |
| Gemini 1.5 Pro | Google | Proprietary | ~200B | Google AI API |
| LLaMA 3 70B | Meta | Open-Source | 70B | Together/Groq API |
| Mistral Large | Mistral AI | Open-Source | ~100B | Mistral API |
| DeepSeek R1 | DeepSeek | Open-Source | ~70B | DeepSeek API |
| Qwen 2.5 72B | Alibaba | Open-Source | 72B | Together API |

**Narrative points**:
- Selection criteria: top-performing models from Chatbot Arena leaderboard + major providers + leading open-source options
- Mix of model sizes to enable scaling analysis
- 6 proprietary + 4 open-source enables meaningful gap analysis
- Exact API versions and snapshot dates to be recorded at evaluation time

**References**:
- Chatbot Arena [Cat 4] — model ranking context
- FinBen [Cat 3/4] — models they evaluated for comparison
- Nadeau et al. [Cat 4] — factuality/hallucination benchmarking methodology

---

### 5.2 Prompting Strategy (200–250 words)

**Prompt design** from `Backend/benchmark/generator/generatePrompts.js`:

**System prompt elements**:
1. **Role**: "You are an expert financial analyst specializing in business viability assessment for Latin American small and medium enterprises."
2. **Output format**: "Return ONLY a valid JSON object matching the analysis schema. No explanations, no markdown, no code blocks."
3. **17 explicit calculation rules** covering:
   - Revenue: `sellingPrice × (1 - discount/100) × quantity × periodsPerYear × (1 + growthRate)^(year-1)`
   - COGS: `unitCost × quantity × periodsPerYear × (1 + growthRate)^(year-1)`
   - Expense frequency normalization: monthly ×12, quarterly ×4, annual ×1, one-time year 0
   - Depreciation: straight-line `value / usefulLife`
   - Amortization: French system with monthly compounding
   - Tax with loss carryforward
   - Unlevered CF: `EBIT + depreciation - taxes`
   - Levered CF: `netProfit + depreciation - principalPayment`
   - NPV: `Σ CF_t / (1+r)^t`
   - IRR: rate where NPV = 0
   - Payback: linear interpolation
4. **Input data**: Full JSON of the case inputs

**Design rationale**:
- **Zero-shot baseline**: No examples provided — we evaluate raw capability, not prompt optimization
- **Explicit rules**: Reduces ambiguity about financial conventions; tests whether the model can *follow instructions* while computing correctly
- **Temperature = 0**: Deterministic output for reproducibility
- Future work: test CoT prompting, few-shot examples, tool-augmented approaches

**References**:
- Chain-of-Thought [Cat 2] — future prompting comparisons
- Sahoo et al. prompt engineering survey [Cat 6] — prompting landscape
- Li zero-shot survey [Cat 6] — zero-shot design principles
- ProTeGi [Cat 6] — automatic prompt optimization (future work)

---

### 5.3 Implementation Details (200–300 words)

**Evaluation pipeline**:

1. **Case selection**: Initial evaluation on 30 representative cases (3 per type: 1 simple, 1 medium, 1 complex); scalable to full 1,000
2. **Prompt generation**: `generatePrompts.js` creates per-model prompt files from case inputs + prompt template
3. **API execution**: Each model queried via its respective API
   - Temperature: 0
   - Max tokens: sufficient for complete JSON response (~4,000–8,000 tokens depending on project life)
   - Single run per case (deterministic with temp=0)
4. **Output parsing**: LLM JSON response submitted to `POST /api/projects/import/json` endpoint
   - `validateImportJSON()` checks structural validity
   - `detectImportMode()` identifies as COMPLETE mode (has analysis)
   - `transformInputsToSchema()` normalizes rates (0.33 → 33 if needed)
5. **Oracle calculation**: `project.calculateMetrics()` independently computes ground truth from the same inputs
6. **Comparison**: `compareAnalysis(json.analysis, appAnalysis)` produces field-by-field comparison stored in `project.benchmarkComparison`
7. **Aggregation**: Script reads all comparisons from MongoDB; produces breakdowns by:
   - Model × overall accuracy
   - Model × task category
   - Model × project type
   - Model × difficulty level
   - Model × scenario

**Reproducibility guarantees**:
- All seeds fixed and published
- Prompt templates versioned in repository
- Oracle code open-source
- API model versions recorded

**Cost tracking**: API costs per model per case recorded (to be reported)

---

## References (~6 total)
- Chatbot Arena [Cat 4]
- FinBen [Cat 3/4]
- Chain-of-Thought [Cat 2]
- Sahoo et al. PE survey [Cat 6]
- Li zero-shot survey [Cat 6]
- Nadeau et al. [Cat 4]

## Technical Details from Codebase
- `generatePrompts.js` — complete prompt template (lines 81–179) and model list (lines 199–208)
- `projectController.js` — import pipeline: `validateImportJSON()`, `detectImportMode()`, `transformInputsToSchema()`, `compareAnalysis()`
- `importAll.js` — batch import script

## Writing Notes
- Write this section SECOND (after Benchmark Design)
- Must be precise enough that a reader can replicate the entire evaluation
- Include the actual prompt template (or substantial excerpt) — reviewers want to see it
- Justify every design decision (why temp=0, why zero-shot, why these specific models)
