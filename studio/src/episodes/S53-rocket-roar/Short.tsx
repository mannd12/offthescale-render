import React, { useId } from "react";
import { Counter, Sky, Tick } from "../../lib/illustrated";
import { buildTimeline, VoLine } from "../../lib/timeline";
import { C, Chips, EndShot, Glow, Plaque, T, W, H, Shot, ez, makeShort, mix, ramp } from "../S41-dig-plate/vkit";
import { Qmark } from "../S46-peak-seafloor/kit46";
import { Burst, Cross, bob, shake } from "../S51-phantom-guns/kit51";
import { familyOf } from "../L13-loudest-sound/families";
import { JetEngine, SaturnV } from "../L13-loudest-sound/props";
import { PowerMeter } from "../L13-loudest-sound/PowerMeter";
import { Rings } from "../L13-loudest-sound/sound";
import vo from "./vo.json";

/**
 * S53 - did the Saturn V's sound melt concrete? (episodes/S53-rocket-roar). For L13, answered at 3:20. Vertical 1080x1920.
 * Numbers (sources.md, L13 rows): #14 about 203 dB overall sound output (physics model matched 1960s data, 2022 paper),
 * 170 dB = about ten aircraft engines, 200 dB = ten thousand; #9 every ten decibels is ten times the energy.
 * That 203 is sound POWER (not pressure at anyone's ear) and what really scorched the pad are withheld.
 */
export const timeline = buildTimeline(vo as VoLine[]);

const EMBER = familyOf("ember");
const DAWN = ["#4B2A8C", "#E4572E", "#FFC83D"];

const Puffs: React.FC<{ f: number; x: number; y: number; n?: number; spread?: number }> = ({ f, x, y, n = 9, spread = 260 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const p = ((f * 0.035 + i / n) % 1 + 1) % 1;
      const side = i % 2 ? 1 : -1;
      return <circle key={i} cx={x + side * spread * p * (0.4 + (i % 3) * 0.3)} cy={y - 60 - p * 200} r={40 + p * 110} fill={C.cream} opacity={0.75 * (1 - p)} />;
    })}
  </g>
);

const Pad: React.FC<{ y?: number; glow?: number }> = ({ y = 1250, glow = 0 }) => (
  <g>
    <rect x={0} y={y} width={W} height={700} fill="#3A2412" />
    <rect x={120} y={y} width={840} height={60} rx={16} fill="#B9B3A6" />
    <rect x={120} y={y} width={840} height={60} rx={16} fill={C.orange} opacity={glow} />
  </g>
);

/** a1 - dawn launch pad: the Saturn V towers from the bottom of the frame. */
const a1: Shot = ({ f }) => (
  <g>
    <Sky stops={DAWN} x={0} y={0} w={W} h={H} />
    <Glow x={540} y={1000} r={760} color={C.gold} f={f} strength={0.6} />
    <Pad />
    <SaturnV x={540} y={1250} h={1700} family={EMBER} />
    <Puffs f={f} x={540} y={1250} />
    <Tick x={190} y={1250} pxPerM={240} frame={f} pose="point" expression="surprised" facing={1} />
    <Plaque x={540} y={190} text="SATURN V" size={120} bg={C.ink} fg={C.amber} />
  </g>
);

/** a2 - tilt up the rocket. */
const a2: Shot = ({ f, n }) => {
  const k = ez(f, 0, n);
  return (
    <g>
      <Sky stops={DAWN} x={0} y={0} w={W} h={H} />
      <Chips f={f} n={10} y0={100} y1={1200} color={C.gold} speed={8} opacity={0.4} seed={4} />
      <SaturnV x={540} y={mix(1250, 2300, k)} h={2400} family={EMBER} />
    </g>
  );
};

/** a3 - lift-off: the rocket climbs, flame and smoke at the pad, the pad glowing orange. */
const a3: Shot = ({ f, n }) => {
  const k = ez(f, 0, n);
  const y = mix(1250, 700, k);
  return (
    <g transform={shake(f, 0, n, 12)}>
      <Sky stops={DAWN} x={0} y={0} w={W} h={H} />
      <Pad glow={0.5 + 0.3 * Math.sin(f / 2)} />
      <Puffs f={f * 2} x={540} y={1250} n={14} spread={420} />
      <path d={`M${500} ${y} L${540} ${y + 380 + 40 * Math.sin(f)} L${580} ${y} Z`} fill={C.amber} />
      <path d={`M${520} ${y} L${540} ${y + 220 + 30 * Math.sin(f * 1.3)} L${560} ${y} Z`} fill={C.cream} />
      <SaturnV x={540} y={y} h={1500} family={EMBER} />
    </g>
  );
};

