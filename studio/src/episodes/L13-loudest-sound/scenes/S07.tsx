// L13 scene l07 "The twin" (storyboard §3 "7 · The twin": shots 7-01…7-18; script lines 50-57 = scene lines 0-7;
// families noon South Pacific → VAPOUR orbit → STUDIO_SET team → void globe → noon winter Alaska → dusk winter dawn
// Chelyabinsk → void globe → STUDIO_SET; Act III). Package III builder.
// Every number drawn carries its sources.md row in a comment. F14: rings on maps and globes are schematic. F18: the
// satellites carry names only (no flags, no agency marks). F19: the 7-16 bar chart has no values. F3: the 7-09 balance
// carries no number on either pan.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  Bloom,
  Caustics,
  CloudRack,
  CycClouds,
  Emissive,
  Family,
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
  Ripples,
  STUDIO_SET,
  Sky,
  Stage,
  Stars,
  Streamers,
  Sway,
  Tick,
  ZoomThrough,
  alpha,
  cameraAt,
  cutPop,
  lane,
  mixHex,
  rnd,
  seaSurface,
} from "../../../lib/illustrated";
import type { CamKey } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { L13_COLORS, familyOf, pillFill } from "../families";
import { DB, L13Gauge } from "../L13Gauge";
import { ListeningTick, Satellite, SurveyMap, mapPoint } from "../props";
import { GlobeL13, GlobeRing, Rings, Strip, globePoint } from "../sound";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";

const NOON = familyOf("noon");
const VAP = familyOf("vapour");
const VOID = familyOf("void");
const DUSK = familyOf("dusk");
const PETROL = familyOf("petrol");
const S = STUDIO_SET;
/** STUDIO_SET for the gauge: a dark petrol plate with light type on the teal cyc (the gauge has no light/dark option). */
const GS: Family = { ...S, text: "#FFF4DE", theme: { ...S.theme, bg: "#1E4A5C", panel: "#2C6A74", line: "#FFF4DE", text: "#FFF4DE", dim: "#D9F1E7", dark: true } };
const SAF = L13_COLORS.saffron;
const TEAL = L13_COLORS.teal;
const BONE = L13_COLORS.bone;
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
/** Hunga (Tonga) and Chelyabinsk as globe sources: positions only, no number from here goes on screen. */
const HUNGA = { lon: -175.38, lat: -20.55 }; // #15 #16
const CHELY = { lon: 61.4, lat: 55.15 }; // #17
const toR = (d: number) => (d * Math.PI) / 180;
/** angular distance (radians) between two lon/lat points */
const angDist = (a: { lon: number; lat: number }, b: { lon: number; lat: number }) => {
  const s = Math.sin(toR(a.lat)) * Math.sin(toR(b.lat)) + Math.cos(toR(a.lat)) * Math.cos(toR(b.lat)) * Math.cos(toR(a.lon - b.lon));
  return Math.acos(Math.max(-1, Math.min(1, s)));
};

/** A tag that keeps its text's case (m/s, dB, km). */
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

export const cuesL07 = (t: SceneTiming) => {
  const { at, p, end } = cueKit(t);
  return {
    plume: 0, // 7-01 the plume punches up
    umbrella: p(0, "and its plume climbed"), // 7-02 the umbrella spreads; 58 km
    watch: p(0, "But watch the air"), // 7-03 Tick points sideways; ZT up into orbit
    orbit: at(1), // 7-04 the VAPOUR orbit view
    flicker: p(1, "the pressure wave"), // 7-05 the flicker band crosses the Pacific
    team: at(2), // 7-06 76 scientists
    split: p(2, "The wave circled"), // 7-07 four one way, three the other
    same: p(2, "Exactly the count"), // 7-08 1883 and 2022 lock
    par: at(3), // 7-09 the balance
    arc: at(4), // 7-10 the map arc to Alaska
    alaska: p(4, "people heard it"), // 7-11 winter Alaska, three booms
    rock: at(5), // 7-12 Chelyabinsk streak
    stations: p(5, "Twenty listening"), // 7-13 twenty stations light up
    station: p(5, "picked up the low rumble"), // 7-14 one station's screen
    twice: at(6), // 7-15 twice round
    biggest: p(6, "The biggest event"), // 7-16 the bar chart
    air: at(7), // 7-17 the gauge alone, "AIR"
    dip: p(7, "Change the medium"), // 7-18 Tick dips the staff; ZT into the water
    last: end(7),
    end: t.frames,
  };
};
export type CL07 = ReturnType<typeof cuesL07>;

// ---- the South Pacific (7-01 to 7-03) -------------------------------------------------------------------------
const SEA_Y = 800;
const Pacific: React.FC<{ f: number; seed?: number }> = ({ f, seed = 3 }) => (
  <>
    <Layer depth={0.05}>
      <Sky family={NOON} />
      <Bloom x={320} y={180} r={700} color="#FFF4C8" strength={0.35} spread={0.5} />
    </Layer>
    <Layer depth={0.3}>
      <CloudRack f={f} n={5} x0={-700} x1={2700} y0={150} y1={460} size={120} speed={2.4} body="#FFFFFF" under="#CFE6EE" seed={seed} />
    </Layer>
    <Layer depth={0.8}>
      <path d={seaSurface(f, -800, 2800, SEA_Y, 9, 260, 2.4, 1700)} fill="#2E9BC2" />
      <path d={seaSurface(f + 40, -800, 2800, SEA_Y + 70, 12, 320, 3.2, 1700)} fill="#1F7FA6" />
      <path d={seaSurface(f + 90, -800, 2800, SEA_Y + 170, 16, 400, 4.2, 1700)} fill="#17698E" />
    </Layer>
  </>
);
const PLUME = { fill: "#8E7468", shade: "#4E3A3E", lit: "#F4D9B4" };

// 7-01 · a calm sea; the plume punches up through the sky bands (0 → 700 px), the camera tilts up with it
const ShotPlume: ShotFC<CL07> = ({ f, len }) => {
  const g = sm(f, 2, Math.min(len, 150));
  return (
    <Stage theme={NOON.theme} cam={cam(f, [{ f: 0, x: 960, y: 620, zoom: 1.04 }, { f: len, x: 960, y: 430, zoom: 1.0 }])} vignette={0.14} grain={0.5}>
      <Pacific f={f} />
      <Layer depth={0.9}>
        <Rings f={f} cx={1000} cy={SEA_Y + 4} period={22} speed={9} maxR={1500} width={6} squash={0.14} color={BONE} core="#FFFFFF" start={2} />
        <Plume x={1000} y={SEA_Y + 10} h={720} r0={70} fill={PLUME.fill} shade={PLUME.shade} lit={PLUME.lit} light={225} seed={7} frame={f} t={g} lean={0.05} />
        <Flock frame={f} x={1300 + f * 6} y={420 - f * 1.5} vx={6} n={7} size={16} color="#2E3A40" seed={4} />
      </Layer>
      <Layer depth={0}>
        <Kicker x={120} y={130} text="— 15 JAN 2022 · HUNGA, TONGA" /* #16 · F11 */ color="#13343E" size={28} />
      </Layer>
    </Stage>
  );
};

