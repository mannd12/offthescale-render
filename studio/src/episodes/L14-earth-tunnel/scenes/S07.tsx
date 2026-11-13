// L14 scene l07 "The middle" (storyboard §3 "7 ·": shots 7-01…7-17, script lines 59-63, void high-key core with a
// STUDIO_SET cabin and film reel, Act III). Shot components (hard cuts; continuous rows are phases):
// 7-01 (the probe glides into the bright inner core) · 7-02 (pull arrows from every side cancel) · 7-03+7-04 (the PULL
// rail falls to zero and rebounds off the floor; Tick watches) · 7-05 KEY ART III (three up, one down) · 7-06+7-07 (the
// PULL needle drops out at Tick's feet) · 7-08 (STUDIO cabin: loose tools float, the tether goes slack) · 7-09 (still at
// full speed, streaks) · 7-10+7-11 (PULL 0 / SPEED at the peak; the centre crosshair passes, a ring flashes) · 7-12 (the
// speed hill) · 7-13 (as fast as an orbit: the satellite's shadow IS the probe) · 7-14 (past the centre: the arrows flip)
// · 7-15 (the half behind it shades in) · 7-16 (the replay in reverse: strata slowing) · 7-17 (Tick cranks a film reel
// backward).
// Numbers drawn, each with its sources.md row: 0 (the pull at the centre, #20; Verification log: zero pull at the
// centre) · ~8 km/s (#2: the peak at the centre; Verification log: same as a circular orbit at the surface) · the SPEED
// stop "8 km/s" (#2). F10: no centre pressure or temperature: HEAT and PRESSURE are pinned with NO readout. F13: the
// traveller is the probe; Tick stands outside the tunnel (at the panel ledge, in the studio).
import React from "react";
import { useCurrentFrame } from "remotion";
import { Bloom, Embers, Kicker, Layer, Motes, Sky, Stage, Stars, Tick, alpha, cameraAt, mixHex, rnd } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { GAUGE, GaugeState, L14Gauges, STOP } from "../L14Gauges";
import { L14_STRATA, StrataWall } from "../tunnel";
import { CutGlobe } from "../cutglobe";
import { FilmReel, Probe, Tether } from "../props";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { Arrow, C, CREAM, INK, Pop, STUDIO, Slab, StudioRoom, Tag, VOID, clamp01, ez } from "./Cold";

const V = VOID;
const S = STUDIO;

export const cuesL07 = (t: SceneTiming) => {
  const { at, p, end } = cueKit(t);
  return {
    middle: 0, // 7-01
    cancel: p(0, "Here the pull"), // 7-02
    zero: p(0, "The pull dial reads zero"), // 7-03
    fourth: p(0, "The fourth gauge"), // 7-04 (phase)
    three: p(0, "Three of our gauges"), // 7-05 (key art III at line 0 @ 0.9)
    last: at(1), // 7-06
    floor: p(1, "through the floor"), // 7-07 (phase)
    cabin: at(2), // 7-08
    racing: p(2, "even though it is still racing"), // 7-09
    nostop: p(2, "It doesn't stop there"), // 7-10
    coasts: p(2, "It coasts straight through"), // 7-11 (phase)
    hill: at(3), // 7-12
    orbit: p(3, "as fast as an orbit"), // 7-13
    passes: p(3, "The moment it passes"), // 7-14
    behind: p(3, "the whole planet is behind it"), // 7-15
    reverse: at(4), // 7-16
    reel: p(4, "as if the fall"), // 7-17
    end4: end(4),
    end: t.frames,
  };
};
export type CL07 = ReturnType<typeof cuesL07>;

// ---------------------------------------------------------------------------------------------------------------
// shared to this scene: the bright inner core (its own emitter) with turning facet lines, and the void room around it
// ---------------------------------------------------------------------------------------------------------------
const CoreBall: React.FC<{ f: number; cx: number; cy: number; r: number; spin?: number; id: string }> = ({ f, cx, cy, r, spin = 0.5, id }) => {
  const a0 = f * spin;
  return (
    <g>
      <Bloom x={cx} y={cy} r={r * 1.9} color={C.outer} core={0} strength={0.55} />
      <circle cx={cx} cy={cy} r={r + 14} fill="none" stroke={alpha(C.saffronCore, 0.45)} strokeWidth={10} />
      <circle cx={cx} cy={cy} r={r} fill={C.inner} />
      <clipPath id={id}>
        <circle cx={cx} cy={cy} r={r} />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        {/* facet planes: big turning wedges in two golds (contrasty edges crossing ≥ 3 px/f at the rim) */}
        {Array.from({ length: 7 }, (_, i) => {
          const a = ((a0 + i * (360 / 7)) * Math.PI) / 180;
          const b = ((a0 + i * (360 / 7) + 26) * Math.PI) / 180;
          return <path key={i} d={`M${cx} ${cy} L${cx + Math.cos(a) * r * 1.2} ${cy + Math.sin(a) * r * 1.2} L${cx + Math.cos(b) * r * 1.2} ${cy + Math.sin(b) * r * 1.2} Z`} fill={i % 2 ? C.outer : C.innerCore} opacity={i % 2 ? 0.5 : 0.8} />;
        })}
        {Array.from({ length: 9 }, (_, i) => {
          const a = ((-a0 * 0.7 + i * 40) * Math.PI) / 180;
          const d = (-0.8 + i * 0.2) * r;
          const nx = Math.cos(a);
          const ny = Math.sin(a);
          return <line key={`l${i}`} x1={cx + nx * d - ny * r} y1={cy + ny * d + nx * r} x2={cx + nx * d + ny * r} y2={cy + ny * d - nx * r} stroke={C.outerDeep} strokeWidth={5} opacity={0.45} />;
        })}
        <circle cx={cx - r * 0.25} cy={cy - r * 0.25} r={r * 0.55} fill={C.innerCore} opacity={0.55} />
      </g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.outerDeep} strokeWidth={6} />
    </g>
  );
};

