// ST01 act "l05" (5 · The last rung we could walk on): shot bodies keyed by storyboard id (see ../shotlist.ts).
// Numbers on screen (storyboard-prep §2): ×4, 4 g (walk limit), ×2; MODEL stamp on the heavy-world forest.
import React from "react";
import { ease, mix, pop, ShotMap, ShotStage, LADDER_RUNGS } from "../shot";
import { Bloom } from "../../../lib/illustrated/light";
import { rrect } from "../../../lib/illustrated/shapes";
import { BRASS, BRASS_DARK, CHALK, INK, LIME, OCEAN, SUPPOSE, TERRA } from "../../../lib/suppose/palette";
import { Lev } from "../../../lib/suppose/lev";
import { STPill } from "../../../lib/suppose/devices";
import { Earth } from "../../../lib/suppose/frames";
import {
  Arrow, Bone, Drift, HangingLever, PANEL, PendulumLeg, Panels, RungLadder, rungY, slamShake, SquatTree, Stamp, TallTreeOutline,
  TERRA_DARK, TERRA_LIGHT, Treadmill, Txt, Waddler, Walker,
} from "./l05-parts";

const CH = SUPPOSE.chalk;
const MOSS = SUPPOSE.moss;
const SAGE = SUPPOSE.sage;
const C4 = { label: "SIZE", value: "×4", sub: "GRAVITY 4 g" };
type P2 = [number, number];
const lerpPt = (a: P2, b: P2, k: number): P2 => [mix(a[0], b[0], k), mix(a[1], b[1], k)];

/** studio floor for chalk shots */
const Floor: React.FC<{ y: number }> = ({ y }) => (
  <g>
    <rect x={-100} y={y} width={2120} height={400} fill={CH.far} opacity={0.55} />
    <path d={`M -100 ${y} H 2020`} stroke={CH.mid} strokeWidth={4} />
  </g>
);

// the left (load) and right (swing) panel contents, shared by 5-02..5-04
const LoadPanel: React.FC<{ t: number; plates: number[]; live: boolean }> = ({ t, plates, live }) => {
  const cx = PANEL.L.x + 430;
  const load = plates.reduce((s, at) => s + ease(t, at + 6, at + 40), 0);
  const throb = live && load > 3.5 ? Math.sin(t / 2.6) * 9 : 0;
  const len = 34 + load * 38 + throb;
  const sink = load * 5;
  const mus = 1 + load * 0.08;
  const bones: P2[] = [[400, 620], [636, 840]];
  return (
    <g>
      <Txt x={cx} y={PANEL.y + 74} size={46} ls={4}>LOAD</Txt>
      <g transform={`translate(0 ${sink})`}>
        {bones.map(([a, b], i) => (
          <ellipse key={"m" + i} cx={cx + 26} cy={(a + b) / 2} rx={30 * mus} ry={(b - a) * 0.42} fill={TERRA_LIGHT} opacity={0.6} />
        ))}
        <Bone x={cx} y0={400} y1={620} />
        <Bone x={cx} y0={636} y1={840 - sink} />
        <circle cx={cx} cy={628} r={20} fill={TERRA} stroke={INK} strokeWidth={4} />
        <path d={rrect(cx - 120, 362, 240, 22, 11)} fill={INK} />
        {plates.map((at, i) => {
          if (t < at) return null;
          const k = ease(t, at, at + 10);
          const yy = mix(-140, 362 - 34 * (i + 1), k);
          return (
            <g key={"p" + i}>
              <path d={rrect(cx - 100, yy, 200, 30, 12)} fill={TERRA} stroke={INK} strokeWidth={4} />
              <path d={rrect(cx - 84, yy + 6, 90, 7, 3.5)} fill={TERRA_LIGHT} opacity={0.8} />
            </g>
          );
        })}
      </g>
      {bones.map(([a, b], i) => {
        const my = (a + b) / 2 + sink;
        return (
          <g key={"a" + i}>
            <Arrow x0={cx - 70 - len} y0={my} x1={cx - 64} y1={my} />
            <Arrow x0={cx + 100 + len} y0={my} x1={cx + 94} y1={my} />
          </g>
        );
      })}
      <path d={`M ${PANEL.L.x + 120} 880 H ${PANEL.L.x + 740}`} stroke={CH.mid} strokeWidth={5} strokeLinecap="round" />
    </g>
  );
};

