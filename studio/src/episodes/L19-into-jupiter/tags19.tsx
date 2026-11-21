// L19 pills, tags, error bars and the check mark (BUILD.md §5 `tags19.tsx`; storyboard §1 "Tickets and tags", F2-F4).
// The HEARD / MODEL tickets themselves live in tape.tsx (they belong to the radio tape).
// USAGE (f = the shot's frame)
//   <OurSumPill x y size? align? appear? />            OUR SUM: saffron outline + dot (every class C figure, F4)
//   <AboutPill x y … />                                ABOUT: teal outline (a rounded figure)
//   <AgencyPill x y agency="NASA SAYS"|"NASA SAID (1996)"|"NASA SAYS (1997)"|"JUNO SAYS" … />
//                                                      lemon-white label pill with ink words (F7: no logos, words only)
//   <WordPill x y text F? fill? color? dot? … />       NO FLOOR, NO EDGE, NOT MEASURED, ONE SPOT, LOCAL, NOT THE SAME LEVEL,
//                                                      DEEPER, MODEL … (numerals in it are checked with assertAllowed)
//   <PillFor kind={readout(key).pill} x y … />          the right pill for a data19 entry
//   <QuestionTag x y f mark?="?"|"!" size?=60 />       vermilion tag that bobs 12 px and tilts (vermilion's only non-Tick use)
//   <ErrorBar x y={baseline} f value={px height} grow={0..1} whisk={0..1} up={px} down={px} label? color? width? />
//                                                      a value bar that grows, then whiskers that extend (40 px/f when the
//                                                      caller drives whisk at 40/len per frame); `label` is checked
//   <Check x y size? draw={0..1} color? />             a check mark with a drawing head (a bright dot at the pen)
import React from "react";
import { Family, IF2, labelCase } from "../../lib/illustrated";
import { L19_COLORS as C, PILL_TEXT, pillFill } from "./families";
import { PillKind, assertAllowed } from "./data19";

const cl = (v: number) => Math.max(0, Math.min(1, v));
export const sm = (v: number) => {
  const x = cl(v);
  return x * x * (3 - 2 * x);
};

type PB = { x: number; y: number; text: string; size?: number; align?: "start" | "middle" | "end"; appear?: number; fill: string; stroke?: string; dash?: string; color: string; dot?: string };
export const PillBase: React.FC<PB> = ({ x, y, text, size = 22, align = "start", appear = 1, fill, stroke, dash, color, dot }) => {
  const a = sm(appear);
  if (a <= 0) return null;
  const t = labelCase(text);
  const w = t.length * size * 0.62 + size * (dot ? 2.4 : 1.4);
  const h = size * 1.7;
  const x0 = align === "start" ? x : align === "end" ? x - w : x - w / 2;
  return (
    <g opacity={a} transform={`translate(0 ${((1 - a) * 18).toFixed(1)})`}>
      <rect x={x0 + 3} y={y - h / 2 + 5} width={w} height={h} rx={h / 2} fill="#1A0402" opacity={0.3} />
      <rect x={x0} y={y - h / 2} width={w} height={h} rx={h / 2} fill={fill} stroke={stroke} strokeWidth={stroke ? 3 : 0} strokeDasharray={dash} />
      {dot ? <circle cx={x0 + size * 0.95} cy={y} r={size * 0.26} fill={dot} /> : null}
      <text x={x0 + (dot ? size * 1.6 : size * 0.7)} y={y + size * 0.36} style={{ fontFamily: IF2.label, fontSize: size, letterSpacing: size * 0.12, fill: color }}>
        {t}
      </text>
    </g>
  );
};

type PP = { x: number; y: number; size?: number; align?: "start" | "middle" | "end"; appear?: number };
const DARK_PILL = "rgba(26,4,2,0.74)";
export const OurSumPill: React.FC<PP> = (p) => <PillBase {...p} text="OUR SUM" fill={DARK_PILL} stroke={C.saffron} color={PILL_TEXT} dot={C.saffron} />;
export const AboutPill: React.FC<PP> = (p) => <PillBase {...p} text="ABOUT" fill={DARK_PILL} stroke={C.teal} color={PILL_TEXT} />;
export type Agency = "NASA SAYS" | "NASA SAID (1996)" | "NASA SAYS (1997)" | "JUNO SAYS";
export const AgencyPill: React.FC<PP & { agency: Agency }> = ({ agency, ...p }) => (
  <PillBase {...p} text={assertAllowed(agency, "AgencyPill")} fill={C.modelLabel} stroke={C.ink} color={C.ink} dot={C.belt} />
);
export const WordPill: React.FC<PP & { text: string; F?: Family; fill?: string; color?: string; dot?: string; dash?: string }> = ({ text, F, fill, color, dot, dash, ...p }) => (
  <PillBase {...p} text={assertAllowed(text, "WordPill")} fill={fill ?? (F ? pillFill(F) : DARK_PILL)} color={color ?? PILL_TEXT} dot={dot} dash={dash} stroke={dash ? PILL_TEXT : undefined} />
);
export const PillFor: React.FC<PP & { kind?: PillKind }> = ({ kind, ...p }) =>
  kind === "our-sum" ? (
    <OurSumPill {...p} />
  ) : kind === "about" ? (
    <AboutPill {...p} />
  ) : kind === "nasa-says" ? (
    <AgencyPill {...p} agency="NASA SAYS" />
  ) : kind === "nasa-said" ? (
    <AgencyPill {...p} agency="NASA SAID (1996)" />
  ) : kind === "juno-says" ? (
    <AgencyPill {...p} agency="JUNO SAYS" />
  ) : null;

