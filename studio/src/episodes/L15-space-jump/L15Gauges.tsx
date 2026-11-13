// L15Gauges: the episode's four-gauge cluster at frame right (x ≈ 1500-1860), BUILD.md §5 / storyboard §3 "GC".
// NOT L14's stack of four plates (F12): one tall instrument panel with a saffron spine, four visually distinct gauges:
//   SPEED  a half-dial (kit Dial face), saffron end-stop, a ghost needle and a SOUND mark computed by soundSpeed(T) (F10)
//   AIR    a glass cube of swarming dots (dot count = density / sea-level density) + STANDARD ATMOSPHERE tag (F6)
//   PUSH   a balance beam: WEIGHT block on the left pan, a vermilion PUSH column on the right; WEIGHT line at 1
//   COLD   a gradient strip (−90 … +25 °C) with a bead whose colour is the strip's colour at the temperature
// Every readout must be a jumpdata.ts value (it throws otherwise); with no readout nothing numeric is drawn. Needles and
// fills vermilion, stops saffron (F11). `model` lights the OUR MODEL chip (F5): set it on every row-20 shot.
// USAGE
//   <L15GaugesHUD family={F} frame={f} speed={{ value, readout?, roll?, ghost?, soundT?, max?, mach?, pinned? }}
//        air={{ value: airValue(alt) }} push={{ value: pushAt(alt) }} cold={{ value: atmAt(alt).tC, readout? }}
//        model? theme?="dark|light" compact? rattle?={0..1} only?={["push"]} x?=1500 y?=90 />   (last, in <Layer depth={0}>)
//   SPEED value: 0..1 of the stop (1 = the saffron stop; speedValue(mps, max) helps); AIR value: 0..1 density share
//   (airValue(alt)); PUSH value: the drag/weight RATIO itself (0 … ~5; 1 = level); COLD value: °C.
//   Gauge states also take readout (table value), roll (0..1 Counter roll), approx ("≈"), lt ("<"), unit, pinned,
//   unknown ("?" tag; bead/column/dots hidden; the SPEED needle parks at zero), appear (0..1 fade-up).
//   <SpeedGauge|AirGauge|PushGauge|ColdGauge x y s f family theme? scale? plate? />  one gauge alone (studio plates)
import React from "react";
import { Counter, Dial, Family, IF2, Layer, P, UnknownTag, alpha, labelCase, mixHex } from "../../lib/illustrated";
import { L15_COLORS } from "./families";
import { AirCube } from "./props";
import { RHO0, assertAllowed, atmAt, soundSpeed } from "./jumpdata";

const C = L15_COLORS;
const D2R = Math.PI / 180;
const OVER = 1.15; // the SPEED scale runs 15 % past the stop
const quiver = (f: number, seed = 0) => Math.sin(((f + seed) * 2 * Math.PI) / 3); // ±1 at 10 Hz
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));

/** SPEED dial value for a speed in m/s when `max` m/s sits at the stop. */
export const speedValue = (mps: number, max = 1100) => mps / max;
/** AIR value at an altitude: density / sea-level density (#11). */
export const airValue = (altKm: number) => atmAt(altKm).rho / RHO0;

export type GaugeState = {
  value: number;
  readout?: number | null;
  roll?: number;
  approx?: boolean;
  lt?: boolean;
  unit?: string;
  pinned?: boolean;
  unknown?: boolean;
  appear?: number;
};
export type SpeedState = GaugeState & {
  /** ghost needle position (0..1 of the stop): a previous / comparison speed */
  ghost?: number;
  /** air temperature (°C) for the SOUND mark: the mark sits at soundSpeed(soundT) / max (F10). Omit = no mark */
  soundT?: number;
  /** m/s at the stop (for the SOUND mark), default 1100 */
  max?: number;
  /** a table sound speed shown beside the SOUND label (340 / 295 / 317) */
  soundReadout?: number;
  /** "MACH n" chip (a table value: 1.25, 1.23, 3.3) */
  mach?: number;
};

type Ink = { plate: string; edge: string; ink: string; dim: string; shadow: string };
const inkOf = (F: Family, theme: "dark" | "light"): Ink =>
  theme === "dark"
    ? { plate: alpha(mixHex(F.shadow, "#04121A", 0.3), 0.9), edge: alpha(C.bone, 0.35), ink: C.bone, dim: alpha(C.bone, 0.55), shadow: "#04121A" }
    : { plate: alpha(mixHex(F.light, C.limb, 0.3), 0.16), edge: alpha(C.bone, 0.6), ink: C.bone, dim: alpha(C.bone, 0.62), shadow: "#04121A" };
