import React from "react";
import { Sky, Tick } from "../../lib/illustrated";
import { buildTimeline, VoLine } from "../../lib/timeline";
import { C, Chips, EndShot, Glow, Plaque, Rain, T, W, H, Shot, ez, makeShort, mix } from "../S41-dig-plate/vkit";
import { Qmark } from "../S46-peak-seafloor/kit46";
import { CutGlobe } from "../L14-earth-tunnel/cutglobe";
import { Probe, Sparks, Tether } from "../L14-earth-tunnel/props";
import { BG_DAWN, BG_DEEP, BG_STUDIO, FAM, Shaft, Watch } from "../S56-fall-clock/kit56";
import vo from "./vo.json";

/**
 * S58 - the Earth turns while you fall (episodes/S58-sideways-wall). For L14, answered at 4:12. Vertical 1080x1920.
 * Numbers (sources.md, L14 rows): #12 23.9 hours per turn; #13 ~1,670 km/h at the equator. The wall scrape rests on #6
 * (secondary), so it is shown QUALITATIVELY ONLY, with no distance. The pole-to-pole route is withheld.
 */
export const timeline = buildTimeline(vo as VoLine[]);

const Arrow: React.FC<{ x: number; y: number; len: number; color?: string; w?: number }> = ({ x, y, len, color = C.amber, w = 16 }) => (
  <g>
    <path d={`M${x} ${y} H${x + len}`} stroke={color} strokeWidth={w} strokeLinecap="round" />
    <path d={`M${x + len - 28} ${y - 26} L${x + len + 6} ${y} L${x + len - 28} ${y + 26}`} stroke={color} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

const fmt = (v: number) => Math.round(v).toLocaleString("en-US");

/** a - sunrise on the equator: Tick lowers the probe into the hatch on a rope. */
const a: Shot = ({ f, n }) => {
  const k = ez(f, 4, n - 2);
  const py = mix(520, 960, k);
  return (
    <g>
      <Sky stops={BG_DAWN} x={0} y={0} w={W} h={H} />
      <Glow x={850} y={620} r={520} color={C.gold} f={f} strength={0.8} />
      <Chips f={f} n={10} y0={300} y1={900} color={C.cream} speed={22} opacity={0.4} seed={3} len={220} />
      <Probe x={640} y={py} size={320} f={f} />
      <rect x={0} y={1080} width={W} height={260} fill="#C98A4B" />
      <ellipse cx={640} cy={1086} rx={240} ry={54} fill={C.ink} stroke={C.cream} strokeWidth={10} />
      <Tether from={[360, 930]} to={[640, py - 190]} slack={0.2} f={f} color={C.cream} width={8} />
      <Tick x={290} y={1250} pxPerM={340} frame={f} pose="carry" expression="determined" facing={1} />
      <Plaque x={540} y={190} text="ON THE EQUATOR" size={86} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** b - pull up to the whole planet, the equator's dashes flowing. */
const b: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
    <Chips f={f} n={12} y0={100} y1={1200} color={C.gold} speed={7} opacity={0.3} seed={4} />
    <CutGlobe cx={540} cy={690} R={400} f={f} family={FAM} rot={f * 1.2} spin />
    <circle cx={940} cy={690} r={26 + 8 * Math.sin(f / 3)} fill="none" stroke={C.amber} strokeWidth={10} />
    <Plaque x={540} y={190} text="THE EARTH IS SPINNING" size={64} bg={C.ink} fg={C.cream} />
  </g>
);

/** c - a clock makes one full turn: 23.9 h. */
const c: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 4);
  return (
    <g>
      <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
      <Glow x={540} y={620} r={640} color={C.gold} f={f} strength={0.5} />
      <Watch x={540} y={620} r={330} k={k} full={60} f={f} />
      <Plaque x={540} y={190} text="ONE FULL TURN" size={92} bg={C.ink} fg={C.cream} />
    </g>
  );
};

/** d - the hours label slams on over the spinning planet. */
const d: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
    <CutGlobe cx={540} cy={560} R={340} f={f} family={FAM} rot={f * 2.4} spin />
    <Plaque x={540} y={1060} text="23.9 HOURS" size={130} bg={C.ink} fg={C.amber} w={760} scale={ez(f, 0, 8)} />
  </g>
);

