// STS03 (thin-air): ST01 lines [26, 29, 30]. Shot bodies only; layout rules in lib/suppose/vshort.tsx.
// Numbers on screen (spoken here): ×2 wide, ×8 mass, ×2 pull/weight, 1/3 vs 1/8 (OUR SUM), 5 km, half as tall.
// Mountains to scale: Everest 8.85 km = 500 px (56.5 px/km); air scale height 8.5 km today, half that on 2× Earth.
import React from "react";
import { VShot } from "../../lib/suppose/vshort";
import { Bloom, GroundShadow } from "../../lib/illustrated/light";
import { rrect } from "../../lib/illustrated/shapes";
import { AIR, CHALK, INK, SUPPOSE, TERRA } from "../../lib/suppose/palette";
import { Lev, levHand } from "../../lib/suppose/lev";
import { STPill } from "../../lib/suppose/devices";
import { Earth } from "../../lib/suppose/frames";
import { Bucket, Puffs, TERRA_DEEP, TERRA_LIT } from "../ST01-earth-twice-as-big/acts/l04-parts";
import { Arrow, beats, Bracket, ease, lin, mix, overshoot, Pop, Pt, Rings, rnd, SageLand, T, Tag, VFlag, VStage } from "./vparts-a";

const C2 = { label: "SIZE", value: "×2" };
const C2P = { label: "SIZE", value: "×2", sub: "PULL ×2" };
const SAGE = SUPPOSE.sage;
const CLAY = SUPPOSE.clay;

// ------------------------------------------------------------------ line 26
/** Twice as wide. Eight times the mass. */
const Swell: VShot = ({ t, d, f }) => {
  const R = mix(150, 300, overshoot(lin(t, 0, 34)));
  const EC: Pt = [540, 700];
  return (
    <VStage fam="moss" t={t} d={d} f={f} counter={C2}>
      <Rings cx={EC[0]} cy={EC[1]} r={R} t={t} t0={2} />
      <Earth cx={EC[0]} cy={EC[1]} r={R} />
      <circle cx={EC[0]} cy={EC[1]} r={150} fill="none" stroke={CHALK} strokeWidth={6} strokeDasharray="20 13" opacity={0.9 * ease(t, 6, 20)} />
      <Bracket x0={240} x1={840} y={1050} label="TWICE AS WIDE" p={ease(t, 8, 36)} size={44} />
      <Pop t={t} a={42} cx={540} cy={EC[1]} n={14}>
        <rect x={350} y={EC[1] - 100} width={380} height={200} rx={32} fill={CHALK} opacity={0.92} />
        <T x={540} y={EC[1] + 30} size={130} fill={INK}>×8</T>
        <T x={540} y={EC[1] + 80} size={32} fill={INK} ls={4} weight={800}>THE MASS</T>
      </Pop>
    </VStage>
  );
};

/** Twice the pull: a backpack on a scale; the pull doubles (arrows to scale) and the needle swings */
const Weighs: VShot = ({ t, d, f }) => {
  const g = ease(t, 6, 50);
  const ang = mix(-60, 30, g) + Math.sin(t / 2.4) * 2;
  const cx = 420, top = 960;
  const r = (ang * Math.PI) / 180;
  return (
    <VStage fam="chalk" t={t} d={d} f={f} counter={C2P}>
      <GroundShadow x={cx} y={1150} rx={260} opacity={0.25} />
      <path d={rrect(cx - 230, top, 460, 190, 40)} fill={TERRA} />
      <path d={rrect(cx - 230, top, 460, 40, 20)} fill={TERRA_LIT} opacity={0.6} />
      <circle cx={cx} cy={top + 110} r={62} fill={CHALK} stroke={TERRA_DEEP} strokeWidth={5} />
      <path d={`M ${cx - 46} ${top + 110} A 46 46 0 0 1 ${cx + 46} ${top + 110}`} stroke={INK} strokeWidth={3} fill="none" opacity={0.4} />
      <path d={`M ${cx} ${top + 110} L ${cx + Math.sin(r) * 50} ${top + 110 - Math.cos(r) * 50}`} stroke={INK} strokeWidth={6} strokeLinecap="round" />
      {/* backpack */}
      <g transform={`translate(${cx} ${top - 4 - 4 * g})`}>
        <path d={rrect(-110, -250, 220, 250, 50)} fill={SAGE.near} />
        <path d={rrect(-110, -250, 220, 80, 40)} fill={SAGE.shadow} />
        <path d={rrect(-70, -120, 140, 80, 18)} fill={SAGE.shadow} opacity={0.7} />
        <path d="M -60 -250 Q 0 -310 60 -250" stroke={SAGE.shadow} strokeWidth={14} fill="none" />
      </g>
      <T x={760} y={600} size={34} fill={SUPPOSE.chalk.dim} ls={2}>TODAY</T>
      <Arrow x0={760} y0={630} x1={760} y1={780} color={INK} w={12} op={0.5} dash="14 10" />
      <T x={890} y={600} size={34} fill={TERRA_DEEP} ls={2}>HERE</T>
      <Arrow x0={890} y0={630} x1={890} y1={630 + mix(150, 300, g)} color={TERRA} w={22} head={46} />
      <Pop t={t} a={84} cx={420} cy={480} n={14}><T x={420} y={500} size={76} fill={INK}>WEIGHS ×2</T></Pop>
    </VStage>
  );
};

