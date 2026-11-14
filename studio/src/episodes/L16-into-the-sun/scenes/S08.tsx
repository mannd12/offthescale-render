// L16 scene "l08" (storyboard §3 "8 · What we measured, and what we modelled", script lines 61-69): the honest board.
// Package C. Every shot has a sliding sheet, a stamp slam, a drawing head or a bobbing "?" (BUILD.md §0: 75 s of
// bright plates must stay alive).
// Shot components (hard cuts; PUSH/SLIDE rows are phases): 8-01 (+8-02: four blank sheets pinned, the probe path solid
// then dashed; the radius bar and 700,000 km) · 8-03 (the camera slides down the untravelled bar) · 8-04 (+8-05: MEASURED
// IN PERSON, green stamp; ABOUT 9 RADII ABOVE THE SURFACE) · 8-06 (SEEN FROM FAR, blue) · 8-07 (WAVES + A MODEL, model
// stamp) · 8-08 (NEUTRINOS + A MODEL) · 8-09 (the model curve passing the data, check marks) · 8-10 (+8-11: the three
// stamps in a row; green means an instrument was there) · 8-12 (+8-13: blue, then the model stamp) · 8-14 (+8-15: 692,000
// vs 687,000 km/h, the chalk circle) · 8-16 (+8-17: 2,500 vs 2,600 °F, ABOUT and the range bars) · 8-18 (+8-19: the
// mission line's "?" and UNDER REVIEW, SEP 2025).
// Numbers drawn, each with its sources.md row (all from sundata.ts READ / SOURCE_CHIPS): 700,000 km + ABOUT + OUR SUM
// (#15 #22, C) · ABOUT 9 RADII ABOVE THE SURFACE (#6 #22) · 692,000 km/h, chip NASA 10 THINGS (#3) · 687,000 km/h, chip
// NASA SEP 2025 (#8) · 2,500 °F, chip NASA 10 THINGS (#3) · 2,600 °F, chip NASA DEC 2024 (#7) · SEP 2025 (#8). F2/F16:
// green only on the probe's own path and readings (8-04, 8-05) and as one of three in a row (8-10, 8-11); the interior
// sheets carry the lavender MODEL stamp (F9). The board's radius bar is in true proportion (SUN_R).
import React from "react";
import { useCurrentFrame } from "remotion";
import { Bloom, Kicker, Layer, Stage, Tick, alpha, cameraAt, mixHex, type Pt } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { L16_COLORS, familyOf } from "../families";
import { READ, SOURCE_CHIPS } from "../sundata";
import { AboutPill, Board, OurSumPill, Sheet, SourceChip, StateStamp, type StampState } from "../stamps";
import { Calendar, Probe, Stamp, Telescope, Trace, partialPts } from "../props16";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { ChalkLoop, CREAM, INK, Plate, Pop, QMark, RollMetric, Slam, StudioSet, Tag, TextPlate, Word, ez, lin, mod } from "./c-parts";

const C = L16_COLORS;
const STUDIO = familyOf("studio");

export const cuesL08 = (t: SceneTiming) => {
  const { at, p } = cueKit(t);
  const said = (i: number, ph: string) => p(i, ph);
  return {
    honest: 0, // 8-01
    radius: p(0, "From the Sun's surface"), // 8-02 phase
    none: p(0, "A probe has travelled"), // 8-03
    parker: at(1), // 8-04
    nine: p(1, "Down to about nine"), // 8-05 phase
    light: at(2), // 8-06
    waves: at(3), // 8-07
    core: at(4), // 8-08
    model: p(4, "Everything else"), // 8-09
    read: at(5), // 8-10
    green: p(5, "Green means"), // 8-11 phase
    blue: p(5, "Blue means"), // 8-12
    grey: p(5, "Grey means"), // 8-13 phase
    pages: at(6), // 8-14
    later: p(6, "We used the later"), // 8-15 phase
    say692: said(6, "six hundred and ninety-two"),
    say687: said(6, "six hundred and eighty-seven"),
    shield: at(7), // 8-16
    about: p(7, "We say"), // 8-17 phase
    say2500: said(7, "twenty-five hundred"),
    say2600: said(7, "twenty-six hundred"),
    future: at(8), // 8-18
    review: p(8, "In September 2025"), // 8-19 phase
    end: t.frames,
  };
};
export type C08 = ReturnType<typeof cuesL08>;

// ---------------------------------------------------------------------------------------------------------------
// the evidence board: world placement and the four sheets (board coords)
// ---------------------------------------------------------------------------------------------------------------
const BX = 160;
const BY = 120;
const BW = 1600;
const BH = 780;
const SW = 540;
const SH = 320;
const SHEETS: [number, number][] = [
  [420, 50],
  [1000, 50],
  [420, 420],
  [1000, 420],
];
const TITLES = ["measured in person", "seen from far", "waves + a model", "neutrinos + a model"];
const STATES: StampState[] = ["measured", "afar", "model", "model"];
/** world centre of sheet i (for the camera) */
const sheetC = (i: number): [number, number] => [BX + SHEETS[i][0] + SW / 2, BY + SHEETS[i][1] + SH / 2];
const PATH_TOP = 40;
const SURF = 260;
const CENTRE = 760;
const PATH: Pt[] = [
  [150, PATH_TOP],
  [150, 250],
];
const SOLID = (205 - PATH_TOP) / (250 - PATH_TOP); // Parker's measured stretch ends above the surface (F2)

