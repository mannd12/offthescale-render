// Narration generator: episodes/<slug>/script.json -> one WAV per line + timing manifest.
// Usage: node scripts/tts.mjs <episode-slug> [--force]
// Lines are synthesized individually so the animation can sync to exact per-line durations.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { env } from "@huggingface/transformers";
import { KokoroTTS } from "kokoro-js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// Keep model weights inside the project, not in a user-profile cache.
env.cacheDir = path.join(ROOT, "models");

const MODEL = "onnx-community/Kokoro-82M-v1.0-ONNX";
const SAMPLE_RATE = 24000;

const [slug, ...flags] = process.argv.slice(2);
if (!slug) {
  console.error("usage: node scripts/tts.mjs <episode-slug> [--force]");
  process.exit(1);
}
const force = flags.includes("--force");

const episodeDir = path.join(ROOT, "..", "episodes", slug);
const script = JSON.parse(fs.readFileSync(path.join(episodeDir, "script.json"), "utf8"));
const outDir = path.join(ROOT, "public", slug, "vo");
fs.mkdirSync(outDir, { recursive: true });

const voice = script.voice ?? "am_michael";
const speed = script.speed ?? 1.0;

// Kokoro output averages ~-23 dBFS RMS; YouTube never boosts quiet uploads. Lift by GAIN and
// soft-limit the few transients that would clip (linear below KNEE, tanh-shaped above it).
const GAIN = 2.0;
const KNEE = 0.7;
const master = (samples) => {
  for (let i = 0; i < samples.length; i++) {
    const v = samples[i] * GAIN;
    const a = Math.abs(v);
    samples[i] = a <= KNEE ? v : Math.sign(v) * (KNEE + (0.98 - KNEE) * Math.tanh((a - KNEE) / (0.98 - KNEE)));
  }
};

const tts = await KokoroTTS.from_pretrained(MODEL, { dtype: "fp32", device: "cpu" });

const manifest = [];
for (const scene of script.scenes) {
  for (const [i, line] of scene.lines.entries()) {
    // `say` overrides the spoken text when the caption spelling mispronounces.
    const spoken = line.say ?? line.text;
    const hash = crypto.createHash("sha1").update(`${voice}|${speed}|${spoken}`).digest("hex").slice(0, 10);
    const file = `${scene.id}-${String(i).padStart(2, "0")}-${hash}.wav`;
    const abs = path.join(outDir, file);
    let seconds;
    if (!force && fs.existsSync(abs)) {
      seconds = (fs.statSync(abs).size - 44) / (SAMPLE_RATE * 4); // 32-bit float mono
    } else {
      const audio = await tts.generate(spoken, { voice, speed });
      master(audio.audio);
      await audio.save(abs);
      seconds = audio.audio.length / audio.sampling_rate;
      console.log(`${file}  ${seconds.toFixed(2)}s  ${spoken.slice(0, 60)}`);
    }
    manifest.push({ scene: scene.id, index: i, text: line.text, file: `${slug}/vo/${file}`, seconds, pauseAfter: line.pause ?? 0.25 });
  }
}

// Drop stale takes so public/ only holds what the manifest references.
const keep = new Set(manifest.map((m) => path.basename(m.file)));
for (const f of fs.readdirSync(outDir)) if (f.endsWith(".wav") && !keep.has(f)) fs.unlinkSync(path.join(outDir, f));

fs.mkdirSync(path.join(ROOT, "src", "episodes", slug), { recursive: true });
fs.writeFileSync(path.join(ROOT, "src", "episodes", slug, "vo.json"), JSON.stringify(manifest, null, 2));
const total = manifest.reduce((s, m) => s + m.seconds + m.pauseAfter, 0);
console.log(`\n${manifest.length} lines, ${total.toFixed(1)}s narration -> src/episodes/${slug}/vo.json`);
