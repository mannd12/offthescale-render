// L16 large-area movers (BUILD.md §0, §5): the things that keep a shot ALIVE at the probe's 96×54 / 0.5-s steps. Each
// moves a sizeable, contrasty edge at ≥ ~1.5 px/f (most at 8-36 px/f). Deterministic in `f` (the shot's frame).
// Sprite budgets are hard caps (performance on the cloud runner): WindStreaks ≤ 90, Granules ≤ 150, ConvCells ≤ 120,
// Neutrinos ≤ 60.
// USAGE (f = the shot's frame)
//   <WindStreaks f mode="radial" cx cy r0? rMax? a0? a1? speed?=20 count?=60 len? width? seed? opacity? />
//        streaks fanning out from (cx, cy) between angles a0..a1 (deg, screen: 0 = right, 90 = down), gold → magenta
//   <WindStreaks f mode="sweep" angle?=0 box?={x,y,w,h} speed?=20 count? len? width? />   streaks crossing a box
//   <Granules f x y w h size?=64 drift?=5 boil?=1 seed? clip?={svg path d} colors? />  boiling cells in a band
//   <ConvCells f x? y? w? h? cell?=360 speed?=13 scroll?=0 blobs? seed? opacity? />   whole-frame rolling cells;
//        scroll = px/f the whole pattern slides UP (a camera descending: 6-09 wants 24)
//   <Neutrinos f cx cy speed?=36 count?=48 len?=140 rMax?=2300 seed? color? />   radiating streaks through everything
//   <Photon f x0 y0 x1 y1 speed?=28 step?=70 seed? loop? atoms? color? />    zigzag random walk drawn by a head
//        at `speed` px/f; atoms flash where it turns; `photonPath(...)` gives the vertices for builders
import React, { useId } from "react";
import { Bloom, alpha, mixHex, rnd, smoothPath, type Pt } from "../../lib/illustrated";
import { L16_COLORS } from "./families";

const C = L16_COLORS;
const D2R = Math.PI / 180;
const sid = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, "");
const mod = (a: number, n: number) => ((a % n) + n) % n;
const cl01 = (v: number) => Math.max(0, Math.min(1, v));

/** A tapered streak from (x0, y0) (thin tail) to (x1, y1) (round head of width w). */
const taper = (x0: number, y0: number, x1: number, y1: number, w: number) => {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const L = Math.hypot(dx, dy) || 1;
  const nx = (-dy / L) * (w / 2);
  const ny = (dx / L) * (w / 2);
  return `M${x0.toFixed(1)} ${y0.toFixed(1)} L${(x1 + nx).toFixed(1)} ${(y1 + ny).toFixed(1)} A${(w / 2).toFixed(1)} ${(w / 2).toFixed(1)} 0 0 0 ${(x1 - nx).toFixed(1)} ${(y1 - ny).toFixed(1)} Z`;
};

// ---------------------------------------------------------------------------------------------------------------
// WindStreaks
// ---------------------------------------------------------------------------------------------------------------
export const WindStreaks: React.FC<{
  f: number;
  mode?: "radial" | "sweep";
  /** radial origin */
  cx?: number;
  cy?: number;
  r0?: number;
  rMax?: number;
  a0?: number;
  a1?: number;
  /** sweep direction (deg) and box */
  angle?: number;
  box?: { x: number; y: number; w: number; h: number };
  speed?: number;
  count?: number;
  len?: number;
  width?: number;
  seed?: number;
  opacity?: number;
  /** colour ends (default gold → magenta) */
  from?: string;
  to?: string;
}> = ({ f, mode = "radial", cx = 0, cy = 0, r0 = 200, rMax = 2300, a0 = -90, a1 = 90, angle = 0, box = { x: 0, y: 0, w: 1920, h: 1080 }, speed = 20, count = 60, len = 160, width = 7, seed = 1, opacity = 0.85, from = C.gold, to = C.magenta }) => {
  const n = Math.min(90, Math.max(0, Math.round(count)));
  const out: React.ReactNode[] = [];
  if (mode === "radial") {
    const span = rMax - r0;
    for (let i = 0; i < n; i++) {
      const th = (a0 + (a1 - a0) * rnd(seed * 31 + i)) * D2R;
      const sp = speed * (0.75 + 0.5 * rnd(seed * 17 + i));
      const L = len * (0.6 + 0.8 * rnd(seed * 7 + i));
      const r = r0 + mod(rnd(seed * 5 + i) * span + f * sp, span);
      const u = (r - r0) / span;
      const o = Math.min(1, u * 6) * Math.min(1, (1 - u) * 4);
      const w = width * (0.6 + 0.8 * rnd(seed * 13 + i)) * (0.7 + 0.6 * u);
      const ct = Math.cos(th);
      const st = Math.sin(th);
      const rt = Math.max(r0, r - L);
      out.push(<path key={i} d={taper(cx + ct * rt, cy + st * rt, cx + ct * r, cy + st * r, w)} fill={mixHex(from, to, rnd(seed * 3 + i) * 0.9 + u * 0.1)} opacity={o} />);
    }
  } else {
    const ct = Math.cos(angle * D2R);
    const st = Math.sin(angle * D2R);
    // travel along (ct, st) across the box; lanes spread across the perpendicular
    const along = Math.abs(ct) * box.w + Math.abs(st) * box.h + len * 2;
    const across = Math.abs(st) * box.w + Math.abs(ct) * box.h;
    const mx = box.x + box.w / 2;
    const my = box.y + box.h / 2;
    for (let i = 0; i < n; i++) {
      const sp = speed * (0.75 + 0.5 * rnd(seed * 17 + i));
      const L = len * (0.6 + 0.8 * rnd(seed * 7 + i));
      const a = mod(rnd(seed * 5 + i) * along + f * sp, along) - along / 2;
      const b = (rnd(seed * 11 + i) - 0.5) * across;
      const hx = mx + ct * a - st * b;
      const hy = my + st * a + ct * b;
      const w = width * (0.6 + 0.8 * rnd(seed * 13 + i));
      out.push(<path key={i} d={taper(hx - ct * L, hy - st * L, hx, hy, w)} fill={mixHex(from, to, rnd(seed * 3 + i))} opacity={0.6 + 0.4 * rnd(seed * 19 + i)} />);
    }
  }
  return <g opacity={opacity}>{out}</g>;
};

