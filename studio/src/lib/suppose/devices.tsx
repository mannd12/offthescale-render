// Suppose Then signature devices (STYLE.md §1): the Suppose Lever, the Counter, the Ladder, honesty pills, flags and
// the wordmark. Drawn in SVG user units of a 1920×1080 frame unless a component says otherwise.
import React from "react";
import { Bloom } from "../illustrated/light";
import { BRASS, BRASS_DARK, CHALK, INK, LIME, LIME_DEEP, ST_FONT, TERRA } from "./palette";

type Pt = [number, number];
const rad = (d: number) => (d * Math.PI) / 180;

/** Tip of the lever arm (where Lev's hands go). angle 0 = upright, + = pulled toward +x. */
export const leverTip = (x: number, y: number, len: number, angle: number): Pt => [x + Math.sin(rad(angle)) * len, y - 40 - Math.cos(rad(angle)) * len];

export const Lever: React.FC<{ x: number; y: number; len?: number; angle?: number; plate: string; scale?: number; glow?: number }> = ({
  x, y, len = 260, angle = 0, plate, scale = 1, glow = 0,
}) => {
  const [tx, ty] = leverTip(0, 0, len, angle);
  const pw = Math.max(150, plate.length * 21 + 44);
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx={0} cy={4} rx={pw * 0.62} ry={12} fill="#000" opacity={0.25} />
      {/* housing */}
      <rect x={-pw / 2} y={-64} width={pw} height={64} rx={14} fill={BRASS_DARK} />
      <rect x={-pw / 2 + 6} y={-60} width={pw - 12} height={30} rx={10} fill={BRASS} opacity={0.35} />
      {/* the plate: the premise */}
      <rect x={-pw / 2 + 12} y={-54} width={pw - 24} height={44} rx={9} fill="#F6E7B8" stroke={BRASS_DARK} strokeWidth={2} />
      <text x={0} y={-23} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={27} letterSpacing={1.5} fill={INK}>{plate}</text>
      {/* slot + arm */}
      <rect x={-46} y={-74} width={92} height={14} rx={7} fill={INK} opacity={0.75} />
      {glow > 0 ? <Bloom x={tx} y={ty} r={90} color={TERRA} strength={glow} /> : null}
      <path d={`M 0 -66 L ${tx} ${ty}`} stroke={BRASS_DARK} strokeWidth={22} strokeLinecap="round" />
      <path d={`M 0 -66 L ${tx} ${ty}`} stroke={BRASS} strokeWidth={14} strokeLinecap="round" />
      <path d={`M -3 -70 L ${tx - 3} ${ty + 2}`} stroke="#FFF1C4" strokeWidth={3.5} strokeLinecap="round" opacity={0.7} />
      <circle cx={0} cy={-66} r={15} fill={BRASS_DARK} />
      <circle cx={0} cy={-66} r={7} fill={BRASS} />
      {/* knob */}
      <circle cx={tx} cy={ty} r={24} fill={TERRA} />
      <circle cx={tx - 7} cy={ty - 8} r={8} fill="#F2A07E" opacity={0.75} />
    </g>
  );
};

/** The Counter: a top-right readout. `value` is the big lime figure; `label` sits above, `sub` below. */
export const Counter: React.FC<{ x?: number; y?: number; label: string; value: string; sub?: string; size?: number }> = ({
  x = 1860, y = 60, label, value, sub, size = 92,
}) => {
  const w = Math.max(value.length * size * 0.58, (sub ?? "").length * 15, label.length * 15) + 56;
  const h = size + 62 + (sub ? 40 : 0);
  return (
    <g>
      <rect x={x - w} y={y} width={w} height={h} rx={22} fill={INK} opacity={0.62} />
      <rect x={x - w} y={y} width={w} height={h} rx={22} fill="none" stroke={LIME} strokeOpacity={0.35} strokeWidth={2} />
      <text x={x - 28} y={y + 38} textAnchor="end" fontFamily={ST_FONT} fontWeight={800} fontSize={22} letterSpacing={3} fill={CHALK} opacity={0.8}>{label}</text>
      <text x={x - 24} y={y + 38 + size * 0.92} textAnchor="end" fontFamily={ST_FONT} fontWeight={900} fontSize={size} fill={LIME}>{value}</text>
      {sub ? (
        <text x={x - 28} y={y + h - 22} textAnchor="end" fontFamily={ST_FONT} fontWeight={800} fontSize={26} letterSpacing={1} fill={CHALK}>{sub}</text>
      ) : null}
    </g>
  );
};

