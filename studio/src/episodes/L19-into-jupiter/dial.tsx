// L19 the round pressure dial, its heat ring and the glass thermometer (BUILD.md §5 `dial.tsx`; storyboard F6, D1).
// The dial is DRAWN IN THE SHOT (the station console, a deck shot), never a HUD. Its look is ours: an ink-green face, an
// amber bezel with rim lamps, lemon numerals and a vermilion-free needle (the needle is hot gold; vermilion stays on Tick).
// USAGE (f = the shot's frame)
//   <BarDial f cx cy r?=220 needle={bar value, log-mapped 0.5..30; 0 = rest} lit?={0..12 lamps lit, fractional = the next
//            lamp fading in} arc?={[a, b] in bar} arcDraw?={0..1 with a drawing head} arcs?={DialArc[]} marker?={bar value of
//            the MISSION REQUIREMENT notch; no numeral} heat?={0..1 HeatRing fill} heatMark?={true: the 300 F notch} label?="BAR" sweep?={px/f of the face's
//            scanning band; default 6} />
//   dialAngle(v)               → the angle (deg, SVG) of a bar value on the dial (for leaders and tags placed by callers)
//   needleTo(from, to, p)      → an eased needle value from `from` to `to` (p 0..1); THROWS if `to` is not a sourced stop (F6)
//   <HeatRing cx cy r fill={0..1} f mark?={show the 300 F mark} />    the red-hot arc around a rim (5-02)
//   <Thermo x y={bulb centre} h?=420 level={0..1 mercury} expected?={0..1 EXPECTED mark} f />   (2-07, 5-02)
//       the caller drives `level` at 36 px/f: d(level)/df = 36 / h
// D1: 5-01 parks the needle on the 23 mark and labels the reading 23 ATMOSPHERES (never "23 BAR").
// F6: no depth is ever written next to a pressure.
import React from "react";
import { IF2 } from "../../lib/illustrated";
import { L19_COLORS as C } from "./families";
import { NEEDLE_STOPS, assertAllowed } from "./data19";
import { sm } from "./tags19";

