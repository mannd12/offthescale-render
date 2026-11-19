// L17 movers (BUILD.md §0, §5): the things that keep every shot alive at the probe's 0.5-s / 96×54 steps (an edge must
// travel ≥ ~1.5 px/frame). Pure functions of the frame, deterministic, sprite counts capped (ART-PROCESS §4b ≤ ~150).
// USAGE (f = the shot's frame)
//   <Seep f x y w h n?=24 (≤ 60) speed?=18 (16-20 px/f) len?=70 color? drip?=true seed? />
//       thin silver streaks running DOWN a wall or pipe face (the tunnel's mover), a drop at each head
//   <Rain f x? y? w? h? n?=70 (≤ 90) speed?=26 slope?=0.18 thin?={0..1: 1 = gone, the 2-11 thinning} color? pale?={0..1} seed? />
//   <Flakes f x y w h n?=50 (≤ 80) speed?=13 (10-16 px/f, with a sway) color? pile?={{ x, y, w, grow 0..1 }} seed? />
//       paint flakes (4-06, 4-09) or rust scale; the pile mound at the feet grows with `grow`
//   <DotStream f from={[x,y]} to={[x,y]} n?=40 (≤ 100) speed?=16 (14-18 px/f) spread?=40 color size? gravity?={0|1} seed? />
//       dots along a vector (calcium 6-04, CO2 7-08, grit 7-03). gravity 1 = MOON DUST: each dot falls STRAIGHT DOWN
//       from the `from` band to the `to` y and settles; no sideways motion ever (F6: moon dust never blows)
//   crackPath(seed, length, branches?) → { main: Pt[], branches: Pt[][], total } a deterministic branching crack, local coords
//       from (0,0) heading +x; <CrackDraw x y rotate? seed length draw={0..1} widen?={0..1} color width? branches? head? />
//       draws by length (crackDrawFor(f, start, length, 50) gives the 0..1 for a 50-px/f head) with a glowing head;
//       `widen` opens the crack (the edges step apart and the gap darkens)
//   <FillFront f clip="svg path d of the cavity" x0 x1 bottom top level={0..1} color? surface? />
//       a rising liquid in a section (2-05 pit, 2-09 U-section): the fill rises from `bottom` to `top` by `level`, with
//       a rippling surface line (12 px/f) and a lit crest; only inside `clip`
//   <StarsTint f x? y? w? h? n?=80 speed?=13 (12-14 px/f) dir?={1|-1} seed? />   apricot and teal stars sliding (the
//       camera rising or panning in the dark); never grey-white
import React, { useId } from "react";
import { alpha, rnd, smoothPath, type Pt } from "../../lib/illustrated";
import { L17_COLORS, STAR_TINTS } from "./families";

const C = L17_COLORS;
const cl01 = (v: number) => Math.max(0, Math.min(1, v));
const sid = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, "");
const wrap = (v: number, m: number) => ((v % m) + m) % m;

export const Seep: React.FC<{ f: number; x: number; y: number; w: number; h: number; n?: number; speed?: number; len?: number; color?: string; drip?: boolean; seed?: number }> = ({
  f,
  x,
  y,
  w,
  h,
  n = 24,
  speed = 18,
  len = 70,
  color = "#CFE6EA",
  drip = true,
  seed = 1,
}) => (
  <g>
    {Array.from({ length: Math.min(60, n) }, (_, i) => {
      const sx = x + rnd(seed * 13 + i) * w;
      const v = speed * (0.85 + rnd(seed * 7 + i) * 0.3);
      const L = len * (0.7 + rnd(seed * 5 + i) * 0.6);
      const head = y + wrap(f * v + rnd(seed * 3 + i) * (h + L), h + L);
      const tail = Math.max(y, head - L);
      const hy = Math.min(head, y + h);
      if (hy <= tail) return null;
      const wob = Math.sin(head / 37 + i) * 3;
      return (
        <g key={i}>
          <line x1={sx} y1={tail} x2={sx + wob} y2={hy} stroke={color} strokeWidth={3.2} strokeLinecap="round" opacity={0.35} />
          <line x1={sx} y1={Math.max(tail, hy - L * 0.4)} x2={sx + wob} y2={hy} stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" opacity={0.75} />
          {drip && head <= y + h ? <circle cx={sx + wob} cy={hy + 3} r={4.5} fill={color} opacity={0.9} /> : null}
        </g>
      );
    })}
  </g>
);

