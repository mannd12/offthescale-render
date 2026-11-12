// PowerMeter: the GOLD sound-POWER meter for the Saturn V (l04) and the closer's Z-03 (storyboard F4, BUILD.md §5).
// 203 dB is a sound POWER level (#14), not a pressure level, so it never sits on the vermilion air gauge and is never
// drawn above the 194 line. This meter is built to look nothing like L13Gauge: a light-bulb silhouette (power is the
// bulb's wattage, brightness is the pressure at a distance: the AIP release's own analogy, #14) with a radial scale
// inside the glass, a dark needle, gold rays that grow with the value, and a gold readout plate. No vermilion anywhere.
import React from "react";
import { Counter, Emissive, Family, IF2, alpha, mixHex } from "../../lib/illustrated";
import { L13_COLORS, pillFill } from "./families";

/** Numbers the POWER meter shows, each a row in sources.md. */
export const POWER = {
  saturnV: 203, // #14 (overall sound power level, model matched to 1960s data)
  tenEngines: 170, // #14 ("170 decibels would be equivalent to 10 aircraft engines")
  tenThousandEngines: 200, // #14 ("Two hundred would be 10,000 engines")
} as const;

export const POWER_MARKS: { v: number; label: string }[] = [
  { v: POWER.tenEngines, label: "170" },
  { v: POWER.tenThousandEngines, label: "200" },
  { v: POWER.saturnV, label: "203" },
];

export type PowerMeterProps = {
  x: number;
  /** centre of the glass */
  y: number;
  /** glass radius (px); the whole bulb is ~2.1 r tall */
  r: number;
  /** sound power in dB */
  value: number;
  family: Family;
  frame?: number;
  title?: string;
  /** readout: default = Counter "203 dB"; a string overrides it; false = none */
  readout?: string | false;
  /** scale range (default 150-210; unlabelled graduations, only the marks carry numbers) */
  min?: number;
  max?: number;
  marks?: { v: number; label: string }[];
  /** 0..1 extra brightness of the rays (default follows the value) */
  glow?: number;
  opacity?: number;
};

