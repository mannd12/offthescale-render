// ST02 acts l02/l03 helpers: text, arrows, the cutaway tower, cream toilets, pipes, gauges, stamps, map blocks, an
// 8-rung chapter beat and a rolling odometer. Pure functions of their props (useId only for gradient/clip ids).
import React, { useId } from "react";
import { Bloom } from "../../../lib/illustrated/light";
import { rrect, smoothPath } from "../../../lib/illustrated/shapes";
import { rnd } from "../../../lib/illustrated/motion";
import { Cumulus } from "../../../lib/illustrated/props";
import { AIR, BRASS, BRASS_DARK, CHALK, CHALK_SHADE, INK, LIME, LIME_DEEP, ST_FONT, SUPPOSE, SupposeFamily, TERRA } from "../../../lib/suppose/palette";
import { Lev } from "../../../lib/suppose/lev";
import { Lever } from "../../../lib/suppose/devices";
import { CounterSpec, LADDER_RUNGS, ShotStage, ease, mix, pop } from "../shot";

export type Pt = [number, number];
export const SAGE = SUPPOSE.sage;
export const CLAY = SUPPOSE.clay;
export const CHK = SUPPOSE.chalk;
export const MOSS = SUPPOSE.moss;
export const CREAM = "#F4ECD3";
export const CREAM_SH = "#D8C9A2";
/** water: blue-sage lines */
export const WATER = "#5E9FAE";
export const WATER_DK = "#3F7884";
export const WATER_LT = AIR;
export const TERRA_DARK = "#8A3A20";
export const TERRA_LIT = "#E8987A";
export const PIPE = "#7F8F86";
export const PIPE_DK = "#4E5E56";
export const PIPE_LT = "#B9C6BC";

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

export const C_BUILDING: CounterSpec = { label: "FLUSHES", value: "1 BUILDING" };
export const C_SEATTLE: CounterSpec = { label: "FLUSHES", value: "60,722" };

export const Txt: React.FC<{
  x: number; y: number; size?: number; fill?: string; anchor?: "start" | "middle" | "end"; weight?: number; op?: number; ls?: number;
  children: React.ReactNode;
}> = ({ x, y, size = 40, fill = INK, anchor = "start", weight = 900, op = 1, ls = 0, children }) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={ST_FONT} fontWeight={weight} fontSize={size} letterSpacing={ls} fill={fill} opacity={op}>
    {children}
  </text>
);

export const Arrow: React.FC<{ x0: number; y0: number; x1: number; y1: number; color: string; w?: number; head?: number; op?: number; dash?: string; offset?: number }> = ({
  x0, y0, x1, y1, color, w = 10, head = 26, op = 1, dash, offset,
}) => {
  const len = Math.hypot(x1 - x0, y1 - y0);
  if (len < 2) return null;
  const ux = (x1 - x0) / len, uy = (y1 - y0) / len;
  const hb = Math.min(head, len * 0.6);
  const bx = x1 - ux * hb, by = y1 - uy * hb;
  const px = -uy * hb * 0.62, py = ux * hb * 0.62;
  return (
    <g opacity={op}>
      <path d={`M ${x0} ${y0} L ${bx} ${by}`} stroke={color} strokeWidth={w} strokeLinecap="round" strokeDasharray={dash} strokeDashoffset={offset} fill="none" />
      <path d={`M ${x1} ${y1} L ${bx + px} ${by + py} L ${bx - px} ${by - py} Z`} fill={color} stroke={color} strokeWidth={w * 0.4} strokeLinejoin="round" />
    </g>
  );
};

/** Faint grid on chalk paper. */
export const Grid: React.FC<{ color?: string }> = ({ color = CHK.mid }) => (
  <g stroke={color} strokeWidth={1.4} opacity={0.4}>
    {Array.from({ length: 34 }, (_, i) => <path key={`v${i}`} d={`M ${i * 60 - 60} -60 V 1140`} />)}
    {Array.from({ length: 22 }, (_, i) => <path key={`h${i}`} d={`M -60 ${i * 60 - 30} H 1980`} />)}
  </g>
);

