// L15 scene l03 "Gauge one: the air that isn't" (storyboard §3 "3 ·", shots 3-01…3-15, script lines 23-30; noon → petrol
// climb → void). ShotDefs (hard cuts; continuous rows are phases): 3-01 · 3-02+3-03 · 3-04 · 3-05+3-06 · 3-07 ·
// 3-08+3-09+3-10 · 3-11 · 3-12 · 3-13 · 3-14 · 3-15.
// Numbers drawn, each with its sources.md row (all from jumpdata.ts): 1.225 kg (#11 AIR_READ.sea) · under 4 g at 40 km
// (#11/#12 AIR_READ.at40g, ATM 40 km) · ABOUT 300× (#12 RATIOS.sea40Shown) · 66,000× (#12 RATIOS.sea80Shown) · 413 g ·
// 10 km, 89 g · 20 km (#11 AIR_READ, ATM rows) · ×2 → ×4 (#13 RATIOS.dragSpeed/dragForce) · 17.5× (#14 RATIOS.terminal40)
// · ALLOWED AT 40 km (#11 ATM row) · GRAVITY ≈ 97 % (#21 ORBIT.gravity100) · PUSH 0 (#20 model, OUR MODEL chip, F5).
// Rolling counters pass through interpolated #11 densities and end on the table value. Every air readout carries the
// STANDARD ATMOSPHERE tag (F6). F1: the faller is the probe; Tick only on the ground, a perch or the studio floor.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Bloom, CloudRack, Headline, IF2, Kicker, Layer, Motes, Sky, Stage, Streamers, Tick, alpha, cameraAt, impact, mixHex, rnd } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { L15_COLORS, familyOf, skyAt, skyFamily } from "../families";
import { AIR_READ, ATM, ORBIT, RATIOS, RHO0, atmAt, pushAt } from "../jumpdata";
import { AirGauge, L15GaugesHUD, PushGauge, SpeedGauge, airValue } from "../L15Gauges";
import { AirCube, Bracket, Probe } from "../props";
import { altY } from "../sky";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { Arrow, C, Perch, Pop, SkyBack, Slab, StudioSet, XTag, cl01, ez, lerp, lin, rollText } from "./b-parts";

const NOON = familyOf("noon");
const PET = familyOf("petrol");
const VOID = familyOf("void");
const STU = familyOf("studio");
const KM10 = ATM[1].km; // #11
const KM20 = ATM[2].km; // #11
const KM40 = ATM[4].km; // #11
const air = (alt: number) => Math.max(0, Math.round(90 * airValue(alt)));

export const cuesL03 = (t: SceneTiming) => {
  const { at, p, frac } = cueKit(t);
  return {
    sea: 0, // 3-01
    forty: p(0, "At forty kilometres"), // 3-02
    thinner: p(0, "That's about three hundred"), // 3-03 (phase)
    eighty: at(1), // 3-04
    between: p(1, "In between"), // 3-05
    steadily: p(1, "The air doesn't thin"), // 3-06 (phase)
    below: at(2), // 3-07
    drag: at(3), // 3-08
    grows: p(3, "It grows with"), // 3-09 (phase)
    level: frac(3, 0.8), // 3-10 (phase)
    terminal: p(3, "terminal velocity"),
    double: at(4), // 3-11
    four: p(4, "four times"),
    allows: at(5), // 3-12
    limit40: p(5, "At forty kilometres"), // 3-13
    top: at(6), // 3-14
    model: at(7), // 3-15
    zero: p(7, "push gauge sits at zero"),
  };
};
export type CL03 = ReturnType<typeof cuesL03>;

