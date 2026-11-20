// STS06 (walk-limit): ST01 lines [37, 38, 39]. Shot bodies only; layout rules in lib/suppose/vshort.tsx.
// WITHHOLDS the answer (about 4 g): no gravity figure anywhere; the ladder's top rung and every gauge top read "?".
import React from "react";
import { VShot } from "../../lib/suppose/vshort";
import { Bloom } from "../../lib/illustrated/light";
import { rrect } from "../../lib/illustrated/shapes";
import { CHALK, INK, OCEAN, SUPPOSE, TERRA } from "../../lib/suppose/palette";
import { Bone, PendulumLeg, RungLadder, Treadmill, Walker } from "../ST01-earth-twice-as-big/acts/l05-parts";
import { T, TERRA_LIT, VArrow, VStage, ease, mix, pop } from "./vparts-b";

const CH = SUPPOSE.chalk;

const Floor: React.FC<{ y: number }> = ({ y }) => (
  <g>
    <rect x={-20} y={y} width={1120} height={500} fill={CH.far} opacity={0.6} />
    <path d={`M -20 ${y} H 1100`} stroke={CH.mid} strokeWidth={4} />
  </g>
);

/** A tall gauge with a "?" at the top (never a number). */
const Gauge: React.FC<{ x: number; top: number; bot: number; k: number; label: string; t: number }> = ({ x, top, bot, k, label, t }) => {
  const fy = mix(bot - 10, top + 10, Math.min(1, k));
  const near = k > 0.8 ? 0.5 + 0.5 * Math.sin(t / 2.5) : 0;
  return (
    <g>
      <path d={rrect(x - 34, top, 68, bot - top, 34)} fill={CHALK} stroke={INK} strokeWidth={5} />
      <path d={rrect(x - 24, fy, 48, bot - 10 - fy, 24)} fill={TERRA} />
      <path d={`M ${x - 52} ${top + 70} H ${x + 52}`} stroke={INK} strokeWidth={5} strokeDasharray="12 9" opacity={0.7 + 0.3 * near} />
      <T x={x} y={top - 26} size={64} fill={INK}>?</T>
      <T x={x} y={bot + 52} size={30} ls={2} fill={INK}>{label}</T>
    </g>
  );
};

/** Gravity arrows pressing down from the top, length and count growing with k. */
const PressArrows: React.FC<{ xs: number[]; y0: number; k: number; t: number }> = ({ xs, y0, k, t }) => (
  <g>
    {xs.map((x, i) => {
      const L = 50 + 120 * k + 8 * Math.sin(t / 4 + i);
      return <VArrow key={i} x0={x} y0={y0} x1={x} y1={y0 + L} color={OCEAN} w={10 + 5 * k} head={30 + 8 * k} op={0.85} />;
    })}
  </g>
);

// ------------------------------------------------------------------ line 37 · shot 1: how strong before people couldn't walk?
const WalkQuestion: VShot = ({ t, d, f }) => {
  const g = ease(t, 6, d - 10);
  const ground = 1060;
  const rungs = ["", "", "", "", "", ""];
  return (
    <VStage fam="chalk" t={t} d={d} f={f} push={0.03}>
      <Floor y={ground + 40} />
      <Bloom x={440} y={700} r={520} color={CH.light} strength={0.7} />
      <PressArrows xs={[300, 440, 580]} y0={330} k={g} t={t} />
      <T x={440} y={312} size={34} ls={3} fill={OCEAN}>GRAVITY</T>
      <Treadmill x={440} y={ground} w={600} t={t} speed={5.5 - 2 * g} />
      <Walker x={390} y={ground - 8} s={2.5} phase={t * (0.17 - 0.05 * g)} hunch={0.1 + 0.45 * g} frame={f} />
      <T x={890} y={318} size={84} fill={INK} opacity={0.7 + 0.3 * Math.sin(t / 5)}>?</T>
      <RungLadder x={890} top={350} bottom={1020} labels={rungs} lit={Math.min(4, Math.floor(g * 5))} frame={f} light labelSize={60} popLabel={1 + 0.15 * Math.sin(t / 5)} />
    </VStage>
  );
};