// 7-02 · the top spreads into an umbrella (6 px/f); a height tick climbs to 58 km; Tick a dot on a beach in a bracket
const ShotUmbrella: ShotFC<CL07> = ({ f, len }) => {
  const k = sm(f, 0, Math.max(30, len - 20));
  const capW = lerp(260, 1500, k);
  const top = 250;
  const tickY = lerp(SEA_Y, top, k);
  return (
    <Stage theme={NOON.theme} cam={cam(f, [{ f: 0, x: 960, y: 520, zoom: 1.0 }, { f: len, x: 960, y: 500, zoom: 0.96 }])} vignette={0.14} grain={0.5}>
      <Pacific f={f + 200} seed={5} />
      <Layer depth={0.9}>
        <Plume x={1000} y={SEA_Y + 10} h={SEA_Y - top} r0={80} fill={PLUME.fill} shade={PLUME.shade} lit={PLUME.lit} light={225} seed={7} frame={f + 160} t={1} lean={0.04} />
        {/* the umbrella cap: three flat lobed layers spreading */}
        {[0, 1, 2].map((i) => (
          <ellipse key={i} cx={1000 + (i - 1) * capW * 0.08} cy={top + 10 + i * 34} rx={capW / 2 - i * 60} ry={70 - i * 12} fill={i === 0 ? PLUME.lit : i === 1 ? PLUME.fill : PLUME.shade} opacity={0.95} />
        ))}
        <CloudRack f={f} n={4} x0={-700} x1={2700} y0={560} y1={700} size={110} speed={3} body="#FFFFFF" under="#CFE6EE" seed={9} dir={-1} />
        {/* the island beach and Tick, a dot, with a zoom bracket */}
        <path d={`M1480 ${SEA_Y + 6} Q1600 ${SEA_Y - 26} 1720 ${SEA_Y + 6} Z`} fill={L13_COLORS.land} />
        <Tick x={1600} y={SEA_Y - 8} pxPerM={14} frame={f} facing={-1} pose="stand" />
        <rect x={1560} y={SEA_Y - 60} width={80} height={70} fill="none" stroke="#13343E" strokeWidth={3} strokeDasharray="8 6" />
        <path d={`M1640 ${SEA_Y - 60} L1760 ${SEA_Y - 200}`} stroke="#13343E" strokeWidth={2} strokeDasharray="6 6" />
      </Layer>
      <Layer depth={0}>
        {/* the height ruler at left: the tick climbs from the sea to the cap */}
        <line x1={260} y1={SEA_Y} x2={260} y2={top} stroke={alpha("#13343E", 0.5)} strokeWidth={4} />
        {Array.from({ length: 7 }, (_, i) => (
          <line key={i} x1={244} y1={SEA_Y - i * ((SEA_Y - top) / 6)} x2={276} y2={SEA_Y - i * ((SEA_Y - top) / 6)} stroke="#13343E" strokeWidth={3} />
        ))}
        <path d={`M232 ${tickY} L288 ${tickY - 18} L288 ${tickY + 18} Z`} fill={L13_COLORS.vermilion} transform={`translate(-60 0)`} />
        <line x1={260} y1={tickY} x2={1000 - capW * 0.3} y2={tickY} stroke={alpha("#13343E", 0.35)} strokeWidth={2} strokeDasharray="8 8" />
        <g opacity={sm(f, len - 34, len - 20)}>
          <Metric x={300} y={top - 40} value="58" unit="km" /* #16 */ size={96} color="#13343E" />
        </g>
      </Layer>
    </Stage>
  );
};

// 7-03 · Tick large on the beach lowers its gaze from the plume and points sideways; a ring slides in at the frame edge;
// the last 22 frames ZoomThrough up into orbit (7-04)
const WatchBody: React.FC<{ f: number; len: number }> = ({ f, len }) => {
  const turn = sm(f, 6, 30);
  return (
    <Stage theme={NOON.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 940, y: 520, zoom: 1.05 }])} vignette={0.14} grain={0.5}>
      <Pacific f={f + 400} seed={11} />
      <Layer depth={0.85}>
        <Rings f={f} cx={2600} cy={500} period={26} speed={14} maxR={2600} width={10} color={BONE} core="#FFFFFF" start={-40} />
        <Streamers f={f} n={16} x0={-200} x1={2200} y0={200} y1={760} len={130} width={4} speed={11} color="#FFFFFF" opacity={0.5} seed={3} dir={-1} />
      </Layer>
      <Layer depth={1}>
        <path d={`M-300 ${SEA_Y + 120} Q 700 ${SEA_Y + 60} 1500 ${SEA_Y + 110} T 2400 ${SEA_Y + 100} V 1400 H -300 Z`} fill="#F2CE86" />
        <GroundShadow x={760} y={1000} rx={170} ry={18} />
        <Tick x={760} y={1000} pxPerM={430} frame={f} facing={1} pose="think" poseTo="point" poseT={turn * 1.15} expression="neutral" expressionTo="determined" expressionT={turn} look={lerp(-0.3, 0.9, turn)} headTilt={lerp(-14, 4, turn)} />
      </Layer>
    </Stage>
  );
};

// ---- the VAPOUR orbit view (7-04, 7-05) -----------------------------------------------------------------------
const Vapour: React.FC<{ f: number; seed?: number }> = ({ f, seed = 1 }) => (
  <>
    <Layer depth={0.05}>
      <Sky family={VAP} />
      <Stars frame={f} n={70} w={1920} h={260} color={VAP.text} seed={seed} size={1.6} twinkle={0.7} />
      <rect x={-600} y={240} width={3200} height={1400} fill={VAP.sky[1]} />
      <Bloom x={960} y={240} r={1200} color={TEAL} strength={0.3} spread={0.4} squash={0.25} />
    </Layer>
    <Layer depth={0.5}>
      <CloudRack f={f} n={7} x0={-700} x1={2700} y0={330} y1={1000} size={170} speed={2} body={alpha(TEAL, 0.42)} under={alpha("#0B4249", 0.5)} top={alpha(BONE, 0.32)} seed={seed + 3} flat={0.55} />
    </Layer>
    <Layer depth={0.7}>
      <CloudRack f={f} n={6} x0={-700} x1={2700} y0={420} y1={1060} size={130} speed={2.8} body={alpha(BONE, 0.34)} under={alpha(TEAL, 0.3)} seed={seed + 7} flat={0.5} dir={-1} />
    </Layer>
  </>
);

