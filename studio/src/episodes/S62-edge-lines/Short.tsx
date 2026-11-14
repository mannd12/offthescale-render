import React from "react";
import { Tick } from "../../lib/illustrated";
import { buildTimeline, VoLine } from "../../lib/timeline";
import { EndShot, Chips, W, H, Shot, makeShort } from "../S41-dig-plate/vkit";
import { Qmark } from "../S46-peak-seafloor/kit46";
import { Balloon, Bracket, Probe } from "../L15-space-jump/props";
import { SkyColumn } from "../L15-space-jump/sky";
import { C, Count, Plaque, T, ez, mix } from "../S61-record-peak/kit61";
import vo from "./vo.json";

/**
 * S62 - Where space starts (episodes/S62-edge-lines). For L15, answered at 10:24. Vertical 1080x1920.
 * Numbers (sources.md, L15 rows): #1 FAI 100 km, US Air Force astronaut wings above 50 miles; #3 50 miles = about 80 km;
 * #2 McDowell 2018 argued for 80 km; #4 Baumgartner 2012 almost 39 km; #8 Eustace 2014 41.4 km; #9 less than half of 100
 * and about half of 80; #10 stratosphere ends about 50 km. Withheld: what the edge actually is.
 * One ruler: y(km) = 1300 - 10 km (100 km at y 300, ground at y 1300).
 */
export const timeline = buildTimeline(vo as VoLine[]);

const KM = (km: number) => 1300 - 10 * km;
const SK: React.FC<{ f: number }> = ({ f }) => <SkyColumn f={f} altTop={130} altBottom={-62} x={0} y={0} w={W} h={H} ground={false} drift={1.2} />;

const Spine: React.FC = () => (
  <g stroke={C.cream} strokeLinecap="round">
    <line x1={130} y1={KM(104)} x2={130} y2={KM(0)} strokeWidth={10} />
    {Array.from({ length: 11 }, (_, i) => (
      <line key={i} x1={130} y1={KM(i * 10)} x2={130 + (i % 5 === 0 ? 64 : 30)} y2={KM(i * 10)} strokeWidth={i % 5 === 0 ? 9 : 6} />
    ))}
    <rect x={0} y={KM(0)} width={W} height={160} fill={C.rust} stroke="none" />
    <rect x={0} y={KM(0)} width={W} height={20} fill={C.orange} stroke="none" />
  </g>
);

/** A horizontal line across the ruler at `km`, drawn to fraction k, with a label plaque below it. */
const LineAt: React.FC<{ km: number; k?: number; color?: string; label?: string; lx?: number; dash?: boolean; size?: number; dy?: number; glow?: number }> = ({ km, k = 1, color = C.amber, label, lx = 560, dash = false, size = 50, dy = 52, glow = 0 }) => (
  <g opacity={Math.min(1, k * 4)}>
    {glow > 0 ? <rect x={130} y={KM(km) - 26} width={850} height={52} rx={26} fill={color} opacity={0.25 * glow} /> : null}
    <line x1={130} y1={KM(km)} x2={130 + 850 * k} y2={KM(km)} stroke={color} strokeWidth={dash ? 8 : 13} strokeLinecap="round" strokeDasharray={dash ? "4 20" : undefined} />
    {label && k > 0.7 ? <Plaque x={lx} y={KM(km) + dy} text={label} size={size} bg={C.ink} fg={color} /> : null}
  </g>
);