// ---------------------------------------------------------------------------------------------------------------
// Granules: boiling cells (bright cell centres, dark lanes), two counter-sliding layers + pulsing cells
// ---------------------------------------------------------------------------------------------------------------
export const Granules: React.FC<{
  f: number;
  x: number;
  y: number;
  w: number;
  h: number;
  /** mean cell diameter (px) */
  size?: number;
  /** px/f the two layers counter-slide (each way) */
  drift?: number;
  /** 0..1 pulse strength */
  boil?: number;
  seed?: number;
  /** an SVG path the band is clipped to (e.g. the limb disc); default the box */
  clip?: string;
  /** lane (dark), cell, cell-centre colours */
  colors?: [string, string, string];
  opacity?: number;
}> = ({ f, x, y, w, h, size = 64, drift = 5, boil = 1, seed = 1, clip, colors = [C.tangerine, C.amber, C.gold], opacity = 1 }) => {
  const id = "gr" + sid(useId());
  // grid sized to the 150-sprite cap (two layers share it)
  let s = size;
  while ((Math.ceil(w / s) + 2) * (Math.ceil(h / (s * 0.86)) + 1) * 2 > 150) s *= 1.12;
  const cols = Math.ceil(w / s) + 2;
  const rows = Math.ceil(h / (s * 0.86)) + 1;
  const layer = (dir: 1 | -1, k: number) => {
    const shift = mod(f * drift * dir, s);
    const cells: React.ReactNode[] = [];
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const i = k * 1000 + r * cols + c;
        const cx = x + (c - 1) * s + (r % 2 ? s / 2 : 0) + shift + (rnd(seed * 7 + i) - 0.5) * s * 0.35;
        const cy = y + r * s * 0.86 + (rnd(seed * 11 + i) - 0.5) * s * 0.3;
        const ph = rnd(seed * 13 + i) * Math.PI * 2;
        const pr = 0.62 + 0.3 * boil * Math.sin(f / (9 + rnd(seed * 17 + i) * 6) + ph);
        const rr = (s / 2) * pr * (k ? 0.8 : 1);
        const pts: Pt[] = Array.from({ length: 6 }, (_, j) => {
          const a = (j / 6) * Math.PI * 2 + rnd(seed * 23 + i) * 0.6;
          const q = rr * (0.8 + 0.35 * rnd(seed * 29 + i * 6 + j));
          return [cx + Math.cos(a) * q, cy + Math.sin(a) * q];
        });
        const lit = 0.5 + 0.5 * Math.sin(f / 7 + ph);
        cells.push(<path key={i} d={smoothPath([...pts, pts[0]], 0.5) + " Z"} fill={mixHex(colors[1], colors[2], k ? lit : lit * 0.6)} opacity={k ? 0.7 : 1} />);
      }
    return cells;
  };
  return (
    <g opacity={opacity}>
      <defs>
        <clipPath id={id}>{clip ? <path d={clip} /> : <rect x={x} y={y} width={w} height={h} />}</clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <rect x={x} y={y} width={w} height={h} fill={colors[0]} />
        {layer(1, 0)}
        {layer(-1, 1)}
      </g>
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// ConvCells: whole-frame rolling convection cells (arrow loops + rising white-gold blobs)
// ---------------------------------------------------------------------------------------------------------------
export const ConvCells: React.FC<{
  f: number;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  cell?: number;
  /** px/f along the loops */
  speed?: number;
  /** px/f the pattern slides up (camera descending) */
  scroll?: number;
  blobs?: boolean;
  seed?: number;
  opacity?: number;
  /** cell fills alternate between these */
  fills?: [string, string];
}> = ({ f, x = 0, y = 0, w = 1920, h = 1080, cell = 360, speed = 13, scroll = 0, blobs = true, seed = 1, opacity = 1, fills = [C.tangerine, C.magenta] }) => {
  const id = "cc" + sid(useId());
  const cols = Math.ceil(w / cell) + 1;
  const rows = Math.ceil(h / cell) + 2;
  const sh = mod(f * scroll, cell * 2);
  const R = cell * 0.36;
  const om = speed / R; // rad/f along the loop
  const items: React.ReactNode[] = [];
  let sprites = 0;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const cx = x + c * cell + cell / 2;
      const cy = y + r * cell + cell / 2 - sh;
      if (cy < y - cell || cy > y + h + cell) continue;
      const dir = (c + r) % 2 ? 1 : -1; // neighbours counter-rotate (rising columns shared)
      const fill = fills[(c + r) % 2];
      items.push(
        <g key={"c" + i}>
          <rect x={cx - cell / 2} y={cy - cell / 2} width={cell} height={cell} fill={fill} />
          <circle cx={cx} cy={cy} r={cell * 0.46} fill={mixHex(fill, C.whiteGold, 0.18)} />
          <circle cx={cx} cy={cy} r={cell * 0.2} fill={mixHex(fill, "#3A0F58", 0.25)} />
        </g>,
      );
      // three arrow arcs riding the loop
      for (let k = 0; k < 3 && sprites < 120; k++, sprites++) {
        const a = dir * f * om + (k * Math.PI * 2) / 3 + rnd(seed + i);
        const a2 = a - dir * 0.9;
        const p = (t: number): Pt => [cx + Math.cos(t) * R, cy + Math.sin(t) * R];
        const [hx, hy] = p(a);
        const [tx, ty] = p(a2);
        const tang = a + (dir * Math.PI) / 2;
        items.push(
          <g key={"a" + i + k}>
            <path d={`M${tx.toFixed(1)} ${ty.toFixed(1)} A${R} ${R} 0 0 ${dir > 0 ? 1 : 0} ${hx.toFixed(1)} ${hy.toFixed(1)}`} fill="none" stroke={C.whiteGold} strokeWidth={cell * 0.045} strokeLinecap="round" opacity={0.85} />
            <path
              d={`M${(hx + Math.cos(tang) * cell * 0.06).toFixed(1)} ${(hy + Math.sin(tang) * cell * 0.06).toFixed(1)} L${(hx + Math.cos(tang + 2.5) * cell * 0.06).toFixed(1)} ${(hy + Math.sin(tang + 2.5) * cell * 0.06).toFixed(1)} L${(hx + Math.cos(tang - 2.5) * cell * 0.06).toFixed(1)} ${(hy + Math.sin(tang - 2.5) * cell * 0.06).toFixed(1)} Z`}
              fill={C.whiteGold}
            />
          </g>,
        );
      }
      // a rising white-gold blob in the column between cells (rises at `speed`, fades as it cools)
      if (blobs && c % 2 === 0 && sprites < 120) {
        sprites++;
        const bx = cx + cell / 2;
        const life = cell * 1.2;
        const u = mod(f * speed + rnd(seed * 9 + i) * life, life) / life;
        const by = cy + cell * 0.6 - u * life;
        items.push(<ellipse key={"b" + i} cx={bx} cy={by} rx={cell * 0.09 * (1.1 - u * 0.4)} ry={cell * 0.12 * (1.1 - u * 0.4)} fill={mixHex(C.whiteGold, fill, u * 0.7)} opacity={1 - u * 0.6} />);
      }
    }
  return (
    <g opacity={opacity}>
      <defs>
        <clipPath id={id}>
          <rect x={x} y={y} width={w} height={h} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>{items}</g>
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Neutrinos: thin fast streaks radiating from the core, passing through everything
// ---------------------------------------------------------------------------------------------------------------
export const Neutrinos: React.FC<{ f: number; cx: number; cy: number; speed?: number; count?: number; len?: number; r0?: number; rMax?: number; seed?: number; color?: string; width?: number; opacity?: number }> = ({
  f,
  cx,
  cy,
  speed = 36,
  count = 48,
  len = 140,
  r0 = 20,
  rMax = 2300,
  seed = 4,
  color = "#E8FBFF",
  width = 4,
  opacity = 0.9,
}) => {
  const n = Math.min(60, Math.max(0, Math.round(count)));
  const span = rMax - r0;
  return (
    <g opacity={opacity}>
      {Array.from({ length: n }, (_, i) => {
        const th = rnd(seed * 31 + i) * Math.PI * 2;
        const r = r0 + mod(rnd(seed * 5 + i) * span + f * speed, span);
        const ct = Math.cos(th);
        const st = Math.sin(th);
        const rt = Math.max(r0, r - len);
        const o = Math.min(1, (r - r0) / 80);
        return <path key={i} d={taper(cx + ct * rt, cy + st * rt, cx + ct * r, cy + st * r, width)} fill={i % 5 === 0 ? C.cyan : color} opacity={o} />;
      })}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Photon: a random walk drawn by a head, atoms flashing at each turn
// ---------------------------------------------------------------------------------------------------------------
/** Deterministic zigzag from (x0, y0) toward (x1, y1): steps of ≈ `step` px, each turned up to ±75° off the target
 *  bearing, ending exactly at (x1, y1). */
export const photonPath = (x0: number, y0: number, x1: number, y1: number, step = 70, seed = 1): Pt[] => {
  const pts: Pt[] = [[x0, y0]];
  let [px, py] = [x0, y0];
  for (let i = 0; i < 400; i++) {
    const d = Math.hypot(x1 - px, y1 - py);
    if (d < step * 1.2) break;
    const bear = Math.atan2(y1 - py, x1 - px);
    const turn = (rnd(seed * 37 + i) - 0.5) * 2.6;
    const L = step * (0.6 + 0.8 * rnd(seed * 41 + i));
    px += Math.cos(bear + turn) * L;
    py += Math.sin(bear + turn) * L;
    pts.push([px, py]);
  }
  pts.push([x1, y1]);
  return pts;
};

export const Photon: React.FC<{ f: number; x0: number; y0: number; x1: number; y1: number; speed?: number; step?: number; seed?: number; loop?: boolean; atoms?: boolean; color?: string; width?: number; trail?: number }> = ({
  f,
  x0,
  y0,
  x1,
  y1,
  speed = 28,
  step = 70,
  seed = 1,
  loop = true,
  atoms = true,
  color = C.whiteGold,
  width = 5,
  trail = 1400,
}) => {
  const pts = photonPath(x0, y0, x1, y1, step, seed);
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const total = seg.reduce((a, b) => a + b, 0);
  const d = loop ? mod(f * speed, total + 60) : Math.min(total, f * speed);
  // walk to distance d, keep the last `trail` px
  const drawn: Pt[] = [pts[0]];
  const hitAt: number[] = [0]; // distance at each vertex
  let acc = 0;
  let head: Pt = pts[0];
  for (let i = 0; i < seg.length; i++) {
    if (acc + seg[i] <= d) {
      acc += seg[i];
      drawn.push(pts[i + 1]);
      hitAt.push(acc);
      head = pts[i + 1];
    } else {
      const u = (d - acc) / seg[i];
      head = [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * u, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * u];
      drawn.push(head);
      break;
    }
  }
  const keep = drawn.filter((_, i) => i === drawn.length - 1 || d - (hitAt[i] ?? d) < trail);
  return (
    <g>
      {keep.length > 1 ? <path d={"M" + keep.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L")} fill="none" stroke={color} strokeWidth={width} strokeLinejoin="round" strokeLinecap="round" opacity={0.9} /> : null}
      {atoms
        ? pts.slice(1, -1).map((p, i) => {
            const at = hitAt[i + 1];
            const age = at == null ? -1 : (d - at) / speed;
            const flash = age >= 0 && age < 14 ? 1 - age / 14 : 0;
            return (
              <g key={i}>
                <circle cx={p[0]} cy={p[1]} r={9} fill={alpha(C.violet, 0.55)} stroke={alpha(C.whiteGold, 0.5)} strokeWidth={2} />
                {flash > 0 ? <circle cx={p[0]} cy={p[1]} r={9 + (1 - flash) * 26} fill="none" stroke={C.whiteGold} strokeWidth={4} opacity={flash} /> : null}
                {flash > 0 ? <circle cx={p[0]} cy={p[1]} r={9} fill={C.whiteGold} opacity={flash} /> : null}
              </g>
            );
          })
        : null}
      <Bloom x={head[0]} y={head[1]} r={width * 9} color={C.whiteGold} strength={0.9} />
      <circle cx={head[0]} cy={head[1]} r={width * 1.6} fill="#FFFFFF" stroke={C.gold} strokeWidth={2} />
    </g>
  );
};

/** 0..1 clamp, exported for scene code. */
export const clamp01 = cl01;