/** first p (0..1 by length) of a polyline, plus the drawing head */
export const partial = (pts: Pt[], p: number): { d: string; head: Pt } => {
  const segs = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
  const total = segs.reduce((a, b) => a + b, 0);
  let left = total * clamp01(p);
  const out: Pt[] = [pts[0]];
  for (let i = 0; i < segs.length; i++) {
    if (left >= segs[i]) {
      out.push(pts[i + 1]);
      left -= segs[i];
    } else {
      const k = segs[i] > 0 ? left / segs[i] : 0;
      out.push([mix(pts[i][0], pts[i + 1][0], k), mix(pts[i][1], pts[i + 1][1], k)]);
      break;
    }
  }
  return { d: "M " + out.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(" L "), head: out[out.length - 1] };
};

/** stamp slam: scale 2.6 → 1 over 8 frames from `at`, plus a decaying shake offset */
export const slam = (t: number, at: number) => {
  const s = t < at ? 0 : mix(2.6, 1, ease(t, at, at + 8));
  const shake = t > at + 8 ? Math.sin(t * 2.6) * 10 * Math.exp(-(t - at - 8) / 5) : 0;
  return { s, shake };
};

/** A rubber stamp (chalk card, terracotta frame and letters), rotated, scale s about its centre. */
export const Stamp: React.FC<{ x: number; y: number; text: string; s: number; rot?: number; size?: number; color?: string }> = ({ x, y, text, s, rot = -8, size = 54, color = TERRA }) => {
  if (s <= 0) return null;
  const w = text.length * size * 0.7 + 90;
  const h = size + 64;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={s > 1.05 ? 0.65 : 1}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={22} fill={CHALK} opacity={0.92} />
      <rect x={-w / 2 + 12} y={-h / 2 + 12} width={w - 24} height={h - 24} rx={14} fill="none" stroke={color} strokeWidth={8} />
      <Txt x={0} y={size * 0.36} anchor="middle" size={size} fill={color} ls={3}>{text}</Txt>
    </g>
  );
};

/** Rings that burst out from a stamp just after it lands. */
export const StampRings: React.FC<{ x: number; y: number; t: number; at: number; w: number; h: number; rot?: number; color?: string }> = ({ x, y, t, at, w, h, rot = -8, color = TERRA_LIT }) => (
  <g>
    {[0, 1, 2].map((i) => {
      const a = t - at - 8 - i * 8;
      if (a < 0 || a > 34) return null;
      return <rect key={i} x={x - w / 2 - a * 4} y={y - h / 2 - a * 3} width={w + a * 8} height={h + a * 6} rx={30 + a * 2} fill="none" stroke={color} strokeWidth={6} opacity={1 - a / 34} transform={`rotate(${rot} ${x} ${y})`} />;
    })}
  </g>
);

/**
 * A plain cream toilet, side view facing +x: cistern at the back, bowl, pedestal. `s` = scale (1 = 100 px tall).
 * `flash` 0..1 lights it briefly (one flush).
 */