type SheetState = { slide?: number; titled?: boolean; stampAge?: number; body?: React.ReactNode };

const EvidenceBoard: React.FC<{ f: number; path?: number; bar?: number; sheets: SheetState[]; ghostAt?: boolean }> = ({ f, path = 1, bar = 1, sheets, ghostAt = true }) => {
  const barL = (CENTRE - SURF) * bar;
  const seg = (a: number, b: number, col: string) => {
    // a, b: fractions of the radius from the CENTRE (true proportions: SUN_R)
    const y0 = CENTRE - b * (CENTRE - SURF);
    const y1 = CENTRE - a * (CENTRE - SURF);
    return <rect x={205} y={y0} width={50} height={y1 - y0} fill={col} />;
  };
  return (
    <Board x={BX} y={BY} w={BW} h={BH} f={f} path={{ pts: PATH, solidTo: SOLID, draw: path }}>
      {/* the radius bar from the surface down to the centre, drawn from the top */}
      <clipPath id="l08bar">
        <rect x={190} y={SURF} width={80} height={barL} />
      </clipPath>
      <g clipPath="url(#l08bar)">
        {seg(0.7, 1, C.tangerine)}
        {seg(0.2, 0.7, C.honey)}
        {seg(0, 0.2, C.whiteGold)}
      </g>
      {bar > 0 ? <rect x={205} y={SURF} width={50} height={barL} fill="none" stroke={CREAM} strokeWidth={3} /> : null}
      {bar > 0 && bar < 1 ? <circle cx={230} cy={SURF + barL} r={12} fill={C.saffronCore} stroke={C.saffron} strokeWidth={3} /> : null}
      <line x1={110} y1={SURF} x2={300} y2={SURF} stroke={C.gold} strokeWidth={4} />
      <Word x={300} y={SURF - 12} text="surface" size={20} color={C.gold} />
      {bar >= 1 ? <Word x={270} y={CENTRE + 6} text="centre" size={20} color={CREAM} /> : null}
      <Word x={110} y={PATH_TOP - 10} text="probe path" size={18} color={alpha(CREAM, 0.85)} />
      {ghostAt && path >= 1 ? <Probe x={150} y={286} size={64} f={f} variant="ghost" tilt={90} /> : null}
      {sheets.map((s, i) => {
        if (s.slide == null || s.slide <= 0) return null;
        const k = Math.max(0, Math.min(1, s.slide));
        const [sx, sy] = SHEETS[i];
        return (
          <g key={i} transform={`translate(${((1 - k) * 600).toFixed(1)} ${((1 - k) * 80).toFixed(1)})`} opacity={Math.min(1, k * 3)}>
            <Sheet x={sx} y={sy} w={SW} h={SH} f={f} title={s.titled ? TITLES[i] : ""} band={i === 1 ? "#1F5FA0" : i >= 2 ? "#4B2C8A" : C.tealDeep} stamp={s.stampAge != null ? { state: STATES[i], age: s.stampAge } : undefined}>
              {s.body}
            </Sheet>
          </g>
        );
      })}
    </Board>
  );
};

// sheet bodies (sheet coords below the title band; the stamp sits bottom-right, keep bodies at x < 360)
const BodyMeasured: React.FC<{ f: number; bracket?: number; ticks?: boolean }> = ({ f, bracket = 0, ticks = false }) => {
  const x = 230;
  const top = 18;
  const surf = 225;
  const nine = 150;
  return (
    <g>
      <Probe x={92} y={70} size={110} f={f} tilt={90} />
      <line x1={x} y1={top} x2={x} y2={surf} stroke={C.stampGreen} strokeWidth={8} strokeLinecap="round" />
      <line x1={x - 30} y1={surf} x2={x + 60} y2={surf} stroke={C.saffronDeep} strokeWidth={6} />
      <Word x={x - 34} y={surf + 32} text="surface" size={18} color={C.ink} />
      <line x1={x - 18} y1={nine} x2={x + 18} y2={nine} stroke={C.ink} strokeWidth={5} />
      {ticks
        ? Array.from({ length: 6 }, (_, i) => {
            const y = top + mod(i * 26 + f * 20, nine - top);
            return <rect key={i} x={x - 16} y={y} width={32} height={8} rx={3} fill={C.stampGreen} stroke={INK} strokeWidth={1.5} />;
          })
        : null}
      {bracket > 0 ? (
        <g>
          <line x1={x + 50} y1={surf} x2={x + 50} y2={surf - (surf - nine) * bracket} stroke={C.saffron} strokeWidth={6} strokeLinecap="round" />
          <line x1={x + 38} y1={surf} x2={x + 62} y2={surf} stroke={C.saffron} strokeWidth={6} />
          {bracket >= 1 ? <line x1={x + 38} y1={nine} x2={x + 62} y2={nine} stroke={C.saffron} strokeWidth={6} /> : <circle cx={x + 50} cy={surf - (surf - nine) * bracket} r={9} fill={C.saffronCore} stroke={C.saffron} strokeWidth={3} />}
        </g>
      ) : null}
    </g>
  );
};

