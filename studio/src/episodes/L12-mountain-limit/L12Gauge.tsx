// L12Gauge: the episode's screen-locked HEIGHT gauge (storyboard §5 "Shared first"). Built on the kit Gauge (the
// channel's signature ruler) and adds what this video needs: an odometer readout plate (Counter), a base-label slot
// ("ABOVE SEA LEVEL" / "FROM THE SEA FLOOR", flag F3), decade zoom-out, off-scale chevrons (from the kit), extra
// bands (the amber 4-9 km crush band #9, the sea-glass 15-50 m RIVER band #6), a dashed ceiling line (C-04, left
// unlabelled until a number is claimed), and extra bars that share the ruler's zero (Mauna Kea beside Everest, each
// with its own base label; the ghost "+1 mile?" bar as a dashed outline).
// Draw it inside <Layer depth={0}> (or use <L12GaugeHUD>), so it never moves with the camera.
// Vermilion here: the bar, the marker and the readout plate only (storyboard §1). Band colours come from the caller.
import React from "react";
import { Counter, Family, Gauge, Layer, P, Pill, decadeZoom } from "../../lib/illustrated";
import { pillFill } from "./families";

export type GaugeBand = { from: number; to: number; color: string; label?: string };
export type GaugeBar = { value: number; color?: string; /** base label pill under the ruler, with the bar's colour dot */ base?: string; dashed?: boolean; label?: string };

export type L12GaugeProps = {
  family: Family;
  /** metres */
  value: number;
  /** ruler top in metres (default 10,000 = 10 km) */
  max?: number;
  /** decade zoom: ruler top goes max → zoomTo as zoomT runs 0..1 (clamped; log space) */
  zoomTo?: number;
  zoomT?: number;
  x?: number;
  y?: number;
  height?: number;
  title?: string;
  /** base-label slot under the ruler for the main bar */
  base?: string;
  /** readout plate: default = Counter of the value in metres; a string overrides it ("8,848.86 m"); false = none */
  readout?: string | false;
  /** let the Counter's lowest digit roll with a fractional value (the racing ticks of C-02); off = whole metres */
  rolling?: boolean;
  bands?: GaugeBand[];
  ceiling?: { v: number; label?: string } | null;
  bars?: GaugeBar[];
  marks?: { v: number; label: string }[];
  /** show the main bar + marker (off for a pure ruler, e.g. before the gauge "rises from a sea-level tick") */
  marker?: boolean;
  opacity?: number;
  /** plate width behind the ruler (px); the plate keeps the ruler legible over busy art */
  plate?: number;
};

const W = 14; // kit Gauge spine width
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** Tick-label format for a height ruler: metres under 1 km, kilometres above (one decimal when it is not whole). */
export const fmtHeight = (v: number) => {
  if (v === 0) return "0";
  if (Math.abs(v) < 1000) return `${Math.round(v)} m`;
  const km = v / 1000;
  const s = Math.abs(km - Math.round(km)) < 1e-6 ? `${Math.round(km)}` : km.toFixed(1);
  return `${Number(s).toLocaleString("en-US")} km`;
};