// ===============================================================================================================
// 3-01 · noon, sea level: a 1-m cube of air with its dots swarming; the AIR gauge lights; counter to 1.225 kg.
// MOVER: dots swarming (5 px/f) + counter + CloudRack (2.4 px/f) + push-in.
// ===============================================================================================================
const ShotSea: ShotFC<CL03> = ({ f, len }) => {
  const k = ez(f, 12, 90);
  const lit = ez(f, 6, 24);
  return (
    <Stage theme={NOON.theme} shotFrame={f} drift={{ zoom: 1.12, panX: 0.03, panY: 0.01, frames: len + 30, seed: 1 }} vignette={0.12} grain={0.4}>
      <Layer depth={1}>
        <SkyBack f={f} altTop={3.2} altBottom={-0.35} ruler={false} bands={false} />
        <CloudRack f={f} n={6} x0={-300} x1={2200} y0={140} y1={560} size={70} speed={2.4} body={C.cloud} under={C.cloudShade} seed={3} />
        <Bloom x={560} y={520} r={420} color={C.cloud} strength={0.35} />
        <AirCube x={360} y={300} size={400} n={90} f={f} speed={5} color={C.bone} glass={C.limb} seed={11} edge={mixHex(C.tealDeep, "#04121A", 0.3)} />
        <text x={560} y={268} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 24, letterSpacing: 4, fill: NOON.text }}>
          ONE CUBIC METRE OF AIR · SEA LEVEL
        </text>
        <Tick x={1320} y={975} pxPerM={120} frame={f} facing={1} pose="press" poseTo="stand" poseT={ez(f, 26, 44)} expression="determined" look={0.7} headTilt={-8} />
      </Layer>
      <Layer depth={0}>
        <Kicker x={110} y={110} text="Gauge one · the air that isn't" color={NOON.text} size={28} />
        <Slab x={420} y={930} value={rollText(AIR_READ.sea /* #11 */, k, 3)} unit="kg" size={84} F={PET} sub="STANDARD ATMOSPHERE" />
        <Bloom x={1590} y={520} r={240} color={C.saffronCore} strength={0.55 * lit} />
        <L15GaugesHUD family={NOON} frame={f} theme="dark" speed={{ value: 0, appear: 0.35 }} air={{ value: 1, appear: 0.4 + 0.6 * lit }} push={{ value: 0, appear: 0.35 }} cold={{ value: 15, appear: 0.35 }} />
      </Layer>
    </Stage>
  );
};

// ===============================================================================================================
// 3-02 + 3-03 · the camera climbs the ruler to 40 km with the cube riding along (dots thinning, sky to indigo, the
// counter falling to under 4 g); then a ghost sea-level cube slides in beside it, a bracket draws, ABOUT 300× THINNER.
// MOVER: ruler ticks + stars scrolling (≈ 18-27 px/f) → ghost cube swarm (5 px/f) + bracket drawing (≈ 12 px/f).
// ===============================================================================================================
const ShotClimb: ShotFC<CL03> = ({ f, len, c }) => {
  const th = c.thinner - c.forty;
  const alt = 0.6 + (KM40 - 0.6) * ez(f, 0, th);
  const span = 9;
  const p2 = ez(f, th, th + 22);
  const cubeX = lerp(400, 820, p2);
  const ghostX = lerp(-500, 240, p2);
  const rho = atmAt(alt).rho;
  const atTop = f >= th - 4;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.02 },
    { f: th, x: 960, y: 540, zoom: 1.0 },
    { f: len, x: 860, y: 560, zoom: 1.12 },
  ]);
  return (
    <Stage theme={skyFamily(alt).theme} cam={cam} vignette={0.2} grain={0.4}>
      <Layer depth={1}>
        <SkyBack f={f} altTop={alt + span} altBottom={alt - span} drift={0.6} />
        <AirCube x={ghostX} y={320} size={330} n={90} f={f} speed={5} color={alpha(C.bone, 0.7)} glass={alpha(C.limb, 0.5)} seed={4} />
        {p2 > 0.02 ? (
          <text x={ghostX + 210} y={300} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 22, letterSpacing: 3, fill: alpha(C.bone, 0.8) }}>
            SEA LEVEL
          </text>
        ) : null}
        <AirCube x={cubeX} y={320} size={330} n={Math.max(1, air(alt))} f={f} speed={5} color={C.saffronCore} glass={C.limb} seed={9} />
        {p2 > 0.02 ? (
          <text x={cubeX + 210} y={300} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 22, letterSpacing: 3, fill: C.saffronCore }}>
            {`AT ${KM40} km` /* #11 */}
          </text>
        ) : null}
        <Bracket x1={ghostX + 160} y1={760} x2={cubeX + 160} y2={760} draw={lin(f, th + 16, th + 60)} color={C.saffron} />
      </Layer>
      <Layer depth={0}>
        <g opacity={1 - p2}>
          <Slab x={420} y={960} value={atTop ? `< ${AIR_READ.at40g}` /* #12 */ : Math.round(rho * 1000).toLocaleString("en-US")} unit="g" size={80} F={PET} sub="STANDARD ATMOSPHERE" />
        </g>
        <XTag x={560} y={890} text={`ABOUT ${RATIOS.sea40Shown}× THINNER` /* #12 */} F={PET} dot={C.saffron} size={34} align="middle" opacity={ez(f, th + 40, th + 52)} />
        <g transform={`translate(0 ${(1 - ez(f, th + 6, th + 26)) * 300})`}>
          <Perch x={1290} y={960} f={f} pose="lean" expression="thinking" expressionTo="surprised" expressionT={ez(f, th + 44, th + 54)} facing={-1} look={0.6} />
        </g>
      </Layer>
    </Stage>
  );
};

