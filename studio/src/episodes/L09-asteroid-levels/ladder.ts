// The eleven rungs of L09. Sizes in metres, from episodes/L09-asteroid-levels/sources.md (row numbers in script.md).
import { Level } from "../../brand/tokens";

export const SERIES = "EVERY SIZE OF ASTEROID";

export const LEVELS: (Level & { m: number })[] = [
  { id: "l01", name: "Dust", reading: ">0.1 mm", image: "l09-micro", m: 1e-4 },
  { id: "l02", name: "A grain", reading: "sand to pea", image: "l09-meteor", tileCrop: { scale: 3, origin: "55% 50%" }, m: 2e-3 },
  { id: "l03", name: "Half a metre", reading: "<0.5 m", image: null, glyph: "<0.5 m", m: 0.5 },
  { id: "l04", name: "A whale's length", reading: "~18 m", image: null, glyph: "18 m", m: 18 },
  { id: "l05", name: "A range", reading: "40-80 m", image: "l09-tunguska", m: 60 },
  { id: "l06", name: "The one we hit", reading: "~170 m", image: "l09-dimorphos", ext: "png", m: 170 },
  { id: "l07", name: "The close pass", reading: "340 m", image: null, glyph: "340 m", m: 340 },
  { id: "l08", name: "The one we touched", reading: "~500 m", image: "l09-bennu", m: 500 },
  { id: "l09", name: "Known by its crater", reading: "~10 km", image: null, glyph: "10 km", m: 1e4 },
  { id: "l10", name: "A layered world", reading: "~530 km", image: "l09-vesta", m: 5.3e5 },
  { id: "l11", name: "The top", reading: "~952 km", image: null, m: 9.52e5 },
];

/** the last tile stays the mystery tile until its own rung names it */
export const LEVELS_REVEALED: (Level & { m: number })[] = [...LEVELS.slice(0, 10), { ...LEVELS[10], image: "l09-occator" }];

export const LOG_MIN = -4; // 0.1 mm (#6)
export const LOG_MAX = Math.log10(9.52e5); // Ceres (#47): the bar stops here, nothing beyond it
const X0 = 70;
const X1 = 1850;
/** x on the ruler for a size in metres */
export const rulerX = (m: number) => X0 + ((Math.log10(m) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * (X1 - X0);
export const RULER_MARKS: { m: number; label: string }[] = [
  { m: 1e-4, label: "0.1 mm" },
  { m: 1e-3, label: "1 mm" },
  { m: 1e-2, label: "1 cm" },
  { m: 1e-1, label: "10 cm" },
  { m: 1, label: "1 m" },
  { m: 10, label: "10 m" },
  { m: 100, label: "100 m" },
  { m: 1e3, label: "1 km" },
  { m: 1e4, label: "10 km" },
  { m: 1e5, label: "100 km" },
];
