// L11 scene l05 "The heat": thirteen bespoke shots keyed to the narration (episodes/L11-dig-depth/script.md §5).
// Every number drawn is a row in episodes/L11-dig-depth/sources.md:
//   1 °C / 100 m near the top, 1.7-2 °C / 100 m at 6-7 km (#14) · ~180 °C at the bottom, ~100 °C forecast, +80 over
//   boiling (#15) · 140-150 °C for rubber and glue (#16) · aluminium pipe, 100 h of heating (#10) · 12 km up, 12 km
//   down, 24 km (#2, #12 + arithmetic). The isotherm spacing in the long section is schematic (no values drawn).
// Graphite palette for the deep shots, bone for the lab/chart; light from the upper left (lit left, shade right).
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { SceneTiming } from "../../../lib/timeline";
import {
  BONE,
  CornerTicks,
  GRAPHITE,
  Gauge,
  Hatch,
  IF,
  Layer,
  P,
  PAIRS,
  Puffs,
  Stage,
  bob,
  cameraAt,
  crawl,
  fall,
  fmt,
  labelStyle,
  lit,
  loadIllustratedFonts,
  mixHex,
  numStyle,
  ptsToPath,
  ramp,

  shade,
  specks,
  strataLine,
  stratumPath,
  tint,
} from "../../../lib/illustrated";
import { phraseAt } from "../cues";
import { Cue } from "./cue-types";

loadIllustratedFonts();

const E = PAIRS.earth;
const ROCK = mixHex(E.a, P.graphite, 0.5);
const heat = (k: number) => mixHex(ROCK, E.b, k);
const STEEL = mixHex(P.chalk, P.graphite, 0.45);
const STEEL_LIT = mixHex(P.chalk, P.graphite, 0.3);
const AMBER_LINE = mixHex(E.b, P.chalk, 0.3);
const KOLA_KM = 12.262; // #2

