import React from "react";
import { Sky, Tick } from "../../lib/illustrated";
import { buildTimeline, VoLine } from "../../lib/timeline";
import { EndShot, Chips, W, H, Shot, makeShort } from "../S41-dig-plate/vkit";
import { Qmark } from "../S46-peak-seafloor/kit46";
import { Bracket, Probe, Station } from "../L15-space-jump/props";
import { Limb } from "../L15-space-jump/sky";
import { Arrows, BG_NIGHT, C, Count, Dial, HBar, Plaque, ez, mix } from "../S61-record-peak/kit61";
import vo from "./vo.json";

/**
 * S65 - Let go at the space station (episodes/S65-station-drop). For L15, answered at 7:55. Vertical 1080x1920.
 * Numbers (sources.md, L15 row 16): station altitude 370-460 km; gravity there about 90 % of the surface value; about 90
 * minutes per orbit; 16 orbits a day. Withheld: why the probe does not fall (it keeps the station's sideways speed and
 * falls around the Earth); no orbital speed is stated anywhere.
 */
export const timeline = buildTimeline(vo as VoLine[]);

const Space: React.FC<{ f: number; limb?: number; slide?: number }> = ({ f, limb = 1150, slide = 6 }) => (
  <g>
    <Sky stops={["#04121A", "#0B1B3A", "#102A52"]} x={0} y={0} w={W} h={H} />
    <Chips f={f} n={14} y0={80} y1={1000} color={C.foam} speed={slide * 0.6} opacity={0.35} seed={3} len={60} width={6} />
    <Limb f={f} cy={limb} R={2400} cx={540} w={W} slide={slide} />
  </g>
);

/** The orbit diagram: planet, orbit ring, the station and (optionally) the probe riding with it. */
const Orbit: React.FC<{ f: number; rate: number; probe?: boolean; pips?: number; cy?: number }> = ({ f, rate, probe = false, pips = 0, cy = 760 }) => {
  const cx = 540;
  const R = 330;
  const th = -Math.PI / 2 + f * rate;
  const sx = cx + Math.cos(th) * R;
  const sy = cy + Math.sin(th) * R;
  const th2 = th - 0.2;
  return (
    <g>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={C.cream} strokeWidth={6} strokeDasharray="4 18" strokeLinecap="round" opacity={0.7} />
      <circle cx={cx} cy={cy} r={200} fill="#0B3A4A" stroke="#35D0E8" strokeWidth={10} />
      <circle cx={cx - 40} cy={cy - 30} r={60} fill="#11707A" opacity={0.6} />
      {Array.from({ length: 16 }, (_, i) => {
        const a = -Math.PI / 2 + (i / 16) * Math.PI * 2;
        return <circle key={i} cx={cx + Math.cos(a) * (R + 100)} cy={cy + Math.sin(a) * (R + 100)} r={14} fill={i < pips ? C.amber : C.ink} opacity={i < pips ? 1 : 0.6} />;
      })}
      <Station x={sx} y={sy} size={210} f={f} tilt={-6} />
      {probe ? <Probe x={cx + Math.cos(th2) * (R - 6)} y={cy + Math.sin(th2) * (R - 6)} size={110} f={f} variant="float" lamp={false} /> : null}
    </g>
  );
};

