// L14 tunnel movers (BUILD.md §5): pure functions of the frame, no numbers drawn (the ruler has ticks only).
//  - StrataWall: the tunnel slot. Two near walls + the far wall behind the probe, banded by depth in the four strata
//    colours, streaming UP at `speed` px/frame (the probe falls; THE DEFAULT MOVER, 8-30 px/f). Layer boundaries cross
//    the frame as glowing seams. Optional lamp, hatch (mantle taffy / iron flow), wobble (walls pressing in, 5-12),
//    a scrolling depth ruler.
//  - AirHaze: teal haze bands streaming up the slot; `density` 0..1 bunches them (spacing 160 → 60 px) and adds a
//    saffron edge; `crystals` adds teal-white hex shards (3-19).
//  - Shimmer: rising heat-shimmer rows (kit Caustics flipped to travel up).
//  - IronFlow: liquid-iron ribbons in two golds streaming past (6-01…6-06, 6-16).
// Strata depths: crust 0-35 km drawn (5-40 km, #21), core boundary 2,886 km (#13), inner core 1,250 km radius (#15).
import React, { useId } from "react";
import { Caustics, Emissive, Family, alpha, mixHex, rnd } from "../../lib/illustrated";
import { CRUST_KM, L14_COLORS, R_CORE, R_EARTH, R_INNER } from "./families";

export type StrataPattern = "rock" | "taffy" | "flow" | "crystal";
export type Stratum = { from: number; to: number; color: string; pattern?: StrataPattern };

/** The pole-to-pole diameter in strata (km below the entry point), mirrored past the centre. */
export const L14_STRATA: Stratum[] = [
  { from: -1000, to: 0, color: "#0A3C4C", pattern: "rock" }, // above ground (sky/air; scenes rarely show it)
  { from: 0, to: CRUST_KM, color: L14_COLORS.crust, pattern: "rock" },
  { from: CRUST_KM, to: R_EARTH - R_CORE, color: L14_COLORS.mantle, pattern: "taffy" },
  { from: R_EARTH - R_CORE, to: R_EARTH - R_INNER, color: L14_COLORS.outer, pattern: "flow" },
  { from: R_EARTH - R_INNER, to: R_EARTH + R_INNER, color: L14_COLORS.inner, pattern: "crystal" },
  { from: R_EARTH + R_INNER, to: R_EARTH + R_CORE, color: L14_COLORS.outer, pattern: "flow" },
  { from: R_EARTH + R_CORE, to: 2 * R_EARTH - CRUST_KM, color: L14_COLORS.mantle, pattern: "taffy" },
  { from: 2 * R_EARTH - CRUST_KM, to: 2 * R_EARTH, color: L14_COLORS.crust, pattern: "rock" },
];

export type StrataWallProps = {
  f: number;
  family: Family;
  /** km of depth at screen y = `anchorY` when scroll = 0 */
  depth?: number;
  /** px per km of depth (crust at 2 px/km = 70 px thick) */
  pxPerKm?: number;
  /** px/frame the strata stream up (default 12): the default mover */
  speed?: number;
  /** override the scroll (px) for eased moves; default f × speed */
  scroll?: number;
  anchorY?: number;
  /** slot centre x and gap width */
  cx?: number;
  gap?: number;
  /** drawn x range (walls run from x0 to the slot and from the slot to x1) */
  x0?: number;
  x1?: number;
  layers?: Stratum[];
  /** world px between rock bands (default 74) */
  bandPx?: number;
  /** the probe's lamp: lights the walls around (cx, lampY) */
  lamp?: { y: number; color?: string; strength?: number } | null;
  /** extra wall hatching streaming with the rock */
  hatch?: "taffy" | "iron" | null;
  /** 0..1 walls pressing in (5-12) */
  wobble?: number;
  /** a scrolling depth ruler (ticks only) at this x */
  ruler?: number | null;
  /** glowing seams at layer boundaries (default true) */
  seams?: boolean;
};

