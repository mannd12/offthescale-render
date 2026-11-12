import React, { useId } from "react";
import { Bloom, CloudRack, Counter, Sky, Streamers, Tick, impact, rnd } from "../../lib/illustrated";
import { buildTimeline, VoLine } from "../../lib/timeline";
import { C, Chips, Derrick, EndShot, Glow, Plaque, Strata, T, W, H, Shot, ez, makeShort, mix, ramp } from "../S41-dig-plate/vkit";
import vo from "./vo.json";

/**
 * S43 - the layer that wasn't there (episodes/S43-dig-basalt). For L11, answered at 2:02. Vertical 1080x1920, kit v2.
 * 17 shots. Numbers (sources.md): #6 basalt suggested at 7-7.5 km, gneiss found; #4 15,000 m target. Why the waves
 * bounced (#7) is withheld; the Short only says that something did make them bounce. Depth scale: 48 px per km.
 */
export const timeline = buildTimeline(vo as VoLine[]);

const FONT = "'Outfit', sans-serif";
const SY = 480; // surface
const K = 48; // px per km
const ky = (km: number) => SY + K * km;
const GNEISS: [number, string][] = [
  [150, "#E3813F"],
  [100, "#F6B45A"],
  [170, "#B04A18"],
  [120, "#1FA69A"],
  [130, "#7A3418"],
  [90, "#FFCF73"],
];

const Surface: React.FC<{ f: number; speed?: number; bands?: [number, string][]; sunk?: boolean }> = ({ f, speed = 0, bands = GNEISS }) => (
  <g>
    <Sky stops={["#1E6678", "#4FB5DE", "#9BD6E8"]} x={0} y={0} w={W} h={SY + 20} />
    <CloudRack f={f} n={3} x0={-400} x1={1500} y0={60} y1={SY - 120} size={96} speed={2.2} body={C.cream} under={C.ice} top="#FFFFFF" seed={7} />
    <rect x={0} y={SY} width={W} height={H - SY} fill="#146A6C" />
    <Strata f={f} speed={speed} bands={bands} y0={SY} amp={18} seed={2} />
    <rect x={0} y={SY - 8} width={W} height={14} fill={C.cream} opacity={0.9} />
  </g>
);

const Basalt: React.FC<{ f: number; y: number; glow?: number; label?: boolean; strike?: number }> = ({ f, y, glow = 0.6, label = true, strike = 0 }) => (
  <g>
    <Glow x={540} y={y} r={520} color={C.amber} f={f} strength={glow * 0.8} />
    <rect x={0} y={y - 22} width={W} height={44} fill={C.ink} />
    <line x1={0} x2={W} y1={y - 22} y2={y - 22} stroke={C.amber} strokeWidth={6} strokeDasharray="26 16" strokeDashoffset={-f * 2} />
    {label ? <Plaque x={760} y={y - 90} text="BASALT?" size={64} bg={C.ink} fg={C.amber} /> : null}
    {strike > 0 ? <line x1={560} y1={y - 150} x2={560 + 400 * strike} y2={y - 150 + 120 * strike - 0} stroke={C.cream} strokeWidth={0} /> : null}
  </g>
);

const Ground: React.FC<{ f: number; y0?: number; y1?: number; children: React.ReactNode }> = ({ f, y0 = SY, y1 = H, children }) => {
  const id = "g43" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <g>
      <clipPath id={id}>
        <rect x={0} y={y0} width={W} height={y1 - y0} />
      </clipPath>
      <g clipPath={`url(#${id})`}>{children}</g>
    </g>
  );
};

/** a - the thump: Tick stomps, sound rings spread down and bounce off the 7 km line. */
const a: Shot = ({ f }) => {
  const stomp = f % 24;
  const sq = impact(f, Math.floor(f / 24) * 24, 0.25, 10);
  const bx = 200;
  return (
    <g>
      <Surface f={f} />
      <Ground f={f}>
        <Basalt f={f} y={ky(7)} glow={0.5 + 0.4 * Math.sin(f / 4)} label={false} />
        {[0, 1, 2, 3].map((i) => {
          const r = (stomp * 22 + i * 190) % 760;
          return <circle key={i} cx={bx} cy={SY} r={r} fill="none" stroke={C.cream} strokeWidth={14 * (1 - r / 800)} opacity={0.85 * (1 - r / 760)} />;
        })}
        <path d={`M${bx} ${SY} L460 ${ky(7)} L720 ${SY}`} stroke={C.amber} strokeWidth={10} fill="none" strokeDasharray="30 20" strokeDashoffset={-f * 4} />
      </Ground>
      <g transform={`translate(720 ${SY})`}>
        <rect x={-24} y={-48} width={48} height={48} rx={10} fill={C.gold} />
        <circle cy={-60} r={14} fill={C.ink} />
      </g>
      <Tick x={bx} y={SY} pxPerM={210} frame={f} pose="hips" expression="determined" squash={sq} facing={1} />
      <Plaque x={880} y={ky(7) + 80} text="7 KM" size={74} bg={C.ink} fg={C.amber} />
      <Plaque x={540} y={1130} text="SEISMIC SURVEY" size={54} bg={C.sea} fg={C.cream} />
    </g>
  );
};

