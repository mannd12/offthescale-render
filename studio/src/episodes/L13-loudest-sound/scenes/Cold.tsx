// L13 scene "cold" (storyboard §3 "Cold open": shots C-01…C-13, script lines 0-6, family dusk, Act I).
// Shot components (PUSH/ZT = one component): C-01+C-02 (morning over the island, descend to Tick writing) · C-03 (the
// first ring, Tick snaps east) · C-04 (time-lapse: sun arc, three rings, tallies, clock to 3 p.m.) · C-05+C-06 (pull
// out ×20 to the schematic Indian Ocean, the dashed arc east, ~4,800 km) · C-07 (a ring crawls back along the arc, ~4 h)
// · C-08 (push into the pin, zoom-through to Tick turning) · C-09 (the gauge races up into an unlabelled saffron line) ·
// C-10 (Tick shoves the line with the staff) · C-11 (slot-machine readout, stops blank) · C-12 ("past it": the fill
// buckles into a front rising off the frame) · C-13 (ChapterCard 1 with saffron rings behind the type).
// Numbers drawn, each with its sources.md row: 27 AUGUST 1883 · UNTIL 3 P.M. · RODRIGUEZ (#1) · ~4,800 km · ALMOST 3,000
// MILES (#1) · ~4 h (#13 arithmetic, F2). The ceiling is UNLABELLED throughout (F1). No cover-ears: Tick braces with
// `shield` (F17). Map outlines are schematic with a SCHEMATIC pill (F16, F14).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  Bloom,
  Caustics,
  CloudRack,
  Counter,
  Emissive,
  Flock,
  GroundShadow,
  IF2,
  Kicker,
  Layer,
  LightWash,
  Metric,
  Motes,
  Pill,
  Plume,
  Sky,
  Stage,
  Streamers,
  Tick,
  ZoomThrough,
  alpha,
  cameraAt,
  cutPop,
  flash,
  impact,
  mixHex,
  ramp,
  rnd,
  seaSurface,
  smooth,
} from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { L13_COLORS, familyOf, pillFill } from "../families";
import { DB, L13Gauge } from "../L13Gauge";
import { Jetty, Notebook, Palm, SitePin, SurveyMap, mapPoint } from "../props";
import { Rings, ShockFront } from "../sound";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";

const D = familyOf("dusk");
const N = familyOf("noon");
const SAF = L13_COLORS.saffron;

// the island world (design px): horizon, jetty deck, Tick's mark
const HORIZON = 600;
const JETTY_Y = 790; // Jetty y (deck top = 774)
const TX = 1000;
const TY = 774;
const PPM = 120;
const CEILING = { v: DB.ceiling /* #11, unlabelled until l03 line 3 (F1) */ };

export const cuesCold = (t: SceneTiming) => {
  const { at, p, end } = cueKit(t);
  return {
    start: 0,
    write: p(0, "the chief of police"), // C-02: descend to Tick writing (continuous push)
    reports: p(0, "Reports from the east"), // C-03: close on Tick
    guns: p(0, "heavy guns"), // the ring arrives, head snaps east
    lapse: at(1), // C-04
    noGuns: at(2), // C-05: pull out
    arc: p(2, "almost three thousand"), // C-06: the arc draws east
    km: p(2, "About four thousand"),
    crawl: at(3), // C-07: the ring crawls back
    zt: p(3, "because that is how long"), // C-08: push in, zoom-through to Tick
    gauge: at(4), // C-09
    question: p(4, "How loud can"),
    shove: p(4, "The air itself"), // C-10
    number: p(4, "and we know its number"), // C-11
    past: at(5), // C-12
    card: at(6), // C-13
    last: end(6),
    end: t.frames,
  };
};
export type CCold = ReturnType<typeof cuesCold>;

const Pop: React.FC<{ f: number; children: React.ReactNode }> = ({ f, children }) => (
  <AbsoluteFill style={{ transform: `scale(${cutPop(f, 0)})`, transformOrigin: "50% 50%" }}>{children}</AbsoluteFill>
);

// ---------------------------------------------------------------------------------------------
// the island morning: sky, sun, apricot cumulus, swell bands, island + jetty, foreground palms

const SEA_BANDS = [
  { y: HORIZON + 6, c: "#3E8C93", amp: 4, wl: 260, sp: 2.4 },
  { y: 660, c: "#2F7D88", amp: 6, wl: 300, sp: 3.0 },
  { y: 730, c: "#256F7C", amp: 8, wl: 340, sp: 3.6 },
  { y: 820, c: "#1C5F6E", amp: 11, wl: 380, sp: 4.2 },
  { y: 930, c: "#154F5E", amp: 14, wl: 420, sp: 4.8 },
];

