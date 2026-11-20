import React from "react";
import { Tick } from "../../lib/illustrated";
import { buildTimeline, VoLine } from "../../lib/timeline";
import { EndShot, Shot, makeShort } from "../S41-dig-plate/vkit";
import { Qmark } from "../S46-peak-seafloor/kit46";
import { Bracket } from "../L15-space-jump/props";
import { Clock, Probe } from "../L16-into-the-sun/props16";
import { Dial, Count, C, Plaque, ez, mix } from "../S61-record-peak/kit61";
import { BG_EMBER, SunScene, UpBar } from "./kit66";
import vo from "./vo.json";

/**
 * S66 - The probe that stayed at 30 degrees (episodes/S66-probe-stays-cool). For L16, answered at 4:17.
 * Numbers (sources.md, L16 rows 9, 10, 13): 28 April 2021, about five hours inside the Alfven surface, 13 million km above
 * the visible surface; surface about 5,500 C, corona up to 2,000,000 C ("hundreds of times hotter"); instruments behind the
 * shield at 85 F = about 30 C. Withheld: why (thin gas, temperature is not heat; L16 4:17). Probe tilt -90 = shield down.
 */
export const timeline = buildTimeline(vo as VoLine[]);

const Halo: React.FC<{ f: number; top?: number }> = ({ f, top = 1060 }) => <SunScene f={f} top={top} />;

/** a - 28 April 2021, into the atmosphere. */
const a1: Shot = ({ f, n }) => (
  <g>
    <Halo f={f} />
    <Probe x={540} y={mix(380, 740, ez(f, 0, n))} size={440} f={f} tilt={-90} trail={150} lamp={false} />
    <Plaque x={540} y={190} text="APRIL 28, 2021" size={96} bg={C.ink} fg={C.amber} />
  </g>
);
const a2: Shot = ({ f }) => (
  <g>
    <Halo f={f} top={1080} />
    <Probe x={540} y={660 + Math.sin(f / 12) * 10} size={560} f={f} tilt={-90} lamp={false} />
    <Plaque x={540} y={190} text="PARKER SOLAR PROBE" size={70} bg={C.ink} fg={C.cream} />
    <Plaque x={540} y={330} text="INTO THE SUN'S ATMOSPHERE" size={46} bg={C.ink} fg={C.amber} />
  </g>
);

/** b - about five hours, 13 million km above the surface. */
const b1: Shot = ({ f, n }) => {
  const k = ez(f, 0, Math.round(n * 0.4));
  return (
    <g>
      <Halo f={f} top={1100} />
      <Clock x={540} y={720} r={310} f={f} hours={5 * k} />
      <Count x={540} y={190} f={f} b={5} f1={Math.round(n * 0.4)} unit=" HOURS" w={560} size={140} />
    </g>
  );
};
const b2: Shot = ({ f, n }) => (
  <g>
    <Halo f={f} top={1080} />
    <Probe x={440} y={600 + Math.sin(f / 12) * 8} size={380} f={f} tilt={-90} lamp={false} />
    <Bracket x1={850} y1={660} x2={850} y2={1050} draw={ez(f, 0, Math.round(n * 0.4))} color={C.amber} />
    <Count x={540} y={190} f={f} b={13} f1={Math.round(n * 0.4)} unit=" MILLION KM" w={900} size={96} />
    <Plaque x={420} y={900} text="ABOVE THE SURFACE" size={46} bg={C.ink} fg={C.cream} />
  </g>
);

