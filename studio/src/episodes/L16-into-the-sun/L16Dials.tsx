// L16Dials: the episode's three dials (BUILD.md §5), at frame LEFT (x ≈ 70-560, y ≈ 700-1010; keep subjects right of
// x = 600 in those shots). NOT L15's four-gauge column (F11). Three visually distinct bold faces (2026-11-14 art-director
// pass: ONE readable label per dial, thick arcs and needles, at most one named mark; legible at phone width):
//   DISTANCE  a 200° arc; three unlabelled marks (18.8 Alfvén, about 9, surface), the one named mark SURFACE; a probe-dot
//             rides the arc at the needle
//   HEAT      a 270° colour band violet → amber → gold; the one named mark HOT at the stop; pinned = rattle ±5° at 10 Hz
//             (heat is never an alarm, F8: no red flash, no melting)
//   ENERGY    C-06 only: label ENERGY, a 120° fan with a tall saffron stop; the needle swings to it
// Readouts are strings that go through assertAllowed (sundata.ts); with no readout nothing numeric is drawn. Needles
// and fills vermilion, end-stops saffron.
// USAGE
//   <L16DialsHUD f={f} family={F} distance={{ value: distanceValue(radii) }} heat={{ value: 0.4, readout: READ.coronaC.text }}
//                theme?="dark|light" compact? only?={["heat"]} x?=70 y?=700 />           (last, inside <Stage>)
//   <L16Dials …same… />                     the cluster without its own Layer (for plates / insets)
//   <DistanceDial|HeatDial|EnergyDial x y f family s={state} theme? scale? />   one dial alone (studio plates)
//   distanceValue(radiiAboveSurface)        → 0..1 needle position (1 = SURFACE; log scale out to 1 AU, no numerals)
//   state: { value 0..1, readout?: string | null, pinned?, appear? 0..1, ghost? 0..1 (a dashed second needle) }
import React from "react";
import { Family, IF2, Layer, P, alpha, labelCase, mixHex } from "../../lib/illustrated";
import { L16_COLORS } from "./families";
import { RADII, assertAllowed } from "./sundata";

const C = L16_COLORS;
const D2R = Math.PI / 180;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const rattle = (f: number) => Math.sin(((f * 2 * Math.PI) / 3)) * 5; // ±5° at 10 Hz (30 fps)

export type DialState = { value: number; readout?: string | null; pinned?: boolean; appear?: number; ghost?: number };
type Theme = "dark" | "light";

/** Needle position for a distance in solar radii above the surface: 1 at the surface, 0 at 1 AU (log scale). */
export const distanceValue = (radiiAbove: number) => 1 - Math.log(1 + Math.max(0, radiiAbove)) / Math.log(1 + RADII.au);

type Ink = { plate: string; edge: string; ink: string; dim: string; face: Family };
const inkOf = (F: Family, theme: Theme): Ink => {
  const dark = theme === "dark";
  const plate = dark ? alpha(mixHex(F.shadow, C.indigo, 0.4), 0.9) : alpha(mixHex(F.light, C.violet, 0.55), 0.22);
  const ink = dark ? "#FFF4E0" : "#FFF8EC";
  const dim = dark ? C.lavender : "#FFE6F4";
  return { plate, edge: alpha(ink, dark ? 0.35 : 0.65), ink, dim, face: { ...F, text: ink, dim, shadow: dark ? "#0B0828" : mixHex(C.violet, "#000000", 0.35) } };
};
const themeOf = (F: Family, t?: Theme): Theme => t ?? (F.dark ? "light" : "dark");

/** One readable label per dial (art director 2026-11-14: the micro labels were illegible at phone width). */
const Title: React.FC<{ x: number; y: number; text: string; ink: Ink; anchor?: "start" | "middle" }> = ({ x, y, text, ink, anchor = "middle" }) => (
  <text x={x} y={y} textAnchor={anchor} style={{ fontFamily: IF2.label, fontSize: 36, letterSpacing: 2.5, fill: ink.ink }}>
    {labelCase(text)}
  </text>
);

