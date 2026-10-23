// Caption text rules (2026-09-30, docs/research-deep-2026-09/08-production-audio-visual.md, Netflix timed-text
// guide): at most 2 lines of 42 characters per cue, and numbers above ten written as numerals. Captions only -
// the narration and the on-screen text are untouched, so no fact changes: "six thousand nine hundred and
// fifty-seven metres" is shown as "6957 metres", "nineteen ninety-seven" as "1997".

const UNITS = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19 };
const TENS = { twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
const SCALES = { thousand: 1e3, million: 1e6, billion: 1e9 };

const small = (w) => {
  // 0-99 from one word: "seven", "forty", "twenty-eight"
  if (w in UNITS) return UNITS[w];
  if (w in TENS) return TENS[w];
  const m = w.match(/^([a-z]+)-([a-z]+)$/);
  if (m && m[1] in TENS && m[2] in UNITS && UNITS[m[2]] > 0 && UNITS[m[2]] < 10) return TENS[m[1]] + UNITS[m[2]];
  return null;
};
const bare = (tok) => tok.toLowerCase().replace(/[^a-z-]/g, "");
const trail = (tok) => tok.match(/[^A-Za-z-]*$/)[0];
const isNumWord = (tok) => {
  const w = bare(tok);
  return small(w) !== null || w === "hundred" || w in SCALES;
};

// Parse the longest number phrase starting at words[i]. Returns { value, end, year, decimal, text } or null.
const parseAt = (words, i) => {
  let total = 0, current = 0, j = i, used = 0, lastKind = null, sawScale = false, onlyA = false;
  if (bare(words[i]) === "a" && i + 1 < words.length && !trail(words[i]) && (bare(words[i + 1]) === "hundred" || bare(words[i + 1]) in SCALES)) {
    current = 1; j = i + 1; onlyA = true; lastKind = "small";
  }
  // year form: "nineteen ninety-seven", "twenty twenty-four", "two thousand and nine" is handled below
  const y1 = small(bare(words[i] ?? "")), y2 = small(bare(words[i + 1] ?? ""));
  if (!onlyA && !trail(words[i]) && y1 !== null && y2 !== null && y1 >= 10 && y1 <= 20 && y2 >= 10) {
    return { value: y1 * 100 + y2, end: i + 2, year: true, last: words[i + 1] };
  }
  for (; j < words.length; j++) {
    const tok = words[j], w = bare(tok), v = small(w);
    if (v !== null) {
      if (lastKind === "small") break; // two plain numbers in a row ("fifteen sixteen") are not one number
      current += v; lastKind = "small";
    } else if (w === "hundred") {
      if (lastKind === "hundred" || lastKind === null) break; // "a couple of hundred" stays in words
      current = (current || 1) * 100; lastKind = "hundred";
    } else if (w in SCALES) {
      if (lastKind === null && !onlyA) break;
      total += (current || 1) * SCALES[w]; current = 0; lastKind = "scale"; sawScale = true;
    } else if (w === "and" && (lastKind === "hundred" || lastKind === "scale") && j + 1 < words.length && small(bare(words[j + 1])) !== null && !trail(words[j - 1])) {
      lastKind = "and"; used++; continue;
    } else break;
    used++;
    const p = trail(tok);
    // a comma between scale groups continues the number: "...ninety-nine million, seven hundred..."
    if (p === "," && lastKind === "scale" && j + 1 < words.length && isNumWord(words[j + 1])) continue;
    if (p) { j++; break; }
  }
  if (!used || lastKind === "and") return null;
  let end = j;
  let value = total + current;
  let decimal = "";
  // "nine point five eight"
  if (!sawScale && !trail(words[end - 1]) && bare(words[end] ?? "") === "point") {
    let k = end + 1;
    while (k < words.length && UNITS[bare(words[k])] !== undefined && UNITS[bare(words[k])] < 10) {
      decimal += UNITS[bare(words[k])];
      if (trail(words[k++])) break;
    }
    if (decimal) end = k;
  }
  return { value, end, decimal, sawScale, onlyA, last: words[end - 1] };
};

const fmt = (r) => {
  if (r.year) return String(r.value);
  if (r.decimal) return `${r.value}.${r.decimal}`;
  const v = r.value;
  // "four million", "a billion": digits + scale word read better than 4,000,000
  for (const [name, s] of [["billion", 1e9], ["million", 1e6]]) if (v >= s && v % s === 0 && v / s < 1000) return `${v / s} ${name}`;
  return v >= 10000 ? v.toLocaleString("en-US") : String(v);
};

export const numerals = (text) => {
  const words = text.split(/\s+/).filter(Boolean);
  const out = [];
  for (let i = 0; i < words.length; ) {
    const r = isNumWord(words[i]) || bare(words[i]) === "a" ? parseAt(words, i) : null;
    // keep one to ten as words; convert everything bigger, decimals and years
    // "a thousand/million/billion" alone stays in words; "a hundred" becomes 100
    const aScale = r && r.onlyA && r.end - i === 2 && bare(words[i + 1]) !== "hundred";
    if (aScale) { out.push(...words.slice(i, r.end)); i = r.end; continue; }
    if (r && (r.year || r.decimal || r.value > 10)) {
      const lead = words[i].match(/^[^A-Za-z-]*/)[0];
      out.push(lead + fmt(r) + trail(r.last));
      i = r.end;
    } else out.push(words[i++]);
  }
  return out.join(" ");
};

// ---- cue splitting
const MAX_LINE = 42;
const MAX_CUE = MAX_LINE * 2;

// Break points inside a sentence: after , ; : or before a dash - but never inside a number phrase.
const clauseSplit = (s) => {
  const words = s.split(" ");
  const pieces = [];
  let cur = [];
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if ((w === "—" || w === "–") && cur.length) { pieces.push(cur.join(" ")); cur = []; }
    cur.push(w);
    const p = trail(w);
    const inNumber = p === "," && /\b(thousand|million|billion),$/i.test(w) && i + 1 < words.length && isNumWord(words[i + 1]);
    if (/[,;:]$/.test(w) && !inNumber) { pieces.push(cur.join(" ")); cur = []; }
  }
  if (cur.length) pieces.push(cur.join(" "));
  return pieces;
};
const balancedWords = (s, len) => {
  const words = s.split(" ");
  const n = Math.ceil(len(s) / MAX_CUE);
  const target = len(s) / n;
  const out = [];
  let cur = [];
  for (const w of words) {
    if (cur.length && (len([...cur, w].join(" ")) > MAX_CUE || len(cur.join(" ")) >= target)) { out.push(cur.join(" ")); cur = []; }
    cur.push(w);
  }
  if (cur.length) out.push(cur.join(" "));
  return out;
};
const greedy = (pieces, len) => {
  const merged = [];
  for (const p of pieces) {
    if (merged.length && len(merged[merged.length - 1] + " " + p) <= MAX_CUE) merged[merged.length - 1] += " " + p;
    else merged.push(p);
  }
  return merged;
};