const themeOf = (F: Family, theme?: "dark" | "light") => theme ?? (F.dark ? "light" : "dark");

const Title: React.FC<{ x: number; y: number; text: string; ink: Ink }> = ({ x, y, text, ink }) => (
  <text x={x} y={y} style={{ fontFamily: IF2.label, fontSize: 21, letterSpacing: 3.5, fill: ink.ink }}>
    {labelCase(text)}
  </text>
);

const fmt = (v: number) => Math.abs(v).toLocaleString("en-US", { maximumFractionDigits: 3 });

/** Vermilion number slab: integers roll (Counter), decimals fade in; "−", "≈", "<" prefixes; the unit keeps its case. */
const Readout: React.FC<{ x: number; y: number; s: GaugeState; unit: string; size?: number; who: string }> = ({ x, y, s, unit, size = 26, who }) => {
  if (s.readout == null) return null;
  const v = s.readout;
  assertAllowed(v, `${who} readout`);
  const roll = cl(s.roll ?? 1);
  const isInt = Number.isInteger(v);
  const txt = fmt(v);
  const cw = size * 0.6;
  const numW = txt.replace(/,/g, "").length * cw + (txt.match(/[,.]/g)?.length ?? 0) * size * 0.22;
  const pre = (v < 0 ? "−" : "") + (s.approx ? "≈" : "") + (s.lt ? "<" : "");
  const preW = pre.length * size * 0.62;
  const postW = unit.length * size * 0.36 + 6;
  const w = preW + numW + postW + 26;
  const x0 = x - w / 2;
  const st: React.CSSProperties = { fontFamily: IF2.num, fontWeight: 800, fontSize: size, fontVariantNumeric: "tabular-nums", fill: P.bone };
  return (
    <g>
      <rect x={x0} y={y - size * 0.95} width={w} height={size * 1.3} rx={size * 0.22} fill={P.vermilion} />
      {pre ? (
        <text x={x0 + 12} y={y} style={st}>
          {pre}
        </text>
      ) : null}
      {isInt ? (
        <Counter x={x0 + 13 + preW} y={y} value={Math.abs(v) * roll} max={Math.abs(v)} size={size} color={P.bone} align="start" />
      ) : (
        <text x={x0 + 13 + preW} y={y} style={{ ...st, opacity: roll }}>
          {txt}
        </text>
      )}
      <text x={x0 + 13 + preW + numW + 5} y={y} style={{ fontFamily: IF2.num, fontWeight: 600, fontSize: size * 0.6, fill: P.bone }}>
        {unit}
      </text>
    </g>
  );
};

const Chevrons: React.FC<{ x: number; y: number; f: number; dir: "up" | "right"; s?: number }> = ({ x, y, f, dir, s = 10 }) => (
  <g>
    {[0, 1, 2].map((k) => {
      const on = (f + k * 3) % 9 < 5;
      const d = k * s * 1.4;
      const path =
        dir === "up"
          ? `M${x - s} ${y - d} L${x} ${y - d - s} L${x + s} ${y - d} L${x + s} ${y - d + s * 0.55} L${x} ${y - d - s * 0.45} L${x - s} ${y - d + s * 0.55} Z`
          : `M${x + d} ${y - s} L${x + d + s} ${y} L${x + d} ${y + s} L${x + d - s * 0.55} ${y + s} L${x + d + s * 0.45} ${y} L${x + d - s * 0.55} ${y - s} Z`;
      return <path key={k} d={path} fill={P.vermilion} stroke={P.bone} strokeWidth={1.2} opacity={on ? 1 : 0.25} />;
    })}
  </g>
);

const MiniTag: React.FC<{ x: number; y: number; text: string; ink: Ink; anchor?: "start" | "middle" | "end" }> = ({ x, y, text, ink, anchor = "start" }) => (
  <text x={x} y={y} textAnchor={anchor} style={{ fontFamily: IF2.label, fontSize: 12, letterSpacing: 1.8, fill: ink.dim }}>
    {labelCase(text)}
  </text>
);

