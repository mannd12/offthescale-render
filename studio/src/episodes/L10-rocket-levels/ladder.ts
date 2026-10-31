// The eleven rungs of L10. Thrust in newtons, fuel share in percent, from episodes/L10-rocket-levels/sources.md.
// `pct` exists only where a row supports it; the tank never interpolates.
import { Level } from "../../brand/tokens";

export const SERIES = "EVERY LEVEL OF ROCKET";

export const LEVELS: (Level & { n: number; pct?: number })[] = [
  { id: "l01", name: "The weakest", reading: "0.091 N", image: "l10-ion", n: 0.091, pct: 39 },
  { id: "l02", name: "The hobby rocket", reading: "10.7 N", image: "l10-model", n: 10.7, pct: 5 },
  { id: "l03", name: "To the edge", reading: "89 kN", image: "l10-bb9", n: 8.9e4 },
  { id: "l04", name: "A few inches", reading: "347 kN", image: "l10-mr3", n: 3.47e5 },
  { id: "l05", name: "The rule", reading: "1.9 MN", image: "l10-titan", n: 1.9e6 },
  { id: "l06", name: "The workhorse", reading: "~3.6 MN", image: "l10-dawn", n: 3.6e6 },
  { id: "l07", name: "Many engines", reading: "22 MN+", image: null, glyph: "27", n: 2.2e7 },
  { id: "l08", name: "The classic", reading: "33 MN", image: "l10-a4", n: 3.3e7, pct: 90 },
  { id: "l09", name: "Half solid", reading: "~35 MN", image: null, glyph: "~35 MN", n: 3.47e7, pct: 84 },
  { id: "l10", name: "The modern giant", reading: "39 MN", image: null, glyph: "39 MN", n: 3.9e7, pct: 86 },
  { id: "l11", name: "The top of the tape", reading: "74 MN", image: null, n: 7.4e7 },
];

export const LEVELS_REVEALED: (Level & { n: number; pct?: number })[] = [...LEVELS.slice(0, 10), { ...LEVELS[10], image: "l10-starship" }];

const LOG_MIN = -2; // 0.01 N
const LOG_MAX = 8.2; // room for the dashed 103 MN
export const TOP = 262;
export const BOT = 912;
/** y on the tape for a thrust in newtons */
export const tapeY = (n: number) => BOT - ((Math.log10(Math.max(n, 0.01)) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * (BOT - TOP);
export const TAPE_MARKS: { n: number; label?: string }[] = [
  { n: 1e-2 }, { n: 1e-1, label: "0.1 N" }, { n: 1 }, { n: 1e1, label: "10 N" }, { n: 1e2 }, { n: 1e3, label: "1 kN" }, { n: 1e4 }, { n: 1e5, label: "100 kN" }, { n: 1e6 }, { n: 1e7, label: "10 MN" }, { n: 1e8 },
];
/** a sweep between two thrusts moves evenly in the log */
export const logMix = (a: number, b: number, k: number) => 10 ** (Math.log10(a) + (Math.log10(b) - Math.log10(a)) * k);
