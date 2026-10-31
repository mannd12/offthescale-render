// The rungs of L06. Magnitudes and TNT readings: episodes/L06-earthquake-levels/sources.md, gauge table in section F
// (log10 E = 1.5 M + 4.8, 1 t TNT = 4.184e9 J). Always shown as "about" (#67). Never mix with the HVO figures (#64, #66).
import { Level } from "../../brand/tokens";

export const SERIES = "EVERY EARTHQUAKE MAGNITUDE";

export const LEVELS: (Level & { m: number })[] = [
  { id: "l01", name: "Magnitude 1", reading: "M1", image: "l06-milne", m: 1 },
  { id: "l02", name: "Magnitude 2", reading: "M2", image: "l06-jet", m: 2 },
  { id: "l03", name: "Magnitude 3", reading: "M3", image: null, glyph: "M3", m: 3 },
  { id: "l04", name: "Magnitude 4", reading: "M4", image: "l06-norris", m: 4 },
  { id: "l05", name: "Magnitude 5", reading: "M5", image: "l06-msh", m: 5 },
  { id: "l06", name: "Magnitude 6", reading: "M6", image: "l06-northridge", m: 6 },
  { id: "l07", name: "Magnitude 7", reading: "M7", image: "l06-pipeline", m: 7 },
  { id: "l08", name: "Magnitude 8", reading: "M8", image: "l06-concepcion", m: 8 },
  { id: "l09", name: "Magnitude 9", reading: "M9", image: "l06-rail", m: 9 },
  { id: "l10", name: "Magnitude 9.5", reading: "M9.5", image: "l06-shakemap", m: 9.5 },
  { id: "s11", name: "The limit", reading: "M10?", image: null, glyph: "?", m: 10 },
];

/** the TNT reading at each row of the section F table */
export const TNT: Record<string, string> = {
  "1": "½ kg TNT", "2": "15 kg TNT", "3": "480 kg TNT", "4": "15 t TNT", "5": "480 t TNT", "6": "15 kt TNT", "7": "480 kt TNT", "8": "15 Mt TNT", "9": "480 Mt TNT", "9.5": "2.7 Gt TNT",
};