const Wings: React.FC<{ x: number; y: number; s: number; f: number }> = ({ x, y, s, f }) => {
  const wing = <path d="M-60 -6 Q-150 -90 -300 -60 Q-240 -10 -200 4 Q-250 16 -290 52 Q-170 66 -60 30 Z" fill={C.cream} stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * (1 + 0.04 * Math.sin(f / 6))})`}>
      {wing}
      <g transform="scale(-1 1)">{wing}</g>
      <circle r={70} fill={C.ink} stroke={C.amber} strokeWidth={14} />
      <circle r={26} fill={C.amber} />
    </g>
  );
};

const BAL1 = 420;
const BAL2 = 700;
const bal = (x: number, km: number, f: number, rise = 1) => <Balloon x={x} y={mix(KM(0) - 40, KM(km), rise) + Math.sin(f / 9) * 5} size={190} f={f} variant="capsule" />;

/** a - draw a line across the sky. */
const a1: Shot = ({ f, n }) => (
  <g>
    <SK f={f} />
    <line x1={130} y1={620} x2={130 + 800 * ez(f, 4, n - 4)} y2={620} stroke={C.amber} strokeWidth={16} strokeLinecap="round" />
    <Tick x={250} y={1250} pxPerM={320} frame={f} pose="point" expression="determined" facing={1} />
    <Plaque x={540} y={190} text="WHERE DOES SPACE BEGIN?" size={50} bg={C.ink} fg={C.amber} />
  </g>
);
const a2: Shot = ({ f }) => (
  <g>
    <SK f={f} />
    <Qmark f={f} x={540} y={560} size={380} opacity={0.5 + 0.5 * Math.sin(f / 4)} />
    <Qmark f={f + 20} x={540} y={820} size={380} opacity={0.5 + 0.5 * Math.sin(f / 4 + 2)} />
    <Qmark f={f + 40} x={540} y={1080} size={380} opacity={0.5 + 0.5 * Math.sin(f / 4 + 4)} />
    <Plaque x={540} y={190} text="THREE ANSWERS" size={100} bg={C.ink} fg={C.amber} />
  </g>
);
const a3: Shot = ({ f, n }) => (
  <g>
    <SK f={f} />
    {[360, 600, 840].map((y, i) => (
      <line key={i} x1={130} y1={y} x2={130 + 800 * ez(f, i * 5, i * 5 + 8)} y2={y} stroke={[C.amber, C.foam, C.mint][i]} strokeWidth={16} strokeLinecap="round" />
    ))}
    <Tick x={190} y={1250} pxPerM={250} frame={f} pose="shrug" expression="thinking" facing={1} />
    <Plaque x={540} y={190} text="3 LINES, 3 ANSWERS" size={66} bg={C.ink} fg={C.cream} scale={ez(f, n - 14, n - 6) * 0.1 + 0.9} />
  </g>
);

/** b - the FAI line at 100 km. */
const b1: Shot = ({ f, n }) => (
  <g>
    <SK f={f} />
    <Spine />
    <Balloon x={540} y={mix(KM(0) - 40, KM(70), ez(f, 0, n))} size={190} f={f} variant="capsule" />
    <Plaque x={540} y={190} text="FAI" size={140} bg={C.ink} fg={C.amber} w={380} />
  </g>
);
const b2: Shot = ({ f, n }) => (
  <g>
    <SK f={f} />
    <Spine />
    <LineAt km={100} k={ez(f, 0, 8)} label="THE FAI LINE" size={52} />
    <Probe x={540} y={KM(100) + 430 + Math.sin(f / 7) * 12} size={300} f={f} variant="float" lamp={false} />
    <Count x={540} y={190} f={f} a={0} b={100} f1={Math.round(n * 0.4)} unit=" KM" w={560} size={120} />
  </g>
);

/** c - the US Air Force's fifty miles. */
const c1: Shot = ({ f, n }) => (
  <g>
    <SK f={f} />
    <Wings x={540} y={660} s={1.5} f={f} />
    <Count x={540} y={190} f={f} a={0} b={50} f1={Math.round(n * 0.4)} unit=" MILES" w={640} size={110} />
    <Plaque x={540} y={1090} text="AIR FORCE ASTRONAUT WINGS" size={44} bg={C.ink} fg={C.cream} />
  </g>
);
const c2: Shot = ({ f, n }) => (
  <g>
    <SK f={f} />
    <Spine />
    <LineAt km={100} label="FAI: 100 KM" size={44} />
    <LineAt km={80.5} k={ez(f, 0, 10)} color={C.foam} label="50 MILES" lx={400} size={50} />
    <Wings x={640} y={KM(80.5) + 330} s={0.9} f={f} />
    <Plaque x={540} y={190} text="ABOUT 80 KM" size={110} bg={C.ink} fg={C.foam} scale={ez(f, n - 14, n - 6) * 0.1 + 0.9} />
  </g>
);
const c3: Shot = ({ f }) => (
  <g>
    <SK f={f} />
    <Spine />
    <LineAt km={100} label="FAI: 100 KM" size={44} />
    <LineAt km={80.5} color={C.foam} label="USAF: ABOUT 80 KM" lx={560} size={44} glow={0.5 + 0.5 * Math.sin(f / 5)} />
    <Probe x={800} y={KM(60) + Math.sin(f / 6) * 14} size={240} f={f} variant="float" lamp={false} />
    <Tick x={250} y={1250} pxPerM={250} frame={f} pose="point" expression="happy" facing={1} />
  </g>
);

/** d - McDowell, 2018: eighty again. */
const d1: Shot = ({ f, n }) => (
  <g>
    <SK f={f} />
    <Spine />
    <LineAt km={100} label="FAI: 100 KM" size={44} />
    <LineAt km={80} k={ez(f, 0, 12)} color={C.mint} label="MCDOWELL: 80 KM" lx={560} size={46} />
    <Count x={540} y={190} f={f} a={2000} b={2018} f1={Math.round(n * 0.4)} grp={false} w={440} size={130} />
    <Tick x={190} y={1250} pxPerM={250} frame={f} pose="point" expression="surprised" facing={1} />
  </g>
);
const d2: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 6);
  return (
    <g>
      <SK f={f} />
      <Spine />
      <LineAt km={100} label="FAI: 100 KM" size={44} />
      <LineAt km={mix(76, 80, k)} color={C.mint} />
      <LineAt km={mix(84.5, 80.5, k)} color={C.foam} />
      <Plaque x={540} y={190} text="ABOUT THE SAME LINE" size={62} bg={C.ink} fg={C.mint} />
      <Probe x={780} y={KM(55) + Math.sin(f / 6) * 14} size={240} f={f} variant="float" lamp={false} />
    </g>
  );
};

/** e - Baumgartner, 2012, almost 39 km. */
const e1: Shot = ({ f, n }) => (
  <g>
    <SK f={f} />
    <Spine />
    <LineAt km={100} color={C.amber} />
    <LineAt km={80} color={C.mint} />
    {bal(BAL1, 39, f, ez(f, 0, n - 2))}
    <Plaque x={540} y={190} text="2012" size={140} bg={C.ink} fg={C.amber} w={380} />
  </g>
);
const e2: Shot = ({ f }) => (
  <g>
    <SK f={f} />
    <Spine />
    <LineAt km={100} color={C.amber} />
    <LineAt km={80} color={C.mint} />
    {bal(BAL1, 39, f)}
    <Plaque x={540} y={190} text="ALMOST 39 KM" size={92} bg={C.ink} fg={C.amber} scale={1 + 0.05 * Math.sin(f / 4)} />
  </g>
);
const e3: Shot = ({ f, n }) => (
  <g>
    <SK f={f} />
    <Spine />
    <LineAt km={100} color={C.amber} label="100 KM" lx={700} size={44} />
    <LineAt km={80} color={C.mint} />
    {bal(BAL1, 39, f)}
    <Bracket x1={600} y1={KM(39) - 10} x2={600} y2={KM(100) + 10} draw={ez(f, 0, n - 4)} color={C.cream} />
    <Plaque x={540} y={1130} text="STILL FAR BELOW" size={62} bg={C.ink} fg={C.cream} />
  </g>
);

/** f - Eustace, 2014, 41.4 km. */
const f1: Shot = ({ f, n }) => (
  <g>
    <SK f={f} />
    <Spine />
    <LineAt km={100} color={C.amber} />
    <LineAt km={80} color={C.mint} />
    {bal(BAL1, 39, f)}
    {bal(BAL2, 41.4, f, ez(f, 0, n - 2))}
    <Plaque x={540} y={190} text="2014" size={140} bg={C.ink} fg={C.amber} w={380} />
  </g>
);
const f2: Shot = ({ f, n }) => (
  <g>
    <SK f={f} />
    <Spine />
    <LineAt km={100} color={C.amber} />
    <LineAt km={80} color={C.mint} />
    {bal(BAL1, 39, f)}
    {bal(BAL2, 41.4, f)}
    <Count x={540} y={190} f={f} a={0} b={41.4} d={1} f1={Math.round(n * 0.4)} unit=" KM" w={600} size={120} />
  </g>
);

/** g - less than half of 100, only about half of 80. */
const g1: Shot = ({ f, n }) => (
  <g>
    <SK f={f} />
    <Spine />
    <LineAt km={100} color={C.amber} />
    <LineAt km={80} color={C.mint} />
    <LineAt km={50} k={ez(f, 0, 12)} color={C.cream} dash label="HALF OF 100" lx={720} size={44} />
    {bal(BAL1, 39, f)}
    {bal(BAL2, 41.4, f)}
    <Plaque x={540} y={190} text="LESS THAN HALF" size={96} bg={C.ink} fg={C.amber} scale={ez(f, n - 14, n - 6) * 0.1 + 0.9} />
  </g>
);
const g2: Shot = ({ f }) => (
  <g>
    <SK f={f} />
    <Spine />
    <LineAt km={100} color={C.amber} />
    <LineAt km={80} color={C.mint} />
    <LineAt km={40} k={ez(f, 0, 12)} color={C.cream} dash label="HALF OF 80" lx={760} size={44} dy={-50} />
    {bal(BAL1, 39, f)}
    {bal(BAL2, 41.4, f)}
    <Plaque x={540} y={190} text="ONLY ABOUT HALF OF 80" size={52} bg={C.ink} fg={C.mint} />
  </g>
);

/** h - they started in the stratosphere, which ends at about 50 km. */
const STRAT = (f: number, k: number) => (
  <g>
    <rect x={130} y={KM(50)} width={850} height={(KM(12) - KM(50)) * k} fill={C.teal} opacity={0.32} />
    <line x1={130} y1={KM(50)} x2={980} y2={KM(50)} stroke={C.teal} strokeWidth={12} strokeLinecap="round" opacity={k} />
    <T x={560} y={KM(12) - 40} text="STRATOSPHERE" size={56} color={C.teal} opacity={k} />
  </g>
);
const h1: Shot = ({ f, n }) => (
  <g>
    <SK f={f} />
    <Spine />
    {STRAT(f, ez(f, 0, n - 4))}
    {bal(BAL1, 39, f)}
    {bal(BAL2, 41.4, f)}
    <Plaque x={540} y={190} text="STILL IN THE STRATOSPHERE" size={50} bg={C.ink} fg={C.teal} />
  </g>
);
const h2: Shot = ({ f, n }) => (
  <g>
    <SK f={f} />
    <Spine />
    {STRAT(f, 1)}
    {bal(BAL1, 39, f)}
    {bal(BAL2, 41.4, f)}
    <Count x={540} y={190} f={f} a={0} b={50} f1={Math.round(n * 0.4)} unit=" KM" w={520} size={120} />
    <Plaque x={560} y={KM(50) + 190} text="ENDS ABOUT HERE" size={46} bg={C.ink} fg={C.cream} />
  </g>
);
const h3: Shot = ({ f }) => (
  <g>
    <SK f={f} />
    <Spine />
    {STRAT(f, 1)}
    {bal(BAL1, 39, f)}
    {bal(BAL2, 41.4, f)}
    <Tick x={905} y={1260} pxPerM={200} frame={f} pose="point" expression="neutral" facing={-1} />
    <Plaque x={540} y={190} text="BOTH JUMPS BEGAN INSIDE IT" size={46} bg={C.ink} fg={C.cream} />
  </g>
);

/** i - none of the three lines was reached. */
const i1: Shot = ({ f }) => (
  <g>
    <SK f={f} />
    <Spine />
    <LineAt km={100} color={C.amber} glow={0.5 + 0.5 * Math.sin(f / 4)} />
    <LineAt km={80.5} color={C.foam} glow={0.5 + 0.5 * Math.sin(f / 4 + 1)} />
    <LineAt km={80} color={C.mint} glow={0.5 + 0.5 * Math.sin(f / 4 + 2)} />
    {bal(BAL1, 39, f)}
    {bal(BAL2, 41.4, f)}
    <Plaque x={540} y={190} text="NEVER REACHED A LINE" size={56} bg={C.ink} fg={C.amber} />
  </g>
);

const q: Shot = ({ f }) => (
  <g>
    <SK f={f} />
    <Chips f={f} n={12} y0={150} y1={1150} color={C.gold} speed={7} opacity={0.35} seed={6} />
    <Qmark f={f} x={540} y={900} size={760} />
    <Plaque x={540} y={190} text="WHAT IS THE EDGE?" size={72} bg={C.ink} fg={C.amber} />
  </g>
);
const end: Shot = ({ f }) => (
  <EndShot f={f} stops={["#0B1B3A", "#1B3A6B", "#2A6FA8"]} q={["WHAT IS", "THE EDGE?"]}>
    <Probe x={940} y={1200} size={150} f={f} lamp={false} />
  </EndShot>
);

export const ShortS62 = makeShort(timeline, [[a1, a2, a3], [b1, b2], [c1, c2, c3], [d1, d2], [e1, e2, e3], [f1, f2], [g1, g2], [h1, h2, h3], [i1], [q, end]]);
