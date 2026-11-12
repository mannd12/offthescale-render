// L14Gauges: the episode's four-gauge cluster at frame right (x ≈ 1500-1860), BUILD.md §5 / storyboard §3 "GC".
// Four visually distinct instruments, top to bottom:
//   SPEED    a half-dial (km/s)                      · stop label "8 km/s" (#2), F1: never a terminal-velocity number
//   HEAT     a horizontal thermometer column (°C)    · green "warm" band, `broken` (6-25), `big` = the 0-7,000 dial (6-24)
//   PRESSURE a round manometer + an odometer (atm)   · the odometer rolls BLANK drums unless a readout is given
//   PULL     a spring-balance rail, zero at the floor · `pullValue(g)` maps g to the rail (1.09 g = the stop, #3)
// Rules this file enforces (sources.md): a readout must be a value in the GAUGE table (it throws otherwise), a Counter
// only rolls UP TO that value (`roll` 0..1), stop labels come from STOP only, and with no readout nothing numeric is
// drawn. Needles and fills are vermilion, stops saffron. `theme` = the PLATE tone: "dark" plates for bright families
// (noon, STUDIO_SET), "light" plates for dark ones (void, ember, iron, deep petrol); default picks from family.dark.
// Draw it in <Layer depth={0}> (or <L14GaugesHUD>), last.
import React from "react";
import { Counter, Family, IF2, Layer, P, UnknownTag, alpha } from "../../lib/illustrated";
import { L14_COLORS } from "./families";

/** Every number the cluster may show, with its sources.md row. */
export const GAUGE = {
  speedPeak: 8, // #2 km/s at the centre (also the SPEED stop)
  speedAvg: 5.56, // #13 km/s average (12,742 km / 2,291 s; F19)
  speedKmh: 28800, // #13 km/h (8 km/s × 3,600)
  kola: 180, // #14 °C (show with approx: "~180 °C", V6)
  boundaryT: 6000, // #17 °C at the inner-core boundary (with tol, V4)
  tol: 500, // #17 ± °C
  boundaryP: 3.3e6, // #17 #25 atm at the inner-core boundary (V4)
  pullTop: 1.09, // #3 the peak pull, in g (at the outer-core boundary, Verification log 2; F4)
  pullSurface: 1, // definition: the pull at the top = 1 g
  pullCentre: 0, // #20 the pull at the centre (V5)
} as const;
const ALLOWED = new Set<number>(Object.values(GAUGE));

/** Stop labels (the saffron end-stop). Heat and pressure stops carry no number (F9). */
export const STOP = {
  speed: "8 km/s", // #2
  pull: "1.09 g", // #3 (only from l02 line 2 on: "one point oh nine")
  max: "MAX",
} as const;
export type StopLabel = (typeof STOP)[keyof typeof STOP];

/** The big HEAT dial's design range (6-24): ticks only, never labelled (storyboard §3). */
export const BIG_HEAT_MAX = 7000;
/** PULL rail position for a pull in g: the stop (v = 1) is the 1.09 g peak (#3). */
export const pullValue = (g: number) => g / GAUGE.pullTop;

export type GaugeState = {
  /** 0..1 of the scale; 1 = at the stop; > 1 runs into the overflow zone (clamped just past the stop) */
  value: number;
  /** end-stop label (from STOP); omit for an unlabelled saffron stop */
  stop?: StopLabel | null;
  /** a GAUGE value or null (no readout). Integers roll as a Counter; decimals fade in */
  readout?: number | null;
  /** 0..1: the Counter rolls from 0 up to `readout` (1 = settled on it) */
  roll?: number;
  /** "~" prefix (Kola's ~180 °C) */
  approx?: boolean;
  /** "± 500" after the number (must be GAUGE.tol) */
  tol?: number;
  /** a different unit for SPEED ("km/h" with speedKmh) or PULL ("×") */
  unit?: "km/s" | "km/h" | "°C" | "atm" | "g" | "×";
  /** off the scale: the needle slams past the stop and quivers ±5° at 10 Hz, chevrons flicker */
  pinned?: boolean;
  /** the "?" tag replaces the readout; the needle is hidden */
  unknown?: boolean;
  /** 0..1 of the gauge fading up (C-07: the stack fades in one by one) */
  appear?: number;
};
export type HeatState = GaugeState & {
  /** 0..1: the HEAT pointer snaps off and spins away (6-25); 1 = gone */
  broken?: number;
  /** the second, larger HEAT dial (0-7,000 design range, ticks only; pass value = °C / BIG_HEAT_MAX) */
  big?: boolean;
};

