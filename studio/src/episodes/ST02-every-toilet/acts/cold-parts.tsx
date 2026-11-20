// ST02 cold open + rung 1: shared props (toilet cutaway, NYC night map, clock, signs, TV, chart, stopwatch, clipboard,
// chapter beat scaled to the shot length). Pure functions of their props; nothing random except rnd(seed).
import React from "react";
import { Bloom, GroundShadow } from "../../../lib/illustrated/light";
import { blobPts, rrect, smoothPath } from "../../../lib/illustrated/shapes";
import { rnd } from "../../../lib/illustrated/motion";
import { Cumulus } from "../../../lib/illustrated/props";
import { mixHex } from "../../../lib/illustrated/palette";
import { AIR, BRASS, BRASS_DARK, CHALK, CHALK_SHADE, INK, LIME, OCEAN, ST_FONT, SUPPOSE, SupposeFamily, TERRA } from "../../../lib/suppose/palette";
import { Lev } from "../../../lib/suppose/lev";
import { leverTip } from "../../../lib/suppose/devices";
import { BigLadder, PopCounter, rungY } from "../../ST01-earth-twice-as-big/acts/cold-parts";
import { CounterSpec, LADDER_RUNGS, ShotStage, ease, lin, mix, pop } from "../shot";

export type Pt = [number, number];
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const closedPath = (pts: Pt[]) => smoothPath([...pts, pts[0], pts[1]]) + " Z";

// ------------------------------------------------------------------ colours
export const CREAM = "#F4EEDA";
export const CREAM_SH = "#D8CDAE";
/** blue-sage water for light skies */
export const WATER = mixHex(OCEAN, "#7FA98A", 0.3);
export const WATER_DK = mixHex(WATER, INK, 0.3);
/** blue-sage water for night skies */
export const WATER_LT = mixHex(AIR, "#B9D3A8", 0.3);
export const TERRA_DK = mixHex(TERRA, INK, 0.35);
export const FLUSHES = (value: string): CounterSpec => ({ label: "FLUSHES", value });

/** first p (0..1, by length) of a polyline, plus the drawing head */
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
export const polyLen = (pts: Pt[]) => pts.slice(1).reduce((a, q, i) => a + Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]), 0);

// ------------------------------------------------------------------ the toilet (side cutaway: tank behind, cream bowl)
/**
 * Plain cream toilet, side view, facing +x (bowl to the right). Origin = floor under the pedestal. ~330 units tall at s=1.
 * `level` (0..1) shows a cutaway tank with that much water; `tank` scales the tank (older, bigger tanks).
 */
