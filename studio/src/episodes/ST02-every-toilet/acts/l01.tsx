// ST02 act "l01": shot bodies keyed by storyboard id (../shotlist.ts). 1-01..1-10, family sage. Beats scale with d.
import React from "react";
import { ShotMap, ShotStage, ease, lin, mix, pop } from "../shot";
import { Bloom } from "../../../lib/illustrated/light";
import { rnd } from "../../../lib/illustrated/motion";
import { AIR, CHALK, INK, LIME, ST_FONT, SUPPOSE, TERRA } from "../../../lib/suppose/palette";
import { Lev } from "../../../lib/suppose/lev";
import { STPill } from "../../../lib/suppose/devices";
import { ChapterBeat, CREAM, FLUSHES, partial, Pt, TinyToilet, Toilet, WATER, WATER_DK } from "./cold-parts";
import { BAR, FlipCalendar, HomeBar, INDOOR, Jug, Pipe, TOILET_PART, US_D, US_SITES } from "./l01-parts";

const S = SUPPOSE.sage;
const C1 = FLUSHES("1");

const Floor: React.FC<{ y: number }> = ({ y }) => (
  <g>
    <rect x={-60} y={y} width={2040} height={300} fill={S.mid} />
    <path d={`M -60 ${y + 2} H 1980`} stroke={S.near} strokeWidth={4} opacity={0.5} />
  </g>
);
const Label: React.FC<{ x: number; y: number; text: string; size?: number; k?: number; anchor?: "start" | "middle" | "end"; color?: string }> = ({ x, y, text, size = 96, k = 1, anchor = "middle", color = S.text }) =>
  k <= 0.001 ? null : (
    <g transform={`translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})`}>
      <text x={x} y={y} textAnchor={anchor} fontFamily={ST_FONT} fontWeight={900} fontSize={size} fill={color}>{text}</text>
    </g>
  );