/** e - speed lines whip east along the ground and the arrow grows. */
const e: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 4);
  return (
    <g>
      <Sky stops={BG_DAWN} x={0} y={0} w={W} h={H} />
      <Rain f={f} n={16} x0={0} x1={W} color={C.cream} speed={36} len={380} width={10} opacity={0.5} seed={2} />
      <rect x={0} y={900} width={W} height={400} fill="#C98A4B" />
      <Arrow x={110} y={780} len={mix(100, 700, k)} w={30} />
      <Plaque x={540} y={190} text="CARRIED EAST" size={100} bg={C.ink} fg={C.amber} />
      <Tick x={880} y={1250} pxPerM={330} frame={f} pose="point" expression="surprised" facing={-1} />
    </g>
  );
};

/** f - the speed number counts up. */
const f_: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 6);
  return (
    <g>
      <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
      <Glow x={540} y={620} r={640} color={C.gold} f={f} strength={0.6} />
      <Plaque x={540} y={560} text={fmt(1670 * k)} size={300} bg={C.ink} fg={C.amber} w={800} />
      <Plaque x={540} y={900} text="KM/H" size={140} bg={C.ink} fg={C.cream} />
      <Arrow x={200} y={1090} len={600} w={26} />
    </g>
  );
};

/** g - Tick taps the ground arrow: it is the ground itself. */
const g: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_DAWN} x={0} y={0} w={W} h={H} />
    <rect x={0} y={880} width={W} height={420} fill="#C98A4B" />
    {[0, 1, 2].map((i) => (
      <Arrow key={i} x={120 + ((f * 6 + i * 300) % 900) - 300} y={960 + i * 90} len={260} w={22} color={C.cream} />
    ))}
    <Tick x={300} y={900} pxPerM={270} frame={f} pose="point" expression="happy" facing={1} />
    <Plaque x={540} y={190} text="THE GROUND ITSELF" size={80} bg={C.ink} fg={C.amber} />
  </g>
);

const SH = { x: 540, w: 260 };

/** h - side cut-away: the ground and the probe carry the same arrow. */
const h: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
    <Shaft f={f} x={SH.x} w={SH.w} y0={560} y1={1250} speed={0} />
    <Arrow x={110} y={470} len={300} w={22} />
    <Arrow x={680} y={470} len={300} w={22} />
    <Probe x={SH.x} y={820} size={260} f={f} />
    <Arrow x={SH.x + 100} y={820} len={170} w={18} />
    <Plaque x={540} y={190} text="CARRIED ALONG" size={90} bg={C.ink} fg={C.cream} />
  </g>
);

/** i - the probe, with its own arrow, slides down; the same arrow rides with it. */
const i_: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
    <Shaft f={f} x={SH.x} w={SH.w} y0={300} y1={1250} speed={12} />
    <Probe x={SH.x} y={760} size={290} f={f} />
    <Arrow x={SH.x + 110} y={760} len={190} w={20} />
    <Plaque x={540} y={190} text="SIDEWAYS" size={120} bg={C.ink} fg={C.amber} />
  </g>
);

/** j - the probe's arrow stays long while the rock's arrows shorten with depth. */
const j: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 2);
  return (
    <g>
      <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
      <Shaft f={f} x={SH.x} w={SH.w} y0={280} y1={1250} speed={10} />
      {[0, 1, 2, 3, 4].map((i) => (
        <Arrow key={i} x={700} y={360 + i * 180} len={mix(260, 260 - i * 50, k)} w={18} color={C.cream} />
      ))}
      <Probe x={SH.x} y={mix(380, 960, k)} size={240} f={f} />
      <Arrow x={SH.x + 100} y={mix(380, 960, k)} len={170} w={18} />
      <Plaque x={540} y={150} text="IT KEEPS ITS SPEED" size={64} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** k - the probe's arrow against the rock's: same at the top, then not. */
const k_: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
    <Probe x={200} y={560} size={230} f={f} lamp={false} />
    <Arrow x={300} y={560} len={500} w={30} />
    <Arrow x={300} y={900} len={mix(500, 330, ez(f, 0, 16))} w={30} color={C.cream} />
    <Plaque x={200} y={900} text="ROCK" size={56} bg={C.ink} fg={C.cream} />
    <Plaque x={540} y={190} text="SAME AS AT THE TOP" size={68} bg={C.ink} fg={C.amber} />
  </g>
);

