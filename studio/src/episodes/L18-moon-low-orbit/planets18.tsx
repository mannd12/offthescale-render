// L18 bodies (BUILD.md §5 `planets18.tsx`). The Earth is a blue LIMB with a sliding cloud band, or a plain blue disc with
// cloud swirls: no continents, no oceans drawn as water, no flags (F6, F12). The station and the weather satellite are
// generic symbols, never an insignia. The giant planet is banded amber and ochre (not a real Jupiter map).
// USAGE (f = the shot's frame)
//   <EarthLimb f y?={top of the curve at x0..x1 centre, default 900} R?={curvature radius, 2600} cx?=960 cloudSpeed?=12
//              glow?=1 dark?={0..1 night-side shading} />                         the limb; clouds slide at cloudSpeed px/f
//   limbY(x, y, R, cx) → the limb's surface y at screen x (stand Tick on it)
//   <EarthDisc x y r f spin?={px/f cloud drift, default 3} glow?=1 />                 the full Earth for cross-sections, orbits
//   <BandedGiant x y r f speed?={px/f, default 14} glow? />                           banded amber planet, bands scrolling
//   <RingedPlanet x y r f tilt?={deg} n?={ring particles, 70} speed?={deg/f, 2.2} />    rings with orbiting particles
//   <Comet x y angle?={deg the tail points to} len?=260 f />                           a bright smear and tail, flickering
//   <StationToken x y size?=60 f? angle? />  ·  <WeatherSat x y size?=50 f? />         generic symbols (amber panels)
import React, { useId } from "react";
import { alpha, mixHex, rnd } from "../../lib/illustrated";
import { L18_COLORS } from "./families";

const C = L18_COLORS;
const sid = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, "");
const wrap = (v: number, m: number) => ((v % m) + m) % m;

export const limbY = (x: number, y = 900, R = 2600, cx = 960) => y + R - Math.sqrt(Math.max(0, R * R - (x - cx) * (x - cx)));

export const EarthLimb: React.FC<{ f: number; y?: number; R?: number; cx?: number; cloudSpeed?: number; glow?: number; dark?: number }> = ({ f, y = 900, R = 2600, cx = 960, cloudSpeed = 12, glow = 1, dark = 0 }) => {
  const id = "el" + sid(useId());
  const cy = y + R;
  return (
    <g>
      <defs>
        <radialGradient id={id + "a"} cx={cx} cy={cy} r={R + 120} gradientUnits="userSpaceOnUse">
          <stop offset={(R - 10) / (R + 120)} stopColor={C.earthLimb} stopOpacity={0.9 * glow} />
          <stop offset={(R + 30) / (R + 120)} stopColor={C.cloud} stopOpacity={0.35 * glow} />
          <stop offset={1} stopColor={C.earthLimb} stopOpacity={0} />
        </radialGradient>
        <radialGradient id={id + "b"} cx={cx} cy={cy - R * 0.2} r={R} gradientUnits="userSpaceOnUse">
          <stop offset={0} stopColor={C.earthCore} />
          <stop offset={0.85} stopColor={C.earthDeep} />
          <stop offset={1} stopColor={C.earthLimb} />
        </radialGradient>
        <clipPath id={id + "c"}>
          <circle cx={cx} cy={cy} r={R} />
        </clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={R + 120} fill={`url(#${id}a)`} />
      <circle cx={cx} cy={cy} r={R} fill={`url(#${id}b)`} />
      <g clipPath={`url(#${id}c)`}>
        {/* the cloud band: long rounded strips following the curve, sliding */}
        {Array.from({ length: 14 }, (_, i) => {
          const span = 2800;
          const bx = wrap(rnd(i * 3 + 1) * span + f * cloudSpeed * (0.8 + 0.4 * rnd(i * 5)), span) - 440;
          const depth = 14 + rnd(i * 7 + 2) * 70;
          const bw = 160 + rnd(i * 11) * 260;
          const by = limbY(bx + bw / 2, y, R, cx) + depth;
          return <rect key={i} x={bx} y={by} width={bw} height={10 + rnd(i * 13) * 16} rx={10} fill={i % 3 === 0 ? "#FFFFFF" : C.cloud} opacity={0.7} />;
        })}
        {dark > 0 ? <rect x={-400} y={y - 20} width={2720} height={R} fill="#01121B" opacity={dark * 0.6} /> : null}
      </g>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={C.cloud} strokeWidth={5} opacity={0.85 * glow} />
    </g>
  );
};

