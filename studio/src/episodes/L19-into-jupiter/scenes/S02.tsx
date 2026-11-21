// L19 scene "l02" · Clouds that weren't there (storyboard §3 act 1: 2-01…2-11, script lines 11-15; crest ↔ scope).
// Shot components (hard cuts only; PUSH/SLIDE rows are phases of one component):
//   2-01 (+2-02)  the probe falls past three dashed ghost decks HIGH / MIDDLE / LOW drawing across (head 40 px/f; decks scroll up
//                 18 px/f, wisps 24 px/f); ABOUT 71 KM + NASA SAYS. Push: the 71 and the 156 brackets grow side by side from
//                 DIFFERENT levels (36 / 40 px/f), pulses run down them; OUR SUM + NOT THE SAME LEVEL (#16 C, Q2)
//   2-03 (+2-04)  only one deck fills (front 30 px/f), the other outlines stay empty, wisps rush past (28 px/f); ONE THIN DECK.
//                 Slide: the EARTH / JUPITER panels, ten bolts flashing in turn against one, the cycle bar filling (30 px/f)
//   2-05 (+2-06, +2-07)  Tick (≥ 40 %) with the EXPECTED / FOUND water cards: the FOUND bar shrinks (30 px/f) and drops leave it
//                 (20 px/f). Slide: two flasks beside the falling probe, FOUND dropping to exactly half (30 px/f), bubbles
//                 (20 px/f); ABOUT HALF. Slide: two thermometers, the FOUND mercury shoots past EXPECTED (36 px/f), heat
//                 shimmer (22 px/f), Tick fans himself; HOTTER THAN PREDICTED
//   2-08          the mystery "?" box under the hot bar, heat waves (22 px/f), Tick sweeps the magnifier (20 px/f); NASA SAID (1996)
//   2-09          three HEARD tickets slam beside the three cards in turn (8 f stagger), dust rings (16 px/f), the tape (24 px/f)
//   2-10          the six chips light along the tape (6 f stagger), each pulsing rings (20 px/f), the tape scrolling (24 px/f)
//   2-11          the camera drops again: decks scroll up (28 px/f) and shear in opposite directions (18-26 px/f); Tick at the window
// Numbers drawn (data19 READ): km71 71 (#10 A, NASA SAYS) · km156 156 (#4 A) with OUR SUM (#16 C). Class B words only for
// ONE THIN DECK, ONE TENTH AS OFTEN, ABOUT HALF, HOTTER THAN PREDICTED (#4, F3). F8: the brackets are not to scale.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bloom, Layer, Stage, Tick } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Thermo } from "../dial";
import { TapeTicket, TapeTrace } from "../tape";
import { Wisps } from "../decks";
import { Canopy, Capsule } from "../probe19";
import { AgencyPill, OurSumPill, QuestionTag, WordPill } from "../tags19";
import { Bolt, Flask, Magnifier, WaterDrop } from "../icons19";
import { Cue, SFX, cutHit } from "./cue-types";
import {
  C,
  CREST,
  Card,
  ClipBox,
  Clipboard,
  DRIFT,
  Descent,
  HeatWaves,
  INK,
  Phase,
  Plate,
  Pop,
  Ribbon,
  Rings,
  Roll,
  SCOPE,
  Station,
  VBracket,
  WinProbe,
  ez,
  lerp,
  lin,
  wrap,
} from "./a-parts";

export const cuesL02 = (t: SceneTiming) => {
  const { at, frac } = cueKit(t);
  return {
    c02: frac(0, 0.5), // phase ("That is less than half")
    c03: at(1),
    c04: frac(1, 0.5), // phase ("Even the lightning")
    c05: at(2),
    c06: frac(2, 0.34), // phase ("The helium came out")
    c07: frac(2, 0.68), // phase ("Heat was off too")
    c08: at(3),
    c09: at(4),
    c10: frac(4, 0.34),
    c11: frac(4, 0.62),
    end: t.frames,
  };
};
export type CL02 = ReturnType<typeof cuesL02>;

