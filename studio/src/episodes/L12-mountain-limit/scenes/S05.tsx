// L12 scene l05 "The mountain in the sea" (storyboard §3 "5 · The mountain in the sea": shots 5-01…5-20, script lines
// 31-40 = scene lines 0-9, families noon / petrol / void, Act II; grounding scene 2 = the Hilo pier, 5-11).
// Key art II (`l12-key-2`) = 5-04: Mauna Kea in cross-section from the sea floor, Everest ghosted beside it at the SAME
// vertical scale, each with its base labelled (flag F3).
// Numbers drawn here, each a row in episodes/L12-mountain-limit/sources.md:
//   4,205 m above the sea · ~6,000 m to the floor · 10,211 m from the floor · +1.4 km (1,362) (#13) · Everest
//   8,848.86 m above sea level (#1) · "~1 mile more, only by volcano" as an attributed dashed ghost (#10) · Pacific
//   plate ~80 km thick under Hawaii · Hilo ~2.5 mm a year · deepest reef 1,335 m, ~465,000 years, "sunk ≥ 1.3 km" (#14)
//   · Kauai ~5.5 million yr, Big Island < 0.7 million yr (#15).
// The section's vertical scale is honest (one px-per-metre for both mountains); the horizontal is compressed and the
// plate's bend is exaggerated (flag F6, pill). Maps are schematic blobs (flag F5, pill "SCHEMATIC"); the heat glyph is
// "HEAT SOURCE", never "fixed" (F7). Lava is thin cooling sheets, no column, no fountain (F4).
import React from "react";
import { useCurrentFrame } from "remotion";
import {
  Bloom,
  Bobber,
  Bubbles,
  Counter,
  Cumulus,
  Embers,
  Emissive,
  Facets,
  Family,
  Flock,
  Form,
  GroundShadow,
  HazeBand,
  Kicker,
  Layer,
  Leader,
  LightCone,
  LightWash,
  Metric,
  Motes,
  P,
  Pill,
  Puffs,
  Sky,
  Stage,
  Stars,
  Sway,
  Tick,
  alpha,
  cameraAt,
  cutPop,
  flicker,
  impact,
  lane,
  mixHex,
  pulse,
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
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";

type Pt = [number, number];
const NOON = familyOf("noon");
const PETROL = familyOf("petrol");
const VOID = familyOf("void");
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** eased 0..1 from frame `a` to frame `b` */
const ease = (f: number, a: number, b: number) => smooth(clamp01((f - a) / Math.max(1, b - a)));

// ---------------------------------------------------------------------------------------------------------------
// The cross-section world (5-01 … 5-10). One vertical scale for everything: S px per metre (flag F3).
const S = 0.0733; // px per metre (vertical); horizontal is compressed, as every cross-section is
const SEA_Y = 560; // the sea surface (world y)
const FLOOR_Y = SEA_Y + 6000 /* #13 */ * S; // the ocean floor ≈ 1000
const MK_SUMMIT_Y = SEA_Y - 4205 /* #13 */ * S; // ≈ 252
const MK_X = 760;
const EV_X = 1330; // Everest's ghost, standing on the sea line (its base is sea level, #1)
const EV_TOP_Y = SEA_Y - HEIGHTS.everest /* #1 */ * S; // ≈ -89
const MILE = 1609; // m; "about a mile" (#10)

/** Mauna Kea's profile: a shield (flat-ish top, flanks steepening toward the base), with three small cinder cones at
 *  the summit. Left half-width 760 px, right 700 px. `sink` lowers the whole mountain (5-09, the island subsides). */
const shieldPts = (sink = 0): Pt[] => {
  const pts: Pt[] = [];
  const H = FLOOR_Y - MK_SUMMIT_Y;
  for (let i = 0; i <= 40; i++) {
    const u = -1 + (2 * i) / 40;
    const hw = u < 0 ? 760 : 700;
    let y = MK_SUMMIT_Y + H * Math.pow(Math.abs(u), 1.9);
    // cinder cones on the summit plateau (Mauna Kea's summit is a cluster of cones, #16; schematic)
    const cone = (c: number, w: number, h: number) => (Math.abs(u - c) < w ? h * (1 - Math.abs(u - c) / w) : 0);
    y -= cone(-0.1, 0.045, 14) + cone(0.02, 0.05, 20) + cone(0.13, 0.04, 11);
    pts.push([MK_X + u * hw, y + sink * Math.exp(-Math.pow(u * 1.1, 2))]);
  }
  return pts;
};
const shieldY = (x: number, sink = 0) => {
  const pts = shieldPts(sink);
  for (let i = 0; i < pts.length - 1; i++) if (x >= pts[i][0] && x <= pts[i + 1][0]) return lerp(pts[i][1], pts[i + 1][1], (x - pts[i][0]) / (pts[i + 1][0] - pts[i][0]));
  return FLOOR_Y;
};

/** Everest's ghost (height comparison only, flag F11: drawn narrow, no width claimed). Base on the sea line. */
const everestPts = (): Pt[] => [
  [EV_X - 170, SEA_Y],
  [EV_X - 120, SEA_Y - 160],
  [EV_X - 80, SEA_Y - 300],
  [EV_X - 36, SEA_Y - 470],
  [EV_X - 10, EV_TOP_Y + 26],
  [EV_X, EV_TOP_Y],
  [EV_X + 14, EV_TOP_Y + 30],
  [EV_X + 46, SEA_Y - 440],
  [EV_X + 90, SEA_Y - 250],
  [EV_X + 150, SEA_Y],
];

const ROCK = mixHex(L12_COLORS.slate, "#5B4A3A", 0.35); // basalt shield, warm slate
const ROCK_WET = mixHex(ROCK, PETROL.near, 0.45);

/**
 * The section world. `f` = shot frame; `light` degrees; `floorBar` 0..1 grows the in-world ruler from the floor to the
 * summit (5-03); `everest` 0..1 fades the ghost in (5-04); `sink` px of subsidence + `bend` px of plate bow (5-08/09);
 * `plate` 0..1 reveals the Pacific-plate slab under the floor; `wide` draws the far planes for the pull-back.
 */
const Section: React.FC<{
  f: number;
  light?: number;
  floorBar?: number;
  everest?: number;
  sink?: number;
  bend?: number;
  plate?: number;
  shafts?: number;
  children?: React.ReactNode;
}> = ({ f, light = 200, floorBar = 0, everest = 0, sink = 0, bend = 0, plate = 0, shafts = 1, children }) => {
  const F = NOON;
  const pts = shieldPts(sink);
  const d = ridgePath(pts, FLOOR_Y + bend + 40, 18);
  const ev = everestPts();
  const swell = seaSurface(f, -1200, 3200, SEA_Y, 5, 260, 1.2, SEA_Y + 34, 40);
  // the floor and the plate bow under the island: y += bend × a bell around the island
  const bow = (x: number) => bend * Math.exp(-Math.pow((x - MK_X) / 820, 2));
  const floorLine = (y0: number) => {
    const s: string[] = [];
    for (let x = -1200; x <= 3200; x += 80) s.push(`${x} ${(y0 + bow(x)).toFixed(1)}`);
    return s;
  };
  const floorD = `M${floorLine(FLOOR_Y).join(" L")} L3200 1900 L-1200 1900 Z`;
  const slabTop = floorLine(FLOOR_Y + 46);
  const slabBot = floorLine(FLOOR_Y + 46 + 170).reverse();
  const slabD = `M${slabTop.join(" L")} L${slabBot.join(" L")} Z`;
  const barTop = lerp(FLOOR_Y, MK_SUMMIT_Y, floorBar);
  const barX = MK_X - 420;
  return (
    <>
      <Layer depth={0.05}>
        <Sky family={F} />
        <Bloom x={300} y={150} r={720} color={F.light} strength={0.5} spread={0.3} />
        <Bloom x={300} y={150} r={150} color="#FFF6D8" strength={0.95} spread={0.45} core={44} coreColor="#FFFBEA" />
      </Layer>
      <Layer depth={0.22} haze={{ color: F.haze, amount: 0.35 }}>
        <Cumulus x={-120} y={300} w={520} h={120} fill="#F7F1E4" shade={mixHex("#F7F1E4", F.shadow, 0.3)} lit="#FFFFFF" light={light} seed={4} frame={f} />
        <Cumulus x={1500 - f * 0.12} y={250} w={620} h={150} fill="#F7F1E4" shade={mixHex("#F7F1E4", F.shadow, 0.3)} lit="#FFFFFF" light={light} seed={9} frame={f} lobes={4} />
        {/* the rest of the island, far and hazed, low on the horizon */}
        <path d={ridgePath([[-900, SEA_Y], [-500, SEA_Y - 60], [-200, SEA_Y - 110], [160, SEA_Y - 70], [420, SEA_Y - 30], [600, SEA_Y]], SEA_Y + 20, 30)} fill={F.far} />
        <HazeBand y={SEA_Y - 140} h={140} color={F.haze} strength={0.4} />
        <Flock frame={f} x={1700} y={300} vx={-0.9} n={5} size={9} color={F.shadow} seed={5} />
      </Layer>
      <Layer depth={1}>
        {/* the sea body: bright at the surface, dark at depth */}
        <Sky stops={["#3FCDB8", "#1C8E8C", "#0E4E5C", "#082A36", "#061C26"]} x={-1200} y={SEA_Y} w={4400} h={1340} />
        {/* the Pacific plate slab (5-08/09) under a thin sediment floor */}
        <g opacity={plate}>
          <Form d={slabD} fill={mixHex(L12_COLORS.slateDark, PETROL.near, 0.3)} light={light} shadow={PETROL.shadow} inset={30} shadowOpacity={0.5} rim={PETROL.light} rimWidth={3} rimOpacity={0.5} bounce={PETROL.bounce} hard>
            {[0.3, 0.6].map((k) => (
              <path key={k} d={`M${floorLine(FLOOR_Y + 46 + 170 * k).join(" L")}`} fill="none" stroke={PETROL.shadow} strokeWidth={1.5} opacity={0.35} />
            ))}
          </Form>
          <Sky stops={["#0C2E3A", "#2A1810"]} x={-1200} y={FLOOR_Y + 216} w={4400} h={900} />
        </g>
        {/* the floor */}
        <path d={floorD} fill="#0A2C36" />
        <path d={`M${floorLine(FLOOR_Y).join(" L")}`} fill="none" stroke="#2FBFA8" strokeWidth={2} opacity={0.35} />
        {/* the mountain, one Form: lit flank, shade flank, base */}
        <Form d={d} fill={ROCK} light={light} shadow={PETROL.shadow} inset={34} shadowOpacity={0.5} rim={F.light} rimWidth={4} rimOpacity={0.8} bounce={F.bounce}>
          <Facets pts={pts} base={FLOOR_Y + bend + 40} light={light} fill={PETROL.shadow} opacity={0.42} />
          <Facets pts={pts} base={FLOOR_Y + bend + 40} light={light} fill={mixHex(ROCK, F.light, 0.5)} opacity={0.38} lit />
          {/* the underwater flank: wet, bluer rock, darker with depth */}
          <Sky stops={[alpha("#1FA69A", 0.45), alpha("#0E4E5C", 0.7), alpha("#061C26", 0.9)]} x={-1200} y={SEA_Y} w={4400} h={1340} />
          {/* bedding lines of the stacked flows */}
          {[0.25, 0.45, 0.65, 0.85].map((k, i) => {
            const y = MK_SUMMIT_Y + (FLOOR_Y - MK_SUMMIT_Y) * k;
            return <path key={i} d={`M${MK_X - 760 * Math.pow(k, 1 / 1.9)} ${y} Q${MK_X} ${y - 26} ${MK_X + 700 * Math.pow(k, 1 / 1.9)} ${y}`} fill="none" stroke={PETROL.shadow} strokeWidth={1.5} opacity={0.3} />;
          })}
        </Form>
        {/* light shafts from the surface (they flicker) */}
        {[-300, 60, 420, 1120, 1560, 1980].map((x, i) => (
          <LightCone key={i} x={x} y={SEA_Y + 6} angle={97 + (i % 3) * 3} length={520} spread={6 + (i % 2) * 3} color="#9FEFDC" strength={0.2 * shafts * flicker(f, 3 + i, 0.4)} />
        ))}
        {/* the sea surface: a swell band where the water meets the air */}
        <path d={swell} fill="#8FE6D6" opacity={0.85} />
        <path d={seaSurface(f + 20, -1200, 3200, SEA_Y + 1, 4, 180, -1.0, SEA_Y + 14, 40)} fill="#D8FFF4" opacity={0.5} />
        {/* plankton and bubbles on the flank */}
        <Motes frame={f} n={34} x={-200} y={SEA_Y + 60} w={2200} h={380} color="#BFF5E8" seed={12} size={2.2} drift={10} />
        <Bubbles frame={f} x0={MK_X - 520} x1={MK_X + 500} y={FLOOR_Y - 40} n={22} color="#CFF7EE" seed={5} />
        {/* Everest's ghost: height only, narrow (F11), base on the sea line, a vermilion summit dot */}
        <g opacity={everest}>
          <Form d={roundPoly(ev, 10)} fill={alpha(familyOf("dusk").mid, 0.62)} light={light} shadow={PETROL.shadow} inset={20} shadowOpacity={0.4} rim={F.light} rimWidth={3} rimOpacity={0.6} hard>
            <path d={roundPoly([ev[3], ev[4], ev[5], ev[6], ev[7], [EV_X + 70, SEA_Y - 330], [EV_X - 70, SEA_Y - 330]], 8)} fill={alpha(L12_COLORS.snow, 0.8)} />
          </Form>
          <circle cx={EV_X} cy={EV_TOP_Y + 2} r={8 + Math.sin(f / 9) * 1.5} fill={P.vermilion} />
          <circle cx={EV_X} cy={EV_TOP_Y + 2} r={12 + ((f * 0.5) % 20)} fill="none" stroke={P.vermilion} strokeWidth={2} opacity={1 - ((f * 0.5) % 20) / 20} />
        </g>
        {/* the in-world ruler from the floor (5-03): sea-glass, ticks every 2 km, its top follows the Counter */}
        {floorBar > 0 ? (
          <g>
            <line x1={barX} y1={FLOOR_Y} x2={barX} y2={barTop} stroke={L12_COLORS.seaGlass} strokeWidth={10} strokeLinecap="butt" />
            <line x1={barX - 24} y1={FLOOR_Y} x2={barX + 24} y2={FLOOR_Y} stroke={L12_COLORS.seaGlass} strokeWidth={4} />
            {[2000, 4000, 6000, 8000, 10000].map((m) => {
              const y = FLOOR_Y - m * S;
              return y >= barTop ? <line key={m} x1={barX - 14} y1={y} x2={barX + 14} y2={y} stroke={L12_COLORS.seaGlass} strokeWidth={3} /> : null;
            })}
            <path d={`M${barX - 16} ${barTop} L${barX + 16} ${barTop} L${barX} ${barTop - 18} Z`} fill={L12_COLORS.seaGlass} />
          </g>
        ) : null}
        {children}
      </Layer>
    </>
  );
};

/** The HUD for the section shots: the gauge with one or two bars, each base labelled (F3). */
const SectionHud: React.FC<{ F: Family; mk: number; everest?: boolean; mkBar?: number; ghostMile?: boolean; readout?: string | false }> = ({ F, mk, everest = false, mkBar, ghostMile = false, readout }) => (
  <L12Gauge
    family={F}
    value={everest ? HEIGHTS.everest /* #1 */ : mk}
    max={12000}
    base={everest ? "ABOVE SEA LEVEL" : "ABOVE SEA LEVEL"}
    readout={readout}
    rolling={!everest}
    bars={[
      ...(mkBar !== undefined && mkBar > 0 ? [{ value: mkBar, color: L12_COLORS.seaGlass, base: "FROM THE SEA FLOOR" }] : []),
      ...(ghostMile ? [{ value: HEIGHTS.everest + MILE /* #10: "about a mile more", attributed */, color: F.text, dashed: true }] : []),
    ]}
  />
);

// ---------------------------------------------------------------------------------------------------------------
export const cuesL05 = (t: SceneTiming) => {
  const { at, p, end, frac } = cueKit(t);
  return {
    descent: 0, // 5-01 → 5-02 → 5-03: one continuous descent (PUSH, PUSH)
    rise: p(0, "four thousand", -6), // the HUD counter rolls up to 4,205 m (#13)
    shore: p(0, "But the mountain"), // the camera passes the shoreline
    deep: at(1), // "It carries on down another six thousand metres" (#13)
    floorBar: p(1, "six thousand", -4), // the floor ruler starts to rise
    wide: p(1, "Base to summit"), // 5-04 (CUT): the whole section, Everest ghosted at the same scale (F3)
    bracket: p(1, "well over"), // the +1.4 km bracket (#13)
    summit: at(2), // 5-05: Tick on the summit shrugs
    sheet: p(2, "It's a volcano"), // 5-06a: the first sheet arrives
    stack: p(2, "one lava flow"), // 5-06b: the stack
    mile: at(3), // 5-07: the attributed "+1 mile?" ghost bar (#10)
    onlyWay: p(3, "only this way"), // Tick raises a finger
    plate: at(4), // 5-08: the Pacific plate (#14)
    bends: p(4, "So it bends"), // 5-09: the slab bows (exaggerated, F6)
    tilt: p(4, "The whole island"), // 5-10: Tick on the shore, the spirit level
    hilo: at(5), // 5-11: grounding scene 2 (#14)
    line: p(5, "Offshore"), // 5-12: Tick lowers the weighted line
    reefs: at(6), // 5-13: the reef staircase (#14)
    deepest: p(6, "thirteen hundred", -4), // the 1,335 m tag (#14)
    sinking: p(6, "still going", -10), // 5-14: the bracket + STILL SINKING
    map: at(7), // 5-15: the chain from above (#15, F5, F7)
    cutOff: p(7, "Cut off"), // 5-16: the thread thins
    chain: p(7, "Up the chain"), // 5-17: the two age tags (#15)
    seamounts: at(8), // 5-18: beyond Kauai, Tick's boots get wet
    stamps: at(9), // 5-19: SINKS, CARRIED OFF
    stamp1: p(9, "sinks under"),
    stamp2: p(9, "carried off"),
    pebble: p(9, "Gravity still"), // 5-20: the sinking pebble gag
    end: t.frames,
    last: end(9),
    f: frac,
  };
};
type C = ReturnType<typeof cuesL05>;

// ---- 5-01 → 5-03: the descent ---------------------------------------------------------------------------------
const ShotDescent: ShotFC<C> = ({ f, len, c }) => {
  const F = NOON;
  const tShore = c.shore - c.descent;
  const tDeep = c.deep - c.descent;
  const cam = cameraAt(f, [
    { f: 0, x: 820, y: 330, zoom: 1.75 },
    { f: tShore, x: 700, y: 470, zoom: 1.6 },
    { f: tDeep + 40, x: 560, y: 860, zoom: 1.45 },
    { f: len, x: 600, y: 780, zoom: 1.25 },
  ]);
  const rise = ease(f, c.rise, c.rise + 70);
  const mk = 4205 /* #13 */ * rise;
  const barT = ease(f, c.floorBar - c.descent, c.floorBar - c.descent + 150);
  const floorBar = barT; // 0..1 of the way floor → summit
  const barM = 10211 /* #13 */ * barT;
  const under = clamp01((cam.y - SEA_Y) / 300); // how far under the surface the camera is
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.12 + under * 0.14} grain={0.5}>
      <Section f={f} floorBar={floorBar}>
        <Puffs frame={f} x={MK_X + 200} y={MK_SUMMIT_Y + 60} color={alpha("#FFFFFF", 0.5)} period={90} size={10} rise={0.3} drift={0.5} life={80} seed={3} />
      </Section>
      <Layer depth={1.3}>
        {/* a near flank spur frames the deep part of the move */}
        <path d={ridgePath([[-500, 1500], [-200, 1200], [60, 1130], [320, 1180], [600, 1300], [900, 1500]], 1900, 40)} fill={PETROL.near} opacity={under} />
      </Layer>
      <Layer depth={0}>
        {floorBar > 0 ? (
          <g>
            <rect x={120} y={822} width={300} height={66} rx={8} fill={alpha(PETROL.shadow, 0.6)} />
            <Counter x={270} y={870} value={barM} max={10211} size={40} color={F.text} unit="m" align="middle" />
            <Pill x={120} y={930} text="FROM THE SEA FLOOR" fill={pillFill(F)} color={F.text} dot={L12_COLORS.seaGlass} size={16} />
          </g>
        ) : null}
        <SectionHud F={F} mk={mk} mkBar={barM} readout={rise >= 1 && barT === 0 ? "4,205 m" : undefined} />
      </Layer>
    </Stage>
  );
};

