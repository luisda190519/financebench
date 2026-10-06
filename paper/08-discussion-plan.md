# Section 8: Discussion — Plan

## Objective
Interpret findings, draw implications for practice and research, compare with prior work, and propose future directions.

## Word Count Target
600–800 words

## Structure (4 subsections)

---

### 8.1 Key Findings Summary (150–200 words)

**Recap 3–4 headline findings** with specific numbers:

1. **Overall capability**: "[Best model] achieves X% field-level accuracy, demonstrating that current LLMs can perform basic financial calculations but struggle with complex multi-step analysis."
2. **Error propagation**: "Accuracy degrades along the computation chain: revenue/COGS (~X%) → P&L metrics (~Y%) → cash flows (~Z%) → NPV/IRR (~W%), confirming that cascading errors are a fundamental challenge."
3. **Task difficulty**: "IRR calculation is the most challenging task (X% accuracy), likely because it requires numerical root-finding — a fundamentally different capability from text generation."
4. **Proprietary vs. open-source**: "The gap averages X percentage points overall but varies dramatically by task: from Y pp on simple arithmetic to Z pp on complex analysis."

**Tone**: Measured, data-driven, avoid superlatives

---

### 8.2 Implications for Practice (200–250 words)

**For developers building financial AI applications**:
- Model selection should be task-specific: [Model A] for cash flow projections, [Model B] for revenue estimation
- Always implement verification layers — even the best model achieves only X% accuracy
- Human-in-the-loop is essential for NPV/IRR calculations and investment decisions
- Open-source models are viable for simpler tasks if cost is a constraint
- Structured output prompting with explicit rules improves reliability but doesn't eliminate errors

**For entrepreneurs and SMEs**:
- AI-generated financial projections should be treated as *starting points*, not final answers
- Critical decisions (investment, loan applications) require human financial review
- The democratization benefit is real — AI can generate a first draft that an advisor refines

**For researchers**:
- FinanceBench reveals that financial numerical reasoning is a distinct capability not captured by existing benchmarks
- Multi-step cascading computation is an unsolved challenge
- Tax loss carryforward and amortization are specific failure modes worth investigating

**References**:
- Polanco RCT [Cat 7] — AI chatbots as educational tools (double-edged sword)
- Yang inclusive financial literacy [Cat 7] — AI in resource-scarce areas
- Guatemala digital training RCT [Cat 7] — digital tools improve entrepreneur outcomes
- FSB stability report [Cat 8] — systemic risk of AI errors in finance
- Sahoo et al. PE survey [Cat 6] — prompt engineering as mitigation

---

### 8.3 Comparison with Prior Work (150–200 words)

**FinBen comparison**:
- FinBen reports GPT-4 leading on most NLP financial tasks; our results [confirm/extend] this to numerical analysis
- Key difference: FinBen's tasks are classification/prediction (binary or categorical accuracy); ours are numerical (continuous error measurement with tolerance thresholds)
- Novel insight: field-level comparison reveals that models often get the *direction* right (positive NPV, correct viability recommendation) but the *magnitude* wrong — a nuance invisible in binary benchmarks

**FinQA comparison**:
- FinQA found models struggle with multi-step arithmetic over financial data; we confirm this extends to *generating* projections, not just answering questions about existing data
- Error types are similar (arithmetic, formula, cascading) but the magnitude is larger in our setting due to the longer computation chains

**References**:
- FinBen [Cat 3]
- FinQA [Cat 3]
- HELM [Cat 1] — comparison of evaluation philosophies

---

### 8.4 Future Directions (150–200 words)

**Immediate extensions**:
1. **Multilingual evaluation**: Test with Spanish prompts (the app's natural language) — does language affect numerical accuracy?
2. **Advanced prompting**: Chain-of-thought, few-shot with worked examples, step-by-step decomposition
3. **Tool-augmented evaluation**: Allow models access to a calculator/spreadsheet tool — does external computation help?
4. **Fine-tuned financial models**: Evaluate FinGPT and other domain-specific models on FinanceBench

**Medium-term research**:
5. **Annual benchmark competition**: Publish leaderboard, accept community submissions (following GLUE/ImageNet model)
6. **Extended task categories**: Add market analysis, portfolio optimization, risk assessment
7. **Real-world validation**: Compare benchmark performance against accuracy on actual client data (with anonymization)
8. **Agent evaluation**: Combine with FinanceAgentBench for end-to-end financial agent assessment

**References**:
- LLM-Eval evolving benchmarks [Cat 1] — benchmark maintenance methodology
- Promptomatix [Cat 6] — automatic prompt optimization
- FinanceAgentBench [Cat 3] — agent evaluation complement
- GLUE/SuperGLUE [Cat 1] — leaderboard paradigm

---

## Writing Notes
- Write after Results and Analysis
- Discussion should be the most "opinionated" section — interpret, don't just report
- Connect every implication to specific data from Results/Analysis
- Future directions should be concrete and achievable, not vague
