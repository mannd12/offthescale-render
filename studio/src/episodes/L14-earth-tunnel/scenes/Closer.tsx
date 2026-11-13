// L14 scene "closer" (storyboard §3 "Closer": Z-01…Z-21 + the end card E-01, script lines 72-78, STUDIO_SET plates →
// void disc → dusk notebook → void, Act III). Shot components (hard cuts; continuous rows are phases):
// Z-01…Z-03 (plate 1 "42 MIN · a clean question", the clock fills to 42; three chips: no spin, no air, no wall) · Z-04
// (plate 2 "38:11 · PREM", the smooth layered ball turning) · Z-05+Z-06 (the lumpy outline smooths; ~10 s and ~4 s roll
// up; Tick measures with calipers) · Z-07+Z-08 (plate 3 "extrapolated": the dotted trend runs off the edge; the older
// estimate's column slides lower) · Z-09+Z-10 (plate 4 "friction, a chosen value": Tick turns the knob, the swing stalls,
// then frees) · Z-11 (the four plates slide into a row) · Z-12 (a brick wall rises and falls in) · Z-13 (the cut-away
// shrinks to a lit disc with a notch) · Z-14 (decade zoom into the 12 km notch; Tick plants a flag) · Z-15 (the 12,742 km
// ruler, the sliver at its start) · Z-16 (quake rays through every layer) · Z-17 (Tick draws the tunnel in a notebook) ·
// Z-18+Z-19 (the dotted line retracts to the centre; the far exit dims) · Z-20+Z-21 (the resting probe at the glowing
// centre; pull out to the whole planet, Tick tiny at the hatch) · E-01 (kit EndCard on the dusk dark field).
// Numbers drawn, each with its sources.md row: 42 MIN (#1 #2) · 38:11 (#1) · PREM (#19, F17: three letters only) · ~10 s ·
// ~4 s (#3) · 6,000 ± 500 °C (#17, V4 cleared) · "about 1,000 degrees lower" (#17) · 12 km (#14: 12,262 m) · 12,742 km
// (#13) · < 0.1 % (#13: 12.262 / 12,742 = 0.096 %). F12: the knob and the swing carry no values. F13: the probe rests at
// the centre; Tick stays at the surface and in the studio.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bloom, Counter, EndCard, Family, IF2, Kicker, Layer, Motes, Puffs, Sky, Stage, Stars, Sway, Tick, alpha, blobPts, cameraAt, mixHex, morphPath, rnd } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { R_EARTH, familyOf } from "../families";
import { L14_STRATA } from "../tunnel";
import { CutGlobe } from "../cutglobe";
import { LayerRings } from "../L14Card";
import { ClockFace, HatchLid, Plate, Probe } from "../props";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { C, CREAM, DUSK, INK, Pop, STUDIO, Slab, StudioRoom, Tag, VOID, clamp01, ez } from "./Cold";

/** Frames after the last line for the 20-s end card (EndCard from the kit). */
export const closerTail = 600;

const S = STUDIO;
const V = VOID;
const D = DUSK;
/** the end card's dark dusk field */
const CARD: Family = { ...familyOf("dusk"), sky: ["#071C24", "#0F3B4F", "#2A4A5A", "#3A5260"] };

export const cuesCloser = (t: SceneTiming) => {
  const { at, p } = cueKit(t);
  return {
    simplified: 0, // Z-01
    clean: p(0, "a clean question"),
    ball: p(0, "a spinning ball"), // Z-02 (phase)
    pretend: p(0, "but pretend it isn't"), // Z-03 (phase)
    noair: p(0, "with no air"),
    nowall: p(0, "and no wall"),
    prem: at(1), // Z-04
    corrections: p(1, "Corrections"), // Z-05
    seconds: p(1, "add up to seconds"), // Z-06 (phase)
    heat: at(2), // Z-07
    older: p(2, "and an older estimate"), // Z-08 (phase)
    friction: p(2, "And the friction"), // Z-09
    stall: p(2, "to keep the swing"), // Z-10 (phase)
    row: at(3), // Z-11
    walls: p(3, "not because anyone"), // Z-12
    done: at(4), // Z-13
    dug: p(4, "Dug twelve kilometres"), // Z-14
    tenth: p(4, "Less than a tenth"), // Z-15
    waves: at(5), // Z-16
    iron: p(5, "the iron"),
    middle: p(5, "the middle with no pull"),
    drawing: p(5, "The tunnel is a drawing"), // Z-17
    says: p(5, "And the drawing says"), // Z-18
    notother: p(5, "Not on the other side"), // Z-19 (phase)
    rest: at(6), // Z-20
    out: p(6, "where nothing pulls you"), // Z-21 (phase)
    card: t.frames, // E-01
    end: t.frames + closerTail,
  };
};
export type CCloser = ReturnType<typeof cuesCloser>;

// ---------------------------------------------------------------------------------------------------------------
// plates for the closer: a dark slab with a title (display face) and a sub line (label face, 30 px); text as written
// ---------------------------------------------------------------------------------------------------------------
const ZPlate: React.FC<{ x: number; y: number; w?: number; h?: number; drop?: number; title: string; sub?: string; size?: number }> = ({ x, y, w = 560, h = 210, drop = 1, title, sub, size = 56 }) => {
  const d = clamp01(drop);
  const fall = (1 - d * d) * -520;
  return (
    <g>
      <Plate x={x} y={y} w={w} h={h} text="" drop={d} />
      <g transform={`translate(${x} ${(y + fall).toFixed(1)})`} opacity={Math.min(1, d * 4)}>
        <text x={0} y={sub ? 6 : size * 0.36} textAnchor="middle" style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: size, fill: CREAM }}>
          {title}
        </text>
        {sub ? (
          <text x={0} y={62} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 30, letterSpacing: 2, fill: alpha(CREAM, 0.88) }}>
            {sub}
          </text>
        ) : null}
      </g>
    </g>
  );
};

const Check: React.FC<{ x: number; y: number; k: number; s?: number }> = ({ x, y, k, s = 40 }) =>
  k > 0 ? (
    <g>
      <circle cx={x} cy={y} r={s * 0.95} fill={C.teal} stroke={CREAM} strokeWidth={5} />
      <path d={`M${x - s * 0.45} ${y} L${x - s * 0.1} ${y + s * 0.35} L${x - s * 0.1 + s * 0.6 * k} ${y + s * 0.35 - s * 0.75 * k}`} stroke={CREAM} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ) : null;