// ---- 5-04: the whole section, Everest ghosted beside it (KEY ART II) ------------------------------------------
const ShotWide: ShotFC<C> = ({ f, c }) => {
  const F = NOON;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.0 },
    { f: 50, x: 960, y: 470, zoom: 0.8 },
    { f: 400, x: 980, y: 460, zoom: 0.76 },
  ]);
  const ev = ease(f, 8, 40);
  const br = ease(f, c.bracket - c.wide, c.bracket - c.wide + 24);
  const pop = cutPop(f, 0);
  // the +1.4 km bracket sits beside the HUD bars, between the two tops (both share the ruler's zero, #13)
  const gy = (m: number) => 160 + 560 - (m / 12000) * 560;
  return (
    <Stage theme={F.theme} cam={{ ...cam, zoom: cam.zoom * pop }} vignette={0.14} grain={0.5}>
      <Section f={f} floorBar={1} everest={ev} shafts={1.1}>
        <Puffs frame={f} x={MK_X + 200} y={MK_SUMMIT_Y + 60} color={alpha("#FFFFFF", 0.5)} period={90} size={10} rise={0.3} drift={0.5} life={80} seed={3} />
      </Section>
      <Layer depth={1.3}>
        <path d={ridgePath([[-700, 1500], [-300, 1240], [-40, 1190], [260, 1230], [560, 1340], [900, 1500]], 1900, 40)} fill={PETROL.near} />
      </Layer>
      <Layer depth={0}>
        <g opacity={ev}>
          <Pill x={120} y={128} text="EVEREST · 8,849 m ABOVE SEA" fill={pillFill(F)} color={F.text} dot={P.vermilion} size={18} />
          <Pill x={120} y={176} text="MAUNA KEA · 10,211 m FROM THE FLOOR" fill={pillFill(F)} color={F.text} dot={L12_COLORS.seaGlass} size={18} />
        </g>
        <SectionHud F={F} everest mk={0} mkBar={10211 /* #13 */} />
        <g opacity={br}>
          <path d={`M1842 ${gy(HEIGHTS.everest)} L1862 ${gy(HEIGHTS.everest)} L1862 ${gy(10211)} L1842 ${gy(10211)}`} fill="none" stroke={F.text} strokeWidth={2.5} />
          <Metric x={1870} y={(gy(HEIGHTS.everest) + gy(10211)) / 2 + 12} value="+1.4" unit="km" size={30} color={F.text} align="end" />
        </g>
      </Layer>
    </Stage>
  );
};

