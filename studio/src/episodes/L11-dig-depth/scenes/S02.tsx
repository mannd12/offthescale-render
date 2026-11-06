// L11 scene l02 "Too far to turn" (episodes/L11-dig-depth/script.md §2). Bespoke shots; episode-local props from S01.
// Numbers drawn, each a row in episodes/L11-dig-depth/sources.md:
//   10 km, where bottom motors beat spinning from the top (#9) · steel for the top ~2 km, then aluminium (#10) ·
//   round trips of the whole string to change a bit (#12). Light from the upper left.
import React from "react";
import { useCurrentFrame } from "remotion";
import { SceneTiming } from "../../../lib/timeline";
import { BONE, CornerTicks, GRAPHITE, Gauge, IF, Layer, P, ReferenceFigure, ScaleBar, Stage, bob, cameraAt, crawl, labelStyle, lit, mixHex, ptsToPath, ramp, rnd, shade, specks, tint } from "../../../lib/illustrated";
import { Cue } from "./cue-types";
import { Bit, Crystals, Derrick, E, K, Land, LongSection, SEC, SecGauge, ShotDef, ShotFC, Turbine, cueKit, lerp, playShots, rockTone, secY } from "./S01";

const l02Cues = (t: SceneTiming) => {
  const { at, p } = cueKit(t);
  return {
    motor: p(0, "or put a motor", -2),
    calc: p(0, "The Kola team", -4),
    past10: p(0, "past ten", -2),
    worse: p(0, "the worse way"),
    turbine: at(1) - 6,
    above: p(1, "right above"),
    light: p(1, "And the pipe", -4),
    below: p(1, "Below the first", -4),
    switched: p(1, "switched"),
    wear: at(2) - 6,
    trip: p(2, "And every new bit", -4),
    up: p(2, "pulled up"),
    down: p(2, "sent back down"),
    end: t.frames,
  };
};
type C2 = ReturnType<typeof l02Cues>;

