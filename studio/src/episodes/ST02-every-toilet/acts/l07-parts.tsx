// ST02 act l07 helpers: an old brick building, the newspaper clipping, a pressure gauge, a water tower and the
// lower-48 outline. Pure functions of their props.
import React from "react";
import { CHALK, CHALK_SHADE, INK, ST_FONT, TERRA } from "../../../lib/suppose/palette";
import { rnd } from "../../../lib/illustrated/motion";
import { rrect } from "../../../lib/illustrated/shapes";
import { CLAY, Pt, TERRA_DARK, TERRA_LIT, Txt, WATER, WATER_LIT } from "./l06-parts";

/** brick facade from (x,y) top-left; windows glow by `lit(i)` (0..1) */
export const BrickBuilding: React.FC<{ x: number; y: number; w: number; h: number; f: number; cols?: number; rows?: number; lit?: (i: number) => number }> = ({
  x, y, w, h, f, cols = 3, rows = 4, lit,
}) => {
  const bh = 18;
  let hz = "", vt = "";
  for (let r = 1; r * bh < h; r++) {
    hz += `M ${x} ${y + r * bh} H ${x + w} `;
    const off = r % 2 ? 0 : 22;
    for (let c = off; c < w; c += 44) vt += `M ${x + c} ${y + (r - 1) * bh} V ${y + r * bh} `;
  }
  const ww = (w - 60) / cols;
  const wh = (h - 80) / rows;
  return (
    <g>
      <rect x={x + 14} y={y + 14} width={w} height={h} fill="#000" opacity={0.18} />
      <rect x={x} y={y} width={w} height={h} fill={TERRA} />
      <path d={hz} stroke={TERRA_DARK} strokeWidth={2} opacity={0.55} />
      <path d={vt} stroke={TERRA_DARK} strokeWidth={2} opacity={0.45} />
      <rect x={x + w - 46} y={y} width={46} height={h} fill={TERRA_DARK} opacity={0.35} />
      <rect x={x - 14} y={y - 22} width={w + 28} height={26} rx={4} fill={TERRA_DARK} />
      <rect x={x - 14} y={y - 22} width={w + 28} height={8} rx={4} fill={TERRA_LIT} opacity={0.6} />
      {Array.from({ length: cols * rows }, (_, i) => {
        const c = i % cols, r = Math.floor(i / cols);
        const k = lit ? lit(i) : 0.4 + 0.3 * rnd(i * 3.1);
        const fl = 0.9 + 0.1 * Math.sin(f / 9 + i * 2.1);
        return (
          <g key={i}>
            <rect x={x + 30 + c * ww + 12} y={y + 40 + r * wh + 10} width={ww - 24} height={wh - 28} rx={4} fill={CLAY.near} />
            <rect x={x + 30 + c * ww + 12} y={y + 40 + r * wh + 10} width={ww - 24} height={wh - 28} rx={4} fill="#FFD7A8" opacity={k * fl} />
            <rect x={x + 30 + c * ww + 6} y={y + 40 + r * wh + wh - 22} width={ww - 12} height={8} rx={3} fill={TERRA_LIT} opacity={0.8} />
          </g>
        );
      })}
    </g>
  );
};

/** jagged-edged clipping: SALT LAKE CITY, 1984 */
const edge = (x0: number, y0: number, x1: number, y1: number, n: number, amp: number, seed: number): Pt[] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const u = i / n;
    const nx = -(y1 - y0), ny = x1 - x0;
    const L = Math.hypot(nx, ny) || 1;
    const j = (rnd(seed + i * 1.3) - 0.5) * amp;
    return [x0 + (x1 - x0) * u + (nx / L) * j, y0 + (y1 - y0) * u + (ny / L) * j] as Pt;
  });
const CW = 860, CHT = 540;
const CLIP_PTS: Pt[] = [
  ...edge(-CW / 2, -CHT / 2, CW / 2, -CHT / 2, 26, 10, 3),
  ...edge(CW / 2, -CHT / 2, CW / 2, CHT / 2, 16, 8, 9),
  ...edge(CW / 2, CHT / 2, -CW / 2, CHT / 2, 26, 10, 17),
  ...edge(-CW / 2, CHT / 2, -CW / 2, -CHT / 2, 16, 8, 29),
];
const CLIP_D = "M " + CLIP_PTS.map((p) => p.map((v) => v.toFixed(1)).join(" ")).join(" L ") + " Z";

