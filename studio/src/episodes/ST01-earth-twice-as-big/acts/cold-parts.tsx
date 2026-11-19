// ST01 cold open + rung 1: shared props and devices (ladder you can animate, chapter beat, cubes, balls, rocket, town).
// Pure functions of their props; nothing random except rnd(seed).
import React, { useId } from "react";
import { Bloom, GroundShadow } from "../../../lib/illustrated/light";
import { smoothPath, blobPts, rrect } from "../../../lib/illustrated/shapes";
import { rnd } from "../../../lib/illustrated/motion";
import { Cumulus } from "../../../lib/illustrated/props";
import { mixHex } from "../../../lib/illustrated/palette";
import { CHALK, CHALK_SHADE, INK, LIME, LIME_DEEP, OCEAN, ST_FONT, SUPPOSE, SupposeFamily, TERRA } from "../../../lib/suppose/palette";
import { Lev } from "../../../lib/suppose/lev";
import { Counter } from "../../../lib/suppose/devices";
import { ease, lin, mix, pop, ShotStage, CounterSpec } from "../shot";

export type Pt = [number, number];
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const closedPath = (pts: Pt[]) => smoothPath([...pts, pts[0], pts[1]]) + " Z";

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

/** independent segments drawn one after another (p 0..1 over all of them) */
export const drawSegs = (segs: [Pt, Pt][], p: number) => {
  const lens = segs.map(([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1]));
  const total = lens.reduce((a, b) => a + b, 0);
  let left = total * clamp01(p);
  const ds: string[] = [];
  let head: Pt | null = null;
  segs.forEach(([a, b], i) => {
    if (left <= 0) return;
    const k = Math.min(1, left / lens[i]);
    const e: Pt = [mix(a[0], b[0], k), mix(a[1], b[1], k)];
    ds.push(`M ${a[0]} ${a[1]} L ${e[0].toFixed(1)} ${e[1].toFixed(1)}`);
    if (k < 1) head = e;
    left -= lens[i];
  });
  return { d: ds.join(" "), head: head as Pt | null };
};

// ------------------------------------------------------------------ the animatable Ladder
export const RUNGS6 = ["×1", "×1.1", "×1.25", "×1.5", "×2", ""];
export const ladderStep = (top: number, bottom: number, n = 6) => (bottom - top) / (n + 0.5);
export const rungY = (top: number, bottom: number, i: number, n = 6) => bottom - ladderStep(top, bottom, n) * (i + 0.5);

export const BigLadder: React.FC<{
  x: number; top: number; bottom: number; width?: number; lit: number; glow?: number; labelK?: (i: number) => number;
  frame: number; light?: boolean; rungs?: string[]; thick?: number; font?: number;
}> = ({ x, top, bottom, width = 120, lit, glow = 1, labelK, frame, light = false, rungs = RUNGS6, thick = 10, font = 34 }) => {
  const n = rungs.length;
  const xl = x - width / 2, xr = x + width / 2;
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
      {rungs.map((r, i) => {
        const ry = rungY(top, bottom, i, n);
        const on = i <= lit;
        const cur = i === lit;
        const lk = labelK ? labelK(i) : 1;
        const lx = xl - 34;
        return (
          <g key={i}>
            {cur && glow > 0 ? <Bloom x={x} y={ry} r={width * 1.3} color={LIME} strength={glow * (0.55 + 0.15 * Math.sin(frame / 7))} /> : null}
            {light ? <path d={`M ${xl} ${ry} L ${xr} ${ry}`} stroke={INK} strokeWidth={thick + 4} strokeLinecap="round" opacity={on ? 0.25 : 0.12} /> : null}
            <path d={`M ${xl} ${ry} L ${xr} ${ry}`} stroke={on ? LIME : LIME_DEEP} strokeWidth={cur ? thick + 3 : thick - 1} strokeLinecap="round" opacity={on ? 1 : 0.45} />
            {r && lk > 0.01 ? (
              <g transform={`translate(${lx} ${ry}) scale(${lk})`}>
                {cur ? (
                  <>
                    <rect x={-r.length * font * 0.62 - 26} y={-font * 0.78} width={r.length * font * 0.62 + 40} height={font * 1.5} rx={font * 0.75} fill={INK} opacity={0.82} />
                    <text x={0} y={font * 0.36} textAnchor="end" fontFamily={ST_FONT} fontWeight={900} fontSize={font * 1.05} fill={LIME}>{r}</text>
                  </>
                ) : (
                  <text x={0} y={font * 0.36} textAnchor="end" fontFamily={ST_FONT} fontWeight={800} fontSize={font * 0.85} fill={light ? INK : CHALK} opacity={on ? 0.95 : 0.55}>{r}</text>
                )}
              </g>
            ) : null}
          </g>
        );
      })}
    </g>
  );
};

