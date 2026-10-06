'use strict';
/**
 * Batch import script — imports all JSON cases from a directory via the API.
 *
 * Usage:
 *   node benchmark/scripts/importAll.js --dir benchmark/dataset/cases
 *   node benchmark/scripts/importAll.js --dir /path/to/llm-outputs --mode complete
 *
 * Environment variables:
 *   API_BASE_URL   — default: http://localhost:5000/api
 *   BENCHMARK_TOKEN — JWT token for authentication (get from browser localStorage)
 */

const fs   = require('fs');
const path = require('path');

// ── Argument parsing ──────────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (name) => {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 ? args[idx + 1] : null;
};

const DIR       = getArg('dir') || path.join(__dirname, '../dataset/cases');
const MODE      = getArg('mode') || 'input-only';
const API_BASE  = process.env.API_BASE_URL || 'http://localhost:5000/api';
const TOKEN     = process.env.BENCHMARK_TOKEN;

if (!TOKEN) {
  console.error('\n❌ Error: BENCHMARK_TOKEN environment variable is required.');
  console.error('   Get your token from the browser: localStorage.getItem("token")');
  console.error('   Then run: BENCHMARK_TOKEN=<token> node benchmark/scripts/importAll.js --dir ...\n');
  process.exit(1);
}

if (!fs.existsSync(DIR)) {
  console.error(`\n❌ Directory not found: ${DIR}\n`);
  process.exit(1);
}

const files = fs.readdirSync(DIR).filter(f => f.endsWith('.json')).sort();
const total = files.length;

if (total === 0) {
  console.error(`\n❌ No JSON files found in: ${DIR}\n`);
  process.exit(1);
}

// ── HTTP helper ───────────────────────────────────────────────────────
async function postJSON(url, body, token) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });
  return response.json();
}

// ── Main ──────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n🚀 Benchmark Batch Import`);
  console.log(`   Directory: ${DIR}`);
  console.log(`   Mode:      ${MODE}`);
  console.log(`   Files:     ${total}`);
  console.log(`   API:       ${API_BASE}\n`);

  let passed = 0, failed = 0;
  const results = [];
  const errors  = [];

  for (let i = 0; i < files.length; i++) {
    const file     = files[i];
    const filePath = path.join(DIR, file);

    let json;
    try {
      json = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (err) {
      failed++;
      errors.push({ file, error: `Failed to parse JSON: ${err.message}` });
      process.stdout.write(`\r   Progress: ${i + 1}/${total} | ✅ ${passed} | ❌ ${failed}   `);
      continue;
    }

    try {
      const response = await postJSON(`${API_BASE}/projects/import/json`, json, TOKEN);

      if (response.success) {
        passed++;
        results.push({
          file,
          success: true,
          projectId: response.projectId,
          mode: response.mode,
          comparisonSummary: response.comparisonSummary || null
        });
      } else {
        failed++;
        errors.push({ file, error: response.message || JSON.stringify(response.errors) });
      }
    } catch (err) {
      failed++;
      errors.push({ file, error: err.message });
    }

    process.stdout.write(`\r   Progress: ${i + 1}/${total} | ✅ ${passed} | ❌ ${failed}   `);
  }

  // Write results log
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const logDir = path.join(__dirname, '../logs');
  fs.mkdirSync(logDir, { recursive: true });

  const logFile = path.join(logDir, `import-run-${timestamp}.json`);
  fs.writeFileSync(logFile, JSON.stringify({ timestamp: new Date().toISOString(), total, passed, failed, results, errors }, null, 2));

  console.log(`\n\n📊 Import Complete`);
  console.log(`   Total:  ${total}`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   Log: ${logFile}`);

  if (failed > 0) {
    console.log('\n   First 5 errors:');
    for (const e of errors.slice(0, 5)) {
      console.log(`   [${e.file}]: ${e.error}`);
    }
  }
}

main().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
