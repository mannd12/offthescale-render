import React from "react";
import { Sky, Tick } from "../../lib/illustrated";
import { buildTimeline, VoLine } from "../../lib/timeline";
import { C, Chips, EndShot, Glow, Plaque, Rain, T, W, H, Shot, ez, makeShort, mix } from "../S41-dig-plate/vkit";
import { Qmark } from "../S46-peak-seafloor/kit46";
import { Probe } from "../L14-earth-tunnel/props";
import { AirHaze } from "../L14-earth-tunnel/tunnel";
import { BG_DEEP, BG_NIGHT, BG_STUDIO, Dial, Shaft, Watch } from "../S56-fall-clock/kit56";
import vo from "./vo.json";

/**
 * S57 - the tunnel full of air (episodes/S57-air-tunnel). For L14, answered at 2:48. Vertical 1080x1920.
 * Numbers (sources.md, L14 rows): #1 38 min (shown "38 MIN"); #2 nearly 8 km/s; #18 more than 20x the speed of sound;
 * #8 steady speed almost at once, pressure and density climb (no 175 km / 420 km); #9 about 1.8 years.
 * Why the air stops the climb (the square law, terminal velocity) and the pump-it-out fix are withheld.
 */
export const timeline = buildTimeline(vo as VoLine[]);

/** a - night desert, the hatch lid swings open and the probe drops down the shaft. */
const a: Shot = ({ f, n }) => {
  const k = ez(f, 8, n - 2);
  const open = ez(f, 0, 10);
  return (
    <g>
      <Sky stops={BG_NIGHT} x={0} y={0} w={W} h={H} />
      <Chips f={f} n={12} y0={80} y1={460} color={C.foam} speed={3} opacity={0.5} seed={3} />
      <rect x={0} y={500} width={W} height={60} fill="#C98A4B" />
      <Shaft f={f * (k > 0 ? 1 : 0.2)} x={620} w={260} y0={560} y1={1250} speed={18} />
      <ellipse cx={620} cy={528} rx={150} ry={30} fill={C.ink} />
      <g transform={`translate(470 528) rotate(${-open * 70})`}>
        <rect x={0} y={-14} width={300} height={28} rx={10} fill={C.apricot} stroke={C.ink} strokeWidth={6} />
      </g>
      <Probe x={620} y={mix(500, 960, k)} size={240} f={f} lamp={k > 0} />
      <Tick x={240} y={500} pxPerM={250} frame={f} pose="point" expression="happy" facing={1} />
      <Plaque x={540} y={190} text="DROP IT IN" size={110} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** b - the speed dial climbs, the walls blur. */
const b: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 4);
  return (
    <g>
      <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
      <Rain f={f} n={24} x0={40} x1={1040} color={C.foam} speed={46} len={420} width={12} opacity={0.6} seed={5} />
      <Dial x={540} y={600} r={320} v={k} shake={k > 0.95 ? 0.03 : 0} f={f} />
      <Probe x={540} y={1130} size={170} f={f} lamp={false} />
      <Plaque x={540} y={190} text="NO AIR IN THE WAY" size={74} bg={C.ink} fg={C.cream} />
    </g>
  );
};

/** c - a stopwatch stamps 38 MIN. */
const c: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 6);
  return (
    <g>
      <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
      <Glow x={540} y={620} r={640} color={C.gold} f={f} strength={0.5} />
      <Watch x={540} y={620} r={330} k={k * (38 / 60)} full={60} f={f} />
      <Plaque x={540} y={190} text="38 MIN" size={150} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** d - the needle pins at 8 km/s, shaking. */
const d: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
    <Rain f={f} n={20} x0={40} x1={1040} color={C.foam} speed={40} len={380} width={12} opacity={0.5} seed={8} />
    <Dial x={540} y={640} r={330} v={1} shake={0.04} f={f} />
    <Plaque x={540} y={1130} text="NEARLY 8 KM/S" size={90} bg={C.ink} fg={C.amber} scale={1 + 0.04 * Math.sin(f / 3)} />
  </g>
);

/** e - a tall scale: the speed of sound marker low down, the probe rising far above it. */
const e: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 4);
  const top = 260;
  const bot = 1120;
  return (
    <g>
      <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
      <rect x={300} y={top} width={34} height={bot - top} rx={17} fill={C.ink} />
      <rect x={306} y={mix(bot, top, k)} width={22} height={mix(0, bot - top, k)} rx={11} fill={C.amber} />
      <path d={`M340 ${bot - 36} H640`} stroke={C.cream} strokeWidth={8} strokeDasharray="22 14" strokeLinecap="round" />
      <T x={700} y={bot - 20} text="SOUND" size={64} color={C.cream} align="start" />
      <Probe x={317} y={mix(bot, top, k) - 40} size={190} f={f} lamp={false} tilt={180} />
      <Plaque x={540} y={190} text="SPEED OF SOUND" size={84} bg={C.ink} fg={C.cream} />
    </g>
  );
};