/** The Ladder: lime rails, labelled rungs (bottom → top); `lit` = index of the current rung; rungs above it are dim. */
export const Ladder: React.FC<{ x: number; top: number; bottom: number; rungs: string[]; lit: number; width?: number; frame?: number; labels?: "left" | "right" }> = ({
  x, top, bottom, rungs, lit, width = 64, frame = 0, labels = "left",
}) => {
  const n = rungs.length;
  const step = (bottom - top) / (n + 0.5);
  const lx = labels === "left" ? x - width / 2 - 22 : x + width / 2 + 22;
  return (
    <g>
      <path d={`M ${x - width / 2} ${bottom + 20} L ${x - width / 2} ${top}`} stroke={LIME} strokeWidth={7} strokeLinecap="round" opacity={0.85} />
      <path d={`M ${x + width / 2} ${bottom + 20} L ${x + width / 2} ${top}`} stroke={LIME} strokeWidth={7} strokeLinecap="round" opacity={0.85} />
      {rungs.map((r, i) => {
        const ry = bottom - step * (i + 0.5);
        const on = i <= lit;
        const cur = i === lit;
        const pulse = cur ? 0.5 + 0.2 * Math.sin(frame / 8) : 0;
        return (
          <g key={i}>
            {cur ? <Bloom x={x} y={ry} r={70} color={LIME} strength={pulse} /> : null}
            <path d={`M ${x - width / 2} ${ry} L ${x + width / 2} ${ry}`} stroke={on ? LIME : LIME_DEEP} strokeWidth={cur ? 10 : 7} strokeLinecap="round" opacity={on ? 1 : 0.35} />
            {r ? (
              <text x={lx} y={ry + 9} textAnchor={labels === "left" ? "end" : "start"} fontFamily={ST_FONT} fontWeight={cur ? 900 : 800} fontSize={cur ? 30 : 24} fill={cur ? LIME : CHALK} opacity={on ? 1 : 0.45}>{r}</text>
            ) : null}
          </g>
        );
      })}
    </g>
  );
};

/** Honesty pill (OUR SUM / IDEAL / MODEL / ROUGHLY): rounded, chalk outline, small caps. */
export const STPill: React.FC<{ x: number; y: number; text: string; dark?: boolean; align?: "start" | "middle" | "end"; size?: number }> = ({
  x, y, text, dark = true, align = "start", size = 20,
}) => {
  const w = text.length * size * 0.68 + 34;
  const x0 = align === "start" ? x : align === "middle" ? x - w / 2 : x - w;
  const h = size + 18;
  return (
    <g>
      <rect x={x0} y={y - h / 2} width={w} height={h} rx={h / 2} fill={dark ? INK : CHALK} opacity={dark ? 0.55 : 0.9} />
      <rect x={x0} y={y - h / 2} width={w} height={h} rx={h / 2} fill="none" stroke={dark ? CHALK : INK} strokeWidth={2} opacity={0.9} />
      <text x={x0 + w / 2} y={y + size * 0.36} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={size} letterSpacing={2} fill={dark ? CHALK : INK}>{text}</text>
    </g>
  );
};

/** A summit flag: pole, terracotta pennant, and a label card with one big figure and a small line. */
export const Flag: React.FC<{ x: number; y: number; big: string; small: string; side?: 1 | -1; frame?: number; dark?: boolean }> = ({
  x, y, big, small, side = 1, frame = 0, dark = true,
}) => {
  const wv = Math.sin(frame / 7) * 5;
  const cw = Math.max(big.length * 44, small.length * 13.5) + 40;
  const cx = side === 1 ? x + 16 : x - 16 - cw;
  return (
    <g>
      <path d={`M ${x} ${y} L ${x} ${y - 120}`} stroke={INK} strokeWidth={5} strokeLinecap="round" />
      <path d={`M ${x} ${y - 120} Q ${x + side * 40} ${y - 112 + wv} ${x + side * 72} ${y - 104 + wv} Q ${x + side * 40} ${y - 92} ${x} ${y - 84} Z`} fill={TERRA} />
      <rect x={cx} y={y - 250} width={cw} height={112} rx={18} fill={dark ? INK : CHALK} opacity={0.78} />
      <text x={cx + cw / 2} y={y - 180} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={64} fill={CHALK}>{big}</text>
      <text x={cx + cw / 2} y={y - 152} textAnchor="middle" fontFamily={ST_FONT} fontWeight={800} fontSize={19} letterSpacing={1.5} fill={CHALK} opacity={0.85}>{small}</text>
    </g>
  );
};

/** "Suppose Then" wordmark; the lime mark over the second word is a tiny lever. */
export const Wordmark: React.FC<{ x: number; y: number; size?: number; color?: string; align?: "start" | "middle" }> = ({ x, y, size = 120, color = CHALK, align = "middle" }) => (
  <g>
    <text x={x} y={y} textAnchor={align} fontFamily={ST_FONT} fontWeight={900} fontSize={size} letterSpacing={-1} fill={color}>
      Suppose <tspan fill={LIME}>Then</tspan>
    </text>
  </g>
);