// ===============================================================================================================
// 3-04 · climbing into black, 50 → 84 km; the cube nearly empty (two dots); counter to 66,000× THINNER.
// MOVER: ruler ticks + flags + stars scrolling (≈ 24 px/f) + counter. DARK.
// ===============================================================================================================
const ShotEighty: ShotFC<CL03> = ({ f, len }) => {
  const alt = 50 + 34 * lin(f, 0, len);
  const k = ez(f, 10, len - 30);
  return (
    <Pop f={f}>
      <Stage theme={VOID.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.01, panY: 0.0, frames: len + 40, seed: 2 }} vignette={0.3} grain={0.4}>
        <Layer depth={1}>
          <SkyBack f={f} altTop={alt + 5.5} altBottom={alt - 5.5} drift={0.5} aurora={0.5} />
          <Bloom x={600} y={500} r={300} color={C.limb} strength={0.18} />
          <AirCube x={420} y={300} size={360} n={2} f={f} speed={5} color={C.saffronCore} glass={C.limb} seed={13} />
        </Layer>
        <Layer depth={0}>
          <Slab x={300} y={930} value={rollText(RATIOS.sea80Shown /* #12 */, k)} unit="× THINNER" size={88} F={VOID} sub="STANDARD ATMOSPHERE" />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 3-05 + 3-06 · descending: the cubes hanging at 20 km and 10 km ride past (dots thicken), their counters roll; then
// the camera pulls back to 0-44 km and the density profile is drawn beside the ruler while Tick traces it.
// MOVER: cubes + ruler riding (≈ 11 px/f) → profile drawing head (≈ 12 px/f) + ruler rescaling.
// ===============================================================================================================
const ShotBetween: ShotFC<CL03> = ({ f, len, c }) => {
  const s1 = c.steadily - c.between;
  const z = ez(f, s1, s1 + 36);
  const centre = lerp(26, 8.5, lin(f, 0, s1));
  const top = lerp(centre + 5.5, 44 + 0.02 * Math.max(0, f - s1), z);
  const bot = lerp(centre - 5.5, -2 + 0.02 * Math.max(0, f - s1), z);
  const Y = (a: number) => altY(a, top, bot);
  const cubes = [
    { km: KM20, g: AIR_READ.at20g, x: 640 }, // #11
    { km: KM10, g: AIR_READ.at10g, x: 980 }, // #11
  ];
  const head = lerp(0, 43, lin(f, s1 + 30, len - 8));
  const pts: string[] = [];
  for (let a = 0; a <= head; a += 0.5) pts.push(`${(250 + (atmAt(a).rho / RHO0) * 1000).toFixed(1)} ${Y(a).toFixed(1)}`);
  const hx = 250 + (atmAt(head).rho / RHO0) * 1000;
  const fam = skyFamily(lerp(centre, 20, z));
  return (
    <Stage theme={fam.theme} shotFrame={f} drift={{ zoom: 1.06, panX: -0.02, panY: 0.01, frames: len + 40, seed: 3 }} vignette={0.2} grain={0.4}>
      <Layer depth={1}>
        <SkyBack f={f} altTop={top} altBottom={bot} drift={0.4} />
        <g opacity={1 - z}>
          {cubes.map((q, i) => {
            const y = Y(q.km);
            const passed = cl01((y - 300) / 200);
            return (
              <g key={i}>
                <line x1={110} y1={y} x2={q.x} y2={y} stroke={C.saffron} strokeWidth={3} strokeDasharray="8 8" />
                <AirCube x={q.x} y={y - 120} size={240} n={air(q.km)} f={f} speed={5} color={C.saffronCore} glass={C.limb} seed={20 + i} />
                <text x={q.x + 290} y={y + 10} style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 54, fill: C.bone }}>
                  {rollText(q.g, passed)}
                  <tspan style={{ fontSize: 28, fill: C.saffronCore }}> g</tspan>
                </text>
              </g>
            );
          })}
        </g>
        {pts.length > 1 ? (
          <g opacity={z}>
            <path d={"M" + pts.join(" L")} fill="none" stroke={alpha(C.saffron, 0.35)} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" />
            <path d={"M" + pts.join(" L")} fill="none" stroke={C.saffronCore} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={hx} cy={Y(head)} r={11} fill={C.saffronCore} stroke={C.saffron} strokeWidth={3} />
            <Bloom x={hx} y={Y(head)} r={50} color={C.saffronCore} strength={0.7} />
            <text x={1260} y={Y(0) - 20} textAnchor="end" style={{ fontFamily: IF2.label, fontSize: 20, letterSpacing: 3, fill: C.bone }}>
              THICKER →
            </text>
          </g>
        ) : null}
        {z > 0 ? (
          <g opacity={z}>
            <Tick x={1330} y={Y(0) + 6} pxPerM={96} frame={f} facing={-1} pose="point" staff expression="thinking" look={0.4} headTilt={-10 + Math.sin(f / 9) * 6} />
          </g>
        ) : null}
      </Layer>
      <Layer depth={0}>
        <g opacity={1 - z}>
          <XTag x={1080} y={110} text={`${AIR_READ.at10g} g · ${KM10} km` /* #11 */} F={PET} dot={C.saffron} size={30} opacity={ez(f, s1 * 0.55, s1 * 0.55 + 10) * (Y(KM10) < 900 ? 1 : 0)} />
          <XTag x={1080} y={190} text={`${AIR_READ.at20g} g · ${KM20} km` /* #11 */} F={PET} dot={C.saffron} size={30} opacity={ez(f, 20, 30)} />
          <text x={1090} y={250} style={{ fontFamily: IF2.label, fontSize: 15, letterSpacing: 2.4, fill: alpha(C.bone, 0.75) }}>
            PER CUBIC METRE · STANDARD ATMOSPHERE
          </text>
        </g>
      </Layer>
    </Stage>
  );
};

