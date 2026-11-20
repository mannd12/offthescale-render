// L18 scene "l08" (storyboard §3 "8 · What is measured, and what is a model", script lines 41-49). Package B.
// The board stretch (8-01-8-11) is ONE board world: the evidence board with its MEASURED and MODEL columns and eight sheets; each
// shot is a camera that GLIDES over it (2-4 px/f on screen) onto the sheet whose drawing runs (pulse, deal, orbit, slider, circle,
// stretch, curve, cloud). No shot there is longer than 5.6 s, and each has a drawing head, a slam, a slider or a dot stream.
// ShotDefs (hard cuts; PUSH / SLIDE rows are phases): 8-01 · 8-02 (+8-03, 8-04) · 8-05 · 8-06 · 8-07 (+8-08) · 8-09 · 8-10 · 8-11 ·
// 8-12 · 8-13 · 8-14 · 8-15 (+8-16, 8-17) · 8-18 · 8-19.
// Numbers drawn (all data18 READ): ABOUT 3 CM (#4 A, 8-02) · ABOUT 250 MILES, 90 MIN (#3 A, 8-04) · 3.8 CM A YEAR (#4 A, 8-14) ·
// ABOUT 4.5 BILLION YEARS AGO (#17 A, 8-17). Words only: SIZE, MASS, DENSITY, SURFACE GRAVITY + NASA FACT SHEET chip (#1), STIFF / FLUID
// (#6), ONE POINT, ONE CIRCLE and IGNORED (#10, #11), NO TIDE HEIGHT GIVEN (#10: the tide ruler is left blank, F3, F6), A SIMULATION
// QUESTION (#18: empty digit boxes, no numbers), NOT POSSIBLE (#4, #15, #17; Q8), MOVING AWAY (#4), NASA SAYS + A HUGE OBJECT (#17),
// ONE IDEA (#15, Q9). Line 45 lost "Nobody has seen…": 8-10 draws the blank ruler only. F12: NASA appears as words only.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Bloom, Kicker, Layer, Motes, Sky, Stage, Tick, cameraAt, walkPhase } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { familyOf, pillFill } from "../families";
import { READ } from "../data18";
import { DistGauge, MARKS, MoonToken, railY } from "../gauge";
import { Arrow18, DebrisRing } from "../tidal";
import { AgencyPill, Board18, FlipTag, Sheet18, SourceChip, WordPill, flipFor } from "../tags18";
import { BandedGiant, EarthDisc, EarthLimb, StationToken } from "../planets18";
import { DotFlow, StarsTint18 } from "../movers18";
import { LaserDots, Tape } from "../icons18";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { C, FamSky, INK, Label, NightSky, PaperGrid, Pop, ReadHead, Readout, StrikeX, alpha, clamp01, drawn, ez, fr, lin, logLerp, mod, ping, rnd, runOf } from "./b-parts";

export const cuesL08 = (t: SceneTiming) => {
  const { at, p } = cueKit(t);
  return {
    s801: 0,
    s802: p(0, "The Moon's distance is known"),
    s803: p(0, "Its size, its mass"),
    s804: at(1),
    s805: at(2),
    s806: p(2, "with two idealized extremes"),
    s807: at(3),
    s808: p(3, "They ignore that the Earth would be stretched too"),
    s809: at(4),
    s810: p(4, "stops working this close"),
    s811: at(5),
    s812: at(6),
    s813: p(6, "Measurements show it is moving the other way"),
    s814: p(6, "at about three point eight centimeters a year"),
    s815: at(7),
    s816: p(7, "when a huge object hit the young Earth"),
    s817: p(7, "about four and a half billion years ago"),
    s818: p(7, "And one NASA idea for Saturn's rings"),
    s819: at(8),
    end: t.frames,
  };
};
export type C08 = ReturnType<typeof cuesL08>;

const BRD = familyOf("board");
const ABY = familyOf("abyss");
const TAN = familyOf("tangerine");
const PF = pillFill(BRD);

// ===============================================================================================================
// the board world (world coords at zoom 1; the board is 40..1880 × 40..1040)
// ===============================================================================================================
type Box = { x: number; y: number; w: number; h: number };
const SH: Record<"A" | "C" | "D" | "E" | "F" | "G" | "H", Box> = {
  A: { x: 90, y: 190, w: 400, h: 280 }, // DISTANCE (8-02)
  C: { x: 90, y: 500, w: 400, h: 280 }, // STATION (8-04)
  D: { x: 1000, y: 190, w: 410, h: 280 }, // ROCHE LINES (8-05, 8-06)
  E: { x: 1440, y: 190, w: 410, h: 280 }, // POINT AND CIRCLE (8-07)
  F: { x: 1440, y: 500, w: 410, h: 280 }, // EARTH STRETCHED (8-08)
  G: { x: 1000, y: 500, w: 410, h: 280 }, // TIDE HEIGHT (8-09, 8-10)
  H: { x: 1000, y: 810, w: 850, h: 200 }, // SIMULATION (8-11)
};
const STRIPS = ["SIZE", "MASS", "DENSITY", "SURFACE GRAVITY"]; // #1, words only
const ctr = (b: Box, dy = 0): [number, number] => [b.x + b.w / 2, b.y + b.h / 2 + dy];

/** Keep the camera on the board (no edge of the world in frame). */
const clampCam = (x: number, y: number, z: number) => {
  const hw = 960 / z;
  const hh = 540 / z;
  return { x: Math.max(20 + hw, Math.min(1900 - hw, x)), y: Math.max(20 + hh, Math.min(1060 - hh, y)), zoom: z };
};

