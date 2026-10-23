// Narration QA: transcribe every generated line with local Whisper and diff against the script.
// Flags likely mispronunciations / dropped words. Usage: node scripts/qa-audio.mjs <episode-slug>
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { env, pipeline } from "@huggingface/transformers";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
env.cacheDir = path.join(ROOT, "models");

const slug = process.argv[2];
const vo = JSON.parse(fs.readFileSync(path.join(ROOT, "src", "episodes", slug, "vo.json"), "utf8"));

// kokoro-js writes 32-bit float mono WAV @ 24 kHz; Whisper wants 16 kHz.
const readWav16k = (file) => {
  const buf = fs.readFileSync(file);
  const dataAt = buf.indexOf("data") + 8;
  const src = new Float32Array(buf.buffer, buf.byteOffset + dataAt, Math.floor((buf.length - dataAt) / 4));
  const ratio = 24000 / 16000;
  const out = new Float32Array(Math.floor(src.length / ratio));
  for (let i = 0; i < out.length; i++) {
    const p = i * ratio;
    const a = Math.floor(p);
    out[i] = src[a] + (src[Math.min(a + 1, src.length - 1)] - src[a]) * (p - a);
  }
  return out;
};

const norm = (s) =>
  s.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim().split(" ");

// word-level edit distance
const wer = (ref, hyp) => {
  const d = Array.from({ length: ref.length + 1 }, (_, i) => [i, ...Array(hyp.length).fill(0)]);
  for (let j = 0; j <= hyp.length; j++) d[0][j] = j;
  for (let i = 1; i <= ref.length; i++)
    for (let j = 1; j <= hyp.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (ref[i - 1] === hyp[j - 1] ? 0 : 1));
  return d[ref.length][hyp.length] / ref.length;
};

const asr = await pipeline("automatic-speech-recognition", "onnx-community/whisper-base.en", { dtype: "fp32" });
let flagged = 0;
for (const l of vo) {
  const { text } = await asr(readWav16k(path.join(ROOT, "public", l.file)));
  const score = wer(norm(l.text), norm(text));
  if (score > 0.12) {
    flagged++;
    console.log(`\n[${l.scene} #${l.index}] WER ${(score * 100).toFixed(0)}%\n  script: ${l.text}\n  heard : ${text.trim()}`);
  }
}
console.log(`\n${vo.length} lines checked, ${flagged} flagged`);
