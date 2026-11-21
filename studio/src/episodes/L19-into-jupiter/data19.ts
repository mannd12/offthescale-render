// L19 · the ONE number table (BUILD.md §5 "Allowed readouts", storyboard §5 READOUTS list). Every figure a metric, pill,
// counter, dial readout, bar or label may show is here, with its sources.md row(s) and class: A = a source states it (or a
// rounding / unit rendering of it), C = our arithmetic on class-A rows (ALWAYS with the OUR SUM pill, F4). Class-B claims
// (F3: ONE THIN DECK, ABOUT HALF, HOTTER THAN PREDICTED, the skin, NO FLOOR, NO EDGE, NOT MEASURED, the fuzzy-core dots, the
// PREDICTED / MEASURED bars, WIND? WATER? CORE?) are words or unnumbered drawings and have NO entry here on purpose.
// The Q9 reference-site figures (22 ATM, 153 C) are NOT here: line 51 was softened (2026-11-19) and 8-19 draws no numerals.
// USAGE
//   readout("km156")          → { text: "156 KM", value: 156, row: "4", cls: "A", ... } (throws on an unknown key)
//   READ.km156                → the same entry (typed keys)
//   assertAllowed(text, who)  → throws if `text` holds a numeral that no READOUTS entry (or SCALE_LABELS) holds; call it on
//                               every string with a number that reaches the screen (BarDial, TapeTicket, WordPill, ErrorBar
//                               and the Ledger do it for you)
//   assertValue(v, who)       → the same for a bare number (a Counter's END value, a needle stop; motion in between is fine)
//   isAllowed(text)           → boolean form
//   NEEDLE_STOPS              → the only values a BarDial needle may rest on (F6): 4, 21, 23 and the 0.7 / 30 arc ends
//   SCALE_LABELS              → the dial's numerals 1 · 4 · 10 · 21 · 30, the zero of a needle or timer: NOT claims
// Units (F13): KM, KM/H, KM/S, M/S, MPH, F, C, ATM, BAR are written here as they must read; draw them as explicit readouts
// (Counter + a separate unit span) because kit Metric/Pill pass text through labelCase.
export type PillKind = "about" | "our-sum" | "nasa-says" | "nasa-said" | "juno-says";
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
  // cold (rows 2, 3, 4, 8, 9)
  mass300: { text: "MORE THAN 300 TIMES EARTH'S MASS", value: 300, row: "8", cls: "A", shots: "C-04 (317.83)" },
  min58: { text: "58 MINUTES", value: 58, unit: "MIN", row: "2, 3", cls: "A", shots: "C-02, C-03 tape timer 58:00, Z-01, thumb-a" },
  km156: { text: "156 KM", value: 156, unit: "KM", row: "4", cls: "A", shots: "C-07, C-08, 2-02, 7-09, 8-02, Z-01" },
  km71k: { text: "MORE THAN 71,000 KM", value: 71000, unit: "KM", row: "8", cls: "A", shots: "C-08, 7-09 (71,492; to scale)" },
  pct025: { text: "LESS THAN 0.25 %", value: 0.25, row: "9", cls: "C", pill: "our-sum", shots: "C-09 (0.218 %)" },
  // l01 (rows 1-4)
  date1995: { text: "7 DEC 1995", row: "1", cls: "A", shots: "1-01" },
  kmps476: { text: "47.6 KM/S", value: 47.6, unit: "KM/S", row: "1", cls: "A", shots: "1-02 (key art)" },
  kmh170k: { text: "ABOUT 170,000 KM/H", value: 170000, unit: "KM/H", row: "3", cls: "A", pill: "about", shots: "1-03" },
  g200: { text: "MORE THAN 200 TIMES GRAVITY", value: 200, row: "2", cls: "A", shots: "1-04" },
  min2: { text: "ABOUT 2 MIN", value: 2, unit: "MIN", row: "3", cls: "A", pill: "about", shots: "1-05" },
  inst6: { text: "6 INSTRUMENTS", value: 6, row: "4", cls: "A", shots: "1-10, 8-18" },
  // l02 (rows 4, 10, 16)
  km71: { text: "ABOUT 71 KM", value: 71, unit: "KM", row: "10", cls: "A", pill: "nasa-says", shots: "2-01, 2-02 (NOT THE SAME LEVEL)" },
  // l03 (rows 5, 10, 14, 15, 16)
  wind80_100: { text: "80 TO 100 M/S", row: "5", cls: "A", shots: "3-01" },
  wind170: { text: "170 M/S", value: 170, unit: "M/S", row: "5", cls: "A", shots: "3-03, 3-06, 8-07" },
  bar4: { text: "4 BAR", value: 4, unit: "BAR", row: "5", cls: "A", shots: "3-03 (needle stop)" },
  bar21: { text: "DOWN TO 21 BAR", value: 21, unit: "BAR", row: "5", cls: "A", shots: "3-06 (needle stop, tag)" },
  kmh610: { text: "ABOUT 610 KM/H", value: 610, unit: "KM/H", row: "15", cls: "C", pill: "our-sum", shots: "3-04 (612)" },
  jet3000: { text: "3,000 KM", value: 3000, unit: "KM", row: "14", cls: "A", pill: "juno-says", shots: "3-10, Z-02" },
  times20: { text: "ABOUT 20 TIMES DEEPER", value: 20, row: "16", cls: "C", pill: "our-sum", shots: "3-11 (19.2)" },
  massPct1: { text: "ABOUT 1 % OF THE MASS", value: 1, row: "14", cls: "A", shots: "3-12" },
  grs500: { text: "ABOUT 500 KM", value: 500, unit: "KM", row: "10", cls: "A", pill: "nasa-says", shots: "3-14 (NASA's wording, no Juno attribution)" },
  // l04 (rows 6, 7)
  dry1: { text: "UNDER 1 %", value: 1, row: "6", cls: "A", shots: "4-07" },
  water27: { text: "2.7 TIMES", value: 2.7, row: "7", cls: "A", shots: "4-10, 4-11" },
  whiskers: { text: "+2.4 / -1.7", row: "7", cls: "A", shots: "4-11 (error bars, 1 sigma)" },
  bar07: { text: "0.7 BAR", value: 0.7, unit: "BAR", row: "7", cls: "A", shots: "4-14 (Juno's arc start)" },
  bar30: { text: "30 BAR", value: 30, unit: "BAR", row: "7", cls: "A", shots: "4-14 (Juno's arc end)" },
  // l05 (rows 2, 3, 15)
  atm23: { text: "23 ATMOSPHERES", value: 23, unit: "ATM", row: "2, 3", cls: "A", shots: "5-01 (D1: never 23 BAR)" },
  f300: { text: "TOPPED 300 F", value: 300, unit: "F", row: "2", cls: "A", shots: "5-02" },
  c150: { text: "ABOUT 150 C", value: 150, unit: "C", row: "15", cls: "C", pill: "our-sum", shots: "5-03 (149)" },
  // l06-l07 (rows 8, 12, 13)
  rho13: { text: "ABOUT 1.3 TIMES WATER", value: 1.3, row: "8", cls: "A", pill: "about", shots: "6-02 (1,326 kg/m3)" },
  r63: { text: "63 % OF THE RADIUS", value: 63, row: "12", cls: "A", shots: "7-05" },
  m18: { text: "ABOUT 18 % OF THE MASS", value: 18, row: "12", cls: "A", shots: "7-06" },
  km26k: { text: "MORE THAN 26,000 KM", value: 26000, unit: "KM", row: "13", cls: "C", pill: "our-sum", shots: "7-09 (26,452; a model value)" },
  times170: { text: "ABOUT 170 TIMES", value: 170, row: "13", cls: "C", pill: "our-sum", shots: "7-10 (170)" },
  // l08 (rows 2-5, 8)
  mph330: { text: "330 MPH", value: 330, unit: "MPH", row: "4", cls: "A", shots: "8-06, 8-07 (D2: to scale against 170 M/S)" },
  year1996: { text: "JAN 1996", value: 1996, row: "4", cls: "A", shots: "8-06" },
  year1997: { text: "1997", value: 1997, row: "5", cls: "A", shots: "4-03 (NASA SAYS 1997), 8-07" },
  earths1300: { text: "MORE THAN 1,300 EARTHS", value: 1300, row: "8", cls: "A", shots: "8-11 (1,321 by volume; to scale)" },
  km200: { text: "ABOUT 200 KM", value: 200, unit: "KM", row: "3", cls: "A", pill: "about", shots: "8-17" },
  atm23b: { text: "23 ATM, OVER 300 F", row: "2", cls: "A", pill: "nasa-says", shots: "8-20" },
});

