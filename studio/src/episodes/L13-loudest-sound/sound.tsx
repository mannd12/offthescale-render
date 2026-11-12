// L13 sound movers (BUILD.md §5): the episode's MOVING SUBJECTS. Each one draws a defined, contrasty edge that travels
// ≥ 1.5 px/frame at 1080p with its defaults (the craft probe's alive rule: ≥ 20 px per 15 frames), and is a pure
// function of the frame. They carry no numbers except PassageCounter (≤ 7 passages, #6).
//   PressureWave  the flat line + wave (scroll, clip at the vacuum floor, steepen sine → sawtooth → one front)
//   Rings         expanding pressure rings (every ring in the storyboard)
//   ShockFront    the jagged saffron wall
//   GlobeL13      the 3/4-view schematic globe; GlobeRing a great-circle front on it; PassageCounter
//   Barograph     a drum recorder (drum, scrolling paper, pen); Strip the flat paper variant (petals, timelines)
// Proportions are schematic wherever a ring crosses a map or globe (F14).
import React, { useId } from "react";
import { Counter, Emissive, Family, IF2, LightWash, Pill, alpha, blobPts, circlePath, mixHex, rnd, roundPoly } from "../../lib/illustrated";
import { L13_COLORS, pillFill } from "./families";

type Pt = [number, number];
const TAU = Math.PI * 2;
const D2R = Math.PI / 180;
const poly = (pts: Pt[]) => "M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L");

// ---------------------------------------------------------------------------------------------------------------
// PressureWave
// ---------------------------------------------------------------------------------------------------------------

export type PressureWaveProps = {
  f: number;
  /** the flat line (atmospheric pressure) */
  y: number;
  x0?: number;
  x1?: number;
  /** px of swing either side of the line */
  amp: number;
  wavelength?: number;
  /** scroll in px/frame (default 6) */
  speed?: number;
  /** travel direction */
  dir?: 1 | -1;
  /** px offset of the pattern (places the single front when steepen → 1) */
  phase?: number;
  /** the vacuum line (drawn as a hard line); with `clip`, troughs flatten on it */
  floorY?: number;
  floorColor?: string;
  clip?: boolean;
  /** 0..1: 0 sine, 0.7 sawtooth (the crest leans forward, steep drop ahead of it), 1 only one period left: a front */
  steepen?: number;
  /** which period survives at steepen 1 (period 0 starts at x0 + phase at frame 0 and travels with the wave) */
  frontIndex?: number;
  color?: string;
  core?: string;
  width?: number;
  /** draw the wave as an Emissive (default true) */
  glow?: boolean;
  /** tints between the curve and the line: compressions above, rarefactions below */
  fillAbove?: string;
  fillBelow?: string;
  /** draw the flat reference line (default true) */
  line?: boolean;
  lineColor?: string;
  opacity?: number;
};

/** The wave's displacement (−1..1) at screen x: exported so scenes can hang things on the curve (a cork, a gauge tick). */
export const waveAt = (x: number, p: Pick<PressureWaveProps, "f" | "x0" | "x1" | "wavelength" | "speed" | "dir" | "phase" | "steepen" | "frontIndex">) => {
  const { f, x0 = 0, x1 = 1920, wavelength = 360, speed = 6, dir = 1, phase = 0, steepen = 0, frontIndex = 0 } = p;
  const xr = dir === 1 ? x : x0 + x1 - x;
  const theta = ((xr - x0 - phase - f * speed) / wavelength) * TAU;
  const k = (Math.min(steepen, 0.7) / 0.7) * 0.97;
  // Kepler-style distortion θ = E + k·sin E: crests lean forward, the drop ahead of them steepens to a front
  let E = theta;
  for (let i = 0; i < 8; i++) E = E - (E + k * Math.sin(E) - theta) / (1 + k * Math.cos(E));
  const s = Math.sin(E);
  const m = Math.max(0, Math.min(1, (steepen - 0.7) / 0.3));
  if (m <= 0) return s;
  const n = Math.floor(theta / TAU); // period index (boundaries sit on zero crossings, so the window is seamless)
  return n === frontIndex ? s : s * (1 - m);
};