export const Toilet: React.FC<{ x: number; y: number; s?: number; flash?: number; outline?: string }> = ({ x, y, s = 1, flash = 0, outline = INK }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {flash > 0.01 ? <Bloom x={0} y={-50} r={95} color="#FFF6D6" strength={flash} /> : null}
    <ellipse cx={4} cy={2} rx={44} ry={6} fill="#000" opacity={0.16} />
    {/* cistern */}
    <path d={rrect(-44, -104, 30, 54, 7)} fill={CREAM} stroke={outline} strokeWidth={2.2 / s} />
    <rect x={-46} y={-110} width={34} height={9} rx={4} fill={CREAM} stroke={outline} strokeWidth={2.2 / s} />
    <rect x={-22} y={-96} width={6} height={12} rx={3} fill={CREAM_SH} />
    {/* bowl + pedestal */}
    <path
      d="M -18 -58 L 40 -58 Q 42 -38 22 -28 L 14 -24 L 18 -2 Q 18 2 14 2 L -10 2 Q -14 2 -13 -2 L -8 -26 Q -20 -32 -18 -58 Z"
      fill={CREAM}
      stroke={outline}
      strokeWidth={2.2 / s}
      strokeLinejoin="round"
    />
    <path d="M 10 -50 Q 28 -48 34 -54" stroke={CREAM_SH} strokeWidth={4} fill="none" strokeLinecap="round" />
    <rect x={-20} y={-64} width={62} height={7} rx={3.5} fill={CREAM} stroke={outline} strokeWidth={2.2 / s} />
    {flash > 0.01 ? <rect x={-20} y={-64} width={62} height={7} rx={3.5} fill="#FFFFFF" opacity={flash * 0.8} /> : null}
  </g>
);

