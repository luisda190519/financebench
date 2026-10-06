# Section 2: Introduction — Plan

## Objective
Establish the problem, motivate the work, preview contributions, and set up the narrative for the entire paper. Must be compelling for both AI researchers and finance practitioners.

## Word Count Target
1000–1200 words

## Structure (5 paragraphs)

---

### Paragraph 1: Broad Context (150–200 words)

**Topic**: LLM adoption is accelerating in financial services, particularly for SME analysis.

**Key points**:
- LLMs (GPT-4, Claude, Gemini, LLaMA) are being adopted across industries at unprecedented scale
- Financial services are a major adoption vector: 73% of FinTech companies experimenting with LLMs (cite Contexto document stat)
- Entrepreneurs and SMEs increasingly use LLMs for financial projections, viability analysis, business planning — especially in emerging markets where access to professional financial advisors is limited
- Stakes are high: incorrect financial analysis leads to real economic consequences (failed businesses, misallocated capital)
- The democratization of financial analysis through AI is both an opportunity and a risk

**References**:
- HELM [Cat 1] — general LLM evaluation landscape
- Li et al. survey "LLMs in Finance" [Cat 3] — adoption in financial services
- FinGPT [Cat 3] — democratization angle
- FSB report [Cat 8] — systemic risk of AI in finance
- Polanco RCT [Cat 7] — AI chatbots improving financial literacy
- Yang inclusive financial literacy [Cat 7] — AI in resource-scarce areas

**Transition**: "Yet despite this rapid adoption, the fundamental question remains unanswered: how accurate are these models when performing financial calculations?"

---

### Paragraph 2: The Problem (200–250 words)

**Topic**: No standardized benchmark exists for evaluating LLMs on structured financial analysis tasks.

**Key points**:
- Existing general benchmarks (MMLU, HELM, BIG-bench) include some finance-adjacent questions but treat them as multiple-choice knowledge retrieval — not multi-step computation
- Existing financial benchmarks (FinBen, PIXIU) focus on NLP tasks: sentiment classification, named entity recognition, text summarization, stock price prediction
- The critical gap: nobody measures whether an LLM can correctly compute NPV from a 5-year cash flow projection with loan amortization, depreciation schedules, and tax loss carryforward
- FinQA involves numerical reasoning over *existing* financial tables — but not generating complete projections from raw business inputs
- Consequences of this gap:
  - Developers select models arbitrarily for financial applications
  - Entrepreneurs trust unverified AI-generated projections
  - Researchers cannot compare studies on financial LLM capability
  - No quality standards exist for AI-assisted financial analysis

**References**:
- MMLU/MMLU-Pro [Cat 1] — knowledge-based evaluation
- HELM [Cat 1] — multi-scenario but finance underrepresented
- BIG-bench [Cat 1] — 200+ tasks but none financial
- FinBen [Cat 3] — NLP-oriented financial benchmark (40+ datasets, but focused on classification/prediction)
- PIXIU [Cat 3] — FinMA model + benchmark, classification focus
- FinQA [Cat 3] — numerical reasoning over tables, not projection generation
- BloombergGPT [Cat 3] — domain LLM evaluated only on NLP tasks

**Transition**: "This gap is particularly concerning because financial analysis demands a type of reasoning that is known to challenge current LLMs."

---

### Paragraph 3: Why This Is Hard (150–200 words)

**Topic**: Financial analysis requires multi-step numerical reasoning with domain-specific conventions.

**Key points**:
- Financial analysis is a *cascading computation*: revenue flows through COGS, gross profit, expenses, EBITDA, depreciation, interest, taxes (with carryforward), net profit, cash flows — a single error in step 1 propagates through all subsequent steps
- Specific challenges:
  - **Arithmetic precision**: Compound growth, monthly-to-annual frequency normalization, discount factor exponentiation
  - **Formula conventions**: NPV discounting starting at period 0, IRR root-finding algorithms, French amortization system
  - **Conditional logic**: Tax loss carryforward (losses accumulate to offset future income), depreciation only for min(usefulLife, projectLife) years
  - **Multi-scenario consistency**: Same business analyzed under 4 economic scenarios must maintain internal coherence
