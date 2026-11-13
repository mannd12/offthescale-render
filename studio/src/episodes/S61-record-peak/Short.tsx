import React from "react";
import { Sky, Tick } from "../../lib/illustrated";
import { buildTimeline, VoLine } from "../../lib/timeline";
import { EndShot, Rain, Chips, W, H, Shot, makeShort } from "../S41-dig-plate/vkit";
import { Qmark } from "../S46-peak-seafloor/kit46";
import { Balloon, Bracket, Probe, Stamp, Stopwatch } from "../L15-space-jump/props";
import { AirCube } from "../L15-space-jump/props";
import { SkyColumn } from "../L15-space-jump/sky";
import { Trace } from "../L15-space-jump/props";
import { Arrows, BG_STUDIO, C, Count, HBar, MarkedDial, Plaque, Rings, Watch, ez, mix } from "./kit61";
import vo from "./vo.json";

/**
 * S61 - Mach 1.25, then it stopped (episodes/S61-record-peak). For L15, answered at 5:41. Vertical 1080x1920.
 * Numbers (sources.md, L15 rows): #4 38,969 m ("almost 39 km"), sound at 34 s, top speed 1,357.6 km/h = Mach 1.25 at
 * 50 s, free fall 4:20, gap 16 s (arithmetic 50 - 34); #11/#12 air under 4 g near 40 km, ~300x thinner than sea level.
 * Withheld: what pushed back (the thickening air). The faller is only the probe icon.
 */
export const timeline = buildTimeline(vo as VoLine[]);

const SK: React.FC<{ f: number; a: number; b: number; streak?: number }> = ({ f, a, b, streak = 0 }) => <SkyColumn f={f} altTop={a} altBottom={b} x={0} y={0} w={W} h={H} streak={streak} />;

/** a - the balloon at the top; the probe rides its rail. */
const a1: Shot = ({ f }) => (
  <g>
    <SK f={f} a={44} b={34} />
    <Balloon x={470} y={820} size={430} f={f} />
    <Probe x={640} y={800} size={130} f={f} lamp={false} />
    <Plaque x={540} y={1080} text="2012" size={130} bg={C.ink} fg={C.amber} />
  </g>
);
const a2: Shot = ({ f, n }) => {
  const k = ez(f, 4, n - 2);
  return (
    <g>
      <SK f={f} a={mix(44, 40, k)} b={mix(34, 30, k)} streak={20 * k} />
      <Balloon x={470} y={mix(820, -500, k)} size={430} f={f} />
      <Probe x={mix(640, 600, k)} y={mix(800, 1000, k)} size={mix(130, 280, k)} f={f} lamp={false} trail={160 * k} />
      <Plaque x={540} y={190} text="ALMOST 39 KM" size={96} bg={C.ink} fg={C.amber} />
    </g>
  );
};
const a3: Shot = ({ f }) => (
  <g>
    <SK f={f} a={40} b={30} streak={60} />
    <Probe x={540} y={780 + Math.sin(f / 5) * 12} size={400} f={f} trail={320} />
    <Plaque x={540} y={190} text="FELIX BAUMGARTNER" size={66} bg={C.ink} fg={C.cream} />
  </g>
);

/** b - the air: a dense sea-level cube, a nearly empty one near 40 km, both side by side. */
const b1: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
    <AirCube x={230} y={520} size={520} n={150} f={f} speed={7} />
    <Plaque x={540} y={190} text="1 CUBIC METRE" size={84} bg={C.ink} fg={C.cream} />
    <Plaque x={540} y={1120} text="SEA LEVEL: 1.225 KG" size={64} bg={C.ink} fg={C.amber} scale={ez(f, 4, 12)} />
  </g>
);
const b2: Shot = ({ f }) => (
  <g>
    <Sky stops={["#0B1B3A", "#1B3A6B", "#2A6FA8"]} x={0} y={0} w={W} h={H} />
    <AirCube x={230} y={520} size={520} n={5} f={f} speed={7} />
    <Plaque x={540} y={190} text="NEAR 40 KM UP" size={84} bg={C.ink} fg={C.cream} />
    <Plaque x={540} y={1120} text="UNDER 4 G" size={112} bg={C.ink} fg={C.amber} scale={ez(f, 4, 12)} />
  </g>
);
const b3: Shot = ({ f, n }) => (
  <g>
    <Sky stops={["#0A3C4C", "#11707A", "#1FA69A"]} x={0} y={0} w={W} h={H} />
    <AirCube x={70} y={560} size={300} n={90} f={f} speed={6} />
    <AirCube x={520} y={560} size={300} n={3} f={f} speed={6} seed={7} />
    <Plaque x={540} y={190} text="ABOUT 300X THINNER" size={68} bg={C.ink} fg={C.amber} scale={ez(f, 0, 10)} />
    <Plaque x={250} y={1010} text="1.225 KG" size={52} bg={C.ink} fg={C.cream} />
    <Plaque x={700} y={1010} text="UNDER 4 G" size={52} bg={C.ink} fg={C.cream} />
    <Plaque x={540} y={1130} text="SAME CUBE, 300X LESS" size={50} bg={C.ink} fg={C.cream} opacity={ez(f, 6, n - 6)} />
  </g>
);