/** The readout slab: a vermilion pill with the exact string (units keep their case: no labelCase). */
const Slab: React.FC<{ x: number; y: number; text: string; who: string; size?: number }> = ({ x, y, text, who, size = 24 }) => {
  assertAllowed(text, who);
  const fs = Math.min(size, 200 / Math.max(1, text.length * 0.56));
  const w = text.length * fs * 0.56 + 24;
  return (
    <g>
      <rect x={x - w / 2 + 3} y={y - fs * 0.95 + 4} width={w} height={fs * 1.36} rx={fs * 0.26} fill="#000" opacity={0.28} />
      <rect x={x - w / 2} y={y - fs * 0.95} width={w} height={fs * 1.36} rx={fs * 0.26} fill={P.vermilion} />
      <text x={x} y={y} textAnchor="middle" style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: fs, fill: P.bone, fontVariantNumeric: "tabular-nums" }}>
        {text}
      </text>
    </g>
  );
};

const arcD = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p = (a: number) => `${(cx + Math.cos(a * D2R) * r).toFixed(1)} ${(cy + Math.sin(a * D2R) * r).toFixed(1)}`;
  return `M${p(a0)} A${r} ${r} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} 1 ${p(a1)}`;
};

/** The shared bold face: backdrop disc and a thick track. */
const Face: React.FC<{ cx: number; cy: number; r: number; a0: number; a1: number; ink: Ink }> = ({ cx, cy, r, a0, a1, ink }) => (
  <g>
    <circle cx={cx} cy={cy} r={r + 18} fill={alpha(ink.face.shadow, 0.6)} />
    <path d={arcD(cx, cy, r, a0, a1)} fill="none" stroke={ink.dim} strokeWidth={16} strokeLinecap="round" opacity={0.35} />
  </g>
);
/** A thick vermilion needle with a bone edge and hub (a small wobble keeps it alive). */
const Needle: React.FC<{ cx: number; cy: number; L: number; a: number; f: number }> = ({ cx, cy, L, a, f }) => {
  const aa = (a + Math.sin(f / 4) * 0.8) * D2R;
  const x2 = cx + Math.cos(aa) * L;
  const y2 = cy + Math.sin(aa) * L;
  return (
    <g>
      <line x1={cx} y1={cy} x2={x2} y2={y2} stroke={P.bone} strokeWidth={13} strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={x2} y2={y2} stroke={P.vermilion} strokeWidth={8} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={14} fill={P.vermilion} stroke={P.bone} strokeWidth={3} />
    </g>
  );
};
const Ghost: React.FC<{ cx: number; cy: number; L: number; a: number; ink: Ink }> = ({ cx, cy, L, a, ink }) => (
  <line x1={cx} y1={cy} x2={cx + Math.cos(a * D2R) * L} y2={cy + Math.sin(a * D2R) * L} stroke={ink.ink} strokeWidth={6} strokeDasharray="10 8" opacity={0.55} strokeLinecap="round" />
);

type InnerP = { s: DialState; f: number; ink: Ink };
const W = 230;
const H = 300;

