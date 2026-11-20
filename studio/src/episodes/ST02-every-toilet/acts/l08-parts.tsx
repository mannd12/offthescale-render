// ST02 acts l08 + l09: drawing parts (stylised US map + local water blobs, cream toilet, cards, stamp, knob, kettle,
// TV, water tower, reservoir, rolling counter value). Pure functions of props; no frame hooks.
import React from "react";
import { roundPoly, rrect, Pt } from "../../../lib/illustrated/shapes";
import { rnd } from "../../../lib/illustrated/motion";
import { mixHex } from "../../../lib/illustrated/palette";
import { BRASS, CHALK, INK, OCEAN, ST_FONT, TERRA } from "../../../lib/suppose/palette";

export type { Pt };
/** water: blue-sage */
export const WATER = mixHex(OCEAN, "#8DB58A", 0.3);
export const WATER_LIGHT = mixHex(WATER, "#FFFFFF", 0.45);
export const WATER_DEEP = mixHex(WATER, INK, 0.35);
/** toilets: plain cream */
export const CREAM = "#F2EBD3";
export const CREAM_SHADE = "#D9CFAF";
export const TERRA_DARK = mixHex(TERRA, INK, 0.35);

export const Txt: React.FC<{ x: number; y: number; size?: number; fill?: string; anchor?: "start" | "middle" | "end"; weight?: number; ls?: number; opacity?: number; children: React.ReactNode }> = ({
  x, y, size = 40, fill = INK, anchor = "middle", weight = 900, ls = 0, opacity = 1, children,
}) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={ST_FONT} fontWeight={weight} fontSize={size} letterSpacing={ls} fill={fill} opacity={opacity}>{children}</text>
);

export const PaperGrid: React.FC<{ color: string; opacity?: number }> = ({ color, opacity = 0.45 }) => (
  <g stroke={color} strokeWidth={1.4} opacity={opacity}>
    {Array.from({ length: 37 }, (_, i) => <path key={`v${i}`} d={`M ${i * 60 - 120} -200 V 1300`} />)}
    {Array.from({ length: 25 }, (_, i) => <path key={`h${i}`} d={`M -200 ${i * 60 - 120} H 2120`} />)}
  </g>
);

/** scale about a point */
export const about = (x: number, y: number, s: number) => `translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`;

// ------------------------------------------------------------------ the counter value (rolls on a log scale)
export const fmtFlushes = (v: number) => (v >= 1e6 ? `${(v / 1e6).toFixed(1)} MILLION` : Math.round(v).toLocaleString("en-US"));
/** k 0→1 rolls a→b geometrically (a, b > 0); k = 1 returns exactly b */
export const rollLog = (a: number, b: number, k: number) => (k >= 1 ? b : Math.exp(Math.log(a) + (Math.log(b) - Math.log(a)) * k));

// ------------------------------------------------------------------ stylised contiguous US (simplified, illustrative)
const LL: [number, number][] = [
  [-124.7, 48.4], [-123, 49], [-95.2, 49], [-89.5, 48], [-84.5, 46.5], [-82.6, 45.2], [-83, 42.4], [-79, 43.2], [-76, 44.2],
  [-75, 45], [-71.5, 45], [-70, 46.7], [-67.8, 47.1], [-67, 45], [-70.2, 43.6], [-70.6, 42], [-71.9, 41.3], [-74, 40.6],
  [-74.2, 39.6], [-75.5, 38.6], [-76, 36.9], [-75.6, 35.2], [-77, 34.6], [-79, 33.6], [-81, 32], [-81.4, 30.4], [-80.1, 27],
  [-80.4, 25.3], [-81.7, 25.9], [-82.7, 28], [-82.9, 29.2], [-84.3, 30], [-86.5, 30.4], [-89.4, 30.2], [-89.6, 29.2],
  [-91, 29.4], [-93.8, 29.7], [-95.1, 29.2], [-97.2, 27.7], [-97.4, 26], [-99.1, 26.5], [-100.4, 28.5], [-101.6, 29.8],
  [-103, 29], [-104.7, 30], [-106.5, 31.8], [-108.2, 31.8], [-111.1, 31.3], [-114.8, 32.5], [-117.1, 32.5], [-118.5, 34],
  [-120.6, 34.6], [-121.9, 36.6], [-122.5, 37.8], [-123.7, 39], [-124.3, 40.3], [-124.2, 42], [-124, 44], [-123.9, 46.2],
];
export const US_PTS: Pt[] = LL.map(([lon, lat]) => [150 + (lon + 125) * 21, 260 + (49 - lat) * 27]);
export const US_PATH = roundPoly(US_PTS, 14);
export const US_BOX = { x0: 150, x1: 1370, y0: 260, y1: 930, cx: 760, cy: 580 };

