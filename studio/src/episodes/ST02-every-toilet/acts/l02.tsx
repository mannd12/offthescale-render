// ST02 act "l02" · 2 · One building (sage → chalk → clay). Shot bodies keyed by storyboard id (2-01..2-10).
// Every beat sits at a fraction of the shot length d (timings are estimated and will move).
import React from "react";
import { ShotMap, ShotStage, ease, lin, mix, pop } from "../shot";
import { Lev } from "../../../lib/suppose/lev";
import { STPill } from "../../../lib/suppose/devices";
import { CHALK, INK, LIME, TERRA } from "../../../lib/suppose/palette";
import { Bloom } from "../../../lib/illustrated/light";
import { rnd } from "../../../lib/illustrated/motion";
import { rrect, smoothPath } from "../../../lib/illustrated/shapes";
import {
  Arrow, BRASS, CHK, CLAY, C_BUILDING, CREAM, ChapterBeat8, Gauge, Grid, LobbyLev, PIPE, PIPE_DK, PIPE_LT, Pin, Pt, SAGE, Stamp, StampRings,
  TERRA_DARK, TERRA_LIT, TW, Tower, TowerGround, Txt, WATER, WATER_DK, WATER_LT, blocks, clamp01, floorY, fmt, partial, slam, towerTop,
} from "./l02-parts";

// ------------------------------------------------------------------ shared pipe diagram (2-02, 2-03)
const PY = 600, PX0 = 300, PX1 = 1560, PR = 46;
/** horizontal cutaway pipe; `bulge(x)` 0..1 widens the walls at x (the pressure wave); flowing dashes at `flow` px/frame */
const PipeRun: React.FC<{ t: number; flow: number; bulge: (x: number) => number; x0?: number; x1?: number }> = ({ t, flow, bulge, x0 = PX0, x1 = PX1 }) => {
  const N = 90;
  const top: Pt[] = [], bot: Pt[] = [];
  for (let i = 0; i <= N; i++) {
    const x = mix(x0, x1, i / N);
    const b = bulge(x) * 26;
    top.push([x, PY - PR - 14 - b]);
    bot.push([x, PY + PR + 14 + b]);
  }
  const outer = "M " + top.map((p) => p.join(" ")).join(" L ") + " L " + [...bot].reverse().map((p) => p.join(" ")).join(" L ") + " Z";
  const inner = "M " + top.map((p) => `${p[0]} ${p[1] + 14}`).join(" L ") + " L " + [...bot].reverse().map((p) => `${p[0]} ${p[1] - 14}`).join(" L ") + " Z";
  const off = -t * flow;
  return (
    <g>
      <path d={outer} fill={PIPE_DK} />
      <path d={inner} fill={WATER} />
      {top.map((p, i) => {
        const b = bulge(p[0]);
        if (b < 0.08 || i === N) return null;
        return <rect key={i} x={p[0]} y={PY - PR - b * 12} width={(x1 - x0) / N + 1} height={PR * 2 + b * 24} fill={WATER_DK} opacity={b * 0.8} />;
      })}
      {[-24, 0, 24].map((dy, i) => (
        <path key={i} d={`M ${x0 + 10} ${PY + dy} H ${x1 - 10}`} stroke={WATER_LT} strokeWidth={5} strokeDasharray={`${40 + i * 8} 34`} strokeDashoffset={off + i * 30} strokeLinecap="round" opacity={0.85} />
      ))}
      <path d={`M ${x0} ${PY - PR - 6} H ${x1}`} stroke={PIPE_LT} strokeWidth={4} opacity={0.35} />
    </g>
  );
};
/** a travelling pulse centred at x = pos */
const band = (x: number, pos: number, wd = 90) => Math.exp(-Math.pow((x - pos) / wd, 2));

/** wave bouncing between xa and xb from frame `a` (frames since launch), one leg every `leg` frames, decaying */
const bounce = (a: number, xa: number, xb: number, leg: number, decay: number) => {
  if (a <= 0) return { pos: xa, amp: 0, dir: 1 };
  const legs = Math.floor(a / leg);
  const along = (a % leg) / leg;
  const even = legs % 2 === 0;
  return { pos: even ? mix(xa, xb, along) : mix(xb, xa, along), amp: Math.pow(decay, legs) * Math.min(1, a / 4), dir: (even ? 1 : -1) * Math.sign(xb - xa) };
};