/** Everything on the board at scene frame F (sheets appear at their cues and keep their own animations running). */
const BoardWorld: React.FC<{ F: number; c: C08; header?: "MEASURED" | "MODEL"; headerFlip?: number }> = ({ F, c, header = "MEASURED", headerFlip = 1 }) => {
  const sheetA = lin(F, 8, 24);
  const pinA = lin(F, 30, 40);
  const stripAt = (i: number) => c.s803 + 6 + i * 9;
  const sC = lin(F, c.s804 - 14, c.s804);
  const wipe = clamp01((F - c.s805 - 6) * 30 / 920);
  const sD = lin(F, c.s805 + 30, c.s805 + 44);
  const pinD = lin(F, c.s805 + 52, c.s805 + 62);
  const sE = lin(F, c.s807 - 8, c.s807 + 4);
  const sF = lin(F, c.s808 - 10, c.s808 + 2);
  const sG = lin(F, c.s809 - 10, c.s809 + 2);
  const sH = lin(F, c.s811 - 10, c.s811 + 2);
  // A · DISTANCE: the ranging pulse, Earth → mirror dot → Earth (#4)
  const bodyA = (
    <g>
      <LaserDots x0={96} y0={104} x1={312} y1={104} f={F} period={30} />
      <EarthDisc x={56} y={104} r={40} f={F} spin={3} />
      <MoonToken x={340} y={104} r={30} f={F} />
      <rect x={309} y={98} width={12} height={12} rx={2} fill={C.lemon} stroke={INK} strokeWidth={2} />
    </g>
  );
  // C · STATION: a mini Earth, the station token orbiting 7 deg/f, a lap bar filling (#3)
  const a = (F * 7 * Math.PI) / 180;
  const bodyC = (
    <g>
      <ellipse cx={130} cy={108} rx={96} ry={48} fill="none" stroke={alpha(C.amber, 0.7)} strokeWidth={3} strokeDasharray="8 6" />
      {Math.sin(a) < 0 ? <StationToken x={130 + Math.cos(a) * 96} y={108 + Math.sin(a) * 48} size={34} f={F} angle={(a * 180) / Math.PI + 90} /> : null}
      <EarthDisc x={130} y={108} r={52} f={F} spin={3} />
      {Math.sin(a) >= 0 ? <StationToken x={130 + Math.cos(a) * 96} y={108 + Math.sin(a) * 48} size={34} f={F} angle={(a * 180) / Math.PI + 90} /> : null}
      <rect x={250} y={88} width={130} height={30} rx={15} fill={alpha(INK, 0.25)} />
      <rect x={254} y={92} width={122 * fr(F / (360 / 7))} height={22} rx={11} fill={C.lever} />
      <Label x={315} y={160} text="ONE LAP" size={20} color={INK} align="middle" />
    </g>
  );
  // D · ROCHE LINES: the slider knob between the two idealized ends, a dotted trail behind it (#6)
  const kx = 60 + 290 * ping(F * 11, 2 * 290);
  const bodyD = (
    <g>
      <line x1={60} y1={104} x2={350} y2={104} stroke={INK} strokeWidth={6} strokeLinecap="round" />
      <line x1={60} y1={60} x2={60} y2={150} stroke={C.lever} strokeWidth={8 + 3 * Math.sin(F * 0.3)} strokeLinecap="round" />
      <line x1={350} y1={60} x2={350} y2={150} stroke={C.model} strokeWidth={8 + 3 * Math.sin(F * 0.3 + 1)} strokeLinecap="round" strokeDasharray="14 8" />
      <Label x={60} y={186} text="STIFF" size={22} color={INK} align="middle" />
      <Label x={350} y={186} text="FLUID" size={22} color={INK} align="middle" />
      {Array.from({ length: 7 }, (_, i) => {
        const px = 60 + 290 * ping((F - (i + 1) * 3) * 11, 2 * 290);
        return <circle key={i} cx={px} cy={104} r={6} fill={C.lever} opacity={0.6 - i * 0.08} />;
      })}
      <circle cx={kx} cy={104} r={20} fill={C.pin} stroke={INK} strokeWidth={4} />
      <circle cx={kx - 6} cy={98} r={6} fill="#FFD9A0" />
    </g>
  );
  // E · ONE POINT, ONE CIRCLE: the Earth a single dot; the orbit draws itself; a dot rides it 6 deg/f (#10, #11)
  const kE = lin(F, c.s807 + 2, c.s807 + 30);
  const aE = ((F - c.s807) * 6 * Math.PI) / 180;
  const bodyE = (
    <g>
      <circle cx={205} cy={106} r={84} fill="none" stroke={INK} strokeWidth={5} {...drawn(kE)} transform="rotate(-90 205 106)" />
      <circle cx={205} cy={106} r={10} fill={C.earthDeep} />
      {kE >= 1 ? <circle cx={205 + Math.cos(aE) * 84} cy={106 + Math.sin(aE) * 84} r={14} fill={C.moonMid} stroke={INK} strokeWidth={3} /> : null}
    </g>
  );
  // F · EARTH STRETCHED: the Earth ball breathes toward the Moon under two pulsing arrows; IGNORED drops on (#10, #11)
  const st = 1 + 0.08 * (0.5 + 0.5 * Math.sin(F * 0.22));
  const bodyF = (
    <g>
      <ellipse cx={150} cy={106} rx={66 * st} ry={66 / st} fill={C.earthLimb} stroke={INK} strokeWidth={4} />
      <ellipse cx={130} cy={86} rx={26} ry={10} fill="#FFFFFF" opacity={0.4} />
      <MoonToken x={350} y={106} r={22} f={F} />
      <Arrow18 x0={150 + 70 * st} y0={70} x1={150 + 70 * st + 44 + 10 * Math.sin(F * 0.3)} y1={70} color={C.lever} width={9} outline={INK} />
      <Arrow18 x0={150 - 70 * st} y0={142} x1={150 - 70 * st - 30 - 8 * Math.sin(F * 0.3)} y1={142} color={C.amber} width={9} outline={INK} />
    </g>
  );
  // G · TIDE HEIGHT: a scaling curve draws, then breaks into marching dashes; the tide ruler stays blank (#10, F3)
  const kG = lin(F, c.s809 + 4, c.s809 + 44);
  const broken = F > c.s809 + 50;
  const curve = "M30 190 C120 186 190 170 230 130 S280 40 292 10";
  const bodyG = (
    <g>
      <path d={curve} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" {...(broken ? { strokeDasharray: "12 12", strokeDashoffset: -(F - c.s809) * 4 } : drawn(kG))} opacity={broken ? 0.55 : 1} />
      <rect x={326} y={14} width={54} height={180} rx={6} fill={C.lemon} stroke={INK} strokeWidth={3} />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={326} y1={24 + i * 20} x2={i % 2 ? 340 : 350} y2={24 + i * 20} stroke={INK} strokeWidth={2} />
      ))}
      <rect x={256} y={150} width={60} height={36} rx={6} fill="none" stroke={INK} strokeWidth={3} strokeDasharray="6 5" strokeDashoffset={-F * 2} />
    </g>
  );
  // H · SIMULATION: a swirling dot cloud and a row of empty digit boxes blinking (#18: no numbers)
  const bodyH = (
    <g>
      {Array.from({ length: 60 }, (_, i) => {
        const ang = rnd(i * 3) * Math.PI * 2 + F * (0.04 + rnd(i * 5) * 0.04) * (i % 2 ? 1 : -1);
        const rr = 10 + rnd(i * 7) * 56;
        return <circle key={i} cx={160 + Math.cos(ang) * rr * 1.7} cy={68 + Math.sin(ang) * rr * 0.9} r={3 + rnd(i * 11) * 3} fill={[C.moonMid, C.lever, C.moonShade][i % 3]} />;
      })}
      {Array.from({ length: 5 }, (_, i) => (
        <rect key={i} x={420 + i * 76} y={34} width={60} height={72} rx={8} fill={alpha(C.lemon, 0.6)} stroke={INK} strokeWidth={3} opacity={0.45 + 0.55 * Math.abs(Math.sin(F * 0.12 + i * 0.7))} />
      ))}
    </g>
  );
  return (
    <g>
      <Board18 x={40} y={40} w={1840} h={1000} f={F} header={ez(F, 0, 20)} />
      <FlipTag x={960} y={54} word={header} prev={header === "MODEL" ? "MEASURED" : "MODEL"} f={F} swing={6} flip={headerFlip} size={0.85} cord={36} />
      <Sheet18 {...SH.A} f={F} title="DISTANCE" band="lemon" appear={sheetA} pin={pinA} sway={0.6}>
        {bodyA}
      </Sheet18>
      {STRIPS.map((s, i) => (
        <Sheet18 key={s} x={520} y={190 + i * 74} w={400} h={64} f={F} title={s} band="lemon" appear={lin(F, stripAt(i), stripAt(i) + 8)} pin={lin(F, stripAt(i) + 8, stripAt(i) + 14)} tilt={(rnd(i * 3) - 0.5) * 3} />
      ))}
      <Sheet18 {...SH.C} f={F} title="STATION" band="sky" appear={sC} pin={lin(F, c.s804, c.s804 + 8)} sway={0.5}>
        {bodyC}
      </Sheet18>
      <Sheet18 {...SH.D} f={F} title="ROCHE LINES" band="sky" appear={sD} pin={pinD} sway={0.5}>
        {bodyD}
      </Sheet18>
      <Sheet18 {...SH.E} f={F} title="POINT AND CIRCLE" band="sky" appear={sE} pin={lin(F, c.s807, c.s807 + 8)} sway={0.5}>
        {bodyE}
      </Sheet18>
      <Sheet18 {...SH.F} f={F} title="EARTH STRETCHED" band="sky" appear={sF} pin={lin(F, c.s808 - 2, c.s808 + 6)} sway={0.5}>
        {bodyF}
      </Sheet18>
      <Sheet18 {...SH.G} f={F} title="TIDE HEIGHT" band="sky" appear={sG} pin={lin(F, c.s809 - 2, c.s809 + 6)} sway={0.5}>
        {bodyG}
      </Sheet18>
      <Sheet18 {...SH.H} f={F} title="SIMULATION" band="sky" appear={sH} pin={lin(F, c.s811 - 2, c.s811 + 6)} sway={0.3}>
        {bodyH}
      </Sheet18>
      {/* the MODEL column is unlit until 8-05 wipes it on (30 px/f) */}
      {wipe < 1 ? <rect x={960 + 920 * wipe} y={40} width={920 * (1 - wipe) + 10} height={1000} fill="#043A40" opacity={0.55} /> : null}
      {wipe > 0 && wipe < 1 ? <rect x={960 + 920 * wipe - 8} y={40} width={16} height={1000} fill={C.lemon} opacity={0.8} /> : null}
      {/* IGNORED drops onto the EARTH STRETCHED sheet (30 px/f) */}
      {F >= c.s808 + 6 ? (
        <g transform={`translate(0 ${(-200 * (1 - ez(F, c.s808 + 6, c.s808 + 16))).toFixed(1)}) rotate(${(-6 + 2 * Math.sin(F * 0.2)).toFixed(2)} 1645 760)`}>
          <WordPill x={1645} y={760} text="IGNORED" size={30} align="middle" fill={alpha(C.ink, 0.9)} dot={C.vermilion} />
        </g>
      ) : null}
    </g>
  );
};