/** c - the needle climbs past the SOUND mark while a clock reaches 34 S. */
const c1: Shot = ({ f, n }) => (
  <g>
    <SK f={f} a={40} b={30} streak={14} />
    <MarkedDial x={540} y={720} r={320} v={ez(f, 0, n) * 0.5} m={0.724} label="SOUND" f={f} />
    <Count x={540} y={190} f={f} a={0} b={14} f1={n} unit=" S" w={330} size={130} />
  </g>
);
const c2: Shot = ({ f, n }) => (
  <g>
    <SK f={f} a={38} b={28} streak={22} />
    <MarkedDial x={540} y={720} r={320} v={mix(0.5, 0.76, ez(f, 0, n - 6))} m={0.724} label="SOUND" f={f} />
    <Count x={540} y={190} f={f} a={14} b={34} f1={n - 8} unit=" S" w={330} size={130} />
  </g>
);
const c3: Shot = ({ f }) => (
  <g>
    <SK f={f} a={36} b={26} streak={40} />
    <Rings x={540} y={560} f={f} color={C.foam} max={520} />
    <Probe x={540} y={720} size={380} f={f} trail={260} />
    <Plaque x={540} y={190} text="34 S" size={130} bg={C.ink} fg={C.amber} w={330} />
    <Plaque x={540} y={1100} text="SOUND BARRIER" size={72} bg={C.ink} fg={C.cream} rot={-3} scale={ez(f, 2, 10)} />
  </g>
);

/** d - top speed at 50 S: 1,357.6 km/h. */
const d1: Shot = ({ f, n }) => (
  <g>
    <SK f={f} a={34} b={24} streak={30} />
    <MarkedDial x={540} y={760} r={320} v={mix(0.76, 0.905, ez(f, 0, n - 6))} m={0.724} label="SOUND" f={f} shake={ez(f, n - 10, n) * 0.02} />
    <Count x={540} y={190} f={f} a={1086} b={1357.6} d={1} f1={n - 8} unit=" KM/H" w={860} size={100} />
  </g>
);
const d2: Shot = ({ f, n }) => (
  <g>
    <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
    <Watch x={540} y={680} r={310} k={ez(f, 0, n - 6) * (50 / 60)} full={60} plate={`${Math.round(ez(f, 0, n - 6) * 50)} S`} f={f} />
    <Plaque x={540} y={190} text="TOP SPEED" size={116} bg={C.ink} fg={C.amber} />
  </g>
);
const d3: Shot = ({ f }) => (
  <g>
    <SK f={f} a={32} b={22} streak={60} />
    <Probe x={540} y={760 + Math.sin(f / 4) * 10} size={420} f={f} trail={340} />
    <Plaque x={540} y={190} text="1,357.6 KM/H" size={100} bg={C.ink} fg={C.amber} w={860} />
    <Plaque x={540} y={1110} text="AT 50 S" size={96} bg={C.ink} fg={C.cream} />
  </g>
);

/** e - Mach 1.25 and the 4:20 stopwatch. */
const e1: Shot = ({ f }) => (
  <g>
    <SK f={f} a={30} b={20} streak={50} />
    <Probe x={540} y={1000 + Math.sin(f / 4) * 14} size={440} f={f} trail={300} />
    <Stamp x={540} y={560} text="MACH 1.25" age={f} size={118} rotate={-6} />
  </g>
);
const e2: Shot = ({ f, n }) => (
  <g>
    <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
    <Stopwatch x={540} y={700} r={330} f={f} end={260} t={ez(f, 0, n - 8)} />
    <Plaque x={540} y={190} text="FREE FALL" size={110} bg={C.ink} fg={C.cream} />
  </g>
);
const e3: Shot = ({ f }) => (
  <g>
    <SK f={f} a={28} b={18} streak={50} />
    <Rain f={f} n={14} x0={60} x1={1020} color={C.foam} speed={30} len={300} width={10} opacity={0.4} seed={3} />
    <Probe x={540} y={760 + Math.sin(f / 4) * 12} size={400} f={f} trail={260} />
    <Plaque x={540} y={190} text="4:20" size={160} bg={C.ink} fg={C.amber} w={400} />
    <Plaque x={540} y={1110} text="MACH 1.25" size={92} bg={C.ink} fg={C.cream} />
  </g>
);

