// The ten rungs of L05. Every number traces to episodes/L05-sky-levels/sources.md (row in the comment).
import { Level } from "../../brand/tokens";

export const SERIES = "EVERY LEVEL OF THE SKY";

export const LEVELS: Level[] = [
  { id: "l01", name: "The ground", reading: "0 km", image: "l05-balloon-topeka" },
  { id: "l02", name: "Everest", reading: "8.85 km", image: "l05-everest-iss" }, // #6
  { id: "l03", name: "Airliners and the vulture", reading: "11 km", image: "l05-dc8" }, // #7, #9
  { id: "l04", name: "Spy planes", reading: "25.9 km", image: "l05-sr71b" }, // #12
  { id: "l05", name: "Balloons", reading: "53.7 km", image: "l05-balloon-ice" }, // #21
  { id: "l06", name: "Meteors and night clouds", reading: "86 km", image: "l05-meteor" }, // #25
  { id: "l07", name: "Where space begins", reading: "100 km", image: "l05-x15" }, // #26-28
  { id: "l08", name: "The Space Station", reading: "415 km", image: "l05-iss" }, // #30
  { id: "l09", name: "GPS and geostationary", reading: "35,786 km", image: "l05-goes" }, // #38, #41
  { id: "l10", name: "The Moon", reading: "384,400 km", image: null }, // #42: the mystery tile until its rung
];

/** Once rung 10 is named, its tile is the Orion frame. */
export const LEVELS_REVEALED: Level[] = [...LEVELS.slice(0, 9), { ...LEVELS[9], image: "l05-orion" }];
/** The closer sits on the last tile under its own name. */
export const LEVELS_LAST: Level[] = [...LEVELS.slice(0, 9), { ...LEVELS[9], name: "The last edge", reading: "630,000 km", image: "l05-orion" }];

/** A height the gauge has already named; drawn as a tick once the rung it belongs to is under way. */
export type Mark = { km: number; label: string };

/** Marks from finished rungs, carried up the gauge as it climbs. Index = the rung (0-based) that named it. */
export const MARKS_BY_RUNG: Mark[][] = [
  [{ km: 5.6, label: "half the air" }], // #4
  [{ km: 8.85, label: "Everest" }], // #6
  [{ km: 11.3, label: "vulture" }], // #9
  [{ km: 21, label: "ER-2" }, { km: 25.9, label: "SR-71" }], // #14, #12
  [{ km: 35, label: "weather balloon" }, { km: 53.7, label: "balloon record" }], // #16, #21
  [{ km: 86, label: "night clouds" }], // #25
  [{ km: 80, label: "50 miles" }, { km: 100, label: "100 km line" }], // #26, #27
  [{ km: 415, label: "Space Station" }], // #30
  [{ km: 20200, label: "GPS" }, { km: 35786, label: "geostationary" }], // #38, #41
  [{ km: 384400, label: "Moon" }, { km: 406770, label: "Artemis II" }], // #42, #44
];

export const fmtKm = (km: number) => (km >= 1000 ? Math.round(km).toLocaleString("en-US") : String(km));
