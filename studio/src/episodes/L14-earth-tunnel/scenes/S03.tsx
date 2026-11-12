// L14 scene l03 "The villain" (storyboard §3 "3 ·": shots 3-01…3-28 + ChapterCard 2 (4-00), script lines 20-29, petrol
// air tunnel ↔ STUDIO_SET inserts → deep petrol vacuum, Act I). Shot components (hard cuts; continuous rows are
// phases): 3-01 (the probe drops into teal haze; Tick peers over the rim) · 3-02 (PULL and PUSH arrows) · 3-03+3-04
// (they lock; SPEED flattens; Terminal Velocity) · 3-05 (the slate: the square) · 3-06+3-07 (×2 → ×4; Tick jerks back) ·
// 3-08+3-09 (the speed curve flattens under a ceiling) · 3-10 (a group of physicists, 2016) · 3-11+3-12 (the needle stops
// low; the bracket up to 8 km/s) · 3-13+3-14 (vacuum vs air) · 3-15+3-16 (the air squeezed; PRESSURE climbs, no readout)
// · 3-17 KEY ART I (the saffron hazard band; realistic travel: out) · 3-18 (on past the band) · 3-19 (nitrogen turns
// solid) · 3-20…3-22 (1.8 YEARS; a few tens of km; the 38-minute stopwatch) · 3-23+3-24 (the puck jam; pages flip) ·
// 3-25 (the pump) · 3-26…3-28 (bare walls, the seal, VACUUM, the dark slot) · BlackBeat + sting → ChapterCard 2.
// Numbers drawn, each with its sources.md row: ×2 · ×4 (#23a, F5) · 2016 (#8 #9: arXiv 1606.01852) · 8 km/s (#2, the SPEED
// stop and 3-12's metric) · 1.8 YEARS (#9, F6) · A FEW TENS OF km (#9). F1: no terminal-velocity number anywhere; the
// needle parks at an unlabelled plateau. V7 NOT verified: 3-17 and 3-18 carry NO depth number (no 175 km, no 420 km);
// the band and the ruler stand alone. F9: the PRESSURE needle in air has no readout (blank drums). Tick never in the
// tunnel; the crowd physicists are Tick-shaped in teal and saffron suits.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  BlackBeat,
  Bloom,
  GroundShadow,
  Headline,
  IF2,
  Kicker,
  Layer,
  Metric,
  Motes,
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
import { L14_STRATA, AirHaze, DepthRuler, StrataWall } from "../tunnel";
import { HatchLid, HazardBand, Probe, Pump } from "../props";
import { L14Card } from "../L14Card";
import { ShotDef, ShotFC, actBreakAt, playShots } from "../shots";
import { Cue, SFX, cutHit, sting } from "./cue-types";
import { Arrow, C, CREAM, ClockText, DUSK, Desert, EMBER, INK, PETROL, Pop, STUDIO, Slab, StudioRoom, Tag, clamp01, ez, fallDist } from "./Cold";

const P = PETROL;
const S = STUDIO;
const FLOOR = 860;

export const cuesL03 = (t: SceneTiming) => {
  const { at, p, frac, end } = cueKit(t);
  return {
    air: 0, // 3-01
    arrows: p(0, "Air pushes back"), // 3-02
    steady: p(0, "Then you stop"), // 3-03
    terminal: p(0, "terminal velocity"), // 3-04 headline
    square: at(1), // 3-05
    twice: p(1, "Go twice"), // 3-06
    four: p(1, "four times as hard"), // 3-07 (phase)
    curve: at(2), // 3-08
    flat: p(2, "that is why the climb"), // 3-09 (phase)
    group: at(3), // 3-10
    immediately: p(3, "almost immediately"), // 3-11
    nowhere: p(3, "Nowhere near"), // 3-12 (phase)
    split: at(4), // 3-13
    crawl: p(4, "settles into a steady crawl"), // 3-14 (phase)
    squeeze: at(5), // 3-15
    pressure: p(5, "Its pressure and density"), // 3-16 (phase)
    band: p(5, "The authors say"), // 3-17 (key art I at line 5 @ 0.85)
    key: frac(5, 0.85),
    out: p(5, "realistic travel is out"),
    deeper: at(6), // 3-18
    nitrogen: p(6, "the nitrogen"), // 3-19
    years: at(7), // 3-20
    wobble: p(7, "Then a slow wobble"), // 3-21 (phase)
    notmin: p(7, "Not a thirty-eight"), // 3-22 (phase)
    traffic: at(8), // 3-23
    pages: p(8, "stuck in the traffic"), // 3-24 (phase)
    pump: at(9), // 3-25
    bare: p(9, "We will too"), // 3-26
    vacuum: p(9, "From here"), // 3-27 (phase)
    falls: p(9, "and the probe falls"), // 3-28 (phase)
    last: end(9),
    brk: actBreakAt(t).start,
    end: t.frames,
  };
};
export type CL03 = ReturnType<typeof cuesL03>;

// ---------------------------------------------------------------------------------------------------------------
// the air tunnel: petrol, moon fill from 300°, the strata wall streaming, teal haze in the slot, the probe's lamp.
// ---------------------------------------------------------------------------------------------------------------
const SLOT = { cx: 640, gap: 300 };
const AirTunnel: React.FC<{
  f: number;
  scroll: number;
  density?: number;
  hazeSpeed?: number;
  crystals?: number;
  probeY?: number | null;
  shake?: number;
  cx?: number;
  gap?: number;
  x0?: number;
  x1?: number;
  depth?: number;
  ruler?: number | null;
  haze?: boolean;
  hazeTop?: number;
  hazeBottom?: number;
  seed?: number;
  children?: React.ReactNode;
}> = ({ f, scroll, density = 0.3, hazeSpeed = 12, crystals = 0, probeY = 470, shake = 0, cx = SLOT.cx, gap = SLOT.gap, x0 = -200, x1 = 1460, depth = 2, ruler = null, haze = true, hazeTop = 0, hazeBottom = 1080, seed = 1, children }) => (
  <g>
    <rect x={-300} y={-300} width={2600} height={1700} fill={P.sky[0]} />
    <StrataWall f={f} family={P} layers={L14_STRATA} depth={depth} pxPerKm={20} scroll={scroll} cx={cx} gap={gap} x0={x0} x1={x1} ruler={ruler} lamp={probeY != null ? { y: probeY } : null} />
    <Bloom x={cx + 420} y={60} r={360} color={P.light} core={0} strength={0.35} />
    {haze ? (
      <g>
        <clipPath id={`air${seed}`}>
          <rect x={cx - gap / 2 - 20} y={hazeTop} width={gap + 40} height={Math.max(0, hazeBottom - hazeTop)} />
        </clipPath>
        <g clipPath={`url(#air${seed})`}>
          <AirHaze f={f} x={cx - gap / 2 + 8} w={gap - 16} speed={hazeSpeed} density={density} crystals={crystals} seed={seed} />
        </g>
      </g>
    ) : null}
    {probeY != null ? <Probe x={cx + (shake ? Math.sin(f * 1.7) * shake : 0)} y={probeY + (shake ? Math.cos(f * 2.3) * shake * 0.5 : 0)} size={140} f={f} /> : null}
    {children}
    <Motes frame={f} n={20} x={x0} y={0} w={x1 - x0} h={1080} color={alpha(C.bone, 0.75)} seed={seed + 3} size={4.5} drift={40} />
  </g>
);

