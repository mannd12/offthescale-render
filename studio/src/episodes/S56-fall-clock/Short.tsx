import React from "react";
import { Sky, Tick } from "../../lib/illustrated";
import { buildTimeline, VoLine } from "../../lib/timeline";
import { C, Chips, EndShot, Glow, Plaque, Rain, T, W, H, Shot, ez, makeShort, mix } from "../S41-dig-plate/vkit";
import { Qmark } from "../S46-peak-seafloor/kit46";
import { CutGlobe } from "../L14-earth-tunnel/cutglobe";
import { Probe, SpringWeight } from "../L14-earth-tunnel/props";
import { BG_DEEP, BG_STUDIO, Dial, Disc, FAM, Shaft, Watch, mmss } from "./kit56";
import vo from "./vo.json";

/**
 * S56 - 38 minutes, not 42 (episodes/S56-fall-clock). For L14, answered at 1:27. Vertical 1080x1920.
 * Numbers (sources.md, L14 rows): #1 42:12 uniform / 38:11 PREM / 38:00 constant pull (gaps 4:01 and 11 s); #2 nearly
 * 8 km/s at the middle; #13 12,742 km. Why a constant pull lands so close is withheld.
 */
export const timeline = buildTimeline(vo as VoLine[]);

/** a - Tick lets go of the probe above a hatch in the floor. */
const a: Shot = ({ f, n }) => {
  const k = ez(f, 6, n - 2);
  return (
    <g>
      <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
      <Chips f={f} n={10} y0={150} y1={1000} color={C.foam} speed={9} opacity={0.4} seed={2} />
      <Probe x={640} y={mix(420, 1000, k)} size={340} f={f} />
      <rect x={0} y={1080} width={W} height={260} fill={C.deep} />
      <ellipse cx={640} cy={1086} rx={240} ry={54} fill={C.ink} stroke={C.cream} strokeWidth={10} />
      <Tick x={230} y={1250} pxPerM={340} frame={f} pose="point" expression="happy" facing={1} />
      <Plaque x={540} y={190} text="LET GO" size={120} bg={C.ink} fg={C.amber} scale={ez(f, 0, 8)} />
    </g>
  );
};

/** b - the planet cut-away, the dotted line and the probe racing along it. */
const b: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 2);
  return (
    <g>
      <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
      <Chips f={f} n={12} y0={100} y1={1200} color={C.gold} speed={7} opacity={0.35} seed={4} />
      <CutGlobe cx={540} cy={690} R={420} f={f} family={FAM} probe={mix(-1, 0.1, k)} line={{ to: mix(-1, 0.1, k) }} trail={0.5} />
      <Plaque x={540} y={190} text="12,742 KM" size={110} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** c - a stopwatch fills toward 42; the stamp slams on. */
const c: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 6);
  return (
    <g>
      <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
      <Glow x={540} y={640} r={640} color={C.gold} f={f} strength={0.5} />
      <Watch x={540} y={620} r={330} k={k * 0.7} full={60} f={f} />
      <Plaque x={540} y={1130} text="FAMOUS ANSWER" size={74} bg={C.ink} fg={C.cream} rot={-4} scale={ez(f, 6, 14)} />
      <Plaque x={540} y={190} text="42 MIN" size={130} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** d - the probe pops out of the far side into the stars. */
const d: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 2);
  return (
    <g>
      <Sky stops={["#0B1B3A", "#1B3A6B", "#2A6FA8"]} x={0} y={0} w={W} h={H} />
      <Chips f={f} n={14} y0={80} y1={1200} color={C.foam} speed={12} opacity={0.5} seed={9} />
      <CutGlobe cx={540} cy={830} R={380} f={f} family={FAM} probe={mix(0.5, 1, k)} line={{ to: 1 }} />
      <Probe x={540} y={mix(250, 150, k) - 100 * k} size={220} f={f} tilt={180} lamp={false} />
      <Plaque x={540} y={1190} text="OTHER SIDE" size={80} bg={C.ink} fg={C.cream} />
    </g>
  );
};

/** e - the probe rocks through a flat one-colour ball. */
const e: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
    <Disc x={540} y={690} r={420} f={f} />
    <Probe x={540} y={690 + Math.sin(f / 8) * 330} size={260} f={f} lamp={false} />
    <Plaque x={540} y={190} text="ONE BALL OF ROCK" size={80} bg={C.ink} fg={C.amber} />
  </g>
);

/** f - a spring with the probe as the weight, bobbing. */
const f_: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
    <SpringWeight x={540} y={220} stretch={560 + 240 * Math.sin(f / 6)} coils={12} width={150} weight={190} probe f={f} />
    <Plaque x={540} y={1190} text="LIKE A WEIGHT ON A SPRING" size={52} bg={C.ink} fg={C.cream} />
  </g>
);

