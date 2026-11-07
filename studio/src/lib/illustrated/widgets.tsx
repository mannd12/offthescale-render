// Kit v2.1 scene widgets (docs/STYLE-V2.md §12; docs/KURZGESAGT-STUDY-2.md §2.2, §2.7): Inset magnifier, Lineup
// (object ladder with a rail of what came before), Cutaway (labelled cross-section reveal), CubeStack (volume as unit
// cubes). All SVG, all pure functions of props + t, meant to live inside a Stage.
import React, { useId } from "react";
import { Family, alpha } from "./palette2";
import { Form, KEY_LIGHT } from "./light";
import { Pill, Leader, Metric } from "./type2";
import { rnd } from "./motion";
import { P, mixHex } from "./palette";

const sm = (t: number, a = 0, b = 1) => {
  const u = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return u * u * (3 - 2 * u);
};
const safeId = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, "");

/**
 * Inset magnifier: a circle at (cx, cy) showing `children` (scene content in world coordinates) magnified `scale`×
 * around `at`, with a leader from `at` to the circle, a rim, and an optional metric under it. `t` grows it in.
 */
export const Inset: React.FC<{
  cx: number;
  cy: number;
  r: number;
  at: [number, number];
  scale?: number;
  family: Family;
  t?: number;
  metric?: { value: string; unit?: string };
  children: React.ReactNode;
}> = ({ cx, cy, r, at, scale = 3, family: F, t = 1, metric, children }) => {
  const id = "inset" + safeId(useId());
  const e = sm(t);
  const rr = Math.max(0.01, r * e);
  return (
    <g opacity={e}>
      <Leader from={at} to={[cx + (at[0] < cx ? -rr : rr), cy]} color={F.text} elbow={false} />
      <clipPath id={id}>
        <circle cx={cx} cy={cy} r={rr} />
      </clipPath>
      <circle cx={cx} cy={cy} r={rr + 6} fill={alpha(F.shadow, 0.45)} />
      <g clipPath={`url(#${id})`}>
        <rect x={cx - rr} y={cy - rr} width={rr * 2} height={rr * 2} fill={F.sky[0]} />
        <g transform={`translate(${cx} ${cy}) scale(${scale}) translate(${-at[0]} ${-at[1]})`}>{children}</g>
      </g>
      <circle cx={cx} cy={cy} r={rr} fill="none" stroke={F.text} strokeWidth={3} />
      <circle cx={cx} cy={cy} r={rr} fill="none" stroke={F.light} strokeWidth={1.2} opacity={0.6} transform={`translate(-2 -2)`} />
      {metric ? <Metric x={cx} y={cy + rr + 54} value={metric.value} unit={metric.unit} size={40} color={F.text} align="middle" /> : null}
    </g>
  );
};

export type LineupItem = { id: string; label: string; value?: string };
export type LineupState = { x: number; y: number; s: number; opacity: number; onRail: boolean; railIndex: number };

/**
 * Lineup layout (study item 5): item `step` is the hero (large, centre-right); items before it sit as labelled dots on a
 * rail at the bottom-left; the item after it waits off frame right. `t` 0..1 animates the step change: the previous
 * hero shrinks and slides to the rail while the new one enters large from the right. Pass the state to your own
 * drawing code (the kit never draws the subject: hard rule 1). `hero` and `rail` set the two anchor points.
 */
export const lineupState = (
  index: number,
  step: number,
  t: number,
  opts: { hero?: [number, number]; rail?: [number, number]; railGap?: number; heroScale?: number; railScale?: number } = {},
): LineupState => {
  const { hero = [1180, 560], rail = [220, 900], railGap = 150, heroScale = 1, railScale = 0.12 } = opts;
  const e = sm(t);
  const railPos = (i: number): [number, number] => [rail[0] + i * railGap, rail[1]];
  if (index < step - 1 || (index === step - 1 && t >= 1)) {
    const [x, y] = railPos(index);
    return { x, y, s: railScale, opacity: 1, onRail: true, railIndex: index };
  }
  if (index === step - 1) {
    const [rx, ry] = railPos(index);
    return { x: hero[0] + (rx - hero[0]) * e, y: hero[1] + (ry - hero[1]) * e, s: heroScale + (railScale - heroScale) * e, opacity: 1, onRail: e > 0.85, railIndex: index };
  }
  if (index === step) {
    const fromX = 1920 + 600;
    return { x: fromX + (hero[0] - fromX) * e, y: hero[1], s: heroScale * (1.6 - 0.6 * e), opacity: Math.min(1, e * 2), onRail: false, railIndex: index };
  }
  return { x: 1920 + 600, y: hero[1], s: heroScale, opacity: 0, onRail: false, railIndex: index };
};

