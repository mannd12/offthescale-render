// L12 shared props (storyboard §5 "Shared first"): the fossil shell (C-06 inside the stone, 6-14 and Z-05 in Tick's
// mitten) and the slate block (the stacking gag 1-01…1-09, the tank raft 2-05, the honesty plate 8-11, the 7-01 scale
// pad). Shared props are allowed; the shots that use them stay bespoke (hard rule 1).
// Accuracy: the shell is a brachiopod (two unequal valves, radial ribs, a straight hinge) - the Ordovician fossil named
// in sources.md #2; it is a schematic, no species is claimed.
import React, { useId } from "react";
import { Family, Form, GroundShadow, KEY_LIGHT, lightVec, mixHex, roundPoly } from "../../lib/illustrated";
import { L12_COLORS } from "./families";

type Pt = [number, number];
const safeId = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, "");

/**
 * FossilShell: a brachiopod seen from the top: a D-shaped valve `r` px across, hinge at the top, radial ribs, a lit
 * rim toward the light and a shadow inset away from it. `rot` tilts it (degrees); `ink` 0..1 fades it into the rock
 * (C-06: "its hatch resolves into a tiny shell"); `ghost` draws only the outline + ribs (for insets and the rock face).
 */
export const FossilShell: React.FC<{ x: number; y: number; r: number; family: Family; light?: number; rot?: number; ink?: number; ghost?: boolean; color?: string; ribs?: number; opacity?: number }> = ({
  x,
  y,
  r,
  family: F,
  light = KEY_LIGHT,
  rot = 0,
  ink = 1,
  ghost = false,
  color = L12_COLORS.limestone,
  ribs = 11,
  opacity = 1,
}) => {
  // valve outline: straight hinge across the top, rounded belly below (local coordinates, scale r)
  const outline: Pt[] = [
    [-0.78, -0.42],
    [0.78, -0.42],
    [0.98, -0.1],
    [0.9, 0.42],
    [0.56, 0.86],
    [0, 1.0],
    [-0.56, 0.86],
    [-0.9, 0.42],
    [-0.98, -0.1],
  ].map(([px, py]) => [x + px * r, y + py * r] as Pt);
  const d = roundPoly(outline, r * 0.12);
  const shell = mixHex(color, F.light, 0.1);
  const rib = mixHex(color, F.shadow, 0.45);
  const beak: Pt = [x, y - 0.42 * r];
  const ribLines = Array.from({ length: ribs }, (_, i) => {
    const a = Math.PI * (0.12 + (0.76 * i) / (ribs - 1));
    const ex = x + Math.cos(a) * r * 0.98;
    const ey = y - 0.42 * r + Math.sin(a) * r * 1.4;
    return `M${beak[0]} ${beak[1]} Q${(beak[0] + ex) / 2 + Math.cos(a) * r * 0.06} ${(beak[1] + ey) / 2} ${ex} ${ey}`;
  });
  const growth = [0.35, 0.6, 0.85].map((k) => `M${x - 0.92 * r * k} ${y + (-0.42 + 0.3 * k) * r} Q${x} ${y + (0.2 + 0.86 * k) * r} ${x + 0.92 * r * k} ${y + (-0.42 + 0.3 * k) * r}`);
  return (
    <g opacity={opacity * ink} transform={`rotate(${rot} ${x} ${y})`}>
      {ghost ? (
        <g fill="none" stroke={rib} strokeWidth={Math.max(1, r * 0.035)} strokeLinecap="round">
          <path d={d} />
          {ribLines.map((p, i) => (
            <path key={i} d={p} opacity={0.8} />
          ))}
        </g>
      ) : (
        <Form d={d} fill={shell} light={light} shadow={F.shadow} inset={Math.max(4, r * 0.16)} shadowOpacity={0.45} rim={F.light} rimWidth={Math.max(1.5, r * 0.04)} rimOpacity={0.8} bounce={F.bounce} stroke={rib} strokeWidth={Math.max(1, r * 0.025)}>
          <g fill="none" stroke={rib} strokeWidth={Math.max(1, r * 0.03)} strokeLinecap="round" opacity={0.7}>
            {ribLines.map((p, i) => (
              <path key={i} d={p} />
            ))}
            {growth.map((p, i) => (
              <path key={`g${i}`} d={p} opacity={0.45} />
            ))}
          </g>
          <line x1={x - 0.78 * r} y1={y - 0.42 * r} x2={x + 0.78 * r} y2={y - 0.42 * r} stroke={rib} strokeWidth={Math.max(1.5, r * 0.05)} />
        </Form>
      )}
    </g>
  );
};

/**
 * SlateBlock: a block of rock in a 2.5-D view: a front face (x, y = bottom-left, w × h), a top face receding up-right
 * by `d`, and a side face. Lit by `light` (the kit's lightVec): the face toward the light is the lit one. `crack`
 * 0..1 grows hairline stress hatching from the bottom edge (1-03, 1-08); `split` 1 draws the crack open (1-09);
 * `squash` {sx, sy} for the landing (use the kit's impact()); `label` is drawn on the front face.
 */