const SwingPanel: React.FC<{ t: number; live: boolean; g: number }> = ({ t, live, g }) => {
  const cx = PANEL.R.x + 380;
  const fy = 860, L = 360;
  const th = live ? Math.sin((t / 56) * Math.PI * 2) * 0.42 : 0.3;
  const bx = cx + Math.sin(th) * L, by = fy - Math.cos(th) * L;
  const arc = `M ${cx + Math.sin(-0.42) * L} ${fy - Math.cos(-0.42) * L} A ${L} ${L} 0 0 1 ${cx + Math.sin(0.42) * L} ${fy - Math.cos(0.42) * L}`;
  const steps = live ? Math.floor((t + 14) / 28) : 0;
  const energy = Math.min(1, 0.16 + g * 0.62 + steps * 0.012);
  const barX = PANEL.R.x + 760, barTop = 300, barBot = 820;
  const fillTop = mix(barBot - 8, barTop + 8, energy);
  return (
    <g>
      <Txt x={cx + 20} y={PANEL.y + 74} size={46} ls={4}>SWING</Txt>
      <path d={arc} stroke={INK} strokeWidth={4} strokeDasharray="12 10" fill="none" opacity={0.55} />
      <path d={`M ${PANEL.R.x + 90} ${fy + 20} H ${PANEL.R.x + 660}`} stroke={CH.mid} strokeWidth={5} strokeLinecap="round" />
      <PendulumLeg fx={cx} fy={fy} L={L} th={th} />
      <Arrow x0={bx} y0={by + 56} x1={bx} y1={by + 100 + g * 110} color={OCEAN} w={10} />
      <path d={rrect(barX - 26, barTop, 52, barBot - barTop, 26)} fill={CH.sky[0]} stroke={INK} strokeWidth={4} />
      <path d={rrect(barX - 18, fillTop, 36, barBot - 8 - fillTop, 18)} fill={TERRA} />
      <Txt x={barX - 10} y={barBot + 50} size={24} ls={2}>ENERGY</Txt>
    </g>
  );
};

