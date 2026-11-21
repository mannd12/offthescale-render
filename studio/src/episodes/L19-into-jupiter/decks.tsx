// L19 the banded decks, wisps, wind streaks, the flat stripe map and the dry patch (BUILD.md §5 `decks.tsx`).
// THE episode's free mover: whenever the probe falls, the decks scroll UP past it (16-30 px/f) and every band SHEARS sideways
// at its own speed, neighbours in opposite directions (the zonal winds; 14-26 px/f, 24-40 in the wind scenes). Bands are
// vector shapes tiled vertically and horizontally, so they scroll forever (no settle). NOT TO SCALE (F8): no deck here says
// anything about thickness.
// USAGE (f = the shot's frame)
//   <DeckBands f speed={px/f up} shear={[px/f per band, + = right]} x?=0 y?=0 w?=1920 h?=1080 colors?={band fills}
//              belt?={true: one teal belt in the cycle} ghost?={("HIGH"|"MIDDLE"|"LOW")[] dashed expected decks}
//              ghostDraw?={0..1 drawing head along the ghost outlines} fill?={0..1 the one real deck (the first ghost) filling}
//              seed? opacity? />
//   <Wisps f x y w h n?=14 speed?=24 color? /> cloud wisps rushing UP past the probe (falling = the world rises)
//   <WindStreaks f bands={[{ y, h, dir: 1|-1 }]} speed?=30 x?=0 w?=1920 color? /> long streaks tearing sideways per band
//   <FlatMap f x y w h speed?=18 spot?={GRS oval position {x, y, r} in 0..1 map units} spotSpin?={deg/f, 3}
//            equator?={0..1 highlight of the equator belt} scan?={0..1 scan band position across the map; omit = none}
//            hole?={0..1 a dry hole opening at holeAt} holeAt?={[u, v] 0..1} />
//   <DryPatch f x y r?=200 open?={0..1} ring?={0..1 a water ring expanding around it} props?={cactus + tumbleweed (F14)} />
import React from "react";
import { IF2, rnd } from "../../lib/illustrated";
import { L19_COLORS as C } from "./families";
import { sm } from "./tags19";
import { Cactus, Tumbleweed } from "./icons19";

const cl = (v: number) => Math.max(0, Math.min(1, v));
const mod = (a: number, b: number) => ((a % b) + b) % b;

const DEFAULT_COLORS = [C.stripeOrange, C.stripeAmber, C.stripeRust, "#F28A1E", "#FFC247", C.stripeRust];
const H_SET = [150, 110, 170, 90, 130, 120];

/** One band: a wavy top edge, a lit lip and sliding cloud streaks inside. */
const Band: React.FC<{ x: number; w: number; top: number; h: number; color: string; shift: number; seed: number }> = ({ x, w, top, h, color, shift, seed }) => {
  const wl = 260 + rnd(seed) * 160;
  const amp = 10 + rnd(seed + 3) * 12;
  const pts: string[] = [];
  for (let s = -40; s <= w + 40; s += 30) pts.push(`${(x + s).toFixed(0)},${(top + Math.sin(((s - shift) / wl) * Math.PI * 2) * amp).toFixed(1)}`);
  const d = `M${x - 40} ${top + h + 40} L${pts.join(" L")} L${x + w + 40} ${top + h + 40} Z`;
  const lip = `M${pts.join(" L")}`;
  const nStreak = Math.ceil(w / 220) + 2;
  return (
    <g>
      <path d={d} fill={color} />
      <path d={lip} fill="none" stroke="#FFF0A0" strokeWidth={5} opacity={0.32} transform="translate(0 4)" />
      <path d={lip} fill="none" stroke="#5A1206" strokeWidth={10} opacity={0.16} transform="translate(0 -6)" />
      {Array.from({ length: nStreak }, (_, i) => {
        const sx = x - 220 + mod(i * 220 + shift * (0.8 + rnd(seed + i) * 0.4), nStreak * 220);
        const sy = top + h * (0.3 + rnd(seed * 7 + i) * 0.45);
        const len = 120 + rnd(seed * 11 + i) * 160;
        return <ellipse key={i} cx={sx} cy={sy} rx={len / 2} ry={7 + rnd(seed + i * 3) * 9} fill={i % 2 ? "#FFE8B0" : "#5A1206"} opacity={i % 2 ? 0.22 : 0.14} />;
      })}
    </g>
  );
};

