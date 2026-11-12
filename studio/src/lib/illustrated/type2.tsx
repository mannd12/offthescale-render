// Kit v2 typography (docs/STYLE-V2.md §7): designed titles, not diagram labels. Outfit 800 (geometric display) for
// headlines and chapter titles, Anton for small spaced kickers, Inter 800 tabular for numbers. Text sits in the SVG so
// it rides the camera when it should (labels on things) or on a depth-0 Layer when it should not (titles).
import React, { useId } from "react";
import { AbsoluteFill } from "remotion";
import { IF } from "./type";
import { Family } from "./palette2";
import { Stage } from "./camera";
import { Sky, Vignette } from "./light";
import { Motes, Stars } from "./ambient";

/** Labels are set in capitals, but unit symbols keep their case: "194 dB", never "194 DB" (L13 review, 2026-11-12). */
const UNIT = /(dB|µPa|kPa|MPa|GPa|hPa|Pa|kHz|Hz|m\/s|km\/s|km\/h|mph)(?![A-Za-z])/g;
export const labelCase = (t: string) => {
  let out = "", last = 0;
  for (const m of t.matchAll(UNIT)) {
    out += t.slice(last, m.index).toUpperCase() + m[0];
    last = (m.index ?? 0) + m[0].length;
  }
  return out + t.slice(last).toUpperCase();
};

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
    <text x={align === "start" ? x + size * 1.5 : x - size * 1.5} y={y} textAnchor={align} style={{ fontFamily: IF2.label, fontSize: size, letterSpacing: size * 0.22, fill: color, }}>
      {labelCase(text)}
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
      <text x={x0 + (dot ? size * 1.6 : size * 0.7)} y={y + size * 0.36} style={{ fontFamily: IF2.label, fontSize: size, letterSpacing: size * 0.12, fill: color, }}>
        {labelCase(text)}
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

const sm = (t: number, a: number, b: number) => {
  const u = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return u * u * (3 - 2 * u);
};

/**
 * ChapterCard (kit v2.1, study item 4): a kicker and a 3-9 word Title Case headline on the family's own field, held
 * ~2 s. `t` runs 0..1 over the card's life: text rises 24 px and fades in over the first 18 %, holds, fades out over the
 * last 15 %. A faint star/mote field keeps the card alive (locked camera, `drift={false}`). Put a sting on its first frame.
 */
export const ChapterCard: React.FC<{ family: Family; kicker?: string; title: string; t: number; frame?: number; sub?: string; align?: "start" | "middle" }> = ({
  family: F,
  kicker,
  title,
  t,
  frame = 0,
  sub,
  align = "start",
}) => {
  const inA = sm(t, 0, 0.18);
  const outA = 1 - sm(t, 0.85, 1);
  const a = inA * outA;
  const rise = (1 - inA) * 24;
  const x = align === "start" ? 160 : 960;
  const words = title.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > 22 && cur) {
      lines.push(cur.trim());
      cur = w;
    } else cur = (cur + " " + w).trim();
  }
  if (cur) lines.push(cur);
  const size = lines.length > 2 ? 84 : 104;
  const y0 = 540 - ((lines.length - 1) * size * 0.98) / 2 + size * 0.35;
  return (
    <Stage theme={F.theme} drift={false} vignette={F.dark ? 0.3 : 0.1} grain={0.4}>
      <Sky family={F} />
      {F.dark ? <Stars frame={frame} n={90} w={1920} h={1080} color={F.text} seed={31} size={1.3} twinkle={0.7} /> : null}
      <Motes frame={frame} n={40} w={1920} h={1080} color={F.light} seed={37} size={3.2} drift={30} />
      <Vignette color={F.shadow} strength={F.dark ? 0.35 : 0.12} />
      <g opacity={a} transform={`translate(0 ${rise.toFixed(2)})`}>
        {kicker ? <Kicker x={x} y={y0 - size * 1.05} text={kicker} color={F.dim} size={24} align={align === "start" ? "start" : "start"} /> : null}
        {lines.map((l, i) => (
          <text key={i} x={x} y={y0 + i * size * 0.98} textAnchor={align} style={{ fontFamily: IF2.display, fontWeight: 800, fontSize: size, letterSpacing: -size * 0.03, fill: F.text }}>
            {l}
          </text>
        ))}
        <rect x={align === "start" ? x : x - 30} y={y0 + (lines.length - 1) * size * 0.98 + 34} width={60} height={6} rx={3} fill={F.accent} />
        {sub ? (
          <text x={x} y={y0 + (lines.length - 1) * size * 0.98 + 84} textAnchor={align} style={{ fontFamily: IF2.display, fontWeight: 500, fontSize: 30, fill: F.dim }}>
            {sub}
          </text>
        ) : null}
      </g>
    </Stage>
  );
};

