// L14 scene l08 "The ending nobody draws" (storyboard §3 "8 ·": shots 8-01…8-24, script lines 64-71, petrol tunnel →
// STUDIO_SET → dusk cut-away and night hatch → noon airliner → STUDIO_SET plates, Act III). Shot components (hard cuts;
// continuous rows are phases): 8-01+8-02 (a rail draws down the wall; the capsule scrapes it, the energy bar drains) ·
// 8-03 (three contact points pop in; Tick ticks them off on its corner card) · 8-04 (marker posts flash by, the tank loses
// a notch per post) · 8-05 (a huge pull arrow next to a tiny friction arrow) · 8-06 (coins into a jar) · 8-07 (drops fall
// off the energy bar along the tunnel laid flat) · 8-08+8-09 (the probe turns back short of the far end; the swing chart
// draws, SCHEMATIC) · 8-10+8-11 (the swing dies at the centre; SPEED to zero) · 8-12+8-13 (Tick on the hatch rim at night,
// the "?" where the exit should be; pull back over the desert) · 8-14+8-15 (split: jet vs tunnel; the clock and the
// distance bar, NO numbers) · 8-16+8-17 (the bars race; the friction slider squeezes under the limit) · 8-18+8-19 (the
// capsule threads a slit; the walls close; Tick "so-so") · 8-20…8-22 (42 MIN crossed out; plates: 38 MIN, 1.8 YEARS) ·
// 8-23+8-24 (plate 3; the plates slide together, the cyc dims).
// Numbers drawn, each with its sources.md row: 42 MIN (#1 #2) · 38 MIN (#1) · 1.8 YEARS (#9, F6; the voice says "nearly
// two years"). V10 NOT verified: 8-15 shows the clock hand and the distance bar with NO number (no 21 h, no 20,000 km).
// F12: the swing chart has no axes and no friction value; SCHEMATIC once. F13: the traveller is the probe; Tick never in
// the tunnel (its card sits in the corner, outside the wall).
import React from "react";
import { useCurrentFrame } from "remotion";
import { Bloom, CloudRack, Embers, IF2, Kicker, Layer, Motes, Sky, Stage, Stars, Tick, UnknownTag, alpha, cameraAt, mixHex, rnd } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { L14Gauges } from "../L14Gauges";
import { L14_STRATA, StrataWall } from "../tunnel";
import { CutGlobe, oscillate } from "../cutglobe";
import { ClockFace, HatchLid, Jet, Plate, Probe, Sparks } from "../props";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { Arrow, C, CREAM, Cross, DUSK, Desert, INK, NOON, PETROL, Pop, STUDIO, Slab, StudioRoom, Tag, clamp01, ez } from "./Cold";

const P = PETROL;
const S = STUDIO;
const N = NOON;
const D = DUSK;

export const cuesL08 = (t: SceneTiming) => {
  const { at, p, end } = cueKit(t);
  return {
    rail: 0, // 8-01
    wall: p(0, "Now give it a wall"), // 8-02 (phase)
    vehicle: p(0, "A real vehicle"), // 8-03
    rails: p(0, "rails,"),
    guides: p(0, "guides,"),
    sides: p(0, "the sides"),
    contact: p(0, "That contact"), // 8-04
    small: at(1), // 8-05
    matter: p(1, "It doesn't matter"), // 8-06
    losses: p(1, "small losses add up"), // 8-07
    swing: at(2), // 8-08
    swings: p(2, "It swings back"), // 8-09 (phase)
    rest: p(2, "and ends up resting"), // 8-10
    report: at(3), // 8-12
    never: p(3, "you'd never make it"), // 8-13 (phase)
    airliner: at(4), // 8-14
    jet: p(4, "A long jet flight"), // 8-15 (phase)
    wins: p(4, "The tunnel only wins"), // 8-16
    tight: p(4, "below a tight limit"), // 8-17 (phase)
    shortcut: at(5), // 8-18
    honest: at(6), // 8-20
    perfect: p(6, "In a perfect tunnel"), // 8-21 (phase)
    air: p(6, "In a tunnel with air"), // 8-22 (phase)
    friction: at(7), // 8-23
    end7: end(7),
    end: t.frames,
  };
};
export type CL08 = ReturnType<typeof cuesL08>;

// ---------------------------------------------------------------------------------------------------------------
// the petrol tunnel with a rail on its right wall (cx = slot centre)
// ---------------------------------------------------------------------------------------------------------------
const RailTunnel: React.FC<{ f: number; scroll: number; cx?: number; gap?: number; railTo?: number; probeY?: number | null; probeSize?: number; scrape?: number; seed?: number; children?: React.ReactNode }> = ({ f, scroll, cx = 620, gap = 320, railTo = 1200, probeY = 470, probeSize = 150, scrape = 0, seed = 1, children }) => {
  const rx = cx + gap / 2 - 26;
  const off = scroll % 60;
  return (
    <g>
      <rect x={-300} y={-300} width={2600} height={1700} fill={P.sky[0]} />
      <StrataWall f={f} family={P} layers={L14_STRATA} depth={800} pxPerKm={1.2} scroll={scroll} cx={cx} gap={gap} x0={-200} x1={1440} lamp={probeY != null ? { y: probeY } : null} />
      <Bloom x={cx + 420} y={60} r={360} color={P.light} core={0} strength={0.35} />
      {/* the rail: a saffron strip with ties, drawn down to railTo, then streaming with the rock */}
      <g>
        <rect x={rx - 9} y={-20} width={18} height={Math.max(0, railTo + 20)} fill={C.saffron} />
        {Array.from({ length: 22 }, (_, i) => {
          const y = i * 60 - off;
          return y < railTo ? <rect key={i} x={rx - 22} y={y} width={44} height={10} rx={3} fill={C.saffronDeep} /> : null;
        })}
        {railTo < 1080 ? <circle cx={rx} cy={railTo} r={16} fill={C.saffronCore} stroke={CREAM} strokeWidth={4} /> : null}
      </g>
      {probeY != null ? <Probe x={cx + 40 * scrape} y={probeY} size={probeSize} f={f} variant={scrape > 0 ? "scrape" : "plain"} side={1} amount={scrape} /> : null}
      {children}
      <Motes frame={f} n={18} x={-200} y={0} w={1640} h={1080} color={alpha(C.bone, 0.7)} seed={seed + 3} size={4.5} drift={40} />
    </g>
  );
};

