// L14 shared props (BUILD.md §5). Props are shared; the shots that use them stay bespoke (hard rule 1). Each package
// polishes the props in its column of BUILD.md §6; signatures are stable (ask before changing one). No numbers are
// drawn here: clock plates and honesty plates take their text from the scene (with a sources row beside the literal).
// F13: the traveller is ALWAYS the probe; the cabin shows floating tools and a pennant, never a body.
// Reuse rather than redraw: kit Plume / Cumulus / CloudRack / Tick; L13's Notebook (episodes/L13-loudest-sound/props).
import React from "react";
import { Emissive, Family, IF2, LightCone, alpha, mixHex, rnd } from "../../lib/illustrated";
import { L14_COLORS } from "./families";

const C = L14_COLORS;

// ---------------------------------------------------------------------------------------------------------------
// The probe
// ---------------------------------------------------------------------------------------------------------------

export type ProbeVariant = "plain" | "cabin" | "lit" | "scrape";
export type ProbeProps = {
  /** centre of the body */
  x: number;
  y: number;
  /** body length in px (nose to aerial base); ~120-260 in tunnel shots */
  size: number;
  f: number;
  variant?: ProbeVariant;
  /** degrees; 0 = nose DOWN (falling), 180 = nose up (rising past the centre) */
  tilt?: number;
  /** the lamp in the nose, with a light cone ahead */
  lamp?: boolean;
  /** 0..1 strength of the underlight (iron sea) for "lit"; sparks rate for "scrape" */
  amount?: number;
  /** which side scrapes (scrape variant) */
  side?: -1 | 1;
  /** pennant flutter 0..1 (1 = streaming, 0 = slack: the weightless cabin) */
  flutter?: number;
};