/** Counter that pops in (scale about its own centre) */
export const PopCounter: React.FC<CounterSpec & { k: number }> = ({ k, label, value, sub }) =>
  k <= 0.001 ? null : (
    <g transform={`translate(1725 155) scale(${k}) translate(-1725 -155)`} opacity={Math.min(1, k * 1.5)}>
      <Counter label={label} value={value} sub={sub} />
    </g>
  );

// ------------------------------------------------------------------ chapter beat (rung lights, title slides in)
export const ChapterBeat: React.FC<{
  t: number; d: number; f: number; fam: SupposeFamily; prev: number; next: number; eyebrow: string; title: string;
  before?: CounterSpec; after: CounterSpec;
}> = ({ t, d, f, fam, prev, next, eyebrow, title, before, after }) => {
  const F = SUPPOSE[fam];
  const top = 110, bottom = 1000, lx = 1400;
  const climb = ease(t, 14, 46);
  const litAt = 46;
  const lit = t < litAt ? prev : next;
  const glow = t < litAt ? 0.6 : 0.6 + 1.4 * Math.max(0, 1 - (t - litAt) / 20);
  const yPrev = rungY(top, bottom, prev), yNext = rungY(top, bottom, next);
  const levY = mix(yPrev, yNext, climb) - Math.sin(climb * Math.PI * 2) * 10;
  const slide = ease(t, 0, 22);
  const tx = mix(-1100, 150, slide);
  const ul = ease(t, 26, 70);
  const cloudX = (t * 1.6) % 2400;
  const popping = t >= litAt && t < litAt + 14;
  const locked = t >= litAt + 14 ? after : t < litAt ? before : undefined;
  return (
    <ShotStage fam={fam} t={t} f={f} counter={locked}>
      <Bloom x={420} y={260} r={700} color={F.light} strength={0.55} spread={0.5} />
      {!F.dark ? (
        <>
          <Cumulus x={1700 - cloudX} y={330} w={360} h={130} fill={CHALK} shade={CHALK_SHADE} lit={F.light} seed={3} frame={f} opacity={0.85} />
          <Cumulus x={2600 - cloudX} y={210} w={260} h={96} fill={CHALK} shade={CHALK_SHADE} lit={F.light} seed={8} frame={f} opacity={0.75} />
        </>
      ) : null}
      {/* ground */}
      <path d={smoothPath([[-60, 1000], [400, 980], [900, 995], [1400, 985], [1980, 1000]]) + " L 1980 1120 L -60 1120 Z"} fill={F.mid} />
      <path d={smoothPath([[-60, 1040], [600, 1028], [1300, 1040], [1980, 1032]]) + " L 1980 1120 L -60 1120 Z"} fill={F.near} />
      <BigLadder x={lx} top={top} bottom={bottom} width={130} lit={lit} glow={glow} frame={f} light={!F.dark} />
      <Lev x={lx - 8} y={levY} h={150} frame={f} pose="pull" hands={{ front: [22, -178], back: [12, -168] }} eyes={t > litAt + 4 ? "happy" : "up"} tilt={-6} wind={0.5} outline={F.dark ? undefined : INK} />
      {/* title */}
      <g transform={`translate(${tx} 0)`}>
        <text x={0} y={430} fontFamily={ST_FONT} fontWeight={900} fontSize={34} letterSpacing={6} fill={F.dim}>{eyebrow}</text>
        <text x={0} y={560} fontFamily={ST_FONT} fontWeight={900} fontSize={100} fill={F.text}>{title}</text>
        <path d={`M 4 592 L ${4 + 640 * ul} 592`} stroke={TERRA} strokeWidth={12} strokeLinecap="round" opacity={ul > 0 ? 1 : 0} />
      </g>
      {popping ? <PopCounter {...after} k={pop(t, litAt, 12)} /> : null}
    </ShotStage>
  );
};

// ------------------------------------------------------------------ the moss ledge (key art I)
export const Ledge: React.FC<{ ground: number; fam?: SupposeFamily }> = ({ ground, fam = "moss" }) => {
  const F = SUPPOSE[fam];
  return (
    <g>
      <path d={`M 1010 1100 L 1030 ${ground + 20} Q 1040 ${ground - 4} 1080 ${ground - 6} L 1560 ${ground - 10} Q 1610 ${ground - 8} 1620 ${ground + 30} L 1640 1100 Z`} fill={F.near} />
      <path d={`M 1040 ${ground - 2} Q 1300 ${ground - 16} 1600 ${ground - 6}`} stroke={F.bounce} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.8} />
      <path d={`M 1060 ${ground + 40} Q 1200 ${ground + 30} 1330 ${ground + 46} M 1180 ${ground + 110} Q 1330 ${ground + 96} 1480 ${ground + 112}`} stroke={F.mid} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.6} />
    </g>
  );
};

