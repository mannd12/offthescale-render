// `L16KitDemo`: the foundation check (BUILD.md §4.1, §5). Not part of the episode. 150 f:
//   0-74    sheet 1: the Sun body, the movers, the dials (light and dark), the stamps and pills
//   75-114  sheet 2: the props (probe variants, shield, board + sheet, planets, rocket, calendar, clock, oven/pot,
//           boxes, balance, detector, telescope, tape, water loop, panels)
//   115-149 the L16Card (heat rings behind the type)
// Check it with stills 15 frames apart (5, 20, 35, 50, 65 · 80, 95, 110 · 125, 140): every mover must visibly move.
// Every number shown is a sundata.ts READ value. USAGE: a reference for the package builders (read each panel's props).
import React from "react";
import { useCurrentFrame } from "remotion";
import { IF2, Sky, Stage, Stars, Tick } from "../../lib/illustrated";
import { L16_COLORS, STAR_TINTS, familyOf, sunGradient } from "./families";
import { READ } from "./sundata";
import { RadiiRuler } from "./ruler";
import { ConvCells, Granules, Neutrinos, Photon, WindStreaks } from "./movers16";
import { Alfven, CoronaHalo, SunCutaway, SunLimb } from "./sunbody";
import { EnergyDial, L16Dials, distanceValue } from "./L16Dials";
import { AboutPill, Board, OurSumPill, SayPill, Sheet, SourceChip, StateStamp } from "./stamps";
import {
  Balance,
  Calendar,
  Chips,
  Clock,
  Cube,
  Detector,
  EarthRow,
  GlassBox,
  HandIcon,
  Orbit,
  Oven,
  Panels,
  Planet,
  PlanetsCircling,
  Pot,
  Probe,
  Rocket,
  Shield,
  Telescope,
  Tape,
  Trace,
  WaterLoop,
} from "./props16";
import { L16Card } from "./L16Card";

export const L16_KIT_DEMO_FRAMES = 150;
const SHEET2 = 75;
const CARD_AT = 115;
const C = L16_COLORS;
const cl = (v: number) => Math.max(0, Math.min(1, v));
const PW = 480;
const PH = 540;

const Panel: React.FC<{ id: string; x: number; y: number; bg: React.ReactNode; label: string; children: React.ReactNode }> = ({ id, x, y, bg, label, children }) => (
  <g>
    <defs>
      <clipPath id={id}>
        <rect x={x} y={y} width={PW} height={PH} />
      </clipPath>
    </defs>
    <g clipPath={`url(#${id})`}>
      {bg}
      {children}
    </g>
    <rect x={x} y={y} width={PW} height={PH} fill="none" stroke="#000" strokeWidth={3} />
    <rect x={x + 6} y={y + 6} width={label.length * 9.4 + 16} height={26} rx={6} fill="rgba(0,0,0,0.55)" />
    <text x={x + 14} y={y + 25} style={{ fontFamily: IF2.label, fontSize: 16, letterSpacing: 1.4, fill: "#FFF4E0" }}>
      {label}
    </text>
  </g>
);
const bgOf = (name: Parameters<typeof familyOf>[0], x: number, y: number) => <Sky family={familyOf(name)} x={x} y={y} w={PW} h={PH} />;

