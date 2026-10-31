// The eleven rungs of L08 and the logarithmic thermometer's scale. Every number: episodes/L08-temperature-levels/sources.md
import { Level } from "../../brand/tokens";

export const SERIES = "EVERY LEVEL OF TEMPERATURE";

/** log10 of kelvin for a Celsius reading */
export const lc = (celsius: number) => Math.log10(celsius + 273.15);
/** log10 of kelvin */
export const lk = (kelvin: number) => Math.log10(kelvin);

// The readings the gauge may show (row numbers from sources.md). 4 trillion is the top of the tube: nothing above it, ever (#56, #59).
export const T = {
  coldest: lk(38e-12), // #9
  boomerang: lk(1), // #21
  lhc: lk(1.9), // #16
  space: lk(2.7), // #16, #20
  hermite: lc(-248), // #24
  pluto: lc(-232), // #25
  vostok: lc(-89.2), // #27
  satellite: lc(-93.2), // #28
  you: lc(15), // #6
  mercuryDay: lc(430), // #33
  mercuryNight: lc(-180), // #33
  venus: lc(465), // #30
  lava: lc(1170), // #35
  sunFace: lc(5500), // #39
  lightning: lc(28000), // #43
  corona: lc(2e6), // #47
  sunCore: lc(15e6), // #48
  kstar: lc(100e6), // #51
  lhcFloor: lc(100000 * 15e6), // #58 x #48: "more than" - a floor, our arithmetic
  top: lc(4e12), // #56
};

/** the tube runs from just under 38 pK to exactly 4 trillion °C: 23.2 marks */
export const LOG_MIN = -10.6;
export const LOG_MAX = T.top;
export const pos = (log: number) => (Math.min(LOG_MAX, Math.max(LOG_MIN, log)) - LOG_MIN) / (LOG_MAX - LOG_MIN);

export const LEVELS: (Level & { log: number })[] = [
  { id: "l01", name: "The coldest ever made", reading: "38 pK", image: null, glyph: "38 pK", log: T.coldest },
  { id: "l02", name: "Colder than space", reading: "1.9 K", image: "l08-cmb", log: T.lhc },
  { id: "l03", name: "The Moon's dark craters", reading: "−248 °C", image: "l08-hermite", log: T.hermite },
  { id: "l04", name: "Earth's coldest", reading: "−89.2 °C", image: "l08-antarctica", log: T.vostok },
  { id: "l05", name: "Venus", reading: "≈ 465 °C", image: "l08-venus-uv", log: T.venus },
  { id: "l06", name: "Lava", reading: "≈ 1,170 °C", image: "l08-fountain", log: T.lava },
  { id: "l07", name: "The Sun's face", reading: "≈ 5,500 °C", image: "l08-sun-white", log: T.sunFace },
  { id: "l08", name: "Lightning", reading: "≈ 28,000 °C", image: "l08-lightning-a", log: T.lightning },
  { id: "l09", name: "Corona and core", reading: "15 million °C", image: "l08-eclipse-art", log: T.sunCore },
  { id: "l10", name: "Fusion machines", reading: "100 million °C", image: null, glyph: "48 s", log: T.kstar },
  { id: "l11", name: "Hottest ever made", reading: "4 trillion °C", image: null, log: T.top },
];

/** the last tile stays a mystery until its own rung names it */
export const LEVELS_REVEALED = [...LEVELS.slice(0, 10), { ...LEVELS[10], image: "l08-gold" }];
