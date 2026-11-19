// `L17HumansVanish-kit-demo`: the foundation check (BUILD.md §4.1, §5). Not part of the episode. 150 f:
//   0-74    sheet 1: the city (skyline lit / drained, street), the YEARS dial and ladder (dark and light), the rung badge,
//           the tunnel movers (seep, pump, U-section fill), rain + a crack, paint flakes + pile, the stamps and pills
//   75-114  sheet 2: the board + sheet + ladder page with stamps, rust crack widening + scale, calcium dot stream + icons,
//           the Moon (dust falling straight down, prints, tinted stars, Tick), the ghost skyline sinking + haze, the icon
//           shelf, the time camera on its rail, the crack network
//   115-149 the RungCard (ONE DAY: THE LIGHTS) over the night skyline
// Check it with stills 15 frames apart (20, 35, 50 · 85, 100 · 125, 140): every mover must visibly move.
// Every number shown is a data17.ts READ value. USAGE: a reference for the package builders (read each panel's props).
import React from "react";
import { useCurrentFrame } from "remotion";
import { IF2, Sky, Tick } from "../../lib/illustrated";
import { Stage } from "../../lib/illustrated";
import { L17_COLORS, familyOf, type L17FamilyName } from "./families";
import { READ } from "./data17";
import { RungBadge, RungCard, TimeLadder, YearsDial, rungValue } from "./ladder";
import { Rail, TimeCamera } from "./rig";
import { AboutPill, AgencyPill, Board, ModelStamp, OurSumPill, ReasoningPill, SeenStamp, Sheet, SourceChip, TagStamp, WordPill } from "./stamps17";
import { Skyline, Street, drainFor } from "./city";
import { CrackDraw, DotStream, FillFront, Flakes, Rain, Seep, StarsTint, crackDrawFor } from "./movers17";
import { BandIcon, BottleIcon, DomeIcon, EiffelIcon, GearIcon, LampIcon, PrintIcon, PumpIcon, StoneIcon } from "./icons17";

export const L17_KIT_DEMO_FRAMES = 150;
const SHEET2 = 75;
const CARD_AT = 115;
const C = L17_COLORS;
const cl = (v: number) => Math.max(0, Math.min(1, v));
const PW = 480;
const PH = 540;

const Panel: React.FC<{ id: string; x: number; y: number; fam: L17FamilyName; label: string; children: React.ReactNode }> = ({ id, x, y, fam, label, children }) => (
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
    <rect x={x + 6} y={y + 6} width={label.length * 9.4 + 16} height={26} rx={6} fill="rgba(0,0,0,0.55)" />
    <text x={x + 14} y={y + 25} style={{ fontFamily: IF2.label, fontSize: 16, letterSpacing: 1.4, fill: "#FFF4E0" }}>
      {label}
    </text>
  </g>
);

/** A panel-local group: draw a full-frame piece at `scale` inside a panel at (x, y). */
const Mini: React.FC<{ x: number; y: number; scale: number; children: React.ReactNode }> = ({ x, y, scale, children }) => <g transform={`translate(${x} ${y}) scale(${scale})`}>{children}</g>;

