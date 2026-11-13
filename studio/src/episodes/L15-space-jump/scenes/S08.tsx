// L15 scene "l08" (storyboard §3 scene 8: 8-01…8-12, script lines 65-71; STUDIO_SET plates → void → petrol).
// Every row is a hard cut: 8-01 (four plates, each a "?") · 8-02 (fixed drag; straight down, no wind) · 8-03 (no spin,
// no heating, no tumbling) · 8-04 (the air's temperature, not the probe's) · 8-05 (an average, not a day) · 8-06 (the
// biggest shortcut) · 8-07 (kept simple on purpose) · 8-08 (the records are less tidy) · 8-09 (first report vs
// official, no numbers) · 8-10 (sources disagree, no numbers) · 8-11 (the edge isn't settled: 80 km, 100 km) · 8-12
// (thin enough to go supersonic, thick enough to end it).
// Numbers drawn, each with its sources.md row: 80 KM (#2), 100 KM (#1). Nothing else: the first-report speed (#4 B) and the flagged free-fall time (#8 B)
// are drawn as a needle and a watch hand with no numeral and no scale (F3); balloon heights are positions only.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Bloom, Kicker, Layer, Motes, Sky, Stage, Tick, UnknownTag, alpha, cameraAt, impact, mixHex, rnd, IF2 } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { ATM, BOUNDARY, JUMPS, TEMP_READ } from "../jumpdata";
import { ColdGauge, SpeedGauge } from "../L15Gauges";
import { AltRuler, altY } from "../sky";
import { AirCube, Balloon, Flame, Jumper, Probe, Spiral, Trace } from "../props";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { JumpCard } from "./S02";
import { pillFill } from "../families";
import { BlankWatch, C, CREAM, INK, Ledge, NightColumn, NotePlate, PETROL, PillA, Pop, STUDIO, Strike, StudioRoom, VOID, cl01, ez, lerp, path1 } from "./a-parts";

export const cuesL08 = (t: SceneTiming) => {
  const { at, p } = cueKit(t);
  return {
    notes: 0, // 8-01
    plates: p(0, "Our model has"), // 8-02
    strikes: p(0, "It has no spin"), // 8-03
    airs: p(0, "The temperature we showed"), // 8-04
    avg: at(1), // 8-05
    shortcut: p(1, "And a fixed drag"), // 8-06
    tape: at(2), // 8-07
    records: at(3), // 8-08
    first: p(3, "Baumgartner's first"), // 8-09
    eus: at(4), // 8-10
    edge: at(5), // 8-11
    thin: at(6), // 8-12
    end: t.frames,
  };
};
export type C08 = ReturnType<typeof cuesL08>;

const drift = (seed: number, frames = 200) => ({ zoom: 1.07, panX: 0.012, panY: 0, frames, seed });

// ================================================================================================================
// 8-01 · Tick turns over a sheet of notes: four plates, each with a small "?", drop in one after another.
// MOVER: the page turning (≈ 30 px/f) + plates dropping (stagger 14 f, 24 px/f).
// ================================================================================================================
const ShotNotes: ShotFC<C08> = ({ f }) => {
  const turn = ez(f, 0, 16);
  return (
    <Stage theme={STUDIO.theme} shotFrame={f} drift={drift(1)} vignette={0.12} grain={0.5}>
      <StudioRoom f={f}>
        <g transform={`translate(330 640) scale(${(1 - 2 * turn).toFixed(3)} 1)`}>
          <rect x={0} y={0} width={230} height={170} rx={10} fill={turn < 0.5 ? CREAM : mixHex(CREAM, C.limb, 0.3)} stroke={INK} strokeWidth={4} />
          {turn < 0.5 ? [0, 1, 2, 3].map((l) => <line key={l} x1={24} y1={36 + l * 32} x2={200} y2={36 + l * 32} stroke={INK} strokeWidth={4} opacity={0.6} />) : null}
        </g>
        {[0, 1, 2, 3].map((i) => {
          const k = ez(f, 12 + i * 14, 26 + i * 14);
          return (
            <g key={i} transform={`translate(0 ${(-(1 - k) * 400).toFixed(1)})`} opacity={k}>
              <NotePlate x={440 + i * 330} y={420 + (i % 2) * 40} w={280} h={220} tilt={(i % 2 ? 2 : -2) + Math.sin(f / 9 + i) * 1.2} />
              <UnknownTag x={440 + i * 330 + 140} y={420 + (i % 2) * 40 + 110} size={46} />
            </g>
          );
        })}
        <Tick x={220} y={1000} pxPerM={150} frame={f} facing={1} pose={f < 16 ? "crouch-reach" : "point"} expression="determined" look={0.4} squash={impact(f, 16, 0.1, 10)} />
      </StudioRoom>
      <Layer depth={0}>
        <rect x={100} y={96} width={540} height={56} rx={28} fill={pillFill(STUDIO)} />
        <Kicker x={124} y={134} text="WHAT WE DON'T KNOW" color={CREAM} size={30} />
      </Layer>
    </Stage>
  );
};

