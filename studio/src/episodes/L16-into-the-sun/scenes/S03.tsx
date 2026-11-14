// L16 scene l03 "Touching the Sun" (storyboard §3 "3 ·", shots 3-01…3-15, script lines 23-31). ShotDefs (hard cuts; PUSH /
// SLIDE rows are phases of one shot): 3-01 (+3-02) · 3-03 · 3-04 · 3-05 · 3-06 (+3-07, 3-08) · 3-09 · 3-10 (+3-11) · 3-12 ·
// 3-13 (+3-14) · 3-15.
// Numbers drawn (all READ entries in sundata.ts, rows in brackets): ABOUT 9 / ABOUT 9 RADII (#6 #22) · under 5 % + OUR SUM
// (#1 #22, class C) · 28 APR 2021 · 8TH PASS (#9) · 13 million km · 18.8 RADII (#9) · 5 hours + ABOUT (#9) · 695,700 km
// (#15) · 109 Earths (#15). Words only: CORONA, HOTTER THE FARTHER OUT (#10), ALFVÉN SURFACE, SOLAR ATMOSPHERE / SOLAR WIND,
// SPIKES AND VALLEYS, FIRST TIME A SPACECRAFT TOUCHED THE SUN + NASA (#9). Green MEASURED only on the crossing (F2).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bloom, Headline, Kicker, Layer, Sky, Stage, Tick, alpha, cameraAt, impact, mixHex, rnd, smoothPath, type Pt } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { sunGradient } from "../families";
import { RADII, READ } from "../sundata";
import { RadiiRuler, xAtR } from "../ruler";
import { Granules, WindStreaks } from "../movers16";
import { Alfven, AlfvenFlat, CoronaHalo, SunLimb } from "../sunbody";
import { L16DialsHUD, distanceValue } from "../L16Dials";
import { AboutPill, OurSumPill, SourceChip, StateStamp } from "../stamps";
import { Calendar, Clock, EarthRow, Planet, Probe } from "../props16";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { Burst, C, CORONA, GLOW, Ledge, Pop, Readout, SPACE, SideSun, SpaceField, SpikyLine, Tag, TallSky, cl01, ez, lerp, lin, rollText, spikeTipY } from "./b-parts";

export const cuesL03 = (t: SceneTiming) => {
  const { at, p, frac } = cueKit(t);
  return {
    radii: 0, // 3-01
    counted: frac(0, 0.55), // 3-02 (phase)
    corona: at(1), // 3-03
    hotter: p(1, "gets hotter the farther"),
    boundary: at(2), // 3-04
    april: frac(2, 0.4), // 3-05
    below: frac(2, 0.72), // 3-06
    thirteen: at(3), // 3-07 (phase)
    stayed: frac(3, 0.55), // 3-08 (phase)
    touched: at(4), // 3-09
    wind: at(5), // 3-10
    races: frac(5, 0.5), // 3-11 (phase)
    spikes: at(6), // 3-12
    far: at(7), // 3-13
    nine: frac(7, 0.45), // 3-14 (phase)
    radius: p(7, "The Sun's own radius"),
    earths: at(8), // 3-15
  };
};
export type CL03 = ReturnType<typeof cuesL03>;

/** Corona seen side-on (Sun at the LEFT): amber at the limb → violet → deep indigo at the right. */
const SideCorona: React.FC = () => <Sky stops={["#F2A03A", "#B2287A", "#5B1E8F", "#2A0E5C", "#1B0B4F"]} angle={0} />;

