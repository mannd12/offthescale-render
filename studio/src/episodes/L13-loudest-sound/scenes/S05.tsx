// L13 scene l05 "Krakatoa, from the report" (storyboard §3 "5 · Krakatoa, from the report": shots 5-01…5-17; script
// lines 34-41 = scene lines 0-7; families noon map / muted dusk / STUDIO_SET / dusk Batavia / petrol; Act II).
// Package II builder. Every number drawn carries its sources.md row in a comment. F3: Krakatoa's readout is only ever
// the vermilion "?" (5-16), never 194. F7: Batavia's nine spikes use the table's proportions, no unit. F14/F16: maps
// and rings are schematic. F15: 5-04 is one muted coast with no people, no ruins, no number.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import {
  Bloom,
  Caustics,
  CloudRack,
  CycClouds,
  Dissolve,
  Emissive,
  GroundShadow,
  Kicker,
  Layer,
  LightWash,
  Metric,
  Motes,

  P,
  Pill,
  Plume,
  STUDIO_SET,
  Sky,
  Stage,
  Stars,
  Streamers,
  Tick,
  ZoomThrough,
  alpha,
  cameraAt,
  circlePath,
  cutPop,
  flash,
  mixHex,
  rnd,
  roundPoly,
} from "../../../lib/illustrated";
import type { CamKey } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { L13_COLORS, familyOf, pillFill } from "../families";
import { DB, L13Gauge } from "../L13Gauge";
import { GasHolder, ListeningTick, MapBox, Notebook, SitePin, SurveyMap, mapPoint } from "../props";
import { Barograph, GlobeL13, GlobeRing, Rings, SITES, Strip, bataviaSpikes, globePoint } from "../sound";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";

const NOON = familyOf("noon");
const DUSK = familyOf("dusk");
const PETROL = familyOf("petrol");
const VOID = familyOf("void");
const STUDIO = STUDIO_SET;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const sm = (t: number, a = 0, b = 1) => {
  const u = clamp01((t - a) / (b - a));
  return u * u * (3 - 2 * u);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const cam = (f: number, keys: CamKey[]) => {
  const c = cameraAt(f, keys);
  return { ...c, zoom: c.zoom * cutPop(f, 0) };
};

export const cuesL05 = (t: SceneTiming) => {
  const { at, p, end } = cueKit(t);
  return {
    strait: 0, // 5-01 survey map from above
    cone: p(0, "off Java"), // 5-02 the cone, the islands named
    clock: p(0, "On the twenty-seventh"), // 5-03 the clock lands on 9:58, the cone flashes
    blast: p(0, "it produced its largest"), // the flash + plume (same shot)
    coast: at(1), // 5-04 muted coast (DIS)
    sound: p(1, "We're following"), // 5-05 one teal ring on the desaturated map
    desk: at(2), // 5-06 the 1888 report thumps down (ZT into a page's map)
    perth: p(2, "The sound was heard"), // 5-07 the ring reaches Perth (PUSH into 5-08)
    ceylon: p(2, "In Ceylon"), // 5-08 the ring continues west to Ceylon
    rodri: at(3), // 5-09 Rodriguez
    globe: at(4), // 5-10 pull back to a globe: ~1/13
    slices: p(4, "a little under"), // 5-11 thirteen slices
    gas: at(5), // 5-12 Batavia gasworks
    drum: p(5, "a pressure gauge"), // 5-13 inside: the drum recorder
    spikes: p(5, "It jumped nine"), // 5-14 nine spikes, counter 1 → 9
    biggest: at(6), // 5-15 the eighth spike glows; 10:15
    unknown: at(7), // 5-16 the gauge spins and lands on "?"
    wrap: p(7, "Because the sound"), // 5-17 the strip wraps a globe (ZT into the globe → l06)
    last: end(7),
    end: t.frames,
  };
};
export type CL05 = ReturnType<typeof cuesL05>;

/** A clock face with ticks and two hands (no numerals): hours as a decimal (9.967 = 9:58). */
const ClockFace: React.FC<{ x: number; y: number; r: number; hours: number; F: typeof NOON }> = ({ x, y, r, hours, F }) => {
  const ha = ((hours % 12) / 12) * 360 - 90;
  const ma = ((hours % 1) * 360) - 90;
  const hand = (a: number, l: number, w: number, c: string) => (
    <line x1={x} y1={y} x2={x + Math.cos((a * Math.PI) / 180) * l} y2={y + Math.sin((a * Math.PI) / 180) * l} stroke={c} strokeWidth={w} strokeLinecap="round" />
  );
  return (
    <g>
      <circle cx={x + 6} cy={y + 8} r={r} fill={alpha("#000", 0.2)} />
      <circle cx={x} cy={y} r={r} fill="#FFF6E2" stroke={mixHex(F.shadow, "#000", 0.2)} strokeWidth={r * 0.07} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <line key={i} x1={x + Math.cos(a) * r * 0.78} y1={y + Math.sin(a) * r * 0.78} x2={x + Math.cos(a) * r * 0.9} y2={y + Math.sin(a) * r * 0.9} stroke="#2A3E46" strokeWidth={i % 3 === 0 ? r * 0.06 : r * 0.03} />;
      })}
      {hand(ha, r * 0.5, r * 0.09, "#2A3E46")}
      {hand(ma, r * 0.76, r * 0.055, "#2A3E46")}
      <circle cx={x} cy={y} r={r * 0.07} fill={P.vermilion} />
    </g>
  );
};

// ---- the Sunda Strait survey map (5-01 to 5-03) ---------------------------------------------------------------
const SBOX: MapBox = { x: -240, y: -180, w: 2400, h: 1440 };
const KP = mapPoint("sunda", SBOX, "krakatoa");
const StraitSet: React.FC<{ f: number; desat?: number }> = ({ f, desat = 0 }) => (
  <Layer depth={1}>
    <SurveyMap view="sunda" {...SBOX} family={NOON} frame={f} desaturate={desat} schematic={false} />
    <Caustics f={f} x={SBOX.x} y={SBOX.y} w={SBOX.w} h={SBOX.h} rows={9} color="#FFFFFF" opacity={0.22} speed={1.6} />
    {/* clouds and their cast shadows crossing the map (2.5 px/f): the shot's mover */}
    <g transform="translate(70 110)">
      <CloudRack f={f} n={6} x0={-700} x1={2600} y0={0} y1={1100} size={130} speed={2.6} body="#1F4F4C" opacity={0.2} seed={5} flat={1.2} />
    </g>
    <CloudRack f={f} n={6} x0={-700} x1={2600} y0={0} y1={1100} size={130} speed={2.6} body="#FFFFFF" under="#CFE3EA" top="#FFFFFF" seed={5} flat={1.2} />
  </Layer>
);

