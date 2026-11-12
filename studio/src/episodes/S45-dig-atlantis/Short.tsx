import React, { useId } from "react";
import { Bloom, Bobber, Bubbles, Caustics, CloudRack, Counter, Sky, Streamers, Tick, rnd, seaSurface } from "../../lib/illustrated";
import { buildTimeline, VoLine } from "../../lib/timeline";
import { C, Chips, Derrick, EndShot, Glow, Plaque, Strata, T, W, H, Shot, ez, makeShort, mix, ramp } from "../S41-dig-plate/vkit";
import vo from "./vo.json";

/**
 * S45 - rock from the mantle, a kilometre down (episodes/S45-dig-atlantis). For L11, answered at 5:45. Vertical 1080x1920.
 * 18 shots. Numbers (sources.md): #31 2023, 1,268 m, old record 200.8 m (6x; 1,268 / 200.8 = 6.3); #2 Kola 12,262 m
 * (9.7x, "about ten times"); #29 mantle averages ~40 km under continents. Says "rock from the mantle", never "reached the
 * mantle in place" (#32). Fault uplift (#31) and thin ocean crust (#29) are withheld.
 */
export const timeline = buildTimeline(vo as VoLine[]);

const FONT = "'Outfit', sans-serif";
const SEABED: [number, string][] = [
  [150, "#1E8A88"],
  [110, "#3FBF8A"],
  [170, "#146A6C"],
  [120, "#2FBFA8"],
  [140, "#0E4658"],
];
const CRUST: [number, string][] = [
  [170, "#E3813F"],
  [110, "#F6B45A"],
  [180, "#B04A18"],
  [130, "#1FA69A"],
  [120, "#7A3418"],
];

const Ship: React.FC<{ f: number; x: number; y: number; s?: number }> = ({ f, x, y, s = 1 }) => (
  <Bobber frame={f} x={x} y={y} amp={9} roll={2.6} period={70} seed={3}>
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-300 -20 L300 -20 L240 70 L-240 70 Z" fill={C.ink} />
      <path d="M-300 -20 L300 -20 L292 -4 L-292 -4 Z" fill={C.orange} />
      <rect x={-250} y={-100} width={180} height={80} rx={14} fill={C.cream} />
      {[-225, -180, -135, -90].map((wx) => (
        <rect key={wx} x={wx} y={-84} width={28} height={30} rx={6} fill={C.sea} />
      ))}
      <path d="M60 -20 L120 -20 L100 -430 L80 -430 Z" fill={C.deep} />
      <path d="M70 -300 L110 -300 M74 -200 L106 -200 M66 -110 L114 -110" stroke={C.teal} strokeWidth={8} />
      <circle cx={90} cy={-445} r={16 + 4 * Math.sin(f / 4)} fill={C.gold} />
    </g>
  </Bobber>
);

/** a - the drill ship rolls on a sunny sea. */
const a: Shot = ({ f }) => (
  <g>
    <Sky stops={["#1E6678", "#4FB5DE", "#F6B45A"]} x={0} y={0} w={W} h={H} />
    <Bloom x={820} y={560} r={600} color={C.gold} strength={0.85} core={56} coreColor="#FFF1C2" />
    <CloudRack f={f} n={4} x0={-420} x1={1500} y0={140} y1={560} size={104} speed={2.4} body={C.cream} under={C.ice} top="#FFFFFF" seed={6} />
    <path d={seaSurface(f * 2, -40, 1120, 800, 14, 260, 2, 1300, 30)} fill="#2A8FC4" />
    <Ship f={f} x={440} y={830} s={1.25} />
    <path d={seaSurface(f * 2.4 + 40, -40, 1120, 880, 18, 220, 2, 1300, 30)} fill="#1B6FA8" />
    <path d={seaSurface(f * 2.8 + 90, -40, 1120, 980, 22, 300, 2, 1300, 30)} fill="#11707A" />
    <Chips f={f} n={12} y0={850} y1={1150} color={C.foam} speed={10} opacity={0.5} seed={8} dir={-1} />
    <rect x={528} y={880} width={14} height={400} fill={C.cream} opacity={0.85} />
    <Plaque x={540} y={230} text="2023" size={140} bg={C.ink} fg={C.amber} />
  </g>
);

