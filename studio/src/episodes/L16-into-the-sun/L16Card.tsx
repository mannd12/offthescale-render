// L16Card: the chapter card (C-13) with HEAT RINGS behind its type (the kit ChapterCard paints its own field over
// everything beneath, so it can't; BUILD.md §5 "known kit gaps"). Same type and in/out curve as the kit card (L15Card's
// pattern): text rises 24 px and fades in over the first 18 % of `t`, holds, fades out over the last 15 %; title wrapped
// at 22 chars, 104 px (84 for 3+ lines).
// USAGE
//   <L16Card family={familyOf("corona")} kicker="Off the Scale · Into the Sun"  (Kicker draws its own rule: no "—")
//            title="What If You Flew Into the Sun?" t={0..1 over the card} frame={card frame} />   a full-frame <Stage>
//   <HeatRings f cx? cy? every?=36 speed?=6 />   the rings alone (for other shots: the closer, the end card field)
//   Background mover: concentric arcs launched every 36 f from a Sun limb at the lower right, expanding at 6 px/f
//   (violet / magenta / amber, a thin vermilion thread on every fourth: the card's one vermilion thread).
import React from "react";
import { Family, IF2, Kicker, Sky, Stage, Vignette } from "../../lib/illustrated";
import { L16_COLORS, STAR_TINTS, sunGradient } from "./families";
import { CoronaHalo } from "./sunbody";

const C = L16_COLORS;
const sm = (t: number, a = 0, b = 1) => {
  const u = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return u * u * (3 - 2 * u);
};

export const HeatRings: React.FC<{ f: number; cx?: number; cy?: number; every?: number; speed?: number; width?: number; maxR?: number; opacity?: number; r0?: number; sun?: boolean }> = ({
  f,
  cx = 1780,
  cy = 1160,
  every = 36,
  speed = 6,
  width = 28,
  maxR = 2100,
  opacity = 0.9,
  r0 = 430,
  sun = true,
}) => {
  const colors = [C.violet, C.magenta, C.amber, C.violet];
  const life = (maxR - r0) / speed;
  const n = Math.ceil(life / every) + 1;
  const k0 = Math.floor(f / every);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const k = k0 - i;
        const age = f - k * every;
        const r = r0 + age * speed;
        if (age < 0 || r > maxR) return null;
        const idx = ((k % 4) + 4) % 4;
        const c = colors[idx];
        const o = opacity * Math.min(1, age / 24) * (1 - Math.max(0, (r - maxR * 0.7) / (maxR * 0.3)));
        return (
          <g key={k} opacity={o}>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={c} strokeWidth={width} opacity={0.5} />
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={c} strokeWidth={width * 0.3} />
            {idx === 3 ? <circle cx={cx} cy={cy} r={r + width * 0.9} fill="none" stroke={C.vermilion} strokeWidth={2.5} /> : null}
          </g>
        );
      })}
      {sun ? (
        <g>
          <CoronaHalo f={f} cx={cx} cy={cy} R={r0} extent={260} loops={3} a0={-175} a1={-95} rays={false} />
          <defs>
            <radialGradient id="l16cardSun">
              {sunGradient(r0).map(([o, c], i) => (
                <stop key={i} offset={o} stopColor={c} />
              ))}
            </radialGradient>
          </defs>
          <circle cx={cx} cy={cy} r={r0} fill="url(#l16cardSun)" />
        </g>
      ) : null}
    </g>
  );
};

const TwinkleStars: React.FC<{ f: number; n?: number; seed?: number }> = ({ f, n = 80, seed = 5 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const u = ((i * 9301 + seed * 49297) % 233280) / 233280;
      const v = ((i * 7919 + seed * 104729) % 10007) / 10007;
      const tw = 0.45 + 0.55 * Math.abs(Math.sin(f / (9 + (i % 7) * 3) + i));
      return <circle key={i} cx={u * 1920} cy={v * 900} r={1 + (i % 3) * 0.7} fill={STAR_TINTS[i % STAR_TINTS.length]} opacity={tw} />;
    })}
  </g>
);

export const L16Card: React.FC<{
  family: Family;
  kicker?: string;
  title: string;
  t: number;
  frame: number;
  sub?: string;
  align?: "start" | "middle";
  behind?: (frame: number) => React.ReactNode;
  scrim?: number;
}> = ({ family: F, kicker, title, t, frame, sub, align = "start", behind, scrim = 0.55 }) => {
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
  const y0 = 470 - ((lines.length - 1) * size * 0.98) / 2 + size * 0.35;
  return (
    <Stage theme={F.theme} drift={false} vignette={F.dark ? 0.3 : 0.1} grain={0.4}>
      <Sky family={F} />
      <TwinkleStars f={frame} />
      {behind ? behind(frame) : <HeatRings f={frame} />}
      <Vignette color={F.shadow} strength={F.dark ? 0.3 : 0.12} />
      {scrim > 0 ? (
        <g opacity={a}>
          <radialGradient id="l16cardScrim" cx="0.3" cy="0.45" r="0.6">
            <stop offset="0" stopColor={F.shadow} stopOpacity={scrim} />
            <stop offset="1" stopColor={F.shadow} stopOpacity={0} />
          </radialGradient>
          <rect x={0} y={0} width={1920} height={1080} fill="url(#l16cardScrim)" />
        </g>
      ) : null}
      <g opacity={a} transform={`translate(0 ${rise.toFixed(2)})`}>
        {kicker ? <Kicker x={x} y={y0 - size * 1.05} text={kicker} color={F.dim} size={24} /> : null}
        {lines.map((l, i) => (
          <text key={i} x={x} y={y0 + i * size * 0.98} textAnchor={align} style={{ fontFamily: IF2.display, fontWeight: 800, fontSize: size, letterSpacing: -size * 0.03, fill: F.text }}>
            {l}
          </text>
        ))}
        <rect x={align === "start" ? x : x - 30} y={y0 + (lines.length - 1) * size * 0.98 + 34} width={60} height={6} rx={3} fill={C.gold} />
        {sub ? (
          <text x={x} y={y0 + (lines.length - 1) * size * 0.98 + 84} textAnchor={align} style={{ fontFamily: IF2.display, fontWeight: 500, fontSize: 30, fill: F.dim }}>
            {sub}
          </text>
        ) : null}
      </g>
    </Stage>
  );
};
