// L18 placards, pills, sheets and the evidence board (BUILD.md §5 `tags18.tsx`; storyboard §1 "Placards and tags", F2, F4,
// F12, F14). The device is a HANGING PLACARD on a cord with two grommets (not L17's hexagon / square stamps):
//   MEASURED      saffron-yellow #FFD65A, ink lettering
//   MODEL         sky-blue #3AA8E0, warm-white lettering (never cyan on violet)
//   NOT POSSIBLE  ink #0B2A33 with a vermilion rim and a vermilion X
// USAGE (f = the shot's frame)
//   <FlipTag x y={the cord's hook} word="MEASURED"|"MODEL"|"NOT POSSIBLE" prev?={the face shown while flip < 0.5} f
//            swing?={deg amplitude, 18: ≈ 6 deg/f peak with the 0.33 rad/f pendulum} flip?={0..1, 0 = prev face, 1 = word}
//            rattle?={0..1 a fast shake after a slam} drop?={0..1 slides down its cord on entry} size?=1 cord?=90 />
//   flipFor(f, start, frames?=15) → 0..1 for a flip at 12 deg/f
//   <OurSumPill x y size? align? appear? />            OUR SUM: saffron outline + dot (class C, F4)
//   <ReasoningPill x y … />                            OUR REASONING: the same outline, DASHED (row 14)
//   <AboutPill x y … />                                ABOUT: teal outline (a rounded figure)
//   <AgencyPill x y agency="NASA SAYS"|"NOAA SAYS"|"TEXTBOOK SAYS" … />   warm paper pill, teal words (F12: no logos)
//   <WordPill x y text F? … />                         a plain family pill (NEAR, FAR, STIFF, FLUID, HOLDING, IGNORED …);
//                                                      numerals in it are checked (assertAllowed)
//   <PillFor kind={readout(key).pill} x y … />          the right pill for a data18 entry
//   <QuestionTag x y f size?=60 />                     a vermilion "?" tag that bobs (12 px) and tilts
//   <SourceChip x y name="NASA FACT SHEET"|"NOAA"|… appear? />   a small lemon chip with a corner fold
//   <Sheet18 x y w h f title band?="lemon"|"sky"|"teal" appear?={0..1 slides up 60 px} pin?={0..1 the pin slams in}
//            tilt? sway?={deg, the sheet swings on its pin} >body (sheet coords, below the 64-px title band)</Sheet18>
//   <Board18 x y w h f columns?={["MEASURED","MODEL"]} header?={0..1 placards drop in} >children (board coords)</Board18>
import React, { useId } from "react";
import { Family, IF2, alpha, labelCase, mixHex } from "../../lib/illustrated";
import { L18_COLORS, PILL_TEXT, pillFill } from "./families";
import { PillKind, assertAllowed } from "./data18";

const C = L18_COLORS;
const sid = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, "");
const cl = (v: number) => Math.max(0, Math.min(1, v));
const sm = (t: number) => {
  const u = cl(t);
  return u * u * (3 - 2 * u);
};

export type PlacardWord = "MEASURED" | "MODEL" | "NOT POSSIBLE";
const FACE: Record<PlacardWord, { fill: string; text: string; rim: string }> = {
  MEASURED: { fill: C.measured, text: C.ink, rim: C.lemonDeep },
  MODEL: { fill: C.model, text: C.modelText, rim: C.skyDeep },
  "NOT POSSIBLE": { fill: C.ink, text: "#FFE2A8", rim: C.vermilion },
};

/** 0..1 for a placard flip starting at `start` (180 deg in `frames`; 15 f = 12 deg/f). */
export const flipFor = (f: number, start: number, frames = 15) => sm((f - start) / frames);