/** b - under the water: the drill string reaches the sea floor; the counter spins. */
const b: Shot = ({ f, n }) => {
  const v = 1268 * ez(f, 2, n - 3);
  return (
    <g>
      <Sky stops={["#2A8FC4", "#1B6FA8", "#0A3C4C"]} x={0} y={0} w={W} h={H} />
      <Caustics f={f} x={0} y={0} w={W} h={760} rows={7} color={C.foam} width={9} opacity={0.3} speed={3} />
      <Bubbles frame={f} x0={120} x1={960} y={880} n={26} color={C.foam} seed={4} rise={3} size={9} />
      <rect x={0} y={880} width={W} height={H - 880} fill="#146A6C" />
      <Strata f={f} speed={6} bands={SEABED} y0={880} amp={22} seed={2} />
      <rect x={522} y={0} width={36} height={880 + 400 * ez(f, 0, n)} fill={C.ink} />
      <rect x={532} y={0} width={6} height={880 + 400 * ez(f, 0, n)} fill={C.cream} opacity={0.7} />
      <rect x={110} y={250} width={860} height={230} rx={44} fill={C.ink} opacity={0.92} />
      <Counter x={430} y={410} value={v} max={1268} size={130} color={C.amber} align="middle" />
      <text x={800} y={410} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64, fill: C.cream }}>
        m
      </text>
      <T x={540} y={640} text="SEA FLOOR" size={56} color={C.cream} opacity={0.9} />
    </g>
  );
};

/** c - Tick holds up a green core of mantle rock. */
const c: Shot = ({ f }) => (
  <g>
    <Sky stops={["#0A3C4C", "#11707A", "#1FA69A"]} x={0} y={0} w={W} h={H} />
    <g transform={`translate(540 650) rotate(${f * 0.9})`} opacity={0.35}>
      {Array.from({ length: 14 }, (_, i) => (
        <path key={i} d={`M0 0 L${900 * Math.cos((i * 2 * Math.PI) / 14 - 0.1)} ${900 * Math.sin((i * 2 * Math.PI) / 14 - 0.1)} L${900 * Math.cos((i * 2 * Math.PI) / 14 + 0.1)} ${900 * Math.sin((i * 2 * Math.PI) / 14 + 0.1)} Z`} fill={C.mint} />
      ))}
    </g>
    <Chips f={f} n={10} y0={150} y1={1100} color={C.foam} speed={8} opacity={0.4} seed={12} />
    <Tick x={360} y={1230} pxPerM={520} frame={f} pose="cheer" expression="proud" facing={1} />
    <g transform={`translate(${360 + 150} ${360 + 10 * Math.sin(f / 7)}) rotate(${Math.sin(f / 9) * 6})`}>
      <rect x={-70} y={-170} width={140} height={340} rx={64} fill={C.green} stroke={C.ink} strokeWidth={10} />
      <path d="M-60 -80 L40 -40 M-50 20 L60 70 M-40 100 L30 120" stroke={C.deep} strokeWidth={10} strokeLinecap="round" />
    </g>
    <Plaque x={640} y={1010} text="ROCK FROM THE MANTLE" size={52} bg={C.ink} fg={C.amber} />
  </g>
);

const BAR_X = 360;
const BAR_TOP = 360;
const PXKM = 500;