export type L14GaugesProps = {
  family: Family;
  frame: number;
  /** plate tone: "dark" on bright families, "light" on dark ones (default from family.dark) */
  theme?: "dark" | "light";
  /** 0.78 scale, anchored top-right */
  compact?: boolean;
  /** 0..1 shake of the whole cluster (the core boundary, C-09) */
  rattle?: number;
  /** only the gauges given are drawn (storyboard: a shot shows only what it names) */
  speed?: GaugeState;
  heat?: HeatState;
  pressure?: GaugeState;
  pull?: GaugeState;
  /** cluster origin (left, top); cells are 340 × 205 at 235-px pitch */
  x?: number;
  y?: number;
  opacity?: number;
};

const D2R = Math.PI / 180;
const OVER = 1.15; // the scale runs 15 % past the stop (the overflow zone)
const pt = (cx: number, cy: number, r: number, deg: number): [number, number] => [cx + Math.cos(deg * D2R) * r, cy + Math.sin(deg * D2R) * r];
const arcD = (cx: number, cy: number, r: number, d0: number, d1: number) => {
  const [ax, ay] = pt(cx, cy, r, d0);
  const [bx, by] = pt(cx, cy, r, d1);
  return `M${ax.toFixed(1)} ${ay.toFixed(1)} A${r} ${r} 0 ${d1 - d0 > 180 ? 1 : 0} 1 ${bx.toFixed(1)} ${by.toFixed(1)}`;
};
/** quiver: ±1 at 10 Hz (3 frames per cycle at 30 fps) */
const quiver = (f: number, seed = 0) => Math.sin(((f + seed) * 2 * Math.PI) / 3);
/** effective scale position: pinned slams just past the stop */
const eff = (s: GaugeState) => (s.pinned ? 1.1 : Math.max(0, Math.min(1.12, s.value)));

const check = (s: GaugeState, who: string) => {
  if (s.readout != null && !ALLOWED.has(s.readout)) throw new Error(`L14Gauges ${who}: readout ${s.readout} is not in the GAUGE table (sources.md)`);
  if (s.tol != null && s.tol !== GAUGE.tol) throw new Error(`L14Gauges ${who}: tol ${s.tol} is not GAUGE.tol`);
};

type Ink = { plate: string; edge: string; ink: string; dim: string };
const inkOf = (F: Family, theme: "dark" | "light"): Ink =>
  theme === "dark"
    ? { plate: alpha(F.shadow, 0.88), edge: alpha(L14_COLORS.bone, 0.35), ink: L14_COLORS.bone, dim: alpha(L14_COLORS.bone, 0.55) }
    : { plate: alpha(F.light, 0.14), edge: alpha(L14_COLORS.bone, 0.55), ink: L14_COLORS.bone, dim: alpha(L14_COLORS.bone, 0.6) };

const W = 340;
const H = 205;

const Plate: React.FC<{ x: number; y: number; ink: Ink; title: string }> = ({ x, y, ink, title }) => (
  <g>
    <rect x={x} y={y} width={W} height={H} rx={22} fill={ink.plate} stroke={ink.edge} strokeWidth={2} />
    <text x={x + 18} y={y + 32} style={{ fontFamily: IF2.label, fontSize: 20, letterSpacing: 3, fill: ink.ink }}>
      {title}
    </text>
  </g>
);

