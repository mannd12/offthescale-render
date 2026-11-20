// ST02 act "l04" (4 · New York, measured): shot bodies keyed by storyboard id (../shotlist.ts).
// Numbers on screen (storyboard allowed list only): 60,722 (carried in), 761,719 · 15 MIN, 2026, 467,881 (2025, AFTER THE
// FINAL WHISTLE), 1.2 MILLION GAL [OUR SUM]. Every beat is a fraction of the shot length d (timings are estimated).
import React from "react";
import { ease, lin, mix, pop, ShotMap, ShotStage } from "../shot";
import { Bloom } from "../../../lib/illustrated/light";
import { rrect } from "../../../lib/illustrated/shapes";
import { mixHex } from "../../../lib/illustrated/palette";
import { rnd } from "../../../lib/illustrated/motion";
import { AIR, BRASS, CHALK, CHALK_SHADE, INK, OCEAN, SUPPOSE, TERRA } from "../../../lib/suppose/palette";
import { Lev } from "../../../lib/suppose/lev";
import { STPill } from "../../../lib/suppose/devices";
import {
  along, Arrow, Basin, ChapterBeat, Chevron, CREAM, FLUSHES, Hills, MAP_DOTS, MapSquares, NYCMap, Plant, polyD, polyLen, Pt, roll,
  SHOW_A, Sign, Stopwatch, TERRA_DARK, Txt, UseChart, WATER,
} from "./l04-parts";

const MOSS = SUPPOSE.moss;
const SAGE = SUPPOSE.sage;
const C761 = FLUSHES();
const SUB15 = "15 MIN AFTER THE SHOW";

// map + chart layout shared by 4-01 / 4-02
const MAPX = 70, MAPY = 200, MAPS = 0.74;
const CH = { x: 980, y: 340, w: 740, h: 460 };

/** a night skyline whose windows glow like TVs (4-04) */
const Skyline: React.FC<{ ground: number; f: number; tv: number }> = ({ ground, f, tv }) => {
  const blds: React.ReactNode[] = [];
  let x = -40;
  for (let i = 0; x < 1960; i++) {
    const w = 110 + rnd(i * 3 + 1) * 120;
    const h = 200 + rnd(i * 3 + 2) * 260;
    const top = ground - h;
    const wins: React.ReactNode[] = [];
    const cols = Math.floor((w - 30) / 34), rows = Math.floor((h - 40) / 46);
    for (let c = 0; c < cols; c++)
      for (let r = 0; r < rows; r++) {
        const s = i * 131 + c * 17 + r * 7;
        if (rnd(s) < 0.28) continue;
        const ph = rnd(s + 1) * 6.28;
        const fl = 0.55 + 0.45 * Math.sin(f / (2.2 + rnd(s + 2) * 2) + ph) * Math.sin(f / 7.3 + ph * 2);
        const on = rnd(s + 3) < 0.8;
        const col = rnd(s + 4) < 0.5 ? AIR : mixHex(AIR, OCEAN, 0.5);
        wins.push(
          <rect key={c + "-" + r} x={x + 18 + c * 34} y={top + 24 + r * 46} width={20} height={26} rx={3}
            fill={on ? col : CREAM} opacity={on ? (0.25 + 0.75 * fl) * tv + 0.12 : 0.35} />,
        );
      }
    blds.push(
      <g key={i}>
        <path d={rrect(x, top, w - 8, h + 20, 6)} fill={i % 2 ? MOSS.near : mixHex(MOSS.near, MOSS.mid, 0.4)} />
        {wins}
      </g>,
    );
    x += w;
  }
  return <g>{blds}</g>;
};

