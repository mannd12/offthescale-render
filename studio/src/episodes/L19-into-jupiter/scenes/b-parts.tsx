// L19 package B bespoke parts (scenes l05-l08 + closer). Never imported by package A (and B never imports a-parts).
// Picture helpers only; every numeral that reaches the screen goes through data19's assertAllowed / assertValue (Num, Label,
// RollInt, RollDec, Readout do it for you).
// USAGE
//   runOf(c => [{ at, S }, …])     one ShotDef made of continuous PHASES (storyboard PUSH / SLIDE rows), cross-dissolved
//   <Pop f>                        the hard-cut scale pop around a whole shot
//   <FamSky name /> <DarkSky name />   oversized family sky; the dark field from a family's first two stops (V < 0.3)
//   <BandField19 f k />            the L18 probe lesson: wide low-contrast tone bands sliding across the whole field (4 px/f)
//   <GlowBands f />                wide soft glow bands rising (20 px/f): the furnace's "glow flowing"
//   <Limb f />  <Planet cx cy r f />   Jupiter's limb / a striped disc, bands shearing in opposite directions
//   <Num> <Label> <RollInt> <RollDec> <Readout>   asserted text and readouts (units as their own span, F13)
//   <Plate> <Slam> <Bracket19> <CheckPen> <GlowRings> <Floor> <Console> <Sheet> <ValueBar> <ChipRow> <LedgerIcon>
import React, { useId } from "react";
import { AbsoluteFill } from "remotion";
import { Counter, Dissolve, IF2, Sky, alpha, cutPop, labelCase, mixHex, rnd } from "../../../lib/illustrated";
import { L19_COLORS, PILL_TEXT, familyOf, type L19FamilyName } from "../families";
import { assertAllowed, assertValue } from "../data19";
import { DeckBands } from "../decks";
import { Orbiter } from "../probe19";
import { ShotFC } from "../shots";

export const C = L19_COLORS;
export const INK = C.ink;
export const cl = (v: number) => Math.max(0, Math.min(1, v));
export const mod = (a: number, n: number) => ((a % n) + n) % n;
export const fr = (v: number) => v - Math.floor(v);
export const sm = (u: number) => {
  const t = cl(u);
  return t * t * (3 - 2 * t);
};
/** eased 0..1 between frames a and b */
export const ez = (f: number, a: number, b: number) => sm((f - a) / Math.max(1, b - a));
/** linear 0..1 between frames a and b */
export const lin = (f: number, a: number, b: number) => cl((f - a) / Math.max(1, b - a));
/** ping-pong 0..1..0 with period p frames */
export const ping = (f: number, p: number) => {
  const u = fr(f / p);
  return u < 0.5 ? u * 2 : (1 - u) * 2;
};
/** stroke props that draw a path to fraction k (the path needs pathLength={1}) */
export const drawn = (k: number) => ({ pathLength: 1, strokeDasharray: "1 1", strokeDashoffset: 1 - cl(k) });
export const uid = () => "b" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
export { alpha, mixHex, rnd };
/** the camera drift every B shot uses (L18 probe lesson: zoom 1.12 per cycle, pan ≥ 4 % of the width) */
export const DRIFT = (seed: number, panX = 0.045) => ({ zoom: 1.12, panX: seed % 2 ? panX : -panX, panY: 0.012, frames: 120, seed });

// ---------------------------------------------------------------------------------------------------------------
// shot plumbing
// ---------------------------------------------------------------------------------------------------------------
export type Phase<Cu> = { at: number; S: React.FC<{ f: number; len: number; c: Cu }>; dir?: "up" | "down" | "left" | "right"; blend?: number };