/** A bucket of water feels like two buckets. */
const Buckets: VShot = ({ t, d, f }) => {
  const G = 1150, x = 400, h = 380, s = h / 170;
  const lift = ease(t, 4, 30);
  const shake = lift >= 1 ? Math.sin(t * 1.3) * 3 : 0;
  const handL: Pt = [44, mix(-71, -108, lift) + shake / s];
  const [hx, hy] = levHand(x, G, h, handL);
  const g = ease(t, 34, 60);
  return (
    <VStage fam="sage" t={t} d={d} f={f} counter={C2P}>
      <Bloom x={860} y={420} r={300} color={SAGE.light} strength={0.7} />
      <SageLand y={G} seed={2} />
      <Lev x={x} y={G} h={h} frame={f} pose="stand" hands={{ front: handL, back: [handL[0] - 12, handL[1] + 8] }} lean={-6} eyes={lift < 0.3 ? "open" : "squint"} wind={0.4} outline={INK} />
      <Bucket x={hx + 4} y={hy - 4} s={1.9} slosh={Math.sin(t / 4) * 4} />
      {g > 0 ? <Bucket x={hx + 150 + Math.sin(t / 5) * 4} y={hy + 26} s={1.9} ghost={g * (0.75 + 0.2 * Math.sin(t / 6))} /> : null}
      {lift > 0.6 ? <Puffs x={x + 50 * s} y={G - 150 * s} f={t} color={SAGE.dim} /> : null}
      <Pop t={t} a={40} cx={540} cy={470}><Tag x={540} y={470} text="FEELS LIKE TWO" size={44} dark={false} /></Pop>
    </VStage>
  );
};

/** And you weigh double too: a ghost second Lev hops onto Lev's back; Lev staggers */
const Piggy: VShot = ({ t, d, f }) => {
  const G = 1150, x = 560, h = 380, s = h / 170;
  const hop = ease(t, 0, 22);
  const home: Pt = [x - 40 * s, G - 78 * s];
  const gx = mix(x - 420, home[0], hop);
  const gy = mix(G, home[1], hop) - Math.sin(hop * Math.PI) * 240;
  const since = Math.max(0, t - 22);
  const st = t >= 22 ? Math.exp(-since / 16) : 0;
  const lean = st * 9 * Math.sin(since / 2.4) + (t >= 22 ? 5 : 0);
  const sq = t >= 22 ? 1 - 0.08 * st : 1;
  return (
    <VStage fam="sage" t={t} d={d} f={f} counter={C2P}>
      <Bloom x={860} y={420} r={300} color={SAGE.light} strength={0.7} />
      <SageLand y={G} seed={3} />
      <g transform={`translate(${x} ${G}) scale(${1 + (1 - sq) * 0.5} ${sq}) translate(${-x} ${-G})`}>
        <g transform={`rotate(${lean * 0.6} ${x} ${G})`} opacity={0.55}>
          <Lev x={gx} y={gy} h={h * 0.92} frame={f + 20} pose="sit" eyes="happy" seed={3} shade="#D9EAD0" wind={0.5} />
        </g>
        <Lev x={x} y={G} h={h} frame={f} pose={t < 22 ? "stand" : "shrug"} lean={lean} eyes={t < 20 ? "up" : "wide"} tilt={t < 20 ? -10 : 0} wind={0.4} outline={INK} />
      </g>
      <Pop t={t} a={30} cx={540} cy={470}><Tag x={540} y={470} text="YOU WEIGH ×2" size={48} dark={false} /></Pop>
    </VStage>
  );
};

