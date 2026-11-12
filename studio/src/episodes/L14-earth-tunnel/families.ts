// L14 colour families (storyboard §1, BUILD.md §5). Kit families dusk · ember · petrol · void · noon, the saturated teal
// studio cyclorama STUDIO_SET in place of the bone studio (never bone), and one new sky, IRON: an ember variant for the
// liquid-iron outer core, lit from BELOW (ground #2B0C08 → #7A2A0E → #C2561A, light #FFD27A, bounce #FF7A30, swirl tones
// gold-orange #FF9A3C and pale gold #FFE6A8). All OURS, not Kurzgesagt's.
// Vermilion only on: the gauge cluster's fills and needles, Tick, the "?" tag. Saffron: gauge end-stops, the hazard
// band, drawing heads of dotted lines. Teal-bone: air haze and the probe's body. Nothing grey anywhere.
import { FAMILIES, Family, FamilyName, P, STUDIO_SET, mixHex } from "../../lib/illustrated";

const fam = (f: Omit<Family, "theme" | "accent">): Family => ({
  ...f,
  accent: P.vermilion,
  theme: {
    bg: f.sky[0],
    panel: mixHex(f.sky[0], f.text, 0.12),
    line: f.text,
    text: f.text,
    dim: f.dim,
    dark: f.dark,
  },
});

/** The liquid-iron sea (6-01…6-06, 6-16 key art): maroon ground brightening downward, gold light from below. */
export const IRON: Family = fam({
  name: "iron",
  sky: ["#2B0C08", "#7A2A0E", "#C2561A"],
  far: "#A8441A",
  mid: "#7A2A0E",
  near: "#3A1008",
  haze: "#C2561A",
  light: "#FFD27A",
  shadow: "#1A0604",
  bounce: "#FF7A30",
  second: "#FF9A3C",
  text: "#FFF0DC",
  dim: "#E6B48A",
  dark: true,
});

/** Every family L14 uses, by the storyboard's names. `studio` resolves to STUDIO_SET (the teal cyc), never bone. */
export const L14_FAMILIES = { ...FAMILIES, studio: STUDIO_SET, iron: IRON } as const;
export type L14FamilyName = FamilyName | "iron";
export const familyOf = (name: L14FamilyName): Family => L14_FAMILIES[name];

/** Pills everywhere in this episode: the family shadow at 72 % (STYLE-V2 §11). */
export const pillFill = (F: Family) => {
  const v = [1, 3, 5].map((i) => parseInt(F.shadow.slice(i, i + 2), 16));
  return `rgba(${v[0]},${v[1]},${v[2]},0.72)`;
};

/** Shared episode colours (storyboard §1). Strata colours are fixed so the tunnel reads at a glance. */
export const L14_COLORS = {
  /** gauge end-stops, the 175-km hazard band, drawing heads of dotted lines */
  saffron: "#E0A93A",
  saffronCore: "#FFE6A8",
  saffronDeep: "#9C6A16",
  /** air haze, the probe's body */
  teal: "#2FBFA8",
  tealDeep: "#1C8676",
  /** teal-bone (petrol.light): haze highlights, ticks on dark plates */
  bone: "#E6F5EA",
  /** strata */
  crust: "#E3A256",
  crustDeep: "#B97834",
  mantle: "#C45A2A",
  mantleDeep: "#9C3A1C",
  outer: "#FF9A3C",
  outerDeep: "#C2561A",
  inner: "#FFE6A8",
  innerCore: "#FFF6D8",
  /** the probe */
  probe: "#2FBFA8",
  probeShade: "#1C8676",
  probeNose: "#FFCF73",
  /** ice / crystals / frost: teal-white and powder blue, never grey */
  ice: "#D8F4EE",
  frost: "#9FD8EE",
  /** the gauges' "warm" band on HEAT (green, storyboard §5 BUILD) */
  warm: "#5FC28A",
  vermilion: P.vermilion,
} as const;

/** Strata colour at a depth (km below the surface) along a pole-to-pole diameter (NASA radii #12, USGS #15, crust
 *  5-40 km #21): crust to 35 km, mantle to the core boundary (2,886 km, #13), outer core to 5,121 km (inner core radius
 *  1,250 km, #15), inner core through the centre, then mirrored. */
export const R_EARTH = 6371; // #12
export const R_CORE = 3485; // #12
export const R_INNER = 1250; // #15 (USGS; F15)
export const CRUST_KM = 35; // drawn thickness (crust 5-40 km, #21); never labelled as one number
export const stratumAt = (depthKm: number): "crust" | "mantle" | "outer" | "inner" => {
  const r = Math.abs(R_EARTH - Math.max(0, Math.min(2 * R_EARTH, depthKm)));
  if (r > R_EARTH - CRUST_KM) return "crust";
  if (r > R_CORE) return "mantle";
  if (r > R_INNER) return "outer";
  return "inner";
};
export const STRATUM_COLOR = { crust: L14_COLORS.crust, mantle: L14_COLORS.mantle, outer: L14_COLORS.outer, inner: L14_COLORS.inner } as const;