export const DeckBands: React.FC<{
  f: number;
  speed: number;
  shear: number[];
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  colors?: string[];
  belt?: boolean;
  ghost?: ("HIGH" | "MIDDLE" | "LOW")[];
  ghostDraw?: number;
  fill?: number;
  seed?: number;
  opacity?: number;
}> = ({ f, speed, shear, x = 0, y = 0, w = 1920, h = 1080, colors = DEFAULT_COLORS, belt = false, ghost, ghostDraw = 1, fill, seed = 1, opacity = 1 }) => {
  const cols = belt ? [...colors.slice(0, 3), C.belt, ...colors.slice(3)] : colors;
  const hs = cols.map((_, i) => H_SET[i % H_SET.length]);
  const P = hs.reduce((a, b) => a + b, 0);
  const scroll = mod(f * speed, P);
  const bands: React.ReactNode[] = [];
  // walk from above the box to below it
  let cursor = y - scroll - P;
  let k = 0;
  while (cursor < y + h + 40) {
    const i = k % cols.length;
    const top = cursor;
    if (top + hs[i] + 60 > y - 40)
      bands.push(<Band key={k} x={x} w={w} top={top} h={hs[i] + 40} color={cols[i]} shift={f * (shear[i % shear.length] ?? 0)} seed={seed * 31 + i} />);
    cursor += hs[i];
    k++;
  }
  const gh = ghost ?? [];
  return (
    <g opacity={opacity}>
      <defs>
        <clipPath id={`decks-${x}-${y}-${w}`}>
          <rect x={x} y={y} width={w} height={h} />
        </clipPath>
      </defs>
      <g clipPath={`url(#decks-${x}-${y}-${w})`}>
        <rect x={x} y={y} width={w} height={h} fill={cols[0]} />
        {bands}
        {gh.map((label, i) => {
          const gy = y + mod(h * ((i + 0.6) / (gh.length + 0.4)) - f * speed * 0.5, h + 200) - 100;
          const L = w * 0.8 * cl(ghostDraw);
          const gx = x + w * 0.1;
          const real = i === 0 && fill != null;
          return (
            <g key={label}>
              {real ? <rect x={gx} y={gy - 34} width={w * 0.8 * cl(fill ?? 0)} height={68} rx={34} fill="#FFE8B0" opacity={0.85} /> : null}
              <rect x={gx} y={gy - 34} width={L} height={68} rx={34} fill="none" stroke="#FFF6DC" strokeWidth={5} strokeDasharray="20 14" strokeDashoffset={-f * 6} />
              {ghostDraw < 1 ? <circle cx={gx + L} cy={gy - 34} r={11} fill={C.goldHot} /> : null}
              <text x={gx + 24} y={gy + 12} style={{ fontFamily: IF2.label, fontSize: 34, letterSpacing: 5, fill: "#FFF6DC", opacity: cl(ghostDraw * 2) }}>
                {label}
              </text>
            </g>
          );
        })}
      </g>
    </g>
  );
};

/** Cloud wisps rushing up past a falling probe. */
export const Wisps: React.FC<{ f: number; x: number; y: number; w: number; h: number; n?: number; speed?: number; color?: string; seed?: number }> = ({ f, x, y, w, h, n = 14, speed = 24, color = "#FFE8B0", seed = 3 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const sp = speed * (0.7 + rnd(seed + i) * 0.6);
      const py = y + h - mod(rnd(seed * 3 + i) * h + f * sp, h + 300) + 150;
      const px = x + rnd(seed * 5 + i) * w;
      const rx = 60 + rnd(seed * 7 + i) * 120;
      return (
        <g key={i} opacity={0.35 + rnd(seed * 9 + i) * 0.35}>
          <ellipse cx={px} cy={py} rx={rx} ry={rx * 0.22} fill={color} />
          <ellipse cx={px + rx * 0.4} cy={py + rx * 0.12} rx={rx * 0.6} ry={rx * 0.14} fill={color} />
          <line x1={px} y1={py + rx * 0.2} x2={px} y2={py + rx * 0.2 + sp * 4} stroke={color} strokeWidth={4} opacity={0.5} strokeLinecap="round" />
        </g>
      );
    })}
  </g>
);

