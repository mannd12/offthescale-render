// L11 scene l04 "The wrong map" (episodes/L11-dig-depth/script.md §4). Bespoke shots; episode-local props from S01.
// Numbers and labels drawn, each a row in episodes/L11-dig-depth/sources.md:
//   no basalt at ~7 km, gneiss instead (#6) · seismic boundary = changed properties, same rock (#7) · water, brine below
//   8 km, the level rose 80 m, doubted because crust 5 km down was thought too dense (#8). Temperature gauge: no value
//   is claimed here (axis only; the numbers come in l05).
import React from "react";
import { useCurrentFrame } from "remotion";
import { SceneTiming } from "../../../lib/timeline";
import { BONE, CornerTicks, GRAPHITE, Gauge, IF, Layer, P, ReferenceFigure, ScaleBar, Stage, bob, cameraAt, crawl, drift, labelStyle, lit, mixHex, numStyle, ptsToPath, ramp, rnd, shade, specks, tint } from "../../../lib/illustrated";
import { Cue } from "./cue-types";
import { Crystals, E, K, Land, LongSection, SEC, SecGauge, ShotDef, ShotFC, cueKit, heatTone, lerp, playShots, rockTone, secY } from "./S01";

const l04Cues = (t: SceneTiming) => {
  const { at, p } = cueKit(t);
  return {
    noBasalt: p(0, "no basalt"),
    gneiss: p(0, "The drill kept", -4),
    granite: p(0, "granite-like"),
    waves: at(1) - 6,
    notNew: p(1, "But it wasn't", -4),
    changed: p(1, "It was rock whose", -4),
    going: p(1, "That's the kind", -4),
    wet: at(2) - 6,
    porous: p(2, "Deep down", -4),
    flowing: p(2, "Water kept", -4),
    eight: p(2, "below eight"),
    zone: at(3) - 6,
    jumped: p(3, "jumped"),
    doubt: p(3, "Other scientists", -4),
    dense: at(4) - 6,
    five: p(4, "five kilometres"),
    surprise: at(5) - 6,
    next: p(5, "The next thing", -4),
    hotter: p(5, "It kept", -4),
    end: t.frames,
  };
};
type C4 = ReturnType<typeof l04Cues>;

// Shot 1 - "no basalt": the drill passes 7 km; the bold line breaks up and "Basalt?" is struck through (#6)
const ShotNoBasalt: ShotFC<C4> = ({ f, len, c }) => {
  const tip = lerp(f, 0, len, 6.9, 7.8);
  const cam = cameraAt(f, [
    { f: 0, x: 1200, y: secY(7), zoom: 2.3 },
    { f: len + 10, x: 1160, y: secY(7.3), zoom: 2.0 },
  ]);
  const st = ramp(f, c.noBasalt - 6, c.noBasalt + 16);
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={1}>
        <LongSection f={f} drill={tip} basalt={1} struck={st} />
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 2 - the core that came up: banded gneiss, macro; label "Gneiss" (#6)
const ShotGneiss: ShotFC<C4> = ({ f, len, c }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 520, zoom: 1.12 },
    { f: len + 10, x: 1020, y: 560, zoom: 1.0 },
  ]);
  const g0 = c.granite - c.gneiss;
  return (
    <Stage theme={BONE} cam={cam} vignette={0.22}>
      <Layer depth={1}>
        <Crystals x={-500} y={-400} w={2900} h={1900} cell={110} seed={61} f={f} bands />
      </Layer>
      <Layer depth={1.3}>
        {specks(f, 18, 2200, 1200, 17, 9).map((p, i) => (
          <circle key={i} cx={p.x - 100} cy={p.y - 60} r={p.r * 1.2} fill={tint(E.b, P.bone, 0.6)} opacity={0.55} />
        ))}
      </Layer>
      <Layer depth={0}>
        <g transform={`translate(0 ${bob(f, 4, 3, 80)})`} opacity={ramp(f, 4, 14)}>
          <rect x={110} y={110} width={360} height={110} fill={P.bone} stroke={P.ink} strokeWidth={2} />
          <text x={140} y={192} style={labelStyle(72, P.ink, 5)}>
            Gneiss
          </text>
        </g>
        <g opacity={ramp(f, g0 - 4, g0 + 8)}>
          <rect x={110} y={232} width={360} height={56} fill={P.bone} stroke={P.ink} strokeWidth={2} />
          <text x={140} y={273} style={labelStyle(34, P.inkSoft, 3)}>
            Granite-like
          </text>
        </g>
        <ScaleBar x={96} y={1000} px={150} label="1 CM" color={P.bone} font={IF.label} />
        <CornerTicks color={P.bone} />
      </Layer>
    </Stage>
  );
};

