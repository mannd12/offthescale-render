// L15 scene "cold" (storyboard §3 "Cold open": C-01…C-10, script lines 0-4; dusk pre-dawn → void black sky → card).
// Shot components (hard cuts only; continuous rows are phases): C-01+C-02 (launch at night, then the tilt up the dotted
// line to the stars) · C-03 (the drop: stars streaming up, SPEED needle past the SOUND mark) · C-04 (the needle peaks and
// falls back) · C-05+C-06 are separate cuts (the cluster fades up; every gauge off its scale and back) · C-07+C-08 (three
// balloons rise on the ruler, then the camera climbs to the station) · C-09 the chapter card · C-10 the word EDGE.
// Numbers drawn: none (storyboard Acc "—" for every cold-open row). The SOUND mark is placed by soundSpeed(T) (F10).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bloom, IF2, Kicker, Layer, Stage, Streamers, Tick, alpha, cameraAt, impact, mixHex, CloudRack } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { JUMPS, TEMP_READ, atmAt } from "../jumpdata";
import { L15Gauges, L15GaugesHUD, SpeedGauge } from "../L15Gauges";
import { L15Card, OrbitRings } from "../L15Card";
import { AltRuler, Limb, SkyColumn, altY } from "../sky";
import { Balloon, Jumper, Probe, Station } from "../props";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { C, CREAM, DUSK, Ledge, NOON, NightColumn, Pop, VOID, cl01, ez, lerp, lin, path1 } from "./a-parts";

// ================================================================================================================
// cues
// ================================================================================================================
export const cuesCold = (t: SceneTiming) => {
  const { at, p, frac } = cueKit(t);
  return {
    launch: 0, // C-01
    tilt: p(0, "what would stop you"), // C-02 (phase)
    drop: at(1), // C-03
    peak: p(1, "and then slow down"), // C-04
    cluster: at(2), // C-05
    scale: p(2, "Every one runs off its scale"), // C-06
    jumps: p(2, "And the real jumps"), // C-07
    higher: at(3), // C-08 (phase)
    card: frac(3, 0.78), // C-09
    edge: at(4), // C-10
    end: t.frames,
  };
};
export type CCold = ReturnType<typeof cuesCold>;

/** Fall with a capped speed: px after τ frames. */
const fallDist = (tau: number, a = 0.9, v = 20) => {
  if (tau <= 0) return 0;
  const tc = v / a;
  return tau < tc ? 0.5 * a * tau * tau : 0.5 * a * tc * tc + v * (tau - tc);
};

/** The launch rig hanging from a beam balloon: ropes, a deck with a saffron rail, Tick and the probe on it. */
const Rig: React.FC<{ f: number; tickPose?: "hold" | "point"; probe?: boolean }> = ({ f, tickPose = "hold", probe = true }) => (
  <g>
    <line x1={-50} y1={0} x2={-130} y2={92} stroke={C.bone} strokeWidth={3} />
    <line x1={50} y1={0} x2={130} y2={92} stroke={C.bone} strokeWidth={3} />
    <rect x={-140} y={92} width={280} height={16} rx={5} fill={C.saffron} />
    <rect x={-140} y={108} width={280} height={30} rx={6} fill={mixHex(C.saffronDeep, "#1A0E20", 0.4)} />
    <line x1={-140} y1={62} x2={140} y2={62} stroke={C.saffron} strokeWidth={4} opacity={0.8} />
    <Tick x={-60} y={92} pxPerM={52} frame={f} facing={1} pose={tickPose} expression="determined" look={0.3} squash={impact(f, 30, 0.08, 10)} />
    {probe ? <Probe x={70} y={60} size={62} f={f} lamp={false} tilt={-6} /> : null}
  </g>
);

