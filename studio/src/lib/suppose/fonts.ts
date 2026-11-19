import { continueRender, delayRender, staticFile } from "remotion";

// Nunito (SIL OFL 1.1, fontsource), bundled in the Suppose Then public dir (studio/public/suppose/fonts).
const FACES: [file: string, weight: string][] = [
  ["nunito-600.woff2", "600"],
  ["nunito-800.woff2", "800"],
  ["nunito-900.woff2", "900"],
];

let started = false;
export const loadSupposeFonts = () => {
  if (started || typeof document === "undefined") return;
  started = true;
  const handle = delayRender("suppose fonts");
  Promise.all(
    FACES.map(async ([file, weight]) => {
      const face = new FontFace("Nunito", `url(${staticFile(`suppose/fonts/${file}`)}) format("woff2")`, { weight });
      document.fonts.add(await face.load());
    }),
  )
    .catch((err) => console.warn("suppose font failed to load:", err))
    .finally(() => continueRender(handle));
};