const World: React.FC<{
  f: number;
  sun?: [number, number];
  sky?: string[];
  cloudSpeed?: number;
  palmSway?: number;
  palmPeriod?: number;
  palmBend?: number;
  wind?: number;
  children?: React.ReactNode;
  hud?: React.ReactNode;
}> = ({ f, sun = [1640, 560], sky, cloudSpeed = 2.4, palmSway = 30, palmPeriod = 80, palmBend = 0, wind = 6, children, hud }) => (
  <>
    <Layer depth={0.05}>
      <Sky family={D} stops={sky} />
    </Layer>
    <Layer depth={0.1}>
      <Bloom x={sun[0]} y={sun[1]} r={420} color={D.light} core={46} coreColor="#FFEFC0" strength={0.9 + 0.1 * Math.sin(f / 14)} />
    </Layer>
    <Layer depth={0.25}>
      <CloudRack f={f} n={5} x0={-700} x1={2700} y0={150} y1={420} size={120} speed={cloudSpeed} body="#F4B183" under="#B8613F" top="#FFE2B6" seed={3} />
    </Layer>
    <Layer depth={0.35}>
      <Flock frame={f} x={300} y={250} vx={1.6} n={5} size={11} color={alpha(D.near, 0.7)} seed={4} />
    </Layer>
    <Layer depth={0.7}>
      <rect x={-1400} y={HORIZON} width={4800} height={1600} fill="#46969A" />
      {SEA_BANDS.map((b, i) => (
        <path key={i} d={seaSurface(f, -1400, 3400, b.y, b.amp, b.wl, b.sp * 9, 2400, 30)} fill={b.c} />
      ))}
      <LightWash x={sun[0]} y={HORIZON + 80} rx={420} ry={120} color={D.light} strength={0.45} />
    </Layer>
    <Layer depth={1}>
      {/* the low island: sand rim, green body, a few small palms */}
      <path d={`M-900 ${JETTY_Y + 40} Q -300 ${HORIZON - 120} 380 ${HORIZON - 10} Q 620 ${HORIZON + 40} 700 ${JETTY_Y + 40} Z`} fill="#E3A256" />
      <path d={`M-900 ${JETTY_Y + 40} Q -300 ${HORIZON - 150} 340 ${HORIZON - 30} Q 560 ${HORIZON + 10} 610 ${JETTY_Y + 40} Z`} fill="#2F6B52" />
      <path d={`M-900 ${JETTY_Y + 40} Q -300 ${HORIZON - 150} 340 ${HORIZON - 30} L 300 ${HORIZON + 20} Q -200 ${HORIZON - 60} -900 ${JETTY_Y} Z`} fill={mixHex("#2F6B52", D.light, 0.25)} opacity={0.6} />
      {[
        [80, 640, 230, 2],
        [250, 620, 260, 5],
        [-120, 610, 240, 7],
      ].map(([x, y, h, s]) => (
        <Palm key={s} x={x} y={y} h={h} f={f} sway={palmSway * 0.4} period={palmPeriod} bend={palmBend * 0.6} seed={s} trunk="#6B4428" frond="#2F8F6E" frondDark="#1D5A4A" />
      ))}
      <Jetty x={560} y={JETTY_Y} w={720} family={D} posts={7} postH={120} f={f} />
      {children}
    </Layer>
    <Layer depth={1.2}>
      <Streamers f={f} n={9} x0={-300} x1={2300} y0={280} y1={880} len={150} width={3.5} speed={wind} color={alpha("#FFE9C8", 0.7)} opacity={0.35} seed={6} dir={-1} />
    </Layer>
    <Layer depth={1.35}>
      <Palm x={40} y={1220} h={980} f={f} sway={palmSway} period={palmPeriod} bend={palmBend} lean={0.18} silhouette="#0A2730" seed={1} />
      <Palm x={1900} y={1260} h={860} f={f} sway={palmSway} period={palmPeriod * 0.9} bend={palmBend} lean={-0.2} silhouette="#0A2730" seed={9} />
    </Layer>
    {hud ? <Layer depth={0}>{hud}</Layer> : null}
  </>
);

/** Tick on the jetty with its notebook (playing the chief of police); `write` loops the page turns. */
const JettyTick: React.FC<{
  f: number;
  pose?: React.ComponentProps<typeof Tick>["pose"];
  poseTo?: React.ComponentProps<typeof Tick>["pose"];
  poseT?: number;
  expression?: React.ComponentProps<typeof Tick>["expression"];
  expressionTo?: React.ComponentProps<typeof Tick>["expression"];
  expressionT?: number;
  look?: number;
  headTilt?: number;
  write?: boolean;
  flutter?: number;
  book?: boolean;
  tilt?: number;
  y?: number;
}> = ({ f, pose = "hold", poseTo, poseT, expression = "thinking", expressionTo, expressionT, look = 0.2, headTilt = 0, write = false, flutter = 0, book = true, tilt = 0, y = TY }) => {
  const turn = write ? smooth(((f % 30) / 30) * 1.4) : 0;
  return (
    <g>
      <GroundShadow x={TX + 6} y={TY + 2} rx={PPM * 0.42} color={D.shadow} opacity={0.35} blur={8} />
      <Tick x={TX} y={y} pxPerM={PPM} frame={f} facing={1} pose={pose} poseTo={poseTo} poseT={poseT} expression={expression} expressionTo={expressionTo} expressionT={expressionT} look={look} headTilt={headTilt} tilt={tilt} />
      {book ? <Notebook x={TX + PPM * 0.5} y={y - PPM * 0.98} w={PPM * 0.62} h={PPM * 0.4} turn={turn} flutter={flutter} f={f} tilt={-12} /> : null}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------
// C-01 + C-02 · morning over the Indian Ocean; descend to the jetty; Tick writes in a notebook.
const ShotMorning: ShotFC<CCold> = ({ f, len, c }) => {
  const w = c.write;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 470, zoom: 1.0 },
    { f: w - 6, x: 985, y: 560, zoom: 1.14 },
    { f: w + 28, x: 1020, y: 668, zoom: 2.15 },
    { f: len + 40, x: 1030, y: 672, zoom: 2.35 },
  ]);
  const kick = 1 - ramp(f, w - 10, w + 4);
  const pill = ramp(f, w + 20, w + 34);
  return (
    <Stage theme={D.theme} cam={cam} vignette={0.16} grain={0.5}>
      <World
        f={f}
        hud={
          <g>
            <g opacity={ramp(f, 8, 24) * kick}>
              <Kicker x={120} y={150} text="27 AUGUST 1883" /* #1 */ color={D.text} size={30} />
            </g>
            <g opacity={pill}>
              <Pill x={120} y={150} text="RODRIGUEZ · INDIAN OCEAN" /* #1 (report spelling, F10) */ fill={pillFill(D)} color={D.text} dot={L13_COLORS.vermilion} size={24} />
            </g>
          </g>
        }
      >
        <JettyTick f={f} write={f > w} look={-0.2} headTilt={8} />
      </World>
    </Stage>
  );
};