/** a - float a probe out of the station and let go. */
const a1: Shot = ({ f }) => (
  <g>
    <Space f={f} />
    <Station x={540 + Math.sin(f / 30) * 20} y={520} size={560} f={f} />
    <Tick x={220} y={1110} pxPerM={200} frame={f} pose="hold" expression="happy" facing={1} tilt={14} />
    <Plaque x={540} y={190} text="THE SPACE STATION" size={80} bg={C.ink} fg={C.cream} />
  </g>
);
const a2: Shot = ({ f, n }) => {
  const k = ez(f, 2, n - 2);
  return (
    <g>
      <Space f={f} />
      <Station x={540} y={600} size={600} f={f} />
      <Probe x={mix(540, 380, k)} y={mix(700, 900, k)} size={300} f={f} variant="float" lamp={false} />
      <Plaque x={540} y={190} text="LET IT GO" size={120} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** b - 370 to 460 km up. */
const b1: Shot = ({ f, n }) => (
  <g>
    <Space f={f} />
    <Station x={mix(300, 780, ez(f, 0, n))} y={620} size={420} f={f} />
    <Bracket x1={140} y1={1150} x2={140} y2={640} draw={ez(f, 0, n - 4)} color={C.amber} />
    <Plaque x={540} y={190} text="370 TO 460 KM UP" size={64} bg={C.ink} fg={C.amber} />
  </g>
);
const b2: Shot = ({ f }) => (
  <g>
    <Space f={f} />
    <line x1={90} y1={820} x2={990} y2={820} stroke={C.cream} strokeWidth={8} strokeDasharray="4 20" strokeLinecap="round" />
    <line x1={90} y1={480} x2={990} y2={480} stroke={C.cream} strokeWidth={8} strokeDasharray="4 20" strokeLinecap="round" />
    <Plaque x={250} y={880} text="370 KM" size={64} bg={C.ink} fg={C.cream} />
    <Plaque x={250} y={420} text="460 KM" size={64} bg={C.ink} fg={C.cream} />
    <Station x={640} y={650 + Math.sin(f / 12) * 14} size={380} f={f} />
    <Plaque x={540} y={190} text="SOMEWHERE IN BETWEEN" size={58} bg={C.ink} fg={C.amber} />
  </g>
);

/** c - gravity about 90 %. */
const c1: Shot = ({ f, n }) => (
  <g>
    <Space f={f} limb={1500} />
    <Dial x={540} y={700} r={300} v={ez(f, 0, n - 6) * 0.9} f={f} shake={ez(f, n - 8, n) * 0.02} />
    <Count x={540} y={190} f={f} a={0} b={90} f1={n - 6} unit=" %" w={440} size={140} />
  </g>
);
const c2: Shot = ({ f }) => (
  <g>
    <Space f={f} />
    <Probe x={540} y={560 + Math.sin(f / 12) * 12} size={320} f={f} variant="float" lamp={false} />
    <Arrows x={540} y0={760} y1={1120} f={f} dir={1} n={2} size={90} />
    <Plaque x={540} y={190} text="GRAVITY: ABOUT 90 %" size={64} bg={C.ink} fg={C.amber} />
  </g>
);
const c3: Shot = ({ f, n }) => (
  <g>
    <Space f={f} limb={1500} />
    <Plaque x={540} y={470} text="ON THE GROUND" size={52} bg={C.ink} fg={C.cream} />
    <HBar x={100} y={580} w={880} k={ez(f, 0, 10)} color={C.foam} />
    <Plaque x={540} y={800} text="UP THERE" size={52} bg={C.ink} fg={C.amber} />
    <HBar x={100} y={910} w={880} k={ez(f, 6, n - 6) * 0.9} color={C.amber} />
    <Plaque x={540} y={190} text="BARELY ANY WEAKER" size={70} bg={C.ink} fg={C.cream} />
  </g>
);

/** d - you'd expect it to drop. */
const d1: Shot = ({ f, n }) => {
  const k = ez(f, 4, n - 2);
  return (
    <g>
      <Space f={f} limb={1300} />
      <g opacity={0.5}>
        <Probe x={540} y={mix(620, 1150, k)} size={300} f={f} variant="float" lamp={false} />
      </g>
      <line x1={540} y1={780} x2={540} y2={1200} stroke={C.amber} strokeWidth={10} strokeDasharray="4 20" strokeLinecap="round" />
      <Plaque x={540} y={190} text="IT SHOULD DROP AWAY" size={60} bg={C.ink} fg={C.amber} />
    </g>
  );
};
const d2: Shot = ({ f }) => (
  <g>
    <Space f={f} limb={1300} />
    <Probe x={640} y={700 + Math.sin(f / 10) * 10} size={320} f={f} variant="float" lamp={false} />
    <Tick x={230} y={1180} pxPerM={260} frame={f} pose="point" expression="worried" facing={1} />
    <Plaque x={540} y={190} text="LIKE ANYTHING ELSE" size={66} bg={C.ink} fg={C.cream} />
  </g>
);

/** e - it stays beside the station. */
const e1: Shot = ({ f }) => (
  <g>
    <Space f={f} limb={1250} slide={22} />
    <Station x={430} y={620} size={560} f={f} />
    <Probe x={800} y={800 + Math.sin(f / 12) * 8} size={240} f={f} variant="float" lamp={false} />
    <Plaque x={540} y={190} text="IT DOESN'T" size={120} bg={C.ink} fg={C.amber} />
  </g>
);
const e2: Shot = ({ f }) => (
  <g>
    <Space f={f} limb={1300} slide={22} />
    <Station x={260} y={560} size={520} f={f} />
    <Probe x={700} y={820 + Math.sin(f / 12) * 10} size={420} f={f} variant="float" lamp={false} />
    <Plaque x={540} y={190} text="STAYS BESIDE THE STATION" size={50} bg={C.ink} fg={C.cream} />
  </g>
);
const e3: Shot = ({ f }) => (
  <g>
    <Space f={f} limb={1200} slide={26} />
    <Station x={420} y={600} size={520} f={f} />
    <Probe x={780} y={740 + Math.sin(f / 12) * 8} size={260} f={f} variant="float" lamp={false} />
    <Plaque x={540} y={190} text="LAP AFTER LAP" size={100} bg={C.ink} fg={C.amber} />
  </g>
);

/** f - about 90 minutes a lap, 16 laps a day. */
const f1: Shot = ({ f, n }) => (
  <g>
    <Sky stops={BG_NIGHT} x={0} y={0} w={W} h={H} />
    <Orbit f={f} rate={0.07} />
    <Count x={540} y={190} f={f} a={0} b={90} f1={n - 6} unit=" MIN" w={560} size={130} />
    <Plaque x={540} y={1180} text="ONE LAP" size={80} bg={C.ink} fg={C.cream} />
  </g>
);
const f2: Shot = ({ f, n }) => (
  <g>
    <Sky stops={BG_NIGHT} x={0} y={0} w={W} h={H} />
    <Orbit f={f} rate={0.09} pips={Math.round(16 * ez(f, 0, n - 6))} />
    <Count x={540} y={190} f={f} a={0} b={16} f1={n - 6} unit=" LAPS" w={560} size={130} />
    <Plaque x={540} y={1180} text="EVERY DAY" size={80} bg={C.ink} fg={C.cream} />
  </g>
);
const f3: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_NIGHT} x={0} y={0} w={W} h={H} />
    <Orbit f={f} rate={0.12} pips={16} />
    <Plaque x={540} y={190} text="16 LAPS A DAY" size={90} bg={C.ink} fg={C.amber} />
  </g>
);

