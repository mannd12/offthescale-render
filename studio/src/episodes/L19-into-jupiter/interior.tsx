// L19 the interior models (BUILD.md §5 `interior.tsx`; storyboard F3, F8, §1 "the interior stays warm").
// Everything here is a MODEL (the MODEL ticket goes with it): gas amber, liquid #F0601A, metallic hydrogen HOT GOLD #FFC93A
// with an orange rim (never silver), the dilute core a churning fog of gold dots. Layer radii are NOT claims and carry no
// numerals (class B); only the 63 % ring (row 12) and the 156 km rim hair (rows 4, 8; `toScale`) are measured placements.
// USAGE (f = the shot's frame)
//   <Section f cx cy radius layers={("gas"|"liquid"|"metal")[]} core="hard"|"dilute"|"none" ring?={0..1 of the radius, drawn
//            dashed (63 % = 0.63)} spread?={0..1 the dilute core's dots diffusing outward} toScale?={true: draw the 156 km hair
//            at the rim, 156 / 71,492 of the radius} cut?={true: a half cutaway, the lower half drawn as the planet's banded
//            face} swirl?={deg/f of the layer texture, 0.35} />
//   <Fog f cx cy r n?=70 spread?={0..1} speed?=20 color? /> churning dots with a heaving edge (the dilute core)
//   <GoldLayer f x y w h fill?={0..1 front} currents?={true} sparks?={true} rain?={true} /> a strip of the metal layer
//   <Balance f x y tilt={deg} wobble?={deg amplitude} size?=1 /> a beam balance: a water ball left, a striped planet disc right
import React from "react";
import { rnd } from "../../lib/illustrated";
import { L19_COLORS as C } from "./families";
import { Rain19, Sparks, Sweep19 } from "./flows19";
import { WaterDrop } from "./icons19";

const cl = (v: number) => Math.max(0, Math.min(1, v));
// model placements of the layer boundaries (fractions of the radius; drawings only, no numerals on screen)
const R_LIQUID = 0.9;
const R_METAL = 0.78;

export const Fog: React.FC<{ f: number; cx: number; cy: number; r: number; n?: number; spread?: number; speed?: number; color?: string }> = ({
  f,
  cx,
  cy,
  r,
  n = 70,
  spread = 1,
  speed = 20,
  color = C.fog,
}) => {
  const R = r * (0.35 + 0.65 * cl(spread));
  const edge: string[] = [];
  for (let k = 0; k <= 36; k++) {
    const a = (k / 36) * Math.PI * 2;
    const rr = R * (1 + 0.07 * Math.sin(a * 3 + f * 0.08) + 0.05 * Math.sin(a * 5 - f * 0.11));
    edge.push(`${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`);
  }
  return (
    <g>
      <polygon points={edge.join(" ")} fill={C.gold} opacity={0.22} />
      <polygon points={edge.join(" ")} fill="none" stroke={C.goldHot} strokeWidth={4} strokeDasharray="10 12" opacity={0.6} />
      {Array.from({ length: Math.min(100, n) }, (_, i) => {
        // each dot circles at its own radius and angular speed (px/f along its path ≈ speed)
        const rr = R * Math.sqrt(rnd(i * 3 + 1)) * 0.95;
        const w = (speed * (0.6 + rnd(i * 5) * 0.8)) / Math.max(30, rr) * (i % 2 ? 1 : -1);
        const a = rnd(i * 7) * Math.PI * 2 + f * w;
        const px = cx + Math.cos(a) * rr;
        const py = cy + Math.sin(a) * rr * 0.92;
        return <circle key={i} cx={px} cy={py} r={4 + rnd(i * 11) * 6} fill={i % 3 ? color : C.goldHot} opacity={0.85} />;
      })}
    </g>
  );
};

