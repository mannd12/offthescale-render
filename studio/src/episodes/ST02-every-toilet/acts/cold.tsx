// ST02 act "cold": shot bodies keyed by storyboard id (../shotlist.ts). C-01..C-08. Every beat scales with the shot length d.
import React from "react";
import { ShotMap, ShotStage, ease, lin, mix, pop, LADDER_RUNGS } from "../shot";
import { Bloom } from "../../../lib/illustrated/light";
import { CHALK, INK, LIME, ST_FONT, SUPPOSE } from "../../../lib/suppose/palette";
import { Lev } from "../../../lib/suppose/lev";
import { Lever } from "../../../lib/suppose/devices";
import {
  BigClock, BigLadder, Bldg, Building, ChapterBeat, Clipboard, Toilet, FLUSHES, levOnLever, NightLedge, NycMap, Pt, rungY, Stopwatch, SwingSign, TinyToilet, TV, UseChart,
} from "./cold-parts";

const S = SUPPOSE.sage;
const PLATE = "ALL FLUSH: NOW";

// ------------------------------------------------------------------ the pull (C-01, C-02)
const GROUND = 905;
const PIV: Pt = [1640, GROUND];
const LEN = 240;
const LEVH = 200;
const LSC = 1;
const CLOCK = { x: 1430, y: 270, r: 118 };
/** the flash wave rolls from the lever (right) across the city */
const WAVE_O: Pt = [1250, 560];
const flashAt = (t0: number, speed: number) => (b: Bldg) => t0 + Math.hypot(b.x - WAVE_O[0], b.y - WAVE_O[1]) / speed + b.k * 6;