/** A ShotDef made of continuous phases (PUSH / SLIDE rows): phases by SCENE frame, the first at the shot's own `from`. */
export function runOf<Cu>(get: (c: Cu) => Phase<Cu>[]): ShotFC<Cu> {
  const R: ShotFC<Cu> = ({ f, len, c }) => {
    const ph = get(c);
    const s0 = ph[0].at;
    const F = s0 + f;
    let k = 0;
    for (let i = 0; i < ph.length; i++) if (F >= ph[i].at) k = i;
    const endOf = (i: number) => (i + 1 < ph.length ? ph[i + 1].at : s0 + len);
    const P = ph[k];
    const cur = <P.S f={F - P.at} len={endOf(k) - P.at} c={c} />;
    const blend = P.blend ?? 14;
    if (k > 0 && F - P.at < blend) {
      const Q = ph[k - 1];
      const prev = <Q.S f={F - Q.at} len={endOf(k - 1) - Q.at} c={c} />;
      return <Dissolve t={(F - P.at) / blend} from={prev} to={cur} dir={P.dir ?? "up"} push={60} />;
    }
    return cur;
  };
  return R;
}

/** A hard cut's pop (scale bump over 9 frames). */
export const Pop: React.FC<{ f: number; children: React.ReactNode }> = ({ f, children }) => (
  <AbsoluteFill style={{ transform: `scale(${cutPop(f, 0)})`, transformOrigin: "50% 50%" }}>{children}</AbsoluteFill>
);

// ---------------------------------------------------------------------------------------------------------------
// fields
// ---------------------------------------------------------------------------------------------------------------
export const FamSky: React.FC<{ name: L19FamilyName; angle?: number; stops?: string[] }> = ({ name, angle = 90, stops }) => (
  <Sky family={familyOf(name)} stops={stops} x={-1400} y={-1400} w={4720} h={3880} angle={angle} />
);
/** The dark field: the family's first two sky stops only (limb, furnace), crimson-brown, never black. */
export const DarkSky: React.FC<{ name: "limb" | "furnace" }> = ({ name }) => {
  const F = familyOf(name);
  return <Sky stops={[F.sky[0], F.sky[1]]} x={-1400} y={-1400} w={4720} h={3880} />;
};

/** L18 probe lesson: wide low-contrast tone bands sliding across the whole field (luma step ≈ 0.06-0.09). Dark pairs stay
 *  under V 0.3. Draw right after the sky. */
const BANDS: Record<L19FamilyName, [string, string]> = {
  limb: ["#220602", "#3E1004"],
  furnace: ["#240602", "#3E1004"],
  deepdeck: ["#D8381C", "#EE5424"],
  crest: ["#FF9A2E", "#FFB848"],
  scope: ["#00A35A", "#12BA6C"],
};
export const BandField19: React.FC<{ f: number; k: L19FamilyName; speed?: number; angle?: number; w?: number; opacity?: number }> = ({ f, k, speed = 4, angle = -18, w = 230, opacity = 1 }) => {
  const [a, b] = BANDS[k];
  const off = mod(f * speed, 2 * w);
  return (
    <g opacity={opacity} transform={`rotate(${angle} 960 540)`}>
      <rect x={-1600} y={-1600} width={5200} height={4400} fill={a} />
      {Array.from({ length: Math.ceil(5200 / (2 * w)) + 2 }, (_, i) => (
        <rect key={i} x={-1600 - 2 * w + i * 2 * w + off} y={-1600} width={w} height={4400} fill={b} />
      ))}
    </g>
  );
};

/** Wide soft glow bands that rise (dir -1) or sink (dir 1) at `speed` px/f: the furnace's "glow flowing". */
export const GlowBands: React.FC<{ f: number; speed?: number; color?: string; period?: number; h?: number; opacity?: number; dir?: 1 | -1 }> = ({
  f,
  speed = 20,
  color = C.glow,
  period = 460,
  h = 190,
  opacity = 0.42,
  dir = -1,
}) => {
  const id = uid();
  const off = mod(f * speed, period);
  const n = Math.ceil(2000 / period) + 2;
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity={0} />
          <stop offset="0.5" stopColor={color} stopOpacity={1} />
          <stop offset="1" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      {Array.from({ length: n }, (_, i) => {
        const y = -500 + i * period + (dir < 0 ? -off : off - period);
        return <rect key={i} x={-500} y={y} width={2920} height={h} fill={`url(#${id})`} opacity={opacity} />;
      })}
    </g>
  );
};