/** Number plate: vermilion slab, bone digits; integers roll (Counter), decimals fade in. */
const Readout: React.FC<{ x: number; y: number; s: GaugeState; unit: string; size?: number }> = ({ x, y, s, unit, size = 30 }) => {
  if (s.readout == null) return null;
  const v = s.readout;
  const roll = Math.max(0, Math.min(1, s.roll ?? 1));
  const isInt = Number.isInteger(v);
  const digits = isInt ? Math.max(1, String(Math.round(v)).length) : 0;
  const cw = size * 0.6;
  const numW = isInt ? digits * cw + Math.floor((digits - 1) / 3) * size * 0.22 : String(v).length * cw * 0.95;
  const pre = s.approx ? "~" : "";
  const post = (s.tol ? ` ± ${s.tol.toLocaleString("en-US")}` : "") + " " + unit;
  const preW = pre ? size * 0.55 : 0;
  const postW = post.length * size * 0.36;
  const w = preW + numW + postW + 28;
  const x0 = x - w / 2;
  const st: React.CSSProperties = { fontFamily: IF2.num, fontWeight: 800, fontSize: size, fontVariantNumeric: "tabular-nums", fill: P.bone };
  return (
    <g>
      <rect x={x0} y={y - size * 0.95} width={w} height={size * 1.3} rx={size * 0.2} fill={P.vermilion} />
      {pre ? (
        <text x={x0 + 12} y={y} style={st}>
          {pre}
        </text>
      ) : null}
      {isInt ? (
        <Counter x={x0 + 14 + preW} y={y} value={v * roll} max={v} digits={digits} size={size} color={P.bone} align="start" />
      ) : (
        <text x={x0 + 14 + preW} y={y} style={{ ...st, opacity: roll }}>
          {String(v)}
        </text>
      )}
      <text x={x0 + 14 + preW + numW + 4} y={y} style={{ fontFamily: IF2.num, fontWeight: 600, fontSize: size * 0.6, fill: P.bone }}>
        {post}
      </text>
    </g>
  );
};

