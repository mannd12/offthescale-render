// L15 scene "l02" (storyboard §3 scene 2: 2-01…2-18, script lines 13-22; STUDIO_SET card room, dusk/noon panels inside
// the cards, darkening to void on the closing question).
// Shot components (hard cuts only; continuous rows are phases): 2-01 (three cards stand up) · 2-02+2-03 (Kittinger's
// card, the drogue opens) · 2-04 (stopwatch 4:37) · 2-05 (the helium balloon, no figure) · 2-06+2-07+2-08 (the descent
// bar, Baumgartner's card, the dial) · 2-09 (stopwatch 4:20) · 2-10 (no stabiliser) · 2-11+2-12 (the 36,402.6 m bar, the
// climb clock) · 2-13+2-14 (Eustace's card, the dial and his drogue) · 2-15 (the tube) · 2-16+2-17 (cut loose, ~15 min;
// the long dial) · 2-18 (why isn't the speed enormous?).
// Numbers drawn, each with its sources.md row: 1960, 31,333 m, 4:37, ~2 M, 13+ MIN (#7) · 2012, 38,969 m, 1,357.6 km/h,
// MACH 1.25, 4:20, 36,402.6 m, ~2.5 H (#4) · 2014, 41,419 m, 1,321 km/h, MACH 1.23, 3.66 M, ~15 MIN (#8). Not shown on
// purpose: the helium volume (#7 B), Kittinger's speed (F4), the abort switch (#6 B), the explosive device (#8 B).
// The SOUND mark on the dials is placed by soundSpeed(T) (F10). Jumpers are ≤ 120 px silhouettes on screen (F1).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bloom, CloudRack, Counter, IF2, Kicker, Layer, Sky, Stage, Tick, UnknownTag, alpha, cameraAt, impact, mixHex, rnd } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { ATM, JUMPS, ORBIT, TEMP_READ, soundSpeed } from "../jumpdata";
import { SpeedGauge } from "../L15Gauges";
import { Balloon, Bracket, CardPanel, Chute, ClockFace, Jumper, JumperPose, Stopwatch } from "../props";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { C, CREAM, DUSK, INK, LongDial, NOON, PillA, Pop, STUDIO, Slab, StudioRoom, VOID, cl01, ez, lerp, path1, rollText } from "./a-parts";

export const cuesL02 = (t: SceneTiming) => {
  const { at, p } = cueKit(t);
  return {
    three: 0, // 2-01
    kit: at(1), // 2-02
    drogue: p(1, "A small stabiliser"), // 2-03 (phase)
    watch1: at(2), // 2-04
    helium: p(2, "His balloon held"), // 2-05
    descent: p(2, "and the whole descent"), // 2-06
    baum: at(3), // 2-07 (phase)
    fastest: p(3, "His fastest moment"), // 2-08 (phase)
    watch2: at(4), // 2-09
    nodrogue: p(4, "He used no stabiliser"), // 2-10
    dist: p(4, "The fall covered"), // 2-11
    climb: at(5), // 2-12 (phase)
    eus: at(6), // 2-13
    eusDial: at(7), // 2-14 (phase)
    tube: at(8), // 2-15
    loose: p(8, "An explosive device"), // 2-16
    dial: at(9), // 2-17 (phase)
    why: p(9, "Which raises the question"), // 2-18
    end: t.frames,
  };
};
export type C02 = ReturnType<typeof cuesL02>;

// the three cards (#7 #4 #8): panel skies dawn-apricot, blue-to-indigo, apricot-to-indigo
const K_SKY = ["#13215E", "#2C6FD0", "#E3813F", "#F6B45A"];
const B_SKY = ["#0B1040", "#1D3F9E", "#2C6FD0", "#3FA9E8"];
const E_SKY = ["#0B1040", "#4B3FD0", "#E3813F", "#F6B45A"];
const CARDS = [
  { name: "Kittinger", year: JUMPS.kittinger.year, sky: K_SKY, kind: "gondola" as const, pose: "stand" as JumperPose },
  { name: "Baumgartner", year: JUMPS.baumgartner.year, sky: B_SKY, kind: "capsule" as const, pose: "stand" as JumperPose },
  { name: "Eustace", year: JUMPS.eustace.year, sky: E_SKY, kind: "beam" as const, pose: "hang" as JumperPose },
];

/** Where a card's balloon hangs (payload hook y) and how big it is, for rise 0 (low) … 1 (high). */
const cardBalloon = (pw: number, ph: number, rise: number) => ({ by: lerp(ph * 0.92, ph * 0.62, rise), size: pw * 0.55 });

/** One jump card: CardPanel with its panel sky, a balloon at `rise` (0 low … 1 high), a silhouette on it (unless
 *  `payload` overrides), a mini ruler on the panel's left edge whose ticks scroll by `scroll` px. */