const inside = (p: Pt, poly: Pt[]) => {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};
const edgeDist = (p: Pt, poly: Pt[]) => {
  let m = 1e9;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const k = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy)));
    m = Math.min(m, Math.hypot(p[0] - a[0] - k * dx, p[1] - a[1] - k * dy));
  }
  return m;
};

export type Blob = { x: number; y: number; r: number; k: number; seed: number };
/** one blob per local water system (illustrative): separate, never touching */
export const BLOBS: Blob[] = (() => {
  const out: Blob[] = [];
  for (let i = 0; i < 4000 && out.length < 170; i++) {
    const p: Pt = [mixN(US_BOX.x0, US_BOX.x1, rnd(i * 3 + 1)), mixN(US_BOX.y0, US_BOX.y1, rnd(i * 7 + 2))];
    const big = rnd(i * 11 + 5);
    const r = big > 0.93 ? 20 + rnd(i) * 8 : big > 0.7 ? 12 + rnd(i) * 5 : 6 + rnd(i) * 5;
    if (!inside(p, US_PTS) || edgeDist(p, US_PTS) < r + 10) continue;
    if (out.some((b) => Math.hypot(b.x - p[0], b.y - p[1]) < b.r + r + 12)) continue;
    out.push({ x: p[0], y: p[1], r, k: out.length, seed: i });
  }
  return out;
})();
function mixN(a: number, b: number, k: number) { return a + (b - a) * k; }

/** an organic little water blob */
export const blobD = (x: number, y: number, r: number, seed: number, wob = 0) => {
  const pts: Pt[] = Array.from({ length: 7 }, (_, i) => {
    const a = (i / 7) * Math.PI * 2;
    const rr = r * (1 + (rnd(seed * 13 + i) - 0.5) * 0.34 + wob * Math.sin(a * 2 + seed));
    return [x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.86];
  });
  return roundPoly(pts, r * 0.7);
};

export const USLand: React.FC<{ fill: string; stroke?: string; sw?: number; opacity?: number }> = ({ fill, stroke = INK, sw = 4, opacity = 1 }) => (
  <g opacity={opacity}>
    <path d={US_PATH} transform="translate(10 14)" fill="#000" opacity={0.1} />
    <path d={US_PATH} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
  </g>
);

