// L16 colour families (storyboard §1, BUILD.md §5). All OURS (F5: not Kurzgesagt's palette, no bird, no characters).
// Space is genuinely dark indigo with saturated bright accents; the Sun, corona and interior carry the chroma (golds,
// tangerine, magenta-violet). Every family keeps its OWN clean background (L15 lesson: a shared tinted band greyed or
// maroon-tinted frames and had to be switched off). Nothing grey: stars tinted, the MODEL stamp lavender-slate.
// USAGE
//   familyOf("space" | "corona" | "glow" | "cells" | "dense" | "core" | "shade" | "studio") → kit Family
//   pillFill(F)            → the pill background for family F (its shadow at 72 %)
//   L16_COLORS.gold …      → fixed episode colours; vermilion ONLY via L16_COLORS.vermilion on dial needles/fills,
//                            Tick, the "?" tag and one thread of the card's rings
//   sunGradient(r)         → radial-gradient stops [offset, colour][] for a Sun disc of radius r px: white-gold centre →
//                            gold → amber → tangerine → a magenta rim band that stays ≈ 70 px wide whatever r is
//   isDarkFamily(name)     → true for space / shade (value < 0.3: the dark-frame budget, storyboard §1)
//   STAR_TINTS             → the tinted star colours (gold, cyan, violet), never grey-white
import { Family, P, STUDIO_SET, mixHex } from "../../lib/illustrated";

/** Shared episode colours (storyboard §1). */
export const L16_COLORS = {
  gold: "#FFD15C",
  amber: "#FF9E2C",
  tangerine: "#F5701F",
  magenta: "#C2287E",
  violet: "#6A2BB0",
  indigo: "#12104A",
  saffron: "#E0A93A",
  teal: "#2FBFA8",
  bone: "#E6F5EA",
  stampGreen: "#2FBF71",
  stampBlue: "#3FA9E8",
  stampGrey: "#8C86C0",
  shield: "#2A1F45",
  probeNose: "#FFCF73",
  instrument: "#2FBF71",
  /** extras (same hues, lighter / deeper steps) */
  whiteGold: "#FFF3C4",
  honey: "#FFB347",
  saffronCore: "#FFE6A8",
  saffronDeep: "#9C6A16",
  tealDeep: "#1C8676",
  shieldRim: "#FFB020",
  deepSpace: "#04051A",
  cyan: "#5FE0F0",
  lavender: "#B8B0E8",
  paper: "#FFF6E6",
  ink: "#1A1030",
  vermilion: P.vermilion,
} as const;
const C = L16_COLORS;

export const STAR_TINTS = [C.gold, C.cyan, "#C9A8FF", "#FFE6A8"] as const;

const fam = (f: Omit<Family, "theme" | "accent">): Family => ({
  ...f,
  accent: P.vermilion,
  theme: { bg: f.sky[0], panel: mixHex(f.sky[0], f.text, 0.12), line: f.text, text: f.text, dim: f.dim, dark: f.dark },
});