/** g - the gap on a timeline: 0 S .. 34 S (sound) .. 50 S (top speed) = 16 S more. */
const X0 = 100;
const PXS = 17.6;
const g1: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 6);
  return (
    <g>
      <Sky stops={["#0B1B3A", "#1B3A6B", "#2A6FA8"]} x={0} y={0} w={W} h={H} />
      <HBar x={X0} y={820} w={880} k={(k * 34) / 50} />
      <line x1={X0 + 34 * PXS} y1={740} x2={X0 + 34 * PXS} y2={900} stroke={C.cream} strokeWidth={10} />
      <Plaque x={X0 + 34 * PXS} y={1000} text="SOUND" size={56} bg={C.ink} fg={C.cream} />
      <Probe x={X0 + 40 + 34 * PXS * k} y={640} size={230} f={f} variant="plain" tilt={-90} lamp={false} />
      <Plaque x={540} y={190} text="34 S" size={130} bg={C.ink} fg={C.amber} w={330} />
    </g>
  );
};
const g2: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 6);
  return (
    <g>
      <Sky stops={["#0B1B3A", "#1B3A6B", "#2A6FA8"]} x={0} y={0} w={W} h={H} />
      <HBar x={X0} y={820} w={880} k={(34 + 16 * k) / 50} />
      <line x1={X0 + 34 * PXS} y1={740} x2={X0 + 34 * PXS} y2={900} stroke={C.cream} strokeWidth={10} />
      <Probe x={X0 + 40 + (34 + 16 * k) * PXS * 0.95} y={640} size={230} f={f} tilt={-90} lamp={false} />
      <Bracket x1={X0 + 34 * PXS} y1={940} x2={X0 + 34 * PXS + 16 * PXS * k} y2={940} draw={1} label="" color={C.amber} />
      <Plaque x={540} y={190} text="50 S" size={130} bg={C.ink} fg={C.amber} w={330} />
      <Plaque x={540} y={1100} text="TOP SPEED" size={64} bg={C.ink} fg={C.cream} opacity={ez(f, n - 14, n - 6)} />
    </g>
  );
};
const g3: Shot = ({ f }) => (
  <g>
    <Sky stops={["#0A3C4C", "#11707A", "#1FA69A"]} x={0} y={0} w={W} h={H} />
    <Chips f={f} n={12} y0={150} y1={1150} color={C.gold} speed={9} opacity={0.4} seed={4} />
    <Plaque x={540} y={620} text="+16 S" size={280} bg={C.ink} fg={C.amber} w={780} scale={1 + 0.05 * Math.sin(f / 4)} />
    <Plaque x={540} y={190} text="KEPT SPEEDING UP" size={72} bg={C.ink} fg={C.cream} />
    <Tick x={190} y={1250} pxPerM={250} frame={f} pose="point" expression="surprised" facing={1} />
  </g>
);

