// ST02 act "l07" · 7 · The weak spot (clay / sage / chalk). Shot bodies keyed by storyboard id (7-01..7-12).
// Every beat is placed as a fraction of the shot length d (voice timings are estimates). Engineers' warnings are
// stamped JUDGMENT; Salt Lake City is a story, stamped OLD PIPES.
import React from "react";
import { ShotMap, ShotStage, ease, lin, mix, pop } from "../shot";
import { Lev } from "../../../lib/suppose/lev";
import { STPill } from "../../../lib/suppose/devices";
import { CHALK, INK, LIME, LIME_DEEP, ST_FONT, TERRA } from "../../../lib/suppose/palette";
import { Bloom } from "../../../lib/illustrated/light";
import { rnd } from "../../../lib/illustrated/motion";
import { rrect, smoothPath } from "../../../lib/illustrated/shapes";
import {
  Arrow, At, C88, CH, CLAY, CREAM, House, NycMap, Pipe, Pool, Pt, Pump, SAGE, Stamp, TERRA_DARK, TERRA_LIT, Toilet, Txt, WATER,
  WATER_DEEP, WATER_LIT,
} from "./l06-parts";
import { BrickBuilding, Clipping, Gauge, US_CENTER, US_D, US_NYC, WaterTower } from "./l07-parts";

const LEVSH = "#D8B8A2"; // Lev's shade on clay

const ClaySoil: React.FC<{ y: number }> = ({ y }) => (
  <g>
    <rect x={-80} y={y} width={2080} height={26} fill={CLAY.near} />
    <rect x={-80} y={y + 26} width={2080} height={700} fill="#6E3424" />
    {[80, 190, 330].map((dy, i) => (
      <path key={i} d={smoothPath(Array.from({ length: 9 }, (_, k) => [-80 + k * 260, y + dy + Math.sin(k * 1.9 + i) * 12] as Pt))} stroke={CLAY.mid} strokeWidth={5} fill="none" opacity={0.45} />
    ))}
  </g>
);

const SageGround: React.FC<{ y: number }> = ({ y }) => (
  <g>
    <path d={smoothPath([[-60, y - 120], [300, y - 170], [700, y - 130], [1100, y - 180], [1500, y - 140], [1990, y - 170]]) + ` L 1990 ${y + 10} L -60 ${y + 10} Z`} fill={SAGE.far} opacity={0.7} />
    <rect x={-60} y={y} width={2040} height={300} fill={SAGE.mid} />
    <path d={`M -60 ${y} H 1980`} stroke={SAGE.bounce} strokeWidth={5} opacity={0.8} />
    <rect x={-60} y={y + 70} width={2040} height={300} fill={SAGE.near} />
  </g>
);

/** fixed-advance typed characters (calculator look) */
const ADV: Record<string, number> = { ",": 30, ".": 30, " ": 34, "×": 70, "=": 70 };
const Typed: React.FC<{ x: number; y: number; size: number; chars: { c: string; at: number; color?: string }[]; t: number }> = ({ x, y, size, chars, t }) => {
  let cx = x;
  return (
    <g>
      {chars.map((ch, i) => {
        const adv = (ADV[ch.c] ?? 62) * (size / 110);
        const px = cx + adv / 2;
        cx += adv;
        const k = pop(t, ch.at, 8);
        if (k <= 0) return null;
        return (
          <text key={i} x={px} y={y} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={size} fill={ch.color ?? INK} transform={`translate(${px} ${y - size * 0.35}) scale(${k}) translate(${-px} ${-(y - size * 0.35)})`}>
            {ch.c}
          </text>
        );
      })}
    </g>
  );
};
const typedWidth = (s: string, size: number) => s.split("").reduce((a, c) => a + (ADV[c] ?? 62) * (size / 110), 0);

