// `L18MoonLowOrbit-kit-demo`: the foundation check (BUILD.md §4.1, §5). Not part of the episode. 150 f, two sheets of eight
// 480×540 panels, each on its own family:
//   0-74    sheet 1: the distance rail (log ticks streaming, token sliding, lamps, lines, band), the sky bowl (pointer, wedge
//           fill, cloud band, numerals, coin Moon), the huge sky Moon (scroll 22 px/f, grid, terminator), the orbit rings
//           (two speeds, Roche circle, NOT TO SCALE), the day clock + lap chip + pull bar + StopBadge, the tidal ball (egg,
//           near/far arrows, NEAR/FAR) + the arrow stack, the cracked / fluid / patch balls + Fracture, the debris ring + beads
//   75-149  sheet 2: the board with sheets, the placards (swing, flip, rattle) + "?", the pills and chips, the comet + banded
//           giant + beads, the ringed planet + station + weather sat + streaks, DotFlow (line, fall, infall, fill) +
//           SweepFront, the Earth limb + trail + laser dots, the icons + the chroma table
// Check it with stills 15 frames apart (20, 35, 50 · 95, 110, 125): every mover must visibly move between them.
// Every number shown on a piece is a data18.ts READ value (the chroma table is a check readout, not episode content).
import React from "react";
import { useCurrentFrame } from "remotion";
import { IF2, Sky, Stage, Tick, chromaOf } from "../../lib/illustrated";
import { L18_COLORS, chromaTable, familyOf, type L18FamilyName } from "./families";
import { READ } from "./data18";
import { DistGauge, MoonToken, StopBadge } from "./gauge";
import { MoonFace, SkyBowl } from "./sky";
import { DayClock, LapChip, OrbitRings } from "./orbit";
import { Beads, DebrisRing, Fracture, PullArrows, PullBar, TidalBall, fractureDraw } from "./tidal";
import { AboutPill, AgencyPill, Board18, FlipTag, OurSumPill, QuestionTag, ReasoningPill, Sheet18, SourceChip, WordPill } from "./tags18";
import { BandedGiant, Comet, EarthDisc, EarthLimb, RingedPlanet, StationToken, WeatherSat } from "./planets18";
import { DotFlow, StarsTint18, Streaks, SweepFront, Trail, trailOf } from "./movers18";
import { Clipboard, LaserDots, Magnifier, PeaIcon, RockChip, Tape } from "./icons18";

export const L18_KIT_DEMO_FRAMES = 150;
const SHEET2 = 75;
const C = L18_COLORS;
const cl = (v: number) => Math.max(0, Math.min(1, v));
const fr = (v: number) => v - Math.floor(v);
const PW = 480;
const PH = 540;

const Panel: React.FC<{ id: string; x: number; y: number; fam: L18FamilyName; label: string; children: React.ReactNode }> = ({ id, x, y, fam, label, children }) => (
  <g>
    <defs>
      <clipPath id={id}>
        <rect x={x} y={y} width={PW} height={PH} />
      </clipPath>
    </defs>
    <g clipPath={`url(#${id})`}>
      <Sky family={familyOf(fam)} x={x} y={y} w={PW} h={PH} />
      {children}
    </g>
    <rect x={x} y={y} width={PW} height={PH} fill="none" stroke="#000" strokeWidth={3} />
    <rect x={x + 6} y={y + PH - 32} width={label.length * 8.6 + 16} height={26} rx={6} fill="rgba(0,0,0,0.6)" />
    <text x={x + 14} y={y + PH - 13} style={{ fontFamily: IF2.label, fontSize: 15, letterSpacing: 1.2, fill: "#FFEFC8" }}>
      {label}
    </text>
  </g>
);

