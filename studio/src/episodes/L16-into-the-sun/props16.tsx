// L16 shared props (BUILD.md §5). Props are shared; the shots that use them stay bespoke (hard rule 1). Ask before
// changing a signature. Every continuously visible prop has a little built-in motion (beacon, glints, flowing dots), but
// the shot's MOVING SUBJECT is still the scene's job.
// F1: no people in danger: the traveller is the PROBE; Tick (kit) never enters gas. F5: nothing from Kurzgesagt.
// F7: the rocket is OUR simplified three-core shape; DELTA IV HEAVY is only a `tag` text. F8: the probe never glows,
// heats red or melts (its lamp is a beacon); only the Shield face warms, to amber. No logos, insignia, flags.
// USAGE (one line each; f = the shot's frame)
//   <Probe x y size f variant="plain|ghost|cutaway" tilt? lamp? trail?={px} turn?={0..1} />   size = body length; tilt 0 =
//        SHIELD FACING LEFT (toward the Sun at the ruler's left end); tilt 90 = shield DOWN (the limb below). turn 0..1 =
//        swing the shield toward the camera (C-09: an edge-on plate opens to a full disc)
//   <Shield x y size f explode={0..1} heat?={0..1} tilt? />   the exploded cutaway: front plate, foam, back plate
//   <Panels x y size f fold={0..1} />   solar wings folding back behind the shield (4-21)
//   <WaterLoop x y w h f speed?=18 n?=16 />   a pipe loop, dots flowing round, amber at the hot side, teal returning
//   <Planet x y r f kind="venus|earth|mars|mercury|dot" light?=180 />   lit discs with sliding cloud / land bands
//   <Orbit cx cy rx ry? f draw?={0..1} shrink?={0..1} rot? color? dashed? />   an ellipse drawn with a head
//   <PlanetsCircling cx cy f planets={[{ kind, a, r?, speed°/f, phase }]} trails? />   circular orbits with trails
//   <Rocket x y size f lift?={px} plume?={0..1} tag?="DELTA IV HEAVY" />   (x, y) = the base; three cores
//   <Calendar x y w f flipping?={pages/s} text? />   pages flip up ≈ 40 px/f; `text` (assertAllowed) on the top page
//   <Clock x y r f hours={0..12 wedge} hand? />   a wedge sweeping `hours`; hand rotating 3°/f
//   <Telescope x y size f tilt? inset?={x,y,r} />   tube + tripod; inset = an eyepiece view with boiling granules
//   <Detector x y r f flash?={0..1} at?={deg} />   the big sphere lined with sensors (Borexino); flash lights a patch
//   <Oven x y w f /> · <Pot x y w f />   cutaway cards: few fast dots in hot thin air / many slow dots in water
//   <HandIcon x y size flip? />   outline only (teal line, no skin tone), INERT (4-12, 4-13)
//   <GlassBox x y w h f n speed? seed? color? />   dots whizzing (n dots at `speed` px/f)
//   <Balance x y w f tilt={-1..1} left?={node} right?={node} />   a beam tipping (±14° at tilt ±1); pans hang level
//   <EarthRow x y n r? gap? f appear?={0..1} />   Earth dots in a row, popping in staggered
//   <Chips x0 y0 x1 y1 f n?=6 speed?=18 />   gold chips streaming from (x0, y0) into a slot at (x1, y1) (1-14)
//   <Tape x y len f unroll={0..1} gold?={0..1 share} slide?={0..1} label? />   the tape measure (1-11…1-13)
//   <Cube x y size f n? speed? label? />   a glass cube with swarming dots (1 m / 1 cm cubes; words only)
//   Bracket, Pin, Trace, Stamp, Flame, Spiral, partialPts: re-exported read-only from L15 (BUILD.md §1)
import React, { useId } from "react";
import { Bloom, IF2, alpha, labelCase, mixHex, rnd, smoothPath, type Pt } from "../../lib/illustrated";
import { L16_COLORS } from "./families";
import { Granules } from "./movers16";
import { assertAllowed } from "./sundata";

export { Bracket, Flame, Pin, Spiral, Stamp, Trace, partialPts } from "../L15-space-jump/props";

const C = L16_COLORS;
const TAU = Math.PI * 2;
const D2R = Math.PI / 180;
const sid = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, "");
const cl01 = (v: number) => Math.max(0, Math.min(1, v));
const sm = (t: number) => {
  const u = cl01(t);
  return u * u * (3 - 2 * u);
};
const mod = (a: number, n: number) => ((a % n) + n) % n;
const poly = (pts: Pt[]) => "M" + pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L") + " Z";

// ---------------------------------------------------------------------------------------------------------------
// Probe (Parker-like: a heat shield in front, a faceted teal body behind, two small wings, a boom)
// ---------------------------------------------------------------------------------------------------------------
export type ProbeVariant = "plain" | "ghost" | "cutaway";
export type ProbeProps = {
  x: number;
  y: number;
  size: number;
  f: number;
  variant?: ProbeVariant;
  tilt?: number;
  lamp?: boolean;
  trail?: number;
  turn?: number;
};

