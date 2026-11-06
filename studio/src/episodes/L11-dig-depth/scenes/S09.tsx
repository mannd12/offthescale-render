// L11 scene l09 "The shortcut": fourteen bespoke shots keyed to the narration (script.md §9).
// Every number drawn is a row in episodes/L11-dig-depth/sources.md:
//   Moho averages about 40 km under continents, a few km under oceans (#29) · Mohole 1961, 3,800 m of water, 200 m of
//   sediment, 14 m of basalt, cancelled 1966 (#30) · Atlantis Massif 2023, 1,268 m, previous deepest about 200 m
//   (200.8 m), more than six times (#31).
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { SceneTiming } from "../../../lib/timeline";
import {
  BONE,
  CornerTicks,
  Flock,
  Gauge,
  Hatch,
  Layer,
  P,
  Stage,
  cameraAt,
  crawl,
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
import { C, Chapter, Dim, E, Land, SEA, SeaTop, ShotDef, ShotProps, Ship, Tag, lerp, playShots } from "./S08";

const OLD_M = 200.8; // #31
const NEW_M = 1268; // #31

const l09Cues = (t: SceneTiming) => {
  const at = (i: number) => t.lines[i].at;
  const p = (i: number, s: string, o = 0) => phraseAt(t, i, s, o);
  return {
    moho: p(0, "called the Moho"),
    seismic: p(0, "found by", -3),
    continents: p(0, "Under the continents", -3),
    forty: p(0, "forty"),
    oceans: at(1) - 6,
    americans: at(2) - 6,
    mohole: p(2, "Project Mohole"),
    water: p(2, "in three thousand", -3),
    bit: at(3) - 6,
    basalt: p(3, "fourteen"),
    funding: p(3, "Then the funding", -3),
    y1966: p(3, "1966"),
    y2023: at(4) - 6,
    massif: p(4, "At an undersea", -3),
    faults: p(4, "faults"),
    drilled: at(5) - 6,
    before: p(5, "The deepest hole", -3),
    six: at(6) - 6,
    so: at(7) - 6,
    came: p(7, "It came from", -3),
    end: t.frames,
  };
};
type K9 = ReturnType<typeof l09Cues>;
type SP = ShotProps<K9>;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const MANTLE = C.mantle;
const CRUST = tint(E.a, P.bone, 0.3);

/** Crust/mantle section, K px per km. Crust thins from `thick` km (continent, left) to `thin` km under a sea on the right. */
const CrustSection: React.FC<{ f: number; G: number; K: number; coast: number; thick?: number; thin?: number; mohoK?: number; idp: string }> = ({
  f,
  G,
  K,
  coast,
  thick = 40,
  thin = 6,
  mohoK = 1,
  idp,
}) => {
  const xs = Array.from({ length: 61 }, (_, i) => -900 + i * 70);
  const sea = (x: number) => G + interpolate(x, [coast, coast + 300], [0, 4 * K], clamp);
  const moho = (x: number) => G + interpolate(x, [coast - 100, coast + 500], [thick * K, (4 + thin) * K], clamp);
  const sp: [number, number][] = xs.map((x) => [x, sea(x)]);
  const mp: [number, number][] = xs.map((x) => [x, moho(x)]);
  const drawn = mp.filter((_, i) => i <= Math.round(60 * mohoK));
  return (
    <g>
      <rect x={-900} y={-900} width={4000} height={900 + G} fill={C.skyMid} />
      <rect x={-900} y={G} width={4000} height={2400} fill={MANTLE} />
      <Hatch id={`${idp}-m`} color={shade(MANTLE, 0.2)} gap={16} dots width={1.6} />
      <rect x={-900} y={G} width={4000} height={2400} fill={`url(#${idp}-m)`} />
      <path d={ptsToPath([...sp, ...[...mp].reverse()]) + " Z"} fill={CRUST} />
      <path d={ptsToPath([[coast, G], ...sp.filter((p) => p[0] > coast), [3100, G]]) + " Z"} fill={SEA} />
      {[0, 1].map((i) => (
        <line key={i} x1={coast + 200} y1={G + 8 + i * 16} x2={3100} y2={G + 8 + i * 16} stroke={lit(SEA, 0.4)} strokeWidth={2.5} strokeDasharray="40 30" strokeDashoffset={crawl(f, 0.5 + i * 0.3)} />
      ))}
      <rect x={-900} y={G - 22} width={coast + 900} height={22} fill={C.tundra} />
      <path d={ptsToPath(sp)} fill="none" stroke={P.ink} strokeWidth={2.5} />
      {drawn.length > 1 ? <path d={ptsToPath(drawn)} fill="none" stroke={P.ink} strokeWidth={3} strokeDasharray="14 9" strokeDashoffset={crawl(f, 0.8)} /> : null}
    </g>
  );
};

// Shot 1 - "a boundary called the Moho": a dashed line draws along the base of the crust
const ShotMoho: React.FC<SP> = ({ f, len, k }) => {
  const L = Math.max(len, 60);
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 440, zoom: 1.0 },
    { f: L, x: 860, y: 600, zoom: 1.1 },
  ]);
  const m = lerp(f, k.moho - 10, k.moho + 30, 0, 1);
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={1}>
        <CrustSection f={f} G={220} K={14} coast={1350} mohoK={m} idp="s9a" />
        <line x1={600} y1={220} x2={600} y2={220 + 12.262 * 14} stroke={C.hole} strokeWidth={4} />
        <Tag x={300} y={220 + 40 * 14 + 50} text="Moho" size={44} o={ramp(f, k.moho + 10, k.moho + 22)} />
      </Layer>
      <Layer depth={0}>
        <Chapter n="09" title="The shortcut" o={ramp(f, 0, 12) * (1 - ramp(f, k.moho - 6, k.moho + 6))} />
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 2 - "found by the way seismic waves change speed": wavefronts spread from a quake; they open out below the Moho
const ShotWaves: React.FC<SP> = ({ f, len }) => {
  const L = Math.max(len, 60);
  const G = 200;
  const MY = 640;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 520, zoom: 1.1 },
    { f: L, x: 960, y: 560, zoom: 1.0 },
  ]);
  const sx = 420;
  const sy = 330;
  const rings = Array.from({ length: 9 }, (_, i) => ((f * 3.2 + i * 70) % 630) + 10);
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={1}>
        <rect x={-900} y={-900} width={4000} height={900 + G} fill={C.skyMid} />
        <rect x={-900} y={G} width={4000} height={MY - G} fill={CRUST} />
        <rect x={-900} y={MY} width={4000} height={1400} fill={MANTLE} />
        <Hatch id="s9w-m" color={shade(MANTLE, 0.2)} gap={16} dots width={1.6} />
        <rect x={-900} y={MY} width={4000} height={1400} fill="url(#s9w-m)" />
        <rect x={-900} y={G - 22} width={4000} height={22} fill={C.tundra} />
        <line x1={-900} y1={G} x2={3100} y2={G} stroke={P.ink} strokeWidth={2.5} />
        <defs>
          <clipPath id="s9w-up">
            <rect x={-900} y={G} width={4000} height={MY - G} />
          </clipPath>
          <clipPath id="s9w-dn">
            <rect x={-900} y={MY} width={4000} height={1400} />
          </clipPath>
        </defs>
        {/* slower in the crust: tight rings; faster below: the same ring stretched wider */}
        <g clipPath="url(#s9w-up)" fill="none" stroke={mixHex(E.a, P.ink, 0.4)} strokeWidth={2.5}>
          {rings.map((r, i) => (
            <circle key={i} cx={sx} cy={sy} r={r} opacity={1 - r / 640} />
          ))}
        </g>
        <g clipPath="url(#s9w-dn)" fill="none" stroke={mixHex(E.a, P.ink, 0.55)} strokeWidth={2.5}>
          {rings.map((r, i) => (
            <ellipse key={i} cx={sx} cy={sy} rx={r * 1.45} ry={r * 1.1} opacity={1 - r / 640} />
          ))}
        </g>
        {/* one ray: steep in the crust, bent flatter below */}
        <path d={`M${sx} ${sy} L${sx + 250} ${MY} L${sx + 900} ${MY + 160}`} fill="none" stroke={P.ink} strokeWidth={3} strokeDasharray="16 10" strokeDashoffset={crawl(f, 2)} />
        <path d={`M${sx - 12} ${sy - 12} L${sx + 12} ${sy + 12} M${sx + 12} ${sy - 12} L${sx - 12} ${sy + 12}`} stroke={P.ink} strokeWidth={4} />
        <line x1={-900} y1={MY} x2={3100} y2={MY} stroke={P.ink} strokeWidth={3} strokeDasharray="14 9" strokeDashoffset={crawl(f, 0.8)} />
        <Tag x={1500} y={MY - 40} text="Moho" size={36} />
        <text x={1500} y={MY - 120} style={labelStyle(30, P.inkSoft, 4)}>
          Slower
        </text>
        <text x={1500} y={MY + 80} style={labelStyle(30, shade(MANTLE, 0.5), 4)}>
          Faster
        </text>
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 3 - "under the continents, about forty kilometres": a continental column; the gauge fills to ≈ 40 km
const ShotContinent: React.FC<SP> = ({ f, len, k }) => {
  const L = Math.max(len, 60);
  const G = 220;
  const K = 15;
  const cam = cameraAt(f, [
    { f: 0, x: 860, y: 500, zoom: 1.12 },
    { f: L, x: 900, y: 560, zoom: 1.0 },
  ]);
  const v = 40 * lerp(f, 0, k.forty - k.continents + 16, 0, 1);
  return (
    <Stage theme={BONE} cam={cam}>
      <Land f={f} horizon={G - 22} trees birds={false} seed={41} />
      <Layer depth={1}>
        <rect x={-900} y={G} width={4000} height={40 * K} fill={CRUST} />
        <rect x={-900} y={G + 40 * K} width={4000} height={1400} fill={MANTLE} />
        <Hatch id="s9c-m" color={shade(MANTLE, 0.2)} gap={16} dots width={1.6} />
        <rect x={-900} y={G + 40 * K} width={4000} height={1400} fill="url(#s9c-m)" />
        {[1, 2, 3].map((i) => (
          <line key={i} x1={-900} y1={G + i * 10 * K} x2={3100} y2={G + i * 10 * K} stroke={P.ink} strokeWidth={1.2} opacity={0.25} />
        ))}
        <rect x={-900} y={G - 22} width={4000} height={22} fill={C.tundra} />
        <line x1={-900} y1={G} x2={3100} y2={G} stroke={P.ink} strokeWidth={2.5} />
        <line x1={-900} y1={G + 40 * K} x2={3100} y2={G + 40 * K} stroke={P.ink} strokeWidth={3} strokeDasharray="14 9" strokeDashoffset={crawl(f, 0.8)} />
        <text x={200} y={G + 22 * K} style={labelStyle(44, P.ink, 4)}>
          Continent
        </text>
        <Tag x={200} y={G + 40 * K + 50} text="Moho" size={34} />
      </Layer>
      <Layer depth={0}>
        <Gauge x={1560} y={G} height={50 * K} value={v} max={50} unit="km" theme={BONE} title="MOHO" readoutText="≈ 40 km" readout={v > 39} plate={90} unitCap={false} />
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 4 - "under the oceans, only a few kilometres": pan out to sea, where the crust is a thin rind
const ShotOceanCrust: React.FC<SP> = ({ f, len }) => {
  const L = Math.max(len, 60);
  const cam = cameraAt(f, [
    { f: 0, x: 700, y: 560, zoom: 1.1 },
    { f: L + 10, x: 1500, y: 420, zoom: 1.5 },
  ]);
  const G = 220;
  const K = 14;
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={1}>
        <CrustSection f={f} G={G} K={K} coast={1050} idp="s9o" />
        <Dim x1={1820} y1={G + 4 * K} x2={1820} y2={G + 10 * K} k={ramp(f, 20, 40)} />
        <Tag x={1850} y={G + 7 * K} text="A few km" size={30} o={ramp(f, 34, 46)} />
        <Ship x={1500} y={G - 2} s={0.35} f={f} />
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 5 - 1961, Project Mohole: a drill ship on the open sea
const ShotShip: React.FC<SP> = ({ f, len, k }) => {
  const L = Math.max(len, 60);
  const H = 640;
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 520, zoom: 1.0 },
    { f: L, x: 1000, y: 560, zoom: 1.15 },
  ]);
  const mo = k.mohole - k.americans;
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={0.08}>
        <rect x={-2000} y={-2000} width={6000} height={2000 + H} fill={C.skyTop} />
        <rect x={-2000} y={H - 300} width={6000} height={300} fill={C.skyMid} />
        <circle cx={420} cy={H - 200} r={88} fill={C.sunRing} />
        <circle cx={420} cy={H - 200} r={56} fill={C.sun} />
      </Layer>
      <Layer depth={0.25}>
        <Flock frame={f} x={1500} y={H - 360} vx={-1.4} n={5} size={11} color={tint(P.ink, P.bone, 0.35)} seed={7} />
      </Layer>
      <Layer depth={1}>
        <rect x={-900} y={H} width={4000} height={900} fill={SEA} />
        {Array.from({ length: 7 }, (_, i) => (
          <line key={i} x1={-900} y1={H + 14 + i * i * 9} x2={3100} y2={H + 14 + i * i * 9} stroke={lit(SEA, 0.4)} strokeWidth={2 + i * 0.6} strokeDasharray={`${40 + i * 14} ${30 + i * 8}`} strokeDashoffset={crawl(f, 0.4 + i * 0.25)} />
        ))}
        <Ship x={1000} y={H + 4} s={1.3} f={f} />
      </Layer>
      <Layer depth={0}>
        <Tag x={98} y={160} text="1961" num size={44} o={ramp(f, 2, 10)} />
        <g opacity={ramp(f, mo, mo + 10)}>
          <text x={96} y={270} style={labelStyle(72, P.ink, 4)}>
            Project Mohole
          </text>
          <rect x={98} y={290} width={440 * ramp(f, mo + 2, mo + 16)} height={4} fill={P.ink} />
        </g>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 6 - "in 3,800 metres of water": the camera sinks down the pipe through stepped water bands
const ShotWater: React.FC<SP> = ({ f, len }) => {
  const L = Math.max(len, 60);
  const S = 200;
  const KW = 0.22; // px per metre
  const floor = S + 3800 * KW;
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: S + 60, zoom: 1.7 },
    { f: Math.round(L * 0.9), x: 900, y: 600, zoom: 1.0 },
    { f: L + 20, x: 900, y: 610, zoom: 0.98 },
  ]);
  const d = lerp(f, 0, L * 0.9, 0, 1);
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={1}>
        <rect x={-900} y={-900} width={4000} height={900 + S} fill={C.skyMid} />
        {Array.from({ length: 6 }, (_, i) => (
          <rect key={i} x={-900} y={S + (i * (floor - S)) / 6} width={4000} height={(floor - S) / 6 + 1} fill={mixHex(SEA, mixHex(SEA, P.graphite, 0.55), i / 5)} />
        ))}
        {specks(f, 50, 2400, floor - S, 61, 8).map((s, i) => (
          <circle key={i} cx={s.x - 250} cy={S + ((s.y + f * 0.4) % (floor - S))} r={s.r * 0.6} fill={lit(SEA, 0.5)} opacity={0.5} />
        ))}
        <rect x={-900} y={floor} width={4000} height={900} fill={tint(E.b, P.bone, 0.45)} />
        <line x1={-900} y1={floor} x2={3100} y2={floor} stroke={P.ink} strokeWidth={2.5} />
        <line x1={900} y1={S} x2={900} y2={floor} stroke={mixHex(E.a, P.ink, 0.4)} strokeWidth={4} />
        <Ship x={900} y={S + 2} s={0.6} f={f} />
      </Layer>
      <Layer depth={0}>
        <Gauge x={1560} y={190} height={700} value={3800 * d} max={4000} unit="m" theme={BONE} title="WATER" readoutText={`${fmt(Math.round(3800 * d / 10) * 10)} m`} plate={110} unitCap={false} />
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 7 - "200 m of sediment and 14 m of basalt": to scale, the bit chews down; the basalt is a sliver
const ShotBit: React.FC<SP> = ({ f, len, k }) => {
  const L = Math.max(len, 60);
  const SF = 240;
  const KM = 2.6; // px per metre
  const sedB = SF + 200 * KM;
  const basB = sedB + 14 * KM;
  const bas = k.basalt - k.bit;
  const depth = f < bas ? lerp(f, 4, bas, 0, 200) : lerp(f, bas, L * 0.95, 200, 214);
  const by = SF + depth * KM;
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 380, zoom: 1.2 },
    { f: L, x: 900, y: 600, zoom: 1.1 },
  ]);
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={1}>
        <rect x={-900} y={-900} width={4000} height={900 + SF} fill={mixHex(SEA, P.graphite, 0.5)} />
        {specks(f, 30, 2400, SF + 800, 71, 8).map((s, i) => (
          <circle key={i} cx={s.x - 250} cy={((s.y + f * 0.4) % (SF + 800)) - 800} r={s.r * 0.6} fill={lit(SEA, 0.4)} opacity={0.4} />
        ))}
        <rect x={-900} y={SF} width={4000} height={sedB - SF} fill={tint(E.b, P.bone, 0.45)} />
        <Hatch id="s9b-sed" color={shade(tint(E.b, P.bone, 0.45), 0.15)} gap={14} dots width={1.5} />
        <rect x={-900} y={SF} width={4000} height={sedB - SF} fill="url(#s9b-sed)" />
        {[0.25, 0.5, 0.75].map((a) => (
          <line key={a} x1={-900} y1={SF + (sedB - SF) * a} x2={3100} y2={SF + (sedB - SF) * a + 6} stroke={P.ink} strokeWidth={1.2} opacity={0.25} />
        ))}
        <rect x={-900} y={sedB} width={4000} height={basB - sedB} fill={mixHex(E.a, P.ink, 0.35)} />
        <rect x={-900} y={basB} width={4000} height={900} fill={mixHex(E.a, P.ink, 0.25)} opacity={0.6} />
        <Hatch id="s9b-bas" color={mixHex(E.a, P.ink, 0.5)} gap={22} angle={70} width={1.4} />
        <rect x={-900} y={basB} width={4000} height={900} fill="url(#s9b-bas)" />
        <line x1={-900} y1={SF} x2={3100} y2={SF} stroke={P.ink} strokeWidth={2.5} />
        <rect x={880} y={-900} width={40} height={by + 900 - 20} fill={C.hole} />
        <rect x={888} y={-900} width={24} height={by + 900 - 20} fill={C.metal} />
        <path d={`M876 ${by - 22} L924 ${by - 22} L916 ${by} L900 ${by + 10} L884 ${by} Z`} fill={mixHex(E.a, P.ink, 0.3)} transform={`rotate(${Math.sin(f * 1.3) * 4} 900 ${by})`} />
        {Array.from({ length: 6 }, (_, i) => {
          const a = ((f * 0.8 + i * 9) % 50) / 50;
          return <circle key={i} cx={900 + (i % 2 ? 1 : -1) * (24 + a * 30)} cy={by - a * 60} r={3} fill={tint(E.b, P.bone, 0.2)} opacity={1 - a} />;
        })}
        <Dim x1={700} y1={SF} x2={700} y2={sedB} k={ramp(f, 4, bas)} />
        <Tag x={680} y={(SF + sedB) / 2} text="200 m" num size={34} anchor="end" o={ramp(f, bas - 20, bas - 6)} />
        <text x={680} y={(SF + sedB) / 2 + 60} textAnchor="end" style={labelStyle(28, P.inkSoft, 3)} opacity={ramp(f, bas - 20, bas - 6)}>
          Sediment
        </text>
        <Tag x={960} y={(sedB + basB) / 2} text="14 m" num size={34} o={ramp(f, bas, bas + 10)} />
        <text x={1110} y={(sedB + basB) / 2 + 12} style={labelStyle(28, P.ink, 3)} opacity={ramp(f, bas, bas + 10)}>
          Basalt
        </text>
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 8 - "the funding dried up ... cancelled": wide, the stub of a hole far above a Moho it never reached; the pipe comes up
const ShotCancelled: React.FC<SP> = ({ f, len, k }) => {
  const L = Math.max(len, 60);
  const S = 220;
  const K = 80; // px per km
  const sf = S + 3.8 * K;
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 520, zoom: 1.15 },
    { f: L, x: 960, y: 560, zoom: 1.0 },
  ]);
  const pull = lerp(f, 10, L, 0, 1);
  const st = ramp(f, k.y1966 - k.funding, k.y1966 - k.funding + 6);
  const sc = 1 + 0.25 * (1 - st);
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={1}>
        <rect x={-900} y={-900} width={4000} height={900 + S} fill={C.skyMid} />
        <rect x={-900} y={S} width={4000} height={sf - S} fill={mixHex(SEA, P.graphite, 0.25)} />
        <rect x={-900} y={sf} width={4000} height={5 * K} fill={CRUST} />
        <rect x={-900} y={sf + 5 * K} width={4000} height={900} fill={MANTLE} />
        <line x1={-900} y1={sf} x2={3100} y2={sf} stroke={P.ink} strokeWidth={2.5} />
        <line x1={-900} y1={sf + 5 * K} x2={3100} y2={sf + 5 * K} stroke={P.ink} strokeWidth={3} strokeDasharray="14 9" strokeDashoffset={crawl(f, 0.8)} />
        <Tag x={1240} y={sf + 5 * K + 46} text="Moho" size={32} />
        <line x1={900} y1={sf} x2={900} y2={sf + 0.214 * K} stroke={C.hole} strokeWidth={6} />
        <line x1={900} y1={S} x2={900} y2={S + (sf - S) * (1 - pull)} stroke={mixHex(E.a, P.ink, 0.4)} strokeWidth={4} />
        <line x1={930} y1={sf + 0.214 * K + 10} x2={930} y2={sf + 5 * K - 10} stroke={P.ink} strokeWidth={2} strokeDasharray="4 8" opacity={0.6} />
        <text x={950} y={sf + 2.6 * K} style={labelStyle(64, P.inkSoft, 2)}>
          ?
        </text>
        <SeaTop x0={-900} x1={3100} y={S - 10} h={12} f={f} />
        <Ship x={900} y={S - 2} s={0.55} f={f} />
      </Layer>
      <Layer depth={0}>
        <g opacity={st} transform={`translate(1400 220) scale(${sc}) rotate(-6) translate(-1400 -220)`}>
          <rect x={1180} y={160} width={440} height={120} fill="none" stroke={P.ink} strokeWidth={5} />
          <text x={1400} y={215} textAnchor="middle" style={numStyle(40, P.ink)}>
            1966
          </text>
          <text x={1400} y={262} textAnchor="middle" style={labelStyle(38, P.ink, 5)}>
            Cancelled
          </text>
        </g>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Mid-ocean ridge seafloor profile
