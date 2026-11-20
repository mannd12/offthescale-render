// L18 · the ONE number table (BUILD.md §5 "Allowed readouts", storyboard §5 READOUTS list). Every figure a metric, pill,
// counter, rail mark, bar or label may show is here, with its sources.md row(s) and class: A = a source states it (or a
// rounding / unit rendering of it), C = our arithmetic on class-A rows (ALWAYS with the OUR SUM pill, F4). Class-B claims
// (storyboard §5 and F3: NEARLY HALF, MINUTES, STILL SMALL, the crater map, the ring's size and lifetime, the blank tide
// ruler) are words or unnumbered drawings and have NO entry here on purpose.
// USAGE
//   readout("moonKm")         → { text: "384,400 KM", value: 384400, row: "1", cls: "A", ... } (throws on an unknown key)
//   READ.moonKm               → the same entry (typed keys)
//   assertAllowed(text, who)  → throws if `text` holds a numeral that no READOUTS entry (or SCALE_LABELS) holds; call it on
//                               every string with a number that reaches the screen (DistGauge, PullBar, WordPill, FlipTag and
//                               Sheet18 titles do it for you)
//   assertValue(v, who)       → the same for a bare number (a Counter's END value; intermediate rolling values are fine)
//   isAllowed(text)           → boolean form
//   SCALE_LABELS              → rail decade numerals, bar starts and the sky bowl's degree scale: NOT claims (BUILD.md §5:
//                               "Bar starts (1) and the × signs are scale marks"; the rail's 1,000 / 10,000 / 100,000
//                               decade ticks; 0° · 90° · 180° on the arc of 1-01)
// Units (F13): KM, CM, M/S2 and M3 are written here as they must read; draw them as explicit readouts (Counter + a separate
// unit span) because kit Metric/Pill pass text through labelCase.
export type PillKind = "about" | "our-sum" | "reasoning" | "nasa-says" | "noaa-says" | "textbook-says";
export type Readout = {
  /** the exact display string */
  text: string;
  /** the number in it, where there is one figure (for Counters); omitted for multi-figure strings */
  value?: number;
  unit?: string;
  /** sources.md row(s) */
  row: string;
  cls: "A" | "C";
  /** the pill this figure must carry when it is shown (F4, F13) */
  pill?: PillKind;
  shots: string;
};

const R = <K extends string>(o: Record<K, Readout>) => o;