export const JumpCard: React.FC<{ i: number; x: number; y: number; w: number; h: number; f: number; rise?: number; scroll?: number; appear?: number; payload?: React.ReactNode | null; jh?: number; children?: React.ReactNode }> = ({
  i,
  x,
  y,
  w,
  h,
  f,
  rise = 0.5,
  scroll = 0,
  appear = 1,
  payload,
  jh = 40,
  children,
}) => {
  const cd = CARDS[i];
  const pw = w - 36;
  const ph = h - 104;
  const { by, size } = cardBalloon(pw, ph, rise);
  const pl = payload === undefined ? <Jumper x={0} y={0} h={jh} f={f} pose={cd.pose} color={i === 1 ? C.saffron : C.teal} /> : payload;
  return (
    <CardPanel x={x} y={y} w={w} h={h} f={f} title={cd.name} sub={`${cd.year}`} sky={cd.sky} appear={appear}>
      {Array.from({ length: 14 }, (_, k) => {
        const ty = ((((k * 70 + scroll) % 980) + 980) % 980) - 60;
        return <line key={k} x1={0} y1={ty} x2={k % 5 === 0 ? 34 : 18} y2={ty} stroke={CREAM} strokeWidth={k % 5 === 0 ? 4 : 2.5} opacity={0.75} />;
      })}
      <Balloon x={pw / 2} y={by} size={size} f={f + i * 40} variant={cd.kind} payload={pl ?? undefined} />
      {children}
    </CardPanel>
  );
};

// ================================================================================================================
// 2-01 · STUDIO_SET: the ruler lies as a plate on the floor; three cards rise to stand on it; Tick walks along reading.
// MOVER: cards rising (staggered, ≈ 24 px/f) + Tick walking + the pan + the plate's ticks.
// ================================================================================================================
const ShotThree: ShotFC<C02> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 860, y: 540, zoom: 1.04 },
    { f: len, x: 1080, y: 540, zoom: 1.0 },
  ]);
  const tx = lerp(140, 1480, cl01(f / len));
  return (
    <Stage theme={STUDIO.theme} cam={cam} vignette={0.12} grain={0.5}>
      <StudioRoom f={f}>
        <rect x={120} y={850} width={1700} height={44} rx={10} fill={INK} />
        {Array.from({ length: 35 }, (_, k) => (
          <line key={k} x1={150 + k * 48} y1={850} x2={150 + k * 48} y2={k % 5 ? 866 : 880} stroke={CREAM} strokeWidth={k % 5 ? 3 : 5} />
        ))}
        {CARDS.map((_, i) => {
          const k = ez(f, 2 + i * 12, 30 + i * 12);
          return (
            <g key={i} transform={`translate(0 ${((1 - k) * 640).toFixed(1)})`}>
              <JumpCard i={i} x={300 + i * 470} y={250} w={320} h={590} f={f} rise={0.35 + 0.15 * i} jh={30} />
            </g>
          );
        })}
        <Tick x={tx} y={1000} pxPerM={150} frame={f} facing={1} walk={f / 15} expression="determined" look={-0.6} headTilt={-10} />
      </StudioRoom>
      <Layer depth={0}>
        <Kicker x={120} y={130} text="THREE JUMPS" color={CREAM} size={30} />
      </Layer>
    </Stage>
  );
};

// ================================================================================================================
// 2-02 + 2-03 · Kittinger's card (1960, 31,333 m #7): the gondola rises, the silhouette steps off; then close in, the
// small stabiliser chute opens behind it. MOVER: balloon rising (8 px/f) + Counter + the step off (20 px/f); then the
// canopy inflating + the steadying sway + streaks streaming past.
// ================================================================================================================
const ShotKittinger: ShotFC<C02> = ({ f, len, c }) => {
  const P3 = c.drogue - c.kit;
  const rise = ez(f, 0, P3 - 30);
  const step = ez(f, P3 - 40, P3 - 24);
  const pw = 520 - 36;
  const ph = 900 - 104;
  const { by, size } = cardBalloon(pw, ph, rise);
  const gondolaRail = { x: pw / 2 + size * 0.13, y: by + size * 0.12 };
  const fallY = f > P3 - 24 ? Math.min(260, (f - (P3 - 24)) * 9) : 0;
  const jx = gondolaRail.x + 30 * step + Math.sin(f / 6) * 20 * ez(f, P3, P3 + 30);
  const jy = gondolaRail.y + fallY;
  const open = ez(f, P3 + 4, P3 + 40);
  const cam = cameraAt(f, [
    { f: 0, x: 980, y: 540, zoom: 1.0 },
    { f: P3 - 20, x: 940, y: 520, zoom: 1.08 },
    { f: P3 + 20, x: 578 + jx, y: 90 + 86 + jy - 40, zoom: 1.75 },
    { f: len, x: 578 + jx, y: 90 + 86 + jy - 60, zoom: 1.85 },
  ]);
  return (
    <Stage theme={STUDIO.theme} cam={cam} vignette={0.12} grain={0.5}>
      <StudioRoom f={f}>
        <JumpCard i={0} x={560} y={90} w={520} h={900} f={f} rise={rise} scroll={f * 8} payload={null}>
          {/* streaks rushing up past the falling silhouette */}
          {f > P3 - 20
            ? Array.from({ length: 10 }, (_, k) => {
                const sx = jx - 120 + rnd(k * 3) * 240;
                const sy = ((((rnd(k * 7) * 900 - f * 22) % 900) + 900) % 900) - 50;
                return <line key={k} x1={sx} y1={sy} x2={sx} y2={sy + 60} stroke={CREAM} strokeWidth={3} opacity={0.5} strokeLinecap="round" />;
              })
            : null}
          <Chute x={jx} y={jy - 46} size={60} f={f} open={open} />
          <Jumper x={jx} y={jy} h={40} f={f} pose={step > 0.5 ? "drop" : step > 0 ? "step" : "stand"} />
        </JumpCard>
      </StudioRoom>
      <Layer depth={0}>
        <g opacity={1 - ez(f, P3 - 6, P3 + 6)}>
          <g transform="translate(1180 330)">
            <rect x={-30} y={-104} width={560} height={136} rx={22} fill={alpha(INK, 0.72)} />
            <Counter x={0} y={0} value={JUMPS.kittinger.exitM * ez(f, 6, P3 - 40)} max={JUMPS.kittinger.exitM} size={104} color={CREAM} />
            <text x={450} y={0} style={{ fontFamily: IF2.num, fontWeight: 600, fontSize: 48, fill: CREAM }}>
              m
            </text>
          </g>
          <PillA x={1150} y={420} text={`${JUMPS.kittinger.year} · KITTINGER`} F={STUDIO} dot={C.saffron} opacity={ez(f, 10, 22)} />
        </g>
        <PillA x={1100} y={200} text={`STABILISER CHUTE · ~${JUMPS.kittinger.chuteM} M` /* #7 */} F={DUSK} dot={C.teal} opacity={ez(f, P3 + 20, P3 + 32)} />
      </Layer>
    </Stage>
  );
};