const ridge = (x: number, base: number) => base - 130 * Math.exp(-Math.pow((x - 1100) / 380, 2)) - 30 * Math.sin(x / 47) * Math.exp(-Math.pow((x - 1100) / 500, 2));

// Shot 9 - 2023, the middle of the Atlantic: a ship above the mid-ocean ridge
const ShotAtlantic: React.FC<SP> = ({ f, len }) => {
  const L = Math.max(len, 60);
  const S = 260;
  const base = 820;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 500, zoom: 1.0 },
    { f: L, x: 1080, y: 560, zoom: 1.15 },
  ]);
  const xs = Array.from({ length: 81 }, (_, i) => -900 + i * 50);
  const floor: [number, number][] = xs.map((x) => [x, ridge(x, base)]);
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={0.3}>
        <rect x={-2000} y={-2000} width={6000} height={2000 + S} fill={C.skyTop} />
        <rect x={-2000} y={S - 200} width={6000} height={200} fill={C.skyMid} />
      </Layer>
      <Layer depth={1}>
        {Array.from({ length: 4 }, (_, i) => (
          <rect key={i} x={-900} y={S + i * 160} width={4000} height={161} fill={mixHex(SEA, mixHex(SEA, P.graphite, 0.5), i / 3)} />
        ))}
        {specks(f, 40, 2400, 600, 81, 8).map((s, i) => (
          <circle key={i} cx={s.x - 250} cy={S + 20 + ((s.y + f * 0.3) % 600)} r={s.r * 0.6} fill={lit(SEA, 0.5)} opacity={0.45} />
        ))}
        <path d={ptsToPath([...floor, [3100, 1500], [-900, 1500]]) + " Z"} fill={mixHex(E.a, P.ink, 0.25)} />
        <path d={ptsToPath(floor.filter(([x]) => x < 1100)) + ` L1100 1500 L-900 1500 Z`} fill={lit(mixHex(E.a, P.ink, 0.25), 0.15)} />
        <path d={ptsToPath(floor)} fill="none" stroke={P.ink} strokeWidth={2.5} />
        <SeaTop x0={-900} x1={3100} y={S - 10} h={14} f={f} />
        <Ship x={1180} y={S - 2} s={0.8} f={f} />
      </Layer>
      <Layer depth={0}>
        <Tag x={98} y={160} text="2023" num size={44} o={ramp(f, 2, 10)} />
        <g opacity={ramp(f, 8, 18)}>
          <text x={96} y={270} style={labelStyle(64, P.ink, 4)}>
            Mid-Atlantic
          </text>
        </g>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