const Sheet1: React.FC<{ f: number }> = ({ f }) => {
  const abyss = familyOf("abyss");
  const bowl = familyOf("bowl");
  const gauge = familyOf("gauge");
  return (
    <g>
      {/* 1 · abyss: the rail. The camera km drifts (ticks stream), the token slides down, lamps, lines draw, band crawls */}
      <Panel id="k1" x={0} y={0} fam="abyss" label="1 abyss · DistGauge camera+token+lines+band">
        <StarsTint18 f={f} x={0} y={0} w={PW} h={PH} n={40} speed={12} />
        <DistGauge
          f={f}
          family={abyss}
          x={150}
          top={10}
          bottom={500}
          cy={260}
          decade={150}
          center={Math.pow(10, 3.9 + 0.5 * Math.sin(f / 14))}
          draw={cl(f / 30)}
          speed={14}
          token={384400 / Math.pow(10, fr(f / 70) * 2.9)}
          tokenR={20}
          lit={["geo", "stiff"]}
          lines={["stiff", "fluid"]}
          lineDraw={cl(f / 40)}
          lineFrom={20}
          band={["stiff", "fluid"]}
          scale={0.8}
        />
        <Tick x={60} y={500} pxPerM={46} frame={f} pose="hold" expression="thinking" />
      </Panel>
      {/* 2 · bowl: the half-circle sky, pointer 3 deg/f, wedge fill, cloud band 14 px/f, numerals, the coin Moon, Tick + pea */}
      <Panel id="k2" x={PW} y={0} fam="bowl" label="2 bowl · SkyBowl pointer+wedge+clouds · pea">
        <SkyBowl f={f} family={bowl} cx={PW + 240} horizon={430} R={190} pointer={(f * 3) % 180} wedge={[51, 129]} wedgeFill={fr(f / 40)} clouds={14} numerals />
        <MoonToken x={PW + 240 + Math.sin(f / 10) * 30} y={110} r={9} f={f} />
        <Tick x={PW + 90} y={430} pxPerM={44} frame={f} pose="point" expression="happy" />
        <PeaIcon x={PW + 128} y={344} size={14} />
      </Panel>
      {/* 3 · bowl: the huge sky Moon, craters + grid scrolling 22 px/f, terminator sweeping; tiny Tick on the horizon */}
      <Panel id="k3" x={PW * 2} y={0} fam="bowl" label="3 bowl · MoonFace r560 scroll 22 · grid · terminator">
        <MoonFace f={f} x={PW * 2 + 240} y={-280} radius={560} scroll={22} grid terminator={-0.7 + fr(f / 80) * 1.4} />
        <rect x={PW * 2} y={460} width={PW} height={80} fill={bowl.near} />
        <rect x={PW * 2} y={458} width={PW} height={4} fill={bowl.light} />
        <Tick x={PW * 2 + 260} y={462} pxPerM={30} frame={f} pose="stand" expression="surprised" look={0.6} />
      </Panel>
      {/* 4 · abyss: two orbits at very different speeds (0.6 vs 6 deg/f), the Roche circle, NOT TO SCALE */}
      <Panel id="k4" x={PW * 3} y={0} fam="abyss" label="4 abyss · OrbitRings 0.6 / 6 deg/f · Roche">
        <StarsTint18 f={f} x={PW * 3} y={0} w={PW} h={PH} n={40} speed={12} seed={2} />
        <OrbitRings
          f={f}
          cx={PW * 3 + 240}
          cy={240}
          earthR={40}
          rings={[
            { r: 200, speed: 0.6, token: "moon", tilt: 0.55, size: 18 },
            { r: 76, speed: 6, token: "station", tilt: 0.55, size: 30, trail: 90 },
          ]}
          roche={120}
          notToScale
        />
      </Panel>
      {/* 5 · gauge: day clock (hand + lap pips), lap chip filling, pull bar ×760 growing, the StopBadge */}
      <Panel id="k5" x={0} y={PH} fam="gauge" label="5 gauge · DayClock · LapChip · PullBar · StopBadge">
        <StopBadge f={f} rung={1} family={gauge} x={40} y={PH + 70} />
        <DayClock x={120} y={PH + 230} r={78} f={f} progress={f / 74} laps={11} family={gauge} label={READ.earth24.text} />
        <LapChip x={20} y={PH + 440} w={230} progress={fr(f / 50)} f={f} pips={5} />
        <PullBar x={330} y={PH + 480} h={260} t={cl(f / 45)} f={f} readKey="pull760" w={90} />
      </Panel>
      {/* 6 · tangerine: the tidal ball stretching (egg), near / far arrows (2.29), NEAR / FAR, the far-arrow stack */}
      <Panel id="k6" x={PW} y={PH} fam="tangerine" label="6 tangerine · TidalBall egg · PullArrows stack">
        <TidalBall x={PW + 280} y={PH + 170} r={80} f={f} stretch={0.5 + 0.5 * Math.sin(f / 12)} near={110} far={48} tags spin={3} />
        <PullArrows x={PW + 450} y={PH + 360} near={240} far={105} f={f} stack={fr(f / 50)} width={14} />
      </Panel>
      {/* 7 · tangerine: cracking + separating rock ball, fluid ball with self-pull arrows, a lifting patch, Fracture */}
      <Panel id="k7" x={PW * 2} y={PH} fam="tangerine" label="7 tangerine · crack/separate · fluid · patch · Fracture">
        <TidalBall x={PW * 2 + 120} y={PH + 140} r={66} f={f} crack={cl(f / 30)} separate={Math.max(0, f - 30) * 0.9} />
        <TidalBall x={PW * 2 + 360} y={PH + 140} r={58} f={f} material="fluid" stretch={0.3} selfPull />
        <TidalBall x={PW * 2 + 330} y={PH + 360} r={50} f={f} patch={fr(f / 40)} near={60} />
        <Fracture x={PW * 2 + 30} y={PH + 450} length={260} draw={fractureDraw(f, 0, 260, 8)} separate={Math.max(0, f - 32) * 0.4} />
      </Panel>
      {/* 8 · abyss: the debris ring spreading from a clump around the Earth (back / Earth / front), clusters; beads */}
      <Panel id="k8" x={PW * 3} y={PH} fam="abyss" label="8 abyss · DebrisRing spread+clump · Beads">
        <StarsTint18 f={f} x={PW * 3} y={PH} w={PW} h={PH} n={40} speed={12} seed={5} />
        <DebrisRing cx={PW * 3 + 240} cy={PH + 220} f={f} radius={170} spread={cl(f / 60)} clump={0.5 + 0.5 * Math.sin(f / 15)} part="back" />
        <EarthDisc x={PW * 3 + 240} y={PH + 220} r={62} f={f} />
        <DebrisRing cx={PW * 3 + 240} cy={PH + 220} f={f} radius={170} spread={cl(f / 60)} clump={0.5 + 0.5 * Math.sin(f / 15)} part="front" />
        <Beads x={PW * 3 + 30} y={PH + 420} f={f} stretch={fr(f / 60)} length={400} n={21} size={8} />
      </Panel>
    </g>
  );
};

