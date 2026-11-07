// Kit v2.1 shared props with bespoke silhouettes (art-director review: "clouds read as saucers, the plume as jelly
// blobs"): layered cumulus with a flat stratus base, thin stratus lenses, and a cauliflower plume for eruptions /
// smoke. Shared props are allowed (hard rule 1 bans shared *bodies*, not a cloud).
import React from "react";
import { rnd } from "./motion";
import { lightVec } from "./light";

/**
 * Cumulus: a flat base with 5-9 rounded lobes of varied size on top, in three tonal steps: base fill, a lit crescent
 * on each lobe toward the light, a shade band along the bottom. `drift` moves it; `boil` (frame) makes the lobes
 * breathe very slightly so a cloud is never a frozen sticker.
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
  const n = lobes ?? 5 + Math.floor(rnd(seed) * 4);
  const parts = Array.from({ length: n }, (_, i) => {
    const u = (i + 0.5) / n;
    const env = Math.sin(u * Math.PI) ** 0.6; // taller in the middle
    const r = h * (0.32 + 0.38 * env) * (0.85 + rnd(seed * 7 + i) * 0.3) * (1 + 0.015 * Math.sin(frame / 90 + i));
    const cx = x + u * w + (rnd(seed * 3 + i) - 0.5) * (w / n) * 0.5;
    const cy = y - r * 0.9 - h * 0.12 * env;
    return { cx, cy, r };
  });
  const baseH = h * 0.22;
  return (
    <g opacity={opacity}>
      {/* shade pass (whole silhouette in shade, slightly lower) */}
      <g fill={shade}>
        <rect x={x - h * 0.05} y={y - baseH} width={w + h * 0.1} height={baseH} rx={baseH / 2} />
        {parts.map((p, i) => (
          <circle key={i} cx={p.cx} cy={p.cy + 3} r={p.r} />
        ))}
      </g>
      {/* body pass, lifted toward the light so the shade shows along the away edge and the bottom */}
      <g fill={fill} transform={`translate(${(lx * 3).toFixed(1)} ${(ly * 3 - 2).toFixed(1)})`}>
        <rect x={x} y={y - baseH - 2} width={w} height={baseH - 2} rx={(baseH - 2) / 2} />
        {parts.map((p, i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r={p.r * 0.96} />
        ))}
      </g>
      {/* lit crescents: smaller discs offset toward the light, kept inside each lobe */}
      <g fill={lit} opacity={0.75}>
        {parts.map((p, i) => (
          <circle key={i} cx={p.cx + lx * p.r * 0.22} cy={p.cy + ly * p.r * 0.22} r={p.r * 0.62} />
        ))}
      </g>
    </g>
  );
};

/** Stratus: a long thin lens, lit edge toward the light, soft ends. */
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