export const SHOTS_L05: ShotMap = {
  // the ×4 rung lights; a lime-line walker on a treadmill
  "5-01": ({ t, f }) => {
    const ground = 820;
    return (
      <ShotStage fam="chalk" t={t} f={f} counter={C4}>
        <Drift t={t}>
          <Floor y={ground + 40} />
          <Bloom x={840} y={560} r={520} color={CH.light} strength={0.7} />
          <Treadmill x={840} y={ground} t={t} speed={5.5} />
          <Walker x={780} y={ground - 8} s={1.9} phase={t * 0.17} hunch={0.3} frame={f} />
        </Drift>
        <RungLadder x={1810} top={330} bottom={1010} labels={LADDER_RUNGS.map((r, i) => (i === 5 && t < 10 ? "" : r))} lit={t < 10 ? 4 : 5} frame={f} light
          popLabel={t < 10 ? 1 : pop(t, 10, 14)} />
      </ShotStage>
    );
  },

  // split screen opens: two panels slide in
  "5-02": ({ t, f }) => (
    <ShotStage fam="chalk" t={t} f={f}>
      <Drift t={t} k={0.6}>
        <Panels k={ease(t, 0, 30)} fill={CH.light} edge={CH.mid} dimColor={CH.sky[0]}
          left={<LoadPanel t={t} plates={[36]} live={false} />}
          right={<SwingPanel t={t} live={t > 24} g={0.1} />} />
      </Drift>
    </ShotStage>
  ),

  // left: leg bones, stress arrows growing as weights stack
  "5-03": ({ t, f }) => (
    <ShotStage fam="chalk" t={t} f={f}>
      <Drift t={t} k={0.6}>
        <Panels k={1} active="L" fill={CH.light} edge={CH.mid} dimColor={CH.sky[0]}
          left={<LoadPanel t={t} plates={[20, 65, 110, 155]} live />}
          right={<SwingPanel t={0} live={false} g={0.1} />} />
      </Drift>
    </ShotStage>
  ),

  // right: the leg as an upside-down pendulum over a planted foot
  "5-04": ({ t, d, f }) => (
    <ShotStage fam="chalk" t={t} f={f}>
      <Drift t={t} k={0.6} dir={-1}>
        <Panels k={1} active="R" fill={CH.light} edge={CH.mid} dimColor={CH.sky[0]}
          left={<LoadPanel t={400} plates={[20, 65, 110, 155]} live={false} />}
          right={<SwingPanel t={t} live g={ease(t, 30, d - 20)} />} />
      </Drift>
    </ShotStage>
  ),

  // the walker takes weights 1-4 and holds at 4 g, straining
  "5-05": ({ t, f }) => {
    const ground = 820;
    const drops = [20, 62, 104, 146];
    const dk = drops.map((a) => ease(t, a, a + 14));
    const load = dk.reduce((s, k) => s + k, 0);
    const gx = 1400, gTop = 330, gBot = 790;
    const fillTop = mix(gBot - 10, gTop + 10, load / 4);
    const held = ease(t, 166, 184);
    return (
      <ShotStage fam="chalk" t={t} f={f} counter={C4}>
        <Drift t={t} dir={-1}>
          <Floor y={ground + 40} />
          <Bloom x={820} y={560} r={520} color={CH.light} strength={0.7} />
          <Treadmill x={820} y={ground} t={t} speed={5.5 - load * 0.6} />
          <Walker x={760} y={ground - 8} s={1.9} phase={t * 0.17 - 0.018 * drops.reduce((s, a) => s + Math.max(0, t - a - 7), 0)} hunch={0.15 + load * 0.17} packs={4} drop={dk} frame={f} />
          {/* gravity gauge: one notch per weight; the top notch is the walk limit */}
          <path d={rrect(gx - 34, gTop, 68, gBot - gTop, 34)} fill={CH.light} stroke={INK} strokeWidth={5} />
          {load > 0.02 ? <path d={rrect(gx - 24, fillTop, 48, gBot - 10 - fillTop, 24)} fill={TERRA} /> : null}
          {[1, 2, 3].map((i) => <path key={i} d={`M ${gx - 34} ${mix(gBot, gTop, i / 4)} h 18 M ${gx + 34} ${mix(gBot, gTop, i / 4)} h -18`} stroke={INK} strokeWidth={4} />)}
          <path d={`M ${gx - 62} ${gTop + 10} H ${gx + 62}`} stroke={INK} strokeWidth={6} strokeLinecap="round" />
          <g opacity={held} transform={`translate(${gx + 90} ${gTop + 40}) scale(${0.8 + 0.2 * pop(t, 166, 16)})`}>
            <Bloom x={80} y={-30} r={130} color={LIME} strength={0.45} />
            <Txt x={0} y={0} size={100} anchor="start">4 g</Txt>
            <rect x={4} y={18} width={160} height={10} rx={5} fill={LIME} />
            <Txt x={0} y={66} size={26} anchor="start" ls={3} fill={CH.dim}>WALK LIMIT</Txt>
          </g>
        </Drift>
      </ShotStage>
    );
  },

  // the ×4 globe outline grows beside the ×2 one
  "5-06": ({ t, f }) => {
    const g = ease(t, 6, 150);
    const r2 = 150, r4 = mix(r2, 2 * r2, g);
    const fillIn = ease(t, 120, 170);
    return (
      <ShotStage fam="moss" t={t} f={f}>
        <Drift t={t}>
          <Earth cx={520} cy={540} r={r2} />
          <Txt x={520} y={540 + r2 + 80} size={60} fill={CHALK}>×2</Txt>
          <g opacity={fillIn * 0.5}><Earth cx={1220} cy={540} r={r4} seed={5} /></g>
          {[0, 1, 2].map((i) => {
            const u = ((t + i * 20) % 60) / 60;
            return t > 20 ? <circle key={i} cx={1220} cy={540} r={r4 + u * 60} fill="none" stroke={CHALK} strokeWidth={3} opacity={(1 - u) * 0.35 * (1 - fillIn * 0.5)} /> : null;
          })}
          <circle cx={1220} cy={540} r={r4} fill="none" stroke={CHALK} strokeWidth={6} strokeDasharray="20 13" strokeDashoffset={-t * 2} />
          <Txt x={1220} y={540 + r4 + 84} size={72} fill={LIME}>×4</Txt>
        </Drift>
      </ShotStage>
    );
  },

  // the Ladder: ×2 tagged HARD, ×4 stamped END OF THE WALK
  "5-07": ({ t, f }) => {
    const top = 120, bot = 1000, n = 6, lx = 760;
    const y2 = rungY(top, bot, n, 4), y4 = rungY(top, bot, n, 5);
    const tagIn = ease(t, 12, 30);
    const swing = Math.sin(t / 9) * 9 * (0.4 + 0.6 * Math.exp(-t / 80));
    const sh = slamShake(t, 80);
    return (
      <ShotStage fam="chalk" t={t} f={f}>
        <Drift t={t} k={0.7}>
          <g transform={`translate(${sh} ${sh * 0.4})`}>
            <Bloom x={lx} y={540} r={560} color={CH.light} strength={0.8} />
            <RungLadder x={lx} top={top} bottom={bot} labels={LADDER_RUNGS} lit={5} frame={f} light width={120} labelSize={40}
              pulse={(i) => (i === 5 ? 0.4 + 0.2 * Math.sin(f / 8) : 0)} />
            <g opacity={tagIn} transform={`rotate(${swing - (1 - tagIn) * 40} ${lx + 60} ${y2})`}>
              <path d={`M ${lx + 60} ${y2} L ${lx + 150} ${y2 + 60}`} stroke={INK} strokeWidth={3} />
              <path d={rrect(lx + 130, y2 + 50, 170, 66, 16)} fill={TERRA} stroke={INK} strokeWidth={4} />
              <circle cx={lx + 150} cy={y2 + 64} r={6} fill={CH.light} stroke={INK} strokeWidth={2} />
              <Txt x={lx + 224} y={y2 + 96} size={38} fill={CHALK} ls={3}>HARD</Txt>
            </g>
            <Stamp x={lx + 520} y={y4 + 4} t={t} at={80} text="END OF THE WALK" color={TERRA_DARK} size={50} rot={-6} />
            <Lev x={lx - 300} y={bot + 20} h={110} frame={f} pose="stand" eyes={t > 88 ? "wide" : "up"} tilt={-12} outline={INK} wind={0.3} />
          </g>
        </Drift>
      </ShotStage>
    );
  },

  // heavy-world forest: short thick trees, low wide animals waddling
  "5-08": ({ t, f }) => {
    const ground = 830;
    const trees: [number, number, number, number][] = [[200, 330, 120, 1], [560, 400, 140, 2], [1010, 360, 110, 3], [1420, 420, 130, 4], [1790, 330, 110, 5]];
    const squash = ease(t, 150, 200);
    const showOld = ease(t, 120, 140) * (1 - ease(t, 210, 230));
    const tt = trees[2];
    return (
      <ShotStage fam="sage" t={t} f={f}>
        <Drift t={t} dir={-1}>
          <Bloom x={1400} y={240} r={460} color={SAGE.light} strength={0.6} />
          <path d={`M -100 ${ground - 120} Q 300 ${ground - 210} 700 ${ground - 140} T 1500 ${ground - 150} T 2050 ${ground - 130} V 1200 H -100 Z`} fill={SAGE.far} />
          <path d={`M -100 ${ground - 30} Q 500 ${ground - 70} 1000 ${ground - 36} T 2050 ${ground - 40} V 1200 H -100 Z`} fill={SAGE.mid} />
          <rect x={-100} y={ground} width={2120} height={400} fill={SAGE.near} />
          <path d={`M -100 ${ground} H 2020`} stroke={SAGE.bounce} strokeWidth={5} opacity={0.6} />
          {trees.map(([x, w, h, s]) => (
            <SquatTree key={s} x={x} y={ground + 6} w={w} h={h} seed={s} frame={f} trunk={TERRA_DARK} leaf={SAGE.near} leafLit={SAGE.bounce} leafDark={SAGE.shadow} />
          ))}
          <g opacity={showOld} transform={`translate(0 ${ground + 6}) scale(1 ${mix(1, 0.45, squash)}) translate(0 ${-(ground + 6)})`}>
            <TallTreeOutline x={tt[0]} y={ground + 6} w={tt[1]} h={560} color={INK} />
          </g>
          {[0, 1, 2].map((i) => {
            const xx = ((t * (2.2 + i * 0.4) + i * 760) % 2400) - 240;
            return <Waddler key={i} x={xx} y={ground + 60 + i * 52} s={0.95 + i * 0.12} p={t * 0.32 + i} body={i === 1 ? TERRA_DARK : TERRA} />;
          })}
          <STPill x={110} y={110} text="MODEL" dark={false} size={26} />
        </Drift>
      </ShotStage>
    );
  },

  // big MODEL stamp; Lev shrugs
  "5-09": ({ t, f }) => {
    const sh = slamShake(t, 14);
    const shr = t > 30 ? Math.pow(Math.max(0, Math.sin(((t - 30) / 40) * Math.PI)), 0.6) : 0;
    const draw = ease(t, 70, 175);
    const ground = 860;
    return (
      <ShotStage fam="chalk" t={t} f={f}>
        <Drift t={t} k={0.8}>
          <g transform={`translate(${sh} ${sh * 0.3})`}>
            <Floor y={ground} />
            <Bloom x={960} y={480} r={600} color={CH.light} strength={0.8} />
            <circle cx={1440} cy={520} r={190} fill="none" stroke={INK} strokeWidth={6} strokeDasharray={`${draw * 1194} 2000`} strokeLinecap="round" opacity={0.55} transform="rotate(-90 1440 520)" />
            <Txt x={1440} y={566} size={130} opacity={ease(t, 150, 175) * 0.5}>?</Txt>
            <Stamp x={760} y={360} t={t} at={14} text="MODEL" color={TERRA_DARK} size={120} rot={-7} sub="AN EDUCATED GUESS" />
            <Lev x={760} y={ground} h={260} frame={f} pose="stand" outline={INK} eyes={shr > 0.4 ? "closed" : "open"}
              tilt={shr * 12} hands={{ front: lerpPt([24, -58], [50, -104], shr), back: lerpPt([-24, -58], [-50, -104], shr) }} wind={0.25} />
          </g>
        </Drift>
      </ShotStage>
    );
  },

  // the Ladder fades; Lev hangs the lever on a hook
  "5-10": ({ t, d, f }) => {
    const ground = 900;
    const hx = 980, hy = 470;
    const lift = 1 - ease(t, 0, 30);
    const rel = Math.max(0, t - 34);
    const ang = t < 34 ? -6 * lift : 15 * Math.exp(-rel / 70) * Math.sin(rel / 6.5);
    const levH = 210, s = levH / 170;
    const levX = hx - 150;
    const holding = t < 34;
    // hands on the side of the hanging housing (within Lev's reach), lifting it onto the hook
    const hand: P2 = [(hx - 4 - 70 - levX) / s, (hy + 244 + lift * 90 - ground) / s];
    return (
      <ShotStage fam="sage" t={t} f={f}>
        <Drift t={t}>
          <Bloom x={hx} y={hy + 120} r={460} color={BRASS} strength={0.28} />
          <path d={rrect(hx - 340, hy - 70, 680, 70, 22)} fill={SUPPOSE.sage.near} stroke={SUPPOSE.sage.mid} strokeWidth={4} />
          <path d={`M ${hx} ${hy - 30} v 26 q 0 26 -18 26`} stroke={BRASS_DARK} strokeWidth={12} fill="none" strokeLinecap="round" />
          <path d={`M ${hx} ${hy - 30} v 26 q 0 26 -18 26`} stroke={BRASS} strokeWidth={6} fill="none" strokeLinecap="round" />
          <rect x={-100} y={ground} width={2120} height={300} fill={SUPPOSE.sage.near} />
          <path d={`M -100 ${ground} H 2020`} stroke={SUPPOSE.sage.bounce} strokeWidth={4} opacity={0.6} />
          <HangingLever hx={hx - 4} hy={hy - 2} angle={ang} plate="SIZE" dy={lift * 90} />
          <Lev x={levX} y={ground} h={levH} frame={f} pose={holding ? "pull" : "stand"} eyes={holding ? "squint" : "happy"} lean={holding ? -4 : 0}
            hands={holding ? { front: hand, back: [hand[0] - 8, hand[1] + 14] } : undefined} shade="#B9CBB0" outline={INK} wind={0.5} />
        </Drift>
        <RungLadder x={1700} top={250} bottom={980} labels={LADDER_RUNGS} lit={5} frame={f} opacity={1 - ease(t, 0, Math.min(60, d))} />
      </ShotStage>
    );
  },
};