export const Toilet: React.FC<{
  x: number; y: number; s?: number; level?: number; tank?: number; outline?: string; handle?: number; frame?: number; slosh?: number;
  facing?: 1 | -1; flash?: number; fill?: string;
}> = ({ x, y, s = 1, level, tank = 1, outline = INK, handle = 0, frame = 0, slosh = 0, facing = 1, flash = 0, fill = CREAM }) => {
  const sw = 3.2;
  const tw = 128 * mix(1, tank, 0.6), th = 132 * tank;
  const tx0 = -92, tb = -168, tt = tb - th;
  const body = mixHex(fill, "#FFFBEA", flash);
  const inner = { x: tx0 + 12, y: tt + 14, w: tw - 24, h: th - 26 };
  const wl = level !== undefined ? inner.y + inner.h * (1 - clamp01(level)) : 0;
  const wave = (xx: number) => Math.sin(xx / 16 + frame * 0.35) * slosh;
  const nW = 10;
  const top = level !== undefined
    ? Array.from({ length: nW + 1 }, (_, i) => {
        const xx = inner.x + (inner.w * i) / nW;
        return `L ${xx.toFixed(1)} ${Math.min(inner.y + inner.h, Math.max(inner.y, wl + wave(xx))).toFixed(1)}`;
      }).join(" ")
    : "";
  return (
    <g transform={`translate(${x} ${y}) scale(${s * facing} ${s})`}>
      {/* tank */}
      <rect x={tx0} y={tt} width={tw} height={th} rx={16} fill={body} stroke={outline} strokeWidth={sw} />
      <rect x={tx0 + tw - 22} y={tt + 6} width={14} height={th - 12} rx={7} fill={CREAM_SH} opacity={0.55} />
      {level !== undefined ? (
        <g>
          <rect x={inner.x} y={inner.y} width={inner.w} height={inner.h} rx={8} fill={mixHex(CREAM_SH, INK, 0.25)} opacity={0.55} />
          <path d={`M ${inner.x} ${inner.y + inner.h} ${top} L ${inner.x + inner.w} ${inner.y + inner.h} Z`} fill={WATER} />
          {level > 0.03 ? <path d={`M ${inner.x + 4} ${Math.max(inner.y + 3, wl + wave(inner.x) + 3)} H ${inner.x + inner.w - 4}`} stroke={AIR} strokeWidth={3} opacity={0.6} strokeLinecap="round" /> : null}
          <rect x={inner.x} y={inner.y} width={inner.w} height={inner.h} rx={8} fill="none" stroke={outline} strokeWidth={2} opacity={0.6} />
        </g>
      ) : null}
      {/* lid */}
      <rect x={tx0 - 8} y={tt - 16} width={tw + 16} height={20} rx={9} fill={body} stroke={outline} strokeWidth={sw} />
      {/* handle */}
      <g transform={`rotate(${handle * 28} ${tx0 + tw - 6} ${tt + 30})`}>
        <rect x={tx0 + tw - 10} y={tt + 24} width={34} height={12} rx={6} fill={TERRA} stroke={outline} strokeWidth={2} />
      </g>
      {/* back joint */}
      <rect x={-70} y={tb - 4} width={50} height={24} rx={6} fill={body} stroke={outline} strokeWidth={sw} />
      {/* bowl */}
      <path d="M -74 -150 L 118 -150 Q 122 -92 62 -74 L 44 -74 Q 40 -36 54 0 L -44 0 Q -30 -36 -34 -74 Q -74 -92 -74 -150 Z" fill={body} stroke={outline} strokeWidth={sw} strokeLinejoin="round" />
      <path d="M -20 -132 Q 40 -100 100 -136" stroke={CREAM_SH} strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.7} />
      {/* seat */}
      <rect x={-80} y={-164} width={204} height={18} rx={9} fill={body} stroke={outline} strokeWidth={sw} />
    </g>
  );
};

/** tiny toilet glyph (map / crowd use): tank + bowl, no outline. `old` = bigger, duller tank. */
export const TinyToilet: React.FC<{ x: number; y: number; s?: number; old?: number; fill?: string; opacity?: number }> = ({ x, y, s = 1, old = 0, fill = CREAM, opacity = 1 }) => {
  const th = mix(9, 15, old), tw = mix(8, 11, old);
  const col = mixHex(fill, "#A89878", old * 0.8);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
      <rect x={-8} y={-8 - th} width={tw} height={th} rx={2} fill={col} />
      <path d="M -9 -9 H 9 Q 8 -2 2 -1 L 3 4 H -5 L -4 -1 Q -9 -3 -9 -9 Z" fill={col} />
    </g>
  );
};

// ------------------------------------------------------------------ NYC night map (five boroughs, tiny cream buildings)
type Boro = { x: number; y: number; r: number; seed: number; sq: number };
export const BOROS: Boro[] = [
  { x: 640, y: 430, r: 62, seed: 21, sq: 3.1 }, // Manhattan
  { x: 790, y: 210, r: 120, seed: 22, sq: 0.78 }, // Bronx
  { x: 960, y: 560, r: 205, seed: 23, sq: 0.88 }, // Queens
  { x: 760, y: 820, r: 165, seed: 24, sq: 0.8 }, // Brooklyn
  { x: 360, y: 860, r: 125, seed: 25, sq: 0.68 }, // Staten Island
];
const boroD = BOROS.map((b) => closedPath(blobPts(b.x, b.y, b.r, 11, b.seed, 0.16, b.sq)));
export type Bldg = { x: number; y: number; k: number };
export const BLDGS: Bldg[] = (() => {
  const out: Bldg[] = [];
  let i = 0;
  for (let y = 120; y < 1000; y += 23) {
    for (let x = 220; x < 1200; x += 23) {
      i++;
      const jx = x + (rnd(i * 3) - 0.5) * 9, jy = y + (rnd(i * 5) - 0.5) * 9;
      const inside = BOROS.some((b) => ((jx - b.x) / b.r) ** 2 + ((jy - b.y) / (b.r * b.sq)) ** 2 < 0.62);
      if (inside) out.push({ x: jx, y: jy, k: rnd(i * 7) });
    }
  }
  return out;
})();

