// L15 shared props (BUILD.md §5). Props are shared; the shots that use them stay bespoke (hard rule 1). Signatures are
// stable: ask before changing one. Every continuously visible prop has built-in motion (pennant sway, glints, swarm,
// flicker) so a held shot still reads alive, but the shot's MOVING SUBJECT is still the scene's job.
// F1: the faller is the PROBE. `Jumper` is the only person-shaped prop: ≤ 120 px, no face, whole-shape moves only.
// F2: no logos, insignia or brand colours. F7: the probe never glows or heats (its lamp is a lamp).
// USAGE (one line each; f = the shot's frame)
//   <Probe x y size f variant="plain|spin|float" tilt? lamp? trail?={px} />  capsule, nose DOWN at tilt 0; spin tumbles 4.5°/f
//   <Balloon x y size f inflate?={0..1} variant="gondola|capsule|beam" payload?={node} />  (x, y) = the payload hook
//   <Jumper x y h?≤120 f pose="stand|step|hang|spin|drop" color? />  (x, y) = feet (stand/step/drop) or hands (hang)
//   <Chute x y size f open={0..1} cross?={0..1} kind="drogue|main" />  (x, y) = the load point; canopy above it
//   <Station x y size f glint? />  generic modular station, two solar arrays, a glint sweeping the panels
//   <AirCube x y size n f speed?=5 color? />  glass cube with n dots swarming at `speed` px/f
//   <Trace pts head={0..1} f color? width? peak?={index} end?={label} dashed? />  a curve drawn up to a glowing head
//   <Bracket x1 y1 x2 y2 draw={0..1} label? color? />  dimension bracket drawn end to end, label at the middle
//   <Stamp x y text age={frames since slam} size? rotate? color? />  slams in from 2.4× (≈ 40 px/f), dust ring
//   <Pin x y text draw={0..1} dx? dy? color? fill? />  saffron leader from a point to a label chip
//   <Flame x y angle len f on={0..1} />  thruster burst (7-15): flickering saffron cone + puffs
//   <Spiral x y r f speed?=4 arms?=3 color? />  the villain's swirl, rotating `speed` °/f
//   <Stopwatch x y r f end={table seconds} t={0..1} family? />  hand + m:ss readout rolling to `end` (checked)
//   <CardPanel x y w h f title sky?={stops} appear? family? >children</CardPanel>  the tall jump card, sky panel clipped
//   ClockFace / Plate / Seesaw re-exported read-only from L14 (BUILD.md §1 allows it)
import React, { useId } from "react";
import { Bloom, Emissive, Family, IF2, LightCone, alpha, labelCase, mixHex, rnd, smoothPath, type Pt } from "../../lib/illustrated";
import { L15_COLORS } from "./families";
import { assertAllowed, mss } from "./jumpdata";

export { ClockFace, Plate, Seesaw } from "../L14-earth-tunnel/props";

const C = L15_COLORS;
const TAU = Math.PI * 2;
const sid = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, "");
const cl01 = (v: number) => Math.max(0, Math.min(1, v));
const sm = (t: number) => {
  const u = cl01(t);
  return u * u * (3 - 2 * u);
};
const poly = (pts: [number, number][]) => "M" + pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L") + " Z";

// ---------------------------------------------------------------------------------------------------------------
// The probe
// ---------------------------------------------------------------------------------------------------------------

export type ProbeVariant = "plain" | "spin" | "float";
export type ProbeProps = {
  /** centre of the body */
  x: number;
  y: number;
  /** body length in px (nose to aerial base) */
  size: number;
  f: number;
  /** plain = falling nose-down (pennant streams); spin = tumbling 4.5°/f; float = weightless, slow roll, pennant slack */
  variant?: ProbeVariant;
  /** degrees added to the variant's rotation; 0 = nose DOWN */
  tilt?: number;
  /** the nose lamp + its light cone (default on) */
  lamp?: boolean;
  /** length (px) of the speed streaks behind the probe (0 = none); streaks run UP from the body when falling */
  trail?: number;
  /** spin rate override (°/f) for the spin variant */
  spinRate?: number;
};

