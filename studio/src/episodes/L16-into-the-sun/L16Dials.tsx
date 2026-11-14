// L16Dials: the episode's three dials (BUILD.md §5), at frame LEFT (x ≈ 70-560, y ≈ 700-1010; keep subjects right of
// x = 600 in those shots). NOT L15's four-gauge column (F11). Three visually distinct faces on kit `Dial`:
//   DISTANCE  a 200° arc in solar radii ABOVE THE SURFACE, ticks only at SURFACE · ABOUT 9 · 18.8 ALFVÉN (no other
//             numerals); a probe-dot rides the needle tip
//   HEAT      a 270° arc of the words COOL · WARM · HOT on a violet → amber → gold band; at the stop the needle rattles
//             ±5° at 10 Hz (`pinned`), heat is never an alarm (F8: no red flash, no melting)
//   ENERGY    C-06 only: ENERGY TO GET HERE, a 120° fan with a tall saffron stop; the needle swings to it
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
import { Dial, Family, IF2, Layer, P, alpha, labelCase, mixHex } from "../../lib/illustrated";
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

const Title: React.FC<{ x: number; y: number; text: string; ink: Ink; anchor?: "start" | "middle" }> = ({ x, y, text, ink, anchor = "middle" }) => (
  <text x={x} y={y} textAnchor={anchor} style={{ fontFamily: IF2.label, fontSize: 19, letterSpacing: 3.5, fill: ink.ink }}>
    {labelCase(text)}
  </text>
);

/** The readout slab: a vermilion pill with the exact string (units keep their case: no labelCase). */
const Slab: React.FC<{ x: number; y: number; text: string; who: string; size?: number }> = ({ x, y, text, who, size = 24 }) => {
  assertAllowed(text, who);
  const w = text.length * size * 0.56 + 26;
  return (
    <g>
      <rect x={x - w / 2} y={y - size * 0.95} width={w} height={size * 1.32} rx={size * 0.24} fill={P.vermilion} />
      <text x={x} y={y} textAnchor="middle" style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: size, fill: P.bone, fontVariantNumeric: "tabular-nums" }}>
        {text}
      </text>
    </g>
  );
};

const arcD = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p = (a: number) => `${(cx + Math.cos(a * D2R) * r).toFixed(1)} ${(cy + Math.sin(a * D2R) * r).toFixed(1)}`;
  return `M${p(a0)} A${r} ${r} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} 1 ${p(a1)}`;
};

type InnerP = { s: DialState; f: number; ink: Ink };
const W = 230;
const H = 300;

// ---------------------------------------------------------------------------------------------------------------
// DISTANCE: 200° arc, three named ticks
// ---------------------------------------------------------------------------------------------------------------
const DistanceInner: React.FC<InnerP> = ({ s, f, ink }) => {
  const cx = W / 2;
  const cy = 160;
  const r = 86;
  const sweep = 200;
  const a0 = 90 + (360 - sweep) / 2; // 170° (left) … 370° (right)
  const ang = (v: number) => a0 + cl(v) * sweep;
  const val = cl(s.value);
  const marks: [number, string][] = [
    [distanceValue(RADII.alfven), "18.8 ALFVÉN"],
    [distanceValue(RADII.pass), "ABOUT 9"],
    [1, "SURFACE"],
  ];
  const tip = ang(val) * D2R;
  return (
    <g>
      <Title x={cx} y={36} text="distance" ink={ink} />
      <text x={cx} y={56} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 11, letterSpacing: 2, fill: ink.dim }}>
        {labelCase("sun-radii above the surface")}
      </text>
      <Dial x={cx} y={cy} r={r} value={val} min={0} max={1} sweep={sweep} family={ink.face} ticks={1} format={() => ""} frame={f} />
      {/* the travelled arc, vermilion */}
      {val > 0.01 ? <path d={arcD(cx, cy, r, a0, ang(val))} fill="none" stroke={P.vermilion} strokeWidth={8} strokeLinecap="round" opacity={0.9} /> : null}
      {/* the warm end of the arc (the Sun side) */}
      <path d={arcD(cx, cy, r + 13, ang(0.82), ang(1))} fill="none" stroke={C.gold} strokeWidth={6} strokeLinecap="round" />
      {marks.map(([v, label], i) => {
        const a = ang(v) * D2R;
        assertAllowed(label, "DISTANCE tick");
        const lx = cx + Math.cos(a) * (r - 30);
        const ly = cy + Math.sin(a) * (r - 30);
        return (
          <g key={label}>
            <line x1={cx + Math.cos(a) * (r - 14)} y1={cy + Math.sin(a) * (r - 14)} x2={cx + Math.cos(a) * (r + 6)} y2={cy + Math.sin(a) * (r + 6)} stroke={i === 2 ? C.gold : C.saffron} strokeWidth={5} strokeLinecap="round" />
            <text x={lx} y={ly + 5 + (i === 2 ? 14 : 0)} textAnchor={i === 2 ? "end" : "middle"} style={{ fontFamily: IF2.label, fontSize: 12, letterSpacing: 1.2, fill: i === 2 ? C.gold : ink.ink }}>
              {label}
            </text>
          </g>
        );
      })}
      {s.ghost != null ? (
        <line x1={cx} y1={cy} x2={cx + Math.cos(ang(s.ghost) * D2R) * r * 0.78} y2={cy + Math.sin(ang(s.ghost) * D2R) * r * 0.78} stroke={ink.ink} strokeWidth={4} strokeDasharray="7 6" opacity={0.55} />
      ) : null}
      {/* the probe-dot riding the needle tip (blinks like the probe's beacon) */}
      <circle cx={cx + Math.cos(tip) * (r + 13)} cy={cy + Math.sin(tip) * (r + 13)} r={7} fill={C.teal} stroke={C.bone} strokeWidth={2} opacity={0.6 + 0.4 * Math.max(0, Math.cos(((f % 36) / 36) * Math.PI * 2))} />
      {s.readout ? <Slab x={cx} y={H - 28} text={s.readout} who="DISTANCE readout" size={20} /> : null}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// HEAT: 270° word band COOL · WARM · HOT