export const SHOTS_L07: ShotMap = {
  // If a flush does cause trouble, the trouble is local. (zoom to one old brick building; its pipe is narrower than the main)
  "7-01": ({ t, d, f }) => {
    const z = mix(0.84, 1.16, ease(t, 0, d));
    const G = 640, MAINY = 880, PX = 1090;
    const tag1 = ease(t, d * 0.35, d * 0.45), tag2 = ease(t, d * 0.5, d * 0.6);
    return (
      <ShotStage fam="clay" t={t} f={f} counter={C88} drift={0.4}>
        <g transform={`translate(1000 640) scale(${z}) translate(-1000 -640)`}>
          <Bloom x={980} y={500} r={800} color={CLAY.light} strength={0.5} spread={0.5} />
          {Array.from({ length: 12 }, (_, i) => {
            const x = -60 + i * 180, h = 140 + rnd(i * 4.1) * 200;
            return <rect key={i} x={x} y={G - h} width={150} height={h} fill={CLAY.far} opacity={0.55} />;
          })}
          <ClaySoil y={G} />
          <BrickBuilding x={800} y={250} w={360} h={G - 250} f={f} />
          <Pipe d={`M -120 ${MAINY} H 2040`} r={56} f={f} speed={4} wall={CLAY.near} inner="#3A1A10" flow={WATER} />
          <Pipe d={`M ${PX} ${G + 10} V ${MAINY - 50}`} r={11} f={f} speed={5} wall={CLAY.near} inner="#3A1A10" flow={WATER_LIT} dash="10 9" />
          <g opacity={tag1}>
            <path d={`M ${PX + 24} 740 H ${PX + 120}`} stroke={CHALK} strokeWidth={3} />
            <Txt x={PX + 132} y={752} size={34} fill={CHALK} ls={2}>THE BUILDING'S PIPE</Txt>
          </g>
          <g opacity={tag2}>
            <Txt x={300} y={MAINY + 112} size={34} fill={CHALK} ls={2}>THE STREET MAIN</Txt>
          </g>
          <Lev x={600} y={G + 4} h={120} frame={f} pose="point" eyes="squint" tilt={-6} wind={0.3} shade={LEVSH} />
        </g>
      </ShotStage>
    );
  },

  // One engineer said that if there are bottlenecks in a system, they could perhaps be overwhelmed. (dashes pile up)
  "7-02": ({ t, d, f }) => {
    const CY = 620, X0 = 60, XT0 = 920, XT1 = 1120, X1 = 1880, RW = 150, RN = 44;
    const rAt = (x: number) => (x < XT0 ? RW : x > XT1 ? RN : mix(RW, RN, ease(x, XT0, XT1)));
    const top: Pt[] = [], bot: Pt[] = [];
    for (let x = X0; x <= X1; x += 20) { top.push([x, CY - rAt(x)]); bot.push([x, CY + rAt(x)]); }
    const body = "M " + [...top, ...bot.reverse()].map((p) => p.join(" ")).join(" L ") + " Z";
    const P = mix(XT1 - 40, 360, ease(t, d * 0.08, d * 0.9)); // pile front
    const lanes = 16;
    return (
      <ShotStage fam="clay" t={t} f={f} counter={C88}>
        <Bloom x={1000} y={600} r={800} color={CLAY.light} strength={0.45} spread={0.5} />
        <path d={body} fill={CLAY.near} transform="translate(0 16)" opacity={0.4} />
        <path d={body} fill="#3A1A10" stroke={CLAY.near} strokeWidth={14} strokeLinejoin="round" />
        <defs><clipPath id="l07neck"><path d={body} /></clipPath></defs>
        <g clipPath="url(#l07neck)">
          {/* arriving dashes */}
          {Array.from({ length: 70 }, (_, i) => {
            const lane = i % lanes;
            const span = Math.max(80, P - X0);
            const x = X0 + ((f * 6 + rnd(i * 2.7) * 900) % span);
            const y = CY + (lane / (lanes - 1) - 0.5) * (RW * 1.7);
            return <path key={i} d={`M ${x} ${y} h 34`} stroke={WATER} strokeWidth={6} strokeLinecap="round" opacity={0.9} />;
          })}
          {/* the pile behind the neck */}
          {Array.from({ length: 260 }, (_, i) => {
            const x = P + rnd(i * 4.3) * (XT1 - P);
            const r = rAt(x) - 14;
            const y = CY + (rnd(i * 7.9) - 0.5) * 2 * r;
            if (Math.abs(y - CY) > r) return null;
            const jx = Math.sin(f / 3 + i) * 2;
            return <path key={`p${i}`} d={`M ${x + jx} ${y} h 22`} stroke={i % 4 ? WATER : WATER_LIT} strokeWidth={6} strokeLinecap="round" opacity={0.95} />;
          })}
          {/* the few that squeeze through */}
          {Array.from({ length: 6 }, (_, i) => {
            const x = XT1 + ((f * 9 + i * 130) % (X1 - XT1));
            return <path key={`n${i}`} d={`M ${x} ${CY + (i % 3 - 1) * 16} h 30`} stroke={WATER_LIT} strokeWidth={6} strokeLinecap="round" />;
          })}
        </g>
        <Bloom x={XT1 - 60} y={CY} r={160} color={TERRA_LIT} strength={0.35 + 0.25 * ease(t, d * 0.3, d * 0.9) + 0.1 * Math.sin(f / 5)} />
        <Txt x={XT1} y={CY + 230} anchor="middle" size={34} ls={3} fill={CHALK}>BOTTLENECK</Txt>
        <Arrow x0={XT1} y0={CY + 190} x1={XT1} y1={CY + 80} color={CHALK} w={6} head={18} op={0.8} />
        <g opacity={ease(t, d * 0.2, d * 0.32)}>
          <Txt x={90} y={170} size={56} fill={CHALK}>COULD BE OVERWHELMED</Txt>
          <STPill x={90} y={232} text="JUDGMENT" />
          <Txt x={290} y={240} size={24} fill={CHALK} ls={2} op={0.85}>ONE ENGINEER'S VIEW</Txt>
        </g>
      </ShotStage>
    );
  },

  // Some apartment buildings might back up if everyone flushes at once, depending on their pipes.
  "7-03": ({ t, d, f }) => {
    const X = 700, W = 440, TOP = 240, FH = 100, N = 6, G = TOP + FH * N; // G = 840
    const SX = X + W - 60;
    const litAt = (i: number) => d * (0.06 + i * 0.065); // top floor first
    const nLit = Array.from({ length: N }, (_, i) => (t > litAt(i) ? 1 : 0) as number).reduce((a, b) => a + b, 0);
    const back = ease(t, d * 0.5, d * 0.62);
    const bob = Math.sin(f / 6) * 8;
    return (
      <ShotStage fam="clay" t={t} f={f} counter={C88}>
        <Bloom x={900} y={520} r={760} color={CLAY.light} strength={0.5} spread={0.5} />
        <ClaySoil y={G} />
        {/* building shell, cut away */}
        <rect x={X - 24} y={TOP - 30} width={W + 48} height={G - TOP + 30} fill={TERRA_DARK} />
        <rect x={X - 24} y={TOP - 30} width={W + 48} height={12} fill={TERRA_LIT} opacity={0.6} />
        {Array.from({ length: N }, (_, i) => {
          const y0 = TOP + i * FH;
          const on = ease(t, litAt(i), litAt(i) + 8);
          const flash = t > litAt(i) && t < litAt(i) + 18 ? 1 - (t - litAt(i)) / 18 : 0;
          const tank = 1 - 0.75 * ease(t, litAt(i), litAt(i) + 12) + 0.6 * ease(t, litAt(i) + 30, litAt(i) + 90);
          return (
            <g key={i}>
              <rect x={X} y={y0 + 6} width={W} height={FH - 12} fill={CLAY.near} />
              <rect x={X} y={y0 + 6} width={W} height={FH - 12} fill="#FFD7A8" opacity={0.15 + 0.55 * on} />
              {flash > 0 ? <Bloom x={X + 170} y={y0 + 50} r={140} color="#FFD7A8" strength={flash} /> : null}
              <rect x={X} y={y0 + FH - 8} width={W} height={10} fill={TERRA} />
              <Toilet x={X + 190} y={y0 + FH - 8} s={0.62} line={TERRA_DARK} water={Math.min(1, tank)} f={f} />
              <Pipe d={`M ${X + 230} ${y0 + FH - 20} H ${SX}`} r={5} f={f} speed={3} wall={TERRA_DARK} inner="#3A1A10" flow={WATER} flowOp={on} />
            </g>
          );
        })}
        {/* the building's stack, down and out to the street */}
        <Pipe d={`M ${SX} ${TOP + 40} V ${G + 120} H 1900`} r={13} f={f} speed={2 + nLit * 0.8} wall={TERRA_DARK} inner="#3A1A10" flow={WATER} flowOp={0.3 + 0.12 * nLit} />
        {back > 0.01 ? (
          <g opacity={back}>
            <rect x={SX - 9} y={G + 110 - 70 * back} width={18} height={70 * back} fill={WATER_DEEP} opacity={0.9} />
            <Arrow x0={SX + 70} y0={G + 140 + bob * 0.3} x1={SX + 70} y1={G + 20 + bob} color={TERRA_LIT} w={10} head={26} />
            <Txt x={SX + 100} y={G + 100} size={30} ls={2} fill={CHALK}>BACKS UP?</Txt>
          </g>
        ) : null}
        <Stamp x={1500} y={360} text="JUDGMENT" a={t - d * 0.62} size={48} />
        <Txt x={1500} y={500} anchor="middle" size={30} ls={2} fill={CHALK} op={ease(t, d * 0.7, d * 0.8)}>DEPENDS ON THE PIPES</Txt>
      </ShotStage>
    );
  },

  // In towns where tanks depend on pumps rather than stored water… (Lev watches the tank level drop)
  "7-04": ({ t, d, f }) => {
    const G = 900;
    const level = mix(0.85, 0.28, ease(t, d * 0.12, d * 0.92));
    const TX = 1000, TW = 280, TT = 330;
    const wl = G - 30 - (G - TT - 60) * level;
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C88}>
        <Bloom x={900} y={400} r={800} color={SAGE.light} strength={0.5} spread={0.5} />
        <SageGround y={G} />
        {Array.from({ length: 7 }, (_, i) => <House key={i} x={150 + i * 92} y={G - (i % 2) * 40 + 2} s={0.85 - (i % 2) * 0.15} seed={i + 3} lit={0.5} />)}
        {/* standpipe tank */}
        <rect x={TX + 14} y={TT + 14} width={TW} height={G - TT} fill="#000" opacity={0.12} />
        <path d={rrect(TX, TT, TW, G - TT, 26)} fill={CHALK} stroke={INK} strokeWidth={4} strokeOpacity={0.5} />
        <path d={`M ${TX - 10} ${TT + 10} Q ${TX + TW / 2} ${TT - 70} ${TX + TW + 10} ${TT + 10} Z`} fill={TERRA} />
        <rect x={TX + 40} y={TT + 40} width={TW - 80} height={G - TT - 70} rx={16} fill={INK} opacity={0.75} />
        <rect x={TX + 48} y={wl} width={TW - 96} height={G - 38 - wl} rx={10} fill={WATER} />
        <path d={`M ${TX + 52} ${wl + Math.sin(f / 5) * 3} H ${TX + TW - 52}`} stroke={WATER_LIT} strokeWidth={5} strokeLinecap="round" />
        {[0.25, 0.5, 0.75].map((u, i) => <path key={i} d={`M ${TX + 40} ${G - 30 - (G - TT - 60) * u} h 26`} stroke={CHALK} strokeWidth={3} opacity={0.7} />)}
        <Arrow x0={TX - 40} y0={wl - 60 + Math.sin(f / 6) * 6} x1={TX - 40} y1={wl + 10 + Math.sin(f / 6) * 6} color={TERRA} w={10} head={24} />
        {/* outflow to town, slow inflow from the pump */}
        <Pipe d={`M ${TX + 40} ${G - 10} V ${G + 38} H 160 V ${G - 10}`} r={10} f={f} speed={5} wall={INK} inner={SAGE.near} flow={WATER_LIT} />
        <Pipe d={`M 1680 ${G - 10} V ${G + 38} H ${TX + TW - 40} V ${G - 10}`} r={10} f={f} speed={-1.2} wall={INK} inner={SAGE.near} flow={WATER_LIT} />
        <g>
          <rect x={1560} y={G - 160} width={240} height={160} fill={CHALK} stroke={INK} strokeWidth={3} strokeOpacity={0.45} />
          <path d={`M 1540 ${G - 160} L 1680 ${G - 230} L 1820 ${G - 160} Z`} fill={TERRA} />
          <Pump x={1680} y={G - 80} f={f} s={0.5} spin={0.6} />
          <Txt x={1680} y={G - 124} anchor="middle" size={30} ls={3} fill={SAGE.text}>PUMP</Txt>
        </g>
        <Lev x={1390} y={G} h={150} frame={f} facing={-1} eyes="wide" tilt={-14} wind={0.3} outline={INK} />
        <Txt x={90} y={150} size={50} fill={SAGE.text} op={ease(t, d * 0.2, d * 0.3)}>A TANK THAT RELIES ON PUMPS</Txt>
      </ShotStage>
    );
  },

  // …some toilets could be left waiting for a refill. That is the heart of the old burst-pipe worry.
  "7-05": ({ t, d, f }) => {
    const floor = 900, TX = 760, s = 3.4;
    const water = 0.1 + 0.16 * ease(t, d * 0.1, d);
    const th = 54 * s;
    const inX0 = TX + -44 * s, inX1 = TX + -20 * s;
    const tankTop = floor + (-60 - 54) * s;
    const wl = floor + (-60 - 54 * water * 0.92) * s;
    const hand = f * 7;
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C88}>
        <rect x={-80} y={-80} width={2080} height={floor + 80} fill={SAGE.haze} opacity={0.6} />
        {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M ${i * 180 - 20} -80 V ${floor}`} stroke={SAGE.far} strokeWidth={3} opacity={0.35} />)}
        <rect x={-80} y={floor} width={2080} height={300} fill={SAGE.mid} />
        <path d={`M -80 ${floor} H 2000`} stroke={SAGE.bounce} strokeWidth={5} />
        <Toilet x={TX} y={floor} s={s} line={INK} water={water} f={f} />
        {/* a thin refill trickle inside the tank */}
        <path d={`M ${inX0 + (inX1 - inX0) * 0.7} ${tankTop + 20} V ${wl - 4}`} stroke={WATER_LIT} strokeWidth={5} strokeDasharray="8 14" strokeDashoffset={-f * 2} strokeLinecap="round" />
        <path d={`M ${inX0 + (inX1 - inX0) * 0.7} ${tankTop + 6} V ${tankTop + 20}`} stroke={INK} strokeWidth={8} strokeLinecap="round" opacity={0.6} />
        <Txt x={(inX0 + inX1) / 2} y={tankTop - th * 0.12 - 40} anchor="middle" size={26} ls={2} fill={SAGE.dim} op={0.9}>TANK</Txt>
        {/* the clock */}
        <g>
          <circle cx={1240} cy={520} r={120} fill={INK} opacity={0.8} />
          <circle cx={1240} cy={520} r={106} fill={CHALK} />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i * Math.PI) / 6;
            return <path key={i} d={`M ${1240 + Math.sin(a) * 84} ${520 - Math.cos(a) * 84} L ${1240 + Math.sin(a) * 96} ${520 - Math.cos(a) * 96}`} stroke={INK} strokeWidth={i % 3 ? 3 : 6} strokeLinecap="round" />;
          })}
          <path d={`M 1240 520 L ${1240 + Math.sin((hand * Math.PI) / 180) * 80} ${520 - Math.cos((hand * Math.PI) / 180) * 80}`} stroke={TERRA} strokeWidth={6} strokeLinecap="round" />
          <path d={`M 1240 520 L ${1240 + Math.sin((hand / 12 * Math.PI) / 180) * 55} ${520 - Math.cos((hand / 12 * Math.PI) / 180) * 55}`} stroke={INK} strokeWidth={9} strokeLinecap="round" />
          <circle cx={1240} cy={520} r={9} fill={INK} />
        </g>
        <rect x={1478} y={866} width={96} height={34} rx={8} fill={TERRA} />
        <rect x={1478} y={866} width={96} height={10} rx={5} fill={TERRA_LIT} opacity={0.7} />
        <Lev x={1520} y={floor} h={170} frame={f} facing={-1} pose="sit" eyes={Math.floor(f / 40) % 3 === 0 ? "closed" : "squint"} tilt={-10 + Math.sin(f / 14) * 4} wind={0.2} outline={INK} />
        <Txt x={90} y={150} size={54} fill={SAGE.text} op={ease(t, d * 0.15, d * 0.27)}>WAITING FOR A REFILL</Txt>
      </ShotStage>
    );
  },

  // An empty toilet lets air in, and air in a pressurised line is what makes water hammer worse.
  "7-06": ({ t, d, f }) => {
    const CY = 640, L0 = 300, L1 = 1600, R = 62;
    const tc = d * 0.45;
    const close = ease(t, tc - 10, tc);
    const v = (L1 - L0) / (d * 0.16);
    const age = t - tc;
    const amp = age > 0 ? Math.exp(-age / (d * 0.32)) : 0;
    const m = age > 0 ? (age * v) % (2 * (L1 - L0)) : 0;
    const wx = age > 0 ? L1 - (m < L1 - L0 ? m : 2 * (L1 - L0) - m) : -999;
    const near = (x: number) => (age > 0 ? amp * Math.exp(-(((x - wx) / 120) ** 2)) : 0);
    const GX = 960;
    const needle = 0.3 + 0.62 * near(GX) + 0.02 * Math.sin(f / 3);
    return (
      <ShotStage fam="chalk" t={t} f={f} counter={C88}>
        <Bloom x={960} y={560} r={800} color={CH.light} strength={0.6} spread={0.5} />
        {/* empty toilet up top-left, feeding air down the riser */}
        <Toilet x={L0 + 40} y={CY - 250} s={1.5} water={0.04} f={f} />
        <Pipe d={`M ${L0 - 25} ${CY - 330} V ${CY}`} r={18} f={f} speed={0} wall={INK} inner={WATER} flow={WATER_LIT} flowOp={0.4} />
        <Pipe d={`M ${L0 - 40} ${CY} H ${L1 + 40}`} r={R} f={f} speed={close > 0.99 ? 0.4 : 4} wall={INK} inner={WATER} flow={WATER_LIT} />
        {/* air bubbles */}
        {Array.from({ length: 16 }, (_, i) => {
          const born = d * 0.04 + i * d * 0.025;
          if (t < born) return null;
          const a = t - born;
          const down = Math.min(1, a / 30);
          const x = down < 1 ? L0 - 25 : L0 - 25 + Math.min(900, (a - 30) * 3.2) + rnd(i) * 40;
          const y = down < 1 ? CY - 320 + down * 300 : CY - 30 + (rnd(i * 3) - 0.5) * 60 + Math.sin(f / 8 + i) * 6;
          const r0 = 10 + rnd(i * 5) * 10;
          const sq = 1 - 0.45 * near(x);
          return <circle key={i} cx={x} cy={y} r={r0 * sq} fill={CHALK} stroke={INK} strokeWidth={3} opacity={0.95} />;
        })}
        {/* the pressure wave */}
        {age > 0 ? (
          <g opacity={amp}>
            <Bloom x={wx} y={CY} r={200} color={TERRA_LIT} strength={0.9} squash={0.7} />
            <path d={`M ${wx - 110} ${CY - R - 4} Q ${wx} ${CY - R - 4 - 30 * amp} ${wx + 110} ${CY - R - 4}`} stroke={TERRA} strokeWidth={8} fill="none" strokeLinecap="round" />
            <path d={`M ${wx - 110} ${CY + R + 4} Q ${wx} ${CY + R + 4 + 30 * amp} ${wx + 110} ${CY + R + 4}`} stroke={TERRA} strokeWidth={8} fill="none" strokeLinecap="round" />
          </g>
        ) : null}
        {/* valve */}
        <rect x={L1 - 30} y={CY - R - 30 - 60 * (1 - close)} width={60} height={2 * R + 20} rx={10} fill={TERRA_DARK} />
        <path d={`M ${L1} ${CY - R - 40} V ${CY - R - 120}`} stroke={INK} strokeWidth={10} />
        <g transform={`rotate(${close * 180} ${L1} ${CY - R - 130})`}>
          <circle cx={L1} cy={CY - R - 130} r={44} fill="none" stroke={TERRA} strokeWidth={12} />
          <path d={`M ${L1 - 44} ${CY - R - 130} H ${L1 + 44} M ${L1} ${CY - R - 174} V ${CY - R - 86}`} stroke={TERRA} strokeWidth={8} />
        </g>
        {/* gauge */}
        <path d={`M ${GX} ${CY - R} V ${CY - R - 80}`} stroke={INK} strokeWidth={12} />
        <Gauge x={GX} y={CY - R - 160} r={80} n={needle} label="PRESSURE" />
        <g opacity={ease(t, d * 0.08, d * 0.18)}>
          <Txt x={L0 + 140} y={CY - 380} size={34} ls={2} fill={INK}>AIR IN</Txt>
          <Arrow x0={L0 + 130} y0={CY - 390} x1={L0 + 10} y1={CY - 330} color={INK} w={5} head={16} op={0.7} />
        </g>
        <At x={960} y={900} k={pop(t, tc + 6, 14)}>
          <Txt x={960} y={920} anchor="middle" size={72} fill={INK}>WATER HAMMER</Txt>
        </At>
      </ShotStage>
    );
  },

  // One engineer sized it for a town of 25,000 people on one tank: 40,000 gallons, about a small pool.
  "7-07": ({ t, d, f }) => {
    const G = 880;
    const tank = mix(0.92, 0.25, ease(t, d * 0.32, d * 0.72));
    const pool = ease(t, d * 0.32, d * 0.72);
    const flowing = t > d * 0.3 && t < d * 0.76;
    const houses = Array.from({ length: 16 }, (_, i) => ({ x: 560 + (i % 8) * 72 + (i >= 8 ? 36 : 0), y: i >= 8 ? G : G - 46, s: i >= 8 ? 0.78 : 0.6, at: d * (0.03 + ((i * 5) % 16) * 0.012) }));
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C88}>
        <Bloom x={900} y={420} r={820} color={SAGE.light} strength={0.5} spread={0.5} />
        <SageGround y={G} />
        <WaterTower x={330} ground={G} top={400} w={250} th={190} level={tank} f={f} />
        <Pipe d={`M 330 ${G - 10} V ${G + 40} H 1300 V ${G - 10}`} r={10} f={f} speed={flowing ? 5 : 0.3} wall={INK} inner={SAGE.near} flow={WATER_LIT} flowOp={flowing ? 1 : 0.4} />
        {houses.map((h, i) => (
          <At key={i} x={h.x} y={h.y} k={pop(t, h.at, 12)}>
            <House x={h.x} y={h.y} s={h.s} seed={i + 11} lit={0.4 + 0.3 * Math.sin(f / 20 + i)} />
          </At>
        ))}
        <At x={830} y={700} k={pop(t, d * 0.2, 12)}>
          <STPill x={830} y={700} text="25,000 PEOPLE · ONE TANK" align="middle" dark={false} />
        </At>
        <Pool x={1240} y={660} w={520} h={210} level={pool} f={f} />
        <At x={1240} y={540} k={pop(t, d * 0.7, 14)}>
          <Txt x={1240} y={560} size={84} fill={SAGE.text}>40,000 GAL</Txt>
          <Txt x={1244} y={604} size={24} ls={2} fill={SAGE.dim}>ABOUT A SMALL POOL · ONE ENGINEER'S SIZING</Txt>
        </At>
        <Lev x={1150} y={G} h={130} frame={f} eyes={pool > 0.5 ? "happy" : "open"} tilt={6} wind={0.3} outline={INK} />
      </ShotStage>
    );
  },

  // Our sum agrees: twenty-five thousand times one point six is forty thousand. (digits typing)
  "7-08": ({ t, d, f }) => {
    const size = 120;
    const A = "25,000", B = " × 1.6", C = " = ", D = "40,000";
    const seq = (s: string, a: number, b: number, color?: string) => s.split("").map((c, i) => ({ c, at: mix(a, b, s.length > 1 ? i / (s.length - 1) : 0), color }));
    const chars = [...seq(A, d * 0.05, d * 0.18), ...seq(B, d * 0.22, d * 0.32), ...seq(C, d * 0.38, d * 0.4), ...seq(D, d * 0.42, d * 0.54, TERRA_DARK)];
    const total = typedWidth(A + B + C + D, size);
    const x0 = 960 - total / 2, y = 520;
    const shown = chars.filter((c) => t >= c.at);
    const caretX = x0 + typedWidth(shown.map((c) => c.c).join(""), size) + 8;
    const caretOn = Math.floor(f / 12) % 2 === 0 && t < d * 0.6;
    const wA = typedWidth(A, size), wAB = typedWidth(A + " × ", size), w16 = typedWidth("1.6", size), wABC = typedWidth(A + B + C, size), wD = typedWidth(D, size);
    const lab = ease(t, d * 0.56, d * 0.64);
    const check = ease(t, d * 0.74, d * 0.82);
    return (
      <ShotStage fam="chalk" t={t} f={f} counter={C88}>
        <Bloom x={960} y={520} r={800} color={CH.light} strength={0.6} spread={0.5} />
        <path d={rrect(220, 300, 1480, 400, 36)} fill={INK} opacity={0.15} transform="translate(14 16)" />
        <path d={rrect(220, 300, 1480, 400, 36)} fill={CHALK} stroke={INK} strokeWidth={5} />
        <path d={rrect(250, 330, 1420, 60, 18)} fill={CH.sky[1]} />
        <Txt x={280} y={372} size={28} ls={4} fill={CH.dim}>THE ENGINEER'S TOWN, OUR SUM</Txt>
        <Typed x={x0} y={y + 40} size={size} chars={chars} t={t} />
        {caretOn ? <rect x={caretX} y={y - 50} width={8} height={100} rx={4} fill={INK} opacity={0.7} /> : null}
        <g opacity={lab}>
          <Txt x={x0 + wA / 2} y={y + 110} anchor="middle" size={26} ls={2} fill={CH.dim}>PEOPLE</Txt>
          <Txt x={x0 + wAB + w16 / 2} y={y + 110} anchor="middle" size={26} ls={2} fill={CH.dim}>GAL A FLUSH</Txt>
          <Txt x={x0 + wABC + wD / 2} y={y + 110} anchor="middle" size={26} ls={2} fill={CH.dim}>GAL</Txt>
        </g>
        <At x={1560} y={360} k={pop(t, d * 0.64, 12)}>
          <STPill x={1640} y={360} text="OUR SUM" align="end" />
        </At>
        {check > 0 ? (
          <path d="M 1530 830 l 40 40 l 90 -110" stroke={TERRA} strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="220" strokeDashoffset={220 * (1 - check)} />
        ) : null}
        <At x={420} y={1000} k={pop(t, d * 0.7, 14)}>
          <Lev x={420} y={1000} h={190} frame={f} pose="point" eyes="happy" tilt={8} wind={0.3} outline={INK} />
        </At>
      </ShotStage>
    );
  },

  // Still, those are engineers' judgments. They are not measured events. (two cards; JUDGMENT flips forward)
  "7-09": ({ t, d, f }) => {
    const G = 960, h = 300, LX = 960;
    const flip = lin(t, d * 0.25, d * 0.45);
    const fwd = ease(t, d * 0.42, d * 0.6);
    const sx = Math.abs(Math.cos(flip * Math.PI));
    const front = flip >= 0.5;
    const cw = 310, chh = 220;
    const s = h / 170;
    const hf: Pt = [LX + 95 * s, G - 120 * s], hb: Pt = [LX - 95 * s, G - 120 * s];
    const rcx = hf[0] + cw / 2 - 20, rcy = hf[1] - chh / 2 + 20;
    const lift = mix(0, -40, fwd);
    const gs = mix(1, 1.18, fwd);
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C88}>
        <Bloom x={960} y={480} r={800} color={SAGE.light} strength={0.55} spread={0.5} />
        <SageGround y={G} />
        {/* MEASURED (left) */}
        <g opacity={mix(1, 0.5, fwd)}>
          <path d={rrect(hb[0] - cw + 20, hb[1] - chh + 20, cw, chh, 20)} fill={CHALK} stroke={INK} strokeWidth={4} />
          <Txt x={hb[0] - cw / 2 + 20} y={hb[1] - chh / 2 + 34} anchor="middle" size={44} fill={INK}>MEASURED</Txt>
          <path d={`M ${hb[0] - cw + 70} ${hb[1] - 30} h 210`} stroke={INK} strokeWidth={5} opacity={0.6} />
          {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M ${hb[0] - cw + 70 + i * 30} ${hb[1] - 30} v ${i % 2 ? -10 : -18}`} stroke={INK} strokeWidth={4} opacity={0.6} />)}
        </g>
        {/* JUDGMENT (right) */}
        <g transform={`translate(${rcx} ${rcy + lift}) scale(${sx * gs} ${gs}) translate(${-rcx} ${-rcy})`}>
          {fwd > 0 ? <Bloom x={rcx} y={rcy} r={260} color={SAGE.light} strength={fwd} /> : null}
          <path d={rrect(rcx - cw / 2, rcy - chh / 2, cw, chh, 20)} fill={front ? CHALK : TERRA} stroke={INK} strokeWidth={4} />
          {front ? (
            <g>
              <Txt x={rcx} y={rcy + 4} anchor="middle" size={46} fill={TERRA_DARK}>JUDGMENT</Txt>
              <Txt x={rcx} y={rcy + 50} anchor="middle" size={20} ls={2} fill={INK} op={0.7}>ENGINEERS' VIEWS</Txt>
            </g>
          ) : (
            <Txt x={rcx} y={rcy + 30} anchor="middle" size={90} fill={TERRA_LIT}>?</Txt>
          )}
        </g>
        <Lev x={LX} y={G} h={h} frame={f} pose="shrug" hands={{ front: [95, -120], back: [-95, -120] }} eyes={fwd > 0.5 ? "squint" : "open"} tilt={mix(0, 8, fwd)} wind={0.3} outline={INK} />
        <Txt x={960} y={1030} anchor="middle" size={36} ls={3} fill={CHALK} op={ease(t, d * 0.6, d * 0.72)}>NOT MEASURED EVENTS</Txt>
      </ShotStage>
    );
  },

  // A famous story blames the Super Bowl flush for a water main break in Salt Lake City in 1984. (clipping slides in)
  "7-10": ({ t, d, f }) => {
    const k = ease(t, 0, d * 0.22);
    const x = mix(2500, 880, k);
    const rot = mix(-16, -3, k) + Math.sin(f / 9) * 1.2 * (0.4 + 0.6 * (1 - k));
    const c1 = pop(t, d * 0.5, 12), c2 = pop(t, d * 0.64, 12);
    const q = Math.sin(f / 7) * 6;
    return (
      <ShotStage fam="clay" t={t} f={f} counter={C88}>
        <Bloom x={900} y={540} r={820} color={CLAY.light} strength={0.5} spread={0.5} />
        <rect x={-80} y={880} width={2080} height={300} fill={CLAY.near} opacity={0.7} />
        <Txt x={90} y={160} size={40} ls={4} fill={CLAY.light} op={ease(t, d * 0.12, d * 0.24)}>A FAMOUS STORY</Txt>
        <Clipping x={x} y={570} rot={rot} />
        <At x={1640} y={360} k={c1}>
          <path d={rrect(1460, 320, 360, 80, 40)} fill={INK} opacity={0.75} />
          <Txt x={1640} y={372} anchor="middle" size={30} ls={2} fill={CHALK}>HALFTIME FLUSH</Txt>
        </At>
        {c2 > 0 ? <Arrow x0={1640} y0={410} x1={1640} y1={520} color={CHALK} w={6} head={20} dash="12 10" op={Math.min(1, c2)} /> : null}
        <At x={1640} y={580} k={c2}>
          <path d={rrect(1460, 540, 360, 80, 40)} fill={INK} opacity={0.75} />
          <Txt x={1620} y={592} anchor="middle" size={30} ls={2} fill={CHALK}>MAIN BREAK</Txt>
          <Txt x={1780} y={600 + q} anchor="middle" size={56} fill={TERRA_LIT}>?</Txt>
        </At>
      </ShotStage>
    );
  },

  // The city's infrastructure was old, and one sewer district says the odds… are slim to none. The worst case is a bad
  // day on a few streets, not a drained city.
  "7-11": ({ t, d, f }) => {
    const move = ease(t, d * 0.27, d * 0.36);
    const out = ease(t, d * 0.54, d * 0.62);
    const mapIn = ease(t, d * 0.58, d * 0.68);
    const cx = mix(880, 470, move), cy = mix(570, 560, move), cs = mix(1, 0.55, move);
    const quoteK = ease(t, d * 0.3, d * 0.4);
    const words = ["SLIM", "TO", "NONE"];
    const ul = ease(t, d * 0.44, d * 0.5);
    // the street map
    const BW = 140, BH = 96, SW = 30, MX = 230, MY = 330, NC = 8, NR = 5;
    const hot: [number, number, number][] = [[2, 3, 0], [6, 1, 1], [4, 4, 1]]; // col,row,horizontal?
    return (
      <ShotStage fam="clay" t={t} f={f} counter={C88}>
        <Bloom x={900} y={540} r={820} color={CLAY.light} strength={0.5} spread={0.5} />
        {out < 1 ? (
          <g opacity={1 - out} transform={`translate(${-300 * out} 0)`}>
            <rect x={-80} y={880} width={2080} height={300} fill={CLAY.near} opacity={0.7} />
            <g transform={`translate(${cx} ${cy}) scale(${cs}) translate(${-cx} ${-cy})`}>
              <Clipping x={cx} y={cy} rot={-3 + Math.sin(f / 11) * 0.5} />
              <Stamp x={cx + 20} y={cy + 10} text="OLD PIPES" a={t - d * 0.05} rot={-12} size={74} />
            </g>
            {quoteK > 0 ? (
              <g opacity={quoteK} transform={`translate(${mix(200, 0, quoteK)} 0)`}>
                <path d={rrect(900, 330, 920, 440, 30)} fill={INK} opacity={0.82} />
                <Txt x={950} y={470} size={120} fill={TERRA_LIT} op={0.9}>“</Txt>
                {words.map((w, i) => {
                  const k = pop(t, d * (0.33 + i * 0.035), 10);
                  const xs = [1010, 1300, 1470][i];
                  return k > 0 ? (
                    <At key={i} x={xs} y={540} k={k}>
                      <Txt x={xs} y={570} size={96} fill={CHALK}>{w}</Txt>
                    </At>
                  ) : null;
                })}
                <Txt x={1770} y={640} size={120} fill={TERRA_LIT} op={0.9 * ease(t, d * 0.42, d * 0.44)}>”</Txt>
                <path d={`M 1010 604 H ${1010 + 740 * ul}`} stroke={TERRA} strokeWidth={10} strokeLinecap="round" opacity={ul > 0 ? 1 : 0} />
                <Txt x={1010} y={680} size={24} ls={2} fill={CHALK} op={0.85}>ONE SEWER DISTRICT, ON THE ODDS A BIG CITY'S</Txt>
                <Txt x={1010} y={716} size={24} ls={2} fill={CHALK} op={0.85}>SEWER CAN'T HANDLE THE FLOW</Txt>
              </g>
            ) : null}
          </g>
        ) : null}
        {mapIn > 0 ? (
          <g opacity={mapIn}>
            <rect x={MX - SW} y={MY - SW} width={NC * (BW + SW) + SW} height={NR * (BH + SW) + SW} rx={20} fill={CLAY.near} opacity={0.85} />
            {Array.from({ length: NC * NR }, (_, i) => {
              const c = i % NC, r = Math.floor(i / NC);
              const x = MX + c * (BW + SW), y = MY + r * (BH + SW);
              return (
                <g key={i}>
                  <rect x={x} y={y} width={BW} height={BH} rx={8} fill={CLAY.mid} />
                  {[0, 1, 2, 3].map((k) => <rect key={k} x={x + 14 + k * 34} y={y + 16 + (k % 2) * 30} width={22} height={22} rx={3} fill={CREAM} opacity={0.55} />)}
                </g>
              );
            })}
            {/* calm flow along every street */}
            {Array.from({ length: NR + 1 }, (_, r) => (
              <path key={`h${r}`} d={`M ${MX - SW / 2} ${MY - SW / 2 + r * (BH + SW)} H ${MX + NC * (BW + SW) - SW / 2}`} stroke={WATER} strokeWidth={4} strokeDasharray="20 26" strokeDashoffset={-f * 1.5} opacity={0.55} />
            ))}
            {/* a few streets have a bad day */}
            {hot.map(([c, r, hz], i) => {
              const k = ease(t, d * (0.66 + i * 0.04), d * (0.7 + i * 0.04));
              const x = MX - SW / 2 + c * (BW + SW), y = MY - SW / 2 + r * (BH + SW);
              const dd = hz ? `M ${x} ${y} H ${x + BW + SW}` : `M ${x} ${y} V ${y + BH + SW}`;
              const pulse = 0.6 + 0.4 * Math.sin(f / 5 + i * 2);
              return k > 0 ? (
                <g key={i} opacity={k}>
                  <path d={dd} stroke={TERRA_LIT} strokeWidth={30} strokeLinecap="round" opacity={0.35 * pulse} />
                  <path d={dd} stroke={TERRA} strokeWidth={14} strokeLinecap="round" />
                  <path d={dd} stroke={WATER_LIT} strokeWidth={4} strokeDasharray="10 12" strokeDashoffset={-f * 3} strokeLinecap="round" />
                </g>
              ) : null;
            })}
            <Txt x={MX - SW} y={210} size={52} fill={CHALK} op={ease(t, d * 0.64, d * 0.72)}>A BAD DAY ON A FEW STREETS</Txt>
            <Txt x={MX - SW} y={262} size={32} ls={3} fill={CLAY.light} op={ease(t, d * 0.8, d * 0.86)}>NOT A DRAINED CITY</Txt>
          </g>
        ) : null}
        {mapIn > 0.5 ? <Lev x={1830} y={1010} h={150} frame={f} facing={-1} pose="shrug" eyes="happy" tilt={6} wind={0.3} shade={LEVSH} /> : null}
      </ShotStage>
    );
  },

  // One city is fine. Now the country. (pull back to the whole country; rung THE COUNTRY lights)
  "7-12": ({ t, d, f }) => {
    const p = ease(t, d * 0.04, d * 0.62);
    const Z = Math.pow(30, 1 - p);
    const F: Pt = [mix(US_NYC[0], US_CENTER[0], p), mix(US_NYC[1], US_CENTER[1], p)];
    const S: Pt = [mix(960, 760, p), 560];
    const litAt = d * 0.6;
    const flash = t > litAt ? Math.max(0, 1 - (t - litAt) / 24) : 0;
    const MC: Pt = [880, 590]; // NycMap centre
    const here: Pt = [S[0] + (US_NYC[0] - F[0]) * Z, S[1] + (US_NYC[1] - F[1]) * Z];
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C88} ladder={t < litAt ? 6 : 7}>
        <Bloom x={760} y={520} r={820} color={SAGE.light} strength={0.5} spread={0.5} />
        <path d={rrect(1460, 290, 430, 760, 30)} fill={INK} opacity={0.5} />
        <g transform={`translate(${S[0]} ${S[1]}) scale(${Z}) translate(${-F[0]} ${-F[1]})`}>
          <path d={US_D} fill={SAGE.near} opacity={0.3 * ease(p, 0.2, 0.6)} transform="translate(6 8)" />
          <path d={US_D} fill={SAGE.mid} opacity={ease(p, 0.15, 0.5)} stroke={SAGE.near} strokeWidth={4} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          <g opacity={1 - ease(p, 0.25, 0.6)} transform={`translate(${US_NYC[0]} ${US_NYC[1]}) scale(${1 / 30}) translate(${-MC[0]} ${-MC[1]})`}>
            <NycMap f={f} />
          </g>
        </g>
        <circle cx={here[0]} cy={here[1]} r={14 + 4 * Math.sin(f / 5)} fill={LIME} opacity={ease(p, 0.5, 0.8)} />
        <circle cx={here[0]} cy={here[1]} r={22 + ((f * 1.2) % 30)} fill="none" stroke={LIME_DEEP} strokeWidth={5} opacity={ease(p, 0.5, 0.8) * (1 - ((f * 1.2) % 30) / 30)} />
        {flash > 0 ? <Bloom x={1810} y={410} r={220} color={LIME} strength={flash} /> : null}
        <Txt x={90} y={980} size={56} fill={SAGE.text} op={ease(t, d * 0.66, d * 0.8)}>Now the country</Txt>
      </ShotStage>
    );
  },
};
