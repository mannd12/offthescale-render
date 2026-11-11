// L12 scene l04 "The saw" (storyboard §3 "4 · The saw": shots 4-01…4-10, script lines 26-30 = scene lines 0-4,
// families noon winter → studio (paper chart, balance, three plates) → petrol reveal, Act II). The tail draws the
// BlackBeat + sting and ChapterCard 3 "The Mountain in the Sea" (petrol) in the room HOLDS gives it (actBreakAt).
// On-screen claims, each a row in episodes/L12-mountain-limit/sources.md:
//   glaciers above the snowline = "the glacial buzzsaw" (#10, #11) · "2009 · Nature": highest peaks track the local
//   snowline; a window just below it; climate over tectonics (#11) · CRUSH / FLOW / CUT recap (#9, #10, #11) ·
//   Everest 8,848.86 m above sea level (#1) · a second bar that passes it, 10,211 m from the sea floor (#13, flag F3:
//   the second bar's base is labelled the moment it appears; the name is held for scene 5).
// Flag F5: the world map is plainly schematic blobs (no coastline is claimed; Natural Earth was NOT imported) and the
// snowline curve is a concept from the 2009 study, not surveyed data: pill "SNOWLINE · SCHEMATIC". Range triangles
// stay unlabelled and no altitude ticks are drawn on the chart.
import React from "react";
import { useCurrentFrame } from "remotion";
import {
  BlackBeat,
  Bloom,
  ChapterCard,
  Cumulus,
  Embers,
  Facets,
  Flock,
  Form,
  GroundShadow,
  HaloText,
  HazeBand,
  Kicker,
  Layer,
  Motes,
  P,
  Pill,
  Puffs,
  Sky,
  Stage,
  Stars,
  Tick,
  alpha,
  cameraAt,
  cutPop,
  fall,
  flicker,
  impact,
  mixHex,
  ridgePath,
  rnd,
  roundPoly,
  seaSurface,
  smooth,
} from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { L12_COLORS, familyOf, pillFill } from "../families";
import { cueKit } from "../cues";
import { HEIGHTS, L12Gauge } from "../L12Gauge";
import { ShotDef, ShotFC, actBreakAt, playShots } from "../shots";
import { Cue, SFX, cutHit, sting } from "./cue-types";
import { CycClouds, STUDIO_SET } from "./S08";

type Pt = [number, number];
const NOON = familyOf("noon");
const STUDIO = STUDIO_SET; // the coloured studio set (polish pass (a), 2026-11-11)
const PETROL = familyOf("petrol");
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (f: number, a: number, b: number) => smooth(clamp01((f - a) / Math.max(1, b - a)));

export const cuesL04 = (t: SceneTiming) => {
  const { at, p, end } = cueKit(t);
  const ab = actBreakAt(t);
  return {
    winter: 0, // 4-01 → 4-02 (PUSH)
    ice: p(0, "turns to ice"),
    grind: p(0, "Glaciers grind"), // 4-02: the tongue bites
    saw: p(0, "geologists have a name"), // 4-03: the blade, Tick flinches
    buzz: p(0, "the glacial buzzsaw"),
    map: at(1), // 4-04 → 4-05 (PUSH)
    chart: p(1, "The highest peaks"),
    window: at(2), // 4-06
    scale: p(2, "So how high"), // 4-07: the balance
    climate: p(2, "its climate"),
    plates: at(3), // 4-08 → 4-09 (PUSH)
    crush: p(3, "Weight that crushes"),
    flow: p(3, "A base that flows"),
    cut: p(3, "Ice that cuts"),
    agree: p(3, "Everest stands"),
    reveal: at(4), // 4-10
    taller: p(4, "taller than Everest"),
    last: end(4),
    black: ab.start, // BlackBeat + sting → ChapterCard 3
    end: t.frames,
  };
};
export type CL04 = ReturnType<typeof cuesL04>;
type C = CL04;

// ---------------------------------------------------------------------------------------------------------------
// The winter range (4-01 … 4-03, 4-06): hard two-tone light from the upper left, sea-glass glaciers in the valleys.
const SNOWLINE = 520;
const RANGE: Pt[] = [[-500, 900], [-140, 640], [60, 520], [250, 330], [360, 400], [470, 560], [600, 640], [760, 450], [900, 250], [1010, 330], [1120, 520], [1250, 620], [1400, 430], [1540, 300], [1650, 390], [1780, 560], [1960, 660], [2400, 900]];
const VALLEYS: Pt[] = [[600, 640], [1250, 620], [1960, 660]];
const rangeY = (x: number) => {
  for (let i = 0; i < RANGE.length - 1; i++) if (x >= RANGE[i][0] && x <= RANGE[i + 1][0]) return lerp(RANGE[i][1], RANGE[i + 1][1], (x - RANGE[i][0]) / (RANGE[i + 1][0] - RANGE[i][0]));
  return 900;
};