// ------------------------------------------------------------------ a plain cream toilet (side view, faces +x); feet at (x, y)
export const Toilet: React.FC<{ x: number; y: number; s?: number; fill?: number; outline?: string; flash?: number }> = ({ x, y, s = 1, fill, outline = INK, flash = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={2} rx={40} ry={6} fill="#000" opacity={0.15} />
    {/* tank */}
    <path d={rrect(-42, -112, 36, 66, 7)} fill={CREAM} stroke={outline} strokeWidth={3} />
    {fill !== undefined ? (
      <g>
        <path d={rrect(-37, -107 + 56 * (1 - fill), 26, Math.max(0.1, 56 * fill), 4)} fill={WATER} opacity={0.9} />
        <path d={rrect(-42, -112, 36, 66, 7)} fill="none" stroke={outline} strokeWidth={3} />
      </g>
    ) : null}
    <path d={rrect(-46, -118, 44, 10, 5)} fill={CREAM_SHADE} stroke={outline} strokeWidth={3} />
    {/* bowl + pedestal */}
    <path d="M -46 -52 H 40 Q 40 -24 14 -16 L 10 0 H -24 L -22 -18 Q -46 -26 -46 -52 Z" fill={CREAM} stroke={outline} strokeWidth={3} strokeLinejoin="round" />
    <path d="M -46 -56 H 42" stroke={outline} strokeWidth={5} strokeLinecap="round" />
    <path d="M 2 -40 Q 22 -40 30 -48" stroke={CREAM_SHADE} strokeWidth={4} fill="none" strokeLinecap="round" />
    {flash > 0 ? <path d="M -46 -52 H 40 Q 40 -24 14 -16 L 10 0 H -24 L -22 -18 Q -46 -26 -46 -52 Z" fill="#FFFFFF" opacity={flash * 0.6} /> : null}
  </g>
);

// ------------------------------------------------------------------ paper cards, panels, stamps
const HEAD = mixHex(INK, "#2E4A3C", 0.35);
export const Panel: React.FC<{ x: number; y: number; w: number; h: number; title: string; tint: string; dim?: number }> = ({ x, y, w, h, title, tint, dim = 0 }) => (
  <g>
    <path d={rrect(x + 8, y + 12, w, h, 30)} fill="#000" opacity={0.08} />
    <path d={rrect(x, y, w, h, 30)} fill={tint} stroke={INK} strokeWidth={4} />
    <path d={rrect(x, y, w, 96, 30)} fill={HEAD} />
    <rect x={x} y={y + 60} width={w} height={36} fill={HEAD} />
    <Txt x={x + w / 2} y={y + 64} size={44} fill={CHALK} ls={4}>{title}</Txt>
    {dim > 0 ? <path d={rrect(x, y, w, h, 30)} fill={tint} opacity={dim} /> : null}
  </g>
);

/** a clipped card: big figure + small caption; `k` 0→1 drops it onto its pin */
export const Card: React.FC<{ x: number; y: number; w: number; h: number; big: string; small: string; k: number; rot?: number; bigSize?: number }> = ({
  x, y, w, h, big, small, k, rot = 0, bigSize = 74,
}) => {
  if (k <= 0) return null;
  const dy = (1 - k) * -90;
  const r = rot + (1 - k) * 8;
  return (
    <g transform={`translate(${x + w / 2} ${y + dy}) rotate(${r})`} opacity={Math.min(1, k * 2.5)}>
      <path d={rrect(-w / 2 + 6, 10, w, h, 18)} fill="#000" opacity={0.12} />
      <path d={rrect(-w / 2, 0, w, h, 18)} fill="#FFFDF4" stroke={INK} strokeWidth={3.5} />
      <Txt x={0} y={h * 0.55} size={bigSize}>{big}</Txt>
      <Txt x={0} y={h * 0.55 + 46} size={26} ls={3} weight={800} fill={mixHex(INK, "#FFFFFF", 0.3)}>{small}</Txt>
      {/* clip */}
      <path d={rrect(-36, -16, 72, 30, 8)} fill={TERRA} stroke={INK} strokeWidth={3} />
      <path d={rrect(-24, -10, 48, 8, 4)} fill="#F2A07E" opacity={0.8} />
    </g>
  );
};

/** a rubber stamp; `k` 0→1 slams it down (scale from big, then a settle) */
export const Stamp: React.FC<{ x: number; y: number; text: string; k: number; rot?: number; size?: number; color?: string }> = ({ x, y, text, k, rot = -8, size = 46, color = TERRA }) => {
  if (k <= 0) return null;
  const w = text.length * size * 0.66 + 60;
  const h = size + 40;
  const s = k < 1 ? 1 + (1 - k) * 1.2 : 1;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={Math.min(1, k * 1.6) * 0.95}>
      <path d={rrect(-w / 2, -h / 2, w, h, 14)} fill={mixHex(color, "#FFFFFF", 0.85)} fillOpacity={0.55} stroke={color} strokeWidth={7} />
      <path d={rrect(-w / 2 + 10, -h / 2 + 10, w - 20, h - 20, 9)} fill="none" stroke={color} strokeWidth={2.5} />
      <Txt x={0} y={size * 0.36} size={size} fill={color} ls={3}>{text}</Txt>
    </g>
  );
};

