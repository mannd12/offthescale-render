// L14 scene l04 "The sideways problem" (storyboard §3 "4 ·": shots 4-01…4-13, script lines 30-33, noon equator → void
// cut-away → STUDIO_SET, Act II). Shot components (hard cuts; continuous rows are phases): 4-01+4-02 (the globe turns;
// the 24-h ring fills) · 4-03+4-04 (the ground carries Tick east; Tick holds the probe over the hatch) · 4-05+4-06 (the
// equator slice: the probe's long east arrow vs the rock's shrinking arrows; the two bars) · 4-07…4-09 (the drift, the
// scrape, the marker flag) · 4-10+4-11 (the pole-to-pole redraw; the probe falls straight) · 4-12+4-13 (the crossed-out
// spin arrow; the brake lever stops the textbook ball).
// Numbers drawn, each with its sources.md row: 23.9 h (#12) · 1,670 km/h (#12 #13). V1 NOT verified: 4-05…4-09 carry NO
// distance (no "few km"); the drift direction is shown only by the arrows; "EAST" appears only on the 1,670 arrow (F7);
// the pill says "ONE WELL-KNOWN ACCOUNT". F13: Tick is never inside the tunnel (the marker flag in 4-09 is fired by the
// probe; Tick watches from a rim window).
// This file also exports the package-II helpers used by S05/S06 (DeepShaft, Ruler, Bracket, dashLen).
import React from "react";
import { useCurrentFrame } from "remotion";
import {
  Bloom,
  CloudRack,
  Emissive,
  Embers,
  Family,
  Flock,
  GroundShadow,
  Kicker,
  Layer,
  Motes,
  Sky,
  Stage,
  Stars,
  Streamers,
  Tick,
  alpha,
  cameraAt,
  impact,
  mixHex,
  ramp,
} from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { L14_STRATA, Shimmer, StrataWall, Stratum } from "../tunnel";
import { CutGlobe, harmonic } from "../cutglobe";
import { HatchLid, Probe, ProbeVariant } from "../props";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { Arrow, C, CREAM, Cross, INK, NOON, Pop, STUDIO, Slab, StudioRoom, Tag, VOID, VoidField, clamp01, ez } from "./Cold";

const FLOOR = 860;

// ================================================================================================================
// package-II helpers (exported for S05 / S06)
// ================================================================================================================

/** A deep, dark shaft: family ground, the strata wall streaming (THE default mover), embers, optional shimmer, the probe
 *  with its lamp, children on top. `scroll` in px (pass f × speed or an eased curve). */
export const DeepShaft: React.FC<{
  f: number;
  F: Family;
  scroll: number;
  depth?: number;
  pxPerKm?: number;
  layers?: Stratum[];
  cx?: number;
  gap?: number;
  hatch?: "taffy" | "iron" | null;
  wobble?: number;
  ruler?: number | null;
  probe?: { x?: number; y: number; size?: number; variant?: ProbeVariant; tilt?: number; amount?: number; side?: -1 | 1 } | null;
  embers?: number;
  shimmer?: number;
  seed?: number;
  children?: React.ReactNode;
  over?: React.ReactNode;
}> = ({ f, F, scroll, depth = 600, pxPerKm = 2, layers = L14_STRATA, cx = 640, gap = 320, hatch = null, wobble = 0, ruler = null, probe = { y: 470 }, embers = 26, shimmer = 0, seed = 1, children, over }) => (
  <g>
    <rect x={-400} y={-400} width={2800} height={1900} fill={F.sky[0]} />
    <StrataWall f={f} family={F} layers={layers} depth={depth} pxPerKm={pxPerKm} scroll={scroll} cx={cx} gap={gap} x0={-700} x1={2300} hatch={hatch} wobble={wobble} ruler={ruler} lamp={probe ? { y: probe.y } : null} />
    <Bloom x={cx} y={1180} r={620} color={F.light} core={0} strength={0.35} />
    {shimmer > 0 ? <Shimmer f={f} x={cx - gap / 2} y={0} w={gap} h={1080} speed={6} opacity={0.3 * shimmer} /> : null}
    {children}
    {probe ? <Probe x={probe.x ?? cx} y={probe.y} size={probe.size ?? 150} f={f} variant={probe.variant ?? "plain"} tilt={probe.tilt ?? 0} amount={probe.amount ?? 1} side={probe.side ?? 1} /> : null}
    {over}
    {embers > 0 ? <Embers frame={f} x0={-200} x1={1500} y={1120} n={embers} color={F.light} seed={seed + 4} /> : null}
    <Motes frame={f} n={16} x={-200} y={0} w={1700} h={1080} color={alpha(F.light, 0.7)} seed={seed + 9} size={4} drift={40} />
  </g>
);