/** A horizontal energy bar (saffron) draining: k 1 = full. No numbers. */
const EnergyBar: React.FC<{ x: number; y: number; w: number; k: number; h?: number }> = ({ x, y, w, k, h = 40 }) => (
  <g>
    <rect x={x - 6} y={y - 6} width={w + 12} height={h + 12} rx={(h + 12) / 2} fill={alpha(INK, 0.75)} />
    <rect x={x} y={y} width={Math.max(0, w * clamp01(k))} height={h} rx={h / 2} fill={C.saffron} />
    <rect x={x} y={y} width={Math.max(0, w * clamp01(k))} height={h * 0.35} rx={h * 0.17} fill={C.saffronCore} opacity={0.6} />
  </g>
);

// ===============================================================================================================
// 8-01 + 8-02 · petrol tunnel: a rail strip draws down the wall (head 30 px/f) beside the falling probe; at "Now give it
// a wall" the camera pushes in, the capsule leans onto the rail and sparks, an energy bar drains. MOVER: the rail's
// drawing head + the strata streaming (14 px/f), then sparks + the bar draining.
// ===============================================================================================================
const ShotRail: ShotFC<CL08> = ({ f, len, c }) => {
  const w = c.wall - c.rail;
  const scrape = ez(f, w, w + 14);
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 540, zoom: 1.0 },
    { f: w, x: 880, y: 540, zoom: 1.04 },
    { f: len, x: 720, y: 500, zoom: 1.3 },
  ]);
  return (
    <Stage theme={P.theme} cam={cam} vignette={0.25} grain={0.5}>
      <Layer depth={1}>
        <RailTunnel f={f} scroll={f * 14} railTo={-20 + f * 30} scrape={scrape} />
      </Layer>
      <Layer depth={0}>
        <Kicker x={120} y={130} text="THE ENDING NOBODY DRAWS" color={P.text} size={30} />
        <g opacity={scrape}>
          <EnergyBar x={1100} y={800} w={600} k={1 - 0.35 * ez(f, w + 6, len)} />
          <Tag x={1100} y={740} text="CONTACT TAKES ENERGY" F={P} dot={C.saffron} size={30} />
        </g>
      </Layer>
    </Stage>
  );
};