export const Probe: React.FC<ProbeProps> = ({ x, y, size: L, f, variant = "plain", tilt = 0, lamp = true, trail = 0, turn = 0 }) => {
  const tu = sm(turn);
  // body runs along +x (away from the Sun); the shield is at -x
  const bw = L * 0.42 * (1 - 0.55 * tu); // body length (foreshortens as it turns toward us)
  const bh = L * 0.34;
  const sx = -L * 0.3; // shield plane
  const shH = L * 0.86; // shield diameter
  const shT = L * 0.07 + tu * shH * 0.42; // shield width on screen (edge-on → face-on ellipse)
  const bx0 = sx + L * 0.1;
  const ch = bh * 0.26;
  const body: Pt[] = [
    [bx0, -bh / 2 + ch],
    [bx0 + ch, -bh / 2],
    [bx0 + bw - ch, -bh / 2],
    [bx0 + bw, -bh / 2 + ch],
    [bx0 + bw, bh / 2 - ch],
    [bx0 + bw - ch, bh / 2],
    [bx0 + ch, bh / 2],
    [bx0, bh / 2 - ch],
  ];
  const beacon = 0.5 + 0.5 * Math.max(0, Math.cos(((f % 36) / 36) * TAU));
  const wob = Math.sin(f / 23) * 1.5;
  const ghost = variant === "ghost";
  const stroke = ghost ? C.bone : "#0E1830";
  const dash = ghost ? "10 8" : undefined;
  const fill = (c: string) => (ghost ? "none" : c);
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(tilt + wob).toFixed(2)})`}>
      {trail > 0 && !ghost ? (
        <g stroke={C.bone} strokeLinecap="round">
          {Array.from({ length: 7 }, (_, i) => {
            const yy = (rnd(i * 7 + 3) - 0.5) * bh * 1.6;
            const ph = mod(f * 0.9 + rnd(i * 5) * 20, 20) / 20;
            const len = trail * (0.45 + rnd(i * 11) * 0.55);
            const x0 = bx0 + bw + 10 + ph * trail * 0.5;
            return <line key={i} x1={x0} y1={yy} x2={x0 + len} y2={yy} strokeWidth={Math.max(1.5, L * 0.018) * (1.2 - ph)} opacity={0.55 * (1 - ph)} />;
          })}
        </g>
      ) : null}
      {/* boom with the magnetometer tip */}
      <line x1={bx0 + bw} y1={0} x2={bx0 + bw + L * 0.42} y2={0} stroke={ghost ? C.bone : C.bone} strokeWidth={Math.max(2, L * 0.02)} strokeDasharray={dash} />
      <circle cx={bx0 + bw + L * 0.42} cy={0} r={L * 0.025} fill={fill(C.saffron)} stroke={ghost ? C.bone : "none"} />
      {/* solar wings (small, angled back) */}
      {[-1, 1].map((s) => (
        <path key={s} d={poly([[bx0 + bw * 0.45, s * bh * 0.5], [bx0 + bw * 0.85, s * bh * 0.5], [bx0 + bw * 1.05, s * bh * 1.25], [bx0 + bw * 0.6, s * bh * 1.25]])} fill={fill("#2B4FB8")} stroke={ghost ? C.bone : C.cyan} strokeWidth={2} strokeDasharray={dash} />
      ))}
      {/* body: three facets */}
      <path d={poly(body)} fill={fill(C.teal)} />
      {!ghost ? <path d={poly([body[0], body[1], body[2], [bx0 + bw - ch, -bh * 0.1], [bx0 + ch, -bh * 0.1], body[7]])} fill={mixHex(C.teal, "#E6FFF8", 0.35)} /> : null}
      {!ghost ? <path d={poly([[bx0, bh * 0.15], [bx0 + bw, bh * 0.15], body[4], body[5], body[6], body[7]])} fill={C.tealDeep} /> : null}
      <path d={poly(body)} fill="none" stroke={stroke} strokeWidth={Math.max(2, L * 0.014)} strokeLinejoin="round" strokeDasharray={dash} />
      {!ghost ? <rect x={bx0 + bw * 0.55} y={-bh / 2} width={bw * 0.08} height={bh} fill={C.saffron} opacity={0.9} /> : null}
      {/* gold nose collar between shield and body */}
      <path d={poly([[sx + shT * 0.5, -bh * 0.32], [bx0, -bh * 0.4], [bx0, bh * 0.4], [sx + shT * 0.5, bh * 0.32]])} fill={fill(C.probeNose)} stroke={ghost ? C.bone : "none"} strokeDasharray={dash} />
      {variant === "cutaway" ? (
        <g>
          {/* the shade pocket behind the shield, the instrument box with its green glow */}
          <path d={poly([[sx + shT * 0.5, -shH * 0.45], [bx0 + bw * 1.3, -bh * 0.9], [bx0 + bw * 1.3, bh * 0.9], [sx + shT * 0.5, shH * 0.45]])} fill={alpha("#0B0A33", 0.55)} />
          <rect x={bx0 + bw * 0.2} y={-bh * 0.22} width={bw * 0.36} height={bh * 0.44} rx={4} fill="#0E1830" stroke={C.instrument} strokeWidth={2} />
          <Bloom x={bx0 + bw * 0.38} y={0} r={bh * 0.6} color={C.instrument} strength={0.55 + 0.25 * Math.sin(f / 7)} />
          <circle cx={bx0 + bw * 0.38} cy={0} r={bh * 0.08} fill={C.instrument} />
        </g>
      ) : null}
      {/* the heat shield: carbon disc (edge-on → face-on), amber rim on the Sun side */}
      <ellipse cx={sx} cy={0} rx={shT / 2} ry={shH / 2} fill={fill(C.shield)} stroke={ghost ? C.bone : "none"} strokeWidth={2} strokeDasharray={dash} />
      {!ghost ? <ellipse cx={sx - shT * 0.08} cy={0} rx={shT * 0.42} ry={shH * 0.48} fill={mixHex(C.shield, "#6A5A9A", 0.25)} /> : null}
      {!ghost ? <path d={`M${sx - shT * 0.18} ${-shH / 2 + 4} A${shT / 2} ${shH / 2} 0 0 0 ${sx - shT * 0.18} ${shH / 2 - 4}`} fill="none" stroke={C.shieldRim} strokeWidth={Math.max(3, L * 0.03)} strokeLinecap="round" /> : null}
      {variant === "cutaway" ? <line x1={sx} y1={-shH * 0.46} x2={sx} y2={shH * 0.46} stroke="#5A4A80" strokeWidth={Math.max(2, shT * 0.25)} strokeDasharray="4 4" /> : null}
      {lamp && !ghost ? <circle cx={bx0 + bw * 0.9} cy={-bh * 0.34} r={L * 0.028} fill="#FFFBEA" opacity={beacon} /> : null}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Shield (exploded cutaway, 4-16…4-19)
// ---------------------------------------------------------------------------------------------------------------
export const Shield: React.FC<{ x: number; y: number; size: number; f: number; explode: number; heat?: number; tilt?: number }> = ({ x, y, size: S, f, explode, heat = 0, tilt = 0 }) => {
  const e = sm(explode);
  const h = S;
  const plateW = S * 0.06;
  const foamW = S * 0.2;
  const gap = e * S * 0.18;
  const hotFace = mixHex(C.shield, C.amber, cl01(heat) * 0.85);
  const slab = (x0: number, w: number, fill: string, k: number) => (
    <g key={k}>
      <path d={`M${x0} ${-h / 2} l${w} 0 l${S * 0.12} ${-S * 0.08} l${-w} 0 Z`} fill={mixHex(fill, "#FFFFFF", 0.18)} />
      <rect x={x0} y={-h / 2} width={w} height={h} fill={fill} />
      <path d={`M${x0 + w} ${-h / 2} l${S * 0.12} ${-S * 0.08} l0 ${h} l${-S * 0.12} ${S * 0.08} Z`} fill={mixHex(fill, "#000000", 0.25)} />
    </g>
  );
  const fx = -foamW / 2;
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt})`}>
      {slab(fx - plateW - gap, plateW, hotFace, 0)}
      {heat > 0 ? <Bloom x={fx - plateW - gap} y={0} r={S * 0.5} color={C.amber} strength={cl01(heat) * 0.6} squash={1.6} /> : null}
      {slab(fx, foamW, "#3C3060", 1)}
      {/* foam cells drifting slowly inside the foam slab */}
      <g>
        {Array.from({ length: 22 }, (_, i) => {
          const cx = fx + foamW * (0.12 + 0.76 * rnd(i * 3 + 1));
          const cy = -h / 2 + mod(rnd(i * 5 + 2) * h + f * (0.6 + rnd(i) * 0.8), h);
          return <circle key={i} cx={cx} cy={cy} r={S * (0.012 + 0.014 * rnd(i * 7))} fill="#5C4E8C" opacity={0.8} />;
        })}
      </g>
      {slab(fx + foamW + gap, plateW, C.shield, 2)}
      {/* the white Sun-facing coating line */}
      <rect x={fx - plateW - gap - 3} y={-h / 2} width={4} height={h} fill={C.paper} opacity={0.9} />
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Panels (4-21) and WaterLoop (4-22)
// ---------------------------------------------------------------------------------------------------------------
export const Panels: React.FC<{ x: number; y: number; size: number; f: number; fold: number }> = ({ x, y, size: S, f, fold }) => {
  const k = sm(fold);
  const glint = mod(f * 7, S * 1.4) - S * 0.2;
  return (
    <g transform={`translate(${x} ${y})`}>
      {[-1, 1].map((s) => {
        const ang = s * (20 + 62 * k); // degrees swung back
        return (
          <g key={s} transform={`rotate(${ang})`}>
            <line x1={0} y1={0} x2={0} y2={s * S * 0.12} stroke={C.bone} strokeWidth={4} />
            <rect x={-S * 0.08} y={s > 0 ? S * 0.12 : -S * 0.12 - S * 0.6} width={S * 0.16} height={S * 0.6} fill="#2B4FB8" stroke={C.cyan} strokeWidth={2} />
            {Array.from({ length: 5 }, (_, i) => (
              <line key={i} x1={-S * 0.08} x2={S * 0.08} y1={(s > 0 ? S * 0.12 : -S * 0.72) + ((i + 1) * S * 0.6) / 6} y2={(s > 0 ? S * 0.12 : -S * 0.72) + ((i + 1) * S * 0.6) / 6} stroke={C.cyan} strokeWidth={1} opacity={0.6} />
            ))}
            <rect x={-S * 0.08} y={(s > 0 ? S * 0.12 : -S * 0.72) + glint * 0.6} width={S * 0.16} height={S * 0.05} fill="#BFF6FF" opacity={0.5} />
          </g>
        );
      })}
    </g>
  );
};