export const PowerMeter: React.FC<PowerMeterProps> = ({ x, y, r, value, family: F, frame = 0, title = "SOUND POWER", readout, min = 150, max = 210, marks = POWER_MARKS, glow, opacity = 1 }) => {
  const gold = L13_COLORS.gold;
  const goldDeep = L13_COLORS.goldDeep;
  const ink = "#2A1E0A";
  const sweep = 220;
  const a0 = 90 + (360 - sweep) / 2; // bottom-left start, clockwise
  const k = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const ang = (v: number) => ((a0 + ((Math.max(min, Math.min(max, v)) - min) / (max - min)) * sweep) * Math.PI) / 180;
  const pt = (v: number, rr: number): [number, number] => [x + Math.cos(ang(v)) * rr, y + Math.sin(ang(v)) * rr];
  const arc = (v0: number, v1: number, rr: number) => {
    const [ax, ay] = pt(v0, rr);
    const [bx, by] = pt(v1, rr);
    const large = ((v1 - v0) / (max - min)) * sweep > 180 ? 1 : 0;
    return `M${ax.toFixed(1)} ${ay.toFixed(1)} A${rr} ${rr} 0 ${large} 1 ${bx.toFixed(1)} ${by.toFixed(1)}`;
  };
  const g = glow ?? k;
  const wob = Math.sin(frame / 3.3) * 0.25 + Math.sin(frame / 7.1) * 0.15;
  const [nx, ny] = pt(value + wob, r * 0.74);
  // bulb silhouette: glass circle + a tapered neck + a ribbed screw base
  const neckTop = y + r * 0.78;
  const neckW = r * 0.52;
  const baseTop = y + r * 1.22;
  const nRays = 14;
  const rayLen = r * (0.25 + 0.55 * g);
  return (
    <g opacity={opacity}>
      {/* rays: rotate slowly and pulse, longer as the power climbs */}
      <g stroke={gold} strokeLinecap="round">
        {Array.from({ length: nRays }, (_, i) => {
          const a = ((i / nRays) * 360 + frame * 0.9) * (Math.PI / 180);
          const pulse = 0.7 + 0.3 * Math.sin(frame / 6 + i * 1.3);
          const r0 = r * 1.14;
          const r1 = r0 + rayLen * pulse;
          if (Math.sin(a) > 0.55) return null; // keep the base clear
          return <line key={i} x1={x + Math.cos(a) * r0} y1={y + Math.sin(a) * r0} x2={x + Math.cos(a) * r1} y2={y + Math.sin(a) * r1} strokeWidth={r * 0.06} opacity={0.35 + 0.55 * g} />;
        })}
      </g>
      <circle cx={x} cy={y} r={r * 1.08} fill={alpha(gold, 0.18 + 0.25 * g)} filter="url(#soft-16)" />
      {/* neck + screw base */}
      <path d={`M${x - r * 0.62} ${y + r * 0.62} Q${x - neckW / 2} ${neckTop + r * 0.1} ${x - neckW / 2} ${baseTop} L${x + neckW / 2} ${baseTop} Q${x + neckW / 2} ${neckTop + r * 0.1} ${x + r * 0.62} ${y + r * 0.62} Z`} fill={mixHex(gold, "#FFF6DC", 0.35)} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={x - neckW / 2 - 2} y={baseTop + i * r * 0.14} width={neckW + 4} height={r * 0.1} rx={r * 0.04} fill={i % 2 ? goldDeep : mixHex(goldDeep, "#000", 0.25)} />
      ))}
      <path d={`M${x - neckW * 0.32} ${baseTop + r * 0.42} L${x + neckW * 0.32} ${baseTop + r * 0.42} L${x + neckW * 0.12} ${baseTop + r * 0.54} L${x - neckW * 0.12} ${baseTop + r * 0.54} Z`} fill={ink} />
      {/* glass */}
      <circle cx={x} cy={y} r={r} fill={mixHex(gold, "#FFF6DC", 0.55)} />
      <circle cx={x} cy={y} r={r} fill="none" stroke={goldDeep} strokeWidth={3} />
      <path d={`M${x - r * 0.62} ${y - r * 0.52} A${r * 0.82} ${r * 0.82} 0 0 1 ${x - r * 0.05} ${y - r * 0.82}`} fill="none" stroke="#FFFFFF" strokeWidth={r * 0.07} strokeLinecap="round" opacity={0.75} />
      {/* scale: track, graduations (no numbers), the lit arc up to the value */}
      <path d={arc(min, max, r * 0.82)} fill="none" stroke={alpha(ink, 0.25)} strokeWidth={r * 0.07} strokeLinecap="round" />
      <Emissive d={arc(min, Math.max(min + 0.01, Math.min(max, value)), r * 0.82)} color={L13_COLORS.saffron} core={goldDeep} width={r * 0.07} strength={0.5 + 0.5 * g} glow={8} />
      {Array.from({ length: (max - min) / 5 + 1 }, (_, i) => {
        const v = min + i * 5;
        const [ax, ay] = pt(v, r * 0.9);
        const [bx, by] = pt(v, r * (i % 2 ? 0.94 : 0.98));
        return <line key={i} x1={ax} y1={ay} x2={bx} y2={by} stroke={ink} strokeWidth={2} opacity={0.6} />;
      })}
      {marks.map((m) => {
        const [ax, ay] = pt(m.v, r * 0.66);
        const [bx, by] = pt(m.v, r * 0.98);
        const [lx, ly] = pt(m.v, r * 0.52);
        return (
          <g key={m.label}>
            <line x1={ax} y1={ay} x2={bx} y2={by} stroke={ink} strokeWidth={3} />
            <text x={lx} y={ly + r * 0.05} textAnchor="middle" style={{ fontFamily: IF2.num, fontWeight: 700, fontSize: Math.max(13, r * 0.12), fill: ink, fontVariantNumeric: "tabular-nums" }}>
              {m.label}
            </text>
          </g>
        );
      })}
      {/* needle */}
      <line x1={x} y1={y} x2={nx} y2={ny} stroke={ink} strokeWidth={Math.max(3, r * 0.04)} strokeLinecap="round" />
      <circle cx={x} cy={y} r={r * 0.08} fill={ink} />
      <circle cx={x} cy={y} r={r * 0.035} fill={gold} />
      {/* title under the hub, inside the glass */}
      <text x={x} y={y + r * 0.36} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: Math.max(13, r * 0.11), letterSpacing: 3, fill: alpha(ink, 0.75) }}>
        {title}
      </text>
      {/* readout: a gold plate under the base */}
      {readout === false ? null : (
        <g>
          <rect x={x - r * 0.62} y={baseTop + r * 0.64} width={r * 1.24} height={r * 0.36} rx={r * 0.06} fill={gold} stroke={pillFill(F)} strokeWidth={2} />
          {typeof readout === "string" ? (
            <text x={x} y={baseTop + r * 0.92} textAnchor="middle" style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: r * 0.24, fill: ink, fontVariantNumeric: "tabular-nums" }}>
              {readout}
            </text>
          ) : (
            <Counter x={x} y={baseTop + r * 0.92} value={Math.round(value)} max={999} digits={3} size={r * 0.24} color={ink} unit="dB" align="middle" />
          )}
        </g>
      )}
    </g>
  );
};
