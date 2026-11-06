// Cartographic line vocabulary: hatch fills, contour (iso) lines, straight-edged strata and tick rulers.
// All shapes are polygons and circles with thin strokes. No blur, no gradients.
import React from "react";
import { rnd } from "./motion";

/**
 * Hatch pattern definitions. Put one <Hatch> inside an SVG, then fill={`url(#${id})`}.
 * Layer a flat-colour shape under a hatched copy to get "tone + texture".
 */
export const Hatch: React.FC<{ id: string; color: string; gap?: number; angle?: number; width?: number; cross?: boolean; dots?: boolean }> = ({
  id,
  color,
  gap = 14,
  angle = 45,
  width = 1.6,
  cross = false,
  dots = false,
}) => (
  <defs>
    <pattern id={id} width={gap} height={gap} patternUnits="userSpaceOnUse" patternTransform={`rotate(${angle})`}>
      {dots ? (
        <circle cx={gap / 2} cy={gap / 2} r={width} fill={color} />
      ) : (
        <>
          <line x1={0} y1={0} x2={0} y2={gap} stroke={color} strokeWidth={width} />
          {cross ? <line x1={0} y1={gap / 2} x2={gap} y2={gap / 2} stroke={color} strokeWidth={width} /> : null}
        </>
      )}
    </pattern>
  </defs>
);

/**
 * A wavy, straight-segmented horizon line across [x0, x1] at baseline y: the edge of a stratum.
 * Segments are straight (polyline), never curves, so it reads as a drafted contour, not a blob.
 */
export const strataLine = (x0: number, x1: number, y: number, amp: number, seed: number, step = 60) => {
  const pts: [number, number][] = [];
  for (let x = x0, i = 0; x <= x1 + 0.1; x += step, i++) {
    const w = Math.sin(i * 0.9 + seed) * 0.6 + (rnd(seed * 13 + i) - 0.5) * 0.8;
    pts.push([x, y + w * amp]);
  }
  if (pts[pts.length - 1][0] < x1) pts.push([x1, y]);
  return pts;
};
export const ptsToPath = (pts: [number, number][]) => "M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L");

/** A closed stratum polygon between two strata lines (top edge left→right, bottom edge right→left). */
export const stratumPath = (top: [number, number][], bottom: [number, number][]) =>
  ptsToPath([...top, ...[...bottom].reverse()]) + " Z";

/** Contour (iso) lines: n nested offsets of a strata line, for heat, pressure or terrain. */
export const Contours: React.FC<{
  x0: number;
  x1: number;
  y: number;
  n: number;
  gap: number;
  amp: number;
  seed: number;
  color: string;
  width?: number;
  dash?: string;
  dashOffset?: number;
  opacity?: number;
}> = ({ x0, x1, y, n, gap, amp, seed, color, width = 1.5, dash, dashOffset = 0, opacity = 1 }) => (
  <g opacity={opacity} fill="none" stroke={color} strokeWidth={width} strokeLinejoin="round" strokeDasharray={dash} strokeDashoffset={dashOffset}>
    {Array.from({ length: n }, (_, i) => (
      <path key={i} d={ptsToPath(strataLine(x0, x1, y + i * gap, amp * (1 + i * 0.08), seed + i * 0.35))} />
    ))}
  </g>
);

/** Survey-chart frame chrome: corner registration ticks and an inset hairline border. */
export const CornerTicks: React.FC<{ color: string; inset?: number; len?: number; opacity?: number }> = ({ color, inset = 36, len = 26, opacity = 0.7 }) => {
  const W = 1920;
  const H = 1080;
  const c: [number, number, number, number][] = [
    [inset, inset, 1, 1],
    [W - inset, inset, -1, 1],
    [inset, H - inset, 1, -1],
    [W - inset, H - inset, -1, -1],
  ];
  return (
    <g stroke={color} strokeWidth={2} opacity={opacity}>
      {c.map(([x, y, sx, sy], i) => (
        <g key={i}>
          <line x1={x} y1={y} x2={x + len * sx} y2={y} />
          <line x1={x} y1={y} x2={x} y2={y + len * sy} />
        </g>
      ))}
    </g>
  );
};

/** Map-style scale bar: a segmented bar with a length label ("1 m", "1,000 km"). */
export const ScaleBar: React.FC<{ x: number; y: number; px: number; label: string; color: string; segments?: number; font: string }> = ({
  x,
  y,
  px,
  label,
  color,
  segments = 4,
  font,
}) => (
  <g>
    {Array.from({ length: segments }, (_, i) => (
      <rect key={i} x={x + (i * px) / segments} y={y} width={px / segments} height={8} fill={i % 2 ? "none" : color} stroke={color} strokeWidth={1.5} />
    ))}
    <text x={x + px + 14} y={y + 9} fill={color} style={{ fontFamily: font, fontSize: 22, letterSpacing: 2 }}>
      {label}
    </text>
  </g>
);
