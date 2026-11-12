// L13 colour families (storyboard §1). Kit families dusk · ember · petrol · void · noon, the saturated teal studio
// cyclorama STUDIO_SET in place of the bone studio (never bone in L13: it measured as L12's greyest stretch), L12's
// MARS sky (reused by import, ochre and terracotta on butterscotch haze) and one new sky, VAPOUR: the satellite view of
// 7-02 / 7-03 (petrol-black ground, teal and bone water-vapour swirls; never indigo). All OURS, not Kurzgesagt's.
// Vermilion only on: the dB gauge fill + readout, Tick, the Rodriguez pin and the "?" tag. Saffron carries pressure
// fronts, the ceiling line, the Krakatoa pin and outward rings; teal-bone the returning rings and rings in water;
// gold the POWER meter (F4).
import { FAMILIES, Family, FamilyName, P, STUDIO_SET, mixHex } from "../../lib/illustrated";
import { MARS } from "../L12-mountain-limit/families";

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

/** Satellite water-vapour view (7-02, 7-03): petrol-black ground, teal `#2FBFA8` and bone `#E6F5EA` swirl tones, lit
 *  from above. Its `second` is saffron so an outward ring reads on it. */
export const VAPOUR: Family = fam({
  name: "vapour",
  sky: ["#03171D", "#062A33", "#0B4249"],
  far: "#1C7A74",
  mid: "#12575A",
  near: "#041F26",
  haze: "#2FBFA8",
  light: "#E6F5EA",
  shadow: "#020C10",
  bounce: "#2FBFA8",
  second: "#E0A93A",
  text: "#F0FAF4",
  dim: "#A9D4CC",
  dark: true,
});

/** Every family L13 uses, by the storyboard's names. `studio` resolves to STUDIO_SET (the teal cyc), never bone. */
export const L13_FAMILIES = { ...FAMILIES, studio: STUDIO_SET, mars: MARS, vapour: VAPOUR } as const;
export type L13FamilyName = FamilyName | "mars" | "vapour";
export const familyOf = (name: L13FamilyName): Family => L13_FAMILIES[name];

/** Pills everywhere in this episode: the family shadow at 72 % (STYLE-V2 §11). */
export const pillFill = (F: Family) => {
  const v = [1, 3, 5].map((i) => parseInt(F.shadow.slice(i, i + 2), 16));
  return `rgba(${v[0]},${v[1]},${v[2]},0.72)`;
};

/** Shared episode colours (storyboard §1). */
export const L13_COLORS = {
  /** the ceiling line, every shock front, the Krakatoa pin and plume, outward rings on the globe */
  saffron: "#E0A93A",
  saffronCore: "#FFE6A8",
  saffronDeep: "#9C6A16",
  /** sound in air (the wave's glow), returning rings */
  teal: "#2FBFA8",
  /** returning rings, rings in water, the vacuum-line label (petrol.light) */
  bone: "#E6F5EA",
  /** the POWER meter (dusk.light): never vermilion, so it never reads as the air gauge (F4) */
  gold: "#FFCF73",
  goldDeep: "#B9862C",
  /** survey-map land: ochre, never bone (saturation) */
  land: "#E3A256",
  landShade: "#B97834",
  /** powder sea of the survey map */
  sea: "#8FD2E6",
  seaDeep: "#4FB5DE",
  vermilion: P.vermilion,
} as const;