/** Atlantis Massif section: a fault ramp; the mantle block slid up it to near the sea floor (`rise` 0..1). */
const Massif: React.FC<{ f: number; rise: number; hole?: number }> = ({ f, rise, hole = 0 }) => {
  const SF = 300;
  const up = (1 - rise) * 420;
  const SLOPE = 0.414; // fault: x grows 0.414 px per px of depth
  const fx = (y: number) => 480 + (y - (SF - 60)) * SLOPE;
  const block: [number, number][] = [
    [fx(SF + 40), SF + 40],
    [700, SF - 30],
    [1240, SF + 10],
    [1500, 1500],
    [fx(1500), 1500],
  ];
  return (
    <g>
      <rect x={-900} y={-900} width={4000} height={900 + SF} fill={mixHex(SEA, P.graphite, 0.4)} />
      {specks(f, 30, 2400, SF + 600, 91, 8).map((s, i) => (
        <circle key={i} cx={s.x - 250} cy={((s.y + f * 0.35) % (SF + 600)) - 600} r={s.r * 0.6} fill={lit(SEA, 0.4)} opacity={0.4} />
      ))}
      <rect x={-900} y={SF} width={4000} height={1400} fill={CRUST} />
      <Hatch id="s9m-cr" color={shade(CRUST, 0.15)} gap={20} angle={60} width={1.3} />
      <rect x={-900} y={SF} width={4000} height={1400} fill="url(#s9m-cr)" />
      <line x1={-900} y1={SF} x2={3100} y2={SF} stroke={P.ink} strokeWidth={2.5} />
      {/* the mantle block slides up along the fault (translated along its direction) */}
      <g transform={`translate(${up * SLOPE} ${up})`}>
        <path d={ptsToPath(block) + " Z"} fill={MANTLE} />
        <path d={ptsToPath([block[0], block[1], [fx(1500) + 160, 1500], block[4]]) + " Z"} fill={lit(MANTLE, 0.15)} />
        <Hatch id="s9m-man" color={shade(MANTLE, 0.25)} gap={14} dots width={1.8} />
        <path d={ptsToPath(block) + " Z"} fill="url(#s9m-man)" />
        {Array.from({ length: 40 }, (_, i) => {
          const y = SF + 40 + rnd(i + 9) * 700;
          const x = fx(y) + 40 + rnd(i + 5) * 520;
          return <circle key={i} cx={x + Math.sin(f / 30 + i) * 3} cy={y} r={3} fill={lit(SEA, 0.2)} opacity={0.7} />;
        })}
        <path d={ptsToPath(block.slice(0, 3))} fill="none" stroke={P.ink} strokeWidth={2.5} />
        {hole > 0 ? <line x1={980} y1={SF - 14} x2={980} y2={SF - 14 + hole} stroke={C.hole} strokeWidth={6} /> : null}
      </g>
      {/* the fault, with arrows riding up it on the block side */}
      <line x1={fx(SF)} y1={SF} x2={fx(1500)} y2={1500} stroke={P.ink} strokeWidth={4} />
      {[0, 1, 2].map((i) => {
        const a = (((f * 0.012 + i / 3) % 1) + 1) % 1;
        const y = 1250 - a * 760;
        const x = fx(y) + 70;
        return <path key={i} d={`M${x - 14} ${y + 8} L${x} ${y - 18} L${x + 14} ${y + 8} Z`} fill={P.ink} opacity={rise < 1 ? 0.8 : 0.35} transform={`rotate(-22.5 ${x} ${y})`} />;
      })}
    </g>
  );
};