// ---------------------------------------------------------------------------------------------------------------
const HEAT_STOPS: [number, string][] = [
  [0, C.violet],
  [0.5, C.amber],
  [1, C.gold],
];
const HeatInner: React.FC<InnerP & { gid: string }> = ({ s, f, ink, gid }) => {
  const cx = W / 2;
  const cy = 158;
  const r = 84;
  const sweep = 270;
  const a0 = 90 + (360 - sweep * 1.05) / 2; // matches the kit Dial below (max 1.05 over 283.5°): 1 = the stop
  const ang = (v: number) => a0 + cl(v, 0, 1.05) * sweep;
  const val = s.pinned ? 1 + rattle(f) / sweep : cl(s.value);
  const segs = 18;
  return (
    <g>
      <Title x={cx} y={36} text="heat" ink={ink} />
      <Dial x={cx} y={cy} r={r} value={cl(val, 0, 1.05)} min={0} max={1.05} sweep={sweep * 1.05} family={ink.face} ticks={1} format={() => ""} frame={f} />
      {/* the word band: segmented, violet → amber → gold */}
      {Array.from({ length: segs }, (_, i) => {
        const u0 = i / segs;
        const u1 = (i + 0.82) / segs;
        const u = (u0 + u1) / 2;
        const col = u < 0.5 ? mixHex(HEAT_STOPS[0][1], HEAT_STOPS[1][1], u / 0.5) : mixHex(HEAT_STOPS[1][1], HEAT_STOPS[2][1], (u - 0.5) / 0.5);
        const lit = u <= val;
        return <path key={i} d={arcD(cx, cy, r + 14, ang(u0), ang(u1))} fill="none" stroke={col} strokeWidth={lit ? 12 : 6} opacity={lit ? 1 : 0.45} />;
      })}
      {(
        [
          [0.08, "cool"],
          [0.5, "warm"],
          [0.92, "hot"],
        ] as [number, string][]
      ).map(([v, w]) => {
        const a = ang(v) * D2R;
        return (
          <text key={w} x={cx + Math.cos(a) * (r - 30)} y={cy + Math.sin(a) * (r - 30) + 5} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 13, letterSpacing: 1.6, fill: ink.ink }}>
            {labelCase(w)}
          </text>
        );
      })}
      {/* saffron end-stop */}
      <line x1={cx + Math.cos(ang(1) * D2R) * (r - 6)} y1={cy + Math.sin(ang(1) * D2R) * (r - 6)} x2={cx + Math.cos(ang(1) * D2R) * (r + 26)} y2={cy + Math.sin(ang(1) * D2R) * (r + 26)} stroke={C.saffron} strokeWidth={8} strokeLinecap="round" />
      {s.ghost != null ? (
        <line x1={cx} y1={cy} x2={cx + Math.cos(ang(s.ghost) * D2R) * r * 0.78} y2={cy + Math.sin(ang(s.ghost) * D2R) * r * 0.78} stroke={ink.ink} strokeWidth={4} strokeDasharray="7 6" opacity={0.55} />
      ) : null}
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
          {HEAT_STOPS.map(([o, c]) => (
            <stop key={o} offset={o} stopColor={c} />
          ))}
        </linearGradient>
      </defs>
      {s.readout ? <Slab x={cx} y={H - 28} text={s.readout} who="HEAT readout" size={20} /> : null}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// ENERGY (C-06): 120° fan, tall saffron stop
// ---------------------------------------------------------------------------------------------------------------
const EnergyInner: React.FC<InnerP> = ({ s, f, ink }) => {
  const cx = W / 2;
  const cy = 210;
  const r = 130;
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
      <Title x={cx} y={36} text="energy to get here" ink={ink} />
      <path d={fan(1)} fill={alpha(ink.face.shadow, 0.6)} stroke={ink.edge} strokeWidth={2} />
      {val > 0.01 ? <path d={fan(Math.min(val, 1))} fill={alpha(P.vermilion, 0.85)} /> : null}
      {Array.from({ length: 7 }, (_, i) => {
        const a = ang(i / 6) * D2R;
        return <line key={i} x1={cx + Math.cos(a) * (r - 16)} y1={cy + Math.sin(a) * (r - 16)} x2={cx + Math.cos(a) * r} y2={cy + Math.sin(a) * r} stroke={ink.ink} strokeWidth={2} opacity={0.7} />;
      })}
      {/* the tall stop */}
      <line x1={cx + Math.cos(ang(1) * D2R) * 24} y1={cy + Math.sin(ang(1) * D2R) * 24} x2={cx + Math.cos(ang(1) * D2R) * (r + 24)} y2={cy + Math.sin(ang(1) * D2R) * (r + 24)} stroke={C.saffron} strokeWidth={10} strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={cx + Math.cos(ang(val) * D2R) * (r + 6)} y2={cy + Math.sin(ang(val) * D2R) * (r + 6)} stroke={C.bone} strokeWidth={5} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={12} fill={P.vermilion} stroke={C.bone} strokeWidth={3} />
      {s.readout ? <Slab x={cx} y={H - 28} text={s.readout} who="ENERGY readout" size={24} /> : null}
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