export const WaterLoop: React.FC<{ x: number; y: number; w: number; h: number; f: number; speed?: number; n?: number }> = ({ x, y, w, h, f, speed = 18, n = 16 }) => {
  const r = Math.min(w, h) * 0.3;
  const per = 2 * (w + h) - 8 * r + TAU * r;
  // point on the rounded-rect loop at arc length s (clockwise from the top-left straight)
  const at = (s0: number): Pt => {
    let s = mod(s0, per);
    const segs: [number, (u: number) => Pt][] = [
      [w - 2 * r, (u) => [x + r + u, y]],
      [(TAU * r) / 4, (u) => [x + w - r + Math.sin(u / r) * r, y + r - Math.cos(u / r) * r]],
      [h - 2 * r, (u) => [x + w, y + r + u]],
      [(TAU * r) / 4, (u) => [x + w - r + Math.cos(u / r) * r, y + h - r + Math.sin(u / r) * r]],
      [w - 2 * r, (u) => [x + w - r - u, y + h]],
      [(TAU * r) / 4, (u) => [x + r - Math.sin(u / r) * r, y + h - r + Math.cos(u / r) * r]],
      [h - 2 * r, (u) => [x, y + h - r - u]],
      [(TAU * r) / 4, (u) => [x + r - Math.cos(u / r) * r, y + r - Math.sin(u / r) * r]],
    ];
    for (const [L, fn] of segs) {
      if (s <= L) return fn(s);
      s -= L;
    }
    return [x + r, y];
  };
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={r} fill="none" stroke="#1C4FA8" strokeWidth={26} />
      <rect x={x} y={y} width={w} height={h} rx={r} fill="none" stroke="#3F8FE8" strokeWidth={14} />
      {/* hot side (left: the panels), cool side (right: the radiator) */}
      <rect x={x + w - 30} y={y + h * 0.2} width={60} height={h * 0.6} rx={10} fill={alpha(C.cyan, 0.3)} stroke={C.cyan} strokeWidth={3} />
      {Array.from({ length: n }, (_, i) => {
        const s = (i / n) * per + f * speed;
        const [px, py] = at(s);
        const u = mod(s, per) / per; // 0..1 round the loop
        const hot = Math.sin(u * TAU + Math.PI) * 0.5 + 0.5; // warm on the left half
        return <circle key={i} cx={px} cy={py} r={9} fill={mixHex(C.cyan, C.amber, hot)} stroke="#FFFFFF" strokeWidth={2} />;
      })}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Planets, orbits
// ---------------------------------------------------------------------------------------------------------------
export type PlanetKind = "venus" | "earth" | "mars" | "mercury" | "dot";
const PLANET: Record<PlanetKind, [string, string, string]> = {
  venus: ["#F6E3A8", "#E0B860", "#B8863A"],
  earth: ["#3FA9E8", "#2FBF71", "#1C4FA8"],
  mars: ["#E8834A", "#C25A2E", "#8A3A1E"],
  mercury: ["#C9A8FF", "#9A86C8", "#5A4A80"],
  dot: ["#3FA9E8", "#3FA9E8", "#1C4FA8"],
};
export const Planet: React.FC<{ x: number; y: number; r: number; f: number; kind?: PlanetKind; light?: number }> = ({ x, y, r, f, kind = "earth", light = 180 }) => {
  const id = "pl" + sid(useId());
  const [a, b, c] = PLANET[kind];
  if (kind === "dot") return <circle cx={x} cy={y} r={r} fill={a} stroke={C.bone} strokeWidth={Math.max(1.5, r * 0.15)} />;
  const lx = Math.cos(light * D2R) * r * 0.45;
  const ly = Math.sin(light * D2R) * r * 0.45;
  const slide = mod(f * 0.8, r * 2);
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <circle cx={x} cy={y} r={r} />
        </clipPath>
        <radialGradient id={id + "g"} cx={`${50 + (lx / r) * 50}%`} cy={`${50 + (ly / r) * 50}%`} r="75%">
          <stop offset="0" stopColor={mixHex(a, "#FFFFFF", 0.3)} />
          <stop offset="0.6" stopColor={a} />
          <stop offset="1" stopColor={c} />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r} fill={`url(#${id}g)`} />
      <g clipPath={`url(#${id})`}>
        {Array.from({ length: 4 }, (_, i) => {
          const yy = y - r * 0.6 + i * r * 0.4;
          const xx = x - r * 2 + slide + ((i * r * 0.7) % (r * 2));
          return kind === "earth" ? (
            <ellipse key={i} cx={xx + r} cy={yy} rx={r * 0.45} ry={r * 0.18} fill={b} opacity={0.85} />
          ) : (
            <rect key={i} x={x - r} y={yy - r * 0.08} width={r * 2} height={r * 0.16} fill={b} opacity={0.35} transform={`translate(${(Math.sin(f / 30 + i) * r * 0.1).toFixed(1)} 0)`} />
          );
        })}
        {/* terminator (night side) */}
        <circle cx={x - lx * 1.6} cy={y - ly * 1.6} r={r * 1.25} fill="none" stroke={alpha("#07061F", 0.55)} strokeWidth={r * 0.9} />
      </g>
    </g>
  );
};