// ---- 5-05: Tick on the summit shrugs (Tick large) ---------------------------------------------------------------
const ShotShrug: ShotFC<C> = ({ f }) => {
  const F = NOON;
  const cam = cameraAt(f, [
    { f: 0, x: 790, y: 190, zoom: 2.7 },
    { f: 140, x: 800, y: 180, zoom: 2.95 },
  ]);
  const pt = clamp01((f - 14) / 28) * 1.6;
  return (
    <Stage theme={F.theme} cam={cam} vignette={0.1} grain={0.5}>
      <Section f={f} floorBar={0} shafts={0}>
        <GroundShadow x={MK_X + 14} y={MK_SUMMIT_Y - 18} rx={44} color={PETROL.shadow} opacity={0.4} blur={4} />
        <Tick x={MK_X + 12} y={MK_SUMMIT_Y - 19} pxPerM={110} frame={f} pose="stand" poseTo="shrug" poseT={pt} expression="thinking" expressionTo="thinking" look={-0.3} facing={-1} outline={PETROL.shadow} staff />
        <Puffs frame={f} x={MK_X - 8} y={MK_SUMMIT_Y - 165} color={alpha("#FFFFFF", 0.55)} period={70} size={7} rise={0.35} drift={-0.4} life={60} seed={4} />
      </Section>
      <Layer depth={0}>
        <SectionHud F={F} everest mk={0} mkBar={10211 /* #13 */} />
      </Layer>
    </Stage>
  );
};

// ---- 5-06a / 5-06b: the sheets (lava flows as thin cooling sheets, F4) -------------------------------------------
/** A flow sheet on the upper right flank: born amber (Emissive), cools to slate over `cool` frames. */
const Sheet: React.FC<{ f: number; born: number; i: number; light: number }> = ({ f, born, i, light }) => {
  const age = f - born;
  if (age < 0) return null;
  const arrive = ease(age, 0, 26);
  const cool = clamp01((age - 20) / 70);
  const x0 = MK_X + 40 + (i % 2) * 30;
  const slope = 0.3;
  const y0 = shieldY(x0) - 6 - i * 9;
  const L = 260 - (i % 3) * 30;
  const x = x0 + (1 - arrive) * -90;
  const y = y0 - (1 - arrive) * 40;
  const dd = roundPoly(
    [
      [x, y],
      [x + L, y + L * slope],
      [x + L + 6, y + L * slope + 9],
      [x + L - 10, y + L * slope + 12],
      [x + 10, y + 13],
      [x - 6, y + 6],
    ],
    5,
  );
  const col = mixHex(L12_COLORS.amber, L12_COLORS.slateDark, cool);
  return (
    <g>
      {cool < 1 ? <Emissive d={dd} color={L12_COLORS.amber} core={mixHex("#FFD28A", col, cool)} fill strength={1 - cool} glow={16} /> : null}
      <Form d={dd} fill={col} light={light} shadow={PETROL.shadow} inset={5} shadowOpacity={0.5} rim={mixHex(NOON.light, L12_COLORS.amber, 1 - cool)} rimWidth={1.5} rimOpacity={0.7} hard opacity={cool > 0 ? 1 : 0.0} />
      {cool < 1 ? <Embers frame={f} x0={x + 20} x1={x + L - 20} y={y + 4} n={10} color="#FFC070" seed={i + 3} rise={0.5} life={50} size={1.6} /> : null}
    </g>
  );
};
const ShotSheet: ShotFC<C> = ({ f }) => {
  const F = NOON;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 300, zoom: 3.0 },
    { f: 120, x: 980, y: 290, zoom: 3.2 },
  ]);
  return (
    <Stage theme={F.theme} cam={{ ...cam, zoom: cam.zoom * cutPop(f, 0) }} vignette={0.1} grain={0.5}>
      <Section f={f} shafts={0}>
        <Sheet f={f} born={6} i={0} light={200} />
      </Section>
      <Layer depth={0}>
        <SectionHud F={F} everest mk={0} mkBar={10211 /* #13 */} />
      </Layer>
    </Stage>
  );
};
const ShotStack: ShotFC<C> = ({ f, len }) => {
  const F = NOON;
  const n = 6;
  const gap = Math.max(26, Math.floor((len - 30) / n));
  const cam = cameraAt(f, [
    { f: 0, x: 1000, y: 330, zoom: 2.2 },
    { f: len, x: 990, y: 280, zoom: 2.35 },
  ]);
  return (
    <Stage theme={F.theme} cam={{ ...cam, zoom: cam.zoom * cutPop(f, 0) }} vignette={0.1} grain={0.5}>
      <Section f={f} shafts={0}>
        {Array.from({ length: n }, (_, i) => (
          <Sheet key={i} f={f} born={i * gap} i={i + 1} light={200} />
        ))}
      </Section>
      <Layer depth={0}>
        <Pill x={120} y={128} text="ONE FLOW AT A TIME" fill={pillFill(F)} color={F.text} dot={L12_COLORS.amber} size={18} />
        <SectionHud F={F} everest mk={0} mkBar={10211 /* #13 */} />
      </Layer>
    </Stage>
  );
};

// ---- 5-07: the attributed "+1 mile?" ghost bar; Tick raises a finger --------------------------------------------
const ShotMile: ShotFC<C> = ({ f, c }) => {
  const F = NOON;
  const cam = cameraAt(f, [
    { f: 0, x: 980, y: 300, zoom: 1.7 },
    { f: 240, x: 1000, y: 290, zoom: 1.82 },
  ]);
  const tx = MK_X + 250;
  const ty = shieldY(tx) - 4;
  const pt = clamp01((f - (c.onlyWay - c.mile)) / 26) * 1.6;
  const ghost = ease(f, 12, 36);
  return (
    <Stage theme={F.theme} cam={{ ...cam, zoom: cam.zoom * cutPop(f, 0) }} vignette={0.1} grain={0.5}>
      <Section f={f} shafts={0}>
        {Array.from({ length: 6 }, (_, i) => (
          <Sheet key={i} f={1000} born={0} i={i + 1} light={200} />
        ))}
        <GroundShadow x={tx + 8} y={ty + 2} rx={60} color={PETROL.shadow} opacity={0.4} blur={4} />
        <Tick x={tx} y={ty} pxPerM={160} frame={f} pose="stand" poseTo="point" poseT={pt} expression="neutral" expressionTo="proud" expressionT={pt} look={0.6} facing={1} outline={PETROL.shadow} staff tilt={-8} />
      </Section>
      <Layer depth={0}>
        <g opacity={ghost}>
          <Kicker x={120} y={128} text="— ONE GEOPHYSICIST'S GUESS" color={F.dim} size={22} />
          <Pill x={120} y={178} text="~1 MILE MORE · ONLY BY VOLCANO" fill={pillFill(F)} color={F.text} size={18} />
        </g>
        <SectionHud F={F} everest mk={0} mkBar={10211 /* #13 */} ghostMile={ghost > 0.5} />
      </Layer>
    </Stage>
  );
};