/** The faceted capsule: teal body in three facets, gold nose, lamp, aerial with a swaying pennant. */
export const Probe: React.FC<ProbeProps> = ({ x, y, size: L, f, variant = "plain", tilt = 0, lamp = true, amount = 1, side = 1, flutter = 1 }) => {
  const w = L * 0.46;
  const h = L * 0.62; // body (the nose adds ~0.3 L below)
  const top = -h / 2;
  const bot = h / 2;
  const ch = w * 0.28; // chamfer
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
  const poly = (pts: [number, number][]) => "M" + pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L") + " Z";
  const noseTip = bot + L * 0.3;
  const sway = Math.sin(f / 5) * 10 * flutter + Math.sin(f / 2.3) * 4 * flutter;
  const lit = variant === "lit" ? amount : 0;
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${tilt.toFixed(2)})`}>
      {lamp ? <LightCone x={0} y={noseTip - 6} angle={90} length={L * 2.6} spread={20} color={C.probeNose} strength={0.55} /> : null}
      {/* aerial + pennant */}
      <line x1={w * 0.18} y1={top} x2={w * 0.18} y2={top - L * 0.34} stroke={C.bone} strokeWidth={Math.max(2, L * 0.022)} strokeLinecap="round" />
      <path
        d={`M${w * 0.18} ${top - L * 0.34} q ${L * 0.12} ${(-6 + sway * 0.4).toFixed(1)} ${L * 0.24} ${(sway * 0.6 + (1 - flutter) * L * 0.12).toFixed(1)} L ${w * 0.18} ${top - L * 0.22} Z`}
        fill={C.saffron}
      />
      {/* body facets: lit left, mid front, shadow right */}
      <path d={poly(body)} fill={C.probe} />
      <path d={poly([body[0], [-w * 0.12, top], [-w * 0.18, bot], body[5], body[6], body[7]])} fill={mixHex(C.probe, "#E6FFF8", 0.35)} />
      <path d={poly([[w * 0.16, top], body[1], body[2], body[3], body[4], [w * 0.12, bot]])} fill={C.probeShade} />
      <path d={poly(body)} fill="none" stroke={mixHex(C.probeShade, "#03171D", 0.5)} strokeWidth={Math.max(2, L * 0.016)} strokeLinejoin="round" />
      {/* band + porthole (or the cabin cut-away) */}
      <rect x={-w / 2} y={-h * 0.08} width={w} height={h * 0.08} fill={C.saffron} opacity={0.9} />
      {variant === "cabin" ? (
        <CabinCutaway w={w * 0.82} h={h * 0.72} y={-h * 0.04} f={f} />
      ) : (
        <g>
          <circle cx={0} cy={-h * 0.28} r={w * 0.18} fill="#0A3C4C" stroke={C.bone} strokeWidth={Math.max(2, L * 0.016)} />
          <circle cx={-w * 0.05} cy={-h * 0.32} r={w * 0.06} fill="#E6FFF8" opacity={0.8} />
        </g>
      )}
      {/* gold nose: two facets */}
      <path d={`M${-w * 0.36} ${bot} L${w * 0.36} ${bot} L0 ${noseTip} Z`} fill={C.probeNose} />
      <path d={`M${w * 0.0} ${bot} L${w * 0.36} ${bot} L0 ${noseTip} Z`} fill={mixHex(C.probeNose, "#9C6A16", 0.35)} />
      {lamp ? <circle cx={0} cy={noseTip - L * 0.06} r={L * 0.045} fill="#FFFBEA" /> : null}
      {lit > 0 ? (
        <g opacity={lit}>
          <path d={poly(body)} fill={C.outer} opacity={0.28} />
          <path d={`M${-w / 2} ${bot - ch * 0.4} L${-w * 0.36} ${bot} L${w * 0.36} ${bot} L${w / 2} ${bot - ch * 0.4}`} stroke={C.innerCore} strokeWidth={Math.max(3, L * 0.03)} fill="none" />
        </g>
      ) : null}
      {variant === "scrape" ? <Sparks x={(side * w) / 2} y={bot * 0.4} f={f} dir={side} rate={amount} size={L} /> : null}
    </g>
  );
};

/** The cabin cut-away (7-08): loose pencil, wrench and bolt floating and turning; no body (F13). */
export const CabinCutaway: React.FC<{ w: number; h: number; y?: number; f: number }> = ({ w, h, y = 0, f }) => {
  const items = [
    { k: "pencil", ph: 0 },
    { k: "wrench", ph: 2.1 },
    { k: "bolt", ph: 4.2 },
  ];
  return (
    <g>
      <rect x={-w / 2} y={y - h / 2} width={w} height={h} rx={w * 0.12} fill="#0F3B4F" stroke={C.bone} strokeWidth={3} />
      {items.map((it, i) => {
        const px = Math.sin(f / 23 + it.ph) * w * 0.25;
        const py = y + Math.cos(f / 19 + it.ph) * h * 0.28;
        const a = f * (1.6 + i * 0.7) + it.ph * 50;
        const s = w * 0.11;
        return (
          <g key={it.k} transform={`translate(${px.toFixed(1)} ${py.toFixed(1)}) rotate(${a.toFixed(1)})`}>
            {it.k === "pencil" ? (
              <g>
                <rect x={-s * 1.6} y={-s * 0.22} width={s * 2.6} height={s * 0.44} fill={C.saffron} />
                <path d={`M${s} ${-s * 0.22} L${s * 1.6} 0 L${s} ${s * 0.22} Z`} fill="#FFE6C0" />
              </g>
            ) : it.k === "wrench" ? (
              <g fill={C.frost}>
                <rect x={-s * 1.3} y={-s * 0.18} width={s * 2.2} height={s * 0.36} rx={s * 0.15} />
                <path d={`M${s * 0.8} ${-s * 0.5} a ${s * 0.5} ${s * 0.5} 0 1 1 0 ${s} l ${s * 0.15} ${-s * 0.3} l 0 ${-s * 0.4} Z`} />
              </g>
            ) : (
              <path d={`M${-s * 0.5} ${-s * 0.3} L0 ${-s * 0.58} L${s * 0.5} ${-s * 0.3} L${s * 0.5} ${s * 0.3} L0 ${s * 0.58} L${-s * 0.5} ${s * 0.3} Z`} fill={C.crust} stroke="#7A4A1C" strokeWidth={2} />
            )}
          </g>
        );
      })}
    </g>
  );
};

/** Sparks spraying off a wall contact (4-08 scrape): short bright streaks, recycling every 12 frames. */
export const Sparks: React.FC<{ x: number; y: number; f: number; dir?: -1 | 1; rate?: number; size?: number }> = ({ x, y, f, dir = 1, rate = 1, size = 160 }) => (
  <g>
    {Array.from({ length: Math.round(10 * rate) }, (_, i) => {
      const life = 12;
      const t = ((f + i * 3.7) % life) / life;
      const a = (-110 - rnd(i) * 70) * (Math.PI / 180);
      const sp = size * (0.6 + rnd(i * 3) * 0.9);
      const sx = x + dir * Math.cos(a) * -sp * t;
      const sy = y + Math.sin(a) * sp * t + t * t * size * 0.4;
      const l = size * 0.12 * (1 - t);
      return <line key={i} x1={sx} y1={sy} x2={sx - dir * Math.cos(a) * -l} y2={sy - Math.sin(a) * l} stroke={i % 2 ? C.saffronCore : "#FFFBEA"} strokeWidth={3.5} strokeLinecap="round" opacity={1 - t} />;
    })}
  </g>
);

// ---------------------------------------------------------------------------------------------------------------
// The desert hatch and rig (cold open, 2-28, 8-13)
// ---------------------------------------------------------------------------------------------------------------

/** The round hatch in the sand: rim, dark shaft, a lid swinging open on its hinge (`open` 0..1 = 0..90°), seal clamps. */
export const HatchLid: React.FC<{ x: number; y: number; r: number; open?: number; family: Family; clamp?: number; f?: number }> = ({ x, y, r, open = 0, family: F, clamp = 0, f = 0 }) => {
  const o = Math.max(0, Math.min(1, open));
  const ry = r * 0.36;
  // the lid hinges at the back edge: its projected height grows from flat (ry) to upright (r)
  const lidH = ry + (r * 1.1 - ry) * Math.sin((o * Math.PI) / 2);
  const lidCy = y - ry - (lidH - ry) * 0.9 * o;
  return (
    <g>
      <ellipse cx={x} cy={y + ry * 0.25} rx={r * 1.35} ry={ry * 1.5} fill={alpha(F.shadow, 0.35)} />
      <ellipse cx={x} cy={y} rx={r * 1.12} ry={ry * 1.12} fill={mixHex(C.crustDeep, "#5A3414", 0.3)} />
      <ellipse cx={x} cy={y} rx={r} ry={ry} fill="#03171D" />
      <ellipse cx={x} cy={y + ry * 0.2} rx={r * 0.8} ry={ry * 0.6} fill="#0A3C4C" opacity={0.6 * o} />
      {/* clamps round the rim */}
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2 + 0.3;
        const cx = x + Math.cos(a) * r * 1.06;
        const cy = y + Math.sin(a) * ry * 1.06;
        return <rect key={i} x={cx - 7} y={cy - 5 - clamp * 6} width={14} height={10} rx={3} fill={C.saffron} transform={`rotate(${(clamp * 90).toFixed(1)} ${cx} ${cy})`} />;
      })}
      {/* the lid */}
      <ellipse cx={x} cy={o > 0.02 ? lidCy : y} rx={r} ry={o > 0.02 ? lidH / 2 + ry * 0.4 * (1 - o) : ry} fill={mixHex(C.teal, C.tealDeep, 0.3 + 0.4 * o)} stroke={C.bone} strokeWidth={4} />
      <ellipse cx={x} cy={o > 0.02 ? lidCy : y} rx={r * 0.55} ry={(o > 0.02 ? lidH / 2 : ry) * 0.5} fill="none" stroke={C.saffron} strokeWidth={5} opacity={0.85} />
      {o > 0.3 ? <circle cx={x + Math.sin(f / 8) * 2} cy={lidCy} r={8} fill={C.bone} /> : null}
    </g>
  );
};

/** The drilling/launch rig over the hatch: an A-frame with a winch drum turning and a cable down to `cableTo`. */
export const Rig: React.FC<{ x: number; y: number; h: number; f: number; cableTo?: number; turn?: number }> = ({ x, y, h, f, cableTo, turn = 1 }) => {
  const w = h * 0.7;
  const drum = h * 0.12;
  const a = f * 6 * turn;
  return (
    <g>
      <path d={`M${x - w / 2} ${y} L${x} ${y - h} L${x + w / 2} ${y}`} stroke={C.saffron} strokeWidth={h * 0.045} fill="none" strokeLinejoin="round" />
      <path d={`M${x - w * 0.32} ${y - h * 0.35} L${x + w * 0.32} ${y - h * 0.35}`} stroke={C.saffronDeep} strokeWidth={h * 0.03} />
      <line x1={x} y1={y - h} x2={x} y2={cableTo ?? y + h * 0.4} stroke={C.bone} strokeWidth={h * 0.012 + 2} />
      <g transform={`rotate(${a.toFixed(1)} ${x} ${y - h})`}>
        <circle cx={x} cy={y - h} r={drum} fill={C.tealDeep} stroke={C.bone} strokeWidth={4} />
        {[0, 1, 2].map((k) => (
          <line key={k} x1={x} y1={y - h} x2={x + Math.cos((k * 2 * Math.PI) / 3) * drum} y2={y - h + Math.sin((k * 2 * Math.PI) / 3) * drum} stroke={C.bone} strokeWidth={4} />
        ))}
      </g>
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Studio props
// ---------------------------------------------------------------------------------------------------------------

/** A spring hanging from (x, y) with a weight at `stretch` px below the anchor; coils squash and stretch. */
export const SpringWeight: React.FC<{ x: number; y: number; stretch: number; coils?: number; width?: number; weight?: number; color?: string; probe?: boolean; f?: number }> = ({ x, y, stretch, coils = 12, width = 46, weight = 80, color = C.saffron, probe = false, f = 0 }) => {
  const L = Math.max(40, stretch);
  const pts: string[] = [`M${x} ${y}`, `L${x} ${y + 14}`];
  for (let i = 1; i <= coils * 2; i++) pts.push(`L${x + (i % 2 ? width / 2 : -width / 2)} ${y + 14 + ((L - 28) * i) / (coils * 2)}`);
  pts.push(`L${x} ${y + L - 14}`, `L${x} ${y + L}`);
  return (
    <g>
      <rect x={x - 60} y={y - 16} width={120} height={16} rx={6} fill="#1E4A5C" />
      <path d={pts.join(" ")} stroke={color} strokeWidth={6} fill="none" strokeLinejoin="round" />
      {probe ? (
        <Probe x={x} y={y + L + weight * 0.55} size={weight * 1.3} f={f} lamp={false} />
      ) : (
        <g>
          <rect x={x - weight / 2} y={y + L} width={weight} height={weight * 0.9} rx={10} fill={C.tealDeep} />
          <rect x={x - weight / 2} y={y + L} width={weight * 0.4} height={weight * 0.9} rx={10} fill={C.teal} />
        </g>
      )}
    </g>
  );
};

/** A clock face: minute hand at `minutes` (0..60 per turn), an arc fill ring 0..1, an optional end plate (text from the
 *  scene, e.g. "19 MIN" with its sources row). Hand tip at r = 140 px turning 0.5°/f ≈ 1.2 px/f: pair with the ring. */
export const ClockFace: React.FC<{ x: number; y: number; r: number; minutes?: number; ring?: number; plate?: string | null; family: Family; ringColor?: string; shake?: number; f?: number; half?: number }> = ({ x, y, r, minutes = 0, ring = 0, plate = null, family: F, ringColor = C.saffron, shake = 0, f = 0, half = 0 }) => {
  const a = (minutes / 60) * 360 - 90;
  const sx = shake ? Math.sin(f * 2.9) * shake : 0;
  const arc = (t: number, rr: number) => {
    const e = -90 + Math.min(359.9, t * 360);
    const ex = x + Math.cos((e * Math.PI) / 180) * rr;
    const ey = y + Math.sin((e * Math.PI) / 180) * rr;
    return `M${x} ${y - rr} A${rr} ${rr} 0 ${t > 0.5 ? 1 : 0} 1 ${ex.toFixed(1)} ${ey.toFixed(1)}`;
  };
  return (
    <g transform={`translate(${sx.toFixed(2)} 0)`}>
      <circle cx={x + r * 0.05} cy={y + r * 0.07} r={r + 16} fill={alpha(F.shadow, 0.35)} />
      <circle cx={x} cy={y} r={r + 16} fill="#FFF4DE" stroke="#1E4A5C" strokeWidth={6} />
      {half > 0 ? <path d={`M${x} ${y - r} A${r} ${r} 0 0 1 ${x} ${y + r} Z`} fill={C.teal} opacity={0.5 * half} /> : null}
      {ring > 0 ? <path d={arc(ring, r + 2)} stroke={ringColor} strokeWidth={r * 0.14} fill="none" strokeLinecap="butt" /> : null}
      {Array.from({ length: 12 }, (_, i) => {
        const t = (i / 12) * Math.PI * 2;
        return <line key={i} x1={x + Math.cos(t) * r * 0.82} y1={y + Math.sin(t) * r * 0.82} x2={x + Math.cos(t) * r * 0.95} y2={y + Math.sin(t) * r * 0.95} stroke="#1E4A5C" strokeWidth={i % 3 ? 3 : 6} />;
      })}
      <line x1={x} y1={y} x2={x + Math.cos((a * Math.PI) / 180) * r * 0.8} y2={y + Math.sin((a * Math.PI) / 180) * r * 0.8} stroke={C.vermilion} strokeWidth={r * 0.06} strokeLinecap="round" />
      <circle cx={x} cy={y} r={r * 0.07} fill="#1E4A5C" />
      {plate ? (
        <g>
          <rect x={x - r * 0.75} y={y + r + 30} width={r * 1.5} height={r * 0.42} rx={r * 0.08} fill="#1E4A5C" />
          <text x={x} y={y + r + 30 + r * 0.3} textAnchor="middle" style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: r * 0.26, fill: "#FFF4DE" }}>
            {plate}
          </text>
        </g>
      ) : null}
    </g>
  );
};

/** The air pump (3-25): a cylinder, a handle stroking (`stroke` 0..1 = up..down), a hose snaking to (hx, hy). */
export const Pump: React.FC<{ x: number; y: number; h: number; stroke: number; hx: number; hy: number; f?: number }> = ({ x, y, h, stroke, hx, hy, f = 0 }) => {
  const w = h * 0.32;
  const hy0 = y - h - h * 0.3 * (1 - stroke);
  return (
    <g>
      <path d={`M${x + w / 2} ${y - h * 0.2} C ${x + w * 2} ${y}, ${hx - 120} ${hy + 40 + Math.sin(f / 7) * 8}, ${hx} ${hy}`} stroke="#1E4A5C" strokeWidth={14} fill="none" strokeLinecap="round" />
      <rect x={x - w / 2} y={y - h} width={w} height={h} rx={w * 0.2} fill={C.saffron} />
      <rect x={x - w / 2} y={y - h} width={w * 0.35} height={h} rx={w * 0.2} fill={C.saffronCore} opacity={0.6} />
      <line x1={x} y1={y - h} x2={x} y2={hy0} stroke="#1E4A5C" strokeWidth={10} />
      <rect x={x - w * 1.1} y={hy0 - 14} width={w * 2.2} height={22} rx={10} fill="#1E4A5C" />
      <rect x={x - w * 0.9} y={y - 10} width={w * 1.8} height={14} rx={6} fill="#1E4A5C" />
    </g>
  );
};

/** The saffron hazard band (3-17): diagonal stripes scrolling at `speed` px/f across a w × h strip. No vermilion. */
export const HazardBand: React.FC<{ x: number; y: number; w: number; h: number; f: number; speed?: number; glow?: boolean }> = ({ x, y, w, h, f, speed = 3, glow = true }) => {
  const step = h * 1.2;
  const off = (f * speed) % step;
  const id = `hz${Math.round(x)}_${Math.round(y)}`;
  return (
    <g>
      {glow ? <Emissive d={`M${x} ${y + h / 2} L${x + w} ${y + h / 2}`} color={C.saffron} width={h * 0.5} strength={0.6} glow={16} /> : null}
      <clipPath id={id}>
        <rect x={x} y={y} width={w} height={h} />
      </clipPath>
      <rect x={x} y={y} width={w} height={h} fill={C.saffron} />
      <g clipPath={`url(#${id})`}>
        {Array.from({ length: Math.ceil(w / step) + 3 }, (_, i) => {
          const sx = x - step * 2 + i * step + off;
          return <path key={i} d={`M${sx} ${y + h} L${sx + h * 0.6} ${y + h} L${sx + h * 1.2} ${y} L${sx + h * 0.6} ${y} Z`} fill="#1A1206" opacity={0.85} />;
        })}
      </g>
    </g>
  );
};

