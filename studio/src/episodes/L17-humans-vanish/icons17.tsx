// L17 · small shared icons (BUILD.md §5) used by both packages: the ladder's stamps, the board's sheets, the closer's
// rows. All generic and unnamed (F1, F7, F8): no real insignia, no likeness, no colour claim on the tower. The large
// bespoke versions (the full tower, the Roman wall, the Moon, strata, the cliff, the tunnel) belong in each package's
// *-parts.tsx.
// USAGE: every icon is centred on (x, y) and `size` px tall; `ink` is the outline/line colour, `fill` the body colour.
//   <EiffelIcon x y size? ink? />            lattice tower in clean line art (no colour claim, F7)
//   <DomeIcon x y size? fill? ink? />        a generic domed building (no name, F3)
//   <StoneIcon x y size? fill? ink? />       a chipped stone with flake scars (Lomekwi-style, not a replica)
//   <PrintIcon x y size? fill? ink? rotate? />  one sharp-edged bootprint with tread bars
//   <BandIcon x y size? glow? />             a layer-cake section with one thin bright band (our era)
//   <BottleIcon x y size? fill? ink? />      a plain bottle
//   <GearIcon x y size? f? speed?=3 (deg/f) fill? ink? teeth?=9 />
//   <LampIcon x y size? lit?={0..1} ink? />  a street lamp; lit adds a bloom
//   <PumpIcon x y size? f? speed?=25 (deg/f impeller) running?=true ink? fill? />
import React from "react";
import { Bloom, alpha } from "../../lib/illustrated";
import { L17_COLORS } from "./families";

const C = L17_COLORS;
type IconP = { x: number; y: number; size?: number; ink?: string; fill?: string };

export const EiffelIcon: React.FC<IconP> = ({ x, y, size = 120, ink = C.ink }) => {
  const s = size / 100;
  const sw = Math.max(1.5, 2.6 * s);
  // outline: two legs flaring from a spire, two platforms
  const L = (px: number, py: number) => `${x + px * s} ${y + (py - 50) * s}`;
  return (
    <g fill="none" stroke={ink} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d={`M${L(-30, 100)} Q${L(-12, 62)} ${L(-5, 25)} L${L(-2, 2)} L${L(0, -2)} L${L(2, 2)} L${L(5, 25)} Q${L(12, 62)} ${L(30, 100)}`} />
      <path d={`M${L(-18, 100)} Q${L(0, 74)} ${L(18, 100)}`} />
      <path d={`M${L(-15, 60)} H${x + 15 * s}`} />
      <path d={`M${L(-8, 30)} H${x + 8 * s}`} />
      {/* lattice cross-hatching */}
      {[
        [70, 85],
        [45, 60],
        [30, 45],
        [12, 28],
      ].map(([a, b], i) => {
        // half-width of the tower at height py (matches the leg curves closely enough at icon size)
        const hw = (py: number) => (py < 25 ? 2 + py * 0.12 : 5 + (py - 25) * 0.33) * 0.92;
        return <path key={i} d={`M${L(-hw(b), b)} L${L(hw(a), a)} M${L(hw(b), b)} L${L(-hw(a), a)}`} strokeWidth={sw * 0.6} opacity={0.8} />;
      })}
    </g>
  );
};

export const DomeIcon: React.FC<IconP> = ({ x, y, size = 120, ink = C.ink, fill = "#F4E6C8" }) => {
  const s = size / 100;
  const P = (px: number, py: number) => `${x + px * s} ${y + (py - 50) * s}`;
  return (
    <g strokeLinejoin="round">
      <rect x={x - 46 * s} y={y + 40 * s} width={92 * s} height={10 * s} fill={fill} stroke={ink} strokeWidth={2 * s} />
      <rect x={x - 40 * s} y={y + 4 * s} width={80 * s} height={36 * s} fill={fill} stroke={ink} strokeWidth={2 * s} />
      {[-30, -15, 0, 15, 30].map((cx) => (
        <rect key={cx} x={x + (cx - 3) * s} y={y + 8 * s} width={6 * s} height={30 * s} fill={alpha(ink, 0.18)} />
      ))}
      <rect x={x - 34 * s} y={y - 6 * s} width={68 * s} height={10 * s} fill={fill} stroke={ink} strokeWidth={2 * s} />
      <path d={`M${P(-30, 44)} Q${P(-30, 6)} ${P(0, 4)} Q${P(30, 6)} ${P(30, 44)} Z`} fill={fill} stroke={ink} strokeWidth={2 * s} />
      <circle cx={x} cy={y - 47 * s} r={5 * s} fill="none" stroke={ink} strokeWidth={2 * s} />
      <path d={`M${P(-20, 30)} Q${P(-14, 14)} ${P(0, 11)}`} fill="none" stroke="#FFFFFF" strokeWidth={3 * s} opacity={0.6} />
    </g>
  );
};