// Shot 3 - "the waves had been bouncing off something real": the ray still bounces at the same depth; the line is thin now
const ShotWaves: ShotFC<C4> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 420, zoom: 1.35 },
    { f: len + 10, x: 940, y: 470, zoom: 1.45 },
  ]);
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={1}>
        <LongSection f={f} drill={12} basalt={0.6} struck={0.6} ray={1} label={false} />
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

/** A drill core: a two-tone cylinder whose face shows the rock texture; `alter` recolours, `cracks` splits it. */
const Core: React.FC<{ x: number; y: number; w: number; h: number; f: number; seed: number; cracks?: number; alter?: number; id: string }> = ({ x, y, w, h, f, seed, cracks = 0, alter = 0, id }) => (
  <g>
    <rect x={x + 18} y={y + 22} width={w} height={h} fill={shade(P.boneDeep, 0.25)} />
    <clipPath id={id}>
      <rect x={x} y={y} width={w} height={h} />
    </clipPath>
    <g clipPath={`url(#${id})`}>
      <Crystals x={x - 20} y={y - 20} w={w + 40} h={h + 40} cell={60} seed={seed} f={f} bands cracks={cracks} alter={alter} />
      <rect x={x + w * 0.72} y={y} width={w * 0.28} height={h} fill={P.graphite} opacity={0.22} />
      <rect x={x} y={y} width={w * 0.12} height={h} fill={P.bone} opacity={0.18} />
    </g>
    <ellipse cx={x + w / 2} cy={y} rx={w / 2} ry={16} fill={lit(rockTone(0.3), 0.2)} />
    <rect x={x} y={y} width={w} height={h} fill="none" stroke={P.ink} strokeWidth={2} />
  </g>
);

// Shots 4-5 - two cores, from above and below the boundary: the same rock (=); then the lower one cracks and changes (#7)
const Cores: React.FC<{ f: number; len: number; c: C4; changed: boolean }> = ({ f, len, changed }) => {
  const cam = changed
    ? cameraAt(f, [
        { f: 0, x: 1180, y: 540, zoom: 1.35 },
        { f: len + 10, x: 1220, y: 560, zoom: 1.5 },
      ])
    : cameraAt(f, [
        { f: 0, x: 960, y: 560, zoom: 1.08 },
        { f: len + 10, x: 960, y: 540, zoom: 1.0 },
      ]);
  const k = changed ? ramp(f, 6, Math.min(len - 6, 60)) : 0;
  const eq = changed ? 1 - k : ramp(f, 8, 20);
  const fl = (s: number) => bob(f, s, 6, 90);
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={0.3}>
        <rect x={-600} y={820} width={3200} height={600} fill={P.boneDeep} />
        {specks(f, 20, 1920, 800, 63, 6).map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={tint(E.b, P.bone, 0.55)} opacity={0.5} />
        ))}
      </Layer>
      <Layer depth={1}>
        <g transform={`translate(0 ${fl(1)})`}>
          <Core x={520} y={260} w={240} h={520} f={f} seed={71} id="s04-coreA" />
          <text x={640} y={860} textAnchor="middle" style={labelStyle(40, P.ink, 3)}>
            Above
          </text>
        </g>
        <g transform={`translate(0 ${fl(2)})`}>
          <Core x={1160} y={260} w={240} h={520} f={f} seed={71} cracks={k} alter={k} id="s04-coreB" />
          <text x={1280} y={860} textAnchor="middle" style={labelStyle(40, P.ink, 3)}>
            Below
          </text>
        </g>
        <g opacity={eq} stroke={P.ink} strokeWidth={10}>
          <line x1={900} y1={500} x2={1020} y2={500} />
          <line x1={900} y1={540} x2={1020} y2={540} />
        </g>
        {changed ? (
          <g opacity={k}>
            <path d={`M900 520 L1020 520`} stroke={P.ink} strokeWidth={10} />
            <text x={1460} y={420} style={labelStyle(44, P.ink, 3)}>
              Same rock
            </text>
            <text x={1460} y={480} style={labelStyle(44, P.inkSoft, 3)}>
              Changed
            </text>
          </g>
        ) : null}
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};
const ShotSame: ShotFC<C4> = (p) => <Cores {...p} changed={false} />;
const ShotChanged: ShotFC<C4> = (p) => <Cores {...p} changed />;

