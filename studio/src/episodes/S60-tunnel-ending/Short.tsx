import React from "react";
import { Sky, Tick } from "../../lib/illustrated";
import { buildTimeline, VoLine } from "../../lib/timeline";
import { C, Chips, EndShot, Glow, Plaque, T, W, H, Shot, ez, makeShort, mix } from "../S41-dig-plate/vkit";
import { Qmark } from "../S46-peak-seafloor/kit46";
import { CutGlobe, oscillate } from "../L14-earth-tunnel/cutglobe";
import { Probe } from "../L14-earth-tunnel/props";
import { BG_DEEP, BG_NIGHT, BG_STUDIO, Dial, FAM, Shaft, Watch } from "../S56-fall-clock/kit56";
import vo from "./vo.json";

/**
 * S60 - the probe that never reaches the other side (episodes/S60-tunnel-ending). For L14, answered at 8:41.
 * Vertical 1080x1920. Numbers (sources.md, L14 rows): #1 38 min; #7 no air, no spin, no friction; #10 first half about
 * 19.5 min with friction (1,167 s), never reaches the far end, swings with falling amplitude. Where it ends up is
 * withheld: no shot shows the probe resting.
 */
export const timeline = buildTimeline(vo as VoLine[]);

const DAMP = 0.18;
/** swing position at u half-swings, -1 = start end, +1 = far end (damped). */
const pos = (u: number) => oscillate(u, DAMP);

/** The swing chart: time right, position down; start line, middle line, far-side line; the curve up to u. */
const Chart: React.FC<{ u: number; U?: number; envelope?: boolean }> = ({ u, U = 4.6, envelope = false }) => {
  const X = (uu: number) => 90 + (uu / U) * 900;
  const Y = (p: number) => 700 + p * 330;
  const pts: string[] = [];
  for (let s = 0; s <= u; s += 0.05) pts.push(`${X(s).toFixed(1)} ${Y(pos(s)).toFixed(1)}`);
  pts.push(`${X(u).toFixed(1)} ${Y(pos(u)).toFixed(1)}`);
  return (
    <g>
      <rect x={60} y={320} width={960} height={760} rx={50} fill={C.ink} opacity={0.88} />
      <path d={`M90 ${Y(-1)} H990 M90 ${Y(1)} H990`} stroke={C.cream} strokeWidth={5} strokeDasharray="18 14" opacity={0.6} />
      <path d={`M90 ${Y(0)} H990`} stroke={C.teal} strokeWidth={6} opacity={0.8} />
      {envelope ? <path d={`M${X(0)} ${Y(-1)} Q${X(2.3)} ${Y(-0.35)} ${X(U)} ${Y(-0.1)}`} stroke={C.amber} strokeWidth={5} strokeDasharray="10 12" fill="none" opacity={0.6} /> : null}
      <path d={`M${pts.join(" L")}`} stroke={C.amber} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={X(u)} cy={Y(pos(u))} r={26} fill={C.cream} stroke={C.verm} strokeWidth={10} />
    </g>
  );
};

/** a - Tick presses the release button and the probe starts to fall. */
const a: Shot = ({ f, n }) => {
  const k = ez(f, 6, n - 2);
  return (
    <g>
      <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
      <Chips f={f} n={10} y0={150} y1={1000} color={C.foam} speed={9} opacity={0.4} seed={2} />
      <Shaft f={f} x={640} w={250} y0={420} y1={1250} speed={f > 6 ? 16 : 0} />
      <Probe x={640} y={mix(380, 900, k)} size={300} f={f} />
      <rect x={90} y={1130} width={260} height={90} rx={20} fill={C.deep} />
      <circle cx={220} cy={1120} r={50 - (f > 5 && f < 11 ? 12 : 0)} fill={C.verm} stroke={C.ink} strokeWidth={8} />
      <Tick x={170} y={1130} pxPerM={300} frame={f} pose="press" expression="determined" facing={1} />
      <Plaque x={540} y={190} text="RELEASE" size={130} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** b - the stopwatch ring fills as the probe races. */
const b: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 2);
  return (
    <g>
      <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
      <Shaft f={f} x={540} w={280} y0={260} y1={1250} speed={30} />
      <Probe x={540} y={780} size={320} f={f} />
      <Watch x={880} y={420} r={130} k={k * (38 / 60)} full={60} f={f} />
      <Plaque x={300} y={190} text="NO AIR" size={80} bg={C.ink} fg={C.cream} />
    </g>
  );
};

