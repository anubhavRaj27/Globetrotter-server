import fs from "fs";
import path from "path";
import fetch from "node-fetch"; // on Node <18: npm install node-fetch
import { fileURLToPath } from "url";

// ─── derive __dirname in ESM ───────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── CONFIG ────────────────────────────────────────────────────────────────
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.0-flash";
const ENDPOINT_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
const TEMPERATURE = 0.7;
const MAX_TOKENS = 2048;
const MAX_RETRIES = 5;
const INITIAL_BACKOFF = 1000; // in ms

// ─── HELPER: callGemini with retry/backoff and correct content extraction ────
async function callGemini(promptText, retries = MAX_RETRIES, backoff = INITIAL_BACKOFF) {
  try {
    const res = await fetch(ENDPOINT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: {
          temperature: TEMPERATURE,
          maxOutputTokens: MAX_TOKENS
        }
      })
    });

    if (!res.ok) {
      const errTxt = await res.text();
      if (res.status === 503 && retries > 0) {
        console.warn(`Gemini overloaded (503). Retrying in ${backoff}ms... (${retries} left)`);
        await new Promise(r => setTimeout(r, backoff));
        return callGemini(promptText, retries - 1, backoff * 2);
      }
      throw new Error(`Gemini API ${res.status}: ${errTxt}`);
    }

    const { candidates } = await res.json();
    if (!candidates || !candidates.length) {
      throw new Error("No candidates in Gemini response");
    }

    const contentObj = candidates[0].content;
    let raw = "";
    if (typeof contentObj === "string") {
      raw = contentObj;
    } else if (typeof contentObj.text === "string") {
      raw = contentObj.text;
    } else if (Array.isArray(contentObj.parts)) {
      raw = contentObj.parts.map(p => p.text || "").join("");
    } else {
      throw new Error("Unexpected Gemini content format");
    }

    return raw.trim();
  } catch (err) {
    if (retries > 0) {
      console.warn(`Error calling Gemini: ${err.message}. Retrying in ${backoff}ms... (${retries} left)`);
      await new Promise(r => setTimeout(r, backoff));
      return callGemini(promptText, retries - 1, backoff * 2);
    }
    throw err;
  }
}

// ─── HELPER: safely JSON.parse, stripping markdown fences ───────────────────
function safeParse(raw) {
  if (raw.startsWith("```")) {
    raw = raw.replace(/^```(?:json)?\s*/, "").replace(/```$/, "").trim();
  }
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("❌ RAW GEMINI RESPONSE:\n", raw);
    throw new Error("Failed to parse JSON from Gemini response");
  }
}

// ─── MAIN: iterative generation to 70 unique entries ───────────────────────
async function main() {
  const starterPath = path.join(__dirname, "starter.json");
  let starterRaw;
  try {
    starterRaw = fs.readFileSync(starterPath, "utf8");
  } catch (err) {
    console.error("Could not read starter.json:", err.message);
    process.exit(1);
  }

  let starter;
  try {
    starter = JSON.parse(starterRaw);
  } catch {
    console.error("Malformed JSON in starter.json:\n", starterRaw);
    process.exit(1);
  }

  const TARGET = 20;
  const existing = new Set(starter.map(d => d.city));
  const expanded = [...starter];

  while (expanded.length < TARGET) {
    const need = TARGET - expanded.length;
    const batchSize = Math.min(20, need);
    console.log(`Need ${need} more entries; requesting ${batchSize} from Gemini...`);

    const prompt = `
You are a JSON generator for a travel trivia dataset.
Return exactly a JSON array of ${batchSize} objects, each with:
  - city (string)
  - country (string)
  - clues (array of 2 strings)
  - fun_fact (array of 2 strings)
  - trivia (array of 2 strings)
No extra keys, no commentary, no markdown fences.

Generate ${batchSize} entries.
`.trim();

    let raw;
    try {
      raw = await callGemini(prompt);
    } catch (err) {
      console.error(`Batch fetch error: ${err.message}. Retrying loop.`);
      continue;
    }

    let newBatch;
    try {
      newBatch = safeParse(raw);
    } catch {
      console.error("Skipping batch due to parse error.");
      continue;
    }

    if (!Array.isArray(newBatch)) {
      console.error("Unexpected response format, not an array:", newBatch);
      continue;
    }

    newBatch.forEach(entry => {
      if (!existing.has(entry.city)) {
        existing.add(entry.city);
        expanded.push(entry);
        console.log(`  + ${entry.city}`);
      } else {
        console.log(`  - duplicate, skipped: ${entry.city}`);
      }
    });
  }

  const outPath = path.join(__dirname, "expanded.json");
  fs.writeFileSync(outPath, JSON.stringify(expanded, null, 2), "utf8");
  console.log(`✅ Done! ${expanded.length} unique entries written to expanded.json`);
}

main().catch(err => {
  console.error("Fatal error:", err.message);
  process.exit(1);
});
