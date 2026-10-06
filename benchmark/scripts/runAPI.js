'use strict';
/**
 * runAPI.js — Automated benchmark runner for API-based models.
 *
 * Reads prompt files, sends to LLM APIs, saves JSON results.
 * Handles rate limiting with batch mode for Groq free tier.
 *
 * Supported providers:
 *   - Groq (free tier): llama-3.3-70b, gpt-oss-120b
 *   - DeepSeek API:     deepseek-chat (V3), deepseek-reasoner (R1)
 *
 * Usage:
 *   node benchmark/scripts/runAPI.js --model llama-3.3-70b
 *   node benchmark/scripts/runAPI.js --model deepseek-chat --subset all
 *   node benchmark/scripts/runAPI.js --model all --subset all
 *
 * Environment variables:
 *   GROQ_API_KEY     — for Groq models (free tier)
 *   DEEPSEEK_API_KEY — for DeepSeek models
 */

const fs   = require('fs');
const path = require('path');

// Load .env from the repo root
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// ── Config ──────────────────────────────────────────────────────────
const PROMPTS_DIR = path.join(__dirname, '../prompts');
const CASES_DIR   = path.join(PROMPTS_DIR, 'cases');
const RESULTS_DIR = path.join(PROMPTS_DIR, 'results');

const MODEL_CONFIG = {
  // ── Groq (free tier) — batch mode: 3 requests, then wait 2 min ──
  'llama-3.3-70b': {
    provider: 'groq',
    apiModel: 'llama-3.3-70b-versatile',
    envKey: 'GROQ_API_KEY',
    baseUrl: 'https://api.groq.com/openai/v1',
    maxTokens: 16384,
    batchSize: 3,        // requests per batch
    batchDelayMs: 120000, // 2 minutes between batches
  },
  'gpt-oss-120b': {
    provider: 'groq',
    apiModel: 'openai/gpt-oss-120b',
    envKey: 'GROQ_API_KEY',
    baseUrl: 'https://api.groq.com/openai/v1',
    maxTokens: 16384,
    batchSize: 3,
    batchDelayMs: 120000,
  },
  // ── DeepSeek API — generous rate limits ──
  'deepseek-chat': {
    provider: 'deepseek',
    apiModel: 'deepseek-chat',
    envKey: 'DEEPSEEK_API_KEY',
    baseUrl: 'https://api.deepseek.com/v1',
    maxTokens: 8192,
    batchSize: 5,
    batchDelayMs: 10000,
  },
  'deepseek-reasoner': {
    provider: 'deepseek',
    apiModel: 'deepseek-reasoner',
    envKey: 'DEEPSEEK_API_KEY',
    baseUrl: 'https://api.deepseek.com/v1',
    maxTokens: 8192,
    batchSize: 3,
    batchDelayMs: 15000,
  },
};

// ── CLI ─────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (name) => {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 ? args[idx + 1] : null;
};

const modelArg  = getArg('model') || 'all';
const subsetArg = getArg('subset') || 'all'; // default to all 1000
const startFrom = parseInt(getArg('start') || '0', 10);

// ── Helpers ─────────────────────────────────────────────────────────

/** Extract the prompt content between START/END markers */
function extractPrompt(fileContent) {
  const startMarker = '\n═══ INICIO DEL PROMPT';
  const endMarker   = '\n═══ FIN DEL PROMPT';
  const startIdx = fileContent.indexOf(startMarker);
  const endIdx   = fileContent.indexOf(endMarker, startIdx + startMarker.length);
  if (startIdx === -1 || endIdx === -1) return fileContent;
  const afterStart = fileContent.indexOf('\n', startIdx + 1) + 1;
  return fileContent.substring(afterStart, endIdx).trim();
}

/** Sleep for ms milliseconds */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/** Format ms as human-readable time */
function formatTime(ms) {
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}m ${rem}s`;
}

/** Call OpenAI-compatible chat completion API with retry */
async function callAPI(config, prompt, apiKey, retries = 2) {
  const body = {
    model: config.apiModel,
    messages: [
      { role: 'user', content: prompt }
    ],
    temperature: 0,
    max_tokens: config.maxTokens,
  };

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 600000); // 10 min timeout

      const response = await fetch(`${config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (response.status === 429) {
        const waitTime = attempt === 0 ? 120000 : 180000; // 2-3 min
        console.log(`\n   ⏳ Rate limited (429), waiting ${formatTime(waitTime)}...`);
        await sleep(waitTime);
        continue;
      }

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API ${response.status}: ${errText.substring(0, 300)}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || '';
    } catch (err) {
      if (attempt < retries && (err.message.includes('429') || err.message.includes('ECONNRESET'))) {
        console.log(`\n   ⏳ Retry ${attempt + 1}/${retries}, waiting 120s...`);
        await sleep(120000);
        continue;
      }
      throw err;
    }
  }
  throw new Error('All retries exhausted (rate limited)');
}

/** Try to extract valid JSON from a response that may have markdown wrapping */
function extractJSON(text) {
  if (!text) return null;
  // Try direct parse first
  try {
    return JSON.parse(text);
  } catch { /* noop */ }

  // Try extracting from ```json ... ``` blocks
  const jsonMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1]);
    } catch { /* noop */ }
  }

  // Try finding the first { ... } block
  const firstBrace = text.indexOf('{');
  const lastBrace  = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(text.substring(firstBrace, lastBrace + 1));
    } catch { /* noop */ }
  }

  return null;
}