/** g - spring and ball side by side, both swinging in step. */
const g: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
    <SpringWeight x={250} y={260} stretch={480 + 200 * Math.sin(f / 6)} coils={10} width={110} weight={120} probe f={f} />
    <Disc x={760} y={640} r={250} f={f} />
    <Probe x={760} y={640 + Math.sin(f / 6) * 210} size={170} f={f} lamp={false} />
    <Plaque x={540} y={1130} text="SAME SWING" size={90} bg={C.ink} fg={C.amber} />
  </g>
);

/** h - the probe streaks through the middle, speed lines whipping past. */
const h: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
    <Rain f={f} n={26} x0={60} x1={1020} color={C.foam} speed={42} len={420} width={12} opacity={0.7} seed={7} />
    <Probe x={540} y={700 + Math.sin(f / 3) * 14} size={380} f={f} />
    <Plaque x={540} y={190} text="THE MIDDLE" size={110} bg={C.ink} fg={C.cream} />
  </g>
);

/** i - the speed dial snaps to its stop at 8 km/s. */
const i_: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 10);
  return (
    <g>
      <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
      <Glow x={540} y={640} r={640} color={C.gold} f={f} strength={0.5} />
      <Dial x={540} y={640} r={330} v={k} shake={k > 0.97 ? 0.03 : 0} f={f} />
      <Plaque x={540} y={1130} text="NEARLY 8 KM/S" size={86} bg={C.ink} fg={C.amber} scale={ez(f, n - 14, n - 6)} />
      <Tick x={150} y={1250} pxPerM={300} frame={f} pose="point" expression="surprised" facing={1} />
    </g>
  );
};

/** j - the flat ball swaps for the layered cut-away with a bright dense core. */
const j: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 4);
  return (
    <g>
      <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
      <CutGlobe cx={540} cy={690} R={430} f={f} family={FAM} probe={mix(-1, 0, k)} line={{ to: mix(-1, 0, k) }} highlight={{ layer: "inner", k: 0.4 + 0.3 * Math.sin(f / 5) }} />
      <Plaque x={540} y={190} text="THE REAL EARTH" size={92} bg={C.ink} fg={C.amber} />
      <Plaque x={540} y={1150} text="DENSE CORE" size={76} bg={C.ink} fg={C.cream} scale={ez(f, 8, 16)} />
    </g>
  );
};

/** k - the second stopwatch spins to 38:11. */
const k_: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 8);
  return (
    <g>
      <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
      <Glow x={540} y={640} r={640} color={C.gold} f={f} strength={0.5} />
      <Watch x={540} y={620} r={330} k={k * (38.18 / 60)} full={60} f={f} />
      <Plaque x={540} y={190} text={mmss(2291 * k)} size={150} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** l - a stamp: REAL EARTH 38:11, with the probe bursting through. */
const l: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
    <Chips f={f} n={14} y0={80} y1={1150} color={C.gold} speed={10} opacity={0.4} seed={5} />
    <Probe x={540} y={560 + Math.sin(f / 4) * 20} size={420} f={f} />
    <Plaque x={540} y={1060} text="38:11" size={190} bg={C.ink} fg={C.amber} w={640} scale={1 + 0.04 * Math.sin(f / 4)} />
    <Plaque x={540} y={190} text="REAL EARTH" size={100} bg={C.ink} fg={C.cream} />
  </g>
);

/** m - two clocks side by side. */
const m: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
    <Watch x={290} y={560} r={200} k={42.2 / 60} full={60} plate="42:12" f={f} />
    <Watch x={790} y={560} r={200} k={38.18 / 60} full={60} plate="38:11" f={f} />
    <Plaque x={540} y={190} text="FAMOUS VS REAL" size={84} bg={C.ink} fg={C.amber} />
    <Plaque x={540} y={1130} text="ABOUT 4 MIN APART" size={72} bg={C.ink} fg={C.cream} scale={ez(f, 4, 12)} />
  </g>
);

/** n - the gap lights up: a bracket between them and a big "~4 MIN". */
const n_: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 6);
  return (
    <g>
      <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
      <Watch x={mix(190, 330, k)} y={520} r={170} k={42.2 / 60} full={60} f={f} />
      <Watch x={mix(890, 750, k)} y={520} r={170} k={38.18 / 60} full={60} f={f} />
      <Glow x={540} y={560} r={420} color={C.gold} f={f} strength={0.8} />
      <Plaque x={540} y={900} text="~4 MIN" size={190} bg={C.ink} fg={C.amber} w={620} scale={1 + 0.05 * Math.sin(f / 4)} />
      <Plaque x={540} y={1130} text="FASTER" size={84} bg={C.ink} fg={C.cream} />
    </g>
  );
};

