// STS01 (eight-times): ST01 lines [0, 1, 2]. Shot bodies only; layout rules in lib/suppose/vshort.tsx.
// Numbers on screen (all spoken here): ×2 (twice as wide / twice as hard), cubes 1-2-4-8, ×8.
import React from "react";
import { VShot } from "../../lib/suppose/vshort";
import { GroundShadow } from "../../lib/illustrated/light";
import { mixHex } from "../../lib/illustrated/palette";
import { BRASS, BRASS_DARK, CHALK, INK, LIME, SUPPOSE, TERRA } from "../../lib/suppose/palette";
import { Lev } from "../../lib/suppose/lev";
import { Lever, leverTip } from "../../lib/suppose/devices";
import { Earth } from "../../lib/suppose/frames";
import { Ball, cubeEdges, drawSegs, DownArrow, SugarCube, CUBE_DX, CUBE_DY } from "../ST01-earth-twice-as-big/acts/cold-parts";
import { Arrow, beats, Bracket, ease, lin, MossLedge, mix, overshoot, Pop, Pt, rnd, Rings, T, Tag, VStage } from "./vparts-a";

const CH = SUPPOSE.chalk;

// ------------------------------------------------------------------ line 0: the pull
const G = 1180;
const PIV: Pt = [640, G];
const LEN = 240, LEVH = 210, LS = LEVH / 170;
const levOnLever = (angle: number) => {
  const tip = leverTip(PIV[0], PIV[1], LEN, angle);
  const feet = Math.min(G - 4, tip[1] + 182 * LS);
  return { x: tip[0] - 48 * LS, y: feet, hand: [48, (tip[1] - feet) / LS] as Pt };
};
const EC: Pt = [540, 640];

/** Lev rubs his hands, hops onto the knob and hauls the lever SIZE ×2 */
const PullA: VShot = ({ t, d, f }) => {
  const angle = t < 34 ? -18 : mix(-18, -38, ease(t, 34, 66));
  const hang = levOnLever(angle);
  const rub = Math.sin(t * 0.8);
  let lx = 300, ly = G - 4, pose: "stand" | "pull" = "stand", lean = -4 + 3 * Math.sin(t / 6);
  let hands: { front: Pt; back: Pt } = { front: [30 + 9 * rub, -82], back: [20 - 9 * rub, -86] };
  if (t >= 20) {
    const h0 = levOnLever(-18);
    const hop = ease(t, 20, 34);
    lx = mix(300, h0.x, hop);
    ly = mix(G - 4, hang.y, hop) - Math.sin(hop * Math.PI) * 60;
    pose = "pull";
    lean = mix(6, -10, hop);
    hands = { front: [mix(30, 48, hop), mix(-82, hang.hand[1], hop)], back: [mix(20, 38, hop), mix(-86, hang.hand[1] + 10, hop)] };
    if (t >= 34) {
      lx = hang.x;
      ly = hang.y;
      hands = { front: hang.hand, back: [hang.hand[0] - 10, hang.hand[1] + 10] };
    }
  }
  return (
    <VStage fam="moss" t={t} d={d} f={f}>
      <Earth cx={EC[0]} cy={EC[1]} r={150 * (1 + 0.15 * ease(t, 60, d + 30))} />
      <MossLedge y={G} />
      <Lever x={PIV[0]} y={PIV[1]} len={LEN} angle={angle} plate="SIZE ×2" glow={0.25 + 0.3 * ease(t, 34, 66)} />
      <Lev x={lx} y={ly} h={LEVH} frame={f} pose={pose} hands={hands} lean={lean} eyes={t < 18 ? "happy" : "squint"} wind={t >= 20 ? 0.9 : 0.4} shade="#9FB7A6" />
    </VStage>
  );
};