export const Section: React.FC<{
  f: number;
  cx: number;
  cy: number;
  radius: number;
  layers: ("gas" | "liquid" | "metal")[];
  core: "hard" | "dilute" | "none";
  ring?: number;
  spread?: number;
  toScale?: boolean;
  cut?: boolean;
  swirl?: number;
}> = ({ f, cx, cy, radius: R, layers, core, ring, spread = 1, toScale = false, cut = false, swirl = 0.35 }) => {
  const id = "sec" + React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const has = (l: "gas" | "liquid" | "metal") => layers.includes(l);
  const rot = (f * swirl) % 360;
  const hair = (156 / 71492) * R; // rows 4, 8: the probe's 156 km against the 71,492 km radius (F8: to scale)
  return (
    <g>
      <defs>
        <radialGradient id={`${id}-gas`}>
          <stop offset="0.7" stopColor="#E8731C" />
          <stop offset="1" stopColor={C.stripeAmber} />
        </radialGradient>
        <radialGradient id={`${id}-metal`}>
          <stop offset="0" stopColor={C.goldHot} />
          <stop offset="0.8" stopColor={C.gold} />
          <stop offset="1" stopColor={C.goldRim} />
        </radialGradient>
        <clipPath id={`${id}-half`}>
          <rect x={cx - R * 1.2} y={cy - R * 1.2} width={R * 2.4} height={R * 1.2} />
        </clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={R * 1.18} fill={C.glow} opacity={0.12 + 0.04 * Math.sin(f * 0.15)} />
      {cut ? (
        // the lower half: the banded face of the planet
        <g>
          {Array.from({ length: 8 }, (_, i) => {
            const y0 = cy + (i * R) / 8;
            const hw = Math.sqrt(Math.max(0, R * R - ((i + 0.5) * R / 8) ** 2));
            return <rect key={i} x={cx - hw} y={y0} width={hw * 2} height={R / 8 + 1} fill={[C.stripeOrange, C.stripeAmber, C.stripeRust, C.belt][i % 4]} />;
          })}
        </g>
      ) : null}
      <g clipPath={cut ? `url(#${id}-half)` : undefined}>
        <circle cx={cx} cy={cy} r={R} fill={has("gas") ? `url(#${id}-gas)` : C.stripeAmber} />
        {has("liquid") ? <circle cx={cx} cy={cy} r={R * R_LIQUID} fill={C.liquid} /> : null}
        {has("metal") ? <circle cx={cx} cy={cy} r={R * R_METAL} fill={`url(#${id}-metal)`} /> : null}
        {has("metal") ? <circle cx={cx} cy={cy} r={R * R_METAL} fill="none" stroke={C.glow} strokeWidth={R * 0.02} /> : null}
        {/* layer texture that turns (the probe-visible life of a big still form) */}
        <g transform={`rotate(${rot} ${cx} ${cy})`} fill="none" strokeLinecap="round">
          {[0.95, 0.84, 0.62, 0.45].map((k, i) => (
            <circle key={i} cx={cx} cy={cy} r={R * k} stroke={i < 2 ? "#FFE8B0" : C.glow} strokeWidth={R * 0.018} strokeDasharray={`${R * 0.16} ${R * 0.1}`} opacity={0.35} />
          ))}
        </g>
        {core === "hard" ? (
          <g>
            <circle cx={cx} cy={cy} r={R * 0.17} fill={C.stripeRust} stroke={C.goldRim} strokeWidth={R * 0.015} />
            <circle cx={cx - R * 0.05} cy={cy - R * 0.05} r={R * 0.06} fill={C.lever} opacity={0.7} />
          </g>
        ) : null}
        {core === "dilute" ? <Fog f={f} cx={cx} cy={cy} r={R * 0.63} spread={spread} n={80} /> : null}
        {ring != null ? (
          <circle cx={cx} cy={cy} r={R * cl(ring)} fill="none" stroke={C.model} strokeWidth={R * 0.014} strokeDasharray={`${R * 0.04} ${R * 0.025}`} strokeDashoffset={-f * 3} />
        ) : null}
      </g>
      {/* rim line; with toScale it drops to 1 px of dark rust so the 2-px lemon hair is the brightest thing on the rim */}
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={toScale ? "#5A1206" : C.goldHot} strokeWidth={toScale ? 1 : Math.max(2, R * 0.006)} opacity={0.8} />
      {toScale ? (
        <g>
          {/* the hair: a lemon arc exactly `hair` px thick on the rim top, plus leader arms that reach out so it can be found */}
          <path d={`M${cx - R * 0.08} ${cy - R + hair / 2} A${R} ${R} 0 0 1 ${cx + R * 0.08} ${cy - R + hair / 2}`} fill="none" stroke={C.heard} strokeWidth={Math.max(0.6, hair)} />
          <line x1={cx} y1={cy - R} x2={cx} y2={cy - R - 120} stroke={C.heard} strokeWidth={3} strokeDasharray="8 6" />
          <circle cx={cx} cy={cy - R} r={10 + 4 * Math.sin(f * 0.3)} fill="none" stroke={C.heard} strokeWidth={3} />
        </g>
      ) : null}
    </g>
  );
};