/**
 * The map. `flashAt(b)` returns the frame the building flashes (or Infinity); `t` is the shot frame. `dim` darkens.
 * `lines` draws the blue-sage line from each flashed building down to its street.
 */
export const NycMap: React.FC<{ t: number; f: number; dim?: number; flashAt?: (b: Bldg, i: number) => number; lines?: boolean }> = ({ t, f, dim = 0, flashAt, lines = false }) => {
  const M = SUPPOSE.moss;
  const land = mixHex(SUPPOSE.sage.mid, M.far, 0.55);
  return (
    <g opacity={1 - dim * 0.65}>
      {/* rivers shimmer */}
      {Array.from({ length: 7 }, (_, i) => {
        const y = 200 + i * 120;
        const off = ((f * 1.6 + i * 70) % 260) - 130;
        return <path key={i} d={`M ${300 + off} ${y} q 40 -8 80 0 t 80 0`} stroke={M.dim} strokeWidth={3} fill="none" opacity={0.18} strokeLinecap="round" />;
      })}
      {boroD.map((d, i) => (
        <g key={i}>
          <path d={d} fill={M.near} transform="translate(8 12)" opacity={0.7} />
          <path d={d} fill={land} stroke={M.bounce} strokeWidth={4} strokeLinejoin="round" />
        </g>
      ))}
      {/* a few avenues */}
      <g stroke={M.near} strokeWidth={4} opacity={0.35} strokeLinecap="round">
        <path d="M 610 260 L 670 600" /><path d="M 820 430 L 1120 690" /><path d="M 650 780 L 900 700" /><path d="M 760 140 L 860 280" /><path d="M 280 860 L 460 830" />
      </g>
      {BLDGS.map((b, i) => {
        const fa = flashAt ? flashAt(b, i) : Infinity;
        const age = t - fa;
        const fl = age >= 0 ? Math.exp(-age / 14) : 0;
        const lit = 0.55 + 0.3 * Math.sin(f / 30 + b.k * 9) * 0.5 + b.k * 0.2;
        const sz = 8 + fl * 5;
        return (
          <g key={i}>
            {lines && age >= 0 ? (() => {
              const p = clamp01(age / 8);
              const L = 22 + b.k * 14;
              const fade = age > 40 ? Math.max(0.25, 1 - (age - 40) / 40) : 1;
              return <path d={`M ${b.x} ${b.y + 4} L ${b.x} ${b.y + 4 + L * p}`} stroke={WATER_LT} strokeWidth={3} strokeLinecap="round" opacity={0.9 * fade} />;
            })() : null}
            {fl > 0.05 ? <circle cx={b.x} cy={b.y} r={10 + 14 * fl} fill="#FFF6D6" opacity={0.35 * fl} /> : null}
            <rect x={b.x - sz / 2} y={b.y - sz / 2} width={sz} height={sz} rx={2} fill={mixHex(CREAM, "#FFFBEA", fl)} opacity={Math.min(1, lit + fl)} />
          </g>
        );
      })}
    </g>
  );
};