/** Long streaks tearing sideways, one direction per band. */
export const WindStreaks: React.FC<{ f: number; bands: { y: number; h: number; dir: 1 | -1 }[]; speed?: number; x?: number; w?: number; color?: string; seed?: number }> = ({
  f,
  bands,
  speed = 30,
  x = 0,
  w = 1920,
  color = "#FFF0A0",
  seed = 5,
}) => (
  <g strokeLinecap="round">
    {bands.flatMap((b, j) =>
      Array.from({ length: 9 }, (_, i) => {
        const sp = speed * (0.75 + rnd(seed * j + i) * 0.5);
        const len = 160 + rnd(seed * 3 + i + j * 7) * 260;
        const px = x + mod(rnd(seed * 5 + i + j * 11) * (w + len) + b.dir * f * sp, w + len) - len / 2;
        const py = b.y + rnd(seed * 7 + i + j * 13) * b.h;
        return <line key={`${j}-${i}`} x1={px - len / 2} y1={py} x2={px + len / 2} y2={py} stroke={color} strokeWidth={4 + rnd(i + j) * 5} opacity={0.35 + rnd(i * 3 + j) * 0.4} />;
      }),
    )}
  </g>
);

/** The flat stripe map (abstract bands; only the Great Red Spot oval is a real named feature, F12). */
export const FlatMap: React.FC<{
  f: number;
  x: number;
  y: number;
  w: number;
  h: number;
  speed?: number;
  spot?: { x: number; y: number; r: number };
  spotSpin?: number;
  equator?: number;
  scan?: number;
  hole?: number;
  holeAt?: [number, number];
}> = ({ f, x, y, w, h, speed = 18, spot, spotSpin = 3, equator = 0, scan, hole = 0, holeAt = [0.55, 0.52] }) => {
  const rows = [C.stripeRust, C.stripeAmber, C.stripeOrange, "#FFC247", C.belt, "#FFC247", C.stripeOrange, C.stripeAmber, C.stripeRust];
  const bh = h / rows.length;
  const eqRow = 4;
  const id = `fmap-${Math.round(x)}-${Math.round(y)}`;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={x} y={y} width={w} height={h} rx={26} />
        </clipPath>
      </defs>
      <rect x={x + 8} y={y + 12} width={w} height={h} rx={26} fill="#1A0402" opacity={0.3} />
      <g clipPath={`url(#${id})`}>
        {rows.map((c, i) => {
          const dir = i % 2 ? 1 : -1;
          const shift = mod(dir * f * speed * (0.7 + (i % 3) * 0.2), 240);
          return (
            <g key={i}>
              <rect x={x} y={y + i * bh} width={w} height={bh + 1} fill={c} />
              {Array.from({ length: Math.ceil(w / 240) + 2 }, (_, k) => (
                <ellipse key={k} cx={x - 240 + k * 240 + shift} cy={y + i * bh + bh * (0.35 + (k % 2) * 0.3)} rx={90} ry={bh * 0.12} fill={k % 2 ? "#FFE8B0" : "#5A1206"} opacity={k % 2 ? 0.25 : 0.16} />
              ))}
            </g>
          );
        })}
        {equator > 0 ? <rect x={x} y={y + eqRow * bh - 6} width={w} height={bh + 12} fill="#FFF0A0" opacity={0.28 * sm(equator) * (0.7 + 0.3 * Math.sin(f * 0.25))} /> : null}
        {spot ? (
          <g transform={`translate(${x + spot.x * w} ${y + spot.y * h})`}>
            <ellipse rx={spot.r * w * 1.5} ry={spot.r * w} fill={C.spot} />
            <g transform={`scale(1.5 1) rotate(${(f * spotSpin) % 360})`}>
              {[0, 120, 240].map((a) => (
                <path key={a} d={`M0 0 Q${spot.r * w * 0.6} ${-spot.r * w * 0.2} ${spot.r * w * 0.85} ${spot.r * w * 0.35}`} fill="none" stroke={C.spotArm} strokeWidth={spot.r * w * 0.16} strokeLinecap="round" transform={`rotate(${a})`} />
              ))}
            </g>
            <ellipse rx={spot.r * w * 1.5} ry={spot.r * w} fill="none" stroke="#FFC27A" strokeWidth={4} opacity={0.7} />
          </g>
        ) : null}
        {hole > 0 ? (
          <g transform={`translate(${x + holeAt[0] * w} ${y + holeAt[1] * h})`}>
            <ellipse rx={w * 0.07 * sm(hole) * 1.4} ry={w * 0.07 * sm(hole)} fill="#8E1A18" />
            <ellipse rx={w * 0.05 * sm(hole) * 1.4} ry={w * 0.05 * sm(hole)} fill={C.glow} opacity={0.6 + 0.2 * Math.sin(f * 0.3)} />
          </g>
        ) : null}
        {scan != null ? (
          <g>
            <rect x={x + w * cl(scan) - 70} y={y} width={140} height={h} fill="#FFF0A0" opacity={0.25} />
            <rect x={x + w * cl(scan) - 4} y={y} width={8} height={h} fill={C.goldHot} />
          </g>
        ) : null}
      </g>
      <rect x={x} y={y} width={w} height={h} rx={26} fill="none" stroke={C.goldRim} strokeWidth={5} />
    </g>
  );
};

