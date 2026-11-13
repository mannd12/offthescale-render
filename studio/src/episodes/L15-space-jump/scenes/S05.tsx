// L15 scene l05 "The villain" (storyboard §3 "5 ·", shots 5-01…5-17, script lines 39-47; void → petrol → STUDIO_SET →
// ember → void → petrol). ShotDefs (hard cuts; continuous rows are phases): 5-01 (BlackBeat 8 f first) · 5-02 · 5-03 ·
// 5-04 · 5-05 · 5-06 · 5-07 · 5-08 · 5-09 · 5-10 · 5-11 · 5-12 · 5-13 · 5-14+5-15 (the l05:7 hold) · 5-16 · 5-17.
// Numbers drawn, each with its sources.md row (all from jumpdata.ts): 13 s flat spin (#4) · 1960, 2014 (#7, #8 years) ·
// < 4 g · 40 km, 89 g · 20 km (#11 AIR_READ, ATM rows) · ×22 (#12 RATIOS.d20over40Shown) · ≈ 5× WEIGHT, 20 km (#20
// MODEL.pushPeakShown, OUR MODEL chip, F5) · MAIN CHUTE ~2.5 km (#4). NO number for the spin's start (row 6, F3: "early
// in the fall"), none for the drogue choice (row 6: words only). The three record traces (5-16) are drawn as the same
// generic shape in separate lanes: no speed is scaled or compared (Kittinger's speed is not shown, F4). F1: the probe
// spins; silhouettes only in 5-03 and 5-07 (≤ 120 px, no face, whole-shape moves).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bloom, Embers, IF2, Kicker, Layer, Motes, Sky, Stage, Tick, alpha, cameraAt, impact, mixHex } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { L15_COLORS, familyOf } from "../families";
import { AIR_READ, ATM, JUMPS, MODEL, RATIOS, atmAt, modelAltAt, modelSpeedAt, pushAt } from "../jumpdata";
import { L15Gauges, L15GaugesHUD, PushGauge, SpeedGauge, airValue, type GaugeId } from "../L15Gauges";
import { AirCube, Chute, Jumper, Probe, Seesaw, Spiral, Trace } from "../props";
import { AltRuler, altY } from "../sky";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { Arrow, C, FlowStreaks, INDIGO, ModelChip, Perch, Pop, SkyBack, Slab, StudioSet, XTag, cl01, ez, lerp, lin, rollText } from "./b-parts";

const PET = familyOf("petrol");
const VOID = familyOf("void");
const STU = familyOf("studio");
const EMB = familyOf("ember");
const B = JUMPS.baumgartner; // #4
const KM20 = ATM[2].km; // #11
const KM40 = ATM[4].km; // #11
const V = L15_COLORS.vermilion;

export const cuesL05 = (t: SceneTiming) => {
  const { at, p, frac } = cueKit(t);
  return {
    villain: 0, // 5-01
    spin: at(1), // 5-02
    early: p(1, "A jumper falling"), // 5-03
    flat: at(2), // 5-04
    drogue: p(2, "A stabiliser parachute"), // 5-05
    choice: at(3), // 5-06
    used: p(3, "The other two"), // 5-07
    airItself: at(4), // 5-08
    thicker: p(4, "From forty kilometres"), // 5-09
    depends: p(4, "Push depends"), // 5-10
    race: at(5), // 5-11
    braking: at(6), // 5-12
    peak: p(6, "In our model"), // 5-13
    nothing: at(7), // 5-14
    turn: frac(7, 0.95), // 5-15 (phase, in the 1.5-s hold)
    records: at(8), // 5-16
    main: p(8, "A parachute opened"), // 5-17
  };
};
export type CL05 = ReturnType<typeof cuesL05>;

// Lifted to deep saturated indigo (probe fix round); `black` keeps the true black for the villain's first beat.
const VoidBack: React.FC<{ f: number; drift?: number; seed?: number; black?: boolean }> = ({ f, drift = 0.6, seed = 3, black = false }) => (
  <g>
    {black ? <SkyBack f={f} altTop={112} altBottom={88} drift={drift} ruler={false} bands={false} seed={seed} /> : <Sky stops={INDIGO} />}
    {black ? null : <Motes frame={f} n={40} x={-200} y={0} w={2300} h={1080} color={alpha(C.starTeal, 0.85)} seed={seed} size={4} drift={30} />}
    <FlowStreaks f={f} speed={9} color={black ? C.starTeal : C.limb} opacity={black ? 0.22 : 0.3} seed={seed} />
  </g>
);

// ===============================================================================================================
// 5-01 · BlackBeat 8 f, then the scene darkens: a thin spiral orbits the capsule, two question tags pop in (1, 2); Tick
// steps back. MOVER: spiral rotating (4°/f, tip ≈ 14 px/f) + tags popping. DARK.
// ===============================================================================================================
const Tag: React.FC<{ x: number; y: number; n: string; age: number }> = ({ x, y, n, age }) => {
  if (age < 0) return null;
  const s = 1 + 0.5 * Math.pow(1 - cl01(age / 10), 2);
  return (
    <g transform={`translate(${x} ${y}) scale(${s * cl01(age / 4)})`}>
      <circle r={46} fill={V} stroke={C.bone} strokeWidth={4} />
      <text y={20} textAnchor="middle" style={{ fontFamily: IF2.display, fontWeight: 800, fontSize: 58, fill: "#FFF4E6" }}>
        {n}
      </text>
    </g>
  );
};
const ShotVillain: ShotFC<CL05> = ({ f, len }) => {
  const back = ez(f, 30, 46);
  return (
    <AbsoluteFill>
      <Stage theme={VOID.theme} shotFrame={f} drift={{ zoom: 1.12, panX: 0.02, panY: 0.01, frames: len + 30, seed: 1 }} vignette={0.35} grain={0.4}>
        <Layer depth={1}>
          <VoidBack f={f} black />
          <Bloom x={700} y={520} r={420} color={V} strength={0.3} />
          <Spiral x={700} y={520} r={340} f={f} speed={4} width={11} />
          <Probe x={700} y={520} size={150} f={f} variant="float" tilt={20} />
          <Tag x={430} y={250} n="1" age={f - 34} />
          <Tag x={970} y={250} n="2" age={f - 52} />
        </Layer>
        <Layer depth={0}>
          <Kicker x={110} y={110} text="The villain" color={VOID.text} size={32} />
          <Perch x={1300 + 50 * back} y={1000} f={f} pose="stand" poseTo="shield" poseT={back} expression="worried" expressionTo="scared" expressionT={back} facing={-1} look={0.3} />
        </Layer>
      </Stage>
      <AbsoluteFill style={{ background: "#000", opacity: f < 8 ? 1 : 1 - cl01((f - 8) / 8) }} />
    </AbsoluteFill>
  );
};

