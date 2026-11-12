// L13 scene l08 "Water, Mars, and the gap between stars" (storyboard §3 "8 · …": shots 8-01…8-21, then M-01, the
// 10-s music-only ring replay, in the hold after line 67, ending on a BlackBeat + sting into the closer; script lines
// 58-67 = scene lines 0-9; families petrol water → MARS → void deep space / Perseus; Act III). Package III builder.
// Key art III = 8-05 at frameOf("l08", 2, 0.3).
// Every number drawn carries its sources.md row in a comment. F5: 236 appears only on the WATER ruler ("re 1 µPa"); only
// the converted ≈ 174 goes onto the air gauge ("IN AIR TERMS"). F9 / line 62 as voiced ("in thin air made mostly of
// carbon dioxide"): 170× lower pressure is shown as its own fact (#20) with no arrow to the speed; no CO₂ figure on
// screen (sources.md #20 has no CO₂ quote yet). F13: 8-21 carries no "lowest" label. No readout ever shows a passing
// number: values appear only when settled.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  BlackBeat,
  Bloom,
  Bubbles,
  Caustics,
  CloudRack,
  Dial,
  Family,
  GroundShadow,
  IF2,
  Kicker,
  Layer,
  Metric,
  Motes,
  Pill,
  Puffs,
  Sky,
  Stage,
  Stars,
  Streamers,
  Tick,
  TimeStrip,
  ZoomThrough,
  alpha,
  cameraAt,
  cutPop,
  mixHex,
  rnd,
} from "../../../lib/illustrated";
import type { CamKey } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { L13_COLORS, familyOf, pillFill } from "../families";
import { DB, L13Gauge } from "../L13Gauge";
import { ListeningTick, Rover, SpermWhale } from "../props";
import { GlobeL13, PressureWave, Rings } from "../sound";
import { ShotDef, ShotFC, actBreakAt, playShots } from "../shots";
import { Cue, SFX, cutHit, sting } from "./cue-types";

const PET = familyOf("petrol");
const MARS = familyOf("mars");
const VOID = familyOf("void");
const SAF = L13_COLORS.saffron;
const TEAL = L13_COLORS.teal;
const BONE = L13_COLORS.bone;
const GOLD = L13_COLORS.gold;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const sm = (t: number, a = 0, b = 1) => {
  const u = clamp01((t - a) / (b - a));
  return u * u * (3 - 2 * u);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const cam = (f: number, keys: CamKey[]) => {
  const c = cameraAt(f, keys);
  return { ...c, zoom: c.zoom * cutPop(f, 0) };
};

/** A tag that keeps its text's case (m/s, dB, µPa). */
const Tag: React.FC<{ x: number; y: number; text: string; F: Family; dot?: string; size?: number; align?: "start" | "end" | "middle" }> = ({ x, y, text, F, dot, size = 24, align = "start" }) => {
  const w = text.length * size * 0.6 + size * (dot ? 2.3 : 1.4);
  const h = size * 1.7;
  const x0 = align === "start" ? x : align === "end" ? x - w : x - w / 2;
  return (
    <g>
      <rect x={x0} y={y - h / 2} width={w} height={h} rx={h / 2} fill={pillFill(F)} />
      {dot ? <circle cx={x0 + size * 0.95} cy={y} r={size * 0.26} fill={dot} /> : null}
      <text x={x0 + (dot ? size * 1.6 : size * 0.7)} y={y + size * 0.36} style={{ fontFamily: IF2.label, fontSize: size, letterSpacing: size * 0.1, fill: F.text }}>
        {text}
      </text>
    </g>
  );
};

export const cuesL08 = (t: SceneTiming) => {
  const { at, p, end, frac } = cueKit(t);
  return {
    section: 0, // 8-01 the air/water cross-section, two rulers slide in
    race: p(0, "Water is also denser"), // 8-02 the water ring outruns the air ring
    slide: at(1), // 8-03 the water ruler slides against the air ruler: 61.5
    subtract: p(1, "So you can't compare"), // 8-04 underwater Tick hangs the −61.5 weight
    whale: at(2), // 8-05 KEY ART III: the sperm whale glides in
    click: p(2, "Its clicks"), // 8-06 a click races out; the water ruler reads 236
    weight: at(3), // 8-07 the weight drops; ≈ 174 floats up
    below: p(3, "Still below"), // 8-08 the air gauge fills to 174, below the ceiling
    mars: at(4), // 8-09 Mars: the rover trundles across
    lanes: frac(4, 0.3), // 8-10 two race lanes, Earth vs Mars (line 62 runs 23.7 s: shares, not phrases)
    dial: frac(4, 0.65), // 8-11 the pressure dial sinks to a sliver
    high: at(5), // 8-12 high and low notes pull apart
    apart: p(5, "The researchers'"), // 8-13 two Ticks 5 m apart
    space: at(6), // 8-14 deep space: Tick shouts, no rings leave
    almost: p(6, "Almost.", -22), // 8-15 one finger up; a faint gold ring passes; ZT out to Perseus
    perseus: at(7), // 8-16 the Perseus cluster ripples
    puffs: p(7, "carries ripples"), // 8-17 bubbles puff out of the black hole
    keys: at(8), // 8-18 the keyboard scrolls to B-flat
    deeper: p(8, "A million billion"), // 8-19 the ripples pass, huge
    years: p(8, "and held roughly"), // 8-20 the 2.5-billion-year strip
    listen: at(9), // 8-21 Tick listens, eyes closed
    m01: actBreakAt(t).start, // M-01 the music-only ring replay → BlackBeat + sting
    last: end(9),
    end: t.frames,
  };
};
export type CL08 = ReturnType<typeof cuesL08>;

// ---- the petrol water section (8-01 to 8-08) -----------------------------------------------------------------
const SURF = 420; // the water surface in the cross-section
const WATER = ["#1E7A86", "#0F4F5E", "#072C38"];
/** light shafts from above that sway and flicker */
const Shafts: React.FC<{ f: number; top?: number; n?: number; seed?: number }> = ({ f, top = SURF, n = 5, seed = 1 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const x = 120 + i * (1800 / n) + Math.sin(f / 37 + i * 1.9) * 60;
      const w = 90 + rnd(seed + i) * 90;
      const o = 0.1 + 0.1 * (0.5 + 0.5 * Math.sin(f / (5 + i) + seed * 3 + i));
      return <path key={i} d={`M${x} ${top} L${x + w} ${top} L${x + w * 2.6 + 260} 1100 L${x + 200} 1100 Z`} fill="#CFF6EE" opacity={o} />;
    })}
  </g>
);
/** the cross-section: petrol air above, water below, caustics on the water layer */
const Section: React.FC<{ f: number; seed?: number; surf?: number }> = ({ f, seed = 1, surf = SURF }) => (
  <>
    <Layer depth={0.05}>
      <Sky stops={[PET.sky[0], PET.sky[1], PET.sky[2]]} h={surf + 40} />
      <Bloom x={1500} y={120} r={420} color={PET.light} strength={0.4} spread={0.5} />
    </Layer>
    <Layer depth={0.3}>
      <CloudRack f={f} n={4} x0={-700} x1={2700} y0={60} y1={surf - 160} size={90} speed={2.2} body={alpha("#3FB0A4", 0.55)} under={alpha("#0A3A42", 0.5)} seed={seed} />
    </Layer>
    <Layer depth={1}>
      <Sky stops={WATER} y={surf} h={1400} />
      <Shafts f={f} top={surf} seed={seed} />
      <Caustics f={f} x={-200} y={surf} w={2400} h={200} rows={3} color="#BFF2F0" opacity={0.32} speed={2.2} />
      <rect x={-400} y={surf - 3} width={2800} height={6} fill={BONE} opacity={0.8} />
    </Layer>
  </>
);