const OrbitBody: React.FC<{ f: number; len: number }> = ({ f, len }) => (
  <Stage theme={VAP.theme} cam={cam(f, [{ f: 0, x: 960, y: 470, zoom: 1.08 }, { f: len, x: 960, y: 560, zoom: 1.0 }])} vignette={0.22} grain={0.5}>
    <Vapour f={f} />
    <Layer depth={0.9}>
      <Rings f={f} cx={900} cy={700} period={40} speed={7} maxR={1700} width={9} squash={0.5} color={BONE} core="#FFFFFF" start={-30} />
      <circle cx={900} cy={700} r={12} fill={SAF} stroke="#5A3A08" strokeWidth={3} />
    </Layer>
    <Layer depth={0.3}>
      <Satellite x={260 + f * 4.5} y={170 + f * 0.4} s={70} family={VAP} f={f} rot={-6} />
      <Satellite x={1720 - f * 4} y={150 + f * 0.3} s={62} family={VAP} f={f + 50} rot={8} />
    </Layer>
    <Layer depth={0}>
      <Pill x={120} y={130} text="GOES-17" /* #16 · F18 */ fill={pillFill(VAP)} color={VAP.text} dot={TEAL} size={24} />
      <Pill x={1800} y={130} text="HIMAWARI-8" /* #16 · F18 */ fill={pillFill(VAP)} color={VAP.text} dot={TEAL} size={24} align="end" />
    </Layer>
  </Stage>
);

const ShotWatch: ShotFC<CL07> = ({ f, len }) => {
  const zt = clamp01((f - (len - 22)) / 22);
  const body = <WatchBody f={f} len={len} />;
  if (zt <= 0) return body;
  return <ZoomThrough t={zt} focal={{ x: 1200, y: 200 }} from={body} to={<OrbitBody f={f - len} len={60} />} />;
};

// 7-04 · the orbit view: two satellites glide; a ring spreads out from Tonga through the vapour
const ShotOrbit: ShotFC<CL07> = ({ f, len }) => <OrbitBody f={f} len={len} />;

// 7-05 · the ring as a bright flicker band crossing the whole Pacific
const ShotFlicker: ShotFC<CL07> = ({ f, len }) => {
  const r = 80 + f * 10;
  const fl = 0.6 + 0.4 * Math.sin(f / 1.7) * Math.sin(f / 3.1);
  const cx = 300;
  const cy = 900;
  return (
    <Stage theme={VAP.theme} cam={cam(f, [{ f: 0, x: 960, y: 560, zoom: 1.02 }, { f: len, x: 1000, y: 560, zoom: 1.0 }])} vignette={0.22} grain={0.5}>
      <Vapour f={f + 300} seed={5} />
      <Layer depth={0.9}>
        <g>
          <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.62} fill="none" stroke={alpha(BONE, 0.22 * fl)} strokeWidth={90} />
          <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.62} fill="none" stroke={BONE} strokeWidth={10} strokeDasharray="34 18" strokeDashoffset={-f * 6} opacity={0.6 + 0.4 * fl} />
          <ellipse cx={cx} cy={cy} rx={Math.max(10, r - 60)} ry={Math.max(6, (r - 60) * 0.62)} fill="none" stroke={alpha(TEAL, 0.7)} strokeWidth={6} />
        </g>
        <circle cx={cx} cy={cy} r={12} fill={SAF} stroke="#5A3A08" strokeWidth={3} />
      </Layer>
      <Layer depth={0}>
        <Pill x={120} y={130} text="A FLICKER IN THE WATER VAPOUR" /* #16 */ fill={pillFill(VAP)} color={VAP.text} dot={BONE} size={24} />
        <Pill x={120} y={190} text="ROUND THE EARTH FOR DAYS" /* #16 */ fill={pillFill(VAP)} color={VAP.text} dot={SAF} size={20} />
      </Layer>
    </Stage>
  );
};

// ---- STUDIO_SET team (7-06) ----------------------------------------------------------------------------------
const PENNANT = ["#E0A93A", "#2FBFA8", "#C8452A", "#4E6E8A", "#7DB95E", "#F2CE86", "#8C5BB0", "#1F8F8A", "#E8905A", "#3E7CB1", "#D9944A", "#5FA36A", "#B04A6A", "#FFCF73", "#2E9BC2", "#A85E2C", "#6FC3B2"];
const ShotTeam: ShotFC<CL07> = ({ f, len }) => {
  const rows = [560, 680, 800, 920];
  return (
    <Stage theme={S.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 980, y: 560, zoom: 1.04 }])} vignette={0.14} grain={0.5}>
      <Layer depth={0.05}>
        <Sky family={S} />
      </Layer>
      <Layer depth={0.2}>
        <CycClouds f={f} y={60} n={4} seed={17} />
      </Layer>
      <Layer depth={0.6}>
        {/* seventeen pennants on a line (no national flags) */}
        <path d="M60 380 Q 960 440 1860 380" stroke="#13343E" strokeWidth={3} fill="none" />
        {PENNANT.map((c, i) => {
          const x = 110 + i * 100;
          const y = 380 + Math.sin((i / 16) * Math.PI) * 52;
          return (
            <Sway key={i} frame={f} x={x} y={y} amp={8} period={44} seed={i}>
              <path d={`M${x - 30} ${y} L${x + 30} ${y} L${x} ${y + 76} Z`} fill={c} stroke={mixHex(c, "#000", 0.3)} strokeWidth={2} />
            </Sway>
          );
        })}
      </Layer>
      <Layer depth={1}>
        <rect x={-400} y={940} width={2800} height={500} fill={mixHex(S.mid, S.near, 0.5)} />
        {rows.map((y, r) => (
          <g key={r}>
            {Array.from({ length: 19 }, (_, i) => (
              <Tick key={i} x={150 + i * 92 + (r % 2) * 40} y={y} pxPerM={64} frame={f + i * 7} facing={i % 2 ? -1 : 1} pose={(i + r) % 3 === 0 ? "hold" : "stand"} color="#5E7D8A" seed={r * 19 + i} />
            ))}
            {/* strips passed hand to hand along the row (6-9 px/f) */}
            {lane(f, 4, 80, 1900, 7, r + 3, r % 2 ? -1 : 1).map((p) => (
              <rect key={p.i} x={p.x - 34} y={y - 120 - Math.abs(Math.sin(p.x / 46)) * 22} width={68} height={22} rx={4} fill="#FFF4DE" stroke="#C9A97A" strokeWidth={2} />
            ))}
          </g>
        ))}
      </Layer>
      <Layer depth={0}>
        <Metric x={120} y={200} value="76" unit="scientists" /* #15 */ size={100} color={S.text} />
        <Pill x={120} y={258} text="17 COUNTRIES" /* #15 */ fill={pillFill(S)} color="#FFF4DE" dot={SAF} size={22} />
      </Layer>
    </Stage>
  );
};

