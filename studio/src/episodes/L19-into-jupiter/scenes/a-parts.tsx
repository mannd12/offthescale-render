// L19 package-A helpers (Cold, S01-S04 only; package B never imports this file). Small drawing pieces the five scenes share:
// the phase/pop plumbing, the full-frame background movers of the four families A uses (limb · crest · deepdeck · scope; the
// furnace field for C-09), the readouts (every numeral goes through data19: READ / assertAllowed / assertValue) and a few
// bespoke props (survey pad, clipboard, brackets, timer disc, g-meter, seesaw, cards, chevron arrows, heat shimmer, data
// dots). Shot bodies stay bespoke in each scene file (hard rule 1). No people (F1): Tick is the only figure.
// Probe lesson (BUILD.md header): every background here carries a full-frame mover (deck bands scrolling / shearing, wall
// panels sliding 5 px/f, wide light bands sweeping) so no shot depends on a thin mover to read as alive.
import React, { useId } from "react";
import { AbsoluteFill } from "remotion";
import { Bloom, Counter, IF2, Kicker, Metric, Motes, Sky, alpha, cutPop, mixHex, ramp, rnd, smooth } from "../../../lib/illustrated";
import { L19_COLORS, familyOf } from "../families";
import { READ, ReadKey, assertAllowed, assertValue } from "../data19";
import { DeckBands } from "../decks";
import { StarsTint } from "../flows19";

export const C = L19_COLORS;
export const LIMB = familyOf("limb");
export const CREST = familyOf("crest");
export const DEEP = familyOf("deepdeck");
export const SCOPE = familyOf("scope");
export const FURN = familyOf("furnace");
export const INK = C.ink;
const sid = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, "");

export const cl01 = (v: number) => Math.max(0, Math.min(1, v));
/** eased 0..1 between frames a and b */
export const ez = (f: number, a: number, b: number) => smooth(ramp(f, a, b));
/** linear 0..1 between frames a and b (constant-speed movers) */
export const lin = (f: number, a: number, b: number) => cl01((f - a) / Math.max(1, b - a));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const wrap = (v: number, m: number) => ((v % m) + m) % m;
export const fr = (v: number) => v - Math.floor(v);
/** the camera drift every package-A shot uses (L18 probe lesson: zoom ≥ 1.1 per cycle, pan ≥ 4 % of the width) */
export const DRIFT = (seed: number, zoom = 1.1, panX = 0.04, panY = 0.0, frames = 150) => ({ zoom, panX: seed % 2 ? panX : -panX, panY, frames, seed });

/** A hard cut's pop (scale bump over 9 frames). */
export const Pop: React.FC<{ f: number; children: React.ReactNode }> = ({ f, children }) => (
  <AbsoluteFill style={{ transform: `scale(${cutPop(f, 0)})`, transformOrigin: "50% 50%" }}>{children}</AbsoluteFill>
);

/** Two phases of one shot (a storyboard PUSH or SLIDE): `a` until `at`, then `b` arrives over `dur` frames. */
export const Phase: React.FC<{ f: number; at: number; dur?: number; kind?: "slide" | "push"; a: React.ReactNode; b: React.ReactNode }> = ({ f, at, dur = 15, kind = "slide", a, b }) => {
  const k = ez(f, at, at + dur);
  if (k <= 0) return <AbsoluteFill>{a}</AbsoluteFill>;
  if (k >= 1) return <AbsoluteFill>{b}</AbsoluteFill>;
  if (kind === "slide")
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <AbsoluteFill style={{ transform: `translateX(${(-k * 1920).toFixed(1)}px)` }}>{a}</AbsoluteFill>
        <AbsoluteFill style={{ transform: `translateX(${((1 - k) * 1920).toFixed(1)}px)` }}>{b}</AbsoluteFill>
      </AbsoluteFill>
    );
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${1 + k * 0.6})`, opacity: 1 - k }}>{a}</AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${0.9 + k * 0.1})`, opacity: k }}>{b}</AbsoluteFill>
    </AbsoluteFill>
  );
};

export const ClipCircle: React.FC<{ cx: number; cy: number; r: number; children: React.ReactNode }> = ({ cx, cy, r, children }) => {
  const id = "cc" + sid(useId());
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>{children}</g>
    </g>
  );
};
export const ClipBox: React.FC<{ x: number; y: number; w: number; h: number; rx?: number; children: React.ReactNode }> = ({ x, y, w, h, rx = 0, children }) => {
  const id = "cb" + sid(useId());
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={x} y={y} width={w} height={h} rx={rx} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>{children}</g>
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// backgrounds (storyboard §1 hexes; nothing grey, cream or blue-grey)
// ---------------------------------------------------------------------------------------------------------------
/** Wide soft-edged diagonal light bands sliding across the whole frame at `speed` px/f (the probe-visible background mover). */
export const DriftBands: React.FC<{ f: number; color: string; opacity?: number; speed?: number; n?: number; w?: number; angle?: number; seed?: number }> = ({
  f,
  color,
  opacity = 0.3,
  speed = 5,
  n = 3,
  w = 440,
  angle = 22,
  seed = 1,
}) => {
  const id = "db" + sid(useId());
  const span = 3600;
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={color} stopOpacity={0} />
          <stop offset="0.3" stopColor={color} stopOpacity={opacity} />
          <stop offset="0.7" stopColor={color} stopOpacity={opacity} />
          <stop offset="1" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <g transform={`rotate(${angle} 960 540)`}>
        {Array.from({ length: n }, (_, i) => {
          const x = wrap(i * (span / n) + rnd(seed * 7 + i) * 300 + f * speed, span) - 1100;
          const ww = w * (0.8 + 0.5 * rnd(seed * 3 + i));
          return <rect key={i} x={x} y={-900} width={ww} height={2880} fill={`url(#${id})`} />;
        })}
      </g>
    </g>
  );
};