/** The vermilion "?" or "!" tag (storyboard §1: vermilion only on Tick and these). */
export const QuestionTag: React.FC<{ x: number; y: number; f: number; mark?: "?" | "!"; size?: number }> = ({ x, y, f, mark = "?", size = 60 }) => {
  const bob = Math.sin(f * 0.3) * 12;
  const tilt = Math.sin(f * 0.21) * 10;
  return (
    <g transform={`translate(${x} ${y + bob}) rotate(${tilt.toFixed(1)})`}>
      <rect x={-size * 0.45 + 4} y={-size * 0.55 + 6} width={size * 0.9} height={size * 1.1} rx={size * 0.24} fill="#1A0402" opacity={0.3} />
      <rect x={-size * 0.45} y={-size * 0.55} width={size * 0.9} height={size * 1.1} rx={size * 0.24} fill={C.vermilion} />
      <text x={0} y={size * 0.32} textAnchor="middle" style={{ fontFamily: IF2.display, fontWeight: 800, fontSize: size * 0.9, fill: "#FFE7C2" }}>
        {mark}
      </text>
    </g>
  );
};

/** A value bar with error whiskers (4-10, 4-11: 2.7 with +2.4 / -1.7). Heights are px the caller derives from one scale. */
export const ErrorBar: React.FC<{
  x: number;
  y: number;
  f: number;
  value: number;
  grow?: number;
  whisk?: number;
  up?: number;
  down?: number;
  label?: string;
  color?: string;
  width?: number;
}> = ({ x, y, f, value, grow = 1, whisk = 0, up = 0, down = 0, label, color = C.heard, width = 90 }) => {
  const h = value * sm(grow);
  const top = y - h;
  const w = sm(whisk);
  const pulse = 0.6 + 0.4 * Math.sin(f * 0.25);
  return (
    <g>
      <rect x={x - width / 2 + 6} y={top + 8} width={width} height={h} rx={10} fill="#002A1A" opacity={0.35} />
      <rect x={x - width / 2} y={top} width={width} height={h} rx={10} fill={color} />
      <rect x={x - width / 2} y={top} width={width * 0.3} height={h} rx={10} fill="#FFFFFF" opacity={0.16} />
      {w > 0 ? (
        <g stroke={C.ink} strokeWidth={6} strokeLinecap="round">
          <line x1={x} y1={top} x2={x} y2={top - up * w} />
          <line x1={x} y1={top} x2={x} y2={top + down * w} />
          <line x1={x - 30} y1={top - up * w} x2={x + 30} y2={top - up * w} />
          <line x1={x - 30} y1={top + down * w} x2={x + 30} y2={top + down * w} />
          {w < 1 ? <circle cx={x} cy={top - up * w} r={9} fill={C.goldHot} stroke="none" opacity={pulse} /> : null}
        </g>
      ) : null}
      {label ? (
        <text x={x} y={top - up * w - 28} textAnchor="middle" style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 40, fill: C.ink }}>
          {assertAllowed(label, "ErrorBar")}
        </text>
      ) : null}
    </g>
  );
};

/** A check mark drawn with a pen head (7-04 "fit better"). */
export const Check: React.FC<{ x: number; y: number; size?: number; draw?: number; color?: string }> = ({ x, y, size = 120, draw = 1, color = C.heard }) => {
  const pts: [number, number][] = [
    [x - size * 0.45, y],
    [x - size * 0.1, y + size * 0.35],
    [x + size * 0.5, y - size * 0.4],
  ];
  const l1 = Math.hypot(pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]);
  const l2 = Math.hypot(pts[2][0] - pts[1][0], pts[2][1] - pts[1][1]);
  const L = (l1 + l2) * cl(draw);
  const head: [number, number] =
    L <= l1
      ? [pts[0][0] + ((pts[1][0] - pts[0][0]) * L) / l1, pts[0][1] + ((pts[1][1] - pts[0][1]) * L) / l1]
      : [pts[1][0] + ((pts[2][0] - pts[1][0]) * (L - l1)) / l2, pts[1][1] + ((pts[2][1] - pts[1][1]) * (L - l1)) / l2];
  const d = `M${pts[0][0]} ${pts[0][1]} L${pts[1][0]} ${pts[1][1]} L${pts[2][0]} ${pts[2][1]}`;
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke="#002A1A" strokeWidth={size * 0.2} opacity={0.3} strokeDasharray={`${L} 9999`} transform="translate(6 8)" />
      <path d={d} stroke={color} strokeWidth={size * 0.17} strokeDasharray={`${L} 9999`} />
      {draw < 1 ? <circle cx={head[0]} cy={head[1]} r={size * 0.12} fill={C.goldHot} /> : null}
    </g>
  );
};
