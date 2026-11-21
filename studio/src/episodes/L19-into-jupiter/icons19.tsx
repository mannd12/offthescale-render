// L19 small shared icons (BUILD.md §5 `icons19.tsx`). Cartoon props only; no logos, no insignia, no real faces (F1, F7).
// USAGE: every icon takes x, y (centre) and size (px, roughly its height); extras below.
//   <WaterDrop x y size color? />            a teal-aqua drop (water abundance)
//   <Flask x y size level={0..1} f color? /> a glass flask filling to `level` with a sloshing surface (2-06: exactly half)
//   <Bolt x y size f? />                     a lightning bolt that flickers (lightning one tenth as often)
//   <SunIcon x y size f? />                  a sun disc with turning rays (sunlight as a heat source, 3-08)
//   <Compass x y size f spin?={deg/f} />     a compass whose needle spins (the magnetic field, 6-06)
//   <Magnifier x y size rotate? />
//   <Cactus x y={its base} size />           the dry-spot joke prop (F14)
//   <Tumbleweed x y size rotate />           rolls (caller drives rotate and x)
//   <Headset x y size />                     Tick's listening headset prop (on the console)
//   <EarthDot x y size? f? />                a tiny blue Earth dot (no continents, F15)
import React from "react";
import { L19_COLORS as C } from "./families";

const cl = (v: number) => Math.max(0, Math.min(1, v));

export const WaterDrop: React.FC<{ x: number; y: number; size: number; color?: string }> = ({ x, y, size, color = C.starAqua }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d={`M0 ${-size / 2} C${size * 0.35} ${-size * 0.1} ${size * 0.38} ${size * 0.15} ${size * 0.38} ${size * 0.18} A${size * 0.38} ${size * 0.38} 0 1 1 ${-size * 0.38} ${size * 0.18} C${-size * 0.38} ${size * 0.15} ${-size * 0.35} ${-size * 0.1} 0 ${-size / 2} Z`} fill={color} stroke={C.belt} strokeWidth={size * 0.05} />
    <ellipse cx={-size * 0.12} cy={size * 0.1} rx={size * 0.07} ry={size * 0.12} fill="#FFFFFF" opacity={0.6} />
  </g>
);

export const Flask: React.FC<{ x: number; y: number; size: number; level: number; f: number; color?: string }> = ({ x, y, size, level, f, color = C.belt }) => {
  const id = "flask" + React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const w = size * 0.7;
  const neck = size * 0.18;
  const top = y - size / 2;
  const bot = y + size / 2;
  const body = `M${x - neck} ${top} V${top + size * 0.3} L${x - w / 2} ${bot - size * 0.06} Q${x - w / 2} ${bot} ${x - w / 2 + size * 0.06} ${bot} H${x + w / 2 - size * 0.06} Q${x + w / 2} ${bot} ${x + w / 2} ${bot - size * 0.06} L${x + neck} ${top + size * 0.3} V${top} Z`;
  const ly = bot - (bot - (top + size * 0.3)) * cl(level);
  const slosh = Math.sin(f * 0.3) * size * 0.03;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <path d={body} />
        </clipPath>
      </defs>
      <path d={body} fill="#FFE8B0" opacity={0.25} transform="translate(6 8)" />
      <g clipPath={`url(#${id})`}>
        <path d={`M${x - w} ${ly + slosh} Q${x} ${ly - slosh * 2} ${x + w} ${ly - slosh} V${bot + 10} H${x - w} Z`} fill={color} />
        <rect x={x - w} y={ly - slosh - 3} width={w * 2} height={6} fill={C.starAqua} opacity={0.8} />
      </g>
      <path d={body} fill="none" stroke={C.apricot} strokeWidth={size * 0.04} strokeLinejoin="round" />
      <rect x={x - neck * 1.3} y={top - size * 0.04} width={neck * 2.6} height={size * 0.06} rx={size * 0.03} fill={C.apricot} />
    </g>
  );
};

export const Bolt: React.FC<{ x: number; y: number; size: number; f?: number }> = ({ x, y, size, f = 0 }) => (
  <g transform={`translate(${x} ${y})`} opacity={0.6 + 0.4 * Math.abs(Math.sin(f * 0.7))}>
    <path d={`M${size * 0.1} ${-size / 2} L${-size * 0.3} ${size * 0.08} H${0} L${-size * 0.12} ${size / 2} L${size * 0.32} ${-size * 0.1} H${size * 0.02} Z`} fill={C.goldHot} stroke={C.goldRim} strokeWidth={size * 0.04} strokeLinejoin="round" />
  </g>
);

