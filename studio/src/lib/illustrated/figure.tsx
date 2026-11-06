// The Reference Figure: a faceless 1.7 m pictogram person in vermilion, always drawn to the scene's scale.
// Straight-edged polygons + one circle (head). No face, no hands, no expression: it is a ruler, not a
// character. It is the only "person" the channel ever shows.
import React from "react";
import { P } from "./palette";

export const FIGURE_METRES = 1.7;

type Pose = "stand" | "point";
/** Drawn in a 170-unit-tall box (100 units = 1 m), origin at the feet, centred. */
const BODY = {
  // torso: shoulders 46 wide at y=-140, hips 32 wide at y=-82
  torso: "M-23 -140 L23 -140 L16 -82 L-16 -82 Z",
  neck: "M-5 -146 L5 -146 L5 -138 L-5 -138 Z",
  legL: "M-16 -84 L-1.5 -84 L-4 0 L-15 0 Z",
  legR: "M1.5 -84 L16 -84 L15 0 L4 0 Z",
  armL: "M-23 -140 L-31 -136 L-30 -78 L-23 -78 L-21 -128 Z",
  armR: "M23 -140 L31 -136 L30 -78 L23 -78 L21 -128 Z",
  // pointing arm, angled out and down toward the ground at the figure's right
  armRPoint: "M22 -140 L29 -134 L66 -98 L60 -91 L22 -122 Z",
};

export const ReferenceFigure: React.FC<{
  x: number;
  /** y of the feet (ground line) */
  y: number;
  /** pixels per metre in this scene; the figure is FIGURE_METRES tall at this scale */
  pxPerM: number;
  pose?: Pose;
  color?: string;
  /** thin outline for small sizes on busy backgrounds */
  outline?: string;
  /** degrees, for a gentle ambient sway (pivot at the feet) */
  sway?: number;
  facing?: 1 | -1;
}> = ({ x, y, pxPerM, pose = "stand", color = P.vermilion, outline, sway = 0, facing = 1 }) => {
  const s = pxPerM / 100;
  const parts = [BODY.torso, BODY.neck, BODY.legL, BODY.legR, BODY.armL, pose === "point" ? BODY.armRPoint : BODY.armR];
  const stroke = outline ? { stroke: outline, strokeWidth: 2 / s, strokeLinejoin: "round" as const } : {};
  return (
    <g transform={`translate(${x} ${y}) rotate(${sway}) scale(${s * facing} ${s})`}>
      {parts.map((d, i) => (
        <path key={i} d={d} fill={color} {...stroke} />
      ))}
      <circle cx={0} cy={-158} r={11} fill={color} {...stroke} />
    </g>
  );
};

/** "You are here": a vermilion pin (downward triangle on a stem) with an optional one-word label. */
export const YouAreHere: React.FC<{ x: number; y: number; size?: number; label?: string; font: string; labelColor?: string; side?: "left" | "right" }> = ({
  x,
  y,
  size = 28,
  label,
  font,
  labelColor = P.vermilion,
  side = "right",
}) => (
  <g>
    <path d={`M${x} ${y} L${x - size * 0.55} ${y - size} L${x + size * 0.55} ${y - size} Z`} fill={P.vermilion} />
    <circle cx={x} cy={y} r={size * 0.16} fill={P.vermilion} />
    {label ? (
      <text
        x={side === "right" ? x + size * 0.9 : x - size * 0.9}
        y={y - size * 0.3}
        textAnchor={side === "right" ? "start" : "end"}
        style={{ fontFamily: font, fontSize: size * 1.05, letterSpacing: 2, fill: labelColor, textTransform: "uppercase" }}
      >
        {label}
      </text>
    ) : null}
  </g>
);