export const PressureWave: React.FC<PressureWaveProps> = (p) => {
  const { y, x0 = 0, x1 = 1920, amp, floorY, floorColor = L13_COLORS.bone, clip = false, color = L13_COLORS.teal, core, width = 4, glow = true, fillAbove, fillBelow, line = true, lineColor, opacity = 1 } = p;
  const id = "pw" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const pts: Pt[] = [];
  for (let x = x0; x <= x1 + 0.1; x += 6) {
    let yy = y - amp * waveAt(x, p);
    if (clip && floorY !== undefined) yy = Math.min(yy, floorY);
    pts.push([x, yy]);
  }
  const d = poly(pts);
  const area = `${d} L${x1} ${y} L${x0} ${y} Z`;
  return (
    <g opacity={opacity}>
      <defs>
        <clipPath id={`${id}a`}>
          <rect x={x0} y={-2000} width={x1 - x0} height={2000 + y} />
        </clipPath>
        <clipPath id={`${id}b`}>
          <rect x={x0} y={y} width={x1 - x0} height={4000} />
        </clipPath>
      </defs>
      {fillAbove ? <path d={area} fill={fillAbove} clipPath={`url(#${id}a)`} /> : null}
      {fillBelow ? <path d={area} fill={fillBelow} clipPath={`url(#${id}b)`} /> : null}
      {line ? <line x1={x0} y1={y} x2={x1} y2={y} stroke={lineColor ?? alpha(L13_COLORS.bone, 0.45)} strokeWidth={2} strokeDasharray="10 8" /> : null}
      {floorY !== undefined ? <line x1={x0} y1={floorY} x2={x1} y2={floorY} stroke={floorColor} strokeWidth={4} /> : null}
      {glow ? <Emissive d={d} color={color} core={core ?? mixHex(color, "#FFFFFF", 0.55)} width={width} glow={16} /> : <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinejoin="round" />}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Rings
// ---------------------------------------------------------------------------------------------------------------

export type RingsProps = {
  f: number;
  cx: number;
  cy: number;
  /** frames between launches (default 40) */
  period?: number;
  /** px/frame of radius growth (default 6, keep ≥ 4) */
  speed?: number;
  maxR?: number;
  width?: number;
  color?: string;
  core?: string;
  /** opacity falls with radius (default true) */
  fade?: boolean;
  /** ry/rx: < 1 lays the rings on a ground plane */
  squash?: number;
  /** [start, end] in degrees (screen: 0 = +x, 90 = down): a front entering from one side */
  arc?: [number, number];
  /** frame of the first launch (default 0); before it, nothing */
  start?: number;
  /** stop after this many rings (default: forever) */
  count?: number;
  glow?: boolean;
  opacity?: number;
  /** per-ring radius → extra opacity (e.g. fade before arriving, 8-13) */
  ringOpacity?: (r: number, k: number) => number;
};

/** Radius of a ring launched at `launch`, at frame f (negative before launch). */
export const ringRadius = (f: number, launch: number, speed = 6) => (f - launch) * speed;

const ellipsePath = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number) => {
  const n = Math.max(12, Math.ceil(((a1 - a0) / 360) * 96));
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const a = (a0 + ((a1 - a0) * i) / n) * D2R;
    pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
  }
  return poly(pts);
};

