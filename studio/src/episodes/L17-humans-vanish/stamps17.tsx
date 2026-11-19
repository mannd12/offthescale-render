// L17 stamps, honesty pills, the evidence Sheet and Board (BUILD.md §5, storyboard §1 "Stamp states", F2, F4, F9, F14).
// Only TWO stamp families exist, each with a word AND a shape so colour is never the only cue:
//   SEEN   green #2FBF71 hexagon        (a source saw it)
//   MODEL  slate-teal #7C9BA6 square    (our reasoning about how a system works; never neutral grey, never violet)
//   tags   ESTIMATE · A PLAN · BEST GUESS · NOT YET: the MODEL colour in a rounded rectangle with their word
// USAGE (f = the shot's frame)
//   <SeenStamp  x y age?={frames since the slam; omit = resting} size?=150 rotate?=-8 ghost? f? paper? />
//   <ModelStamp x y age? size? rotate? ghost? f? />
//   <TagStamp   x y word="ESTIMATE"|"A PLAN"|"BEST GUESS"|"NOT YET" age? size?=150 (the tag's height × 2.6 wide) ghost? f? />
//     slam: 2.2× → 1× over 6 f (≈ 40 px/f at size 150) + a ring; ghost = the dashed waiting outline, pulsing 0.9-1.1
//   <OurSumPill x y size? align? appear? />            saffron outline + dot (class C, F4)
//   <ReasoningPill x y … />                           OUR REASONING: the same saffron outline, DASHED (row 19)
//   <AboutPill x y … />                               ABOUT: teal outline (a rounded figure, F13)
//   <AgencyPill x y agency="NOAA SAYS"|"NASA SAYS"|"NASA SAYS: PROBABLY" … />   paper pill, words only (F14: no logos)
//   <SourceChip x y name="POSIVA"|"NOAA"|… />          a small paper source chip
//   <WordPill x y text F? … />                         a plain family pill for one-word labels (KEPT DRY, SPALL, LIME LUMPS);
//                                                      numerals in it are checked (assertAllowed)
//   <PillFor kind={readout(key).pill} x y … />          the right pill for a data17 entry
//   <Sheet x y w h f title appear?={0..1, slides up 60 px} band?="teal"|"ochre"|"green" stamp?={{ kind, age?, ghost? }} tilt? >
//          body (sheet coords, below the 70-px title band) </Sheet>
//   <Board x y w h f pins? >children (board coords)</Board>   the cyclorama evidence board: ochre frame, paper-teal felt
import React, { useId } from "react";
import { IF2, alpha, labelCase, mixHex, rnd } from "../../lib/illustrated";
import { L17_COLORS } from "./families";
import { assertAllowed, type PillKind } from "./data17";

const C = L17_COLORS;
const sid = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, "");
const cl01 = (v: number) => Math.max(0, Math.min(1, v));
const sm = (t: number) => {
  const u = cl01(t);
  return u * u * (3 - 2 * u);
};

export type TagWord = "ESTIMATE" | "A PLAN" | "BEST GUESS" | "NOT YET";
export type StampKind = "seen" | "model" | TagWord;
const isTag = (k: StampKind): k is TagWord => k !== "seen" && k !== "model";
export const stampColor = (k: StampKind) => (k === "seen" ? C.seen : C.model);

const rrect = (x: number, y: number, w: number, h: number, r: number) => {
  const q = Math.min(r, w / 2, h / 2);
  return `M${x + q} ${y} H${x + w - q} A${q} ${q} 0 0 1 ${x + w} ${y + q} V${y + h - q} A${q} ${q} 0 0 1 ${x + w - q} ${y + h} H${x + q} A${q} ${q} 0 0 1 ${x} ${y + h - q} V${y + q} A${q} ${q} 0 0 1 ${x + q} ${y} Z`;
};
/** The stamp outline centred on 0,0; `s` = half the stamp's height. */
const shapeD = (k: StampKind, s: number) => {
  if (k === "model") {
    const q = s * 0.9;
    return rrect(-q, -q, 2 * q, 2 * q, s * 0.1);
  }
  if (isTag(k)) {
    const w = s * 2.6;
    const h = s * 1.1;
    return rrect(-w / 2, -h / 2, w, h, h * 0.32);
  }
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
    return `${(Math.cos(a) * s).toFixed(1)} ${(Math.sin(a) * s).toFixed(1)}`;
  });
  return "M" + pts.join(" L") + " Z";
};

