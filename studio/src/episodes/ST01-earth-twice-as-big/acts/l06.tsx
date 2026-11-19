// ST01 act "l06" (6 · What it really means): shot bodies keyed by storyboard id (see ../shotlist.ts and the storyboard).
// Numbers on screen come only from storyboard-prep §2: 8 masses -> 1.75 widths (OUR SUM), 2.6 g (OUR SUM), the
// 1.5-2.0 gap (sketched wall), UNDER 10 EARTHS. Chart ticks: 1, 2, 4, 8 masses; 1, 1.5, 2 widths.
import React from "react";
import { ease, lin, mix, pop, ShotMap, ShotStage } from "../shot";
import { Bloom, HazeBand, LightWash } from "../../../lib/illustrated/light";
import { Motes } from "../../../lib/illustrated/ambient";
import { rnd } from "../../../lib/illustrated/motion";
import { blobPts, roundPoly, smoothPath } from "../../../lib/illustrated/shapes";
import { AIR, BRASS, CHALK, INK, LIME, OCEAN, ST_FONT, SUPPOSE, TERRA } from "../../../lib/suppose/palette";
import { Lev } from "../../../lib/suppose/lev";
import { STPill } from "../../../lib/suppose/devices";
import { Earth } from "../../../lib/suppose/frames";
import {
  ChartDot, ClayBall, cx, cy, Exhaust, GAP_CX, GAP_X0, GAP_X1, Grid, MassChart, Pillow, PuffPlanet, Push, Rocket, rocky,
  WALL, WALL_AXIS, WallFrame, wx,
} from "./l06-parts";

type Pt = [number, number];
const CF = SUPPOSE.chalk;
const T = (x: number, y: number, s: string, size: number, fill: string, anchor: "start" | "middle" | "end" = "middle", weight = 900, extra: React.SVGProps<SVGTextElement> = {}) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={ST_FONT} fontWeight={weight} fontSize={size} fill={fill} {...extra}>{s}</text>
);
const dir = (a: number): Pt => [Math.cos((a * Math.PI) / 180), Math.sin((a * Math.PI) / 180)];
const wedge = (x: number, y: number, r: number, a0: number, a1: number) => {
  const [x0, y0] = dir(a0), [x1, y1] = dir(a1);
  return `M ${x} ${y} L ${x + x0 * r} ${y + y0 * r} A ${r} ${r} 0 0 1 ${x + x1 * r} ${y + y1 * r} Z`;
};
/** chevron with its point at (x, y), pointing along `ang` */
const chevron = (x: number, y: number, ang: number, s: number) => {
  const [ux, uy] = dir(ang), [px, py] = [-uy, ux];
  return `M ${x - ux * s + px * s} ${y - uy * s + py * s} L ${x} ${y} L ${x - ux * s - px * s} ${y - uy * s - py * s}`;
};
/** inward-moving chevrons around a circle (looping), the "squeeze" signal */
const Squeeze: React.FC<{ x: number; y: number; r: number; t: number; n?: number; color?: string; on?: number; s?: number }> = ({ x, y, r, t, n = 10, color = INK, on = 1, s = 18 }) => (
  <g opacity={on}>
    {Array.from({ length: n }, (_, i) => {
      const a = (i / n) * 360 + 18;
      const ph = ((t * 1.8 + i * 9) % 60) / 60;
      const rr = r + 80 - ph * 60;
      const [ux, uy] = dir(a);
      return <path key={i} d={chevron(x + ux * rr, y + uy * rr, a + 180, s)} stroke={color} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={Math.sin(ph * Math.PI) * 0.8} />;
    })}
  </g>
);

