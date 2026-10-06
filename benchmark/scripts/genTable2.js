#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const s = require(path.join(ROOT, 'paper/benchmark-docs/analysis/reports/statistical_results.json'));
const pairs = s.pairwise_wilcoxon;

const models = ['deepseek-chat','claude-opus-4.6','claude-haiku-4','gpt-5.3','gpt-5.4','grok-code','claude-sonnet-4.6','gemini-3.1-pro','gemini-3-flash'];
const names = ['DeepSeek','Opus 4.6','Haiku 4','GPT-5.3','GPT-5.4','Grok','Sonnet 4.6','Gem.Pro','Gem.Flash'];
const display = {
  'deepseek-chat':'DeepSeek Chat','claude-opus-4.6':'Claude Opus 4.6','claude-haiku-4':'Claude Haiku 4',
  'gpt-5.3':'GPT-5.3','gpt-5.4':'GPT-5.4','grok-code':'Grok Code','claude-sonnet-4.6':'Claude Sonnet 4.6',
  'gemini-3.1-pro':'Gemini 3.1 Pro','gemini-3-flash':'Gemini 3 Flash'
};

const lines = [];
lines.push('\\begin{table}[t]');
lines.push('\\centering');
lines.push('\\scriptsize');
lines.push('\\caption{Pairwise Wilcoxon signed-rank test p-values. $^{***}$: $p<0.001$, $^{**}$: $p<0.01$, $^{*}$: $p<0.05$.}');
lines.push('\\label{tab:significance}');
lines.push('\\begin{tabular}{l' + 'c'.repeat(models.length - 1) + '}');
lines.push('\\toprule');
lines.push(' & ' + names.slice(0, -1).join(' & ') + ' \\\\');
lines.push('\\midrule');

for (let i = 1; i < models.length; i++) {
  const cells = [names[i]];
  for (let j = 0; j < i; j++) {
    const key1 = `${display[models[j]]} vs ${display[models[i]]}`;
    const key2 = `${display[models[i]]} vs ${display[models[j]]}`;
    const p = pairs[key1]?.p_value || pairs[key2]?.p_value || 1;
    let sig = '';
    if (p < 0.001) sig = '$^{***}$';
    else if (p < 0.01) sig = '$^{**}$';
    else if (p < 0.05) sig = '$^{*}$';

    cells.push(p < 0.001 ? `<.001${sig}` : `${p.toFixed(3)}${sig}`);
  }
  lines.push(cells.join(' & ') + ' \\\\');
}

lines.push('\\bottomrule');
lines.push('\\end{tabular}');
lines.push('\\end{table}');

const outFile = path.join(ROOT, 'paper/benchmark-docs/tables/table2_significance.tex');
fs.writeFileSync(outFile, lines.join('\n'));
console.log('Saved table2_significance.tex');