const Rings: React.FC<{ f: number; cx: number; cy: number; every?: number; speed?: number; maxR?: number; color: string; width?: number }> = ({ f, cx, cy, every = 24, speed = 5, maxR = 400, color, width = 6 }) => {
  if (f < 0) return null;
  const n = Math.ceil(maxR / speed / every) + 1;
  const k0 = Math.floor(f / every);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const k = k0 - i;
        const r = (f - k * every) * speed;
        if (k < 0 || r <= 0 || r > maxR) return null;
        return <circle key={k} cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={width} opacity={0.9 * (1 - r / maxR)} />;
      })}
    </g>
  );
};

// ===============================================================================================================
// Z-01…Z-03 · STUDIO_SET: plate 1 drops ("42 MIN · A CLEAN QUESTION") as Tick sets it down; the clock beside it sweeps
// to 42 and its ring fills; three chips drop in on "a spinning ball", "no air", "no wall" and get checked; the globe chip
// spins, then stops. MOVER: the plate drop + the clock hand (≈ 5 px/f) and its ring, then the chips dropping (20 px/f) +
// the tube chip's probe sliding (8 px/f) + CycClouds.
// ===============================================================================================================
const ShotSimplified: ShotFC<CCloser> = ({ f, c }) => {
  const drop = clamp01((f - 4) / 16);
  const clk = ez(f, 24, c.ball);
  const hits = [c.ball, c.noair, c.nowall];
  const pre = c.pretend;
  const chipX = [1000, 1260, 1520];
  const spin = f < pre ? f * 6 : pre * 6 + 60 * (1 - Math.exp(-(f - pre) / 10));
  return (
    <Stage theme={S.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.01, frames: 320, seed: 61 }} vignette={0.16} grain={0.6}>
      <StudioRoom f={f + 1500} seed={41} hud={<Kicker x={120} y={130} text="WHAT WE SIMPLIFIED" color={INK} size={30} />}>
        <ZPlate x={420} y={330} drop={drop} title="42 MIN" /* #1 #2 */ sub="A CLEAN QUESTION" />
        <ClockFace x={420} y={640} r={120} minutes={42 * clk} /* #1 */ ring={(42 / 60) * clk} family={S} />
        <Tick x={170} y={860} pxPerM={150} frame={f} facing={1} pose="press" poseTo="stand" poseT={ez(f, 18, 40)} expression="neutral" look={0.6} />
        {chipX.map((x, i) => {
          const k = clamp01((f - hits[i]) / 12);
          if (k <= 0) return null;
          const y = 420 - (1 - k * k) * 260;
          const chk = ez(f, hits[i] + 12, hits[i] + 22);
          return (
            <g key={i}>
              <rect x={x - 110} y={y - 110} width={220} height={220} rx={36} fill={INK} stroke={CREAM} strokeWidth={6} />
              {i === 0 ? (
                <g>
                  <clipPath id="zg1">
                    <circle cx={x} cy={y} r={70} />
                  </clipPath>
                  <circle cx={x} cy={y} r={70} fill={C.teal} />
                  <g clipPath="url(#zg1)">
                    {Array.from({ length: 6 }, (_, j) => {
                      const ph = ((spin + j * 60) % 360) * (Math.PI / 180);
                      return <ellipse key={j} cx={x} cy={y} rx={Math.abs(Math.cos(ph)) * 70} ry={70} fill="none" stroke={C.tealDeep} strokeWidth={6} />;
                    })}
                  </g>
                  <circle cx={x} cy={y} r={70} fill="none" stroke={CREAM} strokeWidth={5} />
                  <rect x={x + 60} y={y - 26} width={26} height={52} rx={8} fill={C.saffron} stroke={CREAM} strokeWidth={4} />
                </g>
              ) : i === 1 ? (
                <g>
                  <path d={`M${x - 70} ${y + 70} L${x - 70} ${y - 10} A 70 70 0 0 1 ${x + 70} ${y - 10} L${x + 70} ${y + 70} Z`} fill={alpha(C.ice, 0.25)} stroke={C.ice} strokeWidth={7} />
                  <rect x={x - 86} y={y + 62} width={172} height={18} rx={6} fill={C.saffron} />
                  {Array.from({ length: 8 }, (_, j) => {
                    const life = clamp01(1 - (f - hits[1] - j * 3) / 20);
                    return <circle key={j} cx={x - 44 + (j % 4) * 30 + Math.sin(f / 4 + j) * 6} cy={y - 10 + Math.floor(j / 4) * 40 + Math.cos(f / 5 + j) * 6} r={8} fill={C.bone} opacity={life} />;
                  })}
                </g>
              ) : (
                <g>
                  <rect x={x - 90} y={y - 30} width={180} height={60} rx={30} fill={alpha(C.ice, 0.3)} stroke={C.ice} strokeWidth={6} />
                  <circle cx={x + Math.sin((f - hits[2]) / 7) * 58} cy={y} r={20} fill={C.probe} stroke={CREAM} strokeWidth={5} />
                </g>
              )}
              <Check x={x + 92} y={y - 92} k={chk} s={30} />
            </g>
          );
        })}
        {f >= c.ball ? <Tag x={1000 - 110} y={640} text="NO SPIN · NO AIR · NO WALL" F={S} dot={C.teal} size={32} opacity={ez(f, c.ball, c.ball + 10)} /> : null}
      </StudioRoom>
    </Stage>
  );
};