/** The faceted capsule: teal body in three facets, saffron band, gold nose, lamp, aerial with a swaying pennant. */
export const Probe: React.FC<ProbeProps> = ({ x, y, size: L, f, variant = "plain", tilt = 0, lamp = true, trail = 0, spinRate = 4.5 }) => {
  const w = L * 0.46;
  const h = L * 0.62;
  const top = -h / 2;
  const bot = h / 2;
  const ch = w * 0.28;
  const body: [number, number][] = [
    [-w / 2 + ch, top],
    [w / 2 - ch, top],
    [w / 2, top + ch],
    [w / 2, bot - ch * 0.4],
    [w * 0.36, bot],
    [-w * 0.36, bot],
    [-w / 2, bot - ch * 0.4],
    [-w / 2, top + ch],
  ];
  const noseTip = bot + L * 0.3;
  const flutter = variant === "float" ? 0.25 : 1;
  const sway = Math.sin(f / 5) * 10 * flutter + Math.sin(f / 2.3) * 4 * flutter;
  const rot = tilt + (variant === "spin" ? f * spinRate : variant === "float" ? Math.sin(f / 40) * 14 + f * 0.25 : Math.sin(f / 23) * 2.5);
  const bob = variant === "float" ? Math.sin(f / 31) * L * 0.05 : 0;
  // lamp blink: a short bright pulse every 36 f (a beacon, not heat)
  const beacon = 0.55 + 0.45 * Math.max(0, Math.cos(((f % 36) / 36) * TAU));
  return (
    <g transform={`translate(${x.toFixed(1)} ${(y + bob).toFixed(1)})`}>
      {trail > 0 && variant !== "float" ? (
        <g stroke={C.bone} strokeLinecap="round" fill="none">
          {Array.from({ length: 7 }, (_, i) => {
            const sx = (rnd(i * 7 + 3) - 0.5) * w * 1.6;
            const ph = ((f * 0.9 + rnd(i * 5) * 20) % 20) / 20; // streaks peel off upward
            const len = trail * (0.45 + rnd(i * 11) * 0.55);
            const y0 = top - 8 - ph * trail * 0.5;
            return <line key={i} x1={sx} y1={y0} x2={sx} y2={y0 - len} strokeWidth={Math.max(1.5, L * 0.018) * (1.2 - ph)} opacity={0.55 * (1 - ph)} />;
          })}
        </g>
      ) : null}
      <g transform={`rotate(${rot.toFixed(2)})`}>
        {lamp ? <LightCone x={0} y={noseTip - 6} angle={90} length={L * 2.4} spread={18} color={C.probeNose} strength={0.45} /> : null}
        <line x1={w * 0.18} y1={top} x2={w * 0.18} y2={top - L * 0.34} stroke={C.bone} strokeWidth={Math.max(2, L * 0.022)} strokeLinecap="round" />
        <path
          d={`M${w * 0.18} ${top - L * 0.34} q ${L * 0.12} ${(-6 + sway * 0.4).toFixed(1)} ${L * 0.24} ${(sway * 0.6 + (1 - flutter) * L * 0.12).toFixed(1)} L ${w * 0.18} ${top - L * 0.22} Z`}
          fill={C.saffron}
        />
        <path d={poly(body)} fill={C.probe} />
        <path d={poly([body[0], [-w * 0.12, top], [-w * 0.18, bot], body[5], body[6], body[7]])} fill={mixHex(C.probe, "#E6FFF8", 0.35)} />
        <path d={poly([[w * 0.16, top], body[1], body[2], body[3], body[4], [w * 0.12, bot]])} fill={C.probeShade} />
        <path d={poly(body)} fill="none" stroke="#0A3A40" strokeWidth={Math.max(2, L * 0.016)} strokeLinejoin="round" />
        <rect x={-w / 2} y={-h * 0.08} width={w} height={h * 0.08} fill={C.saffron} opacity={0.9} />
        <circle cx={0} cy={-h * 0.28} r={w * 0.18} fill="#0A3C4C" stroke={C.bone} strokeWidth={Math.max(2, L * 0.016)} />
        <circle cx={-w * 0.05} cy={-h * 0.32} r={w * 0.06} fill="#E6FFF8" opacity={0.8} />
        <path d={`M${-w * 0.36} ${bot} L${w * 0.36} ${bot} L0 ${noseTip} Z`} fill={C.probeNose} />
        <path d={`M0 ${bot} L${w * 0.36} ${bot} L0 ${noseTip} Z`} fill={mixHex(C.probeNose, "#9C6A16", 0.35)} />
        {lamp ? <circle cx={0} cy={noseTip - L * 0.06} r={L * 0.045} fill="#FFFBEA" opacity={beacon} /> : null}
      </g>
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Balloon (translucent teal film; the payload hangs at (x, y))
// ---------------------------------------------------------------------------------------------------------------

export const Balloon: React.FC<{
  x: number;
  y: number;
  /** envelope height when full (px) */
  size: number;
  f: number;
  /** 0 = launch (a tall, mostly empty bubble on top of slack film) .. 1 = full round envelope at float height */
  inflate?: number;
  variant?: "gondola" | "capsule" | "beam";
  /** drawn at the hook (e.g. a <Jumper pose="hang">); for gondola/capsule it sits on the rail/door */
  payload?: React.ReactNode;
  /** length of the load line from envelope to payload (px) */
  line?: number;
  opacity?: number;
}> = ({ x, y, size, f, inflate = 1, variant = "gondola", payload, line, opacity = 1 }) => {
  const id = "bal" + sid(useId());
  const k = cl01(inflate);
  const ll = line ?? size * 0.55;
  const swing = Math.sin(f / 47) * 2.2 + Math.sin(f / 19) * 0.6; // whole rig pendulum, degrees
  const H = size * (1.25 - 0.25 * k); // a launch balloon is taller
  const Wb = size * (0.34 + 0.56 * k); // and much narrower
  const topY = -ll - H;
  const bulbH = H * (0.32 + 0.6 * k); // the gas bubble at the top
  // envelope outline: round bulb on top tapering to the load line
  const pts: Pt[] = [];
  for (let i = 0; i <= 24; i++) {
    const u = i / 24; // 0 top .. 1 bottom (load point)
    const yy = topY + u * H;
    const b = bulbH / H;
    const p = 1.3 + 1.7 * (1 - k); // a launch balloon's slack film narrows fast below the bubble
    const r = u < b ? (Wb / 2) * Math.pow(Math.sin((u / b) * (Math.PI / 2)), 0.6) : Math.max(2, (Wb / 2) * Math.pow((1 - u) / (1 - b), p));
    const flap = Math.sin(f / 9 + u * 6) * (1 - k) * 4 * u;
    pts.push([r + flap, yy]);
  }
  const right = pts.map(([r, yy]) => [r, yy] as Pt);
  const left = [...pts].reverse().map(([r, yy]) => [-r, yy] as Pt);
  const outline = smoothPath([...right, ...left], 0.5) + " Z";
  const glint = ((f * 2.2) % (Wb * 1.6)) - Wb * 0.8; // a light band sweeping across the film
  return (
    <g opacity={opacity} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${swing.toFixed(2)} 0 ${(-ll - H).toFixed(1)})`}>
      <defs>
        <clipPath id={id}>
          <path d={outline} />
        </clipPath>
        <linearGradient id={id + "g"} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={mixHex(C.film, "#FFFFFF", 0.35)} stopOpacity={0.75} />
          <stop offset="0.45" stopColor={C.film} stopOpacity={0.5} />
          <stop offset="1" stopColor={C.tealDeep} stopOpacity={0.55} />
        </linearGradient>
      </defs>
      {/* load line */}
      <line x1={0} y1={topY + H - 2} x2={0} y2={0} stroke={C.bone} strokeWidth={Math.max(1.5, size * 0.008)} opacity={0.85} />
      <path d={outline} fill={`url(#${id}g)`} />
      <g clipPath={`url(#${id})`}>
        {/* gores */}
        {Array.from({ length: 7 }, (_, i) => {
          const u = (i + 1) / 8 - 0.5;
          return <path key={i} d={`M${u * Wb * 0.2} ${topY} Q ${u * Wb * 1.1} ${topY + bulbH * 0.6} ${u * Wb * 0.25} ${topY + H}`} stroke={C.bone} strokeWidth={1.4} fill="none" opacity={0.35} />;
        })}
        <rect x={glint} y={topY} width={Wb * 0.16} height={H} fill="#FFFFFF" opacity={0.22} transform={`skewX(-12)`} />
      </g>
      <path d={outline} fill="none" stroke={mixHex(C.film, "#FFFFFF", 0.4)} strokeWidth={Math.max(1.5, size * 0.01)} opacity={0.9} />
      {/* payload */}
      {variant === "gondola" ? (
        <g>
          <path d={`M${-size * 0.09} 0 L0 ${-size * 0.07} L${size * 0.09} 0`} stroke={C.bone} strokeWidth={1.5} fill="none" />
          <rect x={-size * 0.09} y={0} width={size * 0.18} height={size * 0.12} rx={size * 0.012} fill={C.saffron} stroke={C.saffronDeep} strokeWidth={2} />
          <rect x={-size * 0.03} y={size * 0.02} width={size * 0.06} height={size * 0.1} fill="#0A3C4C" />
          <line x1={-size * 0.13} y1={size * 0.12} x2={size * 0.13} y2={size * 0.12} stroke={C.bone} strokeWidth={3} strokeLinecap="round" />
          {payload ? <g transform={`translate(${size * 0.13} ${size * 0.12})`}>{payload}</g> : null}
        </g>
      ) : variant === "capsule" ? (
        <g>
          <path d={`M${-size * 0.08} 0 L0 ${-size * 0.06} L${size * 0.08} 0`} stroke={C.bone} strokeWidth={1.5} fill="none" />
          <ellipse cx={0} cy={size * 0.08} rx={size * 0.1} ry={size * 0.09} fill={C.tealDeep} stroke={C.bone} strokeWidth={2} />
          <ellipse cx={-size * 0.03} cy={size * 0.05} rx={size * 0.035} ry={size * 0.03} fill={C.bone} opacity={0.5} />
          <rect x={size * 0.02} y={size * 0.04} width={size * 0.06} height={size * 0.09} rx={size * 0.01} fill="#0A3C4C" />
          <line x1={size * 0.06} y1={size * 0.17} x2={size * 0.16} y2={size * 0.17} stroke={C.bone} strokeWidth={3} strokeLinecap="round" />
          {payload ? <g transform={`translate(${size * 0.13} ${size * 0.17})`}>{payload}</g> : null}
        </g>
      ) : (
        <g>
          <path d={`M${-size * 0.12} 0 L0 ${-size * 0.08} L${size * 0.12} 0`} stroke={C.bone} strokeWidth={1.5} fill="none" />
          <rect x={-size * 0.14} y={-3} width={size * 0.28} height={6} rx={3} fill={C.saffron} />
          {payload ? <g transform={`translate(0 3)`}>{payload}</g> : null}
        </g>
      )}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Jumper: the F1 silhouette (≤ 120 px, no face, whole-shape moves only)
// ---------------------------------------------------------------------------------------------------------------

export type JumperPose = "stand" | "step" | "hang" | "spin" | "drop";
export const Jumper: React.FC<{ x: number; y: number; h?: number; f: number; pose?: JumperPose; color?: string; facing?: 1 | -1; spinRate?: number }> = ({
  x,
  y,
  h = 90,
  f,
  pose = "stand",
  color = C.teal,
  facing = 1,
  spinRate = 6,
}) => {
  const H = Math.min(120, h); // F1 hard cap
  const s = H / 100; // shape drawn in a 100-unit box, feet at 0, head top at −100
  const shade = mixHex(color, "#04121A", 0.35);
  const visor = mixHex(color, "#04121A", 0.65);
  // body parts (units): helmet r 11 at (0, −86); torso −74..−40; legs −40..0; chest pack
  const legs =
    pose === "step"
      ? `M-9 -42 L-12 0 L-3 0 L-1 -30 L6 -2 L15 -6 L6 -42 Z`
      : pose === "hang"
        ? `M-9 -42 L-8 0 L-1 0 L0 -26 L1 0 L8 0 L9 -42 Z`
        : pose === "drop"
          ? `M-9 -42 L-14 -2 L-6 0 L0 -26 L6 0 L14 -2 L9 -42 Z`
          : `M-9 -42 L-10 0 L-2 0 L0 -28 L2 0 L10 0 L9 -42 Z`;
  const arms =
    pose === "hang"
      ? `M-13 -72 L-9 -112 L-3 -112 L-5 -74 Z M13 -72 L9 -112 L3 -112 L5 -74 Z`
      : pose === "drop"
        ? `M-13 -72 L-30 -60 L-28 -54 L-12 -62 Z M13 -72 L30 -60 L28 -54 L12 -62 Z`
        : `M-14 -72 L-17 -44 L-11 -44 L-9 -70 Z M14 -72 L17 -44 L11 -44 L9 -70 Z`;
  // whole-shape motion: hang sways, spin turns, drop/step breathe a little
  const ox = 0;
  const oy = pose === "hang" ? 112 : 0; // hang: (x, y) is the hands
  const rot = pose === "spin" ? f * spinRate : pose === "hang" ? Math.sin(f / 21) * 4 : Math.sin(f / 37) * 1.2;
  const pivotY = pose === "spin" ? -55 : pose === "hang" ? -112 : 0;
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(s * facing).toFixed(3)} ${s.toFixed(3)}) translate(${ox} ${oy})`}>
      <g transform={`rotate(${rot.toFixed(2)} 0 ${pivotY})`}>
        <path d={legs} fill={shade} />
        <path d={arms} fill={shade} />
        <path d="M-15 -76 Q-16 -40 -10 -40 L10 -40 Q16 -40 15 -76 Q0 -80 -15 -76 Z" fill={color} />
        <rect x={-10} y={-70} width={20} height={14} rx={3} fill={C.saffron} opacity={0.9} />
        <circle cx={0} cy={-88} r={12} fill={color} />
        {/* visor: one dark plate, no features (F1) */}
        <path d="M-2 -95 Q10 -95 10 -86 Q10 -80 -2 -80 Z" fill={visor} />
        <circle cx={0} cy={-88} r={12} fill="none" stroke={shade} strokeWidth={2} />
      </g>
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Chute: stabiliser (drogue) or main canopy
// ---------------------------------------------------------------------------------------------------------------

export const Chute: React.FC<{ x: number; y: number; size: number; f: number; open: number; cross?: number; kind?: "drogue" | "main"; color?: string }> = ({
  x,
  y,
  size,
  f,
  open,
  cross = 0,
  kind = "drogue",
  color,
}) => {
  const o = sm(open);
  const col = color ?? (kind === "main" ? C.saffron : C.teal);
  const lineLen = size * (kind === "main" ? 1.5 : 1.9);
  const breathe = 1 + Math.sin(f / 6) * 0.04 * o;
  const sway = Math.sin(f / 17) * 4;
  const cw = size * (0.18 + 0.82 * o) * breathe; // canopy width
  const chH = size * (0.55 - 0.2 * o); // canopy height (streamer → dome)
  const cy = -lineLen * (0.75 + 0.25 * o);
  const lip = Math.sin(f / 3) * 3 * o;
  const dome = `M${-cw / 2} ${cy} Q ${-cw / 2} ${cy - chH} 0 ${cy - chH} Q ${cw / 2} ${cy - chH} ${cw / 2} ${cy} Q ${cw / 4} ${cy - chH * 0.18 + lip} 0 ${cy - chH * 0.1} Q ${-cw / 4} ${cy - chH * 0.18 - lip} ${-cw / 2} ${cy} Z`;
  const xa = sm(cross);
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${sway.toFixed(2)})`}>
      {[-0.5, -0.17, 0.17, 0.5].map((u, i) => (
        <line key={i} x1={0} y1={0} x2={u * cw} y2={cy} stroke={C.bone} strokeWidth={1.6} opacity={0.8} />
      ))}
      <path d={dome} fill={col} stroke={mixHex(col, "#04121A", 0.4)} strokeWidth={2.5} />
      <path d={`M${-cw * 0.3} ${cy - chH * 0.7} Q 0 ${cy - chH * 1.02} ${cw * 0.3} ${cy - chH * 0.7}`} stroke="#FFFFFF" strokeWidth={3} fill="none" opacity={0.35} />
      {kind === "main"
        ? [-0.25, 0, 0.25].map((u, i) => <line key={i} x1={u * cw} y1={cy - chH * 0.95} x2={u * cw * 1.6} y2={cy} stroke={mixHex(col, "#04121A", 0.3)} strokeWidth={1.5} />)
        : null}
      {xa > 0 ? (
        <g stroke={C.saffron} strokeWidth={Math.max(6, size * 0.08)} strokeLinecap="round">
          <line x1={-size * 0.6} y1={cy - chH - size * 0.15} x2={-size * 0.6 + size * 1.2 * Math.min(1, xa * 2)} y2={cy - chH - size * 0.15 + (chH + size * 0.6) * Math.min(1, xa * 2)} />
          {xa > 0.5 ? <line x1={size * 0.6} y1={cy - chH - size * 0.15} x2={size * 0.6 - size * 1.2 * (xa * 2 - 1)} y2={cy - chH - size * 0.15 + (chH + size * 0.6) * (xa * 2 - 1)} /> : null}
        </g>
      ) : null}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Station: generic modular silhouette (no insignia, F2)
// ---------------------------------------------------------------------------------------------------------------

export const Station: React.FC<{ x: number; y: number; size: number; f: number; tilt?: number; glint?: boolean }> = ({ x, y, size: S, f, tilt = -6, glint = true }) => {
  const id = "stn" + sid(useId());
  const truss = S * 0.9;
  const panelW = S * 0.17;
  const panelH = S * 0.32;
  const sweep = ((f * 9) % (S * 1.6)) - S * 0.8; // glint sweeping across the arrays at 9 px/f
  const nav = (f % 40) < 5 ? 1 : 0.25;
  const panel = (px: number, py: number, k: number) => (
    <g key={k}>
      <rect x={px - panelW / 2} y={py} width={panelW} height={panelH} fill="#1B5FA8" stroke={C.limb} strokeWidth={1.5} />
      {Array.from({ length: 5 }, (_, i) => (
        <line key={i} x1={px - panelW / 2} y1={py + ((i + 1) * panelH) / 6} x2={px + panelW / 2} y2={py + ((i + 1) * panelH) / 6} stroke={C.limb} strokeWidth={1} opacity={0.6} />
      ))}
      <line x1={px} y1={py} x2={px} y2={py + panelH} stroke={C.limb} strokeWidth={1} opacity={0.6} />
    </g>
  );
  const arrays: React.ReactNode[] = [];
  let k = 0;
  for (const side of [-1, 1]) {
    for (const j of [0, 1]) {
      const px = side * (truss / 2 - j * panelW * 1.15 - panelW * 0.6);
      arrays.push(panel(px, -panelH - S * 0.02, k++));
      arrays.push(panel(px, S * 0.02, k++));
    }
  }
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${tilt})`}>
      <defs>
        <clipPath id={id}>
          {[-1, 1].flatMap((side) =>
            [0, 1].flatMap((j) => {
              const px = side * (truss / 2 - j * panelW * 1.15 - panelW * 0.6);
              return [
                <rect key={`${side}${j}a`} x={px - panelW / 2} y={-panelH - S * 0.02} width={panelW} height={panelH} />,
                <rect key={`${side}${j}b`} x={px - panelW / 2} y={S * 0.02} width={panelW} height={panelH} />,
              ];
            }),
          )}
        </clipPath>
      </defs>
      <rect x={-truss / 2} y={-S * 0.012} width={truss} height={S * 0.024} fill={C.bone} />
      {arrays}
      {glint ? (
        <g clipPath={`url(#${id})`}>
          <rect x={sweep} y={-S} width={S * 0.08} height={S * 2} fill="#BFF6FF" opacity={0.55} transform="skewX(-20)" />
        </g>
      ) : null}
      {/* modules along the middle */}
      <rect x={-S * 0.2} y={-S * 0.045} width={S * 0.4} height={S * 0.09} rx={S * 0.04} fill={C.bone} stroke={C.tealDeep} strokeWidth={2} />
      <rect x={-S * 0.035} y={-S * 0.13} width={S * 0.07} height={S * 0.26} rx={S * 0.03} fill={mixHex(C.bone, C.teal, 0.25)} stroke={C.tealDeep} strokeWidth={2} />
      <rect x={S * 0.08} y={-S * 0.06} width={S * 0.05} height={S * 0.12} fill={C.saffron} opacity={0.9} />
      {/* radiators */}
      <rect x={-S * 0.12} y={S * 0.06} width={S * 0.05} height={S * 0.1} fill={C.cloud} opacity={0.8} />
      <circle cx={S * 0.2} cy={0} r={S * 0.012} fill={C.saffronCore} opacity={nav} />
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// AirCube: a glass cube of swarming dots (dot count = density); also used by the AIR gauge
// ---------------------------------------------------------------------------------------------------------------

export const AirCube: React.FC<{ x: number; y: number; size: number; n: number; f: number; speed?: number; color?: string; glass?: string; seed?: number; edge?: string }> = ({
  x,
  y,
  size: S,
  n,
  f,
  speed = 5,
  color = C.bone,
  glass = C.limb,
  seed = 3,
  edge,
}) => {
  const d = S * 0.28; // depth offset (back face up-right)
  const pad = S * 0.08;
  const r = Math.max(2.2, S * 0.022);
  const tri = (u: number) => {
    const m = ((u % 2) + 2) % 2;
    return m < 1 ? m : 2 - m;
  };
  const span = S - 2 * pad;
  const ec = edge ?? mixHex(glass, "#FFFFFF", 0.35);
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
      {/* back face + depth edges */}
      <rect x={d} y={-d} width={S} height={S} fill={alpha(glass, 0.08)} stroke={ec} strokeWidth={1.5} opacity={0.6} />
      {[
        [0, 0, d, -d],
        [S, 0, S + d, -d],
        [0, S, d, S - d],
        [S, S, S + d, S - d],
      ].map(([a, b, c2, e], i) => (
        <line key={i} x1={a} y1={b} x2={c2} y2={e} stroke={ec} strokeWidth={1.5} opacity={0.6} />
      ))}
      <rect x={0} y={0} width={S} height={S} fill={alpha(glass, 0.14)} />
      <g fill={color}>
        {Array.from({ length: Math.max(0, Math.round(n)) }, (_, i) => {
          const vx = (0.6 + rnd(seed * 7 + i) * 0.8) * speed * (rnd(seed * 13 + i) > 0.5 ? 1 : -1);
          const vy = (0.6 + rnd(seed * 17 + i) * 0.8) * speed * (rnd(seed * 19 + i) > 0.5 ? 1 : -1);
          const px = pad + tri(rnd(seed * 3 + i) * 2 + (f * vx) / span) * span;
          const py = pad + tri(rnd(seed * 5 + i) * 2 + (f * vy) / span) * span;
          const z = rnd(seed * 23 + i); // depth: back dots smaller, shifted up-right
          return <circle key={i} cx={px + z * d * 0.8} cy={py - z * d * 0.8} r={r * (1 - z * 0.35)} opacity={0.65 + 0.35 * (1 - z)} />;
        })}
      </g>
      <rect x={0} y={0} width={S} height={S} fill="none" stroke={ec} strokeWidth={2.5} />
      <path d={`M${S * 0.08} ${S * 0.3} L${S * 0.08} ${S * 0.08} L${S * 0.3} ${S * 0.08}`} stroke="#FFFFFF" strokeWidth={2.5} fill="none" opacity={0.55} />
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Trace: a curve drawn up to a glowing head
// ---------------------------------------------------------------------------------------------------------------

/** Points along a polyline up to share `head` (by length); returns the partial list (last = the head). */
export const partialPts = (pts: Pt[], head: number): Pt[] => {
  if (pts.length < 2) return pts;
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const total = seg.reduce((a, b) => a + b, 0);
  let left = cl01(head) * total;
  const out: Pt[] = [pts[0]];
  for (let i = 0; i < seg.length; i++) {
    if (left >= seg[i]) {
      out.push(pts[i + 1]);
      left -= seg[i];
    } else {
      const u = seg[i] > 0 ? left / seg[i] : 0;
      out.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * u, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * u]);
      break;
    }
  }
  return out;
};

