// Kit movers (promoted from L12 polish pass b, 2026-11-11). The craft probe (0.5-s steps at 96x54) only sees motion
// that moves sizeable, contrasty EDGES: a drift over flat fields or 2-px motes reads as frozen. These draw defined-edge
// masses that cross the frame at ~1.5-4 px per frame. They carry no numbers and claim nothing; shot bodies stay bespoke.
import React from "react";
import { lane } from "./ambient";
import { rnd } from "./motion";
import { FAMILIES, type Family } from "./palette2";
import { Cumulus } from "./props";
import { smoothPath, type Pt } from "./shapes";

/** Fade in over the first 12 % of a lane, out over the last 18 % (so a wrapping mover never pops). */
export const laneFade = (phase: number) => Math.min(1, phase / 0.12, (1 - phase) / 0.18);

/** A rack of flat-based cloud masses (or dust banks) drifting along x and wrapping in [x0, x1]: merged lobes on a
 *  base slab, a body tone and a darker or lit underside strip. `size` = the mass height in px; speed in px/frame. */
export const CloudRack: React.FC<{ f: number; n: number; x0: number; x1: number; y0: number; y1: number; size: number; speed: number; body: string; under?: string; top?: string; opacity?: number; seed?: number; dir?: 1 | -1; flat?: number }> = ({ f, n, x0, x1, y0, y1, size, speed, body, under, top, opacity = 1, seed = 1, dir = 1, flat = 1 }) => (
  <g>
    {lane(f, n, x0, x1, speed, seed, dir).map((p, i) => {
      const s = size * (0.65 + rnd(seed * 13 + i) * 0.7);
      const w = s * (2.3 + rnd(seed * 7 + i) * 0.7) * flat;
      const y = y0 + ((i + rnd(seed * 3 + i) * 0.6) / Math.max(1, n)) * (y1 - y0);
      const x = p.x - w / 2;
      const lobes: [number, number, number][] = [
        [0.22, 0.42 + rnd(i * 5 + seed) * 0.12, 0.08],
        [0.47, 0.6 + rnd(i * 9 + seed) * 0.14, 0.28],
        [0.72, 0.44 + rnd(i * 11 + seed) * 0.1, 0.12],
      ];
      const o = laneFade(p.phase) * opacity;
      return (
        <g key={i} opacity={o}>
          <g fill={body}>
            {/* the flat base only spans the lobes (a slab wider than the lobes reads as "balls on a bar") */}
            <rect x={x + w * 0.16} y={y - s * 0.3} width={w * 0.68} height={s * 0.3} rx={s * 0.15} />
            {lobes.map(([u, r, lift], k) => (
              <ellipse key={k} cx={x + u * w} cy={y - s * 0.2 - lift * s} rx={r * s * flat} ry={r * s * 0.9} />
            ))}
          </g>
          {top ? (
            <ellipse cx={x + 0.47 * w - s * 0.1} cy={y - s * 0.2 - 0.28 * s - s * 0.32} rx={s * 0.34 * flat} ry={s * 0.16} fill={top} opacity={0.8} />
          ) : null}
          {under ? <ellipse cx={x + w * 0.5} cy={y - s * 0.12} rx={w * 0.3} ry={s * 0.09} fill={under} opacity={0.45} /> : null}
        </g>
      );
    })}
  </g>
);

/** Spindrift / wind streaks: n rounded strokes, `len` px long, streaming along x (with `slope` px of y per px of x)
 *  through the box [x0, x1] × [y0, y1] at `speed` px/frame. Each one swells and thins as it crosses. */