// ---- 5-08 → 5-09: the Pacific plate, and the bend (exaggerated, F6) ---------------------------------------------
const ShotPlate: ShotFC<C> = ({ f, c, len }) => {
  const F = PETROL;
  const tb = c.bends - c.plate;
  const cam = cameraAt(f, [
    { f: 0, x: 800, y: 700, zoom: 0.78 },
    { f: 70, x: 780, y: 800, zoom: 0.6 },
    { f: len, x: 760, y: 820, zoom: 0.56 },
  ]);
  const plate = ease(f, 10, 50);
  const bend = 70 * ease(f, tb, tb + 70);
  const sink = bend * 0.9;
  const pop = cutPop(f, 0);
  const ticksOn = ease(f, tb + 20, tb + 50);
  return (
    <Stage theme={F.theme} cam={{ ...cam, zoom: cam.zoom * pop }} vignette={0.26} grain={0.5}>
      <Section f={f} plate={plate} bend={bend} sink={sink} shafts={0.6}>
        {/* tick marks along the slab show the bow (F6: exaggerated, no depth number) */}
        <g opacity={ticksOn}>
          {Array.from({ length: 17 }, (_, i) => {
            const x = MK_X - 1600 + i * 200;
            const y = FLOOR_Y + 46 + bend * Math.exp(-Math.pow((x - MK_X) / 820, 2));
            return <line key={i} x1={x} y1={y - 14} x2={x} y2={y + 14} stroke={F.light} strokeWidth={3} opacity={0.75} />;
          })}
        </g>
        {/* the ~80 km bracket on the slab (#14) */}
        <g opacity={plate}>
          <path d={`M${MK_X + 1500} ${FLOOR_Y + 46 + 4} L${MK_X + 1540} ${FLOOR_Y + 46 + 4} L${MK_X + 1540} ${FLOOR_Y + 212} L${MK_X + 1500} ${FLOOR_Y + 212}`} fill="none" stroke={F.text} strokeWidth={3} />
        </g>
      </Section>
      <Layer depth={0}>
        <g opacity={plate}>
          <Metric x={1520} y={930} value="80" unit="km" size={60} color={F.text} align="end" />
          <Pill x={1520} y={972} text="PACIFIC PLATE · UNDER HAWAII" fill={pillFill(F)} color={F.text} dot={L12_COLORS.slate} size={17} align="end" />
        </g>
        <g opacity={ticksOn}>
          <Pill x={120} y={128} text="BEND EXAGGERATED" fill={pillFill(F)} color={F.text} size={18} />
        </g>
        <SectionHud F={F} everest mk={0} mkBar={10211 /* #13 */} />
      </Layer>
    </Stage>
  );
};

// ---- 5-10: Tick on the shore leans at the tilt; the spirit-level bubble drifts -----------------------------------
const ShotTilt: ShotFC<C> = ({ f }) => {
  const F = NOON;
  const sx = MK_X - 470; // the western shoreline
  const sy = shieldY(sx) - 2;
  const cam = cameraAt(f, [
    { f: 0, x: sx + 40, y: sy - 80, zoom: 2.4 },
    { f: 150, x: sx + 60, y: sy - 90, zoom: 2.55 },
  ]);
  const tilt = 2.2 * ease(f, 0, 110); // degrees: the ground tips toward the sea
  const bub = 36 * ease(f, 20, 110);
  const pt = clamp01((f - 10) / 28) * 1.6;
  return (
    <Stage theme={F.theme} cam={{ ...cam, zoom: cam.zoom * cutPop(f, 0) }} vignette={0.1} grain={0.5}>
      <Section f={f} sink={tilt * 10} shafts={0.5}>
        <g transform={`rotate(${tilt} ${sx} ${sy})`}>
          <GroundShadow x={sx + 30} y={sy + 2} rx={60} color={PETROL.shadow} opacity={0.4} blur={4} />
          <Tick x={sx + 20} y={sy} pxPerM={150} frame={f} pose="stand" poseTo="lean" poseT={pt} expression="thinking" expressionTo="worried" expressionT={pt} look={0.7} facing={1} outline={PETROL.shadow} />
          {/* the spirit level on the rock: a tube, its bubble drifting off centre */}
          <g transform={`translate(${sx + 90} ${sy - 12})`}>
            <rect x={-60} y={-10} width={120} height={20} rx={6} fill={L12_COLORS.slateDark} />
            <rect x={-44} y={-6} width={88} height={12} rx={6} fill="#CFF7EE" />
            <line x1={-9} y1={-8} x2={-9} y2={8} stroke={L12_COLORS.slateDark} strokeWidth={2} />
            <line x1={9} y1={-8} x2={9} y2={8} stroke={L12_COLORS.slateDark} strokeWidth={2} />
            <ellipse cx={bub} cy={0} rx={10} ry={5} fill="#FFFFFF" opacity={0.9} />
          </g>
        </g>
        <Puffs frame={f} x={sx - 10} y={sy - 230} color={alpha("#FFFFFF", 0.5)} period={80} size={6} rise={0.3} drift={0.4} life={60} seed={6} />
      </Section>
      <Layer depth={0}>
        <SectionHud F={F} everest mk={0} mkBar={10211 /* #13 */} />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// 5-11 / 5-12: Hilo (grounding scene 2). A different world: a sunlit harbour, a pier, Tick large with a tide staff.
const H_SEA = 700;
const Harbour: React.FC<{ f: number; light?: number; children?: React.ReactNode; water?: number }> = ({ f, light = 200, children, water = 0 }) => {
  const F = NOON;
  const palm = (x: number, y: number, h: number, seed: number, flip = 1) => (
    <Sway key={seed} frame={f} x={x} y={y} amp={1.6} period={150} seed={seed}>
      <path d={`M${x} ${y} Q${x + 30 * flip} ${y - h * 0.5} ${x + 20 * flip} ${y - h}`} fill="none" stroke={F.near} strokeWidth={14} strokeLinecap="round" />
      {Array.from({ length: 7 }, (_, i) => {
        const a = -Math.PI * 0.95 + (i * Math.PI) / 6;
        const tx = x + 20 * flip;
        const ty = y - h;
        return <path key={i} d={`M${tx} ${ty} Q${tx + Math.cos(a) * 70} ${ty + Math.sin(a) * 50 - 20} ${tx + Math.cos(a) * 130} ${ty + Math.sin(a) * 90 + 30}`} fill="none" stroke={F.near} strokeWidth={9} strokeLinecap="round" />;
      })}
    </Sway>
  );
  const boats = lane(f, 2, -200, 2100, 0.25, 4, -1);
  return (
    <>
      <Layer depth={0.05}>
        <Sky family={F} />
        <Bloom x={260} y={140} r={700} color={F.light} strength={0.5} spread={0.3} />
        <Bloom x={260} y={140} r={150} color="#FFF6D8" strength={0.95} spread={0.45} core={44} coreColor="#FFFBEA" />
      </Layer>
      <Layer depth={0.25} haze={{ color: F.haze, amount: 0.4 }}>
        {/* the mountain behind the town, soft in the haze: Mauna Kea's long shield on the horizon */}
        <path d={ridgePath([[-800, H_SEA - 60], [0, H_SEA - 200], [700, H_SEA - 330], [1500, H_SEA - 230], [2500, H_SEA - 80]], H_SEA + 10, 60)} fill={F.far} />
        <Cumulus x={900} y={330} w={560} h={130} fill="#F7F1E4" shade={mixHex("#F7F1E4", F.shadow, 0.3)} lit="#FFFFFF" light={light} seed={7} frame={f} />
        <Cumulus x={-100 + f * 0.1} y={400} w={400} h={90} fill="#F7F1E4" shade={mixHex("#F7F1E4", F.shadow, 0.3)} lit="#FFFFFF" light={light} seed={2} frame={f} lobes={3} />
        <HazeBand y={H_SEA - 150} h={150} color={F.haze} strength={0.45} />
        <Flock frame={f} x={1600} y={380} vx={-0.8} n={6} size={9} color={F.shadow} seed={8} />
      </Layer>
      <Layer depth={0.5} haze={{ color: F.haze, amount: 0.15 }}>
        {/* the town: a row of low roofs along the shore, mid plane */}
        {Array.from({ length: 9 }, (_, i) => {
          const x = -200 + i * 230 + rnd(i) * 40;
          const w = 150 + rnd(i + 9) * 60;
          const h = 40 + rnd(i + 3) * 36;
          return (
            <g key={i}>
              <rect x={x} y={H_SEA - 40 - h} width={w} height={h} fill={mixHex(F.mid, "#F2E6CC", 0.45)} />
              <path d={`M${x - 8} ${H_SEA - 40 - h} L${x + w / 2} ${H_SEA - 40 - h - 34} L${x + w + 8} ${H_SEA - 40 - h} Z`} fill={mixHex(F.mid, F.shadow, 0.35)} />
            </g>
          );
        })}
        <rect x={-800} y={H_SEA - 44} width={3400} height={60} fill={mixHex(F.mid, F.shadow, 0.2)} />
        {/* boats bobbing in the harbour */}
        {boats.map((b) => (
          <Bobber key={b.i} frame={f} x={b.x} y={H_SEA} amp={3} roll={2.5} period={120} seed={b.i + 2}>
            <path d={`M${b.x - 40} ${H_SEA - 2} L${b.x + 44} ${H_SEA - 2} L${b.x + 30} ${H_SEA + 14} L${b.x - 30} ${H_SEA + 14} Z`} fill={L12_COLORS.slateDark} />
            <rect x={b.x - 4} y={H_SEA - 60} width={4} height={58} fill={L12_COLORS.slateDark} />
            <path d={`M${b.x + 2} ${H_SEA - 58} L${b.x + 30} ${H_SEA - 14} L${b.x + 2} ${H_SEA - 14} Z`} fill="#F7F1E4" />
          </Bobber>
        ))}
      </Layer>
      <Layer depth={1}>
        {/* the harbour water: swell, glitter, the water column below */}
        <Sky stops={["#3FCDB8", "#1C8E8C", "#0E4E5C", "#082A36"]} x={-800} y={H_SEA - water} w={3400} h={1500} />
        <path d={seaSurface(f, -800, 2600, H_SEA - water, 4, 220, 1.1, H_SEA + 30 - water, 40)} fill="#8FE6D6" opacity={0.85} />
        <path d={seaSurface(f + 15, -800, 2600, H_SEA + 1 - water, 3, 150, -0.9, H_SEA + 12 - water, 40)} fill="#D8FFF4" opacity={0.5} />
        <Motes frame={f} n={26} x={0} y={H_SEA + 40} w={1900} h={500} color="#BFF5E8" seed={14} size={2.2} drift={10} />
        {children}
      </Layer>
      <Layer depth={1.3}>
        {palm(140, 1120, 520, 1, 1)}
        {palm(1840, 1140, 460, 2, -1)}
      </Layer>
    </>
  );
};

/** The pier: planks on piles from the right edge, the tide staff bolted to the near pile. */
const Pier: React.FC<{ f: number; water: number; children?: React.ReactNode }> = ({ f, water, children }) => {
  const F = NOON;
  const deck = H_SEA - 120;
  const px = 980; // the pier's seaward end
  const wood = mixHex("#8C6A4A", F.shadow, 0.1);
  const woodLit = mixHex("#8C6A4A", F.light, 0.3);
  return (
    <g>
      {[px + 40, px + 300, px + 560, px + 820].map((x, i) => (
        <g key={i}>
          <rect x={x - 14} y={deck} width={28} height={300} fill={mixHex(wood, F.shadow, 0.4)} />
          <rect x={x - 14} y={deck} width={10} height={300} fill={woodLit} opacity={0.5} />
          <ellipse cx={x} cy={H_SEA - water} rx={40} ry={8} fill="none" stroke="#D8FFF4" strokeWidth={2} opacity={0.5 + 0.3 * Math.sin(f / 20 + i)} />
        </g>
      ))}
      <rect x={px} y={deck - 22} width={1200} height={22} fill={woodLit} />
      <rect x={px} y={deck} width={1200} height={16} fill={wood} />
      {Array.from({ length: 24 }, (_, i) => (
        <line key={i} x1={px + 20 + i * 50} y1={deck - 22} x2={px + 20 + i * 50} y2={deck} stroke={F.shadow} strokeWidth={1.5} opacity={0.35} />
      ))}
      {/* railing */}
      <rect x={px} y={deck - 110} width={1200} height={8} fill={wood} />
      {Array.from({ length: 7 }, (_, i) => (
        <rect key={i} x={px + 6 + i * 190} y={deck - 110} width={8} height={88} fill={wood} />
      ))}
      {/* the tide staff on the near pile: striped like the gauge, metre marks, a sliding water mark */}
      <g>
        <rect x={px + 26} y={deck + 10} width={28} height={330} fill="#F7F1E4" />
        {Array.from({ length: 11 }, (_, i) => (
          <rect key={i} x={px + 26} y={deck + 10 + i * 30} width={28} height={15} fill={i % 2 ? L12_COLORS.slateDark : "#F7F1E4"} />
        ))}
        <rect x={px + 22} y={H_SEA - water - 3} width={36} height={6} fill={P.vermilion} />
      </g>
      {children}
    </g>
  );
};

const ShotHilo: ShotFC<C> = ({ f, len }) => {
  const F = NOON;
  const cam = cameraAt(f, [
    { f: 0, x: 1120, y: 600, zoom: 1.5 },
    { f: len, x: 1100, y: 590, zoom: 1.62 },
  ]);
  const water = 6 * (f / Math.max(1, len)); // the water line creeps up the staff (schematic, the rate is the Counter)
  const deck = H_SEA - 120;
  const rate = 2.5 /* #14 */ * ease(f, 20, 90);
  return (
    <Stage theme={F.theme} cam={{ ...cam, zoom: cam.zoom * cutPop(f, 0) }} vignette={0.1} grain={0.5}>
      <Harbour f={f} water={water}>
        <Pier f={f} water={water}>
          <GroundShadow x={1120} y={deck - 20} rx={60} color={F.shadow} opacity={0.35} blur={4} />
          <Tick x={1110} y={deck - 22} pxPerM={200} frame={f} pose="crouch-reach" expression="thinking" look={0.9} facing={-1} outline={F.shadow} />
        </Pier>
      </Harbour>
      <Layer depth={0}>
        <Pill x={120} y={128} text="HILO" fill={pillFill(F)} color={F.text} dot={P.vermilion} size={18} />
        <g opacity={ease(f, 20, 40)}>
          <rect x={120} y={162} width={330} height={74} rx={8} fill={alpha(F.shadow, 0.55)} />
          <text x={140} y={214} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 44, fontVariantNumeric: "tabular-nums", fill: F.text }}>
            {rate.toFixed(1)}
          </text>
          <text x={226} y={214} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 22, fill: F.text }}>
            mm a year, down
          </text>
        </g>
      </Layer>
    </Stage>
  );
};

