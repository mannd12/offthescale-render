// L16 scene "l07" (storyboard §3 "7 · The core", script lines 55-60): the push into the core, its size, heat,
// pressure and density, fusion, the trapped light and the neutrinos. Package C.
// Shot components (hard cuts; PUSH/SLIDE rows are phases): 7-01 (+7-02, 7-03, 7-04: the push in with the HEAT dial,
// the radius bar with its fifth, the 138,000 km bracket, the Earth row) · 7-05 (HEAT at the stop, 15 million °C) ·
// 7-06 (walls closing on a box of air, 250 billion ×) · 7-07 (fusion) · 7-08 (the cube, 150 g) · 7-09 (the balance:
// 8× gold, 13× lead) · 7-10 (the ghost probe crossed out, the light trapped) · 7-11 (+7-12: the neutrino field, then
// the detector in the dark) · 7-13 (BOREXINO · 2020) · 7-14 (two fusion loops, one lit).
// Numbers drawn, each with its sources.md row (all from sundata.ts READ): ABOUT A FIFTH OF THE RADIUS (#19) · 138,000 km
// + NASA (#19) · MORE THAN 10 EARTHS + OUR SUM (#19, C: 138,000 / 12,742 = 10.8) · 15 million °C (#10 #19) · 250
// billion × sea-level air + OUR SUM (#19, C) · 150 g, ONE CUBIC CENTIMETRE (#19) · 8× GOLD, 13× LEAD (#19) · BOREXINO ·
// 2020 (#21). The core's radius bar and the Earth row are drawn in true proportion (SUN_R: core 0.2). F1: Tick stays
// on the rim, a ledge or the studio floor; F8: no alarm (the HEAT needle rattles, nothing burns).
import React from "react";
import { useCurrentFrame } from "remotion";
import { Bloom, Layer, Motes, Stage, Stars, Tick, alpha, cameraAt, mixHex, rnd, type Pt } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { L16_COLORS, STAR_TINTS, familyOf } from "../families";
import { READ } from "../sundata";
import { Neutrinos } from "../movers16";
import { SunCutaway } from "../sunbody";
import { HeatDial } from "../L16Dials";
import { OurSumPill, SourceChip } from "../stamps";
import { Balance, Bracket, Cube, Detector, EarthRow, GlassBox, Probe } from "../props16";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { CREAM, FamSky, INK, Ledge, Num, Pop, RadialField, Rim, Rings, RollMetric, StudioSet, Tag, TextPlate, Word, ez, mod, path1, photonHead } from "./c-parts";

const C = L16_COLORS;
const D2R = Math.PI / 180;

export const cuesL07 = (t: SceneTiming) => {
  const { at, p } = cueKit(t);
  return {
    core: 0, // 7-01
    fifth: p(0, "It reaches out"), // 7-02 phase
    km: p(0, "which NASA gives"), // 7-03 phase
    ten: p(0, "That's more than ten"), // 7-04 phase
    tops: at(1), // 7-05
    fifteen: p(1, "fifteen million"),
    pressure: p(1, "The pressure"), // 7-06
    fusion: at(2), // 7-07
    density: p(2, "Its density"), // 7-08
    balance: at(3), // 7-09
    lead: p(3, "or thirteen"),
    cant: at(4), // 7-10
    nu: p(4, "But the core makes"), // 7-11
    only: p(4, "Physicists call"), // 7-12 phase
    borexino: at(5), // 7-13
    cycles: p(5, "neutrinos from one"), // 7-14
    end: t.frames,
  };
};
export type C07 = ReturnType<typeof cuesL07>;

/** The core sphere (white-gold, pulsing; no face, no outline). */
const CoreBall: React.FC<{ x: number; y: number; r: number; f: number }> = ({ x, y, r, f }) => {
  const pulse = 0.5 + 0.5 * Math.sin(f / 5);
  return (
    <g>
      <Bloom x={x} y={y} r={r * 2.3} color={C.gold} strength={0.75} />
      <circle cx={x} cy={y} r={r} fill={C.whiteGold} />
      <circle cx={x} cy={y} r={r * (0.72 + 0.05 * pulse)} fill="#FFFDF2" opacity={0.75} />
      <circle cx={x} cy={y} r={r * 0.36} fill="#FFFFFF" opacity={0.6 + 0.4 * pulse} />
    </g>
  );
};

/** Atoms streaming outward past the camera (a push in): speed grows with radius, size too. */
const StreamAtoms: React.FC<{ f: number; cx: number; cy: number; pos: number; n?: number; seed?: number }> = ({ f, cx, cy, pos, n = 54, seed = 3 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const th = rnd(seed * 7 + i) * Math.PI * 2;
      const span = 1300;
      const u = mod(rnd(seed * 3 + i) * span + pos * (0.7 + 0.6 * rnd(i * 5)), span) / span;
      const r = 120 + u * u * 1300;
      const s = 6 + u * 22;
      const x = cx + Math.cos(th) * r;
      const y = cy + Math.sin(th) * r * 0.9;
      const fl = Math.max(0, Math.sin(f / 4 + i * 2.3)) ** 14;
      return (
        <g key={i} opacity={Math.min(1, u * 5)}>
          <circle cx={x} cy={y} r={s} fill={i % 3 ? C.violet : C.honey} stroke={alpha(C.whiteGold, 0.6)} strokeWidth={2} />
          {fl > 0.1 ? <circle cx={x} cy={y} r={s * 1.6} fill={C.whiteGold} opacity={fl} /> : null}
        </g>
      );
    })}
  </g>
);