export const EarthDisc: React.FC<{ x: number; y: number; r: number; f: number; spin?: number; glow?: number }> = ({ x, y, r, f, spin = 3, glow = 1 }) => {
  const id = "ed" + sid(useId());
  return (
    <g>
      <defs>
        <radialGradient id={id + "g"} cx="0.38" cy="0.34" r="0.78">
          <stop offset="0" stopColor={C.earthLimb} />
          <stop offset="0.6" stopColor={C.earthDeep} />
          <stop offset="1" stopColor="#064766" />
        </radialGradient>
        <radialGradient id={id + "a"} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.66" stopColor={C.earthLimb} stopOpacity={0.6 * glow} />
          <stop offset="1" stopColor={C.earthLimb} stopOpacity={0} />
        </radialGradient>
        <clipPath id={id + "c"}>
          <circle cx={x} cy={y} r={r} />
        </clipPath>
      </defs>
      <circle cx={x} cy={y} r={r * 1.35} fill={`url(#${id}a)`} />
      <circle cx={x} cy={y} r={r} fill={`url(#${id}g)`} />
      <g clipPath={`url(#${id}c)`}>
        {Array.from({ length: 9 }, (_, i) => {
          const span = r * 3;
          const bx = x - r * 1.5 + wrap(rnd(i * 3 + 7) * span + f * spin * (0.7 + 0.5 * rnd(i)), span);
          const by = y - r * 0.85 + rnd(i * 5 + 3) * r * 1.7;
          return <rect key={i} x={bx - r * 0.3} y={by} width={r * (0.35 + rnd(i * 7) * 0.4)} height={Math.max(3, r * 0.07)} rx={r * 0.04} fill={i % 2 ? "#FFFFFF" : C.cloud} opacity={0.75} />;
        })}
        <path d={`M${x + r * 0.2} ${y - r * 1.1} A${r * 1.1} ${r * 1.1} 0 0 1 ${x + r * 0.2} ${y + r * 1.1} L${x + r * 1.2} ${y + r * 1.1} L${x + r * 1.2} ${y - r * 1.1} Z`} fill="#01121B" opacity={0.32} />
      </g>
      <circle cx={x} cy={y} r={r} fill="none" stroke={C.cloud} strokeWidth={Math.max(2, r * 0.03)} opacity={0.8} />
    </g>
  );
};

export const BandedGiant: React.FC<{ x: number; y: number; r: number; f: number; speed?: number; glow?: number }> = ({ x, y, r, f, speed = 14, glow = 1 }) => {
  const id = "bg" + sid(useId());
  const bands = [C.giantBand3, C.giantBand1, C.giantBand2, C.giantBand1, C.giantBand3, C.giantBand2, C.giantBand1, C.giantBand3];
  const bh = (2 * r) / bands.length;
  return (
    <g>
      <defs>
        <clipPath id={id + "c"}>
          <circle cx={x} cy={y} r={r} />
        </clipPath>
        <radialGradient id={id + "s"} cx="0.36" cy="0.32" r="0.8">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity={0.18} />
          <stop offset="0.6" stopColor="#000000" stopOpacity={0} />
          <stop offset="1" stopColor="#3A1406" stopOpacity={0.55} />
        </radialGradient>
        <radialGradient id={id + "a"} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.7" stopColor={C.amber} stopOpacity={0.5 * glow} />
          <stop offset="1" stopColor={C.amber} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r * 1.3} fill={`url(#${id}a)`} />
      <g clipPath={`url(#${id}c)`}>
        {bands.map((c, i) => (
          <rect key={i} x={x - r} y={y - r + i * bh} width={2 * r} height={bh + 1} fill={c} />
        ))}
        {/* swirls and band edges scrolling along the bands */}
        {Array.from({ length: 18 }, (_, i) => {
          const row = i % bands.length;
          const span = r * 2.6;
          const sx = x - r * 1.3 + wrap(rnd(i * 7 + 1) * span + f * speed * (row % 2 ? 1 : 0.7), span);
          const sy = y - r + (row + 0.5) * bh;
          return <ellipse key={i} cx={sx} cy={sy} rx={r * (0.08 + rnd(i * 3) * 0.12)} ry={bh * 0.28} fill={mixHex(bands[row], "#7A2E10", 0.35)} opacity={0.7} />;
        })}
        <circle cx={x} cy={y} r={r} fill={`url(#${id}s)`} />
      </g>
    </g>
  );
};