// 5-01 · the map from above; slow push to the cone
const ShotStrait: ShotFC<CL05> = ({ f, len }) => (
  <Stage theme={NOON.theme} cam={{ ...cameraAt(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len + 20, x: lerp(960, KP[0], 0.4), y: lerp(540, KP[1], 0.4), zoom: 1.35 }]) }} vignette={0.12} grain={0.5}>
    <StraitSet f={f} />
    <Layer depth={1}>
      <SitePin x={KP[0]} y={KP[1] - 8} kind="source" size={14} frame={f} />
    </Layer>
    <Layer depth={0}>
      <Pill x={120} y={130} text="SUNDA STRAIT" /* #7 */ fill={pillFill(NOON)} color={NOON.text} dot={L13_COLORS.saffron} size={24} />
      <Pill x={120} y={180} text="SCHEMATIC" /* F16 */ fill={pillFill(NOON)} color={NOON.text} size={16} />
    </Layer>
  </Stage>
);

// 5-02 · the cone; the islands named
const ShotCone: ShotFC<CL05> = ({ f, len }) => {
  const sum = mapPoint("sunda", SBOX, "krakatoa");
  return (
    <Stage theme={NOON.theme} cam={cam(f, [{ f: 0, x: KP[0], y: KP[1], zoom: 2.0 }, { f: len, x: KP[0] + 20, y: KP[1] - 10, zoom: 2.3 }])} vignette={0.12} grain={0.5}>
      <StraitSet f={f + 120} />
      <Layer depth={1}>
        <SitePin x={sum[0]} y={sum[1] - 8} kind="source" size={10} frame={f} />
      </Layer>
      <Layer depth={0}>
        <g opacity={sm(f, 4, 14)}>
          <Pill x={420} y={300} text="SUMATRA" /* #7 */ fill={pillFill(NOON)} color={NOON.text} size={24} />
        </g>
        <g opacity={sm(f, 14, 24)}>
          <Pill x={1380} y={820} text="JAVA" /* #7 */ fill={pillFill(NOON)} color={NOON.text} size={24} />
        </g>
      </Layer>
    </Stage>
  );
};

// 5-03 · a clock face lands on 9:58; the cone flashes; a saffron plume lifts
const ClockBody: React.FC<{ f: number; len: number; tBlast: number }> = ({ f, len, tBlast }) => {
  const drop = sm(f, 0, 12);
  const hours = lerp(9.0, 9 + 58 / 60 /* #2: 9:58 a.m. */, sm(f, 2, 34));
  const pl = sm(f, tBlast, tBlast + 60);
  const fl = flash(f, tBlast, 10, 0.7);
  return (
    <Stage theme={NOON.theme} cam={cam(f, [{ f: 0, x: KP[0], y: KP[1] - 60, zoom: 3.0 }, { f: tBlast, x: KP[0], y: KP[1] - 100, zoom: 2.9 }, { f: len + 30, x: KP[0], y: KP[1] - 160, zoom: 2.4 }])} vignette={0.14} grain={0.5}>
      <StraitSet f={f + 260} />
      <Layer depth={1}>
        <Bloom x={KP[0]} y={KP[1]} r={60 + 140 * pl} color={L13_COLORS.saffron} strength={0.3 + 0.5 * pl} spread={0.4} />
        {pl > 0 ? <Plume x={KP[0]} y={KP[1]} h={150 * pl + 10} r0={10} fill={L13_COLORS.saffron} shade={L13_COLORS.saffronDeep} lit={L13_COLORS.saffronCore} light={225} seed={3} frame={f * 1.5} t={pl} /> : null}
      </Layer>
      <Layer depth={0}>
        <g transform={`translate(0 ${(-(1 - drop) * 300).toFixed(1)})`}>
          <ClockFace x={300} y={330} r={150} hours={hours} F={NOON} />
        </g>
        <Metric x={500} y={300} value="9:58 a.m." /* #2 */ size={96} color={NOON.text} />
        <Pill x={500} y={360} text="27 AUG 1883 · LOCAL TIME" /* #1 #2 */ fill={pillFill(NOON)} color={NOON.text} dot={L13_COLORS.saffron} size={20} />
      </Layer>
      {fl > 0 ? (
        <Layer depth={0}>
          <rect x={0} y={0} width={1920} height={1080} fill="#FFF4D6" opacity={fl} />
        </Layer>
      ) : null}
    </Stage>
  );
};
const ShotClock: ShotFC<CL05> = ({ f, len, c }) => <ClockBody f={f} len={len} tBlast={c.blast - c.clock} />;

