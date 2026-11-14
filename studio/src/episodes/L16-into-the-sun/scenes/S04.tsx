// L16 scene l04 "Hot, but not heat" (storyboard §3 "4 ·", shots 4-01…4-24, script lines 32-41). ShotDefs (hard cuts; PUSH
// / SLIDE rows are phases of one shot): 4-01 (+4-02, 4-03, 4-04) · 4-05 · 4-06 · 4-07 (+4-08) · 4-09 · 4-10 (+4-11) · 4-12 ·
// 4-13 (+4-14, 4-15) · 4-16 · 4-17 (+4-18) · 4-19 (+4-20, KEY ART 2) · 4-21 · 4-22 · 4-23 (+4-24).
// Numbers drawn (READ entries in sundata.ts): 5,500 °C + ABOUT (#10 #15) · 2 million °C (#10) · 2,500 °F · about 1,400 °C +
// NASA SAYS CAN REACH (#13) · 1,800 °F · under 1,000 °C + EXPECTED (#7 #13) · 85 °F · about 30 °C + NASA SAYS (#13). F2: those
// shield figures are NASA design / expected values, so the green MEASURED stamp goes only on the flight path (4-23).
// Words only (class B, no numerals): HUNDREDS OF TIMES HOTTER (#10), COOLER TO HOTTER: BLOCKED (#14), TEMPERATURE: HOW FAST,
// HEAT: TOTAL ENERGY PASSED ON, HOT OVEN / BOILING WATER (#11). F1: the two hand icons are inert outlines (no reaction).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bloom, Headline, Kicker, Layer, Sky, Stage, Tick, alpha, cameraAt, impact, mixHex, rnd, smoothPath, type Pt } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { READ, fToC } from "../sundata";
import { WindStreaks } from "../movers16";
import { CoronaHalo, SunLimb } from "../sunbody";
import { L16DialsHUD } from "../L16Dials";
import { AboutPill, SayPill, SourceChip, StateStamp } from "../stamps";
import { GlassBox, HandIcon, Oven, Panels, Pot, Probe, Shield, WaterLoop } from "../props16";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import {
  Arrow,
  BendStreaks,
  Burst,
  C,
  CORONA,
  GLOW,
  Ledge,
  Pop,
  QTag,
  Readout,
  SHADE,
  SPACE,
  STU,
  Shimmer,
  SideSun,
  SpaceField,
  Sparks,
  Speedo,
  StudioSet,
  Tag,
  TallSky,
  Thermo,
  cl01,
  ez,
  lerp,
  lin,
  loopAt,
  loopPer,
  rollText,
} from "./b-parts";

export const cuesL04 = (t: SceneTiming) => {
  const { at, frac, p } = cueKit(t);
  return {
    mystery: 0, // 4-01
    surface: frac(0, 0.22), // 4-02 (phase)
    corona: frac(0, 0.5), // 4-03 (phase)
    hundreds: frac(0, 0.75), // 4-04 (phase)
    nasa: at(1), // 4-05
    flow: frac(1, 0.45), // 4-06
    doomed: at(2), // 4-07
    hoped: frac(2, 0.5), // 4-08 (phase)
    melting: at(3), // 4-09
    temp: frac(3, 0.38), // 4-10
    heat: frac(3, 0.7), // 4-11 (phase)
    oven: at(4), // 4-12
    thin: frac(4, 0.5), // 4-13
    like: frac(4, 0.82), // 4-14 (phase)
    few: at(5), // 4-15 (phase)
    shield: at(6), // 4-16
    foam: frac(6, 0.3), // 4-17
    reach: frac(6, 0.68), // 4-18 (phase)
    expected: at(7), // 4-19
    under: p(7, "That is a little under"),
    behind: frac(7, 0.52), // 4-20 (phase, KEY ART 2)
    panels: at(8), // 4-21
    water: frac(8, 0.6), // 4-22
    real: at(9), // 4-23
    changes: frac(9, 0.5), // 4-24 (phase)
  };
};
export type CL04 = ReturnType<typeof cuesL04>;

const SideCorona: React.FC = () => <Sky stops={["#F2A03A", "#B2287A", "#5B1E8F", "#2A0E5C", "#1B0B4F"]} angle={0} />;
const ANTON = "'Anton', sans-serif";