/** Pressure gauge: chalk face, brass rim, terracotta danger arc (top right), ink needle. angle: −120 (low) … +120 (high). */
export const Gauge: React.FC<{ cx: number; cy: number; r: number; angle: number; danger?: number; face?: string }> = ({ cx, cy, r, angle, danger = 0, face = CHALK }) => {
  const rad = (a: number) => ((a - 90) * Math.PI) / 180;
  const arc = (a0: number, a1: number, rr: number) => {
    const [x0, y0] = [cx + Math.cos(rad(a0)) * rr, cy + Math.sin(rad(a0)) * rr];
    const [x1, y1] = [cx + Math.cos(rad(a1)) * rr, cy + Math.sin(rad(a1)) * rr];
    return `M ${x0} ${y0} A ${rr} ${rr} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
  };
  const nx = cx + Math.cos(rad(angle)) * r * 0.78, ny = cy + Math.sin(rad(angle)) * r * 0.78;
  return (
    <g>
      {danger > 0.01 ? <Bloom x={cx} y={cy} r={r * 1.8} color={TERRA} strength={danger * 0.7} /> : null}
      <circle cx={cx} cy={cy + r * 0.06} r={r * 1.08} fill="#000" opacity={0.18} />
      <circle cx={cx} cy={cy} r={r * 1.08} fill={BRASS_DARK} />
      <circle cx={cx} cy={cy} r={r} fill={BRASS} />
      <circle cx={cx} cy={cy} r={r * 0.9} fill={face} />
      <path d={arc(60, 120, r * 0.74)} stroke={TERRA} strokeWidth={r * 0.12} fill="none" strokeLinecap="round" />
      <path d={arc(-120, -60, r * 0.74)} stroke={CHALK_SHADE} strokeWidth={r * 0.12} fill="none" strokeLinecap="round" />
      {Array.from({ length: 9 }, (_, i) => {
        const a = -120 + i * 30;
        const r0 = r * (i % 2 ? 0.8 : 0.76), r1 = r * 0.86;
        return <path key={i} d={`M ${cx + Math.cos(rad(a)) * r0} ${cy + Math.sin(rad(a)) * r0} L ${cx + Math.cos(rad(a)) * r1} ${cy + Math.sin(rad(a)) * r1}`} stroke={INK} strokeWidth={Math.max(2, r * 0.035)} strokeLinecap="round" opacity={0.7} />;
      })}
      <path d={`M ${cx} ${cy} L ${nx} ${ny}`} stroke={INK} strokeWidth={Math.max(4, r * 0.07)} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={r * 0.1} fill={INK} />
      <circle cx={cx - r * 0.03} cy={cy - r * 0.03} r={r * 0.04} fill={CHALK} opacity={0.6} />
    </g>
  );
};

// ------------------------------------------------------------------ the cutaway tower
export const TW = { x0: 380, w: 760, ground: 960, lobby: 150, floors: 7, fh: 92 };
export const towerTop = TW.ground - TW.lobby - TW.floors * TW.fh; // 166
export const RISER_X = TW.x0 + TW.w - 120;
/** y of floor i's slab (i = 0 lowest upper floor) */
export const floorY = (i: number) => TW.ground - TW.lobby - i * TW.fh;
export const TOILET_X = TW.x0 + 170;

/**
 * Cutaway apartment tower. `flash(i)` 0..1 per upper floor; `flow` = speed of the water dashes in the riser;
 * `bubbles` (0..1) fills the top-floor pipe with air bubbles; `wave` 0..1 position of a pressure band running down the riser.
 */
export const Tower: React.FC<{ t: number; flash?: (i: number) => number; flow?: number; bubbles?: number; wave?: number; waveAmp?: number; lobby?: React.ReactNode }> = ({
  t, flash, flow = 0.6, bubbles = 0, wave = -1, waveAmp = 0, lobby,
}) => {
  const { x0, w, ground, floors, fh } = TW;
  const top = towerTop;
  const wallC = "#6E8F74";
  const room = "#E9EFD8";
  const off = -t * 3 * flow;
  const branchY = (i: number) => floorY(i) - 66;
  const topI = floors - 1;
  const bubbleN = Math.round(18 * clamp01(bubbles));
  return (
    <g>
      {/* rooftop water tank (terracotta prop) */}
      <g>
        <path d={`M ${x0 + 140} ${top - 18} L ${x0 + 150} ${top - 30} L ${x0 + 250} ${top - 30} L ${x0 + 260} ${top - 18} Z`} fill={TERRA_DARK} />
        <rect x={x0 + 150} y={top - 104} width={100} height={76} rx={10} fill={TERRA} />
        <path d={`M ${x0 + 146} ${top - 104} L ${x0 + 200} ${top - 138} L ${x0 + 254} ${top - 104} Z`} fill={TERRA_DARK} />
        {[0, 1, 2].map((k) => <path key={k} d={`M ${x0 + 150} ${top - 86 + k * 22} H ${x0 + 250}`} stroke={TERRA_DARK} strokeWidth={4} opacity={0.6} />)}
      </g>
      {/* shell */}
      <rect x={x0 - 18} y={top - 26} width={w + 36} height={ground - top + 26} rx={10} fill={wallC} />
      <rect x={x0 - 30} y={top - 34} width={w + 60} height={22} rx={8} fill={SAGE.near} />
      {/* rooms */}
      {Array.from({ length: floors }, (_, i) => {
        const yb = floorY(i), yt = yb - fh + 12;
        const fl = flash ? flash(i) : 0;
        return (
          <g key={i}>
            <rect x={x0} y={yt} width={w} height={fh - 12} fill={room} />
            <rect x={x0} y={yt} width={w} height={fh - 12} fill="#FFE9A8" opacity={fl * 0.7} />
            {fl > 0.05 ? <circle cx={TOILET_X + 4} cy={yb - 40} r={40 + (1 - fl) * 30} fill="none" stroke={LIME} strokeWidth={5} opacity={fl} /> : null}
            {/* window */}
            <rect x={x0 + 330} y={yt + 14} width={110} height={44} rx={6} fill={SAGE.sky[0]} opacity={0.8} />
            <path d={`M ${x0 + 385} ${yt + 14} V ${yt + 58}`} stroke={wallC} strokeWidth={4} />
            <rect x={x0} y={yb - 6} width={w} height={6} fill={SAGE.mid} opacity={0.6} />
          </g>
        );
      })}
      {/* lobby */}
      <rect x={x0} y={ground - TW.lobby + 12} width={w} height={TW.lobby - 12} fill={room} />
      <rect x={x0 + 40} y={ground - 110} width={70} height={110} rx={6} fill={SAGE.mid} />
      {/* floor slabs */}
      {Array.from({ length: floors + 1 }, (_, i) => (
        <rect key={i} x={x0 - 18} y={floorY(i)} width={w + 36} height={12} fill={SAGE.shadow} opacity={0.85} />
      ))}
      {/* riser: thick pipe from the street main to the top floor */}
      <rect x={RISER_X - 20} y={branchY(topI) - 18} width={40} height={ground + 70 - branchY(topI) + 18} rx={14} fill={PIPE_DK} />
      <rect x={RISER_X - 13} y={branchY(topI) - 11} width={26} height={ground + 70 - branchY(topI) + 11} rx={10} fill={WATER} />
      <path d={`M ${RISER_X} ${ground + 66} V ${branchY(topI) - 4}`} stroke={WATER_LT} strokeWidth={5} strokeDasharray="18 22" strokeDashoffset={-off} strokeLinecap="round" opacity={0.9} />
      {/* pressure band running down the riser */}
      {wave >= 0 && wave <= 1 && waveAmp > 0.01 ? (() => {
        const wy = mix(branchY(topI), ground + 40, wave);
        return <rect x={RISER_X - 20 - 10 * waveAmp} y={wy - 26} width={40 + 20 * waveAmp} height={52} rx={18} fill={PIPE_DK} stroke={TERRA} strokeWidth={5 * waveAmp} opacity={0.95} />;
      })() : null}
      {/* branches + toilets */}
      {Array.from({ length: floors }, (_, i) => {
        const by = branchY(i);
        const fl = flash ? flash(i) : 0;
        const bx0 = TOILET_X - 30, bx1 = RISER_X - 14;
        return (
          <g key={i}>
            <rect x={bx0} y={by - 8} width={bx1 - bx0} height={16} rx={8} fill={PIPE_DK} />
            <rect x={bx0 + 3} y={by - 4} width={bx1 - bx0 - 3} height={8} rx={4} fill={WATER} />
            {fl > 0.05 ? <path d={`M ${bx1} ${by} H ${bx0 + 6}`} stroke={WATER_LT} strokeWidth={4} strokeDasharray="14 14" strokeDashoffset={-t * 9} opacity={fl} /> : null}
            <Toilet x={TOILET_X} y={floorY(i)} s={0.62} flash={fl} />
          </g>
        );
      })}
      {/* air bubbles in the top-floor branch + top of the riser */}
      {Array.from({ length: bubbleN }, (_, k) => {
        const along = (k * 0.137 + t * 0.006) % 1;
        const inRiser = k % 3 === 0;
        const by = branchY(topI);
        const bx = inRiser ? RISER_X + Math.sin(t / 6 + k) * 4 : mix(RISER_X - 20, TOILET_X - 10, along);
        const byy = inRiser ? by + 10 + (1 - along) * 120 : by + Math.sin(t / 5 + k * 2) * 1.5;
        const r = inRiser ? 6 + (k % 4) : 2.6 + (k % 3) * 0.8;
        return <circle key={k} cx={bx} cy={byy} r={r} fill={CHALK} stroke={WATER_DK} strokeWidth={1.6} opacity={0.95} />;
      })}
      {lobby}
      {/* street main (cutaway under the pavement) */}
      <rect x={-60} y={ground + 50} width={2040} height={44} rx={20} fill={PIPE_DK} />
      <rect x={-60} y={ground + 58} width={2040} height={28} rx={14} fill={WATER} />
      <path d={`M -60 ${ground + 72} H 1980`} stroke={WATER_LT} strokeWidth={5} strokeDasharray="30 30" strokeDashoffset={off * 1.4} opacity={0.8} />
    </g>
  );
};

/** Sage ground for the tower: low hills behind, pavement + soil band in front. */
export const TowerGround: React.FC = () => (
  <g>
    <path d={smoothPath([[-60, 780], [300, 720], [700, 770], [1100, 700], [1500, 760], [1990, 710]]) + " L 1990 980 L -60 980 Z"} fill={SAGE.far} />
    <rect x={-60} y={TW.ground} width={2040} height={200} fill="#7C6A4F" />
    <rect x={-60} y={TW.ground} width={2040} height={22} fill={SAGE.near} />
    <rect x={-60} y={TW.ground + 22} width={2040} height={8} fill={SAGE.shadow} opacity={0.5} />
  </g>
);

/** Small Lever + Lev pulling it in the tower lobby. pull 0..1 */
export const LobbyLev: React.FC<{ f: number; pull: number }> = ({ f, pull }) => {
  const g = TW.ground;
  const lx = 720, levX = 676, h = 104, sc = 0.5, len = 120;
  const angle = mix(4, -34, pull);
  const r = (angle * Math.PI) / 180;
  const tip: Pt = [lx + sc * Math.sin(r) * len, g + sc * (-40 - Math.cos(r) * len)];
  const s = h / 170;
  const hand: Pt = [(tip[0] - levX) / s, (tip[1] - g) / s];
  return (
    <g>
      <Lever x={lx} y={g} len={len} angle={angle} plate="FLUSH" scale={sc} glow={0.4 * pull} />
      <Lev x={levX} y={g} h={h} frame={f} pose="pull" hands={{ front: hand, back: [hand[0] - 6, hand[1] + 8] }} lean={-8 * pull} eyes={pull > 0.5 ? "squint" : "happy"} outline={INK} wind={0.3} />
    </g>
  );
};

// ------------------------------------------------------------------ chapter beat (8-rung ladder)
export const ladderStep8 = (top: number, bottom: number) => (bottom - top) / (LADDER_RUNGS.length + 0.5);
export const rungY8 = (top: number, bottom: number, i: number) => bottom - ladderStep8(top, bottom) * (i + 0.5);

export const BigLadder8: React.FC<{ x: number; top: number; bottom: number; width?: number; lit: number; glow?: number; frame: number; light?: boolean; font?: number }> = ({
  x, top, bottom, width = 120, lit, glow = 1, frame, light = false, font = 28,
}) => {
  const xl = x - width / 2, xr = x + width / 2;
  const thick = 10;
  return (
    <g>
      {light ? (
        <g stroke={INK} strokeWidth={thick + 6} strokeLinecap="round" opacity={0.28}>
          <path d={`M ${xl} ${bottom + 24} L ${xl} ${top}`} />
          <path d={`M ${xr} ${bottom + 24} L ${xr} ${top}`} />
        </g>
      ) : null}
      <path d={`M ${xl} ${bottom + 24} L ${xl} ${top}`} stroke={LIME} strokeWidth={thick} strokeLinecap="round" />
      <path d={`M ${xr} ${bottom + 24} L ${xr} ${top}`} stroke={LIME} strokeWidth={thick} strokeLinecap="round" />
      {LADDER_RUNGS.map((r, i) => {
        const ry = rungY8(top, bottom, i);
        const on = i <= lit, cur = i === lit;
        const lx = xl - 30;
        return (
          <g key={i}>
            {cur && glow > 0 ? <Bloom x={x} y={ry} r={width * 1.3} color={LIME} strength={glow * (0.55 + 0.15 * Math.sin(frame / 7))} /> : null}
            {light ? <path d={`M ${xl} ${ry} L ${xr} ${ry}`} stroke={INK} strokeWidth={thick + 4} strokeLinecap="round" opacity={on ? 0.25 : 0.12} /> : null}
            <path d={`M ${xl} ${ry} L ${xr} ${ry}`} stroke={on ? LIME : LIME_DEEP} strokeWidth={cur ? thick + 3 : thick - 1} strokeLinecap="round" opacity={on ? 1 : 0.45} />
            {cur ? (
              <g transform={`translate(${lx} ${ry})`}>
                <rect x={-r.length * font * 0.66 - 26} y={-font * 0.8} width={r.length * font * 0.66 + 40} height={font * 1.6} rx={font * 0.8} fill={INK} opacity={0.85} />
                <text x={0} y={font * 0.38} textAnchor="end" fontFamily={ST_FONT} fontWeight={900} fontSize={font * 1.05} fill={LIME}>{r}</text>
              </g>
            ) : (
              <text x={lx} y={ry + font * 0.32} textAnchor="end" fontFamily={ST_FONT} fontWeight={800} fontSize={font * 0.82} fill={light ? INK : CHALK} opacity={on ? 0.95 : 0.55}>{r}</text>
            )}
          </g>
        );
      })}
    </g>
  );
};

/** Chapter beat: Lev climbs one rung, it lights, the title slides in. Beats at fractions of d. */
export const ChapterBeat8: React.FC<{ t: number; d: number; f: number; fam: SupposeFamily; prev: number; next: number; eyebrow: string; title: string; counter?: CounterSpec }> = ({
  t, d, f, fam, prev, next, eyebrow, title, counter,
}) => {
  const F = SUPPOSE[fam];
  const top = 270, bottom = 990, lx = 1460;
  const c0 = 0.1 * d, c1 = 0.36 * d;
  const climb = ease(t, c0, c1);
  const litAt = c1;
  const lit = t < litAt ? prev : next;
  const glow = t < litAt ? 0.6 : 0.6 + 1.4 * Math.max(0, 1 - (t - litAt) / 20);
  const yPrev = rungY8(top, bottom, prev), yNext = rungY8(top, bottom, next);
  const levY = mix(yPrev, yNext, climb) - Math.sin(climb * Math.PI * 2) * 8;
  const slide = ease(t, 0, 0.16 * d);
  const tx = mix(-1100, 150, slide);
  const ul = ease(t, 0.2 * d, 0.5 * d);
  const cloudX = (t * 1.6) % 2400;
  const titleK = t >= litAt ? 1 + 0.06 * Math.sin(Math.PI * clamp01((t - litAt) / 14)) : 1;
  return (
    <ShotStage fam={fam} t={t} f={f} counter={counter}>
      <Bloom x={420} y={260} r={700} color={F.light} strength={0.55} spread={0.5} />
      {!F.dark ? (
        <>
          <Cumulus x={1700 - cloudX} y={330} w={360} h={130} fill={CHALK} shade={CHALK_SHADE} lit={F.light} seed={3} frame={f} opacity={0.85} />
          <Cumulus x={2600 - cloudX} y={210} w={260} h={96} fill={CHALK} shade={CHALK_SHADE} lit={F.light} seed={8} frame={f} opacity={0.75} />
        </>
      ) : null}
      <path d={smoothPath([[-60, 1000], [400, 980], [900, 995], [1400, 985], [1980, 1000]]) + " L 1980 1120 L -60 1120 Z"} fill={F.mid} />
      <path d={smoothPath([[-60, 1040], [600, 1028], [1300, 1040], [1980, 1032]]) + " L 1980 1120 L -60 1120 Z"} fill={F.near} />
      <BigLadder8 x={lx} top={top} bottom={bottom} width={124} lit={lit} glow={glow} frame={f} light={!F.dark} />
      <Lev x={lx - 6} y={levY} h={128} frame={f} pose="pull" hands={{ front: [22, -178], back: [12, -168] }} eyes={t > litAt + 4 ? "happy" : "up"} tilt={-6} wind={0.5} outline={F.dark ? undefined : INK} />
      <g transform={`translate(${tx} 0)`}>
        <text x={0} y={430} fontFamily={ST_FONT} fontWeight={900} fontSize={34} letterSpacing={6} fill={F.dim}>{eyebrow}</text>
        <g transform={`translate(0 540) scale(${titleK}) translate(0 -540)`}>
          <text x={0} y={560} fontFamily={ST_FONT} fontWeight={900} fontSize={110} fill={F.text}>{title}</text>
        </g>
        <path d={`M 4 596 L ${4 + 560 * ul} 596`} stroke={TERRA} strokeWidth={12} strokeLinecap="round" opacity={ul > 0 ? 1 : 0} />
      </g>
    </ShotStage>
  );
};

// ------------------------------------------------------------------ rolling odometer
/** Digit wheels rolling to `v` (float). Right-aligned at x; baseline y. */
export const Odometer: React.FC<{ x: number; y: number; v: number; digits: number; size: number; color?: string; comma?: boolean }> = ({ x, y, v, digits, size, color = LIME, comma = true }) => {
  const id = "odo" + useId().replace(/:/g, "");
  const cw = size * 0.62;
  const items: React.ReactNode[] = [];
  let cx = x;
  const vv = Math.max(0, v);
  const lead = Math.floor(vv).toString().length;
  for (let p = 0; p < digits; p++) {
    if (comma && p > 0 && p % 3 === 0) {
      cx -= size * 0.3;
      if (p < lead) items.push(<text key={`c${p}`} x={cx + size * 0.15} y={y} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={size} fill={color}>,</text>);
    }
    cx -= cw;
    const unit = Math.pow(10, p);
    const w = vv / unit;
    const base = Math.floor(w) % 10;
    // odometer carry: higher wheels only move during the last unit of the wheel below
    const rem = vv % unit;
    const frac = p === 0 ? w - Math.floor(w) : Math.max(0, (rem - (unit - 1)) / 1);
    const show = p < lead || vv < 1;
    if (!show) continue;
    const off = frac * size * 1.1;
    items.push(
      <g key={p} clipPath={`url(#${id})`}>
        <text x={cx + cw / 2} y={y - off} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={size} fill={color}>{base}</text>
        <text x={cx + cw / 2} y={y - off + size * 1.1} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={size} fill={color}>{(base + 1) % 10}</text>
      </g>,
    );
  }
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={x - digits * cw - 4 * size} y={y - size * 0.95} width={digits * cw + 4 * size + 10} height={size * 1.2} />
        </clipPath>
      </defs>
      {items}
    </g>
  );
};