const ShotLine: ShotFC<C> = ({ f, len }) => {
  const F = NOON;
  const deck = H_SEA - 120;
  const drop = ease(f, 20, len) * 700;
  const cam = cameraAt(f, [
    { f: 0, x: 1080, y: 620, zoom: 1.4 },
    { f: 30, x: 1080, y: 640, zoom: 1.4 },
    { f: len, x: 1060, y: 640 + drop * 0.9, zoom: 1.5 },
  ]);
  const under = clamp01((cam.y - H_SEA) / 250);
  const pt = clamp01((f - 4) / 26) * 1.6;
  return (
    <Stage theme={F.theme} cam={{ ...cam, zoom: cam.zoom * cutPop(f, 0) }} vignette={0.1 + under * 0.2} grain={0.5}>
      <Harbour f={f} water={6}>
        <Pier f={f} water={6}>
          <GroundShadow x={1120} y={deck - 20} rx={60} color={F.shadow} opacity={0.35} blur={4} />
          <Tick x={1120} y={deck - 22} pxPerM={200} frame={f} pose="crouch-reach" poseTo="lean" poseT={pt} expression="determined" look={0.9} facing={-1} outline={F.shadow} />
          {/* the weighted line: from the mitten, down past the deck, into the water */}
          <line x1={1012} y1={deck - 60} x2={1012} y2={deck - 60 + 40 + drop} stroke="#F7F1E4" strokeWidth={2.5} />
          <path d={`M1004 ${deck - 20 + drop} L1020 ${deck - 20 + drop} L1016 ${deck + 6 + drop} L1008 ${deck + 6 + drop} Z`} fill={L12_COLORS.slateDark} />
          <Bubbles frame={f} x0={1000} x1={1024} y={deck + 10 + drop} n={8} color="#CFF7EE" seed={3} rise={1.2} life={60} size={2.2} />
        </Pier>
      </Harbour>
      <Layer depth={1}>
        {/* the water column under the pier darkens with depth */}
        <Sky stops={[alpha("#082A36", 0), alpha("#061C26", 0.85)]} x={-800} y={H_SEA + 200} w={3400} h={1200} />
      </Layer>
      <Layer depth={0}>
        <Pill x={120} y={128} text="HILO" fill={pillFill(F)} color={F.text} dot={P.vermilion} size={18} />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// 5-13 / 5-14: the drowned-reef staircase (petrol). A slope from the upper left down to the lower right, terraces on
// it; the deepest terrace is tagged 1,335 m / ~465,000 years (#14). The vertical placement is schematic.
const R_SEA = 120; // the surface, high in the world
const REEFS: Pt[] = [
  [260, 300],
  [560, 440],
  [860, 590],
  [1160, 740],
  [1460, 900],
];
const ReefWorld: React.FC<{ f: number; shafts?: number; children?: React.ReactNode }> = ({ f, shafts = 1, children }) => {
  const F = PETROL;
  const slope: Pt[] = [[-600, 60], [-200, 180], ...REEFS.flatMap(([x, y]): Pt[] => [[x - 120, y - 30], [x + 110, y - 4], [x + 150, y + 40]]), [2200, 1180], [2600, 1400]];
  const reefBlob = (x: number, y: number, seed: number, k = 1) =>
    roundPoly(
      Array.from({ length: 9 }, (_, i): Pt => {
        const a = Math.PI + (i / 8) * Math.PI;
        const r = (34 + rnd(seed + i) * 22) * k;
        return [x + Math.cos(a) * r * 1.6, y + Math.sin(a) * r];
      }),
      6,
    );
  return (
    <>
      <Layer depth={0.05}>
        <Sky stops={["#2FBFA8", "#11707A", "#0A3C4C", "#07262E", "#051820"]} />
        <Bloom x={900} y={R_SEA} r={900} color="#9FEFDC" strength={0.35} spread={0.3} squash={0.35} />
      </Layer>
      <Layer depth={0.3} haze={{ color: "#0A3C4C", amount: 0.5 }}>
        <path d={ridgePath([[-600, 500], [200, 640], [900, 820], [1500, 980], [2400, 1200]], 1900, 40)} fill={F.far} />
      </Layer>
      <Layer depth={1}>
        <Form d={ridgePath(slope, 1900, 16)} fill={ROCK_WET} light={270} shadow={F.shadow} inset={30} shadowOpacity={0.5} rim={F.light} rimWidth={3} rimOpacity={0.5} bounce={F.bounce}>
          <Facets pts={slope} base={1900} light={270} fill={F.shadow} opacity={0.4} />
          <Sky stops={[alpha("#11707A", 0.1), alpha("#051820", 0.75)]} x={-800} y={0} w={3600} h={1500} />
        </Form>
        {/* the reefs: coral lips on each terrace, sea-glass, paler near the surface */}
        {REEFS.map(([x, y], i) => (
          <g key={i}>
            <Form d={reefBlob(x + 10, y - 2, i * 7 + 1)} fill={mixHex(L12_COLORS.seaGlass, "#F2E6CC", 0.35 - i * 0.06)} light={270} shadow={F.shadow} inset={10} shadowOpacity={0.45} rim={F.light} rimWidth={2} rimOpacity={0.6} bounce={F.bounce} />
            <Form d={reefBlob(x - 70, y + 6, i * 7 + 3, 0.6)} fill={mixHex(L12_COLORS.seaGlass, "#F2E6CC", 0.2 - i * 0.03)} light={270} shadow={F.shadow} inset={8} shadowOpacity={0.45} rim={F.light} rimWidth={2} rimOpacity={0.6} bounce={F.bounce} />
          </g>
        ))}
        {[-200, 300, 800, 1300, 1800].map((x, i) => (
          <LightCone key={i} x={x} y={R_SEA} angle={96 + (i % 3) * 3} length={900} spread={5 + (i % 2) * 3} color="#9FEFDC" strength={0.16 * shafts * flicker(f, 7 + i, 0.4)} />
        ))}
        <path d={seaSurface(f, -800, 2800, R_SEA, 5, 260, 1.2, R_SEA + 30, 40)} fill="#8FE6D6" opacity={0.8} />
        <Motes frame={f} n={40} x={-200} y={160} w={2300} h={1000} color="#BFF5E8" seed={21} size={2.2} drift={10} />
        <Bubbles frame={f} x0={200} x1={1600} y={1100} n={22} color="#CFF7EE" seed={8} />
        {children}
      </Layer>
      <Layer depth={1.3}>
        <path d={ridgePath([[-500, 1500], [-100, 1120], [240, 1060], [600, 1140], [900, 1300], [1200, 1500]], 1900, 40)} fill={F.near} />
      </Layer>
    </>
  );
};

const ShotReefs: ShotFC<C> = ({ f, c, len }) => {
  const F = PETROL;
  const steps = REEFS.map(([x, y], i): { f: number; x: number; y: number; zoom: number } => ({ f: Math.round((i / (REEFS.length - 1)) * (len - 20)) + (i === 0 ? 0 : 10), x: x + 180, y: y - 40, zoom: 1.35 }));
  const cam = cameraAt(f, steps);
  const tagAt = c.deepest - c.reefs;
  const tag = ease(f, tagAt, tagAt + 20);
  const [dx, dy] = REEFS[REEFS.length - 1];
  return (
    <Stage theme={F.theme} cam={{ ...cam, zoom: cam.zoom * cutPop(f, 0) }} vignette={0.28} grain={0.5}>
      <ReefWorld f={f}>
        <g opacity={tag}>
          <Leader from={[dx + 10, dy - 30]} to={[dx + 150, dy - 130]} color={F.text} />
        </g>
      </ReefWorld>
      <Layer depth={0}>
        <g opacity={tag}>
          <Metric x={1180} y={420} value="1,335" unit="m below the sea" size={60} color={F.text} />
          <Pill x={1180} y={466} text="REEF · ~465,000 YEARS OLD" fill={pillFill(F)} color={F.text} dot={L12_COLORS.seaGlass} size={17} />
        </g>
      </Layer>
    </Stage>
  );
};

const ShotSinking: ShotFC<C> = ({ f }) => {
  const F = PETROL;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 0.9 },
    { f: 200, x: 980, y: 580, zoom: 0.82 },
  ]);
  const [dx, dy] = REEFS[REEFS.length - 1];
  const br = ease(f, 6, 30);
  const nudge = 10 * (0.5 + 0.5 * Math.sin(f / 10));
  return (
    <Stage theme={F.theme} cam={{ ...cam, zoom: cam.zoom * cutPop(f, 0) }} vignette={0.28} grain={0.5}>
      <ReefWorld f={f} shafts={0.8}>
        <g opacity={br}>
          <line x1={dx + 240} y1={R_SEA + 20} x2={dx + 240} y2={dy - 10} stroke={F.text} strokeWidth={3} strokeDasharray="10 8" />
          <line x1={dx + 200} y1={R_SEA + 20} x2={dx + 280} y2={R_SEA + 20} stroke={F.text} strokeWidth={3} />
          <line x1={dx + 200} y1={dy - 10} x2={dx + 280} y2={dy - 10} stroke={F.text} strokeWidth={3} />
          <path d={`M${dx + 240} ${dy + 30 + nudge} L${dx + 222} ${dy + 10 + nudge} L${dx + 258} ${dy + 10 + nudge} Z`} fill={L12_COLORS.amber} />
          <rect x={dx + 234} y={dy - 2 + nudge} width={12} height={16} fill={L12_COLORS.amber} />
        </g>
      </ReefWorld>
      <Layer depth={0}>
        <g opacity={br}>
          <Metric x={1480} y={560} value="≥ 1.3" unit="km sunk" size={60} color={F.text} />
          <Pill x={1480} y={606} text="STILL SINKING" fill={pillFill(F)} color={F.text} dot={L12_COLORS.amber} size={18} />
        </g>
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// 5-15 … 5-18: the chain. A schematic map from above (void): islands as blobs shrinking NW, the heat glyph under the
// Big Island, the plate sliding past like a conveyor (F5 schematic, F7 "HEAT SOURCE").
const ISLANDS = [
  { name: "big", x: 1500, y: 760, r: 150, seed: 1 }, // the Big Island, youngest (#15)
  { name: "maui", x: 1220, y: 600, r: 80, seed: 2 },
  { name: "molokai", x: 1040, y: 520, r: 52, seed: 3 },
  { name: "oahu", x: 860, y: 450, r: 60, seed: 4 },
  { name: "kauai", x: 620, y: 350, r: 50, seed: 5 }, // Kauai, oldest high island (#15)
];
const blob = (x: number, y: number, r: number, seed: number, k = 1) =>
  roundPoly(
    Array.from({ length: 11 }, (_, i): Pt => {
      const a = (i / 11) * Math.PI * 2;
      const rr = r * k * (0.7 + rnd(seed * 13 + i) * 0.5);
      return [x + Math.cos(a) * rr * 1.25, y + Math.sin(a) * rr * 0.85];
    }),
    r * 0.3,
  );

const ChainMap: React.FC<{ f: number; shift: number; glyph?: number; children?: React.ReactNode }> = ({ f, shift, glyph = 1, children }) => {
  const F = VOID;
  const gx = 1500;
  const gy = 790;
  const g = pulse(f, 50, 0.1, 2) * glyph;
  return (
    <>
      <Layer depth={0.05}>
        <Sky stops={["#0B2C3A", "#0E3C48", "#0F4A52"]} />
        <Stars frame={f} n={70} w={1920} h={1080} color={F.text} seed={9} size={1.1} twinkle={0.5} />
      </Layer>
      <Layer depth={1}>
        {/* the plate: a faint fracture grid that slides NW with the islands */}
        <g transform={`translate(${-shift * 0.86} ${-shift * 0.5})`} opacity={0.22}>
          {Array.from({ length: 16 }, (_, i) => (
            <line key={i} x1={-800 + i * 260} y1={-600} x2={-800 + i * 260 - 900} y2={1700} stroke={F.text} strokeWidth={1} />
          ))}
          {Array.from({ length: 12 }, (_, i) => (
            <line key={"h" + i} x1={-900} y1={-500 + i * 220} x2={2900} y2={-500 + i * 220 - 300} stroke={F.text} strokeWidth={1} />
          ))}
        </g>
        {/* the heat source: fixed in the frame, the plate moves over it (F7: never "fixed" or "hotspot" on screen) */}
        <LightWash x={gx} y={gy} rx={420 * g} ry={300 * g} color={L12_COLORS.amber} strength={0.45} />
        <Emissive d={blob(gx, gy, 120, 7)} color={L12_COLORS.amber} core="#FFD28A" fill strength={g} glow={32} />
        <Embers frame={f} x0={gx - 120} x1={gx + 120} y={gy + 40} n={26} color="#FFC070" seed={4} rise={0.5} life={90} size={2} />
        {/* the islands, carried NW: older, smaller, more worn (#15); seamounts beyond Kauai as dotted rings */}
        <g transform={`translate(${-shift * 0.86} ${-shift * 0.5})`}>
          {[[420, 250, 36], [250, 170, 28], [90, 110, 22], [-60, 60, 16]].map(([x, y, r], i) => (
            <ellipse key={i} cx={x} cy={y} rx={r * 1.3} ry={r * 0.9} fill="none" stroke={F.dim} strokeWidth={2} strokeDasharray="6 6" opacity={0.55 - i * 0.08} />
          ))}
          {ISLANDS.map((isl, i) => {
            const land = mixHex("#7A8F5A", F.haze, i * 0.12);
            const shore = mixHex("#D9C7A0", F.haze, i * 0.1);
            return (
              <g key={isl.name}>
                <path d={blob(isl.x, isl.y, isl.r * 1.14, isl.seed)} fill={alpha(shore, 0.55)} />
                <Form d={blob(isl.x, isl.y, isl.r, isl.seed)} fill={land} light={225} shadow={F.shadow} inset={Math.max(6, isl.r * 0.18)} shadowOpacity={0.45} rim={F.light} rimWidth={2} rimOpacity={0.6} bounce={F.bounce}>
                  {i === 0 ? <path d={blob(isl.x + 10, isl.y, isl.r * 0.45, 9)} fill={mixHex(land, F.light, 0.35)} /> : null}
                </Form>
              </g>
            );
          })}
        </g>
        {children}
      </Layer>
    </>
  );
};

const ShotMap: ShotFC<C> = ({ f, len }) => {
  const F = VOID;
  const cam = cameraAt(f, [
    { f: 0, x: 1100, y: 600, zoom: 1.05 },
    { f: len, x: 940, y: 520, zoom: 1.12 },
  ]);
  return (
    <Stage theme={F.theme} cam={{ ...cam, zoom: cam.zoom * cutPop(f, 0) }} vignette={0.28} grain={0.5}>
      <ChainMap f={f} shift={f * 0.35} />
      <Layer depth={0}>
        <Pill x={120} y={128} text="HEAT SOURCE" fill={pillFill(F)} color={F.text} dot={L12_COLORS.amber} size={18} />
        <Pill x={120} y={176} text="SCHEMATIC" fill={pillFill(F)} color={F.text} size={16} />
        <g opacity={ease(f, 30, 50)}>
          <path d={`M1500 400 L1240 250`} stroke={F.text} strokeWidth={3} markerEnd="none" />
          <path d={`M1240 250 L1282 254 L1256 292 Z`} fill={F.text} />
          <Kicker x={1300} y={320} text="— THE PLATE MOVES" color={F.dim} size={20} />
        </g>
      </Layer>
    </Stage>
  );
};

// 5-16: a side section (void): the slab slides left over the fixed heat; the volcano's feed thread thins and goes dark.
const ShotCutOff: ShotFC<C> = ({ f, len }) => {
  const F = VOID;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.0 },
    { f: len, x: 940, y: 540, zoom: 1.1 },
  ]);
  const gx = 1180;
  const gy = 820;
  const slide = -f * 1.1;
  const vx = gx + 60 + slide; // the volcano, carried left
  const off = clamp01((gx - vx) / 160); // 0 over the heat … 1 carried off
  const g = pulse(f, 50, 0.1, 2);
  const cone = roundPoly([[vx - 220, 560], [vx - 60, 400 + off * 16], [vx + 50, 395 + off * 16], [vx + 220, 560]], 14);
  return (
    <Stage theme={F.theme} cam={{ ...cam, zoom: cam.zoom * cutPop(f, 0) }} vignette={0.28} grain={0.5}>
      <Layer depth={0.05}>
        <Sky family={F} />
        <Stars frame={f} n={60} w={1920} h={500} color={F.text} seed={11} size={1.1} twinkle={0.5} />
      </Layer>
      <Layer depth={1}>
        {/* the sea */}
        <Sky stops={["#1C8E8C", "#0E4E5C", "#082A36"]} x={-800} y={560} w={3400} h={100} />
        <path d={seaSurface(f, -800, 2600, 560, 4, 240, 1.2, 580, 40)} fill="#8FE6D6" opacity={0.7} />
        {/* the plate slab, sliding left */}
        <g transform={`translate(${slide} 0)`}>
          <Form d={`M-800 660 L4000 660 L4000 790 L-800 790 Z`} fill={mixHex(L12_COLORS.slateDark, F.near, 0.3)} light={270} shadow={F.shadow} inset={24} shadowOpacity={0.5} rim={F.light} rimWidth={2} rimOpacity={0.4} hard>
            {Array.from({ length: 30 }, (_, i) => (
              <line key={i} x1={-800 + i * 170} y1={660} x2={-800 + i * 170 - 30} y2={790} stroke={F.shadow} strokeWidth={1.5} opacity={0.35} />
            ))}
          </Form>
        </g>
        {/* the volcano on the slab, its root; the feed thread from the heat (Emissive) thins as it is carried off */}
        <Form d={cone} fill={ROCK} light={225} shadow={F.shadow} inset={22} shadowOpacity={0.5} rim={F.light} rimWidth={3} rimOpacity={0.6} bounce={F.bounce} />
        <path d={`M${vx - 160} 660 Q${vx} 760 ${vx + 160} 660 Z`} fill={mixHex(ROCK, F.shadow, 0.3)} />
        <g opacity={1 - off}>
          <Emissive d={`M${gx} ${gy - 40} Q${(gx + vx) / 2} 760 ${vx} 700`} color={L12_COLORS.amber} core="#FFD28A" width={8 * (1 - off) + 1} strength={1 - off} />
        </g>
        {/* the heat source, fixed below (F7) */}
        <LightWash x={gx} y={gy + 40} rx={360 * g} ry={200 * g} color={L12_COLORS.amber} strength={0.4} />
        <Emissive d={blob(gx, gy + 60, 110, 5, 1)} color={L12_COLORS.amber} core="#FFD28A" fill strength={g} glow={32} />
        <Embers frame={f} x0={gx - 100} x1={gx + 100} y={gy + 40} n={20} color="#FFC070" seed={6} rise={0.5} life={90} size={2} />
        {/* arrows: growth (fades), sinking (wins) */}
        <g opacity={0.9 * (1 - off)}>
          <path d={`M${vx} 370 L${vx - 22} 400 L${vx + 22} 400 Z`} fill={L12_COLORS.amber} />
          <rect x={vx - 8} y={398} width={16} height={30 * (1 - off)} fill={L12_COLORS.amber} />
        </g>
        <g opacity={0.3 + 0.7 * off}>
          <rect x={vx + 250 - 8} y={440} width={16} height={60 * (0.4 + 0.6 * off)} fill={L12_COLORS.seaGlass} />
          <path d={`M${vx + 250} ${440 + 60 * (0.4 + 0.6 * off) + 28} L${vx + 250 - 22} ${440 + 60 * (0.4 + 0.6 * off)} L${vx + 250 + 22} ${440 + 60 * (0.4 + 0.6 * off)} Z`} fill={L12_COLORS.seaGlass} />
        </g>
      </Layer>
      <Layer depth={0}>
        <Pill x={120} y={128} text="CUT OFF FROM ITS MAGMA" fill={pillFill(F)} color={F.text} dot={L12_COLORS.amber} size={18} />
      </Layer>
    </Stage>
  );
};