/** b - close on the bounce: the ray hits the line and returns. */
const b: Shot = ({ f }) => {
  const z = 1.9;
  return (
    <g>
      <g transform={`translate(540 ${ky(7)}) scale(${z}) translate(-460 ${-ky(7)})`}>
        <Surface f={f} />
        <Basalt f={f} y={ky(7)} glow={0.9} label={false} />
        <path d={`M160 ${SY} L460 ${ky(7)} L760 ${SY}`} stroke={C.amber} strokeWidth={9} fill="none" strokeDasharray="30 20" strokeDashoffset={-f * 5} />
        <circle cx={460} cy={ky(7)} r={22 + 14 * Math.abs(Math.sin(f / 4))} fill={C.cream} opacity={0.85} />
      </g>
      <Plaque x={540} y={330} text="7 KM" size={130} bg={C.ink} fg={C.amber} />
      <T x={540} y={470} text="THE ECHO COMES BACK" size={58} />
    </g>
  );
};

/** c - the predicted layer: dark hexagon columns sliding. */
const c: Shot = ({ f }) => {
  const id = "hx" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <g>
      <Sky stops={["#0A3C4C", "#11707A", "#1FA69A"]} x={0} y={0} w={W} h={H} />
      <Strata f={f} speed={-4} bands={GNEISS.map(([h, col]) => [h, col] as [number, string])} amp={20} seed={3} y0={0} y1={420} />
      <Strata f={f} speed={4} bands={GNEISS} amp={20} seed={6} y0={880} y1={1250} />
      <defs>
        <pattern id={id} width={120} height={104} patternUnits="userSpaceOnUse" patternTransform={`translate(${-f * 3} 0)`}>
          <rect width={120} height={104} fill="#0E4658" />
          <path d="M30 0 L90 0 L120 52 L90 104 L30 104 L0 52 Z" fill="#146A6C" stroke={C.ink} strokeWidth={8} />
        </pattern>
      </defs>
      <rect x={0} y={420} width={W} height={460} fill={`url(#${id})`} />
      <Glow x={540} y={650} r={560} color={C.amber} f={f} strength={0.5} />
      <Plaque x={470} y={620} text="BASALT?" size={140} bg={C.ink} fg={C.amber} />
      <Plaque x={470} y={790} text="PREDICTED AT ~7 KM" size={50} bg={C.ink} fg={C.cream} />
      <Tick x={900} y={1210} pxPerM={300} frame={f} pose="think" expression="thinking" facing={-1} />
    </g>
  );
};

/** d - the target: a gauge to 15 km. */
const d: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 4);
  const flagY = mix(ky(0), ky(15), k);
  return (
    <g>
      <Surface f={f} speed={2} />
      <rect x={110} y={SY} width={100} height={K * 15} rx={50} fill="#0A3C4C" stroke={C.cream} strokeWidth={6} />
      <rect x={120} y={SY + 8} width={80} height={(flagY - SY) } rx={40} fill={C.verm} />
      {[0, 5, 10, 15].map((km) => (
        <g key={km}>
          <line x1={210} x2={270} y1={ky(km)} y2={ky(km)} stroke={C.cream} strokeWidth={6} />
          <text x={285} y={ky(km) + 12} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, fill: C.cream }}>
            {km}
          </text>
        </g>
      ))}
      <g transform={`translate(0 ${flagY})`}>
        <line x1={160} x2={900} y1={0} y2={0} stroke={C.amber} strokeWidth={8} strokeDasharray="22 14" strokeDashoffset={-f * 3} />
        <Plaque x={470} y={-4} text="TARGET" size={50} bg={C.amber} fg={C.ink} />
      </g>
      <rect x={380} y={170} width={620} height={220} rx={40} fill={C.ink} opacity={0.92} />
      <Counter x={560} y={330} value={15 * k} max={15} size={150} color={C.amber} align="middle" digits={2} />
      <text x={690} y={330} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 70, fill: C.cream }}>
        km
      </text>
      <Tick x={880} y={1220} pxPerM={260} frame={f} pose="point" expression="determined" facing={-1} />
    </g>
  );
};

