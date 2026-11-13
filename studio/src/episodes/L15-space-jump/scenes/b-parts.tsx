// L15 package B helpers (scenes l03, l04, l05 only). Small drawing helpers shared by S03/S04/S05; no figures live here
// except what the callers pass in from jumpdata.ts. The temperature chart's profile above 80 km is a SHAPE with no axis
// numbers (row 10: the mesosphere average and the thermosphere figure are secondary, F3).
import React from "react";
import { AbsoluteFill } from "remotion";
import { CycClouds, Family, HazeBand, IF2, Layer, Metric, STUDIO_SET, Sky, Tick, alpha, cutPop, mixHex, ramp, type Pose, type Expression } from "../../../lib/illustrated";
import { L15_COLORS, LAYER_TOPS, pillFill } from "../families";
import { AltRuler, SkyColumn, altY, type RulerFlag, type RulerPin } from "../sky";
import { atmAt } from "../jumpdata";
import { coldColor } from "../L15Gauges";

export const C = L15_COLORS;
export const STUDIO = STUDIO_SET;
export const cl01 = (v: number) => Math.max(0, Math.min(1, v));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
/** eased 0..1 between frames a and b */
export const ez = (f: number, a: number, b: number) => ramp(f, a, b);
/** linear 0..1 between frames a and b */
export const lin = (f: number, a: number, b: number) => cl01((f - a) / Math.max(1, b - a));

/** A hard cut's pop (scale bump over 9 frames). */
export const Pop: React.FC<{ f: number; children: React.ReactNode }> = ({ f, children }) => (
  <AbsoluteFill style={{ transform: `scale(${cutPop(f, 0)})`, transformOrigin: "50% 50%" }}>{children}</AbsoluteFill>
);

/** Number text for a counter rolling to a TABLE value `v` (k 0..1): commas, fixed decimals, a real minus sign. */
export const rollText = (v: number, k: number, decimals = 0, from = 0) => {
  const x = from + (v - from) * cl01(k);
  const s = Math.abs(x).toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return (x < -1e-9 ? "−" : "") + s;
};
/** A table value as text (commas, as many decimals as it has). */
export const num = (v: number) => (v < 0 ? "−" : "") + Math.abs(v).toLocaleString("en-US", { maximumFractionDigits: 3 });

/** A pill that keeps its text EXACTLY as written (write caps yourself; units like km, g, °C, s keep their case). */
export const XTag: React.FC<{ x: number; y: number; text: string; F: Family; dot?: string; size?: number; align?: "start" | "end" | "middle"; opacity?: number; color?: string }> = ({
  x,
  y,
  text,
  F,
  dot,
  size = 28,
  align = "start",
  opacity = 1,
  color,
}) => {
  const w = text.length * size * 0.6 + size * (dot ? 2.4 : 1.4);
  const h = size * 1.7;
  const x0 = align === "start" ? x : align === "end" ? x - w : x - w / 2;
  return (
    <g opacity={opacity}>
      <rect x={x0} y={y - h / 2} width={w} height={h} rx={h / 2} fill={pillFill(F)} stroke={alpha(C.bone, 0.25)} strokeWidth={1.5} />
      {dot ? <circle cx={x0 + size * 0.95} cy={y} r={size * 0.26} fill={dot} /> : null}
      <text x={x0 + (dot ? size * 1.6 : size * 0.7)} y={y + size * 0.36} style={{ fontFamily: IF2.label, fontSize: size, letterSpacing: size * 0.08, fill: color ?? "#F4FBF6" }}>
        {text}
      </text>
    </g>
  );
};

/** A big metric on a dark slab; `sub` = a small caption under it (e.g. STANDARD ATMOSPHERE, F6). */
export const Slab: React.FC<{ x: number; y: number; value: string; unit?: string; size?: number; F: Family; opacity?: number; color?: string; sub?: string; scale?: number }> = ({
  x,
  y,
  value,
  unit,
  size = 96,
  F,
  opacity = 1,
  color = "#F4FBF6",
  sub,
  scale = 1,
}) => {
  const w = value.length * size * 0.58 + (unit ? unit.length * size * 0.3 + size * 0.3 : 0) + size * 0.6;
  return (
    <g opacity={opacity} transform={`translate(${x} ${y}) scale(${scale}) translate(${-x} ${-y})`}>
      <rect x={x - size * 0.3} y={y - size * 0.95} width={w} height={size * 1.25 + (sub ? 34 : 0)} rx={size * 0.18} fill={pillFill(F)} stroke={alpha(C.saffron, 0.6)} strokeWidth={2} />
      <Metric x={x} y={y} value={value} unit={unit} size={size} color={color} unitColor={C.saffronCore} />
      {sub ? (
        <text x={x} y={y + size * 0.3 + 18} style={{ fontFamily: IF2.label, fontSize: 15, letterSpacing: 2.4, fill: alpha(C.bone, 0.75) }}>
          {sub}
        </text>
      ) : null}
    </g>
  );
};

