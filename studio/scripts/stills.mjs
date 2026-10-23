// Review stills: one frame late in every narration line (when that line's visuals have settled).
// Usage: node scripts/stills.mjs <compositionId> <episode-slug> [sceneId ...]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [compId, slug, ...only] = process.argv.slice(2);
const FPS = 30;
const LEAD_IN = Math.round(0.35 * FPS); // keep in sync with src/lib/timeline.ts

const vo = JSON.parse(fs.readFileSync(path.join(ROOT, "src", "episodes", slug, "vo.json"), "utf8"));
const shots = [];
let cursor = 0;
let scene = null;
for (const l of vo) {
  if (l.scene !== scene) {
    scene = l.scene;
    cursor += LEAD_IN;
  }
  const audioFrames = Math.ceil(l.seconds * FPS);
  shots.push({ name: `${l.scene}-${String(l.index).padStart(2, "0")}`, scene: l.scene, frame: cursor + Math.round(audioFrames * 0.9) });
  cursor += audioFrames + Math.round(l.pauseAfter * FPS);
}

const outDir = path.join(ROOT, "out", "stills", slug);
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.join(ROOT, "src", "index.ts"), publicDir: path.join(ROOT, "public") });
const composition = await selectComposition({ serveUrl, id: compId });
for (const s of shots) {
  if (only.length && !only.includes(s.scene)) continue;
  await renderStill({ composition, serveUrl, frame: s.frame, output: path.join(outDir, `${s.name}.jpg`), imageFormat: "jpeg", jpegQuality: 80, scale: 0.5 });
  console.log(`${s.name}  frame ${s.frame}`);
}
console.log(`total frames: ${composition.durationInFrames}`);
