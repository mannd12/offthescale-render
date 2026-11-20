// STS05 (ten-day-month): ST01 lines [0, 2, 35]. Shot bodies only; layout rules in lib/suppose/vshort.tsx.
// On screen (all spoken here): ×2 (twice as wide / twice as hard), ×8 (eight times), 27 and "under 10" days.
import React from "react";
import { VShot } from "../../lib/suppose/vshort";
import { Bloom } from "../../lib/illustrated/light";
import { rnd } from "../../lib/illustrated/motion";
import { rrect } from "../../lib/illustrated/shapes";
import { CHALK, CHALK_SHADE, INK, LIME, ST_FONT, SUPPOSE, TERRA } from "../../lib/suppose/palette";
import { Earth } from "../../lib/suppose/frames";
import { Lev } from "../../lib/suppose/lev";
import { Ball, DownArrow } from "../ST01-earth-twice-as-big/acts/cold-parts";
import { MoonBall, MoonDisc, OpenPull, OpenSame, T, TAU, TERRA_DEEP, TERRA_LIT, VArrow, VCounter, VPill, VStage, ease, lin, mix, pop } from "./vparts-b";

const CH = SUPPOSE.chalk;
const MOSS = SUPPOSE.moss;
const OLIVE = SUPPOSE.olive;

// ------------------------------------------------------------------ line 2 · shot 1: eight small balls fill one twice as wide
/** height of liquid in a sphere of radius R holding fraction q of its volume */
const capH = (q: number, R: number) => {
  let lo = 0, hi = 2 * R;
  for (let i = 0; i < 30; i++) {
    const h = (lo + hi) / 2;
    if ((h * h * (3 * R - h)) / (4 * R * R * R) < q) lo = h;
    else hi = h;
  }
  return (lo + hi) / 2;
};
const SRC = { x: 540, y: 430, r: 95 };
const BIG = { x: 540, y: 860, r: 190 };
const DROP0 = 12, DROP_GAP = 11, FALLN = 14;

const FillBalls: VShot = ({ t, d, f }) => {
  const landed = (k: number) => DROP0 + k * DROP_GAP + FALLN;
  let n = 0;
  for (let k = 0; k < 8; k++) if (t >= landed(k)) n++;
  const q = [0, 1, 2, 3, 4, 5, 6, 7].reduce((s, k) => s + ease(t, landed(k), landed(k) + 8), 0) / 8;
  const h = capH(Math.max(0.0001, q), BIG.r);
  const top = BIG.y + BIG.r - h;
  const slosh = Math.sin(t / 3) * 6 * (q > 0 && q < 1 ? 1 : 0.3);
  return (
    <VStage fam="chalk" t={t} d={d} f={f} push={0.03}>
      <Bloom x={540} y={700} r={600} color={CH.light} strength={0.6} />
      <Ball cx={SRC.x} cy={SRC.y} r={SRC.r} fill={TERRA} />
      <T x={SRC.x + SRC.r + 30} y={SRC.y + 14} size={40} fill={INK} anchor="start">ONE BALL</T>
      <defs>
        <clipPath id="s05big"><circle cx={BIG.x} cy={BIG.y} r={BIG.r - 6} /></clipPath>
      </defs>
      <circle cx={BIG.x} cy={BIG.y} r={BIG.r} fill={CHALK} opacity={0.65} />
      <g clipPath="url(#s05big)">
        <path d={`M ${BIG.x - BIG.r} ${top} Q ${BIG.x - BIG.r / 2} ${top - slosh} ${BIG.x} ${top} T ${BIG.x + BIG.r} ${top} V ${BIG.y + BIG.r} H ${BIG.x - BIG.r} Z`} fill={TERRA} />
        <path d={`M ${BIG.x - BIG.r} ${top + 10} Q ${BIG.x - BIG.r / 2} ${top + 10 - slosh} ${BIG.x} ${top + 10} T ${BIG.x + BIG.r} ${top + 10}`} stroke={TERRA_LIT} strokeWidth={8} fill="none" opacity={0.7} />
      </g>
      <circle cx={BIG.x} cy={BIG.y} r={BIG.r} fill="none" stroke={INK} strokeWidth={6} />
      <path d={`M ${BIG.x - BIG.r * 0.62} ${BIG.y - BIG.r * 0.5} A ${BIG.r * 0.8} ${BIG.r * 0.8} 0 0 1 ${BIG.x - BIG.r * 0.1} ${BIG.y - BIG.r * 0.8}`} stroke="#FFFFFF" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.6} />
      {/* width bars, to scale */}
      <path d={`M ${SRC.x - SRC.r} ${SRC.y + SRC.r + 28} H ${SRC.x + SRC.r}`} stroke={INK} strokeWidth={6} strokeLinecap="round" opacity={0.6} />
      <path d={`M ${BIG.x - BIG.r} ${BIG.y + BIG.r + 34} H ${BIG.x + BIG.r}`} stroke={INK} strokeWidth={6} strokeLinecap="round" opacity={0.6} />
      <T x={BIG.x} y={BIG.y + BIG.r + 100} size={44} fill={INK}>TWICE AS WIDE</T>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => {
        const a = DROP0 + k * DROP_GAP;
        if (t < a || t > a + FALLN + 2) return null;
        const p = lin(t, a, a + FALLN);
        const y = mix(SRC.y, top - 10, p * p);
        const r = SRC.r * mix(1, 0.6, p);
        return <g key={k} opacity={1 - Math.max(0, p - 0.85) * 6}><Ball cx={SRC.x + Math.sin(k * 2.1) * 30 * p} cy={y} r={r} fill={TERRA} /></g>;
      })}
      {n > 0 ? (
        <g transform={`translate(845 ${BIG.y - 40}) scale(${(1 + 0.25 * Math.max(0, 1 - (t - landed(n - 1)) / 8)).toFixed(3)})`}>
          <text x={0} y={0} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={n === 8 ? 130 : 110} fill={LIME} stroke={INK} strokeWidth={6} paintOrder="stroke">{n === 8 ? "×8" : n}</text>
        </g>
      ) : null}
    </VStage>
  );
};

