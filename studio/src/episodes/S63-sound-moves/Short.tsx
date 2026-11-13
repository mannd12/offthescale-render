import React from "react";
import { Sky, Tick } from "../../lib/illustrated";
import { buildTimeline, VoLine } from "../../lib/timeline";
import { EndShot, Chips, W, H, Shot, makeShort } from "../S41-dig-plate/vkit";
import { Qmark } from "../S46-peak-seafloor/kit46";
import { Probe, Stamp } from "../L15-space-jump/props";
import { SkyColumn } from "../L15-space-jump/sky";
import { BG_DEEP, BG_STUDIO, C, Count, Dial, Plaque, Rings, T, ez, mix } from "../S61-record-peak/kit61";
import vo from "./vo.json";

/**
 * S63 - Mach 1 isn't one speed (episodes/S63-sound-moves). For L15, answered at 4:21. Vertical 1080x1920.
 * Numbers (sources.md, L15 rows): #15 sound about 340 m/s at the ground, about 295 m/s (1,062 km/h) at 20 km;
 * #4 Baumgartner 1,357.6 km/h = Mach 1.25; #15 (arithmetic 1,357.6 / 1.25) local sound speed about 1,086 km/h.
 * Withheld: that the speed of sound follows the air's temperature (no temperature or cold anywhere).
 */
export const timeline = buildTimeline(vo as VoLine[]);

const Ground: React.FC = () => (
  <g>
    <rect x={0} y={1060} width={W} height={300} fill={C.rust} />
    <rect x={0} y={1060} width={W} height={24} fill={C.orange} />
  </g>
);
const Flyer: React.FC<{ x: number; y: number; f: number; size?: number }> = ({ x, y, f, size = 260 }) => <Probe x={x} y={y} size={size} f={f} tilt={-90} lamp={false} trail={0} />;

/** a - a probe lane and a sound lane. */
const a1: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
    <rect x={90} y={560} width={860} height={130} rx={65} fill={C.ink} opacity={0.85} />
    <rect x={90} y={820} width={860} height={130} rx={65} fill={C.ink} opacity={0.85} />
    <Flyer x={190} y={625 + Math.sin(f / 4) * 6} f={f} />
    <Rings x={190} y={885} f={f} n={3} period={36} max={110} color={C.foam} width={9} />
    <T x={540} y={1060} text="PROBE VS SOUND" size={60} color={C.cream} />
    <Plaque x={540} y={190} text="RACE THE SOUND" size={90} bg={C.ink} fg={C.amber} />
    <Tick x={870} y={1330} pxPerM={200} frame={f} pose="point" expression="determined" facing={-1} />
  </g>
);
const a2: Shot = ({ f, n }) => {
  const k = ez(f, 2, n - 2);
  return (
    <g>
      <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
      <rect x={90} y={560} width={860} height={130} rx={65} fill={C.ink} opacity={0.85} />
      <rect x={90} y={820} width={860} height={130} rx={65} fill={C.ink} opacity={0.85} />
      <Flyer x={mix(190, 760, k)} y={625} f={f} />
      <Rings x={mix(190, 840, k)} y={885} f={f} n={3} period={30} max={110} color={C.foam} width={9} />
      <Plaque x={540} y={190} text="WHO WINS?" size={110} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** b - sound at the ground: about 340 m/s. */
const b1: Shot = ({ f }) => (
  <g>
    <Sky stops={["#2A8FC4", "#4FB5DE", "#9BD6E8"]} x={0} y={0} w={W} h={H} />
    <Ground />
    <Rings x={540} y={900} f={f} n={5} period={26} max={620} color={C.cream} width={12} />
    <circle cx={540} cy={900} r={34} fill={C.amber} />
    <Plaque x={540} y={190} text="AT THE GROUND" size={90} bg={C.ink} fg={C.cream} />
  </g>
);
const b2: Shot = ({ f, n }) => (
  <g>
    <Sky stops={["#2A8FC4", "#4FB5DE", "#9BD6E8"]} x={0} y={0} w={W} h={H} />
    <Ground />
    <Rings x={540} y={780} f={f} n={5} period={26} max={620} color={C.cream} width={12} />
    <Probe x={540} y={780} size={240} f={f} variant="float" lamp={false} />
    <Count x={540} y={190} f={f} a={0} b={340} f1={n - 6} unit=" M/S" w={700} size={130} />
  </g>
);
const b3: Shot = ({ f }) => (
  <g>
    <Sky stops={["#2A8FC4", "#4FB5DE", "#9BD6E8"]} x={0} y={0} w={W} h={H} />
    <Ground />
    <Rings x={540} y={820} f={f} n={5} period={26} max={640} color={C.cream} width={12} />
    <Plaque x={540} y={190} text="ABOUT 340 M/S" size={100} bg={C.ink} fg={C.amber} scale={1 + 0.04 * Math.sin(f / 4)} />
    <Tick x={190} y={1330} pxPerM={250} frame={f} pose="point" expression="happy" facing={1} />
  </g>
);

/** c - twenty kilometres up: about 295 m/s = 1,062 km/h. */
const c1: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 2);
  return (
    <g>
      <SkyColumn f={f} altTop={mix(6, 24, k)} altBottom={mix(-2, 16, k)} x={0} y={0} w={W} h={H} ground={k < 0.2} />
      <Rings x={540} y={820} f={f} n={4} period={60} max={560} color={C.cream} width={12} />
      <Probe x={540} y={820} size={260} f={f} variant="float" lamp={false} />
      <Plaque x={540} y={190} text="20 KM UP" size={110} bg={C.ink} fg={C.amber} />
    </g>
  );
};
const c2: Shot = ({ f, n }) => (
  <g>
    <SkyColumn f={f} altTop={24} altBottom={16} x={0} y={0} w={W} h={H} />
    <Rings x={540} y={780} f={f} n={4} period={72} max={560} color={C.cream} width={12} />
    <Probe x={540} y={780} size={240} f={f} variant="float" lamp={false} />
    <Count x={540} y={190} f={f} a={340} b={295} f1={n - 6} unit=" M/S" w={700} size={130} />
  </g>
);
const c3: Shot = ({ f }) => (
  <g>
    <SkyColumn f={f} altTop={24} altBottom={16} x={0} y={0} w={W} h={H} />
    <Rings x={540} y={760} f={f} n={4} period={72} max={560} color={C.cream} width={12} />
    <Plaque x={540} y={190} text="ABOUT 295 M/S" size={100} bg={C.ink} fg={C.cream} />
    <Stamp x={540} y={760} text="1,062 KM/H" age={f} size={100} rotate={-5} />
  </g>
);

