// L13Gauge: the episode's screen-locked LOUDNESS gauge, decibels of sound PRESSURE in air (storyboard §1, BUILD.md §5).
// The kit Gauge ruler (0-200 dB, x ≈ 1760) plus what L13 needs:
//  - a vermilion readout plate with an odometer Counter, or slot-machine digits (`spin`, C-11 / 5-16), or the kit
//    UnknownTag "?" (`unknown`: Krakatoa's readout, always, F3);
//  - the ceiling as a saffron Emissive line, UNLABELLED until l03 line 3 (`labelled`, F1);
//  - chevrons above the ceiling when the fill passes it or `overflow` is set (3-14: pinned at 194 with chevrons);
//  - muted labelled marks (the everyday rungs, ≈174 "IN AIR TERMS"), de-overlapped;
//  - a base pill ("AIR · re 20 µPa"), and `tremble` (± px) for the gauge straining against the ceiling (3-09).
// Never put 203 on this gauge (that is sound POWER: PowerMeter.tsx, F4) and never 236 (water ruler only, F5).
// Draw it inside <Layer depth={0}> (or use <L13GaugeHUD>), last, so it never moves with the camera.
import React, { useId } from "react";
import { Counter, Emissive, Family, Gauge, IF2, Layer, P, Pill, UnknownTag } from "../../lib/illustrated";
import { L13_COLORS, pillFill } from "./families";

/** Every number this gauge (or a scene beside it) may show, with its sources.md row. */
export const DB = {
  zero: 0, // #9 (the scale's zero, 20 µPa; F17: never "threshold of hearing" on screen)
  leaves: 20, // #10 (dBA)
  crickets: 40, // #10 (dBA, at 5 m)
  talk: 60, // #10 (dBA, at 5 m)
  thunder: 100, // #10 (dBA)
  jet: 120, // #10 (dBA, military jet at 100 m)
  cannon: 126, // #10 (dBA, at 150 m)
  ceiling: 194, // #11 (194.1 dB, sea-level air; F1 unlabelled before l03 line 3)
  whaleInAir: 174, // #19 #18 (236 − 61.5 ≈ 174 "IN AIR TERMS", F5)
  gaugeReading172: 172, // #23 (one reading of the Batavia gauge: dashed with "?", never Krakatoa's value, F3)
  gaugeReading150: 150, // #23 (another reading: dashed with "?", F3)
  example300: 300, // #11 #23 (the script's generic "300 dB?", F8: off the ruler, never linked to Krakatoa)
  waterOffset: 61.5, // #18
} as const;

/** The everyday rungs as gauge marks (#10, A-weighted: pair with a kicker "EVERYDAY LEVELS (dBA)", F6). Labels are
 *  short so they fit right of the spine (≤ ~100 px); the distances go in the scene's pill: EVERYDAY_PILLS. */
export const EVERYDAY_MARKS: GaugeMark[] = [
  { v: DB.leaves, label: "LEAVES" },
  { v: DB.crickets, label: "CRICKETS" },
  { v: DB.talk, label: "TALK" },
  { v: DB.thunder, label: "THUNDER" },
  { v: DB.jet, label: "JET" },
  { v: DB.cannon, label: "CANNON" },
];
/** Rung pills with their distances (#10, F6): "CRICKETS · 5 m" etc. */
export const EVERYDAY_PILLS: Record<"leaves" | "crickets" | "talk" | "thunder" | "jet" | "cannon", string> = {
  leaves: "LEAVES RUSTLING",
  crickets: "CRICKETS · 5 m",
  talk: "TALK · 5 m",
  thunder: "THUNDER",
  jet: "MILITARY JET · 100 m",
  cannon: "CANNON · 150 m",
};

export type GaugeMark = { v: number; label: string; color?: string; dashed?: boolean };

