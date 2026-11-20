// ST02 acts l04 + l05: shared drawing parts (stylised five-borough map, cream toilet, water-use line, reservoir basin,
// stopwatch, plant, stamp, chapter beat). Pure functions of props; no frame hooks. The map is a simplified, stylised
// outline, not an exact map.
import React from "react";
import { Bloom } from "../../../lib/illustrated/light";
import { Cumulus } from "../../../lib/illustrated/props";
import { rrect, smoothPath } from "../../../lib/illustrated/shapes";
import { mixHex } from "../../../lib/illustrated/palette";
import { rnd } from "../../../lib/illustrated/motion";
import { AIR, CHALK, CHALK_SHADE, INK, LIME, LIME_DEEP, OCEAN, ST_FONT, SUPPOSE, SupposeFamily, TERRA } from "../../../lib/suppose/palette";
import { Lev } from "../../../lib/suppose/lev";
import { CounterSpec, ease, LADDER_RUNGS, mix, ShotStage } from "../shot";

export type Pt = [number, number];
export const TERRA_DARK = mixHex(TERRA, INK, 0.35);
export const TERRA_LIGHT = "#E8987A";
/** blue-sage: the colour of water lines */
export const WATER = "#7FB8B0";
export const WATER_DEEP = mixHex(OCEAN, "#5E9E8A", 0.5);
export const CREAM = "#F4EAD0";
export const CREAM_SHADE = "#D9CBA8";

/** closed Catmull-Rom curve through pts */
export const closedPath = (pts: Pt[], tension = 0.5) => {
  const n = pts.length;
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1: Pt = [p1[0] + ((p2[0] - p0[0]) * tension) / 3, p1[1] + ((p2[1] - p0[1]) * tension) / 3];
    const c2: Pt = [p2[0] - ((p3[0] - p1[0]) * tension) / 3, p2[1] - ((p3[1] - p1[1]) * tension) / 3];
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + " Z";
};

export const Txt: React.FC<{ x: number; y: number; size?: number; fill?: string; anchor?: "start" | "middle" | "end"; weight?: number; ls?: number; opacity?: number; children: React.ReactNode }> = ({
  x, y, size = 40, fill = INK, anchor = "middle", weight = 900, ls = 0, opacity = 1, children,
}) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={ST_FONT} fontWeight={weight} fontSize={size} letterSpacing={ls} fill={fill} opacity={opacity}>{children}</text>
);

/** 761719 → "761,719" */
export const fmtInt = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
/** counter value rolling from a to b between frames t0..t1 */
export const roll = (t: number, t0: number, t1: number, a: number, b: number) => fmtInt(mix(a, b, ease(t, t0, t1)));

export const FLUSHES = (value = "761,719", sub?: string): CounterSpec => ({ label: "FLUSHES", value, sub });

