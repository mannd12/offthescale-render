// Kit v2 typography (docs/STYLE-V2.md §7): designed titles, not diagram labels. Outfit 800 (geometric display) for
// headlines and chapter titles, Anton for small spaced kickers, Inter 800 tabular for numbers. Text sits in the SVG so
// it rides the camera when it should (labels on things) or on a depth-0 Layer when it should not (titles).
import React from "react";
import { IF } from "./type";

export const IF2 = {
  display: "'Outfit', 'Inter', 'Helvetica Neue', Arial, sans-serif",
  label: IF.label,
  num: IF.num,
} as const;

/**
 * Headline: one or two lines of display type with tight tracking; the second line may take the accent colour.
 * A short rule in the accent sits above the first line (the channel's "tick" motif). Left-aligned by default.
 */
export const Headline: React.FC<{
  x: number;
  y: number;
  lines: [string] | [string, string];
  size?: number;
  color: string;
  accent?: string;
  align?: "start" | "middle" | "end";
  rule?: boolean;
  weight?: number;
  shadow?: string;
}> = ({ x, y, lines, size = 96, color, accent, align = "start", rule = true, weight = 800, shadow }) => {
  const lh = size * 0.98;
  const ruleW = size * 0.6;
  const rx = align === "start" ? x : align === "end" ? x - ruleW : x - ruleW / 2;
  const style = (c: string): React.CSSProperties => ({
    fontFamily: IF2.display,
    fontWeight: weight,
    fontSize: size,
    letterSpacing: -size * 0.03,
    fill: c,
  });
  return (
    <g>
      {rule ? <rect x={rx} y={y - size * 0.96 - 22} width={ruleW} height={Math.max(4, size * 0.07)} rx={2} fill={accent ?? color} /> : null}
      {shadow
        ? lines.map((l, i) => (
            <text key={"s" + i} x={x + 3} y={y + i * lh + 3} textAnchor={align} style={{ ...style(shadow), opacity: 0.35 }}>
              {l}
            </text>
          ))
        : null}
      {lines.map((l, i) => (
        <text key={i} x={x} y={y + i * lh} textAnchor={align} style={style(i === 1 && accent ? accent : color)}>
          {l}
        </text>
      ))}
    </g>
  );
};

/** Kicker: a small all-caps spaced label with a leading dash ("— CHAPTER TWO", "— MARS"). */
export const Kicker: React.FC<{ x: number; y: number; text: string; color: string; size?: number; align?: "start" | "end" }> = ({ x, y, text, color, size = 24, align = "start" }) => (
  <g>
    <rect x={align === "start" ? x : x - size * 1.1} y={y - size * 0.36} width={size * 1.1} height={2.5} fill={color} opacity={0.8} />
    <text x={align === "start" ? x + size * 1.5 : x - size * 1.5} y={y} textAnchor={align} style={{ fontFamily: IF2.label, fontSize: size, letterSpacing: size * 0.22, fill: color, textTransform: "uppercase" }}>
      {text}
    </text>
  </g>
);

/** Metric: a big tabular number with a small unit, baseline-aligned ("8,849 m", "194 dB"). */
export const Metric: React.FC<{ x: number; y: number; value: string; unit?: string; size?: number; color: string; unitColor?: string; align?: "start" | "middle" | "end" }> = ({
  x,
  y,
  value,
  unit,
  size = 72,
  color,
  unitColor,
  align = "start",
}) => (
  <text x={x} y={y} textAnchor={align} style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: size, fontVariantNumeric: "tabular-nums", fill: color, letterSpacing: -size * 0.02 }}>
    {value}
    {unit ? (
      <tspan dx={size * 0.12} style={{ fontSize: size * 0.42, fontWeight: 500, fill: unitColor ?? color, letterSpacing: 0 }}>
        {unit}
      </tspan>
    ) : null}
  </text>
);

/** Pill: a rounded tag with a dot, for one-word object labels ("EVEREST", "OLYMPUS MONS"). Width from text length. */
export const Pill: React.FC<{ x: number; y: number; text: string; fill: string; color: string; dot?: string; size?: number; align?: "start" | "middle" | "end" }> = ({
  x,
  y,
  text,
  fill,
  color,
  dot,
  size = 22,
  align = "start",
}) => {
  const w = text.length * size * 0.62 + size * (dot ? 2.4 : 1.4);
  const h = size * 1.7;
  const x0 = align === "start" ? x : align === "end" ? x - w : x - w / 2;
  return (
    <g>
      <rect x={x0} y={y - h / 2} width={w} height={h} rx={h / 2} fill={fill} />
      {dot ? <circle cx={x0 + size * 0.95} cy={y} r={size * 0.26} fill={dot} /> : null}
      <text x={x0 + (dot ? size * 1.6 : size * 0.7)} y={y + size * 0.36} style={{ fontFamily: IF2.label, fontSize: size, letterSpacing: size * 0.12, fill: color, textTransform: "uppercase" }}>
        {text}
      </text>
    </g>
  );
};

/** Leader: a thin line from an object to its label with a small dot at the object end. */
export const Leader: React.FC<{ from: [number, number]; to: [number, number]; color: string; width?: number; elbow?: boolean }> = ({ from, to, color, width = 1.6, elbow = true }) => (
  <g stroke={color} strokeWidth={width} fill="none" strokeLinecap="round">
    <circle cx={from[0]} cy={from[1]} r={3.2} fill={color} stroke="none" />
    <path d={elbow ? `M${from[0]} ${from[1]} L${to[0]} ${from[1]} L${to[0]} ${to[1]}` : `M${from[0]} ${from[1]} L${to[0]} ${to[1]}`} />
  </g>
);

/** Text with a soft contrast halo (for labels over busy art): the halo is a thick stroke in the backdrop colour. */
export const HaloText: React.FC<{ x: number; y: number; text: string; color: string; halo: string; size?: number; font?: string; weight?: number; align?: "start" | "middle" | "end"; spacing?: number; upper?: boolean }> = ({
  x,
  y,
  text,
  color,
  halo,
  size = 26,
  font = IF2.label,
  weight = 400,
  align = "start",
  spacing = 2,
  upper = true,
}) => {
  const st: React.CSSProperties = { fontFamily: font, fontWeight: weight, fontSize: size, letterSpacing: spacing, textTransform: upper ? "uppercase" : "none" };
  return (
    <g>
      <text x={x} y={y} textAnchor={align} style={{ ...st, fill: halo, stroke: halo, strokeWidth: size * 0.28, strokeLinejoin: "round", opacity: 0.85 }}>
        {text}
      </text>
      <text x={x} y={y} textAnchor={align} style={{ ...st, fill: color }}>
        {text}
      </text>
    </g>
  );
};