const PlacardFace: React.FC<{ word: PlacardWord; w: number; h: number }> = ({ word, w, h }) => {
  const F = FACE[word];
  const fs = word === "NOT POSSIBLE" ? h * 0.34 : h * 0.42;
  return (
    <g>
      <rect x={-w / 2 + 6} y={10} width={w} height={h} rx={h * 0.22} fill="#000A10" opacity={0.35} />
      <rect x={-w / 2} y={0} width={w} height={h} rx={h * 0.22} fill={F.fill} stroke={F.rim} strokeWidth={word === "NOT POSSIBLE" ? 9 : 5} />
      <rect x={-w / 2 + 10} y={8} width={w - 20} height={h * 0.18} rx={h * 0.09} fill="#FFFFFF" opacity={0.18} />
      {[-1, 1].map((k) => (
        <g key={k}>
          <circle cx={k * w * 0.32} cy={h * 0.16} r={h * 0.075} fill={mixHex(F.fill, "#000000", 0.35)} />
          <circle cx={k * w * 0.32} cy={h * 0.16} r={h * 0.04} fill="#01121B" />
        </g>
      ))}
      <text x={0} y={h * 0.62 + fs * 0.36} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: fs, letterSpacing: fs * 0.06, fill: F.text }}>
        {word}
      </text>
      {word === "NOT POSSIBLE" ? <path d={`M${w / 2 - h * 0.5} ${h * 0.18} L${w / 2 - h * 0.18} ${h * 0.5} M${w / 2 - h * 0.18} ${h * 0.18} L${w / 2 - h * 0.5} ${h * 0.5}`} stroke={C.vermilion} strokeWidth={h * 0.07} strokeLinecap="round" /> : null}
    </g>
  );
};

export const FlipTag: React.FC<{ x: number; y: number; word: PlacardWord; prev?: PlacardWord; f: number; swing?: number; flip?: number; rattle?: number; drop?: number; size?: number; cord?: number }> = ({
  x,
  y,
  word,
  prev,
  f,
  swing = 18,
  flip = 1,
  rattle = 0,
  drop = 1,
  size = 1,
  cord = 90,
}) => {
  const h = 92 * size;
  const w = (word === "NOT POSSIBLE" || prev === "NOT POSSIBLE" ? 380 : 300) * size;
  const ang = swing * Math.sin(f * 0.33) + rattle * 6 * Math.sin(f * 2.1);
  const fl = cl(flip);
  const sx = Math.cos(fl * Math.PI);
  const shown = prev && fl < 0.5 ? prev : word;
  const d = (1 - sm(drop)) * -160;
  return (
    <g transform={`translate(${x} ${y + d}) rotate(${ang.toFixed(2)})`}>
      <circle cx={0} cy={0} r={7 * size} fill={C.amber} />
      <path d={`M0 0 L${-w * 0.32} ${cord * size} M0 0 L${w * 0.32} ${cord * size}`} stroke={C.amber} strokeWidth={4 * size} />
      <g transform={`translate(0 ${cord * size - h * 0.16}) scale(${Math.max(0.02, Math.abs(sx)).toFixed(3)} 1)`}>
        <PlacardFace word={shown} w={w} h={h} />
      </g>
    </g>
  );
};

const PillBase: React.FC<{ x: number; y: number; text: string; size?: number; align?: "start" | "middle" | "end"; appear?: number; fill: string; stroke?: string; dash?: string; color: string; dot?: string }> = ({
  x,
  y,
  text,
  size = 22,
  align = "start",
  appear = 1,
  fill,
  stroke,
  dash,
  color,
  dot,
}) => {
  const a = sm(appear);
  if (a <= 0) return null;
  const t = labelCase(text);
  const w = t.length * size * 0.62 + size * (dot ? 2.4 : 1.4);
  const h = size * 1.7;
  const x0 = align === "start" ? x : align === "end" ? x - w : x - w / 2;
  return (
    <g opacity={a} transform={`translate(0 ${((1 - a) * 18).toFixed(1)})`}>
      <rect x={x0 + 3} y={y - h / 2 + 5} width={w} height={h} rx={h / 2} fill="#000A10" opacity={0.3} />
      <rect x={x0} y={y - h / 2} width={w} height={h} rx={h / 2} fill={fill} stroke={stroke} strokeWidth={stroke ? 3 : 0} strokeDasharray={dash} />
      {dot ? <circle cx={x0 + size * 0.95} cy={y} r={size * 0.26} fill={dot} /> : null}
      <text x={x0 + (dot ? size * 1.6 : size * 0.7)} y={y + size * 0.36} style={{ fontFamily: IF2.label, fontSize: size, letterSpacing: size * 0.12, fill: color }}>
        {t}
      </text>
    </g>
  );
};