/** f - "more than 20x": a big number slams in, Tick looks up. */
const f_: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
    <Glow x={540} y={620} r={640} color={C.gold} f={f} strength={0.6} />
    <Plaque x={540} y={620} text="20X+" size={300} bg={C.ink} fg={C.amber} w={760} scale={ez(f, 0, 8) * (1 + 0.04 * Math.sin(f / 4))} />
    <Plaque x={420} y={900} text="SPEED OF SOUND" size={64} bg={C.ink} fg={C.cream} />
    <Tick x={970} y={1250} pxPerM={250} frame={f} pose="point" expression="surprised" facing={-1} />
  </g>
);

/** g - haze floods the shaft from the top. */
const g: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 4);
  return (
    <g>
      <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
      <Shaft f={f} x={540} w={360} y0={260} y1={1240} speed={20} />
      <AirHaze f={f} x={360} w={360} y0={260} y1={1240} speed={22} density={0.25 * k} seed={2} />
      <Probe x={540} y={780} size={280} f={f} />
      <Plaque x={540} y={190} text="FULL OF AIR" size={110} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** h - the haze thickens, the probe labours. */
const h: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
    <Shaft f={f} x={540} w={360} y0={260} y1={1240} speed={12} />
    <AirHaze f={f} x={360} w={360} y0={260} y1={1240} speed={14} density={0.55} seed={4} />
    <Probe x={540 + Math.sin(f / 2) * 6} y={780} size={280} f={f} />
    <Plaque x={540} y={190} text="THE REAL TUNNEL" size={86} bg={C.ink} fg={C.cream} />
  </g>
);

const ghost = (x: number, y: number, r: number) => {
  const a = (30 * Math.PI) / 180;
  return [x + Math.cos(a) * r * 0.78, y + Math.sin(a) * r * 0.78] as const;
};

/** i - the needle stops dead at a low mark while the ghost of 8 km/s hangs far above. */
const i_: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 10);
  const [gx, gy] = ghost(540, 620, 320);
  return (
    <g>
      <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
      <Dial x={540} y={620} r={320} v={0.12 * k} f={f} />
      <line x1={540} y1={620} x2={gx} y2={gy} stroke={C.amber} strokeWidth={10} strokeDasharray="22 16" strokeLinecap="round" opacity={0.7} />
      <T x={gx + 20} y={gy + 70} text="8 KM/S" size={56} color={C.amber} align="start" />
      <Plaque x={540} y={1100} text="STEADY SPEED" size={86} bg={C.ink} fg={C.cream} scale={ez(f, n - 14, n - 6)} />
    </g>
  );
};

/** j - the probe crawls at a steady pace through haze. */
const j: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
    <Shaft f={f} x={540} w={360} y0={260} y1={1240} speed={7} />
    <AirHaze f={f} x={360} w={360} y0={260} y1={1240} speed={8} density={0.45} seed={6} />
    <Probe x={540} y={700} size={300} f={f} />
    <Plaque x={540} y={190} text="ALMOST AT ONCE" size={90} bg={C.ink} fg={C.amber} />
  </g>
);

/** k - the ghost needle trembles out of reach; Tick stretches for it. */
const k_: Shot = ({ f }) => {
  const [gx, gy] = ghost(540, 560, 300);
  return (
    <g>
      <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
      <Dial x={540} y={560} r={300} v={0.12} f={f} />
      <line x1={540} y1={560} x2={gx + Math.sin(f * 2) * 8} y2={gy + Math.cos(f * 2.3) * 8} stroke={C.amber} strokeWidth={10} strokeDasharray="22 16" strokeLinecap="round" opacity={0.7} />
      <Tick x={970} y={1250} pxPerM={250} frame={f} pose="point" expression="worried" facing={-1} />
      <Plaque x={400} y={1060} text="NOWHERE NEAR" size={80} bg={C.ink} fg={C.amber} />
      <Plaque x={540} y={190} text="8 KM/S?" size={130} bg={C.ink} fg={C.cream} />
    </g>
  );
};

