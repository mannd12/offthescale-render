// L16 scene "l02" · The handbrake (storyboard §3 scene 2: 2-01…2-13, script lines 16-22; studio rocket card, space orbits and
// Venus, the glow-lit closest pass). Shot components (hard cuts only; PUSH/SLIDE rows are phases of one component):
//   2-01            Tick holds up the rocket drawing (DELTA IV HEAVY tag, F7), the energy bar fills, AUG 2018
//   2-02            the sideways arrow shrinks to a stub (a stub remains)
//   2-03 (+2-04)    the swing past Venus bending the path inward; then a ghost "normal" assist zips outward
//   2-05 (+2-06)    seven Venus icons light while the orbit shrinks; then the studio timeline OCT 2018 → DEC 2024
//   2-07 (+2-08)    the closest pass low over the limb (3.8 million miles, 24 DEC 2024); then 6.16 million km, 430,000 mph
//   2-09            Earth's bar and the probe's six-times bar (about 190 km/s, OUR SUM)
//   2-10            New York to Tokyo in under a minute (class B, F3: words and an unnumbered stopwatch only)
//   2-11 (+2-12)    out of contact (the link breaks); then the beacon rings reach Earth (26 DEC)
//   2-13            the fourth pass: four check stamps at the orbit's closest point (SEP 2025, FOURTH TIME)
// Numbers drawn (all READ.*): AUG 2018 #3 #6 · 7 #6 · OCT 2018 #6 · DEC 2024 #7 · 24 DEC 2024 #7 · 3.8 million miles #7 ·
// 6.16 million km #6 #22 · 430,000 mph #7 · about 190 km/s, ×6 #2 #7 #22 (OUR SUM) · 26 DEC #7 · SEP 2025 #8.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bloom, Layer, Sky, Stage, Tick, alpha, cameraAt, impact, smoothPath, type Pt } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { READ } from "../sundata";
import { WindStreaks } from "../movers16";
import { SunLimb } from "../sunbody";
import { OurSumPill } from "../stamps";
import { Calendar, Orbit, Planet, Probe, Rocket, partialPts } from "../props16";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import {
  ArcArrow,
  Arrow,
  C,
  CREAM,
  CheckStamp,
  ClipBox,
  DrawnPath,
  GLOW,
  INK,
  Label,
  Ledge,
  PillA,
  Plate,
  Pop,
  Rings,
  SPACE,
  STUDIO,
  Slab,
  SpaceField,
  SpeedBar,
  StudioRoom,
  SumDial,
  SunDisc,
  VenusRow,
  Watch,
  ellipsePt,
  ez,
  lerp,
  lin,
  rollText,
} from "./a-parts";

const D2R = Math.PI / 180;

// ================================================================================================================
// cues (scene-local line indices: line 0 here is script line 16)
// ================================================================================================================
export const cuesL02 = (t: SceneTiming) => {
  const { at, p } = cueKit(t);
  return {
    a01: 0,
    a02: p(0, "NASA called"),
    a03: at(1),
    a04: p(1, "A normal gravity"), // phase
    a04b: p(1, "Parker's did"),
    a05: at(2),
    a06: p(2, "each one shrinking"), // phase
    a07: at(3),
    a08: p(3, "That's six point"), // phase
    a09: at(4),
    a10: p(4, "NASA says"),
    a11: at(5),
    a12: p(5, "Two days later"), // phase
    a13: at(6),
    end: t.frames,
  };
};
export type CL02 = ReturnType<typeof cuesL02>;