/** e - the drill line, long and thin. */
const e: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 2);
  const tip = SY + K * 15 * k;
  return (
    <g>
      <Surface f={f} speed={2} />
      <Derrick f={f * 2} x={300} y={SY} s={1.15} />
      <rect x={520} y={SY} width={14} height={tip - SY} fill={C.ink} />
      <rect x={525} y={SY} width={4} height={tip - SY} fill={C.cream} opacity={0.6} />
      <Glow x={527} y={tip} r={160} color={C.amber} f={f} strength={0.9} period={14} />
      <circle cx={527} cy={tip} r={16} fill={C.cream} />
      <Basalt f={f} y={ky(7)} glow={0.4} label />
      <Plaque x={760} y={ky(15) - 60} text="15 KM" size={90} bg={C.ink} fg={C.amber} opacity={ez(f, 10, 20)} />
      <Chips f={f} n={10} y0={SY + 60} y1={1200} color={C.gold} speed={5} opacity={0.3} seed={4} len={90} width={8} />
    </g>
  );
};

/** f - so they drilled: depth marks race past. */
const f_: Shot = ({ f }) => {
  const off = f * 11;
  return (
    <g>
      <Sky stops={["#146A6C", "#1FA69A"]} x={0} y={0} w={W} h={H} />
      <Strata f={f} speed={11} bands={GNEISS} amp={20} seed={5} />
      <rect x={400} y={0} width={280} height={H} fill={C.ink} opacity={0.5} />
      {Array.from({ length: 8 }, (_, i) => {
        const y = ((((i * 330 - off) % 2640) + 2640) % 2640) - 200;
        const km = 4 + ((i + Math.floor((off + 200) / 2640 * 8)) % 8);
        return (
          <g key={i}>
            <line x1={120} x2={960} y1={y} y2={y} stroke={C.cream} strokeWidth={6} strokeDasharray="30 20" opacity={0.7} />
            <Plaque x={200} y={y} text={`${km} KM`} size={50} bg={C.ink} fg={C.amber} />
          </g>
        );
      })}
      <g transform={`translate(540 ${760 + Math.sin(f * 2.1) * 4})`}>
        <rect x={-30} y={-760} width={60} height={560} fill={C.cream} opacity={0.9} />
        <g transform={`rotate(${f * 18})`}>
          <circle r={150} fill={C.orange} stroke={C.amber} strokeWidth={12} />
          {[0, 1, 2].map((i) => (
            <circle key={i} r={46} cx={Math.cos((i * 2 * Math.PI) / 3) * 82} cy={Math.sin((i * 2 * Math.PI) / 3) * 82} fill={C.gold} stroke={C.ink} strokeWidth={7} />
          ))}
        </g>
      </g>
      <Plaque x={540} y={200} text="SO THEY DRILLED" size={84} bg={C.ink} fg={C.cream} />
    </g>
  );
};

/** g - through the line: it dissolves into dust. */
const g: Shot = ({ f, n }) => {
  const k = ez(f, 0, n);
  const tipY = mix(ky(7) - 150, ky(7) + 140, k);
  const burst = Math.max(0, (tipY - (ky(7) - 20)) / 140);
  const specks = 26;
  return (
    <g>
      <g transform={`translate(540 ${ky(7)}) scale(1.35) translate(-540 ${-ky(7)})`}>
        <Surface f={f} speed={0} />
        <rect x={525} y={SY} width={30} height={tipY - SY} fill={C.ink} />
        {burst < 0.02 ? <Basalt f={f} y={ky(7)} glow={0.7} label={false} /> : null}
        {Array.from({ length: specks }, (_, i) => {
          const x0 = (i / specks) * W;
          const dx = (rnd(i) - 0.5) * 360 * burst;
          const dy = (rnd(i + 40) - 0.2) * 260 * burst;
          return burst > 0.02 ? <rect key={i} x={x0 + dx} y={ky(7) - 22 + dy} width={W / specks + 4} height={44 * (1 - burst * 0.5)} rx={8} fill={C.ink} opacity={Math.max(0, 1 - burst * 1.1)} transform={`rotate(${burst * (rnd(i + 9) - 0.5) * 240} ${x0} ${ky(7)})`} /> : null;
        })}
        <Glow x={540} y={tipY} r={170} color={C.amber} f={f} strength={0.9} period={12} />
        <circle cx={540} cy={tipY} r={20} fill={C.cream} />
      </g>
      <Plaque x={540} y={260} text="THROUGH 7 KM" size={84} bg={C.ink} fg={C.cream} />
    </g>
  );
};

