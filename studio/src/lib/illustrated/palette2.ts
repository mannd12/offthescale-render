// Kit v2 colour scripts (docs/STYLE-V2.md §1). One "family" per scene: a gradient sky, three depth planes that
// fade toward a haze colour, one light colour that every glow/bloom/rim uses, and the brand vermilion as the single
// signal accent. Families are OURS: petrol/slate darks with apricot-ember warmth and bone lights. Deliberately not
// the indigo/violet/magenta night that Kurzgesagt owns (distinctness check, STYLE-V2.md §8).
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
  /** mountain world at dusk: petrol-navy sky to apricot horizon, slate planes, gold low sun */
  dusk: fam({
    name: "dusk",
    sky: ["#1D2B3E", "#3E4A66", "#9A6672", "#E8A070"],
    far: "#6B7890",
    mid: "#3F4B60",
    near: "#1F2733",
    haze: "#C98A7A",
    light: "#FFD28A",
    shadow: "#141B27",
    second: "#D9A066",
    text: "#F4EEE3",
    dim: "#B9B2A8",
    dark: true,
  }),
  /** deep underground, lit from below by heat: maroon-black rock, ember orange, gold core */
  ember: fam({
    name: "ember",
    sky: ["#120B0B", "#24130F", "#3B1A10"],
    far: "#2E1E1C",
    mid: "#46281F",
    near: "#1A1010",
    haze: "#6A2A14",
    light: "#FF8A2A",
    shadow: "#0C0706",
    second: "#FFD36A",
    text: "#F6E7D4",
    dim: "#B89C86",
    dark: true,
  }),
  /** ocean at night: petrol teal sky and sea, moon-bone light, a warm eruption as the only heat */
  petrol: fam({
    name: "petrol",
    sky: ["#0A1E26", "#113840", "#1E5A5E"],
    far: "#1B4F55",
    mid: "#133C44",
    near: "#081E24",
    haze: "#2F6E70",
    light: "#DDEEE4",
    shadow: "#04141A",
    second: "#FF8C3A",
    text: "#EAF3EE",
    dim: "#9DB8B2",
    dark: true,
  }),
  /** space: warm-neutral near-black (not indigo), bone stars, copper / verdigris planets */
  void: fam({
    name: "void",
    sky: ["#07080B", "#111319", "#1A1D24"],
    far: "#2A2E36",
    mid: "#3A3F48",
    near: "#14161B",
    haze: "#23262E",
    light: "#FFE2A0",
    shadow: "#030304",
    second: "#C8763E",
    text: "#F1EADB",
    dim: "#9A9C97",
    dark: true,
  }),
  /** sunny everyday: powder sky, mint / ochre / terracotta town, bone paper light */
  noon: fam({
    name: "noon",
    sky: ["#9ED3E4", "#CFE9EE", "#F0F1E6"],
    far: "#B9D6D2",
    mid: "#8FBFB1",
    near: "#5E8F86",
    haze: "#DCEDEA",
    light: "#FFF6DC",
    shadow: "#3D5A58",
    second: "#E0B46A",
    text: "#23262A",
    dim: "#5F6B6A",
    dark: false,
  }),
  /** the character's studio: warm paper with soft shadows */
  studio: fam({
    name: "studio",
    sky: ["#F6F0E4", "#EFE6D4", "#E3D8C2"],
    far: "#DED3BC",
    mid: "#CFC2A8",
    near: "#B8AA8E",
    haze: "#EFE6D4",
    light: "#FFFBF2",
    shadow: "#8C7D66",
    second: "#7FAE9F",
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