// ------------------------------------------------------------------ a knob with a dial arc; v 0..1
export const Knob: React.FC<{ x: number; y: number; r?: number; v: number; label: string; hot?: number }> = ({ x, y, r = 110, v, label, hot = 0 }) => {
  const a0 = 135, a1 = 405;
  const ang = a0 + (a1 - a0) * v;
  const P = (a: number, rr: number): Pt => [x + Math.cos((a * Math.PI) / 180) * rr, y + Math.sin((a * Math.PI) / 180) * rr];
  const arc = (from: number, to: number, rr: number) => {
    const [sx, sy] = P(from, rr), [ex, ey] = P(to, rr);
    return `M ${sx} ${sy} A ${rr} ${rr} 0 ${to - from > 180 ? 1 : 0} 1 ${ex} ${ey}`;
  };
  const tip = P(ang, r * 0.62);
  return (
    <g>
      {Array.from({ length: 11 }, (_, i) => {
        const a = a0 + ((a1 - a0) * i) / 10;
        const [p1x, p1y] = P(a, r + 18), [p2x, p2y] = P(a, r + 32);
        return <path key={i} d={`M ${p1x} ${p1y} L ${p2x} ${p2y}`} stroke={INK} strokeWidth={4} strokeLinecap="round" opacity={0.5} />;
      })}
      <path d={arc(a0, a1, r + 4)} stroke={INK} strokeWidth={12} fill="none" strokeLinecap="round" opacity={0.15} />
      {v > 0.005 ? <path d={arc(a0, ang, r + 4)} stroke={TERRA} strokeWidth={12} fill="none" strokeLinecap="round" /> : null}
      <ellipse cx={x + 6} cy={y + 14} rx={r * 0.92} ry={r * 0.92} fill="#000" opacity={0.12} />
      <circle cx={x} cy={y} r={r * 0.9} fill={mixHex(TERRA, "#FFFFFF", 0.1 + hot * 0.15)} stroke={INK} strokeWidth={4} />
      <circle cx={x} cy={y} r={r * 0.72} fill={TERRA_DARK} opacity={0.25} />
      <circle cx={x - r * 0.25} cy={y - r * 0.3} r={r * 0.22} fill="#F2A07E" opacity={0.5} />
      <path d={`M ${x} ${y} L ${tip[0]} ${tip[1]}`} stroke={CHALK} strokeWidth={14} strokeLinecap="round" />
      <path d={`M ${x} ${y} L ${tip[0]} ${tip[1]}`} stroke={INK} strokeWidth={4} strokeLinecap="round" opacity={0.6} />
      <circle cx={x} cy={y} r={12} fill={INK} />
      <Txt x={x} y={y + r + 86} size={34} ls={2}>{label}</Txt>
    </g>
  );
};

// ------------------------------------------------------------------ kettle (terracotta prop), feet at (x, y), faces +x
export const Kettle: React.FC<{ x: number; y: number; s?: number; steam?: number; frame: number; seed?: number }> = ({ x, y, s = 1, steam = 1, frame, seed = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={80} ry={10} fill="#000" opacity={0.15} />
    <path d="M -70 0 Q -78 -100 -40 -128 L 40 -128 Q 78 -100 70 0 Z" fill={TERRA} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <path d="M -50 -20 Q -58 -90 -30 -112" stroke="#F2A07E" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.7} />
    <path d="M 62 -40 L 118 -104 L 128 -94 L 70 -18 Z" fill={TERRA} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <path d="M -40 -128 Q 0 -200 40 -128" stroke={INK} strokeWidth={14} fill="none" strokeLinecap="round" />
    <path d="M -24 -136 H 24" stroke={INK} strokeWidth={10} strokeLinecap="round" />
    <path d={rrect(-70, -18, 140, 18, 8)} fill={TERRA_DARK} stroke={INK} strokeWidth={3} />
    {steam > 0
      ? [0, 1, 2].map((k) => {
          const age = ((frame + k * 17 + seed * 7) % 50) / 50;
          const sx = 124 + Math.sin(age * 7 + k) * 10;
          return (
            <path key={k} d={`M ${sx} ${-112 - age * 120} q 14 -18 0 -36 q -14 -18 0 -36`} stroke={CHALK} strokeWidth={9} fill="none" strokeLinecap="round"
              opacity={steam * (1 - age) * 0.9} />
          );
        })
      : null}
  </g>
);

/** a TV on a stand: the screen shows end credits scrolling (k = how far the "show" has run) */
export const TV: React.FC<{ x: number; y: number; w?: number; frame: number; screen: string; glow?: number }> = ({ x, y, w = 440, frame, screen, glow = 1 }) => {
  const h = w * 0.6;
  const roll = (frame * 2.2) % 60;
  return (
    <g>
      <path d={`M ${x - 50} ${y} L ${x - 30} ${y - 46} H ${x + 30} L ${x + 50} ${y} Z`} fill={INK} />
      <path d={rrect(x - w / 2, y - 46 - h, w, h, 22)} fill={INK} />
      <path d={rrect(x - w / 2 + 18, y - 46 - h + 18, w - 36, h - 36, 12)} fill={screen} opacity={0.7 + 0.3 * glow} />
      <clipPath id="l09tvclip"><path d={rrect(x - w / 2 + 18, y - 46 - h + 18, w - 36, h - 36, 12)} /></clipPath>
      <g clipPath="url(#l09tvclip)">
        {Array.from({ length: 8 }, (_, i) => {
          const ly = y - 46 - h + 40 + i * 60 - roll;
          const lw = 80 + rnd(i * 5) * 160;
          return <rect key={i} x={x - lw / 2} y={ly} width={lw} height={14} rx={7} fill={INK} opacity={0.35} />;
        })}
      </g>
    </g>
  );
};