/** `shave` = world x up to which the blade has planed the tops down to `shaveY` (4-03, 4-06); `pack` 0..1 ice bands. */
const WinterRange: React.FC<{ f: number; shave?: number; shaveY?: number; pack?: number; line?: number; bite?: number; children?: React.ReactNode }> = ({ f, shave = -9999, shaveY = SNOWLINE - 150, pack = 1, line = 1, bite = 0, children }) => {
  const F = NOON;
  const rock = "#86685A"; // warm umber rock (was slate grey): lit faces warm, shadow facets cool blue (polish pass (a))
  const ICE = "#4FB5A8"; // the glaciers, more saturated than the episode sea-glass
  const pts: Pt[] = RANGE.flatMap(([x, y], i): Pt[] => {
    if (x <= shave && y < shaveY) {
      // a planed top: replace the peak with a flat where the flanks cross shaveY
      const [px, py] = RANGE[i - 1];
      const [nx, ny] = RANGE[i + 1];
      const xa = px + ((shaveY - py) / (y - py)) * (x - px);
      const xb = x + ((shaveY - y) / (ny - y)) * (nx - x);
      return [[xa, shaveY], [xb, shaveY]];
    }
    return [[x, y]];
  });
  const snow = fall(f, 90, 2500, 1100, 3, 2.2, 22);
  const cap = (line0: number) => roundPoly([...pts.map(([x, y]): Pt => [x, y]), ...pts.map(([x, y]): Pt => [x, Math.max(y, line0 + Math.sin(x * 0.02) * 14)]).reverse()], 6);
  return (
    <>
      <Layer depth={0.05}>
        <Sky stops={["#1F78B4", "#3E9FD6", "#86CDE6", "#E8E6C8"]} />
        <Bloom x={260} y={150} r={700} color="#FFF8E0" strength={0.5} spread={0.3} />
        <Bloom x={260} y={150} r={130} color="#FFFDF0" strength={0.9} spread={0.45} core={40} coreColor="#FFFFFF" />
      </Layer>
      <Layer depth={0.22} haze={{ color: "#A8DCEC", amount: 0.35 }}>
        <path d={ridgePath([[-600, 640], [-200, 520], [100, 580], [420, 470], [700, 560], [1000, 480], [1300, 570], [1600, 500], [1900, 580], [2500, 620]], 1300, 14)} fill="#4F8FC4" />
        <path d={ridgePath([[380, 500], [420, 470], [470, 505]], 520, 4)} fill="#FFFFFF" />
        <Cumulus x={((f * 2 + 900) % 2800) - 500} y={260} w={520} h={120} fill="#FFFFFF" shade="#A9CDEA" lit="#FFFFFF" seed={5} frame={f} />
        <Cumulus x={((f * 1.6 + 2300) % 2800) - 500} y={170} w={420} h={100} fill="#FFFFFF" shade="#A9CDEA" lit="#FFFFFF" seed={8} frame={f} />
        <Flock frame={f} x={1900} y={330} vx={-1.1} n={5} size={9} color={F.shadow} seed={6} />
      </Layer>
      <Layer depth={1}>
        <Form d={ridgePath(pts, 1500, 8)} fill={rock} light={225} shadow={F.shadow} inset={26} shadowOpacity={0.4} rim="#FFFFFF" rimWidth={4} rimOpacity={0.9} bounce={F.bounce} hard>
          <Facets pts={pts} base={1500} light={225} fill="#1F5E7A" opacity={0.4} />
          <Facets pts={pts} base={1500} light={225} fill="#FFD49A" opacity={0.3} lit />
          {/* snow above the snowline: two tones, hard edge */}
          <path d={cap(SNOWLINE)} fill="#BFDDF2" />
          <path d={cap(SNOWLINE - 110)} fill="#FFF5E0" />
          <Facets pts={pts} base={SNOWLINE + 20} light={225} fill="#6E9EDA" opacity={0.5} depth={170} />
        </Form>
        {/* glaciers in the valleys: sea-glass tongues with ice bands that pack down and crevasses that crawl */}
        {VALLEYS.map(([vx, vy], i) => {
          const w = 150;
          const tongue = roundPoly([[vx - w, vy - 150], [vx - w * 0.5, vy - 30], [vx - w * 0.7, vy + 150], [vx - w * 0.2, vy + 330 + pack * 40], [vx + w * 0.5, vy + 330 + pack * 40], [vx + w * 0.8, vy + 140], [vx + w * 0.5, vy - 30], [vx + w, vy - 150]], 30);
          return (
            <Form key={i} d={tongue} fill={ICE} light={225} shadow={mixHex(ICE, "#1E3E7A", 0.5)} inset={18} shadowOpacity={0.5} rim="#FFFFFF" rimWidth={3} rimOpacity={0.9} hard>
              {Array.from({ length: 9 }, (_, k) => {
                const yy = vy - 120 + ((k * 56 + f * 0.9) % 500);
                return <path key={k} d={`M${vx - w} ${yy} Q${vx} ${yy + 36} ${vx + w} ${yy}`} fill="none" stroke={k % 3 === 0 ? "#FFFFFF" : mixHex(ICE, "#1E3E7A", 0.45)} strokeWidth={k % 3 === 0 ? 4 : 2.5} opacity={0.4 + 0.5 * pack} />;
              })}
              <rect x={vx - w} y={vy - 160} width={w * 2} height={90 * pack} fill={L12_COLORS.snow} opacity={0.85} />
            </Form>
          );
        })}
        {/* ice glints */}
        {[[250, 336], [900, 256], [1540, 306], [760, 456], [1400, 436]].map(([x, y], i) => (
          <Bloom key={i} x={x + 14} y={y + 16} r={36} color="#FFFFFF" strength={0.9 * flicker(f, i * 5 + 1, 0.8)} spread={0.3} core={2.5} />
        ))}
        {/* the tongue bites the ridge (4-02): straight-edged chunks break away and tumble */}
        {bite > 0
          ? Array.from({ length: 7 }, (_, i) => {
              const t0 = clamp01(bite * 1.6 - i * 0.09);
              if (t0 <= 0) return null;
              const x = 1130 + i * 16 + t0 * (40 + i * 22);
              const y = 520 + i * 10 + t0 * t0 * (160 + i * 30);
              const s = 14 + rnd(i) * 18;
              return <path key={i} d={`M${-s} ${-s * 0.6} L${s * 0.8} ${-s} L${s} ${s * 0.5} L${-s * 0.6} ${s}`} fill={i % 2 ? rock : "#E3EEF2"} stroke={F.shadow} strokeWidth={1} transform={`translate(${x} ${y}) rotate(${t0 * (200 + i * 60)})`} opacity={1 - clamp01((t0 - 0.8) / 0.2)} />;
            })
          : null}
        {/* spindrift: plumes streaming off the high peaks (they follow the planed top in 4-03 / 4-06) */}
        {[[250, 330], [900, 250], [1540, 300]].map(([px, py], i) => (
          <Puffs key={i} frame={f + i * 7} x={px + 10} y={Math.max(py, px <= shave ? shaveY : py) + 4} color="rgba(255,255,255,0.85)" period={9} size={22} rise={0.25} drift={2.6} life={54} seed={i + 3} />
        ))}
        {/* the dashed snowline */}
        <line x1={-500} y1={SNOWLINE} x2={2500} y2={SNOWLINE} stroke={F.shadow} strokeWidth={4} strokeDasharray="16 12" opacity={0.85 * line} />
        {children}
        {snow.map((p, i) => (
          <circle key={i} cx={p.x - 250} cy={p.y - 40} r={p.r * 1.7} fill="#FFFFFF" opacity={0.8} />
        ))}
      </Layer>
    </>
  );
};