// ===============================================================================================================
// 3-07 · noon 0-21 km: the lower stretch fills teal from the ground up, dots thick at the bottom; MOST OF THE AIR IS
// BELOW (no fraction: three-quarters is secondary). MOVER: teal fill rising (≈ 7 px/f) + pull-back + CloudRack.
// ===============================================================================================================
const ShotBelow: ShotFC<CL03> = ({ f, len }) => {
  const top = 21;
  const bot = -1;
  const Y = (a: number) => altY(a, top, bot);
  const fill = 13 * ez(f, 4, len - 6);
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 640, zoom: 1.28 },
    { f: len, x: 960, y: 540, zoom: 1.0 },
  ]);
  const dots = Array.from({ length: 170 }, (_, i) => {
    const a = -Math.log(1 - rnd(i * 7 + 1) * 0.95) * 4.2; // denser near the ground
    const x = 220 + rnd(i * 13 + 2) * 1180 + Math.sin(f / 9 + i) * 6;
    return { a, x };
  });
  return (
    <Pop f={f}>
      <Stage theme={NOON.theme} cam={cam} vignette={0.12} grain={0.4}>
        <Layer depth={1}>
          <SkyBack f={f} altTop={top} altBottom={bot} drift={0.3} />
          <CloudRack f={f} n={5} x0={-300} x1={2200} y0={Y(5)} y1={Y(1.5)} size={46} speed={2.4} body={C.cloud} under={C.cloudShade} seed={8} />
          <rect x={150} y={Y(fill)} width={1300} height={Math.max(0, Y(0) - Y(fill))} fill={alpha(C.teal, 0.42)} />
          <rect x={150} y={Y(fill) - 4} width={1300} height={8} rx={4} fill={C.saffronCore} opacity={fill > 0.2 ? 1 : 0} />
          {dots.map((d, i) => (d.a < fill ? <circle key={i} cx={d.x} cy={Y(d.a)} r={5} fill={C.bone} opacity={0.85} /> : null))}
        </Layer>
        <Layer depth={0}>
          <XTag x={620} y={120} text="MOST OF THE AIR IS BELOW" F={PET} dot={C.saffron} size={36} align="middle" opacity={ez(f, 20, 32)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 3-08 + 3-09 + 3-10 · the capsule falls through haze: the PUSH arrow grows under it against WEIGHT; a card slides in
// (PUSH ← AIR × SPEED²); PUSH comes level with WEIGHT, SPEED flattens, Terminal Velocity slams.
// MOVER: haze streaming (10 px/f) + push arrow growing (3.3 px/f) → card sliding (20 px/f) → headline slam.
// ===============================================================================================================
const ShotPush: ShotFC<CL03> = ({ f, len, c }) => {
  const g = c.grows - c.drag;
  const lv = c.level - c.drag;
  const tv = c.terminal - c.drag;
  const push = 200 * ez(f, 8, 68) + 60 * ez(f, lv - 10, lv + 20);
  const W = 260;
  const alt = 20 - 9 * lin(f, 0, len);
  const sp = 0.55 * (1 - Math.exp(-f / 70));
  const cardX = lerp(-1200, 110, ez(f, g, g + 40)) - lerp(0, 1100, ez(f, lv, lv + 20));
  const slam = f - tv;
  const sc = slam < 0 ? 0 : 1 + 1.4 * Math.pow(1 - cl01(slam / 8), 2);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.12 },
    { f: lv, x: 960, y: 540, zoom: 1.06 },
    { f: len, x: 980, y: 560, zoom: 0.96 },
  ]);
  const px = 640;
  const py = 430;
  const term = (x: number, y: number, label: string, on: number, w: number) => (
    <g>
      <rect x={x} y={y - 42} width={w} height={70} rx={35} fill={on > 0.5 ? C.saffron : alpha("#04121A", 0.6)} stroke={C.saffron} strokeWidth={3} />
      <text x={x + w / 2} y={y + 6} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 34, letterSpacing: 3, fill: on > 0.5 ? "#1A1206" : C.bone }}>
        {label}
      </text>
    </g>
  );
  return (
    <Pop f={f}>
      <Stage theme={PET.theme} cam={cam} vignette={0.22} grain={0.4}>
        <Layer depth={1}>
          <SkyBack f={f} altTop={alt + 6} altBottom={alt - 6} drift={0.4} />
          <rect x={-400} y={-400} width={2720} height={1880} fill={PET.sky[1]} opacity={0.45} />
          <g transform="rotate(-90 960 540)">
            <Streamers f={f} n={22} x0={-400} x1={2400} y0={-300} y1={1500} len={240} width={10} speed={10} color={alpha(PET.light, 0.5)} opacity={0.6} seed={5} />
          </g>
          <Probe x={px + Math.sin(f / 7) * 3} y={py} size={170} f={f} trail={140} />
          <Arrow x1={px - 170} y1={py + 230} x2={px - 170} y2={py + 230 - Math.max(4, push)} color={C.bone} w={22} head={50} />
          <Arrow x1={px + 170} y1={py - 30} x2={px + 170} y2={py - 30 + W} color={C.saffron} w={22} head={50} />
          <text x={px - 200} y={py + 280} textAnchor="end" style={{ fontFamily: IF2.label, fontSize: 26, letterSpacing: 3, fill: C.bone }}>
            PUSH
          </text>
          <text x={px + 200} y={py + 280} style={{ fontFamily: IF2.label, fontSize: 26, letterSpacing: 3, fill: C.saffronCore }}>
            WEIGHT
          </text>
          {f >= lv ? <rect x={px - 200} y={py + 226} width={400} height={8} rx={4} fill={C.saffronCore} opacity={ez(f, lv + 14, lv + 24)} /> : null}
          <Motes frame={f} n={24} x={-200} y={0} w={2300} h={1080} color={alpha(C.bone, 0.7)} seed={7} size={4} drift={30} />
        </Layer>
        <Layer depth={0}>
          <g opacity={1 - ez(f, g - 10, g)}>
            <Kicker x={110} y={110} text="Gauge: push" color={PET.text} size={30} />
          </g>
          <g transform={`translate(${cardX} 0)`}>
            <rect x={0} y={790} width={980} height={200} rx={28} fill={alpha("#04121A", 0.82)} stroke={C.saffron} strokeWidth={3} />
            {term(40, 900, "PUSH", 1, 200)}
            <text x={290} y={912} style={{ fontFamily: IF2.display, fontWeight: 800, fontSize: 56, fill: C.bone }}>
              ←
            </text>
            {term(370, 900, "AIR", ez(f, g + 30, g + 36), 180)}
            <text x={572} y={912} style={{ fontFamily: IF2.display, fontWeight: 800, fontSize: 52, fill: C.bone }}>
              ×
            </text>
            {term(630, 900, "SPEED²", ez(f, g + 52, g + 58), 300)}
          </g>
          {slam >= 0 ? (
            <g transform={`translate(110 950) scale(${sc}) translate(-110 -950)`}>
              <rect x={70} y={815} width={1010} height={180} rx={26} fill={alpha(PET.shadow, 0.85)} />
              <Headline x={110} y={945} lines={["Terminal Velocity"]} size={104} color={PET.text} accent={C.saffron} rule={false} />
            </g>
          ) : null}
          <Perch x={1320} y={1000} f={f} pose="think" poseTo="hips" poseT={ez(f, tv - 6, tv + 10)} expression="thinking" expressionTo="proud" expressionT={ez(f, tv - 4, tv + 6)} facing={1} look={0.9} headTilt={f > tv ? Math.sin((f - tv) / 4) * 8 * (1 - cl01((f - tv) / 30)) : 0} />
          <L15GaugesHUD family={PET} frame={f} theme="dark" speed={{ value: sp }} air={{ value: airValue(alt) }} push={{ value: push / W }} cold={{ value: atmAt(alt).tC }} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 3-11 · STUDIO: two dials. SPEED doubles (×2), PUSH leaps to four (×4); Tick jerks back from the PUSH dial.
// MOVER: two needles/columns sweeping (4°/f, column leap) + counters + Tick's jerk.
// ===============================================================================================================
const ShotDouble: ShotFC<CL03> = ({ f, len, c }) => {
  const four = c.four - c.double;
  const s = ez(f, 6, 22);
  const pw = ez(f, four - 4, four + 16);
  const wob = f > four + 16 ? Math.sin((f - four - 16) / 3) * 0.25 * Math.exp(-(f - four - 16) / 20) : 0;
  return (
    <Pop f={f}>
      <Stage theme={STU.theme} shotFrame={f} drift={{ zoom: 1.2, panX: 0.03, panY: 0.02, frames: len + 20, seed: 4 }} vignette={0.12} grain={0.4}>
        <StudioSet f={f + 60} seed={6}>
          <SpeedGauge x={150} y={250} s={{ value: 0.3 + 0.3 * s }} f={f} family={STU} theme="dark" scale={1.35} />
          <PushGauge x={760} y={170} s={{ value: 1 + 3 * pw + wob }} f={f} family={STU} theme="dark" scale={2.1} />
          <text x={393} y={780} textAnchor="middle" style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 96, fill: "#1A1206" }}>
            ×{Math.round(1 + (RATIOS.dragSpeed /* #13 */ - 1) * s)}
          </text>
          <text x={944} y={780} textAnchor="middle" style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 96, fill: L15_COLORS.vermilion }}>
            ×{Math.round(1 + (RATIOS.dragForce /* #13 */ - 1) * pw)}
          </text>
          <Tick
            x={1330 + ez(f, four, four + 8) * 70}
            y={860}
            pxPerM={150}
            frame={f}
            facing={-1}
            pose={f < four ? "lean" : "shield"}
            expression={f < four ? "thinking" : "surprised"}
            look={0.5}
            tilt={-ez(f, four, four + 8) * 10}
            squash={impact(f, four + 2, 0.12, 10)}
          />
        </StudioSet>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 3-12 · the SPEED dial: a ghost needle at the ground's limit; the allowed needle rises as the air thins (AIR cube