// ------------------------------------------------------------------ line 37 · shot 2: they tried two ways (two panels)
const TwoWays: VShot = ({ t, d, f }) => {
  const kTop = ease(t, 0, 22), kBot = ease(t, 16, 38);
  const panel = (y: number, h: number) => (
    <g>
      <path d={rrect(60, y, 960, h, 36)} fill={CH.light} stroke={CH.mid} strokeWidth={5} />
    </g>
  );
  const badge = (x: number, y: number, s: string) => (
    <g>
      <circle cx={x} cy={y} r={42} fill={INK} />
      <T x={x} y={y + 18} size={52} fill={CHALK}>{s}</T>
    </g>
  );
  const plates = [20, 40, 60].map((a) => ease(t, a, a + 10));
  const th = Math.sin((t / 40) * Math.PI * 2) * 0.4 * kBot;
  return (
    <VStage fam="chalk" t={t} d={d} f={f} push={0.02}>
      <g transform={`translate(${(-1100 * (1 - kTop)).toFixed(1)} 0)`}>
        {panel(290, 430)}
        {badge(140, 370, "1")}
        <T x={210} y={388} size={48} anchor="start" fill={INK}>BONES + MUSCLES</T>
        <Bone x={800} y0={470} y1={660} w={40} />
        {plates.map((k, i) => (k > 0 ? <path key={i} d={rrect(700, mix(300, 432 - i * 34, k), 200, 30, 12)} fill={TERRA} stroke={INK} strokeWidth={4} /> : null))}
        <path d={rrect(680, 452, 240, 18, 9)} fill={INK} />
      </g>
      <g transform={`translate(${(1100 * (1 - kBot)).toFixed(1)} 0)`}>
        {panel(760, 440)}
        {badge(140, 840, "2")}
        <T x={210} y={858} size={48} anchor="start" fill={INK}>EACH STEP</T>
        <path d={`M ${780 + Math.sin(-0.4) * 250} ${1150 - Math.cos(-0.4) * 250} A 250 250 0 0 1 ${780 + Math.sin(0.4) * 250} ${1150 - Math.cos(0.4) * 250}`} stroke={INK} strokeWidth={4} strokeDasharray="12 10" fill="none" opacity={0.5} />
        <PendulumLeg fx={780} fy={1150} L={250} th={th} />
      </g>
    </VStage>
  );
};

// ------------------------------------------------------------------ line 38 · shot 1: how much load can bones take?
const BoneLoad: VShot = ({ t, d, f }) => {
  const cx = 450;
  const plateAt = [10, 30, 50, 70];
  const load = plateAt.reduce((s, a) => s + ease(t, a + 6, a + 26), 0);
  const throb = load > 3.5 ? Math.sin(t / 2.4) * 8 : 0;
  const len = 30 + load * 34 + throb;
  const sink = load * 6;
  const mus = 1 + load * 0.1;
  const bones: [number, number][] = [[560, 790], [806, 1050]];
  return (
    <VStage fam="chalk" t={t} d={d} f={f} push={0.03}>
      <Bloom x={cx} y={760} r={520} color={CH.light} strength={0.7} />
      <T x={cx} y={340} size={52} ls={4} fill={INK}>LOAD</T>
      <g transform={`translate(0 ${sink})`}>
        {bones.map(([a, b], i) => <ellipse key={"m" + i} cx={cx + 30} cy={(a + b) / 2} rx={34 * mus} ry={(b - a) * 0.42} fill={TERRA_LIT} opacity={0.6} />)}
        <Bone x={cx} y0={560} y1={790} w={40} />
        <Bone x={cx} y0={806} y1={1050 - sink} w={40} />
        <circle cx={cx} cy={798} r={22} fill={TERRA} stroke={INK} strokeWidth={4} />
        <path d={rrect(cx - 140, 516, 280, 24, 12)} fill={INK} />
        {plateAt.map((a, i) => {
          if (t < a) return null;
          const k = ease(t, a, a + 12);
          const yy = mix(240, 516 - 36 * (i + 1), k);
          return <path key={i} d={rrect(cx - 115, yy, 230, 32, 13)} fill={TERRA} stroke={INK} strokeWidth={4} />;
        })}
      </g>
      {bones.map(([a, b], i) => {
        const my = (a + b) / 2 + sink;
        return (
          <g key={"a" + i}>
            <VArrow x0={cx - 80 - len} y0={my} x1={cx - 70} y1={my} color={INK} w={10} head={26} />
            <VArrow x0={cx + 110 + len} y0={my} x1={cx + 100} y1={my} color={INK} w={10} head={26} />
          </g>
        );
      })}
      <path d={`M 120 1080 H 760`} stroke={CH.mid} strokeWidth={5} strokeLinecap="round" />
      <Gauge x={860} top={420} bot={1010} k={load / 4.4} label="STRESS" t={t} />
    </VStage>
  );
};

// ------------------------------------------------------------------ line 38 · shot 2: or until muscles can't lift the body
const MuscleLift: VShot = ({ t, d, f }) => {
  const ground = 1060;
  const drops = [8, 30, 52, 74];
  const dk = drops.map((a) => ease(t, a, a + 14));
  const loadAt = (tt: number) => drops.reduce((s, a) => s + ease(tt, a, a + 14), 0);
  // stride phase integrates a speed that falls as the load climbs (never quite stops: strain, not a fall)
  let phase = 0;
  for (let i = 0; i < t; i++) phase += 0.17 * (1 - 0.2 * loadAt(i));
  const load = loadAt(t);
  const scroll = phase * 40;
  return (
    <VStage fam="chalk" t={t} d={d} f={f} push={0.03}>
      <Floor y={ground} />
      {Array.from({ length: 9 }, (_, i) => {
        const x = ((i * 140 - scroll) % 1260 + 1260) % 1260 - 90;
        return <path key={i} d={`M ${x} ${ground + 30} h 50`} stroke={CH.mid} strokeWidth={6} strokeLinecap="round" />;
      })}
      <Bloom x={420} y={760} r={520} color={CH.light} strength={0.7} />
      <PressArrows xs={[300, 470]} y0={340} k={load / 4} t={t} />
      <Walker x={400} y={ground} s={2.7} phase={phase} hunch={0.15 + 0.17 * load} packs={4} drop={dk} frame={f} />
      <Gauge x={860} top={420} bot={1010} k={load / 4.4} label="MUSCLE" t={t} />
    </VStage>
  );
};

