// L18 orbit pieces (BUILD.md §5 `OrbitRings`, `DayClock`, `LapChip`; storyboard 2-01..2-08, 3-03, 8-04, 8-07, 8-18, Z-02).
// Orbits are NOT to scale (F8): 2-01's first frame carries the NOT TO SCALE tag (`notToScale`). Tokens circle forever.
// Lap counts are drawn as PIPS, never as rolling numerals (only data18 values may be numerals: 11, 16 as a label).
// USAGE (f = the shot's frame)
//   <OrbitRings f cx cy earthR?=70 rings={[{ r, speed: deg/f, token: "moon"|"station"|"sat"|"dot", phase?, color?,
//               dashed?, tilt?={0..1 squash, 1 = a circle}, size?, trail?={deg of glowing trail behind the token} }]}
//               roche?={radius of the dashed Roche circle} rocheLabel? notToScale? earth?=true />
//   orbitPos(ring, f, cx, cy) → [x, y] of that ring's token (pin a label or Tick's pointer to it)
//   <DayClock x y r f progress={0..1 of a 24-h day} laps?={pips round the rim, popping as the hand passes} family?
//             label?={a data18 text, e.g. READ.earth24.text} />    a 24-h disc; hand = progress × 360 (drive it with f)
//   <LapChip x y w?=300 progress={0..1} f label? pips? color? />  a progress bar that fills, with a moving sheen
import React, { useId } from "react";
import { Family, IF2, alpha, mixHex } from "../../lib/illustrated";
import { L18_COLORS, PILL_TEXT } from "./families";
import { MoonToken } from "./gauge";
import { EarthDisc, StationToken, WeatherSat } from "./planets18";
import { assertAllowed } from "./data18";

const C = L18_COLORS;
const sid = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, "");
const cl = (v: number) => Math.max(0, Math.min(1, v));
const D2R = Math.PI / 180;

export type Ring = { r: number; speed: number; token: "moon" | "station" | "sat" | "dot"; phase?: number; color?: string; dashed?: boolean; tilt?: number; size?: number; trail?: number };

export const orbitPos = (ring: Ring, f: number, cx: number, cy: number): [number, number] => {
  const a = ((ring.phase ?? 0) + f * ring.speed) * D2R;
  return [cx + Math.cos(a) * ring.r, cy + Math.sin(a) * ring.r * (ring.tilt ?? 1)];
};

export const OrbitRings: React.FC<{ f: number; cx: number; cy: number; earthR?: number; rings: Ring[]; roche?: number; rocheLabel?: string; notToScale?: boolean; earth?: boolean }> = ({
  f,
  cx,
  cy,
  earthR = 70,
  rings,
  roche,
  rocheLabel,
  notToScale = false,
  earth = true,
}) => (
  <g>
    {roche ? (
      <g>
        <circle cx={cx} cy={cy} r={roche} fill={alpha(C.lever, 0.08)} stroke={C.lever} strokeWidth={4} strokeDasharray="18 12" strokeDashoffset={-f * 2} />
        {rocheLabel ? (
          <text x={cx} y={cy - roche - 16} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 24, letterSpacing: 2, fill: C.lever }}>
            {assertAllowed(rocheLabel, "OrbitRings roche label")}
          </text>
        ) : null}
      </g>
    ) : null}
    {rings.map((g, i) => {
      const col = g.color ?? (g.token === "moon" ? C.moonRim : g.token === "station" ? C.amber : C.model);
      const ry = g.r * (g.tilt ?? 1);
      const [tx, ty] = orbitPos(g, f, cx, cy);
      const a = ((g.phase ?? 0) + f * g.speed) * D2R;
      const trail = g.trail ?? 50;
      const a0 = a - Math.sign(g.speed || 1) * trail * D2R;
      const p0 = [cx + Math.cos(a0) * g.r, cy + Math.sin(a0) * ry];
      const sweep = g.speed >= 0 ? 1 : 0;
      return (
        <g key={i}>
          <ellipse cx={cx} cy={cy} rx={g.r} ry={ry} fill="none" stroke={alpha(col, 0.55)} strokeWidth={3} strokeDasharray={g.dashed ? "12 10" : undefined} />
          {trail > 0 ? <path d={`M${p0[0].toFixed(1)} ${p0[1].toFixed(1)} A${g.r} ${ry} 0 0 ${sweep} ${tx.toFixed(1)} ${ty.toFixed(1)}`} fill="none" stroke={col} strokeWidth={8} strokeLinecap="round" opacity={0.7} /> : null}
          {g.token === "moon" ? (
            <MoonToken x={tx} y={ty} r={g.size ?? 24} f={f} />
          ) : g.token === "station" ? (
            <StationToken x={tx} y={ty} size={g.size ?? 44} f={f} angle={(a / D2R + 90) % 360} />
          ) : g.token === "sat" ? (
            <WeatherSat x={tx} y={ty} size={g.size ?? 40} f={f} />
          ) : (
            <circle cx={tx} cy={ty} r={g.size ?? 9} fill={col} />
          )}
        </g>
      );
    })}
    {earth ? <EarthDisc x={cx} y={cy} r={earthR} f={f} /> : null}
    {notToScale ? (
      <g>
        <rect x={cx - 110} y={cy + earthR + 30} width={220} height={40} rx={20} fill="rgba(0,10,16,0.72)" stroke={C.saffron} strokeWidth={2.5} />
        <text x={cx} y={cy + earthR + 58} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 22, letterSpacing: 2.4, fill: PILL_TEXT }}>
          NOT TO SCALE
        </text>
      </g>
    ) : null}
  </g>
);