const BodyAfar: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <circle cx={80} cy={110} r={74} fill={C.magenta} opacity={0.5} />
    <circle cx={80} cy={110} r={58} fill={C.gold} />
    <circle cx={80} cy={110} r={38} fill={C.whiteGold} />
    {Array.from({ length: 5 }, (_, i) => {
      const d = mod(f * 30 + i * 46, 230);
      return <line key={i} x1={150 + d} y1={110 + (i - 2) * 10 * (1 - d / 230)} x2={150 + d + 34} y2={110 + (i - 2) * 10 * (1 - (d + 34) / 230)} stroke={C.gold} strokeWidth={7} strokeLinecap="round" />;
    })}
    <Telescope x={400} y={150} size={120} f={f} tilt={180 + 12} />
  </g>
);

const BodyWaves: React.FC<{ f: number; curve: number }> = ({ f, curve }) => {
  const pts: Pt[] = Array.from({ length: 14 }, (_, i) => [190 + i * 13, 70 + Math.pow(i / 13, 1.4) * 130 - Math.sin(i / 2) * 6]);
  return (
    <g>
      <clipPath id="l08wav">
        <circle cx={90} cy={110} r={78} />
      </clipPath>
      <circle cx={90} cy={110} r={78} fill={C.amber} />
      <g clipPath="url(#l08wav)">
        {Array.from({ length: 4 }, (_, i) => {
          const r = mod(f * 18 + i * 30, 120);
          return <circle key={i} cx={90} cy={110} r={r} fill="none" stroke={C.violet} strokeWidth={7} opacity={1 - r / 120} />;
        })}
      </g>
      {pts.map((p, i) => (i % 3 === 0 ? <circle key={i} cx={p[0]} cy={p[1] + 8} r={7} fill={C.saffron} stroke={INK} strokeWidth={2} /> : null))}
      <Trace pts={pts} head={curve} f={f} color={C.stampGrey} width={7} />
    </g>
  );
};

const BodyNeutrinos: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <circle cx={70} cy={115} r={40} fill={C.whiteGold} />
    <circle cx={70} cy={115} r={22} fill="#FFFFFF" />
    {Array.from({ length: 4 }, (_, i) => {
      const d = mod(f * 36 + i * 90, 360);
      const a = (-25 + i * 16) * (Math.PI / 180);
      return <line key={i} x1={70 + Math.cos(a) * (30 + d)} y1={115 + Math.sin(a) * (30 + d)} x2={70 + Math.cos(a) * (30 + d + 60)} y2={115 + Math.sin(a) * (30 + d + 60)} stroke={C.stampBlue} strokeWidth={7} strokeLinecap="round" />;
    })}
  </g>
);

/** model curve over measured dots, check marks popping as the head passes (8-09, 8-13) */
const CheckCurve: React.FC<{ f: number; x: number; y: number; w: number; h: number; head: number; ink?: string }> = ({ f, x, y, w, h, head, ink = INK }) => {
  const N = 24;
  const pts: Pt[] = Array.from({ length: N + 1 }, (_, i) => [x + (w * i) / N, y + h * (0.2 + 0.6 * Math.pow(i / N, 1.3)) + Math.sin(i / 3) * h * 0.06]);
  const dots = [3, 8, 13, 18, 23];
  const part = partialPts(pts, head);
  return (
    <g>
      {dots.map((k, j) => (
        <circle key={j} cx={pts[k][0]} cy={pts[k][1] + (j % 2 ? 6 : -6)} r={9} fill={C.saffron} stroke={ink} strokeWidth={2.5} />
      ))}
      <Trace pts={pts} head={head} f={f} color={C.stampGrey} width={8} />
      {dots.map((k, j) => {
        const passed = part.length - 1 >= k;
        if (!passed) return null;
        const age = Math.min(8, (part.length - 1 - k) * 1.5);
        const s = age < 4 ? 0.4 + age * 0.3 : 1.2 - Math.min(0.2, (age - 4) * 0.05);
        return (
          <g key={"c" + j} transform={`translate(${pts[k][0]} ${pts[k][1] - 34}) scale(${s.toFixed(2)})`}>
            <circle r={18} fill={C.stampGreen} stroke={INK} strokeWidth={2} />
            <path d="M-8 0 L-2 7 L9 -7" fill="none" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      })}
    </g>
  );
};

/** The full board's resting state after the four sheets are in (for 8-07 … 8-09). */
const restSheets = (f: number, up: number): SheetState[] =>
  SHEETS.map((_, i) => ({
    slide: 1,
    titled: i < up,
    stampAge: i < up ? 99 : undefined,
    body: i >= up ? null : i === 0 ? <BodyMeasured f={f} bracket={1} /> : i === 1 ? <BodyAfar f={f} /> : i === 2 ? <BodyWaves f={f} curve={1} /> : <BodyNeutrinos f={f} />,
  }));

// ===============================================================================================================
// 8-01 + 8-02 · the cyclorama; Tick pins four blank sheets (sliding in 23 px/f); the probe's path draws down the board
// (30 px/f), solid at the top, dashed below. Kicker — WHERE THE DATA ENDS. Then the camera tilts down: the radius bar
// draws (50 px/f) from the surface to the centre; 700,000 km + ABOUT + OUR SUM (row 15 rounded, our sum).
// ===============================================================================================================
const ShotHonest: ShotFC<C08> = ({ f, len, c }) => {
  const p2 = c.radius - c.honest;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 520, zoom: 0.98 },
    { f: p2, x: 940, y: 530, zoom: 1.03 },
    { f: p2 + 30, x: 600, y: 600, zoom: 1.32 },
    { f: len, x: 620, y: 610, zoom: 1.36 },
  ]);
  const sheets: SheetState[] = SHEETS.map((_, i) => ({ slide: ez(f, 10 + i * 9, 10 + i * 9 + 22) }));
  const path = lin(f, 8, 16);
  const bar = f >= p2 ? lin(f, p2 + 14, p2 + 24) : 0;
  return (
    <Stage theme={STUDIO.theme} cam={cam} vignette={0.2} grain={0.5}>
      <StudioSet f={f} seed={2} floor={960} />
      <Layer depth={1}>
        <EvidenceBoard f={f} path={path} bar={bar} sheets={sheets} />
        <Tick x={96} y={1000} pxPerM={74} frame={f} facing={1} pose="press" poseTo="point" poseT={ez(f, 46, 60)} expression="neutral" staff look={0.3} />
      </Layer>
      <Layer depth={0}>
        <g opacity={1 - ez(f, p2, p2 + 12)}>
          <Kicker x={170} y={74} text="where the data ends" color={INK} size={30} />
        </g>
        {f >= p2 ? (
          <g opacity={ez(f, p2 + 16, p2 + 26)}>
            <TextPlate x={1060} y={430} w={640} h={240} color="#0E2A3E" opacity={0.78} />
            <RollMetric x={1090} y={560} value={READ.roundR.value! /* #15 #22 */} unit="km" k={ez(f, p2 + 18, p2 + 50)} size={96} who="8-02 radius" />
            <AboutPill x={1094} y={626} size={26} appear={ez(f, p2 + 40, p2 + 50)} />
            <OurSumPill x={1250} y={626} size={26} appear={ez(f, p2 + 46, p2 + 56)} />
          </g>
        ) : null}
      </Layer>
    </Stage>
  );
};

