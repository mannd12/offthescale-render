// ST01 act "l02" · 2 · A quarter bigger (sage → clay). Shot bodies keyed by storyboard id (2-01..2-14).
import React from "react";
import { ShotMap, ShotStage, ease, lin, mix, pop } from "../shot";
import { Lev } from "../../../lib/suppose/lev";
import { STPill } from "../../../lib/suppose/devices";
import { AIR, BRASS, CHALK, INK, LIME, OCEAN, TERRA } from "../../../lib/suppose/palette";
import { Bloom, GroundShadow } from "../../../lib/illustrated/light";
import { Cumulus } from "../../../lib/illustrated/props";
import { rnd } from "../../../lib/illustrated/motion";
import { rrect, smoothPath } from "../../../lib/illustrated/shapes";
import {
  Arrow, Backpack, BackpackStrap, C125, CH, CLAY, Grid, Puff, Room, SAGE, SageGround, TERRA_DARK, TERRA_LIT, Txt, leanPt, springPath,
} from "./l02-parts";

const OUT = SAGE.shadow; // Lev outline on light sage
const cloud = (x: number, y: number, w: number, h: number, f: number, seed: number, op = 1) => (
  <Cumulus x={x} y={y} w={w} h={h} fill={CHALK} shade="#C9DCC4" lit="#FFFFF4" seed={seed} frame={f} opacity={op} />
);
const wrapX = (x: number, w = 2400) => ((((x + 300) % w) + w) % w) - 300;

// ---------- 2-08 helpers: a ball rolls off a table; new fall vs today's (ghost)
const TABLE_Y = 430, FLOOR = 920, BALL_R = 30, EDGE = 760, ROLL_V = 12.6, X0 = 330;
const FALL = FLOOR - TABLE_Y; // centre drop, px
const TN = 26, TG = TN * Math.sqrt(1.25);
const ballAt = (tt: number, T: number): { x: number; y: number; landed: number; v: number } => {
  const tEdge = (EDGE - X0) / ROLL_V;
  if (tt < tEdge) return { x: X0 + ROLL_V * tt, y: TABLE_Y - BALL_R, landed: -1, v: 0 };
  const a = tt - tEdge;
  if (a < T) return { x: EDGE + ROLL_V * a, y: TABLE_Y - BALL_R + FALL * (a / T) ** 2, landed: -1, v: (2 * FALL * a) / (T * T) };
  const b = a - T; // after landing: a small bounce, then rolls on
  const bounce = Math.abs(Math.sin((Math.min(b, 24) / 24) * Math.PI)) * 60 * Math.exp(-b / 30);
  return { x: EDGE + ROLL_V * T + ROLL_V * 0.7 * b, y: FLOOR - BALL_R - bounce, landed: b, v: 0 };
};
const Ball: React.FC<{ x: number; y: number; rot: number; ghost?: boolean }> = ({ x, y, rot, ghost }) =>
  ghost ? (
    <circle cx={x} cy={y} r={BALL_R} fill="none" stroke={INK} strokeWidth={4} strokeDasharray="10 8" opacity={0.55} />
  ) : (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <circle r={BALL_R} fill={TERRA} />
      <path d={`M ${-BALL_R} 0 Q 0 -12 ${BALL_R} 0`} stroke={TERRA_DARK} strokeWidth={4} fill="none" />
      <circle cx={-9} cy={-10} r={9} fill={TERRA_LIT} opacity={0.7} />
    </g>
  );
const Table: React.FC = () => (
  <g>
    <GroundShadow x={480} y={FLOOR + 4} rx={320} ry={14} />
    <rect x={220} y={TABLE_Y + 26} width={22} height={FLOOR - TABLE_Y - 26} fill={TERRA_DARK} />
    <rect x={718} y={TABLE_Y + 26} width={22} height={FLOOR - TABLE_Y - 26} fill={TERRA_DARK} />
    <rect x={180} y={TABLE_Y} width={600} height={28} rx={10} fill={TERRA_DARK} />
    <rect x={180} y={TABLE_Y} width={600} height={9} rx={4} fill={TERRA_LIT} opacity={0.6} />
  </g>
);
const DropScene: React.FC<{ tt: number; arrows?: boolean }> = ({ tt, arrows }) => {
  const g = ballAt(tt, TG), n = ballAt(tt, TN);
  const tEdge = (EDGE - X0) / ROLL_V;
  const trail = (T: number) => {
    const span = Math.min(tt - tEdge, T);
    if (span <= 1) return "";
    const pts: [number, number][] = [];
    for (let i = 0; i <= 16; i++) {
      const a = span * (i / 16);
      pts.push([EDGE + ROLL_V * a, TABLE_Y - BALL_R + FALL * (a / T) ** 2]);
    }
    return smoothPath(pts);
  };
  return (
    <g>
      <Table />
      <path d={trail(TG)} stroke={INK} strokeWidth={4} strokeDasharray="4 12" strokeLinecap="round" fill="none" opacity={0.55} />
      <path d={trail(TN)} stroke={TERRA} strokeWidth={6} strokeDasharray="2 14" strokeLinecap="round" fill="none" />
      <Puff x={g.x} y={FLOOR} a={g.landed} k={0.8} color={SAGE.dim} />
      <Puff x={n.x} y={FLOOR} a={n.landed} k={1.4} color={CHALK} />
      <Ball x={g.x} y={g.y} rot={0} ghost />
      <Ball x={n.x} y={n.y} rot={(n.x - X0) * 1.9} />
      {arrows && g.v > 0 ? <Arrow x0={g.x - 70} y0={g.y - g.v * 4} x1={g.x - 70} y1={g.y} color={INK} w={7} op={0.5} dash="10 8" /> : null}
      {arrows && n.v > 0 ? <Arrow x0={n.x + 70} y0={n.y - n.v * 4} x1={n.x + 70} y1={n.y} color={TERRA_DARK} w={9} /> : null}
    </g>
  );
};

