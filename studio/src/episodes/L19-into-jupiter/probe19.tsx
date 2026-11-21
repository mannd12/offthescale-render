// L19 the probe and the spacecraft symbols (BUILD.md §5 `probe19.tsx`; storyboard F1, F7, F15).
// The probe is a round shell with a boom, six instrument chips, a canopy and a shield plate; the orbiters are GENERIC symbols
// (no insignia, logos or patches; NASA / JPL appear only as words in pills). Nothing here is silver or grey: the shell is
// amber #FFB347 with a gold rim, the shield rust with a hot glow.
// USAGE (f = the shot's frame; x, y = centre)
//   <Capsule x y r?=60 f chips?={0..6 lit in a stagger (fractional fades the next)} dead?={0..6 chips gone dark, 5-04}
//            tilt?={deg} jerk?={0..1 a canopy-open jolt} glow?={0..1 the hot shell} />
//   <Canopy x y={the capsule centre} r?=60 unfurl={0..1} f sway?={deg amplitude, 6} />   drawn ABOVE the capsule; draw it first
//   <ShieldPlate x y r?=70 f glow?={0..1} tumble?={deg/f spin once released} />
//   <Flare x y r?=90 f angle?={deg, the direction of travel} strength?={0..1} />   the entry flare + a sparks trail (1-02)
//   <Orbiter x y kind="galileo"|"juno"|"voyager" f size?=1 dish?={"rings"|"data"|undefined} aim?={deg the dish points} />
//   <GhostProbe x y r?=60 f embers?={true} />   a dashed outline probe that sinks and sheds embers (5-07 to 5-09, Z-07)
import React from "react";
import { rnd } from "../../lib/illustrated";
import { L19_COLORS as C } from "./families";
import { Sparks } from "./flows19";
import { sm } from "./tags19";

const cl = (v: number) => Math.max(0, Math.min(1, v));

export const Capsule: React.FC<{ x: number; y: number; r?: number; f: number; chips?: number; dead?: number; tilt?: number; jerk?: number; glow?: number }> = ({
  x,
  y,
  r = 60,
  f,
  chips = 0,
  dead = 0,
  tilt = 0,
  jerk = 0,
  glow = 0,
}) => {
  const j = Math.sin(cl(jerk) * Math.PI) * r * 0.25;
  return (
    <g transform={`translate(${x} ${y - j}) rotate(${tilt})`}>
      {glow > 0 ? <circle r={r * 1.8} fill={C.glow} opacity={0.25 * glow} /> : null}
      <ellipse cx={6} cy={10} rx={r} ry={r * 0.86} fill="#1A0402" opacity={0.3} />
      {/* boom */}
      <rect x={-r * 0.05} y={-r * 1.45} width={r * 0.1} height={r * 0.6} fill={C.goldRim} />
      <circle cx={0} cy={-r * 1.5} r={r * 0.1} fill={C.goldHot} />
      {/* shell */}
      <ellipse rx={r} ry={r * 0.86} fill={C.probe} />
      <ellipse cx={r * 0.18} cy={r * 0.2} rx={r * 0.8} ry={r * 0.62} fill="#E07A1C" opacity={0.45} />
      <ellipse cx={-r * 0.3} cy={-r * 0.3} rx={r * 0.38} ry={r * 0.26} fill="#FFE8B0" opacity={0.7} />
      <ellipse rx={r} ry={r * 0.86} fill="none" stroke={C.goldRim} strokeWidth={r * 0.07} />
      {/* six instrument chips in a band */}
      {Array.from({ length: 6 }, (_, i) => {
        const on = cl(chips - i) * (1 - cl(dead - (5 - i)));
        const cx = -r * 0.62 + i * r * 0.25;
        return (
          <g key={i}>
            <rect x={cx - r * 0.09} y={r * 0.05} width={r * 0.18} height={r * 0.2} rx={r * 0.04} fill="#5A1206" />
            {on > 0 ? <rect x={cx - r * 0.09} y={r * 0.05} width={r * 0.18} height={r * 0.2} rx={r * 0.04} fill={C.heard} opacity={on * (0.8 + 0.2 * Math.sin(f * 0.5 + i))} /> : null}
          </g>
        );
      })}
    </g>
  );
};