const LO = Math.log(0.5);
const HI = Math.log(30);
const A0 = 135; // start angle (deg; 0 = right, clockwise in SVG)
const SPAN = 270;
const cl = (v: number) => Math.max(0, Math.min(1, v));
export const dialAngle = (v: number) => A0 + SPAN * cl((Math.log(Math.max(0.5, v)) - LO) / (HI - LO));
const pt = (cx: number, cy: number, r: number, deg: number): [number, number] => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];
const arcPath = (cx: number, cy: number, r: number, a: number, b: number) => {
  const [x0, y0] = pt(cx, cy, r, a);
  const [x1, y1] = pt(cx, cy, r, b);
  return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${b - a > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
};

/** Eased needle move to a SOURCED stop only (F6). */
export const needleTo = (from: number, to: number, p: number) => {
  if (!(NEEDLE_STOPS as readonly number[]).includes(to)) throw new Error(`L19 BarDial: needle stop ${to} is not a sourced value (data19 NEEDLE_STOPS)`);
  const k = sm(p);
  // move on the log scale so the sweep looks even
  const a = Math.log(Math.max(0.5, from));
  const b = Math.log(Math.max(0.5, to));
  return Math.exp(a + (b - a) * k);
};

export type DialArc = { from: number; to: number; draw?: number; color?: string; dashed?: boolean; width?: number; inset?: number };
const NUMERALS = [1, 4, 10, 21, 30];

export const BarDial: React.FC<{
  f: number;
  cx: number;
  cy: number;
  r?: number;
  needle: number;
  lit?: number;
  arc?: [number, number];
  arcDraw?: number;
  arcs?: DialArc[];
  marker?: number;
  heat?: number;
  heatMark?: boolean;
  label?: "BAR";
  sweep?: number;
}> = ({ f, cx, cy, r = 220, needle, lit = 0, arc, arcDraw = 1, arcs = [], marker, heat = 0, heatMark = true, label = "BAR", sweep = 6 }) => {
  const all: DialArc[] = [...(arc ? [{ from: arc[0], to: arc[1], draw: arcDraw, color: C.heard }] : []), ...arcs];
  const na = dialAngle(needle <= 0 ? 0.5 : needle) + Math.sin(f * 0.9) * 0.8; // a living tremble
  const [nx, ny] = pt(cx, cy, r * 0.78, na);
  const [tx, ty] = pt(cx, cy, r * 0.16, na + 180);
  const lamps = 12;
  // the face's scanning band (the probe-visible mover when the needle rests): a wide soft wedge circling at `sweep` px/f at the rim
  const sweepDeg = ((f * sweep) / (r * 0.9)) * (180 / Math.PI);
  const sw = (A0 + (sweepDeg % SPAN)) % 360;
  return (
    <g>
      {heat > 0 ? <HeatRing cx={cx} cy={cy} r={r * 1.12} fill={heat} f={f} mark={heatMark} /> : null}
      {/* bezel */}
      <circle cx={cx + 8} cy={cy + 12} r={r * 1.04} fill="#1A0402" opacity={0.35} />
      <circle cx={cx} cy={cy} r={r * 1.04} fill={C.goldRim} />
      <circle cx={cx} cy={cy} r={r * 1.04} fill="none" stroke={C.goldHot} strokeWidth={4} strokeDasharray={`${r * 1.6} ${r * 10}`} transform={`rotate(200 ${cx} ${cy})`} />
      <circle cx={cx} cy={cy} r={r * 0.95} fill={C.ink} />
      {/* scanning wedge */}
      <path d={`M${cx} ${cy} L${pt(cx, cy, r * 0.93, sw - 14).join(" ")} A${r * 0.93} ${r * 0.93} 0 0 1 ${pt(cx, cy, r * 0.93, sw + 14).join(" ")} Z`} fill={C.emerald} opacity={0.32} />
      {/* scale track */}
      <path d={arcPath(cx, cy, r * 0.8, A0, A0 + SPAN)} fill="none" stroke="#0B4A2E" strokeWidth={r * 0.09} strokeLinecap="round" />
      {all.map((a, i) => {
        const s = dialAngle(a.from);
        const e = s + (dialAngle(a.to) - s) * cl(a.draw ?? 1);
        if (e - s < 0.5) return null;
        const rr = r * (0.8 - (a.inset ?? 0) * 0.1 * (i + 0));
        const [hx, hy] = pt(cx, cy, rr, e);
        return (
          <g key={i}>
            <path d={arcPath(cx, cy, rr, s, e)} fill="none" stroke={a.color ?? C.heard} strokeWidth={(a.width ?? 0.09) * r} strokeLinecap={a.dashed ? "butt" : "round"} strokeDasharray={a.dashed ? `${r * 0.08} ${r * 0.05}` : undefined} />
            {(a.draw ?? 1) < 1 ? <circle cx={hx} cy={hy} r={r * 0.07} fill={C.goldHot} /> : null}
          </g>
        );
      })}
      {/* ticks + numerals (scale marks, not claims) */}
      {NUMERALS.map((v) => {
        const a = dialAngle(v);
        const [x0, y0] = pt(cx, cy, r * 0.68, a);
        const [x1, y1] = pt(cx, cy, r * 0.88, a);
        const [lx, ly] = pt(cx, cy, r * 0.53, a);
        return (
          <g key={v}>
            <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={C.heard} strokeWidth={r * 0.025} strokeLinecap="round" />
            <text x={lx} y={ly + r * 0.06} textAnchor="middle" style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: r * 0.16, fill: C.heard }}>
              {assertAllowed(String(v), "BarDial numeral")}
            </text>
          </g>
        );
      })}
      {/* the 23 mark (D1: used by 5-01 only; drawn as a short unnumbered notch) */}
      <line {...(() => { const a = dialAngle(23); const [x0, y0] = pt(cx, cy, r * 0.74, a); const [x1, y1] = pt(cx, cy, r * 0.86, a); return { x1: x0, y1: y0, x2: x1, y2: y1 }; })()} stroke={C.apricot} strokeWidth={r * 0.018} />
      {marker != null ? (
        (() => {
          const a = dialAngle(marker);
          const [x0, y0] = pt(cx, cy, r * 0.9, a);
          const [x1, y1] = pt(cx, cy, r * 1.02, a);
          return <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={C.belt} strokeWidth={r * 0.05} strokeLinecap="round" />;
        })()
      ) : null}
      {/* rim lamps */}
      {Array.from({ length: lamps }, (_, i) => {
        const a = A0 + (SPAN * (i + 0.5)) / lamps;
        const [lx, ly] = pt(cx, cy, r * 0.995, a);
        const on = cl(lit - i);
        return (
          <g key={i}>
            <circle cx={lx} cy={ly} r={r * 0.035} fill="#5A1206" />
            {on > 0 ? <circle cx={lx} cy={ly} r={r * 0.035 + on * r * 0.02} fill={C.heard} opacity={on} /> : null}
          </g>
        );
      })}
      <text x={cx} y={cy + r * 0.52} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: r * 0.13, letterSpacing: r * 0.03, fill: C.apricot }}>
        {label}
      </text>
      {/* needle */}
      <line x1={tx + 6} y1={ty + 8} x2={nx + 6} y2={ny + 8} stroke="#000" strokeWidth={r * 0.05} opacity={0.3} strokeLinecap="round" />
      <line x1={tx} y1={ty} x2={nx} y2={ny} stroke={C.gold} strokeWidth={r * 0.045} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={r * 0.09} fill={C.goldRim} />
      <circle cx={cx - r * 0.025} cy={cy - r * 0.025} r={r * 0.035} fill={C.goldHot} />
    </g>
  );
};