// 4-01 → 4-02: snow piles, packs to ice, the ice moves; a tongue bites the ridge
const ShotWinter: ShotFC<C> = ({ f, len, c }) => {
  const F = NOON;
  const cam = cameraAt(f, [
    { f: 0, x: 760, y: 500, zoom: 1.0 },
    { f: c.grind, x: 1040, y: 520, zoom: 1.18 },
    { f: len, x: 1180, y: 600, zoom: 1.7 },
  ]);
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.1} grain={0.5}>
      <WinterRange f={f} pack={ease(f, 20, c.ice + 30)} line={ease(f, 6, 30)} bite={clamp01((f - c.grind - 16) / Math.max(1, len - c.grind - 16))} />
      <Layer depth={1.3}>
        <path d={ridgePath([[-600, 1500], [-200, 1040], [120, 990], [460, 1060], [760, 1500]], 1900, 20)} fill="#FFF3DE" />
        <path d={ridgePath([[-600, 1500], [-200, 1100], [120, 1060], [460, 1120], [760, 1500]], 1900, 20)} fill="#94BFE6" />
      </Layer>
      <Layer depth={0}>
        <g opacity={ease(f, 10, 30)}>
          <Pill x={120} y={128} text="SNOWLINE" fill={pillFill(F)} color={F.text} size={20} />
        </g>
        <L12Gauge family={F} value={HEIGHTS.everest /* #1 */} base="ABOVE SEA LEVEL" />
      </Layer>
    </Stage>
  );
};

