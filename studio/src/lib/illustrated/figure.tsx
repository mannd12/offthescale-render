// The Reference Figure: a faceless 1.7 m pictogram person in vermilion, always drawn to the scene's scale.
// Straight-edged polygons + one circle (head). No face, no hands, no expression: it is a ruler, not a
// character. It is the only "person" the channel ever shows.
import React from "react";
import { P, shade } from "./palette";

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
  /** walk cycle phase in strides (frame / framesPerStride); undefined = standing still */
  walk?: number;
  /** breathing: pass the frame; the chest rises ~1.5 % every ~3 s */
  breath?: number;
  /** head turn, -1 (looking back) .. 1 (looking ahead); shifts and tilts the head, no face */
  look?: number;
  /** two-tone: far arm and far leg in a shadow tone of the figure colour (default on) */
  shaded?: boolean;
}> = ({ x, y, pxPerM, pose = "stand", color = P.vermilion, outline, sway = 0, facing = 1, walk, breath, look = 0, shaded = true }) => {
  const s = pxPerM / 100;
  const far = shaded ? shade(color, 0.3) : color;
  const stroke = outline ? { stroke: outline, strokeWidth: 2 / s, strokeLinejoin: "round" as const } : {};
  const ph = walk === undefined ? 0 : Math.sin(walk * Math.PI * 2);
  const legA = walk === undefined ? 0 : 20 * ph;
  const armA = walk === undefined ? 0 : 16 * ph;
  const lift = walk === undefined ? 0 : -3 * Math.abs(Math.cos(walk * Math.PI * 2));
  const chest = breath === undefined ? 1 : 1 + 0.015 * Math.sin((breath / 95) * Math.PI * 2);
  const pointing = pose === "point";
  return (
    <g transform={`translate(${x} ${y}) rotate(${sway}) scale(${s * facing} ${s})`}>
      <g transform={`translate(0 ${lift})`}>
        {/* far limbs first, in the shadow tone */}
        <path d={BODY.legR} fill={far} transform={`rotate(${-legA} 8 -84)`} {...stroke} />
        {pointing ? null : <path d={BODY.armR} fill={far} transform={`rotate(${armA} 27 -138)`} {...stroke} />}
        <g transform={`translate(0 -82) scale(1 ${chest}) translate(0 82)`}>
          <path d={BODY.torso} fill={color} {...stroke} />
          <path d={BODY.neck} fill={color} {...stroke} />
          <g transform={`rotate(${look * 6} 0 -146)`}>
            <circle cx={look * 3.5} cy={-158} r={11} fill={color} {...stroke} />
          </g>
          {pointing ? <path d={BODY.armRPoint} fill={color} {...stroke} /> : null}
          <path d={BODY.armL} fill={color} transform={`rotate(${-armA} -27 -138)`} {...stroke} />
        </g>
        <path d={BODY.legL} fill={color} transform={`rotate(${legA} -8 -84)`} {...stroke} />
      </g>
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