// ---- the void globe (7-07, 7-13, 7-15) -----------------------------------------------------------------------
const Space: React.FC<{ f: number; seed?: number }> = ({ f, seed = 3 }) => (
  <Layer depth={0.05}>
    <Sky family={VOID} />
    <Bloom x={300} y={260} r={1000} color={L13_COLORS.gold} strength={0.3} spread={0.45} />
    <Bloom x={1700} y={900} r={700} color={TEAL} strength={0.22} spread={0.45} />
    <Stars frame={f} n={110} w={1920} h={1080} color={VOID.text} seed={seed} size={2.2} twinkle={0.7} />
  </Layer>
);

// 7-07 · four rings one way (saffron), three the other (bone), from Tonga
const ShotSplit: ShotFC<CL07> = ({ f, len }) => {
  const g = { cx: 960, cy: 570, R: 400, rot: HUNGA.lon + 60 + f * 0.4, tilt: 4 };
  const born = Array.from({ length: 7 }, (_, k) => 2 + k * 12);
  const out = [0, 2, 4, 6];
  return (
    <Stage theme={VOID.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.06 }, { f: len, x: 960, y: 540, zoom: 1.0 }])} vignette={0.2} grain={0.5}>
      <Space f={f} seed={5} />
      <Layer depth={1}>
        <GlobeL13 {...g} family={VOID}>
          {born.map((b, k) => {
            if (f < b) return null;
            const isOut = out.includes(k);
            const run = ((f - b) * 0.03) % (Math.PI - 0.1);
            const d = isOut ? 0.05 + run : Math.PI - 0.05 - run;
            return <GlobeRing key={k} globe={g} src={HUNGA} d={d} color={isOut ? SAF : BONE} width={8} />;
          })}
        </GlobeL13>
      </Layer>
      <Layer depth={0}>
        <Pill x={120} y={130} text="4 ONE WAY" /* #15 */ fill={pillFill(VOID)} color={VOID.text} dot={SAF} size={26} />
        <Pill x={1800} y={130} text="3 THE OTHER" /* #15 */ fill={pillFill(VOID)} color={VOID.text} dot={BONE} size={26} align="end" />
      </Layer>
    </Stage>
  );
};

// 7-08 · the 1883 and 2022 plates slide together (15 px/f) and lock: the same count; a ring pulses from the joint
const CountPlate: React.FC<{ x: number; y: number; year: string; color: string }> = ({ x, y, year, color }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-250} y={-150} width={500} height={300} rx={26} fill={alpha(VOID.sky[1], 0.92)} stroke={color} strokeWidth={6} />
    <text x={0} y={-74} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 34, letterSpacing: 6, fill: color }}>
      {year}
    </text>
    <text x={0} y={70} textAnchor="middle" style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 120, fill: VOID.text }}>
      4 · 3
    </text>
  </g>
);
const ShotSame: ShotFC<CL07> = ({ f, len }) => {
  const lock = 34;
  const k = sm(f, 0, lock);
  const xa = lerp(-300, 690, k);
  const xb = lerp(2220, 1230, k);
  const hit = f >= lock;
  return (
    <Stage theme={VOID.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 960, y: 540, zoom: 1.05 }])} vignette={0.2} grain={0.5}>
      <Space f={f + 200} seed={7} />
      <Layer depth={0.9}>
        {hit ? <Rings f={f} cx={960} cy={560} period={20} speed={12} maxR={1300} width={7} color={SAF} start={lock} /> : null}
        <Streamers f={f} n={14} x0={-200} x1={2200} y0={300} y1={820} len={140} width={4} speed={hit ? 3 : 15} color={VOID.text} opacity={0.3} seed={4} />
      </Layer>
      <Layer depth={1}>
        <CountPlate x={xa} y={560} year="1883" /* #6 */ color={SAF} />
        <CountPlate x={xb} y={560} year="2022" /* #15 */ color={TEAL} />
        {hit ? <path d="M935 400 L985 400 L985 720 L935 720" fill="none" stroke={BONE} strokeWidth={6} opacity={sm(f, lock, lock + 6)} /> : null}
      </Layer>
      <Layer depth={0}>
        <g opacity={sm(f, lock + 4, lock + 14)}>
          <Pill x={960} y={880} text="THE SAME COUNT" /* #15 #6 */ fill={pillFill(VOID)} color={VOID.text} dot={SAF} size={26} align="middle" />
        </g>
      </Layer>
    </Stage>
  );
};

// 7-09 · a balance: a Krakatau plume icon on one pan, a Hunga plume on the other, rocking to level (no numbers, F3)
const MiniPlume: React.FC<{ x: number; y: number; color: string; f: number; seed: number }> = ({ x, y, color, f, seed }) => (
  <Plume x={x} y={y} h={170} r0={22} fill={color} shade={mixHex(color, "#000", 0.35)} lit={mixHex(color, "#FFFFFF", 0.45)} light={225} seed={seed} frame={f} t={1} lean={0.04} />
);
const ShotBalance: ShotFC<CL07> = ({ f, len }) => {
  const ang = 14 * Math.exp(-f / 70) * Math.cos(f / 6.5) + 1.5 * Math.sin(f / 11);
  const a = (ang * Math.PI) / 180;
  const px = 960;
  const py = 430;
  const arm = 420;
  const L = { x: px - Math.cos(a) * arm, y: py - Math.sin(a) * arm };
  const R = { x: px + Math.cos(a) * arm, y: py + Math.sin(a) * arm };
  const pan = (p: { x: number; y: number }, c: string, label: string, seed: number) => (
    <g>
      <line x1={p.x} y1={p.y} x2={p.x - 110} y2={p.y + 220} stroke={BONE} strokeWidth={3} />
      <line x1={p.x} y1={p.y} x2={p.x + 110} y2={p.y + 220} stroke={BONE} strokeWidth={3} />
      <path d={`M${p.x - 150} ${p.y + 220} Q ${p.x} ${p.y + 290} ${p.x + 150} ${p.y + 220} Z`} fill={L13_COLORS.goldDeep} stroke={L13_COLORS.gold} strokeWidth={4} />
      <MiniPlume x={p.x} y={p.y + 222} color={c} f={f} seed={seed} />
      <text x={p.x} y={p.y + 340} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 26, letterSpacing: 4, fill: VOID.text }}>
        {label}
      </text>
    </g>
  );
  return (
    <Stage theme={VOID.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 960, y: 540, zoom: 1.04 }])} vignette={0.2} grain={0.5}>
      <Space f={f + 400} seed={9} />
      <Layer depth={0.8}>
        <Rings f={f} cx={960} cy={430} period={30} speed={8} maxR={1200} width={4} color={alpha(TEAL, 0.9)} opacity={0.6} start={-60} />
      </Layer>
      <Layer depth={1}>
        <path d={`M${px} ${py} L${px - 90} 960 L${px + 90} 960 Z`} fill={L13_COLORS.goldDeep} />
        <rect x={px - 200} y={950} width={400} height={26} rx={8} fill={L13_COLORS.gold} />
        <line x1={L.x} y1={L.y} x2={R.x} y2={R.y} stroke={L13_COLORS.gold} strokeWidth={18} strokeLinecap="round" />
        <circle cx={px} cy={py} r={22} fill={L13_COLORS.gold} stroke={L13_COLORS.goldDeep} strokeWidth={5} />
        {pan(L, SAF, "KRAKATAU 1883" /* #15 */, 3)}
        {pan(R, TEAL, "HUNGA 2022" /* #15 */, 5)}
      </Layer>
      <Layer depth={0}>
        <Pill x={120} y={130} text="ON PAR · MATOZA ET AL. 2022" /* #15 · F3 */ fill={pillFill(VOID)} color={VOID.text} dot={SAF} size={24} />
      </Layer>
    </Stage>
  );
};

