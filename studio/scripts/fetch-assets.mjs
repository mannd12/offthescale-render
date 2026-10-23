// Downloads fonts and licensed images listed in assets/manifest.json into public/.
// Runs on the CI runner (see .github/workflows/render.yml) - NOT on the owner's PC.
// Usage: node scripts/fetch-assets.mjs [--width 1920]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "assets", "manifest.json"), "utf8"));
const widthArg = process.argv.indexOf("--width");
const WIDTH = widthArg > -1 ? Number(process.argv[widthArg + 1]) : 1920;
// Wikimedia asks for a descriptive User-Agent with a contact point.
const UA = "channel-studio/0.1 (https://github.com/mannd12/channel-studio; asset fetch for video rendering)";
const ALLOWED = new Set(["Public domain", "CC0", "CC BY 2.0", "CC BY 3.0", "CC BY 4.0"]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// Wikimedia rate-limits bursts (it returned 429 on a 16-file run). Be a polite client:
// space requests out, and back off and retry rather than failing the whole render.
const GAP_MS = 500;
const RETRIES = 4;

const download = async (url, dest) => {
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) return "cached";
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
    if (res.ok) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
      await sleep(GAP_MS);
      return `${Math.round(fs.statSync(dest).size / 1024)} KB`;
    }
    const retryable = res.status === 429 || res.status >= 500;
    if (!retryable || attempt > RETRIES) throw new Error(`${res.status} ${res.statusText} for ${url}`);
    const wait = Number(res.headers.get("retry-after")) * 1000 || 2000 * 2 ** (attempt - 1);
    console.log(`  ${res.status} — waiting ${Math.round(wait / 1000)}s then retrying (${attempt}/${RETRIES})`);
    await sleep(wait);
  }
};

for (const font of manifest.fonts) {
  console.log(`font  ${font.file}: ${await download(font.url, path.join(ROOT, "public", "fonts", font.file))}`);
}

for (const img of manifest.images) {
  if (!ALLOWED.has(img.licence)) throw new Error(`${img.id}: licence "${img.licence}" is not allowed (PD / CC0 / CC-BY only)`);
  const ext = img.ext ?? (path.extname(img.commons ?? "").toLowerCase() === ".png" ? "png" : "jpg");
  const dest = path.join(ROOT, "public", "assets", `${img.id}.${ext}`);
  if (img.nasa) {
    // NASA image library items (all PD): not every item publishes every rendition (some 403), so fall through
    const tries = img.rendition ? [img.rendition] : ["large", "medium", "orig", "small"];
    let done = false;
    for (const r of tries) {
      try {
        console.log(`image ${img.id} (~${r}): ${await download(`https://images-assets.nasa.gov/image/${img.nasa}/${img.nasa}~${r}.jpg`, dest)}`);
        done = true;
        break;
      } catch (e) {
        console.log(`  ~${r} unavailable (${String(e.message).slice(0, 40)})`);
      }
    }
    if (!done) throw new Error(`${img.id}: no NASA rendition could be fetched`);
    continue;
  }
  // "crop": [x, y, w, h] in the ORIGINAL file's pixels (2026-10-01): for a panel of a multi-panel figure. The
  // original is kept under _masters and ffmpeg (present on the runner) writes the cropped panel.
  if (img.crop) {
    if (!(fs.existsSync(dest) && fs.statSync(dest).size > 0)) {
      const master = path.join(ROOT, "public", "assets", "_masters", `${img.id}${path.extname(img.commons)}`);
      const got = await download(`https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(img.commons)}`, master);
      const [x, y, w, h] = img.crop;
      execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", master, "-vf", `crop=${w}:${h}:${x}:${y}`, "-frames:v", "1", "-update", "1", dest], { stdio: "inherit" });
      console.log(`image ${img.id}: original ${got}, cropped to ${w}x${h} at ${x},${y}`);
    } else console.log(`image ${img.id}: cached`);
    continue;
  }
  // 1920 px (2026-10-01): scenes push in on the plates up to ~1.35x, and 1,600 px sources went soft. An original
  // narrower than the requested width is refused by the thumbnailer, so fall back to 1600 rather than fail the render.
  const commons = (w) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(img.commons)}?width=${w}`;
  try {
    console.log(`image ${img.id}: ${await download(img.url ?? commons(WIDTH), dest)}`);
  } catch (e) {
    if (img.url || WIDTH <= 1600) throw e;
    console.log(`  ${img.id}: ${WIDTH} px unavailable (${String(e.message).slice(0, 40)}) - trying 1600`);
    console.log(`image ${img.id}: ${await download(commons(1600), dest)}`);
  }
}

// Video clips: a Commons original (.webm/.mp4, public domain / CC0 / CC-BY) or a NASA image-library
// rendition (https://images-assets.nasa.gov/video/<nasa_id>/<nasa_id>~mobile.mp4 - all NASA PD).
// Masters are never committed: each entry names in/out seconds and the runner trims with ffmpeg
// (present on ubuntu-latest) into public/assets/<id>.mp4, silent, 1080p-friendly.
const trim = (src, dest, from, to) => {
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) return "cached";
  const args = ["-y", "-loglevel", "error", "-ss", String(from), "-to", String(to), "-i", src, "-an", "-vf", "scale=-2:1080", "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-movflags", "+faststart", dest];
  execFileSync("ffmpeg", args, { stdio: "inherit" });
  return `${Math.round(fs.statSync(dest).size / 1024)} KB (trimmed ${from}-${to}s)`;
};

for (const v of manifest.videos ?? []) {
  if (!ALLOWED.has(v.licence)) throw new Error(`${v.id}: licence "${v.licence}" is not allowed (PD / CC0 / CC-BY only)`);
  const url = v.commons
    ? `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(v.commons)}`
    : `https://images-assets.nasa.gov/video/${v.nasa}/${v.nasa}~${v.rendition ?? "mobile"}.mp4`;
  const master = path.join(ROOT, "public", "assets", "_masters", `${v.id}${v.commons ? path.extname(v.commons) : ".mp4"}`);
  console.log(`video ${v.id}: master ${await download(url, master)}`);
  console.log(`video ${v.id}: ${trim(master, path.join(ROOT, "public", "assets", `${v.id}.mp4`), v.in ?? 0, v.out ?? (v.in ?? 0) + 12)}`);
}
