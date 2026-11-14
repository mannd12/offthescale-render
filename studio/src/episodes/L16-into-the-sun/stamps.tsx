// L16 state stamps, honesty pills, the evidence Sheet and Board (BUILD.md §5, storyboard §1 "Stamp states", F2, F4, F9).
// Each stamp state has a WORD and a SHAPE so colour is never the only cue:
//   measured  green #2FBF71 hexagon "MEASURED"        (only on the flight path and the probe's own readings, F2)
//   afar      blue  #3FA9E8 circle  "SEEN FROM AFAR"
//   model     lavender-slate #8C86C0 square "MODEL"   (reads as the "grey" of line 66; never neutral grey, F9)
// USAGE (f = the shot's frame)
//   <StateStamp x y state="measured|afar|model" age?={frames since slam; omit = resting} size?=150 rotate?=-8
//               flip?={ from: state, age } ghost? f? />   slam ≈ 40 px/f from 2.2×; flip turns 13°/f about the
//               vertical axis, swapping the face at 90°; ghost = the dashed waiting outline (pulses 0.9-1.1)
//   <OurSumPill x y size? align? appear? />   saffron outline (class C, F4)
//   <AboutPill x y … />                       teal outline (a rounded NASA figure, first time in a scene)
//   <SayPill x y kind="NASA SAYS|EXPECTED|NASA SAYS CAN REACH" … />   paper pill (F2: a NASA design/expected value)
//   <SourceChip x y text="NASA|NASA 10 THINGS|NASA SEP 2025" … />     a small paper source chip (8-14, 8-16)
//   <PillFor kind={readout(key).pill} x y … />                        the right pill for a sundata entry
//   <Sheet x y w h f title appear?={0..1 slides up 60 px} stamp?={{ state, age, flip? }} tilt? >body (sheet coords)</Sheet>
//   <Board x y w h f path?={{ pts, solidTo 0..1, draw 0..1 }} pins? >children (board coords)</Board>
import React, { useId } from "react";
import { IF2, alpha, labelCase, mixHex, rnd, smoothPath, type Pt } from "../../lib/illustrated";
import { L16_COLORS } from "./families";
import { partialPts } from "../L15-space-jump/props";
import { assertAllowed, type PillKind } from "./sundata";

const C = L16_COLORS;
const sid = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, "");
const cl01 = (v: number) => Math.max(0, Math.min(1, v));
const sm = (t: number) => {
  const u = cl01(t);
  return u * u * (3 - 2 * u);
};

export type StampState = "measured" | "afar" | "model";
export const STAMP = {
  measured: { color: C.stampGreen, words: ["MEASURED"], shape: "hex" },
  afar: { color: C.stampBlue, words: ["SEEN FROM", "AFAR"], shape: "circle" },
  model: { color: C.stampGrey, words: ["MODEL"], shape: "square" },
} as const;

const shapeD = (shape: "hex" | "circle" | "square", s: number) => {
  if (shape === "circle") return `M${-s} 0 a${s} ${s} 0 1 0 ${2 * s} 0 a${s} ${s} 0 1 0 ${-2 * s} 0 Z`;
  if (shape === "square") {
    const q = s * 0.88;
    const rr = s * 0.12;
    return `M${-q + rr} ${-q} H${q - rr} Q${q} ${-q} ${q} ${-q + rr} V${q - rr} Q${q} ${q} ${q - rr} ${q} H${-q + rr} Q${-q} ${q} ${-q} ${q - rr} V${-q + rr} Q${-q} ${-q} ${-q + rr} ${-q} Z`;
  }
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
    return `${(Math.cos(a) * s).toFixed(1)} ${(Math.sin(a) * s).toFixed(1)}`;
  });
  return "M" + pts.join(" L") + " Z";
};