// ------------------------------------------------------------------ a fat down arrow
export const DownArrow: React.FC<{ x: number; y: number; len: number; w?: number; color: string; opacity?: number }> = ({ x, y, len, w = 14, color, opacity = 1 }) => (
  <g opacity={opacity}>
    <path d={`M ${x} ${y - len} L ${x} ${y - w * 1.6}`} stroke={color} strokeWidth={w} strokeLinecap="round" />
    <path d={`M ${x - w * 1.5} ${y - w * 2.2} L ${x} ${y} L ${x + w * 1.5} ${y - w * 2.2} Z`} fill={color} stroke={color} strokeWidth={w * 0.5} strokeLinejoin="round" />
  </g>
);

// ------------------------------------------------------------------ sugar cube (oblique: depth goes up-right)
export const CUBE_DX = 0.42, CUBE_DY = -0.3;
export const SugarCube: React.FC<{ x: number; y: number; a: number; sx?: number; sy?: number }> = ({ x, y, a, sx = 1, sy = 1 }) => {
  const dx = a * CUBE_DX, dy = a * CUBE_DY;
  const top = `M ${x} ${y - a} L ${x + a} ${y - a} L ${x + a + dx} ${y - a + dy} L ${x + dx} ${y - a + dy} Z`;
  const right = `M ${x + a} ${y} L ${x + a} ${y - a} L ${x + a + dx} ${y - a + dy} L ${x + a + dx} ${y + dy} Z`;
  return (
    <g transform={`translate(${x + a / 2} ${y}) scale(${sx} ${sy}) translate(${-x - a / 2} ${-y})`}>
      <rect x={x} y={y - a} width={a} height={a} fill={CHALK} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <path d={top} fill="#FFFFF4" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <path d={right} fill={CHALK_SHADE} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle key={i} cx={x + a * (0.18 + rnd(i * 3 + a) * 0.64)} cy={y - a * (0.15 + rnd(i * 7 + a) * 0.7)} r={a * 0.025} fill={CHALK_SHADE} />
      ))}
    </g>
  );
};
/** the 9 visible edges of a cube, in a pleasant drawing order */
export const cubeEdges = (x: number, y: number, a: number): [Pt, Pt][] => {
  const dx = a * CUBE_DX, dy = a * CUBE_DY;
  const A: Pt = [x, y], B: Pt = [x + a, y], C: Pt = [x + a, y - a], D: Pt = [x, y - a];
  const E: Pt = [x + dx, y - a + dy], G: Pt = [x + a + dx, y - a + dy], H: Pt = [x + a + dx, y + dy];
  return [[A, B], [B, C], [C, D], [D, A], [D, E], [E, G], [G, C], [G, H], [H, B]];
};

