// Placeholder narration manifest so an episode's animation can be built and type-checked
// BEFORE the cloud voice exists: same vo.json shape as tts-cloud.mjs, with durations estimated
// at the script's target pace and `estimated: true` on every line (the Episode component skips
// <Audio> for those). Re-running tts-cloud.mjs overwrites it with real timings.
// Usage: node scripts/vo-estimate.mjs <episode-slug> [--wpm 190]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [slug, ...flags] = process.argv.slice(2);
if (!slug) {
  console.error("usage: node scripts/vo-estimate.mjs <episode-slug> [--wpm 190]");
  process.exit(1);
}
const wpmArg = flags.indexOf("--wpm");
const WPM = wpmArg > -1 ? Number(flags[wpmArg + 1]) : 190;

const script = JSON.parse(fs.readFileSync(path.join(ROOT, "..", "episodes", slug, "script.json"), "utf8"));
const manifest = [];
for (const scene of script.scenes) {
  for (const [i, line] of scene.lines.entries()) {
    const spoken = line.say ?? line.text;
    const words = spoken.split(/\s+/).filter(Boolean).length;
    // punctuation costs breath: ~0.18 s per sentence end, ~0.1 s per comma/dash
    const breaths = (spoken.match(/[.!?…]/g) ?? []).length * 0.18 + (spoken.match(/[,;:—]/g) ?? []).length * 0.1;
    const seconds = Number(((words / WPM) * 60 + breaths).toFixed(2));
    manifest.push({ scene: scene.id, index: i, text: line.text, file: `${slug}/vo/${scene.id}-${String(i).padStart(2, "0")}.wav`, seconds, pauseAfter: line.pause ?? 0.25, estimated: true });
  }
}
fs.mkdirSync(path.join(ROOT, "src", "episodes", slug), { recursive: true });
fs.writeFileSync(path.join(ROOT, "src", "episodes", slug, "vo.json"), JSON.stringify(manifest, null, 2));
const total = manifest.reduce((s, m) => s + m.seconds + m.pauseAfter, 0);
console.log(`${manifest.length} lines, ~${(total / 60).toFixed(1)} min at ${WPM} wpm (ESTIMATED) -> src/episodes/${slug}/vo.json`);
