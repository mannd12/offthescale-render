// L12 closer (storyboard §3 "Closer": shots Z-01…Z-09 + E-01, script lines 67-71 incl. the L13 tease, Act IV).
// Families: studio (the 1-m ball; key art IV = Z-03) → dusk summit at sunrise → void Earth disc → petrol tease → the
// 20-s end card on the dusk dark field (kit `EndCard`: wordmark left, right half clear for YouTube's end-screen tiles).
// Numbers drawn, each a row in episodes/L12-mountain-limit/sources.md:
//   Earth as a 1-m ball: Everest < 1 mm (0.69) · Mars ball 0.53 m, Olympus Mons ~2 mm · Vesta pebble 4 cm, bump 1.6 mm
//   (#27) · ~9 km ceiling (#9) · 8,848.86 m (#1) · +2 mm a year (#6) · the tease question (#28).
// F14: a magnifier shows a bump ENLARGED ("MAGNIFIED" on screen); the balls themselves show nothing; the Vesta pebble's
// bump is drawn at true proportion.
import React from "react";
import { useCurrentFrame } from "remotion";
import {
  Bloom,
  Dissolve,
  EndCard,
  Form,
  GroundShadow,
  HazeBand,
  Inset,
  Layer,
  Motes,
  P,
  Pill,
  Ripples,
  Sky,
  Stage,
  Stars,
  Tick,
  alpha,
  cameraAt,
  circlePath,
  crawl,
  fall,
  lane,
  loadIllustratedFonts,
  mixHex,
  pulse,
  ridgePath,
  seaSurface,
  smooth,
} from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { L12_COLORS, MARS, familyOf, pillFill } from "../families";
import { cueKit } from "../cues";
import { HEIGHTS, L12Gauge } from "../L12Gauge";
import { FossilShell } from "../props";
import { SUMMIT, Summit } from "../Summit";
import { ShotDef, ShotFC, playShots } from "../shots";
import { CycClouds, EarthDisc, Lit, Pop, REPLAY_DISC, STUDIO_SET, Vesta } from "./S08";
import { Cue, SFX, cutHit } from "./cue-types";

loadIllustratedFonts();

/** Frames of end card after the last line (E-01: 20 s). */
export const closerTail = 600;

const S = STUDIO_SET; // the coloured studio set (polish pass (a), 2026-11-11; defined in S08)
const DUSK = familyOf("dusk");
const VOID = familyOf("void");
const PETROL = familyOf("petrol");
const CARD = DUSK;

export const cuesCloser = (t: SceneTiming) => {
  const { at, p, end } = cueKit(t);
  const teaseLine = Math.min(4, t.lines.length - 1);
  return {
    start: at(0), // Z-01: the 1-m ball (MATCH from M-01's Earth disc)
    inset: p(0, "a bump less than"), // the magnifier
    ceiling: p(0, "That's the ceiling"), // Z-02 CUT: inside the magnifier
    mars: at(1), // Z-03 CUT: the Mars ball (key art IV)
    touch: p(1, "about two millimetres"),
    pebble: p(1, "Vesta would be"), // Z-04 CUT: the pebble
    feel: p(1, "you could feel"),
    summit: at(2), // Z-05 CUT: the summit at sunrise
    river: p(2, "lifted by a river"), // Z-06 pull out
    ceilingLine: p(2, "about as high"), // Z-07
    disc: at(3), // Z-08 DIS: the Earth disc
    tease: at(teaseLine), // Z-09 DIS: the L13 tease (#28); follows vo.json when the line is voiced
    grin: p(teaseLine, "gives up"),
    endCard: end(t.lines.length - 1, 6), // E-01
    end: t.frames + closerTail,
  };
};
export type CCloser = ReturnType<typeof cuesCloser>;

// ------------------------------------------------------------------------------------------------------------
// Studio pieces

const FLOOR = 895;
const PPM = 270; // Tick's scale in the ball shots: the 1-m ball is 270 px across and reaches Tick's chest
const BONE_BALL = "#F6ECD8";
const MARS_BALL = "#D08A56";

