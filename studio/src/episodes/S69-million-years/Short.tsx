import React from "react";
import { Sky, Tick } from "../../lib/illustrated";
import { buildTimeline, VoLine } from "../../lib/timeline";
import { EndShot, Chips, Strata, W, H, Shot, makeShort } from "../S41-dig-plate/vkit";
import { Qmark } from "../S46-peak-seafloor/kit46";
import { Bracket } from "../L15-space-jump/props";
import { PrintIcon, StoneIcon } from "../L17-humans-vanish/icons17";
import { Count, C, HBar, Plaque, ez } from "../S61-record-peak/kit61";
import vo from "./vo.json";

/**
 * S69 - Stone tools 3.3 million years old (episodes/S69-million-years). For L17, answered at 7:02 (One million years: what's left).
 * Numbers (sources.md, L17 rows 11, 12, 13, 18): Lomekwi 3 stone tools 3.3 million years old, in situ, 700,000 years before
 * the Oldowan; 3.3 / 1 = more than three times a million (our sum); NASA: Apollo footprints "probably" last millions of years;
 * technofossils are already in sediments. Withheld: the third kind of survivor, the thin band of our materials in the mud.
 */
export const timeline = buildTimeline(vo as VoLine[]);

const SAND = ["#E3813F", "#F6B45A", "#FFC83D"];
const MOON = ["#04121A", "#06222B", "#0A3C4C"];

const Desert: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <Sky stops={SAND} x={0} y={0} w={W} h={H} />
    <Chips f={f} n={9} y0={120} y1={900} color={C.cream} speed={3} opacity={0.3} seed={3} len={160} width={12} />
    <path d={`M0 1090 Q270 1040 540 1090 T1080 1070 V${H} H0 Z`} fill="#F2B04C" />
    <path d={`M0 1180 Q300 1130 600 1180 T1080 1160 V${H} H0 Z`} fill="#D9892F" />
  </g>
);
const Moon: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <Sky stops={MOON} x={0} y={0} w={W} h={H} />
    <Chips f={f} n={14} y0={80} y1={900} color={C.foam} speed={1.5} opacity={0.5} seed={9} len={10} width={10} />
    <path d={`M0 1000 Q300 960 560 1000 T1080 980 V${H} H0 Z`} fill="#C9CFD3" />
    <path d={`M0 1120 Q300 1080 560 1120 T1080 1100 V${H} H0 Z`} fill="#9AA7AE" />
  </g>
);

/** a - three point three million years old. */
const a1: Shot = ({ f, n }) => (
  <g>
    <Desert f={f} />
    <StoneIcon x={540} y={880 + Math.sin(f / 14) * 6} size={560} />
    <Count x={540} y={190} f={f} b={3.3} d={1} f1={Math.round(n * 0.4)} unit=" MILLION YEARS" w={960} size={84} />
  </g>
);
const a2: Shot = ({ f }) => (
  <g>
    <Desert f={f} />
    <StoneIcon x={250} y={930} size={300} />
    <StoneIcon x={570} y={880} size={380} />
    <StoneIcon x={860} y={950} size={260} />
    <Plaque x={540} y={190} text="LOMEKWI" size={130} bg={C.ink} fg={C.amber} />
    <Plaque x={540} y={340} text="STONE TOOLS" size={64} bg={C.ink} fg={C.cream} />
  </g>
);

/** b - more than three times a million years (our sum). */
const b1: Shot = ({ f, n }) => (
  <g>
    <Desert f={f} />
    <Plaque x={540} y={470} text="1 MILLION YEARS" size={50} bg={C.ink} fg={C.cream} />
    <HBar x={100} y={580} w={880} k={0.3 * ez(f, 0, 8)} color={C.teal} />
    <Plaque x={540} y={800} text="3.3 MILLION YEARS" size={50} bg={C.ink} fg={C.amber} />
    <HBar x={100} y={910} w={880} k={ez(f, 4, Math.round(n * 0.5))} color={C.amber} />
    <Plaque x={540} y={190} text="LONGER THAN THAT" size={64} bg={C.ink} fg={C.cream} />
  </g>
);
const b2: Shot = ({ f, n }) => (
  <g>
    <Desert f={f} />
    <Count x={540} y={520} f={f} b={3.3} d={1} f1={Math.round(n * 0.4)} unit="×" w={620} size={190} />
    <Plaque x={540} y={190} text="MORE THAN 3 TIMES" size={70} bg={C.ink} fg={C.cream} />
    <Plaque x={540} y={800} text="A MILLION YEARS" size={80} bg={C.ink} fg={C.amber} />
    <StoneIcon x={540} y={1060} size={260} />
  </g>
);