/** An honesty plate (8-20…, Z-01…): a slab with text dropping in (`drop` 0..1, impact squash at the end). */
export const Plate: React.FC<{ x: number; y: number; w: number; h: number; text: string; drop?: number; fill?: string; color?: string; size?: number; sub?: string }> = ({ x, y, w, h, text, drop = 1, fill = "#1E4A5C", color = "#FFF4DE", size, sub }) => {
  const d = Math.max(0, Math.min(1, drop));
  const fall = (1 - d * d) * -520;
  const land = d > 0.85 ? Math.sin(((d - 0.85) / 0.15) * Math.PI) * 0.1 : 0;
  const fs = size ?? h * 0.36;
  return (
    <g transform={`translate(${x} ${(y + fall).toFixed(1)}) scale(${1 + land} ${1 - land})`} opacity={Math.min(1, d * 4)}>
      <rect x={-w / 2 + 8} y={-h / 2 + 10} width={w} height={h} rx={h * 0.14} fill="#000" opacity={0.25} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h * 0.14} fill={fill} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h * 0.12} rx={h * 0.06} fill={C.saffron} />
      <text x={0} y={sub ? -h * 0.02 : fs * 0.36} textAnchor="middle" style={{ fontFamily: IF2.display, fontWeight: 800, fontSize: fs, fill: color }}>
        {text}
      </text>
      {sub ? (
        <text x={0} y={h * 0.3} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: fs * 0.45, letterSpacing: 2, fill: alpha(color, 0.8) }}>
          {sub}
        </text>
      ) : null}
    </g>
  );
};