/** Jupiter's limb: a huge disc rising from the bottom, its bands shearing in opposite directions (never frozen). */
export const Limb: React.FC<{ f: number; cx?: number; cy?: number; r?: number; speed?: number; shear?: number[]; rim?: string }> = ({
  f,
  cx = 960,
  cy = 2250,
  r = 1500,
  speed = 0,
  shear = [18, -16, 22, -14, 20, -18],
  rim = "#FFD27A",
}) => {
  const id = uid();
  const top = cy - r;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 90} fill={C.glow} opacity={0.22} />
      <circle cx={cx} cy={cy} r={r + 36} fill={C.flare} opacity={0.16} />
      <defs>
        <clipPath id={id}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <DeckBands f={f} speed={speed} shear={shear} x={cx - r} y={top} w={2 * r} h={Math.min(2 * r, 1500 - top)} belt seed={7} />
      </g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={rim} strokeWidth={6} opacity={0.85} />
    </g>
  );
};

/** A striped Jupiter disc: bands shearing (16-22 px/f), a lit rim. */
export const Planet: React.FC<{ cx: number; cy: number; r: number; f: number; shear?: number[]; speed?: number; dim?: number }> = ({ cx, cy, r, f, shear = [18, -16, 20, -14], speed = 0, dim = 0 }) => {
  const id = uid();
  return (
    <g>
      <circle cx={cx} cy={cy} r={r * 1.16} fill={C.glow} opacity={0.16} />
      <defs>
        <clipPath id={id}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
        <radialGradient id={id + "s"} cx="0.4" cy="0.38" r="0.7">
          <stop offset="0.6" stopColor="#1A0402" stopOpacity={0} />
          <stop offset="1" stopColor="#1A0402" stopOpacity={0.45} />
        </radialGradient>
      </defs>
      <g clipPath={`url(#${id})`}>
        <DeckBands f={f} speed={speed} shear={shear} x={cx - r} y={cy - r} w={2 * r} h={2 * r} belt seed={3} />
        <circle cx={cx} cy={cy} r={r} fill={`url(#${id}s)`} />
        {dim > 0 ? <circle cx={cx} cy={cy} r={r} fill="#1A0402" opacity={dim} /> : null}
      </g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.goldHot} strokeWidth={Math.max(3, r * 0.012)} opacity={0.8} />
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// text (asserted)
// ---------------------------------------------------------------------------------------------------------------
const numStyle = (size: number, color: string): React.CSSProperties => ({ fontFamily: IF2.num, fontWeight: 800, fontSize: size, fill: color, fontVariantNumeric: "tabular-nums", letterSpacing: -size * 0.02 });

export const Num: React.FC<{ x: number; y: number; text: string; size?: number; color?: string; align?: "start" | "middle" | "end"; who?: string; opacity?: number }> = ({
  x,
  y,
  text,
  size = 72,
  color = PILL_TEXT,
  align = "start",
  who = "Num",
  opacity = 1,
}) => (
  <text x={x} y={y} textAnchor={align} opacity={opacity} style={numStyle(size, color)}>
    {assertAllowed(text, who)}
  </text>
);

export const Label: React.FC<{ x: number; y: number; text: string; size?: number; color?: string; align?: "start" | "middle" | "end"; opacity?: number; spacing?: number; halo?: string }> = ({
  x,
  y,
  text,
  size = 26,
  color = PILL_TEXT,
  align = "start",
  opacity = 1,
  spacing,
  halo,
}) => (
  <text
    x={x}
    y={y}
    textAnchor={align}
    opacity={opacity}
    stroke={halo}
    strokeWidth={halo ? size * 0.28 : 0}
    paintOrder="stroke"
    style={{ fontFamily: IF2.label, fontSize: size, letterSpacing: spacing ?? size * 0.12, fill: color }}
  >
    {assertAllowed(labelCase(text), "Label")}
  </text>
);

/** Integer readout rolling from → value (odometer), the unit after it as its own span (both asserted). */
export const RollInt: React.FC<{ x: number; y: number; value: number; k: number; unit?: string; size?: number; color?: string; unitColor?: string; who?: string; from?: number }> = ({
  x,
  y,
  value,
  k,
  unit,
  size = 96,
  color = PILL_TEXT,
  unitColor,
  who = "RollInt",
  from = 0,
}) => {
  assertValue(value, who);
  if (unit) assertAllowed(unit, who);
  const t = cl(k);
  const v = t >= 1 ? value : Math.floor(from + (value - from) * t);
  const digits = value.toLocaleString("en-US");
  const nd = Math.max(digits.replace(/,/g, "").length, String(Math.floor(Math.max(from, value))).length);
  const numW = nd * size * 0.6 + (digits.match(/,/g)?.length ?? 0) * size * 0.22;
  return (
    <g>
      <Counter x={x} y={y} value={v} max={Math.max(value, from)} size={size} color={color} align="start" digits={nd} />
      {unit ? (
        <text x={x + numW + size * 0.18} y={y} style={{ fontFamily: IF2.num, fontWeight: 600, fontSize: size * 0.42, fill: unitColor ?? color }}>
          {unit}
        </text>
      ) : null}
    </g>
  );
};

/** One-decimal readout rolling 0 → value, the unit as its own span (asserted). */
export const RollDec: React.FC<{ x: number; y: number; value: number; k: number; unit?: string; size?: number; color?: string; unitColor?: string; who?: string }> = ({
  x,
  y,
  value,
  k,
  unit,
  size = 96,
  color = PILL_TEXT,
  unitColor,
  who = "RollDec",
}) => {
  assertValue(value, who);
  if (unit) assertAllowed(unit, who);
  const t = cl(k);
  const shown = (t >= 1 ? value : Math.floor(value * t * 10) / 10).toFixed(1);
  return (
    <text x={x} y={y} style={numStyle(size, color)}>
      {shown}
      {unit ? (
        <tspan dx={size * 0.16} style={{ fontSize: size * 0.42, fontWeight: 600, fill: unitColor ?? color, letterSpacing: size * 0.01 }}>
          {unit}
        </tspan>
      ) : null}
    </text>
  );
};

/** A dark rounded plate behind a readout. */
export const Plate: React.FC<{ x: number; y: number; w: number; h: number; color?: string; opacity?: number; stroke?: string; rx?: number }> = ({ x, y, w, h, color = "#1A0402", opacity = 0.8, stroke, rx }) => (
  <g>
    <rect x={x + 6} y={y + 9} width={w} height={h} rx={rx ?? h * 0.22} fill="#0A0201" opacity={0.25} />
    <rect x={x} y={y} width={w} height={h} rx={rx ?? h * 0.22} fill={color} opacity={opacity} stroke={stroke} strokeWidth={stroke ? 3 : 0} />
  </g>
);

/** A readout block on a plate: optional word before the number ("ABOUT"), the rolling number, the unit span; slides in. */
export const Readout: React.FC<{
  x: number;
  y: number;
  value: number;
  k: number;
  pre?: string;
  unit?: string;
  dec?: boolean;
  from?: number;
  size?: number;
  w?: number;
  appear?: number;
  plate?: string;
  color?: string;
  unitColor?: string;
  who: string;
}> = ({ x, y, value, k, pre, unit, dec = false, from = 0, size = 92, w = 760, appear = 1, plate = "#1A0402", color = PILL_TEXT, unitColor = C.heard, who }) => {
  const a = sm(appear);
  if (a <= 0) return null;
  const h = size * (pre ? 1.62 : 1.3);
  const ny = y + (pre ? size * 1.36 : size * 1.02);
  return (
    <g opacity={a} transform={`translate(${((1 - a) * -40).toFixed(1)} 0)`}>
      <Plate x={x} y={y} w={w} h={h} color={plate} opacity={0.84} />
      {pre ? <Label x={x + 34} y={y + size * 0.42} text={pre} size={size * 0.28} color={unitColor} /> : null}
      {dec ? (
        <RollDec x={x + 30} y={ny} value={value} k={k} unit={unit} size={size} color={color} unitColor={unitColor} who={who} />
      ) : (
        <RollInt x={x + 30} y={ny} value={value} k={k} unit={unit} size={size} color={color} unitColor={unitColor} who={who} from={from} />
      )}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// drawing heads, slams, rings, sets
// ---------------------------------------------------------------------------------------------------------------
/** A slam: the child lands from 2.2× scale over 8 frames with an expanding ring (age = frames since the slam). */
export const Slam: React.FC<{ age: number; x: number; y: number; ring?: string; size?: number; children: React.ReactNode }> = ({ age, x, y, ring = C.goldHot, size = 120, children }) => {
  if (age < 0) return null;
  const s = age < 8 ? 2.2 - 1.2 * sm(age / 8) : 1 + 0.04 * Math.max(0, 1 - (age - 8) / 6) * Math.sin(age);
  const rr = age >= 6 && age < 26 ? size * (0.6 + (age - 6) * 0.09) : 0;
  return (
    <g>
      {rr > 0 ? <circle cx={x} cy={y} r={rr} fill="none" stroke={ring} strokeWidth={6} opacity={1 - (age - 6) / 20} /> : null}
      <g transform={`translate(${x} ${y}) scale(${s.toFixed(3)}) translate(${-x} ${-y})`} opacity={Math.min(1, age / 3)}>
        {children}
      </g>
    </g>
  );
};

/** A dimension bracket from (x0,y0) to (x1,y1) with end feet (perpendicular), drawn to `k` with a lit head. */
export const Bracket19: React.FC<{ x0: number; y0: number; x1: number; y1: number; k: number; color?: string; feet?: number; width?: number }> = ({ x0, y0, x1, y1, k, color = C.heard, feet = 26, width = 6 }) => {
  const e = cl(k);
  const L = Math.hypot(x1 - x0, y1 - y0) || 1;
  const nx = -(y1 - y0) / L;
  const ny = (x1 - x0) / L;
  const xe = x0 + (x1 - x0) * e;
  const ye = y0 + (y1 - y0) * e;
  return (
    <g strokeLinecap="round" fill="none">
      <path d={`M${x0 + nx * feet} ${y0 + ny * feet} L${x0 - nx * feet} ${y0 - ny * feet}`} stroke={color} strokeWidth={width} />
      <path d={`M${x0} ${y0} L${xe} ${ye}`} stroke={color} strokeWidth={width} />
      {e >= 1 ? <path d={`M${x1 + nx * feet} ${y1 + ny * feet} L${x1 - nx * feet} ${y1 - ny * feet}`} stroke={color} strokeWidth={width} /> : null}
      {e > 0 && e < 1 ? (
        <g>
          <circle cx={xe} cy={ye} r={22} fill={C.goldHot} opacity={0.35} stroke="none" />
          <circle cx={xe} cy={ye} r={9} fill="#FFF3C8" stroke="none" />
        </g>
      ) : null}
    </g>
  );
};

/** A check mark drawn to k (base ≈ 200 px wide), with a lit pen dot while drawing. */
export const CheckPen: React.FC<{ x: number; y: number; k: number; s?: number; color?: string }> = ({ x, y, k, s = 1, color = C.heard }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-90 0 L-25 65 L105 -85" fill="none" stroke="#0A0201" strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" opacity={0.3} transform="translate(6 8)" {...drawn(k)} />
    <path d="M-90 0 L-25 65 L105 -85" fill="none" stroke={color} strokeWidth={36} strokeLinecap="round" strokeLinejoin="round" {...drawn(k)} />
  </g>
);

/** Expanding rings from (cx, cy): one every `every` frames at `speed` px/f (never settles). */
export const GlowRings: React.FC<{ f: number; cx: number; cy: number; every?: number; speed?: number; r0?: number; maxR?: number; color: string; ry?: number; width?: number }> = ({
  f,
  cx,
  cy,
  every = 24,
  speed = 20,
  r0 = 0,
  maxR = 600,
  color,
  ry = 1,
  width = 6,
}) => {
  const life = (maxR - r0) / speed;
  const n = Math.ceil(life / every) + 1;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const age = mod(f - i * every, n * every);
        if (age > life) return null;
        const r = r0 + age * speed;
        return <ellipse key={i} cx={cx} cy={cy} rx={r} ry={r * ry} fill="none" stroke={color} strokeWidth={width} opacity={0.75 * (1 - age / life)} />;
      })}
    </g>
  );
};

