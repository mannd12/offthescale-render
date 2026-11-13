import React from "react";
import { Bloom, Counter, Sky, Tick } from "../../lib/illustrated";
import { buildTimeline, VoLine } from "../../lib/timeline";
import { C, Chips, EndShot, Glow, Plaque, T, W, H, Shot, ez, makeShort, mix, ramp } from "../S41-dig-plate/vkit";
import { Qmark } from "../S46-peak-seafloor/kit46";
import { Burst, Clock, bob, shake } from "../S51-phantom-guns/kit51";
import { familyOf } from "../L13-loudest-sound/families";
import { Satellite } from "../L13-loudest-sound/props";
import { PressureWave, Rings } from "../L13-loudest-sound/sound";
import vo from "./vo.json";

/**
 * S55 - a note fifty-seven octaves below middle C (episodes/S55-lowest-note). For L13, answered at 7:46. Vertical 1080x1920.
 * Numbers (sources.md, L13 row #21): 57 octaves below middle C, B flat, a million billion times deeper than the limits of
 * human hearing, 250 million light years, roughly constant for about 2.5 billion years, a deep Chandra observation.
 * What makes the note (a giant black hole in the Perseus cluster) is withheld: no black hole is drawn or named.
 */
export const timeline = buildTimeline(vo as VoLine[]);

const VOID = familyOf("void");
const NIGHT = ["#0B0A2E", "#2A1B63", "#4B2A8C"];
const GAS = "#F08A4A";
const Space: React.FC<{ f: number; stops?: string[] }> = ({ f, stops = NIGHT }) => (
  <g>
    <Sky stops={stops} x={0} y={0} w={W} h={H} />
    <Chips f={f} n={18} y0={60} y1={1250} color={C.foam} speed={3} opacity={0.35} seed={5} len={40} width={8} />
  </g>
);

/** The octave staircase, scrolling up as Tick descends. `shown` = highest step number labelled. */
const Stairs: React.FC<{ f: number; speed: number; shown: number }> = ({ f, speed, shown }) => {
  const step = 150;
  const off = (f * speed) % step;
  const base = Math.floor((f * speed) / step);
  return (
    <g>
      {Array.from({ length: 11 }, (_, i) => {
        const y = 1250 - i * step + off - 150;
        const idx = base + i;
        const x = 160 + ((idx * 70) % 640);
        return (
          <g key={idx}>
            <rect x={x - 40} y={y} width={440} height={step - 14} rx={26} fill={idx % 2 ? C.petrol : C.teal} stroke={C.ink} strokeWidth={8} />
            {idx > 0 && idx <= shown ? <T x={x + 180} y={y + 100} text={`${idx}`} size={84} color={C.cream} /> : null}
          </g>
        );
      })}
    </g>
  );
};

/** a1 - a giant key slams down; MIDDLE C. */
const a1: Shot = ({ f }) => {
  const d = f > 6 ? 60 * Math.max(0, 1 - (f - 6) / 6) + 24 : 0;
  return (
    <g transform={shake(f, 6, 10, 12)}>
      <Space f={f} />
      <rect x={260} y={420 + d} width={560} height={820} rx={70} fill={C.cream} stroke={C.ink} strokeWidth={14} />
      <rect x={260} y={1130 + d} width={560} height={110} rx={50} fill={C.apricot} />
      <Plaque x={540} y={1000 + d} text="MIDDLE C" size={90} bg={C.ink} fg={C.amber} />
      <T x={540} y={290} text="PRESS A NOTE" size={110} color={C.amber} />
    </g>
  );
};

/** a2 - Tick leaps down the stairs; they keep unrolling below the frame. */
const a2: Shot = ({ f }) => (
  <g>
    <Space f={f} />
    <Stairs f={f} speed={18} shown={0} />
    <Tick x={420 + bob(f, 12, 30)} y={1000 + Math.abs(bob(f, 10, 50))} pxPerM={380} frame={f} pose="cheer" expression="happy" facing={1} />
    <T x={540} y={190} text="57 OCTAVES DOWN" size={96} color={C.amber} />
  </g>
);

/** b1 - numbered steps: 1, 2, 3. */
const b1: Shot = ({ f }) => (
  <g>
    <Space f={f} />
    <Stairs f={f} speed={12} shown={3} />
    <Tick x={440} y={1040} pxPerM={360} frame={f} pose="point" expression="determined" facing={1} />
    <Counter x={880} y={420} value={Math.min(3, 1 + Math.floor(f / 5))} max={9} size={260} color={C.amber} align="middle" digits={1} />
    <T x={880} y={520} text="OCTAVES" size={56} color={C.cream} />
  </g>
);

