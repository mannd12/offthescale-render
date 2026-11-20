import React from "react";
import { Bloom, Sky, Tick } from "../../lib/illustrated";
import { buildTimeline, VoLine } from "../../lib/timeline";
import { EndShot, Chips, Rain, W, H, Shot, makeShort } from "../S41-dig-plate/vkit";
import { Qmark } from "../S46-peak-seafloor/kit46";
import { Bracket } from "../L15-space-jump/props";
import { Probe } from "../L16-into-the-sun/props16";
import { BG_DEEP, Dial, Count, C, HBar, Plaque, ez, mix } from "../S61-record-peak/kit61";
import { BG_EMBER, OurSum, SunScene, UpBar } from "../S66-probe-stays-cool/kit66";
import vo from "./vo.json";

/**
 * S67 - 55 times more energy than Mars (episodes/S67-fifty-five-times). For L16, answered at 0:51.
 * Numbers (sources.md, L16 rows 1, 3, 5, 6, 7): NASA's "55 times more energy" than Mars; Earth-Sun distance 149.6 million km;
 * a fall from rest takes about 65 days and arrives at about 616 km/s (OUR SUM, rows 4-5, chip on screen); launch Aug 2018,
 * closest pass Dec 2024 (over six years). Withheld: why (Earth's 29.8 km/s sideways speed must be shed; L16 0:51).
 */
export const timeline = buildTimeline(vo as VoLine[]);

const Space: React.FC<{ f: number; top?: number }> = ({ f, top = 1250 }) => (
  <g>
    <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
    <Chips f={f} n={10} y0={120} y1={1100} color={C.foam} speed={4} opacity={0.22} seed={6} len={46} width={6} />
    <SunLimbOnly f={f} top={top} />
  </g>
);
const SunLimbOnly: React.FC<{ f: number; top: number }> = ({ f, top }) => <SunScene f={f} top={top} glints={false} />;