// ===============================================================================================================
// Z-04 · plate 2 drops ("38:11 · PREM, A SMOOTH AVERAGE"); the smooth layered ball turns beside it; rings spread evenly
// from it ("the same in every direction"). MOVER: the plate drop + the ball's radial hatch turning (≈ 6 px/f) + rings.
// ===============================================================================================================
const ShotPrem: ShotFC<CCloser> = ({ f }) => (
  <Pop f={f}>
    <Stage theme={S.theme} shotFrame={f} drift={{ zoom: 1.05, panX: -0.01, frames: 260, seed: 63 }} vignette={0.16} grain={0.6}>
      <StudioRoom f={f + 1800} seed={45} hud={<Tag x={120} y={150} text="PREM" /* #19, F17 */ F={S} dot={C.teal} size={32} />}>
        <Rings f={f} cx={1300} cy={480} every={26} speed={6} maxR={520} color={alpha(CREAM, 0.9)} width={8} />
        <CutGlobe cx={1300} cy={480} R={270} f={f} family={S} rot={f * 1.6} />
        <ZPlate x={520} y={420} drop={clamp01((f - 2) / 16)} title="38:11" /* #1 */ sub="PREM, A SMOOTH AVERAGE" />
      </StudioRoom>
    </Stage>
  </Pop>
);