/** Screen y of a depth (km) for the wall's current scroll: for pinning a label or a hazard band to a boundary. */
export const depthToY = (depthKm: number, p: { depth?: number; pxPerKm?: number; anchorY?: number; scroll: number }) =>
  (p.anchorY ?? 540) + (depthKm - (p.depth ?? 0)) * (p.pxPerKm ?? 2) - p.scroll;

/** Depth (km) at screen y. */
export const yToDepth = (y: number, p: { depth?: number; pxPerKm?: number; anchorY?: number; scroll: number }) =>
  (p.depth ?? 0) + (y + p.scroll - (p.anchorY ?? 540)) / (p.pxPerKm ?? 2);

/** One wall face: bands of its strata between screen x a..b, with the scroll and a tone shift (far wall darker). */
const WallFace: React.FC<{
  id: string;
  a: number;
  b: number;
  scroll: number;
  layers: Stratum[];
  depth: number;
  pxPerKm: number;
  anchorY: number;
  bandPx: number;
  shade: string;
  dark: number;
  edge: (y: number) => number;
  side: -1 | 1 | 0;
  hatch?: "taffy" | "iron" | null;
  f: number;
}> = ({ id, a, b, scroll, layers, depth, pxPerKm, anchorY, bandPx, shade, dark, edge, side, hatch, f }) => {
  const y2s = (km: number) => anchorY + (km - depth) * pxPerKm - scroll;
  const out: React.ReactNode[] = [];
  layers.forEach((L, li) => {
    const ty = Math.max(-60, y2s(L.from));
    const by = Math.min(1140, y2s(L.to));
    if (by <= ty) return;
    const base = mixHex(L.color, shade, dark);
    const cid = `${id}l${li}`;
    // wall polygon for this layer: x from a to the slot edge (which may wobble)
    const pts: string[] = [];
    const N = 18;
    if (side === 0) {
      pts.push(`M${a} ${ty}`, `L${b} ${ty}`, `L${b} ${by}`, `L${a} ${by}`, "Z");
    } else {
      const outer = side < 0 ? a : b;
      pts.push(`M${outer} ${ty}`);
      for (let i = 0; i <= N; i++) {
        const yy = ty + ((by - ty) * i) / N;
        pts.push(`L${edge(yy).toFixed(1)} ${yy.toFixed(1)}`);
      }
      pts.push(`L${outer} ${by}`, "Z");
    }
    const d = pts.join(" ");
    const k0 = Math.floor((ty + scroll) / bandPx) - 1;
    const k1 = Math.floor((by + scroll) / bandPx) + 1;
    const bands: React.ReactNode[] = [];
    for (let k = k0; k <= k1; k++) {
      const y0 = k * bandPx - scroll;
      const tone = (k & 1 ? 0.18 : 0) + rnd(k * 7 + li) * 0.12;
      const fill = L.pattern === "crystal" ? mixHex(base, "#FFFFFF", tone * 0.8) : mixHex(base, shade, tone);
      const amp = L.pattern === "flow" ? 16 : L.pattern === "taffy" ? 12 : 7;
      const top: string[] = [];
      for (let i = 0; i <= 10; i++) {
        const x = a + ((b - a) * i) / 10;
        const yy = y0 + Math.sin(x / 110 + k * 1.7) * amp + Math.sin(x / 47 + k) * amp * 0.3;
        top.push(`${i ? "L" : "M"}${x.toFixed(1)} ${yy.toFixed(1)}`);
      }
      bands.push(<path key={k} d={`${top.join(" ")} L${b} ${y0 + bandPx * 1.6} L${a} ${y0 + bandPx * 1.6} Z`} fill={fill} />);
      // cracks / facets: short contrasty marks inside each band
      if (L.pattern === "rock" || L.pattern === "crystal") {
        const cx = a + rnd(k * 13 + li) * (b - a);
        bands.push(<path key={`c${k}`} d={`M${cx.toFixed(1)} ${(y0 + bandPx * 0.35).toFixed(1)} l 18 14 l -10 16`} stroke={mixHex(base, shade, 0.45)} strokeWidth={4} fill="none" strokeLinecap="round" />);
      }
    }
    out.push(
      <g key={li}>
        <clipPath id={cid}>
          <path d={d} />
        </clipPath>
        <g clipPath={`url(#${cid})`}>
          <rect x={a} y={ty} width={b - a} height={by - ty} fill={base} />
          {bands}
          {hatch === "taffy" && L.pattern === "taffy"
            ? Array.from({ length: Math.ceil((by - ty) / 46) + 3 }, (_, i) => {
                const yy = Math.floor((ty + scroll) / 46) * 46 - scroll + i * 46;
                return <path key={`h${i}`} d={`M${a} ${yy} C ${a + (b - a) * 0.3} ${yy + 30}, ${a + (b - a) * 0.6} ${yy - 24}, ${b} ${yy + 12}`} stroke={mixHex(base, "#FFD6A0", 0.35)} strokeWidth={5} fill="none" opacity={0.55} />;
              })
            : null}
          {hatch === "iron" && L.pattern === "flow"
            ? Array.from({ length: Math.ceil((by - ty) / 38) + 3 }, (_, i) => {
                const yy = Math.floor((ty + scroll) / 38) * 38 - scroll + i * 38;
                const w = Math.sin(f / 9 + i) * 10;
                return <path key={`h${i}`} d={`M${a} ${yy} Q ${(a + b) / 2} ${yy + 22 + w}, ${b} ${yy}`} stroke={L14_COLORS.inner} strokeWidth={4} fill="none" opacity={0.5} />;
              })
            : null}
        </g>
      </g>,
    );
  });
  return <g>{out}</g>;
};