export const Rain: React.FC<{ f: number; x?: number; y?: number; w?: number; h?: number; n?: number; speed?: number; slope?: number; thin?: number; color?: string; pale?: number; seed?: number }> = ({
  f,
  x = -100,
  y = -60,
  w = 2120,
  h = 1200,
  n = 70,
  speed = 26,
  slope = 0.18,
  thin = 0,
  color = "#CFEFF2",
  pale = 0,
  seed = 1,
}) => {
  const keep = Math.round(Math.min(90, n) * (1 - cl01(thin)));
  return (
    <g stroke={pale > 0 ? alpha("#FFFFFF", 0.4 + 0.4 * pale) : color} strokeLinecap="round">
      {Array.from({ length: keep }, (_, i) => {
        const L = 46 + rnd(seed * 11 + i) * 40;
        const v = speed * (0.9 + rnd(seed * 3 + i) * 0.25);
        const sy = y + wrap(f * v + rnd(seed * 5 + i) * h, h);
        const sx = x + wrap(rnd(seed * 7 + i) * w - (sy - y) * slope, w);
        return <line key={i} x1={sx} y1={sy} x2={sx - L * slope} y2={sy + L} strokeWidth={2 + rnd(i) * 1.5} opacity={0.45 + rnd(seed + i) * 0.35} />;
      })}
    </g>
  );
};

export const Flakes: React.FC<{ f: number; x: number; y: number; w: number; h: number; n?: number; speed?: number; color?: string; pile?: { x: number; y: number; w: number; grow: number }; seed?: number }> = ({
  f,
  x,
  y,
  w,
  h,
  n = 50,
  speed = 13,
  color = "#E8D9C0",
  pile,
  seed = 1,
}) => (
  <g>
    {pile ? (
      <path
        d={`M${pile.x - pile.w / 2} ${pile.y} Q${pile.x - pile.w * 0.2} ${pile.y - 90 * cl01(pile.grow) - 4} ${pile.x} ${pile.y - 110 * cl01(pile.grow) - 4} Q${pile.x + pile.w * 0.25} ${pile.y - 80 * cl01(pile.grow) - 4} ${pile.x + pile.w / 2} ${pile.y} Z`}
        fill={color}
        stroke={alpha("#5A3A20", 0.35)}
        strokeWidth={2}
      />
    ) : null}
    {Array.from({ length: Math.min(80, n) }, (_, i) => {
      const v = speed * (0.75 + rnd(seed * 3 + i) * 0.5);
      const fy = y + wrap(f * v + rnd(seed * 5 + i) * h, h);
      const fx = x + rnd(seed * 7 + i) * w + Math.sin(fy / 40 + i) * 18;
      const rot = f * (4 + rnd(i) * 6) + i * 40;
      const s = 7 + rnd(seed * 11 + i) * 8;
      const flip = Math.abs(Math.cos((rot * Math.PI) / 180));
      return (
        <g key={i} transform={`translate(${fx.toFixed(1)} ${fy.toFixed(1)}) rotate(${rot % 360}) scale(1 ${(0.3 + 0.7 * flip).toFixed(2)})`}>
          <path d={`M${-s} ${-s * 0.4} L${s * 0.6} ${-s * 0.6} L${s} ${s * 0.3} L${-s * 0.4} ${s * 0.5} Z`} fill={i % 3 ? color : mixFlake(color)} />
        </g>
      );
    })}
  </g>
);
const mixFlake = (c: string) => (c === "#E8D9C0" ? "#C9A27A" : alpha(c, 0.75));