/** A side-view airliner (8-14…): fuselage, wing, tail; contrail streaming behind at `speed`. */
export const Jet: React.FC<{ x: number; y: number; len: number; f: number; facing?: 1 | -1; trail?: number; speed?: number }> = ({ x, y, len: L, f, facing = 1, trail = 0, speed = 8 }) => (
  <g transform={`translate(${x} ${y}) scale(${facing} 1)`}>
    {trail > 0
      ? Array.from({ length: 6 }, (_, i) => {
          const u = ((f * speed + i * 90) % 540) / 540;
          return <ellipse key={i} cx={-L * 0.55 - u * L * trail * 2} cy={2} rx={30 + u * 50} ry={10 + u * 14} fill="#FFFFFF" opacity={0.7 * (1 - u)} />;
        })
      : null}
    <path d={`M${-L / 2} ${-L * 0.03} L${L * 0.38} ${-L * 0.05} Q ${L / 2} ${-L * 0.04} ${L / 2} 0 Q ${L / 2} ${L * 0.04} ${L * 0.38} ${L * 0.05} L${-L / 2} ${L * 0.04} Z`} fill="#FFF4DE" />
    <path d={`M${-L * 0.05} ${L * 0.02} L${-L * 0.22} ${L * 0.22} L${-L * 0.12} ${L * 0.22} L${L * 0.1} ${L * 0.03} Z`} fill={C.tealDeep} />
    <path d={`M${-L * 0.42} ${-L * 0.03} L${-L * 0.5} ${-L * 0.2} L${-L * 0.42} ${-L * 0.2} L${-L * 0.32} ${-L * 0.04} Z`} fill={C.teal} />
    <rect x={-L * 0.3} y={-L * 0.015} width={L * 0.6} height={L * 0.012} fill={C.saffron} />
  </g>
);