/** b2 - the count blurs through the teens and twenties. */
const b2: Shot = ({ f, n }) => (
  <g>
    <Space f={f} />
    <Stairs f={f} speed={34} shown={0} />
    <Counter x={880} y={420} value={mix(4, 28, ez(f, 0, n))} max={99} size={240} color={C.amber} align="middle" digits={2} />
    <Tick x={420} y={1050 + bob(f, 6, 14)} pxPerM={340} frame={f} pose="cheer" expression="surprised" facing={1} />
  </g>
);

/** b3 - the steps streak up the frame. */
const b3: Shot = ({ f, n }) => (
  <g>
    <Space f={f} />
    <Stairs f={f} speed={60} shown={0} />
    <Chips f={f} n={20} y0={100} y1={1250} color={C.foam} speed={30} opacity={0.5} seed={9} len={260} />
    <Counter x={880} y={420} value={mix(28, 54, ez(f, 0, n))} max={99} size={240} color={C.amber} align="middle" digits={2} />
  </g>
);

/** b4 - it lands on 57; Tick is a dot at the bottom. */
const b4: Shot = ({ f }) => (
  <g transform={shake(f, 2, 12, 18)}>
    <Space f={f} stops={["#4B2A8C", "#E4572E", "#FFC83D"]} />
    <Burst x={540} y={640} r0={320} r1={500} n={18} color={C.amber} width={20} rot={f * 2} />
    <Counter x={540} y={780} value={57} max={57} size={560} color={C.amber} align="middle" digits={2} />
    <Tick x={540} y={1260} pxPerM={170} frame={f} pose="stand" expression="surprised" facing={1} />
  </g>
);

/** c1 - a tuning fork, tines swinging; B FLAT stamps on. */
const c1: Shot = ({ f }) => {
  const s = Math.sin(f * 1.2) * 22;
  return (
    <g>
      <Space f={f} />
      <Rings f={f} cx={540} cy={560} period={14} speed={12} maxR={800} width={10} color={C.amber} glow={false} />
      <g transform="translate(540 560)">
        <path d={`M${-70 - s} -330 V-60 Q${-70 - s * 0.2} 20 0 20 Q${70 + s * 0.2} 20 ${70 + s} -60 V-330`} stroke={C.cream} strokeWidth={46} fill="none" strokeLinecap="round" />
        <rect x={-24} y={20} width={48} height={420} rx={24} fill={C.cream} />
      </g>
      <Plaque x={540} y={1130} text="B FLAT" size={170} bg={C.ink} fg={C.amber} w={640} scale={ez(f, 4, 12)} />
    </g>
  );
};

/** c2 - Tick listens to the fork. */
const c2: Shot = ({ f }) => (
  <g>
    <Space f={f} />
    <Rings f={f} cx={760} cy={600} period={16} speed={11} maxR={700} width={10} color={C.amber} glow={false} />
    <g transform={`translate(760 620) rotate(${Math.sin(f * 1.2) * 4})`}>
      <path d="M-50 -260 V-40 Q-50 10 0 10 Q50 10 50 -40 V-260" stroke={C.cream} strokeWidth={38} fill="none" strokeLinecap="round" />
      <rect x={-18} y={10} width={36} height={300} rx={18} fill={C.cream} />
    </g>
    <Tick x={330} y={1260} pxPerM={430} frame={f} pose="listen" expression="thinking" facing={1} />
    <T x={540} y={190} text="THE NOTE: B FLAT" size={84} color={C.amber} />
  </g>
);

/** d1 - a scale: human hearing at the top, the note far below. */
const d1: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 2);
  return (
    <g>
      <Space f={f} />
      <rect x={470} y={260} width={140} height={mix(160, 940, k)} rx={30} fill={C.deep} stroke={C.cream} strokeWidth={8} />
      <T x={540} y={220} text="LIMITS OF HEARING" size={60} color={C.cream} />
      <circle cx={540} cy={mix(420, 1200, k)} r={50} fill={C.amber} stroke={C.ink} strokeWidth={10} />
      <T x={540} y={mix(540, 1330, k)} text="THIS NOTE" size={64} color={C.amber} />
      <Tick x={190} y={1260} pxPerM={300} frame={f} pose="point" expression="surprised" facing={1} />
    </g>
  );
};