/** The station floor: a near plane with a lit lip (scope by default). */
export const Floor: React.FC<{ y: number; fill?: string; lip?: string }> = ({ y, fill = "#004A2E", lip = "#40D486" }) => (
  <g>
    <rect x={-1400} y={y} width={4720} height={1600} fill={fill} />
    <rect x={-1400} y={y} width={4720} height={8} fill={lip} opacity={0.8} />
  </g>
);

/** The listening-station console: an emerald desk with lamps that blink in a running stagger. */
export const Console: React.FC<{ x: number; y: number; w: number; f: number; h?: number }> = ({ x, y, w, f, h = 120 }) => (
  <g>
    <rect x={x + 8} y={y + 12} width={w} height={h} rx={18} fill="#002A1A" opacity={0.35} />
    <rect x={x} y={y} width={w} height={h} rx={18} fill="#00603A" stroke="#10C070" strokeWidth={4} />
    <rect x={x} y={y} width={w} height={18} rx={9} fill="#40D486" opacity={0.6} />
    {Array.from({ length: Math.floor(w / 60) }, (_, i) => {
      const on = mod(Math.floor(f / 5) - i, 9) < 3;
      return <circle key={i} cx={x + 40 + i * 60} cy={y + 64} r={12} fill={on ? C.heard : "#004A2E"} stroke={C.lever} strokeWidth={3} />;
    })}
  </g>
);

