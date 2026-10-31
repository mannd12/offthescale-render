// The nine levels of L07 plus the open top. Gauge readings: episodes/L07-volcano-levels/sources.md, rows in comments.
import { Level } from "../../brand/tokens";

export const SERIES = "EVERY LEVEL OF ERUPTION";

export type Rung = Level & { vei: number; sub: string };

export const LEVELS: Rung[] = [
  { id: "s1", name: "Level 0 · Non-explosive", reading: "UNDER 10,000 m³", sub: "the bracket for level 0", image: "l07-ml-aerial", vei: 0 }, // #5, #7, #12
  { id: "s2", name: "Level 1 · Gentle", reading: "10,000s OF m³", sub: "the bracket for level 1", image: "l07-strom-kuhnmi", vei: 1 }, // #5, #7
  { id: "s3", name: "Level 2 · Explosive", reading: "MILLIONS OF m³", sub: "the bracket for level 2", image: "l07-msh-night", vei: 2 }, // #5, #19: no tephra figure found
  { id: "s4", name: "Level 3 · Severe", reading: "ABOUT 20M m³", sub: "dense-rock measure", image: "l07-red-apr", vei: 3 }, // #21
  { id: "s5", name: "Level 4 · Cataclysmic", reading: "0.27 km³", sub: "airborne, bulk", image: "l07-eyja-plume", vei: 4 }, // #24
  { id: "s6", name: "Level 5 · Paroxysmal", reading: "ABOUT 1 km³", sub: "of ash", image: "l07-msh-plume", vei: 5 }, // #26
  { id: "s7", name: "Level 6 · Colossal", reading: "5–9 km³", sub: "level 6 is near 10", image: "l07-pina-jun15", vei: 6 }, // #4, #31: brief.md's gauge note
  { id: "s8", name: "Level 7 · Super-colossal", reading: "150+ km³", sub: "of tephra", image: "l07-tam-iss", vei: 7 }, // #39
  { id: "s9", name: "Level 8 · Mega-colossal", reading: "1,000+ km³", sub: "of ash", image: "l07-tuff", vei: 8 }, // #4
  { id: "s10", name: "The open top", reading: "?", sub: "still a judgement", image: null, glyph: "?", vei: 8 }, // #48
];

/** the cold open names the scale, not a rung */
export const LEVELS_COLD: Rung[] = [{ ...LEVELS[0], name: "A score of zero?" }, ...LEVELS.slice(1)];