export const SHOTS_COLD: ShotMap = {
  // night map of NYC, the giant clock's second hand sweeps to 8:00:00; Lev rubs hands, hops up and catches the knob
  "C-01": ({ t, d, f }) => {
    const hopA = d * 0.48, hopB = d * 0.66;
    const angle = t < hopB ? -16 : mix(-16, -22, ease(t, hopB, d));
    const hang = levOnLever(PIV, LEN, angle, LEVH, GROUND, LSC);
    const rub = Math.sin(t * 0.8);
    const hop = ease(t, hopA, hopB);
    let lx = 1420, ly = GROUND - 4, pose: "stand" | "pull" = "stand";
    let hands: { front: Pt; back: Pt } = { front: [30 + 9 * rub, -82 + 3 * Math.cos(t * 0.8)], back: [20 - 9 * rub, -86] };
    let lean = -5 + 4 * Math.sin(t / 7);
    if (t >= hopA) {
      const h0 = levOnLever(PIV, LEN, -16, LEVH, GROUND, LSC);
      lx = mix(1420, h0.x, hop);
      ly = mix(GROUND - 4, hang.y, hop) - Math.sin(hop * Math.PI) * 60;
      pose = "pull";
      hands = { front: [mix(30, 48, hop), mix(-82, hang.hand[1], hop)], back: [mix(20, 38, hop), mix(-86, hang.hand[1] + 10, hop)] };
      lean = mix(8, -10, hop);
      if (t >= hopB) {
        lx = hang.x;
        ly = hang.y - Math.sin((t - hopB) * 0.35) * 6 * Math.exp(-(t - hopB) * 0.06);
        hands = { front: hang.hand, back: [hang.hand[0] - 10, hang.hand[1] + 10] };
      }
    }
    // second hand sweeps up to 12 by the end of the shot (it lands at the cut into the pull)
    const sec = mix(-150, -6, lin(t, 0, d));
    return (
      <ShotStage fam="moss" t={t} f={f}>
        <NycMap t={t} f={f} />
        <BigClock x={CLOCK.x} y={CLOCK.y} r={CLOCK.r} sec={sec} readout="8:00:00" glow={0.25 + 0.1 * Math.sin(t / 6)} />
        <NightLedge x0={1300} x1={1900} ground={GROUND} />
        <Lever x={PIV[0]} y={PIV[1]} len={LEN} angle={angle} plate={PLATE} scale={LSC} glow={0.2 + 0.3 * ease(t, hopB, d)} />
        <Lev x={lx} y={ly} h={LEVH} frame={f} pose={pose} hands={hands} lean={lean} eyes={t < d * 0.3 ? "happy" : "squint"} wind={t >= hopA ? 0.9 : 0.4} shade="#9FB7A6" />
      </ShotStage>
    );
  },

  // the pull: every square flashes in a wave from the lever, a blue-sage line drops from each to its street
  "C-02": ({ t, d, f }) => {
    const angle = mix(-22, -40, ease(t, 0, d * 0.16));
    const hang = levOnLever(PIV, LEN, angle, LEVH, GROUND, LSC);
    const speed = 1100 / (d * 0.6);
    const fa = flashAt(d * 0.1, speed);
    const sec = mix(-6, 0, ease(t, 0, 6)) + Math.max(0, t - 6) * 0.2;
    const r = (t - d * 0.1) * speed;
    return (
      <ShotStage fam="moss" t={t} f={f} counter={FLUSHES("0")}>
        <NycMap t={t} f={f} flashAt={fa} lines />
        {r > 0 && r < 1300 ? <circle cx={WAVE_O[0]} cy={WAVE_O[1]} r={r} fill="none" stroke="#FFF6D6" strokeWidth={6} opacity={0.35 * (1 - r / 1300)} /> : null}
        <BigClock x={CLOCK.x} y={CLOCK.y} r={CLOCK.r} sec={sec} readout="8:00:00" glow={0.3 + 0.5 * Math.max(0, 1 - t / 30)} />
        <NightLedge x0={1300} x1={1900} ground={GROUND} />
        <Lever x={PIV[0]} y={PIV[1]} len={LEN} angle={angle} plate={PLATE} scale={LSC} glow={0.55} />
        <Lev x={hang.x} y={hang.y} h={LEVH} frame={f} pose="pull" hands={{ front: hang.hand, back: [hang.hand[0] - 10, hang.hand[1] + 10] }} lean={-10} eyes={t > d * 0.45 ? "wide" : "squint"} wind={0.9} shade="#9FB7A6" />
      </ShotStage>
    );
  },

  // montage strip: a home, an office tower, a school, each with a tiny cream toilet popping; then a crowd of handles
  "C-03": ({ t, d, f }) => {
    const base = 800;
    const at = [d * 0.04, d * 0.17, d * 0.3];
    const xs = [400, 960, 1520];
    const kinds = ["home", "tower", "school"] as const;
    const crowdAt = d * 0.5;
    return (
      <ShotStage fam="sage" t={t} f={f}>
        <Bloom x={960} y={300} r={800} color={S.light} strength={0.6} spread={0.5} />
        <rect x={-60} y={base} width={2040} height={320} fill={S.mid} />
        <path d={`M -60 ${base + 2} H 1980`} stroke={S.near} strokeWidth={4} opacity={0.5} />
        <g transform={`translate(${-t * 0.5} 0)`}>
          {kinds.map((k, i) => {
            const pk = pop(t, at[i], 14);
            const ik = pop(t, at[i] + 12, 12);
            const bob = Math.sin((t - at[i]) / 5) * 6;
            const iy = k === "tower" ? base - 640 : k === "school" ? base - 420 : base - 400;
            return (
              <g key={k}>
                <Building kind={k} x={xs[i]} base={base} k={pk} />
                {ik > 0 ? (
                  <g transform={`translate(${xs[i]} ${iy + bob}) scale(${ik * 3.2})`}>
                    <circle cx={0} cy={-8} r={20} fill={CHALK} stroke={INK} strokeWidth={1.2} />
                    <Toilet x={-2} y={7} s={0.07} outline={INK} />
                  </g>
                ) : null}
              </g>
            );
          })}
        </g>
        {/* millions of people, one handle each: a crowd row of tiny toilets popping across the foreground */}
        {Array.from({ length: 40 }, (_, i) => {
          const x = 70 + i * 46 + ((i * 37) % 11);
          const k = pop(t, crowdAt + i * (d * 0.012), 10);
          if (k <= 0) return null;
          const hop = Math.abs(Math.sin((t - crowdAt) / 4 + i)) * 5;
          return <TinyToilet key={i} x={x} y={base + 120 - hop} s={2.6 * k} />;
        })}
      </ShotStage>
    );
  },

  // three questions swing in over the map; the last beat dims them and Lev shrugs ("here is the strange part")
  "C-04": ({ t, d, f }) => {
    const signs = [
      { x: 520, y: 300, w: 520, text: "PIPES BURST?", at: d * 0.04 },
      { x: 1040, y: 480, w: 560, text: "CITY RUN DRY?", at: d * 0.25 },
      { x: 540, y: 680, w: 500, text: "WATER STOP?", at: d * 0.46 },
    ];
    const strange = ease(t, d * 0.74, d * 0.84);
    return (
      <ShotStage fam="moss" t={t} f={f}>
        <NycMap t={t} f={f} dim={0.55} />
        {(["ropes", "board"] as const).map((part) =>
          signs.map((s, i) => {
            const age = t - s.at;
            if (age < 0) return null;
            const drop = mix(-900, 0, ease(t, s.at, s.at + 16));
            const swing = 3.5 * Math.exp(-age / 30) * Math.sin(age / 5) + 0.5 * Math.sin(f / 20 + i);
            return <SwingSign key={part + i} part={part} x={s.x} y={s.y} w={s.w} text={s.text} angle={swing} drop={drop} opacity={1 - strange * 0.55} />;
          }),
        )}
        <NightLedge x0={1420} x1={1900} ground={GROUND} />
        <Lever x={1780} y={GROUND} len={LEN} angle={-40} plate={PLATE} scale={0.7} glow={0.25} />
        <Lev x={1560} y={GROUND - 4} h={180} frame={f} pose={strange > 0.5 ? "shrug" : "stand"} eyes={strange > 0.5 ? "wide" : "up"} tilt={strange > 0.5 ? 10 : -12 + 4 * Math.sin(t / 12)} facing={-1} wind={0.5} shade="#9FB7A6" />
        {strange > 0 ? <text x={1560} y={GROUND - 240 - 10 * Math.sin(t / 4)} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={90} fill={CHALK} opacity={strange}>?</text> : null}
      </ShotStage>
    );
  },

  // a TV glows on the map: football, HALFTIME; the water-use line draws beside it
  "C-05": ({ t, d, f }) => {
    const tvk = pop(t, 0, 16);
    const draw = ease(t, d * 0.05, d * 0.95) * 0.8;
    return (
      <ShotStage fam="moss" t={t} f={f}>
        <NycMap t={t} f={f} dim={0.7} />
        <TV x={520} y={540} w={560} t={t} f={f} k={tvk} glow={0.7} />
        <UseChart x={980} y={300} w={840} h={500} draw={draw} spike={0} />
      </ShotStage>
    );
  },

  // the line spikes; a stopwatch runs and the WATER DEPT clipboard ticks; Lev watches it like a sport
  "C-06": ({ t, d, f }) => {
    const draw = mix(0.8, 1, ease(t, 0, d * 0.35));
    const spike = ease(t, d * 0.05, d * 0.4);
    const swk = pop(t, d * 0.1, 14);
    const cbk = pop(t, d * 0.3, 14);
    return (
      <ShotStage fam="moss" t={t} f={f}>
        <NycMap t={t} f={f} dim={0.75} />
        <UseChart x={140} y={220} w={980} h={560} draw={draw} spike={spike} />
        <Stopwatch x={1360} y={360} r={110} a={t * 9} k={swk} />
        <Clipboard x={1600} y={640} w={330} checks={lin(t, d * 0.45, d * 0.9) * 3} k={cbk} tilt={6 + Math.sin(t / 14) * 1.5} />
        <Lev x={1240} y={980} h={170} frame={f} pose={spike > 0.6 ? "point" : "stand"} facing={-1} eyes={spike > 0.5 ? "wide" : "open"} tilt={-8} wind={0.4} shade="#9FB7A6" />
      </ShotStage>
    );
  },

  // the lime Ladder grows up the right edge, rung labels pop; a glint climbs it; rung one pulses at the end
  "C-07": ({ t, d, f }) => {
    const top = 110, bottom = 960, lx = 1580;
    const grow = ease(t, 0, d * 0.28);
    const revealY = mix(bottom + 60, top - 40, grow);
    const n = LADDER_RUNGS.length;
    const glint = lin(t, d * 0.45, d * 0.78);
    const gy = mix(bottom + 20, top, glint);
    const one = t > d * 0.84;
    const ring = (t * 3) % 50;
    return (
      <ShotStage fam="moss" t={t} f={f}>
        <g transform={`translate(${-t * 0.6} 0)`}>
          <NycMap t={t} f={f} dim={0.75} />
        </g>
        <defs>
          <clipPath id="st02c07">
            <rect x={900} y={revealY} width={1000} height={1200} />
          </clipPath>
        </defs>
        <g clipPath="url(#st02c07)">
          <BigLadder x={lx} top={top} bottom={bottom} width={120} lit={one ? 0 : -1} glow={one ? 1 : 0} frame={f} rungs={LADDER_RUNGS} font={30}
            labelK={(i) => pop(t, d * 0.06 + i * d * 0.03 + (i / n) * d * 0.1, 12)} />
        </g>
        {glint > 0 && glint < 1 ? (
          <g>
            <Bloom x={lx} y={gy} r={90} color={LIME} strength={0.8} />
            <circle cx={lx - 60} cy={gy} r={9} fill={LIME} />
            <circle cx={lx + 60} cy={gy} r={9} fill={LIME} />
          </g>
        ) : null}
        {one ? <circle cx={lx} cy={rungY(top, bottom, 0, n)} r={70 + ring} fill="none" stroke={LIME} strokeWidth={4} opacity={0.5 * (1 - ring / 50)} /> : null}
        <Lev x={1080} y={1000} h={170} frame={f} pose={one ? "point" : "stand"} eyes="up" tilt={mix(-6, -22, grow) + 3 * Math.sin(t / 10)} wind={0.5} shade="#9FB7A6" />
      </ShotStage>
    );
  },

  // chapter beat: rung ONE FLUSH lights, title "One flush"; the Counter arrives at 1
  "C-08": ({ t, d, f }) => <ChapterBeat t={t} d={d} f={f} fam="sage" prev={-1} next={0} eyebrow="FIRST RUNG" title="One flush" after={FLUSHES("1")} />,
};