/** d - the depth counter and the bar that grows beside the gauge. */
const d: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 3);
  return (
    <g>
      <Sky stops={["#146A6C", "#1FA69A"]} x={0} y={0} w={W} h={H} />
      <Strata f={f} speed={3} bands={SEABED} amp={22} seed={5} y0={BAR_TOP} />
      <rect x={0} y={0} width={W} height={BAR_TOP} fill="#2A8FC4" />
      <CloudRack f={f} n={2} x0={-400} x1={1500} y0={60} y1={BAR_TOP - 40} size={70} speed={3} body={C.cream} under={C.ice} top="#FFFFFF" seed={2} />
      <rect x={BAR_X - 50} y={BAR_TOP} width={100} height={1.268 * PXKM * k} rx={30} fill={C.ink} />
      <rect x={BAR_X - 32} y={BAR_TOP} width={64} height={1.268 * PXKM * k} rx={20} fill={C.amber} />
      <Glow x={BAR_X} y={BAR_TOP + 1.268 * PXKM * k} r={150} color={C.gold} f={f} strength={0.8} period={14} />
      <rect x={520} y={420} width={470} height={190} rx={38} fill={C.ink} opacity={0.93} />
      <Counter x={700} y={560} value={1268 * k} max={1268} size={104} color={C.amber} align="middle" />
      <text x={900} y={560} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 50, fill: C.cream }}>
        m
      </text>
    </g>
  );
};

/** e - the bar stands; Tick measures it. */
const e: Shot = ({ f }) => (
  <g>
    <Sky stops={["#146A6C", "#1FA69A"]} x={0} y={0} w={W} h={H} />
    <Strata f={f} speed={-5} bands={SEABED} amp={22} seed={7} y0={BAR_TOP} />
    <rect x={0} y={0} width={W} height={BAR_TOP} fill="#2A8FC4" />
    <CloudRack f={f} n={2} x0={-400} x1={1500} y0={60} y1={BAR_TOP - 40} size={70} speed={3.4} body={C.cream} under={C.ice} top="#FFFFFF" seed={4} />
    <rect x={BAR_X - 50} y={BAR_TOP} width={100} height={1.268 * PXKM} rx={30} fill={C.ink} />
    <rect x={BAR_X - 32} y={BAR_TOP} width={64} height={1.268 * PXKM} rx={20} fill={C.amber} />
    <path d={`M${BAR_X + 90} ${BAR_TOP} h30 V${BAR_TOP + 1.268 * PXKM} h-30`} stroke={C.cream} strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.6 + 0.4 * Math.sin(f / 5)} />
    <Plaque x={720} y={BAR_TOP + 300} text="1,268 M" size={110} bg={C.ink} fg={C.amber} />
    <Tick x={880} y={1230} pxPerM={380} frame={f} pose="point" expression="happy" facing={-1} />
  </g>
);

/** f - seawater creeps into the rock and turns it green. */
const f_: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 4);
  const id = "cut" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <g>
      <Sky stops={["#2A8FC4", "#1B6FA8"]} x={0} y={0} w={W} h={500} />
      <rect x={0} y={500} width={W} height={H - 500} fill={C.orange} />
      <Strata f={f} speed={0} bands={[[170, "#E3813F"], [120, "#B04A18"], [150, "#F6B45A"]]} y0={500} amp={16} seed={3} />
      <clipPath id={id}>
        <rect x={0} y={500} width={W} height={760} />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        {Array.from({ length: 6 }, (_, i) => {
          const x = 120 + i * 160;
          const len = 760 * k * (0.6 + rnd(i) * 0.4);
          return (
            <g key={i}>
              <path d={`M${x} 500 Q${x + 60} 700 ${x - 30} 860 T${x + 20} 1200`} stroke={C.green} strokeWidth={90} fill="none" strokeLinecap="round" strokeDasharray={`${len} 2000`} opacity={0.75} />
              <path d={`M${x} 500 Q${x + 60} 700 ${x - 30} 860 T${x + 20} 1200`} stroke={C.sea} strokeWidth={22} fill="none" strokeLinecap="round" strokeDasharray="40 30" strokeDashoffset={-f * 6} />
            </g>
          );
        })}
      </g>
      <Bubbles frame={f} x0={100} x1={980} y={520} n={20} color={C.foam} seed={2} rise={2} size={8} />
      <path d={seaSurface(f * 2, -40, 1120, 500, 10, 220, 2, 560, 30)} fill="#7FD0E8" />
      <Plaque x={540} y={230} text="CHANGED BY SEAWATER" size={62} bg={C.ink} fg={C.cream} />
      <T x={540} y={1180} text="MOSTLY" size={60} color={C.green} opacity={ez(f, 6, 14)} />
    </g>
  );
};

