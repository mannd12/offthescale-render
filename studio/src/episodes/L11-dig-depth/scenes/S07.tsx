// L11 scene l07 "The stop": bespoke shots keyed to the narration (episodes/L11-dig-depth/script.md §7).
// Every number drawn is a row in episodes/L11-dig-depth/sources.md:
//   1984 and 12,066 m, ~200 m deeper by 1992 (#34) · 12,262 m (#2) · plan 15 km (#4) · 266 °C projected at 15 km (#21) ·
//   180 °C at the bottom (#15) · stopped 1992, shut three years later = 1995 (#22) · the "well to hell" story is a hoax (#33).
// Graphite for the gauge shots, bone for the surface; light from the upper left (lit left, shade right).
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { SceneTiming } from "../../../lib/timeline";
import {
  BONE,
  CornerTicks,
  Conifer,
  GRAPHITE,
  Gauge,
  Hatch,
  IF,
  Layer,
  P,
  PAIRS,
  Puffs,
  ReferenceFigure,
  ShadedRidge,
  Stage,
  cameraAt,
  crawl,
  decadeZoom,
  fall,
  fmt,
  labelStyle,
  lit,
  loadIllustratedFonts,
  mixHex,
  numStyle,
  ptsToPath,
  ramp,
  rnd,
  shade,
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
const M1984 = 12066; // #34
const KOLA_M = 12262; // #2
const PLAN_M = 15000; // #4

const lerp = (f: number, a: number, b: number, from: number, to: number, ease = Easing.inOut(Easing.cubic)) =>
  interpolate(f, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

const cues07 = (t: SceneTiming) => {
  const at = (i: number) => t.lines[i].at;
  const p = (i: number, s: string, o = 0) => phraseAt(t, i, s, o);
  return {
    eight: p(0, "Eight years"),
    record: p(0, "at twelve thousand"),
    plan: p(0, "The plan"),
    proj: at(1) - 6,
    stopped: at(2) - 6,
    notOnly: p(2, "And it wasn't"),
    soviet: p(2, "After the Soviet"),
    shut: p(2, "and three years"),
    left: at(3) - 6,
    story: p(3, "and a famous story"),
    hoax: p(3, "That one is a hoax"),
    end: t.frames,
  };
};
type Cues = ReturnType<typeof cues07>;
type ShotProps = { f: number; F: number; c: Cues; len: number };

// ---------------------------------------------------------------------------------------------
// The record board: a depth gauge and, on the same scale, the hole beside it (rock bands step warmer with depth)
const GX = 640;
const GY = 150;
const GH = 780;
const HXL = 1020;
const HXR = 1068;

const RecordSet: React.FC<{ f: number; v: number; max: number; readout: string | null; plan: number; heatK: number }> = ({ f, v, max, readout, plan, heatK }) => {
  const pos = (m: number) => GY + (m / max) * GH;
  const bands = Array.from({ length: 9 }, (_, i) => strataLine(820, 1460, GY + (i * GH) / 8, 8, i * 1.7 + 2, 60));
  return (
    <g>
      <Hatch id="c7-r" color={mixHex(P.chalk, ROCK, 0.84)} gap={18} angle={28} width={1.3} />
      {/* rock column to the right of the gauge, same vertical scale */}
      <rect x={820} y={GY - 30} width={640} height={30} fill={tint(E.a, P.bone, 0.35)} />
      {bands.slice(0, 8).map((b, i) => (
        <path key={i} d={stratumPath(b, bands[i + 1])} fill={heat(0.1 + i * 0.08)} />
      ))}
      <rect x={820} y={GY} width={640} height={GH} fill="url(#c7-r)" />
      <rect x={820} y={GY - 30} width={640} height={GH + 30} fill="none" stroke={P.chalk} strokeWidth={1.5} />
      {/* the hole down to the current depth */}
      <rect x={HXL} y={GY} width={HXR - HXL} height={pos(v) - GY} fill={P.graphite} />
      <rect x={HXR - 10} y={GY} width={10} height={pos(v) - GY} fill={shade(E.a, 0.4)} />
      {/* the planned rest of the hole, empty, dashed */}
      <g opacity={plan}>
        <path
          d={`M${HXL} ${pos(v)} L${HXL} ${pos(PLAN_M)} L${HXR} ${pos(PLAN_M)} L${HXR} ${pos(v)}`}
          fill="none"
          stroke={P.chalk}
          strokeWidth={3}
          strokeDasharray="12 9"
          strokeDashoffset={crawl(f, 0.8)}
        />
        <line x1={HXL - 60} y1={pos(PLAN_M)} x2={HXR + 60} y2={pos(PLAN_M)} stroke={P.chalk} strokeWidth={3} />
      </g>
      {/* heat in the deep: the rock shimmers amber */}
      {fall(f, 22, 640, GH, 9, -0.8, 6).map((s, i) => (
        <rect key={i} x={820 + s.x} y={GY + s.y} width={s.r * 1.4} height={s.r * 1.4} fill={E.b} opacity={0.15 + 0.3 * heatK * ((GY + s.y - GY) / GH)} />
      ))}
      <Gauge
        x={GX}
        y={GY}
        height={GH}
        value={v}
        max={max}
        unit="m"
        theme={GRAPHITE}
        title="DEPTH"
        format={(x) => fmt(x / 1000) + " km"}
        readout={readout !== null}
        readoutText={readout ?? ""}
        marks={plan > 0.5 ? [{ v: PLAN_M, label: "PLAN" }] : []}
        plate={170}
        unitCap={false}
      />
    </g>
  );
};

const YearChip: React.FC<{ year: number; x?: number; y?: number; k?: number; theme?: "dark" | "light" }> = ({ year, x = 1560, y = 170, k = 1, theme = "dark" }) => {
  const fg = theme === "dark" ? P.chalk : P.ink;
  const bg = theme === "dark" ? P.graphiteLift : lit(P.boneDeep, 0.3);
  return (
    <g opacity={k} transform={`translate(${x} ${y})`}>
      <rect x={10} y={10} width={230} height={110} fill={theme === "dark" ? P.graphite : shade(P.boneDeep, 0.12)} />
      <rect x={0} y={0} width={230} height={110} fill={bg} stroke={fg} strokeWidth={2} />
      <rect x={0} y={0} width={230} height={22} fill={fg} opacity={0.85} />
      {[40, 190].map((cx) => (
        <circle key={cx} cx={cx} cy={11} r={5} fill={bg} />
      ))}
      <text x={115} y={92} textAnchor="middle" style={numStyle(60, fg)}>
        {year}
      </text>
    </g>
  );
};

// Shot 1 - "by 1984, the hole was already past twelve kilometres"
const Shot1984: React.FC<ShotProps> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: len + 20, x: 930, y: 560, zoom: 1.06 },
  ]);
  return (
    <Stage theme={GRAPHITE} cam={cam} vignette={0.3}>
      <Layer depth={1}>
        <RecordSet f={f} v={lerp(f, 0, 40, 11000, M1984, Easing.out(Easing.cubic))} max={13000} readout={`${fmt(M1984)} m`} plan={0} heatK={0.4} />
      </Layer>
      <Layer depth={0}>
        <YearChip year={1984} k={ramp(f, 4, 14)} />
        <g opacity={ramp(f, 0, 12)}>
          <text x={96} y={140} style={labelStyle(30, P.chalkSoft, 5)}>
            7
          </text>
          <text x={136} y={140} style={labelStyle(30, P.chalk, 5)}>
            The stop
          </text>
        </g>
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// Shot 2 - "eight years later ... only about two hundred metres deeper": years tick by; a magnifier on the bottom shows
// the ~200 m the hole gained in all that time
const ShotEight: React.FC<ShotProps> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 1040, y: 760, zoom: 1.25 },
    { f: len + 20, x: 1120, y: 780, zoom: 1.32 },
  ]);
  const yrs = Math.min(8, Math.floor(lerp(f, 6, len * 0.8, 0, 8.99, Easing.linear)));
  const grow = lerp(f, len * 0.72, len * 0.9, 0, 1);
  const v = M1984 + (KOLA_M - M1984) * grow;
  // magnifier: a local ruler 12,000-12,300 m
  const mx = 1330;
  const my = 760;
  const mr = 230;
  const mpos = (m: number) => my - 170 + ((m - 12000) / 300) * 340;
  return (
    <Stage theme={GRAPHITE} cam={cam} vignette={0.3}>
      <Layer depth={1}>
        <RecordSet f={f} v={v} max={13000} readout={null} plan={0} heatK={0.4} />
        {/* leader from the hole bottom to the magnifier */}
        <line x1={HXR + 6} y1={GY + (M1984 / 13000) * GH} x2={mx - mr} y2={my} stroke={P.chalk} strokeWidth={2} strokeDasharray="6 6" />
        <circle cx={mx} cy={my} r={mr} fill={P.graphite} stroke={P.chalk} strokeWidth={3} />
        <defs>
          <clipPath id="c7-mag">
            <circle cx={mx} cy={my} r={mr - 3} />
          </clipPath>
        </defs>
        <g clipPath="url(#c7-mag)">
          <rect x={mx - mr} y={my - mr} width={mr * 2} height={mr * 2} fill={heat(0.62)} />
          <rect x={mx - mr} y={my - mr} width={mr * 2} height={mr * 2} fill="url(#c7-r)" />
          <rect x={mx - 30} y={my - mr} width={60} height={mpos(v) - (my - mr)} fill={P.graphite} />
          {[12000, 12100, 12200, 12300].map((m) => (
            <g key={m}>
              <line x1={mx + 36} y1={mpos(m)} x2={mx + 56} y2={mpos(m)} stroke={P.chalk} strokeWidth={2} />
              <text x={mx + 62} y={mpos(m) + 8} textAnchor="start" style={{ fontFamily: IF.num, fontWeight: 500, fontSize: 22, fill: P.chalkSoft }}>
                {fmt(m)}
              </text>
            </g>
          ))}
          <g opacity={grow > 0.98 ? 1 : 0} stroke={E.b} strokeWidth={4}>
            <line x1={mx - 40} y1={mpos(M1984)} x2={mx - 70} y2={mpos(M1984)} />
            <line x1={mx - 70} y1={mpos(M1984)} x2={mx - 70} y2={mpos(KOLA_M)} />
            <line x1={mx - 40} y1={mpos(KOLA_M)} x2={mx - 70} y2={mpos(KOLA_M)} />
          </g>
        </g>
        <g opacity={ramp(f, len * 0.88, len * 0.98)}>
          <rect x={mx - 120} y={my - mr - 84} width={240} height={64} fill={P.graphite} stroke={E.b} strokeWidth={2} />
          <text x={mx} y={my - mr - 38} textAnchor="middle" style={numStyle(40, E.b)}>
            ~200 m
          </text>
        </g>
      </Layer>
      <Layer depth={0}>
        {/* the calendar strip: eight years tick by */}
        <g transform="translate(300 960)">
          {Array.from({ length: 9 }, (_, i) => (
            <g key={i}>
              <rect x={i * 150} y={0} width={130} height={18} fill={i <= yrs ? E.b : P.graphiteLift} stroke={P.chalk} strokeWidth={1.5} />
              <text x={i * 150 + 65} y={56} textAnchor="middle" style={{ fontFamily: IF.num, fontWeight: 700, fontSize: 26, fill: i <= yrs ? P.chalk : P.chalkSoft }}>
                {1984 + i}
              </text>
            </g>
          ))}
        </g>
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// Shot 3 - "at twelve thousand two hundred and sixty-two": the record readout lands and holds
const ShotRecord: React.FC<ShotProps> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 860, y: 860, zoom: 1.7 },
    { f: len + 20, x: 840, y: 840, zoom: 1.58 },
  ]);
  const slam = ramp(f, 0, 6);
  return (
    <Stage theme={GRAPHITE} cam={{ ...cam, y: cam.y + (1 - slam) * 10 }} vignette={0.3}>
      <Layer depth={1}>
        <RecordSet f={f} v={KOLA_M} max={13000} readout={`${fmt(KOLA_M)} m`} plan={0} heatK={0.5} />
      </Layer>
      <Layer depth={0}>
        <YearChip year={1992} x={1500} y={160} />
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// Shot 4 - "the plan had been fifteen": the ruler zooms out to 16 km; the planned hole below the bottom stays empty
const ShotPlan: React.FC<ShotProps> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 600, zoom: 1.12 },
    { f: len + 20, x: 960, y: 620, zoom: 1.04 },
  ]);
  const max = decadeZoom(13000, 16000, ramp(f, 0, 22));
  return (
    <Stage theme={GRAPHITE} cam={cam} vignette={0.3}>
      <Layer depth={1}>
        <RecordSet f={f} v={KOLA_M} max={max} readout={`${fmt(KOLA_M)} m`} plan={ramp(f, 14, 26)} heatK={0.5} />
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// Shot 5 - "at fifteen, the team's own straight-line projection put the rock at about 266 °C"
const ShotProj: React.FC<ShotProps> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 1120, y: 560, zoom: 1.1 },
    { f: len + 20, x: 1150, y: 545, zoom: 1.05 },
  ]);
  const pos15 = GY + (PLAN_M / 16000) * GH;
  const hx = 1600;
  const hy = 150;
  const hh = 780;
  const hpos = (v: number) => hy + hh - (v / 300) * hh;
  const k = ramp(f, 8, 24);
  return (
    <Stage theme={GRAPHITE} cam={cam} vignette={0.3}>
      <Layer depth={1}>
        <RecordSet f={f} v={KOLA_M} max={16000} readout={null} plan={1} heatK={0.7} />
        {/* the projection: an outlined readout at the empty target */}
        <g opacity={k}>
          <line x1={HXR + 70} y1={pos15} x2={HXR + 110} y2={pos15} stroke={P.chalk} strokeWidth={2} />
          <rect x={HXR + 112} y={pos15 - 46} width={300} height={124} fill={P.graphite} opacity={0.92} />
          <text x={HXR + 124} y={pos15 + 22} style={{ ...numStyle(64, "none"), stroke: E.b, strokeWidth: 3 }}>
            266 °C?
          </text>
          <text x={HXR + 126} y={pos15 + 62} style={labelStyle(26, P.chalkSoft, 3)}>
            Projected
          </text>
        </g>
        {/* heat gauge: solid to 180 (measured), dashed outline on to 266 (projected) */}
        <g opacity={ramp(f, 0, 12)}>
          <Gauge x={hx} y={hy} height={hh} value={180} max={300} unit="°C" direction="up" theme={GRAPHITE} title="ROCK" readoutText="180 °C" plate={90} unitCap={false} />
          <rect
            x={hx}
            y={hpos(180) - (hpos(180) - hpos(266)) * k}
            width={14}
            height={(hpos(180) - hpos(266)) * k}
            fill="none"
            stroke={E.b}
            strokeWidth={3}
            strokeDasharray="8 6"
          />
        </g>
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// The surface: the drill tower and hall; panels go dark, the money runs out, the buildings go, the cap stays
const G = 780;
const TX = 1060;
const sky = mixHex(P.bone, E.a, 0.18);
const tundra = mixHex(tint(E.b, P.bone, 0.55), E.a, 0.2);
const wallC = tint(E.a, P.bone, 0.32);

const Surface: React.FC<{ F: number; f: number; tower: number; dark: number; spin: number; coins: number; snow?: number }> = ({ F, f, tower, dark, spin, coins, snow = 0.6 }) => {
  const flakes = fall(F, Math.round(60 * snow), 2600, 1200, 3, 1, 14);
  const towerTop = G - 560;
  const win = (i: number) => {
    const off = i < Math.floor(dark * 12 + 1e-6);
    return off ? shade(wallC, 0.5) : tint(E.b, P.bone, 0.25);
  };
  return (
    <>
      <Layer depth={0.08}>
        <rect x={-800} y={-800} width={3600} height={800 + G - 260} fill={sky} />
        <rect x={-800} y={G - 260} width={3600} height={200} fill={mixHex(P.bone, E.a, 0.09)} />
        <circle cx={420} cy={G - 420} r={86} fill={tint(E.b, P.bone, 0.75)} />
        <circle cx={420} cy={G - 420} r={54} fill={tint(E.b, P.bone, 0.42)} />
      </Layer>
      <Layer depth={0.35}>
        <ShadedRidge
          pts={Array.from({ length: 24 }, (_, i) => [-600 + i * 150, G - 60 - 90 * Math.abs(Math.sin(i * 1.1 + 2)) - rnd(i + 40) * 30] as [number, number])}
          base={G + 20}
          fill={tint(E.a, P.bone, 0.62)}
          shadow={tint(E.a, P.bone, 0.5)}
        />
      </Layer>
      <Layer depth={1}>
        <rect x={-800} y={G} width={3600} height={800} fill={tundra} />
        <rect x={-800} y={G + 110} width={3600} height={800} fill={mixHex(tundra, E.b, 0.12)} />
        {[[-200, G + 50, 340], [380, G + 160, 300], [1400, G + 70, 360], [1720, G + 210, 300]].map(([x, y, w], i) => (
          <path key={i} d={ptsToPath([[x, y], [x + w * 0.25, y - 12], [x + w, y - 6], [x + w * 0.85, y + 10], [x + w * 0.1, y + 11]]) + " Z"} fill="#F8F4EA" />
        ))}
        {/* the buildings: they lift and fade when the facility is shut */}
        <g opacity={tower} transform={`translate(0 ${(1 - tower) * -40})`}>
          {/* hall */}
          <path d={ptsToPath([[TX - 520, G], [TX - 520, G - 150], [TX - 60, G - 190], [TX - 60, G]]) + " Z"} fill={lit(wallC, 0.12)} />
          {/* tower: enclosed, lit left face, shaded right face */}
          <path d={ptsToPath([[TX - 70, G], [TX - 50, towerTop], [TX + 50, towerTop], [TX + 70, G]]) + " Z"} fill={lit(wallC, 0.1)} />
          <path d={ptsToPath([[TX + 10, G], [TX + 10, towerTop], [TX + 50, towerTop], [TX + 70, G]]) + " Z"} fill={shade(wallC, 0.28)} />
          <path d={ptsToPath([[TX + 70, G], [TX + 50, towerTop], [TX + 110, towerTop + 30], [TX + 140, G]]) + " Z"} fill={shade(wallC, 0.4)} />
          {/* crown wheel at the top: turns while drilling */}
          <g transform={`translate(${TX} ${towerTop - 40}) rotate(${spin})`}>
            <circle r={34} fill={shade(wallC, 0.2)} />
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={-4} y={-34} width={8} height={68} fill={lit(wallC, 0.3)} transform={`rotate(${i * 45})`} />
            ))}
          </g>
          <rect x={TX - 54} y={towerTop - 8} width={108} height={10} fill={shade(wallC, 0.3)} />
          {/* window panels: 12, lit warm, going dark one by one */}
          {Array.from({ length: 12 }, (_, i) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            return <rect key={i} x={TX - 40 + col * 44} y={towerTop + 40 + row * 70} width={34} height={40} fill={win(i)} />;
          })}
          {Array.from({ length: 4 }, (_, i) => (
            <rect key={`h${i}`} x={TX - 480 + i * 104} y={G - 120 + i * -8} width={56} height={36} fill={win(11 - i)} />
          ))}
          {tower > 0.95 && dark < 0.5 ? <Puffs frame={F} x={TX - 300} y={G - 175} color={tint(P.ink, P.bone, 0.78)} period={20} size={14} rise={1.2} drift={1.1} life={50} seed={6} /> : null}
          {/* the money: a stack of coins by the hall, taken away one by one */}
          {Array.from({ length: 8 }, (_, i) => {
            const gone = i >= Math.ceil(coins * 8 - 1e-6);
            if (gone) return null;
            return (
              <g key={i}>
                <ellipse cx={TX + 260} cy={G - 10 - i * 16} rx={46} ry={12} fill={shade(E.b, 0.2)} />
                <rect x={TX + 214} y={G - 22 - i * 16} width={92} height={12} fill={E.b} />
                <ellipse cx={TX + 260} cy={G - 22 - i * 16} rx={46} ry={12} fill={lit(E.b, 0.25)} />
              </g>
            );
          })}
        </g>
        {/* the cap: always there */}
        <ellipse cx={TX + 12} cy={G + 4} rx={30} ry={8} fill={shade(tundra, 0.25)} />
        <path d={`M${TX - 20} ${G - 8} L${TX - 20} ${G} A20 6 0 0 0 ${TX + 20} ${G} L${TX + 20} ${G - 8} Z`} fill={shade(tint(E.a, P.bone, 0.2), 0.3)} />
        <ellipse cx={TX} cy={G - 8} rx={20} ry={6} fill={tint(E.a, P.bone, 0.2)} />
        {[-760, -650, -560, 1700, 1800, 1930, 2050].map((x, i) => (
          <Conifer key={x} x={TX + x * 0.6} y={G + 6} h={90 + (i % 3) * 34} litColor={tint(E.a, P.ink, 0.1)} shadeColor={tint(E.a, P.ink, 0.42)} sway={Math.sin(F / 40 + i) * 1.5} />
        ))}
        {flakes.map((s, i) => (
          <circle key={i} cx={s.x - 340} cy={s.y - 200} r={s.r} fill="#F8F4EA" opacity={0.85} />
        ))}
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.ink} />
      </Layer>
    </>
  );
};