export const StoneIcon: React.FC<IconP> = ({ x, y, size = 100, ink = "#3A2414", fill = "#C9A27A" }) => {
  const s = size / 100;
  const pts = [
    [-46, 10],
    [-30, -30],
    [6, -42],
    [40, -20],
    [48, 14],
    [20, 38],
    [-26, 34],
  ];
  const d = "M" + pts.map(([px, py]) => `${x + px * s} ${y + py * s}`).join(" L") + " Z";
  return (
    <g>
      <ellipse cx={x + 6 * s} cy={y + 40 * s} rx={46 * s} ry={8 * s} fill="#000" opacity={0.18} />
      <path d={d} fill={fill} stroke={ink} strokeWidth={2.4 * s} strokeLinejoin="round" />
      {/* flake scars: conchoidal facets */}
      <path d={`M${x - 30 * s} ${y - 30 * s} Q${x - 10 * s} ${y - 10 * s} ${x - 22 * s} ${y + 12 * s} L${x - 46 * s} ${y + 10 * s} Z`} fill={alpha("#FFFFFF", 0.2)} />
      <path d={`M${x + 6 * s} ${y - 42 * s} Q${x + 10 * s} ${y - 12 * s} ${x + 40 * s} ${y - 20 * s} Z`} fill={alpha("#000000", 0.12)} />
      <path d={`M${x + 48 * s} ${y + 14 * s} Q${x + 18 * s} ${y + 6 * s} ${x + 20 * s} ${y + 38 * s} Z`} fill={alpha("#000000", 0.18)} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${x + (-8 + i * 12) * s} ${y + (-20 + i * 4) * s} q${6 * s} ${10 * s} ${2 * s} ${22 * s}`} fill="none" stroke={ink} strokeWidth={1.4 * s} opacity={0.45} />
      ))}
    </g>
  );
};

/** One bootprint, toe up, sharp-edged (dust holds its shape on the Moon: F6). */
export const PrintIcon: React.FC<IconP & { rotate?: number }> = ({ x, y, size = 120, ink = "#5A4A30", fill = "#BFA982", rotate = 0 }) => {
  const s = size / 100;
  const sole = `M${-14 * s} ${-46 * s} Q0 ${-54 * s} ${14 * s} ${-46 * s} L${18 * s} ${-6 * s} Q${16 * s} ${4 * s} ${12 * s} ${10 * s} L${13 * s} ${42 * s} Q0 ${52 * s} ${-13 * s} ${42 * s} L${-12 * s} ${10 * s} Q${-16 * s} ${4 * s} ${-18 * s} ${-6 * s} Z`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      {/* the pressed hollow: shadow on the lit side's rim, light on the far rim */}
      <path d={sole} fill={fill} stroke={ink} strokeWidth={2.4 * s} strokeLinejoin="round" />
      <path d={sole} fill="none" stroke={alpha("#000000", 0.35)} strokeWidth={6 * s} transform={`translate(${2 * s} ${2 * s})`} clipPath="none" opacity={0.5} />
      {Array.from({ length: 9 }, (_, i) => {
        const ty = -40 + i * 9.5;
        const hw = ty < 0 ? 13 : 10.5;
        return <rect key={i} x={-hw * s} y={ty * s} width={2 * hw * s} height={3.6 * s} rx={1 * s} fill={alpha(ink, 0.55)} />;
      })}
    </g>
  );
};

export const BandIcon: React.FC<IconP & { glow?: string }> = ({ x, y, size = 100, ink = "#2A1A10", glow = C.amber }) => {
  const s = size / 100;
  const layers = ["#B07A48", "#8F5A34", "#C99A62", "#7A4A2A", "#A86E40"];
  const w = 120 * s;
  const h = size;
  return (
    <g>
      {layers.map((c, i) => (
        <rect key={i} x={x - w / 2} y={y - h / 2 + (i * h) / layers.length} width={w} height={h / layers.length} fill={c} />
      ))}
      <rect x={x - w / 2} y={y - h / 2 + h * 0.18} width={w} height={6 * s} fill={glow} />
      <rect x={x - w / 2} y={y - h / 2 + h * 0.18 - 4 * s} width={w} height={14 * s} fill={glow} opacity={0.3} />
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} fill="none" stroke={ink} strokeWidth={2.4 * s} />
    </g>
  );
};

export const BottleIcon: React.FC<IconP> = ({ x, y, size = 100, ink = C.ink, fill = "#7FC8D8" }) => {
  const s = size / 100;
  const d = `M${x - 7 * s} ${y - 50 * s} H${x + 7 * s} V${y - 34 * s} Q${x + 22 * s} ${y - 24 * s} ${x + 22 * s} ${y - 6 * s} V${y + 44 * s} Q${x + 22 * s} ${y + 50 * s} ${x + 16 * s} ${y + 50 * s} H${x - 16 * s} Q${x - 22 * s} ${y + 50 * s} ${x - 22 * s} ${y + 44 * s} V${y - 6 * s} Q${x - 22 * s} ${y - 24 * s} ${x - 7 * s} ${y - 34 * s} Z`;
  return (
    <g>
      <path d={d} fill={fill} stroke={ink} strokeWidth={2.4 * s} strokeLinejoin="round" />
      <rect x={x - 22 * s} y={y + 2 * s} width={44 * s} height={18 * s} fill={alpha("#FFFFFF", 0.55)} />
      <path d={`M${x - 14 * s} ${y - 12 * s} V${y + 38 * s}`} stroke="#FFFFFF" strokeWidth={4 * s} opacity={0.5} strokeLinecap="round" />
      <rect x={x - 9 * s} y={y - 56 * s} width={18 * s} height={8 * s} rx={2 * s} fill={C.lever} stroke={ink} strokeWidth={2 * s} />
    </g>
  );
};

export const GearIcon: React.FC<IconP & { f?: number; speed?: number; teeth?: number }> = ({ x, y, size = 80, f = 0, speed = 3, teeth = 9, ink = C.ink, fill = C.saffron }) => {
  const R = size / 2;
  const pts: string[] = [];
  for (let i = 0; i < teeth * 4; i++) {
    const a = (i / (teeth * 4)) * Math.PI * 2;
    const r = i % 4 < 2 ? R : R * 0.78;
    pts.push(`${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`);
  }
  return (
    <g transform={`translate(${x} ${y}) rotate(${(f * speed) % 360})`}>
      <path d={"M" + pts.join(" L") + " Z"} fill={fill} stroke={ink} strokeWidth={Math.max(1.5, size * 0.03)} strokeLinejoin="round" />
      <circle r={R * 0.32} fill={alpha(ink, 0.85)} />
      <circle r={R * 0.14} fill={fill} />
    </g>
  );
};

export const LampIcon: React.FC<IconP & { lit?: number }> = ({ x, y, size = 120, lit = 1, ink = "#0B2530" }) => {
  const s = size / 100;
  return (
    <g>
      {lit > 0 ? <Bloom x={x + 18 * s} y={y - 40 * s} r={60 * s} color={C.amber} strength={0.8 * lit} /> : null}
      <rect x={x - 3 * s} y={y - 44 * s} width={6 * s} height={94 * s} fill={ink} />
      <path d={`M${x} ${y - 42 * s} Q${x + 10 * s} ${y - 52 * s} ${x + 22 * s} ${y - 46 * s}`} fill="none" stroke={ink} strokeWidth={4 * s} strokeLinecap="round" />
      <rect x={x + 12 * s} y={y - 46 * s} width={18 * s} height={8 * s} rx={3 * s} fill={lit > 0 ? "#FFE6A8" : "#33505A"} />
    </g>
  );
};

export const PumpIcon: React.FC<IconP & { f?: number; speed?: number; running?: boolean }> = ({ x, y, size = 120, f = 0, speed = 25, running = true, ink = "#0C0405", fill = "#5A6E72" }) => {
  const s = size / 100;
  const rot = running ? f * speed : 0;
  return (
    <g>
      <rect x={x - 40 * s} y={y + 20 * s} width={80 * s} height={24 * s} rx={4 * s} fill={alpha(ink, 0.5)} />
      <circle cx={x} cy={y} r={34 * s} fill={fill} stroke={ink} strokeWidth={3 * s} />
      <g transform={`translate(${x} ${y}) rotate(${rot % 360})`}>
        {[0, 72, 144, 216, 288].map((a) => (
          <path key={a} d={`M0 0 Q${10 * s} ${-12 * s} ${4 * s} ${-28 * s}`} fill="none" stroke={C.saffron} strokeWidth={5 * s} strokeLinecap="round" transform={`rotate(${a})`} />
        ))}
        <circle r={6 * s} fill={C.saffronCore} />
      </g>
      <rect x={x + 30 * s} y={y - 44 * s} width={14 * s} height={36 * s} fill={fill} stroke={ink} strokeWidth={2.5 * s} />
      <circle cx={x - 26 * s} cy={y - 30 * s} r={5 * s} fill={running ? "#FFCF73" : "#3A2A20"} />
      {running ? <circle cx={x - 26 * s} cy={y - 30 * s} r={12 * s} fill="#FFCF73" opacity={0.35} /> : null}
    </g>
  );
};