export const Trace: React.FC<{
  pts: Pt[];
  head: number;
  f: number;
  color?: string;
  width?: number;
  /** index into pts: a saffron peak tick appears once the head passes it */
  peak?: number;
  peakLabel?: string;
  /** label chip at the end once head = 1 */
  end?: string;
  dashed?: boolean;
  /** dim copy of the full curve under the drawn part (a ghost) */
  ghost?: number;
  smooth?: boolean;
}> = ({ pts, head, f, color = C.saffron, width = 6, peak, peakLabel, end, dashed = false, ghost = 0, smooth = true }) => {
  const part = partialPts(pts, head);
  const d = (p: Pt[]) => (smooth && p.length > 2 ? smoothPath(p, 0.5) : "M" + p.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(" L"));
  const hp = part[part.length - 1];
  const pulse = 1 + 0.25 * Math.sin(f / 3);
  let peakOn = false;
  if (peak != null && pts[peak]) {
    const upto = partialPts(pts, 1).slice(0, peak + 1);
    peakOn = part.length > upto.length - 1 && head > 0;
  }
  return (
    <g>
      {ghost > 0 ? <path d={d(pts)} fill="none" stroke={color} strokeWidth={width * 0.6} opacity={ghost} strokeDasharray="3 9" strokeLinecap="round" /> : null}
      {part.length > 1 ? (
        <path d={d(part)} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dashed ? `${width * 2} ${width * 1.6}` : undefined} strokeDashoffset={dashed ? -f * 4 : undefined} />
      ) : null}
      {head > 0 && head < 1 ? (
        <g>
          <Bloom x={hp[0]} y={hp[1]} r={width * 5 * pulse} color={C.saffronCore} strength={0.8} />
          <circle cx={hp[0]} cy={hp[1]} r={width * 1.1} fill={C.saffronCore} stroke={color} strokeWidth={2} />
        </g>
      ) : null}
      {peakOn && peak != null ? (
        <g>
          <line x1={pts[peak][0]} y1={pts[peak][1] - 26} x2={pts[peak][0]} y2={pts[peak][1] - 6} stroke={C.saffron} strokeWidth={4} strokeLinecap="round" />
          <circle cx={pts[peak][0]} cy={pts[peak][1]} r={width * 0.9} fill={C.saffron} />
          {peakLabel ? (
            <text x={pts[peak][0]} y={pts[peak][1] - 34} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 18, letterSpacing: 2, fill: C.saffronCore }}>
              {labelCase(peakLabel)}
            </text>
          ) : null}
        </g>
      ) : null}
      {end && head >= 1 ? (
        <g>
          <rect x={hp[0] + 12} y={hp[1] - 17} width={end.length * 12 + 24} height={34} rx={17} fill={alpha("#04121A", 0.72)} stroke={color} strokeWidth={2} />
          <text x={hp[0] + 24} y={hp[1] + 7} style={{ fontFamily: IF2.label, fontSize: 18, letterSpacing: 2, fill: C.saffronCore }}>
            {labelCase(end)}
          </text>
        </g>
      ) : null}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Bracket, Stamp, Pin