/** g - the old record: a short ghost bar. */
const g: Shot = ({ f }) => (
  <g>
    <Sky stops={["#146A6C", "#1FA69A"]} x={0} y={0} w={W} h={H} />
    <Strata f={f} speed={5} bands={SEABED} amp={22} seed={9} y0={BAR_TOP} />
    <rect x={0} y={0} width={W} height={BAR_TOP} fill="#2A8FC4" />
    <CloudRack f={f} n={2} x0={-400} x1={1500} y0={60} y1={BAR_TOP - 40} size={70} speed={3} body={C.cream} under={C.ice} top="#FFFFFF" seed={8} />
    <rect x={BAR_X - 50} y={BAR_TOP} width={100} height={1.268 * PXKM} rx={30} fill={C.ink} opacity={0.5} />
    <rect x={720 - 50} y={BAR_TOP} width={100} height={0.2008 * PXKM} rx={30} fill="none" stroke={C.cream} strokeWidth={8} strokeDasharray="18 12" strokeDashoffset={-f * 2} />
    <rect x={720 - 32} y={BAR_TOP} width={64} height={0.2008 * PXKM} rx={20} fill={C.cream} opacity={0.8 + 0.2 * Math.sin(f / 4)} />
    <Plaque x={720} y={BAR_TOP + 250} text="OLD RECORD" size={48} bg={C.ink} fg={C.cream} />
    <Plaque x={720} y={BAR_TOP + 330} text="200.8 M" size={80} bg={C.ink} fg={C.amber} />
    <Plaque x={BAR_X} y={BAR_TOP + 1.268 * PXKM + 60} text="2023" size={60} bg={C.ink} fg={C.amber} />
  </g>
);

/** h - the new bar slides past the old one. */
const h: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 3);
  const len = mix(0.2008, 1.268, k) * PXKM;
  return (
    <g>
      <Sky stops={["#146A6C", "#1FA69A"]} x={0} y={0} w={W} h={H} />
      <Strata f={f} speed={14} bands={SEABED} amp={22} seed={4} y0={BAR_TOP} />
      <rect x={0} y={0} width={W} height={BAR_TOP} fill="#2A8FC4" />
      <CloudRack f={f} n={2} x0={-400} x1={1500} y0={60} y1={BAR_TOP - 40} size={70} speed={4} body={C.cream} under={C.ice} top="#FFFFFF" seed={3} />
      <rect x={720 - 50} y={BAR_TOP} width={100} height={0.2008 * PXKM} rx={30} fill={C.cream} />
      <rect x={BAR_X - 50} y={BAR_TOP} width={100} height={len} rx={30} fill={C.ink} />
      <rect x={BAR_X - 32} y={BAR_TOP} width={64} height={len} rx={20} fill={C.amber} />
      <Glow x={BAR_X} y={BAR_TOP + len} r={170} color={C.gold} f={f} strength={0.8} period={12} />
      <Plaque x={720} y={BAR_TOP + 250} text="OLD RECORD" size={48} bg={C.ink} fg={C.cream} />
      <Tick x={880} y={1230} pxPerM={340} frame={f} pose="cheer" expression="happy" facing={-1} />
    </g>
  );
};