// ===============================================================================================================
// 7-01 + 7-02 + 7-03 + 7-04 · the camera pushes through the radiative zone (atoms streaming 18 px/f) to the small
// bright core; the HEAT needle swings to the stop and rattles (F8: no alarm). Then the radius bar draws (40 px/f) with
// its fifth, the core's highlight rings grow (12 px/f); a bracket across the core's radius with 138,000 km + NASA; a
// row of Earth dots pops along that radius, past ten (true proportion: 11 Earths of 12,742 km in 138,000 km).
// ===============================================================================================================
const ShotCore: ShotFC<C07> = ({ f, len, c }) => {
  const p2 = c.fifth - c.core;
  const p3 = c.km - c.core;
  const p4 = c.ten - c.core;
  const cx = 1100;
  const cy = 540;
  const rc = path1(f, [
    [0, 70],
    [p2, 230],
  ]);
  const pos = path1(f, [
    [0, 0],
    [p2, p2 * 18],
    [len, p2 * 18 + (len - p2) * 9],
  ]);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: p4, x: 990, y: 540, zoom: 1.06 },
    { f: len, x: 960, y: 540, zoom: 1.0 },
  ]);
  const F = familyOf("core");
  const R = rc * 5; // the Sun's radius on screen, true proportion (core = 0.2)
  const bx0 = 640;
  const bar = ez(f, p2 + 2, p2 + 2 + R / 40);
  const heatV = ez(f, 8, 44);
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.25} grain={0.5}>
      <Layer depth={0.1}>
        <RadialField id="l07core" cx={cx} cy={cy} r={1500} stops={[[0, C.gold], [0.18, C.magenta], [0.55, "#3A1470"], [1, "#1C0F52"]]} />
      </Layer>
      <Layer depth={1}>
        <StreamAtoms f={f} cx={cx} cy={cy} pos={pos} />
        <CoreBall x={cx} y={cy} r={rc} f={f} />
        {f >= p2 ? <Rings f={f - p2} cx={cx} cy={cy} r0={rc} every={18} speed={12} maxR={220} color={C.whiteGold} width={7} /> : null}
        {f >= p3 ? <Bracket x1={cx} y1={cy - rc - 50} x2={cx + rc} y2={cy - rc - 50} draw={ez(f, p3 + 2, p3 + 10)} color={C.whiteGold} tick={18} /> : null}
        {f >= p4 ? <EarthRow x={cx} y={cy} n={11} r={rc / 11 / 2 + 0.4} gap={0} f={f} appear={ez(f, p4 + 2, p4 + 35)} /> : null}
        <Rim x={-400} w={520} />
        <Ledge x={170} y={330} w={160} />
        <Tick x={160} y={330} pxPerM={70} frame={f} facing={1} pose="hold" expression="proud" look={0.5} />
      </Layer>
      <Layer depth={0}>
        <g opacity={1 - ez(f, p2 - 10, p2)}>
          <HeatDial x={210} y={700} f={f} family={F} theme="dark" s={{ value: 0.2 + 0.8 * heatV, pinned: heatV >= 1 }} />
        </g>
        {f >= p2 ? (
          <g>
            {/* the radius bar, true proportions: core 0.2, radiative 0.7, convective 1.0 (SUN_R, rows 17 19 20) */}
            <clipPath id="l07bar">
              <rect x={bx0 - 10} y={940} width={(R + 20) * bar} height={60} />
            </clipPath>
            <g clipPath="url(#l07bar)">
              <rect x={bx0} y={950} width={R * 0.2} height={34} fill={C.whiteGold} />
              <rect x={bx0 + R * 0.2} y={950} width={R * 0.5} height={34} fill={C.honey} />
              <rect x={bx0 + R * 0.7} y={950} width={R * 0.3} height={34} fill={C.tangerine} />
            </g>
            <rect x={bx0} y={950} width={R * bar} height={34} fill="none" stroke={CREAM} strokeWidth={3} />
            <line x1={bx0 + R * 0.2} y1={930} x2={bx0 + R * 0.2} y2={1000} stroke={C.saffron} strokeWidth={7} opacity={ez(f, p2 + 8, p2 + 14)} />
            <Word x={bx0} y={925} text="centre" size={20} color={CREAM} />
            <Word x={bx0 + R * 0.2 + 12} y={925} text="a fifth" size={20} color={C.saffronCore} opacity={ez(f, p2 + 8, p2 + 14)} />
            <g opacity={1 - ez(f, p3 - 8, p3)}>
              <Tag x={600} y={110} text={READ.coreFifth.text /* #19 */} F={F} size={30} appear={ez(f, p2 + 4, p2 + 16)} />
            </g>
          </g>
        ) : null}
        {f >= p3 ? (
          <g opacity={ez(f, p3, p3 + 8)}>
            <TextPlate x={1370} y={150} w={480} h={170} color="#120A3A" opacity={0.72} />
            <RollMetric x={1395} y={260} value={READ.coreKm.value! /* #19 */} unit="km" k={ez(f, p3 + 2, p3 + 30)} size={84} who="7-03 core km" />
            <SourceChip x={1400} y={296} text="NASA" size={20} />
          </g>
        ) : null}
        {f >= p4 ? (
          <g>
            <Tag x={1370} y={380} text={READ.tenEarths.text /* #19 C */} F={F} size={28} appear={ez(f, p4 + 20, p4 + 32)} />
            <OurSumPill x={1376} y={446} size={26} appear={ez(f, p4 + 28, p4 + 38)} />
          </g>
        ) : null}
      </Layer>
    </Stage>
  );
};