/** A vertical decibel ruler for the cross-section: `zeroY` = where its 0 sits, `ppd` px per dB; ticks every 20 dB. It
 *  carries its reference on a case-keeping tag. The water ruler is teal-bone, never vermilion (the air gauge's colour). */
const Ruler: React.FC<{ x: number; top: number; bottom: number; zeroY: number; ppd: number; color: string; label: string; F: Family; fill?: number; tagY?: number }> = ({ x, top, bottom, zeroY, ppd, color, label, F, fill, tagY }) => {
  const ticks: number[] = [];
  for (let v = 0; zeroY - v * ppd >= top; v += 20) if (zeroY - v * ppd <= bottom) ticks.push(v);
  return (
    <g>
      <rect x={x - 8} y={top} width={16} height={bottom - top} rx={4} fill={alpha(F.shadow, 0.6)} stroke={color} strokeWidth={3} />
      {fill !== undefined && fill > 0 ? <rect x={x - 8} y={zeroY - fill * ppd} width={16} height={fill * ppd} rx={4} fill={color} /> : null}
      {ticks.map((v) => (
        <line key={v} x1={x - 26} y1={zeroY - v * ppd} x2={x - 8} y2={zeroY - v * ppd} stroke={color} strokeWidth={v === 0 ? 5 : 2.5} />
      ))}
      <text x={x - 34} y={zeroY + 9} textAnchor="end" style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 28, fill: color }}>
        0
      </text>
      <Tag x={x} y={tagY ?? bottom + 40} text={label} F={F} dot={color} size={18} align="middle" />
    </g>
  );
};
const AIR_TAG = "AIR · re 20 µPa"; // #9
const WATER_TAG = "WATER · re 1 µPa"; // #9 #18

// 8-01 · the cross-section; two rulers slide in from the right (12 px/f), zeros at different heights
const ShotSection: ShotFC<CL08> = ({ f, len }) => {
  const k = sm(f, 4, 60);
  const ax = lerp(2200, 1420, k);
  const wx = lerp(2500, 1680, sm(f, 14, 72));
  return (
    <Stage theme={PET.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 980, y: 540, zoom: 1.04 }])} vignette={0.2} grain={0.5}>
      <Section f={f} />
      <Layer depth={1}>
        <PressureWave f={f} y={SURF - 170} x0={-100} x1={1300} amp={40} wavelength={320} speed={5} color={TEAL} core={BONE} width={6} lineColor={alpha(BONE, 0.4)} />
        <PressureWave f={f} y={SURF + 260} x0={-100} x1={1300} amp={40} wavelength={1380} speed={21} color={BONE} core="#FFFFFF" width={6} lineColor={alpha(BONE, 0.4)} />
        <Bubbles frame={f} x0={100} x1={1300} y={1100} n={26} color={alpha(BONE, 0.7)} seed={3} size={6} />
      </Layer>
      <Layer depth={0}>
        <Ruler x={ax} top={160} bottom={900} zeroY={760} ppd={3.2} color={L13_COLORS.vermilion} label={AIR_TAG} F={PET} tagY={130} />
        <Ruler x={wx} top={160} bottom={900} zeroY={760 + 26 * 3.2 /* #18: the reference difference */} ppd={3.2} color={BONE} label={WATER_TAG} F={PET} tagY={950} />
      </Layer>
    </Stage>
  );
};

// 8-02 · a ring in the water outruns the same ring in the air above
const ShotRace: ShotFC<CL08> = ({ f, len }) => (
  <Stage theme={PET.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 960, y: 540, zoom: 1.03 }])} vignette={0.2} grain={0.5}>
    <Section f={f + 120} seed={3} />
    <Layer depth={1}>
      <g>
        <clipPath id="l08air">
          <rect x={-400} y={-200} width={2800} height={SURF + 200} />
        </clipPath>
        <clipPath id="l08water">
          <rect x={-400} y={SURF} width={2800} height={1200} />
        </clipPath>
        <g clipPath="url(#l08air)">
          <Rings f={f} cx={-60} cy={SURF} period={70} speed={5} maxR={1600} width={9} color={TEAL} core={BONE} fade={false} start={2} />
        </g>
        <g clipPath="url(#l08water)">
          <Rings f={f} cx={-60} cy={SURF} period={70} speed={21} maxR={2400} width={11} color={BONE} core="#FFFFFF" fade={false} start={2} />
        </g>
      </g>
      <Bubbles frame={f} x0={100} x1={1800} y={1100} n={30} color={alpha(BONE, 0.7)} seed={5} size={6} />
    </Layer>
    <Layer depth={0}>
      <Pill x={1800} y={SURF + 60} text="DENSER · FASTER" /* #18 */ fill={pillFill(PET)} color={PET.text} dot={BONE} size={26} align="end" />
    </Layer>
  </Stage>
);

// 8-03 · the water ruler slides against the air ruler; a bracket opens to 61.5 dB (shown when it settles)
const ShotSlide: ShotFC<CL08> = ({ f, len }) => {
  const ppd = 4;
  const k = sm(f, 8, Math.min(len - 30, 130));
  const zA = 820;
  const zW = zA + 61.5 * ppd * k; // #18: the water ruler's zero ends 61.5 dB below the air ruler's
  return (
    <Stage theme={PET.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 1000, y: 540, zoom: 1.05 }])} vignette={0.2} grain={0.5}>
      <Section f={f + 260} seed={5} surf={300} />
      <Layer depth={1}>
        <Rings f={f} cx={420} cy={720} period={30} speed={9} maxR={900} width={6} color={BONE} start={-40} />
        <Bubbles frame={f} x0={100} x1={1800} y={1100} n={30} color={alpha(BONE, 0.7)} seed={7} size={6} />
      </Layer>
      <Layer depth={0}>
        <Ruler x={1060} top={170} bottom={960} zeroY={zA} ppd={ppd} color={L13_COLORS.vermilion} label={AIR_TAG} F={PET} tagY={140} />
        <Ruler x={1300} top={170} bottom={1000} zeroY={zW} ppd={ppd} color={BONE} label={WATER_TAG} F={PET} tagY={140} />
        <path d={`M1360 ${zA} L1400 ${zA} L1400 ${zW} L1360 ${zW}`} fill="none" stroke={SAF} strokeWidth={6} />
        <g opacity={sm(f, Math.min(len - 30, 130), Math.min(len - 20, 142))}>
          <Metric x={1440} y={(zA + zW) / 2 + 30} value="61.5" unit="dB" /* #18 */ size={88} color={PET.text} />
        </g>
      </Layer>
    </Stage>
  );
};

