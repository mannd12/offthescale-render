// L11 closer: the zoom-out (1 m ball → 1 mm hole), the honesty beat shown plainly, back to the cap, out to the planet,
// then a calm ~20 s "Off the Scale" end card with the right half left clear for YouTube's end-screen tiles.
// Every number drawn is a row in episodes/L11-dig-depth/sources.md:
//   Earth radius 6,371 km, core radius 3,485 km → core boundary at 2,886 km depth, more than 2,800 km of mantle (#25,
//   #29 arithmetic) · 1 m ball → 1 mm hole (#2, #25 arithmetic) · 180 °C, most-cited figure (#15) · heat + money (#22)
//   · mantle as it was (#31, #32) · 12,262 m (#2) · 23 cm (#3).
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
  Puffs,
  ReferenceFigure,
  ScaleBar,
  Stage,
  YouAreHere,
  cameraAt,
  crawl,
  decadeZoom,
  fall,
  fmt,
  labelStyle,
  lit,
  mixHex,
  numStyle,
  ptsToPath,
  ramp,
  rnd,
  shade,
  specks,
  tint,
} from "../../../lib/illustrated";
import { phraseAt } from "../cues";
import { Cue } from "./cue-types";
import { C, Dim, E, Land, SEA, ShotDef, ShotProps, Tag, lerp, playShots, rockBand } from "./S08";

/** Frames of end card after the last narration line. */
export const closerTail = 600;

const EARTH_KM = 6371; // #25
const CORE_KM = 3485; // #25
const KOLA_M = 12262; // #2

const closerCues = (t: SceneTiming) => {
  const at = (i: number) => t.lines[i].at;
  const p = (i: number, s: string, o = 0) => phraseAt(t, i, s, o);
  const last = t.lines[t.lines.length - 1];
  return {
    mantle: p(0, "kilometres of mantle"),
    core: p(0, "the core"),
    shrink: p(0, "Shrink Earth", -3),
    deepest: p(0, "The deepest hole", -3),
    mm: p(0, "one millimetre"),
    simpler: at(1) - 8,
    c180: p(1, "The hundred and eighty", -2),
    logs: p(1, "we haven't seen"),
    why: at(2) - 6,
    atlantic: p(2, "And that Atlantic", -3),
    asWas: p(2, "It's mantle as it was"),
    goal: at(3) - 6,
    cap: at(4) - 8,
    twelve: p(4, "Twelve kilometres", -3),
    globe: at(5) - 8,
    endCard: last.at + last.audioFrames + 6,
    end: t.frames + closerTail,
  };
};
type KC = ReturnType<typeof closerCues>;
type SP = ShotProps<KC>;

const MANTLE = C.mantle;
const CORE = mixHex(E.b, P.graphite, 0.25);

/** Earth as a cut disc: two-tone mantle, hatched core, crust ring (scaled), ticks. */
const Earth: React.FC<{ f: number; ox: number; oy: number; R: number; id: string; crustKm?: number; ticks?: number }> = ({ f, ox, oy, R, id, crustKm = 40, ticks = 1 }) => {
  const pxkm = R / EARTH_KM;
  return (
    <g>
      <Hatch id={`${id}-core`} color={mixHex(E.b, P.graphite, 0.45)} gap={16} dots width={2} />
      {ticks > 0 ? (
        <g transform={`rotate(${f * 0.05} ${ox} ${oy})`} stroke={P.chalkSoft} strokeWidth={2} opacity={ticks}>
          {Array.from({ length: 72 }, (_, i) => {
            const a = (i / 72) * Math.PI * 2;
            const r2 = R + (i % 6 === 0 ? 40 : 28);
            return <line key={i} x1={ox + Math.cos(a) * (R + 18)} y1={oy + Math.sin(a) * (R + 18)} x2={ox + Math.cos(a) * r2} y2={oy + Math.sin(a) * r2} />;
          })}
        </g>
      ) : null}
      <defs>
        <clipPath id={`${id}-disc`}>
          <circle cx={ox} cy={oy} r={R} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-disc)`}>
        <circle cx={ox} cy={oy} r={R} fill={shade(mixHex(E.b, P.graphite, 0.5), 0.3)} />
        <circle cx={ox - R * 0.14} cy={oy - R * 0.14} r={R} fill={mixHex(E.b, P.graphite, 0.5)} />
      </g>
      <circle cx={ox} cy={oy} r={CORE_KM * pxkm} fill={CORE} />
      <circle cx={ox} cy={oy} r={CORE_KM * pxkm} fill={`url(#${id}-core)`} />
      <circle cx={ox} cy={oy} r={R - (crustKm * pxkm) / 2} fill="none" stroke={tint(E.a, P.bone, 0.3)} strokeWidth={Math.max(1.5, crustKm * pxkm)} />
      <circle cx={ox} cy={oy} r={R} fill="none" stroke={P.chalk} strokeWidth={2.5} />
    </g>
  );
};

