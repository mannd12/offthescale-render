import React, { useId } from "react";
import { Bloom, CloudRack, CycClouds, Counter, STUDIO_SET, Sky, Tick, rnd } from "../../lib/illustrated";
import { buildTimeline, VoLine } from "../../lib/timeline";
import { C, Chips, Derrick, EndShot, Plaque, Strata, T, W, H, Shot, ez, makeShort, mix, ramp } from "../S41-dig-plate/vkit";
import vo from "./vo.json";

/**
 * S42 - two minutes in an hour (episodes/S42-dig-minutes). For L11, answered at 1:06. Vertical 1080x1920, kit v2.
 * 14 shots. Numbers (sources.md): #11 21.7 % at 0-2 km, 3.1 % at 10-11.5 km (3.1 % of an hour = 1.9 min); #13 ~1,000 m in
 * 6 years = 0.46 m/day; #3 23 cm hole = 2 hole-widths per day; #2 "world's deepest hole". The bit wear / round trip answer
 * (#12) is withheld.
 */
export const timeline = buildTimeline(vo as VoLine[]);

const TAU = Math.PI * 2;
const FONT = "'Outfit', sans-serif";
const BANDS: [number, string][] = [
  [170, "#1E8A88"],
  [120, "#E3813F"],
  [200, "#146A6C"],
  [140, "#B04A18"],
  [160, "#2FBFA8"],
  [110, "#7A3418"],
];
const SLIVER = 0.031;

const wedge = (cx: number, cy: number, r: number, f0: number, f1: number) => {
  const a0 = -Math.PI / 2 + f0 * TAU;
  const a1 = -Math.PI / 2 + f1 * TAU;
  const large = f1 - f0 > 0.5 ? 1 : 0;
  return `M${cx} ${cy} L${cx + r * Math.cos(a0)} ${cy + r * Math.sin(a0)} A${r} ${r} 0 ${large} 1 ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)} Z`;
};

