// L19 scene "l04" · The desert (storyboard §3 act 2: 4-01…4-17, script lines 23-30; scope ↔ crest ↔ limb).
// Shot components (hard cuts only; PUSH/SLIDE rows are phases of one component):
//   4-01          Tick slaps the FOUND card on the desk (30 px/f), the "?" swings over the dial, the needle wanders (never resting)
//   4-02          the seesaw: JUPITER IS DRY / UNLUCKY PROBE, the beam tilting both ways (≈ 5 deg/f), the cards sliding (20 px/f)
//   4-03 (+4-04)  the orbiter swings in over the limb (28 px/f) and a report page flaps out (12 deg/f); NASA SAYS (1997). Push: the
//                 flat map, thick cloud sliding (16 px/f), the dry hole opening (+8 px/f), Tick's magnifier drifting; ENTRY SITE
//   4-05          the dry-patch diorama: the tumbleweed rolls (22 px/f), heat shimmer (20 px/f), the dune ripples slide (16 px/f);
//                 Tick (≥ 40 %) fans himself; THE SAHARA OF JUPITER (SCIENTISTS) (#6, Q1, F14)
//   4-06          wet cloud ring swirling round the small dry hole (6 deg/f), water drops streaming in (20 px/f); FAR MORE WATER
//   4-07 (+4-08)  the whole-atmosphere bar draws (28 px/f) with its dry sliver, the dry marks pulse (18 px/f), the map slides;
//                 UNDER 1 %. Slide: HEARD slams on the tape (24 px/f), the UNUSUAL tag swings (6 deg/f), Tick gives a cheer
//   4-09          Juno over the limb, microwave rings rolling down onto the equator belt (20 px/f), the belt sliding (18 px/f)
//   4-10 (+4-11)  the WATER chart: the bar grows to 2.7 × the SUN mark (30 px/f), bubbles rise in it; 2.7 TIMES THE SUN. Then the
//                 whiskers extend (40 px/f, longer above), the bar wobbles, Tick spreads his arms; WIDE ERROR BARS +2.4 / -1.7
//   4-12          the flat map, the entry cross flagged (8 deg/f) with rings expanding (24 px/f); ANOMALOUS SITE
//   4-13          a highlight sweeps the equator belt then the whole planet (30 px/f), "?" tags pop in turn; Tick shrugs; UNCONFIRMED
//   4-14 (+4-14b) Juno's arc lights along the dial from 0.7 to 30 (head ≈ 4 deg/f) with the needle riding it and the lamps; then the
//                 probe's own arc draws inside it, ending at its last reading (the 23 notch), a glow runs it; DEEPER on 23-30 (Q6)
//   4-15          Juno's scan lines sweep along the equatorial zone (32 px/f), Juno glides, the belt slides (Q5: one zone only)
//   4-15b         one thin line drops to a single cross (40 px/f), the scans continue, the cross pulses; Tick points from the window
//   4-16          the HEARD ticket and the LOCAL tag slide together on the tape (28 px/f) and lock; the tape runs (24 px/f)
//   4-17          the LESSON 1 card flips up (12 deg/f), its underline draws (40 px/f), the tape runs (24 px/f)
// Numbers drawn (data19 READ): year1997 (#5/#6 pill) · dry1 1 (#6 A) · water27 2.7 (#7 A) · whiskers +2.4 / -1.7 (#7 A) · bar07 0.7,
// bar30 30 (#7 A); the SUN mark "1" and the dial numerals are SCALE_LABELS; LESSON 1 is a scale/ordinal label. No people (F1).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bloom, IF2, Layer, Sky, Stage, Tick } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { ShotDef, ShotFC, playShots } from "../shots";
import { BarDial, dialAngle } from "../dial";
import { TapeTicket, TapeTrace } from "../tape";
import { DeckBands, DryPatch, FlatMap } from "../decks";
import { Capsule, Orbiter } from "../probe19";
import { AgencyPill, ErrorBar, QuestionTag, WordPill } from "../tags19";
import { Cactus, Magnifier, SunIcon, Tumbleweed, WaterDrop } from "../icons19";
import { Cue, SFX, cutHit } from "./cue-types";
import {
  C,
  CREST,
  Card,
  ClipBox,
  ClipCircle,
  Clipboard,
  Cross,
  DRIFT,
  Descent,
  DriftBands,
  HeatWaves,
  INK,
  KickerA,
  LIMB,
  Limb,
  Phase,
  Plate,
  Pop,
  Rings,
  Roll,
  SCOPE,
  Seesaw,
  SpaceField,
  Station,
  ez,
  lerp,
  lin,
  wrap,
} from "./a-parts";

export const cuesL04 = (t: SceneTiming) => {
  const { at, frac } = cueKit(t);
  return {
    c02: frac(0, 0.42),
    c03: frac(0, 0.76),
    c04: at(1), // phase of 4-03 ("The place the probe entered")
    c05: frac(1, 0.55),
    c06: at(2),
    c07: frac(2, 0.47),
    c08: frac(2, 0.78), // phase ("So the probe's reading")
    c09: at(3),
    c10: frac(3, 0.35),
    c11: frac(3, 0.75), // phase ("with wide error bars")
    c12: at(4),
    c13: frac(4, 0.55),
    c14: at(5),
    c14b: frac(5, 0.52), // phase ("deeper than the probe's last reading")
    c15: at(6),
    c15b: frac(6, 0.5),
    c16: at(7),
    c17: frac(7, 0.5),
    end: t.frames,
  };
};
export type CL04 = ReturnType<typeof cuesL04>;

const MAP_FILL = "#FFF0A0"; // thick cloud (crest light; not cream: chroma 0.37)