// 5-02 · the probe tumbles with the spiral wrapped round it; SPIN. MOVER: probe tumbling (5°/f) + spiral + orbit cam.
const ShotSpin: ShotFC<CL05> = ({ f }) => {
  const cam = { x: 960 + Math.sin(f / 26) * 90, y: 540 + Math.cos(f / 26) * 40, zoom: 1.12 };
  return (
    <Pop f={f}>
      <Stage theme={VOID.theme} cam={cam} vignette={0.35} grain={0.4}>
        <Layer depth={1}>
          <VoidBack f={f} seed={5} />
          <Bloom x={720} y={540} r={320} color={L15_COLORS.meso} strength={0.4} />
          <Spiral x={720} y={540} r={380} f={f} speed={-4} width={10} />
          <Probe x={720} y={540} size={190} f={f} variant="spin" spinRate={5} />
        </Layer>
        <Layer depth={0}>
          <XTag x={110} y={110} text="SPIN" F={VOID} dot={V} size={40} />
          <Perch x={1320} y={1000} f={f} pose="point" expression="determined" facing={-1} look={0.2} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// 5-03 · a tiny suited silhouette spins above a fall timeline; a flag lands early on the bar (NO numeral, row 6).
// MOVER: silhouette spinning + flag dropping (≈ 20 px/f) + bar ticks scrolling (6 px/f). DARK.
const ShotEarly: ShotFC<CL05> = ({ f, len }) => {
  const fy = lerp(-120, 760, ez(f, 24, 66));
  const land = f - 66;
  return (
    <Pop f={f}>
      <Stage theme={VOID.theme} shotFrame={f} drift={{ zoom: 1.08, panX: 0.03, panY: 0.0, frames: len + 30, seed: 3 }} vignette={0.35} grain={0.4}>
        <Layer depth={1}>
          <VoidBack f={f} seed={7} />
          <Bloom x={640} y={520} r={260} color={C.limb} strength={0.2} />
          <Jumper x={640} y={600} h={116} f={f} pose="spin" spinRate={8} color={C.teal} />
          <rect x={140} y={760} width={1240} height={22} rx={11} fill={alpha("#04121A", 0.8)} stroke={C.bone} strokeWidth={2} />
          <g>
            {Array.from({ length: 36 }, (_, i) => {
              const x = 140 + ((((i * 40 - f * 6) % 1440) + 1440) % 1440);
              return x < 1380 ? <line key={i} x1={x} y1={786} x2={x} y2={i % 5 === 0 ? 820 : 802} stroke={alpha(C.bone, 0.7)} strokeWidth={3} /> : null;
            })}
          </g>
          <text x={140} y={870} style={{ fontFamily: IF2.label, fontSize: 22, letterSpacing: 3, fill: alpha(C.bone, 0.8) }}>
            START OF THE FALL
          </text>
          <text x={1380} y={870} textAnchor="end" style={{ fontFamily: IF2.label, fontSize: 22, letterSpacing: 3, fill: alpha(C.bone, 0.8) }}>
            TIME →
          </text>
          <g transform={`translate(330 ${fy})`}>
            <line x1={0} y1={0} x2={0} y2={-120} stroke={C.bone} strokeWidth={5} />
            <path d="M0 -120 L90 -100 L0 -80 Z" fill={C.saffron} />
          </g>
          {land >= 0 && land < 14 ? <circle cx={330} cy={770} r={20 + land * 5} fill="none" stroke={C.saffronCore} strokeWidth={4} opacity={1 - land / 14} /> : null}
        </Layer>
        <Layer depth={0}>
          <XTag x={110} y={110} text="EARLY IN THE FALL" F={VOID} dot={C.saffron} size={34} opacity={ez(f, 60, 72)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// 5-04 · a flat disc spins while a counter counts to 13 s (FLAT SPIN). MOVER: disc spokes (6°/f, edge ≈ 30 px/f) + counter.
const ShotFlat: ShotFC<CL05> = ({ f, len }) => {
  const k = ez(f, 8, len - 20);
  const cx = 660;
  const cy = 600;
  const rx = 380;
  const ry = 120;
  return (
    <Pop f={f}>
      <Stage theme={PET.theme} shotFrame={f} drift={{ zoom: 1.1, panX: 0.03, panY: 0.01, frames: len + 30, seed: 4 }} vignette={0.25} grain={0.4}>
        <Layer depth={1}>
          <Sky stops={[mixHex(PET.sky[0], "#04121A", 0.3), PET.sky[0], PET.sky[1]]} />
          <FlowStreaks f={f} speed={10} color={PET.light} opacity={0.3} />
          <Motes frame={f} n={26} x={-200} y={0} w={2300} h={1080} color={alpha(C.bone, 0.7)} seed={4} size={4} drift={30} />
          <ellipse cx={cx} cy={cy + 26} rx={rx} ry={ry} fill={alpha("#04121A", 0.5)} />
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={mixHex(L15_COLORS.meso, "#04121A", 0.3)} stroke={C.limb} strokeWidth={5} />
          {Array.from({ length: 8 }, (_, i) => {
            const a = ((f * 6 + i * 45) * Math.PI) / 180;
            return <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(a) * rx} y2={cy + Math.sin(a) * ry} stroke={i % 2 ? C.saffron : C.bone} strokeWidth={i % 2 ? 6 : 3} />;
          })}
          <Probe x={cx} y={cy - 70} size={120} f={f} variant="plain" tilt={90 + Math.sin((f * 6 * Math.PI) / 180) * 30} lamp={false} />
          <Arrow x1={cx + rx + 20} y1={cy} x2={cx + rx - 10} y2={cy - 60} color={C.saffronCore} w={10} head={28} />
        </Layer>
        <Layer depth={0}>
          <Slab x={1150} y={360} value={rollText(B.flatSpinS /* #4 */, k)} unit="s" size={150} F={PET} />
          <XTag x={1150} y={520} text="FLAT SPIN" F={PET} dot={C.saffron} size={36} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// 5-05 · the drogue opens on the probe's line; a ceiling bar drops over the SPEED needle; the spin slows.
// MOVER: canopy inflating (≈ 12 px/f) + ceiling bar (≈ 24 px/f) + spiral slowing.
const ShotDrogue: ShotFC<CL05> = ({ f, len }) => {
  let ang = 0;
  for (let i = 0; i < f; i++) ang += 5 * (1 - 0.85 * ez(i, 20, 70));
  const open = ez(f, 8, 44);
  const bar = lerp(-80, 196, ez(f, 34, 46));
  const px = 620;
  const py = 700;
  return (
    <Pop f={f}>
      <Stage theme={PET.theme} shotFrame={f} drift={{ zoom: 1.08, panX: -0.02, panY: 0.01, frames: len + 30, seed: 5 }} vignette={0.25} grain={0.4}>
        <Layer depth={1}>
          <Sky stops={[mixHex(PET.sky[0], "#04121A", 0.3), PET.sky[0], PET.sky[1]]} />
          <FlowStreaks f={f} speed={10} color={PET.light} opacity={0.3} />
          <Motes frame={f} n={26} x={-200} y={0} w={2300} h={1080} color={alpha(C.bone, 0.7)} seed={6} size={4} drift={30} />
          <g transform={`rotate(${-ang * 0.8} ${px} ${py})`}>
            <Spiral x={px} y={py} r={200} f={0} speed={0} width={7} opacity={0.75 * (1 - 0.6 * ez(f, 20, 80))} />
          </g>
          <g transform={`rotate(${ang} ${px} ${py})`}>
            <Probe x={px} y={py} size={150} f={f} lamp={false} />
          </g>
          <line x1={px} y1={py - 90} x2={px} y2={py - 260} stroke={C.bone} strokeWidth={3} opacity={open} />
          <Chute x={px} y={py - 250} size={150} f={f} open={open} kind="drogue" />
        </Layer>
        <Layer depth={0}>
          <XTag x={110} y={980} text="LESS SPIN · LOWER TOP SPEED" F={PET} dot={C.saffron} size={32} opacity={ez(f, 40, 52)} />
          <Perch x={1320} y={1000} f={f} pose="heave" expression="happy" facing={-1} look={0.3} />
          <L15GaugesHUD family={PET} frame={f} theme="dark" only={["speed"]} speed={{ value: lerp(0.95, 0.55, ez(f, 44, 80)) }} />
          <g>
            <rect x={1480} y={bar} width={400} height={14} rx={7} fill={C.saffron} />
            <rect x={1480} y={bar - 40} width={400} height={40} fill={alpha(C.saffron, 0.18)} />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

// 5-06 · STUDIO: a seesaw, SPEED RECORD on one end, SAFETY NET on the other; it tips to the record (Tick's thumb).
// MOVER: seesaw tipping (end ≈ 9 px/f) + Tick pumping it. Row 6 secondary: words only.
const ShotSeesaw: ShotFC<CL05> = ({ f, len }) => {
  const g = Math.max(0, f - 44);
  const tilt = 8 - 22 * ez(f, 18, 44) + (f > 44 ? 5 * Math.sin(g / 5) * Math.exp(-g / 30) : 0) + 6 * Math.sin(f / 7);
  const a = (tilt * Math.PI) / 180;
  const lx = 700 - Math.cos(a) * 900 * 0.45;
  return (
    <Pop f={f}>
      <Stage theme={STU.theme} shotFrame={f} drift={{ zoom: 1.15, panX: 0.03, panY: 0.02, frames: len + 20, seed: 6 }} vignette={0.12} grain={0.4}>
        <StudioSet f={f + 200} seed={11}>
          <Seesaw
            x={700}
            y={760}
            len={900}
            tilt={tilt}
            left={<XTag x={0} y={-60} text="SPEED RECORD" F={PET} dot={V} size={32} align="middle" />}
            right={<XTag x={0} y={-60} text="SAFETY NET" F={PET} dot={C.teal} size={32} align="middle" />}
          />
          <Tick x={lx - 270} y={860} pxPerM={150} frame={f} facing={1} pose="press" expression="proud" look={0.2} squash={impact(f % 28, 0, 0.06, 10)} />
        </StudioSet>
      </Stage>
    </Pop>
  );
};

// 5-07 · STUDIO: two small silhouettes each open a stabiliser canopy and steady (1960, 2014).
// MOVER: canopies inflating (≈ 12 px/f, staggered) + silhouettes steadying + slow descent.
const ShotUsed: ShotFC<CL05> = ({ f, len }) => {
  const one = (x: number, start: number, year: number, col: string) => {
    const g = f - start;
    const open = ez(g, 0, 30);
    const sway = 18 * Math.exp(-Math.max(0, g) / 26) * Math.sin(Math.max(0, g) / 4);
    const y = 360 + f * 1.2;
    return (
      <g>
        <g transform={`rotate(${sway} ${x} ${y})`}>
          <Chute x={x} y={y} size={150} f={f} open={open} kind="drogue" />
          <Jumper x={x} y={y + 6} h={110} f={f} pose="hang" color={col} />
        </g>
        <XTag x={x} y={860} text={`${year}`} F={PET} dot={C.saffron} size={34} align="middle" opacity={ez(g, 10, 22)} />
      </g>
    );
  };
  return (
    <Pop f={f}>
      <Stage theme={STU.theme} shotFrame={f} drift={{ zoom: 1.12, panX: -0.03, panY: 0.02, frames: len + 20, seed: 7 }} vignette={0.12} grain={0.4}>
        <StudioSet f={f + 300} seed={12}>
          <FlowStreaks f={f} speed={8} color="#FFFFFF" opacity={0.35} seed={12} />
          {one(500, 6, JUMPS.kittinger.year /* #7 */, C.teal)}
          {one(1000, 26, JUMPS.eustace.year /* #8 */, C.saffron)}
        </StudioSet>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// Ember density ruler (5-08 … 5-11): lit from below, the air as heat.
// ===============================================================================================================
const EmberBack: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <Sky family={EMB} />
    <FlowStreaks f={f} speed={8} color={C.saffronCore} opacity={0.22} dir={-1} seed={6} />
    <Bloom x={760} y={1180} r={820} color={EMB.light} strength={0.55} />
    <Embers frame={f} x0={-100} x1={2000} y={1120} n={46} color={C.saffronCore} seed={4} />
  </g>
);

// 5-08 · the ruler descends; tags < 4 g · 40 km and 89 g · 20 km ride past; Tick warms its hands at the glow.
const ShotAirItself: ShotFC<CL05> = ({ f, len }) => {
  const centre = 50 - 34 * lin(f, 0, len);
  const top = centre + 11;
  const bot = centre - 11;
  const Y = (a: number) => altY(a, top, bot);
  const tags = [
    { km: KM40, text: (k: number) => `< ${rollText(AIR_READ.at40g, k)} g · ${KM40} km`, n: 1 }, // #11 #12
    { km: KM20, text: (k: number) => `${rollText(AIR_READ.at20g, k)} g · ${KM20} km`, n: 7 }, // #11
  ];
  return (
    <Pop f={f}>
      <Stage theme={EMB.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0.02, panY: 0.0, frames: len + 30, seed: 8 }} vignette={0.25} grain={0.4}>
        <Layer depth={1}>
          <EmberBack f={f} />
          <AltRuler f={f} altTop={top} altBottom={bot} x={140} flags={false} color={C.saffronCore} />
          {tags.map((q, i) => {
            const y = Y(q.km);
            const k = cl01((900 - y) / 300);
            return (
              <g key={i}>
                <line x1={150} y1={y} x2={560} y2={y} stroke={C.saffron} strokeWidth={4} strokeDasharray="10 8" />
                <AirCube x={300} y={y + 24} size={130} n={q.n} f={f} speed={5} color={C.saffronCore} glass={C.saffron} seed={30 + i} />
                <XTag x={580} y={y} text={q.text(k)} F={EMB} dot={C.saffron} size={34} />
              </g>
            );
          })}
          <rect x={-400} y={1000} width={2720} height={400} fill={mixHex(EMB.sky[0], "#000", 0.3)} />
          <Tick x={1180} y={1004} pxPerM={120} frame={f} facing={-1} pose="crouch-reach" expression="worried" look={0.2} />
        </Layer>
        <Layer depth={0}>
          <Kicker x={110} y={110} text="The air itself" color={EMB.text} size={30} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// 5-09 · a bracket arrow from 40 km down to 20 km; counter to ×22. MOVER: arrow drawing (≈ 7 px/f) + counter + push.
const ShotThicker: ShotFC<CL05> = ({ f, len }) => {
  const top = 50;
  const bot = 10;
  const Y = (a: number) => altY(a, top, bot);
  const d = ez(f, 4, 80);
  const k = ez(f, 60, 100);
  return (
    <Pop f={f}>
      <Stage theme={EMB.theme} shotFrame={f} drift={{ zoom: 1.14, panX: 0.03, panY: 0.02, frames: len + 20, seed: 9 }} vignette={0.25} grain={0.4}>
        <Layer depth={1}>
          <EmberBack f={f} />
          <AltRuler f={f} altTop={top} altBottom={bot} x={140} flags={false} color={C.saffronCore} />
          <AirCube x={300} y={Y(KM40) - 70} size={140} n={1} f={f} speed={5} color={C.saffronCore} glass={C.saffron} seed={41} />
          <AirCube x={300} y={Y(KM20) - 70} size={140} n={22} f={f} speed={5} color={C.saffronCore} glass={C.saffron} seed={42} />
          <Arrow x1={620} y1={Y(KM40)} x2={620} y2={lerp(Y(KM40) + 4, Y(KM20), d)} color={C.saffronCore} w={16} head={44} />
          <line x1={560} y1={Y(KM40)} x2={680} y2={Y(KM40)} stroke={C.saffron} strokeWidth={6} />
          <line x1={560} y1={Y(KM20)} x2={680} y2={Y(KM20)} stroke={C.saffron} strokeWidth={6} opacity={d} />
        </Layer>
        <Layer depth={0}>
          <Slab x={820} y={600} value={`×${rollText(RATIOS.d20over40Shown /* #12 */, k)}`} size={170} F={EMB} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// 5-10 · the card: PUSH = AIR × SPEED²; the terms light in sequence, connectors draw; Tick points at each.
const ShotEquation: ShotFC<CL05> = ({ f, len }) => {
  const box = (x: number, w: number, label: string, on: number, child?: React.ReactNode) => (
    <g>
      <rect x={x} y={330} width={w} height={300} rx={30} fill={on > 0.5 ? mixHex(C.saffron, EMB.sky[1], 0.15) : alpha("#04121A", 0.75)} stroke={C.saffron} strokeWidth={4} />
      {child}
      <text x={x + w / 2} y={600} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 40, letterSpacing: 4, fill: on > 0.5 ? "#1A1206" : C.bone }}>
        {label}
      </text>
    </g>
  );
  const a1 = ez(f, 10, 16);
  const a2 = ez(f, 30, 36);
  const a3 = ez(f, 56, 62);
  const conn = cl01((f - 36) / 22);
  const look = f < 30 ? 0.2 : f < 56 ? 0.6 : 1;
  return (
    <Pop f={f}>
      <Stage theme={EMB.theme} shotFrame={f} drift={{ zoom: 1.1, panX: 0.03, panY: 0.01, frames: len + 30, seed: 10 }} vignette={0.25} grain={0.4}>
        <Layer depth={1}>
          <EmberBack f={f} />
          {box(110, 300, "PUSH", a3, <Arrow x1={260} y1={540} x2={260} y2={540 - 160 * a3} color={V} w={20} head={44} />)}
          <text x={445} y={505} style={{ fontFamily: IF2.display, fontWeight: 800, fontSize: 90, fill: C.bone }}>
            =
          </text>
          {box(520, 280, "AIR", a1, <AirCube x={600} y={360} size={130} n={30} f={f} speed={5} color={C.saffronCore} glass={C.saffron} seed={51} />)}
          <text x={828} y={505} style={{ fontFamily: IF2.display, fontWeight: 800, fontSize: 80, fill: C.bone }}>
            ×
          </text>
          {box(900, 360, "SPEED²", a2, <Arrow x1={960} y1={450} x2={960 + 240 * a2} y2={450} color={C.limb} w={18} head={40} />)}
          <path d="M660 640 L660 760 L260 760 L260 640" pathLength={1} fill="none" stroke={C.saffronCore} strokeWidth={6} strokeLinejoin="round" strokeDasharray={`${conn} 1`} opacity={conn > 0 ? 1 : 0} />
          <path d="M1080 640 L1080 800 L230 800 L230 640" pathLength={1} fill="none" stroke={C.saffronCore} strokeWidth={6} strokeLinejoin="round" strokeDasharray={`${conn} 1`} opacity={conn > 0 ? 1 : 0} />
          <rect x={-400} y={1000} width={2720} height={400} fill={mixHex(EMB.sky[0], "#000", 0.3)} />
          <Tick x={1400} y={1004} pxPerM={130} frame={f} facing={-1} pose="point" expression="proud" look={look} squash={impact(f, 30, 0.06, 8)} />
        </Layer>
        <Layer depth={0}>
          <XTag x={110} y={180} text="PUSH = AIR × SPEED²" F={EMB} dot={C.saffron} size={36} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// 5-11 · two curves race up: SPEED straight and slow, PUSH curving up steeply. MOVER: two heads (≈ 16 and 24 px/f) + pan.
const ShotRace: ShotFC<CL05> = ({ f, len }) => {
  const h = lin(f, 2, len - 8);
  const sp: [number, number][] = Array.from({ length: 21 }, (_, i) => [200 + i * 55, 900 - i * 14]);
  const pu: [number, number][] = Array.from({ length: 21 }, (_, i) => [200 + i * 50, 900 - 780 * Math.pow(i / 20, 2.2)]);
  const cam = cameraAt(f, [
    { f: 0, x: 820, y: 620, zoom: 1.12 },
    { f: len, x: 1000, y: 470, zoom: 1.08 },
  ]);
  const at = (pts: [number, number][]) => pts[Math.min(pts.length - 1, Math.round(h * (pts.length - 1)))];
  return (
    <Pop f={f}>
      <Stage theme={EMB.theme} cam={cam} vignette={0.25} grain={0.4}>
        <Layer depth={1}>
          <EmberBack f={f} />
          <line x1={190} y1={910} x2={1360} y2={910} stroke={alpha(C.bone, 0.7)} strokeWidth={3} />
          <line x1={190} y1={910} x2={190} y2={90} stroke={alpha(C.bone, 0.7)} strokeWidth={3} />
          <Trace pts={sp} head={h} f={f} color={C.limb} width={8} />
          <Trace pts={pu} head={h} f={f} color={C.saffron} width={9} />
          <XTag x={at(sp)[0] + 30} y={at(sp)[1] + 40} text="SPEED" F={EMB} dot={C.limb} size={28} opacity={h > 0.1 ? 1 : 0} />
          <XTag x={at(pu)[0] - 30} y={at(pu)[1] - 50} text="PUSH" F={EMB} dot={C.saffron} size={28} align="end" opacity={h > 0.1 ? 1 : 0} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 5-12 · void: PUSH crosses the WEIGHT line and keeps going, SPEED turns back (OUR MODEL, row 20).
// MOVER: PUSH column + beam (crossing 1) + SPEED needle reversing + push to the dial. DARK.
// ===============================================================================================================
const ShotBraking: ShotFC<CL05> = ({ f, len }) => {
  const alt = 40 - 18 * lin(f, 0, len);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: len, x: 900, y: 500, zoom: 1.15 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={VOID.theme} cam={cam} vignette={0.35} grain={0.4}>
        <Layer depth={1}>
          <VoidBack f={f} drift={2} seed={9} />
          <Bloom x={1000} y={560} r={420} color={V} strength={0.18} />
          <SpeedGauge x={110} y={300} s={{ value: modelSpeedAt(alt) / 1100, ghost: modelSpeedAt(MODEL.peakKm) / 1100 }} f={f} family={VOID} theme="light" scale={1.45} />
          <PushGauge x={780} y={180} s={{ value: pushAt(alt) }} f={f} family={VOID} theme="light" scale={2.4} />
          <line x1={780 + 152 * 2.4} y1={180 + 192 * 2.4} x2={1240} y2={180 + 192 * 2.4} stroke={C.saffron} strokeWidth={3} />
          <XTag x={1240} y={180 + 192 * 2.4} text="WEIGHT" F={VOID} dot={C.saffron} size={30} />
        </Layer>
        <Layer depth={0}>
          <ModelChip x={110} y={90} f={f} />
          <Perch x={1340} y={1000} f={f} pose="stand" poseTo="lean" poseT={ez(f, 30, 50)} expression="thinking" expressionTo="surprised" expressionT={ez(f, 40, 50)} facing={-1} look={0.6} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// 5-13 · close: the PUSH column pinned past its stop and rattling (±5° at 10 Hz); ≈ 5× WEIGHT at 20 km (row 20).
const ShotPinned: ShotFC<CL05> = ({ f, len }) => {
  const q = Math.sin((f * 2 * Math.PI) / 3);
  const k = ez(f, 4, 40);
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 540, zoom: 1.0 },
    { f: len, x: 820, y: 500, zoom: 1.2 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={VOID.theme} cam={cam} vignette={0.35} grain={0.4}>
        <Layer depth={1}>
          <VoidBack f={f} drift={2} seed={11} />
          <Bloom x={740} y={520} r={460} color={V} strength={0.28} />
          <g transform={`rotate(${f > 6 ? q * 5 : 0} 740 640)`}>
            <PushGauge x={490} y={60} s={{ value: MODEL.pushPeak, pinned: f > 6 }} f={f} family={VOID} theme="light" scale={2.9} />
          </g>
        </Layer>
        <Layer depth={0}>
          <ModelChip x={110} y={90} f={f} />
          <XTag x={1180} y={420} text={`≈ ${rollText(MODEL.pushPeakShown /* #20 */, k)}× WEIGHT`} F={VOID} dot={V} size={40} />
          <XTag x={1180} y={540} text={`${KM20} km` /* #20 pushPeakKm ≈ 20 */} F={VOID} dot={C.saffron} size={40} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// 5-14 + 5-15 · push against time: flat for the first minute and a half, then a spike (row 20); then Tick turns the
// gauge cluster toward us, the panels flipping one by one. MOVER: trace head (≈ 30 px/f) + spike → panels flipping.
const PT_X0 = 170;
const PT_W = 1180;
const PT_Y = 900;
const pushTrace: [number, number][] = Array.from({ length: 64 }, (_, i) => {
  const ts = (i / 63) * MODEL.groundS; // #20
  return [PT_X0 + (ts / MODEL.groundS) * PT_W, PT_Y - Math.min(5.4, pushAt(modelAltAt(ts))) * 125];
});
const ShotNothing: ShotFC<CL05> = ({ f, len, c }) => {
  const turn = c.turn - c.nothing;
  const head = lin(f, 4, turn - 6);
  const g = f - turn;
  const slide = ez(g, 0, 16);
  const hx = PT_X0 + head * PT_W;
  const groups: { only: GaugeId[]; dy: number; h: number }[] = [
    { only: ["speed"], dy: 0, h: 300 },
    { only: ["air", "push"], dy: 306, h: 256 },
    { only: ["cold"], dy: 568, h: 156 },
  ];
  const alt = KM20;
  const settle = g > 0 ? 0.12 * Math.exp(-g / 18) * Math.sin(g / 3) : 0;
  const CX = 620;
  const CY = 150;
  const S = 1.12;
  return (
    <Stage theme={VOID.theme} shotFrame={f} drift={{ zoom: 1.08, panX: 0.02, panY: 0.0, frames: len + 20, seed: 12 }} vignette={0.35} grain={0.4}>
      <Layer depth={1}>
        <VoidBack f={f} drift={1.5} seed={13} />
        <g transform={`translate(${-slide * 1500} 0)`}>
          <line x1={PT_X0} y1={PT_Y + 4} x2={PT_X0 + PT_W} y2={PT_Y + 4} stroke={alpha(C.bone, 0.6)} strokeWidth={3} />
          <rect x={PT_X0} y={PT_Y + 30} width={PT_W} height={20} rx={10} fill={alpha("#04121A", 0.8)} stroke={C.bone} strokeWidth={2} />
          <rect x={PT_X0} y={PT_Y + 30} width={Math.max(0, hx - PT_X0)} height={20} rx={10} fill={C.saffron} />
          <line x1={PT_X0} y1={PT_Y - 125} x2={PT_X0 + PT_W} y2={PT_Y - 125} stroke={C.saffron} strokeWidth={2} strokeDasharray="8 8" opacity={0.7} />
          <text x={PT_X0 + PT_W + 12} y={PT_Y - 117} style={{ fontFamily: IF2.label, fontSize: 18, letterSpacing: 2, fill: C.saffronCore }}>
            WEIGHT
          </text>
          <text x={PT_X0} y={PT_Y + 92} style={{ fontFamily: IF2.label, fontSize: 20, letterSpacing: 3, fill: alpha(C.bone, 0.8) }}>
            PUSH, FROM LET-GO TO THE GROUND →
          </text>
          <Trace pts={pushTrace} head={head} f={f} color={C.saffron} width={8} smooth={false} />
        </g>
      </Layer>
      <Layer depth={0}>
        {g < 4 ? <ModelChip x={110} y={90} f={f} /> : null}
        {g >= 0 ? (
          <g transform={`translate(${(1 - slide) * 1400} 0)`}>
            {groups.map((q, i) => {
              const fl = ez(g, 10 + i * 9, 22 + i * 9);
              const sx = Math.max(0.02, Math.abs(Math.cos(Math.PI * (1 - fl))));
              const front = fl >= 0.5;
              const cx = CX + 180 * S;
              return (
                <g key={i} transform={`translate(${cx} 0) scale(${sx} 1) translate(${-cx} 0)`}>
                  <g transform={`translate(${CX} ${CY + q.dy * S}) scale(${S})`}>
                    {front ? (
                      <L15Gauges
                        family={VOID}
                        frame={f}
                        theme="light"
                        x={0}
                        y={0}
                        only={q.only}
                        model={i === 0}
                        speed={{ value: modelSpeedAt(alt) / 1100 + settle }}
                        air={{ value: airValue(alt) }}
                        push={{ value: pushAt(alt) + settle * 4 }}
                        cold={{ value: atmAt(alt).tC }}
                      />
                    ) : (
                      <rect x={0} y={0} width={360} height={q.h} rx={26} fill={mixHex(C.saffronDeep, "#04121A", 0.4)} stroke={C.saffron} strokeWidth={3} />
                    )}
                  </g>
                </g>
              );
            })}
            <Perch x={420} y={1000} f={f} pose="heave" poseTo="stand" poseT={ez(g, 30, 46)} expression="determined" facing={1} look={0.5} />
          </g>
        ) : null}
      </Layer>
    </Stage>
  );
};

// 5-16 · three record traces (one lane each) rise, then fall, ending in short chute marks: A SMALLER NUMBER.
// Same generic shape in each lane: nothing is scaled to a speed. MOVER: three heads (≈ 14 px/f, staggered).
const ShotRecords: ShotFC<CL05> = ({ f, len }) => {
  const lanes = [
    { name: `KITTINGER · ${JUMPS.kittinger.year}`, y: 330, d: 0 }, // #7
    { name: `BAUMGARTNER · ${JUMPS.baumgartner.year}`, y: 610, d: 18 }, // #4
    { name: `EUSTACE · ${JUMPS.eustace.year}`, y: 890, d: 36 }, // #8
  ];
  const shape = (u: number) => (u < 0.28 ? Math.sin((u / 0.28) * (Math.PI / 2)) : 0.18 + 0.82 * Math.exp(-(u - 0.28) * 4.2));
  return (
    <Pop f={f}>
      <Stage theme={PET.theme} shotFrame={f} drift={{ zoom: 1.08, panX: 0.03, panY: 0.0, frames: len + 30, seed: 13 }} vignette={0.25} grain={0.4}>
        <Layer depth={1}>
          <Sky stops={[mixHex(PET.sky[0], "#04121A", 0.3), PET.sky[0], PET.sky[1]]} />
          <FlowStreaks f={f} speed={10} color={PET.light} opacity={0.3} />
          <Motes frame={f} n={26} x={-200} y={0} w={2300} h={1080} color={alpha(C.bone, 0.7)} seed={8} size={4} drift={30} />
          {lanes.map((l, i) => {
            const pts: [number, number][] = Array.from({ length: 40 }, (_, j) => [400 + j * 22, l.y - shape(j / 39) * 190]);
            const done = len - 26 + l.d * 0.4;
            const h = lin(f, 6 + l.d, done);
            const end = pts[pts.length - 1];
            return (
              <g key={i}>
                <line x1={400} y1={l.y + 6} x2={1280} y2={l.y + 6} stroke={alpha(C.bone, 0.45)} strokeWidth={2} />
                <text x={380} y={l.y - 10} textAnchor="end" style={{ fontFamily: IF2.label, fontSize: 22, letterSpacing: 2.5, fill: C.bone }}>
                  {l.name}
                </text>
                <Trace pts={pts} head={h} f={f} color={i === 1 ? C.saffron : C.limb} width={7} />
                {h >= 1 ? <Chute x={end[0] + 30} y={end[1] + 10} size={40} f={f} open={ez(f, done, done + 14)} kind="main" /> : null}
              </g>
            );
          })}
        </Layer>
        <Layer depth={0}>
          <XTag x={110} y={110} text="A SMALLER NUMBER" F={PET} dot={C.saffron} size={34} opacity={ez(f, 70, 82)} />
          <Perch x={1420} y={1000} f={f} pose="point" staff expression="proud" facing={-1} look={0.3 + 0.4 * Math.sin(f / 20)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// 5-17 · the trace falls to the 2.5 km mark, where the main canopy opens (MAIN CHUTE ~2.5 km, #4).
// MOVER: trace falling (≈ 10 px/f) + canopy inflating (≈ 14 px/f).
const ShotMain: ShotFC<CL05> = ({ f, len }) => {
  const top = 9.5;
  const bot = -0.6;
  const Y = (a: number) => altY(a, top, bot);
  const ck = B.chuteKm; // #4
  const pts: [number, number][] = [];
  for (let i = 0; i <= 30; i++) {
    const u = i / 30;
    const a = lerp(top + 0.3, ck, u);
    pts.push([300 + u * 500, Y(a)]);
  }
  for (let i = 1; i <= 20; i++) {
    const u = i / 20;
    pts.push([800 + u * 400, Y(lerp(ck, 0.15, u))]);
  }
  const reach = 70;
  const head = f < reach ? (lin(f, 0, reach) * 30) / 50 : 30 / 50 + (lin(f, reach, len) * 20) / 50;
  const idx = Math.min(pts.length - 1, Math.round(head * (pts.length - 1)));
  const hp = pts[idx];
  const open = ez(f, reach - 2, reach + 26);
  return (
    <Pop f={f}>
      <Stage theme={PET.theme} shotFrame={f} drift={{ zoom: 1.1, panX: 0.02, panY: 0.02, frames: len + 30, seed: 14 }} vignette={0.25} grain={0.4}>
        <Layer depth={1}>
          <SkyBack f={f} altTop={top} altBottom={bot} drift={0.3} flags={false} pins={[{ altKm: ck, label: "main chute", draw: ez(f, reach - 20, reach), len: 1200 }]} />
          <rect x={-400} y={-400} width={2720} height={1880} fill={PET.sky[0]} opacity={0.35} />
          <Trace pts={pts} head={head} f={f} color={C.saffron} width={7} smooth={false} />
          {f >= reach - 2 ? <Chute x={hp[0]} y={hp[1]} size={130} f={f} open={open} kind="main" /> : null}
        </Layer>
        <Layer depth={0}>
          <XTag x={110} y={110} text={`MAIN CHUTE ~${ck} km`} F={PET} dot={C.saffron} size={34} opacity={ez(f, reach, reach + 12)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================

export const SceneL05: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL05(t);
  const shots: ShotDef<CL05>[] = [
    { from: 0, S: ShotVillain, id: "5-01" },
    { from: c.spin, S: ShotSpin, id: "5-02" },
    { from: c.early, S: ShotEarly, id: "5-03" },
    { from: c.flat, S: ShotFlat, id: "5-04" },
    { from: c.drogue, S: ShotDrogue, id: "5-05" },
    { from: c.choice, S: ShotSeesaw, id: "5-06" },
    { from: c.used, S: ShotUsed, id: "5-07" },
    { from: c.airItself, S: ShotAirItself, id: "5-08" },
    { from: c.thicker, S: ShotThicker, id: "5-09" },
    { from: c.depends, S: ShotEquation, id: "5-10" },
    { from: c.race, S: ShotRace, id: "5-11" },
    { from: c.braking, S: ShotBraking, id: "5-12" },
    { from: c.peak, S: ShotPinned, id: "5-13" },
    { from: c.nothing, S: ShotNothing, id: "5-14" }, // + 5-15
    { from: c.records, S: ShotRecords, id: "5-16" },
    { from: c.main, S: ShotMain, id: "5-17" },
  ];
  return playShots(f, shots, c, t.frames);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL05 = (t: SceneTiming): Cue[] => {
  const c = cuesL05(t);
  const clicks = (at: number, n: number, gap = 7, vol = 0.06): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 7 }));
  return [
    { at: 0, file: SFX.deepWhoosh, vol: 0.3, dur: 60 },
    { at: 10, file: SFX.boom, vol: 0.36, dur: 150, fadeOut: 40 },
    { at: 34, file: SFX.pop, vol: 0.16, dur: 16 },
    { at: 52, file: SFX.pop, vol: 0.16, dur: 16 },
    ...cutHit(c.spin),
    { at: c.spin + 4, file: SFX.swirl, vol: 0.16, dur: 40 },
    ...cutHit(c.early),
    { at: c.early + 66, file: SFX.pop, vol: 0.18, dur: 16 },
    ...cutHit(c.flat),
    ...clicks(c.flat + 8, 10, 9),
    ...cutHit(c.drogue),
    { at: c.drogue + 12, file: SFX.popLong, vol: 0.2, dur: 30 },
    ...cutHit(c.choice),
    { at: c.choice + 30, file: SFX.popLong, vol: 0.18, dur: 30 },
    ...cutHit(c.used),
    { at: c.used + 8, file: SFX.pop, vol: 0.16, dur: 16 },
    { at: c.used + 28, file: SFX.pop, vol: 0.16, dur: 16 },
    ...cutHit(c.airItself),
    { at: c.airItself, file: SFX.rumble, vol: 0.16, dur: c.depends - c.airItself, fadeIn: 12, fadeOut: 12 },
    ...cutHit(c.thicker),
    ...clicks(c.thicker + 60, 8),
    ...cutHit(c.depends),
    { at: c.depends + 12, file: SFX.click, vol: 0.14, dur: 10 },
    { at: c.depends + 32, file: SFX.click, vol: 0.14, dur: 10 },
    ...cutHit(c.race),
    { at: c.race + 2, file: SFX.riser, vol: 0.14, dur: c.braking - c.race, fadeIn: 6, fadeOut: 6 },
    ...cutHit(c.braking),
    { at: c.braking + 40, file: SFX.popLong, vol: 0.2, dur: 30 },
    ...clicks(c.braking + 50, 6),
    ...cutHit(c.peak),
    { at: c.peak + 6, file: SFX.boom, vol: 0.3, dur: 120, fadeOut: 30 },
    ...cutHit(c.nothing),
    { at: c.nothing + 4, file: SFX.riser, vol: 0.14, dur: c.turn - c.nothing, fadeIn: 6, fadeOut: 8 },
    { at: c.turn, file: SFX.swirl, vol: 0.18, dur: 40 },
    ...clicks(c.turn + 18, 3, 9, 0.12),
    ...cutHit(c.records),
    { at: c.records + 4, file: SFX.swirl, vol: 0.14, dur: 40 },
    ...cutHit(c.main),
    { at: c.main + 68, file: SFX.popLong, vol: 0.22, dur: 30 },
  ];
};
