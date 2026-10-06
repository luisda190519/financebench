# Section 3: Related Work — Plan

## Objective
Position FinanceBench within the landscape of existing benchmarks, financial AI, and numerical reasoning research. Identify clear gaps that justify our work. This must be a *critical narrative*, not a list of papers.

## Word Count Target
800–1000 words

## Structure (4 subsections)

---

### 3.1 LLM Evaluation Benchmarks (200–250 words)

**Narrative arc**: General benchmarks are comprehensive but don't capture domain-specific financial computation.

**Papers to discuss**:
1. **HELM** (Liang et al., 2023) — Holistic evaluation of 30+ models across 42 scenarios with multi-metric assessment. Established the standard for systematic LLM evaluation. *Gap*: finance is underrepresented; no structured computation tasks.
2. **MMLU / MMLU-Pro** (Hendrycks et al., 2021; Yuan et al., 2024) — 57 knowledge domains including basic finance as multiple-choice. *Gap*: tests knowledge retrieval, not multi-step computation. A model can know what NPV is without being able to compute it correctly.
3. **BIG-bench** (Srivastava et al., 2022) — 200+ tasks including arithmetic and reasoning. *Gap*: no financial domain tasks; arithmetic tasks are much simpler than financial projections.
4. **GLUE/SuperGLUE** (Wang et al., 2019) — Established the paradigm of standardized NLU evaluation with public leaderboards. *Lesson*: FinanceBench follows this model of standardized, reproducible evaluation.
5. **Chatbot Arena** (Wang et al., 2024) — Crowdsourced pairwise comparisons. *Gap*: domain-agnostic; preference-based rather than accuracy-based.

**Closing gap statement**: "While these benchmarks have advanced our understanding of general LLM capabilities, none evaluates the specific combination of arithmetic precision, formula application, and multi-step reasoning required for structured financial analysis."

---

### 3.2 Financial AI Systems (200–250 words)

**Narrative arc**: Financial AI benchmarks exist but focus on NLP tasks, not numerical computation.

**Papers to discuss**:
1. **FinBen** (Xie et al., NeurIPS 2024) — The most comprehensive financial benchmark: 40+ datasets, 20+ tasks, 20+ LLMs. *Key distinction*: tasks are NLP-oriented (information extraction, QA, summarization, sentiment, stock prediction). Does not evaluate whether LLMs can perform multi-step financial calculations. FinanceBench is *complementary*: the numerical/analytical component to FinBen's NLP evaluation.
2. **PIXIU** (Xie et al., 2023) — FinMA model + instruction data + benchmark. *Gap*: focused on classification and prediction, not computation.
3. **FinQA** (Chen et al., EMNLP 2021) — Numerical reasoning over financial tables. *Closest to our work*: requires arithmetic over financial data. *Gap*: reading comprehension over existing tables vs. generating complete financial projections from raw business inputs.
4. **BloombergGPT** (Wu et al., 2023) — Domain-specific LLM trained on financial corpus. *Gap*: evaluated only on NLP tasks; numerical financial analysis capability unknown.
5. **FinGPT** (Yang et al., 2023) — Open-source financial LLM framework. Emphasizes democratization but lacks structured evaluation of computational accuracy.
6. **FinanceAgentBench** (2025) — Evaluates LLM agents on equity research tasks. *Complementary*: focuses on agentic information gathering; FinanceBench focuses on numerical computation.
7. **Li et al. survey** (ICAIF 2023) + **Nie et al. survey** (2024) — Comprehensive reviews mapping the LLM-in-finance landscape. Both identify the gap in structured evaluation.

**Closing gap statement**: "Existing financial benchmarks evaluate language understanding *about* finance but not the ability to *perform* financial analysis — the computational heart of financial decision-making."

---

### 3.3 Numerical Reasoning in LLMs (200–250 words)

**Narrative arc**: LLMs struggle with numerical reasoning; financial analysis is a uniquely challenging combination of arithmetic, domain conventions, and multi-step logic.