// 8-04 · underwater Tick, headlamp on, swims a "−61.5" weight over and hangs it on a water reading
const Weight: React.FC<{ x: number; y: number; swing: number }> = ({ x, y, swing }) => (
  <g transform={`translate(${x} ${y}) rotate(${swing.toFixed(2)})`}>
    <line x1={0} y1={0} x2={0} y2={70} stroke={BONE} strokeWidth={4} />
    <path d="M-90 70 L90 70 L120 190 L-120 190 Z" fill="#2E3A40" stroke={SAF} strokeWidth={5} />
    <text x={0} y={152} textAnchor="middle" style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 56, fill: SAF }}>
      −61.5
    </text>
  </g>
);
const ShotSubtract: ShotFC<CL08> = ({ f, len }) => {
  const k = sm(f, 0, Math.max(30, len - 30));
  const tx = lerp(-200, 1100, k);
  const ty = 560 + Math.sin(f / 14) * 24;
  const swing = Math.sin(f / 9) * 14 * (1 - sm(f, len - 30, len));
  return (
    <Stage theme={PET.theme} cam={cam(f, [{ f: 0, x: 900, y: 600, zoom: 1.0 }, { f: len, x: 1100, y: 600, zoom: 1.05 }])} vignette={0.24} grain={0.5}>
      <Layer depth={0.05}>
        <Sky stops={WATER} />
      </Layer>
      <Layer depth={0.5}>
        <Shafts f={f} top={-40} seed={9} />
        <Caustics f={f} x={-200} y={0} w={2400} h={260} rows={3} color="#BFF2F0" opacity={0.3} speed={2.2} />
      </Layer>
      <Layer depth={1}>
        <Ruler x={1640} top={140} bottom={980} zeroY={940} ppd={3.6} color={BONE} label={WATER_TAG} F={PET} tagY={100} />
        <circle cx={1600} cy={940 - 236 * 3.6 * 0.6} r={14} fill={BONE} />
        <Tick x={tx} y={ty} pxPerM={330} frame={f} facing={1} pose="carry" expression="determined" tilt={62} lamp lampColor="#FFF4C8" />
        <Weight x={tx + 140} y={ty - 170} swing={swing} />
        <Bubbles frame={f} x0={tx + 60} x1={tx + 140} y={ty - 260} n={14} color={alpha(BONE, 0.85)} seed={11} size={9} />
        <Bubbles frame={f} x0={100} x1={1800} y={1100} n={24} color={alpha(BONE, 0.6)} seed={13} size={6} />
      </Layer>
      <Layer depth={0}>
        <Pill x={120} y={130} text="SUBTRACT BEFORE COMPARING" /* #18 */ fill={pillFill(PET)} color={PET.text} dot={SAF} size={26} />
      </Layer>
    </Stage>
  );
};

// 8-05 · KEY ART III: the deep; a sperm whale, nose-on, glides in from the dark (40 % → 70 % of the frame);
// Tick small with its lamp on; flickering shafts; haze down the water column
const Deep: React.FC<{ f: number; seed?: number }> = ({ f, seed = 1 }) => (
  <>
    <Layer depth={0.05}>
      <Sky stops={["#1B6F7E", "#0C4452", "#05222D", "#031820"]} />
      <Bloom x={960} y={-80} r={900} color="#9FE8E0" strength={0.45} spread={0.5} />
    </Layer>
    <Layer depth={0.3}>
      <Shafts f={f} top={-60} n={6} seed={seed} />
      <Caustics f={f} x={-200} y={-20} w={2400} h={220} rows={3} color="#CFF6EE" opacity={0.35} speed={2.4} />
    </Layer>
  </>
);
const WhaleBody: React.FC<{ f: number; len: number; grow: number }> = ({ f, len, grow }) => {
  const wl = lerp(1500, 2700, grow);
  return (
    <Stage theme={PET.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 960, y: 560, zoom: 1.06 }])} vignette={0.3} grain={0.5}>
      <Deep f={f} seed={5} />
      <Layer depth={0.6}>
        <Motes frame={f} n={30} x={-100} y={60} w={2100} h={980} color={alpha(BONE, 0.6)} seed={7} size={4} drift={30} />
      </Layer>
      <Layer depth={1}>
        <g opacity={lerp(0.55, 1, grow)}>
          <SpermWhale x={900} y={lerp(560, 600, grow)} len={wl} view="nose" family={PET} f={f} color="#4E6A78" />
        </g>
        {/* haze in front of the far body: the water column */}
        <rect x={-400} y={-200} width={2800} height={1500} fill="#0C4452" opacity={lerp(0.35, 0.05, grow)} />
        <Tick x={1560} y={760 + Math.sin(f / 16) * 14} pxPerM={110} frame={f} facing={-1} pose="stand" expression="surprised" tilt={-10} lamp lampColor="#FFF4C8" />
        <Bubbles frame={f} x0={1500} x1={1600} y={600} n={10} color={alpha(BONE, 0.85)} seed={9} size={7} />
        <Bubbles frame={f} x0={0} x1={1900} y={1100} n={26} color={alpha(BONE, 0.6)} seed={15} size={6} />
      </Layer>
      <Layer depth={0}>
        <Pill x={120} y={130} text="SPERM WHALE" /* #19 */ fill={pillFill(PET)} color={PET.text} dot={BONE} size={26} />
      </Layer>
    </Stage>
  );
};
const ShotWhale: ShotFC<CL08> = ({ f, len }) => <WhaleBody f={f} len={len} grow={sm(f, 0, len + 40)} />;

// 8-06 · a click leaves the whale's head as a tight ring racing outward (30 px/f); the water ruler reads 236
const ShotClick: ShotFC<CL08> = ({ f, len }) => {
  const ppd = 3;
  const fill = sm(f, 6, 30);
  const settled = f >= 32;
  return (
    <Stage theme={PET.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 960, y: 540, zoom: 1.04 }])} vignette={0.26} grain={0.5}>
      <Deep f={f + 200} seed={7} />
      <Layer depth={1}>
        <SpermWhale x={560} y={620} len={900} view="side" family={PET} f={f} color="#4E6A78" facing={1} />
        <Rings f={f} cx={1000} cy={590} period={16} speed={30} maxR={2000} width={9} color={BONE} core="#FFFFFF" start={2} />
        <Bubbles frame={f} x0={0} x1={1900} y={1100} n={26} color={alpha(BONE, 0.6)} seed={17} size={6} />
      </Layer>
      <Layer depth={0}>
        <Ruler x={1700} top={160} bottom={950} zeroY={920} ppd={ppd} color={BONE} label={WATER_TAG} F={PET} tagY={130} fill={236 * fill} />
        {settled ? (
          <g>
            <Metric x={1640} y={920 - 236 * ppd + 20} value="236" unit="dB re 1 µPa" /* #19 · F5 water ruler only */ size={72} color={PET.text} align="end" />
            <Pill x={1640} y={920 - 236 * ppd + 70} text="UNDERWATER SCALE" /* #18 #19 */ fill={pillFill(PET)} color={PET.text} dot={BONE} size={20} align="end" />
          </g>
        ) : null}
      </Layer>
    </Stage>
  );
};