/** d2 - a million billion times: the number stamps on. */
const d2: Shot = ({ f }) => (
  <g transform={shake(f, 4, 10, 12)}>
    <Space f={f} stops={["#4B2A8C", "#7C3FA8", "#E4572E"]} />
    <T x={540} y={400} text="A MILLION" size={190} color={C.amber} />
    <T x={540} y={620} text="BILLION" size={190} color={C.amber} />
    <T x={540} y={800} text="TIMES DEEPER" size={110} color={C.cream} />
    <Plaque x={540} y={1050} text="1,000,000,000,000,000 x" size={54} bg={C.ink} fg={C.cream} scale={ez(f, 4, 12)} />
  </g>
);

/** d3 - Tick peers down a chasm. */
const d3: Shot = ({ f }) => (
  <g>
    <Space f={f} />
    {Array.from({ length: 9 }, (_, i) => (
      <path key={i} d={`M${100 + i * 110} 1250 L${340 + i * 50} ${300 + ((f * 6 + i * 70) % 300)}`} stroke={C.mint} strokeWidth={10} opacity={0.5} strokeLinecap="round" />
    ))}
    <rect x={0} y={1230} width={W} height={60} fill={C.ink} />
    <Tick x={540} y={1260} pxPerM={430} frame={f} pose="lean" expression="worried" facing={1} />
  </g>
);

/** e1 - an enormous, very slow wave passes Tick, who has ears up. */
const e1: Shot = ({ f }) => (
  <g>
    <Space f={f} />
    <PressureWave f={f} y={720} x0={-40} x1={W + 40} amp={140} wavelength={1700} speed={3} color={C.mint} core={C.cream} width={14} lineColor={C.amber} />
    <Tick x={540} y={1260} pxPerM={420} frame={f} pose="listen" expression="neutral" facing={1} />
    <Plaque x={540} y={190} text="TOO DEEP" size={130} bg={C.ink} fg={C.amber} />
  </g>
);

/** e2 - Tick shrugs at silence. */
const e2: Shot = ({ f }) => (
  <g>
    <Space f={f} />
    <T x={540} y={540 + bob(f, 30, 14)} text="..." size={420} color={C.cream} />
    <Tick x={540} y={1260} pxPerM={430} frame={f} pose="shrug" expression="neutral" facing={1} />
    <Plaque x={540} y={190} text="FOR ANY EAR" size={120} bg={C.ink} fg={C.cream} />
  </g>
);

/** f1 - a space telescope drifts across a starfield. */
const f1: Shot = ({ f, n }) => (
  <g>
    <Space f={f} stops={["#06061E", "#161050", "#2A1B63"]} />
    <Satellite x={mix(1000, 200, ez(f, 0, n))} y={650 + bob(f, 40, 30)} s={460} family={VOID} f={f} rot={mix(18, -14, ez(f, 0, n))} />
    <Plaque x={540} y={190} text="NASA'S CHANDRA" size={84} bg={C.ink} fg={C.amber} />
  </g>
);

/** f2 - the X-ray image: a hazy glow with faint ripples. */
const f2: Shot = ({ f }) => (
  <g>
    <Space f={f} stops={["#06061E", "#161050", "#2A1B63"]} />
    <rect x={120} y={300} width={840} height={840} rx={40} fill="#060619" stroke={C.cream} strokeWidth={10} />
    <Bloom x={540} y={720} r={420 + 20 * Math.sin(f / 8)} color={GAS} strength={0.9} />
    <Rings f={f} cx={540} cy={720} period={22} speed={5} maxR={400} width={6} color={C.cream} glow={false} opacity={0.6} />
    <Plaque x={540} y={1230} text="X-RAY OBSERVATION" size={62} bg={C.ink} fg={C.cream} />
  </g>
);

const Cluster: React.FC<{ f: number; cy?: number; speed?: number }> = ({ f, cy = 700, speed = 5 }) => (
  <g>
    <Bloom x={540} y={cy} r={640} color={GAS} strength={1} />
    <Bloom x={420} y={cy + 80} r={320} color="#E4572E" strength={0.5} />
    <Bloom x={680} y={cy - 60} r={300} color="#FFC83D" strength={0.4} />
    <Rings f={f} cx={540} cy={cy} period={20} speed={speed + 2} maxR={800} width={16} color={C.cream} glow={false} opacity={1} />
  </g>
);

/** g1 - slow ripples spread through a cloud of hot gas. */
const g1: Shot = ({ f }) => (
  <g>
    <Space f={f} stops={["#06061E", "#161050", "#2A1B63"]} />
    <Cluster f={f} />
    <T x={540} y={190} text="RIPPLES IN HOT GAS" size={80} color={C.amber} />
  </g>
);