const Room: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Layer depth={0.05}>
      <Sky family={S} />
      <Bloom x={220} y={20} r={900} color="#FFE4A8" strength={0.55 * pulse(f, 130, 0.1, 5)} spread={0.3} squash={0.8} />
    </Layer>
    <Layer depth={0.2}>
      <CycClouds f={f} y={130} seed={7} />
    </Layer>
    <Layer depth={0.3} haze={{ color: S.haze, amount: 0.35 }}>
      <path d={ridgePath([[-400, FLOOR - 120], [150, FLOOR - 190], [640, FLOOR - 140], [1150, FLOOR - 210], [1650, FLOOR - 150], [2320, FLOOR - 190]], FLOOR + 400, 80)} fill={S.far} />
    </Layer>
    <Layer depth={0.6} haze={{ color: S.haze, amount: 0.15 }}>
      <path d={ridgePath([[-400, FLOOR - 40], [300, FLOOR - 80], [900, FLOOR - 50], [1500, FLOOR - 90], [2320, FLOOR - 60]], FLOOR + 400, 80)} fill={S.mid} />
    </Layer>
    <Layer depth={1}>
      <rect x={-600} y={FLOOR} width={3200} height={700} fill={S.near} />
      <rect x={-600} y={FLOOR} width={3200} height={6} fill={mixHex(S.near, S.light, 0.4)} />
    </Layer>
  </>
);

/** A matte model ball on the floor: one lit mass (key 225, warm bounce on the far edge) and a contact shadow. */
const Ball: React.FC<{ x: number; r: number; fill: string; y?: number }> = ({ x, r, fill, y = FLOOR - r }) => (
  <g>
    <GroundShadow x={x + r * 0.3} y={FLOOR + 2} rx={r * 1.05} ry={r * 0.15} color={S.shadow} opacity={0.42} blur={r > 60 ? 16 : 8} />
    <Lit d={circlePath(x, y, r)} cx={x} cy={y} R={r} fill={fill} family={S} light={225} fillRim={S.bounce} depth={0.75} rim="#FFFFFF" />
  </g>
);

/** What a magnifier shows, drawn around `at`: the ball's surface as a near-flat arc and the bump on it, enlarged. */
const BumpView: React.FC<{ at: [number, number]; fill: string; h: number; w: number; dot?: boolean; f: number; flat?: boolean }> = ({ at, fill, h, w, dot = true, f, flat = false }) => {
  const [x, y] = at;
  const s = y + 34;
  const hump = flat
    ? `M${x - w / 2} ${s + 4} C${x - w * 0.3} ${s - h * 0.5} ${x - w * 0.12} ${s - h} ${x} ${s - h} C${x + w * 0.12} ${s - h} ${x + w * 0.3} ${s - h * 0.5} ${x + w / 2} ${s + 4} Z`
    : `M${x - w / 2} ${s + 4} L${x - w * 0.22} ${s - h * 0.5} L${x - w * 0.06} ${s - h * 0.92} L${x} ${s - h} L${x + w * 0.07} ${s - h * 0.86} L${x + w * 0.24} ${s - h * 0.45} L${x + w / 2} ${s + 4} Z`;
  return (
    <g>
      <rect x={x - 400} y={y - 400} width={800} height={800} fill={S.sky[1]} />
      <circle cx={x} cy={s + 1400} r={1400} fill={fill} />
      <path d={hump} fill={mixHex(fill, S.shadow, 0.12)} />
      <path d={hump} fill={mixHex(fill, S.shadow, 0.3)} opacity={0.5} transform={`translate(${w * 0.05} 0)`} clipPath={undefined} />
      <path d={`M${x - 400} ${s + 2} Q${x} ${s - 2} ${x + 400} ${s + 2}`} fill="none" stroke={S.light} strokeWidth={2} opacity={0.9} />
      {dot ? <circle cx={x} cy={s - h - 3} r={4.5 + Math.sin(f / 9) * 0.8} fill={P.vermilion} /> : null}
    </g>
  );
};

// ------------------------------------------------------------------------------------------------------------
// Shots