/** a timeline flag: pole up from the track, terracotta pennant, two-line label card */
const TFlag: React.FC<{ x: number; y: number; k: number; l1: string; l2: string; f: number }> = ({ x, y, k, l1, l2, f }) => {
  if (k <= 0) return null;
  const wv = Math.sin(f / 7) * 5;
  const top = y - 170;
  const w = Math.max(l1.length, l2.length) * 21 + 44;
  return (
    <g transform={`translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})`}>
      <path d={`M ${x} ${y} L ${x} ${top}`} stroke={CHALK} strokeWidth={6} strokeLinecap="round" />
      <path d={`M ${x} ${top} Q ${x + 40} ${top + 8 + wv} ${x + 72} ${top + 16 + wv} Q ${x + 40} ${top + 28} ${x} ${top + 36} Z`} fill={TERRA} />
      <path d={rrect(x - w / 2, top - 124, w, 108, 18)} fill={INK} opacity={0.8} />
      <path d={rrect(x - w / 2, top - 124, w, 108, 18)} fill="none" stroke={CHALK} strokeWidth={2} opacity={0.4} />
      <Txt x={x} y={top - 80} size={30} fill={CHALK} ls={1}>{l1}</Txt>
      <Txt x={x} y={top - 40} size={30} fill={CHALK} ls={1}>{l2}</Txt>
    </g>
  );
};

/** Statue silhouette (stylised), base at (x, y), height h */
const Statue: React.FC<{ x: number; y: number; h: number; f: number }> = ({ x, y, h, f }) => {
  const s = h / 560;
  const cu = mixHex(OCEAN, "#4F7F5A", 0.55);
  const stone = mixHex(CHALK_SHADE, SAGE.near, 0.25);
  const fl = Math.sin(f / 4) * 4;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* pedestal */}
      <path d="M -120 0 L -100 -40 H 100 L 120 0 Z" fill={stone} stroke={INK} strokeWidth={3} />
      <path d="M -80 -40 L -70 -230 H 70 L 80 -40 Z" fill={stone} stroke={INK} strokeWidth={3} />
      <path d="M -90 -230 H 90 V -252 H -90 Z" fill={stone} stroke={INK} strokeWidth={3} />
      <path d="M -40 -200 h 80 v 60 h -80 Z" fill={mixHex(stone, INK, 0.15)} />
      {/* figure */}
      <path d="M -46 -252 Q -52 -330 -36 -400 Q -30 -440 -14 -452 L 18 -452 Q 34 -430 38 -380 Q 48 -320 50 -252 Z" fill={cu} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      {/* tablet arm */}
      <path d="M -30 -400 L -56 -350 L -44 -342" stroke={cu} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M -70 -372 L -44 -380 L -36 -320 L -62 -312 Z" fill={cu} stroke={INK} strokeWidth={3} />
      {/* torch arm */}
      <path d="M 18 -440 L 34 -500 L 40 -528" stroke={INK} strokeWidth={20} fill="none" strokeLinecap="round" />
      <path d="M 18 -440 L 34 -500 L 40 -528" stroke={cu} strokeWidth={14} fill="none" strokeLinecap="round" />
      <path d="M 30 -528 h 22 l -4 14 h -14 Z" fill={cu} stroke={INK} strokeWidth={3} />
      <path d={`M 32 -530 Q 36 ${-552 - fl} 42 ${-566 - fl} Q 52 ${-550 + fl * 0.3} 50 -530 Z`} fill={BRASS} stroke={INK} strokeWidth={2.5} />
      {/* head + crown */}
      <circle cx={2} cy={-468} r={20} fill={cu} stroke={INK} strokeWidth={3} />
      {[-60, -30, 0, 30, 60].map((a) => {
        const r = (a * Math.PI) / 180;
        return <path key={a} d={`M ${2 + Math.sin(r) * 18} ${-478 - Math.cos(r) * 10} L ${2 + Math.sin(r) * 38} ${-482 - Math.cos(r) * 30}`} stroke={cu} strokeWidth={7} strokeLinecap="round" />;
      })}
    </g>
  );
};