// ------------------------------------------------------------------ the lever on a night ledge, Lev on the knob
export const NightLedge: React.FC<{ x0: number; x1: number; ground: number }> = ({ x0, x1, ground }) => {
  const M = SUPPOSE.moss;
  return (
    <g>
      <path d={`M ${x0 - 20} 1110 L ${x0} ${ground + 20} Q ${x0 + 10} ${ground - 4} ${x0 + 50} ${ground - 6} L ${x1 - 50} ${ground - 8} Q ${x1} ${ground - 6} ${x1 + 10} ${ground + 30} L ${x1 + 30} 1110 Z`} fill={M.near} />
      <path d={`M ${x0 + 20} ${ground - 2} Q ${(x0 + x1) / 2} ${ground - 16} ${x1 - 10} ${ground - 6}`} stroke={M.bounce} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.8} />
    </g>
  );
};

/** Where Lev stands to hang on the lever knob (hands stay at most 182 units up). */
export const levOnLever = (piv: Pt, len: number, angle: number, levH: number, ground: number, scale = 1) => {
  const LS = levH / 170;
  const t0 = leverTip(0, 0, len, angle);
  const tip: Pt = [piv[0] + t0[0] * scale, piv[1] + t0[1] * scale];
  const feet = Math.min(ground - 4, tip[1] + 182 * LS);
  const hand: Pt = [48, (tip[1] - feet) / LS];
  return { x: tip[0] - 48 * LS, y: feet, hand };
};

// ------------------------------------------------------------------ the big clock
export const BigClock: React.FC<{ x: number; y: number; r: number; sec: number; readout?: string; glow?: number }> = ({ x, y, r, sec, readout, glow = 0 }) => {
  const ang = (deg: number, len: number): Pt => [x + Math.sin((deg * Math.PI) / 180) * len, y - Math.cos((deg * Math.PI) / 180) * len];
  const hr = ang(240, r * 0.5), mn = ang(0, r * 0.74), sc = ang(sec, r * 0.84), sb = ang(sec + 180, r * 0.18);
  return (
    <g>
      {glow > 0 ? <Bloom x={x} y={y} r={r * 2.2} color="#FFF6D6" strength={glow} /> : null}
      <circle cx={x + 8} cy={y + 12} r={r + 14} fill="#000" opacity={0.25} />
      <circle cx={x} cy={y} r={r + 14} fill={BRASS_DARK} />
      <circle cx={x} cy={y} r={r + 6} fill={BRASS} opacity={0.5} />
      <circle cx={x} cy={y} r={r} fill={CHALK} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = ang(i * 30, r * 0.86), b = ang(i * 30, r * (i % 3 === 0 ? 0.7 : 0.78));
        return <path key={i} d={`M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}`} stroke={INK} strokeWidth={i % 3 === 0 ? 8 : 4} strokeLinecap="round" />;
      })}
      <path d={`M ${x} ${y} L ${hr[0]} ${hr[1]}`} stroke={INK} strokeWidth={13} strokeLinecap="round" />
      <path d={`M ${x} ${y} L ${mn[0]} ${mn[1]}`} stroke={INK} strokeWidth={9} strokeLinecap="round" />
      <path d={`M ${sb[0]} ${sb[1]} L ${sc[0]} ${sc[1]}`} stroke={TERRA} strokeWidth={5} strokeLinecap="round" />
      <circle cx={x} cy={y} r={11} fill={TERRA} />
      {readout ? (
        <g>
          <rect x={x - 150} y={y + r + 34} width={300} height={84} rx={20} fill={INK} opacity={0.85} />
          <rect x={x - 150} y={y + r + 34} width={300} height={84} rx={20} fill="none" stroke={LIME} strokeOpacity={0.4} strokeWidth={2} />
          <text x={x} y={y + r + 96} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={60} fill={LIME}>{readout}</text>
        </g>
      ) : null}
    </g>
  );
};