/** One stamp face (no transform): ink shape, inner ring, words, paper speckle gaps for the ink texture. */
const Face: React.FC<{ state: StampState; size: number; paper: string; ghost?: boolean }> = ({ state, size, paper, ghost = false }) => {
  const st = STAMP[state];
  const s = size / 2;
  const words = st.words;
  const fs = words.length > 1 ? size * 0.15 : size * (state === "measured" ? 0.16 : 0.2);
  if (ghost) return <path d={shapeD(st.shape, s)} fill="none" stroke={st.color} strokeWidth={5} strokeDasharray="14 10" />;
  return (
    <g>
      <path d={shapeD(st.shape, s)} fill={st.color} />
      <path d={shapeD(st.shape, s * 0.84)} fill="none" stroke={paper} strokeWidth={Math.max(3, size * 0.025)} />
      {words.map((w, i) => (
        <text key={w} x={0} y={(i - (words.length - 1) / 2) * fs * 1.15 + fs * 0.36} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: fs, letterSpacing: fs * 0.06, fill: paper }}>
          {w}
        </text>
      ))}
      {/* ink texture: small paper gaps */}
      {Array.from({ length: 14 }, (_, i) => {
        const a = rnd(i * 7 + (state === "model" ? 3 : state === "afar" ? 5 : 1)) * Math.PI * 2;
        const r = s * (0.55 + 0.4 * rnd(i * 11 + 2));
        return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r={1.5 + rnd(i * 13) * 2.5} fill={paper} opacity={0.55} />;
      })}
    </g>
  );
};

