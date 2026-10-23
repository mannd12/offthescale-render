// Review-frame picker: prints a comma list of "<comp>@<frame>" for the render workflow's still mode,
// computed from an episode's vo.json exactly as src/lib/timeline.ts lays scenes out.
// Default: two frames per scene - 60 % through its middle line and 90 % through its last line (the pattern
// used for every real-timing review so far). --lines samples 60 % through EVERY line instead.
// Usage: node scripts/review-frames.mjs <episode-slug> <composition-id> [--lines] [--scenes a,b]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [slug, comp, ...flags] = process.argv.slice(2);
if (!slug || !comp) {
  console.error("usage: node scripts/review-frames.mjs <episode-slug> <composition-id> [--lines] [--scenes a,b]");
  process.exit(1);
}
const FPS = 30;
const LEAD_IN = Math.round(0.35 * FPS); // keep in sync with src/lib/timeline.ts
const everyLine = flags.includes("--lines");
const only = flags.includes("--scenes") ? new Set(flags[flags.indexOf("--scenes") + 1].split(",")) : null;

const vo = JSON.parse(fs.readFileSync(path.join(ROOT, "src", "episodes", slug, "vo.json"), "utf8"));
const scenes = [];
let cursor = 0;
for (const l of vo) {
  if (!scenes.length || scenes.at(-1).id !== l.scene) {
    scenes.push({ id: l.scene, lines: [] });
    cursor += LEAD_IN;
  }
  const af = Math.ceil(l.seconds * FPS);
  scenes.at(-1).lines.push({ from: cursor, af });
  cursor += af + Math.round(l.pauseAfter * FPS);
}
const frames = [];
for (const s of scenes) {
  if (only && !only.has(s.id)) continue;
  const pick = everyLine ? s.lines.map((l) => [l, 0.6]) : [[s.lines[Math.floor(s.lines.length / 2)], 0.6], [s.lines.at(-1), 0.9]];
  for (const [l, f] of pick) frames.push(l.from + Math.round(l.af * f));
}
const uniq = [...new Set(frames)];
console.log(uniq.map((f) => `${comp}@${f}`).join(","));
console.error(`${slug}: ${uniq.length} frames over ${scenes.length} scenes; runtime ${Math.floor(cursor / FPS / 60)}:${String(Math.floor((cursor / FPS) % 60)).padStart(2, "0")}${vo.some((l) => l.estimated) ? " (ESTIMATED timings)" : ""}`);