/** the swell: Earth grows to twice the width past its chalk outline; SAME ROCK / OCEANS / AIR pop in */
const PullB: VShot = ({ t, d, f }) => {
  const g = overshoot(lin(t, 0, 40));
  const R = mix(172, 300, g);
  const hang = levOnLever(-38);
  return (
    <VStage fam="moss" t={t} d={d} f={f}>
      <Rings cx={EC[0]} cy={EC[1]} r={R} t={t} t0={2} n={4} />
      <Earth cx={EC[0]} cy={EC[1]} r={R} />
      <circle cx={EC[0]} cy={EC[1]} r={150} fill="none" stroke={CHALK} strokeWidth={6} strokeDasharray="20 13" opacity={0.95 * ease(t, 8, 24)} />
      <T x={EC[0]} y={EC[1] + 12} size={36} ls={3} op={ease(t, 30, 44)}>OUR EARTH</T>
      <Pop t={t} a={24} cx={330} cy={470}><Tag x={330} y={470} text="SAME ROCK" /></Pop>
      <Pop t={t} a={60} cx={730} cy={800}><Tag x={730} y={800} text="SAME OCEANS" /></Pop>
      <Pop t={t} a={98} cx={800} cy={360}><Tag x={800} y={360} text="SAME AIR" /></Pop>
      <MossLedge y={G} />
      <Lever x={PIV[0]} y={PIV[1]} len={LEN} angle={-38} plate="SIZE ×2" glow={0.5} />
      <Lev x={hang.x} y={hang.y} h={LEVH} frame={f} pose="pull" hands={{ front: hang.hand, back: [hang.hand[0] - 10, hang.hand[1] + 10] }} lean={-10} eyes={t > 30 ? "wide" : "squint"} tilt={t > 30 ? -10 : 0} wind={0.9} shade="#9FB7A6" />
    </VStage>
  );
};

/** "just twice the planet": Lev rides on top of the big Earth; a width bracket draws; the Counter pops */
const PullC: VShot = ({ t, d, f }) => {
  const cy = mix(600, 780, ease(t, 0, 24));
  const R = 300;
  return (
    <VStage fam="moss" t={t} d={d} f={f} counter={t >= 20 ? { label: "SIZE", value: "×2" } : undefined}>
      <g transform={`rotate(${t * 0.25} 540 ${cy})`}>
        <Earth cx={540} cy={cy} r={R} seed={4} />
      </g>
      <circle cx={540} cy={cy} r={150} fill="none" stroke={CHALK} strokeWidth={6} strokeDasharray="20 13" opacity={0.9} />
      <T x={540} y={cy + 12} size={36} ls={3}>OUR EARTH</T>
      <Lev x={540} y={cy - R + 2} h={130} frame={f} pose="point" hands={{ front: [62, -150] }} eyes="happy" wind={0.6} shade="#9FB7A6" />
      <Bracket x0={240} x1={840} y={cy + R + 36} label="TWICE AS WIDE" p={ease(t, 6, 34)} size={44} />
    </VStage>
  );
};