/** A board shot: the world under a camera, plus the HUD and an optional foreground. */
const BoardShot: React.FC<{ f: number; F: number; c: C08; cam: { x: number; y: number; zoom: number }; header?: "MEASURED" | "MODEL"; headerFlip?: number; hud?: React.ReactNode; fg?: React.ReactNode }> = ({
  f,
  F,
  c,
  cam,
  header,
  headerFlip,
  hud,
  fg,
}) => (
  <Stage theme={BRD.theme} cam={clampCam(cam.x, cam.y, cam.zoom)} vignette={0.12} grain={0.5}>
    <Layer depth={0.2}>
      <FamSky name="board" />
      <Bloom x={300} y={-100} r={900} color="#FFE08A" strength={0.4} />
    </Layer>
    <Layer depth={1}>
      <BoardWorld F={F} c={c} header={header} headerFlip={headerFlip} />
    </Layer>
    <Layer depth={1.25}>
      <Motes frame={f} n={14} w={1920} h={1080} color="#FFE7A0" seed={4} size={3} drift={20} />
    </Layer>
    {fg ? <Layer depth={0}>{fg}</Layer> : null}
    {hud ? <Layer depth={0}>{hud}</Layer> : null}
  </Stage>
);

// 8-01 · the whole board: the column placards drop in, the header placard flips to MEASURED, the DISTANCE sheet slides in and
// Tick (≥ 40 % of the frame) pins it with a hammer-tap; the camera pushes in toward the left column.
const Shot801: ShotFC<C08> = ({ f, len, c }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: len, x: 820, y: 520, zoom: 1.12 },
  ]);
  const tap = f > 24 && f < 44 ? Math.abs(Math.sin((f - 24) * 0.5)) : 0;
  return (
    <Pop f={f}>
      <BoardShot
        f={f}
        F={c.s801 + f}
        c={c}
        cam={cam}
        header="MEASURED"
        headerFlip={flipFor(f, 10, 15)}
        fg={<Tick x={1240} y={1110} pxPerM={250} frame={f} facing={-1} pose={tap > 0.5 ? "press" : "point"} expression="determined" look={0.4} />}
        hud={<Kicker x={90} y={1010} text="— WHAT WE MEASURED" color={C.lemon} size={26} />}
      />
    </Pop>
  );
};

