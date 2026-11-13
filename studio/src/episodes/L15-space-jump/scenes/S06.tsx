// L15 scene "l06" (storyboard §3 "6 · From the hundred-kilometre line", script lines 48-54, void → petrol → noon). OUR
// MODEL (#20, class C) throughout: every shot with a model number lights the cluster's OUR MODEL chip or a ModelChip (F5).
// Shot components (hard cuts; SLIDE rows are phases): 6-01 (the ruler replay from the top, the label pinned) · 6-02 (spec
// plate: width bracket, 100 kg, 0.6 m, FIXED DRAG) · 6-03 (release; stars stream, needle climbs) · 6-04+6-05+6-06 (the
// 80, 60, 50 km marks slide past, the counter rolls 618 → 874 → 972) · 6-07 (Mach 3.3 at 40 km; key art l15-key-2) ·
// 6-08 (the peak tick at 36 km) · 6-09 (studio bars: ≈ 3,800 vs 1,357.6 km/h) · 6-10 (the needle turns down) · 6-11
// (into bright sky: 701 and 170 m/s) · 6-12 (landing: ≈ 86 m/s, 4:11) · 6-13 (three traces, the same ending) · 6-14
// (stamp: the air decides) · 6-15 (the 0-50 km band; the peak shrinks into it).
// Numbers drawn, each with its sources.md row: 100 km (#1) · 100 kg, 0.6 m (#20) · 618, 874, 972, 1,043 m/s (#20) ·
// MACH 3.3 (#23) · SOUND 317 m/s (#15 #23) · ≈ 1,050 m/s, ≈ 36 KM (#20) · ≈ 3,800 km/h (#22) · 1,357.6 km/h (#4) · 701,
// 170 m/s at 20, 10 km (#20) · ≈ 86 m/s, 4:11 (#20). Ruler tick numbers are the ruler's scale. F1: the probe falls,
// Tick never does. F7: no glow on the probe.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Bloom, Headline, IF2, Kicker, Layer, Motes, Pill, Puffs, Stage, Tick, alpha, cameraAt, mixHex, rnd, type Pt } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { familyOf, pillFill, skyAt, skyFamily } from "../families";
import { BOUNDARY, JUMPS, MODEL, ORBIT, SOUND, atmAt, modelSpeedAt, mss, pushAt } from "../jumpdata";
import { L15Gauges, L15GaugesHUD, SpeedGauge, airValue, speedValue } from "../L15Gauges";
import { Bracket, Pin, Probe, Stamp, Trace } from "../props";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { AltClouds, Bar, C, CREAM, INK, Ledge, ModelChip, Pop, RollMetric, Rings, STUDIO, SkyView, StudioSet, clamp01, ez, lin, path1, view, vy } from "./c-parts";

export const cuesL06 = (t: SceneTiming) => {
  const { at, p, frac } = cueKit(t);
  return {
    line: 0, // 6-01
    spec: frac(0, 0.45), // 6-02
    release: at(1), // 6-03
    marks: frac(1, 0.45), // 6-04 (+ 6-05, 6-06)
    at80: p(1, "At eighty"),
    at60: p(1, "At sixty"),
    at50: at(2),
    at40: p(2, "And at forty"),
    mach: frac(2, 0.4), // 6-07
    machWord: p(2, "Mach three point three"),
    sound: p(2, "three hundred and seventeen"),
    peak: at(3), // 6-08
    peakWord: p(3, "roughly"),
    bars: frac(3, 0.45), // 6-09
    baum: p(3, "almost three times"),
    drops: p(3, "Then it drops"), // 6-10
    clouds: at(4), // 6-11
    at20: p(4, "at twenty"),
    at10: p(4, "at ten"),
    land: at(5), // 6-12
    at0: p(5, "about eighty-six"),
    four: p(5, "just over four minutes"),
    traces: p(5, "So the hundred"), // 6-13
    same: p(5, "the same ending"),
    decides: at(6), // 6-14
    band: frac(6, 0.45), // 6-15 (storyboard 54@0.45)
    end: t.frames,
  };
};
export type C06 = ReturnType<typeof cuesL06>;

/** The model probe's altitude (km) at a SCENE frame: rest at 100 km until release, then through the line cues (#20). */
const altAt = (c: C06, sf: number) =>
  path1(sf, [
    [c.release, 100],
    [c.release + 30, 98.6],
    [c.at80 + 8, 80],
    [c.at60 + 8, 60],
    [c.at50 + 8, 50],
    [c.at40 + 8, 40],
    [c.peakWord, MODEL.peakKm],
    [c.drops, 33],
    [c.clouds, 24],
    [c.at20 + 8, 20],
    [c.at10 + 8, 10],
    [c.land, 6.5],
  ]);

/** The cluster for a model shot at altitude alt: needles from the #20 model, SOUND mark from soundSpeed(T) (F10). */
const Cluster: React.FC<{ f: number; alt: number; extra?: Partial<React.ComponentProps<typeof L15Gauges>> }> = ({ f, alt, extra }) => {
  const T = atmAt(alt).tC;
  return (
    <L15GaugesHUD
      family={skyFamily(alt)}
      frame={f}
      model
      speed={{ value: speedValue(modelSpeedAt(alt)), soundT: T, max: 1100 }}
      air={{ value: airValue(alt) }}
      push={{ value: pushAt(alt) }}
      cold={{ value: T }}
      {...extra}
    />
  );
};