/** A seesaw balance (6-33, 6-35): a beam over a pivot tilting by `tilt` degrees, two pans; children via `left`/`right`. */
export const Seesaw: React.FC<{ x: number; y: number; len: number; tilt: number; left?: React.ReactNode; right?: React.ReactNode; color?: string }> = ({ x, y, len, tilt, left, right, color = C.saffron }) => {
  const a = (tilt * Math.PI) / 180;
  const lx = x - Math.cos(a) * len * 0.45;
  const ly = y - 16 - Math.sin(a) * len * 0.45;
  const rx = x + Math.cos(a) * len * 0.45;
  const ry = y - 16 + Math.sin(a) * len * 0.45;
  return (
    <g>
      <path d={`M${x - 46} ${y + 60} L${x} ${y - 10} L${x + 46} ${y + 60} Z`} fill="#1E4A5C" />
      <g transform={`rotate(${tilt} ${x} ${y - 16})`}>
        <rect x={x - len / 2} y={y - 26} width={len} height={20} rx={8} fill={color} />
      </g>
      <g transform={`translate(${lx.toFixed(1)} ${ly.toFixed(1)})`}>{left}</g>
      <g transform={`translate(${rx.toFixed(1)} ${ry.toFixed(1)})`}>{right}</g>
    </g>
  );
};

