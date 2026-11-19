// ST01 act "closer": shot bodies keyed by storyboard id (see ../shotlist.ts). Numbers on screen: the Ladder's rung
// labels, the dot wall's width axis and its 1.5 marker (ROUGHLY). K-06 = the end card.
import React from "react";
import { ease, mix, pop, ShotMap, ShotStage, LADDER_RUNGS } from "../shot";
import { Bloom } from "../../../lib/illustrated/light";
import { rnd } from "../../../lib/illustrated/motion";
import { AIR, CHALK, INK, LIME, ST_FONT, SUPPOSE, TERRA, OCEAN } from "../../../lib/suppose/palette";
import { Lev } from "../../../lib/suppose/lev";
import { STPill, Wordmark } from "../../../lib/suppose/devices";
import { Earth } from "../../../lib/suppose/frames";
import { Drift, RungLadder, Txt } from "./l05-parts";
import { AirIcon, BagIcon, CalendarIcon, Exhaust, MountainIcon, RocketIcon, wallDots, wallX } from "./closer-parts";

const MOSS = SUPPOSE.moss;
const CH = SUPPOSE.chalk;
type P2 = [number, number];

// the world ladder for K-01/K-02: rung i at y = 980 - 300 i
const LX = 900, LW = 200;
const RY = (i: number) => 980 - 300 * i;
const ICON_X = LX + LW / 2 + 150;
const WorldLadder: React.FC<{ f: number; pulse?: (i: number) => number; opacity?: number }> = ({ f, pulse, opacity = 1 }) => (
  <RungLadder x={LX} top={RY(0) + 150 - 1950} bottom={RY(0) + 150} labels={LADDER_RUNGS} lit={5} frame={f} width={LW} labelSize={56} pulse={pulse} opacity={opacity} />
);
const RungIcon: React.FC<{ i: number; s: number; f: number }> = ({ i, s, f }) => {
  const y = RY(i);
  switch (i) {
    case 1: return <BagIcon x={ICON_X} y={y - 10} s={s} />;
    case 2: return <AirIcon x={ICON_X} y={y - 10} s={s} frame={f} />;
    case 3: return <MountainIcon x={ICON_X} y={y - 10} s={s} tall={0.6} />;
    case 4: return <CalendarIcon x={ICON_X} y={y - 10} s={s} />;
    case 5: return <RocketIcon x={ICON_X} y={y - 10} s={s} />;
    default: return null;
  }
};
const camT = (fx: number, fy: number, s: number) => `translate(960 540) scale(${s.toFixed(4)}) translate(${(-fx).toFixed(2)} ${(-fy).toFixed(2)})`;
const EARTH0: P2 = [ICON_X, RY(0) - 6];

// K-01 camera, shared so K-02 starts where K-01 ends
const k01Cam = (t: number) => {
  const c = ease(t, 0, 200);
  const z = ease(t, 215, 300);
  return { fx: 1000, fy: mix(mix(760, -520, c), 260, z), s: mix(1, 0.6, z) };
};