/** a water tower: tank of radius-ish w on legs; level 0..1 */
export const WaterTower: React.FC<{ x: number; y: number; w?: number; level: number }> = ({ x, y, w = 160, level }) => {
  const th = w * 0.8;
  const ty = y - 230;
  return (
    <g>
      <path d={`M ${x - w * 0.36} ${y} L ${x - w * 0.24} ${ty} M ${x + w * 0.36} ${y} L ${x + w * 0.24} ${ty} M ${x - w * 0.3} ${y - 80} L ${x + w * 0.3} ${y - 150} M ${x + w * 0.3} ${y - 80} L ${x - w * 0.3} ${y - 150}`}
        stroke={INK} strokeWidth={8} strokeLinecap="round" />
      <path d={rrect(x - w / 2, ty - th, w, th, 22)} fill={CHALK} stroke={INK} strokeWidth={5} />
      <clipPath id={`wt${x}`}><path d={rrect(x - w / 2 + 8, ty - th + 8, w - 16, th - 16, 16)} /></clipPath>
      <g clipPath={`url(#wt${x})`}>
        <rect x={x - w / 2} y={ty - 8 - (th - 16) * level} width={w} height={th} fill={WATER} />
        <rect x={x - w / 2} y={ty - 8 - (th - 16) * level} width={w} height={6} fill={WATER_LIGHT} />
      </g>
      <path d={`M ${x - w / 2 - 10} ${ty - th} Q ${x} ${ty - th - 50} ${x + w / 2 + 10} ${ty - th} Z`} fill={TERRA} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    </g>
  );
};

/** a big reservoir basin, top edge at y; level 0..1 */
export const Reservoir: React.FC<{ x: number; y: number; w: number; h: number; level: number; frame: number }> = ({ x, y, w, h, level, frame }) => {
  const d = `M ${x - w / 2} ${y} L ${x - w / 2 + 60} ${y + h} H ${x + w / 2 - 60} L ${x + w / 2} ${y} Z`;
  const wy = y + h * (1 - level);
  const surf = Array.from({ length: 25 }, (_, i) => [x - w / 2 + (w * i) / 24, wy + Math.sin(i * 0.9 + frame / 9) * 4] as Pt);
  return (
    <g>
      <clipPath id={`rv${x}`}><path d={d} /></clipPath>
      <path d={d} fill={mixHex(CHALK, INK, 0.12)} />
      <g clipPath={`url(#rv${x})`}>
        <path d={`M ${surf.map((p) => p.join(" ")).join(" L ")} L ${x + w / 2} ${y + h + 10} L ${x - w / 2} ${y + h + 10} Z`} fill={WATER} />
        {[0, 1, 2].map((k) => <path key={k} d={`M ${x - w / 3 + k * 140 + ((frame * 0.8) % 60)} ${wy + 30 + k * 26} h 70`} stroke={WATER_LIGHT} strokeWidth={5} strokeLinecap="round" opacity={0.7} />)}
      </g>
      <path d={d} fill="none" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <path d={`M ${x - w / 2 - 30} ${y} H ${x + w / 2 + 30}`} stroke={INK} strokeWidth={8} strokeLinecap="round" />
    </g>
  );
};

/** a little cream house with a terracotta roof; base centre at (x, y) */
export const House: React.FC<{ x: number; y: number; s?: number; lit?: number }> = ({ x, y, s = 1, lit = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-26} y={-44} width={52} height={44} fill={mixHex(CREAM, "#FFFFFF", lit * 0.6)} stroke={INK} strokeWidth={3} />
    <path d="M -34 -42 L 0 -72 L 34 -42 Z" fill={TERRA} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
    <rect x={-8} y={-24} width={16} height={24} fill={INK} opacity={0.6} />
  </g>
);

/** a small brass spark star */
export const Spark: React.FC<{ x: number; y: number; r: number; rot?: number }> = ({ x, y, r, rot = 0 }) => {
  const pts: Pt[] = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2 + (rot * Math.PI) / 180;
    const rr = i % 2 ? r * 0.38 : r;
    return [x + Math.cos(a) * rr, y + Math.sin(a) * rr];
  });
  return <path d={roundPoly(pts, 3)} fill={BRASS} stroke={INK} strokeWidth={3} strokeLinejoin="round" />;
};