/** g2 - the ripples pulse out; Tick is tiny against the cloud. */
const g2: Shot = ({ f }) => (
  <g>
    <Space f={f} stops={["#06061E", "#161050", "#2A1B63"]} />
    <Cluster f={f * 1.4} cy={640} speed={8} />
    <Tick x={540} y={1290} pxPerM={190} frame={f} pose="point" expression="surprised" facing={1} />
    <T x={540} y={960} text="A SOUND WAVE" size={96} color={C.cream} />
  </g>
);

/** g3 - the distance ruler snaps: 250 million light years. */
const g3: Shot = ({ f, n }) => (
  <g>
    <Space f={f} stops={["#06061E", "#161050", "#2A1B63"]} />
    <path d="M110 900 H970" stroke={C.cream} strokeWidth={12} strokeDasharray="30 22" strokeDashoffset={-f * 4} />
    <circle cx={110} cy={900} r={40} fill={C.green} stroke={C.ink} strokeWidth={8} />
    <circle cx={970} cy={900} r={90} fill={GAS} opacity={0.9} />
    <T x={110} y={1010} text="US" size={60} color={C.cream} />
    <Counter x={540} y={640} value={250 * ez(f, 0, n - 6)} max={250} size={300} color={C.amber} align="middle" digits={3} />
    <T x={540} y={300} text="MILLION LIGHT YEARS" size={72} color={C.cream} />
  </g>
);

/** g4 - the whole cluster glows and pulses. */
const g4: Shot = ({ f }) => (
  <g>
    <Space f={f} stops={["#06061E", "#161050", "#2A1B63"]} />
    <g transform={`translate(540 700) scale(${1 + 0.05 * Math.sin(f / 9)}) translate(-540 -700)`}>
      <Cluster f={f} />
    </g>
    <Plaque x={540} y={1160} text="A REAL SOUND WAVE" size={70} bg={C.ink} fg={C.amber} />
  </g>
);

/** h1 - a timeline bar rolling to 2.5 billion years. */
const h1: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 4);
  return (
    <g>
      <Space f={f} />
      <rect x={90} y={880} width={900} height={60} rx={30} fill={C.ink} />
      <rect x={100} y={890} width={880 * k} height={40} rx={20} fill={C.amber} />
      <T x={540} y={640} text={(2.5 * k).toFixed(1)} size={420} color={C.amber} />
      <T x={540} y={780} text="BILLION YEARS" size={100} color={C.cream} />
    </g>
  );
};

/** h2 - a flat line that barely moves while the clock spins. */
const h2: Shot = ({ f }) => (
  <g>
    <Space f={f} />
    <PressureWave f={f} y={640} x0={-40} x1={W + 40} amp={70} wavelength={1500} speed={2} color={C.mint} core={C.cream} width={14} lineColor={C.amber} />
    <Clock x={540} y={1050} r={190} a={f * 0.05} />
    <T x={540} y={290} text="ROUGHLY STEADY" size={96} color={C.cream} />
  </g>
);

/** h3 - Tick waits it out beside the spinning clock. */
const h3: Shot = ({ f }) => (
  <g>
    <Space f={f} />
    <Clock x={720} y={640} r={300} a={f * 0.08} />
    <Tick x={300} y={1260} pxPerM={480} frame={f} pose="sit" expression="sleepy" facing={1} />
    <Plaque x={540} y={190} text="STILL THE SAME NOTE" size={70} bg={C.ink} fg={C.amber} />
  </g>
);

/** i1 - the question over the glowing cluster. */
const i1: Shot = ({ f }) => (
  <g>
    <Space f={f} stops={["#06061E", "#161050", "#2A1B63"]} />
    <Glow x={540} y={780} r={800} color={GAS} f={f} strength={0.6} />
    <Qmark f={f} x={540} y={1000} size={900} />
    <Plaque x={540} y={190} text="WHAT IS PLAYING IT?" size={84} bg={C.ink} fg={C.amber} />
  </g>
);

const i2: Shot = ({ f }) => <EndShot f={f} stops={["#0B0A2E", "#2A1B63", "#4B2A8C"]} q={["WHAT PLAYS", "THE NOTE?"]} />;

export const ShortS55 = makeShort(timeline, [[a1, a2], [b1, b2, b3, b4], [c1, c2], [d1, d2, d3], [e1, e2], [f1, f2], [g1, g2, g3, g4], [h1, h2, h3], [i1, i2]]);