/** i - six old records stack up beside the new one. */
const i_: Shot = ({ f }) => {
  const unit = 0.2008 * PXKM;
  return (
    <g>
      <Sky stops={["#0A3C4C", "#11707A", "#1FA69A"]} x={0} y={0} w={W} h={H} />
      <Chips f={f} n={12} y0={100} y1={1150} color={C.mint} speed={9} opacity={0.45} seed={5} />
      <rect x={BAR_X - 50} y={BAR_TOP} width={100} height={1.268 * PXKM} rx={30} fill={C.ink} />
      <rect x={BAR_X - 32} y={BAR_TOP} width={64} height={1.268 * PXKM} rx={20} fill={C.amber} />
      {Array.from({ length: 6 }, (_, i) => {
        const t = ez(f, i * 4, i * 4 + 8);
        const y = mix(BAR_TOP - 400, BAR_TOP + i * unit, t);
        const sq = f >= i * 4 + 8 && f < i * 4 + 14 ? 1.08 : 1;
        return <rect key={i} x={720 - 50} y={y} width={100} height={unit - 6} rx={20} fill={i % 2 ? C.cream : C.ice} opacity={ramp(f, i * 4, i * 4 + 3)} transform={`scale(${sq} 1)`} style={{ transformOrigin: `720px ${y}px` }} />;
      })}
      <Plaque x={540} y={1090} text="6×" size={230} bg={C.ink} fg={C.amber} scale={0.7 + 0.3 * ez(f, 20, 30)} />
    </g>
  );
};

/** j - zoom out: the Kola hole rises beside it. */
const j: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 3);
  const px = mix(PXKM, 70, k);
  const top = 340;
  return (
    <g>
      <Sky stops={["#146A6C", "#1FA69A"]} x={0} y={0} w={W} h={H} />
      <Strata f={f} speed={4} bands={CRUST} amp={22} seed={3} y0={top} />
      <rect x={0} y={0} width={W} height={top} fill="#4FB5DE" />
      <CloudRack f={f} n={3} x0={-400} x1={1500} y0={50} y1={top - 30} size={80} speed={3} body={C.cream} under={C.ice} top="#FFFFFF" seed={5} />
      <rect x={320 - 40} y={top} width={80} height={1.268 * px} rx={24} fill={C.ink} />
      <rect x={320 - 26} y={top} width={52} height={1.268 * px} rx={16} fill={C.amber} />
      <rect x={720 - 40} y={top} width={80} height={12.262 * px * ez(f, 6, n - 1)} rx={24} fill={C.ink} />
      <rect x={720 - 26} y={top} width={52} height={12.262 * px * ez(f, 6, n - 1)} rx={16} fill={C.cream} />
      <Plaque x={320} y={top + 1.268 * px + 70} text="1,268 M" size={46} bg={C.ink} fg={C.amber} opacity={ez(f, 8, 16)} />
      <Plaque x={720} y={top + 12.262 * px * ez(f, 6, n - 1) + 60} text="KOLA 12,262 M" size={46} bg={C.ink} fg={C.cream} opacity={ez(f, 12, 20)} />
    </g>
  );
};

/** k - ten Atlantic holes fit in Kola. */
const k_: Shot = ({ f }) => {
  const px = 72;
  const top = 300;
  const unit = 1.268 * px;
  const cur = Math.min(9.7, f / 3.2);
  return (
    <g>
      <Sky stops={["#0A3C4C", "#11707A", "#1FA69A"]} x={0} y={0} w={W} h={H} />
      <Chips f={f} n={12} y0={100} y1={1150} color={C.mint} speed={9} opacity={0.4} seed={9} />
      <rect x={540 - 70} y={top} width={140} height={12.262 * px} rx={34} fill={C.ink} />
      {Array.from({ length: 10 }, (_, i) => {
        const on = cur > i;
        const h2 = Math.min(unit, 12.262 * px - i * unit) - 6;
        return <rect key={i} x={540 - 54} y={top + i * unit + 3} width={108} height={h2} rx={18} fill={i % 2 ? C.amber : C.gold} opacity={on ? 1 : 0.15} />;
      })}
      <Plaque x={880} y={top + 12.262 * px * 0.5} text="~10×" size={170} bg={C.ink} fg={C.amber} scale={0.8 + 0.2 * Math.abs(Math.sin(f / 6))} />
      <T x={200} y={top + 12.262 * px * 0.5} text="KOLA" size={70} />
    </g>
  );
};