// 8-02 → 8-04 · one camera path: the DISTANCE sheet's pulse flies out to the mirror dot and back (ABOUT 3 CM + NASA chip); the
// camera slides to the four fact strips dealing in; then down to the STATION sheet (orbit 7 deg/f, the lap bar filling).
const Shot802: ShotFC<C08> = ({ f, c }) => {
  const b = c.s803 - c.s802;
  const d = c.s804 - c.s802;
  const [ax, ay] = ctr(SH.A, 20);
  const [cx2, cy2] = ctr(SH.C, 20);
  const cam = cameraAt(f, [
    { f: 0, x: ax - 30, y: ay, zoom: 2.0 },
    { f: b - 6, x: ax + 30, y: ay, zoom: 2.05 },
    { f: b + 16, x: 720, y: 330, zoom: 1.85 },
    { f: d - 8, x: 760, y: 350, zoom: 1.9 },
    { f: d + 14, x: cx2 - 20, y: cy2, zoom: 2.0 },
    { f: d + 200, x: cx2 + 40, y: cy2 - 20, zoom: 2.08 },
  ]);
  const hud =
    f < b ? (
      <g>
        <Readout x={80} y={100} value={READ.cm3.value! /* #4 A */} k={lin(f, 4, 30)} pre="ABOUT" unit="CM" size={84} w={360} plate={BRD.shadow} appear={lin(f, 0, 8)} who="8-02 ranging" />
        <SourceChip x={460} y={150} name="NASA" appear={lin(f, 8, 16)} />
      </g>
    ) : f < d ? (
      <SourceChip x={90} y={100} name="NASA FACT SHEET" appear={lin(f, b, b + 10)} size={24} />
    ) : (
      <g>
        <WordPill x={90} y={110} text={READ.miles250.text /* #3 A */} size={28} fill={PF} appear={lin(f, d, d + 10)} />
        <WordPill x={90} y={176} text="90 MIN" size={28} fill={PF} appear={lin(f, d + 8, d + 18)} />
      </g>
    );
  return (
    <Pop f={f}>
      <BoardShot f={f} F={c.s802 + f} c={c} cam={cam} hud={hud} />
    </Pop>
  );
};

// 8-05 · the header placard flips to MODEL, the right column wipes on (30 px/f), Tick walks across and pins ROCHE LINES.
const Shot805: ShotFC<C08> = ({ f, len, c }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: len, x: 1120, y: 520, zoom: 1.12 },
  ]);
  const w = ez(f, 4, 44);
  const tx = 640 + (1180 - 640) * w;
  const walking = f > 4 && f < 44;
  const tap = f > 48 && f < 66 ? Math.abs(Math.sin((f - 48) * 0.5)) : 0;
  return (
    <Pop f={f}>
      <BoardShot
        f={f}
        F={c.s805 + f}
        c={c}
        cam={cam}
        header="MODEL"
        headerFlip={flipFor(f, 6, 15)}
        fg={<Tick x={tx} y={1100} pxPerM={170} frame={f} facing={1} pose={walking ? "stand" : tap > 0.5 ? "press" : "point"} walk={walking ? walkPhase(f, 22) : undefined} expression="thinking" look={0.3} />}
        hud={<Kicker x={90} y={1010} text="— WHAT IS A MODEL" color={C.lemon} size={26} />}
      />
    </Pop>
  );
};

// 8-06 · close on ROCHE LINES: the knob slides between STIFF and FLUID (22 px/f on screen) with its dotted trail; ends pulse.
const Shot806: ShotFC<C08> = ({ f, len, c }) => {
  const [x, y] = ctr(SH.D, 20);
  const cam = cameraAt(f, [
    { f: 0, x: x - 40, y, zoom: 2.0 },
    { f: len, x: x + 40, y: y - 10, zoom: 2.12 },
  ]);
  return (
    <Pop f={f}>
      <BoardShot f={f} F={c.s806 + f} c={c} cam={cam} header="MODEL" hud={<WordPill x={90} y={110} text="SOMEWHERE BETWEEN" size={28} fill={PF} appear={lin(f, 6, 16)} />} />
    </Pop>
  );
};