// emptying); tag ALLOWED AT 40 km. MOVER: needle sweeping (≈ 2.5 px/f at the tip) + AIR dots thinning + push to dial.
// ===============================================================================================================
const ghost = 1 / RATIOS.terminal40; // #14: the ground's limit sits 1/17.5 of the way to the stop
const allowed = (alt: number) => Math.min(1, ghost * Math.sqrt(RHO0 / atmAt(alt).rho)); // #14 1/√(density)
const PetrolBack: React.FC<{ f: number; seed?: number }> = ({ f, seed = 2 }) => (
  <g>
    <Sky stops={[mixHex(PET.sky[0], "#04121A", 0.4), PET.sky[0], PET.sky[1]]} />
    <g transform="rotate(-90 960 540)">
      <Streamers f={f} n={18} x0={-400} x1={2400} y0={-300} y1={1500} len={200} width={8} speed={8} color={alpha(PET.light, 0.4)} opacity={0.5} seed={seed} />
    </g>
    <Motes frame={f} n={26} x={-200} y={0} w={2300} h={1080} color={alpha(C.bone, 0.7)} seed={seed + 4} size={4} drift={30} />
  </g>
);
const ShotAllowed: ShotFC<CL03> = ({ f, len }) => {
  const alt = 36 * lin(f, 6, len - 12);
  const v = allowed(alt);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: len, x: 820, y: 520, zoom: 1.12 },
  ]);
  const a = (Math.PI * (180 + (v / 1.15) * 180)) / 180;
  const tipX = 140 + (180 + Math.cos(a) * 128 * 0.85) * 2.1;
  const tipY = 160 + (218 + Math.sin(a) * 128 * 0.85) * 2.1;
  return (
    <Pop f={f}>
      <Stage theme={PET.theme} cam={cam} vignette={0.22} grain={0.4}>
        <Layer depth={1}>
          <PetrolBack f={f} />
          <SpeedGauge x={140} y={160} s={{ value: v, ghost }} f={f} family={PET} theme="dark" scale={2.1} />
          <text x={150 + 180 * 2.1 - 270} y={160 + 218 * 2.1 + 40} style={{ fontFamily: IF2.label, fontSize: 20, letterSpacing: 2.5, fill: alpha(C.bone, 0.75) }}>
            GHOST · AT THE GROUND
          </text>
          <AirGauge x={1010} y={300} s={{ value: airValue(alt) }} f={f} family={PET} theme="dark" scale={1.5} />
        </Layer>
        <Layer depth={0}>
          <g opacity={ez(f, len - 70, len - 50)}>
            <rect x={tipX - 10} y={tipY - 70} width={300} height={44} rx={22} fill={alpha("#04121A", 0.75)} stroke={C.saffron} strokeWidth={2} />
            <text x={tipX + 6} y={tipY - 40} style={{ fontFamily: IF2.label, fontSize: 22, letterSpacing: 2.5, fill: C.saffronCore }}>
              {`ALLOWED AT ${KM40} km` /* #11 */}
            </text>
          </g>
          <XTag x={140} y={110} text="1 / √(AIR)" F={PET} dot={C.saffron} size={34} />
          <Perch x={1330} y={1000} f={f} pose="point" expression="determined" facing={-1} look={0.3} headTilt={Math.sin(f / 14) * 8} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 3-13 · close on the dial: the allowed needle swings out to the stop and pins; counter to 17.5×.
// MOVER: needle sweeping then rattling at the stop + chevrons + counter + push-in.
// ===============================================================================================================
const ShotSeventeen: ShotFC<CL03> = ({ f, len }) => {
  const v = lerp(allowed(36), 1, ez(f, 4, 60));
  const pinned = f > 64;
  const k = ez(f, 20, 100);
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 560, zoom: 1.0 },
    { f: len, x: 760, y: 520, zoom: 1.22 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={PET.theme} cam={cam} vignette={0.25} grain={0.4}>
        <Layer depth={1}>
          <PetrolBack f={f} seed={6} />
          <Bloom x={760} y={560} r={520} color={C.limb} strength={0.15} />
          <SpeedGauge x={230} y={170} s={{ value: v, ghost, pinned }} f={f} family={PET} theme="dark" scale={2.3} />
        </Layer>
        <Layer depth={0}>
          <Slab x={1250} y={620} value={`${rollText(RATIOS.terminal40 /* #14 */, k, 1)}×`} size={130} F={PET} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 3-14 · void: the capsule falls in black, stars streaming up; SPEED climbs straight, PUSH barely leaves zero; the
// gravity arrow keeps its length (F8). MOVER: stars streaming (≈ 18 px/f) + ruler + SPEED needle. DARK.
// ===============================================================================================================
const ShotTop: ShotFC<CL03> = ({ f, len }) => {
  const alt = 99 - 12 * lin(f, 0, len);
  return (
    <Pop f={f}>
      <Stage theme={VOID.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0.01, panY: 0.01, frames: len + 40, seed: 5 }} vignette={0.3} grain={0.4}>
        <Layer depth={1}>
          <SkyBack f={f} altTop={alt + 6} altBottom={alt - 6} drift={8} streak={34} aurora={0.6} bands={false} />
          <Probe x={640} y={430} size={160} f={f} trail={180} />
          <Arrow x1={640} y1={560} x2={640} y2={780} color={C.saffron} w={20} head={46} />
          <text x={680} y={740} style={{ fontFamily: IF2.label, fontSize: 24, letterSpacing: 3, fill: C.saffronCore }}>
            GRAVITY
          </text>
        </Layer>
        <Layer depth={0}>
          <XTag x={120} y={980} text={`GRAVITY ≈ ${ORBIT.gravity100} % OF THE GROUND` /* #21 */} F={VOID} dot={C.saffron} size={30} />
          <Perch x={1320} y={1000} f={f} pose="stand" expression="neutral" expressionTo="happy" expressionT={ez(f, len - 60, len - 40)} facing={1} look={Math.sin(f / 20) * 0.5 + 0.4} />
          <L15GaugesHUD family={VOID} frame={f} theme="light" speed={{ value: 0.08 + 0.95 * lin(f, 0, len) }} air={{ value: airValue(alt) }} push={{ value: pushAt(alt) }} cold={{ value: atmAt(Math.min(80, alt)).tC }} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 3-15 · void, a clean split: VACUUM lane and OUR MODEL lane, the probes streaking side by side; PUSH flat at zero.
// MOVER: speed streaks (30 px/f) + stars (≈ 18 px/f) + SPEED needle + pull-back. DARK. F5: OUR MODEL kicker + chip.
// ===============================================================================================================
const Streaks: React.FC<{ f: number; x0: number; x1: number; seed: number }> = ({ f, x0, x1, seed }) => (
  <g stroke={alpha(C.bone, 0.75)} strokeLinecap="round">
    {Array.from({ length: 12 }, (_, i) => {
      const x = x0 + rnd(seed * 7 + i) * (x1 - x0);
      const y = ((((rnd(seed * 3 + i) * 1400 - f * 30) % 1400) + 1400) % 1400) - 160;
      return <line key={i} x1={x} y1={y} x2={x} y2={y + 90 + rnd(i + seed) * 90} strokeWidth={3 + rnd(i * 5) * 3} opacity={0.6} />;
    })}
  </g>
);
const ShotModel: ShotFC<CL03> = ({ f, len, c }) => {
  const zero = c.zero - c.model;
  const alt = 100 - 14 * lin(f, 0, len);
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 520, zoom: 1.15 },
    { f: len, x: 960, y: 540, zoom: 1.0 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={VOID.theme} cam={cam} vignette={0.3} grain={0.4}>
        <Layer depth={1}>
          <SkyBack f={f} altTop={alt + 7} altBottom={alt - 7} drift={8} streak={28} aurora={0.5} bands={false} />
          <line x1={720} y1={-200} x2={720} y2={1300} stroke={alpha(C.saffron, 0.7)} strokeWidth={4} strokeDasharray="14 12" />
          <Streaks f={f} x0={330} x1={620} seed={1} />
          <Streaks f={f} x0={820} x1={1120} seed={2} />
          <Probe x={470} y={470} size={140} f={f} trail={220} lamp={false} />
          <Probe x={970} y={472} size={140} f={f + 7} trail={220} />
          <text x={470} y={800} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 28, letterSpacing: 4, fill: alpha(C.bone, 0.85) }}>
            VACUUM
          </text>
          <text x={970} y={800} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 28, letterSpacing: 4, fill: C.saffronCore }}>
            OUR MODEL
          </text>
        </Layer>
        <Layer depth={0}>
          <Kicker x={110} y={110} text="Our model, not a record" color={VOID.text} size={30} />
          <Perch x={1320} y={1000} f={f} pose="point" poseTo="press" poseT={ez(f, zero - 4, zero + 8)} expression="happy" expressionTo="proud" expressionT={ez(f, zero, zero + 8)} facing={1} look={0.9} />
          <L15GaugesHUD
            family={VOID}
            frame={f}
            theme="light"
            model
            speed={{ value: 0.1 + 0.6 * lin(f, 0, len) }}
            air={{ value: airValue(alt) }}
            push={{ value: 0, readout: 0 /* #20: zero at the top */, unit: "×" }}
            cold={{ value: atmAt(80).tC }}
          />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================