// ------------------------------------------------------------------ map blocks
/** A grid of city blocks around (cx, cy): each block appears when within radius R. */
export const blocks = (n: number, seed: number) =>
  Array.from({ length: n }, (_, i) => {
    const col = i % 21, row = Math.floor(i / 21);
    return { x: (col - 10) * 92 + (rnd(seed + i) - 0.5) * 6, y: (row - 6) * 92, w: 64 + rnd(seed * 3 + i) * 14, h: 64 + rnd(seed * 7 + i) * 14, tone: rnd(seed * 11 + i) };
  });

/** Map pin (terracotta) dropping onto (x, y); k 0..1 drop progress. */
export const Pin: React.FC<{ x: number; y: number; k: number; color?: string; s?: number }> = ({ x, y, k, color = TERRA, s = 1 }) => {
  if (k <= 0) return null;
  const dy = (1 - k) * -260;
  const sq = k >= 1 ? 1 : 1;
  return (
    <g>
      <ellipse cx={x} cy={y + 4} rx={22 * s * k} ry={7 * s * k} fill="#000" opacity={0.3 * k} />
      <g transform={`translate(${x} ${y + dy}) scale(${s} ${s * sq})`}>
        <path d="M 0 0 C -10 -22 -34 -38 -34 -64 A 34 34 0 1 1 34 -64 C 34 -38 10 -22 0 0 Z" fill={color} stroke={TERRA_DARK} strokeWidth={3} />
        <circle cx={0} cy={-64} r={13} fill={CHALK} />
      </g>
    </g>
  );
};

export { BRASS, BRASS_DARK, pop };