// Shot 1 - "spin the whole pipe from the top": the rotary table on the rig floor turns; twist marks run down the pipe
const ShotTop: ShotFC<C2> = ({ f, len }) => {
  const G = 820;
  const cam = cameraAt(f, [
    { f: 0, x: 980, y: 420, zoom: 1.25 },
    { f: len + 10, x: 960, y: 560, zoom: 1.05 },
  ]);
  const rot = f * 8;
  return (
    <Stage theme={BONE} cam={cam}>
      <Land f={f + 900} G={G - 260} seed={14} birds={false} />
      <Layer depth={1}>
        <rect x={-700} y={G - 260} width={3400} height={1000} fill={K.tundra} />
        <Derrick x={1000} G={G} h={720} spin={f * 1.4} hall={false} />
        {/* rig floor + rotary table */}
        <rect x={700} y={G - 40} width={600} height={40} fill={lit(tint(E.a, P.bone, 0.3), 0.1)} />
        <rect x={1060} y={G - 40} width={240} height={40} fill={shade(tint(E.a, P.bone, 0.3), 0.3)} />
        <ellipse cx={1000} cy={G - 44} rx={120} ry={26} fill={K.metal} />
        <ellipse cx={1000} cy={G - 44} rx={120} ry={26} fill="none" stroke={shade(K.metal, 0.4)} strokeWidth={4} />
        {Array.from({ length: 8 }, (_, i) => {
          const a = ((rot + i * 45) * Math.PI) / 180;
          const vis = Math.sin(a) > -0.2;
          return vis ? <rect key={i} x={1000 + Math.cos(a) * 100 - 6} y={G - 44 + Math.sin(a) * 20 - 4} width={12} height={8} fill={shade(K.metal, 0.5)} /> : null;
        })}
        <rect x={990} y={G - 200} width={20} height={160} fill={K.steel} />
        {/* big rotation arrow */}
        <g transform={`translate(1000 ${G - 120})`}>
          <path d={`M-170 0 A170 44 0 0 0 150 22`} fill="none" stroke={P.ink} strokeWidth={8} strokeDasharray="30 16" strokeDashoffset={crawl(f, 3)} />
          <path d="M150 22 L118 2 L128 38 Z" fill={P.ink} />
        </g>
        <ReferenceFigure x={760} y={G - 40} pxPerM={60} breath={f} look={0.4} />
      </Layer>
      <Layer depth={0}>
        <text x={110} y={170} style={labelStyle(60, P.ink, 4)} opacity={ramp(f, 4, 14)}>
          Turn from the top
        </text>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 2 - "or put a motor at the bottom": down in the hole, a motor block just above the bit; only the bit turns
const ShotBottom: ShotFC<C2> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 420, zoom: 1.0 },
    { f: len + 10, x: 960, y: 520, zoom: 1.1 },
  ]);
  return (
    <Stage theme={GRAPHITE} cam={cam} vignette={0.3}>
      <Layer depth={1}>
        <Crystals x={-500} y={-400} w={2900} h={1900} cell={120} seed={41} f={f} />
        <rect x={-500} y={-400} width={2900} height={1900} fill={P.graphite} opacity={0.3} />
        <rect x={700} y={-400} width={520} height={1300} fill={K.hole} />
        <rect x={1170} y={-400} width={50} height={1300} fill={shade(E.a, 0.5)} />
        <rect x={940} y={-400} width={40} height={460} fill={K.alu} />
        <Turbine x={960} y={60} w={200} h={420} f={f} />
        <Bit x={960} y={840} s={1.8} spin={f} />
      </Layer>
      <Layer depth={0}>
        <text x={110} y={170} style={labelStyle(60, P.chalk, 4)} opacity={ramp(f, 2, 12)}>
          Motor at the bottom
        </text>
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// Shot 3a/3b - the comparison: two strings side by side; a 10 km line sweeps down; below it the top-spun one fails (#9)
const Compare: React.FC<{ f: number; len: number; c: C2; zoomed: boolean }> = ({ f, len, c, zoomed }) => {
  const top = 160;
  const ppk = 60;
  const xs = [700, 1240];
  const base = zoomed ? c.past10 : c.calc;
  const sweep = zoomed ? 10 : lerp(f, 4, c.past10 - c.calc, 0, 10);
  const xMark = zoomed ? ramp(f, c.worse - c.past10, c.worse - c.past10 + 12) : 0;
  const cam = zoomed
    ? cameraAt(f, [
        { f: 0, x: 960, y: top + 10 * ppk - 40, zoom: 1.6 },
        { f: len + 10, x: 960, y: top + 10 * ppk, zoom: 1.75 },
      ])
    : cameraAt(f, [
        { f: 0, x: 960, y: 540, zoom: 1.0 },
        { f: len + 10, x: 960, y: 560, zoom: 1.03 },
      ]);
  void base;
  const ly = top + sweep * ppk;
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={1}>
        <rect x={-1000} y={-1000} width={4000} height={1000 + top} fill={K.sky} />
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={-1000} y={top + i * 1.5 * ppk} width={4000} height={1.5 * ppk + 1} fill={rockTone(i / 12, i)} />
        ))}
        {specks(f, 30, 1920, 900, 52, 4).map((p, i) => (
          <circle key={i} cx={p.x} cy={top + 20 + p.y} r={p.r * 0.6} fill={tint(E.a, P.ink, 0.3)} opacity={0.45} />
        ))}
        <line x1={-1000} y1={top} x2={3000} y2={top} stroke={P.ink} strokeWidth={2.5} />
        {xs.map((x, k) => {
          const failed = k === 0 && xMark > 0;
          const deep = 11.5;
          return (
            <g key={k}>
              <rect x={x - 6} y={top} width={12} height={deep * ppk} fill={K.hole} />
              <line x1={x} y1={top - 30} x2={x} y2={top + deep * ppk} stroke={mixHex(K.steel, P.bone, failed ? 0.5 : 0)} strokeWidth={4} />
              {/* turning marks: from the top they fade with depth; with a bottom motor only the end turns */}
              {Array.from({ length: 22 }, (_, i) => {
                const d = ((i * 0.55 + f * 0.04) % 11.5) + 0.05;
                const op = k === 0 ? Math.max(0, 1 - d / 12) * (1 - xMark * 0.7) : d > 10.6 ? 1 : 0;
                return <line key={i} x1={x - 11} y1={top + d * ppk - 5} x2={x + 11} y2={top + d * ppk + 5} stroke={P.ink} strokeWidth={2.5} opacity={op} />;
              })}
              {k === 0 ? (
                <g transform={`translate(${x} ${top - 40})`}>
                  <path d="M-46 0 A46 14 0 0 0 40 8" fill="none" stroke={P.ink} strokeWidth={4} strokeDasharray="10 6" strokeDashoffset={crawl(f, 2)} />
                  <path d="M40 8 L28 0 L30 14 Z" fill={P.ink} />
                </g>
              ) : (
                <rect x={x - 10} y={top + 10.8 * ppk} width={20} height={0.6 * ppk} fill={lit(K.amber, 0.1)} />
              )}
              <path d={`M${x - 9} ${top + deep * ppk - 4} L${x + 9} ${top + deep * ppk - 4} L${x} ${top + deep * ppk + 12} Z`} fill={P.ink} />
              {!zoomed ? (
                <text x={x + 70} y={top - 20} textAnchor="start" style={labelStyle(40, P.ink, 3)}>
                  {k === 0 ? "Top" : "Bottom"}
                </text>
              ) : null}
            </g>
          );
        })}
        {/* the sweep line, then it rests at 10 km */}
        <line x1={-1000} y1={ly} x2={3000} y2={ly} stroke={P.ink} strokeWidth={3} strokeDasharray="16 10" strokeDashoffset={crawl(f, 1.2)} />
        <text x={zoomed ? 1260 : 1500} y={ly - 16} style={labelStyle(zoomed ? 30 : 44, P.ink, 3)}>
          10 km
        </text>
        {xMark > 0 ? (
          <g stroke={P.ink} strokeWidth={8} strokeLinecap="round" opacity={xMark}>
            <line x1={xs[0] - 40 * xMark} y1={ly + 50 - 40 * xMark} x2={xs[0] + 40 * xMark} y2={ly + 50 + 40 * xMark} />
            <line x1={xs[0] + 40 * xMark} y1={ly + 50 - 40 * xMark} x2={xs[0] - 40 * xMark} y2={ly + 50 + 40 * xMark} />
          </g>
        ) : null}
        {xMark > 0 ? (
          <path d={`M${xs[1] - 30} ${ly + 50} L${xs[1] - 10} ${ly + 72} L${xs[1] + 32} ${ly + 22}`} fill="none" stroke={P.ink} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" opacity={xMark} />
        ) : null}
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};
const ShotCompare: ShotFC<C2> = (p) => <Compare {...p} zoomed={false} />;
const ShotCompare10: ShotFC<C2> = (p) => <Compare {...p} zoomed />;