// 8-07 · the −61.5 weight drops onto the 236 reading; the tag spins ("?"), lands on ≈ 174 and floats up 500 px
// through the surface to the air ruler
const ShotWeight: ShotFC<CL08> = ({ f, len }) => {
  const drop = sm(f, 2, 18);
  const hit = 18;
  const spin = f >= hit && f < hit + 16;
  const done = f >= hit + 16;
  const rise = sm(f, hit + 20, Math.max(hit + 40, len - 12));
  const tagY = lerp(860, 330, rise);
  return (
    <Stage theme={PET.theme} cam={cam(f, [{ f: 0, x: 960, y: 560, zoom: 1.0 }, { f: len, x: 960, y: 480, zoom: 1.04 }])} vignette={0.2} grain={0.5}>
      <Section f={f + 400} seed={9} surf={480} />
      <Layer depth={1}>
        <Rings f={f} cx={960} cy={860} period={24} speed={10} maxR={900} width={5} color={BONE} start={hit} />
        <Bubbles frame={f} x0={100} x1={1800} y={1100} n={30} color={alpha(BONE, 0.7)} seed={19} size={6} />
        {/* the reading tag */}
        <g transform={`translate(960 ${tagY})`}>
          <rect x={-170} y={-60} width={340} height={120} rx={20} fill={done ? L13_COLORS.vermilion : "#0F4F5E"} stroke={done ? "#FFF4DE" : BONE} strokeWidth={5} />
          <text x={0} y={30} textAnchor="middle" style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 84, fill: "#FFF4DE" }}>
            {done ? "≈ 174" /* #19 #18: 236 − 61.5 */ : spin ? "?" : "236" /* #19 */}
          </text>
        </g>
        {f < hit + 30 ? <Weight x={960} y={lerp(-300, 860 - 250, drop)} swing={0} /> : null}
      </Layer>
      <Layer depth={0}>
        <g opacity={sm(f, hit + 16, hit + 26)}>
          <Metric x={120} y={200} value="≈ 174" /* #19 #18 · F5 */ size={100} color={PET.text} />
          <Pill x={120} y={258} text="IN AIR TERMS" /* #18 */ fill={pillFill(PET)} color={PET.text} dot={L13_COLORS.vermilion} size={22} />
        </g>
      </Layer>
    </Stage>
  );
};

// 8-08 · the air gauge fills to 174, below the saffron 194 line; Tick surfaces, dripping, and nods
const ShotBelow: ShotFC<CL08> = ({ f, len }) => {
  const fill = sm(f, 4, 40);
  const surf = 760;
  const up = sm(f, 0, 30);
  const ty = lerp(surf + 340, surf + 120, up);
  const nod = f > 40 ? Math.sin((f - 40) / 6) * 8 * Math.exp(-(f - 40) / 50) : 0;
  return (
    <Stage theme={PET.theme} cam={cam(f, [{ f: 0, x: 960, y: 560, zoom: 1.0 }, { f: len, x: 940, y: 540, zoom: 1.04 }])} vignette={0.2} grain={0.5}>
      <Section f={f + 600} seed={11} surf={surf} />
      <Layer depth={1}>
        <Ripples2 f={f} cx={780} cy={surf} />
        <Tick x={780} y={ty} pxPerM={330} frame={f} facing={1} pose="stand" expression="proud" headTilt={nod} look={0.5} />
        {Array.from({ length: 10 }, (_, i) => {
          const life = 26;
          const age = (f + i * 7) % life;
          const x = 700 + rnd(i * 5) * 160;
          const y0 = ty - 380 + rnd(i * 9) * 200;
          return <ellipse key={i} cx={x} cy={y0 + age * age * 0.5} rx={5} ry={8} fill="#BFF2F0" opacity={f > 18 ? 1 - age / life : 0} />;
        })}
      </Layer>
      <Layer depth={0}>
        <L13Gauge family={PET} value={DB.whaleInAir * fill /* #19 #18 */} frame={f} x={1640} y={170} height={560} ceiling={{ v: DB.ceiling /* #11 */ }} labelled readout={fill >= 1 ? "≈ 174 dB" : false} marks={[{ v: DB.whaleInAir, label: "IN AIR TERMS" }]} />
        <Pill x={120} y={130} text="STILL BELOW THE CEILING" /* #11 #19 */ fill={pillFill(PET)} color={PET.text} dot={SAF} size={26} />
      </Layer>
    </Stage>
  );
};
/** surface ripples where Tick breaks through */
const Ripples2: React.FC<{ f: number; cx: number; cy: number }> = ({ f, cx, cy }) => (
  <Rings f={f} cx={cx} cy={cy} period={14} speed={8} maxR={700} width={5} squash={0.18} color={BONE} core="#FFFFFF" />
);

// ---- Mars (8-09 to 8-13) -------------------------------------------------------------------------------------
const MarsSet: React.FC<{ f: number; seed?: number; ground?: number }> = ({ f, seed = 1, ground = 820 }) => (
  <>
    <Layer depth={0.05}>
      <Sky family={MARS} />
      <Bloom x={260} y={560} r={600} color="#FFE4AE" strength={0.35} spread={0.5} />
    </Layer>
    <Layer depth={0.25}>
      <path d={`M-600 ${ground - 120} Q 300 ${ground - 230} 900 ${ground - 150} T 2600 ${ground - 170} V 1500 H -600 Z`} fill={MARS.far} />
      <CloudRack f={f} n={5} x0={-700} x1={2700} y0={ground - 300} y1={ground - 120} size={140} speed={2.6} body={alpha(MARS.haze, 0.55)} under={alpha(MARS.mid, 0.45)} seed={seed} flat={0.5} />
    </Layer>
    <Layer depth={0.6}>
      <path d={`M-600 ${ground - 30} Q 600 ${ground - 80} 1300 ${ground - 40} T 2600 ${ground - 50} V 1500 H -600 Z`} fill={MARS.mid} />
    </Layer>
    <Layer depth={1}>
      <rect x={-600} y={ground} width={3200} height={700} fill={mixHex(MARS.mid, MARS.near, 0.35)} />
      {Array.from({ length: 12 }, (_, i) => (
        <ellipse key={i} cx={-200 + rnd(seed * 3 + i) * 2400} cy={ground + 40 + rnd(seed * 5 + i) * 180} rx={14 + rnd(i) * 30} ry={6 + rnd(i * 2) * 10} fill={MARS.near} opacity={0.6} />
      ))}
    </Layer>
  </>
);

// 8-09 · the rover trundles across (5 px/f); dust banks, a dust-devil
const ShotMars: ShotFC<CL08> = ({ f, len }) => (
  <Stage theme={MARS.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 1100, y: 540, zoom: 1.06 }])} vignette={0.18} grain={0.5}>
    <MarsSet f={f} seed={3} />
    <Layer depth={1}>
      <Puffs frame={f} x={1500} y={820} color={alpha(MARS.haze, 0.7)} period={8} size={40} rise={2.4} drift={1.5} life={70} seed={5} />
      <GroundShadow x={300 + f * 5} y={870} rx={200} ry={20} />
      <Rover x={300 + f * 5} y={870} s={130} family={MARS} f={f} roll={5} facing={1} />
    </Layer>
    <Layer depth={1.2}>
      <Streamers f={f} n={14} x0={-200} x1={2200} y0={300} y1={900} len={160} width={4} speed={6} color={MARS.haze} opacity={0.4} seed={7} />
    </Layer>
    <Layer depth={0}>
      <Pill x={120} y={130} text="PERSEVERANCE · MICROPHONE" /* #20 */ fill={pillFill(MARS)} color={MARS.text} dot={TEAL} size={26} />
    </Layer>
  </Stage>
);