// ---------- 2-09 cup
const Cup: React.FC<{ x: number; y: number; rot: number; cracks?: number }> = ({ x, y, rot, cracks = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    {/* origin at the cup's bottom-right corner; the handle is on the left */}
    <path d="M -96 -74 q -36 4 -34 32 q 2 22 34 22" stroke={CHALK} strokeWidth={12} fill="none" strokeLinecap="round" />
    <path d={rrect(-96, -100, 90, 100, 14)} fill={CHALK} stroke={SAGE.shadow} strokeWidth={3} />
    <rect x={-96} y={-70} width={90} height={18} fill={TERRA} />
    <path d="M -86 -90 q 10 -6 30 -4" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.8} />
    {cracks > 0 ? (
      <path d="M -50 -100 L -58 -78 L -44 -62 L -60 -40 L -48 -20 L -56 0 M -58 -78 L -78 -70 M -44 -62 L -24 -54" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="220" strokeDashoffset={220 * (1 - cracks)} />
    ) : null}
  </g>
);
const cupFall = (t: number, t0: number, x0: number, shelfY: number) => {
  const tip = ease(t, t0, t0 + 16);
  if (t < t0 + 16) return { x: x0, y: shelfY, rot: 60 * tip, landed: -1 };
  const a = t - t0 - 16;
  const T = 21;
  if (a < T) return { x: x0 + 5 * a, y: shelfY + (FLOOR - shelfY) * (a / T) ** 2, rot: 60 + 30 * (a / T), landed: -1 };
  const b = a - T;
  return { x: x0 + 5 * T + 2 * Math.min(b, 6), y: FLOOR - Math.sin((Math.min(b, 8) / 8) * Math.PI) * 14, rot: 90, landed: b };
};

// ---------- 2-12 shelf
const SH_Y = 560, SH_X0 = 460, SH_X1 = 1460;
const sagAt = (t: number) => {
  let s = 0;
  [10, 36, 62, 88].forEach((t0) => {
    const a = t - (t0 + 12);
    if (a > 0) s += 9 * (1 - Math.exp(-a / 5) * Math.cos(a / 2.6));
  });
  return s;
};
const shelfY = (x: number, sag: number) => {
  const u = (x - (SH_X0 + SH_X1) / 2) / ((SH_X1 - SH_X0) / 2);
  return SH_Y + sag * (1 - u * u);
};

// ---------- 2-13 building
const Building: React.FC<{ cx: number; ground: number; k: number; w0: number; h0: number; seed: number }> = ({ cx, ground, k, w0, h0, seed }) => {
  const w = mix(w0, w0 * 1.5, k), h = mix(h0, h0 * 0.68, k), wall = mix(5, 16, k);
  const x = cx - w / 2, y = ground - h;
  const rows = Math.max(2, Math.round(h / 80)), cols = 3;
  const ww = (w - wall * 2 - 24) / cols - 14;
  const wh = (h - 30) / rows - 22;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={CLAY.mid} />
      <rect x={x} y={y} width={w * 0.38} height={h} fill={CLAY.far} opacity={0.45} />
      {Array.from({ length: rows * cols }, (_, i) => {
        const r = Math.floor(i / cols), c = i % cols;
        const lit = rnd(seed * 50 + i) > 0.35;
        return <rect key={i} x={x + wall + 12 + c * (ww + 14)} y={y + 20 + r * (wh + 22)} width={ww} height={wh} rx={5} fill={lit ? CLAY.light : CLAY.near} opacity={lit ? 0.9 : 0.6} />;
      })}
      {k > 0.45 ? (
        <path d={`M ${x + wall} ${ground} L ${x + w - wall} ${y + 10} M ${x + w - wall} ${ground} L ${x + wall} ${y + 10}`} stroke={CLAY.near} strokeWidth={mix(0, 9, lin(k, 0.45, 1))} opacity={0.55} strokeLinecap="round" />
      ) : null}
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={CLAY.near} strokeWidth={wall} />
      <path d={rrect(x - 10, y - 12, w + 20, 14, 5)} fill={CLAY.near} />
    </g>
  );
};