// Shot 4 - the turbine, cut away, right above the bit: blades slide one way, mud runs down, the bit spins (#9)
const ShotTurbine: ShotFC<C2> = ({ f, len, c }) => {
  const a0 = c.above - c.turbine;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 300, zoom: 1.3 },
    { f: a0, x: 960, y: 480, zoom: 1.1 },
    { f: len + 10, x: 960, y: 640, zoom: 1.2 },
  ]);
  const lab = ramp(f, 6, 16);
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={1}>
        <Crystals x={-500} y={-400} w={2900} h={1900} cell={96} seed={44} f={f} />
        <rect x={720} y={-400} width={480} height={1600} fill={K.hole} />
        <rect x={1150} y={-400} width={50} height={1600} fill={shade(E.a, 0.5)} />
        <rect x={944} y={-400} width={32} height={420} fill={K.alu} />
        <rect x={962} y={-400} width={14} height={420} fill={shade(K.alu, 0.25)} />
        <Turbine x={960} y={20} w={240} h={600} f={f} />
        <Bit x={960} y={900} s={1.5} spin={f} />
        {/* the cut-rock floor */}
        <rect x={720} y={930} width={480} height={400} fill={rockTone(0.8)} />
      </Layer>
      <Layer depth={0}>
        <g opacity={lab}>
          <line x1={1240} y1={420} x2={1460} y2={330} stroke={P.ink} strokeWidth={2.5} />
          <text x={1470} y={340} style={labelStyle(54, P.ink, 4)}>
            Turbine
          </text>
        </g>
        <g opacity={ramp(f, a0, a0 + 10)}>
          <line x1={1240} y1={860} x2={1460} y2={860} stroke={P.ink} strokeWidth={2.5} />
          <text x={1470} y={876} style={labelStyle(54, P.ink, 4)}>
            Bit
          </text>
        </g>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 5 - "the pipe had to be light": a steel joint and an aluminium joint on a balance; steel sinks (no numbers)
