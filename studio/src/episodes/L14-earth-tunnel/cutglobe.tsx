// CutGlobe: the cut-away Earth TO SCALE (BUILD.md §5): radius 6,371 km, core 3,485 km (#12), inner core 1,250 km (#15),
// crust drawn at a 6-px minimum (5-40 km, #21), in the four strata colours, gold key light from 200° and a petrol fill
// from 20°. No coastlines, no numbers. Pure function of its props; pass the frame for the hatch/rotation and the probe.
// Movers it carries: `rot` (radial hatch turning: at R = 400 px, 0.45°/f ≈ 3 px/f at the rim), the probe dot travelling
// a diameter or a chord (harmonic, `probeT`), a dotted line with a saffron drawing head, the seismic ray fan (`rays`),
// the spin arrow (dashes flowing), the shadow wedge.
import React, { useId } from "react";
import { Emissive, Family, alpha, mixHex } from "../../lib/illustrated";
import { CRUST_KM, L14_COLORS, R_CORE, R_EARTH, R_INNER } from "./families";

const D2R = Math.PI / 180;

/** Harmonic travel: t 0..1 of a one-way trip → position −1..1 along the path (slow at the ends, fastest mid-way). */
export const harmonic = (t: number) => -Math.cos(Math.PI * Math.max(0, Math.min(1, t)));
/** Oscillation: phase in trips (0 = start, 1 = far side, 2 = back) → −1..1, endlessly; `damp` 0..1 shrinks it (friction). */
export const oscillate = (trips: number, damp = 0) => -Math.cos(Math.PI * trips) * Math.pow(1 - Math.max(0, Math.min(0.99, damp)), trips);

export type GlobeGeom = { cx: number; cy: number; R: number };
/** Screen point of a polar angle (deg, screen clockwise from +x; −90 = the top pole) at radius share k (0..1). */
export const globePoint = (g: GlobeGeom, deg: number, k = 1): [number, number] => [g.cx + Math.cos(deg * D2R) * g.R * k, g.cy + Math.sin(deg * D2R) * g.R * k];
/** Point along the chord from surface angle a to b, u −1..1 (−1 = a). A diameter is a = −90, b = 90. */
export const chordPoint = (g: GlobeGeom, a: number, b: number, u: number): [number, number] => {
  const [ax, ay] = globePoint(g, a);
  const [bx, by] = globePoint(g, b);
  const s = (u + 1) / 2;
  return [ax + (bx - ax) * s, ay + (by - ay) * s];
};

export type CutGlobeProps = GlobeGeom & {
  f: number;
  family: Family;
  /** radial hatch rotation in degrees (default f × 0.45) */
  rot?: number;
  /** the probe dot: position −1..1 along the path (use harmonic / oscillate) */
  probe?: number | null;
  /** the path the probe and the dotted line follow: surface angles (default the pole-to-pole diameter, −90 → 90) */
  path?: { a: number; b: number };
  /** two city dots at the path's ends (chord shots) */
  cities?: boolean;
  /** dotted line along the path, drawn from −1 up to `line.to` (−1..1), saffron drawing head */
  line?: { to: number; from?: number } | null;
  /** probe trail length (in path units, 0..2) */
  trail?: number;
  /** equatorial spin arrow (dashes flow while true) */
  spin?: boolean;
  /** seismic ray fan from the top pole, 0..1 = how far the wavefront has travelled; rays meeting the core stop there */
  rays?: number | null;
  /** 0..1 opacity of the shadow wedge on the far side */
  shadow?: number;
  /** 0..1: the 12-km notch at the top pole (a sliver, drawn at its 6-px minimum; the zoom Inset is the scene's) */
  notch?: number;
  /** ticks along the path (no numbers) */
  ruler?: boolean;
  /** 0..1 highlight on one layer (e.g. the outer core in 6-13) */
  highlight?: { layer: "crust" | "mantle" | "outer" | "inner"; k: number } | null;
};