// ---------------------------------------------------------------------------------------------------------------

export const Bracket: React.FC<{ x1: number; y1: number; x2: number; y2: number; draw: number; label?: string; color?: string; tick?: number; labelColor?: string }> = ({
  x1,
  y1,
  x2,
  y2,
  draw,
  label,
  color = C.saffron,
  tick = 14,
  labelColor,
}) => {
  const t = sm(draw);
  const dx = x2 - x1;
  const dy = y2 - y1;
  const L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L;
  const ny = dx / L;
  const ex = x1 + dx * t;
  const ey = y1 + dy * t;
  const a = (Math.atan2(dy, dx) * 180) / Math.PI;
  return (
    <g stroke={color} strokeLinecap="round" fill="none">
      <line x1={x1 + nx * tick} y1={y1 + ny * tick} x2={x1 - nx * tick} y2={y1 - ny * tick} strokeWidth={4} />
      <line x1={x1} y1={y1} x2={ex} y2={ey} strokeWidth={4} />
      {t > 0.02 && t < 1 ? <circle cx={ex} cy={ey} r={7} fill={C.saffronCore} stroke={color} strokeWidth={2} /> : null}
      {t >= 1 ? <line x1={x2 + nx * tick} y1={y2 + ny * tick} x2={x2 - nx * tick} y2={y2 - ny * tick} strokeWidth={4} /> : null}
      {t >= 1 ? (
        <g transform={`translate(${x2} ${y2}) rotate(${a})`}>
          <path d="M0 0 L-16 -9 L-16 9 Z" fill={color} stroke="none" />
        </g>
      ) : null}
      {label && t > 0.6 ? (
        <text
          x={(x1 + x2) / 2 + nx * (tick + 22)}
          y={(y1 + y2) / 2 + ny * (tick + 22) + 8}
          textAnchor="middle"
          stroke="none"
          opacity={sm((t - 0.6) / 0.4)}
          style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 30, fill: labelColor ?? C.saffronCore }}
        >
          {label}
        </text>
      ) : null}
    </g>
  );
};

