// The vertical scale gauge: the channel's signature. A ruler with a vermilion fill that climbs (or
// descends) with the story's running value. When the value outruns the ruler, the marker pins to the
// end with an "off the scale" chevron, and the ruler can zoom out by a power of ten (animate `max`
// with decadeZoom()). Ticks are re-derived from `max` every frame, so the zoom is continuous.
import React from "react";
import { P, Theme } from "./palette";
import { IF, fmt } from "./type";

/** A "nice" tick step (1, 2 or 5 × 10^k) giving about `target` intervals over [0, max]. */
export const niceStep = (max: number, target = 5) => {
  const raw = max / target;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const n = raw / mag;
  return (n < 1.5 ? 1 : n < 3.5 ? 2 : n < 7.5 ? 5 : 10) * mag;
};

/** Ruler length between two decades: t=0 → from, t=1 → to, interpolated in log space. */
export const decadeZoom = (from: number, to: number, t: number) => Math.exp(Math.log(from) + (Math.log(to) - Math.log(from)) * t);

export type GaugeProps = {
  x: number;
  /** top of the ruler */
  y: number;
  height: number;
  value: number;
  max: number;
  unit: string;
  theme: Theme;
  /** "down": 0 at the top, values grow downward (depth). "up": 0 at the bottom (height, temperature). */
  direction?: "down" | "up";
  /** caption above the ruler, one word ("DEPTH") */
  title?: string;
  /** label formatter for tick values */
  format?: (v: number) => string;
  /** show the vermilion readout box beside the marker */
  readout?: boolean;
  /** override readout text (e.g. "12,262 m") */
  readoutText?: string;
  /** extra labelled ticks in a muted colour (e.g. a reference value) */
  marks?: { v: number; label: string }[];
  /** which side the tick labels sit on */
  side?: "left" | "right";
  ticks?: number;
  /** flat backing plate behind spine + labels, so the ruler stays legible over busy strata (width in px) */
  plate?: number;
  /** plate overhang above and below the ruler (px) */
  platePad?: number;
  /** draw the value marker (off for a pure ruler) */
  marker?: boolean;
  /** unit caption under the ruler (off when tick labels already carry the unit) */
  unitCap?: boolean;
};