// 7-10 · the Pacific map: a dashed arc Tonga → Alaska draws; a ring crawls along it; "~10,000 km" when it lands
const MAPBOX = { x: 160, y: 110, w: 1600, h: 860 };
const ShotArc: ShotFC<CL07> = ({ f, len }) => {
  const [tx, ty] = mapPoint("pacific", MAPBOX, "tonga");
  const [ax, ay] = mapPoint("pacific", MAPBOX, "alaska");
  const qx = (tx + ax) / 2 + 420;
  const qy = (ty + ay) / 2;
  const u = sm(f, 4, Math.max(40, len - 30));
  const at = (s: number): [number, number] => [(1 - s) * (1 - s) * tx + 2 * (1 - s) * s * qx + s * s * ax, (1 - s) * (1 - s) * ty + 2 * (1 - s) * s * qy + s * s * ay];
  const pts = Array.from({ length: 41 }, (_, i) => at((i / 40) * u));
  const [rx, ry] = at(u);
  return (
    <Stage theme={NOON.theme} cam={cam(f, [{ f: 0, x: 960, y: 560, zoom: 1.0 }, { f: len - 20, x: 1000, y: 520, zoom: 1.04 }, { f: len, x: ax, y: ay + 60, zoom: 1.5 }])} vignette={0.12} grain={0.5}>
      <Layer depth={0.05}>
        <Sky family={NOON} />
      </Layer>
      <Layer depth={1}>
        <SurveyMap view="pacific" {...MAPBOX} family={NOON} frame={f}>
          <path d={"M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L")} fill="none" stroke="#13343E" strokeWidth={5} strokeDasharray="16 12" />
          <Rings f={f} cx={rx} cy={ry} period={14} speed={5} maxR={110} width={5} color={SAF} />
          <circle cx={tx} cy={ty} r={13} fill={SAF} stroke="#5A3A08" strokeWidth={3} />
          <circle cx={ax} cy={ay} r={12} fill="#FFF4E0" stroke="#13343E" strokeWidth={4} />
        </SurveyMap>
        <CloudRack f={f} n={4} x0={-700} x1={2700} y0={140} y1={900} size={90} speed={2.6} body={alpha("#FFFFFF", 0.8)} under={alpha("#CFE6EE", 0.7)} seed={21} flat={0.6} />
      </Layer>
      <Layer depth={0}>
        <g opacity={sm(f, len - 40, len - 28)}>
          <Metric x={200} y={1000 - 90} value="~10,000" unit="km" /* #15 */ size={88} color="#13343E" />
        </g>
      </Layer>
    </Stage>
  );
};

// 7-11 · winter Alaska: a snowy shore, big flakes (4-5 px/f); three rings arrive; Tick turns at each boom
const flakes = (f: number, n: number, seed: number) =>
  Array.from({ length: n }, (_, i) => {
    const sp = 3.5 + rnd(seed + i * 3) * 2.5;
    const y = ((rnd(seed * 7 + i) * 1200 + f * sp) % 1200) - 60;
    const x = rnd(seed * 13 + i) * 2100 - 90 + Math.sin(f / 20 + i) * 18 - f * 1.2;
    return { x: ((x % 2100) + 2100) % 2100 - 90, y, r: 6 + rnd(seed * 5 + i) * 5 };
  });
const ShotAlaska: ShotFC<CL07> = ({ f, len }) => {
  const gap = Math.max(30, Math.floor((len - 10) / 3));
  const arrivals = [10, 10 + gap, 10 + gap * 2];
  const last = arrivals.filter((a) => f >= a).length;
  const since = last ? f - arrivals[last - 1] : 99;
  const perk = since < 18 ? Math.sin((since / 18) * Math.PI) : 0;
  return (
    <Stage theme={NOON.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 980, y: 540, zoom: 1.04 }])} vignette={0.14} grain={0.5}>
      <Layer depth={0.05}>
        <Sky stops={["#7FB6D8", "#B9DCEB", "#E4F2F4"]} />
      </Layer>
      <Layer depth={0.3}>
        <path d="M-400 640 L 200 360 L 520 560 L 860 300 L 1300 600 L 1660 380 L 2400 640 Z" fill="#7E9FC0" />
        <path d="M 120 400 L 200 360 L 290 420 Z M 780 350 L 860 300 L 950 360 Z M 1580 420 L 1660 380 L 1740 430 Z" fill="#FFFFFF" />
      </Layer>
      <Layer depth={0.7}>
        <path d={seaSurface(f, -800, 2800, 700, 7, 280, 2.6, 1700)} fill="#3D8FB4" />
        <Rings f={f} cx={-700} cy={720} period={gap} speed={26} maxR={2600} width={10} squash={0.35} color={SAF} core={L13_COLORS.saffronCore} start={10 - Math.round(1880 / 26)} count={3} fade={false} />
      </Layer>
      <Layer depth={1}>
        <path d="M-400 820 Q 600 770 1200 810 T 2400 800 V 1400 H -400 Z" fill="#F4FAFB" />
        <path d="M-400 860 Q 700 830 1400 850 T 2400 860" stroke="#C9E2EA" strokeWidth={8} fill="none" />
        <GroundShadow x={1180} y={1000} rx={150} ry={16} />
        <ListeningTick x={1180} y={1000} pxPerM={400} frame={f} toward={last % 2 ? -1 : 1} perk={perk} expression="surprised" look={0.6} />
      </Layer>
      <Layer depth={1.3}>
        {flakes(f, 46, 3).map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#FFFFFF" opacity={0.9} />
        ))}
      </Layer>
      <Layer depth={0}>
        <Pill x={120} y={130} text="ALASKA · HOURS LATER" /* #15 */ fill={pillFill(NOON)} color={NOON.text} dot={SAF} size={24} />
      </Layer>
    </Stage>
  );
};