const Probe: React.FC<{ f: number; x: number; y: number; r: number; sway?: number }> = ({ f, x, y, r, sway = 8 }) => (
  <g>
    <Canopy x={x} y={y} r={r} unfurl={1} f={f} sway={sway} />
    <Capsule x={x} y={y} r={r} f={f} chips={6} />
  </g>
);

// ================================================================================================================
// 2-01 + 2-02 · the ghost decks HIGH / MIDDLE / LOW draw across (head 40 px/f) as the probe falls past them (decks up 18 px/f,
// wisps 24 px/f, the ghost dashes crawling); ABOUT 71 KM + NASA SAYS (#10). Push: the 71 and 156 brackets grow from
// different levels (36 / 40 px/f), then a pulse runs down each (20 px/f) for the rest of the shot; OUR SUM + NOT THE SAME LEVEL
// ================================================================================================================
const ShotGhost: ShotFC<CL02> = ({ f, c, len }) => {
  const T2 = c.c02;
  const A = (
    <Stage theme={CREST.theme} shotFrame={f} drift={DRIFT(1, 1.12, 0.04, 0.02)} vignette={0.2} grain={0.5}>
      <Descent f={f} fam="crest" speed={18} ghost={["HIGH", "MIDDLE", "LOW"]} ghostDraw={lin(f, 6, 46)} seed={41} />
      <Layer depth={1}>
        <Wisps f={f} x={0} y={0} w={1920} h={1080} n={12} speed={24} />
        <Probe f={f} x={1500} y={290} r={62} />
      </Layer>
      <Layer depth={0}>
        <rect x={80} y={110} width={640} height={260} rx={30} fill="rgba(43,9,5,0.62)" />
        <AgencyPill x={110} y={160} agency="NASA SAYS" size={30} appear={lin(f, 20, 30)} />
        <Roll x={110} y={340} k={lin(f, 24, 90)} rkey="km71" prefix="ABOUT" unit="KM" size={110} />
      </Layer>
    </Stage>
  );
  const g = Math.max(0, f - T2);
  const s71 = 300;
  const s156 = (300 * 156) / 71; // the two brackets in proportion to each other (not to the decks, F8)
  const B = (
    <Stage theme={CREST.theme} shotFrame={g} drift={DRIFT(2, 1.1, 0.04)} vignette={0.2} grain={0.5}>
      <Descent f={f} fam="crest" speed={18} seed={42} />
      <Layer depth={1}>
        <Wisps f={f} x={0} y={0} w={1920} h={1080} n={10} speed={24} />
        <Probe f={f} x={420} y={250} r={50} />
        <rect x={1040} y={200} width={760} height={840} rx={36} fill="rgba(43,9,5,0.55)" />
        <line x1={1080} y1={260} x2={1340} y2={260} stroke="#FFF0A0" strokeWidth={4} strokeDasharray="10 12" />
        <line x1={1380} y1={330} x2={1760} y2={330} stroke="#FFF0A0" strokeWidth={4} strokeDasharray="10 12" />
        <VBracket x={1220} y0={260} y1={260 + s71} draw={lin(g, 4, 4 + s71 / 36)} cap={34} width={10} />
        <VBracket x={1560} y0={330} y1={330 + s156} draw={lin(g, 8, 8 + s156 / 40)} cap={34} width={10} />
        {g > 30 ? <circle cx={1220} cy={260 + wrap(g * 20, s71)} r={14} fill={C.goldHot} /> : null}
        {g > 30 ? <circle cx={1560} cy={330 + wrap(g * 20, s156)} r={14} fill={C.goldHot} /> : null}
        <Plate x={1260} y={260 + s71 / 2} text={`${71 /* #10 */} KM`} size={34} appear={lin(g, 12, 20)} />
        <Plate x={1600} y={330 + s156 / 2} text={`${156 /* #4 */} KM`} size={34} appear={lin(g, 22, 30)} />
      </Layer>
      <Layer depth={0}>
        <OurSumPill x={110} y={900} size={34} appear={lin(g, 30, 40)} />
        <WordPill x={110} y={980} text="NOT THE SAME LEVEL" F={CREST} size={34} appear={lin(g, 36, 46)} />
      </Layer>
    </Stage>
  );
  void len;
  return <Phase f={f} at={T2 - 6} dur={14} kind="push" a={A} b={B} />;
};