// ------------------------------------------------------------------ line 2 · shot 2: eight times the mass (a balance)
const PIV = { x: 540, y: 560 };
const ARM = 280, STR = 300;
const RB = 92, RS = 46;
const SMALL_SLOTS: [number, number][] = [[-92, 0], [0, 0], [92, 0], [-92, 1], [0, 1], [92, 1], [-46, 2], [46, 2]];
const Balance: VShot = ({ t, d, f }) => {
  const drops = SMALL_SLOTS.map((_, k) => 10 + k * 10);
  const nIn = drops.reduce((s, a) => s + ease(t, a + 8, a + 16), 0);
  const wob = Math.sin(t / 4) * 1.6 * Math.exp(-Math.max(0, t - 96) / 20);
  const ang = -14 * (1 - nIn / 8) + wob; // degrees; negative = left side down
  const rad = (ang * Math.PI) / 180;
  const L: [number, number] = [PIV.x - ARM * Math.cos(rad), PIV.y - ARM * Math.sin(rad)];
  const R: [number, number] = [PIV.x + ARM * Math.cos(rad), PIV.y + ARM * Math.sin(rad)];
  const pan = (x: number, y: number, w: number) => (
    <g>
      <path d={`M ${x} ${y} L ${x - w / 2 + 14} ${y + STR} M ${x} ${y} L ${x + w / 2 - 14} ${y + STR}`} stroke={CHALK} strokeWidth={4} opacity={0.75} />
      <path d={`M ${x - w / 2} ${y + STR} Q ${x} ${y + STR + 46} ${x + w / 2} ${y + STR} Z`} fill={MOSS.bounce} stroke={INK} strokeWidth={4} />
      <circle cx={x} cy={y} r={9} fill={CHALK} />
    </g>
  );
  const floorL = L[1] + STR + 4, floorR = R[1] + STR + 4;
  const done = pop(t, 98, 14);
  return (
    <VStage fam="moss" t={t} d={d} f={f} push={0.03}>
      <Bloom x={540} y={760} r={620} color={MOSS.bounce} strength={0.3} />
      <path d={`M ${PIV.x} ${PIV.y} L ${PIV.x} 1150`} stroke={INK} strokeWidth={26} strokeLinecap="round" />
      <path d={`M ${PIV.x} ${PIV.y} L ${PIV.x} 1150`} stroke={MOSS.far} strokeWidth={16} strokeLinecap="round" />
      <path d={rrect(PIV.x - 170, 1140, 340, 34, 17)} fill={MOSS.far} stroke={INK} strokeWidth={4} />
      <path d={`M ${L[0]} ${L[1]} L ${R[0]} ${R[1]}`} stroke={INK} strokeWidth={24} strokeLinecap="round" />
      <path d={`M ${L[0]} ${L[1]} L ${R[0]} ${R[1]}`} stroke="#D8B35A" strokeWidth={14} strokeLinecap="round" />
      <circle cx={PIV.x} cy={PIV.y} r={20} fill="#8E6E2A" stroke={INK} strokeWidth={4} />
      <path d={`M ${PIV.x} ${PIV.y - 20} L ${PIV.x + Math.sin(rad) * 90} ${PIV.y - Math.cos(rad) * 90}`} stroke={CHALK} strokeWidth={6} strokeLinecap="round" />
      {pan(L[0], L[1], 260)}
      {pan(R[0], R[1], 320)}
      <Earth cx={L[0]} cy={floorL - RB} r={RB} seed={4} />
      {SMALL_SLOTS.map(([dx, row], k) => {
        const a = drops[k];
        if (t < a) return null;
        const p = ease(t, a, a + 10);
        const yRest = floorR - RS - row * (RS * 2 - 6);
        const y = mix(300, yRest, p * p);
        return <Earth key={k} cx={R[0] + dx} cy={y} r={RS} seed={k + 2} />;
      })}
      <T x={L[0]} y={floorL + 92} size={38}>TWICE AS WIDE</T>
      <T x={R[0]} y={floorR + 92} size={38}>EIGHT EARTHS</T>
      <VCounter label="MASS" value="×8" k={done} />
    </VStage>
  );
};