// C-03 · close on Tick: on "heavy guns" the head snaps east; a saffron ring front sweeps right → left over the frame.
const ShotHeavyGuns: ShotFC<CCold> = ({ f, len, c }) => {
  const g = c.guns - c.reports;
  const snap = Math.max(0, (f - g) / 12);
  const cam = cameraAt(f, [
    { f: 0, x: 1020, y: 660, zoom: 3.25 },
    { f: len + 30, x: 1040, y: 652, zoom: 3.5 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={D.theme} cam={cam} vignette={0.18} grain={0.5}>
        <World
          f={f + 200}
          wind={8}
          hud={
            <g>
              {/* a faint early report, then the big front on "heavy guns" (each crosses ~1,900 px at 25 px/f) */}
              <Rings f={f} cx={2750} cy={560} period={999} speed={22} maxR={3000} width={7} start={-40} count={1} opacity={0.4} />
              <Rings f={f} cx={2750} cy={560} period={18} speed={25} maxR={3000} width={11} start={g - 62} count={2} opacity={0.95} />
            </g>
          }
        >
          <JettyTick
            f={f}
            write={f < g}
            pose="hold"
            poseTo="listen"
            poseT={Math.min(1.6, snap)}
            expression="thinking"
            expressionTo="surprised"
            expressionT={ramp(f, g, g + 6)}
            look={f < g ? -0.3 : 1}
            headTilt={f < g ? 9 : -4}
            flutter={ramp(f, g, g + 6)}
            tilt={f < g ? 0 : 4 * smooth(ramp(f, g, g + 10))}
          />
        </World>
      </Stage>
    </Pop>
  );
};

// C-04 · time-lapse: the sun arcs over, the sky warms, three rings arrive, Tick tallies each; the clock lands on 3 P.M.
const ShotTimeLapse: ShotFC<CCold> = ({ f, len }) => {
  const u = Math.min(1, f / Math.max(1, len - 12));
  const sun: [number, number] = [1760 - 1320 * u, 640 - 560 * Math.sin(Math.PI * Math.min(1, u * 0.85))];
  const k = Math.sin(Math.PI * u) * 0.55;
  const sky = D.sky.map((s, i) => mixHex(s, N.sky[Math.min(i, N.sky.length - 1)], k));
  const hits = [0.16, 0.48, 0.8].map((q) => Math.round(q * len));
  const tallies = hits.filter((h) => f >= h + 8).length;
  const near = hits.reduce((m, h) => Math.min(m, Math.abs(f - h - 6)), 99);
  const cam = cameraAt(f, [
    { f: 0, x: 1000, y: 640, zoom: 1.7 },
    { f: len - 22, x: 990, y: 630, zoom: 1.62 },
    { f: len + 10, x: 960, y: 600, zoom: 1.2 },
  ]);
  // the clock: 8 o'clock → 3 o'clock, the minute hand sweeping seven turns (#1: "until 3 p.m.")
  const hours = 8 + 7 * smooth(u);
  const ha = ((hours % 12) / 12) * 360 - 90;
  const ma = (hours % 1) * 360 - 90;
  const shadowLen = 70 + 160 * (1 - Math.sin(Math.PI * u));
  const sdir = sun[0] > 960 ? -1 : 1;
  return (
    <Pop f={f}>
      <Stage theme={D.theme} cam={cam} vignette={0.16} grain={0.5}>
        <World
          f={f * 3}
          sun={sun}
          sky={sky}
          cloudSpeed={3}
          hud={
            <g>
              {hits.map((h, i) => (
                <Rings key={i} f={f} cx={2600} cy={600} period={999} speed={30} maxR={2900} width={8} start={h - 50} count={1} opacity={0.75} />
              ))}
              <Kicker x={120} y={150} text="UNTIL 3 P.M." /* #1 */ color={D.text} size={30} />
              {/* clock + tally card */}
              <g transform="translate(200 300)">
                <circle r={74} fill={pillFill(D)} />
                <circle r={62} fill="#FFF4E6" />
                {Array.from({ length: 12 }, (_, i) => {
                  const a = (i / 12) * Math.PI * 2;
                  return <line key={i} x1={Math.cos(a) * 50} y1={Math.sin(a) * 50} x2={Math.cos(a) * 58} y2={Math.sin(a) * 58} stroke={D.near} strokeWidth={i % 3 ? 2 : 4} />;
                })}
                <line x1={0} y1={0} x2={Math.cos((ha * Math.PI) / 180) * 32} y2={Math.sin((ha * Math.PI) / 180) * 32} stroke={D.near} strokeWidth={7} strokeLinecap="round" />
                <line x1={0} y1={0} x2={Math.cos((ma * Math.PI) / 180) * 50} y2={Math.sin((ma * Math.PI) / 180) * 50} stroke={L13_COLORS.vermilion} strokeWidth={4} strokeLinecap="round" />
                <circle r={6} fill={D.near} />
                {/* the tally: one stroke per report */}
                {Array.from({ length: tallies }, (_, i) => (
                  <line key={i} x1={110 + i * 26} y1={-40} x2={104 + i * 26} y2={40} stroke="#FFF4E6" strokeWidth={9} strokeLinecap="round" transform={`translate(0 ${(-impact(f, hits[i] + 8, 0.4, 8).sy + 1) * 20})`} />
                ))}
              </g>
            </g>
          }
        >
          {/* Tick's shadow swings with the sun */}
          <path d={`M${TX - 20} ${TY + 2} L${TX + 20} ${TY + 2} L${TX + sdir * shadowLen + 26} ${TY + 14} L${TX + sdir * shadowLen - 26} ${TY + 14} Z`} fill={D.shadow} opacity={0.32} />
          <JettyTick f={f} write={near > 10} pose={near < 10 ? "listen" : "hold"} expression="determined" look={near < 14 ? 1 : -0.2} headTilt={near < 14 ? -4 : 8} />
        </World>
      </Stage>
    </Pop>
  );
};

// ---------------------------------------------------------------------------------------------
// the survey map of the Indian Ocean (petrol sea, ochre schematic coasts), Rodriguez and Krakatoa

const MAP = { x: -60, y: -60, w: 2040, h: 1200 };
const R_PIN = mapPoint("indian", MAP, "rodriguez"); // #1
const K_PIN = mapPoint("indian", MAP, "krakatoa");
const CTRL: [number, number] = [(R_PIN[0] + K_PIN[0]) / 2 - 40, Math.min(R_PIN[1], K_PIN[1]) - 230];
const arcPt = (u: number): [number, number] => {
  const a = 1 - u;
  return [a * a * R_PIN[0] + 2 * a * u * CTRL[0] + u * u * K_PIN[0], a * a * R_PIN[1] + 2 * a * u * CTRL[1] + u * u * K_PIN[1]];
};
const arcPath = (u0: number, u1: number) => {
  const pts: string[] = [];
  const n = Math.max(2, Math.ceil((u1 - u0) * 80));
  for (let i = 0; i <= n; i++) {
    const [x, y] = arcPt(u0 + ((u1 - u0) * i) / n);
    pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return "M" + pts.join(" L");
};

const MapScene: React.FC<{ f: number; cam: { x: number; y: number; zoom: number }; arc: number; ring?: number | null; kGrow?: number; hud?: React.ReactNode; flashAt?: number }> = ({ f, cam, arc, ring = null, kGrow = 0, hud, flashAt }) => (
  <Stage theme={D.theme} cam={cam} vignette={0.2} grain={0.5}>
    <Layer depth={1}>
      <SurveyMap view="indian" {...MAP} family={D} frame={f} schematic={false} sea="#1E6E78" land={L13_COLORS.land} />
      <Caustics f={f} x={-100} y={-100} w={2120} h={1280} rows={9} color="#BFEDE6" width={5} opacity={0.12} speed={1.8} />
      {arc > 0 ? <path d={arcPath(0, arc)} fill="none" stroke="#FFF4E6" strokeWidth={5} strokeDasharray="18 12" strokeLinecap="round" opacity={0.9} /> : null}
      {/* distance ticks every 1,000 km of the ~4,800 (#1) */}
      {[1, 2, 3, 4].map((k) => {
        const u = k / 4.8;
        if (arc < u) return null;
        const [x, y] = arcPt(u);
        const [x2, y2] = arcPt(u + 0.01);
        const nx = -(y2 - y);
        const ny = x2 - x;
        const L = Math.hypot(nx, ny) || 1;
        return <line key={k} x1={x - (nx / L) * 16} y1={y - (ny / L) * 16} x2={x + (nx / L) * 16} y2={y + (ny / L) * 16} stroke="#FFF4E6" strokeWidth={5} strokeLinecap="round" />;
      })}
      {arc > 0 && arc < 1 ? (
        <g>
          <circle cx={arcPt(arc)[0]} cy={arcPt(arc)[1]} r={16} fill={SAF} />
          <circle cx={arcPt(arc)[0]} cy={arcPt(arc)[1]} r={30} fill="none" stroke={SAF} strokeWidth={4} opacity={0.6} />
        </g>
      ) : null}
      {kGrow > 0 ? (
        <g opacity={Math.min(1, kGrow * 3)}>
          <Plume x={K_PIN[0]} y={K_PIN[1] - 6} h={150 * kGrow} r0={12} fill={mixHex(SAF, "#FFF4E6", 0.45)} shade={L13_COLORS.saffronDeep} lit={L13_COLORS.saffronCore} frame={f} t={kGrow} seed={3} />
          <SitePin x={K_PIN[0]} y={K_PIN[1]} kind="source" size={13} frame={f} />
        </g>
      ) : null}
      {ring !== null ? (
        <g>
          <Rings f={f} cx={arcPt(ring)[0]} cy={arcPt(ring)[1]} period={10} speed={5} maxR={90} width={5} />
          <circle cx={arcPt(ring)[0]} cy={arcPt(ring)[1]} r={18} fill={SAF} />
        </g>
      ) : null}
      <SitePin x={R_PIN[0]} y={R_PIN[1]} kind="here" size={14} frame={f} />
    </Layer>
    <Layer depth={1.1}>
      {/* cloud shadows sliding over the chart */}
      <CloudRack f={f} n={5} x0={-600} x1={2600} y0={200} y1={1000} size={150} speed={2.2} body={alpha("#06222A", 0.22)} seed={8} />
    </Layer>
    <Layer depth={0}>
      <Pill x={1800} y={960} text="SCHEMATIC" /* F16 */ fill={pillFill(D)} color={D.text} size={18} align="end" />
      {hud}
      {flashAt !== undefined ? <rect x={0} y={0} width={1920} height={1080} fill="#FFF4E6" opacity={flash(f, flashAt, 10, 0.55)} /> : null}
    </Layer>
  </Stage>
);

/** The jetty world as C-04 left it, for the pull-out overlay (C-05) and the zoom-through (C-08). */
const JettyFrame: React.FC<{ f: number; zoom?: number; turn?: number }> = ({ f, zoom = 2.0, turn = -1 }) => (
  <Stage theme={D.theme} cam={{ x: 1010, y: 660, zoom }} vignette={0.16} grain={0.4}>
    <World f={f + 400}>
      {turn < 0 ? (
        <JettyTick f={f} pose="hold" expression="determined" look={-0.2} headTilt={8} />
      ) : (
        <JettyTick f={f} pose="hold" poseTo="listen" poseT={Math.min(1.6, turn)} expression="thinking" expressionTo="surprised" expressionT={Math.min(1, turn * 2)} look={turn > 0.2 ? 1 : -0.2} headTilt={turn > 0.2 ? -4 : 8} flutter={Math.min(1, turn)} />
      )}
    </World>
  </Stage>
);

// C-05 + C-06 · "There were no guns": the island shrinks ×20 to the vermilion pin; a dashed arc draws east to Krakatoa.
const ShotMapOut: ShotFC<CCold> = ({ f, c }) => {
  const OUT = 54;
  const a0 = c.arc - c.noGuns;
  const cam = cameraAt(f, [
    { f: 0, x: R_PIN[0], y: R_PIN[1] - 20, zoom: 20 },
    { f: OUT, x: 960, y: 560, zoom: 1.0 },
    { f: a0, x: 960, y: 560, zoom: 1.0 },
    { f: a0 + 110, x: 1010, y: 545, zoom: 1.05 },
  ]);
  const arc = Math.max(0, Math.min(1, (f - a0) / 84)); // the drawing head: ~12-14 px/f along the arc
  const kGrow = ramp(f, a0 + 80, a0 + 104);
  // pull-out overlay: the jetty world shrinking into the pin
  const zr = cam.zoom / 20;
  const ps = [960 + (R_PIN[0] - cam.x) * cam.zoom, 540 + (R_PIN[1] - 20 - cam.y) * cam.zoom];
  const ov = 1 - smooth(ramp(f, 4, 30));
  const km = 4800 * Math.min(1, arc * 1.02); // #1 (2,968 mi ≈ 4,780 km)
  return (
    <AbsoluteFill>
      <MapScene
        f={f}
        cam={cam}
        arc={arc}
        kGrow={kGrow}
        hud={
          arc > 0 ? (
            <g>
              <text x={112} y={190} style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 88, fill: D.text }}>
                ~
              </text>
              <Counter x={170} y={190} value={km} max={4800} digits={4} size={88} color={D.text} unit="km" />
              <g opacity={ramp(f, c.km - c.noGuns - 30, c.km - c.noGuns - 10)}>
                <Pill x={120} y={262} text="ALMOST 3,000 MILES" /* #1 */ fill={pillFill(D)} color={D.text} dot={SAF} size={24} />
              </g>
            </g>
          ) : null
        }
      />
      {ov > 0.01 ? (
        <AbsoluteFill style={{ transformOrigin: "0 0", transform: `translate(${ps[0] - 960 * zr}px, ${ps[1] - 540 * zr}px) scale(${zr})`, opacity: ov }}>
          <JettyFrame f={f} />
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

// C-07 · a sound ring crawls along the arc from the plume back to the island; a clock hand sweeps (~4 h, #13 / F2).
const ShotCrawl: ShotFC<CCold> = ({ f, len }) => {
  const v = 1 - Math.min(1, f / Math.max(1, len + 6));
  const hand = f * 12;
  return (
    <Pop f={f}>
      <MapScene
        f={f + 140}
        cam={{ x: 1010 - f * 0.4, y: 545, zoom: 1.05 + f * 0.0008 }}
        arc={1}
        kGrow={1}
        ring={v}
        hud={
          <g>
            <g transform="translate(176 160)">
              <circle r={50} fill="#FFF4E6" />
              <line x1={0} y1={0} x2={Math.cos(((hand - 90) * Math.PI) / 180) * 40} y2={Math.sin(((hand - 90) * Math.PI) / 180) * 40} stroke={L13_COLORS.vermilion} strokeWidth={6} strokeLinecap="round" />
              <circle r={6} fill={D.near} />
            </g>
            <Metric x={250} y={192} value="~4" unit="h" /* #13 arithmetic: 4,780 km ÷ 340 m/s ≈ 3.9 h (F2) */ size={88} color={D.text} />
            <Pill x={126} y={262} text="AT THE SPEED OF SOUND" /* #13 */ fill={pillFill(D)} color={D.text} dot={SAF} size={24} />
          </g>
        }
      />
    </Pop>
  );
};

// C-08 · the ring reaches the pin (flash), push in, zoom-through to Tick on the jetty turning to the sound.
const ShotArrive: ShotFC<CCold> = ({ f }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 600, zoom: 1.1 },
    { f: 30, x: R_PIN[0], y: R_PIN[1] - 20, zoom: 9 },
  ]);
  const t = ramp(f, 16, 44);
  return (
    <ZoomThrough
      t={t}
      focal={{ x: 960, y: 540 }}
      maxScale={5}
      from={<MapScene f={f + 240} cam={cam} arc={1} kGrow={1} ring={Math.max(0, 0.08 - f * 0.004)} flashAt={8} />}
      to={<JettyFrame f={f} zoom={2.1 + f * 0.004} turn={Math.max(0, (f - 34) / 14)} />}
    />
  );
};

// ---------------------------------------------------------------------------------------------
// C-09 · the dB gauge rises beside Tick; the vermilion fill races up and slams into a hard, UNLABELLED saffron line.
const ShotGaugeRise: ShotFC<CCold> = ({ f, len, c }) => {
  const r0 = 12;
  const hit = r0 + 44;
  const v = DB.ceiling * Math.pow(ramp(f, r0, hit), 1.15);
  const shake = f >= hit && f < hit + 16 ? Math.sin((f - hit) * 2.4) * (1 - (f - hit) / 16) * 0.015 * 1080 : 0;
  const cam = cameraAt(f, [
    { f: 0, x: 1110, y: 640, zoom: 1.55 },
    { f: len + 30, x: 1090, y: 630, zoom: 1.7 },
  ]);
  const lookUp = ramp(f, r0, hit);
  const q = c.question - c.gauge;
  return (
    <Pop f={f}>
      <Stage theme={D.theme} cam={{ ...cam, y: cam.y + shake * 0.3, x: cam.x + shake * 0.2 }} vignette={0.16} grain={0.5}>
        <World
          f={f + 600}
          hud={
            <g transform={`translate(0 ${shake.toFixed(1)})`}>
              <L13Gauge family={D} value={v} frame={f} ceiling={CEILING} labelled={false} readout={false} tremble={f > hit ? 2.5 : 0} />
            </g>
          }
        >
          <JettyTick f={f} book={false} pose="stand" poseTo="point" poseT={Math.min(1.5, Math.max(0, (f - q) / 16))} expression="thinking" expressionTo="surprised" expressionT={ramp(f, hit - 4, hit + 4)} look={0.6 + 0.4 * lookUp} headTilt={-14 * lookUp} />
        </World>
      </Stage>
    </Pop>
  );
};

// C-10 · close: the saffron line pulses across the sky; Tick drives the staff up into it three times; it does not give.
const ShotShove: ShotFC<CCold> = ({ f, len }) => {
  const LINE = 290;
  const period = Math.max(24, Math.floor((len - 10) / 3));
  const ph = (f % period) / period;
  const n = Math.floor(f / period);
  const thrust = n < 3 ? Math.pow(Math.sin(Math.min(1, ph / 0.35) * Math.PI * 0.5), 2) * (ph < 0.55 ? 1 : 1 - (ph - 0.55) / 0.45) : 0;
  const TPPM = 300;
  const tx = 860;
  const ty = 1110 - thrust * 70;
  const handY = ty - TPPM * 1.5;
  const pulse = 6 + 8 * Math.max(0, Math.sin(ph * Math.PI)) * (thrust > 0.6 ? 1 : 0.4);
  const bulge = thrust > 0.7 ? (thrust - 0.7) * 30 : 0;
  return (
    <Pop f={f}>
      <Stage theme={D.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.02, panY: 0.01, frames: len + 60, seed: 2 }} vignette={0.18} grain={0.5}>
        <Layer depth={0.05}>
          <Sky family={D} stops={[D.sky[0], D.sky[1], D.sky[2]]} />
        </Layer>
        <Layer depth={0.2}>
          <CloudRack f={f + 300} n={4} x0={-700} x1={2700} y0={500} y1={760} size={140} speed={3} body="#F4B183" under="#B8613F" top="#FFE2B6" seed={5} />
        </Layer>
        <Layer depth={0.9}>
          <Streamers f={f} n={12} x0={-300} x1={2300} y0={360} y1={1000} len={200} width={4} speed={9} color={alpha("#FFE9C8", 0.8)} opacity={0.4} seed={3} dir={-1} />
        </Layer>
        <Layer depth={1}>
          <LightWash x={tx + 120} y={LINE} rx={900} ry={160} color={SAF} strength={0.3 + 0.2 * thrust} />
          <Emissive d={`M-200 ${LINE} L${tx + 110} ${LINE - bulge} L2200 ${LINE}`} color={SAF} core={L13_COLORS.saffronCore} width={pulse} glow={32} strength={1.1} />
          {/* the survey staff, driven up from Tick's mittens into the line */}
          <g>
            {Array.from({ length: 8 }, (_, i) => {
              const y0 = handY + 60 - ((handY + 60 - LINE + bulge) * i) / 8;
              const y1 = handY + 60 - ((handY + 60 - LINE + bulge) * (i + 1)) / 8;
              return <rect key={i} x={tx + 104} y={y1} width={16} height={y0 - y1} fill={i % 2 ? "#FFF4E6" : L13_COLORS.vermilion} />;
            })}
          </g>
          {thrust > 0.85 ? <circle cx={tx + 112} cy={LINE} r={40 + (thrust - 0.85) * 300} fill="none" stroke={L13_COLORS.saffronCore} strokeWidth={4} opacity={1 - (thrust - 0.85) * 6} /> : null}
          <Tick x={tx} y={ty} pxPerM={TPPM} frame={f} facing={1} pose="heave" expression="determined" look={0.8} headTilt={-12} squash={impact(f, n * period + Math.round(period * 0.35), 0.1, 8)} />
        </Layer>
        <Layer depth={1.3}>
          <Palm x={1780} y={1300} h={900} f={f} sway={40} period={50} lean={-0.2} silhouette="#0A2730" seed={9} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// C-11 · "We know its number": the readout plate's digits spin like a slot machine and stop BLANK; Tick taps, looks at us.
const ShotSlot: ShotFC<CCold> = ({ f, len }) => {
  const stop = Math.round(len * 0.72);
  const S = 2.3;
  const plate = { x: 1546, y: 200 }; // the L13Gauge readout plate at value 194 (default geometry)
  const tap = Math.max(0, (f - 18) / 14);
  return (
    <Pop f={f}>
      <Stage theme={D.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0.03, panY: 0.01, frames: len + 60, seed: 3 }} vignette={0.2} grain={0.5}>
        <Layer depth={0.05}>
          <Sky family={D} />
        </Layer>
        <Layer depth={0.25}>
          <CloudRack f={f + 500} n={5} x0={-700} x1={2700} y0={600} y1={900} size={130} speed={2.6} body="#F4B183" under="#B8613F" top="#FFE2B6" seed={11} />
        </Layer>
        <Layer depth={1}>
          <g transform={`translate(1180 430) scale(${S}) translate(${-plate.x} ${-plate.y})`}>
            <L13Gauge family={D} value={DB.ceiling /* the fill sits at the line; its number is not shown (F1) */} frame={f + 37} ceiling={CEILING} labelled={false} spin={f < stop ? 1 : 0} readout={f < stop ? undefined : " "} />
          </g>
          {f >= stop ? <rect x={1180 - 150} y={430 - 66} width={300} height={132} fill="#FFF4E6" opacity={flash(f, stop, 8, 0.5)} /> : null}
          <GroundShadow x={620} y={1010} rx={150} color={D.shadow} opacity={0.3} blur={8} />
          <Tick x={600} y={1010} pxPerM={290} frame={f} facing={1} pose="stand" poseTo="point" poseT={Math.min(1.6, tap)} expression="thinking" look={f > stop + 6 ? -0.6 : 0.7} headTilt={f > stop + 6 ? 6 : -6} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// C-12 · "Past it": the fill punches through the line and its top buckles into a jagged front that rips up off the frame.
const ShotPastIt: ShotFC<CCold> = ({ f, len }) => {
  const push = ramp(f, 4, 18);
  const v = DB.ceiling + 6 * push; // pinned at the ruler top, chevrons above the line
  const fy = 760 - Math.max(0, f - 14) * 21; // the front's height on screen: ~21 px/f upward
  const cam = cameraAt(f, [
    { f: 0, x: 980, y: 560, zoom: 1.15 },
    { f: len, x: 980, y: 528, zoom: 1.18 },
  ]);
  const bend = smooth(ramp(f, 14, 34)) * (0.75 + 0.25 * Math.sin(f / 3));
  return (
    <Pop f={f}>
      <Stage theme={D.theme} cam={cam} vignette={0.16} grain={0.5}>
        <World
          f={f + 800}
          palmSway={80}
          palmPeriod={22}
          palmBend={bend}
          wind={14}
          cloudSpeed={6}
          hud={
            <g>
              {/* a horizontal front: ShockFront drawn sideways (x → up) */}
              {fy > -500 ? (
                <g transform="translate(0 1080) rotate(-90)">
                  <ShockFront f={f} x={1080 - fy} y={-40} height={2000} trail={300} jag={60} seed={4} />
                </g>
              ) : null}
              <L13Gauge family={D} value={v} frame={f} ceiling={CEILING} labelled={false} readout={false} overflow tremble={4} />
              <rect x={0} y={0} width={1920} height={1080} fill="#FFF4E6" opacity={flash(f, len - 6, 6, 0.7)} />
            </g>
          }
        >
          <JettyTick f={f} book={false} pose="stand" poseTo="shield" poseT={Math.min(1.6, Math.max(0, (f - 10) / 12))} expression="surprised" look={0.6} tilt={-4 * bend} />
        </World>
      </Stage>
    </Pop>
  );
};

// C-13 · ChapterCard 1 on the dusk field; big saffron rings expand from the lower right behind the type; the last frames
// zoom into the ring centre (ZT → the next scene).
const ShotCard1: ShotFC<CCold> = ({ f, len }) => {
  const a = smooth(ramp(f, 4, 22)) * (1 - smooth(ramp(f, len - 16, len - 6)));
  const z = 1 + Math.pow(ramp(f, len - 18, len), 2) * 5;
  const rise = (1 - smooth(ramp(f, 4, 22))) * 24;
  return (
    <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "86% 88%" }}>
      <Stage theme={D.theme} drift={false} vignette={0.3} grain={0.4}>
        <Sky family={D} />
        <Bloom x={1660} y={950} r={520} color={D.light} strength={0.5 + 0.1 * Math.sin(f / 10)} />
        <Rings f={f} cx={1660} cy={950} period={40} speed={14} maxR={1900} width={7} start={-90} />
        <Motes frame={f} n={40} w={1920} h={1080} color={D.light} seed={37} size={3.2} drift={30} />
        <g opacity={a} transform={`translate(0 ${rise.toFixed(1)})`}>
          <Kicker x={160} y={360} text="OFF THE SCALE · SOUND" color={D.dim} size={26} />
          {["How Loud Can", "a Sound Get?"].map((l, i) => (
            <text key={i} x={160} y={500 + i * 112} style={{ fontFamily: IF2.display, fontWeight: 800, fontSize: 114, letterSpacing: -3.4, fill: D.text }}>
              {l}
            </text>
          ))}
          <rect x={160} y={660} width={60} height={6} rx={3} fill={D.accent} />
        </g>
      </Stage>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------

export const SceneCold: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesCold(t);
  const shots: ShotDef<CCold>[] = [
    { from: 0, S: ShotMorning, id: "C-01" },
    { from: c.reports, S: ShotHeavyGuns, id: "C-03" },
    { from: c.lapse, S: ShotTimeLapse, id: "C-04" },
    { from: c.noGuns, S: ShotMapOut, id: "C-05" },
    { from: c.crawl, S: ShotCrawl, id: "C-07" },
    { from: c.zt, S: ShotArrive, id: "C-08" },
    { from: c.gauge, S: ShotGaugeRise, id: "C-09" },
    { from: c.shove, S: ShotShove, id: "C-10" },
    { from: c.number, S: ShotSlot, id: "C-11" },
    { from: c.past, S: ShotPastIt, id: "C-12" },
    { from: c.card, S: ShotCard1, id: "C-13" },
  ];
  return playShots(f, shots, c, t.frames);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundCold = (t: SceneTiming): Cue[] => {
  const c = cuesCold(t);
  const lapseLen = c.noGuns - c.lapse;
  const shoveLen = c.number - c.shove;
  const shovePeriod = Math.max(24, Math.floor((shoveLen - 10) / 3));
  const a0 = c.arc;
  return [
    // C-01 / C-02: wind bed, a soft swirl on the descent, page clicks
    { at: 0, file: SFX.wind, vol: 0.16, dur: c.reports + 20, fadeIn: 30, fadeOut: 30 },
    { at: c.write - 8, file: SFX.swirl, vol: 0.12, dur: 50 },
    ...[30, 60, 90].map((o) => ({ at: c.write + o, file: SFX.click, vol: 0.08, dur: 10 })),
    // C-03: the far boom on "heavy guns"
    ...cutHit(c.reports, 0.16),
    { at: c.guns, file: SFX.uBoom, vol: 0.15, dur: 120, fadeOut: 40 },
    // C-04: three faint booms, a click per tally
    ...cutHit(c.lapse, 0.16),
    ...[0.16, 0.48, 0.8].flatMap((q) => [
      { at: c.lapse + Math.round(q * lapseLen), file: SFX.uBoom, vol: 0.1, dur: 90, fadeOut: 30 },
      { at: c.lapse + Math.round(q * lapseLen) + 8, file: SFX.click, vol: 0.1, dur: 10 },
    ]),
    // C-05 / C-06: the pull-out, a click per 1,000 km, a pop on the Krakatoa pin
    { at: c.noGuns - 4, file: SFX.deepWhoosh, vol: 0.26, dur: 60 },
    ...[1, 2, 3, 4].map((k) => ({ at: a0 + Math.round((84 * k) / 4.8), file: SFX.click, vol: 0.12, dur: 10 })),
    { at: a0 + 84, file: SFX.pop, vol: 0.22, dur: 20 },
    // C-07 / C-08
    ...cutHit(c.crawl, 0.16),
    { at: c.crawl, file: SFX.riser, vol: 0.1, dur: c.zt - c.crawl + 10, fadeIn: 20, fadeOut: 10 },
    { at: c.zt + 8, file: SFX.pop, vol: 0.2, dur: 20 },
    { at: c.zt + 14, file: SFX.swirl, vol: 0.2, dur: 50 },
    // C-09: riser → boom on the hit
    { at: c.gauge + 8, file: SFX.riser, vol: 0.18, dur: 50, fadeOut: 6 },
    { at: c.gauge + 56, file: SFX.boom, vol: 0.32, dur: 120, fadeOut: 40 },
    // C-10: a long pop on each shove
    ...cutHit(c.shove),
    ...[0, 1, 2].map((k) => ({ at: c.shove + k * shovePeriod + Math.round(shovePeriod * 0.35), file: SFX.popLong, vol: 0.2, dur: 30 })),
    // C-11: the slot-machine click run
    ...cutHit(c.number),
    ...Array.from({ length: 8 }, (_, i) => ({ at: c.number + 4 + i * 7, file: SFX.click, vol: 0.08, dur: 8 })),
    // C-12: whoosh + boom as the front rips up
    ...cutHit(c.past),
    { at: c.past + 12, file: SFX.whoosh, vol: 0.28, dur: 50 },
    { at: c.past + 16, file: SFX.uBoom, vol: 0.34, dur: 120, fadeOut: 40 },
    // C-13: the card's boom
    { at: c.card, file: SFX.boom, vol: 0.3, dur: 150, fadeOut: 50 },
  ];
};