// Shot 6 - "you only learn by going there": the figure at the core shed, trays of core stretching away
const ShotShed: ShotFC<C4> = ({ f, len }) => {
  const G = 860;
  const ppm = 150;
  const cam = cameraAt(f, [
    { f: 0, x: 860, y: 520, zoom: 1.12 },
    { f: len + 10, x: 1020, y: 560, zoom: 1.0 },
  ]);
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={0.2}>
        <rect x={-1000} y={-1000} width={4000} height={1000 + G} fill={lit(P.boneDeep, 0.15)} />
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x={-200 + i * 330} y={80} width={20} height={G - 80} fill={shade(P.boneDeep, 0.12)} />
        ))}
        <rect x={-1000} y={60} width={4000} height={30} fill={shade(P.boneDeep, 0.2)} />
      </Layer>
      <Layer depth={1}>
        <rect x={-1000} y={G} width={4000} height={600} fill={shade(P.boneDeep, 0.18)} />
        {/* racks of core trays: rows of short core sticks, two-tone */}
        {Array.from({ length: 4 }, (_, r) =>
          Array.from({ length: 3 }, (_, b) => {
            const bx = 820 + b * 400;
            const by = G - 120 - r * 150;
            return (
              <g key={`${r}-${b}`}>
                <rect x={bx} y={by} width={360} height={90} fill={lit(tint(E.b, P.bone, 0.45), 0.1)} />
                <rect x={bx} y={by + 70} width={360} height={20} fill={shade(tint(E.b, P.bone, 0.45), 0.3)} />
                {Array.from({ length: 4 }, (_, j) => (
                  <g key={j}>
                    {Array.from({ length: 5 }, (_, s) => {
                      const sx = bx + 12 + s * 70 + (rnd(r * 60 + b * 20 + j * 5 + s) - 0.5) * 6;
                      const w = 50 + rnd(r + b + j + s) * 14;
                      const col = rockTone(0.2 + rnd(r * 3 + b + j) * 0.5, s + j);
                      return (
                        <g key={s}>
                          <rect x={sx} y={by + 8 + j * 15} width={w} height={11} fill={lit(col, 0.15)} />
                          <rect x={sx} y={by + 14 + j * 15} width={w} height={5} fill={shade(col, 0.2)} />
                        </g>
                      );
                    })}
                  </g>
                ))}
              </g>
            );
          }),
        )}
        <rect x={810} y={G - 30} width={1220} height={30} fill={shade(K.metal, 0.3)} />
        <ReferenceFigure x={600} y={G} pxPerM={ppm} pose="point" breath={f} look={0.3} />
      </Layer>
      <Layer depth={1.35}>
        {specks(f, 24, 2200, 900, 27, 10).map((p, i) => (
          <circle key={i} cx={p.x - 100} cy={p.y} r={p.r * 0.9} fill={tint(E.b, P.bone, 0.3)} opacity={0.4} />
        ))}
      </Layer>
      <Layer depth={0}>
        <ScaleBar x={96} y={1000} px={ppm} label="1 M" color={P.ink} font={IF.label} />
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shots 7-8 - "the rock was wet": cracks open in the grains and sea-glass water seeps in; then wider, pores full (#8)
const Wet: React.FC<{ f: number; len: number; wide: boolean }> = ({ f, len, wide }) => {
  const cam = wide
    ? cameraAt(f, [
        { f: 0, x: 960, y: 540, zoom: 1.2 },
        { f: len + 10, x: 960, y: 540, zoom: 1.0 },
      ])
    : cameraAt(f, [
        { f: 0, x: 960, y: 540, zoom: 1.0 },
        { f: len + 10, x: 1000, y: 560, zoom: 1.18 },
      ]);
  const wet = wide ? 1 : ramp(f, 10, len);
  const cracks = wide ? 1 : ramp(f, 0, 30);
  return (
    <Stage theme={BONE} cam={cam} vignette={0.24}>
      <Layer depth={1}>
        <Crystals x={-500} y={-400} w={2900} h={1900} cell={wide ? 70 : 140} seed={wide ? 85 : 83} f={f} cracks={cracks} wet={wet} />
        {/* droplets beading in the pores */}
        {Array.from({ length: wide ? 30 : 12 }, (_, i) => {
          const d = drift(f, i + 40, 6, 120);
          const x = rnd(i * 7 + 3) * 1920 + d.x;
          const y = rnd(i * 11 + 5) * 1080 + d.y + ((f * (0.5 + rnd(i))) % 60);
          const r = (wide ? 6 : 12) * (0.6 + rnd(i) * 0.6) * wet;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={r} fill={K.sea} />
              <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.35} fill={K.seaLit} />
            </g>
          );
        })}
      </Layer>
      <Layer depth={0}>
        {wide ? (
          <text x={110} y={170} style={labelStyle(60, P.bone, 4)} opacity={ramp(f, 4, 14)}>
            Full of water
          </text>
        ) : null}
        <CornerTicks color={P.bone} />
      </Layer>
    </Stage>
  );
};
const ShotWet: ShotFC<C4> = ({ f, len }) => <Wet f={f} len={len} wide={false} />;
const ShotPorous: ShotFC<C4> = ({ f, len }) => <Wet f={f} len={len} wide />;