// ===============================================================================================================
// 6-01 · void: the tall ruler replayed from the top; the camera pans down to the 100 km line where the probe waits, lamp
// on; Tick on a ledge pins the label 'our model, not a record'. MOVER: the camera panning down the ruler (≈ 16 px/f)
// + the label dropping in (20 px/f).
// ===============================================================================================================
const ShotLine: ShotFC<C06> = ({ f, len }) => {
  const altC = 104.6 - 4.4 * ez(f, 0, len * 0.9) - 0.4 * lin(f, len * 0.9, len);
  const v = view(altC, 300);
  const py = vy(v, BOUNDARY.fai);
  const drop = ez(f, 34, 58);
  const lx = 1010;
  const ly = py - 150 - (1 - drop) * 520;
  return (
    <Pop f={f}>
      <Stage theme={skyFamily(110).theme} shotFrame={f} drift={{ zoom: 1.03, panX: 0.006, panY: 0, frames: 200, seed: 2 }} vignette={0.3} grain={0.5}>
        <Layer depth={1}>
          <SkyView f={f} v={v} aurora={0.45} drift={0.6} />
          <Probe x={820} y={py + 60} size={150} f={f} variant="float" tilt={0} />
          <Ledge x={1180} y={py + 110} />
          <Tick x={1180} y={py + 110} pxPerM={58} frame={f} facing={-1} pose="point" expression="proud" look={0.4} />
          <Pin x={890} y={py + 30} text="our model, not a record" draw={drop} dx={lx - 890} dy={ly - py - 30} size={22} />
        </Layer>
        <Layer depth={0}>
          <Kicker x={360} y={110} text={`from the ${BOUNDARY.fai} km line` /* #1 */} color={CREAM} size={30} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 6-02 · void spec plate: the capsule large; a width bracket draws across it, a height guide, the mass tag rolls to
// 100 kg and the width to 0.6 m; pill FIXED DRAG. MOVER: the brackets drawing (≈ 7-14 px/f) + counters, a scan line
// sweeping the capsule (6 px/f) and stars streaming up.
// ===============================================================================================================
const ShotSpec: ShotFC<C06> = ({ f }) => {
  const px = 700;
  const py = 500;
  const L = 440;
  const w = L * 0.46;
  const scan = py - 300 + ((f * 6) % 620);
  const roll1 = ez(f, 18, 48);
  const roll2 = ez(f, 60, 92);
  const V = familyOf("void");
  return (
    <Pop f={f}>
      <Stage theme={skyFamily(100).theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.01, frames: 200, seed: 5 }} vignette={0.3} grain={0.5}>
        <Layer depth={1}>
          <SkyView f={f} v={view(104, 30)} ruler={false} drift={9} aurora={0.6} bands={0.6} />
          {/* blueprint grid */}
          {Array.from({ length: 9 }, (_, i) => (
            <line key={i} x1={px - 360} y1={py - 320 + i * 80} x2={px + 360} y2={py - 320 + i * 80} stroke={alpha(C.limb, 0.16)} strokeWidth={2} />
          ))}
          {Array.from({ length: 10 }, (_, i) => (
            <line key={"v" + i} x1={px - 360 + i * 80} y1={py - 320} x2={px - 360 + i * 80} y2={py + 320} stroke={alpha(C.limb, 0.16)} strokeWidth={2} />
          ))}
          <Probe x={px} y={py} size={L} f={f} variant="plain" lamp={false} />
          <line x1={px - 300} y1={scan} x2={px + 300} y2={scan} stroke={C.limb} strokeWidth={4} opacity={0.75} />
          <Bloom x={px} y={scan} r={160} color={C.limb} strength={0.25} squash={0.15} />
          <Bracket x1={px - w / 2} y1={py - 170} x2={px + w / 2} y2={py - 170} draw={ez(f, 8, 36)} color={C.saffron} />
          <Bracket x1={px + w / 2 + 70} y1={py - 145} x2={px + w / 2 + 70} y2={py + 145} draw={ez(f, 50, 82)} color={alpha(C.saffron, 0.8)} />
        </Layer>
        <Layer depth={0}>
          {/* spec-plate labels (diagram parts): width and mass, units in their own case */}
          <g opacity={ez(f, 14, 22)}>
            <RollMetric x={1040} y={330} value={MODEL.diameterM /* #20 */} decimals={1} k={roll1} unit="m" size={84} tail="wide" color={C.saffronCore} who="6-02 width" />
          </g>
          <g opacity={ez(f, 56, 64)}>
            <RollMetric x={1040} y={520} value={MODEL.massKg /* #20 */} k={roll2} unit="kg" size={84} color={CREAM} who="6-02 mass" />
          </g>
          {f > 100 ? <Pill x={1040} y={660} text="fixed drag" fill={pillFill(V)} color={CREAM} dot={C.saffron} size={28} /> : null}
          <ModelChip x={1520} y={110} f={f} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 6-03 · release: the probe falls, stars stream up, the ruler scrolls; SPEED climbs in a straight line, PUSH stays at
// zero. MOVER: stars + ruler streaming (≈ 14-20 px/f) + the SPEED needle climbing.
// ===============================================================================================================
const ShotRelease: ShotFC<C06> = ({ f, c }) => {
  const sf = c.release + f;
  const alt = altAt(c, sf);
  const v = view(alt, 130);
  return (
    <Pop f={f}>
      <Stage theme={skyFamily(alt).theme} shotFrame={f} drift={{ zoom: 1.03, panX: 0.005, frames: 200, seed: 7 }} vignette={0.3} grain={0.5}>
        <Layer depth={1}>
          <SkyView f={f} v={v} aurora={0.8} drift={12} streak={18 + f * 0.2} />
          <Probe x={820} y={470} size={170} f={f} trail={Math.min(150, f * 2)} />
        </Layer>
        <Cluster f={f} alt={alt} />
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 6-04 + 6-05 + 6-06 · the 80, 60 and 50 km marks slide past; the counter rolls 618 → 874 → 972 m/s with its km pill;
// the first indigo blush at 50. MOVER: the ruler marks sliding past (≈ 19-27 px/f) + the counter rolling.
// ===============================================================================================================
const ShotMarks: ShotFC<C06> = ({ f, c }) => {
  const sf = c.marks + f;
  const alt = altAt(c, sf);
  const v = view(alt, 140);
  const stops: [number, number, number][] = [
    [c.at80 + 8, MODEL.v80, 80], // #20
    [c.at60 + 8, MODEL.v60, 60], // #20
    [c.at50 + 8, MODEL.v50, 50], // #20
  ];
  let k = -1;
  stops.forEach((s, i) => {
    if (sf >= s[0] - 4) k = i;
  });
  const prev = k > 0 ? stops[k - 1][1] : 0;
  const cur = k >= 0 ? stops[k] : null;
  const roll = cur ? ez(sf, cur[0] - 4, cur[0] + 18) : 0;
  const shown = cur ? prev + (cur[1] - prev) * roll : 0;
  return (
    <Stage theme={skyFamily(alt).theme} shotFrame={f} drift={{ zoom: 1.03, panX: 0.005, frames: 260, seed: 9 }} vignette={0.3} grain={0.5}>
      <Layer depth={1}>
        <SkyView f={f} v={v} aurora={0.6} drift={10} streak={30} />
        <Probe x={820} y={470} size={160} f={f} trail={150} />
      </Layer>
      <Layer depth={0}>
        {cur ? (
          <g>
            <rect x={950} y={176} width={520} height={124} rx={20} fill={alpha("#04051A", 0.55)} />
            {/* rolls from the previous mark's value to this one; settles on the table value (#20) */}
            <RollMetric x={980} y={270} value={cur[1]} k={shown / cur[1]} size={96} unit="m/s" color={CREAM} who="6-04 speed" />
            <Pill x={980} y={350} text={`${cur[2]} km`} fill={pillFill(familyOf("void"))} color={CREAM} dot={C.saffron} size={30} />
          </g>
        ) : null}
      </Layer>
      <Cluster f={f} alt={alt} />
    </Stage>
  );
};

// ===============================================================================================================
// 6-07 · KEY ART (l15-key-2): at 40 km, the camera pushes to the dial: the SPEED needle sweeps far above the SOUND mark
// (which slides in from the sea-level value to 317 m/s as the temperature falls to 40 km's), MACH 3.3; Tick on a ledge
// stares at the gap. MOVER: the needle sweep (≈ 3°/f) + the SOUND mark sliding + counters + haze streaks (14 px/f) +
// the camera push.
// ===============================================================================================================
const HazeStreaks: React.FC<{ f: number; speed?: number; color?: string; n?: number; seed?: number }> = ({ f, speed = 14, color = C.limb, n = 18, seed = 3 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const x = -200 + rnd(seed * 7 + i) * 2400;
      const len = 80 + rnd(seed * 3 + i) * 220;
      const span = 1500;
      const y = ((((rnd(seed * 11 + i) * span - f * speed * (0.6 + rnd(i) * 0.8)) % span) + span) % span) - 200;
      return <line key={i} x1={x} y1={y} x2={x} y2={y + len} stroke={color} strokeWidth={3 + rnd(i * 5) * 4} strokeLinecap="round" opacity={0.22 + rnd(i * 9) * 0.2} />;
    })}
  </g>
);

const ShotMach: ShotFC<C06> = ({ f, len, c }) => {
  const sf = c.mach + f;
  const alt = altAt(c, sf);
  const v = view(alt, 600);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1 },
    { f: 60, x: 1300, y: 420, zoom: 1.3 },
    { f: len, x: 1330, y: 410, zoom: 1.38 },
  ]);
  const sweep = ez(f, 4, 52);
  const T = atmAt(alt).tC;
  const soundT = 15 + (T - 15) * ez(f, 20, 60); // the mark slides from sea level's (#11 15 °C) to here (F10)
  const speed = speedValue(modelSpeedAt(alt)) * sweep;
  const F = skyFamily(alt);
  const machK = ez(sf, c.machWord - 6, c.machWord + 10);
  const soundK = ez(sf, c.sound - 6, c.sound + 10);
  return (
    <Pop f={f}>
      <Stage theme={F.theme} cam={cam} vignette={0.32} grain={0.5}>
        <Layer depth={0.6}>
          <SkyView f={f} v={v} ruler={false} drift={12} streak={26} bands={0.6} />
          <HazeStreaks f={f} />
        </Layer>
        <Layer depth={1}>
          <Probe x={760} y={500} size={150} f={f} trail={140} />
          <Ledge x={1150} y={780} />
          <Tick x={1150} y={780} pxPerM={60} frame={f} facing={1} pose="stand" poseTo="point" poseT={ez(f, 50, 70)} expression="neutral" expressionTo="surprised" expressionT={ez(f, 46, 56)} look={0.7} headTilt={8} />
          <L15Gauges
            family={F}
            frame={f}
            model
            speed={{ value: speed, soundT, max: 1100, mach: machK > 0.5 ? MODEL.mach40 /* #23 */ : undefined }}
            air={{ value: airValue(alt) }}
            push={{ value: pushAt(alt) }}
            cold={{ value: T }}
          />
        </Layer>
        <Layer depth={0}>
          <g opacity={ez(f, 10, 18)}>
            <RollMetric x={150} y={210} value={MODEL.v40 /* #20 */} k={ez(f, 10, 50)} unit="m/s" size={100} color={CREAM} slab={alpha("#04051A", 0.5)} who="6-07 speed" />
          </g>
          <g opacity={machK}>
            <Pill x={150} y={320} text={`mach ${MODEL.mach40}` /* #23 */} fill={pillFill(familyOf("petrol"))} color={CREAM} dot={C.saffron} size={30} />
          </g>
          <g opacity={soundK}>
            <Pill x={150} y={400} text={`sound ${SOUND.at40} m/s` /* #15 #23 */} fill={pillFill(familyOf("petrol"))} color={C.limb} dot={C.limb} size={30} />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 6-08 · the peak: the ruler ticks pass (close scale), a saffron pin pops at 36 km, the needle at its high point, the
// SOUND mark far below. MOVER: ruler ticks (≈ 13 px/f) + the peak pin popping + stars streaming.
// ===============================================================================================================
const ShotPeak: ShotFC<C06> = ({ f, c }) => {
  const sf = c.peak + f;
  const alt = altAt(c, sf);
  const v = view(alt, 1000);
  const pinK = ez(sf, c.peakWord - 10, c.peakWord + 14);
  const T = atmAt(alt).tC;
  return (
    <Pop f={f}>
      <Stage theme={skyFamily(alt).theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.006, frames: 200, seed: 11 }} vignette={0.32} grain={0.5}>
        <Layer depth={1}>
          <SkyView f={f} v={v} drift={12} streak={30} pins={[{ altKm: MODEL.peakKmShown /* #20 */, label: "", draw: pinK, len: 1300 }]} step={1} />
          <Probe x={820} y={470} size={160} f={f} trail={150} />
          {pinK > 0.95 ? <Rings f={sf - c.peakWord - 4} cx={820} cy={vy(v, MODEL.peakKmShown)} every={14} speed={6} maxR={260} color={C.saffronCore} width={5} /> : null}
          <Motes frame={f} n={20} x={0} y={0} w={1400} h={1080} color={alpha(C.bone, 0.8)} seed={13} size={3} drift={50} />
        </Layer>
        <Layer depth={0}>
          <g opacity={ez(f, 6, 16)}>
            <RollMetric x={960} y={220} pre="≈ " value={MODEL.peakShown /* #20 */} k={ez(f, 6, 40)} unit="m/s" size={92} color={CREAM} slab={alpha("#04051A", 0.5)} who="6-08 peak" />
          </g>
          <g opacity={pinK}>
            <Pill x={980} y={320} text={`≈ ${MODEL.peakKmShown} km · peak` /* #20 */} fill={pillFill(familyOf("petrol"))} color={C.saffronCore} dot={C.saffron} size={30} />
          </g>
        </Layer>
        <Cluster f={f} alt={alt} extra={{ speed: { value: speedValue(modelSpeedAt(alt)), soundT: T, max: 1100, ghost: speedValue(MODEL.v40) } }} />
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 6-09 · STUDIO_SET: two bars grow side by side, our model's peak and Baumgartner's best; Tick compares them with the
// staff, sly. MOVER: bars growing (24 px/f, staggered) + counters + CycClouds.
// ===============================================================================================================
const ShotBars: ShotFC<C06> = ({ f }) => {
  const x0 = 430;
  const scale = 1000 / ORBIT.modelPeakKmh; // px per km/h
  const bLen = JUMPS.baumgartner.topKmh * scale * ez(f, 6, 24);
  const mLen = ORBIT.modelPeakKmh * scale * lin(f, 20, 62);
  return (
    <Pop f={f}>
      <Stage theme={STUDIO.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.01, frames: 200, seed: 13 }} vignette={0.16} grain={0.6}>
        <StudioSet f={f + 400} seed={21} />
        <Layer depth={1}>
          <ModelChip x={x0} y={370} f={f} size={22} />
          <Bar x={x0} y={450} len={mLen} h={84} color={C.saffron} />
          <text x={x0} y={590} style={{ fontFamily: IF2.label, fontSize: 30, letterSpacing: 4, fill: INK }}>
            BAUMGARTNER
          </text>
          <Bar x={x0} y={660} len={bLen} h={84} color={C.teal} />
          <Tick x={250} y={880} pxPerM={150} frame={f} facing={1} pose="stand" poseTo="point" poseT={ez(f, 30, 52)} staff expression="neutral" expressionTo="happy" expressionT={ez(f, 60, 70)} look={0.5} headTilt={-8} />
        </Layer>
        <Layer depth={0}>
          <g opacity={ez(f, 40, 50)}>
            <RollMetric x={x0 + 1000 + 40} y={472} pre="≈ " value={ORBIT.modelPeakKmh /* #22 */} k={lin(f, 20, 62)} unit="km/h" size={46} color={CREAM} slab={pillFill(STUDIO)} who="6-09 model" />
          </g>
          <g opacity={ez(f, 16, 26)}>
            <RollMetric x={x0 + JUMPS.baumgartner.topKmh * scale + 40} y={682} value={JUMPS.baumgartner.topKmh /* #4 */} decimals={1} k={ez(f, 6, 30)} unit="km/h" size={46} color={CREAM} slab={pillFill(STUDIO)} who="6-09 baum" />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 6-10 · close on the SPEED dial: the needle turns back down as the air thickens; haze bands stream up; Tick's eyes follow
// it down. MOVER: haze bands streaming (12 px/f) + the needle reversing + the push.
// ===============================================================================================================
const ShotDrops: ShotFC<C06> = ({ f, len, c }) => {
  const sf = c.drops + f;
  const alt = altAt(c, sf);
  const T = atmAt(alt).tC;
  const F = skyFamily(alt);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1 },
    { f: len, x: 900, y: 520, zoom: 1.12 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={F.theme} cam={cam} vignette={0.32} grain={0.5}>
        <Layer depth={0.5}>
          <SkyView f={f} v={view(alt, 300)} ruler={false} drift={10} streak={20} />
          {Array.from({ length: 6 }, (_, i) => {
            const span = 1500;
            const y = ((((i * 250 - f * 12) % span) + span) % span) - 210;
            return <rect key={i} x={-300} y={y} width={2520} height={60 + (i % 3) * 30} fill={mixHex(C.teal, C.limb, i / 6)} opacity={0.14} />;
          })}
        </Layer>
        <Layer depth={1}>
          <SpeedGauge x={360} y={150} s={{ value: speedValue(modelSpeedAt(alt)), soundT: T, max: 1100, ghost: speedValue(MODEL.peak) }} f={f} family={F} scale={2.2} />
          <Ledge x={1420} y={830} />
          <Tick x={1420} y={830} pxPerM={90} frame={f} facing={-1} pose="think" expression="thinking" look={0.6} headTilt={-14} />
        </Layer>
        <Layer depth={0}>
          <ModelChip x={1520} y={110} f={f} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 6-11 · noon: the probe falls into bright sky; cloud banks pinned to their heights stream up past it; two labels roll
// as the 20 and 10 km marks pass. MOVER: clouds + ruler streaming (≈ 16 px/f) + counters.
// ===============================================================================================================
const ShotClouds: ShotFC<C06> = ({ f, c }) => {
  const sf = c.clouds + f;
  const alt = altAt(c, sf);
  const v = view(alt, 170);
  const k20 = ez(sf, c.at20 + 2, c.at20 + 26);
  const k10 = ez(sf, c.at10 + 2, c.at10 + 26);
  const nf = familyOf("noon");
  return (
    <Pop f={f}>
      <Stage theme={skyFamily(alt).theme} shotFrame={f} drift={{ zoom: 1.03, panX: 0.006, frames: 200, seed: 15 }} vignette={0.18} grain={0.5}>
        <Layer depth={1}>
          <SkyView f={f} v={v} drift={2} rulerColor={alt < 14 ? INK : undefined} />
          <AltClouds f={f} v={v} from={1.5} to={19} n={22} seed={5} />
          <Probe x={820} y={470} size={160} f={f} trail={140} />
        </Layer>
        <Layer depth={0}>
          <g opacity={ez(sf, c.at20, c.at20 + 8)}>
            <RollMetric x={960} y={250} value={MODEL.v20 /* #20 */} k={k20} unit="m/s" tail="· 20 km" size={56} color={CREAM} slab={pillFill(nf)} who="6-11 v20" />
          </g>
          <g opacity={ez(sf, c.at10, c.at10 + 8)}>
            <RollMetric x={960} y={350} value={MODEL.v10 /* #20 */} k={k10} unit="m/s" tail="· 10 km" size={56} color={CREAM} slab={pillFill(nf)} who="6-11 v10" />
          </g>
        </Layer>
        <Cluster f={f} alt={alt} />
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 6-12 · the desert rises; the probe touches down with a soft bounce and a dust puff; ≈ 86 m/s and the clock 4:11 roll.
// MOVER: the ground rising (≈ 22 px/f) + clouds streaming + counters, then dust puffs and the bounce.
// ===============================================================================================================
const ShotLand: ShotFC<C06> = ({ f, c }) => {
  const T0 = 112;
  const pa = Math.max(0, 6.5 * (1 - f / T0));
  const altC = Math.max(pa, 0.8);
  const v = view(altC, 380);
  const gy = vy(v, 0);
  const landed = f >= T0;
  const bounce = landed ? Math.abs(Math.sin((f - T0) / 5)) * 26 * Math.exp(-(f - T0) / 14) : 0;
  const pyr = landed ? gy - 120 - bounce : vy(v, pa) - 120;
  const nf = familyOf("noon");
  const sf = c.land + f;
  return (
    <Pop f={f}>
      <Stage theme={skyFamily(1).theme} shotFrame={f} drift={{ zoom: 1.03, panX: 0.006, frames: 200, seed: 17 }} vignette={0.18} grain={0.5}>
        <Layer depth={1}>
          <SkyView f={f} v={v} drift={1} rulerColor={INK} step={1} />
          <AltClouds f={f} v={v} from={1.2} to={6} n={14} seed={9} />
          <Probe x={820} y={pyr} size={160} f={f} trail={landed ? 0 : 140} tilt={landed ? Math.sin((f - T0) / 4) * 6 * Math.exp(-(f - T0) / 12) : 0} />
          {landed ? <Puffs frame={f - T0} x={820} y={gy - 10} color={C.dune1} period={4} size={30} rise={1.2} drift={2.5} life={40} seed={3} /> : null}
          {landed ? <Rings f={f - T0} cx={820} cy={gy} once speed={9} maxR={360} color={alpha(C.cloud, 0.9)} width={6} /> : null}
        </Layer>
        <Layer depth={0}>
          <g opacity={ez(sf, c.at0 - 4, c.at0 + 6)}>
            <RollMetric x={960} y={250} pre="≈ " value={MODEL.ground /* #20 */} k={ez(sf, c.at0 - 4, c.at0 + 24)} unit="m/s" size={60} color={CREAM} slab={pillFill(nf)} who="6-12 ground" />
          </g>
          <g opacity={ez(sf, c.four - 4, c.four + 6)}>
            <rect x={942} y={300} width={200} height={76} rx={16} fill={pillFill(nf)} />
            <text x={960} y={358} style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 56, fill: CREAM, fontVariantNumeric: "tabular-nums" }}>
              {mss(Math.round(MODEL.groundS * ez(sf, c.four - 4, c.four + 26)) /* #20: 251 s = 4:11 */)}
            </text>
          </g>
        </Layer>
        <Cluster f={f} alt={pa} />
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 6-13 · STUDIO_SET: three speed-vs-height traces draw: the tall one from the 100 km line (our model) and two short ones
// from the record heights; all three merge at the bottom. Tick traces the ends with the staff. MOVER: three trace heads
// drawing (14-22 px/f) + the pull back.
// ===============================================================================================================
const PLOT = { x0: 470, x1: 1460, y0: 820, y1: 150 };
const px = (mps: number) => PLOT.x0 + (mps / 1100) * (PLOT.x1 - PLOT.x0);
const py = (km: number) => PLOT.y0 - (km / 100) * (PLOT.y0 - PLOT.y1);
const modelPts: Pt[] = (() => {
  const out: Pt[] = [];
  for (let a = 100; a >= 0; a -= 2) out.push([px(modelSpeedAt(a)), py(a)]);
  return out;
})();
/** A record jump's trace (schematic, no figures): from rest at its exit height, a small peak, then onto the model's lower
 *  branch (the same ending). */
const recordPts = (exitKm: number, peakMps: number): Pt[] => {
  const out: Pt[] = [];
  const pk = exitKm - 8;
  for (let a = exitKm; a >= 0; a -= 1) {
    let v: number;
    if (a >= pk) v = peakMps * Math.sqrt((exitKm - a) / (exitKm - pk));
    else {
      const tail = modelSpeedAt(Math.min(a, 15));
      const u = clamp01((pk - a) / (pk - 12));
      v = peakMps + (Math.min(peakMps, tail) - peakMps) * u;
      if (a < 12) v = modelSpeedAt(a);
    }
    out.push([px(v), py(a)]);
  }
  return out;
};
const baumPts = recordPts(JUMPS.baumgartner.exitKm, JUMPS.baumgartner.topKmh / 3.6);
const eustPts = recordPts(JUMPS.eustace.exitKm, JUMPS.eustace.topKmh / 3.6);

const Axes: React.FC<{ ink?: string }> = ({ ink = INK }) => (
  <g>
    <line x1={PLOT.x0} y1={PLOT.y0} x2={PLOT.x1 + 40} y2={PLOT.y0} stroke={ink} strokeWidth={5} strokeLinecap="round" />
    <line x1={PLOT.x0} y1={PLOT.y0} x2={PLOT.x0} y2={PLOT.y1 - 40} stroke={ink} strokeWidth={5} strokeLinecap="round" />
    <text x={PLOT.x1 + 40} y={PLOT.y0 + 44} textAnchor="end" style={{ fontFamily: IF2.label, fontSize: 24, letterSpacing: 3, fill: ink }}>
      SPEED
    </text>
    <text x={PLOT.x0 - 20} y={PLOT.y1 - 50} textAnchor="end" style={{ fontFamily: IF2.label, fontSize: 24, letterSpacing: 3, fill: ink }}>
      HEIGHT
    </text>
  </g>
);

const ShotTraces: ShotFC<C06> = ({ f, len, c }) => {
  const sf = c.traces + f;
  const cam = cameraAt(f, [
    { f: 0, x: 980, y: 520, zoom: 1.16 },
    { f: len, x: 960, y: 540, zoom: 1.0 },
  ]);
  const hm = lin(f, 6, 96);
  const hb = lin(f, 26, 86);
  const he = lin(f, 36, 96);
  const sameK = ez(sf, c.same - 4, c.same + 8);
  return (
    <Pop f={f}>
      <Stage theme={STUDIO.theme} cam={cam} vignette={0.16} grain={0.6}>
        <StudioSet f={f + 900} seed={23} floor={900} />
        <Layer depth={1}>
          <rect x={PLOT.x0 - 30} y={PLOT.y1 - 70} width={PLOT.x1 - PLOT.x0 + 110} height={PLOT.y0 - PLOT.y1 + 110} rx={26} fill={alpha(STUDIO.shadow, 0.82)} />
          <Axes ink={CREAM} />
          <Trace pts={modelPts} head={hm} f={f} color={C.saffron} width={8} peak={32} />
          <Trace pts={baumPts} head={hb} f={f} color={C.limb} width={7} />
          <Trace pts={eustPts} head={he} f={f} color={C.bone} width={7} />
          <Tick x={250} y={900} pxPerM={140} frame={f} facing={1} pose="point" staff expression="proud" look={0.3} />
          {hm >= 1 ? <Rings f={f - 96} cx={px(MODEL.ground)} cy={py(0)} every={20} speed={4} maxR={120} color={C.saffronCore} width={5} /> : null}
        </Layer>
        <Layer depth={0}>
          <ModelChip x={1500} y={110} f={f} />
          <g opacity={sameK}>
            <Pill x={PLOT.x0 + 140} y={PLOT.y0 - 60} text="same ending" fill={pillFill(STUDIO)} color={CREAM} dot={C.saffron} size={30} />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 6-14 · the merged ends, close: a stamp AIR slams onto the converged trace; Tick taps it, determined; a light pulse runs
// along the shared tail again and again. MOVER: the stamp slam (40 px/f) + the pulse running (≈ 20 px/f) + CycClouds.
// ===============================================================================================================
const ShotDecides: ShotFC<C06> = ({ f }) => {
  const cam = { x: 820, y: 640, zoom: 1.45 + f * 0.0015 };
  const tail = modelPts.slice(modelPts.length - 14);
  const pulse = ((f * 0.03) % 1.2) / 1.2;
  return (
    <Pop f={f}>
      <Stage theme={STUDIO.theme} cam={cam} vignette={0.16} grain={0.6}>
        <StudioSet f={f + 1300} seed={25} floor={900} />
        <Layer depth={1}>
          <rect x={PLOT.x0 - 30} y={PLOT.y1 - 70} width={PLOT.x1 - PLOT.x0 + 110} height={PLOT.y0 - PLOT.y1 + 110} rx={26} fill={alpha(STUDIO.shadow, 0.82)} />
          <Axes ink={CREAM} />
          <Trace pts={modelPts} head={1} f={f} color={C.saffron} width={8} />
          <Trace pts={baumPts} head={1} f={f} color={C.limb} width={7} />
          <Trace pts={eustPts} head={1} f={f} color={C.bone} width={7} />
          <Trace pts={tail} head={pulse} f={f} color={C.saffronCore} width={12} />
          <Stamp x={px(260)} y={py(9)} text="air" age={f - 10} size={56} rotate={-10} />
          <Tick x={330} y={900} pxPerM={130} frame={f} facing={1} pose="point" poseTo="press" poseT={Math.abs(Math.sin(f / 8)) * 0.8} staff expression="determined" look={0.4} />
        </Layer>
        <Layer depth={0}>
          <Headline x={120} y={210} lines={["The air decides"]} size={96} color={CREAM} accent={C.saffron} shadow={INK} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 6-15 · the whole ruler, 0-110 km: a saffron band wipes up over 0-50 km; the model's speed bulge, drawn beside it, shrinks
// back into the band (the air takes it all back); Tick at the ruler's foot sweeps a hand down it. 2-s hold at the end.
// MOVER: the band wipe (≈ 14 px/f) + the bulge shrinking (≈ 4-6 px/f) + stars.
// ===============================================================================================================
const ShotBand: ShotFC<C06> = ({ f, len }) => {
  const pk = 8.4; // px per km
  const altC = 52;
  const v = view(altC, pk);
  const rx = 420;
  const wipe = ez(f, 8, 40);
  const shrink = 1 - 0.85 * ez(f, 50, len - 20);
  const pts: Pt[] = [];
  for (let a = 100; a >= 0; a -= 2) {
    const s = modelSpeedAt(a);
    pts.push([rx + 40 + (MODEL.ground + (s - MODEL.ground) * shrink) * 0.75, vy(v, a)]);
  }
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 600, zoom: 1.12 },
    { f: len, x: 960, y: 540, zoom: 1.0 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={skyFamily(40).theme} cam={cam} vignette={0.3} grain={0.5}>
        <Layer depth={1}>
          <SkyView f={f} v={v} rulerX={rx} drift={3} band={{ from: 0, to: 50, wipe }} flags={false} />
          <Trace pts={pts} head={1} f={f} color={C.saffronCore} width={8} />
          <Tick x={rx - 70} y={vy(v, 0) - 4} pxPerM={60} frame={f} facing={1} pose="point" poseTo="lean" poseT={ez(f, 20, 60)} expression="proud" look={0.2} />
          <Motes frame={f} n={18} x={0} y={0} w={1920} h={1080} color={alpha(C.bone, 0.7)} seed={15} size={3} drift={40} />
        </Layer>
        <Layer depth={0}>
          <g opacity={ez(f, 30, 42)}>
            <Pill x={900} y={vy(v, 25) * 1 + 0} text="the slowing happens here" fill={pillFill(familyOf("petrol"))} color={C.saffronCore} dot={C.saffron} size={30} />
          </g>
          <ModelChip x={1520} y={110} f={f} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================

export const SceneL06: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL06(t);
  const shots: ShotDef<C06>[] = [
    { from: 0, S: ShotLine, id: "6-01" },
    { from: c.spec, S: ShotSpec, id: "6-02" },
    { from: c.release, S: ShotRelease, id: "6-03" },
    { from: c.marks, S: ShotMarks, id: "6-04" }, // + 6-05, 6-06 (SLIDE)
    { from: c.mach, S: ShotMach, id: "6-07" },
    { from: c.peak, S: ShotPeak, id: "6-08" },
    { from: c.bars, S: ShotBars, id: "6-09" },
    { from: c.drops, S: ShotDrops, id: "6-10" },
    { from: c.clouds, S: ShotClouds, id: "6-11" },
    { from: c.land, S: ShotLand, id: "6-12" },
    { from: c.traces, S: ShotTraces, id: "6-13" },
    { from: c.decides, S: ShotDecides, id: "6-14" },
    { from: c.band, S: ShotBand, id: "6-15" },
  ];
  return playShots(f, shots, c, c.end);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL06 = (t: SceneTiming): Cue[] => {
  const c = cuesL06(t);
  const run = (at: number, n: number, gap = 5, vol = 0.07): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 6 }));
  return [
    { at: 14, file: SFX.popLong, vol: 0.18, dur: 30 },
    { at: 40, file: SFX.pop, vol: 0.14, dur: 14 },
    ...cutHit(c.spec),
    ...[c.spec + 10, c.spec + 52, c.spec + 100].map((a) => ({ at: a, file: SFX.click, vol: 0.12, dur: 8 })),
    ...cutHit(c.release),
    { at: c.release + 2, file: SFX.whoosh, vol: 0.22, dur: 50 },
    ...run(c.at80 + 4, 5),
    ...run(c.at60 + 4, 5),
    ...run(c.at50 + 4, 5),
    ...cutHit(c.mach),
    ...run(c.mach + 10, 8),
    { at: c.machWord, file: SFX.boom, vol: 0.2, dur: 90, fadeOut: 30 },
    ...cutHit(c.peak),
    { at: c.peakWord, file: SFX.popLong, vol: 0.18, dur: 30 },
    ...cutHit(c.bars),
    { at: c.bars + 8, file: SFX.click, vol: 0.12, dur: 8 },
    { at: c.bars + 22, file: SFX.click, vol: 0.12, dur: 8 },
    { at: c.bars + 62, file: SFX.pop, vol: 0.16, dur: 14 },
    ...cutHit(c.drops),
    { at: c.drops + 4, file: SFX.click, vol: 0.12, dur: 8 },
    ...cutHit(c.clouds),
    { at: c.clouds + 2, file: SFX.whoosh, vol: 0.2, dur: 50 },
    ...run(c.at20 + 2, 4),
    ...run(c.at10 + 2, 4),
    ...cutHit(c.land),
    { at: c.land + 112, file: SFX.popLong, vol: 0.2, dur: 30 },
    { at: c.land + 112, file: SFX.debris, vol: 0.16, dur: 50, fadeOut: 15 },
    ...cutHit(c.traces),
    { at: c.traces + 6, file: SFX.swirl, vol: 0.16, dur: 50 },
    ...cutHit(c.decides),
    { at: c.decides + 12, file: SFX.popLong, vol: 0.22, dur: 30 },
    ...cutHit(c.band),
    { at: c.band + 8, file: SFX.swirl, vol: 0.16, dur: 50 },
  ];
};