// Shot 1 - "more than 2,800 km of mantle before the core": the gauge zooms out by decades while the camera pulls back
const ShotMantle: React.FC<SP> = ({ f, len, k }) => {
  const L = Math.max(len, 60);
  const ox = 760;
  const oy = 620;
  const R = 430;
  const pin = { x: ox, y: oy - R };
  const cam = cameraAt(f, [
    { f: 0, x: pin.x, y: pin.y + 10, zoom: 14 },
    { f: Math.round(L * 0.7), x: 820, y: 560, zoom: 1.05 },
    { f: L + 20, x: 830, y: 560, zoom: 1.0 },
  ]);
  const sx = (wx: number) => 960 + (wx - cam.x) * cam.zoom;
  const sy = (wy: number) => 540 + (wy - cam.y) * cam.zoom;
  const gmax = decadeZoom(15, EARTH_KM, ramp(f, 0, L * 0.7));
  const coreDepth = EARTH_KM - CORE_KM; // 2,886 km
  const pxkm = R / EARTH_KM;
  const br = ramp(f, k.mantle - 10, k.mantle + 10);
  const cr = ramp(f, k.core - 6, k.core + 8);
  return (
    <Stage theme={GRAPHITE} cam={cam} vignette={0.3}>
      <Layer depth={0.05}>
        {specks(f, 50, 2400, 1400, 13, 4).map((p, i) => (
          <circle key={i} cx={p.x - 240} cy={p.y - 160} r={p.r * 0.5} fill={P.chalkSoft} opacity={0.35} />
        ))}
      </Layer>
      <Layer depth={1}>
        <Earth f={f} ox={ox} oy={oy} R={R} id="cl-m" ticks={interpolate(cam.zoom, [1.2, 2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
        <line x1={pin.x} y1={pin.y} x2={pin.x} y2={pin.y + (KOLA_M / 1000) * pxkm} stroke={P.graphite} strokeWidth={3} />
      </Layer>
      <Layer depth={0}>
        <YouAreHere x={sx(pin.x)} y={sy(pin.y) - 6} size={30} label="Kola" font={IF.label} side="left" />
        <g opacity={br}>
          <line x1={sx(ox + 40)} y1={sy(oy - R + 6)} x2={sx(ox + 40)} y2={sy(oy - CORE_KM * pxkm)} stroke={P.chalk} strokeWidth={3} />
          <line x1={sx(ox + 28)} y1={sy(oy - CORE_KM * pxkm)} x2={sx(ox + 52)} y2={sy(oy - CORE_KM * pxkm)} stroke={P.chalk} strokeWidth={3} />
          <Tag x={sx(ox + 70)} y={sy(oy - R + ((R - CORE_KM * pxkm) / 2))} text="> 2,800 km" num size={32} theme={GRAPHITE} />
          <text x={sx(ox + 70)} y={sy(oy - R + ((R - CORE_KM * pxkm) / 2)) + 56} style={labelStyle(30, P.chalk, 4)}>
            Mantle
          </text>
        </g>
        <text x={sx(ox)} y={sy(oy) + 12} textAnchor="middle" style={labelStyle(40, P.chalk, 5)} opacity={cr}>
          Core
        </text>
        <Gauge
          x={1600}
          y={190}
          height={700}
          value={KOLA_M / 1000}
          max={gmax}
          unit="km"
          theme={GRAPHITE}
          title="DEPTH"
          readoutText={`${fmt(KOLA_M)} m`}
          marks={gmax > 3200 ? [{ v: coreDepth, label: "CORE" }] : []}
          plate={110}
          unitCap={false}
        />
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// The 1 m ball beside the figure (shots 2-3). 300 px per metre.
const PPM = 300;
const BG = 880;
const BX = 1120;
const BR = 150;
const Ball: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <ellipse cx={BX + 60} cy={BG + 4} rx={BR * 1.1} ry={18} fill={shade(P.boneDeep, 0.2)} />
    <defs>
      <clipPath id="cl-ball">
        <circle cx={BX} cy={BG - BR} r={BR} />
      </clipPath>
    </defs>
    <g clipPath="url(#cl-ball)">
      <circle cx={BX} cy={BG - BR} r={BR} fill={shade(P.boneDeep, 0.18)} />
      <circle cx={BX - BR * 0.18} cy={BG - BR - BR * 0.18} r={BR} fill={lit(P.boneDeep, 0.35)} />
      {[-0.6, -0.3, 0, 0.3, 0.6].map((a, i) => (
        <ellipse key={i} cx={BX} cy={BG - BR + a * BR} rx={BR * Math.sqrt(1 - a * a)} ry={BR * 0.12 * Math.sqrt(1 - a * a)} fill="none" stroke={tint(E.a, P.bone, 0.5)} strokeWidth={1.5} strokeDasharray="6 6" strokeDashoffset={crawl(f, 0.3)} />
      ))}
    </g>
    <circle cx={BX} cy={BG - BR} r={BR} fill="none" stroke={P.ink} strokeWidth={2.5} />
  </g>
);

// Shot 2 - "Shrink Earth to a ball one metre across": a paper ball beside the figure, true scale
const ShotBall: React.FC<SP> = ({ f, len }) => {
  const L = Math.max(len, 60);
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 560, zoom: 1.12 },
    { f: L, x: 980, y: 580, zoom: 1.04 },
  ]);
  const pop = ramp(f, 0, 12);
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={0.3}>
        {specks(f, 30, 2200, 1200, 7, 6).map((s, i) => (
          <circle key={i} cx={s.x - 140} cy={s.y - 60} r={s.r * 0.6} fill={tint(E.a, P.bone, 0.6)} />
        ))}
      </Layer>
      <Layer depth={1}>
        <rect x={-800} y={BG} width={3600} height={600} fill={P.boneDeep} />
        <line x1={-800} y1={BG} x2={2800} y2={BG} stroke={P.ink} strokeWidth={2.5} />
        <g transform={`translate(${BX} ${BG}) scale(${0.85 + 0.15 * pop}) translate(${-BX} ${-BG})`} opacity={pop}>
          <Ball f={f} />
        </g>
        <ReferenceFigure x={780} y={BG} pxPerM={PPM} breath={f} look={lerp(f, 6, 24, -0.2, 0.7)} />
        <Dim x1={BX - BR} y1={BG + 60} x2={BX + BR} y2={BG + 60} k={ramp(f, 10, 26)} />
        <Tag x={BX} y={BG + 112} text="1 m" num size={34} anchor="middle" o={ramp(f, 20, 30)} />
      </Layer>
      <Layer depth={0}>
        <ScaleBar x={110} y={990} px={PPM} label="1 m" color={P.ink} font={IF.label} />
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 3 - "would be one millimetre deep": push in to the top of the ball; a magnifier shows the 1 mm nick
const ShotMm: React.FC<SP> = ({ f, len, k }) => {
  const L = Math.max(len, 60);
  const top = { x: BX, y: BG - 2 * BR };
  const cam = cameraAt(f, [
    { f: 0, x: 1000, y: 580, zoom: 1.04 },
    { f: Math.round(L * 0.5), x: BX - 40, y: top.y + 120, zoom: 1.7 },
    { f: L, x: BX - 30, y: top.y + 110, zoom: 1.8 },
  ]);
  const mag = ramp(f, 14, 30);
  const mm = k.mm - k.deepest;
  const PXMM = 70;
  const mx = 1530;
  const my = 330;
  const mr = 220;
  const notch = ramp(f, mm - 10, mm + 10);
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={1}>
        <rect x={-800} y={BG} width={3600} height={600} fill={P.boneDeep} />
        <line x1={-800} y1={BG} x2={2800} y2={BG} stroke={P.ink} strokeWidth={2.5} />
        <Ball f={f} />
        <ReferenceFigure x={780} y={BG} pxPerM={PPM} breath={f} look={0.7} />
        <circle cx={top.x} cy={top.y} r={8} fill="none" stroke={P.ink} strokeWidth={2} opacity={mag} />
      </Layer>
      <Layer depth={0}>
        <g opacity={mag}>
          <line x1={960 + (top.x - cam.x) * cam.zoom} y1={540 + (top.y - cam.y) * cam.zoom} x2={mx - mr * 0.7} y2={my + mr * 0.7} stroke={P.ink} strokeWidth={2} strokeDasharray="6 6" />
          <defs>
            <clipPath id="cl-mag">
              <circle cx={mx} cy={my} r={mr} />
            </clipPath>
          </defs>
          <g clipPath="url(#cl-mag)">
            <rect x={mx - mr} y={my - mr} width={mr * 2} height={mr * 2} fill={C.skyMid} />
            {/* the ball's surface, nearly flat at this magnification */}
            <rect x={mx - mr} y={my - 40} width={mr * 2} height={mr * 2} fill={lit(P.boneDeep, 0.35)} />
            <rect x={mx - mr} y={my - 40} width={mr * 2} height={mr * 2} fill="none" />
            <line x1={mx - mr} y1={my - 40} x2={mx + mr} y2={my - 40} stroke={P.ink} strokeWidth={2.5} />
            {/* the hole: a hairline 1 mm deep (its width rounds to nothing at this scale) */}
            <line x1={mx} y1={my - 40} x2={mx} y2={my - 40 + PXMM * notch} stroke={P.graphite} strokeWidth={3} />
            {/* millimetre ruler */}
            {Array.from({ length: 4 }, (_, i) => (
              <g key={i}>
                <line x1={mx + 60} y1={my - 40 + i * PXMM} x2={mx + (i % 2 ? 80 : 96)} y2={my - 40 + i * PXMM} stroke={P.ink} strokeWidth={2} />
              </g>
            ))}
            <line x1={mx + 60} y1={my - 40} x2={mx + 60} y2={my - 40 + 3 * PXMM} stroke={P.ink} strokeWidth={2} />
          </g>
          <circle cx={mx} cy={my} r={mr} fill="none" stroke={P.ink} strokeWidth={6} />
          <line x1={mx - mr * 0.72} y1={my + mr * 0.72} x2={mx - mr * 1.05} y2={my + mr * 1.05} stroke={P.ink} strokeWidth={14} strokeLinecap="round" />
          <Tag x={mx - 30} y={my + 30} text="1 mm" num size={36} anchor="end" o={notch} />
        </g>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Quiet honesty plates (graphite): one idea per plate, drifting slowly
const Plate: React.FC<{ x: number; y: number; w: number; h: number; o: number; children: React.ReactNode }> = ({ x, y, w, h, o, children }) => (
  <g opacity={o} transform={`translate(0 ${(1 - o) * 30})`}>
    <rect x={x} y={y} width={w} height={h} fill={P.graphiteLift} stroke={P.chalkSoft} strokeWidth={2} />
    {children}
  </g>
);

// Shot 4 - "simpler than the real story ... 180 °C is the figure most reports give; we haven't seen the final logs"
const ShotHonest180: React.FC<SP> = ({ f, len, k }) => {
  const L = Math.max(len, 60);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.06 },
    { f: L, x: 960, y: 560, zoom: 1.0 },
  ]);
  const c = k.c180 - k.simpler;
  const lg = k.logs - k.simpler;
  return (
    <Stage theme={GRAPHITE} cam={cam} vignette={0.28}>
      <Layer depth={0.2}>
        {specks(f, 40, 2200, 1200, 19, 6).map((s, i) => (
          <circle key={i} cx={s.x - 140} cy={s.y - 60} r={s.r * 0.5} fill={P.chalkSoft} opacity={0.3} />
        ))}
      </Layer>
      <Layer depth={1}>
        <Plate x={420} y={300} w={620} h={420} o={ramp(f, c, c + 14)}>
          <text x={730} y={500} textAnchor="middle" style={numStyle(130, P.chalk)}>
            180 °C
          </text>
          <text x={730} y={600} textAnchor="middle" style={labelStyle(40, P.chalkSoft, 4)}>
            Most-cited figure
          </text>
        </Plate>
        {/* the drillers' final logs: an unseen stack, drawn only in dashed outline */}
        <g opacity={ramp(f, lg, lg + 14)}>
          {[0, 1, 2].map((i) => (
            <rect key={i} x={1180 + i * 22} y={330 + i * 22} width={300} height={380} fill="none" stroke={P.chalkSoft} strokeWidth={2.5} strokeDasharray="12 9" strokeDashoffset={crawl(f, 0.5)} />
          ))}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line key={i} x1={1250} y1={420 + i * 40} x2={1250 + 150 + rnd(i) * 60} y2={420 + i * 40} stroke={P.chalkSoft} strokeWidth={3} strokeDasharray="8 10" opacity={0.6} />
          ))}
          <text x={1370} y={790} textAnchor="middle" style={labelStyle(34, P.chalkSoft, 4)}>
            Not seen
          </text>
        </g>
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// Shot 5 - "heat and money together, sources weigh them differently": a balance that never settles
const ShotBalance: React.FC<SP> = ({ f, len }) => {
  const L = Math.max(len, 60);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.0 },
    { f: L, x: 960, y: 540, zoom: 1.08 },
  ]);
  const tilt = Math.sin(f / 22) * 7 * (0.6 + 0.4 * Math.sin(f / 61));
  const px = 960;
  const py = 380;
  const arm = 340;
  const end = (s: number) => ({ x: px + s * arm * Math.cos((tilt * Math.PI) / 180), y: py + s * arm * Math.sin((tilt * Math.PI) / 180) });
  const l = end(-1);
  const r = end(1);
  const pan = (x: number, y: number, children: React.ReactNode) => (
    <g>
      <line x1={x} y1={y} x2={x - 90} y2={y + 160} stroke={P.chalkSoft} strokeWidth={2} />
      <line x1={x} y1={y} x2={x + 90} y2={y + 160} stroke={P.chalkSoft} strokeWidth={2} />
      <path d={`M${x - 120} ${y + 160} L${x + 120} ${y + 160} L${x + 90} ${y + 186} L${x - 90} ${y + 186} Z`} fill={P.chalkSoft} />
      {children}
    </g>
  );
  return (
    <Stage theme={GRAPHITE} cam={cam} vignette={0.28}>
      <Layer depth={0.2}>
        {specks(f, 40, 2200, 1200, 23, 6).map((s, i) => (
          <circle key={i} cx={s.x - 140} cy={s.y - 60} r={s.r * 0.5} fill={P.chalkSoft} opacity={0.3} />
        ))}
      </Layer>
      <Layer depth={1}>
        <path d={`M${px - 70} 860 L${px + 70} 860 L${px + 12} ${py} L${px - 12} ${py} Z`} fill={lit(P.graphiteLift, 0.12)} />
        <path d={`M${px} 860 L${px + 70} 860 L${px + 12} ${py} L${px} ${py} Z`} fill={P.graphiteLift} />
        <line x1={l.x} y1={l.y} x2={r.x} y2={r.y} stroke={P.chalk} strokeWidth={8} />
        <circle cx={px} cy={py} r={14} fill={P.chalk} />
        {pan(l.x, l.y, (
          <g>
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={l.x - 80} y={l.y + 80 + i * 20} width={160} height={20} fill={mixHex(tint(E.b, P.bone, 0.4), mixHex(E.b, "#7A3418", 0.55), i / 3)} />
            ))}
            <text x={l.x} y={l.y + 250} textAnchor="middle" style={labelStyle(48, P.chalk, 4)}>
              Heat
            </text>
          </g>
        ))}
        {pan(r.x, r.y, (
          <g>
            {[0, 1, 2, 3].map((i) => (
              <g key={i}>
                <ellipse cx={r.x} cy={r.y + 150 - i * 18} rx={60} ry={12} fill={i % 2 ? tint(E.b, P.graphite, 0.15) : lit(E.b, 0.1)} />
              </g>
            ))}
            <text x={r.x} y={r.y + 250} textAnchor="middle" style={labelStyle(48, P.chalk, 4)}>
              Money
            </text>
          </g>
        ))}
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// Shot 6 - "that Atlantic rock had been lifted and soaked in seawater ... mantle as it was": a core sample, water in it
const ShotAsWas: React.FC<SP> = ({ f, len, k }) => {
  const L = Math.max(len, 60);
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 600, zoom: 1.1 },
    { f: L, x: 960, y: 540, zoom: 1.0 },
  ]);
  const w = k.asWas - k.atlantic;
  const lift = lerp(f, 0, w * 0.6, 160, 0);
  const cx = 760;
  const cy = 520 + lift;
  return (
    <Stage theme={GRAPHITE} cam={cam} vignette={0.28}>
      <Layer depth={0.2}>
        {specks(f, 40, 2200, 1200, 29, 6).map((s, i) => (
          <circle key={i} cx={s.x - 140} cy={s.y - 60} r={s.r * 0.5} fill={P.chalkSoft} opacity={0.3} />
        ))}
      </Layer>
      <Layer depth={1}>
        {/* a drill core: cylinder lying on its side, lit top, with sea-glass veins and specks */}
        <rect x={cx - 360} y={cy - 70} width={720} height={140} fill={MANTLE} />
        <rect x={cx - 360} y={cy - 70} width={720} height={40} fill={lit(MANTLE, 0.25)} />
        <rect x={cx - 360} y={cy + 30} width={720} height={40} fill={shade(MANTLE, 0.2)} />
        <ellipse cx={cx + 360} cy={cy} rx={30} ry={70} fill={shade(MANTLE, 0.1)} />
        <ellipse cx={cx - 360} cy={cy} rx={30} ry={70} fill={lit(MANTLE, 0.1)} stroke={P.chalk} strokeWidth={2} />
        {Array.from({ length: 7 }, (_, i) => {
          const x = cx - 320 + i * 100 + rnd(i) * 40;
          return <path key={i} d={ptsToPath([[x, cy - 70], [x + 20, cy - 20], [x - 10, cy + 20], [x + 14, cy + 70]])} fill="none" stroke={lit(SEA, 0.25)} strokeWidth={4} />;
        })}
        {Array.from({ length: 24 }, (_, i) => {
          const a = ((f * 0.6 + i * 37) % 200) / 200;
          return <circle key={i} cx={cx - 340 + rnd(i + 2) * 680} cy={cy + 160 - a * 230} r={3.5} fill={SEA} opacity={(1 - a) * 0.8} />;
        })}
        <Tag x={cx} y={cy - 150} text="Mantle as it was" size={44} anchor="middle" theme={GRAPHITE} o={ramp(f, w, w + 12)} />
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// Shot 7 - "mantle where it actually is today is still a goal": a dashed hole reaching for a dashed target, not arriving
const ShotGoal: React.FC<SP> = ({ f, len }) => {
  const L = Math.max(len, 60);
  const G = 260;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 520, zoom: 1.1 },
    { f: L, x: 960, y: 600, zoom: 1.2 },
  ]);
  const reach = lerp(f, 0, L * 0.7, 0, 1, Easing.out(Easing.quad));
  return (
    <Stage theme={GRAPHITE} cam={cam} vignette={0.28}>
      <Layer depth={1}>
        <rect x={-800} y={-800} width={3600} height={800 + G - 60} fill={mixHex(SEA, P.graphite, 0.45)} />
        <rect x={-800} y={G - 60} width={3600} height={60} fill={shade(SEA, 0.2)} />
        <rect x={-800} y={G} width={3600} height={140} fill={tint(E.a, P.bone, 0.25)} />
        <rect x={-800} y={G + 140} width={3600} height={1200} fill={MANTLE} />
        <Hatch id="cl-g" color={shade(MANTLE, 0.2)} gap={16} dots width={1.6} />
        <rect x={-800} y={G + 140} width={3600} height={1200} fill="url(#cl-g)" />
        <line x1={-800} y1={G + 140} x2={2800} y2={G + 140} stroke={P.ink} strokeWidth={3} strokeDasharray="14 9" strokeDashoffset={crawl(f, 0.8)} />
        <line x1={960} y1={G} x2={960} y2={G + 140 + 330 * reach} stroke={P.chalk} strokeWidth={5} strokeDasharray="14 10" strokeDashoffset={crawl(f, 1.2)} />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={960} cy={G + 620} r={40 + i * 36 + Math.sin(f / 20 + i) * 4} fill="none" stroke={P.chalk} strokeWidth={3} strokeDasharray="10 8" strokeDashoffset={crawl(f, i % 2 ? 0.6 : -0.6)} />
        ))}
        <Tag x={1140} y={G + 620} text="Goal" size={44} theme={GRAPHITE} o={ramp(f, 10, 22)} />
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// Shot 8 - back to the cap in the snow, the figure beside it; then the cut-away: 12 km down, 23 cm across
const ShotCapAgain: React.FC<SP> = ({ f, len, k }) => {
  const L = Math.max(len, 60);
  const H = 520;
  const G = 760;
  const ppm = 170;
  const tw = k.twelve - k.cap;
  const cut = ramp(f, tw, tw + 20);
  const cam = cameraAt(f, [
    { f: 0, x: 1000, y: 640, zoom: 1.25 },
    { f: tw, x: 980, y: 600, zoom: 1.05 },
    { f: L + 20, x: 960, y: 560, zoom: 0.9 },
  ]);
  const capX = 1080;
  const capPx = 0.23 * ppm;
  const snow = fall(f, 50, 2400, 900, 33, 0.9, 14);
  return (
    <Stage theme={BONE} cam={cam}>
      <Land f={f} horizon={H} seed={51} />
      <Layer depth={1}>
        <rect x={-800} y={H} width={3600} height={G - H} fill={C.tundra} />
        {[[100, 600, 260], [520, 680, 180], [1300, 640, 300], [1500, 720, 200]].map(([x, y, w], i) => (
          <path key={i} d={ptsToPath([[x, y], [x + w * 0.25, y - 10], [x + w, y - 6], [x + w * 0.85, y + 8], [x + w * 0.1, y + 9]]) + " Z"} fill={C.snow} />
        ))}
        {/* cut-away face below the ground line */}
        <rect x={-800} y={G} width={3600} height={900} fill={C.tundra} />
        <g opacity={cut}>
          {Array.from({ length: 6 }, (_, i) => (
            <rect key={i} x={-800} y={G + i * 60} width={3600} height={61} fill={rockBand(i, i / 6)} />
          ))}
          <rect x={-800} y={G + 360} width={3600} height={600} fill={rockBand(6, 0.9)} />
          <line x1={-800} y1={G} x2={2800} y2={G} stroke={P.ink} strokeWidth={2.5} />
          <rect x={capX - capPx / 2} y={G} width={capPx} height={900} fill={C.hole} />
          <line x1={capX} y1={G + 300} x2={capX} y2={G + 900} stroke={P.bone} strokeWidth={3} strokeDasharray="14 12" strokeDashoffset={crawl(f, 2)} opacity={0.6} />
          <Tag x={capX + 50} y={G + 220} text="12 km" num size={36} />
          <Dim x1={capX - capPx / 2} y1={G - 70} x2={capX + capPx / 2} y2={G - 70} w={2} />
          <Tag x={capX + 50} y={G - 80} text="23 cm" num size={30} />
        </g>
        <ellipse cx={capX + 10} cy={G - 4} rx={capPx * 0.75} ry={capPx * 0.16} fill={shade(C.tundra, 0.22)} />
        <rect x={capX - capPx / 2} y={G - 14} width={capPx} height={10} fill={shade(C.metal, 0.3)} />
        <ellipse cx={capX} cy={G - 14} rx={capPx / 2} ry={capPx * 0.15} fill={C.metal} />
        <ReferenceFigure x={capX - 160} y={G - 4} pxPerM={ppm} breath={f} look={0.5} />
        <Puffs frame={f} x={capX - 148} y={G - 4 - 1.55 * ppm} color={C.snow} period={70} size={8} rise={0.5} drift={0.5} life={50} seed={7} />
      </Layer>
      <Layer depth={1.25}>
        {snow.map((p, i) => (
          <circle key={i} cx={p.x - 200} cy={p.y - 100} r={p.r} fill={C.snow} opacity={0.85} />
        ))}
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 9 - "we know from waves that travel through it, and from rock that came up": the planet, waves crossing it,
// then (end card) the planet settles left, the wordmark appears, and the right half stays clear for end-screen tiles
const ShotPlanet: React.FC<SP> = ({ f, len, k }) => {
  const ec = k.endCard - k.globe;
  const e = ramp(f, ec, ec + 45);
  const R0 = 400;
  const R = R0 + (250 - R0) * e;
  const ox = 960 + (450 - 960) * e;
  const oy = 560 + (450 - 560) * e;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560 - R0 + 20, zoom: 9 },
    { f: Math.min(ec - 10, 120), x: 960, y: 560, zoom: 1.0 },
    { f: len, x: 960, y: 548, zoom: 1.0 },
  ]);
  const pin = { x: ox - R * Math.sin(0.5), y: oy - R * Math.cos(0.5) };
  const atl = { x: ox + R * Math.sin(1.1), y: oy - R * Math.cos(1.1) };
  // seismic rays: chords from a quake point, a pulse travelling each one; they fade out on the end card
  const quake = { x: ox - R * Math.sin(-1.4), y: oy - R * Math.cos(-1.4) };
  const rays = [0.9, 1.6, 2.4, 3.0, 3.7];
  const wv = 1 - e;
  const wm = ramp(f, ec + 20, ec + 50);
  return (
    <Stage theme={GRAPHITE} cam={cam} vignette={0.3}>
      <Layer depth={0.05}>
        {specks(f, 60, 2400, 1400, 37, 5).map((p, i) => (
          <circle key={i} cx={p.x - 240} cy={p.y - 160} r={p.r * 0.5} fill={P.chalkSoft} opacity={0.35} />
        ))}
      </Layer>
      <Layer depth={1}>
        <Earth f={f} ox={ox} oy={oy} R={R} id="cl-p" ticks={interpolate(cam.zoom, [1.2, 2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
        <g opacity={wv * 0.9}>
          {rays.map((a, i) => {
            const b = { x: ox + R * Math.sin(a), y: oy - R * Math.cos(a) };
            const ph = ((f * 0.012 + i * 0.21) % 1 + 1) % 1;
            const px = quake.x + (b.x - quake.x) * ph;
            const py = quake.y + (b.y - quake.y) * ph;
            return (
              <g key={i}>
                <line x1={quake.x} y1={quake.y} x2={b.x} y2={b.y} stroke={P.chalk} strokeWidth={1.5} strokeDasharray="6 10" opacity={0.6} />
                <circle cx={px} cy={py} r={6} fill={P.chalk} />
              </g>
            );
          })}
        </g>
        {/* rock that came up to meet us: small arrows rising at the Atlantic ridge */}
        <g opacity={wv} fill={lit(MANTLE, 0.3)}>
          {[0, 1].map((i) => {
            const a = ((f * 0.02 + i * 0.5) % 1 + 1) % 1;
            const x = atl.x - Math.sin(1.1) * 60 * (1 - a);
            const y = atl.y + Math.cos(1.1) * 60 * (1 - a);
            return <circle key={i} cx={x} cy={y} r={7} opacity={1 - a} />;
          })}
        </g>
      </Layer>
      <Layer depth={0}>
        <g opacity={1 - e}>
          <YouAreHere x={960 + (pin.x - cam.x) * cam.zoom} y={540 + (pin.y - cam.y) * cam.zoom - 4} size={30} label="Kola" font={IF.label} side="left" />
        </g>
        {/* end card wordmark, left half only */}
        <g opacity={wm} transform={`translate(0 ${(1 - wm) * 20})`}>
          <rect x={160} y={790} width={14} height={150} fill={P.graphiteLift} stroke={P.chalk} strokeWidth={1.5} />
          <rect x={160} y={790} width={14} height={150 * ramp(f, ec + 30, ec + 90)} fill={P.vermilion} />
          {[0, 1].map((i) => (
            <path key={i} d={`M154 ${948 + i * 14} L167 ${960 + i * 14} L180 ${948 + i * 14} L180 ${953 + i * 14} L167 ${965 + i * 14} L154 ${953 + i * 14} Z`} fill={P.vermilion} opacity={ramp(f, ec + 90, ec + 100)} />
          ))}
          <text x={210} y={880} style={labelStyle(96, P.chalk, 5)}>
            Off the Scale
          </text>
          <rect x={212} y={904} width={520 * ramp(f, ec + 30, ec + 70)} height={5} fill={P.chalk} />
        </g>
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

const shotsC = (k: KC): ShotDef<KC>[] => [
  { from: 0, C: ShotMantle },
  { from: k.shrink, C: ShotBall },
  { from: k.deepest, C: ShotMm },
  { from: k.simpler, C: ShotHonest180 },
  { from: k.why, C: ShotBalance },
  { from: k.atlantic, C: ShotAsWas },
  { from: k.goal, C: ShotGoal },
  { from: k.cap, C: ShotCapAgain },
  { from: k.globe, C: ShotPlanet },
];

export const SceneCloser: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const k = closerCues(t);
  return playShots(f, shotsC(k), k, k.end);
};

export const soundCloser = (t: SceneTiming): Cue[] => {
  const k = closerCues(t);
  const W = "mixkit-1489-whoosh-air.mp3";
  const WD = "mixkit-2604-whoosh-deep-air.mp3";
  const TICK = "mixkit-2568-ui-click-tone.mp3";
  const POP = "mixkit-2356-ui-pop-dry.mp3";
  const POPL = "mixkit-2358-ui-pop-long.mp3";
  const CHIME = "mixkit-3108-chime-crystal.mp3";
  return [
    { at: 0, file: "mixkit-1493-whoosh-swirl.mp3", vol: 0.26, dur: 50 },
    { at: 4, file: "mixkit-2297-rumble-bass-hum.mp3", vol: 0.24, dur: k.shrink - 4, fadeIn: 20, fadeOut: 20 },
    { at: k.mantle, file: TICK, vol: 0.26, dur: 20 },
    { at: k.core, file: POP, vol: 0.22, dur: 20 },
    { at: k.shrink - 2, file: WD, vol: 0.28, dur: 60 },
    { at: k.shrink + 20, file: POPL, vol: 0.22, dur: 24 },
    { at: k.deepest - 2, file: W, vol: 0.22, dur: 50 },
    { at: k.mm, file: CHIME, vol: 0.22, dur: 60 },
    { at: k.simpler - 4, file: WD, vol: 0.22, dur: 60 },
    { at: k.c180, file: POP, vol: 0.2, dur: 20 },
    { at: k.logs, file: TICK, vol: 0.18, dur: 20 },
    { at: k.why - 2, file: W, vol: 0.2, dur: 50 },
    { at: k.atlantic - 2, file: W, vol: 0.2, dur: 50 },
    { at: k.asWas, file: POP, vol: 0.2, dur: 20 },
    { at: k.goal - 2, file: W, vol: 0.2, dur: 50 },
    { at: k.cap - 4, file: WD, vol: 0.24, dur: 60 },
    { at: k.cap, file: "mixkit-2658-wind-ambience.mp3", vol: 0.16, dur: k.globe - k.cap + 20, fadeIn: 20, fadeOut: 20 },
    { at: k.twelve, file: "mixkit-2297-rumble-bass-hum.mp3", vol: 0.2, dur: 80, fadeIn: 10, fadeOut: 30 },
    { at: k.globe - 2, file: "mixkit-1493-whoosh-swirl.mp3", vol: 0.26, dur: 50 },
    { at: k.globe + 40, file: CHIME, vol: 0.18, dur: 60 },
    { at: k.endCard + 20, file: "mixkit-788-boom-cinematic-impact.mp3", vol: 0.22, dur: 120, fadeOut: 60 },
    { at: k.endCard + 30, file: CHIME, vol: 0.16, dur: 60 },
  ];
};