// Shot 9 - "water kept flowing into the hole, brine even below 8 km": the section with inflow arrows; the gauge marks 8 km
const ShotFlowing: ShotFC<C4> = ({ f, len, c }) => {
  const e0 = c.eight - c.flowing;
  const cam = cameraAt(f, [
    { f: 0, x: 980, y: 560, zoom: 1.0 },
    { f: e0, x: 1000, y: secY(7.4), zoom: 1.55 },
    { f: len + 10, x: 1010, y: secY(8.4), zoom: 1.7 },
  ]);
  const lab = ramp(f, e0, e0 + 12);
  const y8 = secY(8);
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={1}>
        <LongSection f={f} drill={12} water={ramp(f, 0, 14)} basalt={0.4} struck={1} label={false} />
        <SecGauge value={0} x={700} />
        <g opacity={lab}>
          <line x1={SEC.HX - 160} y1={y8} x2={SEC.HX + 260} y2={y8} stroke={P.ink} strokeWidth={2} strokeDasharray="6 6" />
          <text x={SEC.HX + 142} y={y8 + 60} style={labelStyle(38, P.ink, 3)}>
            Brine
          </text>
          <path d={`M${SEC.HX + 126} ${y8 + 20} L${SEC.HX + 126} ${y8 + 70}`} stroke={P.ink} strokeWidth={2} />
        </g>
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 10 - "the water level in the hole jumped eighty metres": inside the hole, a water column and a metre ruler (#8)
const ShotJump: ShotFC<C4> = ({ f, len, c }) => {
  const ppm = 5; // px per metre (the hole width is not to scale here)
  const j0 = c.jumped - c.zone;
  const base = 860;
  const lvl = base - 40 - lerp(f, j0 - 2, j0 + 14, 0, 80) * ppm;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 640, zoom: 1.1 },
    { f: len + 10, x: 960, y: 500, zoom: 1.0 },
  ]);
  const crack = f >= j0 - 6;
  return (
    <Stage theme={GRAPHITE} cam={cam} vignette={0.3}>
      <Layer depth={1}>
        {Array.from({ length: 16 }, (_, i) => (
          <rect key={i} x={-600} y={-400 + i * 110} width={3200} height={111} fill={mixHex(rockTone(0.6 + i * 0.02, i), P.graphite, 0.3)} />
        ))}
        <rect x={880} y={-400} width={160} height={base + 400 + 200} fill={K.hole} />
        <rect x={1020} y={-400} width={20} height={base + 600} fill={shade(E.a, 0.5)} />
        {/* the water column */}
        <rect x={880} y={lvl} width={160} height={base + 200 - lvl} fill={shade(K.sea, 0.15)} />
        <rect x={880} y={lvl} width={50} height={base + 200 - lvl} fill={lit(K.sea, 0.1)} />
        <path d={ptsToPath(Array.from({ length: 9 }, (_, i) => [880 + i * 20, lvl + Math.sin(f / 4 + i) * 3] as [number, number]))} fill="none" stroke={K.seaLit} strokeWidth={4} />
        {/* the deeper water zone breaking in from the side */}
        {crack ? (
          <g>
            <path d={`M1040 ${base + 80} L1200 ${base + 50} L1400 ${base + 90} L1700 ${base + 60}`} fill="none" stroke={K.sea} strokeWidth={10} strokeDasharray="30 12" strokeDashoffset={crawl(f, 4)} />
            {[0, 1, 2].map((i) => (
              <path key={i} d={`M${1100 + i * 50 + ((f * 3) % 50)} ${base + 50} l-16 10 l16 10`} fill="none" stroke={K.seaLit} strokeWidth={5} />
            ))}
          </g>
        ) : null}
        {/* ruler */}
        <rect x={1120} y={base - 40 - 100 * ppm} width={14} height={100 * ppm} fill={P.graphiteLift} stroke={P.chalk} strokeWidth={1.5} />
        {Array.from({ length: 11 }, (_, i) => (
          <line key={i} x1={1134} y1={base - 40 - i * 10 * ppm} x2={1134 + (i % 5 === 0 ? 22 : 10)} y2={base - 40 - i * 10 * ppm} stroke={P.chalk} strokeWidth={2} />
        ))}
        <g opacity={ramp(f, j0 + 10, j0 + 20)}>
          <path d={`M860 ${base - 40} L840 ${base - 40} L840 ${base - 40 - 80 * ppm} L860 ${base - 40 - 80 * ppm}`} fill="none" stroke={P.chalk} strokeWidth={4} />
          <text x={820} y={base - 40 - 40 * ppm + 20} textAnchor="end" style={numStyle(72, P.chalk)}>
            +80 m
          </text>
        </g>
      </Layer>
      <Layer depth={0}>
        <ScaleBar x={96} y={1000} px={20 * ppm} label="20 M" color={P.chalk} font={IF.label} />
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// Shot 11 - "other scientists didn't believe it": a report sheet (no readable text) gets a big question mark
const ShotDoubt: ShotFC<C4> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: len + 10, x: 980, y: 560, zoom: 1.12 },
  ]);
  const d = drift(f, 5, 8, 160);
  const q = ramp(f, 8, 18);
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={0.3}>
        {specks(f, 24, 1920, 1080, 101, 8).map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={tint(E.a, P.bone, 0.6)} opacity={0.5} />
        ))}
      </Layer>
      <Layer depth={1}>
        <g transform={`translate(${d.x} ${d.y}) rotate(${-4 + d.r} 960 540)`}>
          <rect x={700} y={170} width={560} height={740} fill={shade(P.boneDeep, 0.25)} transform="translate(20 24)" />
          <rect x={700} y={170} width={560} height={740} fill={lit(P.bone, 0.4)} stroke={P.ink} strokeWidth={2} />
          <rect x={750} y={220} width={300} height={22} fill={P.ink} />
          {Array.from({ length: 14 }, (_, i) => (
            <rect key={i} x={750} y={280 + i * 34} width={380 + rnd(i) * 80 - (i % 5 === 4 ? 200 : 0)} height={10} fill={tint(P.ink, P.bone, 0.6)} />
          ))}
          {/* a small section diagram on the sheet: a water drop in the deep rock */}
          <rect x={760} y={760} width={200} height={110} fill={rockTone(0.5)} />
          <path d="M860 790 L846 818 A16 16 0 1 0 874 818 Z" fill={K.sea} />
        </g>
        <g opacity={q} transform={`translate(1290 560) scale(${0.6 + 0.4 * q}) rotate(${8 * (1 - q)})`}>
          <text x={0} y={120} textAnchor="middle" style={{ ...numStyle(360, P.ink) }}>
            ?
          </text>
        </g>
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 12 - the old thinking: rock 5 km down drawn tight and dense; drops fall and bead off its surface (#8)
const ShotDense: ShotFC<C4> = ({ f, len, c }) => {
  const f0 = c.five - c.dense;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.0 },
    { f: len + 10, x: 960, y: 600, zoom: 1.1 },
  ]);
  const B = 560;
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={1}>
        <rect x={-600} y={-400} width={3200} height={B + 400} fill={rockTone(0.2)} />
        <Crystals x={-600} y={-400} w={3200} h={B + 400} cell={120} seed={111} f={f} cracks={0.6} />
        <clipPath id="s04-dense">
          <rect x={-600} y={B} width={3200} height={1000} />
        </clipPath>
        <g clipPath="url(#s04-dense)">
          <Crystals x={-600} y={B} w={3200} h={1000} cell={34} seed={113} f={f} />
          <rect x={-600} y={B} width={3200} height={1000} fill={P.graphite} opacity={0.25} />
        </g>
        <line x1={-600} y1={B} x2={2600} y2={B} stroke={P.ink} strokeWidth={5} />
        {Array.from({ length: 7 }, (_, i) => {
          const per = 46;
          const age = (f + i * 13) % per;
          const x = 300 + i * 220;
          const fallY = Math.min(B - 16, 80 + age * age * 0.4);
          const landed = 80 + age * age * 0.4 >= B - 16;
          return (
            <g key={i} opacity={landed ? Math.max(0, 1 - (age - Math.sqrt((B - 96) / 0.4)) / 10) : 1}>
              <path d={`M${x} ${fallY - 26} L${x - 12} ${fallY} A13 13 0 1 0 ${x + 12} ${fallY} Z`} fill={K.sea} transform={landed ? `translate(0 4) scale(1 1)` : undefined} />
              {landed ? <ellipse cx={x} cy={B - 6} rx={26} ry={6} fill={K.sea} opacity={0.6} /> : null}
            </g>
          );
        })}
        <g opacity={ramp(f, f0 - 4, f0 + 8)}>
          <text x={1500} y={B + 70} style={labelStyle(54, P.bone, 4)}>
            5 km
          </text>
          <text x={1500} y={B + 130} style={labelStyle(40, P.bone, 3)}>
            Too dense?
          </text>
        </g>
      </Layer>
      <Layer depth={0}>
        <text x={110} y={170} style={labelStyle(54, P.ink, 4)} opacity={ramp(f, 4, 14)}>
          The old idea
        </text>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 13 - "water was a surprise": looking down the 23 cm bore, a drop lands and rings spread