/** a4 - Tick and the rumour. */
const a4: Shot = ({ f }) => (
  <g>
    <Sky stops={["#4B2A8C", "#7C3FA8", "#E4572E"]} x={0} y={0} w={W} h={H} />
    <Chips f={f} n={10} y0={100} y1={1100} color={C.gold} speed={9} opacity={0.4} seed={6} />
    <rect x={100} y={200} width={880} height={560} rx={70} fill={C.cream} stroke={C.ink} strokeWidth={12} transform={`rotate(${-3 + Math.sin(f / 8) * 1.5} 540 480)`} />
    <T x={540} y={350} text="RUMOUR" size={72} color={C.verm} halo={C.cream} />
    <T x={540} y={480} text="MELTED CONCRETE" size={72} color={C.ink} halo={C.cream} />
    <T x={540} y={610} text="GRASS ON FIRE, A MILE AWAY" size={50} color={C.ink} halo={C.cream} />
    <Tick x={330} y={1290} pxPerM={300} frame={f} pose="shrug" expression="thinking" facing={1} />
  </g>
);

/** b1 - a magnifier sweeps over the pad. */
const b1: Shot = ({ f }) => (
  <g>
    <Sky stops={["#0A3C4C", "#11707A", "#66BEAD"]} x={0} y={0} w={W} h={H} />
    <rect x={0} y={1150} width={W} height={800} fill="#3A2412" />
    <SaturnV x={540} y={1150} h={900} family={EMBER} />
    <g transform={`translate(${mix(200, 880, ez(f, 0, 50))} ${700 + bob(f, 30, 40)})`}>
      <circle r={190} fill="rgba(230,248,255,0.25)" stroke={C.amber} strokeWidth={30} />
      <path d="M135 135 L300 300" stroke={C.amber} strokeWidth={42} strokeLinecap="round" />
    </g>
    <Tick x={190} y={1260} pxPerM={300} frame={f} pose="hold" expression="determined" facing={1} />
    <Tick x={880} y={1260} pxPerM={300} frame={f} pose="point" expression="thinking" facing={-1} seed={2} />
  </g>
);

/** b2 - the calendar flips to 2022. */
const b2: Shot = ({ f, n }) => (
  <g>
    <Sky stops={["#4B2A8C", "#7C3FA8", "#E4572E"]} x={0} y={0} w={W} h={H} />
    <rect x={110} y={300} width={860} height={640} rx={70} fill={C.cream} stroke={C.ink} strokeWidth={14} />
    <rect x={110} y={300} width={860} height={150} rx={70} fill={C.verm} />
    <T x={540} y={800} text={`${Math.round(mix(1960, 2022, ez(f, 0, n - 6)))}`} size={300} color={C.ink} halo={C.cream} />
    <Tick x={900} y={1290} pxPerM={200} frame={f} pose="point" expression="happy" facing={-1} />
  </g>
);

/** c1 - a journal cover slides in. */
const c1: Shot = ({ f }) => {
  const x = mix(1400, 540, ez(f, 0, 10));
  return (
    <g>
      <Sky stops={["#0A3C4C", "#11707A", "#1FA69A"]} x={0} y={0} w={W} h={H} />
      <g transform={`translate(${x - 540} 0) rotate(${-4 + ez(f, 0, 10) * 4} ${x} 700)`}>
        <rect x={x - 340} y={260} width={680} height={900} rx={40} fill="#7A3A22" stroke={C.ink} strokeWidth={12} />
        <rect x={x - 290} y={330} width={580} height={240} rx={20} fill={C.cream} />
        <T x={x} y={420} text="JOURNAL OF THE" size={44} color={C.ink} halo={C.cream} />
        <T x={x} y={480} text="ACOUSTICAL SOCIETY" size={44} color={C.ink} halo={C.cream} />
        <T x={x} y={540} text="OF AMERICA" size={44} color={C.ink} halo={C.cream} />
        {[640, 720, 800, 880, 960].map((yy) => (
          <rect key={yy} x={x - 260} y={yy} width={520} height={18} rx={9} fill={C.apricot} />
        ))}
      </g>
    </g>
  );
};

