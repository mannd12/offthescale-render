// ST01 acts l02/l03 helpers: text, arrows, grounds, props. Pure functions of their props (no hooks besides none).
import React from "react";
import { BRASS, CHALK, INK, OCEAN, ST_FONT, SUPPOSE, TERRA } from "../../../lib/suppose/palette";
import { smoothPath } from "../../../lib/illustrated/shapes";
import { rnd } from "../../../lib/illustrated/motion";

export const SAGE = SUPPOSE.sage;
export const CLAY = SUPPOSE.clay;
export const CH = SUPPOSE.chalk;
export const C125 = { label: "SIZE", value: "×1.25", sub: "GRAVITY 1.25 g" };
export const C15 = { label: "SIZE", value: "×1.5", sub: "GRAVITY 1.5 g" };
export const TERRA_DARK = "#8A3A20";
export const TERRA_LIT = "#E8987A";

export const Txt: React.FC<{
  x: number; y: number; size?: number; fill?: string; anchor?: "start" | "middle" | "end"; weight?: number; op?: number; ls?: number;
  children: React.ReactNode;
}> = ({ x, y, size = 40, fill = INK, anchor = "start", weight = 900, op = 1, ls = 0, children }) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={ST_FONT} fontWeight={weight} fontSize={size} letterSpacing={ls} fill={fill} opacity={op}>
    {children}
  </text>
);

/** Arrow from (x0,y0) to (x1,y1), head at the end. */
export const Arrow: React.FC<{ x0: number; y0: number; x1: number; y1: number; color: string; w?: number; head?: number; op?: number; dash?: string }> = ({
  x0, y0, x1, y1, color, w = 10, head = 26, op = 1, dash,
}) => {
  const len = Math.hypot(x1 - x0, y1 - y0);
  if (len < 2) return null;
  const ux = (x1 - x0) / len, uy = (y1 - y0) / len;
  const hb = Math.min(head, len * 0.6);
  const bx = x1 - ux * hb, by = y1 - uy * hb;
  const px = -uy * hb * 0.62, py = ux * hb * 0.62;
  return (
    <g opacity={op}>
      <path d={`M ${x0} ${y0} L ${bx} ${by}`} stroke={color} strokeWidth={w} strokeLinecap="round" strokeDasharray={dash} fill="none" />
      <path d={`M ${x1} ${y1} L ${bx + px} ${by + py} L ${bx - px} ${by - py} Z`} fill={color} stroke={color} strokeWidth={w * 0.4} strokeLinejoin="round" />
    </g>
  );
};

/** Sage outdoor ground: far hills, a lit lawn, a darker foreground lip. */
export const SageGround: React.FC<{ y: number; seed?: number }> = ({ y, seed = 1 }) => (
  <g>
    <path d={smoothPath([[-60, y - 150], [260, y - 210 - seed * 10], [620, y - 160], [980, y - 230], [1340, y - 170], [1680, y - 220], [1990, y - 160]]) + ` L 1990 ${y + 40} L -60 ${y + 40} Z`} fill={SAGE.far} />
    <path d={smoothPath([[-60, y - 40], [400, y - 70], [900, y - 30], [1400, y - 60], [1990, y - 30]]) + ` L 1990 1200 L -60 1200 Z`} fill={SAGE.mid} />
    <path d={smoothPath([[-60, y - 40], [400, y - 70], [900, y - 30], [1400, y - 60], [1990, y - 30]])} stroke={SAGE.bounce} strokeWidth={6} fill="none" opacity={0.9} />
    <path d={smoothPath([[-60, y + 70], [600, y + 50], [1300, y + 80], [1990, y + 55]]) + ` L 1990 1200 L -60 1200 Z`} fill={SAGE.near} />
    {Array.from({ length: 14 }, (_, i) => {
      const gx = 60 + i * 140 + rnd(seed * 31 + i) * 60;
      const gy = y + 10 + rnd(seed * 17 + i) * 40;
      return <path key={i} d={`M ${gx} ${gy} q 4 -14 2 -22 M ${gx + 8} ${gy} q 2 -10 6 -16`} stroke={SAGE.near} strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.5} />;
    })}
  </g>
);