/** Z-01: the Earth as a bone ball one metre across beside Tick; a magnifier finds Everest: under a millimetre (#27). */
const ShotBall: ShotFC<CCloser> = ({ f, len, c }) => {
  const bx = 720;
  const by = FLOOR - 135;
  const bump: [number, number] = [bx - 87, by - 103];
  const MZ = REPLAY_DISC.r / 135;
  const cam = cameraAt(f, [
    { f: 0, x: bx - (REPLAY_DISC.x - 960) / MZ, y: by - (REPLAY_DISC.y - 540) / MZ, zoom: MZ }, // MATCH: the ball sits on M-01's Earth disc
    { f: 14, x: bx - (REPLAY_DISC.x - 960) / MZ, y: by - (REPLAY_DISC.y - 540) / MZ + 6, zoom: MZ * 0.97 },
    { f: 62, x: 930, y: 610, zoom: 1.0 },
    { f: len + 20, x: 900, y: 600, zoom: 1.07 },
  ]);
  const i0 = c.inset - c.start;
  const insetT = smooth(f, i0 - 6, i0 + 18);
  const point = smooth(f, 40, 70);
  return (
    <Pop f={f}>
      <Stage theme={S.theme} cam={cam} vignette={0.1} grain={0.5}>
        <Room f={f} />
        <Layer depth={1}>
          <Ball x={bx} r={135} fill={BONE_BALL} />
          <GroundShadow x={1000} y={FLOOR - 1} rx={PPM * 0.4} color={S.shadow} opacity={0.4} blur={8} />
          <Tick x={1010} y={FLOOR} pxPerM={PPM} frame={f} facing={-1} pose="stand" poseTo="point" poseT={point * 1.6} expression="proud" look={0.5} seed={2} outline={S.shadow} />
          <Motes frame={f} n={26} x={60} y={60} w={1700} h={760} color={S.light} seed={7} size={5} drift={40} />
          <Inset cx={330} cy={400} r={150} at={bump} scale={1} family={S} t={insetT} metric={{ value: "< 1", unit: "mm" /* #27: 0.69 mm */ }}>
            <BumpView at={bump} fill={BONE_BALL} h={22} w={120} f={f} />
          </Inset>
        </Layer>
        <Layer depth={0}>
          <g opacity={smooth(f, 50, 70)}>
            <Pill x={120} y={128} text="EVEREST · EARTH AS A 1-m BALL" fill={pillFill(S)} color={S.light} dot={P.vermilion} size={19} />
            <L12Gauge family={S} value={HEIGHTS.everest /* #1 */} readout={false} base="ABOVE SEA LEVEL" />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

/** Z-02: inside the magnifier: the bump with the summit dot; about nine kilometres, magnified (#9 #27, F14). */
const ShotBump: ShotFC<CCloser> = ({ f, len }) => {
  const bx = 250;
  const by = FLOOR - 135;
  const bump: [number, number] = [bx + 70, by - 115];
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.0 },
    { f: len + 10, x: 990, y: 540, zoom: 1.08 },
  ]);
  const grow = smooth(f, 0, 14);
  const rise = smooth(f, 10, 50);
  return (
    <Pop f={f}>
      <Stage theme={S.theme} cam={cam} vignette={0.1} grain={0.5}>
        <Room f={f} />
        <Layer depth={1}>
          <Ball x={bx} r={135} fill={BONE_BALL} />
          <Motes frame={f} n={22} x={60} y={60} w={1700} h={760} color={S.light} seed={9} size={3} drift={30} />
          <Inset cx={900} cy={470} r={300} at={bump} scale={2.6} family={S} t={0.6 + 0.4 * grow}>
            <BumpView at={bump} fill={BONE_BALL} h={30 * (0.7 + 0.3 * rise)} w={150} f={f} />
          </Inset>
          {/* the height bracket beside the bump, inside the lens */}
          <g opacity={rise}>
            <line x1={1010} y1={470 + 34 * 2.6} x2={1010} y2={470 + (34 - 30) * 2.6} stroke={S.text} strokeWidth={3} />
            <line x1={998} y1={470 + 34 * 2.6} x2={1022} y2={470 + 34 * 2.6} stroke={S.text} strokeWidth={3} />
            <line x1={998} y1={470 + 4 * 2.6} x2={1022} y2={470 + 4 * 2.6} stroke={S.text} strokeWidth={3} />
          </g>
        </Layer>
        <Layer depth={0}>
          <Pill x={900} y={850} text="~9 km · MAGNIFIED" fill={pillFill(S)} color={S.light} dot={P.vermilion} size={22} align="middle" />
          <L12Gauge family={S} value={HEIGHTS.everest /* #1 */} readout={false} ceiling={{ v: 9000 /* #9 */ }} />
        </Layer>
      </Stage>
    </Pop>
  );
};

/** Z-03 (key art IV): the Mars ball, half the size, beside the Earth ball; Tick leans in between them, a fingertip on
 *  the Mars bump; two magnifiers. Olympus Mons: about two millimetres (#27). */
