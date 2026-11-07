// Kit v2.1 shared props with bespoke silhouettes (art-director review: "clouds read as saucers, the plume as jelly
// blobs"): layered cumulus with a flat stratus base, thin stratus lenses, and a cauliflower plume for eruptions /
// smoke. Shared props are allowed (hard rule 1 bans shared *bodies*, not a cloud).
import React, { useId } from "react";
import { rnd } from "./motion";
import { lightVec } from "./light";

const safeId = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, "");

/**
 * Cumulus (v2.1 round 5, art-director review of v2-style-1: "a chain of round bubbles"): a FLAT base at `y` and a few
 * (3-5) large, overlapping, irregular lobes of very different size on top (one dominant lobe, never a row of equal
 * circles). Three tonal steps painted over the WHOLE silhouette, not per lobe: the shade mass, the body lifted toward
 * the light, a shadowed underside band along the flat base, and a lit crescent along the top of the big lobes only
 * (an arc stroke clipped inside the silhouette, so it reads as a lit edge, not a polka dot). `frame` makes the lobes
 * breathe very slightly so a cloud is never a frozen sticker. `lobes` overrides the count (3-5).
 */
export const Cumulus: React.FC<{ x: number; y: number; w: number; h: number; fill: string; shade: string; lit: string; light?: number; seed?: number; frame?: number; opacity?: number; lobes?: number }> = ({
  x,
  y,
  w,
  h,
  fill,
  shade,
  lit,
  light = 225,
  seed = 1,
  frame = 0,
  opacity = 1,
  lobes,
}) => {
  const [lx, ly] = lightVec(light);
  const id = "cum" + safeId(useId());
  const n = Math.max(3, Math.min(5, lobes ?? 3 + Math.floor(rnd(seed) * 3)));
  // the dominant lobe sits off-centre (toward the light, a little), the others step down in size either side
  const heroU = 0.42 + (rnd(seed * 5) - 0.5) * 0.2 + lx * 0.06;
  const parts = Array.from({ length: n }, (_, i) => {
    const u = n === 1 ? heroU : i / (n - 1);
    const dist = Math.abs(u - heroU);
    const size = Math.max(0.42, 1 - dist * 1.25) * (0.9 + rnd(seed * 7 + i) * 0.2);
    const rx = h * 0.62 * size * (1 + 0.012 * Math.sin(frame / 90 + i * 1.3));
    const ry = rx * (0.82 + rnd(seed * 11 + i) * 0.26);
    const cx = x + rx * 0.7 + u * (w - rx * 1.4) + (rnd(seed * 3 + i) - 0.5) * h * 0.18;
    const cy = y - ry * 0.92 + rnd(seed * 13 + i) * h * 0.06;
    const rot = (rnd(seed * 17 + i) - 0.5) * 28;
    return { cx, cy, rx, ry, rot, big: size > 0.72 };
  });
  // the base: a low wide lens so the bottom edge is flat and the ends taper
  const baseH = h * 0.26;
  const union = (dx: number, dy: number, k = 1) => (
    <>
      <rect x={x + dx} y={y - baseH + dy} width={w} height={baseH} rx={baseH * 0.5} />
      {parts.map((p, i) => (
        <ellipse key={i} cx={p.cx + dx} cy={p.cy + dy} rx={p.rx * k} ry={p.ry * k} transform={`rotate(${p.rot.toFixed(1)} ${(p.cx + dx).toFixed(1)} ${(p.cy + dy).toFixed(1)})`} />
      ))}
    </>
  );
  // lit crescent: an arc along each big lobe's edge, centred on the light direction
  const la = Math.atan2(ly, lx);
  const crescent = (p: { cx: number; cy: number; rx: number; ry: number; rot: number }) => {
    const r = Math.min(p.rx, p.ry) * 0.8;
    const a0 = la - 1.15;
    const a1 = la + 1.15;
    const sx = p.cx + Math.cos(a0) * r;
    const sy = p.cy + Math.sin(a0) * r;
    const ex = p.cx + Math.cos(a1) * r;
    const ey = p.cy + Math.sin(a1) * r;
    return `M${sx.toFixed(1)} ${sy.toFixed(1)} A${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${ex.toFixed(1)} ${ey.toFixed(1)}`;
  };
  return (
    <g opacity={opacity}>
      <clipPath id={`${id}-flat`}>
        <rect x={x - h} y={y - h * 4} width={w + h * 2} height={h * 4} />
      </clipPath>
      <clipPath id={`${id}-body`}>{union(lx * 3, ly * 3 - 2)}</clipPath>
      <g clipPath={`url(#${id}-flat)`}>
        {/* 1 shade mass: the whole silhouette in shade */}
        <g fill={shade}>{union(0, 2)}</g>
        {/* 2 body: the silhouette lifted toward the light, so shade shows along the away edge */}
        <g fill={fill}>{union(lx * 3, ly * 3 - 2)}</g>
        <g clipPath={`url(#${id}-body)`}>
          {/* 3 shadowed underside: a band along the flat base (lighter when the light comes from below) */}
          <rect x={x - h} y={y - baseH * 0.9} width={w + h * 2} height={baseH * 2} fill={shade} opacity={ly > 0.3 ? 0.35 : 0.85} />
          {/* 4 lit crescents on the big lobes only */}
          <g fill="none" stroke={lit} strokeLinecap="round" opacity={0.85}>
            {parts.filter((p) => p.big).map((p, i) => (
              <path key={i} d={crescent(p)} strokeWidth={Math.min(p.rx, p.ry) * 0.3} />
            ))}
          </g>
        </g>
      </g>
    </g>
  );
};