const ShotSurprise: ShotFC<C4> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: len + 10, x: 960, y: 540, zoom: 1.25 },
  ]);
  const R = 300;
  return (
    <Stage theme={GRAPHITE} cam={cam} vignette={0.3}>
      <Layer depth={1}>
        <Crystals x={-500} y={-400} w={2900} h={1900} cell={120} seed={121} f={f} />
        <rect x={-500} y={-400} width={2900} height={1900} fill={P.graphite} opacity={0.4} />
        <circle cx={960} cy={540} r={R + 24} fill={shade(rockTone(0.6), 0.3)} />
        <path d={`M${960 - R - 24} 540 A${R + 24} ${R + 24} 0 0 1 ${960 + R + 24} 540 L${960 + R} 540 A${R} ${R} 0 0 0 ${960 - R} 540 Z`} fill={lit(rockTone(0.6), 0.15)} />
        <circle cx={960} cy={540} r={R} fill={shade(K.sea, 0.35)} />
        <circle cx={960} cy={540} r={R} fill="none" stroke={K.seaShade} strokeWidth={10} />
        {[0, 1, 2, 3].map((i) => {
          const age = ((f - 6 + i * 12) % 48 + 48) % 48;
          const r = age * 6.2;
          return f >= 6 ? <circle key={i} cx={960} cy={540} r={r} fill="none" stroke={K.seaLit} strokeWidth={5} opacity={Math.max(0, 1 - r / R)} /> : null;
        })}
        {f < 8 ? <circle cx={960} cy={540} r={18} fill={K.seaLit} /> : null}
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// Shot 14 - "it kept getting hotter": the section warms in stepped amber bands from the bottom up; a temperature gauge
// rises beside the depth gauge (axis only, no value claimed yet)
const ShotHotter: ShotFC<C4> = ({ f, len, c }) => {
  const h0 = c.hotter - c.next;
  const heat = lerp(f, 6, len, 0, 1);
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 560, zoom: 1.08 },
    { f: len + 10, x: 860, y: 600, zoom: 1.0 },
  ]);
  const temp = lerp(f, h0 - 6, len + 30, 10, 110);
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={1}>
        <LongSection f={f} drill={12} heat={heat} basalt={0.4} struck={1} label={false} water={1 - ramp(f, 0, 30)} />
        <SecGauge value={12} x={300} />
        {/* stepped heat swatch column beside the temperature gauge */}
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x={1550} y={SEC.SY + 15 * SEC.PPK - (i + 1) * ((15 * SEC.PPK) / 8)} width={30} height={(15 * SEC.PPK) / 8} fill={heatTone(i / 7)} opacity={ramp(f, h0 + i * 3, h0 + i * 3 + 8)} />
        ))}
        <g opacity={ramp(f, h0 - 10, h0 + 6)}>
          <Gauge x={1620} y={SEC.SY} height={15 * SEC.PPK} value={temp} max={200} unit="°C" theme={BONE} direction="up" title="Heat" side="right" format={(v) => `${v}°`} readout={false} plate={110} unitCap={false} ticks={4} />
        </g>
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