/** A small soft drop shadow and a lit top-left edge: stamps, pills and sheets never read as flat stickers. */
const LitEdge: React.FC<{ d: string; width?: number; strength?: number }> = ({ d, width = 4, strength = 0.75 }) => {
  const id = "lit" + sid(useId());
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity={strength} />
          <stop offset="0.45" stopColor="#FFFFFF" stopOpacity={strength * 0.25} />
          <stop offset="0.7" stopColor="#FFFFFF" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={d} fill="none" stroke={`url(#${id})`} strokeWidth={width} />
    </g>
  );
};
const DropShadow: React.FC<{ d: string; dx?: number; dy?: number; opacity?: number }> = ({ d, dx = 5, dy = 8, opacity = 0.32 }) => (
  <g transform={`translate(${dx} ${dy})`}>
    <path d={d} fill="#04161C" opacity={opacity * 0.55} transform="scale(1.03)" />
    <path d={d} fill="#04161C" opacity={opacity} />
  </g>
);

/** One stamp face: ink shape, inner ring, the word(s), paper speckle gaps (ink-and-paper texture). */
const Face: React.FC<{ kind: StampKind; size: number; paper: string; ghost?: boolean }> = ({ kind, size, paper, ghost = false }) => {
  const s = size / 2;
  const col = stampColor(kind);
  if (ghost) return <path d={shapeD(kind, s)} fill="none" stroke={col} strokeWidth={5} strokeDasharray="14 10" />;
  const words = kind === "seen" ? ["SEEN"] : kind === "model" ? ["MODEL"] : [kind];
  const fs = isTag(kind) ? size * (kind.length > 8 ? 0.2 : 0.24) : size * (kind === "seen" ? 0.24 : 0.22);
  return (
    <g>
      <path d={shapeD(kind, s)} fill={col} />
      <path d={shapeD(kind, s * 0.84)} fill="none" stroke={paper} strokeWidth={Math.max(3, size * 0.025)} />
      {words.map((w, i) => (
        <text key={w} x={0} y={(i - (words.length - 1) / 2) * fs * 1.15 + fs * 0.36} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: fs, letterSpacing: fs * 0.06, fill: paper }}>
          {w}
        </text>
      ))}
      {Array.from({ length: 14 }, (_, i) => {
        const a = rnd(i * 7 + (kind === "seen" ? 1 : 3)) * Math.PI * 2;
        const r = s * (0.55 + 0.4 * rnd(i * 11 + 2));
        const sx = isTag(kind) ? 2.4 : 1;
        return <circle key={i} cx={Math.cos(a) * r * sx * 0.9} cy={Math.sin(a) * r * (isTag(kind) ? 0.45 : 1)} r={1.5 + rnd(i * 13) * 2.5} fill={paper} opacity={0.5} />;
      })}
    </g>
  );
};

type StampP = {
  x: number;
  y: number;
  /** frames since the slam (omit = resting, no slam); negative = not yet on screen */
  age?: number;
  size?: number;
  rotate?: number;
  ghost?: boolean;
  f?: number;
  /** ink-gap colour (the paper behind) */
  paper?: string;
};