export const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; color: string; w?: number; head?: number; opacity?: number }> = ({ x1, y1, x2, y2, color, w = 12, head = 34, opacity = 1 }) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const L = Math.hypot(x2 - x1, y2 - y1);
  if (L < 2) return null;
  const hl = Math.min(head, L * 0.6);
  const hx = x2 - Math.cos(a) * hl;
  const hy = y2 - Math.sin(a) * hl;
  const n = [Math.cos(a + Math.PI / 2), Math.sin(a + Math.PI / 2)];
  const hw = hl * 0.62;
  return (
    <g opacity={opacity}>
      <line x1={x1} y1={y1} x2={hx} y2={hy} stroke={color} strokeWidth={w} strokeLinecap="round" />
      <path d={`M${x2} ${y2} L${hx + n[0] * hw} ${hy + n[1] * hw} L${hx - n[0] * hw} ${hy - n[1] * hw} Z`} fill={color} />
    </g>
  );
};

/** The OUR MODEL chip (F5) for shots that show row-20 numbers without the cluster. */
export const ModelChip: React.FC<{ x: number; y: number; f: number }> = ({ x, y, f }) => (
  <g>
    <rect x={x} y={y} width={190} height={38} rx={19} fill={C.saffron} />
    <circle cx={x + 22} cy={y + 19} r={7} fill={L15_COLORS.vermilion} opacity={0.6 + 0.4 * Math.sin(f / 6)} />
    <text x={x + 38} y={y + 27} style={{ fontFamily: IF2.label, fontSize: 21, letterSpacing: 3, fill: "#1A1206" }}>
      OUR MODEL
    </text>
  </g>
);

/** Tick on a small gondola-rail perch (sky shots: Tick never falls). (x, y) = Tick's feet. */
export const Perch: React.FC<{
  x: number;
  y: number;
  f: number;
  pose?: Pose;
  poseTo?: Pose;
  poseT?: number;
  expression?: Expression;
  expressionTo?: Expression;
  expressionT?: number;
  facing?: 1 | -1;
  pxPerM?: number;
  staff?: boolean;
  look?: number;
  headTilt?: number;
  lamp?: boolean;
  tilt?: number;
}> = ({ x, y, f, pxPerM = 78, ...p }) => (
  <g>
    <rect x={x - 90} y={y} width={180} height={16} rx={6} fill={mixHex(C.saffronDeep, "#04121A", 0.3)} />
    <rect x={x - 90} y={y} width={180} height={5} rx={2} fill={C.saffron} />
    {[-80, -40, 40, 80].map((d) => (
      <line key={d} x1={x + d} y1={y} x2={x + d} y2={y - 46} stroke={C.saffron} strokeWidth={4} strokeLinecap="round" />
    ))}
    <line x1={x - 84} y1={y - 46} x2={x + 84} y2={y - 46} stroke={C.saffron} strokeWidth={5} strokeLinecap="round" />
    {[-60, 60].map((d) => (
      <line key={"h" + d} x1={x + d} y1={y + 16} x2={x + d * 0.4} y2={y + 60} stroke={alpha(C.bone, 0.4)} strokeWidth={2} />
    ))}
    <Tick x={x} y={y} pxPerM={pxPerM} frame={f} {...p} />
  </g>
);

/** The teal studio cyclorama (STUDIO_SET, never bone): sky, cyc clouds, floor; children on depth 1, hud on depth 0. */
export const StudioSet: React.FC<{ f: number; children?: React.ReactNode; hud?: React.ReactNode; seed?: number; floor?: number }> = ({ f, children, hud, seed = 4, floor = 860 }) => (
  <>
    <Layer depth={0.05}>
      <Sky family={STUDIO} />
    </Layer>
    <Layer depth={0.2}>
      <CycClouds f={f} y={70} n={5} seed={seed} />
    </Layer>
    <Layer depth={0.6}>
      <rect x={-1400} y={floor - 30} width={4800} height={1200} fill={mixHex(STUDIO.mid, "#FFE4A8", 0.15)} />
      <HazeBand y={floor - 160} h={180} color={STUDIO.haze} strength={0.7} x={-1400} w={4800} />
    </Layer>
    <Layer depth={1}>
      <rect x={-1400} y={floor + 40} width={4800} height={1200} fill={mixHex(STUDIO.mid, STUDIO.near, 0.55)} />
      {children}
    </Layer>
    {hud ? <Layer depth={0}>{hud}</Layer> : null}
  </>
);