/** l - rock arrows shrink with depth, Tick points down toward the axis. */
const l: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 6);
  return (
    <g>
      <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
      <rect x={200} y={280} width={680} height={920} rx={40} fill="#C45A2A" />
      {[0, 1, 2, 3, 4].map((i) => (
        <Arrow key={i} x={260} y={360 + i * 170} len={mix(0, 520 - i * 100, ez(f, i * 3, 14 + i * 3))} w={24} color={C.cream} />
      ))}
      <path d={`M${940} 340 v${520 * k} m-34 -40 l34 44 l34 -44`} stroke={C.amber} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Plaque x={540} y={190} text="DEEPER = CLOSER TO THE AXIS" size={50} bg={C.ink} fg={C.cream} />
      <Tick x={100} y={1260} pxPerM={300} frame={f} pose="point" expression="thinking" facing={1} />
    </g>
  );
};

/** m - a ladder of shrinking arrows: slower. */
const m: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
    {[0, 1, 2, 3].map((i) => (
      <Arrow key={i} x={150} y={330 + i * 190} len={(700 - i * 170) * (0.97 + 0.03 * Math.sin(f / 4 + i))} w={34} color={i ? C.cream : C.amber} />
    ))}
    <Plaque x={540} y={190} text="SLOWER AND SLOWER" size={74} bg={C.ink} fg={C.amber} />
    <Plaque x={540} y={1120} text="DEEPER ROCK" size={64} bg={C.ink} fg={C.cream} />
  </g>
);

/** n - the probe drifts toward the east wall. */
const n_: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 2);
  return (
    <g>
      <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
      <Shaft f={f} x={SH.x} w={SH.w + 100} y0={280} y1={1250} speed={16} />
      <Probe x={mix(490, 580, k)} y={760} size={290} f={f} tilt={-8 * k} />
      <Arrow x={mix(600, 650, k)} y={900} len={220} w={22} />
      <Plaque x={540} y={190} text="IT DRIFTS EAST" size={96} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** o - the gap to the wall keeps growing: a bracket opens beside the probe. */
const o: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 2);
  const gap = mix(30, 160, k);
  return (
    <g>
      <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
      <Shaft f={f} x={SH.x} w={SH.w + 100} y0={280} y1={1250} speed={12} />
      <Probe x={mix(520, 600, k)} y={760} size={290} f={f} />
      <path d={`M700 560 h${-gap} M700 540 v40 M${700 - gap} 540 v40`} stroke={C.amber} strokeWidth={12} strokeLinecap="round" />
      <Plaque x={540} y={190} text="FASTER THAN THE WALL" size={64} bg={C.ink} fg={C.cream} />
    </g>
  );
};

/** p - contact: sparks fly, the picture shakes, Tick flinches. */
const p: Shot = ({ f }) => (
  <g transform={`translate(${Math.sin(f * 3.1) * 7} ${Math.cos(f * 2.7) * 5})`}>
    <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
    <Shaft f={f} x={SH.x} w={SH.w + 100} y0={280} y1={1250} speed={22} />
    <Probe x={640} y={780} size={310} f={f} variant="scrape" side={1} amount={1.6} tilt={-6} />
    <Sparks x={720} y={760} f={f} dir={1} rate={1.6} size={260} />
    <Tick x={160} y={1260} pxPerM={320} frame={f} pose="shield" expression="scared" facing={1} />
    <Plaque x={540} y={190} text="SCRAPE" size={140} bg={C.ink} fg={C.amber} />
  </g>
);

/** q - the unanswered question over the planet. */
const q: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
    <CutGlobe cx={420} cy={780} R={300} f={f} family={FAM} rot={f * 0.8} spin />
    <Qmark f={f} x={820} y={920} size={600} />
    <Plaque x={540} y={190} text="WHERE DO YOU DIG?" size={84} bg={C.ink} fg={C.amber} />
  </g>
);

const r_: Shot = ({ f }) => (
  <EndShot f={f} stops={["#0A3C4C", "#11707A", "#1FA69A"]} q={["WHERE DO", "YOU DIG?"]}>
    <Probe x={940} y={1200} size={150} f={f} lamp={false} />
  </EndShot>
);

export const ShortS58 = makeShort(timeline, [[a, b], [c, d], [e, f_], [g], [h, i_], [j, k_], [l, m], [n_, o], [p], [q, r_]]);