// 4-03: the glacier as a long slow blade shaving the tops to a line; Tick (large) flinches and shields its head
const ShotSaw: ShotFC<C> = ({ f, len, c }) => {
  const F = NOON;
  const cam = cameraAt(f, [
    { f: 0, x: 920, y: 520, zoom: 1.0 },
    { f: len, x: 960, y: 540, zoom: 1.1 },
  ]);
  const bx = lerp(-300, 2300, clamp01(f / Math.max(1, len - 26)));
  const shaveY = SNOWLINE - 150;
  const pt = clamp01((f - 6) / 22) * 1.6;
  const white = ease(f, len - 14, len); // the snow takes the frame: the way into the paper chart (ZT stand-in)
  const tk = c.buzz - c.saw;
  return (
    <Stage theme={F.theme} cam={{ ...cam, zoom: cam.zoom * cutPop(f, 0) }} vignette={0.1} grain={0.5}>
      <WinterRange f={f} shave={bx} shaveY={shaveY}>
        {/* the blade: a long sea-glass plane with teeth of ice, moving left → right at the shave line */}
        <g transform={`translate(${bx} 0)`}>
          <path d={`M-900 ${shaveY - 34} L40 ${shaveY - 34} L110 ${shaveY - 6} L40 ${shaveY + 4} L-900 ${shaveY + 4} Z`} fill={L12_COLORS.ice} />
          <path d={`M-900 ${shaveY - 34} L40 ${shaveY - 34} L80 ${shaveY - 22} L-900 ${shaveY - 22} Z`} fill="#FFFFFF" />
          {Array.from({ length: 22 }, (_, i) => (
            <path key={i} d={`M${-880 + i * 42} ${shaveY + 4} l14 12 l14 -12 Z`} fill={L12_COLORS.seaGlass} />
          ))}
          <Embers frame={f} x0={40} x1={120} y={shaveY} n={16} color="#FFFFFF" seed={4} rise={0.6} life={36} size={2.4} wiggle={30} />
        </g>
        {/* chips flying where the blade meets a peak */}
        {[250, 900, 1540].map((px, i) => {
          const t0 = clamp01((bx - px + 60) / 260);
          return t0 > 0 && t0 < 1
            ? [0, 1, 2].map((k) => <rect key={`${i}-${k}`} x={px + t0 * (60 + k * 40)} y={shaveY - 20 - Math.sin(t0 * Math.PI) * (60 + k * 24)} width={12} height={9} fill={k % 2 ? "#E3EEF2" : L12_COLORS.slate} transform={`rotate(${t0 * 400} ${px + t0 * 80} ${shaveY - 40})`} />)
            : null;
        })}
      </WinterRange>
      <Layer depth={1.25}>
        {/* the lower ridge Tick stands on: a snowy foreground shoulder */}
        <path d={ridgePath([[-600, 1500], [-100, 900], [300, 800], [700, 830], [1000, 960], [1300, 1500]], 1900, 24)} fill="#FFF3DE" />
        <path d={ridgePath([[-600, 1500], [-100, 990], [300, 900], [700, 930], [1000, 1040], [1300, 1500]], 1900, 24)} fill="#94BFE6" />
        <GroundShadow x={470} y={812} rx={110} color="#5A7A92" opacity={0.4} blur={8} />
        <Tick x={450} y={810} pxPerM={270} frame={f} pose="stand" poseTo="shield" poseT={pt} expression="surprised" expressionTo="scared" expressionT={clamp01(f / 12)} look={0.4} facing={1} outline={F.shadow} tilt={-4 + Math.sin(f / 3) * 1.2 * clamp01(1 - f / 60)} />
      </Layer>
      <Layer depth={0}>
        <g opacity={ease(f, tk - 8, tk + 8)}>
          <Kicker x={1000} y={900} text="— THE GLACIAL BUZZSAW" color={F.shadow} size={30} />
        </g>
        <L12Gauge family={F} value={HEIGHTS.everest /* #1 */} base="ABOVE SEA LEVEL" />
        <rect x={0} y={0} width={1920} height={1080} fill="#F8EEDC" opacity={white} />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// 4-04 → 4-05: the paper. A schematic world (blobs, F5), unlabelled range triangles pop in; then the paper becomes
// a chart: latitude across, the snowline as an arched band (high at the equator, low toward the poles), and the
// triangles rise to sit just under it.
const LANDS: { x: number; y: number; rx: number; ry: number; seed: number }[] = [
  { x: 420, y: 430, rx: 190, ry: 150, seed: 1 },
  { x: 540, y: 720, rx: 110, ry: 170, seed: 2 },
  { x: 980, y: 400, rx: 150, ry: 110, seed: 3 },
  { x: 1020, y: 650, rx: 130, ry: 170, seed: 4 },
  { x: 1380, y: 420, rx: 250, ry: 150, seed: 5 },
  { x: 1560, y: 760, rx: 100, ry: 70, seed: 6 },
];
// range triangles: map position (x, y) → on the chart they keep x (≈ latitude order is NOT claimed: schematic)
const TRIS: Pt[] = [[340, 400], [470, 640], [560, 790], [930, 380], [1060, 600], [1250, 430], [1440, 470], [1560, 740], [1110, 760]];
const landPath = (l: { x: number; y: number; rx: number; ry: number; seed: number }) =>
  roundPoly(
    Array.from({ length: 12 }, (_, i): Pt => {
      const a = (i / 12) * Math.PI * 2;
      const k = 0.72 + rnd(l.seed * 17 + i) * 0.5;
      return [l.x + Math.cos(a) * l.rx * k, l.y + Math.sin(a) * l.ry * k];
    }),
    34,
  );
/** the snowline arch on the chart: chart x 200..1720 = pole .. equator .. pole */
const archY = (x: number) => 760 - 440 * Math.pow(Math.cos(((x - 960) / 760) * (Math.PI / 2)), 1.3) + Math.sin(x * 0.02) * 10;

const ShotPaper: ShotFC<C> = ({ f, len, c }) => {
  const F = STUDIO;
  const tC = c.chart - c.map;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.12 },
    { f: tC, x: 980, y: 560, zoom: 1.0 },
    { f: len, x: 940, y: 540, zoom: 1.08 },
  ]);
  const k = ease(f, tC - 6, tC + 40); // 0 = map, 1 = chart
  const band = ease(f, tC + 20, tC + 80);
  const ink = "#3A3026";
  const archPts: Pt[] = Array.from({ length: 39 }, (_, i): Pt => [200 + i * 40, archY(200 + i * 40)]);
  const bandD = `M${archPts.map(([x, y]) => `${x} ${y - 26}`).join(" L")} L${archPts
    .slice()
    .reverse()
    .map(([x, y]) => `${x} ${y + 26}`)
    .join(" L")} Z`;
  return (
    <Stage theme={F.theme} cam={{ ...cam, zoom: cam.zoom * cutPop(f, 0) }} vignette={0.1} grain={0.6}>
      <Layer depth={0.05}>
        <Sky family={F} />
      </Layer>
      <Layer depth={1}>
        {/* the sheet: a paper with a pale sea-glass sea, a cast shadow, curled corner */}
        <rect x={132} y={182} width={1680} height={800} rx={6} fill={F.shadow} opacity={0.22} filter="url(#soft-16)" />
        <rect x={120} y={160} width={1680} height={800} rx={6} fill={mixHex("#5FB4B2", "#F2D3A0", 0.12 + k * 0.6)} />
        <rect x={120} y={160} width={1680} height={800} rx={6} fill="none" stroke={ink} strokeWidth={3} />
        {/* graticule that drifts a hair (the paper breathes) */}
        {Array.from({ length: 9 }, (_, i) => (
          <line key={i} x1={120} y1={240 + i * 80} x2={1800} y2={240 + i * 80} stroke={ink} strokeWidth={1} opacity={0.12} />
        ))}
        {Array.from({ length: 13 }, (_, i) => (
          <line key={"v" + i} x1={200 + i * 127} y1={160} x2={200 + i * 127} y2={960} stroke={ink} strokeWidth={1} opacity={0.12} />
        ))}
        {/* schematic lands: ink outlines drawn on, a warm wash inside; they sink to a strip as the chart takes over */}
        <g opacity={1 - k * 0.82} transform={`translate(0 ${k * 610}) scale(1 ${1 - k * 0.78})`}>
          {LANDS.map((l, i) => {
            const d = landPath(l);
            const on = ease(f, 4 + i * 7, 34 + i * 7);
            return (
              <g key={i}>
                <path d={d} fill={mixHex("#EBAE52", "#C9733A", (i % 3) * 0.3)} opacity={on * 0.9} />
                <path d={d} fill="none" stroke={ink} strokeWidth={3.5} strokeDasharray="2400" strokeDashoffset={2400 * (1 - on)} strokeLinejoin="round" />
              </g>
            );
          })}
        </g>
        {/* the snowline band (sea-glass) arching over the chart */}
        <g opacity={band}>
          <clipPath id="l04-band">
            <rect x={120} y={160} width={1680 * band} height={800} />
          </clipPath>
          <g clipPath="url(#l04-band)">
            <path d={bandD} fill={L12_COLORS.seaGlass} opacity={0.55} />
            <path d={`M${archPts.map(([x, y]) => `${x} ${y}`).join(" L")}`} fill="none" stroke={mixHex(L12_COLORS.seaGlass, ink, 0.35)} strokeWidth={4} strokeDasharray="16 12" strokeDashoffset={-f * 0.6} />
          </g>
          <line x1={200} y1={900} x2={1720} y2={900} stroke={ink} strokeWidth={3} />
          {[200, 960, 1720].map((x) => (
            <line key={x} x1={x} y1={890} x2={x} y2={912} stroke={ink} strokeWidth={3} />
          ))}
          <HaloText x={200} y={946} text="POLE" color={ink} halo="#F8EEDC" size={22} align="middle" />
          <HaloText x={960} y={946} text="EQUATOR" color={ink} halo="#F8EEDC" size={22} align="middle" />
          <HaloText x={1720} y={946} text="POLE" color={ink} halo="#F8EEDC" size={22} align="middle" />
        </g>
        {/* the range triangles: pop onto the map, then rise to sit just under the band */}
        {TRIS.map(([x, y], i) => {
          const at = 44 + i * 9;
          const on = ease(f, at, at + 8);
          const sq = impact(f, at + 4, 0.25, 9);
          const rise = ease(f, tC + 30 + i * 6, tC + 80 + i * 6);
          const cx = lerp(x, 260 + ((x - 300) / 1300) * 1400, k);
          const cy = lerp(y, archY(lerp(x, 260 + ((x - 300) / 1300) * 1400, 1)) + 64, rise) + Math.sin(f / 22 + i) * 2.5;
          const s = 30;
          return (
            <g key={i} opacity={on} transform={`translate(${cx} ${cy}) scale(${sq.sx} ${sq.sy})`}>
              <path d={`M${-s} ${s * 0.8} L0 ${-s} L${s} ${s * 0.8} Z`} fill={L12_COLORS.slate} stroke={ink} strokeWidth={2.5} strokeLinejoin="round" />
              <path d={`M${-s * 0.36} ${-s * 0.34} L0 ${-s} L${s * 0.36} ${-s * 0.34} L${s * 0.12} ${-s * 0.2} L${-s * 0.1} ${-s * 0.3} Z`} fill="#FFFFFF" />
              <path d={`M0 ${-s} L${s} ${s * 0.8} L${s * 0.2} ${s * 0.8} Z`} fill={ink} opacity={0.25} />
            </g>
          );
        })}
        {/* weather drifting over the map (fades as the chart takes over) */}
        <CycClouds f={f} y={330} n={3} seed={12} opacity={0.55 * (1 - k)} />
        <Motes frame={f} n={26} x={100} y={120} w={1720} h={860} color="#FFFFFF" seed={4} size={4} drift={36} />
      </Layer>
      <Layer depth={0}>
        <Kicker x={120} y={110} text="— 2009 · NATURE" color={F.text} size={24} />
        <g opacity={band}>
          <Pill x={1800} y={110} text="SNOWLINE · SCHEMATIC" fill={pillFill(F)} color="#FFF8E8" dot={L12_COLORS.seaGlass} size={20} align="end" />
        </g>
      </Layer>
    </Stage>
  );
};