// ===============================================================================================================
// 3-01 · the probe drops through a tunnel full of teal haze; Tick peers over the hatch rim at the top (and is left
// behind as the camera follows). MOVER: haze bands streaming up (12 px/f) + the strata wall scrolling.
// ===============================================================================================================
const ShotAir: ShotFC<CL03> = ({ f }) => {
  const scroll = fallDist(f + 10, 0.8, 12) - 40;
  const surf = 280 - scroll;
  return (
    <Stage theme={P.theme} cam={{ x: 860, y: 540, zoom: 1.04 }} vignette={0.25} grain={0.5}>
      <Layer depth={1}>
        <AirTunnel f={f} scroll={scroll + 260} depth={0} density={0.25}>
          <rect x={-300} y={surf - 700} width={2600} height={700} fill={mixHex(P.sky[0], "#082028", 0.4)} />
          <rect x={SLOT.cx - SLOT.gap / 2 - 60} y={surf - 14} width={SLOT.gap + 120} height={20} rx={8} fill={C.saffron} />
          <GroundShadow x={SLOT.cx - SLOT.gap / 2 - 110} y={surf + 2} rx={50} color={P.shadow} opacity={0.5} blur={8} />
          <Tick x={SLOT.cx - SLOT.gap / 2 - 110} y={surf - 6} pxPerM={120} frame={f} facing={1} pose="crouch" expression="worried" look={0.8} headTilt={18} />
        </AirTunnel>
      </Layer>
      <Layer depth={0}>
        <Kicker x={120} y={130} text="THE VILLAIN" color={P.text} size={30} />
      </Layer>
    </Stage>
  );
};