/** Sky + ruler for an altitude window (the default mover when the window moves). */
export const SkyBack: React.FC<{
  f: number;
  altTop: number;
  altBottom: number;
  rulerX?: number;
  bands?: boolean | number;
  aurora?: boolean | number;
  drift?: number;
  streak?: number;
  flags?: boolean | RulerFlag[];
  pins?: RulerPin[];
  ruler?: boolean;
  step?: number;
  rulerColor?: string;
  ground?: boolean;
  seed?: number;
}> = ({ f, altTop, altBottom, rulerX = 110, bands = true, aurora = false, drift = 0.4, streak = 0, flags = true, pins = [], ruler = true, step, rulerColor, ground = true, seed }) => (
  <g>
    <rect x={-400} y={-400} width={2720} height={1880} fill={altTop > 45 ? "#04051A" : "#2C6FD0"} />
    <SkyColumn f={f} altTop={altTop} altBottom={altBottom} x={-300} w={2520} bands={bands} aurora={aurora} drift={drift} streak={streak} ground={ground} seed={seed} />
    {ruler ? <AltRuler f={f} altTop={altTop} altBottom={altBottom} x={rulerX} flags={flags} pins={pins} step={step} color={rulerColor} /> : null}
  </g>
);

// ---------------------------------------------------------------------------------------------------------------
// Temperature chart (scene 4): a stratum-coloured strip on the ruler + a temperature profile (x = temperature, y =
// altitude) and a bead riding it. The axis has WORDS only (COLDER / WARMER): no numbers. Below 80 km the profile is
// the #11 table (atmAt); above it a drawn shape: colder to the mesosphere top, then hot and thin (row 10, no figure).
// ---------------------------------------------------------------------------------------------------------------
export const tProfile = (alt: number) => {
  if (alt <= 80) return atmAt(alt).tC; // #11
  if (alt <= LAYER_TOPS.meso + 3) return atmAt(80).tC - (alt - 80) * 1.1; // shape only (row 10: no figure)
  const base = atmAt(80).tC - (LAYER_TOPS.meso + 3 - 80) * 1.1;
  return base + Math.min(T_HI + 6 - base, (alt - (LAYER_TOPS.meso + 3)) * 6); // thermosphere: runs to the WARMER end (shape)
};
export const T_LO = -90;
export const T_HI = 25;
export const tempX = (tC: number, x0: number, w: number) => x0 + ((tC - T_LO) / (T_HI - T_LO)) * w;

