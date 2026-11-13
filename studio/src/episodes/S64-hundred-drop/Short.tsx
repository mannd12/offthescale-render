import React from "react";
import { Sky, Tick } from "../../lib/illustrated";
import { buildTimeline, VoLine } from "../../lib/timeline";
import { EndShot, Chips, W, H, Shot, makeShort } from "../S41-dig-plate/vkit";
import { Qmark } from "../S46-peak-seafloor/kit46";
import { Bracket, Probe, Stamp } from "../L15-space-jump/props";
import { SkyColumn } from "../L15-space-jump/sky";
import { Arrows, BG_STUDIO, C, Count, Dial, HBar, MarkedDial, ModelChip, Plaque, Rings, Watch, ez, mix } from "../S61-record-peak/kit61";
import vo from "./vo.json";

/**
 * S64 - Mach 3.3 at forty kilometres (episodes/S64-hundred-drop). For L15, answered at 6:45. Vertical 1080x1920.
 * Every number here is L15 sources row 20 (OUR MODEL: 100 kg, 0.6 m wide, fixed drag, from rest at 100 km): 618 m/s at
 * 80 km, 874 at 60, 972 at 50, 1,043 at 40 km after 112 s, Mach 3.3 against a sound speed of about 317 m/s (rows 15,
 * 23); Baumgartner's Mach 1.25 is row 4; "more than twice" = 3.3 / 1.25. The OUR MODEL chip is on every shot.
 * Withheld: that the peak is near 36 km and the air then takes the speed back.
 */
export const timeline = buildTimeline(vo as VoLine[]);

const SK: React.FC<{ f: number; a: number; streak?: number; span?: number }> = ({ f, a, streak = 0, span = 16 }) => (
  <SkyColumn f={f} altTop={a + span / 2} altBottom={a - span / 2} x={0} y={0} w={W} h={H} streak={streak} />
);

/** a - let go at the 100 km line. */
const a1: Shot = ({ f }) => (
  <g>
    <SK f={f} a={100} />
    <line x1={90} y1={640} x2={990} y2={640} stroke={C.amber} strokeWidth={14} strokeDasharray="4 24" strokeLinecap="round" />
    <Probe x={540} y={900 + Math.sin(f / 8) * 14} size={380} f={f} variant="float" />
    <Plaque x={540} y={220} text="100 KM" size={150} bg={C.ink} fg={C.amber} w={520} />
    <ModelChip y={62} />
  </g>
);
const a2: Shot = ({ f, n }) => {
  const k = ez(f, 2, n - 2);
  return (
    <g>
      <SK f={f} a={mix(100, 90, k)} streak={50 * k} />
      <Probe x={540} y={mix(900, 960, k)} size={380} f={f} trail={260 * k} />
      <Plaque x={540} y={220} text="LET GO" size={150} bg={C.ink} fg={C.amber} w={520} />
      <ModelChip y={62} />
    </g>
  );
};

/** b - what the model is. */
const b1: Shot = ({ f }) => (
  <g>
    <SK f={f} a={96} streak={30} />
    <Probe x={540} y={800 + Math.sin(f / 5) * 10} size={380} f={f} trail={140} />
    <Plaque x={540} y={220} text="100 KG" size={150} bg={C.ink} fg={C.amber} w={520} scale={ez(f, 0, 8)} />
    <ModelChip y={62} />
  </g>
);
const b2: Shot = ({ f, n }) => (
  <g>
    <SK f={f} a={92} streak={30} />
    <Probe x={540} y={780 + Math.sin(f / 5) * 10} size={380} f={f} trail={140} />
    <Bracket x1={400} y1={1060} x2={680} y2={1060} draw={ez(f, 0, n - 6)} color={C.cream} />
    <Plaque x={540} y={1160} text="0.6 M WIDE" size={90} bg={C.ink} fg={C.cream} scale={ez(f, 6, 14)} />
    <Plaque x={540} y={220} text="100 KG" size={110} bg={C.ink} fg={C.amber} w={420} />
    <ModelChip y={62} />
  </g>
);
const b3: Shot = ({ f }) => (
  <g>
    <SK f={f} a={90} streak={40} />
    <Arrows x={250} y0={400} y1={1150} f={f} dir={1} n={3} size={80} color={C.cream} />
    <Arrows x={830} y0={400} y1={1150} f={f} dir={1} n={3} size={80} color={C.cream} />
    <Probe x={540} y={760} size={360} f={f} trail={200} />
    <Plaque x={540} y={220} text="STRAIGHT DOWN" size={92} bg={C.ink} fg={C.cream} />
    <ModelChip y={62} />
  </g>
);