// ------------------------------------------------------------------ polyline helpers
export const polyLen = (pts: Pt[]) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
/** point at distance s along a polyline (clamped) */
export const along = (pts: Pt[], s: number): Pt => {
  let rem = Math.max(0, s);
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i];
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (rem <= l) return [mix(a[0], b[0], rem / l), mix(a[1], b[1], rem / l)];
    rem -= l;
  }
  return pts[pts.length - 1];
};
export const polyD = (pts: Pt[]) => pts.map((p, i) => `${i ? "L" : "M"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");

// ------------------------------------------------------------------ stylised five-borough map (local 1000 × 950)
export const BOROUGHS: { name: string; pts: Pt[] }[] = [
  { name: "BRONX", pts: [[455, 95], [560, 40], [690, 60], [770, 140], [735, 225], [620, 250], [520, 235], [470, 175]] },
  { name: "MANHATTAN", pts: [[450, 205], [492, 228], [470, 330], [425, 450], [386, 560], [356, 552], [378, 430], [412, 310]] },
  { name: "QUEENS", pts: [[560, 300], [690, 270], [830, 300], [950, 380], [960, 520], [880, 630], [760, 615], [650, 540], [560, 450], [525, 360]] },
  { name: "BROOKLYN", pts: [[430, 585], [520, 485], [610, 545], [715, 640], [700, 745], [595, 815], [470, 800], [400, 720], [405, 640]] },
  { name: "STATEN ISLAND", pts: [[95, 705], [205, 640], [300, 690], [300, 805], [215, 895], [115, 875], [62, 795]] },
];
const inPoly = (p: Pt, poly: Pt[]) => {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};
const shrink = (poly: Pt[], k: number): Pt[] => {
  const cx = poly.reduce((s, p) => s + p[0], 0) / poly.length, cy = poly.reduce((s, p) => s + p[1], 0) / poly.length;
  return poly.map(([x, y]) => [cx + (x - cx) * k, cy + (y - cy) * k]);
};
/** coastline wobble: two extra points per edge, nudged sideways (deterministic) */
const roughen = (pts: Pt[], seed: number): Pt[] =>
  pts.flatMap((a, i) => {
    const b = pts[(i + 1) % pts.length];
    const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len, ny = dx / len;
    const k = Math.min(1, len / 120);
    return [a, ...[1 / 3, 2 / 3].map((u, j): Pt => {
      const o = (rnd(seed * 31 + i * 7 + j) - 0.5) * len * 0.22 * k;
      return [a[0] + dx * u + nx * o, a[1] + dy * u + ny * o];
    })];
  });
export const BOROUGH_D = BOROUGHS.map((b, i) => closedPath(b.name === "MANHATTAN" ? b.pts : roughen(b.pts, i + 2), 0.45));
/** building squares on the map: deterministic points inside the boroughs (local units), with a borough index */
export const MAP_DOTS: { x: number; y: number; b: number; r: number }[] = (() => {
  const out: { x: number; y: number; b: number; r: number }[] = [];
  const inner = BOROUGHS.map((b) => shrink(b.pts, b.name === "MANHATTAN" ? 0.78 : 0.86));
  for (let i = 0; out.length < 230 && i < 6000; i++) {
    const p: Pt = [rnd(i * 2 + 1) * 1000, rnd(i * 2 + 7) * 950];
    const b = inner.findIndex((poly) => inPoly(p, poly));
    if (b >= 0 && out.every((o) => Math.hypot(o.x - p[0], o.y - p[1]) > 26)) out.push({ x: p[0], y: p[1], b, r: rnd(i * 5 + 3) });
  }
  return out;
})();

/** The map: borough shapes in local units, drawn at (x, y) with scale s. Children are drawn in the same local frame. */
export const NYCMap: React.FC<{ x: number; y: number; s: number; fam: SupposeFamily; opacity?: number; labels?: boolean; children?: React.ReactNode }> = ({
  x, y, s, fam, opacity = 1, labels = false, children,
}) => {
  const F = SUPPOSE[fam];
  const land = F.dark ? F.mid : F.far;
  const edge = F.dark ? F.bounce : F.near;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
      {BOROUGH_D.map((d, i) => (
        <g key={BOROUGHS[i].name}>
          <path d={d} fill={F.shadow} opacity={0.35} transform="translate(6 10)" />
          <path d={d} fill={land} stroke={edge} strokeWidth={4 / Math.max(0.5, s)} strokeLinejoin="round" opacity={0.95} />
        </g>
      ))}
      {labels
        ? BOROUGHS.map((b) => {
            const cx = b.pts.reduce((q, p) => q + p[0], 0) / b.pts.length, cy = b.pts.reduce((q, p) => q + p[1], 0) / b.pts.length;
            return <Txt key={b.name} x={cx} y={cy + 8} size={22 / s} fill={F.text} opacity={0.5} ls={2}>{b.name}</Txt>;
          })
        : null}
      {children}
    </g>
  );
};

/** the building squares: `glow(i)` 0..1 per dot (0 = a dim cream square, 1 = flashing) */
export const MapSquares: React.FC<{ glow: (i: number) => number; color?: string; size?: number; flash?: string }> = ({ glow, color = CREAM, size = 11, flash }) => {
  return (
    <g>
      {MAP_DOTS.map((d, i) => {
        const g = Math.max(0, Math.min(1, glow(i)));
        return (
          <g key={i}>
            {g > 0.45 && flash ? <circle cx={d.x} cy={d.y} r={size * (0.6 + g * 1.2)} fill={flash} opacity={(g - 0.45) * 0.6} /> : null}
            <rect x={d.x - size / 2} y={d.y - size / 2} width={size} height={size} rx={2} fill={g > 0.5 && flash ? flash : color} opacity={0.45 + 0.55 * g} />
          </g>
        );
      })}
    </g>
  );
};

// ------------------------------------------------------------------ the cream toilet (side silhouette, faces +x, feet at y)
export const Toilet: React.FC<{ x: number; y: number; s?: number; outline?: string; level?: number; cut?: boolean }> = ({ x, y, s = 1, outline = INK, level, cut = false }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={8} cy={2} rx={52} ry={6} fill="#000" opacity={0.15} />
    {/* tank */}
    <path d={rrect(-46, -132, 40, 70, 8)} fill={CREAM} stroke={outline} strokeWidth={3.5} />
    {cut ? (
      <g>
        <path d={rrect(-40, -124, 28, 56, 5)} fill={CREAM_SHADE} />
        {level !== undefined ? <path d={rrect(-40, -68 - 56 * Math.max(0.04, level), 28, 56 * Math.max(0.04, level), 4)} fill={WATER} /> : null}
      </g>
    ) : null}
    <path d={rrect(-50, -140, 48, 12, 5)} fill={CREAM} stroke={outline} strokeWidth={3.5} />
    {/* bowl + pedestal */}
    <path d="M -10 -70 H 56 Q 60 -70 58 -62 Q 50 -30 18 -26 L 22 0 H -14 L -10 -30 Z" fill={CREAM} stroke={outline} strokeWidth={3.5} strokeLinejoin="round" />
    <path d="M -12 -74 H 58" stroke={outline} strokeWidth={6} strokeLinecap="round" />
    <path d="M -2 -60 Q 20 -44 44 -58" stroke={CREAM_SHADE} strokeWidth={5} fill="none" strokeLinecap="round" />
    {/* handle */}
    <path d="M -10 -116 h 12" stroke={outline} strokeWidth={4} strokeLinecap="round" />
  </g>
);

// ------------------------------------------------------------------ arrows
export const Arrow: React.FC<{ x0: number; y0: number; x1: number; y1: number; color?: string; w?: number; head?: number; opacity?: number }> = ({
  x0, y0, x1, y1, color = TERRA, w = 10, head = 24, opacity = 1,
}) => {
  const a = Math.atan2(y1 - y0, x1 - x0);
  const bx = x1 - Math.cos(a) * head * 0.8, by = y1 - Math.sin(a) * head * 0.8;
  const p = (ang: number): Pt => [x1 - Math.cos(a + ang) * head, y1 - Math.sin(a + ang) * head];
  const [l, r] = [p(0.5), p(-0.5)];
  return (
    <g opacity={opacity}>
      <path d={`M ${x0} ${y0} L ${bx} ${by}`} stroke={color} strokeWidth={w} strokeLinecap="round" />
      <path d={`M ${l[0]} ${l[1]} L ${x1} ${y1} L ${r[0]} ${r[1]} Z`} fill={color} stroke={color} strokeWidth={w * 0.5} strokeLinejoin="round" />
    </g>
  );
};
/** small chevron (water arrows along a pipe) */
export const Chevron: React.FC<{ x: number; y: number; a: number; s?: number; color?: string; opacity?: number }> = ({ x, y, a, s = 18, color = OCEAN, opacity = 1 }) => (
  <path d={`M ${-s * 0.6} ${-s * 0.7} L ${s * 0.4} 0 L ${-s * 0.6} ${s * 0.7}`} transform={`translate(${x} ${y}) rotate(${a})`} stroke={color} strokeWidth={s * 0.32} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={opacity} />
);

// ------------------------------------------------------------------ water-use line (normalised 0..1 time → 0..1 use)
export const SHOW_A = 0.3, SHOW_B = 0.58;
const bump = (u: number, a: number, b: number) => {
  const r = 0.05;
  const up = Math.max(0, Math.min(1, (u - a) / r)), dn = Math.max(0, Math.min(1, (b - u) / r));
  const k = Math.min(up, dn);
  return k * k * (3 - 2 * k);
};
export const useAt = (u: number) => {
  const base = 0.42 + 0.025 * Math.sin(u * 47) + 0.015 * Math.sin(u * 113);
  const dip = -0.17 * bump(u, SHOW_A, SHOW_B);
  const z = u - 0.63;
  const spike = z < 0 ? Math.exp(-((z / 0.012) ** 2)) : Math.exp(-z / 0.07);
  return base + dip + 0.52 * spike * (u > 0.6 ? 1 : 0);
};
/** the line drawn from u = 0 to u = p inside the box (x, y, w, h), y up */
export const usePath = (x: number, y: number, w: number, h: number, p: number) => {
  const pts: Pt[] = [];
  const n = Math.max(2, Math.ceil(240 * p));
  for (let i = 0; i <= n; i++) {
    const u = (i / n) * p;
    pts.push([x + u * w, y + h - useAt(u) * h]);
  }
  return pts;
};
export const UseChart: React.FC<{ x: number; y: number; w: number; h: number; p: number; fam: SupposeFamily; t: number; band?: number; tag?: string; color?: string; hot?: number }> = ({
  x, y, w, h, p, fam, t, band = 1, tag, color = AIR, hot = 0,
}) => {
  const F = SUPPOSE[fam];
  const pts = usePath(x, y, w, h, p);
  const head = pts[pts.length - 1];
  const bx0 = x + SHOW_A * w, bx1 = x + SHOW_B * w;
  return (
    <g>
      <path d={rrect(x - 40, y - 70, w + 80, h + 150, 26)} fill={INK} opacity={F.dark ? 0.35 : 0.08} />
      <g opacity={band}>
        <rect x={bx0} y={y} width={bx1 - bx0} height={h} rx={10} fill={F.light} opacity={0.1} />
        <Txt x={(bx0 + bx1) / 2} y={y + 36} size={24} ls={3} fill={F.text} opacity={0.8}>HALFTIME SHOW</Txt>
      </g>
      <path d={`M ${x} ${y + h} H ${x + w}`} stroke={F.dim} strokeWidth={4} strokeLinecap="round" />
      <path d={`M ${x} ${y + h} V ${y}`} stroke={F.dim} strokeWidth={4} strokeLinecap="round" />
      <Txt x={x} y={y - 26} size={24} ls={3} anchor="start" fill={F.dim}>WATER USE</Txt>
      {tag ? <Txt x={x + w} y={y - 26} size={30} anchor="end" fill={F.text}>{tag}</Txt> : null}
      <Txt x={x + w} y={y + h + 46} size={22} ls={3} anchor="end" fill={F.dim}>TIME →</Txt>
      {hot > 0 ? <Bloom x={x + 0.635 * w} y={y + h * 0.2} r={200} color={F.light} strength={hot * 0.5} /> : null}
      <path d={polyD(pts)} stroke={color} strokeWidth={9} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={head[0]} cy={head[1]} r={13 + Math.sin(t / 3) * 2} fill={CHALK} />
      <circle cx={head[0]} cy={head[1]} r={24 + Math.sin(t / 3) * 3} fill="none" stroke={CHALK} strokeWidth={3} opacity={0.4} />
    </g>
  );
};

// ------------------------------------------------------------------ stopwatch (k = elapsed fraction of one turn)
export const Stopwatch: React.FC<{ x: number; y: number; r: number; k: number; done?: number; dark?: boolean; q?: boolean; spin?: number }> = ({ x, y, r, k, done = 0, dark = true, q = false, spin }) => {
  const a = (spin ?? k) * Math.PI * 2;
  const hx = x + Math.sin(a) * r * 0.78, hy = y - Math.cos(a) * r * 0.78;
  const kk = Math.min(0.999, Math.max(0, k));
  const ex = x + Math.sin(kk * Math.PI * 2) * r * 0.86, ey = y - Math.cos(kk * Math.PI * 2) * r * 0.86;
  const wedge = kk > 0.002 ? `M ${x} ${y} L ${x} ${y - r * 0.86} A ${r * 0.86} ${r * 0.86} 0 ${kk > 0.5 ? 1 : 0} 1 ${ex} ${ey} Z` : "";
  return (
    <g>
      {done > 0 ? <Bloom x={x} y={y} r={r * 2.2} color={CHALK} strength={done * 0.5} /> : null}
      <path d={rrect(x - r * 0.18, y - r * 1.32, r * 0.36, r * 0.26, 4)} fill={TERRA} stroke={INK} strokeWidth={3} />
      <path d={`M ${x + r * 0.72} ${y - r * 0.86} l ${r * 0.16} ${-r * 0.16}`} stroke={INK} strokeWidth={r * 0.14} strokeLinecap="round" />
      <circle cx={x} cy={y} r={r * 1.08} fill={TERRA} stroke={INK} strokeWidth={3.5} />
      <circle cx={x} cy={y} r={r * 0.94} fill={CHALK} />
      {!q && wedge ? <path d={wedge} fill={WATER} opacity={0.75} /> : null}
      {Array.from({ length: 12 }, (_, i) => {
        const aa = (i / 12) * Math.PI * 2;
        return <path key={i} d={`M ${x + Math.sin(aa) * r * 0.8} ${y - Math.cos(aa) * r * 0.8} L ${x + Math.sin(aa) * r * 0.9} ${y - Math.cos(aa) * r * 0.9}`} stroke={INK} strokeWidth={3} strokeLinecap="round" opacity={0.6} />;
      })}
      {q ? (
        <Txt x={x} y={y + r * 0.36} size={r * 1.05} fill={TERRA_DARK}>?</Txt>
      ) : (
        <>
          <path d={`M ${x} ${y} L ${hx} ${hy}`} stroke={INK} strokeWidth={Math.max(3, r * 0.08)} strokeLinecap="round" />
          <circle cx={x} cy={y} r={r * 0.1} fill={INK} />
        </>
      )}
      {dark ? null : <circle cx={x} cy={y} r={r * 1.08} fill="none" stroke={INK} strokeWidth={1} opacity={0.2} />}
    </g>
  );
};

// ------------------------------------------------------------------ a treatment plant icon (base at y)
export const Plant: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={100} ry={10} fill="#000" opacity={0.18} />
    <path d={rrect(-90, -70, 110, 70, 8)} fill={TERRA} stroke={INK} strokeWidth={4} />
    <path d={rrect(-78, -56, 30, 20, 4)} fill={CREAM} opacity={0.85} />
    <path d={rrect(-38, -56, 30, 20, 4)} fill={CREAM} opacity={0.85} />
    <path d="M -70 -70 L -70 -112 H -50 V -70" fill={TERRA_DARK} stroke={INK} strokeWidth={4} />
    <ellipse cx={58} cy={-8} rx={44} ry={14} fill={WATER} stroke={INK} strokeWidth={4} />
    <path d={`M 58 -8 L ${58 + Math.cos(t / 12) * 38} ${-8 + Math.sin(t / 12) * 11}`} stroke={INK} strokeWidth={3} />
  </g>
);

// ------------------------------------------------------------------ reservoir basin, three-quarter view (level 0..1)
export const Basin: React.FC<{ x: number; y: number; rx: number; ry: number; level: number; t: number; fam: SupposeFamily; mark?: number }> = ({ x, y, rx, ry, level, t, fam, mark }) => {
  const F = SUPPOSE[fam];
  const depth = ry * 1.1;
  const wy = y + depth * (1 - level) * 0.8;
  const wk = 0.86 + 0.14 * level;
  const id = `basin-${Math.round(x)}-${Math.round(y)}`;
  return (
    <g>
      {/* embankment */}
      <ellipse cx={x} cy={y + 30} rx={rx * 1.16} ry={ry * 1.3} fill={F.near} opacity={0.5} />
      <ellipse cx={x} cy={y + 12} rx={rx * 1.1} ry={ry * 1.2} fill={F.mid} />
      <ellipse cx={x} cy={y} rx={rx * 1.04} ry={ry * 1.08} fill={CHALK_SHADE} />
      <defs>
        <clipPath id={id}><ellipse cx={x} cy={y} rx={rx} ry={ry} /></clipPath>
      </defs>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={mixHex(CHALK_SHADE, INK, 0.25)} />
      <g clipPath={`url(#${id})`}>
        {/* inner wall bands (visible above the water) */}
        {[0.25, 0.5, 0.75].map((k) => (
          <ellipse key={k} cx={x} cy={y + depth * k * 0.8} rx={rx * (0.86 + 0.14 * (1 - k))} ry={ry * (0.86 + 0.14 * (1 - k))} fill="none" stroke={CHALK_SHADE} strokeWidth={3} opacity={0.5} />
        ))}
        <ellipse cx={x} cy={wy} rx={rx * wk} ry={ry * wk} fill={OCEAN} />
        <ellipse cx={x} cy={wy} rx={rx * wk} ry={ry * wk} fill={AIR} opacity={0.25} />
        {Array.from({ length: 7 }, (_, i) => {
          const u = ((t * 0.6 + i * 37) % 260) / 260;
          const yy = wy - ry * wk * 0.7 + u * ry * wk * 1.4;
          const half = rx * wk * Math.sqrt(Math.max(0, 1 - ((yy - wy) / (ry * wk)) ** 2)) * 0.6;
          const sx = x + Math.sin(i * 2.1 + t / 40) * rx * 0.15;
          return <path key={i} d={`M ${sx - half * 0.5} ${yy} q ${half * 0.25} -6 ${half * 0.5} 0 t ${half * 0.5} 0`} stroke={AIR} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.6 * Math.sin(u * Math.PI)} />;
        })}
        {mark !== undefined ? (
          <ellipse cx={x} cy={y + depth * (1 - mark) * 0.8} rx={rx * (0.86 + 0.14 * mark)} ry={ry * (0.86 + 0.14 * mark)} fill="none" stroke={TERRA} strokeWidth={6} strokeDasharray="18 12" opacity={0.9} />
        ) : null}
      </g>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="none" stroke={INK} strokeWidth={4} opacity={0.5} />
    </g>
  );
};