const Chevrons: React.FC<{ x: number; y: number; f: number; dir: "up" | "right"; s?: number }> = ({ x, y, f, dir, s = 12 }) => (
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

/** A needle dial over [d0, d1] degrees (screen clockwise from +x). Scale 0..OVER; the stop sits at 1. */
const NeedleDial: React.FC<{ cx: number; cy: number; r: number; d0: number; d1: number; s: GaugeState; f: number; ink: Ink; ticks: number; band?: [number, number, string] }> = ({ cx, cy, r, d0, d1, s, f, ink, ticks, band }) => {
  const ang = (v: number) => d0 + (v / OVER) * (d1 - d0);
  const a = ang(eff(s)) + (s.pinned ? quiver(f) * 5 : Math.sin(f / 4) * 0.6);
  const stopA = ang(1);
  const [nx, ny] = pt(cx, cy, r * 0.86, a);
  const [tx, ty] = pt(cx, cy, r * 0.22, a + 180);
  return (
    <g>
      {/* backdrop: a half-disc for the half-dial (a full disc spilled below the plate), a disc otherwise */}
      {d1 - d0 <= 180 ? (
        <path d={`${arcD(cx, cy, r + 10, d0, d1)} Z`} fill={alpha("#000", 0.18)} />
      ) : (
        <circle cx={cx} cy={cy} r={r + 10} fill={alpha("#000", 0.18)} />
      )}
      <path d={arcD(cx, cy, r, d0, stopA)} fill="none" stroke={ink.dim} strokeWidth={6} strokeLinecap="round" />
      {/* the overflow zone past the stop, saffron dashes */}
      <path d={arcD(cx, cy, r, stopA, d1)} fill="none" stroke={L14_COLORS.saffron} strokeWidth={6} strokeDasharray="6 6" opacity={0.7} />
      {band ? <path d={arcD(cx, cy, r, ang(band[0]), ang(band[1]))} fill="none" stroke={band[2]} strokeWidth={12} /> : null}
      {/* the vermilion fill arc up to the needle */}
      {!s.unknown ? <path d={arcD(cx, cy, r - 14, d0, Math.max(d0 + 0.5, Math.min(a, d1)))} fill="none" stroke={P.vermilion} strokeWidth={9} strokeLinecap="round" opacity={0.85} /> : null}
      {Array.from({ length: ticks + 1 }, (_, i) => {
        const [x1, y1] = pt(cx, cy, r - 6, ang((i / ticks) * 1));
        const [x2, y2] = pt(cx, cy, r + 8, ang((i / ticks) * 1));
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={ink.ink} strokeWidth={2.5} />;
      })}
      {/* the saffron stop: a thick bar (bends when pinned) */}
      {(() => {
        const bend = s.pinned ? 4 + quiver(f, 1) * 2 : 0;
        const [x1, y1] = pt(cx, cy, r - 18, stopA);
        const [x2, y2] = pt(cx, cy, r + 16, stopA + bend);
        return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={L14_COLORS.saffron} strokeWidth={8} strokeLinecap="round" />;
      })()}
      {s.unknown ? null : (
        <g>
          <line x1={tx} y1={ty} x2={nx} y2={ny} stroke={P.vermilion} strokeWidth={6} strokeLinecap="round" />
          <circle cx={cx} cy={cy} r={11} fill={P.vermilion} />
          <circle cx={cx} cy={cy} r={4.5} fill={P.bone} />
        </g>
      )}
      {s.pinned ? (() => {
        const [cx2, cy2] = pt(cx, cy, r + 30, stopA + 10);
        return <Chevrons x={cx2} y={cy2} f={f} dir="right" s={9} />;
      })() : null}
    </g>
  );
};

const StopText: React.FC<{ x: number; y: number; text?: StopLabel | null; anchor?: "start" | "middle" | "end" }> = ({ x, y, text, anchor = "start" }) =>
  text ? (
    <text x={x} y={y} textAnchor={anchor} style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 19, fill: L14_COLORS.saffron }}>
      {text}
    </text>
  ) : null;

// ------------------------------------------------------------------------------------------------------------------
// the four gauges (each draws inside its 340 × 205 cell at x, y)
// ------------------------------------------------------------------------------------------------------------------

export const SpeedGauge: React.FC<{ x: number; y: number; s: GaugeState; f: number; ink: Ink }> = ({ x, y, s, f, ink }) => {
  check(s, "SPEED");
  const cx = x + 140;
  const cy = y + 148;
  const [sx, sy] = pt(cx, cy, 116, 180 + 180 / OVER);
  return (
    <g>
      <Plate x={x} y={y} ink={ink} title="SPEED" />
      <NeedleDial cx={cx} cy={cy} r={100} d0={180} d1={360} s={s} f={f} ink={ink} ticks={8} />
      <StopText x={sx + 8} y={sy - 4} text={s.stop} />
      {s.unknown ? <UnknownTag x={x + 290} y={y + 150} size={28} /> : <Readout x={cx} y={y + 192} s={s} unit={s.unit ?? "km/s"} size={26} />}
    </g>
  );
};