// ------------------------------------------------------------------ line 39 · shot 1: each step as a swinging pendulum
const Pendulum: VShot = ({ t, d, f }) => {
  const fx = 540, fy = 1080, L = 540;
  const per = 52;
  const th = Math.sin((t / per) * Math.PI * 2) * 0.42;
  const ghosts = [6, 12, 18].map((lag) => Math.sin(((t - lag) / per) * Math.PI * 2) * 0.42);
  const arc = `M ${fx + Math.sin(-0.42) * L} ${fy - Math.cos(-0.42) * L} A ${L} ${L} 0 0 1 ${fx + Math.sin(0.42) * L} ${fy - Math.cos(0.42) * L}`;
  const bx = fx + Math.sin(th) * L, by = fy - Math.cos(th) * L;
  return (
    <VStage fam="chalk" t={t} d={d} f={f} push={0.03}>
      <Bloom x={fx} y={700} r={560} color={CH.light} strength={0.7} />
      <g opacity={ease(t, 0, 12)}>
        <T x={540} y={350} size={54} ls={2} fill={INK}>EACH STEP = A SWING</T>
      </g>
      <path d={arc} stroke={INK} strokeWidth={5} strokeDasharray="14 12" fill="none" opacity={0.5} />
      {ghosts.map((g, i) => (
        <circle key={i} cx={fx + Math.sin(g) * L} cy={fy - Math.cos(g) * L} r={48} fill={TERRA} opacity={0.18 - i * 0.05} />
      ))}
      <path d={`M 120 ${fy + 20} H 960`} stroke={CH.mid} strokeWidth={5} strokeLinecap="round" />
      <PendulumLeg fx={fx} fy={fy} L={L} th={th} />
      <VArrow x0={bx + (th > 0 ? 70 : -70)} y0={by - 10} x1={bx + (th > 0 ? 170 : -170)} y1={by - 10 + Math.abs(th) * 60} color={INK} w={8} head={24} op={Math.min(1, Math.abs(Math.cos((t / per) * Math.PI * 2)) * 1.4)} />
    </VStage>
  );
};

// ------------------------------------------------------------------ line 39 · shot 2: energy per step climbs with gravity
const EnergyClimb: VShot = ({ t, d, f }) => {
  const g = ease(t, 8, d - 12);
  const fx = 380, fy = 1080, L = 430;
  let ph = 0;
  for (let i = 0; i < t; i++) ph += (Math.PI * 2) / 52 * (1 + 0.6 * ease(i, 8, d - 12));
  const th = Math.sin(ph) * 0.4;
  const bx = fx + Math.sin(th) * L, by = fy - Math.cos(th) * L;
  const barX = 830, barTop = 420, barBot = 1010;
  const fill = mix(barBot - 10, barTop + 30, 0.12 + 0.8 * g);
  return (
    <VStage fam="chalk" t={t} d={d} f={f} push={0.03}>
      <Bloom x={fx} y={720} r={500} color={CH.light} strength={0.7} />
      <path d={`M 80 ${fy + 20} H 680`} stroke={CH.mid} strokeWidth={5} strokeLinecap="round" />
      <PendulumLeg fx={fx} fy={fy} L={L} th={th} />
      <VArrow x0={bx} y0={by + 56} x1={bx} y1={by + 110 + g * 170} color={OCEAN} w={12 + 6 * g} head={34} />
      <T x={fx} y={360} size={40} ls={3} fill={OCEAN}>GRAVITY CLIMBS</T>
      <path d={rrect(barX - 40, barTop, 80, barBot - barTop, 40)} fill={CHALK} stroke={INK} strokeWidth={5} />
      <path d={rrect(barX - 28, fill, 56, barBot - 12 - fill, 28)} fill={TERRA} />
      {[0.25, 0.5, 0.75].map((k) => <path key={k} d={`M ${barX - 40} ${mix(barBot, barTop, k)} h 18`} stroke={INK} strokeWidth={4} />)}
      <T x={barX} y={barTop - 30} size={64} fill={INK}>?</T>
      <T x={barX} y={barBot + 52} size={30} ls={2} fill={INK}>ENERGY</T>
      <g opacity={pop(t, 20, 12) > 0 ? 1 : 0}>
        <T x={barX} y={barBot + 92} size={26} ls={2} fill={CH.dim}>PER STEP</T>
      </g>
    </VStage>
  );
};

export const SHOTS_06: VShot[][] = [
  [WalkQuestion, TwoWays],
  [BoneLoad, MuscleLift],
  [Pendulum, EnergyClimb],
];
