import React from "react";
import { Sky, Tick } from "../../lib/illustrated";
import { buildTimeline, VoLine } from "../../lib/timeline";
import { EndShot, W, H, Shot, makeShort } from "../S41-dig-plate/vkit";
import { Qmark } from "../S46-peak-seafloor/kit46";
import { Bracket } from "../L15-space-jump/props";
import { Count, C, Plaque, ez, mix } from "../S61-record-peak/kit61";
import { MoonFace } from "../L18-moon-low-orbit/sky";
import { EarthDisc, EarthLimb, StationToken } from "../L18-moon-low-orbit/planets18";
import { Clipboard } from "../L18-moon-low-orbit/icons18";
import { AgencyPill, OurSumPill } from "../L18-moon-low-orbit/tags18";
import { Arrow18, PullArrows, PullBar, TidalBall } from "../L18-moon-low-orbit/tidal";
import { familyOf } from "../L18-moon-low-orbit/families";
import vo from "./vo.json";

/**
 * S71 - The Moon at the space station's height: about 92,000 times the tidal pull (episodes/S71-ninety-two-thousand). For L18, answered at 5:35 (What the model says happens).
 * Numbers (sources.md, L18 rows 1, 8, 10, 19, 21): NOAA, tide-generating force varies inversely as the cube of the distance; Moon 384,400 km away;
 * center 8,516 km (about 8,500) from Earth's center; (384,400 / 8,516)^3 = 91,960 (about 92,000 times); Moon 3,476 km across; near side more than twice
 * as hard as the far side (2.29). Our sums (OUR SUM pill). Withheld: whether the Moon holds together (the model says it would not; ring) and the 1.4 stretch.
 */
export const timeline = buildTimeline(vo as VoLine[]);

const GAUGE = familyOf("gauge");
const ABYSS = familyOf("abyss");

/** Wide light bands sliding across the whole frame (the probe lesson: a large edge moving every half-second). */
const BandField: React.FC<{ f: number; color: string; speed?: number; alpha?: number; n?: number }> = ({ f, color, speed = 5, alpha = 0.14, n = 5 }) => {
  const w = 280;
  const period = W + w * 2;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const x = (((i * period) / n + f * speed) % period) - w;
        return <rect key={i} x={x} y={0} width={w} height={H} fill={color} opacity={alpha} transform="skewX(-10)" />;
      })}
    </g>
  );
};
const Bg: React.FC<{ f: number; dark?: boolean }> = ({ f, dark }) => (
  <g>
    <Sky stops={(dark ? ABYSS : GAUGE).sky as unknown as string[]} x={0} y={0} w={W} h={H} />
    <BandField f={f} color={dark ? "#FFD27A" : "#E6FFF0"} alpha={dark ? 0.1 : 0.15} />
  </g>
);

/** Earth on the left, the Moon on the right, the pull arrow between them (shorter and thinner the farther the Moon). */
const Pair: React.FC<{ f: number; moonX: number; y?: number; earthR?: number; moonR?: number; arrow?: boolean }> = ({ f, moonX, y = 800, earthR = 170, moonR = 95, arrow = true }) => {
  const ex = 230;
  const gap = Math.max(1, moonX - moonR - (ex + earthR));
  return (
    <g>
      <EarthDisc x={ex} y={y} r={earthR} f={f} spin={4} />
      <MoonFace f={f} x={moonX} y={y} radius={moonR} scroll={2} />
      {arrow ? <Arrow18 x0={moonX - moonR - 14} y0={y} x1={ex + earthR + 14} y1={y} color={C.orange} width={Math.max(10, 70 - gap * 0.14)} /> : null}
    </g>
  );
};

/** a - the pull falls with the cube of the distance. */
const a1: Shot = ({ f, n }) => (
  <g>
    <Bg f={f} />
    <Pair f={f} moonX={mix(600, 900, ez(f, 0, n))} />
    <Plaque x={540} y={190} text="TIDAL PULL" size={100} bg={C.ink} fg={C.amber} />
    <Plaque x={540} y={350} text="WEAKER WITH DISTANCE CUBED" size={44} bg={C.ink} fg={C.cream} />
  </g>
);
const a2: Shot = ({ f }) => (
  <g>
    <Bg f={f} />
    <Pair f={f} moonX={760 + 140 * Math.sin(f / 12)} />
    <AgencyPill x={540} y={190} size={50} align="middle" agency="NOAA SAYS" />
    <Plaque x={540} y={350} text="INVERSE CUBE OF THE DISTANCE" size={44} bg={C.ink} fg={C.cream} />
  </g>
);