// Shot 6 - "drilling stopped in 1992": the tower at work, the crown wheel turning, then it stops
const ShotStopped: React.FC<ShotProps> = ({ f, F, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 980, y: 520, zoom: 1.0 },
    { f: len + 20, x: 1020, y: 500, zoom: 1.1 },
  ]);
  const stop = 22;
  const spin = f < stop ? f * 9 : stop * 9 + (1 - Math.exp(-(f - stop) / 6)) * 30;
  return (
    <Stage theme={BONE} cam={cam}>
      <Surface F={F} f={f} tower={1} dark={0} spin={spin} coins={1} />
      <Layer depth={0}>
        <YearChip year={1992} x={1540} y={150} theme="light" k={ramp(f, 2, 12)} />
      </Layer>
    </Stage>
  );
};

// Shot 7 - "and it wasn't only the heat": low by the figure; a heat tag, and a second, still-empty slot beside it
const ShotNotOnly: React.FC<ShotProps> = ({ f, F, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 760, y: 640, zoom: 1.5 },
    { f: len + 20, x: 800, y: 620, zoom: 1.42 },
  ]);
  return (
    <Stage theme={BONE} cam={cam}>
      <Surface F={F} f={f} tower={1} dark={0} spin={300} coins={1} />
      <Layer depth={1}>
        <ReferenceFigure x={720} y={G} pxPerM={110} breath={F} look={0.5} />
        <Puffs frame={F} x={730} y={G - 168} color="#F8F4EA" period={60} size={6} rise={0.5} drift={0.5} life={44} seed={2} />
      </Layer>
      <Layer depth={0}>
        <g transform="translate(520 210)" opacity={ramp(f, 2, 12)}>
          <rect x={0} y={0} width={180} height={180} fill={lit(P.boneDeep, 0.3)} stroke={P.ink} strokeWidth={2} />
          <rect x={78} y={30} width={24} height={100} fill={lit(P.boneDeep, 0.5)} stroke={P.ink} strokeWidth={2} />
          <circle cx={90} cy={136} r={22} fill={E.b} stroke={P.ink} strokeWidth={2} />
          <rect x={84} y={60} width={12} height={80} fill={E.b} />
        </g>
        <text x={762} y={322} textAnchor="middle" style={labelStyle(64, P.ink, 2)} opacity={ramp(f, 14, 22)}>
          +
        </text>
        <rect
          x={830}
          y={210}
          width={180}
          height={180}
          fill="none"
          stroke={P.ink}
          strokeWidth={3}
          strokeDasharray="12 9"
          strokeDashoffset={crawl(f, 0.8)}
          opacity={ramp(f, 18, 28)}
        />
        <text x={920} y={326} textAnchor="middle" style={labelStyle(80, P.inkSoft, 2)} opacity={ramp(f, 22, 32)}>
          ?
        </text>
      </Layer>
    </Stage>
  );
};