export const SHOTS_L04: ShotMap = {
  // five-borough night map; the water-use line draws in and dips during the show
  "4-01": ({ t, d, f }) => {
    const p = mix(0.02, 0.6, ease(t, d * 0.04, d * 0.9));
    const inShow = Math.max(0, Math.min(1, (p - SHOW_A) / 0.06));
    return (
      <ShotStage fam="moss" t={t} f={f} counter={FLUSHES("60,722")}>
        <Bloom x={420} y={520} r={560} color={MOSS.bounce} strength={0.25} />
        <NYCMap x={MAPX} y={MAPY} s={MAPS} fam="moss">
          <MapSquares flash={AIR} glow={(i) => 0.15 + 0.1 * Math.sin(f / 9 + i) + inShow * (0.55 + 0.4 * Math.sin(f / (2 + (i % 5) * 0.6) + i * 1.7))} />
        </NYCMap>
        <UseChart {...CH} p={p} fam="moss" t={t} band={ease(t, d * 0.3, d * 0.45)} tag="2026" />
      </ShotStage>
    );
  },

  // the line spikes after the show; the Counter rolls to 761,719
  "4-02": ({ t, d, f }) => {
    const p = mix(0.6, 1, ease(t, d * 0.04, d * 0.6));
    const r0 = d * 0.08, r1 = d * 0.4;
    const value = roll(t, r0, r1, 60722, 761719);
    const hot = ease(t, d * 0.08, d * 0.2) * (0.7 + 0.3 * Math.sin(t / 5));
    const tag = pop(t, d * 0.62, 14);
    return (
      <ShotStage fam="moss" t={t} f={f} counter={FLUSHES(value, t > r1 ? SUB15 : undefined)}>
        <Bloom x={420} y={520} r={560} color={MOSS.bounce} strength={0.25} />
        <NYCMap x={MAPX} y={MAPY} s={MAPS} fam="moss">
          <MapSquares flash={CHALK} glow={(i) => {
            const at = mix(r0, r1, MAP_DOTS[i].r);
            const k = t < at ? 0 : Math.exp(-(t - at) / 16);
            return 0.18 + 0.82 * k + (t > at ? 0.2 : 0);
          }} />
        </NYCMap>
        <UseChart {...CH} p={p} fam="moss" t={t} tag="2026" hot={hot} />
        {tag > 0 ? (
          <g transform={`translate(${CH.x + 0.66 * CH.w} ${CH.y + 30}) scale(${tag})`}>
            <path d={rrect(30, -36, 300, 64, 32)} fill={CHALK} />
            <Txt x={180} y={8} size={28} ls={2} fill={INK}>AFTER THE SHOW</Txt>
            <path d="M 30 -4 L 4 4" stroke={CHALK} strokeWidth={6} strokeLinecap="round" />
          </g>
        ) : null}
      </ShotStage>
    );
  },

  // 2026 bar beside a small 2025 marker: AFTER THE FINAL WHISTLE 467,881
  "4-03": ({ t, d, f }) => {
    const base = 860, H = 560, bw = 230;
    const g26 = ease(t, d * 0.04, d * 0.3), g25 = ease(t, d * 0.3, d * 0.55);
    const h26 = H * g26, h25 = H * (467881 / 761719) * g25;
    const num = pop(t, d * 0.52, 14), cap = ease(t, d * 0.58, d * 0.68);
    const cmp = ease(t, d * 0.72, d * 0.86);
    const x25 = 700, x26 = 1120;
    const bar = (x: number, h: number, c: string, seed: number) => (
      <g>
        <path d={rrect(x - bw / 2, base - h, bw, Math.max(1, h), 16)} fill={c} />
        {h > 30
          ? [0, 1, 2].map((i) => {
              const u = ((t * 1.4 + i * 60 + seed * 23) % 180) / 180;
              const yy = base - u * h;
              return <path key={i} d={`M ${x - bw / 2 + 26} ${yy} q 30 -8 60 0 t 60 0 t 60 0`} stroke={CHALK} strokeWidth={4} fill="none" opacity={0.35 * Math.sin(u * Math.PI)} />;
            })
          : null}
        <path d={rrect(x - bw / 2 + 14, base - h + 10, 26, Math.max(0, h - 20), 13)} fill={CHALK} opacity={h > 40 ? 0.18 : 0} />
      </g>
    );
    return (
      <ShotStage fam="moss" t={t} f={f} counter={FLUSHES("761,719", SUB15)}>
        <Bloom x={900} y={560} r={620} color={MOSS.bounce} strength={0.3} />
        <path d={`M 420 ${base} H 1400`} stroke={MOSS.dim} strokeWidth={5} strokeLinecap="round" />
        {bar(x26, h26, AIR, 1)}
        {bar(x25, h25, mixHex(AIR, MOSS.mid, 0.45), 2)}
        {cmp > 0 ? <path d={`M ${x25 + bw / 2} ${base - h25} H ${mix(x25 + bw / 2, x26 + bw / 2, cmp)}`} stroke={CHALK} strokeWidth={4} strokeDasharray="14 10" opacity={0.7} /> : null}
        <Txt x={x26} y={base + 58} size={44} fill={MOSS.text} opacity={ease(t, d * 0.08, d * 0.2)}>2026</Txt>
        <Txt x={x26} y={base + 100} size={26} ls={2} fill={MOSS.dim} opacity={ease(t, d * 0.1, d * 0.22)}>AFTER HALFTIME</Txt>
        <Txt x={x25} y={base + 58} size={44} fill={MOSS.text} opacity={ease(t, d * 0.32, d * 0.42)}>2025</Txt>
        <g opacity={cap}><Txt x={x25} y={base + 100} size={26} ls={2} fill={CHALK}>AFTER THE FINAL WHISTLE</Txt></g>
        {num > 0 ? (
          <g transform={`translate(${x25} ${base - h25 - 40}) scale(${num})`}>
            <Txt x={0} y={0} size={76} fill={CHALK}>467,881</Txt>
          </g>
        ) : null}
        <Lev x={330} y={base} h={210} frame={f} pose={t > d * 0.5 ? "point" : "stand"} eyes={t > d * 0.5 ? "open" : "up"} tilt={t > d * 0.5 ? 4 : -6} wind={0.3} shade="#9FB7A6" />
      </ShotStage>
    );
  },

  // during the show the city's line dips; TVs glow in the windows
  "4-04": ({ t, d, f }) => {
    const p = mix(0.18, 0.6, ease(t, 0, d * 0.85));
    return (
      <ShotStage fam="moss" t={t} f={f} counter={C761}>
        <UseChart x={220} y={330} w={1200} h={240} p={p} fam="moss" t={t} tag="2026" color={CHALK} />
        <g transform={`translate(0 ${mix(30, 0, ease(t, 0, d))})`}>
          <Skyline ground={1080} f={f} tv={ease(t, 0, d * 0.25)} />
        </g>
      </ShotStage>
    );
  },

  // our sum: a pool beside a Statue silhouette, filling; 1.2 MILLION GAL + OUR SUM
  "4-05": ({ t, d, f }) => {
    const level = ease(t, d * 0.1, d * 0.85);
    const pour = ease(t, d * 0.05, d * 0.12) * (1 - ease(t, d * 0.84, d * 0.92));
    const head = pop(t, d * 0.16, 14), pill = ease(t, d * 0.26, d * 0.34);
    const far: [number, number, number] = [300, 1000, 640]; // x0, x1, y
    const near: [number, number, number] = [170, 1130, 860];
    const depth = 90;
    const open = `M ${far[0]} ${far[2]} L ${far[1]} ${far[2]} L ${near[1]} ${near[2]} L ${near[0]} ${near[2]} Z`;
    const wy = depth * (1 - level);
    const water = `M ${far[0]} ${far[2] + wy} L ${far[1]} ${far[2] + wy} L ${near[1]} ${near[2] + wy} L ${near[0]} ${near[2] + wy} Z`;
    const drops: React.ReactNode[] = [];
    if (pour > 0)
      for (let i = 0; i < 46; i++) {
        const u = ((t * (1.2 + rnd(i) * 0.6) + rnd(i + 9) * 100) % 60) / 60;
        const dx = mix(near[0] + 60, near[1] - 60, rnd(i * 3 + 1));
        const dy = mix(far[2], near[2], rnd(i * 3 + 2));
        const yy = mix(dy - 440, dy + wy, u);
        drops.push(<path key={i} d={`M ${dx} ${yy} q -5 10 0 16 q 5 -6 0 -16 Z`} fill={WATER} stroke={INK} strokeWidth={1.2} opacity={pour * Math.min(1, (1 - u) * 4)} />);
      }
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C761}>
        <Bloom x={1400} y={260} r={520} color={SAGE.light} strength={0.6} />
        <rect x={-80} y={760} width={2080} height={400} fill={mixHex(AIR, SAGE.mid, 0.35)} />
        {[0, 1, 2, 3].map((i) => {
          const xx = ((t * 1.5 + i * 520) % 2200) - 140;
          return <path key={i} d={`M ${xx} ${800 + i * 60} q 30 -10 60 0 t 60 0`} stroke={CHALK} strokeWidth={4} fill="none" opacity={0.5} />;
        })}
        <path d="M 1180 800 Q 1300 740 1520 750 Q 1660 760 1720 800 Z" fill={SAGE.near} />
        {/* the shore the pool sits on */}
        <path d="M -80 700 Q 500 680 1160 712 Q 1230 760 1200 1160 L -80 1160 Z" fill={SAGE.mid} />
        <path d="M -80 700 Q 500 680 1160 712 Q 1230 760 1200 1160" stroke={SAGE.near} strokeWidth={6} fill="none" opacity={0.6} />
        <Statue x={1440} y={780} h={540} f={f} />
        <path d={`M ${far[0] - 60} ${far[2] - 26} L ${far[1] + 60} ${far[2] - 26} L ${near[1] + 80} ${near[2] + 34} L ${near[0] - 80} ${near[2] + 34} Z`} fill={CHALK} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        <path d={`M ${near[0] - 80} ${near[2] + 34} L ${near[1] + 80} ${near[2] + 34} L ${near[1] + 80} ${near[2] + 64} L ${near[0] - 80} ${near[2] + 64} Z`} fill={CHALK_SHADE} stroke={INK} strokeWidth={4} />
        <defs><clipPath id="l04-pool"><path d={open} /></clipPath></defs>
        <path d={open} fill={mixHex(CHALK_SHADE, INK, 0.2)} />
        <g clipPath="url(#l04-pool)">
          <path d={`M ${far[0]} ${far[2]} L ${far[1]} ${far[2]} L ${far[1]} ${far[2] + depth} L ${far[0]} ${far[2] + depth} Z`} fill={CHALK_SHADE} />
          {level > 0.01 ? <path d={water} fill={OCEAN} /> : null}
          {level > 0.01 ? <path d={water} fill={AIR} opacity={0.3} /> : null}
          {level > 0.01
            ? [0, 1, 2, 3, 4].map((i) => {
                const u = ((t * 0.8 + i * 44) % 220) / 220;
                const yy = mix(far[2], near[2], u) + wy;
                const x0 = mix(far[0], near[0], u) + 80, x1 = mix(far[1], near[1], u) - 80;
                return <path key={i} d={`M ${x0 + (x1 - x0) * 0.2} ${yy} q 40 -8 80 0 t 80 0 M ${x0 + (x1 - x0) * 0.6} ${yy + 6} q 30 -6 60 0`} stroke={AIR} strokeWidth={4} fill="none" opacity={0.6 * Math.sin(u * Math.PI)} />;
              })
            : null}
        </g>
        <path d={open} fill="none" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        {drops}
        {head > 0 ? (
          <g transform={`translate(130 220) scale(${head}) translate(-130 -220)`}>
            <Txt x={130} y={250} size={104} anchor="start" fill={SAGE.text}>1.2 MILLION GAL</Txt>
          </g>
        ) : null}
        <g opacity={pill}><STPill x={136} y={318} text="OUR SUM" dark={false} size={26} /></g>
      </ShotStage>
    );
  },

  // timeline with three flags: START OF HALFTIME · END OF HALFTIME · END OF GAME
  "4-06": ({ t, d, f }) => {
    const X0 = 180, X1 = 1560, TY = 780;
    const ux = (u: number) => X0 + u * (X1 - X0);
    const flags: [number, string, string][] = [[0.38, "START OF", "HALFTIME"], [0.62, "END OF", "HALFTIME"], [1, "END OF", "GAME"]];
    const play = mix(0, 1.1, lin(t, d * 0.05, d * 0.9));
    const surge = (u: number) => flags.reduce((s, [a]) => s + (u < a ? Math.exp(-(((u - a) / 0.012) ** 2)) : Math.exp(-(u - a) / 0.035)), 0);
    const LY = 440, LH = 170;
    const pts: Pt[] = [];
    for (let i = 0; i <= 260; i++) {
      const u = (i / 260) * play;
      pts.push([ux(u), LY - (0.25 + 0.02 * Math.sin(u * 60) + 0.7 * surge(u)) * LH]);
    }
    const head = pts[pts.length - 1];
    return (
      <ShotStage fam="moss" t={t} f={f} counter={C761}>
        <Bloom x={860} y={420} r={700} color={MOSS.bounce} strength={0.25} />
        <rect x={ux(0.38)} y={TY - 14} width={ux(0.62) - ux(0.38)} height={28} rx={14} fill={MOSS.light} opacity={0.14} />
        <path d={`M ${X0} ${TY} H ${ux(1.1)}`} stroke={MOSS.dim} strokeWidth={8} strokeLinecap="round" />
        <path d={`M ${X0} ${TY} H ${ux(play)}`} stroke={CHALK} strokeWidth={8} strokeLinecap="round" />
        <Txt x={ux(0.19)} y={TY + 64} size={30} ls={4} fill={MOSS.dim}>GAME</Txt>
        <Txt x={ux(0.5)} y={TY + 64} size={30} ls={4} fill={MOSS.text}>HALFTIME SHOW</Txt>
        <Txt x={ux(0.81)} y={TY + 64} size={30} ls={4} fill={MOSS.dim}>GAME</Txt>
        <Txt x={X0} y={LY - LH - 30} size={24} ls={3} anchor="start" fill={MOSS.dim}>WATER USE</Txt>
        <path d={polyD(pts)} stroke={AIR} strokeWidth={8} fill="none" strokeLinejoin="round" />
        <circle cx={head[0]} cy={head[1]} r={12} fill={CHALK} />
        <path d={`M ${ux(play)} ${LY - LH - 10} V ${TY + 20}`} stroke={CHALK} strokeWidth={3} strokeDasharray="8 8" opacity={0.5} />
        {flags.map(([u, l1, l2], i) => {
          const k = pop(t, d * 0.05 + (u / 1.1) * d * 0.85, 14);
          return (
            <g key={i}>
              {k > 0 ? <circle cx={ux(u)} cy={TY} r={14} fill={TERRA} /> : null}
              <TFlag x={ux(u)} y={TY - 14} k={k} l1={l1} l2={l2} f={f} />
            </g>
          );
        })}
        <Lev x={1750} y={1000} h={150} frame={f} facing={-1} pose="stand" eyes="open" tilt={-6} wind={0.3} shade="#9FB7A6" />
      </ShotStage>
    );
  },

  // Hillview reservoir as a blue basin; extra water arrows flow in; pressure holds
  "4-07": ({ t, d, f }) => {
    const ground = 900;
    const level = mix(0.4, 0.78, ease(t, d * 0.08, d * 0.75));
    const inPipe: Pt[] = [[-40, 560], [180, 560], [330, 600], [470, 626]];
    const outPipe: Pt[] = [[1530, 650], [1600, 660], [1640, 700], [1640, 760]];
    const L = polyLen(inPipe);
    const g2 = ease(t, d * 0.48, d * 0.6);
    const needle = -35 + Math.sin(t / 5) * 1.2;
    const gx = 1640, gy = 560;
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C761}>
        <Bloom x={1300} y={240} r={560} color={SAGE.light} strength={0.6} />
        <Hills fam="sage" ground={ground} t={t} f={f} />
        <path d={polyD(inPipe)} stroke={INK} strokeWidth={42} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={polyD(inPipe)} stroke={TERRA} strokeWidth={32} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <Basin x={1000} y={660} rx={520} ry={150} level={level} t={t} fam="sage" />
        {Array.from({ length: 7 }, (_, i) => {
          const s = (t * 4 + i * (L / 7)) % L;
          const [px, py] = along(inPipe, s);
          const [qx, qy] = along(inPipe, s + 4);
          return <Chevron key={i} x={px} y={py} a={(Math.atan2(qy - py, qx - px) * 180) / Math.PI} s={16} color={CHALK} />;
        })}
        {[0, 1, 2].map((i) => {
          const u = ((t * 2.2 + i * 40) % 120) / 120;
          return <Arrow key={i} x0={mix(380, 560, u)} y0={mix(610, 650, u)} x1={mix(380, 560, u) + 70} y1={mix(610, 650, u) + 10} color={OCEAN} w={9} head={22} opacity={Math.sin(u * Math.PI)} />;
        })}
        <Sign x={330} y={ground + 70} text="HILLVIEW RESERVOIR" size={30} />
        <g opacity={g2}>
          <path d={polyD(outPipe)} stroke={INK} strokeWidth={30} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d={polyD(outPipe)} stroke={TERRA} strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d={`M ${gx} ${gy + 76} V ${gy + 200}`} stroke={INK} strokeWidth={10} />
          <circle cx={gx} cy={gy} r={84} fill={CHALK} stroke={INK} strokeWidth={6} />
          <path d={`M ${gx - 60} ${gy + 20} A 64 64 0 1 1 ${gx + 60} ${gy + 20}`} stroke={SAGE.mid} strokeWidth={10} fill="none" strokeLinecap="round" />
          <path d={`M ${gx} ${gy} L ${gx + Math.sin((needle * Math.PI) / 180) * 62} ${gy - Math.cos((needle * Math.PI) / 180) * 62}`} stroke={TERRA_DARK} strokeWidth={8} strokeLinecap="round" />
          <circle cx={gx} cy={gy} r={10} fill={INK} />
          <Txt x={gx} y={gy + 62} size={20} ls={2} fill={INK}>PRESSURE</Txt>
        </g>
        <Lev x={1790} y={ground + 40} h={170} frame={f} facing={-1} pose={t > d * 0.62 ? "point" : "stand"} eyes={t > d * 0.62 ? "happy" : "open"} tilt={-4} wind={0.4} outline={INK} />
      </ShotStage>
    );
  },

  // map: flushes as dots popping all over town, spread out in time, not one wave
  "4-08": ({ t, d, f }) => {
    const span0 = d * 0.04, span1 = d * 0.92;
    const trunks: Pt[][] = [
      [[600, 80], [560, 170], [470, 230], [420, 400], [380, 540]],
      [[900, 420], [760, 450], [640, 470], [560, 520], [470, 600]],
      [[650, 720], [560, 700], [460, 660]],
      [[200, 860], [190, 760], [250, 690]],
    ];
    return (
      <ShotStage fam="moss" t={t} f={f} counter={C761}>
        <Bloom x={920} y={540} r={620} color={MOSS.bounce} strength={0.25} />
        <Txt x={110} y={560} size={60} anchor="start" fill={MOSS.text} opacity={ease(t, d * 0.2, d * 0.32)}>SPREAD OUT</Txt>
        <NYCMap x={520} y={110} s={0.9} fam="moss">
          {trunks.map((tr, i) => (
            <path key={i} d={polyD(tr)} stroke={WATER} strokeWidth={6} fill="none" strokeLinecap="round" strokeDasharray="18 16" strokeDashoffset={-t * 2} opacity={0.55} />
          ))}
          <MapSquares flash={CHALK} glow={(i) => {
            const at = mix(span0, span1, rnd(i * 7 + 5));
            const k = t < at ? 0 : Math.exp(-(t - at) / 10);
            return 0.15 + 0.85 * k;
          }} />
          {MAP_DOTS.map((dd, i) => {
            const at = mix(span0, span1, rnd(i * 7 + 5));
            const u = (t - at) / 22;
            if (u < 0 || u > 1) return null;
            return <circle key={i} cx={dd.x} cy={dd.y} r={10 + u * 36} fill="none" stroke={WATER} strokeWidth={4} opacity={1 - u} />;
          })}
        </NYCMap>
      </ShotStage>
    );
  },

  // a big arrow from a far corner to the treatment plant; stopwatches on buildings run for different times
  "4-09": ({ t, d, f }) => {
    const MX = 400, MY = 110, MS = 0.9;
    const W = (p: Pt): Pt => [MX + p[0] * MS, MY + p[1] * MS];
    const route: Pt[] = ([[925, 440], [800, 510], [660, 585], [540, 630], [470, 650]] as Pt[]).map(W);
    const plant = W([455, 655]);
    const L = polyLen(route);
    const draw = ease(t, d * 0.05, d * 0.32);
    const sw: { p: Pt; dist: number; at: number }[] = [
      { p: W([520, 615]), dist: 0.16, at: 0.24 },
      { p: W([925, 440]), dist: 0.92, at: 0.24 },
      { p: W([700, 560]), dist: 0.5, at: 0.5 },
    ];
    const run0 = d * 0.28, run1 = d * 0.9;
    const pts: Pt[] = [];
    for (let i = 0; i <= 40; i++) pts.push(along(route, (i / 40) * L * draw));
    const tip = pts[pts.length - 1], pre = pts[Math.max(0, pts.length - 4)];
    return (
      <ShotStage fam="moss" t={t} f={f} counter={C761}>
        <Bloom x={940} y={560} r={620} color={MOSS.bounce} strength={0.25} />
        <NYCMap x={MX} y={MY} s={MS} fam="moss">
          <MapSquares glow={(i) => 0.2 + 0.1 * Math.sin(f / 11 + i)} />
        </NYCMap>
        {draw > 0.02 ? (
          <g>
            <path d={polyD(pts)} stroke={INK} strokeWidth={30} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.5} />
            <path d={polyD(pts)} stroke={TERRA} strokeWidth={20} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {draw > 0.98
              ? Array.from({ length: 6 }, (_, i) => {
                  const s = (t * 3 + i * (L / 6)) % L;
                  const [px, py] = along(route, s), [qx, qy] = along(route, s + 4);
                  return <Chevron key={i} x={px} y={py} a={(Math.atan2(qy - py, qx - px) * 180) / Math.PI} s={12} color={CHALK} opacity={0.85} />;
                })
              : null}
            <Arrow x0={pre[0]} y0={pre[1]} x1={tip[0] + (tip[0] - pre[0]) * 0.4} y1={tip[1] + (tip[1] - pre[1]) * 0.4} color={TERRA} w={1} head={44} />
          </g>
        ) : null}
        <Plant x={plant[0] - 40} y={plant[1] + 40} s={0.9} t={t} />
        <Txt x={plant[0] - 40} y={plant[1] + 96} size={24} ls={3} fill={MOSS.text}>TREATMENT PLANT</Txt>
        {sw.map((s, i) => {
          const k0 = pop(t, d * s.at, 14);
          if (k0 <= 0) return null;
          const el = Math.max(0, t - Math.max(run0, d * s.at));
          const k = Math.min(s.dist, el / (run1 - run0));
          const done = k >= s.dist ? Math.max(0, 1 - (el - s.dist * (run1 - run0)) / 20) : 0;
          const [x, y] = [s.p[0], s.p[1] - 74];
          return (
            <g key={i} transform={`translate(${x} ${y}) scale(${k0}) translate(${-x} ${-y})`}>
              <path d={`M ${s.p[0]} ${s.p[1] - 8} V ${y + 40}`} stroke={CHALK} strokeWidth={4} opacity={0.6} />
              <rect x={s.p[0] - 9} y={s.p[1] - 9} width={18} height={18} rx={3} fill={CHALK} />
              <Stopwatch x={x} y={y} r={40} k={k} done={done} />
            </g>
          );
        })}
        <Lev x={190} y={980} h={190} frame={f} pose={t > d * 0.3 ? "point" : "stand"} eyes={t > d * 0.3 ? "open" : "up"} tilt={-6} wind={0.3} shade="#9FB7A6" />
      </ShotStage>
    );
  },

  // chapter beat: rung THE STAGGER
  "4-10": ({ t, d, f }) => <ChapterBeat t={t} d={d} f={f} fam="chalk" prev={3} next={4} eyebrow="NEXT RUNG" title="The stagger" counter={C761} />,
};
