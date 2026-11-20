// STS02 (jump): ST01 lines [12, 13, 14, 15]. Shot bodies only; layout rules in lib/suppose/vshort.tsx.
// Numbers on screen (spoken here): a quarter bigger / more pull (SIZE ×1.25, pull drawn 1 : 1.25), 50 → 40 cm (MODEL).
import React from "react";
import { VShot } from "../../lib/suppose/vshort";
import { Bloom, GroundShadow } from "../../lib/illustrated/light";
import { Cumulus } from "../../lib/illustrated/props";
import { rrect, smoothPath } from "../../lib/illustrated/shapes";
import { CHALK, INK, LIME, OCEAN, SUPPOSE, TERRA } from "../../lib/suppose/palette";
import { Lev } from "../../lib/suppose/lev";
import { STPill } from "../../lib/suppose/devices";
import { Backpack, BackpackStrap, leanPt, Puff, springPath, TERRA_DARK, TERRA_LIT } from "../ST01-earth-twice-as-big/acts/l02-parts";
import { Arrow, beats, Breath, ease, mix, pop, Pop, Pt, SageLand, T, Tag, VStage } from "./vparts-a";

const SAGE = SUPPOSE.sage;
const OUT = SAGE.shadow;
const C125 = { label: "SIZE", value: "×1.25", sub: "PULL ×1.25" };
const wrapX = (x: number, w = 1500) => ((((x + 300) % w) + w) % w) - 300;
const cloud = (x: number, y: number, w: number, h: number, f: number, seed: number, op = 1) => (
  <Cumulus x={x} y={y} w={w} h={h} fill={CHALK} shade="#C9DCC4" lit="#FFFFF4" seed={seed} frame={f} opacity={op} />
);
const Sun: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <Bloom x={x} y={y} r={300} color={SAGE.light} strength={0.8} spread={0.5} />
    <circle cx={x} cy={y} r={64} fill="#FFFBE6" />
  </g>
);