/** Any L17 stamp. The slam scales 2.2× → 1× over 6 f (≈ 40 px/f edge travel at size 150), then a settle wobble and a ring. */
export const Stamp17: React.FC<StampP & { kind: StampKind }> = ({ x, y, kind, age, size = 150, rotate = -8, ghost = false, f = 0, paper = C.paper }) => {
  if (age != null && age < 0 && !ghost) return null;
  if (ghost) {
    const k = 1 + 0.1 * Math.sin(f / 4);
    return (
      <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${k.toFixed(3)})`} opacity={0.85}>
        <Face kind={kind} size={size} paper={paper} ghost />
      </g>
    );
  }
  const SL = 6;
  const a = age ?? 99;
  const k = a < SL ? 2.2 - 1.2 * (a / SL) ** 2 : 1 + Math.max(0, 0.06 * Math.sin((a - SL) * 1.4) * Math.exp(-(a - SL) / 5));
  const o = a < SL ? 0.35 + 0.65 * (a / SL) : 1;
  const ring = a >= SL && a < SL + 14 ? (a - SL) * 12 : -1;
  const d = shapeD(kind, size / 2);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      {ring >= 0 ? <path d={shapeD(kind, size / 2 + ring)} fill="none" stroke={stampColor(kind)} strokeWidth={5} opacity={1 - (a - SL) / 14} /> : null}
      <g transform={`scale(${k.toFixed(3)})`} opacity={o}>
        <DropShadow d={d} dx={4} dy={7} />
        <Face kind={kind} size={size} paper={paper} />
        <LitEdge d={shapeD(kind, size / 2 - 2)} width={Math.max(3, size * 0.028)} />
      </g>
    </g>
  );
};
export const SeenStamp: React.FC<StampP> = (p) => <Stamp17 {...p} kind="seen" />;
export const ModelStamp: React.FC<StampP> = (p) => <Stamp17 {...p} kind="model" />;
export const TagStamp: React.FC<StampP & { word: TagWord }> = ({ word, ...p }) => <Stamp17 {...p} kind={word} />;

// ---------------------------------------------------------------------------------------------------------------
// pills
// ---------------------------------------------------------------------------------------------------------------
type PillP = { x: number; y: number; size?: number; align?: "start" | "middle" | "end"; appear?: number };
const OutlinePill: React.FC<PillP & { text: string; stroke: string; fill: string; ink: string; dot?: string; dash?: string }> = ({
  x,
  y,
  text,
  stroke,
  fill,
  ink,
  dot,
  dash,
  size = 22,
  align = "start",
  appear = 1,
}) => {
  const t = labelCase(text);
  assertAllowed(t, "pill");
  const w = t.length * size * 0.62 + size * (dot ? 2.3 : 1.4);
  const h = size * 1.7;
  const x0 = align === "start" ? x : align === "end" ? x - w : x - w / 2;
  const a = sm(appear);
  if (a <= 0) return null;
  return (
    <g opacity={a} transform={`translate(0 ${((1 - a) * 16).toFixed(1)})`}>
      <DropShadow d={rrect(x0, y - h / 2, w, h, h / 2)} dx={2} dy={4} opacity={0.3} />
      <rect x={x0} y={y - h / 2} width={w} height={h} rx={h / 2} fill={fill} stroke={stroke} strokeWidth={3} strokeDasharray={dash} />
      <LitEdge d={rrect(x0 + 2, y - h / 2 + 2, w - 4, h - 4, h / 2 - 2)} width={2.5} strength={0.7} />
      {dot ? <circle cx={x0 + size * 0.95} cy={y} r={size * 0.26} fill={dot} /> : null}
      <text x={x0 + (dot ? size * 1.6 : size * 0.7)} y={y + size * 0.36} style={{ fontFamily: IF2.label, fontSize: size, letterSpacing: size * 0.12, fill: ink }}>
        {t}
      </text>
    </g>
  );
};

const PILL_BG = alpha("#04161C", 0.8);
export const OurSumPill: React.FC<PillP> = (p) => <OutlinePill {...p} text="our sum" stroke={C.saffron} fill={PILL_BG} ink={C.saffronCore} dot={C.saffron} />;
export const ReasoningPill: React.FC<PillP> = (p) => <OutlinePill {...p} text="our reasoning" stroke={C.saffron} fill={PILL_BG} ink={C.saffronCore} dash="10 7" />;
export const AboutPill: React.FC<PillP> = (p) => <OutlinePill {...p} text="about" stroke={C.teal} fill={PILL_BG} ink="#BFF5EA" />;
export type Agency = "NOAA SAYS" | "NASA SAYS" | "NASA SAYS: PROBABLY";
export const AgencyPill: React.FC<PillP & { agency?: Agency }> = ({ agency = "NASA SAYS", ...p }) => (
  <OutlinePill {...p} text={agency} stroke={mixHex(C.paper, C.saffron, 0.5)} fill={C.paper} ink={C.ink} />
);
export const SourceChip: React.FC<PillP & { name: string }> = ({ name, size = 16, ...p }) => <OutlinePill {...p} size={size} text={name} stroke={alpha(C.ink, 0.35)} fill={C.paper} ink={C.ink} />;
/** A plain label pill in the family's own pill colour (pillFill) with an optional dot: KEPT DRY, SPALL, LIME LUMPS … */
export const WordPill: React.FC<PillP & { text: string; fill?: string; ink?: string; dot?: string }> = ({ text, fill = PILL_BG, ink = "#FFF4E0", dot, ...p }) => (
  <OutlinePill {...p} text={text} stroke={alpha(ink, 0.25)} fill={fill} ink={ink} dot={dot} />
);

/** The pill a data17 entry must carry (readout(key).pill / .pill2). */
export const PillFor: React.FC<PillP & { kind?: PillKind }> = ({ kind, ...p }) => {
  if (!kind) return null;
  if (kind === "our-sum") return <OurSumPill {...p} />;
  if (kind === "reasoning") return <ReasoningPill {...p} />;
  if (kind === "about") return <AboutPill {...p} />;
  if (kind === "typical-day") return <WordPill {...p} text="a typical day" dot={C.water} />;
  if (kind === "noaa-says") return <AgencyPill {...p} agency="NOAA SAYS" />;
  return <AgencyPill {...p} agency="NASA SAYS" />;
};

// ---------------------------------------------------------------------------------------------------------------
// Sheet: an evidence sheet pinned on the board
// ---------------------------------------------------------------------------------------------------------------
const BANDS = { teal: C.tealDeep, ochre: "#C98A2E", green: C.seenDeep, slate: C.modelDeep } as const;
export const Sheet: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  f: number;
  title: string;
  appear?: number;
  stamp?: { kind: StampKind; age?: number; ghost?: boolean };
  tilt?: number;
  band?: keyof typeof BANDS;
  children?: React.ReactNode;
}> = ({ x, y, w, h, f, title, appear = 1, stamp, tilt = 0, band = "teal", children }) => {
  const id = "sh" + sid(useId());
  const a = sm(appear);
  if (a <= 0) return null;
  const t = labelCase(title);
  assertAllowed(t, "Sheet title");
  const sway = Math.sin(f / 37 + x * 0.01) * 0.6;
  return (
    <g opacity={a} transform={`translate(${x} ${y + (1 - a) * 60}) rotate(${(tilt + sway).toFixed(2)} ${w / 2} 0)`}>
      <DropShadow d={rrect(0, 0, w, h, 14)} dx={6} dy={10} opacity={0.26} />
      <rect x={0} y={0} width={w} height={h} rx={14} fill={C.paper} />
      <defs>
        <clipPath id={id}>
          <rect x={0} y={0} width={w} height={h} rx={14} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <rect x={0} y={0} width={w} height={64} fill={BANDS[band]} />
        <rect x={0} y={64} width={w} height={6} fill={C.saffron} />
        {/* faint ruled lines: paper, not a flat card */}
        {Array.from({ length: Math.floor((h - 90) / 34) }, (_, i) => (
          <line key={i} x1={18} x2={w - 18} y1={104 + i * 34} y2={104 + i * 34} stroke={C.water} strokeWidth={1.5} opacity={0.18} />
        ))}
        <LitEdge d={rrect(1.5, 1.5, w - 3, h - 3, 13)} width={4} strength={0.9} />
      </g>
      <text x={24} y={43} style={{ fontFamily: IF2.label, fontSize: 26, letterSpacing: 3, fill: "#FFF8EC" }}>
        {t}
      </text>
      {[w * 0.15, w * 0.85].map((px, i) => (
        <g key={i}>
          <circle cx={px} cy={-4} r={11} fill={i ? C.teal : C.saffron} />
          <circle cx={px - 3} cy={-7} r={3.5} fill="#FFFFFF" opacity={0.7} />
        </g>
      ))}
      <g transform="translate(0 70)">{children}</g>
      {stamp
        ? (() => {
            const ss = Math.min(150, w * (isTag(stamp.kind) ? 0.3 : 0.42), (h - 80) * 0.75);
            const sx = isTag(stamp.kind) ? w - ss * 1.45 : w - ss * 0.62;
            return <Stamp17 x={sx} y={h - ss * 0.62} kind={stamp.kind} age={stamp.age} ghost={stamp.ghost} f={f} size={ss} />;
          })()
        : null}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Board: the cyclorama evidence board (scene 10's set; four pins, a slow light band across the felt)
// ---------------------------------------------------------------------------------------------------------------
export const Board: React.FC<{ x: number; y: number; w: number; h: number; f: number; pins?: boolean; children?: React.ReactNode }> = ({ x, y, w, h, f, pins = true, children }) => {
  const id = "bd" + sid(useId());
  const shine = ((f * 6) % (w + 400)) - 200;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={12} y={18} width={w} height={h} rx={20} fill="#04161C" opacity={0.25} />
      <rect x={-14} y={-14} width={w + 28} height={h + 28} rx={26} fill={C.saffronDeep} />
      <rect x={-8} y={-8} width={w + 16} height={h + 16} rx={22} fill="#D2843F" />
      <LitEdge d={rrect(-12, -12, w + 24, h + 24, 24)} width={5} strength={0.85} />
      <rect x={0} y={0} width={w} height={h} rx={18} fill="#2E8F92" />
      <defs>
        <clipPath id={id}>
          <rect x={0} y={0} width={w} height={h} rx={18} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        {Array.from({ length: Math.ceil((w + h) / 60) }, (_, i) => (
          <line key={i} x1={i * 60 - h} y1={h} x2={i * 60} y2={0} stroke="#3AA29F" strokeWidth={14} opacity={0.4} />
        ))}
        <rect x={shine} y={0} width={180} height={h} fill="#FFFFFF" opacity={0.07} transform="skewX(-18)" />
      </g>
      {children}
      {pins
        ? [
            [26, 26],
            [w - 26, 26],
            [26, h - 26],
            [w - 26, h - 26],
          ].map(([px, py], i) => (
            <g key={i}>
              <circle cx={px} cy={py} r={13} fill={[C.saffron, C.seen, C.teal, C.lever][i]} />
              <circle cx={px - 4} cy={py - 4} r={4} fill="#FFFFFF" opacity={0.7} />
            </g>
          ))
        : null}
    </g>
  );
};