const PlateBox: React.FC<{ w: number; h: number; ink: Ink }> = ({ w, h, ink }) => <rect x={0} y={0} width={w} height={h} rx={22} fill={ink.plate} stroke={ink.edge} strokeWidth={2} />;

// ------------------------------------------------------------------------------------------------------------------
// SPEED (360 × 300 cell)
// ------------------------------------------------------------------------------------------------------------------

type GaugeProps<S> = { x: number; y: number; s: S; f: number; family: Family; theme?: "dark" | "light"; scale?: number; plate?: boolean };
type InnerProps<S> = { s: S; f: number; F: Family; ink: Ink };

const SpeedInner: React.FC<InnerProps<SpeedState>> = ({ s, f, F, ink }) => {
  const cx = 180;
  const cy = 218;
  const r = 128;
  const ang = (v: number) => 180 + (cl(v, 0, OVER) / OVER) * 180;
  const pt = (v: number, rr: number): [number, number] => [cx + Math.cos(ang(v) * D2R) * rr, cy + Math.sin(ang(v) * D2R) * rr];
  const val = s.pinned ? 1.09 + quiver(f) * 0.03 : cl(s.value, 0, 1.12);
  const dialFam: Family = { ...F, text: ink.ink, dim: ink.dim, shadow: ink.shadow };
  const clipId = `spd${Math.round(cx)}`;
  const [s1x, s1y] = pt(1, r - 20);
  const [s2x, s2y] = pt(1, r + 18);
  const bend = s.pinned ? 4 + quiver(f, 1) * 2 : 0;
  const arc = (v0: number, v1: number, rr: number) => {
    const [ax, ay] = pt(v0, rr);
    const [bx, by] = pt(v1, rr);
    return `M${ax.toFixed(1)} ${ay.toFixed(1)} A${rr} ${rr} 0 0 1 ${bx.toFixed(1)} ${by.toFixed(1)}`;
  };
  const sound = s.soundT != null ? soundSpeed(s.soundT) / (s.max ?? 1100) : null;
  if (s.soundReadout != null) assertAllowed(s.soundReadout, "SPEED soundReadout");
  if (s.mach != null) assertAllowed(s.mach, "SPEED mach");
  return (
    <g>
      <Title x={22} y={36} text="speed" ink={ink} />
      <defs>
        <clipPath id={clipId}>
          <rect x={0} y={40} width={360} height={cy + 30 - 40} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {/* kit Dial: face + needle (value runs 0..OVER, so a pinned needle slams past the stop and quivers) */}
        <Dial x={cx} y={cy} r={r} value={s.unknown ? 0 : val} min={0} max={OVER} sweep={180} family={dialFam} ticks={10} format={() => ""} frame={f} />
      </g>
      {/* overflow zone past the stop */}
      <path d={arc(1, OVER, r)} fill="none" stroke={C.saffron} strokeWidth={7} strokeDasharray="7 6" opacity={0.75} />
      {/* vermilion fill up to the needle */}
      {!s.unknown && val > 0.005 ? <path d={arc(0, val, r)} fill="none" stroke={P.vermilion} strokeWidth={9} strokeLinecap="round" opacity={0.9} /> : null}
      {/* saffron end-stop */}
      <line x1={s1x} y1={s1y} x2={s2x + bend} y2={s2y} stroke={C.saffron} strokeWidth={9} strokeLinecap="round" />
      {/* SOUND mark: a notch outside the arc + label, from soundSpeed(T) only */}
      {sound != null ? (() => {
        const v = cl(sound, 0, OVER);
        const a = ang(v) * D2R;
        const [ox, oy] = [cx + Math.cos(a) * (r + 12), cy + Math.sin(a) * (r + 12)];
        const [ix, iy] = [cx + Math.cos(a) * (r - 16), cy + Math.sin(a) * (r - 16)];
        const [lx, ly] = [cx + Math.cos(a) * (r + 40), cy + Math.sin(a) * (r + 40)];
        const side = Math.cos(a) < -0.2 ? "end" : Math.cos(a) > 0.2 ? "start" : "middle";
        return (
          <g>
            <line x1={ix} y1={iy} x2={ox} y2={oy} stroke={C.limb} strokeWidth={5} strokeLinecap="round" />
            <circle cx={ox} cy={oy} r={7} fill={C.limb} stroke={ink.shadow} strokeWidth={2} />
            <text x={lx} y={ly + 5} textAnchor={side} style={{ fontFamily: IF2.label, fontSize: 15, letterSpacing: 2, fill: C.limb }}>
              {labelCase("sound")}
              {s.soundReadout != null ? (
                <tspan dx={6} style={{ fontFamily: IF2.num, fontWeight: 800 }}>
                  {s.soundReadout}
                  <tspan style={{ fontSize: 11, fontWeight: 600 }}> m/s</tspan>
                </tspan>
              ) : null}
            </text>
          </g>
        );
      })() : null}
      {/* ghost needle */}
      {s.ghost != null ? (() => {
        const a = ang(s.ghost) * D2R;
        return <line x1={cx} y1={cy} x2={cx + Math.cos(a) * r * 0.8} y2={cy + Math.sin(a) * r * 0.8} stroke={ink.ink} strokeWidth={4} strokeDasharray="8 7" opacity={0.55} strokeLinecap="round" />;
      })() : null}
      {s.unknown ? <UnknownTag x={cx + 60} y={cy - 50} size={30} /> : null}
      {s.pinned ? <Chevrons x={s2x + 18} y={s2y + 10} f={f} dir="right" s={9} /> : null}
      <Readout x={cx} y={cy + 66} s={s} unit={s.unit ?? "m/s"} size={28} who="SPEED" />
      {s.mach != null ? (
        <g>
          <rect x={250} y={18} width={96} height={30} rx={15} fill={alpha(C.limb, 0.2)} stroke={C.limb} strokeWidth={2} />
          <text x={298} y={39} textAnchor="middle" style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 18, fill: C.limb }}>
            MACH {s.mach}
          </text>
        </g>
      ) : null}
    </g>
  );
};