/** The dry patch: a hole opening in thick cloud, warm deeper layers glowing through, heat shimmer, an expanding water ring
 *  around it (4-06) and, as the scientists' joke only (F14), a cartoon cactus and tumbleweed. */
export const DryPatch: React.FC<{ f: number; x: number; y: number; r?: number; open?: number; ring?: number; props?: boolean }> = ({ f, x, y, r = 200, open = 1, ring = 0, props = false }) => {
  const o = sm(open);
  const rr = r * (0.2 + 0.8 * o);
  return (
    <g>
      {ring > 0 ? (
        <g opacity={1 - cl(ring) * 0.6}>
          <ellipse cx={x} cy={y} rx={rr * (1.2 + ring * 1.4) * 1.5} ry={rr * (1.2 + ring * 1.4)} fill="none" stroke={C.belt} strokeWidth={16} strokeDasharray="34 20" strokeDashoffset={-f * 4} />
          {Array.from({ length: 10 }, (_, i) => {
            const a = (i / 10) * Math.PI * 2 + f * 0.02;
            const d = rr * (1.25 + ring * 1.4);
            return <circle key={i} cx={x + Math.cos(a) * d * 1.5} cy={y + Math.sin(a) * d} r={10} fill={C.starAqua} />;
          })}
        </g>
      ) : null}
      {/* the cloud lip around the hole */}
      {Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2;
        const px = x + Math.cos(a) * rr * 1.5 * 1.08;
        const py = y + Math.sin(a) * rr * 1.08;
        const pr = r * (0.28 + rnd(i) * 0.14) * (1 + 0.05 * Math.sin(f * 0.12 + i));
        return <circle key={i} cx={px} cy={py} r={pr} fill={i % 2 ? "#FFE8B0" : "#FFC247"} />;
      })}
      <ellipse cx={x} cy={y} rx={rr * 1.5} ry={rr} fill="#8E1A18" />
      <ellipse cx={x} cy={y + rr * 0.1} rx={rr * 1.1} ry={rr * 0.7} fill={C.glow} opacity={0.75} />
      <ellipse cx={x} cy={y + rr * 0.15} rx={rr * 0.6} ry={rr * 0.36} fill={C.gold} opacity={0.6 + 0.2 * Math.sin(f * 0.3)} />
      {/* heat shimmer */}
      {[0, 1, 2].map((k) => (
        <path
          key={k}
          d={`M${x - rr * 0.6 + k * rr * 0.6} ${y + rr * 0.2} q${12} ${-30} 0 ${-60} q${-12} ${-30} 0 ${-60}`}
          fill="none"
          stroke="#FFF0A0"
          strokeWidth={5}
          opacity={0.5}
          strokeDasharray="20 16"
          strokeDashoffset={-f * 3 - k * 10}
        />
      ))}
      {props && o > 0.6 ? (
        <g opacity={sm((o - 0.6) / 0.4)}>
          <Cactus x={x - rr * 0.5} y={y + rr * 0.35} size={rr * 0.6} />
          <Tumbleweed x={x + ((f * 6) % (rr * 1.6)) - rr * 0.5} y={y + rr * 0.42} size={rr * 0.22} rotate={f * 9} />
        </g>
      ) : null}
    </g>
  );
};
