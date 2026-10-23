// Cloud narration via the Gemini API's TTS models (free tier, no billing account needed - the
// owner's choice, 2026-09-25). Output contract as tts-cloud.mjs: one WAV per line in
// public/<slug>/vo/ + src/episodes/<slug>/vo.json. Runs on the CI runner, never the owner's PC.
//
// BATCHED (2026-09-25). The free tier allows ~10 TTS requests PER DAY (the first run died on
// "limit: 10 requests per day"), so one request per line (~390 lines) would take ~40 days.
// Three steps, all in .github/workflows/render.yml:
//   1. node scripts/tts-gemini.mjs <slug> [--scenes a,b]   consecutive missing lines are sent as
//      ONE request (≤ CHUNK_CHARS, one paragraph per line); the raw take is saved as
//      public/<slug>/vo/chunks/<hash>.wav + .json (the line list). A chunk already on disk is
//      never re-requested. On the daily-quota 429 it stops and exits 3 ("partial").
//   2. python scripts/align_split.py <slug>               Whisper word timestamps cut each chunk
//      into per-line WAVs (alignment, not silence-guessing) and write the QA report.
//   3. node scripts/tts-gemini.mjs <slug> --manifest      vo.json: real durations where a take
//      exists, estimated (flagged, no audio) elsewhere; exits 3 if a wanted line is missing.
// Takes and chunks are cached by the workflow even when a run fails.
//
// API shape (ai.google.dev/gemini-api/docs/speech-generation, read 2026-09-25): POST
// /v1beta/interactions, model gemini-3.8-flash-tts; the unary response carries a complete WAV
// (RIFF, 24 kHz, mono, 16-bit) as base64 in the interaction's output_audio.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { wavSeconds } from "./lib/wav.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/interactions";
const SAMPLE_RATE = 24000;
const CHUNK_CHARS = Number(process.env.TTS_CHUNK_CHARS ?? 4000); // ≈ 4-5 min of speech per request
const WPM_ESTIMATE = 190;

const [slug, ...flags] = process.argv.slice(2);
if (!slug) {
  console.error("usage: node scripts/tts-gemini.mjs <episode-slug> [--scenes a,b] [--manifest] [--dry-run]");
  process.exit(1);
}
const manifestOnly = flags.includes("--manifest");
const dryRun = flags.includes("--dry-run");
const scenesArg = flags.includes("--scenes") ? flags[flags.indexOf("--scenes") + 1] : process.env.TTS_SCENES;
const onlyScenes = scenesArg ? new Set(scenesArg.split(",").map((s) => s.trim()).filter(Boolean)) : null;

const episodeDir = path.join(ROOT, "..", "episodes", slug);
const script = JSON.parse(fs.readFileSync(path.join(episodeDir, "script.json"), "utf8"));
const outDir = path.join(ROOT, "public", slug, "vo");
const chunkDir = path.join(outDir, "chunks");
fs.mkdirSync(chunkDir, { recursive: true });

// The prebuilt voice the owner picked (Aoede); Gemini has no numeric rate, so pace lives in `style`.
const model = script.geminiModel ?? "gemini-3.8-flash-tts";
const voice = (script.voice ?? "Aoede").replace(/^en-US-Chirp3-HD-/, "");
const style = script.style ?? "clear, warm documentary narration at a brisk, steady pace; no dramatics";
const chunkStyle = `${style}. Each paragraph is a separate line of narration: leave a clear pause of about one second between paragraphs.`;
// TTS_FAKE=espeak (workflow input tts_test): a robotic espeak-ng voice to test the pipeline without
// spending quota. Its takes get different file names, so they can never pass for real ones.
const FAKE = process.env.TTS_FAKE === "espeak";
const cacheKey = `${FAKE ? "espeak|" : ""}${model}|${voice}|${style}`;
const sha = (s) => crypto.createHash("sha1").update(s).digest("hex").slice(0, 10);

// ---- every line and its take file
const lines = [];
for (const scene of script.scenes) {
  for (const [i, line] of scene.lines.entries()) {
    const spoken = line.say ?? line.text;
    const file = `${scene.id}-${String(i).padStart(2, "0")}-${sha(`${cacheKey}|${spoken}`)}.wav`;
    const wanted = !onlyScenes || onlyScenes.has(scene.id);
    lines.push({ scene: scene.id, index: i, text: line.text, spoken, file, pauseAfter: line.pause ?? 0.25, wanted });
  }
}
const hasTake = (l) => fs.existsSync(path.join(outDir, l.file));