// ------------------------------------------------------------------ a hanging sign that swings in
export const SwingSign: React.FC<{ x: number; y: number; w: number; h?: number; text: string; angle: number; drop: number; opacity?: number; part: "ropes" | "board" }> = ({ x, y, w, h = 110, text, angle, drop, opacity = 1, part }) => {
  const by = y + drop;
  const PY = -120;
  if (part === "ropes")
    return (
      <g opacity={opacity * 0.6} transform={`rotate(${angle} ${x} ${PY})`}>
        <path d={`M ${x - w * 0.32} ${PY} L ${x - w * 0.32} ${by}`} stroke={CHALK} strokeWidth={4} />
        <path d={`M ${x + w * 0.32} ${PY} L ${x + w * 0.32} ${by}`} stroke={CHALK} strokeWidth={4} />
      </g>
    );
  return (
    <g opacity={opacity} transform={`rotate(${angle} ${x} ${PY})`}>
      <rect x={x - w / 2 + 8} y={by + 10} width={w} height={h} rx={18} fill="#000" opacity={0.3} />
      <rect x={x - w / 2} y={by} width={w} height={h} rx={18} fill={TERRA} />
      <rect x={x - w / 2 + 10} y={by + 10} width={w - 20} height={h - 20} rx={12} fill="none" stroke={mixHex(TERRA, "#FFFFFF", 0.35)} strokeWidth={3} />
      <circle cx={x - w * 0.32} cy={by + 14} r={6} fill={BRASS} />
      <circle cx={x + w * 0.32} cy={by + 14} r={6} fill={BRASS} />
      <text x={x} y={by + h / 2 + 19} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={54} fill={CHALK}>{text}</text>
    </g>
  );
};

// ------------------------------------------------------------------ TV with a football and HALFTIME
export const TV: React.FC<{ x: number; y: number; w: number; t: number; f: number; k?: number; glow?: number }> = ({ x, y, w, t, f, k = 1, glow = 0.6 }) => {
  const h = w * 0.62;
  const sx = x - w / 2, sy = y - h / 2;
  const scr = "#CFE6C8";
  const bx = x + Math.sin(t / 9) * w * 0.18, by = y + h * 0.12 - Math.abs(Math.sin(t / 6)) * h * 0.18;
  const spin = t * 6;
  const flick = 0.92 + 0.08 * Math.sin(f * 0.9) * Math.sin(f * 0.37);
  return (
    <g transform={`translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})`}>
      <Bloom x={x} y={y} r={w * 0.9} color="#DFF5D0" strength={glow * flick} />
      <path d={`M ${x - 40} ${sy - 4} L ${x - 90} ${sy - 80} M ${x + 40} ${sy - 4} L ${x + 100} ${sy - 70}`} stroke={INK} strokeWidth={6} strokeLinecap="round" />
      <rect x={sx - 26} y={sy - 26} width={w + 52} height={h + 52} rx={30} fill={INK} />
      <rect x={sx - 26} y={sy - 26} width={w + 52} height={h + 52} rx={30} fill="none" stroke={TERRA_DK} strokeWidth={6} />
      <rect x={sx} y={sy} width={w} height={h} rx={16} fill={scr} opacity={flick} />
      {/* field stripes */}
      <rect x={sx} y={sy + h * 0.62} width={w} height={h * 0.38} fill={SUPPOSE.sage.mid} opacity={0.8} />
      {[0.2, 0.4, 0.6, 0.8].map((u) => <path key={u} d={`M ${sx + w * u} ${sy + h * 0.62} L ${sx + w * (u + (u - 0.5) * 0.4)} ${sy + h}`} stroke={CHALK} strokeWidth={3} opacity={0.6} />)}
      <text x={x} y={sy + h * 0.24} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={w * 0.13} letterSpacing={4} fill={INK}>HALFTIME</text>
      <g transform={`translate(${bx} ${by}) rotate(${spin})`}>
        <ellipse cx={0} cy={0} rx={w * 0.09} ry={w * 0.055} fill={TERRA_DK} stroke={INK} strokeWidth={3} />
        <path d={`M ${-w * 0.035} 0 H ${w * 0.035}`} stroke={CHALK} strokeWidth={3} />
        {[-2, -1, 0, 1, 2].map((i) => <path key={i} d={`M ${i * w * 0.013} -6 V 6`} stroke={CHALK} strokeWidth={2.5} />)}
      </g>
      <rect x={x - 60} y={sy + h + 26} width={120} height={22} rx={8} fill={INK} />
    </g>
  );
};

