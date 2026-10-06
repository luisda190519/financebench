# FinanceBench — Manual Testing Guide

Complete instructions for running the benchmark manually across multiple AI systems.

---

## Folder Structure

```
prompts/
├── README.md              ← You are here
├── cases/                 ← 30 ready-to-paste prompt .txt files
│   ├── case_0001_cafeteria_simple.txt
│   ├── case_0041_cafeteria_medium.txt
│   ├── case_0081_cafeteria_complex.txt
│   └── ... (30 files total, 3 per business type)
├── results/               ← Save AI responses here
│   ├── gpt-4o/
│   ├── gpt-4-turbo/
│   ├── claude-3-5-sonnet/
│   ├── claude-3-opus/
│   ├── gemini-2-0-flash/
│   ├── gemini-1-5-pro/
│   ├── llama-3-70b/
│   ├── mistral-large/
│   ├── deepseek-r1/
│   └── qwen-2-5-72b/
└── tracking/
    └── results_tracker.csv  ← Fill in scores after each session
```

---

## The 30 Benchmark Cases

| # | Case ID | Business Type | Difficulty |
|---|---------|---------------|------------|
| 1 | case_0001 | Cafetería / Restaurante | Simple |
| 2 | case_0041 | Cafetería / Restaurante | Medium |
| 3 | case_0081 | Cafetería / Restaurante | Complex |
| 4 | case_0101 | Software / SaaS | Simple |
| 5 | case_0141 | Software / SaaS | Medium |
| 6 | case_0181 | Software / SaaS | Complex |
| 7 | case_0201 | Tienda Retail | Simple |
| 8 | case_0241 | Tienda Retail | Medium |
| 9 | case_0281 | Tienda Retail | Complex |
| 10 | case_0301 | Construcción | Simple |
| 11 | case_0341 | Construcción | Medium |
| 12 | case_0381 | Construcción | Complex |
| 13 | case_0401 | Manufactura | Simple |
| 14 | case_0441 | Manufactura | Medium |
| 15 | case_0481 | Manufactura | Complex |
| 16 | case_0501 | Consultoría | Simple |
| 17 | case_0541 | Consultoría | Medium |
| 18 | case_0581 | Consultoría | Complex |
| 19 | case_0601 | E-commerce | Simple |
| 20 | case_0641 | E-commerce | Medium |
| 21 | case_0681 | E-commerce | Complex |
| 22 | case_0701 | Agricultura | Simple |
| 23 | case_0741 | Agricultura | Medium |
| 24 | case_0781 | Agricultura | Complex |
| 25 | case_0801 | Finca Raíz | Simple |
| 26 | case_0841 | Finca Raíz | Medium |
| 27 | case_0881 | Finca Raíz | Complex |
| 28 | case_0901 | Hospedaje / Hotel | Simple |
| 29 | case_0941 | Hospedaje / Hotel | Medium |
| 30 | case_0981 | Hospedaje / Hotel | Complex |

---

## AI Platforms to Test

### Priority 1 — Proprietary (Best for Paper)