export const TempChart: React.FC<{
  f: number;
  altTop: number;
  altBottom: number;
  /** strip x (left edge) */
  sx?: number;
  /** profile axis left edge and width */
  ax?: number;
  aw?: number;
  /** profile drawn from altBottom up to this altitude (null = none) */
  head?: number | null;
  /** bead altitude (null = none) */
  bead?: number | null;
  /** the strip is drawn up to this altitude (wipe) */
  wipe?: number;
  /** 0..1 thermosphere flare (vermilion-saffron strip above 85 km) */
  flare?: number;
  words?: boolean;
  beadR?: number;
}> = ({ f, altTop, altBottom, sx = 330, ax = 450, aw = 740, head = null, bead = null, wipe = 1e9, flare = 0, words = true, beadR = 22 }) => {
  const Y = (a: number) => altY(a, altTop, altBottom);
  const lo = Math.max(0, altBottom - 2);
  const hi = Math.min(wipe, altTop + 2);
  const step = Math.max(0.25, (altTop - altBottom) / 120);
  const cells: React.ReactNode[] = [];
  for (let a = lo; a < hi; a += step) {
    const t = tProfile(a + step / 2);
    let col = coldColor(t);
    if (a > LAYER_TOPS.meso && flare > 0) col = mixHex(col, a > LAYER_TOPS.meso + 12 ? C.saffron : L15_COLORS.vermilion, cl01(flare));
    cells.push(<rect key={a.toFixed(2)} x={sx} y={Y(Math.min(hi, a + step)) - 0.5} width={56} height={Math.abs(Y(a) - Y(Math.min(hi, a + step))) + 1} fill={col} />);
  }
  const pts: string[] = [];
  if (head != null) {
    const top = Math.min(head, altTop + 2);
    for (let a = lo; a <= top; a += step) pts.push(`${tempX(tProfile(a), ax, aw).toFixed(1)} ${Y(a).toFixed(1)}`);
    pts.push(`${tempX(tProfile(top), ax, aw).toFixed(1)} ${Y(top).toFixed(1)}`);
  }
  const bx = bead != null ? tempX(tProfile(bead), ax, aw) : 0;
  const by = bead != null ? Y(bead) : 0;
  const bc = bead != null ? coldColor(tProfile(bead)) : C.teal;
  return (
    <g>
      {/* strip */}
      <rect x={sx - 4} y={Y(hi)} width={64} height={Math.max(0, Y(lo) - Y(hi))} rx={10} fill={alpha("#04121A", 0.5)} />
      {cells}
      <rect x={sx} y={Y(hi)} width={56} height={Math.max(0, Y(lo) - Y(hi))} fill="none" stroke={alpha(C.bone, 0.7)} strokeWidth={2.5} />
      {wipe < altTop + 2 && wipe > altBottom - 2 ? (
        <g>
          <rect x={sx - 14} y={Y(wipe) - 5} width={84} height={10} rx={5} fill={C.saffronCore} />
        </g>
      ) : null}
      {/* axis: words only */}
      {words ? (
        <g>
          <line x1={ax} y1={1010} x2={ax + aw} y2={1010} stroke={alpha(C.bone, 0.55)} strokeWidth={2} strokeDasharray="6 8" />
          <text x={ax} y={1048} style={{ fontFamily: IF2.label, fontSize: 18, letterSpacing: 3, fill: C.frost }}>
            ← COLDER
          </text>
          <text x={ax + aw} y={1048} textAnchor="end" style={{ fontFamily: IF2.label, fontSize: 18, letterSpacing: 3, fill: C.saffronCore }}>
            WARMER →
          </text>
        </g>
      ) : null}
      {pts.length > 1 ? (
        <g>
          <path d={"M" + pts.join(" L")} fill="none" stroke={alpha(C.saffron, 0.35)} strokeWidth={16} strokeLinejoin="round" strokeLinecap="round" />
          <path d={"M" + pts.join(" L")} fill="none" stroke={C.saffronCore} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />
        </g>
      ) : null}
      {bead != null ? (
        <g>
          <line x1={sx + 56} y1={by} x2={bx} y2={by} stroke={alpha(C.bone, 0.5)} strokeWidth={2} strokeDasharray="4 6" />
          <circle cx={bx} cy={by} r={beadR + 8 + Math.sin(f / 5) * 2} fill={alpha(bc, 0.3)} />
          <circle cx={bx} cy={by} r={beadR} fill={bc} stroke={L15_COLORS.vermilion} strokeWidth={5} />
          <circle cx={bx - beadR * 0.3} cy={by - beadR * 0.3} r={beadR * 0.28} fill="#FFFFFF" opacity={0.6} />
          <circle cx={sx + 28} cy={by} r={12} fill={bc} stroke={C.bone} strokeWidth={3} />
        </g>
      ) : null}
    </g>
  );
};

/** Large-area mover: vertical streaks flowing up (dir -1, as past a falling probe) or down at `speed` px/f. */
export const FlowStreaks: React.FC<{ f: number; speed?: number; n?: number; color?: string; opacity?: number; dir?: 1 | -1; x0?: number; x1?: number; width?: number; seed?: number }> = ({
  f,
  speed = 10,
  n = 34,
  color = C.bone,
  opacity = 0.35,
  dir = -1,
  x0 = -200,
  x1 = 2120,
  width = 5,
  seed = 1,
}) => (
  <g stroke={color} strokeLinecap="round" opacity={opacity}>
    {Array.from({ length: n }, (_, i) => {
      const r1 = Math.abs(Math.sin(seed * 91.3 + i * 12.9898) * 43758.5453) % 1;
      const r2 = Math.abs(Math.sin(seed * 17.1 + i * 78.233) * 12345.678) % 1;
      const L = 140 + r2 * 220;
      const x = x0 + r1 * (x1 - x0);
      const y = ((((r2 * 1600 + dir * f * speed * (0.75 + r1 * 0.5)) % 1600) + 1600) % 1600) - 260;
      return <line key={i} x1={x} y1={y} x2={x} y2={y + L} strokeWidth={width * (0.6 + r1 * 0.8)} />;
    })}
  </g>
);

/** Large-area mover: sound rings expanding from (x, y) at `speed` px/f, one every `every` frames. */
export const SoundRings: React.FC<{ f: number; x: number; y: number; speed?: number; every?: number; max?: number; color?: string }> = ({ f, x, y, speed = 7, every = 22, max = 1100, color = C.limb }) => (
  <g fill="none" stroke={color}>
    {Array.from({ length: Math.ceil(max / (speed * every)) + 1 }, (_, k) => {
      const age = (f % every) + k * every;
      const r = age * speed;
      if (r > max) return null;
      return <circle key={k} cx={x} cy={y} r={r} strokeWidth={12} opacity={0.6 * (1 - r / max)} />;
    })}
  </g>
);

/** Deep saturated indigo (value ≈ 0.3-0.4): the lifted "void" for shots that are dark but not the top of the sky. */
export const INDIGO = ["#120E46", "#1B1560", "#271E7A"];
