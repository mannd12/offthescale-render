// ST02 act "l06" · 6 · All of New York (sage → clay → olive → chalk). Shot bodies keyed by storyboard id (6-01..6-08).
// Every beat is placed as a fraction of the shot length d (voice timings are estimates).
import React from "react";
import { ShotMap, ShotStage, ease, lin, mix, pop } from "../shot";
import { Lev } from "../../../lib/suppose/lev";
import { STPill } from "../../../lib/suppose/devices";
import { CHALK, CHALK_SHADE, INK, LIME, TERRA } from "../../../lib/suppose/palette";
import { Bloom } from "../../../lib/illustrated/light";
import { rnd } from "../../../lib/illustrated/motion";
import { smoothPath } from "../../../lib/illustrated/shapes";
import {
  Arrow, At, BAR, C88, CLAY, Card, ChapterBeat, FlipCounter, NycMap, OLIVE, Pipe, Pool, Pt, Pump, SAGE, Sq, Stamp, SupplyBar,
  TERRA_DARK, TERRA_LIT, Toilet, Txt, WATER, WATER_DEEP, WATER_LIT, win,
} from "./l06-parts";

const G = 920; // ground line for the bar shots
const POOL = { x: 180, y: 610, w: 640, h: 300 };
const SLIVER = BAR.H * 0.014; // 14 million of a bit over 1 billion: ~1.4 % (honest height)
const SLIVER_44 = BAR.H * 0.044; // 44 million: under 5 %

type Fam = { far: string; mid: string; near: string; bounce: string };
const Ground: React.FC<{ y?: number; fam?: Fam }> = ({ y = G, fam = SAGE }) => (
  <g>
    <path d={smoothPath([[-60, y - 120], [300, y - 170], [700, y - 130], [1100, y - 180], [1500, y - 140], [1990, y - 170]]) + ` L 1990 ${y + 10} L -60 ${y + 10} Z`} fill={fam.far} opacity={0.7} />
    <rect x={-60} y={y} width={2040} height={300} fill={fam.mid} />
    <path d={`M -60 ${y} H 1980`} stroke={fam.bounce} strokeWidth={5} opacity={0.8} />
    <rect x={-60} y={y + 70} width={2040} height={300} fill={fam.near} />
  </g>
);

/** falling blue-sage lines (every flush in town arriving) */
const Rain: React.FC<{ x0: number; x1: number; y0: number; y1: number; f: number; k: number; n?: number }> = ({ x0, x1, y0, y1, f, k, n = 18 }) => {
  if (k <= 0.01) return null;
  return (
    <g opacity={k}>
      {Array.from({ length: n }, (_, i) => {
        const x = x0 + rnd(i * 3.3) * (x1 - x0);
        const L = Math.max(60, y1 - y0);
        const ph = (f * (9 + rnd(i) * 5) + rnd(i * 7) * L) % L;
        return <path key={i} d={`M ${x} ${y0 + ph} v 46`} stroke={i % 3 ? WATER : WATER_DEEP} strokeWidth={5} strokeLinecap="round" opacity={0.85} />;
      })}
    </g>
  );
};

// ------------------------------------------------------------------ 6-07 network (built once)
type Seg = { a: Pt; b: Pt; d0: number; len: number; w: number };
const ROOT: Pt = [960, 620];
const NET: Seg[] = (() => {
  const out: Seg[] = [];
  const grow = (p: Pt, ang: number, d0: number, depth: number, seed: number) => {
    if (depth > 4) return;
    let cur = p, dist = d0, a = ang;
    const n = 2 + Math.floor(rnd(seed * 1.7) * 2);
    for (let i = 0; i < n; i++) {
      a += (rnd(seed * 13 + i) - 0.5) * 0.55;
      const L = 62 + rnd(seed * 7 + i) * 46 - depth * 5;
      const nx: Pt = [cur[0] + Math.cos(a) * L, cur[1] + Math.sin(a) * L * 0.8];
      if (nx[0] < 70 || nx[0] > 1850 || nx[1] < 250 || nx[1] > 1020) return;
      out.push({ a: cur, b: nx, d0: dist, len: L, w: Math.max(4, 16 - depth * 3) });
      cur = nx;
      dist += L;
    }
    grow(cur, a - 0.62, dist, depth + 1, seed * 3 + 1);
    grow(cur, a + 0.58, dist, depth + 1, seed * 3 + 2);
  };
  for (let k = 0; k < 8; k++) grow(ROOT, (k * 2 * Math.PI) / 8 + 0.3, 0, 0, k + 1);
  return out;
})();
const NET_MAX = NET.reduce((m, s) => Math.max(m, s.d0 + s.len), 0);