export const CutGlobe: React.FC<CutGlobeProps> = ({ cx, cy, R, f, family: F, rot, probe = null, path = { a: -90, b: 90 }, cities = false, line = null, trail = 0, spin = false, rays = null, shadow = 0, notch = 0, ruler = false, highlight = null }) => {
  const id = "cg" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const g = { cx, cy, R };
  const r = rot ?? f * 0.45;
  const rc = (R * R_CORE) / R_EARTH;
  const ri = (R * R_INNER) / R_EARTH;
  const crust = Math.max(6, (R * CRUST_KM) / R_EARTH);
  const rings: { k: string; r: number; c: string; deep: string }[] = [
    { k: "crust", r: R, c: L14_COLORS.crust, deep: L14_COLORS.crustDeep },
    { k: "mantle", r: R - crust, c: L14_COLORS.mantle, deep: L14_COLORS.mantleDeep },
    { k: "outer", r: rc, c: L14_COLORS.outer, deep: L14_COLORS.outerDeep },
    { k: "inner", r: ri, c: L14_COLORS.inner, deep: "#E8C070" },
  ];
  const [ax, ay] = globePoint(g, path.a);
  const [bx, by] = globePoint(g, path.b);
  const P_ = (u: number) => chordPoint(g, path.a, path.b, u);
  return (
    <g>
      <defs>
        {/* gold key from 200° (lit side = left), petrol fill from 20° */}
        <linearGradient id={`${id}key`} x1="0" y1="0.4" x2="1" y2="0.6">
          <stop offset="0" stopColor="#FFE1A0" stopOpacity={0.32} />
          <stop offset="0.5" stopColor="#FFE1A0" stopOpacity={0} />
          <stop offset="0.8" stopColor="#0A3C4C" stopOpacity={0} />
          <stop offset="1" stopColor="#1FA69A" stopOpacity={0.28} />
        </linearGradient>
        <clipPath id={`${id}disc`}>
          <circle cx={cx} cy={cy} r={R} />
        </clipPath>
      </defs>
      {/* atmosphere rim + drop shadow */}
      <circle cx={cx + R * 0.04} cy={cy + R * 0.05} r={R} fill={alpha(F.shadow, 0.5)} />
      <circle cx={cx} cy={cy} r={R + 10} fill="none" stroke={alpha(L14_COLORS.teal, 0.45)} strokeWidth={8} />
      {rings.map((q) => (
        <circle key={q.k} cx={cx} cy={cy} r={q.r} fill={q.c} />
      ))}
      <g clipPath={`url(#${id}disc)`}>
        {/* radial hatch per layer, turning with `rot` */}
        {rings.map((q, li) => {
          const inner = li < 3 ? rings[li + 1].r : 0;
          const n = li === 0 ? 0 : li === 3 ? 10 : 28;
          return (
            <g key={q.k} opacity={0.55}>
              {Array.from({ length: n }, (_, i) => {
                const a = r * (li % 2 ? 1 : -0.7) + (i * 360) / n;
                const [x1, y1] = globePoint(g, a, (inner + (q.r - inner) * 0.15) / R);
                const [x2, y2] = globePoint(g, a + (li === 2 ? 8 : 3), (inner + (q.r - inner) * 0.85) / R);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={q.deep} strokeWidth={li === 3 ? 4 : 5} strokeLinecap="round" />;
              })}
            </g>
          );
        })}
        {/* the inner core's glow */}
        <circle cx={cx} cy={cy} r={ri * 0.7} fill={L14_COLORS.innerCore} opacity={0.6} />
        {highlight ? <circle cx={cx} cy={cy} r={rings.find((q) => q.k === highlight.layer)!.r} fill="none" stroke={L14_COLORS.saffronCore} strokeWidth={10} opacity={highlight.k} /> : null}
        {/* boundaries */}
        {rings.slice(1).map((q) => (
          <circle key={`b${q.k}`} cx={cx} cy={cy} r={q.r} fill="none" stroke={mixHex(q.c, "#000", 0.35)} strokeWidth={3} />
        ))}
        <rect x={cx - R} y={cy - R} width={2 * R} height={2 * R} fill={`url(#${id}key)`} />
        {/* the shadow wedge on the far side of the source (6-11) */}
        {shadow > 0
          ? (() => {
              const dt = Math.asin(rc / R) / D2R; // tangent to the core from the top pole
              const [p1x, p1y] = globePoint(g, 90 - 2 * dt, 1.02);
              const [p2x, p2y] = globePoint(g, 90 + 2 * dt, 1.02);
              return <path d={`M${cx} ${cy} L${p1x} ${p1y} A${R * 1.02} ${R * 1.02} 0 0 1 ${p2x} ${p2y} Z`} fill={alpha(F.shadow, 0.6)} opacity={shadow} />;
            })()
          : null}
        {/* seismic ray fan from the top pole: straight chords (schematic); rays that meet the core stop at it */}
        {rays != null
          ? Array.from({ length: 13 }, (_, i) => {
              const dev = -60 + i * 10; // degrees from the diameter
              const end = 90 - 2 * dev; // far end angle of the chord
              const [sx, sy] = globePoint(g, -90);
              const [ex, ey] = globePoint(g, end);
              const len = Math.hypot(ex - sx, ey - sy);
              // distance of the chord from the centre = R cos(central half-angle)
              const dist = R * Math.abs(Math.sin(dev * D2R));
              const hits = dist < rc;
              const stopLen = hits ? R * Math.cos(dev * D2R) - Math.sqrt(rc * rc - dist * dist) : len;
              const L = Math.min(stopLen, rays * len * 1.1);
              const ux = (ex - sx) / len;
              const uy = (ey - sy) / len;
              return (
                <g key={i}>
                  <path d={`M${sx} ${sy} L${sx + ux * L} ${sy + uy * L}`} stroke={hits ? L14_COLORS.saffronCore : L14_COLORS.bone} strokeWidth={4} strokeDasharray={hits ? "10 7" : undefined} fill="none" opacity={0.9} />
                  {hits && rays * len * 1.1 >= stopLen ? <circle cx={sx + ux * stopLen} cy={sy + uy * stopLen} r={8} fill={L14_COLORS.saffron} /> : null}
                </g>
              );
            })
          : null}
      </g>
      {/* surface rim */}
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={mixHex(L14_COLORS.crust, "#FFF4DE", 0.4)} strokeWidth={3} />
      {spin
        ? (
          <g>
            <path d={`M${cx - R * 1.12} ${cy} A ${R * 1.12} ${R * 0.22} 0 0 0 ${cx + R * 1.12} ${cy}`} fill="none" stroke={L14_COLORS.saffron} strokeWidth={7} strokeDasharray="26 18" strokeDashoffset={-f * 4} />
            <path d={`M${cx + R * 1.12 - 6} ${cy - 22} L${cx + R * 1.12 + 14} ${cy + 4} L${cx + R * 1.12 - 22} ${cy + 10} Z`} fill={L14_COLORS.saffron} />
          </g>
        )
        : null}
      {ruler
        ? Array.from({ length: 21 }, (_, i) => {
            const [x, y] = P_(-1 + i / 10);
            const nx = -(by - ay);
            const ny = bx - ax;
            const nl = Math.hypot(nx, ny);
            const t = i % 5 === 0 ? 16 : 8;
            return <line key={i} x1={x - (nx / nl) * t} y1={y - (ny / nl) * t} x2={x + (nx / nl) * t} y2={y + (ny / nl) * t} stroke={L14_COLORS.bone} strokeWidth={i % 5 === 0 ? 4 : 2.5} />;
          })
        : null}
      {line
        ? (() => {
            const [x0, y0] = P_(line.from ?? -1);
            const [x1, y1] = P_(line.to);
            return (
              <g>
                <path d={`M${x0} ${y0} L${x1} ${y1}`} stroke={L14_COLORS.bone} strokeWidth={6} strokeDasharray="4 14" strokeLinecap="round" fill="none" />
                <circle cx={x1} cy={y1} r={11} fill={L14_COLORS.saffron} stroke="#FFF4DE" strokeWidth={3} />
              </g>
            );
          })()
        : null}
      {cities
        ? [
            [ax, ay],
            [bx, by],
          ].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={13} fill={L14_COLORS.bone} stroke={F.shadow} strokeWidth={4} />)
        : null}
      {notch > 0 ? (
        <g opacity={notch}>
          <rect x={cx - 3} y={cy - R - 1} width={6} height={6} fill={F.shadow} />
          <circle cx={cx} cy={cy - R} r={22 + Math.sin(f / 6) * 4} fill="none" stroke={L14_COLORS.saffron} strokeWidth={4} />
        </g>
      ) : null}
      {probe != null
        ? (() => {
            const [px, py] = P_(probe);
            const tr = trail > 0 ? P_(Math.max(-1, probe - trail)) : null;
            return (
              <g>
                {tr ? <path d={`M${tr[0]} ${tr[1]} L${px} ${py}`} stroke={L14_COLORS.teal} strokeWidth={8} strokeLinecap="round" opacity={0.6} /> : null}
                <Emissive d={`M${px - 0.1} ${py} L${px + 0.1} ${py}`} color={L14_COLORS.teal} core="#E6FFF8" width={16} strength={0.8} glow={8} />
                <circle cx={px} cy={py} r={13} fill={L14_COLORS.probe} stroke="#E6FFF8" strokeWidth={4} />
              </g>
            );
          })()
        : null}
    </g>
  );
};
