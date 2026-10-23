// Peak / RMS of an episode's narration, in dBFS. Usage: node scripts/loudness.mjs <episode-slug>
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(ROOT, "public", process.argv[2], "vo");
let peak = 0;
let sumSq = 0;
let n = 0;
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".wav"))) {
  const buf = fs.readFileSync(path.join(dir, f));
  const at = buf.indexOf("data") + 8;
  const s = new Float32Array(buf.buffer.slice(buf.byteOffset + at, buf.byteOffset + at + Math.floor((buf.length - at) / 4) * 4));
  for (const v of s) {
    peak = Math.max(peak, Math.abs(v));
    sumSq += v * v;
    n++;
  }
}
const db = (x) => (20 * Math.log10(x)).toFixed(1);
console.log(`peak ${db(peak)} dBFS, rms ${db(Math.sqrt(sumSq / n))} dBFS over ${(n / 24000).toFixed(0)}s`);
