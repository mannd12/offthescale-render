// Cloud narration: episodes/<slug>/script.json -> one WAV per line + timing manifest (vo.json),
// using Google Cloud Text-to-Speech (Chirp 3 HD "Aoede" - the owner's pick, 2026-09-20).
// Runs on the CI runner (see .github/workflows/render.yml) - never on the owner's PC.
// Usage: node scripts/tts-cloud.mjs <episode-slug> [--force] [--dry-run]
//   GOOGLE_TTS_KEY  API key, from the repo's GitHub Secrets (typed there by the owner, never in chat)
//   --dry-run       count characters and estimate cost/quota without calling the API
// Same manifest shape as tts.mjs / vo-estimate.mjs, so src/lib/timeline.ts needs no changes.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ENDPOINT = "https://texttospeech.googleapis.com/v1/text:synthesize";
const SAMPLE_RATE = 24000;

const [slug, ...flags] = process.argv.slice(2);
if (!slug) {
  console.error("usage: node scripts/tts-cloud.mjs <episode-slug> [--force] [--dry-run]");
  process.exit(1);
}
const force = flags.includes("--force");
const dryRun = flags.includes("--dry-run");

const episodeDir = path.join(ROOT, "..", "episodes", slug);
const script = JSON.parse(fs.readFileSync(path.join(episodeDir, "script.json"), "utf8"));
const outDir = path.join(ROOT, "public", slug, "vo");
fs.mkdirSync(outDir, { recursive: true });

const voice = script.voice ?? "en-US-Chirp3-HD-Aoede";
const languageCode = voice.split("-").slice(0, 2).join("-");
const speed = script.speed ?? 1.0;

const key = process.env.GOOGLE_TTS_KEY;
if (!key && !dryRun) {
  console.error("GOOGLE_TTS_KEY is not set. Add it to the repo's GitHub Secrets (owner) or pass --dry-run.");
  process.exit(2);
}

/** Seconds of audio in a 16-bit mono LINEAR16 WAV, read from its data chunk (never from file size). */
const wavSeconds = (buf) => {
  let p = 12;
  while (p + 8 <= buf.length) {
    const id = buf.toString("ascii", p, p + 4);
    const size = buf.readUInt32LE(p + 4);
    if (id === "data") return size / (SAMPLE_RATE * 2);
    p += 8 + size + (size % 2);
  }
  throw new Error("no data chunk in WAV");
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const synth = async (text) => {
  const body = {
    input: { text },
    voice: { languageCode, name: voice },
    audioConfig: { audioEncoding: "LINEAR16", sampleRateHertz: SAMPLE_RATE, speakingRate: speed },
  };
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify(body),
    });
    if (res.ok) return Buffer.from((await res.json()).audioContent, "base64");
    const detail = await res.text();
    const retryable = res.status === 429 || res.status >= 500;
    if (!retryable || attempt > 4) throw new Error(`TTS ${res.status}: ${detail.slice(0, 400)}`);
    const wait = 2000 * 2 ** (attempt - 1);
    console.log(`  ${res.status} - waiting ${wait / 1000}s then retrying (${attempt}/4)`);
    await sleep(wait);
  }
};

const manifest = [];
let chars = 0;
let synthesized = 0;
for (const scene of script.scenes) {
  for (const [i, line] of scene.lines.entries()) {
    // `say` overrides the spoken text when the caption spelling mispronounces.
    const spoken = line.say ?? line.text;
    chars += spoken.length;
    const hash = crypto.createHash("sha1").update(`${voice}|${speed}|${spoken}`).digest("hex").slice(0, 10);
    const file = `${scene.id}-${String(i).padStart(2, "0")}-${hash}.wav`;
    const abs = path.join(outDir, file);
    let seconds;
    if (dryRun) {
      seconds = (spoken.split(/\s+/).length / 190) * 60; // planning estimate at ~190 wpm
    } else if (!force && fs.existsSync(abs)) {
      seconds = wavSeconds(fs.readFileSync(abs));
    } else {
      const wav = await synth(spoken);
      fs.writeFileSync(abs, wav);
      seconds = wavSeconds(wav);
      synthesized++;
      console.log(`${file}  ${seconds.toFixed(2)}s  ${spoken.slice(0, 60)}`);
      await sleep(150); // polite pacing; the free tier is per-month, not per-second
    }
    manifest.push({ scene: scene.id, index: i, text: line.text, file: `${slug}/vo/${file}`, seconds, pauseAfter: line.pause ?? 0.25 });
  }
}

const total = manifest.reduce((s, m) => s + m.seconds + m.pauseAfter, 0);
console.log(`\n${manifest.length} lines, ${chars} characters, ${(total / 60).toFixed(1)} min narration${dryRun ? " (estimated)" : ""}`);
if (dryRun) {
  console.log("dry run: nothing synthesized, vo.json not written");
  process.exit(0);
}

// Drop stale takes so public/ only holds what the manifest references.
const keep = new Set(manifest.map((m) => path.basename(m.file)));
for (const f of fs.readdirSync(outDir)) if (f.endsWith(".wav") && !keep.has(f)) fs.unlinkSync(path.join(outDir, f));

fs.mkdirSync(path.join(ROOT, "src", "episodes", slug), { recursive: true });
fs.writeFileSync(path.join(ROOT, "src", "episodes", slug, "vo.json"), JSON.stringify(manifest, null, 2));
console.log(`${synthesized} new takes -> src/episodes/${slug}/vo.json`);