const ShotBalance: ShotFC<C2> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.12 },
    { f: len + 10, x: 960, y: 520, zoom: 1.0 },
  ]);
  const tilt = lerp(f, 6, 30, 0, 9) + Math.sin(f / 9) * Math.max(0, 1 - f / 60) * 2 + Math.sin(f / 40) * 0.4;
  const cx = 960;
  const cy = 520;
  const arm = 520;
  const tr = (tilt * Math.PI) / 180;
  const ends = [-1, 1].map((s) => ({ x: cx + s * arm * Math.cos(tr), y: cy + s * arm * Math.sin(tr) }));
  const Pipe: React.FC<{ x: number; y: number; col: string; name: string }> = ({ x, y, col, name }) => (
    <g>
      <line x1={x} y1={y} x2={x} y2={y + 140} stroke={P.ink} strokeWidth={3} />
      <rect x={x - 200} y={y + 140} width={400} height={56} fill={lit(col, 0.18)} />
      <rect x={x - 200} y={y + 172} width={400} height={24} fill={shade(col, 0.25)} />
      <rect x={x + 200} y={y + 132} width={44} height={72} fill={shade(col, 0.15)} />
      <text x={x} y={y + 270} textAnchor="middle" style={labelStyle(48, P.ink, 4)}>
        {name}
      </text>
    </g>
  );
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={0.3}>
        <rect x={-600} y={880} width={3200} height={600} fill={P.boneDeep} />
        {specks(f, 20, 1920, 700, 61, 6).map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={tint(E.b, P.bone, 0.55)} opacity={0.5} />
        ))}
      </Layer>
      <Layer depth={1}>
        <path d={`M${cx - 70} 880 L${cx + 70} 880 L${cx + 10} ${cy} L${cx - 10} ${cy} Z`} fill={lit(K.metal, 0.1)} />
        <path d={`M${cx} 880 L${cx + 70} 880 L${cx + 10} ${cy} L${cx} ${cy} Z`} fill={shade(K.metal, 0.3)} />
        <line x1={ends[0].x} y1={ends[0].y} x2={ends[1].x} y2={ends[1].y} stroke={P.ink} strokeWidth={10} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={16} fill={P.ink} />
        <Pipe x={ends[0].x} y={ends[0].y} col={K.alu} name="Aluminium" />
        <Pipe x={ends[1].x} y={ends[1].y} col={K.steel} name="Steel" />
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 6 - back on the long section: the string's top ~2 km turns dark steel, the rest pale aluminium (#10)
const ShotSteel: ShotFC<C2> = ({ f, len, c }) => {
  const s0 = c.switched - c.below;
  const cam = cameraAt(f, [
    { f: 0, x: 980, y: 300, zoom: 2.4 },
    { f: len + 10, x: 1000, y: 330, zoom: 2.7 },
  ]);
  const k = ramp(f, s0 - 10, s0 + 10);
  const two = secY(2);
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={1}>
        <LongSection f={f} drill={11} steel={k > 0.5} />
        <SecGauge value={0} x={720} />
        <g opacity={k}>
          <line x1={SEC.HX + 18} y1={two} x2={SEC.HX + 120} y2={two} stroke={P.ink} strokeWidth={2} strokeDasharray="5 4" />
          <text x={SEC.HX + 30} y={secY(1) + 8} style={labelStyle(22, P.ink, 2)}>
            Steel
          </text>
          <text x={SEC.HX + 30} y={secY(3) + 8} style={labelStyle(22, P.ink, 2)}>
            Aluminium
          </text>
        </g>
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 7 - "bits wear out": the bit close up, teeth grinding down tooth by tooth, chips and dust
const ShotWear: ShotFC<C2> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 640, zoom: 1.5 },
    { f: len + 10, x: 960, y: 700, zoom: 1.7 },
  ]);
  const wear = lerp(f, 4, len - 4, 0, 1);
  return (
    <Stage theme={GRAPHITE} cam={cam} vignette={0.3}>
      <Layer depth={1}>
        <rect x={-500} y={-400} width={2900} height={1900} fill={mixHex(P.graphite, E.a, 0.25)} />
        <Crystals x={-500} y={900} w={2900} h={600} cell={70} seed={51} f={f} />
        <rect x={-500} y={900} width={2900} height={6} fill={lit(rockTone(0.5), 0.3)} />
        <g transform={`translate(${Math.sin(f * 2.7) * 2} 0)`}>
          <Bit x={960} y={880} s={2.2} spin={f} wear={wear} />
        </g>
        {Array.from({ length: 16 }, (_, i) => {
          const age = (f * 1.4 + i * 9) % 36;
          const sd = i % 2 ? 1 : -1;
          return <rect key={i} x={960 + sd * (80 + age * 8 + rnd(i) * 30)} y={900 - age * 4 + age * age * 0.12} width={6 + rnd(i) * 6} height={6} fill={i % 3 ? tint(E.a, P.bone, 0.4) : K.metal} opacity={1 - age / 36} />;
        })}
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// Shot 8 - the round trip: the whole string runs up out of the hole (a figure racks the stands), then back down (#12)
const ShotTrip: ShotFC<C2> = ({ f, len, c }) => {
  const u0 = c.up - c.trip;
  const d0 = c.down - c.trip;
  const tip = f < d0 ? lerp(f, u0 - 6, d0 - 2, 12, 0) : lerp(f, d0, len, 0, 12);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.0 },
    { f: len + 10, x: 940, y: 580, zoom: 1.06 },
  ]);
  const going = f >= u0 - 6;
  const dir = f < d0 ? -1 : 1;
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={1}>
        <LongSection f={f} drill={12} tip={tip} />
        <SecGauge value={tip} />
        {going
          ? [0, 1, 2].map((i) => {
              const y = secY(Math.max(0.3, tip * (0.25 + i * 0.25)));
              return <path key={i} d={dir < 0 ? `M${SEC.HX + 30} ${y + 14} L${SEC.HX + 44} ${y} L${SEC.HX + 58} ${y + 14}` : `M${SEC.HX + 30} ${y - 14} L${SEC.HX + 44} ${y} L${SEC.HX + 58} ${y - 14}`} fill="none" stroke={P.ink} strokeWidth={4} opacity={0.5 + 0.5 * Math.sin(f / 4 + i)} />;
            })
          : null}
        {/* pipe stands racked beside the rig as they come out */}
        {Array.from({ length: Math.round((1 - tip / 12) * 14) }, (_, i) => (
          <line key={i} x1={SEC.HX + 110 + i * 7} y1={SEC.SY - 6} x2={SEC.HX + 118 + i * 7} y2={SEC.SY - 70} stroke={i < 3 ? K.steel : K.alu} strokeWidth={4} />
        ))}
      </Layer>
      <Layer depth={0}>
        <text x={1440} y={1000} style={labelStyle(52, P.ink, 4)} opacity={ramp(f, 4, 14)}>
          Round trip
        </text>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