export const READ = R({
  // cold
  stationKm: { text: "ABOUT 400 KM", value: 400, unit: "KM", row: "3, 8", cls: "A", pill: "about", shots: "C-02, 5-01; the STATION mark" },
  surface400: { text: "SURFACE 400 KM UP", value: 400, unit: "KM", row: "3, 8", cls: "A", shots: "C-05 (premise)" },
  moonKm: { text: "384,400 KM", value: 384400, unit: "KM", row: "1", cls: "A", shots: "C-03, 3-12, 7-02, Z-11; the TODAY mark" },
  closerTimes: { text: "MORE THAN 900 TIMES CLOSER", value: 900, row: "8, 20", cls: "C", pill: "our-sum", shots: "C-04 (936)" },
  centerKm: { text: "ABOUT 8,500 KM", value: 8500, unit: "KM", row: "8", cls: "C", pill: "our-sum", shots: "C-06, 5-08, 5-09 (8,516)" },
  // l01 (row 12: apparent size)
  halfDeg: { text: "ABOUT HALF A DEGREE", value: 0.5, row: "12", cls: "C", pill: "our-sum", shots: "1-01 (0.518; words on screen)" },
  deg78: { text: "78 DEGREES", value: 78, row: "12", cls: "C", pill: "our-sum", shots: "1-03, Z-08, thumb-b (78.2)" },
  sky180: { text: "180 DEGREES", value: 180, row: "12", cls: "A", shots: "1-04 (geometry)" },
  times150: { text: "150 TIMES WIDER", value: 150, row: "12", cls: "C", pill: "our-sum", shots: "1-06 (151)" },
  // l02 (rows 1, 3, 9, 13, 23)
  days27: { text: "ABOUT 27 DAYS", value: 27, row: "1", cls: "A", shots: "2-01 (27.32)" },
  lap2h10: { text: "ABOUT 2 H 10 MIN", row: "9", cls: "C", pill: "our-sum", shots: "2-02 (130.4 min)" },
  station90: { text: "ABOUT 90 MIN", value: 90, unit: "MIN", row: "3", cls: "A", shots: "2-03, 8-04" },
  speed7: { text: "NEARLY 7 KM/S", value: 7, unit: "KM/S", row: "9", cls: "C", pill: "our-sum", shots: "2-04 (6.84)" },
  speed1: { text: "TODAY: ABOUT 1 KM/S", value: 1, unit: "KM/S", row: "1", cls: "A", shots: "2-04b (1.022)" },
  laps11: { text: "ABOUT 11 LAPS A DAY", value: 11, row: "9", cls: "C", pill: "our-sum", shots: "2-05 (11.0)" },
  laps16: { text: "STATION: 16 LAPS", value: 16, row: "3", cls: "A", shots: "2-06" },
  earth24: { text: "ABOUT 24 HOURS", value: 24, row: "13", cls: "A", shots: "2-07, 3-03" },
  phobos739: { text: "7 H 39 MIN", row: "23", cls: "A", shots: "2-09 (the Phobos analogy of the 2026-11-19 line 9; optional)" },
  // l03 (rows 10, 13, 19, 22)
  geoKm: { text: "42,164 KM FROM THE CENTER", value: 42164, unit: "KM", row: "13", cls: "A", shots: "3-02, 7-03, Z-11; the GEOSTATIONARY mark" },
  div9: { text: "DISTANCE ÷ 9", value: 9, row: "10", cls: "C", pill: "our-sum", shots: "3-06 (9.1)" },
  pull760: { text: "ABOUT 760 TIMES", value: 760, row: "10", cls: "C", pill: "our-sum", shots: "3-07, 7-03 (758)" },
  moonDiam: { text: "3,476 KM ACROSS", value: 3476, unit: "KM", row: "19", cls: "C", pill: "our-sum", shots: "3-09, 6-03 (2 x 1,738.1)" },
  todayPct: { text: "LESS THAN 2 %", value: 2, unit: "%", row: "22", cls: "C", pill: "our-sum", shots: "3-12 (1.8 %)" },
  // l04 (rows 1, 2, 7, 10)
  rhoEarth: { text: "ABOUT 5,500 KG PER M3", value: 5500, unit: "KG PER M3", row: "1, 2", cls: "A", shots: "4-06 (5,514)" },
  rhoMoon: { text: "ABOUT 3,300 KG PER M3", value: 3300, unit: "KG PER M3", row: "1", cls: "A", shots: "4-07 (3,344)" },
  stiffKm: { text: "ABOUT 9,500 KM", value: 9500, unit: "KM", row: "7", cls: "C", pill: "our-sum", shots: "4-11, 7-06, Z-04, Z-11 (9,494); the STIFF LINE mark" },
  fluidKm: { text: "ABOUT 18,400 KM", value: 18400, unit: "KM", row: "7", cls: "C", pill: "our-sum", shots: "4-12, 7-04, Z-04, Z-11 (18,386); the FLUID LINE mark" },
  times21: { text: "ABOUT 21 TIMES", value: 21, row: "7", cls: "C", pill: "our-sum", shots: "4-14 (20.9)" },
  pull9000: { text: "ABOUT 9,000 TIMES", value: 9000, row: "10", cls: "C", pill: "our-sum", shots: "4-16, 7-05 (9,146)" },
  // l05 (rows 1, 11, 21)
  near6800: { text: "ABOUT 6,800 KM", value: 6800, unit: "KM", row: "21", cls: "C", pill: "our-sum", shots: "5-02 (6,778)" },
  far10000: { text: "ABOUT 10,000 KM", value: 10000, unit: "KM", row: "21", cls: "C", pill: "our-sum", shots: "5-03 (10,254)" },
  twice: { text: "MORE THAN 2 TIMES", value: 2, row: "21", cls: "C", pill: "our-sum", shots: "5-05, 5-05b (2.29)" },
  g16: { text: "ABOUT 1.6 M/S2", value: 1.6, unit: "M/S2", row: "1", cls: "A", shots: "5-07 (1.62)" },
  stretch22: { text: "ABOUT 2.2 M/S2", value: 2.2, unit: "M/S2", row: "11", cls: "C", pill: "our-sum", shots: "5-10 (2.24)" },
  times14: { text: "ABOUT 1.4 TIMES TOO MUCH", value: 1.4, row: "11", cls: "C", pill: "our-sum", shots: "5-12 (1.38)" },
  // l06 (row 16: Shoemaker-Levy 9)
  sl9Year1: { text: "1992", value: 1992, row: "16", cls: "A", shots: "6-05" },
  sl9Year2: { text: "FOUND 1993", value: 1993, row: "16", cls: "A", shots: "6-06" },
  sl9Pieces: { text: "MORE THAN 20 PIECES", value: 20, row: "16", cls: "A", shots: "6-07" },
  // l07 (row 10)
  pull66k: { text: "ABOUT 66,000 TIMES", value: 66000, row: "10", cls: "C", pill: "our-sum", shots: "7-06 (66,417)" },
  pull92k: { text: "ABOUT 92,000 TIMES", value: 92000, row: "10", cls: "C", pill: "our-sum", shots: "7-07 (91,960)" },
  // l08 (rows 3, 4, 17)
  cm3: { text: "ABOUT 3 CM", value: 3, unit: "CM", row: "4", cls: "A", shots: "8-02 (ranging accuracy)" },
  miles250: { text: "ABOUT 250 MILES", value: 250, unit: "MILES", row: "3", cls: "A", shots: "8-04" },
  recede38: { text: "3.8 CM A YEAR", value: 3.8, unit: "CM", row: "4", cls: "A", shots: "8-12 to 8-14, Z-03" },
  ago45: { text: "ABOUT 4.5 BILLION YEARS AGO", value: 4.5, row: "17", cls: "A", shots: "8-15 to 8-17" },
});