const ShotChain: ShotFC<C> = ({ f, len }) => {
  const F = VOID;
  const cam = cameraAt(f, [
    { f: 0, x: 1200, y: 640, zoom: 1.1 },
    { f: len, x: 860, y: 440, zoom: 1.2 },
  ]);
  const shift = 180 + f * 0.35;
  const t1 = ease(f, 10, 30);
  const t2 = ease(f, 40, 60);
  const sx = -shift * 0.86;
  const sy = -shift * 0.5;
  return (
    <Stage theme={F.theme} cam={{ ...cam, zoom: cam.zoom * cutPop(f, 0) }} vignette={0.28} grain={0.5}>
      <ChainMap f={f} shift={shift}>
        <g opacity={t2}>
          <Leader from={[1500 + sx, 700 + sy]} to={[1640 + sx, 540 + sy]} color={F.text} />
          <Pill x={1650 + sx} y={540 + sy} text="BIG ISLAND · < 0.7 MILLION YR" fill={pillFill(F)} color={F.text} dot={L12_COLORS.amber} size={17} />
        </g>
        <g opacity={t1}>
          <Leader from={[620 + sx, 330 + sy]} to={[520 + sx, 220 + sy]} color={F.text} />
          <Pill x={510 + sx} y={220 + sy} text="KAUAI · ~5.5 MILLION YR" fill={pillFill(F)} color={F.text} dot={L12_COLORS.seaGlass} size={17} align="end" />
        </g>
      </ChainMap>
    </Stage>
  );
};