// 8-10 · two race lanes: a sound ring on Earth vs on Mars; the Mars ring lags
const ShotLanes: ShotFC<CL08> = ({ f, len }) => {
  const lane = (y: number, speed: number, color: string, label: string, sky: string[]) => (
    <g>
      <clipPath id={`l08lane${y}`}>
        <rect x={0} y={y - 170} width={1920} height={340} />
      </clipPath>
      <rect x={0} y={y - 170} width={1920} height={340} fill={sky[0]} />
      <rect x={0} y={y + 100} width={1920} height={70} fill={sky[1]} />
      <g clipPath={`url(#l08lane${y})`}>
        <Rings f={f} cx={150} cy={y} period={60} speed={speed} maxR={2100} width={9} color={color} fade={false} />
      </g>
      <circle cx={150} cy={y} r={20} fill={color} />
      <Tag x={1800} y={y - 120} text={label} F={MARS} dot={color} size={26} align="end" />
    </g>
  );
  return (
    <Stage theme={MARS.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 960, y: 540, zoom: 1.03 }])} vignette={0.16} grain={0.5}>
      <Layer depth={0.05}>
        <Sky family={MARS} />
      </Layer>
      <Layer depth={0.3}>
        <CloudRack f={f} n={4} x0={-700} x1={2700} y0={380} y1={560} size={110} speed={2.6} body={alpha(MARS.haze, 0.5)} under={alpha(MARS.mid, 0.4)} seed={9} flat={0.5} />
      </Layer>
      <Layer depth={1}>
        {lane(290, 34 /* schematic: 340 m/s */, TEAL, "EARTH · ~340 m/s" /* #20 */, ["#2E8FA8", "#3D6B4A"])}
        {lane(760, 24 /* schematic: 240 m/s */, SAF, "MARS · ~240 m/s" /* #20 */, [mixHex(MARS.sky[1], MARS.sky[2], 0.5), MARS.mid])}
      </Layer>
    </Stage>
  );
};

// 8-11 · a pressure dial in the thin Martian air sinks toward a sliver; big sparse air dots drift
const ShotDial: ShotFC<CL08> = ({ f, len }) => {
  const v = lerp(100, 100 / 170 /* #20: 170× lower */, sm(f, 6, 70)) + Math.sin(f / 5) * 0.8 * sm(f, 60, 80);
  return (
    <Stage theme={MARS.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 940, y: 540, zoom: 1.05 }])} vignette={0.18} grain={0.5}>
      <MarsSet f={f + 300} seed={11} ground={900} />
      <Layer depth={0.9}>
        {Array.from({ length: 14 }, (_, i) => {
          const x = (((rnd(i * 7) * 2200 + f * (2.6 + rnd(i) * 1.4)) % 2200) + 2200) % 2200 - 140;
          const y = 160 + rnd(i * 13) * 640 + Math.sin(f / 30 + i) * 20;
          return <circle key={i} cx={x} cy={y} r={11} fill={MARS.light} opacity={0.8} />;
        })}
      </Layer>
      <Layer depth={1}>
        <Dial x={1280} y={520} r={250} value={v} min={0} max={100} family={MARS} frame={f} ticks={10} format={() => ""} title="PRESSURE" />
      </Layer>
      <Layer depth={0}>
        <Metric x={120} y={230} value="170×" unit="lower pressure" /* #20 · F9 */ size={110} color={MARS.text} />
        <Pill x={120} y={290} text="AT THE MARTIAN SURFACE" /* #20 */ fill={pillFill(MARS)} color={MARS.text} dot={SAF} size={22} />
      </Layer>
    </Stage>
  );
};

// 8-12 · high and low notes leave the rover's mast as two rings (tight teal, wide saffron) that pull apart
const ShotHigh: ShotFC<CL08> = ({ f, len }) => {
  const mx = 640;
  const my = 520;
  return (
    <Stage theme={MARS.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 980, y: 540, zoom: 1.04 }])} vignette={0.18} grain={0.5}>
      <MarsSet f={f + 600} seed={13} />
      <Layer depth={1}>
        <Rover x={560} y={870} s={150} family={MARS} f={f} facing={1} />
        <Rings f={f} cx={mx} cy={my} period={46} speed={12} maxR={1700} width={5} color={TEAL} core={BONE} start={2} />
        <Rings f={f} cx={mx} cy={my} period={46} speed={9} maxR={1500} width={16} color={SAF} start={2} />
        <Puffs frame={f} x={1600} y={880} color={alpha(MARS.haze, 0.7)} period={9} size={36} rise={2.2} drift={1.6} life={70} seed={9} />
      </Layer>
      <Layer depth={0}>
        <Tag x={1800} y={130} text="HIGH · ~250 m/s" /* #20 */ F={MARS} dot={TEAL} size={26} align="end" />
        <Tag x={1800} y={200} text="LOW · ~240 m/s" /* #20 */ F={MARS} dot={SAF} size={26} align="end" />
      </Layer>
    </Stage>
  );
};

// 8-13 · Tick and a slate Tick 5 m apart; Tick talks, the rings fade before they arrive; the other listens, then shrugs
const ShotApart: ShotFC<CL08> = ({ f, len }) => {
  const shrug = sm(f, len * 0.6, len * 0.6 + 14);
  return (
    <Stage theme={MARS.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 960, y: 560, zoom: 1.04 }])} vignette={0.18} grain={0.5}>
      <MarsSet f={f + 900} seed={15} ground={880} />
      <Layer depth={1}>
        <Rings f={f} cx={560} cy={640} period={22} speed={9} maxR={900} width={9} color={BONE} core="#FFFFFF" arc={[-60, 60]} ringOpacity={(r) => clamp01(1 - r / 640)} />
        <GroundShadow x={440} y={960} rx={120} ry={14} />
        <Tick x={440} y={960} pxPerM={280} frame={f} facing={1} pose={Math.floor(f / 16) % 2 ? "wave" : "point"} expression="happy" look={0.6} />
        <GroundShadow x={1440} y={960} rx={120} ry={14} />
        {shrug <= 0 ? (
          <ListeningTick x={1440} y={960} pxPerM={280} frame={f} toward={-1} color="#5E7D8A" expression="thinking" seed={7} />
        ) : (
          <Tick x={1440} y={960} pxPerM={280} frame={f} facing={-1} pose="stand" poseTo="shrug" poseT={shrug * 1.1} color="#5E7D8A" expression="thinking" seed={7} />
        )}
        <path d="M440 1000 L1440 1000 M440 985 L440 1015 M1440 985 L1440 1015" stroke={MARS.text} strokeWidth={4} />
        <Puffs frame={f} x={960} y={900} color={alpha(MARS.haze, 0.7)} period={10} size={34} rise={2} drift={2} life={70} seed={11} />
      </Layer>
      <Layer depth={0}>
        <Tag x={940} y={1040 - 90} text="5 m" /* #20 */ F={MARS} size={26} align="middle" />
      </Layer>
    </Stage>
  );
};

