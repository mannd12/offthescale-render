// ST02 act "l03" · 3 · One city, measured: Seattle (sage / chalk; chapter beat on moss). Shot bodies 3-01..3-08.
// Every beat sits at a fraction of the shot length d (timings are estimated and will move).
import React from "react";
import { ShotMap, ShotStage, ease, lin, mix, pop } from "../shot";
import { Lev } from "../../../lib/suppose/lev";
import { Counter, STPill } from "../../../lib/suppose/devices";
import { BRASS, BRASS_DARK, CHALK, INK, LIME, TERRA } from "../../../lib/suppose/palette";
import { Bloom } from "../../../lib/illustrated/light";
import { Cumulus } from "../../../lib/illustrated/props";
import { CHALK_SHADE } from "../../../lib/suppose/palette";
import { rrect, smoothPath } from "../../../lib/illustrated/shapes";
import { Arrow, CHK, C_SEATTLE, ChapterBeat8, Gauge, Grid, Odometer, PIPE_DK, Pin, SAGE, TERRA_DARK, Toilet, Txt, WATER, WATER_DK, WATER_LT, clamp01 } from "./l02-parts";
import { Calculator, DemandGraph, GR, SeattleMap, Skyline, SumCard, SumLine, keyOf, typed } from "./l03-parts";

const Ground: React.FC<{ y?: number }> = ({ y = 960 }) => (
  <g>
    <path d={smoothPath([[-60, y], [500, y - 16], [1100, y + 4], [1980, y - 10]]) + ` L 1980 1120 L -60 1120 Z`} fill={SAGE.mid} />
    <path d={smoothPath([[-60, y + 50], [700, y + 40], [1400, y + 56], [1980, y + 44]]) + ` L 1980 1120 L -60 1120 Z`} fill={SAGE.near} />
  </g>
);

/** label chip: ink pill with chalk text */
const Chip: React.FC<{ x: number; y: number; text: string; k: number; size?: number; anchor?: "start" | "middle" }> = ({ x, y, text, k, size = 44, anchor = "middle" }) => {
  if (k <= 0) return null;
  const w = text.length * size * 0.6 + 50;
  const x0 = anchor === "middle" ? -w / 2 : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <rect x={x0} y={-size * 0.95} width={w} height={size * 1.4} rx={size * 0.7} fill={INK} opacity={0.86} />
      <Txt x={x0 + w / 2} y={size * 0.12} anchor="middle" size={size} fill={CHALK}>{text}</Txt>
    </g>
  );
};

/** calculator display + pressed key for a list of typed lines */
const calcState = (t: number, lines: SumLine[], display: string[]) => {
  let disp = "", press = -1;
  lines.forEach((l, i) => {
    const k = clamp01((t - l.at) / Math.max(1, l.dur));
    if (k <= 0) return;
    const shown = typed(display[i], k);
    disp = shown;
    if (k < 1) {
      const full = typed(l.text, k);
      const c = full.slice(-1);
      press = keyOf(c);
    }
  });
  return { disp, press };
};

const bump = (t: number, at: number, n = 14, amt = 0.12) => (t < at ? 1 : 1 + amt * Math.sin(Math.PI * clamp01((t - at) / n)));