export const SHOTS_L01: ShotMap = {
  // one toilet, cutaway tank; the handle drops, the tank empties along a blue-sage stream into a jug that nearly fills
  "1-01": ({ t, d, f }) => {
    const base = 880;
    const press = ease(t, d * 0.06, d * 0.12) * (1 - ease(t, d * 0.55, d * 0.62));
    const drain = ease(t, d * 0.12, d * 0.55);
    const refill = ease(t, d * 0.62, d) * 0.55;
    const level = Math.max(0.02, 0.92 - drain * 0.9 + refill);
    const jug = drain * 0.88;
    const flowing = drain > 0.01 && drain < 0.99;
    // stream from the cutaway tank over to the jug mouth
    const src: Pt = [620 - 30 * 1.5, base - 190 * 1.5];
    const sk = ease(t, d * 0.12, d * 0.2) * (1 - ease(t, d * 0.55, d * 0.6));
    const sp = { d: `M ${src[0]} ${src[1]} C ${src[0] + 40} ${src[1] - 260} ${1200} ${src[1] - 300} ${1250} ${base - 345}` };
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C1}>
        <Bloom x={420} y={240} r={700} color={S.light} strength={0.55} spread={0.5} />
        <Floor y={base} />
        <Toilet x={620} y={base} s={1.5} level={level} handle={press} frame={f} slosh={flowing ? 4 : 1.5} />
        {sk > 0.01 ? (
          <g opacity={sk}>
            <path d={sp.d} stroke={WATER} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d={sp.d} stroke={AIR} strokeWidth={5} fill="none" strokeLinecap="round" strokeDasharray="20 26" strokeDashoffset={-t * 6} />
          </g>
        ) : null}
        <Jug x={1250} base={base} w={250} h={340} level={jug} frame={f} slosh={flowing ? 5 : 2} />
        <Label x={1250} y={400} text="1.6 GAL" size={110} k={pop(t, d * 0.5, 14)} />
        <Lev x={1640} y={base - 4} h={170} frame={f} facing={-1} pose={jug > 0.7 ? "point" : "stand"} eyes={jug > 0.8 ? "happy" : "open"} tilt={-6 + 3 * Math.sin(t / 9)} outline={INK} />
      </ShotStage>
    );
  },

  // two tanks side by side: the federal 1.6 and a smaller water-saver, 1.28 or less; levels rise and settle
  "1-02": ({ t, d, f }) => {
    const base = 900;
    const fill = ease(t, 0, d * 0.35);
    const slosh = 9 * Math.exp(-t / (d * 0.25)) + 1.2;
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C1}>
        <Bloom x={960} y={240} r={800} color={S.light} strength={0.5} spread={0.5} />
        <Floor y={base} />
        <g transform={`translate(0 ${(1 - pop(t, 0, 14)) * 60})`}>
          <Toilet x={620} y={base} s={1.45} level={0.88 * fill} frame={f} slosh={slosh} />
        </g>
        <g transform={`translate(0 ${(1 - pop(t, d * 0.12, 14)) * 60})`} opacity={Math.min(1, pop(t, d * 0.12, 14) * 2)}>
          <Toilet x={1260} y={base} s={1.45} tank={0.8} level={0.88 * ease(t, d * 0.12, d * 0.45)} frame={f + 11} slosh={slosh} />
        </g>
        <Label x={560} y={300} text="1.6 GAL" size={86} k={pop(t, d * 0.25, 14)} />
        <Label x={1200} y={345} text="1.28 GAL OR LESS" size={70} k={pop(t, d * 0.5, 14)} />
      </ShotStage>
    );
  },

  // three toilets in a row; the older ones' tanks grow: 3.5 (1980-94), 5 (before 1980)
  "1-03": ({ t, d, f }) => {
    const base = 920;
    const g2 = ease(t, d * 0.12, d * 0.32), g3 = ease(t, d * 0.45, d * 0.68);
    const items = [
      { x: 400, tank: 1, big: "1.6 GAL", small: "TODAY", k: pop(t, 0, 12) },
      { x: 960, tank: mix(1, 1.6, g2), big: "3.5 GAL", small: "1980-94", k: pop(t, d * 0.3, 12) },
      { x: 1520, tank: mix(1, 2.1, g3), big: "5 GAL", small: "BEFORE 1980", k: pop(t, d * 0.66, 12) },
    ];
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C1}>
        <Bloom x={960} y={240} r={800} color={S.light} strength={0.5} spread={0.5} />
        <Floor y={base} />
        {items.map((it, i) => {
          const topY = base - (168 + 132 * it.tank + 16) * 1.05;
          return (
            <g key={i}>
              <Toilet x={it.x} y={base} s={1.05} tank={it.tank} level={0.82} frame={f + i * 13} slosh={2 + (i === 1 ? 6 * (g2 > 0 && g2 < 1 ? 1 : 0) : 0) + (i === 2 ? 6 * (g3 > 0 && g3 < 1 ? 1 : 0) : 0)} />
              {it.k > 0 ? (
                <g transform={`translate(${it.x} ${topY - 40}) scale(${it.k}) translate(${-it.x} ${-(topY - 40)})`}>
                  <text x={it.x} y={topY - 80} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={i === 0 ? 54 : 72} fill={i === 0 ? S.dim : S.text}>{it.big}</text>
                  <text x={it.x} y={topY - 36} textAnchor="middle" fontFamily={ST_FONT} fontWeight={800} fontSize={30} letterSpacing={3} fill={S.dim}>{it.small}</text>
                </g>
              ) : null}
            </g>
          );
        })}
      </ShotStage>
    );
  },

  // Lev beside a long bar, ONE HOME DAY, filling with water to 82 GAL; a little sun crosses the day
  "1-04": ({ t, d, f }) => {
    const fill = ease(t, d * 0.06, d * 0.7);
    const sunU = lin(t, d * 0.06, d * 0.7);
    const sx = mix(BAR.x0 + 40, BAR.x1 - 40, sunU), sy = 330 - Math.sin(sunU * Math.PI) * 120;
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C1}>
        <Bloom x={sx} y={sy} r={240} color={S.light} strength={0.9} />
        <circle cx={sx} cy={sy} r={34} fill="#FFF3C4" stroke={INK} strokeWidth={3} opacity={0.95} />
        <Floor y={900} />
        <text x={BAR.x0} y={BAR.y - 34} fontFamily={ST_FONT} fontWeight={900} fontSize={40} letterSpacing={6} fill={S.dim} opacity={ease(t, 0, 12)}>ONE HOME DAY</text>
        <HomeBar fill={fill} frame={f} />
        <Label x={BAR.x1} y={BAR.y + BAR.h + 130} text="82 GAL" size={120} anchor="end" k={pop(t, d * 0.66, 14)} />
        <Lev x={1680} y={896} h={190} frame={f} facing={-1} pose="point" eyes={fill > 0.95 ? "happy" : "open"} tilt={-4 + 3 * Math.sin(t / 10)} outline={INK} />
      </ShotStage>
    );
  },

  // the indoor part of the bar is bracketed; the toilet segment (nearly 30 %) lights
  "1-05": ({ t, d, f }) => {
    const W = BAR.x1 - BAR.x0;
    const dim = ease(t, 0, d * 0.2);
    const br = ease(t, d * 0.05, d * 0.3);
    const seg = ease(t, d * 0.32, d * 0.48);
    const pulse = 0.5 + 0.5 * Math.sin(t / 5);
    const ix1 = BAR.x0 + W * INDOOR;
    const sx1 = BAR.x0 + W * INDOOR * TOILET_PART;
    const by = BAR.y - 40;
    const bracket = partial([[BAR.x0, by + 22], [BAR.x0, by], [ix1, by], [ix1, by + 22]], br);
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C1}>
        <Bloom x={420} y={240} r={700} color={S.light} strength={0.5} spread={0.5} />
        <Floor y={900} />
        <HomeBar fill={1} frame={f} dimOut={dim} />
        <path d={bracket.d} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x={(BAR.x0 + ix1) / 2} y={by - 22} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={38} letterSpacing={6} fill={S.dim} opacity={ease(t, d * 0.2, d * 0.3)}>INDOOR</text>
        {seg > 0 ? (
          <g>
            <Bloom x={(BAR.x0 + sx1) / 2} y={BAR.y + BAR.h / 2} r={260} color="#FFF6D6" strength={seg * (0.6 + 0.3 * pulse)} />
            <path d={`M ${BAR.x0 + BAR.h / 2} ${BAR.y} H ${sx1} V ${BAR.y + BAR.h} H ${BAR.x0 + BAR.h / 2} A ${BAR.h / 2} ${BAR.h / 2} 0 0 1 ${BAR.x0 + BAR.h / 2} ${BAR.y} Z`} fill={CREAM} opacity={seg * (0.3 + 0.15 * pulse)} />
            <path d={`M ${BAR.x0 + BAR.h / 2} ${BAR.y} H ${sx1} V ${BAR.y + BAR.h} H ${BAR.x0 + BAR.h / 2} A ${BAR.h / 2} ${BAR.h / 2} 0 0 1 ${BAR.x0 + BAR.h / 2} ${BAR.y} Z`} fill="none" stroke={TERRA} strokeWidth={7} opacity={seg} />
          </g>
        ) : null}
        <g transform={`translate(${(BAR.x0 + sx1) / 2} ${BAR.y + BAR.h + 120}) scale(${pop(t, d * 0.45, 14)})`}>
          <Toilet x={0} y={0} s={0.3} />
        </g>
        <Label x={sx1 + 50} y={BAR.y + BAR.h + 110} text="NEARLY 30 %" size={84} anchor="start" k={pop(t, d * 0.55, 14)} />
        <Lev x={1700} y={896} h={180} frame={f} facing={-1} pose={seg > 0.5 ? "point" : "stand"} eyes={seg > 0.5 ? "wide" : "open"} tilt={-5 + 3 * Math.sin(t / 10)} outline={INK} />
      </ShotStage>
    );
  },

  // push in on the bar's end: a thin lime slice pulses, one flush = about 2 % (OUR SUM)
  "1-06": ({ t, d, f }) => {
    const z = mix(1, 1.9, ease(t, d * 0.05, d * 0.5));
    const cx = BAR.x1, cy = BAR.y + BAR.h / 2;
    const W = BAR.x1 - BAR.x0;
    const sw = W * 0.02;
    const pulse = 0.5 + 0.5 * Math.sin(t / 4);
    const sk = ease(t, d * 0.2, d * 0.3);
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C1}>
        <Bloom x={420} y={240} r={700} color={S.light} strength={0.5} spread={0.5} />
        <g transform={`translate(${cx - 200 * ease(t, d * 0.05, d * 0.5)} ${cy + 40 * ease(t, d * 0.05, d * 0.5)}) scale(${z}) translate(${-cx} ${-cy})`}>
          <HomeBar fill={1} frame={f} />
          {sk > 0 ? (
            <g opacity={sk}>
              <Bloom x={BAR.x1 - sw / 2} y={cy} r={120} color={LIME} strength={0.5 + 0.4 * pulse} />
              <rect x={BAR.x1 - sw} y={BAR.y - 2} width={sw + 2} height={BAR.h + 4} fill={LIME} opacity={0.75 + 0.25 * pulse} clipPath="url(#st02homebar)" />
              <path d={`M ${BAR.x1 - sw} ${BAR.y - 8} V ${BAR.y + BAR.h + 8}`} stroke={INK} strokeWidth={3} />
              <text x={BAR.x1 - 20} y={BAR.y - 26} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={24} letterSpacing={2} fill={S.text}>ONE FLUSH</text>
            </g>
          ) : null}
        </g>
        <Label x={700} y={330} text="ABOUT 2 %" size={130} k={pop(t, d * 0.45, 14)} />
        <g transform={`translate(700 420) scale(${pop(t, d * 0.58, 12)}) translate(-700 -420)`}>
          <STPill x={700} y={420} text="OUR SUM" align="middle" size={28} />
        </g>
        <Floor y={960} />
        <Lev x={1500} y={956} h={150} frame={f} facing={-1} pose={sk > 0.5 ? "point" : "stand"} eyes="up" tilt={-14} outline={INK} />
      </ShotStage>
    );
  },

  // the country: thousands of tiny old toilets swap to new ones in a wave; saved drops rise; 260 BILLION GAL/YR
  "1-07": ({ t, d, f }) => {
    const ox = 385, oy = 100, sc = 1.15;
    const head = pop(t, d * 0.55, 16);
    const dropK = ease(t, d * 0.62, d * 0.95);
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C1}>
        <Bloom x={960} y={420} r={900} color={S.light} strength={0.45} spread={0.5} />
        <g transform={`translate(${ox} ${oy}) scale(${sc})`}>
          <path d={US_D} fill={S.near} opacity={0.35} transform="translate(8 12)" />
          <path d={US_D} fill={S.mid} stroke={S.near} strokeWidth={4} strokeLinejoin="round" />
          {US_SITES.map((p, i) => {
            const at = d * 0.05 + (p[0] / 1000) * d * 0.5 + rnd(i * 3) * d * 0.05;
            const k = ease(t, at, at + 8);
            const sq = t > at && t < at + 12 ? Math.sin(((t - at) / 12) * Math.PI) * 0.35 : 0;
            const age = t - at;
            return (
              <g key={i}>
                <TinyToilet x={p[0]} y={p[1]} s={0.85 + sq} old={1 - k} />
                {age > 4 && age < 40 ? <circle cx={p[0] + 2} cy={p[1] - 20 - (age - 4) * 1.4} r={3} fill={WATER_DK} opacity={0.7 * (1 - (age - 4) / 36)} /> : null}
              </g>
            );
          })}
        </g>
        <Label x={880} y={975} text="260 BILLION GAL/YR" size={96} k={head} />
        {dropK > 0 ? (
          <g transform={`translate(1500 930) scale(${0.3 + 0.7 * dropK})`}>
            <path d="M 0 -80 C 30 -40 52 -10 52 20 A 52 52 0 0 1 -52 20 C -52 -10 -30 -40 0 -80 Z" fill={WATER} stroke={INK} strokeWidth={4} />
            <path d="M -24 4 Q -26 30 -6 44" stroke={AIR} strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.7} />
          </g>
        ) : null}
      </ShotStage>
    );
  },

  // a year calendar flips fast; with every page the tank empties and refills, and a blue line runs into the wall
  "1-08": ({ t, d, f }) => {
    const base = 880;
    const period = Math.max(8, d / 13);
    const ph = (t % period) / period;
    const level = 0.3 + 0.55 * (0.5 + 0.5 * Math.cos(ph * Math.PI * 2));
    const tx = 1000, s = 1.3;
    const start: Pt = [tx + 92 * s, base - 200 * s];
    const line: Pt[] = [start, [1250, start[1]], [1250, 760], [1420, 760], [1420, 1120]];
    const draw = ease(t, d * 0.08, d * 0.5);
    const p = partial(line, draw);
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C1}>
        <Bloom x={420} y={240} r={700} color={S.light} strength={0.5} spread={0.5} />
        <Floor y={base} />
        {/* the cutaway wall */}
        <rect x={1380} y={-60} width={110} height={1200} fill={S.near} opacity={0.55} />
        <path d="M 1380 -60 V 1140" stroke={INK} strokeWidth={4} opacity={0.4} />
        <FlipCalendar x={250} y={280} w={340} h={380} t={t} period={period} />
        <Toilet x={tx} y={base} s={s} facing={-1} level={level} frame={f} slosh={2.5} handle={ph < 0.15 ? 1 : 0} />
        {draw > 0 ? (
          <g>
            <path d={p.d} stroke={WATER_DK} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {draw >= 1 ? <path d={p.d} stroke={AIR} strokeWidth={4} fill="none" strokeDasharray="14 22" strokeDashoffset={-t * 5} strokeLinecap="round" /> : null}
            {draw < 1 ? <circle cx={p.head[0]} cy={p.head[1]} r={14} fill={WATER_DK} /> : null}
          </g>
        ) : null}
      </ShotStage>
    );
  },

  // the wall pipe joins a thick riser labelled SHARED; other floors' pipes join it; flow dashes everywhere
  "1-09": ({ t, d, f }) => {
    const RX = 1150;
    const flow = t * 4;
    const own = { x: 380, base: 690, s: 0.62, side: -1 as const };
    const others = [
      { x: 560, base: 330, s: 0.5, side: -1 as const, at: d * 0.22 },
      { x: 1560, base: 430, s: 0.5, side: 1 as const, at: d * 0.32 },
      { x: 1600, base: 810, s: 0.5, side: 1 as const, at: d * 0.42 },
      { x: 600, base: 980, s: 0.5, side: -1 as const, at: d * 0.52 },
    ];
    const pipeY = (b: { base: number; s: number }) => b.base - 190 * b.s;
    const tankEdge = (b: { x: number; s: number; side: 1 | -1 }) => b.x - b.side * 92 * b.s;
    const shared = pop(t, d * 0.6, 16);
    const ownPts: Pt[] = [[RX, pipeY(own)], [tankEdge(own), pipeY(own)]];
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C1}>
        <Bloom x={RX} y={400} r={800} color={S.light} strength={0.4} spread={0.5} />
        {/* floors */}
        {[{ ...own, at: -1 }, ...others].map((b, i) => (
          <rect key={i} x={b.x - 140} y={b.base} width={280} height={14} rx={6} fill={S.near} opacity={0.5 * ease(t, b.at, b.at + 18)} />
        ))}
        {/* the riser */}
        <Pipe d={`M ${RX} 1120 L ${RX} -40`} w={64} flow={flow * 1.5} />
        {/* the other floors */}
        {others.map((b, i) => {
          const k = ease(t, b.at, b.at + 18);
          if (k <= 0) return null;
          const pts: Pt[] = [[RX, pipeY(b)], [tankEdge(b), pipeY(b)]];
          const pr = partial(pts, k);
          return (
            <g key={i} opacity={0.9}>
              <Pipe d={pr.d} w={14} flow={flow} />
              <g opacity={k}><Toilet x={b.x} y={b.base} s={b.s} facing={(-b.side) as 1 | -1} outline={INK} /></g>
            </g>
          );
        })}
        {/* our pipe and our toilet ("you are here") */}
        <Pipe d={partial(ownPts, 1).d} w={18} flow={flow} />
        <Toilet x={own.x} y={own.base} s={own.s} facing={1} outline={INK} />
        <circle cx={own.x} cy={own.base - 130} r={120 + 6 * Math.sin(t / 5)} fill="none" stroke={LIME} strokeWidth={5} opacity={0.75} />
        {shared > 0 ? (
          <g transform={`translate(${RX} 560) scale(${shared}) translate(${-RX} -560)`}>
            <rect x={RX - 150} y={520} width={300} height={84} rx={20} fill={INK} opacity={0.88} />
            <rect x={RX - 150} y={520} width={300} height={84} rx={20} fill="none" stroke={CHALK} strokeWidth={3} opacity={0.8} />
            <text x={RX} y={580} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={52} letterSpacing={5} fill={CHALK}>SHARED</text>
          </g>
        ) : null}
        <Lev x={1760} y={1000} h={150} frame={f} facing={-1} pose={shared > 0.5 ? "point" : "stand"} eyes="up" tilt={-10 + 3 * Math.sin(t / 9)} outline={INK} />
      </ShotStage>
    );
  },

  // chapter beat: rung ONE BUILDING lights; the Counter moves to 1 BUILDING
  "1-10": ({ t, d, f }) => <ChapterBeat t={t} d={d} f={f} fam="sage" prev={0} next={1} eyebrow="NEXT RUNG" title="One building" before={C1} after={FLUSHES("1 BUILDING")} />,
};