export const Gauge: React.FC<GaugeProps> = ({
  x,
  y,
  height,
  value,
  max,
  unit,
  theme,
  direction = "down",
  title,
  format = (v) => fmt(v),
  readout = true,
  readoutText,
  marks = [],
  side = "left",
  ticks = 5,
  plate = 0,
  platePad = 16,
  marker = true,
  unitCap = true,
}) => {
  const W = 14; // spine width
  const step = niceStep(max, ticks);
  const minor = step / 5;
  const off = value > max;
  const vClamped = Math.min(value, max);
  const pos = (v: number) => (direction === "down" ? y + (v / max) * height : y + height - (v / max) * height);
  const vy = pos(vClamped);
  const sgn = side === "left" ? -1 : 1;
  const tickX = side === "left" ? x : x + W;
  const minorTicks = Math.floor(max / minor) <= 80 ? Array.from({ length: Math.floor(max / minor) + 1 }, (_, i) => i * minor) : [];
  const majorTicks = Array.from({ length: Math.floor(max / step + 1e-9) + 1 }, (_, i) => i * step);
  const fillTop = direction === "down" ? y : vy;
  const fillH = direction === "down" ? vy - y : y + height - vy;
  const rText = readoutText ?? `${format(value)} ${unit}`;
  const rW = Math.max(150, rText.length * 24 + 40);
  // readout sits opposite the tick labels; if that would run off the frame edge (gauge near the right edge with
  // side="left", the L11 lesson), it flips to the outside of the plate instead
  const rX = side === "left" ? (x + W + 18 + rW > 1890 ? x - plate - 18 - rW : x + W + 18) : x - 18 - rW < 30 ? x + W + plate + 18 : x - 18 - rW;
  const ry = off ? (direction === "down" ? y + height + 52 : y - 52) : vy;
  return (
    <g>
      {plate > 0 ? (
        <rect
          x={side === "left" ? x - plate : x - 12}
          y={y - platePad}
          width={plate + W + 12}
          height={height + platePad * 2}
          fill={theme.bg}
          stroke={theme.line}
          strokeWidth={1.5}
          opacity={0.94}
        />
      ) : null}
      {title ? (
        <text x={x + W / 2} y={y - 44} textAnchor="middle" style={{ fontFamily: IF.label, fontSize: 26, letterSpacing: 4, fill: theme.dim }}>
          {title}
        </text>
      ) : null}
      {/* spine */}
      <rect x={x} y={y} width={W} height={height} fill={theme.panel} stroke={theme.line} strokeWidth={1.5} />
      <rect x={x} y={fillTop} width={W} height={Math.max(0, fillH)} fill={P.vermilion} />
      {/* ticks */}
      <g stroke={theme.line} strokeWidth={1.5}>
        {minorTicks.map((v) => (
          <line key={`m${v}`} x1={tickX} y1={pos(v)} x2={tickX + sgn * 9} y2={pos(v)} opacity={0.55} />
        ))}
        {majorTicks.map((v) => (
          <line key={`M${v}`} x1={tickX} y1={pos(v)} x2={tickX + sgn * 20} y2={pos(v)} strokeWidth={2} />
        ))}
      </g>
      {majorTicks.map((v) => (
        <text
          key={`t${v}`}
          x={tickX + sgn * 30}
          y={pos(v) + 8}
          textAnchor={side === "left" ? "end" : "start"}
          style={{ fontFamily: IF.num, fontWeight: 500, fontSize: 22, fontVariantNumeric: "tabular-nums", fill: theme.dim }}
        >
          {format(v)}
        </text>
      ))}
      {marks.map((m) => (
        <g key={m.label}>
          <line x1={tickX} y1={pos(m.v)} x2={tickX + sgn * 34} y2={pos(m.v)} stroke={theme.dim} strokeWidth={2} strokeDasharray="4 4" />
          <text x={tickX + sgn * 42} y={pos(m.v) + 8} textAnchor={side === "left" ? "end" : "start"} style={{ fontFamily: IF.label, fontSize: 22, letterSpacing: 2, fill: theme.dim }}>
            {m.label}
          </text>
        </g>
      ))}
      {/* unit cap at the far end */}
      <text
        x={x + W / 2}
        y={direction === "down" ? y + height + 34 : y + height + 34}
        textAnchor="middle"
        style={{ fontFamily: IF.label, fontSize: 22, letterSpacing: 3, fill: theme.dim }}
        opacity={off || !unitCap ? 0 : 1}
      >
        {unit}
      </text>
      {/* marker */}
      {!marker ? null : off ? (
        <g fill={P.vermilion}>
          {[0, 1].map((k) => {
            const yy = direction === "down" ? y + height + 8 + k * 14 : y - 8 - k * 14;
            const d = direction === "down" ? 1 : -1;
            return <path key={k} d={`M${x - 6} ${yy} L${x + W / 2} ${yy + d * 12} L${x + W + 6} ${yy} L${x + W + 6} ${yy + d * 5} L${x + W / 2} ${yy + d * 17} L${x - 6} ${yy + d * 5} Z`} />;
          })}
        </g>
      ) : (
        <path d={`M${x + W + 2} ${vy} L${x + W + 16} ${vy - 10} L${x + W + 16} ${vy + 10} Z`} fill={P.vermilion} transform={side === "left" ? undefined : `translate(${2 * x + W} 0) scale(-1 1)`} />
      )}
      {readout ? (
        <g>
          <rect x={off ? x + W / 2 - rW / 2 : rX} y={ry - 30} width={rW} height={60} fill={P.vermilion} />
          <text
            x={(off ? x + W / 2 - rW / 2 : rX) + rW / 2}
            y={ry + 13}
            textAnchor="middle"
            style={{ fontFamily: IF.num, fontWeight: 800, fontSize: 36, fontVariantNumeric: "tabular-nums", fill: P.bone }}
          >
            {rText}
          </text>
        </g>
      ) : null}
    </g>
  );
};