/** g - the probe does every lap with it. */
const g1: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_NIGHT} x={0} y={0} w={W} h={H} />
    <Orbit f={f} rate={0.09} probe />
    <Plaque x={540} y={190} text="THE PROBE TOO" size={100} bg={C.ink} fg={C.amber} />
  </g>
);
const g2: Shot = ({ f, n }) => (
  <g>
    <Sky stops={BG_NIGHT} x={0} y={0} w={W} h={H} />
    <Orbit f={f} rate={0.11} probe pips={Math.round(16 * ez(f, 0, n - 6))} />
    <Count x={540} y={190} f={f} a={0} b={16} f1={n - 6} unit=" LAPS" w={560} size={130} />
    <Plaque x={540} y={1180} text="SIDE BY SIDE" size={76} bg={C.ink} fg={C.cream} />
  </g>
);

/** h - nothing holds it up; gravity is about 90 %. */
const h1: Shot = ({ f }) => (
  <g>
    <Space f={f} limb={1350} slide={10} />
    <Probe x={540} y={640 + Math.sin(f / 10) * 12} size={380} f={f} variant="float" lamp={false} />
    <line x1={540} y1={860} x2={540} y2={1230} stroke={C.cream} strokeWidth={8} strokeDasharray="2 22" strokeLinecap="round" opacity={0.7} />
    <Plaque x={540} y={190} text="NOTHING HOLDS IT UP" size={60} bg={C.ink} fg={C.amber} />
    <Tick x={190} y={1280} pxPerM={240} frame={f} pose="shrug" expression="surprised" facing={1} />
  </g>
);
const h2: Shot = ({ f }) => (
  <g>
    <Space f={f} limb={1350} />
    <Arrows x={300} y0={420} y1={1150} f={f} dir={1} n={3} size={80} />
    <Arrows x={780} y0={420} y1={1150} f={f} dir={1} n={3} size={80} />
    <Probe x={540} y={700 + Math.sin(f / 10) * 12} size={340} f={f} variant="float" lamp={false} />
    <Plaque x={540} y={190} text="PULLED DOWN" size={96} bg={C.ink} fg={C.cream} />
  </g>
);
const h3: Shot = ({ f, n }) => (
  <g>
    <Space f={f} limb={1500} />
    <Dial x={540} y={700} r={290} v={0.9} f={f} shake={0.02} />
    <Plaque x={540} y={190} text="ABOUT 90 % AS HARD" size={64} bg={C.ink} fg={C.amber} scale={ez(f, 0, 8) * 0.1 + 0.9} />
    <Plaque x={540} y={1130} text="AS ON THE GROUND" size={56} bg={C.ink} fg={C.cream} opacity={ez(f, 6, n - 6)} />
  </g>
);

const q: Shot = ({ f }) => (
  <g>
    <Space f={f} limb={1400} />
    <Station x={330} y={640} size={420} f={f} />
    <Probe x={740} y={800} size={240} f={f} variant="float" lamp={false} />
    <Qmark f={f} x={540} y={1150} size={460} />
    <Plaque x={540} y={190} text="WHY DOESN'T IT FALL?" size={60} bg={C.ink} fg={C.amber} />
  </g>
);
const end: Shot = ({ f }) => (
  <EndShot f={f} stops={["#04121A", "#0B1B3A", "#102A52"]} q={["WHY DOESN'T", "IT FALL?"]}>
    <Probe x={940} y={1200} size={150} f={f} lamp={false} variant="float" />
  </EndShot>
);

export const ShortS65 = makeShort(timeline, [[a1, a2], [b1, b2], [c1, c2, c3], [d1, d2], [e1, e2, e3], [f1, f2, f3], [g1, g2], [h1, h2, h3], [q, end]]);