/** Select cases based on subset */
function selectCases(allFiles, subsetType) {
  if (subsetType === 'all') return allFiles;

  const byType = {};
  for (const f of allFiles) {
    const parts = f.replace('.txt', '').split('_');
    const type = parts[2];
    if (!byType[type]) byType[type] = { simple: [], medium: [], complex: [] };
    const diff = parts[3];
    if (byType[type][diff]) byType[type][diff].push(f);
  }

  if (subsetType === 'quick') {
    return Object.values(byType).map(d => d.simple[0]).filter(Boolean);
  }

  // 'full' — 1 simple + 1 medium + 1 complex per type = 30
  const selected = [];
  for (const diffs of Object.values(byType)) {
    if (diffs.simple[0])  selected.push(diffs.simple[0]);
    if (diffs.medium[0])  selected.push(diffs.medium[0]);
    if (diffs.complex[0]) selected.push(diffs.complex[0]);
  }
  return selected;
}

// ── Main ────────────────────────────────────────────────────────────
async function runModel(modelName) {
  const config = MODEL_CONFIG[modelName];
  if (!config) {
    console.error(`❌ Unknown model: ${modelName}`);
    console.error(`   Available: ${Object.keys(MODEL_CONFIG).join(', ')}`);
    return;
  }

  const apiKey = process.env[config.envKey];
  if (!apiKey) {
    console.error(`❌ Missing ${config.envKey} environment variable for ${modelName}`);
    return;
  }

  const outputDir = path.join(RESULTS_DIR, modelName);
  fs.mkdirSync(outputDir, { recursive: true });

  // Get all prompt files
  const allFiles = fs.readdirSync(CASES_DIR).filter(f => f.endsWith('.txt')).sort();
  let files = selectCases(allFiles, subsetArg);

  // Skip already completed
  const existing = new Set(
    fs.readdirSync(outputDir)
      .filter(f => f.endsWith('.json'))
      .map(f => f.replace('.json', ''))
  );
  const pending = files.filter(f => !existing.has(f.replace('.txt', '')));

  // Apply --start offset
  const toProcess = pending.slice(startFrom);

  const { batchSize, batchDelayMs } = config;
  const totalBatches = Math.ceil(toProcess.length / batchSize);
  const estimatedTime = totalBatches * batchDelayMs;

  console.log(`\n🚀 Running ${modelName} (${config.provider})`);
  console.log(`   API model:    ${config.apiModel}`);
  console.log(`   Subset:       ${subsetArg} (${files.length} total)`);
  console.log(`   Already done: ${files.length - pending.length}`);
  console.log(`   To process:   ${toProcess.length}`);
  console.log(`   Batch mode:   ${batchSize} requests → ${formatTime(batchDelayMs)} pause`);
  console.log(`   Est. time:    ~${formatTime(estimatedTime)}`);
  console.log('');

  if (toProcess.length === 0) {
    console.log(`   ✅ All cases already completed for ${modelName}\n`);
    return;
  }

  let passed = 0, failed = 0;
  const startTime = Date.now();
  let batchCount = 0; // tracks requests in current batch

  for (let i = 0; i < toProcess.length; i++) {
    const file = toProcess[i];
    const caseName = file.replace('.txt', '');
    const filePath = path.join(CASES_DIR, file);
    const outPath  = path.join(outputDir, `${caseName}.json`);

    const elapsed = formatTime(Date.now() - startTime);
    process.stdout.write(`   [${i + 1}/${toProcess.length}] (${elapsed}) ${caseName}...`);

    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const prompt = extractPrompt(fileContent);

      const rawResponse = await callAPI(config, prompt, apiKey);
      const parsed = extractJSON(rawResponse);

      if (parsed) {
        fs.writeFileSync(outPath, JSON.stringify(parsed, null, 2));
        passed++;
        process.stdout.write(` ✅\n`);
      } else {
        // Save raw response for debugging
        fs.writeFileSync(outPath + '.raw.txt', rawResponse);
        failed++;
        process.stdout.write(` ❌ (could not parse JSON, raw saved)\n`);
      }
    } catch (err) {
      failed++;
      process.stdout.write(` ❌ ${err.message.substring(0, 100)}\n`);
    }

    batchCount++;

    // Batch rate limiting: after batchSize requests, pause
    if (batchCount >= batchSize && i < toProcess.length - 1) {
      batchCount = 0;
      const batchNum = Math.floor(i / batchSize) + 1;
      console.log(`   ⏸️  Batch ${batchNum}/${totalBatches} done (${passed} ✅ ${failed} ❌). Waiting ${formatTime(batchDelayMs)}...`);
      await sleep(batchDelayMs);
    }
  }

  const totalTime = formatTime(Date.now() - startTime);
  console.log(`\n📊 ${modelName} Complete (${totalTime})`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}\n`);
}

async function main() {
  const models = modelArg === 'all'
    ? Object.keys(MODEL_CONFIG)
    : [modelArg];

  for (const model of models) {
    await runModel(model);
  }

  console.log('🏁 All done!');
}

main().catch(err => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