// ---- step 3: manifest
if (manifestOnly) {
  const manifest = lines.map((l) => {
    const abs = path.join(outDir, l.file);
    if (fs.existsSync(abs)) return { scene: l.scene, index: l.index, text: l.text, file: `${slug}/vo/${l.file}`, seconds: wavSeconds(fs.readFileSync(abs)), pauseAfter: l.pauseAfter };
    const seconds = (l.spoken.split(/\s+/).length / WPM_ESTIMATE) * 60;
    return { scene: l.scene, index: l.index, text: l.text, file: `${slug}/vo/${l.file}`, seconds, pauseAfter: l.pauseAfter, estimated: true };
  });
  const keep = new Set(lines.map((l) => l.file));
  // A take that a raw chunk still lists is kept even when its line was re-voiced since: the aligner re-cuts a
  // whole chunk whenever one of its takes is missing, so deleting a superseded take made every later run
  // re-split that chunk (2026-10-01: an L03 run re-cut 60 lines this way). Orphans of no chunk are removed.
  const inChunks = new Set();
  for (const f of fs.readdirSync(chunkDir)) if (f.endsWith(".json")) for (const l of JSON.parse(fs.readFileSync(path.join(chunkDir, f), "utf8")).lines ?? []) inChunks.add(l.file);
  for (const f of fs.readdirSync(outDir)) if (f.endsWith(".wav") && !keep.has(f) && !inChunks.has(f)) fs.unlinkSync(path.join(outDir, f));
  fs.mkdirSync(path.join(ROOT, "src", "episodes", slug), { recursive: true });
  fs.writeFileSync(path.join(ROOT, "src", "episodes", slug, "vo.json"), JSON.stringify(manifest, null, 2));
  // pace check (2026-09-30): L02 shipped a 16-word line whose take ran 53.9 s (the model had re-read a
  // paragraph). Any take far outside the ~207 wpm house pace is suspect: probe it before a final render.
  const odd = manifest.filter((m) => !m.estimated && m.text.split(/\s+/).length >= 4).map((m) => ({ ...m, wpm: (m.text.split(/\s+/).length / m.seconds) * 60 })).filter((m) => m.wpm < 100 || m.wpm > 330);
  if (odd.length) {
    const rows = odd.map((m) => `| ${m.scene}#${m.index} | ${Math.round(m.wpm)} wpm | ${m.seconds.toFixed(1)} s | ${m.text.slice(0, 80)} |`);
    for (const m of odd) console.log(`::warning::${slug} ${m.scene}#${m.index}: ${Math.round(m.wpm)} wpm over ${m.seconds.toFixed(1)} s - listen/probe before the final render`);
    fs.mkdirSync(path.join(ROOT, "out"), { recursive: true });
    fs.appendFileSync(path.join(ROOT, "out", "tts-qa.md"), `\n### ${slug}: pace outliers (< 100 or > 330 wpm) - check before the final\n\n| line | pace | length | text |\n|---|---|---|---|\n${rows.join("\n")}\n`);
  }
  const missing = lines.filter((l, n) => l.wanted && manifest[n].estimated).length;
  const total = manifest.reduce((s, m) => s + m.seconds + m.pauseAfter, 0);
  console.log(`${slug}: ${manifest.filter((m) => !m.estimated).length}/${manifest.length} lines voiced, ${(total / 60).toFixed(1)} min -> src/episodes/${slug}/vo.json`);
  if (missing) {
    console.log(`::warning::${missing} wanted line(s) of ${slug} still unvoiced - they carry ESTIMATED timings and no audio.`);
    process.exit(3);
  }
  process.exit(0);
}