export const StrataWall: React.FC<StrataWallProps> = ({
  f,
  family: F,
  depth = 0,
  pxPerKm = 2,
  speed = 12,
  scroll: scrollProp,
  anchorY = 540,
  cx = 700,
  gap = 300,
  x0 = 0,
  x1 = 1920,
  layers = L14_STRATA,
  bandPx = 74,
  lamp = null,
  hatch = null,
  wobble = 0,
  ruler = null,
  seams = true,
}) => {
  const id = "sw" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const scroll = scrollProp ?? f * speed;
  const half = gap / 2;
  // wall edges: gently ragged; `wobble` squeezes the slot with travelling bulges
  const edgeL = (y: number) => cx - half + Math.sin((y + scroll) / 70) * 6 + wobble * (half * 0.35) * (0.6 + 0.4 * Math.sin((y + scroll * 0.5) / 160 + f / 14));
  const edgeR = (y: number) => cx + half - Math.sin((y + scroll) / 83 + 2) * 6 - wobble * (half * 0.35) * (0.6 + 0.4 * Math.sin((y + scroll * 0.5) / 150 + f / 12 + 1.3));
  const common = { layers, depth, pxPerKm, anchorY, bandPx, f, hatch };
  // the far wall streams at 55 % (parallax) and is darker
  const farScroll = scroll * 0.55;
  const seamYs = seams
    ? layers.slice(1).map((L) => anchorY + (L.from - depth) * pxPerKm - scroll).filter((y) => y > -20 && y < 1100)
    : [];
  return (
    <g>
      <WallFace id={`${id}f`} a={cx - half - 40} b={cx + half + 40} scroll={farScroll} {...common} anchorY={anchorY} shade={F.shadow} dark={0.55} edge={() => 0} side={0} />
      {/* depth shadow at the slot's sides (the far wall recedes) */}
      <rect x={cx - half - 40} y={0} width={gap + 80} height={1080} fill={alpha(F.shadow, 0.25)} />
      <WallFace id={`${id}l`} a={x0} b={cx} scroll={scroll} {...common} shade={F.shadow} dark={0.08} edge={edgeL} side={-1} />
      <WallFace id={`${id}r`} a={cx} b={x1} scroll={scroll} {...common} shade={F.shadow} dark={0.2} edge={edgeR} side={1} />
      {/* lit rims along the slot edges */}
      <path d={Array.from({ length: 28 }, (_, i) => `${i ? "L" : "M"}${edgeL(i * 40 - 20).toFixed(1)} ${i * 40 - 20}`).join(" ")} stroke={alpha(F.light, 0.55)} strokeWidth={5} fill="none" />
      <path d={Array.from({ length: 28 }, (_, i) => `${i ? "L" : "M"}${edgeR(i * 40 - 20).toFixed(1)} ${i * 40 - 20}`).join(" ")} stroke={alpha(F.shadow, 0.6)} strokeWidth={7} fill="none" />
      {/* boundary seams crossing the frame */}
      {seamYs.map((y, i) => (
        <Emissive key={i} d={`M${x0} ${y.toFixed(1)} L${x1} ${y.toFixed(1)}`} color={L14_COLORS.saffron} core={L14_COLORS.saffronCore} width={4} strength={0.9} glow={8} />
      ))}
      {lamp ? (
        <g>
          <radialGradient id={`${id}lamp`}>
            <stop offset="0" stopColor={lamp.color ?? L14_COLORS.probeNose} stopOpacity={0.55 * (lamp.strength ?? 1)} />
            <stop offset="1" stopColor={lamp.color ?? L14_COLORS.probeNose} stopOpacity={0} />
          </radialGradient>
          <ellipse cx={cx} cy={lamp.y + 120} rx={gap * 1.4} ry={420} fill={`url(#${id}lamp)`} />
        </g>
      ) : null}
      {ruler != null ? <DepthRuler x={ruler} scroll={scroll} color={F.text} /> : null}
    </g>
  );
};