/**
 * Counter (kit v2.1, study item 8): a number whose digits roll like an odometer as `value` changes. Pass a float; the
 * lowest digit rolls continuously, higher digits turn over as the one below passes 9. `digits` fixes the column count
 * (default: enough for `max ?? value`), commas are placed by column. Inter 800 tabular, so columns never jitter.
 */
export const Counter: React.FC<{ x: number; y: number; value: number; max?: number; size?: number; color: string; unit?: string; unitColor?: string; align?: "start" | "middle" | "end"; digits?: number }> = ({
  x,
  y,
  value,
  max,
  size = 72,
  color,
  unit,
  unitColor,
  align = "start",
  digits,
}) => {
  const id = "ctr" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const v = Math.max(0, value);
  const n = digits ?? Math.max(1, Math.floor(Math.log10(Math.max(1, max ?? v))) + 1);
  const colW = size * 0.6;
  const commaW = size * 0.22;
  const lh = size * 1.1;
  // odometer positions per column (place p = 10^k)
  // odometer: a column rolls only while the column below it rolls past 9 (2026-11-11 fix: the old carry used the lower
  // column's digit + fraction, so 194 showed its hundreds column 0.4 of the way to 2)
  const posOf: number[] = [];
  for (let p = 0; p < n; p++) posOf[p] = p === 0 ? v % 10 : (Math.floor(v / Math.pow(10, p)) % 10) + Math.max(0, posOf[p - 1] - 9);
  const cols = Array.from({ length: n }, (_, k) => {
    const p = n - 1 - k;
    const r = (v / Math.pow(10, p)) % 10;
    const leadingZero = p > 0 && v < Math.pow(10, p) - 0.5;
    return { pos: posOf[p], hidden: leadingZero && Math.floor(r) === 0, p };
  });
  const visible = cols.filter((c) => !c.hidden);
  const totalW = visible.length * colW + Math.floor((visible.length - 1) / 3) * commaW;
  let x0 = align === "start" ? x : align === "end" ? x - totalW : x - totalW / 2;
  const st: React.CSSProperties = { fontFamily: IF2.num, fontWeight: 800, fontSize: size, fontVariantNumeric: "tabular-nums", fill: color };
  const out: React.ReactNode[] = [];
  visible.forEach((c, i) => {
    const remaining = visible.length - i;
    out.push(
      <g key={i} clipPath={`url(#${id})`} transform={`translate(${x0.toFixed(1)} 0)`}>
        <g transform={`translate(0 ${(-(c.pos % 10) * lh).toFixed(2)})`}>
          {Array.from({ length: 11 }, (_, d) => (
            <text key={d} x={colW / 2} y={y + d * lh} textAnchor="middle" style={st}>
              {d % 10}
            </text>
          ))}
        </g>
      </g>,
    );
    x0 += colW;
    if (remaining > 1 && (remaining - 1) % 3 === 0) {
      out.push(
        <text key={"c" + i} x={x0 + commaW / 2} y={y} textAnchor="middle" style={st}>
          ,
        </text>,
      );
      x0 += commaW;
    }
  });
  return (
    <g>
      <clipPath id={id}>
        <rect x={0} y={y - size * 0.86} width={colW} height={lh} />
      </clipPath>
      {out}
      {unit ? (
        <text x={x0 + size * 0.14} y={y} style={{ fontFamily: IF2.num, fontWeight: 500, fontSize: size * 0.42, fill: unitColor ?? color }}>
          {unit}
        </text>
      ) : null}
    </g>
  );
};

/** Black beat (kit v2.1, study item 9): a full-frame black (or family shadow) held between acts; t 0..1 fades in and out. */
export const BlackBeat: React.FC<{ t: number; color?: string; fadeIn?: number; fadeOut?: number }> = ({ t, color = "#000", fadeIn = 0.3, fadeOut = 0.3 }) => (
  <AbsoluteFill style={{ background: color, opacity: sm(t, 0, fadeIn) * (1 - sm(t, 1 - fadeOut, 1)), pointerEvents: "none" }} />
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