// ------------------------------------------------------------------ the clay range (lines 29, 30)
const G = 1150, P = 650;
const PXKM = (G - P) / 8.85;
const LX = 290, RX = 790, MW = 235;
type Bez = [Pt, Pt, Pt, Pt];
const leftFlank = (cx: number): Bez => [[cx - MW, G], [cx - MW * 0.55, G - 110], [cx - MW * 0.3, P + 110], [cx - 22, P + 12]];
const bez = (b: Bez, u: number): Pt => {
  const v = 1 - u;
  return [0, 1].map((k) => v * v * v * b[0][k] + 3 * v * v * u * b[1][k] + 3 * v * u * u * b[2][k] + u * u * u * b[3][k]) as Pt;
};
const flankAt = (cx: number, y: number): Pt => {
  const b = leftFlank(cx);
  let lo = 0, hi = 1;
  for (let i = 0; i < 30; i++) {
    const m = (lo + hi) / 2;
    if (bez(b, m)[1] > y) lo = m;
    else hi = m;
  }
  return bez(b, (lo + hi) / 2);
};
const Mountain: React.FC<{ cx: number; k?: number; ghost?: boolean; seed?: number }> = ({ cx, k = 1, ghost, seed = 0 }) => {
  const w = MW;
  const dd = `M ${cx - w} ${G} C ${cx - w * 0.55} ${G - 110} ${cx - w * 0.3} ${P + 110} ${cx - 22} ${P + 12} Q ${cx} ${P - 6} ${cx + 26} ${P + 16} C ${cx + w * 0.3} ${P + 130 + seed} ${cx + w * 0.6} ${G - 100} ${cx + w} ${G} Z`;
  if (ghost) return <path d={dd} fill="none" stroke={CHALK} strokeWidth={5} strokeDasharray="18 13" opacity={0.75} />;
  return (
    <g transform={`translate(0 ${G}) scale(1 ${k}) translate(0 ${-G})`}>
      <path d={dd} fill={CLAY.mid} />
      <path d={`M ${cx - 48} ${P + 56} Q ${cx - 24} ${P + 4} ${cx} ${P - 2} Q ${cx + 30} ${P + 8} ${cx + 52} ${P + 60} Q ${cx + 16} ${P + 44} ${cx} ${P + 62} Q ${cx - 18} ${P + 40} ${cx - 48} ${P + 56} Z`} fill="#FFF1E0" />
      <path d={`M ${cx + 6} ${P + 14} C ${cx + 90} ${P + 130} ${cx + 160} ${G - 100} ${cx + w} ${G} L ${cx + 40} ${G} C ${cx + 60} ${G - 160} ${cx + 30} ${P + 160} ${cx + 6} ${P + 14} Z`} fill={CLAY.near} opacity={0.28} />
    </g>
  );
};
const makeAir = (x0: number, x1: number, seed: number): Pt[] => {
  const out: Pt[] = [];
  let i = 0;
  for (let y = G - 6; y > 290; y -= 14) {
    for (let x = x0; x < x1; x += 14) {
      i++;
      const alt = G - y;
      if (rnd(seed * 997 + i) < Math.exp(-alt / (8.5 * PXKM)) * 0.85) out.push([x + (rnd(i * 3 + seed) - 0.5) * 9, alt + (rnd(i * 5 + seed) - 0.5) * 9]);
    }
  }
  return out;
};
const AIR_L = makeAir(20, 530, 1);
const AIR_R = makeAir(550, 1060, 2);
const AirDots: React.FC<{ side: "L" | "R"; k: number; f: number }> = ({ side, k, f }) => (
  <g fill={AIR} opacity={0.9}>
    {(side === "L" ? AIR_L : AIR_R).map(([x, a], i) => (
      <circle key={i} cx={x + Math.sin(f / 9 + i * 1.7) * 2.2} cy={G - Math.max(4, a * k) + Math.cos(f / 11 + i) * 1.6} r={3} />
    ))}
  </g>
);
const Range: React.FC<{ f: number; kR?: number; mR?: number; ghostR?: boolean; children?: React.ReactNode }> = ({ f, kR = 0.5, mR = 1, ghostR, children }) => (
  <g>
    <Bloom x={540} y={1060} r={560} color={CLAY.light} strength={0.5} spread={0.5} />
    <path d="M -40 980 C 120 920 260 930 420 960 C 600 990 700 900 860 920 C 980 935 1060 960 1120 950 L 1120 1300 L -40 1300 Z" fill={CLAY.far} opacity={0.7} />
    <g opacity={0.28}>
      <ellipse cx={((f * 1.6) % 1500) - 200} cy={420} rx={130} ry={20} fill={CLAY.light} />
      <ellipse cx={((f * 1.6 + 750) % 1500) - 200} cy={330} rx={100} ry={15} fill={CLAY.light} />
    </g>
    <AirDots side="L" k={1} f={f} />
    <AirDots side="R" k={kR} f={f} />
    <Mountain cx={LX} />
    {ghostR ? <Mountain cx={RX} seed={16} ghost /> : null}
    <Mountain cx={RX} seed={16} k={mR} />
    <rect x={-40} y={G} width={1160} height={800} fill={CLAY.near} />
    <T x={LX} y={G + 62} size={40} ls={3}>OUR EARTH</T>
    <T x={RX} y={G + 62} size={40} ls={3}>2× EARTH</T>
    {children}
  </g>
);