// ------------------------------------------------------------------------------------------------------------------
// AIR (175 × 250 cell)
// ------------------------------------------------------------------------------------------------------------------

const AIR_DOTS = 90;
const AirInner: React.FC<InnerProps<GaugeState> & { tag?: boolean }> = ({ s, f, ink, tag = true }) => {
  const v = cl(s.value, 0, 1);
  const n = s.unknown ? 0 : v <= 0 ? 0 : Math.max(1, Math.round(AIR_DOTS * v));
  return (
    <g>
      <Title x={18} y={36} text="air" ink={ink} />
      <AirCube x={26} y={78} size={104} n={n} f={f} speed={5} color={C.bone} glass={C.limb} seed={7} />
      {s.unknown ? <UnknownTag x={78} y={130} size={26} /> : null}
      {s.pinned ? <Chevrons x={150} y={70} f={f} dir="up" s={8} /> : null}
      <Readout x={88} y={222} s={s} unit={s.unit ?? "kg/m³"} size={21} who="AIR" />
      {tag ? <MiniTag x={88} y={244} text="standard atmosphere" ink={ink} anchor="middle" /> : null}
    </g>
  );
};

// ------------------------------------------------------------------------------------------------------------------
// PUSH (175 × 250 cell): value = drag / weight ratio
// ------------------------------------------------------------------------------------------------------------------