// 5-04 · muted dusk: a long coastline seen from the sea; a dark band of sea waves rolls in; the sky dims (F15)
const MUTE = (c: string, k = 0.18) => mixHex(c, "#7C8A90", k);
const CoastBody: React.FC<{ f: number }> = ({ f }) => {
  const HZ = 520;
  const dim = sm(f, 0, 160) * 0.25;
  const bands = Array.from({ length: 5 }, (_, k) => {
    const u = (((f * 4 + k * 150) % 750) + 750) % 750; // px travelled from the near edge (4 px/f near)
    const y = 1180 - 660 * Math.pow(u / 750, 0.8);
    const d = clamp01((y - HZ) / 660);
    return { y, d, k };
  });
  return (
    <Stage theme={DUSK.theme} cam={cameraAt(f, [{ f: 0, x: 960, y: 540, zoom: 1.04 }, { f: 240, x: 960, y: 530, zoom: 1.1 }])} vignette={0.3} grain={0.6}>
      <Layer depth={0.05}>
        <Sky stops={DUSK.sky.map((s) => MUTE(s, 0.15 + dim))} />
      </Layer>
      <Layer depth={0.3}>
        <CloudRack f={f} n={5} x0={-500} x1={2500} y0={250} y1={440} size={120} speed={1.8} body={MUTE(DUSK.far, 0.25)} under={MUTE(DUSK.shadow, 0.2)} seed={17} />
      </Layer>
      <Layer depth={0.5}>
        <path d={`M-400 ${HZ} Q 200 ${HZ - 50} 600 ${HZ - 30} T 1400 ${HZ - 44} T 2400 ${HZ - 20} V ${HZ + 4} H -400 Z`} fill={MUTE(DUSK.mid, 0.3)} />
        <rect x={-400} y={HZ} width={2800} height={900} fill={MUTE(DUSK.sky[1], 0.35)} />
      </Layer>
      <Layer depth={1}>
        {bands.map(({ y, d, k }) => {
          const th = 24 + 150 * d;
          const amp = 6 + 20 * d;
          const pts: string[] = [];
          for (let x = -400; x <= 2400; x += 80) pts.push(`${x} ${(y + Math.sin(x / 140 + k) * amp).toFixed(1)}`);
          const top = "M" + pts.join(" L");
          return (
            <g key={k} opacity={0.35 + 0.6 * d}>
              <path d={`${top} L2400 ${y + th} L-400 ${y + th} Z`} fill={MUTE("#0B2A36", 0.1)} />
              <path d={top} fill="none" stroke={MUTE("#E6F5EA", 0.25)} strokeWidth={2 + 5 * d} />
            </g>
          );
        })}
      </Layer>
    </Stage>
  );
};
const ShotCoast: ShotFC<CL05> = ({ f, c }) => {
  const prevLen = c.coast - c.clock;
  if (f < 18) return <Dissolve t={f / 18} from={<ClockBody f={prevLen + f} len={prevLen} tBlast={c.blast - c.clock} />} to={<CoastBody f={f} />} />;
  return <CoastBody f={f} />;
};

// ---- the Indian Ocean hemisphere map (5-05, 5-07 to 5-09) --------------------------------------------------------
const HBOX: MapBox = { x: -200, y: -150, w: 2320, h: 1380 };
const H = {
  k: mapPoint("indian", HBOX, "krakatoa"),
  perth: mapPoint("indian", HBOX, "perth"),
  ceylon: mapPoint("indian", HBOX, "ceylon"),
  rodri: mapPoint("indian", HBOX, "rodriguez"),
};
const dist = (a: [number, number], b: [number, number]) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const D = { perth: dist(H.k, H.perth), ceylon: dist(H.k, H.ceylon), rodri: dist(H.k, H.rodri) };