/** But the air would hug the ground twice as tightly. */
const Hug: VShot = ({ t, d, f }) => (
  <VStage fam="clay" t={t} d={d} f={f}>
    <Range f={f} kR={mix(1, 0.5, ease(t, 10, 90))}>
      <Lev x={540} y={G + 2} h={110} frame={f} pose="stand" eyes="up" tilt={-14} wind={0.3} shade="#D8B8A2" />
    </Range>
  </VStage>
);

/** Today, the top of Everest: Lev climbs the left flank to the summit */
const Climb: VShot = ({ t, d, f }) => {
  const y = mix(G - 4, P + 40, ease(t, 0, d - 6));
  const [fx, fy] = flankAt(LX, y);
  return (
    <VStage fam="clay" t={t} d={d} f={f}>
      <Range f={f}>
        <Lev x={fx} y={fy + 2 + Math.abs(Math.sin(t / 3)) * -4} h={100} frame={f} pose="stand" lean={14} eyes="squint" wind={0.7} shade="#D8B8A2" />
        <Pop t={t} a={14} cx={LX} cy={P - 70}><Tag x={LX} y={P - 70} text="EVEREST" size={38} /></Pop>
      </Range>
    </VStage>
  );
};

const summitLev = (f: number, eyes: "up" | "happy" | "wide" = "happy") => (
  <Lev x={LX - 70} y={P + 52} h={100} frame={f} pose="point" hands={{ front: [60, -126] }} eyes={eyes} wind={0.7} shade="#D8B8A2" />
);

/** ...about a third of the air you breathe at sea level */
const Third: VShot = ({ t, d, f }) => (
  <VStage fam="clay" t={t} d={d} f={f}>
    <Range f={f}>
      <VFlag x={LX} y={P} big="1/3" small="OF THE AIR LEFT UP HERE" f={f} card={ease(t, 6, 30)} pole={ease(t, 0, 10)} />
      {summitLev(f)}
    </Range>
  </VStage>
);

/** On this Earth, at that same height: a dashed level slides across */
const SameHeight: VShot = ({ t, d, f }) => {
  const x1 = mix(LX + 30, RX + 140, ease(t, 6, 50));
  return (
    <VStage fam="clay" t={t} d={d} f={f}>
      <Range f={f}>
        <VFlag x={LX} y={P} big="1/3" small="OF THE AIR LEFT UP HERE" f={f} card={1} />
        <path d={`M ${LX + 30} ${P} H ${x1}`} stroke={CHALK} strokeWidth={6} strokeDasharray="18 12" strokeDashoffset={-t * 2} />
        <circle cx={x1} cy={P} r={10} fill={CHALK} />
        <Pop t={t} a={44} cx={RX} cy={P + 70}><Tag x={RX + 10} y={P + 90} text="SAME HEIGHT" size={36} /></Pop>
        {summitLev(f, "up")}
      </Range>
    </VStage>
  );
};

/** ...you'd have about an eighth */
const Eighth: VShot = ({ t, d, f }) => (
  <VStage fam="clay" t={t} d={d} f={f}>
    <Range f={f}>
      <VFlag x={LX} y={P} big="1/3" small="OF THE AIR LEFT UP HERE" f={f} card={1} />
      <VFlag x={RX} y={P} big="1/8" small="SAME HEIGHT, 2× EARTH" f={f} card={ease(t, 4, 26)} pole={ease(t, 0, 8)} />
      <Pop t={t} a={30} cx={960} cy={620}><STPill x={960} y={620} text="OUR SUM" align="middle" size={26} /></Pop>
      {summitLev(f, "wide")}
    </Range>
  </VStage>
);

