// L16 · the ONE number table (BUILD.md §5 "Allowed readouts", storyboard §5). Every figure a dial, metric, pill, label
// or counter may show is here, with its sources.md row(s) and class: A = a source states it, C = our arithmetic on
// class-A rows (always with the OUR SUM pill, F4). Class-B claims (storyboard §5: "New York to Tokyo", "boil carbon",
// the photosphere thickness, the hundreds-of-times ratio, the other photon-time estimates) are words or unnumbered
// bars and have NO entry here on purpose (F3).
// USAGE
//   readout("probeMph")            → { text: "67,000 mph", pill: "nasa", row: "3", cls: "A", ... } (throws on an unknown key)
//   READ.probeMph                  → the same entry (typed keys)
//   assertAllowed(text, who)       → throws if `text` holds a numeral that no READOUTS entry holds (call it on every
//                                    string with a number that reaches the screen; L16Dials / RadiiRuler / stamps do)
//   assertValue(v, who)            → the same for a bare number (a Counter's end value)
//   isAllowed(text)                → boolean form
//   SUN_R                          → cutaway layer tops as fractions of the radius (rows 17, 19, 20)
//   RADII                          → the radii-above-the-surface marks the ruler and DISTANCE dial use (rows 6, 9, 22)
//   fToC(F)                        → the shown Celsius words for a NASA Fahrenheit figure (row 13 only)
export type PillKind = "our-sum" | "about" | "nasa" | "nasa-says" | "nasa-says-can-reach" | "expected";
export type Readout = {
  /** the exact display string (units in their own case: km/s, km/h, mph, °C, °F, kg, g) */
  text: string;
  /** the number in it, where there is one figure (for Counters); omitted for words or multi-figure strings */
  value?: number;
  unit?: string;
  /** sources.md row(s) */
  row: string;
  cls: "A" | "C";
  /** the pill / tag this figure must carry when it is shown (F2, F4) */
  pill?: PillKind;
  /** a second pill (8-02: ABOUT + OUR SUM) */
  pill2?: PillKind;
  shots: string;
};

const R = <K extends string>(o: Record<K, Readout>) => o;