/** soft rolling hills for sage landscape shots */
export const Hills: React.FC<{ fam: SupposeFamily; ground: number; t: number; f: number; clouds?: boolean }> = ({ fam, ground, t, f, clouds = true }) => {
  const F = SUPPOSE[fam];
  const cx = (t * 0.8) % 2600;
  return (
    <g>
      {clouds ? (
        <>
          <Cumulus x={1500 - cx} y={300} w={360} h={120} fill={CHALK} shade={CHALK_SHADE} lit={F.light} seed={3} frame={f} opacity={0.8} />
          <Cumulus x={2500 - cx} y={230} w={260} h={90} fill={CHALK} shade={CHALK_SHADE} lit={F.light} seed={8} frame={f} opacity={0.7} />
          <Cumulus x={700 - cx * 0.6 + (cx > 1500 ? 2600 * 0.6 : 0)} y={200} w={220} h={80} fill={CHALK} shade={CHALK_SHADE} lit={F.light} seed={5} frame={f} opacity={0.6} />
        </>
      ) : null}
      <path d={smoothPath([[-80, ground - 170], [300, ground - 260], [760, ground - 190], [1200, ground - 250], [1600, ground - 180], [2000, ground - 220]]) + ` L 2000 1200 L -80 1200 Z`} fill={F.far} />
      <path d={smoothPath([[-80, ground - 50], [500, ground - 100], [1000, ground - 60], [1500, ground - 90], [2000, ground - 50]]) + ` L 2000 1200 L -80 1200 Z`} fill={F.mid} />
      <rect x={-80} y={ground} width={2080} height={300} fill={F.near} />
    </g>
  );
};