// ------------------------------------------------------------------ line 1: bars, cubes, balls
/** "sounds like a big change. It's much bigger than that." width goes ×2; the stuff inside shoots off the top */
const BarsA: VShot = ({ t, d, f }) => {
  const base = 1150, U = 200;
  const h1 = mix(U, 2 * U, ease(t, 8, 56));
  const g2 = ease(t, 96, 150);
  const h2 = mix(U, 1000, g2);
  const top2 = Math.max(base - h2, 330);
  const bob = Math.sin(t / 5) * 8;
  return (
    <VStage fam="chalk" t={t} d={d} f={f}>
      <GroundShadow x={540} y={base + 6} rx={420} opacity={0.18} />
      <path d={`M 60 ${base} H 1020`} stroke={INK} strokeWidth={6} strokeLinecap="round" />
      <rect x={180} y={base - U} width={220} height={U} fill="none" stroke={INK} strokeWidth={4} strokeDasharray="14 10" opacity={0.5} />
      <rect x={180} y={base - h1} width={220} height={h1} rx={10} fill={TERRA} opacity={0.92} />
      <rect x={180} y={base - h1} width={220} height={18} rx={9} fill="#E8987A" opacity={0.7} />
      <T x={290} y={base + 60} size={42} fill={INK} ls={2}>WIDTH</T>
      <T x={290} y={base - h1 - 26} size={80} fill={INK} op={ease(t, 40, 56)}>×2</T>
      <rect x={640} y={base - U} width={220} height={U} fill="none" stroke={INK} strokeWidth={4} strokeDasharray="14 10" opacity={0.5} />
      {g2 > 0 ? (
        <g>
          <rect x={640} y={base - h2} width={220} height={h2} rx={10} fill={mixHex(TERRA, INK, 0.25)} opacity={0.92} />
          {Array.from({ length: 6 }, (_, i) => {
            const a = (t * 9 + i * 120) % 700;
            return <path key={i} d={`M 670 ${base - a} h 40 M 790 ${base - a - 50} h 40`} stroke={CHALK} strokeWidth={5} strokeLinecap="round" opacity={0.35} />;
          })}
        </g>
      ) : null}
      <T x={750} y={base + 60} size={42} fill={INK} ls={2}>STUFF</T>
      <T x={750} y={g2 > 0 ? top2 + 120 + bob : base - U - 30} size={g2 > 0 ? 150 : 70} fill={g2 > 0 ? CHALK : INK} op={g2 > 0 ? 1 : 0.6}>?</T>
      <Lev x={520} y={base - 2} h={170} frame={f} pose={g2 > 0.3 ? "shrug" : "stand"} eyes={g2 > 0.2 ? "wide" : "up"} tilt={g2 > 0.2 ? 10 : -6} outline={INK} wind={0.3} />
    </VStage>
  );
};

const CA = 200, CBX = 360, CBY = 1080;
const DROPS = [
  { i: 0, j: 1, k: 0, t0: 4 }, { i: 1, j: 1, k: 0, t0: 13 }, { i: 0, j: 0, k: 0, t0: 22 }, { i: 1, j: 0, k: 0, t0: 31 },
  { i: 0, j: 1, k: 1, t0: 46 }, { i: 1, j: 1, k: 1, t0: 55 }, { i: 0, j: 0, k: 1, t0: 64 }, { i: 1, j: 0, k: 1, t0: 73 },
];
const FALL = 12;
const CubeScene: React.FC<{ t: number; d: number; f: number; draw: number; drops: boolean }> = ({ t, d, f, draw, drops }) => {
  const { d: path, head } = drawSegs(cubeEdges(CBX, CBY, CA * 2), draw);
  const landed = drops ? DROPS.filter((c) => t >= c.t0 + FALL).length : 0;
  const milestone = [8, 4, 2, 1].find((m) => landed >= m) ?? 0;
  const mAt = milestone ? DROPS[milestone - 1].t0 + FALL : 0;
  const order = drops ? [...DROPS].sort((a, b) => b.j - a.j || a.k - b.k || a.i - b.i) : [];
  return (
    <VStage fam="chalk" t={t} d={d} f={f}>
      <GroundShadow x={40 + CA * 0.7} y={CBY + 6} rx={150} opacity={0.22} />
      <SugarCube x={40} y={CBY} a={CA} />
      <GroundShadow x={CBX + CA * 1.3} y={CBY + 8} rx={300} opacity={0.16} />
      {order.map((c, n) => {
        if (t < c.t0) return null;
        const p = lin(t, c.t0, c.t0 + FALL);
        const x = CBX + c.i * CA + c.j * CA * CUBE_DX;
        const y = CBY - c.k * CA + c.j * CA * CUBE_DY - 900 * (1 - p * p);
        const land = t - (c.t0 + FALL);
        const sq = land >= 0 && land < 10 ? Math.sin((land / 10) * Math.PI) * 0.12 : 0;
        return <SugarCube key={n} x={x} y={y} a={CA} sx={1 + sq} sy={1 - sq} />;
      })}
      <path d={path} stroke={INK} strokeWidth={6} strokeDasharray="18 13" fill="none" strokeLinecap="round" opacity={drops ? 0.55 : 0.9} />
      {head ? <circle cx={head[0]} cy={head[1]} r={13} fill={INK} /> : null}
      {!drops ? <Bracket x0={CBX} x1={CBX + CA * 2} y={CBY + 44} label="TWICE AS WIDE" color={INK} p={ease(t, 20, 50)} size={38} /> : null}
      <Lev x={40 + CA * 0.62} y={CBY - CA - CA * 0.14} h={150} frame={f} pose={drops && landed >= 8 ? "shrug" : "stand"} eyes={drops ? (landed >= 8 ? "wide" : "up") : "open"} tilt={drops ? -8 : 4} outline={INK} wind={0.3} />
      {drops && milestone > 0 ? (
        <g transform={`translate(190 470) scale(${0.85 + 0.15 * overshoot(lin(t, mAt, mAt + 12))})`}>
          <rect x={-160} y={-140} width={320} height={260} rx={34} fill={INK} opacity={0.88} />
          <T x={0} y={60} size={200} fill={LIME}>{milestone}</T>
          <T x={0} y={104} size={30} ls={3} weight={800}>SMALL CUBES</T>
        </g>
      ) : null}
    </VStage>
  );
};
const CubeB: VShot = ({ t, d, f }) => <CubeScene t={t} d={d} f={f} draw={ease(t, 4, 58)} drops={false} />;
const CubeC: VShot = ({ t, d, f }) => <CubeScene t={t} d={d} f={f} draw={1} drops />;