export const Stamp: React.FC<{ x: number; y: number; text: string; age: number; size?: number; rotate?: number; color?: string; ink?: string }> = ({
  x,
  y,
  text,
  age,
  size = 64,
  rotate = -8,
  color = C.saffron,
  ink = "#1A1206",
}) => {
  if (age < 0) return null;
  const SL = 6; // slam frames
  const k = age < SL ? 2.4 - 1.4 * (age / SL) ** 2 : 1 + Math.max(0, 0.06 * Math.sin((age - SL) * 1.4) * Math.exp(-(age - SL) / 5));
  const o = age < SL ? 0.4 + 0.6 * (age / SL) : 1;
  const w = text.length * size * 0.62 + size * 1.0;
  const h = size * 1.45;
  const ring = age >= SL ? (age - SL) * 14 : 0;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      {age >= SL && age < SL + 14 ? (
        <ellipse cx={0} cy={0} rx={w / 2 + ring} ry={h / 2 + ring * 0.5} fill="none" stroke={color} strokeWidth={4} opacity={1 - (age - SL) / 14} />
      ) : null}
      <g transform={`scale(${k.toFixed(3)})`} opacity={o}>
        <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={size * 0.16} fill={color} />
        <rect x={-w / 2 + 6} y={-h / 2 + 6} width={w - 12} height={h - 12} rx={size * 0.12} fill="none" stroke={ink} strokeWidth={3} />
        <text x={0} y={size * 0.34} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: size, letterSpacing: size * 0.08, fill: ink }}>
          {labelCase(text)}
        </text>
      </g>
    </g>
  );
};