/** c - seven hundred thousand years before the Oldowan. */
const c1: Shot = ({ f, n }) => (
  <g>
    <Desert f={f} />
    <line x1={140} y1={760} x2={940} y2={760} stroke={C.ink} strokeWidth={14} strokeLinecap="round" />
    <StoneIcon x={170} y={650} size={170} />
    <StoneIcon x={900} y={650} size={170} fill="#E3813F" />
    <Plaque x={250} y={870} text="LOMEKWI" size={42} bg={C.ink} fg={C.cream} w={250} />
    <Plaque x={800} y={870} text="OLDOWAN" size={42} bg={C.ink} fg={C.amber} w={250} />
    <Bracket x1={170} y1={980} x2={900} y2={980} draw={ez(f, 0, Math.round(n * 0.5))} color={C.ink} />
    <Count x={540} y={190} f={f} b={700000} f1={Math.round(n * 0.4)} unit=" YEARS" w={900} size={96} />
  </g>
);
const c2: Shot = ({ f }) => (
  <g>
    <Desert f={f} />
    <StoneIcon x={300} y={800} size={380} />
    <StoneIcon x={790} y={800} size={380} fill="#E3813F" />
    <Plaque x={540} y={190} text="BEFORE THE OLDOWAN" size={60} bg={C.ink} fg={C.amber} w={900} />
    <Plaque x={540} y={340} text="THE NEXT TOOL TRADITION" size={44} bg={C.ink} fg={C.cream} w={860} />
  </g>
);

/** d - still lying where they were left. */
const d1: Shot = ({ f }) => (
  <g>
    <Desert f={f} />
    <StoneIcon x={640} y={960} size={420} />
    <Tick x={220} y={1180} pxPerM={260} frame={f} pose="point" expression="happy" facing={1} />
    <Plaque x={540} y={190} text="STILL WHERE" size={100} bg={C.ink} fg={C.amber} />
    <Plaque x={540} y={340} text="THEY WERE LEFT" size={86} bg={C.ink} fg={C.cream} />
  </g>
);
const d2: Shot = ({ f }) => (
  <g>
    <Desert f={f} />
    <StoneIcon x={540} y={780} size={520} />
    <g transform={`translate(540 ${360 + 14 * Math.abs(Math.sin(f / 8))})`}>
      <path d="M0 -30 V50 M-40 14 L0 54 L40 14" stroke={C.ink} strokeWidth={20} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <Plaque x={540} y={190} text="IN PLACE" size={96} bg={C.ink} fg={C.amber} />
  </g>
);

/** e - the Apollo footprints on the Moon. */
const e1: Shot = ({ f }) => (
  <g>
    <Moon f={f} />
    <PrintIcon x={540} y={760 + Math.sin(f / 16) * 5} size={620} rotate={-12} fill="#F2C36B" ink="#5A3A10" />
    <Plaque x={540} y={190} text="ON THE MOON" size={96} bg={C.ink} fg={C.amber} />
  </g>
);
const e2: Shot = ({ f }) => (
  <g>
    <Moon f={f} />
    <PrintIcon x={300} y={900} size={300} rotate={-12} fill="#F2C36B" ink="#5A3A10" />
    <PrintIcon x={760} y={780} size={300} rotate={8} fill="#F2C36B" ink="#5A3A10" />
    <Plaque x={540} y={190} text="APOLLO FOOTPRINTS" size={70} bg={C.ink} fg={C.cream} />
    <Plaque x={540} y={340} text="NASA: PROBABLY MILLIONS OF YEARS" size={36} bg={C.ink} fg={C.amber} />
  </g>
);

/** f - suppose every human vanished: after a million years, three kinds of things. */
const City: React.FC<{ f: number; lit: number }> = ({ f, lit }) => (
  <g>
    <Sky stops={["#0A3C4C", "#11707A", "#1FA69A"]} x={0} y={0} w={W} h={H} />
    <Chips f={f} n={8} y0={120} y1={800} color={C.foam} speed={2} opacity={0.2} seed={5} len={60} width={8} />
    {[
      [60, 560, C.sea],
      [270, 760, C.petrol],
      [480, 480, C.teal],
      [690, 680, C.sea],
      [880, 420, C.petrol],
    ].map(([x, h, col], i) => (
      <g key={i}>
        <rect x={x as number} y={1180 - (h as number)} width={170} height={h as number} rx={12} fill={col as string} stroke={C.ink} strokeWidth={8} />
        {Array.from({ length: Math.floor((h as number) / 120) * 2 }, (_, k) => {
          const on = k / (Math.floor((h as number) / 120) * 2) < 1 - lit ? false : true;
          return <rect key={k} x={(x as number) + 28 + (k % 2) * 76} y={1180 - (h as number) + 36 + Math.floor(k / 2) * 120} width={44} height={56} rx={8} fill={on ? C.gold : C.ink} opacity={on ? 1 : 0.6} />;
        })}
      </g>
    ))}
    <rect x={0} y={1180} width={W} height={H - 1180} fill={C.deep} />
  </g>
);
const f1: Shot = ({ f, n }) => (
  <g>
    <City f={f} lit={1 - ez(f, Math.round(n * 0.2), Math.round(n * 0.7))} />
    <Count x={540} y={190} f={f} b={1000000} f1={Math.round(n * 0.4)} unit=" YEARS" w={900} size={110} />
    <Plaque x={540} y={340} text="AFTER EVERY HUMAN VANISHED" size={38} bg={C.ink} fg={C.cream} />
  </g>
);
const f2: Shot = ({ f }) => (
  <g>
    <City f={f} lit={0} />
    <Plaque x={540} y={190} text="OUR BEST BET:" size={72} bg={C.ink} fg={C.cream} />
    <Plaque x={540} y={350} text="3 KINDS OF THINGS" size={84} bg={C.ink} fg={C.amber} scale={0.92 + 0.08 * ez(f, 0, 8)} />
  </g>
);