// Shot 8 - "after the Soviet Union collapsed, there was no money": coins leave the stack, the windows go dark
const ShotMoney: React.FC<ShotProps> = ({ f, F, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 1180, y: 560, zoom: 1.3 },
    { f: len + 20, x: 1120, y: 540, zoom: 1.12 },
  ]);
  const coins = lerp(f, 10, len * 0.75, 1, 0, Easing.linear);
  return (
    <Stage theme={BONE} cam={cam}>
      <Surface F={F} f={f} tower={1} dark={lerp(f, len * 0.3, len, 0, 1, Easing.linear)} spin={300} coins={coins} />
      <Layer depth={0}>
        <YearChip year={1992} x={1540} y={150} theme="light" />
      </Layer>
    </Stage>
  );
};

// Shot 9 - "three years later the whole facility was shut": the calendar flips to 1995, the buildings lift away
const ShotShut: React.FC<ShotProps> = ({ f, F, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 1060, y: 520, zoom: 1.05 },
    { f: len + 20, x: 1060, y: 600, zoom: 1.22 },
  ]);
  const flip = Math.min(3, Math.floor(lerp(f, 2, 26, 0, 3.99, Easing.linear)));
  return (
    <Stage theme={BONE} cam={cam}>
      <Surface F={F} f={f} tower={lerp(f, 30, len - 6, 1, 0)} dark={1} spin={300} coins={0} />
      <Layer depth={0}>
        <YearChip year={1992 + flip} x={1540} y={150} theme="light" />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// The cap alone; the story pops up out of it and goes flat
const CapClose: React.FC<{ F: number }> = ({ F }) => {
  const GG = 720;
  const cx = 1000;
  const metal = tint(E.a, P.bone, 0.2);
  const flakes = fall(F, 70, 2400, 1200, 11, 1.1, 16);
  return (
    <>
      <Layer depth={0.1}>
        <rect x={-800} y={-800} width={3600} height={800 + GG - 220} fill={mixHex(P.bone, E.a, 0.16)} />
        <rect x={-800} y={GG - 220} width={3600} height={200} fill={mixHex(P.bone, E.a, 0.08)} />
      </Layer>
      <Layer depth={0.4}>
        <ShadedRidge
          pts={Array.from({ length: 24 }, (_, i) => [-600 + i * 150, GG - 40 - 60 * Math.abs(Math.sin(i * 0.9 + 1)) - rnd(i + 70) * 30] as [number, number])}
          base={GG + 20}
          fill={tint(E.a, P.bone, 0.6)}
          shadow={tint(E.a, P.bone, 0.48)}
        />
      </Layer>
      <Layer depth={1}>
        <rect x={-800} y={GG} width={3600} height={900} fill={tundra} />
        <path d={ptsToPath([[-600, GG + 160], [600, GG + 120], [1500, GG + 170], [2600, GG + 140], [2600, GG + 900], [-600, GG + 900]]) + " Z"} fill={mixHex(tundra, E.b, 0.12)} />
        {/* snow drift around the cap */}
        <path d={ptsToPath([[cx - 380, GG + 40], [cx - 200, GG - 4], [cx + 260, GG + 6], [cx + 420, GG + 46]]) + " Z"} fill="#F8F4EA" />
        <path d={ptsToPath([[cx - 380, GG + 40], [cx + 420, GG + 46], [cx + 380, GG + 56], [cx - 340, GG + 52]]) + " Z"} fill={mixHex("#F8F4EA", E.a, 0.2)} />
        {/* the cap, larger: a short two-tone cylinder with bolts and a rust streak */}
        <ellipse cx={cx + 40} cy={GG + 14} rx={150} ry={30} fill={shade(tundra, 0.25)} />
        <path d={`M${cx - 115} ${GG - 34} L${cx - 115} ${GG + 4} A115 30 0 0 0 ${cx + 115} ${GG + 4} L${cx + 115} ${GG - 34} Z`} fill={shade(metal, 0.3)} />
        <path d={`M${cx - 115} ${GG - 34} L${cx - 115} ${GG + 4} A115 30 0 0 0 ${cx - 20} ${GG + 33} L${cx - 20} ${GG - 4} Z`} fill={metal} />
        <ellipse cx={cx} cy={GG - 34} rx={115} ry={30} fill={lit(metal, 0.2)} />
        <ellipse cx={cx} cy={GG - 34} rx={80} ry={20} fill="none" stroke={shade(metal, 0.2)} strokeWidth={3} />
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return <circle key={i} cx={cx + Math.cos(a) * 98} cy={GG - 34 + Math.sin(a) * 25} r={6} fill={shade(metal, 0.35)} />;
        })}
        <path d={`M${cx + 60} ${GG - 8} L${cx + 66} ${GG + 22} L${cx + 74} ${GG + 20} L${cx + 70} ${GG - 8} Z`} fill={mixHex(E.b, E.a, 0.45)} />
        {flakes.map((s, i) => (
          <circle key={i} cx={s.x - 240} cy={s.y - 160} r={s.r} fill="#F8F4EA" opacity={0.9} />
        ))}
      </Layer>
      <Layer depth={1.4}>
        {Array.from({ length: 10 }, (_, i) => {
          const x = 1640 + i * 30;
          const h = 70 + rnd(i + 5) * 80;
          const sw = Math.sin(F / 18 + i * 0.7) * 7;
          return <path key={i} d={`M${x - 9} 1100 L${x + sw} ${1100 - h} L${x + 9} 1100 Z`} fill={i % 2 ? mixHex(E.a, P.ink, 0.6) : mixHex(E.a, P.ink, 0.32)} />;
        })}
      </Layer>
    </>
  );
};

