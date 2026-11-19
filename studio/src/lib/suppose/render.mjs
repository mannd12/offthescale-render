// Local still render for Suppose Then. Usage (from studio/): node src/lib/suppose/render.mjs [id ...] [--out <dir>]
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const WHATIF = path.resolve(HERE, "../../../../../What If");
const args = process.argv.slice(2);
const oi = args.indexOf("--out");
const out = oi >= 0 ? args.splice(oi, 2)[1] : path.join(WHATIF, "channel", "style-frames", "r1");
const ids = args.length ? args : ["st-key-pull", "st-key-air", "st-key-gap", "st-channel-picture", "st-banner"];
fs.mkdirSync(out, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.join(HERE, "entry.tsx"), publicDir: path.resolve(HERE, "../../../public") });
for (const id of ids) {
  const composition = await selectComposition({ serveUrl, id });
  const output = path.join(out, `${id}.png`);
  await renderStill({ serveUrl, composition, output, frame: 0 });
  console.log("wrote", output);
}