const VoidRoom: React.FC<{ f: number; seed?: number; children?: React.ReactNode }> = ({ f, seed = 1, children }) => (
  <g>
    <Sky family={V} />
    <Stars frame={f} n={90} w={1920} h={1080} color={V.text} seed={seed} size={2.4} twinkle={0.7} />
    {children}
    <Embers frame={f} x0={0} x1={1450} y={1120} n={26} color={C.saffronCore} seed={seed + 5} size={6} />
  </g>
);

/** The panel ledge Tick stands on in the void shots (outside the tunnel, F13). */
const Ledge: React.FC<{ y: number; x0?: number; x1?: number }> = ({ y, x0 = -200, x1 = 2200 }) => (
  <g>
    <rect x={x0} y={y} width={x1 - x0} height={600} fill={mixHex(V.sky[0], "#0F3B4F", 0.6)} />
    <rect x={x0} y={y - 6} width={x1 - x0} height={12} fill={C.saffron} />
  </g>
);

/** the middle's cluster: three gauges pinned past their stops (no readout on HEAT / PRESSURE, F10), PULL at zero */
const MID_SPEED: GaugeState = { value: 1, stop: STOP.speed /* #2 */, pinned: true };
const MID_HEAT = { value: 1, pinned: true };
const MID_PRESS: GaugeState = { value: 1, pinned: true };
const MID_PULL: GaugeState = { value: 0, readout: GAUGE.pullCentre /* #20 */, unit: "g" };

// rings expanding from a point (one every `every` frames at `speed` px/f): a growing-shape mover
const Rings: React.FC<{ f: number; cx: number; cy: number; every?: number; speed?: number; maxR?: number; color: string; width?: number; start?: number }> = ({ f, cx, cy, every = 20, speed = 6, maxR = 600, color, width = 8, start = 0 }) => {
  const g = f - start;
  if (g < 0) return null;
  const n = Math.ceil(maxR / speed / every) + 1;
  const k0 = Math.floor(g / every);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const age = g - (k0 - i) * every;
        const r = age * speed;
        if (k0 - i < 0 || r <= 0 || r > maxR) return null;
        return <circle key={k0 - i} cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={width} opacity={0.9 * (1 - r / maxR)} />;
      })}
    </g>
  );
};

// ===============================================================================================================
// 7-01 · the inner core as a bright sphere lit by itself; the probe glides in. MOVER: the probe gliding (≈ 14 px/f,
// easing) + facet wedges turning + embers; the camera pushes.
// ===============================================================================================================
const ShotArrive: ShotFC<CL07> = ({ f, len }) => {
  const k = ez(f, 0, len + 20);
  const px = -160 + 900 * k;
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 540, zoom: 1.0 },
    { f: len, x: 820, y: 540, zoom: 1.12 },
  ]);
  return (
    <Stage theme={V.theme} cam={cam} vignette={0.3} grain={0.5}>
      <Layer depth={1}>
        <VoidRoom f={f + 40} seed={3}>
          <CoreBall f={f + 30} cx={760} cy={540} r={420} id="c701" spin={0.7} />
          <Probe x={px} y={520} size={170} f={f} tilt={-90} />
        </VoidRoom>
      </Layer>
      <Layer depth={0}>
        <Kicker x={120} y={130} text="THE MIDDLE" color={V.text} size={30} />
        <L14Gauges family={V} frame={f} compact speed={MID_SPEED} heat={MID_HEAT} pressure={MID_PRESS} pull={{ value: 0.3 * (1 - k) }} />
      </Layer>
    </Stage>
  );
};