/** The warm-black to crimson space field: the limb sky stops, two wide crimson bands drifting (5 px/f, V < 0.3 kept), tinted
 *  stars sliding. */
export const SpaceField: React.FC<{ f: number; speed?: number; angle?: number; n?: number; seed?: number; bands?: number }> = ({ f, speed = 12, angle = 180, n = 90, seed = 1, bands = 5 }) => (
  <g>
    {/* art-director pass: held at the first stop (the frame reads sky[0] to sky[1], never the third stop) */}
    <Sky stops={[LIMB.sky[0], LIMB.sky[0], LIMB.sky[1]]} />
    {bands > 0 ? <DriftBands f={f} color="#7A1A08" opacity={0.55} speed={bands} n={3} w={560} angle={-26} seed={seed} /> : null}
    <StarsTint f={f} x={-100} y={-100} w={2120} h={1280} n={n} speed={speed} angle={angle} seed={seed} size={2.6} />
  </g>
);

const LIMB_COLORS = [C.stripeOrange, C.stripeAmber, C.stripeRust, "#F28A1E", "#FFC247", C.stripeRust];
/**
 * Jupiter's limb: the planet disc (centre cx, cy; radius R, any size) filled with the deck bands SHEARING sideways in
 * opposite directions (`shear` px/f per band), `scroll` px/f of slow band drift, a lit rim, an amber glow band outside it and
 * a soft terminator shading toward the bottom. Only the part inside the frame is drawn. Keep ≥ 25 % of the frame on it
 * (foundation note: empty limb space measures chroma 0.36).
 */
export const Limb: React.FC<{ f: number; cx: number; cy: number; R: number; shear?: number[]; scroll?: number; belt?: boolean; glow?: number; shade?: number; night?: number; seed?: number; colors?: string[] }> = ({
  f,
  cx,
  cy,
  R,
  shear = [18, -20, 22, -16, 20, -24],
  scroll = 0,
  belt = true,
  glow = 1,
  shade = 0.35,
  night = 0.62,
  seed = 1,
  colors = LIMB_COLORS,
}) => {
  const id = "lb" + sid(useId());
  const x0 = Math.max(-200, cx - R);
  const x1 = Math.min(2120, cx + R);
  const y0 = Math.max(-200, cy - R);
  const y1 = Math.min(1280, cy + R);
  if (x1 <= x0 || y1 <= y0) return null;
  return (
    <g>
      <defs>
        <radialGradient id={id + "s"} cx="0.42" cy="0.3" r="0.75">
          <stop offset="0.55" stopColor="#2A0804" stopOpacity={0} />
          <stop offset="1" stopColor="#2A0804" stopOpacity={shade} />
        </radialGradient>
        {/* art-director pass: the night side. A lit crescent along the rim, the disc falling into shadow below it */}
        <linearGradient id={id + "n"} gradientUnits="userSpaceOnUse" x1={0} y1={cy - R + 50} x2={0} y2={cy - R + 430}>
          <stop offset="0" stopColor="#1E0603" stopOpacity={0} />
          <stop offset="1" stopColor="#1E0603" stopOpacity={night} />
        </linearGradient>
      </defs>
      {glow > 0 ? <Bloom x={cx} y={cy} r={R * 1.08} color="#FF8A3D" strength={0.24 * glow} /> : null}
      <circle cx={cx} cy={cy} r={R + 14} fill="none" stroke="#F0601A" strokeWidth={26} opacity={0.35 * glow} />
      <ClipCircle cx={cx} cy={cy} r={R}>
        <DeckBands f={f} speed={scroll} shear={shear} x={x0} y={y0} w={x1 - x0} h={y1 - y0} belt={belt} seed={seed} colors={colors} />
        <circle cx={cx} cy={cy} r={R} fill={`url(#${id}s)`} />
        {night > 0 ? <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill={`url(#${id}n)`} /> : null}
      </ClipCircle>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="#FFD27A" strokeWidth={6} opacity={0.85} />
    </g>
  );
};