// ================================================================================================================
// 2-03 + 2-04 · only one deck fills (front 30 px/f) while the other two outlines stay empty; wisps rush past (28 px/f), the
// decks scroll (14 px/f); ONE THIN DECK (#4). Slide: the EARTH / JUPITER panels: ten bolts flash in turn on Earth's (5 f
// apart) against one on Jupiter's per cycle, the cycle bar fills (30 px/f) and wraps; ONE TENTH AS OFTEN (#4)
// ================================================================================================================
const ShotOneDeck: ShotFC<CL02> = ({ f, c }) => {
  const T4 = c.c04 - c.c03;
  const A = (
    <Stage theme={CREST.theme} shotFrame={f} drift={DRIFT(3, 1.1, 0.03, 0.02)} vignette={0.2} grain={0.5}>
      <Descent f={f} fam="crest" speed={14} ghost={["HIGH", "MIDDLE", "LOW"]} ghostDraw={1} fill={lin(f, 4, 56)} seed={43} />
      <Layer depth={1}>
        <Wisps f={f} x={0} y={0} w={1920} h={1080} n={14} speed={28} />
        <Probe f={f} x={960} y={260} r={56} />
      </Layer>
      <Layer depth={0}>
        <Plate x={110} y={160} text="ONE THIN DECK" size={38} appear={lin(f, 20, 30)} />
      </Layer>
    </Stage>
  );
  const g = Math.max(0, f - T4);
  const P = 54;
  const ph = wrap(g, P);
  const earthOn = Math.floor(ph / 5.4);
  const jupOn = ph < 7;
  const panel = (x: number, title: string) => (
    <g>
      <rect x={x + 8} y={232} width={740} height={540} rx={34} fill="#002A1A" opacity={0.35} />
      <rect x={x} y={220} width={740} height={540} rx={34} fill={C.emeraldDeep} />
      <rect x={x} y={220} width={740} height={540} rx={34} fill="none" stroke={C.goldRim} strokeWidth={6} />
      <Plate x={x + 370} y={280} text={title} size={34} align="middle" fill={C.heard} color={INK} />
    </g>
  );
  const B = (
    <Stage theme={SCOPE.theme} shotFrame={g} drift={DRIFT(4, 1.1, 0.04)} vignette={0.16} grain={0.5}>
      <Station f={f} desk={900} win={{ x: 820, y: 40, w: 280, h: 140 }} winSpeed={18} probe={false} seed={44} />
      <Layer depth={1}>
        {panel(150, "EARTH")}
        {panel(1030, "JUPITER")}
        {Array.from({ length: 10 }, (_, i) => {
          const bx = 230 + (i % 5) * 145;
          const by = 440 + Math.floor(i / 5) * 200;
          const on = earthOn === i;
          return (
            <g key={i} opacity={on ? 1 : 0.3}>
              {on ? <Bloom x={bx} y={by} r={120} color="#FFF0A0" strength={0.8} /> : null}
              <Bolt x={bx} y={by} size={on ? 130 : 100} f={g} />
            </g>
          );
        })}
        <g opacity={jupOn ? 1 : 0.3}>
          {jupOn ? <Bloom x={1400} y={540} r={200} color="#FFF0A0" strength={0.9} /> : null}
          <Bolt x={1400} y={540} size={jupOn ? 200 : 160} f={g} />
        </g>
        <rect x={150} y={800} width={1620} height={26} rx={13} fill={C.emeraldDeep} />
        <rect x={150} y={800} width={1620 * (ph / P)} height={26} rx={13} fill={C.heard} />
      </Layer>
      <Layer depth={0}>
        <WordPill x={960} y={980} text="ONE TENTH AS OFTEN" F={SCOPE} size={38} align="middle" appear={lin(g, 10, 20)} />
      </Layer>
    </Stage>
  );
  return <Phase f={f} at={T4 - 6} dur={14} kind="slide" a={A} b={B} />;
};