// ------------------------------------------------------------------ the water-use chart (no numbers: axes only)
export const WATER_LINE = (u: number, spike: number) => {
  // gentle wiggle, a dip in the middle (people watching), then the halftime spike near the end
  const base = 0.35 + Math.sin(u * 23) * 0.025 + Math.sin(u * 61 + 1) * 0.015 - 0.08 * Math.exp(-(((u - 0.55) / 0.12) ** 2));
  const sp = spike * 0.55 * Math.exp(-(((u - 0.86) / 0.035) ** 2));
  return base + sp;
};
export const UseChart: React.FC<{ x: number; y: number; w: number; h: number; draw: number; spike: number; dark?: boolean; label?: boolean }> = ({ x, y, w, h, draw, spike, dark = true, label = true }) => {
  const n = 120;
  const pts: Pt[] = Array.from({ length: n + 1 }, (_, i) => {
    const u = i / n;
    return [x + 30 + u * (w - 60), y + h - 30 - WATER_LINE(u, spike) * (h - 70)];
  });
  const { d, head } = partial(pts, draw);
  const col = dark ? WATER_LT : WATER_DK;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={26} fill={INK} opacity={dark ? 0.8 : 0.12} />
      <path d={`M ${x + 30} ${y + 30} V ${y + h - 30} H ${x + w - 30}`} stroke={dark ? CHALK : INK} strokeWidth={4} fill="none" opacity={0.5} strokeLinecap="round" />
      {label ? <text x={x + 46} y={y + 54} fontFamily={ST_FONT} fontWeight={800} fontSize={22} letterSpacing={3} fill={dark ? CHALK : INK} opacity={0.7}>WATER USE</text> : null}
      <path d={d} stroke={col} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {draw > 0.002 && draw < 0.999 ? (
        <g>
          <circle cx={head[0]} cy={head[1]} r={11} fill={col} />
          <circle cx={head[0]} cy={head[1]} r={22} fill="none" stroke={col} strokeWidth={2} opacity={0.4} />
        </g>
      ) : null}
    </g>
  );
};

// ------------------------------------------------------------------ stopwatch and clipboard
export const Stopwatch: React.FC<{ x: number; y: number; r: number; a: number; k?: number }> = ({ x, y, r, a, k = 1 }) => {
  const hx = x + Math.sin((a * Math.PI) / 180) * r * 0.78, hy = y - Math.cos((a * Math.PI) / 180) * r * 0.78;
  return (
    <g transform={`translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})`}>
      <rect x={x - 18} y={y - r - 40} width={36} height={30} rx={8} fill={TERRA} />
      <rect x={x - 34} y={y - r - 52} width={68} height={18} rx={9} fill={TERRA_DK} />
      <circle cx={x + 6} cy={y + 8} r={r + 12} fill="#000" opacity={0.25} />
      <circle cx={x} cy={y} r={r + 12} fill={INK} />
      <circle cx={x} cy={y} r={r} fill={CHALK} />
      {Array.from({ length: 12 }, (_, i) => {
        const s = Math.sin((i * 30 * Math.PI) / 180), c = Math.cos((i * 30 * Math.PI) / 180);
        return <path key={i} d={`M ${x + s * r * 0.86} ${y - c * r * 0.86} L ${x + s * r * 0.74} ${y - c * r * 0.74}`} stroke={INK} strokeWidth={4} strokeLinecap="round" />;
      })}
      <path d={`M ${x} ${y} L ${hx} ${hy}`} stroke={TERRA} strokeWidth={7} strokeLinecap="round" />
      <circle cx={x} cy={y} r={9} fill={TERRA} />
    </g>
  );
};