// ===============================================================================================================
// 7-05 · close: the HEAT needle slams to the stop and rattles (±5° at 10 Hz); the core pulses, rings roll off it; the
// counter climbs to 15 million °C. MOVER: the needle slam + rattle on a 2× dial + core rings (10 px/f) + counter.
// ===============================================================================================================
const ShotTops: ShotFC<C07> = ({ f, c }) => {
  const s = c.fifteen - c.tops;
  const F = familyOf("core");
  const v = 0.55 + 0.45 * ez(f, 4, 16);
  return (
    <Pop f={f}>
      <Stage theme={F.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0.008, panY: 0, frames: 200, seed: 5 }} vignette={0.25} grain={0.5}>
        <Layer depth={0.1}>
          <RadialField id="l07tops" cx={1360} cy={540} r={1400} stops={[[0, C.whiteGold], [0.2, C.gold], [0.42, C.magenta], [0.75, "#3A1470"], [1, "#1C0F52"]]} />
        </Layer>
        <Layer depth={1}>
          <Rings f={f} cx={1360} cy={540} r0={300} every={14} speed={10} maxR={420} color={C.whiteGold} width={10} />
          <CoreBall x={1360} y={540} r={300 + 14 * Math.sin(f / 4)} f={f} />
        </Layer>
        <Layer depth={0}>
          <HeatDial x={110} y={150} f={f} family={F} theme="dark" scale={2} s={{ value: v, pinned: v >= 1 }} />
          <TextPlate x={90} y={800} w={720} h={180} color="#120A3A" opacity={0.75} />
          <RollMetric x={120} y={930} value={READ.coreC.value! /* #10 #19 */} unit="million °C" k={ez(f, s - 4, s + 26)} size={112} who="7-05 core temperature" />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-06 · studio: a glass box of air; two walls close in, in three shoves (≈ 11 px/f each), the dots pack; Tick leans
// his full weight on the right wall. about 250 billion × sea-level air + OUR SUM (row 19, our sum). MOVER: the walls
// closing + the dots bouncing faster in less room.
// ===============================================================================================================
const ShotPressure: ShotFC<C07> = ({ f }) => {
  const k = path1(f, [
    [0, 0],
    [8, 0],
    [36, 0.4],
    [50, 0.42],
    [76, 0.76],
    [90, 0.78],
    [114, 1],
  ]);
  const LW = 560 + 290 * k;
  const RW = 1460 - 290 * k;
  const shake = Math.sin(f * 1.7) * 3 * (1 - Math.abs(((k * 3) % 1) - 0.5) * 2);
  return (
    <Pop f={f}>
      <Stage theme={familyOf("studio").theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.008, panY: 0, frames: 200, seed: 6 }} vignette={0.2} grain={0.5}>
        <StudioSet f={f} seed={3} floor={900} />
        <Layer depth={1}>
          <rect x={540} y={330} width={940} height={560} rx={10} fill={alpha(C.cyan, 0.1)} />
          <line x1={540} y1={340} x2={1480} y2={340} stroke={mixHex(C.cyan, "#FFFFFF", 0.4)} strokeWidth={5} />
          <line x1={540} y1={882} x2={1480} y2={882} stroke={mixHex(C.cyan, "#FFFFFF", 0.4)} strokeWidth={5} />
          <GlassBox x={LW + 30} y={350} w={Math.max(40, RW - LW - 60)} h={524} f={f} n={64} speed={14 + 10 * k} seed={6} color={C.gold} frame={false} dot={11} />
          {[LW, RW].map((x, i) => (
            <g key={i} transform={`translate(${i ? shake : -shake} 0)`}>
              <rect x={x - (i ? 0 : 30)} y={320} width={30} height={580} rx={8} fill={C.saffron} stroke={INK} strokeWidth={4} />
              <rect x={x - (i ? 0 : 30) + 8} y={330} width={6} height={560} fill={C.saffronCore} opacity={0.7} />
            </g>
          ))}
          <Tick x={RW + 95} y={902} pxPerM={112} frame={f} facing={-1} pose="press" expression="determined" look={0.2} />
        </Layer>
        <Layer depth={0}>
          <TextPlate x={500} y={70} w={1100} h={210} color="#0E2A3E" opacity={0.62} />
          <RollMetric x={530} y={195} value={READ.pressure.value! /* #19 C */} pre="about" unit="billion × sea-level air" k={ez(f, 8, 40)} size={104} who="7-06 pressure" />
          <OurSumPill x={536} y={246} size={26} appear={ez(f, 30, 42)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-07 · fusion: at three sites, four hydrogen dots fly in (18 px/f) and merge; a flash ring expands (20 px/f); a
// helium cluster drifts off and sparks of light fly out (30 px/f). Pills HYDROGEN and HELIUM.
// ===============================================================================================================
const FusionSite: React.FC<{ x: number; y: number; f: number; period?: number; off?: number; seed?: number }> = ({ x, y, f, period = 54, off = 0, seed = 1 }) => {
  const u = mod(f + off, period);
  const a0 = rnd(seed * 7 + Math.floor((f + off) / period)) * 90;
  const H = (k: number): Pt => {
    const d = Math.max(0, 420 * (1 - u / 20));
    const a = (a0 + k * 90) * D2R;
    return [x + Math.cos(a) * d * (1 + k * 0.1), y + Math.sin(a) * d * (1 + k * 0.1)];
  };
  const age = u - 20;
  return (
    <g>
      {u < 20
        ? [0, 1, 2, 3].map((k) => {
            const [hx, hy] = H(k);
            return <circle key={k} cx={hx} cy={hy} r={32} fill={C.whiteGold} stroke={C.tangerine} strokeWidth={6} />;
          })
        : null}
      {age >= 0 ? (
        <g>
          {age < 14 ? <Bloom x={x} y={y} r={120 + age * 14} color="#FFFFFF" strength={1 - age / 14} /> : null}
          {age < 14 ? <circle cx={x} cy={y} r={20 + age * 20} fill="none" stroke="#FFFFFF" strokeWidth={10 * (1 - age / 14) + 2} opacity={1 - age / 14} /> : null}
          {Array.from({ length: 7 }, (_, i) => {
            const a = (i / 7) * Math.PI * 2 + seed;
            const r0 = 30 + age * 30;
            if (age > 18) return null;
            return <line key={i} x1={x + Math.cos(a) * r0} y1={y + Math.sin(a) * r0} x2={x + Math.cos(a) * (r0 + 46)} y2={y + Math.sin(a) * (r0 + 46)} stroke={C.gold} strokeWidth={7} strokeLinecap="round" opacity={1 - age / 18} />;
          })}
          {/* the helium cluster drifting off */}
          <g transform={`translate(${x + age * 3} ${y - age * 2})`} opacity={1 - Math.max(0, (age - 24) / 10)}>
            {(
              [
                [-14, -14, C.gold],
                [14, -14, C.magenta],
                [-14, 14, C.magenta],
                [14, 14, C.gold],
              ] as [number, number, string][]
            ).map(([dx, dy, col], i) => (
              <circle key={i} cx={dx * 1.5} cy={dy * 1.5} r={28} fill={col} stroke={C.whiteGold} strokeWidth={5} />
            ))}
          </g>
        </g>
      ) : null}
    </g>
  );
};

const ShotFusion: ShotFC<C07> = ({ f }) => {
  const F = familyOf("core");
  return (
    <Pop f={f}>
      <Stage theme={F.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0.01, panY: 0, frames: 200, seed: 7 }} vignette={0.25} grain={0.5}>
        <Layer depth={0.1}>
          <RadialField id="l07fus" cx={960} cy={540} r={1300} stops={[[0, C.amber], [0.3, C.magenta], [0.7, "#3A1470"], [1, "#1C0F52"]]} />
        </Layer>
        <Layer depth={1}>
          <FusionSite x={560} y={420} f={f} off={0} seed={1} period={44} />
          <FusionSite x={1180} y={700} f={f} off={11} seed={2} period={44} />
          <FusionSite x={1480} y={300} f={f} off={22} seed={3} period={44} />
          <FusionSite x={860} y={860} f={f} off={33} seed={4} period={44} />
          <FusionSite x={1000} y={260} f={f} off={6} seed={5} period={44} />
          <Motes frame={f} n={24} x={0} y={0} w={1920} h={1080} color={alpha(C.whiteGold, 0.8)} seed={5} size={4} drift={40} />
        </Layer>
        <Layer depth={0}>
          <Tag x={120} y={110} text="hydrogen" F={F} size={30} dot={C.whiteGold} appear={ez(f, 4, 14)} />
          <Tag x={120} y={180} text="helium" F={F} size={30} dot={C.magenta} appear={ez(f, 26, 36)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-08 · studio: one cubic centimetre of core gas (a big glass cube, dots swarming 14 px/f) on a weighing plate, its
// dial needle swinging; a gold lump drops in beside it; the counter rolls to 150 g. MOVER: the swarm + the needle +
// the counter + the lump's drop (24 px/f).
// ===============================================================================================================
const ShotDensity: ShotFC<C07> = ({ f }) => {
  const drop = Math.min(1, Math.max(0, (f - 14) / 20));
  const ly = 760 - (1 - drop) * 480;
  const na = -150 + 120 * ez(f, 10, 50) + Math.sin(f / 3) * 3 * ez(f, 50, 60);
  return (
    <Pop f={f}>
      <Stage theme={familyOf("studio").theme} shotFrame={f} drift={{ zoom: 1.08, panX: 0.01, panY: 0, frames: 200, seed: 8 }} vignette={0.2} grain={0.5}>
        <StudioSet f={f} seed={5} floor={900} />
        <Layer depth={1}>
          {/* the weighing plate and its dial */}
          <rect x={440} y={752} width={520} height={60} rx={14} fill={C.violet} stroke={INK} strokeWidth={4} />
          <circle cx={700} cy={850} r={70} fill={C.paper} stroke={INK} strokeWidth={5} />
          <line x1={700} y1={850} x2={700 + Math.cos(na * D2R) * 56} y2={850 + Math.sin(na * D2R) * 56} stroke={INK} strokeWidth={6} strokeLinecap="round" />
          <circle cx={700} cy={850} r={8} fill={C.magenta} />
          <Cube x={520} y={400} size={340} f={f} n={46} speed={14} color={C.gold} glass={C.cyan} />
          {/* a lump of gold for comparison (no claim about its size) */}
          <g transform={`translate(1110 ${ly.toFixed(1)})`}>
            <path d="M-90 0 L90 0 L64 -70 L-64 -70 Z" fill={C.gold} stroke={C.saffronDeep} strokeWidth={5} />
            <path d="M-50 -60 L40 -60" stroke="#FFF6D0" strokeWidth={6} strokeLinecap="round" opacity={0.8} />
          </g>
          <Word x={1110} y={810} text="gold" size={26} color={INK} align="middle" opacity={drop} />
        </Layer>
        <Layer depth={0}>
          <TextPlate x={1180} y={180} w={560} h={250} color="#0E2A3E" opacity={0.6} />
          <RollMetric x={1220} y={330} value={READ.coreG.value! /* #19 */} unit="g" k={ez(f, 10, 44)} size={150} who="7-08 density" />
          <Tag x={1220} y={392} text="one cubic centimetre" F={familyOf("studio")} size={26} appear={ez(f, 16, 28)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-09 · studio: a balance; eight gold lumps drop onto the right pan (24 px/f, every 6 f) until it balances the one
// cube of core gas; then they slide off and thirteen lead lumps drop (every 4 f). Tick drops them, counting. MOVER: the
// lumps dropping + the beam swinging (± 14° on a 760-px beam).
// ===============================================================================================================
const lumpPos = (i: number, n: number, w: number, h: number): Pt => {
  const rows = n === 8 ? [4, 3, 1] : [5, 4, 3, 1];
  let k = i;
  for (let r = 0; r < rows.length; r++) {
    if (k < rows[r]) return [(k - (rows[r] - 1) / 2) * (w + 4), -h / 2 - r * (h + 2) - 4];
    k -= rows[r];
  }
  return [0, 0];
};

const ShotBalance: ShotFC<C07> = ({ f, c }) => {
  const lead0 = c.lead - c.balance;
  const g0 = 6;
  const landG = (i: number) => g0 + i * 6;
  const landL = (i: number) => lead0 + 10 + i * 4;
  const nG = Array.from({ length: 8 }, (_, i) => (f >= landG(i) ? 1 : 0)).reduce<number>((a, b) => a + b, 0);
  const nL = Array.from({ length: 13 }, (_, i) => (f >= landL(i) ? 1 : 0)).reduce<number>((a, b) => a + b, 0);
  const leadOn = f >= lead0;
  const off = leadOn ? Math.min(900, (f - lead0) * 30) : 0;
  const share = leadOn ? nL / 13 : nG / 8;
  const tilt = -(1 - share) * 0.9 + Math.sin(f / 2.2) * 0.04 * (share < 1 ? 1 : 0.4);
  const lump = (i: number, n: number, land: number, color: string, w: number, h: number) => {
    const [lx, ly] = lumpPos(i, n, w, h);
    const fall = Math.max(0, land - f) * 24;
    if (fall > 520) return null;
    return <rect key={i} x={lx - w / 2} y={ly - h / 2 - fall} width={w} height={h} rx={5} fill={color} stroke={INK} strokeWidth={3} />;
  };
  const right = (
    <g>
      <g transform={`translate(${off} ${-off * 0.2})`} opacity={1 - Math.min(1, off / 400)}>
        {Array.from({ length: 8 }, (_, i) => lump(i, 8, landG(i), C.gold, 46, 26))}
      </g>
      {leadOn ? Array.from({ length: 13 }, (_, i) => lump(i, 13, landL(i), "#6B6FA8", 36, 22)) : null}
    </g>
  );
  const left = (
    <g>
      <rect x={-56} y={-108} width={112} height={104} rx={8} fill={alpha(C.cyan, 0.2)} stroke={mixHex(C.cyan, "#FFFFFF", 0.4)} strokeWidth={3} />
      <GlassBox x={-52} y={-104} w={104} h={96} f={f} n={16} speed={12} seed={4} color={C.gold} frame={false} dot={6} />
    </g>
  );
  return (
    <Pop f={f}>
      <Stage theme={familyOf("studio").theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.008, panY: 0, frames: 200, seed: 9 }} vignette={0.2} grain={0.5}>
        <StudioSet f={f} seed={7} floor={900} />
        <Layer depth={1}>
          <Balance x={960} y={400} w={760} f={f} tilt={tilt} left={left} right={right} />
          <Tick x={1570} y={902} pxPerM={100} frame={f} facing={-1} pose="heave" poseTo="hold" poseT={0.5 + 0.5 * Math.sin(f / 3)} expression="thinking" look={0.3} />
        </Layer>
        <Layer depth={0}>
          <Tag x={1180} y={120} text={READ.gold8.text /* #19 */} F={familyOf("studio")} size={32} appear={ez(f, landG(7), landG(7) + 10)} dot={C.gold} />
          <Tag x={1180} y={196} text={READ.lead13.text /* #19 */} F={familyOf("studio")} size={32} appear={ez(f, landL(12), landL(12) + 10)} dot="#6B6FA8" />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-10 · the quarter cutaway, close on the inside: the ghost probe at the surface is crossed out (40 px/f strokes);
// in the radiative zone a light dot is trapped in its zigzag (head 25 px/f, atoms flashing), the layer textures
// turning. MOVER: the trapped head + the cross-out strokes + the cutaway's rolling convection band.
// ===============================================================================================================
const trappedPts = (cx: number, cy: number, r0: number, r1: number, seed: number): Pt[] => {
  const out: Pt[] = [];
  let r = (r0 + r1) / 2;
  let a = -45;
  for (let i = 0; i < 70; i++) {
    out.push([cx + Math.cos(a * D2R) * r, cy + Math.sin(a * D2R) * r]);
    r += (rnd(seed * 11 + i) - 0.5) * 300;
    a += (rnd(seed * 13 + i) - 0.5) * 44;
    if (r < r0) r = 2 * r0 - r;
    if (r > r1) r = 2 * r1 - r;
    if (a < -82) a = -164 - a;
    if (a > -8) a = -16 - a;
  }
  return out;
};

const ShotTrapped: ShotFC<C07> = ({ f }) => {
  const cx = 300;
  const cy = 1010;
  const r = 960;
  const pts = trappedPts(cx, cy, r * 0.26, r * 0.66, 3);
  const tot = photonHead(pts, 1e9).total;
  const d = mod(f * 25, tot);
  const { head, drawn } = photonHead(pts, d);
  const trail = drawn.slice(Math.max(0, drawn.length - 22));
  const pa = { x: cx + Math.cos(-45 * D2R) * (r + 70), y: cy + Math.sin(-45 * D2R) * (r + 70) };
  const x1 = ez(f, 14, 20);
  const x2 = ez(f, 22, 28);
  const stroke = (ax: number, ay: number, bx: number, by: number, k: number) =>
    k > 0 ? (
      <g>
        <line x1={ax} y1={ay} x2={ax + (bx - ax) * k} y2={ay + (by - ay) * k} stroke={INK} strokeWidth={30} strokeLinecap="round" />
        <line x1={ax} y1={ay} x2={ax + (bx - ax) * k} y2={ay + (by - ay) * k} stroke={C.whiteGold} strokeWidth={18} strokeLinecap="round" />
      </g>
    ) : null;
  return (
    <Pop f={f}>
      <Stage theme={familyOf("dense").theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.008, panY: 0.004, frames: 200, seed: 10 }} vignette={0.2} grain={0.5}>
        <Layer depth={0.05}>
          <FamSky name="dense" />
        </Layer>
        <Layer depth={1}>
          <SunCutaway f={f} cx={cx} cy={cy} r={r} variant="quarter" wedge={-90} highlight="radiative" rotate={2.5} />
          {trail.length > 1 ? <path d={"M" + trail.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L")} fill="none" stroke="#FFFFFF" strokeWidth={11} strokeLinejoin="round" strokeLinecap="round" /> : null}
          {pts.slice(1).map((p, i) => {
            const at = photonHead(pts.slice(0, i + 2), 1e9).total;
            const age = (d - at) / 25;
            const fl = age >= 0 && age < 12 ? 1 - age / 12 : 0;
            return fl > 0 ? <circle key={i} cx={p[0]} cy={p[1]} r={12 + (1 - fl) * 26} fill="none" stroke="#FFFFFF" strokeWidth={5} opacity={fl} /> : null;
          })}
          <Bloom x={head[0]} y={head[1]} r={60} color="#FFFFFF" strength={0.95} />
          <circle cx={head[0]} cy={head[1]} r={12} fill="#FFFFFF" stroke={C.gold} strokeWidth={3} />
          {/* a dark disc behind the dashed ghost so it reads on the bright cutaway */}
          <circle cx={pa.x} cy={pa.y} r={150} fill="#2A0E4A" opacity={0.78} />
          <Probe x={pa.x} y={pa.y} size={210} f={f} variant="ghost" tilt={-45} />
          {stroke(pa.x - 130, pa.y - 130, pa.x + 130, pa.y + 130, x1)}
          {stroke(pa.x + 130, pa.y - 130, pa.x - 130, pa.y + 130, x2)}
          <Motes frame={f} n={16} x={0} y={0} w={1920} h={1080} color={alpha("#4A1D78", 0.6)} seed={4} size={3} drift={30} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-11 + 7-12 · KEY-ART FALLBACK (7-11). Neutrinos stream from the core straight through every layer and off the
// frame (36 px/f, whole frame); Tick ducks, small on a ledge. PUSH: out in the dark the Sun shrinks to the left, one
// streak after another crosses to a big detector sphere, which lights with expanding glow rings (14 px/f).
// ===============================================================================================================
const ShotNeutrinos: ShotFC<C07> = ({ f, c }) => {
  const p2 = c.only - c.nu;
  const k = ez(f, p2, p2 + 18);
  const sx = 960 - 700 * k;
  const sr = 430 * (1 - 0.6 * k);
  const dx = 1420;
  const dy = 560;
  const g = f - p2 - 10;
  const period = 27;
  const u = g >= 0 ? mod(g, period) : -1;
  const sx0 = sx + sr + 10;
  const travel = Math.max(60, dx - 300 - sx0);
  const uA = travel / 36; // frames for one streak to cross to the detector
  const age = u >= 0 ? u - uA : -1;
  const flash = age >= 0 && age < 12 ? 1 - age / 12 : 0;
  return (
    <Stage theme={familyOf(k < 0.5 ? "core" : "space").theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.006, panY: 0, frames: 220, seed: 11 }} vignette={0.3} grain={0.5}>
      <Layer depth={0.05}>
        <RadialField id="l07nu" cx={960} cy={540} r={1300} stops={[[0, C.magenta], [0.4, "#4B1C7A"], [1, "#120A3A"]]} />
        {k > 0 ? (
          <g opacity={k}>
            <FamSky name="space" />
            <Stars frame={f} n={70} x={-200} y={-100} w={2400} h={1300} color={STAR_TINTS[1]} seed={5} />
            <Stars frame={f} n={50} x={-200} y={-100} w={2400} h={1300} color={STAR_TINTS[0]} seed={9} />
          </g>
        ) : null}
      </Layer>
      <Layer depth={1}>
        <SunCutaway f={f} cx={sx} cy={540} r={sr} variant="full" highlight="core" rotate={2} />
        <Neutrinos f={f} cx={sx} cy={540} count={60} speed={36} len={170} width={6} r0={20} rMax={2400} />
        {k > 0 ? (
          <g opacity={k}>
            {g >= uA ? <Rings f={g - uA} cx={dx} cy={dy} every={period} speed={14} r0={80} maxR={420} color={C.cyan} width={8} /> : null}
            <Detector x={dx} y={dy} r={300} f={f} flash={flash} at={180} />
            {u >= 0 && age < 0 ? (
              (() => {
                const hx = sx0 + u * 36;
                return (
                  <g>
                    <path d={`M${hx - 220} ${dy - 3} L${hx} ${dy - 8} L${hx} ${dy + 8} L${hx - 220} ${dy + 3} Z`} fill={C.cyan} opacity={0.85} />
                    <circle cx={hx} cy={dy} r={10} fill="#FFFFFF" />
                  </g>
                );
              })()
            ) : null}
          </g>
        ) : null}
        <g opacity={1 - k}>
          <Ledge x={210} y={960} w={150} />
          <Tick x={205} y={960} pxPerM={64} frame={f} facing={1} pose="crouch" expression="happy" look={0.6} />
        </g>
      </Layer>
      <Layer depth={0}>
        <g opacity={1 - k}>
          <Tag x={120} y={110} text="neutrinos" F={familyOf("core")} size={32} dot={C.cyan} appear={ez(f, 6, 18)} />
        </g>
        {k > 0 ? <Tag x={960} y={110} text="the only direct probe" F={familyOf("space")} size={32} dot={C.cyan} align="middle" appear={ez(f, p2 + 10, p2 + 22)} /> : null}
      </Layer>
    </Stage>
  );
};

// ===============================================================================================================
// 7-13 · in the dark: the BOREXINO · 2020 name card (Tick writes the date in); the detector flashes each time a single
// neutrino streak (36 px/f) reaches it, a flash ring expanding 20 px/f.
// ===============================================================================================================
const ShotBorexino: ShotFC<C07> = ({ f }) => {
  const dx = 1330;
  const dy = 560;
  const period = 40;
  const u = mod(f, period);
  const x0 = -120;
  const y0 = 260;
  const ex = dx - 230;
  const ey = dy - 40;
  const L = Math.hypot(ex - x0, ey - y0);
  const s = Math.min(1, (u * 36) / L);
  const hx = x0 + (ex - x0) * s;
  const hy = y0 + (ey - y0) * s;
  const arrived = u * 36 >= L;
  const age = arrived ? u - L / 36 : -1;
  const ang = Math.atan2(ey - y0, ex - x0);
  const write = ez(f, 18, 46);
  return (
    <Pop f={f}>
      <Stage theme={familyOf("space").theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.008, panY: 0, frames: 200, seed: 12 }} vignette={0.3} grain={0.5}>
        <Layer depth={0.05}>
          <FamSky name="space" />
        </Layer>
        <Layer depth={0.3}>
          <Stars frame={f} n={70} x={-200} y={-100} w={2400} h={1300} color={STAR_TINTS[0]} seed={13} />
          <Stars frame={f} n={50} x={-200} y={-100} w={2400} h={1300} color={STAR_TINTS[2]} seed={17} />
        </Layer>
        <Layer depth={1}>
          {age >= 0 ? <circle cx={ex} cy={ey} r={30 + age * 20} fill="none" stroke="#E8FBFF" strokeWidth={8} opacity={Math.max(0, 1 - age / 18)} /> : null}
          <Detector x={dx} y={dy} r={330} f={f} flash={age >= 0 ? Math.max(0, 1 - age / 16) : 0} at={186} />
          {!arrived ? (
            <g>
              <path d={`M${hx - Math.cos(ang) * 240} ${hy - Math.sin(ang) * 240} L${hx} ${hy}`} stroke={C.cyan} strokeWidth={8} strokeLinecap="round" opacity={0.85} />
              <circle cx={hx} cy={hy} r={11} fill="#FFFFFF" />
            </g>
          ) : null}
          {/* the name card */}
          <rect x={172} y={292} width={600} height={300} rx={22} fill="#000" opacity={0.3} />
          <rect x={160} y={280} width={600} height={300} rx={22} fill={C.paper} />
          <rect x={160} y={280} width={600} height={70} rx={22} fill={C.magenta} />
          <rect x={160} y={330} width={600} height={20} fill={C.magenta} />
          <Word x={460} y={330} text="experiment" size={26} color={CREAM} align="middle" spacing={4} />
          <Word x={460} y={450} text="borexino" size={84} color={C.ink} align="middle" spacing={6} />
          <clipPath id="l07write">
            <rect x={300} y={470} width={330 * write} height={100} />
          </clipPath>
          <g clipPath="url(#l07write)">
            <Num x={460} y={550} text={String(READ.borexino.value) /* #21 */} size={80} color={C.violet} align="middle" who="7-13 year" />
          </g>
          {write > 0 && write < 1 ? <circle cx={300 + 330 * write} cy={530} r={10} fill={C.saffronCore} stroke={C.saffron} strokeWidth={3} /> : null}
          <Ledge x={600} y={760} w={170} />
          <Tick x={600} y={760} pxPerM={80} frame={f} facing={-1} pose="hold" expression="proud" staff look={0.3} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 7-14 · two fusion loops: the lit one's arrow runs round (24 px/f) lighting its nodes and throwing off a neutrino
// streak at one node; the other loop dim and dashed (it was not the one measured; no labels: the storyboard draws
// none). Core glow breathing between them. Holds 2.0 s after the line.
// ===============================================================================================================
const Loop: React.FC<{ cx: number; cy: number; r: number; f: number; lit: boolean; nodes: number }> = ({ cx, cy, r, f, lit, nodes }) => {
  const om = (lit ? 24 : 6) / r;
  const a = f * om - Math.PI / 2;
  const tail = lit ? 2.1 : 1.2;
  const pts: Pt[] = Array.from({ length: 40 }, (_, i) => {
    const t = a - tail + (tail * i) / 39;
    return [cx + Math.cos(t) * r, cy + Math.sin(t) * r];
  });
  const head = pts[pts.length - 1];
  const col = lit ? C.gold : C.lavender;
  return (
    <g opacity={lit ? 1 : 0.55}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={alpha(col, lit ? 0.4 : 0.5)} strokeWidth={lit ? 10 : 6} strokeDasharray={lit ? undefined : "14 12"} />
      <path d={"M" + pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L")} fill="none" stroke={col} strokeWidth={lit ? 16 : 8} strokeLinecap="round" />
      <g transform={`translate(${head[0]} ${head[1]}) rotate(${((a * 180) / Math.PI + 90).toFixed(1)})`}>
        <path d={`M0 ${lit ? -26 : -14} L${lit ? 30 : 16} 0 L0 ${lit ? 26 : 14} Z`} fill={col} />
      </g>
      {Array.from({ length: nodes }, (_, i) => {
        const na = -Math.PI / 2 + (i / nodes) * Math.PI * 2;
        const since = mod(a - na, Math.PI * 2) / om; // frames since the head passed this node
        const fl = lit && since < 12 ? 1 - since / 12 : 0;
        const nx = cx + Math.cos(na) * r;
        const ny = cy + Math.sin(na) * r;
        return (
          <g key={i}>
            <circle cx={nx} cy={ny} r={lit ? 26 : 18} fill={lit ? C.whiteGold : "#4B1C7A"} stroke={lit ? C.tangerine : C.lavender} strokeWidth={4} />
            {fl > 0 ? <circle cx={nx} cy={ny} r={26 + (1 - fl) * 40} fill="none" stroke="#FFFFFF" strokeWidth={6} opacity={fl} /> : null}
            {lit && i === 0 && since < 40 ? (
              <g>
                <line x1={nx} y1={ny - 30 - since * 36} x2={nx} y2={ny - 30 - since * 36 + 120} stroke={C.cyan} strokeWidth={6} strokeLinecap="round" opacity={1 - since / 40} />
              </g>
            ) : null}
          </g>
        );
      })}
    </g>
  );
};

const ShotCycles: ShotFC<C07> = ({ f }) => {
  const F = familyOf("core");
  const breathe = 0.5 + 0.5 * Math.sin(f / 9);
  return (
    <Pop f={f}>
      <Stage theme={F.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0.008, panY: 0, frames: 220, seed: 13 }} vignette={0.3} grain={0.5}>
        <Layer depth={0.1}>
          <RadialField id="l07cyc" cx={960} cy={560} r={1300} stops={[[0, C.gold], [0.25, C.magenta], [0.7, "#3A1470"], [1, "#1C0F52"]]} />
        </Layer>
        <Layer depth={1}>
          <Bloom x={960} y={560} r={260 + 60 * breathe} color={C.whiteGold} strength={0.5 + 0.2 * breathe} />
          <Loop cx={620} cy={570} r={240} f={f} lit nodes={6} />
          <Loop cx={1330} cy={570} r={200} f={f} lit={false} nodes={4} />
          <Motes frame={f} n={20} x={0} y={0} w={1920} h={1080} color={alpha(C.whiteGold, 0.8)} seed={8} size={3} drift={40} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================

export const SceneL07: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL07(t);
  const shots: ShotDef<C07>[] = [
    { from: 0, S: ShotCore, id: "7-01" }, // + 7-02, 7-03 (SLIDE), 7-04
    { from: c.tops, S: ShotTops, id: "7-05" },
    { from: c.pressure, S: ShotPressure, id: "7-06" },
    { from: c.fusion, S: ShotFusion, id: "7-07" },
    { from: c.density, S: ShotDensity, id: "7-08" },
    { from: c.balance, S: ShotBalance, id: "7-09" },
    { from: c.cant, S: ShotTrapped, id: "7-10" },
    { from: c.nu, S: ShotNeutrinos, id: "7-11" }, // + 7-12 (PUSH)
    { from: c.borexino, S: ShotBorexino, id: "7-13" },
    { from: c.cycles, S: ShotCycles, id: "7-14" },
  ];
  return playShots(f, shots, c, c.end);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL07 = (t: SceneTiming): Cue[] => {
  const c = cuesL07(t);
  const run = (at: number, n: number, gap = 5, vol = 0.07): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 6 }));
  return [
    { at: 2, file: SFX.riser, vol: 0.16, dur: 90, fadeOut: 20 },
    { at: c.fifth + 4, file: SFX.click, vol: 0.12, dur: 8 },
    ...run(c.km + 4, 6),
    ...run(c.ten + 4, 11, 3, 0.05).map((q) => ({ ...q, file: SFX.pop })),
    ...cutHit(c.tops),
    { at: c.tops + 6, file: SFX.boom, vol: 0.2, dur: 90, fadeOut: 30 },
    ...cutHit(c.pressure),
    { at: c.pressure + 6, file: SFX.rumble, vol: 0.14, dur: 110, fadeOut: 30 },
    ...cutHit(c.fusion),
    { at: c.fusion + 20, file: SFX.pop, vol: 0.14, dur: 14 },
    { at: c.fusion + 40, file: SFX.chime, vol: 0.12, dur: 60 },
    ...cutHit(c.density),
    { at: c.density + 14, file: SFX.click, vol: 0.12, dur: 8 },
    ...cutHit(c.balance),
    ...run(c.balance + 6, 8, 6, 0.08),
    ...run(c.lead + 10, 13, 4, 0.06),
    ...cutHit(c.cant),
    { at: c.cant + 14, file: SFX.click, vol: 0.14, dur: 8 },
    ...cutHit(c.nu),
    { at: c.nu + 2, file: SFX.whoosh, vol: 0.22, dur: 50 },
    { at: c.only + 10, file: SFX.popLong, vol: 0.16, dur: 30 },
    ...cutHit(c.borexino),
    { at: c.borexino + 20, file: SFX.chime, vol: 0.14, dur: 60 },
    ...cutHit(c.cycles),
    { at: c.cycles + 6, file: SFX.pop, vol: 0.14, dur: 14 },
  ];
};