export type L13GaugeProps = {
  family: Family;
  /** dB (the fill height); clamps at the ruler top */
  value: number;
  /** composition or shot frame: spin digits, chevron pulse, ceiling glow, tremble */
  frame?: number;
  /** ruler top in dB (default 200) */
  max?: number;
  x?: number;
  y?: number;
  height?: number;
  /** caption above the ruler (default "LOUDNESS · dB") */
  title?: string;
  /** base pill under the ruler, e.g. "AIR · re 20 µPa" */
  base?: string;
  /** readout: default = Counter of the value + "dB"; a string overrides it ("300 dB?"); false = none */
  readout?: string | false;
  /** let the Counter's lowest digit roll with a fractional value */
  rolling?: boolean;
  /** slot-machine digits 0..1: 1 = every column spinning, 0 = settled on `value` (C-11, 5-16) */
  spin?: number;
  /** the readout is the vermilion "?" tag (Krakatoa, F3); the fill is hidden unless `fill` says otherwise */
  unknown?: boolean;
  /** draw the vermilion fill + marker (default true; false for Z-14's empty gauge under the ceiling) */
  fill?: boolean;
  /** the saffron ceiling line; `label` replaces the default "194 dB" text when `labelled` */
  ceiling?: { v: number; label?: string } | null;
  /** show the ceiling's label (F1: false until l03 line 3) */
  labelled?: boolean;
  /** chevrons above the ceiling (also drawn automatically when value > ceiling) */
  overflow?: boolean;
  /** muted labelled ticks; `markSide` "right" (default: short labels, ≤ ~100 px) or "left" (outside the plate) */
  marks?: GaugeMark[];
  markSide?: "left" | "right";
  /** ± px of horizontal shake (3-09) */
  tremble?: number;
  opacity?: number;
  /** plate width behind the ruler (px) */
  plate?: number;
};

const W = 14; // kit Gauge spine width

/** Slot-machine digits: each column spins at its own rate while `spin` > 0 and lands on the target digit. */
const SlotDigits: React.FC<{ x: number; y: number; value: number; spin: number; frame: number; size: number; color: string }> = ({ x, y, value, spin, frame, size, color }) => {
  const id = "slot" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const digits = String(Math.max(0, Math.round(value))).split("").map(Number);
  const colW = size * 0.6;
  const lh = size * 1.1;
  const x0 = x - (digits.length * colW) / 2;
  const st: React.CSSProperties = { fontFamily: IF2.num, fontWeight: 800, fontSize: size, fontVariantNumeric: "tabular-nums", fill: color };
  return (
    <g>
      <clipPath id={id}>
        <rect x={0} y={y - size * 0.86} width={colW} height={lh} />
      </clipPath>
      {digits.map((d, i) => {
        // later columns spin faster and settle later (a slot machine stops left to right)
        const s = Math.max(0, Math.min(1, spin * (1 + i * 0.35)));
        const pos = (d + s * frame * (0.55 + i * 0.21)) % 10;
        return (
          <g key={i} clipPath={`url(#${id})`} transform={`translate(${(x0 + i * colW).toFixed(1)} 0)`}>
            <g transform={`translate(0 ${(-pos * lh).toFixed(2)})`}>
              {Array.from({ length: 11 }, (_, k) => (
                <text key={k} x={colW / 2} y={y + k * lh} textAnchor="middle" style={st}>
                  {k % 10}
                </text>
              ))}
            </g>
          </g>
        );
      })}
    </g>
  );
};