/** h - the needle stops; the ground is far below; the speed curve goes flat. */
const h1: Shot = ({ f }) => (
  <g>
    <SK f={f} a={30} b={20} streak={50} />
    <Rain f={f} n={12} x0={60} x1={1020} color={C.foam} speed={30} len={260} width={9} opacity={0.35} seed={6} />
    <MarkedDial x={540} y={720} r={320} v={0.905} m={0.724} label="SOUND" f={f} shake={0.035} />
    <Plaque x={540} y={190} text="50 S" size={130} bg={C.ink} fg={C.amber} w={330} />
  </g>
);
const h2: Shot = ({ f, n }) => {
  const k = ez(f, 0, n);
  return (
    <g>
      <Sky stops={["#2A8FC4", "#4FB5DE", "#9BD6E8"]} x={0} y={0} w={W} h={H} />
      <Rain f={f} n={10} x0={380} x1={700} color={C.foam} speed={26} len={320} width={9} opacity={0.4} seed={9} />
      <rect x={0} y={1010} width={W} height={300} fill={C.rust} />
      <rect x={0} y={1010} width={W} height={26} fill={C.orange} />
      <line x1={540} y1={330} x2={540} y2={1000} stroke={C.cream} strokeWidth={8} strokeDasharray="6 22" strokeLinecap="round" />
      <Probe x={540} y={mix(420, 640, k)} size={300} f={f} trail={180} />
      <Plaque x={540} y={190} text="STOPPED GROWING" size={78} bg={C.ink} fg={C.amber} />
      <Plaque x={540} y={1120} text="GROUND FAR BELOW" size={62} bg={C.ink} fg={C.cream} />
    </g>
  );
};
const CURVE: [number, number][] = [[120, 1010], [280, 860], [460, 640], [640, 480], [790, 410], [960, 408]];
const h3: Shot = ({ f, n }) => (
  <g>
    <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
    <line x1={110} y1={1030} x2={980} y2={1030} stroke={C.cream} strokeWidth={8} strokeLinecap="round" />
    <line x1={110} y1={1030} x2={110} y2={330} stroke={C.cream} strokeWidth={8} strokeLinecap="round" />
    <Trace pts={CURVE} head={ez(f, 0, n - 6)} f={f} color={C.amber} width={16} peak={4} peakLabel="50 S" />
    <Plaque x={540} y={190} text="SPEED" size={120} bg={C.ink} fg={C.amber} />
    <Plaque x={540} y={1130} text="FLAT FROM 50 S" size={64} bg={C.ink} fg={C.cream} scale={ez(f, n - 14, n - 6)} />
  </g>
);

/** i - not the sound barrier; something pushes back. */
const i1: Shot = ({ f, n }) => (
  <g>
    <SK f={f} a={30} b={20} streak={30} />
    <MarkedDial x={540} y={740} r={320} v={0.905} m={0.724} label="SOUND" f={f} crossed={ez(f, 4, n - 4)} />
    <Plaque x={540} y={190} text="NOT THE SOUND BARRIER" size={56} bg={C.ink} fg={C.amber} />
  </g>
);
const i2: Shot = ({ f }) => (
  <g>
    <Sky stops={["#0A3C4C", "#11707A", "#1FA69A"]} x={0} y={0} w={W} h={H} />
    <Probe x={330} y={760 + Math.sin(f / 5) * 10} size={300} f={f} trail={120} />
    <Qmark f={f} x={720} y={900} size={620} />
    <Plaque x={540} y={190} text="16 S EARLIER" size={96} bg={C.ink} fg={C.cream} />
    <Tick x={180} y={1250} pxPerM={250} frame={f} pose="shrug" expression="thinking" facing={1} />
  </g>
);
const i3: Shot = ({ f }) => (
  <g>
    <SK f={f} a={28} b={18} streak={30} />
    <Arrows x={250} y0={420} y1={1100} f={f} dir={-1} n={3} size={80} />
    <Arrows x={830} y0={420} y1={1100} f={f} dir={-1} n={3} size={80} />
    <Probe x={540} y={760 + Math.sin(f * 1.7) * 6} size={360} f={f} trail={180} />
    <Plaque x={540} y={190} text="SOMETHING PUSHES BACK" size={54} bg={C.ink} fg={C.amber} />
  </g>
);

const q: Shot = ({ f }) => (
  <g>
    <Sky stops={["#0A3C4C", "#11707A", "#1FA69A"]} x={0} y={0} w={W} h={H} />
    <Chips f={f} n={12} y0={150} y1={1150} color={C.gold} speed={7} opacity={0.35} seed={6} />
    <Probe x={300} y={760} size={280} f={f} trail={140} />
    <Qmark f={f} x={700} y={900} size={640} />
    <Plaque x={540} y={190} text="WHAT PUSHED BACK?" size={70} bg={C.ink} fg={C.amber} />
  </g>
);
const end: Shot = ({ f }) => (
  <EndShot f={f} stops={["#0A3C4C", "#11707A", "#1FA69A"]} q={["WHAT PUSHED", "BACK?"]}>
    <Probe x={940} y={1200} size={150} f={f} lamp={false} />
  </EndShot>
);

export const ShortS61 = makeShort(timeline, [[a1, a2, a3], [b1, b2, b3], [c1, c2, c3], [d1, d2, d3], [e1, e2, e3], [g1, g2, g3], [h1, h2, h3], [i1, i2, i3], [q, end]]);