/** h - 7.0 -> 7.5 km: depth marks and a counter. */
const h: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 3);
  return (
    <g>
      <Sky stops={["#7A3418", "#B04A18", "#E3813F"]} x={0} y={0} w={W} h={H} />
      <Strata f={f} speed={9} bands={GNEISS} amp={20} seed={9} />
      <rect x={521} y={0} width={38} height={H} fill={C.ink} />
      <rect x={90} y={300} width={900} height={300} rx={50} fill={C.ink} opacity={0.93} />
      <text x={540} y={510} textAnchor="middle" style={{ fontFamily: FONT, fontWeight: 800, fontSize: 210, fill: C.amber }}>
        {(7 + 0.5 * k).toFixed(1)}
        <tspan fontSize={80} fill={C.cream}> KM</tspan>
      </text>
      <Chips f={f} n={14} y0={620} y1={1200} color={C.gold} speed={8} opacity={0.4} seed={3} len={110} width={9} />
      <Tick x={820} y={1210} pxPerM={300} frame={f} pose="point" expression="surprised" facing={-1} />
    </g>
  );
};

/** i - No basalt: the label is struck through. */
const i_: Shot = ({ f }) => {
  const slam = ez(f, 2, 9);
  const slash = ez(f, 10, 20);
  return (
    <g>
      <Sky stops={["#146A6C", "#1FA69A", "#2FBFA8"]} x={0} y={0} w={W} h={H} />
      <Strata f={f} speed={8} bands={GNEISS} amp={22} seed={4} />
      <g transform={`translate(540 600) scale(${mix(2.6, 1, slam)}) rotate(-5)`} opacity={slam}>
        <rect x={-430} y={-130} width={860} height={260} rx={46} fill={C.ink} />
        <text x={0} y={50} textAnchor="middle" style={{ fontFamily: FONT, fontWeight: 800, fontSize: 170, fill: C.amber }}>
          BASALT?
        </text>
        <line x1={-440} y1={30} x2={-440 + 880 * slash} y2={30} stroke={C.cream} strokeWidth={30} strokeLinecap="round" />
      </g>
      <T x={540} y={1000} text="NO BASALT" size={120} color={C.cream} opacity={ez(f, 12, 20)} />
    </g>
  );
};

/** j - gneiss: banded rock sliding sideways. */
const j: Shot = ({ f }) => (
  <g>
    <Sky stops={["#B04A18", "#E3813F"]} x={0} y={0} w={W} h={H} />
    <g transform="translate(1080 0) rotate(90)">
      <Strata f={f} speed={14} bands={[[90, "#E3813F"], [60, "#FFCF73"], [110, "#1FA69A"], [70, "#F6B45A"], [100, "#B04A18"], [50, "#2FBFA8"]]} amp={34} seed={2} x0={-40} x1={H + 40} y0={0} y1={W} />
    </g>
    <Chips f={f} n={14} y0={100} y1={1200} color={C.cream} speed={16} opacity={0.5} seed={7} dir={-1} />
    <Plaque x={540} y={330} text="GNEISS" size={170} bg={C.ink} fg={C.amber} />
    <Plaque x={540} y={540} text="OLD · GRANITE-LIKE" size={58} bg={C.ink} fg={C.cream} />
  </g>
);