// ---------------------------------------------------------------------------------------------------------------
// DISTANCE: 200° arc; three unlabelled marks (18.8 Alfvén, about 9, surface); one named mark: SURFACE
// ---------------------------------------------------------------------------------------------------------------
const DistanceInner: React.FC<InnerP> = ({ s, f, ink }) => {
  const cx = W / 2;
  const cy = 172;
  const r = 78;
  const sweep = 200;
  const a0 = 90 + (360 - sweep) / 2; // 170° (left) … 370° (right)
  const ang = (v: number) => a0 + cl(v) * sweep;
  const val = cl(s.value);
  const marks = [distanceValue(RADII.alfven), distanceValue(RADII.pass), 1];
  const tip = ang(val) * D2R;
  return (
    <g>
      <Title x={cx} y={46} text="distance" ink={ink} />
      <Face cx={cx} cy={cy} r={r} a0={a0} a1={a0 + sweep} ink={ink} />
      {/* the warm end (the Sun side) */}
      <path d={arcD(cx, cy, r, ang(0.82), ang(1))} fill="none" stroke={C.gold} strokeWidth={16} strokeLinecap="round" opacity={0.85} />
      {val > 0.01 ? <path d={arcD(cx, cy, r, a0, ang(val))} fill="none" stroke={P.vermilion} strokeWidth={16} strokeLinecap="round" /> : null}
      {marks.map((v, i) => {
        const a = ang(v) * D2R;
        return <line key={i} x1={cx + Math.cos(a) * (r - 20)} y1={cy + Math.sin(a) * (r - 20)} x2={cx + Math.cos(a) * (r + 14)} y2={cy + Math.sin(a) * (r + 14)} stroke={i === 2 ? C.gold : C.saffron} strokeWidth={7} strokeLinecap="round" />;
      })}
      <text x={cx + r + 20} y={cy + 46} textAnchor="end" style={{ fontFamily: IF2.label, fontSize: 22, letterSpacing: 1.5, fill: C.gold }}>
        SURFACE
      </text>
      {s.ghost != null ? <Ghost cx={cx} cy={cy} L={r * 0.8} a={ang(s.ghost)} ink={ink} /> : null}
      <Needle cx={cx} cy={cy} L={r * 0.82} a={ang(val)} f={f} />
      {/* the probe-dot riding the arc at the needle (blinks like the probe's beacon) */}
      <circle cx={cx + Math.cos(tip) * r} cy={cy + Math.sin(tip) * r} r={10} fill={C.teal} stroke={C.bone} strokeWidth={3} opacity={0.65 + 0.35 * Math.max(0, Math.cos(((f % 36) / 36) * Math.PI * 2))} />
      {s.readout ? <Slab x={cx} y={H - 20} text={s.readout} who="DISTANCE readout" size={24} /> : null}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// HEAT: 270° colour band violet → amber → gold; one named mark: HOT at the stop
// ---------------------------------------------------------------------------------------------------------------
const HEAT_STOPS: [number, string][] = [
  [0, C.violet],
  [0.5, C.amber],
  [1, C.gold],
];
const HeatInner: React.FC<InnerP & { gid: string }> = ({ s, f, ink }) => {
  const cx = W / 2;
  const cy = 170;
  const r = 78;
  const sweep = 270;
  const a0 = 135;
  const ang = (v: number) => a0 + cl(v, 0, 1.05) * sweep;
  const val = s.pinned ? 1 + rattle(f) / sweep : cl(s.value);
  const segs = 14;
  return (
    <g>
      <Title x={cx} y={46} text="heat" ink={ink} />
      <Face cx={cx} cy={cy} r={r} a0={a0} a1={a0 + sweep} ink={ink} />
      {Array.from({ length: segs }, (_, i) => {
        const u0 = i / segs;
        const u1 = (i + 0.8) / segs;
        const u = (u0 + u1) / 2;
        const col = u < 0.5 ? mixHex(HEAT_STOPS[0][1], HEAT_STOPS[1][1], u / 0.5) : mixHex(HEAT_STOPS[1][1], HEAT_STOPS[2][1], (u - 0.5) / 0.5);
        const lit = u <= val;
        return <path key={i} d={arcD(cx, cy, r, ang(u0), ang(u1))} fill="none" stroke={col} strokeWidth={lit ? 18 : 10} opacity={lit ? 1 : 0.4} />;
      })}
      {/* saffron end-stop + its one label */}
      <line x1={cx + Math.cos(ang(1) * D2R) * (r - 14)} y1={cy + Math.sin(ang(1) * D2R) * (r - 14)} x2={cx + Math.cos(ang(1) * D2R) * (r + 22)} y2={cy + Math.sin(ang(1) * D2R) * (r + 22)} stroke={C.saffron} strokeWidth={9} strokeLinecap="round" />
      <text x={cx + 30} y={cy + 66} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 22, letterSpacing: 1.5, fill: C.gold }}>
        HOT
      </text>
      {s.ghost != null ? <Ghost cx={cx} cy={cy} L={r * 0.8} a={ang(s.ghost)} ink={ink} /> : null}
      <Needle cx={cx} cy={cy} L={r * 0.82} a={ang(val)} f={f} />
      {s.readout ? <Slab x={cx} y={H - 20} text={s.readout} who="HEAT readout" size={24} /> : null}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// ENERGY (C-06): 120° fan, tall saffron stop; label ENERGY
// ---------------------------------------------------------------------------------------------------------------
const EnergyInner: React.FC<InnerP> = ({ s, f, ink }) => {
  const cx = W / 2;
  const cy = 222;
  const r = 132;
  const a0 = 210;
  const sweep = 120;
  const ang = (v: number) => a0 + cl(v, 0, 1.04) * sweep;
  const val = s.pinned ? 1.02 + Math.sin(f * 2.1) * 0.012 : cl(s.value);
  const fan = (v: number) => {
    const p = (a: number, rr: number) => `${(cx + Math.cos(a * D2R) * rr).toFixed(1)} ${(cy + Math.sin(a * D2R) * rr).toFixed(1)}`;
    return `M${p(a0, 30)} L${p(a0, r)} A${r} ${r} 0 0 1 ${p(ang(v), r)} L${p(ang(v), 30)} A30 30 0 0 0 ${p(a0, 30)} Z`;
  };
  return (
    <g>
      <Title x={cx} y={46} text="energy" ink={ink} />
      <path d={fan(1)} fill={alpha(ink.face.shadow, 0.6)} stroke={ink.edge} strokeWidth={2} />
      {val > 0.01 ? <path d={fan(Math.min(val, 1))} fill={alpha(P.vermilion, 0.9)} /> : null}
      <line x1={cx + Math.cos(ang(1) * D2R) * 24} y1={cy + Math.sin(ang(1) * D2R) * 24} x2={cx + Math.cos(ang(1) * D2R) * (r + 24)} y2={cy + Math.sin(ang(1) * D2R) * (r + 24)} stroke={C.saffron} strokeWidth={12} strokeLinecap="round" />
      <Needle cx={cx} cy={cy} L={r + 6} a={ang(val)} f={f} />
      {s.readout ? <Slab x={cx} y={H - 20} text={s.readout} who="ENERGY readout" size={24} /> : null}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// standalone + cluster
// ---------------------------------------------------------------------------------------------------------------
export type DialId = "distance" | "heat" | "energy";
type AloneP = { x: number; y: number; f: number; family: Family; s: DialState; theme?: Theme; scale?: number; plate?: boolean };
const Plate: React.FC<{ ink: Ink }> = ({ ink }) => <rect x={0} y={0} width={W} height={H} rx={24} fill={ink.plate} stroke={ink.edge} strokeWidth={2} />;

export const DistanceDial: React.FC<AloneP> = ({ x, y, f, family, s, theme, scale = 1, plate = true }) => {
  const ink = inkOf(family, themeOf(family, theme));
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {plate ? <Plate ink={ink} /> : null}
      <DistanceInner s={s} f={f} ink={ink} />
    </g>
  );
};
export const HeatDial: React.FC<AloneP> = ({ x, y, f, family, s, theme, scale = 1, plate = true }) => {
  const ink = inkOf(family, themeOf(family, theme));
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {plate ? <Plate ink={ink} /> : null}
      <HeatInner s={s} f={f} ink={ink} gid={`heat${Math.round(x)}${Math.round(y)}`} />
    </g>
  );
};
export const EnergyDial: React.FC<AloneP> = ({ x, y, f, family, s, theme, scale = 1, plate = true }) => {
  const ink = inkOf(family, themeOf(family, theme));
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {plate ? <Plate ink={ink} /> : null}
      <EnergyInner s={s} f={f} ink={ink} />
    </g>
  );
};

export type L16DialsProps = {
  f: number;
  family: Family;
  distance?: DialState;
  heat?: DialState;
  /** C-06 only: slides in to the right of the other two */
  energy?: DialState;
  theme?: Theme;
  compact?: boolean;
  only?: DialId[];
  /** cluster origin (left, top) */
  x?: number;
  y?: number;
  opacity?: number;
};

export const L16Dials: React.FC<L16DialsProps> = ({ f, family, distance = { value: 0 }, heat = { value: 0 }, energy, theme, compact = false, only, x = 70, y = 700, opacity = 1 }) => {
  const ink = inkOf(family, themeOf(family, theme));
  const ids: DialId[] = (["distance", "heat", "energy"] as DialId[]).filter((d) => (only ? only.includes(d) : d !== "energy" || energy != null));
  const k = compact ? 0.78 : 1;
  const gap = 18;
  return (
    <g opacity={opacity} transform={`translate(${x} ${y + (compact ? H * (1 - k) : 0)}) scale(${k})`}>
      {ids.map((d, i) => {
        const s = d === "distance" ? distance : d === "heat" ? heat : (energy ?? { value: 0 });
        const a = cl(s.appear ?? 1);
        return (
          <g key={d} opacity={a} transform={`translate(${i * (W + gap)} ${(1 - a) * 40})`}>
            <Plate ink={ink} />
            {d === "distance" ? <DistanceInner s={s} f={f} ink={ink} /> : d === "heat" ? <HeatInner s={s} f={f} ink={ink} gid={`heatc${i}`} /> : <EnergyInner s={s} f={f} ink={ink} />}
          </g>
        );
      })}
    </g>
  );
};

/** The cluster on its own screen-locked layer: drop it inside a <Stage>, last. */
export const L16DialsHUD: React.FC<L16DialsProps> = (p) => (
  <Layer depth={0}>
    <L16Dials {...p} />
  </Layer>
);