/** c - 80 km: 618 m/s. */
const c1: Shot = ({ f, n }) => (
  <g>
    <SK f={f} a={mix(88, 80, ez(f, 0, n))} streak={50} />
    <Probe x={540} y={720} size={380} f={f} trail={280} />
    <Plaque x={540} y={220} text="80 KM" size={140} bg={C.ink} fg={C.cream} w={460} />
    <Count x={540} y={1090} f={f} a={0} b={618} f1={n - 8} unit=" M/S" w={720} size={120} />
    <ModelChip y={62} />
  </g>
);
const c2: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
    <Dial x={540} y={700} r={320} v={618 / 1100} f={f} shake={0.02} />
    <Plaque x={540} y={220} text="618 M/S" size={140} bg={C.ink} fg={C.amber} w={600} />
    <ModelChip y={62} />
  </g>
);

/** d - 60 km: 874; 50 km: 972. */
const d1: Shot = ({ f, n }) => (
  <g>
    <SK f={f} a={mix(66, 58, ez(f, 0, n))} streak={60} />
    <Probe x={540} y={720} size={380} f={f} trail={320} />
    <Plaque x={540} y={220} text="60 KM" size={140} bg={C.ink} fg={C.cream} w={460} />
    <Count x={540} y={1090} f={f} a={618} b={874} f1={n - 8} unit=" M/S" w={720} size={120} />
    <ModelChip y={62} />
  </g>
);
const d2: Shot = ({ f, n }) => (
  <g>
    <SK f={f} a={mix(54, 46, ez(f, 0, n))} streak={70} />
    <Probe x={540} y={720} size={380} f={f} trail={360} />
    <Plaque x={540} y={220} text="50 KM" size={140} bg={C.ink} fg={C.cream} w={460} />
    <Count x={540} y={1090} f={f} a={874} b={972} f1={n - 8} unit=" M/S" w={720} size={120} />
    <ModelChip y={62} />
  </g>
);

/** e - 40 km after 112 s: 1,043 m/s. */
const e1: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 6);
  return (
    <g>
      <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
      <Watch x={540} y={700} r={310} k={k * (112 / 120)} full={120} plate={`${Math.round(112 * k)} S`} f={f} />
      <Plaque x={540} y={220} text="AFTER 112 S" size={104} bg={C.ink} fg={C.amber} />
      <ModelChip y={62} />
    </g>
  );
};
const e2: Shot = ({ f }) => (
  <g>
    <SK f={f} a={40} streak={80} />
    <Probe x={540} y={720} size={400} f={f} trail={400} />
    <Plaque x={540} y={220} text="40 KM" size={150} bg={C.ink} fg={C.cream} w={480} />
    <ModelChip y={62} />
  </g>
);
const e3: Shot = ({ f, n }) => (
  <g>
    <SK f={f} a={38} streak={80} />
    <Probe x={540} y={820} size={340} f={f} trail={380} />
    <Count x={540} y={260} f={f} a={972} b={1043} f1={n - 8} unit=" M/S" w={860} size={130} />
    <ModelChip y={62} />
  </g>
);

/** f - Mach 3.3 against a sound speed of about 317 m/s. */
const f1: Shot = ({ f }) => (
  <g>
    <SK f={f} a={38} streak={80} />
    <Rings x={540} y={960} f={f} n={3} period={22} max={340} color={C.foam} width={10} opacity={0.6} />
    <Probe x={540} y={1000 + Math.sin(f / 3) * 8} size={420} f={f} trail={380} />
    <Stamp x={540} y={520} text="MACH 3.3" age={f} size={130} rotate={-5} />
    <ModelChip y={62} />
  </g>
);
const f2: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
    <MarkedDial x={540} y={740} r={320} v={0.95} m={317 / 1100} label="SOUND" f={f} shake={0.025} />
    <Plaque x={540} y={220} text="SOUND: ABOUT 317 M/S" size={56} bg={C.ink} fg={C.cream} />
    <ModelChip y={62} />
  </g>
);
const f3: Shot = ({ f }) => (
  <g>
    <SK f={f} a={37} streak={90} />
    <Rings x={540} y={620} f={f} n={3} period={20} max={420} color={C.foam} width={12} opacity={0.6} />
    <Probe x={540} y={760 + Math.sin(f / 3) * 8} size={380} f={f} trail={420} />
    <Plaque x={540} y={220} text="MACH 3.3" size={150} bg={C.ink} fg={C.amber} w={560} scale={1 + 0.04 * Math.sin(f / 4)} />
    <ModelChip y={62} />
  </g>
);