// ---- step 1: plan chunks of consecutive missing lines
const chunks = [];
let cur = null;
for (const [n, l] of lines.entries()) {
  // Lines that already have a take are skipped WITHOUT closing the chunk: missing lines are grouped even when
  // they aren't neighbours (the aligner cuts by words, not by position), so re-voicing two edited lines far
  // apart costs one request, not two (2026-09-25).
  if (!l.wanted || hasTake(l)) continue;
  if (!cur || cur.chars + l.spoken.length > CHUNK_CHARS) {
    cur = { items: [], chars: 0 };
    chunks.push(cur);
  }
  cur.items.push(l);
  cur.chars += l.spoken.length;
}
for (const c of chunks) c.id = sha(`${cacheKey}|chunk|${c.items.map((l) => l.spoken).join("\n")}`);
const pending = chunks.filter((c) => !fs.existsSync(path.join(chunkDir, `${c.id}.wav`)));
console.log(`${slug}: ${lines.filter((l) => l.wanted && !hasTake(l)).length} line(s) missing in ${chunks.length} chunk(s); ${pending.length} need a request${onlyScenes ? ` (scenes ${[...onlyScenes].join(",")})` : ""}`);
for (const c of chunks) console.log(`  ${c.id}: ${c.items.length} lines, ${c.chars} chars, ${c.items[0].scene}#${c.items[0].index} → ${c.items.at(-1).scene}#${c.items.at(-1).index}${pending.includes(c) ? "" : " (raw take cached)"}`);
// the line list travels with the chunk so the splitter needs nothing else
for (const c of chunks) fs.writeFileSync(path.join(chunkDir, `${c.id}.json`), JSON.stringify({ slug, lines: c.items.map((l) => ({ file: l.file, spoken: l.spoken })) }, null, 1));
if (dryRun || !pending.length) process.exit(0);

const key = process.env.GEMINI_API_KEY;
if (!key && !FAKE) {
  console.error("GEMINI_API_KEY is not set. Add it to the repo's GitHub Secrets (owner).");
  process.exit(2);
}

const findAudio = (node) => {
  if (!node || typeof node !== "object") return null;
  if (typeof node.data === "string" && node.data.length > 500 && /audio/i.test(node.mime_type ?? node.mimeType ?? "audio")) return node.data;
  for (const v of Object.values(node)) {
    const hit = findAudio(v);
    if (hit) return hit;
  }
  return null;
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
class DailyQuotaError extends Error {}

const synth = async (text) => {
  if (FAKE) {
    const tmp = path.join(chunkDir, "_espeak.wav");
    const txt = path.join(chunkDir, "_espeak.txt");
    fs.writeFileSync(txt, text);
    execFileSync("espeak-ng", ["-v", "en-us", "-s", "165", "-g", "12", "-w", tmp, "-f", txt]);
    const buf = fs.readFileSync(tmp);
    fs.unlinkSync(tmp);
    fs.unlinkSync(txt);
    return buf;
  }
  const body = {
    model,
    input: [{ type: "user_input", content: [{ type: "text", text, annotations: [{ type: "speech_metadata", style: chunkStyle }] }] }],
    response_format: { type: "audio", mime_type: "audio/wav", sample_rate: SAMPLE_RATE },
    generation_config: { speech_config: [{ voice }] },
  };
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": key }, body: JSON.stringify(body) });
    if (res.ok) {
      const b64 = findAudio(await res.json());
      if (!b64) throw new Error("no audio in response");
      const buf = Buffer.from(b64, "base64");
      if (buf.toString("ascii", 0, 4) !== "RIFF") throw new Error("response audio is not a RIFF WAV - check response_format");
      return buf;
    }
    const detail = await res.text();
    if (res.status === 429 && /per day/i.test(detail)) throw new DailyQuotaError(detail.slice(0, 300));
    if (!(res.status === 429 || res.status >= 500) || attempt >= 4) throw new Error(`TTS ${res.status}: ${detail.slice(0, 400)}`);
    const wait = Math.min(90_000, 15_000 * 2 ** (attempt - 1));
    console.log(`  ${res.status} - waiting ${wait / 1000}s then retrying (${attempt}/4)`);
    await sleep(wait);
  }
};

let done = 0;
for (const [k, c] of pending.entries()) {
  if (k > 0) await sleep(8000);
  try {
    const wav = await synth(c.items.map((l) => l.spoken).join("\n\n"));
    fs.writeFileSync(path.join(chunkDir, `${c.id}.wav`), wav);
    const sec = wavSeconds(wav);
    const expected = (c.items.reduce((s, l) => s + l.spoken.split(/\s+/).length, 0) / WPM_ESTIMATE) * 60;
    console.log(`  ${c.id}: ${sec.toFixed(1)} s of audio (script estimate ${expected.toFixed(0)} s)`);
    if (sec < expected * 0.6) console.log(`::warning::chunk ${c.id} is much shorter than its text - it may be truncated; the splitter will reject it if lines are missing.`);
    done++;
  } catch (e) {
    if (e instanceof DailyQuotaError) {
      console.log(`::warning::daily TTS quota reached after ${done} chunk(s) - ${pending.length - k} left for the next run (quota resets at midnight Pacific). ${e.message}`);
      process.exit(3);
    }
    throw e;
  }
}
console.log(`${done} chunk request(s) made`);