const ShotMars: ShotFC<CCloser> = ({ f, len, c }) => {
  const ex = 590;
  const er = 135; // 1 m
  const mr = 0.53 * 135; // #27: the Mars ball is 0.53 m
  const mx = 1012;
  const my = FLOOR - mr;
  const tx = 868;
  const eBump: [number, number] = [ex - 87, FLOOR - er - 103];
  const mBump: [number, number] = [mx - mr * 0.34, my - mr * 0.94];
  const cam = cameraAt(f, [
    { f: 0, x: 950, y: 560, zoom: 1.02 },
    { f: len + 10, x: 985, y: 572, zoom: 1.12 },
  ]);
  const t0 = c.touch - c.mars;
  const poke = f > t0 ? Math.sin(Math.min(1, (f - t0) / 14) * Math.PI) : 0;
  const insetT = smooth(f, 6, 26);
  const lean = smooth(f, 0, 22);
  return (
    <Pop f={f}>
      <Stage theme={S.theme} cam={cam} vignette={0.1} grain={0.5}>
        <Room f={f} />
        <Layer depth={1}>
          <Ball x={ex} r={er} fill={BONE_BALL} />
          <GroundShadow x={tx + 6} y={FLOOR - 1} rx={PPM * 0.42} color={S.shadow} opacity={0.42} blur={8} />
          <Tick x={tx} y={FLOOR + poke * 3} pxPerM={PPM} frame={f} pose="stand" poseTo="press" poseT={lean * 1.6} expression="happy" look={0.9} seed={2} outline={S.shadow} headTilt={8 + poke * 5} />
          <Ball x={mx} r={mr} fill={MARS_BALL} />
          <Motes frame={f} n={26} x={60} y={60} w={1700} h={760} color={S.light} seed={7} size={5} drift={40} />
          {/* the Earth's magnifier stays from Z-01, quiet (no metric) */}
          <Inset cx={290} cy={400} r={112} at={eBump} scale={1} family={S} t={1}>
            <BumpView at={eBump} fill={BONE_BALL} h={14} w={90} f={f} />
          </Inset>
          <Inset cx={1390} cy={420} r={160} at={mBump} scale={1} family={S} t={insetT} metric={{ value: "~2", unit: "mm" /* #27: 1.7-2.0 mm */ }}>
            <BumpView at={mBump} fill={MARS_BALL} h={34} w={236} f={f} flat />
          </Inset>
          <g opacity={insetT}>
            <Pill x={1390} y={420 - 160 - 34} text="MAGNIFIED" fill={pillFill(S)} color={S.light} size={17} align="middle" />
          </g>
        </Layer>
        <Layer depth={0}>
          <g opacity={insetT}>
            <Pill x={960} y={990} text="OLYMPUS MONS · MARS AS A 0.5-m BALL" fill={pillFill(S)} color={S.light} dot={MARS.mid} size={21} align="middle" />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

/** Z-04: Tick large, a 4-cm Vesta pebble on its mitten; the magnifier shows the bump at true proportion: 1.6 mm (#27). */
const ShotPebble: ShotFC<CCloser> = ({ f, len, c }) => {
  const ppm = 520;
  const tx = 1230;
  const ty = 1440;
  const lift = Math.sin(f / 26) * 6; // Tick weighs the pebble
  const hand: [number, number] = [tx - 0.36 * ppm, ty - 1.04 * ppm];
  const pr = 0.02 * ppm; // 4 cm across (#27: 4.1 cm)
  const peb: [number, number] = [hand[0] - 8, hand[1] - 0.085 * ppm - pr + 2];
  const cam = cameraAt(f, [
    { f: 0, x: 950, y: 560, zoom: 1.0 },
    { f: len + 10, x: 930, y: 550, zoom: 1.07 },
  ]);
  const fe = c.feel - c.pebble;
  const insetT = smooth(f, 4, 24);
  const feel = smooth(f, fe - 6, fe + 10);
  const pebble = <Vesta cx={peb[0]} cy={peb[1]} R={pr} frame={f} rot={0} poleDeg={300} dish={1} peak={1} lump={0.6} family={S} light={225} fill="#A48E72" fillRim={S.bounce} bloom={false} craters={false} />;
  return (
    <Pop f={f}>
      <Stage theme={S.theme} cam={cam} vignette={0.1} grain={0.5}>
        <Layer depth={0.05}>
          <Sky family={S} />
          <Bloom x={220} y={20} r={900} color="#FFE4A8" strength={0.55 * pulse(f, 130, 0.1, 5)} spread={0.3} squash={0.8} />
        </Layer>
        <Layer depth={0.2}>
          <CycClouds f={f} y={110} seed={9} />
        </Layer>
        <Layer depth={0.4} haze={{ color: S.haze, amount: 0.3 }}>
          <path d={ridgePath([[-400, 820], [300, 740], [900, 800], [1500, 730], [2320, 790]], 1500, 90)} fill={S.far} />
        </Layer>
        <Layer depth={0.7} haze={{ color: S.haze, amount: 0.12 }}>
          <path d={ridgePath([[-400, 940], [400, 890], [1000, 930], [1600, 880], [2320, 920]], 1500, 90)} fill={S.mid} />
        </Layer>
        <Layer depth={1}>
          <g transform={`translate(0 ${lift.toFixed(1)})`}>
            <Tick x={tx} y={ty} pxPerM={ppm} frame={f} facing={-1} pose="hold" expression="happy" look={0.8} seed={2} headTilt={6 + 4 * feel} />
            {pebble}
          </g>
          <Motes frame={f} n={24} x={60} y={60} w={1700} h={900} color={S.light} seed={11} size={3} drift={30} />
          <Inset cx={470} cy={470} r={236} at={[peb[0], peb[1] + lift]} scale={15} family={S} t={insetT} metric={{ value: "4", unit: "cm" /* #27 */ }}>
            <rect x={peb[0] - 60} y={peb[1] - 60} width={120} height={160} fill={S.sky[1]} />
            <g transform={`translate(0 ${lift.toFixed(1)})`}>{pebble}</g>
          </Inset>
        </Layer>
        <Layer depth={0}>
          <g opacity={insetT}>
            <Pill x={470} y={176} text="VESTA" fill={pillFill(S)} color={S.light} dot="#A48E72" size={21} align="middle" />
          </g>
          <g opacity={feel}>
            <text x={760} y={330} style={{ fontFamily: "'Anton', sans-serif", fontSize: 24, letterSpacing: 3, fill: S.dim }}>
              BUMP · 1.6 mm
            </text>
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

/** The void Earth disc (Z-08): the bump is invisible at this scale; the gauge's last tick fades. */
const DiscView: React.FC<{ f: number }> = ({ f }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.12 },
    { f: 320, x: 960, y: 540, zoom: 0.84 },
  ]);
  return (
    <Stage theme={VOID.theme} cam={cam} vignette={0.3} grain={0.45}>
      <Layer depth={0.05}>
        <Sky family={VOID} />
        <Stars frame={f} n={220} w={1920} h={1080} color={VOID.text} seed={41} size={1.3} twinkle={0.7} />
        <Bloom x={-120} y={-80} r={1100} color={VOID.light} strength={0.4 * pulse(f, 150, 0.08, 3)} spread={0.22} />
        <Motes frame={f} n={40} x={0} y={120} w={1920} h={760} color={VOID.light} seed={14} size={1.8} drift={12} />
      </Layer>
      <Layer depth={1}>
        <Ripples frame={f} cx={960} cy={540} rx={620} ry={620} period={70} count={3} color={VOID.light} width={2} strength={0.22} />
        <EarthDisc cx={960} cy={540} r={300} frame={f} />
      </Layer>
      <Layer depth={0}>
        <L12Gauge family={VOID} value={HEIGHTS.everest /* #1 */} readout={false} opacity={1 - smooth(f, 30, 110)} />
      </Layer>
    </Stage>
  );
};

/** Z-05 → Z-07 (one pull-out), then the dissolve into Z-08: Tick holds the shell up at sunrise; the river carries the
 *  range away below; the dashed ceiling crosses the whole range at ~9 km (#2 #6 #9 #1). */
const ShotSummit: ShotFC<CCloser> = ({ f, c }) => {
  const r0 = c.river - c.summit;
  const l0 = c.ceilingLine - c.summit;
  const d0 = c.disc - c.summit;
  const DIS = 40;
  if (f >= d0 + DIS) return <DiscView f={f - d0} />;
  const cam = cameraAt(f, [
    { f: 0, x: 936, y: 100, zoom: 17 }, // the massif is a depth-0.6 layer: 17^0.6 = 5.5x on the summit
    { f: r0 - 20, x: 936, y: 106, zoom: 14 },
    { f: r0 + 60, x: 940, y: 470, zoom: 1.25 },
    { f: l0 + 10, x: 940, y: 560, zoom: 0.8 },
    { f: d0 + DIS, x: 940, y: 600, zoom: 0.6 },
  ]);
  const snow = fall(f, 70, 2400, 1300, 4, 0.9, 14);
  const lineT = smooth(f, l0, l0 + 30);
  const counterO = 1 - smooth(f, r0 + 10, r0 + 40);
  const nudge = -3 * smooth(f, r0, l0); // the peak rides up a hair while the land around it lowers
  const lower = 5 * smooth(f, r0, l0);
  const mm = 2 * Math.min(1, (f % 90) / 60); // the +2 mm counter (#6), a year per loop
  const specks = lane(f, 16, 300, 1700, 2.2, 5);
  const riv = "M240 1010 C520 960 700 1040 960 1000 S1420 950 1740 1030";
  const hand: [number, number] = [SUMMIT.x + 0.36 * 40, SUMMIT.y - 1.04 * 40];
  const body = (
    <Stage theme={DUSK.theme} cam={cam} vignette={0.22} grain={0.5}>
      <g transform={`translate(0 ${nudge.toFixed(2)})`}>
        <Summit f={f} family={DUSK} light={10} sun={{ x: 1560, y: 540 }} sunGlow={1.2 * pulse(f, 90, 0.06, 2)} tick={{ pxPerM: 40, pose: "hold", expression: "proud", look: 0.6 }} spot={f > r0 + 50} />
      </g>
      <Layer depth={0.6}>
        <g transform={`translate(0 ${nudge.toFixed(2)})`}>
          <FossilShell x={hand[0] + 1} y={hand[1] - 5} r={4.6} family={DUSK} light={10} rot={-14} />
          <g opacity={counterO} transform={`translate(${SUMMIT.x + 34} ${SUMMIT.y - 46})`}>
            <rect x={-4} y={-13} width={62} height={18} rx={3} fill={alpha(DUSK.shadow, 0.7)} />
            <text x={0} y={0} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 11, fill: DUSK.text, fontVariantNumeric: "tabular-nums" }}>
              +{mm.toFixed(1)} mm
            </text>
          </g>
        </g>
        {/* Z-07: the dashed ceiling across the whole range, a hair above the summit (~9 km, #9) */}
        <g opacity={lineT}>
          <line x1={-700} y1={SUMMIT.y - 18} x2={-700 + 3400 * lineT} y2={SUMMIT.y - 18} stroke={DUSK.text} strokeWidth={4} strokeDasharray="22 16" />
        </g>
      </Layer>
      {/* Z-06: the river at the foot of the range, carrying specks away; the foreground lowers a hair */}
      <Layer depth={1}>
        <g transform={`translate(0 ${lower.toFixed(2)})`}>
          <path d={ridgePath([[-700, 1010], [-200, 950], [300, 990], [800, 960], [1300, 1000], [1800, 950], [2600, 1000]], 1700, 60)} fill={DUSK.near} />
          <path d={riv} fill="none" stroke={L12_COLORS.seaGlass} strokeWidth={18} strokeLinecap="round" opacity={0.95} />
          <path d={riv} fill="none" stroke={DUSK.light} strokeWidth={3} strokeDasharray="14 22" strokeDashoffset={crawl(f, 1.6)} strokeLinecap="round" opacity={0.9} />
          {specks.map((s) => (
            <circle key={s.i} cx={s.x} cy={1002 + Math.sin(s.x / 160) * 22} r={3} fill={DUSK.text} opacity={0.7 * (1 - s.phase)} />
          ))}
        </g>
      </Layer>
      <Layer depth={0.6}>
        {snow.map((p, i) => (
          <circle key={i} cx={p.x - 240} cy={p.y - 300} r={0.5 + p.r * 0.35} fill="#FFFFFF" opacity={0.6} />
        ))}
      </Layer>
      <Layer depth={0}>
        <g opacity={lineT}>
          <Pill x={150} y={150} text="~9 km" fill={pillFill(DUSK)} color={DUSK.text} dot={DUSK.light} size={22} />
        </g>
        <g opacity={smooth(f, r0 + 30, r0 + 60)}>
          <L12Gauge family={DUSK} value={HEIGHTS.everest /* #1 */} readout="8,848.86 m" ceiling={lineT > 0.1 ? { v: 9000 /* #9 */ } : null} />
        </g>
      </Layer>
    </Stage>
  );
  if (f < d0) return <Pop f={f}>{body}</Pop>;
  return <Dissolve t={(f - d0) / DIS} from={body} to={<DiscView f={f - d0} />} dir="up" />;
};