// ================================================================================================================
// 2-05 + 2-06 + 2-07 · the water cards on Tick's clipboard (Tick ≥ 40 %): the FOUND bar shrinks (30 px/f) and drops keep
// leaving it (20 px/f). Slide: the flasks beside the falling probe (decks up 18 px/f): FOUND drops to exactly half (30 px/f),
// bubbles rise in both (20 px/f); ABOUT HALF. Slide: two thermometers: the FOUND mercury shoots up past the EXPECTED mark
// (36 px/f) and boils on, heat shimmer rises (22 px/f), Tick fans himself with the clipboard; HOTTER THAN PREDICTED (#4)
// ================================================================================================================
const Bubbles: React.FC<{ f: number; x: number; y0: number; y1: number; w: number; n?: number; seed?: number }> = ({ f, x, y0, y1, w, n = 8, seed = 1 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const h = Math.max(1, y0 - y1);
      const yy = y0 - wrap(f * 20 + i * (h / n) + seed * 37, h);
      const xx = x + Math.sin(f * 0.2 + i * 1.7) * 8 + (((i * 53 + seed * 17) % 100) / 100 - 0.5) * w;
      return <circle key={i} cx={xx} cy={yy} r={6 + (i % 3) * 3} fill="#9FEFF8" opacity={0.8} />;
    })}
  </g>
);
const ShotCards: ShotFC<CL02> = ({ f, c }) => {
  const T6 = c.c06 - c.c05;
  const T7 = c.c07 - c.c05;
  const slide = ez(f, 0, 24) * 40;
  const found = lerp(440, 110, lin(f, 10, 21));
  const A = (
    <Stage theme={SCOPE.theme} shotFrame={f} drift={DRIFT(5, 1.1, 0.04)} vignette={0.16} grain={0.5}>
      <Station f={f} desk={960} seed={45} />
      <Layer depth={1}>
        <rect x={706} y={142} width={1080} height={820} rx={30} fill="#002A1A" opacity={0.3} />
        <rect x={700} y={130} width={1080} height={820} rx={30} fill="#B8431A" />
        <rect x={1140} y={110} width={200} height={50} rx={14} fill={C.goldRim} />
        <Card x={760 + slide} y={220} w={440} h={680} title="EXPECTED" fill={C.apricot}>
          <rect x={960 + slide} y={420} width={80} height={440} rx={20} fill={C.emeraldDeep} opacity={0.4} />
          <rect x={960 + slide} y={860 - 440} width={80} height={440} rx={20} fill={C.belt} />
        </Card>
        <Card x={1280 - slide} y={220} w={440} h={680} title="FOUND" fill={C.heard}>
          <rect x={1480 - slide} y={420} width={80} height={440} rx={20} fill={C.emeraldDeep} opacity={0.4} />
          <rect x={1480 - slide} y={860 - found} width={80} height={found} rx={20} fill={C.belt} />
          {f > 14 ? Array.from({ length: 4 }, (_, i) => <WaterDrop key={i} x={1520 - slide + Math.sin(i * 2.1) * 40} y={860 - found - wrap(f * 20 + i * 90, 360)} size={44} />) : null}
        </Card>
        <Tick x={400} y={1040} pxPerM={254} frame={f} pose="hold" expression="happy" look={0.5} />
      </Layer>
    </Stage>
  );
  const g = Math.max(0, f - T6);
  const half = 1 - 0.5 * lin(g, 2, 16);
  const B = (
    <Stage theme={CREST.theme} shotFrame={g} drift={DRIFT(6, 1.1, 0.03, 0.02)} vignette={0.2} grain={0.5}>
      <Descent f={f} fam="crest" speed={18} seed={46} />
      <Layer depth={1}>
        <Wisps f={f} x={0} y={0} w={1920} h={1080} n={8} speed={20} />
        <Probe f={f} x={380} y={350} r={64} />
        <Flask x={1040} y={600} size={420} level={1} f={g} />
        <Flask x={1500} y={600} size={420} level={half} f={g} />
        <Bubbles f={g} x={1040} y0={760} y1={470} w={160} seed={1} />
        <Bubbles f={g} x={1500} y0={760} y1={600} w={180} n={6} seed={2} />
        <Plate x={1040} y={880} text="EXPECTED" size={32} align="middle" />
        <Plate x={1500} y={880} text="FOUND" size={32} align="middle" fill={C.heard} color={INK} />
      </Layer>
      <Layer depth={0}>
        <WordPill x={110} y={980} text="ABOUT HALF" F={CREST} size={40} appear={lin(g, 14, 24)} />
      </Layer>
    </Stage>
  );
  const h = Math.max(0, f - T7);
  const lvl = Math.min(0.88, 0.45 + h * (36 / 620)) + (h > 12 ? 0.025 * Math.sin(h * 0.5) : 0);
  const D = (
    <Stage theme={SCOPE.theme} shotFrame={h} drift={DRIFT(7, 1.1, 0.04)} vignette={0.16} grain={0.5}>
      <Station f={f} desk={990} seed={47} />
      <Layer depth={1}>
        <Bloom x={1360} y={300} r={420} color={C.glow} strength={0.5 * lin(h, 8, 20)} />
        <HeatWaves f={h} x={1240} y={60} w={240} h={300} n={3} speed={22} color="#FFE066" />
        <Thermo x={960} y={900} h={640} level={0.45} f={h} color={C.lever} />
        <Thermo x={1360} y={900} h={640} level={lvl} expected={0.45} f={h} />
        <Plate x={960} y={1030} text="EXPECTED" size={30} align="middle" />
        <Plate x={1360} y={1030} text="FOUND" size={30} align="middle" fill={C.heard} color={INK} />
        <Tick x={430} y={1050} pxPerM={230} frame={h} pose="wipe-brow" expression="surprised" look={0.5} />
        <Clipboard x={600} y={620} size={120} rotate={-20 + 22 * Math.sin(h * 0.45)} />
      </Layer>
      <Layer depth={0}>
        <Plate x={110} y={160} text="HOTTER THAN PREDICTED" size={38} appear={lin(h, 12, 22)} />
      </Layer>
    </Stage>
  );
  return (
    <Pop f={f}>
      <Phase f={f} at={T7 - 6} dur={14} kind="slide" a={<Phase f={f} at={T6 - 6} dur={14} kind="slide" a={A} b={B} />} b={D} />
    </Pop>
  );
};