// small balls pour into a ball twice as wide (radius 105 vs 210)
const BIG = { cx: 680, cy: 895, r: 210 };
const REF = { cx: 230, cy: 1000, r: 105 };
const MR = 17;
const REST: Pt[] = (() => {
  const out: Pt[] = [];
  const R = BIG.r - MR - 2;
  let row = 0;
  for (let y = BIG.cy + R; y > BIG.cy - R; y -= MR * 1.73) {
    const half = Math.sqrt(Math.max(0, R * R - (y - BIG.cy) ** 2));
    const off = row % 2 ? MR : 0;
    for (let x = BIG.cx - half + off; x <= BIG.cx + half; x += MR * 2) out.push([x, y]);
    row++;
  }
  return out.sort((a, b) => b[1] - a[1] || Math.abs(a[0] - BIG.cx) - Math.abs(b[0] - BIG.cx));
})();
const POUR_END = 150;
const SPAWN = (POUR_END - 24) / REST.length;
const SPOUT: Pt = [BIG.cx + 6, 470];
const PourScene: React.FC<{ T0: number; t: number; d: number; f: number; tagAt?: number }> = ({ T0, t, d, f, tagAt }) => {
  const TT = T0 + t;
  const gacc = 2.2;
  const solid = ease(TT, POUR_END + 4, POUR_END + 30);
  const tilt = mix(58, 10, ease(TT, POUR_END - 18, POUR_END + 6));
  return (
    <VStage fam="chalk" t={t} d={d} f={f}>
      <GroundShadow x={REF.cx} y={REF.cy + REF.r + 8} rx={110} opacity={0.22} />
      <Ball cx={REF.cx} cy={REF.cy} r={REF.r} />
      <GroundShadow x={BIG.cx} y={BIG.cy + BIG.r + 10} rx={220} opacity={0.2} />
      <circle cx={BIG.cx} cy={BIG.cy} r={BIG.r} fill={CHALK} opacity={0.55} />
      {REST.map((p, k) => {
        const age = TT - k * SPAWN;
        if (age < 0) return null;
        const tau = Math.sqrt((2 * (p[1] - SPOUT[1])) / gacc);
        const sx = SPOUT[0] + (rnd(k * 5) - 0.5) * 22;
        let x: number, y: number;
        if (age < tau) {
          y = SPOUT[1] + 0.5 * gacc * age * age;
          x = mix(sx, p[0], (age / tau) ** 2);
        } else {
          const b = age - tau;
          x = p[0];
          y = p[1] - Math.abs(Math.sin(b * 0.5)) * 10 * Math.exp(-b * 0.25);
        }
        return (
          <g key={k}>
            <circle cx={x} cy={y} r={MR} fill={TERRA} />
            <circle cx={x - 5} cy={y - 5} r={MR * 0.38} fill="#F2A07E" opacity={0.8} />
          </g>
        );
      })}
      {solid > 0 ? <g opacity={solid}><Ball cx={BIG.cx} cy={BIG.cy} r={BIG.r} /></g> : null}
      <circle cx={BIG.cx} cy={BIG.cy} r={BIG.r} fill="none" stroke={INK} strokeWidth={6} strokeDasharray="20 13" opacity={0.85 * (1 - solid * 0.7)} />
      <g transform={`translate(${SPOUT[0] - 40} ${SPOUT[1] - 20}) rotate(${tilt}) scale(1.2)`} opacity={1 - ease(TT, POUR_END, POUR_END + 14)}>
        <path d="M -70 -60 L 60 -60 L 50 50 Q 0 70 -60 50 Z" fill={mixHex(TERRA, INK, 0.2)} />
        <path d="M -70 -60 L 60 -60 L 56 -36 L -66 -36 Z" fill={CHALK} opacity={0.5} />
      </g>
      {solid > 0.5
        ? [0, 1, 2].map((k) => {
            const age = (t + k * 20) % 60;
            return <circle key={k} cx={BIG.cx} cy={BIG.cy} r={BIG.r + 8 + age * 3.2} fill="none" stroke={TERRA} strokeWidth={4} opacity={(1 - age / 60) * 0.5} />;
          })
        : null}
      <Bracket x0={BIG.cx - BIG.r} x1={BIG.cx + BIG.r} y={1150} label="TWICE AS WIDE" color={INK} p={ease(TT, 6, 30)} size={40} />
      {tagAt !== undefined ? (
        <Pop t={t} a={tagAt} cx={230} cy={700} n={14}>
          <T x={230} y={760} size={190} fill={INK}>×8</T>
          <T x={230} y={812} size={32} fill={CH.dim} ls={3} weight={800}>THE STUFF</T>
        </Pop>
      ) : null}
    </VStage>
  );
};
const BallsD: VShot = ({ t, d, f }) => <PourScene T0={0} t={t} d={d} f={f} />;
const BallsE: VShot = ({ t, d, f }) => <PourScene T0={72} t={t} d={d} f={f} tagAt={48} />;

