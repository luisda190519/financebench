# Section 11: Ethics Statement — Plan

## Objective
Address responsible use, transparency, and potential societal impact. Required by NeurIPS and expected by reviewers.

## Word Count Target
150–200 words

## Structure
Single section, 3–4 focused paragraphs.

---

### Paragraph 1: Purpose and Responsible Use (50–60 words)
- FinanceBench evaluates LLM *capabilities*, not individual financial decisions
- The benchmark is intended for research and development, not as financial advice
- Explicit warning: LLM outputs should never be the sole basis for real investment decisions, loan applications, or business planning
- Human financial expertise remains essential for high-stakes decisions

### Paragraph 2: Data and Privacy (40–50 words)
- All 1,000 test cases are synthetically generated — no real company data, no personal information, no proprietary financial records
- Business names, parameters, and scenarios are fictional (though realistic)
- The benchmark can be freely shared without privacy concerns

### Paragraph 3: Transparency and Openness (40–50 words)
- Complete open-source release: dataset, generation code, oracle engine, comparison infrastructure, prompts, and evaluation scripts
- Enables independent verification of results and methodology
- Promotes reproducibility and community contribution
- No commercial conflicts of interest

### Paragraph 4: Broader Impact (30–40 words)
- The benchmark aims to improve the safety and reliability of AI-assisted financial analysis
- By identifying failure modes, we help developers build safer tools
- By establishing baselines, we enable progress measurement

---

## References (~4 total)
- FSB report [Cat 8] — financial stability implications of AI (systemic risk motivation)
- Legal/ethical AI in financial services [Cat 8] — accountability framework
- CFA ethical AI chapter [Cat 8] — best practices for responsible AI in finance
- Polanco RCT [Cat 7] — evidence that AI chatbots for finance are a "double-edged sword"

## Writing Notes
- Keep brief and factual — ethics statements should not be performative
- Focus on what the benchmark *does* and *doesn't* do
- Acknowledge the dual-use nature: benchmark helps build better tools, but also highlights risks
- Do not overstate claims about democratization — be measured
