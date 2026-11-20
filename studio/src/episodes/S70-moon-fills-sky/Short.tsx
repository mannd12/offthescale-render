import React from "react";
import { Sky, Tick } from "../../lib/illustrated";
import { buildTimeline, VoLine } from "../../lib/timeline";
import { EndShot, W, H, Shot, makeShort } from "../S41-dig-plate/vkit";
import { Qmark } from "../S46-peak-seafloor/kit46";
import { Bracket } from "../L15-space-jump/props";
import { Count, C, HBar, Plaque, ez, mix } from "../S61-record-peak/kit61";
import { MoonFace, SkyBowl } from "../L18-moon-low-orbit/sky";
import { EarthLimb, StationToken } from "../L18-moon-low-orbit/planets18";
import { PeaIcon } from "../L18-moon-low-orbit/icons18";
import { OurSumPill } from "../L18-moon-low-orbit/tags18";
import { familyOf } from "../L18-moon-low-orbit/families";
import vo from "./vo.json";

/**
 * S70 - The Moon at the space station's height would be 78 degrees wide (episodes/S70-moon-fills-sky). For L18, answered at 1:12 (The clock).
 * Numbers (sources.md, L18 rows 3, 8, 12): today about half a degree (0.518), about a small pea at arm's length; the Moon's surface 400 km above
 * Earth's, straight underneath about 78 degrees (78.2), the sky horizon to horizon 180 degrees, about 150 times wider (151). Our sums (OUR SUM pill).
 * Withheld: the clock (a lap in about two hours ten, rises in the west, crosses in minutes): the Moon only swings back and forth with a "?".
 */
export const timeline = buildTimeline(vo as VoLine[]);

const BOWL = familyOf("bowl");
const ABYSS = familyOf("abyss");
const CX = 540;
const HZ = 1060;
const BR = 460;
const bowlXY = (deg: number, R = BR): [number, number] => [CX - R * Math.cos((deg * Math.PI) / 180), HZ - R * Math.sin((deg * Math.PI) / 180)];

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
const SkyBg: React.FC<{ f: number; dark?: boolean }> = ({ f, dark }) => (
  <g>
    <Sky stops={(dark ? ABYSS : BOWL).sky as unknown as string[]} x={0} y={0} w={W} h={H} />
    <BandField f={f} color={dark ? "#FFD27A" : "#FFF1C2"} alpha={dark ? 0.1 : 0.16} />
  </g>
);
const Bowl: React.FC<{ f: number } & Partial<React.ComponentProps<typeof SkyBowl>>> = ({ f, ...p }) => <SkyBowl family={BOWL} cx={CX} horizon={HZ} R={BR} labels={false} clouds={3} {...p} f={f} />;

/** a - today: about half a degree, about a small pea at arm's length. */
const a1: Shot = ({ f, n }) => (
  <g>
    <SkyBg f={f} />
    <Bowl f={f} numerals />
    <MoonFace f={f} x={CX} y={bowlXY(90)[1] + 30} radius={16} />
    <Plaque x={540} y={190} text="ABOUT HALF" size={100} bg={C.ink} fg={C.amber} scale={0.94 + 0.06 * ez(f, 0, Math.round(n * 0.3))} />
    <Plaque x={540} y={350} text="A DEGREE WIDE, TODAY" size={56} bg={C.ink} fg={C.cream} />
  </g>
);
const a2: Shot = ({ f }) => (
  <g>
    <SkyBg f={f} />
    <Tick x={230} y={1170} pxPerM={250} frame={f} pose="point" expression="happy" facing={1} />
    <PeaIcon x={650} y={830 + Math.sin(f / 9) * 14} size={330} />
    <Plaque x={540} y={190} text="A SMALL PEA" size={100} bg={C.ink} fg={C.amber} />
    <Plaque x={540} y={350} text="AT ARM'S LENGTH" size={70} bg={C.ink} fg={C.cream} />
    <OurSumPill x={540} y={72} size={32} align="middle" />
  </g>
);