/** g - stone, the Moon, and the third in the ground. */
const Card: React.FC<{ n: number; label: string; children?: React.ReactNode; f: number; fg?: string }> = ({ n, label, children, f, fg = C.amber }) => (
  <g>
    <rect x={150} y={420} width={780} height={760} rx={50} fill={C.cream} stroke={C.ink} strokeWidth={12} />
    <circle cx={150} cy={420} r={64} fill={fg} stroke={C.ink} strokeWidth={10} />
    <text x={150} y={446} textAnchor="middle" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 76, fill: C.ink }}>
      {n}
    </text>
    {children}
    <Plaque x={540} y={1090} text={label} size={72} bg={C.ink} fg={fg} scale={0.94 + 0.06 * ez(f, 0, 8)} />
  </g>
);
const g1: Shot = ({ f }) => (
  <g>
    <Desert f={f} />
    <Card n={1} label="STONE" f={f}>
      <StoneIcon x={540} y={720} size={420} />
    </Card>
    <Plaque x={540} y={190} text="STONE IS ONE" size={86} bg={C.ink} fg={C.cream} />
  </g>
);
const g2: Shot = ({ f }) => (
  <g>
    <Moon f={f} />
    <Card n={2} label="THE MOON" f={f}>
      <PrintIcon x={540} y={740} size={440} rotate={-10} fill="#F2C36B" ink="#5A3A10" />
    </Card>
    <Plaque x={540} y={190} text="THE MOON IS ANOTHER" size={58} bg={C.ink} fg={C.cream} />
  </g>
);
const g3: Shot = ({ f }) => (
  <g>
    <Sky stops={["#7A3418", "#B04A18", "#E3813F"]} x={0} y={0} w={W} h={H} />
    <Strata f={f} speed={0.8} bands={[[120, "#B07A48"], [90, "#8F5A34"], [110, "#C99A62"], [80, "#7A4A2A"], [100, "#A86E40"]]} y0={420} y1={1180} x0={150} x1={930} amp={10} />
    <Qmark f={f} x={540} y={960} size={600} color={C.cream} />
    <Plaque x={540} y={190} text="THE THIRD IS ALREADY" size={60} bg={C.ink} fg={C.cream} />
    <Plaque x={540} y={310} text="IN THE GROUND" size={86} bg={C.ink} fg={C.amber} />
  </g>
);

const q: Shot = ({ f }) => (
  <g>
    <Sky stops={["#0A3C4C", "#11707A", "#1FA69A"]} x={0} y={0} w={W} h={H} />
    <g transform="translate(0 0)">
      <rect x={60} y={520} width={300} height={400} rx={30} fill={C.cream} stroke={C.ink} strokeWidth={10} />
      <StoneIcon x={210} y={700} size={190} />
      <rect x={390} y={520} width={300} height={400} rx={30} fill={C.cream} stroke={C.ink} strokeWidth={10} />
      <PrintIcon x={540} y={720} size={230} rotate={-10} fill="#F2C36B" ink="#5A3A10" />
      <rect x={720} y={520} width={300} height={400} rx={30} fill={C.ink} stroke={C.amber} strokeWidth={10} strokeDasharray="22 14" />
    </g>
    <Qmark f={f} x={870} y={860} size={300} />
    <Plaque x={540} y={190} text="WHAT'S THE THIRD?" size={72} bg={C.ink} fg={C.amber} />
  </g>
);
const end: Shot = ({ f }) => (
  <EndShot f={f} stops={["#0A3C4C", "#11707A", "#1FA69A"]} q={["WHAT'S THE", "THIRD ONE?"]}>
    <StoneIcon x={950} y={1300} size={140} />
  </EndShot>
);

export const ShortS69 = makeShort(timeline, [[a1, a2], [b1, b2], [c1, c2], [d1, d2], [e1, e2], [f1, f2], [g1, g2, g3], [q, end]]);