// ---- deep space and Perseus (8-14 to 8-21, M-01) -------------------------------------------------------------
/** star-field parallax with big stars: two layers at different depths (the camera pans across them) */
const DeepSpace: React.FC<{ f: number; seed?: number }> = ({ f, seed = 1 }) => (
  <>
    <Layer depth={0.05}>
      <Sky family={VOID} />
      <Bloom x={1500} y={300} r={900} color={TEAL} strength={0.22} spread={0.45} />
      <Stars frame={f} n={120} w={1920} h={1080} color={VOID.text} seed={seed} size={1.6} twinkle={0.7} />
    </Layer>
    <Layer depth={0.5}>
      <g transform={`translate(${((-f * 3) % 1920).toFixed(1)} 0)`}>
        {[0, 1920].map((ox) => (
          <g key={ox} transform={`translate(${ox} 0)`}>
            <Stars frame={f} n={26} w={1920} h={1080} color="#FFF4DE" seed={seed + 9} size={4.5} twinkle={0.4} />
          </g>
        ))}
      </g>
    </Layer>
  </>
);
const Wisps: React.FC<{ f: number; seed?: number }> = ({ f, seed = 1 }) => (
  <CloudRack f={f} n={6} x0={-800} x1={2800} y0={120} y1={980} size={200} speed={3} body={alpha("#1F8F8A", 0.32)} under={alpha("#0A3A42", 0.4)} top={alpha(BONE, 0.14)} seed={seed} flat={0.45} dir={-1} />
);

// 8-14 · deep space: Tick (not to scale) floats and shouts; no rings leave; gas wisps drift through
const ShotSpace: ShotFC<CL08> = ({ f, len }) => {
  const shrug = sm(f, len * 0.55, len * 0.55 + 14);
  return (
    <Stage theme={VOID.theme} cam={cam(f, [{ f: 0, x: 900, y: 540, zoom: 1.0 }, { f: len, x: 1040, y: 540, zoom: 1.04 }])} vignette={0.24} grain={0.5}>
      <DeepSpace f={f} seed={3} />
      <Layer depth={0.8}>
        <Wisps f={f} seed={5} />
      </Layer>
      <Layer depth={1}>
        <Tick x={960} y={760} pxPerM={300} frame={f} facing={1} pose="cheer" poseTo="shrug" poseT={shrug * 1.1} expression="surprised" expressionTo="thinking" expressionT={shrug} tilt={-20 + f * 0.6} />
        {Array.from({ length: 6 }, (_, i) => (
          <circle key={i} cx={1150 + rnd(i * 3) * 600 + f * 1.6} cy={300 + rnd(i * 7) * 500} r={8} fill={BONE} opacity={0.5} />
        ))}
      </Layer>
      <Layer depth={0}>
        <Pill x={120} y={130} text="NOT TO SCALE" /* F14 */ fill={pillFill(VOID)} color={VOID.text} dot={TEAL} size={24} />
      </Layer>
    </Stage>
  );
};

// 8-15 · "Almost.": Tick raises one finger; behind it a faint gold ring passes; the last 22 frames ZT out to Perseus
const AlmostBody: React.FC<{ f: number; len: number }> = ({ f, len }) => {
  const up = sm(f, 2, 14);
  return (
    <Stage theme={VOID.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.04 }, { f: len, x: 960, y: 520, zoom: 1.0 }])} vignette={0.24} grain={0.5}>
      <DeepSpace f={f + 200} seed={5} />
      <Layer depth={0.7}>
        <Rings f={f} cx={2300} cy={300} period={34} speed={14} maxR={2800} width={10} color={GOLD} opacity={0.7} start={-60} />
        <Wisps f={f + 200} seed={9} />
      </Layer>
      <Layer depth={1}>
        <Tick x={860} y={980} pxPerM={420} frame={f} facing={1} pose="stand" poseTo="point" poseT={up * 1.15} expression="thinking" look={0.4} headTilt={-up * 10} tilt={-4} />
      </Layer>
    </Stage>
  );
};

/** The Perseus cluster: a soft gold-teal gas field with hatch, a dark disc at the centre, ripples through the gas. */
const PerseusField: React.FC<{ f: number; cx?: number; cy?: number; ripple?: { period: number; speed: number; width: number; start?: number }; seed?: number }> = ({ f, cx = 960, cy = 540, ripple = { period: 40, speed: 5, width: 26 }, seed = 1 }) => (
  <>
    <Layer depth={0.05}>
      <Sky family={VOID} />
      <Stars frame={f} n={110} w={1920} h={1080} color={VOID.text} seed={seed} size={2.2} twinkle={0.7} />
    </Layer>
    <Layer depth={0.6}>
      <Bloom x={cx} y={cy} r={1000} color={GOLD} core={0} strength={0.55 + 0.06 * Math.sin(f / 14)} spread={0.55} />
      <Bloom x={cx + 260} y={cy + 160} r={800} color={TEAL} strength={0.4} spread={0.5} />
      <g>
        <clipPath id={`l08gas${seed}`}>
          <ellipse cx={cx} cy={cy} rx={980} ry={700} />
        </clipPath>
        <g clipPath={`url(#l08gas${seed})`} opacity={0.22}>
          {Array.from({ length: 40 }, (_, i) => {
            const x = -400 + i * 70 + ((f * 0.8) % 70);
            return <line key={i} x1={x} y1={-100} x2={x + 600} y2={1200} stroke="#FFF4DE" strokeWidth={3} />;
          })}
        </g>
      </g>
      <Rings f={f} cx={cx} cy={cy} period={ripple.period} speed={ripple.speed} maxR={1100} width={ripple.width} color={mixHex(GOLD, "#FFFFFF", 0.2)} core="#FFF6E0" opacity={0.75} start={ripple.start ?? -400} />
    </Layer>
    <Layer depth={0.7}>
      <circle cx={cx} cy={cy} r={70} fill="#02090C" stroke={alpha(GOLD, 0.8)} strokeWidth={6} />
    </Layer>
  </>
);

const ShotAlmost: ShotFC<CL08> = ({ f, len }) => {
  const zt = clamp01((f - (len - 16)) / 16);
  const body = <AlmostBody f={f} len={len} />;
  if (zt <= 0) return body;
  return (
    <ZoomThrough
      t={zt}
      focal={{ x: 1300, y: 400 }}
      from={body}
      to={
        <Stage theme={VOID.theme} cam={{ x: 960, y: 540, zoom: 1.0 }} vignette={0.24} grain={0.5}>
          <PerseusField f={f - len + 22} seed={2} />
        </Stage>
      }
    />
  );
};

// 8-16 · the Perseus cluster: concentric ripples spread through the gas; slow push
const ShotPerseus: ShotFC<CL08> = ({ f, len }) => (
  <Stage theme={VOID.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 960, y: 540, zoom: 1.12 }])} vignette={0.24} grain={0.5}>
    <PerseusField f={f + 22} seed={2} />
    <Layer depth={0}>
      <Kicker x={120} y={130} text="— PERSEUS CLUSTER · 250 MILLION LIGHT YEARS" /* #21 */ color={VOID.text} size={24} />
    </Layer>
  </Stage>
);