/** Z-09: the tease of L13 (#28): a petrol sea under a moon, one ring crossing it; Tick covers its ears, then grins. */
const ShotTease: ShotFC<CCloser> = ({ f, len, c }) => {
  const DIS = 34;
  const d0 = c.tease - c.disc; // how long the disc had been on screen
  const g0 = c.grin - c.tease;
  const grin = smooth(f, g0, g0 + 20);
  const cam = cameraAt(f, [
    { f: 0, x: 980, y: 540, zoom: 1.0 },
    { f: Math.max(60, len) + 10, x: 930, y: 530, zoom: 1.1 },
  ]);
  const horizon = 600;
  const ringAge = (f % 150) / 150;
  const sea = (
    <Stage theme={PETROL.theme} cam={cam} vignette={0.28} grain={0.45}>
      <Layer depth={0.05}>
        <Sky family={PETROL} />
        <Stars frame={f} n={120} w={1920} h={520} color={PETROL.text} seed={17} size={1.3} twinkle={0.7} />
        <Bloom x={1480} y={220} r={620} color={PETROL.light} strength={0.5 * pulse(f, 110, 0.08, 4)} spread={0.3} />
        <Bloom x={1480} y={220} r={150} color="#F4FBF2" strength={0.95} spread={0.45} core={54} coreColor="#F6FCF4" />
      </Layer>
      <Layer depth={0.3} haze={{ color: PETROL.haze, amount: 0.3 }}>
        <path d={ridgePath([[900, horizon], [1150, horizon - 46], [1400, horizon - 18], [1700, horizon - 60], [2320, horizon - 10]], horizon + 20, 30)} fill={PETROL.far} />
      </Layer>
      <Layer depth={0.7}>
        <path d={seaSurface(f, -500, 2500, horizon, 3, 300, 0.8, 1700)} fill={PETROL.mid} />
        <HazeBand y={horizon - 10} h={120} color={PETROL.haze} strength={0.35} up />
        {/* moon glitter */}
        {Array.from({ length: 9 }, (_, i) => (
          <rect key={i} x={1480 - 70 + ((i * 37) % 60) - i * 6} y={horizon + 18 + i * 34} width={140 + i * 14 - ((i * 53) % 50)} height={5} rx={2.5} fill={PETROL.light} opacity={0.22 + 0.18 * Math.sin(f / 9 + i * 1.7)} />
        ))}
        {/* the one ring, crossing the sea */}
        <ellipse cx={1180} cy={horizon + 170} rx={1100 * ringAge} ry={190 * ringAge} fill="none" stroke={PETROL.second} strokeWidth={7 * (1 - ringAge * 0.6)} opacity={(1 - ringAge) * 0.9} />
        <ellipse cx={1180} cy={horizon + 170} rx={1100 * ringAge * 0.94} ry={190 * ringAge * 0.94} fill="none" stroke={PETROL.light} strokeWidth={2} opacity={(1 - ringAge) * 0.5} />
      </Layer>
      <Layer depth={1}>
        <path d={seaSurface(f, -500, 2500, 880, 5, 260, 1.2, 1700)} fill={PETROL.near} opacity={0.9} />
        {/* the shore */}
        <Form d={ridgePath([[-500, 760], [-100, 742], [260, 760], [520, 800], [700, 870], [860, 990], [980, 1200]], 1400, 40)} fill={mixHex(PETROL.near, PETROL.shadow, 0.3)} light={300} shadow={PETROL.shadow} inset={30} shadowOpacity={0.5} rim={PETROL.light} rimWidth={3} rimOpacity={0.7} bounce={PETROL.bounce} />
        <GroundShadow x={300} y={762} rx={60} color={PETROL.shadow} opacity={0.5} blur={8} />
        <Tick x={300} y={762} pxPerM={150} frame={f} pose="cover-ears" poseTo="cheer" poseT={grin * 1.6} expression="scared" expressionTo="happy" expressionT={grin} look={0.6} seed={5} outline={PETROL.shadow} />
        <Motes frame={f} n={24} x={0} y={100} w={1920} h={700} color={PETROL.light} seed={19} size={2.2} drift={16} />
      </Layer>
      <Layer depth={0}>
        <g opacity={smooth(f, DIS, DIS + 20)}>
          <Pill x={120} y={128} text="NEXT · HOW LOUD CAN A SOUND GET?" fill={pillFill(PETROL)} color={PETROL.text} dot={PETROL.second} size={22} />
        </g>
      </Layer>
    </Stage>
  );
  if (f >= DIS) return sea;
  return <Dissolve t={f / DIS} from={<DiscView f={d0 + f} />} to={sea} dir="up" />;
};