const Sheet1: React.FC<{ f: number }> = ({ f }) => {
  const night = familyOf("night");
  return (
    <g>
      {/* 1 · night: the lit skyline with its bright window wave (22 px/f), the time camera, Tick, tinted stars */}
      <Panel id="k1" x={0} y={0} fam="night" label="1 night · Skyline wave · TimeCamera · StarsTint">
        <Mini x={0} y={0} scale={0.25}>
          <StarsTint f={f} w={1920} h={900} n={70} speed={13} />
          <Skyline f={f} family={night} ground={1000} x1={1920} wave={22} />
        </Mini>
        <TimeCamera x={300} y={500} size={120} f={f} family={night} dial={{ value: rungValue(Math.min(8, f / 9)) }} />
        <Tick x={150} y={505} pxPerM={90} frame={f} pose="hold" expression="neutral" />
        <Rail f={f} y={510} x0={0} x1={PW} speed={14} family={night} flag={{ at: 420, label: "ONE DAY" }} />
      </Panel>
      {/* 2 · night: the dark wave draining the windows top-down (30 px/f), the empty street with posts sliding + signal */}
      <Panel id="k2" x={PW} y={0} fam="night" label="2 night · Skyline drain 30 px/f · Street">
        <Mini x={PW} y={-60} scale={0.25}>
          <Skyline f={f} family={night} ground={1300} x1={1920} wave={0} drain={drainFor(f, 0, 600)} seed={3} />
          <Street f={f} family={night} y={1300} speed={18} signal={1100} />
        </Mini>
        <Mini x={PW} y={250} scale={0.25}>
          <Street f={f} family={night} y={300} speed={18} signal={900} />
        </Mini>
      </Panel>
      {/* 3 · night: the YEARS dial (dark plate) sweeping 4 deg/f with a rattle at the stop; the HUD ladder drawing up */}
      <Panel id="k3" x={PW * 2} y={0} fam="night" label="3 night · YearsDial dark · TimeLadder draw/lit">
        <YearsDial x={PW * 2 + 170} y={290} r={130} value={cl(f / 60)} family={night} f={f} rattle={f > 60 ? 1 : 0} />
        <TimeLadder x={PW * 2 + 400} y0={50} y1={520} f={f} family={night} draw={cl(f / 45)} lit={cl((f - 30) / 40) * 9} labels="left" width={46} size={0.75} />
      </Panel>
      {/* 4 · noon: the light plate (MILLENNIA word, F3), the rung badge, the ladder with the THOUSAND rung pulsing */}
      <Panel id="k4" x={PW * 3} y={0} fam="noon" label="4 noon · YearsDial light · RungBadge · glow">
        <RungBadge f={f % 78} rung={5} family={familyOf("noon")} x={PW * 3 + 20} y={100} />
        <YearsDial x={PW * 3 + 170} y={330} r={120} value={rungValue(5) + Math.sin(f / 6) * 0.05} word="MILLENNIA" family={familyOf("noon")} f={f} />
        <TimeLadder x={PW * 3 + 410} y0={160} y1={520} f={f} family={familyOf("noon")} lit={5.0001} glow={5} labels="left" width={40} size={0.6} />
      </Panel>
      {/* 5 · deep: seep on the tunnel wall (18 px/f), the pump spinning, the U-section filling from the lowest point */}
      <Panel id="k5" x={0} y={PH} fam="deep" label="5 deep · Seep · PumpIcon · FillFront U">
        <rect x={20} y={PH + 50} width={440} height={200} rx={20} fill={familyOf("deep").far} />
        <Seep f={f} x={30} y={PH + 60} w={420} h={180} n={22} />
        <PumpIcon x={380} y={PH + 190} size={90} f={f} />
        {(() => {
          const u = `M40 ${PH + 300} L120 ${PH + 300} L170 ${PH + 470} L310 ${PH + 470} L360 ${PH + 300} L440 ${PH + 300} L440 ${PH + 330} L380 ${PH + 330} L330 ${PH + 500} L150 ${PH + 500} L100 ${PH + 330} L40 ${PH + 330} Z`;
          return (
            <g>
              <path d={u} fill="#0C0405" stroke={familyOf("deep").far} strokeWidth={4} />
              <FillFront f={f} clip={u} x0={40} x1={440} bottom={PH + 500} top={PH + 300} level={cl(f / 70) * 0.95} />
            </g>
          );
        })()}
      </Panel>
      {/* 6 · rain: streaks at 26 px/f thinning, a crack drawing across the pavement (50 px/f head) */}
      <Panel id="k6" x={PW} y={PH} fam="rain" label="6 rain · Rain thin · CrackDraw head">
        <rect x={PW} y={PH + 380} width={PW} height={160} fill={familyOf("rain").near} />
        <Rain f={f} x={PW - 40} y={PH} w={PW + 80} h={PH} n={60} thin={cl((f - 40) / 34) * 0.7} />
        <CrackDraw x={PW + 30} y={PH + 450} length={420} draw={crackDrawFor(f, 0, 420)} color="#04161C" width={5} seed={4} />
        <Tick x={PW + 380} y={PH + 440} pxPerM={80} frame={f} pose="crouch-reach" expression="thinking" facing={-1} />
      </Panel>
      {/* 7 · noon: paint flakes drifting (13 px/f) and a pile growing at the foot; the Eiffel and dome icons */}
      <Panel id="k7" x={PW * 2} y={PH} fam="noon" label="7 noon · Flakes + pile · EiffelIcon · DomeIcon">
        <EiffelIcon x={PW * 2 + 150} y={PH + 270} size={330} />
        <Flakes f={f} x={PW * 2 + 40} y={PH + 60} w={260} h={420} n={40} pile={{ x: PW * 2 + 160, y: PH + 500, w: 260, grow: cl(f / 74) }} />
        <DomeIcon x={PW * 2 + 380} y={PH + 440} size={130} />
      </Panel>
      {/* 8 · studio: SEEN slam, MODEL slam, a tag slam, a ghost, and the honesty pills */}
      <Panel id="k8" x={PW * 3} y={PH} fam="studio" label="8 studio · stamps · pills">
        <SeenStamp x={PW * 3 + 100} y={PH + 120} age={f - 8} size={130} />
        <ModelStamp x={PW * 3 + 250} y={PH + 120} age={f - 22} size={120} />
        <SeenStamp x={PW * 3 + 400} y={PH + 120} ghost f={f} size={110} />
        <TagStamp x={PW * 3 + 140} y={PH + 260} word="BEST GUESS" age={f - 36} size={90} />
        <TagStamp x={PW * 3 + 360} y={PH + 260} word="A PLAN" age={f - 50} size={90} />
        <OurSumPill x={PW * 3 + 20} y={PH + 360} appear={cl(f / 10)} />
        <ReasoningPill x={PW * 3 + 200} y={PH + 360} appear={cl((f - 8) / 10)} />
        <AboutPill x={PW * 3 + 20} y={PH + 420} appear={cl((f - 16) / 10)} />
        <AgencyPill x={PW * 3 + 140} y={PH + 420} agency="NOAA SAYS" appear={cl((f - 24) / 10)} />
        <SourceChip x={PW * 3 + 320} y={PH + 420} name="POSIVA" appear={cl((f - 32) / 10)} />
        <WordPill x={PW * 3 + 20} y={PH + 480} text={READ.pumpGallons.text} appear={cl((f - 40) / 10)} size={18} />
      </Panel>
    </g>
  );
};