// 5-18: beyond Kauai, in section: seamounts under the sea line; Tick on the last islet, one boot lifted (petrol).
const ShotSeamounts: ShotFC<C> = ({ f, len }) => {
  const F = PETROL;
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 560, zoom: 1.0 },
    { f: len, x: 760, y: 540, zoom: 1.08 },
  ]);
  const sea = 600;
  const mounts = [
    { x: 1500, top: sea - 140, w: 330 },
    { x: 1060, top: sea - 10, w: 240 }, // the last islet, just at the water
    { x: 660, top: sea + 70, w: 210 },
    { x: 320, top: sea + 150, w: 180 },
    { x: 0, top: sea + 220, w: 160 },
  ];
  const tx = 1060;
  const ty = sea - 12;
  const lift = ease(f, 20, 44) * (1 - ease(f, 60, 80));
  return (
    <Stage theme={F.theme} cam={{ ...cam, zoom: cam.zoom * cutPop(f, 0) }} vignette={0.26} grain={0.5}>
      <Layer depth={0.05}>
        <Sky family={F} />
        <Stars frame={f} n={70} w={1920} h={520} color={F.text} seed={13} size={1.2} twinkle={0.6} />
        <Bloom x={1560} y={160} r={520} color={F.light} strength={0.45} spread={0.3} />
        <Bloom x={1560} y={160} r={90} color="#E6F5EA" strength={0.9} spread={0.45} core={38} coreColor="#F4FBF4" />
      </Layer>
      <Layer depth={1}>
        {mounts.map((m, i) => (
          <Form key={i} d={roundPoly([[m.x - m.w, 1300], [m.x - m.w * 0.5, m.top + 60], [m.x - 20, m.top], [m.x + 30, m.top + 4], [m.x + m.w * 0.55, m.top + 70], [m.x + m.w, 1300]], 16)} fill={mixHex(ROCK, F.near, 0.2 + i * 0.1)} light={300} shadow={F.shadow} inset={24} shadowOpacity={0.5} rim={F.light} rimWidth={3} rimOpacity={0.6} bounce={F.bounce} />
        ))}
        <Sky stops={[alpha("#1FA69A", 0.5), alpha("#0E4E5C", 0.8), alpha("#061C26", 0.95)]} x={-800} y={sea} w={3400} h={900} />
        <path d={seaSurface(f, -800, 2600, sea, 6, 240, 1.3, sea + 36, 40)} fill="#8FE6D6" opacity={0.8} />
        <path d={seaSurface(f + 12, -800, 2600, sea + 1, 4, 160, -1.0, sea + 14, 40)} fill="#D8FFF4" opacity={0.45} />
        <Motes frame={f} n={30} x={-200} y={sea + 60} w={2300} h={500} color="#BFF5E8" seed={17} size={2} drift={10} />
        <GroundShadow x={tx + 6} y={ty + 2} rx={40} color={F.shadow} opacity={0.4} blur={4} />
        <g transform={`translate(0 ${-lift * 10})`}>
          <Tick x={tx} y={ty} pxPerM={120} frame={f} pose="stand" expression="worried" look={-0.7} facing={-1} outline={F.shadow} staff tilt={lift * 6} />
        </g>
        {/* the wet boot: a splash ring at the feet */}
        <ellipse cx={tx} cy={sea + 2} rx={30 + ((f * 0.8) % 30)} ry={6} fill="none" stroke="#D8FFF4" strokeWidth={2} opacity={1 - ((f * 0.8) % 30) / 30} />
      </Layer>
      <Layer depth={1.3}>
        <path d={ridgePath([[-500, 1500], [-100, 1200], [300, 1140], [700, 1240], [1000, 1500]], 1900, 40)} fill={F.near} />
      </Layer>
    </Stage>
  );
};

// ---- 5-19: the stamps on the gauge · 5-20: the sinking pebble ---------------------------------------------------
const VoidField: React.FC<{ f: number; children?: React.ReactNode }> = ({ f, children }) => {
  const F = VOID;
  return (
    <>
      <Layer depth={0.05}>
        <Sky family={F} />
        <Stars frame={f} n={90} w={1920} h={1080} color={F.text} seed={19} size={1.2} twinkle={0.6} />
        <Bloom x={1100} y={700} r={800} color={L12_COLORS.amber} strength={0.22} spread={0.3} />
      </Layer>
      <Layer depth={0.3} haze={{ color: F.haze, amount: 0.4 }}>
        <path d={ridgePath([[-600, 1000], [200, 940], [700, 900], [1100, 860], [1500, 900], [2500, 980]], 1500, 60)} fill={F.far} />
      </Layer>
      <Layer depth={1}>
        <rect x={-800} y={1000} width={3400} height={400} fill={F.near} />
        <Motes frame={f} n={30} x={0} y={100} w={1900} h={900} color={F.light} seed={23} size={3} drift={30} />
        {children}
      </Layer>
    </>
  );
};

const Stamp: React.FC<{ f: number; at: number; x: number; y: number; text: string; F: Family }> = ({ f, at, x, y, text, F }) => {
  const t = f - at;
  if (t < 0) return null;
  const s = 1 + (1 - clamp01(t / 10)) * 0.5;
  const sq = impact(f, at, 0.14, 10);
  return (
    <g transform={`translate(${x} ${y}) scale(${s * sq.sx} ${s * sq.sy}) translate(${-x} ${-y})`}>
      <Pill x={x} y={y} text={text} fill={alpha(L12_COLORS.amber, 0.92)} color={F.shadow} size={20} align="end" />
    </g>
  );
};