/** A pinned ledger sheet that swings from its pin at (x, y); children are drawn in sheet coordinates (0,0 = top-left). */
export const Sheet: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  f: number;
  swing?: number;
  phase?: number;
  kind?: "heard" | "model" | "apricot";
  title?: string;
  tilt?: number;
  pin?: boolean;
  children?: React.ReactNode;
}> = ({ x, y, w, h, f, swing = 4, phase = 0, kind = "heard", title, tilt = 0, pin = true, children }) => {
  const rot = tilt + swing * Math.sin(f * 0.33 + phase);
  const fill = kind === "heard" ? C.heard : kind === "model" ? C.modelDeep : C.apricot;
  const stroke = kind === "heard" ? C.lemonDeep : kind === "model" ? C.model : C.lever;
  const ink = kind === "model" ? C.modelLabel : INK;
  return (
    <g transform={`rotate(${rot.toFixed(2)} ${x} ${y})`}>
      <rect x={x - w / 2 + 10} y={y + 24} width={w} height={h} rx={16} fill="#0A0201" opacity={0.28} />
      <rect x={x - w / 2} y={y + 12} width={w} height={h} rx={16} fill={fill} stroke={stroke} strokeWidth={kind === "model" ? 7 : 4} strokeDasharray={kind === "model" ? "24 14" : undefined} strokeDashoffset={-f * 2} />
      {title ? <Label x={x - w / 2 + 30} y={y + 70} text={title} size={36} color={ink} /> : null}
      <g transform={`translate(${x - w / 2} ${y + 12})`}>{children}</g>
      {pin ? (
        <g>
          <circle cx={x + 3} cy={y + 6} r={17} fill="#0A0201" opacity={0.3} />
          <circle cx={x} cy={y} r={17} fill={C.lever} />
          <circle cx={x - 5} cy={y - 5} r={5} fill="#FFE8B0" />
        </g>
      ) : null}
    </g>
  );
};