/** indoor sage wall + floor */
const Room: React.FC<{ floor: number }> = ({ floor }) => (
  <g>
    <rect x={0} y={0} width={1080} height={floor} fill={SAGE.haze} />
    {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M ${i * 180 + 40} 0 V ${floor}`} stroke={SAGE.far} strokeWidth={3} opacity={0.35} />)}
    <rect x={0} y={floor - 30} width={1080} height={30} fill={SAGE.mid} />
    <rect x={0} y={floor} width={1080} height={1920 - floor} fill={SAGE.near} />
    <path d={`M 0 ${floor} H 1080`} stroke={SAGE.bounce} strokeWidth={5} opacity={0.7} />
  </g>
);

// ------------------------------------------------------------------ line 12
/** playground at noon; a quarter more pull, drawn to scale */
const Playground: VShot = ({ t, d, f }) => {
  const G = 1130;
  const swing = (cx: number, ph: number, amp: number) => {
    const a = amp * Math.sin(f / 10.5 + ph);
    const L = 330, top = G - 420;
    const r = (a * Math.PI) / 180;
    const sx = cx + Math.sin(r) * L, sy = top + Math.cos(r) * L;
    const c = Math.cos(r) * 36, s = Math.sin(r) * 36;
    return (
      <g key={cx}>
        <path d={`M ${cx - 28} ${top} L ${sx - c} ${sy + s} M ${cx + 28} ${top} L ${sx + c} ${sy - s}`} stroke={INK} strokeWidth={4} opacity={0.75} />
        <g transform={`translate(${sx} ${sy}) rotate(${-a})`}><rect x={-46} y={-6} width={92} height={16} rx={7} fill={TERRA_DARK} /></g>
      </g>
    );
  };
  const grow = ease(t, 30, 80);
  const L1 = 180, L2 = mix(L1, L1 * 1.25, grow);
  return (
    <VStage fam="sage" t={t} d={d} f={f} counter={C125}>
      <Sun x={180} y={400} />
      {cloud(wrapX(600 + f * 0.8), 520, 260, 96, f, 3)}
      <SageLand y={G} />
      <GroundShadow x={780} y={G} rx={170} ry={12} />
      {swing(700, 0, 22)}
      {swing(860, 1.9, 17)}
      <g stroke={TERRA} strokeWidth={16} strokeLinecap="round" fill="none">
        <path d={`M 600 ${G} L 640 ${G - 420} L 680 ${G} M 880 ${G} L 920 ${G - 420} L 960 ${G}`} />
        <path d={`M 630 ${G - 420} H 930`} />
      </g>
      <Lev x={250} y={G - 6} h={230} frame={f} eyes={grow > 0.5 ? "squint" : "happy"} tilt={6} outline={OUT} wind={0.3} seed={2} />
      <T x={400} y={G - 360} size={32} fill={SAGE.dim} ls={2}>TODAY</T>
      <Arrow x0={400} y0={G - 330} x1={400} y1={G - 330 + L1} color={INK} w={10} op={0.55} dash="12 9" />
      <T x={530} y={G - 360} size={32} fill={TERRA_DARK} ls={2}>HERE</T>
      <Arrow x0={530} y0={G - 330} x1={530} y1={G - 330 + L2} color={TERRA_DARK} w={16} head={40} />
      <Pop t={t} a={70} cx={540} cy={G - 520}><T x={540} y={G - 505} size={50} fill={INK}>A QUARTER MORE PULL</T></Pop>
    </VStage>
  );
};

/** leg-as-spring: same push both sides; the weight grows by a quarter on the right (beat B: grow) */
const SpringScene: React.FC<{ t: number; d: number; f: number; grow: number; head: string }> = ({ t, d, f, grow, head }) => {
  const floor = 1080;
  const panel = (cx: number, k: number, label: string, here: boolean) => {
    const osc = Math.sin(f / 6) * 14;
    const c = 40 + 110 * (k - 1) * 4 + osc;
    const yTop = floor - (560 - c);
    const bh = 120 * k;
    const wArrow = 180 * k;
    const push = 200 * (1 + 0.06 * Math.sin(t / 4));
    return (
      <g key={cx}>
        <rect x={cx - 210} y={floor} width={420} height={18} rx={8} fill={INK} opacity={0.8} />
        <path d={springPath(cx, yTop, floor, 110, 9)} stroke={SAGE.near} strokeWidth={12} strokeLinejoin="round" strokeLinecap="round" fill="none" />
        <path d={rrect(cx - 120, yTop - bh, 240, bh, 22)} fill={TERRA} />
        <path d={rrect(cx - 120, yTop - bh, 240, 30, 15)} fill={TERRA_LIT} opacity={0.5} />
        <T x={cx} y={yTop - bh / 2 + 12} size={34} ls={2}>WEIGHT</T>
        <Arrow x0={cx - 170} y0={yTop - bh - 20} x1={cx - 170} y1={yTop - bh - 20 + wArrow} color={TERRA_DARK} w={16} head={38} />
        <Arrow x0={cx + 175} y0={floor - 20} x1={cx + 175} y1={floor - 20 - push} color={OCEAN} w={16} head={38} />
        <T x={cx + 175} y={floor - 250} size={34} fill={OCEAN} ls={2}>PUSH</T>
        <T x={cx} y={floor + 80} size={44} fill={here ? TERRA_DARK : INK} ls={3}>{label}</T>
      </g>
    );
  };
  return (
    <VStage fam="chalk" t={t} d={d} f={f}>
      <T x={540} y={360} size={76} fill={INK}>{head}</T>
      {panel(290, 1, "TODAY", false)}
      {panel(790, 1 + 0.25 * grow, "HERE", true)}
    </VStage>
  );
};
const SpringA: VShot = ({ t, d, f }) => <SpringScene t={t} d={d} f={f} grow={0} head="Same push" />;
const SpringB: VShot = ({ t, d, f }) => <SpringScene t={t} d={d} f={f} grow={ease(t, 4, 40)} head="More weight" />;

/** a hop with a backpack full of books (low hops, loop) */
const BackpackHop: React.FC<{ t: number; f: number; x: number; G: number; h: number; peak: number; period?: number }> = ({ t, f, x, G, h, peak, period = 40 }) => {
  const p = (t % period) / period;
  const q = p < 0.25 ? 0 : (p - 0.25) / 0.75;
  const lift = 4 * peak * q * (1 - q);
  const sq = p < 0.25 ? 1 - Math.sin((p / 0.25) * Math.PI) * 0.1 : 1;
  const y = G - lift;
  return (
    <g>
      <GroundShadow x={x} y={G + 2} rx={90 - lift * 0.3} ry={12} opacity={0.3} />
      <g transform={`translate(${x} ${G}) scale(${2 - sq} ${sq}) translate(${-x} ${-G})`}>
        <Backpack x={x} y={y} h={h} lean={6} />
        <Lev x={x} y={y} h={h} frame={f} eyes="squint" lean={6} outline={OUT} wind={lift > 5 ? 0.8 : 0.2} hands={{ front: [12, -94], back: [-14, -94] }} />
        <BackpackStrap x={x} y={y} h={h} lean={6} />
      </g>
    </g>
  );
};
const Backpacked: VShot = ({ t, d, f }) => (
  <VStage fam="sage" t={t} d={d} f={f} counter={C125}>
    <Sun x={860} y={420} />
    {cloud(wrapX(300 + f * 0.7), 560, 260, 96, f, 5)}
    <SageLand y={1150} seed={2} />
    <BackpackHop t={t} f={f} x={520} G={1150} h={400} peak={60} />
    <Arrow x0={330} y0={720} x1={330} y1={860 + 10 * Math.sin(t / 4)} color={TERRA_DARK} w={14} head={34} op={0.85} />
  </VStage>
);

// ------------------------------------------------------------------ line 13
/** you don't get as high: today's hop height dashed; the real hop stops short (40/50 of it) */
const LowHop: VShot = ({ t, d, f }) => {
  const G = 1150, today = 150, here = 120;
  return (
    <VStage fam="sage" t={t} d={d} f={f} counter={C125}>
      <Sun x={860} y={420} />
      <SageLand y={G} seed={3} />
      <path d={`M 250 ${G - today} H 820`} stroke={INK} strokeWidth={5} strokeDasharray="16 12" opacity={0.5} />
      <T x={830} y={G - today - 18} size={34} fill={SAGE.dim} anchor="end" ls={2}>TODAY</T>
      <BackpackHop t={t} f={f} x={520} G={G} h={360} peak={here} period={46} />
    </VStage>
  );
};

/** ... and you get tired sooner: Lev bent over, puffing */
const Puffing: VShot = ({ t, d, f }) => {
  const G = 1150, x = 470, h = 380, lean = 16, s = h / 170;
  const heave = 1 + Math.sin(t / 4.5) * 0.02;
  const [mx, my] = leanPt(40, -138, lean);
  const mouth: Pt = [x + mx * s, G + my * s];
  return (
    <VStage fam="sage" t={t} d={d} f={f}>
      <Sun x={860} y={420} />
      <SageLand y={G} seed={3} />
      <g transform={`translate(${x} ${G}) scale(1 ${heave}) translate(${-x} ${-G})`}>
        <Backpack x={x} y={G} h={h} lean={lean} />
        <Lev x={x} y={G} h={h} frame={f} eyes={Math.floor(t / 26) % 2 ? "closed" : "squint"} lean={lean} outline={OUT} wind={0.2} hands={{ front: [34, -56], back: [10, -58] }} tilt={4} />
        <BackpackStrap x={x} y={G} h={h} lean={lean} />
      </g>
      {Array.from({ length: 6 }, (_, k) => {
        const a = t - k * 18 + 6;
        if (a < 0 || a > 54) return null;
        const p = a / 54;
        const cx = mouth[0] + 24 + a * 2.6, cy = mouth[1] - a * 2.4;
        const r = 24 + 52 * p;
        return (
          <g key={k} opacity={(1 - p * p) * 0.95}>
            <circle cx={cx} cy={cy} r={r} fill={CHALK} />
            <circle cx={cx + r * 0.8} cy={cy + r * 0.2} r={r * 0.7} fill={CHALK} />
            <circle cx={cx - r * 0.6} cy={cy + r * 0.35} r={r * 0.6} fill={CHALK} />
          </g>
        );
      })}
    </VStage>
  );
};

// ------------------------------------------------------------------ line 14
/** measuring stick: today's 50 cm (ghost hop), then here 40 cm. 9 px per cm. */
const Jump: VShot = ({ t, d, f }) => {
  const G = 1150, x = 430, h = 260, cm = 8;
  const hop = (t0: number, top: number) => {
    const a = t - t0;
    if (a < 0) return { lift: 0, sq: 1 };
    if (a < 12) return { lift: 0, sq: 1 - Math.sin((a / 12) * Math.PI) * 0.12 };
    const q = (a - 12) / 34;
    if (q < 1) return { lift: top * cm * 4 * q * (1 - q), sq: 1 };
    return { lift: 0, sq: q < 1.3 ? 1 - Math.sin(((q - 1) / 0.3) * Math.PI) * 0.1 : 1 };
  };
  const g = hop(8, 50);
  const j = hop(92, 40);
  const y50 = G - 50 * cm, y40 = G - 40 * cm;
  const showHere = t >= 108;
  return (
    <VStage fam="sage" t={t} d={d} f={f}>
      <Sun x={150} y={560} />
      <SageLand y={G} seed={4} />
      <path d={rrect(760, G - 64 * cm, 64, 64 * cm + 6, 12)} fill="#F6E7B8" stroke={TERRA_DARK} strokeWidth={4} />
      {Array.from({ length: 13 }, (_, i) => <path key={i} d={`M 760 ${G - i * 5 * cm} h ${i % 2 ? 20 : 38}`} stroke={INK} strokeWidth={3} />)}
      <path d={`M 60 ${y50} H 824`} stroke={INK} strokeWidth={5} strokeDasharray="16 12" opacity={0.55} />
      <T x={60} y={y50 - 18} size={40} fill={SAGE.dim} anchor="start">50 cm today</T>
      <g opacity={0.3}>
        <Lev x={x} y={G - g.lift} h={h} frame={f} eyes="open" outline={INK} arms={false} seed={5} />
      </g>
      {showHere ? (
        <g>
          <path d={`M 60 ${y40} H ${mix(60, 824, ease(t, 108, 120))}`} stroke={LIME} strokeWidth={9} strokeLinecap="round" />
          <Pop t={t} a={112} cx={180} cy={y40 + 50}><T x={60} y={y40 + 60} size={50} fill={SAGE.shadow} anchor="start">40 cm here</T></Pop>
        </g>
      ) : null}
      {t >= 80 ? (
        <g>
          <GroundShadow x={x} y={G + 2} rx={70 - j.lift * 0.1} ry={10} opacity={0.3} />
          <g transform={`translate(${x} ${G}) scale(${2 - j.sq} ${j.sq}) translate(${-x} ${-G})`}>
            <Lev x={x} y={G - j.lift} h={h} frame={f} eyes={j.lift > 10 ? "wide" : "squint"} outline={OUT} wind={j.lift > 10 ? 0.9 : 0.2} pose={j.lift > 10 ? "shrug" : "stand"} />
          </g>
        </g>
      ) : null}
      <T x={540} y={380} size={92} fill={INK}>50 → 40 cm</T>
      <STPill x={540} y={440} text="MODEL" dark={false} align="middle" size={26} />
    </VStage>
  );
};

/** basketball hoops would feel taller: the hoop rises off its dashed outline */
const Hoop: VShot = ({ t, d, f }) => {
  const G = 1150, hx = 660;
  const rise = 150 * ease(t, 6, 50);
  const boardY = 620 - rise;
  const lx = 280;
  const ph = (t % 18) / 18;
  const by = G - 24 - 70 * Math.abs(Math.cos(ph * Math.PI));
  const rimY = boardY + 120;
  return (
    <VStage fam="sage" t={t} d={d} f={f}>
      <Sun x={180} y={420} />
      {cloud(wrapX(500 + f * 0.7), 380, 240, 90, f, 4)}
      <SageLand y={G} seed={5} />
      <g opacity={0.5} fill="none" stroke={INK} strokeWidth={4} strokeDasharray="12 10">
        <rect x={hx - 40} y={620} width={200} height={140} rx={10} />
        <ellipse cx={hx - 70} cy={740} rx={58} ry={12} />
      </g>
      <GroundShadow x={hx + 60} y={G} rx={110} ry={12} />
      <rect x={hx + 46} y={boardY + 60} width={26} height={G - boardY - 60} fill={SAGE.shadow} />
      <path d={rrect(hx - 40, boardY, 200, 140, 12)} fill={CHALK} stroke={SAGE.shadow} strokeWidth={5} />
      <rect x={hx + 10} y={boardY + 50} width={80} height={60} rx={6} fill="none" stroke={TERRA} strokeWidth={5} />
      <g stroke={CHALK} strokeWidth={3} opacity={0.9}>
        {[-50, -30, -10, 10, 30].map((dx, i) => <path key={i} d={`M ${hx - 70 + dx} ${rimY + 8} L ${hx - 70 + dx * 0.6} ${rimY + 74}`} />)}
      </g>
      <ellipse cx={hx - 70} cy={rimY} rx={60} ry={13} fill="none" stroke={TERRA_DARK} strokeWidth={8} />
      <Arrow x0={hx + 210} y0={770} x1={hx + 210} y1={760 - rise} color={SAGE.near} w={12} op={ease(t, 6, 16)} />
      <Lev x={lx} y={G - 4} h={220} frame={f} eyes="up" tilt={-12} outline={OUT} seed={3} hands={{ front: [44, -70] }} />
      <circle cx={lx + 70} cy={by} r={30} fill={TERRA} />
      <path d={`M ${lx + 40} ${by} H ${lx + 100} M ${lx + 70} ${by - 30} V ${by + 30}`} stroke={TERRA_DARK} strokeWidth={3} />
    </VStage>
  );
};

/** every staircase would feel like one more flight: a second flight stacks on in terracotta */
const Stairs: VShot = ({ t, d, f }) => {
  const G = 1150, sw = 52, sh = 44;
  const land0 = 140 + 7 * sw, landY = G - 7 * sh;
  const extra = Array.from({ length: 7 }, (_, i) => ({ x: land0 + 90 + i * sw, y: landY - (i + 1) * sh }));
  return (
    <VStage fam="sage" t={t} d={d} f={f}>
      <Room floor={G} />
      {Array.from({ length: 7 }, (_, i) => {
        const sx = 140 + i * sw, sy = G - (i + 1) * sh;
        return (
          <g key={i}>
            <rect x={sx} y={sy} width={sw + 1} height={G - sy} fill={SAGE.mid} />
            <path d={`M ${sx} ${sy} h ${sw}`} stroke={SAGE.bounce} strokeWidth={6} />
          </g>
        );
      })}
      <rect x={land0} y={landY} width={90} height={sh * 7} fill={SAGE.mid} />
      <path d={`M ${land0} ${landY} h 90`} stroke={SAGE.bounce} strokeWidth={6} />
      {extra.map((s, i) => {
        const k = pop(t, 8 + i * 9, 12);
        if (k <= 0) return null;
        const hgt = G - s.y;
        return (
          <g key={i} transform={`translate(${s.x} ${G}) scale(1 ${k}) translate(${-s.x} ${-G})`}>
            <rect x={s.x} y={s.y} width={sw + 1} height={hgt} fill={TERRA} opacity={0.9} />
            <path d={`M ${s.x} ${s.y} h ${sw}`} stroke={TERRA_LIT} strokeWidth={6} />
          </g>
        );
      })}
      <Pop t={t} a={76} cx={760} cy={430}><T x={760} y={440} size={52} fill={TERRA_DARK}>+1 FLIGHT</T></Pop>
      <Lev x={84} y={G - 2} h={170} frame={f} eyes="up" tilt={-14} outline={OUT} pose={t > 80 ? "shrug" : "stand"} seed={4} />
    </VStage>
  );
};

// ------------------------------------------------------------------ line 15
/** what goes up comes down harder: Lev tosses a ball; today's ball (dashed) lands later and softer */
const Toss: VShot = ({ t, d, f }) => {
  const G = 1150, lx = 330, hx = 420, top = 520;
  const H = G - 200 - top;
  const up = 22, T1 = 22, T0 = 22 * Math.sqrt(1.25);
  const pos = (TT: number, a: number) => {
    if (a < 0) return G - 200;
    if (a < up) return G - 200 - H * (1 - ((up - a) / up) ** 2);
    const b = Math.min(a - up, TT);
    return top + (G - 34 - top) * (b / TT) ** 2;
  };
  const a = t - 6;
  const yH = pos(T1, a), yT = pos(T0, a);
  const landH = a - up - T1, landT = a - up - T0;
  return (
    <VStage fam="sage" t={t} d={d} f={f} counter={C125}>
      <Sun x={860} y={420} />
      <SageLand y={G} seed={6} />
      <Lev x={lx} y={G - 4} h={200} frame={f} pose={a > 0 && a < 8 ? "point" : "stand"} hands={a > 0 && a < 8 ? { front: [50, -150] } : undefined} eyes="up" tilt={-10} outline={OUT} />
      <circle cx={hx + 220} cy={yT} r={34} fill="none" stroke={INK} strokeWidth={4} strokeDasharray="10 8" opacity={0.55} />
      <Puff x={hx + 220} y={G} a={landT} k={0.7} color={SAGE.dim} />
      <Puff x={hx} y={G} a={landH} k={1.5} color={CHALK} />
      <circle cx={hx} cy={landH > 0 ? G - 34 - Math.abs(Math.sin(Math.min(landH, 20) / 20 * Math.PI)) * 40 * Math.exp(-landH / 20) : yH} r={34} fill={TERRA} />
      <T x={hx + 220} y={G + 70} size={32} fill={SAGE.dim} ls={2}>TODAY</T>
      <T x={hx} y={G + 70} size={32} fill={TERRA_DARK} ls={2}>HERE</T>
    </VStage>
  );
};

// a ball rolls off a table; the new fall (solid) vs today's (dashed); 1.25× the pull = fall time / √1.25
const TABLE_Y = 620, FLOOR = 1150, BALL_R = 40, EDGE = 560, ROLL_V = 11, X0 = 150;
const FALL = FLOOR - TABLE_Y;
const TN = 24, TG = TN * Math.sqrt(1.25);
const ballAt = (tt: number, TF: number) => {
  const tEdge = (EDGE - X0) / ROLL_V;
  if (tt < tEdge) return { x: X0 + ROLL_V * tt, y: TABLE_Y - BALL_R, landed: -1, v: 0 };
  const a = tt - tEdge;
  if (a < TF) return { x: EDGE + ROLL_V * a, y: TABLE_Y - BALL_R + FALL * (a / TF) ** 2, landed: -1, v: (2 * FALL * a) / (TF * TF) };
  const b = a - TF;
  const bounce = Math.abs(Math.sin((Math.min(b, 24) / 24) * Math.PI)) * 60 * Math.exp(-b / 30);
  return { x: EDGE + ROLL_V * TF + ROLL_V * 0.25 * b, y: FLOOR - BALL_R - bounce, landed: b, v: 0 };
};
const DropScene: React.FC<{ tt: number; arrows?: boolean }> = ({ tt, arrows }) => {
  const g = ballAt(tt, TG), n = ballAt(tt, TN);
  const tEdge = (EDGE - X0) / ROLL_V;
  const trail = (TF: number) => {
    const span = Math.min(tt - tEdge, TF);
    if (span <= 1) return "";
    const pts: Pt[] = [];
    for (let i = 0; i <= 16; i++) {
      const a = span * (i / 16);
      pts.push([EDGE + ROLL_V * a, TABLE_Y - BALL_R + FALL * (a / TF) ** 2]);
    }
    return smoothPath(pts);
  };
  return (
    <g>
      <GroundShadow x={330} y={FLOOR + 4} rx={260} ry={14} />
      <rect x={110} y={TABLE_Y + 26} width={22} height={FLOOR - TABLE_Y - 26} fill={TERRA_DARK} />
      <rect x={520} y={TABLE_Y + 26} width={22} height={FLOOR - TABLE_Y - 26} fill={TERRA_DARK} />
      <rect x={80} y={TABLE_Y} width={500} height={28} rx={10} fill={TERRA_DARK} />
      <rect x={80} y={TABLE_Y} width={500} height={9} rx={4} fill={TERRA_LIT} opacity={0.6} />
      <path d={trail(TG)} stroke={INK} strokeWidth={5} strokeDasharray="4 12" strokeLinecap="round" fill="none" opacity={0.55} />
      <path d={trail(TN)} stroke={TERRA} strokeWidth={7} strokeDasharray="2 14" strokeLinecap="round" fill="none" />
      <Puff x={g.x} y={FLOOR} a={g.landed} k={0.8} color={SAGE.dim} />
      <Puff x={n.x} y={FLOOR} a={n.landed} k={1.4} color={CHALK} />
      <circle cx={g.x} cy={g.y} r={BALL_R} fill="none" stroke={INK} strokeWidth={4} strokeDasharray="10 8" opacity={0.55} />
      <g transform={`translate(${n.x} ${n.y}) rotate(${(n.x - X0) * 1.7})`}>
        <circle r={BALL_R} fill={TERRA} />
        <path d={`M ${-BALL_R} 0 Q 0 -12 ${BALL_R} 0`} stroke={TERRA_DARK} strokeWidth={4} fill="none" />
        <circle cx={-10} cy={-11} r={10} fill={TERRA_LIT} opacity={0.7} />
      </g>
      {arrows && g.v > 0 ? <Arrow x0={g.x - 80} y0={g.y - g.v * 5} x1={g.x - 80} y1={g.y} color={INK} w={8} op={0.5} dash="10 8" /> : null}
      {arrows && n.v > 0 ? <Arrow x0={n.x + 80} y0={n.y - n.v * 5} x1={n.x + 80} y1={n.y} color={TERRA_DARK} w={12} /> : null}
    </g>
  );
};
const Legend: React.FC = () => (
  <g>
    <T x={140} y={430} size={40} fill={SAGE.dim} anchor="start" ls={2}>- - TODAY</T>
    <T x={140} y={490} size={40} fill={TERRA_DARK} anchor="start" ls={2}>● HERE</T>
  </g>
);
const TableDrop: VShot = ({ t, d, f }) => (
  <VStage fam="sage" t={t} d={d} f={f}>
    <Room floor={FLOOR} />
    <DropScene tt={t * 0.85} />
    <Legend />
  </VStage>
);
const TableSlow: VShot = ({ t, d, f }) => {
  const tt = 34 + t / 2.6;
  const z = 1.25;
  return (
    <VStage fam="sage" t={t} d={d} f={f}>
      <Room floor={FLOOR} />
      <g transform={`translate(640 900) scale(${z}) translate(-640 -900)`}>
        <DropScene tt={tt} arrows />
      </g>
      <Legend />
      <T x={140} y={360} size={36} fill={SAGE.dim} anchor="start" ls={4}>SLOWED DOWN</T>
    </VStage>
  );
};

// cups break more easily
const Cup: React.FC<{ x: number; y: number; rot: number; cracks?: number }> = ({ x, y, rot, cracks = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <path d="M -96 -74 q -36 4 -34 32 q 2 22 34 22" stroke={CHALK} strokeWidth={12} fill="none" strokeLinecap="round" />
    <path d={rrect(-96, -100, 90, 100, 14)} fill={CHALK} stroke={SAGE.shadow} strokeWidth={3} />
    <rect x={-96} y={-70} width={90} height={18} fill={TERRA} />
    {cracks > 0 ? (
      <path d="M -50 -100 L -58 -78 L -44 -62 L -60 -40 L -48 -20 L -56 0 M -58 -78 L -78 -70 M -44 -62 L -24 -54" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="220" strokeDashoffset={220 * (1 - cracks)} />
    ) : null}
  </g>
);
const CupFall: VShot = ({ t, d, f }) => {
  const shelf = 800, x0 = 520, t0 = 6;
  const tip = ease(t, t0, t0 + 12);
  let x = x0, y = shelf, rot = 60 * tip, landed = -1;
  if (t >= t0 + 12) {
    const a = t - t0 - 12, TF = 18;
    if (a < TF) {
      x = x0 + 5 * a;
      y = shelf + (FLOOR - shelf) * (a / TF) ** 2;
      rot = 60 + 30 * (a / TF);
    } else {
      const b = a - TF;
      x = x0 + 5 * TF + 2 * Math.min(b, 6);
      y = FLOOR - Math.sin((Math.min(b, 8) / 8) * Math.PI) * 14;
      rot = 90;
      landed = b;
    }
  }
  return (
    <VStage fam="sage" t={t} d={d} f={f}>
      <Room floor={FLOOR} />
      <g transform={`translate(500 ${FLOOR}) scale(1.5) translate(-500 ${-FLOOR})`}>
        <path d={`M 300 ${shelf + 24} l 0 60 l 60 -60 Z M 620 ${shelf + 24} l 0 60 l -60 -60 Z`} fill={TERRA_DARK} opacity={0.8} />
        <rect x={260} y={shelf} width={400} height={24} rx={8} fill={TERRA_DARK} />
        <Cup x={430} y={shelf} rot={0} />
        {landed >= 0 ? <Puff x={x - 50} y={FLOOR} a={landed} k={0.8} /> : null}
        <Cup x={x} y={y} rot={rot} cracks={landed >= 0 ? ease(landed, 0, 16) : 0} />
        {landed > 0 ? <path d={rrect(x + 20 + Math.min(landed, 18) * 4, FLOOR - 16 - Math.sin((Math.min(landed, 18) / 18) * Math.PI) * 50, 22, 14, 4)} fill={CHALK} stroke={SAGE.shadow} strokeWidth={2} /> : null}
      </g>
    </VStage>
  );
};

/** trips hurt more: Lev walks carefully in knee pads, stepping over a stone (never hurt, never falls) */
const KneePads: VShot = ({ t, d, f }) => {
  const G = 1150, x = 430, h = 380, s = h / 170;
  const scroll = t * 5;
  const ph = (t / 14) * Math.PI;
  const bob = -Math.abs(Math.sin(ph)) * 10;
  const stoneX = 700 - scroll;
  const step = Math.max(0, 1 - Math.abs(stoneX - x) / 90);
  return (
    <VStage fam="sage" t={t} d={d} f={f}>
      <Sun x={860} y={420} />
      <SageLand y={G} seed={7} scroll={scroll} />
      <ellipse cx={stoneX} cy={G - 10} rx={46} ry={22} fill={SAGE.shadow} />
      <ellipse cx={stoneX - 10} cy={G - 18} rx={20} ry={8} fill={SAGE.far} opacity={0.6} />
      <g transform={`translate(0 ${bob - step * 40})`}>
        <Lev x={x} y={G} h={h} frame={f} eyes="squint" lean={10} tilt={18} outline={OUT} wind={0.5} hands={{ front: [40, -70], back: [-30, -66] }} />
      </g>
      <Breath x={x + 50 * s} y={G - 150 * s + bob} t={t} k={1.4} color={SAGE.dim} />
      <Pop t={t} a={6} cx={540} cy={470}><Tag x={540} y={470} text="WATCH YOUR STEP" size={46} dark={false} /></Pop>
    </VStage>
  );
};

export const SHOTS_02: VShot[][] = [
  [beats([0, 102, 232, 311], [Playground, SpringA, SpringB, Backpacked])],
  [beats([0, 95], [LowHop, Puffing])],
  [beats([0, 166, 252], [Jump, Hoop, Stairs])],
  [beats([0, 90, 218, 345, 409], [Toss, TableDrop, TableSlow, CupFall, KneePads])],
];