- LLMs are documented to struggle with exactly these types of tasks

**References**:
- Chain-of-Thought [Cat 2] — improves reasoning but can introduce errors
- GSM8K [Cat 2] — grade-school math benchmark reveals arithmetic failures
- NumericBench [Cat 2] — systematic numeracy gaps even in GPT-4
- MATH dataset [Cat 2] — multi-step reasoning with local errors
- DROP [Cat 2] — discrete reasoning over paragraphs

---

### Paragraph 4: Our Contribution (250–300 words)

**Topic**: We introduce FinanceBench with five specific contributions.

**Key points**:

1. **A ground-truth oracle**: A deterministic calculation engine (`calculateMetrics()`) implementing verified financial formulas — NPV via discounted cash flows, IRR via Newton-Raphson with bisection fallback, French loan amortization, straight-line depreciation, tax with loss carryforward. Unlike human-annotated benchmarks, the oracle produces exact numerical answers.

2. **1,000 deterministic test cases**: Generated using Mulberry32 seeded pseudo-random number generator across 10 business types (cafeteria, software, retail, construction, manufacturing, consulting, e-commerce, agriculture, real estate, hospitality), 3 difficulty levels, ensuring identical dataset regeneration from seeds.

3. **A field-by-field comparison engine**: Comparing LLM outputs against oracle values with three-tier classification — match (≤1% relative error), small difference (1–5%), large difference (>5%) — across up to 316 individual field comparisons per case (4 scenarios × 79 fields each).

4. **Multi-model evaluation**: Systematic evaluation of 10 state-of-the-art LLMs including proprietary (GPT-4o, Claude 3.5 Sonnet, Gemini) and open-source (LLaMA 3, Mistral, DeepSeek, Qwen) under standardized zero-shot conditions.

5. **Open-source release**: Complete dataset, generation code, prompts, comparison infrastructure, and evaluation scripts publicly available for the research community.

**References**:
- GLUE/SuperGLUE [Cat 1] — as benchmark design paradigm exemplars
- FinBen [Cat 3] — as complementary work (NLP vs. numerical)
- Chatbot Arena [Cat 1/4] — as model comparison methodology inspiration

**Transition**: Lead into paper structure.

---

### Paragraph 5: Paper Structure (100–150 words)

**Topic**: Roadmap of the paper.

"The remainder of this paper is organized as follows. Section 2 reviews related work in LLM evaluation, financial AI, and numerical reasoning. Section 3 describes the benchmark design, including the task taxonomy, data generation pipeline, oracle engine, and comparison methodology. Section 4 details the experimental setup: models evaluated, prompting strategy, and implementation. Section 5 presents results across models and task categories. Section 6 provides deeper analysis of failure modes, scaling effects, and the proprietary-open source gap. Section 7 discusses implications for practitioners and researchers. Section 8 acknowledges limitations, and Section 9 concludes with a summary and future directions."

---

## Data Needed
- The "73% of FinTech companies" statistic needs a proper citation (from Contexto document)
- Specific model count and names finalized

## Technical Details from Codebase to Mention
- `calculateMetrics()` as the oracle (don't name the function, describe capability)
- "15+ metrics per scenario per year"
- "Mulberry32 PRNG" for determinism
- "10 business types representative of Latin American SMEs"
- Comparison thresholds: ≤1%, 1–5%, >5%

## Writing Notes
- Write this after Benchmark Design and Related Work are complete
- The hook must capture attention in the first sentence
- Flow: general → specific → contribution → roadmap
- Include concrete numbers (1000 cases, 10 tasks, 4 scenarios, 316 fields) — this is a benchmark paper, data impresses