/**
 * Stratus: a long thin lens, lit edge toward the light, soft ends. v2.1 round 5: the art director read it as a
 * "saucer line cutting through the clouds" on the dusk frame; it is no longer used in sky scenes (kept for ground fog /
 * valley mist drawn BELOW the cumulus plane, never across it).
 */
export const Stratus: React.FC<{ x: number; y: number; w: number; h: number; fill: string; lit: string; light?: number; opacity?: number }> = ({ x, y, w, h, fill, lit, light = 225, opacity = 1 }) => {
  const [lx, ly] = lightVec(light);
  return (
    <g opacity={opacity}>
      <path d={`M${x} ${y} Q${x + w * 0.15} ${y - h} ${x + w * 0.45} ${y - h * 0.9} T${x + w} ${y - h * 0.1} Q${x + w * 0.7} ${y + h * 0.5} ${x + w * 0.3} ${y + h * 0.35} Q${x + w * 0.08} ${y + h * 0.3} ${x} ${y} Z`} fill={fill} />
      <path d={`M${x + w * 0.1 + lx * 3} ${y - h * 0.3 + ly * 3} Q${x + w * 0.4 + lx * 3} ${y - h * 1.05 + ly * 3} ${x + w * 0.8 + lx * 3} ${y - h * 0.45 + ly * 3}`} fill="none" stroke={lit} strokeWidth={h * 0.22} strokeLinecap="round" opacity={0.7} />
    </g>
  );
};

/**
 * Plume: a cauliflower column (eruption, smoke, steam). Lobes rise from (x, y), the column widens with height and
 * leans with `lean`; each lobe is a shade disc with a lit disc offset toward the light (default: lit from below by the
 * vent). `frame` billows the lobes; `t` 0..1 grows the plume (1 = full height).
 */
export const Plume: React.FC<{
  x: number;
  y: number;
  h: number;
  r0?: number;
  fill: string;
  shade: string;
  lit: string;
  light?: number;
  seed?: number;
  frame?: number;
  t?: number;
  lean?: number;
  levels?: number;
  opacity?: number;
}> = ({ x, y, h, r0 = 30, fill, shade, lit, light = 90, seed = 1, frame = 0, t = 1, lean = 0.15, levels = 7, opacity = 1 }) => {
  const [lx, ly] = lightVec(light);
  const grow = Math.max(0.05, Math.min(1, t));
  const lobes: { cx: number; cy: number; r: number; k: number }[] = [];
  for (let k = 0; k < levels; k++) {
    const u = k / (levels - 1);
    if (u > grow + 0.05) break;
    const lift = Math.min(1, grow / Math.max(0.05, u || 0.05));
    const cy = y - h * Math.pow(u, 0.85) * Math.min(1, grow + 0.1);
    const r = r0 * (1 + 2.2 * u) * (0.9 + 0.1 * Math.sin(frame / 50 + k * 1.7)) * Math.min(1, lift);
    const cx = x + lean * h * u * u + Math.sin(frame / 140 + k) * 6 * u;
    const count = k === 0 ? 2 : 3 + (k % 2);
    for (let j = 0; j < count; j++) {
      const off = ((j - (count - 1) / 2) * r * 0.9) / Math.max(1, (count - 1) / 2);
      lobes.push({ cx: cx + off + (rnd(seed * 5 + k * 3 + j) - 0.5) * r * 0.35, cy: cy + (rnd(seed * 9 + k * 3 + j) - 0.5) * r * 0.3, r: r * (0.7 + rnd(seed * 13 + k * 3 + j) * 0.5), k });
    }
  }
  // paint in three passes over the whole plume (not per lobe), so the shade reads as the mass's shadow side and the
  // highlights as caps, not as concentric rings inside each lobe
  const lk = Math.max(1, levels - 1);
  return (
    <g opacity={opacity}>
      <g fill={shade}>
        {lobes.map((l, i) => (
          <circle key={i} cx={l.cx} cy={l.cy} r={l.r} />
        ))}
      </g>
      <g fill={fill}>
        {lobes.map((l, i) => (
          <circle key={i} cx={l.cx + lx * l.r * 0.14} cy={l.cy + ly * l.r * 0.14} r={l.r * 0.86} />
        ))}
      </g>
      <g fill={lit}>
        {lobes.map((l, i) => (
          <circle key={i} cx={l.cx + lx * l.r * 0.34} cy={l.cy + ly * l.r * 0.34} r={l.r * 0.5} opacity={Math.max(0.05, 0.8 - (l.k / lk) * 0.85)} />
        ))}
      </g>
    </g>
  );
};