// 4-06: one range in section: the ice planes its tops into a window just below the snowline (winter light)
const ShotWindow: ShotFC<C> = ({ f, len }) => {
  const F = NOON;
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 470, zoom: 1.5 },
    { f: len, x: 940, y: 480, zoom: 1.62 },
  ]);
  const top = SNOWLINE - 150;
  const shaveY = lerp(top - 140, SNOWLINE + 26, ease(f, 6, len * 0.6)); // the tops come down to just below the line
  const br = ease(f, len * 0.5, len * 0.5 + 24);
  return (
    <Stage theme={F.theme} cam={{ ...cam, zoom: cam.zoom * cutPop(f, 0) }} vignette={0.1} grain={0.5}>
      <WinterRange f={f} shave={3000} shaveY={shaveY}>
        {/* the window: a band just under the snowline where the planed tops end up */}
        <rect x={-500} y={SNOWLINE + 4} width={3000} height={70} fill={L12_COLORS.amber} opacity={0.2 + 0.14 * br} />
        <g opacity={br}>
          <path d={`M1130 ${SNOWLINE + 6} L1160 ${SNOWLINE + 6} L1160 ${SNOWLINE + 72} L1130 ${SNOWLINE + 72}`} fill="none" stroke={F.shadow} strokeWidth={4} />
        </g>
        {[250, 900, 1540].map((px, i) => (
          <Embers key={i} frame={f} x0={px - 60} x1={px + 60} y={shaveY} n={10} color="#FFFFFF" seed={i + 2} rise={0.5} life={40} size={2} wiggle={26} />
        ))}
      </WinterRange>
      <Layer depth={0}>
        <g opacity={br}>
          <Pill x={120} y={128} text="JUST BELOW THE SNOWLINE" fill={pillFill(F)} color={F.text} dot={L12_COLORS.amber} size={20} />
        </g>
        <L12Gauge family={F} value={HEIGHTS.everest /* #1 */} base="ABOVE SEA LEVEL" />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Studio floor (4-07 … 4-09): bone paper, key light 225, long cast shadows; kept short (chroma).
const StudioFloor: React.FC<{ f: number; children?: React.ReactNode }> = ({ f, children }) => {
  const F = STUDIO;
  return (
    <>
      <Layer depth={0.05}>
        <Sky family={F} />
        <Bloom x={260} y={120} r={900} color="#FFE4A8" strength={0.6} spread={0.35} />
      </Layer>
      <Layer depth={0.2}>
        <CycClouds f={f} y={110} seed={5} />
      </Layer>
      <Layer depth={0.4}>
        <HazeBand y={640} h={200} color={F.haze} strength={0.6} />
        <rect x={-400} y={838} width={2720} height={700} fill={mixHex(F.mid, "#FFE4A8", 0.25)} />
      </Layer>
      <Layer depth={1}>
        <rect x={-400} y={880} width={2720} height={700} fill={mixHex(F.mid, F.near, 0.5)} />
        <Motes frame={f} n={34} x={0} y={100} w={1920} h={760} color="#FFFFFF" seed={8} size={5} drift={44} />
        {children}
      </Layer>
    </>
  );
};

// 4-07: the balance: climate outweighs tectonics; Tick pushes the heavy pan down a touch
const ShotScale: ShotFC<C> = ({ f, len, c }) => {
  const F = STUDIO;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: len, x: 930, y: 550, zoom: 1.1 },
  ]);
  const tC = c.climate - c.scale;
  const tip = -3 + 14 * ease(f, 10, tC + 10) + Math.sin(f / 13) * 1.2; // degrees: the left (climate) pan goes down
  const px = 1020;
  const py = 400;
  const arm = 380;
  const rad = (tip * Math.PI) / 180;
  const L: Pt = [px - Math.cos(rad) * arm, py + Math.sin(rad) * arm];
  const R: Pt = [px + Math.cos(rad) * arm, py - Math.sin(rad) * arm];
  const wood = "#8C6A4A";
  const pan = (p: Pt, child: React.ReactNode) => (
    <g>
      <line x1={p[0]} y1={p[1]} x2={p[0] - 110} y2={p[1] + 190} stroke={F.shadow} strokeWidth={3} />
      <line x1={p[0]} y1={p[1]} x2={p[0] + 110} y2={p[1] + 190} stroke={F.shadow} strokeWidth={3} />
      <path d={`M${p[0] - 140} ${p[1] + 190} L${p[0] + 140} ${p[1] + 190} Q${p[0] + 100} ${p[1] + 240} ${p[0]} ${p[1] + 240} Q${p[0] - 100} ${p[1] + 240} ${p[0] - 140} ${p[1] + 190} Z`} fill={mixHex(wood, F.light, 0.2)} stroke={F.shadow} strokeWidth={2} />
      <g transform={`translate(${p[0]} ${p[1] + 186})`}>{child}</g>
    </g>
  );
  const pt = clamp01((f - 8) / 24) * 1.6;
  return (
    <Stage theme={F.theme} cam={{ ...cam, zoom: cam.zoom * cutPop(f, 0) }} vignette={0.1} grain={0.6}>
      <StudioFloor f={f}>
        <GroundShadow x={px + 120} y={884} rx={300} ry={26} color={F.shadow} opacity={0.3} blur={16} />
        <path d={`M${px - 26} 880 L${px - 10} ${py} L${px + 10} ${py} L${px + 26} 880 Z`} fill={wood} />
        <path d={`M${px - 26} 880 L${px - 10} ${py} L${px} ${py} L${px - 6} 880 Z`} fill={mixHex(wood, "#FFFFFF", 0.25)} />
        <rect x={px - 110} y={866} width={220} height={22} rx={6} fill={mixHex(wood, F.shadow, 0.3)} />
        <line x1={L[0]} y1={L[1]} x2={R[0]} y2={R[1]} stroke={wood} strokeWidth={16} strokeLinecap="round" />
        <circle cx={px} cy={py} r={16} fill={mixHex(wood, F.shadow, 0.4)} />
        {pan(
          L,
          <g>
            {/* climate: a cloud and snowflakes */}
            <Cumulus x={-110} y={-6} w={220} h={64} fill="#FFFFFF" shade="#B9D2E0" lit="#FFFFFF" seed={3} frame={f} />
            {[-60, 0, 60].map((x, i) => (
              <g key={i} transform={`translate(${x} ${-100 - ((f * 0.8 + i * 20) % 60) * -1 - 60}) rotate(${f * 2 + i * 40})`} opacity={0.9}>
                {[0, 60, 120].map((a) => (
                  <line key={a} x1={-11} y1={0} x2={11} y2={0} stroke={L12_COLORS.seaGlass} strokeWidth={3.5} strokeLinecap="round" transform={`rotate(${a})`} />
                ))}
              </g>
            ))}
          </g>,
        )}
        {pan(
          R,
          <g>
            {/* tectonics: two slabs pushed together by arrows */}
            <rect x={-104} y={-44} width={96} height={40} fill={L12_COLORS.slate} />
            <rect x={8 - Math.abs(Math.sin(f / 10)) * 6} y={-44} width={96} height={40} fill={mixHex(L12_COLORS.slate, "#B58E62", 0.5)} />
            <path d="M-130 -70 L-70 -70 L-70 -82 L-44 -62 L-70 -42 L-70 -54 L-130 -54 Z" fill={L12_COLORS.amber} transform="translate(0 -6)" />
            <path d="M130 -70 L70 -70 L70 -82 L44 -62 L70 -42 L70 -54 L130 -54 Z" fill={L12_COLORS.amber} transform="translate(0 -6)" />
          </g>,
        )}
        <GroundShadow x={420} y={884} rx={120} color={F.shadow} opacity={0.35} blur={8} />
        <Tick x={400} y={880} pxPerM={250} frame={f} pose="stand" poseTo="point" poseT={pt} expression="thinking" expressionTo="proud" expressionT={ease(f, tC, tC + 14)} look={0.8} facing={1} outline={F.shadow} />
      </StudioFloor>
      <Layer depth={0}>
        <g opacity={ease(f, 6, 22)}>
          <Pill x={L[0] - 80} y={150} text="CLIMATE" fill={pillFill(F)} color="#FFF8E8" dot={L12_COLORS.seaGlass} size={22} />
          <Pill x={R[0] - 30} y={150} text="TECTONICS" fill={pillFill(F)} color="#FFF8E8" dot={L12_COLORS.amber} size={22} />
        </g>
      </Layer>
    </Stage>
  );
};