/** E-01: the end card on the dusk dark field, sparse snow motes, the bloom pulse; right half clear. */
const EndCardShot: React.FC<{ f: number; len: number }> = ({ f, len }) => {
  const snow = fall(f, 30, 1920, 1080, 8, 0.6, 12);
  return (
    <Stage theme={CARD.theme} drift={false} vignette={0.3} grain={0.4}>
      <Layer depth={0.05}>
        <Sky stops={[CARD.sky[0], CARD.sky[1]]} />
        <Stars frame={f} n={80} w={1920} h={700} color={CARD.text} seed={21} size={1.3} twinkle={0.7} />
      </Layer>
      <Layer depth={1}>
        {snow.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r * 0.8} fill="#FFFFFF" opacity={0.4} />
        ))}
        <Motes frame={f} n={24} x={60} y={80} w={1800} h={900} color={CARD.light} seed={9} size={3} drift={40} />
      </Layer>
      <Layer depth={0}>
        <EndCard t={Math.min(1, f / Math.max(1, len))} family={CARD} sub="Next: How loud can a sound get?" />
      </Layer>
    </Stage>
  );
};

export const SceneCloser: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesCloser(t);
  if (f >= c.endCard) return <EndCardShot f={f - c.endCard} len={c.end - c.endCard} />;
  const shots: ShotDef<CCloser>[] = [
    { from: 0, S: ShotBall, id: "Z-01" },
    { from: c.ceiling, S: ShotBump, id: "Z-02" },
    { from: c.mars, S: ShotMars, id: "Z-03" },
    { from: c.pebble, S: ShotPebble, id: "Z-04" },
    { from: c.summit, S: ShotSummit, id: "Z-05" },
    { from: c.tease, S: ShotTease, id: "Z-09" },
  ];
  return playShots(f, shots, c, c.endCard);
};