// ================================================================================================================
// 8-02 · "a fixed drag coefficient, a straight vertical fall, no wind": two plates slam in with those words.
// MOVER: plates slamming (40 px/f) + the icons running (drag streaks, a marching down-arrow, a struck wind streamer).
// ================================================================================================================
const ShotAssume: ShotFC<C08> = ({ f }) => {
  const slam = (at: number) => {
    const a = f - at;
    return a < 0 ? null : a < 6 ? 2.2 - 1.2 * (a / 6) ** 2 : 1 + 0.04 * Math.sin((a - 6) * 1.3) * Math.exp(-(a - 6) / 6);
  };
  const s1 = slam(4);
  const s2 = slam(34);
  return (
    <Pop f={f}>
      <Stage theme={STUDIO.theme} shotFrame={f} drift={drift(2)} vignette={0.12} grain={0.5}>
        <StudioRoom f={f + 80}>
          {s1 != null ? (
            <g transform={`translate(560 470) scale(${s1.toFixed(3)})`}>
              <NotePlate x={-250} y={-200} w={500} h={400} />
              <Probe x={0} y={-10} size={150} f={f} trail={110} lamp={false} />
              <rect x={-170} y={130} width={340} height={14} rx={7} fill={C.saffron} />
            </g>
          ) : null}
          {s2 != null ? (
            <g transform={`translate(1240 470) scale(${s2.toFixed(3)})`}>
              <NotePlate x={-250} y={-200} w={500} h={400} />
              {Array.from({ length: 6 }, (_, i) => (
                <circle key={i} cx={0} cy={-150 + ((i * 50 + f * 6) % 300)} r={10} fill={C.saffron} />
              ))}
              <path d="M-30 150 L30 150 L0 190 Z" fill={C.saffron} />
              {[0, 1, 2].map((i) => (
                <path key={i} d={`M${-210 + ((f * 5 + i * 60) % 120)} ${-90 + i * 70} q 40 -18 80 0 t 80 0`} stroke={C.limb} strokeWidth={6} fill="none" opacity={0.8} />
              ))}
              <Strike x1={-220} y1={-130} x2={-40} y2={110} k={ez(f, 44, 54)} w={12} />
            </g>
          ) : null}
          <Tick x={900} y={1000} pxPerM={130} frame={f} facing={f < 30 ? -1 : 1} pose="press" expression="proud" look={0.3} squash={impact(f, f < 30 ? 6 : 36, 0.14, 10)} />
        </StudioRoom>
        <Layer depth={0}>
          <PillA x={560} y={760} text="FIXED DRAG" F={STUDIO} dot={C.saffron} align="middle" opacity={ez(f, 10, 20)} />
          <PillA x={1240} y={760} text="STRAIGHT DOWN · NO WIND" F={STUDIO} dot={C.limb} align="middle" opacity={ez(f, 40, 50)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 8-03 · "no spin, no heating, no tumbling": three strikethroughs draw across three icons (spiral, flame, tumbling
// capsule). MOVER: the strike strokes (40 px/f, staggered) + the spiral turning, the flame flickering, the capsule tumbling.
// ================================================================================================================
const ShotStrikes: ShotFC<C08> = ({ f }) => {
  const icons = [480, 960, 1440];
  return (
    <Pop f={f}>
      <Stage theme={STUDIO.theme} shotFrame={f} drift={drift(3)} vignette={0.12} grain={0.5}>
        <StudioRoom f={f + 160}>
          {icons.map((x, i) => (
            <NotePlate key={i} x={x - 180} y={300} w={360} h={360} />
          ))}
          <Spiral x={icons[0]} y={480} r={130} f={f} speed={4} />
          <Flame x={icons[1] - 40} y={560} angle={-90} len={200} f={f} />
          <Probe x={icons[2]} y={480} size={170} f={f} variant="spin" lamp={false} />
          {icons.map((x, i) => (
            <Strike key={i} x1={x - 190} y1={320} x2={x + 190} y2={640} k={ez(f, 10 + i * 20, 22 + i * 20)} w={20} />
          ))}
          <Tick x={250} y={1000} pxPerM={130} frame={f} facing={1} staff pose="point" expression={f < 60 ? "determined" : "happy"} look={0.4} />
        </StudioRoom>
        <Layer depth={0}>
          <PillA x={960} y={800} text="NO SPIN · NO HEATING · NO TUMBLING" F={STUDIO} dot={C.saffron} align="middle" opacity={ez(f, 6, 18)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 8-04 · "The temperature we showed is the air's, not the probe's": the COLD gauge with a tag swinging in to point at
// the air, not the capsule (F7). MOVER: the tag swinging in (≈ 20 px/f) + air dots swarming + the push to the gauge.
// ================================================================================================================
const ShotAirTemp: ShotFC<C08> = ({ f, len }) => {
  const sw = ez(f, 2, 18);
  const ang = lerp(80, -38, sw) + Math.sin(f / 4) * 10 * Math.exp(-Math.max(0, f - 18) / 14) * (f > 18 ? 1 : 0);
  const G = { x: 700, y: 180, s: 1.8 };
  const bead = [G.x + 180 * G.s, G.y + 70 * G.s];
  const L = 360;
  const tx = bead[0] + Math.sin((ang * Math.PI) / 180) * -L;
  const ty = bead[1] + Math.cos((ang * Math.PI) / 180) * L;
  return (
    <Pop f={f}>
      <Stage theme={STUDIO.theme} cam={cameraAt(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len + 10, x: 1000, y: 480, zoom: 1.12 }])} vignette={0.12} grain={0.5}>
        <StudioRoom f={f + 240}>
          <ColdGauge x={G.x} y={G.y} scale={G.s} f={f} family={STUDIO} theme="dark" s={{ value: TEMP_READ.at20 }} />
          <AirCube x={260} y={560} size={240} n={46} f={f} speed={6} color={C.bone} glass={C.limb} />
          <Probe x={1560} y={720} size={150} f={f} lamp={false} variant="float" />
          <Strike x1={1460} y1={600} x2={1660} y2={840} k={ez(f, 30, 40)} w={12} />
          <line x1={bead[0]} y1={bead[1]} x2={tx} y2={ty} stroke={C.saffron} strokeWidth={5} />
          <g transform={`translate(${tx.toFixed(1)} ${ty.toFixed(1)}) rotate(${(-ang * 0.3).toFixed(2)})`}>
            <rect x={-90} y={-8} width={180} height={70} rx={14} fill={C.saffron} stroke={INK} strokeWidth={4} />
            <text x={0} y={42} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 34, letterSpacing: 4, fill: INK }}>
              AIR
            </text>
          </g>
          <Tick x={760} y={1000} pxPerM={130} frame={f} facing={-1} pose={f > 24 ? "press" : "point"} expression="determined" look={0.5} squash={impact(f, 26, 0.1, 10)} />
        </StudioRoom>
        <Layer depth={0}>
          <PillA x={120} y={140} text="THE AIR'S, NOT THE PROBE'S" F={STUDIO} dot={C.limb} opacity={ez(f, 8, 20)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 8-05 · "The air model is a standard average, not any one particular day" (#11): many wavy temperature profiles fan
// out on a plate and one thick average is drawn through them (its shape from the ATM rows; no numbers).
// MOVER: curve heads drawing (16 px/f, staggered) + the average line (18 px/f) + the pull back.
// ================================================================================================================
const PLOT = { x: 380, y: 160, w: 1000, h: 640 };
const tMin = -90;
const tMax = 25;
const profile = (wig: number, seed: number) =>
  ATM.map((r, i) => {
    const px = PLOT.x + 60 + ((r.tC + (i ? (rnd(seed * 13 + i) - 0.5) * wig : 0) - tMin) / (tMax - tMin)) * (PLOT.w - 120);
    const py = PLOT.y + PLOT.h - 40 - (r.km / 80) * (PLOT.h - 80);
    return [px, py] as [number, number];
  });
const ShotAverage: ShotFC<C08> = ({ f, len }) => {
  const cols = [C.limb, C.teal, C.meso, C.starTeal, C.film, C.skyBlue, C.frost, C.strato];
  return (
    <Pop f={f}>
      <Stage theme={STUDIO.theme} cam={cameraAt(f, [{ f: 0, x: 900, y: 500, zoom: 1.2 }, { f: len, x: 960, y: 540, zoom: 1.0 }])} vignette={0.12} grain={0.5}>
        <StudioRoom f={f + 320}>
          <NotePlate x={PLOT.x} y={PLOT.y} w={PLOT.w} h={PLOT.h} />
          <line x1={PLOT.x + 60} y1={PLOT.y + PLOT.h - 40} x2={PLOT.x + PLOT.w - 40} y2={PLOT.y + PLOT.h - 40} stroke={CREAM} strokeWidth={4} opacity={0.7} />
          <line x1={PLOT.x + 60} y1={PLOT.y + PLOT.h - 40} x2={PLOT.x + 60} y2={PLOT.y + 30} stroke={CREAM} strokeWidth={4} opacity={0.7} />
          {cols.map((c, i) => (
            <Trace key={i} pts={profile(30, i + 1)} head={ez(f, 4 + i * 6, 50 + i * 6)} f={f} color={c} width={4} />
          ))}
          <Trace pts={profile(0, 0)} head={ez(f, 50, 100)} f={f} color={C.saffron} width={14} />
          <Tick x={1560} y={1000} pxPerM={130} frame={f} facing={-1} pose="point" expression="thinking" look={0.4} />
        </StudioRoom>
        <Layer depth={0}>
          <PillA x={1420} y={140} text="AN AVERAGE, NOT A DAY" F={STUDIO} dot={C.saffron} align="middle" opacity={ez(f, 60, 72)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 8-06 · "a fixed drag coefficient is the biggest shortcut": a flat line against a wiggling real curve; a capsule
// morphs fat to slim as the curve wiggles; Tick holds the flat line taut. MOVER: the wiggle curve drawing (20 px/f) and
// rippling + the capsule morphing + the push.
// ================================================================================================================
const FLAT_Y = 540;
const wiggle = (f: number, n = 40) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const u = i / n;
    return [300 + u * 1100, FLAT_Y - Math.sin(u * 9 + f / 10) * 70 * Math.sin(u * Math.PI) - 60 * Math.exp(-(((u - 0.45) / 0.12) ** 2))] as [number, number];
  });
const ShotShortcut: ShotFC<C08> = ({ f, len }) => {
  const k = 1 + 0.32 * Math.sin(f / 9);
  return (
    <Pop f={f}>
      <Stage theme={STUDIO.theme} cam={cameraAt(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len + 10, x: 900, y: 520, zoom: 1.12 }])} vignette={0.12} grain={0.5}>
        <StudioRoom f={f + 400}>
          <NotePlate x={240} y={260} w={1220} h={520} />
          <line x1={300} y1={FLAT_Y} x2={1400} y2={FLAT_Y} stroke={C.saffron} strokeWidth={12} strokeLinecap="round" />
          <Trace pts={wiggle(f)} head={ez(f, 4, 60)} f={f} color={C.limb} width={7} />
          <g transform={`translate(1640 560) scale(${k.toFixed(3)} ${(1 / k).toFixed(3)})`}>
            <Probe x={0} y={0} size={170} f={f} lamp={false} />
          </g>
          <Tick x={250} y={1000} pxPerM={130} frame={f} facing={1} pose="heave" expression="thinking" look={0.6} />
        </StudioRoom>
        <Layer depth={0}>
          <PillA x={120} y={140} text="BIGGEST SHORTCUT" F={STUDIO} dot={C.saffron} opacity={ez(f, 20, 32)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 8-07 · "We kept it fixed so the story stays visible, not because it's true": Tick tapes a SIMPLIFIED label onto the
// flat line. MOVER: the label and tape strips sliding in (20 px/f) + the label wobbling + the push in.
// ================================================================================================================
const ShotTape: ShotFC<C08> = ({ f, len }) => {
  const lab = ez(f, 2, 40);
  const lx = lerp(1900, 860, lab);
  const t1 = ez(f, 40, 56);
  const t2 = ez(f, 56, 72);
  const wob = Math.sin(f / 5) * 3;
  return (
    <Pop f={f}>
      <Stage theme={STUDIO.theme} cam={cameraAt(f, [{ f: 0, x: 960, y: 560, zoom: 1.0 }, { f: len + 10, x: 900, y: 540, zoom: 1.2 }])} vignette={0.12} grain={0.5}>
        <StudioRoom f={f + 520}>
          <Trace pts={wiggle(f + 170)} head={1} f={f} color={alpha(C.limb, 0.5)} width={5} />
          <line x1={200} y1={FLAT_Y} x2={1700} y2={FLAT_Y} stroke={C.saffron} strokeWidth={14} strokeLinecap="round" />
          <g transform={`translate(${lx.toFixed(1)} ${FLAT_Y + 20}) rotate(${(-4 + wob).toFixed(2)})`}>
            <rect x={0} y={0} width={420} height={110} rx={12} fill={CREAM} stroke={INK} strokeWidth={5} />
            <text x={210} y={74} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 52, letterSpacing: 6, fill: INK }}>
              SIMPLIFIED
            </text>
            <rect x={-40 + (1 - t1) * 300} y={-20} width={120} height={44} rx={6} fill={alpha(C.saffron, 0.7)} transform="rotate(-20)" opacity={t1} />
            <rect x={340 + (1 - t2) * 300} y={60} width={120} height={44} rx={6} fill={alpha(C.saffron, 0.7)} transform="rotate(-20)" opacity={t2} />
          </g>
          <Tick x={760} y={1000} pxPerM={140} frame={f} facing={1} pose={f > 40 ? "press" : "point"} expression="happy" look={0.5} headTilt={10} squash={impact(f, 44, 0.1, 10)} />
        </StudioRoom>
        <Layer depth={0}>
          <Motes frame={f} n={14} x={0} y={60} w={1920} h={900} color={alpha(C.saffronCore, 0.8)} seed={9} size={5} drift={50} />
          <PillA x={120} y={140} text="KEPT SIMPLE ON PURPOSE" F={STUDIO} dot={C.saffron} opacity={ez(f, 30, 42)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 8-08 · "the records are less tidy than they look": the three record cards slide back in, each with a small note
// that flips open; Tick peeks behind one. MOVER: cards sliding in (20 px/f) + notes flipping (staggered) + the pan.
// ================================================================================================================
const ShotRecords: ShotFC<C08> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 860, y: 540, zoom: 1.04 },
    { f: len, x: 1060, y: 540, zoom: 1.0 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={STUDIO.theme} cam={cam} vignette={0.12} grain={0.5}>
        <StudioRoom f={f + 640}>
          {[0, 1, 2].map((i) => {
            const k = ez(f, i * 10, 30 + i * 10);
            const note = ez(f, 40 + i * 14, 56 + i * 14);
            const x = 250 + i * 520;
            return (
              <g key={i} transform={`translate(${((1 - k) * 900).toFixed(1)} 0)`}>
                <JumpCard i={i} x={x} y={200} w={330} h={620} f={f} rise={0.5} jh={30} />
                <g transform={`translate(${x + 350} 320) scale(1 ${note.toFixed(3)})`}>
                  <rect x={0} y={0} width={140} height={170} rx={8} fill={mixHex(CREAM, C.saffron, 0.25)} stroke={INK} strokeWidth={4} transform={`rotate(${4 - i * 3})`} />
                  {[0, 1, 2, 3].map((l) => (
                    <path key={l} d={`M16 ${36 + l * 32} q 26 ${-8 + (l % 2) * 14} 54 0 t 54 0`} stroke={INK} strokeWidth={4} fill="none" opacity={0.7} />
                  ))}
                </g>
              </g>
            );
          })}
          <Tick x={1700} y={1000} pxPerM={140} frame={f} facing={-1} pose="lean" expression="worried" look={0.7} headTilt={-12} />
        </StudioRoom>
        <Layer depth={0}>
          <rect x={100} y={96} width={680} height={56} rx={28} fill={pillFill(STUDIO)} />
          <Kicker x={124} y={134} text="THE RECORDS ARE LESS TIDY" color={CREAM} size={30} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 8-09 · "Baumgartner's first reported top speed was lower, and the official one is higher" (#4; the first-report figure is class B):
// two needles on a dial with NO numbers: the earlier one fading, the official one settling. MOVER: needles sweeping
// (3°/f) + the earlier one fading + the push.
// ================================================================================================================
const ShotTwoNeedles: ShotFC<C08> = ({ f, len }) => {
  const G = { x: 520, y: 140, s: 2.2 };
  const cx = G.x + 180 * G.s;
  const cy = G.y + 218 * G.s;
  const r = 128 * G.s * 0.82;
  const firstV = 0.78 * ez(f, 2, 30); // drawn lower; NOT scaled to the secondary figure (F3)
  const offV = lerp(0, 0.85, ez(f, 30, 66)) + 0.03 * Math.sin((f - 66) / 3) * Math.exp(-Math.max(0, f - 66) / 10) * (f > 66 ? 1 : 0);
  const fade = 1 - 0.75 * ez(f, 60, 100);
  const a = (v: number) => ((180 + (v / 1.15) * 180) * Math.PI) / 180;
  return (
    <Pop f={f}>
      <Stage theme={STUDIO.theme} cam={cameraAt(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len + 10, x: 940, y: 520, zoom: 1.1 }])} vignette={0.12} grain={0.5}>
        <StudioRoom f={f + 760}>
          <SpeedGauge x={G.x} y={G.y} scale={G.s} f={f} family={STUDIO} theme="dark" s={{ value: offV }} />
          <line x1={cx} y1={cy} x2={cx + Math.cos(a(firstV)) * r} y2={cy + Math.sin(a(firstV)) * r} stroke={CREAM} strokeWidth={9} strokeDasharray="16 12" strokeLinecap="round" opacity={fade} />
          <Tick x={1560} y={1000} pxPerM={140} frame={f} facing={-1} pose="think" expression="thinking" look={0.5} />
        </StudioRoom>
        <Layer depth={0}>
          <PillA x={130} y={230} text="FIRST REPORT" F={STUDIO} dot={CREAM} opacity={ez(f, 8, 20) * (0.5 + 0.5 * fade)} />
          <PillA x={1340} y={230} text="OFFICIAL" F={STUDIO} dot={C.vermilion} opacity={ez(f, 50, 62)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 8-10 · "Eustace's free-fall time appears as [a second time], flagged as contradictory" (#8 class B: no numbers): two stopwatches
// whose hands stop in different places; a "?" tag pops. MOVER: two hands sweeping (6°/f) to different stops + the "?".
// ================================================================================================================
const ShotWatches: ShotFC<C08> = ({ f }) => {
  const hand = (stop: number) => Math.min(stop, f * 6);
  const q = ez(f, 160, 172);
  return (
    <Pop f={f}>
      <Stage theme={STUDIO.theme} shotFrame={f} drift={drift(5, 260)} vignette={0.12} grain={0.5}>
        <StudioRoom f={f + 880}>
          <BlankWatch x={560} y={480} r={220} angle={hand(720 + 140)} f={f} />
          <BlankWatch x={1360} y={480} r={220} angle={hand(720 + 250)} f={f} ring={C.limb} />
          {q > 0 ? (
            <g transform={`translate(960 260) scale(${(q * (1 + 0.1 * Math.sin(f / 3))).toFixed(3)})`}>
              <Bloom x={0} y={0} r={120} color={C.vermilion} core={0} strength={0.5} />
              <UnknownTag x={0} y={0} size={56} />
            </g>
          ) : null}
          <Tick x={960} y={1000} pxPerM={140} frame={f} facing={1} pose="shrug" expression="worried" look={Math.sin(f / 20) * 0.9} />
        </StudioRoom>
        <Layer depth={0}>
          <PillA x={960} y={170} text="SOURCES DISAGREE" F={STUDIO} dot={C.vermilion} align="middle" opacity={ez(f, 20, 32)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 8-11 · "Even the edge isn't settled. Whether 80 or 100, the three jumps never got there" (#1 #2 #9): the night ruler,
// the 100 km line wobbling, the 80 km line, three balloons rising and stopping well short; Tick below shading his eyes.
// MOVER: balloons rising (≈ 10 px/f) + the line wobbling (6 px/f) + the tilt up / pull back (ruler streaming).
// ================================================================================================================
const ShotEdgeAgain: ShotFC<C08> = ({ f, len }) => {
  const mid = path1(f, [[0, 22], [len, 53]]);
  const span = path1(f, [[0, 50], [len, 116]]);
  const top = mid + span / 2;
  const bottom = mid - span / 2;
  const A = (a: number) => altY(a, top, bottom);
  const ly = A(BOUNDARY.fai);
  const wob = Array.from({ length: 24 }, (_, k) => `${k ? "L" : "M"}${160 + k * 76} ${(ly + Math.sin(k * 0.8 + f / 4) * 14 + Math.sin(k * 2.1 - f / 3) * 5).toFixed(1)}`).join(" ");
  const heights = [JUMPS.kittinger.exitM / 1000, JUMPS.baumgartner.exitKm, JUMPS.eustace.exitKm]; // #7 #4 #8 (positions)
  const kinds = ["gondola", "capsule", "beam"] as const;
  const gy = A(0);
  return (
    <Pop f={f}>
      <Stage theme={VOID.theme} shotFrame={f} drift={drift(6, 260)} vignette={0.3} grain={0.5}>
        <Layer depth={1}>
          <NightColumn f={f} altTop={top} altBottom={bottom} seed={31} />
          <AltRuler f={f} altTop={top} altBottom={bottom} x={150} step={10} numbers={false} flags={false} pins={[{ altKm: BOUNDARY.mcdowell, label: "", draw: 1, len: 1500, color: C.limb }]} />
          <path d={wob} fill="none" stroke={C.saffron} strokeWidth={7} strokeDasharray="24 14" strokeDashoffset={-f * 4} strokeLinecap="round" />
          {heights.map((h, i) => (
            <Balloon key={i} x={560 + i * 330} y={A(h * ez(f, 6 + i * 14, 110 + i * 14))} size={170} f={f + i * 30} variant={kinds[i]} payload={<Jumper x={0} y={0} h={30} f={f} pose={i === 2 ? "hang" : "stand"} color={i === 1 ? C.saffron : C.teal} />} />
          ))}
          {gy < 1200 ? <Tick x={330} y={gy} pxPerM={90} frame={f} facing={1} pose="shield" expression="thinking" look={0.9} headTilt={-20} /> : null}
        </Layer>
        <Layer depth={0}>
          <PillA x={1500} y={A(BOUNDARY.mcdowell) - 50} text={`${BOUNDARY.mcdowell} KM` /* #2 */} F={VOID} dot={C.limb} opacity={ez(f, 30, 42)} />
          <PillA x={1500} y={ly - 50} text={`${BOUNDARY.fai} KM` /* #1 */} F={VOID} dot={C.saffron} opacity={ez(f, 50, 62)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 8-12 · "thin enough to let a fall go supersonic, and thick enough to end it" (#4 #11): a schematic speed trace down
// the layers (no numbers); a thin-air band glows teal (supersonic), a thick-air band glows saffron (the end); Tick at
// the trace's end. MOVER: the trace head (16 px/f) + the band glows wiping (14 px/f) + the drift.
// ================================================================================================================
const ShotThin: ShotFC<C08> = ({ f, len }) => {
  const top = 45;
  const bottom = -2;
  const A = (a: number) => altY(a, top, bottom, 60, 900);
  const exitKm = JUMPS.baumgartner.exitKm; // #4: the start height (position only)
  const pts = Array.from({ length: 31 }, (_, i) => {
    const u = i / 30;
    const alt = exitKm * (1 - u);
    const sp = Math.sin(Math.min(1, u / 0.45) * Math.PI * 0.5) * (u < 0.45 ? 1 : Math.exp(-(u - 0.45) * 3.2));
    return [380 + sp * 900, A(alt)] as [number, number];
  });
  const w1 = ez(f, 40, 110);
  const w2 = ez(f, 90, 160);
  const head = ez(f, 4, len * 0.7);
  const end = pts[pts.length - 1];
  return (
    <Pop f={f}>
      <Stage theme={PETROL.theme} shotFrame={f} drift={drift(7, 260)} vignette={0.25} grain={0.5}>
        <Layer depth={0.2}>
          <Sky family={PETROL} x={-200} y={-200} w={2320} h={1480} />
        </Layer>
        <Layer depth={1}>
          <rect x={300} y={A(exitKm + 2)} width={1300 * w1} height={A(24) - A(exitKm + 2)} fill={C.teal} opacity={0.32} />
          <rect x={300} y={A(exitKm + 2)} width={1300 * w1} height={8} fill={C.teal} />
          <rect x={300} y={A(10)} width={1300 * w2} height={A(0) - A(10)} fill={C.saffron} opacity={0.3} />
          <rect x={300} y={A(10)} width={1300 * w2} height={8} fill={C.saffron} />
          <AltRuler f={f} altTop={top} altBottom={bottom} x={300} y={60} h={900} step={10} numbers={false} flags={false} />
          <Trace pts={pts} head={head} f={f} color={CREAM} width={9} />
          <rect x={300} y={A(0)} width={1400} height={14} rx={6} fill={C.dune2} />
          <Ledge x={end[0] - 90} y={A(0) - 2} w={180} />
          <Tick x={end[0] + 60} y={A(0)} pxPerM={110} frame={f} facing={-1} pose={head >= 1 ? "hips" : "stand"} expression="proud" look={0.5} />
        </Layer>
        <Layer depth={0}>
          <Motes frame={f} n={16} x={0} y={60} w={1920} h={900} color={alpha(PETROL.light, 0.8)} seed={7} size={4} drift={40} />
          <PillA x={1100} y={A(31)} text="THIN ENOUGH TO GO SUPERSONIC" F={PETROL} dot={C.teal} opacity={ez(f, 60, 72)} />
          <PillA x={1100} y={A(5)} text="THICK ENOUGH TO END IT" F={PETROL} dot={C.saffron} opacity={ez(f, 120, 132)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================

export const SceneL08: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL08(t);
  const shots: ShotDef<C08>[] = [
    { from: 0, S: ShotNotes, id: "8-01" },
    { from: c.plates, S: ShotAssume, id: "8-02" },
    { from: c.strikes, S: ShotStrikes, id: "8-03" },
    { from: c.airs, S: ShotAirTemp, id: "8-04" },
    { from: c.avg, S: ShotAverage, id: "8-05" },
    { from: c.shortcut, S: ShotShortcut, id: "8-06" },
    { from: c.tape, S: ShotTape, id: "8-07" },
    { from: c.records, S: ShotRecords, id: "8-08" },
    { from: c.first, S: ShotTwoNeedles, id: "8-09" },
    { from: c.eus, S: ShotWatches, id: "8-10" },
    { from: c.edge, S: ShotEdgeAgain, id: "8-11" },
    { from: c.thin, S: ShotThin, id: "8-12" },
  ];
  return playShots(f, shots, c, t.frames);
};

export const soundL08 = (t: SceneTiming): Cue[] => {
  const c = cuesL08(t);
  return [
    ...[12, 26, 40, 54].map((o) => ({ at: c.notes + o + 8, file: SFX.pop, vol: 0.14, dur: 20 })),
    ...cutHit(c.plates),
    { at: c.plates + 4, file: SFX.popLong, vol: 0.2, dur: 30 },
    { at: c.plates + 34, file: SFX.popLong, vol: 0.2, dur: 30 },
    ...cutHit(c.strikes),
    ...[10, 30, 50].map((o) => ({ at: c.strikes + o, file: SFX.click, vol: 0.14, dur: 12 })),
    ...cutHit(c.airs),
    { at: c.airs + 18, file: SFX.pop, vol: 0.16, dur: 20 },
    ...cutHit(c.avg),
    { at: c.avg + 50, file: SFX.swirl, vol: 0.12, dur: 40 },
    ...cutHit(c.shortcut),
    { at: c.shortcut + 6, file: SFX.click, vol: 0.12, dur: 12 },
    ...cutHit(c.tape),
    { at: c.tape + 44, file: SFX.popLong, vol: 0.18, dur: 30 },
    ...cutHit(c.records),
    ...[40, 54, 68].map((o) => ({ at: c.records + o, file: SFX.pop, vol: 0.14, dur: 20 })),
    ...cutHit(c.first),
    ...Array.from({ length: 6 }, (_, i) => ({ at: c.first + 30 + i * 6, file: SFX.click, vol: 0.07, dur: 8 })),
    ...cutHit(c.eus),
    { at: c.eus + 145, file: SFX.click, vol: 0.14, dur: 12 },
    { at: c.eus + 162, file: SFX.click, vol: 0.14, dur: 12 },
    { at: c.eus + 162, file: SFX.pop, vol: 0.18, dur: 20 },
    ...cutHit(c.edge),
    { at: c.edge + 4, file: SFX.riser, vol: 0.12, dur: 70, fadeIn: 6, fadeOut: 10 },
    ...cutHit(c.thin),
    { at: c.thin + 100, file: SFX.chime, vol: 0.16, dur: 60 },
  ];
};