export const RingedPlanet: React.FC<{ x: number; y: number; r: number; f: number; tilt?: number; n?: number; speed?: number }> = ({ x, y, r, f, tilt = -14, n = 70, speed = 2.2 }) => {
  const id = "rp" + sid(useId());
  const parts = (front: boolean) =>
    Array.from({ length: n }, (_, i) => {
      const rr = r * (1.45 + rnd(i * 3 + 1) * 0.7);
      const a = ((rnd(i * 5 + 2) * 360 + f * speed * (1.6 / (rr / r))) * Math.PI) / 180;
      const py = Math.sin(a);
      if (front !== py > 0) return null;
      return <circle key={i} cx={x + Math.cos(a) * rr} cy={y + py * rr * 0.26} r={1.5 + rnd(i * 7) * 3} fill={i % 3 ? C.moonGlow : C.starApricot} opacity={0.9} />;
    });
  return (
    <g transform={`rotate(${tilt} ${x} ${y})`}>
      <defs>
        <radialGradient id={id + "g"} cx="0.36" cy="0.32" r="0.8">
          <stop offset="0" stopColor={C.giantBand3} />
          <stop offset="0.7" stopColor={C.giantBand1} />
          <stop offset="1" stopColor={C.giantBand2} />
        </radialGradient>
      </defs>
      <ellipse cx={x} cy={y} rx={r * 2.1} ry={r * 0.56} fill="none" stroke={alpha(C.moonGlow, 0.35)} strokeWidth={r * 0.32} />
      {parts(false)}
      <circle cx={x} cy={y} r={r} fill={`url(#${id}g)`} />
      <path d={`M${x - r * 2.1} ${y} A${r * 2.1} ${r * 0.56} 0 0 0 ${x + r * 2.1} ${y}`} fill="none" stroke={alpha(C.moonGlow, 0.55)} strokeWidth={r * 0.32} />
      {parts(true)}
    </g>
  );
};

export const Comet: React.FC<{ x: number; y: number; angle?: number; len?: number; f: number; size?: number }> = ({ x, y, angle = 200, len = 260, f, size = 14 }) => {
  const id = "cm" + sid(useId());
  const a = (angle * Math.PI) / 180;
  const tx = x + Math.cos(a) * len;
  const ty = y + Math.sin(a) * len;
  const fl = 0.85 + 0.15 * Math.sin(f * 0.9);
  return (
    <g>
      <defs>
        <linearGradient id={id} x1={x} y1={y} x2={tx} y2={ty} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={C.comet} stopOpacity={0.95} />
          <stop offset="0.5" stopColor={C.starAqua} stopOpacity={0.4} />
          <stop offset="1" stopColor={C.starAqua} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path
        d={`M${x + Math.cos(a + Math.PI / 2) * size} ${y + Math.sin(a + Math.PI / 2) * size} L${tx + Math.cos(a + Math.PI / 2) * size * 3} ${ty + Math.sin(a + Math.PI / 2) * size * 3} L${tx - Math.cos(a + Math.PI / 2) * size * 3} ${ty - Math.sin(a + Math.PI / 2) * size * 3} L${x - Math.cos(a + Math.PI / 2) * size} ${y - Math.sin(a + Math.PI / 2) * size} Z`}
        fill={`url(#${id})`}
        opacity={fl}
      />
      <circle cx={x} cy={y} r={size * 2.4} fill={C.starAqua} opacity={0.3} />
      <circle cx={x} cy={y} r={size} fill={C.comet} />
    </g>
  );
};

export const StationToken: React.FC<{ x: number; y: number; size?: number; f?: number; angle?: number }> = ({ x, y, size = 60, f = 0, angle = 0 }) => {
  const s = size / 60;
  const blink = Math.sin(f / 4) > 0 ? 1 : 0.35;
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${s})`}>
      <circle r={44} fill={C.station} opacity={0.18} />
      <rect x={-34} y={-3} width={68} height={6} rx={3} fill="#FFE7A0" />
      {[-1, 1].map((k) => (
        <g key={k}>
          <rect x={k * 30 - 12} y={-22} width={24} height={16} rx={2} fill={C.station} stroke="#7A3A0C" strokeWidth={1.5} />
          <rect x={k * 30 - 12} y={6} width={24} height={16} rx={2} fill={C.station} stroke="#7A3A0C" strokeWidth={1.5} />
        </g>
      ))}
      <rect x={-9} y={-9} width={18} height={18} rx={4} fill="#FFE7A0" stroke="#7A3A0C" strokeWidth={1.5} />
      <circle cx={0} cy={0} r={3.5} fill={C.lever} opacity={blink} />
    </g>
  );
};

export const WeatherSat: React.FC<{ x: number; y: number; size?: number; f?: number }> = ({ x, y, size = 50, f = 0 }) => {
  const s = size / 50;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={36} fill={C.earthLimb} opacity={0.15} />
      <rect x={-34} y={-6} width={22} height={12} rx={2} fill={C.model} stroke="#0B2A33" strokeWidth={1.5} />
      <rect x={12} y={-6} width={22} height={12} rx={2} fill={C.model} stroke="#0B2A33" strokeWidth={1.5} />
      <rect x={-10} y={-12} width={20} height={24} rx={5} fill="#FFD65A" stroke="#0B2A33" strokeWidth={1.5} />
      <path d="M0 -12 L0 -22 M-6 -24 A8 8 0 0 1 6 -24" fill="none" stroke="#FFD65A" strokeWidth={2.5} />
      <circle cx={0} cy={2} r={3} fill={C.lever} opacity={Math.sin(f / 5) > 0 ? 1 : 0.4} />
    </g>
  );
};
