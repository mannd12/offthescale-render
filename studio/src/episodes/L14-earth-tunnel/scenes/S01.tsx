// L14 scene l01 "The famous forty-two" (storyboard §3 "1 ·": shots 1-01…1-25, script lines 3-10, STUDIO_SET, Act I).
// Shot components (hard cuts; continuous rows are phases): 1-01+1-02 (spring and empty ball; chips pour in) · 1-03…1-05
// (Tick draws the circle through the probe's dot, the shell shades, the dot sinks, the probe slides onto the spring) ·
// 1-06+1-07 (dot shuttling in step with the spring; "the trick": arrow pairs round the probe) · 1-08 (the pulls cancel:
// arrows fly in and burst) · 1-09…1-13 (the shell ghosts away; Tick waves it off; the pull-vs-depth line to zero; the
// PULL dial falls; ring flash) · 1-14 (there and back: 84 MIN) · 1-15+1-16 (the satellite; two clocks lock at 84) ·
// 1-17+1-18 (half: 42 MIN; the stopwatch 42:12) · 1-19+1-20 (same density, any size; the probe races down, SPEED to 8)
// · 1-21 (28,800 km/h) · 1-22 (over 20× the speed of sound) · 1-23 (the SPEED needle at its stop) · 1-24+1-25 (Tick
// pats the tidy ball; it cracks into the true layers: MORPH → l02's 2-01).
// Numbers drawn, each with its sources.md row: 84 MIN · 84 · 84 (#2) · 42 MIN · 42:12 (#1 #2) · 8 km/s (#2, the SPEED
// readout from the GAUGE table) · 28,800 km/h (#13) · OVER 20× (#13 #18: 8,000 / 340 = 23.5). No PULL stop label here
// (the "1.09 g" stop only from l02 line 2). Pull cancelling = shell theorem (#20, V5 cleared). F3: "SAME DENSITY".
import React from "react";
import { useCurrentFrame } from "remotion";
import {
  Bloom,
  Counter,
  GroundShadow,
  IF2,
  Kicker,
  Layer,
  Metric,
  Stage,
  Streamers,
  Tick,
  alpha,
  cameraAt,
  impact,
  mixHex,
  ramp,
  rnd,
  walkPhase,
} from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { GAUGE, L14Gauges, STOP, pullValue } from "../L14Gauges";
import { ClockFace, Probe, SpringWeight } from "../props";
import { oscillate } from "../cutglobe";
import { R_CORE, R_EARTH, R_INNER } from "../families";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { Arrow, C, CREAM, ClockText, INK, Pop, STUDIO, StudioRoom, Tag, clamp01, ez } from "./Cold";

const S = STUDIO;
const FLOOR = 860;

export const cuesL01 = (t: SceneTiming) => {
  const { at, p, frac, end } = cueKit(t);
  return {
    spring: 0, // 1-01
    pour: p(0, "Make the Earth"), // 1-02 (phase)
    draw: p(0, "Then only the rock"), // 1-03
    sink: p(0, "and that pull fades"), // 1-04 (phase)
    hook: at(1), // 1-05 (phase)
    split: frac(1, 0.62), // 1-06
    trick: at(2), // 1-07 (phase)
    inward: p(2, "pulls in every direction"), // 1-08
    cancel: p(2, "and the pulls cancel"),
    below: p(2, "Only what is below"), // 1-09
    wave: end(2, -8), // 1-10 (phase)
    chart: at(3), // 1-11 (phase)
    nothing: p(3, "all the way to nothing"), // 1-13 (phase)
    swing: at(4), // 1-14
    sat: p(4, "Exactly the time"), // 1-15
    round: p(4, "to go once round"), // 1-16 (phase)
    half: at(5), // 1-17
    exact: p(5, "or forty-two and twelve"), // 1-18 (phase)
    size: p(5, "Same density"), // 1-19
    race: at(6), // 1-20 (phase)
    kmh: p(6, "That's about twenty-eight"), // 1-21
    sound: p(6, "More than twenty times"), // 1-22
    stop: p(6, "The first gauge"), // 1-23
    tidy: at(7), // 1-24
    crack: p(7, "version of the trip"), // 1-25 (phase)
    end: t.frames,
  };
};
export type CL01 = ReturnType<typeof cuesL01>;

// ---------------------------------------------------------------------------------------------------------------
// the uniform ball: ochre rock, a rotating radial hatch (the mover that never stops), a key light from upper left.
// `fill` 0..1 = how full of rock (1-02); `bands` 0..1 = the true layers growing outward from the centre (1-25).
// ---------------------------------------------------------------------------------------------------------------
const Ball: React.FC<{ cx: number; cy: number; r: number; f: number; fill?: number; bands?: number; spin?: number; shade?: number; shadeR?: number; id: string }> = ({ cx, cy, r, f, fill = 1, bands = 0, spin = 0.6, shade = 0, shadeR = 0, id }) => {
  const fy = cy + r - 2 * r * clamp01(fill);
  const rot = f * spin;
  const grow = (k: number, d: number) => Math.max(0, Math.min(1, bands * 1.6 - d)) * k * r;
  return (
    <g>
      <GroundShadow x={cx + r * 0.1} y={FLOOR + 30} rx={r * 0.9} color={S.shadow} opacity={0.35} blur={16} />
      <clipPath id={`${id}c`}>
        <circle cx={cx} cy={cy} r={r} />
      </clipPath>
      <circle cx={cx} cy={cy} r={r + 10} fill={alpha(INK, 0.9)} />
      <circle cx={cx} cy={cy} r={r} fill={mixHex(INK, S.sky[0], 0.4)} />
      <g clipPath={`url(#${id}c)`}>
        <rect x={cx - r} y={fy} width={2 * r} height={2 * r} fill={C.crust} />
        {Array.from({ length: 14 }, (_, i) => {
          const a = ((rot + i * (360 / 14)) * Math.PI) / 180;
          return <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(a) * r} y2={cy + Math.sin(a) * r} stroke={C.crustDeep} strokeWidth={10} opacity={fy < cy + r - 4 ? 0.55 : 0} />;
        })}
        {[0.3, 0.55, 0.8].map((k) => (
          <circle key={k} cx={cx} cy={cy} r={r * k} fill="none" stroke={mixHex(C.crust, "#FFE0B0", 0.35)} strokeWidth={5} opacity={0.5} />
        ))}
        {bands > 0 ? (
          <g>
            <circle cx={cx} cy={cy} r={grow(0.99, 0)} fill={C.mantle} />
            <circle cx={cx} cy={cy} r={grow(R_CORE / R_EARTH, 0.15)} fill={C.outer} />
            <circle cx={cx} cy={cy} r={grow(R_INNER / R_EARTH, 0.3)} fill={C.inner} />
            {Array.from({ length: 10 }, (_, i) => {
              const a = ((i * 36 + rot * 1.5) * Math.PI) / 180;
              const L = r * Math.min(1, bands * 2);
              return <path key={i} d={`M${cx} ${cy} l ${Math.cos(a) * L * 0.4} ${Math.sin(a) * L * 0.4} l ${Math.cos(a + 0.2) * L * 0.3} ${Math.sin(a + 0.2) * L * 0.3} l ${Math.cos(a - 0.15) * L * 0.3} ${Math.sin(a - 0.15) * L * 0.3}`} stroke={INK} strokeWidth={6} fill="none" opacity={Math.min(1, bands * 3) * (1 - bands)} />;
            })}
          </g>
        ) : null}
        {fill < 1 ? <rect x={cx - r} y={fy - 6} width={2 * r} height={12} fill={mixHex(C.crust, "#FFE6B8", 0.5)} /> : null}
        {shade > 0 ? (
          <path
            d={`M${cx} ${cy - r} A${r} ${r} 0 ${shade > 0.5 ? 1 : 0} 1 ${cx + Math.sin(shade * 2 * Math.PI) * r} ${cy - Math.cos(shade * 2 * Math.PI) * r} L${cx + Math.sin(shade * 2 * Math.PI) * shadeR} ${cy - Math.cos(shade * 2 * Math.PI) * shadeR} A${shadeR} ${shadeR} 0 ${shade > 0.5 ? 1 : 0} 0 ${cx} ${cy - shadeR} Z`}
            fill={alpha(S.shadow, 0.55)}
          />
        ) : null}
        <ellipse cx={cx - r * 0.35} cy={cy - r * 0.4} rx={r * 0.5} ry={r * 0.3} fill="#FFFFFF" opacity={0.12} />
      </g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={CREAM} strokeWidth={5} opacity={0.6} />
    </g>
  );
};