/** The heard-area front's radius at scene frame F: keyed to the phrases, so it arrives at each place on its word. */
const heardR = (F: number, c: CL05) =>
  interpolate(F, [c.desk, c.perth, c.perth + 30, c.ceylon + 10, c.rodri + 34, c.globe], [0, 360, D.perth, D.ceylon, D.rodri, D.rodri + 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const HemiSet: React.FC<{ f: number; F: number; c: CL05; desat?: number; heard?: boolean; pins?: ("perth" | "ceylon" | "rodri")[] }> = ({ f, F, c, desat = 0, heard = true, pins = [] }) => {
  const r = heardR(F, c);
  return (
    <Layer depth={1}>
      <SurveyMap view="indian" {...HBOX} family={NOON} frame={f} desaturate={desat} schematic={false} />
      <Caustics f={f} x={HBOX.x} y={HBOX.y} w={HBOX.w} h={HBOX.h} rows={10} color="#FFFFFF" opacity={0.18} speed={1.4} />
      {heard && r > 2 ? (
        <g>
          <path d={circlePath(H.k[0], H.k[1], r)} fill={alpha(L13_COLORS.teal, 0.2)} />
          <Emissive d={circlePath(H.k[0], H.k[1], r)} color={L13_COLORS.teal} core={L13_COLORS.bone} width={7} glow={16} />
        </g>
      ) : null}
      {/* sound rings racing out behind the front (6 px/f): the always-on mover */}
      <Rings f={f} cx={H.k[0]} cy={H.k[1]} period={42} speed={6} maxR={Math.max(200, heard ? r : 1300)} width={4} color={L13_COLORS.teal} core={L13_COLORS.bone} />
      <g transform="translate(60 90)">
        <CloudRack f={f} n={5} x0={-600} x1={2600} y0={0} y1={1100} size={110} speed={2.4} body="#1F4F4C" opacity={0.16} seed={9} flat={1.2} />
      </g>
      <CloudRack f={f} n={5} x0={-600} x1={2600} y0={0} y1={1100} size={110} speed={2.4} body="#FFFFFF" under="#CFE3EA" seed={9} flat={1.2} opacity={0.9} />
      <SitePin x={H.k[0]} y={H.k[1]} kind="source" size={14} frame={f} />
      {pins.map((p) => (p === "rodri" ? <SitePin key={p} x={H.rodri[0]} y={H.rodri[1]} kind="here" size={16} frame={f} /> : <SitePin key={p} x={H[p][0]} y={H[p][1]} kind="plain" size={12} frame={f} />))}
    </Layer>
  );
};

// 5-05 · back on the map, desaturated except one teal ring spreading from the cone; Tick small at the map's edge, listening
const ShotSound: ShotFC<CL05> = ({ f, len }) => {
  const tx = 330;
  const ty = 960;
  const rr = (f * 6) % 1600;
  const perk = clamp01(1 - Math.abs(rr - dist(H.k, [tx, ty - 100])) / 160);
  return (
    <Stage theme={NOON.theme} cam={cam(f, [{ f: 0, x: 1000, y: 560, zoom: 1.0 }, { f: len, x: 980, y: 560, zoom: 1.06 }])} vignette={0.14} grain={0.5}>
      <Layer depth={1}>
        <SurveyMap view="indian" {...HBOX} family={NOON} frame={f} desaturate={0.4} schematic={false} />
        <g transform="translate(60 90)">
          <CloudRack f={f} n={5} x0={-600} x1={2600} y0={0} y1={1100} size={110} speed={2.4} body="#1F4F4C" opacity={0.14} seed={13} flat={1.2} />
        </g>
        <CloudRack f={f} n={5} x0={-600} x1={2600} y0={0} y1={1100} size={110} speed={2.4} body="#F4F7F6" under="#D4DCDD" seed={13} flat={1.2} opacity={0.85} />
        <Emissive d={circlePath(H.k[0], H.k[1], Math.max(4, rr))} color={L13_COLORS.teal} core={L13_COLORS.bone} width={10} glow={32} opacity={1 - rr / 1600} />
        <SitePin x={H.k[0]} y={H.k[1]} kind="source" size={14} frame={f} />
      </Layer>
      <Layer depth={0.9}>
        <GroundShadow x={tx} y={ty + 4} rx={60} ry={10} />
        <ListeningTick x={tx} y={ty} pxPerM={130} frame={f} toward={1} perk={perk} expression="determined" />
      </Layer>
    </Stage>
  );
};

// 5-06 · STUDIO_SET desk: the 1888 report thumps down; ship logs, letters and barograph strips fly in and stack;
// ZoomThrough into the map on the report's open page → the hemisphere map
const MINI: MapBox = { x: 990, y: 520, w: 300, h: 220 };
const DeskBody: React.FC<{ f: number }> = ({ f }) => {
  const DESK_Y = 430;
  const drop = clamp01(f / 10);
  const by = lerp(-500, 0, drop * drop);
  const sq = f >= 10 && f < 18 ? 1 - 0.06 * Math.sin(((f - 10) / 8) * Math.PI) : 1;
  const items = [
    { kind: "log", x: 420, y: 760, r: -12, from: [-600, 900] },
    { kind: "letter", x: 1560, y: 560, r: 10, from: [2500, 300] },
    { kind: "strip", x: 560, y: 470, r: -4, from: [-700, 200] },
    { kind: "letter", x: 1420, y: 840, r: -8, from: [2400, 1300] },
    { kind: "strip", x: 1500, y: 960, r: 3, from: [2600, 1000] },
    { kind: "log", x: 300, y: 980, r: 14, from: [-500, 1500] },
  ];
  return (
    <Stage theme={STUDIO.theme} cam={cameraAt(f, [{ f: 0, x: 960, y: 600, zoom: 1.0 }, { f: 120, x: 1000, y: 620, zoom: 1.06 }])} vignette={0.14} grain={0.5}>
      <Layer depth={0.05}>
        <Sky family={STUDIO} />
      </Layer>
      <Layer depth={0.3}>
        <CycClouds f={f} y={210} n={3} seed={3} />
      </Layer>
      <Layer depth={1}>
        <rect x={-600} y={DESK_Y} width={3200} height={1200} fill={STUDIO.mid} />
        <rect x={-600} y={DESK_Y} width={3200} height={12} fill={mixHex(STUDIO.mid, "#FFF2D0", 0.45)} />
        {Array.from({ length: 7 }, (_, i) => (
          <path key={i} d={`M-600 ${DESK_Y + 80 + i * 110} Q 960 ${DESK_Y + 60 + i * 112} 2600 ${DESK_Y + 90 + i * 108}`} stroke={STUDIO.near} strokeWidth={3} fill="none" opacity={0.4} />
        ))}
        {/* the report: an open book, its right page carries a small hemisphere map */}
        <g transform={`translate(0 ${by.toFixed(1)}) translate(960 ${640}) scale(${(1 / sq).toFixed(3)} ${sq.toFixed(3)}) translate(-960 -640)`}>
          <GroundShadow x={960} y={790} rx={420} ry={30} />
          <rect x={560} y={470} width={800} height={320} rx={10} fill="#5C2A1A" />
          <rect x={580} y={480} width={375} height={300} fill="#F7EBCF" />
          <rect x={965} y={480} width={375} height={300} fill="#F2E3C2" />
          {Array.from({ length: 9 }, (_, i) => (
            <rect key={i} x={610} y={510 + i * 28} width={300 - (i % 3) * 40} height={8} rx={4} fill="#9C8A6A" opacity={0.6} />
          ))}
          <SurveyMap view="indian" {...MINI} family={NOON} frame={f} schematic={false} hatch={false} />
        </g>
        {items.map((it, i) => {
          const t0 = 14 + i * 7;
          const k = clamp01((f - t0) / 12);
          if (k <= 0) return null;
          const e = 1 - Math.pow(1 - k, 3);
          const x = lerp(it.from[0], it.x, e);
          const y = lerp(it.from[1], it.y, e);
          const r = lerp(it.r * 4, it.r, e);
          return (
            <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
              <rect x={-4} y={8} width={it.kind === "strip" ? 420 : 200} height={it.kind === "strip" ? 70 : it.kind === "log" ? 150 : 120} fill={alpha("#000", 0.18)} />
              {it.kind === "log" ? (
                <g>
                  <rect x={-10} y={0} width={200} height={150} rx={8} fill="#7A3A22" />
                  <rect x={20} y={30} width={140} height={34} rx={4} fill="#E8C98A" />
                </g>
              ) : it.kind === "letter" ? (
                <g>
                  <rect x={-10} y={0} width={200} height={120} fill="#FFF6E2" stroke="#B9A47A" strokeWidth={2} />
                  <path d="M-10 0 L90 66 L190 0" fill="none" stroke="#B9A47A" strokeWidth={3} />
                </g>
              ) : (
                <g>
                  <rect x={-10} y={0} width={420} height={70} fill="#F7EBCF" stroke="#C9A97A" strokeWidth={2} />
                  <path d={`M0 46 ${Array.from({ length: 20 }, (_, j) => `L${j * 21} ${46 - (j === 9 ? 30 : j === 13 ? 18 : rnd(j + i) * 4)}`).join(" ")}`} fill="none" stroke="#1E3A44" strokeWidth={3} />
                </g>
              )}
            </g>
          );
        })}
      </Layer>
      <Layer depth={0}>
        <Kicker x={120} y={130} text="— ROYAL SOCIETY · 1888" /* #1 */ color={STUDIO.text} size={28} />
      </Layer>
    </Stage>
  );
};
const ShotDesk: ShotFC<CL05> = ({ f, len, c }) => {
  const zt = clamp01((f - (len - 24)) / 24);
  const body = <DeskBody f={f} />;
  if (zt <= 0) return body;
  const F = c.desk + f;
  return (
    <ZoomThrough
      t={zt}
      focal={{ x: 1140, y: 630 }}
      from={body}
      to={
        <Stage theme={NOON.theme} cam={{ x: 1360, y: 690, zoom: 1.15 }} vignette={0.12} grain={0.5}>
          <HemiSet f={F} F={F} c={c} />
        </Stage>
      }
    />
  );
};

// 5-07 / 5-08 · the heard area spreads from the pin; the front reaches Perth, then pans west to Ceylon
const ShotPerth: ShotFC<CL05> = ({ f, len, c }) => {
  const F = c.perth + f;
  const t2 = c.ceylon - c.perth;
  const showPerth = sm(f, 24, 34) * (1 - sm(f, t2 - 4, t2 + 6));
  const showCeylon = sm(f, t2 + 6, t2 + 16);
  return (
    <Stage theme={NOON.theme} cam={cameraAt(f, [{ f: 0, x: 1360, y: 690, zoom: 1.15 }, { f: t2 - 6, x: 1320, y: 650, zoom: 1.12 }, { f: t2 + 30, x: 1040, y: 470, zoom: 1.16 }, { f: len + 10, x: 1000, y: 470, zoom: 1.18 }])} vignette={0.12} grain={0.5}>
      <HemiSet f={F} F={F} c={c} pins={["perth", ...(showCeylon > 0 ? (["ceylon"] as const) : [])]} />
      <Layer depth={0}>
        <g opacity={showPerth}>
          <Pill x={120} y={130} text="PERTH · ~3,000 km" /* #4 */ fill={pillFill(NOON)} color={NOON.text} dot={L13_COLORS.teal} size={24} />
        </g>
        <g opacity={showCeylon}>
          <Pill x={120} y={130} text="CEYLON · ~3,200 km" /* #4 */ fill={pillFill(NOON)} color={NOON.text} dot={L13_COLORS.teal} size={24} />
        </g>
      </Layer>
    </Stage>
  );
};

// 5-09 · the front reaches Rodriguez: the vermilion pin, a fluttering notebook icon, the island from the cold open
const ShotRodri: ShotFC<CL05> = ({ f, len, c }) => {
  const F = c.rodri + f;
  const arrive = sm(f, 28, 40);
  return (
    <Stage theme={NOON.theme} cam={cam(f, [{ f: 0, x: 820, y: 620, zoom: 1.3 }, { f: len, x: 720, y: 660, zoom: 1.4 }])} vignette={0.12} grain={0.5}>
      <HemiSet f={F} F={F} c={c} pins={["ceylon", "perth", "rodri"]} />
      <Layer depth={1}>
        <g opacity={arrive}>
          <Notebook x={H.rodri[0] + 150} y={H.rodri[1] - 150} w={170} h={110} flutter={1} f={f} tilt={-6} />
        </g>
      </Layer>
      <Layer depth={0}>
        <g opacity={arrive}>
          <Pill x={120} y={130} text="RODRIGUEZ · ~4,800 km" /* #1 · F10 */ fill={pillFill(NOON)} color={NOON.text} dot={P.vermilion} size={24} />
        </g>
      </Layer>
    </Stage>
  );
};

// 5-10 · pull back to a globe; the heard area drawn on it (a cap a little under 1/13 of the surface, #3)
const CAP = Math.acos(11 / 13) * 0.97; // #3: area fraction (1 − cos θ)/2 = 1/13, "a little under"
const ShotGlobe: ShotFC<CL05> = ({ f, len }) => {
  const g = { cx: 960, cy: 540, R: 380, rot: 78 + f * 0.55, tilt: 4 };
  const kp = globePoint(g, SITES.krakatoa.lon, SITES.krakatoa.lat);
  const pulse = 1 + 0.35 * Math.sin(f / 5);
  return (
    <Stage theme={PETROL.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.5 }, { f: 40, x: 960, y: 540, zoom: 1.0 }, { f: len + 10, x: 960, y: 540, zoom: 0.97 }])} vignette={0.24} grain={0.5}>
      <Layer depth={0.05}>
        <Sky family={PETROL} />
        <Stars frame={f} n={110} w={1920} h={1080} color={PETROL.text} seed={7} size={1.5} twinkle={0.7} />
        <Bloom x={420} y={300} r={700} color={L13_COLORS.gold} strength={0.3} spread={0.4} />
      </Layer>
      <Layer depth={1}>
        <GlobeL13 {...g} family={PETROL}>
          {[0.25, 0.45, 0.65, 0.85].map((k) => (
            <GlobeRing key={k} globe={g} d={CAP * k} color={L13_COLORS.teal} width={22} opacity={0.22} />
          ))}
          <GlobeRing globe={g} d={CAP} color={L13_COLORS.teal} core={L13_COLORS.bone} width={6 * pulse} />
        </GlobeL13>
        {kp.z > 0 ? <SitePin x={kp.x} y={kp.y} kind="source" size={10} frame={f} /> : null}
      </Layer>
      <Layer depth={0}>
        <Metric x={120} y={210} value="~1/13" /* #3 */ size={100} color={PETROL.text} />
        <Pill x={120} y={270} text="OF EARTH'S SURFACE" /* #3 */ fill={pillFill(PETROL)} color={PETROL.text} dot={L13_COLORS.teal} size={20} />
      </Layer>
    </Stage>
  );
};