/** c - surface about 5,500 C, the corona up to 2,000,000 C. */
const Bars: React.FC<{ corona: number; arrow?: boolean }> = ({ corona, arrow = false }) => (
  <g>
    <UpBar x={300} base={1130} w={210} h={56} color={C.gold} />
    <UpBar x={780} base={1130} w={210} h={mix(56, 860, corona)} color={C.verm} />
    <Plaque x={300} y={1210} text="SURFACE" size={50} bg={C.ink} fg={C.cream} />
    <Plaque x={780} y={1210} text="CORONA" size={50} bg={C.ink} fg={C.cream} />
    {arrow && corona > 0.6 ? <path d="M780 250 V190 M730 230 L780 180 L830 230" stroke={C.amber} strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
  </g>
);
const c1: Shot = ({ f, n }) => (
  <g>
    <SunScene f={f} top={1600} glints={false} />
    <Bars corona={0} />
    <Count x={540} y={190} f={f} b={5500} f1={Math.round(n * 0.4)} unit=" °C" w={660} size={140} />
    <Plaque x={540} y={350} text="THE VISIBLE SURFACE" size={50} bg={C.ink} fg={C.cream} />
  </g>
);
const c2: Shot = ({ f, n }) => (
  <g>
    <SunScene f={f} top={1600} glints={false} />
    <Bars corona={ez(f, 0, Math.round(n * 0.4))} arrow />
    <Count x={540} y={190} f={f} b={2000000} f1={Math.round(n * 0.4)} unit=" °C" w={900} size={120} />
    <Plaque x={540} y={350} text="UP TO" size={54} bg={C.ink} fg={C.cream} />
  </g>
);

/** d - hundreds of times hotter. */
const d1: Shot = ({ f, n }) => (
  <g>
    <SunScene f={f} top={1600} glints={false} />
    <Bars corona={1} />
    <Plaque x={540} y={190} text="HUNDREDS OF TIMES HOTTER" size={50} bg={C.ink} fg={C.amber} scale={0.9 + 0.1 * ez(f, 0, 8)} />
  </g>
);
const d2: Shot = ({ f }) => (
  <g>
    <SunScene f={f} top={1500} />
    <Plaque x={540} y={520} text="HUNDREDS" size={150} bg={C.ink} fg={C.amber} rot={-4} />
    <Plaque x={540} y={720} text="OF TIMES HOTTER" size={84} bg={C.ink} fg={C.cream} rot={-4} />
    <Tick x={220} y={1180} pxPerM={260} frame={f} pose="shrug" expression="surprised" facing={1} />
  </g>
);

/** e - behind the shield: 85 F, about 30 C. */
const e1: Shot = ({ f }) => (
  <g>
    <SunScene f={f} top={1500} glints={false} />
    <circle cx={-120} cy={760} r={560} fill="#FFC83D" opacity={0.95} />
    <circle cx={-120} cy={760} r={640} fill="none" stroke="#F58A1F" strokeWidth={60} opacity={0.6} />
    <Probe x={620 + Math.sin(f / 14) * 8} y={760} size={640} f={f} variant="cutaway" lamp={false} />
    <Plaque x={540} y={190} text="BEHIND THE HEAT SHIELD" size={56} bg={C.ink} fg={C.cream} />
  </g>
);
const e2: Shot = ({ f, n }) => (
  <g>
    <SunScene f={f} top={1600} glints={false} />
    <Dial x={540} y={780} r={310} v={0.28 * ez(f, 0, Math.round(n * 0.4))} color={C.green} f={f} />
    <Count x={540} y={190} f={f} b={85} f1={Math.round(n * 0.4)} unit=" °F" w={460} size={140} />
  </g>
);
const e3: Shot = ({ f, n }) => (
  <g>
    <SunScene f={f} top={1600} glints={false} />
    <Dial x={540} y={780} r={310} v={0.28} color={C.green} f={f} />
    <Count x={540} y={190} f={f} b={30} f1={Math.round(n * 0.4)} unit=" °C" w={460} size={140} />
    <Plaque x={540} y={350} text="ABOUT" size={54} bg={C.ink} fg={C.cream} />
  </g>
);

const q: Shot = ({ f }) => (
  <g>
    <SunScene f={f} top={1100} />
    <Probe x={330} y={700} size={330} f={f} tilt={-90} lamp={false} />
    <Qmark f={f} x={580} y={1040} size={520} />
    <Plaque x={540} y={190} text="HOW DID IT STAY COOL?" size={58} bg={C.ink} fg={C.amber} />
    <Tick x={900} y={1080} pxPerM={200} frame={f} pose="shrug" expression="surprised" facing={-1} />
  </g>
);
const end: Shot = ({ f }) => (
  <EndShot f={f} stops={BG_EMBER} q={["HOW DID IT", "STAY COOL?"]}>
    <Probe x={930} y={1290} size={170} f={f} tilt={-90} lamp={false} />
  </EndShot>
);

export const ShortS66 = makeShort(timeline, [[a1, a2], [b1, b2], [c1, c2], [d1], [e1, e2, e3], [q, end]]);