/** A horizontal ruler (ticks only, no numbers): long tick every 5; `slide` scrolls the minor ticks (px). */
export const Ruler: React.FC<{ x0: number; x1: number; y: number; color: string; step?: number; slide?: number; k?: number; w?: number }> = ({ x0, x1, y, color, step = 40, slide = 0, k = 1, w = 8 }) => {
  const xe = x0 + (x1 - x0) * clamp01(k);
  const n = Math.ceil((x1 - x0) / step) + 2;
  const off = ((slide % step) + step) % step;
  return (
    <g>
      <rect x={x0} y={y - w / 2} width={Math.max(0, xe - x0)} height={w} rx={w / 2} fill={color} />
      {Array.from({ length: n }, (_, i) => {
        const x = x0 + i * step - off;
        if (x < x0 || x > xe) return null;
        const idx = i + Math.floor(slide / step);
        const big = idx % 5 === 0;
        return <line key={i} x1={x} y1={y} x2={x} y2={y - (big ? 34 : 18)} stroke={color} strokeWidth={big ? 5 : 3} strokeLinecap="round" />;
      })}
    </g>
  );
};

/** A bracket drawing from x0 toward x1 (k 0..1) with end caps and a saffron drawing head. */
export const Bracket: React.FC<{ x0: number; x1: number; y: number; k: number; color: string; up?: boolean; h?: number; w?: number }> = ({ x0, x1, y, k, color, up = true, h = 40, w = 9 }) => {
  if (k <= 0) return null;
  const xe = x0 + (x1 - x0) * clamp01(k);
  const s = up ? -1 : 1;
  return (
    <g>
      <path d={`M${x0} ${y + s * h} L${x0} ${y} L${xe} ${y}${k >= 1 ? ` L${x1} ${y + s * h}` : ""}`} stroke={color} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {k < 1 ? <circle cx={xe} cy={y} r={w * 1.6} fill={C.saffron} stroke={CREAM} strokeWidth={3} /> : null}
    </g>
  );
};

/** Length of an arc/polyline share for stroke-dash drawing. */
export const dashLen = (L: number, k: number) => `${(L * clamp01(k)).toFixed(1)} ${(L + 10).toFixed(1)}`;

/** A planet seen from outside (noon): ocean disc with land masses sliding across (`turn` px), lit upper-left. */
const SpinBall: React.FC<{ cx: number; cy: number; R: number; turn: number; id: string }> = ({ cx, cy, R, turn, id }) => {
  const W = R * 4;
  const lands = [
    [0, -0.35, 0.42, 0.26],
    [0.55, 0.1, 0.3, 0.42],
    [1.25, -0.15, 0.5, 0.3],
    [1.9, 0.38, 0.36, 0.22],
    [2.5, -0.5, 0.3, 0.2],
    [3.1, 0.05, 0.45, 0.36],
  ];
  return (
    <g>
      <clipPath id={id}>
        <circle cx={cx} cy={cy} r={R} />
      </clipPath>
      <circle cx={cx + 16} cy={cy + 20} r={R} fill={alpha(NOON.shadow, 0.35)} />
      <circle cx={cx} cy={cy} r={R} fill="#2F8FB5" />
      <g clipPath={`url(#${id})`}>
        {lands.map(([u, v, rx, ry], i) => {
          const x = cx - R * 1.6 + ((((u * R + turn) % W) + W) % W);
          return (
            <g key={i}>
              <ellipse cx={x} cy={cy + v * R} rx={rx * R} ry={ry * R} fill={i % 2 ? C.crust : "#5FB09A"} />
              <ellipse cx={x - W} cy={cy + v * R} rx={rx * R} ry={ry * R} fill={i % 2 ? C.crust : "#5FB09A"} />
            </g>
          );
        })}
        {/* terminator shading (lit upper-left) */}
        <circle cx={cx + R * 0.55} cy={cy + R * 0.45} r={R * 1.15} fill={alpha("#0A3C4C", 0.32)} />
        <circle cx={cx - R * 0.4} cy={cy - R * 0.45} r={R * 0.5} fill={alpha("#FFF3C8", 0.18)} />
      </g>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={alpha("#FFF3C8", 0.7)} strokeWidth={5} />
    </g>
  );
};