/** b - sink it until its surface is 400 km above ours, the height of the space station. */
const b1: Shot = ({ f, n }) => (
  <g>
    <SkyBg f={f} dark />
    <EarthLimb f={f} y={1000} cx={540} cloudSpeed={14} />
    <MoonFace f={f} x={CX} y={mix(380, 690, ez(f, 0, n))} radius={190} scroll={2} />
    <Count x={540} y={190} f={f} b={400} f1={Math.round(n * 0.5)} unit=" KM UP" w={760} size={110} />
  </g>
);
const b2: Shot = ({ f }) => (
  <g>
    <SkyBg f={f} dark />
    <EarthLimb f={f} y={1010} cx={540} cloudSpeed={14} />
    <MoonFace f={f} x={CX} y={640 + Math.sin(f / 14) * 8} radius={290} scroll={2.5} />
    <StationToken x={((f * 6) % 1300) - 110} y={930} size={130} f={f} />
    <Plaque x={540} y={190} text="SPACE STATION HEIGHT" size={66} bg={C.ink} fg={C.amber} />
    <Plaque x={540} y={330} text="MOON'S SURFACE: 400 KM UP" size={46} bg={C.ink} fg={C.cream} />
  </g>
);

/** c - straight underneath, about 78 degrees wide. */
const c1: Shot = ({ f, n }) => (
  <g>
    <SkyBg f={f} />
    <Bowl f={f} wedge={[51, 129]} wedgeFill={ez(f, 0, Math.round(n * 0.6))} />
    <MoonFace f={f} x={CX} y={760} radius={mix(40, 290, ez(f, 0, Math.round(n * 0.6)))} scroll={3} />
    <Count x={540} y={190} f={f} b={78} f1={Math.round(n * 0.4)} unit="° WIDE" w={640} size={120} />
    <OurSumPill x={540} y={72} size={32} align="middle" />
  </g>
);
const c2: Shot = ({ f, n }) => (
  <g>
    <SkyBg f={f} />
    <Bowl f={f} wedge={[51, 129]} wedgeFill={1} />
    <MoonFace f={f} x={CX} y={760 + Math.sin(f / 12) * 6} radius={290} scroll={4} />
    <Bracket x1={250} y1={1110} x2={830} y2={1110} draw={ez(f, 0, Math.round(n * 0.4))} color={C.amber} />
    <Plaque x={540} y={190} text="STRAIGHT UNDERNEATH" size={64} bg={C.ink} fg={C.cream} />
    <Plaque x={540} y={340} text="ABOUT 78°" size={110} bg={C.ink} fg={C.amber} />
  </g>
);

/** d - horizon to horizon is 180 degrees. */
const d1: Shot = ({ f, n }) => (
  <g>
    <SkyBg f={f} />
    <Bowl f={f} numerals draw={ez(f, 0, Math.round(n * 0.7))} sweep={180 * ez(f, 0, Math.round(n * 0.7))} />
    <Count x={540} y={190} f={f} b={180} f1={Math.round(n * 0.4)} unit="°" w={520} size={130} />
    <Plaque x={540} y={350} text="HORIZON TO HORIZON" size={56} bg={C.ink} fg={C.cream} />
  </g>
);
const d2: Shot = ({ f }) => (
  <g>
    <SkyBg f={f} />
    <Bowl f={f} labels numerals pointer={90 + 88 * Math.sin(f / 10)} trail={[10, 170]} />
    <Plaque x={540} y={190} text="THE WHOLE SKY" size={90} bg={C.ink} fg={C.amber} />
    <Plaque x={540} y={350} text="180° ACROSS" size={64} bg={C.ink} fg={C.cream} />
  </g>
);