const Sheet1: React.FC<{ f: number }> = ({ f }) => {
  const space = familyOf("space");
  const studio = familyOf("studio");
  return (
    <g>
      {/* 1 · space: limb + halo + wind fan + ruler scrolling 14 px/f + probe with trail */}
      <Panel id="k1" x={0} y={0} bg={bgOf("space", 0, 0)} label="1 space · SunLimb · CoronaHalo · WindStreaks · RadiiRuler · Probe">
        <Stars frame={f} n={40} x={0} y={0} w={PW} h={PH} color={STAR_TINTS[1]} />
        <CoronaHalo f={f} cx={-300} cy={900} R={700} extent={320} loops={3} a0={-80} a1={-20} />
        <SunLimb f={f} cx={-300} cy={900} R={700} granSize={60} />
        <WindStreaks f={f} cx={-300} cy={900} r0={720} rMax={1500} a0={-85} a1={-5} speed={20} count={50} />
        <RadiiRuler f={f} y={110} pxPerR={40} origin={-500} speed={14} scaleBreak={20} />
        <Probe x={330} y={300} size={110} f={f} trail={120} tilt={20} />
      </Panel>
      {/* 2 · corona: the Alfvén boundary drawing on, spikes growing, a crossing flash; the ghost probe */}
      <Panel id="k2" x={PW} y={0} bg={bgOf("corona", PW, 0)} label="2 corona · Alfven draw/spikes/cross · Probe ghost">
        <CoronaHalo f={f} cx={PW + 240} cy={1040} R={520} extent={420} loops={4} a0={-130} a1={-50} />
        <Alfven f={f} cx={PW + 240} cy={1040} R={850} a0={-125} a1={-55} draw={cl(f / 30)} spikes={cl((f - 30) / 30)} cross={{ angle: -90, age: f - 45 }} />
        <Probe x={PW + 60 + f * 5} y={150} size={90} f={f} variant="ghost" tilt={60} />
      </Panel>
      {/* 3 · cells: whole-frame convection, scrolling up 24 px/f (a descent), granule band on top */}
      <Panel id="k3" x={PW * 2} y={0} bg={bgOf("cells", PW * 2, 0)} label="3 cells · ConvCells scroll 24 · Granules">
        <ConvCells f={f} x={PW * 2} y={0} w={PW} h={PH} cell={200} scroll={24} />
        <Granules f={f} x={PW * 2} y={40} w={PW} h={90} size={50} />
      </Panel>
      {/* 4 · dense: the photon's random walk, head 28 px/f, atoms flashing */}
      <Panel id="k4" x={PW * 3} y={0} bg={bgOf("dense", PW * 3, 0)} label="4 dense · Photon zigzag + atoms">
        <Photon f={f} x0={PW * 3 + 30} y0={500} x1={PW * 3 + 450} y1={70} speed={28} step={64} seed={3} />
      </Panel>
      {/* 5 · core: quarter cutaway (true proportions), radius drawing, core pulsing, neutrinos streaming */}
      <Panel id="k5" x={0} y={PH} bg={bgOf("core", 0, PH)} label="5 core · SunCutaway quarter · radius · Neutrinos">
        <SunCutaway f={f} cx={200} cy={PH + 330} r={190} variant="quarter" highlight="core" radius={{ angle: -45, draw: cl(f / 50) }} />
        <Neutrinos f={f} cx={200} cy={PH + 330} count={40} />
      </Panel>
      {/* 6 · studio: full cutaway with labels, convective highlight; the three stamps: slam, flip, ghost → slam; Tick */}
      <Panel id="k6" x={PW} y={PH} bg={bgOf("studio", PW, PH)} label="6 studio · SunCutaway full · StateStamp ×3 · Tick">
        <SunCutaway f={f} cx={PW + 170} cy={PH + 210} r={150} highlight="convective" labels />
        <StateStamp x={PW + 390} y={PH + 100} state="measured" age={f - 10} size={120} />
        <StateStamp x={PW + 390} y={PH + 260} state="afar" flip={{ from: "measured", age: f - 30 }} size={120} />
        <StateStamp x={PW + 390} y={PH + 420} state="model" ghost={f < 55} age={f < 55 ? undefined : f - 55} f={f} size={120} />
        <Tick x={PW + 150} y={PH + 525} pxPerM={40} frame={f} pose="press" expression="proud" staff />
      </Panel>
      {/* 7 · dials, light plates on space: DISTANCE sweeping in, HEAT to the stop (rattles), ENERGY swinging */}
      <Panel id="k7" x={PW * 2} y={PH} bg={bgOf("space", PW * 2, PH)} label="7 L16Dials light · HEAT pinned · EnergyDial">
        <L16Dials f={f} family={space} x={PW * 2 + 1} y={PH + 40} distance={{ value: distanceValue(Math.max(8.86, 60 - f * 0.9)) }} heat={{ value: cl(f / 50), pinned: f > 55, readout: f > 55 ? READ.coronaC.text : null }} />
        <EnergyDial x={PW * 2 + 140} y={PH + 330} f={f} family={space} scale={0.66} s={{ value: cl((f - 10) / 45), pinned: f > 56 }} />
      </Panel>
      {/* 8 · dials, dark plates on the studio + the honesty pills */}
      <Panel id="k8" x={PW * 3} y={PH} bg={bgOf("studio", PW * 3, PH)} label="8 L16Dials dark · pills">
        <L16Dials f={f} family={studio} theme="dark" x={PW * 3 + 1} y={PH + 40} distance={{ value: distanceValue(8.86), readout: READ.about9short.text, ghost: distanceValue(18.8) }} heat={{ value: 0.86 + Math.sin(f / 9) * 0.05, readout: READ.shieldC.text }} />
        <OurSumPill x={PW * 3 + 20} y={PH + 380} appear={cl(f / 10)} />
        <AboutPill x={PW * 3 + 200} y={PH + 380} appear={cl((f - 8) / 10)} />
        <SayPill x={PW * 3 + 320} y={PH + 380} kind="EXPECTED" appear={cl((f - 16) / 10)} />
        <SayPill x={PW * 3 + 20} y={PH + 440} kind="NASA SAYS" appear={cl((f - 24) / 10)} />
        <SourceChip x={PW * 3 + 220} y={PH + 440} text="NASA SEP 2025" appear={cl((f - 32) / 10)} />
        <SayPill x={PW * 3 + 20} y={PH + 500} kind="NASA SAYS CAN REACH" appear={cl((f - 40) / 10)} />
      </Panel>
    </g>
  );
};