const CREST_COLORS = ["#F28A1E", "#FFC247", "#E2571F", "#FFE066", "#F2A31B", "#B8431A"];
const DEEP_COLORS = ["#D8381C", "#F26A1E", "#A02418", "#C0301A", "#F28A1E", "#8E1A18"];
/** The descent: decks scroll UP past a falling probe at `speed` px/f and shear sideways, plus a wide light band sweep. */
export const Descent: React.FC<{ f: number; fam: "crest" | "deep"; speed: number; shear?: number[]; belt?: boolean; ghost?: ("HIGH" | "MIDDLE" | "LOW")[]; ghostDraw?: number; fill?: number; seed?: number; y?: number; h?: number }> = ({
  f,
  fam,
  speed,
  shear = [18, -22, 24, -16, 20, -26],
  belt = true,
  ghost,
  ghostDraw,
  fill,
  seed = 1,
  y = 0,
  h = 1080,
}) => (
  <g>
    <Sky family={fam === "crest" ? CREST : DEEP} />
    {/* art-director pass: the probe (2026-11-21) measured 65-79 % of the frame changing every 0.5 s here. Scroll x0.15, shear x0.3,
        bands 2.4x taller, streaks at half: the decks still rise and shear (2-4 px/f, 5-11 px/f), the wisps carry the speed of the fall */}
    <DeckBands f={f} speed={speed * 0.15} shear={shear.map((s) => s * 0.3)} scale={2.4} streak={0.5} y={y} h={h} colors={fam === "crest" ? CREST_COLORS : DEEP_COLORS} belt={belt} ghost={ghost} ghostDraw={ghostDraw} fill={fill} seed={seed} />
    <DriftBands f={f} color={fam === "crest" ? "#FFF0A0" : "#FFB347"} opacity={fam === "crest" ? 0.22 : 0.2} speed={3} n={2} w={480} angle={-18} seed={seed + 2} />
  </g>
);

/**
 * Tick's listening station (scope): phosphor-emerald wall whose panels (far / mid stops) slide past at `pan` px/f, a lemon
 * lamp row riding with them, a wide warm light band sweeping, an optional window onto the fall (deck bands scrolling up
 * at `winSpeed` px/f with a tiny canopy probe) and the console desk plane.
 */
export const Station: React.FC<{ f: number; desk?: number; pan?: number; seed?: number; win?: { x: number; y: number; w: number; h: number }; winSpeed?: number; probe?: boolean }> = ({
  f,
  desk = 900,
  pan = 5,
  seed = 1,
  win,
  winSpeed = 20,
  probe = true,
}) => (
  <g>
    <Sky family={SCOPE} />
    {Array.from({ length: 12 }, (_, i) => {
      const x = wrap(i * 250 - f * pan + seed * 70, 3000) - 520;
      return <rect key={i} x={x} y={-40} width={242} height={desk + 40} fill={i % 2 ? SCOPE.far : SCOPE.mid} opacity={0.55} />;
    })}
    {Array.from({ length: 13 }, (_, i) => {
      const x = wrap(i * 230 - f * pan + seed * 70 + 120, 2990) - 520;
      return (
        <g key={"l" + i}>
          <circle cx={x} cy={64} r={30 * (0.8 + 0.2 * Math.sin(f / 7 + i))} fill={C.heard} opacity={0.22} />
          <circle cx={x} cy={64} r={10} fill={C.heard} stroke={C.lever} strokeWidth={3} />
        </g>
      );
    })}
    <DriftBands f={f} color="#FFE08A" opacity={0.24} speed={pan} n={1} w={460} angle={18} seed={seed + 4} />
    {win ? (
      <g>
        <rect x={win.x - 14} y={win.y - 14} width={win.w + 28} height={win.h + 28} rx={30} fill={C.emeraldDeep} />
        <ClipBox x={win.x} y={win.y} w={win.w} h={win.h} rx={20}>
          <rect x={win.x} y={win.y} width={win.w} height={win.h} fill="#FF9A2E" />
          <DeckBands f={f} speed={winSpeed} shear={[16, -20, 18, -14]} x={win.x} y={win.y} w={win.w} h={win.h} colors={CREST_COLORS} belt seed={seed + 9} />
          {probe ? <WinProbe f={f} x={win.x + win.w * 0.5} y={win.y + win.h * 0.36} s={win.h / 300} /> : null}
        </ClipBox>
        <rect x={win.x} y={win.y} width={win.w} height={win.h} rx={20} fill="none" stroke={C.goldRim} strokeWidth={8} />
        <rect x={win.x + 16} y={win.y + 10} width={win.w * 0.4} height={10} rx={5} fill="#FFF0A0" opacity={0.4} />
      </g>
    ) : null}
    <Bloom x={420} y={160} r={700} color="#FFE08A" strength={0.2} />
    <rect x={-400} y={desk} width={2720} height={700} fill={SCOPE.near} />
    <rect x={-400} y={desk} width={2720} height={8} fill={mixHex(SCOPE.light, SCOPE.mid, 0.2)} />
    <rect x={-400} y={desk + 8} width={2720} height={60} fill={mixHex(SCOPE.near, SCOPE.mid, 0.5)} opacity={0.7} />
    <Motes frame={f} n={14} w={1920} h={desk} color={alpha(C.heard, 0.5)} seed={seed + 3} />
  </g>
);