/** b - today the Moon is about 384,400 km away. */
const b1: Shot = ({ f, n }) => (
  <g>
    <Bg f={f} />
    <Pair f={f} moonX={900} earthR={190} moonR={100} arrow={false} />
    <Bracket x1={450} y1={1060} x2={820} y2={1000} draw={ez(f, 0, Math.round(n * 0.6))} color={C.amber} />
    <Count x={540} y={190} f={f} b={384400} f1={Math.round(n * 0.4)} unit=" KM" w={820} size={110} />
    <Plaque x={540} y={350} text="ABOUT, TODAY" size={50} bg={C.ink} fg={C.cream} />
  </g>
);
const b2: Shot = ({ f }) => (
  <g>
    <Bg f={f} />
    <EarthLimb f={f} y={1010} cx={540} cloudSpeed={12} />
    <MoonFace f={f} x={820 + Math.sin(f / 15) * 10} y={560} radius={80} scroll={2} />
    <Tick x={230} y={1170} pxPerM={250} frame={f} pose="point" expression="happy" facing={1} />
    <Plaque x={540} y={190} text="THE MOON TODAY" size={80} bg={C.ink} fg={C.amber} />
    <Plaque x={540} y={340} text="ABOUT 384,400 KM" size={64} bg={C.ink} fg={C.cream} />
  </g>
);

/** c - lower it to the space station's height: center about 8,500 km from Earth's center. */
const c1: Shot = ({ f, n }) => (
  <g>
    <Bg f={f} />
    <Pair f={f} moonX={mix(900, 720, ez(f, 0, Math.round(n * 0.4)))} earthR={190} moonR={95} />
    <Count x={540} y={190} f={f} a={384400} b={8500} f1={Math.round(n * 0.35)} unit=" KM" w={760} size={110} />
    <Plaque x={540} y={350} text="ABOUT, TO EARTH'S CENTER" size={46} bg={C.ink} fg={C.cream} />
    <OurSumPill x={540} y={72} size={32} align="middle" />
  </g>
);
const c2: Shot = ({ f }) => (
  <g>
    <Bg f={f} dark />
    <EarthLimb f={f} y={1010} cx={540} cloudSpeed={14} />
    <MoonFace f={f} x={540} y={630 + Math.sin(f / 14) * 8} radius={270} scroll={2.5} />
    <StationToken x={((f * 6) % 1300) - 110} y={930} size={130} f={f} />
    <Plaque x={540} y={190} text="SPACE STATION HEIGHT" size={66} bg={C.ink} fg={C.amber} />
    <Plaque x={540} y={330} text="ABOUT 8,500 KM FROM THE CENTER" size={36} bg={C.ink} fg={C.cream} />
  </g>
);

/** d - cube that change: about 92,000 times today's pull. */
const d1: Shot = ({ f, n }) => (
  <g>
    <Bg f={f} />
    <PullBar x={330} y={1080} h={560} t={ez(f, 0, Math.round(n * 0.4))} f={f} readKey="pull92k" w={420} color={C.amber} />
    <Plaque x={540} y={190} text="ABOUT" size={70} bg={C.ink} fg={C.cream} />
    <Plaque x={540} y={330} text="TIMES TODAY'S PULL" size={58} bg={C.ink} fg={C.amber} />
    <OurSumPill x={540} y={72} size={32} align="middle" />
  </g>
);
const d2: Shot = ({ f, n }) => (
  <g>
    <Bg f={f} dark />
    <EarthLimb f={f} y={1020} cx={540} cloudSpeed={14} />
    <MoonFace f={f} x={540} y={620} radius={220} scroll={3} />
    <Arrow18 x0={540} y0={860} x1={540} y1={1010} color={C.orange} width={64 + 14 * Math.sin(f / 4)} />
    <Count x={540} y={190} f={f} b={92000} f1={Math.round(n * 0.4)} unit="×" w={720} size={140} />
    <Plaque x={540} y={350} text="TODAY'S TIDAL PULL" size={50} bg={C.ink} fg={C.cream} />
  </g>
);