export const GoldLayer: React.FC<{ f: number; x: number; y: number; w: number; h: number; fill?: number; currents?: boolean; sparks?: boolean; rain?: boolean }> = ({
  f,
  x,
  y,
  w,
  h,
  fill = 1,
  currents = true,
  sparks = false,
  rain = false,
}) => {
  const id = "gold" + React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={x} y={y} width={w} height={h} rx={20} />
        </clipPath>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.goldHot} />
          <stop offset="0.6" stopColor={C.gold} />
          <stop offset="1" stopColor={C.goldRim} />
        </linearGradient>
      </defs>
      <rect x={x} y={y} width={w} height={h} rx={20} fill={C.liquid} />
      <g clipPath={`url(#${id})`}>
        <Sweep19 x={x} y={y} w={w} h={h} p={fill} color={`url(#${id}-g)`} edge="#FFF0A0" />
        {/* wide light bands sweeping (full-strip mover, 5 px/f) */}
        {Array.from({ length: Math.ceil(w / 320) + 2 }, (_, i) => (
          <rect key={i} x={x - 320 + ((i * 320 + f * 5) % (Math.ceil(w / 320) * 320 + 320))} y={y} width={110} height={h} fill="#FFF6C8" opacity={0.14 * cl(fill * 2)} transform={`skewX(-18)`} />
        ))}
        {currents
          ? [0, 1, 2].map((k) => {
              const cxx = x + w * (0.2 + k * 0.3);
              const cyy = y + h / 2;
              return (
                <g key={k} transform={`rotate(${(f * 4 * (k % 2 ? -1 : 1)) % 360} ${cxx} ${cyy})`} opacity={cl(fill * 1.5)}>
                  <ellipse cx={cxx} cy={cyy} rx={h * 0.32} ry={h * 0.32} fill="none" stroke={C.glow} strokeWidth={8} strokeDasharray="40 30" />
                  <path d={`M${cxx + h * 0.32} ${cyy - 16} l14 22 l-28 0 Z`} fill={C.glow} />
                </g>
              );
            })
          : null}
        {sparks ? <Sparks f={f} x={x} y={y + h * 0.1} w={w} h={h * 0.8} mode="zigzag" speed={36} /> : null}
        {rain ? <Rain19 f={f} x={x + 20} y={y + 10} w={w - 40} h={h - 20} n={46} speed={18} color="#FFF0A0" /> : null}
      </g>
      <rect x={x} y={y} width={w} height={h} rx={20} fill="none" stroke={C.goldRim} strokeWidth={6} />
    </g>
  );
};

export const Balance: React.FC<{ f: number; x: number; y: number; tilt: number; wobble?: number; size?: number }> = ({ f, x, y, tilt, wobble = 1.5, size = 1 }) => {
  const cid = "bal" + React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const s = size;
  const a = tilt + Math.sin(f * 0.18) * wobble;
  const arm = 300 * s;
  const rad = (a * Math.PI) / 180;
  const lx = x - Math.cos(rad) * arm;
  const ly = y - Math.sin(rad) * arm;
  const rx = x + Math.cos(rad) * arm;
  const ry = y + Math.sin(rad) * arm;
  const Pan: React.FC<{ px: number; py: number; children: React.ReactNode }> = ({ px, py, children }) => (
    <g>
      <line x1={px} y1={py} x2={px - 70 * s} y2={py + 120 * s} stroke={C.goldRim} strokeWidth={4 * s} />
      <line x1={px} y1={py} x2={px + 70 * s} y2={py + 120 * s} stroke={C.goldRim} strokeWidth={4 * s} />
      <path d={`M${px - 90 * s} ${py + 120 * s} Q${px} ${py + 170 * s} ${px + 90 * s} ${py + 120 * s} Z`} fill={C.gold} stroke={C.goldRim} strokeWidth={4 * s} />
      {children}
    </g>
  );
  return (
    <g>
      <path d={`M${x - 90 * s} ${y + 420 * s} L${x + 90 * s} ${y + 420 * s} L${x + 20 * s} ${y + 380 * s} L${x + 14 * s} ${y} L${x - 14 * s} ${y} L${x - 20 * s} ${y + 380 * s} Z`} fill={C.goldRim} />
      <line x1={lx} y1={ly} x2={rx} y2={ry} stroke={C.gold} strokeWidth={16 * s} strokeLinecap="round" />
      <circle cx={x} cy={y} r={20 * s} fill={C.goldHot} stroke={C.goldRim} strokeWidth={4 * s} />
      <Pan px={lx} py={ly}>
        <WaterDrop x={lx} y={ly + 80 * s} size={90 * s} />
      </Pan>
      <Pan px={rx} py={ry}>
        <defs>
          <clipPath id={cid}>
            <circle cx={rx} cy={ry + 78 * s} r={48 * s} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${cid})`}>
          <circle cx={rx} cy={ry + 78 * s} r={48 * s} fill={C.stripeAmber} />
          {[-24, -6, 12, 28].map((dy, i) => (
            <rect key={i} x={rx - 48 * s} y={ry + 78 * s + dy * s} width={96 * s} height={10 * s} fill={[C.stripeOrange, C.stripeRust, C.belt, C.stripeOrange][i]} opacity={0.85} />
          ))}
        </g>
        <circle cx={rx} cy={ry + 78 * s} r={48 * s} fill="none" stroke={C.goldRim} strokeWidth={4 * s} />
      </Pan>
    </g>
  );
};