const lerp = (f: number, a: number, b: number, from: number, to: number, ease = Easing.inOut(Easing.cubic)) =>
  interpolate(f, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

const cues05 = (t: SceneTiming) => {
  const at = (i: number) => t.lines[i].at;
  const p = (i: number, s: string, o = 0) => phraseAt(t, i, s, o);
  return {
    top: p(0, "Near the top"),
    six: p(0, "By six"),
    speed: p(0, "The warming itself"),
    bottom: at(1) - 4,
    fore: p(1, "The forecast"),
    boil: p(1, "That's eighty"),
    heat: at(2) - 6,
    breaks: p(2, "It breaks"),
    above: p(2, "Above about"),
    wore: p(2, "and the motors wore"),
    deform: at(3) - 6,
    alu: p(3, "Even the light"),
    chart: p(3, "the team charted"),
    trip: at(4) - 6,
    up: p(4, "Twelve kilometres up"),
    down: p(4, "Twelve kilometres down"),
    end: t.frames,
  };
};
type Cues = ReturnType<typeof cues05>;
type ShotProps = { f: number; c: Cues; len: number };


/** small top-left caption on a graphite backing plate, legible over the amber rock */
const Tag: React.FC<{ text: string }> = ({ text }) => (
  <g>
    <rect x={78} y={104} width={text.length * 19 + 36} height={52} fill={P.graphite} opacity={0.88} />
    <text x={96} y={140} style={labelStyle(28, P.chalk, 4)}>
      {text}
    </text>
  </g>
);

// ---------------------------------------------------------------------------------------------
// The long section: 0 to 12.3 km, schematic hole width, stepped heat bands and isotherms that crowd together
const KM = 300;
const SURF = 260;
const HX = 960;
const HW = 30;
/** drawing model only: warming rate 1 → 2 per 100 m by 6.5 km (#14); used for band tint and line spacing, no values shown */
const Tm = (z: number) => (z < 6.5 ? 10 * (z + (z * z) / 13) : 97.5 + 20 * (z - 6.5));
const zAt = (T: number) => {
  let a = 0;
  let b = 14;
  for (let i = 0; i < 30; i++) {
    const m = (a + b) / 2;
    if (Tm(m) < T) a = m;
    else b = m;
  }
  return a;
};
const ISO = Array.from({ length: 42 }, (_, i) => zAt((i + 1) * 5)).filter((z) => z < KOLA_KM + 0.6);
const yOf = (z: number) => SURF + z * KM;

const Column: React.FC<{ f: number; bit: number; moving?: number; sweep?: number; grey?: boolean }> = ({ f, bit, moving = 0, sweep = 1, grey = false }) => {
  const bands = Array.from({ length: 15 }, (_, i) => strataLine(-4000, 6000, yOf(i), 14, i * 2.3 + 1, 220));
  const bitY = yOf(bit);
  return (
    <g>
      <Hatch id="c5-r" color={mixHex(P.chalk, ROCK, 0.84)} gap={22} angle={28} width={1.4} />
      {/* surface: a thin tundra strip and the derrick silhouette */}
      <rect x={-4000} y={SURF - 40} width={10000} height={40} fill={tint(E.a, P.bone, 0.35)} />
      <rect x={-4000} y={SURF - 40} width={10000} height={8} fill={lit(tint(E.a, P.bone, 0.35), 0.3)} />
      <path d={ptsToPath([[HX - 60, SURF - 40], [HX - 8, SURF - 230], [HX + 8, SURF - 230], [HX + 60, SURF - 40]]) + " Z"} fill={shade(E.a, 0.25)} />
      <path d={ptsToPath([[HX - 60, SURF - 40], [HX - 8, SURF - 230], [HX, SURF - 230], [HX - 20, SURF - 40]]) + " Z"} fill={lit(E.a, 0.12)} />
      {/* heat bands: one stepped tint per kilometre */}
      {bands.slice(0, 14).map((b, i) => (
        <path key={i} d={stratumPath(b, bands[i + 1])} fill={heat(0.08 + (Tm(i + 0.5) / 215) * 0.72)} />
      ))}
      <rect x={-4000} y={SURF} width={10000} height={15 * KM} fill="url(#c5-r)" />
      {bands.slice(1, 14).map((b, i) => (
        <path key={i} d={ptsToPath(b)} fill="none" stroke={P.graphite} strokeWidth={2} opacity={0.35} vectorEffect="non-scaling-stroke" />
      ))}
      {/* isotherms: equal steps of warming; they crowd together with depth */}
      {ISO.map((z, i) => {
        const on = interpolate(sweep, [i / ISO.length - 0.05, i / ISO.length + 0.05], [0.25, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <path
            key={i}
            d={ptsToPath(strataLine(-4000, 6000, yOf(z), 5, i * 1.7, 160))}
            fill="none"
            stroke={AMBER_LINE}
            strokeWidth={2}
            strokeDasharray="18 10"
            strokeDashoffset={crawl(f, 0.8 + (i % 3) * 0.2)}
            opacity={0.75 * on}
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
      {/* the hole (width exaggerated) */}
      <rect x={HX - HW / 2} y={SURF} width={HW} height={KOLA_KM * KM} fill={P.graphite} />
      <rect x={HX + HW / 2 - 6} y={SURF} width={6} height={KOLA_KM * KM} fill={shade(E.a, 0.4)} />
      {/* drill string down to the bit */}
      <rect x={HX - 5} y={SURF - 200} width={10} height={bitY - SURF + 200} fill={grey ? P.chalkSoft : STEEL} />
      {Array.from({ length: Math.ceil((bitY - SURF + 200) / 90) }, (_, i) => {
        const y = SURF - 200 + ((i * 90 + moving * 14) % (bitY - SURF + 200));
        return <rect key={i} x={HX - 7} y={y} width={14} height={5} fill={STEEL_LIT} />;
      })}
      <path d={`M${HX - 9} ${bitY - 14} L${HX + 9} ${bitY - 14} L${HX + 5} ${bitY} L${HX - 5} ${bitY} Z`} fill={grey ? P.chalkSoft : STEEL_LIT} />
      {specks(f, 60, 4000, 4000, 15, 6).map((s, i) => (
        <circle key={i} cx={s.x - 1040} cy={SURF + 40 + s.y} r={s.r * 0.7} fill={P.chalk} opacity={0.18} />
      ))}
    </g>
  );
};

/** screen position of a world point under a camera (for HUD labels that must not scale) */
const toScreen = (cam: { x: number; y: number; zoom: number }, wx: number, wy: number) => ({ x: 960 + (wx - cam.x) * cam.zoom, y: 540 + (wy - cam.y) * cam.zoom });

const DepthGauge: React.FC<{ v: number }> = ({ v }) => (
  <Gauge x={250} y={190} height={720} value={v} max={13} unit="km" theme={GRAPHITE} title="DEPTH" format={(x) => fmt(x)} readoutText={`${fmt(v, 1)} km`} plate={120} unitCap={false} />
);

/** a 100 m bracket beside the hole, with the warming over it */
const RateTag: React.FC<{ cam: { x: number; y: number; zoom: number }; z: number; text: string; k: number }> = ({ cam, z, text, k }) => {
  const a = toScreen(cam, HX + HW / 2 + 30, yOf(z));
  const b = toScreen(cam, HX + HW / 2 + 30, yOf(z + 0.1));
  const h = (b.y - a.y) * k;
  return (
    <g opacity={k > 0 ? 1 : 0}>
      <g stroke={P.chalk} strokeWidth={3}>
        <line x1={a.x} y1={a.y} x2={a.x + 22} y2={a.y} />
        <line x1={a.x + 22} y1={a.y} x2={a.x + 22} y2={a.y + h} />
        <line x1={a.x} y1={a.y + h} x2={a.x + 22} y2={a.y + h} />
      </g>
      <text x={a.x + 44} y={a.y + (b.y - a.y) / 2 - 6} style={labelStyle(30, P.chalkSoft, 3)} opacity={k}>
        100 m
      </text>
      <text x={a.x + 44} y={a.y + (b.y - a.y) / 2 + 52} style={numStyle(54, E.b)} opacity={k}>
        {text}
      </text>
    </g>
  );
};

// Shot 1 - "Going down, rock warms up": from the surface, the camera sinks into the warming bands
const ShotSink: React.FC<ShotProps> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 980, y: SURF + 140, zoom: 1.25 },
    { f: len + 40, x: 960, y: SURF + 420, zoom: 1.9 },
  ]);
  return (
    <Stage theme={GRAPHITE} cam={cam} vignette={0.3}>
      <Layer depth={1}>
        <Column f={f} bit={KOLA_KM} />
      </Layer>
      <Layer depth={0}>
        <DepthGauge v={(cam.y - SURF) / KM} />
        <g opacity={ramp(f, 4, 16)}>
          <text x={1500} y={150} style={labelStyle(30, P.chalkSoft, 5)}>
            5
          </text>
          <text x={1540} y={150} style={labelStyle(30, P.chalk, 5)}>
            The heat
          </text>
          <rect x={1500} y={166} width={250 * ramp(f, 8, 26)} height={4} fill={P.chalk} />
        </g>
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// Shot 2 - "near the top": a 100 m bracket, +1 °C
const ShotTop: React.FC<ShotProps> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 1060, y: yOf(0.42), zoom: 3.4 },
    { f: len + 30, x: 1090, y: yOf(0.5), zoom: 4.0 },
  ]);
  return (
    <Stage theme={GRAPHITE} cam={cam} vignette={0.3}>
      <Layer depth={1}>
        <Column f={f} bit={KOLA_KM} />
      </Layer>
      <Layer depth={0}>
        <RateTag cam={cam} z={0.4} text="+1 °C" k={ramp(f, 6, 22)} />
        <DepthGauge v={(cam.y - SURF) / KM} />
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// Shot 3 - "by six or seven kilometres": the same bracket, nearly twice the warming
const ShotSix: React.FC<ShotProps> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 1100, y: yOf(6.35), zoom: 4.2 },
    { f: len + 30, x: 1080, y: yOf(6.5), zoom: 3.6 },
  ]);
  return (
    <Stage theme={GRAPHITE} cam={cam} vignette={0.3}>
      <Layer depth={1}>
        <Column f={f} bit={KOLA_KM} />
      </Layer>
      <Layer depth={0}>
        <RateTag cam={cam} z={6.35} text="+1.7–2 °C" k={ramp(f, 6, 22)} />
        <DepthGauge v={(cam.y - SURF) / KM} />
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// Shot 4 - "the warming itself was speeding up": pull back to the whole hole; the isotherms light top to bottom
const ShotWhole: React.FC<ShotProps> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 1080, y: yOf(6.5), zoom: 3.6 },
    { f: Math.round(len * 0.55), x: 1000, y: yOf(6.1), zoom: 0.25 },
    { f: len + 20, x: 1010, y: yOf(6.1), zoom: 0.24 },
  ]);
  const tags = ramp(f, len * 0.5, len * 0.5 + 14);
  const a = toScreen(cam, HX + 60, yOf(0.5));
  const b = toScreen(cam, HX + 60, yOf(6.5));
  return (
    <Stage theme={GRAPHITE} cam={cam} vignette={0.3}>
      <Layer depth={1}>
        <Column f={f} bit={KOLA_KM} sweep={lerp(f, len * 0.35, len, 0, 1.1)} />
      </Layer>
      <Layer depth={0}>
        <g opacity={tags}>
          {[
            [a, "1 °C / 100 m"],
            [b, "1.7–2 °C / 100 m"],
          ].map(([p, s], i) => {
            const q = p as { x: number; y: number };
            return (
              <g key={i}>
                <line x1={q.x - 40} y1={q.y} x2={q.x + 10} y2={q.y} stroke={P.chalk} strokeWidth={3} />
                <text x={q.x + 22} y={q.y + 14} style={numStyle(38, E.b)}>
                  {s as string}
                </text>
              </g>
            );
          })}
        </g>
        <DepthGauge v={(cam.y - SURF) / KM} />
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// The heat gauge at the bottom of the hole: fill to ~180, a FORECAST mark at ~100, boiling water for scale
const GX = 760;
const GY = 170;
const GH = 740;
const gy = (v: number) => GY + GH - (v / 200) * GH;

const Kettle: React.FC<{ x: number; y: number; s: number; f: number }> = ({ x, y, s, f }) => {
  const body = mixHex(E.a, P.chalk, 0.35);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Puffs frame={f} x={78} y={-74} color={P.chalk} period={16} size={9} rise={1.4} drift={0.9} life={40} seed={3} />
      <path d="M-60 0 L60 0 L48 -78 L-48 -78 Z" fill={body} />
      <path d="M14 0 L60 0 L48 -78 L10 -78 Z" fill={shade(body, 0.3)} />
      <path d="M-34 -78 L34 -78 L24 -92 L-24 -92 Z" fill={lit(body, 0.25)} />
      <rect x={-8} y={-104} width={16} height={12} fill={shade(body, 0.2)} />
      <path d="M50 -60 L84 -78 L90 -70 L56 -44 Z" fill={shade(body, 0.2)} />
      <path d="M-50 -66 L-82 -60 L-82 -18 L-56 -14 L-58 -24 L-72 -26 L-72 -52 L-52 -56 Z" fill={shade(body, 0.35)} />
    </g>
  );
};