const Sheet2: React.FC<{ f: number }> = ({ f }) => {
  const g = f - SHEET2; // 0..74
  const gauge = familyOf("gauge");
  const tbl = chromaTable();
  return (
    <g>
      {/* 1 · board: the evidence board, placards dropping in, a lemon and a sky sheet sliding up with pins slamming */}
      <Panel id="m1" x={0} y={0} fam="board" label="1 board · Board18 · Sheet18 lemon / sky">
        <Board18 x={20} y={24} w={440} h={470} f={f} header={cl(g / 15)}>
          <Sheet18 x={28} y={150} w={180} h={220} f={f} title="SIZE" band="lemon" appear={cl(g / 10)} pin={cl((g - 6) / 6)} sway={2}>
            <SourceChip x={14} y={20} name="NASA" />
            <MoonToken x={90} y={110} r={30} f={f} />
          </Sheet18>
          <Sheet18 x={232} y={150} w={180} h={220} f={f} title="THE RING" band="sky" appear={cl((g - 10) / 10)} pin={cl((g - 16) / 6)} sway={-2}>
            <DebrisRing cx={90} cy={80} f={f} radius={60} spread={1} tilt={0.35} thickness={8} n={40} />
          </Sheet18>
        </Board18>
      </Panel>
      {/* 2 · abyss: the placards swinging (6 deg/f), MODEL flipping back and forth, NOT POSSIBLE rattling, the "?" */}
      <Panel id="m2" x={PW} y={0} fam="abyss" label="2 abyss · FlipTag swing/flip/rattle · ?">
        <FlipTag x={PW + 130} y={30} word="MEASURED" f={f} size={0.62} />
        <FlipTag x={PW + 350} y={30} word="MODEL" prev="MEASURED" f={f + 7} flip={0.5 - 0.5 * Math.cos(g * 0.157)} size={0.62} />
        <FlipTag x={PW + 240} y={240} word="NOT POSSIBLE" f={f} swing={6} rattle={cl(1 - (g % 30) / 12)} size={0.8} />
        <QuestionTag x={PW + 420} y={460} f={f} size={56} />
      </Panel>
      {/* 3 · gauge: every pill and chip */}
      <Panel id="m3" x={PW * 2} y={0} fam="gauge" label="3 gauge · pills · chips">
        <OurSumPill x={PW * 2 + 24} y={60} appear={cl(g / 8)} />
        <ReasoningPill x={PW * 2 + 190} y={60} appear={cl((g - 4) / 8)} />
        <AboutPill x={PW * 2 + 24} y={130} appear={cl((g - 8) / 8)} />
        <AgencyPill x={PW * 2 + 150} y={130} agency="NASA SAYS" appear={cl((g - 12) / 8)} />
        <AgencyPill x={PW * 2 + 24} y={200} agency="NOAA SAYS" appear={cl((g - 16) / 8)} />
        <AgencyPill x={PW * 2 + 210} y={200} agency="TEXTBOOK SAYS" appear={cl((g - 20) / 8)} />
        <WordPill x={PW * 2 + 24} y={270} text="STIFF" F={gauge} dot={C.lever} appear={cl((g - 24) / 8)} />
        <WordPill x={PW * 2 + 150} y={270} text="FLUID" F={gauge} dot={C.model} appear={cl((g - 28) / 8)} />
        <WordPill x={PW * 2 + 290} y={270} text="IGNORED" F={gauge} appear={cl((g - 32) / 8)} />
        <WordPill x={PW * 2 + 24} y={340} text={READ.stiffKm.text} F={gauge} appear={cl((g - 36) / 8)} />
        <OurSumPill x={PW * 2 + 250} y={340} appear={cl((g - 36) / 8)} />
        <SourceChip x={PW * 2 + 24} y={390} name="NASA FACT SHEET" appear={cl((g - 40) / 8)} />
        <SourceChip x={PW * 2 + 300} y={390} name="NOAA" appear={cl((g - 44) / 8)} />
      </Panel>
      {/* 4 · abyss: the banded giant (bands 14 px/f), the comet travelling, beads stretching out of a smear */}
      <Panel id="m4" x={PW * 3} y={0} fam="abyss" label="4 abyss · BandedGiant · Comet · Beads">
        <StarsTint18 f={f} x={PW * 3} y={0} w={PW} h={PH} n={36} speed={12} seed={7} />
        <BandedGiant x={PW * 3 + 320} y={300} r={140} f={f} />
        <Comet x={PW * 3 + 90 + g * 2.4} y={90 + g * 1.2} angle={205} len={170} f={f} size={9} />
        <Beads x={PW * 3 + 30} y={470} f={f} stretch={cl(g / 50)} length={330} angle={-6} n={21} size={7} />
      </Panel>
      {/* 5 · abyss: the ringed planet (particles orbit), the station with streaks, the weather sat */}
      <Panel id="m5" x={0} y={PH} fam="abyss" label="5 abyss · RingedPlanet · StationToken · Streaks · WeatherSat">
        <StarsTint18 f={f} x={0} y={PH} w={PW} h={PH} n={36} speed={12} seed={9} />
        <RingedPlanet x={230} y={PH + 190} r={64} f={f} />
        <Streaks x={300} y={PH + 410} f={f} angle={0} len={60} spread={22} />
        <StationToken x={300} y={PH + 410} size={70} f={f} />
        <WeatherSat x={100} y={PH + 420 + Math.sin(f / 8) * 14} size={56} f={f} />
      </Panel>
      {/* 6 · tangerine: DotFlow line / fall / infall / fill and a SweepFront */}
      <Panel id="m6" x={PW} y={PH} fam="tangerine" label="6 tangerine · DotFlow x4 · SweepFront">
        <DotFlow f={f} mode="line" from={[PW + 20, PH + 50]} to={[PW + 460, PH + 50]} n={30} speed={18} spread={12} color={C.teal} />
        <DotFlow f={f} mode="fall" from={[PW + 30, PH + 90]} w={170} h={200} n={30} accel={0.5} colors={[C.moonLit, C.moonShade]} />
        <DotFlow f={f} mode="infall" from={[PW + 350, PH + 200]} spread={100} n={36} speed={6} color={C.moonCrater} />
        <circle cx={PW + 350} cy={PH + 200} r={26} fill={C.moonMid} stroke={C.moonRim} strokeWidth={3} />
        <rect x={PW + 30} y={PH + 340} width={170} height={150} fill="none" stroke={C.ink} strokeWidth={4} />
        <DotFlow f={f} mode="fill" from={[PW + 30, PH + 490]} w={170} h={150} n={64} fill={cl(g / 50)} speed={14} color={C.moonLit} />
        <SweepFront x={PW + 250} y={PH + 340} w={200} h={150} level={fr(g / 50)} dir="right" color={C.teal} f={f} />
        <rect x={PW + 250} y={PH + 340} width={200} height={150} fill="none" stroke={C.ink} strokeWidth={4} />
      </Panel>
      {/* 7 · abyss: the Earth limb with its cloud band sliding, a token with a trail, the laser dots */}
      <Panel id="m7" x={PW * 2} y={PH} fam="abyss" label="7 abyss · EarthLimb · Trail · LaserDots">
        <StarsTint18 f={f} x={PW * 2} y={PH} w={PW} h={PH} n={36} speed={12} seed={11} />
        <EarthLimb f={f} cx={PW * 2 + 240} y={PH + 400} R={900} cloudSpeed={12} />
        {(() => {
          const pos = (fr0: number): [number, number] => [PW * 2 + 50 + (fr0 - SHEET2) * 5, PH + 170 - Math.sin((fr0 - SHEET2) / 14) * 50];
          const [tx, ty] = pos(f);
          return (
            <g>
              <Trail points={trailOf(pos, f, 14, 2)} width={12} />
              <MoonToken x={tx} y={ty} r={18} f={f} />
              <LaserDots x0={PW * 2 + 240} y0={PH + 400} x1={tx} y1={ty} f={f} period={30} />
            </g>
          );
        })()}
      </Panel>
      {/* 8 · gauge: the icon shelf and the chroma table (lit-frame mix per family, the Moon fill, F9 pair) */}
      <Panel id="m8" x={PW * 3} y={PH} fam="gauge" label="8 gauge · icons18 · chromaTable">
        <PeaIcon x={PW * 3 + 40} y={PH + 40} size={26} />
        <RockChip x={PW * 3 + 100} y={PH + 40} size={44} rotate={g * 4} />
        <Clipboard x={PW * 3 + 160} y={PH + 44} size={52} />
        <Magnifier x={PW * 3 + 230} y={PH + 36} size={52} rotate={Math.sin(g / 8) * 12} />
        <Tape x={PW * 3 + 300} y={PH + 40} length={110} unroll={fr(g / 50)} f={f} />
        <Tape x={PW * 3 + 80} y={PH + 110} length={170} unroll={1} f={f} label={READ.recede38.text} />
        {tbl.rows.map((r, i) => (
          <text key={r.name} x={PW * 3 + 20} y={PH + 180 + i * 34} style={{ fontFamily: IF2.num, fontWeight: 700, fontSize: 22, fill: r.mix >= 0.4 ? "#FFEFC8" : C.vermilion }}>
            {`${r.name.padEnd(10, " ")} mix ${r.mix.toFixed(2)}  V ${r.value.toFixed(2)}  sky ${r.sky.map((c) => c.toFixed(2)).join(" ")}`}
          </text>
        ))}
        <text x={PW * 3 + 20} y={PH + 180 + 5 * 34} style={{ fontFamily: IF2.num, fontWeight: 700, fontSize: 22, fill: "#FFEFC8" }}>
          {`moon ${tbl.moon.map((m) => m.chroma.toFixed(2)).join(" / ")} (gate 0.45)`}
        </text>
        <text x={PW * 3 + 20} y={PH + 180 + 6 * 34} style={{ fontFamily: IF2.num, fontWeight: 700, fontSize: 22, fill: "#FFEFC8" }}>
          {`F9 lever ${chromaOf(C.lever).chroma.toFixed(2)} paper ${chromaOf("#EE8A2C").chroma.toFixed(2)} verm ${chromaOf(C.vermilion).chroma.toFixed(2)}`}
        </text>
        <text x={PW * 3 + 20} y={PH + 180 + 7 * 34} style={{ fontFamily: IF2.num, fontWeight: 700, fontSize: 22, fill: "#FFEFC8" }}>
          {`MODEL ${chromaOf(C.model).chroma.toFixed(2)} lemon ${chromaOf(C.lemon).chroma.toFixed(2)} sky ${chromaOf(C.sky).chroma.toFixed(2)}`}
        </text>
      </Panel>
    </g>
  );
};

export const L18KitDemo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage theme={familyOf("abyss").theme} drift={false} grain={0} vignette={0}>
      {f < SHEET2 ? <Sheet1 f={f} /> : <Sheet2 f={f} />}
    </Stage>
  );
};