/** e - our own sum, a simple model, not a measured tide. */
const e1: Shot = ({ f }) => (
  <g>
    <Bg f={f} />
    <Clipboard x={540} y={800 + Math.sin(f / 10) * 10} size={440} />
    <Plaque x={540} y={190} text="OUR OWN SUM" size={96} bg={C.ink} fg={C.amber} />
    <Plaque x={540} y={350} text="A SIMPLE MODEL" size={64} bg={C.ink} fg={C.cream} />
    <OurSumPill x={540} y={72} size={32} align="middle" />
  </g>
);
const e2: Shot = ({ f }) => {
  const wave = Array.from({ length: 19 }, (_, i) => `${i === 0 ? "M" : "L"}${(i * 60).toFixed(0)} ${(700 + Math.sin(i * 0.9 + f / 6) * 46).toFixed(1)}`).join(" ");
  return (
    <g>
      <Bg f={f} />
      <path d={wave} fill="none" stroke={C.sky} strokeWidth={34} strokeLinecap="round" />
      <path d={`${wave} L1080 1500 L0 1500 Z`} fill={C.sea} opacity={0.55} />
      <path d="M390 520 L690 900 M690 520 L390 900" stroke={C.verm} strokeWidth={46} strokeLinecap="round" />
      <Plaque x={540} y={190} text="NOT A MEASURED" size={80} bg={C.ink} fg={C.amber} />
      <Plaque x={540} y={350} text="TIDE" size={110} bg={C.ink} fg={C.cream} />
    </g>
  );
};

/** f - the Moon is a ball 3,476 km across: near side pulled more than twice as hard as the far side. */
const f1: Shot = ({ f }) => (
  <g>
    <Bg f={f} />
    <EarthDisc x={110} y={760} r={160} f={f} spin={4} />
    <TidalBall x={640} y={760} r={230} f={f} stretch={0.3} spin={3} />
    <Bracket x1={410} y1={1030} x2={870} y2={1030} draw={ez(f, 0, 12)} color={C.amber} />
    <Plaque x={540} y={190} text="A BALL, 3,476 KM ACROSS" size={52} bg={C.ink} fg={C.cream} />
    <OurSumPill x={540} y={72} size={32} align="middle" />
  </g>
);
const f2: Shot = ({ f, n }) => (
  <g>
    <Bg f={f} />
    <TidalBall x={880} y={760} r={110} f={f} stretch={0.3} spin={3} />
    <PullArrows x={760} y={700} near={618} far={270} f={f} stack={ez(f, 4, Math.round(n * 0.7))} />
    <Plaque x={540} y={190} text="NEAR SIDE: MORE THAN" size={56} bg={C.ink} fg={C.cream} />
    <Plaque x={540} y={350} text="2× THE FAR SIDE" size={80} bg={C.ink} fg={C.amber} />
    <OurSumPill x={540} y={72} size={32} align="middle" />
  </g>
);

/** g - so would the Moon hold together? (withheld) */
const g1: Shot = ({ f }) => (
  <g>
    <Bg f={f} />
    <TidalBall x={500} y={780} r={250} f={f} stretch={0.45 + 0.25 * Math.sin(f / 7)} spin={3} />
    <Qmark f={f} x={900} y={700} size={320} />
    <Plaque x={540} y={190} text="WOULD IT HOLD" size={90} bg={C.ink} fg={C.amber} />
    <Plaque x={540} y={350} text="TOGETHER?" size={90} bg={C.ink} fg={C.cream} />
  </g>
);
const g2: Shot = ({ f }) => (
  <g>
    <Bg f={f} />
    <TidalBall x={540} y={780} r={290} f={f + 20} stretch={0.55 + 0.2 * Math.sin(f / 5)} selfPull spin={3} />
    <Qmark f={f} x={900} y={480} size={300} />
    <Plaque x={540} y={190} text="DOES IT HOLD?" size={100} bg={C.ink} fg={C.amber} />
  </g>
);

const end: Shot = ({ f }) => (
  <EndShot f={f} stops={GAUGE.sky as unknown as string[]} q={["WOULD IT HOLD", "TOGETHER?"]}>
    <MoonFace f={f} x={940} y={1290} radius={80} scroll={2} />
  </EndShot>
);

export const ShortS71 = makeShort(timeline, [[a1, a2], [b1, b2], [c1, c2], [d1, d2], [e1, e2], [f1, f2], [g1, g2], [end]]);