export const HeatGauge: React.FC<{ x: number; y: number; s: HeatState; f: number; ink: Ink }> = ({ x, y, s, f, ink }) => {
  check(s, "HEAT");
  if (s.big) {
    // the second, larger dial (6-24): 0-7,000 design range, unlabelled ticks, a saffron band over 6,000 ± 500 (#17)
    const cx = x + 170;
    const cy = y + 112;
    const bigS: GaugeState = { ...s, value: s.value * OVER }; // value is a share of 0-7,000: the dial's full sweep
    const lo = ((GAUGE.boundaryT - GAUGE.tol) / BIG_HEAT_MAX) * OVER;
    const hi = ((GAUGE.boundaryT + GAUGE.tol) / BIG_HEAT_MAX) * OVER;
    return (
      <g>
        <Plate x={x} y={y} ink={ink} title="HEAT" />
        <NeedleDial cx={cx} cy={cy} r={82} d0={135} d1={405} s={bigS} f={f} ink={ink} ticks={14} band={[lo, hi, L14_COLORS.saffron]} />
        {s.unknown ? <UnknownTag x={x + 300} y={y + 150} size={28} /> : <Readout x={cx} y={y + 196} s={s} unit={s.unit ?? "°C"} size={24} />}
      </g>
    );
  }
  const c0 = x + 66;
  const c1 = x + 316;
  const cy = y + 104;
  const at = (v: number) => c0 + (v / OVER) * (c1 - c0);
  const v = eff(s) + (s.pinned ? quiver(f) * 0.02 : 0);
  const fx = at(v);
  const br = Math.max(0, Math.min(1, s.broken ?? 0));
  // the pointer: a vermilion arrow riding the column's fill end; broken = snaps off, flies up-right, spins
  const px = fx + br * 160;
  const py = cy - 34 - br * 120 + br * br * 60;
  const rot = br * 540;
  return (
    <g>
      <Plate x={x} y={y} ink={ink} title="HEAT" />
      {/* column + bulb */}
      <rect x={c0 - 6} y={cy - 14} width={c1 - c0 + 20} height={28} rx={14} fill={alpha("#000", 0.22)} stroke={ink.ink} strokeWidth={2.5} />
      {/* the warm band (everyday warmth, unlabelled numbers) */}
      <rect x={at(0.02)} y={cy - 14} width={at(0.14) - at(0.02)} height={28} fill={L14_COLORS.warm} opacity={0.75} />
      {/* overflow zone past the stop */}
      <rect x={at(1)} y={cy - 14} width={c1 + 14 - at(1)} height={28} rx={10} fill={L14_COLORS.saffron} opacity={0.22} />
      {!s.unknown ? <rect x={c0 - 4} y={cy - 8} width={Math.max(0, fx - c0 + 4)} height={16} rx={8} fill={P.vermilion} /> : null}
      <circle cx={x + 44} cy={cy} r={24} fill={s.unknown ? alpha("#000", 0.25) : P.vermilion} stroke={ink.ink} strokeWidth={2.5} />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={at(i / 8)} y1={cy + 18} x2={at(i / 8)} y2={cy + 30} stroke={ink.ink} strokeWidth={2} />
      ))}
      <line x1={at(1)} y1={cy - 26} x2={at(1) + (s.pinned ? 4 + quiver(f, 1) * 2 : 0)} y2={cy + 30} stroke={L14_COLORS.saffron} strokeWidth={7} strokeLinecap="round" />
      <StopText x={at(1)} y={cy - 32} text={s.stop} anchor="middle" />
      {!s.unknown && br < 1 ? (
        <g transform={`translate(${px.toFixed(1)} ${py.toFixed(1)}) rotate(${rot.toFixed(1)})`} opacity={1 - Math.max(0, br - 0.7) / 0.3}>
          <path d="M0 18 L-11 -6 L11 -6 Z" fill={P.vermilion} stroke={P.bone} strokeWidth={2} />
        </g>
      ) : null}
      {s.pinned ? <Chevrons x={c1 + 2} y={cy - 40} f={f} dir="up" s={9} /> : null}
      {s.unknown ? <UnknownTag x={x + 190} y={y + 168} size={26} /> : <Readout x={x + 190} y={y + 184} s={s} unit={s.unit ?? "°C"} size={26} />}
    </g>
  );
};