/** Indoor sage wall + floor (for falls and shelves). */
export const Room: React.FC<{ floor: number }> = ({ floor }) => (
  <g>
    <rect x={-100} y={-100} width={2120} height={floor + 100} fill={SAGE.haze} />
    <rect x={-100} y={-100} width={2120} height={floor + 100} fill={SAGE.sky[1]} opacity={0.35} />
    {Array.from({ length: 12 }, (_, i) => (
      <path key={i} d={`M ${i * 180 - 20} -100 V ${floor}`} stroke={SAGE.far} strokeWidth={3} opacity={0.35} />
    ))}
    <rect x={-100} y={floor - 30} width={2120} height={30} fill={SAGE.mid} />
    <rect x={-100} y={floor} width={2120} height={400} fill={SAGE.near} />
    <path d={`M -100 ${floor} H 2020`} stroke={SAGE.bounce} strokeWidth={5} opacity={0.7} />
  </g>
);

/** Faint grid on chalk paper. */
export const Grid: React.FC<{ color: string }> = ({ color }) => (
  <g stroke={color} strokeWidth={1.4} opacity={0.55}>
    {Array.from({ length: 33 }, (_, i) => <path key={`v${i}`} d={`M ${i * 60} -60 V 1140`} />)}
    {Array.from({ length: 21 }, (_, i) => <path key={`h${i}`} d={`M -60 ${i * 60} H 1980`} />)}
  </g>
);

/** Zig-zag spring, bottom at yBot, top at yTop. */
export const springPath = (x: number, yTop: number, yBot: number, w: number, n = 7) => {
  const pts: string[] = [`M ${x} ${yBot}`, `L ${x} ${yBot - 14}`];
  const span = yBot - yTop - 28;
  for (let i = 0; i < n * 2; i++) pts.push(`L ${x + (i % 2 ? -w / 2 : w / 2)} ${yBot - 14 - span * ((i + 0.5) / (n * 2))}`);
  pts.push(`L ${x} ${yTop + 14}`, `L ${x} ${yTop}`);
  return pts.join(" ");
};

/** A backpack of books on Lev's back (same transform as Lev; draw BEFORE Lev). */
export const Backpack: React.FC<{ x: number; y: number; h: number; facing?: 1 | -1; lean?: number }> = ({ x, y, h, facing = 1, lean = 0 }) => {
  const s = h / 170;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * facing} ${s}) rotate(${lean} 0 -46)`}>
      {[[-58, OCEAN, -134], [-49, CHALK, -140], [-40, BRASS, -131]].map(([bx, c, by], i) => (
        <rect key={i} x={bx as number} y={by as number} width={10} height={30} rx={2} fill={c as string} stroke={INK} strokeWidth={1.2} transform={`rotate(${(i - 1) * 8} ${bx} ${by})`} />
      ))}
      <rect x={-66} y={-118} width={42} height={70} rx={12} fill={TERRA} />
      <rect x={-66} y={-118} width={42} height={24} rx={10} fill={TERRA_DARK} opacity={0.8} />
      <rect x={-60} y={-82} width={26} height={18} rx={5} fill={TERRA_DARK} opacity={0.6} />
    </g>
  );
};
/** Strap over Lev's front (draw AFTER Lev). */
export const BackpackStrap: React.FC<{ x: number; y: number; h: number; facing?: 1 | -1; lean?: number }> = ({ x, y, h, facing = 1, lean = 0 }) => {
  const s = h / 170;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * facing} ${s}) rotate(${lean} 0 -46)`}>
      <path d="M -14 -108 Q 10 -96 8 -62" stroke={TERRA_DARK} strokeWidth={6} fill="none" strokeLinecap="round" />
    </g>
  );
};

/** Soft dust puff (ring of blobs) at x,y, age a frames, scale k. */
export const Puff: React.FC<{ x: number; y: number; a: number; k?: number; color?: string; life?: number }> = ({ x, y, a, k = 1, color = CHALK, life = 34 }) => {
  if (a < 0 || a > life) return null;
  const p = a / life;
  const spread = (30 + 110 * Math.sqrt(p)) * k;
  return (
    <g opacity={(1 - p) * 0.9}>
      {Array.from({ length: 7 }, (_, i) => {
        const dir = i < 3.5 ? -1 : 1;
        const off = (i % 4) / 3;
        return <circle key={i} cx={x + dir * spread * (0.3 + off * 0.7)} cy={y - (8 + 26 * Math.sin(Math.min(1, p * 2) * Math.PI * 0.5)) * k * (1 - off * 0.4)} r={(14 + 18 * p) * k * (1 - off * 0.3)} fill={color} />;
      })}
    </g>
  );
};

/** rotate a local point (Lev units) around the hip by `lean` degrees */
export const leanPt = (px: number, py: number, lean: number, hipY = -46): [number, number] => {
  const r = (lean * Math.PI) / 180;
  const dx = px, dy = py - hipY;
  return [dx * Math.cos(r) - dy * Math.sin(r), hipY + dx * Math.sin(r) + dy * Math.cos(r)];
};