// ------------------------------------------------------------------ line 2: the mass on a balance; the pull
/** eight of our Earths (radius 70) balance one twice as wide (radius 140) */
const Balance: VShot = ({ t, d, f }) => {
  const piv: Pt = [540, 640];
  const arm = 290, hang = 300;
  const drops = Array.from({ length: 8 }, (_, k) => 4 + k * 8);
  const landed = drops.filter((t0) => t >= t0 + 14).length;
  const target = -10 * (1 - landed / 8);
  const wob = Math.sin(t / 3) * 1.2 * (landed < 8 ? 1 : Math.exp(-Math.max(0, t - 74) / 12));
  const th = ((target + wob) * Math.PI) / 180;
  const eR: Pt = [piv[0] + arm * Math.cos(th), piv[1] + arm * Math.sin(th)];
  const eL: Pt = [piv[0] - arm * Math.cos(th), piv[1] - arm * Math.sin(th)];
  const pan = (e: Pt, w: number) => (
    <g>
      <path d={`M ${e[0]} ${e[1]} L ${e[0] - w / 2} ${e[1] + hang} M ${e[0]} ${e[1]} L ${e[0] + w / 2} ${e[1] + hang}`} stroke={CHALK} strokeWidth={3} opacity={0.6} />
      <path d={`M ${e[0] - w / 2 - 10} ${e[1] + hang} Q ${e[0]} ${e[1] + hang + 40} ${e[0] + w / 2 + 10} ${e[1] + hang} Z`} fill={BRASS} />
    </g>
  );
  const rows: Pt[] = [[-140, 0], [0, 0], [140, 0], [-140, 1], [0, 1], [140, 1], [-70, 2], [70, 2]];
  return (
    <VStage fam="moss" t={t} d={d} f={f}>
      <MossLedge y={1190} />
      <path d={`M 540 1190 L 540 ${piv[1]}`} stroke={BRASS_DARK} strokeWidth={22} strokeLinecap="round" />
      <path d="M 470 1190 L 540 1120 L 610 1190 Z" fill={BRASS_DARK} />
      <path d={`M ${eL[0]} ${eL[1]} L ${eR[0]} ${eR[1]}`} stroke={BRASS} strokeWidth={18} strokeLinecap="round" />
      <circle cx={piv[0]} cy={piv[1]} r={16} fill={BRASS_DARK} />
      {pan(eL, 300)}
      {pan(eR, 430)}
      <Earth cx={eL[0]} cy={eL[1] + hang - 144} r={140} seed={3} />
      {rows.map(([dx, row], k) => {
        const t0 = drops[k];
        if (t < t0) return null;
        const p = lin(t, t0, t0 + 14);
        const y = eR[1] + hang - 74 - row * 140 - 700 * (1 - p * p);
        return <Earth key={k} cx={eR[0] + dx} cy={y} r={70} seed={3} />;
      })}
      <T x={eL[0]} y={eL[1] + hang + 80} size={36} ls={2}>TWICE AS WIDE</T>
      <T x={eR[0]} y={eR[1] + hang + 80} size={36} ls={2}>{`${landed} OF OURS`}</T>
      <Pop t={t} a={74} cx={400} cy={430} n={14}>
        <rect x={220} y={335} width={360} height={190} rx={30} fill={INK} opacity={0.8} />
        <T x={400} y={455} size={120}>×8</T>
        <T x={400} y={505} size={30} ls={4} weight={800}>THE MASS</T>
      </Pop>
    </VStage>
  );
};