export const DayClock: React.FC<{ x: number; y: number; r: number; f: number; progress: number; laps?: number; family?: Family; label?: string }> = ({ x, y, r, f, progress, laps = 0, family, label }) => {
  const id = "dc" + sid(useId());
  const p = Math.max(0, progress);
  const hand = (p % 1) * 360 - 90;
  const face = family ? mixHex(family.near, family.light, 0.08) : "#07505C";
  const done = Math.floor(p * laps + 1e-6);
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <circle cx={x} cy={y} r={r} />
        </clipPath>
      </defs>
      <circle cx={x} cy={y} r={r + 10} fill={alpha(C.amber, 0.18)} />
      <circle cx={x} cy={y} r={r} fill={face} stroke={C.amber} strokeWidth={5} />
      {/* the elapsed sector */}
      <path
        d={`M${x} ${y} L${x} ${y - r} A${r} ${r} 0 ${(p % 1) * 360 > 180 ? 1 : 0} 1 ${x + Math.cos(hand * D2R) * r} ${y + Math.sin(hand * D2R) * r} Z`}
        fill={alpha(C.amber, 0.28)}
        clipPath={`url(#${id})`}
      />
      {Array.from({ length: 24 }, (_, h) => {
        const a = (h / 24) * 360 - 90;
        const major = h % 6 === 0;
        return <line key={h} x1={x + Math.cos(a * D2R) * r * (major ? 0.78 : 0.86)} y1={y + Math.sin(a * D2R) * r * (major ? 0.78 : 0.86)} x2={x + Math.cos(a * D2R) * r * 0.95} y2={y + Math.sin(a * D2R) * r * 0.95} stroke={C.amber} strokeWidth={major ? 5 : 2.5} strokeLinecap="round" />;
      })}
      {Array.from({ length: laps }, (_, k) => {
        const a = ((k + 1) / laps) * 360 - 90;
        const age = (p * laps - (k + 1)) * 30; // frames-ish since the hand passed it
        const on = k < done;
        const pop = on ? 1 + 0.6 * Math.max(0, 1 - age / 6) : 0.6;
        return <circle key={"l" + k} cx={x + Math.cos(a * D2R) * (r + 26)} cy={y + Math.sin(a * D2R) * (r + 26)} r={9 * pop} fill={on ? C.moonRim : alpha(C.amber, 0.25)} />;
      })}
      <line x1={x} y1={y} x2={x + Math.cos(hand * D2R) * r * 0.9} y2={y + Math.sin(hand * D2R) * r * 0.9} stroke={C.lever} strokeWidth={8} strokeLinecap="round" />
      <circle cx={x} cy={y} r={12} fill={C.lever} />
      <circle cx={x + Math.cos(hand * D2R) * r * 0.9} cy={y + Math.sin(hand * D2R) * r * 0.9} r={8 + Math.sin(f / 3) * 1.5} fill="#FFE7A0" />
      {label ? (
        <text x={x} y={y + r + 70} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 30, letterSpacing: 2, fill: family?.text ?? PILL_TEXT }}>
          {assertAllowed(label, "DayClock label")}
        </text>
      ) : null}
    </g>
  );
};

export const LapChip: React.FC<{ x: number; y: number; w?: number; progress: number; f: number; label?: string; pips?: number; color?: string }> = ({ x, y, w = 300, progress, f, label, pips = 0, color = C.amber }) => {
  const id = "lc" + sid(useId());
  const h = 34;
  const p = cl(progress);
  const sheen = ((f * 9) % (w + 80)) - 40;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={x} y={y} width={w * p} height={h} rx={h / 2} />
        </clipPath>
      </defs>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill="rgba(0,10,16,0.6)" stroke={color} strokeWidth={3} />
      <rect x={x} y={y} width={w * p} height={h} rx={h / 2} fill={color} />
      <g clipPath={`url(#${id})`}>
        <rect x={x + sheen} y={y - 4} width={34} height={h + 8} fill="#FFFFFF" opacity={0.35} transform={`skewX(-18)`} />
      </g>
      {Array.from({ length: pips }, (_, k) => (
        <circle key={k} cx={x + ((k + 1) / (pips + 1)) * w} cy={y + h + 18} r={6} fill={(k + 1) / (pips + 1) <= p ? C.moonRim : alpha(color, 0.3)} />
      ))}
      {label ? (
        <text x={x} y={y - 14} style={{ fontFamily: IF2.label, fontSize: 26, letterSpacing: 2, fill: PILL_TEXT }}>
          {assertAllowed(label, "LapChip label")}
        </text>
      ) : null}
    </g>
  );
};