// ===============================================================================================================
// 8-03 · "A probe has travelled none of it": the dashed tail ends at the top (the ghost probe waits there); the
// camera slides down the untravelled radius bar. MOVER: the slide (≈ 7.6 px/f world at 1.8× ≈ 14 px/f on screen) +
// the dashes marching + a scan line falling down the bar (22 px/f).
// ===============================================================================================================
const ShotNone: ShotFC<C08> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: BX + 260, y: BY + 200, zoom: 1.85 },
    { f: len, x: BX + 260, y: BY + 700, zoom: 1.85 },
  ]);
  const scan = BY + SURF + mod(f * 22, CENTRE - SURF);
  return (
    <Pop f={f}>
      <Stage theme={STUDIO.theme} cam={cam} vignette={0.2} grain={0.5}>
        <StudioSet f={f} seed={2} floor={960} />
        <Layer depth={1}>
          <EvidenceBoard f={f} path={1} bar={1} sheets={SHEETS.map(() => ({ slide: 1 }))} />
          <rect x={BX + 200} y={scan - 4} width={60} height={8} fill="#FFFFFF" opacity={0.75} />
          <Bloom x={BX + 230} y={scan} r={60} color="#FFFFFF" strength={0.4} squash={0.4} />
          {/* "none of it": an empty dashed outline beside the bar where a path would be */}
          <line x1={BX + 150} y1={BY + 300} x2={BX + 150} y2={BY + CENTRE} stroke={alpha(CREAM, 0.35)} strokeWidth={5} strokeDasharray="4 22" />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 8-04 + 8-05 · the first sheet, MEASURED IN PERSON (the probe icon at the top), slides in (24 px/f); the green stamp
// slams (40 px/f); Tick stamps it and steps back. Then a bracket draws from the surface to the ABOUT 9 mark (30 px/f)
// while green data ticks stream down the path (20 px/f).
// ===============================================================================================================
const ShotParker: ShotFC<C08> = ({ f, len, c }) => {
  const p2 = c.nine - c.parker;
  const [x, y] = sheetC(0);
  const cam = cameraAt(f, [
    { f: 0, x: x - 20, y: y + 20, zoom: 1.7 },
    { f: len, x: x + 10, y: y + 30, zoom: 1.85 },
  ]);
  const slide = ez(f, 0, 20);
  const sheets: SheetState[] = SHEETS.map((_, i) =>
    i === 0 ? { slide, titled: true, stampAge: f - 28, body: <BodyMeasured f={f} bracket={f >= p2 ? ez(f, p2 + 4, p2 + 12) : 0} ticks={f >= p2} /> } : { slide: 1 },
  );
  return (
    <Pop f={f}>
      <Stage theme={STUDIO.theme} cam={cam} vignette={0.2} grain={0.5}>
        <StudioSet f={f} seed={2} floor={960} />
        <Layer depth={1}>
          <EvidenceBoard f={f} sheets={sheets} />
        </Layer>
        <Layer depth={0}>
          <rect x={1560} y={1010} width={320} height={20} rx={10} fill={C.saffron} stroke={INK} strokeWidth={3} />
          <Tick x={1700} y={1012} pxPerM={90} frame={f} facing={-1} pose="press" poseTo="stand" poseT={ez(f, 34, 50)} expression="determined" expressionTo="proud" expressionT={ez(f, 30, 44)} staff look={0.3} />
          {f >= p2 ? <Tag x={960} y={960} text={READ.about9.text /* #6 #22 */} F={STUDIO} size={30} align="middle" appear={ez(f, p2 + 8, p2 + 20)} /> : null}
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 8-06 / 8-07 / 8-08 · one sheet each, sliding in (24 px/f) with its stamp slamming: SEEN FROM FAR (blue; rays
// streaming 30 px/f), WAVES + A MODEL (model stamp; rings 18 px/f, the model curve drawing), NEUTRINOS + A MODEL (model
// stamp; neutrino streaks 36 px/f).
// ===============================================================================================================
const sheetShot = (i: 1 | 2 | 3): ShotFC<C08> =>
  function ShotSheet({ f, len }) {
    const [x, y] = sheetC(i);
    const cam = cameraAt(f, [
      { f: 0, x: x - 30, y: y + 10, zoom: 1.66 },
      { f: len, x: x + 10, y: y + 20, zoom: 1.8 },
    ]);
    const body = i === 1 ? <BodyAfar f={f} /> : i === 2 ? <BodyWaves f={f} curve={ez(f, 10, 30)} /> : <BodyNeutrinos f={f} />;
    const sheets = restSheets(f, i).map((s, k) => (k === i ? { slide: ez(f, 0, 20), titled: true, stampAge: f - 20, body } : s));
    return (
      <Pop f={f}>
        <Stage theme={STUDIO.theme} cam={cam} vignette={0.2} grain={0.5}>
          <StudioSet f={f} seed={2} floor={960} />
          <Layer depth={1}>
            <EvidenceBoard f={f} sheets={sheets} />
          </Layer>
        </Stage>
      </Pop>
    );
  };
const ShotLight = sheetShot(1);
const ShotWavesSheet = sheetShot(2);
const ShotCoreSheet = sheetShot(3);

// ===============================================================================================================
// 8-09 · "Everything else … a model checked against them": close on the NEUTRINOS + A MODEL sheet; the model curve's
// head runs (30 px/f) and green check marks pop on each data dot it passes.
// ===============================================================================================================
const ShotChecked: ShotFC<C08> = ({ f, len }) => {
  const [x, y] = sheetC(3);
  const cam = cameraAt(f, [
    { f: 0, x: x - 40, y: y + 10, zoom: 1.9 },
    { f: len, x: x - 10, y: y + 20, zoom: 2.0 },
  ]);
  const sheets = restSheets(f, 4).map((s, k) =>
    k === 3
      ? {
          ...s,
          body: (
            <g>
              <BodyNeutrinos f={f} />
              <CheckCurve f={f} x={140} y={10} w={210} h={200} head={ez(f, 6, 60)} />
            </g>
          ),
        }
      : s,
  );
  return (
    <Pop f={f}>
      <Stage theme={STUDIO.theme} cam={cam} vignette={0.2} grain={0.5}>
        <StudioSet f={f} seed={2} floor={960} />
        <Layer depth={1}>
          <EvidenceBoard f={f} sheets={sheets} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 8-10 … 8-13 · the three stamps on a shelf. 8-10: Tick lines them up (sliding in ≈ 35 px/f, stagger 8 f); Kicker
// — HOW TO READ THE STAMPS. 8-11: green swells (1.0-1.25), a probe with its lit instrument slides under it (16 px/f).
// 8-12: blue swells; rays stream from a far gold disc to a small telescope (30 px/f). 8-13: the camera slides to the
// model stamp, which swells; a model curve is laid over measured dots and the checks pop.
// ===============================================================================================================
const SX = [520, 960, 1400];
const SY = 450;
const ROW: StampState[] = ["measured", "afar", "model"];
const StampRow: React.FC<{ f: number; inK: number[]; swell: number[] }> = ({ f, inK, swell }) => (
  <g>
    <rect x={260} y={640} width={1400} height={26} rx={10} fill={C.saffron} stroke={INK} strokeWidth={4} />
    <rect x={280} y={666} width={1360} height={14} rx={6} fill={C.saffronDeep} />
    {ROW.map((s, i) => {
      const k = Math.max(0, Math.min(1, inK[i]));
      if (k <= 0) return null;
      const x = SX[i] - (1 - k) * 1400;
      const sc = 1 + 0.125 * swell[i] * (1 - Math.cos(f / 4));
      return (
        <g key={s} transform={`translate(${x} ${SY}) scale(${sc.toFixed(3)}) translate(${-x} ${-SY})`}>
          {swell[i] > 0 ? <Bloom x={x} y={SY} r={260} color={mixHex(s === "measured" ? C.stampGreen : s === "afar" ? C.stampBlue : C.stampGrey, "#FFFFFF", 0.3)} strength={0.55 * swell[i]} /> : null}
          <StateStamp x={x} y={SY} state={s} size={270} rotate={-6 + i * 4} />
        </g>
      );
    })}
  </g>
);

const ShotStamps: ShotFC<C08> = ({ f, len, c }) => {
  const p2 = c.green - c.read;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.08 },
    { f: p2, x: 960, y: 540, zoom: 1.0 },
    { f: p2 + 16, x: 700, y: 600, zoom: 1.22 },
    { f: len, x: 690, y: 600, zoom: 1.26 },
  ]);
  const inK = [0, 1, 2].map((i) => ez(f, i * 8, i * 8 + 40));
  const g = f - p2;
  const px = g >= 0 ? Math.min(SX[0], -200 + g * 16 * 3) : -400;
  return (
    <Stage theme={STUDIO.theme} cam={cam} vignette={0.2} grain={0.5}>
      <StudioSet f={f} seed={9} floor={960} />
      <Layer depth={1}>
        <StampRow f={f} inK={inK} swell={[g >= 0 ? ez(g, 0, 8) : 0, 0, 0]} />
        {g >= 0 ? <Probe x={px} y={810} size={230} f={f} variant="cutaway" tilt={0} /> : null}
        <Tick x={1720} y={962} pxPerM={92} frame={f} facing={-1} pose="point" expression="happy" staff look={0.3} />
      </Layer>
      <Layer depth={0}>
        <g opacity={1 - ez(f, p2, p2 + 10)}>
          <Kicker x={170} y={100} text="how to read the stamps" color={INK} size={30} />
        </g>
      </Layer>
    </Stage>
  );
};

const ShotBlueGrey: ShotFC<C08> = ({ f, len, c }) => {
  const p2 = c.grey - c.blue;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 600, zoom: 1.22 },
    { f: p2, x: 980, y: 600, zoom: 1.26 },
    { f: p2 + 16, x: 1400, y: 600, zoom: 1.24 },
    { f: len, x: 1410, y: 600, zoom: 1.28 },
  ]);
  const g = f - p2;
  const sw = [0, g < 0 ? 1 : 1 - ez(g, 0, 10), g >= 0 ? ez(g, 0, 8) : 0];
  return (
    <Pop f={f}>
      <Stage theme={STUDIO.theme} cam={cam} vignette={0.2} grain={0.5}>
        <StudioSet f={f} seed={9} floor={960} />
        <Layer depth={1}>
          <StampRow f={f} inK={[1, 1, 1]} swell={sw} />
          {/* under blue: light from a far disc to a small telescope */}
          <circle cx={720} cy={830} r={44} fill={C.gold} stroke={C.magenta} strokeWidth={8} />
          {Array.from({ length: 6 }, (_, i) => {
            const d = mod(f * 30 + i * 60, 360);
            return <line key={i} x1={780 + d} y1={830 - d * 0.05} x2={820 + d} y2={830 - (d + 40) * 0.05} stroke={C.gold} strokeWidth={8} strokeLinecap="round" />;
          })}
          <Telescope x={1210} y={830} size={130} f={f} tilt={190} />
          {/* under the model stamp: a model curve over measured dots, checks popping */}
          {g >= 0 ? <CheckCurve f={f} x={1230} y={700} w={360} h={220} head={ez(g, 8, 52)} /> : null}
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 8-14 … 8-17 · the disagreement table: row one slides in (22 px/f): 692,000 km/h ? 687,000 km/h with their source
// chips, the "?" bobbing; the chalk circle round the later figure (head ≈ 23 px/f). Row two: 2,500 °F ? 2,600 °F with
// chips; then ABOUT stamps over both rows and a range bar widens under each pair (24 px/f).
// ===============================================================================================================
const TX = 260;
const TY = 200;
const TW = 1400;
const TH = 620;
const R1 = 400;
const R2 = 650;
const TableRow: React.FC<{ f: number; y: number; k: number; a: { v: number; unit: string; who: string }; b: { v: number; unit: string; who: string }; chipA: string; chipB: string; dimA?: number; roll: number; ua?: number; ub?: number }> = ({ f, y, k, a, b, chipA, chipB, dimA = 0, roll, ua = 0, ub = 0 }) => {
  if (k <= 0) return null;
  const dx = (1 - k) * 900;
  // saffron underlines drawn (≈ 30 px/f) as each figure is spoken
  const under = (x: number, u: number) =>
    u > 0 ? (
      <g>
        <rect x={x} y={y + 14} width={420 * u} height={10} rx={5} fill={C.saffron} />
        {u < 1 ? <circle cx={x + 420 * u} cy={y + 19} r={10} fill={C.saffronCore} stroke={C.saffron} strokeWidth={3} /> : null}
      </g>
    ) : null;
  return (
    <g transform={`translate(${dx.toFixed(1)} 0)`} opacity={Math.min(1, k * 2)}>
      {under(TX + 60, ua)}
      {under(TX + 860, ub)}
      <g opacity={1 - dimA * 0.45}>
        <RollMetric x={TX + 60} y={y} value={a.v} unit={a.unit} k={roll} size={84} who={a.who} />
        <SourceChip x={TX + 66} y={y + 52} text={chipA} size={20} />
      </g>
      <QMark x={TX + TW / 2 - 30} y={y} f={f} size={96} appear={roll} />
      <RollMetric x={TX + 860} y={y} value={b.v} unit={b.unit} k={roll} size={84} who={b.who} />
      <SourceChip x={TX + 866} y={y + 52} text={chipB} size={20} />
    </g>
  );
};

const TableSet: React.FC<{ f: number; children: React.ReactNode }> = ({ f, children }) => (
  <>
    <StudioSet f={f} seed={11} floor={960} />
    <Layer depth={1}>
      <Plate x={TX} y={TY} w={TW} h={TH} />
      <rect x={TX} y={TY} width={TW} height={80} rx={20} fill={C.tealDeep} />
      <rect x={TX} y={TY + 70} width={TW} height={10} fill={C.gold} />
      <Word x={TX + 40} y={TY + 54} text="nasa pages" size={30} color={CREAM} spacing={4} />
      {children}
    </Layer>
  </>
);

const ShotPages: ShotFC<C08> = ({ f, len, c }) => {
  const p2 = c.later - c.pages;
  const k = ez(f, 4, 44);
  const cam = cameraAt(f, [
    { f: 0, x: 1000, y: 520, zoom: 1.1 },
    { f: p2, x: 960, y: 520, zoom: 1.06 },
    { f: len, x: 1080, y: 470, zoom: 1.2 },
  ]);
  return (
    <Stage theme={STUDIO.theme} cam={cam} vignette={0.2} grain={0.5}>
      <TableSet f={f}>
        <TableRow
          f={f}
          y={R1}
          k={k}
          roll={ez(f, 20, 56)}
          dimA={f >= p2 ? ez(f, p2, p2 + 10) : 0}
          a={{ v: READ.speedTen.value! /* #3 */, unit: "km/h", who: "8-14 speed 692" }}
          b={{ v: READ.speedSep.value! /* #8 */, unit: "km/h", who: "8-14 speed 687" }}
          chipA={SOURCE_CHIPS.tenThings}
          chipB={SOURCE_CHIPS.sep2025}
          ua={ez(f, c.say692 - c.pages, c.say692 - c.pages + 14)}
          ub={ez(f, c.say687 - c.pages, c.say687 - c.pages + 14)}
        />
        {f >= p2 ? <ChalkLoop cx={TX + 1060} cy={R1 - 20} rx={270} ry={90} draw={ez(f, p2 + 2, p2 + 38)} f={f} /> : null}
        <Tick x={1790} y={962} pxPerM={90} frame={f} facing={-1} pose="point" expression="worried" expressionTo="thinking" expressionT={ez(f, p2, p2 + 20)} look={0.3} />
      </TableSet>
    </Stage>
  );
};

const ShotShield: ShotFC<C08> = ({ f, len, c }) => {
  const p2 = c.about - c.shield;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.12 },
    { f: p2, x: 960, y: 560, zoom: 1.06 },
    { f: len, x: 960, y: 540, zoom: 1.0 },
  ]);
  const g = f - p2;
  const rb = g >= 0 ? ez(g, 10, 10 + 25) : 0;
  const rangeBar = (y: number) =>
    rb > 0 ? (
      <g>
        <rect x={TX + TW / 2 - 30 - 600 * rb} y={y} width={1200 * rb} height={18} rx={9} fill={C.violet} opacity={0.85} />
        <rect x={TX + TW / 2 - 30 - 600 * rb} y={y} width={1200 * rb} height={6} rx={3} fill={C.lavender} opacity={0.8} />
      </g>
    ) : null;
  return (
    <Pop f={f}>
      <Stage theme={STUDIO.theme} cam={cam} vignette={0.2} grain={0.5}>
        <TableSet f={f}>
          <TableRow f={f} y={R1} k={1} roll={1} dimA={0.6} ua={1} ub={1} a={{ v: READ.speedTen.value!, unit: "km/h", who: "8-16 speed 692" }} b={{ v: READ.speedSep.value!, unit: "km/h", who: "8-16 speed 687" }} chipA={SOURCE_CHIPS.tenThings} chipB={SOURCE_CHIPS.sep2025} />
          <ChalkLoop cx={TX + 1060} cy={R1 - 20} rx={270} ry={90} draw={1} f={f} />
          <TableRow
            f={f}
            y={R2}
            k={ez(f, 4, 44)}
            roll={ez(f, 20, 56)}
            a={{ v: READ.shieldTenF.value! /* #3 */, unit: "°F", who: "8-16 shield 2,500" }}
            b={{ v: READ.shieldCloseF.value! /* #7 */, unit: "°F", who: "8-16 shield 2,600" }}
            chipA={SOURCE_CHIPS.tenThings}
            chipB={`nasa ${READ.closestMonth.text}` /* #7 */}
            ua={ez(f, c.say2500 - c.shield, c.say2500 - c.shield + 14)}
            ub={ez(f, c.say2600 - c.shield, c.say2600 - c.shield + 14)}
          />
          {rangeBar(R1 + 82)}
          {rangeBar(R2 + 82)}
          <Slam age={g} x={TX + TW / 2 - 30} y={(R1 + R2) / 2 - 10} color={C.teal} ringR={110}>
            <AboutPill x={TX + TW / 2 - 30} y={(R1 + R2) / 2 - 10} size={44} align="middle" />
          </Slam>
          <Tick x={1790} y={962} pxPerM={90} frame={f} facing={-1} pose="point" expression="thinking" expressionTo="happy" expressionT={ez(f, p2, p2 + 20)} look={0.5} />
        </TableSet>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 8-18 + 8-19 · the mission line: solid green so far, a dashed line draws on (36 px/f) and gains a "?" (bobbing ±20 px);
// then UNDER REVIEW slams across the dashed end (40 px/f) and a calendar flips to SEP 2025 (30 px/f) beside it; Tick sets
// the pencil down. Holds 1.5 s on the bobbing "?" before the cut to the closer.
// ===============================================================================================================
const ShotFuture: ShotFC<C08> = ({ f, len, c }) => {
  const p2 = c.review - c.future;
  const y = 540;
  const xs = 280;
  const xm = 900;
  const xe = 1230;
  const dash = ez(f, 4, 4 + (xe - xm) / 36);
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 540, zoom: 1.12 },
    { f: p2, x: 960, y: 540, zoom: 1.04 },
    { f: len, x: 1000, y: 530, zoom: 1.12 },
  ]);
  const g = f - p2;
  return (
    <Pop f={f}>
      <Stage theme={STUDIO.theme} cam={cam} vignette={0.2} grain={0.5}>
        <StudioSet f={f} seed={13} floor={960} />
        <Layer depth={1}>
          <Plate x={160} y={300} w={1240} h={460} />
          <Word x={200} y={370} text="parker solar probe" size={30} color={CREAM} spacing={4} />
          <line x1={xs} y1={y} x2={xm} y2={y} stroke={C.stampGreen} strokeWidth={12} strokeLinecap="round" />
          {Array.from({ length: 7 }, (_, i) => (
            <circle key={i} cx={xs + 40 + i * 85} cy={y} r={11} fill={C.whiteGold} stroke={INK} strokeWidth={3} />
          ))}
          <Probe x={xm} y={y - 70} size={110} f={f} tilt={0} />
          <line x1={xm} y1={y} x2={xm + (xe - xm) * dash} y2={y} stroke={C.bone} strokeWidth={10} strokeDasharray="22 16" strokeDashoffset={-f * 3} strokeLinecap="round" />
          {dash > 0 && dash < 1 ? <circle cx={xm + (xe - xm) * dash} cy={y} r={13} fill={C.saffronCore} stroke={C.saffron} strokeWidth={3} /> : null}
          <QMark x={xe + 70} y={y + 30} f={f} size={120} appear={ez(f, 18, 26)} />
          {g >= 0 ? <Stamp x={(xm + xe) / 2 + 20} y={y + 110} text="under review" age={g} size={46} color={C.magenta} ink={C.paper} rotate={-7} /> : null}
          <Calendar x={1500} y={390} w={240} f={f} flipping={g >= 0 && g < 40 ? 4.5 : 0} text={g >= 0 ? READ.sep2025.text /* #8 */ : undefined} />
          <Tick x={1640} y={962} pxPerM={90} frame={f} facing={-1} pose="hold" poseTo="stand" poseT={g >= 0 ? ez(g, 30, 46) : 0} expression="thinking" expressionTo="neutral" expressionT={g >= 0 ? ez(g, 30, 46) : 0} staff look={0.6} />
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
    { from: 0, S: ShotHonest, id: "8-01" }, // + 8-02 (PUSH)
    { from: c.none, S: ShotNone, id: "8-03" },
    { from: c.parker, S: ShotParker, id: "8-04" }, // + 8-05 (PUSH)
    { from: c.light, S: ShotLight, id: "8-06" },
    { from: c.waves, S: ShotWavesSheet, id: "8-07" },
    { from: c.core, S: ShotCoreSheet, id: "8-08" },
    { from: c.model, S: ShotChecked, id: "8-09" },
    { from: c.read, S: ShotStamps, id: "8-10" }, // + 8-11 (SLIDE)
    { from: c.blue, S: ShotBlueGrey, id: "8-12" }, // + 8-13 (SLIDE)
    { from: c.pages, S: ShotPages, id: "8-14" }, // + 8-15 (PUSH)
    { from: c.shield, S: ShotShield, id: "8-16" }, // + 8-17 (PUSH)
    { from: c.future, S: ShotFuture, id: "8-18" }, // + 8-19 (PUSH)
  ];
  return playShots(f, shots, c, c.end);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL08 = (t: SceneTiming): Cue[] => {
  const c = cuesL08(t);
  const run = (at: number, n: number, gap = 5, vol = 0.07): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 6 }));
  const stamp = (at: number): Cue[] => [
    { at, file: SFX.click, vol: 0.14, dur: 8 },
    { at: at + 2, file: SFX.boom, vol: 0.3 * 0.6, dur: 60, fadeOut: 20 },
  ];
  return [
    ...run(18, 4, 9, 0.1),
    ...run(c.radius + 14, 6),
    ...cutHit(c.none),
    { at: c.none + 4, file: SFX.pop, vol: 0.12, dur: 14 },
    ...cutHit(c.parker),
    ...stamp(c.parker + 28),
    ...run(c.nine + 6, 6),
    ...cutHit(c.light),
    ...stamp(c.light + 20),
    ...cutHit(c.waves),
    ...stamp(c.waves + 20),
    ...cutHit(c.core),
    ...stamp(c.core + 20),
    ...cutHit(c.model),
    ...run(c.model + 10, 5, 9, 0.1),
    ...run(c.read + 4, 3, 8, 0.1),
    { at: c.green + 2, file: SFX.pop, vol: 0.14, dur: 14 },
    ...cutHit(c.blue),
    { at: c.blue + 2, file: SFX.pop, vol: 0.14, dur: 14 },
    { at: c.grey + 2, file: SFX.pop, vol: 0.14, dur: 14 },
    ...cutHit(c.pages),
    { at: c.pages + 20, file: SFX.pop, vol: 0.14, dur: 14 },
    { at: c.pages + 30, file: SFX.pop, vol: 0.14, dur: 14 },
    { at: c.later + 6, file: SFX.click, vol: 0.12, dur: 8 },
    ...cutHit(c.shield),
    { at: c.shield + 20, file: SFX.pop, vol: 0.14, dur: 14 },
    { at: c.shield + 30, file: SFX.pop, vol: 0.14, dur: 14 },
    ...stamp(c.about),
    ...cutHit(c.future),
    { at: c.future + 20, file: SFX.pop, vol: 0.14, dur: 14 },
    ...stamp(c.review),
  ];
};