const UNIT_PX = 20; // column px per 1× weight
const PUSH_CAP = 5.4; // the column's top (past it = pinned)
const PushInner: React.FC<InnerProps<GaugeState>> = ({ s, f, ink }) => {
  const ratio = s.unknown ? 1 : Math.max(0, s.value);
  const shown = s.pinned ? PUSH_CAP + 0.2 + quiver(f) * 0.12 : Math.min(PUSH_CAP, ratio);
  const tilt = cl((ratio - 1) * 7, -12, 13) + Math.sin(f / 20) * 0.6 + (s.pinned ? quiver(f) * 1.5 : 0);
  const px = 88;
  const py = 196;
  const half = 64;
  const t = tilt * D2R;
  const Lx = px - Math.cos(t) * half;
  const Ly = py - Math.sin(t) * half;
  const Rx = px + Math.cos(t) * half;
  const Ry = py + Math.sin(t) * half;
  const panW = 40;
  const hang = 16;
  return (
    <g>
      <Title x={18} y={36} text="push" ink={ink} />
      {/* stand */}
      <path d={`M${px - 22} 232 L${px} ${py} L${px + 22} 232 Z`} fill={alpha(ink.ink, 0.25)} stroke={ink.ink} strokeWidth={2} />
      {/* beam */}
      <line x1={Lx} y1={Ly} x2={Rx} y2={Ry} stroke={ink.ink} strokeWidth={6} strokeLinecap="round" />
      <circle cx={px} cy={py} r={6} fill={C.saffron} />
      {/* left pan: WEIGHT block = 1× */}
      <line x1={Lx} y1={Ly} x2={Lx} y2={Ly + hang} stroke={ink.dim} strokeWidth={2} />
      <rect x={Lx - panW / 2} y={Ly + hang} width={panW} height={4} rx={2} fill={ink.ink} />
      <rect x={Lx - 14} y={Ly + hang - UNIT_PX} width={28} height={UNIT_PX} rx={4} fill={C.saffron} />
      <MiniTag x={Lx} y={Ly + hang + 18} text="weight" ink={ink} anchor="middle" />
      {/* right pan: the PUSH column, with the WEIGHT line at 1 */}
      <line x1={Rx} y1={Ry} x2={Rx} y2={Ry + hang} stroke={ink.dim} strokeWidth={2} />
      <rect x={Rx - panW / 2} y={Ry + hang} width={panW} height={4} rx={2} fill={ink.ink} />
      {!s.unknown ? <rect x={Rx - 12} y={Ry + hang - shown * UNIT_PX} width={24} height={shown * UNIT_PX} rx={4} fill={P.vermilion} /> : null}
      {!s.unknown && shown > 0.15 ? <rect x={Rx - 12} y={Ry + hang - shown * UNIT_PX} width={24} height={4} rx={2} fill={P.bone} opacity={0.5 + 0.5 * Math.sin(f / 3)} /> : null}
      <line x1={Rx - 24} y1={Ry + hang - UNIT_PX} x2={Rx + 24} y2={Ry + hang - UNIT_PX} stroke={C.saffron} strokeWidth={3} strokeDasharray="5 4" />
      {s.unknown ? <UnknownTag x={Rx} y={Ry - 30} size={22} /> : null}
      {s.pinned ? <Chevrons x={Rx} y={Ry + hang - PUSH_CAP * UNIT_PX - 18} f={f} dir="up" s={8} /> : null}
      <Readout x={88} y={64} s={s} unit={s.unit ?? "×"} size={21} who="PUSH" />
    </g>
  );
};

// ------------------------------------------------------------------------------------------------------------------
// COLD (360 × 150 cell): value = °C
// ------------------------------------------------------------------------------------------------------------------

const T_MIN = -90;
const T_MAX = 25;
const COLD_STOPS: [number, string][] = [
  [-90, "#3B2FB8"],
  [-60, "#2C6FD0"],
  [-30, "#35D0E8"],
  [0, "#2FBFA8"],
  [25, "#E0A93A"],
];
/** The COLD strip's colour at a temperature (the bead takes it). */
export const coldColor = (tC: number) => {
  const t = cl(tC, T_MIN, T_MAX);
  for (let i = 1; i < COLD_STOPS.length; i++) {
    const [t1, c1] = COLD_STOPS[i];
    const [t0, c0] = COLD_STOPS[i - 1];
    if (t <= t1) return mixHex(c0, c1, (t - t0) / (t1 - t0));
  }
  return COLD_STOPS[COLD_STOPS.length - 1][1];
};
const ColdInner: React.FC<InnerProps<GaugeState> & { tag?: boolean }> = ({ s, f, ink, tag = true }) => {
  const x0 = 26;
  const x1 = 334;
  const sy = 70;
  const at = (t: number) => x0 + ((cl(t, T_MIN, T_MAX) - T_MIN) / (T_MAX - T_MIN)) * (x1 - x0);
  const gid = "coldg" + Math.round(x0);
  const tC = s.pinned ? T_MIN + 2 + quiver(f) * 1.5 : s.value;
  const bx = at(tC);
  const shim = x0 + ((f * 6) % (x1 - x0 + 120)) - 60; // a highlight travelling along the strip at 6 px/f
  return (
    <g>
      <Title x={22} y={36} text="cold" ink={ink} />
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
          {COLD_STOPS.map(([t, c], i) => (
            <stop key={i} offset={(t - T_MIN) / (T_MAX - T_MIN)} stopColor={c} />
          ))}
        </linearGradient>
        <clipPath id={gid + "c"}>
          <rect x={x0} y={sy - 13} width={x1 - x0} height={26} rx={13} />
        </clipPath>
      </defs>
      <rect x={x0} y={sy - 13} width={x1 - x0} height={26} rx={13} fill={`url(#${gid})`} stroke={ink.ink} strokeWidth={2} />
      <g clipPath={`url(#${gid}c)`}>
        <rect x={shim} y={sy - 13} width={36} height={26} fill="#FFFFFF" opacity={0.28} transform={`skewX(-20)`} />
      </g>
      {/* 0 °C tick (scale mark) */}
      <line x1={at(0)} y1={sy + 16} x2={at(0)} y2={sy + 26} stroke={ink.ink} strokeWidth={2.5} />
      <text x={at(0)} y={sy + 42} textAnchor="middle" style={{ fontFamily: IF2.num, fontWeight: 700, fontSize: 14, fill: ink.dim }}>
        0
      </text>
      {!s.unknown ? (
        <g>
          <circle cx={bx} cy={sy} r={19 + Math.sin(f / 5) * 1.2} fill="none" stroke={P.bone} strokeWidth={2} opacity={0.5} />
          <circle cx={bx} cy={sy} r={15} fill={coldColor(tC)} stroke={P.vermilion} strokeWidth={4} />
          <circle cx={bx - 4} cy={sy - 5} r={4} fill="#FFFFFF" opacity={0.6} />
        </g>
      ) : (
        <UnknownTag x={(x0 + x1) / 2} y={sy} size={22} />
      )}
      {s.pinned ? <Chevrons x={x0 + 6} y={sy - 26} f={f} dir="up" s={8} /> : null}
      <Readout x={250} y={128} s={s} unit={s.unit ?? "°C"} size={22} who="COLD" />
      {tag ? <MiniTag x={26} y={128} text="standard atmosphere" ink={ink} /> : null}
    </g>
  );
};