type PP = { x: number; y: number; size?: number; align?: "start" | "middle" | "end"; appear?: number };
export const OurSumPill: React.FC<PP> = (p) => <PillBase {...p} text="OUR SUM" fill="rgba(0,10,16,0.72)" stroke={C.saffron} color={PILL_TEXT} dot={C.saffron} />;
export const ReasoningPill: React.FC<PP> = (p) => <PillBase {...p} text="OUR REASONING" fill="rgba(0,10,16,0.72)" stroke={C.saffron} dash="8 6" color={PILL_TEXT} dot={C.saffron} />;
export const AboutPill: React.FC<PP> = (p) => <PillBase {...p} text="ABOUT" fill="rgba(0,10,16,0.72)" stroke={C.teal} color={PILL_TEXT} />;
export const AgencyPill: React.FC<PP & { agency: "NASA SAYS" | "NOAA SAYS" | "TEXTBOOK SAYS" }> = ({ agency, ...p }) => <PillBase {...p} text={agency} fill="#FFE7A8" stroke={C.tealDeep} color={C.tealDeep} dot={C.teal} />;
export const WordPill: React.FC<PP & { text: string; F?: Family; fill?: string; color?: string; dot?: string }> = ({ text, F, fill, color, dot, ...p }) => (
  <PillBase {...p} text={assertAllowed(text, "WordPill")} fill={fill ?? (F ? pillFill(F) : "rgba(0,10,16,0.72)")} color={color ?? PILL_TEXT} dot={dot} />
);
export const PillFor: React.FC<PP & { kind?: PillKind }> = ({ kind, ...p }) =>
  kind === "our-sum" ? (
    <OurSumPill {...p} />
  ) : kind === "reasoning" ? (
    <ReasoningPill {...p} />
  ) : kind === "about" ? (
    <AboutPill {...p} />
  ) : kind === "nasa-says" ? (
    <AgencyPill {...p} agency="NASA SAYS" />
  ) : kind === "noaa-says" ? (
    <AgencyPill {...p} agency="NOAA SAYS" />
  ) : kind === "textbook-says" ? (
    <AgencyPill {...p} agency="TEXTBOOK SAYS" />
  ) : null;

export const QuestionTag: React.FC<{ x: number; y: number; f: number; size?: number }> = ({ x, y, f, size = 60 }) => {
  const bob = Math.sin(f * 0.3) * 12;
  const tilt = Math.sin(f * 0.21) * 10;
  return (
    <g transform={`translate(${x} ${y + bob}) rotate(${tilt.toFixed(1)})`}>
      <rect x={-size * 0.45 + 4} y={-size * 0.55 + 6} width={size * 0.9} height={size * 1.1} rx={size * 0.24} fill="#000A10" opacity={0.3} />
      <rect x={-size * 0.45} y={-size * 0.55} width={size * 0.9} height={size * 1.1} rx={size * 0.24} fill={C.vermilion} />
      <text x={0} y={size * 0.32} textAnchor="middle" style={{ fontFamily: IF2.display, fontWeight: 800, fontSize: size * 0.9, fill: "#FFE7C2" }}>
        ?
      </text>
    </g>
  );
};

export const SourceChip: React.FC<{ x: number; y: number; name: string; appear?: number; size?: number }> = ({ x, y, name, appear = 1, size = 20 }) => {
  const a = sm(appear);
  if (a <= 0) return null;
  const w = name.length * size * 0.62 + size * 2;
  const h = size * 2;
  return (
    <g opacity={a} transform={`translate(${x} ${y + (1 - a) * 16})`}>
      <rect x={4} y={5} width={w} height={h} rx={6} fill="#000A10" opacity={0.3} />
      <path d={`M0 0 H${w - 14} L${w} 14 V${h} H0 Z`} fill={C.lemon} stroke={C.lemonDeep} strokeWidth={2} />
      <path d={`M${w - 14} 0 V14 H${w}`} fill={C.lemonDeep} />
      <text x={size} y={h * 0.5 + size * 0.36} style={{ fontFamily: IF2.label, fontSize: size, letterSpacing: size * 0.1, fill: C.ink }}>
        {assertAllowed(labelCase(name), "SourceChip")}
      </text>
    </g>
  );
};