/** g - against the real record: Mach 1.25 vs Mach 3.3, bar scale 3.5 Mach = full. */
const g1: Shot = ({ f, n }) => (
  <g>
    <Sky stops={["#0B1B3A", "#1B3A6B", "#2A6FA8"]} x={0} y={0} w={W} h={H} />
    <Plaque x={540} y={560} text="BAUMGARTNER: MACH 1.25" size={46} bg={C.ink} fg={C.cream} />
    <HBar x={100} y={680} w={880} k={ez(f, 0, n - 4) * (1.25 / 3.5)} color={C.foam} />
    <Probe x={100 + 40 + 840 * ez(f, 0, n - 4) * (1.25 / 3.5)} y={850} size={180} f={f} tilt={-90} lamp={false} />
    <Plaque x={540} y={220} text="THE REAL RECORD" size={84} bg={C.ink} fg={C.foam} />
    <ModelChip y={62} />
  </g>
);
const g2: Shot = ({ f, n }) => (
  <g>
    <Sky stops={["#0B1B3A", "#1B3A6B", "#2A6FA8"]} x={0} y={0} w={W} h={H} />
    <Plaque x={540} y={560} text="BAUMGARTNER: MACH 1.25" size={46} bg={C.ink} fg={C.cream} />
    <HBar x={100} y={680} w={880} k={1.25 / 3.5} color={C.foam} />
    <Plaque x={540} y={860} text="OUR PROBE: MACH 3.3" size={46} bg={C.ink} fg={C.amber} />
    <HBar x={100} y={980} w={880} k={ez(f, 0, n - 4) * (3.3 / 3.5)} color={C.amber} />
    <Probe x={100 + 40 + 840 * ez(f, 0, n - 4) * (3.3 / 3.5)} y={1140} size={180} f={f} tilt={-90} lamp={false} trail={120} />
    <ModelChip y={62} />
  </g>
);
const g3: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
    <HBar x={100} y={500} w={880} k={1.25 / 3.5} color={C.foam} h={56} />
    <HBar x={100} y={600} w={880} k={3.3 / 3.5} color={C.amber} h={56} />
    <Plaque x={540} y={780} text="MORE THAN 2X" size={104} bg={C.ink} fg={C.amber} w={800} scale={1 + 0.05 * Math.sin(f / 4)} />
    <Plaque x={540} y={220} text="HIS SPEED" size={90} bg={C.ink} fg={C.cream} />
    <Tick x={190} y={1330} pxPerM={230} frame={f} pose="point" expression="surprised" facing={1} />
    <ModelChip y={62} />
  </g>
);

/** h - still speeding up, forty kilometres from the ground. */
const h1: Shot = ({ f, n }) => {
  const k = ez(f, 0, n);
  return (
    <g>
      <SK f={f} a={mix(46, 38, k)} streak={90} />
      <line x1={90} y1={mix(1100, 300, k)} x2={990} y2={mix(1100, 300, k)} stroke={C.cream} strokeWidth={12} strokeDasharray="4 22" strokeLinecap="round" />
      <Plaque x={540} y={mix(1100, 300, k) + 70} text="40 KM" size={60} bg={C.ink} fg={C.cream} />
      <Probe x={540} y={760} size={380} f={f} trail={420} />
      <Plaque x={540} y={220} text="STILL SPEEDING UP" size={74} bg={C.ink} fg={C.amber} />
      <ModelChip y={62} />
    </g>
  );
};
const h2: Shot = ({ f, n }) => (
  <g>
    <SkyColumn f={f} altTop={46} altBottom={-4} x={0} y={0} w={W} h={H} />
    <Probe x={420} y={400} size={260} f={f} trail={200} />
    <Bracket x1={640} y1={440} x2={640} y2={1150} draw={ez(f, 0, n - 4)} color={C.amber} />
    <Plaque x={540} y={220} text="40 KM TO THE GROUND" size={58} bg={C.ink} fg={C.cream} />
    <ModelChip y={62} />
  </g>
);
const h3: Shot = ({ f, n }) => {
  const k = ez(f, 0, n);
  return (
    <g>
      <SkyColumn f={f} altTop={46} altBottom={-4} x={0} y={0} w={W} h={H} />
      <Probe x={420} y={mix(400, 620, k)} size={300} f={f} trail={240} />
      <Plaque x={620} y={mix(470, 700, k)} text="40 KM LEFT" size={70} bg={C.ink} fg={C.amber} />
      <Tick x={840} y={1250} pxPerM={230} frame={f} pose="point" expression="worried" facing={-1} />
      <ModelChip y={62} />
    </g>
  );
};

const q: Shot = ({ f }) => (
  <g>
    <Sky stops={["#0A3C4C", "#11707A", "#1FA69A"]} x={0} y={0} w={W} h={H} />
    <Chips f={f} n={12} y0={150} y1={1150} color={C.gold} speed={7} opacity={0.35} seed={6} />
    <Probe x={300} y={760} size={280} f={f} trail={140} />
    <Qmark f={f} x={700} y={900} size={640} />
    <Plaque x={540} y={220} text="GROUND AT MACH 3?" size={70} bg={C.ink} fg={C.amber} />
    <ModelChip y={62} />
  </g>
);
const end: Shot = ({ f }) => (
  <EndShot f={f} stops={["#0A3C4C", "#11707A", "#1FA69A"]} q={["GROUND AT", "MACH 3?"]}>
    <Probe x={940} y={1200} size={150} f={f} lamp={false} />
  </EndShot>
);

export const ShortS64 = makeShort(timeline, [[a1, a2], [b1, b2, b3], [c1, c2], [d1, d2], [e1, e2, e3], [f1, f2, f3], [g1, g2, g3], [h1, h2, h3], [q, end]]);