/** d - Mach 1 is a marker that slides. Bar scale: x(v) = 100 + (v - 280) / 80 * 880, v in m/s. */
const XV = (v: number) => 100 + ((v - 280) / 80) * 880;
const Slide: React.FC<{ f: number; x: number; ground: number }> = ({ f, x, ground }) => (
  <g>
    <rect x={100} y={740} width={880} height={36} rx={18} fill={C.ink} opacity={0.9} />
    <line x1={x} y1={640} x2={x} y2={870} stroke={C.amber} strokeWidth={16} strokeLinecap="round" />
    <Plaque x={x} y={570} text="MACH 1" size={64} bg={C.ink} fg={C.amber} />
    <Probe x={x} y={1010 + Math.sin(f / 5) * 8} size={200} f={f} tilt={180} lamp={false} />
    <T x={XV(340)} y={940} text="GROUND" size={40} color={C.cream} opacity={ground} />
    <T x={XV(295)} y={940} text="20 KM" size={40} color={C.cream} opacity={1 - ground} />
  </g>
);
const d1: Shot = ({ f, n }) => {
  const k = ez(f, 4, n - 4);
  return (
    <g>
      <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
      <Slide f={f} x={mix(XV(340), XV(295), k)} ground={1 - k} />
      <Plaque x={540} y={190} text="MACH 1 SLIDES" size={96} bg={C.ink} fg={C.amber} />
    </g>
  );
};
const d2: Shot = ({ f }) => {
  const k = 0.5 + 0.5 * Math.sin(f / 7);
  return (
    <g>
      <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
      <Slide f={f} x={mix(XV(295), XV(340), k)} ground={k} />
      <Plaque x={540} y={190} text="NOT A FIXED SPEED" size={74} bg={C.ink} fg={C.cream} />
      <Tick x={190} y={1330} pxPerM={230} frame={f} pose="shrug" expression="thinking" facing={1} />
    </g>
  );
};