/** The rail itself: a hairline with a dot and a pill per item that has reached it. */
export const LineupRail: React.FC<{ items: LineupItem[]; step: number; t: number; family: Family; rail?: [number, number]; railGap?: number }> = ({ items, step, t, family: F, rail = [220, 900], railGap = 150 }) => {
  const reached = items.filter((_, i) => i < step - 1 || (i === step - 1 && t >= 0.85));
  if (reached.length === 0) return null;
  return (
    <g>
      <line x1={rail[0] - 60} y1={rail[1] + 46} x2={rail[0] + (reached.length - 1) * railGap + 60} y2={rail[1] + 46} stroke={F.dim} strokeWidth={1.5} opacity={0.7} />
      {reached.map((it, i) => (
        <g key={it.id}>
          <circle cx={rail[0] + i * railGap} cy={rail[1] + 46} r={4} fill={F.text} />
          <Pill x={rail[0] + i * railGap} y={rail[1] + 86} text={it.label} fill={alpha(F.shadow, 0.6)} color={F.text} size={15} align="middle" />
          {it.value ? (
            <text x={rail[0] + i * railGap} y={rail[1] + 124} textAnchor="middle" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 18, fill: F.dim, fontVariantNumeric: "tabular-nums" }}>
              {it.value}
            </text>
          ) : null}
        </g>
      ))}
    </g>
  );
};

/**
 * Cutaway: a stack of labelled bands (crust, mantle, core; soil, rock...) revealed top-down by `t`, each band a lit
 * Form with a pill + leader on the right. Bands are listed top to bottom with their heights in px.
 */
export const Cutaway: React.FC<{
  x: number;
  y: number;
  w: number;
  bands: { label: string; color: string; h: number; note?: string }[];
  t?: number;
  family: Family;
  light?: number;
  labelX?: number;
  wobble?: number;
}> = ({ x, y, w, bands, t = 1, family: F, light = KEY_LIGHT, labelX, wobble = 10 }) => {
  const id = "cut" + safeId(useId());
  const total = bands.reduce((a, b) => a + b.h, 0);
  const shown = total * sm(t);
  const lx = labelX ?? x + w + 60;
  let acc = 0;
  const edge = (yy: number, seed: number) => {
    const pts: string[] = [];
    for (let k = 0; k <= 8; k++) pts.push(`${x + (k * w) / 8} ${yy + Math.sin(k * 1.3 + seed) * wobble}`);
    return pts;
  };
  return (
    <g>
      <clipPath id={id}>
        <rect x={x - 40} y={y - 40} width={w + 80} height={shown + 40} />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        {bands.map((b, i) => {
          const top = y + acc;
          acc += b.h;
          const bot = y + acc;
          const d = `M${edge(top, i).join(" L")} L${edge(bot, i + 1).reverse().join(" L")} Z`;
          return <Form key={i} d={d} fill={b.color} light={light} shadow={F.shadow} inset={Math.min(30, b.h * 0.25)} shadowOpacity={0.4} rim={F.light} rimWidth={2.5} rimOpacity={0.6} bounce={F.bounce} />;
        })}
      </g>
      {bands.map((b, i) => {
        const mid = y + bands.slice(0, i).reduce((a, c) => a + c.h, 0) + b.h / 2;
        const vis = sm(t) * total > mid - y - b.h * 0.3 ? 1 : 0;
        return (
          <g key={"l" + i} opacity={vis}>
            <Leader from={[x + w - 20, mid]} to={[lx - 14, mid]} color={F.text} elbow={false} />
            <Pill x={lx} y={mid} text={b.label} fill={alpha(F.shadow, 0.62)} color={F.text} size={18} />
            {b.note ? (
              <text x={lx + 6} y={mid + 36} style={{ fontFamily: "'Outfit','Inter',sans-serif", fontWeight: 500, fontSize: 18, fill: F.dim }}>
                {b.note}
              </text>
            ) : null}
          </g>
        );
      })}
    </g>
  );
};