// 4-08 → 4-09: CRUSH · FLOW · CUT snap in on their words; push in on Tick, who nods, then turns as a shadow slides in
const Plate: React.FC<{ f: number; at: number; x: number; title: string; children: React.ReactNode }> = ({ f, at, x, title, children }) => {
  const F = STUDIO;
  const t = f - at;
  if (t < 0) return null;
  const drop = (1 - smooth(clamp01(t / 7))) * -260;
  const sq = impact(f, at + 7, 0.12, 9);
  return (
    <g transform={`translate(${x} ${360 + drop}) scale(${sq.sx} ${sq.sy}) rotate(${Math.sin((f + x) / 40) * 0.8})`}>
      <rect x={-150} y={-166} width={316} height={356} rx={14} fill={F.shadow} opacity={0.22} filter="url(#soft-8)" />
      <rect x={-158} y={-178} width={316} height={356} rx={14} fill="#FFF8E8" stroke={F.shadow} strokeWidth={3} />
      <g>{children}</g>
      <text x={0} y={150} textAnchor="middle" style={{ fontFamily: "'Anton', sans-serif", fontSize: 44, letterSpacing: 6, fill: F.shadow }}>
        {title}
      </text>
    </g>
  );
};

const ShotPlates: ShotFC<C> = ({ f, len, c }) => {
  const F = STUDIO;
  const o = (k: number) => k - c.plates;
  const tA = o(c.agree);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 520, zoom: 1.0 },
    { f: tA, x: 960, y: 530, zoom: 1.06 },
    { f: tA + 40, x: 960, y: 700, zoom: 1.9 },
    { f: len, x: 990, y: 700, zoom: 2.05 },
  ]);
  const nod = f > tA + 30 && f < tA + 80 ? Math.sin((f - tA - 30) / 5) * 9 * Math.exp(-(f - tA - 30) / 30) : 0;
  const turn = ease(f, len - 44, len - 24); // turns right as the shadow arrives
  const shadow = ease(f, len - 50, len);
  // the look runs along the plates as each lands
  const look = f < o(c.flow) ? -0.8 : f < o(c.cut) ? 0 : f < tA ? 0.8 : lerp(0, 1, turn);
  return (
    <Stage theme={F.theme} cam={{ ...cam, zoom: cam.zoom * cutPop(f, 0) }} vignette={0.1} grain={0.6}>
      <StudioFloor f={f}>
        <Plate f={f} at={o(c.crush)} x={500} title="CRUSH">
          {/* the cracked column (#9) */}
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={-46 + (i === 0 ? -6 : 0)} y={30 - i * 46 - 20} width={92} height={42} fill={mixHex(L12_COLORS.slate, "#FFFFFF", i * 0.08)} stroke={F.shadow} strokeWidth={2} transform={`rotate(${i === 0 ? 0 : (i - 1.5) * 3})`} />
          ))}
          <path d="M-20 52 L-4 26 L-16 10 L4 -8" fill="none" stroke={F.shadow} strokeWidth={4} />
          <path d="M-70 60 L-56 44 M70 60 L58 46" stroke={L12_COLORS.amber} strokeWidth={5} strokeLinecap="round" />
        </Plate>
        <Plate f={f} at={o(c.flow)} x={960} title="FLOW">
          {/* the slumping root (#10): a soft mound spreading, warm at the base */}
          <path d={roundPoly([[-110, 60], [-96, 20], [-50, -40 + Math.sin(f / 20) * 4], [0, -56 + Math.sin(f / 20) * 4], [50, -40 + Math.sin(f / 20) * 4], [96, 20], [110, 60]], 22)} fill="#B58E62" stroke={F.shadow} strokeWidth={2} />
          <path d={roundPoly([[-110, 60], [-100, 30], [100, 30], [110, 60]], 10)} fill={L12_COLORS.amber} opacity={0.7} />
          <path d="M-120 44 l-26 0 M120 44 l26 0" stroke={L12_COLORS.amber} strokeWidth={6} strokeLinecap="round" />
        </Plate>
        <Plate f={f} at={o(c.cut)} x={1420} title="CUT">
          {/* the blade over a peak (#11) */}
          <path d="M-90 62 L-10 -40 L20 -40 L96 62 Z" fill={L12_COLORS.slate} stroke={F.shadow} strokeWidth={2} />
          <path d={`M${-130 + ((f * 1.5) % 30)} -62 L90 -62 L124 -46 L90 -38 L${-130 + ((f * 1.5) % 30)} -38 Z`} fill={L12_COLORS.seaGlass} stroke={F.shadow} strokeWidth={2} />
          <path d="M-30 -30 L-10 -40 L20 -40 L36 -20 L10 -12 Z" fill="#FFFFFF" />
        </Plate>
        <GroundShadow x={980} y={884} rx={110} color={F.shadow} opacity={0.35} blur={8} />
        <Tick x={960} y={880} pxPerM={200} frame={f} pose="stand" poseTo={f > tA ? "hips" : "think"} poseT={f > tA ? clamp01((f - tA) / 20) * 1.6 : clamp01(f / 20)} expression="thinking" expressionTo={turn > 0 ? "surprised" : "determined"} expressionT={turn > 0 ? turn : ease(f, tA, tA + 14)} look={look} facing={1} headTilt={nod} outline={F.shadow} />
        {/* the shadow that slides over the floor and Tick's visor from the right */}
        <path d={`M${2400 - shadow * 1500} 300 Q${2100 - shadow * 1500} 500 ${1900 - shadow * 1500} 1400 L2800 1400 L2800 300 Z`} fill={PETROL.shadow} opacity={0.45 * shadow} />
      </StudioFloor>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// 4-10: petrol. A far wider silhouette slides in from the right, a sea line across it; Everest stands ON that sea