/** A value bar growing from a baseline to h × k, with an optional wavering top (±waver px). */
export const ValueBar: React.FC<{ x: number; base: number; w: number; h: number; k: number; f: number; color: string; waver?: number; dashed?: boolean; opacity?: number }> = ({
  x,
  base,
  w,
  h,
  k,
  f,
  color,
  waver = 0,
  dashed = false,
  opacity = 1,
}) => {
  const hh = Math.max(0, h * cl(k));
  if (hh <= 0) return null;
  const pts: string[] = [];
  for (let s = 0; s <= w; s += w / 8) pts.push(`${(x + s).toFixed(1)},${(base - hh + Math.sin(f * 0.5 + s / 22) * waver).toFixed(1)}`);
  const d = `M${x} ${base} L${pts.join(" L")} L${x + w} ${base} Z`;
  return (
    <g opacity={opacity}>
      <path d={d} fill="#0A0201" opacity={0.25} transform="translate(8 6)" />
      <path d={d} fill={dashed ? alpha(color, 0.25) : color} stroke={dashed ? color : mixHex(color, "#0A0201", 0.3)} strokeWidth={dashed ? 6 : 3} strokeDasharray={dashed ? "18 12" : undefined} strokeDashoffset={-f * 2} />
      {!dashed ? <path d={`M${x + w * 0.12} ${base} L${x + w * 0.12} ${base - hh + 12}`} stroke="#FFF6C8" strokeWidth={w * 0.08} opacity={0.35} strokeLinecap="round" /> : null}
    </g>
  );
};