export const Orbit: React.FC<{ cx: number; cy: number; rx: number; ry?: number; f: number; draw?: number; shrink?: number; rot?: number; color?: string; dashed?: boolean; width?: number }> = ({
  cx,
  cy,
  rx,
  ry,
  f,
  draw = 1,
  shrink = 0,
  rot = 0,
  color = C.lavender,
  dashed = false,
  width = 3,
}) => {
  // shrink pulls the near point (perihelion, at -x) in toward the centre: the ellipse narrows and shifts
  const k = sm(shrink);
  const RX = rx * (1 - 0.45 * k);
  const RY = (ry ?? rx) * (1 - 0.55 * k);
  const ox = rx * 0.45 * k;
  const n = 90;
  const pts: Pt[] = Array.from({ length: Math.max(2, Math.round(n * cl01(draw)) + 1) }, (_, i) => {
    const t = (i / n) * TAU;
    return [cx + ox + Math.cos(t + Math.PI) * RX, cy + Math.sin(t + Math.PI) * RY];
  });
  const head = pts[pts.length - 1];
  return (
    <g transform={`rotate(${rot} ${cx} ${cy})`}>
      <path d={smoothPath(pts, 0.5)} fill="none" stroke={color} strokeWidth={width} strokeDasharray={dashed ? "8 8" : undefined} strokeDashoffset={dashed ? -f * 2 : undefined} opacity={0.85} />
      {draw > 0 && draw < 1 ? <circle cx={head[0]} cy={head[1]} r={width * 2.6} fill={C.saffronCore} stroke={C.saffron} strokeWidth={2} /> : null}
    </g>
  );
};

export const PlanetsCircling: React.FC<{ cx: number; cy: number; f: number; planets: { kind: PlanetKind; a: number; r?: number; speed: number; phase?: number }[]; trails?: boolean; ring?: string }> = ({
  cx,
  cy,
  f,
  planets,
  trails = true,
  ring = alpha(C.lavender, 0.35),
}) => (
  <g>
    {planets.map((p, i) => {
      const th = ((p.phase ?? 0) + f * p.speed) * D2R;
      const px = cx + Math.cos(th) * p.a;
      const py = cy + Math.sin(th) * p.a;
      const trailLen = Math.min(70, 1800 / p.a) * D2R * 10;
      const t0 = th - trailLen;
      return (
        <g key={i}>
          <circle cx={cx} cy={cy} r={p.a} fill="none" stroke={ring} strokeWidth={2} />
          {trails ? (
            <path
              d={`M${(cx + Math.cos(t0) * p.a).toFixed(1)} ${(cy + Math.sin(t0) * p.a).toFixed(1)} A${p.a} ${p.a} 0 0 1 ${px.toFixed(1)} ${py.toFixed(1)}`}
              fill="none"
              stroke={PLANET[p.kind][0]}
              strokeWidth={(p.r ?? 12) * 0.9}
              strokeLinecap="round"
              opacity={0.35}
            />
          ) : null}
          <Planet x={px} y={py} r={p.r ?? 12} f={f} kind={p.kind} light={(th * 180) / Math.PI + 180} />
        </g>
      );
    })}
  </g>
);

