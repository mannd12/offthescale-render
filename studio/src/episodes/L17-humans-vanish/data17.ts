// L17 · the ONE number table (BUILD.md §5 "Allowed readouts", storyboard §5). Every figure a metric, pill, counter, dial
// or label may show is here, with its sources.md row(s) and class: A = a source states it (or a rounding / unit rendering
// of it), C = our arithmetic on class-A rows (always with the OUR SUM pill, F4). Class-B claims (storyboard §5 and F3:
// the winter ratchet, "a thousand winters", the Roman age, the plastic "hundreds of years" balloon, the dome's name) are
// words or unnumbered drawings and have NO entry here on purpose.
// USAGE
//   readout("lomekwi")        → { text: "3.3 MILLION YEARS", value: 3.3, row: "12", cls: "A", ... } (throws on an unknown key)
//   READ.lomekwi              → the same entry (typed keys)
//   assertAllowed(text, who)  → throws if `text` holds a numeral that no READOUTS entry (or SCALE_LABELS) holds; call it on
//                               every string with a number that reaches the screen (the L17 stamps, pills, dial and
//                               ladder do it for you)
//   assertValue(v, who)       → the same for a bare number (a Counter's end value)
//   isAllowed(text)           → boolean form
//   SCALE_LABELS              → time-scale / calendar labels that are NOT claims (BUILD.md §5: the 10,000- and
//                               100,000-year dial readings of 7-02 and 8-06; the DAY 1..3 calendar tags of 2-06 / 2-08)
export type PillKind = "about" | "our-sum" | "reasoning" | "typical-day" | "nasa-says" | "noaa-says";
export type Readout = {
  /** the exact display string (units in their own case: KM2, FT, T are drawn as written) */
  text: string;
  /** the number in it, where there is one figure (for Counters); omitted for multi-figure strings */
  value?: number;
  unit?: string;
  /** sources.md row(s) */
  row: string;
  cls: "A" | "C";
  /** the pill this figure must carry when it is shown (F4, F13) */
  pill?: PillKind;
  pill2?: PillKind;
  shots: string;
};

const R = <K extends string>(o: Record<K, Readout>) => o;

export const READ = R({
  // cold (row 1: Elhacham et al. 2020, 1.1 teratonnes; F13 the narration says "trillion tonnes")
  massTonnes: { text: "1.1 TRILLION TONNES", value: 1.1, row: "1", cls: "A", pill: "about", shots: "C-05" },
  doubling: { text: "DOUBLING ROUGHLY EVERY 20 YEARS", value: 20, row: "1", cls: "A", shots: "C-06" },
  // l02 (row 3: 14 million gallons on a typical day, range 10-17; shown as MORE THAN 10 MILLION)
  pumpGallons: { text: "MORE THAN 10 MILLION GALLONS", value: 10, row: "3", cls: "A", pill: "typical-day", shots: "2-02" },
  // l03 (row 4)
  iceDensity: { text: "ABOUT 9 % LESS DENSE", value: 9, unit: "%", row: "4", cls: "A", shots: "3-02" },
  tenthRoom: { text: "ABOUT A TENTH MORE ROOM", row: "4", cls: "C", pill: "our-sum", shots: "3-03 (no numeral)" },
  // l04 (row 5: the Eiffel Tower's paint)
  eiffelYears: { text: "136 YEARS", value: 136, row: "5", cls: "A", shots: "4-01" },
  repaints: { text: "REPAINTED 20 TIMES", value: 20, row: "5", cls: "A", shots: "4-02" },
  everySeven: { text: "ABOUT ONCE EVERY 7 YEARS", value: 7, row: "5", cls: "A", shots: "4-03" },
  paintTonnes: { text: "60 T PER REPAINT", value: 60, unit: "T", row: "5", cls: "A", shots: "4-05" },
  paintBucket: { text: "60 T", value: 60, unit: "T", row: "5", cls: "A", shots: "4-05 (the bucket label)" },
  wearTonnes: { text: "ABOUT 15 TONNES", value: 15, row: "5", cls: "A", shots: "4-06" },
  // l06 (row 7: Seymour et al. 2023, Roman concrete)
  romePaper: { text: "2023", value: 2023, row: "7", cls: "A", shots: "6-02" },
  // l07 (row 8: Mount Rushmore granite)
  graniteRate: { text: "1 INCH / 10,000 YEARS", row: "8", cls: "A", shots: "7-02" },
  inchesSum: { text: "100 INCHES, ABOUT 8 FT", row: "8", cls: "C", pill: "our-sum", shots: "7-04, 7-05" },
  inches100: { text: "100", value: 100, row: "8", cls: "C", pill: "our-sum", shots: "7-04 (the counter)" },
  // l08 (row 10: Onkalo bedrock, about 1,800 million years)
  bedrockAge: { text: "1.8 BILLION YEARS OLD", value: 1.8, row: "10", cls: "A", shots: "8-01" },
  // l09 (row 12: Lomekwi 3; row 18: our ratio)
  lomekwi: { text: "3.3 MILLION YEARS", value: 3.3, row: "12", cls: "A", shots: "9-04, 10-03, Z-07" },
  threeTimes: { text: "MORE THAN 3 TIMES", value: 3, row: "12, 18", cls: "C", pill: "our-sum", shots: "9-05" },
  oldowanGap: { text: "700,000 YEARS", value: 700000, row: "12", cls: "A", shots: "9-06" },
  lomekwiSign: { text: "LOMEKWI 3, KENYA", value: 3, row: "12", cls: "A", shots: "9-04 (the site sign)" },
  // l10 (row 16: Chernobyl; row 15: the Anthropocene vote)
  zonePeople: { text: "116,000 PEOPLE LEFT", value: 116000, row: "16", cls: "A", shots: "10-05" },
  zoneArea: { text: "4,200 KM2", value: 4200, unit: "KM2", row: "16", cls: "A", shots: "10-06" },
  wolves: { text: "MORE THAN 7 TIMES", value: 7, row: "16", cls: "A", shots: "10-08" },
  vote: { text: "2024", value: 2024, row: "15", cls: "A", shots: "10-26" },
});