/** l - the continental section: crust, then mantle at ~40 km. */
const CrustScene: React.FC<{ f: number; k: number }> = ({ f, k }) => {
  const top = 320;
  const base = top + 40 * 15;
  return (
    <g>
      <Sky stops={["#4FB5DE", "#9BD6E8"]} x={0} y={0} w={W} h={top} />
      <CloudRack f={f} n={3} x0={-400} x1={1500} y0={50} y1={top - 30} size={80} speed={3} body={C.cream} under={C.ice} top="#FFFFFF" seed={5} />
      <rect x={0} y={top} width={W} height={base - top} fill="#146A6C" />
      <Strata f={f} speed={4} bands={CRUST} amp={24} seed={3} y0={top} y1={base} />
      <rect x={0} y={base} width={W} height={H - base} fill={C.orange} />
      <Glow x={540} y={base + 120} r={640} color={C.gold} f={f} strength={0.9} period={34} />
      <path d={`M960 ${top} h40 V${top + (base - top) * k} h-40`} stroke={C.cream} strokeWidth={8} fill="none" strokeLinecap="round" />
    </g>
  );
};

const l: Shot = ({ f, n }) => (
  <g>
    <CrustScene f={f} k={ez(f, 4, n - 2)} />
    <Plaque x={540} y={180} text="UNDER CONTINENTS" size={56} bg={C.ink} fg={C.cream} />
    <Tick x={190} y={320} pxPerM={200} frame={f} pose="point" expression="neutral" facing={1} />
  </g>
);

const m: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 4);
  return (
    <g>
      <CrustScene f={f * 1.4} k={k} />
      <rect x={160} y={420} width={640} height={230} rx={44} fill={C.ink} opacity={0.93} />
      <Counter x={400} y={590} value={40 * k} max={40} size={150} color={C.amber} align="middle" digits={2} />
      <text x={600} y={590} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64, fill: C.cream }}>
        km
      </text>
      <T x={470} y={730} text="ON AVERAGE" size={52} />
    </g>
  );
};