// ================================================================================================================
// 4-01 · the mystery: Tick slaps the FOUND card on the desk (falls 30+ px/f, dust ring), the "?" swings over the dial, the
// needle wanders (never resting on a value), the wall panels slide (5 px/f)
// ================================================================================================================
const ShotSlap: ShotFC<CL04> = ({ f }) => {
  const cy = lerp(-300, 560, ez(f, 0, 9));
  return (
    <Stage theme={SCOPE.theme} shotFrame={f} drift={DRIFT(1, 1.1, 0.04)} vignette={0.16} grain={0.5}>
      <Station f={f} desk={820} seed={81} />
      <Layer depth={1}>
        <rect x={1090} y={150} width={580} height={600} rx={40} fill={C.emeraldDeep} />
        <BarDial f={f} cx={1380} cy={440} r={250} needle={2.2 + 1.4 * Math.sin(f * 0.07)} lit={12} sweep={12} />
        <g transform={`rotate(${18 * Math.sin(f * 0.33)} 1380 60)`}>
          <line x1={1380} y1={30} x2={1380} y2={100} stroke={C.goldRim} strokeWidth={5} />
          <QuestionTag x={1380} y={140} f={0} size={90} />
        </g>
        <Card x={640} y={cy} w={340} h={300} title="FOUND" rot={-6}>
          <rect x={780} y={cy + 160} width={60} height={110} rx={14} fill={C.emeraldDeep} opacity={0.35} />
          <rect x={780} y={cy + 240} width={60} height={30} rx={14} fill={C.belt} />
        </Card>
        {f > 9 ? <Rings f={f - 9} x={810} y={860} speed={16} max={300} n={2} color={C.heard} width={8} squash={0.25} /> : null}
        <Tick x={420} y={1050} pxPerM={240} frame={f} pose="press" expression="thinking" tilt={6} look={0.5} />
      </Layer>
    </Stage>
  );
};

// ================================================================================================================
// 4-02 · two options on a seesaw: JUPITER IS DRY and UNLUCKY PROBE; the beam tilts both ways and the cards slide along it
// (20 px/f); the small dial's needle wanders
// ================================================================================================================
const ShotOptions: ShotFC<CL04> = ({ f }) => {
  const tilt = 15 * Math.sin(f * 0.3);
  const s = 50 * Math.sin(f * 0.3 + 1.2);
  return (
    <Pop f={f}>
      <Stage theme={SCOPE.theme} shotFrame={f} drift={DRIFT(2, 1.1, 0.04)} vignette={0.16} grain={0.5}>
        <Station f={f} desk={900} win={{ x: 1560, y: 90, w: 280, h: 200 }} winSpeed={18} seed={82} />
        <Layer depth={1}>
          <BarDial f={f} cx={260} cy={220} r={130} needle={2.2 + 1.4 * Math.sin(f * 0.07)} lit={12} />
          <Seesaw
            x={960}
            y={640}
            w={1200}
            tilt={tilt}
            left={
              <g transform={`translate(${-80 + s} -10)`}>
                <Card x={-200} y={-250} w={400} h={240} title="JUPITER IS DRY" size={30}>
                  <WaterDrop x={0} y={-110} size={90} />
                  <line x1={-50} y1={-60} x2={50} y2={-160} stroke={C.vermilion} strokeWidth={10} strokeLinecap="round" />
                </Card>
              </g>
            }
            right={
              <g transform={`translate(${80 - s} -10)`}>
                <Card x={-200} y={-250} w={400} h={240} title="UNLUCKY PROBE" size={30} fill={C.apricot}>
                  <Capsule x={0} y={-100} r={42} f={f} chips={6} tilt={18} />
                </Card>
              </g>
            }
          />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 4-03 + 4-04 · the orbiter swings in over the limb (28 px/f) and a report page flaps out of it (12 deg/f), stars slide;
// NASA SAYS (1997) (#6). Push: the flat map under thick sliding cloud (16 px/f), the dry hole opening (+8 px/f) and glowing,
// Tick's magnifier drifting over it (14 px/f); ENTRY SITE (#6)
// ================================================================================================================
const ShotReport: ShotFC<CL04> = ({ f, c, len }) => {
  const T4 = c.c04 - c.c03;
  const ox = 1950 - f * 28;
  const oy = 260 + 30 * Math.sin(f * 0.05);
  const A = (
    <Pop f={f}>
      <Stage theme={LIMB.theme} shotFrame={f} drift={DRIFT(3, 1.1, 0.04)} vignette={0.3} grain={0.5}>
        <SpaceField f={f} speed={12} n={110} seed={83} />
        <Layer depth={1}>
          <Limb f={f} cx={960} cy={700 + 2600} R={2600} shear={[18, -16, 20, -18, 16, -22]} seed={83} />
          <Orbiter x={ox} y={oy} kind="galileo" f={f} size={1} />
          <g transform={`translate(${ox + 120} ${oy + 120}) rotate(${-20 + 30 * Math.sin(f * 0.4)})`}>
            <rect x={-70} y={-90} width={140} height={180} rx={10} fill={C.heard} stroke={C.lemonDeep} strokeWidth={4} />
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={-50} y={-60 + i * 34} width={100 - (i % 2) * 30} height={10} rx={5} fill={C.ink} opacity={0.5} />
            ))}
          </g>
        </Layer>
        <Layer depth={0}>
          <AgencyPill x={120} y={150} agency="NASA SAYS (1997)" size={34} appear={lin(f, 4, 14)} />
        </Layer>
      </Stage>
    </Pop>
  );
  const g = Math.max(0, f - T4);
  const mx = 140;
  const my = 110;
  const mw = 1360;
  const mh = 820;
  const hx = mx + mw * 0.55;
  const hy = my + mh * 0.5;
  const hr = Math.min(230, 20 + g * 8) + (g > 26 ? 6 * Math.sin(g * 0.2) : 0);
  const B = (
    <Stage theme={CREST.theme} shotFrame={g} drift={DRIFT(4, 1.14, 0.03)} vignette={0.2} grain={0.5}>
      <Sky family={CREST} />
      <DriftBands f={f} color="#FFE066" opacity={0.35} speed={7} n={3} w={500} angle={-24} seed={84} />
      <Layer depth={1}>
        <FlatMap f={f} x={mx} y={my} w={mw} h={mh} speed={16} />
        <ClipBox x={mx} y={my} w={mw} h={mh} rx={26}>
          {Array.from({ length: 22 }, (_, i) => {
            const row = i % 4;
            const x = mx - 200 + wrap(i * 173 + g * 16 * (row % 2 ? 1 : -1), mw + 400);
            const y = my + 110 + row * 200 + (i % 3) * 20;
            return <ellipse key={i} cx={x} cy={y} rx={150} ry={70} fill={MAP_FILL} opacity={0.88} />;
          })}
          <ellipse cx={hx} cy={hy} rx={hr * 1.4 + 40} ry={hr + 30} fill={MAP_FILL} />
          <ellipse cx={hx} cy={hy} rx={hr * 1.4} ry={hr} fill="#8E1A18" />
          <ellipse cx={hx} cy={hy} rx={hr * 1.0} ry={hr * 0.7} fill={C.glow} opacity={0.7 + 0.2 * Math.sin(g * 0.3)} />
          <Bloom x={hx} y={hy} r={hr * 1.2} color="#FF9640" strength={0.5} />
        </ClipBox>
        <Magnifier x={hx + 70 * Math.sin(g * 0.12)} y={hy + 30 * Math.cos(g * 0.12)} size={300} rotate={-25} />
        <Tick x={1700} y={1050} pxPerM={210} frame={g} facing={-1} pose="hold" expression="thinking" look={-0.5} />
      </Layer>
      <Layer depth={0}>
        <Plate x={hx} y={my + 60} text="ENTRY SITE" size={36} align="middle" appear={lin(g, 10, 20)} fill={C.heard} color={INK} />
      </Layer>
    </Stage>
  );
  void len;
  return <Phase f={f} at={T4 - 6} dur={14} kind="push" a={A} b={B} />;
};

