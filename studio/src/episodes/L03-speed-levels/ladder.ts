// The twelve rungs of L03 and the speedometer that ties them together.
// Speeds are the script's verified numbers (episodes/L03-speed-levels/sources.md).
import { Level } from "../../brand/tokens";

export const SERIES = "EVERY LEVEL OF SPEED";

/** km/h for every rung; the gauge is logarithmic because the ladder spans 8 orders of magnitude. */
export const LEVELS: (Level & { kmh: number })[] = [
  { id: "l01", name: "Walking", reading: "5 km/h", image: null, glyph: "5 km/h", kmh: 5 },
  { id: "l02", name: "Fastest human", reading: "44 km/h", image: null, glyph: "44", kmh: 44 },
  { id: "l03", name: "Fastest land animal", reading: "93 km/h", image: null, glyph: "93", kmh: 93 },
  { id: "l04", name: "Sound, on wheels", reading: "1,228 km/h", image: "thrustssc-museum", kmh: 1228 },
  // tile image: the X-1 lakebed photo (NASA E-1914), not the schlieren scan - the kit Tile cannot crop the scan's border and data board
  { id: "l05", name: "The speed of sound", reading: "Mach 1", image: "x1-lakebed", kmh: 1235 },
  { id: "l06", name: "Above Mach 3", reading: "SR-71", image: "sr71-takeoff", kmh: 3418 }, // SR-71 final-flight average, 2,124 mph (sources.md #27)
  { id: "l07", name: "Fastest aircraft", reading: "Mach 6.7", image: "x15-flight", kmh: 7274 },
  { id: "l08", name: "Coming home", reading: "27,000 km/h", image: null, glyph: "3,000 °F", kmh: 27000 },
  { id: "l09", name: "Falling forever", reading: "8 km/s", image: "iss-sunrise", kmh: 27700 },
  { id: "l10", name: "Leaving", reading: "11.2 km/s", image: null, glyph: "11.2 km/s", kmh: 40270 }, // 11.186 km/s x 3,600 (sources.md #12)
  { id: "l11", name: "Fastest ever built", reading: "700,000 km/h", image: null, glyph: "PARKER", kmh: 692000 },
  { id: "l12", name: "The limit", reading: "299,792 km/s", image: null, kmh: 1079252849 },
];

/** the same twelve once rung 12 has named its tile: its plate, the Sun (NASA/SDO) - used on the last rung and the closer */
export const LEVELS_REVEALED: (Level & { kmh: number })[] = [...LEVELS.slice(0, 11), { ...LEVELS[11], image: "sun-sdo" }];

/** Earth's escape velocity on the gauge: 11.186 km/s x 3,600 = 40,270 km/h, shown rounded (sources.md #12). */
export const ESCAPE_KMH = 40270;
export const ESCAPE_READING = "≈ 40,300 km/h";

/**
 * Per-plate crop for full-frame use. schlieren (ARC-1948-A-13146-8) is a scan with dark margins at both sides
 * and a lettered data board along the top: scale in and anchor low so the margins and the board leave the frame.
 */
export const PLATE_CROP: Record<string, { scale: number; origin: string }> = {
  schlieren: { scale: 1.6, origin: "50% 76.5%" },
};

export const C_KMH = 1079252849; // 299,792,458 m/s exactly (sources.md #16)

/** 0-1 along the gauge: log10 scale from 1 km/h to c. */
export const speedPos = (kmh: number) => {
  const v = Math.max(1, Math.min(C_KMH, kmh));
  return Math.log10(v) / Math.log10(C_KMH);
};

export const fmtKmh = (kmh: number) => {
  if (kmh >= 1e6) return `${(kmh / 3600).toLocaleString("en-US", { maximumFractionDigits: 0 })} km/s`;
  return `${Math.round(kmh).toLocaleString("en-US")} km/h`;
};

/** the ratio to a walk, as the gauge subtitle */
// only the two readings the narration names; the "≈ N× a walk" multiples it used to print were never spoken (review pass 1, A2)
export const walkSub = (kmh: number) => (kmh < 6 ? "your walking pace" : kmh >= C_KMH * 0.999 ? "the speed of light" : " ");