export const Clipping: React.FC<{ x: number; y: number; rot: number; s?: number; op?: number }> = ({ x, y, rot, s = 1, op = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={op}>
    <path d={CLIP_D} fill="#000" opacity={0.25} transform="translate(14 18)" />
    <path d={CLIP_D} fill="#F4EBDA" />
    <path d={CLIP_D} fill="none" stroke={CHALK_SHADE} strokeWidth={3} />
    <text x={-CW / 2 + 50} y={-CHT / 2 + 64} fontFamily={ST_FONT} fontWeight={800} fontSize={22} letterSpacing={4} fill={INK} opacity={0.55}>THE STORY GOES</text>
    <path d={`M ${-CW / 2 + 50} ${-CHT / 2 + 82} H ${CW / 2 - 50}`} stroke={INK} strokeWidth={2} opacity={0.35} />
    <text x={-CW / 2 + 50} y={-CHT / 2 + 152} fontFamily={ST_FONT} fontWeight={900} fontSize={66} fill={INK}>SALT LAKE CITY, 1984</text>
    <text x={-CW / 2 + 50} y={-CHT / 2 + 198} fontFamily={ST_FONT} fontWeight={800} fontSize={25} fill={INK} opacity={0.75}>A WATER MAIN BREAK, BLAMED ON THE HALFTIME FLUSH</text>
    {/* picture: a cracked pipe */}
    <rect x={-CW / 2 + 50} y={-CHT / 2 + 230} width={330} height={250} rx={6} fill={CHALK_SHADE} opacity={0.6} />
    <rect x={-CW / 2 + 70} y={-CHT / 2 + 330} width={290} height={56} rx={28} fill={INK} opacity={0.55} />
    <rect x={-CW / 2 + 78} y={-CHT / 2 + 338} width={274} height={40} rx={20} fill={WATER} opacity={0.75} />
    <path d={`M ${-CW / 2 + 200} ${-CHT / 2 + 326} l 14 26 l -12 14 l 16 28`} stroke={TERRA} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    {Array.from({ length: 9 }, (_, i) => (
      <rect key={i} x={-CW / 2 + 410} y={-CHT / 2 + 240 + i * 27} width={(i % 4 === 3 ? 240 : 400) - rnd(i * 5) * 40} height={11} rx={5} fill={INK} opacity={0.22} />
    ))}
  </g>
);

/** pressure gauge; n 0..1 needle */
export const Gauge: React.FC<{ x: number; y: number; r: number; n: number; label?: string }> = ({ x, y, r, n, label }) => {
  const a = ((-130 + 260 * n) * Math.PI) / 180;
  return (
    <g>
      <circle cx={x} cy={y} r={r + 12} fill={INK} opacity={0.8} />
      <circle cx={x} cy={y} r={r} fill={CHALK} />
      {Array.from({ length: 11 }, (_, i) => {
        const b = ((-130 + 26 * i) * Math.PI) / 180;
        return <path key={i} d={`M ${x + Math.sin(b) * r * 0.78} ${y - Math.cos(b) * r * 0.78} L ${x + Math.sin(b) * r * 0.92} ${y - Math.cos(b) * r * 0.92}`} stroke={i > 7 ? TERRA : INK} strokeWidth={i > 7 ? 7 : 4} strokeLinecap="round" />;
      })}
      <path d={`M ${x} ${y} L ${x + Math.sin(a) * r * 0.72} ${y - Math.cos(a) * r * 0.72}`} stroke={TERRA} strokeWidth={8} strokeLinecap="round" />
      <circle cx={x} cy={y} r={10} fill={INK} />
      {label ? <Txt x={x} y={y - r - 26} anchor="middle" size={24} ls={3} fill={INK} op={0.7}>{label}</Txt> : null}
    </g>
  );
};

/** elevated water tower; `level` 0..1 shows in a cutaway window */
export const WaterTower: React.FC<{ x: number; ground: number; top: number; w: number; th: number; level: number; f: number }> = ({ x, ground, top, w, th, level, f }) => {
  const tb = top + th;
  const wl = tb - 16 - (th - 40) * level;
  return (
    <g>
      {[-0.38, -0.13, 0.13, 0.38].map((u, i) => (
        <path key={i} d={`M ${x + u * w} ${tb} L ${x + u * w * 1.35} ${ground}`} stroke={INK} strokeWidth={10} opacity={0.65} strokeLinecap="round" />
      ))}
      <path d={`M ${x - w * 0.45} ${tb + (ground - tb) * 0.45} L ${x + w * 0.45} ${tb + (ground - tb) * 0.45} M ${x - w * 0.5} ${tb + (ground - tb) * 0.75} L ${x + w * 0.5} ${tb + (ground - tb) * 0.75}`} stroke={INK} strokeWidth={6} opacity={0.5} />
      <path d={rrect(x - w / 2, top, w, th, 30)} fill={CHALK} />
      <path d={rrect(x + w / 2 - 50, top, 50, th, 24)} fill={CHALK_SHADE} opacity={0.7} />
      <path d={`M ${x - w / 2 - 10} ${top + 8} Q ${x} ${top - 70} ${x + w / 2 + 10} ${top + 8} Z`} fill={TERRA} />
      {/* cutaway window */}
      <rect x={x - w / 2 + 30} y={top + 20} width={w - 90} height={th - 36} rx={14} fill={INK} opacity={0.75} />
      <rect x={x - w / 2 + 36} y={wl} width={w - 102} height={tb - 22 - wl} rx={8} fill={WATER} />
      <path d={`M ${x - w / 2 + 40} ${wl + Math.sin(f / 5) * 2} H ${x + w / 2 - 70}`} stroke={WATER_LIT} strokeWidth={4} strokeLinecap="round" />
      <path d={rrect(x - w / 2, top, w, th, 30)} fill="none" stroke={INK} strokeWidth={4} opacity={0.5} />
    </g>
  );
};

/** lower-48 outline (simplified coastline from lon/lat), in a 1920×1080 frame; NYC sits at US_NYC */
const ll = (lon: number, lat: number): Pt => [150 + (lon + 125) * 21, 260 + (49 - lat) * 25];
const US_LL: [number, number][] = [
  [-124.7, 48.4], [-123, 49], [-95.2, 49], [-95.2, 49.4], [-89.5, 48], [-84.5, 46.5], [-83, 46], [-82.4, 43], [-79, 42.9], [-79, 43.3],
  [-76.5, 44.2], [-75, 45], [-71.5, 45], [-70, 46.7], [-69, 47.4], [-67.8, 47], [-67, 44.8], [-70, 43.7], [-70, 41.7], [-71.5, 41.3],
  [-74, 40.7], [-74, 39.5], [-75, 38.8], [-76, 37], [-75.7, 35.5], [-77, 34.5], [-79, 33.5], [-81, 32], [-81.4, 30.5], [-80.1, 26.5],
  [-80.4, 25.2], [-81, 25.2], [-82.7, 27.8], [-83.5, 29.5], [-84.5, 30], [-86, 30.4], [-89, 30.3], [-89.5, 29.3], [-90.5, 29.1], [-93, 29.7],
  [-95, 29.3], [-97.3, 27.6], [-97.2, 25.9], [-99.5, 27.5], [-101.5, 29.8], [-103, 29], [-104.5, 29.6], [-106.5, 31.8], [-108.2, 31.8],
  [-111, 31.3], [-114.8, 32.5], [-117.1, 32.5], [-118.5, 34], [-120.6, 34.6], [-122.5, 37.7], [-124, 40.4], [-124.2, 42], [-124, 46.2],
];
export const US_D = "M " + US_LL.map(([lo, la]) => ll(lo, la).map((v) => v.toFixed(1)).join(" ")).join(" L ") + " Z";
export const US_NYC: Pt = ll(-74, 40.7);
export const US_CENTER: Pt = ll(-96, 37);