/** k - Tick shrugs with a core sample; the rock is the same all the way down. */
const k_: Shot = ({ f }) => (
  <g>
    <Sky stops={["#0A3C4C", "#11707A"]} x={0} y={0} w={W} h={H} />
    <Strata f={f} speed={10} bands={GNEISS} amp={22} seed={8} x0={60} x1={420} />
    <Strata f={f} speed={10} bands={GNEISS} amp={22} seed={8} x0={660} x1={1020} />
    <rect x={420} y={0} width={240} height={H} fill={C.ink} />
    <rect x={528} y={0} width={24} height={H} fill={C.cream} opacity={0.5} />
    <Plaque x={540} y={230} text="ALL THE WAY THROUGH" size={56} bg={C.ink} fg={C.cream} />
    <Tick x={540} y={1210} pxPerM={430} frame={f} pose="hold" expression="neutral" expressionTo="happy" expressionT={ez(f, 4, 20)} facing={1} />
    <g transform={`translate(${540 + 150} ${1210 - 430 * 0.95})`}>
      <rect x={-34} y={-70} width={68} height={140} rx={30} fill={C.orange} stroke={C.ink} strokeWidth={6} />
      <rect x={-34} y={-30} width={68} height={22} fill={C.gold} />
      <rect x={-34} y={20} width={68} height={22} fill={C.teal} />
    </g>
  </g>
);

const Dusk: React.FC<{ f: number; hy?: number }> = ({ f, hy = 1000 }) => (
  <g>
    <Sky stops={["#0F3B4F", "#1E6678", "#E3813F", "#F6B45A"]} x={0} y={0} w={W} h={hy + 40} />
    <Bloom x={760} y={hy - 60} r={700} color={C.gold} strength={0.75} core={60} coreColor="#FFF1C2" />
    <CloudRack f={f} n={4} x0={-420} x1={1500} y0={170} y1={hy - 300} size={118} speed={2.2} body="#2C8BA0" under="#0F3B4F" top={C.gold} seed={3} />
    <path d={`M-60 ${hy - 70} Q200 ${hy - 150} 460 ${hy - 70} T1000 ${hy - 60} L1140 ${hy + 60} L-60 ${hy + 60} Z`} fill="#3F7F8E" />
    <rect x={0} y={hy} width={W} height={H - hy} fill={C.ice} />
  </g>
);

/** l - the surveyor walks out to go and look. */
const l: Shot = ({ f, n }) => {
  const x = mix(-120, 560, ez(f, 0, n));
  return (
    <g>
      <Dusk f={f} />
      <Chips f={f} n={14} y0={1030} y1={1260} color={C.foam} speed={16} opacity={0.6} seed={2} />
      <Tick x={x} y={1190} pxPerM={430} frame={f} walk={f / 26} staff pose="stand" expression="determined" facing={1} />
      <Plaque x={540} y={260} text="ONLY BY GOING" size={84} bg={C.ink} fg={C.amber} scale={0.85 + 0.15 * ez(f, 4, 14)} />
    </g>
  );
};

/** m - proud close-up. */
const m: Shot = ({ f }) => (
  <g>
    <Sky stops={["#E3813F", "#F6B45A", "#FFCF73"]} x={0} y={0} w={W} h={H} />
    <g transform={`translate(540 700) rotate(${f * 0.6})`} opacity={0.3}>
      {Array.from({ length: 14 }, (_, i) => (
        <path key={i} d={`M0 0 L${900 * Math.cos((i * 2 * Math.PI) / 14 - 0.1)} ${900 * Math.sin((i * 2 * Math.PI) / 14 - 0.1)} L${900 * Math.cos((i * 2 * Math.PI) / 14 + 0.1)} ${900 * Math.sin((i * 2 * Math.PI) / 14 + 0.1)} Z`} fill={C.cream} />
      ))}
    </g>
    <Chips f={f} n={10} y0={150} y1={1100} color={C.cream} speed={9} opacity={0.5} seed={11} />
    <Tick x={420} y={1230} pxPerM={560} frame={f} pose="cheer" expression="proud" facing={1} />
    <Plaque x={800} y={300} text="GO AND SEE" size={76} bg={C.ink} fg={C.cream} />
  </g>
);

const Split: React.FC<{ f: number }> = ({ f }) => {
  const idL = "sl" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const idR = "sr" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <g>
      <clipPath id={idL}>
        <rect x={0} y={0} width={536} height={H} />
      </clipPath>
      <clipPath id={idR}>
        <rect x={544} y={0} width={536} height={H} />
      </clipPath>
      <g clipPath={`url(#${idL})`}>
        <Sky stops={["#0A3C4C", "#146A6C"]} x={0} y={0} w={W} h={H} />
        <rect x={0} y={760} width={W} height={36} fill={C.ink} />
        <Glow x={270} y={778} r={300} color={C.amber} f={f} strength={0.9} period={16} />
        <path d={`M-40 300 L270 778 L580 300`} stroke={C.amber} strokeWidth={9} fill="none" strokeDasharray="28 18" strokeDashoffset={-f * 5} />
      </g>
      <g clipPath={`url(#${idR})`}>
        <Strata f={f} speed={9} bands={GNEISS} amp={20} seed={6} />
      </g>
      <rect x={536} y={0} width={8} height={H} fill={C.cream} />
    </g>
  );
};