// ------------------------------------------------------------------------------------------------------------------
// standalone gauges (studio plates 3-11, 4-10, 7-10): each on its own plate, scaled
// ------------------------------------------------------------------------------------------------------------------

const Alone = <S,>(Inner: React.FC<InnerProps<S>>, w: number, h: number): React.FC<GaugeProps<S>> => {
  const G: React.FC<GaugeProps<S>> = ({ x, y, s, f, family, theme, scale = 1, plate = true }) => {
    const ink = inkOf(family, themeOf(family, theme));
    return (
      <g transform={`translate(${x} ${y}) scale(${scale})`}>
        {plate ? <PlateBox w={w} h={h} ink={ink} /> : null}
        <Inner s={s} f={f} F={family} ink={ink} />
      </g>
    );
  };
  return G;
};
export const SpeedGauge = Alone<SpeedState>(SpeedInner, 360, 300);
export const AirGauge = Alone<GaugeState>(AirInner, 175, 254);
export const PushGauge = Alone<GaugeState>(PushInner, 175, 254);
export const ColdGauge = Alone<GaugeState>(ColdInner, 360, 150);

// ------------------------------------------------------------------------------------------------------------------
// the cluster
// ------------------------------------------------------------------------------------------------------------------

export type GaugeId = "speed" | "air" | "push" | "cold";
export type L15GaugesProps = {
  family: Family;
  frame: number;
  theme?: "dark" | "light";
  compact?: boolean;
  rattle?: number;
  /** lights the OUR MODEL chip (F5): every row-20 number */
  model?: boolean;
  /** draw only these gauges (close-ups); the panel shrinks to fit */
  only?: GaugeId[];
  speed?: SpeedState;
  air?: GaugeState;
  push?: GaugeState;
  cold?: GaugeState;
  /** STANDARD ATMOSPHERE tags on AIR and COLD (F6), default on */
  stdTag?: boolean;
  /** cluster origin (left, top); the panel is 360 wide, ≈ 740 tall */
  x?: number;
  y?: number;
  opacity?: number;
};

const W = 360;
const ROWS = { speed: [0, 300], mid: [306, 562], cold: [568, 724] } as const;