/** The diamond anvil cell (6-38…6-41): two cut diamonds closing on a speck (`squeeze` 0..1), a laser beam (`laser` 0..1). */
export const DiamondAnvil: React.FC<{ x: number; y: number; s: number; squeeze: number; laser?: number; f?: number }> = ({ x, y, s, squeeze, laser = 0, f = 0 }) => {
  const gap = s * (0.5 - 0.42 * Math.max(0, Math.min(1, squeeze)));
  const gem = (dir: 1 | -1) => {
    const b = y + dir * gap;
    const t = y + dir * (gap + s * 0.9);
    return (
      <g>
        <path d={`M${x - s * 0.12} ${b} L${x + s * 0.12} ${b} L${x + s * 0.5} ${t - dir * s * 0.25} L${x + s * 0.4} ${t} L${x - s * 0.4} ${t} L${x - s * 0.5} ${t - dir * s * 0.25} Z`} fill={C.ice} stroke={C.frost} strokeWidth={4} />
        <path d={`M${x - s * 0.12} ${b} L${x} ${t} L${x + s * 0.12} ${b}`} stroke={C.frost} strokeWidth={3} fill="none" />
        <path d={`M${x - s * 0.5} ${t - dir * s * 0.25} L${x + s * 0.5} ${t - dir * s * 0.25}`} stroke={C.frost} strokeWidth={3} />
      </g>
    );
  };
  return (
    <g>
      {laser > 0 ? <Emissive d={`M${x - s * 2.2} ${y - s * 1.3} L${x} ${y}`} color={C.saffron} core="#FFFBEA" width={6} strength={laser} glow={16} /> : null}
      {gem(-1)}
      {gem(1)}
      <circle cx={x} cy={y} r={s * 0.07} fill={laser > 0 ? C.saffronCore : "#5A3414"} />
      {laser > 0 ? <circle cx={x} cy={y} r={s * (0.16 + 0.04 * Math.sin(f / 3))} fill={C.saffron} opacity={0.5 * laser} /> : null}
    </g>
  );
};

