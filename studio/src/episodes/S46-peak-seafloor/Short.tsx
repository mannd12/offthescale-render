import React from "react";
import { Bubbles, Caustics, CloudRack, Counter, Sky, Streamers, Tick, rnd, seaSurface } from "../../lib/illustrated";
import { buildTimeline, VoLine } from "../../lib/timeline";
import { C, Chips, EndShot, Glow, Plaque, Rain, Strata, T, W, H, Shot, ez, makeShort, mix, ramp } from "../S41-dig-plate/vkit";
import { Peak, Qmark, Ruler, Shell, Bar } from "./kit46";
import vo from "./vo.json";

/**
 * S46 - the summit is a seabed (episodes/S46-peak-seafloor). For L12, answered at 0:54. Vertical 1080x1920.
 * Numbers (sources.md, L12 rows): #1 8,848.86 m (shown 8,849 M, spoken "almost nine kilometres"); #2 limestone from a
 * warm shallow sea ~450 million years ago, crinoids and brachiopods, ~50 million years; #3 collision; #6 +2 mm a year.
 * The reason a mountain stops climbing is withheld.
 */
export const timeline = buildTimeline(vo as VoLine[]);

const FONT = "'Outfit', sans-serif";
const DUSK = ["#4B2A8C", "#E4572E", "#FFC83D"];
const BEDS: [number, string][] = [
  [130, "#F6B45A"],
  [90, "#FFF4DE"],
  [150, "#E3813F"],
  [100, "#FFCF73"],
];