// line (its base is sea level, #1), the wide one runs on below it (flag F3). One vertical scale: RS px per metre.
const RS = 0.07;
const R_SEA = 600;
const ShotReveal: ShotFC<C> = ({ f, len, c }) => {
  const F = PETROL;
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 520, zoom: 1.08 },
    { f: len, x: 1000, y: 540, zoom: 0.96 },
  ]);
  const slide = ease(f, 6, 70);
  const mkX = lerp(2700, 1250, slide);
  const mkTop = R_SEA - 4205 /* #13 */ * RS;
  const floor = R_SEA + 6000 /* #13 */ * RS;
  const evTop = R_SEA - HEIGHTS.everest /* #1 */ * RS;
  const shield: Pt[] = Array.from({ length: 25 }, (_, i): Pt => {
    const u = -1 + (2 * i) / 24;
    return [mkX + u * 760, mkTop + (floor - mkTop) * Math.pow(Math.abs(u), 1.9)];
  });
  const ev: Pt[] = [[250, R_SEA], [300, R_SEA - 180], [345, R_SEA - 350], [392, R_SEA - 520], [420, evTop], [446, R_SEA - 500], [490, R_SEA - 300], [540, R_SEA - 140], [600, R_SEA]];
  const tT = c.taller - c.reveal;
  const bar = 10211 /* #13 */ * ease(f, tT - 10, tT + 60);
  const pt = clamp01((f - 16) / 22);
  return (
    <Stage theme={F.theme} cam={{ ...cam, zoom: cam.zoom * cutPop(f, 0) }} vignette={0.26} grain={0.5}>
      <Layer depth={0.05}>
        <Sky family={F} />
        <Stars frame={f} n={80} w={1920} h={520} color={F.text} seed={7} size={1.3} twinkle={0.6} />
        <Bloom x={420} y={150} r={560} color={F.light} strength={0.45 * (0.9 + 0.1 * Math.sin(f / 30))} spread={0.3} />
        <Bloom x={420} y={150} r={96} color="#E6F5EA" strength={0.9} spread={0.45} core={40} coreColor="#F4FBF4" />
      </Layer>
      <Layer depth={1}>
        <Sky stops={["#1C8E8C", "#0E4E5C", "#082A36", "#061C26"]} x={-900} y={R_SEA} w={4400} h={1200} />
        <rect x={-900} y={floor} width={4400} height={600} fill="#06202A" />
        {/* the wide one: lit by the moon from the upper left, wet below the line */}
        <Form d={ridgePath(shield, floor + 30, 16)} fill={mixHex(L12_COLORS.slate, F.mid, 0.4)} light={300} shadow={F.shadow} inset={34} shadowOpacity={0.5} rim={F.light} rimWidth={4} rimOpacity={0.8} bounce={F.bounce}>
          <Facets pts={shield} base={floor + 30} light={300} fill={F.shadow} opacity={0.42} />
          <Sky stops={[alpha("#1FA69A", 0.4), alpha("#061C26", 0.88)]} x={-900} y={R_SEA} w={4400} h={floor - R_SEA + 40} />
        </Form>
        {/* Everest, standing on the sea line */}
        <Form d={roundPoly(ev, 8)} fill={familyOf("dusk").mid} light={300} shadow={F.shadow} inset={20} shadowOpacity={0.5} rim={F.light} rimWidth={4} rimOpacity={0.85} bounce={F.bounce}>
          <Facets pts={ev} base={R_SEA} light={300} fill={F.shadow} opacity={0.4} />
          <path d={roundPoly([[370, R_SEA - 440], [392, R_SEA - 520], [420, evTop], [446, R_SEA - 500], [468, R_SEA - 400], [430, R_SEA - 420], [400, R_SEA - 400]], 6)} fill={L12_COLORS.snow} />
        </Form>
        <circle cx={420} cy={evTop} r={7 + Math.sin(f / 9)} fill={P.vermilion} />
        {/* the wavy sea-glass line across everything */}
        <path d={seaSurface(f, -900, 3500, R_SEA, 6, 240, 1.3, R_SEA + 30, 40)} fill="#8FE6D6" opacity={0.8} />
        <path d={seaSurface(f + 14, -900, 3500, R_SEA + 1, 4, 160, -1.0, R_SEA + 12, 40)} fill="#D8FFF4" opacity={0.5} />
        <Motes frame={f} n={30} x={-200} y={R_SEA + 60} w={2400} h={400} color="#BFF5E8" seed={15} size={2.2} drift={10} />
      </Layer>
      <Layer depth={1.25}>
        <path d={ridgePath([[-500, 1500], [-100, 1000], [260, 930], [640, 990], [900, 1500]], 1900, 30)} fill={F.near} />
        <GroundShadow x={330} y={936} rx={70} color={F.shadow} opacity={0.5} blur={8} />
        <Tick x={320} y={934} pxPerM={170} frame={f} pose="stand" poseTo="hips" poseT={pt * 1.6} expression="determined" expressionTo="surprised" expressionT={pt} look={1} facing={1} outline={F.shadow} staff />
      </Layer>
      <Layer depth={0}>
        <L12Gauge family={F} value={HEIGHTS.everest /* #1 */} max={12000} base="ABOVE SEA LEVEL" bars={bar > 0 ? [{ value: bar, color: L12_COLORS.seaGlass, base: "FROM THE SEA FLOOR" }] : []} />
      </Layer>
    </Stage>
  );
};