const ShotStamps: ShotFC<C> = ({ f, c }) => {
  const F = VOID;
  const gy = (m: number) => 160 + 560 - (m / 12000) * 560;
  return (
    <Stage theme={F.theme} shotFrame={f} drift={{ zoom: 1.1, panX: 0.05, seed: 3 }} vignette={0.28} grain={0.5}>
      <VoidField f={f}>
        {/* the island in section, small, sinking a hair as the stamps land */}
        <g transform={`translate(0 ${6 * ease(f, c.stamp1 - c.stamps, c.stamp1 - c.stamps + 60)})`}>
          <Form d={roundPoly([[300, 1000], [600, 760], [760, 700], [900, 720], [1200, 1000]], 20)} fill={mixHex(ROCK, F.near, 0.3)} light={225} shadow={F.shadow} inset={26} shadowOpacity={0.5} rim={F.light} rimWidth={3} rimOpacity={0.6} bounce={F.bounce} />
        </g>
        <Sky stops={[alpha("#1FA69A", 0.35), alpha("#061C26", 0.8)]} x={-800} y={820} w={3400} h={300} />
        <path d={seaSurface(f, -800, 2600, 820, 5, 240, 1.2, 850, 40)} fill="#8FE6D6" opacity={0.6} />
      </VoidField>
      <Layer depth={0}>
        <SectionHud F={F} everest mk={0} mkBar={10211 /* #13 */} />
        <Stamp f={f} at={c.stamp1 - c.stamps} x={1600} y={gy(10211) + 60} text="SINKS" F={F} />
        <Stamp f={f} at={c.stamp2 - c.stamps} x={1600} y={gy(10211) + 110} text="CARRIED OFF" F={F} />
      </Layer>
    </Stage>
  );
};

const ShotPebble: ShotFC<C> = ({ f, len }) => {
  const F = VOID;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 620, zoom: 1.0 },
    { f: len, x: 950, y: 610, zoom: 1.08 },
  ]);
  const ppm = 330;
  const tx = 820;
  const ty = 1000;
  // the pebble-mountain sits on the open front mitten (hold pose: front hand ≈ [36, -104] units → px)
  const hx = tx + 0.36 * ppm * 0.98;
  const hy = ty - 1.04 * ppm;
  const sink = 26 * ease(f, 30, 100);
  const pt = clamp01((f - (len - 50)) / 28) * 1.6;
  const peb = roundPoly([[hx - 46, hy - sink + 2], [hx - 14, hy - 66 - sink], [hx + 2, hy - 72 - sink], [hx + 18, hy - 60 - sink], [hx + 48, hy - sink + 2]], 6);
  return (
    <Stage theme={F.theme} cam={{ ...cam, zoom: cam.zoom * cutPop(f, 0) }} vignette={0.28} grain={0.5}>
      <VoidField f={f}>
        <GroundShadow x={tx + 10} y={ty + 2} rx={ppm * 0.42} color={F.shadow} opacity={0.5} blur={8} />
        <Tick x={tx} y={ty} pxPerM={ppm} frame={f} pose="hold" poseTo="shrug" poseT={pt} expression="determined" expressionTo="neutral" expressionT={pt} look={0.8} facing={1} outline={F.shadow} />
        <g opacity={1 - clamp01((pt - 0.2) / 0.3)}>
          <Form d={peb} fill={mixHex(ROCK, F.light, 0.1)} light={225} shadow={F.shadow} inset={10} shadowOpacity={0.5} rim={F.light} rimWidth={2} rimOpacity={0.7} bounce={F.bounce}>
            <path d={roundPoly([[hx - 14, hy - 66 - sink], [hx + 2, hy - 72 - sink], [hx + 18, hy - 60 - sink], [hx + 14, hy - 48 - sink], [hx - 8, hy - 50 - sink]], 3)} fill={L12_COLORS.snow} />
          </Form>
          {/* the mitten "gives": a vermilion palm bulge rises over the pebble's foot as it sinks in */}
          <ellipse cx={hx} cy={hy + 4} rx={54} ry={8 + sink * 0.9} fill={P.vermilion} />
          <ellipse cx={hx - 10} cy={hy + 1} rx={28} ry={4 + sink * 0.4} fill={mixHex(P.vermilion, "#FFFFFF", 0.25)} />
        </g>
      </VoidField>
      <Layer depth={0}>
        <SectionHud F={F} everest mk={0} mkBar={10211 /* #13 */} />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------------------
export const SceneL05: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL05(t);
  const shots: ShotDef<C>[] = [
    { from: 0, S: ShotDescent, id: "5-01" },
    { from: c.wide, S: ShotWide, id: "5-04" },
    { from: c.summit, S: ShotShrug, id: "5-05" },
    { from: c.sheet, S: ShotSheet, id: "5-06a" },
    { from: c.stack, S: ShotStack, id: "5-06b" },
    { from: c.mile, S: ShotMile, id: "5-07" },
    { from: c.plate, S: ShotPlate, id: "5-08" },
    { from: c.tilt, S: ShotTilt, id: "5-10" },
    { from: c.hilo, S: ShotHilo, id: "5-11" },
    { from: c.line, S: ShotLine, id: "5-12" },
    { from: c.reefs, S: ShotReefs, id: "5-13" },
    { from: c.sinking, S: ShotSinking, id: "5-14" },
    { from: c.map, S: ShotMap, id: "5-15" },
    { from: c.cutOff, S: ShotCutOff, id: "5-16" },
    { from: c.chain, S: ShotChain, id: "5-17" },
    { from: c.seamounts, S: ShotSeamounts, id: "5-18" },
    { from: c.stamps, S: ShotStamps, id: "5-19" },
    { from: c.pebble, S: ShotPebble, id: "5-20" },
  ];
  return playShots(f, shots, c, t.frames);
};

/** Spot SFX (scene-relative frames; files from studio/public/audio/LICENSES.md only). */
export const soundL05 = (t: SceneTiming): Cue[] => {
  const c = cuesL05(t);
  const cuts = [c.wide, c.summit, c.sheet, c.stack, c.mile, c.plate, c.tilt, c.hilo, c.line, c.reefs, c.sinking, c.map, c.cutOff, c.chain, c.seamounts, c.stamps, c.pebble];
  return [
    { at: 0, file: SFX.wind, vol: 0.16, dur: c.shore - 0 + 40, fadeIn: 20, fadeOut: 30 }, // 5-01 wind bed
    ...[0, 7, 14, 21, 28, 35, 42].map((o) => ({ at: c.rise + o, file: SFX.click, vol: 0.12, dur: 12 })), // the HUD counter rolls to 4,205 m
    { at: c.shore, file: SFX.swirl, vol: 0.22, dur: 60 }, // past the shoreline
    { at: c.shore + 10, file: SFX.rumble, vol: 0.2, dur: c.wide - c.shore, fadeIn: 30, fadeOut: 30 }, // the deep bed
    ...[0, 10, 20, 30, 40, 50, 60].map((o) => ({ at: c.floorBar + o, file: SFX.click, vol: 0.12, dur: 12 })), // the floor ruler counts
    { at: c.wide - 4, file: SFX.popLong, vol: 0.3, dur: 30 },
    { at: c.bracket, file: SFX.chime, vol: 0.26, dur: 60 }, // +1.4 km
    { at: c.summit + 14, file: SFX.pop, vol: 0.26, dur: 20 }, // the shrug
    { at: c.sheet + 6, file: SFX.popLong, vol: 0.3, dur: 30 }, // the first sheet
    ...Array.from({ length: 6 }, (_, i) => ({ at: c.stack + i * Math.max(26, Math.floor((c.mile - c.stack - 30) / 6)), file: SFX.popLong, vol: 0.22, dur: 30 })),
    { at: c.mile + 12, file: SFX.pop, vol: 0.26, dur: 20 }, // the ghost bar
    { at: c.onlyWay, file: SFX.click, vol: 0.2, dur: 16 },
    { at: c.plate, file: SFX.rumble, vol: 0.22, dur: c.tilt - c.plate, fadeIn: 20, fadeOut: 30 },
    { at: c.bends + 10, file: SFX.uBoom, vol: 0.28, dur: 100, fadeOut: 30 }, // the slab bows
    { at: c.tilt + 10, file: SFX.click, vol: 0.2, dur: 16 }, // the spirit level
    { at: c.hilo, file: SFX.swirl, vol: 0.14, dur: 80, fadeOut: 30 }, // the harbour water
    ...[20, 48, 76].map((o) => ({ at: c.hilo + o, file: SFX.click, vol: 0.12, dur: 12 })), // the mm counter
    { at: c.line + 24, file: SFX.swirl, vol: 0.22, dur: 60 }, // the weight goes in
    { at: c.reefs - 6, file: SFX.deepWhoosh, vol: 0.26, dur: 60 }, // into the water
    ...[0, 1, 2, 3, 4].map((i) => ({ at: c.reefs + Math.round((i / 4) * (c.sinking - c.reefs - 20)) + 10, file: SFX.click, vol: 0.16, dur: 14 })), // a step per reef
    { at: c.deepest, file: SFX.chime, vol: 0.24, dur: 60 }, // the deepest reef
    { at: c.sinking + 6, file: SFX.rumble, vol: 0.2, dur: c.map - c.sinking, fadeIn: 10, fadeOut: 30 },
    { at: c.map, file: SFX.rumble, vol: 0.18, dur: c.seamounts - c.map, fadeIn: 20, fadeOut: 30 }, // the conveyor hum
    { at: c.cutOff + 40, file: SFX.pop, vol: 0.24, dur: 20 }, // the thread goes out
    { at: c.chain + 10, file: SFX.pop, vol: 0.22, dur: 20 },
    { at: c.chain + 40, file: SFX.pop, vol: 0.22, dur: 20 },
    { at: c.seamounts + 20, file: SFX.swirl, vol: 0.2, dur: 60 }, // the wet boot
    { at: c.stamp1, file: SFX.popLong, vol: 0.34, dur: 30 },
    { at: c.stamp2, file: SFX.popLong, vol: 0.34, dur: 30 },
    { at: c.pebble + 30, file: SFX.pop, vol: 0.22, dur: 20 },
    { at: c.last - 40, file: SFX.chime, vol: 0.22, dur: 60 }, // "the last word"
    ...cuts.flatMap((at) => cutHit(at)),
  ];
};