/** c2 - Tick flips pages; an amber line rings in. */
const c2: Shot = ({ f }) => (
  <g>
    <Sky stops={["#0A3C4C", "#11707A", "#1FA69A"]} x={0} y={0} w={W} h={H} />
    <rect x={150} y={330} width={780} height={760} rx={30} fill={C.cream} stroke={C.ink} strokeWidth={12} />
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={210} y={400 + i * 90} width={660 - i * 60} height={26} rx={13} fill={C.apricot} />
    ))}
    <g transform={`translate(540 700) scale(${Math.cos((f / 12) * Math.PI) } 1) translate(-540 -700)`}>
      <rect x={150} y={330} width={780} height={760} rx={30} fill={C.foam} stroke={C.ink} strokeWidth={10} opacity={0.9} />
    </g>
    <rect x={210} y={880} width={660} height={60} rx={30} fill={C.amber} opacity={0.5 + 0.5 * Math.sin(f / 4)} />
    <Tick x={220} y={1260} pxPerM={400} frame={f} pose="point" expression="happy" facing={1} />
  </g>
);

/** c3 - PUBLISHED stamp. */
const c3: Shot = ({ f }) => (
  <g>
    <Sky stops={["#4B2A8C", "#7C3FA8", "#E4572E"]} x={0} y={0} w={W} h={H} />
    <Chips f={f} n={12} y0={100} y1={1100} color={C.gold} speed={10} opacity={0.4} seed={8} />
    <g transform={`translate(540 620) rotate(-8) scale(${ez(f, 0, 6) + 0.06 * Math.sin(f / 3)})`}>
      <rect x={-420} y={-170} width={840} height={340} rx={50} fill="none" stroke={C.amber} strokeWidth={28} />
      <T x={0} y={50} text="PUBLISHED" size={170} color={C.amber} />
    </g>
    <T x={440} y={1000} text="A 2022 ESTIMATE" size={72} color={C.cream} />
    <Tick x={930} y={1290} pxPerM={260} frame={f} pose="cheer" expression="proud" facing={-1} />
  </g>
);

/** d1 - the power meter's needle sweeps up from 150. */
const d1: Shot = ({ f, n }) => (
  <g>
    <Sky stops={["#4B2A8C", "#7C3FA8", "#E4572E"]} x={0} y={0} w={W} h={H} />
    <PowerMeter x={540} y={640} r={400} value={mix(150, 196, ez(f, 0, n))} family={EMBER} frame={f} title="SOUND OUTPUT" readout="" />
  </g>
);

/** d2 - it locks on 203 with a flash; Tick jumps back. */
const d2: Shot = ({ f }) => {
  const v = 203 - 3 * Math.max(0, 1 - f / 8) * Math.cos(f);
  return (
    <g transform={shake(f, 0, 10, 14)}>
      <Sky stops={["#4B2A8C", "#E4572E", "#FFC83D"]} x={0} y={0} w={W} h={H} />
      <PowerMeter x={540} y={640} r={400} value={v} family={EMBER} frame={f} title="SOUND OUTPUT" readout="" />
      <Plaque x={540} y={1130} text="203 dB" size={96} bg={C.ink} fg={C.amber} w={420} />
      <Burst x={540} y={640} r0={440} r1={440 + 200 * Math.max(0, 1 - f / 12)} n={20} color={C.amber} opacity={Math.max(0, 1 - f / 12)} width={18} />
      <Tick x={mix(240, 130, ez(f, 0, 8))} y={1260} pxPerM={400} frame={f} pose="shield" expression="scared" facing={1} />
    </g>
  );
};

/** d3 - rings pour off the pad around the big readout. */
const d3: Shot = ({ f }) => (
  <g>
    <Sky stops={DAWN} x={0} y={0} w={W} h={H} />
    <Pad />
    <Rings f={f} cx={540} cy={1120} period={12} speed={16} maxR={1300} width={14} color={C.amber} squash={0.7} glow={false} />
    <SaturnV x={540} y={1250} h={1000} family={EMBER} />
    <Plaque x={540} y={260} text="203 dB" size={190} bg={C.ink} fg={C.amber} w={620} scale={1 + 0.04 * Math.sin(f / 3)} />
  </g>
);