export const soundCloser = (t: SceneTiming): Cue[] => {
  const c = cuesCloser(t);
  return [
    ...cutHit(0), // the MATCH from M-01's disc
    { at: c.inset, file: SFX.popLong, vol: 0.24, dur: 30 },
    { at: c.inset + 16, file: SFX.chime, vol: 0.18, dur: 60 },
    ...cutHit(c.ceiling),
    { at: c.ceiling + 12, file: SFX.click, vol: 0.2, dur: 16 },
    ...cutHit(c.mars),
    { at: c.mars + 8, file: SFX.pop, vol: 0.22, dur: 20 },
    { at: c.touch, file: SFX.pop, vol: 0.24, dur: 20 },
    ...cutHit(c.pebble),
    { at: c.feel, file: SFX.chime, vol: 0.2, dur: 60 },
    ...cutHit(c.summit),
    { at: c.summit, file: SFX.wind, vol: 0.16, dur: c.disc - c.summit + 30, fadeIn: 20, fadeOut: 40 },
    ...[0, 30, 60].map((o) => ({ at: c.summit + 20 + o, file: SFX.click, vol: 0.14, dur: 12 })),
    { at: c.river + 10, file: SFX.swirl, vol: 0.16, dur: 60 },
    { at: c.ceilingLine + 6, file: SFX.chime, vol: 0.2, dur: 60 },
    { at: c.disc + 14, file: SFX.boom, vol: 0.2, dur: 150, fadeOut: 60 },
    { at: c.tease, file: SFX.swirl, vol: 0.22, dur: 50 },
    { at: c.grin + 6, file: SFX.chime, vol: 0.2, dur: 60 },
    { at: c.endCard + 20, file: SFX.boom, vol: 0.22, dur: 120, fadeOut: 60 },
    { at: c.endCard + 30, file: SFX.chime, vol: 0.16, dur: 60 },
  ];
};