export const Pin: React.FC<{ x: number; y: number; text: string; draw: number; dx?: number; dy?: number; color?: string; fill?: string; textColor?: string; size?: number }> = ({
  x,
  y,
  text,
  draw,
  dx = 120,
  dy = -60,
  color = C.saffron,
  fill = "rgba(4,18,26,0.72)",
  textColor = C.saffronCore,
  size = 20,
}) => {
  const t = sm(draw);
  const ex = x + dx * Math.min(1, t * 1.4);
  const ey = y + dy * Math.min(1, t * 1.4);
  const chipA = sm((t - 0.6) / 0.4);
  const w = labelCase(text).length * size * 0.62 + size * 1.4;
  const left = dx < 0;
  return (
    <g>
      <circle cx={x} cy={y} r={7} fill={color} />
      <circle cx={x} cy={y} r={12} fill="none" stroke={color} strokeWidth={2} opacity={0.6 * t} />
      <line x1={x} y1={y} x2={ex} y2={ey} stroke={color} strokeWidth={3} strokeLinecap="round" />
      {chipA > 0 ? (
        <g opacity={chipA}>
          <rect x={left ? ex - w : ex} y={ey - size * 0.85} width={w} height={size * 1.7} rx={size * 0.85} fill={fill} stroke={color} strokeWidth={2} />
          <text x={left ? ex - w + size * 0.7 : ex + size * 0.7} y={ey + size * 0.36} style={{ fontFamily: IF2.label, fontSize: size, letterSpacing: size * 0.12, fill: textColor }}>
            {labelCase(text)}
          </text>
        </g>
      ) : null}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Flame (thruster burst, 7-15) and Spiral (the villain)
// ---------------------------------------------------------------------------------------------------------------

export const Flame: React.FC<{ x: number; y: number; angle: number; len: number; f: number; on?: number }> = ({ x, y, angle, len, f, on = 1 }) => {
  const k = sm(on);
  if (k <= 0) return null;
  const fl = 0.85 + 0.15 * Math.sin(f * 1.9) + 0.08 * Math.sin(f * 4.7);
  const L = len * k * fl;
  const W = len * 0.22 * k;
  const cone = `M0 ${-W / 2} Q ${L * 0.45} ${-W * 0.7} ${L} 0 Q ${L * 0.45} ${W * 0.7} 0 ${W / 2} Z`;
  const core = `M0 ${-W / 4} Q ${L * 0.3} ${-W * 0.3} ${L * 0.55} 0 Q ${L * 0.3} ${W * 0.3} 0 ${W / 4} Z`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <Emissive d={cone} color={C.saffron} core={C.saffron} fill strength={0.8} glow={16} />
      <path d={core} fill={C.saffronCore} />
      {Array.from({ length: 6 }, (_, i) => {
        const ph = ((f * 0.06 + i / 6) % 1 + 1) % 1;
        return <circle key={i} cx={L * (0.6 + ph * 0.9)} cy={(rnd(i * 3) - 0.5) * W * (0.5 + ph)} r={W * (0.12 + ph * 0.25)} fill={C.cloud} opacity={(1 - ph) * 0.45 * k} />;
      })}
    </g>
  );
};

export const Spiral: React.FC<{ x: number; y: number; r: number; f: number; speed?: number; arms?: number; color?: string; opacity?: number; width?: number }> = ({
  x,
  y,
  r,
  f,
  speed = 4,
  arms = 3,
  color = C.meso,
  opacity = 0.9,
  width = 10,
}) => {
  const turns = 1.6;
  return (
    <g transform={`translate(${x} ${y}) rotate(${(f * speed).toFixed(2)})`} opacity={opacity}>
      {Array.from({ length: arms }, (_, a) => {
        const pts: Pt[] = [];
        for (let i = 0; i <= 40; i++) {
          const u = i / 40;
          const th = a * (TAU / arms) + u * turns * TAU;
          const rr = r * (0.06 + 0.94 * u ** 1.3);
          pts.push([Math.cos(th) * rr, Math.sin(th) * rr]);
        }
        return (
          <g key={a}>
            <path d={smoothPath(pts, 0.5)} fill="none" stroke={color} strokeWidth={width * 2.2} strokeLinecap="round" opacity={0.25} />
            <path d={smoothPath(pts, 0.5)} fill="none" stroke={a === 0 ? C.limb : color} strokeWidth={width} strokeLinecap="round" />
          </g>
        );
      })}
      <circle cx={0} cy={0} r={width * 1.4} fill={C.saffronCore} />
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Stopwatch and CardPanel
// ---------------------------------------------------------------------------------------------------------------

/** A stopwatch whose hand and m:ss readout roll from 0 to `end` seconds (must be a jumpdata time) as t goes 0 → 1. */
export const Stopwatch: React.FC<{ x: number; y: number; r: number; f: number; end: number; t: number; family?: Family; ring?: string; showText?: boolean }> = ({
  x,
  y,
  r,
  f,
  end,
  t,
  family,
  ring = C.saffron,
  showText = true,
}) => {
  assertAllowed(end, "Stopwatch end");
  const s = end * cl01(t);
  const ink = family?.text ?? C.bone;
  const a = (s % 60) * 6 - 90;
  const sweep = cl01(t);
  const [hx, hy] = [x + Math.cos((a * Math.PI) / 180) * r * 0.78, y + Math.sin((a * Math.PI) / 180) * r * 0.78];
  const prog = (() => {
    const th = -90 + 359.9 * sweep;
    const ex = x + Math.cos((th * Math.PI) / 180) * (r + 10);
    const ey = y + Math.sin((th * Math.PI) / 180) * (r + 10);
    return `M${x} ${y - r - 10} A${r + 10} ${r + 10} 0 ${sweep > 0.5 ? 1 : 0} 1 ${ex.toFixed(1)} ${ey.toFixed(1)}`;
  })();
  const shake = t > 0 && t < 1 ? Math.sin(f * 2.1) * 0.6 : 0;
  return (
    <g transform={`translate(0 ${shake.toFixed(2)})`}>
      <rect x={x - r * 0.16} y={y - r - r * 0.32} width={r * 0.32} height={r * 0.2} rx={4} fill={ring} />
      <circle cx={x} cy={y} r={r} fill={alpha("#04121A", 0.75)} stroke={ink} strokeWidth={3} />
      {sweep > 0 ? <path d={prog} fill="none" stroke={ring} strokeWidth={7} strokeLinecap="round" /> : null}
      {Array.from({ length: 12 }, (_, i) => {
        const th = (i * 30 * Math.PI) / 180;
        return <line key={i} x1={x + Math.cos(th) * r * 0.82} y1={y + Math.sin(th) * r * 0.82} x2={x + Math.cos(th) * r * 0.94} y2={y + Math.sin(th) * r * 0.94} stroke={ink} strokeWidth={2.5} />;
      })}
      <line x1={x} y1={y} x2={hx} y2={hy} stroke={C.vermilion} strokeWidth={5} strokeLinecap="round" />
      <circle cx={x} cy={y} r={7} fill={C.vermilion} />
      {showText ? (
        <text x={x} y={y + r * 0.5} textAnchor="middle" style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: r * 0.34, fill: ink, fontVariantNumeric: "tabular-nums" }}>
          {mss(t >= 1 ? end : Math.floor(s))}
        </text>
      ) : null}
    </g>
  );
};

/** The tall jump card (2-02…2-16): a plate with a name header and a sky panel inside; children are clipped to the panel
 *  and drawn in card coordinates (0, 0 = the panel's top-left). Built-in: thin cloud streaks crossing the panel. */
export const CardPanel: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  f: number;
  title: string;
  sub?: string;
  /** panel sky stops top → bottom (default: a dawn apricot-to-indigo) */
  sky?: string[];
  appear?: number;
  family?: Family;
  children?: React.ReactNode;
}> = ({ x, y, w, h, f, title, sub, sky = ["#13215E", "#2C6FD0", "#E3813F", "#F6B45A"], appear = 1, family, children }) => {
  const id = "card" + sid(useId());
  const a = sm(appear);
  const head = 86;
  const px = 18;
  const pw = w - 2 * px;
  const ph = h - head - px;
  const plate = family ? mixHex(family.shadow, "#000000", 0.1) : "#14384A";
  const ink = "#F2FBF7";
  return (
    <g opacity={a} transform={`translate(${x} ${y + (1 - a) * 40})`}>
      <rect x={6} y={10} width={w} height={h} rx={26} fill="#000" opacity={0.18} />
      <rect x={0} y={0} width={w} height={h} rx={26} fill={plate} stroke={alpha(ink, 0.35)} strokeWidth={2} />
      <text x={px + 4} y={46} style={{ fontFamily: IF2.display, fontWeight: 800, fontSize: 34, fill: ink }}>
        {title}
      </text>
      {sub ? (
        <text x={px + 4} y={74} style={{ fontFamily: IF2.label, fontSize: 17, letterSpacing: 2.5, fill: alpha(ink, 0.7) }}>
          {labelCase(sub)}
        </text>
      ) : null}
      <defs>
        <clipPath id={id}>
          <rect x={px} y={head} width={pw} height={ph} rx={16} />
        </clipPath>
        <linearGradient id={id + "s"} x1="0" y1="0" x2="0" y2="1">
          {sky.map((c, i) => (
            <stop key={i} offset={i / Math.max(1, sky.length - 1)} stopColor={c} />
          ))}
        </linearGradient>
      </defs>
      <g clipPath={`url(#${id})`}>
        <rect x={px} y={head} width={pw} height={ph} fill={`url(#${id}s)`} />
        {Array.from({ length: 4 }, (_, i) => {
          const L = pw * (0.3 + rnd(i * 3) * 0.3);
          const sp = 1.8 + rnd(i * 7) * 1.2;
          const xx = px + ((((rnd(i * 5) * (pw + L) + f * sp) % (pw + L)) + pw + L) % (pw + L)) - L;
          const yy = head + ph * (0.15 + 0.6 * rnd(i * 11));
          return <rect key={i} x={xx} y={yy} width={L} height={6} rx={3} fill={C.cloud} opacity={0.35} />;
        })}
        <g transform={`translate(${px} ${head})`}>{children}</g>
      </g>
      <rect x={px} y={head} width={pw} height={ph} rx={16} fill="none" stroke={alpha(ink, 0.4)} strokeWidth={2} />
    </g>
  );
};