// ================================================================================================================
// 4-05 · the joke the scientists made (F14, #6): the dry patch with the cactus and tumbleweed; the tumbleweed rolls across
// (22 px/f), heat shimmer rises (20 px/f), the dune ripples slide (16 px/f); Tick (≥ 40 %) fans himself, a sweat drop falls
// ================================================================================================================
const ShotSahara: ShotFC<CL04> = ({ f }) => {
  const tw = 640 + wrap(f * 22, 1300);
  return (
    <Pop f={f}>
      <Stage theme={CREST.theme} shotFrame={f} drift={DRIFT(5, 1.1, 0.04)} vignette={0.2} grain={0.5}>
        <Descent f={f} fam="crest" speed={0} shear={[16, -14, 16, -12, 14, -16]} seed={85} />
        <Layer depth={1}>
          <DryPatch f={f} x={1180} y={540} r={320} open={1} />
          <HeatWaves f={f} x={900} y={160} w={560} h={360} n={5} speed={20} />
          {[0, 1, 2].map((k) => {
            const y = 850 + k * 70;
            const d = Array.from({ length: 26 }, (_, i) => {
              const x = -100 + i * 90;
              return `${i ? "L" : "M"}${x} ${y + Math.sin((x + f * 16 * (k % 2 ? 1 : -1)) / 70) * 16}`;
            }).join(" ");
            return <path key={k} d={`${d} L2300 1200 L-100 1200 Z`} fill={k === 0 ? "#FFC247" : k === 1 ? "#F2A31B" : "#E8731C"} />;
          })}
          <Cactus x={1080} y={640} size={170} />
          <Tumbleweed x={tw} y={880} size={90} rotate={f * 14} />
          <Tick x={380} y={1050} pxPerM={254} frame={f} pose="wipe-brow" expression="happy" look={0.4} />
          <Clipboard x={540} y={640} size={110} rotate={-20 + 24 * Math.sin(f * 0.45)} />
          <WaterDrop x={300} y={560 + wrap(f * 6, 120)} size={30} />
        </Layer>
        <Layer depth={0}>
          <WordPill x={110} y={130} text="THE SAHARA OF JUPITER (SCIENTISTS)" F={CREST} size={32} appear={lin(f, 6, 16)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 4-06 · the orbiter's finding: a wet cloud ring swirls round the small dry hole (6 deg/f) and water drops stream into it
// (20 px/f); the camera pulls back; FAR MORE WATER AROUND IT (#6: about 100 times more; drawn as words)
// ================================================================================================================
const ShotWetRing: ShotFC<CL04> = ({ f }) => {
  const cx = 1000;
  const cy = 560;
  return (
    <Pop f={f}>
      <Stage theme={CREST.theme} shotFrame={f} drift={DRIFT(6, 0.94, 0.03)} vignette={0.2} grain={0.5}>
        <Descent f={f} fam="crest" speed={0} shear={[14, -16, 18, -14, 16, -18]} seed={86} />
        <Layer depth={1}>
          <DryPatch f={f} x={cx} y={cy} r={130} open={1} />
          {Array.from({ length: 14 }, (_, i) => {
            const a = ((i / 14) * 360 + f * 6) * (Math.PI / 180);
            return <ellipse key={i} cx={cx + Math.cos(a) * 420} cy={cy + Math.sin(a) * 300} rx={130} ry={74} fill={i % 2 ? "#9FEFF8" : C.belt} opacity={0.85} />;
          })}
          {Array.from({ length: 16 }, (_, i) => {
            const a = (i / 16) * Math.PI * 2 + 0.2;
            const r = 760 - wrap(f * 20 + i * 47, 300);
            return <WaterDrop key={i} x={cx + Math.cos(a) * r} y={cy + Math.sin(a) * r * 0.7} size={46} />;
          })}
        </Layer>
        <Layer depth={0}>
          <Plate x={110} y={150} text="FAR MORE WATER AROUND IT" size={38} appear={lin(f, 6, 16)} fill={C.heard} color={INK} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 4-07 + 4-08 · the bar over the planet: the whole atmosphere draws (28 px/f) and the dry share is a sliver at its start;
// the dry marks pulse rings (18 px/f), the map slides (16-22 px/f); UNDER 1 % (#6). Slide: HEARD slams on the tape (24 px/f)
// with a dust ring, the UNUSUAL tag swings under it (6 deg/f); Tick cheers
// ================================================================================================================
const DRY_MARKS: [number, number][] = [
  [0.12, 0.3],
  [0.3, 0.72],
  [0.47, 0.42],
  [0.62, 0.2],
  [0.75, 0.64],
  [0.9, 0.36],
];
const ShotSliver: ShotFC<CL04> = ({ f, c }) => {
  const T8 = c.c08 - c.c07;
  const W = 1640;
  const A = (
    <Pop f={f}>
      <Stage theme={CREST.theme} shotFrame={f} drift={DRIFT(7, 1.1, 0.04)} vignette={0.2} grain={0.5}>
        <Sky family={CREST} />
        <DriftBands f={f} color="#FFE066" opacity={0.35} speed={7} n={3} w={500} angle={-24} seed={87} />
        <Layer depth={1}>
          <FlatMap f={f} x={140} y={300} w={W} h={640} speed={20} />
          {DRY_MARKS.map(([u, v], i) => (
            <g key={i}>
              <Rings f={f + i * 7} x={140 + u * W} y={300 + v * 640} speed={18} max={140} n={2} color={MAP_FILL} width={6} />
              <Cross x={140 + u * W} y={300 + v * 640} s={14} />
            </g>
          ))}
          <rect x={140} y={150} width={W} height={60} rx={16} fill="#5A1206" />
          <rect x={140} y={150} width={W * lin(f, 4, 4 + W / 28)} height={60} rx={16} fill={C.belt} />
          <rect x={140} y={146} width={W * 0.008 /* under 1 % (#6) */} height={68} fill={C.heard} />
          <circle cx={146} cy={180} r={56 + 6 * Math.sin(f * 0.3)} fill="none" stroke={C.heard} strokeWidth={6} />
        </Layer>
        <Layer depth={0}>
          <rect x={1260} y={880} width={600} height={170} rx={30} fill="rgba(43,9,5,0.66)" />
          <Roll x={1300} y={1010} k={1} rkey="dry1" prefix="UNDER" unit="%" size={110} />
        </Layer>
      </Stage>
    </Pop>
  );
  const g = Math.max(0, f - T8);
  const B = (
    <Stage theme={SCOPE.theme} shotFrame={g} drift={DRIFT(8, 1.1, 0.04)} vignette={0.16} grain={0.5}>
      <Station f={f} desk={920} seed={88} />
      <Layer depth={1}>
        <rect x={80} y={490} width={1760} height={150} rx={26} fill="rgba(0,42,26,0.5)" />
        <TapeTrace f={f} x={100} y={565} w={1720} h={110} mode="wave" speed={24} />
        <TapeTicket x={860} y={470} word="HEARD" f={g} slam={lin(g, 2, 12)} size={1.1} />
        {g > 12 ? <Rings f={g - 12} x={860} y={540} speed={16} max={300} n={2} color={C.heard} width={8} squash={0.3} /> : null}
        {g > 10 ? (
          <g transform={`rotate(${18 * Math.sin(g * 0.33)} 860 540)`}>
            <line x1={860} y1={540} x2={860} y2={640} stroke={C.goldRim} strokeWidth={6} />
            <rect x={720} y={640} width={280} height={100} rx={24} fill={C.apricot} stroke={C.lever} strokeWidth={6} />
            <text x={860} y={706} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 44, letterSpacing: 5, fill: INK }}>
              UNUSUAL
            </text>
          </g>
        ) : null}
        <Tick x={1520} y={1050} pxPerM={220} frame={g} facing={-1} pose="cheer" expression="proud" />
      </Layer>
    </Stage>
  );
  return <Phase f={f} at={T8 - 6} dur={14} kind="slide" a={A} b={B} />;
};

// ================================================================================================================
// 4-09 · the next test: Juno above the limb, microwave rings rolling down onto the equator belt (20 px/f), Juno gliding, the
// belt's stripes sliding (18 px/f); the camera pulls back (#7: Juno MWR, the equatorial zone)
// ================================================================================================================
const ShotMicrowave: ShotFC<CL04> = ({ f }) => {
  const jx = 500 + f * 12;
  const jy = 170;
  const LT = 520;
  const R = 2400;
  return (
    <Pop f={f}>
      <Stage theme={LIMB.theme} shotFrame={f} drift={DRIFT(9, 0.93, 0.03)} vignette={0.3} grain={0.5}>
        <SpaceField f={f} speed={10} n={110} seed={89} />
        <Layer depth={1}>
          <Limb f={f} cx={960} cy={LT + R} R={R} shear={[18, -20, 16, -22, 20, -18]} seed={89} />
          <ClipCircle cx={960} cy={LT + R} r={R}>
            <rect x={-100} y={760} width={2120} height={90} fill={C.belt} />
            {Array.from({ length: 14 }, (_, i) => (
              <rect key={i} x={wrap(i * 170 + f * 18, 2380) - 230} y={776} width={110} height={18} rx={9} fill="#9FEFF8" opacity={0.6} />
            ))}
            <rect x={-100} y={756} width={2120} height={98} fill="#FFF0A0" opacity={0.12 + 0.08 * Math.sin(f * 0.25)} />
          </ClipCircle>
          <Rings f={f} x={jx} y={jy + 40} speed={20} max={640} n={4} color={C.starAqua} width={10} squash={0.9} />
          <Orbiter x={jx} y={jy} kind="juno" f={f} size={1} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 4-10 + 4-11 · the WATER chart: the bar grows to 2.7 × the SUN mark (30 px/f), bubbles keep rising in it (20 px/f), the
// counter rolls; 2.7 TIMES THE SUN (#7). Then the whiskers extend (40 px/f), much longer above (+2.4) than below (-1.7), the
// bar wobbles (6 px/f), Tick spreads his arms; WIDE ERROR BARS +2.4 / -1.7 (#7)
// ================================================================================================================
const ShotWaterChart: ShotFC<CL04> = ({ f, c }) => {
  const T11 = c.c11 - c.c10;
  const g = Math.max(0, f - T11);
  const U = 140; // px per one solar ratio (one scale for bar and whiskers)
  const base = 880;
  const val = 2.7 * U + (g > 0 ? 6 * Math.sin(g * 0.5) : 0);
  const bx = 900;
  const grow = lin(f, 4, 4 + (2.7 * U) / 30);
  return (
    <Pop f={f}>
      <Stage theme={SCOPE.theme} shotFrame={f} drift={DRIFT(10, 1.1, 0.04)} vignette={0.16} grain={0.5}>
        <Station f={f} desk={990} seed={90} />
        <Layer depth={1}>
          <rect x={320} y={90} width={1180} height={880} rx={36} fill={C.emeraldDeep} />
          <line x1={420} y1={base} x2={1420} y2={base} stroke={C.apricot} strokeWidth={6} />
          <line x1={420} y1={base - U} x2={1420} y2={base - U} stroke="#FFE066" strokeWidth={5} strokeDasharray="18 12" />
          <SunIcon x={470} y={base - U - 50} size={70} f={f} />
          <text x={520} y={base - U - 30} style={{ fontFamily: IF2.label, fontSize: 30, letterSpacing: 4, fill: "#FFE066" }}>
            {"SUN = 1"}
          </text>
          <text x={bx} y={base + 60} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 34, letterSpacing: 5, fill: C.apricot }}>
            WATER
          </text>
          <ErrorBar x={bx} y={base} f={f} value={val} grow={grow} whisk={g > 0 ? lin(g, 2, 2 + (2.4 * U) / 40) : 0} up={2.4 * U} down={1.7 * U} color={C.belt} width={160} />
          <ClipBox x={bx - 80} y={base - 2.7 * U * grow} w={160} h={2.7 * U * grow}>
            {Array.from({ length: 8 }, (_, i) => (
              <circle key={i} cx={bx - 50 + ((i * 37) % 100)} cy={base - wrap(f * 20 + i * 50, 400)} r={8 + (i % 3) * 3} fill="#9FEFF8" opacity={0.8} />
            ))}
          </ClipBox>
          {g > 0 ? <Tick x={1700} y={1050} pxPerM={210} frame={g} facing={-1} pose="cheer" expression="happy" /> : null}
        </Layer>
        <Layer depth={0}>
          {g <= 0 ? (
            <g>
              <Roll x={1040} y={400} k={lin(f, 4, 40)} rkey="water27" dec={1} suffix="TIMES THE SUN" size={130} />
            </g>
          ) : (
            <g>
              <Plate x={1060} y={250} text="WIDE ERROR BARS" size={36} appear={lin(g, 6, 14)} fill={C.heard} color={INK} />
              <Plate x={bx + 110} y={base - 2.7 * U - 2.4 * U * 0.5} text="+2.4 / -1.7" size={32} appear={lin(g, 14, 22)} />
            </g>
          )}
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 4-12 · the anomalous site: the flat map slides (18 px/f), the entry cross under a waving flag (8 deg/f), rings expanding
// from it (24 px/f); the camera pushes in; ANOMALOUS SITE (#7)
// ================================================================================================================
const ShotAnomalous: ShotFC<CL04> = ({ f }) => {
  const hx = 120 + 1680 * 0.55;
  const hy = 120 + 840 * 0.55;
  const wv = Math.sin(f * 0.3) * 22;
  return (
    <Pop f={f}>
      <Stage theme={CREST.theme} shotFrame={f} drift={DRIFT(11, 1.16, 0.03)} vignette={0.2} grain={0.5}>
        <Sky family={CREST} />
        <DriftBands f={f} color="#FFE066" opacity={0.35} speed={7} n={3} w={500} angle={-24} seed={91} />
        <Layer depth={1}>
          <FlatMap f={f} x={120} y={120} w={1680} h={840} speed={18} hole={0.6} holeAt={[0.55, 0.55]} />
          <Rings f={f} x={hx} y={hy} speed={24} max={420} n={3} color={MAP_FILL} width={10} squash={0.7} />
          <Cross x={hx} y={hy} s={26} />
          <line x1={hx} y1={hy} x2={hx} y2={hy - 300} stroke={C.goldRim} strokeWidth={8} />
          <path d={`M${hx} ${hy - 300} Q${hx + 110} ${hy - 300 + wv} ${hx + 230} ${hy - 280 + wv * 0.6} L${hx + 230} ${hy - 200 + wv * 0.6} Q${hx + 110} ${hy - 220 + wv} ${hx} ${hy - 210} Z`} fill={C.vermilion} />
        </Layer>
        <Layer depth={0}>
          <Plate x={hx + 250} y={hy - 250} text="ANOMALOUS SITE" size={36} appear={lin(f, 6, 16)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 4-13 · still unconfirmed: the equator belt lights, then a highlight sweeps the whole planet (30 px/f); "?" tags pop along
// it in turn (6 f stagger); the map slides; Tick shrugs; UNCONFIRMED (#7)
// ================================================================================================================
const Q_SPOTS: [number, number][] = [
  [0.15, 0.25],
  [0.35, 0.75],
  [0.55, 0.3],
  [0.7, 0.68],
  [0.85, 0.22],
  [0.45, 0.5],
];
const ShotUnconfirmed: ShotFC<CL04> = ({ f }) => (
  <Pop f={f}>
    <Stage theme={CREST.theme} shotFrame={f} drift={DRIFT(12, 0.95, 0.03)} vignette={0.2} grain={0.5}>
      <Sky family={CREST} />
      <DriftBands f={f} color="#FFE066" opacity={0.35} speed={7} n={3} w={500} angle={-24} seed={92} />
      <Layer depth={1}>
        <FlatMap f={f} x={110} y={110} w={1400} h={820} speed={18} equator={lin(f, 0, 20)} scan={wrap(f * 30, 1400) / 1400} />
        {Q_SPOTS.map(([u, v], i) => {
          const a = ez(f, 10 + i * 6, 18 + i * 6);
          return a > 0 ? (
            <g key={i} transform={`translate(${110 + u * 1400} ${110 + v * 820}) scale(${a}) translate(${-(110 + u * 1400)} ${-(110 + v * 820)})`}>
              <QuestionTag x={110 + u * 1400} y={110 + v * 820} f={f + i * 9} size={70} />
            </g>
          ) : null;
        })}
        <Tick x={1720} y={1050} pxPerM={200} frame={f} facing={-1} pose="shrug" expression="thinking" />
      </Layer>
      <Layer depth={0}>
        <WordPill x={120} y={1010} text="UNCONFIRMED" F={CREST} size={36} appear={lin(f, 8, 18)} />
      </Layer>
    </Stage>
  </Pop>
);

// ================================================================================================================
// 4-14 + 4-14b · Juno's range: a teal arc lights along the dial from 0.7 to 30 (head ≈ 4 deg/f) with the needle riding it to
// 30 and the rim lamps lighting in turn; 0.7 BAR, 30 BAR (#7). Then the probe's own arc draws inside it (from 1 bar, row 5,
// to its last reading at the 23 notch, row 2), a glow runs along it (30 px/f); DEEPER on Juno's 23-30 stretch (Q6)
// ================================================================================================================
const ShotArcs: ShotFC<CL04> = ({ f, c }) => {
  const T = c.c14b - c.c14;
  const g = Math.max(0, f - T);
  const cx = 960;
  const cy = 500;
  const r = 360;
  const ja = lin(f, 4, 66);
  const needle = Math.exp(Math.log(0.7) + (Math.log(30) - Math.log(0.7)) * ja);
  const pa = lin(g, 2, 54);
  const pt = (v: number, rr: number): [number, number] => [cx + Math.cos((dialAngle(v) * Math.PI) / 180) * rr, cy + Math.sin((dialAngle(v) * Math.PI) / 180) * rr];
  const a0 = dialAngle(1);
  const a1 = dialAngle(23);
  const gd = a0 + wrap((g * 30 * 180) / (Math.PI * r * 0.68), a1 - a0);
  const [s0x, s0y] = pt(0.7, r * 1.2);
  const [e0x, e0y] = pt(30, r * 1.2);
  const [dx, dy] = pt(26, r * 1.22);
  return (
    <Pop f={f}>
      <Stage theme={SCOPE.theme} shotFrame={f} drift={DRIFT(13, 1.1, 0.04)} vignette={0.16} grain={0.5}>
        <Station f={f} desk={980} seed={93} />
        <Layer depth={1}>
          <circle cx={cx} cy={cy} r={r * 1.28} fill={C.emeraldDeep} opacity={0.7} />
          <BarDial
            f={f}
            cx={cx}
            cy={cy}
            r={r}
            needle={needle}
            lit={ja * 12}
            sweep={16}
            arcs={[
              { from: 0.7, to: 30, draw: ja, color: C.belt, width: 0.1 },
              ...(g > 0 ? [{ from: 1, to: 23, draw: pa, color: C.heard, inset: 1.2, width: 0.06 }] : []),
            ]}
          />
          {pa >= 1 ? <circle cx={cx + Math.cos((gd * Math.PI) / 180) * r * 0.68} cy={cy + Math.sin((gd * Math.PI) / 180) * r * 0.68} r={16} fill={C.goldHot} /> : null}
        </Layer>
        <Layer depth={0}>
          <Plate x={s0x - 40} y={s0y + 30} text="0.7 BAR" size={32} align="end" appear={lin(f, 6, 14)} />
          <Plate x={e0x + 40} y={e0y + 30} text="30 BAR" size={32} appear={lin(f, 60, 68)} />
          <Plate x={140} y={150} text="JUNO" size={32} appear={lin(f, 6, 14)} fill={C.belt} color={INK} />
          {g > 0 ? <Plate x={140} y={230} text="PROBE" size={32} appear={lin(g, 2, 10)} fill={C.heard} color={INK} /> : null}
          {pa >= 1 ? <WordPill x={dx + 50} y={dy - 40} text="DEEPER" F={SCOPE} size={34} appear={lin(g, 54, 62)} /> : null}
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 4-15 · from orbit: Juno's scan lines sweep along the equatorial zone (32 px/f) under its beam, Juno glides (12 px/f), the
// belt's stripes slide (18 px/f); FROM ORBIT: THE EQUATORIAL ZONE (#7; one zone, not "many latitudes", Q5)
// 4-15b · one dive at one spot: a thin line drops to a single cross (40 px/f), the scans continue, the cross pulses; Tick
// points from the station window
// ================================================================================================================
const ZoneScan: React.FC<{ f: number; jx: number }> = ({ f, jx }) => {
  const LT = 300;
  const R = 2200;
  const sx = wrap(f * 32, 2000) - 40;
  return (
    <g>
      <Limb f={f} cx={960} cy={LT + R} R={R} shear={[18, -16, 20, -18, 16, -20]} seed={94} />
      <ClipCircle cx={960} cy={LT + R} r={R}>
        <rect x={-100} y={640} width={2120} height={130} fill={C.belt} />
        {Array.from({ length: 14 }, (_, i) => (
          <rect key={i} x={wrap(i * 170 - f * 18, 2380) - 230} y={690} width={120} height={20} rx={10} fill="#9FEFF8" opacity={0.6} />
        ))}
        <rect x={-100} y={636} width={2120} height={138} fill="#FFF0A0" opacity={0.18} />
        {[0, 1, 2].map((k) => (
          <rect key={k} x={wrap(sx + k * 90, 2000) - 40} y={630} width={14} height={150} fill={C.goldHot} opacity={1 - k * 0.3} />
        ))}
      </ClipCircle>
      <path d={`M${jx} 190 L${wrap(sx, 2000) - 70} 640 L${wrap(sx, 2000) + 10} 640 Z`} fill="#FFE066" opacity={0.18} />
      <Orbiter x={jx} y={160} kind="juno" f={f} size={0.9} />
    </g>
  );
};
const ShotScan: ShotFC<CL04> = ({ f }) => (
  <Pop f={f}>
    <Stage theme={LIMB.theme} shotFrame={f} drift={DRIFT(14, 1.1, 0.04)} vignette={0.3} grain={0.5}>
      <SpaceField f={f} speed={10} n={110} seed={94} />
      <Layer depth={1}>
        <ZoneScan f={f} jx={420 + f * 12} />
      </Layer>
      <Layer depth={0}>
        <Plate x={110} y={1000} text="FROM ORBIT: THE EQUATORIAL ZONE" size={34} appear={lin(f, 6, 16)} />
      </Layer>
    </Stage>
  </Pop>
);
const ShotOneDive: ShotFC<CL04> = ({ f }) => {
  const X = 1560;
  const Y = 860;
  const d = lin(f, 4, 4 + Y / 40);
  return (
    <Pop f={f}>
      <Stage theme={LIMB.theme} shotFrame={f} drift={DRIFT(15, 1.1, 0.04)} vignette={0.3} grain={0.5}>
        <SpaceField f={f} speed={10} n={110} seed={95} />
        <Layer depth={1}>
          <ZoneScan f={f + 90} jx={420 + (f + 90) * 12} />
          <line x1={X} y1={0} x2={X} y2={Y * d} stroke="#FFF0A0" strokeWidth={8} strokeDasharray="22 14" strokeDashoffset={-f * 10} />
          {d < 1 ? <circle cx={X} cy={Y * d} r={14} fill={C.goldHot} /> : null}
          {d >= 1 ? <Rings f={f} x={X} y={Y} speed={20} max={200} n={3} color={C.heard} width={8} squash={0.6} /> : null}
          {d >= 1 ? <Cross x={X} y={Y} s={24} /> : null}
          <rect x={60} y={700} width={420} height={340} rx={30} fill={C.emeraldDeep} />
          <ClipBox x={76} y={716} w={388} h={308} rx={20}>
            <Station f={f} desk={990} seed={96} />
            <Tick x={250} y={1010} pxPerM={150} frame={f} pose="point" expression="neutral" look={0.4} />
          </ClipBox>
          <rect x={76} y={716} width={388} height={308} rx={20} fill="none" stroke={C.goldRim} strokeWidth={6} />
        </Layer>
        <Layer depth={0}>
          <Plate x={1060} y={150} text="ONE DIVE, ONE SPOT" size={36} appear={lin(f, 8, 18)} fill={C.heard} color={INK} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 4-16 · real, and local: the HEARD ticket and the LOCAL tag slide together on the tape (28 px/f) and lock with a ring; the
// tape keeps running (24 px/f); Tick clasps his mitts
// ================================================================================================================
const ShotLocal: ShotFC<CL04> = ({ f }) => {
  const k = lin(f, 0, 22);
  const hx = lerp(240, 800, k);
  const lx = lerp(1700, 1130, k);
  return (
    <Pop f={f}>
      <Stage theme={SCOPE.theme} shotFrame={f} drift={DRIFT(16, 1.12, 0.04)} vignette={0.16} grain={0.5}>
        <Station f={f} desk={900} seed={97} />
        <Layer depth={1}>
          <rect x={80} y={480} width={1760} height={160} rx={26} fill="rgba(0,42,26,0.5)" />
          <TapeTrace f={f} x={100} y={560} w={1720} h={110} mode="wave" speed={24} />
          <TapeTicket x={hx} y={420} word="HEARD" f={f} size={1.05} />
          <g transform={`translate(${lx} 420)`}>
            <rect x={-150} y={-60} width={300} height={120} rx={26} fill={C.apricot} stroke={C.lever} strokeWidth={6} />
            <text x={0} y={22} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 56, letterSpacing: 6, fill: INK }}>
              LOCAL
            </text>
          </g>
          {k >= 1 ? <Rings f={f - 22} x={970} y={420} speed={20} max={260} n={2} color={C.heard} width={8} /> : null}
          <Tick x={1600} y={1050} pxPerM={210} frame={f} facing={-1} pose="hold" expression="proud" />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 4-17 · the first lesson: the LESSON 1 card flips up on the desk (12 deg/f), its underline draws (40 px/f) then a glint runs
// it, the tape keeps running along the desk (24 px/f); LESSON 1: ONE PROBE
// ================================================================================================================
const ShotLesson: ShotFC<CL04> = ({ f }) => {
  const flip = Math.min(90, f * 12);
  const sy = Math.sin((flip * Math.PI) / 180) * (1 + 0.03 * Math.sin(f * 0.3));
  const u = lin(f, 10, 10 + 600 / 40);
  return (
    <Pop f={f}>
      <Stage theme={SCOPE.theme} shotFrame={f} drift={DRIFT(17, 1.12, 0.04)} vignette={0.16} grain={0.5}>
        <Station f={f} desk={800} seed={98} />
        <Layer depth={1}>
          <g transform={`translate(0 800) scale(1 ${sy.toFixed(3)}) translate(0 -800)`}>
            <rect x={566} y={268} width={800} height={540} rx={30} fill="#002A1A" opacity={0.35} />
            <rect x={560} y={260} width={800} height={540} rx={30} fill={C.heard} />
            <rect x={560} y={260} width={800} height={90} rx={30} fill={C.lever} />
            <text x={960} y={520} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 130, letterSpacing: 10, fill: INK }}>
              LESSON 1
            </text>
            <rect x={660} y={570} width={600 * u} height={14} rx={7} fill={C.vermilion} />
            {u >= 1 ? <circle cx={660 + wrap(f * 40, 600)} cy={577} r={14} fill={C.goldHot} /> : null}
            <Capsule x={960} y={690} r={56} f={f} chips={6} />
          </g>
          <rect x={80} y={880} width={1760} height={140} rx={26} fill="rgba(0,42,26,0.5)" />
          <TapeTrace f={f} x={100} y={950} w={1720} h={100} mode="wave" speed={24} />
        </Layer>
        <Layer depth={0}>
          <KickerA x={140} y={160} text="LESSON 1: ONE PROBE" appear={lin(f, 4, 12)} size={32} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================

export const SceneL04: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL04(t);
  const shots: ShotDef<CL04>[] = [
    { from: 0, S: ShotSlap, id: "4-01" },
    { from: c.c02, S: ShotOptions, id: "4-02" },
    { from: c.c03, S: ShotReport, id: "4-03" }, // + 4-04
    { from: c.c05, S: ShotSahara, id: "4-05" },
    { from: c.c06, S: ShotWetRing, id: "4-06" },
    { from: c.c07, S: ShotSliver, id: "4-07" }, // + 4-08
    { from: c.c09, S: ShotMicrowave, id: "4-09" },
    { from: c.c10, S: ShotWaterChart, id: "4-10" }, // + 4-11
    { from: c.c12, S: ShotAnomalous, id: "4-12" },
    { from: c.c13, S: ShotUnconfirmed, id: "4-13" },
    { from: c.c14, S: ShotArcs, id: "4-14" }, // + 4-14b
    { from: c.c15, S: ShotScan, id: "4-15" },
    { from: c.c15b, S: ShotOneDive, id: "4-15b" },
    { from: c.c16, S: ShotLocal, id: "4-16" },
    { from: c.c17, S: ShotLesson, id: "4-17" },
  ];
  return <AbsoluteFill>{playShots(f, shots, c, t.frames)}</AbsoluteFill>;
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL04 = (t: SceneTiming): Cue[] => {
  const c = cuesL04(t);
  const run = (at: number, n: number, gap: number, vol = 0.08): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 8 }));
  return [
    { at: 9, file: SFX.pop, vol: 0.16, dur: 16 },
    ...cutHit(c.c02),
    { at: c.c02 + 4, file: SFX.click, vol: 0.12, dur: 10 },
    ...cutHit(c.c03),
    { at: c.c03 + 2, file: SFX.whoosh, vol: 0.18, dur: 50 },
    { at: c.c04 + 2, file: SFX.swirl, vol: 0.16, dur: 60 },
    ...cutHit(c.c05),
    { at: c.c05 + 6, file: SFX.pop, vol: 0.14, dur: 16 },
    ...cutHit(c.c06),
    { at: c.c06 + 2, file: SFX.swirl, vol: 0.16, dur: 60 },
    ...cutHit(c.c07),
    { at: c.c07 + 6, file: SFX.click, vol: 0.12, dur: 10 },
    { at: c.c08 + 4, file: SFX.click, vol: 0.12, dur: 10 },
    { at: c.c08 + 12, file: SFX.pop, vol: 0.15, dur: 16 },
    ...cutHit(c.c09),
    { at: c.c09 + 4, file: SFX.chime, vol: 0.16, dur: 60 },
    ...cutHit(c.c10),
    ...run(c.c10 + 4, 5, 6),
    { at: c.c11 + 4, file: SFX.click, vol: 0.12, dur: 10 },
    ...cutHit(c.c12),
    { at: c.c12 + 6, file: SFX.pop, vol: 0.14, dur: 16 },
    ...cutHit(c.c13),
    ...[0, 1, 2, 3, 4, 5].map((i): Cue => ({ at: c.c13 + 10 + i * 6, file: SFX.pop, vol: 0.08, dur: 12 })),
    ...cutHit(c.c14),
    { at: c.c14 + 4, file: SFX.chime, vol: 0.16, dur: 60 },
    { at: c.c14b + 4, file: SFX.click, vol: 0.12, dur: 10 },
    ...cutHit(c.c15),
    { at: c.c15 + 2, file: SFX.whoosh, vol: 0.16, dur: 50 },
    ...cutHit(c.c15b),
    { at: c.c15b + 20, file: SFX.click, vol: 0.12, dur: 10 },
    ...cutHit(c.c16),
    { at: c.c16 + 20, file: SFX.click, vol: 0.12, dur: 10 },
    { at: c.c16 + 24, file: SFX.pop, vol: 0.15, dur: 16 },
    ...cutHit(c.c17),
    { at: c.c17 + 6, file: SFX.chime, vol: 0.16, dur: 60 },
  ];
};