// ------------------------------------------------------------------ a lit ball
export const Ball: React.FC<{ cx: number; cy: number; r: number; fill?: string; dark?: string }> = ({ cx, cy, r, fill = TERRA, dark }) => {
  const id = "ball" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <g>
      <defs>
        <radialGradient id={id} cx="36%" cy="32%" r="72%">
          <stop offset={0} stopColor={mixHex(fill, "#FFFFFF", 0.35)} />
          <stop offset={0.55} stopColor={fill} />
          <stop offset={1} stopColor={dark ?? mixHex(fill, INK, 0.45)} />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id})`} />
    </g>
  );
};

// ------------------------------------------------------------------ a little rocket (chalk body, terracotta trim)
export const Rocket: React.FC<{ x: number; base: number; h: number; flame?: number; frame?: number }> = ({ x, base, h, flame = 0, frame = 0 }) => {
  const w = h * 0.3;
  const top = base - h;
  const fl = flame * (1 + 0.18 * Math.sin(frame * 1.7));
  return (
    <g>
      {flame > 0 ? (
        <g>
          <path d={`M ${x - w * 0.32} ${base - 4} Q ${x} ${base + h * 0.55 * fl} ${x + w * 0.32} ${base - 4} Z`} fill={TERRA} opacity={0.9} />
          <path d={`M ${x - w * 0.18} ${base - 4} Q ${x} ${base + h * 0.32 * fl} ${x + w * 0.18} ${base - 4} Z`} fill="#FFF6D6" />
        </g>
      ) : null}
      <path d={`M ${x - w / 2} ${base - h * 0.18} L ${x - w * 0.95} ${base} L ${x - w / 2} ${base} Z`} fill={TERRA} />
      <path d={`M ${x + w / 2} ${base - h * 0.18} L ${x + w * 0.95} ${base} L ${x + w / 2} ${base} Z`} fill={mixHex(TERRA, INK, 0.25)} />
      <path d={`M ${x - w / 2} ${base} L ${x - w / 2} ${top + h * 0.32} Q ${x - w / 2} ${top + h * 0.08} ${x} ${top} Q ${x + w / 2} ${top + h * 0.08} ${x + w / 2} ${top + h * 0.32} L ${x + w / 2} ${base} Z`} fill={CHALK} />
      <path d={`M ${x + w * 0.12} ${base} L ${x + w * 0.12} ${top + h * 0.3} Q ${x + w * 0.2} ${top + h * 0.1} ${x} ${top} Q ${x + w / 2} ${top + h * 0.08} ${x + w / 2} ${top + h * 0.32} L ${x + w / 2} ${base} Z`} fill={CHALK_SHADE} opacity={0.8} />
      <path d={`M ${x - w * 0.36} ${top + h * 0.2} Q ${x} ${top - 2} ${x + w * 0.36} ${top + h * 0.2} Z`} fill={TERRA} />
      <circle cx={x} cy={top + h * 0.42} r={w * 0.2} fill={OCEAN} stroke={INK} strokeWidth={3} />
      <circle cx={x - w * 0.06} cy={top + h * 0.4} r={w * 0.06} fill={CHALK} opacity={0.7} />
    </g>
  );
};

// ------------------------------------------------------------------ town pieces
export const House: React.FC<{ x: number; base: number; w: number; h: number; seed: number; wall?: string; roof?: string; glow?: boolean }> = ({ x, base, w, h, seed, wall, roof, glow }) => {
  const S = SUPPOSE.sage;
  const walls = [CHALK, S.sky[2], S.far, "#E7DCC3"];
  const wl = wall ?? walls[Math.floor(rnd(seed) * walls.length)];
  const rf = roof ?? (rnd(seed + 3) > 0.45 ? TERRA : mixHex(TERRA, INK, 0.3));
  const rh = h * (0.35 + rnd(seed + 5) * 0.2);
  const win = Math.max(1, Math.floor(w / 70));
  return (
    <g>
      <rect x={x} y={base - h} width={w} height={h} fill={wl} />
      <rect x={x + w * 0.72} y={base - h} width={w * 0.28} height={h} fill={INK} opacity={0.08} />
      <path d={`M ${x - 14} ${base - h + 4} L ${x + w / 2} ${base - h - rh} L ${x + w + 14} ${base - h + 4} Z`} fill={rf} strokeLinejoin="round" stroke={rf} strokeWidth={6} />
      {Array.from({ length: win }, (_, i) => (
        <rect key={i} x={x + ((i + 0.5) * w) / win - 15} y={base - h * 0.72} width={30} height={36} rx={5} fill={glow ? "#FFF6D6" : INK} opacity={glow ? 0.95 : 0.45} />
      ))}
      <rect x={x + w * 0.5 - 20} y={base - 66} width={40} height={66} rx={8} fill={mixHex(TERRA, INK, 0.4)} />
    </g>
  );
};

export const Tree: React.FC<{ x: number; y: number; h: number; seed?: number; frame?: number; k?: number; dark?: string; mid?: string }> = ({ x, y, h, seed = 1, frame = 0, k = 1, dark, mid }) => {
  if (k <= 0.001) return null;
  const S = SUPPOSE.sage;
  const sway = Math.sin(frame / 24 + seed) * 2.5;
  const cr = h * 0.34;
  return (
    <g transform={`translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})`}>
      <GroundShadow x={x} y={y} rx={cr * 0.9} opacity={0.18} blur={4} />
      <path d={`M ${x} ${y} L ${x} ${y - h * 0.45}`} stroke={mixHex(TERRA, INK, 0.55)} strokeWidth={h * 0.07} strokeLinecap="round" />
      <g transform={`rotate(${sway} ${x} ${y})`}>
        <path d={closedPath(blobPts(x, y - h + cr, cr, 9, seed, 0.12))} fill={dark ?? S.near} />
        <path d={closedPath(blobPts(x - cr * 0.18, y - h + cr * 0.9, cr * 0.72, 8, seed + 4, 0.12))} fill={mid ?? S.mid} />
        <circle cx={x - cr * 0.35} cy={y - h + cr * 0.6} r={cr * 0.2} fill={S.bounce} opacity={0.7} />
      </g>
    </g>
  );
};

/** wide rounded panel helper */
export const Panel: React.FC<{ x: number; y: number; w: number; h: number; r?: number; fill?: string; opacity?: number }> = ({ x, y, w, h, r = 22, fill = INK, opacity = 0.8 }) => (
  <path d={rrect(x, y, w, h, r)} fill={fill} opacity={opacity} />
);

export { clamp01, lin };