export const READ = R({
  // cold
  energyRatio: { text: "×55", value: 55, unit: "×", row: "3", cls: "A", pill: "nasa", shots: "C-07" },
  // l01
  earthSpeed: { text: "29.8 km/s", value: 29.8, unit: "km/s", row: "2", cls: "A", pill: "about", shots: "1-03" }, // 29.78 rounded
  probeMph: { text: "67,000 mph", value: 67000, unit: "mph", row: "3", cls: "A", pill: "nasa", shots: "1-04" },
  extraKick: { text: "+12.3 km/s", value: 12.3, unit: "km/s", row: "4", cls: "C", pill: "our-sum", shots: "1-06, 1-07" },
  earthMinus: { text: "−29.8 km/s", value: 29.8, unit: "km/s", row: "4", cls: "C", pill: "our-sum", shots: "1-06, 1-07, 1-13" },
  escape: { text: "42.1 km/s", value: 42.1, unit: "km/s", row: "4", cls: "C", pill: "our-sum", shots: "1-11" },
  dropDays: { text: "ABOUT 65 DAYS", value: 65, row: "5", cls: "C", pill: "our-sum", shots: "1-15" },
  arrival: { text: "616 km/s", value: 616, unit: "km/s", row: "5, 15", cls: "C", pill: "our-sum", shots: "1-16" },
  au: { text: "149.6 million km", value: 149.6, row: "1", cls: "A", shots: "1-17" },
  // l02 (dates only)
  launch: { text: "AUG 2018", row: "3, 6", cls: "A", shots: "2-01" },
  venus1: { text: "OCT 2018", row: "6", cls: "A", shots: "2-06" },
  closestMonth: { text: "DEC 2024", row: "7", cls: "A", shots: "2-06" },
  closestDay: { text: "24 DEC 2024", row: "7", cls: "A", shots: "2-07" },
  beacon: { text: "26 DEC", row: "7", cls: "A", shots: "2-12, 2-13" },
  sep2025: { text: "SEP 2025", row: "8", cls: "A", shots: "8-14, 8-19" },
  flybys: { text: "7", value: 7, row: "6", cls: "A", shots: "2-05" },
  passMiles: { text: "3.8 million miles", value: 3.8, row: "7", cls: "A", shots: "2-07" },
  passKm: { text: "6.16 million km", value: 6.16, row: "6, 22", cls: "A", shots: "2-08" },
  passMph: { text: "430,000 mph", value: 430000, unit: "mph", row: "7", cls: "A", shots: "2-08" },
  passKms: { text: "about 190 km/s", value: 190, unit: "km/s", row: "2, 7, 22", cls: "C", pill: "our-sum", shots: "2-09" },
  sixTimes: { text: "×6", value: 6, unit: "×", row: "2, 7, 22", cls: "C", pill: "our-sum", shots: "2-09" },
  // l03
  about9: { text: "ABOUT 9 RADII ABOVE THE SURFACE", value: 9, row: "6, 22", cls: "A", pill: "about", shots: "3-01, 3-13, 8-05" }, // 8.86
  about9short: { text: "ABOUT 9", value: 9, row: "6, 22", cls: "A", shots: "ruler / DISTANCE dial flag" },
  under5: { text: "under 5 %", value: 5, row: "1, 22", cls: "C", pill: "our-sum", shots: "3-02" },
  e8date: { text: "28 APR 2021", row: "9", cls: "A", shots: "3-05" },
  e8pass: { text: "8TH PASS", value: 8, row: "9", cls: "A", shots: "3-05" },
  alfvenKm: { text: "13 million km", value: 13, row: "9", cls: "A", shots: "3-07" },
  alfvenRadii: { text: "18.8 radii", value: 18.8, row: "9", cls: "A", shots: "3-07" },
  alfvenFlag: { text: "18.8 ALFVÉN", value: 18.8, row: "9", cls: "A", shots: "ruler / DISTANCE dial flag" },
  belowHours: { text: "5 hours", value: 5, row: "9", cls: "A", pill: "about", shots: "3-08" },
  sunRadius: { text: "695,700 km", value: 695700, unit: "km", row: "15", cls: "A", shots: "3-14" },
  earths109: { text: "109 Earths", value: 109, row: "15", cls: "A", shots: "3-15" },
  // l04
  surfaceC: { text: "5,500 °C", value: 5500, unit: "°C", row: "10, 15", cls: "A", pill: "about", shots: "4-02, 5-06, 6-15" },
  coronaC: { text: "2 million °C", value: 2, row: "10", cls: "A", shots: "4-03, 5-12, 6-16" },
  shieldF: { text: "2,500 °F", value: 2500, unit: "°F", row: "13", cls: "A", pill: "nasa-says-can-reach", shots: "4-18" },
  shieldC: { text: "about 1,400 °C", value: 1400, unit: "°C", row: "13", cls: "A", pill: "nasa-says-can-reach", shots: "4-18" },
  shieldBackF: { text: "1,800 °F", value: 1800, unit: "°F", row: "7, 13", cls: "A", pill: "expected", shots: "4-19" },
  shieldBackC: { text: "under 1,000 °C", value: 1000, unit: "°C", row: "7, 13", cls: "A", pill: "expected", shots: "4-19" },
  insideF: { text: "85 °F", value: 85, unit: "°F", row: "13", cls: "A", pill: "nasa-says", shots: "4-20" },
  insideC: { text: "about 30 °C", value: 30, unit: "°C", row: "13", cls: "A", pill: "nasa-says", shots: "4-20" },
  // l05
  thinAir: { text: "ONE TEN-THOUSANDTH OF SEA-LEVEL AIR", row: "12", cls: "A", shots: "5-07" },
  sunMass: { text: "1,400 kg", value: 1400, unit: "kg", row: "15", cls: "A", pill: "about", shots: "5-09" },
  chromo: { text: "2,000 TO 3,000 KM", row: "16", cls: "A", shots: "5-11" },
  // l06
  convDepth: { text: "200,000 km", value: 200000, unit: "km", row: "17", cls: "A", pill: "about", shots: "6-02" },
  convBase: { text: "ABOUT 0.7 OF THE RADIUS", value: 0.7, row: "17, 20", cls: "A", shots: "6-03" },
  convTemp: { text: "BELOW 2 MILLION °C", value: 2, row: "17", cls: "A", pill: "nasa-says", shots: "6-03" },
  model1998: { text: "1998 MODEL", value: 1998, row: "20", cls: "A", shots: "6-08" },
  within1: { text: "WITHIN ABOUT 1 %", value: 1, row: "20", cls: "A", shots: "6-08" },
  quarterOut: { text: "A QUARTER OF THE WAY OUT", row: "18", cls: "A", shots: "6-09" },
  photonYears: { text: "170,000 years", value: 170000, row: "18", cls: "A", pill: "nasa-says", shots: "6-11, 6-14" },
  eightMin: { text: "about 8 min", value: 8, row: "1", cls: "C", pill: "our-sum", shots: "6-13" },
  // l07
  coreC: { text: "15 million °C", value: 15, row: "10, 19", cls: "A", shots: "6-15, 7-05" },
  coreFifth: { text: "ABOUT A FIFTH OF THE RADIUS", row: "19", cls: "A", shots: "7-02" },
  coreKm: { text: "138,000 km", value: 138000, unit: "km", row: "19", cls: "A", pill: "nasa", shots: "7-03" },
  tenEarths: { text: "MORE THAN 10 EARTHS", value: 10, row: "19", cls: "C", pill: "our-sum", shots: "7-04" },
  pressure: { text: "250 billion × sea-level air", value: 250, row: "19", cls: "C", pill: "our-sum", shots: "7-06" },
  coreG: { text: "150 g", value: 150, unit: "g", row: "19", cls: "A", shots: "7-08" },
  gold8: { text: "8× GOLD", value: 8, row: "19", cls: "A", shots: "7-09" },
  lead13: { text: "13× LEAD", value: 13, row: "19", cls: "A", shots: "7-09" },
  borexino: { text: "BOREXINO · 2020", value: 2020, row: "21", cls: "A", shots: "7-13" },
  // l08
  roundR: { text: "700,000 km", value: 700000, unit: "km", row: "15, 22", cls: "C", pill: "about", pill2: "our-sum", shots: "8-02" },
  speedTen: { text: "692,000 km/h", value: 692000, unit: "km/h", row: "3", cls: "A", shots: "8-14 (chip NASA 10 THINGS)" },
  speedSep: { text: "687,000 km/h", value: 687000, unit: "km/h", row: "8", cls: "A", shots: "8-14 (chip NASA SEP 2025)" },
  shieldTenF: { text: "2,500 °F", value: 2500, unit: "°F", row: "3", cls: "A", shots: "8-16 (source chip)" },
  shieldCloseF: { text: "2,600 °F", value: 2600, unit: "°F", row: "7", cls: "A", shots: "8-16 (source chip)" },
});