/** A drawn rock: faceted, saturated brick with a lit edge. */
const Rock: React.FC<{ x: number; y: number; r?: number; spin?: number }> = ({ x, y, r = 70, spin = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${spin})`}>
    <path d={`M${-r} ${r * 0.1} L${-r * 0.5} ${-r * 0.8} L${r * 0.4} ${-r * 0.9} L${r} ${-r * 0.1} L${r * 0.6} ${r * 0.8} L${-r * 0.4} ${r * 0.85} Z`} fill={C.orange} stroke={C.ink} strokeWidth={9} strokeLinejoin="round" />
    <path d={`M${-r * 0.5} ${-r * 0.8} L${r * 0.4} ${-r * 0.9} L${r * 0.1} ${-r * 0.1} L${-r * 0.7} ${-r * 0.1} Z`} fill={C.gold} opacity={0.75} />
    <path d={`M${r} ${-r * 0.1} L${r * 0.6} ${r * 0.8} L${-r * 0.1} ${r * 0.3} Z`} fill={C.rust} opacity={0.8} />
  </g>
);

/** a - 55 times more energy than Mars. */
const a1: Shot = ({ f, n }) => (
  <g>
    <Space f={f} top={1500} />
    <UpBar x={260} base={1150} w={190} h={mix(0, 60, ez(f, 0, 6))} color={C.teal} />
    <UpBar x={700} base={1150} w={300} h={mix(0, 860, ez(f, 4, Math.round(n * 0.6)))} color={C.amber} />
    <Plaque x={260} y={1230} text="MARS" size={50} bg={C.ink} fg={C.cream} />
    <Plaque x={700} y={1230} text="THE SUN" size={50} bg={C.ink} fg={C.cream} />
    <Count x={540} y={190} f={f} b={55} f1={Math.round(n * 0.4)} unit="×" w={420} size={150} />
  </g>
);
const a2: Shot = ({ f, n }) => {
  const k = Math.floor(55 * ez(f, 2, Math.round(n * 0.4)));
  return (
    <g>
      <Space f={f} top={1500} />
      <rect x={250} y={500} width={80} height={80} rx={14} fill={C.teal} stroke={C.ink} strokeWidth={6} />
      <Plaque x={540} y={540} text="= MARS" size={56} bg={C.ink} fg={C.cream} />
      {Array.from({ length: 55 }, (_, i) => (
        <rect key={i} x={78 + (i % 11) * 84} y={720 + Math.floor(i / 11) * 84} width={78} height={78} rx={14} fill={i < k ? C.amber : C.ink} opacity={i < k ? 1 : 0.35} stroke={C.ink} strokeWidth={5} />
      ))}
      <Plaque x={540} y={190} text="55 TIMES THE ENERGY" size={64} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** b - everything falls around the Sun. */
const Orrery: React.FC<{ f: number; cy?: number; rate?: number; scale?: number }> = ({ f, cy = 780, rate = 1, scale = 1 }) => {
  const rings = [210, 340, 470];
  const cols = [C.sky, C.green, C.apricot];
  return (
    <g>
      {rings.map((r, i) => (
        <ellipse key={i} cx={540} cy={cy} rx={r * scale} ry={r * scale * 0.62} fill="none" stroke={C.cream} strokeWidth={5} strokeDasharray="4 16" strokeLinecap="round" opacity={0.7} />
      ))}
      {rings.map((r, i) => {
        const a = f * rate * (0.1 - i * 0.025) + i * 2.1;
        return <circle key={i} cx={540 + Math.cos(a) * r * scale} cy={cy + Math.sin(a) * r * scale * 0.62} r={30 - i * 4} fill={cols[i]} stroke={C.ink} strokeWidth={6} />;
      })}
      <Bloom x={540} y={cy} r={260} color="#FFC83D" strength={0.8} />
      <circle cx={540} cy={cy} r={104} fill="#FFC83D" stroke="#F58A1F" strokeWidth={18} />
    </g>
  );
};
const b1: Shot = ({ f }) => (
  <g>
    <Space f={f} top={1900} />
    <Orrery f={f} />
    <Plaque x={540} y={190} text="BACKWARDS?" size={120} bg={C.ink} fg={C.amber} />
  </g>
);
const b2: Shot = ({ f }) => (
  <g>
    <Space f={f} top={1900} />
    <Orrery f={f} rate={1.6} scale={1.0} cy={760} />
    <Tick x={190} y={1170} pxPerM={250} frame={f} pose="point" expression="happy" facing={1} />
    <Plaque x={540} y={190} text="ALL FALLING AROUND" size={62} bg={C.ink} fg={C.cream} />
    <Plaque x={540} y={310} text="THE SUN" size={90} bg={C.ink} fg={C.amber} />
  </g>
);

/** c - hold a rock still 149.6 million km out and let go. */
const c1: Shot = ({ f, n }) => (
  <g>
    <Space f={f} top={1250} />
    <Rock x={300} y={420} r={80} spin={Math.sin(f / 18) * 4} />
    <Bracket x1={820} y1={420} x2={820} y2={1230} draw={ez(f, 0, Math.round(n * 0.5))} color={C.amber} />
    <Count x={540} y={190} f={f} b={149.6} d={1} f1={Math.round(n * 0.4)} unit=" MILLION KM" w={900} size={84} />
  </g>
);
const c2: Shot = ({ f, n }) => (
  <g>
    <Space f={f} top={1250} />
    <Rock x={540} y={mix(480, 700, ez(f, Math.round(n * 0.4), n))} r={100} />
    <Plaque x={540} y={190} text="LET GO FROM REST" size={72} bg={C.ink} fg={C.amber} />
  </g>
);

/** d - about 65 days (our sum). */
const d1: Shot = ({ f, n }) => (
  <g>
    <Space f={f} top={1250} />
    <line x1={540} y1={460} x2={540} y2={1220} stroke={C.cream} strokeWidth={8} strokeDasharray="4 20" strokeLinecap="round" opacity={0.6} />
    <Rock x={540} y={mix(480, 1100, ez(f, 0, n))} r={90} spin={f * 3} />
    <OurSum />
    <Count x={540} y={290} f={f} b={65} f1={Math.round(n * 0.4)} unit=" DAYS" w={560} size={120} />
    <Plaque x={540} y={440} text="ABOUT" size={48} bg={C.ink} fg={C.cream} />
  </g>
);
const d2: Shot = ({ f, n }) => (
  <g>
    <Space f={f} top={1180} />
    <Bloom x={540} y={1160} r={mix(100, 420, ez(f, 4, n))} color="#FFF3C4" strength={0.9} />
    <Rock x={540} y={mix(900, 1130, ez(f, 0, 8))} r={90} />
    <OurSum />
    <Plaque x={540} y={290} text="FALLS STRAIGHT IN" size={72} bg={C.ink} fg={C.amber} />
  </g>
);

/** e - about 616 km/s (our sum). */
const e1: Shot = ({ f, n }) => (
  <g>
    <Space f={f} top={1500} />
    <Dial x={540} y={800} r={310} v={ez(f, 0, Math.round(n * 0.4))} f={f} shake={ez(f, Math.round(n * 0.4), n) * 0.02} />
    <OurSum />
    <Count x={540} y={290} f={f} b={616} f1={Math.round(n * 0.4)} unit=" KM/S" w={700} size={110} />
  </g>
);
const e2: Shot = ({ f }) => (
  <g>
    <Space f={f} top={1250} />
    <Rain f={f} n={14} x0={200} x1={880} color={C.gold} speed={40} len={380} width={12} opacity={0.7} seed={8} />
    <Rock x={540} y={760} r={110} spin={f * 5} />
    <OurSum />
    <Plaque x={540} y={290} text="616 KM EVERY SECOND" size={56} bg={C.ink} fg={C.amber} />
  </g>
);

/** f - the real trip: August 2018 to December 2024, over six years. */
const Spiral: React.FC<{ k: number; f: number }> = ({ k, f }) => {
  const pts: [number, number][] = [];
  for (let i = 0; i <= 120; i++) {
    const t = i / 120;
    const a = t * Math.PI * 6;
    const r = 460 - 380 * t;
    pts.push([540 + Math.cos(a) * r, 760 + Math.sin(a) * r * 0.62]);
  }
  const m = Math.max(1, Math.round(120 * k));
  const d = "M" + pts.slice(0, m + 1).map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L");
  const head = pts[Math.min(m, 120)];
  return (
    <g>
      <path d={d} fill="none" stroke={C.amber} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 22" />
      <Probe x={head[0]} y={head[1]} size={200} f={f} tilt={-90 + k * 360} lamp={false} />
    </g>
  );
};
const f1: Shot = ({ f, n }) => (
  <g>
    <Space f={f} top={1250} />
    <Plaque x={540} y={300} text="LAUNCH: AUG 2018" size={62} bg={C.ink} fg={C.cream} />
    <Plaque x={540} y={1030} text="CLOSEST PASS: DEC 2024" size={54} bg={C.ink} fg={C.amber} />
    <line x1={540} y1={420} x2={540} y2={940} stroke={C.cream} strokeWidth={8} strokeDasharray="4 20" strokeLinecap="round" opacity={0.6} />
    <Probe x={540} y={mix(480, 880, ez(f, 0, n))} size={300} f={f} tilt={-90} lamp={false} />
  </g>
);
const f2: Shot = ({ f, n }) => (
  <g>
    <Space f={f} top={1500} />
    <Plaque x={540} y={440} text="STRAIGHT DROP: ABOUT 65 DAYS" size={44} bg={C.ink} fg={C.cream} />
    <HBar x={100} y={540} w={880} k={0.02} color={C.gold} />
    <Plaque x={540} y={760} text="THE REAL TRIP: OVER 6 YEARS" size={44} bg={C.ink} fg={C.amber} />
    <HBar x={100} y={860} w={880} k={ez(f, 4, Math.round(n * 0.5))} color={C.amber} />
    <OurSum />
    <Plaque x={540} y={290} text="DAYS VS YEARS" size={80} bg={C.ink} fg={C.amber} />
  </g>
);
const f3: Shot = ({ f, n }) => (
  <g>
    <Space f={f} top={1500} />
    <circle cx={540} cy={760} r={86} fill="#FFC83D" stroke="#F58A1F" strokeWidth={16} />
    <Spiral k={ez(f, 0, n - 4)} f={f} />
    <Plaque x={540} y={190} text="NOT 65 DAYS" size={96} bg={C.ink} fg={C.amber} />
  </g>
);

const q: Shot = ({ f }) => (
  <g>
    <Space f={f} top={1350} />
    <Probe x={300} y={720} size={300} f={f} tilt={-90} lamp={false} />
    <Qmark f={f} x={700} y={1020} size={520} />
    <Plaque x={540} y={190} text="SO HARD TO REACH?" size={64} bg={C.ink} fg={C.amber} />
  </g>
);
const end: Shot = ({ f }) => (
  <EndShot f={f} stops={BG_EMBER} q={["WHY IS THE SUN", "SO HARD TO REACH?"]}>
    <Probe x={880} y={1230} size={240} f={f} tilt={-90} lamp={false} />
  </EndShot>
);

export const ShortS67 = makeShort(timeline, [[a1, a2], [b1, b2], [c1, c2], [d1, d2], [e1, e2], [f1, f2, f3], [q, end]]);