// 8-17 · toward the black hole: bubbles puff out of it, each puff launching a ripple
const ShotPuffs: ShotFC<CL08> = ({ f, len }) => {
  const P = 54;
  const age = f % P;
  const r = 40 + (age / P) * 260;
  return (
    <Stage theme={VOID.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.12 }, { f: len, x: 960, y: 540, zoom: 1.3 }])} vignette={0.24} grain={0.5}>
      <PerseusField f={f + 200} seed={4} ripple={{ period: P, speed: 7, width: 22, start: 0 }} />
      <Layer depth={0.75}>
        {[-1, 1].map((s) => (
          <g key={s}>
            <circle cx={960 + s * (80 + r * 0.9)} cy={540 - s * r * 0.25} r={r} fill={alpha("#02090C", 0.55 * (1 - age / P))} stroke={alpha(BONE, 0.8 * (1 - age / P))} strokeWidth={6} />
          </g>
        ))}
      </Layer>
      <Layer depth={0}>
        <Pill x={120} y={130} text="SOUND WAVES IN HOT GAS" /* #21 */ fill={pillFill(VOID)} color={VOID.text} dot={GOLD} size={26} />
      </Layer>
    </Stage>
  );
};

// 8-18 · a piano keyboard scrolls left fast (40 px/f, easing out) and stops on B♭; the key rings
const KW = 64; // white key width
const OCT = KW * 7;
const ShotKeys: ShotFC<CL08> = ({ f, len }) => {
  const stop = 60;
  const D = (40 * stop) / 3; // initial speed 40 px/f
  const u = clamp01(f / stop);
  const scrolled = D * (1 - Math.pow(1 - u, 3));
  // the B♭ of octave 4 lands at x = 960 when the scroll stops
  const bbLocal = 6 * KW; // B♭ sits on the A|B boundary
  const x0 = 960 - (4 * OCT + bbLocal) + (D - scrolled);
  const ky = 560;
  const kh = 320;
  const landed = f >= stop;
  const keys: React.ReactNode[] = [];
  for (let o = -1; o < 12; o++) {
    for (let k = 0; k < 7; k++) {
      const x = x0 + o * OCT + k * KW;
      if (x < -KW || x > 1920 + KW) continue;
      keys.push(<rect key={`w${o}-${k}`} x={x} y={ky} width={KW - 4} height={kh} rx={6} fill="#FFF6E2" stroke="#2A3E46" strokeWidth={2} />);
    }
  }
  for (let o = -1; o < 12; o++) {
    [1, 2, 4, 5, 6].forEach((b) => {
      const x = x0 + o * OCT + b * KW - KW * 0.32;
      if (x < -KW || x > 1920 + KW) return;
      const isBb = o === 4 && b === 6;
      keys.push(<rect key={`b${o}-${b}`} x={x} y={ky} width={KW * 0.6} height={kh * 0.62} rx={4} fill={isBb && landed ? GOLD : "#13232A"} />);
    });
  }
  return (
    <Stage theme={VOID.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 960, y: 560, zoom: 1.05 }])} vignette={0.24} grain={0.5}>
      <DeepSpace f={f + 400} seed={7} />
      <Layer depth={1}>
        {landed ? <Rings f={f} cx={960} cy={ky + 100} period={18} speed={11} maxR={1200} width={6} color={GOLD} start={stop} /> : null}
        <Streamers f={f} n={14} x0={-200} x1={2200} y0={ky - 40} y1={ky + kh + 40} len={200} width={4} speed={landed ? 2 : 30} color={VOID.text} opacity={landed ? 0.1 : 0.35} seed={3} dir={-1} />
        {keys}
      </Layer>
      <Layer depth={0}>
        <Metric x={120} y={230} value="57 octaves" unit="below middle C" /* #21 */ size={92} color={VOID.text} />
        <g opacity={landed ? 1 : 0}>
          <Pill x={960} y={ky - 50} text="B♭" /* #21 */ fill={pillFill(VOID)} color={VOID.text} dot={GOLD} size={32} align="middle" />
        </g>
      </Layer>
    </Stage>
  );
};

// 8-19 · the ripples pass, huge
const ShotDeeper: ShotFC<CL08> = ({ f, len }) => (
  <Stage theme={VOID.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.3 }, { f: len, x: 960, y: 540, zoom: 1.45 }])} vignette={0.24} grain={0.5}>
    <PerseusField f={f + 400} seed={6} ripple={{ period: 36, speed: 13, width: 40 }} />
    <Layer depth={0}>
      <Metric x={120} y={980 - 90} value="×1,000,000,000,000,000" unit="deeper" /* #21: "over a million, billion times" */ size={78} color={VOID.text} />
    </Layer>
  </Stage>
);

// 8-20 · a time strip of ~2.5 billion years scrolls; the ripples keep coming
const ShotYears: ShotFC<CL08> = ({ f, len }) => (
  <Stage theme={VOID.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 960, y: 520, zoom: 1.04 }])} vignette={0.24} grain={0.5}>
    <PerseusField f={f + 600} seed={8} cy={420} ripple={{ period: 40, speed: 8, width: 26 }} />
    <Layer depth={1}>
      <TimeStrip x={120} y={860} w={1680} value={f * 0.05} span={10} step={0.5} family={VOID} height={64} format={() => ""} />
    </Layer>
    <Layer depth={0}>
      <Kicker x={120} y={130} text="— ~2.5 BILLION YEARS" /* #21 */ color={VOID.text} size={30} />
    </Layer>
  </Stage>
);

// 8-21 · Tick floats, eyes closed, listening, as the ripples pass through it; the camera pulls back into M-01
const ShotListen: ShotFC<CL08> = ({ f, len }) => (
  <Stage theme={VOID.theme} cam={cam(f, [{ f: 0, x: 960, y: 560, zoom: 1.12 }, { f: len, x: 960, y: 540, zoom: 0.92 }])} vignette={0.24} grain={0.5}>
    <PerseusField f={f + 800} seed={10} cx={260} cy={420} ripple={{ period: 34, speed: 9, width: 28 }} />
    <Layer depth={1}>
      <ListeningTick x={1180} y={860 + Math.sin(f / 24) * 16} pxPerM={380} frame={f} toward={-1} expression="happy" tilt={-6 + Math.sin(f / 30) * 6} />
    </Layer>
  </Stage>
);