// ===============================================================================================================
// 3-01 + 3-02 · corona: the camera pans along the RADII ruler to the probe at ABOUT 9 (DISTANCE dial reads it); then the
// space bar from the Sun's centre to Earth with the probe's sliver: under 5 % + OUR SUM.
// MOVER: wind streaks radial off the limb (22 px/f) + the pan (ruler, limb edge) → bar drawing head (40 px/f) + streaks.
// ===============================================================================================================
const ShotRadii: ShotFC<CL03> = ({ f, len, c }) => {
  const ph = c.counted - c.radii;
  const R = 2600;
  const edge = 200;
  const probeX = xAtR(RADII.pass /* #22 */, 0, edge);
  const cam = cameraAt(f, [
    { f: 0, x: 520, y: 540, zoom: 1.06 },
    { f: ph, x: 1000, y: 540, zoom: 1.0 },
  ]);
  const g = f - ph;
  const fade = ez(g, 0, 14);
  const B = () => {
    const sunX = 150;
    const earthX = 1780;
    const by = 560;
    const head = lerp(sunX, earthX, ez(g, 4, 46));
    const sliver = sunX + ((RADII.pass + 1) / RADII.au) * (earthX - sunX); // #1 #22: from the centre, to scale on the bar
    const k = ez(g, 40, 80);
    const pulse = 1 + 0.18 * Math.sin(g / 4);
    const cam2 = cameraAt(g, [
      { f: 0, x: 960, y: 540, zoom: 1.22 },
      { f: 60, x: 960, y: 540, zoom: 1.0 },
      { f: len - ph, x: 940, y: 545, zoom: 0.97 },
    ]);
    return (
      <Stage theme={SPACE.theme} cam={cam2} vignette={0.25} grain={0.4}>
        <Layer depth={0.3}>
          <SpaceField f={g} seed={3} />
        </Layer>
        <Layer depth={1}>
          <WindStreaks f={g} cx={sunX} cy={by} r0={80} rMax={1900} a0={-22} a1={22} speed={22} count={46} len={150} width={6} opacity={0.55} seed={4} />
          <Bloom x={sunX} y={by} r={260} color={C.amber} strength={0.7} />
          <defs>
            <radialGradient id="l03sun">
              {sunGradient(60).map(([o, cc], i) => (
                <stop key={i} offset={o} stopColor={cc} />
              ))}
            </radialGradient>
          </defs>
          <circle cx={sunX} cy={by} r={60} fill="url(#l03sun)" />
          <rect x={sunX} y={by - 11} width={Math.max(0, head - sunX)} height={22} rx={11} fill={alpha(C.saffron, 0.85)} />
          {head < earthX - 2 ? <circle cx={head} cy={by} r={16} fill={C.saffronCore} stroke={C.saffron} strokeWidth={4} /> : null}
          <rect x={sunX} y={by - 11 * pulse - 4} width={sliver - sunX} height={22 * pulse + 8} rx={8} fill={C.gold} opacity={ez(g, 30, 40)} />
          <line x1={sliver} y1={by - 30} x2={sliver} y2={by - 110} stroke={C.gold} strokeWidth={3} opacity={ez(g, 34, 44)} />
          <text x={sliver + 10} y={by - 118} style={{ fontFamily: "'Anton', sans-serif", fontSize: 26, letterSpacing: 2.5, fill: C.gold }} opacity={ez(g, 34, 44)}>
            CLOSEST PASS
          </text>
          <Planet x={earthX} y={by} r={20} f={g} kind="earth" />
          <text x={earthX} y={by + 62} textAnchor="middle" style={{ fontFamily: "'Anton', sans-serif", fontSize: 24, letterSpacing: 3, fill: C.cyan }} opacity={ez(g, 40, 50)}>
            EARTH
          </text>
          <text x={960} y={by + 120} textAnchor="middle" style={{ fontFamily: "'Anton', sans-serif", fontSize: 20, letterSpacing: 3, fill: alpha(C.lavender, 0.9) }}>
            DISTANCE TO SCALE · SUN AND EARTH ENLARGED
          </text>
        </Layer>
        <Layer depth={0}>
          <Readout x={640} y={300} text={READ.under5.text} shown={`under ${rollText(5, k)} %`} size={96} F={SPACE} opacity={ez(g, 30, 42)} />
          <OurSumPill x={640} y={390} size={26} appear={ez(g, 44, 54)} />
        </Layer>
      </Stage>
    );
  };
  return (
    <>
      <Pop f={f}>
        <Stage theme={CORONA.theme} cam={cam} vignette={0.22} grain={0.4}>
          <Layer depth={0.2}>
            <SideCorona />
          </Layer>
          <Layer depth={1}>
            <CoronaHalo f={f} cx={edge - R} cy={560} R={R} extent={900} loops={5} a0={-13} a1={13} />
            <WindStreaks f={f} cx={edge - R} cy={560} r0={R + 40} rMax={R + 2600} a0={-22} a1={22} speed={22} count={70} len={180} width={7} seed={2} />
            <SideSun f={f} edge={edge} y={560} R={R} />
            <RadiiRuler f={f} y={660} origin={edge} pxPerR={80} />
            <Probe x={probeX} y={470 + Math.sin(f / 14) * 6} size={160} f={f} />
            <Bloom x={probeX - 40} y={470} r={130} color={C.gold} strength={0.35} />
          </Layer>
          <Layer depth={0}>
            <Tag x={1000} y={150} text="ABOUT 9 RADII" F={CORONA} dot={C.saffron} size={34} opacity={ez(f, 24, 36)} />
            <Tag x={1000} y={232} text="ABOVE THE SURFACE" F={CORONA} size={30} opacity={ez(f, 34, 46)} />
            <L16DialsHUD f={f} family={CORONA} theme="dark" only={["distance"]} distance={{ value: distanceValue(RADII.pass), readout: READ.about9short.text, appear: ez(f, 6, 22) }} />
          </Layer>
        </Stage>
      </Pop>
      {g >= 0 ? <AbsoluteFill style={{ opacity: fade }}>{B()}</AbsoluteFill> : null}
    </>
  );
};