/**
 * CubeStack: `count` unit cubes in an isometric block (`cols` × `rows` footprint, stacking upward), the newest cube
 * popping in; `t` 0..1 reveals cubes in order. Top face lit, left face base, right face shade. Volume made visible.
 */
export const CubeStack: React.FC<{ x: number; y: number; count: number; size?: number; cols?: number; rows?: number; color: string; family: Family; t?: number; label?: string }> = ({
  x,
  y,
  count,
  size = 36,
  cols = 5,
  rows = 4,
  color,
  family: F,
  t = 1,
  label,
}) => {
  const shown = Math.min(count, Math.floor(count * sm(t) + 0.999));
  const ix = size * 0.866;
  const iy = size * 0.5;
  const lit = mixHex(color, F.light, 0.35);
  const shade = mixHex(color, F.shadow, 0.4);
  const cubes: React.ReactNode[] = [];
  for (let n = 0; n < shown; n++) {
    const layer = Math.floor(n / (cols * rows));
    const r = Math.floor((n % (cols * rows)) / cols);
    const c = n % cols;
    // draw order: back rows first, then columns; layer adds height
    const px = x + (c - r) * ix;
    const py = y + (c + r) * iy - layer * size;
    const pop = n === shown - 1 && t < 1 ? 1 + 0.18 * Math.sin(((count * t) % 1) * Math.PI) : 1;
    cubes.push(
      <g key={n} transform={`translate(${px} ${py}) scale(${pop}) translate(${-px} ${-py})`}>
        <path d={`M${px} ${py - size} L${px + ix} ${py - size + iy} L${px} ${py - size + 2 * iy} L${px - ix} ${py - size + iy} Z`} fill={lit} />
        <path d={`M${px - ix} ${py - size + iy} L${px} ${py - size + 2 * iy} L${px} ${py + iy} L${px - ix} ${py} Z`} fill={color} />
        <path d={`M${px} ${py - size + 2 * iy} L${px + ix} ${py - size + iy} L${px + ix} ${py} L${px} ${py + iy} Z`} fill={shade} />
        <path d={`M${px} ${py - size} L${px + ix} ${py - size + iy} L${px} ${py - size + 2 * iy} L${px - ix} ${py - size + iy} Z`} fill="none" stroke={F.light} strokeWidth={0.8} opacity={0.5} />
      </g>,
    );
  }
  // sort for painter's order: by (r + c) then layer
  return (
    <g>
      {cubes}
      {label ? (
        <text x={x} y={y + (cols + rows) * iy + 48} textAnchor="middle" style={{ fontFamily: "'Outfit','Inter',sans-serif", fontWeight: 800, fontSize: 26, fill: F.text }}>
          {label}
        </text>
      ) : null}
    </g>
  );
};

/** Faint banding / strata texture for a rock column or wall: horizontal bands of the fill pushed light/dark, clipped by the caller. */
export const Banding: React.FC<{ x: number; y: number; w: number; h: number; color: string; family: Family; bands?: number; seed?: number; tilt?: number; opacity?: number }> = ({
  x,
  y,
  w,
  h,
  color,
  family: F,
  bands = 9,
  seed = 1,
  tilt = -4,
  opacity = 0.5,
}) => (
  <g opacity={opacity} transform={`rotate(${tilt} ${x + w / 2} ${y + h / 2})`}>
    {Array.from({ length: bands }, (_, i) => {
      const by = y + (i / bands) * h + rnd(seed + i) * (h / bands) * 0.4;
      const bh = (h / bands) * (0.25 + rnd(seed * 3 + i) * 0.5);
      const c = i % 2 ? mixHex(color, F.light, 0.12 + rnd(seed * 7 + i) * 0.1) : mixHex(color, F.shadow, 0.15 + rnd(seed * 11 + i) * 0.15);
      return <rect key={i} x={x - 40} y={by} width={w + 80} height={bh} fill={c} rx={bh / 2} />;
    })}
  </g>
);

/** Brand pill helper: a vermilion "?" tag for the beat where the video refuses to claim a number yet. */
export const UnknownTag: React.FC<{ x: number; y: number; size?: number }> = ({ x, y, size = 26 }) => (
  <g>
    <circle cx={x} cy={y} r={size} fill={P.vermilion} />
    <text x={x} y={y + size * 0.38} textAnchor="middle" style={{ fontFamily: "'Outfit','Inter',sans-serif", fontWeight: 800, fontSize: size * 1.3, fill: "#FFF4E6" }}>
      ?
    </text>
  </g>
);