export const L15Gauges: React.FC<L15GaugesProps> = ({
  family: F,
  frame: f,
  theme,
  compact = false,
  rattle = 0,
  model = false,
  only,
  speed = { value: 0 },
  air = { value: 1 },
  push = { value: 0 },
  cold = { value: 15 },
  stdTag = true,
  x = 1500,
  y = 90,
  opacity = 1,
}) => {
  const ink = inkOf(F, themeOf(F, theme));
  const k = compact ? 0.78 : 1;
  const has = (g: GaugeId) => !only || only.includes(g);
  const sh = rattle > 0 ? [Math.sin(f * 2.7) * 7 * rattle + Math.sin(f * 5.1) * 3 * rattle, Math.cos(f * 3.3) * 5 * rattle] : [0, 0];
  // vertical packing: drop rows that are not drawn
  const rows: { id: "speed" | "mid" | "cold"; h: number }[] = [];
  if (has("speed")) rows.push({ id: "speed", h: ROWS.speed[1] - ROWS.speed[0] });
  if (has("air") || has("push")) rows.push({ id: "mid", h: ROWS.mid[1] - ROWS.mid[0] });
  if (has("cold")) rows.push({ id: "cold", h: ROWS.cold[1] - ROWS.cold[0] });
  let yy = 0;
  const placed = rows.map((r) => {
    const o = { ...r, y: yy };
    yy += r.h + 6;
    return o;
  });
  const H = yy - 6;
  const ax = x + W; // compact anchors top-right
  const fade = (s?: GaugeState) => cl(s?.appear ?? 1);
  const slide = (s?: GaugeState) => (1 - fade(s)) * 30;
  const chipPulse = 0.6 + 0.4 * Math.sin(f / 6);
  return (
    <g opacity={opacity} transform={`translate(${(sh[0] + ax * (1 - k)).toFixed(2)} ${(sh[1] + y * (1 - k)).toFixed(2)}) scale(${k})`}>
      <g transform={`translate(${x} ${y})`}>
        <rect x={0} y={0} width={W} height={H} rx={26} fill={ink.plate} stroke={ink.edge} strokeWidth={2} />
        {/* the saffron spine with rivets (this cluster's signature, not L14's plate stack) */}
        <rect x={-10} y={24} width={8} height={H - 48} rx={4} fill={C.saffron} />
        {Array.from({ length: Math.floor((H - 60) / 90) + 1 }, (_, i) => (
          <circle key={i} cx={-6} cy={40 + i * 90} r={3} fill={C.saffronDeep} />
        ))}
        {placed.map((r, i) =>
          i > 0 ? <line key={"d" + i} x1={18} y1={r.y - 3} x2={W - 18} y2={r.y - 3} stroke={ink.edge} strokeWidth={1.5} strokeDasharray="4 6" /> : null,
        )}
        {placed.map((r) => {
          if (r.id === "speed")
            return (
              <g key="s" transform={`translate(0 ${r.y + slide(speed)})`} opacity={fade(speed)}>
                <SpeedInner s={speed} f={f} F={F} ink={ink} />
              </g>
            );
          if (r.id === "mid")
            return (
              <g key="m" transform={`translate(0 ${r.y})`}>
                {has("air") ? (
                  <g transform={`translate(0 ${slide(air)})`} opacity={fade(air)}>
                    <AirInner s={air} f={f} F={F} ink={ink} tag={stdTag} />
                  </g>
                ) : null}
                {has("air") && has("push") ? <line x1={180} y1={14} x2={180} y2={r.h - 14} stroke={ink.edge} strokeWidth={1.5} strokeDasharray="4 6" /> : null}
                {has("push") ? (
                  <g transform={`translate(${has("air") ? 182 : 92} ${slide(push)})`} opacity={fade(push)}>
                    <PushInner s={push} f={f} F={F} ink={ink} />
                  </g>
                ) : null}
              </g>
            );
          return (
            <g key="c" transform={`translate(0 ${r.y + slide(cold)})`} opacity={fade(cold)}>
              <ColdInner s={cold} f={f} F={F} ink={ink} tag={stdTag} />
            </g>
          );
        })}
        {model ? (
          <g>
            <rect x={W - 168} y={-44} width={168} height={34} rx={17} fill={C.saffron} />
            <circle cx={W - 148} cy={-27} r={6} fill={P.vermilion} opacity={chipPulse} />
            <text x={W - 134} y={-20} style={{ fontFamily: IF2.label, fontSize: 19, letterSpacing: 3, fill: "#1A1206" }}>
              {labelCase("our model")}
            </text>
          </g>
        ) : null}
      </g>
    </g>
  );
};

/** The cluster on its own screen-locked layer: drop this inside a <Stage>, last. */
export const L15GaugesHUD: React.FC<L15GaugesProps> = (p) => (
  <Layer depth={0}>
    <L15Gauges {...p} />
  </Layer>
);