/** c - the stopwatch lands on 38 minutes. */
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

/** d - the probe pops out of the far side. */
const d: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 2);
  return (
    <g>
      <Sky stops={BG_NIGHT} x={0} y={0} w={W} h={H} />
      <Chips f={f} n={14} y0={80} y1={1200} color={C.foam} speed={12} opacity={0.5} seed={9} />
      <CutGlobe cx={540} cy={800} R={380} f={f} family={FAM} probe={mix(0.5, 1, k)} line={{ to: 1 }} />
      <Probe x={540} y={mix(480, 150, k)} size={220} f={f} tilt={180} lamp={false} />
      <Plaque x={540} y={1190} text="THE OTHER SIDE" size={70} bg={C.ink} fg={C.cream} />
    </g>
  );
};

/** e - three labels get ticked off. */
const e: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
    {["NO AIR", "NO SPIN", "NO FRICTION"].map((t, i) => {
      const s = ez(f, i * 6, i * 6 + 8);
      return (
        <g key={t} transform={`translate(540 ${400 + i * 250}) scale(${s})`}>
          <rect x={-380} y={-90} width={760} height={180} rx={50} fill={C.ink} stroke={C.cream} strokeWidth={6} />
          <T x={-60} y={34} text={t} size={86} color={C.cream} />
          <path d="M270 4 l36 40 l70 -80" transform="translate(-60 0)" stroke={C.green} strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    })}
    <Plaque x={540} y={150} text="THE CLEAN MODEL" size={72} bg={C.ink} fg={C.amber} />
  </g>
);

/** f - the clean tunnel, the probe gliding. */
const f_: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
    <Shaft f={f} x={540} w={300} y0={250} y1={1250} speed={20} deep="#C45A2A" />
    <Probe x={540} y={760 + Math.sin(f / 6) * 20} size={320} f={f} />
    <Plaque x={540} y={190} text="NOTHING IN THE WAY" size={74} bg={C.ink} fg={C.amber} />
  </g>
);

/** g - Tick scribbles a rough strip on the wall. */
const g: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 4);
  return (
    <g>
      <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
      <Shaft f={f} x={540} w={300} y0={250} y1={1250} speed={8} />
      <rect x={640} y={250} width={26} height={1000 * k} fill={C.amber} opacity={0.85} />
      {Array.from({ length: 14 }, (_, i) => (
        <path key={i} d={`M636 ${280 + i * 70} l34 18`} stroke={C.ink} strokeWidth={6} opacity={i * 70 < 1000 * k ? 1 : 0} />
      ))}
      <Probe x={470} y={760} size={280} f={f} />
      <Tick x={900} y={1250} pxPerM={320} frame={f} pose="point" expression="determined" facing={-1} />
      <Plaque x={540} y={190} text="ADD FRICTION" size={110} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** h - the friction gauge reads small. */
const h: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
    <Dial x={540} y={620} r={320} v={0.1} f={f} color={C.teal} />
    <Plaque x={540} y={1090} text="A SMALL, CHOSEN VALUE" size={62} bg={C.ink} fg={C.cream} />
    <Plaque x={540} y={190} text="FRICTION" size={130} bg={C.ink} fg={C.amber} />
  </g>
);

/** i - the chart: the probe dot falls to the middle line. */
const i_: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 4);
  return (
    <g>
      <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
      <Chart u={0.5 * k} />
      <Plaque x={540} y={190} text="THE FIRST HALF" size={96} bg={C.ink} fg={C.cream} />
      <T x={540} y={1180} text="TO THE MIDDLE" size={70} color={C.amber} />
    </g>
  );
};

/** j - 19.5 minutes on the stopwatch. */
const j: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 8);
  return (
    <g>
      <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
      <Glow x={540} y={620} r={640} color={C.gold} f={f} strength={0.5} />
      <Watch x={540} y={620} r={330} k={k * (19.45 / 60)} full={60} f={f} />
      <Plaque x={540} y={190} text="ABOUT 19.5 MIN" size={110} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** k - the dot flies through the middle line and climbs. */
const k_: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 2);
  return (
    <g>
      <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
      <Chart u={mix(0.5, 1.0, k)} />
      <Plaque x={540} y={190} text="PAST THE MIDDLE" size={92} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** l - the probe on the planet, rising toward the far side. */
const l: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 2);
  return (
    <g>
      <Sky stops={BG_NIGHT} x={0} y={0} w={W} h={H} />
      <CutGlobe cx={540} cy={700} R={420} f={f} family={FAM} probe={pos(mix(0.5, 1, k))} line={{ to: pos(mix(0.5, 1, k)) }} />
      <Plaque x={540} y={190} text="CLIMBING" size={130} bg={C.ink} fg={C.cream} />
    </g>
  );
};