// ------------------------------------------------------------------ line 30
const Y5 = G - 5 * PXKM;
/** Just five kilometres up: a flag climbs the right flank to 5 km */
const FiveUp: VShot = ({ t, d, f }) => {
  const cy = mix(G - 6, Y5, ease(t, 6, 96));
  const [fx, fy] = flankAt(RX, cy);
  return (
    <VStage fam="clay" t={t} d={d} f={f}>
      <Range f={f}>
        <VFlag x={LX} y={P} big="1/3" small="OF THE AIR LEFT UP HERE" f={f} card={1} />
        <path d={`M ${fx - 10} ${G} V ${fy}`} stroke={CHALK} strokeWidth={5} strokeDasharray="10 10" opacity={0.6} />
        <circle cx={fx} cy={fy} r={9} fill={INK} />
        <VFlag x={fx} y={fy} big="5 km" small="UP THE MOUNTAIN" f={f} card={ease(t, 92, 112)} cardX={RX + 50} />
        <Lev x={fx - 40} y={fy + 6} h={90} frame={f} pose="stand" lean={14} eyes="squint" wind={0.6} shade="#D8B8A2" />
      </Range>
    </VStage>
  );
};

/** ...as thin as the top of Everest is today: the two points link */
const Match: VShot = ({ t, d, f }) => {
  const [fx, fy] = flankAt(RX, Y5);
  const p = ease(t, 4, 40);
  const mx = mix(LX + 20, fx, p), my = mix(P, fy, p);
  return (
    <VStage fam="clay" t={t} d={d} f={f}>
      <Range f={f}>
        <VFlag x={LX} y={P} big="1/3" small="OF THE AIR LEFT UP HERE" f={f} card={1} />
        <circle cx={fx} cy={fy} r={9} fill={INK} />
        <VFlag x={fx} y={fy} big="5 km" small="UP THE MOUNTAIN" f={f} card={1} cardX={RX + 50} />
        <path d={`M ${LX + 20} ${P} L ${mx} ${my}`} stroke={CHALK} strokeWidth={6} strokeDasharray="16 12" strokeDashoffset={-t * 2} />
        {[0, 1].map((i) => {
          const a = (t + i * 20) % 40;
          return <circle key={i} cx={LX} cy={P} r={14 + a * 1.4} fill="none" stroke={CHALK} strokeWidth={4} opacity={(1 - a / 40) * 0.8} />;
        })}
        <Pop t={t} a={36} cx={540} cy={1010}><Tag x={540} y={1010} text="SAME THIN AIR" size={44} /></Pop>
        <Lev x={fx - 40} y={fy + 6} h={90} frame={f} pose="point" hands={{ front: [60, -130] }} facing={-1} eyes="wide" wind={0.6} shade="#D8B8A2" />
      </Range>
    </VStage>
  );
};

/** And the mountains themselves would only stand about half as tall. */
const Shrink: VShot = ({ t, d, f }) => {
  const k = mix(1, 0.5, ease(t, 10, 80));
  const peak = G - (G - P) * k;
  return (
    <VStage fam="clay" t={t} d={d} f={f}>
      <Range f={f} mR={k} ghostR>
        <VFlag x={LX} y={P} big="1/3" small="OF THE AIR LEFT UP HERE" f={f} card={1} />
        <Pop t={t} a={70} cx={RX} cy={peak - 70}><Tag x={RX} y={peak - 80} text="HALF AS TALL" size={44} /></Pop>
        <Lev x={560} y={G + 2} h={110} frame={f} pose="shrug" eyes={t > 70 ? "wide" : "up"} tilt={mix(-14, 0, ease(t, 10, 80))} wind={0.3} shade="#D8B8A2" />
      </Range>
    </VStage>
  );
};

export const SHOTS_03: VShot[][] = [
  [beats([0, 100, 221, 309], [Swell, Weighs, Buckets, Piggy])],
  [beats([0, 116, 190, 305, 402], [Hug, Climb, Third, SameHeight, Eighth])],
  [beats([0, 120, 203], [FiveUp, Match, Shrink])],
];
