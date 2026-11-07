// Kit v2 colour scripts (docs/STYLE-V2.md §1). One "family" per scene: a gradient sky, three depth planes that
// fade toward a haze colour, one light colour that every glow/bloom/rim uses, and the brand vermilion as the single
// signal accent. Families are OURS: petrol/teal darks with apricot-ember warmth and bone lights. Deliberately not
// the indigo/violet/magenta night that Kurzgesagt owns (distinctness check, STYLE-V2.md §8).
// v2.1 (2026-11-07): chroma raised to the measured targets (scene chroma 0.3-0.5, mean value 0.45-0.65, near-grey
// ≤ 5 %, docs/ART-PROCESS.md §2); bone-white backgrounds only in `studio`; `dusk` pushed from mauve to petrol/apricot.
import { P, Theme, mixHex } from "./palette";

export type Family = {
  name: string;
  /** sky / background gradient, top → bottom */
  sky: [string, string, ...string[]];
  /** depth planes: far fades most toward haze, near is darkest / most saturated */
  far: string;
  mid: string;
  near: string;
  /** atmospheric haze colour: far layers are tinted toward this (Layer haze prop) */
  haze: string;
  /** the scene's light colour: glow, bloom, rim light, lit faces */
  light: string;
  /** shadow colour: inner shadows, cast shadows, unlit faces */
  shadow: string;
  /** bounce / fill light: the coloured tint on the shadow side of forms (Form bounce prop) */
  bounce: string;
  /** secondary hue for props (two-colour harmony with the planes) */
  second: string;
  /** text / line colour legible on this sky */
  text: string;
  dim: string;
  accent: string;
  dark: boolean;
  /** Theme for Stage / Gauge / v1 props, so v1 and v2 compose */
  theme: Theme;
};

const fam = (f: Omit<Family, "theme" | "accent">): Family => ({
  ...f,
  accent: P.vermilion,
  theme: {
    // the TOP sky colour is the family's base tone (the horizon stop is the brightest, so plates drawn in it glare)
    bg: f.sky[0],
    panel: mixHex(f.sky[0], f.text, 0.12),
    line: f.text,
    text: f.text,
    dim: f.dim,
    dark: f.dark,
  },
});

/** The v2 families. Pick one per scene; a video uses 3-4 of them as its colour script. */
export const FAMILIES = {
  /** mountain world at dusk: petrol sky to apricot horizon, teal-slate planes, gold low sun */
  dusk: fam({
    name: "dusk",
    sky: ["#0F3B4F", "#1E6678", "#E3813F", "#F6B45A"],
    far: "#3F7F8E",
    mid: "#235A69",
    near: "#0F3540",
    haze: "#E89A62",
    light: "#FFCF73",
    shadow: "#082028",
    bounce: "#F08A4A",
    second: "#F0A050",
    text: "#FFF4E6",
    dim: "#BFD3D0",
    dark: true,
  }),
  /** deep underground, hot rock: maroon to rust, ember light, gold core */
  ember: fam({
    name: "ember",
    sky: ["#2B0C08", "#6A2210", "#B04A18"],
    far: "#7A3418",
    mid: "#8F4420",
    near: "#3A1208",
    haze: "#C0602A",
    light: "#FFB347",
    shadow: "#1A0604",
    bounce: "#FF7A30",
    second: "#FFD24A",
    text: "#FFF0DC",
    dim: "#E0B08C",
    dark: true,
  }),
  /** ocean at night: petrol-teal sky and sea, moon-bone light, a warm eruption as the only heat */
  petrol: fam({
    name: "petrol",
    sky: ["#0A3C4C", "#11707A", "#1FA69A"],
    far: "#1E8A88",
    mid: "#146A6C",
    near: "#0A3A42",
    haze: "#3FB0A4",
    light: "#E6F5EA",
    shadow: "#041C22",
    bounce: "#2FBFA8",
    second: "#FF9640",
    text: "#F0FAF4",
    dim: "#A9D4CC",
    dark: true,
  }),
  /** space: deep petrol-black (not indigo), bone stars, copper / verdigris planets carry the chroma */
  void: fam({
    name: "void",
    sky: ["#07161E", "#0E2A36", "#153D4A"],
    far: "#26525F",
    mid: "#1B414C",
    near: "#07161E",
    haze: "#1B3F4C",
    light: "#FFE1A0",
    shadow: "#020A0E",
    bounce: "#2A6E78",
    second: "#D98A4A",
    text: "#F4EEDF",
    dim: "#9FB7B8",
    dark: true,
  }),
  /** sunny everyday: saturated powder sky, mint / ochre / terracotta town, warm paper light */
  noon: fam({
    name: "noon",
    sky: ["#4FB5DE", "#8FD2E6", "#F3E9C8"],
    far: "#9CCFC0",
    mid: "#5FB09A",
    near: "#2F7F6E",
    haze: "#CFEAE4",
    light: "#FFF3C8",
    shadow: "#1F4F4C",
    bounce: "#7FD0E8",
    second: "#F2B544",
    text: "#1E2A2E",
    dim: "#4F6B6A",
    dark: false,
  }),
  /** the character's studio: warm paper with soft shadows (the only bone-white family) */
  studio: fam({
    name: "studio",
    sky: ["#F8EEDC", "#F1E2C8", "#E6D2B0"],
    far: "#DCC7A4",
    mid: "#C9AF86",
    near: "#AE9068",
    haze: "#F1E2C8",
    light: "#FFFBF0",
    shadow: "#7A5A3C",
    bounce: "#F4C890",
    second: "#5FAE9A",
    text: "#23262A",
    dim: "#6B6A63",
    dark: false,
  }),
} as const satisfies Record<string, Family>;

export type FamilyName = keyof typeof FAMILIES;

/** hex + alpha → rgba() string */
export const alpha = (c: string, a: number) => {
  const v = [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  return `rgba(${v[0]},${v[1]},${v[2]},${Math.max(0, Math.min(1, a))})`;
};

/** Depth tint: a plane colour pushed toward the family haze by k (0 near .. 1 at the horizon). */
export const hazed = (f: Family, c: string, k: number) => mixHex(c, f.haze, Math.max(0, Math.min(1, k)));

/** Secondary palette for props inside a family: lit / base / shade of a hue, keyed to the family light + shadow. */
export const triad = (f: Family, base: string, k = 0.22) => ({
  lit: mixHex(base, f.light, k),
  base,
  shade: mixHex(base, f.shadow, k + 0.1),
});

/** Chroma (max−min of RGB, 0..1) and value (max, 0..1) of a hex colour: the craft probe's colour numbers. */
export const chromaOf = (c: string) => {
  const v = [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16) / 255);
  return { chroma: Math.max(...v) - Math.min(...v), value: Math.max(...v) };
};