// Shot 10 - "Atlantis Massif ... faults had already lifted mantle rock up": the block slides up the fault
const ShotMassif: React.FC<SP> = ({ f, len, k }) => {
  const L = Math.max(len, 60);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 620, zoom: 1.0 },
    { f: L, x: 980, y: 560, zoom: 1.12 },
  ]);
  const rise = lerp(f, k.faults - k.massif - 10, L - 10, 0, 1);
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={1}>
        <Massif f={f} rise={rise} />
        <text x={1000 + (1 - rise) * 420 * 0.414} y={760 + (1 - rise) * 420} textAnchor="middle" style={labelStyle(48, shade(MANTLE, 0.55), 4)}>
          Mantle
        </text>
      </Layer>
      <Layer depth={0}>
        <g opacity={ramp(f, 2, 12)}>
          <text x={96} y={170} style={labelStyle(64, P.chalk, 4)}>
            Atlantis Massif
          </text>
        </g>
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// Shot 11 - "they drilled 1,268 metres": the hole goes down into the lifted mantle; gauge fills
const ShotDrill: React.FC<SP> = ({ f, len }) => {
  const L = Math.max(len, 60);
  const KM = 0.5; // px per metre
  const d = lerp(f, 0, L * 0.85, 0, 1);
  const cam = cameraAt(f, [
    { f: 0, x: 980, y: 320, zoom: 1.6 },
    { f: L, x: 980, y: 600, zoom: 1.05 },
  ]);
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={1}>
        <Massif f={f} rise={1} hole={NEW_M * KM * d} />
        <circle cx={980} cy={286 + NEW_M * KM * d} r={8} fill={P.ink} transform={`rotate(${f * 9} 980 ${290 + NEW_M * KM * d})`} />
      </Layer>
      <Layer depth={0}>
        <Gauge x={1580} y={200} height={680} value={NEW_M * d} max={1500} unit="m" theme={BONE} readoutText={`${fmt(Math.round(NEW_M * d))} m`} plate={100} unitCap={false} />
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

/** Two bars to one scale: the new hole and the old record (ghost). */
const Bars: React.FC<{ f: number; ghosts: number; ghostO: number }> = ({ f, ghosts, ghostO }) => {
  const G = 180;
  const KM = 0.6;
  const nx = 760;
  const ox = 1080;
  return (
    <g>
      <rect x={-900} y={-900} width={4000} height={900 + G} fill={mixHex(SEA, P.graphite, 0.4)} />
      <rect x={-900} y={G} width={4000} height={1400} fill={MANTLE} />
      <Hatch id="s9bar-m" color={shade(MANTLE, 0.2)} gap={16} dots width={1.6} />
      <rect x={-900} y={G} width={4000} height={1400} fill="url(#s9bar-m)" />
      <line x1={-900} y1={G} x2={3100} y2={G} stroke={P.ink} strokeWidth={2.5} />
      <rect x={nx - 30} y={G} width={60} height={NEW_M * KM} fill={C.hole} />
      <rect x={nx - 30} y={G} width={14} height={NEW_M * KM} fill={lit(C.hole, 0.15)} />
      <Tag x={nx - 50} y={G + NEW_M * KM} text="1,268 m" num size={34} anchor="end" />
      <text x={nx} y={G - 40} textAnchor="middle" style={labelStyle(34, P.chalk, 3)}>
        2023
      </text>
      {Array.from({ length: Math.max(1, ghosts) }, (_, i) => {
        const o = i === 0 ? ghostO : ramp(f, i * 9, i * 9 + 8);
        return (
          <g key={i} opacity={o}>
            <rect x={ox - 30} y={G + i * OLD_M * KM + 2} width={60} height={OLD_M * KM - 4} fill="none" stroke={P.ink} strokeWidth={3} strokeDasharray="10 7" strokeDashoffset={crawl(f, 0.6)} />
            {ghosts > 1 ? (
              <text x={ox + 50} y={G + (i + 0.5) * OLD_M * KM + 12} style={numStyle(30, P.ink)}>
                {i + 1}
              </text>
            ) : null}
          </g>
        );
      })}
      <text x={ox} y={G - 40} textAnchor="middle" style={labelStyle(34, P.chalk, 3)} opacity={ghostO}>
        Old record
      </text>
    </g>
  );
};

// Shot 12 - "the deepest ... before that had reached about two hundred metres": a ghost bar beside the new hole
const ShotOld: React.FC<SP> = ({ f, len }) => {
  const L = Math.max(len, 60);
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 480, zoom: 1.2 },
    { f: L, x: 960, y: 540, zoom: 1.05 },
  ]);
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={1}>
        <Bars f={f} ghosts={1} ghostO={ramp(f, 10, 24)} />
        <Tag x={1150} y={180 + OLD_M * 0.3} text="≈ 200 m" num size={34} o={ramp(f, 24, 36)} />
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// Shot 13 - "more than six times further": the ghost bar stacks six times down beside the new hole
const ShotSix: React.FC<SP> = ({ f, len }) => {
  const L = Math.max(len, 60);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.05 },
    { f: L, x: 960, y: 580, zoom: 1.0 },
  ]);
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={1}>
        <Bars f={f} ghosts={6} ghostO={1} />
        <Tag x={1240} y={180 + 6.6 * OLD_M * 0.6} text="× 6" num size={52} o={ramp(f, 50, 58)} />
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// Shot 14 - two routes: Kola's hairline stuck in thick crust; the Atlantic hole meets mantle that came up
const ShotRoutes: React.FC<SP> = ({ f, len, k }) => {
  const L = Math.max(len, 60);
  const G = 240;
  const K = 13;
  const came = k.came - k.so;
  const cam = cameraAt(f, [
    { f: 0, x: 760, y: 560, zoom: 1.25 },
    { f: came, x: 1300, y: 520, zoom: 1.3 },
    { f: L + 30, x: 960, y: 560, zoom: 1.0 },
  ]);
  const arrows = ramp(f, came, came + 16);
  const ax = 1500;
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={1}>
        <CrustSection f={f} G={G} K={K} coast={1050} idp="s9r" />
        {/* a bulge of mantle risen under the ridge */}
        <path d={ptsToPath([[ax - 220, G + 10 * K], [ax - 80, G + 4.6 * K], [ax + 80, G + 4.6 * K], [ax + 220, G + 10 * K]]) + " Z"} fill={MANTLE} />
        <line x1={600} y1={G} x2={600} y2={G + 12.262 * K} stroke={C.hole} strokeWidth={5} />
        <line x1={ax} y1={G + 4 * K} x2={ax} y2={G + 5.9 * K} stroke={C.hole} strokeWidth={5} />
        <text x={600} y={G - 50} textAnchor="middle" style={labelStyle(34, P.ink, 3)}>
          Kola
        </text>
        <text x={ax} y={G - 50} textAnchor="middle" style={labelStyle(34, P.ink, 3)}>
          Atlantis
        </text>
        <g opacity={arrows} fill={shade(MANTLE, 0.5)}>
          {[-120, 0, 120].map((dx, i) => {
            const y = G + 18 * K - ((f * 1.2 + i * 30) % 90);
            return <path key={i} d={`M${ax + dx - 18} ${y} L${ax + dx} ${y - 30} L${ax + dx + 18} ${y} Z`} />;
          })}
        </g>
        <text x={300} y={G + 26 * K} style={labelStyle(40, P.ink, 4)}>
          Crust
        </text>
        <text x={300} y={G + 52 * K} style={labelStyle(36, shade(MANTLE, 0.5), 4)}>
          Mantle
        </text>
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

const shots9 = (k: K9): ShotDef<K9>[] => [
  { from: 0, C: ShotMoho },
  { from: k.seismic, C: ShotWaves },
  { from: k.continents, C: ShotContinent },
  { from: k.oceans, C: ShotOceanCrust },
  { from: k.americans, C: ShotShip },
  { from: k.water, C: ShotWater },
  { from: k.bit, C: ShotBit },
  { from: k.funding, C: ShotCancelled },
  { from: k.y2023, C: ShotAtlantic },
  { from: k.massif, C: ShotMassif },
  { from: k.drilled, C: ShotDrill },
  { from: k.before, C: ShotOld },
  { from: k.six, C: ShotSix },
  { from: k.so, C: ShotRoutes },
];

export const SceneL09: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const k = l09Cues(t);
  return playShots(f, shots9(k), k, k.end + 30);
};