// 8-07 + 8-08 · POINT AND CIRCLE: the orbit draws itself (40 px/f on screen) and a dot rides it; the camera pushes down to EARTH
// STRETCHED, where the Earth breathes under two arrows and IGNORED drops on.
const Shot807: ShotFC<C08> = ({ f, c }) => {
  const b = c.s808 - c.s807;
  const [ex, ey] = ctr(SH.E, 20);
  const [fx, fy] = ctr(SH.F, 20);
  const cam = cameraAt(f, [
    { f: 0, x: ex - 30, y: ey, zoom: 2.0 },
    { f: b - 10, x: ex, y: ey + 10, zoom: 2.05 },
    { f: b + 12, x: fx - 10, y: fy, zoom: 2.0 },
    { f: b + 120, x: fx + 30, y: fy - 10, zoom: 2.1 },
  ]);
  const hud = f < b ? <WordPill x={90} y={110} text="ONE POINT, ONE CIRCLE" size={28} fill={PF} appear={lin(f, 4, 14)} /> : null;
  return (
    <Pop f={f}>
      <BoardShot f={f} F={c.s807 + f} c={c} cam={cam} header="MODEL" hud={hud} />
    </Pop>
  );
};

// 8-09 · TIDE HEIGHT: the scaling curve draws (40 px/f on screen) then breaks into marching dashes; the ruler stays blank; Tick
// in the foreground shakes his head at it.
const Shot809: ShotFC<C08> = ({ f, len, c }) => {
  const [x, y] = ctr(SH.G, 20);
  const cam = cameraAt(f, [
    { f: 0, x: x - 50, y, zoom: 1.9 },
    { f: len, x: x + 30, y: y - 10, zoom: 2.05 },
  ]);
  const shake = Math.sin(f * 0.5) * (f > 40 ? 1 : 0);
  return (
    <Pop f={f}>
      <BoardShot
        f={f}
        F={c.s809 + f}
        c={c}
        cam={cam}
        header="MODEL"
        fg={<Tick x={1560} y={1120} pxPerM={170} frame={f} facing={-1} pose="hips" expression="determined" look={0.2 + 0.6 * shake} headTilt={10 * shake} />}
        hud={<WordPill x={90} y={110} text="NO TIDE HEIGHT GIVEN" size={28} fill={PF} appear={lin(f, 4, 14)} />}
      />
    </Pop>
  );
};