export const Canopy: React.FC<{ x: number; y: number; r?: number; unfurl: number; f: number; sway?: number }> = ({ x, y, r = 60, unfurl, f, sway = 6 }) => {
  const u = sm(unfurl);
  if (u <= 0) return null;
  const W = r * 3.2 * (0.25 + 0.75 * u);
  const top = y - r * 1.4 - r * 2.6 * u;
  const rot = Math.sin(f * 0.12) * sway * u;
  const lines = [-0.5, -0.17, 0.17, 0.5];
  return (
    <g transform={`rotate(${rot.toFixed(2)} ${x} ${y - r * 0.6})`}>
      {lines.map((k) => (
        <line key={k} x1={x + k * W * 0.9} y1={top + r * 0.4} x2={x} y2={y - r * 0.8} stroke={C.goldRim} strokeWidth={3} />
      ))}
      <path d={`M${x - W / 2} ${top + r * 0.5} Q${x} ${top - r * 0.9 * u} ${x + W / 2} ${top + r * 0.5} Q${x + W / 4} ${top + r * 0.2} ${x} ${top + r * 0.5} Q${x - W / 4} ${top + r * 0.2} ${x - W / 2} ${top + r * 0.5} Z`} fill={C.goldHot} />
      <path d={`M${x} ${top - r * 0.2 * u} Q${x + W * 0.2} ${top} ${x + W / 4} ${top + r * 0.3}`} fill="none" stroke={C.glow} strokeWidth={r * 0.12} opacity={0.6} />
      <path d={`M${x - W / 2} ${top + r * 0.5} Q${x} ${top - r * 0.9 * u} ${x + W / 2} ${top + r * 0.5}`} fill="none" stroke={C.goldRim} strokeWidth={4} />
    </g>
  );
};

export const ShieldPlate: React.FC<{ x: number; y: number; r?: number; f: number; glow?: number; tumble?: number }> = ({ x, y, r = 70, f, glow = 0, tumble = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${(f * tumble) % 360})`}>
    {glow > 0 ? <ellipse rx={r * 1.6} ry={r * 0.9} fill={C.glow} opacity={0.35 * glow * (0.8 + 0.2 * Math.sin(f * 0.6))} /> : null}
    <path d={`M${-r} ${-r * 0.1} Q0 ${r * 0.9} ${r} ${-r * 0.1} Q0 ${r * 0.35} ${-r} ${-r * 0.1} Z`} fill={C.stripeRust} />
    <path d={`M${-r * 0.9} ${0} Q0 ${r * 0.75} ${r * 0.9} 0`} fill="none" stroke={glow > 0 ? C.goldHot : C.goldRim} strokeWidth={r * 0.1} opacity={0.4 + 0.6 * glow} />
  </g>
);

export const Flare: React.FC<{ x: number; y: number; r?: number; f: number; angle?: number; strength?: number }> = ({ x, y, r = 90, f, angle = 35, strength = 1 }) => {
  const id = "flare" + React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const s = cl(strength);
  const flick = 0.85 + 0.15 * Math.sin(f * 1.3) * Math.sin(f * 0.7);
  return (
    <g>
      <defs>
        <radialGradient id={id}>
          <stop offset="0" stopColor="#FFF6C8" stopOpacity={1} />
          <stop offset="0.35" stopColor={C.flare} stopOpacity={0.85} />
          <stop offset="0.7" stopColor={C.glow} stopOpacity={0.35} />
          <stop offset="1" stopColor={C.glow} stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* the streak behind (opposite the travel direction) */}
      <g transform={`translate(${x} ${y}) rotate(${angle + 180})`} opacity={s}>
        <path d={`M0 ${-r * 0.5} L${r * 6} ${-r * 0.08} L${r * 6} ${r * 0.08} L0 ${r * 0.5} Z`} fill={C.glow} opacity={0.5} />
        <path d={`M0 ${-r * 0.22} L${r * 5} 0 L0 ${r * 0.22} Z`} fill={C.goldHot} opacity={0.8} />
      </g>
      <Sparks f={f} x={x} y={y} w={r * 6} h={r * 1.6} n={Math.round(50 * s)} speed={30} mode="trail" angle={angle + 180} />
      <circle cx={x} cy={y} r={r * 2.2 * flick * (0.4 + 0.6 * s)} fill={`url(#${id})`} />
    </g>
  );
};

