// L16 scene l05 "A surface that isn't" (storyboard §3 "5 ·", shots 5-01…5-13, script lines 42-46). ShotDefs (hard cuts; PUSH
// / SLIDE rows are phases of one shot): 5-01 (+5-02) · 5-03 · 5-04 · 5-05 (+5-06) · 5-07 · 5-08 (+5-09) · 5-10 · 5-11 · 5-12 ·
// 5-13.
// Numbers drawn (READ entries in sundata.ts): 5,500 °C + ABOUT (#10 #15) · ONE TEN-THOUSANDTH OF SEA-LEVEL AIR (#12) · 1,400
// kg + ABOUT (#15) · 2,000 TO 3,000 KM (#16) · 2 million °C (#10). Class B, words / shapes only: A FEW HUNDRED KM + NOT TO
// SCALE (#15 conflict, F15), the dissolving carbon lump (no label, F3), the water cube (no numeral), the chromosphere's top
// temperature (not shown). Stamp: blue SEEN FROM AFAR from here on (F2, F16).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bloom, Layer, Sky, Stage, Tick, alpha, cameraAt, impact, mixHex, rnd, smoothPath, type Pt } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { sunGradient } from "../families";
import { READ } from "../sundata";
import { ConvCells, Granules, WindStreaks } from "../movers16";
import { SunLimb } from "../sunbody";
import { L16DialsHUD } from "../L16Dials";
import { AboutPill, StateStamp } from "../stamps";
import { Balance, Cube, GlassBox, Planet, Probe, Telescope } from "../props16";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { C, CELLS, CORONA, GLOW, Ledge, Plate, PlasmaFlow, Pop, QTag, Readout, SPACE, STU, Shimmer, SpaceField, Sparks, StudioSet, Tag, TallSky, Thermo, WallScale, cl01, ez, lerp, lin, rollText } from "./b-parts";

export const cuesL05 = (t: SceneTiming) => {
  const { at, frac, p } = cueKit(t);
  return {
    floor: 0, // 5-01
    land: frac(0, 0.3), // 5-02 (phase)
    plasma: frac(0, 0.55), // 5-03
    photo: frac(0, 0.8), // 5-04
    thick: at(1), // 5-05
    temp: frac(1, 0.35), // 5-06 (phase)
    thinner: frac(1, 0.7), // 5-07
    cant: at(2), // 5-08
    avg: frac(2, 0.4), // 5-09 (phase)
    water: frac(2, 0.76), // 5-10
    chromo: at(3), // 5-11
    surprising: p(3, "which is surprising"),
    leaps: frac(3, 0.7), // 5-12
    afar: at(4), // 5-13
    slam: p(4, "and not from a thermometer"),
  };
};
export type CL05 = ReturnType<typeof cuesL05>;
const ANTON = "'Anton', sans-serif";