// ================================================================================================================
// C-01 + C-02 · pre-dawn launch: the balloon swells and rises, the dunes slide down as the camera tilts up; then the
// tilt carries on up a dotted line into the black, the ground falling away as a cyan-rimmed curve.
// MOVER: dunes sliding 8 px/f + balloon swelling + wind streamers 9 px/f; then the line's head 60 px/f + stars 14 px/f.
// ================================================================================================================
const ShotLaunch: ShotFC<CCold> = ({ f, len, c }) => {
  const T2 = c.tilt - c.launch;
  // phase 1: a fake 1.2-"km" window over the launch field, tilting up 8 px/f
  const b = -0.08 + f * (8 / 900);
  const gy = altY(0, b + 1.2, b);
  const rigY = gy - 150 - f * 1.6; // the rig lifting off the field
  const x2 = ez(f, T2 - 4, T2 + 12); // crossfade into phase 2
  const g = f - T2;
  const headY = Math.max(150, 980 - Math.max(0, g) * 60);
  const dotsScroll = g > 14 ? (g - 14) * 30 : 0;
  const dots: React.ReactNode[] = [];
  for (let y = 1100 + (dotsScroll % 44); y > headY; y -= 44) dots.push(<circle key={y} cx={980} cy={y} r={9} fill={C.saffron} />);
  return (
    <AbsoluteFill>
      <Stage theme={DUSK.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.01, panY: 0, frames: 200, seed: 2 }} vignette={0.25} grain={0.5}>
        <Layer depth={1}>
          <NightColumn f={f} altTop={b + 1.2} altBottom={b} seed={4} tint="#2A1E5A" tintK={0.15} />
          <Bloom x={1500} y={gy - 30} r={520} color={C.cityGlow} core={0} strength={0.45} />
          <Streamers f={f} n={14} x0={-300} x1={2300} y0={gy - 320} y1={gy - 20} len={220} width={5} speed={9} color={alpha("#FFE0B0", 0.9)} opacity={0.45} slope={-0.02} seed={5} />
          {/* the dotted line from the deck down to the far ground */}
          {Array.from({ length: 30 }, (_, i) => {
            const y = rigY + 150 + i * 40;
            return y < gy - 6 ? <circle key={i} cx={980} cy={y} r={7} fill={C.saffron} opacity={0.85} /> : null;
          })}
          <Balloon x={980} y={rigY} size={380} f={f} inflate={lerp(0.3, 0.8, ez(f, 0, T2 + 20))} variant="beam" payload={<Rig f={f} />} />
        </Layer>
        <Layer depth={0}>
          <g opacity={1 - x2}>
            <Kicker x={120} y={130} text="A DROP FROM THE EDGE OF SPACE" color={CREAM} size={28} />
            <L15Gauges family={DUSK} frame={f} compact speed={{ value: 0 }} air={{ value: 1 }} push={{ value: 0 }} cold={{ value: TEMP_READ.sea }} />
          </g>
        </Layer>
      </Stage>
      {x2 > 0 ? (
        <AbsoluteFill style={{ opacity: x2 }}>
          <Stage theme={VOID.theme} shotFrame={g} drift={false} vignette={0.3} grain={0.5}>
            <Layer depth={1}>
              <NightColumn f={f} altTop={140 + g * 0.2} altBottom={60 + g * 0.2} ground={false} seed={6} drift={-18} />
              <Limb f={f} cy={720 + Math.max(0, g) * 14} R={2600} slide={8} />
              <g transform={`translate(0 ${Math.max(0, g) * 14})`}>
                <Balloon x={980} y={1060} size={300} f={f} inflate={0.85} variant="beam" payload={<Rig f={f} />} />
              </g>
              {dots}
              {g > 0 ? (
                <g>
                  <Bloom x={980} y={headY} r={70} color={C.saffronCore} strength={0.8} />
                  <circle cx={980} cy={headY} r={16} fill={C.saffronCore} stroke={C.saffron} strokeWidth={5} />
                </g>
              ) : null}
            </Layer>
          </Stage>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

// ================================================================================================================
// C-03 · Tick lets the probe go; it drops in front of the black sky (stars streaming up past it); the SPEED half-dial's
// needle climbs past the saffron SOUND mark. MOVER: probe falling, stars streaming 18 px/f, needle sweeping.
// ================================================================================================================
const DIAL = { x: 1080, y: 250, s: 1.55 };
const ShotDrop: ShotFC<CCold> = ({ f, len }) => {
  const rel = 12;
  const py = 250 + Math.min(330, fallDist(f - rel));
  const needle = lerp(0, 0.92, ez(f, rel + 4, len * 0.8)) + 0.06 * lin(f, len * 0.8, len);
  return (
    <Pop f={f}>
      <Stage theme={VOID.theme} cam={{ x: 960, y: 540 + ez(f, rel, len) * 30, zoom: 1.02 }} vignette={0.3} grain={0.5}>
        <Layer depth={1}>
          <NightColumn f={f} altTop={150} altBottom={70} ground={false} seed={7} drift={24} streak={26} />
          {/* the gondola edge at top-left */}
          <rect x={-60} y={300} width={500} height={18} rx={6} fill={C.saffron} />
          <rect x={-60} y={318} width={500} height={40} rx={6} fill={mixHex(C.saffronDeep, "#100820", 0.5)} />
          <line x1={-60} y1={260} x2={440} y2={260} stroke={C.saffron} strokeWidth={4} opacity={0.7} />
          <Tick x={300} y={300} pxPerM={80} frame={f} facing={1} pose="hold" poseTo="point" poseT={ez(f, rel - 2, rel + 10)} expression="determined" look={-0.6} />
          <Probe x={470 + ez(f, rel, rel + 40) * 140} y={py} size={120} f={f} trail={f > rel + 8 ? 80 + Math.min(90, (f - rel) * 2) : 0} />
        </Layer>
        <Layer depth={0}>
          <SpeedGauge x={DIAL.x} y={DIAL.y} scale={DIAL.s} f={f} family={VOID} s={{ value: needle, soundT: TEMP_READ.sea, max: 1100 }} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// C-04 · "slow down, a long way above the ground": the needle peaks (chevrons), turns and falls back while the probe is
// still high above the glowing ground curve. MOVER: needle reversing + stars streaming 14 px/f + chevrons.
// ================================================================================================================
const ShotPeak: ShotFC<CCold> = ({ f, len }) => {
  const pin = f > 8 && f < 30;
  const v = f <= 30 ? 0.98 + 0.04 * ez(f, 0, 8) : lerp(1.0, 0.22, ez(f, 30, len - 6));
  return (
    <Pop f={f}>
      <Stage theme={VOID.theme} shotFrame={f} drift={{ zoom: 1.03, panX: 0.01, panY: 0, frames: 200, seed: 1 }} vignette={0.3} grain={0.5}>
        <Layer depth={1}>
          <NightColumn f={f} altTop={130} altBottom={50} ground={false} seed={8} drift={19} streak={18} />
          <Limb f={f} cy={900} R={2600} slide={8} />
          <Probe x={620} y={360} size={110} f={f} trail={90} />
        </Layer>
        <Layer depth={0}>
          <SpeedGauge x={DIAL.x} y={DIAL.y} scale={DIAL.s} f={f} family={VOID} s={{ value: v, pinned: pin, soundT: TEMP_READ.sea, max: 1100 }} />
          <Ledge x={1140} y={830} w={240} />
          <Tick x={1250} y={830} pxPerM={80} frame={f} facing={-1} pose="point" expression="surprised" look={0.4} headTilt={-10} squash={impact(f, 30, 0.1, 10)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// C-05 · the cluster fades up in a stack (SPEED, AIR, PUSH, COLD), each gauge swinging off zero; Tick small at its edge;
// the probe falls at left. MOVER: gauges sliding in + needle/beam/bead sweeping + stars streaming + the push in.
// ================================================================================================================
const ShotCluster: ShotFC<CCold> = ({ f, len }) => {
  const ap = (i: number) => ez(f, 4 + i * 10, 18 + i * 10);
  const k = ez(f, 14, len);
  const alt = 40 * k; // drives the needles only (drawing): no readouts in the cold open
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: len + 20, x: 1180, y: 520, zoom: 1.16 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={VOID.theme} cam={cam} vignette={0.3} grain={0.5}>
        <Layer depth={0.6}>
          <NightColumn f={f} altTop={160} altBottom={80} ground={false} seed={9} drift={22} streak={22} />
        </Layer>
        <Layer depth={1}>
          <Probe x={480} y={520} size={130} f={f} trail={110} />
          <L15Gauges
            family={VOID}
            frame={f}
            x={1260}
            y={150}
            speed={{ value: lerp(0, 0.85, k), soundT: atmAt(alt).tC, max: 1100, appear: ap(0) }}
            air={{ value: lerp(1, 0.2, k), appear: ap(1) }}
            push={{ value: lerp(0, 1.8, k), appear: ap(2) }}
            cold={{ value: atmAt(alt).tC, appear: ap(3) }}
          />
          <Ledge x={1000} y={880} w={220} />
          <Tick x={1100} y={880} pxPerM={75} frame={f} facing={1} pose="hips" expression="determined" look={0.8} headTilt={-8} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// C-06 · "Every one runs off its scale, and comes back": all four race to their stops, slam, rattle, then swing back
// together. MOVER: needles rolling then rattling (±5° at 10 Hz) then returning + chevrons + the push in.
// ================================================================================================================
const ShotScale: ShotFC<CCold> = ({ f, len }) => {
  const race = ez(f, 0, 22);
  const back = ez(f, len * 0.62, len - 4);
  const pin = f >= 22 && back < 0.05;
  const cam = cameraAt(f, [
    { f: 0, x: 1180, y: 520, zoom: 1.16 },
    { f: len + 20, x: 1300, y: 480, zoom: 1.32 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={VOID.theme} cam={cam} vignette={0.3} grain={0.5}>
        <Layer depth={0.6}>
          <NightColumn f={f + 160} altTop={160} altBottom={80} ground={false} seed={9} drift={22} streak={22} />
        </Layer>
        <Layer depth={1}>
          <L15Gauges
            family={VOID}
            frame={f}
            x={1260}
            y={150}
            rattle={pin ? 0.8 : 0.15}
            speed={{ value: lerp(lerp(0.85, 1.05, race), 0.3, back), pinned: pin, soundT: TEMP_READ.at20, max: 1100 }}
            air={{ value: lerp(lerp(0.2, 0, race), 0.55, back), pinned: pin }}
            push={{ value: lerp(lerp(1.8, 5.5, race), 1, back), pinned: pin }}
            cold={{ value: lerp(lerp(-50, -88, race), -20, back), pinned: pin }}
          />
          <Ledge x={1000} y={880} w={220} />
          <Tick x={1100} y={880} pxPerM={75} frame={f} facing={1} pose="lean" expression="surprised" look={1} headTilt={-16} squash={impact(f, 22, 0.12, 10)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// C-07 + C-08 · "the real jumps, three of them": a ground-to-sky ruler (noon), three tiny balloons each with a small
// suited silhouette rise to three heights and stop; then the camera keeps climbing through the black to where a
// station glints sideways above a thin limb. Heights are drawing positions only (no numbers on screen here).
// MOVER: balloons rising + ruler ticks scrolling; then the climb (ruler and stars 30-80 px/f) + the limb rising.
// ================================================================================================================
const ShotClimb: ShotFC<CCold> = ({ f, len, c }) => {
  const T8 = c.higher - c.jumps;
  const g = Math.max(0, f - T8);
  const top = f < T8 ? path1(f, [[0, 49], [T8, 72]]) : 72 + g * 3.9;
  const span = f < T8 ? 50 : lerp(50, 150, ez(g, 0, len - T8));
  const bottom = top - span;
  const targets = [JUMPS.kittinger.exitM / 1000, JUMPS.baumgartner.exitKm, JUMPS.eustace.exitKm]; // #7 #4 #8 (positions)
  const kinds = ["gondola", "capsule", "beam"] as const;
  const stn = altY(400, top, bottom);
  const limbK = ez(g, 20, len - T8);
  return (
    <AbsoluteFill>
      <Stage theme={NOON.theme} shotFrame={f} drift={{ zoom: 1.03, panX: 0.008, panY: 0, frames: 240, seed: 3 }} vignette={0.15} grain={0.5}>
        <Layer depth={1}>
          <SkyColumn f={f} altTop={top} altBottom={bottom} x={-200} w={2320} streak={g > 0 ? 30 : 0} />
          <g transform={`translate(0 ${(altY(8, top, bottom) - 700).toFixed(1)})`} opacity={1 - ez(f, T8 - 30, T8 + 10)}>
            <CloudRack f={f} n={5} x0={-700} x1={2700} y0={560} y1={820} size={80} speed={2.4} body={alpha(C.cloud, 0.85)} under={alpha(C.cloudShade, 0.7)} seed={11} flat={2.2} />
          </g>
          {targets.map((h, i) => {
            const a = h * ez(f, 4 + i * 12, 96 + i * 12);
            const y = altY(a, top, bottom);
            if (y > 1400) return null;
            return (
              <Balloon
                key={i}
                x={560 + i * 300}
                y={y}
                size={130}
                f={f + i * 30}
                inflate={0.5 + 0.5 * ez(f, 4 + i * 12, 96 + i * 12)}
                variant={kinds[i]}
                payload={<Jumper x={0} y={0} h={28} f={f} pose={i === 2 ? "hang" : "stand"} color={i === 1 ? C.saffron : C.teal} />}
              />
            );
          })}
          {g > 0 && stn > -200 ? (
            <g>
              <Station x={980 + g * 3} y={stn} size={220} f={f} />
              {Array.from({ length: 8 }, (_, i) => (
                <circle key={i} cx={1150 + g * 3 + i * 34 + ((f * 3) % 34)} cy={stn + 10} r={5} fill={C.limb} opacity={0.8} />
              ))}
              <path d={`M${1450 + g * 3} ${stn - 4} l 26 14 l -26 14 Z`} fill={C.limb} />
            </g>
          ) : null}
          {limbK > 0 ? <Limb f={f} cy={lerp(1320, 900, limbK)} R={2600} slide={8} /> : null}
          <AltRuler f={f} altTop={top} altBottom={bottom} x={110} step={10} numbers={false} flags={[{ altKm: 400, label: "space station", color: C.limb }]} color={top > 60 ? C.bone : "#0E2A3E"} />
        </Layer>
        <Layer depth={0}>
          <g opacity={ez(f, T8 + 6, T8 + 20)}>
            <Kicker x={160} y={130} text="THEN HIGHER" color={CREAM} size={30} />
          </g>
        </Layer>
      </Stage>
    </AbsoluteFill>
  );
};

// ================================================================================================================
// C-09 · the chapter card on a void field; orbit-arc rings rise behind the type. MOVER: the rings (one every 40 f).
// ================================================================================================================
const ShotCard: ShotFC<CCold> = ({ f, len }) => (
  <L15Card family={VOID} kicker="Off the Scale · The Edge" title="What If You Jumped From the Edge of Space?" t={Math.min(0.97, f / len)} frame={f + 60} />
);

// ================================================================================================================
// C-10 · "a problem with the word edge": the rings settle at the ruler's top; a fuzzy saffron line wobbles at the
// 100 km mark and the word EDGE is drawn in dashed ink, jittering. MOVER: dashes marching + the word wobbling (±10 px)
// + the rings rising + ruler ticks scrolling + the push in.
// ================================================================================================================
const ShotEdge: ShotFC<CCold> = ({ f, len }) => {
  const top = 130 + f * 0.14;
  const bottom = top - 70;
  const ly = altY(100, top, bottom);
  const wob = (i: number) =>
    Array.from({ length: 25 }, (_, k) => {
      const x = 120 + k * 72;
      return `${k ? "L" : "M"}${x} ${(ly + Math.sin(k * 0.9 + f / 4 + i * 2) * (10 + i * 5) + Math.sin(k * 2.3 - f / 3) * 5).toFixed(1)}`;
    }).join(" ");
  const jx = Math.sin(f / 2.6) * 10;
  const jy = Math.cos(f / 3.1) * 8;
  const draw = ez(f, 4, 40);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: len + 10, x: 900, y: ly, zoom: 1.14 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={VOID.theme} cam={cam} vignette={0.3} grain={0.5}>
        <Layer depth={1}>
          <NightColumn f={f} altTop={top} altBottom={bottom} ground={false} seed={12} />
          <g opacity={0.55}>
            <OrbitRings f={f + 200} cy={1700} r0={500} maxR={1500} width={20} />
          </g>
          {[0, 1, 2].map((i) => (
            <path key={i} d={wob(i)} fill="none" stroke={C.saffron} strokeWidth={6 - i * 1.5} strokeDasharray="22 14" strokeDashoffset={-f * 4 - i * 9} opacity={0.9 - i * 0.25} strokeLinecap="round" />
          ))}
          <Bloom x={960} y={ly} r={420} color={C.saffron} core={0} strength={0.25} squash={0.25} />
          <AltRuler f={f} altTop={top} altBottom={bottom} x={110} step={10} numbers={false} flags={false} />
          <g transform={`translate(${(820 + jx).toFixed(1)} ${(ly - 60 + jy).toFixed(1)}) rotate(${(Math.sin(f / 5) * 3).toFixed(2)})`}>
            <text
              x={0}
              y={0}
              textAnchor="middle"
              style={{ fontFamily: IF2.display, fontWeight: 800, fontSize: 230, letterSpacing: 18, fill: "none", stroke: C.saffronCore, strokeWidth: 7, strokeDasharray: "26 16", strokeDashoffset: -f * 4 }}
              opacity={draw}
            >
              EDGE
            </text>
          </g>
          <Ledge x={140} y={ly + 300} w={200} />
          <Tick x={250} y={ly + 300} pxPerM={90} frame={f} facing={1} pose="think" expression="thinking" look={0.6} headTilt={14} />
        </Layer>
        <Layer depth={0}>
          <Kicker x={120} y={130} text="THE WORD EDGE" color={CREAM} size={28} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================

export const SceneCold: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesCold(t);
  const shots: ShotDef<CCold>[] = [
    { from: 0, S: ShotLaunch, id: "C-01" }, // + C-02
    { from: c.drop, S: ShotDrop, id: "C-03" },
    { from: c.peak, S: ShotPeak, id: "C-04" },
    { from: c.cluster, S: ShotCluster, id: "C-05" },
    { from: c.scale, S: ShotScale, id: "C-06" },
    { from: c.jumps, S: ShotClimb, id: "C-07" }, // + C-08
    { from: c.card, S: ShotCard, id: "C-09" },
    { from: c.edge, S: ShotEdge, id: "C-10" },
  ];
  return playShots(f, shots, c, t.frames);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundCold = (t: SceneTiming): Cue[] => {
  const c = cuesCold(t);
  return [
    { at: 0, file: SFX.wind, vol: 0.18, dur: c.drop + 10, fadeIn: 20, fadeOut: 20 },
    { at: c.tilt, file: SFX.riser, vol: 0.12, dur: c.drop - c.tilt, fadeIn: 6, fadeOut: 6 },
    ...cutHit(c.drop),
    { at: c.drop + 12, file: SFX.popLong, vol: 0.2, dur: 30 },
    ...cutHit(c.peak),
    { at: c.peak + 8, file: SFX.click, vol: 0.14, dur: 12 },
    ...cutHit(c.cluster),
    ...[0, 10, 20, 30].map((o) => ({ at: c.cluster + o + 8, file: SFX.click, vol: 0.1, dur: 10 })),
    ...cutHit(c.scale),
    { at: c.scale + 22, file: SFX.boom, vol: 0.3, dur: 90, fadeOut: 30 },
    { at: c.scale + 24, file: SFX.click, vol: 0.12, dur: 10 },
    ...cutHit(c.jumps),
    ...[0, 12, 24].map((o) => ({ at: c.jumps + 60 + o, file: SFX.pop, vol: 0.16, dur: 20 })),
    { at: c.higher, file: SFX.riser, vol: 0.16, dur: c.card - c.higher, fadeIn: 6, fadeOut: 6 },
    { at: c.card, file: SFX.boom, vol: 0.24, dur: 90, fadeOut: 30 },
    ...cutHit(c.edge),
    { at: c.edge + 6, file: SFX.pop, vol: 0.18, dur: 20 },
  ];
};