/** e - Baumgartner's top speed: 1,357.6 km/h = Mach 1.25. */
const e1: Shot = ({ f, n }) => (
  <g>
    <Sky stops={["#0B1B3A", "#1B3A6B", "#2A6FA8"]} x={0} y={0} w={W} h={H} />
    <Dial x={540} y={780} r={320} v={mix(0.1, 0.905, ez(f, 0, n - 6))} f={f} shake={ez(f, n - 8, n) * 0.02} />
    <Count x={540} y={190} f={f} a={0} b={1357.6} d={1} f1={n - 8} unit=" KM/H" w={860} size={100} />
  </g>
);
const e2: Shot = ({ f, n }) => (
  <g>
    <Sky stops={["#0B1B3A", "#1B3A6B", "#2A6FA8"]} x={0} y={0} w={W} h={H} />
    <Rings x={mix(150, 700, ez(f, 0, n))} y={760} f={f} n={3} period={28} max={220} color={C.foam} width={9} />
    <Flyer x={mix(150, 760, ez(f, 0, n))} y={760} f={f} size={300} />
    <Stamp x={540} y={420} text="MACH 1.25" age={f} size={110} rotate={-5} />
  </g>
);
const e3: Shot = ({ f }) => (
  <g>
    <Sky stops={["#0B1B3A", "#1B3A6B", "#2A6FA8"]} x={0} y={0} w={W} h={H} />
    <Chips f={f} n={12} y0={150} y1={1150} color={C.foam} speed={14} opacity={0.4} seed={5} />
    <Plaque x={540} y={420} text="1,357.6 KM/H" size={96} bg={C.ink} fg={C.amber} w={830} />
    <Plaque x={540} y={620} text="MACH 1.25" size={96} bg={C.ink} fg={C.cream} w={620} />
    <Probe x={540} y={950 + Math.sin(f / 5) * 10} size={300} f={f} />
  </g>
);

/** f - divide one by the other: about 1,086 km/h. */
const f1: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
    <Plaque x={mix(-400, 540, ez(f, 0, 8))} y={380} text="1,357.6 KM/H" size={96} bg={C.ink} fg={C.amber} w={830} />
    <T x={540} y={700} text="÷" size={220} color={C.cream} />
    <Plaque x={mix(1480, 540, ez(f, 4, 12))} y={920} text="MACH 1.25" size={96} bg={C.ink} fg={C.cream} w={620} />
  </g>
);
const f2: Shot = ({ f, n }) => (
  <g>
    <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
    <Rings x={540} y={720} f={f} n={4} period={50} max={480} color={C.foam} width={9} opacity={0.5} />
    <Plaque x={540} y={190} text="LOCAL SOUND SPEED" size={64} bg={C.ink} fg={C.cream} />
    <Count x={540} y={720} f={f} a={0} b={1086} f1={n - 8} unit=" KM/H" w={860} size={110} />
  </g>
);
const f3: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
    <Stamp x={540} y={600} text="ABOUT 1,086" size={100} age={f} rotate={-4} />
    <Plaque x={540} y={190} text="KM/H, HIGH UP" size={90} bg={C.ink} fg={C.cream} />
    <Tick x={190} y={1330} pxPerM={230} frame={f} pose="point" expression="surprised" facing={1} />
  </g>
);

/** g - the new number is neither of the other two. Bar scale: x(v) = 100 + (v - 1040) / 200 * 880, v in km/h. */
const XK = (v: number) => 100 + ((v - 1040) / 200) * 880;
const Marks: React.FC<{ f: number; show: number }> = ({ f, show }) => (
  <g>
    <rect x={100} y={740} width={880} height={36} rx={18} fill={C.ink} opacity={0.9} />
    <line x1={XK(1224)} y1={660} x2={XK(1224)} y2={860} stroke={C.cream} strokeWidth={14} strokeLinecap="round" />
    <Plaque x={XK(1224)} y={600} text="GROUND" size={46} bg={C.ink} fg={C.cream} />
    <line x1={XK(1062)} y1={660} x2={XK(1062)} y2={860} stroke={C.cream} strokeWidth={14} strokeLinecap="round" />
    <Plaque x={XK(1062) + 20} y={600} text="1,062" size={46} bg={C.ink} fg={C.cream} />
    <g opacity={show}>
      <line x1={XK(1086)} y1={660} x2={XK(1086)} y2={860} stroke={C.amber} strokeWidth={18} strokeLinecap="round" />
      <Plaque x={XK(1086) + 60} y={930} text="1,086" size={52} bg={C.ink} fg={C.amber} scale={1 + 0.05 * Math.sin(f / 4)} />
    </g>
  </g>
);
const g1: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
    <Marks f={f} show={0} />
    <Probe x={540} y={1090 + Math.sin(f / 5) * 8} size={200} f={f} tilt={180} lamp={false} />
    <Plaque x={540} y={190} text="NOT AT THE GROUND" size={72} bg={C.ink} fg={C.cream} />
  </g>
);
const g2: Shot = ({ f, n }) => (
  <g>
    <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
    <Marks f={f} show={ez(f, 0, 8)} />
    <Probe x={mix(XK(1224), XK(1086), ez(f, 0, n - 4))} y={1090} size={200} f={f} tilt={180} lamp={false} />
    <Plaque x={540} y={190} text="NOR AT 20 KM" size={90} bg={C.ink} fg={C.amber} />
  </g>
);