/** A vertical ruler of ticks (no numbers) streaming up with the scroll: long tick every 5. */
export const DepthRuler: React.FC<{ x: number; scroll: number; color: string; step?: number; y0?: number; y1?: number }> = ({ x, scroll, color, step = 36, y0 = 0, y1 = 1080 }) => {
  const k0 = Math.floor((y0 + scroll) / step);
  const k1 = Math.ceil((y1 + scroll) / step);
  return (
    <g>
      <rect x={x - 6} y={y0} width={12} height={y1 - y0} fill={alpha("#000", 0.3)} />
      {Array.from({ length: k1 - k0 + 1 }, (_, i) => {
        const k = k0 + i;
        const y = k * step - scroll;
        const long = k % 5 === 0;
        return <line key={k} x1={x - (long ? 26 : 12)} y1={y} x2={x + (long ? 26 : 12)} y2={y} stroke={color} strokeWidth={long ? 5 : 3} />;
      })}
    </g>
  );
};

/** Teal haze bands streaming up the slot; density 0..1 bunches them and adds a saffron edge (air thickening). */
export const AirHaze: React.FC<{ f: number; x: number; w: number; y0?: number; y1?: number; speed?: number; density?: number; crystals?: number; seed?: number }> = ({ f, x, w, y0 = 0, y1 = 1080, speed = 14, density = 0, crystals = 0, seed = 1 }) => {
  const d = Math.max(0, Math.min(1, density));
  const sp = 160 - 100 * d;
  const scroll = f * speed;
  const k0 = Math.floor((y0 + scroll) / sp) - 1;
  const k1 = Math.ceil((y1 + scroll) / sp) + 1;
  const edge = mixHex(L14_COLORS.bone, L14_COLORS.saffron, d);
  return (
    <g>
      {Array.from({ length: k1 - k0 + 1 }, (_, i) => {
        const k = k0 + i;
        const y = k * sp - scroll;
        const h = sp * (0.32 + 0.18 * d) * (0.8 + rnd(k * 3 + seed) * 0.4);
        const sx = Math.sin(k * 1.3 + seed) * w * 0.08;
        return (
          <g key={k}>
            <rect x={x + sx} y={y} width={w} height={h} rx={h / 2} fill={mixHex(L14_COLORS.teal, L14_COLORS.bone, 0.35 + 0.3 * d)} opacity={0.22 + 0.33 * d} />
            <path d={`M${x + sx + h / 2} ${y + 1} L${x + sx + w - h / 2} ${y + 1}`} stroke={edge} strokeWidth={3 + 3 * d} strokeLinecap="round" opacity={0.55 + 0.4 * d} />
          </g>
        );
      })}
      {crystals > 0
        ? Array.from({ length: Math.round(crystals * 14) }, (_, i) => {
            const L = 1500;
            const u = ((rnd(seed * 31 + i) * L + f * (speed * (0.6 + rnd(i) * 0.6))) % L) - 200;
            const cx = x + rnd(seed * 17 + i) * w;
            const cy = y1 - u;
            const r = 14 + rnd(i * 5) * 16;
            const a = f * (2 + rnd(i) * 3) + i * 40;
            const pts = Array.from({ length: 6 }, (_, j) => {
              const t = ((a + j * 60) * Math.PI) / 180;
              return `${(cx + Math.cos(t) * r).toFixed(1)} ${(cy + Math.sin(t) * r * 0.9).toFixed(1)}`;
            });
            return <path key={`x${i}`} d={`M${pts.join(" L")} Z`} fill={L14_COLORS.ice} stroke={L14_COLORS.frost} strokeWidth={2.5} opacity={0.85} />;
          })
        : null}
    </g>
  );
};