// ---------------------------------------------------------------------------------------------------------------
// Rocket (our own three-core shape; F7)
// ---------------------------------------------------------------------------------------------------------------
export const Rocket: React.FC<{ x: number; y: number; size: number; f: number; lift?: number; plume?: number; tag?: string }> = ({ x, y, size: H, f, lift = 0, plume = 0, tag }) => {
  const w = H * 0.075;
  const core = (cx: number, h: number, nose: boolean, k: number) => (
    <g key={k}>
      <rect x={cx - w / 2} y={-h} width={w} height={h} fill={C.paper} stroke="#1E2A40" strokeWidth={2} />
      <rect x={cx - w / 2} y={-h * 0.62} width={w} height={h * 0.08} fill={C.saffron} />
      <rect x={cx - w / 2} y={-h} width={w * 0.3} height={h} fill={alpha("#9FB8D8", 0.5)} />
      {nose ? <path d={`M${cx - w / 2} ${-h} Q${cx - w / 2} ${-h - w * 1.6} ${cx} ${-h - w * 2.2} Q${cx + w / 2} ${-h - w * 1.6} ${cx + w / 2} ${-h} Z`} fill={C.paper} stroke="#1E2A40" strokeWidth={2} /> : <path d={`M${cx - w / 2} ${-h} L${cx} ${-h - w * 0.9} L${cx + w / 2} ${-h} Z`} fill={C.saffron} />}
    </g>
  );
  const p = sm(plume);
  const fl = 0.85 + 0.15 * Math.sin(f * 1.9);
  return (
    <g transform={`translate(${x} ${y - lift})`}>
      {p > 0
        ? [-w * 1.05, 0, w * 1.05].map((cx, i) => (
            <g key={i}>
              <path d={`M${cx - w * 0.45} 0 Q${cx} ${H * 0.5 * p * fl} ${cx + w * 0.45} 0 Z`} fill={C.amber} opacity={0.9} />
              <path d={`M${cx - w * 0.25} 0 Q${cx} ${H * 0.28 * p * fl} ${cx + w * 0.25} 0 Z`} fill={C.whiteGold} />
            </g>
          ))
        : null}
      {core(-w * 1.05, H * 0.62, false, 0)}
      {core(w * 1.05, H * 0.62, false, 1)}
      {core(0, H * 0.78, true, 2)}
      {tag ? (
        <g>
          <rect x={w * 2} y={-H * 0.5} width={labelCase(tag).length * 13 + 26} height={34} rx={8} fill={C.paper} stroke={C.ink} strokeWidth={2} />
          <text x={w * 2 + 13} y={-H * 0.5 + 24} style={{ fontFamily: IF2.label, fontSize: 20, letterSpacing: 2, fill: C.ink }}>
            {labelCase(tag)}
          </text>
        </g>
      ) : null}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Calendar, Clock, Telescope, Detector
// ---------------------------------------------------------------------------------------------------------------
export const Calendar: React.FC<{ x: number; y: number; w: number; f: number; flipping?: number; text?: string }> = ({ x, y, w, f, flipping = 7.5, text }) => {
  const h = w * 0.9;
  const period = Math.max(1, 30 / Math.max(0.01, flipping)); // frames per page
  const u = flipping > 0 ? mod(f, period) / period : 1;
  const flipH = h * (1 - u); // the page lifting off: its bottom edge sweeps up (≈ 40 px/f at 7.5 pages/s, w 180)
  if (text) assertAllowed(text, "Calendar");
  const page = (ty: number, hh: number, k: number, op = 1) => (
    <g key={k} opacity={op}>
      <rect x={0} y={ty} width={w} height={hh} rx={8} fill={C.paper} stroke={alpha(C.ink, 0.3)} strokeWidth={2} />
      {hh > h * 0.4
        ? Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={w * 0.1 + (i % 4) * w * 0.21} y={ty + h * 0.3 + Math.floor(i / 4) * h * 0.18} width={w * 0.15} height={h * 0.1} rx={3} fill={alpha(C.violet, 0.25)} />
          ))
        : null}
    </g>
  );
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={0} y={-h * 0.18} width={w} height={h * 0.2} rx={8} fill={C.magenta} />
      {[0.25, 0.75].map((k) => (
        <rect key={k} x={w * k - 5} y={-h * 0.26} width={10} height={h * 0.16} rx={5} fill={C.ink} />
      ))}
      {page(0, h, 0)}
      {text ? (
        <text x={w / 2} y={h * 0.2} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: w * 0.12, letterSpacing: 2, fill: C.ink }}>
          {text}
        </text>
      ) : null}
      {flipping > 0 ? page(0, flipH, 1, 0.95) : null}
    </g>
  );
};

export const Clock: React.FC<{ x: number; y: number; r: number; f: number; hours: number; hand?: boolean }> = ({ x, y, r, f, hours, hand = true }) => {
  const h = Math.max(0, Math.min(12, hours));
  const a1 = -90 + h * 30;
  const p = (a: number, rr: number) => `${(x + Math.cos(a * D2R) * rr).toFixed(1)} ${(y + Math.sin(a * D2R) * rr).toFixed(1)}`;
  const ha = -90 + f * 3;
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={C.paper} stroke={C.ink} strokeWidth={4} />
      {h > 0.02 ? <path d={`M${x} ${y} L${p(-90, r * 0.92)} A${r * 0.92} ${r * 0.92} 0 ${h > 6 ? 1 : 0} 1 ${p(a1, r * 0.92)} Z`} fill={alpha(C.saffron, 0.75)} /> : null}
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1={x + Math.cos(i * 30 * D2R) * r * 0.8} y1={y + Math.sin(i * 30 * D2R) * r * 0.8} x2={x + Math.cos(i * 30 * D2R) * r * 0.94} y2={y + Math.sin(i * 30 * D2R) * r * 0.94} stroke={C.ink} strokeWidth={3} />
      ))}
      {hand ? <line x1={x} y1={y} x2={x + Math.cos(ha * D2R) * r * 0.75} y2={y + Math.sin(ha * D2R) * r * 0.75} stroke={C.vermilion} strokeWidth={5} strokeLinecap="round" /> : null}
      <circle cx={x} cy={y} r={6} fill={C.vermilion} />
    </g>
  );
};

