// Review frames rendered in a cloud session (no runner): one bundle, many frames.
// Usage: node scripts/frames-local.mjs <compositionId> <outDir> <frame,frame,...> [--browser <path>]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [compId, outDir, list] = process.argv.slice(2);
const bi = process.argv.indexOf("--browser");
const browserExecutable = bi > -1 ? process.argv[bi + 1] : null;
const frames = [...new Set(list.split(",").filter(Boolean).map(Number))].sort((a, b) => a - b);
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.join(ROOT, "src", "index.ts"), publicDir: path.join(ROOT, "public") });
const puppeteerInstance = await openBrowser("chrome", { browserExecutable });
const composition = await selectComposition({ serveUrl, id: compId, puppeteerInstance });
for (const frame of frames) {
  await renderStill({ composition, serveUrl, frame, output: path.join(outDir, `f${String(frame).padStart(5, "0")}.jpg`), imageFormat: "jpeg", jpegQuality: 75, scale: 0.5, puppeteerInstance });
  process.stdout.write(`${frame} `);
}
await puppeteerInstance.close({ silent: true });
console.log(`\n${frames.length} frames of ${composition.durationInFrames}`);