/** Rising heat-shimmer rows (kit Caustics, flipped so they travel UP at `speed` px/frame). Keep opacity ≤ 0.4. */
export const Shimmer: React.FC<{ f: number; x: number; y: number; w: number; h: number; rows?: number; color?: string; speed?: number; opacity?: number; width?: number }> = ({ f, x, y, w, h, rows = 7, color = L14_COLORS.saffronCore, speed = 3, opacity = 0.35, width = 8 }) => (
  <g transform={`translate(0 ${2 * y + h}) scale(1 -1)`}>
    <Caustics f={f} x={x} y={y} w={w} h={h} rows={rows} color={color} speed={speed} opacity={opacity} width={width} />
  </g>
);

/** Liquid-iron ribbons in two golds streaming past (up at `speed`), each swaying; for the IRON family. */
export const IronFlow: React.FC<{ f: number; x0?: number; x1?: number; y0?: number; y1?: number; n?: number; speed?: number; seed?: number; glow?: boolean }> = ({ f, x0 = 0, x1 = 1920, y0 = 0, y1 = 1080, n = 9, speed = 10, seed = 1, glow = true }) => {
  const span = y1 - y0 + 400;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const y = y1 + 200 - ((rnd(seed * 11 + i) * span + f * speed * (0.75 + rnd(seed + i) * 0.5)) % span);
        const amp = 30 + rnd(i * 3 + seed) * 50;
        const ph = rnd(i * 7) * 6 + f / 20;
        const pts: string[] = [];
        for (let k = 0; k <= 12; k++) {
          const x = x0 + ((x1 - x0) * k) / 12;
          const yy = y + Math.sin(x / 260 + ph) * amp + (x - x0) * -0.08;
          pts.push(`${k ? "L" : "M"}${x.toFixed(1)} ${yy.toFixed(1)}`);
        }
        const c = i % 2 ? L14_COLORS.inner : L14_COLORS.outer;
        const w = 8 + rnd(i * 5 + seed) * 12;
        return glow && i % 3 === 0 ? (
          <Emissive key={i} d={pts.join(" ")} color={c} core={L14_COLORS.innerCore} width={w * 0.6} strength={0.7} glow={16} />
        ) : (
          <path key={i} d={pts.join(" ")} stroke={c} strokeWidth={w} fill="none" strokeLinecap="round" opacity={0.75} />
        );
      })}
    </g>
  );
};