export const Telescope: React.FC<{ x: number; y: number; size: number; f: number; tilt?: number; inset?: { x: number; y: number; r: number } }> = ({ x, y, size: S, f, tilt = -28, inset }) => {
  const id = "ts" + sid(useId());
  return (
    <g>
      <g transform={`translate(${x} ${y})`}>
        {/* tripod */}
        {[-0.35, 0, 0.35].map((k, i) => (
          <line key={i} x1={0} y1={0} x2={k * S} y2={S * 0.55} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
        ))}
        <g transform={`rotate(${tilt + Math.sin(f / 50) * 1.5})`}>
          <rect x={-S * 0.25} y={-S * 0.07} width={S * 0.85} height={S * 0.14} rx={S * 0.04} fill={C.teal} stroke={C.ink} strokeWidth={3} />
          <rect x={S * 0.55} y={-S * 0.09} width={S * 0.12} height={S * 0.18} rx={S * 0.03} fill={C.tealDeep} stroke={C.ink} strokeWidth={3} />
          <rect x={-S * 0.34} y={-S * 0.04} width={S * 0.1} height={S * 0.08} fill={C.ink} />
          <rect x={S * 0.05} y={-S * 0.07} width={S * 0.06} height={S * 0.14} fill={C.saffron} />
        </g>
        <circle cx={0} cy={0} r={S * 0.04} fill={C.saffron} />
      </g>
      {inset ? (
        <g>
          <defs>
            <clipPath id={id}>
              <circle cx={inset.x} cy={inset.y} r={inset.r} />
            </clipPath>
          </defs>
          <circle cx={inset.x} cy={inset.y} r={inset.r + 10} fill={C.ink} />
          <g clipPath={`url(#${id})`}>
            <Granules f={f} x={inset.x - inset.r} y={inset.y - inset.r} w={inset.r * 2} h={inset.r * 2} size={inset.r * 0.3} drift={3} />
          </g>
          <circle cx={inset.x} cy={inset.y} r={inset.r} fill="none" stroke={C.saffron} strokeWidth={5} />
        </g>
      ) : null}
    </g>
  );
};

export const Detector: React.FC<{ x: number; y: number; r: number; f: number; flash?: number; at?: number }> = ({ x, y, r, f, flash = 0, at = -40 }) => {
  const fa = cl01(flash);
  const fx = x + Math.cos(at * D2R) * r * 0.55;
  const fy = y + Math.sin(at * D2R) * r * 0.55;
  const n = 60;
  return (
    <g>
      <circle cx={x} cy={y} r={r * 1.06} fill="#0B1240" stroke={C.cyan} strokeWidth={4} opacity={0.95} />
      <circle cx={x} cy={y} r={r * 0.82} fill={alpha("#3FA9E8", 0.12)} stroke={alpha(C.cyan, 0.5)} strokeWidth={2} />
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * TAU + (i % 2) * 0.05;
        const sx = x + Math.cos(a) * r * 0.94;
        const sy = y + Math.sin(a) * r * 0.94;
        const near = Math.max(0, 1 - Math.hypot(sx - fx, sy - fy) / (r * 0.9));
        const tw = 0.35 + 0.25 * Math.abs(Math.sin(f / 9 + i));
        return <circle key={i} cx={sx} cy={sy} r={r * 0.035} fill={mixHex("#2A4FA0", "#E8FBFF", Math.min(1, tw * 0.5 + near * fa * 1.4))} />;
      })}
      {fa > 0 ? (
        <g>
          <Bloom x={fx} y={fy} r={r * (0.3 + 0.5 * fa)} color="#BFF6FF" strength={fa} />
          <circle cx={fx} cy={fy} r={r * 0.05 + (1 - fa) * r * 0.5} fill="none" stroke="#E8FBFF" strokeWidth={4} opacity={fa} />
        </g>
      ) : null}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Oven, Pot, HandIcon (4-12, 4-13: cutaway cards; the hands stay inert)