// ===============================================================================================================
// 8-03 · close on the capsule against the rail: three contact points pop in on "rails", "guides", "the sides"; Tick
// ticks them off on a card in the corner (outside the tunnel). MOVER: the walls streaming (16 px/f) + the pop-ins.
// ===============================================================================================================
const ShotContacts: ShotFC<CL08> = ({ f, c }) => {
  const hits = [c.rails, c.guides, c.sides].map((h) => h - c.vehicle);
  const pts: [number, number][] = [
    [728, 390],
    [512, 450],
    [512, 610],
  ];
  return (
    <Pop f={f}>
      <Stage theme={P.theme} shotFrame={f} drift={{ zoom: 1.05, frames: 200, seed: 31 }} vignette={0.25} grain={0.5}>
        <Layer depth={1}>
          <RailTunnel f={f + 90} scroll={1300 + f * 16} cx={620} gap={560} probeY={null}>
            <Probe x={620 + Math.sin(f / 9) * 8} y={500} size={460} f={f} variant="scrape" side={1} amount={0.6} lamp={false} />
            {pts.map(([x, y], i) => {
              const k = clamp01((f - hits[i]) / 6);
              if (k <= 0) return null;
              return (
                <g key={i} transform={`translate(${x} ${y}) scale(${(k * (1 + 0.25 * Math.sin(k * Math.PI))).toFixed(3)})`}>
                  <circle r={44} fill={C.saffron} stroke={CREAM} strokeWidth={8} />
                  <circle r={16} fill={CREAM} />
                </g>
              );
            })}
          </RailTunnel>
        </Layer>
        <Layer depth={0}>
          <Tag x={120} y={150} text="RAILS · GUIDES · SIDES" F={P} dot={C.saffron} size={30} />
          {/* Tick's corner card (the studio, outside the tunnel) */}
          <rect x={1460} y={560} width={400} height={360} rx={30} fill={S.sky[1]} stroke={CREAM} strokeWidth={5} />
          <rect x={1460} y={840} width={400} height={80} rx={30} fill={S.mid} />
          {[0, 1, 2].map((i) => {
            const k = clamp01((f - hits[i] - 4) / 6);
            return (
              <g key={i}>
                <rect x={1700} y={600 + i * 74} width={56} height={56} rx={10} fill={alpha(INK, 0.7)} stroke={CREAM} strokeWidth={4} />
                {k > 0 ? <path d={`M${1710} ${628 + i * 74} L${1726} ${644 + i * 74} L${1712 + 36 * k} ${614 + i * 74 - 10 * k}`} stroke={C.saffron} strokeWidth={9} fill="none" strokeLinecap="round" /> : null}
              </g>
            );
          })}
          <Tick x={1580} y={850} pxPerM={150} frame={f} facing={1} pose="point" expression="determined" look={0.4} headTilt={Math.sin(f / 7) * 5} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 8-04 · marker posts flash by along the wall (20 px/f); the energy tank loses a notch for each pair of posts. MOVER:
// the posts + the strata streaming + notches vanishing.
// ===============================================================================================================
const ShotTank: ShotFC<CL08> = ({ f }) => {
  const scroll = 2600 + f * 20;
  const gone = Math.min(8, Math.floor(f / 16));
  return (
    <Pop f={f}>
      <Stage theme={P.theme} shotFrame={f} drift={{ zoom: 1.04, frames: 200, seed: 33 }} vignette={0.25} grain={0.5}>
        <Layer depth={1}>
          <RailTunnel f={f + 200} scroll={scroll} probeY={470} scrape={0.5}>
            {Array.from({ length: 8 }, (_, i) => {
              const y = i * 160 - (scroll % 160);
              return (
                <g key={i}>
                  <rect x={300} y={y} width={120} height={26} rx={8} fill={C.saffron} stroke={INK} strokeWidth={4} />
                  <rect x={820} y={y + 80} width={120} height={26} rx={8} fill={C.saffron} stroke={INK} strokeWidth={4} />
                </g>
              );
            })}
          </RailTunnel>
        </Layer>
        <Layer depth={0}>
          <rect x={1520} y={180} width={200} height={640} rx={40} fill={alpha(INK, 0.8)} stroke={CREAM} strokeWidth={6} />
          {Array.from({ length: 10 }, (_, i) => {
            const lost = i < gone; // the top notch goes first, one per pair of posts
            const fade = lost ? clamp01(1 - (f - (i + 1) * 16) / 8) : 1;
            return <rect key={i} x={1546} y={206 + i * 60} width={148} height={46} rx={10} fill={C.saffron} opacity={fade} transform={lost ? `translate(${((1 - fade) * 60).toFixed(1)} 0)` : undefined} />;
          })}
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 8-05 · STUDIO_SET: a huge pull arrow throbbing beside a tiny friction arrow on the probe; Tick pinches "tiny". MOVER:
// the pull arrow throbbing (±30 px, ≈ 4 px/f) + the tiny arrow flicking + CycClouds.
// ===============================================================================================================
const ShotTiny: ShotFC<CL08> = ({ f }) => {
  const th = Math.sin(f / 7.5) * 30;
  const fl = Math.sin(f / 2.2) * 8;
  return (
    <Pop f={f}>
      <Stage theme={S.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.01, frames: 200, seed: 35 }} vignette={0.16} grain={0.6}>
        <StudioRoom f={f + 800} seed={22} hud={<Tag x={120} y={150} text="SMALL NEXT TO THE EARTH'S PULL" F={S} dot={C.saffron} size={30} />}>
          <Probe x={620} y={300} size={200} f={f} lamp={false} />
          <Arrow x1={620} y1={420} x2={620} y2={800 + th} color={C.saffron} w={64} head={120} />
          <Arrow x1={760} y1={330} x2={760} y2={300 - 40 - fl} color={CREAM} w={10} head={24} />
          <Tick x={1120} y={860} pxPerM={180} frame={f} facing={-1} pose="point" expression="happy" look={0.5} headTilt={8} />
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 8-06 · coins drop one by one into a jar and it fills. MOVER: coins falling (≈ 20 px/f) + the fill rising.
// ===============================================================================================================
const ShotCoins: ShotFC<CL08> = ({ f, len }) => {
  const JX = 760;
  const JB = 820;
  const JW = 340;
  const JH = 440;
  const fill = 30 + 300 * ez(f, 0, len + 10);
  return (
    <Pop f={f}>
      <Stage theme={S.theme} shotFrame={f} drift={{ zoom: 1.05, frames: 200, seed: 37 }} vignette={0.16} grain={0.6}>
        <StudioRoom f={f + 900} seed={26} hud={<Tag x={120} y={150} text="SMALL LOSSES ADD UP" F={S} dot={C.saffron} size={30} />}>
          <rect x={JX - JW / 2} y={JB - fill} width={JW} height={fill} fill={C.saffron} />
          {Array.from({ length: Math.floor(fill / 22) }, (_, i) => (
            <ellipse key={i} cx={JX - JW / 2 + 40 + ((i * 97) % (JW - 80))} cy={JB - 12 - i * 22} rx={34} ry={10} fill={C.saffronDeep} opacity={0.6} />
          ))}
          {Array.from({ length: 8 }, (_, i) => {
            const age = (f + i * 9) % 72;
            const y = 40 + age * age * 0.28;
            if (y > JB - fill) return null;
            return (
              <g key={i} transform={`translate(${JX - 60 + (i % 3) * 60} ${y}) rotate(${age * 8})`}>
                <ellipse rx={30} ry={30 * Math.abs(Math.cos(age / 5))} fill={C.saffronCore} stroke={C.saffronDeep} strokeWidth={5} />
              </g>
            );
          })}
          <rect x={JX - JW / 2 - 12} y={JB - JH} width={JW + 24} height={JH + 12} rx={40} fill={alpha(C.ice, 0.25)} stroke={C.ice} strokeWidth={10} />
          <rect x={JX - JW / 2 + 20} y={JB - JH + 30} width={22} height={JH - 80} rx={11} fill={CREAM} opacity={0.5} />
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 8-07 · the tunnel laid flat across the frame, layers to scale; the probe crosses it with its energy bar, drops fall
// off the bar every few frames. MOVER: drops falling (12 px/f) + the probe (8 px/f) + the bar draining.
// ===============================================================================================================
const ShotDrops: ShotFC<CL08> = ({ f, len }) => {
  const X0 = 120;
  const X1 = 1800;
  const TY = 640;
  const px = X0 + 160 + f * 8;
  const segs = L14_STRATA.filter((s) => s.to > 0).map((s) => ({ a: Math.max(0, s.from) / 12742, b: Math.min(12742, s.to) / 12742, c: s.color }));
  return (
    <Stage theme={S.theme} shotFrame={f} drift={{ zoom: 1.04, frames: 200, seed: 39 }} vignette={0.16} grain={0.6}>
      <StudioRoom f={f + 1000} seed={30}>
        {segs.map((s, i) => (
          <rect key={i} x={X0 + (X1 - X0) * s.a} y={TY} width={Math.max(8, (X1 - X0) * (s.b - s.a))} height={110} fill={s.c} />
        ))}
        <rect x={X0} y={TY + 40} width={X1 - X0} height={30} fill={alpha(INK, 0.55)} />
        {Array.from({ length: 35 }, (_, i) => (
          <line key={i} x1={X0 + i * 48} y1={TY + 110} x2={X0 + i * 48} y2={TY + (i % 5 ? 130 : 150)} stroke={INK} strokeWidth={i % 5 ? 3 : 5} />
        ))}
        <Probe x={px} y={TY + 55} size={90} f={f} tilt={-90} lamp={false} />
        <EnergyBar x={px - 120} y={TY - 120} w={240} k={1 - 0.6 * ez(f, 0, len)} h={30} />
        {Array.from({ length: 10 }, (_, i) => {
          const born = i * 9;
          const age = f - born;
          if (age < 0 || age > 30) return null;
          const bx = X0 + 160 + born * 8 - 120 + 240 * (1 - 0.6 * ez(born, 0, len));
          return <ellipse key={i} cx={bx} cy={TY - 80 + age * 12} rx={12} ry={18} fill={C.saffron} stroke={C.saffronDeep} strokeWidth={3} opacity={1 - age / 34} />;
        })}
      </StudioRoom>
    </Stage>
  );
};

// ===============================================================================================================
// 8-08 + 8-09 · dusk: the cut-away; the probe swings almost to the far side and turns back short of the exit, each swing
// a little shorter; at "It swings back" a swing chart draws beside it (schematic, no axes, F12). MOVER: the probe
// (≈ 14 px/f peak) + the chart's head (12 px/f).
// ===============================================================================================================
const DAMP = 0.12;
const ShotSwing: ShotFC<CL08> = ({ f, c }) => {
  const sw = c.swings - c.swing;
  const trips = f / 85;
  const u = oscillate(trips, DAMP);
  const gx = 560;
  const gy = 540;
  const R = 380;
  const k = f - sw;
  const CX0 = 1060;
  const CW = 760;
  const head = clamp01((k * 12) / CW);
  const chartPts = Array.from({ length: 81 }, (_, i) => (i / 80) * head);
  // chart: amplitude per frame of the same swing, time running right (one chart width = 4 trips)
  const cd = chartPts.map((h, i) => `${i ? "L" : "M"}${(CX0 + CW * h).toFixed(1)} ${(560 + 190 * oscillate(Math.max(0, h * 4 + trips - head * 4), DAMP)).toFixed(1)}`).join(" ");
  return (
    <Pop f={f}>
      <Stage theme={D.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.01, frames: 240, seed: 41 }} vignette={0.25} grain={0.5}>
        <Layer depth={1}>
          <Sky family={D} />
          <Stars frame={f} n={80} w={1920} h={1080} color={D.text} seed={43} size={2.2} twinkle={0.7} />
          <Bloom x={gx + 260} y={gy - 200} r={700} color={D.light} core={0} strength={0.3} />
          <CutGlobe cx={gx} cy={gy} R={R} f={f} family={D} probe={u} trail={0.25} line={{ from: -1, to: 1 }} />
          <circle cx={gx} cy={gy + R} r={30 + Math.sin(f / 5) * 5} fill="none" stroke={C.saffron} strokeWidth={6} />
          {k > 0 ? (
            <g>
              <rect x={CX0 - 30} y={320} width={CW + 60} height={480} rx={26} fill={alpha(D.shadow, 0.55)} />
              <line x1={CX0} y1={560} x2={CX0 + CW} y2={560} stroke={alpha(CREAM, 0.5)} strokeWidth={3} strokeDasharray="10 10" />
              <path d={cd} stroke={C.saffron} strokeWidth={9} fill="none" strokeLinecap="round" />
              <circle cx={CX0 + CW * head} cy={560 + 190 * u} r={14} fill={C.probe} stroke={CREAM} strokeWidth={4} />
            </g>
          ) : null}
        </Layer>
        <Layer depth={0}>
          {k <= 0 ? <Tag x={1060} y={200} text="NEVER REACHES THE FAR END" F={D} dot={C.saffron} size={30} /> : <Tag x={1060} y={260} text="SCHEMATIC" F={D} dot={C.saffron} size={28} />}
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 8-10 + 8-11 · the swing dies down fast and the probe settles at the exact middle; rings spread from the centre; the
// SPEED needle falls to zero. MOVER: the amplitude shrinking (200 → 0 px, ≈ 20 px/f at first) + rings (6 px/f) + push.
// ===============================================================================================================
const ShotSettle: ShotFC<CL08> = ({ f, len }) => {
  const gx = 760;
  const gy = 540;
  const R = 440;
  const amp = 0.45 * Math.exp(-f / 22);
  const u = amp * Math.sin((f / 30) * Math.PI);
  const sp = Math.abs(Math.cos((f / 30) * Math.PI)) * amp * 2;
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 540, zoom: 1.0 },
    { f: len, x: 820, y: 540, zoom: 1.3 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={D.theme} cam={cam} vignette={0.25} grain={0.5}>
        <Layer depth={1}>
          <Sky family={D} />
          <Stars frame={f} n={80} w={1920} h={1080} color={D.text} seed={45} size={2.2} twinkle={0.7} />
          <CutGlobe cx={gx} cy={gy} R={R} f={f} family={D} probe={u} rot={f * 0.9} />
          <g transform={`translate(${gx} ${gy})`}>
            {Array.from({ length: 4 }, (_, i) => {
              const age = f - 30 - i * 18;
              if (age <= 0) return null;
              const r = ((age * 6) % 300) + 20;
              return <circle key={i} r={r} fill="none" stroke={C.saffronCore} strokeWidth={6} opacity={0.8 * (1 - r / 320)} />;
            })}
          </g>
        </Layer>
        <Layer depth={0}>
          <Tag x={120} y={150} text="STOPS AT THE CENTRE" F={D} dot={C.saffron} size={30} />
          <L14Gauges family={D} frame={f} theme="light" speed={{ value: clamp01(sp * 1.6) }} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 8-12 + 8-13 · dusk night: Tick sits on the hatch rim looking down the dark tunnel; a big "?" hangs where the exit
// should be and rings out; at "you'd never make it" the camera pulls back over the desert. MOVER: the "?" rings (5 px/f)
// + wind streamers (9 px/f), then the pull-back (edges ≈ 6 px/f).
// ===============================================================================================================
const ShotNight: ShotFC<CL08> = ({ f, len, c }) => {
  const nv = c.never - c.report;
  const G = 560;
  const HX = 760;
  const cam = cameraAt(f, [
    { f: 0, x: 860, y: 560, zoom: 1.3 },
    { f: nv, x: 860, y: 560, zoom: 1.24 },
    { f: len, x: 960, y: 520, zoom: 0.92 },
  ]);
  const QY = 960;
  return (
    <Stage theme={D.theme} cam={cam} vignette={0.3} grain={0.5}>
      <Layer depth={1}>
        <Desert f={f} ground={G} deep={false} wind={9} seed={5}>
          {/* the cut-away below ground: crust ochre into the dark mantle, the slot down the middle */}
          <rect x={-300} y={G + 30} width={2600} height={1500} fill={mixHex(C.crustDeep, "#1A0604", 0.35)} />
          <rect x={-300} y={G + 200} width={2600} height={1400} fill={mixHex(C.mantleDeep, "#12080A", 0.45)} />
          <rect x={HX - 70} y={G + 10} width={140} height={1400} fill="#06141A" />
          <rect x={HX - 70} y={G + 10} width={10} height={1400} fill={alpha(D.light, 0.35)} />
          {Array.from({ length: 4 }, (_, i) => {
            const r = ((f * 5 + i * 60) % 240) + 20;
            return <circle key={i} cx={HX} cy={QY} r={r} fill="none" stroke={C.saffron} strokeWidth={7} opacity={0.85 * (1 - r / 260)} />;
          })}
          <UnknownTag x={HX} y={QY} size={52} />
          <HatchLid x={HX} y={G + 8} r={90} open={1} family={D} />
          <Tick x={HX - 96} y={G + 4} pxPerM={90} frame={f} facing={1} pose="sit" expression="thinking" look={0.3} headTilt={-18 + Math.sin(f / 20) * 4} />
        </Desert>
      </Layer>
      <Layer depth={0}>
        <Tag x={120} y={150} text="AS ONE REPORT PUT IT" F={D} dot={C.vermilion} size={30} />
      </Layer>
    </Stage>
  );
};

// ===============================================================================================================
// 8-14 + 8-15 · noon split screen: left, an airliner crossing the planet's arc; right, the tunnel's swinging capsule. At
// "A long jet flight" a clock hand sweeps and a distance bar grows under the jet (V10 not verified: NO numbers). MOVER:
// the jet (16 px/f) + the capsule swinging + CloudRack, then the clock hand and the bar.
// ===============================================================================================================
const ShotSplit: ShotFC<CL08> = ({ f, len, c }) => {
  const jt = c.jet - c.airliner;
  const k = f - jt;
  const ang = -110 + (40 * f) / Math.max(1, len); // the jet crosses the left panel over the whole shot
  const PCX = 480;
  const PCY = 1700;
  const PR = 1400;
  const ar = (ang * Math.PI) / 180;
  const jx = PCX + Math.cos(ar) * (PR + 120);
  const jy = PCY + Math.sin(ar) * (PR + 120);
  const barK = clamp01(k / 120);
  return (
    <Pop f={f}>
      <Stage theme={N.theme} shotFrame={f} drift={{ zoom: 1.03, frames: 240, seed: 47 }} vignette={0.14} grain={0.5}>
        <Layer depth={1}>
          <clipPath id="sl814">
            <rect x={0} y={0} width={955} height={1080} />
          </clipPath>
          <clipPath id="sr814">
            <rect x={965} y={0} width={955} height={1080} />
          </clipPath>
          <g clipPath="url(#sl814)">
            <Sky family={N} />
            <CloudRack f={f} n={5} x0={-400} x1={1300} y0={120} y1={420} size={70} speed={3} body="#FFFFFF" under={alpha(N.shadow, 0.25)} top="#FFFFFF" seed={7} />
            <circle cx={PCX} cy={PCY} r={PR + 40} fill={alpha(C.teal, 0.35)} />
            <circle cx={PCX} cy={PCY} r={PR} fill={C.crust} />
            <circle cx={PCX} cy={PCY} r={PR - 60} fill={C.mantle} />
            <path d={`M${PCX + Math.cos(-150 * Math.PI / 180) * (PR + 120)} ${PCY + Math.sin(-150 * Math.PI / 180) * (PR + 120)} A ${PR + 120} ${PR + 120} 0 0 1 ${jx} ${jy}`} stroke={CREAM} strokeWidth={6} strokeDasharray="4 16" fill="none" strokeLinecap="round" />
            <g transform={`translate(${jx} ${jy}) rotate(${ang + 90})`}>
              <Jet x={0} y={0} len={200} f={f} trail={1} speed={10} />
            </g>
            {k > 0 ? (
              <g>
                <ClockFace x={640} y={620} r={130} minutes={k * 0.55} ring={clamp01(k / 100)} family={N} />
                <rect x={110} y={860} width={720} height={34} rx={17} fill={alpha(N.shadow, 0.6)} />
                <rect x={110} y={860} width={720 * barK} height={34} rx={17} fill={C.saffron} />
              </g>
            ) : null}
          </g>
          <g clipPath="url(#sr814)">
            <Sky family={N} />
            <CloudRack f={f + 50} n={4} x0={700} x1={2400} y0={100} y1={300} size={60} speed={3} body="#FFFFFF" under={alpha(N.shadow, 0.25)} top="#FFFFFF" seed={9} />
            <CutGlobe cx={1440} cy={600} R={300} f={f} family={N} probe={oscillate(f / 45)} line={{ from: -1, to: 1 }} />
          </g>
          <rect x={955} y={0} width={10} height={1080} fill={CREAM} />
        </Layer>
        <Layer depth={0}>
          <Tag x={960} y={110} text="TUNNEL VS AIRLINER" F={N} dot={C.saffron} size={32} align="middle" />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 8-16 + 8-17 · two bars race (JET teal, TUNNEL saffron); a friction slider must stay under a limit line; at "below a
// tight limit" the camera pushes on the slot under the line, the slider squeezes through it and Tick squints, worried.
// MOVER: the bars racing (14 px/f) + the slider, then the squeeze (8 px/f) + the push.
// ===============================================================================================================
const ShotLimit: ShotFC<CL08> = ({ f, len, c }) => {
  const tg = c.tight - c.wins;
  const jw = Math.min(900, 40 + f * 12);
  const tw = Math.min(1000, 40 + f * 14);
  const LIM = 700;
  const sx = 300 + (f > tg ? (f - tg) * 8 : Math.sin(f / 8) * 30);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: tg, x: 960, y: 560, zoom: 1.02 },
    { f: len, x: 1000, y: 680, zoom: 1.32 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={N.theme} cam={cam} vignette={0.14} grain={0.5}>
        <Layer depth={0.3}>
          <Sky family={N} />
          <CloudRack f={f} n={6} x0={-400} x1={2400} y0={80} y1={360} size={70} speed={3} body="#FFFFFF" under={alpha(N.shadow, 0.25)} top="#FFFFFF" seed={11} />
        </Layer>
        <Layer depth={1}>
          <rect x={-200} y={880} width={2400} height={400} fill={mixHex(N.mid, C.crust, 0.4)} />
          <rect x={200} y={300} width={jw} height={70} rx={35} fill={C.teal} />
          <rect x={200} y={420} width={tw} height={70} rx={35} fill={C.saffron} />
          <text x={236} y={348} style={{ fontFamily: IF2.label, fontSize: 36, letterSpacing: 4, fill: CREAM }}>JET</text>
          <text x={236} y={468} style={{ fontFamily: IF2.label, fontSize: 36, letterSpacing: 4, fill: INK }}>TUNNEL</text>
          {/* the friction track: a limit line, a thin gap under it, the slider below the line */}
          <rect x={160} y={LIM - 10} width={1200} height={140} rx={20} fill={alpha(N.shadow, 0.35)} />
          <line x1={160} y1={LIM} x2={1360} y2={LIM} stroke={C.saffron} strokeWidth={10} strokeDasharray="30 14" />
          <rect x={sx - 70} y={LIM + 24} width={140} height={70} rx={20} fill={CREAM} stroke={INK} strokeWidth={6} />
          <rect x={160} y={LIM + 110} width={1200} height={20} fill={INK} />
          <Tick x={1520} y={880} pxPerM={160} frame={f} facing={-1} pose="lean" expression={f > tg ? "worried" : "thinking"} look={0.5} headTilt={10} />
        </Layer>
        <Layer depth={0}>
          <Tag x={120} y={150} text="ONLY IF FRICTION STAYS LOW" F={N} dot={C.saffron} size={30} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 8-18 + 8-19 · the capsule threads a narrow slit between two rock blocks, sparks off both faces; once through, the blocks
// close behind it; Tick wobbles a hand, "so-so". MOVER: the capsule sliding (10 px/f) + sparks, then the walls closing
// (8 px/f).
// ===============================================================================================================
const ShotSlit: ShotFC<CL08> = ({ f, len }) => {
  const px = 140 + f * 10;
  const SX = 760;
  const through = px > SX + 220;
  const close = through ? Math.min(70, (px - SX - 220) * 0.8) : 0;
  const gap = 80 - close;
  const half = gap / 2;
  return (
    <Pop f={f}>
      <Stage theme={N.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.01, frames: len + 60, seed: 49 }} vignette={0.14} grain={0.5}>
        <Layer depth={0.3}>
          <Sky family={N} />
          <CloudRack f={f} n={5} x0={-400} x1={2400} y0={80} y1={330} size={70} speed={3} body="#FFFFFF" under={alpha(N.shadow, 0.25)} top="#FFFFFF" seed={13} />
        </Layer>
        <Layer depth={1}>
          <rect x={-200} y={880} width={2400} height={400} fill={mixHex(N.mid, C.crust, 0.4)} />
          <rect x={SX - 260} y={60} width={520} height={480 - half} rx={24} fill={C.mantle} stroke={C.mantleDeep} strokeWidth={8} />
          <rect x={SX - 260} y={540 + half} width={520} height={340 - half} rx={24} fill={C.mantle} stroke={C.mantleDeep} strokeWidth={8} />
          {Array.from({ length: 6 }, (_, i) => (
            <line key={i} x1={SX - 240 + i * 90} y1={80} x2={SX - 200 + i * 90} y2={520 - half} stroke={C.mantleDeep} strokeWidth={6} opacity={0.6} />
          ))}
          <Probe x={px} y={540} size={140} f={f} tilt={-90} lamp={false} />
          {px > SX - 300 && !through ? (
            <g>
              <Sparks x={px + 20} y={540 - 40} f={f} dir={-1} rate={1.2} size={150} />
              <Sparks x={px + 20} y={540 + 40} f={f + 5} dir={-1} rate={1.2} size={150} />
            </g>
          ) : null}
          <Embers frame={f} x0={SX - 200} x1={SX + 300} y={600} n={14} color={C.saffronCore} seed={3} size={5} />
          <Tick x={1560} y={880} pxPerM={170} frame={f} facing={-1} pose="shrug" expression={through ? "happy" : "thinking"} look={0.5} headTilt={Math.sin(f / 4) * 10} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 8-20 … 8-22 · STUDIO_SET: "42 MIN" slammed with a cross; three plate frames drop in; plate 1 (38 MIN, then a swing back)
// with its probe icon swinging; plate 2 (1.8 YEARS to the middle) with a calendar strip rolling. MOVER: the cross slam +
// the plates dropping, then the icon swinging (±130 px, ≈ 6 px/f), then the strip rolling (12 px/f).
// ===============================================================================================================
const PX = [380, 960, 1540];
const PY_ = 420;
const SwingIcon: React.FC<{ x: number; y: number; f: number; amp: number; period?: number; damp?: number }> = ({ x, y, f, amp, period = 70, damp = 0 }) => {
  const u = oscillate(f / (period / 2), damp);
  return (
    <g>
      <rect x={x - amp - 40} y={y - 8} width={2 * amp + 80} height={16} rx={8} fill={alpha(INK, 0.5)} />
      <circle cx={x} cy={y} r={12} fill={C.saffron} />
      <circle cx={x + u * amp} cy={y} r={30} fill={C.probe} stroke={CREAM} strokeWidth={6} />
    </g>
  );
};
const Calendar: React.FC<{ x: number; y: number; f: number }> = ({ x, y, f }) => {
  const off = (f * 12) % 90;
  return (
    <g>
      <clipPath id="cal822">
        <rect x={x - 200} y={y - 50} width={400} height={100} rx={16} />
      </clipPath>
      <rect x={x - 200} y={y - 50} width={400} height={100} rx={16} fill={CREAM} />
      <g clipPath="url(#cal822)">
        {Array.from({ length: 7 }, (_, i) => (
          <g key={i}>
            <rect x={x - 250 + i * 90 - off} y={y - 34} width={74} height={68} rx={8} fill={i % 2 ? C.teal : C.tealDeep} />
            <rect x={x - 250 + i * 90 - off} y={y - 34} width={74} height={16} rx={6} fill={C.saffron} />
          </g>
        ))}
      </g>
    </g>
  );
};
/** An honesty plate with its own two lines (title in the display face, sub in the label face at a phone-legible 30 px). */
const HPlate: React.FC<{ x: number; y: number; drop?: number; title?: string; sub?: string; k?: number }> = ({ x, y, drop = 1, title, sub, k = 1 }) => {
  const d = clamp01(drop);
  const fall = (1 - d * d) * -520;
  return (
    <g>
      <Plate x={x} y={y} w={540} h={210} text="" drop={d} />
      {title ? (
        <g transform={`translate(${x} ${(y + fall).toFixed(1)})`} opacity={Math.min(1, d * 4) * k}>
          <text x={0} y={2} textAnchor="middle" style={{ fontFamily: IF2.display, fontWeight: 800, fontSize: 38, fill: CREAM }}>
            {title}
          </text>
          <text x={0} y={60} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 30, letterSpacing: 2, fill: alpha(CREAM, 0.88) }}>
            {sub}
          </text>
        </g>
      ) : null}
    </g>
  );
};
const ShotHonest: ShotFC<CL08> = ({ f, c }) => {
  const p1 = c.perfect - c.honest;
  const p2 = c.air - c.honest;
  const cross = ez(f, 10, 22);
  const big = 1 - ez(f, 30, 48);
  const drops = [44, 56, 68].map((a) => clamp01((f - a) / 16));
  const ins = [p1, p2].map((a) => ez(f, a, a + 10));
  return (
    <Pop f={f}>
      <Stage theme={S.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.01, frames: 300, seed: 51 }} vignette={0.16} grain={0.6}>
        <StudioRoom
          f={f + 1100}
          seed={34}
          hud={
            <g>
              <Kicker x={120} y={130} text="THE HONEST ANSWER" color={INK} size={30} />
              {f >= p1 && f < p2 ? <Slab x={1380} y={200} value="38" unit="MIN" /* #1 */ size={110} F={S} opacity={ins[0]} /> : null}
              {f >= p2 ? <Slab x={1300} y={200} value="1.8" unit="YEARS" /* #9, F6 */ size={110} F={S} opacity={ins[1]} /> : null}
            </g>
          }
        >
          {big > 0 ? (
            <g opacity={big} transform={`translate(960 ${480 - (1 - big) * 120}) scale(${0.6 + 0.4 * big})`}>
              <text x={0} y={60} textAnchor="middle" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 220, fill: INK }}>
                42 MIN
              </text>
              {/* #1 #2 */}
              <Cross x={0} y={-10} s={170} k={cross} />
            </g>
          ) : null}
          {drops[0] > 0 ? <HPlate x={PX[0]} y={PY_} drop={drops[0]} title={ins[0] > 0 ? "A PERFECT TUNNEL" : undefined} sub="38 MIN, THEN A SWING BACK" /* #1 */ k={ins[0]} /> : null}
          {drops[1] > 0 ? <HPlate x={PX[1]} y={PY_} drop={drops[1]} title={ins[1] > 0 ? "A TUNNEL WITH AIR" : undefined} sub="1.8 YEARS TO THE MIDDLE" /* #9, F6 */ k={ins[1]} /> : null}
          {drops[2] > 0 ? <HPlate x={PX[2]} y={PY_} drop={drops[2]} /> : null}
          {f >= p1 ? <SwingIcon x={PX[0]} y={660} f={f - p1} amp={130} /> : null}
          {f >= p2 ? <Calendar x={PX[1]} y={660} f={f - p2} /> : null}
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 8-23 + 8-24 · plate 3 (friction: one way, then a stop) with a decaying swing; then the three plates slide together,
// Tick steps back, proud; the camera pulls back and the cyc dims. MOVER: the icons + the plates sliding (≈ 14 px/f).
// ===============================================================================================================
const ShotThree: ShotFC<CL08> = ({ f, len }) => {
  const sl = ez(f, 46, Math.min(len, 86));
  const xs = [960 + (PX[0] - 960) * (1 - 0.1 * sl), PX[1], 960 + (PX[2] - 960) * (1 - 0.1 * sl)];
  const lift = -150 * sl;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 520, zoom: 1.08 },
    { f: len, x: 960, y: 540, zoom: 0.96 },
  ]);
  const dim = ez(f, len - 40, len);
  const tk = ez(f, 40, 70);
  return (
    <Pop f={f}>
      <Stage theme={S.theme} cam={cam} vignette={0.16} grain={0.6} overlay={<div style={{ position: "absolute", inset: 0, background: `rgba(10,30,40,${(0.45 * dim).toFixed(3)})` }} />}>
        <StudioRoom f={f + 1300} seed={38}>
          <g transform={`translate(0 ${lift.toFixed(1)})`}>
          <HPlate x={xs[0]} y={PY_} title="A PERFECT TUNNEL" sub="38 MIN, THEN A SWING BACK" /* #1 */ />
          <HPlate x={xs[1]} y={PY_} title="A TUNNEL WITH AIR" sub="1.8 YEARS TO THE MIDDLE" /* #9, F6 */ />
          <HPlate x={xs[2]} y={PY_} drop={clamp01(f / 16)} title="A TUNNEL WITH FRICTION" sub="ONE WAY, THEN A STOP" /* #10 */ />
          <g transform={`translate(${xs[0] - PX[0]} 0)`}>
            <SwingIcon x={PX[0]} y={660} f={f + 60} amp={130} />
          </g>
          <g transform={`translate(${xs[1] - PX[1]} 0)`}>
            <Calendar x={PX[1]} y={660} f={f + 60} />
          </g>
          <g transform={`translate(${xs[2] - PX[2]} 0)`}>
            <SwingIcon x={PX[2]} y={660} f={f} amp={170} period={44} damp={0.35} />
          </g>
          </g>
          <Tick x={1720 + 100 * tk} y={860} pxPerM={150} frame={f} facing={-1} pose={tk > 0.5 ? "hips" : "stand"} walk={tk > 0 && tk < 1 ? -f / 18 : undefined} expression="proud" look={0.4} />
        </StudioRoom>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================

export const SceneL08: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL08(t);
  const shots: ShotDef<CL08>[] = [
    { from: 0, S: ShotRail, id: "8-01" }, // + 8-02
    { from: c.vehicle, S: ShotContacts, id: "8-03" },
    { from: c.contact, S: ShotTank, id: "8-04" },
    { from: c.small, S: ShotTiny, id: "8-05" },
    { from: c.matter, S: ShotCoins, id: "8-06" },
    { from: c.losses, S: ShotDrops, id: "8-07" },
    { from: c.swing, S: ShotSwing, id: "8-08" }, // + 8-09
    { from: c.rest, S: ShotSettle, id: "8-10" }, // + 8-11
    { from: c.report, S: ShotNight, id: "8-12" }, // + 8-13
    { from: c.airliner, S: ShotSplit, id: "8-14" }, // + 8-15
    { from: c.wins, S: ShotLimit, id: "8-16" }, // + 8-17
    { from: c.shortcut, S: ShotSlit, id: "8-18" }, // + 8-19
    { from: c.honest, S: ShotHonest, id: "8-20" }, // + 8-21, 8-22
    { from: c.friction, S: ShotThree, id: "8-23" }, // + 8-24
  ];
  return playShots(f, shots, c, t.frames);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL08 = (t: SceneTiming): Cue[] => {
  const c = cuesL08(t);
  return [
    ...Array.from({ length: 6 }, (_, i) => ({ at: 6 + i * 7, file: SFX.click, vol: 0.06, dur: 6 })),
    { at: c.wall + 6, file: SFX.debris, vol: 0.18, dur: c.vehicle - c.wall, fadeIn: 6, fadeOut: 10 },
    ...cutHit(c.vehicle),
    { at: c.rails, file: SFX.pop, vol: 0.2, dur: 14 },
    { at: c.guides, file: SFX.pop, vol: 0.2, dur: 14 },
    { at: c.sides, file: SFX.pop, vol: 0.2, dur: 14 },
    ...cutHit(c.contact),
    ...Array.from({ length: 8 }, (_, i) => ({ at: c.contact + 4 + i * 16, file: SFX.click, vol: 0.07, dur: 6 })),
    ...cutHit(c.small),
    { at: c.small + 8, file: SFX.pop, vol: 0.18, dur: 14 },
    ...cutHit(c.matter),
    ...Array.from({ length: 6 }, (_, i) => ({ at: c.matter + 20 + i * 9, file: SFX.pop, vol: 0.08, dur: 10 })),
    ...cutHit(c.losses),
    ...Array.from({ length: 6 }, (_, i) => ({ at: c.losses + 4 + i * 9, file: SFX.click, vol: 0.06, dur: 6 })),
    ...cutHit(c.swing),
    { at: c.swing + 80, file: SFX.popLong, vol: 0.2, dur: 30 },
    ...Array.from({ length: 6 }, (_, i) => ({ at: c.swings + i * 12, file: SFX.click, vol: 0.05, dur: 6 })),
    ...cutHit(c.rest),
    { at: c.rest + 40, file: SFX.popLong, vol: 0.2, dur: 30 },
    ...cutHit(c.report),
    { at: c.report + 6, file: SFX.pop, vol: 0.18, dur: 14 },
    { at: c.never, file: SFX.wind, vol: 0.16, dur: c.airliner - c.never, fadeIn: 10, fadeOut: 10 },
    ...cutHit(c.airliner),
    { at: c.airliner + 2, file: SFX.whoosh, vol: 0.22, dur: 40 },
    ...Array.from({ length: 8 }, (_, i) => ({ at: c.jet + 4 + i * 10, file: SFX.click, vol: 0.06, dur: 6 })),
    ...cutHit(c.wins),
    { at: c.wins + 6, file: SFX.click, vol: 0.12, dur: 8 },
    { at: c.tight, file: SFX.pop, vol: 0.18, dur: 14 },
    ...cutHit(c.shortcut),
    { at: c.shortcut + 4, file: SFX.whoosh, vol: 0.2, dur: 40 },
    { at: c.shortcut + 60, file: SFX.popLong, vol: 0.2, dur: 30 },
    ...cutHit(c.honest),
    { at: c.honest + 12, file: SFX.pop, vol: 0.22, dur: 14 },
    ...[44, 56, 68].map((a) => ({ at: c.honest + a + 14, file: SFX.pop, vol: 0.14, dur: 12 })),
    { at: c.perfect, file: SFX.click, vol: 0.12, dur: 8 },
    ...cutHit(c.air),
    ...Array.from({ length: 5 }, (_, i) => ({ at: c.air + 4 + i * 8, file: SFX.click, vol: 0.05, dur: 6 })),
    ...cutHit(c.friction),
    { at: c.friction + 14, file: SFX.click, vol: 0.12, dur: 8 },
    { at: c.friction + 50, file: SFX.swirl, vol: 0.16, dur: 50 },
  ];
};