export const soundL09 = (t: SceneTiming): Cue[] => {
  const k = l09Cues(t);
  const W = "mixkit-1489-whoosh-air.mp3";
  const WD = "mixkit-2604-whoosh-deep-air.mp3";
  const TICK = "mixkit-2568-ui-click-tone.mp3";
  const POP = "mixkit-2356-ui-pop-dry.mp3";
  const POPL = "mixkit-2358-ui-pop-long.mp3";
  return [
    { at: 2, file: POP, vol: 0.22, dur: 20 },
    { at: k.moho + 10, file: POPL, vol: 0.26, dur: 24 },
    { at: k.seismic - 2, file: W, vol: 0.22, dur: 50 },
    { at: k.seismic + 2, file: "mixkit-1686-boom-underground-echo.mp3", vol: 0.26, dur: 90, fadeOut: 30 },
    { at: k.continents - 2, file: WD, vol: 0.26, dur: 60 },
    { at: k.forty + 16, file: TICK, vol: 0.28, dur: 20 },
    { at: k.oceans - 2, file: "mixkit-1493-whoosh-swirl.mp3", vol: 0.24, dur: 50 },
    { at: k.oceans + 34, file: POP, vol: 0.24, dur: 20 },
    { at: k.americans - 2, file: W, vol: 0.24, dur: 50 },
    { at: k.americans, file: "mixkit-2658-wind-ambience.mp3", vol: 0.14, dur: k.water - k.americans + 10, fadeIn: 10, fadeOut: 10 },
    { at: k.americans + 4, file: TICK, vol: 0.26, dur: 20 },
    { at: k.mohole, file: POPL, vol: 0.24, dur: 24 },
    { at: k.water - 2, file: WD, vol: 0.3, dur: 60 },
    { at: k.water, file: "mixkit-2297-rumble-bass-hum.mp3", vol: 0.24, dur: k.bit - k.water + 10, fadeIn: 10, fadeOut: 14 },
    { at: k.bit, file: "mixkit-855-drill-electric.mp3", vol: 0.12, dur: k.funding - k.bit, fadeIn: 6, fadeOut: 8 },
    { at: k.basalt, file: TICK, vol: 0.3, dur: 20 },
    { at: k.funding - 2, file: W, vol: 0.22, dur: 50 },
    { at: k.y1966, file: "mixkit-788-boom-cinematic-impact.mp3", vol: 0.3, dur: 90, fadeOut: 30 },
    { at: k.y2023 - 2, file: WD, vol: 0.28, dur: 60 },
    { at: k.y2023 + 4, file: TICK, vol: 0.26, dur: 20 },
    { at: k.massif - 2, file: "mixkit-1493-whoosh-swirl.mp3", vol: 0.26, dur: 50 },
    { at: k.faults - 10, file: "mixkit-403-rock-debris-falling.mp3", vol: 0.22, dur: k.drilled - k.faults, fadeOut: 20 },
    { at: k.drilled - 2, file: W, vol: 0.22, dur: 50 },
    { at: k.drilled + 4, file: "mixkit-855-drill-electric.mp3", vol: 0.12, dur: k.before - k.drilled - 10, fadeIn: 8, fadeOut: 10 },
    { at: k.before - 2, file: W, vol: 0.22, dur: 50 },
    { at: k.before + 24, file: POP, vol: 0.24, dur: 20 },
    ...[0, 1, 2, 3, 4, 5].map((i) => ({ at: k.six + i * 9, file: TICK, vol: 0.22, dur: 14 })),
    { at: k.six + 50, file: "mixkit-3108-chime-crystal.mp3", vol: 0.2, dur: 60 },
    { at: k.so - 2, file: WD, vol: 0.26, dur: 60 },
    { at: k.came, file: "mixkit-1493-whoosh-swirl.mp3", vol: 0.22, dur: 50 },
  ];
};