/** A Sun disc with boiling granules clipped to it (no face, no outline, F5). */
const Disc: React.FC<{ f: number; cx: number; cy: number; r: number; id: string; gran?: number }> = ({ f, cx, cy, r, id, gran = 0.5 }) => {
  const clip = `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z`;
  return (
    <g>
      <defs>
        <radialGradient id={id}>
          {sunGradient(r).map(([o, cc], i) => (
            <stop key={i} offset={o} stopColor={cc} />
          ))}
        </radialGradient>
      </defs>
      <Bloom x={cx} y={cy} r={r * 1.6} color={C.amber} strength={0.6} />
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id})`} />
      {gran > 0 ? <Granules f={f} x={cx - r} y={cy - r} w={2 * r} h={2 * r} size={Math.max(40, r * 0.2)} drift={5} clip={clip} seed={5} colors={[alpha(C.tangerine, 0), C.amber, C.whiteGold]} opacity={gran} /> : null}
    </g>
  );
};

// ===============================================================================================================
// 5-01 + 5-02 · glow: the probe reaches the bottom of the corona, a gold wash wipes down the sky, the blue SEEN FROM AFAR
// stamp flips in (Tick stamps it from his ledge). Then a flat landing pad lowers onto the gold and sinks into the plasma
// (NO FLOOR); Tick looks over the ledge and shakes his head.
// MOVER: wash front wiping down (24 px/f) + stamp flip (13°/f) + granules + tilt → pad lowering (10 px/f) and sinking +
// plasma swirl (12 px/f).
// ===============================================================================================================
const ShotFloor: ShotFC<CL05> = ({ f, len, c }) => {
  const ph = c.land - c.floor;
  const g = f - ph;
  const front = Math.min(700, -400 + 24 * Math.max(0, f - 8));
  const cx = 960;
  const cy = 2900;
  const R = 2200;
  const surf = cy - R;
  const padY = g < 0 ? -300 : g < 30 ? lerp(320, surf - 20, ez(g, 0, 30)) : lerp(surf - 20, surf + 170, ez(g, 30, 92));
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 380, zoom: 1.04 },
    { f: 70, x: 960, y: 540, zoom: 1.0 },
    { f: len, x: 960, y: 560, zoom: 1.06 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={GLOW.theme} cam={cam} vignette={0.18} grain={0.4}>
        <Layer depth={1}>
          <TallSky top={-700} bottom={1200} stops={["#12063A", "#2A0E5C", "#5B1E8F", "#8E2A7E", "#C2287E"]} />
          <defs>
            <linearGradient id="l05wash" x1={0} y1={-700} x2={0} y2={front} gradientUnits="userSpaceOnUse">
              <stop offset={0} stopColor={C.magenta} stopOpacity={0} />
              <stop offset={0.6} stopColor={C.magenta} stopOpacity={0.6} />
              <stop offset={1} stopColor={C.amber} stopOpacity={0.9} />
            </linearGradient>
          </defs>
          <rect x={-400} y={-700} width={2720} height={front + 700} fill="url(#l05wash)" />
          {front < 700 ? <rect x={-400} y={front - 5} width={2720} height={10} fill={C.gold} opacity={0.9} /> : null}
        </Layer>
        <Layer depth={1}>
          <SunLimb f={f} cx={cx} cy={cy} R={R} drift={7} />
          <Probe x={1000} y={lerp(160, 330, ez(f, 0, 60))} size={150} f={f} tilt={90} />
          {g >= 0 ? (
            <g>
              {/* the landing pad: a flat plate on four legs, sinking into the gas */}
              <g opacity={1 - 0.75 * ez(g, 50, 92)}>
                <rect x={760} y={padY - 16} width={400} height={26} rx={10} fill={C.teal} stroke={C.ink} strokeWidth={4} />
                {[790, 880, 1040, 1130].map((x) => (
                  <line key={x} x1={x} y1={padY + 10} x2={x + (x < 960 ? -20 : 20)} y2={padY + 70} stroke={C.ink} strokeWidth={6} />
                ))}
              </g>
              {/* the surface closes over it (gas, not a floor) */}
              <path d={`M${cx - R} ${cy} a${R} ${R} 0 0 1 ${2 * R} 0`} transform={`translate(0 0)`} fill="none" />
              <rect x={600} y={surf + 6} width={720} height={260} fill={alpha(C.amber, 0.55 * ez(g, 30, 60))} />
              {[90, 150, 210].map((r, i) => {
                const a = (g * 12) / r + i * 2;
                return (
                  <path
                    key={r}
                    d={`M${960 + Math.cos(a) * r} ${surf + 40 + Math.sin(a) * r * 0.32} A${r} ${r * 0.32} 0 0 1 ${960 + Math.cos(a + 2.2) * r} ${surf + 40 + Math.sin(a + 2.2) * r * 0.32}`}
                    fill="none"
                    stroke={C.whiteGold}
                    strokeWidth={8}
                    strokeLinecap="round"
                    opacity={ez(g, 30, 44)}
                  />
                );
              })}
            </g>
          ) : null}
        </Layer>
        <Layer depth={0}>
          <StateStamp x={1430} y={330} state="afar" flip={{ from: "measured", age: f - 24 }} size={190} rotate={-8} paper={C.paper} />
          <Ledge
            x={1700}
            y={560}
            f={f}
            pxPerM={84}
            facing={-1}
            pose={g < 0 ? "press" : "lean"}
            expression={g < 0 ? "determined" : "worried"}
            look={g < 0 ? 0.4 : -0.6}
            headTilt={g > 40 ? Math.sin(g / 4) * 10 : 0}
            squash={impact(f, 26, 0.12, 10)}
          />
          <Tag x={960} y={150} text="NO FLOOR" F={GLOW} dot={C.gold} size={38} align="middle" opacity={g >= 0 ? ez(g, 30, 42) : 0} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 5-03 · cells: the sphere in cutaway, swirling gas all the way through (NO SOLID CORE). MOVER: rolling cells' arrow loops
// (12 px/f) + rising blobs + swirl arms turning (4°/f) + push-in.
// ===============================================================================================================
const ShotPlasma: ShotFC<CL05> = ({ f, len }) => {
  const r = 430;
  const cx = 960;
  const cy = 520;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: len, x: 960, y: 530, zoom: 1.12 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={CELLS.theme} cam={cam} vignette={0.2} grain={0.4}>
        <Layer depth={0.3}>
          <Sky family={CELLS} />
        </Layer>
        <Layer depth={1}>
          <Bloom x={cx} y={cy} r={r * 1.5} color={C.gold} strength={0.55} />
          <defs>
            <clipPath id="l05sphere">
              <circle cx={cx} cy={cy} r={r} />
            </clipPath>
            <radialGradient id="l05shade">
              <stop offset={0} stopColor={C.whiteGold} stopOpacity={0.55} />
              <stop offset={0.6} stopColor={C.gold} stopOpacity={0.1} />
              <stop offset={1} stopColor={C.magenta} stopOpacity={0.55} />
            </radialGradient>
          </defs>
          <g clipPath="url(#l05sphere)">
            <ConvCells f={f} x={cx - r} y={cy - r} w={2 * r} h={2 * r} cell={215} speed={12} seed={3} />
            <circle cx={cx} cy={cy} r={r} fill="url(#l05shade)" />
            {Array.from({ length: 4 }, (_, k) => {
              const pts: Pt[] = Array.from({ length: 24 }, (_, i) => {
                const u = i / 23;
                const a = (f * 4 + k * 90) * (Math.PI / 180) + u * 2.6;
                return [cx + Math.cos(a) * (30 + u * (r - 30)), cy + Math.sin(a) * (30 + u * (r - 30))];
              });
              return <path key={k} d={smoothPath(pts, 0.5)} fill="none" stroke={C.whiteGold} strokeWidth={10} strokeLinecap="round" opacity={0.55} />;
            })}
          </g>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.gold} strokeWidth={8} opacity={0.9} />
        </Layer>
        <Layer depth={0}>
          <Tag x={960} y={1010} text="NO SOLID CORE" F={CELLS} dot={C.whiteGold} size={36} align="middle" opacity={ez(f, 10, 22)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 5-04 · glow: a bright ring highlight sweeps the visible edge (PHOTOSPHERE) and a sight-line draws to a small Earth.
// MOVER: ring highlight sweeping (4°/f ≈ 29 px/f at the rim) + sight-line drawing (≈ 36 px/f) + granules + pull-back.
// ===============================================================================================================
const ShotPhoto: ShotFC<CL05> = ({ f, len }) => {
  const cx = 620;
  const cy = 540;
  const r = 400;
  const a = (-120 + f * 4) * (Math.PI / 180);
  const arc = (a0: number, a1: number, rr: number) => `M${cx + Math.cos(a0) * rr} ${cy + Math.sin(a0) * rr} A${rr} ${rr} 0 0 1 ${cx + Math.cos(a1) * rr} ${cy + Math.sin(a1) * rr}`;
  const sl = ez(f, 6, 26);
  const x1 = lerp(cx + r + 20, 1560, sl);
  const cam = cameraAt(f, [
    { f: 0, x: 860, y: 540, zoom: 1.12 },
    { f: len, x: 960, y: 540, zoom: 1.0 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={GLOW.theme} cam={cam} vignette={0.2} grain={0.4}>
        <Layer depth={0.3}>
          <Sky family={GLOW} angle={0} stops={["#C2287E", "#8E2A7E", "#2A0E5C", "#1B0B4F"]} />
        </Layer>
        <Layer depth={1}>
          <Disc f={f} cx={cx} cy={cy} r={r} id="l05disc4" />
          <circle cx={cx} cy={cy} r={r + 6} fill="none" stroke={C.whiteGold} strokeWidth={6} opacity={0.6} />
          <path d={arc(a, a + 1.2, r + 8)} fill="none" stroke={C.whiteGold} strokeWidth={22} strokeLinecap="round" />
          <Bloom x={cx + Math.cos(a + 0.6) * r} y={cy + Math.sin(a + 0.6) * r} r={160} color={C.whiteGold} strength={0.8} />
          <line x1={cx + r + 20} y1={cy} x2={x1} y2={cy} stroke={C.paper} strokeWidth={6} strokeDasharray="18 14" strokeDashoffset={-f * 3} />
          {sl > 0.98 ? <path d={`M1560 ${cy} l-34 -20 l0 40 Z`} fill={C.paper} /> : null}
          <Bloom x={1620} y={cy} r={110} color={C.cyan} strength={0.6} />
          <Planet x={1620} y={cy} r={26} f={f} kind="earth" />
          <text x={1620} y={cy + 72} textAnchor="middle" style={{ fontFamily: ANTON, fontSize: 26, letterSpacing: 3, fill: C.cyan }} opacity={ez(f, 20, 30)}>
            EARTH
          </text>
        </Layer>
        <Layer depth={0}>
          <Tag x={620} y={1020} text="PHOTOSPHERE" F={GLOW} dot={C.whiteGold} size={36} align="middle" opacity={ez(f, 8, 20)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 5-05 + 5-06 · close on the photosphere: a band of big fuzzy granules (A FEW HUNDRED KM, NOT TO SCALE: words, F15); Tick
// measures it from his ledge. Push: a thermometer reads 5,500 °C (ABOUT) and a dark carbon lump dissolves into rising
// gold dots (no label, F3). MOVER: granules boiling (10 px/f, big cells) + the bracket drawing → column rising (20 px/f)
// + dots streaming off the lump (16 px/f) + granules.
// ===============================================================================================================
const ShotThick: ShotFC<CL05> = ({ f, len, c }) => {
  const ph = c.temp - c.thick;
  const g = f - ph;
  const bandY = 420;
  const bandH = 300;
  const brk = lin(f, 12, 34);
  const k = ez(g, 4, 40);
  const lump = 1 - 0.65 * ez(g, 10, len - ph);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: ph, x: 960, y: 540, zoom: 1.04 },
    { f: len, x: 1000, y: 560, zoom: 1.12 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={GLOW.theme} cam={cam} vignette={0.2} grain={0.4}>
        <Layer depth={0.3}>
          <Sky stops={["#1B0B4F", "#5B1E8F", "#B2287A", C.tangerine, C.magenta, "#8E2A7E"]} />
        </Layer>
        <Layer depth={1}>
          <rect x={-400} y={bandY + bandH - 20} width={2720} height={900} fill={mixHex(C.tangerine, C.magenta, 0.35)} />
          <Granules f={f} x={-200} y={bandY} w={2320} h={bandH} size={130} drift={10} boil={1} seed={11} colors={[C.tangerine, C.amber, C.whiteGold]} />
          <rect x={-400} y={bandY - 30} width={2720} height={40} fill={alpha(C.magenta, 0.45)} />
          <rect x={-400} y={bandY + bandH - 10} width={2720} height={40} fill={alpha("#8E2A7E", 0.5)} />
          {/* Tick's measuring bracket across the band's thickness */}
          <g stroke={C.paper} strokeLinecap="round" opacity={g < 0 ? 1 : 1 - ez(g, 0, 12)}>
            <line x1={1440} y1={bandY} x2={1440} y2={lerp(bandY, bandY + bandH, brk)} strokeWidth={9} />
            <line x1={1416} y1={bandY} x2={1464} y2={bandY} strokeWidth={9} />
            {brk >= 1 ? <line x1={1416} y1={bandY + bandH} x2={1464} y2={bandY + bandH} strokeWidth={9} /> : null}
          </g>
          {g >= 0 ? (
            <g>
              <Thermo x={1560} y={900} h={560} fill={300 * ez(g, 4, 20)} f={f} color={C.amber} />
              <path
                d={smoothPath(
                  Array.from({ length: 8 }, (_, i): Pt => {
                    const a = (i / 8) * Math.PI * 2;
                    const rr = 95 * lump * (0.8 + 0.3 * rnd(i * 3 + 1));
                    return [1000 + Math.cos(a) * rr, 600 + Math.sin(a) * rr];
                  }).concat([[1000 + 95 * lump * (0.8 + 0.3 * rnd(1)), 600]]),
                  0.5,
                ) + " Z"}
                fill={C.shield}
                stroke="#0B0828"
                strokeWidth={4}
              />
              {Array.from({ length: 24 }, (_, i) => {
                const life = 34;
                const a = (g + rnd(i * 5 + 2) * life) % life;
                const x = 1000 + (rnd(i * 7 + 1) - 0.5) * 160 + Math.sin(a / 5 + i) * 12;
                const y = 560 - a * 16;
                return <circle key={i} cx={x} cy={y} r={9 * (1 - a / life) + 4} fill={C.gold} stroke={C.whiteGold} strokeWidth={2} opacity={1 - a / life} />;
              })}
            </g>
          ) : null}
        </Layer>
        <Layer depth={0}>
          <g opacity={g < 0 ? 1 : 1 - ez(g, 0, 10)}>
            <Tag x={200} y={300} text="A FEW HUNDRED KM" F={GLOW} dot={C.gold} size={36} opacity={ez(f, 16, 28)} />
            <Tag x={200} y={820} text="NOT TO SCALE" F={GLOW} size={28} opacity={ez(f, 24, 36)} />
            <Ledge x={1640} y={400} f={f} pxPerM={86} facing={-1} pose="point" staff expression="thinking" expressionTo="surprised" expressionT={ez(f, 40, 52)} look={0.9} headTilt={-10} />
          </g>
          {g >= 0 ? (
            <g>
              <Readout x={240} y={240} text={READ.surfaceC.text} shown={`${rollText(5500, k)} °C`} size={96} F={GLOW} opacity={ez(g, 2, 12)} />
              <AboutPill x={240} y={330} size={28} appear={ez(g, 12, 22)} />
            </g>
          ) : null}
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 5-07 · studio: two glass boxes, sea-level air with a dense swarm vs photosphere gas with one lone dot (ONE TEN-THOUSANDTH
// OF SEA-LEVEL AIR, #12). Tick counts the lone dot, wide-eyed. MOVER: dense dots (14 px/f) + the lone dot crossing (24
// px/f) + the boxes sliding in.
// ===============================================================================================================
const ShotThinner: ShotFC<CL05> = ({ f, len }) => {
  const s = ez(f, 0, 14);
  return (
    <Pop f={f}>
      <Stage theme={STU.theme} shotFrame={f} drift={{ zoom: 1.07, panX: 0.02, panY: 0.01, frames: len + 30, seed: 3 }} vignette={0.12} grain={0.4}>
        <StudioSet f={f} seed={13}>
          <g transform={`translate(${lerp(-900, 0, s)} 0)`}>
            <Plate x={200} y={190} w={700} h={540} />
            <GlassBox x={240} y={250} w={620} h={440} f={f} n={110} speed={14} dot={11} color={C.paper} seed={6} />
            <text x={550} y={235} textAnchor="middle" style={{ fontFamily: ANTON, fontSize: 30, letterSpacing: 3, fill: C.gold }}>
              SEA-LEVEL AIR
            </text>
          </g>
          <g transform={`translate(${lerp(900, 0, s)} 0)`}>
            <Plate x={1000} y={190} w={700} h={540} />
            <GlassBox x={1040} y={250} w={620} h={440} f={f} n={1} speed={24} dot={24} color={C.gold} seed={2} />
            <text x={1350} y={235} textAnchor="middle" style={{ fontFamily: ANTON, fontSize: 30, letterSpacing: 3, fill: C.gold }}>
              PHOTOSPHERE GAS
            </text>
          </g>
          <Tick x={1790} y={975} pxPerM={150} frame={f} facing={-1} pose="crouch-reach" expression="surprised" look={0.6} headTilt={Math.sin(f / 7) * 8} />
        </StudioSet>
        <Layer depth={0}>
          <Tag x={960} y={830} text={READ.thinAir.text} F={STU} dot={C.gold} size={32} align="middle" opacity={ez(f, 12, 24)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 5-08 + 5-09 · glow: a dashed ghost probe sinks through the gas without stopping (NOTHING TO LAND ON); slide: a one-metre
// cube of gold gas, 1,400 kg (ABOUT). MOVER: plasma blobs streaming up (13 px/f, the camera sinking) + the probe → the
// cube sliding in + its gas swarming (10 px/f) + the counter + plasma.
// ===============================================================================================================
const ShotSink: ShotFC<CL05> = ({ f, len, c }) => {
  const ph = c.avg - c.cant;
  const g = f - ph;
  const out = g >= 0 ? ez(g, 0, 16) : 0;
  const cubeX = lerp(2100, 760, g >= 0 ? ez(g, 0, 18) : 0);
  const k = g >= 0 ? ez(g, 10, 60) : 0;
  return (
    <Pop f={f}>
      <Stage theme={GLOW.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.01, panY: 0.01, frames: len + 30, seed: 4 }} vignette={0.2} grain={0.4}>
        <Layer depth={0.3}>
          <Sky stops={[C.magenta, C.tangerine, C.shieldRim, C.tangerine]} />
        </Layer>
        <Layer depth={1}>
          <PlasmaFlow f={f} speed={13} n={34} />
          <g transform={`translate(0 ${-out * 900})`}>
            <circle cx={960} cy={470} r={210} fill={alpha(C.violet, 0.8)} stroke={alpha(C.whiteGold, 0.6)} strokeWidth={4} />
            <Probe x={960} y={470 + Math.sin(f / 11) * 8} size={270} f={f} variant="ghost" tilt={90} />
          </g>
          {g >= 0 ? <Cube x={cubeX} y={340} size={420} f={f} n={60} speed={10} color={C.whiteGold} glass={C.indigo} /> : null}
          {g >= 0 ? (
            <text x={cubeX + 210} y={810} textAnchor="middle" style={{ fontFamily: ANTON, fontSize: 30, letterSpacing: 3, fill: C.ink }}>
              ONE CUBIC METRE
            </text>
          ) : null}
        </Layer>
        <Layer depth={0}>
          <Tag x={960} y={990} text="NOTHING TO LAND ON" F={GLOW} dot={C.whiteGold} size={36} align="middle" opacity={ez(f, 20, 32) * (1 - out)} />
          {g >= 0 ? (
            <g>
              <Readout x={180} y={260} text={READ.sunMass.text} shown={`${rollText(1400, k)} kg`} size={96} F={GLOW} opacity={ez(g, 8, 18)} />
              <AboutPill x={180} y={350} size={28} appear={ez(g, 16, 26)} />
            </g>
          ) : null}
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 5-10 · studio: a balance tips toward the gold gas cube against a teal water cube (no numeral): HEAVIER THAN WATER.
// MOVER: beam swinging over with a damped overshoot (≈ 110 px at the pans) + both cubes' dots + cyc clouds.
// ===============================================================================================================
const ShotWater: ShotFC<CL05> = ({ f, len }) => {
  const t0 = 8;
  const u = Math.max(0, f - t0);
  const tilt = (f < t0 ? 0.25 : -(1 - Math.exp(-u / 26) * Math.cos(u / 5)) * 0.9) + 0.16 * Math.sin(f / 8);
  const box = (gas: boolean) => (
    <g>
      <rect x={-95} y={-190} width={190} height={190} rx={10} fill={gas ? alpha(C.gold, 0.35) : C.teal} stroke={C.paper} strokeWidth={4} />
      <GlassBox x={-90} y={-185} w={180} h={180} f={f} n={gas ? 26 : 34} speed={gas ? 10 : 3} dot={7} color={gas ? C.gold : C.paper} seed={gas ? 3 : 7} frame={false} />
      <text x={0} y={-210} textAnchor="middle" style={{ fontFamily: ANTON, fontSize: 28, letterSpacing: 3, fill: STU.text }}>
        {gas ? "SUN GAS" : "WATER"}
      </text>
    </g>
  );
  return (
    <Pop f={f}>
      <Stage theme={STU.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0.02, panY: 0.01, frames: len + 30, seed: 5 }} vignette={0.12} grain={0.4}>
        <StudioSet f={f} seed={15}>
          <WallScale f={f} y={90} speed={7} opacity={0.35} />
          <Shimmer f={f} x={200} y={150} w={1520} h={700} n={12} speed={9} color={STU.haze} opacity={0.35} />
          <Balance x={960} y={360} w={980} f={f} tilt={tilt} left={box(true)} right={box(false)} color={C.paper} />
          <Tick x={1680} y={960} pxPerM={160} frame={f} facing={-1} pose={f < 40 ? "point" : "hips"} expression={f < 40 ? "thinking" : "proud"} look={0.3} headTilt={Math.sin(f / 9) * 6} />
        </StudioSet>
        <Layer depth={0}>
          <Tag x={960} y={1000} text="HEAVIER THAN WATER" F={STU} dot={C.gold} size={36} align="middle" opacity={ez(f, 26, 38)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 5-11 · glow, tilt up: above the granule band a thin brighter band with flickering jets (the chromosphere, 2,000 TO 3,000
// KM, enlarged: NOT TO SCALE); the HEAT needle ticks up as the eye crosses it and a "!" tag pops on "surprising".
// MOVER: jets flickering up (≈ 14-20 px/f at the tips) + granules + HEAT needle + tilt.
// ===============================================================================================================
const ShotChromo: ShotFC<CL05> = ({ f, len, c }) => {
  const s = c.surprising - c.chromo;
  const top = 700;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 700, zoom: 1.04 },
    { f: len, x: 960, y: 450, zoom: 1.0 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={GLOW.theme} cam={cam} vignette={0.2} grain={0.4}>
        <Layer depth={0.5}>
          <TallSky top={-300} bottom={1400} stops={["#12063A", "#2A0E5C", "#5B1E8F", "#8E2A7E", "#C2287E"]} />
        </Layer>
        <Layer depth={1}>
          <rect x={-400} y={top} width={2720} height={130} fill={mixHex(C.magenta, "#FF8AC8", 0.5)} />
          {Array.from({ length: 46 }, (_, i) => {
            const x = -120 + i * 48 + rnd(i * 3) * 20;
            const h = 70 + 200 * (0.35 + 0.65 * Math.abs(Math.sin(f / 9 + rnd(i * 7) * 6)));
            const w = 10 + rnd(i * 5) * 8;
            return <path key={i} d={`M${x - w} ${top + 20} Q${x + Math.sin(f / 13 + i) * 12} ${top - h * 0.5} ${x} ${top - h} Q${x + 4} ${top - h * 0.5} ${x + w} ${top + 20} Z`} fill={i % 3 ? "#FF9AD0" : C.whiteGold} opacity={0.85} />;
          })}
          <rect x={-400} y={top + 120} width={2720} height={700} fill={C.tangerine} />
          <Granules f={f} x={-200} y={top + 130} w={2320} h={420} size={120} drift={8} seed={13} colors={[C.tangerine, C.amber, C.whiteGold]} />
          <text x={1340} y={top + 84} style={{ fontFamily: ANTON, fontSize: 34, letterSpacing: 4, fill: C.ink }}>
            CHROMOSPHERE
          </text>
          <text x={1340} y={top + 220} style={{ fontFamily: ANTON, fontSize: 30, letterSpacing: 4, fill: C.ink }}>
            THE SURFACE (PHOTOSPHERE)
          </text>
          <QTag x={1120} y={top - 330} age={f - s} size={110} f={f} mark="!" fill={C.saffron} />
        </Layer>
        <Layer depth={0}>
          <Tag x={1810} y={130} text={READ.chromo.text} F={GLOW} dot={C.gold} size={34} align="end" opacity={ez(f, 20, 32)} />
          <Tag x={1810} y={210} text="NOT TO SCALE" F={GLOW} size={26} align="end" opacity={ez(f, 30, 42)} />
          <L16DialsHUD f={f} family={GLOW} theme="dark" only={["heat"]} heat={{ value: lerp(0.34, 0.56, ez(f, 30, 120)) }} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 5-12 · corona: a temperature trace climbs through the layers (words only: HOTTER →), runs along the cool surface and
// leaps off the top in the corona: 2 million °C. MOVER: the trace's drawing head (≈ 44 px/f) + counter + sparks rising +
// tilt up.
// ===============================================================================================================
const ShotLeap: ShotFC<CL05> = ({ f, len }) => {
  const pts: Pt[] = [
    [260, 1010],
    [300, 950],
    [330, 905],
    [470, 880],
    [600, 860],
    [1350, 820],
    [1560, 600],
    [1650, 200],
    [1700, -300],
  ];
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const total = seg.reduce((a, b) => a + b, 0);
  const d = Math.min(total, Math.max(0, f - 4) * 44);
  const drawn: Pt[] = [pts[0]];
  let acc = 0;
  for (let i = 0; i < seg.length; i++) {
    if (acc + seg[i] <= d) {
      acc += seg[i];
      drawn.push(pts[i + 1]);
    } else {
      const u = (d - acc) / seg[i];
      drawn.push([lerp(pts[i][0], pts[i + 1][0], u), lerp(pts[i][1], pts[i + 1][1], u)]);
      break;
    }
  }
  const head = drawn[drawn.length - 1];
  const k = cl01((d - 1200) / Math.max(1, total - 1200));
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.02 },
    { f: 20, x: 960, y: 540, zoom: 1.0 },
    { f: len, x: 1000, y: 360, zoom: 1.04 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={CORONA.theme} cam={cam} vignette={0.2} grain={0.4}>
        <Layer depth={0.6}>
          <TallSky top={-700} bottom={1200} stops={["#0E0430", "#1B0B4F", "#5B1E8F", "#B2287A", "#B2287A"]} />
        </Layer>
        <Layer depth={1}>
          <rect x={-400} y={840} width={2720} height={60} fill={mixHex(C.magenta, "#FF8AC8", 0.5)} />
          <rect x={-400} y={900} width={2720} height={400} fill={C.tangerine} />
          <Granules f={f} x={-200} y={905} w={2320} h={260} size={100} drift={7} seed={15} colors={[C.tangerine, C.amber, C.gold]} opacity={0.8} />
          <Sparks f={f} n={14} speed={18} angle={-90} box={{ x: 600, y: -700, w: 1400, h: 1500 }} r={11} seed={17} />
          <text x={110} y={980} style={{ fontFamily: ANTON, fontSize: 26, letterSpacing: 3, fill: C.ink }}>
            SURFACE
          </text>
          <text x={110} y={882} style={{ fontFamily: ANTON, fontSize: 24, letterSpacing: 3, fill: C.ink }}>
            CHROMOSPHERE
          </text>
          <text x={110} y={600} style={{ fontFamily: ANTON, fontSize: 30, letterSpacing: 4, fill: C.paper }}>
            CORONA
          </text>
          <path d={smoothPath(drawn, 0.3)} fill="none" stroke={alpha(C.gold, 0.35)} strokeWidth={24} strokeLinecap="round" strokeLinejoin="round" />
          <path d={smoothPath(drawn, 0.3)} fill="none" stroke={C.whiteGold} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
          <Bloom x={head[0]} y={head[1]} r={90} color={C.whiteGold} strength={0.9} />
          <circle cx={head[0]} cy={head[1]} r={13} fill="#FFFFFF" stroke={C.gold} strokeWidth={4} />
          <text x={1300} y={1060} style={{ fontFamily: ANTON, fontSize: 26, letterSpacing: 3, fill: C.ink }}>
            HOTTER →
          </text>
        </Layer>
        <Layer depth={0}>
          <Readout x={130} y={230} text={READ.coronaC.text} shown={k < 1 ? `${Math.round(2000000 * k).toLocaleString("en-US")} °C` : READ.coronaC.text} size={92} F={CORONA} opacity={ez(f, 20, 30)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 5-13 · space: blue light rays stream from the Sun across the dark to a small telescope near Earth; the blue SEEN FROM AFAR
// stamp slams on the stack of layers. Tick at the eyepiece. MOVER: light rays streaming (30 px/f) + stamp slam (40 px/f) +
// pan right. DARK.
// ===============================================================================================================
const ShotAfar: ShotFC<CL05> = ({ f, len, c }) => {
  const sl = c.slam - c.afar;
  const cam = cameraAt(f, [
    { f: 0, x: 800, y: 540, zoom: 1.04 },
    { f: len, x: 1080, y: 540, zoom: 1.0 },
  ]);
  const stack = { x: 470, y: 760, w: 300, h: 170 };
  return (
    <Pop f={f}>
      <Stage theme={SPACE.theme} cam={cam} vignette={0.28} grain={0.4}>
        <Layer depth={0.3}>
          <SpaceField f={f} seed={17} n={90} />
        </Layer>
        <Layer depth={1}>
          <WindStreaks f={f} mode="sweep" angle={6} box={{ x: 200, y: 330, w: 1420, h: 360 }} speed={30} count={60} len={200} width={6} seed={25} from={C.stampBlue} to={C.cyan} />
          <Disc f={f} cx={220} cy={500} r={210} id="l05disc13" gran={0.45} />
          {/* the stack of layers (photosphere, chromosphere, corona) */}
          <rect x={stack.x - 14} y={stack.y - 14} width={stack.w + 28} height={stack.h + 28} rx={18} fill={alpha(C.ink, 0.6)} stroke={C.paper} strokeWidth={3} />
          {[
            ["#5B1E8F", "CORONA"],
            [C.magenta, "CHROMOSPHERE"],
            [C.amber, "PHOTOSPHERE"],
          ].map(([col, w], i) => (
            <g key={w}>
              <rect x={stack.x} y={stack.y + i * (stack.h / 3)} width={stack.w} height={stack.h / 3 - 4} rx={6} fill={col} />
              <text x={stack.x + 16} y={stack.y + i * (stack.h / 3) + 38} style={{ fontFamily: ANTON, fontSize: 22, letterSpacing: 2, fill: C.paper }}>
                {w}
              </text>
            </g>
          ))}
          <StateStamp x={stack.x + stack.w - 30} y={stack.y + 40} state="afar" age={f - sl} size={190} rotate={-10} />
          {/* the observer's ledge near Earth */}
          <Bloom x={1780} y={860} r={150} color={C.cyan} strength={0.6} />
          <Planet x={1780} y={860} r={40} f={f} kind="earth" />
          <rect x={1400} y={900} width={330} height={18} rx={7} fill={mixHex(C.saffronDeep, C.indigo, 0.35)} />
          <rect x={1400} y={900} width={330} height={6} rx={3} fill={C.saffron} />
          <g transform="translate(3020 0) scale(-1 1)">
            <Telescope x={1510} y={790} size={230} f={f} tilt={-12} />
          </g>
          <Tick x={1640} y={900} pxPerM={74} frame={f} facing={-1} pose="lean" expression="thinking" look={0.2} headTilt={-6} squash={impact(f, sl + 2, 0.08, 8)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================

export const SceneL05: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL05(t);
  const shots: ShotDef<CL05>[] = [
    { from: 0, S: ShotFloor, id: "5-01" }, // + 5-02
    { from: c.plasma, S: ShotPlasma, id: "5-03" },
    { from: c.photo, S: ShotPhoto, id: "5-04" },
    { from: c.thick, S: ShotThick, id: "5-05" }, // + 5-06
    { from: c.thinner, S: ShotThinner, id: "5-07" },
    { from: c.cant, S: ShotSink, id: "5-08" }, // + 5-09
    { from: c.water, S: ShotWater, id: "5-10" },
    { from: c.chromo, S: ShotChromo, id: "5-11" },
    { from: c.leaps, S: ShotLeap, id: "5-12" },
    { from: c.afar, S: ShotAfar, id: "5-13" },
  ];
  return playShots(f, shots, c, t.frames);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL05 = (t: SceneTiming): Cue[] => {
  const c = cuesL05(t);
  const clicks = (at: number, n: number, gap = 7, vol = 0.06): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 7 }));
  return [
    { at: 4, file: SFX.swirl, vol: 0.16, dur: 50 },
    { at: 26, file: SFX.click, vol: 0.14, dur: 10 },
    { at: c.land + 30, file: SFX.pop, vol: 0.18, dur: 16 },
    ...cutHit(c.plasma),
    { at: c.plasma + 4, file: SFX.swirl, vol: 0.16, dur: 50 },
    ...cutHit(c.photo),
    { at: c.photo + 10, file: SFX.chime, vol: 0.16, dur: 60 },
    ...cutHit(c.thick),
    { at: c.thick + 14, file: SFX.click, vol: 0.12, dur: 10 },
    ...clicks(c.temp + 4, 5, 7),
    { at: c.temp + 20, file: SFX.swirl, vol: 0.12, dur: 50 },
    ...cutHit(c.thinner),
    { at: c.thinner + 14, file: SFX.pop, vol: 0.16, dur: 14 },
    ...cutHit(c.cant),
    { at: c.cant + 4, file: SFX.whoosh, vol: 0.18, dur: 50 },
    ...clicks(c.avg + 10, 7, 7),
    ...cutHit(c.water),
    { at: c.water + 12, file: SFX.popLong, vol: 0.18, dur: 30 },
    ...cutHit(c.chromo),
    { at: c.surprising, file: SFX.click, vol: 0.16, dur: 10 },
    ...cutHit(c.leaps),
    { at: c.leaps + 4, file: SFX.riser, vol: 0.14, dur: 70, fadeIn: 6, fadeOut: 12 },
    ...cutHit(c.afar),
    { at: c.slam, file: SFX.click, vol: 0.16, dur: 10 },
    { at: c.slam + 2, file: SFX.boom, vol: 0.3, dur: 120, fadeOut: 30 },
  ];
};