// 8-10 · close on the blank tide ruler: a scanning head runs up and down it (≈ 20 px/f on screen) and finds no figure; the empty
// readout box's dashes march. Line 45's last sentence was cut: nothing else is drawn here.
const Shot810: ShotFC<C08> = ({ f, len, c }) => {
  const rx = SH.G.x + 353;
  const ry0 = SH.G.y + 64 + 24;
  const ry1 = SH.G.y + 64 + 184;
  const cam = cameraAt(f, [
    { f: 0, x: rx - 120, y: (ry0 + ry1) / 2, zoom: 3.0 },
    { f: len, x: rx - 90, y: (ry0 + ry1) / 2 - 10, zoom: 3.15 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={BRD.theme} cam={clampCam(cam.x, cam.y, cam.zoom)} vignette={0.12} grain={0.5}>
        <Layer depth={0.2}>
          <FamSky name="board" />
        </Layer>
        <Layer depth={1}>
          <BoardWorld F={c.s810 + f} c={c} header="MODEL" />
          <ReadHead x0={rx} y0={ry0} x1={rx} y1={ry1} f={f} speed={7} r={6} color={C.lever} />
        </Layer>
        <Layer depth={0}>
          <WordPill x={90} y={110} text="THE SCALING STOPS WORKING" size={28} fill={PF} appear={lin(f, 4, 14)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// 8-11 · SIMULATION: the dot cloud swirls, the empty digit boxes blink; the camera glides along the strip.
const Shot811: ShotFC<C08> = ({ f, len, c }) => {
  const [x, y] = ctr(SH.H, 10);
  const cam = cameraAt(f, [
    { f: 0, x: x - 160, y, zoom: 1.8 },
    { f: len, x: x + 100, y: y - 10, zoom: 1.95 },
  ]);
  return (
    <Pop f={f}>
      <BoardShot f={f} F={c.s811 + f} c={c} cam={cam} header="MODEL" hud={<WordPill x={90} y={110} text="A SIMULATION QUESTION" size={28} fill={PF} appear={lin(f, 4, 14)} />} />
    </Pop>
  );
};

// ===============================================================================================================
// 8-12 · the board's lights drop to a black field with the rail; the placard flips to NOT POSSIBLE and rattles; Tick points at
// the rail. The hatch streams 16 px/f and the rail drifts. Line 47: "The real Moon is not coming closer" (#4).
// ===============================================================================================================
const Shot812: ShotFC<C08> = ({ f, len, c }) => {
  const center = logLerp(12400, 9000, lin(f, 0, len));
  const fl = flipFor(f, 16, 15);
  const rattle = f > 30 ? Math.max(0, 1 - (f - 30) / 40) : 0;
  return (
    <Pop f={f}>
      <Stage theme={ABY.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.006, panY: 0, frames: 150, seed: 41 }} vignette={0.22} grain={0.5}>
        <Layer depth={0.1}>
          <NightSky />
          <g opacity={1 - lin(f, 0, 14)}>
            <FamSky name="board" />
          </g>
        </Layer>
        <Layer depth={0.3}>
          <g opacity={lin(f, 6, 20)}>
            <StarsTint18 f={f} x={-300} y={-300} w={2520} h={1680} n={90} speed={10} angle={90} seed={21} />
          </g>
        </Layer>
        <Layer depth={1}>
          <DistGauge f={f} family={ABY} center={center} decade={300} x={1300} speed={16} token={MARKS.today.km} tokenR={34} lit={["station"]} />
          <FlipTag x={760} y={40} word="NOT POSSIBLE" prev="MODEL" f={f} swing={8} flip={fl} rattle={rattle} size={1.3} cord={110} />
          <Tick x={420} y={1000} pxPerM={170} frame={f} facing={1} pose="point" expression="determined" look={0.5} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// 8-13 · the rail in black space: the Moon token drifts up as the ticks stream down (camera rising); an arrow pulses above it.
const Shot813: ShotFC<C08> = ({ f, len }) => {
  const decade = 900;
  const center = logLerp(150000, 700000, lin(f, 0, len));
  const tok = center * Math.pow(10, 0.1 + 0.45 * lin(f, 0, len));
  const ty = railY(tok, center, decade);
  const pulse = 10 * Math.sin(f * 0.35);
  return (
    <Pop f={f}>
      <Stage theme={ABY.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0, panY: 0, frames: 110, seed: 42 }} vignette={0.22} grain={0.5}>
        <Layer depth={0.1}>
          <NightSky />
        </Layer>
        <Layer depth={0.3}>
          <StarsTint18 f={f} x={-300} y={-300} w={2520} h={1680} n={100} speed={10} angle={90} seed={22} />
        </Layer>
        <Layer depth={1}>
          <DistGauge f={f} family={ABY} center={center} decade={decade} x={1100} speed={14} token={tok} tokenR={44} />
          <Arrow18 x0={1180} y0={ty + 10} x1={1180} y1={ty - 110 - pulse} color={C.moonRim} width={14} outline="#000A10" />
        </Layer>
        <Layer depth={0}>
          <WordPill x={90} y={110} text="MOVING AWAY" size={30} appear={lin(f, 4, 14)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// 8-14 · a tape measure unrolls from beside the token (≈ 28 px/f) and Tick, walking backward on the TODAY ledge, keeps paying it
// out; 3.8 CM A YEAR rolls up; the rail keeps drifting (hatch 14 px/f) through the 1.5-s hold.
const Shot814: ShotFC<C08> = ({ f, len }) => {
  const decade = 600;
  const ledge = 560;
  const tapeY = ledge - 1.04 * 150;
  const center = MARKS.today.km * Math.pow(10, (tapeY - 540) / decade) * Math.pow(10, -0.06 * lin(f, 0, len));
  const tokY = railY(MARKS.today.km, center, decade);
  const L = 640 * ez(f, 0, 24) + 1.6 * Math.max(0, f - 24);
  const caseX = 1440;
  const tx = caseX - 40 - L - 30;
  return (
    <Pop f={f}>
      <Stage theme={ABY.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.004, panY: 0, frames: 170, seed: 43 }} vignette={0.22} grain={0.5}>
        <Layer depth={0.1}>
          <NightSky />
        </Layer>
        <Layer depth={0.3}>
          <StarsTint18 f={f} x={-300} y={-300} w={2520} h={1680} n={100} speed={6} angle={90} seed={23} />
        </Layer>
        <Layer depth={1}>
          <DistGauge f={f} family={ABY} center={center} decade={decade} x={1560} speed={14} token={MARKS.today.km} tokenR={40} lit={["today"]} />
          <rect x={120} y={ledge} width={1440} height={18} rx={9} fill={C.amber} />
          <rect x={120} y={ledge + 18} width={1440} height={10} rx={5} fill="#7A3A0C" />
          <Tape x={caseX} y={tapeY} length={L} unroll={1} f={f} rotate={180} />
          <Tick x={tx} y={ledge} pxPerM={150} frame={f} facing={1} pose="hold" walk={f > 24 ? -walkPhase(f, 40) : undefined} expression="thinking" look={0.3} headTilt={8} />
        </Layer>
        <Layer depth={0}>
          <Readout x={80} y={100} value={READ.recede38.value! /* #4 A */} k={lin(f, 6, 46)} unit="CM A YEAR" dec size={84} w={640} appear={lin(f, 0, 8)} who="8-14 recession" />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 8-15 → 8-17 · debris fountains rise off the young Earth's limb (24 px/f, NASA SAYS); a big rocky body slides in (40 px/f) and
// hits the limb, debris sprays; then on the survey paper a time strip scrolls (24 px/f) and ABOUT 4.5 BILLION YEARS AGO rolls up.
// ===============================================================================================================
const Fountain: React.FC<{ f: number; len: number; c: C08 }> = ({ f }) => (
  <Stage theme={ABY.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0, panY: -0.006, frames: 110, seed: 44 }} vignette={0.22} grain={0.5}>
    <Layer depth={0.1}>
      <NightSky />
    </Layer>
    <Layer depth={0.3}>
      <StarsTint18 f={f} x={-300} y={-300} w={2520} h={1680} n={90} speed={12} angle={180} seed={24} />
    </Layer>
    <Layer depth={1}>
      {[
        [760, 640, 1180, 60],
        [880, 630, 1500, 120],
        [700, 650, 860, 40],
        [980, 640, 1700, 280],
      ].map(([x0, y0, x1, y1], i) => (
        <DotFlow key={i} f={f} mode="line" from={[x0, y0]} to={[x1, y1]} n={36} speed={24} spread={30} colors={[C.moonGlow, C.moonLit, C.starApricot, C.lever]} size={6} seed={i + 30} />
      ))}
      <EarthLimb f={f} y={640} R={2400} cx={900} cloudSpeed={12} dark={0.35} />
    </Layer>
    <Layer depth={0}>
      <AgencyPill x={90} y={110} agency="NASA SAYS" appear={lin(f, 4, 14)} size={26} />
    </Layer>
  </Stage>
);
const Impact: React.FC<{ f: number; len: number; c: C08 }> = ({ f }) => {
  const hit = 22;
  const u = ez(f, 0, hit);
  const ix = -220 + (720 + 220) * u;
  const iy = -260 + (520 + 260) * u;
  const after = Math.max(0, f - hit);
  const flash = f >= hit ? Math.max(0, 1 - after / 16) : 0;
  return (
    <Stage theme={ABY.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0, panY: 0, frames: 90, seed: 45 }} vignette={0.22} grain={0.5}>
      <Layer depth={0.1}>
        <NightSky />
      </Layer>
      <Layer depth={0.3}>
        <StarsTint18 f={f} x={-300} y={-300} w={2520} h={1680} n={90} speed={12} angle={180} seed={25} />
      </Layer>
      <Layer depth={1}>
        <EarthLimb f={f} y={640} R={2400} cx={900} cloudSpeed={12} dark={0.35} />
        <g transform={`translate(${ix + after * 1.5} ${iy + after * 1.2})`}>
          <circle r={170} fill={C.giantBand2} stroke={C.moonRim} strokeWidth={5} />
          <circle cx={-50} cy={-60} r={110} fill={C.giantBand1} opacity={0.7} />
          <circle cx={40} cy={30} r={36} fill="#7A2E10" opacity={0.6} />
          <circle cx={-70} cy={50} r={22} fill="#7A2E10" opacity={0.6} />
        </g>
        {f >= hit
          ? [200, 230, 260, 290, 320].map((a, i) => (
              <DotFlow key={i} f={after} mode="line" from={[820, 610]} to={[820 + Math.cos((a * Math.PI) / 180) * 900, 610 + Math.sin((a * Math.PI) / 180) * 700]} n={26} speed={24} spread={26} colors={[C.moonGlow, C.lever, C.starApricot]} size={7} seed={i + 40} />
            ))
          : null}
        {flash > 0 ? <Bloom x={820} y={610} r={520} color="#FFE7A0" strength={0.9 * flash} /> : null}
      </Layer>
      <Layer depth={0}>
        <WordPill x={90} y={110} text="A HUGE OBJECT" size={28} appear={lin(f, 2, 12)} />
      </Layer>
    </Stage>
  );
};
const TimeStrip18: React.FC<{ f: number; len: number; c: C08 }> = ({ f }) => {
  const off = mod(f * 24, 240);
  const cols = ["#C4501A", "#9A3C14", "#FFC04E", "#EE8A2C", "#17A8A0"];
  return (
    <Stage theme={TAN.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0, panY: 0, frames: 90, seed: 46 }} vignette={0.12} grain={0.5}>
      <Layer depth={0.15}>
        <FamSky name="tangerine" />
      </Layer>
      <Layer depth={0.4}>
        <PaperGrid f={f} floor={940} />
      </Layer>
      <Layer depth={1}>
        <rect x={-200} y={560} width={2320} height={170} rx={20} fill="#5E2410" />
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={-480 + i * 240 + off} y={576} width={236} height={138} rx={10} fill={cols[i % cols.length]} />
        ))}
        {Array.from({ length: 48 }, (_, i) => (
          <line key={"t" + i} x1={-480 + i * 60 + off} y1={576} x2={-480 + i * 60 + off} y2={i % 4 === 0 ? 650 : 612} stroke="#2A0E04" strokeWidth={i % 4 === 0 ? 5 : 3} />
        ))}
        <path d="M1500 530 L1530 470 L1470 470 Z" fill={C.lemon} stroke="#2A0E04" strokeWidth={4} />
        <line x1={1500} y1={530} x2={1500} y2={740} stroke={C.lemon} strokeWidth={6} />
        <Label x={1500} y={800} text="TODAY" size={28} color="#2A0E04" align="middle" />
      </Layer>
      <Layer depth={0}>
        <Readout x={80} y={110} value={READ.ago45.value! /* #17 A */} k={lin(f, 4, 40)} pre="ABOUT" unit="BILLION YEARS AGO" dec size={90} w={980} plate={TAN.shadow} appear={lin(f, 0, 8)} who="8-17 formation" />
      </Layer>
    </Stage>
  );
};
const Shot815 = runOf<C08>((c) => [
  { at: c.s815, S: Fountain },
  { at: c.s816, S: Impact, dir: "left", blend: 10 },
  { at: c.s817, S: TimeStrip18, dir: "left", blend: 12 },
]);

// 8-18 · inside the dashed limit a ring of dots orbits the banded planet (≈ 15 px/f at the ring); clumps form and are drawn flat.
const Shot818: ShotFC<C08> = ({ f }) => {
  const clump = 0.5 + 0.5 * Math.sin(f * 0.08);
  return (
    <Pop f={f}>
      <Stage theme={ABY.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0, panY: 0, frames: 170, seed: 47 }} vignette={0.22} grain={0.5}>
        <Layer depth={0.1}>
          <NightSky />
        </Layer>
        <Layer depth={0.3}>
          <StarsTint18 f={f} x={-300} y={-300} w={2520} h={1680} n={110} speed={10} angle={200} seed={26} />
        </Layer>
        <Layer depth={1}>
          <ellipse cx={960} cy={560} rx={470} ry={470 * 0.3} fill="none" stroke={C.lever} strokeWidth={5} strokeDasharray="22 14" strokeDashoffset={-f * 3} />
          <DebrisRing cx={960} cy={560} f={f} radius={340} n={160} speed={2.6} spread={1} clump={clump} tilt={0.3} thickness={34} part="back" />
          <BandedGiant x={960} y={560} r={170} f={f} speed={10} />
          <DebrisRing cx={960} cy={560} f={f} radius={340} n={160} speed={2.6} spread={1} clump={clump} tilt={0.3} thickness={34} part="front" />
        </Layer>
        <Layer depth={0}>
          <AgencyPill x={90} y={110} agency="NASA SAYS" appear={lin(f, 2, 12)} size={26} />
          <WordPill x={90} y={172} text="ONE IDEA" size={28} appear={lin(f, 8, 18)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 8-19 · on the board a big rail: two arrows draw toward the STATION mark (one up from below, one down from above, 40 px/f) and
// are struck out; the mark gets a vermilion X; Tick crosses them out; the NOT POSSIBLE placard swings.
// ===============================================================================================================
const Shot819: ShotFC<C08> = ({ f, len }) => {
  const center = 3000;
  const decade = 360;
  const sy = railY(400, center, decade);
  const up = lin(f, 6, 26);
  const dn = lin(f, 20, 40);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.0 },
    { f: len, x: 1000, y: 600, zoom: 1.1 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={BRD.theme} cam={cam} vignette={0.12} grain={0.5}>
        <Layer depth={0.2}>
          <FamSky name="board" />
          <Bloom x={300} y={-100} r={900} color="#FFE08A" strength={0.4} />
        </Layer>
        <Layer depth={1}>
          <Board18 x={40} y={40} w={1840} h={1000} f={f + 600} />
          <DistGauge f={f} family={BRD} center={center} decade={decade} x={1180} top={170} bottom={1000} speed={12} lit={["station"]} lines={["station"]} lineFrom={1020} />
          <Arrow18 x0={1060} y0={1000} x1={1060} y1={1000 - (1000 - sy - 30) * up} color={C.lever} width={18} outline={INK} />
          <Arrow18 x0={980} y0={260} x1={980} y1={260 + (sy - 290) * dn} color={C.model} width={18} outline={INK} />
          <Label x={1000} y={240} text="BROUGHT IN" size={24} color={INK} align="end" />
          <Label x={1040} y={1000} text="FORMED HERE" size={24} color={INK} align="end" />
          <StrikeX x={1020} y={(sy + 1000) / 2 + 30} r={36} k={lin(f, 44, 56)} width={12} />
          <StrikeX x={980} y={(260 + sy) / 2} r={36} k={lin(f, 58, 70)} width={12} />
          <StrikeX x={1180} y={sy} r={60} k={lin(f, 74, 90)} width={20} />
          <FlipTag x={480} y={110} word="NOT POSSIBLE" f={f} swing={14} drop={ez(f, 0, 16)} size={1.1} cord={100} />
          <Tick x={720} y={1000} pxPerM={200} frame={f} facing={1} pose={f > 40 && f < 92 ? "point" : "hold"} expression="determined" look={0.5} />
        </Layer>
        <Layer depth={1.25}>
          <Motes frame={f} n={14} w={1920} h={1080} color="#FFE7A0" seed={8} size={3} drift={20} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================

export const SceneL08: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL08(t);
  const shots: ShotDef<C08>[] = [
    { from: 0, S: Shot801, id: "8-01" },
    { from: c.s802, S: Shot802, id: "8-02" }, // + 8-03 (SLIDE), 8-04 (PUSH)
    { from: c.s805, S: Shot805, id: "8-05" },
    { from: c.s806, S: Shot806, id: "8-06" },
    { from: c.s807, S: Shot807, id: "8-07" }, // + 8-08 (PUSH)
    { from: c.s809, S: Shot809, id: "8-09" },
    { from: c.s810, S: Shot810, id: "8-10" },
    { from: c.s811, S: Shot811, id: "8-11" },
    { from: c.s812, S: Shot812, id: "8-12" },
    { from: c.s813, S: Shot813, id: "8-13" },
    { from: c.s814, S: Shot814, id: "8-14" },
    { from: c.s815, S: Shot815, id: "8-15" }, // + 8-16 (PUSH), 8-17 (SLIDE)
    { from: c.s818, S: Shot818, id: "8-18" },
    { from: c.s819, S: Shot819, id: "8-19" },
  ];
  return playShots(f, shots, c, c.end);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL08 = (t: SceneTiming): Cue[] => {
  const c = cuesL08(t);
  const run = (at: number, n: number, gap = 5, vol = 0.05): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 6 }));
  return [
    ...cutHit(0),
    { at: 30, file: SFX.click, vol: 0.14, dur: 8 },
    { at: 36, file: SFX.click, vol: 0.1, dur: 8 },
    ...cutHit(c.s802),
    ...run(c.s802 + 4, 8, 6, 0.04),
    ...run(c.s803 + 12, 4, 9, 0.1),
    { at: c.s804 + 2, file: SFX.pop, vol: 0.14, dur: 20 },
    ...cutHit(c.s805),
    { at: c.s805 + 8, file: SFX.click, vol: 0.12, dur: 8 },
    { at: c.s805 + 52, file: SFX.click, vol: 0.14, dur: 8 },
    ...cutHit(c.s806),
    ...run(c.s806 + 4, 10, 8, 0.04),
    ...cutHit(c.s807),
    { at: c.s807 + 4, file: SFX.click, vol: 0.12, dur: 8 },
    { at: c.s808 + 10, file: SFX.pop, vol: 0.14, dur: 20 },
    ...cutHit(c.s809),
    { at: c.s809 + 6, file: SFX.click, vol: 0.12, dur: 8 },
    ...cutHit(c.s810),
    { at: c.s810 + 4, file: SFX.pop, vol: 0.12, dur: 20 },
    ...cutHit(c.s811),
    { at: c.s811 + 4, file: SFX.click, vol: 0.12, dur: 8 },
    ...cutHit(c.s812),
    { at: c.s812 + 16, file: SFX.click, vol: 0.12, dur: 8 },
    { at: c.s812 + 22, file: SFX.boom, vol: 0.24, dur: 110, fadeOut: 40 },
    ...cutHit(c.s813),
    { at: c.s813 + 2, file: SFX.swirl, vol: 0.14, dur: 60 },
    ...cutHit(c.s814),
    ...run(c.s814 + 2, 10, 4, 0.05),
    ...cutHit(c.s815),
    { at: c.s815 + 4, file: SFX.debris, vol: 0.14, dur: 100, fadeOut: 30 },
    { at: c.s816 + 20, file: SFX.boom, vol: 0.28, dur: 110, fadeOut: 40 },
    { at: c.s817, file: SFX.whoosh, vol: 0.16, dur: 50 },
    ...cutHit(c.s818),
    { at: c.s818 + 6, file: SFX.pop, vol: 0.12, dur: 20 },
    ...cutHit(c.s819),
    { at: c.s819 + 76, file: SFX.boom, vol: 0.24, dur: 110, fadeOut: 40 },
  ];
};