export const SHOTS_CLOSER: ShotMap = {
  // the Ladder fully lit; an icon pops on each rung as the camera climbs; then it pulls out to the whole ladder
  "K-01": ({ t, f }) => {
    const cam = k01Cam(t);
    const popAt = (i: number) => {
      for (let q = 0; q < 220; q++) if (k01Cam(q).fy <= RY(i) + 260) return q;
      return 0;
    };
    const wave = (t - 300) / 6;
    return (
      <ShotStage fam="moss" t={t} f={f}>
        <Bloom x={960} y={540} r={700} color={MOSS.bounce} strength={0.18} />
        <g transform={camT(cam.fx, cam.fy, cam.s)}>
          <WorldLadder f={f} pulse={(i) => (t > 296 ? Math.max(0.12, 0.85 * (1 - Math.abs(wave - i))) : i === 5 ? 0.4 : 0.12)} />
          <g transform={`translate(${EARTH0[0]} ${EARTH0[1]}) scale(${pop(t, 0, 14)}) translate(${-EARTH0[0]} ${-EARTH0[1]})`}>
            <Earth cx={EARTH0[0]} cy={EARTH0[1]} r={56} />
          </g>
          {[1, 2, 3, 4, 5].map((i) => {
            const pa = popAt(i);
            const bob = Math.sin((f + i * 17) / 14) * 6;
            return <g key={i} transform={`translate(0 ${bob})`}><RungIcon i={i} s={pop(t, pa, 14) * 1.15} f={f} /></g>;
          })}
        </g>
      </ShotStage>
    );
  },

  // pull back down to the bottom rung: our small blue Earth glowing, then what it gives us pops round it
  "K-02": ({ t, f }) => {
    const start = k01Cam(330);
    const c = ease(t, 0, 160);
    const fx = mix(start.fx, EARTH0[0], c), fy = mix(start.fy, EARTH0[1], c);
    const s = Math.exp(mix(Math.log(start.s), Math.log(3.4), c));
    const glow = 0.35 + 0.5 * ease(t, 120, 200) + 0.08 * Math.sin(f / 10);
    const ring = (k: number) => pop(t, 180 + k * 30, 16);
    const orbit = (t - 180) * 0.0035;
    const icons = [0, 1, 2].map((k) => {
      const a = -Math.PI / 2 + orbit + (k - 1) * 1.15;
      return [960 + Math.cos(a) * 370, 560 + Math.sin(a) * 330] as P2;
    });
    return (
      <ShotStage fam="moss" t={t} f={f}>
        <g transform={camT(fx, fy, s)}>
          <WorldLadder f={f} opacity={1 - ease(t, 60, 140)} pulse={(i) => (i === 0 ? 0.6 : 0.1)} />
          <g opacity={1 - ease(t, 40, 110)}>{[1, 2, 3, 4, 5].map((i) => <RungIcon key={i} i={i} s={1.15} f={f} />)}</g>
          <Bloom x={EARTH0[0]} y={EARTH0[1]} r={56 * 2.4} color={AIR} strength={glow} />
          <Earth cx={EARTH0[0]} cy={EARTH0[1]} r={56} />
        </g>
        {t > 170 ? (
          <g>
            <AirIcon x={icons[0][0]} y={icons[0][1]} s={ring(0) * 1.3} frame={f} />
            <MountainIcon x={icons[1][0]} y={icons[1][1]} s={ring(1) * 1.3} tall={1.5} />
            <RocketIcon x={icons[2][0]} y={icons[2][1]} s={ring(2) * 1.3} flame={0.6} frame={f} />
          </g>
        ) : null}
      </ShotStage>
    );
  },

  // our Earth with a thick air halo; a rocket leaves easily; then the air is held on
  "K-03": ({ t, f }) => {
    const cx = 800, cy = 620, r = 270;
    const la = (-52 * Math.PI) / 180;
    const base: P2 = [cx + Math.cos(la) * (r + 34), cy + Math.sin(la) * (r + 34)];
    const dist = (q: number) => (q < 24 ? 0 : 0.5 * 0.09 * (q - 24) ** 2);
    const at = (q: number): P2 => [base[0] + Math.cos(la) * dist(q), base[1] + Math.sin(la) * dist(q)];
    const rp = at(t);
    const tug = ease(t, 180, 210);
    const levIn = pop(t, 190, 16);
    return (
      <ShotStage fam="moss" t={t} f={f}>
        <Drift t={t} dir={-1}>
          <Bloom x={cx} y={cy} r={r * 1.9} color={AIR} strength={0.55} spread={0.5} />
          <circle cx={cx} cy={cy} r={r + 46} fill={AIR} opacity={0.12} />
          <circle cx={cx} cy={cy} r={r + 24} fill={AIR} opacity={0.16} />
          {/* air dots circling in the halo; later they lean outward and get pulled back */}
          {Array.from({ length: 110 }, (_, i) => {
            const rr = r + 8 + rnd(i * 3) * 64;
            const a = rnd(i * 7) * Math.PI * 2 + f * (0.003 + rnd(i * 11) * 0.004);
            const out = tug * Math.max(0, Math.sin((t - 180) / 14 + rnd(i * 5) * 6)) * 46;
            return <circle key={i} cx={cx + Math.cos(a) * (rr + out)} cy={cy + Math.sin(a) * (rr + out)} r={3 + rnd(i) * 2.5} fill={AIR} opacity={0.75} />;
          })}
          <Earth cx={cx} cy={cy} r={r} seed={3} />
          {/* gravity holding on: inward chevrons */}
          {Array.from({ length: 10 }, (_, k) => {
            const a = (k / 10) * Math.PI * 2 + 0.3;
            if (Math.abs(Math.sin(a) + 1) < 0.2) return null; // keep the top clear for Lev
            const pr = r + 110 - Math.max(0, Math.sin(t / 9 + k)) * 18;
            const px = cx + Math.cos(a) * pr, py = cy + Math.sin(a) * pr;
            const deg = (a * 180) / Math.PI + 180;
            return (
              <g key={k} opacity={tug * 0.85} transform={`translate(${px} ${py}) rotate(${deg})`}>
                <path d="M -10 -14 L 8 0 L -10 14" stroke={CHALK} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            );
          })}
          {t >= 20 && rp[1] > -200 ? (
            <g>
              <Exhaust pos={(dt) => (t - dt < 24 ? null : at(t - dt))} />
              <RocketIcon x={rp[0]} y={rp[1]} s={1.15} rot={90 + (la * 180) / Math.PI} flame={ease(t, 18, 26)} frame={f} />
            </g>
          ) : null}
          {t < 24 ? <RocketIcon x={base[0]} y={base[1]} s={1.15} rot={90 + (la * 180) / Math.PI} flame={ease(t, 10, 24) * 0.6} frame={f} /> : null}
          {levIn > 0 ? (
            <g transform={`translate(${cx} ${cy - r + 4}) scale(${levIn}) translate(${-cx} ${-(cy - r + 4)})`}>
              <Lev x={cx - 10} y={cy - r + 6} h={110} frame={f} pose="point" hands={{ front: [62, -150] }} eyes="happy" tilt={-8} shade="#9FB7A6" wind={0.6} />
            </g>
          ) : null}
        </Drift>
      </ShotStage>
    );
  },

  // the mini dot wall: a marker slides to 1.5 widths, where the rocky ones stop
  "K-04": ({ t, f }) => {
    const axisY = 880;
    const dots = wallDots(axisY);
    const mw = mix(0.9, 1.5, ease(t, 70, 150));
    const mx = wallX(mw);
    const wave = (t - 160) / 2.2;
    return (
      <ShotStage fam="chalk" t={t} f={f}>
        <Drift t={t} k={0.6}>
          <g stroke={CH.far} strokeWidth={1.4} opacity={0.6}>
            {Array.from({ length: 33 }, (_, i) => <path key={`v${i}`} d={`M ${i * 60} 0 V 1080`} />)}
            {Array.from({ length: 19 }, (_, i) => <path key={`h${i}`} d={`M 0 ${i * 60} H 1920`} />)}
          </g>
          <Txt x={260} y={150} size={52} anchor="start">Where the rocky ones stop</Txt>
          {dots.map((d) => {
            const k = ease(t, d.col * 1.1 + d.j * 0.7, d.col * 1.1 + d.j * 0.7 + 14);
            if (k <= 0) return null;
            const rock = d.w < 1.6;
            const hi = rock && t > 160 ? Math.max(0, 1 - Math.abs(wave - d.col)) : 0;
            return <circle key={d.k} cx={d.x} cy={mix(-30, d.y, k)} r={6.2 + hi * 3} fill={rock ? TERRA : OCEAN} opacity={rock ? 0.95 : 0.55 + 0.37 * (1 - ease(t, 160, 200))} />;
          })}
          <path d={`M 240 ${axisY} H 1500`} stroke={INK} strokeWidth={4} strokeLinecap="round" />
          {[1, 1.5, 2, 3, 4].map((w) => (
            <g key={w}>
              <path d={`M ${wallX(w)} ${axisY} v 14`} stroke={INK} strokeWidth={3} />
              <text x={wallX(w)} y={axisY + 48} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={28} fill={INK}>{w}</text>
            </g>
          ))}
          <Txt x={880} y={axisY + 92} size={24} ls={2} fill={CH.dim} weight={800}>WIDTH, IN EARTHS</Txt>
          {/* the marker */}
          <g opacity={ease(t, 50, 66)}>
            <path d={`M ${mx} ${axisY - 4} V 300`} stroke={INK} strokeWidth={12} strokeLinecap="round" />
            <path d={`M ${mx} ${axisY - 4} V 300`} stroke={LIME} strokeWidth={6} strokeLinecap="round" />
            <path d={`M ${mx - 22} 268 L ${mx + 22} 268 L ${mx} 300 Z`} fill={LIME} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
            <STPill x={mx + 30} y={262} text="ROUGHLY" dark={false} />
          </g>
          <Lev x={1700} y={axisY} h={170} frame={f} facing={-1} pose="point" hands={{ front: [70, -140] }} eyes="open" tilt={8} wind={0.2} outline={INK} />
        </Drift>
      </ShotStage>
    );
  },

  // Lev points up the ladder at the viewer; rungs pulse upward
  "K-05": ({ t, f }) => {
    const raise = ease(t, 0, 18);
    const jab = t > 18 ? Math.sin((t - 18) / 5) * 6 : 0;
    const front: P2 = [mix(24, 72 + jab, raise), mix(-58, -162 - jab, raise)];
    const w = (t / 9) % 8;
    return (
      <ShotStage fam="moss" t={t} f={f}>
        <Drift t={t}>
          <Bloom x={1320} y={520} r={560} color={LIME} strength={0.12} />
          <rect x={-100} y={930} width={2120} height={300} fill={MOSS.near} />
          <path d={`M -100 930 H 2020`} stroke={MOSS.bounce} strokeWidth={4} opacity={0.6} />
          <RungLadder x={1320} top={110} bottom={960} labels={LADDER_RUNGS} lit={5} frame={f} width={150} labelSize={44}
            pulse={(i) => 0.15 + 0.8 * Math.max(0, 1 - Math.abs(w - i))} />
          <Lev x={660} y={932} h={340} frame={f} pose="point" hands={{ front }} eyes="open" tilt={6} shade="#9FB7A6" wind={0.5} />
        </Drift>
      </ShotStage>
    );
  },

  // end card: the wordmark; the Ladder's rungs light in turn
  "K-06": ({ t, f }) => {
    const lit = Math.min(5, Math.floor((t - 6) / 13));
    const fade = ease(t, 0, 16);
    return (
      <ShotStage fam="moss" t={t} f={f}>
        <Drift t={t} k={0.5}>
          <g opacity={fade}>
            <Bloom x={820} y={540} r={620} color={MOSS.bounce} strength={0.3} />
            <Wordmark x={820} y={590} size={150} />
            <RungLadder x={1580} top={250} bottom={840} labels={["", "", "", "", "", ""]} lit={lit} frame={f} width={84}
              pulse={(i) => (i === lit ? 0.6 + 0.2 * Math.sin(f / 7) : i < lit ? 0.12 : 0)} />
          </g>
        </Drift>
      </ShotStage>
    );
  },
};