export const SceneL02: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = l02Cues(t);
  const shots: ShotDef<C2>[] = [
    { from: 0, S: ShotTop },
    { from: c.motor, S: ShotBottom },
    { from: c.calc, S: ShotCompare },
    { from: c.past10, S: ShotCompare10 },
    { from: c.turbine, S: ShotTurbine },
    { from: c.light, S: ShotBalance },
    { from: c.below, S: ShotSteel },
    { from: c.wear, S: ShotWear },
    { from: c.trip, S: ShotTrip },
  ];
  return playShots(f, shots, c, t.frames);
};

export const soundL02 = (t: SceneTiming): Cue[] => {
  const c = l02Cues(t);
  return [
    { at: 0, file: "mixkit-855-drill-electric.mp3", vol: 0.1, dur: c.motor + 2, fadeIn: 8, fadeOut: 4 },
    { at: c.motor - 4, file: "mixkit-1489-whoosh-air.mp3", vol: 0.22, dur: 50 },
    { at: c.motor, file: "mixkit-855-drill-electric.mp3", vol: 0.08, trim: 1, dur: c.calc - c.motor, fadeOut: 4 },
    { at: c.calc - 2, file: "mixkit-2356-ui-pop-dry.mp3", vol: 0.24, dur: 20 },
    { at: c.past10 - 4, file: "mixkit-1493-whoosh-swirl.mp3", vol: 0.24, dur: 50 },
    { at: c.worse + 2, file: "mixkit-2568-ui-click-tone.mp3", vol: 0.3, dur: 20 },
    { at: c.turbine - 4, file: "mixkit-2604-whoosh-deep-air.mp3", vol: 0.26, dur: 60 },
    { at: c.turbine, file: "mixkit-2297-rumble-bass-hum.mp3", vol: 0.22, dur: c.light - c.turbine, fadeIn: 8, fadeOut: 10 },
    { at: c.above + 2, file: "mixkit-2568-ui-click-tone.mp3", vol: 0.26, dur: 20 },
    { at: c.light - 2, file: "mixkit-2356-ui-pop-dry.mp3", vol: 0.26, dur: 20 },
    { at: c.light + 20, file: "mixkit-2358-ui-pop-long.mp3", vol: 0.22, dur: 20 },
    { at: c.below - 4, file: "mixkit-1489-whoosh-air.mp3", vol: 0.22, dur: 50 },
    { at: c.switched, file: "mixkit-2568-ui-click-tone.mp3", vol: 0.3, dur: 20 },
    { at: c.wear - 2, file: "mixkit-403-rock-debris-falling.mp3", vol: 0.22, dur: c.trip - c.wear + 4, fadeOut: 8 },
    { at: c.wear, file: "mixkit-855-drill-electric.mp3", vol: 0.1, trim: 2, dur: c.trip - c.wear, fadeOut: 6 },
    { at: c.trip - 4, file: "mixkit-1493-whoosh-swirl.mp3", vol: 0.22, dur: 50 },
    { at: c.up - 6, file: "mixkit-2604-whoosh-deep-air.mp3", vol: 0.28, dur: 60 },
    { at: c.down, file: "mixkit-2604-whoosh-deep-air.mp3", vol: 0.24, dur: 60 },
  ];
};