export const Clipboard: React.FC<{ x: number; y: number; w: number; checks: number; k?: number; tilt?: number }> = ({ x, y, w, checks, k = 1, tilt = 0 }) => {
  const h = w * 1.3;
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${k}) translate(${-x} ${-y})`}>
      <rect x={x - w / 2 + 8} y={y - h / 2 + 12} width={w} height={h} rx={20} fill="#000" opacity={0.28} />
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={20} fill={TERRA_DK} />
      <rect x={x - w / 2 + 20} y={y - h / 2 + 34} width={w - 40} height={h - 54} rx={8} fill={CREAM} />
      <rect x={x - 60} y={y - h / 2 - 14} width={120} height={46} rx={12} fill={BRASS} stroke={BRASS_DARK} strokeWidth={4} />
      <text x={x} y={y - h / 2 + 96} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={w * 0.11} fill={INK}>WATER DEPT</text>
      {[0, 1, 2].map((i) => {
        const ry = y - h / 2 + 160 + i * 70;
        const c = clamp01(checks - i);
        return (
          <g key={i}>
            <rect x={x - w / 2 + 50} y={ry - 22} width={34} height={34} rx={6} fill="none" stroke={INK} strokeWidth={4} />
            <path d={`M ${x - w / 2 + 104} ${ry - 4} H ${x + w / 2 - 50}`} stroke={INK} strokeWidth={6} strokeLinecap="round" opacity={0.3} />
            {c > 0 ? <path d={partial([[x - w / 2 + 56, ry - 6], [x - w / 2 + 66, ry + 6], [x - w / 2 + 90, ry - 30]], c).d} stroke={TERRA} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
          </g>
        );
      })}
    </g>
  );
};

// ------------------------------------------------------------------ montage panels (C-03): home, office tower, school
export const Building: React.FC<{ kind: "home" | "tower" | "school"; x: number; base: number; k: number }> = ({ kind, x, base, k }) => {
  if (k <= 0.001) return null;
  const S = SUPPOSE.sage;
  const wall = kind === "tower" ? mixHex(S.far, INK, 0.15) : kind === "school" ? "#E7DCC3" : CHALK;
  const w = kind === "tower" ? 200 : kind === "school" ? 340 : 240;
  const h = kind === "tower" ? 520 : kind === "school" ? 230 : 210;
  const win = (wx: number, wy: number, ww: number, wh: number, key: string) => <rect key={key} x={wx} y={wy} width={ww} height={wh} rx={5} fill={INK} opacity={0.35} />;
  return (
    <g transform={`translate(${x} ${base}) scale(${k}) translate(${-x} ${-base})`}>
      <GroundShadow x={x} y={base} rx={w * 0.65} opacity={0.2} />
      <rect x={x - w / 2} y={base - h} width={w} height={h} fill={wall} stroke={INK} strokeWidth={3} />
      <rect x={x + w * 0.22} y={base - h} width={w * 0.28} height={h} fill={INK} opacity={0.07} />
      {kind === "home" ? (
        <g>
          <path d={`M ${x - w / 2 - 18} ${base - h + 4} L ${x} ${base - h - 120} L ${x + w / 2 + 18} ${base - h + 4} Z`} fill={TERRA} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
          {win(x - 90, base - 160, 50, 54, "a")}
          {win(x + 40, base - 160, 50, 54, "b")}
          <rect x={x - 24} y={base - 86} width={48} height={86} rx={8} fill={TERRA_DK} />
        </g>
      ) : kind === "tower" ? (
        <g>
          {Array.from({ length: 10 }, (_, r) => [0, 1, 2].map((c) => win(x - 76 + c * 56, base - h + 26 + r * 48, 40, 28, `${r}-${c}`)))}
          <rect x={x - 30} y={base - h - 40} width={60} height={40} fill={wall} stroke={INK} strokeWidth={3} />
        </g>
      ) : (
        <g>
          <path d={`M ${x - w / 2 - 12} ${base - h} H ${x + w / 2 + 12} L ${x + w / 2 - 20} ${base - h - 40} H ${x - w / 2 + 20} Z`} fill={TERRA} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
          <path d={`M ${x} ${base - h - 40} V ${base - h - 130}`} stroke={INK} strokeWidth={5} />
          <path d={`M ${x} ${base - h - 130} L ${x + 50} ${base - h - 116} L ${x} ${base - h - 102} Z`} fill={TERRA} />
          {[0, 1, 2, 3].map((c) => win(x - 140 + c * 76, base - 180, 52, 50, `s${c}`))}
          <rect x={x - 30} y={base - 96} width={60} height={96} rx={8} fill={TERRA_DK} />
        </g>
      )}
    </g>
  );
};

// ------------------------------------------------------------------ a chapter beat (rung lights, title slides in), scaled by d
export const ChapterBeat: React.FC<{
  t: number; d: number; f: number; fam: SupposeFamily; prev: number; next: number; eyebrow: string; title: string;
  before?: CounterSpec; after: CounterSpec;
}> = ({ t, d, f, fam, prev, next, eyebrow, title, before, after }) => {
  const F = SUPPOSE[fam];
  const top = 270, bottom = 990, lx = 1420, ground = 1000;
  const litAt = d * 0.36;
  const climb = ease(t, d * 0.1, litAt);
  const lit = t < litAt ? prev : next;
  const glow = t < litAt ? 0.6 : 0.6 + 1.4 * Math.max(0, 1 - (t - litAt) / 20);
  const yPrev = prev < 0 ? ground - 4 : rungY(top, bottom, prev, LADDER_RUNGS.length);
  const yNext = rungY(top, bottom, next, LADDER_RUNGS.length);
  const levY = mix(yPrev, yNext, climb) - Math.sin(climb * Math.PI * 2) * 10;
  const slide = ease(t, 0, d * 0.18);
  const tx = mix(-1100, 150, slide);
  const ul = ease(t, d * 0.2, d * 0.5);
  const cloudX = t * 1.6;
  const popping = t >= litAt && t < litAt + 14;
  const locked = t >= litAt + 14 ? after : t < litAt ? before : undefined;
  const handsUp = prev < 0 && climb < 0.02;
  return (
    <ShotStage fam={fam} t={t} f={f} counter={locked}>
      <Bloom x={420} y={260} r={700} color={F.light} strength={0.55} spread={0.5} />
      {!F.dark ? (
        <>
          <Cumulus x={820 - cloudX} y={300} w={320} h={116} fill={CHALK} shade={CHALK_SHADE} lit={F.light} seed={3} frame={f} opacity={0.85} />
          <Cumulus x={330 - cloudX * 0.7} y={190} w={240} h={90} fill={CHALK} shade={CHALK_SHADE} lit={F.light} seed={8} frame={f} opacity={0.75} />
        </>
      ) : null}
      <path d={smoothPath([[-60, 1000], [400, 980], [900, 995], [1400, 985], [1980, 1000]]) + " L 1980 1120 L -60 1120 Z"} fill={F.mid} />
      <path d={smoothPath([[-60, 1040], [600, 1028], [1300, 1040], [1980, 1032]]) + " L 1980 1120 L -60 1120 Z"} fill={F.near} />
      <BigLadder x={lx} top={top} bottom={bottom} width={130} lit={lit} glow={glow} frame={f} light={!F.dark} rungs={LADDER_RUNGS} font={26} thick={9} />
      <Lev x={lx - 8} y={levY} h={140} frame={f} pose={handsUp ? "stand" : "pull"} hands={handsUp ? undefined : { front: [22, -178], back: [12, -168] }} eyes={t > litAt + 4 ? "happy" : "up"} tilt={-6} wind={0.5} outline={F.dark ? undefined : INK} />
      <g transform={`translate(${tx} 0)`}>
        <text x={0} y={470} fontFamily={ST_FONT} fontWeight={900} fontSize={34} letterSpacing={6} fill={F.dim}>{eyebrow}</text>
        <text x={0} y={600} fontFamily={ST_FONT} fontWeight={900} fontSize={110} fill={F.text}>{title}</text>
        <path d={`M 4 636 L ${4 + 620 * ul} 636`} stroke={TERRA} strokeWidth={12} strokeLinecap="round" opacity={ul > 0 ? 1 : 0} />
      </g>
      {popping ? <PopCounter {...after} k={pop(t, litAt, 12)} /> : null}
    </ShotStage>
  );
};

export { BigLadder, rungY, lin, rrect };