/** The eight L16 families (storyboard §1 hexes). */
export const L16_FAMILIES = {
  /** the solar system, orbits, wind, the dark teasers: THE dark family (mean value ≈ 0.2 away from its lit subject) */
  space: fam({
    name: "space",
    // darkened 2026-11-14 (probe: only 1 % of samples under value 0.25): value ≈ 0.10 top → 0.22 bottom
    sky: ["#04051A", "#0A0A2C", "#141038"],
    far: "#18144A",
    mid: "#0E0C34",
    near: "#04041A",
    haze: "#141038",
    light: C.gold,
    shadow: C.deepSpace,
    bounce: C.magenta,
    second: C.amber,
    text: "#FFF4E0",
    dim: C.lavender,
    dark: true,
  }),
  /** the halo, the Alfvén boundary, the probe in the atmosphere: mid */
  corona: fam({
    name: "corona",
    sky: ["#1B0B4F", "#5B1E8F", "#B2287A", "#F2A03A"],
    far: "#7A2A9C",
    mid: "#4B1C7A",
    near: "#1B0B4F",
    haze: "#B2287A",
    light: C.gold,
    shadow: "#12063A",
    bounce: "#B2287A",
    second: C.shieldRim,
    text: "#FFF4E0",
    dim: "#F2C6EA",
    dark: true,
  }),
  /** the surface, photosphere and chromosphere: bright (the top stays violet so type reads; the gold is low) */
  glow: fam({
    name: "glow",
    sky: ["#2A0E5C", "#8E2A7E", C.tangerine, C.shieldRim, C.gold],
    far: C.magenta,
    mid: C.tangerine,
    near: C.violet,
    haze: C.shieldRim,
    light: "#FFF0B8",
    shadow: "#3A0F58",
    bounce: C.tangerine,
    second: C.violet,
    text: "#FFF8EC",
    dim: "#FFE2C0",
    dark: true,
  }),
  /** the convection zone: bright */
  cells: fam({
    name: "cells",
    sky: ["#3A0F58", C.magenta, C.tangerine, C.honey],
    far: "#8E2A7E",
    mid: C.magenta,
    near: "#3A0F58",
    haze: C.tangerine,
    light: C.whiteGold,
    shadow: "#2A0A42",
    bounce: C.magenta,
    second: C.gold,
    text: "#FFF8EC",
    dim: "#FFD8C8",
    dark: true,
  }),
  /** the radiative zone (calm, thick): bright-mid honey with violet shadows; dark ink */
  dense: fam({
    name: "dense",
    sky: [C.honey, "#F29A2E", "#E08A1E"],
    far: "#E08A1E",
    mid: "#B2651A",
    near: "#4A1D78",
    haze: "#FFC870",
    light: "#FFE08A",
    shadow: "#4A1D78",
    bounce: C.violet,
    second: C.violet,
    text: "#2A0E4A",
    dim: "#5A2470",
    dark: false,
  }),
  /** the core and the neutrino field: mid (white-gold centre, magenta, an indigo rim). Text on the rim is light; on the
   *  bright centre use `core.near` ink. */
  core: fam({
    name: "core",
    sky: ["#1C0F52", C.magenta, C.gold, C.whiteGold],
    far: C.magenta,
    mid: C.violet,
    near: "#1C0F52",
    haze: C.gold,
    light: "#FFF8DC",
    shadow: "#120A3A",
    bounce: C.magenta,
    second: C.violet,
    text: "#FFF8EC",
    dim: "#FFD6F0",
    dark: true,
  }),
  /** the pocket behind the shield: the other dark family (amber rim + instrument green carry the saturation) */
  shade: fam({
    name: "shade",
    // darkened 2026-11-14 with space: value ≈ 0.10-0.25; the amber rim and instrument green carry it
    sky: ["#05041A", "#0C0A2C", "#161040"],
    far: "#1E1258",
    mid: "#0C0A2C",
    near: "#05041A",
    haze: "#161040",
    light: C.shieldRim,
    shadow: "#05041A",
    bounce: C.instrument,
    second: C.shieldRim,
    text: "#FFF4E0",
    dim: C.lavender,
    dark: true,
  }),
  /** the evidence board, plates, charts, honesty beat: the OBSERVATORY (art director 2026-11-14: the kit's teal cyc read as
   *  a different video cut into the purple/orange world). A deep indigo-violet wall rising from a warm horizon glow (the
   *  Sun off-frame), a mauve-ember floor; mid-dark (value ≈ 0.25-0.4), light text. Cards, boards and plates are warm paper
   *  (`L16_COLORS.paper`) so they pop. L16-local override: the kit's STUDIO_SET is untouched (other episodes use it). */
  studio: fam({
    name: "studio",
    // wall value ≈ 0.15-0.24 (darkened 2026-11-14 with space); the warm horizon glow is a thin band
    sky: ["#0B0826", "#130E36", "#1E1244", "#2E164C"],
    far: "#3A1C5C",
    mid: "#24103E",
    near: "#0E0828",
    haze: "#B85A34",
    light: "#FFE6A8",
    shadow: "#0E0828",
    bounce: "#F4A060",
    second: C.gold,
    text: "#FFF4E0",
    dim: "#D8CCF4",
    dark: true,
  }),
} as const satisfies Record<string, Family>;

/** The kit's teal cyc, kept for reference only (do not use in L16 shots). */
export const KIT_STUDIO_SET = STUDIO_SET;

export type L16FamilyName = keyof typeof L16_FAMILIES;
export const familyOf = (name: L16FamilyName): Family => L16_FAMILIES[name];
export const isDarkFamily = (name: L16FamilyName) => name === "space" || name === "shade";

/** Pills everywhere in this episode: the family shadow at 72 % (STYLE-V2 §11). */
export const pillFill = (F: Family) => {
  const v = [1, 3, 5].map((i) => parseInt(F.shadow.slice(i, i + 2), 16));
  return `rgba(${v[0]},${v[1]},${v[2]},0.72)`;
};

/** Radial-gradient stops for a Sun disc of radius r (px): the magenta rim band stays ≈ 70 px wide (no outline, F5). */
export const sunGradient = (r = 600): [number, string][] => {
  const rim = Math.min(0.25, 70 / Math.max(1, r));
  return [
    [0, C.whiteGold],
    [Math.max(0.2, 0.55 - rim), C.gold],
    [1 - rim * 2.2, C.amber],
    [1 - rim, C.tangerine],
    [1, C.magenta],
  ];
};