export const SceneL03: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL03(t);
  const shots: ShotDef<CL03>[] = [
    { from: 0, S: ShotSea, id: "3-01" },
    { from: c.forty, S: ShotClimb, id: "3-02" }, // + 3-03
    { from: c.eighty, S: ShotEighty, id: "3-04" },
    { from: c.between, S: ShotBetween, id: "3-05" }, // + 3-06
    { from: c.below, S: ShotBelow, id: "3-07" },
    { from: c.drag, S: ShotPush, id: "3-08" }, // + 3-09, 3-10
    { from: c.double, S: ShotDouble, id: "3-11" },
    { from: c.allows, S: ShotAllowed, id: "3-12" },
    { from: c.limit40, S: ShotSeventeen, id: "3-13" },
    { from: c.top, S: ShotTop, id: "3-14" },
    { from: c.model, S: ShotModel, id: "3-15" },
  ];
  return playShots(f, shots, c, t.frames);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL03 = (t: SceneTiming): Cue[] => {
  const c = cuesL03(t);
  const clicks = (at: number, n: number, gap = 7, vol = 0.06): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 7 }));
  return [
    { at: 8, file: SFX.click, vol: 0.14, dur: 10 },
    { at: 20, file: SFX.chime, vol: 0.18, dur: 60 },
    ...cutHit(c.forty, 0.14),
    { at: c.forty + 2, file: SFX.riser, vol: 0.12, dur: c.thinner - c.forty, fadeIn: 6, fadeOut: 8 },
    { at: c.thinner + 40, file: SFX.popLong, vol: 0.2, dur: 30 },
    ...cutHit(c.eighty),
    { at: c.eighty + 2, file: SFX.riser, vol: 0.14, dur: c.between - c.eighty, fadeIn: 6, fadeOut: 10 },
    ...cutHit(c.between),
    ...clicks(c.between + 30, 5, 8),
    ...clicks(c.between + 90, 5, 8),
    { at: c.steadily + 30, file: SFX.swirl, vol: 0.14, dur: 40 },
    ...cutHit(c.below),
    { at: c.below + 20, file: SFX.popLong, vol: 0.2, dur: 30 },
    ...cutHit(c.drag),
    { at: c.drag, file: SFX.rumble, vol: 0.14, dur: c.double - c.drag, fadeIn: 12, fadeOut: 12 },
    { at: c.grows + 30, file: SFX.click, vol: 0.14, dur: 10 },
    { at: c.grows + 52, file: SFX.click, vol: 0.14, dur: 10 },
    ...clicks(c.level, 4, 6),
    { at: c.terminal, file: SFX.chime, vol: 0.2, dur: 60 },
    ...cutHit(c.double),
    { at: c.double + 8, file: SFX.click, vol: 0.14, dur: 10 },
    { at: c.four, file: SFX.click, vol: 0.14, dur: 10 },
    { at: c.four + 4, file: SFX.pop, vol: 0.2, dur: 16 },
    ...cutHit(c.allows),
    { at: c.allows + 4, file: SFX.riser, vol: 0.12, dur: c.limit40 - c.allows, fadeIn: 10, fadeOut: 10 },
    ...cutHit(c.limit40),
    ...clicks(c.limit40 + 20, 8, 9),
    { at: c.limit40 + 62, file: SFX.popLong, vol: 0.22, dur: 30 },
    ...cutHit(c.top),
    { at: c.top + 2, file: SFX.whoosh, vol: 0.2, dur: 50 },
    ...cutHit(c.model),
    { at: c.model + 2, file: SFX.whoosh, vol: 0.22, dur: 50 },
    { at: c.zero, file: SFX.click, vol: 0.16, dur: 10 },
  ];
};