export const Streamers: React.FC<{ f: number; n: number; x0: number; x1: number; y0: number; y1: number; len: number; width: number; speed: number; color: string; opacity?: number; slope?: number; seed?: number; dir?: 1 | -1 }> = ({ f, n, x0, x1, y0, y1, len, width, speed, color, opacity = 0.6, slope = 0, seed = 1, dir = 1 }) => (
  <g stroke={color} fill="none" strokeLinecap="round">
    {lane(f, n, x0, x1, speed, seed, dir).map((p, i) => {
      const L = len * (0.5 + rnd(seed * 17 + i));
      const y = y0 + rnd(seed * 23 + i) * (y1 - y0) + slope * (p.x - x0);
      const sw = Math.max(1, width * (0.6 + rnd(seed * 29 + i) * 0.8) * Math.sin(Math.PI * p.phase));
      const bend = Math.sin(f / 11 + i) * 6;
      return <path key={i} d={`M${p.x} ${y} q ${(-dir * L) / 2} ${bend} ${-dir * L} ${-slope * L * dir}`} strokeWidth={sw} opacity={opacity * laneFade(p.phase)} />;
    })}
  </g>
);

/** Water caustics: `rows` wavy bright lines laid across [x, x+w] × [y, y+h], wobbling and sliding down-right at `speed`
 *  px/frame (they wrap one row-spacing). For a shallow-sea ghost or a lit pool; keep opacity ≤ 0.35. */
export const Caustics: React.FC<{ f: number; x: number; y: number; w: number; h: number; rows: number; color: string; width?: number; opacity?: number; speed?: number }> = ({ f, x, y, w, h, rows, color, width = 7, opacity = 0.3, speed = 1.6 }) => {
  const gap = h / rows;
  const off = (f * speed) % gap;
  return (
    <g stroke={color} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={opacity}>
      {Array.from({ length: rows + 1 }, (_, i) => {
        const y0 = y + (i - 1) * gap + off;
        const pts: Pt[] = [];
        for (let k = 0; k <= 16; k++) {
          const px = x + (w * k) / 16;
          pts.push([px, y0 + Math.sin(px / 150 + f / 17 + i * 1.7) * gap * 0.22 + Math.sin(px / 70 - f / 23 + i) * gap * 0.08 + (px - x) * 0.12]);
        }
        return <path key={i} d={smoothPath(pts)} strokeWidth={width * (0.7 + 0.3 * Math.sin(f / 13 + i * 2.1))} />;
      })}
    </g>
  );
};


/**
 * The L12 studio set (polish pass (a), 2026-11-11). The bone room measured as the greyest stretch of the video (HSV
 * saturation 0.18-0.19 at 1:00, 3:30 and 9:00), so the studio keeps its roles but is pushed to the colour targets: a
 * teal cyclorama (the family's mint `second`, deepened), warm ochre floor and hills under the gold key, cool blue-teal
 * shadows. Text stays dark (the cyc's top is mid-value). Shared by l01, l04, l08 and the closer.
 */
export const STUDIO_SET: Family = {
  ...FAMILIES.studio,
  sky: ["#2A8890", "#3AA29F", "#66BEAD", "#A4DBC5"],
  far: "#5AAE9F",
  mid: "#E3A256",
  near: "#D2843F",
  haze: "#A4DBC5",
  shadow: "#1E4A5C",
  dim: "#1F4549",
};

/** Painted cut-out clouds sliding across the studio cyc at ~1.6-2.4 px per frame: the motion floor of the studio shots
 *  (defined cream edges on teal register at the probe's 96×54 / 0.5-s steps; a slow push over flat paper did not). */
export const CycClouds: React.FC<{ f: number; y?: number; n?: number; seed?: number; opacity?: number }> = ({ f, y = 150, n = 4, seed = 1, opacity = 1 }) => (
  <g opacity={opacity}>
    {Array.from({ length: n }, (_, i) => {
      const w = 380 + rnd(seed * 7 + i) * 220;
      const v = 1.6 + rnd(seed * 3 + i) * 0.8;
      const x = ((((i / n) * 2900 + rnd(seed + i) * 300 + f * v) % 2900) + 2900) % 2900 - 700;
      return <Cumulus key={i} x={x} y={y + rnd(seed * 11 + i) * 230} w={w} h={w * 0.27} fill="#FFF4DE" shade="#BFE3D6" lit="#FFFFFF" seed={seed * 5 + i} frame={f} />;
    })}
  </g>
);
