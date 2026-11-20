// ST02 act l03 helpers: the Seattle demand graph, the calculator + sum card, the gallons→flushes dial, skylines.
import React from "react";
import { CHALK, INK, LIME, ST_FONT, TERRA } from "../../../lib/suppose/palette";
import { rrect, smoothPath } from "../../../lib/illustrated/shapes";
import { rnd } from "../../../lib/illustrated/motion";
import { ease, mix } from "../shot";
import { CHK, Pt, SAGE, TERRA_DARK, TERRA_LIT, Txt, WATER, WATER_LT, clamp01, partial } from "./l02-parts";

// ------------------------------------------------------------------ Seattle demand graph
export const GR = { x0: 760, x1: 1660, y0: 320, y1: 840, flat: 680, hb0: 1010, hb1: 1150, climbEnd: 1500, peak: 400 };
/** the demand line: flat (wiggly) to the end of halftime, then a sharp climb over "15 min", then a high plateau */
export const demandPts = (): { flat: Pt[]; climb: Pt[] } => {
  const flat: Pt[] = [];
  for (let x = GR.x0 + 20; x <= GR.hb1; x += 15) flat.push([x, GR.flat + Math.sin(x / 23) * 5 + (rnd(x) - 0.5) * 6]);
  const climb: Pt[] = [];
  for (let x = GR.hb1; x <= GR.x1 - 30; x += 12) {
    const k = clamp01((x - GR.hb1) / (GR.climbEnd - GR.hb1));
    const y = x <= GR.climbEnd ? mix(GR.flat, GR.peak, 1 - Math.pow(1 - k, 1.6)) : GR.peak + Math.sin(x / 19) * 6;
    climb.push([x, y + (rnd(x * 3) - 0.5) * 6]);
  }
  return { flat, climb };
};
const DP = demandPts();

/** Graph card. p = how much of the line is drawn (0..1 over flat+climb); hb 0..1 halftime bar growth; fill 0..1 water under the climb */
export const DemandGraph: React.FC<{ p: number; hb: number; fill?: number; t: number; dim?: number }> = ({ p, hb, fill = 0, t, dim = 0 }) => {
  const pf = clamp01(p / 0.5), pc = clamp01((p - 0.5) / 0.5);
  const fl = partial(DP.flat, pf), cl = partial(DP.climb, pc);
  const head = pc > 0 ? cl.head : fl.head;
  const fillTop = DP.climb.filter((q) => q[0] <= GR.climbEnd);
  const fillD = "M " + fillTop.map((q) => q.join(" ")).join(" L ") + ` L ${GR.climbEnd} ${GR.flat} Z`;
  return (
    <g opacity={1 - dim * 0.55}>
      <path d={rrect(GR.x0 - 70, GR.y0 - 90, GR.x1 - GR.x0 + 120, GR.y1 - GR.y0 + 180, 30)} fill={CHALK} opacity={0.9} />
      {/* halftime bar */}
      {hb > 0 ? (
        <g>
          <rect x={GR.hb0} y={GR.y1 - (GR.y1 - GR.y0 - 60) * hb} width={GR.hb1 - GR.hb0} height={(GR.y1 - GR.y0 - 60) * hb} fill={TERRA} opacity={0.85} />
          <g transform={`translate(${(GR.hb0 + GR.hb1) / 2 + 12} ${GR.flat - 40}) rotate(-90)`}>
            <Txt x={0} y={0} size={36} fill={CHALK} ls={4} op={clamp01((hb - 0.6) / 0.4)}>HALFTIME</Txt>
          </g>
        </g>
      ) : null}
      {/* axes */}
      <path d={`M ${GR.x0} ${GR.y0 - 20} V ${GR.y1} H ${GR.x1}`} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Txt x={GR.x0 - 16} y={GR.y0 - 36} size={24} fill={SAGE.dim} ls={3}>WATER DEMAND</Txt>
      <Txt x={GR.x1} y={GR.y1 + 48} anchor="end" size={24} fill={SAGE.dim} ls={3}>TIME</Txt>
      {fill > 0 ? (
        <g opacity={fill}>
          <path d={fillD} fill={WATER} opacity={0.45} />
          {Array.from({ length: 6 }, (_, i) => {
            const y = GR.flat - 18 - i * 44;
            return <path key={i} d={`M ${GR.hb1 + 40 + i * 50} ${y} H ${GR.climbEnd - 8}`} stroke={WATER_LT} strokeWidth={4} strokeDasharray="22 16" strokeDashoffset={-t * 1.5} opacity={0.9} />;
          })}
        </g>
      ) : null}
      {pf > 0 ? <path d={fl.d} stroke={INK} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
      {pc > 0 ? (
        <g>
          <path d={cl.d} stroke={INK} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.35} />
          <path d={cl.d} stroke={LIME} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ) : null}
      {p > 0 && p < 1 ? <circle cx={head[0]} cy={head[1]} r={13 + Math.sin(t / 3) * 2} fill={pc > 0 ? LIME : INK} stroke={INK} strokeWidth={3} /> : null}
    </g>
  );
};