/** The red-hot arc that fills around a rim (5-02 TOPPED 300 F). `mark` draws the 300 F notch at 80 % of the ring. */
export const HeatRing: React.FC<{ cx: number; cy: number; r: number; fill: number; f: number; mark?: boolean }> = ({ cx, cy, r, fill, f, mark = false }) => {
  const e = A0 + SPAN * cl(fill);
  const pulse = 0.75 + 0.25 * Math.sin(f * 0.35);
  const [mx, my] = pt(cx, cy, r + 34, A0 + SPAN * 0.8);
  return (
    <g>
      <path d={arcPath(cx, cy, r, A0, A0 + SPAN)} fill="none" stroke="#5A1206" strokeWidth={r * 0.07} strokeLinecap="round" />
      {fill > 0.005 ? (
        <>
          <path d={arcPath(cx, cy, r, A0, e)} fill="none" stroke={C.glow} strokeWidth={r * 0.13} strokeLinecap="round" opacity={0.35 * pulse} />
          <path d={arcPath(cx, cy, r, A0, e)} fill="none" stroke="#FF7A30" strokeWidth={r * 0.07} strokeLinecap="round" />
          <path d={arcPath(cx, cy, r, A0, e)} fill="none" stroke={C.goldHot} strokeWidth={r * 0.02} strokeLinecap="round" opacity={pulse} />
        </>
      ) : null}
      {mark ? (
        <text x={mx} y={my} textAnchor="middle" style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: r * 0.11, fill: C.goldHot }}>
          {assertAllowed("300 F", "HeatRing")}
        </text>
      ) : null}
    </g>
  );
};

/** A glass thermometer; mercury `level` 0..1 (the caller drives it at 36 px/f), EXPECTED mark at `expected`. */
export const Thermo: React.FC<{ x: number; y: number; h?: number; level: number; expected?: number; f: number; color?: string }> = ({ x, y, h = 420, level, expected, f, color = C.glow }) => {
  const w = h * 0.12;
  const top = y - h;
  const lv = y - w * 0.6 - (h - w) * cl(level);
  const shimmer = 0.5 + 0.5 * Math.sin(f * 0.4);
  return (
    <g>
      <rect x={x - w / 2 + 6} y={top + 8} width={w} height={h} rx={w / 2} fill="#1A0402" opacity={0.3} />
      <rect x={x - w / 2} y={top} width={w} height={h} rx={w / 2} fill="#FFE8B0" opacity={0.28} stroke={C.apricot} strokeWidth={4} />
      <rect x={x - w * 0.22} y={lv} width={w * 0.44} height={y - lv} fill={color} />
      <rect x={x - w * 0.22} y={lv - 4} width={w * 0.44} height={10} rx={5} fill={C.goldHot} opacity={shimmer} />
      <circle cx={x} cy={y} r={w * 0.95} fill={color} stroke={C.apricot} strokeWidth={4} />
      <circle cx={x - w * 0.3} cy={y - w * 0.3} r={w * 0.25} fill="#FFF0A0" opacity={0.7} />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={x + w / 2} y1={top + w + ((h - w * 2) * i) / 8} x2={x + w / 2 + (i % 2 ? 12 : 22)} y2={top + w + ((h - w * 2) * i) / 8} stroke={C.apricot} strokeWidth={3} />
      ))}
      {expected != null ? (
        <g>
          <line x1={x - w} y1={y - w * 0.6 - (h - w) * expected} x2={x + w * 1.6} y2={y - w * 0.6 - (h - w) * expected} stroke={C.belt} strokeWidth={5} strokeDasharray="12 8" />
          <text x={x + w * 1.8} y={y - w * 0.6 - (h - w) * expected + 10} style={{ fontFamily: IF2.label, fontSize: 28, letterSpacing: 3, fill: C.belt }}>
            EXPECTED
          </text>
        </g>
      ) : null}
    </g>
  );
};