const HotBlock: React.FC<{ f: number; x: number }> = ({ f, x }) => {
  const edges = Array.from({ length: 7 }, (_, i) => strataLine(x - 300, x + 900, 120 + i * 150, 12, i + 4, 80));
  return (
    <g>
      {edges.slice(0, 6).map((e, i) => (
        <path key={i} d={stratumPath(e, edges[i + 1])} fill={heat(0.35 + i * 0.09)} />
      ))}
      <rect x={x - 300} y={120} width={1200} height={900} fill="url(#c5-r)" />
      <rect x={x + 240} y={60} width={110} height={820} fill={P.graphite} />
      <rect x={x + 330} y={60} width={20} height={820} fill={shade(E.b, 0.5)} />
      <rect x={x + 278} y={-40} width={34} height={840} fill={STEEL} />
      <path d={`M${x + 266} 800 L${x + 324} 800 L${x + 312} 850 L${x + 278} 850 Z`} fill={STEEL_LIT} />
      {fall(f, 18, 1200, 900, 5, -1.1, 6).map((s, i) => (
        <rect key={i} x={x - 300 + s.x} y={120 + s.y} width={s.r * 1.6} height={s.r * 1.6} fill={E.b} opacity={0.35} />
      ))}
    </g>
  );
};

const ThermoSet: React.FC<{ f: number; v: number; mark: boolean; kettle: number; bracket: number }> = ({ f, v, mark, kettle, bracket }) => (
  <g>
    <Layer depth={0.6}>
      <HotBlock f={f} x={1260} />
    </Layer>
    <Layer depth={1}>
      <Gauge
        x={GX}
        y={GY}
        height={GH}
        value={v}
        max={200}
        ticks={10}
        unit="°C"
        direction="up"
        theme={GRAPHITE}
        title="ROCK"
        readoutText={`${fmt(v)} °C`}
        
        plate={150}
        unitCap={false}
      />
      <g opacity={mark ? 1 : 0}>
        <line x1={GX - 196} y1={gy(100)} x2={GX - 4} y2={gy(100)} stroke={E.b} strokeWidth={3} strokeDasharray="10 7" />
        <text x={GX - 204} y={gy(100) + 10} textAnchor="end" style={labelStyle(30, E.b, 3)}>
          Forecast
        </text>
      </g>
      <g opacity={kettle}>
        <line x1={GX + 30} y1={gy(100)} x2={GX + 120} y2={gy(100)} stroke={P.chalk} strokeWidth={2} strokeDasharray="6 6" />
        <Kettle x={GX + 210} y={gy(100) + 30} s={0.8 + 0.2 * kettle} f={f} />
      </g>
      <g opacity={bracket}>
        <g stroke={E.b} strokeWidth={4}>
          <line x1={GX + 340} y1={gy(100)} x2={GX + 370} y2={gy(100)} />
          <line x1={GX + 370} y1={gy(100)} x2={GX + 370} y2={gy(100) - (gy(100) - gy(180)) * bracket} />
          <line x1={GX + 340} y1={gy(180)} x2={GX + 370} y2={gy(180)} opacity={bracket > 0.95 ? 1 : 0} />
        </g>
        <text x={GX + 392} y={(gy(100) + gy(180)) / 2 + 22} style={numStyle(64, E.b)}>
          +80 °C
        </text>
      </g>
    </Layer>
  </g>
);