/** A row of six instrument chips. lit 0..6 (stagger), dark chips can flicker a "?" in turn (6-10). */
export const ChipRow: React.FC<{ x: number; y: number; f: number; lit?: number; q?: boolean; size?: number; gap?: number }> = ({ x, y, f, lit = 0, q = false, size = 90, gap = 26 }) => (
  <g>
    {Array.from({ length: 6 }, (_, i) => {
      const cx = x + i * (size + gap);
      const on = cl(lit - i);
      const turn = q && mod(Math.floor(f / 8), 6) === i;
      return (
        <g key={i}>
          <rect x={cx + 5} y={y + 8} width={size} height={size} rx={size * 0.2} fill="#0A0201" opacity={0.3} />
          <rect x={cx} y={y} width={size} height={size} rx={size * 0.2} fill="#00301E" stroke={turn ? C.heard : "#10C070"} strokeWidth={turn ? 6 : 3} />
          {on > 0 ? <rect x={cx + 8} y={y + 8} width={size - 16} height={size - 16} rx={size * 0.14} fill={C.heard} opacity={on * (0.85 + 0.15 * Math.sin(f * 0.5 + i))} /> : null}
          {turn ? (
            <text x={cx + size / 2} y={y + size * 0.72} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: size * 0.66, fill: C.heard }}>
              ?
            </text>
          ) : null}
        </g>
      );
    })}
  </g>
);