// ------------------------------------------------------------------ line 2 · shot 3: the ground pulls twice as hard
const PullTwice: VShot = ({ t, d, f }) => {
  const ER = 1500, ECY = 1040 + ER;
  const surf = (x: number) => ECY - Math.sqrt(ER * ER - (x - 540) ** 2);
  const gk = ease(t, 12, 60);
  const arrows = Array.from({ length: 12 }, (_, i) => {
    const x = 90 + i * 82 + (rnd(i * 3) - 0.5) * 30;
    if ((x > 300 && x < 560) || x > 640) return null;
    const floor = surf(x) - 8;
    const span = floor - 300 + 140;
    const v = 7 + 9 * gk + rnd(i * 7) * 3;
    const y = 300 + ((t * v + rnd(i * 11) * span) % span);
    const o = Math.min(1, Math.max(0, (floor - y) / 80)) * 0.75 * Math.min(1, (y - 300) / 60);
    return <DownArrow key={i} x={x} y={y} len={50 + 60 * gk} w={9 + 4 * gk} color={CHALK} opacity={o} />;
  });
  const squash = 1 - 0.07 * gk;
  const ax = 770;
  return (
    <VStage fam="moss" t={t} d={d} f={f} push={0.04} cy={900}>
      <Earth cx={540} cy={ECY} r={ER} seed={5} />
      <defs><clipPath id="s05e"><circle cx={540} cy={ECY} r={ER} /></clipPath></defs>
      <g clipPath="url(#s05e)">
        <ellipse cx={360} cy={surf(360) + 150} rx={330} ry={180} fill="#9BC283" />
        <ellipse cx={900} cy={surf(900) + 190} rx={200} ry={140} fill="#7FAE72" />
      </g>
      {arrows}
      {/* the pull: today's arrow (dashed) and the new one, twice as long */}
      <VArrow x0={ax - 60} y0={600} x1={ax - 60} y1={750} color={CHALK} w={10} head={30} dash="14 10" op={0.75} />
      <T x={ax - 60} y={575} size={30} ls={2} opacity={0.85}>TODAY</T>
      <VArrow x0={ax + 70} y0={600} x1={ax + 70} y1={600 + 300 * gk + 2} color={TERRA} w={18} head={42} />
      <T x={ax + 70} y={575} size={34} ls={2}>×2</T>
      <g transform={`translate(400 ${surf(400)}) scale(1 ${squash.toFixed(3)}) translate(-400 ${-surf(400)})`}>
        <Lev x={400} y={surf(400) + 2} h={300} frame={f} eyes={gk > 0.5 ? "squint" : "open"} tilt={-4} pose="stand" lean={2 * gk} shade="#9FB7A6" />
      </g>
      <VCounter label="GRAVITY" value="×2" k={pop(t, 50, 14)} />
      <VPill x={770} y={500} text="OUR SUM" k={ease(t, 64, 74)} />
    </VStage>
  );
};