| Model | Platform | URL | Notes |
|-------|----------|-----|-------|
| **GPT-4o** | ChatGPT | [chat.openai.com](https://chat.openai.com) | Requires ChatGPT Plus ($20/mo) |
| **GPT-4-Turbo** | ChatGPT | [chat.openai.com](https://chat.openai.com) | Select model from dropdown |
| **Claude 3.5 Sonnet** | Claude.ai | [claude.ai/chat](https://claude.ai/chat) | Free tier available |
| **Claude 3 Opus** | Claude.ai | [claude.ai/chat](https://claude.ai/chat) | Requires Claude Pro |
| **Gemini 2.0 Flash** | Google AI Studio | [aistudio.google.com](https://aistudio.google.com) | Free, no account needed |
| **Gemini 1.5 Pro** | Google AI Studio | [aistudio.google.com](https://aistudio.google.com) | Free, no account needed |

### Priority 2 — Open Source (Via Web Interface)

| Model | Platform | URL | Notes |
|-------|----------|-----|-------|
| **LLaMA 3 70B** | Meta AI | [meta.ai](https://www.meta.ai) | Free |
| **LLaMA 3 70B** | Groq Cloud | [console.groq.com/playground](https://console.groq.com/playground) | Free, very fast |
| **Mistral Large** | Mistral Le Chat | [chat.mistral.ai](https://chat.mistral.ai) | Free |
| **DeepSeek R1** | DeepSeek | [chat.deepseek.com](https://chat.deepseek.com) | Free |
| **Qwen 2.5 72B** | Hugging Face | [huggingface.co/chat](https://huggingface.co/chat) | Free, select model |

### Recommended Testing Order
Start with the simplest/fastest to validate your workflow, then scale up:
1. **Gemini 2.0 Flash** (Google AI Studio — fast, free, no login required)
2. **Claude 3.5 Sonnet** (claude.ai — usually good JSON output)
3. **GPT-4o** (ChatGPT — widely known)
4. Continue with others once the workflow is confirmed

---

## Step-by-Step Testing Protocol

### Before You Start Each Session
- Open the AI platform in one browser tab
- Open a text editor (Notepad, VSCode) in another window
- Have the app running at `http://localhost:5173`

---

### STEP 1 — Open the Prompt File

Navigate to `benchmark/prompts/cases/` and open the `.txt` file for the case you're testing.

The file looks like this:
```
════════════════════════════════════════════
FinanceBench — Case case_0001
Business type: Cafetería / Restaurante
...
════════════════════════════════════════════
INSTRUCTIONS FOR EVALUATOR
  1. Copy everything from "═══ START" to "═══ END"
  ...
═══ INICIO DEL PROMPT ══════════════════════
You are an expert financial analyst...
[full prompt with embedded JSON]
═══ FIN DEL PROMPT ═════════════════════════
```

**Copy only the text between `═══ INICIO DEL PROMPT` and `═══ FIN DEL PROMPT`** (including those lines).

---

### STEP 2 — Paste into the AI

Open the AI platform and start a **new conversation**.

Platform-specific tips:

**ChatGPT (GPT-4o / GPT-4-Turbo):**
- Go to chat.openai.com → New chat
- Select model from the top dropdown: "GPT-4o" or "GPT-4 Turbo"
- Paste the prompt and press Enter
- If the response is cut off, type: "Continue the JSON" until complete

**Claude.ai (Claude 3.5 Sonnet / Claude 3 Opus):**
- Go to claude.ai/chat → New conversation
- Paste and send
- Claude usually returns valid JSON without truncation
- If it adds explanation text before/after, ask: "Return only the JSON, nothing else"

**Google AI Studio (Gemini 2.0 Flash / 1.5 Pro):**
- Go to aistudio.google.com
- Click "Create new prompt"
- Select the model from the top-right dropdown
- Paste in the large text box and click Send (▷)
- Set Temperature to 0 in the left panel for reproducibility

**Groq Cloud (LLaMA 3 70B):**
- Go to console.groq.com/playground
- Select "llama-3.1-70b-versatile" from model dropdown
- Paste prompt and click Submit

**Hugging Face Chat (Qwen / Mistral):**
- Go to huggingface.co/chat
- Select model from the left sidebar
- Paste and send

---

### STEP 3 — Handle the Response

**If the AI returns valid JSON directly:**
→ Go to Step 4.

**If the AI adds markdown code blocks:**
The response will look like:
```json
{
  "inputs": { ... },
  "analysis": { ... }
}
```
→ Copy only what's inside the triple backticks (the JSON object, without the backticks).

**If the JSON is truncated (response cut off mid-way):**
→ Type: `Continue from where you left off, keep the same JSON structure`
→ Then manually merge the two parts in a text editor.

**If the AI refuses or gives a text explanation instead of JSON:**
→ Reply: `Return ONLY a valid JSON object. No explanation text. Start your response with { and end with }`
→ If it still refuses, mark the case as "FAILED" in the tracker.

**If the AI returns invalid JSON (syntax error):**
→ Paste the response into [jsonlint.com](https://jsonlint.com) to identify the error
→ Common fixes: missing closing `}`, trailing comma, NaN instead of null

---

### STEP 4 — Save the Response

Save the JSON as a file in the correct folder:

```
benchmark/prompts/results/<model-name>/<caseId>_<type>_<difficulty>.json
```

**Examples:**
```
results/gpt-4o/case_0001_cafeteria_simple.json
results/claude-3-5-sonnet/case_0001_cafeteria_simple.json
results/gemini-2-0-flash/case_0041_cafeteria_medium.json
```

**Add the `meta` section at the top** (the AI won't include this — add it yourself):

```json
{
  "meta": {
    "exportVersion": "1.0",
    "exportDate": "2025-01-20T14:30:00.000Z",
    "modelTag": "gpt-4o",
    "caseId": "case_0001",
    "projectType": "cafeteria",
    "difficulty": "simple",
    "promptVersion": "v1.0"
  },
  "inputs": { ...AI's copy... },
  "analysis": { ...AI's analysis... }
}
```

---

### STEP 5 — Import into the App and Record the Score

1. Open the app → go to **Project List**
2. Click **"Importar JSON"**
3. Select the saved `.json` file
4. The app compares the AI's analysis against the correct calculation
5. You are redirected to the **Comparison Dashboard**

**Record these numbers from the dashboard:**

| What to record | Where to find it |
|---------------|-----------------|
| Overall Accuracy % | Summary card "Precisión" |
| NPV error % | Row "VPN" in the Normal scenario table |
| IRR error % | Row "TIR" |
| Payback error % | Row "Período de recuperación" |
| Notes | Any anomaly you noticed |

6. Open `tracking/results_tracker.csv` and fill in the row for this case + model.
7. Click **"Descargar Reporte CSV"** on the comparison page to save a detailed report.

---

## Session Planning

### Quick Test (1-2 hours): 1 AI × 10 Simple Cases
Test just the 10 simple cases (one per business type) with a single AI.

Order: case_0001, case_0101, case_0201, case_0301, case_0401, case_0501, case_0601, case_0701, case_0801, case_0901

### Standard Session (3-4 hours): 1 AI × 30 Cases
Test all 30 benchmark cases with one AI. Do all 10 simple first, then medium, then complex.

### Full Benchmark (30-40 hours total): All AIs × 30 Cases
Target for the paper: 10 AIs × 30 cases = 300 interactions.
Plan for multiple days. Batch by AI platform to avoid switching overhead.

### Recommended Daily Schedule
```
Day 1: Gemini 2.0 Flash × 30 cases  (fastest, validate workflow)
Day 2: Claude 3.5 Sonnet × 30 cases
Day 3: GPT-4o × 30 cases
Day 4: GPT-4-Turbo + Claude 3 Opus × 30 cases each
Day 5: Gemini 1.5 Pro + LLaMA 3 70B × 30 cases each
Day 6: Mistral Large + DeepSeek R1 × 30 cases each
Day 7: Qwen 2.5 72B + cleanup/aggregation
```

---

## Aggregating Results After Each Session

After importing all results from one AI into the app:

```bash
cd Backend
npm run benchmark:aggregate
```

This reads MongoDB and generates `results/aggregate-YYYY-MM-DD.json` with:
- Overall accuracy per model
- Accuracy by metric (NPV, IRR, payback)
- Accuracy by business type
- Accuracy by difficulty

Then export CSVs for your paper:
```bash
npm run benchmark:export-results
```

---

## Common Problems and Solutions

| Problem | Solution |
|---------|---------|
| AI returns text, not JSON | Add to the end: "Your entire response must be a single JSON object" |
| JSON too long, AI truncates | Test simpler cases first; or ask AI to return only "normal" scenario first |
| NPV wildly off | AI may have forgotten to subtract initial investment |
| All taxes = 0 | AI may be confused about taxRate format (33 vs 0.33) |
| IRR = "infinity" or "N/A" | Replace with `null` before saving |
| annualData has wrong year count | Manually verify it matches projectLife |
| Import fails with VALIDATION_ERROR | Check that projectName and projectLife are present in inputs |

---

## Notes for the Paper

When writing the Experimental Setup section:

- **Prompt version**: v1.0 (as generated by generatePrompts.js)
- **Prompting strategy**: Zero-shot, structured output
- **Temperature**: 0 (when configurable) or platform default
- **Date range**: Record the dates of your testing sessions
- **Dataset version**: Record SHA-256 of `benchmark/dataset/all_cases.json`

```bash
# Get dataset SHA-256 (run from project root)
certutil -hashfile benchmark/dataset/all_cases.json SHA256
```

Record this hash in your paper's reproducibility section.