/** the ground pulls twice as hard: arrows rain on Lev; today's pull vs here, drawn to scale */
const PullHard: VShot = ({ t, d, f }) => {
  const gk = ease(t, 6, 60);
  const ER = 1500, ECY = 1150 + ER;
  const surf = (x: number) => ECY - Math.sqrt(ER * ER - (x - 540) ** 2);
  const L2 = mix(150, 300, gk);
  return (
    <VStage fam="moss" t={t} d={d} f={f} counter={{ label: "SIZE", value: "×2", sub: "PULL ×2" }}>
      <Earth cx={540} cy={ECY} r={ER} seed={5} />
      {Array.from({ length: 14 }, (_, i) => {
        const x = 440 + (i % 7) * 90 + (rnd(i * 3) - 0.5) * 30 + (i >= 7 ? 45 : 0);
        const floor = surf(x) - 8;
        const span = floor - 300;
        const v = 10 + 10 * gk + rnd(i * 7) * 4;
        const y = 300 + ((t * v + rnd(i * 11) * span) % span);
        const o = Math.min(1, Math.max(0, (floor - y) / 90)) * 0.7;
        return <DownArrow key={i} x={x} y={y} len={50 + 50 * gk} w={9 + 3 * gk} color={CHALK} opacity={o} />;
      })}
      <g transform={`translate(540 1150) scale(${1 + 0.05 * gk} ${1 - 0.09 * gk}) translate(-540 -1150)`}>
        <Lev x={540} y={1150} h={240} frame={f} pose="stand" lean={6 * gk} eyes={gk > 0.6 ? "squint" : "open"} tilt={-4 * gk} wind={-0.6} shade="#9FB7A6" />
      </g>
      <T x={150} y={450} size={34} ls={2} weight={800} op={0.85}>TODAY</T>
      <Arrow x0={150} y0={480} x1={150} y1={630} color={CHALK} w={12} op={0.6} dash="14 10" />
      <T x={300} y={450} size={34} ls={2}>HERE</T>
      <Arrow x0={300} y0={480} x1={300} y1={480 + L2} color={TERRA} w={20} head={44} />
      <Pop t={t} a={56} cx={300} cy={880}><T x={300} y={900} size={72}>×2</T></Pop>
    </VStage>
  );
};

export const SHOTS_01: VShot[][] = [
  [beats([0, 72, 205], [PullA, PullB, PullC])],
  [beats([0, 166, 235, 381], [BarsA, CubeB, CubeC, BallsD])],
  [beats([0, 130, 245], [BallsE, Balance, PullHard])],
];