export const SlateBlock: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  d?: number;
  family: Family;
  light?: number;
  color?: string;
  crack?: number;
  split?: number;
  squash?: { sx: number; sy: number };
  label?: string;
  shadow?: boolean;
  opacity?: number;
}> = ({ x, y, w, h, d, family: F, light = KEY_LIGHT, color = L12_COLORS.slate, crack = 0, split = 0, squash, label, shadow = true, opacity = 1 }) => {
  const id = "blk" + safeId(useId());
  const dd = d ?? Math.min(w, h) * 0.38;
  const [lx, ly] = lightVec(light);
  const front = mixHex(color, ly > 0.5 ? F.light : F.shadow, 0.12);
  const top = mixHex(color, ly < 0 ? F.light : F.shadow, ly < 0 ? 0.38 : 0.2);
  const side = mixHex(color, lx > 0 ? F.light : F.shadow, lx > 0 ? 0.22 : 0.4);
  const sx = squash?.sx ?? 1;
  const sy = squash?.sy ?? 1;
  const frontD = `M${x} ${y} L${x + w} ${y} L${x + w} ${y - h} L${x} ${y - h} Z`;
  const topD = `M${x} ${y - h} L${x + w} ${y - h} L${x + w + dd} ${y - h - dd * 0.6} L${x + dd} ${y - h - dd * 0.6} Z`;
  const sideD = `M${x + w} ${y} L${x + w + dd} ${y - dd * 0.6} L${x + w + dd} ${y - h - dd * 0.6} L${x + w} ${y - h} Z`;
  const hatch = Math.max(0, Math.min(1, crack));
  const cracks = hatch > 0 ? Array.from({ length: 7 }, (_, i) => {
    const cx = x + w * (0.1 + 0.8 * ((i * 0.37 + 0.11) % 1));
    const len = h * (0.18 + 0.42 * ((i * 0.53 + 0.2) % 1)) * hatch;
    const lean = ((i % 3) - 1) * w * 0.08;
    return `M${cx} ${y} l${lean * 0.4} ${-len * 0.4} l${-lean * 0.3} ${-len * 0.35} l${lean * 0.5} ${-len * 0.25}`;
  }) : [];
  return (
    <g opacity={opacity} transform={`translate(${x} ${y}) scale(${sx} ${sy}) translate(${-x} ${-y})`}>
      {shadow ? <GroundShadow x={x + w / 2 + dd * 0.4} y={y + 2} rx={w * 0.62} ry={w * 0.14} color={F.shadow} opacity={0.35} blur={8} /> : null}
      <path d={sideD} fill={side} />
      <path d={topD} fill={top} />
      {/* bedding line on the top face */}
      <path d={`M${x + dd * 0.3} ${y - h - dd * 0.18} L${x + w + dd * 0.3} ${y - h - dd * 0.18}`} stroke={mixHex(top, F.shadow, 0.25)} strokeWidth={1.5} opacity={0.6} />
      <Form d={frontD} fill={front} light={light} shadow={F.shadow} inset={Math.max(4, Math.min(w, h) * 0.07)} shadowOpacity={0.2} rim={F.light} rimWidth={1.5} rimOpacity={0.45}>
        <clipPath id={id}>
          <path d={frontD} />
        </clipPath>
        <g clipPath={`url(#${id})`}>
          {/* two bedding lines */}
          <line x1={x} y1={y - h * 0.38} x2={x + w} y2={y - h * 0.34} stroke={mixHex(front, F.shadow, 0.3)} strokeWidth={1.5} opacity={0.5} />
          <line x1={x} y1={y - h * 0.7} x2={x + w} y2={y - h * 0.74} stroke={mixHex(front, F.shadow, 0.3)} strokeWidth={1.5} opacity={0.4} />
          {cracks.map((p, i) => (
            <path key={i} d={p} fill="none" stroke={F.shadow} strokeWidth={1.4 + split * 2} strokeLinecap="round" opacity={0.5 + hatch * 0.4} />
          ))}
          {split > 0 ? <path d={`M${x + w * 0.45} ${y} L${x + w * 0.52} ${y - h * 0.45} L${x + w * 0.42} ${y - h * 0.7} L${x + w * 0.55} ${y - h}`} fill="none" stroke={F.shadow} strokeWidth={2 + split * 5} strokeLinejoin="round" opacity={split} /> : null}
        </g>
      </Form>
      <path d={frontD} fill="none" stroke={mixHex(color, F.shadow, 0.5)} strokeWidth={1.5} opacity={0.6} />
      {label ? (
        <text x={x + w / 2} y={y - h / 2 + 8} textAnchor="middle" style={{ fontFamily: "'Anton', sans-serif", fontSize: Math.max(14, Math.min(w, h) * 0.28), letterSpacing: 3, fill: F.text, textTransform: "uppercase" }}>
          {label}
        </text>
      ) : null}
    </g>
  );
};