const Sheet2: React.FC<{ f: number }> = ({ f }) => {
  const g = f - SHEET2; // 0..39
  return (
    <g>
      {/* 1 · shade: probe cutaway (pocket + green instrument glow), the probe turning, the shield exploding + warming */}
      <Panel id="m1" x={0} y={0} bg={bgOf("shade", 0, 0)} label="1 shade · Probe cutaway · turn · Shield">
        <Probe x={250} y={160} size={200} f={f} variant="cutaway" />
        <Probe x={120} y={420} size={130} f={f} turn={cl(g / 30)} />
        <Shield x={360} y={400} size={150} f={f} explode={cl((g - 4) / 25)} heat={cl((g - 18) / 18)} />
      </Panel>
      {/* 2 · studio: the evidence board, its path solid then dashed, a sheet sliding up with a stamp slam, a trace */}
      <Panel id="m2" x={PW} y={0} bg={bgOf("studio", PW, 0)} label="2 studio · Board · Sheet + stamp · Trace">
        <Board x={PW + 24} y={50} w={432} h={450} f={f} path={{ pts: [[40, 410], [130, 340], [220, 300], [310, 250], [400, 180]], solidTo: 0.55, draw: cl(g / 30) }}>
          <Sheet x={40} y={40} w={240} h={220} f={f} title="flight path" appear={cl(g / 12)} stamp={{ state: "measured", age: g - 16 }} />
          <Trace pts={Array.from({ length: 20 }, (_, i) => [300 + i * 6, 120 - Math.sin((i / 19) * 2.6) * 70] as [number, number])} head={cl(g / 30)} f={f} />
        </Board>
      </Panel>
      {/* 3 · space: planets circling with trails, Earth's orbit shrinking, Venus close-up, chips streaming */}
      <Panel id="m3" x={PW * 2} y={0} bg={bgOf("space", PW * 2, 0)} label="3 space · PlanetsCircling · Orbit shrink · Chips">
        <defs>
          <radialGradient id="kdsun">
            {sunGradient(30).map(([o, c], i) => (
              <stop key={i} offset={o} stopColor={c} />
            ))}
          </radialGradient>
        </defs>
        <circle cx={PW * 2 + 240} cy={250} r={30} fill="url(#kdsun)" />
        <Orbit cx={PW * 2 + 240} cy={250} rx={170} f={f} shrink={cl(g / 30)} color={C.gold} dashed />
        <PlanetsCircling cx={PW * 2 + 240} cy={250} f={f} planets={[{ kind: "mercury", a: 60, r: 7, speed: 4 }, { kind: "venus", a: 110, r: 11, speed: 3, phase: 90 }, { kind: "earth", a: 170, r: 12, speed: 2, phase: 200 }, { kind: "mars", a: 215, r: 9, speed: 1.4, phase: 30 }]} />
        <Planet x={PW * 2 + 400} y={90} r={50} f={f} kind="venus" light={200} />
        <Chips x0={PW * 2 + 40} y0={500} x1={PW * 2 + 400} y1={470} f={f} />
      </Panel>
      {/* 4 · studio: our three-core rocket rising with its tag, the calendar flipping, the five-hour clock wedge */}
      <Panel id="m4" x={PW * 3} y={0} bg={bgOf("studio", PW * 3, 0)} label="4 studio · Rocket · Calendar · Clock">
        <Rocket x={PW * 3 + 110} y={500} size={300} f={f} lift={Math.min(200, Math.max(0, g - 8) * 10)} plume={cl((g - 4) / 8)} tag="Delta IV Heavy" />
        <Calendar x={PW * 3 + 290} y={90} w={160} f={f} text={READ.dropDays.text} />
        <Clock x={PW * 3 + 370} y={410} r={80} f={f} hours={READ.belowHours.value! * cl(g / 35)} />
      </Panel>
      {/* 5 · studio: oven and pot cutaways, two inert outline hands */}
      <Panel id="m5" x={0} y={PH} bg={bgOf("studio", 0, PH)} label="5 studio · Oven · Pot · HandIcon">
        <Oven x={20} y={PH + 70} w={210} f={f} />
        <Pot x={250} y={PH + 70} w={210} f={f} />
        <HandIcon x={125} y={PH + 400} size={90} />
        <HandIcon x={355} y={PH + 400} size={90} flip />
      </Panel>
      {/* 6 · studio: dense vs lone-dot boxes, the one-cubic-centimetre cube, the balance tipping */}
      <Panel id="m6" x={PW} y={PH} bg={bgOf("studio", PW, PH)} label="6 studio · GlassBox ×2 · Cube · Balance">
        <GlassBox x={PW + 20} y={PH + 50} w={200} h={150} f={f} n={40} speed={14} />
        <GlassBox x={PW + 250} y={PH + 50} w={200} h={150} f={f} n={1} speed={24} dot={9} color={C.gold} />
        <Cube x={PW + 60} y={PH + 270} size={110} f={f} label="one cubic centimetre" />
        <Balance
          x={PW + 350}
          y={PH + 290}
          w={200}
          f={f}
          tilt={Math.sin(f / 8)}
          left={<rect x={-22} y={-40} width={44} height={40} fill={C.gold} stroke={C.ink} strokeWidth={2} />}
          right={<rect x={-22} y={-40} width={44} height={40} fill={C.teal} stroke={C.ink} strokeWidth={2} />}
        />
      </Panel>
      {/* 7 · space: the detector flashing, neutrinos through it, the telescope with its granule eyepiece, Earth row */}
      <Panel id="m7" x={PW * 2} y={PH} bg={bgOf("space", PW * 2, PH)} label="7 space · Detector · Telescope · EarthRow">
        <Neutrinos f={f} cx={PW * 2 - 60} cy={PH + 220} count={30} r0={60} />
        <Detector x={PW * 2 + 150} y={PH + 220} r={120} f={f} flash={1 - (g % 30) / 12} />
        <Telescope x={PW * 2 + 360} y={PH + 400} size={140} f={f} inset={{ x: PW * 2 + 380, y: PH + 140, r: 70 }} />
        <EarthRow x={PW * 2 + 20} y={PH + 500} n={22} r={8} gap={3} f={f} appear={cl(g / 30)} />
      </Panel>
      {/* 8 · studio: the tape unrolling to 42.1 km/s with its gold head start sliding off, the water loop, the wings folding */}
      <Panel id="m8" x={PW * 3} y={PH} bg={bgOf("studio", PW * 3, PH)} label="8 studio · Tape · WaterLoop · Panels · Tick">
        <Tape x={PW * 3 + 50} y={PH + 90} len={190} f={f} unroll={cl(g / 18)} gold={29.8 / 42.1} slide={cl((g - 26) / 10)} label={READ.escape.text} />
        <WaterLoop x={PW * 3 + 40} y={PH + 220} w={250} h={170} f={f} />
        <Panels x={PW * 3 + 390} y={PH + 300} size={150} f={f} fold={cl((g - 10) / 25)} />
        <Tick x={PW * 3 + 160} y={PH + 530} pxPerM={40} frame={f} pose="point" expression="happy" staff />
      </Panel>
    </g>
  );
};

export const L16KitDemo: React.FC = () => {
  const f = useCurrentFrame();
  if (f >= CARD_AT) {
    const cf = f - CARD_AT;
    return <L16Card family={familyOf("corona")} kicker="Off the Scale · Into the Sun" title="What If You Flew Into the Sun?" t={0.3 + (cf / 35) * 0.4} frame={cf} />;
  }
  return (
    <Stage theme={familyOf("space").theme} drift={false} grain={0} vignette={0}>
      {f < SHEET2 ? <Sheet1 f={f} /> : <Sheet2 f={f} />}
    </Stage>
  );
};