/** A straight-edged speech bubble with a tail to the cap. */
const Bubble: React.FC<{ F: number; s: number; sag: number; label: number }> = ({ F, s, sag, label }) => {
  const x = 1180;
  const y = 330 + sag * 120;
  const w = 460;
  const h = 200;
  const wob = Math.sin(F / 9) * 4 * (1 - sag);
  const pts: [number, number][] = [
    [-w / 2, -h / 2 + wob],
    [w / 2, -h / 2 - wob],
    [w / 2 + 10, h / 2 - sag * 60],
    [-40, h / 2 - sag * 30],
    [-130, h / 2 + 120 - sag * 40],
    [-110, h / 2 - sag * 30],
    [-w / 2 - 6, h / 2 - sag * 50],
  ];
  return (
    <g transform={`translate(${x} ${y}) scale(${s} ${s * (1 - sag * 0.6)})`}>
      <path d={ptsToPath(pts.map(([a, b]) => [a + 10, b + 12] as [number, number])) + " Z"} fill={shade(P.boneDeep, 0.15)} />
      <path d={ptsToPath(pts) + " Z"} fill={lit(P.boneDeep, 0.5)} stroke={P.ink} strokeWidth={3} strokeLinejoin="round" />
      <text x={0} y={30} textAnchor="middle" style={labelStyle(92, P.ink, 5)} opacity={label}>
        Screams?
      </text>
      {/* sound lines */}
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={ptsToPath(Array.from({ length: 6 }, (_, j) => [w / 2 + 40 + j * 14, -60 + i * 50 + (j % 2 ? -10 : 10)] as [number, number]))}
          fill="none"
          stroke={P.ink}
          strokeWidth={3}
          opacity={(1 - sag) * (0.5 + 0.5 * Math.sin(F / 5 + i))}
        />
      ))}
    </g>
  );
};

