// L18 scene "l07" (storyboard §3 "7 · The ladder, in one picture", script lines 37-40). Package B.
// ShotDefs (hard cuts; PUSH / SLIDE rows are phases): 7-01 (+7-02, 7-03, 7-04, 7-05, 7-06: ONE rail and one camera, the room
// lights from abyss to gauge for 7-02-7-05 and goes dark again for 7-06) · 7-07 · 7-08 · 7-09.
// Numbers drawn (all data18 READ): 384,400 KM (#1 A, 7-02) · 42,164 KM + ABOUT 760 TIMES + OUR SUM (#13 A, #10 C, 7-03) · 18,400 KM
// (#7 C, 7-04, the MODEL placard; the FLUID LINE mark is OUR SUM) · ×1 / ×760 / ×9,000 bars and ABOUT 9,000 TIMES + OUR SUM (#10 C,
// 7-05) · ×66,000 and ABOUT 66,000 TIMES + OUR SUM (#10 C, 7-06) · ABOUT 92,000 TIMES + OUR SUM (#10 C, 7-07) · ×760 … ×92,000 tags
// with OUR SUM (#10 C, 7-08). Bars are log-scaled scale factors from the cube law (row 10), never a tide height (F6).
import React from "react";
import { useCurrentFrame } from "remotion";
import { Bloom, Kicker, Layer, Motes, Stage, Tick, walkPhase } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { familyOf } from "../families";
import { READ, ReadKey } from "../data18";
import { DistGauge, MARKS, MarkId, railY } from "../gauge";
import { PullBar } from "../tidal";
import { FlipTag, OurSumPill, QuestionTag, flipFor } from "../tags18";
import { StarsTint18 } from "../movers18";
import { Clipboard } from "../icons18";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { C, FamSky, Label, NightSky, Num, Plate, Pop, ReadHead, Readout, RollInt, Slam, alpha, ez, fr, lin, logLerp } from "./b-parts";

export const cuesL07 = (t: SceneTiming) => {
  const { at, p } = cueKit(t);
  return {
    s701: 0,
    s702: p(0, "Today the Moon sits"),
    s703: p(0, "At forty-two thousand"),
    s704: at(1),
    s705: p(1, "the pull is about nine thousand"),
    s706: at(2),
    s707: p(2, "And at the station's height"),
    s708: at(3),
    s709: p(3, "So which parts are measured"),
    end: t.frames,
  };
};
export type C07 = ReturnType<typeof cuesL07>;

const ABY = familyOf("abyss");
const GAU = familyOf("gauge");
const ORDER: MarkId[] = ["today", "geo", "fluid", "stiff", "station"];
/** log-scaled bar height for a pull factor (scale only; the readout carries the number) */
const barH = (v: number) => 60 + 105 * Math.log10(v);