export const Rings: React.FC<RingsProps> = ({ f, cx, cy, period = 40, speed = 6, maxR = 1400, width = 4, color = L13_COLORS.saffron, core, fade = true, squash = 1, arc, start = 0, count, glow = true, opacity = 1, ringOpacity }) => {
  if (f < start) return null;
  const launched = Math.floor((f - start) / period) + 1;
  const first = Math.max(0, launched - Math.ceil(maxR / speed / period) - 1);
  const last = count !== undefined ? Math.min(launched, count) : launched;
  const out: React.ReactNode[] = [];
  for (let k = first; k < last; k++) {
    const r = ringRadius(f, start + k * period, speed);
    if (r <= 0 || r > maxR) continue;
    const o = (fade ? Math.pow(1 - r / maxR, 0.7) : 1) * Math.min(1, r / 30) * (ringOpacity ? ringOpacity(r, k) : 1);
    if (o <= 0.01) continue;
    const d = !arc && squash === 1 ? circlePath(cx, cy, r) : ellipsePath(cx, cy, r, r * squash, arc ? arc[0] : 0, arc ? arc[1] : 360);
    const w = width * (0.6 + 0.4 * (1 - r / maxR));
    out.push(glow ? <Emissive key={k} d={d} color={color} core={core ?? mixHex(color, "#FFFFFF", 0.5)} width={w} glow={16} opacity={o} /> : <path key={k} d={d} fill="none" stroke={color} strokeWidth={w} opacity={o} />);
  }
  return <g opacity={opacity}>{out}</g>;
};

// ---------------------------------------------------------------------------------------------------------------
// ShockFront
// ---------------------------------------------------------------------------------------------------------------

export type ShockFrontProps = {
  f: number;
  /** the front's position (caller animates it: ~20 px/f for 3-14) */
  x: number;
  /** top of the wall (default 0) and its height (default 1080) */
  y?: number;
  height?: number;
  /** tooth size in px (default 46) */
  jag?: number;
  /** length of the glowing streak behind the front (default 360) */
  trail?: number;
  /** travel direction (the trail is drawn behind) */
  dir?: 1 | -1;
  color?: string;
  core?: string;
  /** a LightWash on whatever the front passes (default true) */
  wash?: boolean;
  seed?: number;
  opacity?: number;
};

export const ShockFront: React.FC<ShockFrontProps> = ({ f, x, y = 0, height = 1080, jag = 46, trail = 360, dir = 1, color = L13_COLORS.saffron, core = L13_COLORS.saffronCore, wash = true, seed = 1, opacity = 1 }) => {
  const id = "sf" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const n = Math.max(4, Math.round(height / jag));
  const tick = Math.floor(f / 3); // teeth re-break every 3 frames: the wall is never still
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const tooth = (i % 2 ? 1 : -0.4) * jag * 0.55;
    const jitter = (rnd(seed * 31 + i * 7 + tick * 13) - 0.5) * jag * 0.5;
    pts.push([x + dir * (tooth + jitter), y + (height * i) / n]);
  }
  const d = poly(pts);
  const back = x - dir * trail;
  const fill = `${d} L${back} ${y + height} L${back} ${y} Z`;
  return (
    <g opacity={opacity}>
      <defs>
        <linearGradient id={id} x1={dir === 1 ? 0 : 1} y1={0} x2={dir === 1 ? 1 : 0} y2={0}>
          <stop offset={0} stopColor={color} stopOpacity={0} />
          <stop offset={0.75} stopColor={color} stopOpacity={0.32} />
          <stop offset={1} stopColor={color} stopOpacity={0.6} />
        </linearGradient>
      </defs>
      {wash ? <LightWash x={x} y={y + height / 2} rx={trail * 1.1} ry={height * 0.62} color={color} strength={0.42} /> : null}
      <path d={fill} fill={`url(#${id})`} />
      {/* streaks inside the trail, sliding back from the front */}
      <g stroke={core} strokeLinecap="round" opacity={0.5}>
        {Array.from({ length: 9 }, (_, i) => {
          const yy = y + height * (0.06 + 0.88 * rnd(seed * 5 + i));
          const off = ((f * 9 + rnd(seed + i) * trail) % trail) * 0.9;
          const L = 40 + rnd(seed * 3 + i) * 90;
          const xa = x - dir * off;
          return <line key={i} x1={xa} y1={yy} x2={xa - dir * L} y2={yy} strokeWidth={3 + rnd(i) * 3} opacity={1 - off / trail} />;
        })}
      </g>
      <Emissive d={d} color={color} core={core} width={7} glow={32} strength={1.2} />
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Globe
// ---------------------------------------------------------------------------------------------------------------

/** A globe view: centre, radius, the longitude facing the viewer (deg, animate it ≥ 2 px/f at the centre: R·dλ) and
 *  the latitude of the view centre (tilt). */
export type GlobeView = { cx: number; cy: number; R: number; rot: number; tilt?: number };
type V3 = [number, number, number];
const vec = (lon: number, lat: number): V3 => [Math.cos(lat * D2R) * Math.cos(lon * D2R), Math.cos(lat * D2R) * Math.sin(lon * D2R), Math.sin(lat * D2R)];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V3): V3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};
const basis = (g: GlobeView) => {
  const l0 = g.rot;
  const p0 = g.tilt ?? 18;
  const c = vec(l0, p0);
  const e: V3 = [-Math.sin(l0 * D2R), Math.cos(l0 * D2R), 0];
  const n: V3 = [-Math.sin(p0 * D2R) * Math.cos(l0 * D2R), -Math.sin(p0 * D2R) * Math.sin(l0 * D2R), Math.cos(p0 * D2R)];
  return { c, e, n };
};
const projV = (g: GlobeView, b: ReturnType<typeof basis>, p: V3) => ({ x: g.cx + g.R * dot(p, b.e), y: g.cy - g.R * dot(p, b.n), z: dot(p, b.c) });