export const SceneL04: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = l04Cues(t);
  const shots: ShotDef<C4>[] = [
    { from: 0, S: ShotNoBasalt },
    { from: c.gneiss, S: ShotGneiss },
    { from: c.waves, S: ShotWaves },
    { from: c.notNew, S: ShotSame },
    { from: c.changed, S: ShotChanged },
    { from: c.going, S: ShotShed },
    { from: c.wet, S: ShotWet },
    { from: c.porous, S: ShotPorous },
    { from: c.flowing, S: ShotFlowing },
    { from: c.zone, S: ShotJump },
    { from: c.doubt, S: ShotDoubt },
    { from: c.dense, S: ShotDense },
    { from: c.surprise, S: ShotSurprise },
    { from: c.next, S: ShotHotter },
  ];
  return playShots(f, shots, c, t.frames);
};

export const soundL04 = (t: SceneTiming): Cue[] => {
  const c = l04Cues(t);
  return [
    { at: 0, file: "mixkit-855-drill-electric.mp3", vol: 0.1, dur: c.gneiss, fadeIn: 4, fadeOut: 6 },
    { at: c.noBasalt + 6, file: "mixkit-2356-ui-pop-dry.mp3", vol: 0.3, dur: 20 },
    { at: c.gneiss - 4, file: "mixkit-2604-whoosh-deep-air.mp3", vol: 0.24, dur: 60 },
    { at: c.gneiss + 6, file: "mixkit-2568-ui-click-tone.mp3", vol: 0.26, dur: 20 },
    { at: c.waves - 4, file: "mixkit-1493-whoosh-swirl.mp3", vol: 0.22, dur: 50 },
    ...[0, 1, 2].map((i) => ({ at: c.waves + 10 + i * 75, file: "mixkit-1686-boom-underground-echo.mp3", vol: 0.14, dur: 30, fadeOut: 10 })).filter((q) => q.at < c.notNew),
    { at: c.notNew - 2, file: "mixkit-1489-whoosh-air.mp3", vol: 0.2, dur: 50 },
    { at: c.notNew + 10, file: "mixkit-2358-ui-pop-long.mp3", vol: 0.24, dur: 20 },
    { at: c.changed + 4, file: "mixkit-403-rock-debris-falling.mp3", vol: 0.2, dur: Math.max(20, c.going - c.changed), fadeOut: 10 },
    { at: c.going - 4, file: "mixkit-1489-whoosh-air.mp3", vol: 0.22, dur: 50 },
    { at: c.wet - 4, file: "mixkit-2604-whoosh-deep-air.mp3", vol: 0.24, dur: 60 },
    { at: c.wet + 10, file: "mixkit-3108-chime-crystal.mp3", vol: 0.14, dur: 60 },
    { at: c.porous - 2, file: "mixkit-2356-ui-pop-dry.mp3", vol: 0.22, dur: 20 },
    { at: c.flowing - 4, file: "mixkit-1493-whoosh-swirl.mp3", vol: 0.24, dur: 50 },
    { at: c.eight, file: "mixkit-2568-ui-click-tone.mp3", vol: 0.3, dur: 20 },
    { at: c.zone - 4, file: "mixkit-2604-whoosh-deep-air.mp3", vol: 0.24, dur: 60 },
    { at: c.jumped - 4, file: "mixkit-788-boom-cinematic-impact.mp3", vol: 0.3, dur: 90, fadeOut: 30 },
    { at: c.jumped + 12, file: "mixkit-2568-ui-click-tone.mp3", vol: 0.28, dur: 20 },
    { at: c.doubt - 2, file: "mixkit-1489-whoosh-air.mp3", vol: 0.2, dur: 50 },
    { at: c.doubt + 10, file: "mixkit-2358-ui-pop-long.mp3", vol: 0.28, dur: 20 },
    { at: c.dense - 4, file: "mixkit-2604-whoosh-deep-air.mp3", vol: 0.22, dur: 60 },
    { at: c.five, file: "mixkit-2568-ui-click-tone.mp3", vol: 0.26, dur: 20 },
    { at: c.surprise - 2, file: "mixkit-1489-whoosh-air.mp3", vol: 0.2, dur: 50 },
    { at: c.surprise + 6, file: "mixkit-3108-chime-crystal.mp3", vol: 0.2, dur: 60 },
    { at: c.next - 4, file: "mixkit-1493-whoosh-swirl.mp3", vol: 0.24, dur: 50 },
    { at: c.next, file: "mixkit-2297-rumble-bass-hum.mp3", vol: 0.3, dur: t.frames - c.next, fadeIn: 20, fadeOut: 10 },
    { at: c.hotter - 40, file: "mixkit-645-riser-synth.mp3", vol: 0.18, trim: 5, dur: t.frames - c.hotter + 40, fadeIn: 20, fadeOut: 8 },
  ];
};