// ------------------------------------------------------------------ line 35 · shot 1: the Moon races round the bigger Earth
const MoonRace: VShot = ({ t, d, f }) => {
  const cx = 540, cy = 690, R = 330;
  const th = (t / 70) * TAU - Math.PI / 2;
  const th2 = (t / (70 * Math.sqrt(8))) * TAU - Math.PI / 2;
  const at = (a: number): [number, number] => [cx + R * Math.cos(a), cy + R * Math.sin(a)];
  const g = ease(t, 14, 30);
  const [mx, my] = at(th);
  const [gx, gy] = at(th2);
  const trail = [1, 2, 3, 4, 5, 6].map((i) => {
    const [x, y] = at(th - i * 0.1);
    return <circle key={i} cx={x} cy={y} r={40 - i * 5} fill="#E4E2CF" opacity={0.3 - i * 0.045} />;
  });
  const chev = [0, 1, 2].map((i) => {
    const p = (t / 18 + i / 3) % 1;
    const r = mix(R - 60, 215, p);
    const x = cx + r * Math.cos(th), y = cy + r * Math.sin(th);
    const a = (th * 180) / Math.PI + 180;
    return <path key={i} d="M -14 -16 L 6 0 L -14 16" transform={`translate(${x} ${y}) rotate(${a})`} stroke={TERRA} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={Math.sin(p * Math.PI)} />;
  });
  return (
    <VStage fam="olive" t={t} d={d} f={f} push={0.04} cy={690}>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={CHALK} strokeWidth={3} strokeDasharray="6 12" opacity={0.45} />
      <Earth cx={cx} cy={cy} r={180} seed={8} />
      {chev}
      <g opacity={g}>
        <MoonDisc x={gx} y={gy} r={40} ghost />
        <T x={gx} y={gy - 58} size={28} ls={2} fill={OLIVE.dim}>TODAY'S PACE</T>
      </g>
      {trail}
      <MoonBall x={mx} y={my} r={44} />
      <g opacity={ease(t, 30, 44)}>
        <T x={cx} y={cy + R + 90} size={42} ls={2}>SAME DISTANCE</T>
        <T x={cx} y={cy + R + 146} size={42} ls={2} fill={TERRA_LIT}>×8 PULL</T>
      </g>
    </VStage>
  );
};