/** Screen position of a place on the globe; `visible` = on the near side. */
export const globePoint = (g: GlobeView, lon: number, lat: number) => projV(g, basis(g), vec(lon, lat));

/** Places the globe and the maps use (degrees). Positions only: no number from here goes on screen. */
export const SITES = {
  krakatoa: { lon: 105.42, lat: -6.1 }, // #7 (Strait of Sunda)
  krakatoaAntipode: { lon: -74.58, lat: 6.1 },
  batavia: { lon: 106.85, lat: -6.2 }, // #5
  rodriguez: { lon: 63.42, lat: -19.72 }, // #1
  perth: { lon: 115.86, lat: -31.95 }, // #4
  ceylon: { lon: 79.9, lat: 6.9 }, // #4
  tonga: { lon: -175.38, lat: -20.55 }, // #15 (Hunga)
  alaska: { lon: -150.0, lat: 61.2 }, // #15
} as const;

/** Schematic land masses (lon, lat, size in degrees, seed): blobs, not coastlines (F16 "SCHEMATIC" pill). */
const LAND: { lon: number; lat: number; r: number; sx: number; seed: number }[] = [
  { lon: 20, lat: 6, r: 30, sx: 0.8, seed: 3 }, // Africa
  { lon: 25, lat: -22, r: 16, sx: 0.8, seed: 5 },
  { lon: 85, lat: 48, r: 34, sx: 1.9, seed: 7 }, // Eurasia
  { lon: 20, lat: 52, r: 16, sx: 1.4, seed: 11 },
  { lon: 78, lat: 18, r: 11, sx: 0.8, seed: 13 }, // India
  { lon: 102, lat: 0, r: 7, sx: 1.6, seed: 17 }, // Sumatra / Java / Borneo, one schematic arc
  { lon: 134, lat: -25, r: 16, sx: 1.2, seed: 19 }, // Australia
  { lon: -100, lat: 45, r: 26, sx: 1.3, seed: 23 }, // North America
  { lon: -150, lat: 64, r: 9, sx: 1.4, seed: 29 }, // Alaska
  { lon: -60, lat: -14, r: 20, sx: 0.75, seed: 31 }, // South America
  { lon: 0, lat: -82, r: 12, sx: 6, seed: 37 }, // Antarctica
];

export type GlobeL13Props = GlobeView & {
  family?: Family;
  /** show the "SCHEMATIC" pill under the globe (F16, until real outlines are licensed) */
  schematic?: boolean;
  ocean?: string;
  land?: string;
  opacity?: number;
  children?: React.ReactNode;
};

/** The 3/4-view globe: teal oceans, ochre schematic land, gold key from 200°, petrol-teal fill from 20° (no grey night
 *  side). Children draw on top inside the disc clip (rings, pins). */