/** Point and heading at fraction s (0..1, by length) along a polyline. */
const along = (pts: Pt[], s: number): { p: Pt; ang: number } => {
  const seg = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
  const total = seg.reduce((a, b) => a + b, 0);
  let d = Math.max(0, Math.min(1, s)) * total;
  for (let i = 0; i < seg.length; i++) {
    if (d <= seg[i] || i === seg.length - 1) {
      const u = Math.min(1, d / Math.max(1e-6, seg[i]));
      return { p: [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * u, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * u], ang: Math.atan2(pts[i + 1][1] - pts[i][1], pts[i + 1][0] - pts[i][0]) / D2R };
    }
    d -= seg[i];
  }
  return { p: pts[pts.length - 1], ang: 0 };
};
const lengthOf = (pts: Pt[]) => pts.slice(1).reduce((a, q, i) => a + Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]), 0);
/** Smooth a few control points into a dense polyline (so `along` follows the curve). */
const dense = (ctrl: Pt[], n = 120): Pt[] => {
  const out: Pt[] = [];
  for (let i = 0; i < ctrl.length - 1; i++) {
    const p0 = ctrl[Math.max(0, i - 1)];
    const p1 = ctrl[i];
    const p2 = ctrl[i + 1];
    const p3 = ctrl[Math.min(ctrl.length - 1, i + 2)];
    const m = Math.ceil(n / (ctrl.length - 1));
    for (let k = 0; k < m; k++) {
      const t = k / m;
      const t2 = t * t;
      const t3 = t2 * t;
      const cr = (a: number, b: number, c2: number, d: number) => 0.5 * (2 * b + (-a + c2) * t + (2 * a - 5 * b + 4 * c2 - d) * t2 + (-a + 3 * b - 3 * c2 + d) * t3);
      out.push([cr(p0[0], p1[0], p2[0], p3[0]), cr(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(ctrl[ctrl.length - 1]);
  return out;
};

// ================================================================================================================
// 2-01 · "launched in August 2018 on one of the most powerful rockets": on the cyclorama Tick holds up a drawing of a
// rocket (our three-core shape, tag DELTA IV HEAVY, F7); the energy bar fills; the drawn rocket rises off the card.
// MOVER: the rocket rising 10 px/f + the energy bar filling + its stripes 18 px/f + clouds.
// ================================================================================================================
const ShotCard: ShotFC<CL02> = ({ f, len }) => {
  const lift = Math.max(0, f - 24) * 3.5; // the drawing lifts slowly off the card (stays readable)
  const fill = lin(f, 10, len);
  return (
    <Stage theme={STUDIO.theme} cam={cameraAt(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len + 10, x: 1000, y: 500, zoom: 1.08 }])} vignette={0.12} grain={0.5}>
      <StudioRoom f={f} seed={12}>
        {/* the card Tick holds up */}
        <g transform="rotate(-3 1050 420)">
          <rect x={748} y={140} width={620} height={600} rx={22} fill="#000" opacity={0.18} />
          <rect x={740} y={128} width={620} height={600} rx={22} fill={C.paper} stroke={INK} strokeWidth={4} />
          <rect x={740} y={128} width={620} height={70} rx={22} fill={C.violet} />
          <Label x={770} y={176} text="our drawing" size={26} color={CREAM} halo={C.violet} />
          <rect x={770} y={668} width={560} height={36} rx={10} fill={alpha(C.saffron, 0.35)} />
          <line x1={780} y1={668} x2={1320} y2={668} stroke={C.saffronDeep} strokeWidth={4} />
        </g>
        <ClipBox x={745} y={200} w={610} h={466}>
          <WindStreaks f={f} mode="sweep" angle={90} box={{ x: 930, y: 668 - lift - 20, w: 140, h: 520 }} speed={20} count={16} len={110} width={14} seed={44} from={C.amber} to={C.gold} opacity={ez(f, 12, 20)} />
        </ClipBox>
        <Rocket x={1000} y={668} size={440} f={f} lift={lift} plume={ez(f, 12, 20)} tag="Delta IV Heavy" />
        {/* the energy bar */}
        <Label x={760} y={815} text="energy" size={28} color={STUDIO.text} />
        <SpeedBar x={900} y={805} len={Math.max(4, 500 * fill)} h={54} f={f} color={C.gold} stripe={C.amber} />
        <Tick x={600} y={930} pxPerM={210} frame={f} facing={1} pose="heave" expression="proud" look={0.5} />
      </StudioRoom>
      <Layer depth={0}>
        <PillA x={120} y={110} text={READ.launch.text} F={STUDIO} dot={C.gold} size={30} opacity={ez(f, 6, 18)} />
      </Layer>
    </Stage>
  );
};

// ================================================================================================================
// 2-02 · "only a good start on shedding that sideways speed": the probe on its orbit, the gold sideways arrow shrinks to a
// stub (a stub remains) as the energy bar drains. MOVER: arrow shrinking 20 px/f + bar draining 18 px/f + probe gliding.
// ================================================================================================================
const ShotStub: ShotFC<CL02> = ({ f, len }) => {
  const O = { x: 1700, y: 1500, R: 1400 };
  const a = lerp(-160, -132, f / Math.max(1, len)) * D2R;
  const px = O.x + Math.cos(a) * O.R;
  const py = O.y + Math.sin(a) * O.R;
  const tang = a / D2R - 90; // direction of travel (counter-clockwise → toward the upper right)
  const L = lerp(720, 150, ez(f, 8, len - 10)); // shrinks for the whole shot
  const bar = lerp(620, 130, ez(f, 8, len - 10));
  const stub = L <= 150;
  const ax = Math.cos((tang + 180) * D2R);
  const ay = Math.sin((tang + 180) * D2R);
  return (
    <Pop f={f}>
      <Stage theme={SPACE.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.012, panY: 0, frames: 200, seed: 5 }} vignette={0.3} grain={0.5}>
        <Layer depth={0.3}>
          <SpaceField f={f} seed={40} n={110} />
        </Layer>
        <Layer depth={1}>
          <WindStreaks f={f} mode="sweep" angle={tang + 180} box={{ x: -300, y: -300, w: 2520, h: 1680 }} speed={16} count={44} len={170} width={8} seed={46} from={C.gold} to={C.lavender} opacity={0.55} />
          <Bloom x={1900} y={1150} r={800} color={C.amber} strength={0.55} />
          <circle cx={O.x} cy={O.y} r={O.R} fill="none" stroke={alpha(C.lavender, 0.45)} strokeWidth={4} strokeDasharray="14 12" strokeDashoffset={-f * 2} />
          <Arrow x1={px + ax * 90} y1={py + ay * 90} x2={px + ax * (90 + L)} y2={py + ay * (90 + L)} width={46} color={C.gold} />
          {stub ? <circle cx={px + ax * (90 + L * 0.6)} cy={py + ay * (90 + L * 0.6)} r={120 + 10 * Math.sin(f / 4)} fill="none" stroke={C.saffronCore} strokeWidth={5} strokeDasharray="14 10" strokeDashoffset={-f * 3} /> : null}
          <Probe x={px} y={py} size={150} f={f} tilt={tang} />
        </Layer>
        <Layer depth={0}>
          <Label x={1180} y={140} text="sideways speed" size={30} />
          <SpeedBar x={1180} y={200} len={bar} h={60} f={f} color={C.gold} stripe={C.amber} speed={-18} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 2-03 + 2-04 · "So it used Venus": the probe swings past a bright cream-gold Venus and a curved arrow bends its path in
// toward the Sun; then a ghost probe takes the "normal" assist, zipping outward, while the real probe's arrow shrinks
// and its path curves inward. MOVER: the path's head 30 px/f + the probe; the ghost streaking 30 px/f.
// ================================================================================================================
const VEN = { x: 1080, y: 600, r: 170 };
const REAL = dense([
  [2100, 240],
  [1700, 270],
  [1350, 300],
  [1100, 350],
  [920, 450],
  [760, 610],
  [600, 800],
  [400, 1060],
]);
const GHOST = dense([
  [1100, 350],
  [860, 290],
  [560, 160],
  [150, -60],
]);
const TURN = lengthOf(REAL.slice(0, 3 * Math.ceil(120 / 7) + 1)); // px along REAL to the swing point (1100, 350)
const ShotVenus: ShotFC<CL02> = ({ f, len, c }) => {
  const T4 = c.a04 - c.a03; // "A normal gravity assist…": the ghost appears riding with the probe
  const T4b = c.a04b - c.a03; // "Parker's did the opposite": the real arrow shrinks
  const L = lengthOf(REAL);
  const head = lin(f, 4, 4 + L / 30);
  const d = Math.max(0, f - 4) * 8; // px along REAL (8 px/f), slowing to 6 after the swing
  const dr = d < TURN ? d : TURN + (d - TURN) * 0.75;
  const { p, ang } = along(REAL, dr / L);
  const tTurn = 4 + TURN / 8; // frame the probe reaches the swing point
  const gl = lengthOf(GHOST);
  const gs = (Math.max(0, f - tTurn) * 30) / gl;
  const gp = f < tTurn ? { p, ang } : along(GHOST, gs);
  const g = f - T4;
  const arrowL = Math.max(80, 240 - Math.max(0, f - T4b) * 4);
  return (
    <Pop f={f}>
      <Stage theme={SPACE.theme} cam={cameraAt(f, [{ f: 0, x: 1080, y: 520, zoom: 1.0 }, { f: len + 10, x: 900, y: 600, zoom: 1.08 }])} vignette={0.3} grain={0.5}>
        <Layer depth={0.3}>
          <SpaceField f={f} seed={41} n={110} />
        </Layer>
        <Layer depth={1}>
          <Bloom x={-200} y={900} r={900} color={C.amber} strength={0.5} />
          <WindStreaks f={f} mode="sweep" angle={0} box={{ x: -300, y: -100, w: 2520, h: 1280 }} speed={16} count={40} len={170} width={7} seed={47} from={C.gold} to={C.lavender} opacity={0.5} />
          <g transform={`translate(${(-f * 1.7).toFixed(1)} 0)`}>
          <Bloom x={VEN.x} y={VEN.y} r={VEN.r * 2.1} color="#F6E3A8" strength={0.45} />
          <Planet x={VEN.x} y={VEN.y} r={VEN.r} f={f} kind="venus" light={200} />
          <DrawnPath pts={REAL} head={head} f={f} dashed width={6} color={alpha(CREAM, 0.8)} />
          <ArcArrow cx={VEN.x} cy={VEN.y} r={330} a0={-40} sweep={-95 * ez(f, 20, 50)} width={22} color={C.gold} />
          {g >= 0 ? (
            <g>
              {f >= tTurn ? <DrawnPath pts={GHOST} head={gs} f={f} dashed width={5} color={alpha(C.cyan, 0.8)} /> : null}
              {gs < 1 ? <Probe x={gp.p[0]} y={gp.p[1] - (f < tTurn ? 70 : 0)} size={110} f={f} variant="ghost" tilt={gp.ang + 180} /> : null}
              {gs < 1 && f >= tTurn
                ? Array.from({ length: 5 }, (_, i) => {
                    const off = 60 + i * 34;
                    const cs = Math.cos(gp.ang * D2R);
                    const sn = Math.sin(gp.ang * D2R);
                    return <line key={i} x1={gp.p[0] - cs * off + sn * (i - 2) * 16} y1={gp.p[1] - sn * off - cs * (i - 2) * 16} x2={gp.p[0] - cs * (off + 140) + sn * (i - 2) * 16} y2={gp.p[1] - sn * (off + 140) - cs * (i - 2) * 16} stroke={C.cyan} strokeWidth={5} strokeLinecap="round" opacity={0.7} />;
                  })
                : null}
              <Label x={640} y={330} text="a normal assist" size={28} color={C.cyan} opacity={ez(f, tTurn, tTurn + 14)} />
            </g>
          ) : null}
          <Arrow x1={p[0] + Math.cos(ang * D2R) * 70} y1={p[1] + Math.sin(ang * D2R) * 70} x2={p[0] + Math.cos(ang * D2R) * (70 + arrowL)} y2={p[1] + Math.sin(ang * D2R) * (70 + arrowL)} width={28} color={C.gold} />
          <Probe x={p[0]} y={p[1]} size={130} f={f} tilt={ang + 180} trail={60} />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 2-05 + 2-06 · "seven Venus flybys over nearly seven years": seven Venus icons light along the bottom while the orbit
// shrinks ring by ring toward the Sun (Metric 7); then (push) the studio card: the nested loops above a timeline drawn
// across the frame with its two pins, OCT 2018 and DEC 2024 (a bracket between them: no "six years" numeral).
// MOVER: icons lighting (14 f stagger) + the orbit contracting + the probe lapping 20 px/f; timeline head 40 px/f.
// ================================================================================================================
const orbitQ = (k: number) => lerp(430, 70, k); // perihelion distance (drawing only)
const ring = (sx: number, sy: number, Q: number, q: number, scale = 1) => {
  const a = (Q + q) / 2;
  const cc = a - q;
  const b = Math.sqrt(Math.max(1, a * a - cc * cc));
  return { cx: sx + cc * scale, cy: sy, rx: a * scale, ry: b * scale * 0.8 };
};
const ShotFlybys: ShotFC<CL02> = ({ f, len, c }) => {
  const T6 = c.a06 - c.a05;
  const g = f - T6;
  const lit = Math.max(0, (f - 6) / 14);
  const k = lin(f, 6, 6 + 7 * 14);
  const S = { x: 760, y: 430 };
  const Q = 560;
  const cur = ring(S.x, S.y, Q, orbitQ(k));
  const t = f * 0.03 + 1;
  const [px, py] = ellipsePt(cur.cx, cur.cy, cur.rx, cur.ry, t);
  const x6 = ez(g, -6, 10);
  // studio card (phase 2)
  const tlHead = lin(g, 8, 8 + 38);
  const pinA = 320;
  const pinB = 1600;
  const camX = lerp(860, 1060, ez(g, 0, len - T6));
  const S2 = { x: 760, y: 360 };
  const lap = g * 0.05;
  const inner = ring(S2.x, S2.y, 330, 50, 1);
  const [qx, qy] = ellipsePt(inner.cx, inner.cy, inner.rx, inner.ry, lap);
  return (
    <AbsoluteFill>
      <Stage theme={SPACE.theme} cam={{ x: 960, y: 540, zoom: 1 + 0.25 * ez(g, -20, 8) }} vignette={0.3} grain={0.5}>
        <Layer depth={0.3}>
          <SpaceField f={f} seed={42} n={110} />
        </Layer>
        <Layer depth={1}>
          <SunDisc x={S.x} y={S.y} r={70} f={f} halo={0.7} />
          {Array.from({ length: 7 }, (_, i) => {
            const kk = i / 6;
            if (k < kk - 0.001) return null;
            const r = ring(S.x, S.y, Q, orbitQ(kk));
            return <ellipse key={i} cx={r.cx} cy={r.cy} rx={r.rx} ry={r.ry} fill="none" stroke={alpha(C.lavender, 0.35)} strokeWidth={3} strokeDasharray="8 8" />;
          })}
          <ellipse cx={cur.cx} cy={cur.cy} rx={cur.rx} ry={cur.ry} fill="none" stroke={C.gold} strokeWidth={5} />
          <Probe x={px} y={py} size={80} f={f} tilt={0} />
          <VenusRow x={420} y={950} n={7} gap={175} r={36} lit={lit} f={f} />
          <Ledge x={1640} y={850} w={200} />
          <Tick x={1740} y={850} pxPerM={90} frame={f} facing={-1} pose="hold" expression="thinking" look={0.5} headTilt={Math.floor(lit) % 2 ? 8 : -4} squash={impact(f % 14, 0, 0.06, 6)} />
        </Layer>
        <Layer depth={0}>
          <Slab x={140} y={230} value={READ.flybys.text} size={110} F={SPACE} />
          <Label x={140} y={300} text="venus flybys" size={28} />
        </Layer>
      </Stage>
      {x6 > 0 ? (
        <AbsoluteFill style={{ opacity: x6 }}>
          <Stage theme={STUDIO.theme} cam={{ x: camX, y: 540, zoom: 1 }} vignette={0.12} grain={0.5}>
            <StudioRoom f={f} seed={13}>
              <Plate x={260} y={90} w={1400} h={560} fill="#1E5A6E">
                <Bloom x={S2.x - 260} y={S2.y - 90} r={160} color={C.gold} strength={0.6} />
              </Plate>
              <circle cx={S2.x} cy={S2.y} r={48} fill={C.gold} stroke={C.whiteGold} strokeWidth={4} />
              {Array.from({ length: 7 }, (_, i) => {
                const r = ring(S2.x, S2.y, 330, lerp(300, 50, i / 6));
                return <Orbit key={i} cx={r.cx} cy={r.cy} rx={r.rx} ry={r.ry} f={f} draw={lin(g, i * 4, i * 4 + 20)} color={i === 6 ? C.gold : alpha(CREAM, 0.6)} width={i === 6 ? 5 : 3} />;
              })}
              <Probe x={qx} y={qy} size={60} f={f} tilt={0} />
              {/* the timeline */}
              <line x1={pinA - 120} y1={800} x2={lerp(pinA - 120, pinB + 140, tlHead)} y2={800} stroke={STUDIO.text} strokeWidth={10} strokeLinecap="round" />
              {tlHead < 1 && tlHead > 0 ? <circle cx={lerp(pinA - 120, pinB + 140, tlHead)} cy={800} r={16} fill={C.saffronCore} stroke={C.saffron} strokeWidth={4} /> : null}
              {[pinA, pinB].map((x, i) => {
                const on = tlHead * (pinB + 260 - pinA) > x - pinA + 120;
                return on ? (
                  <g key={i}>
                    <circle cx={x} cy={800} r={18} fill={i ? C.magenta : C.saffron} stroke={INK} strokeWidth={4} />
                    <line x1={x} y1={782} x2={x} y2={720} stroke={STUDIO.text} strokeWidth={4} />
                  </g>
                ) : null;
              })}
              {tlHead >= 1 ? <path d={`M${pinA} 860 L${pinA} 880 L${pinB} 880 L${pinB} 860`} fill="none" stroke={C.saffron} strokeWidth={6} /> : null}
            </StudioRoom>
            <Layer depth={1}>
              <PillA x={pinA} y={700} text={READ.venus1.text} F={STUDIO} dot={C.saffron} size={26} align="middle" opacity={ez(g, 14, 24)} />
              <PillA x={pinB} y={700} text={READ.closestMonth.text} F={STUDIO} dot={C.magenta} size={26} align="middle" opacity={ez(g, 44, 54)} />
            </Layer>
          </Stage>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

// ================================================================================================================
// 2-07 + 2-08 · "On the twenty-fourth of December, 2024, it passed 3.8 million miles above the surface": the probe races
// low over the limb trailing a streak; a beacon pulse leaves it; a bracket opens down to the surface with the counter;
// then (push into the dark) the miles flip to kilometres and a speed dial's needle slams to 430,000 mph.
// MOVER: speed lines 30 px/f + wind 22 px/f + granules + the bracket drawing 30 px/f; the slam + speed lines 28 px/f.
// ================================================================================================================
const ShotPass: ShotFC<CL02> = ({ f, len, c }) => {
  const T8 = c.a08 - c.a07;
  const g = f - T8;
  const LIMB = { cx: 960, cy: 2900, R: 2250 };
  const px = lerp(1500, 900, f / Math.max(1, len));
  const py = 330;
  const surfY = LIMB.cy - Math.sqrt(LIMB.R * LIMB.R - (px - LIMB.cx) ** 2);
  const br = lin(f, 20, 20 + (surfY - py) / 30);
  const roll = ez(f, 26, 80);
  const dark = ez(g, 0, 30);
  const flip = g >= 0 && g < 12 ? Math.abs(Math.cos((g / 12) * Math.PI)) : 1;
  const deg = g < 8 ? 0 : Math.min(97, (g - 8) * 9) + (g > 20 ? Math.sin(g * 1.7) * 2 * Math.exp(-(g - 20) / 10) : 0);
  return (
    <AbsoluteFill>
      <Stage theme={GLOW.theme} cam={{ x: 960, y: lerp(540, 520, dark), zoom: lerp(1, 1.1, dark) }} vignette={0.3} grain={0.5}>
        <Layer depth={0.2}>
          <Sky family={GLOW} x={-400} y={-300} w={2720} h={1700} />
          <g opacity={dark * 0.9}>
            <SpaceField f={f} seed={43} n={90} />
          </g>
        </Layer>
        <Layer depth={1}>
          <g transform={`translate(0 ${dark * 220})`}>
            <WindStreaks f={f} cx={LIMB.cx} cy={LIMB.cy} r0={LIMB.R + 10} rMax={LIMB.R + 1300} a0={-130} a1={-50} speed={22} count={60} len={170} width={8} seed={44} opacity={0.75} />
            <SunLimb f={f} cx={LIMB.cx} cy={LIMB.cy} R={LIMB.R} granSize={80} drift={10} />
          </g>
          {/* speed lines: the probe racing left */}
          <WindStreaks f={f} mode="sweep" angle={0} box={{ x: -200, y: py - 130, w: 2320, h: 260 }} speed={30} count={34} len={220} width={8} seed={45} from={C.whiteGold} to={C.gold} opacity={0.8} />
          <line x1={px + 60} y1={py} x2={2200} y2={py} stroke={C.whiteGold} strokeWidth={10} strokeLinecap="round" opacity={0.85} />
          <Rings x={px} y={py} f={f} every={60} speed={14} maxR={420} color={C.cyan} width={6} from={10} />
          {/* the bracket from the probe down to the surface */}
          {g < 10 ? (
            <g opacity={1 - ez(g, 0, 10)} stroke={C.ink} strokeLinecap="round">
              <line x1={px - 120} y1={py + 50} x2={px - 120} y2={lerp(py + 50, surfY, br)} strokeWidth={7} />
              <line x1={px - 145} y1={py + 50} x2={px - 95} y2={py + 50} strokeWidth={7} />
              {br >= 1 ? <line x1={px - 145} y1={surfY} x2={px - 95} y2={surfY} strokeWidth={7} /> : <circle cx={px - 120} cy={lerp(py + 50, surfY, br)} r={12} fill={C.saffronCore} />}
            </g>
          ) : null}
          <Probe x={px} y={py} size={130} f={f} tilt={-20} />
          {g >= 0 ? (
            <g opacity={ez(g, 0, 10)}>
              <SumDial x={1450} y={620} r={200} deg={deg} f={g} title="speed" />
            </g>
          ) : null}
        </Layer>
        <Layer depth={0}>
          <g transform={`translate(0 ${230 * (1 - flip)}) scale(1 ${flip.toFixed(3)})`}>
            {g < 6 ? (
              <Slab x={120} y={230} value={rollText(READ.passMiles.value!, roll, 1)} unit="million miles" size={92} F={GLOW} check={roll >= 1} />
            ) : (
              <Slab x={120} y={230} value={READ.passKm.text.split(" ")[0]} unit="million km" size={92} F={SPACE} />
            )}
          </g>
          {g < 0 ? <PillA x={130} y={320} text={READ.closestDay.text} F={GLOW} dot={C.gold} size={26} opacity={ez(f, 30, 42)} /> : <PillA x={130} y={320} text={READ.passMph.text} F={SPACE} dot={C.vermilion} size={28} opacity={ez(g, 24, 34)} />}
        </Layer>
      </Stage>
    </AbsoluteFill>
  );
};

// ================================================================================================================
// 2-09 · "about 190 km/s, six times Earth's own speed": an Earth bar and a probe bar six times longer grow from one
// baseline (OUR SUM). MOVER: bars growing 30 px/f, then their stripes sliding 18 px/f + the pull back.
// ================================================================================================================
const ShotBars: ShotFC<CL02> = ({ f, len }) => {
  const U = 210;
  const x0 = 330;
  const e = Math.min(U, Math.max(0, f - 8) * 30);
  const p = Math.min(U * 6, Math.max(0, f - 14) * 30);
  const roll = ez(f, 14, 60);
  return (
    <Pop f={f}>
      <Stage theme={SPACE.theme} cam={cameraAt(f, [{ f: 0, x: 960, y: 560, zoom: 1.1 }, { f: len + 10, x: 960, y: 540, zoom: 0.98 }])} vignette={0.3} grain={0.5}>
        <Layer depth={0.3}>
          <SpaceField f={f} seed={46} n={110} />
        </Layer>
        <Layer depth={1}>
          <line x1={x0} y1={380} x2={x0} y2={820} stroke={CREAM} strokeWidth={6} />
          <Label x={x0 - 30} y={522} text="earth" size={30} align="end" />
          <Label x={x0 - 30} y={722} text="probe" size={30} align="end" />
          <SpeedBar x={x0} y={510} len={e} h={80} f={f} color={C.stampBlue} stripe="#1C4FA8" />
          <SpeedBar x={x0} y={710} len={p} h={80} f={f} color={C.gold} stripe={C.amber} speed={24} />
          {Array.from({ length: 5 }, (_, i) => (x0 + U * (i + 1) < x0 + p ? <line key={i} x1={x0 + U * (i + 1)} y1={666} x2={x0 + U * (i + 1)} y2={754} stroke={INK} strokeWidth={5} strokeDasharray="10 6" /> : null))}
          {p >= U * 6 ? <Label x={x0 + U * 6 + 30} y={724} text={READ.sixTimes.text} size={44} color={C.gold} raw /> : null}
          <Probe x={x0 + p + 90} y={600} size={90} f={f} tilt={180} trail={p < U * 6 ? 90 : 0} />
        </Layer>
        <Layer depth={0}>
          <Slab x={140} y={230} value={rollText(READ.passKms.value!, roll).replace(/^/, "about ")} unit={READ.passKms.unit} size={92} F={SPACE} check={roll >= 1} />
          <OurSumPill x={150} y={320} size={24} appear={ez(f, 20, 32)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 2-10 · "New York to Tokyo in under a minute" (class B, F3: words and an unnumbered stopwatch, nothing else): on the plate
// two dots sit on a faint arc; a probe dot zips along it while the stopwatch hand sweeps less than one turn; it runs twice.
// MOVER: the dot zipping ≈ 26 px/f with its trail + the stopwatch hand 6-7°/f + clouds.
// ================================================================================================================
const ShotTokyo: ShotFC<CL02> = ({ f, len }) => {
  const A: Pt = [400, 640];
  const B: Pt = [1420, 640];
  const arc: Pt[] = Array.from({ length: 60 }, (_, i) => {
    const u = i / 59;
    return [lerp(A[0], B[0], u), lerp(A[1], B[1], u) - Math.sin(u * Math.PI) * 300];
  });
  const runs = [
    [12, 60],
    [84, 132],
  ];
  let u = 1;
  let watch = 330;
  for (const [a, b] of runs) {
    if (f >= a - 10) {
      u = lin(f, a, b);
      watch = f < a ? 330 * (1 - lin(f, a - 10, a)) : 330 * lin(f, a, b);
    }
  }
  const pts = partialPts(arc, u);
  const dot = pts[pts.length - 1];
  return (
    <Pop f={f}>
      <Stage theme={STUDIO.theme} cam={cameraAt(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len + 10, x: 940, y: 530, zoom: 1.07 }])} vignette={0.12} grain={0.5}>
        <StudioRoom f={f} seed={14}>
          <Plate x={200} y={220} w={1380} h={580} fill="#1E5A6E" />
          <path d={smoothPath(arc, 0.5)} fill="none" stroke={alpha(CREAM, 0.4)} strokeWidth={6} strokeDasharray="12 10" />
          {pts.length > 1 ? <path d={smoothPath(pts, 0.5)} fill="none" stroke={C.gold} strokeWidth={10} strokeLinecap="round" /> : null}
          {[A, B].map((p, i) => (
            <g key={i}>
              <circle cx={p[0]} cy={p[1]} r={22} fill={i ? C.magenta : C.saffron} stroke={CREAM} strokeWidth={5} />
              <Label x={p[0]} y={p[1] + 70} text={i ? "tokyo" : "new york"} size={34} align="middle" />
            </g>
          ))}
          <Bloom x={dot[0]} y={dot[1]} r={70} color={C.whiteGold} strength={0.8} />
          <circle cx={dot[0]} cy={dot[1]} r={16} fill="#FFFFFF" stroke={C.gold} strokeWidth={4} />
          <Watch x={1700} y={420} r={100} angle={watch} f={f} />
          <Tick x={1720} y={900} pxPerM={150} frame={f} facing={-1} pose="hold" expression="surprised" look={0.4} />
        </StudioRoom>
        <Layer depth={0}>
          <PillA x={120} y={110} text="new york to tokyo · under a minute" F={STUDIO} dot={C.gold} size={28} opacity={ez(f, 6, 18)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 2-11 + 2-12 · "the probe flew itself, out of contact with Earth": the probe racing alone; far off a faint Earth dot and
// a dashed signal link that breaks and fades; then a calendar page lands on 26 DEC and beacon rings spread from the probe
// across to Earth, which glows; Tick cups an ear, then cheers.
// MOVER: speed lines 24 px/f + the link's dashes dying; the rings 22 px/f + the calendar dropping 30 px/f.
// ================================================================================================================
const ShotBeacon: ShotFC<CL02> = ({ f, len, c }) => {
  const T12 = c.a12 - c.a11;
  const g = f - T12;
  const P: Pt = [560, 620];
  const E: Pt = [1640, 300];
  const dist = Math.hypot(E[0] - P[0], E[1] - P[1]);
  const linkK = 1 - ez(f, 30, 80);
  const reach = g >= 6 ? 20 + (g - 6) * 22 : 0;
  const glow = reach >= dist ? ez(g, 6 + (dist - 20) / 22, 16 + (dist - 20) / 22) : 0;
  const calY = g < 0 ? -400 : Math.min(140, -400 + g * 30);
  const n = 14;
  return (
    <AbsoluteFill>
      <Stage theme={SPACE.theme} shotFrame={f} drift={{ zoom: 1.05, panX: -0.012, panY: 0, frames: 200, seed: 6 }} vignette={0.3} grain={0.5}>
        <Layer depth={0.3}>
          <SpaceField f={f} seed={47} n={120} stream={g < 0 ? 8 : 3} angle={0} />
        </Layer>
        <Layer depth={1}>
          <Bloom x={-150} y={700} r={700} color={C.amber} strength={0.45} />
          <WindStreaks f={f} mode="sweep" angle={0} box={{ x: -200, y: P[1] - 150, w: 2320, h: 300 }} speed={g < 0 ? 24 : 12} count={28} len={200} width={7} seed={48} from={C.whiteGold} to={C.gold} opacity={0.7} />
          {/* the signal link: dashes marching to Earth, then breaking from the middle and fading */}
          {Array.from({ length: n }, (_, i) => {
            const u0 = i / n;
            const mid = Math.abs(u0 - 0.5);
            const alive = linkK > 0 && mid > (1 - linkK) * 0.55;
            if (!alive) return null;
            const off = ((f * 12) % (dist / n)) / dist;
            const a = Math.min(1, u0 + off);
            const b = Math.min(1, a + 0.035);
            return <line key={i} x1={lerp(P[0], E[0], a)} y1={lerp(P[1], E[1], a)} x2={lerp(P[0], E[0], b)} y2={lerp(P[1], E[1], b)} stroke={C.cyan} strokeWidth={6} strokeLinecap="round" opacity={0.85 * linkK} />;
          })}
          {g >= 6 ? <Rings x={P[0]} y={P[1]} f={g} from={6} every={18} speed={22} maxR={dist + 120} color={C.cyan} width={8} /> : null}
          <Bloom x={E[0]} y={E[1]} r={120 + 80 * glow} color={C.stampBlue} strength={0.3 + 0.6 * glow} />
          <Planet x={E[0]} y={E[1]} r={30} f={f} kind="earth" light={200} />
          <Probe x={P[0]} y={P[1]} size={170} f={f} tilt={0} trail={g < 0 ? 150 : 60} />
          <Ledge x={1560} y={560} w={200} />
          <Tick x={1660} y={560} pxPerM={80} frame={f} facing={-1} pose={g < 0 ? "stand" : glow > 0.3 ? "cheer" : "listen"} expression={glow > 0.3 ? "happy" : g < 0 ? "worried" : "thinking"} look={0.2} squash={impact(g, 6 + Math.round((dist - 20) / 22), 0.12, 10)} />
          {g >= 0 ? <Calendar x={1060} y={calY} w={220} f={f} flipping={0} text={READ.beacon.text} /> : null}
        </Layer>
        <Layer depth={0}>
          <PillA x={120} y={110} text="out of contact" F={SPACE} dot={C.cyan} size={28} opacity={ez(f, 8, 20) * (1 - ez(g, 0, 14))} />
        </Layer>
      </Stage>
    </AbsoluteFill>
  );
};

// ================================================================================================================
// 2-13 · "In September 2025 it matched the same distance and speed again, for the fourth time": four check stamps at the
// orbit's closest point, the fourth lighting as the probe laps through. MOVER: the probe lapping ≈ 20 px/f + stamps.
// ================================================================================================================
const ShotFourth: ShotFC<CL02> = ({ f, len }) => {
  const S = { x: 520, y: 560, r: 105 };
  const rx = 700;
  const ry = 420;
  const cc = Math.sqrt(rx * rx - ry * ry);
  const cx = S.x + cc;
  const PASS = 70; // frame the probe reaches the closest point
  const t = Math.PI + (f - PASS) * 0.034;
  const [px, py] = ellipsePt(cx, S.y, rx, ry, t);
  const heading = (Math.atan2(Math.cos(t) * ry, -Math.sin(t) * rx) * 180) / Math.PI;
  const trail: Pt[] = Array.from({ length: 40 }, (_, i) => ellipsePt(cx, S.y, rx, ry, t - (39 - i) * 0.012));
  return (
    <Pop f={f}>
      <Stage theme={SPACE.theme} cam={cameraAt(f, [{ f: 0, x: 980, y: 540, zoom: 1.0 }, { f: len + 10, x: 860, y: 540, zoom: 1.1 }])} vignette={0.3} grain={0.5}>
        <Layer depth={0.3}>
          <SpaceField f={f} seed={49} n={110} />
        </Layer>
        <Layer depth={1}>
          <WindStreaks f={f} cx={S.x} cy={S.y} r0={S.r + 20} rMax={1400} a0={-180} a1={180} speed={14} count={50} len={100} width={6} seed={49} opacity={0.45} />
          <ellipse cx={cx} cy={S.y} rx={rx} ry={ry} fill="none" stroke={alpha(C.lavender, 0.55)} strokeWidth={4} strokeDasharray="12 10" strokeDashoffset={-f * 2} />
          <SunDisc x={S.x} y={S.y} r={S.r} f={f} />
          <path d={smoothPath(trail, 0.5)} fill="none" stroke={C.whiteGold} strokeWidth={8} strokeLinecap="round" opacity={0.8} />
          <Probe x={px} y={py} size={100} f={f} tilt={heading + 180} />
          {[0, 1, 2, 3].map((i) => (
            <CheckStamp key={i} x={190 + i * 110} y={860} age={i < 3 ? f - 8 - i * 12 : f - PASS} size={84} lit={i === 3} />
          ))}
          <line x1={S.x - S.r - 30} y1={S.y} x2={cx - rx - 10} y2={S.y} stroke={C.saffron} strokeWidth={4} opacity={0.7} />
        </Layer>
        <Layer depth={0}>
          <PillA x={1240} y={110} text={READ.sep2025.text} F={SPACE} dot={C.gold} size={28} opacity={ez(f, 6, 18)} />
          <PillA x={1240} y={180} text="fourth time" F={SPACE} dot={C.stampGreen} size={28} opacity={ez(f, PASS, PASS + 10)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================

export const SceneL02: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL02(t);
  const shots: ShotDef<CL02>[] = [
    { from: 0, S: ShotCard, id: "2-01" },
    { from: c.a02, S: ShotStub, id: "2-02" },
    { from: c.a03, S: ShotVenus, id: "2-03" }, // + 2-04
    { from: c.a05, S: ShotFlybys, id: "2-05" }, // + 2-06
    { from: c.a07, S: ShotPass, id: "2-07" }, // + 2-08
    { from: c.a09, S: ShotBars, id: "2-09" },
    { from: c.a10, S: ShotTokyo, id: "2-10" },
    { from: c.a11, S: ShotBeacon, id: "2-11" }, // + 2-12
    { from: c.a13, S: ShotFourth, id: "2-13" },
  ];
  return playShots(f, shots, c, t.frames);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL02 = (t: SceneTiming): Cue[] => {
  const c = cuesL02(t);
  const run = (at: number, n: number, gap: number, vol = 0.08): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 8 }));
  return [
    { at: 6, file: SFX.pop, vol: 0.16, dur: 16 },
    ...cutHit(c.a02),
    { at: c.a02 + 12, file: SFX.pop, vol: 0.12, dur: 16 },
    ...cutHit(c.a03),
    { at: c.a03 + 10, file: SFX.swirl, vol: 0.16, dur: 60 },
    { at: c.a04 + 6, file: SFX.whoosh, vol: 0.16, dur: 40 },
    ...cutHit(c.a05),
    ...run(c.a05 + 6, 7, 14, 0.1),
    { at: c.a06 + 14, file: SFX.click, vol: 0.12, dur: 10 },
    { at: c.a06 + 44, file: SFX.click, vol: 0.12, dur: 10 },
    ...cutHit(c.a07),
    { at: c.a07 + 4, file: SFX.whoosh, vol: 0.2, dur: 50 },
    ...run(c.a08 + 8, 6, 3),
    { at: c.a08 + 18, file: SFX.boom, vol: 0.28, dur: 90, fadeOut: 30 },
    ...cutHit(c.a09),
    { at: c.a09 + 14, file: SFX.popLong, vol: 0.16, dur: 30 },
    ...cutHit(c.a10),
    ...run(c.a10 + 12, 8, 6),
    ...run(c.a10 + 84, 8, 6),
    ...cutHit(c.a11),
    { at: c.a11 + 4, file: SFX.swirl, vol: 0.14, dur: 60 },
    { at: c.a12 + 30, file: SFX.chime, vol: 0.18, dur: 70 },
    ...cutHit(c.a13),
    ...[8, 20, 32, 70].map((o) => ({ at: c.a13 + o, file: SFX.click, vol: 0.12, dur: 10 })),
  ];
};