export const SHOTS_L02: ShotMap = {
  // A quarter bigger means a quarter more pull. (playground at noon; swings sway)
  "2-01": ({ t, f }) => {
    const ground = 860;
    const swing = (cx: number, ph: number, amp: number) => {
      const a = amp * Math.sin(f / 10.5 + ph);
      const L = 300, top = 470;
      const r = (a * Math.PI) / 180;
      const sx = cx + Math.sin(r) * L, sy = top + Math.cos(r) * L;
      const c = Math.cos(r) * 40, s = Math.sin(r) * 40;
      return (
        <g key={cx}>
          <path d={`M ${cx - 30} ${top} L ${sx - c} ${sy + s} M ${cx + 30} ${top} L ${sx + c} ${sy - s}`} stroke={INK} strokeWidth={4} opacity={0.75} />
          <g transform={`translate(${sx} ${sy}) rotate(${-a})`}>
            <rect x={-52} y={-6} width={104} height={16} rx={7} fill={TERRA_DARK} />
          </g>
        </g>
      );
    };
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C125}>
        <Bloom x={360} y={200} r={380} color={SAGE.light} strength={0.8} spread={0.5} />
        <circle cx={360} cy={200} r={70} fill="#FFFBE6" />
        {cloud(wrapX(700 + f * 0.8), 230, 300, 110, f, 3)}
        {cloud(wrapX(1300 + f * 0.6), 380, 220, 80, f, 8, 0.9)}
        <SageGround y={ground} />
        {/* climbing frame */}
        <GroundShadow x={465} y={ground} rx={200} ry={14} />
        <g stroke={TERRA_LIT} strokeWidth={12} strokeLinecap="round" fill="none">
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${300 + i * 110} ${ground - 10} V ${ground - 330}`} />)}
          {[0, 1, 2].map((j) => <path key={j} d={`M 300 ${ground - 110 - j * 110} H 630`} />)}
        </g>
        {/* swing set */}
        <GroundShadow x={1255} y={ground} rx={260} ry={14} />
        {swing(1170, 0, 22)}
        {swing(1340, 1.9, 17)}
        <g stroke={TERRA} strokeWidth={18} strokeLinecap="round" fill="none">
          <path d={`M 1010 ${ground} L 1060 465 L 1110 ${ground} M 1400 ${ground} L 1450 465 L 1500 ${ground}`} />
          <path d="M 1050 465 H 1460" />
        </g>
        <Lev x={820} y={ground - 6} h={112} frame={f} eyes="happy" tilt={6} outline={OUT} wind={0.3} seed={2} />
      </ShotStage>
    );
  },

  // Your legs push with the same strength, but now they're lifting more weight. (leg-as-spring)
  "2-02": ({ t, f }) => {
    const floor = 860;
    const panel = (cx: number, extra: number, label: string, here: boolean) => {
      const osc = Math.sin(f / 6) * 16;
      const c = 40 + extra + osc;
      const yTop = floor - (330 - c);
      const wArrow = 140 * (1 + 0.25 * (extra / 50));
      return (
        <g key={cx}>
          <rect x={cx - 200} y={floor} width={400} height={18} rx={8} fill={INK} opacity={0.8} />
          <path d={springPath(cx, yTop, floor, 90, 7)} stroke={SAGE.near} strokeWidth={10} strokeLinejoin="round" strokeLinecap="round" fill="none" />
          <path d={rrect(cx - 120, yTop - 120, 240, 120, 22)} fill={TERRA} />
          <path d={rrect(cx - 120, yTop - 120, 240, 34, 18)} fill={TERRA_LIT} opacity={0.5} />
          <Txt x={cx} y={yTop - 48} anchor="middle" size={34} fill={CHALK} ls={2}>WEIGHT</Txt>
          <Arrow x0={cx - 170} y0={yTop - 130} x1={cx - 170} y1={yTop - 130 + wArrow} color={TERRA_DARK} w={14} head={34} />
          <Arrow x0={cx + 170} y0={floor - 20} x1={cx + 170} y1={floor - 160} color={OCEAN} w={14} head={34} />
          <Txt x={cx + 170} y={floor - 186} anchor="middle" size={24} fill={OCEAN} ls={2}>PUSH</Txt>
          <Txt x={cx} y={floor + 80} anchor="middle" size={38} fill={here ? TERRA_DARK : INK} ls={3}>{label}</Txt>
        </g>
      );
    };
    const grow = ease(t, 30, 90) * 50;
    const cmp = ease(t, 110, 135);
    const leftTop = floor - (330 - 40) - 120;
    return (
      <ShotStage fam="chalk" t={t} f={f}>
        <Grid color={CH.far} />
        <Txt x={120} y={150} size={68} fill={INK}>Same push, more weight</Txt>
        {panel(600, 0, "TODAY", false)}
        {panel(1300, grow, "A QUARTER MORE PULL", true)}
        {cmp > 0 ? <path d={`M 470 ${leftTop} H ${mix(470, 1440, cmp)}`} stroke={INK} strokeWidth={4} strokeDasharray="14 10" opacity={0.6} /> : null}
      </ShotStage>
    );
  },

  // Think of jumping while wearing a backpack full of books. (low hop)
  "2-03": ({ t, f }) => {
    const ground = 980, x = 960, h = 380;
    const p = (t % 40) / 40;
    const q = p < 0.25 ? 0 : (p - 0.25) / 0.75;
    const lift = 4 * 48 * q * (1 - q);
    const sq = p < 0.25 ? 1 - Math.sin((p / 0.25) * Math.PI) * 0.1 : 1;
    const lean = 6;
    const y = ground - lift;
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C125}>
        <Bloom x={420} y={240} r={420} color={SAGE.light} strength={0.6} />
        {cloud(wrapX(400 + f * 0.7), 260, 280, 100, f, 5)}
        <SageGround y={ground} seed={2} />
        <Arrow x0={x - 110} y0={y - 110} x1={x - 110} y1={y - 20 + 10 * Math.sin(t / 4)} color={TERRA_DARK} w={12} head={30} op={0.85} />
        <GroundShadow x={x} y={ground + 2} rx={70 - lift * 0.5} ry={10} opacity={0.3} />
        <g transform={`translate(${x} ${ground}) scale(${2 - sq} ${sq}) translate(${-x} ${-ground})`}>
          <Backpack x={x} y={y} h={h} lean={lean} />
          <Lev x={x} y={y} h={h} frame={f} eyes="squint" lean={lean} outline={OUT} wind={lift > 5 ? 0.8 : 0.2} hands={{ front: [12, -94], back: [-14, -94] }} />
          <BackpackStrap x={x} y={y} h={h} lean={lean} />
        </g>
      </ShotStage>
    );
  },

  // You can still do it. You just don't get as high, and you get tired sooner. (puffing)
  "2-04": ({ t, f }) => {
    const ground = 990, x = 860, h = 360, lean = 16;
    const s = h / 170;
    const heave = 1 + Math.sin(t / 4.5) * 0.018;
    const [mx, my] = leanPt(40, -138, lean);
    const mouth: [number, number] = [x + mx * s, ground + my * s];
    return (
      <ShotStage fam="sage" t={t} f={f}>
        <Bloom x={1500} y={260} r={460} color={SAGE.light} strength={0.6} />
        {cloud(wrapX(1100 + f * 0.6), 220, 300, 110, f, 6)}
        <SageGround y={ground - 80} seed={3} />
        <g stroke={TERRA_LIT} strokeWidth={14} strokeLinecap="round" opacity={0.45}>
          {[0, 1, 2].map((i) => <path key={i} d={`M ${1300 + i * 130} ${ground - 90} V ${ground - 420}`} />)}
          {[0, 1].map((j) => <path key={j} d={`M 1300 ${ground - 200 - j * 120} H 1560`} />)}
        </g>
        <g transform={`translate(${x} ${ground}) scale(1 ${heave}) translate(${-x} ${-ground})`}>
          <Lev x={x} y={ground} h={h} frame={f} eyes={Math.floor(t / 26) % 2 ? "closed" : "squint"} lean={lean} outline={OUT} wind={0.2} hands={{ front: [34, -56], back: [10, -58] }} tilt={4} />
        </g>
        {Array.from({ length: 7 }, (_, k) => {
          const a = t - k * 24 - 4;
          if (a < 0 || a > 56) return null;
          const p = a / 56;
          const cx = mouth[0] + 24 + a * 2.4, cy = mouth[1] - a * 2.2;
          const r = 26 + 60 * p;
          return (
            <g key={k} opacity={(1 - p * p) * 0.95}>
              <circle cx={cx} cy={cy} r={r} fill={CHALK} />
              <circle cx={cx + r * 0.8} cy={cy + r * 0.2} r={r * 0.7} fill={CHALK} />
              <circle cx={cx - r * 0.6} cy={cy + r * 0.35} r={r * 0.6} fill={CHALK} />
            </g>
          );
        })}
      </ShotStage>
    );
  },

  // If you can jump fifty centimetres today, here you'd get about forty. (measuring stick)
  "2-05": ({ t, f }) => {
    const ground = 940, x = 860, h = 300, cm = 4.6;
    const hop = (t0: number) => {
      const a = t - t0;
      if (a < 0) return { lift: 0, sq: 1 };
      if (a < 14) return { lift: 0, sq: 1 - Math.sin((a / 14) * Math.PI) * 0.12 };
      const q = (a - 14) / 36;
      if (q < 1) return { lift: 40 * cm * 4 * q * (1 - q), sq: 1 };
      return { lift: 0, sq: q < 1.3 ? 1 - Math.sin(((q - 1) / 0.3) * Math.PI) * 0.1 : 1 };
    };
    const j = t < 82 ? hop(8) : hop(92);
    const peakSeen = t >= 40;
    const y = ground - j.lift;
    const y50 = ground - 50 * cm, y40 = ground - 40 * cm;
    return (
      <ShotStage fam="sage" t={t} f={f}>
        <Bloom x={1500} y={240} r={420} color={SAGE.light} strength={0.6} />
        <SageGround y={ground} seed={4} />
        <path d={rrect(1120, ground - 64 * cm, 56, 64 * cm + 6, 10)} fill="#F6E7B8" stroke={TERRA_DARK} strokeWidth={4} />
        {Array.from({ length: 13 }, (_, i) => (
          <path key={i} d={`M 1120 ${ground - i * 5 * cm} h ${i % 2 ? 18 : 34}`} stroke={INK} strokeWidth={3} />
        ))}
        {/* ghost: today's 50 cm */}
        <path d={`M 600 ${y50} H 1176`} stroke={INK} strokeWidth={4} strokeDasharray="14 10" opacity={0.5} />
        <Txt x={580} y={y50 + 12} size={36} fill={SAGE.dim} anchor="end">50 cm today</Txt>
        <g opacity={0.22}>
          <Lev x={x - 170} y={y50} h={h} frame={f} eyes="open" outline={INK} arms={false} seed={5} />
        </g>
        {peakSeen ? (
          <g>
            <path d={`M 700 ${y40} H ${mix(700, 1176, ease(t, 40, 50))}`} stroke={LIME} strokeWidth={8} strokeLinecap="round" />
            <g transform={`translate(1200 ${y40}) scale(${pop(t, 44, 12)})`}>
              <Txt x={0} y={14} size={48} fill={SAGE.near}>40 cm here</Txt>
            </g>
          </g>
        ) : null}
        <GroundShadow x={x} y={ground + 2} rx={80 - j.lift * 0.2} ry={10} opacity={0.3} />
        <g transform={`translate(${x} ${ground}) scale(${2 - j.sq} ${j.sq}) translate(${-x} ${-ground})`}>
          <Lev x={x} y={y} h={h} frame={f} eyes={j.lift > 10 ? "wide" : "squint"} outline={OUT} wind={j.lift > 10 ? 0.9 : 0.2} pose={j.lift > 10 ? "shrug" : "stand"} />
        </g>
        <Txt x={120} y={160} size={84} fill={INK}>50 → 40 cm</Txt>
        <STPill x={124} y={222} text="MODEL" dark={false} />
      </ShotStage>
    );
  },

  // Basketball hoops would feel taller.
  "2-06": ({ t, f }) => {
    const ground = 900, hx = 1280;
    const rise = 140 * ease(t, 8, 60);
    const boardY = 330 - rise;
    const lx = 720, lh = 120;
    let bx = lx + 40, by = ground - 30;
    if (t < 64) {
      const ph = (t % 18) / 18;
      by = ground - 22 - 62 * Math.abs(Math.cos(ph * Math.PI));
    } else {
      const a = (t - 64) / 40;
      bx = mix(lx + 30, hx - 160, Math.min(1, a));
      by = Math.min(ground - 22, ground - 150 - 440 * a + 560 * a * a);
    }
    const rimY = boardY + 120;
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C125}>
        <Bloom x={400} y={220} r={400} color={SAGE.light} strength={0.6} />
        {cloud(wrapX(800 + f * 0.7), 220, 260, 100, f, 4)}
        <SageGround y={ground} seed={5} />
        <g opacity={0.5} fill="none" stroke={INK} strokeWidth={4} strokeDasharray="12 10">
          <rect x={hx - 40} y={330} width={200} height={140} rx={10} />
          <ellipse cx={hx - 70} cy={450} rx={58} ry={12} />
        </g>
        <GroundShadow x={hx + 60} y={ground} rx={120} ry={12} />
        <rect x={hx + 46} y={boardY + 60} width={26} height={ground - boardY - 60} fill={SAGE.shadow} />
        <path d={rrect(hx - 40, boardY, 200, 140, 12)} fill={CHALK} stroke={SAGE.shadow} strokeWidth={5} />
        <rect x={hx + 10} y={boardY + 50} width={80} height={60} rx={6} fill="none" stroke={TERRA} strokeWidth={5} />
        <g stroke={CHALK} strokeWidth={3} opacity={0.9}>
          {[-50, -30, -10, 10, 30].map((dx, i) => <path key={i} d={`M ${hx - 70 + dx} ${rimY + 8} L ${hx - 70 + dx * 0.6} ${rimY + 74}`} />)}
        </g>
        <ellipse cx={hx - 70} cy={rimY} rx={60} ry={13} fill="none" stroke={TERRA_DARK} strokeWidth={8} />
        <Arrow x0={hx + 220} y0={470} x1={hx + 220} y1={460 - rise} color={SAGE.near} w={10} op={ease(t, 8, 20)} />
        <Lev x={lx} y={ground - 4} h={lh} frame={f} eyes="up" tilt={-10} outline={OUT} seed={3} hands={t >= 64 ? { front: [40, -150], back: [30, -140] } : { front: [40, -66] }} />
        <circle cx={bx} cy={by} r={22} fill={TERRA} />
        <path d={`M ${bx - 22} ${by} H ${bx + 22} M ${bx} ${by - 22} V ${by + 22}`} stroke={TERRA_DARK} strokeWidth={3} />
      </ShotStage>
    );
  },

  // Every staircase would feel like one more flight.
  "2-07": ({ t, f }) => {
    const ground = 960, sw = 70, sh = 44;
    const landX = 200 + 7 * sw, landY = ground - 7 * sh;
    const extra = Array.from({ length: 9 }, (_, i) => ({ x: landX + 150 + i * sw, y: landY - (i + 1) * sh }));
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C125}>
        <Room floor={ground} />
        {Array.from({ length: 7 }, (_, i) => {
          const sx = 200 + i * sw, sy = ground - (i + 1) * sh;
          return (
            <g key={i}>
              <rect x={sx} y={sy} width={sw + 1} height={ground - sy} fill={SAGE.mid} />
              <path d={`M ${sx} ${sy} h ${sw}`} stroke={SAGE.bounce} strokeWidth={6} />
            </g>
          );
        })}
        <rect x={landX} y={landY} width={150} height={sh * 7} fill={SAGE.mid} />
        <path d={`M ${landX} ${landY} h 150`} stroke={SAGE.bounce} strokeWidth={6} />
        {extra.map((s, i) => {
          const k = pop(t, 10 + i * 9, 12);
          if (k <= 0) return null;
          const hgt = ground - s.y;
          return (
            <g key={i} transform={`translate(${s.x} ${ground}) scale(1 ${k}) translate(${-s.x} ${-ground})`}>
              <rect x={s.x} y={s.y} width={sw + 1} height={hgt} fill={TERRA} opacity={0.88} />
              <path d={`M ${s.x} ${s.y} h ${sw}`} stroke={TERRA_LIT} strokeWidth={6} />
              <rect x={s.x + sw - 6} y={s.y} width={6} height={hgt} fill={TERRA_DARK} opacity={0.35} />
            </g>
          );
        })}
        <Lev x={170} y={ground - 2} h={120} frame={f} eyes="up" tilt={-14} outline={OUT} pose={t > 88 ? "shrug" : "stand"} seed={4} />
      </ShotStage>
    );
  },

  // What goes up comes down harder. (ball off a table, two drop lines; 2nd beat: slowed replay with speed arrows)
  "2-08": ({ t, f }) => {
    const beatB = t >= 140;
    const tt = beatB ? 30 + (t - 140) / 2.6 : t;
    const zoom = beatB ? 1.4 : 1;
    const fx = 1000, fy = 760;
    const showTags = beatB ? ballAt(tt, TG).landed > 2 : t > 66;
    return (
      <ShotStage fam="sage" t={t} f={f}>
        <Room floor={FLOOR} />
        <g transform={`translate(${fx} ${fy}) scale(${zoom}) translate(${-fx} ${-fy})`}>
          <DropScene tt={tt} arrows={beatB} />
        </g>
        {showTags ? (
          <g>
            <Txt x={1440} y={300} size={36} fill={SAGE.dim} ls={2}>- - TODAY</Txt>
            <Txt x={1440} y={350} size={36} fill={TERRA_DARK} ls={2}>● HERE</Txt>
          </g>
        ) : null}
        {beatB ? <Txt x={120} y={150} size={40} fill={SAGE.dim} ls={3}>SLOWED DOWN</Txt> : null}
      </ShotStage>
    );
  },

  // Cups break more easily. (a cup tips off a shelf; cracks on landing; a second cup follows)
  "2-09": ({ t, f }) => {
    const shelf = 400;
    const c1 = cupFall(t, 14, 860, shelf);
    const c2 = cupFall(t, 104, 720, shelf);
    const cupDraw = (c: ReturnType<typeof cupFall>, k: number) => (
      <g key={k}>
        {c.landed >= 0 ? <Puff x={c.x - 50} y={FLOOR} a={c.landed} k={0.8} /> : null}
        <Cup x={c.x} y={c.y} rot={c.rot} cracks={c.landed >= 0 ? ease(c.landed, 0, 22) : 0} />
        {c.landed > 0 ? (
          <path d={rrect(c.x + 20 + Math.min(c.landed, 18) * 4, FLOOR - 16 - Math.sin((Math.min(c.landed, 18) / 18) * Math.PI) * 50, 22, 14, 4)} fill={CHALK} stroke={SAGE.shadow} strokeWidth={2} />
        ) : null}
      </g>
    );
    return (
      <ShotStage fam="sage" t={t} f={f}>
        <Room floor={FLOOR} />
        <g transform={`translate(500 ${FLOOR}) scale(1.3) translate(-500 ${-FLOOR})`}>
        <path d={`M 400 ${shelf + 24} l 0 60 l 60 -60 Z M 820 ${shelf + 24} l 0 60 l -60 -60 Z`} fill={TERRA_DARK} opacity={0.8} />
        <rect x={360} y={shelf} width={520} height={24} rx={8} fill={TERRA_DARK} />
        <Cup x={560} y={shelf} rot={0} />
        {cupDraw(c2, 2)}
        {cupDraw(c1, 1)}
        </g>
      </ShotStage>
    );
  },

  // A planet's pull touches everything you drop. (keys, a book, an apple; speed arrows; today's dashed)
  "2-10": ({ t, f }) => {
    const top = 160, P = 54, T = 36;
    const a = t % P;
    const fall = Math.min(a, T) / T;
    const y = top + (FLOOR - 80 - top) * fall * fall;
    const landed = a - T;
    const v = a < T ? fall : 0;
    const items = [
      { x: 560, draw: (yy: number) => (
        <g transform={`translate(560 ${yy}) rotate(${a * 6})`}>
          <circle r={26} fill="none" stroke={BRASS} strokeWidth={8} />
          <path d="M 20 14 L 70 40 M 52 31 l 8 -12 M 64 37 l 6 -10" stroke={BRASS} strokeWidth={9} strokeLinecap="round" />
          <path d="M -20 16 L -50 64" stroke={OCEAN} strokeWidth={9} strokeLinecap="round" />
        </g>) },
      { x: 960, draw: (yy: number) => (
        <g transform={`translate(960 ${yy}) rotate(${-a * 2})`}>
          <path d={rrect(-80, -56, 160, 112, 10)} fill={OCEAN} />
          <rect x={-70} y={-46} width={18} height={92} fill="#2E6F8A" />
          <rect x={72} y={-48} width={8} height={96} fill={CHALK} />
        </g>) },
      { x: 1360, draw: (yy: number) => (
        <g transform={`translate(1360 ${yy}) rotate(${a * 3})`}>
          <circle r={48} fill={TERRA} />
          <circle cx={-16} cy={-16} r={14} fill={TERRA_LIT} opacity={0.7} />
          <path d="M 0 -46 q 4 -18 14 -24" stroke={SAGE.shadow} strokeWidth={7} strokeLinecap="round" fill="none" />
          <path d="M 6 -56 q 22 -14 34 0 q -18 10 -34 0" fill={SAGE.near} />
        </g>) },
    ];
    return (
      <ShotStage fam="sage" t={t} f={f}>
        <Room floor={FLOOR} />
        {items.map((it, i) => (
          <g key={i}>
            <GroundShadow x={it.x} y={FLOOR + 4} rx={40 + 50 * fall} ry={10} opacity={0.25} />
            {v > 0.1 ? (
              <>
                <Arrow x0={it.x - 120} y0={y - (220 * v) / Math.sqrt(1.25)} x1={it.x - 120} y1={y} color={INK} w={6} head={20} dash="10 8" op={0.45} />
                <Arrow x0={it.x + 120} y0={y - 220 * v} x1={it.x + 120} y1={y} color={TERRA_DARK} w={10} head={26} />
              </>
            ) : null}
            <Puff x={it.x} y={FLOOR} a={landed} k={0.9} />
            {it.draw(landed > 0 ? FLOOR - 80 - Math.sin((Math.min(landed, 10) / 10) * Math.PI) * 24 : y)}
          </g>
        ))}
      </ShotStage>
    );
  },

  // Every beam in every building, every bridge… a quarter more weight. (clay cutaway; beams glow as the load climbs)
  "2-11": ({ t, f }) => {
    const ground = 900;
    const k = ease(t, 16, 150);
    const pulse = 0.55 + 0.45 * Math.sin(f / 5);
    const glow = (0.25 + 0.75 * k) * (0.7 + 0.3 * pulse);
    const press = Math.sin(f / 4) * 5;
    const L = 46 + 54 * k;
    const floors = [430, 520, 610, 700, 790];
    const bow = 16 * ease(t, 100, 170);
    const second = ease(t, 105, 125);
    return (
      <ShotStage fam="clay" t={t} f={f} counter={C125}>
        <Bloom x={960} y={ground} r={700} color={CLAY.light} strength={0.4} />
        <path d={smoothPath([[-60, 760], [300, 700], [700, 740], [1100, 680], [1500, 730], [1990, 690]]) + " L 1990 1100 L -60 1100 Z"} fill={CLAY.far} opacity={0.6} />
        <rect x={240} y={330} width={500} height={ground - 330} fill={CLAY.near} opacity={0.55} />
        <rect x={240} y={330} width={500} height={ground - 330} fill="none" stroke={CLAY.near} strokeWidth={14} />
        {floors.map((fy, i) => (
          <g key={i}>
            <rect x={240} y={fy} width={500} height={16} fill={CLAY.near} />
            <rect x={246} y={fy + 3} width={488} height={10} rx={5} fill={LIME} opacity={glow * 0.9} />
            {[320, 480, 640].map((ax, j) => (
              <g key={j}>
                <Arrow x0={ax} y0={fy - 10 - L * 0.7 + press} x1={ax} y1={fy - 4 + press} color={TERRA} w={9} head={20} />
                {second > 0 ? <Arrow x0={ax + 70} y0={fy - 10 - L * 0.7 * second + press} x1={ax + 70} y1={fy - 4 + press} color={TERRA} w={9} head={20} op={second} /> : null}
              </g>
            ))}
          </g>
        ))}
        <rect x={980} y={ground - 260} width={50} height={260} fill={CLAY.near} />
        <rect x={1620} y={ground - 260} width={50} height={260} fill={CLAY.near} />
        <path d={`M 1030 ${ground - 244} Q 1325 ${ground - 420 + bow} 1620 ${ground - 244}`} stroke={CLAY.near} strokeWidth={14} fill="none" />
        <path d={`M 900 ${ground - 270} Q 1325 ${ground - 270 + bow * 2} 1750 ${ground - 270} L 1750 ${ground - 244} Q 1325 ${ground - 244 + bow * 2} 900 ${ground - 244} Z`} fill={CLAY.near} />
        <path d={`M 906 ${ground - 258} Q 1325 ${ground - 258 + bow * 2} 1744 ${ground - 258}`} stroke={LIME} strokeWidth={9} strokeLinecap="round" fill="none" opacity={glow * 0.9} />
        {[1080, 1200, 1325, 1450, 1570].map((ax, j) => {
          const yb = ground - 274 + bow * 2 * (1 - ((ax - 1325) / 425) ** 2);
          return (
            <g key={j}>
              <Arrow x0={ax} y0={yb - 16 - L + press} x1={ax} y1={yb - 4 + press} color={TERRA} w={10} head={22} />
              {second > 0 ? <Arrow x0={ax + 60} y0={yb - 16 - L * second + press} x1={ax + 60} y1={yb - 4 + press} color={TERRA} w={10} head={22} op={second} /> : null}
            </g>
          );
        })}
        <rect x={-60} y={ground} width={2040} height={200} fill={CLAY.near} />
        <g transform={`translate(960 200) scale(${pop(t, 30, 14)})`}>
          <rect x={-250} y={-60} width={500} height={110} rx={26} fill={INK} opacity={0.75} />
          <Txt x={0} y={22} anchor="middle" size={66} fill={CHALK}>WEIGHT +25 %</Txt>
        </g>
      </ShotStage>
    );
  },

  // …every shelf on your wall. (a shelf of books sags as more land on it)
  "2-12": ({ t, f }) => {
    const sag = sagAt(t);
    const plank = (dy: number) => `M ${SH_X0} ${SH_Y + dy} Q ${(SH_X0 + SH_X1) / 2} ${SH_Y + dy + sag * 2} ${SH_X1} ${SH_Y + dy}`;
    const books: [number, number][] = [[520, 0], [570, 1], [615, 2], [660, 0], [705, 1], [1230, 2], [1275, 0], [1320, 1], [1370, 2]];
    const cols = [OCEAN, TERRA, BRASS];
    const drops = [10, 36, 62, 88];
    return (
      <ShotStage fam="sage" t={t} f={f}>
        <Room floor={1000} />
        <path d={`M ${SH_X0 + 30} ${SH_Y + 12} l 0 100 l 70 -100 Z M ${SH_X1 - 30} ${SH_Y + 12} l 0 100 l -70 -100 Z`} fill={TERRA_DARK} />
        {books.map(([bx, c], i) => {
          const by = shelfY(bx, sag) - 12;
          const slope = (Math.atan2(shelfY(bx + 5, sag) - shelfY(bx - 5, sag), 10) * 180) / Math.PI;
          const hh = 150 + (i % 3) * 22;
          return <rect key={i} x={bx - 20} y={by - hh} width={40} height={hh} rx={5} fill={cols[c]} stroke={INK} strokeWidth={2} transform={`rotate(${slope} ${bx} ${by})`} />;
        })}
        {drops.map((t0, i) => {
          const a = t - t0;
          if (a < 0) return null;
          const cx = 960 + (i % 2 ? 30 : -24);
          const restY = shelfY(cx, sag) - 33 - i * 40;
          const yy = a < 12 ? mix(40, restY, (a / 12) ** 2) : restY;
          return (
            <g key={i}>
              <path d={rrect(cx - 130, yy - 20, 260, 40, 6)} fill={cols[i % 3]} stroke={INK} strokeWidth={2} />
              <rect x={cx + 112} y={yy - 16} width={12} height={32} fill={CHALK} />
            </g>
          );
        })}
        <path d={plank(0)} stroke={TERRA_DARK} strokeWidth={26} fill="none" strokeLinecap="round" />
        <path d={plank(-8)} stroke={TERRA_LIT} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.6} />
        <path d={`M ${SH_X0 - 40} ${SH_Y} H ${SH_X1 + 40}`} stroke={INK} strokeWidth={3} strokeDasharray="12 10" opacity={0.4} />
      </ShotStage>
    );
  },

  // Builders would make everything a little thicker, a little stronger, a little lower.
  "2-13": ({ t, f }) => {
    const ground = 900;
    const k = ease(t, 20, 160);
    const words = ["thicker", "stronger", "lower"];
    return (
      <ShotStage fam="clay" t={t} f={f} counter={C125}>
        <Bloom x={960} y={ground} r={760} color={CLAY.light} strength={0.45} />
        {[[520, 200, 520], [960, 230, 600], [1400, 190, 480]].map(([cx, w0, h0], i) => (
          <g key={i}>
            <Building cx={cx} ground={ground} k={k} w0={w0} h0={h0} seed={i + 1} />
            <rect x={cx - w0 / 2} y={ground - h0} width={w0} height={h0} fill="none" stroke={CHALK} strokeWidth={4} strokeDasharray="14 10" opacity={0.6 * ease(t, 20, 40)} />
          </g>
        ))}
        <rect x={-60} y={ground} width={2040} height={200} fill={CLAY.near} />
        <Txt x={120} y={150} size={56} fill={CHALK}>
          {words.map((w, i) => (
            <tspan key={i} opacity={ease(t, 30 + i * 40, 44 + i * 40)}>{(i ? " · " : "") + "a little " + w}</tspan>
          ))}
        </Txt>
      </ShotStage>
    );
  },

  // But the biggest change isn't on the ground. It's in the air above it. (camera tilts up)
  "2-14": ({ t, f }) => {
    const pan = 820 * ease(t, 12, 140);
    const ground = 900;
    const dots: React.ReactNode[] = [];
    for (let i = 0; i < 520; i++) {
      const u = Math.max(0.002, rnd(i * 7 + 1));
      const z = -Math.log(u) * 340;
      const yy = ground - 80 - z;
      if (yy < -900) continue;
      dots.push(<circle key={i} cx={rnd(i * 13 + 2) * 1920 + Math.sin(f / 9 + i) * 3} cy={yy} r={4} fill={AIR} opacity={0.75} />);
    }
    return (
      <ShotStage fam="sage" t={t} f={f} sky={false}>
        <g transform={`translate(0 ${pan})`}>
          <rect x={-200} y={-1100} width={2320} height={2400} fill={SAGE.sky[2]} />
          <Bloom x={960} y={-300} r={1400} color="#7FB3C2" strength={0.55} spread={0.55} />
          <rect x={-200} y={-1100} width={2320} height={2400} fill={SAGE.sky[0]} opacity={0.25} />
          {dots}
          {cloud(wrapX(300 + f * 3.2), 380, 320, 110, f, 2)}
          {cloud(wrapX(1300 + f * 2.6), 80, 360, 120, f, 7)}
          {cloud(wrapX(800 + f * 3.8), -260, 300, 100, f, 9, 0.9)}
          {cloud(wrapX(1600 + f * 2.2), -560, 260, 90, f, 11, 0.8)}
          <SageGround y={ground} seed={6} />
          <Lev x={960} y={ground - 6} h={120} frame={f} eyes="up" tilt={-16} outline={OUT} wind={0.6} />
        </g>
        <g opacity={ease(t, 110, 135)}>
          <Txt x={960} y={380} anchor="middle" size={92} fill={INK}>the air above</Txt>
        </g>
      </ShotStage>
    );
  },
};