// ===============================================================================================================
// 3-02 · two arrows on the probe: PULL (down, thick) and PUSH (up, growing from nothing). MOVER: the PUSH arrow
// growing (≈ 3.3 px/f) + the wall (10 px/f) + haze.
// ===============================================================================================================
const ShotArrows: ShotFC<CL03> = ({ f, len }) => {
  const push = 30 + 190 * ez(f, 4, len);
  const py = 520;
  return (
    <Pop f={f}>
      <Stage theme={P.theme} shotFrame={f} drift={{ zoom: 1.1, panX: 0.02, panY: 0.01, frames: len + 40, seed: 2 }} vignette={0.25} grain={0.5}>
        <Layer depth={1}>
          <AirTunnel f={f + 60} scroll={600 + f * 10} density={0.35} probeY={py} shake={3}>
            <Arrow x1={SLOT.cx + 230} y1={py - 60} x2={SLOT.cx + 230} y2={py + 200} color={C.saffron} w={26} head={60} />
            <Arrow x1={SLOT.cx - 230} y1={py + 140} x2={SLOT.cx - 230} y2={py + 140 - push} color={C.bone} w={26} head={60} />
          </AirTunnel>
        </Layer>
        <Layer depth={0}>
          <Tag x={SLOT.cx + 270} y={py + 80} text="PULL" F={P} dot={C.saffron} size={30} />
          <Tag x={SLOT.cx - 270} y={py + 80} text="PUSH" F={P} dot={C.bone} size={30} align="end" />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 3-03 + 3-04 · the arrows come level and lock; the SPEED needle climbs then flattens (no number, F1); the camera
// pulls back on the steady fall; Terminal Velocity. MOVER: haze (14 px/f) + the wall at a constant 12 px/f + needle.
// ===============================================================================================================
const ShotSteady: ShotFC<CL03> = ({ f, len, c }) => {
  const term = c.terminal - c.steady;
  const py = 500;
  const sp = 0.22 * (1 - Math.exp(-f / 14)); // climbs, then flattens (unlabelled plateau, F1)
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.25 },
    { f: len, x: 960, y: 540, zoom: 1.0 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={P.theme} cam={cam} vignette={0.25} grain={0.5}>
        <Layer depth={1}>
          <AirTunnel f={f + 120} scroll={1200 + f * 12} density={0.4} hazeSpeed={14} probeY={py}>
            <Arrow x1={SLOT.cx + 230} y1={py - 40} x2={SLOT.cx + 230} y2={py + 180} color={C.saffron} w={24} head={56} />
            <Arrow x1={SLOT.cx - 230} y1={py + 180} x2={SLOT.cx - 230} y2={py - 40} color={C.bone} w={24} head={56} />
            <rect x={SLOT.cx - 250} y={py + 64} width={500} height={10} rx={5} fill={C.saffronCore} opacity={0.8 * ez(f, 2, 10)} />
          </AirTunnel>
        </Layer>
        <Layer depth={0}>
          <L14Gauges family={P} frame={f} theme="light" speed={{ value: sp, stop: STOP.speed /* #2 */ }} />
          <g opacity={ez(f, term - 4, term + 8)}>
            <rect x={70} y={790} width={1000} height={170} rx={26} fill={alpha(P.shadow, 0.8)} />
            <Headline x={110} y={915} lines={["Terminal Velocity"]} size={104} color={P.text} accent={C.saffron} rule={false} />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 3-05 · STUDIO: Tick at a slate chalks a unit square, then one of double the side (four of the first inside).
// MOVER: the chalk heads (12-20 px/f) + the second square growing.
// ===============================================================================================================
const chalkRect = (x: number, y: number, s: number, k: number) => {
  const per = 4 * s;
  const L = per * clamp01(k);
  const pts: [number, number][] = [
    [x, y],
    [x + s, y],
    [x + s, y + s],
    [x, y + s],
    [x, y],
  ];
  let acc = 0;
  const d: string[] = [`M${x} ${y}`];
  let head: [number, number] = [x, y];
  for (let i = 1; i < pts.length; i++) {
    const seg = s;
    if (acc + seg <= L) {
      d.push(`L${pts[i][0]} ${pts[i][1]}`);
      head = pts[i];
      acc += seg;
    } else {
      const u = (L - acc) / seg;
      head = [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * u, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * u];
      d.push(`L${head[0]} ${head[1]}`);
      break;
    }
  }
  return { d: d.join(" "), head };
};
const ShotSquare: ShotFC<CL03> = ({ f, len }) => {
  const k1 = clamp01((f * 16) / 640);
  const k2 = clamp01(((f - 40) * 20) / 1360);
  const r1 = chalkRect(380, 330, 160, k1);
  const r2 = chalkRect(700, 250, 340, k2);
  return (
    <Pop f={f}>
      <Stage theme={S.theme} shotFrame={f} drift={{ zoom: 1.08, panX: 0.03, panY: 0.01, frames: len + 60, seed: 3 }} vignette={0.12} grain={0.5}>
        <StudioRoom f={f + 100} seed={5} hud={<Tag x={120} y={980} text="GROWS WITH THE SQUARE" F={S} dot={C.saffron} size={30} />}>
          <rect x={260} y={150} width={980} height={600} rx={20} fill={mixHex(P.sky[0], INK, 0.3)} stroke={C.saffronDeep} strokeWidth={14} />
          <path d={r1.d} stroke={CREAM} strokeWidth={10} fill="none" strokeLinecap="round" />
          <path d={r2.d} stroke={C.saffronCore} strokeWidth={10} fill="none" strokeLinecap="round" />
          {k2 >= 1 ? (
            <g opacity={ez(f, 40 + 68, 40 + 80)}>
              <line x1={870} y1={250} x2={870} y2={590} stroke={C.saffronCore} strokeWidth={5} strokeDasharray="12 10" />
              <line x1={700} y1={420} x2={1040} y2={420} stroke={C.saffronCore} strokeWidth={5} strokeDasharray="12 10" />
            </g>
          ) : null}
          {[r1, r2].map((r, i) => ((i === 0 ? k1 : k2) > 0 && (i === 0 ? k1 : k2) < 1 ? <circle key={i} cx={r.head[0]} cy={r.head[1]} r={14} fill={CREAM} /> : null))}
          <GroundShadow x={1450} y={FLOOR + 3} rx={60} color={S.shadow} opacity={0.35} blur={8} />
          <Tick x={1450} y={FLOOR} pxPerM={160} frame={f} facing={-1} pose="press" staff expression="proud" look={0.5} />
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 3-06 + 3-07 · two dials: SPEED jumps ×1 → ×2, PUSH leaps ×1 → ×4 (#23a); Tick jerks back as the PUSH needle leaps
// and a "×4" stamp slams on. MOVER: two needles sweeping (4°/f and 3°/f) + Tick's lean-back + the stamp slam.
// ===============================================================================================================
const BigDial: React.FC<{ x: number; y: number; r: number; v: number; max: number; title: string; f: number }> = ({ x, y, r, v, max, title, f }) => {
  const ang = (u: number) => Math.PI + (u / max) * Math.PI;
  const a = ang(v) + Math.sin(f / 3) * 0.01;
  return (
    <g>
      <path d={`M${x - r - 30} ${y + 40} A${r + 30} ${r + 30} 0 0 1 ${x + r + 30} ${y + 40} Z`} fill={INK} />
      <path d={`M${x - r} ${y} A${r} ${r} 0 0 1 ${x + r} ${y}`} stroke={alpha(C.bone, 0.5)} strokeWidth={10} fill="none" />
      <path d={`M${x - r + 20} ${y} A${r - 20} ${r - 20} 0 0 1 ${x + Math.cos(a) * (r - 20)} ${y + Math.sin(a) * (r - 20)}`} stroke={C.vermilion} strokeWidth={16} fill="none" strokeLinecap="round" />
      {Array.from({ length: max + 1 }, (_, i) => (
        <g key={i}>
          <line x1={x + Math.cos(ang(i)) * (r - 6)} y1={y + Math.sin(ang(i)) * (r - 6)} x2={x + Math.cos(ang(i)) * (r + 14)} y2={y + Math.sin(ang(i)) * (r + 14)} stroke={C.bone} strokeWidth={6} />
          <text x={x + Math.cos(ang(i)) * (r + 48)} y={y + Math.sin(ang(i)) * (r + 48) + 12} textAnchor="middle" style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 34, fill: C.bone }}>
            {`×${i}`}
          </text>
        </g>
      ))}
      <line x1={x} y1={y} x2={x + Math.cos(a) * (r - 30)} y2={y + Math.sin(a) * (r - 30)} stroke={C.vermilion} strokeWidth={12} strokeLinecap="round" />
      <circle cx={x} cy={y} r={20} fill={C.vermilion} />
      <text x={x} y={y + 90} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 34, letterSpacing: 4, fill: C.bone }}>
        {title}
      </text>
    </g>
  );
};
const ShotTimes: ShotFC<CL03> = ({ f, len, c }) => {
  const four = c.four - c.twice;
  const s = 1 + ez(f, 4, 24);
  const pu = 1 + 3 * ez(f, four - 16, four + 2);
  const st = ramp(f, four, four + 7);
  return (
    <Pop f={f}>
      <Stage theme={S.theme} shotFrame={f} drift={{ zoom: 1.1, panX: 0.03, panY: 0.01, frames: len + 40, seed: 4 }} vignette={0.12} grain={0.5}>
        <StudioRoom f={f + 300} seed={7}>
          <BigDial x={460} y={520} r={250} v={s} max={2} title="SPEED" f={f} />
          <BigDial x={1180} y={520} r={250} v={pu} max={4} title="PUSH" f={f + 9} />
          <Metric x={460} y={250} value={`×${s >= 1.98 ? 2 : 1}`} /* #23a */ size={110} color={INK} align="middle" />
          <Metric x={1180} y={250} value={`×${Math.min(4, Math.floor(pu + 0.02))}`} /* #23a: counts 1 → 4 */ size={110} color={INK} align="middle" />
          {st > 0 ? (
            <g transform={`translate(1460 330) rotate(-14) scale(${2.2 - 1.2 * st})`} opacity={Math.min(1, st * 3)}>
              <rect x={-110} y={-70} width={220} height={140} rx={20} fill={C.saffron} stroke={INK} strokeWidth={8} />
              <text x={0} y={32} textAnchor="middle" style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 96, fill: INK }}>
                ×4
              </text>
            </g>
          ) : null}
          <GroundShadow x={1700} y={FLOOR + 3} rx={60} color={S.shadow} opacity={0.35} blur={8} />
          <Tick x={1700 + ez(f, four - 2, four + 8) * 60} y={FLOOR} pxPerM={160} frame={f} facing={-1} pose={f < four - 2 ? "think" : "shield"} expression={f < four - 2 ? "thinking" : "surprised"} look={0.5} tilt={-ez(f, four - 2, four + 8) * 10} squash={impact(f, four + 2, 0.12, 10)} />
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 3-08 + 3-09 · a speed-vs-time curve draws beside the falling probe: steep, then flattening; then it levels under a
// dotted ceiling while the probe jitters and air streams up past it. MOVER: the curve's head (12 px/f) + the wall
// (12 px/f); then streamers rising (14 px/f) + the probe vibrating.
// ===============================================================================================================
const ShotCurve: ShotFC<CL03> = ({ f, len, c }) => {
  const flat = c.flat - c.curve;
  const X0 = 860;
  const X1 = 1420;
  const Y0 = 260;
  const Y1 = 820;
  const k = clamp01((f * 12) / (X1 - X0));
  const ceil = Y1 - (Y1 - Y0) * 0.55;
  const cy = (u: number) => Y1 - (Y1 - Y0) * 0.55 * (1 - Math.exp(-u * 7));
  const pts = Array.from({ length: 41 }, (_, i) => `${i ? "L" : "M"}${(X0 + (X1 - X0) * k * (i / 40)).toFixed(1)} ${cy(k * (i / 40)).toFixed(1)}`).join(" ");
  const jit = f >= flat ? 6 : 1.5;
  return (
    <Pop f={f}>
      <Stage theme={P.theme} cam={{ x: 960, y: 540, zoom: f < flat ? 1.0 : 1.0 + (f - flat) * 0.003 }} vignette={0.25} grain={0.5}>
        <Layer depth={1}>
          <AirTunnel f={f + 200} scroll={2000 + f * 12} density={0.45} hazeSpeed={14} cx={420} gap={260} x1={760} probeY={480} shake={jit} seed={4}>
            {f >= flat ? (
              <g transform="rotate(-90 420 540)">
                <Streamers f={f} n={10} x0={-200} x1={1300} y0={420} y1={660} len={200} width={7} speed={14} color={C.bone} opacity={0.7} seed={5} />
              </g>
            ) : null}
          </AirTunnel>
          <rect x={X0 - 50} y={Y0 - 70} width={X1 - X0 + 100} height={Y1 - Y0 + 130} rx={24} fill={alpha(P.shadow, 0.82)} stroke={alpha(C.bone, 0.4)} strokeWidth={3} />
          <line x1={X0} y1={Y0 - 20} x2={X0} y2={Y1} stroke={C.bone} strokeWidth={4} />
          <line x1={X0} y1={Y1} x2={X1 + 20} y2={Y1} stroke={C.bone} strokeWidth={4} />
          <line x1={X0} y1={ceil} x2={X1} y2={ceil} stroke={C.saffronCore} strokeWidth={5} strokeDasharray="14 12" opacity={ez(f, flat - 10, flat + 6)} />
          <path d={pts} stroke={C.saffron} strokeWidth={10} fill="none" strokeLinecap="round" />
          <circle cx={X0 + (X1 - X0) * k} cy={cy(k)} r={16} fill={C.teal} stroke={INK} strokeWidth={4} />
          <text x={X1 + 10} y={Y1 + 50} textAnchor="end" style={{ fontFamily: IF2.label, fontSize: 24, letterSpacing: 2, fill: C.bone }}>
            TIME
          </text>
        </Layer>
        <Layer depth={0}>
          <Tag x={X0 - 40} y={150} text="SPEED" F={P} dot={C.saffron} size={30} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 3-10 · STUDIO: three crowd physicists (Tick-shaped, teal and saffron suits) walk to a whiteboard with a tunnel sketch,
// passing a model vehicle; Tick leads and points. Kicker "A GROUP OF PHYSICISTS · 2016" (#8 #9). MOVER: walkers (6 px/f).
// ===============================================================================================================
const ShotGroup: ShotFC<CL03> = ({ f, len }) => {
  const suits = [undefined, C.teal, C.saffronDeep];
  return (
    <Pop f={f}>
      <Stage theme={S.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0.03, panY: 0.0, frames: len + 60, seed: 5 }} vignette={0.12} grain={0.5}>
        <StudioRoom f={f + 500} seed={9} hud={<Kicker x={120} y={130} text="A GROUP OF PHYSICISTS · 2016" /* #8 #9 */ color={INK} size={28} />}>
          <rect x={1080} y={200} width={640} height={460} rx={18} fill={CREAM} stroke={INK} strokeWidth={10} />
          <rect x={1370} y={230} width={60} height={400} fill={alpha(C.mantle, 0.25)} stroke={INK} strokeWidth={5} />
          {Array.from({ length: Math.min(8, Math.floor(f / 6)) }, (_, i) => (
            <line key={i} x1={1180} y1={280 + i * 44} x2={1340} y2={290 + i * 44} stroke={C.tealDeep} strokeWidth={5} strokeLinecap="round" />
          ))}
          <Probe x={1400} y={280 + ((f * 3) % 300)} size={50} f={f} lamp={false} />
          <rect x={1080} y={660} width={14} height={200} fill={INK} />
          <rect x={1706} y={660} width={14} height={200} fill={INK} />
          {suits.map((col, i) => {
            const x = Math.min(980 - i * 210, -200 + i * -140 + f * 6 + 360);
            const walking = x < 980 - i * 210;
            return (
              <g key={i}>
                <GroundShadow x={x} y={FLOOR + 3} rx={55} color={S.shadow} opacity={0.35} blur={8} />
                <Tick x={x} y={FLOOR} pxPerM={150} frame={f + i * 9} seed={i + 2} color={col} facing={1} walk={walking ? walkPhase(f + i * 7, 16) : undefined} pose={!walking && i === 0 ? "point" : i === 1 ? "carry" : "stand"} expression={i === 0 ? "happy" : "thinking"} look={0.5} />
              </g>
            );
          })}
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 3-11 + 3-12 · the SPEED dial: the needle shoots up and stops LOW (no number, F1); a pennant waits at the 8 km/s stop;
// then a bracket stretches from the stuck needle to the pennant, measuring the gap: 8 km/s (#2). MOVER: the needle
// (4°/f) + streaks; then the bracket drawing (14 px/f) + Tick's look.
// ===============================================================================================================
const ShotLow: ShotFC<CL03> = ({ f, len, c }) => {
  const nw = c.nowhere - c.immediately;
  const v = 0.2 * ez(f, 0, 12);
  const sc = 2.3;
  const ox = 520;
  const oy = 80;
  const cxs = ox + 140 * sc;
  const cys = oy + 148 * sc;
  const angOf = (u: number) => 180 + (u / 1.15) * 180;
  const a0 = angOf(0.2);
  const a1 = angOf(1);
  const bk = ez(f, nw, nw + 26);
  const am = a0 + (a1 - a0) * bk;
  const R = 150 * sc;
  const pt = (deg: number, r: number): [number, number] => [cxs + Math.cos((deg * Math.PI) / 180) * r, cys + Math.sin((deg * Math.PI) / 180) * r];
  const [px, py] = pt(a1, 132 * sc);
  const wv = Math.sin(f / 4);
  return (
    <Pop f={f}>
      <Stage theme={S.theme} cam={{ x: 960 + f * 0.5, y: 540 - f * 0.3, zoom: 1.0 + f * 0.0015 }} vignette={0.12} grain={0.5}>
        <StudioRoom
          f={f + 700}
          seed={11}
          hud={
            <g>
              <Tag x={120} y={980} text="ALMOST IMMEDIATELY" F={S} dot={C.saffron} size={30} opacity={1 - ez(f, nw, nw + 8)} />
              <g opacity={ez(f, nw + 20, nw + 32)}>
                <Slab x={1460} y={210} value="8" unit="km/s" /* #2 */ size={110} F={S} />
              </g>
            </g>
          }
        >
          <Streamers f={f} n={12} x0={-300} x1={2300} y0={100} y1={780} len={220} width={7} speed={10} color={alpha(CREAM, 0.9)} opacity={0.45} seed={15} />
          <g transform={`translate(${ox} ${oy}) scale(${sc})`}>
            <L14Gauges family={S} frame={f} theme="dark" x={0} y={0} speed={{ value: v, stop: STOP.speed /* #2 */ }} />
          </g>
          <line x1={px} y1={py} x2={px + 30} y2={py - 230} stroke={INK} strokeWidth={8} strokeLinecap="round" />
          <path d={`M${px + 30} ${py - 230} Q ${px + 100} ${py - 220 + wv * 30} ${px + 170} ${py - 210 + wv * 12} L${px + 30} ${py - 160} Z`} fill={C.saffron} stroke={INK} strokeWidth={5} />
          {bk > 0 ? (
            <g>
              <path d={`M${pt(a0, R).join(" ")} A${R} ${R} 0 0 1 ${pt(am, R).join(" ")}`} stroke={C.saffron} strokeWidth={14} fill="none" strokeLinecap="round" />
              <line x1={pt(a0, R - 26)[0]} y1={pt(a0, R - 26)[1]} x2={pt(a0, R + 26)[0]} y2={pt(a0, R + 26)[1]} stroke={C.saffron} strokeWidth={12} />
              <circle cx={pt(am, R)[0]} cy={pt(am, R)[1]} r={18} fill={C.saffronCore} stroke={INK} strokeWidth={4} />
            </g>
          ) : null}
          <GroundShadow x={330} y={FLOOR + 3} rx={60} color={S.shadow} opacity={0.35} blur={8} />
          <Tick x={330} y={FLOOR} pxPerM={160} frame={f} facing={1} pose="think" expression="thinking" look={f < nw ? 0.3 : 1} headTilt={f < nw ? 10 : -16} />
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 3-13 + 3-14 · split: left VACUUM, the probe streaks down an empty slot; right AIR, the probe inches through dense
// haze; then the right half fills the frame. MOVER: the left probe streaking (30 px/f) + the right haze (8 px/f).
// ===============================================================================================================
const ShotSplit: ShotFC<CL03> = ({ f, len, c }) => {
  const cr = c.crawl - c.split;
  const w = ez(f, cr, cr + 18);
  const lap = 44;
  const vy = -200 + ((f % lap) / lap) * 1500;
  return (
    <Pop f={f}>
      <Stage theme={P.theme} cam={{ x: 960 + 480 * w, y: 540, zoom: 1 + w + (f - cr > 0 ? (f - cr) * 0.001 : 0) }} vignette={0.25} grain={0.5}>
        <Layer depth={1}>
          <StrataWall f={f} family={P} layers={L14_STRATA} depth={40} pxPerKm={20} speed={30} cx={480} gap={240} x0={0} x1={960} />
          <rect x={360} y={-100} width={240} height={1300} fill={alpha("#041C22", 0.55)} />
          {Array.from({ length: 5 }, (_, k) => <line key={k} x1={430 + k * 25} y1={vy - 100 - k * 20} x2={430 + k * 25} y2={vy - 340 - k * 40} stroke={C.bone} strokeWidth={5} opacity={0.6 - k * 0.1} strokeLinecap="round" />)}
          <Probe x={480} y={vy} size={110} f={f} />
          <g>
            <clipPath id="l03right">
              <rect x={960} y={-300} width={1200} height={1700} />
            </clipPath>
            <g clipPath="url(#l03right)">
              <AirTunnel f={f + 400} scroll={3000 + f * 3} density={0.85} hazeSpeed={8} cx={1440} gap={240} x0={960} x1={2000} probeY={300 + f * 0.6} seed={7} />
            </g>
          </g>
          <rect x={952} y={-300} width={16} height={1700} fill={P.shadow} opacity={1 - w} />
        </Layer>
        <Layer depth={0}>
          <g opacity={1 - w}>
            <Tag x={120} y={110} text="VACUUM" F={P} dot={C.bone} size={30} />
            <Tag x={1040} y={110} text="AIR" F={P} dot={C.teal} size={30} />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 3-15 + 3-16 · with depth the haze bands bunch (spacing 160 → 60 px) and deepen toward saffron; then the PRESSURE
// needle climbs fast, no readout (blank drums, F9). MOVER: bands streaming (14 px/f) + the depth ruler (14 px/f) +
// the PRESSURE needle.
// ===============================================================================================================
const ShotSqueeze: ShotFC<CL03> = ({ f, len, c }) => {
  const pr = c.pressure - c.squeeze;
  const d = 0.25 + 0.6 * ez(f, 0, len);
  return (
    <Pop f={f}>
      <Stage theme={P.theme} shotFrame={f} drift={{ zoom: 1.08, panX: 0.02, panY: 0.01, frames: len + 60, seed: 6 }} vignette={0.28} grain={0.5}>
        <Layer depth={1}>
          <AirTunnel f={f + 600} scroll={4000 + f * 14} density={d} hazeSpeed={14} ruler={1380} seed={9} />
        </Layer>
        <Layer depth={0}>
          <Tag x={120} y={980} text="THE AIR GETS SQUEEZED" F={P} dot={C.saffron} size={30} />
          <L14Gauges family={P} frame={f} theme="light" pressure={{ value: 0.15 + 0.75 * ez(f, pr, len + 10), appear: ez(f, pr - 10, pr + 4) }} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 3-17 · KEY ART I. A saffron hazard band closes across the tunnel from the right; the haze is dense and bunched with
// saffron edges; the probe stalls against the band; the four-gauge cluster at right with PRESSURE high. NO depth number
// (V7 not verified): the ruler scrolls, unlabelled. MOVER: the band sliding in (20 px/f) + haze (14 px/f) + ruler.
// ===============================================================================================================
const ShotBand: ShotFC<CL03> = ({ f, len }) => {
  const bx = Math.max(SLOT.cx - SLOT.gap / 2 - 120, 1460 - f * 20);
  const bandY = 640;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: len + 30, x: 900, y: 560, zoom: 1.1 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={P.theme} cam={cam} vignette={0.3} grain={0.5}>
        <Layer depth={1}>
          <AirTunnel f={f + 800} scroll={5000 + f * 2.5} density={1} hazeSpeed={14} ruler={1380} probeY={500 + Math.sin(f / 3) * 3} seed={11}>
            <HazardBand x={bx} y={bandY} w={Math.max(10, 1460 - bx)} h={64} f={f} speed={5} />
            <Bloom x={SLOT.cx} y={bandY} r={300} color={C.saffron} core={0} strength={0.35} />
          </AirTunnel>
        </Layer>
        <Layer depth={0}>
          <Tag x={120} y={980} text="REALISTIC TRAVEL: OUT" /* #8 */ F={P} dot={C.saffron} size={32} opacity={ez(f, 8, 20)} />
          <L14Gauges
            family={P}
            frame={f}
            theme="light"
            speed={{ value: 0.2, stop: STOP.speed /* #2 */ }}
            heat={{ value: 0.22 }}
            pressure={{ value: 0.95, pinned: f > 30 }}
            pull={{ value: pullValue(GAUGE.pullSurface), stop: STOP.pull /* #3 */ }}
          />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 3-18 · the depth ruler keeps rolling past the band (unlabelled, V7); the band slides away up the frame.
// MOVER: the wall + ruler (20 px/f) + the band leaving + haze.
// ===============================================================================================================
const ShotDeeper: ShotFC<CL03> = ({ f, len }) => {
  const sc = f * 20;
  return (
    <Pop f={f}>
      <Stage theme={P.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0.0, panY: 0.03, frames: len + 40, seed: 7 }} vignette={0.3} grain={0.5}>
        <Layer depth={1}>
          <AirTunnel f={f + 1000} scroll={6000 + sc} density={1} hazeSpeed={16} ruler={1380} probeY={470} seed={13}>
            <HazardBand x={-200} y={700 - sc} w={1660} h={64} f={f} speed={5} />
          </AirTunnel>
          <DepthRuler x={1250} scroll={sc * 1.3} color={C.saffronCore} step={44} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 3-19 · the haze crystallises: teal-white hex crystals form and stream past the probe. MOVER: crystals (40 px each,
// 8-16 px/f) multiplying + haze.
// ===============================================================================================================
const ShotCrystals: ShotFC<CL03> = ({ f, len }) => (
  <Pop f={f}>
    <Stage theme={P.theme} cam={{ x: 700, y: 500, zoom: 1.35 + f * 0.002 }} vignette={0.3} grain={0.5}>
      <Layer depth={1}>
        <AirTunnel f={f + 1200} scroll={8000 + f * 8} density={1} hazeSpeed={10} crystals={Math.min(1, 0.3 + f / 40)} probeY={470} seed={15} />
        <g opacity={0.9}>
          <AirHaze f={f} x={SLOT.cx - 260} w={520} speed={9} density={0} crystals={Math.min(1, f / 50)} seed={31} y0={-200} y1={1300} />
        </g>
      </Layer>
      <Layer depth={0}>
        <Tag x={120} y={980} text="NITROGEN TURNS SOLID" /* #8 */ F={P} dot={C.ice} size={32} opacity={ez(f, 6, 18)} />
      </Layer>
    </Stage>
  </Pop>
);

// ===============================================================================================================
// 3-20 … 3-22 · STUDIO: a calendar strip unrolls (months, then a year) while the probe icon creeps along a long ruler
// toward the centre; 1.8 YEARS rolls (#9, F6); then a magnifier shows the probe at the centre wobbling through a tiny
// range ("A FEW TENS OF km", #9); then Tick holds the 38-minute stopwatch beside the strip as it rolls over it.
// MOVER: the strip scrolling (8 → 16 px/f) + Counter; the inset probe swinging; the strip rolling over the stopwatch.
// ===============================================================================================================
const MONTHS = "JFMAMJJASOND";
const ShotYears: ShotFC<CL03> = ({ f, len, c }) => {
  const wb = c.wobble - c.years;
  const nm = c.notmin - c.years;
  const k = ez(f, 4, Math.min(wb - 4, 70));
  const yrs = (1.8 * k).toFixed(1); // #9: a counter rolling to 1.8
  const sx = f < nm ? f * 8 : nm * 8 + (f - nm) * 16;
  const cell = 90;
  const inset = ez(f, wb, wb + 12) * (1 - ez(f, nm - 6, nm + 6));
  const swing = Math.sin(f / 12) * 100;
  const sw = ez(f, nm, nm + 16);
  return (
    <Pop f={f}>
      <Stage theme={S.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0.02, panY: 0.01, frames: len + 60, seed: 8 }} vignette={0.12} grain={0.5}>
        <StudioRoom
          f={f + 900}
          seed={13}
          hud={
            <g>
              <Kicker x={120} y={110} text="THEIR NUMBERS, WITH AIR" color={INK} size={26} />
              <rect x={100} y={150} width={560} height={150} rx={24} fill={alpha(INK, 0.78)} />
              <Metric x={140} y={265} value={yrs} unit="YEARS" /* #9 */ size={110} color={CREAM} />
              <Tag x={120} y={980} text="A FEW TENS OF km" /* #9 */ F={S} dot={C.teal} size={30} opacity={inset} />
            </g>
          }
        >
          {/* the long ruler to the centre, the probe creeping */}
          <rect x={160} y={430} width={1500} height={18} rx={9} fill={INK} />
          <circle cx={1660} cy={439} r={26} fill={C.inner} stroke={INK} strokeWidth={5} />
          <Probe x={180 + 1460 * Math.min(1, f / (len * 1.4))} y={380} size={70} f={f} tilt={-90} lamp={false} />
          {/* the calendar strip */}
          <rect x={-300} y={560} width={2600} height={150} fill={CREAM} stroke={INK} strokeWidth={6} />
          {Array.from({ length: 30 }, (_, i) => {
            const idx = Math.floor(sx / cell) + i - 4;
            const x = idx * cell - sx + 100;
            const year = ((idx % 12) + 12) % 12 === 0;
            return (
              <g key={idx}>
                <rect x={x} y={566} width={cell - 6} height={138} fill={year ? C.saffron : idx % 2 ? mixHex(C.teal, CREAM, 0.6) : mixHex(C.teal, CREAM, 0.8)} />
                <text x={x + cell / 2 - 3} y={652} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 40, fill: INK }}>
                  {MONTHS[((idx % 12) + 12) % 12]}
                </text>
              </g>
            );
          })}
          {/* the magnifier inset: the probe at the centre wobbling */}
          {inset > 0 ? (
            <g opacity={inset} transform={`translate(1240 300) scale(${0.6 + 0.4 * inset})`}>
              <circle cx={0} cy={0} r={230} fill={P.sky[1]} stroke={INK} strokeWidth={14} />
              <line x1={-150} y1={0} x2={150} y2={0} stroke={C.bone} strokeWidth={4} strokeDasharray="10 8" />
              <circle cx={0} cy={0} r={16} fill={C.inner} />
              <Probe x={swing} y={-10} size={110} f={f} tilt={-90} lamp={false} />
              <rect x={200} y={170} width={140} height={34} rx={14} fill={INK} transform="rotate(45 200 170)" />
            </g>
          ) : null}
          {/* the stopwatch, rolled over by the strip */}
          <g opacity={sw} transform={`translate(${(1 - sw) * 600} 0)`}>
            <circle cx={1300} cy={760} r={120} fill={INK} />
            <circle cx={1300} cy={760} r={104} fill={CREAM} />
            <text x={1300} y={782} textAnchor="middle" style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 58, fill: INK }}>
              38 MIN{/* #1 */}
            </text>
            <GroundShadow x={1620} y={FLOOR + 3} rx={60} color={S.shadow} opacity={0.35} blur={8} />
            <Tick x={1620} y={FLOOR} pxPerM={150} frame={f} facing={-1} pose="hold" expression="thinking" look={0.5} headTilt={Math.sin(f / 5) * 12} />
          </g>
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 3-23 + 3-24 · petrol: air as a jam of jittering teal pucks crowding the probe; then calendar pages flip fast.
// MOVER: the puck lane (6-9 px/f) + jitter; then the pages turning (~10 flips/s, 300 px wide).
// ===============================================================================================================
const ShotTraffic: ShotFC<CL03> = ({ f, len, c }) => {
  const pg = c.pages - c.traffic;
  const pin = ez(f, pg - 6, pg + 8);
  return (
    <Pop f={f}>
      <Stage theme={P.theme} shotFrame={f} drift={{ zoom: 1.1, panX: 0.02, panY: 0.01, frames: len + 60, seed: 9 }} vignette={0.28} grain={0.5}>
        <Layer depth={1}>
          <AirTunnel f={f + 1400} scroll={9000 + f * 3} density={0.9} hazeSpeed={6} probeY={480} shake={2} seed={17}>
            {Array.from({ length: 40 }, (_, i) => {
              const col = i % 4;
              const x = SLOT.cx - 110 + col * 74 + Math.sin(f * 0.9 + i) * 5;
              const y = ((rnd(i) * 1300 - f * (6 + rnd(i * 3) * 3)) % 1300 + 1300) % 1300 - 100;
              if (Math.abs(y - 480) < 110 && Math.abs(x - SLOT.cx) < 80) return null;
              return <ellipse key={i} cx={x} cy={y} rx={34} ry={24} fill={mixHex(C.teal, C.bone, 0.3 + rnd(i * 5) * 0.3)} stroke={INK} strokeWidth={4} />;
            })}
          </AirTunnel>
        </Layer>
        <Layer depth={0}>
          {pin > 0 ? (
            <g opacity={pin} transform={`translate(${1150 + (1 - pin) * 300} 300)`}>
              <rect x={-20} y={-20} width={340} height={380} rx={20} fill={INK} />
              <rect x={0} y={20} width={300} height={320} fill={CREAM} />
              {(() => {
                const ph = ((f - pg) % 3) / 3;
                return <rect x={0} y={20} width={300} height={320 * (1 - ph)} fill={((Math.floor((f - pg) / 3)) % 2) ? mixHex(C.teal, CREAM, 0.6) : CREAM} stroke={INK} strokeWidth={3} />;
              })()}
              <text x={150} y={240} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 120, fill: INK }}>
                {MONTHS[Math.floor(Math.max(0, f - pg) / 3) % 12]}
              </text>
              {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={30 + i * 48} cy={10} r={10} fill={C.saffron} />)}
            </g>
          ) : null}
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 3-25 · Tick hooks a hose to the hatch and works a pump handle; the haze drains along the hose toward it.
// MOVER: the pump handle stroking (200 px per 20 f) + haze puffs draining (14 px/f).
// ===============================================================================================================
const ShotPump: ShotFC<CL03> = ({ f, len }) => {
  const stroke = 0.5 + 0.5 * Math.sin((f / 20) * Math.PI * 2);
  const H = { x: 620, y: 820 };
  const PX = 1180;
  return (
    <Pop f={f}>
      <Stage theme={DUSK.theme} shotFrame={f} drift={{ zoom: 1.08, panX: 0.03, panY: 0.01, frames: len + 60, seed: 10 }} vignette={0.25} grain={0.5}>
        <Layer depth={1}>
          <Desert f={f} ground={880} wind={9} seed={11}>
            <HatchLid x={H.x} y={H.y} r={110} open={1} family={DUSK} f={f} />
            {Array.from({ length: 10 }, (_, i) => {
              const u = ((f * 14 + i * 90) % 900) / 900;
              const x = H.x + (PX - H.x) * u;
              const y = H.y - 30 - Math.sin(u * Math.PI) * 140;
              return <circle key={i} cx={x} cy={y} r={38 * (1 - u * 0.6)} fill={mixHex(C.teal, C.frost, 0.5)} opacity={0.6 * (1 - u)} />;
            })}
            <Pump x={PX} y={880} h={260} stroke={stroke} hx={H.x + 90} hy={H.y - 10} f={f} />
            <GroundShadow x={1420} y={883} rx={60} color={DUSK.shadow} opacity={0.5} blur={8} />
            <Tick x={1420} y={880 + (stroke - 0.5) * 6} pxPerM={160} frame={f} facing={-1} pose="press" expression="determined" look={0.4} squash={{ sx: 1 + (stroke - 0.5) * 0.06, sy: 1 - (stroke - 0.5) * 0.06 }} />
          </Desert>
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 3-26 … 3-28 · the walls go bare: the last haze streams out the top and a seal clamps over the hatch; then VACUUM: the
// SPEED needle climbs past the old plateau as the wall accelerates (4 → 24 px/f); then the slot darkens to deep petrol
// with one bright point far below. MOVER: haze streaming out (16 px/f) + the lid slam; the wall accelerating; strata at
// 24 px/f.
// ===============================================================================================================
const ShotVacuum: ShotFC<CL03> = ({ f, len, c }) => {
  const vac = c.vacuum - c.bare;
  const fl = c.falls - c.bare;
  const tau = Math.max(0, f - vac);
  const scroll = tau < 25 ? 4 * tau + 0.4 * tau * tau : 4 * 25 + 0.4 * 625 + 24 * (tau - 25);
  const surf = 300 - scroll;
  const hazeBottom = 1080 - f * 16;
  const lid = ez(f, 18, 30);
  const dark = ez(f, fl, fl + 30);
  const spV = f < vac ? 0.2 : Math.min(1.05, 0.2 + (tau / 60) * 0.9);
  return (
    <Pop f={f}>
      <Stage theme={P.theme} cam={{ x: 900, y: 540, zoom: 1.08 - 0.08 * dark }} vignette={0.3} grain={0.5}>
        <Layer depth={1}>
          <AirTunnel f={f + 1600} scroll={scroll} depth={12} density={0.4} hazeSpeed={16} hazeBottom={hazeBottom} haze={hazeBottom > 0} probeY={f < vac ? 640 : 520} seed={19}>
            <rect x={-300} y={surf - 900} width={2600} height={900} fill={mixHex(P.sky[0], "#082028", 0.4)} />
            <rect x={SLOT.cx - SLOT.gap / 2 - 60} y={surf - 12} width={SLOT.gap + 120} height={18} rx={8} fill={C.saffron} />
            <g transform={`translate(${(1 - lid) * 420} ${-lid * 0})`}>
              <rect x={SLOT.cx - SLOT.gap / 2 - 30} y={surf - 40} width={SLOT.gap + 60} height={34} rx={10} fill={C.teal} stroke={C.bone} strokeWidth={4} />
            </g>
            {lid >= 1
              ? [-1, 1].map((s) => (
                  <rect key={s} x={SLOT.cx + s * (SLOT.gap / 2 + 20) - 14} y={surf - 50} width={28} height={50} rx={6} fill={C.saffron} transform={`rotate(${s * 20 * ez(f, 30, 38)} ${SLOT.cx + s * (SLOT.gap / 2 + 20)} ${surf - 25})`} />
                ))
              : null}
          </AirTunnel>
          <rect x={-300} y={-300} width={2600} height={1700} fill="#020E12" opacity={0.62 * dark} />
          {dark > 0 ? <Bloom x={SLOT.cx} y={1040} r={240 * dark} color={C.saffronCore} core={20} coreColor="#FFFFFF" strength={0.9 * dark} /> : null}
          {dark > 0 ? (
            <g transform="rotate(-90 640 540)">
              <Streamers f={f} n={12} x0={-300} x1={1500} y0={410} y1={670} len={260} width={6} speed={24} color={C.bone} opacity={0.6 * dark} seed={21} />
            </g>
          ) : null}
        </Layer>
        <Layer depth={0}>
          <Tag x={120} y={980} text="VACUUM" F={P} dot={C.bone} size={34} opacity={ez(f, vac + 4, vac + 16)} />
          <L14Gauges family={P} frame={f} theme="light" speed={{ value: spV, stop: STOP.speed /* #2 */, pinned: spV >= 1.05, appear: ez(f, vac - 8, vac + 4) }} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// BlackBeat + sting → ChapterCard 2 (4-00) on the ember field: terracotta and gold rings rise behind the type.
// MOVER: rings launched every 26 f at 7 px/f.
// ===============================================================================================================
const EmberRings: React.FC<{ f: number }> = ({ f }) => {
  const every = 26;
  const speed = 7;
  const maxR = 1900;
  const cols = [C.mantle, C.outer, C.mantleDeep, C.inner];
  const k0 = Math.floor(f / every);
  return (
    <g>
      {Array.from({ length: Math.ceil(maxR / speed / every) + 1 }, (_, i) => {
        const k = k0 - i;
        const r = (f - k * every) * speed;
        if (r <= 0 || r > maxR) return null;
        return <circle key={k} cx={1560} cy={1200} r={r} fill="none" stroke={cols[((k % 4) + 4) % 4]} strokeWidth={56} opacity={0.85 * Math.min(1, r / 60) * (1 - Math.max(0, (r - maxR * 0.7) / (maxR * 0.3)))} />;
      })}
    </g>
  );
};
const Card2: React.FC<{ f: number; len: number }> = ({ f, len }) => {
  const bb = 16;
  const g = f - bb;
  return (
    <AbsoluteFill>
      {g >= 0 ? <L14Card family={EMBER} kicker="CHAPTER TWO" title="Down Through the Planet" t={Math.min(0.86, g / Math.max(1, len - bb))} frame={g + 200} behind={(fr) => <EmberRings f={fr} />} /> : null}
      <BlackBeat t={Math.min(1, f / (bb + 4))} fadeIn={0.2} fadeOut={0.35} />
    </AbsoluteFill>
  );
};
const ShotVacuumAndCard: ShotFC<CL03> = (props) => {
  const { f, c } = props;
  const b = c.brk - c.bare;
  if (f >= b) return <Card2 f={f - b} len={c.end - c.brk} />;
  return <ShotVacuum {...props} />;
};

// ===============================================================================================================

export const SceneL03: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL03(t);
  const shots: ShotDef<CL03>[] = [
    { from: 0, S: ShotAir, id: "3-01" },
    { from: c.arrows, S: ShotArrows, id: "3-02" },
    { from: c.steady, S: ShotSteady, id: "3-03" }, // + 3-04
    { from: c.square, S: ShotSquare, id: "3-05" },
    { from: c.twice, S: ShotTimes, id: "3-06" }, // + 3-07
    { from: c.curve, S: ShotCurve, id: "3-08" }, // + 3-09
    { from: c.group, S: ShotGroup, id: "3-10" },
    { from: c.immediately, S: ShotLow, id: "3-11" }, // + 3-12
    { from: c.split, S: ShotSplit, id: "3-13" }, // + 3-14
    { from: c.squeeze, S: ShotSqueeze, id: "3-15" }, // + 3-16
    { from: c.band, S: ShotBand, id: "3-17" },
    { from: c.deeper, S: ShotDeeper, id: "3-18" },
    { from: c.nitrogen, S: ShotCrystals, id: "3-19" },
    { from: c.years, S: ShotYears, id: "3-20" }, // + 3-21, 3-22
    { from: c.traffic, S: ShotTraffic, id: "3-23" }, // + 3-24
    { from: c.pump, S: ShotPump, id: "3-25" },
    { from: c.bare, S: ShotVacuumAndCard, id: "3-26" }, // + 3-27, 3-28, BlackBeat, card 4-00
  ];
  return playShots(f, shots, c, t.frames);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL03 = (t: SceneTiming): Cue[] => {
  const c = cuesL03(t);
  return [
    { at: 0, file: SFX.rumble, vol: 0.14, dur: c.square, fadeIn: 20, fadeOut: 20 },
    ...cutHit(c.arrows),
    { at: c.arrows, file: SFX.riser, vol: 0.14, dur: c.steady - c.arrows, fadeIn: 6, fadeOut: 6 },
    ...cutHit(c.steady),
    ...Array.from({ length: 5 }, (_, i) => ({ at: c.steady + i * 6, file: SFX.click, vol: 0.06, dur: 6 })),
    { at: c.steady + 32, file: SFX.chime, vol: 0.18, dur: 60 },
    { at: c.terminal, file: SFX.popLong, vol: 0.2, dur: 30 },
    ...cutHit(c.square),
    ...Array.from({ length: 6 }, (_, i) => ({ at: c.square + 4 + i * 10, file: SFX.click, vol: 0.06, dur: 8 })),
    ...cutHit(c.twice),
    { at: c.twice + 10, file: SFX.click, vol: 0.14, dur: 10 },
    { at: c.four, file: SFX.popLong, vol: 0.24, dur: 30 },
    ...cutHit(c.curve),
    ...Array.from({ length: 6 }, (_, i) => ({ at: c.curve + 4 + i * 9, file: SFX.click, vol: 0.06, dur: 8 })),
    { at: c.flat, file: SFX.rumble, vol: 0.18, dur: c.group - c.flat, fadeIn: 10, fadeOut: 10 },
    ...cutHit(c.group),
    { at: c.group + 10, file: SFX.click, vol: 0.12, dur: 10 },
    ...cutHit(c.immediately),
    { at: c.immediately + 12, file: SFX.click, vol: 0.16, dur: 10 },
    { at: c.nowhere, file: SFX.riser, vol: 0.14, dur: c.split - c.nowhere, fadeIn: 6, fadeOut: 6 },
    ...cutHit(c.split),
    { at: c.split + 4, file: SFX.whoosh, vol: 0.24, dur: 40 },
    { at: c.crawl, file: SFX.rumble, vol: 0.16, dur: c.squeeze - c.crawl, fadeIn: 10, fadeOut: 10 },
    ...cutHit(c.squeeze),
    { at: c.squeeze, file: SFX.rumble, vol: 0.2, dur: c.band - c.squeeze, fadeIn: 10, fadeOut: 10 },
    ...Array.from({ length: 6 }, (_, i) => ({ at: c.pressure + i * 7, file: SFX.click, vol: 0.06, dur: 6 })),
    ...cutHit(c.band),
    { at: c.band + 4, file: SFX.popLong, vol: 0.22, dur: 30 },
    { at: c.band + 6, file: SFX.riser, vol: 0.16, dur: c.deeper - c.band, fadeIn: 6, fadeOut: 10 },
    ...cutHit(c.deeper),
    ...Array.from({ length: 6 }, (_, i) => ({ at: c.deeper + 4 + i * 8, file: SFX.click, vol: 0.06, dur: 6 })),
    ...cutHit(c.nitrogen),
    { at: c.nitrogen + 8, file: SFX.chime, vol: 0.24, dur: 70 },
    ...cutHit(c.years),
    ...Array.from({ length: 8 }, (_, i) => ({ at: c.years + 6 + i * 8, file: SFX.click, vol: 0.06, dur: 6 })),
    { at: c.wobble, file: SFX.pop, vol: 0.16, dur: 16 },
    { at: c.notmin, file: SFX.swirl, vol: 0.14, dur: 40 },
    ...cutHit(c.traffic),
    { at: c.traffic, file: SFX.rumble, vol: 0.18, dur: c.pump - c.traffic, fadeIn: 10, fadeOut: 10 },
    ...Array.from({ length: 8 }, (_, i) => ({ at: c.pages + i * 3, file: SFX.click, vol: 0.05, dur: 5 })),
    ...cutHit(c.pump),
    { at: c.pump, file: SFX.rumble, vol: 0.22, dur: c.bare - c.pump + 10, fadeIn: 10, fadeOut: 10 },
    ...cutHit(c.bare),
    { at: c.bare + 30, file: SFX.popLong, vol: 0.24, dur: 30 },
    { at: c.vacuum, file: SFX.riser, vol: 0.18, dur: c.brk - c.vacuum, fadeIn: 10, fadeOut: 10 },
    ...sting(c.brk),
  ];
};