// ------------------------------------------------------------------ 6-06 underground world
const WW = 1920 * 2.6;
const STREET = 240, MAIN_Y = 385, SEWER_Y = 605, TUNNEL_Y = 885;
const BLDG = Array.from({ length: Math.ceil(WW / 118) + 2 }, (_, i) => ({ x: i * 118 - 40 + rnd(i * 2.1) * 18, w: 90 + rnd(i * 3.7) * 20, h: 60 + rnd(i * 5.3) * 120 }));

export const SHOTS_L06: ShotMap = {
  // The department counts about 8.8 million people… Suppose each flushes once. (counter rolls; flash wave over the map)
  "6-01": ({ t, d, f }) => {
    const kC = lin(t, d * 0.03, d * 0.22);
    const R = mix(-60, 820, ease(t, d * 0.14, d * 0.74));
    const flash = (q: Sq) => {
      const e = R - q.dist;
      if (e < 0) return 0;
      return e < 80 ? 1 - (e / 80) * 0.6 : 0.3 + 0.18 * Math.sin(f / 4 + q.i * 1.3);
    };
    const drop = (q: Sq) => {
      const e = R - q.dist;
      return e < 0 ? 0 : ease(e, 0, 30) * (1 - ease(e, 90, 200));
    };
    const ring = R > 0 && R < 800 ? R : -1;
    return (
      <ShotStage fam="sage" t={t} f={f} counter={kC >= 1 ? C88 : undefined}>
        <Bloom x={820} y={480} r={760} color={SAGE.light} strength={0.5} spread={0.5} />
        <NycMap f={f} flash={flash} drop={drop} />
        {ring > 0 ? <circle cx={810} cy={490} r={ring} fill="none" stroke="#FFFDF0" strokeWidth={6} opacity={0.5 * (1 - ring / 800)} /> : null}
        {kC < 1 ? <FlipCounter k={kC} f={f} /> : null}
        <At x={1860} y={256} k={pop(t, d * 0.28, 12)}>
          <STPill x={1860} y={256} text="8.8 MILLION PEOPLE · CITY COUNT" align="end" dark={false} />
        </At>
        <Txt x={1830} y={995} anchor="end" size={50} fill={SAGE.text} op={ease(t, d * 0.55, d * 0.65)}>EVERYONE FLUSHES ONCE</Txt>
        <Lev x={190} y={1000} h={170} frame={f} pose="point" eyes={R > 40 ? "wide" : "open"} tilt={-4} wind={0.4} outline={INK} />
      </ShotStage>
    );
  },

  // …At 1.6 gallons, that is about 14 million gallons. (pool fills; the day's-supply bar rises beside it)
  "6-02": ({ t, d, f }) => {
    const level = ease(t, d * 0.04, d * 0.42);
    const rain = Math.min(ease(t, 0, d * 0.05), 1 - ease(t, d * 0.4, d * 0.46));
    const grow = ease(t, d * 0.44, d * 0.66);
    const turned = t > d * 0.62;
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C88}>
        <Bloom x={600} y={500} r={700} color={SAGE.light} strength={0.5} spread={0.5} />
        <Ground />
        <Rain x0={POOL.x + 40} x1={POOL.x + POOL.w - 120} y0={-40} y1={POOL.y + POOL.h - (POOL.h - 14) * level - 30} f={f} k={rain} />
        <Pool {...POOL} level={level} f={f} />
        <At x={POOL.x} y={470} k={pop(t, d * 0.38, 14)}>
          <Txt x={POOL.x} y={490} size={88} fill={SAGE.text}>14 MILLION GAL</Txt>
        </At>
        <At x={POOL.x + 20} y={550} k={pop(t, d * 0.44, 12)}>
          <STPill x={POOL.x} y={550} text="OUR SUM" dark={false} />
        </At>
        <SupplyBar p={grow} f={f} labels={ease(t, d * 0.6, d * 0.72)} />
        <Lev x={1080} y={G} h={170} frame={f} facing={turned ? 1 : -1} pose={turned ? "point" : "stand"} eyes={turned ? "up" : "happy"} tilt={turned ? -8 : 4} wind={0.3} outline={INK} />
      </ShotStage>
    );
  },

  // …so our sum puts the flush at no more than about one and a half percent of one day's supply. (pool → thin lime sliver)
  "6-03": ({ t, d, f }) => {
    const k = ease(t, d * 0.04, d * 0.28);
    const done = k >= 0.999;
    const bx = mix(POOL.x + 10, BAR.x, k), bw = mix(POOL.w - 20, BAR.w, k);
    const bh = mix(POOL.h * 0.9, SLIVER, Math.pow(k, 0.6));
    const by = mix(POOL.y + POOL.h - 8, BAR.base, k) - bh;
    const pulse = 0.55 + 0.3 * Math.sin(f / 6);
    const lens = ease(t, d * 0.46, d * 0.6);
    const LX = 700, LY = 690, LR = 210, Z = 6;
    const fx = BAR.x + BAR.w / 2, fy = BAR.base - SLIVER / 2;
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C88}>
        <Bloom x={900} y={500} r={760} color={SAGE.light} strength={0.5} spread={0.5} />
        <Ground />
        <g opacity={1 - ease(t, 0, d * 0.16)}>
          <Pool {...POOL} level={0} f={f} />
        </g>
        <SupplyBar f={f} sliver={done ? SLIVER : 0} glow={done ? pulse : 0} small />
        {!done ? <rect x={bx} y={by} width={bw} height={bh} rx={mix(10, 0, k)} fill={k > 0.6 ? LIME : WATER} opacity={0.95} /> : null}
        <At x={150} y={300} k={pop(t, d * 0.3, 14)}>
          <Txt x={150} y={320} size={96} fill={SAGE.text}>about 1.5 %</Txt>
          <STPill x={160} y={385} text="OUR SUM" dark={false} />
        </At>
        {lens > 0.01 ? (
          <g opacity={Math.min(1, lens * 2)} transform={`translate(${LX} ${LY}) scale(${lens}) translate(${-LX} ${-LY})`}>
            <defs>
              <clipPath id="l06lens"><circle cx={LX} cy={LY} r={LR} /></clipPath>
            </defs>
            <path d={`M ${LX + LR * 0.7} ${LY + LR * 0.7} L ${BAR.x - 6} ${BAR.base - 4}`} stroke={INK} strokeWidth={3} strokeDasharray="10 8" opacity={0.5} />
            <circle cx={LX} cy={LY} r={LR + 10} fill={CHALK} />
            <g clipPath="url(#l06lens)">
              <rect x={LX - LR} y={LY - LR} width={LR * 2} height={LR * 2} fill={SAGE.sky[2]} />
              <g transform={`translate(${LX} ${LY}) scale(${Z}) translate(${-fx} ${-fy})`}>
                <rect x={BAR.x - 60} y={BAR.base} width={BAR.w + 120} height={60} fill={SAGE.mid} />
                <rect x={BAR.x} y={BAR.base - 60} width={BAR.w} height={60} fill={WATER_DEEP} />
                <rect x={BAR.x} y={BAR.base - SLIVER} width={BAR.w} height={SLIVER} fill={LIME} opacity={0.75 + 0.25 * pulse} />
                <path d={`M ${BAR.x + 10} ${BAR.base - SLIVER - 14 - ((f * 0.2) % 10)} h ${BAR.w - 20}`} stroke={WATER_LIT} strokeWidth={0.8} opacity={0.5} />
              </g>
            </g>
            <circle cx={LX} cy={LY} r={LR + 10} fill="none" stroke={INK} strokeWidth={8} opacity={0.75} />
            <path d={`M ${LX - LR * 0.72} ${LY + LR * 0.72} l -70 70`} stroke={TERRA} strokeWidth={26} strokeLinecap="round" />
            <Txt x={LX} y={LY - LR + 60} anchor="middle" size={30} ls={3} fill={INK} op={0.75}>THE FLUSH</Txt>
          </g>
        ) : null}
        <Lev x={1660} y={G} h={160} frame={f} facing={-1} pose={t > d * 0.32 ? "point" : "stand"} eyes="squint" tilt={10} wind={0.3} outline={INK} />
      </ShotStage>
    );
  },

  // Make every toilet an old five-gallon one: about 44 million gallons, still under five percent. (WORST CASE; swap wave)
  "6-04": ({ t, d, f }) => {
    const sl = mix(SLIVER, SLIVER_44, ease(t, d * 0.4, d * 0.6));
    const pulse = 0.5 + 0.3 * Math.sin(f / 6);
    return (
      <ShotStage fam="clay" t={t} f={f} counter={C88}>
        <Bloom x={700} y={560} r={800} color={CLAY.light} strength={0.5} spread={0.5} />
        <Ground fam={CLAY} />
        {Array.from({ length: 16 }, (_, i) => {
          const c = i % 4, r = Math.floor(i / 4);
          const ts = d * (0.14 + (c + r) * 0.035);
          const k = ease(t, ts, ts + 9);
          const sq = t > ts && t < ts + 14 ? 1 + Math.sin(((t - ts) / 14) * Math.PI) * 0.08 : 1;
          const x = 190 + c * 150, y = 400 + r * 170;
          return (
            <g key={i}>
              {t > ts && t < ts + 16 ? <Bloom x={x - 20} y={y - 120} r={70} color={CLAY.light} strength={1 - (t - ts) / 16} /> : null}
              <g transform={`translate(${x} ${y}) scale(${2 - sq} ${sq}) translate(${-x} ${-y})`}>
                <Toilet x={x} y={y} s={0.95} tank={mix(1, 1.8, k)} line={TERRA_DARK} />
              </g>
            </g>
          );
        })}
        <Stamp x={560} y={150} text="WORST CASE" a={t - d * 0.03} size={46} />
        <SupplyBar f={f} sliver={sl} glow={pulse} small ink={CHALK} dim={CLAY.light} />
        <At x={1262} y={690} k={pop(t, d * 0.6, 14)}>
          <Txt x={1262} y={710} anchor="end" size={64} fill={CHALK}>44 MILLION GAL</Txt>
          <Arrow x0={1278} y0={700} x1={BAR.x - 8} y1={BAR.base - SLIVER_44 / 2} color={CHALK} w={6} head={18} op={0.8} />
        </At>
        <At x={1090} y={790} k={pop(t, d * 0.7, 12)}>
          <STPill x={1090} y={790} text="OUR SUM" align="end" />
          <STPill x={1262} y={790} text="UNDER 5 %" align="end" />
        </At>
      </ShotStage>
    );
  },

  // And the whole-city flush is about twelve times the real halftime spike. (spikes stacking)
  "6-05": ({ t, d, f }) => {
    const base = 880, w = 260, h = 44;
    const spike = (cx: number, yb: number, k = 1) =>
      `M ${cx - (w / 2) * k} ${yb} Q ${cx - w * 0.1 * k} ${yb} ${cx} ${yb - h} Q ${cx + w * 0.1 * k} ${yb} ${cx + (w / 2) * k} ${yb} Z`;
    const SX = 1060;
    const shown = Array.from({ length: 12 }, (_, i) => d * (0.08 + i * 0.045));
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C88}>
        <Bloom x={760} y={520} r={760} color={SAGE.light} strength={0.5} spread={0.5} />
        <Ground y={base} />
        {/* the real halftime spike */}
        <path d={spike(430, base)} fill={TERRA} stroke={TERRA_DARK} strokeWidth={3} />
        <path d={`M ${430 - w / 2} ${base} Q ${430 - w * 0.1} ${base} 430 ${base - h} L 430 ${base} Z`} fill={TERRA_LIT} opacity={0.5} />
        <Txt x={430} y={base + 60} anchor="middle" size={30} ls={3} fill={SAGE.text}>HALFTIME SPIKE</Txt>
        <path d={`M ${430 + 40} ${base - h} H ${mix(470, SX - 40, ease(t, d * 0.04, d * 0.14))}`} stroke={INK} strokeWidth={3} strokeDasharray="10 9" opacity={0.45} />
        {/* the whole-city stack */}
        {shown.map((s, i) => {
          if (t < s) return null;
          const a = t - s;
          const yb = base - i * h - (1 - ease(a, 0, 9)) * 260;
          const land = a > 9 && a < 18 ? Math.sin(((a - 9) / 9) * Math.PI) * 0.06 : 0;
          return (
            <g key={i} opacity={ease(a, 0, 4)}>
              <path d={spike(SX, yb, 1 + land)} fill={TERRA} stroke={TERRA_DARK} strokeWidth={3} />
              <path d={`M ${SX - w / 2} ${yb} Q ${SX - w * 0.1} ${yb} ${SX} ${yb - h} L ${SX} ${yb} Z`} fill={TERRA_LIT} opacity={0.5} />
            </g>
          );
        })}
        <Txt x={SX} y={base + 60} anchor="middle" size={30} ls={3} fill={SAGE.text}>WHOLE CITY AT ONCE</Txt>
        <At x={1310} y={560} k={pop(t, d * 0.68, 14)}>
          <Txt x={1310} y={580} size={100} fill={SAGE.text}>about 12×</Txt>
          <STPill x={1318} y={650} text="OUR SUM" dark={false} />
        </At>
        <Lev x={720} y={base} h={160} frame={f} eyes="up" tilt={-12 - 6 * ease(t, d * 0.1, d * 0.6)} wind={0.3} outline={INK} />
      </ShotStage>
    );
  },

  // Those gallons have somewhere to go… mains, tunnels, aqueducts… sewer lines with 96 pump stations. (tracking cutaway)
  "6-06": ({ t, d, f }) => {
    const p = lin(t, 0, d) * 0.75 + ease(t, 0, d) * 0.25;
    const camX = -(WW - 1920) * p;
    const hl1 = win(t, 0, d * 0.36, d * 0.05);
    const hl2 = win(t, d * 0.33, d * 0.69, d * 0.05);
    const hl3 = ease(t, d * 0.66, d * 0.72);
    const pumps = Array.from({ length: 5 }, (_, i) => 640 + i * 1050);
    return (
      <ShotStage fam="olive" t={t} f={f} counter={C88} drift={0.5}>
        <g transform={`translate(${camX} 0)`}>
          {/* skyline */}
          {BLDG.map((b, i) => (
            <g key={i}>
              <rect x={b.x} y={STREET - b.h} width={b.w} height={b.h} fill={OLIVE.far} />
              {Array.from({ length: Math.floor(b.h / 34) }, (_, r) =>
                [0, 1, 2].map((c) => {
                  const on = rnd(i * 31 + r * 7 + c) > 0.45;
                  return on ? <rect key={`${r}${c}`} x={b.x + 14 + c * 26} y={STREET - b.h + 14 + r * 34} width={12} height={14} rx={2} fill={OLIVE.light} opacity={0.35 + 0.2 * Math.sin(f / 30 + i + r)} /> : null;
                }),
              )}
            </g>
          ))}
          {/* street + soil */}
          <rect x={-100} y={STREET} width={WW + 200} height={24} fill={OLIVE.near} />
          {Array.from({ length: Math.ceil(WW / 120) }, (_, i) => <rect key={i} x={i * 120 + 20} y={STREET + 10} width={60} height={4} rx={2} fill={CHALK} opacity={0.35} />)}
          <rect x={-100} y={STREET + 24} width={WW + 200} height={900} fill={OLIVE.mid} />
          {[340, 500, 740, 1000].map((y, i) => (
            <path key={i} d={smoothPath(Array.from({ length: 14 }, (_, k) => [k * (WW / 13), y + Math.sin(k * 1.7 + i) * 14] as Pt))} stroke={OLIVE.far} strokeWidth={5} fill="none" opacity={0.4} />
          ))}
          {/* building laterals and service lines */}
          {Array.from({ length: Math.ceil(WW / 260) }, (_, i) => (
            <g key={i}>
              <Pipe d={`M ${80 + i * 260} ${STREET + 24} V ${MAIN_Y - 10}`} r={6} f={f} speed={2} wall={OLIVE.near} flow={WATER_LIT} hl={hl1} />
              <Pipe d={`M ${210 + i * 260} ${STREET + 24} V ${SEWER_Y - 20}`} r={8} f={f} speed={3} wall={OLIVE.near} flow={WATER} hl={hl2} />
            </g>
          ))}
          {/* shafts to the deep tunnel */}
          {[1400, 3300].map((x) => <Pipe key={x} d={`M ${x} ${MAIN_Y} V ${TUNNEL_Y - 60}`} r={14} f={f} speed={3} wall={OLIVE.near} flow={WATER_LIT} hl={hl1} />)}
          <Pipe d={`M -100 ${MAIN_Y} H ${WW + 100}`} r={24} f={f} speed={4} wall={OLIVE.near} flow={WATER_LIT} hl={hl1} />
          <Pipe d={`M -100 ${SEWER_Y} H ${WW + 100}`} r={36} f={f} speed={3} wall={OLIVE.near} flow={WATER} hl={hl2} />
          {/* deep water tunnel */}
          {hl1 > 0.01 ? <rect x={-100} y={TUNNEL_Y - 110} width={WW + 200} height={220} rx={110} fill={CHALK} opacity={0.08 * hl1} /> : null}
          <rect x={-100} y={TUNNEL_Y - 90} width={WW + 200} height={180} fill={CHALK_SHADE} opacity={0.32} />
          <rect x={-100} y={TUNNEL_Y - 74} width={WW + 200} height={148} fill="#1C2210" />
          {Array.from({ length: Math.ceil(WW / 160) }, (_, i) => <rect key={i} x={i * 160} y={TUNNEL_Y - 90} width={6} height={180} fill={OLIVE.near} opacity={0.7} />)}
          {[-40, 0, 40].map((dy, i) => (
            <path key={i} d={`M -100 ${TUNNEL_Y + dy} H ${WW + 100}`} stroke={WATER_LIT} strokeWidth={6 - i} strokeDasharray={`${90 + i * 30} ${70 + i * 20}`} strokeDashoffset={-f * (6 + i)} opacity={0.6 + 0.3 * hl1} strokeLinecap="round" />
          ))}
          {pumps.map((x, i) => <Pump key={i} x={x} y={SEWER_Y} f={f + i * 7} s={0.8} glow={hl3 * (0.7 + 0.3 * Math.sin(f / 6 + i))} />)}
        </g>
        <Card x={70} y={50} big="7,000 MILES" small="WATER MAINS · TUNNELS · AQUEDUCTS" k={win(t, d * 0.02, d * 0.35, d * 0.04)} swatch={WATER_LIT} />
        <Card x={70} y={50} big="7,500 MILES" small="SEWER LINES" k={win(t, d * 0.36, d * 0.68, d * 0.04)} swatch={WATER} />
        <Card x={70} y={50} big="96 PUMP STATIONS" small="ALONG THE SEWER LINES" k={ease(t, d * 0.69, d * 0.74)} swatch={TERRA} size={64} />
      </ShotStage>
    );
  },

  // Fourteen million gallons spread over that much pipe is a thin film, not a wall. That is our picture, not a measurement.
  "6-07": ({ t, d, f }) => {
    const collapse = ease(t, d * 0.1, d * 0.3);
    const D = mix(0, NET_MAX, ease(t, d * 0.16, d * 0.74));
    const wallH = mix(330, 0, collapse);
    const wallTop = Array.from({ length: 7 }, (_, i) => [780 + i * 60, ROOT[1] - wallH - Math.sin(f / 5 + i) * 10] as Pt);
    return (
      <ShotStage fam="olive" t={t} f={f} counter={C88}>
        <Bloom x={960} y={620} r={720} color={OLIVE.bounce} strength={0.35} spread={0.5} />
        {NET.map((s, i) => <path key={`p${i}`} d={`M ${s.a[0]} ${s.a[1]} L ${s.b[0]} ${s.b[1]}`} stroke={OLIVE.far} strokeWidth={s.w + 8} strokeLinecap="round" />)}
        {NET.map((s, i) => <path key={`q${i}`} d={`M ${s.a[0]} ${s.a[1]} L ${s.b[0]} ${s.b[1]}`} stroke="#151A0B" strokeWidth={s.w} strokeLinecap="round" />)}
        {NET.map((s, i) => {
          if (D <= s.d0) return null;
          const q = Math.min(1, (D - s.d0) / s.len);
          const ex = s.a[0] + (s.b[0] - s.a[0]) * q, ey = s.a[1] + (s.b[1] - s.a[1]) * q;
          const sh = 0.7 + 0.3 * Math.sin(f / 5 - s.d0 / 50);
          return (
            <g key={`f${i}`}>
              <path d={`M ${s.a[0]} ${s.a[1]} L ${ex} ${ey}`} stroke={WATER_LIT} strokeWidth={3} strokeLinecap="round" opacity={sh} />
              {q < 1 ? <circle cx={ex} cy={ey} r={5} fill={WATER_LIT} /> : null}
            </g>
          );
        })}
        {/* the "wall" we might imagine, collapsing into the film */}
        {wallH > 2 ? (
          <g opacity={1 - collapse * 0.6}>
            <path d={`M 780 ${ROOT[1]} L ${wallTop.map((p) => p.join(" ")).join(" L ")} L 1140 ${ROOT[1]} Z`} fill={WATER} opacity={0.35} stroke={WATER_LIT} strokeWidth={4} strokeDasharray="14 10" strokeLinejoin="round" />
            <Txt x={960} y={ROOT[1] - wallH - 40} anchor="middle" size={40} fill={OLIVE.text} op={1 - collapse}>A WALL OF WATER?</Txt>
          </g>
        ) : null}
        <circle cx={ROOT[0]} cy={ROOT[1]} r={22} fill={OLIVE.light} opacity={0.9} />
        <circle cx={ROOT[0]} cy={ROOT[1]} r={30 + 6 * Math.sin(f / 7)} fill="none" stroke={OLIVE.light} strokeWidth={3} opacity={0.5} />
        <g opacity={ease(t, d * 0.58, d * 0.68)}>
          <rect x={60} y={60} width={1060} height={110} rx={24} fill={INK} opacity={0.6} />
          <Txt x={92} y={136} size={56} fill={OLIVE.text}>A THIN FILM, NOT A WALL</Txt>
          <STPill x={884} y={115} text="MODEL" />
        </g>
      </ShotStage>
    );
  },

  // Sums are tidy. Pipes are not. Next rung: where it might hurt. (chapter beat: THE WEAK SPOT)
  "6-08": ({ t, d, f }) => <ChapterBeat t={t} d={d} f={f} fam="chalk" prev={5} next={6} eyebrow="NEXT RUNG" title="The weak spot" counter={C88} />,
};