/** h - a ladder of heights, each with its own barrier mark; the probe falls down it. */
const ROWS = [
  { y: 400, x: 760 },
  { y: 600, x: 560 },
  { y: 800, x: 380 },
  { y: 1000, x: 470 },
];
const Ladder: React.FC<{ f: number; py: number }> = ({ f, py }) => (
  <g>
    {ROWS.map((r, i) => {
      const hit = Math.abs(py - r.y) < 70;
      return (
        <g key={i}>
          <rect x={120} y={r.y - 18} width={840} height={36} rx={18} fill={C.ink} opacity={0.9} />
          <line x1={r.x} y1={r.y - 70} x2={r.x} y2={r.y + 70} stroke={C.amber} strokeWidth={16} strokeLinecap="round" />
          {hit ? <circle cx={r.x} cy={r.y} r={50 + 30 * Math.sin(f)} fill="none" stroke={C.cream} strokeWidth={10} /> : null}
        </g>
      );
    })}
  </g>
);
const h1: Shot = ({ f, n }) => {
  const py = mix(260, 700, ez(f, 0, n));
  return (
    <g>
      <Sky stops={["#0B1B3A", "#1B3A6B", "#2A6FA8"]} x={0} y={0} w={W} h={H} />
      <Ladder f={f} py={py} />
      <Probe x={mix(760, 460, ez(f, 0, n))} y={py - 40} size={200} f={f} trail={100} />
      <Plaque x={540} y={190} text="NEW BARRIER, EVERY HEIGHT" size={44} bg={C.ink} fg={C.amber} />
    </g>
  );
};
const h2: Shot = ({ f, n }) => {
  const py = mix(700, 1090, ez(f, 0, n));
  return (
    <g>
      <Sky stops={["#2A8FC4", "#4FB5DE", "#9BD6E8"]} x={0} y={0} w={W} h={H} />
      <Ladder f={f} py={py} />
      <Probe x={mix(460, 420, ez(f, 0, n))} y={py - 40} size={200} f={f} trail={100} />
      <Plaque x={540} y={190} text="EVERY HEIGHT, NEW MARK" size={50} bg={C.ink} fg={C.cream} />
    </g>
  );
};

const q: Shot = ({ f }) => (
  <g>
    <Sky stops={["#0A3C4C", "#11707A", "#1FA69A"]} x={0} y={0} w={W} h={H} />
    <Chips f={f} n={12} y0={150} y1={1150} color={C.gold} speed={7} opacity={0.35} seed={6} />
    <Rings x={320} y={820} f={f} n={4} period={50} max={420} color={C.cream} width={10} opacity={0.6} />
    <Flyer x={320} y={820} f={f} size={260} />
    <Qmark f={f} x={720} y={920} size={620} />
    <Plaque x={540} y={190} text="WHAT SETS IT?" size={96} bg={C.ink} fg={C.amber} />
  </g>
);
const end: Shot = ({ f }) => (
  <EndShot f={f} stops={["#0A3C4C", "#11707A", "#1FA69A"]} q={["WHAT DECIDES", "SOUND'S SPEED?"]}>
    <Probe x={940} y={1200} size={150} f={f} lamp={false} />
  </EndShot>
);

export const ShortS63 = makeShort(timeline, [[a1, a2], [b1, b2, b3], [c1, c2, c3], [d1, d2], [e1, e2, e3], [f1, f2, f3], [g1, g2], [h1, h2], [q, end]]);