export const PressureGauge: React.FC<{ x: number; y: number; s: GaugeState; f: number; ink: Ink }> = ({ x, y, s, f, ink }) => {
  check(s, "PRESSURE");
  const cx = x + 96;
  const cy = y + 118;
  const ox = x + 188;
  const oy = y + 96;
  const ow = 140;
  const oh = 46;
  // blank odometer drums roll with the needle (stripes only, never digits) until a readout is given
  const spinRate = s.pinned ? 9 : 3 + eff(s) * 4;
  return (
    <g>
      <Plate x={x} y={y} ink={ink} title="PRESSURE" />
      <NeedleDial cx={cx} cy={cy} r={68} d0={135} d1={405} s={s} f={f} ink={ink} ticks={10} />
      <StopText x={x + 96} y={y + 32} text={s.stop} anchor="middle" />
      {s.unknown ? (
        <UnknownTag x={ox + ow / 2} y={oy + oh / 2} size={26} />
      ) : s.readout != null ? (
        <Readout x={x + 245} y={y + 190} s={s} unit={s.unit ?? "atm"} size={21} />
      ) : (
        <g>
          <defs>
            <clipPath id={`odo${Math.round(x)}${Math.round(y)}`}>
              <rect x={ox} y={oy} width={ow} height={oh} rx={8} />
            </clipPath>
          </defs>
          <rect x={ox} y={oy} width={ow} height={oh} rx={8} fill={alpha("#000", 0.35)} stroke={ink.ink} strokeWidth={2} />
          <g clipPath={`url(#odo${Math.round(x)}${Math.round(y)})`}>
            {Array.from({ length: 5 }, (_, k) => {
              const off = ((f * spinRate * (1 + k * 0.35)) % 24) - 24;
              return (
                <g key={k}>
                  {Array.from({ length: 5 }, (_, j) => (
                    <rect key={j} x={ox + 6 + k * 27} y={oy + off + j * 24} width={22} height={10} rx={3} fill={ink.dim} />
                  ))}
                </g>
              );
            })}
          </g>
          <text x={ox + ow / 2} y={oy + oh + 26} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 15, letterSpacing: 2, fill: ink.dim }}>
            atm
          </text>
        </g>
      )}
    </g>
  );
};

export const PullGauge: React.FC<{ x: number; y: number; s: GaugeState; f: number; ink: Ink }> = ({ x, y, s, f, ink }) => {
  check(s, "PULL");
  const rx = x + 280;
  const top = y + 30;
  const floor = y + 186;
  const at = (v: number) => floor - (v / OVER) * (floor - top);
  const v = eff(s) + (s.pinned ? quiver(f) * 0.02 : 0);
  const sy = at(v);
  // the spring coil from the floor up to the slider (zero = the slider resting on the floor)
  const coils = 9;
  const coil: string[] = [`M${rx} ${floor}`];
  for (let i = 1; i <= coils * 2; i++) coil.push(`L${rx + (i % 2 ? 16 : -16)} ${floor - ((floor - sy - 10) * i) / (coils * 2)}`);
  coil.push(`L${rx} ${sy + 10}`);
  return (
    <g>
      <Plate x={x} y={y} ink={ink} title="PULL" />
      <rect x={rx - 24} y={top - 4} width={48} height={floor - top + 8} rx={10} fill={alpha("#000", 0.22)} stroke={ink.ink} strokeWidth={2} />
      <line x1={rx - 40} y1={floor + 6} x2={rx + 40} y2={floor + 6} stroke={ink.ink} strokeWidth={4} strokeLinecap="round" />
      {/* surface mark (1 g by definition) and the floor's 0 (#20) */}
      <line x1={rx - 36} y1={at(1 / GAUGE.pullTop)} x2={rx - 24} y2={at(1 / GAUGE.pullTop)} stroke={ink.ink} strokeWidth={2.5} />
      <text x={rx - 42} y={at(1 / GAUGE.pullTop) + 6} textAnchor="end" style={{ fontFamily: IF2.num, fontWeight: 700, fontSize: 16, fill: ink.dim }}>
        1
      </text>
      <text x={rx - 42} y={floor + 2} textAnchor="end" style={{ fontFamily: IF2.num, fontWeight: 700, fontSize: 16, fill: ink.dim }}>
        0
      </text>
      <line x1={rx - 30} y1={at(1)} x2={rx + 30 + (s.pinned ? quiver(f, 1) * 3 : 0)} y2={at(1)} stroke={L14_COLORS.saffron} strokeWidth={7} strokeLinecap="round" />
      <StopText x={rx - 42} y={at(1) - 8} text={s.stop} anchor="end" />
      {!s.unknown ? (
        <g>
          <path d={coil.join(" ")} fill="none" stroke={P.vermilion} strokeWidth={4} strokeLinejoin="round" />
          <rect x={rx - 30} y={sy - 10} width={60} height={20} rx={6} fill={P.vermilion} stroke={P.bone} strokeWidth={2} />
          <path d={`M${rx + 30} ${sy} L${rx + 46} ${sy - 9} L${rx + 46} ${sy + 9} Z`} fill={P.vermilion} />
        </g>
      ) : null}
      {s.pinned ? <Chevrons x={rx} y={top - 12} f={f} dir="up" s={9} /> : null}
      {s.unknown ? <UnknownTag x={x + 130} y={y + 120} size={28} /> : <Readout x={x + 130} y={y + 128} s={s} unit={s.unit ?? "g"} size={28} />}
    </g>
  );
};