/** l - the haze bunches into thick bands with a saffron edge. */
const l: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 2);
  return (
    <g>
      <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
      <Shaft f={f} x={540} w={360} y0={260} y1={1240} speed={9} />
      <AirHaze f={f} x={360} w={360} y0={260} y1={1240} speed={10} density={mix(0.5, 1, k)} seed={3} />
      <Probe x={540} y={mix(560, 900, k)} size={260} f={f} />
      <Plaque x={540} y={190} text="SQUEEZED" size={120} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** m - pressure and density bars climbing together. */
const m: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 4);
  return (
    <g>
      <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
      {[0, 1].map((i) => {
        const x = 330 + i * 420;
        const hh = 700 * (i ? k : ez(f, 3, n - 2));
        return (
          <g key={i}>
            <rect x={x - 90} y={260} width={180} height={820} rx={40} fill={C.ink} opacity={0.9} />
            <rect x={x - 70} y={1060 - hh} width={140} height={hh} rx={30} fill={i ? C.amber : C.orange} />
            <path d={`M${x} ${210 - 20 * Math.sin(f / 4)} v-70 m-36 36 l36 -44 l36 44`} stroke={C.cream} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Plaque x={x} y={1150} text={i ? "DENSITY" : "PRESSURE"} size={48} bg={C.ink} fg={C.cream} />
          </g>
        );
      })}
      <Plaque x={540} y={150} text="BOTH CLIMB FAST" size={64} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** n - a calendar strip flicks past while the probe inches along. */
const n_: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 2);
  const lit = Math.floor(k * 23);
  return (
    <g>
      <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
      {Array.from({ length: 24 }, (_, i) => (
        <rect key={i} x={120 + (i % 6) * 140} y={260 + Math.floor(i / 6) * 150} width={120} height={120} rx={22} fill={i <= lit ? C.amber : C.ink} opacity={i <= lit ? 1 : 0.8} stroke={C.cream} strokeWidth={5} />
      ))}
      <rect x={120} y={940} width={820} height={34} rx={17} fill={C.ink} />
      <rect x={126} y={946} width={808 * k} height={22} rx={11} fill={C.amber} />
      <Probe x={mix(160, 900, k)} y={1070} size={120} f={f} lamp={false} tilt={-90} />
      <Plaque x={540} y={150} text="MONTHS PASS" size={78} bg={C.ink} fg={C.cream} />
    </g>
  );
};

/** o - a counter rolls to 1.8 years. */
const o: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 8);
  return (
    <g>
      <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
      <Glow x={540} y={620} r={640} color={C.gold} f={f} strength={0.6} />
      <Plaque x={540} y={560} text={(1.8 * k).toFixed(1)} size={320} bg={C.ink} fg={C.amber} w={760} />
      <Plaque x={540} y={900} text="YEARS" size={130} bg={C.ink} fg={C.cream} />
      <Plaque x={540} y={190} text="TO THE CENTRE" size={92} bg={C.ink} fg={C.cream} />
    </g>
  );
};

/** p - 38 MIN gets struck out; ~2 YEARS slams on. */
const p: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
    <Plaque x={540} y={420} text="38 MIN" size={170} bg={C.ink} fg={C.cream} w={640} />
    <path d={`M180 ${520 - 200 * ez(f, 4, 12)} L900 ${340 + 200 * (1 - ez(f, 4, 12))}`} stroke={C.verm} strokeWidth={24} strokeLinecap="round" opacity={ez(f, 4, 6)} />
    <Plaque x={540} y={860} text="1.8 YEARS" size={170} bg={C.ink} fg={C.amber} w={820} scale={ez(f, 10, 18)} />
  </g>
);

/** q - a speck against a full bar: the same trip, two lengths. */
const q: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 4);
  return (
    <g>
      <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
      <rect x={230} y={260} width={200} height={860} rx={50} fill={C.ink} opacity={0.9} />
      <rect x={250} y={mix(1100, 280, k)} width={160} height={mix(0, 820, k)} rx={40} fill={C.amber} />
      <rect x={650} y={1080} width={200} height={26} rx={13} fill={C.cream} stroke={C.ink} strokeWidth={5} />
      <Plaque x={330} y={1190} text="1.8 YEARS" size={50} bg={C.ink} fg={C.amber} />
      <Plaque x={750} y={1190} text="38 MIN" size={50} bg={C.ink} fg={C.cream} />
      <Plaque x={540} y={150} text="SAME TRIP" size={84} bg={C.ink} fg={C.cream} />
    </g>
  );
};

/** r - the unanswered question over the hazy shaft. */
const r_: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
    <AirHaze f={f} x={120} w={840} y0={260} y1={1240} speed={12} density={0.6} seed={5} />
    <Probe x={300} y={760} size={260} f={f} />
    <Qmark f={f} x={700} y={900} size={640} />
    <Plaque x={540} y={190} text="WHAT DOES THE AIR DO?" size={64} bg={C.ink} fg={C.amber} />
  </g>
);

const s_: Shot = ({ f }) => (
  <EndShot f={f} stops={["#0A3C4C", "#11707A", "#1FA69A"]} q={["WHAT DOES", "THE AIR DO?"]}>
    <Probe x={940} y={1200} size={150} f={f} lamp={false} />
  </EndShot>
);

export const ShortS57 = makeShort(timeline, [[a, b], [c, d], [e, f_], [g, h], [i_, j], [k_], [l, m], [n_, o], [p, q], [r_, s_]]);