// Shot 5 - "about 180 °C at the bottom": the heat gauge fills
const ShotHot: React.FC<ShotProps> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 1000, y: 560, zoom: 1.08 },
    { f: len + 20, x: 1040, y: 520, zoom: 1.0 },
  ]);
  return (
    <Stage theme={GRAPHITE} cam={cam} vignette={0.3}>
      <ThermoSet f={f} v={lerp(f, 6, 52, 0, 180, Easing.out(Easing.cubic))} mark={false} kettle={0} bracket={0} />
      <Layer depth={0}>
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// Shot 6 - "the forecast had been about a hundred": a dashed FORECAST tick, the camera leans to it
const ShotForecast: React.FC<ShotProps> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 840, y: gy(110), zoom: 1.5 },
    { f: len + 20, x: 820, y: gy(120), zoom: 1.62 },
  ]);
  return (
    <Stage theme={GRAPHITE} cam={cam} vignette={0.3}>
      <ThermoSet f={f} v={180} mark={f > 4} kettle={0} bracket={0} />
      <Layer depth={0}>
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// Shot 7 - "eighty degrees hotter than boiling water": a kettle at 100, a +80 bracket up to 180
const ShotBoil: React.FC<ShotProps> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 1060, y: gy(140), zoom: 1.35 },
    { f: len + 20, x: 1090, y: gy(140), zoom: 1.25 },
  ]);
  return (
    <Stage theme={GRAPHITE} cam={cam} vignette={0.3}>
      <ThermoSet f={f} v={180} mark kettle={ramp(f, 0, 10)} bracket={ramp(f, 16, 34)} />
      <Layer depth={0}>
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// The turbine motor at the bottom of the hole, opened up: blades turn, then seals crack and it greys out
const MX = 960;
const Motor: React.FC<{ f: number; spin: number; crack: number; grey: number; shake: number }> = ({ f, spin, crack, grey, shake }) => {
  const g = (c: string) => mixHex(c, P.chalkSoft, grey * 0.7);
  const walls = Array.from({ length: 8 }, (_, i) => strataLine(-400, 2400, -100 + i * 190, 16, i * 1.3 + 2, 90));
  const sx = Math.sin(f * 3.3) * shake * 6;
  return (
    <g>
      <Hatch id="c5-m" color={mixHex(P.chalk, ROCK, 0.84)} gap={22} angle={28} width={1.4} />
      {walls.slice(0, 7).map((w, i) => (
        <path key={i} d={stratumPath(w, walls[i + 1])} fill={heat(0.45 + i * 0.06)} />
      ))}
      <rect x={-400} y={-200} width={2800} height={1600} fill="url(#c5-m)" />
      <rect x={MX - 260} y={-200} width={520} height={1500} fill={P.graphite} />
      <rect x={MX + 230} y={-200} width={30} height={1500} fill={shade(E.b, 0.5)} />
      <g transform={`translate(${sx} 0)`}>
        {/* housing, two-tone */}
        <rect x={MX - 150} y={-200} width={300} height={1040} fill={g(STEEL)} />
        <rect x={MX - 150} y={-200} width={70} height={1040} fill={g(STEEL_LIT)} />
        {/* cutaway window: rotor blades streaming past while it turns */}
        <rect x={MX - 100} y={120} width={200} height={520} fill={mixHex(P.graphite, P.chalk, 0.1)} />
        <defs>
          <clipPath id="c5-win">
            <rect x={MX - 100} y={120} width={200} height={520} />
          </clipPath>
        </defs>
        <g clipPath="url(#c5-win)">
          <rect x={MX - 14} y={120} width={28} height={520} fill={g(STEEL_LIT)} />
          {Array.from({ length: 14 }, (_, i) => {
            const y = 100 + ((i * 44 + spin * 9) % 616);
            return (
              <g key={i}>
                <path d={`M${MX - 14} ${y} L${MX - 92} ${y + 18} L${MX - 92} ${y + 30} L${MX - 14} ${y + 14} Z`} fill={g(lit(E.b, 0.1))} />
                <path d={`M${MX + 14} ${y} L${MX + 92} ${y + 18} L${MX + 92} ${y + 30} L${MX + 14} ${y + 14} Z`} fill={g(shade(E.b, 0.25))} />
              </g>
            );
          })}
        </g>
        <rect x={MX - 100} y={120} width={200} height={520} fill="none" stroke={P.chalk} strokeWidth={2.5} />
        {/* seal rings above and below the window */}
        {[96, 664].map((y) => (
          <g key={y}>
            <rect x={MX - 156} y={y - 8} width={312} height={24} fill={g(mixHex(P.graphite, E.a, 0.25))} />
            <rect x={MX - 156} y={y - 8} width={312} height={6} fill={g(mixHex(P.graphite, P.chalk, 0.25))} />
          </g>
        ))}
        {/* cracks grow from the seals */}
        {[
          [MX - 120, 104, 1],
          [MX + 60, 672, -1],
          [MX + 130, 100, 1],
        ].map(([x, y, d], i) => {
          const pts: [number, number][] = Array.from({ length: 6 }, (_, j) => [x + (j % 2 ? 14 : -8) * (j > 0 ? 1 : 0), y + d * j * 30 * crack]);
          return <path key={i} d={ptsToPath(pts)} fill="none" stroke={P.chalk} strokeWidth={3} opacity={crack > 0 ? 1 : 0} />;
        })}
        <path d={`M${MX - 150} 840 L${MX + 150} 840 L${MX + 110} 940 L${MX - 110} 940 Z`} fill={g(STEEL_LIT)} />
        {[-80, 0, 80].map((dx) => (
          <path key={dx} d={`M${MX + dx - 34} 940 L${MX + dx + 34} 940 L${MX + dx} 1010 Z`} fill={g(mixHex(P.chalk, P.graphite, 0.2))} />
        ))}
      </g>
      {fall(f, 22, 500, 1200, 9, -1.4, 5).map((s, i) => (
        <rect key={i} x={MX - 250 + s.x} y={s.y - 100} width={s.r * 1.4} height={s.r * 1.4} fill={E.b} opacity={0.3} />
      ))}
    </g>
  );
};

// Shot 8 - "heat doesn't just make things uncomfortable. It breaks machines.": the motor running hot, then a jolt
const ShotMotor: React.FC<ShotProps> = ({ f, c, len }) => {
  const jolt = c.breaks - c.heat;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 520, zoom: 0.92 },
    { f: len + 20, x: 960, y: 470, zoom: 1.05 },
  ]);
  const shake = f >= jolt ? Math.exp(-(f - jolt) / 10) : 0;
  return (
    <Stage theme={GRAPHITE} cam={{ ...cam, x: cam.x + shake * Math.sin(f * 2.7) * 8 }} vignette={0.32}>
      <Layer depth={1}>
        <Motor f={f} spin={f * (f < jolt ? 1 : 0.6)} crack={ramp(f, jolt, jolt + 10) * 0.5} grey={0} shake={shake} />
      </Layer>
      <Layer depth={0}>
        <Tag text="Turbine motor" />
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// Shot 9 - "above about 140": close on a seal; the cracks run; a heat strip marks 140-150 °C
const ShotSeal: React.FC<ShotProps> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 150, zoom: 2.3 },
    { f: len + 20, x: 960, y: 190, zoom: 2.6 },
  ]);
  const sx = (v: number) => 380 + (v / 200) * 1160;
  return (
    <Stage theme={GRAPHITE} cam={cam} vignette={0.32}>
      <Layer depth={1}>
        <Motor f={f} spin={f * 0.6 + 200} crack={lerp(f, 10, len - 20, 0.5, 1)} grey={0} shake={0} />
      </Layer>
      <Layer depth={0}>
        {/* the heat strip: 0-200 °C, fill to ~180, the failure band hatched */}
        <Hatch id="c5-band" color={P.chalk} gap={10} angle={45} width={2} />
        <rect x={360} y={890} width={1200} height={120} fill={P.graphite} opacity={0.94} stroke={P.chalk} strokeWidth={1.5} />
        <rect x={sx(0)} y={930} width={sx(200) - sx(0)} height={22} fill={P.graphiteLift} stroke={P.chalk} strokeWidth={1.5} />
        <rect x={sx(0)} y={930} width={(sx(180) - sx(0)) * ramp(f, 0, 30)} height={22} fill={E.b} />
        <rect x={sx(140)} y={922} width={sx(150) - sx(140)} height={38} fill="url(#c5-band)" stroke={P.chalk} strokeWidth={2} opacity={ramp(f, 22, 34)} />
        {[0, 50, 100, 150, 200].map((v) => (
          <text key={v} x={sx(v)} y={990} textAnchor="middle" style={{ fontFamily: IF.num, fontWeight: 500, fontSize: 22, fill: P.chalkSoft }}>
            {v}
          </text>
        ))}
        <text x={sx(145)} y={912} textAnchor="middle" style={numStyle(34, P.chalk)} opacity={ramp(f, 26, 38)}>
          140–150 °C
        </text>
        <Tag text="Rubber + glue" />
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// Shot 10 - "and the motors wore out fast": the blades slow and stop, the motor greys out, the camera backs away
const ShotWorn: React.FC<ShotProps> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 420, zoom: 1.2 },
    { f: len + 10, x: 940, y: 520, zoom: 0.86 },
  ]);
  const stop = Math.min(f, 24);
  const spin = 300 + stop * 0.6 - (stop * stop) / 80;
  return (
    <Stage theme={GRAPHITE} cam={cam} vignette={0.34}>
      <Layer depth={1}>
        <Motor f={f} spin={spin} crack={1} grey={ramp(f, 4, 30)} shake={0} />
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// Shot 11 - "high temperatures also deform the bits and the pipe": teeth blunt, the pipe bows
const ShotBit: React.FC<ShotProps> = ({ f, len }) => {
  const k = lerp(f, 8, len - 6, 0, 1);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 600, zoom: 1.0 },
    { f: len + 20, x: 960, y: 640, zoom: 1.12 },
  ]);
  const bend = (y: number) => Math.sin(((y + 200) / 900) * Math.PI) * 46 * k;
  const pipe: [number, number][] = Array.from({ length: 13 }, (_, i) => [960 + bend(-200 + i * 60), -200 + i * 60]);
  const edges = Array.from({ length: 8 }, (_, i) => strataLine(-300, 2300, -60 + i * 170, 14, i + 9, 90));
  return (
    <Stage theme={GRAPHITE} cam={cam} vignette={0.32}>
      <Layer depth={1}>
        <Hatch id="c5-b" color={mixHex(P.chalk, ROCK, 0.84)} gap={22} angle={-30} width={1.4} />
        {edges.slice(0, 7).map((e, i) => (
          <path key={i} d={stratumPath(e, edges[i + 1])} fill={heat(0.5 + i * 0.05)} />
        ))}
        <rect x={-300} y={-200} width={2600} height={1500} fill="url(#c5-b)" />
        <path d={ptsToPath([[700, -200], [700, 900], [760, 960], [1160, 960], [1220, 900], [1220, -200]]) + " Z"} fill={P.graphite} />
        {/* the pipe: a bowed polyline drawn thick, lit left edge */}
        <path d={ptsToPath(pipe)} fill="none" stroke={STEEL} strokeWidth={70} />
        <path d={ptsToPath(pipe.map(([x, y]) => [x - 24, y] as [number, number]))} fill="none" stroke={STEEL_LIT} strokeWidth={20} />
        <path d={ptsToPath(pipe.map(([x, y]) => [x + 26, y] as [number, number]))} fill="none" stroke={shade(STEEL, 0.3)} strokeWidth={14} />
        {/* the bit: three teeth that blunt as k grows */}
        <g transform={`translate(${bob(f, 3, 2, 6)} 0)`}>
          <path d="M880 520 L1040 520 L1070 600 L850 600 Z" fill={STEEL_LIT} />
          <path d="M990 520 L1040 520 L1070 600 L1010 600 Z" fill={shade(STEEL_LIT, 0.3)} />
          {[-70, 0, 70].map((dx, i) => {
            const tip = 80 - 46 * k;
            const w = 36 + 16 * k;
            return <path key={i} d={`M${960 + dx - w} 600 L${960 + dx + w} 600 L${960 + dx + 10 * k} ${600 + tip} L${960 + dx - 10 * k} ${600 + tip} Z`} fill={i === 2 ? shade(P.chalk, 0.35) : mixHex(P.chalk, P.graphite, 0.15)} />;
          })}
        </g>
        {fall(f, 20, 600, 700, 4, -1.2, 5).map((s, i) => (
          <rect key={i} x={660 + s.x} y={200 + s.y} width={s.r * 1.4} height={s.r * 1.4} fill={E.b} opacity={0.35} />
        ))}
      </Layer>
      <Layer depth={0}>
        <Tag text="Bit + pipe" />
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// Shot 12 - "even the light aluminium pipe had to be tested against heat": a pipe section in a test oven, a clock racing
const ShotOven: React.FC<ShotProps> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 940, y: 560, zoom: 1.12 },
    { f: len + 20, x: 1000, y: 540, zoom: 1.0 },
  ]);
  const box = tint(E.a, P.bone, 0.3);
  const alu = mixHex("#C9CCC8", E.a, 0.12);
  const pulse = 0.55 + 0.45 * Math.sin(f / 6);
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={0.3}>
        <rect x={-400} y={-400} width={2800} height={1900} fill={P.bone} />
        {Array.from({ length: 14 }, (_, i) => (
          <line key={i} x1={-400 + i * 200} y1={-400} x2={-400 + i * 200} y2={1500} stroke={P.boneDeep} strokeWidth={3} />
        ))}
        <rect x={-400} y={860} width={2800} height={600} fill={P.boneDeep} />
      </Layer>
      <Layer depth={1}>
        {/* oven: two-tone box, window, coils */}
        <path d={ptsToPath([[520, 860], [520, 300], [1300, 300], [1300, 860]]) + " Z"} fill={box} />
        <path d={ptsToPath([[1300, 860], [1300, 300], [1380, 340], [1380, 860]]) + " Z"} fill={shade(box, 0.3)} />
        <path d={ptsToPath([[520, 300], [600, 260], [1380, 260], [1380, 340], [1300, 300]]) + " Z"} fill={lit(box, 0.25)} />
        <rect x={580} y={360} width={660} height={420} fill={P.graphite} />
        {[0, 1].map((r) => (
          <path
            key={r}
            d={ptsToPath(Array.from({ length: 17 }, (_, i) => [600 + i * 40, (r ? 750 : 390) + (i % 2 ? 14 : -14)] as [number, number]))}
            fill="none"
            stroke={mixHex(E.b, P.graphite, 1 - pulse)}
            strokeWidth={6}
          />
        ))}
        <g transform={`translate(0 ${bob(f, 2, 3, 70)})`}>
          <rect x={640} y={530} width={540} height={90} fill={alu} />
          <rect x={640} y={530} width={540} height={24} fill={lit(alu, 0.4)} />
          <rect x={640} y={596} width={540} height={24} fill={shade(alu, 0.25)} />
          <rect x={620} y={522} width={30} height={106} fill={shade(alu, 0.1)} />
          <rect x={1170} y={522} width={30} height={106} fill={shade(alu, 0.25)} />
        </g>
        <text x={910} y={505} textAnchor="middle" style={labelStyle(40, P.chalk, 5)} opacity={ramp(f, 8, 20)}>
          Aluminium
        </text>
        {/* clock: the hand races through the hours */}
        <g transform="translate(1560 470)">
          <circle r={118} fill={lit(P.boneDeep, 0.3)} stroke={P.ink} strokeWidth={4} />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return <line key={i} x1={Math.sin(a) * 96} y1={-Math.cos(a) * 96} x2={Math.sin(a) * 110} y2={-Math.cos(a) * 110} stroke={P.ink} strokeWidth={4} />;
          })}
          <line x1={0} y1={0} x2={Math.sin(f * 0.35) * 86} y2={-Math.cos(f * 0.35) * 86} stroke={P.ink} strokeWidth={6} />
          <line x1={0} y1={0} x2={Math.sin(f * 0.03) * 56} y2={-Math.cos(f * 0.03) * 56} stroke={P.ink} strokeWidth={8} />
          <circle r={9} fill={P.ink} />
          <text x={0} y={190} textAnchor="middle" style={numStyle(56, P.ink)} opacity={ramp(f, 14, 26)}>
            100 h
          </text>
        </g>
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 13 - "the team charted how much strength it kept": a chart sheet, the curve drawn by a pen (no values: the scan's
// numbers are not legible, #10)
const ShotChart: React.FC<ShotProps> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 560, zoom: 1.0 },
    { f: len + 20, x: 1020, y: 520, zoom: 1.14 },
  ]);
  const k = lerp(f, 10, len - 10, 0, 1, Easing.inOut(Easing.quad));
  const curve: [number, number][] = Array.from({ length: 21 }, (_, i) => {
    const u = i / 20;
    return [560 + u * 860, 330 + 60 * u + 330 * Math.pow(u, 2.4)];
  });
  const n = Math.max(2, Math.ceil(k * 20) + 1);
  const drawn = curve.slice(0, n);
  const tip = drawn[drawn.length - 1];
  const sheet = lit(P.boneDeep, 0.5);
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={0.3}>
        <rect x={-400} y={-400} width={2800} height={1900} fill={mixHex(P.bone, E.a, 0.12)} />
      </Layer>
      <Layer depth={1}>
        <g transform={`rotate(-2 960 540)`}>
          <rect x={430} y={190} width={1100} height={760} fill={shade(sheet, 0.12)} transform="translate(14 14)" />
          <rect x={430} y={190} width={1100} height={760} fill={sheet} />
          {Array.from({ length: 12 }, (_, i) => (
            <line key={`v${i}`} x1={560 + i * 78} y1={250} x2={560 + i * 78} y2={800} stroke={tint(E.a, P.bone, 0.6)} strokeWidth={1.5} />
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <line key={`h${i}`} x1={560} y1={250 + i * 78} x2={1420} y2={250 + i * 78} stroke={tint(E.a, P.bone, 0.6)} strokeWidth={1.5} />
          ))}
          <line x1={560} y1={240} x2={560} y2={800} stroke={P.ink} strokeWidth={4} />
          <line x1={560} y1={800} x2={1440} y2={800} stroke={P.ink} strokeWidth={4} />
          <text x={530} y={530} textAnchor="middle" transform="rotate(-90 530 530)" style={labelStyle(34, P.ink, 4)}>
            Strength
          </text>
          <text x={1000} y={860} textAnchor="middle" style={labelStyle(34, P.ink, 4)}>
            Heat
          </text>
          <text x={1420} y={236} textAnchor="end" style={labelStyle(30, P.inkSoft, 3)}>
            After 100 h
          </text>
          <path d={ptsToPath(drawn)} fill="none" stroke={E.a} strokeWidth={7} strokeLinejoin="round" />
          {/* the pen nib, two-tone, rides the curve */}
          <g transform={`translate(${tip[0]} ${tip[1]}) rotate(-35)`}>
            <path d="M0 0 L-10 -40 L10 -40 Z" fill={P.ink} />
            <path d="M-10 -40 L10 -40 L10 -170 L-10 -170 Z" fill={lit(E.a, 0.2)} />
            <path d="M2 -40 L10 -40 L10 -170 L2 -170 Z" fill={shade(E.a, 0.2)} />
          </g>
        </g>
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 14 - "every worn-out motor meant another round trip": the whole string comes up 12 km and goes back down; 24 km
const ShotTrip: React.FC<ShotProps> = ({ f, c, len }) => {
  const up = c.up - c.trip;
  const down = c.down - c.trip;
  const cam = cameraAt(f, [
    { f: 0, x: 1000, y: yOf(9), zoom: 0.5 },
    { f: 40, x: 1040, y: yOf(6.1), zoom: 0.235 },
    { f: len + 20, x: 1040, y: yOf(6.2), zoom: 0.232 },
  ]);
  const bit = f < up ? KOLA_KM : f < down ? lerp(f, up, down - 2, KOLA_KM, 0, Easing.inOut(Easing.quad)) : lerp(f, down, down + 44, 0, KOLA_KM, Easing.inOut(Easing.quad));
  const count = f < up ? 0 : f < down ? lerp(f, up, down - 2, 0, 12, Easing.inOut(Easing.quad)) : lerp(f, down, down + 44, 12, 24, Easing.inOut(Easing.quad));
  const moving = f < up ? 0 : f < down ? -(f - up) * 10 : (f - down) * 10;
  return (
    <Stage theme={GRAPHITE} cam={cam} vignette={0.3}>
      <Layer depth={1}>
        <Column f={f} bit={bit} moving={moving} grey={f < up} />
      </Layer>
      <Layer depth={0}>
        <DepthGauge v={bit} />
        {(() => {
          const q = toScreen(cam, HX, yOf(bit));
          return <path d={`M${q.x + 18} ${q.y} L${q.x + 46} ${q.y - 16} L${q.x + 46} ${q.y + 16} Z`} fill={P.chalk} />;
        })()}
        <g transform="translate(1400 470)">
          <text x={0} y={0} style={labelStyle(30, P.chalkSoft, 5)}>
            Round trip
          </text>
          <text x={0} y={100} style={numStyle(110, P.chalk)}>
            {fmt(count)} km
          </text>
          <g opacity={f >= up ? 1 : 0}>
            <path d="M10 160 L40 130 L70 160 Z" fill={f < down ? E.b : P.chalkSoft} />
            <path d="M110 130 L140 160 L170 130 Z" fill={f >= down ? E.b : P.chalkSoft} opacity={f >= down ? 1 : 0.4} />
          </g>
        </g>
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
type Shot = { from: number; C: React.FC<ShotProps> };
const shots05 = (c: Cues): Shot[] => [
  { from: 0, C: ShotSink },
  { from: c.top, C: ShotTop },
  { from: c.six, C: ShotSix },
  { from: c.speed, C: ShotWhole },
  { from: c.bottom, C: ShotHot },
  { from: c.fore, C: ShotForecast },
  { from: c.boil, C: ShotBoil },
  { from: c.heat, C: ShotMotor },
  { from: c.above, C: ShotSeal },
  { from: c.wore, C: ShotWorn },
  { from: c.deform, C: ShotBit },
  { from: c.alu, C: ShotOven },
  { from: c.chart, C: ShotChart },
  { from: c.trip, C: ShotTrip },
];

export const SceneL05: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cues05(t);
  const shots = shots05(c);
  let k = 0;
  for (let i = 0; i < shots.length; i++) if (f >= shots[i].from) k = i;
  const S = shots[k].C;
  const len = (k + 1 < shots.length ? shots[k + 1].from : c.end) - shots[k].from;
  return <S f={f - shots[k].from} c={c} len={len} />;
};

export const soundL05 = (t: SceneTiming): Cue[] => {
  const c = cues05(t);
  return [
    { at: 0, file: "mixkit-2297-rumble-bass-hum.mp3", vol: 0.32, dur: c.speed + 60, fadeIn: 20, fadeOut: 30 },
    { at: c.top - 4, file: "mixkit-1489-whoosh-air.mp3", vol: 0.24, dur: 50 },
    { at: c.top + 8, file: "mixkit-2568-ui-click-tone.mp3", vol: 0.3, dur: 20 },
    { at: c.six - 6, file: "mixkit-2604-whoosh-deep-air.mp3", vol: 0.3, dur: 60 },
    { at: c.six + 8, file: "mixkit-2568-ui-click-tone.mp3", vol: 0.3, dur: 20 },
    { at: c.speed, file: "mixkit-1493-whoosh-swirl.mp3", vol: 0.28, dur: 50 },
    { at: c.speed + 40, file: "mixkit-645-riser-synth.mp3", vol: 0.16, trim: 5, dur: c.bottom - c.speed - 30, fadeIn: 20, fadeOut: 8 },
    { at: c.bottom, file: "mixkit-788-boom-cinematic-impact.mp3", vol: 0.34, dur: 120, fadeOut: 40 },
    { at: c.bottom + 50, file: "mixkit-2356-ui-pop-dry.mp3", vol: 0.26, dur: 20 },
    { at: c.fore + 4, file: "mixkit-2568-ui-click-tone.mp3", vol: 0.3, dur: 20 },
    { at: c.boil, file: "mixkit-2358-ui-pop-long.mp3", vol: 0.26, dur: 20 },
    { at: c.boil + 30, file: "mixkit-3108-chime-crystal.mp3", vol: 0.16, dur: 60 },
    { at: c.heat - 4, file: "mixkit-1489-whoosh-air.mp3", vol: 0.26, dur: 50 },
    { at: c.heat, file: "mixkit-855-drill-electric.mp3", vol: 0.12, dur: c.wore - c.heat + 20, fadeIn: 8, fadeOut: 20 },
    { at: c.breaks, file: "mixkit-1686-boom-underground-echo.mp3", vol: 0.4, dur: 100 },
    { at: c.breaks + 2, file: "mixkit-403-rock-debris-falling.mp3", vol: 0.18, dur: 50, fadeOut: 14 },
    { at: c.above, file: "mixkit-2604-whoosh-deep-air.mp3", vol: 0.24, dur: 60 },
    { at: c.above + 28, file: "mixkit-2568-ui-click-tone.mp3", vol: 0.3, dur: 20 },
    { at: c.wore + 8, file: "mixkit-2297-rumble-bass-hum.mp3", vol: 0.22, dur: 60, fadeOut: 30 },
    { at: c.deform - 4, file: "mixkit-1493-whoosh-swirl.mp3", vol: 0.24, dur: 50 },
    { at: c.alu - 4, file: "mixkit-1489-whoosh-air.mp3", vol: 0.24, dur: 50 },
    { at: c.alu + 14, file: "mixkit-2356-ui-pop-dry.mp3", vol: 0.24, dur: 20 },
    { at: c.chart, file: "mixkit-2604-whoosh-deep-air.mp3", vol: 0.22, dur: 60 },
    { at: c.trip - 4, file: "mixkit-1493-whoosh-swirl.mp3", vol: 0.28, dur: 50 },
    { at: c.up, file: "mixkit-2604-whoosh-deep-air.mp3", vol: 0.34, dur: 60 },
    { at: c.up, file: "mixkit-403-rock-debris-falling.mp3", vol: 0.16, dur: c.down - c.up + 44, fadeOut: 14 },
    { at: c.down, file: "mixkit-1489-whoosh-air.mp3", vol: 0.32, dur: 50 },
    { at: c.down + 44, file: "mixkit-2358-ui-pop-long.mp3", vol: 0.3, dur: 20 },
  ];
};