export type ReadKey = keyof typeof READ;
export const READOUTS: (Readout & { key: ReadKey })[] = (Object.keys(READ) as ReadKey[]).map((key) => ({ key, ...READ[key] }));

/** Scale marks, NOT claims (BUILD.md §5): the rail's decade ticks, the bars' start value and the sky bowl's 0 · 90 · 180
 *  degree numerals (1-01). Nothing else goes here. */
export const SCALE_LABELS = ["0", "1", "90", "1,000", "10,000", "100,000"] as const;

/** The readout for a key: the display string and the pill it must carry. Throws on an unknown key. */
export const readout = (key: ReadKey) => {
  const r = READ[key];
  if (!r) throw new Error(`L18 readout: no key "${String(key)}" in data18.ts`);
  return r;
};

// ---------------------------------------------------------------------------------------------------------------
// the allow-list: numerals parsed from the display strings above
// ---------------------------------------------------------------------------------------------------------------
/** Every numeral in a string, thousands commas removed ("384,400" → [384400]; "1.6 M/S2" → [1.6, 2]; "M3" → [3]). */
export const numeralsIn = (text: string): number[] => (text.match(/\d+(?:,\d{3})*(?:\.\d+)?/g) ?? []).map((s) => parseFloat(s.replace(/,/g, "")));

const ALLOWED = new Set<number>([...READOUTS.flatMap((r) => [...numeralsIn(r.text), ...(r.value != null ? [r.value] : [])]), ...SCALE_LABELS.flatMap(numeralsIn)]);

export const isAllowed = (text: string) => numeralsIn(text).every((n) => ALLOWED.has(n));
export const assertAllowed = (text: string, who: string) => {
  const bad = numeralsIn(text).filter((n) => !ALLOWED.has(n));
  if (bad.length) throw new Error(`L18 ${who}: "${text}" shows ${bad.join(", ")}, not in data18.ts READOUTS (sources.md); add it there with its row and class first`);
  return text;
};
export const assertValue = (v: number, who: string) => {
  if (!ALLOWED.has(v)) throw new Error(`L18 ${who}: ${v} is not a data18.ts READOUTS value (sources.md)`);
  return v;
};
