# FinanceBench — Automated Benchmark Execution

You are executing a financial analysis benchmark. Your job is to process prompt files one by one.

## Instructions

1. List all `.txt` files in the `cases/` folder
2. For each file, in order:
   a. Read the `.txt` file
   b. Extract ONLY the content between `═══ INICIO DEL PROMPT` and `═══ FIN DEL PROMPT`
   c. Follow the instructions in that prompt — perform the complete financial analysis
   d. Generate the JSON with the exact structure requested (meta + inputs + analysis with all 4 scenarios)
   e. Write the JSON to: `results/MODEL_FOLDER/<same_filename_but_.json>`
3. Skip any file that already has a corresponding `.json` in the results folder (resume support)
4. After each file, report: `✅ Done: <filename> (X of Y)`

## MODEL_FOLDER mapping

Use the folder that matches YOUR model:
- Claude Sonnet 4.6 → `claude-sonnet-4`
- Claude Haiku 4.5 → `claude-haiku-4`
- GPT-4o → `gpt-4o`
- GPT-4.1 → `gpt-4.1`
- Gemini 2.5 Flash → `gemini-2.5-flash`

## Critical rules

- Return ONLY valid JSON in each file — no markdown, no explanation, no code blocks
- Copy the `meta` and `inputs` sections EXACTLY from the prompt — do NOT change any values
- All calculations must follow the 17 rules specified in each prompt
- Temperature = 0 behavior: be as precise and deterministic as possible
- Each JSON file must have: `{ "meta": {...}, "inputs": {...}, "analysis": {...} }`

## Start

Read the first `.txt` file in `cases/` and begin. Process ALL files sequentially. Do not stop until all are done.