/** Generic orbiters: galileo = a big dish + boom; juno = three long panels; voyager = a dish + a long boom. No insignia. */
export const Orbiter: React.FC<{ x: number; y: number; kind: "galileo" | "juno" | "voyager"; f: number; size?: number; dish?: "rings" | "data"; aim?: number }> = ({
  x,
  y,
  kind,
  f,
  size = 1,
  dish,
  aim = 0,
}) => {
  const s = size;
  const spin = kind === "juno" ? (f * 2) % 360 : Math.sin(f * 0.05) * 4;
  return (
    <g transform={`translate(${x} ${y})`}>
      {dish === "rings"
        ? [0, 1, 2, 3].map((k) => {
            const p = ((f / 30 + k / 4) % 1);
            return <circle key={k} cx={Math.cos((aim * Math.PI) / 180) * 40 * s} cy={Math.sin((aim * Math.PI) / 180) * 40 * s} r={30 * s + p * 220 * s} fill="none" stroke={C.starAqua} strokeWidth={6 * s * (1 - p)} opacity={1 - p} />;
          })
        : null}
      {dish === "data"
        ? Array.from({ length: 8 }, (_, k) => {
            const p = (f / 24 + k / 8) % 1;
            const d = 60 * s + p * 420 * s;
            return <circle key={k} cx={Math.cos((aim * Math.PI) / 180) * d} cy={Math.sin((aim * Math.PI) / 180) * d} r={7 * s} fill={C.heard} opacity={1 - p * 0.7} />;
          })
        : null}
      <g transform={`rotate(${spin})`}>
        {kind === "juno"
          ? [0, 120, 240].map((a) => (
              <g key={a} transform={`rotate(${a})`}>
                <rect x={30 * s} y={-14 * s} width={150 * s} height={28 * s} rx={4 * s} fill={C.modelDeep} stroke={C.gold} strokeWidth={3 * s} />
                {[1, 2, 3, 4].map((k) => (
                  <line key={k} x1={30 * s + k * 30 * s} y1={-14 * s} x2={30 * s + k * 30 * s} y2={14 * s} stroke={C.model} strokeWidth={2 * s} />
                ))}
              </g>
            ))
          : null}
        {kind === "voyager" ? <rect x={0} y={-4 * s} width={170 * s} height={8 * s} fill={C.goldRim} /> : null}
        {kind === "galileo" ? <rect x={-6 * s} y={0} width={12 * s} height={110 * s} fill={C.goldRim} /> : null}
        <rect x={-30 * s} y={-24 * s} width={60 * s} height={48 * s} rx={8 * s} fill={C.probe} stroke={C.goldRim} strokeWidth={4 * s} />
        {kind !== "juno" ? (
          <g transform={`rotate(${aim} 0 0)`}>
            <path d={`M${20 * s} ${-60 * s} Q${70 * s} 0 ${20 * s} ${60 * s} Z`} fill={C.gold} stroke={C.goldRim} strokeWidth={4 * s} />
            <line x1={34 * s} y1={0} x2={70 * s} y2={0} stroke={C.goldRim} strokeWidth={4 * s} />
          </g>
        ) : null}
      </g>
    </g>
  );
};

/** The dashed ghost probe (after the signal ends: a model, never heard). */
export const GhostProbe: React.FC<{ x: number; y: number; r?: number; f: number; embers?: boolean }> = ({ x, y, r = 60, f, embers = true }) => (
  <g>
    {embers
      ? Array.from({ length: 22 }, (_, i) => {
          const life = 60;
          const age = (f + rnd(i) * life) % life;
          const a = age / life;
          const ex = x + (rnd(i * 3) - 0.5) * r * 2 + Math.sin(age / 7 + i) * 8;
          const ey = y - r * 0.3 - age * (2 + rnd(i * 5) * 2);
          return <circle key={i} cx={ex} cy={ey} r={(3 + rnd(i * 7) * 3) * (1 - a)} fill={i % 2 ? C.goldHot : C.glow} opacity={1 - a} />;
        })
      : null}
    <ellipse cx={x} cy={y} rx={r * 1.25} ry={r * 1.1} fill={C.model} opacity={0.18 + 0.06 * Math.sin(f * 0.2)} />
    <ellipse cx={x} cy={y} rx={r} ry={r * 0.86} fill="rgba(58,168,224,0.2)" stroke={C.model} strokeWidth={6} strokeDasharray="16 10" strokeDashoffset={-f * 2} />
    <line x1={x} y1={y - r * 0.86} x2={x} y2={y - r * 1.45} stroke={C.model} strokeWidth={5} strokeDasharray="8 6" />
    <rect x={x - r * 0.62} y={y + r * 0.05} width={r * 1.24} height={r * 0.2} rx={r * 0.05} fill="none" stroke={C.modelLabel} strokeWidth={3} strokeDasharray="6 5" />
  </g>
);