/** n - the mantle: slow orange swirl beneath. */
const n_: Shot = ({ f }) => (
  <g>
    <Sky stops={["#B04A18", "#E3813F", "#F6B45A"]} x={0} y={0} w={W} h={H} />
    <Glow x={540} y={700} r={900} color={C.gold} f={f} strength={0.9} period={40} />
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${200 + i * 340} ${400 + (i % 2) * 400}) rotate(${(i % 2 ? -1 : 1) * f * 2.2})`}>
        <circle r={150} fill="none" stroke={i % 2 ? C.cream : C.amber} strokeWidth={34} strokeDasharray="190 120" strokeLinecap="round" />
        <path d="M150 0 l-34 -36 m34 36 l-34 36" stroke={C.cream} strokeWidth={14} strokeLinecap="round" fill="none" />
      </g>
    ))}
    <Plaque x={540} y={230} text="MANTLE" size={150} bg={C.ink} fg={C.amber} />
    <Plaque x={540} y={1090} text="BELOW THE CRUST" size={58} bg={C.ink} fg={C.cream} />
  </g>
);

/** o - the short hole stops far above the mantle; a question mark in the gap. */
const o: Shot = ({ f }) => {
  const top = 320;
  const base = top + 40 * 15;
  const holeBot = top + 1.268 * 15;
  return (
    <g>
      <CrustScene f={f} k={1} />
      <rect x={529} y={top} width={22} height={holeBot - top + 20} rx={11} fill={C.ink} />
      <circle cx={540} cy={holeBot + 20} r={16} fill={C.amber} />
      <path d={`M540 ${holeBot + 50} V${base - 20}`} stroke={C.cream} strokeWidth={8} strokeDasharray="14 14" strokeDashoffset={-f * 2} />
      <text x={540} y={(holeBot + base) / 2 + 150} textAnchor="middle" style={{ fontFamily: FONT, fontWeight: 800, fontSize: 520, fill: "none", stroke: C.amber, strokeWidth: 16, strokeDasharray: "26 16", strokeDashoffset: -f * 3 }} opacity={0.6 + 0.4 * Math.sin(f / 4)}>
        ?
      </text>
      <Plaque x={760} y={holeBot + 20} text="1,268 M" size={56} bg={C.ink} fg={C.amber} />
      <Plaque x={760} y={base - 70} text="MANTLE" size={56} bg={C.ink} fg={C.cream} />
    </g>
  );
};

/** p - Tick puzzles, question marks rise. */
const p: Shot = ({ f }) => (
  <g>
    <Sky stops={["#0A3C4C", "#11707A", "#1FA69A"]} x={0} y={0} w={W} h={H} />
    <Streamers f={f} n={8} x0={-300} x1={1400} y0={150} y1={1150} len={400} width={24} speed={4} color={C.mint} opacity={0.3} slope={0.04} seed={6} />
    <Chips f={f} n={10} y0={100} y1={1150} color={C.foam} speed={8} opacity={0.4} seed={3} />
    <Tick x={420} y={1230} pxPerM={560} frame={f} pose="think" expression="thinking" facing={1} />
    {[0, 1, 2].map((i) => {
      const age = (f + i * 22) % 66;
      return (
        <text key={i} x={820 + Math.sin(age / 8 + i) * 40 - i * 40} y={900 - age * 9} textAnchor="middle" opacity={Math.min(1, age / 6) * (1 - age / 66)} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 200, fill: C.amber, stroke: C.ink, strokeWidth: 14, paintOrder: "stroke" }}>
          ?
        </text>
      );
    })}
    <Plaque x={540} y={230} text="HOW?" size={170} bg={C.ink} fg={C.amber} />
  </g>
);

/** q - not deeper: where? A sonar sweep over the sea floor. */
const q: Shot = ({ f }) => (
  <g>
    <Sky stops={["#0A3C4C", "#11707A", "#1FA69A"]} x={0} y={0} w={W} h={H} />
    <g transform={`translate(540 640)`}>
      {[260, 400, 540].map((r) => (
        <circle key={r} r={r} fill="none" stroke={C.mint} strokeWidth={8} opacity={0.5} />
      ))}
      <g transform={`rotate(${f * 6})`}>
        <path d="M0 0 L560 -140 A580 580 0 0 1 560 140 Z" fill={C.green} opacity={0.45} />
        <line x1={0} y1={0} x2={580} y2={0} stroke={C.cream} strokeWidth={10} strokeLinecap="round" />
      </g>
      {Array.from({ length: 6 }, (_, i) => {
        const a = rnd(i) * 6.28;
        const r = 150 + rnd(i + 20) * 330;
        return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r={14 + 8 * Math.sin(f / 4 + i)} fill={C.amber} />;
      })}
    </g>
    <Plaque x={540} y={230} text="WHERE?" size={170} bg={C.ink} fg={C.amber} />
    <Tick x={880} y={1230} pxPerM={300} frame={f} pose="point" expression="determined" facing={-1} />
    <T x={540} y={1180} text="NOT HOW DEEP" size={60} />
  </g>
);

/** r - end card. */
const r_: Shot = ({ f }) => (
  <EndShot f={f} stops={["#0A3C4C", "#11707A", "#1FA69A"]} q={["WHERE DID", "THEY DIG?"]}>
    <rect x={850} y={200} width={50} height={190} rx={22} fill={C.amber} />
  </EndShot>
);

export const ShortS45 = makeShort(timeline, [[a, b, c], [d, e, f_], [g, h, i_], [j, k_], [l, m, n_], [o, p], [q, r_]]);