// ===============================================================================================================
// 7-01 → 7-06 · the ladder in one picture. 7-01: the camera pulls back over the whole rail (decade 900 → 300, ticks stream) and the
// lamps light top to bottom; Tick reads them with a pencil. 7-02: the room lights (gauge), TODAY + MEASURED. 7-03/7-04: the token
// slides to GEOSTATIONARY then FLUID (the camera follows 14 f behind: ticks stream); MODEL flips on. 7-05: the bars grow in order.
// 7-06: the room goes dark again, the token slides to STIFF and the fourth bar shoots up past Tick's head.
// ===============================================================================================================
const Ladder: ShotFC<C07> = ({ f, c }) => {
  const T2 = c.s702;
  const T3 = c.s703;
  const T4 = c.s704;
  const T5 = c.s705;
  const T6 = c.s706;
  const tokenAt = (g: number) => {
    if (g < T3) return MARKS.today.km;
    if (g < T4) return logLerp(MARKS.today.km, MARKS.geo.km, ez(g, T3, T3 + 60));
    if (g < T6) return logLerp(MARKS.geo.km, MARKS.fluid.km, ez(g, T4, T4 + 50));
    return logLerp(MARKS.fluid.km, MARKS.stiff.km, ez(g, T6 + 4, T6 + 60));
  };
  const tok = tokenAt(f);
  const follow = tokenAt(f - 14) / Math.pow(10, 0.3); // the camera keeps the token a little above centre, 14 f behind
  const u1 = ez(f, 0, T2 - 6);
  const u2 = ez(f, T2 - 6, T2 + 30);
  const decade = f < T2 - 6 ? 900 + (300 - 900) * u1 : 300 + (520 - 300) * u2;
  const center = f < T2 - 6 ? logLerp(160000, 12400, u1) : logLerp(12400, follow, u2);
  const light = ez(f, T2 - 10, T2 + 14) * (1 - ez(f, T6 - 6, T6 + 14));
  const F = light > 0.5 ? GAU : ABY;
  const lit = ORDER.filter((m, i) => f >= 18 + i * 10);
  const tx = 1000;
  const walkOut = ez(f, T2, T2 + 50);
  const walkIn = ez(f, T6, T6 + 24);
  const tickX = f < T6 ? tx - 1300 * walkOut : -260 + (880 + 260) * walkIn;
  const showTick = f < T2 + 50 || f >= T6;
  const walking = (f >= T2 && f < T2 + 50) || (f >= T6 && f < T6 + 24);
  const bar = (i: number, v: number, key: ReadKey | undefined, at: number, x: number) => {
    if (f < at) return null;
    return (
      <g key={i}>
        <PullBar x={x} y={1000} h={barH(v)} t={lin(f, at, at + (i === 3 ? 18 : 14))} f={f} w={120} readKey={key} color={i === 3 ? C.gold : C.amber} textColor={F === GAU ? C.ink : "#FFEFC8"} />
        {!key ? <Num x={x} y={1000 - barH(v) * lin(f, at, at + 14) - 26} text="×1" size={54} color={F === GAU ? C.ink : "#FFEFC8"} who="7-05 bar 1" /> : null}
      </g>
    );
  };
  const leanBack = f >= T6 + 30 ? ez(f, T6 + 30, T6 + 46) : 0;
  return (
    <Stage theme={F.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.004, panY: 0, frames: 260, seed: 31 }} vignette={0.18} grain={0.5}>
      <Layer depth={0.1}>
        <NightSky />
        <g opacity={light}>
          <FamSky name="gauge" />
        </g>
      </Layer>
      <Layer depth={0.3}>
        <g opacity={1 - light}>
          <StarsTint18 f={f} x={-300} y={-300} w={2520} h={1680} n={90} speed={10} angle={90} seed={14} />
        </g>
      </Layer>
      <Layer depth={1}>
        <Bloom x={1240} y={railY(tok, center, decade)} r={300} color={C.amber} strength={0.35} />
        <DistGauge f={f} family={F} center={center} decade={decade} x={1240} token={tok} tokenR={34} speed={16} lit={lit} lines={f >= T4 ? ["fluid"] : []} lineDraw={lin(f, T4 + 30, T4 + 60)} lineFrom={1000} />
      </Layer>
      <Layer depth={0.9}>
        {bar(0, 1, undefined, T5, 120)}
        {bar(1, 760, "pull760", T5 + 10, 300)}
        {bar(2, 9000, "pull9000", T5 + 20, 480)}
        {bar(3, 66000, "pull66k", T6 + 20, 660)}
        {showTick ? (
          <g>
            <Tick
              x={tickX}
              y={1000}
              pxPerM={f < T6 ? 120 : 170}
              frame={f}
              facing={f < T6 ? (walkOut > 0 ? -1 : 1) : 1}
              pose={walking ? "stand" : f < T6 ? "hold" : leanBack > 0 ? "shrug" : "stand"}
              walk={walking ? walkPhase(f, 20) : undefined}
              expression={f < T6 ? "neutral" : leanBack > 0 ? "surprised" : "thinking"}
              look={f < T6 ? 0.5 : 0.8}
              tilt={-12 * leanBack}
              headTilt={-16 * leanBack}
            />
            {f < T6 && walkOut < 0.05 ? <Clipboard x={tickX + 46} y={1000 - 116} size={46} rotate={-12} /> : null}
          </g>
        ) : null}
      </Layer>
      <Layer depth={0}>
        {f < T2 ? <Kicker x={90} y={110} text="— THE LADDER, IN ONE PICTURE" color={C.moonRim} size={26} /> : null}
        {f >= T2 && f < T3 ? (
          <g>
            <Readout x={80} y={110} value={READ.moonKm.value! /* #1 A */} k={lin(f, T2 + 2, T2 + 40)} unit="KM" size={88} w={660} plate={F.shadow} appear={lin(f, T2, T2 + 10)} who="7-02 today" />
            <FlipTag x={420} y={290} word="MEASURED" f={f} swing={10} drop={ez(f, T2 + 6, T2 + 18)} flip={flipFor(f, T2 + 18, 15)} prev="MEASURED" cord={60} />
          </g>
        ) : null}
        {f >= T3 && f < T4 ? (
          <g>
            <Readout x={80} y={110} value={READ.geoKm.value! /* #13 A */} k={lin(f, T3 + 4, T3 + 60)} unit="KM" size={88} w={660} plate={F.shadow} appear={lin(f, T3, T3 + 10)} who="7-03 geo" />
            <Plate x={80} y={270} w={560} h={96} color={F.shadow} opacity={0.82} />
            <Label x={110} y={308} text="ABOUT" size={24} color={C.amber} />
            {f >= T3 + 40 ? <RollInt x={210} y={342} value={READ.pull760.value! /* #10 C 758 */} k={lin(f, T3 + 40, T3 + 80)} unit="TIMES" size={56} who="7-03 pull" /> : null}
            <OurSumPill x={660} y={318} appear={lin(f, T3 + 40, T3 + 50)} />
          </g>
        ) : null}
        {f >= T4 && f < T5 ? (
          <g>
            <Readout x={80} y={110} value={READ.fluidKm.value! /* #7 C */} k={lin(f, T4 + 4, T4 + 50)} unit="KM" size={88} w={600} plate={F.shadow} appear={lin(f, T4, T4 + 10)} who="7-04 fluid" />
            <FlipTag x={420} y={290} word="MODEL" f={f} swing={12} drop={ez(f, T4 + 4, T4 + 16)} flip={flipFor(f, T4 + 16, 15)} prev="MODEL" cord={60} />
          </g>
        ) : null}
        {f >= T5 && f < T6 ? (
          <g>
            <OurSumPill x={96} y={100} appear={lin(f, T5, T5 + 10)} />
            <Readout x={80} y={130} value={READ.pull9000.value! /* #10 C 9,146 */} k={lin(f, T5 + 20, T5 + 50)} pre="ABOUT" unit="TIMES" size={80} w={620} plate={F.shadow} appear={lin(f, T5, T5 + 10)} who="7-05 nine thousand" />
          </g>
        ) : null}
        {f >= T6 ? (
          <g>
            <OurSumPill x={96} y={100} appear={lin(f, T6, T6 + 10)} />
            <Readout x={80} y={130} value={READ.pull66k.value! /* #10 C 66,417 */} k={lin(f, T6 + 20, T6 + 60)} pre="ABOUT" unit="TIMES" size={80} w={680} plate={F.shadow} appear={lin(f, T6, T6 + 10)} who="7-06 sixty-six thousand" />
          </g>
        ) : null}
      </Layer>
    </Stage>
  );
};
// ===============================================================================================================
// 7-07 · dark: the token sits at the foot of the rail; the last bar rises in gold out of the top of the frame and the camera
// tilts up after it (cam 540 → -1100, the rail streams down); ABOUT 92,000 TIMES + OUR SUM.
// ===============================================================================================================
const Shot707: ShotFC<C07> = ({ f, len }) => {
  const t = ez(f, 0, len * 0.92);
  const barTop = 1000 - 2400 * t;
  const camY = Math.min(540, barTop + 380);
  return (
    <Pop f={f}>
      <Stage theme={ABY.theme} cam={{ x: 960, y: camY, zoom: 1 }} vignette={0.22} grain={0.5}>
        <Layer depth={0.1}>
          <NightSky />
        </Layer>
        <Layer depth={0.35}>
          <StarsTint18 f={f} x={-400} y={-2200} w={2720} h={3600} n={200} speed={4} angle={90} seed={15} />
        </Layer>
        <Layer depth={1}>
          <DistGauge f={f} family={ABY} center={1500} decade={420} x={1420} top={-2200} bottom={1040} token={400} tokenR={36} speed={14} lit={["station"]} />
          <Bloom x={760} y={barTop} r={360} color={C.gold} strength={0.45} />
          <PullBar x={680} y={1000} h={2400} t={t} f={f} w={170} color={C.gold} />
          <Bloom x={1420} y={railY(400, 1500, 420)} r={200} color={C.amber} strength={0.4} />
        </Layer>
        <Layer depth={0}>
          <OurSumPill x={96} y={100} appear={lin(f, 2, 12)} />
          <Readout x={80} y={130} value={READ.pull92k.value! /* #10 C 91,960 */} k={lin(f, 6, len * 0.85)} pre="ABOUT" unit="TIMES" size={84} w={700} appear={lin(f, 0, 8)} who="7-07 ninety-two thousand" />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-08 · the lit rail, full: beside each mark its pull tag; a reading head runs down the rail (9 px/f) and an OUR SUM pill
// slams on each sum as the head reaches it (TODAY ×1 is the reference, not a sum); the hatch streams 12 px/f.
// ===============================================================================================================
const ROWS: { m: MarkId; text: string }[] = [
  { m: "today", text: "×1" },
  { m: "geo", text: "×760" }, // #10 C
  { m: "fluid", text: "×9,000" }, // #10 C
  { m: "stiff", text: "×66,000" }, // #10 C
  { m: "station", text: "×92,000" }, // #10 C
];
const Shot708: ShotFC<C07> = ({ f }) => {
  const center = 12400;
  const decade = 300;
  const y0 = railY(MARKS.today.km, center, decade);
  const y1 = railY(MARKS.station.km, center, decade);
  const speed = 9;
  return (
    <Pop f={f}>
      <Stage theme={GAU.theme} shotFrame={f} drift={{ zoom: 1.05, panX: -0.006, panY: 0, frames: 140, seed: 32 }} vignette={0.14} grain={0.5}>
        <Layer depth={0.1}>
          <FamSky name="gauge" />
        </Layer>
        <Layer depth={1}>
          <DistGauge f={f} family={GAU} center={center} decade={decade} x={1500} speed={12} lit={ORDER} />
          <ReadHead x0={1500} y0={y0} x1={1500} y1={y1} f={f} speed={speed} r={14} />
          {ROWS.map((r, i) => {
            const y = railY(MARKS[r.m].km, center, decade);
            const hit = Math.round((y - y0) / speed);
            return (
              <g key={r.m}>
                <line x1={1180} y1={y} x2={1440} y2={y} stroke={C.amber} strokeWidth={3} strokeDasharray="10 8" strokeDashoffset={-f * 2} />
                <Plate x={860} y={y - 42} w={300} h={84} color={GAU.shadow} opacity={0.85} />
                <Num x={1130} y={y + 20} text={r.text} size={56} align="end" who="7-08 row" />
                {i > 0 ? (
                  <Slam age={f - hit} x={640} y={y}>
                    <OurSumPill x={560} y={y} size={24} />
                  </Slam>
                ) : (
                  <Label x={700} y={y + 9} text="TODAY" size={26} color={C.ink} align="middle" />
                )}
              </g>
            );
          })}
        </Layer>
        <Layer depth={1.2}>
          <Motes frame={f} n={14} w={1920} h={1080} color="#FFE7A0" seed={6} size={3} drift={20} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-09 · two big placards, MEASURED and MODEL, swing (6 deg/f) and spin on their cords; a vermilion "?" bobs between them;
// Tick (≥ 40 % of the frame) looks from one to the other.
// ===============================================================================================================
const Shot709: ShotFC<C07> = ({ f }) => {
  const look = Math.sin(f * 0.09);
  return (
    <Pop f={f}>
      <Stage theme={GAU.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0, panY: 0.004, frames: 100, seed: 33 }} vignette={0.14} grain={0.5}>
        <Layer depth={0.1}>
          <FamSky name="gauge" />
          <Bloom x={960} y={200} r={700} color="#FFD27A" strength={0.35} />
        </Layer>
        <Layer depth={0.5}>
          <g opacity={0.55}>
            <DistGauge f={f} family={GAU} center={12400} decade={300} x={1820} speed={14} labels={false} numerals={false} />
            <DistGauge f={f} family={GAU} center={12400} decade={300} x={100} speed={-14} labels={false} numerals={false} />
          </g>
        </Layer>
        <Layer depth={1}>
          <FlipTag x={520} y={30} word="MEASURED" prev="MEASURED" f={f} swing={18} flip={Math.min(1, fr(f / 60) / 0.3)} size={1.7} cord={150} />
          <FlipTag x={1400} y={30} word="MODEL" prev="MODEL" f={f + 17} swing={18} flip={Math.min(1, fr((f + 30) / 60) / 0.3)} size={1.7} cord={150} />
          <QuestionTag x={960} y={330} f={f} size={110} />
          <rect x={-200} y={1040} width={2320} height={300} fill={GAU.near} />
          <rect x={-200} y={1040} width={2320} height={8} fill={alpha(C.amber, 0.7)} />
          <Tick x={960} y={1044} pxPerM={262} frame={f} facing={look > 0 ? 1 : -1} pose="think" expression="thinking" look={0.6 + 0.3 * Math.abs(look)} headTilt={8 * look} />
        </Layer>
        <Layer depth={1.2}>
          <Motes frame={f} n={14} w={1920} h={1080} color="#FFE7A0" seed={9} size={3} drift={20} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================

export const SceneL07: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL07(t);
  const shots: ShotDef<C07>[] = [
    { from: 0, S: Ladder, id: "7-01" }, // + 7-02 … 7-06 (PUSH / SLIDE: one rail, one camera)
    { from: c.s707, S: Shot707, id: "7-07" },
    { from: c.s708, S: Shot708, id: "7-08" },
    { from: c.s709, S: Shot709, id: "7-09" },
  ];
  return playShots(f, shots, c, c.end);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL07 = (t: SceneTiming): Cue[] => {
  const c = cuesL07(t);
  const run = (at: number, n: number, gap = 5, vol = 0.05): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 6 }));
  return [
    ...cutHit(0),
    { at: 2, file: SFX.swirl, vol: 0.16, dur: 60 },
    ...run(18, 5, 10, 0.06),
    { at: c.s702 + 18, file: SFX.click, vol: 0.12, dur: 8 },
    { at: c.s703 + 4, file: SFX.whoosh, vol: 0.12, dur: 50 },
    { at: c.s703 + 40, file: SFX.click, vol: 0.1, dur: 8 },
    { at: c.s704 + 4, file: SFX.whoosh, vol: 0.12, dur: 50 },
    { at: c.s704 + 16, file: SFX.click, vol: 0.12, dur: 8 },
    ...run(c.s705 + 2, 3, 10, 0.08),
    { at: c.s705 + 20, file: SFX.boom, vol: 0.16, dur: 80, fadeOut: 30 },
    { at: c.s706 + 20, file: SFX.boom, vol: 0.22, dur: 100, fadeOut: 30 },
    ...cutHit(c.s707),
    { at: c.s707 + 4, file: SFX.boom, vol: 0.26, dur: 110, fadeOut: 40 },
    ...cutHit(c.s708),
    ...[32, 44, 54, 99].map((k) => ({ at: c.s708 + k, file: SFX.click, vol: 0.1, dur: 8 })),
    ...cutHit(c.s709),
    { at: c.s709 + 4, file: SFX.pop, vol: 0.16, dur: 20 },
  ];
};