/** An hour as a clock: slate hatched face, amber wedge for the cutting share, a hand at `hand` (0..1 of the hour). */
const Clock: React.FC<{ cx: number; cy: number; r: number; hand: number; share: number; f?: number; pulseRest?: boolean }> = ({ cx, cy, r, hand, share, f = 0, pulseRest = false }) => {
  const id = "hat" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const a = -Math.PI / 2 + hand * TAU;
  const lit = hand <= share ? 1 : 0;
  return (
    <g>
      <defs>
        <pattern id={id} width={26} height={26} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width={26} height={26} fill="#0E4658" />
          <rect width={10} height={26} fill="#146A6C" />
        </pattern>
      </defs>
      <circle cx={cx} cy={cy} r={r + 26} fill={C.cream} />
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id})`} />
      {pulseRest ? <circle cx={cx} cy={cy} r={r} fill={C.gold} opacity={0.2 + 0.2 * Math.sin(f / 4)} /> : null}
      <path d={wedge(cx, cy, r, 0, share)} fill={C.amber} />
      {Array.from({ length: 12 }, (_, i) => {
        const t = -Math.PI / 2 + (i / 12) * TAU;
        return <line key={i} x1={cx + (r - 8) * Math.cos(t)} y1={cy + (r - 8) * Math.sin(t)} x2={cx + (r - 40) * Math.cos(t)} y2={cy + (r - 40) * Math.sin(t)} stroke={C.cream} strokeWidth={10} strokeLinecap="round" />;
      })}
      <line x1={cx} y1={cy} x2={cx + (r - 6) * Math.cos(a)} y2={cy + (r - 6) * Math.sin(a)} stroke={lit ? C.ink : C.cream} strokeWidth={18} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={22} fill={C.cream} />
    </g>
  );
};

const Rays: React.FC<{ f: number; cx: number; cy: number; color: string; opacity?: number; speed?: number; n?: number }> = ({ f, cx, cy, color, opacity = 0.3, speed = 1.2, n = 12 }) => (
  <g transform={`translate(${cx} ${cy}) rotate(${f * speed})`} opacity={opacity}>
    {Array.from({ length: n }, (_, i) => {
      const a = (i * TAU) / n;
      const w = 0.12 * (12 / n);
      return <path key={i} d={`M0 0 L${900 * Math.cos(a - w)} ${900 * Math.sin(a - w)} L${900 * Math.cos(a + w)} ${900 * Math.sin(a + w)} Z`} fill={color} />;
    })}
  </g>
);

const Cyc: React.FC<{ f: number; stops?: string[] }> = ({ f, stops }) => (
  <g>
    <Sky stops={stops ?? STUDIO_SET.sky} x={0} y={0} w={W} h={H} />
    <CycClouds f={f} y={120} n={4} seed={3} />
  </g>
);

/** a - the hour sweeps by; Tick shoves the hand. */
const a: Shot = ({ f, n }) => {
  const hand = ez(f, 0, n - 2);
  return (
    <g>
      <Cyc f={f} />
      <Rays f={f} cx={540} cy={620} color={C.gold} opacity={0.28} />
      <Clock cx={500} cy={640} r={360} hand={hand} share={SLIVER} />
      <Plaque x={540} y={200} text="ONE HOUR" size={78} bg={C.ink} fg={C.cream} />
      <Tick x={880} y={1190} pxPerM={360} frame={f} pose="press" expression="determined" facing={-1} />
    </g>
  );
};

/** b - the bit at work: spinning cones, chips, rock rushing past. */
const b: Shot = ({ f }) => {
  const shake = Math.sin(f * 2.3) * 4;
  return (
    <g>
      <Sky stops={["#146A6C", "#1FA69A"]} x={0} y={0} w={W} h={H} />
      <Strata f={f} speed={7} bands={BANDS} amp={22} seed={4} />
      <rect x={330} y={0} width={420} height={900} fill={C.ink} />
      <rect x={330} y={0} width={420} height={900} fill={C.deep} opacity={0.6} />
      <g transform={`translate(${540 + shake} 880)`}>
        <rect x={-60} y={-420} width={120} height={330} fill={C.cream} opacity={0.85} />
        <g transform={`rotate(${f * 14})`}>
          <circle r={160} fill={C.orange} />
          <circle r={160} fill="none" stroke={C.amber} strokeWidth={14} />
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`rotate(${i * 120}) translate(0 -88)`}>
              <circle r={62} fill={C.gold} stroke={C.ink} strokeWidth={8} />
              <circle r={16} fill={C.ink} />
            </g>
          ))}
        </g>
      </g>
      {Array.from({ length: 16 }, (_, i) => {
        const age = (f * 1.6 + i * 7) % 32;
        const dirA = -Math.PI * (0.1 + rnd(i) * 0.8);
        const px = 540 + Math.cos(dirA) * age * 11;
        const py = 880 + Math.sin(dirA) * age * 9;
        return <rect key={i} x={px} y={py} width={22} height={22} rx={5} fill={i % 2 ? C.amber : C.cream} opacity={1 - age / 32} transform={`rotate(${age * 20} ${px} ${py})`} />;
      })}
      <Plaque x={540} y={230} text="UNDER 2 MIN" size={108} bg={C.ink} fg={C.amber} />
      <T x={540} y={360} text="OF CUTTING AN HOUR" size={56} />
    </g>
  );
};

/** c - the sliver, enlarged: 3.1 % of an hour is 1.9 minutes. */
const c: Shot = ({ f }) => {
  const hand = (f / 38) % 1;
  const zoom = 1 + 0.08 * Math.sin(f / 5);
  const ang = -Math.PI / 2 + 0.0155 * TAU;
  return (
    <g>
      <Cyc f={f} stops={["#0A3C4C", "#11707A", "#1FA69A"]} />
      <Rays f={f} cx={540} cy={640} color={C.teal} opacity={0.35} speed={-1.6} n={16} />
      <Clock cx={540} cy={640} r={400} hand={hand} share={SLIVER} />
      <g transform={`translate(${540 + 480 * Math.cos(ang)} ${640 + 480 * Math.sin(ang)}) scale(${zoom})`}>
        <Plaque x={170 - 150} y={-60} text="1.9 MIN" size={86} bg={C.ink} fg={C.amber} />
      </g>
      <T x={540} y={1160} text="THE REST: SLATE" size={64} color={C.mint} opacity={ez(f, 10, 20)} />
    </g>
  );
};

/** d - below 10 km: the strip rushes up, the counter climbs 10,000 -> 11,500 m. */
const d: Shot = ({ f, n }) => {
  const v = mix(10000, 11500, ez(f, 0, n - 3));
  return (
    <g>
      <Sky stops={["#4A140C", "#7A3418", "#B04A18"]} x={0} y={0} w={W} h={H} />
      <Strata f={f} speed={17} bands={[[150, "#B04A18"], [110, "#7A3418"], [180, "#E3813F"], [120, "#4A140C"], [140, "#F6B45A"]]} amp={20} seed={2} />
      <rect x={250} y={0} width={580} height={H} fill={C.ink} opacity={0.35} />
      <rect x={521} y={0} width={38} height={H} fill={C.ink} />
      <rect x={140} y={800} width={800} height={150} rx={20} fill={C.amber} opacity={0.22} />
      <Plaque x={540} y={260} text="BELOW 10 KM" size={96} bg={C.ink} fg={C.cream} />
      <rect x={110} y={420} width={860} height={220} rx={40} fill={C.ink} opacity={0.92} />
      <Counter x={470} y={570} value={v} max={11500} size={124} color={C.amber} align="middle" />
      <text x={750} y={570} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64, fill: C.cream }}>
        m
      </text>
      <Chips f={f} n={10} y0={700} y1={1200} color={C.gold} speed={7} opacity={0.4} seed={6} len={100} width={9} />
    </g>
  );
};

/** e - 3.1 %: a ring gauge on a turning sunburst. */
const e: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 6);
  const R = 300;
  const cx = 540;
  const cy = 680;
  const aa = -Math.PI / 2 + k * SLIVER * TAU;
  return (
    <g>
      <Sky stops={["#B04A18", "#E3813F", "#F6B45A"]} x={0} y={0} w={W} h={H} />
      <Rays f={f} cx={cx} cy={cy} color={C.gold} opacity={0.4} speed={1.8} n={14} />
      <circle cx={cx} cy={cy} r={R + 40} fill={C.ink} />
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="#0E4658" strokeWidth={80} />
      <path d={`M${cx} ${cy - R} A${R} ${R} 0 0 1 ${cx + R * Math.cos(aa)} ${cy + R * Math.sin(aa)}`} stroke={C.amber} strokeWidth={88} fill="none" strokeLinecap="round" />
      <circle cx={cx + R * Math.cos(aa)} cy={cy + R * Math.sin(aa)} r={52 + 10 * Math.sin(f / 3)} fill={C.cream} opacity={0.7} />
      <text x={cx} y={cy + 70} textAnchor="middle" style={{ fontFamily: FONT, fontWeight: 800, fontSize: 200, fill: C.amber }}>
        {(3.1 * k).toFixed(1)}%
      </text>
      <T x={cx} y={1130} text="OF THE TIME" size={80} />
    </g>
  );
};

/** f - near the top: a fifth. Strata scroll DOWN (rising out of the hole). */
const f_: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 6);
  return (
    <g>
      <Sky stops={["#1E6678", "#4FB5DE", "#9BD6E8"]} x={0} y={0} w={W} h={H} />
      <Strata f={f} speed={-10} bands={BANDS} amp={24} seed={8} y0={560} />
      <CloudRack f={f} n={3} x0={-400} x1={1500} y0={120} y1={520} size={110} speed={3} body={C.cream} under={C.ice} top="#FFFFFF" seed={4} />
      <circle cx={540} cy={820} r={330} fill={C.ink} />
      <path d={wedge(540, 820, 300, 0, 0.217 * k)} fill={C.amber} />
      <path d={wedge(540, 820, 300, 0.217 * k, 1)} fill="#0E4658" />
      <circle cx={540} cy={820} r={300} fill="none" stroke={C.cream} strokeWidth={8} />
      <text x={540} y={880} textAnchor="middle" style={{ fontFamily: FONT, fontWeight: 800, fontSize: 150, fill: C.cream, stroke: C.ink, strokeWidth: 16, paintOrder: "stroke" }}>
        {(21.7 * k).toFixed(1)}%
      </text>
      <Plaque x={540} y={240} text="NEAR THE TOP" size={86} bg={C.ink} fg={C.cream} />
      <T x={540} y={1250} text="0-2 KM" size={74} color={C.amber} opacity={ez(f, 8, 16)} />
    </g>
  );
};

/** g - six years of calendar pages flipping. */
const g: Shot = ({ f, n }) => {
  const per = 9;
  const ph = (f % per) / per;
  const flip = Math.cos(ph * Math.PI);
  const yrs = 6 * ez(f, 0, n - 3);
  const cols = [C.cream, C.ice, C.foam];
  const idx = Math.floor(f / per);
  return (
    <g>
      <Sky stops={["#0A3C4C", "#11707A", "#1FA69A"]} x={0} y={0} w={W} h={H} />
      <Chips f={f} n={12} y0={150} y1={1200} color={C.mint} speed={12} opacity={0.45} seed={3} />
      <g transform="translate(540 660)">
        <rect x={-330} y={-330} width={660} height={650} rx={50} fill={C.ink} />
        <rect x={-300} y={-300} width={600} height={590} rx={30} fill={cols[(idx + 1) % 3]} />
        <rect x={-260} y={-240} width={520} height={90} rx={20} fill={C.teal} opacity={0.6} />
        {Array.from({ length: 12 }, (_, i) => (
          <circle key={i} cx={-215 + (i % 4) * 143} cy={-70 + Math.floor(i / 4) * 120} r={36} fill="#B7E0D6" />
        ))}
        <g transform={`translate(0 -300) scale(1 ${flip}) translate(0 300)`}>
          <rect x={-300} y={-300} width={600} height={590} rx={30} fill={cols[idx % 3]} />
          <rect x={-260} y={-240} width={520} height={90} rx={20} fill={C.teal} />
          {Array.from({ length: 12 }, (_, i) => (
            <circle key={i} cx={-215 + (i % 4) * 143} cy={-70 + Math.floor(i / 4) * 120} r={36} fill={i === idx % 12 ? C.amber : "#B7E0D6"} />
          ))}
        </g>
        {[-200, -100, 0, 100, 200].map((x) => (
          <circle key={x} cx={x} cy={-330} r={20} fill={C.amber} />
        ))}
      </g>
      <Plaque x={540} y={190} text="6 YEARS" size={100} bg={C.ink} fg={C.amber} />
      <T x={540} y={1130} text={`YEAR ${Math.min(6, Math.floor(yrs) + 1)} OF 6`} size={66} />
    </g>
  );
};

/** h - one kilometre: the bit creeps down while the sun races. */
const h: Shot = ({ f, n }) => {
  const sunA = (f / 40) * Math.PI;
  const k = ez(f, 0, n);
  return (
    <g>
      <Sky stops={["#1E6678", "#4FB5DE", "#F6B45A"]} x={0} y={0} w={W} h={H} />
      <Bloom x={540 - Math.cos(sunA) * 430} y={520 - Math.sin(sunA) * 360} r={330} color={C.gold} strength={0.95} core={58} coreColor="#FFF1C2" />
      <CloudRack f={f} n={4} x0={-420} x1={1500} y0={180} y1={720} size={110} speed={6} body={C.cream} under={C.ice} top="#FFFFFF" seed={5} />
      <rect x={0} y={720} width={W} height={H - 720} fill="#146A6C" />
      <Strata f={f * 0.5} speed={3} bands={BANDS} y0={720} amp={20} seed={5} />
      <rect x={525} y={720} width={30} height={420 * k + 40} rx={15} fill={C.ink} />
      <Derrick f={f * 2} x={300} y={730} s={1.5} />
      <Plaque x={760} y={400} text="1 KM" size={110} bg={C.ink} fg={C.amber} />
      <T x={760} y={510} text="IN 6 YEARS" size={64} />
      <Tick x={800} y={1180} pxPerM={300} frame={f} pose="sit" expression="sleepy" facing={-1} />
    </g>
  );
};

/** i - one day of drilling at 1:1 hole width: two hole-widths deep. */
const i_: Shot = ({ f, n }) => {
  const k = ez(f, 2, n - 3);
  const hh = 460 * k;
  return (
    <g>
      <Sky stops={["#146A6C", "#1FA69A"]} x={0} y={0} w={W} h={H} />
      <Strata f={f} speed={4} bands={BANDS} amp={22} seed={6} y0={300} />
      <rect x={0} y={0} width={W} height={300} fill="#4FB5DE" />
      <CloudRack f={f} n={3} x0={-400} x1={1500} y0={40} y1={250} size={80} speed={3} body={C.cream} under={C.ice} top="#FFFFFF" seed={2} />
      <rect x={425} y={300} width={230} height={hh} fill={C.ink} />
      <g transform={`translate(540 ${300 + hh})`}>
        <ellipse rx={115} ry={58} fill={C.orange} stroke={C.amber} strokeWidth={10} />
      </g>
      <Chips f={f} n={12} y0={300 + hh - 20} y1={300 + hh + 60} color={C.gold} speed={10} opacity={0.7} seed={8} len={70} width={10} />
      <g opacity={ez(f, 6, 14)}>
        <path d="M425 270 H655" stroke={C.cream} strokeWidth={8} strokeLinecap="round" />
        <Plaque x={540} y={215} text="23 CM" size={50} bg={C.ink} fg={C.cream} />
        <path d="M700 300 V760" stroke={C.amber} strokeWidth={10} strokeLinecap="round" />
        <Plaque x={860} y={530} text="0.46 M" size={70} bg={C.ink} fg={C.amber} />
      </g>
      <Plaque x={540} y={1010} text="UNDER 0.5 M A DAY" size={66} bg={C.ink} fg={C.cream} />
    </g>
  );
};

/** j - two hole-widths: two circles drop in and squash. */
const j: Shot = ({ f }) => {
  const drop = (at: number) => {
    const t = ramp(f, at, at + 10);
    const y = mix(-300, 0, t * t);
    const sq = f >= at + 10 ? 1 + 0.2 * Math.max(0, 1 - (f - at - 10) / 7) : 1;
    return { y, sq, on: f >= at ? 1 : 0 };
  };
  const c1 = drop(2);
  const c2 = drop(14);
  const hueT = (Math.sin(f / 14) + 1) / 2;
  const circle = (cy: number, d: { y: number; sq: number; on: number }, label: string) => (
    <g transform={`translate(540 ${cy + d.y}) scale(${d.sq} ${1 / d.sq})`} opacity={d.on}>
      <circle r={150} fill={C.ink} />
      <circle r={150} fill="none" stroke={C.amber} strokeWidth={14} />
      <text y={36} textAnchor="middle" style={{ fontFamily: FONT, fontWeight: 800, fontSize: 110, fill: C.amber }}>
        {label}
      </text>
    </g>
  );
  return (
    <g>
      <Sky stops={[hueT > 0.5 ? "#E3813F" : "#4FB5DE", "#F6B45A"]} x={0} y={0} w={W} h={H} />
      <Rays f={f} cx={540} cy={700} color={C.cream} opacity={0.28} speed={2.5} />
      {circle(880, c1, "1")}
      {circle(570, c2, "2")}
      <Plaque x={540} y={220} text="2 HOLE-WIDTHS" size={78} bg={C.ink} fg={C.cream} scale={0.8 + 0.2 * ez(f, 14, 24)} />
      <Tick x={190} y={1190} pxPerM={330} frame={f} pose="point" expression="happy" facing={1} />
    </g>
  );
};

/** k - a report page; the phrase gets highlighted. */
const k_: Shot = ({ f }) => {
  const slide = ez(f, 0, 10);
  const hl = ez(f, 12, 30);
  return (
    <g>
      <Sky stops={["#146A6C", "#1FA69A", "#66BEAD"]} x={0} y={0} w={W} h={H} />
      {Array.from({ length: 5 }, (_, i) => {
        const x = ((((i * 330 - f * 6) % 1650) + 1650) % 1650) - 300;
        const yy = 345 + (i % 3) * 330;
        return <rect key={i} x={x} y={yy - 145} width={230} height={290} rx={20} fill={C.cream} opacity={0.25} transform={`rotate(${(i % 2 ? 1 : -1) * 8} ${x + 115} ${yy})`} />;
      })}
      <g transform={`translate(${540 + (1 - slide) * 700} 650) rotate(${(1 - slide) * 12 - 3})`}>
        <rect x={-360} y={-440} width={720} height={880} rx={34} fill={C.cream} />
        <rect x={-300} y={-380} width={400} height={42} rx={14} fill={C.petrol} />
        {Array.from({ length: 6 }, (_, i) => (
          <rect key={i} x={-300} y={-290 + i * 70} width={i === 3 ? 520 : 600 - (i % 2) * 90} height={30} rx={12} fill="#B7E0D6" />
        ))}
        <rect x={-300} y={-298 + 3 * 70} width={520 * hl} height={46} rx={12} fill={C.amber} opacity={0.9} />
      </g>
      <Plaque x={540} y={1090} text="EACH METRE HARDER" size={64} bg={C.ink} fg={C.amber} opacity={ez(f, 14, 24)} />
      <T x={540} y={190} text="A REPORT" size={72} />
    </g>
  );
};

/** l - Tick pushes a boulder up steps, getting more tired on every metre. */
const l: Shot = ({ f, n }) => {
  const u = 4 * ez(f, 0, n - 2);
  const stepI = Math.floor(Math.min(u, 3.999));
  const frac = u - stepI;
  const ty = 1130 - (stepI + ez(frac * 100, 55, 100) + 1) * 90;
  const tx = 150 + u * 175 + 60;
  return (
    <g>
      <Sky stops={["#4A140C", "#B04A18", "#E3813F"]} x={0} y={0} w={W} h={H} />
      <Chips f={f} n={10} y0={150} y1={900} color={C.gold} speed={6} opacity={0.3} seed={4} />
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} x={110 + i * 175} y={1130 - (i + 1) * 90} width={190} height={(i + 1) * 90 + 200} fill={i % 2 ? C.teal : C.petrol} />
      ))}
      <Tick x={tx} y={ty} pxPerM={250} frame={f} pose="press" expression={u > 2 ? "worried" : "determined"} slump={u / 4} facing={1} walk={f / 20} />
      <g transform={`translate(${tx + 160} ${ty - 85}) rotate(${f * 6})`}>
        <circle r={85} fill={C.brick} stroke={C.ink} strokeWidth={8} />
        <path d="M-50 -20 L10 -60 M20 20 L60 -10 M-30 40 L0 10" stroke={C.maroon} strokeWidth={10} strokeLinecap="round" />
      </g>
      <Plaque x={540} y={220} text="HARDER EVERY METRE" size={64} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** m - the rest of the hour: the empty slate pulses, a question mark. */
const m: Shot = ({ f }) => {
  const hand = (f / 30) % 1;
  return (
    <g>
      <Cyc f={f} stops={["#2B0C08", "#6A2210", "#B04A18"]} />
      <Rays f={f} cx={540} cy={640} color={C.orange} opacity={0.35} speed={-1.4} />
      <Clock cx={540} cy={640} r={380} hand={hand} share={SLIVER} pulseRest f={f} />
      <text x={540} y={800} textAnchor="middle" style={{ fontFamily: FONT, fontWeight: 800, fontSize: 480, fill: C.amber, stroke: C.ink, strokeWidth: 26, paintOrder: "stroke" }} opacity={0.95}>
        ?
      </text>
      <Tick x={900} y={1180} pxPerM={300} frame={f} pose="think" expression="thinking" facing={-1} />
    </g>
  );
};

/** n - end card with the sliver of the clock. */
const n_: Shot = ({ f }) => (
  <EndShot f={f} stops={["#2B0C08", "#B04A18", "#E3813F"]} q={["WHERE DID THE", "HOUR GO?"]}>
    <Clock cx={900} cy={170} r={64} hand={(f / 40) % 1} share={SLIVER} />
  </EndShot>
);

export const ShortS42 = makeShort(timeline, [[a, b, c], [d, e], [f_], [g, h], [i_, j], [k_, l], [m], [n_]]);