export const L13Gauge: React.FC<L13GaugeProps> = ({
  family: F,
  value,
  frame = 0,
  max = 200,
  x: x0 = 1760,
  y = 170,
  height = 600,
  title = "LOUDNESS · dB",
  base,
  readout,
  rolling = false,
  spin = 0,
  unknown = false,
  fill,
  ceiling = null,
  labelled = false,
  overflow = false,
  marks = [],
  markSide = "right",
  tremble = 0,
  opacity = 1,
  plate = 118,
}) => {
  const x = x0 + (tremble ? Math.sin(frame * 2.3) * tremble + Math.sin(frame * 3.7) * tremble * 0.4 : 0);
  const showFill = fill ?? !unknown;
  const pos = (v: number) => y + height - (Math.max(0, Math.min(v, max)) / max) * height;
  const pill = pillFill(F);
  const vy = pos(value);
  const leftEdge = x - plate;
  // marks right of the spine, labels pushed apart (≥ 22 px) so 120 and 126 never collide
  const sorted = [...marks].sort((a, b) => a.v - b.v);
  const labelY: number[] = [];
  sorted.forEach((m, i) => {
    const want = pos(m.v);
    labelY.push(i === 0 ? want : Math.min(want, labelY[i - 1] - 22));
  });
  const cy = ceiling ? pos(ceiling.v) : 0;
  const over = !!ceiling && (overflow || value > ceiling.v);
  const glow = 0.8 + 0.2 * Math.sin(frame / 9);
  // readout plate: left of the plate, beside the fill top (clamped inside the ruler's span)
  const rText = typeof readout === "string" ? readout : null;
  const digits = Math.max(1, String(Math.round(Math.max(0, value))).length);
  const rW = rText ? Math.max(130, rText.length * 22 + 36) : digits * 21 + 92;
  const ry = Math.max(y + 30, Math.min(y + height - 30, showFill ? vy : pos(0)));
  const rx = leftEdge - 18 - rW;
  return (
    <g opacity={opacity}>
      <Gauge x={x} y={y} height={height} value={showFill ? value : 0} max={max} unit="dB" theme={F.theme} direction="up" title={title} side="left" plate={plate} readout={false} format={(v) => `${v}`} marker={showFill} unitCap={false} />
      {!showFill ? <rect x={x} y={y} width={W} height={height} fill={F.theme.panel} stroke={F.theme.line} strokeWidth={1.5} /> : null}
      {/* marks (muted, right of the spine) */}
      {sorted.map((m, i) => {
        const c = m.color ?? F.text;
        const R = markSide === "right";
        const b = R ? x + W + 22 : leftEdge - 22;
        return (
          <g key={`mk${i}`} opacity={0.85}>
            <line x1={R ? x + W : x} y1={pos(m.v)} x2={b} y2={pos(m.v)} stroke={c} strokeWidth={2.5} strokeDasharray={m.dashed ? "5 4" : undefined} />
            <path d={`M${b} ${pos(m.v)} L${R ? b + 8 : b - 8} ${labelY[i]}`} stroke={c} strokeWidth={1.2} fill="none" opacity={0.7} />
            <text x={R ? b + 12 : b - 12} y={labelY[i] + 6} textAnchor={R ? "start" : "end"} style={{ fontFamily: IF2.label, fontSize: 15, letterSpacing: 1.5, fill: c }}>
              {m.label}
            </text>
          </g>
        );
      })}
      {/* the ceiling: a saffron Emissive line across plate and spine, label only when allowed (F1) */}
      {ceiling ? (
        <g>
          <Emissive d={`M${leftEdge + 6} ${cy} L${x + W + 26} ${cy}`} color={L13_COLORS.saffron} core={L13_COLORS.saffronCore} width={4} strength={glow} glow={8} />
          {labelled ? <Pill x={leftEdge - 14} y={cy} text={ceiling.label ?? `${ceiling.v} dB`} fill={pill} color={F.text} dot={L13_COLORS.saffron} size={17} align="end" /> : null}
        </g>
      ) : null}
      {/* chevrons above the ceiling: the fill wants to go further than the air allows */}
      {over
        ? [0, 1, 2].map((k) => {
            const lift = ((frame * 1.6 + k * 14) % 42) - 4;
            const yy = cy - 14 - k * 16 - lift * 0.4;
            const o = Math.max(0, 1 - k * 0.28) * (0.75 + 0.25 * Math.sin(frame / 5 + k));
            return <path key={k} d={`M${x - 7} ${yy} L${x + W / 2} ${yy - 13} L${x + W + 7} ${yy} L${x + W + 7} ${yy + 6} L${x + W / 2} ${yy - 7} L${x - 7} ${yy + 6} Z`} fill={P.vermilion} opacity={o} />;
          })
        : null}
      {/* base pill */}
      {base ? <Pill x={x + W / 2 - plate / 2 + 6} y={y + height + 44} text={base} fill={pill} color={F.text} dot={P.vermilion} size={15} align="middle" /> : null}
      {/* readout */}
      {readout === false ? null : unknown ? (
        <UnknownTag x={leftEdge - 48} y={ry} size={30} />
      ) : (
        <g>
          <rect x={rx} y={ry - 30} width={rW} height={60} fill={P.vermilion} />
          {rText ? (
            <text x={rx + rW / 2} y={ry + 13} textAnchor="middle" style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 36, fontVariantNumeric: "tabular-nums", fill: P.bone }}>
              {rText}
            </text>
          ) : spin > 0 ? (
            <g>
              <SlotDigits x={rx + 14 + (digits * 21.6) / 2} y={ry + 13} value={value} spin={spin} frame={frame} size={36} color={P.bone} />
              <text x={rx + 22 + digits * 21.6} y={ry + 13} style={{ fontFamily: IF2.num, fontWeight: 500, fontSize: 16, fill: P.bone }}>
                dB
              </text>
            </g>
          ) : (
            <Counter x={rx + 14} y={ry + 13} value={rolling ? value : Math.round(value)} max={Math.max(value, 1)} digits={digits} size={36} color={P.bone} unit="dB" align="start" />
          )}
        </g>
      )}
    </g>
  );
};

/** The gauge on its own screen-locked layer: drop this anywhere inside a <Stage>, last. */
export const L13GaugeHUD: React.FC<L13GaugeProps> = (p) => (
  <Layer depth={0}>
    <L13Gauge {...p} />
  </Layer>
);