export type ReadKey = keyof typeof READ;
export const READOUTS: (Readout & { key: ReadKey })[] = (Object.keys(READ) as ReadKey[]).map((key) => ({ key, ...READ[key] }));

/** Time-scale and calendar labels: NOT claims (BUILD.md §5). The dial may read 10,000 YEARS (7-02) and 100,000 YEARS
 *  (8-06); the pit gauge and calendar flip DAY 1, DAY 2, DAY 3 (2-06, 2-08). Nothing else goes here. */
export const SCALE_LABELS = ["10,000 YEARS", "100,000 YEARS", "DAY 1", "DAY 2", "DAY 3"] as const;

/** The readout for a key: the display string and the pill(s) it must carry. Throws on an unknown key. */
export const readout = (key: ReadKey) => {
  const r = READ[key];
  if (!r) throw new Error(`L17 readout: no key "${String(key)}" in data17.ts`);
  return r;
};

// ---------------------------------------------------------------------------------------------------------------
// the allow-list: numerals parsed from the display strings above
// ---------------------------------------------------------------------------------------------------------------
/** Every numeral in a string, thousands commas removed ("116,000" → [116000]; "1.1" → [1.1]; "KM2" → [2]). */
export const numeralsIn = (text: string): number[] =>
  (text.match(/\d+(?:,\d{3})*(?:\.\d+)?/g) ?? []).map((s) => parseFloat(s.replace(/,/g, "")));

const ALLOWED = new Set<number>([
  ...READOUTS.flatMap((r) => [...numeralsIn(r.text), ...(r.value != null ? [r.value] : [])]),
  ...SCALE_LABELS.flatMap(numeralsIn),
]);

export const isAllowed = (text: string) => numeralsIn(text).every((n) => ALLOWED.has(n));
export const assertAllowed = (text: string, who: string) => {
  const bad = numeralsIn(text).filter((n) => !ALLOWED.has(n));
  if (bad.length) throw new Error(`L17 ${who}: "${text}" shows ${bad.join(", ")}, not in data17.ts READOUTS (sources.md); add it there with its row and class first`);
  return text;
};
export const assertValue = (v: number, who: string) => {
  if (!ALLOWED.has(v)) throw new Error(`L17 ${who}: ${v} is not a data17.ts READOUTS value (sources.md)`);
  return v;
};