// ===============================================================================================================
// Z-05 + Z-06 · a lumpy planet outline turns and smooths into the ball while two counters roll up to ~10 s (shape) and
// ~4 s (spin); at "add up to seconds" Tick measures the gap with calipers. MOVER: the outline turning and morphing (lumps
// ≈ 5 px/f) + the counters rolling, then the caliper jaws (5 px/f) + the second hand.
// ===============================================================================================================
const LUMPY = blobPts(520, 500, 300, 14, 7, 0.16);
const ROUND = blobPts(520, 500, 270, 14, 7, 0);
const ShotLumpy: ShotFC<CCloser> = ({ f, c }) => {
  const sec = c.seconds - c.corrections;
  const m = ez(f, 6, 70);
  const roll = ez(f, 10, 44);
  const jaw = 40 + Math.abs(Math.sin(f / 8)) * 50;
  const tk = f - sec;
  return (
    <Pop f={f}>
      <Stage theme={S.theme} shotFrame={f} drift={{ zoom: 1.05, frames: 260, seed: 65 }} vignette={0.16} grain={0.6}>
        <StudioRoom f={f + 2000} seed={49}>
          <g transform={`rotate(${f * 1.1} 520 500)`}>
            <path d={morphPath(LUMPY, ROUND, m, 30)} fill={alpha(C.crust, 0.55)} stroke={C.crustDeep} strokeWidth={8} />
          </g>
          <CutGlobe cx={520} cy={500} R={262} f={f} family={S} rot={f * 0.9} />
          {/* the counters: ~10 s (shape) and ~4 s (spin), #3 */}
          <g>
            <rect x={1000} y={240} width={560} height={300} rx={30} fill={alpha(INK, 0.8)} />
            <text x={1040} y={360} style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 96, fill: CREAM }}>~</text>
            <Counter x={1110} y={360} value={10 * roll} max={10} size={96} color={CREAM} unit="s" />
            <text x={1360} y={346} style={{ fontFamily: IF2.label, fontSize: 32, letterSpacing: 3, fill: C.saffron }}>SHAPE</text>
            <text x={1040} y={500} style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 96, fill: CREAM }}>~</text>
            <Counter x={1110} y={500} value={4 * roll} max={4} size={96} color={CREAM} unit="s" />
            <text x={1360} y={486} style={{ fontFamily: IF2.label, fontSize: 32, letterSpacing: 3, fill: C.saffron }}>SPIN</text>
          </g>
          {tk > 0 ? (
            <g opacity={ez(f, sec, sec + 8)}>
              <ClockFace x={1280} y={700} r={90} minutes={tk * 1.2} family={S} />
              <g transform="translate(800 260)">
                <rect x={-12} y={-150} width={24} height={300} rx={8} fill={C.saffron} stroke={INK} strokeWidth={4} />
                <rect x={-12} y={-150} width={90} height={22} rx={6} fill={C.saffron} stroke={INK} strokeWidth={4} />
                <rect x={-12 + jaw} y={-150} width={22} height={90} rx={6} fill={C.saffronCore} stroke={INK} strokeWidth={4} />
              </g>
              <Tick x={960} y={860} pxPerM={150} frame={f} facing={-1} pose="hold" expression="thinking" look={0.7} headTilt={-12} />
            </g>
          ) : null}
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// Z-07 + Z-08 · plate 3 ("EXTRAPOLATED"): lab dots, then a dotted trend line carries on off the edge (the 6,000 ± 500 °C
// is where it lands); at "an older estimate" two thermometer columns rise and the older one slides about 1,000 degrees
// lower. MOVER: the dotted head (16 px/f), then the columns rising (20 px/f) and the ghost sliding down (8 px/f).
// ===============================================================================================================
const ShotHeat: ShotFC<CCloser> = ({ f, c }) => {
  const ol = c.older - c.heat;
  const head = Math.min(1900, 260 + f * 16);
  const dots: [number, number][] = [
    [240, 840],
    [330, 812],
    [420, 790],
    [520, 760],
    [600, 742],
  ];
  const slope = (742 - 840) / (600 - 240);
  const g = f - ol;
  const rise = clamp01(g / 30);
  const ghost = ez(g, 30, 84);
  const H = 520;
  const BX = 1260;
  const BY = 900;
  return (
    <Pop f={f}>
      <Stage theme={S.theme} shotFrame={f} drift={{ zoom: 1.04, frames: 260, seed: 67 }} vignette={0.16} grain={0.6}>
        <StudioRoom
          f={f + 2200}
          seed={53}
          hud={
            <g>
              <Slab x={1080} y={200} value="6,000 ± 500" unit="°C" /* #17, V4 */ size={100} F={S} />
              {g > 0 ? <Tag x={120} y={940} text="OLDER ESTIMATE: ABOUT 1,000 DEGREES LOWER" /* #17 */ F={S} dot={C.saffron} size={28} opacity={ez(g, 30, 40)} /> : null}
            </g>
          }
        >
          <ZPlate x={440} y={330} drop={clamp01((f - 2) / 16)} title="EXTRAPOLATED" sub="IRON AT THE INNER-CORE EDGE" size={50} />
          <g opacity={g > 0 ? 1 - 0.6 * rise : 1}>
            <path d={`M240 840 L${head} ${840 + slope * (head - 240)}`} stroke={INK} strokeWidth={8} strokeDasharray="6 18" strokeDashoffset={-f * 3} strokeLinecap="round" fill="none" />
            {head < 1900 ? <circle cx={head} cy={840 + slope * (head - 240)} r={14} fill={C.saffron} stroke={CREAM} strokeWidth={4} /> : null}
            {dots.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={16} fill={C.teal} stroke={INK} strokeWidth={5} />
            ))}
          </g>
          {g > 0 ? (
            <g transform={`translate(0 ${((1 - rise) * 600).toFixed(1)})`}>
              {[0, 1].map((i) => {
                const x = BX + i * 220;
                const h = i === 0 ? H : H - (H / 6) * ghost; // ~1,000 of ~6,000 degrees lower (#17)
                return (
                  <g key={i} opacity={i === 1 ? 0.75 : 1}>
                    <rect x={x - 40} y={BY - H - 30} width={80} height={H + 30} rx={40} fill={CREAM} stroke={INK} strokeWidth={6} />
                    <rect x={x - 24} y={BY - h} width={48} height={h} rx={20} fill={i === 0 ? C.saffron : C.frost} />
                    <circle cx={x} cy={BY + 30} r={58} fill={i === 0 ? C.saffron : C.frost} stroke={INK} strokeWidth={6} />
                  </g>
                );
              })}
            </g>
          ) : null}
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// Z-09 + Z-10 · plate 4 ("FRICTION · A CHOSEN VALUE"): Tick turns a knob up (8°/f) and the swing beside it stalls; at
// "to keep the swing from stalling" the knob comes back down and the swing frees and wobbles on (±100 px). No values
// (F12). MOVER: the knob pointer turning + the swing (≈ 10 px/f) damping and freeing.
// ===============================================================================================================
const ShotKnob: ShotFC<CCloser> = ({ f, c }) => {
  const st = c.stall - c.friction;
  const up = ez(f, 20, 48);
  const back = ez(f, st, st + 24);
  const knob = -130 + 240 * up - 170 * back;
  // the swing: amplitude decays while the knob is high, comes back when it is lowered
  let amp = 26;
  if (f > 30) amp = 26 * Math.exp(-(Math.min(f, st) - 30) / 14);
  if (f > st) amp = Math.max(amp, 16 * ez(f, st + 6, st + 30));
  const th = amp * Math.sin(f / 9.5);
  const PX_ = 1340;
  const PY = 230;
  const L = 420;
  const bx = PX_ + Math.sin((th * Math.PI) / 180) * L;
  const by = PY + Math.cos((th * Math.PI) / 180) * L;
  const ka = (knob * Math.PI) / 180;
  return (
    <Pop f={f}>
      <Stage theme={S.theme} shotFrame={f} drift={{ zoom: 1.04, frames: 260, seed: 69 }} vignette={0.16} grain={0.6}>
        <StudioRoom f={f + 2400} seed={57} hud={<Tag x={120} y={940} text="CHOSEN BY THE AUTHORS" F={S} dot={C.saffron} size={30} />}>
          <ZPlate x={440} y={300} drop={clamp01((f - 2) / 16)} title="FRICTION" sub="A CHOSEN VALUE" /* #10 */ size={56} />
          {/* the knob */}
          <circle cx={680} cy={660} r={150} fill={INK} stroke={CREAM} strokeWidth={6} />
          {Array.from({ length: 9 }, (_, i) => {
            const a = ((-130 + i * 30) * Math.PI) / 180 - Math.PI / 2;
            return <line key={i} x1={680 + Math.cos(a) * 168} y1={660 + Math.sin(a) * 168} x2={680 + Math.cos(a) * 190} y2={660 + Math.sin(a) * 190} stroke={INK} strokeWidth={6} />;
          })}
          <circle cx={680} cy={660} r={110} fill={C.saffron} />
          <line x1={680} y1={660} x2={680 + Math.cos(ka - Math.PI / 2) * 100} y2={660 + Math.sin(ka - Math.PI / 2) * 100} stroke={INK} strokeWidth={18} strokeLinecap="round" />
          <Tick x={430} y={860} pxPerM={150} frame={f} facing={1} pose="press" expression="determined" look={0.5} headTilt={Math.sin(f / 6) * 4} />
          {/* the swing */}
          <rect x={PX_ - 120} y={PY - 30} width={240} height={30} rx={10} fill={INK} />
          <line x1={PX_} y1={PY} x2={bx} y2={by} stroke={INK} strokeWidth={8} />
          <circle cx={bx} cy={by} r={46} fill={C.probe} stroke={CREAM} strokeWidth={7} />
          <path d={`M${PX_ - Math.sin((26 * Math.PI) / 180) * L} ${PY + Math.cos((26 * Math.PI) / 180) * L} A ${L} ${L} 0 0 0 ${PX_ + Math.sin((26 * Math.PI) / 180) * L} ${PY + Math.cos((26 * Math.PI) / 180) * L}`} stroke={alpha(INK, 0.35)} strokeWidth={5} strokeDasharray="10 12" fill="none" />
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// Z-11 · the four plates slide in from scattered spots into one row; Tick steps back, proud; the camera pulls back.
// MOVER: the plates sliding (≈ 14 px/f) + the pull-back.
// ===============================================================================================================
const ROW: { t: string; s: string; size: number }[] = [
  { t: "42 MIN", s: "A CLEAN QUESTION", size: 50 }, // #1 #2
  { t: "38:11", s: "PREM, A SMOOTH AVERAGE", size: 50 }, // #1 #19
  { t: "EXTRAPOLATED", s: "THE 6,000 DEGREES", size: 38 }, // #17
  { t: "FRICTION", s: "A CHOSEN VALUE", size: 44 }, // #10
];
const ShotRow: ShotFC<CCloser> = ({ f, len }) => {
  const k = ez(f, 0, Math.min(len, 100));
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 520, zoom: 1.15 },
    { f: len, x: 960, y: 540, zoom: 1.0 },
  ]);
  const tk = ez(f, 30, 70);
  return (
    <Pop f={f}>
      <Stage theme={S.theme} cam={cam} vignette={0.16} grain={0.6}>
        <StudioRoom f={f + 2600} seed={61}>
          {ROW.map((r, i) => {
            const x1 = 270 + i * 460;
            const x0 = [-300, 700, 1300, 2200][i];
            const y0 = [200, -200, 1200, 300][i];
            return (
              <g key={i} transform={`rotate(${((1 - k) * [-14, 10, -8, 12][i]).toFixed(2)} ${x0 + (x1 - x0) * k} ${y0 + (430 - y0) * k})`}>
                <ZPlate x={x0 + (x1 - x0) * k} y={y0 + (430 - y0) * k} w={420} h={190} title={r.t} sub={r.s} size={r.size} />
              </g>
            );
          })}
          <Tick x={1180 + 160 * tk} y={860} pxPerM={150} frame={f} facing={-1} pose={tk >= 1 ? "hips" : "stand"} walk={tk > 0 && tk < 1 ? -f / 16 : undefined} expression="proud" look={0.4} />
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// Z-12 · a drawn tunnel wall of bricks stacks up fast, Tick shakes its head and the bricks fall in with dust. MOVER: the
// rows stacking (≈ 11 px/f) then the bricks falling and tumbling (to 20 px/f) + dust puffs.
// ===============================================================================================================
const ShotBricks: ShotFC<CCloser> = ({ f }) => {
  const BX = 300;
  const BW = 90;
  const BH = 44;
  const ROWS = 12;
  const COLS = 9;
  const FLOOR = 860;
  const fall0 = 46;
  return (
    <Pop f={f}>
      <Stage theme={S.theme} shotFrame={f} drift={{ zoom: 1.05, frames: 200, seed: 71 }} vignette={0.16} grain={0.6}>
        <StudioRoom f={f + 2800} seed={65}>
          {Array.from({ length: ROWS }, (_, r) =>
            Array.from({ length: COLS }, (_, cI) => {
              const born = r * 3;
              if (f < born) return null;
              const x = BX + cI * BW + (r % 2 ? BW / 2 : 0);
              const y0 = FLOOR - (r + 1) * BH;
              const drop = clamp01((f - born) / 4);
              let y = y0 - (1 - drop) * 120;
              let rot = 0;
              let dx = 0;
              const g = f - fall0 - (ROWS - r) * 1.5 - rnd(r * 13 + cI) * 6;
              if (g > 0) {
                y = Math.min(FLOOR - BH * 0.5 - rnd(r * 5 + cI) * 30, y0 + 0.9 * g * g);
                rot = Math.min(1, g / 20) * (rnd(r * 7 + cI) - 0.5) * 120;
                dx = (cI - COLS / 2) * g * 1.2;
              }
              return <rect key={`${r}-${cI}`} x={x + dx} y={y} width={BW - 6} height={BH - 6} rx={5} fill={mixHex(C.mantle, "#FFD6A0", rnd(r * 17 + cI) * 0.25)} stroke={C.mantleDeep} strokeWidth={3} transform={`rotate(${rot.toFixed(1)} ${x + dx + BW / 2} ${y + BH / 2})`} />;
            }),
          )}
          {f > fall0 + 6 ? (
            <g>
              <Puffs frame={f} x={520} y={FLOOR - 20} color={alpha(C.crust, 0.8)} period={12} size={46} rise={1.4} drift={3} life={40} seed={3} />
              <Puffs frame={f + 6} x={900} y={FLOOR - 20} color={alpha(C.crust, 0.8)} period={12} size={46} rise={1.4} drift={-3} life={40} seed={5} />
            </g>
          ) : null}
          <Tick x={1460} y={860} pxPerM={170} frame={f} facing={-1} pose="hips" expression="happy" look={0.5} headTilt={f > 30 && f < 70 ? Math.sin(f / 2.5) * 14 : 0} />
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// Z-13 · void: the cut-away shrinks to a full lit disc with a thin notch at the top. MOVER: the disc's edge (R 900 → 360,
// ≈ 7 px/f) + stars.
// ===============================================================================================================
const ShotDisc: ShotFC<CCloser> = ({ f, len }) => {
  const R = 900 - 540 * ez(f, 0, len);
  return (
    <Pop f={f}>
      <Stage theme={V.theme} drift={false} vignette={0.3} grain={0.5}>
        <Layer depth={1}>
          <Sky family={V} />
          <Stars frame={f} n={110} w={1920} h={1080} color={V.text} seed={71} size={2.4} twinkle={0.7} />
          <Bloom x={760} y={600} r={R * 1.5} color={V.light} core={0} strength={0.35} />
          <CutGlobe cx={760} cy={180 + R} R={R} f={f} family={V} notch={1} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// Z-14 · decade zoom into the notch at the top: 12 km (Kola, #14) to scale against the curve of the planet; Tick appears
// on the surface and plants a flag beside it. MOVER: the zoom (edges ≥ 7 px/f to the end) + the flag waving.
// ===============================================================================================================
const KOLA_KM = 12.262; // #14
const ShotNotch: ShotFC<CCloser> = ({ f, len }) => {
  const u = clamp01(f / Math.max(1, len));
  const sm = u * u * (3 - 2 * u);
  const Z = Math.exp(Math.log(420) * (0.85 * sm + 0.15 * u));
  const R = 360 * Z;
  const FX = 960;
  const FY = 470; // the top pole on screen
  const cy = FY + R;
  const kmPx = R / R_EARTH;
  const arc = (rr: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 48; i++) {
      const x = -100 + (2120 * i) / 48;
      const dx = x - FX;
      const y = dx * dx < rr * rr ? cy - Math.sqrt(rr * rr - dx * dx) : 1400;
      pts.push(`${i ? "L" : "M"}${x.toFixed(1)} ${Math.min(1400, y).toFixed(1)}`);
    }
    return pts.join(" ") + " L2020 1400 L-100 1400 Z";
  };
  const depth = Math.max(6, KOLA_KM * kmPx);
  const crust = 35 * kmPx; // the crust drawn at 35 km (5-40 km, #21; not labelled)
  const show = ez(f, len * 0.55, len * 0.75);
  return (
    <Pop f={f}>
      <Stage theme={V.theme} drift={false} vignette={0.3} grain={0.5}>
        <Layer depth={1}>
          <Sky family={V} />
          <Stars frame={f} n={110} w={1920} h={1080} color={V.text} seed={73} size={2.4} twinkle={0.7} />
          <Bloom x={FX} y={FY} r={700} color={V.light} core={0} strength={0.3} />
          <path d={arc(R + 14 + Z * 0.5)} fill={alpha(C.teal, 0.35)} />
          <path d={arc(R)} fill={C.crust} />
          {R - crust > 0 ? <path d={arc(R - crust)} fill={C.mantle} /> : null}
          <rect x={FX - Math.max(3, depth * 0.06)} y={FY - 1} width={Math.max(6, depth * 0.12)} height={depth} fill={V.sky[0]} />
          <circle cx={FX} cy={FY} r={30 + Math.sin(f / 5) * 5} fill="none" stroke={C.saffron} strokeWidth={5} opacity={1 - show} />
          {show > 0 ? (
            <g opacity={show}>
              <Tick x={FX + 170} y={FY + 4} pxPerM={110} frame={f} facing={-1} pose="hold" poseTo="point" poseT={show} expression="proud" look={0.3} />
              <Sway frame={f} x={FX + 60} y={FY} amp={8} period={30} seed={3}>
                <line x1={FX + 60} y1={FY} x2={FX + 60} y2={FY - 150} stroke={CREAM} strokeWidth={6} />
                <path d={`M${FX + 60} ${FY - 150} L${FX + 150} ${FY - 125 + Math.sin(f / 4) * 10} L${FX + 60} ${FY - 100} Z`} fill={C.saffron} />
              </Sway>
            </g>
          ) : null}
        </Layer>
        <Layer depth={0}>
          <Slab x={1240} y={300} value="12" unit="km" /* #14 */ size={130} F={V} opacity={ez(f, len * 0.5, len * 0.65)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// Z-15 · the diameter as a ruler, layers to scale (12,742 km, #13); the 12 km sliver pulses at its start; the tape's ticks
// scroll. MOVER: the ticks scrolling (14 px/f) + rings from the sliver (5 px/f).
// ===============================================================================================================
const ShotRuler: ShotFC<CCloser> = ({ f }) => {
  const X0 = 160;
  const X1 = 1760;
  const Y = 560;
  const segs = L14_STRATA.filter((s) => s.to > 0).map((s) => ({ a: Math.max(0, s.from) / 12742, b: Math.min(12742, s.to) / 12742, c: s.color }));
  const off = (f * 14) % 40;
  return (
    <Stage theme={V.theme} shotFrame={f} drift={{ zoom: 1.04, frames: 200, seed: 75 }} vignette={0.3} grain={0.5}>
      <Layer depth={1}>
        <Sky family={V} />
        <Stars frame={f} n={90} w={1920} h={1080} color={V.text} seed={77} size={2.2} twinkle={0.7} />
        {segs.map((s, i) => (
          <rect key={i} x={X0 + (X1 - X0) * s.a} y={Y} width={Math.max(6, (X1 - X0) * (s.b - s.a))} height={90} fill={s.c} />
        ))}
        <clipPath id="zr15">
          <rect x={X0} y={Y + 96} width={X1 - X0} height={60} />
        </clipPath>
        <g clipPath="url(#zr15)">
          {Array.from({ length: 44 }, (_, i) => {
            const x = X0 + i * 40 - off;
            return <line key={i} x1={x} y1={Y + 96} x2={x} y2={Y + (i % 5 ? 120 : 150)} stroke={CREAM} strokeWidth={i % 5 ? 3 : 5} />;
          })}
        </g>
        <Rings f={f} cx={X0} cy={Y + 45} every={20} speed={5} maxR={180} color={C.saffron} width={6} />
        <rect x={X0} y={Y - 30} width={6} height={150} fill={C.saffronCore} />
      </Layer>
      <Layer depth={0}>
        <Tag x={X1} y={Y - 60} text="12,742 km" /* #13 */ F={V} dot={C.crust} size={30} align="end" />
        <Slab x={200} y={360} value="< 0.1" unit="%" /* #13 #14: 0.096 % */ size={130} F={V} />
        <Tag x={210} y={440} text="OF THE WAY ACROSS" F={V} dot={C.saffron} size={30} />
      </Layer>
    </Stage>
  );
};

// ===============================================================================================================
// Z-16 · the whole disc: quake rays fan through every layer again and again; the layers light in turn on "the heat",
// "the iron", "the middle". MOVER: the rays racing (≈ 11 px/f) + rings from the source.
// ===============================================================================================================
const ShotRays: ShotFC<CCloser> = ({ f, c }) => {
  const iron = c.iron - c.waves;
  const mid = c.middle - c.waves;
  const hl = f < iron ? { layer: "mantle" as const, k: ez(f, 0, 10) } : f < mid ? { layer: "outer" as const, k: ez(f, iron, iron + 10) } : { layer: "inner" as const, k: ez(f, mid, mid + 10) };
  return (
    <Pop f={f}>
      <Stage theme={V.theme} shotFrame={f} drift={{ zoom: 1.04, frames: 240, seed: 79 }} vignette={0.3} grain={0.5}>
        <Layer depth={1}>
          <Sky family={V} />
          <Stars frame={f} n={110} w={1920} h={1080} color={V.text} seed={81} size={2.4} twinkle={0.7} />
          <Bloom x={600} y={640} r={700} color={V.light} core={0} strength={0.35} />
          <CutGlobe cx={760} cy={560} R={400} f={f} family={V} rays={(f % 80) / 80} highlight={hl} />
          <Rings f={f} cx={760} cy={160} every={20} speed={6} maxR={260} color={C.saffronCore} width={5} />
        </Layer>
        <Layer depth={0}>
          <Tag x={1240} y={200} text="WAVES · PHYSICS" F={V} dot={C.saffron} size={32} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// Z-17 · dusk: Tick draws the tunnel in a notebook; the pencil line crawls down the drawn planet and the page flutters.
// MOVER: the pencil head (≈ 12 px/f) + the page corner fluttering.
// ===============================================================================================================
const ShotNotebook: ShotFC<CCloser> = ({ f }) => {
  const NX = 1000;
  const NY = 560;
  const head = Math.min(520, f * 12);
  const fl = Math.sin(f / 4) * 30;
  return (
    <Pop f={f}>
      <Stage theme={D.theme} shotFrame={f} drift={{ zoom: 1.05, frames: 160, seed: 83 }} vignette={0.25} grain={0.5}>
        <Layer depth={1}>
          <Sky family={D} />
          <Stars frame={f} n={60} w={1920} h={500} color={D.text} seed={85} size={2.2} twinkle={0.7} />
          <Bloom x={1600} y={200} r={600} color={D.light} core={0} strength={0.45} />
          <rect x={-200} y={800} width={2400} height={400} fill={mixHex(D.near, C.crustDeep, 0.5)} />
          <g transform={`rotate(-4 ${NX} ${NY})`}>
            <rect x={NX - 520} y={NY - 330} width={1040} height={640} rx={20} fill={alpha(D.shadow, 0.5)} transform="translate(14 18)" />
            <rect x={NX - 520} y={NY - 330} width={520} height={640} rx={16} fill="#FFF4DE" />
            <rect x={NX} y={NY - 330} width={520} height={640} rx={16} fill="#FBEFD6" />
            {Array.from({ length: 12 }, (_, i) => (
              <line key={i} x1={NX - 500} y1={NY - 280 + i * 50} x2={NX + 500} y2={NY - 280 + i * 50} stroke={alpha(C.teal, 0.35)} strokeWidth={2} />
            ))}
            <circle cx={NX - 260} cy={NY - 20} r={240} fill="none" stroke={INK} strokeWidth={7} />
            <circle cx={NX - 260} cy={NY - 20} r={130} fill="none" stroke={C.mantle} strokeWidth={6} />
            <line x1={NX - 260} y1={NY - 280} x2={NX - 260} y2={NY - 280 + head} stroke={INK} strokeWidth={7} strokeDasharray="4 14" strokeLinecap="round" />
            <g transform={`translate(${NX - 260} ${NY - 280 + head}) rotate(-35)`}>
              <rect x={-10} y={-180} width={20} height={160} fill={C.saffron} stroke={INK} strokeWidth={3} />
              <path d="M-10 -20 L10 -20 L0 0 Z" fill={INK} />
            </g>
            <path d={`M${NX + 520} ${NY + 310} L${NX + 520} ${NY + 180} Q ${NX + 470 - fl} ${NY + 250} ${NX + 390 + fl * 0.5} ${NY + 310} Z`} fill="#EBDDC0" stroke={alpha(INK, 0.3)} strokeWidth={2} />
          </g>
          <Tick x={330} y={820} pxPerM={160} frame={f} facing={1} pose="press" expression="thinking" look={0.6} headTilt={-10} />
          <Motes frame={f} n={16} x={0} y={0} w={1920} h={800} color={alpha(D.light, 0.8)} seed={9} size={4} drift={40} />
        </Layer>
        <Layer depth={0}>
          <Kicker x={120} y={130} text="THE TUNNEL IS A DRAWING" color={D.text} size={30} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// Z-18 + Z-19 · void: the cold open's dotted line retracts from the far side and stops, glowing, at the centre; on "Not
// on the other side" the far exit dims out. MOVER: the line retracting (18 px/f), then rings from the centre (5 px/f) +
// the radial hatch turning.
// ===============================================================================================================
const ShotRetract: ShotFC<CCloser> = ({ f, c }) => {
  const no = c.notother - c.says;
  const to = 1 - ez(f, 4, 28);
  const dim = 1 - ez(f, no, no + 18);
  const cx = 960;
  const cy = 540;
  const R = 420;
  return (
    <Pop f={f}>
      <Stage theme={V.theme} shotFrame={f} drift={{ zoom: 1.05, frames: 200, seed: 87 }} vignette={0.3} grain={0.5}>
        <Layer depth={1}>
          <Sky family={V} />
          <Stars frame={f} n={110} w={1920} h={1080} color={V.text} seed={89} size={2.4} twinkle={0.7} />
          <CutGlobe cx={cx} cy={cy} R={R} f={f} family={V} line={{ from: -1, to }} rot={f * 0.8} />
          <Bloom x={cx} y={cy} r={160 + Math.sin(f / 6) * 20} color={C.saffronCore} core={20} coreColor="#FFFBEA" strength={ez(f, 24, 36)} />
          <Rings f={f - 28} cx={cx} cy={cy} every={22} speed={5} maxR={300} color={C.saffronCore} width={6} />
          <g opacity={dim}>
            <circle cx={cx} cy={cy + R} r={20} fill={C.bone} stroke={INK} strokeWidth={5} />
            <circle cx={cx} cy={cy + R} r={34 + Math.sin(f / 5) * 5} fill="none" stroke={C.bone} strokeWidth={4} />
          </g>
          {f > no ? <Rings f={f - no} cx={cx} cy={cy + R} every={12} speed={6} maxR={140} color={alpha(C.bone, 0.8)} width={5} /> : null}
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// Z-20 + Z-21 · the glowing centre: the probe at rest, pennant floating, rings spreading; at "where nothing pulls you"
// the camera pulls out to the whole planet, Tick tiny at the hatch far above with a hand up, the line between. MOVER:
// rings (5 px/f) + the slow push, then the pull-out (zoom 5 → 1).
// ===============================================================================================================
const ShotRest: ShotFC<CCloser> = ({ f, len, c }) => {
  const o = c.out - c.rest;
  const cx = 960;
  const cy = 560;
  const R = 420;
  const cam = cameraAt(f, [
    { f: 0, x: cx, y: cy, zoom: 5.0 },
    { f: o, x: cx, y: cy, zoom: 5.6 },
    { f: len, x: cx, y: 540, zoom: 1.0 },
  ]);
  return (
    <Stage theme={V.theme} cam={cam} vignette={0.3} grain={0.5}>
      <Layer depth={0.2}>
        <Sky family={V} />
        <Stars frame={f} n={110} w={1920} h={1080} color={V.text} seed={91} size={2.4} twinkle={0.7} />
      </Layer>
      <Layer depth={1}>
        <CutGlobe cx={cx} cy={cy} R={R} f={f} family={V} line={{ from: -1, to: 0 }} rot={f * 0.3} />
        <Bloom x={cx} y={cy} r={60} color={C.saffronCore} core={6} coreColor="#FFFBEA" strength={0.9} />
        <Probe x={cx} y={cy} size={34} f={f} lamp={false} tilt={Math.sin(f / 30) * 10} />
        <HatchLid x={cx} y={cy - R} r={10} open={1} family={V} />
        <Tick x={cx - 18} y={cy - R} pxPerM={20} frame={f} facing={1} pose="wave" expression="neutral" />
      </Layer>
      <Layer depth={0}>
        <g opacity={1 - ez(f, o, o + 20)}>
          <Rings f={f} cx={960} cy={540} every={24} speed={5} maxR={460} color={C.saffronCore} width={6} />
        </g>
      </Layer>
    </Stage>
  );
};

// ===============================================================================================================
// E-01 · the end card on the dusk dark field: layer rings launched every 60 f behind the wordmark; right half clear for
// the end-screen tiles. MOVER: the rings.
// ===============================================================================================================
const EndCardShot: React.FC<{ f: number; len: number }> = ({ f, len }) => (
  <AbsoluteFill>
    <Stage theme={CARD.theme} drift={false} vignette={0.3} grain={0.4}>
      <Layer depth={0.05}>
        <Sky stops={[CARD.sky[0], CARD.sky[1]]} />
        <Stars frame={f} n={70} w={1920} h={700} color={CARD.text} seed={21} size={1.8} twinkle={0.7} />
      </Layer>
      <Layer depth={1}>
        <g opacity={ez(f, 0, 20)}>
          <LayerRings f={f + 120} cx={420} cy={870} every={60} speed={5} width={26} maxR={600} opacity={0.55} />
        </g>
        <Motes frame={f} n={24} x={60} y={80} w={1800} h={900} color={CARD.light} seed={9} size={3} drift={40} />
      </Layer>
      <Layer depth={0}>
        <EndCard t={Math.min(1, f / Math.max(1, len))} family={CARD} />
      </Layer>
    </Stage>
    <AbsoluteFill style={{ background: V.sky[0], opacity: 1 - Math.min(1, f / 16) }} />
  </AbsoluteFill>
);

// ===============================================================================================================

export const SceneCloser: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesCloser(t);
  if (f >= c.card) return <EndCardShot f={f - c.card} len={c.end - c.card} />;
  const shots: ShotDef<CCloser>[] = [
    { from: 0, S: ShotSimplified, id: "Z-01" }, // + Z-02, Z-03
    { from: c.prem, S: ShotPrem, id: "Z-04" },
    { from: c.corrections, S: ShotLumpy, id: "Z-05" }, // + Z-06
    { from: c.heat, S: ShotHeat, id: "Z-07" }, // + Z-08
    { from: c.friction, S: ShotKnob, id: "Z-09" }, // + Z-10
    { from: c.row, S: ShotRow, id: "Z-11" },
    { from: c.walls, S: ShotBricks, id: "Z-12" },
    { from: c.done, S: ShotDisc, id: "Z-13" },
    { from: c.dug, S: ShotNotch, id: "Z-14" },
    { from: c.tenth, S: ShotRuler, id: "Z-15" },
    { from: c.waves, S: ShotRays, id: "Z-16" },
    { from: c.drawing, S: ShotNotebook, id: "Z-17" },
    { from: c.says, S: ShotRetract, id: "Z-18" }, // + Z-19
    { from: c.rest, S: ShotRest, id: "Z-20" }, // + Z-21
  ];
  return playShots(f, shots, c, c.card);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundCloser = (t: SceneTiming): Cue[] => {
  const c = cuesCloser(t);
  return [
    { at: 18, file: SFX.popLong, vol: 0.2, dur: 30 },
    ...[c.ball, c.noair, c.nowall].map((a) => ({ at: a + 10, file: SFX.pop, vol: 0.18, dur: 14 })),
    { at: c.pretend + 4, file: SFX.click, vol: 0.12, dur: 8 },
    ...cutHit(c.prem),
    { at: c.prem + 16, file: SFX.popLong, vol: 0.2, dur: 30 },
    ...cutHit(c.corrections),
    ...Array.from({ length: 6 }, (_, i) => ({ at: c.corrections + 10 + i * 6, file: SFX.click, vol: 0.06, dur: 6 })),
    { at: c.seconds, file: SFX.click, vol: 0.12, dur: 8 },
    ...cutHit(c.heat),
    { at: c.heat + 16, file: SFX.popLong, vol: 0.2, dur: 30 },
    { at: c.older, file: SFX.swirl, vol: 0.16, dur: 50 },
    ...cutHit(c.friction),
    ...Array.from({ length: 4 }, (_, i) => ({ at: c.friction + 22 + i * 7, file: SFX.click, vol: 0.1, dur: 8 })),
    { at: c.stall + 6, file: SFX.pop, vol: 0.16, dur: 14 },
    ...cutHit(c.row),
    { at: c.row + 4, file: SFX.swirl, vol: 0.18, dur: 50 },
    ...cutHit(c.walls),
    { at: c.walls + 46, file: SFX.debris, vol: 0.24, dur: 60, fadeOut: 15 },
    ...cutHit(c.done),
    { at: c.done, file: SFX.deepWhoosh, vol: 0.24, dur: 60 },
    ...cutHit(c.dug),
    { at: c.dug + 60, file: SFX.pop, vol: 0.18, dur: 14 },
    ...cutHit(c.tenth),
    ...Array.from({ length: 6 }, (_, i) => ({ at: c.tenth + 4 + i * 10, file: SFX.click, vol: 0.06, dur: 6 })),
    ...cutHit(c.waves),
    { at: c.waves + 4, file: SFX.swirl, vol: 0.18, dur: 50 },
    ...cutHit(c.drawing),
    { at: c.drawing + 4, file: SFX.click, vol: 0.12, dur: 8 },
    ...cutHit(c.says),
    { at: c.says + 2, file: SFX.riser, vol: 0.12, dur: 40, fadeIn: 6, fadeOut: 10 },
    { at: c.notother, file: SFX.pop, vol: 0.16, dur: 14 },
    ...cutHit(c.rest),
    { at: c.rest, file: SFX.wind, vol: 0.12, dur: c.card - c.rest, fadeIn: 20, fadeOut: 30 },
  ];
};