const Valve: React.FC<{ x: number; shut: number; shake: number }> = ({ x, shut, shake }) => (
  <g transform={`translate(${shake} 0)`}>
    <rect x={x - 46} y={PY - PR - 110} width={92} height={60} rx={12} fill={TERRA_DARK} />
    <path d={`M ${x} ${PY - PR - 110} V ${PY - PR - 170}`} stroke={TERRA_DARK} strokeWidth={14} strokeLinecap="round" />
    <rect x={x - 70} y={PY - PR - 190} width={140} height={26} rx={13} fill={TERRA} />
    <rect x={x - 22} y={mix(PY - PR - 108, PY - PR - 6, shut)} width={44} height={PR * 2 + 10} rx={8} fill={TERRA} stroke={TERRA_DARK} strokeWidth={4} />
    <rect x={x - 56} y={PY - PR - 22} width={112} height={PR * 2 + 44} rx={14} fill="none" stroke={TERRA_DARK} strokeWidth={10} />
  </g>
);

const Pump: React.FC<{ cx: number; cy: number; rot: number; on: number }> = ({ cx, cy, rot, on }) => (
  <g>
    {on > 0.02 ? <Bloom x={cx} y={cy} r={210} color={TERRA_LIT} strength={on * 0.5} /> : null}
    <rect x={cx - 150} y={cy + 110} width={300} height={40} rx={12} fill={TERRA_DARK} />
    <circle cx={cx} cy={cy} r={140} fill={TERRA_DARK} />
    <circle cx={cx} cy={cy} r={124} fill={TERRA} />
    <circle cx={cx} cy={cy} r={96} fill={CHALK} opacity={0.92} />
    <g transform={`rotate(${rot} ${cx} ${cy})`}>
      {Array.from({ length: 6 }, (_, i) => (
        <path key={i} d={`M ${cx} ${cy} Q ${cx + 40} ${cy - 30} ${cx + 82} ${cy - 10}`} stroke={TERRA_DARK} strokeWidth={14} strokeLinecap="round" fill="none" transform={`rotate(${i * 60} ${cx} ${cy})`} />
      ))}
      <circle cx={cx} cy={cy} r={20} fill={TERRA_DARK} />
    </g>
    <circle cx={cx + 104} cy={cy - 104} r={16} fill={on > 0.5 ? LIME : PIPE} stroke={INK} strokeWidth={3} />
  </g>
);

// ------------------------------------------------------------------ clay map backdrop (2-06, 2-07)
const ClayMap: React.FC<{ seed: number; river?: boolean; t: number }> = ({ seed, river, t }) => (
  <g>
    <rect x={-300} y={-300} width={2520} height={1680} fill={CLAY.sky[1]} opacity={0.3} />
    {blocks(21 * 13, seed).map((b, i) => (
      <path key={i} d={rrect(960 + b.x - b.w / 2, 560 + b.y - b.h / 2, b.w, b.h, 10)} fill={b.tone > 0.5 ? CLAY.mid : CLAY.far} opacity={0.55 + b.tone * 0.25} />
    ))}
    {river ? (
      <g>
        <path d={smoothPath([[-80, 800], [300, 760], [640, 820], [980, 740], [1300, 800], [1640, 720], [2000, 770]])} stroke={WATER} strokeWidth={90} fill="none" strokeLinecap="round" />
        <path d={smoothPath([[-80, 800], [300, 760], [640, 820], [980, 740], [1300, 800], [1640, 720], [2000, 770]])} stroke={WATER_LT} strokeWidth={4} strokeDasharray="40 50" strokeDashoffset={-t * 1.6} fill="none" opacity={0.7} />
      </g>
    ) : null}
  </g>
);

/** year + place card (top left), slides in with k */
const PlaceCard: React.FC<{ x: number; y: number; big: string; small: string; k: number }> = ({ x, y, big, small, k }) =>
  k <= 0 ? null : (
    <g transform={`translate(${mix(-700, 0, k)} 0)`}>
      <rect x={x} y={y} width={420} height={176} rx={24} fill={INK} opacity={0.82} />
      <Txt x={x + 36} y={y + 106} size={96} fill={CHALK}>{big}</Txt>
      <Txt x={x + 40} y={y + 150} size={28} fill={CLAY.dim} ls={4}>{small}</Txt>
    </g>
  );

const Tag: React.FC<{ x: number; y: number; k: number; text: string; fill: string }> = ({ x, y, k, text, fill }) => {
  if (k <= 0) return null;
  const w = text.length * 27 + 60;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <rect x={-w / 2} y={-46} width={w} height={84} rx={42} fill={fill} opacity={0.9} />
      <Txt x={0} y={14} anchor="middle" size={40} fill={CHALK} ls={2}>{text}</Txt>
    </g>
  );
};