// Shot 10 - "what's left is that cap": the cap alone in the snow, the figure beside it
const ShotCap: React.FC<ShotProps> = ({ f, F, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 600, zoom: 1.2 },
    { f: len + 20, x: 920, y: 620, zoom: 1.3 },
  ]);
  return (
    <Stage theme={BONE} cam={cam}>
      <CapClose F={F} />
      <Layer depth={0}>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 11 - "a famous story about a well to hell, with screams coming up out of it": a bubble pops up out of the cap
const ShotStory: React.FC<ShotProps> = ({ f, F, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 1000, y: 560, zoom: 1.0 },
    { f: len + 20, x: 1060, y: 500, zoom: 1.12 },
  ]);
  const pop = interpolate(f, [10, 18, 24], [0, 1.08, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Stage theme={BONE} cam={cam}>
      <CapClose F={F} />
      <Layer depth={1}>
        <Bubble F={F} s={pop} sag={0} label={ramp(f, 22, 34)} />
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 12 - "that one is a hoax": the bubble goes flat and drops, a HOAX stamp lands
const ShotHoax: React.FC<ShotProps> = ({ f, F, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 1080, y: 520, zoom: 1.14 },
    { f: len + 20, x: 1000, y: 560, zoom: 1.0 },
  ]);
  const sag = lerp(f, 4, 26, 0, 1, Easing.in(Easing.quad));
  const stamp = ramp(f, 12, 18);
  const sc = 1 + 0.5 * (1 - stamp);
  return (
    <Stage theme={BONE} cam={cam}>
      <CapClose F={F} />
      <Layer depth={1}>
        <g opacity={1 - ramp(f, 24, 40)}>
          <Bubble F={F} s={1 - 0.3 * sag} sag={sag} label={1} />
        </g>
      </Layer>
      <Layer depth={0}>
        <g opacity={stamp} transform={`translate(1330 300) rotate(-8) scale(${sc})`}>
          <rect x={-200} y={-80} width={400} height={160} fill="none" stroke={P.ink} strokeWidth={10} />
          <rect x={-184} y={-64} width={368} height={128} fill="none" stroke={P.ink} strokeWidth={3} />
          <text x={0} y={42} textAnchor="middle" style={labelStyle(118, P.ink, 12)}>
            Hoax
          </text>
        </g>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
type Shot = { from: number; C: React.FC<ShotProps> };
const shots07 = (c: Cues): Shot[] => [
  { from: 0, C: Shot1984 },
  { from: c.eight, C: ShotEight },
  { from: c.record, C: ShotRecord },
  { from: c.plan, C: ShotPlan },
  { from: c.proj, C: ShotProj },
  { from: c.stopped, C: ShotStopped },
  { from: c.notOnly, C: ShotNotOnly },
  { from: c.soviet, C: ShotMoney },
  { from: c.shut, C: ShotShut },
  { from: c.left, C: ShotCap },
  { from: c.story, C: ShotStory },
  { from: c.hoax, C: ShotHoax },
];

export const SceneL07: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const F = useCurrentFrame();
  const c = cues07(t);
  const shots = shots07(c);
  let k = 0;
  for (let i = 0; i < shots.length; i++) if (F >= shots[i].from) k = i;
  const S = shots[k].C;
  const len = (k + 1 < shots.length ? shots[k + 1].from : c.end) - shots[k].from;
  return <S f={F - shots[k].from} F={F} c={c} len={len} />;
};

export const soundL07 = (t: SceneTiming): Cue[] => {
  const c = cues07(t);
  return [
    { at: 0, file: "mixkit-2297-rumble-bass-hum.mp3", vol: 0.26, dur: c.stopped, fadeIn: 20, fadeOut: 20 },
    { at: 6, file: "mixkit-2568-ui-click-tone.mp3", vol: 0.3, dur: 20 },
    { at: c.eight - 4, file: "mixkit-1489-whoosh-air.mp3", vol: 0.24, dur: 50 },
    ...Array.from({ length: 8 }, (_, i): Cue => ({ at: c.eight + 6 + Math.round(((c.record - c.eight) * 0.8 - 6) * ((i + 1) / 9)), file: "mixkit-2568-ui-click-tone.mp3", vol: 0.14, dur: 12 })),
    { at: c.record, file: "mixkit-788-boom-cinematic-impact.mp3", vol: 0.42, dur: 150, fadeOut: 40 },
    { at: c.plan, file: "mixkit-2604-whoosh-deep-air.mp3", vol: 0.28, dur: 60 },
    { at: c.plan + 20, file: "mixkit-2356-ui-pop-dry.mp3", vol: 0.24, dur: 20 },
    { at: c.proj - 2, file: "mixkit-1493-whoosh-swirl.mp3", vol: 0.24, dur: 50 },
    { at: c.proj + 12, file: "mixkit-3108-chime-crystal.mp3", vol: 0.16, dur: 60 },
    { at: c.stopped - 4, file: "mixkit-1489-whoosh-air.mp3", vol: 0.26, dur: 50 },
    { at: c.stopped, file: "mixkit-855-drill-electric.mp3", vol: 0.14, dur: 26, fadeOut: 6 },
    { at: c.stopped, file: "mixkit-2658-wind-ambience.mp3", vol: 0.16, dur: c.end - c.stopped, fadeIn: 20, fadeOut: 30 },
    { at: c.stopped + 22, file: "mixkit-2356-ui-pop-dry.mp3", vol: 0.26, dur: 20 },
    { at: c.notOnly - 2, file: "mixkit-1489-whoosh-air.mp3", vol: 0.22, dur: 50 },
    { at: c.notOnly + 18, file: "mixkit-2568-ui-click-tone.mp3", vol: 0.26, dur: 20 },
    { at: c.soviet - 2, file: "mixkit-2604-whoosh-deep-air.mp3", vol: 0.24, dur: 60 },
    ...Array.from({ length: 6 }, (_, i): Cue => ({ at: c.soviet + 30 + i * Math.round((c.shut - c.soviet - 40) / 6), file: "mixkit-2568-ui-click-tone.mp3", vol: 0.12, dur: 12 })),
    { at: c.shut + 2, file: "mixkit-2356-ui-pop-dry.mp3", vol: 0.22, dur: 20 },
    { at: c.shut + 30, file: "mixkit-1686-boom-underground-echo.mp3", vol: 0.28, dur: 90 },
    { at: c.left - 4, file: "mixkit-1493-whoosh-swirl.mp3", vol: 0.22, dur: 50 },
    { at: c.story + 10, file: "mixkit-2358-ui-pop-long.mp3", vol: 0.3, dur: 20 },
    { at: c.story + 14, file: "mixkit-645-riser-synth.mp3", vol: 0.12, trim: 5, dur: c.hoax - c.story - 10, fadeIn: 20, fadeOut: 6 },
    { at: c.hoax + 4, file: "mixkit-1489-whoosh-air.mp3", vol: 0.2, dur: 40 },
    { at: c.hoax + 14, file: "mixkit-788-boom-cinematic-impact.mp3", vol: 0.3, dur: 90, fadeOut: 30 },
  ];
};

