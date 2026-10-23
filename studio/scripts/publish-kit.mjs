// Publish kit: exact captions (.srt) and chapter timestamps derived from the narration manifest.
// Usage: node scripts/publish-kit.mjs <episode-slug>
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { cuesFor } from "./lib/captions.mjs"; // 2 x 42-char cues, numerals above ten

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const slug = process.argv[2];
const FPS = 30;
const LEAD_IN = Math.round(0.35 * FPS); // keep in sync with src/lib/timeline.ts
const vo = JSON.parse(fs.readFileSync(path.join(ROOT, "src", "episodes", slug, "vo.json"), "utf8"));
const episodeDir = path.join(ROOT, "..", "episodes", slug);

const stamp = (sec, sep) => {
  const ms = Math.round(sec * 1000);
  const p = (n, w = 2) => String(n).padStart(w, "0");
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)}${sep}${p(ms % 1000, 3)}`;
};

let cursor = 0;
let scene = null;
const cues = [];
const sceneStarts = [];
for (const l of vo) {
  if (l.scene !== scene) {
    scene = l.scene;
    sceneStarts.push({ id: scene, sec: cursor / FPS });
    cursor += LEAD_IN;
  }
  const audioFrames = Math.ceil(l.seconds * FPS);
  const lineCues = cuesFor(l.text, cursor / FPS, l.seconds);
  // Reading time (2026-09-30 validation): a caption may stay up into the silence after its line - up to
  // the next line's start - so short cues ("Average.", 0.5 s) last >= 1 s and fast ones drop toward
  // <= 17 chars/s. Never overlaps the next cue, never delays it.
  const gap = (audioFrames + Math.round(l.pauseAfter * FPS)) / FPS - l.seconds;
  const last = lineCues.at(-1);
  const want = Math.max(1.0, last.text.replace(/\n/g, " ").length / 17);
  last.to += Math.min(Math.max(0, gap - 0.04), Math.max(0, want - (last.to - last.from)));
  cues.push(...lineCues);
  cursor += audioFrames + Math.round(l.pauseAfter * FPS);
}

fs.writeFileSync(
  path.join(episodeDir, "captions.srt"),
  cues.map((c, i) => `${i + 1}\n${stamp(c.from, ",")} --> ${stamp(c.to, ",")}\n${c.text}\n`).join("\n"),
);

const mmss = (sec) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;
const chapters = sceneStarts.map((s, i) => `${i === 0 ? "0:00" : mmss(s.sec)} ${s.id}`).join("\n");
fs.writeFileSync(path.join(episodeDir, "chapters.txt"), chapters + "\n");
console.log(`${cues.length} caption cues -> captions.srt\n\n${chapters}\n\nruntime ${mmss(cursor / FPS)}`);

// ---- publish.md: put REAL chapter times on the package's own chapter titles (2026-09-25)
// The description in publish.md lists one "M:SS Title" line per scene, in scene order. Once every
// line is voiced (no estimated timings) the times are replaced in place; the titles are left alone.
// YouTube's chapter rules are checked: first at 0:00, at least 3, each at least 10 s long.
const estimated = vo.filter((l) => l.estimated).length;
const publishPath = path.join(episodeDir, "publish.md");
if (estimated) {
  console.log(`\npublish.md not touched: ${estimated} line(s) still have ESTIMATED timings (voice them first).`);
} else if (fs.existsSync(publishPath)) {
  const md = fs.readFileSync(publishPath, "utf8").split("\r\n").join("\n");
  const lines = md.split("\n");
  const idx = lines.map((l, i) => (/^\d+:\d{2} \S/.test(l) ? i : -1)).filter((i) => i >= 0);
  if (idx.length !== sceneStarts.length) {
    console.log(`\npublish.md not touched: it lists ${idx.length} chapter lines but the episode has ${sceneStarts.length} scenes.`);
  } else {
    const secs = sceneStarts.map((s, i) => (i === 0 ? 0 : Math.floor(s.sec)));
    const lens = secs.map((s, i) => (i + 1 < secs.length ? secs[i + 1] : cursor / FPS) - s);
    const short = lens.map((l, i) => (l < 10 ? i : -1)).filter((i) => i >= 0);
    if (short.length) console.log(`::warning::chapter(s) ${short.join(", ")} shorter than 10 s - YouTube will ignore all chapters`);
    idx.forEach((li, k) => {
      lines[li] = lines[li].replace(/^\d+:\d{2}/, mmss(secs[k]));
    });
    let out = lines.join("\n");
    out = out.replace(/⚠ \*\*Timestamps below are estimates\*\*[^\n]*(\n[^\n]+)*?\n\n/, `✔ **Chapter times are real** — from the narration manifest (publish-kit.mjs), runtime ${mmss(cursor / FPS)}.\n\n`);
    out = out.replace(/⚠ Timestamps are estimates[\s\S]*?voiced render\./,`✔ Chapter times are real — from the narration manifest (publish-kit.mjs), runtime ${mmss(cursor / FPS)}.`);
    fs.writeFileSync(publishPath, out);
    console.log(`\npublish.md chapters updated (${idx.length}, runtime ${mmss(cursor / FPS)})`);
  }
}