// Two lines, the break at the space that best balances them.
export const wrap = (t) => {
  if (t.length <= MAX_LINE) return t;
  let best = null;
  for (let k = t.indexOf(" "); k > 0; k = t.indexOf(" ", k + 1)) {
    const a = t.slice(0, k), b = t.slice(k + 1);
    // balance the two lines, but a break at punctuation that still fits both lines wins
    const atPunct = /[.?!,;:]$/.test(a) || /^[—–]/.test(b);
    const score = Math.max(a.length, b.length) - (atPunct && a.length <= MAX_LINE && b.length <= MAX_LINE ? 100 : 0);
    if (!best || score < best.score) best = { score, text: `${a}\n${b}` };
  }
  return best ? best.text : t;
};

// One narration line -> cues of at most 2 x 42 characters (after numerals), timed by the SPOKEN length
// of each piece (the original words), so a number shown as digits keeps the time it takes to say it.
export const cuesFor = (text, start, dur) => {
  const len = (s) => numerals(s).length;
  const sentences = text.match(/[^.?!]+[.?!]*["”)]?\s*/g)?.map((s) => s.trim()).filter(Boolean) ?? [text];
  const pieces = [];
  for (const s of sentences) {
    if (len(s) <= MAX_CUE) { pieces.push(s); continue; }
    for (const c of greedy(clauseSplit(s), len)) pieces.push(...(len(c) <= MAX_CUE ? [c] : balancedWords(c, len)));
  }
  const merged = greedy(pieces, len);
  const total = merged.reduce((n, m) => n + m.length, 0);
  let t = start;
  return merged.flatMap((m) => {
    const d = (m.length / total) * dur;
    const from = t;
    t += d;
    const text = wrap(numerals(m));
    const lines = text.split("\n");
    if (lines.every((l) => l.length <= MAX_LINE)) return [{ text, from, to: from + d }];
    // No break gives two lines of <= 42 (word boundaries): show the halves as two consecutive cues instead.
    const d1 = (d * lines[0].length) / (lines[0].length + lines[1].length);
    return [
      { text: wrap(lines[0]), from, to: from + d1 },
      { text: wrap(lines[1]), from: from + d1, to: from + d },
    ];
  });
};