export const GlobeL13: React.FC<GlobeL13Props> = ({ cx, cy, R, rot, tilt = 18, family, schematic = true, ocean = "#1F8F8A", land = L13_COLORS.land, opacity = 1, children }) => {
  const id = "gl" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const g: GlobeView = { cx, cy, R, rot, tilt };
  const b = basis(g);
  const shapes = LAND.map((L, i) => {
    const ll = blobPts(L.lon, L.lat, L.r, 16, L.seed, 0.22).map(([lo, la]) => [L.lon + (lo - L.lon) * L.sx, Math.max(-89, Math.min(89, la))] as Pt);
    const pr = ll.map(([lo, la]) => projV(g, b, vec(lo, la)));
    if (!pr.some((q) => q.z > 0)) return null;
    // vertices behind the limb are pushed onto it, so a mass slides off the edge instead of popping
    const pts: Pt[] = pr.map((q) => {
      if (q.z > 0) return [q.x, q.y];
      const dx = q.x - cx;
      const dy = q.y - cy;
      const l = Math.hypot(dx, dy) || 1;
      return [cx + (dx / l) * R, cy + (dy / l) * R];
    });
    return <path key={i} d={roundPoly(pts, R * 0.03)} fill={land} />;
  });
  // lit and fill sides (screen directions of the two lights)
  const kx = Math.cos(200 * D2R);
  const ky = Math.sin(200 * D2R);
  const fx = Math.cos(20 * D2R);
  const fy = Math.sin(20 * D2R);
  return (
    <g opacity={opacity}>
      <defs>
        <clipPath id={`${id}c`}>
          <circle cx={cx} cy={cy} r={R} />
        </clipPath>
        <radialGradient id={`${id}k`} cx={0.5 + kx * 0.32} cy={0.5 + ky * 0.32} r={0.75}>
          <stop offset={0} stopColor={L13_COLORS.gold} stopOpacity={0.5} />
          <stop offset={0.55} stopColor={L13_COLORS.gold} stopOpacity={0.08} />
          <stop offset={1} stopColor={L13_COLORS.gold} stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${id}f`} cx={0.5 + fx * 0.36} cy={0.5 + fy * 0.36} r={0.7}>
          <stop offset={0} stopColor="#041C22" stopOpacity={0.05} />
          <stop offset={0.6} stopColor="#041C22" stopOpacity={0.32} />
          <stop offset={1} stopColor="#041C22" stopOpacity={0.5} />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={R * 1.06} fill={alpha(L13_COLORS.gold, 0.12)} filter="url(#soft-32)" />
      <g clipPath={`url(#${id}c)`}>
        <circle cx={cx} cy={cy} r={R} fill={ocean} />
        {/* latitude bands as faint hatch: they slide with the rotation too */}
        <g stroke={alpha("#E6F5EA", 0.12)} strokeWidth={2} fill="none">
          {[-60, -30, 0, 30, 60].map((la) => {
            const pts: Pt[] = [];
            for (let lo = -180; lo <= 180; lo += 6) {
              const q = projV(g, b, vec(lo, la));
              if (q.z > 0) pts.push([q.x, q.y]);
            }
            return pts.length > 1 ? <path key={la} d={poly(pts)} /> : null;
          })}
        </g>
        {shapes}
        {/* night side: a petrol shade from the fill direction, then the teal bounce on that rim */}
        <circle cx={cx} cy={cy} r={R} fill={`url(#${id}f)`} />
        <circle cx={cx} cy={cy} r={R} fill={`url(#${id}k)`} />
        {children}
      </g>
      {/* rims: gold toward the key, teal toward the fill */}
      <path d={ellipseArc(cx, cy, R, 200 - 70, 200 + 70)} fill="none" stroke={L13_COLORS.gold} strokeWidth={Math.max(3, R * 0.012)} strokeLinecap="round" opacity={0.9} />
      <path d={ellipseArc(cx, cy, R, 20 - 50, 20 + 50)} fill="none" stroke={L13_COLORS.teal} strokeWidth={Math.max(2.5, R * 0.01)} strokeLinecap="round" opacity={0.85} />
      {schematic ? <Pill x={cx} y={cy + R + 40} text="SCHEMATIC" fill={family ? pillFill(family) : alpha("#020A0E", 0.72)} color={family?.text ?? "#F4EEDF"} size={15} align="middle" /> : null}
    </g>
  );
};
const ellipseArc = (cx: number, cy: number, r: number, a0: number, a1: number) => ellipsePath(cx, cy, r, r, a0, a1);

export type GlobeRingProps = {
  globe: GlobeView;
  /** the source point (default Krakatoa) */
  src?: { lon: number; lat: number };
  /** angular distance from the source, 0..π (π = at the antipode) */
  d: number;
  color?: string;
  core?: string;
  width?: number;
  opacity?: number;
  /** a faint dashed line for the far-side half (default false) */
  back?: boolean;
};

/** A pressure front on the sphere: the small circle at angular distance `d` from `src`, foreshortened, near side solid. */
export const GlobeRing: React.FC<GlobeRingProps> = ({ globe: g, src = SITES.krakatoa, d, color = L13_COLORS.saffron, core, width = 5, opacity = 1, back = false }) => {
  if (d <= 0.002 || d >= Math.PI - 0.002) return null;
  const b = basis(g);
  const S = vec(src.lon, src.lat);
  const U = norm(Math.abs(S[2]) > 0.95 ? cross(S, [1, 0, 0]) : cross(S, [0, 0, 1]));
  const V = cross(S, U);
  const runs: Pt[][] = [];
  const hidden: Pt[][] = [];
  let cur: Pt[] = [];
  let curH: Pt[] = [];
  for (let i = 0; i <= 120; i++) {
    const t = (i / 120) * TAU;
    const p: V3 = [0, 1, 2].map((j) => Math.cos(d) * S[j] + Math.sin(d) * (Math.cos(t) * U[j] + Math.sin(t) * V[j])) as V3;
    const q = projV(g, b, p);
    if (q.z > 0) {
      cur.push([q.x, q.y]);
      if (curH.length > 1) hidden.push(curH);
      curH = [];
    } else {
      curH.push([q.x, q.y]);
      if (cur.length > 1) runs.push(cur);
      cur = [];
    }
  }
  if (cur.length > 1) runs.push(cur);
  if (curH.length > 1) hidden.push(curH);
  // join the run that wraps past t = 2π onto the first one
  if (runs.length > 1) {
    const a = runs[0];
    const z = runs[runs.length - 1];
    const fa = a[0];
    const lz = z[z.length - 1];
    if (Math.hypot(fa[0] - lz[0], fa[1] - lz[1]) < g.R * 0.08) {
      runs[0] = [...z, ...a];
      runs.pop();
    }
  }
  return (
    <g opacity={opacity}>
      {back ? hidden.map((h, i) => <path key={`h${i}`} d={poly(h)} fill="none" stroke={color} strokeWidth={width * 0.4} strokeDasharray="6 8" opacity={0.3} />) : null}
      {runs.map((r, i) => (
        <Emissive key={i} d={poly(r)} color={color} core={core ?? mixHex(color, "#FFFFFF", 0.5)} width={width} glow={16} />
      ))}
    </g>
  );
};

/**
 * The air wave's lap clock (#6): `p` = passages elapsed (0..7; one passage = source → antipode or back, so 7 passages =
 * 3½ laps). Returns the ring's angular distance, whether it is heading out (saffron) or back (teal), and the passage
 * number on screen (1..7).
 */
export const passageRing = (p: number) => {
  const q = Math.max(0, Math.min(7, p));
  const n = Math.min(6, Math.floor(q));
  const u = q - n;
  const outward = n % 2 === 0;
  return { d: outward ? u * Math.PI : (1 - u) * Math.PI, outward, passage: n + 1, color: outward ? L13_COLORS.saffron : L13_COLORS.bone };
};

/** The passage counter beside the globe: kicker + a rolling Counter (≤ 7, #6). */
export const PassageCounter: React.FC<{ x: number; y: number; n: number; family: Family; label?: string; size?: number; color?: string }> = ({ x, y, n, family: F, label = "PASSAGE", size = 72, color }) => (
  <g>
    <text x={x} y={y - size * 0.95} style={{ fontFamily: IF2.label, fontSize: size * 0.3, letterSpacing: size * 0.05, fill: F.dim }}>
      {label}
    </text>
    <Counter x={x} y={y} value={Math.max(0, Math.min(7, n))} max={9} digits={1} size={size} color={color ?? F.text} />
  </g>
);

// ---------------------------------------------------------------------------------------------------------------
// Barograph + Strip
// ---------------------------------------------------------------------------------------------------------------

/** A spike on the paper: `at` = the frame it passes the pen, `h` = relative height (1 = `scale` px). */
export type Spike = { at: number; h: number };

/** The Batavia gasworks table (#5, F7): nine excesses in one unit, drawn as relative heights with NO unit. */
export const BATAVIA_TABLE = [13, 20, 21, 22, 41, 41, 29, 63, 40] as const; // #5
/** Their clock times, in hours after 17:20 on the 26th (#5: 26th 17:20 · 27th 1:55, 2:38, 4:56, 5:43, 6:57, 9:42, 10:15, 11:05). */
export const BATAVIA_HOURS = [0, 8 + 35 / 60, 9 + 18 / 60, 11 + 36 / 60, 12 + 23 / 60, 13 + 37 / 60, 16 + 22 / 60, 16 + 55 / 60, 17 + 45 / 60] as const;
/** Batavia's nine spikes: first passes the pen at `at0`, spaced by the table's clock at `framesPerHour`. */
export const bataviaSpikes = (at0: number, framesPerHour = 12): Spike[] => BATAVIA_TABLE.map((v, i) => ({ at: at0 + BATAVIA_HOURS[i] * framesPerHour, h: v / 63 }));
/** A station's seven passages (#6), equal heights (schematic: no amplitude claimed), `gap` frames apart. */
export const passageBlips = (at0: number, gap = 22, n = 7, h = 0.8): Spike[] => Array.from({ length: n }, (_, i) => ({ at: at0 + i * gap, h }));

/** Pressure-wave blip shape: a sharp rise (3 frames), a fast fall and a shallow dip after it. */
const blip = (u: number) => (u < 0 ? 0 : u < 3 ? u / 3 : 1.25 * Math.exp(-(u - 3) / 5) - 0.25 * Math.exp(-(u - 3) / 14));
const traceAt = (tau: number, spikes: Spike[]) => spikes.reduce((s, k) => s + blip(tau - k.at) * k.h, 0);

export type StripProps = {
  f: number;
  x: number;
  y: number;
  w: number;
  h: number;
  /** paper speed, px/frame, right → left (default 3) */
  speed?: number;
  spikes: Spike[];
  /** px for a spike of h = 1 (default 0.4 h) */
  scale?: number;
  /** the pen's position along the strip (0..1, default 0.78) */
  penAt?: number;
  /** frame the paper started (nothing is drawn older than this) */
  start?: number;
  paper?: string;
  ink?: string;
  grid?: string;
  /** rotate the whole strip about (x, y) (degrees): the petals of 6-14 */
  rot?: number;
  showPen?: boolean;
  /** baseline wobble in px (default 1) */
  wobble?: number;
  opacity?: number;
};

export const Strip: React.FC<StripProps> = ({ f, x, y, w, h, speed = 3, spikes, scale, penAt = 0.78, start = -1e9, paper = "#F7EBCF", ink = "#1E3A44", grid = "#D9B98A", rot = 0, showPen = true, wobble = 1, opacity = 1 }) => {
  const id = "st" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const penX = x + w * penAt;
  const base = y + h * 0.66;
  const sc = scale ?? h * 0.4;
  const yAt = (tau: number) => base - sc * traceAt(tau, spikes) - wobble * (Math.sin(tau / 7) * 0.6 + Math.sin(tau / 17) * 0.4);
  const pts: Pt[] = [];
  for (let px = penX; px >= x; px -= 3) {
    const tau = f - (penX - px) / speed;
    if (tau < start) break;
    pts.push([px, yAt(tau)]);
  }
  const gap = 60;
  const off = (((penX - f * speed) % gap) + gap) % gap;
  const vlines: number[] = [];
  for (let gx = x + off; gx < x + w; gx += gap) vlines.push(gx);
  const penY = yAt(f);
  return (
    <g opacity={opacity} transform={rot ? `rotate(${rot} ${x} ${y})` : undefined}>
      <defs>
        <clipPath id={id}>
          <rect x={x} y={y} width={w} height={h} />
        </clipPath>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={paper} />
      <g clipPath={`url(#${id})`}>
        <g stroke={grid} strokeWidth={1.5}>
          {vlines.map((gx, i) => (
            <line key={i} x1={gx} y1={y} x2={gx} y2={y + h} strokeWidth={i % 4 === 0 ? 3 : 1.5} />
          ))}
          {[0.2, 0.43, 0.66, 0.88].map((k) => (
            <line key={k} x1={x} y1={y + h * k} x2={x + w} y2={y + h * k} opacity={0.7} />
          ))}
        </g>
        {pts.length > 1 ? <path d={poly(pts)} fill="none" stroke={ink} strokeWidth={Math.max(2.5, h * 0.025)} strokeLinejoin="round" strokeLinecap="round" /> : null}
      </g>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={mixHex(paper, "#000", 0.3)} strokeWidth={2} />
      {showPen ? (
        <g>
          <line x1={penX + w * 0.16} y1={y - h * 0.18} x2={penX} y2={penY} stroke={mixHex(ink, "#000", 0.2)} strokeWidth={Math.max(3, h * 0.03)} strokeLinecap="round" />
          <circle cx={penX + w * 0.16} cy={y - h * 0.18} r={Math.max(4, h * 0.04)} fill={mixHex(ink, "#000", 0.2)} />
          <circle cx={penX} cy={penY} r={Math.max(3.5, h * 0.03)} fill={P_INK_RED} />
        </g>
      ) : null}
    </g>
  );
};
const P_INK_RED = "#8E2A1C"; // the pen nib (dark ink-red, not vermilion)

export type BarographProps = Omit<StripProps, "rot" | "showPen"> & { family: Family; /** housing colour (default a brass-and-wood mix of the family) */ body?: string };

/** The drum recorder: two drums (supply right, take-up left) turning with the paper, a housing, the pen on its arm. */
export const Barograph: React.FC<BarographProps> = ({ family: F, body, ...s }) => {
  const { f, x, y, w, h, speed = 3, opacity = 1 } = s;
  const r = h * 0.5;
  const ang = ((f * speed) / r) * (180 / Math.PI);
  const housing = body ?? mixHex(F.second, "#3A2412", 0.45);
  const drum = (dx: number) => (
    <g transform={`rotate(${(-ang).toFixed(1)} ${dx} ${y + h / 2})`}>
      <circle cx={dx} cy={y + h / 2} r={r} fill={mixHex(housing, "#000", 0.25)} />
      <circle cx={dx} cy={y + h / 2} r={r * 0.82} fill="#F7EBCF" />
      {[0, 60, 120].map((a) => (
        <line key={a} x1={dx + Math.cos(a * D2R) * r * 0.8} y1={y + h / 2 + Math.sin(a * D2R) * r * 0.8} x2={dx - Math.cos(a * D2R) * r * 0.8} y2={y + h / 2 - Math.sin(a * D2R) * r * 0.8} stroke={mixHex(housing, "#000", 0.2)} strokeWidth={Math.max(3, r * 0.08)} />
      ))}
      <circle cx={dx} cy={y + h / 2} r={r * 0.18} fill={mixHex(housing, "#000", 0.4)} />
    </g>
  );
  return (
    <g opacity={opacity}>
      <rect x={x - r * 1.6} y={y + h * 0.88} width={w + r * 3.2} height={h * 0.42} rx={h * 0.08} fill={housing} />
      <rect x={x - r * 1.6} y={y + h * 0.88} width={w + r * 3.2} height={h * 0.08} fill={mixHex(housing, "#FFF", 0.2)} />
      {drum(x - r * 0.6)}
      {drum(x + w + r * 0.6)}
      <Strip {...s} />
    </g>
  );
};