// ================================================================================================================
// 2-04 · "The fall lasted 4:37" (#7): a big stopwatch beside card one; the hand sweeps and the readout rolls; Tick clicks.
// MOVER: second hand sweeping (tip ≈ 50 px/f) + the progress ring + the readout rolling.
// ================================================================================================================
const ShotWatch1: ShotFC<C02> = ({ f, len }) => (
  <Pop f={f}>
    <Stage theme={STUDIO.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0.01, panY: 0, frames: 200, seed: 4 }} vignette={0.12} grain={0.5}>
      <StudioRoom f={f + 100}>
        <JumpCard i={0} x={170} y={180} w={380} h={680} f={f} rise={0.7} scroll={f * 2} />
        <Stopwatch x={1000} y={470} r={250} f={f} end={JUMPS.kittinger.freefallS /* #7 4:37 */} t={ez(f, 6, len - 14)} family={STUDIO} />
        <Tick x={1430} y={1000} pxPerM={170} frame={f} facing={-1} pose={f < 10 ? "point" : "press"} expression="determined" look={0.4} squash={impact(f, 8, 0.12, 10)} />
      </StudioRoom>
    </Stage>
  </Pop>
);

// ================================================================================================================
// 2-05 · "nearly three million cubic feet of helium": the envelope swells to a huge teal dome beside a tiny gondola;
// NO figure (#7 class B). MOVER: the envelope inflating (edge 3-6 px/f) + the gondola bobbing + cirrus + the pull back.
// ================================================================================================================
const ShotHelium: ShotFC<C02> = ({ f, len }) => {
  const k = ez(f, 0, len - 10);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 640, zoom: 1.35 },
    { f: len, x: 960, y: 540, zoom: 1.0 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={DUSK.theme} cam={cam} vignette={0.25} grain={0.5}>
        <Layer depth={0.2}>
          <Sky family={DUSK} y={-300} h={1700} />
        </Layer>
        <Layer depth={0.5}>
          <CloudRack f={f} n={5} x0={-700} x1={2700} y0={700} y1={980} size={90} speed={2.6} body={alpha("#F3A35C", 0.8)} under={alpha("#7A3A20", 0.5)} top={alpha("#FFE0A8", 0.7)} seed={14} flat={1.8} />
        </Layer>
        <Layer depth={1}>
          <Balloon x={960} y={1000 + Math.sin(f / 7) * 6} size={lerp(260, 600, k)} f={f} inflate={lerp(0.15, 1, k)} variant="gondola" />
        </Layer>
        <Layer depth={0}>
          <PillA x={120} y={140} text="A HELIUM BALLOON" F={DUSK} dot={C.teal} opacity={ez(f, 8, 20)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 2-06 + 2-07 + 2-08 · the descent bar grows under card one (13+ MIN #7), the camera pans with it to card two (2012,
// 38,969 m #4), pushes in, then onto the SPEED dial in the card: needle to 1,357.6 km/h, MACH 1.25 (#4).
// MOVER: the bar growing (≈ 12 px/f) + the pan; then the balloon rising + Counter; then the needle (3°/f) + Counter.
// ================================================================================================================
const DIAL_MAX_KMH = 1600; // the dial's stop for 2-08/2-14 (drawing only: no numeral on the face)
const ShotRun: ShotFC<C02> = ({ f, len, c }) => {
  const P7 = c.baum - c.descent;
  const P8 = c.fastest - c.descent;
  const barK = ez(f, 4, P7 - 4);
  const barX0 = 200;
  const barX1 = lerp(barX0, 1860, barK);
  const rise = ez(f, P7, P8 - 10);
  const needle = ez(f, P8 + 8, P8 + 60);
  const cam = cameraAt(f, [
    { f: 0, x: 760, y: 540, zoom: 1.0 },
    { f: P7, x: 1500, y: 540, zoom: 1.0 },
    { f: P7 + 50, x: 2180, y: 520, zoom: 1.2 },
    { f: P8, x: 2200, y: 520, zoom: 1.24 },
    { f: P8 + 40, x: 2170, y: 580, zoom: 1.5 },
    { f: len, x: 2175, y: 585, zoom: 1.58 },
  ]);
  const kmh = JUMPS.baumgartner.topKmh;
  return (
    <Stage theme={STUDIO.theme} cam={cam} vignette={0.12} grain={0.5}>
      <StudioRoom f={f}>
        <JumpCard i={0} x={120} y={140} w={400} h={700} f={f} rise={0.8} />
        {/* the 13+ minute descent bar with a tiny chute riding its end */}
        <rect x={barX0} y={872} width={barX1 - barX0} height={30} rx={15} fill={C.saffron} stroke={INK} strokeWidth={4} />
        <Chute x={barX1} y={860} size={40} f={f} open={1} kind="main" />
        <JumpCard i={1} x={1960} y={140} w={420} h={720} f={f} rise={0.25 + 0.5 * rise} scroll={f * 8} jh={42} />
        {f > P8 - 10 ? (
          <g opacity={ez(f, P8 - 10, P8 + 6)}>
            <SpeedGauge x={1990} y={420} scale={1.0} f={f} family={STUDIO} theme="dark" s={{ value: (kmh / DIAL_MAX_KMH) * needle, soundT: ATM[3].tC, max: DIAL_MAX_KMH / 3.6 }} />
          </g>
        ) : null}
        <Tick x={2470} y={880} pxPerM={110} frame={f} facing={-1} pose={f > P8 ? "lean" : "stand"} expression={f > P8 + 40 ? "surprised" : "neutral"} look={0.6} />
      </StudioRoom>
      <Layer depth={0}>
        <PillA x={120} y={140} text={`${JUMPS.kittinger.descentMin}+ MIN DOWN` /* #7 */} F={STUDIO} dot={C.saffron} opacity={ez(f, 20, 32) * (1 - ez(f, P7 - 8, P7 + 4))} />
        {f > P7 && f < P8 + 12 ? (
          <g opacity={ez(f, P7 + 20, P7 + 32) * (1 - ez(f, P8, P8 + 12))}>
            <g transform="translate(160 330)">
              <rect x={-30} y={-104} width={560} height={136} rx={22} fill={alpha(INK, 0.72)} />
              <Counter x={0} y={0} value={JUMPS.baumgartner.exitM * ez(f, P7 + 20, P8 - 20)} max={JUMPS.baumgartner.exitM} size={104} color={CREAM} />
              <text x={450} y={0} style={{ fontFamily: IF2.num, fontWeight: 600, fontSize: 48, fill: CREAM }}>
                m
              </text>
            </g>
            <PillA x={130} y={420} text={`${JUMPS.baumgartner.year} · BAUMGARTNER`} F={STUDIO} dot={C.saffron} />
          </g>
        ) : null}
        {f > P8 ? (
          <g opacity={ez(f, P8 + 10, P8 + 22)}>
            <Slab x={130} y={300} value={rollText(kmh, needle, 1) /* 1,357.6 #4 */} unit="km/h" size={80} F={STUDIO} />
            <PillA x={130} y={400} text={`MACH ${JUMPS.baumgartner.mach}` /* #4 */} F={STUDIO} dot={C.limb} opacity={ez(f, P8 + 56, P8 + 68)} />
          </g>
        ) : null}
      </Layer>
    </Stage>
  );
};

// ================================================================================================================
// 2-09 · "The whole free fall took 4:20" (#4): the stopwatch again, now beside card two. MOVER: the hand + ring + push.
// ================================================================================================================
const ShotWatch2: ShotFC<C02> = ({ f, len }) => (
  <Pop f={f}>
    <Stage theme={STUDIO.theme} cam={cameraAt(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 860, y: 520, zoom: 1.14 }])} vignette={0.12} grain={0.5}>
      <StudioRoom f={f + 300} seed={6}>
        <Stopwatch x={760} y={480} r={270} f={f} end={JUMPS.baumgartner.freefallS /* #4 4:20 */} t={ez(f, 6, len - 14)} family={STUDIO} />
        <JumpCard i={1} x={1360} y={190} w={380} h={660} f={f} rise={0.75} />
        <Tick x={1180} y={1000} pxPerM={150} frame={f} facing={-1} pose={f < 8 ? "point" : "press"} expression="neutral" look={0.3} squash={impact(f, 6, 0.12, 10)} />
      </StudioRoom>
    </Stage>
  </Pop>
);

// ================================================================================================================
// 2-10 · "He used no stabiliser parachute": card one's drogue icon, stamped across with a saffron X (no text on the X).
// MOVER: the X slamming in (≈ 40 px/f) + the icon shaking (±12 px, 8 px/f) + the cyc clouds.
// ================================================================================================================
const ShotNoDrogue: ShotFC<C02> = ({ f }) => {
  const at = 12;
  const age = f - at;
  const sc = age < 0 ? 0 : age < 6 ? 2.4 - 1.4 * (age / 6) ** 2 : 1;
  const shake = age >= 6 ? Math.sin(f * 0.75) * 12 * Math.exp(-(age - 6) / 40) + Math.sin(f / 5) * 3 : 0;
  return (
    <Pop f={f}>
      <Stage theme={STUDIO.theme} shotFrame={f} drift={{ zoom: 1.08, panX: 0.012, panY: 0, frames: 160, seed: 5 }} vignette={0.12} grain={0.5}>
        <StudioRoom f={f + 500} seed={7}>
          <g transform={`translate(${shake.toFixed(1)} 0)`}>
            <circle cx={820} cy={520} r={300} fill={alpha(INK, 0.55)} />
            <Chute x={820} y={760} size={260} f={f} open={1} />
            <Jumper x={820} y={830} h={90} f={f} pose="drop" />
          </g>
          {age >= 0 ? (
            <g transform={`translate(820 540) scale(${sc.toFixed(3)}) rotate(-6)`} opacity={age < 6 ? 0.4 + 0.1 * age : 1}>
              {[45, -45].map((a) => (
                <rect key={a} x={-330} y={-30} width={660} height={60} rx={20} fill={C.saffron} stroke={INK} strokeWidth={6} transform={`rotate(${a})`} />
              ))}
            </g>
          ) : null}
          <Tick x={1400} y={1000} pxPerM={160} frame={f} facing={-1} pose="shrug" expression="neutral" look={Math.sin(f / 3) * 0.8 * ez(f, 16, 30)} />
        </StudioRoom>
        <Layer depth={0}>
          <PillA x={1180} y={240} text="NO STABILISER" F={STUDIO} dot={C.saffron} opacity={ez(f, 18, 30)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 2-11 + 2-12 · a distance bar draws down card two from the exit mark to the main-chute mark (36,402.6 m #4); then the
// card slides away and a clock's hand races two and a half turns (~2.5 h up #4). MOVER: the bar head (18 px/f) + tilt
// down + Counter; then the hand (10°/f) + the ring filling + the slide.
// ================================================================================================================
const ShotDistance: ShotFC<C02> = ({ f, len, c }) => {
  const P12 = c.climb - c.dist;
  const barK = ez(f, 4, P12 - 8);
  const slide = ez(f, P12 - 6, P12 + 14);
  const top = 260;
  const bot = 1500;
  const head = lerp(top, bot, barK);
  const camY = lerp(520, 1000, ez(f, 0, P12 - 4));
  const g = f - P12;
  const mins = 150 * ez(g, 4, len - P12 - 10); // two and a half turns = 2.5 h (#4)
  return (
    <AbsoluteFill>
      <Stage theme={STUDIO.theme} cam={{ x: 960 - slide * 1400, y: lerp(camY, 540, slide), zoom: 1.0 }} vignette={0.12} grain={0.5}>
        <StudioRoom f={f + 200} seed={8} floor={1700}>
          <CardPanel x={420} y={120} w={720} h={1500} f={f} title={CARDS[1].name} sub={`${CARDS[1].year}`} sky={[...B_SKY, "#3FA9E8", "#8FD2E6"]}>
            <Balloon x={342} y={150} size={180} f={f} variant="capsule" />
            <Chute x={342} y={1310} size={110} f={f} open={1} kind="main" />
            <Jumper x={342} y={1330} h={40} f={f} pose="drop" />
            <line x1={540} y1={top - 86} x2={540} y2={head - 86} stroke={C.saffron} strokeWidth={14} strokeLinecap="round" />
            <circle cx={540} cy={head - 86} r={18} fill={C.saffronCore} stroke={C.saffron} strokeWidth={5} />
            <line x1={500} y1={top - 86} x2={580} y2={top - 86} stroke={C.saffron} strokeWidth={8} />
            {barK >= 1 ? <line x1={500} y1={bot - 86} x2={580} y2={bot - 86} stroke={C.saffron} strokeWidth={8} /> : null}
          </CardPanel>
        </StudioRoom>
      </Stage>
      {g > -14 ? (
        <AbsoluteFill style={{ transform: `translateX(${((1 - slide) * 1920).toFixed(1)}px)` }}>
          <Stage theme={STUDIO.theme} shotFrame={Math.max(0, g)} drift={{ zoom: 1.06, panX: 0.01, panY: 0, frames: 160, seed: 6 }} vignette={0.12} grain={0.5}>
            <StudioRoom f={f + 400} seed={9}>
              <ClockFace x={820} y={470} r={290} minutes={mins} ring={(mins / 60) % 1 + (mins >= 150 ? 0.5 : 0)} family={STUDIO} f={f} />
              <Tick x={1260} y={1000} pxPerM={160} frame={f} facing={-1} pose={g > 50 ? "press" : "point"} expression="happy" look={0.3} squash={impact(g, 52, 0.1, 10)} />
            </StudioRoom>
            <Layer depth={0}>
              <PillA x={1180} y={240} text={`~${JUMPS.baumgartner.climbH} H UP` /* #4 */} F={STUDIO} dot={C.saffron} opacity={ez(g, 14, 26)} />
            </Layer>
          </Stage>
        </AbsoluteFill>
      ) : null}
      {g < 0 ? (
        <AbsoluteFill>
          <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
            <Slab x={1240} y={300} value={rollText(JUMPS.baumgartner.distanceM, barK, 1) /* 36,402.6 #4 */} unit="m" size={96} F={STUDIO} opacity={ez(f, 6, 16)} />
          </svg>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

// ================================================================================================================
// 2-13 + 2-14 · Eustace's card (2014, 41,419 m #8): no gondola, the silhouette hangs from a beam; the card's ruler
// streams as the balloon climbs; then the dial beside it: needle to 1,321 km/h, MACH 1.23, and his stabiliser chute
// opens above the silhouette (#8). MOVER: panel ticks streaming (8 px/f) + Counter + the push; then the needle + canopy.
// ================================================================================================================
const ShotEustace: ShotFC<C02> = ({ f, len, c }) => {
  const P14 = c.eusDial - c.eus;
  const rise = ez(f, 0, P14 - 20);
  const needle = ez(f, P14 + 8, P14 + 70);
  const open = ez(f, P14 + 60, P14 + 100);
  const kmh = JUMPS.eustace.topKmh;
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 540, zoom: 1.0 },
    { f: P14 - 10, x: 820, y: 520, zoom: 1.18 },
    { f: P14 + 30, x: 1160, y: 590, zoom: 1.22 },
    { f: len, x: 1180, y: 600, zoom: 1.26 },
  ]);
  const pw = 480 - 36;
  const ph = 840 - 104;
  const { by } = cardBalloon(pw, ph, 0.3 + 0.4 * rise);
  return (
    <Stage theme={STUDIO.theme} cam={cam} vignette={0.12} grain={0.5}>
      <StudioRoom f={f + 700} seed={10}>
        <JumpCard i={2} x={560} y={120} w={480} h={840} f={f} rise={0.3 + 0.4 * rise} scroll={f * 8}>
          {open > 0 ? (
            <g transform={`rotate(48 ${pw / 2 + 4} ${by + 40})`}>
              <Chute x={pw / 2 + 4} y={by + 40} size={64} f={f} open={open} />
            </g>
          ) : null}
        </JumpCard>
        {f > P14 - 10 ? (
          <g opacity={ez(f, P14 - 10, P14 + 6)}>
            <SpeedGauge x={1120} y={300} scale={1.0} f={f} family={STUDIO} theme="dark" s={{ value: (kmh / DIAL_MAX_KMH) * needle, soundT: ATM[4].tC, max: DIAL_MAX_KMH / 3.6 }} />
          </g>
        ) : null}
        <Tick x={1480} y={880} pxPerM={130} frame={f} facing={-1} pose={f > P14 ? "point" : "stand"} expression={f > P14 + 60 ? "happy" : "neutral"} look={0.5} />
      </StudioRoom>
      <Layer depth={0}>
        {f < P14 + 12 ? (
          <g opacity={ez(f, 10, 22) * (1 - ez(f, P14, P14 + 12))}>
            <g transform="translate(1270 330)">
              <rect x={-30} y={-104} width={560} height={136} rx={22} fill={alpha(INK, 0.72)} />
              <Counter x={0} y={0} value={JUMPS.eustace.exitM * ez(f, 10, P14 - 30)} max={JUMPS.eustace.exitM} size={104} color={CREAM} />
              <text x={450} y={0} style={{ fontFamily: IF2.num, fontWeight: 600, fontSize: 48, fill: CREAM }}>
                m
              </text>
            </g>
            <PillA x={1240} y={420} text={`${JUMPS.eustace.year} · EUSTACE`} F={STUDIO} dot={C.saffron} />
          </g>
        ) : null}
        {f > P14 ? (
          <g opacity={ez(f, P14 + 10, P14 + 22)}>
            <Slab x={1420} y={330} value={rollText(kmh, needle, 0) /* 1,321 #8 */} unit="km/h" size={90} F={STUDIO} />
            <PillA x={1400} y={430} text={`MACH ${JUMPS.eustace.mach}` /* #8 */} F={STUDIO} dot={C.limb} opacity={ez(f, P14 + 66, P14 + 78)} />
          </g>
        ) : null}
      </Layer>
    </Stage>
  );
};

// ================================================================================================================
// 2-15 · the carbon-fibre tube (about 3.66 m #8) slides out above the hanging silhouette; the chute lines spread round
// it. MOVER: the tube extending (20 px/f) + the lines fanning + the push + Tick measuring.
// ================================================================================================================
const ShotTube: ShotFC<C02> = ({ f, len }) => {
  const k = ez(f, 6, 30);
  const fan = ez(f, 24, 70);
  const jx = 700;
  const jy = 820; // feet
  const tubeTop = jy - 110 - 300 * k;
  return (
    <Pop f={f}>
      <Stage theme={STUDIO.theme} cam={cameraAt(f, [{ f: 0, x: 960, y: 560, zoom: 1.0 }, { f: len, x: 900, y: 520, zoom: 1.1 }])} vignette={0.12} grain={0.5}>
        <StudioRoom f={f + 900} seed={11}>
          <circle cx={jx} cy={560} r={330} fill={alpha(INK, 0.5)} />
          <rect x={jx - 14} y={tubeTop} width={28} height={jy - 100 - tubeTop} rx={12} fill="#1B3A44" stroke={C.limb} strokeWidth={3} />
          {[-1, -0.4, 0.4, 1].map((u, i) => (
            <line key={i} x1={jx} y1={tubeTop} x2={jx + u * 150 * fan} y2={tubeTop - 160 * fan} stroke={CREAM} strokeWidth={3} opacity={0.85} />
          ))}
          {fan > 0.1 ? <Chute x={jx} y={tubeTop} size={150 * fan + 20} f={f} open={fan} /> : null}
          <Jumper x={jx} y={jy} h={110} f={f} pose="stand" />
          <Bracket x1={jx + 70} y1={jy - 100} x2={jx + 70} y2={tubeTop} draw={ez(f, 34, 60)} />
          <Tick x={1180} y={1000} pxPerM={160} frame={f} facing={-1} staff pose="point" expression="proud" look={0.5} />
        </StudioRoom>
        <Layer depth={0}>
          <PillA x={1060} y={220} text={`TUBE · ABOUT ${JUMPS.eustace.tubeM} M` /* #8 */} F={STUDIO} dot={C.limb} opacity={ez(f, 30, 42)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 2-16 + 2-17 · cut loose: the clamp opens with a flash (no label: #8 B) and the silhouette drops free, the camera
// following down past streaming ticks; a clock counts to ~15 min (#8). Then the studio long dial slides in: SOUND
// (soundSpeed at 20 km, F10), Baumgartner's and Eustace's marks close together, the stop far above.
// MOVER: the drop (14 px/f) + streaks + the clock; then the needles sweeping (staggered) + stop chevrons.
// ================================================================================================================
const DIAL2 = { x: 900, y: 760, r: 460 };
const soundKmh = soundSpeed(TEMP_READ.at20) * 3.6; // F10: from the 20 km temperature (#11, #15)
const ShotLoose: ShotFC<C02> = ({ f, len, c }) => {
  const P17 = c.dial - c.loose;
  const cut = 16;
  const drop = Math.max(0, f - cut);
  const jyRaw = 330 + Math.min(220, drop * 6);
  const scroll = drop * 14;
  const slide = ez(f, P17 - 8, P17 + 12);
  const g = f - P17;
  const mins = JUMPS.eustace.groundMin * ez(f, cut + 6, P17 - 10);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${(-slide * 1920).toFixed(1)}px)` }}>
        <Stage theme={DUSK.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.008, panY: 0, frames: 200, seed: 7 }} vignette={0.25} grain={0.5}>
          <Layer depth={0.2}>
            <Sky stops={E_SKY} x={-200} y={-200} w={2320} h={1480} />
          </Layer>
          <Layer depth={1}>
            {Array.from({ length: 16 }, (_, k) => {
              const ty = ((((k * 90 - scroll) % 1440) + 1440) % 1440) - 180;
              return <line key={k} x1={160} y1={ty} x2={k % 5 === 0 ? 230 : 200} y2={ty} stroke={CREAM} strokeWidth={k % 5 === 0 ? 5 : 3} opacity={0.8} />;
            })}
            <line x1={160} y1={-200} x2={160} y2={1300} stroke={CREAM} strokeWidth={5} />
            {Array.from({ length: 12 }, (_, k) => {
              const sx = 300 + rnd(k * 5) * 900;
              const sy = ((((rnd(k * 9) * 1300 - scroll * 1.4) % 1300) + 1300) % 1300) - 110;
              return <line key={k} x1={sx} y1={sy} x2={sx} y2={sy + 70} stroke={CREAM} strokeWidth={4} strokeLinecap="round" opacity={0.45} />;
            })}
            <g transform={`translate(0 ${(-drop * 10).toFixed(1)})`}>
              <Balloon x={700} y={300} size={420} f={f} variant="beam" payload={null} />
            </g>
            {f > cut - 2 && f < cut + 8 ? <Bloom x={700} y={310 - drop * 10} r={140} color={C.saffronCore} strength={1} /> : null}
            <Jumper x={700} y={f < cut ? 303 : jyRaw} h={60} f={f} pose={f < cut ? "hang" : "drop"} />
            <ClockFace x={1250} y={460} r={180} minutes={mins} ring={mins / 60} family={DUSK} f={f} />
          </Layer>
          <Layer depth={0}>
            <PillA x={1040} y={760} text={`~${JUMPS.eustace.groundMin} MIN TO THE GROUND` /* #8 */} F={DUSK} dot={C.saffron} opacity={ez(f, cut + 20, cut + 32)} />
          </Layer>
        </Stage>
      </AbsoluteFill>
      {slide > 0 ? (
        <AbsoluteFill style={{ transform: `translateX(${((1 - slide) * 1920).toFixed(1)}px)` }}>
          <Stage theme={STUDIO.theme} cam={cameraAt(Math.max(0, g), [{ f: 0, x: 960, y: 560, zoom: 1.12 }, { f: len - P17, x: 960, y: 540, zoom: 1.0 }])} vignette={0.12} grain={0.5}>
            <StudioRoom f={f + 1100} seed={12}>
              <LongDial
                x={DIAL2.x}
                y={DIAL2.y}
                r={DIAL2.r}
                f={f}
                max={ORBIT.modelPeakKmh /* the stop: unlabelled */}
                sound={soundKmh}
                marks={[
                  { v: JUMPS.baumgartner.topKmh, label: "Baumgartner", k: ez(g, 10, 50) },
                  { v: JUMPS.eustace.topKmh, label: "Eustace", k: ez(g, 26, 66) },
                ]}
              />
              <Tick x={1560} y={1000} pxPerM={150} frame={f} facing={-1} pose={g > 60 ? "hips" : "point"} expression="proud" look={0.4} />
            </StudioRoom>
            <Layer depth={0}>
              <PillA x={120} y={140} text="ONLY A LITTLE OVER MACH 1" F={STUDIO} dot={C.limb} opacity={ez(g, 60, 72)} />
            </Layer>
          </Stage>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

// ================================================================================================================
// 2-18 · "Up there, the air is almost gone. So why isn't the speed enormous?": the room darkens to indigo; air dots
// stream up a ruler and thin to nothing; a vermilion "?" pops on the dial's far stop. MOVER: dots streaming (8 px/f,
// count falling) + chevrons + the "?" popping + the tilt up.
// ================================================================================================================
const ShotWhy: ShotFC<C02> = ({ f, len }) => {
  const dark = ez(f, 0, 24);
  const q = ez(f, 40, 52);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: len, x: 1000, y: 420, zoom: 1.1 },
  ]);
  const [sx, sy] = [DIAL2.x + DIAL2.r * Math.cos(Math.PI + 0.97 * Math.PI), DIAL2.y + DIAL2.r * Math.sin(Math.PI + 0.97 * Math.PI)];
  return (
    <Pop f={f}>
      <Stage theme={VOID.theme} cam={cam} vignette={0.3} grain={0.5}>
        <StudioRoom f={f + 1300} seed={12} dark={0}>
          <rect x={-1400} y={-600} width={4800} height={2400} fill="#070A2E" opacity={0.86 * dark} />
          <LongDial x={DIAL2.x} y={DIAL2.y} r={DIAL2.r} f={f} max={ORBIT.modelPeakKmh} sound={soundKmh} marks={[{ v: JUMPS.baumgartner.topKmh, label: "Baumgartner", k: 1 }, { v: JUMPS.eustace.topKmh, label: "Eustace", k: 1 }]} plate="#0E1A44" />
          {/* the air column: dots streaming up, thinning with height */}
          <line x1={1640} y1={-200} x2={1640} y2={1000} stroke={CREAM} strokeWidth={5} opacity={0.8} />
          {Array.from({ length: 70 }, (_, i) => {
            const y = ((((rnd(i * 3) * 1300 - f * 8) % 1300) + 1300) % 1300) - 260;
            const keep = rnd(i * 7 + 1) < Math.exp(-(1000 - y) / 300) * (1 - 0.7 * ez(f, 20, len));
            if (!keep) return null;
            return <circle key={i} cx={1680 + rnd(i * 5) * 160} cy={y} r={7} fill={C.bone} opacity={0.9} />;
          })}
          {q > 0 ? (
            <g transform={`translate(${sx.toFixed(1)} ${(sy - 90).toFixed(1)}) scale(${(q * (1 + 0.12 * Math.sin(f / 3))).toFixed(3)})`}>
              <Bloom x={0} y={0} r={130} color={C.vermilion} core={0} strength={0.6} />
              <UnknownTag x={0} y={0} size={52} />
            </g>
          ) : null}
          <Tick x={360} y={1000} pxPerM={130} frame={f} facing={1} pose="think" expression="thinking" look={0.4} headTilt={-18} />
        </StudioRoom>
        <Layer depth={0}>
          <PillA x={120} y={140} text="WHY ISN'T THE SPEED ENORMOUS?" F={VOID} dot={C.vermilion} opacity={ez(f, 30, 42)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================

export const SceneL02: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL02(t);
  const shots: ShotDef<C02>[] = [
    { from: 0, S: ShotThree, id: "2-01" },
    { from: c.kit, S: ShotKittinger, id: "2-02" }, // + 2-03
    { from: c.watch1, S: ShotWatch1, id: "2-04" },
    { from: c.helium, S: ShotHelium, id: "2-05" },
    { from: c.descent, S: ShotRun, id: "2-06" }, // + 2-07, 2-08
    { from: c.watch2, S: ShotWatch2, id: "2-09" },
    { from: c.nodrogue, S: ShotNoDrogue, id: "2-10" },
    { from: c.dist, S: ShotDistance, id: "2-11" }, // + 2-12
    { from: c.eus, S: ShotEustace, id: "2-13" }, // + 2-14
    { from: c.tube, S: ShotTube, id: "2-15" },
    { from: c.loose, S: ShotLoose, id: "2-16" }, // + 2-17
    { from: c.why, S: ShotWhy, id: "2-18" },
  ];
  return playShots(f, shots, c, t.frames);
};

const run = (at: number, n = 6, gap = 8, vol = 0.07): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 8 }));
export const soundL02 = (t: SceneTiming): Cue[] => {
  const c = cuesL02(t);
  return [
    ...[2, 14, 26].map((o) => ({ at: c.three + o + 20, file: SFX.pop, vol: 0.16, dur: 20 })),
    ...cutHit(c.kit),
    ...run(c.kit + 8),
    { at: c.drogue + 6, file: SFX.popLong, vol: 0.18, dur: 30 },
    ...cutHit(c.watch1),
    ...run(c.watch1 + 6, 10, 9),
    ...cutHit(c.helium),
    { at: c.helium + 4, file: SFX.swirl, vol: 0.14, dur: 40 },
    ...cutHit(c.descent),
    ...run(c.descent + 6),
    ...run(c.baum + 20),
    ...run(c.fastest + 8),
    { at: c.fastest + 60, file: SFX.popLong, vol: 0.18, dur: 30 },
    ...cutHit(c.watch2),
    ...run(c.watch2 + 6, 10, 9),
    ...cutHit(c.nodrogue),
    { at: c.nodrogue + 12, file: SFX.popLong, vol: 0.22, dur: 30 },
    ...cutHit(c.dist),
    ...run(c.dist + 6),
    ...run(c.climb + 6, 8, 8),
    ...cutHit(c.eus),
    ...run(c.eus + 10),
    ...run(c.eusDial + 8),
    ...cutHit(c.tube),
    { at: c.tube + 8, file: SFX.pop, vol: 0.18, dur: 20 },
    ...cutHit(c.loose),
    { at: c.loose + 16, file: SFX.pop, vol: 0.22, dur: 20 },
    ...run(c.loose + 24, 8, 10),
    { at: c.dial + 10, file: SFX.chime, vol: 0.16, dur: 60 },
    ...cutHit(c.why),
    { at: c.why + 2, file: SFX.riser, vol: 0.12, dur: 60, fadeIn: 6, fadeOut: 10 },
  ];
};