// M-01 · music only: the camera pulls back past a galaxy field to a small Earth; the episode replays as rings from one
// centre, one every 45 frames: the cricket ring, the cannon, the shock wall, the globe front, the whale click, Perseus
const REPLAY: { color: string; core: string; speed: number; width: number; maxR: number }[] = [
  { color: "#7DB95E", core: "#E6F5C8", speed: 6, width: 4, maxR: 700 }, // crickets: small, thin
  { color: SAF, core: L13_COLORS.saffronCore, speed: 9, width: 8, maxR: 1000 }, // the cannon
  { color: SAF, core: "#FFFFFF", speed: 14, width: 18, maxR: 1400 }, // the shock wall
  { color: BONE, core: "#FFFFFF", speed: 10, width: 9, maxR: 1300 }, // the globe front
  { color: TEAL, core: BONE, speed: 18, width: 6, maxR: 1500 }, // the whale click
  { color: GOLD, core: "#FFF6E0", speed: 8, width: 30, maxR: 1600 }, // the Perseus ripple
];
const M01: React.FC<{ f: number; len: number }> = ({ f, len }) => {
  const bb = 16;
  const ex = 960;
  const ey = 540;
  return (
    <AbsoluteFill>
      <Stage theme={VOID.theme} cam={cameraAt(f, [{ f: 0, x: 1200, y: 400, zoom: 2.4 }, { f: len - bb, x: 960, y: 540, zoom: 1.0 }])} vignette={0.24} grain={0.5}>
        <DeepSpace f={f + 900} seed={11} />
        <Layer depth={0.4}>
          {Array.from({ length: 9 }, (_, i) => {
            const gx = rnd(i * 5 + 1) * 1920;
            const gy = rnd(i * 9 + 2) * 1080;
            const c = i % 3 === 0 ? GOLD : i % 3 === 1 ? TEAL : BONE;
            return (
              <g key={i} transform={`translate(${gx} ${gy}) rotate(${(rnd(i) * 180).toFixed(0)})`}>
                <ellipse rx={60 + rnd(i * 3) * 50} ry={18 + rnd(i * 7) * 14} fill={alpha(c, 0.35)} />
                <circle r={9} fill={c} />
              </g>
            );
          })}
        </Layer>
        <Layer depth={1}>
          {REPLAY.flatMap((r, k) =>
            [0, 1].map((rep) => {
              const start = 6 + k * 45 + rep * 6 * 45;
              return <Rings key={`${k}-${rep}`} f={f} cx={ex} cy={ey} period={9999} speed={r.speed} maxR={r.maxR} width={r.width} color={r.color} core={r.core} start={start} count={1} />;
            }),
          )}
          <GlobeL13 cx={ex} cy={ey} R={70} rot={100 + f * 1.5} tilt={14} family={VOID} schematic={false} />
        </Layer>
      </Stage>
      <BlackBeat t={clamp01((f - (len - bb)) / bb)} fadeIn={0.5} fadeOut={0.01} />
    </AbsoluteFill>
  );
};

export const SceneL08: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL08(t);
  if (f >= c.m01) return <M01 f={f - c.m01} len={c.end - c.m01} />;
  const shots: ShotDef<CL08>[] = [
    { from: 0, S: ShotSection, id: "8-01" },
    { from: c.race, S: ShotRace, id: "8-02" },
    { from: c.slide, S: ShotSlide, id: "8-03" },
    { from: c.subtract, S: ShotSubtract, id: "8-04" },
    { from: c.whale, S: ShotWhale, id: "8-05" },
    { from: c.click, S: ShotClick, id: "8-06" },
    { from: c.weight, S: ShotWeight, id: "8-07" },
    { from: c.below, S: ShotBelow, id: "8-08" },
    { from: c.mars, S: ShotMars, id: "8-09" },
    { from: c.lanes, S: ShotLanes, id: "8-10" },
    { from: c.dial, S: ShotDial, id: "8-11" },
    { from: c.high, S: ShotHigh, id: "8-12" },
    { from: c.apart, S: ShotApart, id: "8-13" },
    { from: c.space, S: ShotSpace, id: "8-14" },
    { from: c.almost, S: ShotAlmost, id: "8-15" },
    { from: c.perseus, S: ShotPerseus, id: "8-16" },
    { from: c.puffs, S: ShotPuffs, id: "8-17" },
    { from: c.keys, S: ShotKeys, id: "8-18" },
    { from: c.deeper, S: ShotDeeper, id: "8-19" },
    { from: c.years, S: ShotYears, id: "8-20" },
    { from: c.listen, S: ShotListen, id: "8-21" },
  ];
  return <AbsoluteFill>{playShots(f, shots, c, c.m01)}</AbsoluteFill>;
};

export const soundL08 = (t: SceneTiming): Cue[] => {
  const c = cuesL08(t);
  return [
    { at: 2, file: SFX.swirl, vol: 0.2, dur: 50 },
    ...cutHit(c.race),
    { at: c.race + 4, file: SFX.whoosh, vol: 0.24, dur: 40 },
    { at: c.race + 14, file: SFX.whoosh, vol: 0.2, dur: 40 },
    ...cutHit(c.slide),
    ...Array.from({ length: 6 }, (_, i) => ({ at: c.slide + 10 + i * 18, file: SFX.click, vol: 0.1, dur: 8 })),
    ...cutHit(c.subtract),
    { at: c.subtract + 20, file: SFX.popLong, vol: 0.22, dur: 30 },
    ...cutHit(c.whale),
    { at: c.whale, file: SFX.rumble, vol: 0.22, dur: c.click - c.whale, fadeIn: 14, fadeOut: 10 },
    ...cutHit(c.click),
    { at: c.click + 2, file: SFX.click, vol: 0.34, dur: 12 },
    { at: c.click + 18, file: SFX.click, vol: 0.24, dur: 12 },
    ...cutHit(c.weight),
    { at: c.weight + 18, file: SFX.popLong, vol: 0.26, dur: 30 },
    { at: c.weight + 40, file: SFX.swirl, vol: 0.2, dur: 50 },
    ...cutHit(c.below),
    { at: c.below + 40, file: SFX.chime, vol: 0.24, dur: 60 },
    ...cutHit(c.mars),
    { at: c.mars, file: SFX.wind, vol: 0.18, dur: c.high - c.mars, fadeIn: 20, fadeOut: 20 },
    ...cutHit(c.lanes),
    { at: c.lanes + 4, file: SFX.whoosh, vol: 0.22, dur: 40 },
    { at: c.lanes + 12, file: SFX.whoosh, vol: 0.18, dur: 40 },
    ...cutHit(c.dial),
    { at: c.dial + 6, file: SFX.swirl, vol: 0.2, dur: 50 },
    ...cutHit(c.high),
    { at: c.high + 2, file: SFX.chime, vol: 0.2, dur: 50 },
    { at: c.high + 4, file: SFX.rumble, vol: 0.16, dur: 60, fadeOut: 16 },
    ...cutHit(c.apart),
    { at: c.apart + 10, file: SFX.pop, vol: 0.2, dur: 20 },
    ...cutHit(c.space),
    { at: c.almost - 6, file: SFX.pop, vol: 0.2, dur: 20 },
    { at: c.almost + 4, file: SFX.riser, vol: 0.16, dur: c.perseus - c.almost, fadeOut: 10 },
    { at: c.perseus, file: SFX.rumble, vol: 0.2, dur: c.keys - c.perseus, fadeIn: 20, fadeOut: 20 },
    ...cutHit(c.puffs),
    ...Array.from({ length: Math.max(0, Math.floor((c.keys - c.puffs) / 54)) }, (_, i) => ({ at: c.puffs + i * 54, file: SFX.uBoom, vol: 0.14, dur: 40, fadeOut: 12 })),
    ...cutHit(c.keys),
    ...Array.from({ length: 6 }, (_, i) => ({ at: c.keys + 4 + i * 8, file: SFX.click, vol: 0.1, dur: 8 })),
    ...cutHit(c.deeper),
    { at: c.deeper + 4, file: SFX.rumble, vol: 0.22, dur: c.years - c.deeper, fadeOut: 12 },
    { at: c.years + 4, file: SFX.swirl, vol: 0.18, dur: 50 },
    ...cutHit(c.listen),
    // M-01: music only (Full.tsx bed); the BlackBeat + sting into the closer
    ...sting(c.end - 10),
  ];
};