/** The probe's dot on the ball (teal with a gold ring). */
const Dot: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 22 }) => (
  <g>
    <circle cx={x} cy={y} r={r + 8} fill={C.saffronCore} opacity={0.5} />
    <circle cx={x} cy={y} r={r} fill={C.teal} stroke={INK} strokeWidth={5} />
  </g>
);

/** A gantry bar the spring hangs from. */
const Gantry: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <rect x={x - 6} y={y - 10} width={12} height={FLOOR - y + 10} fill={INK} opacity={0.85} />
    <rect x={x - 6} y={y - 16} width={150} height={14} rx={6} fill={INK} />
    <rect x={x - 60} y={FLOOR - 6} width={120} height={14} rx={6} fill={INK} />
  </g>
);

// ===============================================================================================================
// 1-01 + 1-02 · the spring with the weight bobbing beside an empty ball; the ghost probe swings through it in step;
// Tick walks in and pats it. Then chips pour in and fill it from the bottom. MOVER: the weight (±140 px, 66 f, up to
// 13 px/f) + the ghost probe swinging; then the chips falling and the fill line rising (12 px/f).
// ===============================================================================================================
const ShotSpring: ShotFC<CL01> = ({ f, len, c }) => {
  const pour = c.pour - c.spring;
  const ph = (f / 66) * Math.PI * 2;
  const bob = Math.sin(ph);
  const B = { cx: 1000, cy: 500, r: 300 };
  const fillK = clamp01(((f - pour) * 12) / (2 * B.r));
  const walkEnd = 70;
  const tx = 1560 - 300 * ez(f, 0, walkEnd);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: pour, x: 960, y: 540, zoom: 1.04 },
    { f: len + 20, x: 1000, y: 520, zoom: 1.2 },
  ]);
  return (
    <Stage theme={S.theme} cam={cam} vignette={0.12} grain={0.5}>
      <StudioRoom
        f={f}
        hud={
          <g>
            <Kicker x={120} y={130} text="THE TEXTBOOK VERSION" color={INK} size={28} />
            <Tag x={120} y={980} text="SAME ROCK ALL THE WAY" F={S} dot={C.crust} size={30} opacity={ez(f, pour + 8, pour + 20)} />
          </g>
        }
      >
        <Gantry x={380} y={150} />
        <SpringWeight x={470} y={150} stretch={300 + bob * 140} probe f={f} weight={90} />
        <Ball cx={B.cx} cy={B.cy} r={B.r} f={f} fill={f < pour ? 0 : fillK} id="b101" />
        {/* the ghost probe swinging through the ball in step with the weight */}
        <g opacity={f < pour ? 0.7 : 0.7 * (1 - ez(f, pour, pour + 20))}>
          <Probe x={B.cx} y={B.cy + bob * (B.r - 60)} size={90} f={f} lamp={false} />
        </g>
        {/* chips pouring from a chute above */}
        {f >= pour - 4
          ? Array.from({ length: 26 }, (_, i) => {
              const life = 40;
              const t0 = (f - pour + i * (life / 26) + 4) % life;
              const y = 20 + t0 * 18;
              const yMax = B.cy + B.r - 2 * B.r * fillK;
              if (y > yMax || fillK >= 1) return null;
              const x = B.cx - 40 + rnd(i) * 80 + Math.sin(i + f / 5) * 8;
              const s = 14 + rnd(i * 3) * 14;
              return <path key={i} d={`M${x} ${y} l ${s} ${s * 0.4} l ${-s * 0.3} ${s} l ${-s * 0.8} ${-s * 0.3} Z`} fill={i % 3 ? C.crust : C.crustDeep} stroke={INK} strokeWidth={2.5} transform={`rotate(${f * 9 + i * 40} ${x} ${y})`} />;
            })
          : null}
        <GroundShadow x={tx} y={FLOOR + 3} rx={60} color={S.shadow} opacity={0.35} blur={8} />
        <Tick x={tx} y={FLOOR} pxPerM={140} frame={f} facing={-1} walk={f < walkEnd ? walkPhase(f, 16) : undefined} pose={f < walkEnd ? "stand" : "hold"} expression="happy" look={0.4} squash={impact(f, walkEnd + 6, 0.08, 8)} />
      </StudioRoom>
    </Stage>
  );
};