// ===============================================================================================================
// 7-02 · arrows from every side of the surrounding rock pull on the probe in opposite pairs and cancel in flashes.
// MOVER: arrow pairs growing out (14 px/f), one pair every 9 frames, each pair flashing as it completes.
// ===============================================================================================================
const ShotCancel: ShotFC<CL07> = ({ f }) => {
  const cx = 760;
  const cy = 540;
  return (
    <Pop f={f}>
      <Stage theme={V.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0.01, frames: 200, seed: 7 }} vignette={0.3} grain={0.5}>
        <Layer depth={1}>
          <VoidRoom f={f + 90} seed={5}>
            <CoreBall f={f + 60} cx={cx} cy={cy} r={470} id="c702" spin={0.4} />
            {Array.from({ length: 6 }, (_, i) => {
              const age = f < i * 9 ? -1 : (f - i * 9) % 96;
              if (age < 0) return null;
              const L = Math.min(260, age * 14);
              const a = ((i * 30 + 15) * Math.PI) / 180;
              const done = age * 14 >= 260;
              const fl = done ? clamp01(1 - (age - 260 / 14) / 12) : 0;
              const r0 = 70;
              return (
                <g key={i} opacity={done ? 0.55 + 0.45 * fl : 1}>
                  {[1, -1].map((s) => (
                    <Arrow key={s} x1={cx + s * Math.cos(a) * r0} y1={cy + s * Math.sin(a) * r0} x2={cx + s * Math.cos(a) * (r0 + L)} y2={cy + s * Math.sin(a) * (r0 + L)} color={i % 2 ? C.saffron : C.outerDeep} w={16} head={40} />
                  ))}
                  {fl > 0 ? <circle cx={cx} cy={cy} r={90 + (1 - fl) * 120} fill="none" stroke={CREAM} strokeWidth={10 * fl} opacity={fl} /> : null}
                </g>
              );
            })}
            <Probe x={cx} y={cy} size={110} f={f} tilt={-90} lamp={false} />
          </VoidRoom>
        </Layer>
        <Layer depth={0}>
          <Tag x={120} y={150} text="THE PULL CANCELS" F={V} dot={C.saffron} size={32} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-03 + 7-04 · the PULL rail, drawn big: the pointer falls to the floor (zero) and rebounds; rings pulse out from the
// floor stop; Tick walks in on the ledge and watches, surprised. MOVER: the pointer (≈ 12 px/f) + rebound, then rings
// expanding (6 px/f) + facet wedges + the push.
// ===============================================================================================================
const ShotPullZero: ShotFC<CL07> = ({ f, len, c }) => {
  const four = c.fourth - c.zero;
  const land = 24;
  const v = f < land ? 0.32 * (1 - f / land) : 0.08 * Math.abs(Math.sin((f - land) / 4)) * Math.exp(-(f - land) / 16);
  const v2 = f >= four ? 0.06 * Math.abs(Math.sin((f - four) / 3.5)) * Math.exp(-(f - four) / 12) : 0;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 520, zoom: 1.0 },
    { f: len, x: 900, y: 540, zoom: 1.14 },
  ]);
  const tk = ez(f, four - 6, four + 24);
  const GX = 520;
  const GY = 150;
  const SC = 2.3;
  return (
    <Pop f={f}>
      <Stage theme={V.theme} cam={cam} vignette={0.3} grain={0.5}>
        <Layer depth={0.5}>
          <VoidRoom f={f + 140} seed={9}>
            <CoreBall f={f + 120} cx={GX + 170 * SC} cy={GY + 102 * SC} r={560} id="c703" spin={0.6} />
          </VoidRoom>
        </Layer>
        <Layer depth={1}>
          <Rings f={f} cx={GX + 170 * SC} cy={GY + 102 * SC} start={land} every={22} speed={7} maxR={700} color={C.saffron} width={10} />
          <Ledge y={900} />
          <g transform={`translate(${GX} ${GY}) scale(${SC})`}>
            <rect x={-8} y={-8} width={356} height={221} rx={26} fill={alpha(INK, 0.9)} />
            <L14Gauges family={V} frame={f} x={0} y={-705} pull={{ value: v + v2 }} />
          </g>
          <Tick x={-120 + 420 * tk} y={900} pxPerM={130} frame={f} facing={1} pose="stand" walk={tk < 1 ? f / 18 : undefined} expression="surprised" look={0.6} headTilt={-8} />
        </Layer>
        <Layer depth={0}>
          <Tag x={120} y={150} text="THE PULL" F={V} dot={C.vermilion} size={32} />
          <Slab x={1460} y={330} value="0" unit="g" /* #20 */ size={150} F={V} opacity={ez(f, land - 4, land + 6)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-05 · KEY ART III. All four gauges: three pinned past their stops, PULL at the floor; the bright core behind, the
// probe small in it; Tick at the panel edge, staff raised, surprised. MOVER: the pull-back (edges ≈ 3 px/f) + the
// probe gliding (8 px/f) + facet wedges turning + embers.
// ===============================================================================================================
const ShotKey: ShotFC<CL07> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 560, zoom: 1.28 },
    { f: len, x: 960, y: 540, zoom: 1.0 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={V.theme} cam={cam} vignette={0.3} grain={0.5}>
        <Layer depth={0.6}>
          <VoidRoom f={f + 200} seed={11}>
            <CoreBall f={f + 200} cx={700} cy={500} r={400} id="c705" spin={0.8} />
          </VoidRoom>
        </Layer>
        <Layer depth={1}>
          <Probe x={420 + f * 8} y={470 + Math.sin(f / 14) * 10} size={120} f={f} tilt={-90} />
          <Ledge y={930} x0={1120} />
          <Tick x={1290} y={930} pxPerM={110} frame={f} facing={1} pose="point" staff expression="surprised" look={0.7} headTilt={-10} />
        </Layer>
        <Layer depth={0}>
          <Tag x={120} y={150} text="THREE UP · ONE DOWN" F={V} dot={C.saffron} size={32} />
          <L14Gauges family={V} frame={f} speed={MID_SPEED} heat={MID_HEAT} pressure={MID_PRESS} pull={MID_PULL} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-06 + 7-07 · the PULL needle punches through the floor of its dial and falls out at Tick's feet; Tick looks down.
// MOVER: the needle falling (to 18 px/f) and tumbling, then bouncing; facet wedges; the push.
// ===============================================================================================================
const ShotDrop: ShotFC<CL07> = ({ f, len, c }) => {
  const fl = c.floor - c.last;
  const t0 = Math.max(4, fl - 14);
  const g = f - t0;
  const LY = 880;
  let ny = 470;
  let rot = 0;
  if (g > 0) {
    const fall = Math.min(LY - 30 - 470, 0.5 * 0.9 * g * g);
    ny = 470 + fall;
    rot = g * 9;
    const tl = Math.sqrt((2 * (LY - 30 - 470)) / 0.9);
    if (g > tl) {
      const b = g - tl;
      ny = LY - 30 - Math.abs(Math.sin(b / 5)) * 60 * Math.exp(-b / 14);
      rot = tl * 9 + Math.sin(b / 4) * 25 * Math.exp(-b / 14);
    }
  }
  const look = ez(f, t0 + 6, t0 + 22);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 520, zoom: 1.0 },
    { f: len, x: 860, y: 600, zoom: 1.18 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={V.theme} cam={cam} vignette={0.3} grain={0.5}>
        <Layer depth={0.5}>
          <VoidRoom f={f + 260} seed={13}>
            <CoreBall f={f + 260} cx={1100} cy={420} r={520} id="c706" spin={0.6} />
          </VoidRoom>
        </Layer>
        <Layer depth={1}>
          <Ledge y={LY} />
          <g transform="translate(560 120) scale(1.7)">
            <rect x={-8} y={-8} width={356} height={221} rx={26} fill={alpha(INK, 0.9)} />
            <L14Gauges family={V} frame={f} x={0} y={-705} pull={{ value: 0 }} />
          </g>
          {/* the broken-off needle (a gauge needle: vermilion) */}
          <g transform={`translate(${860 + Math.min(1, Math.max(0, g) / 40) * 60} ${ny}) rotate(${rot})`}>
            <path d="M-90 -9 L80 -4 L96 0 L80 4 L-90 9 Z" fill={C.vermilion} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
            <circle cx={-90} cy={0} r={14} fill={INK} />
          </g>
          <Tick x={640} y={LY} pxPerM={150} frame={f} facing={1} pose="stand" expression="surprised" look={0.5} headTilt={-6 - 26 * look} />
        </Layer>
        <Layer depth={0}>
          <Motes frame={f} n={16} x={0} y={0} w={1500} h={1000} color={alpha(CREAM, 0.7)} seed={4} size={4} drift={30} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-08 · STUDIO_SET cabin cut-away: pencil, wrench and bolt drift and turn; the pennant streams loose; Tick holds a
// tether to the probe and the line goes slack. MOVER: the probe rocking + bobbing (≈ 2 px/f at its 560-px edges) +
// the floating tools + the tether swinging (30 px) + CycClouds.
// ===============================================================================================================
const ShotCabin: ShotFC<CL07> = ({ f }) => {
  const by = 460 + Math.sin(f / 16) * 22;
  const tilt = Math.sin(f / 26) * 7;
  const slack = ez(f, 4, 26);
  return (
    <Pop f={f}>
      <Stage theme={S.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0.015, frames: 220, seed: 9 }} vignette={0.16} grain={0.6}>
        <StudioRoom f={f + 400} seed={14} hud={<Tag x={120} y={150} text="NO WEIGHT" F={S} dot={C.teal} size={32} />}>
          <Tether from={[1196, 690]} to={[760 + 130, by + 10]} slack={0.15 + 0.85 * slack} f={f * 2.2} width={8} />
          <Probe x={760} y={by} size={560} f={f} variant="cabin" tilt={tilt} lamp={false} />
          <Tick x={1250} y={860} pxPerM={170} frame={f} facing={-1} pose="hold" expression="surprised" look={0.4} headTilt={8} />
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-09 · void: the probe still streaking at full speed past the inner core's facet lines. MOVER: streaks and facet
// lines streaming up at 24-30 px/f (camera follows the probe).
// ===============================================================================================================
const ShotStreak: ShotFC<CL07> = ({ f }) => (
  <Pop f={f}>
    <Stage theme={V.theme} shotFrame={f} drift={{ zoom: 1.04, panY: 0.01, frames: 200, seed: 4 }} vignette={0.3} grain={0.5}>
      <Layer depth={1}>
        <Sky family={V} />
        <Bloom x={720} y={560} r={900} color={C.outer} core={0} strength={0.5} />
        {Array.from({ length: 22 }, (_, i) => {
          const L = 1600;
          const sp = 24 * (0.8 + rnd(i * 7) * 0.5);
          const y = 1300 - ((rnd(i * 3 + 1) * L + f * sp) % L);
          const x = 60 + rnd(i * 11 + 2) * 1340;
          const len = 300 * (0.6 + rnd(i * 5) * 0.8);
          const facet = i % 3 === 0;
          return facet ? (
            <path key={i} d={`M${x} ${y} L${x + 120} ${y + len * 0.9} L${x + 60} ${y + len}`} stroke={C.inner} strokeWidth={6} fill="none" opacity={0.85} />
          ) : (
            <line key={i} x1={x} y1={y} x2={x} y2={y + len} stroke={i % 2 ? C.saffronCore : C.outer} strokeWidth={6 + rnd(i) * 8} strokeLinecap="round" opacity={0.8} />
          );
        })}
        <Probe x={720} y={460 + Math.sin(f / 3) * 3} size={240} f={f} />
      </Layer>
      <Layer depth={0}>
        <Slab x={1040} y={260} value="~8" unit="km/s" /* #2 */ size={120} F={V} />
        <Tag x={1040} y={360} text="STILL AT FULL SPEED" F={V} dot={C.saffron} size={30} />
      </Layer>
    </Stage>
  </Pop>
);

// ===============================================================================================================
// 7-10 + 7-11 · the two dials slide in (PULL at zero, SPEED at its peak); the slot streams past the probe; at "It
// coasts straight through" the centre crosshair passes the probe and a ring flashes. MOVER: the inner-core wall
// streaming (16 px/f) + the crosshair crossing (16 px/f) + the ring.
// ===============================================================================================================
const ShotCoast: ShotFC<CL07> = ({ f, c }) => {
  const cc = c.coasts - c.nostop + 26;
  const k = 0.4;
  const PY = 470;
  const D = 6371 - (PY - 540 + 16 * cc) / k;
  const yc = PY + 16 * (cc - f); // the centre's screen y (depth 6,371 km, #12)
  const slide = ez(f, 0, 14);
  const ring = f - cc;
  return (
    <Pop f={f}>
      <Stage theme={V.theme} shotFrame={f} drift={{ zoom: 1.05, frames: 240, seed: 12 }} vignette={0.3} grain={0.5}>
        <Layer depth={1}>
          <Sky family={V} />
          <StrataWall f={f} family={V} layers={L14_STRATA} depth={D} pxPerKm={k} scroll={f * 16} cx={600} gap={300} x0={-200} x1={1420} lamp={{ y: PY }} />
          {yc > -40 && yc < 1120 ? (
            <g>
              <line x1={300} y1={yc} x2={900} y2={yc} stroke={CREAM} strokeWidth={5} strokeDasharray="22 12" />
              <circle cx={600} cy={yc} r={36} fill="none" stroke={C.saffron} strokeWidth={6} />
              <line x1={600} y1={yc - 60} x2={600} y2={yc + 60} stroke={C.saffron} strokeWidth={5} />
            </g>
          ) : null}
          {ring > 0 && ring < 40 ? <circle cx={600} cy={PY} r={60 + ring * 16} fill="none" stroke={CREAM} strokeWidth={14 * (1 - ring / 40)} opacity={1 - ring / 40} /> : null}
          <Probe x={600} y={PY} size={160} f={f} />
        </Layer>
        <Layer depth={0}>
          <g transform={`translate(${((1 - slide) * 420).toFixed(1)} 0)`}>
            <L14Gauges family={V} frame={f} speed={{ ...MID_SPEED, readout: GAUGE.speedPeak /* #2 */ }} pull={MID_PULL} />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-12 · a speed-vs-position hill along the diameter (schematic, no axis numbers); its peak is the centre; a dot rides
// over it. MOVER: the curve's drawing head (16 px/f), then the dot riding (≈ 10 px/f).
// ===============================================================================================================
const X0 = 180;
const X1 = 1340;
const AY = 800;
const hillY = (u: number) => AY - 480 * Math.sin(Math.PI * clamp01(u));
const ShotHill: ShotFC<CL07> = ({ f }) => {
  const head = Math.min(1, (f * 16) / (X1 - X0));
  const pts = Array.from({ length: 61 }, (_, i) => (i / 60) * head);
  const d = pts.map((u, i) => `${i ? "L" : "M"}${(X0 + (X1 - X0) * u).toFixed(1)} ${hillY(u).toFixed(1)}`).join(" ");
  const ride = f > 70 ? 0.5 - 0.5 * Math.cos(((f - 70) / 110) * Math.PI) : 0;
  const ud = f > 70 ? ride : head;
  const segs = L14_STRATA.filter((s) => s.to > 0).map((s) => ({ a: Math.max(0, s.from) / 12742, b: Math.min(12742, s.to) / 12742, c: s.color }));
  return (
    <Pop f={f}>
      <Stage theme={V.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.01, frames: 260, seed: 15 }} vignette={0.3} grain={0.5}>
        <Layer depth={1}>
          <Sky family={V} />
          <Stars frame={f} n={70} w={1920} h={1080} color={V.text} seed={17} size={2.2} twinkle={0.7} />
          {segs.map((s, i) => (
            <rect key={i} x={X0 + (X1 - X0) * s.a} y={AY + 14} width={Math.max(6, (X1 - X0) * (s.b - s.a))} height={44} fill={s.c} />
          ))}
          <line x1={(X0 + X1) / 2} y1={AY + 70} x2={(X0 + X1) / 2} y2={hillY(0.5) - 30} stroke={alpha(CREAM, 0.6)} strokeWidth={4} strokeDasharray="10 10" />
          <path d={`${d} L${X0 + (X1 - X0) * head} ${AY} L${X0} ${AY} Z`} fill={alpha(C.saffron, 0.22)} />
          <path d={d} stroke={C.saffron} strokeWidth={12} fill="none" strokeLinecap="round" />
          <line x1={X0} y1={AY} x2={X1} y2={AY} stroke={CREAM} strokeWidth={6} />
          <circle cx={X0 + (X1 - X0) * ud} cy={hillY(ud)} r={24} fill={C.probe} stroke={CREAM} strokeWidth={6} />
        </Layer>
        <Layer depth={0}>
          <Slab x={1000} y={200} value="~8" unit="km/s" /* #2 */ size={110} F={V} opacity={ez(f, 30, 44)} />
          <Tag x={1000} y={290} text="FASTEST HERE" F={V} dot={C.saffron} size={30} opacity={ez(f, 30, 44)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-13 · a satellite circles the planet at the surface; the probe in the tunnel tracks its shadow exactly (same period
// and the same peak speed: #2 + Verification log). MOVER: the satellite orbiting (≈ 12 px/f) + the probe dot.
// ===============================================================================================================
const ShotOrbit: ShotFC<CL07> = ({ f }) => {
  const cx = 720;
  const cy = 540;
  const R = 300;
  const OR = R * 1.08;
  const phi = -60 + f * 2.2;
  const pr = (phi * Math.PI) / 180;
  const sx = cx + Math.cos(pr) * OR;
  const sy = cy + Math.sin(pr) * OR;
  const u = Math.sin(pr);
  return (
    <Stage theme={V.theme} shotFrame={f} drift={{ zoom: 1.05, frames: 220, seed: 18 }} vignette={0.3} grain={0.5}>
      <Layer depth={1}>
        <Sky family={V} />
        <Stars frame={f} n={90} w={1920} h={1080} color={V.text} seed={19} size={2.2} twinkle={0.7} />
        <circle cx={cx} cy={cy} r={OR} fill="none" stroke={alpha(CREAM, 0.45)} strokeWidth={4} strokeDasharray="14 12" />
        <CutGlobe cx={cx} cy={cy} R={R} f={f} family={V} probe={u} line={{ from: -1, to: 1 }} />
        <line x1={sx} y1={sy} x2={cx} y2={cy + u * R} stroke={C.saffron} strokeWidth={4} strokeDasharray="8 10" />
        <g transform={`translate(${sx} ${sy}) rotate(${phi + 90})`}>
          <rect x={-60} y={-10} width={40} height={20} fill={C.frost} stroke={INK} strokeWidth={3} />
          <rect x={20} y={-10} width={40} height={20} fill={C.frost} stroke={INK} strokeWidth={3} />
          <rect x={-20} y={-18} width={40} height={36} rx={6} fill={C.saffron} stroke={INK} strokeWidth={4} />
        </g>
      </Layer>
      <Layer depth={0}>
        <Tag x={1120} y={200} text="AS FAST AS AN ORBIT" F={V} dot={C.saffron} size={32} />
      </Layer>
    </Stage>
  );
};

// ===============================================================================================================
// 7-14 · the probe passes the centre's crosshair; every pull arrow flips from forward to back. MOVER: the probe
// (10 px/f) + the arrows swinging 18°/f + facet wedges.
// ===============================================================================================================
const ShotFlip: ShotFC<CL07> = ({ f }) => {
  const cx = 720;
  const py = 260 + f * 10;
  const passed = py > 540;
  const ft = passed ? clamp01((py - 540) / 100) : 0; // 10 frames: 18°/f
  return (
    <Pop f={f}>
      <Stage theme={V.theme} shotFrame={f} drift={{ zoom: 1.05, frames: 200, seed: 21 }} vignette={0.3} grain={0.5}>
        <Layer depth={1}>
          <VoidRoom f={f + 330} seed={23}>
            <CoreBall f={f + 330} cx={cx} cy={540} r={500} id="c714" spin={0.5} />
            <line x1={cx - 560} y1={540} x2={cx + 560} y2={540} stroke={INK} strokeWidth={5} strokeDasharray="20 12" />
            <line x1={cx} y1={0} x2={cx} y2={1080} stroke={alpha(INK, 0.6)} strokeWidth={4} strokeDasharray="20 12" />
            <circle cx={cx} cy={540} r={40} fill="none" stroke={INK} strokeWidth={6} />
            {[-1, 1].map((s, i) => {
              const th = ((90 - s * 180 * smoothK(ft)) * Math.PI) / 180;
              const bx = cx + s * 130;
              return <Arrow key={i} x1={bx} y1={py} x2={bx + Math.cos(th) * 170} y2={py + Math.sin(th) * 170} color={C.saffron} w={18} head={46} />;
            })}
            <Probe x={cx} y={py} size={150} f={f} />
          </VoidRoom>
        </Layer>
        <Layer depth={0}>
          <Tag x={1100} y={200} text="NOW EVERYTHING PULLS BACK" F={V} dot={C.saffron} size={30} opacity={ez(f, 20, 32)} />
        </Layer>
      </Stage>
    </Pop>
  );
};
const smoothK = (t: number) => t * t * (3 - 2 * t);

// ===============================================================================================================
// 7-15 · the camera pulls out; the half of the planet the probe has left shades in behind it, and the pull points
// back. MOVER: the shading wipe (18 px/f) + the pull-back + the probe dot.
// ===============================================================================================================
const ShotBehind: ShotFC<CL07> = ({ f, len }) => {
  const cx = 960;
  const cy = 540;
  const R = 400;
  const u = 0.06 + 0.22 * ez(f, 0, len);
  const py = cy + u * R;
  const h = Math.min(R + (py - cy), f * 18);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 600, zoom: 1.6 },
    { f: len, x: 960, y: 540, zoom: 1.0 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={V.theme} cam={cam} vignette={0.3} grain={0.5}>
        <Layer depth={1}>
          <Sky family={V} />
          <Stars frame={f} n={90} w={1920} h={1080} color={V.text} seed={25} size={2.2} twinkle={0.7} />
          <CutGlobe cx={cx} cy={cy} R={R} f={f} family={V} probe={u} rot={f * 0.8} />
          <clipPath id="b715">
            <circle cx={cx} cy={cy} r={R} />
          </clipPath>
          <g clipPath="url(#b715)">
            <rect x={cx - R} y={py - h} width={2 * R} height={h} fill={C.saffron} opacity={0.45} />
            <line x1={cx - R} y1={py - h} x2={cx + R} y2={py - h} stroke={CREAM} strokeWidth={8} />
          </g>
          <Arrow x1={cx + 60} y1={py} x2={cx + 60} y2={py - 190} color={CREAM} w={16} head={42} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-16 · the replay in reverse: nose up now, the strata stream away and slow (24 → 8 px/f), the inner-core seam passes,
// the SPEED needle falls back from its stop. MOVER: the strata (24 → 8 px/f) + the seam crossing + the needle.
// ===============================================================================================================
const ShotReverse: ShotFC<CL07> = ({ f, len }) => {
  const L = Math.max(1, len);
  const s = 24 * f - (8 * f * f) / L;
  const k = 0.6;
  const D = 7621 - (900 - 540) / k; // 6,371 + 1,250 km: the inner core's far edge (#12, #15)
  return (
    <Pop f={f}>
      <Stage theme={V.theme} shotFrame={f} drift={{ zoom: 1.04, frames: 200, seed: 27 }} vignette={0.3} grain={0.5}>
        <Layer depth={1}>
          <Sky family={V} />
          <g transform="translate(0 1080) scale(1 -1)">
            <StrataWall f={f} family={V} layers={L14_STRATA} depth={D} pxPerKm={k} scroll={s} cx={640} gap={300} x0={-200} x1={1440} />
          </g>
          <Probe x={640} y={600} size={170} f={f} tilt={180} />
        </Layer>
        <Layer depth={0}>
          <L14Gauges family={V} frame={f} speed={{ value: 1 - 0.45 * ez(f, 0, L) }} />
          <Tag x={120} y={150} text="AS IF RUN BACKWARDS" F={V} dot={C.saffron} size={30} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-17 · STUDIO_SET: Tick cranks an old film reel backward; the strip of the first half (strata frames, the probe in
// each) runs in reverse. MOVER: the film strip running (20 px/f) + the reel and crank turning.
// ===============================================================================================================
const STRIP_COLS = [C.crust, C.mantle, C.mantleDeep, C.outer, C.inner];
const ShotReel: ShotFC<CL07> = ({ f }) => {
  const RX = 560;
  const RY = 430;
  const rr = 170;
  const a = (-f * 6 * Math.PI) / 180;
  const off = (f * 20) % 200;
  return (
    <Stage theme={S.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.01, frames: 200, seed: 29 }} vignette={0.16} grain={0.6}>
      <StudioRoom f={f + 600} seed={18}>
        <rect x={RX} y={RY + 70} width={1500} height={190} fill={INK} />
        {Array.from({ length: 10 }, (_, i) => {
          const x = RX - 200 + i * 200 + off;
          const idx = (((Math.floor((f * 20) / 200) - i) % 5) + 5) % 5;
          return (
            <g key={i}>
              <rect x={x + 16} y={RY + 92} width={168} height={146} rx={10} fill={STRIP_COLS[idx]} />
              <rect x={x + 16} y={RY + 92 + 50} width={168} height={8} fill={alpha(INK, 0.35)} />
              <circle cx={x + 100} cy={RY + 120 + idx * 18} r={14} fill={C.probe} stroke={CREAM} strokeWidth={4} />
              {[0, 1, 2, 3].map((j) => (
                <rect key={j} x={x + 22 + j * 44} y={RY + 76} width={22} height={10} rx={3} fill={CREAM} />
              ))}
            </g>
          );
        })}
        <FilmReel x={RX} y={RY} r={rr} f={f} rpm={6} strip={1} reverse />
        <line x1={RX} y1={RY} x2={RX + Math.cos(a) * 130} y2={RY + Math.sin(a) * 130} stroke={INK} strokeWidth={16} strokeLinecap="round" />
        <circle cx={RX + Math.cos(a) * 130} cy={RY + Math.sin(a) * 130} r={18} fill={C.vermilion} />
        <Tick x={300} y={860} pxPerM={170} frame={f} facing={1} pose="press" expression="happy" look={0.6} headTilt={Math.sin(f / 6) * 6} />
      </StudioRoom>
    </Stage>
  );
};

// ===============================================================================================================

export const SceneL07: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL07(t);
  const shots: ShotDef<CL07>[] = [
    { from: 0, S: ShotArrive, id: "7-01" },
    { from: c.cancel, S: ShotCancel, id: "7-02" },
    { from: c.zero, S: ShotPullZero, id: "7-03" }, // + 7-04
    { from: c.three, S: ShotKey, id: "7-05" },
    { from: c.last, S: ShotDrop, id: "7-06" }, // + 7-07
    { from: c.cabin, S: ShotCabin, id: "7-08" },
    { from: c.racing, S: ShotStreak, id: "7-09" },
    { from: c.nostop, S: ShotCoast, id: "7-10" }, // + 7-11
    { from: c.hill, S: ShotHill, id: "7-12" },
    { from: c.orbit, S: ShotOrbit, id: "7-13" },
    { from: c.passes, S: ShotFlip, id: "7-14" },
    { from: c.behind, S: ShotBehind, id: "7-15" },
    { from: c.reverse, S: ShotReverse, id: "7-16" },
    { from: c.reel, S: ShotReel, id: "7-17" },
  ];
  return playShots(f, shots, c, t.frames);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL07 = (t: SceneTiming): Cue[] => {
  const c = cuesL07(t);
  return [
    { at: 4, file: SFX.chime, vol: 0.22, dur: 70 },
    ...cutHit(c.cancel),
    ...Array.from({ length: 6 }, (_, i) => ({ at: c.cancel + 18 + i * 9, file: SFX.click, vol: 0.08, dur: 8 })),
    ...cutHit(c.zero),
    ...Array.from({ length: 5 }, (_, i) => ({ at: c.zero + i * 5, file: SFX.click, vol: 0.06, dur: 6 })),
    { at: c.zero + 24, file: SFX.chime, vol: 0.2, dur: 60 },
    { at: c.fourth, file: SFX.popLong, vol: 0.22, dur: 30 },
    ...cutHit(c.three),
    ...Array.from({ length: 3 }, (_, i) => ({ at: c.three + 6 + i * 8, file: SFX.click, vol: 0.1, dur: 8 })),
    ...cutHit(c.last),
    { at: c.floor, file: SFX.pop, vol: 0.22, dur: 16 },
    { at: c.floor + 18, file: SFX.click, vol: 0.12, dur: 8 },
    ...cutHit(c.cabin),
    { at: c.cabin + 4, file: SFX.swirl, vol: 0.18, dur: 50 },
    ...cutHit(c.racing),
    { at: c.racing + 2, file: SFX.whoosh, vol: 0.24, dur: 40 },
    ...cutHit(c.nostop),
    { at: c.nostop + 4, file: SFX.click, vol: 0.12, dur: 8 },
    { at: c.coasts + 26, file: SFX.popLong, vol: 0.22, dur: 30 },
    ...cutHit(c.hill),
    ...Array.from({ length: 6 }, (_, i) => ({ at: c.hill + 4 + i * 10, file: SFX.click, vol: 0.06, dur: 8 })),
    ...cutHit(c.orbit),
    { at: c.orbit + 2, file: SFX.whoosh, vol: 0.2, dur: 40 },
    ...cutHit(c.passes),
    { at: c.passes + 28, file: SFX.popLong, vol: 0.22, dur: 30 },
    ...cutHit(c.behind),
    { at: c.behind + 2, file: SFX.swirl, vol: 0.18, dur: 50 },
    ...cutHit(c.reverse),
    { at: c.reverse + 4, file: SFX.swirl, vol: 0.16, dur: 50 },
    ...cutHit(c.reel),
    ...Array.from({ length: 6 }, (_, i) => ({ at: c.reel + 4 + i * 10, file: SFX.click, vol: 0.06, dur: 8 })),
  ];
};