/** The ledger's small measurement icons (8-03, 8-04): wind, temperature, pressure, helium, a thin cloud, dry air. */
export const LedgerIcon: React.FC<{ kind: "wind" | "temp" | "press" | "helium" | "cloud" | "dry"; x: number; y: number; s?: number; f: number }> = ({ kind, x, y, s = 1, f }) => {
  const k = s;
  const ink = INK;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <circle r={62} fill={C.apricot} stroke={C.lever} strokeWidth={5} />
      {kind === "wind"
        ? [-20, 0, 20].map((dy, i) => <path key={i} d={`M-38 ${dy} Q0 ${dy - 14} 34 ${dy}`} stroke={ink} strokeWidth={7} fill="none" strokeLinecap="round" strokeDasharray="60 200" strokeDashoffset={-mod(f * 3 + i * 20, 80)} />)
        : null}
      {kind === "temp" ? (
        <g>
          <rect x={-9} y={-42} width={18} height={60} rx={9} fill="none" stroke={ink} strokeWidth={6} />
          <circle cx={0} cy={28} r={16} fill={C.glow} stroke={ink} strokeWidth={6} />
          <rect x={-4} y={-20 + 8 * Math.sin(f * 0.3)} width={8} height={40} fill={C.glow} />
        </g>
      ) : null}
      {kind === "press" ? (
        <g>
          <circle r={36} fill="none" stroke={ink} strokeWidth={6} />
          <line x1={0} y1={0} x2={26 * Math.cos(f * 0.12)} y2={26 * Math.sin(f * 0.12)} stroke={ink} strokeWidth={7} strokeLinecap="round" />
        </g>
      ) : null}
      {kind === "helium" ? (
        <g>
          <ellipse cx={0} cy={-8 + 4 * Math.sin(f * 0.2)} rx={26} ry={32} fill={C.lever} stroke={ink} strokeWidth={5} />
          <path d={`M0 ${24 + 4 * Math.sin(f * 0.2)} Q-8 40 4 54`} stroke={ink} strokeWidth={4} fill="none" />
          <text x={0} y={2} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 24, fill: ink }}>
            He
          </text>
        </g>
      ) : null}
      {kind === "cloud" ? <path d="M-40 14 Q-44 -12 -18 -10 Q-12 -32 10 -24 Q30 -36 38 -10 Q52 -4 40 14 Z" fill="#FFF0A0" stroke={ink} strokeWidth={5} transform={`translate(${6 * Math.sin(f * 0.15)} 0)`} /> : null}
      {kind === "dry" ? (
        <g>
          <path d="M0 -40 Q30 0 22 18 Q12 40 0 40 Q-12 40 -22 18 Q-30 0 0 -40 Z" fill={C.belt} stroke={ink} strokeWidth={5} />
          <line x1={-40} y1={40} x2={40} y2={-40} stroke={ink} strokeWidth={9} strokeLinecap="round" />
        </g>
      ) : null}
    </g>
  );
};

/** Ink placeholder strokes on a sheet (no numerals: "the numbers" as abstract marks), sliding by `slide` px. */
export const MarkLines: React.FC<{ x: number; y: number; w: number; n: number; f: number; slide?: number; color?: string; gap?: number }> = ({ x, y, w, n, f, slide = 0, color = INK, gap = 40 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const ww = w * (0.45 + 0.5 * rnd(i * 7 + 1));
      const sh = Math.sin(f * 0.4 + i) * 3;
      return <rect key={i} x={x + slide * (i % 2 ? 1 : -1)} y={y + i * gap + sh} width={ww} height={14} rx={7} fill={color} opacity={0.6} />;
    })}
  </g>
);

export const arcPt = (t: number) => {
  const P0 = [1700, -150];
  const P1 = [900, 560];
  const P2 = [1700, 1230];
  const u = 1 - t;
  return [u * u * P0[0] + 2 * u * t * P1[0] + t * t * P2[0], u * u * P0[1] + 2 * u * t * P1[1] + t * t * P2[1]];
};
/** Juno gliding along a bent arc past the planet (30 px/f, loops forever), a dashed path and a short trail. */
export const JunoArc: React.FC<{ f: number; period?: number }> = ({ f, period = 52 }) => {
  const t = fr(f / period);
  const [jx, jy] = arcPt(t);
  const path = Array.from({ length: 41 }, (_, k) => arcPt(k / 40)).map(([x, y], k) => `${k ? "L" : "M"}${x.toFixed(0)} ${y.toFixed(0)}`).join(" ");
  return (
    <g>
      <path d={path} fill="none" stroke={C.gold} strokeWidth={5} strokeDasharray="18 14" strokeDashoffset={-f * 6} opacity={0.75} />
      {[1, 2, 3].map((k) => {
        const [x, y] = arcPt(Math.max(0, t - k * 0.04));
        return <circle key={k} cx={x} cy={y} r={14 - k * 3} fill={C.goldHot} opacity={0.6 - k * 0.15} />;
      })}
      <Orbiter x={jx} y={jy} kind="juno" f={f} size={0.62} />
    </g>
  );
};