/** Stylised Seattle: Puget Sound on the left, Lake Washington on the right, a tiny Space Needle. */
export const SeattleMap: React.FC<{ x: number; y: number; w: number; h: number; t: number; pin?: number }> = ({ x, y, w, h, t, pin = 1 }) => {
  const id = "l03sea";
  return (
    <g>
      <defs><clipPath id={id}><path d={rrect(x, y, w, h, 26)} /></clipPath></defs>
      <path d={rrect(x, y, w, h, 26)} fill={SAGE.mid} />
      <g clipPath={`url(#${id})`}>
        <path d={smoothPath([[x - 20, y - 20], [x + w * 0.32, y + h * 0.1], [x + w * 0.22, y + h * 0.45], [x + w * 0.34, y + h * 0.75], [x + w * 0.2, y + h + 20]]) + ` L ${x - 20} ${y + h + 20} Z`} fill={WATER} />
        <path d={smoothPath([[x + w * 0.78, y - 20], [x + w * 0.72, y + h * 0.3], [x + w * 0.8, y + h * 0.6], [x + w * 0.74, y + h + 20]]) + ` L ${x + w * 0.88} ${y + h + 20} L ${x + w * 0.9} ${y - 20} Z`} fill={WATER} />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${x + 10} ${y + 60 + i * 90} h 90`} stroke={WATER_LT} strokeWidth={4} strokeDasharray="20 18" strokeDashoffset={-t * 1.2 - i * 10} opacity={0.8} />)}
        {Array.from({ length: 22 }, (_, i) => (
          <rect key={i} x={x + w * 0.38 + (i % 4) * 46} y={y + 40 + Math.floor(i / 4) * 66} width={34} height={46} rx={6} fill={SAGE.near} opacity={0.35 + rnd(i) * 0.3} />
        ))}
      </g>
      {/* Space Needle */}
      <g transform={`translate(${x + w * 0.5} ${y + h * 0.42 + (1 - pin) * -40})`} opacity={pin}>
        <path d="M -10 60 L -3 -10 L 3 -10 L 10 60 Z" fill={CHALK} />
        <ellipse cx={0} cy={-14} rx={26} ry={7} fill={CHALK} />
        <path d="M 0 -20 V -40" stroke={CHALK} strokeWidth={3} />
      </g>
      <Txt x={x + w / 2} y={y + h + 50} anchor="middle" size={32} fill={SAGE.text} ls={5}>SEATTLE</Txt>
    </g>
  );
};

// ------------------------------------------------------------------ calculator + sum card
export type SumLine = { text: string; unit?: string; size?: number; color?: string; at: number; dur: number };

/** typed prefix of s at progress k (0..1) */
export const typed = (s: string, k: number) => s.slice(0, Math.round(s.length * clamp01(k)));

/** The receipt card: lines typed one after another; rule under the operand lines; the last line pops. */
export const SumCard: React.FC<{ x: number; y: number; w: number; h: number; t: number; lines: SumLine[]; ruleAt: number; resultPop: number; sweep?: number }> = ({
  x, y, w, h, t, lines, ruleAt, resultPop, sweep = -1,
}) => {
  const rows = [y + 170, y + 330, y + 530];
  const rule = ease(t, ruleAt, ruleAt + 10);
  return (
    <g>
      <path d={rrect(x + 10, y + 16, w, h, 30)} fill={INK} opacity={0.12} />
      <path d={rrect(x, y, w, h, 30)} fill={CHALK} />
      <path d={rrect(x, y, w, 26, 13)} fill={TERRA} opacity={0.9} />
      {lines.map((l, i) => {
        const k = clamp01((t - l.at) / Math.max(1, l.dur));
        if (k <= 0) return null;
        const s = typed(l.text, k);
        const last = i === lines.length - 1;
        const sc = last ? resultPop : 1;
        const cursor = k < 1 && Math.floor(t / 6) % 2 === 0;
        const size = l.size ?? 110;
        const xr = x + w - 70;
        return (
          <g key={i} transform={`translate(${xr} ${rows[i]}) scale(${last ? Math.max(0.001, sc) : 1}) translate(${-xr} ${-rows[i]})`}>
            {last && sweep >= 0 ? <rect x={x + 30 + (w - 60) * sweep - 60} y={rows[i] - size} width={120} height={size * 1.2} fill={LIME} opacity={0.18} /> : null}
            <text x={xr - (l.unit ? 0 : 0)} y={rows[i]} textAnchor="end" fontFamily={ST_FONT} fontWeight={900} fontSize={size} fill={l.color ?? INK}>
              {s}
              {cursor ? "|" : ""}
            </text>
            {l.unit && k >= 1 ? <Txt x={xr} y={rows[i] + 44} anchor="end" size={30} fill={CHK.dim} ls={2}>{l.unit}</Txt> : null}
          </g>
        );
      })}
      {rule > 0 ? <path d={`M ${x + 60} ${rows[1] + 70} H ${x + 60 + (w - 120) * rule}`} stroke={INK} strokeWidth={8} strokeLinecap="round" /> : null}
    </g>
  );
};

/** Terracotta desk calculator; `display` = current entry; `press` = index of the key lit (−1 none) */
export const Calculator: React.FC<{ x: number; y: number; display: string; press: number; t: number }> = ({ x, y, display, press, t }) => {
  const w = 380, h = 560;
  const keys = ["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "−", "0", ",", "=", "+"];
  return (
    <g transform={`rotate(-4 ${x + w / 2} ${y + h / 2})`}>
      <path d={rrect(x + 12, y + 18, w, h, 40)} fill={INK} opacity={0.16} />
      <path d={rrect(x, y, w, h, 40)} fill={TERRA} />
      <path d={rrect(x + 10, y + 10, w - 20, 40, 20)} fill={TERRA_LIT} opacity={0.35} />
      <path d={rrect(x + 30, y + 40, w - 60, 120, 18)} fill={INK} />
      <text x={x + w - 50} y={y + 128} textAnchor="end" fontFamily={ST_FONT} fontWeight={900} fontSize={display.length > 7 ? 54 : 64} fill={CHALK}>{display || "0"}</text>
      {keys.map((k, i) => {
        const cx = x + 40 + (i % 4) * 78, cy = y + 196 + Math.floor(i / 4) * 86;
        const on = i === press;
        return (
          <g key={i} transform={`translate(0 ${on ? 4 : 0})`}>
            {!on ? <path d={rrect(cx, cy + 6, 66, 68, 16)} fill={TERRA_DARK} /> : null}
            <path d={rrect(cx, cy, 66, 68, 16)} fill={on ? "#FFFFFF" : CHALK} />
            <text x={cx + 33} y={cy + 47} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={34} fill={k === "=" ? TERRA_DARK : INK}>{k}</text>
          </g>
        );
      })}
      <circle cx={x + w - 40} cy={y + 24} r={6 + Math.sin(t / 5)} fill={CHALK} opacity={0.6} />
    </g>
  );
};
/** which calculator key a character is on */
export const keyOf = (c: string) => ["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "−", "0", ",", "=", "+"].indexOf(c);

// ------------------------------------------------------------------ skylines (3-07)
export const Skyline: React.FC<{ x: number; base: number; scale: number; fill: string; needle?: boolean; seed: number; n: number; op?: number }> = ({ x, base, scale, fill, needle, seed, n, op = 1 }) => (
  <g opacity={op}>
    {Array.from({ length: n }, (_, i) => {
      const w = (50 + rnd(seed + i) * 50) * scale;
      const h = (120 + rnd(seed * 3 + i) * 260) * scale;
      const bx = x + i * 70 * scale;
      return <path key={i} d={rrect(bx, base - h, w, h + 10, 6)} fill={fill} />;
    })}
    {needle ? (
      <g transform={`translate(${x + n * 35 * scale} ${base}) scale(${scale})`}>
        <path d="M -14 0 L -4 -300 L 4 -300 L 14 0 Z" fill={fill} />
        <ellipse cx={0} cy={-306} rx={44} ry={12} fill={fill} />
        <path d="M 0 -316 V -360" stroke={fill} strokeWidth={5} />
      </g>
    ) : null}
  </g>
);

export { TERRA_DARK };
