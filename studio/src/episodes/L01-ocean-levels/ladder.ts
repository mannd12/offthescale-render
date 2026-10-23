// The twelve rungs of L01 and the depth gauge that ties them together.
// Depths are the script's verified numbers (episodes/L01-ocean-levels/sources.md).
import { GaugeStop } from "../../brand/kit";
import { Level } from "../../brand/tokens";

// Tile images are real NOAA/USN public-domain stills from assets/manifest.json, chosen from roughly
// the rung's depth. They are the strip at the top, not the rung's main visual - each scene picks its own.
export const LEVELS: Level[] = [
  { id: "l01", name: "Sunlight zone", reading: "0–200 m", image: "whale-shark" },
  { id: "l02", name: "The last plant", reading: "200 m", image: "lancetfish" },
  { id: "l03", name: "Deepest scuba dive", reading: "332 m", image: "diver-reef" },
  { id: "l04", name: "Greatest migration", reading: "≈500 m", image: "comb-jelly", ext: "png" },
  { id: "l05", name: "Midnight zone", reading: "1,000 m", image: "lizardfish" },
  { id: "l06", name: "Life without the Sun", reading: "2,500 m", image: "riftia" },
  // the whale is small in the aerial photo: tiles frame it (plate scale 1: fluke ~(870,380), head ~(1095,825))
  { id: "l07", name: "The deepest breath", reading: "2,992 m", image: "beaked-whale", tileCrop: { scale: 2.0, origin: "51% 56%", brightness: 1.5 } },
  { id: "l08", name: "Titanic", reading: "3,800 m", image: "titanic-bow" },
  { id: "l09", name: "The abyss", reading: "4,000–6,000 m", image: "swimming-cucumber", ext: "png" },
  { id: "l10", name: "The trenches", reading: "6,000 m+", image: "dumbo-real" },
  { id: "l11", name: "The last fish", reading: "8,336 m", image: "snailfish-hadal", ext: "png" },
  { id: "l12", name: "The bottom", reading: "10,935 m", image: null },
];

/** The strip once the bottom has been revealed (Level 12's own scene after its reveal, and the closer):
 *  the "???" tile becomes the Trieste on 23 January 1960 (NH 96797). Earlier levels keep the mystery tile. */
export const LEVELS_REVEALED: Level[] = [...LEVELS.slice(0, 11), { ...LEVELS[11], image: "trieste-1960" }];

export const SERIES = "EVERY LEVEL OF THE OCEAN";

/** Gauge stops: evenly spaced so the busy shallow rungs aren't squashed against the bottom. */
export const STOPS: (GaugeStop & { m: number })[] = [
  { at: 0, m: 0, label: "0 m" },
  { at: 0.13, m: 200, label: "200 m" },
  { at: 0.3, m: 1000, label: "1,000 m" },
  { at: 0.45, m: 2500, label: "2,500 m" },
  { at: 0.58, m: 3800, label: "3,800 m" },
  { at: 0.74, m: 6000, label: "6,000 m" },
  { at: 0.88, m: 8336, label: "8,336 m" },
  { at: 1, m: 10935, label: "10,935 m" },
];

/** 0-1 gauge position for a depth in metres, piecewise-linear between the stops. */
export const depthPos = (m: number) => {
  const d = Math.max(0, Math.min(STOPS[STOPS.length - 1].m, m));
  for (let i = 1; i < STOPS.length; i++) {
    if (d <= STOPS[i].m) {
      const a = STOPS[i - 1];
      const b = STOPS[i];
      return a.at + ((d - a.m) / (b.m - a.m)) * (b.at - a.at);
    }
  }
  return 1;
};

export const fmtDepth = (m: number) => `${Math.round(m).toLocaleString("en-US")} m`;

/**
 * ABSOLUTE pressure as a multiple of surface pressure: the 1 atm of air already on you, plus 1 atm per
 * 10.06 m of seawater (sources.md #11, NOAA; matches its "~34 atm at 332 m", "~1,090 atm at 10,935 m").
 * Fixed 2026-09-25: the old version left out the +1, so shallow readings were a whole step low
 * (40 m showed 4×; it is 5×).
 */
export const pressureX = (m: number) => Math.round(1 + m / 10.06);
/** "≈ N× · label" from the LIVE depth - for scenes whose gauge moves (fixed labels went stale mid-animation). */
export const pressureTag = (m: number, label: string) => `≈ ${pressureX(m).toLocaleString("en-US")}× · ${label}`;
export const pressureSub = (m: number) => (m < 5 ? "surface pressure" : `≈ ${Math.round(1 + m / 10.06).toLocaleString("en-US")}× surface pressure`);