// ===============================================================================================================
// 4-01 … 4-04 · the mystery: a temperature strip fills upward from the gold surface line; a thermometer rises to 5,500 °C
// (ABOUT); the camera tilts up with the column through the band to 2 million °C; "?" tags pop; Tick scratches his head.
// MOVER: strip filling (14 px/f) + sparks rising through the band (18 px/f) + shimmer → column rising (20 → 40 px/f) +
// camera tilt (≈ 24 px/f) → "?" tags popping + sparks.
// ===============================================================================================================
const ShotMystery: ShotFC<CL04> = ({ f, len, c }) => {
  const s2 = c.surface - c.mystery;
  const s3 = c.corona - c.mystery;
  const s4 = c.hundreds - c.mystery;
  const colH = f < s3 ? 260 * ez(f, s2 + 4, s2 + 18) : 260 + 2240 * ez(f, s3 + 2, s3 + 56);
  const k1 = ez(f, s2 + 4, s2 + 40);
  const k2 = ez(f, s3 + 2, s3 + 56);
  const strip = Math.min(2300, 14 * f);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 600, zoom: 1.04 },
    { f: s3, x: 960, y: 540, zoom: 1.0 },
    { f: s3 + 60, x: 960, y: -760, zoom: 1.0 },
    { f: len, x: 960, y: -800, zoom: 1.04 },
  ]);
  const heat = f < s2 ? 0.2 * ez(f, 0, 20) + 0.05 : f < s3 ? 0.35 : lerp(0.35, 0.95, ez(f, s3, s3 + 50));
  const qs = [
    [760, -1000],
    [1050, -1180],
    [1500, -900],
    [620, -1250],
  ] as const;
  return (
    <Pop f={f}>
      <Stage theme={(f < s3 + 30 ? GLOW : CORONA).theme} cam={cam} vignette={0.2} grain={0.4}>
        <Layer depth={1}>
          <TallSky top={-1900} bottom={1100} stops={["#12063A", "#2A0E5C", "#5B1E8F", "#B2287A", "#C2287E", "#8E2A7E", "#F5701F"]} />
          <SunLimb f={f} cx={960} cy={3100} R={2200} />
          <Sparks f={f} n={16} speed={18} angle={-90} box={{ x: 0, y: -1800, w: 1920, h: 2700 }} r={12} seed={4} tail={150} opacity={0.9} />
          <Shimmer f={f} x={0} y={-1300} w={1920} h={2150} n={22} speed={10} opacity={0.4} />
          {/* the surface: a thin gold line */}
          <rect x={-400} y={892} width={2720} height={10} fill={C.gold} />
          {/* the temperature strip: gold at the surface, magenta-white above (the band is much hotter) */}
          <defs>
            <linearGradient id="l04strip" x1={0} y1={900} x2={0} y2={-1400} gradientUnits="userSpaceOnUse">
              <stop offset={0} stopColor={C.gold} />
              <stop offset={0.05} stopColor={C.magenta} />
              <stop offset={0.5} stopColor="#F2C6EA" />
              <stop offset={1} stopColor="#FFFFFF" />
            </linearGradient>
          </defs>
          <rect x={1660} y={-1400} width={64} height={2300} rx={14} fill={alpha(C.ink, 0.55)} />
          <rect x={1664} y={900 - strip} width={56} height={strip} rx={10} fill="url(#l04strip)" />
          <rect x={1652} y={900 - strip - 6} width={80} height={12} rx={6} fill={C.saffronCore} />
          <Thermo x={1300} y={870} h={2500} fill={colH} f={f} color={mixHex(C.amber, C.whiteGold, cl01(colH / 2500))} />
          {qs.map(([x, y], i) => (
            <QTag key={i} x={x} y={y} age={f - s4 - 6 - i * 10} size={110} f={f} />
          ))}
        </Layer>
        <Layer depth={0}>
          <g opacity={1 - ez(f, s2 - 6, s2)}>
            <Kicker x={110} y={120} text="The mystery" color={GLOW.text} size={34} />
          </g>
          <g opacity={f < s3 ? 1 : 1 - ez(f, s3, s3 + 8)}>
            <Readout x={520} y={260} text={READ.surfaceC.text} shown={`${rollText(5500, k1)} °C`} size={92} F={GLOW} opacity={ez(f, s2, s2 + 10)} />
            <AboutPill x={520} y={350} size={26} appear={ez(f, s2 + 10, s2 + 20)} />
          </g>
          <Readout x={520} y={260} text={READ.coronaC.text} shown={k2 < 1 ? `${Math.round(2000000 * k2).toLocaleString("en-US")} °C` : READ.coronaC.text} size={92} F={CORONA} opacity={f >= s3 ? ez(f, s3 + 2, s3 + 10) : 0} />
          <Tag x={1100} y={1010} text="HUNDREDS OF TIMES HOTTER" F={CORONA} dot={C.gold} size={32} align="middle" opacity={ez(f, s4 + 8, s4 + 20)} />
          <Ledge
            x={1690}
            y={960}
            f={f}
            pxPerM={84}
            facing={-1}
            pose={f < s4 ? "point" : "think"}
            staff={f < s4}
            expression={f < s4 ? "determined" : "thinking"}
            expressionTo="surprised"
            expressionT={ez(f, s4 + 30, s4 + 40)}
            look={0.9}
            headTilt={f > s4 ? Math.sin(f / 5) * 8 : -8}
          />
          <L16DialsHUD f={f} family={CORONA} theme="dark" only={["heat"]} heat={{ value: heat, pinned: f > s3 + 50, appear: ez(f, 0, 14) }} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 4-05 · studio: Tick holds up a big card, NASA's words ONE OF THE GREATEST UNANSWERED QUESTIONS; "?" marks rise off it.
// MOVER: card sliding in (≈ 21 px/f) + "?" marks rising (14 px/f) + cyc clouds.
// ===============================================================================================================
const ShotQuestion: ShotFC<CL04> = ({ f, len }) => {
  const cy = lerp(1100, 230, ez(f, 0, 40));
  return (
    <Pop f={f}>
      <Stage theme={STU.theme} shotFrame={f} drift={{ zoom: 1.08, panX: 0.02, panY: 0.01, frames: len + 30, seed: 2 }} vignette={0.12} grain={0.4}>
        <StudioSet f={f} seed={7}>
          {Array.from({ length: 9 }, (_, i) => {
            const per = 64;
            const age = f - 34 - i * 7;
            if (age < 0) return null;
            const a = age % per;
            const x = 470 + rnd(i * 5 + 1) * 980;
            return <QTag key={i} x={x} y={cy - 20 - a * 14} age={a} size={70 + rnd(i * 3) * 40} f={f} />;
          })}
          <rect x={420} y={cy + 14} width={1080} height={420} rx={26} fill="#0F3A44" opacity={0.3} />
          <rect x={410} y={cy} width={1080} height={420} rx={26} fill={C.paper} stroke={C.gold} strokeWidth={6} />
          <rect x={430} y={cy + 20} width={1040} height={380} rx={18} fill="none" stroke={alpha(C.violet, 0.6)} strokeWidth={3} />
          <Headline x={470} y={cy + 190} lines={["One of the greatest", "unanswered questions"]} size={78} color={C.ink} accent={C.magenta} />
          <SourceChip x={470} y={cy + 365} text="NASA" size={22} />
          <Tick x={960} y={940} pxPerM={150} frame={f} pose="heave" expression="determined" look={0} headTilt={-6} />
        </StudioSet>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 4-06 · corona: arrows leave the cooler surface for the hotter band, hit a barrier and bounce back (COOLER TO HOTTER:
// BLOCKED; words only, row 14). MOVER: arrow pulses bouncing (30 px/f) + barrier flashing + shimmer + wind streaks.
// ===============================================================================================================
const ShotBlocked: ShotFC<CL04> = ({ f, len }) => {
  const by = 460;
  const lanes = [700, 960, 1220];
  let hitGlow = 0;
  const arrows = lanes.map((x, i) => {
    const T = 46;
    const s = (f + i * 15) % T;
    const up = 12;
    const y = s < up ? lerp(860, by + 30, s / up) : s < up * 2 ? lerp(by + 30, 860, (s - up) / up) : 860;
    const going = s < up;
    if (s >= up && s < up + 6) hitGlow = Math.max(hitGlow, 1 - (s - up) / 6);
    return { x, y, going, show: s < up * 2 };
  });
  return (
    <Pop f={f}>
      <Stage theme={CORONA.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0.015, panY: 0.01, frames: len + 30, seed: 3 }} vignette={0.2} grain={0.4}>
        <Layer depth={0.3}>
          <Sky family={CORONA} />
        </Layer>
        <Layer depth={1}>
          <CoronaHalo f={f} cx={960} cy={2900} R={2050} extent={700} loops={4} a0={-112} a1={-68} intensity={0.85} />
          <WindStreaks f={f} cx={960} cy={2900} r0={2070} rMax={4600} a0={-125} a1={-55} speed={22} count={50} len={160} width={6} seed={5} opacity={0.6} />
          <Shimmer f={f} x={0} y={-100} w={1920} h={520} n={14} speed={10} opacity={0.45} />
          <SunLimb f={f} cx={960} cy={2900} R={2050} />
          <rect x={470} y={by - 18} width={980} height={36} rx={18} fill={mixHex(C.indigo, C.violet, 0.3)} stroke={C.gold} strokeWidth={4} />
          {Array.from({ length: 12 }, (_, i) => (
            <path key={i} d={`M${490 + i * 80} ${by + 16} l30 -32 l22 0 l-30 32 Z`} fill={C.saffron} opacity={0.75} />
          ))}
          <Bloom x={960} y={by} r={420} color={C.whiteGold} strength={0.55 * hitGlow} squash={3} />
          {arrows.map((a, i) =>
            a.show ? (
              <Arrow key={i} x1={a.x} y1={a.going ? a.y + 170 : a.y - 170} x2={a.x} y2={a.y} color={a.going ? C.gold : C.amber} w={22} head={56} />
            ) : null,
          )}
          <text x={110} y={960} style={{ fontFamily: ANTON, fontSize: 40, letterSpacing: 4, fill: C.ink }}>
            COOLER · THE SURFACE
          </text>
          <text x={110} y={190} style={{ fontFamily: ANTON, fontSize: 40, letterSpacing: 4, fill: C.whiteGold }}>
            HOTTER · THE CORONA
          </text>
        </Layer>
        <Layer depth={0}>
          <Tag x={1810} y={110} text="COOLER TO HOTTER: BLOCKED" F={CORONA} dot={C.gold} size={32} align="end" opacity={ez(f, 16, 28)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 4-07 + 4-08 · a few big bright sparks stream past the probe; the HEAT needle swings high, the probe does not flinch (F8);
// then the probe drifts on through the band and data packets drop from it into a notebook.
// MOVER: sparks streaming (22 px/f) + HEAT needle → data packets falling (20 px/f) + the probe moving + sparks.
// ===============================================================================================================
const ShotDoomed: ShotFC<CL04> = ({ f, len, c }) => {
  const ph = c.hoped - c.doomed;
  const g = Math.max(0, f - ph);
  const px = 1080 + 5 * g;
  const py = 430 + Math.sin(f / 15) * 6;
  const nb = { x: 1180, y: 780, w: 460, h: 230 };
  const written = Math.min(6, Math.floor(g / 14));
  return (
    <Pop f={f}>
      <Stage theme={CORONA.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.015, panY: 0.008, frames: len + 30, seed: 4 }} vignette={0.22} grain={0.4}>
        <Layer depth={0.2}>
          <SideCorona />
        </Layer>
        <Layer depth={1}>
          <SideSun f={f} edge={-160} y={540} R={2600} granules={false} />
          <Sparks f={f} n={14} speed={22} angle={0} r={15} seed={7} tail={170} />
          <Probe x={px} y={py} size={300} f={f} />
          {f >= ph
            ? Array.from({ length: 6 }, (_, i) => {
                const age = g - 6 - i * 14;
                if (age < 0) return null;
                const a = age % 84;
                const sx = px + 20;
                const sy = py + 80;
                const tx = nb.x + 80 + (i % 3) * 120;
                const ty = nb.y + 40;
                const u = cl01((a * 20) / Math.max(1, ty - sy));
                if (u >= 1) return null;
                return <rect key={i} x={lerp(sx, tx, u) - 16} y={lerp(sy, ty, u) - 16} width={32} height={32} rx={6} fill={i % 2 ? C.cyan : C.stampGreen} stroke={C.paper} strokeWidth={3} transform={`rotate(${a * 6} ${lerp(sx, tx, u)} ${lerp(sy, ty, u)})`} />;
              })
            : null}
        </Layer>
        <Layer depth={0}>
          {f >= ph - 10 ? (
            <g opacity={ez(f, ph - 10, ph + 6)} transform={`translate(0 ${(1 - ez(f, ph - 10, ph + 6)) * 200})`}>
              <rect x={nb.x + 8} y={nb.y + 12} width={nb.w} height={nb.h} rx={14} fill="#000" opacity={0.25} />
              <rect x={nb.x} y={nb.y} width={nb.w / 2 - 4} height={nb.h} rx={12} fill={C.paper} stroke={C.ink} strokeWidth={3} />
              <rect x={nb.x + nb.w / 2 + 4} y={nb.y} width={nb.w / 2 - 4} height={nb.h} rx={12} fill={C.paper} stroke={C.ink} strokeWidth={3} />
              {Array.from({ length: 6 }, (_, i) => (
                <rect key={i} x={nb.x + (i < 3 ? 24 : nb.w / 2 + 28)} y={nb.y + 46 + (i % 3) * 58} width={i < written ? 170 : 0} height={12} rx={6} fill={i % 2 ? C.violet : C.tealDeep} />
              ))}
              <text x={nb.x + nb.w / 2} y={nb.y - 18} textAnchor="middle" style={{ fontFamily: ANTON, fontSize: 26, letterSpacing: 3, fill: C.paper }}>
                MEASURED FROM INSIDE
              </text>
            </g>
          ) : null}
          <L16DialsHUD f={f} family={CORONA} only={["heat"]} heat={{ value: lerp(0.3, 0.92, ez(f, 8, 46)), pinned: f > 46 }} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 4-09 · the probe in the band, shield to the Sun; sparks hit the shield and bounce off; a big "?" (WHY ISN'T IT MELTING?).
// MOVER: sparks flying in (22 px/f) and bouncing off + small bursts + "?" pulsing.
// ===============================================================================================================
const ShotMelting: ShotFC<CL04> = ({ f, len }) => {
  const px = 1250;
  const py = 610;
  const L = 420;
  const sx = px - L * 0.3 - 18;
  const sparks = Array.from({ length: 12 }, (_, i) => {
    const T = 70;
    const s = (rnd(i * 9 + 2) * T + f) % T;
    const y0 = py - 300 + rnd(i * 5 + 3) * 600;
    const tin = (sx + 100) / 22;
    if (s < tin) return { x: -100 + 22 * s, y: y0, age: -1, k: i };
    const b = s - tin;
    return { x: sx - 14 * b, y: y0 + (y0 < py ? -1 : 1) * 10 * b, age: b, k: i };
  });
  return (
    <Pop f={f}>
      <Stage theme={CORONA.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0.015, panY: 0.01, frames: len + 30, seed: 5 }} vignette={0.22} grain={0.4}>
        <Layer depth={0.2}>
          <SideCorona />
        </Layer>
        <Layer depth={1}>
          <SideSun f={f} edge={-200} y={560} R={2600} granules={false} />
          <Bloom x={sx} y={py} r={300} color={C.shieldRim} strength={0.4} squash={0.6} />
          <Probe x={px} y={py} size={L} f={f} />
          {sparks.map((q) => (
            <g key={q.k} opacity={q.age < 0 ? 1 : Math.max(0, 1 - q.age / 26)}>
              <circle cx={q.x} cy={q.y} r={26} fill={alpha(C.amber, 0.3)} />
              <circle cx={q.x} cy={q.y} r={14} fill={C.whiteGold} />
            </g>
          ))}
          {sparks.map((q) => (q.age >= 0 && q.age < 10 ? <Burst key={"b" + q.k} x={sx} y={q.y} age={q.age} n={8} speed={12} life={10} r={6} seed={q.k} /> : null))}
        </Layer>
        <Layer depth={0}>
          <Headline x={110} y={200} lines={["Why isn't it melting?"]} size={84} color={CORONA.text} accent={C.gold} />
          <QTag x={1580} y={220} age={f - 6} size={170} f={f} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 4-10 + 4-11 · studio: a glass box of dots whizzing beside a speedometer (TEMPERATURE: HOW FAST); slide: a second box where
// many slow dots each hand a glowing packet to a block and a TOTAL bar fills (HEAT: TOTAL ENERGY PASSED ON).
// MOVER: dots whizzing (24 px/f) + needle → the slide (≈ 110 px/f for 16 f) → packets travelling (20 px/f) + bar filling.
// ===============================================================================================================
const ShotTemp: ShotFC<CL04> = ({ f, len, c }) => {
  const ph = c.heat - c.temp;
  const g = f - ph;
  const sl = ez(g, 0, 16);
  const ax = -1900 * sl;
  const bx = 1900 * (1 - sl);
  const box = { x: 300, y: 220, w: 760, h: 470 };
  const wall = box.x + box.w - 70;
  return (
    <Pop f={f}>
      <Stage theme={STU.theme} shotFrame={f} drift={{ zoom: 1.07, panX: 0.02, panY: 0.01, frames: len + 30, seed: 6 }} vignette={0.12} grain={0.4}>
        <StudioSet f={f} seed={3}>
          <g transform={`translate(${ax} 0)`}>
            <rect x={380} y={230} width={700} height={500} rx={24} fill="#16606A" stroke={C.gold} strokeWidth={5} />
            <GlassBox x={420} y={270} w={620} h={420} f={f} n={14} speed={24} dot={20} color={C.gold} seed={4} />
            <Speedo x={1430} y={480} r={190} v={0.82} f={f} />
          </g>
          {g >= 0 ? (
            <g transform={`translate(${bx} 0)`}>
              <rect x={box.x - 40} y={box.y - 40} width={box.w + 80} height={box.h + 80} rx={24} fill="#16606A" stroke={C.gold} strokeWidth={5} />
              <GlassBox x={box.x} y={box.y} w={box.w} h={box.h} f={f} n={46} speed={5} dot={13} color={C.whiteGold} seed={8} />
              <rect x={wall} y={box.y + 10} width={56} height={box.h - 20} rx={10} fill={C.violet} stroke={C.paper} strokeWidth={3} />
              {Array.from({ length: 10 }, (_, i) => {
                const T = 50;
                const s = (rnd(i * 3 + 1) * T + g) % T;
                const x0 = box.x + 40 + rnd(i * 7 + 2) * (wall - box.x - 120);
                const y0 = box.y + 40 + rnd(i * 11 + 3) * (box.h - 80);
                const x = Math.min(wall, x0 + 20 * s);
                if (x >= wall) return null;
                return (
                  <g key={i}>
                    <Bloom x={x} y={y0} r={40} color={C.amber} strength={0.8} />
                    <rect x={x - 12} y={y0 - 12} width={24} height={24} rx={5} fill={C.amber} stroke={C.paper} strokeWidth={2} />
                  </g>
                );
              })}
              <rect x={1330} y={box.y} width={90} height={box.h} rx={20} fill={alpha(C.ink, 0.6)} stroke={C.paper} strokeWidth={4} />
              <rect x={1340} y={box.y + box.h - 10 - (box.h - 20) * ez(g, 10, 60)} width={70} height={(box.h - 20) * ez(g, 10, 60)} rx={14} fill={C.amber} />
              <text x={1375} y={box.y + box.h + 50} textAnchor="middle" style={{ fontFamily: ANTON, fontSize: 30, letterSpacing: 3, fill: STU.text }}>
                TOTAL
              </text>
            </g>
          ) : null}
        </StudioSet>
        <Layer depth={0}>
          <Tag x={960} y={830} text="TEMPERATURE: HOW FAST" F={STU} dot={C.gold} size={34} align="middle" opacity={ez(f, 10, 22) * (1 - ez(g, 0, 8))} />
          <Tag x={960} y={830} text="HEAT: TOTAL ENERGY PASSED ON" F={STU} dot={C.amber} size={34} align="middle" opacity={g >= 0 ? ez(g, 14, 26) : 0} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 4-12 · NASA's comparison: two cutaway cards, HOT OVEN (few fast dots in thin hot air) and BOILING WATER (dense dots,
// bubbles); an inert outline hand above each (F1). Tick points at the oven, then the pot.
// MOVER: cards sliding in + oven dots (20-22 px/f) + pot bubbles rising + Tick turning.
// ===============================================================================================================
const OVEN = { x: 300, y: 300, w: 560 };
const POT = { x: 1060, y: 300, w: 560 };
const Cards: React.FC<{ f: number; inA?: number; inB?: number }> = ({ f, inA = 1, inB = 1 }) => {
  const ox = lerp(-800, OVEN.x, inA);
  const pxx = lerp(2100, POT.x, inB);
  return (
    <g>
      <Oven x={ox} y={OVEN.y} w={OVEN.w} f={f} />
      <GlassBox x={ox + OVEN.w * 0.1 + 6} y={OVEN.y + 76} w={OVEN.w * 0.8 - 12} h={OVEN.w * 0.9 - 122} f={f} n={5} speed={22} dot={17} color={C.whiteGold} seed={12} frame={false} />
      <Pot x={pxx} y={POT.y} w={POT.w} f={f} />
      {Array.from({ length: 5 }, (_, i) => {
        const iw = POT.w * 0.72;
        const ih = POT.w * 0.9 - 120;
        const bxx = pxx + POT.w * 0.14 + 40 + (i / 5) * (iw - 80);
        const byy = POT.y + 80 + ih - (((f * 12 + rnd(i * 3 + 7) * ih) % (ih - 20)) + 10);
        return <circle key={i} cx={bxx} cy={byy} r={14 + rnd(i) * 6} fill="none" stroke="#E8FBFF" strokeWidth={4} />;
      })}
      {[ox + OVEN.w / 2, pxx + POT.w / 2].map((hx, i) => (
        <circle key={i} cx={hx} cy={OVEN.y - 108} r={84} fill={C.paper} stroke={C.gold} strokeWidth={4} />
      ))}
      <HandIcon x={ox + OVEN.w / 2} y={OVEN.y - 110} size={120} />
      <HandIcon x={pxx + POT.w / 2} y={POT.y - 110} size={120} flip />
    </g>
  );
};
const ShotOven: ShotFC<CL04> = ({ f, len }) => {
  const toPot = ez(f, 70, 84);
  return (
    <Pop f={f}>
      <Stage theme={STU.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.02, panY: 0.008, frames: len + 30, seed: 7 }} vignette={0.12} grain={0.4}>
        <StudioSet f={f} seed={5} floor={900}>
          <Cards f={f} inA={ez(f, 0, 14)} inB={ez(f, 6, 20)} />
          <Tick x={1790} y={975} pxPerM={120} frame={f} facing={-1} pose="point" staff expression="happy" look={lerp(0.2, 0.9, toPot)} headTilt={lerp(-4, 6, toPot)} tilt={lerp(-6, 4, toPot)} />
        </StudioSet>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 4-13 + 4-14 + 4-15 · a warmth bar grows beside each card (oven short, water tall: words, no numbers); the camera dives
// into the oven card and comes out in the corona's thin gas; close on the shield face, a few big particles arrive and each
// bump makes a small spark (VERY FEW PARTICLES).
// MOVER: bars growing (10 / 28 px/f) + push → match-cut zoom (scale ×7 in 30 f) + sparks → particles flying in (24 px/f)
// + spark bursts.
// ===============================================================================================================
const ShotThin: ShotFC<CL04> = ({ f, len, c }) => {
  const p2 = c.like - c.thin;
  const p3 = c.few - c.thin;
  const g2 = f - p2;
  const g3 = f - p3;
  const zoomK = g2 >= 0 ? Math.exp(Math.log(7) * ez(g2, 0, 30)) : 1;
  const ovC: Pt = [OVEN.x + OVEN.w / 2, OVEN.y + 70 + (OVEN.w * 0.9 - 110) / 2];
  const ob = 110 * ez(f, 6, 18);
  const wb = 420 * ez(f, 6, 22);
  const corona = g2 >= 0 ? ez(g2, 12, 30) : 0;
  const PX = 1380;
  const L = 900;
  const shX = PX - L * 0.3 - 30;
  const parts = Array.from({ length: 6 }, (_, i) => {
    const T = 62;
    const s = (g3 + rnd(i * 7 + 4) * T) % T;
    const y = 200 + rnd(i * 5 + 9) * 680;
    const tin = (shX + 80) / 24;
    return { x: -80 + 24 * s, y, hit: s - tin, k: i };
  });
  return (
    <>
      {g3 < 8 ? (
        <AbsoluteFill style={{ transform: `scale(${zoomK.toFixed(3)})`, transformOrigin: `${((ovC[0] / 1920) * 100).toFixed(2)}% ${((ovC[1] / 1080) * 100).toFixed(2)}%` }}>
          <Stage theme={STU.theme} cam={cameraAt(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: p2, x: 900, y: 560, zoom: 1.08 }])} vignette={0.12} grain={0.4}>
            <StudioSet f={f} seed={5} floor={900}>
              <Cards f={f} />
              {[
                [OVEN.x + OVEN.w + 40, ob],
                [POT.x + POT.w + 40, wb],
              ].map(([x, h], i) => (
                <g key={i}>
                  <rect x={x} y={820 - 430} width={54} height={430} rx={14} fill={alpha(C.ink, 0.45)} />
                  <rect x={x + 6} y={820 - 6 - h} width={42} height={h} rx={10} fill={i ? C.amber : mixHex(C.cyan, C.amber, 0.4)} />
                  <text x={x + 27} y={860} textAnchor="middle" style={{ fontFamily: ANTON, fontSize: 24, letterSpacing: 2, fill: STU.text }}>
                    WARMTH
                  </text>
                </g>
              ))}
            </StudioSet>
          </Stage>
        </AbsoluteFill>
      ) : null}
      {g2 >= 0 ? (
        <AbsoluteFill style={{ opacity: corona }}>
          <Stage theme={CORONA.theme} shotFrame={Math.max(0, g3)} drift={{ zoom: 1.05, panX: 0.01, panY: 0.01, frames: len - p3 + 30, seed: 8 }} vignette={0.22} grain={0.4}>
            <Layer depth={0.2}>
              <SideCorona />
            </Layer>
            <Layer depth={1}>
              {g3 < 0 ? (
                <Sparks f={f} n={9} speed={18} angle={0} r={14} seed={11} />
              ) : (
                <g>
                  <SideSun f={f} edge={-220} y={540} R={2600} granules={false} />
                  <Bloom x={shX} y={540} r={420} color={C.shieldRim} strength={0.45} squash={0.5} />
                  <Probe x={PX} y={540} size={L} f={f} lamp={false} />
                  {parts.map((q) =>
                    q.hit < 0 ? (
                      <g key={q.k}>
                        <circle cx={q.x} cy={q.y} r={30} fill={alpha(C.amber, 0.3)} />
                        <circle cx={q.x} cy={q.y} r={17} fill={C.whiteGold} />
                      </g>
                    ) : (
                      <Burst key={q.k} x={shX} y={q.y} age={q.hit} n={10} speed={9} life={14} r={7} seed={q.k + 3} />
                    ),
                  )}
                </g>
              )}
            </Layer>
            <Layer depth={0}>
              <Tag x={110} y={130} text="VERY FEW PARTICLES" F={CORONA} dot={C.whiteGold} size={36} opacity={g3 >= 0 ? ez(g3, 10, 22) : 0} />
            </Layer>
          </Stage>
        </AbsoluteFill>
      ) : null}
    </>
  );
};

// ===============================================================================================================
// 4-16 · the probe swings its shield to the Sun and the shield comes up large. MOVER: the probe turning and growing (≈ 20
// px/f at the rim) + wind streaks from the left (22 px/f).
// ===============================================================================================================
const ShotSwing: ShotFC<CL04> = ({ f, len }) => {
  const k = ez(f, 2, 34);
  return (
    <Pop f={f}>
      <Stage theme={CORONA.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.01, panY: 0.01, frames: len + 30, seed: 9 }} vignette={0.22} grain={0.4}>
        <Layer depth={0.2}>
          <SideCorona />
        </Layer>
        <Layer depth={1}>
          <SideSun f={f} edge={-180} y={540} R={2600} granules={false} />
          <WindStreaks f={f} cx={-2780} cy={540} r0={2620} rMax={5200} a0={-16} a1={16} speed={22} count={70} len={180} width={7} seed={17} />
          <Bloom x={lerp(1240, 960, k)} y={540} r={lerp(200, 480, k)} color={C.shieldRim} strength={0.2 + 0.3 * k} squash={0.6} />
          <Probe x={lerp(1250, 1180, k)} y={lerp(600, 540, k)} size={lerp(260, 640, k)} f={f} tilt={lerp(-75, 0, k)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 4-17 + 4-18 · studio: the shield in exploded cutaway, two CARBON PLATEs and the CARBON FOAM between, Tick pulling them
// apart; then close on the corona side of the face: an amber heat front crosses it (F8: amber, never red): 2,500 °F ·
// about 1,400 °C, NASA SAYS CAN REACH.
// MOVER: shield sliding in (≈ 70 px/f) + layers apart + leaders drawing → heat front crossing the face (16 px/f) + counter
// + wind streaks into the face.
// ===============================================================================================================
/** The shield seen face-on from the Sun's side: a carbon disc; `front` 0..1 = how far an amber heat front has crossed it
 *  (left → right); `bands` drift across it at `drift` px/f once warm. */
const ShieldFace: React.FC<{ f: number; cx: number; cy: number; rx: number; ry: number; front: number; drift?: number }> = ({ f, cx, cy, rx, ry, front, drift = 0 }) => {
  const x0 = cx - rx;
  const fx = x0 + 2 * rx * cl01(front);
  return (
    <g>
      <defs>
        <clipPath id="l04face">
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} />
        </clipPath>
        <linearGradient id="l04front" x1={0} y1={0} x2={1} y2={0}>
          <stop offset={0} stopColor={C.tangerine} />
          <stop offset={0.6} stopColor={C.amber} />
          <stop offset={1} stopColor={C.gold} />
        </linearGradient>
      </defs>
      <ellipse cx={cx + 18} cy={cy + 24} rx={rx} ry={ry} fill="#0B0828" opacity={0.5} />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={C.shield} stroke={C.shieldRim} strokeWidth={8} />
      <g clipPath="url(#l04face)">
        <rect x={x0} y={cy - ry} width={Math.max(0, fx - x0)} height={2 * ry} fill="url(#l04front)" opacity={0.9} />
        {front > 0 && front < 1 ? <rect x={fx - 10} y={cy - ry} width={20} height={2 * ry} fill={C.whiteGold} opacity={0.85} /> : null}
        {drift > 0
          ? Array.from({ length: 7 }, (_, i) => {
              const bx = x0 + (((i * 2 * rx) / 7 - f * drift) % (2 * rx) + 2 * rx) % (2 * rx);
              return <rect key={i} x={bx} y={cy - ry} width={46} height={2 * ry} fill={i % 2 ? C.gold : C.tangerine} opacity={0.35} />;
            })
          : null}
        {Array.from({ length: 9 }, (_, i) => (
          <line key={"h" + i} x1={x0} y1={cy - ry + ((i + 1) * 2 * ry) / 10} x2={cx + rx} y2={cy - ry + ((i + 1) * 2 * ry) / 10} stroke={alpha(C.ink, 0.25)} strokeWidth={2} />
        ))}
      </g>
      <Bloom x={cx} y={cy} r={Math.max(rx, ry) * 1.3} color={C.amber} strength={0.35 * cl01(front)} />
    </g>
  );
};
const ShotFoam: ShotFC<CL04> = ({ f, len, c }) => {
  const ph = c.reach - c.foam;
  const g = f - ph;
  const sx = lerp(2300, 900, ez(f, 0, 20));
  const ex = ez(f, 20, 50);
  const lead = lin(f, 46, 70);
  const front = ez(g, 4, 64);
  const kf = ez(g, 6, 50);
  return (
    <>
      <Pop f={f}>
        <Stage theme={STU.theme} shotFrame={f} drift={{ zoom: 1.08, panX: 0.015, panY: 0.01, frames: len + 30, seed: 10 }} vignette={0.12} grain={0.4}>
          <StudioSet f={f} seed={9}>
            <Shield x={sx} y={500} size={540} f={f} explode={ex} />
            <path d={`M${sx - 190} ${360} L${lerp(sx - 190, 520, lead)} ${lerp(360, 220, lead)}`} stroke={C.ink} strokeWidth={4} fill="none" opacity={lead > 0 ? 1 : 0} />
            <path d={`M${sx} ${640} L${lerp(sx, 1260, lead)} ${lerp(640, 820, lead)}`} stroke={C.ink} strokeWidth={4} fill="none" opacity={lead > 0 ? 1 : 0} />
            <Tick x={lerp(1420, 1520, ex)} y={940} pxPerM={130} frame={f} facing={-1} pose="crouch-reach" expression="surprised" look={0.7} headTilt={-8} />
          </StudioSet>
          <Layer depth={0}>
            <Tag x={520} y={190} text="CARBON PLATE" F={STU} dot={C.violet} size={32} align="end" opacity={ez(f, 64, 74)} />
            <Tag x={1100} y={840} text="CARBON FOAM" F={STU} dot={C.lavender} size={32} opacity={ez(f, 66, 76)} />
          </Layer>
        </Stage>
      </Pop>
      {g >= 0 ? (
        <AbsoluteFill style={{ opacity: ez(g, 0, 10) }}>
          <Stage theme={CORONA.theme} shotFrame={g} drift={{ zoom: 1.06, panX: 0.01, panY: 0.01, frames: len - ph + 30, seed: 11 }} vignette={0.22} grain={0.4}>
            <Layer depth={0.2}>
              <SideCorona />
            </Layer>
            <Layer depth={1}>
              <WindStreaks f={g} mode="sweep" angle={0} box={{ x: -200, y: 60, w: 1350, h: 960 }} speed={22} count={50} len={180} width={6} seed={19} opacity={0.75} />
              <ShieldFace f={g} cx={1420} cy={540} rx={330} ry={420} front={front} />
            </Layer>
            <Layer depth={0}>
              <Readout x={140} y={300} text={`${READ.shieldF.text} · ${READ.shieldC.text}`} shown={kf < 1 ? `${rollText(2500, kf)} °F` : `${READ.shieldF.text} · ${READ.shieldC.text}`} size={66} F={CORONA} opacity={ez(g, 4, 14)} />
              <SayPill x={140} y={400} kind="NASA SAYS CAN REACH" size={26} appear={ez(g, 14, 24)} />
            </Layer>
          </Stage>
        </AbsoluteFill>
      ) : null}
    </>
  );
};

// ===============================================================================================================
// 4-19 + 4-20 · the face's reading for the December 2024 pass: 1,800 °F (EXPECTED), flipping in "under 1,000 °C"; Tick reads
// it, then lifts a finger. Push behind the shield into the calm dark pocket (KEY ART 2): the amber rim, wind streaks
// bending round the shield's edges, the instrument box with its small green glow, the HEAT needle at the middle; 85 °F ·
// about 30 °C, NASA SAYS. Tick peeks in from the edge, pleased.
// MOVER: heat bands drifting (14 px/f) + the readout flip (≈ 30 px/f) + wind → streaks bending round the shield (22 px/f) +
// shimmer off the shield (12 px/f). DARK (shade, darker than the family sky so the frame reads V < 0.3).
// ===============================================================================================================
const ShotExpected: ShotFC<CL04> = ({ f, len, c }) => {
  const ph = c.behind - c.expected;
  const un = c.under - c.expected;
  const g = f - ph;
  const kF = ez(f, 6, 46);
  const flipA = f - un;
  const flipS = flipA < 0 ? 0 : Math.abs(Math.cos(Math.min(1, flipA / 12) * (Math.PI / 2) + Math.PI / 2));
  const sh = { x: 640, w: 64, cy: 540, h: 600 };
  const box = { x: 1010, y: 430, w: 320, h: 210 };
  return (
    <>
      <Pop f={f}>
        <Stage theme={CORONA.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.012, panY: 0.008, frames: len + 30, seed: 12 }} vignette={0.22} grain={0.4}>
          <Layer depth={0.2}>
            <SideCorona />
          </Layer>
          <Layer depth={1}>
            <WindStreaks f={f} mode="sweep" angle={0} box={{ x: -200, y: 60, w: 1180, h: 960 }} speed={22} count={50} len={180} width={6} seed={21} opacity={0.75} />
            <ShieldFace f={f} cx={1250} cy={520} rx={300} ry={380} front={1} drift={14} />
          </Layer>
          <Layer depth={0}>
            <Readout x={140} y={290} text={READ.shieldBackF.text} shown={`${rollText(1800, kF)} °F`} size={88} F={CORONA} opacity={ez(f, 4, 12)} />
            <Readout x={140} y={430} text={`${fToC(1800) /* #13 */} °C`} size={70} F={CORONA} opacity={flipA >= 0 ? 1 : 0} scaleY={flipS} />
            <SayPill x={140} y={530} kind="EXPECTED" size={26} appear={ez(f, 20, 32)} />
            <Ledge
              x={1740}
              y={950}
              f={f}
              pxPerM={84}
              facing={-1}
              pose={f < un ? "think" : "point"}
              expression={f < un ? "thinking" : "determined"}
              look={0.6}
              headTilt={Math.sin(f / 9) * 5}
            />
          </Layer>
        </Stage>
      </Pop>
      {g >= 0 ? (
        <AbsoluteFill style={{ opacity: ez(g, 0, 14) }}>
          <Stage theme={SHADE.theme} cam={cameraAt(g, [{ f: 0, x: 900, y: 540, zoom: 1.18 }, { f: 40, x: 960, y: 540, zoom: 1.02 }, { f: len - ph, x: 980, y: 545, zoom: 1.06 }])} vignette={0.3} grain={0.4}>
            <Layer depth={0.2}>
              <Sky stops={["#05041A", "#0B0A33", "#140C44"]} />
            </Layer>
            <Layer depth={1}>
              {/* the Sun side: a warm wash at the far left only */}
              <Bloom x={-200} y={540} r={700} color={C.amber} strength={0.3} />
              <BendStreaks f={g} sx={sh.x} cy={sh.cy} h={sh.h} speed={22} n={72} seed={7} />
              <Shimmer f={g} x={sh.x - 120} y={sh.cy - sh.h / 2} w={110} h={sh.h} n={8} speed={12} color={C.gold} opacity={0.6} len={150} width={5} />
              {/* the calm pocket behind the shield */}
              <path d={`M${sh.x + sh.w} ${sh.cy - sh.h / 2 + 10} L1700 ${sh.cy - 200} L1700 ${sh.cy + 200} L${sh.x + sh.w} ${sh.cy + sh.h / 2 - 10} Z`} fill="#06051E" opacity={0.7} />
              <path d={`M${sh.x + sh.w + 40} 400 L1520 400 L1570 470 L1570 610 L1520 680 L${sh.x + sh.w + 40} 680 Z`} fill="none" stroke={alpha(C.teal, 0.55)} strokeWidth={4} strokeDasharray="12 10" />
              {/* the shield, edge-on: carbon with the amber rim on its sunward face */}
              <rect x={sh.x} y={sh.cy - sh.h / 2} width={sh.w} height={sh.h} rx={14} fill={C.shield} />
              <rect x={sh.x - 6} y={sh.cy - sh.h / 2} width={14} height={sh.h} rx={7} fill={C.shieldRim} />
              <Bloom x={sh.x} y={sh.cy} r={340} color={C.shieldRim} strength={0.5 + 0.08 * Math.sin(g / 6)} squash={0.35} />
              {/* the instrument box: teal, a small green glow */}
              <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={22} fill={C.tealDeep} stroke={C.teal} strokeWidth={5} />
              <rect x={box.x + 26} y={box.y + 26} width={170} height={100} rx={10} fill="#06202A" stroke={alpha(C.teal, 0.8)} strokeWidth={3} />
              {Array.from({ length: 4 }, (_, i) => (
                <rect key={i} x={box.x + 40} y={box.y + 44 + i * 20} width={60 + 70 * Math.abs(Math.sin(g / 9 + i))} height={8} rx={4} fill={C.instrument} opacity={0.85} />
              ))}
              <Bloom x={box.x + 255} y={box.y + 70} r={170} color={C.instrument} strength={0.65 + 0.2 * Math.sin(g / 7)} />
              <circle cx={box.x + 255} cy={box.y + 70} r={18} fill={C.instrument} stroke="#BFFFD8" strokeWidth={3} />
              <text x={box.x + box.w / 2} y={box.y + box.h + 46} textAnchor="middle" style={{ fontFamily: ANTON, fontSize: 26, letterSpacing: 3, fill: C.teal }}>
                INSTRUMENTS
              </text>
            </Layer>
            <Layer depth={0}>
              <Readout x={1040} y={210} text={`${READ.insideF.text} · ${READ.insideC.text}`} shown={g < 30 ? `${rollText(85, ez(g, 6, 30))} °F` : `${READ.insideF.text} · ${READ.insideC.text}`} size={74} F={SHADE} opacity={ez(g, 6, 16)} color="#FFF4E0" />
              <SayPill x={1040} y={300} kind="NASA SAYS" size={26} appear={ez(g, 16, 28)} />
              <g transform={`translate(${lerp(140, 0, ez(g, 20, 40))} 0)`}>
                <Tick x={1820} y={1010} pxPerM={110} frame={g} facing={-1} pose="lean" expression="happy" look={0.4} headTilt={Math.sin(g / 12) * 6} />
              </g>
              <L16DialsHUD f={g} family={SHADE} only={["heat"]} heat={{ value: 0.5 + 0.03 * Math.sin(g / 10) }} />
            </Layer>
          </Stage>
        </AbsoluteFill>
      ) : null}
    </>
  );
};

// ===============================================================================================================
// 4-21 · dark space behind the shield: the two solar wings fold back into its shadow; the thin edge still in the light
// glows amber and shimmers. MOVER: wings folding (≈ 4-6 px/f at the tips, large panels) + streaks bending round the shield
// (22 px/f) + heat shimmer off the exposed edge (10 px/f). DARK.
// ===============================================================================================================
const ShotPanels: ShotFC<CL04> = ({ f, len }) => {
  const fold = ez(f, 10, 140);
  const sh = { x: 600, w: 60, cy: 540, h: 540 };
  const S = 720;
  const ang = (20 + 62 * fold) * (Math.PI / 180);
  // the outer edge of the upper wing (mirrored: wings swing back to the RIGHT, into the shadow)
  const ex = 900 + Math.sin(ang) * S * 0.42;
  const ey = 540 - Math.cos(ang) * S * 0.42;
  return (
    <Pop f={f}>
      <Stage theme={SPACE.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0.012, panY: 0.008, frames: len + 30, seed: 13 }} vignette={0.28} grain={0.4}>
        <Layer depth={0.3}>
          <SpaceField f={f} seed={11} />
        </Layer>
        <Layer depth={1}>
          <Bloom x={-150} y={540} r={650} color={C.amber} strength={0.35} />
          <BendStreaks f={f} sx={sh.x} cy={sh.cy} h={sh.h} speed={22} n={60} seed={9} opacity={0.8} />
          <g transform="translate(1800 0) scale(-1 1)">
            <Panels x={900} y={540} size={S} f={f} fold={fold} />
          </g>
          {/* the probe body behind the shield */}
          <path d={`M${sh.x + sh.w} 470 L1150 470 L1190 510 L1190 570 L1150 610 L${sh.x + sh.w} 610 Z`} fill={C.teal} stroke="#0E1830" strokeWidth={4} />
          <rect x={sh.x + sh.w} y={500} width={80} height={80} fill={C.probeNose} />
          <rect x={sh.x} y={sh.cy - sh.h / 2} width={sh.w} height={sh.h} rx={14} fill={C.shield} />
          <rect x={sh.x - 6} y={sh.cy - sh.h / 2} width={14} height={sh.h} rx={7} fill={C.shieldRim} />
          <Bloom x={sh.x} y={sh.cy} r={300} color={C.shieldRim} strength={0.45} squash={0.35} />
          {/* the small edge left in the light */}
          {[1, -1].map((s) => (
            <g key={s}>
              <Bloom x={ex} y={s > 0 ? ey : 1080 - ey} r={90} color={C.amber} strength={0.75} />
              <circle cx={ex} cy={s > 0 ? ey : 1080 - ey} r={12} fill={C.gold} />
            </g>
          ))}
          <Shimmer f={f} x={ex - 70} y={ey - 260} w={140} h={240} n={6} speed={10} color={C.gold} opacity={0.65} len={120} width={5} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 4-22 · studio: a blue water loop on a plate; bright dots flow round it and amber heat packets ride from the hot side (the
// panels) to the radiator and come back cool (A LOOP OF WATER). Tick follows a dot with the staff.
// MOVER: water dots (18 px/f) + heat packets (14 px/f) + Tick's look.
// ===============================================================================================================
const ShotWater: ShotFC<CL04> = ({ f, len }) => {
  const L = { x: 440, y: 250, w: 1040, h: 420 };
  const per = loopPer(L.w, L.h);
  return (
    <Pop f={f}>
      <Stage theme={STU.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0.02, panY: 0.01, frames: len + 30, seed: 14 }} vignette={0.12} grain={0.4}>
        <StudioSet f={f} seed={11}>
          <rect x={300} y={140} width={1320} height={640} rx={30} fill="#16606A" stroke={C.gold} strokeWidth={5} />
          <rect x={318} y={158} width={1284} height={604} rx={22} fill="none" stroke={alpha(C.violet, 0.7)} strokeWidth={3} />
          <rect x={360} y={320} width={70} height={280} rx={8} fill="#2B4FB8" stroke={C.cyan} strokeWidth={3} />
          <text x={395} y={300} textAnchor="middle" style={{ fontFamily: ANTON, fontSize: 24, letterSpacing: 2, fill: C.paper }}>
            PANEL
          </text>
          <WaterLoop x={L.x} y={L.y} w={L.w} h={L.h} f={f} speed={18} n={18} />
          {Array.from({ length: 4 }, (_, i) => {
            const s = f * 14 + (i * per) / 4;
            const [x, y] = loopAt(L.x, L.y, L.w, L.h, s);
            const u = (((s % per) + per) % per) / per;
            const hot = Math.sin(u * Math.PI * 2 + Math.PI) * 0.5 + 0.5;
            return (
              <g key={i}>
                <Bloom x={x} y={y} r={70} color={hot > 0.4 ? C.amber : C.cyan} strength={0.8} />
                <circle cx={x} cy={y} r={22} fill={mixHex(C.cyan, C.amber, hot)} stroke={C.paper} strokeWidth={4} />
              </g>
            );
          })}
          <text x={L.x + L.w + 50} y={L.y + L.h / 2 + 10} style={{ fontFamily: ANTON, fontSize: 26, letterSpacing: 2, fill: C.paper }}>
            RADIATOR
          </text>
          <Tick x={1780} y={940} pxPerM={120} frame={f} facing={-1} pose="point" staff expression="happy" look={0.5 + 0.4 * Math.sin(f / 14)} headTilt={Math.sin(f / 14) * 10} />
        </StudioSet>
        <Layer depth={0}>
          <Tag x={960} y={850} text="A LOOP OF WATER" F={STU} dot={C.cyan} size={36} align="middle" opacity={ez(f, 14, 26)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 4-23 + 4-24 · space: the flight path draws on and the green MEASURED stamp slams on it (F2: the path only); then the
// stamp in Tick's hand turns from green to blue, and beyond the path's end a dashed line runs on toward the limb where a
// blue SEEN FROM AFAR outline waits. MOVER: path drawing head (30 px/f) + stamp slam → stamp flipping (13°/f) + dashed
// line drawing (30 px/f) + ghost pulsing.
// ===============================================================================================================
const ShotStamp: ShotFC<CL04> = ({ f, len, c }) => {
  const ph = c.changes - c.real;
  const g = f - ph;
  const path: Pt[] = Array.from({ length: 31 }, (_, i) => {
    const u = i / 30;
    return [lerp(1880, 1000, u), 120 + Math.sin(u * 1.4) * 330];
  });
  const end = path[30];
  const dash: Pt[] = Array.from({ length: 21 }, (_, i) => {
    const u = i / 20;
    return [lerp(end[0], 470, u), lerp(end[1], 760, u) - Math.sin(u * Math.PI) * 60];
  });
  const d1 = ez(f, 2, 34);
  const d2 = g >= 0 ? ez(g, 8, 40) : 0;
  const part = (pts: Pt[], k: number) => pts.slice(0, Math.max(2, Math.round(k * (pts.length - 1)) + 1));
  const p1 = part(path, d1);
  const h1 = p1[p1.length - 1];
  const p2 = part(dash, d2);
  const h2 = p2[p2.length - 1];
  return (
    <Pop f={f}>
      <Stage theme={SPACE.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.012, panY: 0.008, frames: len + 30, seed: 15 }} vignette={0.28} grain={0.4}>
        <Layer depth={0.3}>
          <SpaceField f={f} seed={13} />
        </Layer>
        <Layer depth={1}>
          <WindStreaks f={f} cx={-300} cy={2000} r0={1320} rMax={3200} a0={-85} a1={-5} speed={20} count={40} len={140} width={5} seed={23} opacity={0.5} />
          <SunLimb f={f} cx={-300} cy={2000} R={1300} granSize={60} />
          <path d={smoothPath(p1, 0.5)} fill="none" stroke={alpha(C.stampGreen, 0.35)} strokeWidth={22} strokeLinecap="round" />
          <path d={smoothPath(p1, 0.5)} fill="none" stroke={C.stampGreen} strokeWidth={8} strokeLinecap="round" />
          {d1 < 1 ? <circle cx={h1[0]} cy={h1[1]} r={12} fill={C.saffronCore} stroke={C.saffron} strokeWidth={4} /> : null}
          {g >= 0 ? <path d={smoothPath(p2, 0.5)} fill="none" stroke={C.stampBlue} strokeWidth={7} strokeDasharray="20 16" strokeDashoffset={-g * 2} strokeLinecap="round" /> : null}
          {g >= 0 && d2 < 1 ? <circle cx={h2[0]} cy={h2[1]} r={11} fill={C.saffronCore} stroke={C.stampBlue} strokeWidth={4} /> : null}
          <Probe x={end[0] - 10} y={end[1] - 60} size={110} f={f} tilt={-20} />
          <StateStamp x={1460} y={300} state="measured" age={f - 30} size={200} rotate={-8} />
          {f >= 30 && f < 44
            ? Array.from({ length: 10 }, (_, i) => {
                const a = rnd(i * 3 + 1) * Math.PI * 2;
                const r = 120 + rnd(i * 5) * 80 + (f - 30) * 4;
                return <circle key={i} cx={1460 + Math.cos(a) * r} cy={300 + Math.sin(a) * r} r={5 + rnd(i) * 6} fill={C.stampGreen} opacity={1 - (f - 30) / 14} />;
              })
            : null}
          {g >= 0 ? <StateStamp x={560} y={680} state="afar" ghost f={f} size={170} rotate={6} /> : null}
        </Layer>
        <Layer depth={0}>
          <Ledge x={1600} y={900} f={f} pxPerM={84} facing={-1} pose={g < 0 ? "press" : "hold"} expression={g < 0 ? "proud" : "determined"} look={0.5} squash={impact(f, 32, 0.12, 10)} />
          {g >= 0 ? <StateStamp x={1500} y={700} state="afar" flip={{ from: "measured", age: g - 12 }} size={120} rotate={-6} /> : null}
          <L16DialsHUD f={f} family={SPACE} only={["heat"]} heat={{ value: 0.48 + 0.03 * Math.sin(f / 9) }} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================

export const SceneL04: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL04(t);
  const shots: ShotDef<CL04>[] = [
    { from: 0, S: ShotMystery, id: "4-01" }, // + 4-02, 4-03, 4-04
    { from: c.nasa, S: ShotQuestion, id: "4-05" },
    { from: c.flow, S: ShotBlocked, id: "4-06" },
    { from: c.doomed, S: ShotDoomed, id: "4-07" }, // + 4-08
    { from: c.melting, S: ShotMelting, id: "4-09" },
    { from: c.temp, S: ShotTemp, id: "4-10" }, // + 4-11
    { from: c.oven, S: ShotOven, id: "4-12" },
    { from: c.thin, S: ShotThin, id: "4-13" }, // + 4-14, 4-15
    { from: c.shield, S: ShotSwing, id: "4-16" },
    { from: c.foam, S: ShotFoam, id: "4-17" }, // + 4-18
    { from: c.expected, S: ShotExpected, id: "4-19" }, // + 4-20 (KEY ART 2)
    { from: c.panels, S: ShotPanels, id: "4-21" },
    { from: c.water, S: ShotWater, id: "4-22" },
    { from: c.real, S: ShotStamp, id: "4-23" }, // + 4-24
  ];
  return playShots(f, shots, c, t.frames);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL04 = (t: SceneTiming): Cue[] => {
  const c = cuesL04(t);
  const clicks = (at: number, n: number, gap = 7, vol = 0.06): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 7 }));
  return [
    { at: 4, file: SFX.riser, vol: 0.12, dur: 70, fadeIn: 10, fadeOut: 10 },
    ...clicks(c.surface + 6, 6, 7),
    { at: c.corona, file: SFX.riser, vol: 0.14, dur: 80, fadeIn: 6, fadeOut: 12 },
    { at: c.hundreds + 6, file: SFX.pop, vol: 0.16, dur: 14 },
    { at: c.hundreds + 16, file: SFX.pop, vol: 0.16, dur: 14 },
    { at: c.hundreds + 26, file: SFX.pop, vol: 0.16, dur: 14 },
    ...cutHit(c.nasa),
    { at: c.nasa + 30, file: SFX.popLong, vol: 0.2, dur: 30 },
    ...cutHit(c.flow),
    { at: c.flow + 12, file: SFX.click, vol: 0.12, dur: 10 },
    { at: c.flow + 24, file: SFX.pop, vol: 0.14, dur: 14 },
    ...cutHit(c.doomed),
    { at: c.doomed + 8, file: SFX.swirl, vol: 0.14, dur: 50 },
    ...clicks(c.hoped + 10, 6, 14),
    ...cutHit(c.melting),
    { at: c.melting + 6, file: SFX.pop, vol: 0.18, dur: 16 },
    ...cutHit(c.temp),
    { at: c.temp + 8, file: SFX.click, vol: 0.12, dur: 10 },
    { at: c.heat + 16, file: SFX.popLong, vol: 0.18, dur: 30 },
    ...cutHit(c.oven),
    { at: c.oven + 6, file: SFX.pop, vol: 0.16, dur: 14 },
    { at: c.oven + 14, file: SFX.pop, vol: 0.16, dur: 14 },
    ...cutHit(c.thin, 0.14),
    ...clicks(c.thin + 6, 5, 6),
    { at: c.like, file: SFX.swirl, vol: 0.18, dur: 50 },
    { at: c.few + 10, file: SFX.pop, vol: 0.14, dur: 14 },
    ...cutHit(c.shield),
    { at: c.shield + 2, file: SFX.whoosh, vol: 0.22, dur: 50 },
    ...cutHit(c.foam),
    ...clicks(c.foam + 22, 3, 10, 0.1),
    { at: c.reach, file: SFX.riser, vol: 0.12, dur: 60, fadeIn: 8, fadeOut: 10 },
    ...cutHit(c.expected),
    ...clicks(c.expected + 6, 6, 7),
    { at: c.behind + 20, file: SFX.chime, vol: 0.18, dur: 70 },
    ...cutHit(c.panels),
    ...clicks(c.panels + 12, 6, 18),
    ...cutHit(c.water),
    { at: c.water + 8, file: SFX.swirl, vol: 0.14, dur: 50 },
    ...cutHit(c.real),
    { at: c.real + 30, file: SFX.click, vol: 0.16, dur: 10 },
    { at: c.real + 32, file: SFX.boom, vol: 0.3, dur: 120, fadeOut: 30 },
    { at: c.changes + 12, file: SFX.click, vol: 0.14, dur: 10 },
  ];
};