export const StateStamp: React.FC<{
  x: number;
  y: number;
  state: StampState;
  /** frames since the slam (omit = resting, no slam) */
  age?: number;
  size?: number;
  rotate?: number;
  flip?: { from: StampState; age: number };
  ghost?: boolean;
  f?: number;
  /** ink-gap colour (the paper behind) */
  paper?: string;
}> = ({ x, y, state, age, size = 150, rotate = -8, flip, ghost = false, f = 0, paper = C.paper }) => {
  if (age != null && age < 0) return null;
  if (ghost) {
    const k = 1 + 0.1 * Math.sin(f / 4);
    return (
      <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${k.toFixed(3)})`} opacity={0.8}>
        <Face state={state} size={size} paper={paper} ghost />
      </g>
    );
  }
  const SL = 6;
  const a = age ?? 99;
  const k = a < SL ? 2.2 - 1.2 * (a / SL) ** 2 : 1 + Math.max(0, 0.06 * Math.sin((a - SL) * 1.4) * Math.exp(-(a - SL) / 5));
  const o = a < SL ? 0.35 + 0.65 * (a / SL) : 1;
  // flip about the vertical axis at 13°/f
  let face: StampState = state;
  let sx = 1;
  if (flip && flip.age >= 0) {
    const th = Math.min(180, flip.age * 13);
    face = th < 90 ? flip.from : state;
    sx = Math.max(0.04, Math.abs(Math.cos((th * Math.PI) / 180)));
  } else if (flip && flip.age < 0) face = flip.from;
  const ring = a >= SL && a < SL + 14 ? (a - SL) * 12 : -1;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      {ring >= 0 ? <circle cx={0} cy={0} r={size / 2 + ring} fill="none" stroke={STAMP[state].color} strokeWidth={5} opacity={1 - (a - SL) / 14} /> : null}
      <g transform={`scale(${(k * sx).toFixed(3)} ${k.toFixed(3)})`} opacity={o}>
        <Face state={face} size={size} paper={paper} />
      </g>
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// pills
// ---------------------------------------------------------------------------------------------------------------
type PillP = { x: number; y: number; size?: number; align?: "start" | "middle" | "end"; appear?: number };
const OutlinePill: React.FC<PillP & { text: string; stroke: string; fill: string; ink: string; dot?: string }> = ({ x, y, text, stroke, fill, ink, dot, size = 22, align = "start", appear = 1 }) => {
  const t = labelCase(text);
  assertAllowed(t, "pill");
  const w = t.length * size * 0.62 + size * (dot ? 2.3 : 1.4);
  const h = size * 1.7;
  const x0 = align === "start" ? x : align === "end" ? x - w : x - w / 2;
  const a = sm(appear);
  return (
    <g opacity={a} transform={`translate(0 ${((1 - a) * 16).toFixed(1)})`}>
      <rect x={x0} y={y - h / 2} width={w} height={h} rx={h / 2} fill={fill} stroke={stroke} strokeWidth={3} />
      {dot ? <circle cx={x0 + size * 0.95} cy={y} r={size * 0.26} fill={dot} /> : null}
      <text x={x0 + (dot ? size * 1.6 : size * 0.7)} y={y + size * 0.36} style={{ fontFamily: IF2.label, fontSize: size, letterSpacing: size * 0.12, fill: ink }}>
        {t}
      </text>
    </g>
  );
};

export const OurSumPill: React.FC<PillP> = (p) => <OutlinePill {...p} text="our sum" stroke={C.saffron} fill={alpha("#1A0E30", 0.78)} ink={C.saffronCore} dot={C.saffron} />;
export const AboutPill: React.FC<PillP> = (p) => <OutlinePill {...p} text="about" stroke={C.teal} fill={alpha("#06202A", 0.78)} ink="#BFF5EA" />;
export type SayKind = "NASA SAYS" | "EXPECTED" | "NASA SAYS CAN REACH";
export const SayPill: React.FC<PillP & { kind?: SayKind }> = ({ kind = "NASA SAYS", ...p }) => <OutlinePill {...p} text={kind} stroke={mixHex(C.paper, C.saffron, 0.5)} fill={C.paper} ink={C.ink} />;
export const SourceChip: React.FC<PillP & { text: string }> = ({ text, size = 16, ...p }) => <OutlinePill {...p} size={size} text={text} stroke={alpha(C.ink, 0.35)} fill={C.paper} ink={C.ink} />;

/** The pill a sundata entry must carry (readout(key).pill / .pill2); "nasa" draws the NASA source chip. */
export const PillFor: React.FC<PillP & { kind?: PillKind }> = ({ kind, ...p }) => {
  if (!kind) return null;
  if (kind === "our-sum") return <OurSumPill {...p} />;
  if (kind === "about") return <AboutPill {...p} />;
  if (kind === "nasa") return <SourceChip {...p} text="NASA" size={p.size ?? 20} />;
  if (kind === "expected") return <SayPill {...p} kind="EXPECTED" />;
  if (kind === "nasa-says-can-reach") return <SayPill {...p} kind="NASA SAYS CAN REACH" />;
  return <SayPill {...p} kind="NASA SAYS" />;
};

// ---------------------------------------------------------------------------------------------------------------
// Sheet: an evidence sheet pinned on the board
// ---------------------------------------------------------------------------------------------------------------
export const Sheet: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  f: number;
  title: string;
  appear?: number;
  stamp?: { state: StampState; age?: number; flip?: { from: StampState; age: number }; ghost?: boolean };
  tilt?: number;
  /** header band colour (default teal; violet and gold insets keep the plates saturated) */
  band?: string;
  children?: React.ReactNode;
}> = ({ x, y, w, h, f, title, appear = 1, stamp, tilt = 0, band = C.tealDeep, children }) => {
  const id = "sh" + sid(useId());
  const a = sm(appear);
  const t = labelCase(title);
  assertAllowed(t, "Sheet title");
  const sway = Math.sin(f / 37 + x * 0.01) * 0.6;
  return (
    <g opacity={a} transform={`translate(${x} ${y + (1 - a) * 60}) rotate(${(tilt + sway).toFixed(2)} ${w / 2} 0)`}>
      <rect x={8} y={12} width={w} height={h} rx={14} fill="#000" opacity={0.2} />
      <rect x={0} y={0} width={w} height={h} rx={14} fill={C.paper} />
      <defs>
        <clipPath id={id}>
          <rect x={0} y={0} width={w} height={h} rx={14} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <rect x={0} y={0} width={w} height={64} fill={band} />
        <rect x={0} y={64} width={w} height={6} fill={C.gold} />
        <rect x={w - 46} y={h - 46} width={46} height={46} fill={alpha(C.violet, 0.25)} />
      </g>
      <text x={24} y={43} style={{ fontFamily: IF2.label, fontSize: 26, letterSpacing: 3, fill: "#FFF8EC" }}>
        {t}
      </text>
      {/* two pins */}
      {[w * 0.15, w * 0.85].map((px, i) => (
        <g key={i}>
          <circle cx={px} cy={-4} r={11} fill={i ? C.magenta : C.saffron} />
          <circle cx={px - 3} cy={-7} r={3.5} fill="#FFFFFF" opacity={0.7} />
        </g>
      ))}
      <g transform="translate(0 70)">{children}</g>
      {/* stamp sized to the sheet so it never covers the title band (kit-demo review) */}
      {stamp ? (() => {
        const ss = Math.min(150, w * 0.42, (h - 80) * 0.75);
        return <StateStamp x={w - ss * 0.62} y={h - ss * 0.62} state={stamp.state} age={stamp.age} flip={stamp.flip} ghost={stamp.ghost} f={f} size={ss} />;
      })() : null}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Board: the cyclorama evidence board (four pins, the probe-path line solid then dashed)
// ---------------------------------------------------------------------------------------------------------------
export const Board: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  f: number;
  /** the probe path across the board, board coords: solid up to solidTo (0..1 by length), dashed after; draw 0..1 */
  path?: { pts: Pt[]; solidTo: number; draw?: number };
  pins?: boolean;
  children?: React.ReactNode;
}> = ({ x, y, w, h, f, path, pins = true, children }) => {
  const id = "bd" + sid(useId());
  const draw = path ? cl01(path.draw ?? 1) : 0;
  const solid = path ? partialPts(path.pts, Math.min(draw, path.solidTo)) : [];
  const all = path ? partialPts(path.pts, draw) : [];
  const shine = ((f * 6) % (w + 400)) - 200;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={10} y={16} width={w} height={h} rx={20} fill="#000" opacity={0.22} />
      <rect x={-14} y={-14} width={w + 28} height={h + 28} rx={26} fill={C.saffronDeep} />
      <rect x={-8} y={-8} width={w + 16} height={h + 16} rx={22} fill={C.gold} />
      <rect x={0} y={0} width={w} height={h} rx={18} fill="#1E5A6E" />
      <defs>
        <clipPath id={id}>
          <rect x={0} y={0} width={w} height={h} rx={18} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        {/* felt texture: soft diagonal weave + a slow light band */}
        {Array.from({ length: Math.ceil((w + h) / 60) }, (_, i) => (
          <line key={i} x1={i * 60 - h} y1={h} x2={i * 60} y2={0} stroke="#2A7088" strokeWidth={14} opacity={0.35} />
        ))}
        <rect x={shine} y={0} width={180} height={h} fill="#FFFFFF" opacity={0.06} transform="skewX(-18)" />
      </g>
      {path && all.length > 1 ? (
        <g>
          <path d={smoothPath(all, 0.5)} fill="none" stroke={C.bone} strokeWidth={6} strokeDasharray="14 12" strokeDashoffset={-f * 3} opacity={0.8} strokeLinecap="round" />
          {solid.length > 1 ? <path d={smoothPath(solid, 0.5)} fill="none" stroke={C.stampGreen} strokeWidth={9} strokeLinecap="round" /> : null}
          {draw > 0 && draw < 1 ? <circle cx={all[all.length - 1][0]} cy={all[all.length - 1][1]} r={11} fill={C.saffronCore} stroke={C.saffron} strokeWidth={3} /> : null}
        </g>
      ) : null}
      {children}
      {pins
        ? [
            [26, 26],
            [w - 26, 26],
            [26, h - 26],
            [w - 26, h - 26],
          ].map(([px, py], i) => (
            <g key={i}>
              <circle cx={px} cy={py} r={13} fill={[C.saffron, C.magenta, C.teal, C.violet][i]} />
              <circle cx={px - 4} cy={py - 4} r={4} fill="#FFFFFF" opacity={0.7} />
            </g>
          ))
        : null}
    </g>
  );
};
