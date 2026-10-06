# Task 83 — Conclusions & Recommendations

## Objective
Synthesize all findings into actionable conclusions for practitioners, researchers, and the broader field.

## Dependencies
- Task 82 (findings report)

---

## Document Structure

### 1. Key Findings Summary (5–7 bullet points)
Each finding must include:
- Concrete number (accuracy %, p-value, gap size)
- Comparison context (vs baseline, vs other models)
- Significance level

Example format:
> "GPT-5.4 achieves 87.3% overall accuracy, significantly outperforming open-source models (avg 62.1%, p<0.001, McNemar's test with Bonferroni correction)."

### 2. Model Rankings

**Overall Ranking Table** (1st through 9th):
| Rank | Model | Accuracy | MAPE | Best Task | Worst Task |
|------|-------|----------|------|-----------|------------|

**Best Model by Task Category**:
| Task | Best Model | Accuracy | Runner-Up |
|------|-----------|----------|-----------|
| NPV | ? | ?% | ? |
| IRR | ? | ?% | ? |
| ... | ... | ... | ... |

**Best Model by Use Case**:
| Use Case | Recommended Model | Rationale |
|----------|------------------|-----------|
| Maximum accuracy | ? | Highest overall + most tasks won |
| Budget-conscious | ? | Best accuracy-to-cost ratio |
| Speed-critical | ? | Acceptable accuracy with lowest latency |
| Open-source required | ? | Best among non-proprietary |

### 3. Practical Recommendations

**For entrepreneurs/business users**:
- Which model to trust for specific financial calculations
- Confidence thresholds: "Trust NPV calculations when using X model (92% accurate)"
- When to seek human expert review (which tasks are unreliable)

**For developers building financial AI tools**:
- Model selection matrix (accuracy × cost × latency)
- Ensemble strategies: combine models for different task types?
- Validation approaches: which calculations to double-check programmatically

**For researchers**:
- Priority areas for improvement (worst-performing task categories)
- Training data gaps suggested by error patterns
- Prompt engineering opportunities

### 4. Research Implications
- What FinanceBench reveals about current LLM numerical reasoning
- Comparison with prior LLM financial benchmarks (if literature exists)
- Contribution to understanding of LLM capabilities and limitations
- Implications for LLM architecture (attention to numerical precision)

### 5. Limitations of This Study
- **Scope**: Colombian business context, COP currency — may not generalize globally
- **Prompt format**: Single-shot, structured prompt — chain-of-thought may improve results
- **Model versions**: Specific versions tested; performance may change with updates
- **Ground truth**: Oracle is deterministic but formula-based; doesn't capture real-world nuance
- **Sample**: 1000 cases across 10 types — some types may be underrepresented in training data
- **No fine-tuning**: All models tested zero-shot without task-specific training
- **Cost not measured**: Actual API costs per model not tracked in this study

### 6. Future Work
1. **Extended benchmark**: More project types, international contexts, multiple currencies
2. **Prompt optimization**: Chain-of-thought, few-shot, retrieval-augmented approaches
3. **Fine-tuning experiments**: Task-specific fine-tuning on financial calculation data
4. **Cross-lingual evaluation**: Same cases in English, Spanish, Portuguese
5. **Temporal analysis**: Re-run benchmark as models are updated
6. **Ensemble methods**: Combining multiple model outputs for improved accuracy
7. **Human baseline**: Compare LLM performance against human financial analysts
8. **Real-world validation**: Test on actual business plans (not synthetic cases)

---

## Implementation

**Script**: Manual writing informed by data from Tasks 78–82

---

## Output
- `docs/benchmark/analysis/conclusions.md` — Complete conclusions document
- Ready to adapt into paper's Discussion & Conclusion sections

## Acceptance Criteria
- [ ] 5–7 key findings with concrete numbers
- [ ] Complete model rankings (overall + by task + by use case)
- [ ] Practical recommendations for 3 audiences
- [ ] Honest limitations section (≥5 limitations)
- [ ] Future work section (≥6 directions)
- [ ] All claims supported by data from earlier tasks