// 5-11 · thirteen equal slices of a disc pop out one after another; one is shaded, a sliver short
const ShotSlices: ShotFC<CL05> = ({ f, len }) => {
  const cx = 1060;
  const cy = 560;
  const r = 330;
  const n = 13; // #3
  const cycle = n * 4 + 18;
  return (
    <Stage theme={PETROL.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 980, y: 540, zoom: 1.05 }])} vignette={0.24} grain={0.5}>
      <Layer depth={0.05}>
        <Sky family={PETROL} />
        <Stars frame={f} n={90} w={1920} h={1080} color={PETROL.text} seed={9} size={1.4} twinkle={0.7} />
      </Layer>
      <Layer depth={1}>
        {Array.from({ length: n }, (_, k) => {
          const a0 = (k / n) * Math.PI * 2 - Math.PI / 2;
          const a1 = ((k + 1) / n) * Math.PI * 2 - Math.PI / 2;
          const am = (a0 + a1) / 2;
          const ph = (f - k * 4) % cycle;
          const out = ph >= 0 && ph < 12 ? Math.sin((ph / 12) * Math.PI) * 60 : 0;
          const hero = k === 0;
          const rr = hero ? r * 0.93 : r;
          const ox = Math.cos(am) * (out + (hero ? 26 : 0));
          const oy = Math.sin(am) * (out + (hero ? 26 : 0));
          const d = `M${cx + ox} ${cy + oy} L${cx + ox + Math.cos(a0) * rr} ${cy + oy + Math.sin(a0) * rr} A${rr} ${rr} 0 0 1 ${cx + ox + Math.cos(a1) * rr} ${cy + oy + Math.sin(a1) * rr} Z`;
          return <path key={k} d={d} fill={hero ? L13_COLORS.saffron : k % 2 ? "#1F8F8A" : "#2FBFA8"} stroke={PETROL.sky[0]} strokeWidth={5} strokeLinejoin="round" />;
        })}
      </Layer>
      <Layer depth={0}>
        <Pill x={120} y={130} text="A LITTLE UNDER" /* #3 */ fill={pillFill(PETROL)} color={PETROL.text} dot={L13_COLORS.saffron} size={24} />
      </Layer>
    </Stage>
  );
};