// ===============================================================================================================
// 1-03 + 1-04 + 1-05 · Tick draws a circle through the probe's dot, then shades the outer shell; the dot sinks, the
// circle shrinks, arrows from the inner ball shorten; the camera pans to the spring and the probe slides onto it.
// MOVER: the circle's drawing head (30 px/f) + the shell wipe; then the dot sinking + shrinking circle; then the pan.
// ===============================================================================================================
const ShotDraw: ShotFC<CL01> = ({ f, len, c }) => {
  const sink = c.sink - c.draw;
  const hook = c.hook - c.draw;
  const B = { cx: 820, cy: 520, r: 330 };
  const r0 = 250;
  const rr = r0 - 190 * ez(f, sink, hook);
  const dx = B.cx;
  const dy = B.cy - rr;
  const drawK = clamp01((f * 30) / (2 * Math.PI * r0));
  const shadeK = ez(f, sink * 0.55, sink * 0.95);
  const SP = { x: 1480, y: 170 };
  const slide = ez(f, hook + 4, hook + 22);
  const bob = f > hook + 22 ? Math.sin(((f - hook - 22) / 40) * Math.PI * 2) * 90 * Math.exp(-(f - hook - 22) / 120) : 0;
  const stretch = 220 + 80 * slide + bob;
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 540, zoom: 1.0 },
    { f: sink, x: 860, y: 520, zoom: 1.08 },
    { f: hook, x: 840, y: 500, zoom: 1.2 },
    { f: hook + 26, x: 1240, y: 540, zoom: 1.06 },
    { f: len + 30, x: 1260, y: 540, zoom: 1.12 },
  ]);
  const arc = (k: number, r: number) => {
    const e = -90 + Math.min(359.9, k * 360);
    return `M${B.cx} ${B.cy - r} A${r} ${r} 0 ${k > 0.5 ? 1 : 0} 1 ${(B.cx + Math.cos((e * Math.PI) / 180) * r).toFixed(1)} ${(B.cy + Math.sin((e * Math.PI) / 180) * r).toFixed(1)}`;
  };
  const head = (() => {
    const e = ((-90 + drawK * 360) * Math.PI) / 180;
    return [B.cx + Math.cos(e) * rr, B.cy + Math.sin(e) * rr];
  })();
  const probeX = dx + (SP.x - dx) * slide;
  const probeY = dy + (SP.y + stretch + 50 - dy) * slide;
  return (
    <Pop f={f}>
      <Stage theme={S.theme} cam={cam} vignette={0.12} grain={0.5}>
        <StudioRoom
          f={f + 200}
          seed={6}
          hud={
            <g>
              <Tag x={120} y={980} text="PULL FADES WITH DEPTH" F={S} dot={C.teal} size={30} opacity={ez(f, sink, sink + 12) * (1 - ez(f, hook, hook + 10))} />
              <Tag x={120} y={980} text="A WEIGHT ON A SPRING" F={S} dot={C.saffron} size={30} opacity={ez(f, hook + 10, hook + 22)} />
            </g>
          }
        >
          <Ball cx={B.cx} cy={B.cy} r={B.r} f={f} id="b103" shade={shadeK} shadeR={rr} />
          <path d={arc(drawK, rr)} stroke={CREAM} strokeWidth={9} strokeDasharray="22 14" fill="none" />
          {drawK < 1 ? <circle cx={head[0]} cy={head[1]} r={14} fill={C.saffron} stroke={INK} strokeWidth={4} /> : null}
          {/* the inner ball's pull: arrows from the dot toward the centre, shortening as it sinks */}
          {f > sink - 10 && slide < 0.5
            ? [-1, 0, 1].map((k) => <Arrow key={k} x1={dx + k * 36} y1={dy + 30} x2={dx + k * 14} y2={dy + 30 + rr * 0.55} color={C.teal} w={10} head={30} />)
            : null}
          <Gantry x={SP.x - 90} y={SP.y} />
          <SpringWeight x={SP.x} y={SP.y} stretch={stretch} f={f} weight={1} color={C.saffron} />
          {slide < 0.05 ? <Dot x={dx} y={dy} /> : <Probe x={probeX} y={probeY} size={100} f={f} lamp={false} />}
          <GroundShadow x={330} y={FLOOR + 3} rx={60} color={S.shadow} opacity={0.35} blur={8} />
          <Tick x={330} y={FLOOR} pxPerM={140} frame={f} facing={1} pose={f < sink ? "press" : "point"} staff expression="determined" look={0.6} />
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 1-06 + 1-07 · the ball with the dot shuttling along its diameter in step with the spring beside it; then "the
// trick": the spring slides away, the dot stops, Tick points at the shaded shell, arrow pairs rotate round the probe.
// MOVER: the dot shuttling (±260 px) + the weight bobbing in step; then the arrow pairs rotating (2.5°/f).
// ===============================================================================================================
const ShotTrick: ShotFC<CL01> = ({ f, len, c }) => {
  const trick = c.trick - c.split;
  const B = { cx: 640, cy: 520, r: 320 };
  const period = 60;
  const ph = (f / period) * 2;
  const stopK = ez(f, trick, trick + 14);
  const u = oscillate(ph) * (1 - stopK) + -0.45 * stopK;
  const dy = B.cy + u * (B.r - 50);
  const springOut = ez(f, trick, trick + 16);
  const tickIn = ez(f, trick + 6, trick + 26);
  const rot = (f - trick) * 2.5;
  return (
    <Pop f={f}>
      <Stage theme={S.theme} shotFrame={f} drift={{ zoom: 1.08, panX: 0.03, panY: 0.01, frames: len + 60, seed: 3 }} vignette={0.12} grain={0.5}>
        <StudioRoom f={f + 400} seed={8} hud={<Tag x={120} y={980} text="THE TRICK" F={S} dot={C.saffron} size={32} opacity={ez(f, trick + 10, trick + 22)} />}>
          <Ball cx={B.cx} cy={B.cy} r={B.r} f={f} id="b106" shade={stopK} shadeR={Math.abs(dy - B.cy)} />
          <line x1={B.cx} y1={B.cy - B.r} x2={B.cx} y2={B.cy + B.r} stroke={CREAM} strokeWidth={4} strokeDasharray="14 12" opacity={0.7} />
          {stopK > 0
            ? [0, 1, 2].map((k) => {
                const a = ((rot + k * 60) * Math.PI) / 180;
                const L = 150 * stopK;
                return (
                  <g key={k}>
                    <Arrow x1={B.cx + Math.cos(a) * 30} y1={dy + Math.sin(a) * 30} x2={B.cx + Math.cos(a) * L} y2={dy + Math.sin(a) * L} color={C.saffron} w={11} head={30} />
                    <Arrow x1={B.cx - Math.cos(a) * 30} y1={dy - Math.sin(a) * 30} x2={B.cx - Math.cos(a) * L} y2={dy - Math.sin(a) * L} color={C.saffron} w={11} head={30} />
                  </g>
                );
              })
            : null}
          <Dot x={B.cx} y={dy} />
          <g transform={`translate(${springOut * 900} 0)`}>
            <Gantry x={1180} y={170} />
            <SpringWeight x={1270} y={170} stretch={330 + u * 200} probe f={f} weight={90} />
          </g>
          <g transform={`translate(${(1 - tickIn) * 700} 0)`}>
            <GroundShadow x={1200} y={FLOOR + 3} rx={60} color={S.shadow} opacity={0.35} blur={8} />
            <Tick x={1200} y={FLOOR} pxPerM={150} frame={f} facing={-1} pose="point" expression="proud" look={0.6} staff squash={impact(f, trick + 28, 0.08, 8)} />
          </g>
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 1-08 · "the pulls cancel": close on the probe; arrow pairs fly in from the shell, meet at the probe and burst.
// MOVER: arrow pairs closing (14 px/f) in waves + flash bursts + the push in.
// ===============================================================================================================
const ShotCancel: ShotFC<CL01> = ({ f, len }) => {
  const cx = 860;
  const cy = 540;
  return (
    <Pop f={f}>
      <Stage theme={S.theme} cam={{ x: 900, y: 540, zoom: 1.0 + 0.25 * ez(f, 0, len) }} vignette={0.15} grain={0.5}>
        <StudioRoom f={f + 600} seed={9}>
          <circle cx={cx} cy={cy} r={460} fill={alpha(C.crust, 0.9)} stroke={CREAM} strokeWidth={6} />
          <circle cx={cx} cy={cy} r={300} fill={alpha(S.shadow, 0.35)} />
          {Array.from({ length: 4 }, (_, w) => {
            const t0 = w * 22;
            const tau = f - t0;
            if (tau < 0 || tau > 30) return null;
            const d = 300 - tau * 14;
            const a = ((w * 47 + 20) * Math.PI) / 180;
            if (d < 50) {
              const k = (50 - d) / 120;
              return <circle key={w} cx={cx} cy={cy} r={60 + k * 300} fill="none" stroke={C.saffronCore} strokeWidth={14 * (1 - k)} opacity={1 - k} />;
            }
            return (
              <g key={w}>
                <Arrow x1={cx + Math.cos(a) * (d + 120)} y1={cy + Math.sin(a) * (d + 120)} x2={cx + Math.cos(a) * d} y2={cy + Math.sin(a) * d} color={C.saffron} w={14} head={36} />
                <Arrow x1={cx - Math.cos(a) * (d + 120)} y1={cy - Math.sin(a) * (d + 120)} x2={cx - Math.cos(a) * d} y2={cy - Math.sin(a) * d} color={C.saffron} w={14} head={36} />
              </g>
            );
          })}
          <Probe x={cx} y={cy - 20} size={120} f={f} lamp={false} />
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 1-09 … 1-13 · the shell ghosts away; Tick waves it off; a pull-vs-depth line draws from the top down to zero at the
// centre while the dot sinks; the PULL dial falls in step; at zero the end point pops and a ring flashes.
// MOVER: the rotating hatch + arrows pulsing; then the line's drawing head + the dot riding it + the PULL needle.
// ===============================================================================================================
const ShotLine: ShotFC<CL01> = ({ f, len, c }) => {
  const wave = c.wave - c.below;
  const chart = c.chart - c.below;
  const zero = c.nothing - c.below;
  const B = { cx: 470, cy: 520, r: 300 };
  const ghost = 1 - ez(f, 4, 24);
  const k = ez(f, chart, zero + 10);
  const rr = 240 * (1 - k);
  const dy = B.cy - rr;
  const A = { x: 960, y: 290 };
  const Z = { x: 1420, y: 800 };
  const hx = A.x + (Z.x - A.x) * k;
  const hy = A.y + (Z.y - A.y) * k;
  const pulse = 1 + 0.25 * Math.sin(f / 4);
  const chartIn = ez(f, chart - 16, chart);
  const zf = f - zero - 10;
  return (
    <Pop f={f}>
      <Stage theme={S.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0.02, panY: 0.01, frames: len + 60, seed: 4 }} vignette={0.12} grain={0.5}>
        <StudioRoom
          f={f + 800}
          seed={10}
          hud={
            <g>
              <Tag x={120} y={980} text="NOTHING LEFT" F={S} dot={C.saffron} size={32} opacity={ez(f, zero + 10, zero + 22)} />
              <L14Gauges family={S} frame={f} theme="dark" pull={{ value: pullValue(GAUGE.pullSurface) * (1 - k), appear: chartIn }} />
            </g>
          }
        >
          <Ball cx={B.cx} cy={B.cy} r={B.r} f={f} id="b109" shade={ghost} shadeR={rr} spin={0.9} />
          {(() => {
            const L = Math.max(40, rr * 0.7) * pulse;
            return f > 6 && rr > 8 ? [-1, 0, 1].map((q) => <Arrow key={q} x1={B.cx + q * 34} y1={dy + 28} x2={B.cx + q * 12} y2={dy + 28 + L * 0.6} color={C.teal} w={11} head={30} />) : null;
          })()}
          <Dot x={B.cx} y={dy} />
          {/* the chart: pull (up) vs depth (along), drawn from the surface down to zero at the centre */}
          <g opacity={chartIn}>
            <rect x={A.x - 50} y={A.y - 80} width={Z.x - A.x + 110} height={Z.y - A.y + 150} rx={24} fill={alpha(CREAM, 0.92)} />
            <line x1={A.x - 10} y1={A.y - 40} x2={A.x - 10} y2={Z.y + 20} stroke={INK} strokeWidth={5} />
            <line x1={A.x - 10} y1={Z.y + 20} x2={Z.x + 30} y2={Z.y + 20} stroke={INK} strokeWidth={5} />
            <text x={A.x} y={A.y - 44} style={{ fontFamily: IF2.label, fontSize: 24, letterSpacing: 2, fill: INK }}>
              PULL
            </text>
            <text x={Z.x + 20} y={Z.y + 58} textAnchor="end" style={{ fontFamily: IF2.label, fontSize: 24, letterSpacing: 2, fill: INK }}>
              CENTRE
            </text>
            <line x1={A.x} y1={A.y} x2={hx} y2={hy} stroke={C.vermilion} strokeWidth={12} strokeLinecap="round" />
            <circle cx={hx} cy={hy} r={18} fill={C.teal} stroke={INK} strokeWidth={5} />
            {zf > 0 ? <circle cx={Z.x} cy={Z.y} r={20 + zf * 10} fill="none" stroke={C.saffron} strokeWidth={Math.max(1, 14 - zf * 0.5)} opacity={Math.max(0, 1 - zf / 30)} /> : null}
          </g>
          {zf > 0 ? <circle cx={B.cx} cy={B.cy} r={20 + zf * 10} fill="none" stroke={C.saffronCore} strokeWidth={Math.max(1, 14 - zf * 0.5)} opacity={Math.max(0, 1 - zf / 30)} /> : null}
          <g transform={`translate(${(1 - ez(f, wave - 20, wave)) * 500 * (f < chart ? 1 : 0) + ez(f, chart, chart + 16) * -700} 0)`}>
            <GroundShadow x={880} y={FLOOR + 3} rx={60} color={S.shadow} opacity={0.35} blur={8} />
            <Tick x={880} y={FLOOR} pxPerM={150} frame={f} facing={-1} pose="wave" expression="determined" look={0.5} />
          </g>
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 1-14 · the dot swings top → centre → far side → back along the diameter; a clock beside it sweeps one turn; Tick
// clicks a stopwatch. 84 MIN (#2). MOVER: the dot swinging (±280 px) + the clock hand tip.
// ===============================================================================================================
const ShotSwing: ShotFC<CL01> = ({ f, len }) => {
  const B = { cx: 520, cy: 520, r: 320 };
  const k = ez(f, 4, len - 8);
  const u = oscillate(2 * k);
  return (
    <Pop f={f}>
      <Stage theme={S.theme} shotFrame={f} drift={{ zoom: 1.08, panX: 0.03, panY: 0.01, frames: len + 60, seed: 5 }} vignette={0.12} grain={0.5}>
        <StudioRoom
          f={f + 1000}
          seed={12}
          hud={
            <g>
              <rect x={990} y={738} width={370} height={140} rx={24} fill={alpha(INK, 0.72)} />
              <Counter x={1020} y={850} value={84 * k} max={84} digits={2} size={110} color={CREAM} unit="MIN" /* #2 */ />
              <Tag x={1000} y={950} text="THERE AND BACK" F={S} dot={C.saffron} size={30} />
            </g>
          }
        >
          <Ball cx={B.cx} cy={B.cy} r={B.r} f={f} id="b114" />
          <line x1={B.cx} y1={B.cy - B.r} x2={B.cx} y2={B.cy + B.r} stroke={CREAM} strokeWidth={4} strokeDasharray="14 12" opacity={0.7} />
          <Dot x={B.cx} y={B.cy + u * (B.r - 40)} />
          <ClockFace x={1180} y={410} r={200} minutes={60 * k} ring={k} family={S} f={f} />
          <GroundShadow x={1620} y={FLOOR + 3} rx={60} color={S.shadow} opacity={0.35} blur={8} />
          <Tick x={1620} y={FLOOR} pxPerM={150} frame={f} facing={-1} pose="hold" expression="determined" look={0.4} squash={impact(f, 6, 0.08, 8)} />
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 1-15 + 1-16 · a satellite skims the ball's surface in a ring of light; then two clocks count up and lock at 84.
// MOVER: the satellite orbiting (3°/f at r 360, ≈ 19 px/f) + its trail; then two Counters rolling and hands sweeping.
// ===============================================================================================================
const Satellite: React.FC<{ x: number; y: number; a: number }> = ({ x, y, a }) => (
  <g transform={`translate(${x} ${y}) rotate(${a})`}>
    <rect x={-60} y={-12} width={40} height={24} fill={C.frost} stroke={INK} strokeWidth={3} />
    <rect x={20} y={-12} width={40} height={24} fill={C.frost} stroke={INK} strokeWidth={3} />
    <rect x={-18} y={-18} width={36} height={36} rx={6} fill={C.saffron} stroke={INK} strokeWidth={4} />
  </g>
);
const ShotSatellite: ShotFC<CL01> = ({ f, len, c }) => {
  const lock = c.round - c.sat;
  const B = { cx: 600, cy: 520, r: 290 };
  const R = 360;
  const a = -90 + f * 3;
  const sx = B.cx + Math.cos((a * Math.PI) / 180) * R;
  const sy = B.cy + Math.sin((a * Math.PI) / 180) * R;
  const kk = ez(f, lock - 30, lock + 6);
  const pop = impact(f, lock + 8, 0.12, 10);
  return (
    <Pop f={f}>
      <Stage theme={S.theme} cam={{ x: 900 + f * 0.6, y: 540, zoom: 1.0 + f * 0.0012 }} vignette={0.12} grain={0.5}>
        <StudioRoom
          f={f + 1200}
          seed={14}
          hud={
            <g>
              <Tag x={120} y={980} text="SATELLITE SKIMMING THE SURFACE" F={S} dot={C.frost} size={28} />
              <g opacity={ez(f, lock - 34, lock - 24)}>
                <rect x={1080} y={720} width={560} height={150} rx={24} fill={alpha(INK, 0.72)} />
                <Counter x={1120} y={840} value={84 * kk} max={84} digits={2} size={110} color={CREAM} /* #2 */ />
                <text x={1305} y={840} textAnchor="middle" style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 90, fill: C.saffron }}>
                  ·
                </text>
                <Counter x={1390} y={840} value={84 * kk} max={84} digits={2} size={110} color={CREAM} /* #2 */ />
              </g>
            </g>
          }
        >
          <circle cx={B.cx} cy={B.cy} r={R} fill="none" stroke={alpha(CREAM, 0.5)} strokeWidth={4} strokeDasharray="10 14" />
          {Array.from({ length: 14 }, (_, i) => {
            const aa = ((a - i * 4) * Math.PI) / 180;
            return <circle key={i} cx={B.cx + Math.cos(aa) * R} cy={B.cy + Math.sin(aa) * R} r={14 - i * 0.8} fill={C.saffronCore} opacity={0.8 - i * 0.05} />;
          })}
          <Ball cx={B.cx} cy={B.cy} r={B.r} f={f} id="b115" />
          <Satellite x={sx} y={sy} a={a + 90} />
          <g opacity={ez(f, lock - 34, lock - 24)} transform={`translate(0 ${(1 - ez(f, lock - 34, lock - 20)) * 200})`}>
            <g transform={`translate(1240 400) scale(${pop.sx}) translate(-1240 -400)`}>
              <ClockFace x={1200} y={400} r={130} minutes={60 * kk} ring={kk} family={S} f={f} />
              <ClockFace x={1520} y={400} r={130} minutes={60 * kk} ring={kk} family={S} f={f} ringColor={C.teal} />
            </g>
          </g>
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 1-17 + 1-18 · the clock's face halves (a shading wipe), 84 rolls down to 42; then the stopwatch slides in and the
// seconds tick up to 42:12 while Tick reads it. MOVER: the half-disc wipe (10 px/f) + digits rolling; then the stopwatch
// sliding in (22 px/f) and its second hand sweeping.
// ===============================================================================================================
const ShotHalf: ShotFC<CL01> = ({ f, len, c }) => {
  const ex = c.exact - c.half;
  const K = { x: 640, y: 480, r: 280 };
  const w = ez(f, 4, Math.min(ex - 4, 50));
  const m = Math.round(84 - 42 * w); // #2 → #1 (42)
  const slide = ez(f, ex - 6, ex + 12);
  const secs = 42 * 60 + 12 * ez(f, ex + 10, ex + 46); // #1: 42 min 12 s
  const W = { x: 1320, y: 470, r: 190 };
  const sa = (((secs % 60) / 60) * 360 - 90) * (Math.PI / 180);
  return (
    <Pop f={f}>
      <Stage theme={S.theme} shotFrame={f} drift={{ zoom: 1.08, panX: 0.03, panY: 0.01, frames: len + 60, seed: 6 }} vignette={0.12} grain={0.5}>
        <StudioRoom
          f={f + 1400}
          seed={16}
          hud={
            <g>
              <rect x={100} y={60} width={460} height={150} rx={24} fill={alpha(INK, 0.72)} opacity={1 - slide} />
              <g opacity={1 - slide}>
                <Metric x={130} y={180} value={String(m)} unit="MIN" /* #1 #2 */ size={120} color={CREAM} />
              </g>
              <g opacity={slide}>
                <rect x={100} y={60} width={460} height={150} rx={24} fill={alpha(INK, 0.72)} />
                <ClockText x={330} y={180} secs={secs} size={120} color={CREAM} /* #1 */ />
              </g>
              <Tag x={120} y={980} text="42 MIN 12 S, EXACTLY" F={S} dot={C.saffron} size={30} opacity={ez(f, ex + 40, ex + 52)} />
            </g>
          }
        >
          <ClockFace x={K.x} y={K.y} r={K.r} minutes={42 + 42 * (1 - w)} ring={0} family={S} f={f} />
          <path d={`M${K.x} ${K.y} L${K.x} ${K.y - K.r} A${K.r} ${K.r} 0 0 1 ${K.x + Math.sin(w * Math.PI) * K.r} ${K.y - Math.cos(w * Math.PI) * K.r} Z`} fill={alpha(C.teal, 0.55)} />
          <line x1={K.x} y1={K.y} x2={K.x + Math.sin(w * Math.PI) * K.r} y2={K.y - Math.cos(w * Math.PI) * K.r} stroke={C.tealDeep} strokeWidth={8} />
          <g transform={`translate(${(1 - slide) * 900} 0)`}>
            <circle cx={W.x} cy={W.y - W.r - 30} r={26} fill={INK} />
            <circle cx={W.x} cy={W.y} r={W.r + 18} fill={INK} />
            <circle cx={W.x} cy={W.y} r={W.r} fill={CREAM} />
            {Array.from({ length: 60 }, (_, i) => {
              const t = (i / 60) * Math.PI * 2;
              return <line key={i} x1={W.x + Math.cos(t) * W.r * (i % 5 ? 0.9 : 0.8)} y1={W.y + Math.sin(t) * W.r * (i % 5 ? 0.9 : 0.8)} x2={W.x + Math.cos(t) * W.r * 0.97} y2={W.y + Math.sin(t) * W.r * 0.97} stroke={INK} strokeWidth={i % 5 ? 2 : 5} />;
            })}
            <line x1={W.x} y1={W.y} x2={W.x + Math.cos(sa) * W.r * 0.85} y2={W.y + Math.sin(sa) * W.r * 0.85} stroke={C.vermilion} strokeWidth={8} strokeLinecap="round" />
            <circle cx={W.x} cy={W.y} r={12} fill={INK} />
            <GroundShadow x={1690} y={FLOOR + 3} rx={60} color={S.shadow} opacity={0.35} blur={8} />
            <Tick x={1690} y={FLOOR} pxPerM={150} frame={f} facing={-1} pose="think" expression="thinking" look={0.5} headTilt={10} />
          </g>
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 1-19 + 1-20 · "Same density, any size": a small and a big ball of the same rock breathe in size, each with a falling
// probe and a clock on 42; then the camera pushes into the big ball and the probe races down its diameter while the
// SPEED dial sweeps up and its readout rolls to 8 km/s. MOVER: the balls breathing + the probes; then the probe racing
// (12 px/f) with streaks (18 px/f) + the needle sweeping.
// ===============================================================================================================
const ShotSize: ShotFC<CL01> = ({ f, len, c }) => {
  const race = c.race - c.size;
  const br = (s: number) => 1 + 0.35 * Math.sin(f / 14 + s);
  const A = { cx: 330, cy: 560, r: 130 * br(0) };
  const Bb = { cx: 900, cy: 500, r: 240 * br(Math.PI) };
  const ua = oscillate(f / 40);
  const ub = oscillate(f / 40);
  const rk = ez(f, race, len - 4);
  const raceU = -1 + 2 * ez(f, race + 4, len + 20);
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 540, zoom: 1.0 },
    { f: race, x: 900, y: 540, zoom: 1.02 },
    { f: race + 24, x: 900, y: 500, zoom: 1.7 },
    { f: len + 10, x: 900, y: 500, zoom: 1.8 },
  ]);
  return (
    <Stage theme={S.theme} cam={cam} vignette={0.12} grain={0.5}>
      <StudioRoom
        f={f + 1600}
        seed={18}
        hud={
          <g>
            <Tag x={120} y={980} text="SAME DENSITY · SAME TIME" F={S} dot={C.crust} size={30} opacity={1 - ez(f, race, race + 10)} />
            <L14Gauges family={S} frame={f} theme="dark" speed={{ value: rk, stop: STOP.speed /* #2 */, readout: GAUGE.speedPeak /* #2 */, roll: rk, appear: ez(f, race, race + 10) }} />
          </g>
        }
      >
        {[A, Bb].map((b, i) => (
          <g key={i}>
            <Ball cx={b.cx} cy={b.cy} r={b.r} f={f} id={`b119${i}`} />
            <line x1={b.cx} y1={b.cy - b.r} x2={b.cx} y2={b.cy + b.r} stroke={CREAM} strokeWidth={3} strokeDasharray="10 10" opacity={0.7} />
            {i === 1 && f >= race ? null : <Dot x={b.cx} y={b.cy + (i ? ub : ua) * (b.r - 26)} r={i ? 20 : 14} />}
            <g opacity={1 - ez(f, race, race + 10)}>
              <ClockFace x={b.cx} y={b.cy - b.r - (i ? 140 : 110)} r={i ? 80 : 60} minutes={42} ring={0.7} family={S} f={f} />
              <text x={b.cx} y={b.cy - b.r - (i ? 140 : 110) + 18} textAnchor="middle" style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: i ? 52 : 40, fill: INK }}>
                42
              </text>
            </g>
          </g>
        ))}
        {f >= race ? (
          <g>
            {Array.from({ length: 10 }, (_, i) => {
              const yy = ((rnd(i) * 900 - (f - race) * 18 * (0.8 + rnd(i * 3) * 0.6)) % 900 + 900) % 900;
              const x = Bb.cx - 120 + rnd(i * 7) * 240;
              return <line key={i} x1={x} y1={Bb.cy - 450 + yy} x2={x} y2={Bb.cy - 450 + yy + 90} stroke={CREAM} strokeWidth={5} opacity={0.75} strokeLinecap="round" />;
            })}
            <Probe x={Bb.cx} y={Bb.cy + raceU * (Bb.r - 40)} size={70} f={f} />
          </g>
        ) : null}
      </StudioRoom>
    </Stage>
  );
};

// ===============================================================================================================
// 1-21 · "twenty-eight thousand kilometres an hour": the readout rolls to 28,800 km/h (#13) while streaks smear the
// frame. MOVER: streaks (len 260, 18 px/f) + the Counter rolling.
// ===============================================================================================================
const ShotKmh: ShotFC<CL01> = ({ f, len }) => {
  const k = ez(f, 2, Math.min(len - 6, 50));
  return (
    <Pop f={f}>
      <Stage theme={S.theme} shotFrame={f} drift={{ zoom: 1.1, panX: 0.02, panY: 0.0, frames: len + 40, seed: 7 }} vignette={0.15} grain={0.5}>
        <StudioRoom f={f + 1800} seed={20} hud={<g />}>
          <rect x={-400} y={-200} width={2800} height={1500} fill={alpha(C.tealDeep, 0.55)} />
          <Streamers f={f} n={30} x0={-300} x1={2300} y0={80} y1={1000} len={260} width={10} speed={18} color={CREAM} opacity={0.75} seed={3} />
          <Probe x={430} y={540} size={170} f={f} tilt={-90} />
          <rect x={700} y={400} width={1020} height={210} rx={30} fill={alpha(INK, 0.8)} />
          <Counter x={760} y={560} value={GAUGE.speedKmh * k} max={GAUGE.speedKmh} size={150} color={CREAM} unit="km/h" /* #13 */ />
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 1-22 · "more than twenty times the speed of sound": a slow SOUND bubble creeps along a ruler while the probe icon
// flashes across it in one beat (again and again). MOVER: the probe crossing (40 px/f) vs the bubble (1.7 px/f).
// ===============================================================================================================
const ShotSound: ShotFC<CL01> = ({ f, len }) => {
  const y = 560;
  const lap = 54;
  const pk = (f % lap) / lap;
  const px = -200 + pk * 2300;
  const bx = 220 + f * 1.7;
  return (
    <Pop f={f}>
      <Stage theme={S.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0.03, panY: 0.0, frames: len + 40, seed: 8 }} vignette={0.12} grain={0.5}>
        <StudioRoom f={f + 2000} seed={22} hud={<Tag x={120} y={980} text="OVER 20× THE SPEED OF SOUND" /* #13 #18 */ F={S} dot={C.saffron} size={30} />}>
          <rect x={80} y={y + 70} width={1760} height={26} rx={8} fill={INK} />
          {Array.from({ length: 23 }, (_, i) => (
            <rect key={i} x={100 + i * 76} y={y + 50} width={8} height={i % 5 ? 30 : 60} fill={INK} />
          ))}
          <g transform={`translate(${bx} ${y - 30})`}>
            <rect x={-90} y={-50} width={180} height={90} rx={45} fill={CREAM} stroke={INK} strokeWidth={5} />
            <text x={0} y={12} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 30, letterSpacing: 3, fill: INK }}>
              SOUND
            </text>
            {[0, 1, 2].map((k) => (
              <path key={k} d={`M${100 + k * 22} -20 q 14 20 0 40`} stroke={INK} strokeWidth={5} fill="none" opacity={0.5 + 0.5 * Math.sin(f / 5 + k)} />
            ))}
          </g>
          <g opacity={Math.min(1, pk * 8, (1 - pk) * 8)}>
            {Array.from({ length: 6 }, (_, i) => (
              <line key={i} x1={px - 60 - i * 60} y1={y - 150 + i * 14 - 40} x2={px - 140 - i * 70} y2={y - 150 + i * 14 - 40} stroke={C.saffron} strokeWidth={8} strokeLinecap="round" opacity={0.8 - i * 0.12} />
            ))}
            <Probe x={px} y={y - 190} size={110} f={f} tilt={-90} lamp={false} />
          </g>
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 1-23 · the SPEED needle slams the saffron stop, bends it and rattles; chevrons pulse; Tick leans to the dial.
// MOVER: needle rolling then pinned + speed streaks behind (14 px/f) + the push to the dial + Tick's lean tween.
// ===============================================================================================================
const ShotStop: ShotFC<CL01> = ({ f, len }) => {
  const k = ez(f, 0, 22);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: len + 20, x: 1100, y: 470, zoom: 1.28 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={S.theme} cam={cam} vignette={0.12} grain={0.5}>
        <StudioRoom f={f + 2200} seed={24} hud={<Tag x={120} y={980} text="GAUGE 1 OF 4 · AT ITS STOP" F={S} dot={C.saffron} size={30} />}>
          <Streamers f={f} n={18} x0={-300} x1={2300} y0={100} y1={760} len={240} width={8} speed={14} color={alpha(CREAM, 0.9)} opacity={0.6} seed={9} />
          <g transform="translate(800 120) scale(2.1)">
            <L14Gauges family={S} frame={f} theme="dark" x={0} y={0} speed={{ value: 0.5 + 0.6 * k, stop: STOP.speed /* #2 */, readout: GAUGE.speedPeak /* #2 */, pinned: f > 22 }} />
          </g>
          <GroundShadow x={460} y={FLOOR + 3} rx={70} color={S.shadow} opacity={0.35} blur={8} />
          <Tick x={460} y={FLOOR} pxPerM={170} frame={f} facing={1} pose="stand" poseTo="lean" poseT={ez(f, 4, 20)} expression="surprised" look={0.9} squash={impact(f, 24, 0.1, 10)} />
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 1-24 + 1-25 · Tick pats the tidy ball; it does a happy squash-bounce; Tick glances at us. Then the ball cracks along
// concentric lines and the true layers grow outward from the centre (MORPH → 2-01). MOVER: the squash-bounce (±40 px)
// + Tick's pat; then the bands growing outward (6 px/f) + the push in.
// ===============================================================================================================
const ShotTidy: ShotFC<CL01> = ({ f, len, c }) => {
  const crack = c.crack - c.tidy;
  const B = { cx: 820, cy: 520, r: 280 };
  const bounce = f < crack ? Math.abs(Math.sin(f / 7)) * 40 * Math.exp(-f / 60) + Math.abs(Math.sin(f / 7)) * 14 : 0;
  const bands = ez(f, crack, len - 4);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: crack, x: 900, y: 530, zoom: 1.06 },
    { f: len, x: 820, y: 520, zoom: 1.75 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={S.theme} cam={cam} vignette={0.12} grain={0.5}>
        <StudioRoom f={f + 2400} seed={26}>
          <g transform={`translate(0 ${-bounce}) translate(${B.cx} ${B.cy + B.r}) scale(${1 + bounce * 0.002} ${1 - bounce * 0.002}) translate(${-B.cx} ${-B.cy - B.r})`}>
            <Ball cx={B.cx} cy={B.cy} r={B.r} f={f} id="b124" bands={bands} spin={0.6 + bands * 2} />
          </g>
          <g opacity={1 - ez(f, crack, crack + 14)}>
            <GroundShadow x={1240} y={FLOOR + 3} rx={60} color={S.shadow} opacity={0.35} blur={8} />
            <Tick x={1240} y={FLOOR} pxPerM={160} frame={f} facing={-1} pose={f % 28 < 14 && f < 40 ? "press" : "hips"} expression={f < 30 ? "happy" : "proud"} look={f < 30 ? 0.6 : -1} headTilt={f < 30 ? 0 : 12} />
          </g>
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================

export const SceneL01: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL01(t);
  const shots: ShotDef<CL01>[] = [
    { from: 0, S: ShotSpring, id: "1-01" }, // + 1-02
    { from: c.draw, S: ShotDraw, id: "1-03" }, // + 1-04, 1-05
    { from: c.split, S: ShotTrick, id: "1-06" }, // + 1-07
    { from: c.inward, S: ShotCancel, id: "1-08" },
    { from: c.below, S: ShotLine, id: "1-09" }, // + 1-10 … 1-13
    { from: c.swing, S: ShotSwing, id: "1-14" },
    { from: c.sat, S: ShotSatellite, id: "1-15" }, // + 1-16
    { from: c.half, S: ShotHalf, id: "1-17" }, // + 1-18
    { from: c.size, S: ShotSize, id: "1-19" }, // + 1-20
    { from: c.kmh, S: ShotKmh, id: "1-21" },
    { from: c.sound, S: ShotSound, id: "1-22" },
    { from: c.stop, S: ShotStop, id: "1-23" },
    { from: c.tidy, S: ShotTidy, id: "1-24" }, // + 1-25
  ];
  return playShots(f, shots, c, t.frames);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL01 = (t: SceneTiming): Cue[] => {
  const c = cuesL01(t);
  return [
    { at: 4, file: SFX.click, vol: 0.14, dur: 10 },
    ...[0, 6, 12, 18].map((o) => ({ at: c.pour + o, file: SFX.pop, vol: 0.12, dur: 16 })),
    ...cutHit(c.draw),
    { at: c.draw + 4, file: SFX.swirl, vol: 0.14, dur: 40 },
    ...Array.from({ length: 5 }, (_, i) => ({ at: c.sink + i * 8, file: SFX.click, vol: 0.07, dur: 8 })),
    { at: c.hook + 20, file: SFX.popLong, vol: 0.18, dur: 30 },
    ...cutHit(c.split),
    { at: c.trick + 26, file: SFX.pop, vol: 0.16, dur: 18 },
    ...cutHit(c.inward),
    ...[0, 22, 44, 66].map((o) => ({ at: c.inward + o + 18, file: SFX.click, vol: 0.12, dur: 10 })),
    ...cutHit(c.below),
    { at: c.wave, file: SFX.swirl, vol: 0.12, dur: 40 },
    ...Array.from({ length: 6 }, (_, i) => ({ at: c.chart + i * 12, file: SFX.click, vol: 0.06, dur: 8 })),
    { at: c.nothing + 10, file: SFX.popLong, vol: 0.2, dur: 30 },
    ...cutHit(c.swing),
    { at: c.swing + 6, file: SFX.click, vol: 0.18, dur: 10 },
    ...cutHit(c.sat),
    { at: c.sat + 4, file: SFX.whoosh, vol: 0.18, dur: 40 },
    { at: c.round + 6, file: SFX.chime, vol: 0.24, dur: 70 },
    ...cutHit(c.half),
    ...Array.from({ length: 12 }, (_, i) => ({ at: c.exact + 10 + i * 3, file: SFX.click, vol: 0.05, dur: 6 })),
    ...cutHit(c.size),
    { at: c.size + 6, file: SFX.pop, vol: 0.14, dur: 16 },
    { at: c.race, file: SFX.riser, vol: 0.16, dur: c.kmh - c.race, fadeIn: 6, fadeOut: 6 },
    ...cutHit(c.kmh),
    ...cutHit(c.sound),
    { at: c.sound + 4, file: SFX.whoosh, vol: 0.26, dur: 40 },
    ...cutHit(c.stop),
    { at: c.stop + 22, file: SFX.popLong, vol: 0.22, dur: 30 },
    ...cutHit(c.tidy),
    { at: c.tidy + 6, file: SFX.pop, vol: 0.16, dur: 16 },
    { at: c.crack, file: SFX.swirl, vol: 0.2, dur: 50 },
  ];
};