/** o - a shaft with arrows all the same length: the pull never changes. */
const o: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
    <Shaft f={f} x={540} w={280} y0={280} y1={1240} speed={10} />
    {[0, 1, 2, 3, 4].map((i) => {
      const y = 360 + ((i * 190 + f * 10) % 900);
      return <path key={i} d={`M300 ${y} v70 m-34 -30 l34 40 l34 -40`} stroke={C.amber} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
    })}
    <Probe x={540} y={720 + Math.sin(f / 5) * 10} size={300} f={f} />
    <Tick x={870} y={1250} pxPerM={300} frame={f} pose="point" expression="thinking" facing={-1} />
    <Plaque x={540} y={190} text="PULL NEVER CHANGES" size={72} bg={C.ink} fg={C.amber} />
  </g>
);

/** p - the pull gauge parked at a steady mark. */
const p: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
    <Rain f={f} n={14} x0={60} x1={1020} color={C.foam} speed={20} len={260} width={10} opacity={0.35} seed={3} />
    <Dial x={540} y={620} r={320} v={0.55} f={f} color={C.teal} />
    <Plaque x={540} y={1090} text="SAME ALL THE WAY DOWN" size={60} bg={C.ink} fg={C.cream} />
    <Plaque x={540} y={190} text="PULL" size={130} bg={C.ink} fg={C.amber} />
  </g>
);

/** q - the third stopwatch stamps 38:00. */
const q_: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 6);
  return (
    <g>
      <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
      <Glow x={540} y={640} r={640} color={C.gold} f={f} strength={0.5} />
      <Watch x={540} y={620} r={330} k={k * (38 / 60)} full={60} f={f} />
      <Plaque x={540} y={190} text={mmss(2280 * k)} size={150} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** r - the exact-minute stamp over a probe falling steadily. */
const r_: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
    <Shaft f={f} x={540} w={280} y0={300} y1={1240} speed={14} />
    <Probe x={540} y={740} size={300} f={f} />
    <Plaque x={540} y={1060} text="38:00 EXACTLY" size={82} bg={C.ink} fg={C.amber} w={760} rot={-3} scale={ez(f, 0, 8)} />
    <Plaque x={540} y={190} text="38:00" size={150} bg={C.ink} fg={C.amber} />
  </g>
);

/** s - 38:00 and 38:11 slide together. */
const s_: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 4);
  return (
    <g>
      <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
      <Plaque x={mix(250, 420, k)} y={600} text="38:00" size={110} bg={C.ink} fg={C.cream} />
      <Plaque x={mix(830, 660, k)} y={780} text="38:11" size={110} bg={C.ink} fg={C.amber} />
      <Glow x={540} y={700} r={380} color={C.gold} f={f} strength={0.7} />
      <Probe x={540} y={1000} size={200} f={f} lamp={false} />
      <Plaque x={540} y={190} text="TWO DIFFERENT PULLS" size={74} bg={C.ink} fg={C.cream} />
    </g>
  );
};

/** t - only 11 seconds apart: the gap pulses. */
const t_: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
    <Glow x={540} y={640} r={600} color={C.gold} f={f} strength={0.8} />
    <Plaque x={540} y={620} text="11 S" size={260} bg={C.ink} fg={C.amber} w={640} scale={1 + 0.06 * Math.sin(f / 4)} />
    <Plaque x={540} y={190} text="ONLY" size={110} bg={C.ink} fg={C.cream} />
    <Plaque x={540} y={1040} text="APART" size={110} bg={C.ink} fg={C.cream} />
  </g>
);

/** u - the unanswered question over the probe and the globe. */
const u: Shot = ({ f }) => (
  <g>
    <Sky stops={["#0A3C4C", "#11707A", "#1FA69A"]} x={0} y={0} w={W} h={H} />
    <Chips f={f} n={12} y0={150} y1={1150} color={C.gold} speed={7} opacity={0.35} seed={6} />
    <Probe x={300} y={760} size={260} f={f} />
    <Qmark f={f} x={680} y={900} size={640} />
    <Plaque x={540} y={190} text="WHY SO CLOSE?" size={96} bg={C.ink} fg={C.amber} />
  </g>
);

const v: Shot = ({ f }) => (
  <EndShot f={f} stops={["#0A3C4C", "#11707A", "#1FA69A"]} q={["WHY SO", "CLOSE?"]}>
    <Probe x={940} y={1200} size={150} f={f} lamp={false} />
  </EndShot>
);

export const ShortS56 = makeShort(timeline, [[a, b], [c, d], [e, f_, g], [h, i_], [j, k_, l], [m, n_], [o, p], [q_, r_], [s_, t_], [u, v]]);