// the act break: BlackBeat (+ sting) → ChapterCard 3
const ShotCard: ShotFC<C> = ({ f, len }) => (
  <>
    <ChapterCard family={PETROL} kicker="— CHAPTER THREE" title="The Mountain in the Sea" t={clamp01((f - 14) / Math.max(1, len - 14))} frame={f} />
    <BlackBeat t={clamp01(f / 20)} fadeIn={0.15} fadeOut={0.4} />
  </>
);

export const SceneL04: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL04(t);
  const shots: ShotDef<C>[] = [
    { from: 0, S: ShotWinter, id: "4-01" },
    { from: c.saw, S: ShotSaw, id: "4-03" },
    { from: c.map, S: ShotPaper, id: "4-04" },
    { from: c.window, S: ShotWindow, id: "4-06" },
    { from: c.scale, S: ShotScale, id: "4-07" },
    { from: c.plates, S: ShotPlates, id: "4-08" },
    { from: c.reveal, S: ShotReveal, id: "4-10" },
    { from: c.black, S: ShotCard, id: "5-00" },
  ];
  return playShots(f, shots, c, t.frames);
};

/** Spot SFX (scene-relative frames; files from studio/public/audio/LICENSES.md only). */
export const soundL04 = (t: SceneTiming): Cue[] => {
  const c = cuesL04(t);
  return [
    { at: 0, file: SFX.wind, vol: 0.2, dur: c.map, fadeIn: 20, fadeOut: 24 }, // winter wind bed
    { at: c.grind + 16, file: SFX.debris, vol: 0.22, dur: c.saw - c.grind, fadeOut: 20 }, // the tongue bites
    { at: c.grind, file: SFX.rumble, vol: 0.18, dur: c.saw - c.grind, fadeIn: 10, fadeOut: 20 },
    ...cutHit(c.saw),
    { at: c.saw + 4, file: SFX.whoosh, vol: 0.3, dur: 70 }, // the blade
    ...[30, 70, 110].map((o) => ({ at: c.saw + o, file: SFX.click, vol: 0.2, dur: 14 })), // chips
    { at: c.map - 12, file: SFX.swirl, vol: 0.22, dur: 60 }, // into the snow → the paper
    ...Array.from({ length: 9 }, (_, i) => ({ at: c.map + 44 + i * 9, file: SFX.pop, vol: 0.16, dur: 16 })), // a pop per triangle
    { at: c.chart + 20, file: SFX.swirl, vol: 0.2, dur: 70 }, // the band draws on
    ...cutHit(c.window),
    { at: c.window + 10, file: SFX.click, vol: 0.2, dur: 14 },
    ...cutHit(c.scale),
    { at: c.climate, file: SFX.popLong, vol: 0.3, dur: 30 }, // the heavy pan settles
    ...cutHit(c.plates),
    { at: c.crush + 7, file: SFX.pop, vol: 0.3, dur: 20 },
    { at: c.flow + 7, file: SFX.pop, vol: 0.3, dur: 20 },
    { at: c.cut + 7, file: SFX.pop, vol: 0.3, dur: 20 },
    { at: c.reveal - 60, file: SFX.riser, vol: 0.14, dur: 150, fadeIn: 20, fadeOut: 30 }, // the shadow arrives
    ...cutHit(c.reveal),
    { at: c.reveal + 6, file: SFX.deepWhoosh, vol: 0.28, dur: 80 }, // the wide one slides in
    ...[0, 12, 24, 36, 48].map((o) => ({ at: c.taller - 10 + o, file: SFX.click, vol: 0.12, dur: 12 })), // the second bar climbs
    ...sting(c.black),
  ];
};