export const SHOTS_L03: ShotMap = {
  // Seattle map; demand graph flat, a terracotta HALFTIME bar, then a sharp lime climb; 6,477 gal/min · 15 min
  "3-01": ({ t, d, f }) => {
    const mapK = ease(t, 0, 0.12 * d);
    const p = lin(t, 0.1 * d, 0.78 * d);
    const hb = ease(t, 0.3 * d, 0.42 * d);
    const l1 = pop(t, 0.8 * d, 14);
    const l2 = ease(t, 0.86 * d, 0.96 * d);
    return (
      <ShotStage fam="sage" t={t} f={f}>
        <Bloom x={600} y={260} r={760} color={SAGE.light} strength={0.5} spread={0.5} />
        <Ground />
        <g transform={`translate(${mix(-600, 0, mapK)} 0)`}>
          <SeattleMap x={120} y={220} w={470} h={520} t={t} />
        </g>
        <DemandGraph p={p} hb={hb} t={t} />
        {/* 15 min bracket under the climb */}
        {l2 > 0 ? (
          <g opacity={l2}>
            <path d={`M ${GR.hb1} ${GR.flat + 40} v 24 H ${mix(GR.hb1, GR.climbEnd, l2)} v -24`} stroke={INK} strokeWidth={6} fill="none" strokeLinejoin="round" strokeLinecap="round" />
            <Txt x={(GR.hb1 + GR.climbEnd) / 2} y={GR.flat + 118} anchor="middle" size={44} fill={INK}>15 min</Txt>
          </g>
        ) : null}
        {l1 > 0 ? (
          <g>
            <Arrow x0={1590} y0={GR.flat - 6} x1={1590} y1={GR.flat - (GR.flat - GR.peak) * Math.min(1, l1) + 14} color={INK} w={8} head={22} />
            <Chip x={1400} y={310} text="6,477 gal/min" k={l1} size={46} />
          </g>
        ) : null}
        <Lev x={360} y={962} h={150} frame={f} pose={t > 0.5 * d ? "point" : "stand"} eyes={t > 0.5 * d ? "wide" : "open"} tilt={-4} outline={INK} />
      </ShotStage>
    );
  },

  // Counter rolls to 60,722 (big odometer, then it settles into the Counter); the climb fills with water
  "3-02": ({ t, d, f }) => {
    const inK = pop(t, 0.02 * d, 14);
    const v = 60722 * ease(t, 0.08 * d, 0.6 * d);
    const fly = ease(t, 0.66 * d, 0.8 * d);
    const settled = t >= 0.8 * d;
    const fill = ease(t, 0.78 * d, 0.95 * d);
    const ocx = 960, ocy = 520;
    const sc = mix(1, 0.4, fly) * Math.max(0, inK);
    const tx = mix(ocx, 1680, fly), ty = mix(ocy, 140, fly);
    return (
      <ShotStage fam="sage" t={t} f={f} counter={settled ? C_SEATTLE : undefined}>
        <Bloom x={600} y={260} r={760} color={SAGE.light} strength={0.5} spread={0.5} />
        <Ground />
        <SeattleMap x={120} y={220} w={470} h={520} t={t} />
        <DemandGraph p={1} hb={1} t={t} dim={1 - fly} fill={fill} />
        <Chip x={1400} y={310} text="6,477 gal/min" k={fly} size={46} />
        {!settled && sc > 0 ? (
          <g transform={`translate(${tx} ${ty}) scale(${sc}) translate(${-ocx} ${-ocy})`} opacity={1 - ease(t, 0.76 * d, 0.8 * d)}>
            <rect x={540} y={330} width={840} height={360} rx={40} fill={INK} opacity={0.9} />
            <rect x={540} y={330} width={840} height={360} rx={40} fill="none" stroke={LIME} strokeOpacity={0.4} strokeWidth={3} />
            <Txt x={960} y={410} anchor="middle" size={40} fill={CHALK} ls={6} op={0.85}>FLUSHES</Txt>
            <Odometer x={1290} y={630} v={v} digits={5} size={200} />
          </g>
        ) : null}
        <Lev x={360} y={962} h={150} frame={f} pose="stand" eyes={t < 0.6 * d ? "up" : "happy"} tilt={-10} outline={INK} />
      </ShotStage>
    );
  },

  // Calculator card: 6,477 × 15 = 97,155 (OUR SUM)
  "3-03": ({ t, d, f }) => {
    const lines: SumLine[] = [
      { text: "6,477", unit: "GAL / MIN", at: 0.06 * d, dur: 0.14 * d },
      { text: "× 15", unit: "MIN", at: 0.28 * d, dur: 0.1 * d },
      { text: "= 97,155", unit: "GAL", at: 0.5 * d, dur: 0.12 * d, size: 130, color: TERRA_DARK },
    ];
    const cs = calcState(t, lines, ["6,477", "15", "97,155"]);
    const pill = pop(t, 0.7 * d, 14);
    const sweep = t > 0.78 * d ? ((t - 0.78 * d) % 50) / 50 : -1;
    return (
      <ShotStage fam="chalk" t={t} f={f} counter={C_SEATTLE}>
        <Grid />
        <Calculator x={230} y={300} display={cs.disp} press={cs.press} t={t} />
        <SumCard x={760} y={240} w={900} h={680} t={t} lines={lines} ruleAt={0.44 * d} resultPop={bump(t, 0.62 * d)} sweep={sweep} />
        {pill > 0 ? (
          <g transform={`translate(830 860) scale(${pill}) translate(-830 -860)`}>
            <STPill x={830} y={860} text="OUR SUM" size={26} />
          </g>
        ) : null}
      </ShotStage>
    );
  },

  // 97,155 ÷ 60,722 = 1.6 (OUR SUM), a check for the federal figure
  "3-04": ({ t, d, f }) => {
    const lines: SumLine[] = [
      { text: "97,155", unit: "GAL", at: 0.04 * d, dur: 0.14 * d },
      { text: "÷ 60,722", unit: "FLUSHES", at: 0.24 * d, dur: 0.16 * d },
      { text: "= 1.6", unit: "GAL A FLUSH", at: 0.5 * d, dur: 0.08 * d, size: 160, color: TERRA_DARK },
    ];
    const cs = calcState(t, lines, ["97,155", "60,722", "1.6"]);
    const pill = pop(t, 0.66 * d, 14);
    const check = pop(t, 0.8 * d, 14);
    return (
      <ShotStage fam="chalk" t={t} f={f} counter={C_SEATTLE}>
        <Grid />
        <Calculator x={230} y={300} display={cs.disp} press={cs.press} t={t} />
        <SumCard x={760} y={240} w={900} h={680} t={t} lines={lines} ruleAt={0.44 * d} resultPop={bump(t, 0.58 * d, 16, 0.2)} />
        {pill > 0 ? (
          <g transform={`translate(830 860) scale(${pill}) translate(-830 -860)`}>
            <STPill x={830} y={860} text="OUR SUM" size={26} />
          </g>
        ) : null}
        {check > 0 ? (
          <g transform={`translate(980 730) scale(${check})`}>
            <circle r={62} fill={TERRA} />
            <path d="M -28 2 L -8 24 L 30 -22" stroke={CHALK} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ) : null}
      </ShotStage>
    );
  },

  // GALLONS → FLUSHES converter dial (a conversion, not a head count of toilets)
  "3-05": ({ t, d, f }) => {
    const cx = 960, cy = 540, r = 200;
    const rot = t * 2.2;
    const inK = ease(t, 0, 0.15 * d);
    const no = pop(t, 0.5 * d, 14);
    return (
      <ShotStage fam="chalk" t={t} f={f} counter={C_SEATTLE}>
        <Grid />
        {/* gallons in */}
        <rect x={160} y={cy - 40} width={620} height={80} rx={36} fill={PIPE_DK} />
        <rect x={170} y={cy - 26} width={600} height={52} rx={26} fill={WATER} />
        {[-10, 10].map((dy, i) => <path key={i} d={`M 190 ${cy + dy} H 760`} stroke={WATER_LT} strokeWidth={5} strokeDasharray="34 26" strokeDashoffset={-t * 4 - i * 20} strokeLinecap="round" />)}
        <Txt x={460} y={cy - 80} anchor="middle" size={52} fill={CHK.text} ls={4} op={inK}>GALLONS</Txt>
        {/* flushes out */}
        <path d={`M 1180 ${cy} H 1680`} stroke={INK} strokeWidth={10} strokeDasharray="30 22" strokeDashoffset={-t * 4} strokeLinecap="round" />
        <Arrow x0={1660} y0={cy} x1={1740} y1={cy} color={INK} w={10} head={34} />
        <Txt x={1450} y={cy - 80} anchor="middle" size={52} fill={CHK.text} ls={4} op={inK}>FLUSHES</Txt>
        {/* the dial */}
        <circle cx={cx} cy={cy + 10} r={r + 30} fill={INK} opacity={0.15} />
        <circle cx={cx} cy={cy} r={r + 30} fill={BRASS_DARK} />
        <circle cx={cx} cy={cy} r={r + 16} fill={BRASS} />
        <g transform={`rotate(${rot} ${cx} ${cy})`}>
          {Array.from({ length: 24 }, (_, i) => (
            <path key={i} d={`M ${cx} ${cy - r - 12} V ${cy - r + (i % 2 ? 6 : 18)}`} stroke={BRASS_DARK} strokeWidth={6} strokeLinecap="round" transform={`rotate(${i * 15} ${cx} ${cy})`} />
          ))}
          <circle cx={cx} cy={cy} r={r - 30} fill={TERRA} />
          <path d={rrect(cx - 18, cy - r + 40, 36, 120, 18)} fill={CHALK} />
          <circle cx={cx} cy={cy} r={40} fill={TERRA_DARK} />
        </g>
        <circle cx={cx - 50} cy={cy - 60} r={30} fill="#FFFFFF" opacity={0.12} />
        {/* no toilets counted */}
        {no > 0 ? (
          <g transform={`translate(960 900) scale(${no})`}>
            <circle r={78} fill={CHALK} stroke={TERRA} strokeWidth={10} />
            <Toilet x={6} y={44} s={0.8} />
            <path d="M -55 -55 L 55 55" stroke={TERRA} strokeWidth={12} strokeLinecap="round" />
          </g>
        ) : null}
      </ShotStage>
    );
  },

  // Miami-Dade: a pressure needle steady across BEFORE / DURING / AFTER; NO CHANGE
  "3-06": ({ t, d, f }) => {
    const cur = lin(t, 0.1 * d, 0.84 * d);
    const tx0 = 920, tx1 = 1700, ty = 820;
    const cx = mix(tx0, tx1, cur);
    const needle = 10 + Math.sin(t / 4) * 0.8;
    const pill = pop(t, 0.86 * d, 14);
    const pin = ease(t, 0.04 * d, 0.14 * d);
    const mx = 130, my = 200, mw = 540, mh = 600;
    const sleepy = t > 0.6 * d;
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C_SEATTLE}>
        <Bloom x={1300} y={300} r={700} color={SAGE.light} strength={0.5} spread={0.5} />
        <Ground />
        {/* map: the tip of Florida */}
        <defs><clipPath id="l306m"><path d={rrect(mx, my, mw, mh, 26)} /></clipPath></defs>
        <path d={rrect(mx, my, mw, mh, 26)} fill={WATER} />
        <g clipPath="url(#l306m)">
          <path d={smoothPath([[mx + 60, my - 20], [mx + 200, my + 160], [mx + 330, my + 330], [mx + 380, my + 470], [mx + 330, my + 560], [mx + 400, my + 640]]) + ` L ${mx - 20} ${my + mh + 20} L ${mx - 20} ${my - 20} Z`} fill={SAGE.mid} />
          {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${mx + 400 + (i % 2) * 30} ${my + 70 + i * 110} h 100`} stroke={WATER_LT} strokeWidth={4} strokeDasharray="20 18" strokeDashoffset={-t * 1.2 - i * 9} opacity={0.8} />)}
        </g>
        <Pin x={mx + 300} y={my + 400} k={pin} color={TERRA} />
        <Txt x={mx + mw / 2} y={my + mh + 56} anchor="middle" size={34} fill={SAGE.text} ls={5}>MIAMI-DADE</Txt>
        {/* gauge + trace */}
        <Gauge cx={1310} cy={400} r={170} angle={needle} />
        <path d={`M ${tx0} 650 H ${cx}`} stroke={INK} strokeWidth={7} strokeLinecap="round" opacity={cur > 0 ? 0.85 : 0} />
        {/* timeline */}
        {["BEFORE", "DURING", "AFTER"].map((s, i) => {
          const a = mix(tx0, tx1, i / 3), b = mix(tx0, tx1, (i + 1) / 3);
          return (
            <g key={s}>
              <rect x={a + 4} y={ty - 22} width={b - a - 8} height={44} rx={22} fill={i === 1 ? TERRA : SAGE.far} opacity={0.9} />
              <Txt x={(a + b) / 2} y={ty + 74} anchor="middle" size={30} fill={SAGE.text} ls={3}>{s}</Txt>
            </g>
          );
        })}
        <path d={`M ${cx} 620 V ${ty + 34}`} stroke={LIME} strokeWidth={8} strokeLinecap="round" />
        <path d={`M ${cx} 620 V ${ty + 34}`} stroke={INK} strokeWidth={14} strokeLinecap="round" opacity={0.18} />
        <circle cx={cx} cy={650} r={13} fill={LIME} stroke={INK} strokeWidth={3} />
        {pill > 0 ? (
          <g transform={`translate(1310 960) scale(${pill}) translate(-1310 -960)`}>
            <STPill x={1310} y={960} text="NO CHANGE" align="middle" size={34} />
          </g>
        ) : null}
        <Lev x={780} y={964} h={130} frame={f} pose="stand" eyes={sleepy ? "closed" : "open"} tilt={sleepy ? 12 : 0} outline={INK} />
      </ShotStage>
    );
  },

  // Lev holds a sign: SEATTLE ISN'T NYC (Seattle small on the left, New York towering behind on the right)
  "3-07": ({ t, d, f }) => {
    const base = 900;
    const h = 220, s = h / 170;
    const lx = 960;
    const bob = Math.sin(t / 9) * 8;
    const rot = Math.sin(t / 7) * 4;
    const hand: [number, number] = [44, -128 + bob / s];
    const hx = lx + hand[0] * s, hy = base + hand[1] * s;
    const up = ease(t, 0, 0.18 * d);
    const sy = hy - 150 + (1 - up) * 300;
    const nyc = ease(t, 0.35 * d, 0.6 * d);
    const cloudX = (t * 1.4) % 2400;
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C_SEATTLE}>
        <Bloom x={960} y={300} r={760} color={SAGE.light} strength={0.5} spread={0.5} />
        <Cumulus x={1800 - cloudX} y={250} w={300} h={110} fill={CHALK} shade={CHALK_SHADE} lit={SAGE.light} seed={5} frame={f} opacity={0.8} />
        <Skyline x={1180} base={base + 10} scale={mix(0.9, 1.5, nyc)} fill={SAGE.mid} seed={31} n={7} op={0.75} />
        <Skyline x={150} base={base + 10} scale={0.7} fill={SAGE.near} seed={7} n={7} needle op={0.85} />
        <Ground y={base} />
        {/* the sign */}
        <g transform={`rotate(${rot} ${hx} ${hy})`}>
          <path d={`M ${hx} ${hy + 10} V ${sy}`} stroke={TERRA_DARK} strokeWidth={14} strokeLinecap="round" />
          <path d={rrect(hx - 330, sy - 150, 660, 150, 22)} fill={TERRA} />
          <path d={rrect(hx - 316, sy - 136, 632, 122, 16)} fill={CHALK} />
          <Txt x={hx} y={sy - 54} anchor="middle" size={58} fill={INK}>SEATTLE ISN'T NYC</Txt>
        </g>
        <Lev x={lx} y={base} h={h} frame={f} pose="pull" hands={{ front: hand, back: [hand[0] - 8, hand[1] + 12] }} eyes={t > 0.5 * d ? "happy" : "open"} tilt={-6 + Math.sin(t / 11) * 3} outline={INK} />
      </ShotStage>
    );
  },

  // chapter beat: rung NEW YORK
  "3-08": ({ t, d, f }) => <ChapterBeat8 t={t} d={d} f={f} fam="moss" prev={2} next={3} eyebrow="NEXT RUNG" title="New York" counter={C_SEATTLE} />,
};

void [Counter, WATER_DK, TERRA, Gauge];