/** A film reel (7-17): spokes turning at `rpm` deg/f, a strip unspooling to the right with frames sliding. */
export const FilmReel: React.FC<{ x: number; y: number; r: number; f: number; rpm?: number; strip?: number; reverse?: boolean }> = ({ x, y, r, f, rpm = 4, strip = 600, reverse = false }) => {
  const a = f * rpm * (reverse ? -1 : 1);
  const off = ((f * rpm * 0.6 * (reverse ? -1 : 1)) % 70 + 70) % 70;
  return (
    <g>
      <rect x={x} y={y + r * 0.55} width={strip} height={r * 0.42} fill="#1E4A5C" />
      {Array.from({ length: Math.ceil(strip / 70) + 1 }, (_, i) => (
        <rect key={i} x={x + i * 70 - off} y={y + r * 0.6} width={52} height={r * 0.32} rx={4} fill={C.teal} opacity={0.8} />
      ))}
      <g transform={`rotate(${a.toFixed(1)} ${x} ${y})`}>
        <circle cx={x} cy={y} r={r} fill={C.saffron} stroke="#1E4A5C" strokeWidth={6} />
        {Array.from({ length: 5 }, (_, i) => {
          const t = (i / 5) * Math.PI * 2;
          return <circle key={i} cx={x + Math.cos(t) * r * 0.55} cy={y + Math.sin(t) * r * 0.55} r={r * 0.2} fill="#1E4A5C" />;
        })}
        <circle cx={x} cy={y} r={r * 0.12} fill="#FFF4DE" />
      </g>
    </g>
  );
};