const GraphBase: React.FC<{ f: number; pts?: number }> = ({ f, pts = 9 }) => (
  <g>
    <Sky stops={["#0A3C4C", "#11707A", "#1FA69A"]} x={0} y={0} w={W} h={H} />
    <rect x={110} y={330} width={860} height={760} rx={50} fill={C.ink} opacity={0.9} />
    <path d="M190 1010 V420 M190 1010 H900" stroke={C.cream} strokeWidth={10} strokeLinecap="round" />
    <T x={540} y={290} text="1960s DATA" size={64} color={C.cream} />
    {Array.from({ length: pts }, (_, i) => {
      const x = 260 + i * 78;
      const y = 930 - Math.pow(i / 8, 0.6) * 430 + Math.sin(i * 2.1) * 26;
      return <circle key={i} cx={x} cy={y} r={20 + 3 * Math.sin(f / 4 + i)} fill={C.amber} stroke={C.ink} strokeWidth={6} />;
    })}
  </g>
);
const curvePts = Array.from({ length: 9 }, (_, i) => [260 + i * 78, 930 - Math.pow(i / 8, 0.6) * 430] as [number, number]);
const curveD = "M" + curvePts.map(([x, y]) => `${x} ${y}`).join(" L");

/** e1 - the few surviving data points. */
const e1: Shot = ({ f }) => (
  <g>
    <GraphBase f={f} />
    <Tick x={850} y={1260} pxPerM={350} frame={f} pose="point" expression="thinking" facing={-1} />
    <Plaque x={420} y={1160} text="LITTLE DATA" size={70} bg={C.ink} fg={C.amber} />
  </g>
);

/** e2 - the model curve draws over the points and snaps on. */
const e2: Shot = ({ f, n }) => (
  <g>
    <GraphBase f={f} />
    <path d={curveD} pathLength={1} strokeDasharray={`${ez(f, 0, n - 6)} 1`} stroke={C.foam} strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <Plaque x={600} y={1160} text="PHYSICS MODEL" size={66} bg={C.ink} fg={C.foam} scale={ez(f, 2, 10)} />
    <Tick x={130} y={1290} pxPerM={300} frame={f} pose="cheer" expression="happy" facing={1} />
  </g>
);

/** e3 - the points check off one by one. */
const e3: Shot = ({ f, n }) => (
  <g>
    <GraphBase f={f} />
    <path d={curveD} stroke={C.foam} strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    {curvePts.map(([x, y], i) => {
      const on = ramp(f, i * 3, i * 3 + 4);
      return <path key={i} d={`M${x - 20} ${y - 70} l20 24 l36 -48`} stroke={C.green} strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={on} />;
    })}
    <Plaque x={420} y={1160} text={f > n * 0.6 ? "IT MATCHES" : "CHECKING..."} size={66} bg={C.ink} fg={C.green} />
    <Tick x={930} y={1290} pxPerM={300} frame={f} pose="point" expression="proud" facing={-1} />
  </g>
);

/** f1 - ten jet engines spin in a row. */
const f1: Shot = ({ f }) => (
  <g>
    <Sky stops={["#0A3C4C", "#11707A", "#66BEAD"]} x={0} y={0} w={W} h={H} />
    {Array.from({ length: 10 }, (_, i) => (
      <JetEngine key={i} x={170 + (i % 5) * 185} y={420 + Math.floor(i / 5) * 230} r={82} f={f + i * 3} rpm={16} family={EMBER} />
    ))}
    <Plaque x={540} y={830} text="170 dB = 10 ENGINES" size={64} bg={C.ink} fg={C.amber} scale={ez(f, 0, 8)} />
    <Tick x={540} y={1300} pxPerM={200} frame={f} pose="cheer" expression="surprised" facing={1} />
  </g>
);