// ---------------------------------------------------------------------------------------------------------------
const CardFrame: React.FC<{ w: number; h: number; title: string; fill: string }> = ({ w, h, title, fill }) => (
  <g>
    <rect x={6} y={10} width={w} height={h} rx={20} fill="#000" opacity={0.2} />
    <rect x={0} y={0} width={w} height={h} rx={20} fill={fill} stroke={C.ink} strokeWidth={3} />
    <text x={w / 2} y={44} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 26, letterSpacing: 3, fill: C.ink }}>
      {labelCase(title)}
    </text>
  </g>
);
export const Oven: React.FC<{ x: number; y: number; w: number; f: number; title?: string }> = ({ x, y, w, f, title = "hot oven" }) => {
  const h = w * 0.9;
  const ix = w * 0.1;
  const iy = 70;
  const iw = w * 0.8;
  const ih = h - 110;
  return (
    <g transform={`translate(${x} ${y})`}>
      <CardFrame w={w} h={h} title={title} fill={mixHex(C.paper, C.gold, 0.35)} />
      <rect x={ix} y={iy} width={iw} height={ih} rx={10} fill="#3A0F58" />
      {[0.15, 0.85].map((k) => (
        <rect key={k} x={ix + 10} y={iy + ih * k - 5} width={iw - 20} height={10} rx={5} fill={C.tangerine} opacity={0.75 + 0.25 * Math.sin(f / 6 + k * 9)} />
      ))}
      <GlassBox x={ix + 4} y={iy + 4} w={iw - 8} h={ih - 8} f={f} n={9} speed={20} seed={5} color={C.gold} frame={false} />
    </g>
  );
};
export const Pot: React.FC<{ x: number; y: number; w: number; f: number; title?: string }> = ({ x, y, w, f, title = "boiling water" }) => {
  const h = w * 0.9;
  const ix = w * 0.14;
  const iy = 80;
  const iw = w * 0.72;
  const ih = h - 120;
  return (
    <g transform={`translate(${x} ${y})`}>
      <CardFrame w={w} h={h} title={title} fill={mixHex(C.paper, C.cyan, 0.3)} />
      <path d={`M${ix} ${iy} L${ix + iw} ${iy} L${ix + iw - 10} ${iy + ih} L${ix + 10} ${iy + ih} Z`} fill="#1C4FA8" />
      <GlassBox x={ix + 12} y={iy + 18} w={iw - 24} h={ih - 26} f={f} n={60} speed={4} seed={9} color="#BFE8FF" frame={false} />
      {Array.from({ length: 6 }, (_, i) => {
        const bx = ix + 20 + (i / 6) * (iw - 40) + rnd(i) * 20;
        const by = iy + ih - mod(f * 3 + rnd(i * 3) * ih, ih - 10);
        return <circle key={i} cx={bx} cy={by} r={6 + rnd(i * 5) * 5} fill="none" stroke="#E8FBFF" strokeWidth={2.5} />;
      })}
      <rect x={ix - 16} y={iy - 6} width={iw + 32} height={12} rx={6} fill={C.ink} />
    </g>
  );
};
/** An outline hand (teal line, no skin tone, no reaction: inert by design, F1). */
export const HandIcon: React.FC<{ x: number; y: number; size: number; flip?: boolean }> = ({ x, y, size: S, flip = false }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -S / 100 : S / 100} ${S / 100})`}>
    <path
      d="M-30 40 L-30 -10 Q-30 -18 -22 -18 Q-14 -18 -14 -10 L-14 -40 Q-14 -48 -6 -48 Q2 -48 2 -40 L2 -46 Q2 -54 10 -54 Q18 -54 18 -46 L18 -38 Q18 -46 26 -46 Q34 -46 34 -38 L34 10 Q34 40 10 50 L-14 50 Q-30 50 -30 40 Z"
      fill="none"
      stroke={C.teal}
      strokeWidth={5}
      strokeLinejoin="round"
    />
  </g>
);

// ---------------------------------------------------------------------------------------------------------------
// GlassBox, Cube, Balance, EarthRow, Chips, Tape
// ---------------------------------------------------------------------------------------------------------------
const tri = (u: number) => {
  const m = mod(u, 2);
  return m < 1 ? m : 2 - m;
};
export const GlassBox: React.FC<{ x: number; y: number; w: number; h: number; f: number; n: number; speed?: number; seed?: number; color?: string; frame?: boolean; dot?: number }> = ({
  x,
  y,
  w,
  h,
  f,
  n,
  speed = 14,
  seed = 3,
  color = C.bone,
  frame = true,
  dot,
}) => {
  const r = dot ?? Math.max(3, Math.min(w, h) * 0.025);
  const sw = w - 2 * r;
  const sh = h - 2 * r;
  return (
    <g>
      {frame ? <rect x={x} y={y} width={w} height={h} rx={8} fill={alpha(C.cyan, 0.12)} stroke={mixHex(C.cyan, "#FFFFFF", 0.4)} strokeWidth={3} /> : null}
      {Array.from({ length: Math.max(0, Math.round(n)) }, (_, i) => {
        const vx = (0.6 + rnd(seed * 7 + i) * 0.8) * speed * (rnd(seed * 13 + i) > 0.5 ? 1 : -1);
        const vy = (0.6 + rnd(seed * 17 + i) * 0.8) * speed * (rnd(seed * 19 + i) > 0.5 ? 1 : -1) * 0.8;
        const px = x + r + tri(rnd(seed * 3 + i) * 2 + (f * vx) / sw) * sw;
        const py = y + r + tri(rnd(seed * 5 + i) * 2 + (f * vy) / sh) * sh;
        return <circle key={i} cx={px} cy={py} r={r} fill={color} />;
      })}
      {frame ? <path d={`M${x + 10} ${y + h * 0.3} L${x + 10} ${y + 10} L${x + w * 0.3} ${y + 10}`} stroke="#FFFFFF" strokeWidth={3} fill="none" opacity={0.5} /> : null}
    </g>
  );
};

export const Cube: React.FC<{ x: number; y: number; size: number; f: number; n?: number; speed?: number; label?: string; color?: string; glass?: string }> = ({ x, y, size: S, f, n = 30, speed = 10, label, color = C.gold, glass = C.cyan }) => {
  const d = S * 0.28;
  if (label) assertAllowed(label, "Cube label");
  return (
    <g>
      <path d={`M${x} ${y} l${d} ${-d} l${S} 0 l0 ${S} l${-d} ${d} Z`} fill={alpha(glass, 0.12)} stroke={mixHex(glass, "#FFFFFF", 0.4)} strokeWidth={2} />
      <line x1={x + S} y1={y} x2={x + S + d} y2={y - d} stroke={mixHex(glass, "#FFFFFF", 0.4)} strokeWidth={2} />
      <GlassBox x={x} y={y} w={S} h={S} f={f} n={n} speed={speed} seed={11} color={color} />
      {label ? (
        <text x={x + S / 2} y={y + S + 40} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 20, letterSpacing: 2, fill: C.ink }}>
          {labelCase(label)}
        </text>
      ) : null}
    </g>
  );
};

export const Balance: React.FC<{ x: number; y: number; w: number; f: number; tilt: number; left?: React.ReactNode; right?: React.ReactNode; color?: string }> = ({ x, y, w, f, tilt, left, right, color = C.ink }) => {
  const a = (Math.max(-1, Math.min(1, tilt)) * 14 + Math.sin(f / 18) * 0.5) * D2R;
  const half = w / 2;
  const L: Pt = [x - Math.cos(a) * half, y - Math.sin(a) * half];
  const R: Pt = [x + Math.cos(a) * half, y + Math.sin(a) * half];
  const pan = (p: Pt, node: React.ReactNode, k: number) => (
    <g key={k}>
      <line x1={p[0]} y1={p[1]} x2={p[0] - w * 0.12} y2={p[1] + w * 0.2} stroke={color} strokeWidth={2} />
      <line x1={p[0]} y1={p[1]} x2={p[0] + w * 0.12} y2={p[1] + w * 0.2} stroke={color} strokeWidth={2} />
      <path d={`M${p[0] - w * 0.16} ${p[1] + w * 0.2} Q${p[0]} ${p[1] + w * 0.27} ${p[0] + w * 0.16} ${p[1] + w * 0.2} Z`} fill={C.saffron} stroke={color} strokeWidth={2} />
      <g transform={`translate(${p[0]} ${p[1] + w * 0.2})`}>{node}</g>
    </g>
  );
  return (
    <g>
      <path d={`M${x - w * 0.12} ${y + w * 0.62} L${x} ${y} L${x + w * 0.12} ${y + w * 0.62} Z`} fill={alpha(C.violet, 0.7)} stroke={color} strokeWidth={3} />
      <line x1={L[0]} y1={L[1]} x2={R[0]} y2={R[1]} stroke={color} strokeWidth={8} strokeLinecap="round" />
      <circle cx={x} cy={y} r={10} fill={C.saffron} stroke={color} strokeWidth={2} />
      {pan(L, left, 0)}
      {pan(R, right, 1)}
    </g>
  );
};

export const EarthRow: React.FC<{ x: number; y: number; n: number; r?: number; gap?: number; f: number; appear?: number }> = ({ x, y, n, r = 8, gap = 4, f, appear = 1 }) => {
  const shown = n * cl01(appear);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const k = cl01((shown - i) * 1.0);
        if (k <= 0) return null;
        const pop = k < 1 ? 1.4 - 0.4 * k : 1 + 0.04 * Math.sin(f / 6 + i);
        return <Planet key={i} x={x + i * (2 * r + gap) + r} y={y} r={r * pop} f={f} kind={r < 10 ? "dot" : "earth"} />;
      })}
    </g>
  );
};

export const Chips: React.FC<{ x0: number; y0: number; x1: number; y1: number; f: number; n?: number; speed?: number }> = ({ x0, y0, x1, y1, f, n = 6, speed = 18 }) => {
  const L = Math.hypot(x1 - x0, y1 - y0) || 1;
  const gap = L / n;
  return (
    <g>
      <rect x={x1 - 60} y={y1 - 14} width={120} height={28} rx={14} fill={C.ink} stroke={C.saffron} strokeWidth={3} />
      {Array.from({ length: n }, (_, i) => {
        const s = mod(f * speed + i * gap, L);
        const u = s / L;
        const px = x0 + (x1 - x0) * u;
        const py = y0 + (y1 - y0) * u - Math.sin(u * Math.PI) * 60;
        return (
          <g key={i} transform={`translate(${px.toFixed(1)} ${py.toFixed(1)}) rotate(${(f * 9 + i * 40) % 360})`} opacity={u > 0.92 ? (1 - u) / 0.08 : 1}>
            <ellipse cx={0} cy={0} rx={20} ry={13} fill={C.gold} stroke={C.saffronDeep} strokeWidth={3} />
            <ellipse cx={0} cy={0} rx={11} ry={6} fill="none" stroke={C.saffronDeep} strokeWidth={2} />
          </g>
        );
      })}
    </g>
  );
};

export const Tape: React.FC<{ x: number; y: number; len: number; f: number; unroll: number; gold?: number; slide?: number; label?: string }> = ({ x, y, len, f, unroll, gold = 0, slide = 0, label }) => {
  const u = sm(unroll);
  const L = len * u;
  const g = cl01(gold) * L;
  const sl = sm(slide) * 260;
  if (label) assertAllowed(label, "Tape label");
  const ticks = Math.floor(L / 24);
  return (
    <g>
      {/* the reel */}
      <circle cx={x} cy={y} r={46} fill={C.magenta} stroke={C.ink} strokeWidth={3} />
      <circle cx={x} cy={y} r={14} fill={C.ink} transform={`rotate(${f * 6} ${x} ${y})`} />
      <rect x={x - 8} y={y - 40} width={16} height={12} fill={C.saffron} transform={`rotate(${-u * 720} ${x} ${y})`} />
      {/* the strip */}
      <rect x={x + 40} y={y - 22} width={L} height={44} fill={C.saffronCore} stroke={C.ink} strokeWidth={2} />
      {g > 0 ? (
        <g transform={`translate(0 ${(sl * 0.5).toFixed(1)})`} opacity={1 - sm(slide) * 0.5}>
          <rect x={x + 40 - sl} y={y - 22} width={g} height={44} fill={C.gold} stroke={C.saffronDeep} strokeWidth={3} />
        </g>
      ) : null}
      {Array.from({ length: ticks }, (_, i) => (
        <line key={i} x1={x + 40 + (i + 1) * 24} y1={y - 22} x2={x + 40 + (i + 1) * 24} y2={y - 22 + (i % 5 === 4 ? 22 : 12)} stroke={C.ink} strokeWidth={i % 5 === 4 ? 3 : 2} />
      ))}
      <rect x={x + 40 + L - 6} y={y - 30} width={12} height={60} rx={3} fill={C.ink} />
      {label && u > 0.98 ? (
        <text x={x + 40 + L + 20} y={y + 12} style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 36, fill: C.ink }}>
          {label}
        </text>
      ) : null}
    </g>
  );
};