// 5-12 · "close in": dusk morning at the Batavia gasworks: a round gas holder, chimneys, a tall gauge house
const ShotGasworks: ShotFC<CL05> = ({ f, len }) => {
  const GY = 880;
  return (
    <Stage theme={DUSK.theme} cam={cam(f, [{ f: 0, x: 960, y: 560, zoom: 1.0 }, { f: len + 10, x: 1080, y: 600, zoom: 1.4 }])} vignette={0.2} grain={0.5}>
      <Layer depth={0.05}>
        <Sky family={DUSK} />
        <Bloom x={1720} y={620} r={420} color={DUSK.light} strength={0.55} spread={0.5} />
      </Layer>
      <Layer depth={0.3}>
        <CloudRack f={f} n={4} x0={-600} x1={2600} y0={200} y1={420} size={110} speed={2} body={mixHex(DUSK.sky[2], "#FFE0B8", 0.4)} under={DUSK.sky[2]} seed={23} />
        <path d={`M-400 ${GY - 80} Q 600 ${GY - 120} 1400 ${GY - 90} T 2400 ${GY - 100} V 1400 H -400 Z`} fill={mixHex(DUSK.far, DUSK.sky[2], 0.3)} />
      </Layer>
      <Layer depth={1}>
        <rect x={-600} y={GY} width={3200} height={600} fill={mixHex(DUSK.mid, "#B9783E", 0.45)} />
        <GasHolder x={700} y={GY} w={560} h={460} family={DUSK} fill={0.55 + 0.25 * sm(f, 0, len)} light={15} />
        {/* the gauge house */}
        <rect x={1060} y={GY - 400} width={140} height={400} fill={mixHex(DUSK.mid, "#7A3A22", 0.4)} />
        <path d={`M1046 ${GY - 400} L1130 ${GY - 470} L1214 ${GY - 400} Z`} fill={mixHex(DUSK.shadow, "#7A3A22", 0.3)} />
        <rect x={1196} y={GY - 400} width={4} height={400} fill={DUSK.light} opacity={0.8} />
        <circle cx={1130} cy={GY - 300} r={30} fill="#FFF0CC" stroke="#3A2412" strokeWidth={5} />
        <line x1={1130} y1={GY - 300} x2={1130 + Math.cos(f / 6) * 22} y2={GY - 300 + Math.sin(f / 6) * 22} stroke="#3A2412" strokeWidth={4} />
        {/* chimneys and their smoke drifting right */}
        {[1330, 1460].map((x, i) => (
          <rect key={x} x={x} y={GY - 520 + i * 60} width={56} height={520 - i * 60} fill={mixHex(DUSK.mid, "#5A2A1A", 0.5)} />
        ))}
        <CloudRack f={f} n={4} x0={1320} x1={2500} y0={GY - 560} y1={GY - 480} size={90} speed={2.6} body="#DCC6B8" under="#9C8A80" top="#F4E6DA" seed={29} />
        <Streamers f={f} n={10} x0={-200} x1={2200} y0={300} y1={800} len={70} width={2.5} speed={4} color="#FFF4E0" opacity={0.35} seed={3} />
      </Layer>
      <Layer depth={0}>
        <Pill x={120} y={130} text="BATAVIA GASWORKS · ~140 km" /* #5 */ fill={pillFill(DUSK)} color={DUSK.text} dot={DUSK.light} size={22} />
      </Layer>
    </Stage>
  );
};

// 5-13 · inside: a drum recorder, paper scrolling under a pen; Tick leans in to read it
const ROOM = { wall: "#2A6F78", wallLit: "#E39A5A", floor: "#7A4A2C" };
const ShotDrum: ShotFC<CL05> = ({ f, len }) => {
  const fl = 0.75 + 0.25 * Math.sin(f / 4) * Math.sin(f / 9);
  return (
    <Stage theme={DUSK.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 1000, y: 520, zoom: 1.08 }])} vignette={0.24} grain={0.5}>
      <Layer depth={0.2}>
        <rect x={-400} y={-400} width={2800} height={1900} fill={ROOM.wall} />
        <rect x={120} y={80} width={320} height={420} fill="#FFE2A8" opacity={0.9} />
        <path d="M280 80 V500 M120 290 H440" stroke={ROOM.wall} strokeWidth={14} />
        <path d={`M120 500 L440 500 L1100 1080 L-200 1080 Z`} fill={ROOM.wallLit} opacity={0.32 * fl} />
      </Layer>
      <Layer depth={1}>
        <rect x={-400} y={780} width={2800} height={600} fill={ROOM.floor} />
        <rect x={80} y={700} width={1500} height={60} rx={8} fill="#5A3420" />
        <Barograph f={f} x={360} y={340} w={960} h={260} speed={3} spikes={[]} wobble={2} family={DUSK} />
        <Tick x={1600} y={1010} pxPerM={280} frame={f} facing={-1} pose="lean" expression="thinking" look={0.2} headTilt={6 + Math.sin(f / 20) * 4} />
      </Layer>
      <Layer depth={1.2}>
        <Motes frame={f} n={26} x={100} y={100} w={1500} h={800} color="#FFE6B8" seed={4} size={6} />
      </Layer>
      <Layer depth={0}>
        <Pill x={120} y={130} text="CONTINUOUS RECORD" /* #5 */ fill={pillFill(DUSK)} color={DUSK.text} dot={DUSK.light} size={22} />
      </Layer>
    </Stage>
  );
};