export type ReadKey = keyof typeof READ;
export const READOUTS: (Readout & { key: ReadKey })[] = (Object.keys(READ) as ReadKey[]).map((key) => ({ key, ...READ[key] }));

/** Scale marks, NOT claims (BUILD.md §5): the BarDial numerals 1 · 4 · 10 · 21 · 30 and the zero of a needle or of the
 *  tape timer's seconds ("58:00"). Nothing else goes here. */
export const SCALE_LABELS = ["0", "1", "4", "10", "21", "30"] as const;

/** F6: the only values a BarDial needle may rest on (motion between them is not a claim). 23 is the ATMOSPHERES reading
 *  parked on the dial's 23 mark (D1). */
export const NEEDLE_STOPS = [0, 4, 21, 23, 0.7, 30] as const;

/** The readout for a key: the display string and the pill it must carry. Throws on an unknown key. */
export const readout = (key: ReadKey) => {
  const r = READ[key];
  if (!r) throw new Error(`L19 readout: no key "${String(key)}" in data19.ts`);
  return r;
};

// ---------------------------------------------------------------------------------------------------------------
// the allow-list: numerals parsed from the display strings above
// ---------------------------------------------------------------------------------------------------------------
/** Every numeral in a string, thousands commas removed ("71,000" → [71000]; "+2.4 / -1.7" → [2.4, 1.7]; "58:00" → [58, 0]). */
export const numeralsIn = (text: string): number[] => (text.match(/\d+(?:,\d{3})*(?:\.\d+)?/g) ?? []).map((s) => parseFloat(s.replace(/,/g, "")));

const ALLOWED = new Set<number>([...READOUTS.flatMap((r) => [...numeralsIn(r.text), ...(r.value != null ? [r.value] : [])]), ...SCALE_LABELS.flatMap(numeralsIn)]);

export const isAllowed = (text: string) => numeralsIn(text).every((n) => ALLOWED.has(n));
export const assertAllowed = (text: string, who: string) => {
  const bad = numeralsIn(text).filter((n) => !ALLOWED.has(n));
  if (bad.length) throw new Error(`L19 ${who}: "${text}" shows ${bad.join(", ")}, not in data19.ts READOUTS (sources.md); add it there with its row and class first`);
  return text;
};
export const assertValue = (v: number, who: string) => {
  if (!ALLOWED.has(v)) throw new Error(`L19 ${who}: ${v} is not a data19.ts READOUTS value (sources.md)`);
  return v;
};