export type ReadKey = keyof typeof READ;
export const READOUTS: (Readout & { key: ReadKey })[] = (Object.keys(READ) as ReadKey[]).map((key) => ({ key, ...READ[key] }));

/** Source chips for 8-14 / 8-16 and the "NASA" tag (words, no numerals except the dated chip). */
export const SOURCE_CHIPS = { nasa: "NASA", tenThings: "NASA 10 THINGS", sep2025: "NASA SEP 2025" } as const;

/** The readout for a key: the display string and the pill(s) it must carry. Throws on an unknown key. */
export const readout = (key: ReadKey) => {
  const r = READ[key];
  if (!r) throw new Error(`L16 readout: no key "${String(key)}" in sundata.ts`);
  return r;
};

// ---------------------------------------------------------------------------------------------------------------
// the allow-list: numerals parsed from the display strings above
// ---------------------------------------------------------------------------------------------------------------
/** Every numeral in a string, thousands commas removed ("695,700 km" → [695700]; "6.16" → [6.16]; "8TH" → [8]). */
export const numeralsIn = (text: string): number[] =>
  (text.match(/\d+(?:,\d{3})*(?:\.\d+)?/g) ?? []).map((s) => parseFloat(s.replace(/,/g, "")));

const ALLOWED = new Set<number>([
  ...READOUTS.flatMap((r) => [...numeralsIn(r.text), ...(r.value != null ? [r.value] : [])]),
  ...Object.values(SOURCE_CHIPS).flatMap(numeralsIn),
]);

export const isAllowed = (text: string) => numeralsIn(text).every((n) => ALLOWED.has(n));
export const assertAllowed = (text: string, who: string) => {
  const bad = numeralsIn(text).filter((n) => !ALLOWED.has(n));
  if (bad.length) throw new Error(`L16 ${who}: "${text}" shows ${bad.join(", ")}, not in sundata.ts READOUTS (sources.md); add it there with its row and class first`);
  return text;
};
export const assertValue = (v: number, who: string) => {
  if (!ALLOWED.has(v)) throw new Error(`L16 ${who}: ${v} is not a sundata.ts READOUTS value (sources.md)`);
  return v;
};

// ---------------------------------------------------------------------------------------------------------------
// geometry the drawings use (no readout of its own)
// ---------------------------------------------------------------------------------------------------------------
/** Layer tops as fractions of the Sun's radius: core 0.2 (#19 "a fifth"), radiative top 0.7 (#17, #20 0.713 → "about
 *  0.7"), convective top = the photosphere 1.0. The radiative zone starts at the core top (#18 "about 25 %" is drawn at
 *  the core's 0.2-0.25 edge band; no numeral). */
export const SUN_R = { core: 0.2, radiative: 0.7, convective: 1.0 } as const;

/** Radii above the surface used by the ruler and the DISTANCE dial: Parker's closest pass 8.86 (#22, shown ABOUT 9), the
 *  Alfvén crossing 18.8 (#9), 1 AU ≈ 214 radii (#1 / #15, drawing only: never a numeral). */
export const RADII = { pass: 8.86, alfven: 18.8, au: 214 } as const;

/** Shown Celsius words for the row-13 Fahrenheit figures (F2): 2,500 °F → "about 1,400"; 1,800 °F → "under 1,000";
 *  85 °F → "about 30". Any other input throws. */
export const fToC = (F: number) => {
  const m: Record<number, string> = { 2500: "about 1,400", 1800: "under 1,000", 85: "about 30" };
  const s = m[F];
  if (!s) throw new Error(`L16 fToC: ${F} °F is not a row-13 figure`);
  return s;
};
