# 4. Results

## 4.1 Overall Performance

We evaluated nine large language models on 1,000 financial viability test cases spanning 10 project types, 4 economic scenarios, and 3 difficulty levels, yielding approximately 2.66 million individual field comparisons against oracle-computed ground truth. Table 1 summarizes the aggregate performance of each model ranked by classification accuracy and mean absolute percentage error (MAPE).

Claude Opus 4.6 achieved the highest overall accuracy at 88.47% with a MAPE of 7.83%, followed by Claude Sonnet 4.6 (86.31%, MAPE 10.27%) and GPT-5.4 (83.92%, MAPE 12.41%). At the lower end of the distribution, Gemini 3 Flash recorded 57.64% accuracy with a MAPE of 41.57%, representing a 30.83 percentage-point gap relative to the leading model. The full ranking is presented in Table 1, and the accuracy distribution across models is visualized in Figure 1.

A natural three-tier structure emerged from the results. Tier 1 models (accuracy > 82%) comprised Claude Opus 4.6, Claude Sonnet 4.6, GPT-5.4, and Gemini 3.1 Pro (81.84%), all of which maintained MAPE values below 15%. Tier 2 models (accuracy 70--82%) included GPT-5.3 (78.26%, MAPE 18.73%), Claude Haiku 4 (75.13%, MAPE 22.14%), and DeepSeek Chat (69.71%, MAPE 27.86%). Tier 3 models (accuracy < 70%) consisted of Grok Code (62.38%, MAPE 36.29%) and Gemini 3 Flash (57.64%, MAPE 41.57%), both exhibiting MAPE values exceeding 35%. This tiered classification (Figure 2) suggests that model capability in financial reasoning is not uniformly distributed but instead clusters around distinct performance plateaus.

## 4.2 Proprietary vs. Open-Source Models

A salient finding concerns the performance gap between proprietary and open-source models. Proprietary models averaged 78.80% accuracy, whereas open-source models averaged 66.05% accuracy---a gap of 12.75 percentage points (Table 2). This disparity was statistically significant (p < 0.001, Welch's t-test) and persisted across all project types and difficulty levels, as shown in Figure 3.

The gap was most pronounced on complex multi-step calculations. On cases requiring discounted cash flow analysis with multiple financing sources, proprietary models averaged 81.3% accuracy versus 59.4% for open-source models (a 21.9 pp gap). Conversely, on simpler ratio-based metrics such as profit margin estimation, the gap narrowed to 7.2 pp, suggesting that open-source models struggle disproportionately with computational depth rather than conceptual understanding.

## 4.3 Per-Metric Analysis

Performance varied substantially across the 14 core financial metrics evaluated. Table 3 presents accuracy by metric category. Gross margin and operating margin were the most reliably computed metrics, with the ensemble average exceeding 80% accuracy. Net Present Value (NPV) and Internal Rate of Return (IRR) proved the most challenging, with ensemble averages of 68.4% and 65.9% respectively.

Claude Opus 4.6 demonstrated particular strength on NPV calculations (91.2% accuracy), outperforming the next-best model (Claude Sonnet 4.6, 87.8%) by 3.4 pp. The performance advantage of Tier 1 models was most evident on time-value-of-money metrics (NPV, IRR, payback period), where the mean Tier 1 accuracy was 86.7% compared to 71.2% for Tier 2 and 54.3% for Tier 3 (Figure 4).

Break-even analysis accuracy showed a distinctive pattern: models either performed very well (> 85%) or very poorly (< 60%), with few intermediate results. This bimodal distribution (Figure 5) suggests that break-even computation requires a threshold level of reasoning capability that some models possess and others lack entirely.

## 4.4 Difficulty Level Effects

We stratified the 1,000 test cases into three difficulty levels---basic (n = 334), intermediate (n = 333), and advanced (n = 333)---based on the number of financial variables, the complexity of inter-variable dependencies, and the presence of multi-period projections.

On basic cases, all nine models achieved above 70% accuracy, and the inter-model variance was relatively small (SD = 8.1 pp). Tier 1 models averaged 94.2% on basic cases, and even Gemini 3 Flash achieved 72.4%. As difficulty increased to the intermediate level, overall accuracy dropped by a mean of 14.3 pp, and the inter-model variance widened (SD = 12.6 pp). On advanced cases, overall accuracy declined by an additional 11.8 pp relative to intermediate, and inter-model variance reached its maximum (SD = 16.9 pp). Figure 6 illustrates these difficulty-dependent trajectories for each model.

Notably, Claude Opus 4.6 exhibited the most graceful degradation across difficulty levels, declining from 95.1% (basic) to 89.4% (intermediate) to 79.5% (advanced)---a total drop of 15.6 pp. By contrast, Gemini 3 Flash declined from 72.4% to 55.8% to 45.8%---a drop of 26.6 pp. This differential degradation rate (Figure 7) is a key discriminator of model robustness.

## 4.5 Error Type Analysis

We classified errors into five categories: arithmetic errors, formula selection errors, temporal reasoning errors, unit/scale errors, and logical reasoning errors. Table 4 presents the error type distribution across model tiers.

Arithmetic errors were the most common category overall, accounting for 34.2% of all errors. However, their prevalence differed markedly by tier: arithmetic errors constituted 28.1% of Tier 1 errors but 41.7% of Tier 3 errors. Formula selection errors---where the model applied an incorrect financial formula---accounted for 22.8% of errors overall and were the dominant error type for Tier 2 models (27.3%).

Temporal reasoning errors, which involve incorrect handling of multi-period cash flows or discount rates, were disproportionately concentrated in advanced-difficulty cases (accounting for 38.6% of advanced-case errors versus 12.1% of basic-case errors). This finding suggests that multi-period financial reasoning remains a frontier challenge even for state-of-the-art models.

Unit and scale errors (e.g., confusing thousands with millions, or monthly with annual figures) were relatively rare in Tier 1 models (4.2% of errors) but constituted 15.8% of Tier 3 errors, indicating that weaker models lack robust dimensional awareness in financial contexts.

## 4.6 Scenario-Dependent Performance

Each test case was evaluated under four economic scenarios: normal, optimistic, pessimistic, and controlled. Model accuracy was highest under the normal scenario (ensemble mean 79.4%) and lowest under the pessimistic scenario (ensemble mean 72.1%). The optimistic and controlled scenarios yielded intermediate accuracy (76.8% and 75.2%, respectively). Figure 8 displays the per-model accuracy breakdown across scenarios.

The pessimistic scenario proved particularly challenging because it required models to reason about downside risk, apply higher discount rates, and account for reduced revenue projections simultaneously. Claude Opus 4.6 maintained the most stable cross-scenario performance (range of 4.8 pp between best and worst scenario), while Grok Code exhibited the widest variability (range of 18.3 pp), suggesting that weaker models are more sensitive to scenario framing effects.

## 4.7 Project Type Variation

Among the 10 project types evaluated, technology startups and agricultural ventures exhibited the highest inter-model variance in accuracy (SD = 17.4 pp and 16.8 pp, respectively), while retail and food service projects showed the lowest variance (SD = 9.2 pp and 10.1 pp). Figure 9 presents the accuracy heatmap by model and project type.

This pattern likely reflects differences in financial complexity: technology startups involve high-growth projections, multiple funding rounds, and intangible asset valuations, whereas retail projects typically involve more straightforward cost-revenue structures. Tier 1 models maintained relatively consistent performance across project types (within-model SD = 5.3 pp), whereas Tier 3 models exhibited pronounced project-type sensitivity (within-model SD = 14.7 pp).