/** A tiny canopy probe for windows and far shots (the shared Capsule/Canopy are the hero versions). */
export const WinProbe: React.FC<{ f: number; x: number; y: number; s?: number }> = ({ f, x, y, s = 1 }) => {
  const sw = Math.sin(f * 0.12) * 6;
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(${sw})`}>
      <path d="M-46 -40 Q0 -92 46 -40 Z" fill="#FFE066" stroke={C.goldRim} strokeWidth={4} />
      <line x1={-42} y1={-40} x2={-6} y2={8} stroke={C.goldRim} strokeWidth={2} />
      <line x1={42} y1={-40} x2={6} y2={8} stroke={C.goldRim} strokeWidth={2} />
      <ellipse cx={0} cy={18} rx={18} ry={15} fill={C.probe} stroke={C.goldRim} strokeWidth={3} />
    </g>
  );
};

/** The furnace field (C-09): crimson-brown to glowing red-orange, two glow bands drifting. */
export const FurnaceField: React.FC<{ f: number; seed?: number }> = ({ f, seed = 1 }) => (
  <g>
    <Sky family={FURN} />
    <DriftBands f={f} color="#F0601A" opacity={0.3} speed={6} n={3} w={520} angle={-20} seed={seed} />
  </g>
);

// ---------------------------------------------------------------------------------------------------------------
// readouts (every numeral through data19)
// ---------------------------------------------------------------------------------------------------------------
const fmt = (v: number, dec: number) => {
  const s = v.toFixed(dec);
  const [a, b] = s.split(".");
  const w = a.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return b ? `${w}.${b}` : w;
};

/** A static metric: value + unit (explicit unit span, F13), drop shadow; `reveal` types it on. */
export const MetricA: React.FC<{ x: number; y: number; value: string; unit?: string; size?: number; color?: string; reveal?: number; align?: "start" | "middle" | "end"; shadow?: string }> = ({
  x,
  y,
  value,
  unit,
  size = 110,
  color = "#FFEFC8",
  reveal = 1,
  align = "start",
  shadow = "#1A0402",
}) => {
  assertAllowed(`${value} ${unit ?? ""}`, "package-A metric");
  const r = cl01(reveal);
  if (r <= 0) return null;
  const v = value.slice(0, Math.ceil(value.length * r));
  return (
    <g>
      <Metric x={x + 4} y={y + 5} value={v} unit={r >= 1 ? unit : undefined} size={size} color={shadow} align={align} />
      <Metric x={x} y={y} value={v} unit={r >= 1 ? unit : undefined} size={size} color={color} unitColor={color} align={align} />
    </g>
  );
};

/**
 * A rolling readout ending on a data19 value (motion in between is not a claim): a prefix line ("MORE THAN"), the number
 * (decimals as the table gives them), the unit as its own span (F13) and an optional suffix line.
 */
export const Roll: React.FC<{
  x: number;
  y: number;
  k: number;
  rkey: ReadKey;
  size?: number;
  color?: string;
  prefix?: string;
  unit?: string;
  suffix?: string;
  dec?: number;
  shadow?: string;
}> = ({ x, y, k, rkey, size = 110, color = "#FFEFC8", prefix, unit, suffix, dec = 0, shadow = "#1A0402" }) => {
  const R = READ[rkey];
  const end = assertValue(R.value ?? 0, `Roll ${rkey}`);
  assertAllowed(`${prefix ?? ""} ${fmt(end, dec)} ${unit ?? ""} ${suffix ?? ""}`, `Roll ${rkey}`);
  const v = end * smooth(cl01(k));
  const txt = fmt(v, dec);
  const st = (c: string): React.CSSProperties => ({ fontFamily: IF2.num, fontWeight: 800, fontSize: size, fontVariantNumeric: "tabular-nums", fill: c, letterSpacing: -size * 0.02 });
  const w = fmt(end, dec).length * size * 0.56;
  return (
    <g>
      {prefix ? (
        <text x={x + 3} y={y - size * 0.98} style={{ fontFamily: IF2.label, fontSize: size * 0.3, letterSpacing: size * 0.04, fill: color }}>
          {prefix}
        </text>
      ) : null}
      <text x={x + 4} y={y + 5} style={st(shadow)}>
        {txt}
      </text>
      <text x={x} y={y} style={st(color)}>
        {txt}
      </text>
      {unit ? (
        <text x={x + w + size * 0.12} y={y} style={{ fontFamily: IF2.num, fontWeight: 700, fontSize: size * 0.42, fill: color }}>
          {unit}
        </text>
      ) : null}
      {suffix ? (
        <text x={x + 3} y={y + size * 0.5} style={{ fontFamily: IF2.label, fontSize: size * 0.28, letterSpacing: size * 0.04, fill: color }}>
          {suffix}
        </text>
      ) : null}
    </g>
  );
};

/** A tag on a dark plate (the storyboard's short tags and Kickers). Numerals in it are checked. */
export const Plate: React.FC<{ x: number; y: number; text: string; size?: number; color?: string; fill?: string; appear?: number; align?: "start" | "middle" | "end"; stroke?: string }> = ({
  x,
  y,
  text,
  size = 30,
  color = "#FFEFC8",
  fill = "rgba(26,4,2,0.74)",
  appear = 1,
  align = "start",
  stroke,
}) => {
  assertAllowed(text, "package-A tag");
  const a = smooth(cl01(appear));
  if (a <= 0) return null;
  const w = text.length * size * 0.6 + size * 1.4;
  const h = size * 1.7;
  const x0 = align === "start" ? x : align === "end" ? x - w : x - w / 2;
  return (
    <g opacity={a} transform={`translate(0 ${((1 - a) * 16).toFixed(1)})`}>
      <rect x={x0 + 4} y={y - h / 2 + 6} width={w} height={h} rx={h * 0.3} fill="#1A0402" opacity={0.3} />
      <rect x={x0} y={y - h / 2} width={w} height={h} rx={h * 0.3} fill={fill} stroke={stroke} strokeWidth={stroke ? 3 : 0} />
      <text x={x0 + size * 0.7} y={y + size * 0.36} style={{ fontFamily: IF2.label, fontSize: size, letterSpacing: size * 0.1, fill: color }}>
        {text}
      </text>
    </g>
  );
};

/** The kit Kicker on a dark plate (scene openers; counts as a pill). */
export const KickerA: React.FC<{ x: number; y: number; text: string; appear?: number; size?: number }> = ({ x, y, text, appear = 1, size = 30 }) => {
  assertAllowed(text, "package-A kicker");
  const a = smooth(cl01(appear));
  if (a <= 0) return null;
  const w = text.length * size * 0.72 + size * 3.2;
  return (
    <g opacity={a}>
      <rect x={x - 20} y={y - size * 1.1} width={w} height={size * 1.8} rx={size * 0.5} fill="rgba(26,4,2,0.7)" />
      <Kicker x={x} y={y} text={text} color={C.heard} size={size} />
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// props
// ---------------------------------------------------------------------------------------------------------------
/** The survey pad Tick stands on in space: a gold slab, two thruster glows, a rail. y = the deck top. */
export const Pad: React.FC<{ x: number; y: number; w: number; f: number }> = ({ x, y, w, f }) => (
  <g>
    <ellipse cx={x + w * 0.2} cy={y + 46} rx={22} ry={30 + 8 * Math.sin(f * 0.5)} fill={C.flare} opacity={0.45} />
    <ellipse cx={x + w * 0.8} cy={y + 46} rx={22} ry={30 + 8 * Math.sin(f * 0.5 + 1)} fill={C.flare} opacity={0.45} />
    <rect x={x + 4} y={y + 8} width={w} height={26} rx={12} fill="#1A0402" opacity={0.35} />
    <rect x={x} y={y} width={w} height={26} rx={12} fill={C.goldRim} />
    <rect x={x + 8} y={y + 3} width={w - 16} height={6} rx={3} fill={C.goldHot} opacity={0.8} />
    <rect x={x + w * 0.15} y={y + 26} width={w * 0.7} height={14} rx={6} fill="#8E1A18" />
  </g>
);

export const Clipboard: React.FC<{ x: number; y: number; size: number; rotate?: number; flap?: number }> = ({ x, y, size, rotate = 0, flap = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
    <rect x={-size * 0.4} y={-size * 0.5} width={size * 0.8} height={size} rx={size * 0.06} fill="#B8431A" />
    <rect x={-size * 0.33} y={-size * 0.4} width={size * 0.66} height={size * 0.84} fill={C.heard} />
    <g transform={`translate(0 ${-size * 0.4}) scale(1 ${Math.cos((flap * Math.PI) / 180).toFixed(3)})`}>
      <rect x={-size * 0.33} y={0} width={size * 0.66} height={size * 0.5} fill={C.apricot} />
    </g>
    {[0.1, 0.22, 0.34].map((k) => (
      <rect key={k} x={-size * 0.25} y={size * k} width={size * 0.5} height={size * 0.04} fill={C.ink} opacity={0.5} />
    ))}
    <rect x={-size * 0.14} y={-size * 0.56} width={size * 0.28} height={size * 0.12} rx={size * 0.03} fill={C.goldRim} />
  </g>
);

/** A vertical bracket from y0 to y0 + (y1 - y0) × draw, end caps, a bright pen dot while drawing. */
export const VBracket: React.FC<{ x: number; y0: number; y1: number; draw?: number; color?: string; cap?: number; width?: number }> = ({ x, y0, y1, draw = 1, color = C.heard, cap = 22, width = 6 }) => {
  const d = cl01(draw);
  if (d <= 0) return null;
  const ye = y0 + (y1 - y0) * d;
  return (
    <g strokeLinecap="round">
      <line x1={x - cap} y1={y0} x2={x + cap} y2={y0} stroke={color} strokeWidth={width} />
      <line x1={x} y1={y0} x2={x} y2={ye} stroke={color} strokeWidth={width} />
      {d >= 1 ? <line x1={x - cap} y1={y1} x2={x + cap} y2={y1} stroke={color} strokeWidth={width} /> : <circle cx={x} cy={ye} r={width * 1.8} fill={C.goldHot} />}
    </g>
  );
};

/** A dotted "floor" line that keeps receding downward at `speed` px/f and fading: no floor is ever found (C-05, 1-08). */
export const FloorSearch: React.FC<{ f: number; y: number; speed: number; x0?: number; x1?: number; span?: number; color?: string }> = ({ f, y, speed, x0 = 160, x1 = 1760, span = 420, color = "#FFF0A0" }) => (
  <g>
    {[0, 1, 2].map((k) => {
      const u = wrap(f * speed + (k * span) / 3, span) / span;
      const yy = y + u * span;
      return <line key={k} x1={x0 + u * 120} y1={yy} x2={x1 - u * 120} y2={yy} stroke={color} strokeWidth={7} strokeDasharray="4 22" strokeLinecap="round" opacity={0.85 * (1 - u)} />;
    })}
  </g>
);

/** A timer disc that fills (pie) toward `k` with a hand sweeping at `deg` deg/f; no numerals on it. */
export const TimerDisc: React.FC<{ x: number; y: number; r: number; k: number; f: number; deg?: number; color?: string }> = ({ x, y, r, k, f, deg = 12, color = C.heard }) => {
  const a = -90 + 360 * cl01(k) * 0.999;
  const rad = (d: number) => (d * Math.PI) / 180;
  const pie = `M${x} ${y} L${x} ${y - r * 0.86} A${r * 0.86} ${r * 0.86} 0 ${a + 90 > 180 ? 1 : 0} 1 ${x + Math.cos(rad(a)) * r * 0.86} ${y + Math.sin(rad(a)) * r * 0.86} Z`;
  const h = -90 + f * deg;
  return (
    <g>
      <circle cx={x + 6} cy={y + 10} r={r} fill="#1A0402" opacity={0.3} />
      <circle cx={x} cy={y} r={r} fill={C.goldRim} />
      <circle cx={x} cy={y} r={r * 0.9} fill={C.ink} />
      {k > 0.002 ? <path d={pie} fill={color} opacity={0.85} /> : null}
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1={x + Math.cos(rad(i * 30)) * r * 0.78} y1={y + Math.sin(rad(i * 30)) * r * 0.78} x2={x + Math.cos(rad(i * 30)) * r * 0.9} y2={y + Math.sin(rad(i * 30)) * r * 0.9} stroke={C.apricot} strokeWidth={5} />
      ))}
      <line x1={x} y1={y} x2={x + Math.cos(rad(h)) * r * 0.8} y2={y + Math.sin(rad(h)) * r * 0.8} stroke={C.goldHot} strokeWidth={r * 0.06} strokeLinecap="round" />
      <circle cx={x} cy={y} r={r * 0.08} fill={C.goldHot} />
    </g>
  );
};

/** The g-meter (1-04): a half-dial with a red zone, needle at `k` (0..1 of the sweep); no numerals (the metric carries it). */
export const GMeter: React.FC<{ x: number; y: number; r: number; k: number; f: number }> = ({ x, y, r, k, f }) => {
  const rad = (d: number) => (d * Math.PI) / 180;
  const arc = (a: number, b: number, rr: number) => `M${x + Math.cos(rad(a)) * rr} ${y + Math.sin(rad(a)) * rr} A${rr} ${rr} 0 0 1 ${x + Math.cos(rad(b)) * rr} ${y + Math.sin(rad(b)) * rr}`;
  const na = 180 + 180 * cl01(k);
  const pulse = 0.6 + 0.4 * Math.sin(f * 0.6);
  return (
    <g>
      <path d={`M${x - r * 1.08} ${y} A${r * 1.08} ${r * 1.08} 0 0 1 ${x + r * 1.08} ${y} Z`} fill={C.goldRim} />
      <path d={`M${x - r} ${y} A${r} ${r} 0 0 1 ${x + r} ${y} Z`} fill={C.ink} />
      <path d={arc(180, 300, r * 0.8)} fill="none" stroke="#0B4A2E" strokeWidth={r * 0.12} />
      <path d={arc(300, 360, r * 0.8)} fill="none" stroke={C.glow} strokeWidth={r * 0.12} opacity={pulse} />
      <path d={arc(180, na, r * 0.8)} fill="none" stroke={C.heard} strokeWidth={r * 0.05} />
      {Array.from({ length: 11 }, (_, i) => {
        const a = 180 + i * 18;
        return <line key={i} x1={x + Math.cos(rad(a)) * r * 0.62} y1={y + Math.sin(rad(a)) * r * 0.62} x2={x + Math.cos(rad(a)) * r * 0.7} y2={y + Math.sin(rad(a)) * r * 0.7} stroke={C.apricot} strokeWidth={5} />;
      })}
      <text x={x} y={y - r * 0.28} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: r * 0.16, letterSpacing: r * 0.03, fill: C.apricot }}>
        G
      </text>
      <line x1={x} y1={y} x2={x + Math.cos(rad(na)) * r * 0.86} y2={y + Math.sin(rad(na)) * r * 0.86} stroke={C.gold} strokeWidth={r * 0.05} strokeLinecap="round" />
      <circle cx={x} cy={y} r={r * 0.09} fill={C.goldHot} />
    </g>
  );
};

/** A seesaw beam on a pivot: two loads (render props) ride its ends; `tilt` deg (+ = right end down). */
export const Seesaw: React.FC<{ x: number; y: number; w: number; tilt: number; left: React.ReactNode; right: React.ReactNode; color?: string }> = ({ x, y, w, tilt, left, right, color = C.goldRim }) => (
  <g>
    <path d={`M${x - 70} ${y + 150} L${x} ${y + 8} L${x + 70} ${y + 150} Z`} fill="#8E1A18" stroke={C.goldRim} strokeWidth={5} />
    <g transform={`rotate(${tilt} ${x} ${y})`}>
      <rect x={x - w / 2} y={y - 12} width={w} height={24} rx={12} fill={color} />
      <rect x={x - w / 2 + 10} y={y - 8} width={w - 20} height={6} rx={3} fill={C.goldHot} opacity={0.8} />
      <g transform={`translate(${x - w / 2 + 90} ${y - 12}) rotate(${-tilt})`}>{left}</g>
      <g transform={`translate(${x + w / 2 - 90} ${y - 12}) rotate(${-tilt})`}>{right}</g>
    </g>
    <circle cx={x} cy={y} r={16} fill={C.goldHot} />
  </g>
);

/** A small card with a title band (EXPECTED / FOUND / options). Drawn with its top-left at (x, y). */
export const Card: React.FC<{ x: number; y: number; w: number; h: number; title: string; band?: string; fill?: string; rot?: number; size?: number; children?: React.ReactNode }> = ({
  x,
  y,
  w,
  h,
  title,
  band = C.lever,
  fill = C.heard,
  rot = 0,
  size = 34,
  children,
}) => {
  assertAllowed(title, "package-A card");
  return (
    <g transform={`rotate(${rot} ${x + w / 2} ${y + h / 2})`}>
      <rect x={x + 6} y={y + 10} width={w} height={h} rx={18} fill="#002A1A" opacity={0.35} />
      <rect x={x} y={y} width={w} height={h} rx={18} fill={fill} />
      <rect x={x} y={y} width={w} height={size * 1.9} rx={18} fill={band} />
      <rect x={x} y={y + size * 1.4} width={w} height={size * 0.5} fill={band} />
      <text x={x + w / 2} y={y + size * 1.3} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: size, letterSpacing: size * 0.12, fill: INK }}>
        {title}
      </text>
      {children}
    </g>
  );
};

/** A fat chevron arrow from (x, y0) to (x, y1) whose chevrons crawl along it at `crawl` px/f (pushing / rising). */
export const ChevronArrow: React.FC<{ x: number; y0: number; y1: number; w: number; f: number; crawl?: number; color?: string; glow?: string }> = ({ x, y0, y1, w, f, crawl = 24, color = C.heard, glow }) => {
  const dir = y1 > y0 ? 1 : -1;
  const L = Math.abs(y1 - y0);
  const gap = w * 0.9;
  const n = Math.ceil(L / gap) + 1;
  return (
    <g>
      {glow ? <rect x={x - w * 0.9} y={Math.min(y0, y1)} width={w * 1.8} height={L} rx={w * 0.9} fill={glow} opacity={0.28} /> : null}
      <ClipBox x={x - w} y={Math.min(y0, y1) - 4} w={w * 2} h={L + 8}>
        {Array.from({ length: n }, (_, i) => {
          const c = y0 + dir * (wrap(f * crawl + i * gap, n * gap) - gap);
          return <path key={i} d={`M${x - w * 0.7} ${c - dir * w * 0.35} L${x} ${c + dir * w * 0.25} L${x + w * 0.7} ${c - dir * w * 0.35}`} fill="none" stroke={color} strokeWidth={w * 0.26} strokeLinecap="round" strokeLinejoin="round" />;
        })}
      </ClipBox>
      <path d={`M${x - w * 0.8} ${y1 - dir * w * 0.6} L${x} ${y1 + dir * w * 0.3} L${x + w * 0.8} ${y1 - dir * w * 0.6} Z`} fill={color} />
    </g>
  );
};

/** Heat shimmer: wavy amber strokes rising at `speed` px/f inside a box. */
export const HeatWaves: React.FC<{ f: number; x: number; y: number; w: number; h: number; n?: number; speed?: number; color?: string }> = ({ f, x, y, w, h, n = 5, speed = 22, color = "#FFE066" }) => (
  <ClipBox x={x} y={y} w={w} h={h}>
    {Array.from({ length: n * 2 }, (_, i) => {
      const cx = x + ((i % n) + 0.5) * (w / n);
      const cy = y + h - wrap(f * speed + rnd(i * 7) * h + (i >= n ? h / 2 : 0), h + 120) + 60;
      const a = 14;
      return <path key={i} d={`M${cx} ${cy} q${a} -20 0 -40 q${-a} -20 0 -40 q${a} -20 0 -40`} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" opacity={0.55} />;
    })}
  </ClipBox>
);

/** Data dots streaming from (x0, y0) to (x1, y1) at `speed` px/f. */
export const DataDots: React.FC<{ f: number; x0: number; y0: number; x1: number; y1: number; speed?: number; n?: number; color?: string; r?: number }> = ({ f, x0, y0, x1, y1, speed = 28, n = 9, color = C.heard, r = 9 }) => {
  const L = Math.hypot(x1 - x0, y1 - y0);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const u = wrap(f * speed + (i * L) / n, L) / L;
        return (
          <g key={i}>
            <circle cx={lerp(x0, x1, u)} cy={lerp(y0, y1, u)} r={r * 2.2} fill={color} opacity={0.25} />
            <circle cx={lerp(x0, x1, u)} cy={lerp(y0, y1, u)} r={r} fill={color} />
          </g>
        );
      })}
    </g>
  );
};

/** Expanding rings at (x, y): `n` rings in flight, growing at `speed` px/f, fading out at `max` radius. */
export const Rings: React.FC<{ f: number; x: number; y: number; speed?: number; max?: number; n?: number; color?: string; width?: number; squash?: number }> = ({ f, x, y, speed = 20, max = 260, n = 3, color = C.heard, width = 8, squash = 1 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const r = wrap(f * speed + (i * max) / n, max);
      return <ellipse key={i} cx={x} cy={y} rx={r} ry={r * squash} fill="none" stroke={color} strokeWidth={width * (1 - r / max)} opacity={1 - r / max} />;
    })}
  </g>
);

/** The entry cross on a map or disc. */
export const Cross: React.FC<{ x: number; y: number; s: number; color?: string }> = ({ x, y, s, color = C.heard }) => (
  <g strokeLinecap="round">
    <line x1={x - s} y1={y - s} x2={x + s} y2={y + s} stroke="#1A0402" strokeWidth={s * 0.5} opacity={0.4} />
    <line x1={x - s} y1={y + s} x2={x + s} y2={y - s} stroke="#1A0402" strokeWidth={s * 0.5} opacity={0.4} />
    <line x1={x - s} y1={y - s} x2={x + s} y2={y + s} stroke={color} strokeWidth={s * 0.32} />
    <line x1={x - s} y1={y + s} x2={x + s} y2={y - s} stroke={color} strokeWidth={s * 0.32} />
  </g>
);

/** A lemon ribbon (the radio tape) along a polyline whose waves travel at `speed` px/f. */
export const Ribbon: React.FC<{ f: number; pts: [number, number][]; speed?: number; amp?: number; width?: number; color?: string }> = ({ f, pts, speed = 30, amp = 14, width = 14, color = C.heard }) => {
  const out: string[] = [];
  let s = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i];
    const [bx, by] = pts[i + 1];
    const L = Math.hypot(bx - ax, by - ay);
    const nx = -(by - ay) / Math.max(1, L);
    const ny = (bx - ax) / Math.max(1, L);
    for (let t = 0; t <= L; t += 12) {
      const w = Math.sin((s + t - f * speed) / 34) * amp;
      out.push(`${(ax + ((bx - ax) * t) / L + nx * w).toFixed(1)},${(ay + ((by - ay) * t) / L + ny * w).toFixed(1)}`);
    }
    s += L;
  }
  if (out.length < 2) return null;
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <polyline points={out.join(" ")} stroke="#1A0402" strokeWidth={width + 6} opacity={0.3} transform="translate(4 6)" />
      <polyline points={out.join(" ")} stroke={color} strokeWidth={width} />
      <polyline points={out.join(" ")} stroke={C.lemonDeep} strokeWidth={width * 0.22} strokeDasharray="10 14" strokeDashoffset={-f * speed} />
    </g>
  );
};

/** The Great Red Spot oval with turning spiral arms (F12: the only named feature). */
export const SpotOval: React.FC<{ f: number; x: number; y: number; r: number; spin?: number }> = ({ f, x, y, r, spin = 6 }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse rx={r * 1.5} ry={r} fill={C.spot} />
    <g transform={`scale(1.5 1) rotate(${(f * spin) % 360})`}>
      {[0, 120, 240].map((a) => (
        <path key={a} d={`M0 0 Q${r * 0.6} ${-r * 0.2} ${r * 0.85} ${r * 0.35}`} fill="none" stroke={C.spotArm} strokeWidth={r * 0.16} strokeLinecap="round" transform={`rotate(${a})`} />
      ))}
    </g>
    <ellipse rx={r * 1.5} ry={r} fill="none" stroke="#FFC27A" strokeWidth={4} opacity={0.75} />
  </g>
);

export { Counter };