/** m - it stops short: a gap opens between the probe and the exit. */
const m: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 6);
  return (
    <g>
      <Sky stops={BG_NIGHT} x={0} y={0} w={W} h={H} />
      <CutGlobe cx={540} cy={700} R={420} f={f} family={FAM} probe={pos(1)} line={{ to: pos(1) }} />
      <circle cx={540} cy={1120} r={30 + 8 * Math.sin(f / 3)} fill="none" stroke={C.verm} strokeWidth={10} />
      <path d={`M700 ${700 + pos(1) * 420 + 20} V1110`} stroke={C.verm} strokeWidth={12} strokeDasharray="14 10" opacity={k} />
      <Plaque x={540} y={190} text="NEVER ARRIVES" size={100} bg={C.ink} fg={C.amber} scale={ez(f, 0, 8)} />
    </g>
  );
};

/** n - swing after swing, each a little shorter. */
const n_: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 4);
  return (
    <g>
      <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
      <Chart u={mix(1, 4.6, k)} envelope />
      <Plaque x={540} y={190} text="EACH SWING SHORTER" size={78} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** o - the probe swinging on the planet, the swings shrinking. */
const o: Shot = ({ f, n }) => {
  const u = mix(1, 4.2, ez(f, 0, n - 2));
  return (
    <g>
      <Sky stops={BG_NIGHT} x={0} y={0} w={W} h={H} />
      <CutGlobe cx={540} cy={700} R={420} f={f} family={FAM} probe={pos(u)} line={{ to: pos(u) }} trail={0.5} />
      <Plaque x={540} y={190} text="BACK AND FORTH" size={92} bg={C.ink} fg={C.cream} />
    </g>
  );
};

/** p - friction is small next to the pull: a sliver against a tall bar. */
const p: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 4);
  return (
    <g>
      <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
      <rect x={250} y={300} width={200} height={820} rx={50} fill={C.ink} opacity={0.9} />
      <rect x={270} y={mix(1100, 330, k)} width={160} height={mix(0, 770, k)} rx={40} fill={C.amber} />
      <rect x={660} y={1040} width={200} height={60} rx={20} fill={C.teal} stroke={C.ink} strokeWidth={5} />
      <Plaque x={350} y={1190} text="PULL" size={56} bg={C.ink} fg={C.amber} />
      <Plaque x={760} y={1190} text="FRICTION" size={56} bg={C.ink} fg={C.cream} />
      <Tick x={880} y={880} pxPerM={220} frame={f} pose="shrug" expression="neutral" facing={-1} />
      <Plaque x={540} y={190} text="SMALL NEXT TO THE PULL" size={62} bg={C.ink} fg={C.cream} />
    </g>
  );
};

/** q - small losses add up over a long trip. */
const q: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 4);
  return (
    <g>
      <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
      <Chart u={mix(2, 4.6, k)} envelope />
      <Plaque x={540} y={190} text="LOSSES ADD UP" size={100} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** r - the unanswered question over the planet. */
const r_: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_NIGHT} x={0} y={0} w={W} h={H} />
    <CutGlobe cx={420} cy={780} R={300} f={f} family={FAM} rot={f * 0.8} />
    <Qmark f={f} x={820} y={920} size={600} />
    <Plaque x={540} y={190} text="WHERE DOES IT STOP?" size={76} bg={C.ink} fg={C.amber} />
  </g>
);

const s_: Shot = ({ f }) => (
  <EndShot f={f} stops={["#0B1B3A", "#1B3A6B", "#2A6FA8"]} q={["WHERE DOES", "IT STOP?"]}>
    <Probe x={940} y={1200} size={150} f={f} lamp={false} />
  </EndShot>
);

export const ShortS60 = makeShort(timeline, [[a, b], [c, d], [e, f_], [g, h], [i_, j], [k_, l], [m], [n_, o], [p, q], [r_, s_]]);