const BAND: Record<"lemon" | "sky" | "teal", { paper: string; band: string; text: string }> = {
  lemon: { paper: C.lemon, band: C.lemonDeep, text: C.ink },
  sky: { paper: C.sky, band: C.skyDeep, text: C.ink },
  teal: { paper: "#4FCDB6", band: "#0F9A9A", text: C.ink },
};

export const Sheet18: React.FC<{ x: number; y: number; w: number; h: number; f: number; title: string; band?: "lemon" | "sky" | "teal"; appear?: number; pin?: number; tilt?: number; sway?: number; children?: React.ReactNode }> = ({
  x,
  y,
  w,
  h,
  f,
  title,
  band = "lemon",
  appear = 1,
  pin = 1,
  tilt = 0,
  sway = 0,
  children,
}) => {
  const id = "sh" + sid(useId());
  const a = sm(appear);
  if (a <= 0) return null;
  const B = BAND[band];
  const rot = tilt + sway * Math.sin(f * 0.18);
  const p = cl(pin);
  const pinScale = p < 1 ? 2.2 - 1.2 * sm(p) : 1;
  return (
    <g opacity={Math.min(1, a * 1.4)} transform={`translate(${x} ${y + (1 - a) * 60}) rotate(${rot.toFixed(2)} ${w / 2} 0)`}>
      <defs>
        <clipPath id={id}>
          <rect x={0} y={0} width={w} height={h} rx={8} />
        </clipPath>
      </defs>
      <rect x={7} y={11} width={w} height={h} rx={8} fill="#02282C" opacity={0.35} />
      <rect x={0} y={0} width={w} height={h} rx={8} fill={B.paper} />
      <g clipPath={`url(#${id})`}>
        <rect x={0} y={0} width={w} height={64} fill={B.band} />
        <text x={18} y={44} style={{ fontFamily: IF2.label, fontSize: 30, letterSpacing: 2, fill: B.text }}>
          {assertAllowed(labelCase(title), "Sheet18 title")}
        </text>
        <g transform="translate(0 64)">{children}</g>
      </g>
      {p > 0 ? (
        <g transform={`translate(${w / 2} 6) scale(${pinScale.toFixed(3)})`} opacity={sm(p * 3)}>
          <circle cx={2} cy={4} r={14} fill="#000A10" opacity={0.3} />
          <circle cx={0} cy={0} r={14} fill={C.pin} />
          <circle cx={-4} cy={-4} r={5} fill="#FFD9A0" />
        </g>
      ) : null}
    </g>
  );
};

export const Board18: React.FC<{ x: number; y: number; w: number; h: number; f: number; columns?: [PlacardWord, PlacardWord]; header?: number; children?: React.ReactNode }> = ({
  x,
  y,
  w,
  h,
  f,
  columns = ["MEASURED", "MODEL"],
  header = 1,
  children,
}) => {
  const fr = "#E0A93A";
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={10} y={16} width={w} height={h} rx={18} fill="#02282C" opacity={0.35} />
      <rect x={0} y={0} width={w} height={h} rx={18} fill={fr} />
      <rect x={14} y={14} width={w - 28} height={h - 28} rx={10} fill="#0B7C85" />
      <rect x={14} y={14} width={w - 28} height={h - 28} rx={10} fill="none" stroke="#26B8A8" strokeWidth={3} />
      {/* the column divider */}
      <line x1={w / 2} y1={130} x2={w / 2} y2={h - 40} stroke={alpha("#4FCDB6", 0.7)} strokeWidth={4} strokeDasharray="14 10" />
      {/* four corner pins */}
      {[
        [34, 34],
        [w - 34, 34],
        [34, h - 34],
        [w - 34, h - 34],
      ].map(([px, py], i) => (
        <g key={i}>
          <circle cx={px + 2} cy={py + 3} r={10} fill="#000A10" opacity={0.3} />
          <circle cx={px} cy={py} r={10} fill={C.pin} />
        </g>
      ))}
      {columns.map((c, i) => (
        <FlipTag key={c} x={w * (i === 0 ? 0.25 : 0.75)} y={14} word={c} f={f + i * 9} swing={5} drop={cl(header * 1.2 - i * 0.2)} size={Math.min(0.9, w / 700)} cord={40} />
      ))}
      <g>{children}</g>
    </g>
  );
};