/** n - split frame: the echo on the left, plain gneiss on the right. */
const n_: Shot = ({ f }) => (
  <g>
    <Split f={f} />
    <Plaque x={270} y={420} text="ECHO" size={78} bg={C.ink} fg={C.amber} />
    <Plaque x={810} y={420} text="JUST GNEISS" size={58} bg={C.ink} fg={C.cream} />
    <Plaque x={540} y={1050} text="BUT THE WAVES BOUNCED" size={52} bg={C.ink} fg={C.cream} />
  </g>
);

/** o - the echo again: rings rebound off the line; Tick startles. */
const o: Shot = ({ f }) => {
  const yL = 760;
  return (
    <g>
      <Sky stops={["#0A3C4C", "#11707A", "#1FA69A"]} x={0} y={0} w={W} h={H} />
      <Strata f={f} speed={-6} bands={[[160, "#146A6C"], [120, "#1FA69A"], [140, "#0E4658"]]} amp={18} seed={5} y0={0} y1={yL - 20} />
      {[0, 1, 2, 3].map((i) => {
        const r = (f * 14 + i * 180) % 720;
        return <path key={i} d={`M${540 - r} ${yL} A${r} ${r} 0 0 1 ${540 + r} ${yL}`} stroke={C.cream} strokeWidth={14} fill="none" opacity={0.8 * (1 - r / 720)} />;
      })}
      <Glow x={540} y={yL} r={620} color={C.amber} f={f} strength={0.9} period={14} />
      <rect x={0} y={yL - 22} width={W} height={44} fill={C.ink} />
      <line x1={0} x2={W} y1={yL - 22} y2={yL - 22} stroke={C.amber} strokeWidth={6} strokeDasharray="26 16" strokeDashoffset={-f * 4} />
      <Strata f={f} speed={6} bands={GNEISS} amp={20} seed={2} y0={yL + 22} />
      <Tick x={200} y={1230} pxPerM={380} frame={f} pose="cover-ears" expression="surprised" facing={1} />
    </g>
  );
};

/** p - the line becomes a question mark. */
const p: Shot = ({ f, n }) => {
  const k = ez(f, 4, n - 2);
  return (
    <g>
      <Sky stops={["#0A3C4C", "#11707A", "#1FA69A"]} x={0} y={0} w={W} h={H} />
      <Streamers f={f} n={8} x0={-300} x1={1400} y0={150} y1={1150} len={400} width={24} speed={5} color={C.mint} opacity={0.3} slope={0.04} seed={4} />
      <path d="M-40 260 L540 760 L1120 260" stroke={C.amber} strokeWidth={12} fill="none" strokeDasharray="30 20" strokeDashoffset={-f * 5} />
      <text x={540} y={1010} textAnchor="middle" style={{ fontFamily: FONT, fontWeight: 800, fontSize: 820, fill: "none", stroke: C.amber, strokeWidth: 24, strokeDasharray: "30 16", strokeDashoffset: -f * 3 }} opacity={k}>
        ?
      </text>
      <Glow x={540} y={760} r={300} color={C.cream} f={f} strength={0.6} period={14} />
      <T x={540} y={1180} text="BOUNCING OFF WHAT?" size={70} opacity={ez(f, 10, 18)} />
    </g>
  );
};

/** q - end card. */
const q: Shot = ({ f }) => (
  <EndShot f={f} stops={["#0A3C4C", "#11707A", "#1FA69A"]} q={["BOUNCING OFF", "WHAT?"]}>
    <path d="M80 250 L170 340 L260 250" stroke={C.amber} strokeWidth={10} fill="none" strokeDasharray="22 14" strokeDashoffset={-f * 4} strokeLinecap="round" />
  </EndShot>
);

export const ShortS43 = makeShort(timeline, [[a, b, c], [d, e], [f_], [g, h], [i_, j, k_], [l, m], [n_, o], [p], [q]]);