export const L12Gauge: React.FC<L12GaugeProps> = ({
  family: F,
  value,
  max = 10000,
  zoomTo,
  zoomT,
  x = 1760,
  y = 160,
  height = 560,
  title = "HEIGHT",
  base,
  readout,
  rolling = false,
  bands = [],
  ceiling = null,
  bars = [],
  marks = [],
  marker = true,
  opacity = 1,
  plate = 128,
}) => {
  const m = zoomTo !== undefined && zoomT !== undefined ? decadeZoom(max, zoomTo, clamp01(zoomT)) : max;
  const pos = (v: number) => y + height - (Math.max(0, Math.min(v, m)) / m) * height;
  const off = value > m;
  const vy = pos(value);
  const pill = pillFill(F);
  const leftEdge = x - plate; // the plate's left edge: pills and the readout hang off it
  // readout plate: a vermilion box left of the ruler, beside the marker (clamped inside the ruler's span)
  const digits = Math.max(1, Math.floor(Math.log10(Math.max(1, m))) + 1);
  const rText = typeof readout === "string" ? readout : null;
  const rW = rText ? Math.max(150, rText.length * 22 + 36) : digits * 21 + Math.floor((digits - 1) / 3) * 8 + 86;
  const ry = off ? y - 52 : Math.max(y + 30, Math.min(y + height - 30, vy));
  const rx = leftEdge - 18 - rW;
  return (
    <g opacity={opacity}>
      <Gauge x={x} y={y} height={height} value={value} max={m} unit="m" theme={F.theme} direction="up" title={title} side="left" plate={plate} readout={false} format={fmtHeight} marks={marks} marker={marker} unitCap={false} />
      {/* bands beside the spine, labelled with a pill off the plate */}
      {bands.map((b, i) => {
        const y0 = pos(b.to);
        const y1 = pos(b.from);
        if (y1 - y0 < 1) return null;
        return (
          <g key={`band${i}`}>
            <rect x={x + W + 4} y={y0} width={9} height={y1 - y0} fill={b.color} opacity={0.85} />
            <line x1={x - plate + 10} y1={y0} x2={x + W + 13} y2={y0} stroke={b.color} strokeWidth={1.5} opacity={0.7} />
            <line x1={x - plate + 10} y1={y1} x2={x + W + 13} y2={y1} stroke={b.color} strokeWidth={1.5} opacity={0.7} />
            {b.label ? <Pill x={leftEdge - 16} y={(y0 + y1) / 2} text={b.label} fill={pill} color={F.text} dot={b.color} size={16} align="end" /> : null}
          </g>
        );
      })}
      {/* dashed ceiling line across the plate (unlabelled by default: no number is claimed until the script does) */}
      {ceiling ? (
        <g>
          <line x1={x - plate + 8} y1={pos(ceiling.v)} x2={x + W + 28} y2={pos(ceiling.v)} stroke={F.text} strokeWidth={2.5} strokeDasharray="9 7" />
          {ceiling.label ? <Pill x={leftEdge - 16} y={pos(ceiling.v)} text={ceiling.label} fill={pill} color={F.text} size={16} align="end" /> : null}
        </g>
      ) : null}
      {/* extra bars right of the spine, sharing the ruler's zero (each with its own base label below) */}
      {bars.map((b, i) => {
        const bx = x + W + 22 + i * 22;
        const top = pos(b.value);
        const col = b.color ?? F.second;
        const bOff = b.value > m;
        return (
          <g key={`bar${i}`}>
            {b.dashed ? (
              <rect x={bx} y={top} width={12} height={y + height - top} fill="none" stroke={col} strokeWidth={2} strokeDasharray="6 5" />
            ) : (
              <rect x={bx} y={top} width={12} height={y + height - top} fill={col} />
            )}
            {bOff
              ? [0, 1].map((k) => <path key={k} d={`M${bx - 4} ${y - 8 - k * 12} L${bx + 6} ${y - 18 - k * 12} L${bx + 16} ${y - 8 - k * 12} L${bx + 16} ${y - 4 - k * 12} L${bx + 6} ${y - 14 - k * 12} L${bx - 4} ${y - 4 - k * 12} Z`} fill={col} />)
              : null}
            {b.label ? <Pill x={bx + 20} y={Math.max(y + 16, top)} text={b.label} fill={pill} color={F.text} dot={col} size={15} /> : null}
          </g>
        );
      })}
      {/* base-label slot: main bar first, then one per extra bar, under the ruler */}
      {base ? <Pill x={x + W / 2} y={y + height + 46} text={base} fill={pill} color={F.text} dot={P.vermilion} size={15} align="middle" /> : null}
      {bars.map((b, i) => (b.base ? <Pill key={`base${i}`} x={x + W / 2} y={y + height + 46 + (base ? 36 : 0) + i * 36} text={b.base} fill={pill} color={F.text} dot={b.color ?? F.second} size={15} align="middle" /> : null))}
      {/* readout plate */}
      {readout === false || !marker ? null : (
        <g>
          <rect x={rx} y={ry - 30} width={rW} height={60} fill={P.vermilion} />
          {rText ? (
            <text x={rx + rW / 2} y={ry + 13} textAnchor="middle" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 36, fontVariantNumeric: "tabular-nums", fill: P.bone }}>
              {rText}
            </text>
          ) : (
            <Counter x={rx + rW / 2 - 12} y={ry + 13} value={rolling ? value : Math.round(value)} max={m} digits={digits} size={34} color={P.bone} unit="m" align="middle" />
          )}
        </g>
      )}
    </g>
  );
};

/** The gauge on its own screen-locked layer: drop this anywhere inside a <Stage>. */
export const L12GaugeHUD: React.FC<L12GaugeProps> = (p) => (
  <Layer depth={0}>
    <L12Gauge {...p} />
  </Layer>
);

/** Numbers the gauge shows, each a row in episodes/L12-mountain-limit/sources.md. */
export const HEIGHTS = {
  everest: 8848.86, // #1
  everestRounded: 8849, // #1
  tibet: 4500, // #5
  maunaKeaAboveSea: 4205, // #13
  maunaKeaFromFloor: 10211, // #13
  olympusLow: 22000, // #18 #19 (band, base-dependent)
  olympusHigh: 26000, // #18
  maxwell: 11000, // #22 (above mean radius)
  rheasilviaPeak: 20000, // #24
  crushBand: { from: 3800, to: 9400 }, // #9 (3.8-9.4 km "solid column")
  riverBand: { from: 8848.86 - 50, to: 8848.86 + 50 }, // #6 (15-50 m, drawn at the summit)
  predictedMars: 23000, // #26
  predictedVenus: 10000, // #26
  predictedVesta: 340000, // #26
  earthRadius: 6371000, // #8
} as const;