// 7-12 · winter dawn over a city grid: a bright streak crosses the whole frame (40 px/f) and bursts
const ShotStreak: ShotFC<CL07> = ({ f, len }) => {
  const burstAt = 34;
  const hx = -200 + f * 40;
  const hy = 120 + f * 9;
  const burst = f >= burstAt ? f - burstAt : -1;
  const bx = -200 + burstAt * 40;
  const by = 120 + burstAt * 9;
  const flash = burst >= 0 ? Math.exp(-burst / 14) : 0;
  return (
    <Stage theme={DUSK.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 960, y: 540, zoom: 1.04 }])} vignette={0.2} grain={0.5}>
      <Layer depth={0.05}>
        <Sky family={DUSK} />
      </Layer>
      <Layer depth={0.3}>
        <CloudRack f={f} n={5} x0={-700} x1={2700} y0={260} y1={520} size={110} speed={2.4} body={alpha("#E8905A", 0.6)} under={alpha("#6A3A4A", 0.6)} top={alpha("#FFE4AE", 0.5)} seed={31} flat={0.6} />
      </Layer>
      <Layer depth={0.6}>
        {burst < 0 ? (
          <Emissive d={`M${hx - 520} ${hy - 117} L${hx} ${hy}`} color={L13_COLORS.gold} core="#FFFFFF" width={18} glow={32} />
        ) : (
          <>
            <Emissive d={`M${bx - 900 + burst * 20} ${by - 202 + burst * 4.5} L${bx} ${by}`} color={alpha(L13_COLORS.gold, 0.6)} core="#FFF6E0" width={10} glow={16} opacity={Math.max(0, 1 - burst / 40)} />
            <Bloom x={bx} y={by} r={200 + burst * 18} color={L13_COLORS.gold} core={40} coreColor="#FFFFFF" strength={0.3 + flash * 0.6} />
            <Rings f={burst} cx={bx} cy={by} period={16} speed={14} maxR={1500} width={7} color={SAF} count={4} />
          </>
        )}
      </Layer>
      <Layer depth={1}>
        {/* the city grid: blocks with windows that flicker */}
        {Array.from({ length: 22 }, (_, i) => {
          const x = -100 + i * 100;
          const h = 120 + rnd(i * 7) * 200;
          return (
            <g key={i}>
              <rect x={x} y={1000 - h} width={92} height={h + 100} fill={mixHex("#3A2440", "#6A3A4A", rnd(i * 3))} />
              {Array.from({ length: 6 }, (_, w) => (
                <rect key={w} x={x + 12 + (w % 3) * 26} y={1000 - h + 20 + Math.floor(w / 3) * 40} width={14} height={18} fill="#FFCF73" opacity={rnd(i * 11 + w + Math.floor(f / 12)) > 0.4 ? 0.9 : 0.2} />
              ))}
            </g>
          );
        })}
        <LightWash x={bx} y={900} rx={1400} ry={500} color="#FFE4AE" strength={flash * 0.6} />
      </Layer>
      <Layer depth={0}>
        <Kicker x={120} y={130} text="— 2013 · CHELYABINSK" /* #17 */ color={DUSK.text} size={28} />
      </Layer>
    </Stage>
  );
};