// ------------------------------------------------------------------ line 35 · shot 2: the calendar flips 27 → under 10 days
const CAL = { x: 250, y: 360, w: 580, h: 640 };
const CalPage: React.FC<{ big?: string; small?: string; lines?: boolean }> = ({ big, small, lines }) => (
  <g>
    <path d={rrect(CAL.x, CAL.y + 90, CAL.w, CAL.h - 90, 26)} fill={CHALK} />
    <path d={rrect(CAL.x, CAL.y + CAL.h - 30, CAL.w, 30, 14)} fill={CHALK_SHADE} opacity={0.7} />
    {small ? <text x={CAL.x + CAL.w / 2} y={CAL.y + 210} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={60} letterSpacing={4} fill={TERRA_DEEP}>{small}</text> : null}
    {big ? (
      <>
        <text x={CAL.x + CAL.w / 2} y={CAL.y + 450} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={250} fill={INK}>{big}</text>
        <text x={CAL.x + CAL.w / 2} y={CAL.y + 550} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={62} letterSpacing={6} fill={TERRA_DEEP}>DAYS</text>
      </>
    ) : null}
    {lines ? [0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${CAL.x + 70} ${CAL.y + 200 + i * 72} H ${CAL.x + CAL.w - 70}`} stroke={CHALK_SHADE} strokeWidth={7} strokeLinecap="round" />) : null}
  </g>
);
const Calendar: VShot = ({ t, d, f }) => {
  const F0 = 24, P = 9, N = 6;
  const idx = Math.floor((t - F0) / P);
  const flipping = t >= F0 && idx < N;
  const p = flipping ? (t - F0 - idx * P) / P : 0;
  const done = t >= F0 + N * P;
  const fin = <CalPage big="10" small="UNDER" />;
  const under = done ? fin : t < F0 ? <CalPage big="27" /> : idx === N - 1 ? fin : <CalPage lines />;
  const top = flipping ? (idx === 0 ? <CalPage big="27" /> : <CalPage lines />) : null;
  const mth = (t / 34) * TAU;
  const mx = 540 + 420 * Math.cos(mth), my = 700 + 470 * Math.sin(mth);
  const k = pop(t, F0 + N * P, 12);
  const ccx = CAL.x + CAL.w / 2;
  return (
    <VStage fam="olive" t={t} d={d} f={f} push={0.04} cy={700}>
      <ellipse cx={540} cy={700} rx={420} ry={470} fill="none" stroke={CHALK} strokeWidth={3} strokeDasharray="6 12" opacity={0.3} />
      <path d={rrect(CAL.x + 12, CAL.y + 22, CAL.w, CAL.h, 26)} fill="#000" opacity={0.3} />
      {under}
      {top ? (
        <g transform={`translate(${ccx + p * 260} ${CAL.y + 90 - p * 100}) rotate(${p * 18}) scale(1 ${Math.max(0.02, Math.cos(p * Math.PI * 0.5)).toFixed(3)}) translate(${-ccx} ${-(CAL.y + 90)})`} opacity={p < 0.55 ? 1 : 1 - (p - 0.55) * 2.2}>
          {top}
        </g>
      ) : null}
      <path d={rrect(CAL.x, CAL.y, CAL.w, 110, 26)} fill={TERRA} />
      <T x={ccx} y={CAL.y + 72} size={38} ls={3}>ONE LAP OF THE MOON</T>
      {[CAL.x + 120, CAL.x + CAL.w - 120].map((x) => <rect key={x} x={x - 11} y={CAL.y - 28} width={22} height={56} rx={11} fill={INK} />)}
      <MoonBall x={mx} y={my} r={34} />
      {k > 0 ? (
        <g opacity={Math.min(1, k)}>
          <T x={ccx} y={CAL.y + CAL.h + 90} size={44} fill={OLIVE.dim}>TODAY 27 DAYS</T>
          <path d={`M ${ccx - 175} ${CAL.y + CAL.h + 76} H ${ccx - 175 + 350 * ease(t, F0 + N * P + 6, F0 + N * P + 18)}`} stroke={TERRA} strokeWidth={8} strokeLinecap="round" />
          <VPill x={ccx} y={CAL.y + CAL.h + 160} text="OUR SUM" />
        </g>
      ) : null}
    </VStage>
  );
};

// ------------------------------------------------------------------ line 35 · shot 3: a month would be a week and a half
const MonthGrid: VShot = ({ t, d, f }) => {
  const C = 112, G = 10, X0 = 540 - (7 * C + 6 * G) / 2, Y0 = 470;
  const cell = (i: number) => ({ x: X0 + (i % 7) * (C + G), y: Y0 + Math.floor(i / 7) * (C + G) });
  const dim = ease(t, 26, 44);
  const lightAt = (i: number) => 30 + i * 6;
  const n = 10;
  const cur = Math.max(0, Math.min(n - 1, Math.floor((t - 30) / 6)));
  const br = ease(t, 92, 110);
  return (
    <VStage fam="olive" t={t} d={d} f={f} push={0.03} cy={700}>
      <T x={540} y={400} size={46} ls={3}>{dim < 0.5 ? "TODAY'S MONTH" : "THE NEW MONTH"}</T>
      {Array.from({ length: 28 }, (_, i) => {
        const { x, y } = cell(i);
        const on = i < n ? ease(t, lightAt(i), lightAt(i) + 6) : 0;
        const ghost = i < 27 ? 1 - dim * 0.75 : 0.25;
        return (
          <g key={i}>
            <path d={rrect(x, y, C, C, 18)} fill={CHALK} fillOpacity={0.14 * ghost + 0.05} stroke={CHALK} strokeWidth={3} strokeOpacity={0.5 * ghost} />
            {on > 0 ? <path d={rrect(x + C / 2 - (C / 2) * on, y + C / 2 - (C / 2) * on, C * on, C * on, 18)} fill={TERRA} /> : null}
            {i < 27 && dim < 1 ? <g opacity={1 - dim}><MoonDisc x={x + C / 2} y={y + C / 2} r={30} phase={i / 27.3} /></g> : null}
            {i < n && on > 0.5 ? <MoonDisc x={x + C / 2} y={y + C / 2} r={30} phase={i / 9.7} /> : null}
          </g>
        );
      })}
      {t >= 30 && t < 30 + n * 6 + 6 ? (
        <circle cx={cell(cur).x + C / 2} cy={cell(cur).y + C / 2} r={C * 0.62} fill="none" stroke={CHALK} strokeWidth={5} opacity={0.8} />
      ) : null}
      {br > 0 ? (
        <g transform={`translate(540 ${Y0 + 4 * (C + G) + 80}) scale(${Math.min(1.05, pop(t, 92, 14)).toFixed(3)})`}>
          <T x={0} y={0} size={64}>A WEEK AND A HALF</T>
        </g>
      ) : null}
    </VStage>
  );
};

export const SHOTS_05: VShot[][] = [
  [OpenPull, OpenSame],
  [FillBalls, Balance, PullTwice],
  [MoonRace, Calendar, MonthGrid],
];