// ===============================================================================================================
// 3-03 · the halo swells and the coronal loops rise (CORONA); then the probe climbs outward, the halo whitens round it and
// the HEAT needle climbs (HOTTER THE FARTHER OUT, NASA's words). Tick points up, then nods, puzzled.
// MOVER: loops rising (scale-up from the limb) + wind streaks (22 px/f) + the camera tilting up with the probe (≈ 7 px/f).
// ===============================================================================================================
const ShotCorona: ShotFC<CL03> = ({ f, len, c }) => {
  const hot = c.hotter - c.corona;
  const cx = 960;
  const cy = 3150;
  const R = 2400;
  const rise = ez(f, 0, 55);
  const out = ez(f, 70, len);
  const py = lerp(650, -330, out);
  const px = lerp(1280, 1390, out);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 600, zoom: 1.04 },
    { f: 60, x: 960, y: 470, zoom: 1.0 },
    { f: len, x: 1010, y: -60, zoom: 1.02 },
  ]);
  const heat = lerp(0.3, 0.82, ez(f, 70, len - 10));
  return (
    <Pop f={f}>
      <Stage theme={CORONA.theme} cam={cam} vignette={0.2} grain={0.4}>
        <Layer depth={0.5}>
          <TallSky top={-1500} bottom={1300} stops={["#0E0430", "#1B0B4F", "#3A1470", "#5B1E8F", "#8E2A7E", "#B2287A", "#F2A03A"]} />
        </Layer>
        <Layer depth={1}>
          <g transform={`translate(0 ${cy - R}) scale(1 ${lerp(0.55, 1, rise).toFixed(3)}) translate(0 ${-(cy - R)})`}>
            <CoronaHalo f={f} cx={cx} cy={cy} R={R} extent={lerp(600, 1100, rise)} loops={6} a0={-112} a1={-68} intensity={lerp(0.7, 1, rise)} />
          </g>
          <WindStreaks f={f} cx={cx} cy={cy} r0={R + 30} rMax={R + 2600} a0={-118} a1={-62} speed={22} count={72} len={180} width={7} seed={6} />
          <SunLimb f={f} cx={cx} cy={cy} R={R} />
          {/* the halo whitening round the probe as it climbs (amber → white-gold) */}
          <Bloom x={px} y={py} r={lerp(160, 420, out)} color={mixHex(C.amber, C.whiteGold, out)} strength={0.25 + 0.5 * out} />
          <Probe x={px} y={py} size={150} f={f} tilt={90} trail={0} />
        </Layer>
        <Layer depth={0}>
          <Tag x={760} y={130} text="CORONA" F={CORONA} dot={C.gold} size={36} opacity={ez(f, 20, 32)} />
          <Tag x={760} y={215} text="HOTTER THE FARTHER OUT" F={CORONA} size={30} opacity={ez(f, hot, hot + 12)} />
          <SourceChip x={760} y={285} text="NASA" size={20} appear={ez(f, hot + 6, hot + 18)} />
          <Ledge
            x={1690}
            y={920}
            f={f}
            pxPerM={86}
            facing={-1}
            pose="point"
            poseTo="think"
            poseT={ez(f, hot + 10, hot + 26)}
            staff
            expression="happy"
            expressionTo="thinking"
            expressionT={ez(f, hot + 10, hot + 24)}
            look={0.9}
            headTilt={f > hot + 20 ? Math.sin((f - hot) / 6) * 7 : -6}
          />
          <L16DialsHUD f={f} family={CORONA} only={["heat"]} heat={{ value: heat, appear: ez(f, 4, 18) }} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 3-04 · Tick draws the dotted Alfvén boundary along the halo's edge; the label drops in (ALFVÉN SURFACE).
// MOVER: the boundary's drawing head (≈ 60 px/f) → its wobble (7 px/f) + wind streaks (22 px/f) + label drop (30 px/f).
// ===============================================================================================================
const ShotBoundary: ShotFC<CL03> = ({ f, len }) => {
  const cx = 960;
  const cy = 3000;
  const draw = lin(f, 8, 50);
  const drop = ez(f, 46, 58);
  return (
    <Pop f={f}>
      <Stage theme={CORONA.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0.02, panY: 0.01, frames: len + 30, seed: 3 }} vignette={0.2} grain={0.4}>
        <Layer depth={0.3}>
          <Sky family={CORONA} />
        </Layer>
        <Layer depth={1}>
          <CoronaHalo f={f} cx={cx} cy={cy} R={2300} extent={900} loops={5} a0={-112} a1={-68} />
          <WindStreaks f={f} cx={cx} cy={cy} r0={2320} rMax={4800} a0={-120} a1={-60} speed={22} count={60} len={170} width={6} seed={8} opacity={0.75} />
          <SunLimb f={f} cx={cx} cy={cy} R={2300} />
          <Alfven f={f} cx={cx} cy={cy} R={2720} a0={-122} a1={-58} wobble={30} draw={draw} color={C.gold} />
        </Layer>
        <Layer depth={0}>
          <Tag x={960} y={lerp(-60, 150, drop)} text="ALFVÉN SURFACE" F={CORONA} dot={C.gold} size={36} align="middle" opacity={drop > 0 ? 1 : 0} />
          <Ledge x={300} y={940} f={f} pxPerM={88} facing={1} pose="point" staff expression="determined" look={-0.6} headTilt={-12 + Math.sin(f / 7) * 4} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 3-05 · space: the calendar card 28 APR 2021 drops in over the orbit, pages flipping; the probe's path arcs toward the Sun
// (8TH PASS). MOVER: calendar pages (≈ 40 px/f) + the path's drawing head (≈ 24 px/f) + wind streaks.
// ===============================================================================================================
const ShotApril: ShotFC<CL03> = ({ f, len }) => {
  const sun: Pt = [330, 610];
  const path: Pt[] = Array.from({ length: 41 }, (_, i) => {
    const u = i / 40;
    const a = lerp(-0.55, 2.35, u);
    const rx = lerp(1300, 260, Math.pow(u, 0.8));
    const ry = lerp(520, 190, Math.pow(u, 0.8));
    return [sun[0] + Math.cos(a) * rx * 0.95 + 60, sun[1] + Math.sin(-a) * ry * -1 - 40];
  });
  const head = ez(f, 2, len - 6);
  const n = Math.max(2, Math.round(head * 40));
  const drawn = path.slice(0, n);
  const hp = drawn[drawn.length - 1];
  const calY = lerp(-420, 110, ez(f, 0, 14));
  return (
    <Pop f={f}>
      <Stage theme={SPACE.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.02, panY: 0.01, frames: len + 30, seed: 4 }} vignette={0.25} grain={0.4}>
        <Layer depth={0.3}>
          <SpaceField f={f} seed={5} />
        </Layer>
        <Layer depth={1}>
          <WindStreaks f={f} cx={sun[0]} cy={sun[1]} r0={150} rMax={1800} a0={-180} a1={180} speed={20} count={50} len={130} width={5} seed={9} opacity={0.5} />
          <Bloom x={sun[0]} y={sun[1]} r={420} color={C.amber} strength={0.75} />
          <defs>
            <radialGradient id="l03sun5">
              {sunGradient(150).map(([o, cc], i) => (
                <stop key={i} offset={o} stopColor={cc} />
              ))}
            </radialGradient>
          </defs>
          <circle cx={sun[0]} cy={sun[1]} r={150} fill="url(#l03sun5)" />
          <path d={smoothPath(path, 0.5)} fill="none" stroke={alpha(C.lavender, 0.25)} strokeWidth={3} strokeDasharray="6 12" />
          <path d={smoothPath(drawn, 0.5)} fill="none" stroke={C.gold} strokeWidth={7} strokeLinecap="round" />
          <circle cx={hp[0]} cy={hp[1]} r={12} fill={C.saffronCore} stroke={C.saffron} strokeWidth={4} />
          <Probe x={hp[0]} y={hp[1] - 50} size={90} f={f} tilt={-20} />
        </Layer>
        <Layer depth={0}>
          <Calendar x={560} y={calY} w={320} f={f} text={READ.e8date.text} />
          <Tag x={720} y={calY + 370}text={READ.e8pass.text} F={SPACE} dot={C.saffron} size={32} align="middle" opacity={ez(f, 18, 28)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 3-06 + 3-07 + 3-08 · on the ruler, zoomed in on the boundary: the probe crosses the dotted line inward, the boundary
// flashes, Tick cheers; the view pulls back to the whole ruler and Tick stretches the bracket from the crossing to the
// SURFACE (13 million km · 18.8 RADII); then a clock wedge sweeps five hours while the probe tracks along under the line.
// MOVER: the probe crossing (≈ 11 px/f) + ruler ticks + flash → the zoom-out and the bracket head (≈ 29 px/f) with Tick
// walking it → the clock wedge + hand (3°/f) + the probe tracking; wind streaks (22 px/f) throughout.
// ===============================================================================================================
const ShotCrossing: ShotFC<CL03> = ({ f, len, c }) => {
  const b1 = c.thirteen - c.below;
  const b2 = c.stayed - c.below;
  const zoom = ez(f, b1, b1 + 40);
  const P = lerp(400, 80, zoom);
  const XB = lerp(1100, 1660, zoom);
  const origin = XB - RADII.alfven * P; // #9: the boundary sits at 18.8 radii
  const X = (r: number) => origin + r * P;
  const rProbe = f < 60 ? lerp(20.0, 18.4, ez(f, 0, 60)) : 18.4;
  const crossAt = 44;
  const bDraw = lin(f, b1 + 42, b1 + 92);
  const headX = X(18.4) + (X(0) - X(18.4)) * (bDraw * bDraw * (3 - 2 * bDraw));
  const trackY = f > b2 ? lerp(470, 170, ez(f, b2 + 4, len)) : 470;
  const py = f > b2 ? trackY : 470 + Math.sin(f / 12) * 5;
  const px = X(rProbe) - (f > b2 ? 30 : 0);
  const hours = (READ.belowHours.value as number) * ez(f, b2 + 10, b2 + 80); // #9: about five hours
  const k13 = ez(f, b1 + 46, b1 + 66);
  const tickX = f < b1 ? 560 : bDraw > 0 ? headX + 50 + 100 * bDraw : lerp(560, X(18.4) - 70, ez(f, b1 + 10, b1 + 40));
  const walking = bDraw > 0 && bDraw < 1;
  const textB = ez(f, b1 + 46, b1 + 58) * (1 - ez(f, b2, b2 + 10));
  const textC = ez(f, b2 + 8, b2 + 20);
  return (
    <Pop f={f}>
      <Stage theme={CORONA.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.01, panY: 0.01, frames: len + 30, seed: 5 }} vignette={0.22} grain={0.4}>
        <Layer depth={0.2}>
          <SideCorona />
        </Layer>
        <Layer depth={1}>
          <WindStreaks f={f} mode="sweep" angle={0} box={{ x: -200, y: -100, w: 2320, h: 1280 }} speed={22} count={60} len={190} width={6} seed={11} opacity={0.7} />
          {origin > -300 ? <SideSun f={f} edge={origin} y={560} R={2600} /> : null}
          <AlfvenFlat f={f} x={XB} y={-60} h={1200} wobble={30} color={C.gold} />
          <Bloom x={XB} y={520} r={260} color={C.gold} strength={0.18} />
          {f - crossAt >= 0 && f - crossAt < 30 ? (
            <g>
              <Bloom x={XB} y={470} r={60 + (f - crossAt) * 9} color={C.whiteGold} strength={1 - (f - crossAt) / 30} />
              <circle cx={XB} cy={470} r={20 + (f - crossAt) * 10} fill="none" stroke={C.whiteGold} strokeWidth={8 * (1 - (f - crossAt) / 30) + 1} opacity={1 - (f - crossAt) / 30} />
            </g>
          ) : null}
          <RadiiRuler f={f} y={660} origin={origin} pxPerR={P} brackets={bDraw > 0 ? [{ r0: 18.4, r1: 0, draw: bDraw }] : []} />
          <Probe x={px} y={py} size={lerp(170, 120, zoom)} f={f} trail={f < 60 ? 160 : 60} />
          <Tick
            x={tickX}
            y={652}
            pxPerM={lerp(80, 70, zoom)}
            frame={f}
            facing={-1}
            pose={f < b1 ? "cheer" : walking ? "heave" : f > b2 ? "hips" : "stand"}
            walk={walking ? f / 12 : undefined}
            expression={f < b1 ? "happy" : walking ? "determined" : "proud"}
            look={0.4}
            squash={impact(f, crossAt + 2, 0.12, 10)}
          />
          {f > b2 ? <Clock x={1140} y={300} r={140} f={f} hours={hours} /> : null}
        </Layer>
        <Layer depth={0}>
          <Readout x={470} y={300} text={READ.alfvenKm.text} shown={`${rollText(13, k13)} million km`} size={84} F={CORONA} opacity={textB} />
          <Tag x={470} y={400} text="18.8 RADII" F={CORONA} dot={C.gold} size={32} opacity={textB} />
          <Readout x={430} y={300} text={READ.belowHours.text} shown={`${rollText(5, ez(f, b2 + 10, b2 + 80))} hours`} size={92} F={CORONA} opacity={textC} />
          <AboutPill x={430} y={390} size={26} appear={textC} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 3-09 · the probe's nose meets the boundary: a spark burst, the green MEASURED stamp slams on the crossing (F2: the probe's
// own reading), NASA's words as a banner. Tick both fists up. (The 1-s HOLD after line 27 lets it land.)
// MOVER: spark bursts radiating (20 px/f, re-firing) + stamp slam (40 px/f) + wind streaks (22 px/f).
// ===============================================================================================================
const ShotTouch: ShotFC<CL03> = ({ f, len }) => {
  const cx = 960;
  const cy = 2600;
  const hit = 18;
  const dip = ez(f, 0, hit);
  const py = lerp(360, 520, dip) + (f > hit ? Math.sin((f - hit) / 10) * 6 : 0);
  const reburst = f > hit + 40 ? (f - hit - 40) % 46 : -1;
  return (
    <Pop f={f}>
      <Stage theme={CORONA.theme} shotFrame={f} drift={{ zoom: 1.08, panX: 0.015, panY: 0.01, frames: len + 30, seed: 6 }} vignette={0.2} grain={0.4}>
        <Layer depth={0.3}>
          <Sky family={CORONA} />
        </Layer>
        <Layer depth={1}>
          <CoronaHalo f={f} cx={cx} cy={cy} R={1660} extent={800} loops={5} a0={-120} a1={-60} />
          <WindStreaks f={f} cx={cx} cy={cy} r0={1680} rMax={4200} a0={-140} a1={-40} speed={22} count={70} len={170} width={6} seed={12} />
          <SunLimb f={f} cx={cx} cy={cy} R={1660} />
          <Alfven f={f} cx={cx} cy={cy} R={2060} a0={-150} a1={-30} wobble={26} cross={{ angle: -90, age: f - hit }} color={C.gold} />
          <Probe x={cx} y={py} size={210} f={f} tilt={90} />
          <Burst x={cx} y={545} age={f - hit} n={18} speed={20} life={32} r={11} />
          {reburst >= 0 ? <Burst x={cx + 30} y={548} age={reburst} n={12} speed={18} life={28} r={9} seed={reburst > 0 ? 5 : 4} /> : null}
          <StateStamp x={1270} y={650} state="measured" age={f - hit - 8} size={230} rotate={-10} />
        </Layer>
        <Layer depth={0}>
          <Tag x={960} y={120} text="FIRST TIME A SPACECRAFT TOUCHED THE SUN" F={CORONA} dot={C.gold} size={34} align="middle" opacity={ez(f, hit + 14, hit + 26)} />
          <SourceChip x={960} y={196} text="NASA" size={22} align="middle" appear={ez(f, hit + 22, hit + 32)} />
          <Ledge x={1660} y={930} f={f} pxPerM={90} facing={-1} pose="cheer" expression="happy" look={0.3} squash={impact(f, hit + 8, 0.16, 12)} headTilt={Math.sin(f / 5) * 6} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 3-10 + 3-11 · the boundary wobbles; inside SOLAR ATMOSPHERE, outside SOLAR WIND; particles cross and turn into wind
// streaks. Then the camera pans right with the wind across the dark to a tiny Earth.
// MOVER: particles drifting in (6 px/f) and racing out (22 px/f) + wobble (7 px/f) → whole-frame wind (28 px/f) + the pan.
// ===============================================================================================================
const ShotWind: ShotFC<CL03> = ({ f, len, c }) => {
  const ph = c.races - c.wind;
  const g = Math.max(0, f - ph);
  const pan = 2200 * ez(g, 0, 130);
  const bx = 1000 - pan;
  const toSpace = ez(g, 0, 60);
  const T = 190;
  const parts = Array.from({ length: 30 }, (_, i) => {
    const s = (rnd(i * 7 + 1) * T + f) % T;
    const t1 = 140;
    const x = s < t1 ? 150 + 6 * s : 1000 + 22 * (s - t1);
    const y = 120 + rnd(i * 13 + 2) * 840 + Math.sin(f / 13 + i) * 10;
    return { x: x - pan, y, out: s >= t1 };
  });
  return (
    <Pop f={f}>
      <Stage theme={(toSpace > 0.5 ? SPACE : CORONA).theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.01, panY: 0.01, frames: len + 30, seed: 7 }} vignette={0.22} grain={0.4}>
        <Layer depth={0.2}>
          <SpaceField f={f} seed={8} />
          <g opacity={1 - toSpace}>
            <SideCorona />
          </g>
        </Layer>
        <Layer depth={1}>
          {bx > -600 ? <SideSun f={f} edge={140 - pan} y={560} R={2600} /> : null}
          <WindStreaks f={f} mode="sweep" angle={0} box={{ x: Math.max(-200, bx), y: -100, w: 2320, h: 1280 }} speed={f > ph ? 28 : 22} count={f > ph ? 90 : 46} len={200} width={7} seed={13} opacity={0.85} />
          {bx > -200 ? <AlfvenFlat f={f} x={bx} y={-60} h={1200} wobble={40} color={C.gold} /> : null}
          {parts.map((q, i) =>
            q.x < -40 || q.x > 2000 ? null : q.out ? (
              <path key={i} d={`M${q.x - 110} ${q.y} L${q.x} ${q.y - 7} L${q.x} ${q.y + 7} Z`} fill={alpha(C.gold, 0.9)} />
            ) : (
              <circle key={i} cx={q.x} cy={q.y} r={11} fill={C.whiteGold} opacity={0.9} />
            ),
          )}
          <Bloom x={3950 - pan} y={600} r={160} color={C.cyan} strength={0.7} />
          <Planet x={3950 - pan} y={600} r={30} f={f} kind="earth" />
        </Layer>
        <Layer depth={0}>
          <g opacity={1 - ez(g, 0, 20)}>
            <Tag x={560} y={150} text="SOLAR ATMOSPHERE" F={CORONA} dot={C.gold} size={32} align="middle" opacity={ez(f, 14, 26)} />
            <Tag x={1460} y={150} text="SOLAR WIND" F={CORONA} dot={C.amber} size={32} align="middle" opacity={ez(f, 30, 42)} />
          </g>
          <g opacity={ez(g, 90, 110)}>
            <text x={3950 - pan} y={690} textAnchor="middle" style={{ fontFamily: "'Anton', sans-serif", fontSize: 28, letterSpacing: 3, fill: C.cyan }}>
              EARTH
            </text>
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 3-12 · the boundary grows spikes and valleys; Tick on his ledge measures one spike with a rod that follows its tip.
// MOVER: spikes growing and shrinking (≈ 17 px/f, amp 160) + the measuring rod's top + wind streaks.
// ===============================================================================================================
const ShotSpikes: ShotFC<CL03> = ({ f, len }) => {
  const grow = ez(f, 6, 50);
  const ly = 470;
  const k = 5;
  const tip = spikeTipY(f, ly, k, 160, grow);
  const rx = tip.x;
  return (
    <Pop f={f}>
      <Stage theme={CORONA.theme} shotFrame={f} drift={{ zoom: 1.07, panX: 0.015, panY: 0.01, frames: len + 30, seed: 8 }} vignette={0.2} grain={0.4}>
        <Layer depth={0.3}>
          <Sky family={CORONA} />
        </Layer>
        <Layer depth={1}>
          <CoronaHalo f={f} cx={960} cy={2800} R={1900} extent={900} loops={5} a0={-115} a1={-65} intensity={0.9} />
          <WindStreaks f={f} cx={960} cy={2800} r0={1920} rMax={4600} a0={-130} a1={-50} speed={22} count={64} len={170} width={6} seed={14} opacity={0.75} />
          <SunLimb f={f} cx={960} cy={2800} R={1900} />
          <SpikyLine f={f} y={ly} amp={160} grow={grow} />
          {/* the measuring rod: from Tick's ledge up to the spike's tip */}
          <line x1={rx} y1={tip.y} x2={rx} y2={880} stroke={C.saffron} strokeWidth={10} strokeLinecap="round" opacity={ez(f, 30, 44)} />
          {Array.from({ length: 12 }, (_, i) => {
            const yy = 880 - i * 34;
            return yy > tip.y ? <line key={i} x1={rx - 14} y1={yy} x2={rx + 14} y2={yy} stroke={C.saffronCore} strokeWidth={3} opacity={ez(f, 30, 44)} /> : null;
          })}
          <circle cx={rx} cy={tip.y} r={12} fill={C.saffronCore} stroke={C.saffron} strokeWidth={4} opacity={ez(f, 30, 44)} />
        </Layer>
        <Layer depth={0}>
          <Tag x={110} y={130} text="SPIKES AND VALLEYS" F={CORONA} dot={C.gold} size={34} opacity={ez(f, 20, 32)} />
          <SourceChip x={110} y={205} text="NASA" size={20} appear={ez(f, 28, 40)} />
        </Layer>
        <Layer depth={1}>
          <Ledge x={rx + 110} y={890} f={f} pxPerM={88} facing={-1} pose="hold" staff expression="surprised" look={0.8} headTilt={-14 + Math.sin(f / 8) * 5} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 3-13 + 3-14 · glow: the limb fills the lower half, the probe far above, a bracket between them (ABOUT 9 RADII, a break
// mark: not to scale). Then, to scale: nine rods each one solar radius drop into a ladder from the limb to the probe; one
// radius is drawn from the centre; 695,700 km.
// MOVER: bracket drawing (30 px/f) + granules + wind streaks (22 px/f) → rods dropping (≈ 58 px/f, stagger 8 f) + radius
// line + counter + wind streaks.
// ===============================================================================================================
const ShotNine: ShotFC<CL03> = ({ f, len, c }) => {
  const ph = c.nine - c.far;
  const rad = c.radius - c.far;
  const g = f - ph;
  const cx = 960;
  const cy = 2750;
  const R = 2100;
  const pxp = 1240;
  const surfY = cy - Math.sqrt(R * R - (pxp - cx) * (pxp - cx));
  const br = lin(f, 20, 40);
  const camA = cameraAt(f, [
    { f: 0, x: 960, y: 640, zoom: 1.04 },
    { f: 70, x: 960, y: 520, zoom: 1.0 },
    { f: ph + 14, x: 960, y: 500, zoom: 0.98 },
  ]);
  const sunX = 190;
  const sy = 600;
  const r = 150;
  const B = () => {
    const rods = Array.from({ length: 9 }, (_, i) => {
      const t0 = 6 + i * 8;
      const k = ez(g, t0, t0 + 12);
      return { x: sunX + r + i * r, y: lerp(-160, sy, k), k, land: g - t0 - 12 };
    });
    const rl = ez(g, rad - ph, rad - ph + 14);
    const kc = ez(g, rad - ph + 6, rad - ph + 50);
    const ang = -55 * (Math.PI / 180);
    return (
      <Stage theme={CORONA.theme} shotFrame={g} drift={{ zoom: 1.04, panX: 0.012, panY: 0.008, frames: len - ph + 30, seed: 9 }} vignette={0.22} grain={0.4}>
        <Layer depth={0.2}>
          <SideCorona />
        </Layer>
        <Layer depth={1}>
          <WindStreaks f={g} cx={sunX} cy={sy} r0={r + 10} rMax={2000} a0={-40} a1={40} speed={22} count={60} len={160} width={6} seed={15} opacity={0.7} />
          <Bloom x={sunX} y={sy} r={420} color={C.amber} strength={0.75} />
          <defs>
            <radialGradient id="l03sun14">
              {sunGradient(r).map(([o, cc], i) => (
                <stop key={i} offset={o} stopColor={cc} />
              ))}
            </radialGradient>
          </defs>
          <circle cx={sunX} cy={sy} r={r} fill="url(#l03sun14)" />
          {rods.map((q, i) => (
            <g key={i} opacity={q.k > 0 ? 1 : 0}>
              <rect x={q.x + 3} y={q.y - 13} width={r - 6} height={26} rx={8} fill={i % 2 ? C.amber : C.gold} stroke={C.ink} strokeWidth={3} />
              <rect x={q.x + 8} y={q.y - 9} width={r - 16} height={6} rx={3} fill={C.whiteGold} opacity={0.7} />
              {q.land >= 0 && q.land < 10 ? <circle cx={q.x + r / 2} cy={q.y} r={20 + q.land * 7} fill="none" stroke={C.whiteGold} strokeWidth={4} opacity={1 - q.land / 10} /> : null}
            </g>
          ))}
          <Probe x={sunX + r + RADII.pass * r} y={sy - 90 + Math.sin(g / 12) * 5} size={120} f={g} />
          {rl > 0 ? (
            <g>
              <line x1={sunX} y1={sy} x2={sunX + Math.cos(ang) * r * rl} y2={sy + Math.sin(ang) * r * rl} stroke={C.ink} strokeWidth={12} strokeLinecap="round" opacity={0.4} />
              <line x1={sunX} y1={sy} x2={sunX + Math.cos(ang) * r * rl} y2={sy + Math.sin(ang) * r * rl} stroke={C.violet} strokeWidth={7} strokeLinecap="round" />
              <circle cx={sunX} cy={sy} r={9} fill={C.violet} />
              <line x1={sunX + Math.cos(ang) * r} y1={sy + Math.sin(ang) * r} x2={560} y2={300} stroke={alpha(C.paper, 0.8)} strokeWidth={3} opacity={ez(g, rad - ph + 10, rad - ph + 20)} />
            </g>
          ) : null}
          <text x={sunX + r + 4.5 * r} y={sy + 70} textAnchor="middle" style={{ fontFamily: "'Anton', sans-serif", fontSize: 24, letterSpacing: 3, fill: C.paper }} opacity={ez(g, 80, 92)}>
            EACH ROD = ONE SUN RADIUS
          </text>
        </Layer>
        <Layer depth={0}>
          <Readout x={600} y={310} text={READ.sunRadius.text} shown={`${rollText(695700, kc)} km`} size={90} F={CORONA} opacity={ez(g, rad - ph + 6, rad - ph + 16)} />
        </Layer>
      </Stage>
    );
  };
  return (
    <>
      <Pop f={f}>
        <Stage theme={GLOW.theme} cam={camA} vignette={0.18} grain={0.4}>
          <Layer depth={0.3}>
            <Sky family={GLOW} />
          </Layer>
          <Layer depth={1}>
            <WindStreaks f={f} cx={cx} cy={cy} r0={R + 20} rMax={R + 2400} a0={-125} a1={-55} speed={22} count={64} len={170} width={6} seed={16} opacity={0.8} />
            <SunLimb f={f} cx={cx} cy={cy} R={R} drift={6} />
            <Probe x={pxp} y={170} size={130} f={f} tilt={90} />
            {/* the bracket from the probe down to the surface, with a break mark (this view is not to scale) */}
            <g stroke={C.saffron} strokeLinecap="round" fill="none">
              <line x1={pxp - 16} y1={240} x2={pxp + 16} y2={240} strokeWidth={5} />
              <line x1={pxp} y1={240} x2={pxp} y2={lerp(240, surfY - 6, br)} strokeWidth={5} />
              {br >= 1 ? <line x1={pxp - 16} y1={surfY - 6} x2={pxp + 16} y2={surfY - 6} strokeWidth={5} /> : null}
              {br > 0.6 ? (
                <g strokeWidth={5}>
                  <line x1={pxp - 18} y1={445} x2={pxp + 18} y2={425} />
                  <line x1={pxp - 18} y1={462} x2={pxp + 18} y2={442} />
                </g>
              ) : null}
            </g>
            {br > 0 && br < 1 ? <circle cx={pxp} cy={lerp(240, surfY - 6, br)} r={10} fill={C.saffronCore} /> : null}
          </Layer>
          <Layer depth={0}>
            <Tag x={1320} y={380} text="ABOUT 9 RADII" F={GLOW} dot={C.saffron} size={34} opacity={ez(f, 34, 46)} />
            <Tag x={1320} y={460} text="NOT TO SCALE" F={GLOW} size={24} opacity={ez(f, 44, 56)} />
          </Layer>
        </Stage>
      </Pop>
      {g >= 0 ? <AbsoluteFill style={{ opacity: ez(g, 0, 12) }}>{B()}</AbsoluteFill> : null}
    </>
  );
};

// ===============================================================================================================
// 3-15 · glow, close on the disc: 109 Earth dots pop in a row across its width; the counter climbs to 109.
// MOVER: dots popping in a row (≈ 17 px/f across) + counter + granules + pull-back.
// ===============================================================================================================
const ShotEarths: ShotFC<CL03> = ({ f, len }) => {
  const n = READ.earths109.value as number; // #15
  const r = 7;
  const gap = 0.3;
  const W = n * (2 * r + gap);
  const x0 = 960 - W / 2;
  const R = W / 2 + 6;
  const ap = lin(f, 6, 92);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.2 },
    { f: len, x: 960, y: 540, zoom: 1.0 },
  ]);
  const disc = `M${960 - R} 600 a${R} ${R} 0 1 0 ${2 * R} 0 a${R} ${R} 0 1 0 ${-2 * R} 0 Z`;
  return (
    <Pop f={f}>
      <Stage theme={GLOW.theme} cam={cam} vignette={0.2} grain={0.4}>
        <Layer depth={0.3}>
          <Sky family={GLOW} />
        </Layer>
        <Layer depth={1}>
          <Bloom x={960} y={600} r={R + 300} color={C.amber} strength={0.6} />
          <defs>
            <radialGradient id="l03disc15">
              {sunGradient(R).map(([o, cc], i) => (
                <stop key={i} offset={o} stopColor={cc} />
              ))}
            </radialGradient>
          </defs>
          <circle cx={960} cy={600} r={R} fill="url(#l03disc15)" />
          <Granules f={f} x={960 - R} y={-200} w={2 * R} h={1400} size={110} drift={6} clip={disc} seed={9} colors={[alpha(C.tangerine, 0), C.amber, C.whiteGold]} opacity={0.5} />
          <rect x={x0 - 24} y={600 - 26} width={W + 48} height={52} rx={26} fill={alpha(C.indigo, 0.55)} />
          <EarthRow x={x0} y={600} n={n} r={r} gap={gap} f={f} appear={ap} />
        </Layer>
        <Layer depth={0}>
          <Readout x={960} y={250} text={READ.earths109.text} shown={`${Math.round(n * ap)} Earths`} size={100} F={GLOW} align="middle" opacity={ez(f, 4, 14)} />
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
    { from: 0, S: ShotRadii, id: "3-01" }, // + 3-02
    { from: c.corona, S: ShotCorona, id: "3-03" },
    { from: c.boundary, S: ShotBoundary, id: "3-04" },
    { from: c.april, S: ShotApril, id: "3-05" },
    { from: c.below, S: ShotCrossing, id: "3-06" }, // + 3-07, 3-08
    { from: c.touched, S: ShotTouch, id: "3-09" },
    { from: c.wind, S: ShotWind, id: "3-10" }, // + 3-11
    { from: c.spikes, S: ShotSpikes, id: "3-12" },
    { from: c.far, S: ShotNine, id: "3-13" }, // + 3-14
    { from: c.earths, S: ShotEarths, id: "3-15" },
  ];
  return playShots(f, shots, c, t.frames);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL03 = (t: SceneTiming): Cue[] => {
  const c = cuesL03(t);
  const clicks = (at: number, n: number, gap = 7, vol = 0.06): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 7 }));
  return [
    { at: 4, file: SFX.whoosh, vol: 0.16, dur: 50 },
    ...cutHit(c.counted, 0.12),
    ...clicks(c.counted + 40, 6, 7),
    ...cutHit(c.corona),
    { at: c.corona + 6, file: SFX.swirl, vol: 0.16, dur: 50 },
    ...cutHit(c.boundary),
    { at: c.boundary + 10, file: SFX.click, vol: 0.14, dur: 10 },
    ...cutHit(c.april),
    ...clicks(c.april + 6, 6, 8),
    ...cutHit(c.below),
    { at: c.below + 44, file: SFX.pop, vol: 0.2, dur: 16 },
    ...clicks(c.thirteen + 50, 8, 7),
    ...clicks(c.stayed + 12, 6, 9),
    ...cutHit(c.touched),
    { at: c.touched + 26, file: SFX.boom, vol: 0.3, dur: 120, fadeOut: 30 },
    { at: c.touched + 30, file: SFX.chime, vol: 0.2, dur: 70 },
    ...cutHit(c.wind),
    { at: c.wind + 6, file: SFX.swirl, vol: 0.14, dur: 50 },
    { at: c.races, file: SFX.whoosh, vol: 0.22, dur: 60 },
    ...cutHit(c.spikes),
    { at: c.spikes + 30, file: SFX.pop, vol: 0.18, dur: 16 },
    ...cutHit(c.far),
    { at: c.far + 22, file: SFX.click, vol: 0.14, dur: 10 },
    ...clicks(c.nine + 18, 9, 8, 0.08),
    ...cutHit(c.earths),
    ...clicks(c.earths + 6, 12, 7, 0.05),
  ];
};