// 7-13 · the void globe: twenty station glyphs pop as the ring reaches each
const STATIONS = Array.from({ length: 20 }, (_, i) => ({ lon: -170 + rnd(i * 17 + 3) * 340, lat: -55 + rnd(i * 29 + 5) * 120 })); // schematic spread (F14)
const ShotStations: ShotFC<CL07> = ({ f, len }) => {
  const g = { cx: 920, cy: 560, R: 410, rot: CHELY.lon - 10 + f * 0.6, tilt: 28 };
  const d = Math.min(Math.PI - 0.05, 0.04 + f * 0.024);
  return (
    <Stage theme={VOID.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 940, y: 540, zoom: 1.06 }])} vignette={0.2} grain={0.5}>
      <Space f={f + 600} seed={11} />
      <Layer depth={1}>
        <GlobeL13 {...g} family={VOID}>
          <GlobeRing globe={g} src={CHELY} d={d} color={SAF} core={L13_COLORS.saffronCore} width={9} />
          <GlobeRing globe={g} src={CHELY} d={Math.max(0.02, d - 0.15)} color={SAF} width={4} opacity={0.4} />
        </GlobeL13>
        {STATIONS.map((s, i) => {
          const p = globePoint(g, s.lon, s.lat);
          if (p.z <= 0.05) return null;
          const on = d >= angDist(CHELY, s);
          return (
            <g key={i} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`}>
              <path d="M0 -18 L15 10 L-15 10 Z" fill={on ? TEAL : alpha(VOID.text, 0.25)} stroke={on ? BONE : "none"} strokeWidth={3} />
              {on ? <circle r={30} fill="none" stroke={TEAL} strokeWidth={3} opacity={0.7} /> : null}
            </g>
          );
        })}
      </Layer>
      <Layer depth={0}>
        <Metric x={1440} y={330} value="20" unit="stations" /* #17 */ size={110} color={VOID.text} />
        <Pill x={1440} y={390} text="BUILT TO CATCH NUCLEAR TESTS" /* #17 */ fill={pillFill(VOID)} color={VOID.text} dot={TEAL} size={18} />
      </Layer>
    </Stage>
  );
};

// 7-14 · one station: a field of pipe arrays in the grass; a low hump scrolls across its screen
const ShotStation: ShotFC<CL07> = ({ f, len }) => (
  <Stage theme={NOON.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 990, y: 540, zoom: 1.05 }])} vignette={0.14} grain={0.5}>
    <Layer depth={0.05}>
      <Sky family={NOON} />
    </Layer>
    <Layer depth={0.3}>
      <CloudRack f={f} n={4} x0={-700} x1={2700} y0={120} y1={320} size={110} speed={2.6} body="#FFFFFF" under="#CFE6EE" seed={41} />
      <path d="M-400 600 Q 500 540 1200 590 T 2400 580 V 1400 H -400 Z" fill="#9CCB7A" />
    </Layer>
    <Layer depth={1}>
      <rect x={-400} y={700} width={2800} height={600} fill="#7DB95E" />
      {/* the pipe rosettes: spokes of pipe from a hub */}
      {[[340, 820], [760, 760], [540, 940]].map(([cx, cy], k) => (
        <g key={k}>
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(a) * 200} y2={cy + Math.sin(a) * 60} stroke="#E9E2CF" strokeWidth={9} strokeLinecap="round" />;
          })}
          <circle cx={cx} cy={cy} r={18} fill="#4E6E8A" />
        </g>
      ))}
      {lane(f, 22, -200, 2200, 3, 5).map((p, i) => (
        <Sway key={i} frame={f} x={p.x} y={1000 - (i % 4) * 30} amp={10} period={36} seed={i}>
          <path d={`M${p.x} ${1000 - (i % 4) * 30} q -8 -50 -2 -80 M${p.x + 14} ${1000 - (i % 4) * 30} q 6 -40 18 -64`} stroke="#4E8F3E" strokeWidth={7} fill="none" strokeLinecap="round" />
        </Sway>
      ))}
      {/* the hut and its screen */}
      <rect x={1080} y={360} width={760} height={420} rx={16} fill="#2E3A40" stroke="#8A5A34" strokeWidth={10} />
      <Strip f={f} x={1110} y={390} w={700} h={360} speed={8} spikes={[{ at: 34, h: 0.9 }, { at: 34 + 110, h: 0.5 }]} scale={150} paper="#0B3A3A" ink={TEAL} grid="#145050" wobble={3} />
      <rect x={1340} y={780} width={40} height={180} fill="#5A3420" />
    </Layer>
    <Layer depth={1.2}>
      <Motes frame={f} n={20} x={100} y={100} w={1700} h={800} color="#FFF4C8" seed={7} size={6} />
    </Layer>
  </Stage>
);

// 7-15 · the globe: two rings circle it from Chelyabinsk ("twice round")
const ShotTwice: ShotFC<CL07> = ({ f, len }) => {
  const g = { cx: 860, cy: 560, R: 400, rot: CHELY.lon + 40 + f * 1.2, tilt: 24 };
  const ring = (ph: number) => {
    const s = (f * 0.045 + ph) % (2 * Math.PI);
    return { d: s <= Math.PI ? Math.max(0.03, s) : Math.max(0.03, 2 * Math.PI - s), out: s <= Math.PI };
  };
  const a = ring(0.1);
  const b = ring(Math.PI * 0.8);
  return (
    <Stage theme={VOID.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.04 }, { f: len, x: 960, y: 540, zoom: 1.0 }])} vignette={0.2} grain={0.5}>
      <Space f={f + 900} seed={13} />
      <Layer depth={1}>
        <GlobeL13 {...g} family={VOID}>
          <GlobeRing globe={g} src={CHELY} d={a.d} color={a.out ? SAF : BONE} width={9} />
          <GlobeRing globe={g} src={CHELY} d={b.d} color={b.out ? SAF : BONE} width={9} />
        </GlobeL13>
      </Layer>
      <Layer depth={0}>
        <Metric x={1400} y={330} value="~3" unit="days" /* #17 */ size={120} color={VOID.text} />
        <Pill x={1400} y={392} text="TWICE ROUND" /* #17 */ fill={pillFill(VOID)} color={VOID.text} dot={SAF} size={24} />
      </Layer>
    </Stage>
  );
};

// 7-16 · a bar chart of events on that network (no values, F19): Chelyabinsk's bar grows past all the others
const BARS = [0.22, 0.35, 0.18, 0.4, 0.28, 0.3];
const ShotBars: ShotFC<CL07> = ({ f, len }) => {
  const base = 900;
  const grow = sm(f, 6, Math.min(len - 10, 70));
  return (
    <Stage theme={VOID.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 960, y: 520, zoom: 1.04 }])} vignette={0.2} grain={0.5}>
      <Space f={f + 1200} seed={15} />
      <Layer depth={1}>
        <line x1={200} y1={base} x2={1720} y2={base} stroke={VOID.text} strokeWidth={4} />
        {BARS.map((h, i) => {
          const bh = 640 * h * sm(f, 0, 14 + i * 3);
          return <rect key={i} x={240 + i * 190} y={base - bh} width={130} height={bh} rx={8} fill={mixHex(TEAL, VOID.sky[1], 0.25)} />;
        })}
        <rect x={240 + 6 * 190 + 30} y={base - 680 * grow} width={190} height={680 * grow} rx={10} fill={SAF} />
        <Emissive d={`M${240 + 6 * 190 + 30} ${base - 680 * grow} L${240 + 6 * 190 + 220} ${base - 680 * grow}`} color={SAF} core={L13_COLORS.saffronCore} width={8} glow={16} />
        <text x={240 + 6 * 190 + 125} y={base + 52} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 26, letterSpacing: 3, fill: VOID.text }}>
          CHELYABINSK
        </text>
      </Layer>
      <Layer depth={0}>
        <Pill x={120} y={130} text="BIGGEST ON THAT NETWORK" /* #17 · F19 */ fill={pillFill(VOID)} color={VOID.text} dot={SAF} size={26} />
      </Layer>
    </Stage>
  );
};

// ---- STUDIO_SET (7-17, 7-18) ----------------------------------------------------------------------------------
const Cyc: React.FC<{ f: number; seed?: number }> = ({ f, seed = 1 }) => (
  <>
    <Layer depth={0.05}>
      <Sky family={S} />
    </Layer>
    <Layer depth={0.2}>
      <CycClouds f={f} y={70} n={5} seed={seed} />
    </Layer>
    <Layer depth={1}>
      <path d="M-600 860 Q 960 830 2600 860 V 1500 H -600 Z" fill={S.mid} />
    </Layer>
  </>
);

// 7-17 · the dB gauge alone; the ceiling glows, pulses ripple off it and the AIR plate flips over
const ShotAir: ShotFC<CL07> = ({ f, len }) => {
  const flip = Math.cos(Math.min(1, Math.max(0, (f - 20) / 16)) * Math.PI * 2);
  const gy = 160;
  const gh = 640;
  const cy = gy + gh - (DB.ceiling / 200) * gh;
  return (
    <Stage theme={S.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 1040, y: 520, zoom: 1.06 }])} vignette={0.14} grain={0.5}>
      <Cyc f={f} seed={23} />
      <Layer depth={1}>
        <Rings f={f} cx={1160} cy={cy} period={18} speed={10} maxR={900} width={6} squash={0.16} color={SAF} core={L13_COLORS.saffronCore} />
        <g transform={`translate(560 ${gy + gh / 2}) scale(1 ${flip.toFixed(3)})`}>
          <rect x={-200} y={-90} width={400} height={180} rx={24} fill="#1E4A5C" stroke={SAF} strokeWidth={6} />
          <text x={0} y={36} textAnchor="middle" style={{ fontFamily: IF2.display, fontWeight: 800, fontSize: 104, fill: "#FFF4DE" }}>
            AIR
          </text>
        </g>
      </Layer>
      <Layer depth={0}>
        <L13Gauge family={GS} value={0} fill={false} readout={false} frame={f} x={1160} y={gy} height={gh} ceiling={{ v: DB.ceiling /* #11 */ }} labelled base="AIR · re 20 µPa" /* #9 */ />
      </Layer>
    </Stage>
  );
};

// 7-18 · Tick dips the staff into a drawn water surface on the floor; ripples spread wide; ZT into the water (8-01)
const DipBody: React.FC<{ f: number; len: number }> = ({ f, len }) => {
  const dip = sm(f, 4, 22);
  const touch = 20;
  return (
    <Stage theme={S.theme} cam={cam(f, [{ f: 0, x: 960, y: 560, zoom: 1.0 }, { f: len, x: 1100, y: 800, zoom: 1.12 }])} vignette={0.14} grain={0.5}>
      <Cyc f={f + 200} seed={29} />
      <Layer depth={1}>
        <ellipse cx={1100} cy={900} rx={700} ry={110} fill="#2E9BC2" stroke="#1F7FA6" strokeWidth={6} />
        <Caustics f={f} x={480} y={830} w={1240} h={140} rows={3} color="#BFF2F0" opacity={0.35} />
        {f >= touch ? <Ripples frame={f - touch} cx={1100} cy={900} rx={680} ry={100} period={14} count={5} color="#E6F5EA" width={6} strength={0.95} /> : null}
        <GroundShadow x={640} y={980} rx={150} ry={16} />
        <Tick x={640} y={980} pxPerM={360} frame={f} facing={1} pose="stand" poseTo="crouch-reach" poseT={dip * 1.1} staff expression="thinking" look={0.7} />
      </Layer>
    </Stage>
  );
};
const ShotDip: ShotFC<CL07> = ({ f, len }) => {
  const zt = clamp01((f - (len - 20)) / 20);
  const body = <DipBody f={f} len={len} />;
  if (zt <= 0) return body;
  return (
    <ZoomThrough
      t={zt}
      focal={{ x: 1100, y: 880 }}
      from={body}
      to={
        <Stage theme={PETROL.theme} drift={false} vignette={0.2} grain={0.5}>
          <Sky stops={["#1E5A6A", "#103C4A", "#08222C"]} />
          <Caustics f={f} x={0} y={0} w={1920} h={700} rows={5} color="#BFF2F0" opacity={0.3} />
          <Ripples frame={f} cx={960} cy={300} rx={1200} ry={300} period={12} count={5} color={BONE} width={5} />
        </Stage>
      }
    />
  );
};

export const SceneL07: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL07(t);
  const shots: ShotDef<CL07>[] = [
    { from: 0, S: ShotPlume, id: "7-01" },
    { from: c.umbrella, S: ShotUmbrella, id: "7-02" },
    { from: c.watch, S: ShotWatch, id: "7-03" },
    { from: c.orbit, S: ShotOrbit, id: "7-04" },
    { from: c.flicker, S: ShotFlicker, id: "7-05" },
    { from: c.team, S: ShotTeam, id: "7-06" },
    { from: c.split, S: ShotSplit, id: "7-07" },
    { from: c.same, S: ShotSame, id: "7-08" },
    { from: c.par, S: ShotBalance, id: "7-09" },
    { from: c.arc, S: ShotArc, id: "7-10" },
    { from: c.alaska, S: ShotAlaska, id: "7-11" },
    { from: c.rock, S: ShotStreak, id: "7-12" },
    { from: c.stations, S: ShotStations, id: "7-13" },
    { from: c.station, S: ShotStation, id: "7-14" },
    { from: c.twice, S: ShotTwice, id: "7-15" },
    { from: c.biggest, S: ShotBars, id: "7-16" },
    { from: c.air, S: ShotAir, id: "7-17" },
    { from: c.dip, S: ShotDip, id: "7-18" },
  ];
  return <AbsoluteFill>{playShots(f, shots, c, t.frames)}</AbsoluteFill>;
};

export const soundL07 = (t: SceneTiming): Cue[] => {
  const c = cuesL07(t);
  return [
    { at: 4, file: SFX.boom, vol: 0.22, dur: 120, fadeOut: 30 }, // boom (far)
    ...cutHit(c.umbrella),
    { at: c.umbrella + 2, file: SFX.riser, vol: 0.16, dur: 60, fadeOut: 12 },
    ...cutHit(c.watch),
    { at: c.orbit - 18, file: SFX.swirl, vol: 0.22, dur: 50 },
    { at: c.orbit, file: SFX.rumble, vol: 0.18, dur: c.flicker - c.orbit, fadeIn: 10, fadeOut: 10 },
    ...cutHit(c.flicker),
    { at: c.flicker + 4, file: SFX.pop, vol: 0.22, dur: 20 },
    ...cutHit(c.team),
    ...Array.from({ length: Math.max(0, Math.floor((c.split - c.team) / 24)) }, (_, i) => ({ at: c.team + 8 + i * 24, file: SFX.click, vol: 0.1, dur: 8 })),
    ...cutHit(c.split),
    ...Array.from({ length: 7 }, (_, k) => ({ at: c.split + 2 + k * 12, file: SFX.pop, vol: 0.18, dur: 16 })),
    ...cutHit(c.same),
    { at: c.same + 6, file: SFX.click, vol: 0.2, dur: 12 },
    { at: c.same + 34, file: SFX.chime, vol: 0.26, dur: 60 },
    ...cutHit(c.par),
    { at: c.par + 2, file: SFX.popLong, vol: 0.24, dur: 30 },
    ...cutHit(c.arc),
    ...Array.from({ length: 5 }, (_, i) => ({ at: c.arc + 8 + i * 22, file: SFX.click, vol: 0.1, dur: 8 })),
    ...cutHit(c.alaska),
    ...[0, 1, 2].map((k) => ({ at: c.alaska + 10 + k * Math.max(30, Math.floor((c.rock - c.alaska - 10) / 3)), file: SFX.uBoom, vol: 0.2, dur: 50, fadeOut: 16 })),
    ...cutHit(c.rock),
    { at: c.rock + 4, file: SFX.whoosh, vol: 0.3, dur: 34 },
    { at: c.rock + 34, file: SFX.boom, vol: 0.34, dur: 110, fadeOut: 30 },
    ...cutHit(c.stations),
    ...Array.from({ length: 10 }, (_, i) => ({ at: c.stations + 10 + i * 6, file: SFX.pop, vol: 0.12, dur: 10 })),
    ...cutHit(c.station),
    { at: c.station + 4, file: SFX.rumble, vol: 0.18, dur: c.twice - c.station, fadeIn: 10, fadeOut: 10 },
    ...cutHit(c.twice),
    { at: c.twice + 6, file: SFX.swirl, vol: 0.2, dur: 50 },
    { at: c.twice + 76, file: SFX.swirl, vol: 0.18, dur: 50 },
    ...cutHit(c.biggest),
    { at: c.biggest + 4, file: SFX.riser, vol: 0.16, dur: 60, fadeOut: 10 },
    { at: c.biggest + 70, file: SFX.pop, vol: 0.24, dur: 20 },
    ...cutHit(c.air),
    { at: c.air + 22, file: SFX.pop, vol: 0.22, dur: 20 },
    ...cutHit(c.dip),
    { at: c.dip + 20, file: SFX.swirl, vol: 0.22, dur: 50 },
  ];
};