// ================================================================================================================
// 2-08 · the mystery: heat waves rise from the hot bar (22 px/f), a "?" box sits under it, Tick sweeps the magnifier across
// the box (20 px/f peak), the "?" bobs, the window's decks fall (18 px/f); NASA SAID (1996) (#4: a heating process nobody had
// identified)
// ================================================================================================================
const ShotMystery: ShotFC<CL02> = ({ f }) => {
  const mx = 1160 + 170 * Math.sin(f * 0.12);
  return (
    <Pop f={f}>
      <Stage theme={SCOPE.theme} shotFrame={f} drift={DRIFT(8, 1.1, 0.04)} vignette={0.16} grain={0.5}>
        <Station f={f} desk={900} win={{ x: 110, y: 110, w: 480, h: 320 }} winSpeed={18} seed={48} />
        <Layer depth={1}>
          <Bloom x={760} y={330} r={360} color={C.glow} strength={0.45} />
          <HeatWaves f={f} x={640} y={40} w={240} h={300} n={3} speed={22} />
          <Thermo x={760} y={880} h={560} level={0.9 + 0.02 * Math.sin(f * 0.5)} expected={0.45} f={f} />
          <rect x={1006} y={656} width={320} height={250} rx={18} fill="#002A1A" opacity={0.3} />
          <rect x={1000} y={640} width={320} height={250} rx={18} fill="#B8431A" />
          <rect x={1000} y={640} width={320} height={60} rx={18} fill={C.lever} />
          <line x1={1000} y1={760} x2={1320} y2={760} stroke="#8E1A18" strokeWidth={8} />
          <QuestionTag x={1160} y={560} f={f} size={120} />
          <Magnifier x={mx} y={780} size={230} rotate={-20 + Math.sin(f * 0.12) * 15} />
          <Tick x={1600} y={1050} pxPerM={220} frame={f} facing={-1} pose="hold" expression="thinking" look={-0.4} headTilt={-10} />
        </Layer>
        <Layer depth={0}>
          <AgencyPill x={1180} y={160} agency="NASA SAID (1996)" size={34} appear={lin(f, 8, 18)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 2-09 · three HEARD tickets slam beside the three cards in turn (30 px/f, 8 f stagger) and keep swinging; dust rings spread
// (16 px/f); the tape scrolls along the desk (24 px/f)
// ================================================================================================================
const ShotStamps: ShotFC<CL02> = ({ f }) => {
  const cards = [["CLOUDS"], ["WATER"], ["HEAT"]];
  return (
    <Pop f={f}>
      <Stage theme={SCOPE.theme} shotFrame={f} drift={DRIFT(9, 1.12, 0.04)} vignette={0.16} grain={0.5}>
        <Station f={f} desk={900} seed={49} />
        <Layer depth={1}>
          {cards.map(([title], i) => {
            const x = 220 + i * 540;
            const s0 = 6 + i * 8;
            return (
              <g key={title}>
                <Card x={x} y={170} w={400} h={420} title={title} fill={C.apricot}>
                  {i === 0 ? (
                    <g>
                      <rect x={x + 60} y={360} width={280} height={60} rx={30} fill="#FFF0A0" />
                      <rect x={x + 60} y={450} width={280} height={60} rx={30} fill="none" stroke={C.ink} strokeWidth={5} strokeDasharray="16 12" />
                    </g>
                  ) : i === 1 ? (
                    <WaterDrop x={x + 200} y={420} size={160} />
                  ) : (
                    <Thermo x={x + 200} y={540} h={300} level={0.85} f={f} />
                  )}
                </Card>
                <TapeTicket x={x + 200} y={720} word="HEARD" f={f + i * 7} slam={lin(f, s0, s0 + 8)} swing={f > s0 + 8 ? 12 : 0} size={0.9} />
                {f > s0 + 8 ? <Rings f={f - s0 - 8} x={x + 200} y={790} speed={16} max={260} n={2} color={C.heard} width={8} squash={0.3} /> : null}
              </g>
            );
          })}
          <TapeTrace f={f} x={80} y={980} w={1760} h={90} mode="wave" speed={24} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 2-10 · a real instrument in that air: six chips light along the tape (6 f stagger), each pulsing rings (20 px/f) while the
// tape scrolls under them (24 px/f)
// ================================================================================================================
const ShotChipsTape: ShotFC<CL02> = ({ f }) => (
  <Pop f={f}>
    <Stage theme={SCOPE.theme} shotFrame={f} drift={DRIFT(10, 1.12, 0.04)} vignette={0.16} grain={0.5}>
      <Station f={f} desk={940} seed={50} />
      <Layer depth={1}>
        <rect x={100} y={560} width={1720} height={160} rx={30} fill="rgba(0,42,26,0.5)" />
        <TapeTrace f={f} x={120} y={640} w={1680} h={120} mode="wave" speed={24} />
        <Capsule x={190} y={330} r={90} f={f} chips={lin(f, 4, 40) * 6} />
        {Array.from({ length: 6 }, (_, i) => {
          const x = 480 + i * 250;
          const on = lin(f, 4 + i * 6, 10 + i * 6);
          return (
            <g key={i}>
              {on > 0 ? <Rings f={f - (4 + i * 6)} x={x} y={400} speed={20} max={220} n={2} color={C.heard} width={8} /> : null}
              <rect x={x - 66} y={334} width={132} height={132} rx={24} fill={C.emeraldDeep} stroke={C.goldRim} strokeWidth={6} />
              <rect x={x - 50} y={350} width={100} height={100} rx={16} fill={C.heard} opacity={on} />
              <line x1={x} y1={466} x2={x} y2={580} stroke={C.goldRim} strokeWidth={6} />
            </g>
          );
        })}
      </Layer>
    </Stage>
  </Pop>
);

// ================================================================================================================
// 2-11 · the camera drops again: the decks scroll up (28 px/f) and start shearing in opposite directions (18-26 px/f), the
// tape's wavy line trails the probe; Tick shades his eyes at the station window
// ================================================================================================================
const ShotDiveAgain: ShotFC<CL02> = ({ f, len }) => {
  const k = lin(f, 0, len * 0.5);
  const sh = [18, -24, 22, -26, 20, -18].map((v) => v * (0.3 + 0.7 * k));
  return (
    <Pop f={f}>
      <Stage theme={CREST.theme} shotFrame={f} drift={DRIFT(11, 1.14, 0.02, 0.04)} vignette={0.2} grain={0.5}>
        <Descent f={f} fam="crest" speed={28} shear={sh} seed={51} />
        <Layer depth={1}>
          <Wisps f={f} x={0} y={0} w={1920} h={1080} n={12} speed={30} />
          <Probe f={f} x={960} y={300} r={60} />
          <rect x={70} y={690} width={420} height={340} rx={30} fill={C.emeraldDeep} />
          <ClipBox x={86} y={706} w={388} h={308} rx={20}>
            <Station f={f} desk={980} seed={52} />
            <Tick x={280} y={1000} pxPerM={150} frame={f} pose="think" expression="thinking" headTilt={-12} look={0.6} />
          </ClipBox>
          <rect x={86} y={706} width={388} height={308} rx={20} fill="none" stroke={C.goldRim} strokeWidth={6} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================

export const SceneL02: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL02(t);
  const shots: ShotDef<CL02>[] = [
    { from: 0, S: ShotGhost, id: "2-01" }, // + 2-02
    { from: c.c03, S: ShotOneDeck, id: "2-03" }, // + 2-04
    { from: c.c05, S: ShotCards, id: "2-05" }, // + 2-06, 2-07
    { from: c.c08, S: ShotMystery, id: "2-08" },
    { from: c.c09, S: ShotStamps, id: "2-09" },
    { from: c.c10, S: ShotChipsTape, id: "2-10" },
    { from: c.c11, S: ShotDiveAgain, id: "2-11" },
  ];
  return <AbsoluteFill>{playShots(f, shots, c, t.frames)}</AbsoluteFill>;
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL02 = (t: SceneTiming): Cue[] => {
  const c = cuesL02(t);
  const run = (at: number, n: number, gap: number, vol = 0.08): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 8 }));
  return [
    { at: 4, file: SFX.swirl, vol: 0.16, dur: 60 },
    { at: c.c02 + 4, file: SFX.click, vol: 0.12, dur: 10 },
    ...cutHit(c.c03),
    { at: c.c03 + 2, file: SFX.whoosh, vol: 0.16, dur: 50 },
    ...run(c.c04 + 4, 8, 6),
    ...cutHit(c.c05),
    { at: c.c05 + 10, file: SFX.click, vol: 0.12, dur: 10 },
    { at: c.c06 + 4, file: SFX.click, vol: 0.12, dur: 10 },
    { at: c.c07 + 2, file: SFX.whoosh, vol: 0.16, dur: 50 },
    ...cutHit(c.c08),
    { at: c.c08 + 6, file: SFX.pop, vol: 0.14, dur: 16 },
    ...cutHit(c.c09),
    ...[0, 1, 2].flatMap((i): Cue[] => [
      { at: c.c09 + 6 + i * 8, file: SFX.click, vol: 0.1, dur: 8 },
      { at: c.c09 + 13 + i * 8, file: SFX.pop, vol: 0.13, dur: 16 },
    ]),
    ...cutHit(c.c10),
    ...run(c.c10 + 4, 6, 6),
    ...cutHit(c.c11),
    { at: c.c11 + 4, file: SFX.riser, vol: 0.2, dur: c.end - c.c11 - 4, fadeOut: 12 },
  ];
};