// ------------------------------------------------------------------ the shots
export const SHOTS_L02: ShotMap = {
  // Cutaway tower; Lev pulls the lever in the lobby; floors flash upward; Counter 1 → 40 → 400 (illustrative)
  "2-01": ({ t, d, f }) => {
    const pull = ease(t, 0.04 * d, 0.18 * d);
    const c1 = ease(t, 0.22 * d, 0.45 * d), c2 = ease(t, 0.55 * d, 0.85 * d);
    const n = t < 0.22 * d ? 1 : t < 0.55 * d ? mix(1, 40, c1) : mix(40, 400, c2);
    const speed = 1 + c1 + 2 * c2;
    const t0 = 0.18 * d;
    const flash = (i: number) => {
      if (t < t0) return 0;
      const run = (t - t0) * 2.2 * speed;
      if (run < i * 7) return 0;
      const k = (run - i * 7) % 52;
      return Math.max(0, 1 - k / 14);
    };
    const needle = mix(30, -70, 0.4 * c1 + 0.6 * c2) + Math.sin(t / 2.3) * 3 * (c1 + c2);
    const gx = 1430, gy = 560;
    return (
      <ShotStage fam="sage" t={t} f={f} counter={{ label: "FLUSHES", value: fmt(n) }}>
        <Bloom x={760} y={300} r={760} color={SAGE.light} strength={0.5} spread={0.5} />
        <TowerGround />
        <path d={`M ${TW.x0 + TW.w - 104} ${gy + 140} H ${gx} V ${gy + 130}`} stroke={PIPE_DK} strokeWidth={14} fill="none" strokeLinejoin="round" />
        <Tower t={t} flash={flash} flow={0.4 + speed * 0.5} lobby={<LobbyLev f={f} pull={pull} />} />
        <Gauge cx={gx} cy={gy} r={140} angle={needle} />
        <Txt x={gx} y={gy - 180} anchor="middle" size={30} fill={SAGE.text} ls={4}>PRESSURE</Txt>
      </ShotStage>
    );
  },

  // Water hammer: water flows, the valve slams shut, a pressure wave runs back up the pipe and bounces
  "2-02": ({ t, d, f }) => {
    const shutAt = 0.3 * d;
    const shut = ease(t, shutAt, shutAt + 5);
    const a = t - shutAt - 5;
    const w = bounce(a, PX1 - 70, PX0 + 50, 0.2 * d, 0.72);
    const bulge = (x: number) => w.amp * band(x, w.pos, 70);
    const shake = a > 0 && a < 14 ? Math.sin(a * 2.8) * 8 * (1 - a / 14) : 0;
    const hitValve = Math.max(0, 1 - Math.abs(w.pos - (PX1 - 70)) / 200) * w.amp;
    const lbl = ease(t, shutAt + 8, shutAt + 18);
    return (
      <ShotStage fam="chalk" t={t} f={f}>
        <Grid />
        <Txt x={300} y={250} size={84} fill={CHK.text} op={ease(t, 0.02 * d, 0.1 * d)}>WATER HAMMER</Txt>
        <path d={`M 304 284 L ${304 + 640 * ease(t, 0.05 * d, 0.2 * d)} 284`} stroke={TERRA} strokeWidth={10} strokeLinecap="round" />
        <g transform={`translate(${shake} 0)`}>
          <PipeRun t={t} flow={5 * (1 - shut)} bulge={bulge} />
        </g>
        <Valve x={PX1 - 20} shut={shut} shake={shake} />
        <g opacity={1 - shut}>
          <Arrow x0={700} y0={780} x1={1000} y1={780} color={WATER_DK} w={10} />
          <Txt x={850} y={850} anchor="middle" size={32} fill={CHK.dim} ls={4}>FLOW</Txt>
        </g>
        {w.amp > 0 ? (
          <g opacity={lbl * Math.max(0.35, w.amp)}>
            <Arrow x0={w.pos - w.dir * 80} y0={470} x1={w.pos + w.dir * 90} y1={470} color={TERRA} w={10} />
            <Txt x={w.pos} y={430} anchor="middle" size={30} fill={TERRA} ls={3}>PRESSURE WAVE</Txt>
          </g>
        ) : null}
        <Txt x={PX1 - 20} y={760} anchor="middle" size={30} fill={CHK.dim} ls={4}>VALVE</Txt>
        <Gauge cx={1700} cy={300} r={100} angle={mix(-20, 100, hitValve) + (a > 0 ? Math.sin(t / 2) * 3 * w.amp : 0)} danger={hitValve} />
      </ShotStage>
    );
  },

  // A pump stopping makes the same wave
  "2-03": ({ t, d, f }) => {
    const a0 = 0.08 * d, a1 = 0.4 * d;
    const stop = ease(t, a0, a1);
    // impeller angle = ∫ speed, speed 18°/frame falling linearly to 0 between a0 and a1
    const tc = Math.min(Math.max(t, a0), a1) - a0;
    const rot = Math.min(t, a0) * 18 + 18 * (tc - (tc * tc) / (2 * (a1 - a0)));
    const px0 = 560, px1 = 1700;
    const w = bounce(t - 0.36 * d, px0 + 40, px1 - 50, 0.26 * d, 0.7);
    const bulge = (x: number) => w.amp * band(x, w.pos, 70);
    return (
      <ShotStage fam="chalk" t={t} f={f}>
        <Grid />
        <PipeRun t={t} flow={5 * (1 - stop)} bulge={bulge} x0={px0} x1={px1} />
        <path d={`M ${px1} ${PY - PR - 24} V ${PY + PR + 24}`} stroke={PIPE_DK} strokeWidth={22} strokeLinecap="round" />
        <path d={`M 250 ${PY + 130} Q 200 ${PY + 200} ${mix(170, 120, stop)} ${PY + 240}`} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
        <rect x={mix(150, 100, stop)} y={PY + 232} width={40} height={24} rx={6} fill={INK} transform={`rotate(${-20 * stop} ${mix(170, 120, stop)} ${PY + 244})`} />
        <Pump cx={400} cy={PY} rot={rot} on={1 - stop} />
        <Txt x={400} y={PY + 230} anchor="middle" size={34} fill={CHK.dim} ls={4}>PUMP</Txt>
        <Txt x={300} y={250} size={60} fill={CHK.text} op={ease(t, 0.38 * d, 0.48 * d)}>SAME WAVE</Txt>
        {w.amp > 0 ? (
          <g opacity={Math.max(0.35, w.amp)}>
            <Arrow x0={w.pos - w.dir * 80} y0={470} x1={w.pos + w.dir * 90} y1={470} color={TERRA} w={10} />
          </g>
        ) : null}
      </ShotStage>
    );
  },

  // The surge can rupture a pipe: the seam swells and cracks, Lev hops back unhurt. NOT FROM TOILETS
  "2-04": ({ t, d, f }) => {
    const G = 860;
    const swell = ease(t, 0.05 * d, 0.45 * d);
    const crackP = ease(t, 0.45 * d, 0.58 * d);
    const sx = 860, py = 540, pr = 80;
    const needle = mix(-30, 112, swell) + Math.sin(t / 1.6) * 6 * swell * (1 - crackP * 0.6);
    const hop = lin(t, 0.47 * d, 0.64 * d);
    const levX = mix(1240, 1480, ease(hop, 0, 1));
    const levY = G - Math.sin(hop * Math.PI) * 110;
    const sw = swell * 46 * (1 + 0.04 * Math.sin(t / 3));
    const crackPts: Pt[] = [[sx - 6, py - pr - 26 - sw], [sx + 14, py - pr + 10 - sw * 0.6], [sx - 10, py - 30], [sx + 16, py + 10], [sx - 8, py + 50], [sx + 10, py + pr + 16 + sw * 0.6]];
    const crack = partial(crackPts, crackP);
    const gap = crackP >= 1 ? 6 + 3 * Math.sin(t / 5) : 0;
    const pill = pop(t, 0.68 * d, 14);
    const midAir = hop > 0 && hop < 1;
    return (
      <ShotStage fam="clay" t={t} f={f}>
        <Bloom x={860} y={420} r={720} color={CLAY.light} strength={0.45} spread={0.5} />
        <path d={smoothPath([[-60, G - 60], [500, G - 110], [1100, G - 70], [1980, G - 120]]) + ` L 1980 ${G + 4} L -60 ${G + 4} Z`} fill={CLAY.far} opacity={0.7} />
        <rect x={-60} y={G} width={2040} height={300} fill={CLAY.near} />
        {[420, 1320].map((x) => <path key={x} d={`M ${x - 60} ${G} L ${x - 40} ${py + pr} L ${x + 40} ${py + pr} L ${x + 60} ${G} Z`} fill={TERRA_DARK} />)}
        <path
          d={`M 120 ${py - pr} L ${sx - 200} ${py - pr} C ${sx - 100} ${py - pr} ${sx - 60} ${py - pr - sw} ${sx} ${py - pr - sw} C ${sx + 60} ${py - pr - sw} ${sx + 100} ${py - pr} ${sx + 200} ${py - pr} L 1640 ${py - pr} L 1640 ${py + pr} L ${sx + 200} ${py + pr} C ${sx + 100} ${py + pr} ${sx + 60} ${py + pr + sw} ${sx} ${py + pr + sw} C ${sx - 60} ${py + pr + sw} ${sx - 100} ${py + pr} ${sx - 200} ${py + pr} L 120 ${py + pr} Z`}
          fill={PIPE}
        />
        <path d={`M 140 ${py - pr + 18} H ${sx - 220} M ${sx + 220} ${py - pr + 18} H 1620`} stroke={PIPE_LT} strokeWidth={10} opacity={0.5} strokeLinecap="round" />
        <path d={`M 120 ${py + pr - 16} H 1640`} stroke={PIPE_DK} strokeWidth={14} opacity={0.5} />
        <rect x={100} y={py - pr - 16} width={36} height={pr * 2 + 32} rx={10} fill={PIPE_DK} />
        <rect x={1624} y={py - pr - 16} width={36} height={pr * 2 + 32} rx={10} fill={PIPE_DK} />
        {/* the seam (bolted collar), opening when it cracks */}
        <rect x={sx - 18 - gap} y={py - pr - 14 - sw} width={36 + gap * 2} height={pr * 2 + 28 + sw * 2} rx={10} fill={PIPE_DK} />
        {gap > 0 ? <rect x={sx - gap / 2} y={py - pr - 10 - sw} width={gap} height={pr * 2 + 20 + sw * 2} fill={WATER} /> : null}
        {[-0.7, -0.25, 0.25, 0.7].map((k) => <circle key={k} cx={sx - 9 - gap} cy={py + k * (pr + sw)} r={6} fill={BRASS} />)}
        {crackP > 0 ? <path d={crack.d} stroke={INK} strokeWidth={8} fill="none" strokeLinejoin="round" strokeLinecap="round" /> : null}
        {crackP >= 1
          ? [0, 1, 2].map((i) => {
              const a = (((t - 0.58 * d + i * 14) % 42) + 42) % 42 / 42;
              const top = py + pr + sw + 12;
              return <ellipse key={i} cx={sx + (i - 1) * 8} cy={top + a * (G - top - 10)} rx={6} ry={9} fill={WATER_LT} opacity={1 - a} />;
            })
          : null}
        <path d={`M ${sx + 300} ${py - pr} V ${py - pr - 90}`} stroke={PIPE_DK} strokeWidth={14} />
        <Gauge cx={sx + 300} cy={py - pr - 190} r={100} angle={needle} danger={swell} />
        <Lev x={levX} y={levY} h={170} frame={f} facing={-1} pose={midAir ? "shrug" : "stand"} eyes={midAir ? "wide" : t > 0.64 * d ? "happy" : "open"} tilt={hop > 0 ? 10 : -4} lean={midAir ? -10 : 0} wind={0.4 + (midAir ? 0.6 : 0)} shade="#D8B8A2" />
        {pill > 0 ? (
          <g transform={`translate(860 ${G + 100}) scale(${pill}) translate(-860 ${-(G + 100)})`}>
            <STPill x={860} y={G + 100} text="NOT FROM TOILETS" align="middle" size={34} />
          </g>
        ) : null}
      </ShotStage>
    );
  },

  // The tower again: air bubbles creep into the top-floor pipe; a hammer wave runs down; JUDGMENT stamp; Lev shrugs
  "2-05": ({ t, d, f }) => {
    const push = ease(t, 0, 0.18 * d);
    const k = mix(1, 1.45, push);
    const px = 760, py = towerTop + 60;
    const cx = mix(px, 640, push), cy = mix(py, 300, push);
    const bubbles = ease(t, 0.12 * d, 0.45 * d);
    const waveA = lin(t, 0.4 * d, 0.58 * d), waveB = lin(t, 0.62 * d, 0.8 * d);
    const wave = t < 0.6 * d ? waveA : waveB;
    const waveAmp = t < 0.4 * d ? 0 : t < 0.6 * d ? 1 : t < 0.8 * d ? 0.6 : 0;
    const flash = (i: number) => (i === TW.floors - 1 ? 0.25 + 0.25 * Math.sin(t / 5) : 0);
    const st = slam(t, 0.56 * d);
    const shrug = t > 0.82 * d;
    const ly = floorY(TW.floors - 1);
    const call = ease(t, 0.22 * d, 0.3 * d) * (1 - ease(t, 0.5 * d, 0.56 * d));
    return (
      <ShotStage fam="sage" t={t} f={f}>
        <g transform={`translate(${st.shake} ${st.shake * 0.4})`}>
          <Bloom x={760} y={300} r={760} color={SAGE.light} strength={0.5} spread={0.5} />
          <g transform={`translate(${cx} ${cy}) scale(${k}) translate(${-px} ${-py})`}>
            <TowerGround />
            <Tower t={t} flash={flash} flow={0.4} bubbles={bubbles} wave={wave} waveAmp={waveAmp} />
            <Lev x={TW.x0 + 470} y={ly} h={66} frame={f} facing={-1} pose={shrug ? "shrug" : "stand"} eyes={shrug ? "happy" : waveAmp > 0 ? "wide" : "open"} tilt={shrug ? 8 : 0} outline={INK} />
          </g>
          {call > 0 ? (
            <g opacity={call}>
              <rect x={1300} y={300} width={460} height={84} rx={42} fill={INK} opacity={0.78} />
              <Arrow x0={1290} y0={342} x1={1140} y1={342} color={INK} w={8} head={22} />
              <Txt x={1530} y={356} anchor="middle" size={42} fill={CHALK} ls={4}>AIR IN THE PIPE</Txt>
            </g>
          ) : null}
          <StampRings x={1460} y={760} t={t} at={0.56 * d} w={560} h={120} />
          <Stamp x={1460} y={760} text="JUDGMENT" s={st.s} />
        </g>
      </ShotStage>
    );
  },

  // NEW YORK 1998: a 48-inch main on Fifth Avenue (pin drop + label slide, then the pipe ring for scale)
  "2-06": ({ t, d, f }) => {
    const card = ease(t, 0.02 * d, 0.14 * d);
    const pin = ease(t, 0.12 * d, 0.22 * d);
    const ave = ease(t, 0.26 * d, 0.42 * d);
    const ring = pop(t, 0.5 * d, 16);
    const dim = ease(t, 0.5 * d, 0.6 * d);
    const ax = 900, pinY = 560;
    const rx = 1420, ry = 600, rr = 190 * Math.max(0, ring);
    const lp = t > 0.72 * d;
    return (
      <ShotStage fam="clay" t={t} f={f}>
        <g transform={`rotate(-12 ${ax} ${pinY})`}>
          <ClayMap seed={4} t={t} />
          <rect x={ax - 24} y={-400} width={48} height={1900} fill={CLAY.light} opacity={0.8} />
          <path d={`M ${ax} -400 V 1500`} stroke={WATER} strokeWidth={10} strokeDasharray="30 18" strokeDashoffset={-t * 1.2} opacity={0.85} />
        </g>
        <rect x={-60} y={-60} width={2040} height={1200} fill={CLAY.sky[0]} opacity={0.4 * dim} />
        <Pin x={ax} y={pinY} k={pin} />
        <g transform={`translate(${mix(-520, 0, ave)} 0)`} opacity={ave}>
          <rect x={ax - 400} y={pinY + 30} width={340} height={66} rx={33} fill={CHALK} opacity={0.94} />
          <Txt x={ax - 230} y={pinY + 75} anchor="middle" size={32} fill={INK} ls={3}>FIFTH AVENUE</Txt>
        </g>
        <PlaceCard x={110} y={110} big="1998" small="NEW YORK" k={card} />
        {ring > 0 ? (
          <g>
            <circle cx={rx} cy={ry} r={rr + 26} fill={PIPE_DK} />
            <circle cx={rx} cy={ry} r={rr} fill={WATER} />
            <circle cx={rx} cy={ry} r={rr * 0.8} fill="none" stroke={WATER_LT} strokeWidth={6} strokeDasharray="20 26" strokeDashoffset={t * 2} opacity={0.7} />
            <Arrow x0={rx} y0={ry + 40} x1={rx - rr + 8} y1={ry + 40} color={CHALK} w={8} head={22} />
            <Arrow x0={rx} y0={ry + 40} x1={rx + rr - 8} y1={ry + 40} color={CHALK} w={8} head={22} />
            <g transform={`translate(${rx} ${ry - 20}) scale(${ring})`}>
              <rect x={-110} y={-48} width={220} height={66} rx={20} fill={INK} opacity={0.82} />
              <Txt x={0} y={0} anchor="middle" size={44} fill={CHALK}>48-inch</Txt>
            </g>
            <Txt x={rx} y={ry + rr + 90} anchor="middle" size={30} fill={CLAY.text} ls={4} op={ease(t, 0.6 * d, 0.7 * d)}>WATER MAIN</Txt>
          </g>
        ) : null}
        <Lev x={rx - 300} y={ry + 216} h={150} frame={f} pose={lp ? "point" : "stand"} eyes="up" tilt={-6} shade="#D8B8A2" />
      </ShotStage>
    );
  },

  // HAMBURG 2009: 14 waterworks pumps stop (power loss), then 16 mains crack
  "2-07": ({ t, d, f }) => {
    const card = ease(t, 0.02 * d, 0.12 * d);
    const off = ease(t, 0.2 * d, 0.34 * d);
    const tag1 = pop(t, 0.36 * d, 14);
    const tag2 = pop(t, 0.86 * d, 14);
    const pumps: Pt[] = Array.from({ length: 14 }, (_, i) => [280 + (i % 7) * 220 + (Math.floor(i / 7) ? 110 : 0), 470 + Math.floor(i / 7) * 160 + rnd(i + 3) * 24]);
    const mainY = [400, 560 + 150, 930];
    const mainAt = (x: number, i: number) => mainY[i] + Math.sin(x / 230 + i * 1.7) * 18;
    const mains = mainY.map((_, i) => "M " + Array.from({ length: 44 }, (_, k) => { const x = 100 + k * 40; return `${x} ${mainAt(x, i).toFixed(1)}`; }).join(" L "));
    const crackAt: Pt[] = Array.from({ length: 16 }, (_, i) => {
      const lane = i % 3;
      const x = 200 + ((i * 7) % 16) * 100 + rnd(i * 5) * 30;
      return [x, mainAt(x, lane)];
    });
    // pumps decelerate: angle = ∫ speed
    const s0 = 0.2 * d, s1 = 0.34 * d;
    const tc = Math.min(Math.max(t, s0), s1) - s0;
    const ang = Math.min(t, s0) * 10 + 10 * (tc - (tc * tc) / (2 * (s1 - s0)));
    return (
      <ShotStage fam="clay" t={t} f={f}>
        <ClayMap seed={9} river t={t} />
        {mains.map((m, i) => (
          <g key={i}>
            <path d={m} stroke={PIPE_DK} strokeWidth={22} fill="none" strokeLinecap="round" />
            <path d={m} stroke={WATER} strokeWidth={12} fill="none" strokeLinecap="round" strokeDasharray="26 18" strokeDashoffset={-ang * 0.3} />
          </g>
        ))}
        {pumps.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={44} fill={TERRA_DARK} />
            <circle cx={x} cy={y} r={36} fill={off < 0.5 ? TERRA : "#9C6A56"} />
            <g transform={`rotate(${ang + i * 20} ${x} ${y})`}>
              {[0, 120, 240].map((a) => <path key={a} d={`M ${x} ${y} L ${x + 26} ${y - 6}`} stroke={CHALK} strokeWidth={8} strokeLinecap="round" transform={`rotate(${a} ${x} ${y})`} />)}
            </g>
            <circle cx={x + 32} cy={y - 32} r={9} fill={off < 0.5 ? LIME : PIPE} stroke={INK} strokeWidth={2} />
          </g>
        ))}
        {crackAt.map(([x, y], i) => {
          const k = pop(t, 0.5 * d + (i / 16) * 0.32 * d, 10);
          if (k <= 0) return null;
          return (
            <g key={i} transform={`translate(${x} ${y}) scale(${k})`}>
              <circle r={30} fill={CHALK} opacity={0.92} />
              <path d="M -16 -18 L -2 -4 L -10 4 L 6 18 M -2 -4 L 14 -10" stroke={TERRA_DARK} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          );
        })}
        <PlaceCard x={110} y={110} big="2009" small="HAMBURG" k={card} />
        <Tag x={1290} y={170} k={tag1} text="14 WATERWORKS" fill={INK} />
        <Tag x={1290} y={270} k={tag2} text="16 MAINS" fill={INK} />
      </ShotStage>
    );
  },

  // Both cases get a NOT A TOILET stamp; a magnifier finds no flushing record; Lev shrugs
  "2-08": ({ t, d, f }) => {
    const inK = ease(t, 0, 0.12 * d);
    const s1 = slam(t, 0.2 * d), s2 = slam(t, 0.38 * d);
    const mag = lin(t, 0.55 * d, 0.92 * d);
    const shrug = t > 0.8 * d;
    const G = 930;
    const caseCard = (x: number, big: string, small: string, seed: number) => (
      <g>
        <defs>
          <clipPath id={`l208c${seed}`}><rect x={x - 280} y={200} width={560} height={430} rx={20} /></clipPath>
        </defs>
        <rect x={x - 300} y={180} width={600} height={470} rx={28} fill={INK} opacity={0.6} />
        <g clipPath={`url(#l208c${seed})`}>
          {blocks(21 * 13, seed).map((b, i) => (
            <rect key={i} x={x + b.x * 0.55 - b.w * 0.25} y={470 + b.y * 0.55 - b.h * 0.25} width={b.w * 0.5} height={b.h * 0.5} rx={6} fill={b.tone > 0.5 ? CLAY.mid : CLAY.far} opacity={0.75} />
          ))}
        </g>
        <Pin x={x + 200} y={420} k={1} s={0.8} />
        <rect x={x - 280} y={200} width={330} height={150} rx={18} fill={INK} opacity={0.7} />
        <Txt x={x - 256} y={290} size={80} fill={CHALK}>{big}</Txt>
        <Txt x={x - 252} y={332} size={26} fill={CLAY.dim} ls={4}>{small}</Txt>
      </g>
    );
    const mx = mix(830, 1090, 0.5 - 0.5 * Math.cos(mag * Math.PI * 2)), my = 800 + Math.sin(mag * Math.PI * 3) * 26;
    return (
      <ShotStage fam="clay" t={t} f={f}>
        <g transform={`translate(${s1.shake + s2.shake} ${(s1.shake + s2.shake) * 0.4})`}>
          <Bloom x={960} y={420} r={800} color={CLAY.light} strength={0.4} spread={0.5} />
          <rect x={-60} y={G} width={2040} height={300} fill={CLAY.near} />
          <g transform={`translate(${mix(-900, 0, inK)} 0)`}>{caseCard(560, "1998", "NEW YORK", 3)}</g>
          <g transform={`translate(${mix(900, 0, inK)} 0)`}>{caseCard(1300, "2009", "HAMBURG", 8)}</g>
          <StampRings x={560} y={520} t={t} at={0.2 * d} w={560} h={120} rot={-9} />
          <Stamp x={560} y={520} text="NOT A TOILET" s={s1.s} rot={-9} size={46} />
          <StampRings x={1300} y={520} t={t} at={0.38 * d} w={560} h={120} rot={7} />
          <Stamp x={1300} y={520} text="NOT A TOILET" s={s2.s} rot={7} size={46} />
          {mag > 0 ? (
            <g opacity={ease(t, 0.52 * d, 0.58 * d)}>
              <rect x={760} y={700} width={400} height={200} rx={18} fill={CHALK} opacity={0.92} />
              {[0, 1, 2, 3].map((i) => <path key={i} d={`M 800 ${745 + i * 38} H 1120`} stroke={CLAY.far} strokeWidth={6} strokeLinecap="round" opacity={0.5} strokeDasharray="4 14" />)}
              <circle cx={mx} cy={my} r={52} fill={CHALK} opacity={0.4} stroke={TERRA_DARK} strokeWidth={12} />
              <path d={`M ${mx + 38} ${my + 38} L ${mx + 80} ${my + 80}`} stroke={TERRA_DARK} strokeWidth={18} strokeLinecap="round" />
            </g>
          ) : null}
          <Lev x={1660} y={G + 2} h={180} frame={f} facing={-1} pose={shrug ? "shrug" : "stand"} eyes={shrug ? "happy" : "open"} tilt={shrug ? 10 + Math.sin(t / 8) * 3 : -4} shade="#D8B8A2" />
        </g>
      </ShotStage>
    );
  },

  // A tower is not a city: the tower shrinks to a tiny cream square on a street map; mains draw out from it
  "2-09": ({ t, d, f }) => {
    const z = ease(t, 0.12 * d, 0.6 * d);
    const k = Math.exp(mix(0, Math.log(0.06), z));
    const tcx = TW.x0 + TW.w / 2, tcy = (towerTop + TW.ground) / 2;
    const cx = mix(tcx, 960, z), cy = mix(tcy, 540, z);
    const mapZ = Math.exp(mix(Math.log(5), 0, z)) * mix(1, 0.88, ease(t, 0.6 * d, d));
    const mapOp = ease(t, 0.12 * d, 0.4 * d);
    const sq = ease(t, 0.42 * d, 0.58 * d);
    const mains = ease(t, 0.6 * d, 0.95 * d);
    const ring = t > 0.58 * d ? 0.5 + 0.5 * Math.sin((t - 0.58 * d) / 6) : -1;
    const B = blocks(21 * 13, 21);
    const streets: Pt[][] = [
      [[960, 540], [1006, 540], [1006, 540 - 46 - 92 * 4]],
      [[960, 540], [914, 540], [914, 540 + 46 + 92 * 4]],
      [[960, 540], [960, 586], [960 + 92 * 9, 586]],
      [[960, 540], [960, 494], [960 - 92 * 9, 494]],
    ];
    return (
      <ShotStage fam="sage" t={t} f={f}>
        <Bloom x={760} y={300} r={760} color={SAGE.light} strength={0.5} spread={0.5} />
        <g opacity={1 - mapOp}><TowerGround /></g>
        <g opacity={mapOp}>
          <rect x={-60} y={-60} width={2040} height={1200} fill={SAGE.haze} />
          <g transform={`translate(960 540) scale(${mapZ}) translate(-960 -540)`}>
            {B.map((b, i) => (Math.abs(b.x) < 5 && Math.abs(b.y) < 5 ? null : (
              <rect key={i} x={960 + b.x - b.w / 2} y={540 + b.y - b.h / 2} width={b.w} height={b.h} rx={8} fill={b.tone > 0.5 ? SAGE.mid : SAGE.far} />
            )))}
            {mains > 0 ? streets.map((s, i) => <path key={i} d={partial(s, mains).d} stroke={WATER} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />) : null}
            {sq > 0 ? <rect x={930} y={510} width={60} height={60} rx={8} fill={CREAM} stroke={INK} strokeWidth={3} opacity={sq} /> : null}
            {ring >= 0 ? <circle cx={960} cy={540} r={60 + ring * 16} fill="none" stroke={LIME} strokeWidth={6} opacity={0.95 - ring * 0.4} /> : null}
          </g>
        </g>
        {sq < 1 ? (
          <g opacity={1 - sq} transform={`translate(${cx} ${cy}) scale(${k}) translate(${-tcx} ${-tcy})`}>
            <Tower t={t} flow={0.4} />
          </g>
        ) : null}
      </ShotStage>
    );
  },

  // chapter beat: rung SEATTLE
  "2-10": ({ t, d, f }) => <ChapterBeat8 t={t} d={d} f={f} fam="sage" prev={1} next={2} eyebrow="NEXT RUNG" title="Seattle" counter={C_BUILDING} />,
};

void clamp01;