const Stone: React.FC<{ x: number; y: number; s: number; rot?: number }> = ({ x, y, s, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-150 -40 L-90 -120 L60 -130 L150 -50 L130 70 L20 120 L-110 90 Z" fill={C.apricot} stroke={C.ink} strokeWidth={10} strokeLinejoin="round" />
    <path d="M-120 -30 H100 M-100 20 H120 M-80 70 H70" stroke={C.cream} strokeWidth={9} strokeLinecap="round" opacity={0.8} />
  </g>
);

/** a - dusk ridge, Tick lifts the stone toward the camera and it grows. */
const a: Shot = ({ f, n }) => {
  const k = ez(f, 4, n - 2);
  return (
    <g>
      <Sky stops={DUSK} x={0} y={0} w={W} h={H} />
      <Glow x={760} y={500} r={620} color={C.gold} f={f} strength={0.7} />
      <Rain f={f} n={22} color={C.foam} speed={7} len={34} width={9} opacity={0.85} seed={4} />
      <Peak x={300} y={1260} w={1500} h={900} body="#7A3418" shade="#4A140C" />
      <Tick x={250} y={1190} pxPerM={330} frame={f} pose="crouch-reach" expression="happy" facing={1} />
      <Stone x={mix(380, 560, k)} y={mix(940, 640, k)} s={mix(1.2, 3.6, k)} rot={mix(-14, 4, k)} />
      <T x={540} y={190} text="EVEREST SUMMIT" size={86} color={C.amber} />
    </g>
  );
};

/** b - push into the stone: its face is hatching that resolves into a ribbed shell. */
const b: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 4);
  return (
    <g>
      <Sky stops={["#E3813F", "#F6B45A"]} x={0} y={0} w={W} h={H} />
      <Strata f={f} speed={-5} bands={BEDS} amp={26} seed={5} y0={0} y1={1250} />
      <g transform={`translate(540 640) scale(${mix(0.8, 1.08, k)})`}>
        <rect x={-440} y={-440} width={880} height={880} rx={90} fill={C.cream} stroke={C.ink} strokeWidth={14} />
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M-380 ${-360 + i * 90} H380`} stroke={C.apricot} strokeWidth={14} strokeDasharray="60 40" strokeDashoffset={-f * (i % 2 ? 3 : -3)} opacity={1 - k * 0.7} />
        ))}
        <g opacity={ramp(f, 6, n - 6)} transform={`scale(${mix(0.7, 1.35, k)}) translate(0 ${-20 + 8 * Math.sin(f / 5)})`}>
          <Shell x={0} y={0} r={250} body={C.foam} rib={C.rust} />
        </g>
      </g>
      <Plaque x={540} y={190} text="LOOK CLOSELY" size={84} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** c - shells pop out of the rock, one after another. */
const c: Shot = ({ f }) => (
  <g>
    <Sky stops={["#B04A18", "#E3813F", "#F6B45A"]} x={0} y={0} w={W} h={H} />
    <Strata f={f} speed={6} bands={BEDS} amp={26} seed={2} y0={0} y1={1250} />
    {Array.from({ length: 8 }, (_, i) => {
      const at = i * 5;
      const s = f < at ? 0 : 1 + 0.25 * Math.max(0, 1 - (f - at) / 8);
      const cx = 200 + (i % 3) * 340 + (i > 5 ? 90 : 0);
      const cy = 330 + Math.floor(i / 3) * 330;
      return (
        <g key={i} transform={`translate(${cx} ${cy + Math.sin(f / 6 + i) * 8}) scale(${s})`}>
          <Shell x={0} y={0} r={125} rot={rnd(i) * 40 - 20} body={i % 2 ? C.foam : C.cream} />
        </g>
      );
    })}
    <Plaque x={540} y={1100} text="FULL OF SHELLS" size={80} bg={C.ink} fg={C.amber} scale={1 + 0.04 * Math.sin(f / 4)} />
  </g>
);

const Crinoid: React.FC<{ f: number; x: number; y: number; h: number }> = ({ f, x, y, h }) => (
  <g>
    {Array.from({ length: 11 }, (_, i) => (
      <circle key={i} cx={x + Math.sin(f / 9 + i * 0.4) * 10} cy={y - (i / 10) * h * 0.72} r={34 - i * 0.6} fill={i % 2 ? C.apricot : C.gold} stroke={C.ink} strokeWidth={6} />
    ))}
    <g transform={`translate(${x} ${y - h * 0.74})`}>
      {Array.from({ length: 9 }, (_, i) => {
        const a2 = -Math.PI * (0.1 + (0.8 * i) / 8);
        const L = 230 + 30 * Math.sin(f / 7 + i);
        return <path key={i} d={`M0 0 Q${Math.cos(a2) * L * 0.5} ${Math.sin(a2) * L * 0.9} ${Math.cos(a2) * L} ${Math.sin(a2) * L}`} stroke={i % 2 ? C.verm : C.amber} strokeWidth={22} fill="none" strokeLinecap="round" />;
      })}
      <circle r={36} fill={C.orange} stroke={C.ink} strokeWidth={6} />
    </g>
  </g>
);

/** d - a crinoid rises out of the rock, Tick points. */
const d: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 6);
  return (
    <g>
      <Sky stops={["#4B2A8C", "#7C3FA8", "#E4572E"]} x={0} y={0} w={W} h={H} />
      <Chips f={f} n={12} y0={100} y1={1150} color={C.gold} speed={8} opacity={0.5} seed={5} />
      <Crinoid f={f} x={620} y={mix(1500, 1180, k)} h={900} />
      <rect x={0} y={1180} width={W} height={120} fill={C.rust} />
      <Tick x={190} y={1230} pxPerM={380} frame={f} pose="point" expression="surprised" facing={1} />
      <Plaque x={540} y={190} text="CRINOID" size={120} bg={C.ink} fg={C.amber} scale={ez(f, 2, 12)} />
    </g>
  );
};

/** e - a brachiopod bounces out beside it. */
const e: Shot = ({ f }) => {
  const bounce = Math.abs(Math.sin(f / 8)) * 90;
  return (
    <g>
      <Sky stops={["#4B2A8C", "#7C3FA8", "#E4572E"]} x={0} y={0} w={W} h={H} />
      <Chips f={f} n={12} y0={100} y1={1150} color={C.gold} speed={-8} opacity={0.5} seed={8} />
      <g transform={`translate(540 ${760 - bounce}) rotate(${Math.sin(f / 10) * 8})`}>
        <Shell x={0} y={0} r={360} body={C.foam} rib={C.rust} />
      </g>
      <ellipse cx={540} cy={1200} rx={300 - bounce * 0.8} ry={26} fill={C.ink} opacity={0.5} />
      <Tick x={880} y={1230} pxPerM={380} frame={f} pose="point" expression="happy" facing={-1} />
      <Plaque x={540} y={190} text="BRACHIOPOD" size={100} bg={C.ink} fg={C.amber} />
    </g>
  );
};

const WarmSea: React.FC<{ f: number; top?: number }> = ({ f, top = 330 }) => (
  <g>
    <Sky stops={["#FFC83D", "#4FB5DE"]} x={0} y={0} w={W} h={top + 40} />
    <Sky stops={["#3FD0B4", "#1FA69A", "#2A8FC4"]} x={0} y={top} w={W} h={H - top} />
    <Caustics f={f} x={0} y={top} w={W} h={700} rows={8} color={C.foam} width={10} opacity={0.35} speed={3.2} />
    <path d={seaSurface(f * 2.4, -40, 1120, top, 12, 240, 2, top + 60, 30)} fill="#7FD0E8" />
  </g>
);

/** f - warm shallow sea: shells drift down and settle into sand. */
const f_: Shot = ({ f }) => (
  <g>
    <WarmSea f={f} />
    <Bubbles frame={f} x0={80} x1={1000} y={1150} n={26} color={C.foam} seed={6} rise={3} size={9} />
    <rect x={0} y={1080} width={W} height={200} fill={C.gold} />
    {Array.from({ length: 6 }, (_, i) => {
      const y = ((f * (4 + i) + i * 190) % 760) + 380;
      const settled = y > 1000;
      return (
        <g key={i} transform={`translate(${130 + i * 160} ${Math.min(y, 1090)})`}>
          <Shell x={0} y={0} r={settled ? 70 : 85} rot={settled ? 0 : Math.sin(f / 6 + i) * 25} body={C.cream} />
        </g>
      );
    })}
    <Plaque x={540} y={200} text="WARM, SHALLOW SEA" size={72} bg={C.ink} fg={C.cream} />
  </g>
);

/** g - the date plate: a counter rolls to 450 million years. */
const g: Shot = ({ f, n }) => {
  const v = 450 * ez(f, 2, n - 8);
  return (
    <g>
      <WarmSea f={f * 1.4} top={250} />
      <Bubbles frame={f} x0={80} x1={1000} y={1150} n={24} color={C.foam} seed={2} rise={3} size={9} />
      <rect x={100} y={420} width={880} height={500} rx={70} fill={C.ink} opacity={0.94} />
      <Counter x={430} y={720} value={v} max={450} size={250} color={C.amber} align="middle" digits={3} />
      <T x={540} y={830} text="MILLION YEARS AGO" size={74} color={C.cream} />
      <T x={540} y={1060} text="LIMESTONE" size={110} color={C.amber} />
    </g>
  );
};

/** h - sea-floor layers pile up and scroll, shells inside. */
const h: Shot = ({ f }) => (
  <g>
    <WarmSea f={f} top={250} />
    <Strata f={f} speed={5} bands={BEDS} amp={22} seed={4} y0={560} y1={1250} />
    {[0, 1, 2].map((i) => {
      const y = 700 + ((i * 230 - f * 5 + 2000) % 690);
      return (
        <g key={i} transform={`translate(${220 + i * 300} ${y})`}>
          <Shell x={0} y={0} r={80} body={C.foam} />
        </g>
      );
    })}
    <Plaque x={540} y={440} text="SEABED, LAYER BY LAYER" size={58} bg={C.ink} fg={C.cream} />
  </g>
);

/** i - the sea drops away and the slab shoots up with Tick riding it. */
const i_: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 6);
  return (
    <g>
      <Sky stops={["#2A8FC4", "#4FB5DE", "#E6F8FF"]} x={0} y={0} w={W} h={H} />
      <CloudRack f={f} n={4} x0={-400} x1={1500} y0={100} y1={900} size={110} speed={6} body={C.cream} under={C.ice} top="#FFFFFF" seed={3} />
      <Ruler f={f} x={900} y0={80} y1={1230} speed={-26} step={110} />
      <Ruler f={f} x={110} y0={80} y1={1230} speed={-26} step={110} />
      <rect x={0} y={mix(900, 1500, k)} width={W} height={900} fill="#1FA69A" />
      <path d={seaSurface(f * 2.4, -40, 1120, mix(900, 1500, k), 14, 240, 2, 1700, 30)} fill="#7FD0E8" />
      <g transform={`translate(0 ${mix(0, -520, k)})`}>
        <rect x={250} y={1000} width={580} height={420} rx={50} fill={C.apricot} stroke={C.ink} strokeWidth={10} />
        <path d="M290 1070 H790 M290 1130 H790" stroke={C.cream} strokeWidth={9} strokeLinecap="round" />
        <Shell x={540} y={1240} r={60} body={C.foam} />
        <Tick x={540} y={1000} pxPerM={250} frame={f} pose="cheer" expression="surprised" facing={1} />
      </g>
    </g>
  );
};

/** j - nearly nine kilometres above the ocean: counter + bracket against the big peak. */
const j: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 8);
  return (
    <g>
      <Sky stops={["#2A8FC4", "#4FB5DE", "#9BD6E8"]} x={0} y={0} w={W} h={H} />
      <CloudRack f={f} n={4} x0={-400} x1={1500} y0={420} y1={1000} size={100} speed={5} body={C.cream} under={C.ice} top="#FFFFFF" seed={7} />
      <Peak x={620} y={1230} w={900} h={1000} body="#E3813F" shade="#B04A18" />
      <rect x={0} y={1180} width={W} height={120} fill="#1FA69A" />
      <path d={seaSurface(f * 2.4, -40, 1120, 1180, 10, 240, 2, 1300, 30)} fill="#7FD0E8" />
      <path d={`M130 1180 H210 M170 1180 V${1180 - 940 * k} M130 ${1180 - 940 * k} H210`} stroke={C.cream} strokeWidth={10} fill="none" strokeLinecap="round" />
      <rect x={90} y={250} width={520} height={200} rx={44} fill={C.ink} opacity={0.93} />
      <Counter x={290} y={400} value={8849 * k} max={8849} size={100} color={C.amber} align="middle" />
      <text x={480} y={400} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 56, fill: C.cream }}>
        m
      </text>
      <T x={350} y={520} text="ABOVE THE SEA" size={52} />
    </g>
  );
};

/** k - the time bar unrolls while a ghost range heaves up along it. */
const k_: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 4);
  return (
    <g>
      <Sky stops={["#4B2A8C", "#E4572E", "#FFC83D"]} x={0} y={0} w={W} h={H} />
      <Chips f={f} n={12} y0={120} y1={900} color={C.gold} speed={9} opacity={0.4} seed={11} />
      {Array.from({ length: 5 }, (_, i) => {
        const x = 160 + i * 190;
        const hh = 120 + (130 + 70 * rnd(i + 3)) * ez(f, i * 5, n - 2);
        return <Peak key={i} x={x + 40} y={880} w={380} h={hh * (i === 2 ? 2.2 : 1.4)} body={C.orange} shade={C.rust} />;
      })}
      <rect x={90} y={940} width={900} height={64} rx={32} fill={C.ink} />
      <rect x={100} y={950} width={880 * k} height={44} rx={22} fill={C.amber} />
      <Glow x={100 + 880 * k} y={972} r={110} color={C.gold} f={f} strength={0.8} period={10} />
      <Plaque x={540} y={1090} text="~50 MILLION YEARS" size={64} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** l - two plates crunch together and the wedge between them rises. */
const l: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 2);
  const gap = mix(240, 0, k);
  return (
    <g>
      <Sky stops={["#4B2A8C", "#7C3FA8", "#E4572E"]} x={0} y={0} w={W} h={H} />
      <Streamers f={f} n={8} x0={-300} x1={1400} y0={150} y1={700} len={380} width={18} speed={5} color={C.gold} opacity={0.35} slope={0.03} seed={4} />
      <path d={`M-40 1200 V760 H${380 - gap} L${540 - gap * 0.2} ${760 - 420 * k} L${540 + gap * 0.2} ${760 - 420 * k} L${700 + gap} 760 H1120 V1200 Z`} fill={C.orange} />
      <path d={`M-40 1200 V900 H${380 - gap} V1200 Z`} fill={C.teal} />
      <path d={`M${700 + gap} 900 H1120 V1200 H${700 + gap} Z`} fill={C.rust} />
      <path d={`M${380 - gap} 800 L540 ${800 - 400 * k} L${700 + gap} 800 Z`} fill={C.apricot} />
      <path d="M200 1050 h130 m-40 -30 l40 30 l-40 30" stroke={C.cream} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" transform={`translate(${60 * Math.sin(f / 6)} 0)`} />
      <path d="M880 1050 h-130 m40 -30 l-40 30 l40 30" stroke={C.cream} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" transform={`translate(${-60 * Math.sin(f / 6)} 0)`} />
      <Tick x={900} y={760} pxPerM={250} frame={f} pose="point" expression="thinking" facing={-1} />
      <Plaque x={540} y={190} text="SOMETHING PUSHED" size={76} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** m - a GPS antenna on the summit pings. */
const m: Shot = ({ f }) => (
  <g>
    <Sky stops={["#1B6FA8", "#2A8FC4", "#9BD6E8"]} x={0} y={0} w={W} h={H} />
    <CloudRack f={f} n={3} x0={-400} x1={1500} y0={900} y1={1200} size={110} speed={5} body={C.cream} under={C.ice} top="#FFFFFF" seed={5} />
    <Peak x={540} y={1300} w={1300} h={1050} body="#E3813F" shade="#B04A18" />
    <g transform="translate(540 330)">
      {[0, 1, 2].map((i) => {
        const p = ((f + i * 14) % 42) / 42;
        return <circle key={i} r={40 + p * 300} fill="none" stroke={C.amber} strokeWidth={14} opacity={1 - p} />;
      })}
      <rect x={-8} y={0} width={16} height={110} fill={C.cream} />
      <circle r={30} fill={Math.floor(f / 8) % 2 ? C.verm : C.amber} />
    </g>
    <Plaque x={540} y={1100} text="GPS ON THE TOP" size={70} bg={C.ink} fg={C.cream} />
  </g>
);

/** n - +2 mm a year: a ruler creeps, the counter rolls. */
const n_: Shot = ({ f, n }) => {
  const k = ez(f, 4, n - 4);
  return (
    <g>
      <Sky stops={["#1B6FA8", "#2A8FC4", "#4FB5DE"]} x={0} y={0} w={W} h={H} />
      <Ruler f={f} x={110} y0={80} y1={1200} speed={5} step={100} len={140} />
      <Ruler f={f} x={830} y0={80} y1={1200} speed={5} step={100} len={140} />
      <Bar x={540} y={1100 - 520 - 90 * k} w={200} h={520 + 90 * k} color={C.orange} />
      <Glow x={540} y={1100 - 520 - 90 * k} r={170} color={C.gold} f={f} strength={0.9} period={12} />
      <path d={`M540 ${560 - 90 * k} v-90 m-40 40 l40 -50 l40 50`} stroke={C.amber} strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x={140} y={150} width={800} height={240} rx={50} fill={C.ink} opacity={0.94} />
      <T x={540} y={235} text="STILL RISING" size={60} color={C.cream} />
      <Counter x={400} y={355} value={2 * k} max={2} size={110} color={C.amber} align="middle" digits={1} />
      <text x={520} y={355} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 56, fill: C.cream }}>
        mm a year
      </text>
    </g>
  );
};

/** o - a ceiling slams in above the peak; the peak bumps it; Tick shrugs. */
const o: Shot = ({ f }) => {
  const drop = ez(f, 0, 10);
  const bump = f > 14 ? Math.max(0, 28 * Math.exp(-(f - 14) / 6) * Math.cos((f - 14) / 2)) : 0;
  return (
    <g transform={`translate(${f > 10 && f < 24 ? Math.sin(f * 3) * 6 : 0} 0)`}>
      <Sky stops={["#4B2A8C", "#E4572E", "#FFC83D"]} x={0} y={0} w={W} h={H} />
      <Chips f={f} n={10} y0={100} y1={1100} color={C.gold} speed={9} opacity={0.4} seed={13} />
      <Peak x={540} y={1250} w={1200} h={mix(860, 900, ez(f, 0, 30)) + bump} body="#E3813F" shade="#B04A18" />
      <rect x={0} y={mix(-160, 300, drop)} width={W} height={26} fill={C.verm} />
      <rect x={0} y={mix(-160, 300, drop)} width={W} height={26} fill="none" stroke={C.cream} strokeWidth={6} strokeDasharray="40 24" strokeDashoffset={-f * 4} />
      <Tick x={860} y={1230} pxPerM={300} frame={f} pose="shrug" expression="neutral" facing={-1} />
      <Plaque x={540} y={190} text="NEVER MUCH HIGHER" size={74} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** p - the unanswered question over the capped peak. */
const p: Shot = ({ f }) => (
  <g>
    <Sky stops={["#4B2A8C", "#7C3FA8", "#E4572E"]} x={0} y={0} w={W} h={H} />
    <Streamers f={f} n={8} x0={-300} x1={1400} y0={150} y1={1100} len={400} width={22} speed={5} color={C.gold} opacity={0.3} slope={0.04} seed={6} />
    <Peak x={300} y={1260} w={900} h={640} body="#E3813F" shade="#B04A18" />
    <rect x={0} y={560} width={W} height={20} fill={C.verm} />
    <Qmark f={f} x={640} y={920} size={640} />
    <Plaque x={540} y={190} text="WHAT STOPS IT?" size={92} bg={C.ink} fg={C.amber} />
  </g>
);

const q: Shot = ({ f }) => (
  <EndShot f={f} stops={["#4B2A8C", "#7C3FA8", "#E4572E"]} q={["WHAT STOPS A", "MOUNTAIN?"]}>
    <Peak x={975} y={1200} w={200} h={150} body={C.orange} shade={C.rust} />
  </EndShot>
);

export const ShortS46 = makeShort(timeline, [[a, b], [c], [d, e], [f_, g, h], [i_, j], [k_, l], [m, n_], [o], [p, q]]);