export const DotStream: React.FC<{
  f: number;
  from: Pt;
  to: Pt;
  n?: number;
  speed?: number;
  spread?: number;
  color?: string;
  size?: number;
  gravity?: 0 | 1;
  seed?: number;
}> = ({ f, from, to, n = 40, speed = 16, spread = 40, color = "#F4EEDF", size = 6, gravity = 0, seed = 1 }) => {
  const N = Math.min(100, n);
  if (gravity === 1) {
    // moon dust: straight down, settle, no sideways motion (F6)
    const fall = Math.max(10, to[1] - from[1]);
    return (
      <g fill={color}>
        {Array.from({ length: N }, (_, i) => {
          const dx = (rnd(seed * 7 + i) - 0.5) * 2 * spread;
          const v = speed * (0.7 + rnd(seed * 3 + i) * 0.5);
          const life = fall / v + 14; // falls, then rests 14 f on the ground
          const age = wrap(f + rnd(seed * 5 + i) * life, life);
          const yy = Math.min(to[1], from[1] + age * v);
          const resting = yy >= to[1];
          return <circle key={i} cx={from[0] + dx} cy={yy} r={size * (0.6 + rnd(seed * 11 + i) * 0.6)} opacity={resting ? 0.5 * (1 - (age - fall / v) / 14) : 0.85} />;
        })}
      </g>
    );
  }
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const L = Math.max(1, Math.hypot(dx, dy));
  const ux = dx / L;
  const uy = dy / L;
  return (
    <g fill={color}>
      {Array.from({ length: N }, (_, i) => {
        const v = speed * (0.8 + rnd(seed * 3 + i) * 0.4);
        const s = wrap(f * v + rnd(seed * 5 + i) * L, L);
        const off = (rnd(seed * 7 + i) - 0.5) * 2 * spread * (0.4 + 0.6 * (s / L));
        const px = from[0] + ux * s - uy * off;
        const py = from[1] + uy * s + ux * off;
        const fade = Math.min(1, s / 40, (L - s) / 60);
        return <circle key={i} cx={px} cy={py} r={size * (0.6 + rnd(seed * 11 + i) * 0.7)} opacity={0.9 * Math.max(0, fade)} />;
      })}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// cracks
// ---------------------------------------------------------------------------------------------------------------
export const crackPath = (seed: number, length: number, branches = 3) => {
  const seg = 26;
  const nSeg = Math.max(2, Math.round(length / seg));
  const main: Pt[] = [[0, 0]];
  let a = 0;
  for (let i = 1; i <= nSeg; i++) {
    a += (rnd(seed * 17 + i) - 0.5) * 0.9;
    a *= 0.8;
    const [px, py] = main[i - 1];
    main.push([px + Math.cos(a) * seg, py + Math.sin(a) * seg]);
  }
  const br: Pt[][] = [];
  for (let b = 0; b < branches; b++) {
    const at = 2 + Math.floor(rnd(seed * 31 + b) * (nSeg - 3));
    const dir = rnd(seed * 37 + b) > 0.5 ? 1 : -1;
    let ba = dir * (0.6 + rnd(seed * 41 + b) * 0.5);
    const pts: Pt[] = [main[at]];
    const m = 3 + Math.floor(rnd(seed * 43 + b) * 4);
    for (let i = 1; i <= m; i++) {
      ba += (rnd(seed * 47 + b * 9 + i) - 0.5) * 0.6;
      const [px, py] = pts[i - 1];
      pts.push([px + Math.cos(ba) * seg * 0.8, py + Math.sin(ba) * seg * 0.8]);
    }
    br.push(pts);
  }
  return { main, branches: br, total: nSeg * seg };
};
/** Points along a polyline up to share k (0..1) of its length. */
const partial = (pts: Pt[], k: number): Pt[] => {
  if (k >= 1) return pts;
  if (k <= 0) return [pts[0]];
  const lens = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const total = lens.reduce((s, v) => s + v, 0);
  let left = total * k;
  const out: Pt[] = [pts[0]];
  for (let i = 0; i < lens.length; i++) {
    if (left >= lens[i]) {
      out.push(pts[i + 1]);
      left -= lens[i];
    } else {
      const t = left / lens[i];
      out.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t]);
      break;
    }
  }
  return out;
};
export const crackDrawFor = (f: number, start: number, length: number, speed = 50) => cl01(((f - start) * speed) / Math.max(1, length));