const Sheet2: React.FC<{ f: number }> = ({ f }) => {
  const g = f - SHEET2; // 0..39
  const studio = familyOf("studio");
  const voidF = familyOf("void");
  return (
    <g>
      {/* 1 · studio: the board, a sheet sliding up with a SEEN slam, the ladder page with stamps (board version) */}
      <Panel id="m1" x={0} y={0} fam="studio" label="1 studio · Board · Sheet · TimeLadder page">
        <Board x={24} y={50} w={432} h={460} f={f}>
          <Sheet x={30} y={40} w={230} h={210} f={f} title="Rome" band="ochre" appear={cl(g / 10)} stamp={{ kind: "seen", age: g - 14 }}>
            <DomeIcon x={90} y={70} size={90} />
          </Sheet>
          <Sheet x={30} y={270} w={230} h={160} f={f} title="the rust" band="slate" appear={cl((g - 6) / 10)} stamp={{ kind: "model", age: g - 24 }} />
          <TimeLadder x={340} y0={40} y1={440} f={f} family={studio} draw={1} lit={0} labels="left" width={36} size={0.55} stamps={[{ rung: 5, kind: "seen", age: g - 10 }, { rung: 6, kind: "ESTIMATE", age: g - 20 }, { rung: 0, kind: "model", ghost: true }]} />
        </Board>
      </Panel>
      {/* 2 · rust: a crack fanning from a rusting bar (widen), rust scale flakes */}
      <Panel id="m2" x={PW} y={0} fam="rust" label="2 rust · CrackDraw widen · Flakes (scale)">
        <rect x={PW + 30} y={90} width={420} height={400} rx={10} fill={C.concrete} />
        <rect x={PW + 30} y={280} width={420} height={26} fill={C.rust} />
        <CrackDraw x={PW + 60} y={290} rotate={-30} length={300} draw={crackDrawFor(g, 0, 300)} widen={cl((g - 8) / 25)} color="#2A1A10" seed={7} />
        <CrackDraw x={PW + 420} y={300} rotate={200} length={260} draw={crackDrawFor(g, 6, 260)} widen={cl((g - 14) / 25)} color="#2A1A10" seed={9} />
        <Flakes f={f} x={PW + 40} y={300} w={400} h={220} n={26} speed={12} color={C.rust} />
      </Panel>
      {/* 3 · noon: calcium dots streaming out of a lime lump into a crack (18 px/f); a source-row pill */}
      <Panel id="m3" x={PW * 2} y={0} fam="noon" label="3 noon · DotStream calcium · pill 2023">
        <rect x={PW * 2 + 30} y={120} width={420} height={360} rx={12} fill="#E9D9B4" />
        <path d={`M${PW * 2 + 60} 330 L${PW * 2 + 200} 300 L${PW * 2 + 300} 340 L${PW * 2 + 430} 310`} fill="none" stroke="#3A2A1A" strokeWidth={10} strokeLinejoin="round" />
        <circle cx={PW * 2 + 120} cy={220} r={34} fill="#FFFFFF" stroke="#C9B48A" strokeWidth={3} />
        <DotStream f={f} from={[PW * 2 + 120, 220]} to={[PW * 2 + 330, 330]} n={40} speed={18} spread={20} color="#FFFFFF" size={6} />
        <WordPill x={PW * 2 + 40} y={450} text={READ.romePaper.text} fill="rgba(31,79,76,0.72)" size={20} />
        <WordPill x={PW * 2 + 160} y={450} text="LIME LUMPS" fill="rgba(31,79,76,0.72)" size={20} dot="#FFFFFF" />
      </Panel>
      {/* 4 · void: the Moon. Dust falls straight down and settles (F6), sharp prints, tinted stars sliding, a rigid flag */}
      <Panel id="m4" x={PW * 3} y={0} fam="void" label="4 void · DotStream gravity 1 · PrintIcon · Tick">
        <StarsTint f={f} x={PW * 3} y={0} w={PW} h={330} n={50} speed={13} />
        <rect x={PW * 3} y={330} width={PW} height={210} fill={C.moonDust} />
        <rect x={PW * 3} y={330} width={PW} height={30} fill="#BFA982" />
        {[0, 1, 2, 3].map((i) => (
          <PrintIcon key={i} x={PW * 3 + 70 + i * 80} y={430 + (i % 2) * 30} size={70} rotate={-75} />
        ))}
        <DotStream f={f} from={[PW * 3 + 300, 300]} to={[PW * 3 + 300, 360]} n={30} speed={4} spread={60} gravity={1} color={C.moonDust} size={4} />
        <line x1={PW * 3 + 420} y1={400} x2={PW * 3 + 420} y2={300} stroke="#E8F2EE" strokeWidth={4} />
        <rect x={PW * 3 + 420} y={302} width={50} height={30} fill="#E8F2EE" />
        <Tick x={PW * 3 + 380} y={400} pxPerM={60} frame={f} pose="wave" expression="proud" facing={-1} />
      </Panel>
      {/* 5 · night: the ghost skyline sinking box by box (Z-02) under the teal haze band that does not fade (7-09) */}
      <Panel id="m5" x={0} y={PH} fam="night" label="5 night · Skyline ghost sink · haze">
        <Mini x={0} y={PH - 30} scale={0.25}>
          <StarsTint f={f} w={1920} h={1200} n={60} />
          <Skyline f={f} family={familyOf("night")} ground={2000} x1={1920} ghost sink={cl(g / 34)} haze={1} seed={5} />
        </Mini>
      </Panel>
      {/* 6 · dusk: the icon shelf (stone, band, bottle, gear turning, lamp, pump) */}
      <Panel id="m6" x={PW} y={PH} fam="dusk" label="6 dusk · icons17 shelf">
        <StoneIcon x={PW + 90} y={PH + 140} size={110} />
        <BandIcon x={PW + 250} y={PH + 140} size={100} />
        <BottleIcon x={PW + 400} y={PH + 140} size={110} />
        <GearIcon x={PW + 90} y={PH + 340} size={110} f={f} speed={10} />
        <LampIcon x={PW + 250} y={PH + 360} size={140} lit={g % 30 < 20 ? 1 : 0} />
        <PumpIcon x={PW + 400} y={PH + 340} size={110} f={f} running={g < 20} />
        <PrintIcon x={PW + 250} y={PH + 480} size={70} rotate={-90} />
      </Panel>
      {/* 7 · night: the time camera on its rail with the dial plate; capped variant (8-06) beside it */}
      <Panel id="m7" x={PW * 2} y={PH} fam="night" label="7 night · TimeCamera capped · Rail push">
        <StarsTint f={f} x={PW * 2} y={PH} w={PW} h={300} n={40} speed={13} />
        <Rail f={f} y={PH + 440} x0={PW * 2} x1={PW * 3} speed={20} family={familyOf("night")} flag={{ at: 300 + 20 * 75, label: "A WEEK" }} />
        <TimeCamera x={PW * 2 + 130} y={PH + 430} size={130} f={f} family={familyOf("night")} dial={{ value: rungValue(1) }} />
        <TimeCamera x={PW * 2 + 360} y={PH + 430} size={100} f={f} family={familyOf("night")} capped facing={-1} dial={{ value: rungValue(7), word: "100,000 YEARS" }} />
      </Panel>
      {/* 8 · frost: a branching crack network drawing across a wall (50 px/f) and edges stepping apart */}
      <Panel id="m8" x={PW * 3} y={PH} fam="frost" label="8 frost · CrackDraw network">
        <rect x={PW * 3 + 20} y={PH + 60} width={440} height={440} rx={10} fill="#C9D8D8" />
        {[0, 1, 2].map((i) => (
          <CrackDraw key={i} x={PW * 3 + 40 + i * 30} y={PH + 140 + i * 130} rotate={8 - i * 10} length={380} draw={crackDrawFor(g, i * 8, 380)} widen={cl((g - 20) / 18) * 0.5} color="#12323C" seed={11 + i} branches={4} />
        ))}
        <Tick x={PW * 3 + 400} y={PH + 520} pxPerM={70} frame={f} pose="lean" expression="determined" facing={-1} />
      </Panel>
    </g>
  );
};

export const L17KitDemo: React.FC = () => {
  const f = useCurrentFrame();
  if (f >= CARD_AT) {
    const cf = f - CARD_AT;
    const night = familyOf("night");
    return (
      <RungCard
        family={night}
        kicker="Off the Scale"
        title="ONE DAY: THE LIGHTS"
        t={0.3 + (cf / 35) * 0.4}
        frame={cf + 20}
        rung={0}
        from={0}
        behind={(fr) => <Skyline f={fr} family={night} ground={1080} x1={1700} lights={0.5} wave={22} scale={0.8} />}
      />
    );
  }
  return (
    <Stage theme={familyOf("night").theme} drift={false} grain={0} vignette={0}>
      {f < SHEET2 ? <Sheet1 f={f} /> : <Sheet2 f={f} />}
    </Stage>
  );
};