const NoonSky: React.FC<{ f: number; seed?: number }> = ({ f, seed = 1 }) => (
  <g>
    <Sky family={NOON} />
    <Bloom x={260} y={150} r={420} color={NOON.light} core={60} coreColor="#FFFFFF" strength={0.9} />
    <CloudRack f={f} n={5} x0={-600} x1={2600} y0={120} y1={420} size={80} speed={2} body={alpha("#FFFFFF", 0.9)} under={alpha("#9CCFC0", 0.6)} top={alpha("#FFFFFF", 0.9)} seed={seed + 2} />
  </g>
);

// ================================================================================================================
// cues
// ================================================================================================================
export const cuesL04 = (t: SceneTiming) => {
  const { at, p, end } = cueKit(t);
  return {
    villain: 0, // 4-01
    spinning: p(0, "The Earth is spinning"), // 4-02 (phase)
    equator: p(0, "Stand at the equator"), // 4-03
    kmh: p(0, "sixteen hundred and seventy"),
    drop: at(1), // 4-04 (phase)
    carries: p(1, "it carries that sideways speed"), // 4-05
    slower: p(1, "while the rock below"), // 4-06 (phase)
    drifts: p(1, "So the probe drifts"), // 4-07
    hits: p(1, "hits the wall"),
    within: at(2), // 4-08 (phase)
    account: p(2, "by one well-known"), // 4-09 (phase)
    way: at(3), // 4-10
    nospeed: p(3, "where there is no sideways"), // 4-11 (phase)
    famous: p(3, "That is what the famous"), // 4-12
    textbook: p(3, "The textbook Earth"), // 4-13 (phase)
    last: end(3),
    end: t.frames,
  };
};
export type CL04 = ReturnType<typeof cuesL04>;

