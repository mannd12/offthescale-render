import { continueRender, delayRender, staticFile } from "remotion";

// Open-licensed (OFL) fonts, fetched into public/fonts by scripts/fetch-assets.mjs on the CI
// runner, so renders look identical on any machine (Linux runners have no Windows fonts).
const FACES: [family: string, file: string, weight: string][] = [
  ["Anton", "anton-400.woff2", "400"],
  ["Inter", "inter-500.woff2", "500"],
  ["Inter", "inter-800.woff2", "800"],
  ["Fredoka", "fredoka-600.woff2", "600"],
];

let started = false;

/** Call once at module load of any composition that uses the brand kit. */
export const loadBrandFonts = () => {
  if (started || typeof document === "undefined") return;
  started = true;
  const handle = delayRender("brand fonts");
  Promise.all(
    FACES.map(async ([family, file, weight]) => {
      const face = new FontFace(family, `url(${staticFile(`fonts/${file}`)}) format("woff2")`, { weight });
      document.fonts.add(await face.load());
    }),
  )
    .catch((err) => console.warn("brand font failed to load, falling back:", err))
    .finally(() => continueRender(handle));
};
