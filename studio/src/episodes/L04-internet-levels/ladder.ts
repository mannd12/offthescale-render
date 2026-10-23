// L04's seven levels plus the myth line, and the iceberg that is this episode's gauge.
import { Level } from "../../brand/tokens";

export const SERIES = "EVERY LEVEL OF THE INTERNET";

/** scene ids in order; the myth line sits between l03 and l04 and has its own scene id "myth" */
export const LEVELS: Level[] = [
  { id: "l01", name: "The surface web", reading: "searchable", image: null, glyph: "WWW" },
  { id: "l02", name: "The deep web", reading: "behind a login", image: null, glyph: "🔒" },
  { id: "l03", name: "The dark web", reading: "Tor · 2002", image: null, glyph: "TOR" },
  { id: "l04", name: "The exchange", reading: "where networks meet", image: null, glyph: "IXP" },
  { id: "l05", name: "The data centre", reading: "where pages live", image: "aitken-shed" },
  // no photo: the only plate (the cable ship) is not a landing station, and the scene itself is drawn
  { id: "l06", name: "The landing station", reading: "into the sea", image: null, glyph: "SHORE" },
  { id: "l07", name: "", reading: "", image: null },
];

/** the same seven once the last one has been named (rung 7 reveal, the closer) */
export const LEVELS_REVEALED: Level[] = [...LEVELS.slice(0, 6), { id: "l07", name: "The cable", reading: "the sea floor", image: "swimming-cucumber", ext: "png" }];

/** 0-1 down the iceberg for each scene; the myth line is between the web and the wire */
export const ICE_POS: Record<string, number> = { cold: 0, l01: 0.06, l02: 0.2, l03: 0.36, myth: 0.46, l04: 0.58, l05: 0.7, l06: 0.82, l07: 0.97, closer: 0.97 };
export const MYTH_LINE = 0.46;
export const WATERLINE = 0.12;