/** A tether between two points; `slack` 0 = taut, 1 = a loose loop (the weightless cabin, 7-08). */
export const Tether: React.FC<{ from: [number, number]; to: [number, number]; slack: number; f?: number; color?: string; width?: number }> = ({ from, to, slack, f = 0, color = C.saffron, width = 6 }) => {
  const mx = (from[0] + to[0]) / 2 + Math.sin(f / 13) * 30 * slack;
  const my = (from[1] + to[1]) / 2 + 140 * slack + Math.cos(f / 11) * 20 * slack;
  return <path d={`M${from[0]} ${from[1]} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${to[0]} ${to[1]}`} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" />;
};

/** A brick wall (the drag "wall", 3-xx / 4-xx): running-bond bricks, `crack` 0..1 opens a jagged crack. */
export const BrickWall: React.FC<{ x: number; y: number; w: number; h: number; brick?: number; color?: string; crack?: number }> = ({ x, y, w, h, brick = 60, color = C.mantle, crack = 0 }) => {
  const bh = brick * 0.45;
  const rows = Math.ceil(h / bh);
  const id = `bw${Math.round(x)}_${Math.round(y)}`;
  return (
    <g>
      <clipPath id={id}>
        <rect x={x} y={y} width={w} height={h} />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <rect x={x} y={y} width={w} height={h} fill={mixHex(color, "#1A0604", 0.45)} />
        {Array.from({ length: rows }, (_, r) =>
          Array.from({ length: Math.ceil(w / brick) + 1 }, (_, c) => {
            const bx = x + c * brick - (r % 2 ? brick / 2 : 0);
            return <rect key={`${r}-${c}`} x={bx + 3} y={y + r * bh + 3} width={brick - 6} height={bh - 6} rx={3} fill={mixHex(color, "#FFD6A0", rnd(r * 17 + c) * 0.18)} />;
          }),
        )}
        {crack > 0 ? (
          <path
            d={`M${x + w * 0.5} ${y} L${x + w * 0.44} ${y + h * 0.2 * crack} L${x + w * 0.56} ${y + h * 0.42 * crack} L${x + w * 0.47} ${y + h * 0.66 * crack} L${x + w * 0.53} ${y + h * crack}`}
            stroke="#1A0604"
            strokeWidth={9}
            fill="none"
            strokeLinejoin="round"
          />
        ) : null}
      </g>
    </g>
  );
};