/** f2 - the row multiplies into a grid of ten thousand dots. */
const f2: Shot = ({ f, n }) => {
  const id = "dots" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const k = ez(f, 0, n - 4);
  return (
    <g>
      <Sky stops={["#4B2A8C", "#7C3FA8", "#E4572E"]} x={0} y={0} w={W} h={H} />
      <defs>
        <pattern id={id} width={24} height={24} patternUnits="userSpaceOnUse" patternTransform={`translate(0 ${f * 2})`}>
          <circle cx={12} cy={12} r={7} fill={C.cream} />
        </pattern>
      </defs>
      <rect x={60} y={330} width={960} height={mix(160, 800, k)} rx={40} fill={`url(#${id})`} opacity={0.95} />
      <Plaque x={540} y={1250} text="200 dB = 10,000" size={76} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** f3 - Tick lost in the grid of engines. */
const f3: Shot = ({ f }) => {
  const id = "dots" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <g>
      <Sky stops={["#4B2A8C", "#7C3FA8", "#E4572E"]} x={0} y={0} w={W} h={H} />
      <defs>
        <pattern id={id} width={40} height={40} patternUnits="userSpaceOnUse" patternTransform={`translate(${f * 3} 0)`}>
          <circle cx={20} cy={20} r={13} fill="#5E6B72" stroke={C.cream} strokeWidth={4} />
        </pattern>
      </defs>
      <rect x={0} y={0} width={W} height={1280} fill={`url(#${id})`} />
      <Tick x={540} y={1180} pxPerM={380} frame={f} pose="shrug" expression="surprised" facing={1} />
    </g>
  );
};

/** g1 - a ladder of +10 dB steps, each stamping x10. */
const g1: Shot = ({ f, n }) => (
  <g>
    <Sky stops={["#0A3C4C", "#11707A", "#1FA69A"]} x={0} y={0} w={W} h={H} />
    {[0, 1, 2].map((i) => {
      const on = ramp(f, i * (n / 3.4), i * (n / 3.4) + 5);
      return (
        <g key={i} opacity={on} transform={`translate(0 ${(1 - on) * 80})`}>
          <rect x={120 + i * 40} y={900 - i * 270} width={760 - i * 80} height={200} rx={50} fill={C.ink} />
          <T x={300 + i * 40} y={1030 - i * 270} text="+10 dB" size={90} color={C.amber} align="middle" />
          <T x={700 + i * 20} y={1030 - i * 270} text={`x${Math.pow(10, i + 1).toLocaleString("en-US")}`} size={90} color={C.cream} />
        </g>
      );
    })}
    <Tick x={975} y={1290} pxPerM={250} frame={f} pose="point" expression="happy" facing={-1} />
  </g>
);

/** g2 - the needle bounces past 200 to 203. */
const g2: Shot = ({ f }) => (
  <g transform={shake(f, 4, 10, 10)}>
    <Sky stops={["#4B2A8C", "#E4572E", "#FFC83D"]} x={0} y={0} w={W} h={H} />
    <PowerMeter x={540} y={640} r={400} value={200 + 3 * ez(f, 0, 10) + 1.4 * Math.sin(f / 2) * Math.max(0, 1 - f / 16)} family={EMBER} frame={f} title="SOUND OUTPUT" readout="" />
    <Plaque x={540} y={1130} text="PAST 10,000" size={96} bg={C.ink} fg={C.amber} />
  </g>
);

/** g3 - Tick at the meter, +10 dB = 10x on a plate. */
const g3: Shot = ({ f }) => (
  <g>
    <Sky stops={["#0A3C4C", "#11707A", "#66BEAD"]} x={0} y={0} w={W} h={H} />
    <Rings f={f} cx={540} cy={440} period={14} speed={14} maxR={900} width={12} color={C.amber} glow={false} />
    <T x={540} y={460} text="+10 dB" size={250} color={C.amber} />
    <T x={540} y={690} text="= 10x" size={250} color={C.cream} />
    <Tick x={540} y={1290} pxPerM={260} frame={f} pose="cheer" expression="surprised" facing={1} />
  </g>
);

/** h1 - a cracked concrete slab under a chalk question mark. */
const h1: Shot = ({ f }) => (
  <g>
    <Sky stops={["#4B2A8C", "#7C3FA8", "#E4572E"]} x={0} y={0} w={W} h={H} />
    <rect x={90} y={1020} width={900} height={200} rx={24} fill="#B9B3A6" stroke={C.ink} strokeWidth={12} />
    <path d="M300 1020 L360 1100 L320 1150 L400 1220 M680 1020 L640 1090 L700 1150" stroke={C.ink} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <Qmark f={f} x={540} y={900} size={760} />
    <Plaque x={540} y={190} text="DID IT MELT IT?" size={96} bg={C.ink} fg={C.amber} />
  </g>
);

const h2: Shot = ({ f }) => (
  <EndShot f={f} stops={["#4B2A8C", "#7C3FA8", "#E4572E"]} q={["DID IT MELT", "CONCRETE?"]} />
);

export const ShortS53 = makeShort(timeline, [[a1, a2, a3, a4], [b1, b2], [c1, c2, c3], [d1, d2, d3], [e1, e2, e3], [f1, f2, f3], [g1, g2, g3], [h1, h2]]);