// 5-14 · time-lapse of the strip: nine spikes draw one by one, in the table's proportions (F7); counter 1 → 9
const STRIP = { x: 120, y: 320, w: 1680, h: 440 };
const ShotSpikes: ShotFC<CL05> = ({ f, len }) => {
  const spikes = bataviaSpikes(12, 5); // #5: heights ∝ 13, 20, 21, 22, 41, 41, 29, 63, 40 (no unit)
  const n = spikes.filter((s) => s.at + 3 <= f).length;
  return (
    <Stage theme={DUSK.theme} cam={cam(f, [{ f: 0, x: 960, y: 560, zoom: 1.0 }, { f: len, x: 960, y: 560, zoom: 1.04 }])} vignette={0.22} grain={0.5}>
      <Layer depth={0.05}>
        <rect x={-400} y={-400} width={2800} height={1900} fill={ROOM.wall} />
        <LightWash x={500} y={300} rx={900} ry={500} color={ROOM.wallLit} strength={0.3} />
      </Layer>
      <Layer depth={1}>
        <Strip f={f} {...STRIP} speed={9} spikes={spikes} scale={260} />
      </Layer>
      <Layer depth={1.2}>
        <Motes frame={f} n={20} x={100} y={100} w={1700} h={800} color="#FFE6B8" seed={6} size={6} />
      </Layer>
      <Layer depth={0}>
        <Kicker x={120} y={110} text="— 26-27 AUGUST" /* #5 */ color={DUSK.text} size={26} />
        <Metric x={120} y={250} value={String(Math.max(1, n))} /* #5: 9 jumps */ unit={n === 1 ? "jump" : "jumps"} size={96} color={DUSK.text} />
      </Layer>
    </Stage>
  );
};

// 5-15 · the eighth spike, the tallest, glows; a clock reads 10:15
const ShotBiggest: ShotFC<CL05> = ({ f, len }) => {
  const spikes = bataviaSpikes(24 - 16.917 * 12, 12); // #5: the 8th (10:15) passes the pen at f 24
  const penX = STRIP.x + STRIP.w * 0.78;
  const sx = penX - (f - 24) * 3;
  const base = STRIP.y + STRIP.h * 0.66;
  const glow = sm(f, 22, 30) * (0.7 + 0.3 * Math.sin(f / 3));
  const hours = lerp(9.5, 10.25 /* #5: 10:15 a.m. */, sm(f, 0, 26));
  return (
    <Stage theme={DUSK.theme} cam={cam(f, [{ f: 0, x: 960, y: 560, zoom: 1.06 }, { f: len, x: 1060, y: 560, zoom: 1.12 }])} vignette={0.22} grain={0.5}>
      <Layer depth={0.05}>
        <rect x={-400} y={-400} width={2800} height={1900} fill={ROOM.wall} />
        <LightWash x={500} y={300} rx={900} ry={500} color={ROOM.wallLit} strength={0.3} />
      </Layer>
      <Layer depth={1}>
        <Strip f={f} {...STRIP} speed={3} spikes={spikes} scale={260} />
        {glow > 0 && sx > STRIP.x ? (
          <g opacity={glow}>
            <Bloom x={sx} y={base - 200} r={220} color={L13_COLORS.saffron} strength={0.6} spread={0.4} />
            <Emissive d={`M${sx} ${base} L${sx + 3} ${base - 262}`} color={L13_COLORS.saffron} core={L13_COLORS.saffronCore} width={8} glow={16} />
          </g>
        ) : null}
      </Layer>
      <Layer depth={1.2}>
        <Motes frame={f} n={20} x={100} y={100} w={1700} h={800} color="#FFE6B8" seed={8} size={6} />
      </Layer>
      <Layer depth={0}>
        <ClockFace x={1680} y={170} r={110} hours={hours} F={DUSK} />
        <Metric x={120} y={230} value="10:15 a.m." /* #5 #2 */ size={96} color={DUSK.text} />
        <Pill x={120} y={286} text="BIGGEST JUMP" /* #5 */ fill={pillFill(DUSK)} color={DUSK.text} dot={L13_COLORS.saffron} size={20} />
      </Layer>
    </Stage>
  );
};

// 5-16 · petrol: the dB gauge slides in beside the strip; its readout spins and lands on the vermilion "?" (F3)
const ShotUnknown: ShotFC<CL05> = ({ f, len }) => {
  const slide = sm(f, 0, 16);
  const landed = f >= 44;
  return (
    <Stage theme={PETROL.theme} cam={cam(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 940, y: 540, zoom: 1.04 }])} vignette={0.24} grain={0.5}>
      <Layer depth={0.05}>
        <Sky family={PETROL} />
        <Bloom x={1400} y={160} r={360} color={PETROL.light} strength={0.35} spread={0.5} />
      </Layer>
      <Layer depth={0.8}>
        <g opacity={0.9}>
          <Strip f={f + 60} x={560} y={330} w={1000} h={260} speed={3} spikes={bataviaSpikes(-80, 12)} scale={150} />
        </g>
      </Layer>
      <Layer depth={1.2}>
        <Motes frame={f} n={18} x={100} y={100} w={1700} h={800} color={PETROL.light} seed={12} size={6} />
      </Layer>
      <Layer depth={1}>
        <Tick x={400} y={1010} pxPerM={330} frame={f} facing={1} pose="wave" expression="thinking" headTilt={landed ? -8 : 0} look={0.6} />
      </Layer>
      <Layer depth={0}>
        <Pill x={120} y={130} text="KRAKATOA · dB ?" /* #23 · F3 */ fill={pillFill(PETROL)} color={PETROL.text} dot={P.vermilion} size={24} />
        <L13Gauge family={PETROL} x={lerp(2160, 1760, slide)} value={100} spin={landed ? 0 : 1} unknown={landed} fill={false} frame={f} ceiling={{ v: DB.ceiling /* #11, unlabelled beside Krakatoa (F3) */ }} labelled={false} />
      </Layer>
    </Stage>
  );
};