**Papers to discuss**:
1. **Chain-of-Thought** (Wei et al., NeurIPS 2022) — Demonstrates that explicit step-by-step prompting improves arithmetic and reasoning performance. *Relevance*: justifies our zero-shot baseline (future work can test CoT) and explains why financial analysis — which inherently requires multi-step reasoning — is challenging.
2. **GSM8K** (Cobbe et al., 2021) — Grade-school math word problems with step-by-step solutions. *Comparison*: FinanceBench problems are significantly more complex (multiple income items, 4 scenarios, loan amortization schedules, tax carryforward).
3. **MATH** (Hendrycks et al., NeurIPS 2021) — Competition-level math. *Distinction*: tests symbolic manipulation; financial analysis tests applied numerical computation with domain conventions.
4. **DROP** (Dua et al., NAACL 2019) — Discrete reasoning over paragraphs. *Relevance*: closest in spirit (arithmetic from context) but not financial.
5. **NumericBench** (Li et al., 2024) — Decomposes numeracy into atomic skills. *Key finding*: even GPT-4o fails at seemingly simple numerical tasks. Supports our hypothesis that financial calculations will reveal significant LLM limitations.
6. **Minerva** (Lewkowycz et al., 2022) — Specialized math models improve on STEM benchmarks. *Implication*: domain-specialized training may be needed for financial computation.
7. **Mathematical reasoning survey** (Wang et al., 2025) — Frames challenges in tool-augmented reasoning relevant to financial analysis.

**Closing gap statement**: "Financial reasoning requires a specific combination of arithmetic, formula application, temporal reasoning over multi-year projections, and constraint handling (tax rules, amortization schedules) not captured by existing mathematical benchmarks."

---

### 3.4 Domain-Specific Benchmarks (150–200 words)

**Narrative arc**: Other domains have successfully created specialized benchmarks; finance needs the same.

**Papers to discuss**:
1. **MedQA** (medical domain) and **LegalBench** (legal domain) as successful examples of domain-specific LLM evaluation that uncovered limitations invisible in general benchmarks.
2. **Artstein & Poesio** (2008) — Inter-coder agreement methodology. *Relevance*: FinanceBench sidesteps annotation disagreement by using a computational oracle, but this methodology is relevant for qualitative tasks (viability recommendations).
3. **LLMs-as-Judges survey** (2024) — Automated evaluation using LLMs. *Relevance*: potential for evaluating qualitative outputs (explanations, recommendations) in future extensions.
4. **BERTScore** (Zhang et al., ICLR 2020) — Semantic evaluation metric. *Relevance*: for evaluating text-based outputs in tasks like viability recommendations.

**Closing gap statement**: "Following the successful paradigm of domain-specific benchmarks in medicine and law, FinanceBench provides the first comprehensive evaluation framework for structured financial analysis, uniquely leveraging a deterministic computational oracle to eliminate annotation subjectivity."

---

## References Summary (~25 total)

**Cat 1 (5)**: HELM, MMLU, MMLU-Pro, BIG-bench, GLUE/SuperGLUE, Chatbot Arena
**Cat 2 (4–5)**: CoT, GSM8K, MATH, DROP, NumericBench, Minerva, math reasoning survey
**Cat 3 (5–6)**: FinBen, PIXIU, FinQA, BloombergGPT, FinGPT, FinanceAgentBench, Li survey, Nie survey
**Cat 4 (2)**: Chatbot Arena (overlap with Cat 1), Nadeau et al.
**Cat 5 (2)**: Artstein & Poesio, LLMs-as-Judges, BERTScore
**Cat 6 (1–2)**: CoT (overlap with Cat 2), prompt engineering surveys

## Writing Notes
- This is a *narrative*, not a list: each paragraph tells a story about a research area and ends with the gap FinanceBench fills
- Be respectful of prior work — FinanceBench is *complementary* to FinBen/PIXIU, not a replacement
- Each cited paper must serve a clear purpose (establish context, identify gap, or inform methodology)
- Write this section THIRD (after Benchmark Design and Experimental Setup)