/** a sign on a post (names only) */
export const Sign: React.FC<{ x: number; y: number; text: string; size?: number; dark?: boolean }> = ({ x, y, text, size = 30, dark = false }) => {
  const w = text.length * size * 0.66 + 40;
  return (
    <g>
      <path d={`M ${x} ${y} V ${y - 90}`} stroke={INK} strokeWidth={7} strokeLinecap="round" />
      <path d={rrect(x - w / 2, y - 90 - size * 1.6, w, size * 1.6, 12)} fill={dark ? INK : CHALK} stroke={INK} strokeWidth={4} />
      <Txt x={x} y={y - 90 - size * 0.48} size={size} ls={2} fill={dark ? CHALK : INK}>{text}</Txt>
    </g>
  );
};

// ------------------------------------------------------------------ stamp
export const Stamp: React.FC<{ x: number; y: number; t: number; at: number; text: string; color: string; size?: number; rot?: number; sub?: string }> = ({
  x, y, t, at, text, color, size = 64, rot = -8, sub,
}) => {
  const k = (t - at) / 7;
  if (k <= 0) return null;
  const sc = k < 1 ? 2.6 - 1.6 * k * k : 1 + Math.sin(Math.min(1, (t - at - 7) / 8) * Math.PI) * -0.05;
  const w = Math.max(text.length * size * 0.72, (sub ?? "").length * size * 0.42 * 0.78) + 70;
  const h = size * 1.45 + (sub ? size * 0.62 : 0);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${sc})`} opacity={Math.min(1, k * 1.4)}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={18} fill={CHALK} opacity={0.88} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={18} fill="none" stroke={color} strokeWidth={8} />
      <rect x={-w / 2 + 12} y={-h / 2 + 12} width={w - 24} height={h - 24} rx={10} fill="none" stroke={color} strokeWidth={3} />
      <text x={0} y={sub ? -size * 0.1 : size * 0.35} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={size} letterSpacing={3} fill={color}>{text}</text>
      {sub ? <text x={0} y={size * 0.7} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={size * 0.42} letterSpacing={3} fill={color}>{sub}</text> : null}
    </g>
  );
};
export const slamShake = (t: number, at: number) => {
  const u = t - at - 7;
  return u < 0 || u > 14 ? 0 : Math.sin(u * 2.4) * 9 * (1 - u / 14);
};

// ------------------------------------------------------------------ chapter beat: Lev climbs to the next rung, title slides in
const rungAt = (top: number, bottom: number, i: number, n: number) => bottom - ((bottom - top) / (n + 0.5)) * (i + 0.5);
export const BigLadder: React.FC<{ x: number; top: number; bottom: number; width?: number; lit: number; glow?: number; frame: number; light?: boolean; font?: number }> = ({
  x, top, bottom, width = 120, lit, glow = 1, frame, light = false, font = 30,
}) => {
  const rungs = LADDER_RUNGS;
  const n = rungs.length;
  const xl = x - width / 2, xr = x + width / 2, thick = 10;
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
        const ry = rungAt(top, bottom, i, n);
        const on = i <= lit, cur = i === lit;
        const lx = xl - 34;
        return (
          <g key={i}>
            {cur && glow > 0 ? <Bloom x={x} y={ry} r={width * 1.3} color={LIME} strength={glow * (0.55 + 0.15 * Math.sin(frame / 7))} /> : null}
            {light ? <path d={`M ${xl} ${ry} L ${xr} ${ry}`} stroke={INK} strokeWidth={thick + 4} strokeLinecap="round" opacity={on ? 0.25 : 0.12} /> : null}
            <path d={`M ${xl} ${ry} L ${xr} ${ry}`} stroke={on ? LIME : LIME_DEEP} strokeWidth={cur ? thick + 3 : thick - 1} strokeLinecap="round" opacity={on ? 1 : 0.45} />
            {cur ? (
              <g transform={`translate(${lx} ${ry})`}>
                <rect x={-r.length * font * 0.66 - 26} y={-font * 0.78} width={r.length * font * 0.66 + 40} height={font * 1.5} rx={font * 0.75} fill={INK} opacity={0.82} />
                <text x={0} y={font * 0.36} textAnchor="end" fontFamily={ST_FONT} fontWeight={900} fontSize={font * 1.05} fill={LIME}>{r}</text>
              </g>
            ) : (
              <text x={lx} y={ry + font * 0.3} textAnchor="end" fontFamily={ST_FONT} fontWeight={800} fontSize={font * 0.8} fill={light ? INK : CHALK} opacity={on ? 0.9 : 0.5}>{r}</text>
            )}
          </g>
        );
      })}
    </g>
  );
};

export const ChapterBeat: React.FC<{ t: number; d: number; f: number; fam: SupposeFamily; prev: number; next: number; eyebrow: string; title: string; counter: CounterSpec }> = ({
  t, d, f, fam, prev, next, eyebrow, title, counter,
}) => {
  const F = SUPPOSE[fam];
  const top = 110, bottom = 1000, lx = 1340, n = LADDER_RUNGS.length;
  const c0 = Math.min(14, d * 0.1), c1 = Math.min(46, d * 0.34);
  const climb = ease(t, c0, c1);
  const lit = t < c1 ? prev : next;
  const glow = t < c1 ? 0.6 : 0.6 + 1.4 * Math.max(0, 1 - (t - c1) / 20);
  const yPrev = rungAt(top, bottom, prev, n), yNext = rungAt(top, bottom, next, n);
  const levY = mix(yPrev, yNext, climb) - Math.sin(climb * Math.PI * 2) * 10;
  const slide = ease(t, 0, Math.min(22, d * 0.18));
  const tx = mix(-1100, 130, slide);
  const ul = ease(t, c1 - 20, c1 + 24);
  const cloudX = (t * 1.6) % 2400;
  return (
    <ShotStage fam={fam} t={t} f={f} counter={counter}>
      <Bloom x={420} y={260} r={700} color={F.light} strength={0.55} spread={0.5} />
      {!F.dark ? (
        <>
          <Cumulus x={1100 - cloudX} y={300} w={340} h={120} fill={CHALK} shade={CHALK_SHADE} lit={F.light} seed={3} frame={f} opacity={0.8} />
          <Cumulus x={2500 - cloudX} y={190} w={250} h={90} fill={CHALK} shade={CHALK_SHADE} lit={F.light} seed={8} frame={f} opacity={0.7} />
        </>
      ) : null}
      <path d={smoothPath([[-60, 1000], [400, 980], [900, 995], [1400, 985], [1980, 1000]]) + " L 1980 1120 L -60 1120 Z"} fill={F.mid} />
      <path d={smoothPath([[-60, 1040], [600, 1028], [1300, 1040], [1980, 1032]]) + " L 1980 1120 L -60 1120 Z"} fill={F.near} />
      <BigLadder x={lx} top={top} bottom={bottom} width={130} lit={lit} glow={glow} frame={f} light={!F.dark} />
      <Lev x={lx - 8} y={levY} h={140} frame={f} pose="pull" hands={{ front: [22, -178], back: [12, -168] }} eyes={t > c1 + 4 ? "happy" : "up"} tilt={-6} wind={0.5} outline={F.dark ? undefined : INK} />
      <g transform={`translate(${tx} 0)`}>
        <text x={0} y={430} fontFamily={ST_FONT} fontWeight={900} fontSize={34} letterSpacing={6} fill={F.dim}>{eyebrow}</text>
        <text x={0} y={560} fontFamily={ST_FONT} fontWeight={900} fontSize={100} fill={F.text}>{title}</text>
        <path d={`M 4 594 L ${4 + 560 * ul} 594`} stroke={TERRA} strokeWidth={12} strokeLinecap="round" opacity={ul > 0 ? 1 : 0} />
      </g>
      {t >= c1 ? <circle cx={lx} cy={yNext} r={60 + (t - c1) * 9} fill="none" stroke={LIME} strokeWidth={6} opacity={Math.max(0, 1 - (t - c1) / 18)} /> : null}
    </ShotStage>
  );
};