const fadeIn = (s: GaugeState | undefined) => (s ? Math.max(0, Math.min(1, s.appear ?? 1)) : 0);

/** The cluster: SPEED, HEAT, PRESSURE, PULL stacked at frame right. Omitted gauges are not drawn (their slot stays). */
export const L14Gauges: React.FC<L14GaugesProps> = ({ family: F, frame: f, theme, compact = false, rattle = 0, speed, heat, pressure, pull, x = 1530, y = 72, opacity = 1 }) => {
  const ink = inkOf(F, theme ?? (F.dark ? "light" : "dark"));
  const k = compact ? 0.78 : 1;
  const sh = rattle > 0 ? [Math.sin(f * 2.7) * 7 * rattle + Math.sin(f * 5.1) * 3 * rattle, Math.cos(f * 3.3) * 5 * rattle] : [0, 0];
  const ax = x + W; // anchor top-right for compact
  const slots: [GaugeState | undefined, number, (yy: number, a: number) => React.ReactNode][] = [
    [speed, 0, (yy) => (speed ? <SpeedGauge x={x} y={yy} s={speed} f={f} ink={ink} /> : null)],
    [heat, 1, (yy) => (heat ? <HeatGauge x={x} y={yy} s={heat} f={f} ink={ink} /> : null)],
    [pressure, 2, (yy) => (pressure ? <PressureGauge x={x} y={yy} s={pressure} f={f} ink={ink} /> : null)],
    [pull, 3, (yy) => (pull ? <PullGauge x={x} y={yy} s={pull} f={f} ink={ink} /> : null)],
  ];
  return (
    <g opacity={opacity} transform={`translate(${(sh[0] + ax * (1 - k)).toFixed(2)} ${(sh[1] + y * (1 - k)).toFixed(2)}) scale(${k})`}>
      {slots.map(([s, i, draw]) => {
        const a = fadeIn(s);
        if (!s || a <= 0) return null;
        const yy = y + i * 235;
        return (
          <g key={i} opacity={a} transform={`translate(0 ${((1 - a) * 30).toFixed(1)})`}>
            {draw(yy, a)}
          </g>
        );
      })}
    </g>
  );
};

/** The cluster on its own screen-locked layer: drop this inside a <Stage>, last. */
export const L14GaugesHUD: React.FC<L14GaugesProps> = (p) => (
  <Layer depth={0}>
    <L14Gauges {...p} />
  </Layer>
);