// ================================================================================================================
// 4-01 + 4-02 · noon: the planet turns; Tick at the hatch on top; then the camera pushes in and a 24-h ring fills around
// it while the land makes one full turn. Metric 23.9 h (#12). MOVER: land crossing (4 → 13 px/f) + the ring's head.
// ================================================================================================================
const ShotSpin: ShotFC<CL04> = ({ f, len, c }) => {
  const g = { cx: 760, cy: 610, R: 300 };
  const ph = c.spinning - c.villain;
  const k = ez(f, ph, Math.min(len - 10, ph + 120));
  const turn = f * 4 + k * g.R * 4; // one full turn while the ring fills
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 520, zoom: 1.0 },
    { f: ph, x: 880, y: 540, zoom: 1.06 },
    { f: len, x: 820, y: 560, zoom: 1.18 },
  ]);
  const ringR = g.R + 60;
  const L = 2 * Math.PI * ringR;
  return (
    <Pop f={f}>
      <Stage theme={NOON.theme} cam={cam} vignette={0.08} grain={0.5}>
        <Layer depth={0.3}>
          <NoonSky f={f} />
          <Flock frame={f} x={-200 + f * 3} y={260} vx={0} n={5} size={12} color={alpha("#1E2A2E", 0.6)} seed={3} />
        </Layer>
        <Layer depth={1}>
          <SpinBall {...g} turn={turn} id="l04ball" />
          {/* the equator band */}
          <path d={`M${g.cx - g.R} ${g.cy} A ${g.R} ${g.R * 0.18} 0 0 0 ${g.cx + g.R} ${g.cy}`} fill="none" stroke={C.saffron} strokeWidth={9} strokeDasharray="30 18" strokeDashoffset={-turn} />
          <HatchLid x={g.cx} y={g.cy - g.R + 6} r={44} family={NOON} f={f} />
          <Tick x={g.cx - 90} y={g.cy - g.R + 18} pxPerM={70} frame={f} facing={1} pose="hips" expression="determined" look={0.4} tilt={-12} />
          {/* the 24-hour ring */}
          <circle cx={g.cx} cy={g.cy} r={ringR} fill="none" stroke={alpha(INK, 0.18)} strokeWidth={22} />
          <circle cx={g.cx} cy={g.cy} r={ringR} fill="none" stroke={C.vermilion} strokeWidth={22} strokeDasharray={dashLen(L, k)} transform={`rotate(-90 ${g.cx} ${g.cy})`} strokeLinecap="round" opacity={k > 0 ? 1 : 0} />
          {k > 0 && k < 1 ? (() => {
            const a = -Math.PI / 2 + k * 2 * Math.PI;
            return <circle cx={g.cx + Math.cos(a) * ringR} cy={g.cy + Math.sin(a) * ringR} r={20} fill={C.saffron} stroke={CREAM} strokeWidth={4} />;
          })() : null}
        </Layer>
        <Layer depth={0}>
          <Kicker x={120} y={130} text="THE SECOND VILLAIN" color={INK} size={32} />
          <Slab x={1300} y={560} value="23.9" /* #12: 23.9345 h */ unit="h" size={120} F={NOON} opacity={ez(f, ph + 10, ph + 24)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 4-03 + 4-04 · side view at the equator: the ground slides west under Tick (12 px/f) while a long arrow streams east;
// Metric 1,670 km/h (#12 #13) with the pill EAST (F7). Then the camera pushes in: Tick holds the probe over the open
// hatch, wind streaks racing west behind. MOVER: ground stripes (12 px/f) + the arrow's dashes + streaks (10 px/f).
// ================================================================================================================
const ShotEquator: ShotFC<CL04> = ({ f, len, c }) => {
  const ph = c.drop - c.equator;
  const show = c.kmh - c.equator;
  const slide = f * 12;
  const gy = 780;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: ph, x: 940, y: 560, zoom: 1.04 },
    { f: Math.min(len, ph + 40), x: 820, y: 620, zoom: 1.42 },
    { f: len, x: 800, y: 630, zoom: 1.5 },
  ]);
  const wob = Math.sin(f / 5) * 4;
  const hold = f >= ph;
  return (
    <Pop f={f}>
      <Stage theme={NOON.theme} cam={cam} vignette={0.08} grain={0.5}>
        <Layer depth={0.3}>
          <NoonSky f={f} seed={4} />
          <Streamers f={f} n={14} x0={-400} x1={2400} y0={180} y1={620} len={240} width={6} speed={10} color={alpha("#FFFFFF", 0.95)} opacity={0.6} dir={-1} seed={6} />
        </Layer>
        <Layer depth={1}>
          {/* ground: stripes sliding west */}
          <rect x={-800} y={gy} width={3600} height={900} fill={mixHex(C.crust, NOON.near, 0.25)} />
          {Array.from({ length: 30 }, (_, i) => {
            const x = -800 + ((((i * 140 - slide) % 4200) + 4200) % 4200);
            return <rect key={i} x={x} y={gy} width={70} height={900} fill={alpha(C.crustDeep, 0.55)} />;
          })}
          <rect x={-800} y={gy - 10} width={3600} height={18} fill={mixHex(C.crust, "#FFF3C8", 0.35)} />
          <HatchLid x={760} y={gy + 4} r={60} open={ez(f, ph - 10, ph + 10)} family={NOON} f={f} />
          <GroundShadow x={640} y={gy + 3} rx={50} color={NOON.shadow} opacity={0.35} blur={8} />
          <Tick x={640} y={gy} pxPerM={150} frame={f} facing={1} pose={hold ? "hold" : "lean"} expression={hold ? "determined" : "surprised"} look={hold ? 0.8 : 0.3} tilt={hold ? 0 : -6 + wob} squash={impact(f, 6, 0.08, 10)} />
          {hold ? <Probe x={760 + Math.sin(f / 9) * 4} y={gy - 150 + Math.cos(f / 7) * 5} size={90} f={f} /> : null}
          {/* the eastward arrow, dashes streaming */}
          <g opacity={hold ? 1 - ez(f, ph, ph + 14) : 1}>
            <path d={`M380 470 L1260 470`} stroke={C.vermilion} strokeWidth={26} strokeDasharray="60 26" strokeDashoffset={-f * 14} strokeLinecap="round" />
            <path d="M1330 470 L1240 420 L1240 520 Z" fill={C.vermilion} />
          </g>
        </Layer>
        <Layer depth={0}>
          <g opacity={hold ? 1 - ez(f, ph, ph + 14) : 1}>
            <Tag x={1340} y={380} text="EAST" F={NOON} dot={C.vermilion} size={34} />
            <Slab x={1150} y={300} value="1,670" /* #13: 2π × 6,371 km / 23.9345 h = 1,672 */ unit="km/h" size={96} F={NOON} opacity={ez(f, show - 6, show + 8)} />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 4-05 + 4-06 · void: a slice through the equator; the probe falls down the radius (8 px/f) with its long east arrow,
// while the rock beside it shows shorter and shorter arrows the deeper it goes; the spokes turn with the spin. Then two
// bars grow at right: the probe's speed vs the rock's. No distance (V1). MOVER: probe falling + arrows + bars (14 px/f).
// ================================================================================================================
const ShotSlice: ShotFC<CL04> = ({ f, len, c }) => {
  const g = { cx: 560, cy: 560, R: 440 };
  const ph = c.slower - c.carries;
  const py = g.cy - g.R + 30 + Math.min(g.R * 0.62, f * 8);
  const depthK = (py - (g.cy - g.R)) / g.R; // 0 at the surface
  const rockL = 260 * (1 - depthK); // rock speed ∝ distance from the axis
  const probeL = 260;
  const rings = [
    { r: g.R, c: C.crust },
    { r: g.R - 10, c: C.mantle },
    { r: (g.R * 3485) / 6371, c: C.outer },
    { r: (g.R * 1250) / 6371, c: C.inner },
  ];
  const spin = f * 0.6;
  const bk = ez(f, ph + 2, ph + 26);
  return (
    <Pop f={f}>
      <Stage theme={VOID.theme} cam={cameraAt(f, [{ f: 0, x: 900, y: 470, zoom: 1.12 }, { f: len, x: 960, y: 540, zoom: 1.0 }])} vignette={0.3} grain={0.5}>
        <Layer depth={0.2}>
          <VoidField f={f} {...g} seed={5} />
        </Layer>
        <Layer depth={1}>
          {rings.map((q, i) => (
            <circle key={i} cx={g.cx} cy={g.cy} r={q.r} fill={q.c} />
          ))}
          {/* spokes turning with the spin (rigid rotation, ≈ 4 px/f at mid-radius) */}
          {Array.from({ length: 24 }, (_, i) => {
            const a = ((spin + i * 15) * Math.PI) / 180;
            return <line key={i} x1={g.cx + Math.cos(a) * g.R * 0.3} y1={g.cy + Math.sin(a) * g.R * 0.3} x2={g.cx + Math.cos(a) * g.R * 0.96} y2={g.cy + Math.sin(a) * g.R * 0.96} stroke={alpha(C.mantleDeep, 0.8)} strokeWidth={6} />;
          })}
          <circle cx={g.cx} cy={g.cy} r={g.R * 0.14} fill={C.innerCore} opacity={0.7} />
          {/* the shaft down the radius */}
          <rect x={g.cx - 26} y={g.cy - g.R - 4} width={52} height={g.R * 0.86} rx={10} fill={alpha(VOID.shadow, 0.85)} />
          {/* the axis mark */}
          <circle cx={g.cx} cy={g.cy} r={10} fill={CREAM} />
          {/* rock arrows: fixed marks along the shaft, shorter with depth */}
          {[0.08, 0.24, 0.4, 0.56, 0.72].map((d, i) => {
            const y = g.cy - g.R + d * g.R;
            const L = 260 * (1 - d);
            const on = ez(py - y, -40, 10);
            return <Arrow key={i} x1={g.cx + 46} y1={y} x2={g.cx + 46 + L * on} y2={y} color={C.saffron} w={12} head={30} opacity={on} />;
          })}
          {/* the probe and its east arrow (the speed it carried down) */}
          <Probe x={g.cx} y={py} size={70} f={f} />
          <Arrow x1={g.cx - 40 - probeL} y1={py - 34} x2={g.cx - 40} y2={py - 34} color={C.teal} w={16} head={36} />
          <path d={`M${g.cx - 40 - probeL - 120} ${py - 34} L${g.cx - 40 - probeL} ${py - 34}`} stroke={alpha(C.teal, 0.5)} strokeWidth={8} strokeDasharray="18 14" strokeDashoffset={f * 8} />
          {/* 4-06 the bars */}
          {f >= ph ? (
            <g opacity={ez(f, ph, ph + 10)} transform={`translate(${(1 - ez(f, ph, ph + 16)) * 200} 0)`}>
              <rect x={1060} y={330} width={460} height={260} rx={24} fill={alpha(VOID.shadow, 0.75)} />
              <rect x={1100} y={380} width={probeL * 1.4 * bk} height={54} rx={14} fill={C.teal} />
              <rect x={1100} y={480} width={rockL * 1.4 * bk} height={54} rx={14} fill={C.saffron} />
              <text x={1100} y={372} style={{ fontFamily: "'Anton', sans-serif", fontSize: 26, letterSpacing: 3, fill: CREAM }}>PROBE</text>
              <text x={1100} y={472} style={{ fontFamily: "'Anton', sans-serif", fontSize: 26, letterSpacing: 3, fill: CREAM }}>ROCK</text>
            </g>
          ) : null}
        </Layer>
        <Layer depth={0}>
          <Tag x={120} y={950} text="CARRIES ITS SIDEWAYS SPEED" F={VOID} dot={C.teal} size={30} opacity={1 - ez(f, ph, ph + 10)} />
          <Tag x={120} y={950} text="ROCK BELOW: SLOWER" F={VOID} dot={C.saffron} size={30} opacity={ez(f, ph + 4, ph + 14)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 4-07 + 4-08 + 4-09 · void tunnel: the probe drifts east into the wall and scrapes; sparks fly; a scar is cut into the
// wall and streams up with the rock; the probe fires a marker flag into the scar. No depth on screen (V1). Tick watches
// in a rim window (never in the tunnel, F13). MOVER: strata (14 → 10 px/f) + the drift + sparks + the scar.
// ================================================================================================================
const ShotScrape: ShotFC<CL04> = ({ f, len, c }) => {
  const hit = c.hits - c.drifts;
  const p8 = c.within - c.drifts;
  const p9 = c.account - c.drifts;
  const cx = 660;
  const gap = 300;
  const contact = cx + gap / 2 - 40;
  const px = cx - 60 + (contact - (cx - 60)) * ez(f, 0, hit);
  const touching = f >= hit - 2;
  const speed = f < p8 ? 14 : 10;
  const scroll = f < p8 ? f * 14 : p8 * 14 + (f - p8) * 10;
  const py = 470;
  const flagAt = p9 + 4; // the marker fires into the scar
  const flagY = py + 40 - (f - flagAt) * speed; // rides up with the rock
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 540, zoom: 1.0 },
    { f: p8, x: 820, y: 520, zoom: 1.1 },
    { f: len, x: 780, y: 500, zoom: 1.28 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={VOID.theme} cam={cam} vignette={0.3} grain={0.5}>
        <Layer depth={1}>
          <DeepShaft
            f={f}
            F={VOID}
            scroll={scroll}
            depth={40}
            cx={cx}
            gap={gap}
            embers={0}
            probe={{ x: px, y: py, variant: touching ? "scrape" : "plain", tilt: touching ? -14 : -4 * ez(f, 0, hit), side: 1, amount: 1.4 }}
            over={
              <g>
                {/* the scar: a bright gouge from the contact point up the wall, streaming with the rock */}
                {touching ? <Emissive d={`M${contact + 38} ${py + 30} L${contact + 38} ${Math.max(-40, py + 30 - (f - hit) * speed)}`} color={C.saffron} core={C.saffronCore} width={7} strength={0.9} glow={8} /> : null}
                {touching
                  ? Array.from({ length: 14 }, (_, i) => {
                      const age = (f * 1.0 + i * 5) % 26;
                      const a = (-150 + i * 9) * (Math.PI / 180);
                      const r = age * 10;
                      return <circle key={i} cx={contact + 30 + Math.cos(a) * r * 0.6 - 30} cy={py + 40 + Math.sin(a) * r * -0.3 + age * age * 0.5} r={6 + (i % 3) * 3} fill={i % 2 ? C.saffronCore : C.outer} opacity={1 - age / 26} />;
                    })
                  : null}
                {f >= flagAt ? (
                  <g transform={`translate(${contact + 38} ${flagY})`}>
                    <line x1={0} y1={0} x2={-70 * ez(f, flagAt, flagAt + 6)} y2={0} stroke={CREAM} strokeWidth={6} strokeLinecap="round" />
                    <path d={`M${-70 * ez(f, flagAt, flagAt + 6)} 0 l${-60 * ez(f, flagAt + 3, flagAt + 14)} ${-18 + Math.sin(f / 3) * 6} l0 36 Z`} fill={C.saffron} transform={`translate(0 -18)`} />
                  </g>
                ) : null}
              </g>
            }
          />
        </Layer>
        <Layer depth={0}>
          {/* the rim window: Tick at the hatch, leaning in, worried */}
          <g opacity={1 - ez(f, p8 - 6, p8 + 6)}>
            <rect x={90} y={90} width={360} height={260} rx={30} fill={NOON.sky[1]} stroke={CREAM} strokeWidth={6} />
            <clipPath id="l04rim">
              <rect x={90} y={90} width={360} height={260} rx={30} />
            </clipPath>
            <g clipPath="url(#l04rim)">
              <rect x={90} y={280} width={360} height={80} fill={C.crust} />
              <ellipse cx={300} cy={286} rx={70} ry={16} fill={VOID.shadow} />
              <Tick x={210} y={282} pxPerM={90} frame={f} facing={1} pose="lean" expression="worried" look={0.9} tilt={14 + Math.sin(f / 6) * 4} headTilt={14} />
            </g>
          </g>
          <Tag x={120} y={950} text="ONE WELL-KNOWN ACCOUNT" F={VOID} dot={C.saffron} size={30} opacity={ez(f, p9 - 4, p9 + 8)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 4-10 + 4-11 · STUDIO: Tick redraws the tunnel from the north pole to the south pole (the line's head, 20 px/f); then
// the probe falls dead straight along the axis while the globe turns around it. MOVER: the head; then probe + hatch.
// ================================================================================================================
const ShotPoles: ShotFC<CL04> = ({ f, len, c }) => {
  const g = { cx: 760, cy: 450, R: 330 };
  const ph = c.nospeed - c.way;
  const draw = clamp01((f * 20) / (2 * g.R));
  const fall = f >= ph ? harmonic((f - ph) / 70) : null;
  return (
    <Pop f={f}>
      <Stage theme={STUDIO.theme} shotFrame={f} drift={{ zoom: 1.08, panX: 0.02, panY: 0.01, frames: len + 40, seed: 3 }} vignette={0.12} grain={0.5}>
        <StudioRoom f={f + 200} seed={8} hud={<Tag x={120} y={950} text="POLE TO POLE" F={STUDIO} dot={C.saffron} size={32} />}>
          <CutGlobe {...g} f={f} family={STUDIO} rot={f * (f >= ph ? 1.4 : 0.5)} spin={f >= ph} line={{ to: -1 + 2 * draw }} probe={fall} trail={0.3} />
          {/* the old equator shaft, crossed out */}
          <path d={`M${g.cx + g.R} ${g.cy} L${g.cx + g.R * 0.25} ${g.cy}`} stroke={alpha(INK, 0.5)} strokeWidth={10} strokeDasharray="14 10" />
          <Cross x={g.cx + g.R * 0.62} y={g.cy} s={34} k={ramp(f, 10, 18)} />
          <GroundShadow x={1330} y={FLOOR + 3} rx={60} color={STUDIO.shadow} opacity={0.35} blur={8} />
          <Tick x={1330} y={FLOOR} pxPerM={160} frame={f} facing={-1} pose={f < ph ? "press" : "point"} staff={f < ph} expression="determined" look={0.5} />
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 4-12 + 4-13 · STUDIO: a crossed-out spin arrow stamps down over the pole with a ring; Tick nods. Then the textbook
// ball's spin decelerates to a stop as Tick pulls a brake lever; the camera starts its push into the shaft (ZT out).
// MOVER: stamp slam + ring (8 px/f); then the spin (5 → 0 px/f) + the lever + the closing push.
// ================================================================================================================
const ShotNoSpin: ShotFC<CL04> = ({ f, len, c }) => {
  const g = { cx: 720, cy: 540, R: 260 };
  const ph = c.textbook - c.famous;
  const stamp = ramp(f, 8, 16);
  const ringR = (f - 16) * 8;
  // spin angle: 1.2 °/f until the lever, then decelerating to 0 over 40 f
  const brake = clamp01((f - ph) / 40);
  const rot = f < ph ? f * 1.2 : ph * 1.2 + 1.2 * 40 * (brake - (brake * brake) / 2);
  const lever = ez(f, ph - 4, ph + 8);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: len - 18, x: 900, y: 520, zoom: 1.12 },
    { f: len, x: g.cx, y: g.cy - g.R, zoom: 2.4 },
  ]);
  const nod = Math.max(0, Math.sin(((f - 18) / 10) * Math.PI)) * (f > 18 && f < 58 ? 12 : 0);
  return (
    <Pop f={f}>
      <Stage theme={STUDIO.theme} cam={cam} vignette={0.12} grain={0.5}>
        <StudioRoom f={f + 400} seed={9} hud={<Tag x={120} y={950} text="TEXTBOOK EARTH: NO SPIN" F={STUDIO} dot={C.saffron} size={32} opacity={ez(f, ph, ph + 12)} />}>
          {/* the stand */}
          <rect x={g.cx - 14} y={g.cy + g.R} width={28} height={FLOOR - g.cy - g.R} fill={C.saffronDeep} />
          <rect x={g.cx - 110} y={FLOOR - 24} width={220} height={28} rx={10} fill={C.saffronDeep} />
          <CutGlobe {...g} f={f} family={STUDIO} rot={rot} spin={f < ph + 30} line={{ to: 1 }} />
          {/* the spin icon, stamped and crossed out */}
          {stamp > 0 ? (
            <g transform={`translate(${g.cx} ${g.cy - g.R - 110}) scale(${(2.2 - 1.2 * stamp).toFixed(3)})`} opacity={Math.min(1, stamp * 3)}>
              <path d="M-70 0 A70 34 0 1 1 52 22" fill="none" stroke={INK} strokeWidth={14} strokeLinecap="round" />
              <path d="M40 4 L80 34 L34 46 Z" fill={INK} />
            </g>
          ) : null}
          <Cross x={g.cx} y={g.cy - g.R - 110} s={60} k={ramp(f, 14, 22)} />
          {ringR > 0 && ringR < 700 ? <circle cx={g.cx} cy={g.cy - g.R - 110} r={ringR} fill="none" stroke={C.saffron} strokeWidth={10} opacity={1 - ringR / 700} /> : null}
          {/* the brake lever */}
          <g transform={`rotate(${-30 + lever * 60} ${1180} ${FLOOR - 20})`}>
            <rect x={1172} y={FLOOR - 250} width={16} height={230} rx={8} fill={INK} />
            <circle cx={1180} cy={FLOOR - 254} r={24} fill={C.vermilion} />
          </g>
          <rect x={1140} y={FLOOR - 30} width={80} height={34} rx={8} fill={INK} />
          <path d={`M1180 ${FLOOR - 10} Q ${(g.cx + 1180) / 2} ${FLOOR + 20} ${g.cx + 100} ${FLOOR - 10}`} stroke={INK} strokeWidth={6} fill="none" />
          <GroundShadow x={1330} y={FLOOR + 3} rx={60} color={STUDIO.shadow} opacity={0.35} blur={8} />
          <Tick x={1330} y={FLOOR} pxPerM={160} frame={f} facing={-1} pose={f < ph - 6 ? "hips" : "heave"} expression={f < ph - 6 ? "proud" : "determined"} look={0.4} headTilt={nod} squash={impact(f, ph + 8, 0.12, 10)} />
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================

export const SceneL04: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL04(t);
  const shots: ShotDef<CL04>[] = [
    { from: 0, S: ShotSpin, id: "4-01" }, // + 4-02
    { from: c.equator, S: ShotEquator, id: "4-03" }, // + 4-04
    { from: c.carries, S: ShotSlice, id: "4-05" }, // + 4-06
    { from: c.drifts, S: ShotScrape, id: "4-07" }, // + 4-08, 4-09
    { from: c.way, S: ShotPoles, id: "4-10" }, // + 4-11
    { from: c.famous, S: ShotNoSpin, id: "4-12" }, // + 4-13
  ];
  return playShots(f, shots, c, t.frames);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL04 = (t: SceneTiming): Cue[] => {
  const c = cuesL04(t);
  return [
    { at: 0, file: SFX.wind, vol: 0.16, dur: c.carries, fadeIn: 20, fadeOut: 20 },
    ...Array.from({ length: 8 }, (_, i) => ({ at: c.spinning + 10 + i * 12, file: SFX.click, vol: 0.05, dur: 8 })),
    ...cutHit(c.equator),
    { at: c.equator + 4, file: SFX.whoosh, vol: 0.2, dur: 40 },
    { at: c.drop, file: SFX.swirl, vol: 0.16, dur: 40 },
    ...cutHit(c.carries),
    { at: c.carries, file: SFX.rumble, vol: 0.16, dur: c.drifts - c.carries, fadeIn: 10, fadeOut: 10 },
    { at: c.slower + 4, file: SFX.click, vol: 0.14, dur: 10 },
    ...cutHit(c.drifts),
    { at: c.hits, file: SFX.debris, vol: 0.3, dur: 90, fadeOut: 20 },
    { at: c.within, file: SFX.click, vol: 0.12, dur: 10 },
    { at: c.account + 4, file: SFX.pop, vol: 0.2, dur: 16 },
    ...cutHit(c.way),
    { at: c.way + 4, file: SFX.swirl, vol: 0.16, dur: 40 },
    { at: c.nospeed, file: SFX.whoosh, vol: 0.18, dur: 40 },
    ...cutHit(c.famous),
    { at: c.famous + 14, file: SFX.popLong, vol: 0.24, dur: 30 },
    { at: c.textbook + 4, file: SFX.click, vol: 0.16, dur: 10 },
  ];
};