export const SunIcon: React.FC<{ x: number; y: number; size: number; f?: number }> = ({ x, y, size, f = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <g transform={`rotate(${(f * 2) % 360})`}>
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} x={-size * 0.04} y={-size / 2} width={size * 0.08} height={size * 0.16} rx={size * 0.04} fill={C.goldHot} transform={`rotate(${i * 36})`} />
      ))}
    </g>
    <circle r={size * 0.28} fill={C.gold} />
    <circle cx={-size * 0.08} cy={-size * 0.08} r={size * 0.1} fill="#FFF0A0" />
  </g>
);

export const Compass: React.FC<{ x: number; y: number; size: number; f: number; spin?: number }> = ({ x, y, size, f, spin = 4 }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={size / 2} fill={C.goldRim} />
    <circle r={size * 0.42} fill={C.ink} />
    {[0, 90, 180, 270].map((a) => (
      <rect key={a} x={-size * 0.02} y={-size * 0.42} width={size * 0.04} height={size * 0.08} fill={C.heard} transform={`rotate(${a})`} />
    ))}
    <g transform={`rotate(${(f * spin) % 360})`}>
      <path d={`M0 ${-size * 0.36} L${size * 0.07} 0 L0 ${size * 0.36} L${-size * 0.07} 0 Z`} fill={C.heard} />
      <path d={`M0 ${-size * 0.36} L${size * 0.07} 0 L${-size * 0.07} 0 Z`} fill={C.glow} />
    </g>
    <circle r={size * 0.05} fill={C.goldHot} />
  </g>
);

export const Magnifier: React.FC<{ x: number; y: number; size: number; rotate?: number }> = ({ x, y, size, rotate = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
    <rect x={size * 0.16} y={size * 0.14} width={size * 0.14} height={size * 0.42} rx={size * 0.06} fill={C.goldRim} transform={`rotate(-45 ${size * 0.23} ${size * 0.14})`} />
    <circle r={size * 0.3} fill={C.starAqua} opacity={0.35} stroke={C.gold} strokeWidth={size * 0.08} />
    <circle cx={-size * 0.1} cy={-size * 0.1} r={size * 0.07} fill="#FFFFFF" opacity={0.6} />
  </g>
);

export const Cactus: React.FC<{ x: number; y: number; size: number }> = ({ x, y, size }) => (
  <g transform={`translate(${x} ${y})`} fill={C.cactus} stroke="#0B5A24" strokeWidth={size * 0.03}>
    <rect x={-size * 0.1} y={-size} width={size * 0.2} height={size} rx={size * 0.1} />
    <path d={`M${-size * 0.1} ${-size * 0.5} H${-size * 0.28} V${-size * 0.78}`} fill="none" strokeWidth={size * 0.12} stroke={C.cactus} strokeLinecap="round" />
    <path d={`M${size * 0.1} ${-size * 0.38} H${size * 0.28} V${-size * 0.66}`} fill="none" strokeWidth={size * 0.12} stroke={C.cactus} strokeLinecap="round" />
    <rect x={-size * 0.03} y={-size * 0.95} width={size * 0.04} height={size * 0.85} fill="#7FD86A" stroke="none" opacity={0.6} />
  </g>
);

export const Tumbleweed: React.FC<{ x: number; y: number; size: number; rotate: number }> = ({ x, y, size, rotate }) => (
  <g transform={`translate(${x} ${y - size}) rotate(${rotate % 360})`} fill="none" stroke="#B8701A" strokeWidth={size * 0.08} strokeLinecap="round">
    <circle r={size} />
    <path d={`M${-size} 0 Q0 ${-size * 0.8} ${size} 0 M${-size * 0.6} ${-size * 0.7} Q0 0 ${size * 0.6} ${size * 0.7} M0 ${-size} Q${size * 0.5} 0 0 ${size}`} />
  </g>
);

export const Headset: React.FC<{ x: number; y: number; size: number }> = ({ x, y, size }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d={`M${-size * 0.4} ${size * 0.1} A${size * 0.4} ${size * 0.4} 0 0 1 ${size * 0.4} ${size * 0.1}`} fill="none" stroke={C.ink} strokeWidth={size * 0.08} />
    <rect x={-size * 0.5} y={0} width={size * 0.2} height={size * 0.32} rx={size * 0.08} fill={C.lever} />
    <rect x={size * 0.3} y={0} width={size * 0.2} height={size * 0.32} rx={size * 0.08} fill={C.lever} />
  </g>
);

export const EarthDot: React.FC<{ x: number; y: number; size?: number; f?: number }> = ({ x, y, size = 18, f = 0 }) => (
  <g>
    <circle cx={x} cy={y} r={size * (1.8 + 0.2 * Math.sin(f * 0.2))} fill={C.earth} opacity={0.18} />
    <circle cx={x} cy={y} r={size} fill={C.earth} />
    <circle cx={x - size * 0.3} cy={y - size * 0.3} r={size * 0.35} fill={C.starAqua} opacity={0.7} />
  </g>
);