/** e - one Moon would stretch across nearly half of it. */
const e1: Shot = ({ f, n }) => (
  <g>
    <SkyBg f={f} />
    <Plaque x={540} y={450} text="THE SKY: 180°" size={60} bg={C.ink} fg={C.cream} />
    <HBar x={100} y={560} w={880} k={ez(f, 0, 8)} color={C.cream} />
    <Plaque x={540} y={790} text="THE MOON: 78°" size={60} bg={C.ink} fg={C.amber} />
    <HBar x={100} y={900} w={880} k={(78 / 180) * ez(f, 4, Math.round(n * 0.5))} color={C.amber} />
    <Plaque x={540} y={190} text="NEARLY HALF" size={100} bg={C.ink} fg={C.amber} />
  </g>
);
const e2: Shot = ({ f }) => (
  <g>
    <SkyBg f={f} />
    <Bowl f={f} wedge={[51, 129]} wedgeFill={1} />
    <MoonFace f={f} x={CX} y={760} radius={290} scroll={4} dir={180} />
    <Plaque x={540} y={190} text="NEARLY HALF" size={100} bg={C.ink} fg={C.amber} />
    <Plaque x={540} y={350} text="OF THE WHOLE SKY" size={60} bg={C.ink} fg={C.cream} />
  </g>
);

/** f - about 150 times wider than the Moon you know. */
const f1: Shot = ({ f }) => (
  <g>
    <SkyBg f={f} />
    <MoonFace f={f} x={690} y={760} radius={340} scroll={3} />
    <MoonFace f={f} x={150} y={760} radius={26} />
    <Plaque x={150} y={900} text="TODAY" size={44} bg={C.ink} fg={C.cream} w={230} />
    <Plaque x={540} y={190} text="THE MOON YOU KNOW" size={64} bg={C.ink} fg={C.cream} />
    <Plaque x={540} y={1100} text="NOT TO SCALE" size={36} bg={C.ink} fg={C.cream} />
  </g>
);
const f2: Shot = ({ f, n }) => (
  <g>
    <SkyBg f={f} />
    <MoonFace f={f} x={540} y={900} radius={420} scroll={4} dir={90} />
    <Plaque x={540} y={190} text="ABOUT" size={70} bg={C.ink} fg={C.cream} />
    <Count x={540} y={480} f={f} b={150} f1={Math.round(n * 0.4)} unit="× WIDER" w={800} size={160} />
    <OurSumPill x={540} y={72} size={32} align="middle" />
  </g>
);

/** g - and it would not sit still: which way, how fast? (withheld: the answer is the clock) */
const Swing: React.FC<{ f: number; rate: number; mark: string }> = ({ f, rate, mark }) => {
  const a = 90 + 68 * Math.sin(f / rate);
  return (
    <g>
      <SkyBg f={f} />
      <Bowl f={f} />
      {[3, 2, 1].map((k) => {
        const [gx, gy] = bowlXY(90 + 68 * Math.sin((f - k * 5) / rate), BR * 0.62);
        return <circle key={k} cx={gx} cy={gy} r={150 - k * 8} fill={C.gold} opacity={0.16} />;
      })}
      <MoonFace f={f} x={bowlXY(a, BR * 0.62)[0]} y={bowlXY(a, BR * 0.62)[1]} radius={190} scroll={3} />
      <Qmark f={f} x={900} y={470} size={300} />
      <Plaque x={540} y={190} text={mark} size={100} bg={C.ink} fg={C.amber} />
    </g>
  );
};
const g1: Shot = ({ f }) => <Swing f={f} rate={12} mark="WHICH WAY?" />;
const g2: Shot = ({ f }) => <Swing f={f + 30} rate={7} mark="HOW FAST?" />;

const end: Shot = ({ f }) => (
  <EndShot f={f} stops={BOWL.sky as unknown as string[]} q={["WHICH WAY?", "HOW FAST?"]}>
    <MoonFace f={f} x={940} y={1290} radius={80} scroll={2} />
  </EndShot>
);

export const ShortS70 = makeShort(timeline, [[a1, a2], [b1, b2], [c1, c2], [d1, d2], [e1, e2], [f1, f2], [g1, g2], [end]]);
