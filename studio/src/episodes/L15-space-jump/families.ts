// L15 colour families + the altitude sky (storyboard §1, BUILD.md §5). All OURS (F13: not Kurzgesagt's palette).
// USAGE
//   familyOf("void" | "dusk" | "ember" | "petrol" | "noon" | "studio")  → kit Family; "studio" = STUDIO_SET (never bone)
//   pillFill(F)                → the pill background for family F (shadow at 72 %)
//   L15_COLORS.saffron …       → fixed episode colours (strata, probe, limb, stars); vermilion only via L15_COLORS.vermilion
//                                on the gauge needles/fills, Tick, the "?" tag and the aurora/thermosphere thread (F11)
//   skyAt(altKm)               → the sky colour at an altitude (#3FA9E8 at 0 km … #04051A at ≥ 100 km); saturated, never grey
//   skyStops(altTop, altBottom, n?) → top→bottom gradient stops for a frame showing that altitude span (SkyColumn uses it)
//   skyFamily(altKm)           → a full kit Family keyed to that altitude (for <Stage theme>, pills, plates, L15Card)
//   isDark(altKm)              → true above 45 km (value < 0.3: counts toward the ≥ 10 % dark-frame target)
//   STRATUM / stratumAt(altKm) → the fixed layer colours (tropo sky blue, strato teal, meso indigo, thermo ember 18 %)
import { FAMILIES, Family, FamilyName, P, STUDIO_SET, mixHex } from "../../lib/illustrated";

/** Every family L15 uses, by the storyboard's names. `studio` resolves to STUDIO_SET (the teal cyc), never bone. */
export const L15_FAMILIES = { ...FAMILIES, studio: STUDIO_SET } as const;
export type L15FamilyName = FamilyName;
export const familyOf = (name: L15FamilyName): Family => L15_FAMILIES[name];

/** Pills everywhere in this episode: the family shadow at 72 % (STYLE-V2 §11). */
export const pillFill = (F: Family) => {
  const v = [1, 3, 5].map((i) => parseInt(F.shadow.slice(i, i + 2), 16));
  return `rgba(${v[0]},${v[1]},${v[2]},0.72)`;
};

/** Shared episode colours (storyboard §1). */
export const L15_COLORS = {
  /** gauge end-stops, the 100 km FAI line, drawing heads, stamps, pins */
  saffron: "#E0A93A",
  saffronCore: "#FFE6A8",
  saffronDeep: "#9C6A16",
  /** the probe body, air dots, stratosphere band */
  teal: "#2FBFA8",
  tealDeep: "#1C8676",
  /** teal-bone (petrol.light): air dots on dark, ticks, haze highlights */
  bone: "#E6F5EA",
  /** the planet's rim (Limb) */
  limb: "#35D0E8",
  /** the limb's city-glow band (ember-saffron) */
  cityGlow: "#F0A050",
  /** the planet body under the limb (deep petrol, never grey) */
  planet: "#0B3A4A",
  planetDeep: "#062530",
  /** strata (fixed, so the ruler reads at a glance) */
  skyBlue: "#3FA9E8",
  strato: "#2FBFA8",
  meso: "#4B3FD0",
  thermo: "#E4572E",
  /** the probe */
  probe: "#2FBFA8",
  probeShade: "#1C8676",
  probeNose: "#FFCF73",
  /** tinted stars (never grey-white) */
  starTeal: "#8FF0E0",
  starGold: "#FFD98A",
  /** cloud / frost: teal-white and powder blue, never grey */
  cloud: "#E8FBF6",
  cloudShade: "#A9DCEB",
  frost: "#9FD8EE",
  /** the desert floor (ground sliver, launch field) */
  dune1: "#E3A256",
  dune2: "#D2843F",
  dune3: "#B9692E",
  /** balloon film */
  film: "#7FE3D4",
  vermilion: P.vermilion,
} as const;

/** Sky stops (storyboard §1): [altitude km, colour]. Mean value ≈ 0.37 at 40 km (not yet dark); dark from ≈ 45 km. */
export const SKY_STOPS: [number, string][] = [
  [0, "#3FA9E8"],
  [12, "#2C6FD0"],
  [25, "#1D3F9E"],
  [40, "#13215E"],
  [60, "#0B1040"],
  [85, "#070A2E"],
  [100, "#04051A"],
];

/** The sky colour at an altitude (km); linear between the storyboard stops, flat below 0 and above 100 km. */
export const skyAt = (altKm: number): string => {
  if (altKm <= SKY_STOPS[0][0]) return SKY_STOPS[0][1];
  for (let i = 1; i < SKY_STOPS.length; i++) {
    const [a1, c1] = SKY_STOPS[i];
    const [a0, c0] = SKY_STOPS[i - 1];
    if (altKm <= a1) return mixHex(c0, c1, (altKm - a0) / (a1 - a0));
  }
  return SKY_STOPS[SKY_STOPS.length - 1][1];
};

/** Gradient stops, top → bottom, for a frame whose top edge is at `altTop` km and bottom edge at `altBottom` km. */
export const skyStops = (altTop: number, altBottom: number, n = 9): string[] =>
  Array.from({ length: n }, (_, i) => skyAt(altTop + ((altBottom - altTop) * i) / (n - 1)));

/** Value < 0.3 above this altitude (storyboard §1). */
export const DARK_KM = 45;
export const isDark = (altKm: number) => altKm > DARK_KM;

/** A kit Family for an altitude: sky = the local gradient, text bone on dark skies, deep ink on the bright low sky. */
export const skyFamily = (altKm: number): Family => {
  const c = skyAt(altKm);
  const dark = altKm > 8; // the 12-km blue (#2C6FD0) already needs light text
  const text = dark ? "#F2FBF7" : "#0E2A3E";
  return {
    name: `sky-${Math.round(altKm)}`,
    sky: [skyAt(altKm + 8), c, skyAt(Math.max(0, altKm - 8))],
    far: mixHex(c, L15_COLORS.limb, 0.25),
    mid: mixHex(c, "#000000", 0.2),
    near: mixHex(c, "#000000", 0.45),
    haze: mixHex(c, L15_COLORS.teal, 0.3),
    light: dark ? "#FFE1A0" : "#FFF3C8",
    shadow: mixHex(c, "#000000", 0.6),
    bounce: L15_COLORS.limb,
    second: L15_COLORS.saffron,
    text,
    dim: dark ? "#A9C8E6" : "#244A66",
    accent: P.vermilion,
    dark,
    theme: { bg: c, panel: mixHex(c, text, 0.12), line: text, text, dim: dark ? "#A9C8E6" : "#244A66", dark },
  };
};

/** Layer tops (row 10, NOAA: stratosphere to 50 km, mesosphere to 85 km; the troposphere top varies 6-20 km, drawn at
 *  12 km with NO number on screen). */
export const LAYER_TOPS = { tropo: 12, strato: 50, meso: 85 } as const;
export type Stratum = "tropo" | "strato" | "meso" | "thermo";
export const stratumAt = (altKm: number): Stratum =>
  altKm < LAYER_TOPS.tropo ? "tropo" : altKm < LAYER_TOPS.strato ? "strato" : altKm < LAYER_TOPS.meso ? "meso" : "thermo";
export const STRATUM = { tropo: L15_COLORS.skyBlue, strato: L15_COLORS.strato, meso: L15_COLORS.meso, thermo: L15_COLORS.thermo } as const;
export const STRATUM_NAME = { tropo: "troposphere", strato: "stratosphere", meso: "mesosphere", thermo: "thermosphere" } as const;