// 5-17 · "not the strangest thing": behind Tick the strip lengthens and wraps around a globe sliding in from the right;
// ZoomThrough into the globe → l06's 6-01
const WrapBody: React.FC<{ f: number }> = ({ f }) => {
  const gx = lerp(2500, 1300, sm(f, 2, 40));
  const g = { cx: gx, cy: 520, R: 340, rot: 60 + f * 0.6, tilt: 10 };
  const rev = clamp01((f - 8) / 56);
  const ribbon = `M120 420 C 500 300, ${gx - 700} 220, ${gx - 380} 470 A ${g.R + 40} ${(g.R + 40) * 0.32} 0 1 0 ${gx + 380} 470 A ${g.R + 40} ${(g.R + 40) * 0.32} 0 0 0 ${gx - 300} 560`;
  const turn = sm(f, 6, 18);
  return (
    <Stage theme={PETROL.theme} cam={cameraAt(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: 120, x: 1000, y: 540, zoom: 1.04 }])} vignette={0.24} grain={0.5}>
      <Layer depth={0.05}>
        <Sky family={PETROL} />
        <Stars frame={f} n={100} w={1920} h={1080} color={PETROL.text} seed={14} size={1.4} twinkle={0.7} />
        <Bloom x={gx - 200} y={300} r={600} color={L13_COLORS.gold} strength={0.3} spread={0.4} />
      </Layer>
      <Layer depth={1}>
        <GlobeL13 {...g} family={PETROL} schematic={false} />
        <path d={ribbon} pathLength={1000} fill="none" stroke="#F7EBCF" strokeWidth={44} strokeLinecap="round" strokeDasharray={`${(rev * 1000).toFixed(1)} 1000`} />
        <path d={ribbon} pathLength={1000} fill="none" stroke="#C9A97A" strokeWidth={12} strokeLinecap="round" strokeDasharray={`${(rev * 1000).toFixed(1)} 1000`} />
      </Layer>
      <Layer depth={1}>
        <Tick x={420} y={1010} pxPerM={300} frame={f} facing={turn > 0.5 ? 1 : -1} pose="stand" expression={turn > 0.5 ? "surprised" : "thinking"} headTilt={turn * -10} look={0.7} />
      </Layer>
    </Stage>
  );
};
const ShotWrap: ShotFC<CL05> = ({ f, len }) => {
  const zt = clamp01((f - (len - 24)) / 24);
  if (zt <= 0) return <WrapBody f={f} />;
  return (
    <ZoomThrough
      t={zt}
      focal={{ x: 1300, y: 520 }}
      from={<WrapBody f={f} />}
      to={
        <Stage theme={VOID.theme} drift={false} vignette={0.2} grain={0.5}>
          <Layer depth={0}>
            <Sky family={VOID} />
            <Bloom x={300} y={300} r={900} color={L13_COLORS.gold} strength={0.35} spread={0.4} />
            <GlobeL13 cx={960} cy={540} R={420} rot={62} tilt={8} family={VOID} schematic={false} />
          </Layer>
        </Stage>
      }
    />
  );
};

export const SceneL05: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL05(t);
  const shots: ShotDef<CL05>[] = [
    { from: 0, S: ShotStrait, id: "5-01" },
    { from: c.cone, S: ShotCone, id: "5-02" },
    { from: c.clock, S: ShotClock, id: "5-03" },
    { from: c.coast, S: ShotCoast, id: "5-04" },
    { from: c.sound, S: ShotSound, id: "5-05" },
    { from: c.desk, S: ShotDesk, id: "5-06" },
    { from: c.perth, S: ShotPerth, id: "5-07" },
    { from: c.rodri, S: ShotRodri, id: "5-09" },
    { from: c.globe, S: ShotGlobe, id: "5-10" },
    { from: c.slices, S: ShotSlices, id: "5-11" },
    { from: c.gas, S: ShotGasworks, id: "5-12" },
    { from: c.drum, S: ShotDrum, id: "5-13" },
    { from: c.spikes, S: ShotSpikes, id: "5-14" },
    { from: c.biggest, S: ShotBiggest, id: "5-15" },
    { from: c.unknown, S: ShotUnknown, id: "5-16" },
    { from: c.wrap, S: ShotWrap, id: "5-17" },
  ];
  return playShots(f, shots, c, t.frames);
};

export const soundL05 = (t: SceneTiming): Cue[] => {
  const c = cuesL05(t);
  const sp = bataviaSpikes(12, 5);
  return [
    { at: 0, file: SFX.wind, vol: 0.16, dur: c.clock, fadeIn: 14, fadeOut: 12 },
    ...cutHit(c.cone),
    { at: c.cone + 4, file: SFX.pop, vol: 0.24, dur: 20 },
    { at: c.cone + 14, file: SFX.pop, vol: 0.24, dur: 20 },
    ...cutHit(c.clock),
    { at: c.clock + 12, file: SFX.click, vol: 0.2, dur: 12 },
    { at: c.blast, file: SFX.boom, vol: 0.36, dur: 120, fadeOut: 40 },
    // 5-04: music only, SFX out (F15)
    ...cutHit(c.sound),
    { at: c.sound + 6, file: SFX.chime, vol: 0.24, dur: 60 },
    ...cutHit(c.desk),
    { at: c.desk + 10, file: SFX.popLong, vol: 0.3, dur: 30 },
    ...[14, 21, 28, 35, 42, 49].map((o) => ({ at: c.desk + o, file: SFX.click, vol: 0.14, dur: 10 })),
    { at: c.perth - 20, file: SFX.deepWhoosh, vol: 0.24, dur: 50 },
    { at: c.perth + 28, file: SFX.pop, vol: 0.24, dur: 20 },
    { at: c.ceylon + 8, file: SFX.pop, vol: 0.24, dur: 20 },
    ...cutHit(c.rodri),
    { at: c.rodri + 34, file: SFX.popLong, vol: 0.3, dur: 30 },
    ...cutHit(c.globe),
    { at: c.globe + 4, file: SFX.swirl, vol: 0.22, dur: 50 },
    ...cutHit(c.slices),
    ...Array.from({ length: 13 }, (_, k) => ({ at: c.slices + k * 4, file: SFX.click, vol: 0.1, dur: 8 })),
    ...cutHit(c.gas),
    { at: c.gas, file: SFX.wind, vol: 0.12, dur: c.drum - c.gas, fadeIn: 8, fadeOut: 8 },
    ...cutHit(c.drum),
    ...[0, 20, 40, 60, 80].map((o) => ({ at: c.drum + 6 + o, file: SFX.click, vol: 0.1, dur: 10 })),
    ...cutHit(c.spikes),
    ...sp.map((s) => ({ at: c.spikes + Math.round(s.at), file: SFX.pop, vol: 0.18 + 0.12 * s.h, dur: 16 })),
    ...cutHit(c.biggest),
    { at: c.biggest + 24, file: SFX.chime, vol: 0.28, dur: 60 },
    ...cutHit(c.unknown),
    ...[16, 22, 28, 34, 40].map((o) => ({ at: c.unknown + o, file: SFX.click, vol: 0.12, dur: 8 })),
    { at: c.unknown + 44, file: SFX.pop, vol: 0.3, dur: 20 },
    ...cutHit(c.wrap),
    { at: c.end - 30, file: SFX.deepWhoosh, vol: 0.3, dur: 60 },
  ];
};