export const SHOTS_L06: ShotMap = {
  // ---------------------------------------------------------------- 6-01 · clay balls, one squashed smaller
  "6-01": ({ t, d, f }) => {
    const floor = 820;
    const ax = 700, bx = 1140, r0 = 92;
    const press = ease(t, 18, 40);
    const r = r0 - 22 * ease(t, 24, 170);
    const pump = 0.5 + 0.5 * Math.sin((t - 18) / 7);
    const sy = 1 - press * (0.06 + 0.1 * pump);
    const sx = 1 / Math.sqrt(sy);
    const top = floor - 2 * r * sy;
    const levH = 240, s = levH / 170, levX = bx + 118;
    const hand: Pt = [(bx + 18 - levX) / -s, (top + 6 - floor) / s];
    const restHand: Pt = [24, -58];
    const h: Pt = [mix(restHand[0], hand[0], press), mix(restHand[1], hand[1], press)];
    return (
      <ShotStage fam="chalk" t={t} f={f}>
        <Push t={t} d={d} amt={0.04} cy={640}>
          <Bloom x={760} y={300} r={700} color={CF.light} strength={0.7} spread={0.5} />
          <path d={`M -40 ${floor} Q 960 ${floor - 24} 1960 ${floor} L 1960 1100 L -40 1100 Z`} fill={CF.far} />
          <path d={`M -40 ${floor} Q 960 ${floor - 24} 1960 ${floor}`} stroke={CF.light} strokeWidth={6} fill="none" opacity={0.8} />
          <ClayBall x={ax} bottom={floor} r={r0} />
          <ellipse cx={bx} cy={floor - r0} rx={r0} ry={r0} fill="none" stroke={INK} strokeWidth={4} strokeDasharray="14 12" opacity={0.45 * press} />
          <ClayBall x={bx} bottom={floor} r={r} sx={sx} sy={sy} />
          <Lev x={levX} y={floor + 2} h={levH} frame={f} facing={-1} pose="stand" hands={{ front: h, back: [h[0] - 12, h[1] + 8] }} eyes={press > 0.5 ? "squint" : "open"} tilt={press * 8} wind={0.3} outline={INK} />
        </Push>
      </ShotStage>
    );
  },

  // ---------------------------------------------------------------- 6-02 · cutaway planet, layers compressing
  "6-02": ({ t, d, f }) => {
    const x = 900, y = 560;
    const k = ease(t, 10, 150);
    const R = 360 - 40 * k;
    const layers: [number, string][] = [
      [1, "#9B5139"],
      [0.95, TERRA],
      [0.56 - 0.1 * k, BRASS],
      [0.23 - 0.06 * k, "#F6E7B8"],
    ];
    return (
      <ShotStage fam="chalk" t={t} f={f}>
        <Push t={t} d={d} amt={0.035} cx={x} cy={y}>
          <Bloom x={x - 120} y={y - 140} r={760} color={CF.light} strength={0.6} spread={0.5} />
          <ellipse cx={x} cy={y + R + 40} rx={R * 0.9} ry={30} fill="#000" opacity={0.12} />
          <Earth cx={x} cy={y} r={R} seed={4} />
          {layers.map(([fr, c], i) => <path key={i} d={wedge(x, y, R * fr, -90, 0)} fill={c} />)}
          <Bloom x={x} y={y} r={R * 0.4} color={BRASS} strength={0.4 + 0.3 * k} />
          <path d={`M ${x} ${y - R} V ${y} H ${x + R}`} stroke={INK} strokeWidth={5} fill="none" opacity={0.45} strokeLinejoin="round" />
          {layers.slice(1).map(([fr], i) => (
            <path key={i} d={`M ${x} ${y - R * fr} A ${R * fr} ${R * fr} 0 0 1 ${x + R * fr} ${y}`} stroke={INK} strokeWidth={2.5} fill="none" opacity={0.3} />
          ))}
          {/* packed grains in the mantle: they crowd inward as it squeezes */}
          {Array.from({ length: 40 }, (_, i) => {
            const a = -84 + rnd(i * 3) * 78;
            const fr = mix(0.62, 0.92, rnd(i * 7 + 1)) - 0.04 * k;
            const rr = R * fr * (1 - 0.06 * k * rnd(i));
            const [ux, uy] = dir(a);
            return <circle key={i} cx={x + ux * rr} cy={y + uy * rr} r={4.5} fill="#9B5139" opacity={0.5} />;
          })}
          <Squeeze x={x} y={y} r={R} t={t} n={12} on={ease(t, 6, 24)} />
        </Push>
      </ShotStage>
    );
  },

  // ---------------------------------------------------------------- 6-03 · stack of pillows
  "6-03": ({ t, d, f }) => {
    const floor = 900, px = 860;
    const fills = ["#F6E7B8", "#E7A989", CHALK, "#D9E8C8", "#F2C9A8"];
    const starts = [4, 38, 72, 106, 140];
    const FALL = 26;
    const h0 = 118, w0 = 460;
    const landed = starts.map((s) => ease(t, s + FALL, s + FALL + 8));
    let base = floor;
    const out: React.ReactNode[] = [];
    starts.forEach((s, i) => {
      if (t < s) return;
      const load = landed.slice(i + 1).reduce((a, b) => a + b, 0);
      const own = t - (s + FALL);
      const bounce = own > 0 && own < 12 ? Math.sin((own / 12) * Math.PI) * 0.16 : 0;
      const hs = Math.max(0.42, 1 - 0.14 * load) * (1 - bounce);
      const h = h0 * hs;
      const w = w0 * (1 + (1 - hs) * 0.35);
      let bottom = base;
      if (t < s + FALL) {
        const p = (t - s) / FALL;
        bottom = mix(-40, base, p * p);
      }
      out.push(<Pillow key={i} x={px + (rnd(i) - 0.5) * 30} bottom={bottom} w={w} h={h} fill={fills[i]} seam={TERRA} />);
      if (t >= s + FALL) base -= h;
    });
    return (
      <ShotStage fam="chalk" t={t} f={f}>
        <Push t={t} d={d} amt={0.03} cy={700}>
          <Bloom x={860} y={420} r={720} color={CF.light} strength={0.6} spread={0.5} />
          <rect x={-40} y={floor} width={2000} height={200} fill={CF.far} />
          <path d={`M -40 ${floor} H 1960`} stroke={CF.light} strokeWidth={6} opacity={0.8} />
          <ellipse cx={px} cy={floor + 6} rx={300} ry={18} fill="#000" opacity={0.14} />
          {out}
          <Lev x={1340} y={floor + 2} h={170} frame={f} facing={-1} pose="shrug" eyes={t > 100 ? "wide" : "up"} tilt={-10} wind={0.3} outline={INK} />
        </Push>
      </ShotStage>
    );
  },

  // ---------------------------------------------------------------- 6-04 · make-believe 2x vs real (smaller)
  "6-04": ({ t, d, f }) => {
    const R = 270;
    const k = ease(t, 20, 150);
    const r = R * (1 - 0.125 * k);
    const lx = 520, rx = 1400, y = 470;
    return (
      <ShotStage fam="chalk" t={t} f={f}>
        <Push t={t} d={d} amt={0.03}>
          <Bloom x={960} y={300} r={900} color={CF.light} strength={0.5} spread={0.5} />
          <g opacity={0.72}>
            <Earth cx={lx} cy={y} r={R} seed={2} />
          </g>
          <circle cx={lx} cy={y} r={R + 6} fill="none" stroke={INK} strokeWidth={4} strokeDasharray="16 12" opacity={0.6} />
          <circle cx={rx} cy={y} r={R} fill="none" stroke={INK} strokeWidth={4} strokeDasharray="16 12" opacity={0.5 * k} />
          <Earth cx={rx} cy={y} r={r} seed={6} />
          <circle cx={rx} cy={y} r={r} fill="#3A2A1E" opacity={0.18 * k} />
          <Squeeze x={rx} y={y} r={r} t={t} n={10} on={ease(t, 10, 30) * (1 - ease(t, 160, 180) * 0.6)} />
          {T(lx, 830, "MAKE-BELIEVE", 40, CF.dim)}
          {T(rx, 830, "REAL ROCK", 40, INK)}
          <Lev x={960} y={900} h={130} frame={f} pose="point" hands={{ front: [62, -118] }} eyes="open" tilt={6} wind={0.3} outline={INK} />
        </Push>
      </ShotStage>
    );
  },

  // ---------------------------------------------------------------- 6-05 · the chart: the rocky curve draws
  "6-05": ({ t, f }) => {
    const draw = ease(t, 26, 175);
    return (
      <ShotStage fam="chalk" t={t} f={f}>
        <Grid color={CF.far} />
        {T(300, 130, "How wide does rock get for its mass?", 46, INK, "start")}
        <MassChart f={f} draw={draw} />
        <Lev x={1730} y={900} h={180} frame={f} facing={-1} pose="point" hands={{ front: [62, -126] }} eyes="open" tilt={-4} wind={0.2} outline={INK} />
      </ShotStage>
    );
  },

  // ---------------------------------------------------------------- 6-06 · the lime dot lands at 1.75, not 2
  "6-06": ({ t, f }) => {
    const m = mix(1, 8, ease(t, 14, 96));
    const land = pop(t, 98, 14);
    const x8 = cx(8);
    return (
      <ShotStage fam="chalk" t={t} f={f}>
        <Grid color={CF.far} />
        {T(300, 130, "How wide does rock get for its mass?", 46, INK, "start")}
        <MassChart f={f} draw={1} mbOn={ease(t, 0, 20)} labels={1} />
        <circle cx={x8} cy={cy(2)} r={15} fill={CHALK} stroke={CF.dim} strokeWidth={4} opacity={ease(t, 90, 110)} />
        <ChartDot m={m} r={rocky(m)} f={f} guides={ease(t, 96, 112)} />
        <g opacity={Math.min(1, land)} transform={`translate(${x8 + 40} ${cy(1.75) + 18}) scale(${Math.max(0.01, land)})`}>
          {T(0, 20, "1.75", 92, INK, "start")}
          {T(4, 62, "EARTH WIDTHS", 24, CF.dim, "start", 800, { letterSpacing: 2 })}
          <STPill x={4} y={102} text="OUR SUM" dark={false} />
        </g>
        <Lev x={1730} y={900} h={180} frame={f} facing={-1} pose={t > 100 ? "shrug" : "point"} hands={t > 100 ? undefined : { front: [62, -126] }} eyes={t > 100 ? "wide" : "open"} tilt={-4} wind={0.2} outline={INK} />
      </ShotStage>
    );
  },

  // ---------------------------------------------------------------- 6-07 · gravity readout rolls to 2.6 g
  "6-07": ({ t, d, f }) => {
    const roll = ease(t, 22, 110);
    const v = 6 * roll; // tenths digit 0 -> 6, rolling up from the make-believe 2.0 g
    const px = 470, py = 580, pr = 230;
    const panelX = 900, panelY = 250, panelW = 820, panelH = 520;
    const dig = 230, lh = 250;
    const digitX = panelX + 470;
    const digitY = panelY + 340;
    const pull = 0.5 + 0.5 * Math.sin(t / 6);
    return (
      <ShotStage fam="chalk" t={t} f={f}>
        <Push t={t} d={d} amt={0.03}>
          <Bloom x={px} y={py - 80} r={560} color={CF.light} strength={0.6} />
          <Earth cx={px} cy={py} r={pr} seed={6} />
          <circle cx={px} cy={py} r={pr} fill="#3A2A1E" opacity={0.16} />
          <Squeeze x={px} y={py} r={pr} t={t * (1 + roll)} n={10} s={16 + 8 * roll} on={0.5 + 0.5 * roll} />
          <Lev x={px + 10} y={py - pr + 4} h={118} frame={f} pose="stand" eyes={roll > 0.6 ? "squint" : "open"} tilt={-6 - 6 * pull * roll} wind={0.2} outline={INK} />
          {/* readout */}
          <rect x={panelX} y={panelY} width={panelW} height={panelH} rx={40} fill={INK} opacity={0.82} />
          <rect x={panelX} y={panelY} width={panelW} height={panelH} rx={40} fill="none" stroke={LIME} strokeOpacity={0.4} strokeWidth={3} />
          {T(panelX + 60, panelY + 80, "GRAVITY ON A REAL ROCKY ONE", 30, CHALK, "start", 800, { letterSpacing: 3, opacity: 0.85 })}
          <defs>
            <clipPath id="l06-odo">
              <rect x={digitX - 10} y={digitY - dig * 0.86} width={dig * 0.66} height={dig * 1.0} />
            </clipPath>
          </defs>
          {T(digitX - 6, digitY, "2.", dig, LIME, "end")}
          <g clipPath="url(#l06-odo)">
            <g transform={`translate(0 ${v * lh})`}>
              {Array.from({ length: 8 }, (_, i) => (
                <text key={i} x={digitX} y={digitY - i * lh} fontFamily={ST_FONT} fontWeight={900} fontSize={dig} fill={LIME}>{i}</text>
              ))}
            </g>
          </g>
          {T(digitX + dig * 0.66 + 10, digitY, "g", dig * 0.62, LIME, "start")}
          <STPill x={panelX + 60} y={panelY + panelH - 62} text="OUR SUM" />
          {T(panelX + panelW - 50, panelY + panelH - 52, "MAKE-BELIEVE: 2.0 g", 28, CHALK, "end", 800, { opacity: 0.6 })}
          <Bloom x={digitX} y={digitY - 90} r={200} color={LIME} strength={0.15 + 0.2 * pull * roll} />
        </Push>
      </ShotStage>
    );
  },

  // ---------------------------------------------------------------- 6-08 · past 8: beyond the fit
  "6-08": ({ t, f }) => {
    const beyond = ease(t, 10, 50);
    const m = mix(8, 11.4, ease(t, 40, 150));
    return (
      <ShotStage fam="chalk" t={t} f={f}>
        <Grid color={CF.far} />
        {T(300, 130, "Truly twice as wide?", 46, INK, "start")}
        <MassChart f={f} draw={1} mbOn={0.8} beyond={beyond} ext={ease(t, 36, 150)} labels={0.6} />
        <path d={`M ${cx(8)} ${cy(2)} H ${cx(12)}`} stroke={INK} strokeWidth={4} strokeDasharray="4 12" strokeLinecap="round" opacity={0.6 * beyond} />
        <ChartDot m={m} r={rocky(m)} f={f} guides={0} />
        <Lev x={1730} y={900} h={180} frame={f} facing={-1} pose="shrug" eyes="up" tilt={-8} wind={0.2} outline={INK} />
      </ShotStage>
    );
  },

  // ---------------------------------------------------------------- 6-09 · thousands of planets blink on
  "6-09": ({ t, d, f }) => {
    const OF = SUPPOSE.olive;
    const N = 2000;
    const cols = [TERRA, OCEAN, AIR, OF.light, BRASS];
    const dots: React.ReactNode[] = [];
    for (let i = 0; i < N; i++) {
      const u = rnd(i * 3 + 1);
      const at = 6 + 140 * Math.sqrt(u);
      if (t < at) continue;
      const a = rnd(i * 5 + 2) * Math.PI * 2;
      const rr = Math.sqrt(rnd(i * 7 + 3));
      const x = 960 + Math.cos(a) * rr * 820;
      const y = 430 + Math.sin(a) * rr * 330;
      const age = t - at;
      const p = pop(t, at, 8);
      const r = (1.6 + rnd(i * 11) * 2.4) * p;
      dots.push(
        <g key={i}>
          {age < 10 ? <circle cx={x} cy={y} r={3 + age * 1.6} fill="none" stroke={OF.light} strokeWidth={1.4} opacity={(1 - age / 10) * 0.7} /> : null}
          <circle cx={x} cy={y} r={r} fill={cols[i % 5]} opacity={0.6 + 0.4 * Math.sin(f / 9 + i)} />
        </g>,
      );
    }
    return (
      <ShotStage fam="olive" t={t} f={f}>
        <Push t={t} d={d} amt={0.05} cy={430}>
          <Bloom x={960} y={430} r={900} color={OF.bounce} strength={0.25} spread={0.5} squash={0.5} />
          {dots}
        </Push>
        <path d={smoothPath([[-40, 960], [400, 900], [900, 940], [1300, 880], [1960, 930]]) + " L 1960 1100 L -40 1100 Z"} fill={OF.near} />
        <path d={smoothPath([[-40, 960], [400, 900], [900, 940], [1300, 880], [1960, 930]])} stroke={OF.bounce} strokeWidth={4} fill="none" opacity={0.5} />
        <Lev x={1380} y={886} h={120} frame={f} pose="sit" eyes="up" tilt={-14} wind={0.4} shade="#AFB79A" />
      </ShotStage>
    );
  },

  // ---------------------------------------------------------------- 6-10 · the dots rain into sorted columns
  "6-10": ({ t, f }) => (
    <ShotStage fam="chalk" t={t} f={f} drift={0.4}>
      <WallFrame title={ease(t, 0, 16)} />
      {WALL.map((p) => {
        const land = 8 + p.j * 3.1 + rnd(p.k * 7) * 26;
        const start = land - 22;
        if (t < start) return null;
        const q = Math.min(1, (t - start) / 22);
        const y = mix(200, p.y, Math.pow(q, 1.4));
        return <circle key={p.k} cx={p.x} cy={y} r={6.4} fill={p.fill} opacity={0.92 * Math.min(1, q * 5)} />;
      })}
    </ShotStage>
  ),

  // ---------------------------------------------------------------- 6-11 · the humps and the gap
  "6-11": ({ t, f }) => {
    const sweepL = lin(t, 14, 90), sweepR = lin(t, 90, 160);
    const gap = ease(t, 160, 190);
    const br = ease(t, 168, 205);
    const bw = GAP_X1 - GAP_X0;
    const hl = (p: { w: number }) => (p.w < 1.5 ? ease(t, 14, 40) * (1 - ease(t, 150, 175) * 0.5) : p.w > 1.95 ? ease(t, 90, 115) * (1 - ease(t, 150, 175) * 0.5) : 0);
    return (
      <ShotStage fam="chalk" t={t} f={f} drift={0.4}>
        <WallFrame />
        {sweepL > 0 && sweepL < 1 ? <LightWash x={mix(wx(0.6), wx(1.55), sweepL)} y={640} rx={170} ry={300} color={CF.light} strength={0.9} /> : null}
        {sweepR > 0 && sweepR < 1 ? <LightWash x={mix(wx(1.95), wx(3.4), sweepR)} y={680} rx={200} ry={300} color={CF.light} strength={0.9} /> : null}
        <rect x={GAP_X0} y={330 + (WALL_AXIS - 340) * (1 - gap)} width={bw} height={(WALL_AXIS - 340) * gap} fill={LIME} opacity={0.12 + 0.05 * Math.sin(f / 10) * gap} />
        {gap > 0.99 ? (
          <path d={`M ${GAP_X0} 330 V ${WALL_AXIS - 10} M ${GAP_X1} 330 V ${WALL_AXIS - 10}`} stroke={LIME} strokeWidth={3} strokeDasharray="10 12" strokeDashoffset={-t * 2} opacity={0.9} />
        ) : null}
        {WALL.map((p) => {
          const k = hl(p);
          return <circle key={p.k} cx={p.x} cy={p.y - k * 3 * Math.sin(f / 6 + p.j * 0.6)} r={6.4 + k * 1.2} fill={p.fill} opacity={0.92} />;
        })}
        <g opacity={Math.min(1, pop(t, 30))}>{T(290, 560, "MOSTLY ROCK", 28, TERRA)}</g>
        <g opacity={Math.min(1, pop(t, 104))}>
          {T(1060, 440, "MOSTLY WRAPPED IN GAS", 28, OCEAN, "start")}
          <STPill x={1060} y={488} text="ROUGHLY" dark={false} />
        </g>
        {br > 0 ? (
          <path d={`M ${GAP_X0} 560 v -16 H ${GAP_X0 + bw * br} ${br > 0.98 ? "v 16" : ""}`} stroke={LIME} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        ) : null}
        <g opacity={Math.min(1, pop(t, 196))}>{T(GAP_CX, 528, "THE GAP", 30, INK)}</g>
        <Lev x={1690} y={WALL_AXIS} h={190} frame={f} facing={-1} pose="point" hands={{ front: [70, t > 160 ? -150 : -120] }} eyes={t > 190 ? "wide" : "open"} tilt={10} wind={0.2} outline={INK} />
      </ShotStage>
    );
  },

  // ---------------------------------------------------------------- 6-12 · a gap planet swells: rock core, gas blanket
  "6-12": ({ t, f }) => {
    const rise = ease(t, 10, 70);
    const x = mix(GAP_CX, 960, rise), y = mix(WALL_AXIS - 16 - 15.5 * 3, 470, rise);
    const core = mix(6.4, 92, ease(t, 14, 80));
    const gas = core + 170 * ease(t, 70, 190);
    const fade = 1 - 0.8 * ease(t, 10, 60);
    return (
      <ShotStage fam="chalk" t={t} f={f} drift={0.4}>
        <g opacity={fade}>
          <WallFrame title={1 - ease(t, 0, 30)} />
          {WALL.map((p) => <circle key={p.k} cx={p.x} cy={p.y} r={6.4} fill={p.fill} opacity={0.92} />)}
          <rect x={GAP_X0} y={330} width={GAP_X1 - GAP_X0} height={WALL_AXIS - 340} fill={LIME} opacity={0.12} />
        </g>
        <path d={`M ${GAP_CX} ${WALL_AXIS - 30} Q ${mix(GAP_CX, 960, 0.4)} ${mix(WALL_AXIS, 470, 0.7)} ${x} ${y}`} stroke={INK} strokeWidth={2.5} strokeDasharray="6 8" fill="none" opacity={0.5 * rise} />
        <PuffPlanet x={x} y={y} core={core} gas={gas} f={f} />
      </ShotStage>
    );
  },

  // ---------------------------------------------------------------- 6-13 · on the scale: too light for solid rock
  "6-13": ({ t, d, f }) => {
    const drop = ease(t, 0, 22);
    const px = 760, platY = 790, R = 200;
    const py = mix(250, platY - R - 4, drop * drop);
    const sq = t > 22 && t < 34 ? Math.sin(((t - 22) / 12) * Math.PI) * 0.06 : 0;
    const target = 214;
    const tt = Math.max(0, t - 22);
    const ang = t < 22 ? 270 : target + 95 * Math.exp(-tt / 42) * Math.cos(tt / 6.5) + Math.sin(t / 5) * 2.5;
    const dX = 760, dY = 935, dR = 100;
    const [nx, ny] = dir(ang);
    const arc = (a0: number, a1: number, rr: number) => {
      const [x0, y0] = dir(a0), [x1, y1] = dir(a1);
      return `M ${dX + x0 * rr} ${dY + y0 * rr} A ${rr} ${rr} 0 0 1 ${dX + x1 * rr} ${dY + y1 * rr}`;
    };
    const lab = (y: number, x2: number, y2: number, s: string, at: number) => (
      <g opacity={ease(t, at, at + 14)}>
        <path d={`M 1030 ${y - 10} L ${x2} ${y2}`} stroke={INK} strokeWidth={3} opacity={0.7} />
        <circle cx={x2} cy={y2} r={6} fill={INK} />
        {T(1046, y, s, 36, INK, "start")}
      </g>
    );
    return (
      <ShotStage fam="chalk" t={t} f={f}>
        <Push t={t} d={d} amt={0.03} cy={600}>
          <Bloom x={760} y={400} r={700} color={CF.light} strength={0.6} />
          <rect x={-40} y={1040} width={2000} height={60} fill={CF.far} />
          {/* scale */}
          <path d={roundPoly([[470, 800], [1050, 800], [1070, 1080], [450, 1080]], 30)} fill={CHALK} stroke={INK} strokeWidth={4} />
          <rect x={500} y={platY - 4 + sq * 30} width={520} height={26} rx={13} fill={INK} opacity={0.85} />
          <circle cx={dX} cy={dY} r={dR} fill="#FFFFF4" stroke={INK} strokeWidth={5} />
          <path d={arc(200, 245, 82)} stroke={AIR} strokeWidth={14} fill="none" />
          <path d={arc(295, 340, 82)} stroke={TERRA} strokeWidth={14} fill="none" />
          {Array.from({ length: 15 }, (_, i) => {
            const [ux, uy] = dir(200 + i * 10);
            return <path key={i} d={`M ${dX + ux * 66} ${dY + uy * 66} L ${dX + ux * 74} ${dY + uy * 74}`} stroke={INK} strokeWidth={3} />;
          })}
          <path d={`M ${dX} ${dY} L ${dX + nx * 80} ${dY + ny * 80}`} stroke={TERRA} strokeWidth={7} strokeLinecap="round" />
          <circle cx={dX} cy={dY} r={12} fill={INK} />
          {T(648, 918, "LIGHT", 28, OCEAN, "end")}
          {T(872, 905, "SOLID", 26, TERRA, "start")}
          {T(872, 935, "ROCK", 26, TERRA, "start")}
          {/* the planet */}
          <g transform={`translate(${px} ${platY}) scale(${1 + sq} ${1 - sq}) translate(${-px} ${-platY})`}>
            <PuffPlanet x={px} y={py} core={96} water={134} gas={R} f={f} />
          </g>
          {lab(420, px + 160, py - 120, "GAS", 40)}
          {lab(566, px + 124, py - 20, "MAYBE WATER", 60)}
          {lab(700, px + 50, py + 50, "ROCK", 80)}
          <Lev x={1640} y={1040} h={200} frame={f} facing={-1} pose="shrug" eyes={t > 60 ? "wide" : "open"} tilt={-8} wind={0.2} outline={INK} />
        </Push>
      </ShotStage>
    );
  },

  // ---------------------------------------------------------------- 6-14 · the rocky 2x Earth becomes the hazy world
  "6-14": ({ t, f }) => {
    const OF = SUPPOSE.olive;
    const m = ease(t, 24, 150);
    const sw = ease(t, 160, 196);
    const x = 960, y = 500, R0 = 330;
    const core = R0 * (1 - 0.36 * m);
    const hazeR = mix(R0 * 0.98, R0 * 1.12, m);
    const wob = (r: number, seed: number) => roundPoly(blobPts(x, y, r, 16, seed, 0.02).map(([px, py], i): Pt => {
      const a = (i / 16) * Math.PI * 2;
      const k = Math.sin(f / 12 + i * 1.1 + seed) * r * 0.015;
      return [px + Math.cos(a) * k, py + Math.sin(a) * k];
    }), r * 0.4);
    const bands = [
      { y: 150, h: 900, c: OF.light, o: 0.07, v: 1.6 },
      { y: 300, h: 750, c: AIR, o: 0.08, v: 2.2 },
      { y: 440, h: 620, c: OF.light, o: 0.09, v: 2.8 },
      { y: 590, h: 470, c: "#C9C49A", o: 0.11, v: 3.4 },
      { y: 730, h: 330, c: OF.light, o: 0.13, v: 4.0 },
    ];
    const t2 = Math.max(0, t - 160);
    const push = 1 + 0.06 * lin(t, 170, 320);
    return (
      <ShotStage fam="olive" t={t} f={f}>
        {/* beat 1: the planet morphs */}
        <g opacity={1 - sw} transform={`translate(${x} ${y}) scale(${1 + 0.4 * sw}) translate(${-x} ${-y})`}>
          <Bloom x={x} y={y} r={R0 * 1.7} color={AIR} strength={0.25 + 0.45 * m} spread={0.55} />
          <Earth cx={x} cy={y} r={core} seed={3} />
          <circle cx={x} cy={y} r={core} fill="#9B5139" opacity={0.25 * m} />
          {m > 0 ? (
            <g>
              <path d={wob(hazeR, 3)} fill={AIR} opacity={0.32 * m} />
              <path d={wob(mix(core, hazeR, 0.7), 5)} fill={OF.light} opacity={0.22 * m} />
              <path d={wob(mix(core, hazeR, 0.35), 7)} fill={AIR} opacity={0.22 * m} />
            </g>
          ) : null}
          <circle cx={x} cy={y} r={R0} fill="none" stroke={OF.text} strokeWidth={3} strokeDasharray="14 12" opacity={0.5 * (1 - m * 0.5)} />
          <g opacity={1 - ease(t, 60, 90)}>{T(x, 960, "A ROCKY 2× EARTH?", 44, OF.text)}</g>
          <g opacity={ease(t, 100, 130) * (1 - sw)}>{T(x, 960, "A SMALL WORLD IN A DEEP, HEAVY SKY", 44, OF.text)}</g>
        </g>
        {/* beat 2: down on the surface, under the deep sky */}
        {sw > 0 ? (
          <g opacity={sw} transform={`translate(960 900) scale(${push}) translate(-960 -900)`}>
            <rect x={-40} y={-40} width={2000} height={1160} fill={OF.sky[1]} />
            <Bloom x={1380} y={300} r={420} color={OF.light} strength={0.35} spread={0.4} />
            <circle cx={1380} cy={300} r={60} fill={OF.light} opacity={0.25} />
            {bands.map((b, i) => {
              const off = (t2 * b.v) % 640 - 640;
              const pts: Pt[] = [];
              for (let k = -2; k <= 8; k++) pts.push([k * 320 - off, b.y + (k % 2 ? -26 : 26)]);
              return <path key={i} d={smoothPath(pts) + ` L ${8 * 320 - off} ${b.y + b.h} L ${-2 * 320 - off} ${b.y + b.h} Z`} fill={b.c} opacity={b.o} />;
            })}
            <HazeBand y={300} h={620} color={OF.light} strength={0.3} />
            <path d={smoothPath([[-40, 870], [300, 820], [700, 860], [1150, 800], [1500, 850], [1960, 810]]) + " L 1960 1100 L -40 1100 Z"} fill={OF.mid} />
            <path d={smoothPath([[-40, 930], [500, 905], [1000, 935], [1500, 900], [1960, 925]]) + " L 1960 1100 L -40 1100 Z"} fill={OF.near} />
            <Motes frame={f} n={30} w={1920} h={900} color={OF.light} seed={21} />
            <Lev x={900} y={922} h={112} frame={f} pose="stand" eyes="up" tilt={-16} wind={0.6} shade="#AFB79A" />
          </g>
        ) : null}
      </ShotStage>
    );
  },

  // ---------------------------------------------------------------- 6-15 · a rocket leaves a rocky super-Earth
  "6-15": ({ t, f }) => {
    const KF = SUPPOSE.clay;
    const p = lin(t, 46, 250);
    const base = 790 - 560 * Math.pow(p, 1.7);
    const shake = t < 46 ? (rnd(f * 3) - 0.5) * 4 * ease(t, 10, 46) : (rnd(f * 3) - 0.5) * 3;
    const padX = 720;
    const lift = t >= 46;
    return (
      <ShotStage fam="clay" t={t} f={f}>
        <Bloom x={720} y={820} r={700} color={KF.light} strength={0.45 + 0.2 * ease(t, 20, 60)} spread={0.5} />
        <path d={`M -60 870 Q 960 700 1980 870 L 1980 1100 L -60 1100 Z`} fill={KF.mid} />
        <path d={`M -60 930 Q 960 780 1980 930 L 1980 1100 L -60 1100 Z`} fill={KF.near} />
        <path d={`M -60 870 Q 960 700 1980 870`} stroke={KF.light} strokeWidth={4} fill="none" opacity={0.5} />
        {/* pad + tower */}
        <path d={roundPoly([[padX - 130, 800], [padX + 130, 800], [padX + 150, 830], [padX - 150, 830]], 8)} fill={INK} opacity={0.8} />
        <path d={`M ${padX + 110} 800 V 520 M ${padX + 150} 800 V 520 M ${padX + 110} 560 L ${padX + 150} 600 M ${padX + 150} 560 L ${padX + 110} 600 M ${padX + 110} 660 L ${padX + 150} 700 M ${padX + 150} 660 L ${padX + 110} 700`} stroke={INK} strokeWidth={6} opacity={0.75} />
        <Exhaust x={padX + shake} y={base + 18} f={f} h={lift ? 260 + 300 * p : 120} r0={lift ? 30 : 18} flame={ease(t, 10, 46)} grow={ease(t, 8, 60)} />
        {/* ground smoke */}
        {Array.from({ length: 9 }, (_, i) => {
          const g = ease(t, 30 + i * 4, 120 + i * 6);
          const side = i % 2 ? 1 : -1;
          const cxx = padX + side * (60 + (i >> 1) * 90 * g + t * 0.6 * g);
          const r = (40 + rnd(i) * 40) * g;
          return <circle key={i} cx={cxx} cy={800 - r * 0.4 + Math.sin(f / 12 + i) * 4} r={r} fill="#FFE2BE" opacity={0.75} />;
        })}
        <Rocket x={padX + shake} base={base} s={0.85} />
        {/* the marker */}
        <g transform={`translate(1300 795) rotate(${Math.sin(f / 18) * 1.2})`}>
          <path d="M 0 0 V -170" stroke={INK} strokeWidth={8} strokeLinecap="round" />
          <rect x={-250} y={-300} width={500} height={140} rx={22} fill={CHALK} stroke={INK} strokeWidth={4} />
          {T(0, -258, "ORDINARY ROCKETS WORK", 22, KF.mid, "middle", 900, { letterSpacing: 1.5 })}
          {T(0, -196, "UNDER 10 EARTHS", 44, INK)}
        </g>
        <Lev x={1580} y={804} h={118} frame={f} facing={-1} pose="stand" eyes="up" tilt={-14 - 10 * p} wind={0.7} shade="#D8B8A2" />
      </ShotStage>
    );
  },

  // ---------------------------------------------------------------- 6-16 · the rocket strains and shakes
  "6-16": ({ t, f }) => {
    const KF = SUPPOSE.clay;
    const sx = (rnd(f * 3 + 1) - 0.5) * 16, sy = (rnd(f * 5 + 2) - 0.5) * 10, rot = (rnd(f * 7 + 3) - 0.5) * 1.6;
    const base = 700 - 30 * ease(t, 10, 90);
    const x = 960;
    return (
      <ShotStage fam="clay" t={t} f={f}>
        <Bloom x={x} y={900} r={800} color={KF.light} strength={0.6} spread={0.5} />
        <Exhaust x={x + sx} y={base + 36} f={f} h={420} r0={52} flame={1.9} seed={5} />
        {/* strain marks */}
        {Array.from({ length: 10 }, (_, i) => {
          const side = i % 2 ? 1 : -1;
          const yy = 160 + (i >> 1) * 110;
          const ph = ((t * 3 + i * 17) % 24) / 24;
          const xx = x + side * (140 + ph * 70);
          return <path key={i} d={`M ${xx} ${yy} l ${side * 40} ${(rnd(i) - 0.5) * 20}`} stroke={CHALK} strokeWidth={7} strokeLinecap="round" opacity={Math.sin(ph * Math.PI) * 0.9} />;
        })}
        {/* sweat drops flying off */}
        {Array.from({ length: 6 }, (_, i) => {
          const ph = ((t + i * 13) % 30) / 30;
          const side = i % 2 ? 1 : -1;
          const xx = x + side * (110 + ph * 160), yy = 260 + i * 40 - Math.sin(ph * Math.PI) * 60 + ph * 40;
          return <path key={`s${i}`} d={`M ${xx} ${yy - 14} Q ${xx + 9} ${yy} ${xx} ${yy + 8} Q ${xx - 9} ${yy} ${xx} ${yy - 14} Z`} fill={AIR} opacity={(1 - ph) * 0.9} />;
        })}
        <Rocket x={x + sx} base={base + sy} s={1.7} rot={rot} />
      </ShotStage>
    );
  },

  // ---------------------------------------------------------------- 6-17 · the FUEL snowball rolls and grows
  "6-17": ({ t, d, f }) => {
    const slope = (x: number) => 380 + x * 0.29;
    const th = Math.atan(0.29);
    const n: Pt = [Math.sin(th), -Math.cos(th)];
    const p = lin(t, 12, 190);
    const xb = 260 + 1220 * Math.pow(p, 1.45);
    const r = 44 * Math.pow(4.6, p);
    const c: Pt = [xb + n[0] * r, slope(xb) + n[1] * r];
    const roll = ((xb - 260) / Math.cos(th) / ((44 + r) / 2)) * (180 / Math.PI);
    const trail: Pt[] = [];
    for (let k = 0; k <= 20; k++) {
      const xx = mix(260, xb, k / 20);
      const rr = 44 * Math.pow(4.6, Math.pow(Math.max(0, (xx - 260) / 1220), 1 / 1.45));
      trail.push([xx, slope(xx) - 2 + rr * 0.12]);
    }
    return (
      <ShotStage fam="chalk" t={t} f={f}>
        <Push t={t} d={d} amt={0.03} cx={1300} cy={700}>
          <Bloom x={600} y={200} r={700} color={CF.light} strength={0.6} />
          <path d={`M -40 ${slope(-40)} L 1960 ${slope(1960)} L 1960 1100 L -40 1100 Z`} fill="#FFFFF4" />
          <path d={`M -40 ${slope(-40) + 180} L 1960 ${slope(1960) + 180} L 1960 1100 L -40 1100 Z`} fill={AIR} opacity={0.16} />
          <path d={`M -40 ${slope(-40) + 320} L 1960 ${slope(1960) + 320} L 1960 1100 L -40 1100 Z`} fill={AIR} opacity={0.14} />
          <path d={`M -40 ${slope(-40)} L 1960 ${slope(1960)}`} stroke={CF.mid} strokeWidth={5} opacity={0.7} />
          <path d={smoothPath(trail)} stroke={CF.far} strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.7} />
          <ellipse cx={c[0] + 20} cy={slope(xb) + 6} rx={r * 0.9} ry={r * 0.12} fill="#000" opacity={0.12} />
          <circle cx={c[0]} cy={c[1]} r={r} fill="#FFFFF4" stroke={INK} strokeWidth={3} strokeOpacity={0.3} />
          <g transform={`rotate(${roll} ${c[0]} ${c[1]})`}>
            {[0, 72, 144, 216, 288].map((a, i) => {
              const [ux, uy] = dir(a);
              return <path key={i} d={`M ${c[0] + ux * r * 0.55 - uy * r * 0.2} ${c[1] + uy * r * 0.55 + ux * r * 0.2} q ${ux * r * 0.18} ${uy * r * 0.18} ${uy * r * 0.4} ${-ux * r * 0.4}`} stroke={AIR} strokeWidth={Math.max(2, r * 0.05)} fill="none" strokeLinecap="round" opacity={0.8} />;
            })}
          </g>
          <circle cx={c[0] + r * 0.25} cy={c[1] + r * 0.25} r={r * 0.75} fill={AIR} opacity={0.22} />
          {T(c[0], c[1] + r * 0.17, "FUEL", r * 0.48, TERRA)}
          {Array.from({ length: 10 }, (_, i) => {
            const ph = ((t * 1.5 + i * 11) % 22) / 22;
            const xx = c[0] - r * (0.5 + ph * 0.9) - rnd(i * 5) * 30;
            const yy = slope(xx) - (20 + rnd(i * 3) * 50 + r * 0.4) * Math.sin(ph * Math.PI) - 6;
            return <circle key={i} cx={xx} cy={yy} r={4 + r * 0.025 + rnd(i) * 3} fill="#FFFFF4" stroke={INK} strokeOpacity={0.2} opacity={1 - ph} />;
          })}
          <Lev x={170} y={slope(170) + 2} h={130} frame={f} pose="shrug" eyes={p > 0.5 ? "wide" : "open"} tilt={10} wind={0.3} outline={INK} />
        </Push>
      </ShotStage>
    );
  },

  // ---------------------------------------------------------------- 6-18 · a rocket that is almost all tank
  "6-18": ({ t, f }) => {
    const MF = SUPPOSE.moss;
    const ground = 960;
    const tank = mix(200, 700, ease(t, 14, 170));
    const x = 900;
    const capTop = ground - tank - 80;
    return (
      <ShotStage fam="moss" t={t} f={f}>
        <Bloom x={x} y={capTop} r={360} color={MF.light} strength={0.18} />
        <path d={smoothPath([[-40, ground + 10], [600, ground - 10], [1300, ground + 6], [1960, ground - 6]]) + " L 1960 1100 L -40 1100 Z"} fill={MF.near} />
        <path d={smoothPath([[-40, ground + 10], [600, ground - 10], [1300, ground + 6], [1960, ground - 6]])} stroke={MF.bounce} strokeWidth={4} fill="none" opacity={0.5} />
        <path d={roundPoly([[x - 70, ground], [x - 70, ground - 200], [x, ground - 290], [x + 70, ground - 200], [x + 70, ground]], 20)} fill="none" stroke={MF.text} strokeWidth={3} strokeDasharray="12 10" opacity={0.45} />
        <Rocket x={x} base={ground} bodyH={tank} w={140} capH={80} fuel />
        <g transform={`translate(${x - 8} ${ground - tank / 2 - 10}) rotate(-90)`}>
          {T(0, 18, "FUEL", Math.min(110, 40 + tank * 0.1), CHALK)}
        </g>
        <path d={`M ${x + 40} ${capTop + 46} L ${x + 150} ${capTop + 10} H ${x + 190}`} stroke={MF.text} strokeWidth={3} fill="none" />
        {T(x + 200, capTop + 20, "PAYLOAD", 34, MF.text, "start")}
        <Lev x={1300} y={ground - 4} h={118} frame={f} facing={-1} pose="stand" eyes="up" tilt={-12 - 14 * ease(t, 14, 170)} wind={0.4} shade="#AFC4B5" />
      </ShotStage>
    );
  },
};