export const CrackDraw: React.FC<{
  x: number;
  y: number;
  rotate?: number;
  seed?: number;
  length: number;
  draw: number;
  widen?: number;
  color?: string;
  width?: number;
  branches?: number;
  head?: boolean;
  glow?: string;
}> = ({ x, y, rotate = 0, seed = 1, length, draw, widen = 0, color = "#14262E", width = 5, branches = 3, head = true, glow = C.saffronCore }) => {
  const { main, branches: br } = crackPath(seed, length, branches);
  const d = cl01(draw);
  const m = partial(main, d);
  const wv = cl01(widen);
  const gap = wv * 10;
  const tip = m[m.length - 1];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      {wv > 0 ? <path d={smoothPath(m, 0.3)} fill="none" stroke={alpha("#000000", 0.5)} strokeWidth={width + gap * 2.2} strokeLinecap="round" strokeLinejoin="round" /> : null}
      {gap > 0
        ? [-1, 1].map((s) => (
            <path key={s} d={smoothPath(m, 0.3)} fill="none" stroke={alpha("#FFFFFF", 0.35)} strokeWidth={2} transform={`translate(0 ${s * (gap + width / 2)})`} />
          ))
        : null}
      <path d={smoothPath(m, 0.3)} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
      {br.map((b, i) => {
        // a branch grows once the main head has passed its root (by share of the main crack)
        const rootK = main.indexOf(b[0]) / (main.length - 1);
        const k = cl01((d - rootK) / 0.25);
        if (k <= 0) return null;
        return <path key={i} d={smoothPath(partial(b, k), 0.3)} fill="none" stroke={color} strokeWidth={width * 0.6} strokeLinecap="round" strokeLinejoin="round" />;
      })}
      {head && d > 0 && d < 1 ? (
        <g>
          <circle cx={tip[0]} cy={tip[1]} r={width * 3.4} fill={glow} opacity={0.3} />
          <circle cx={tip[0]} cy={tip[1]} r={width * 1.2} fill={glow} />
        </g>
      ) : null}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// FillFront: a rising liquid inside a cavity
// ---------------------------------------------------------------------------------------------------------------
export const FillFront: React.FC<{ f: number; clip: string; x0: number; x1: number; bottom: number; top: number; level: number; color?: string; surface?: string }> = ({
  f,
  clip,
  x0,
  x1,
  bottom,
  top,
  level,
  color = C.water,
  surface = "#BFF0F2",
}) => {
  const id = "fill" + sid(useId());
  const yl = bottom - (bottom - top) * cl01(level);
  const pts: string[] = [];
  for (let px = x0 - 20; px <= x1 + 20; px += 24) pts.push(`${px} ${(yl + Math.sin(px / 46 - f * 0.26) * 5 + Math.sin(px / 19 + f * 0.4) * 2).toFixed(1)}`);
  const d = `M${x0 - 20} ${bottom + 40} L${pts.join(" L")} L${x1 + 20} ${bottom + 40} Z`;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <path d={clip} />
        </clipPath>
        <linearGradient id={id + "g"} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity={0.95} />
          <stop offset="1" stopColor={C.waterDeep} stopOpacity={1} />
        </linearGradient>
      </defs>
      <g clipPath={`url(#${id})`}>
        <path d={d} fill={`url(#${id}g)`} />
        <path d={`M${pts.join(" L")}`} fill="none" stroke={surface} strokeWidth={4} opacity={0.9} />
        {/* glints riding the surface */}
        {Array.from({ length: 6 }, (_, i) => {
          const gx = x0 + wrap(f * 12 + i * ((x1 - x0) / 6), x1 - x0);
          return <rect key={i} x={gx} y={yl + 8} width={34} height={4} rx={2} fill="#FFFFFF" opacity={0.4} />;
        })}
      </g>
    </g>
  );
};

export const StarsTint: React.FC<{ f: number; x?: number; y?: number; w?: number; h?: number; n?: number; speed?: number; dir?: 1 | -1; vertical?: boolean; seed?: number }> = ({
  f,
  x = 0,
  y = 0,
  w = 1920,
  h = 1080,
  n = 80,
  speed = 13,
  dir = 1,
  vertical = false,
  seed = 1,
}) => (
  <g>
    {Array.from({ length: Math.min(150, n) }, (_, i) => {
      const depth = 0.5 + rnd(seed * 3 + i) * 0.7;
      const shift = f * speed * depth * dir;
      const sx = vertical ? x + rnd(seed * 7 + i) * w : x + wrap(rnd(seed * 7 + i) * w - shift, w);
      const sy = vertical ? y + wrap(rnd(seed * 11 + i) * h + shift, h) : y + rnd(seed * 11 + i) * h;
      const r = 1.2 + depth * 1.6;
      const tw = 0.55 + 0.45 * Math.abs(Math.sin(f / (11 + (i % 5) * 4) + i));
      return (
        <g key={i} opacity={tw}>
          <circle cx={sx} cy={sy} r={r} fill={STAR_TINTS[i % STAR_TINTS.length]} />
          {r > 2.4 ? <circle cx={sx} cy={sy} r={r * 3} fill={STAR_TINTS[i % STAR_TINTS.length]} opacity={0.18} /> : null}
        </g>
      );
    })}
  </g>
);
