// ST01 act "cold": shot bodies keyed by storyboard id (see ../shotlist.ts and the storyboard). C-01..C-15.
import React from "react";
import { ShotMap, ShotStage, ease, lin, mix, pop } from "../shot";
import { Bloom, GroundShadow } from "../../../lib/illustrated/light";
import { HazeBand } from "../../../lib/illustrated/light";
import { smoothPath } from "../../../lib/illustrated/shapes";
import { rnd } from "../../../lib/illustrated/motion";
import { mixHex } from "../../../lib/illustrated/palette";
import { AIR, CHALK, INK, LIME, ST_FONT, SUPPOSE, TERRA } from "../../../lib/suppose/palette";
import { Lev } from "../../../lib/suppose/lev";
import { Lever, leverTip, STPill } from "../../../lib/suppose/devices";
import { Earth } from "../../../lib/suppose/frames";
import {
  Ball, BigLadder, ChapterBeat, cubeEdges, DownArrow, drawSegs, Ledge, partial, PopCounter, Pt, Rocket, rungY, SugarCube, CUBE_DX, CUBE_DY,
} from "./cold-parts";

const MOSS = SUPPOSE.moss;
const CH = SUPPOSE.chalk;
const CLAY = SUPPOSE.clay;
const OLIVE = SUPPOSE.olive;

// ------------------------------------------------------------------ the pull (C-01, C-02): key art I geometry
const GROUND = 880;
const PIV: Pt = [1350, GROUND];
const LEN = 240;
const LEVH = 210;
const LS = LEVH / 170;
/** Lev hanging on / holding the lever knob: hands stay at most 182 units up, so Lev hangs when the knob is high */
const levOnLever = (angle: number) => {
  const tip = leverTip(PIV[0], PIV[1], LEN, angle);
  const feet = Math.min(GROUND - 4, tip[1] + 182 * LS);
  const hand: Pt = [48, (tip[1] - feet) / LS];
  return { x: tip[0] - 48 * LS, y: feet, hand };
};
const overshoot = (k: number) => (k <= 0 ? 0 : k >= 1 ? 1 : 1 - Math.pow(1 - k, 3) + Math.sin(k * Math.PI) * 0.06);

const PaperGrid: React.FC<{ opacity?: number }> = ({ opacity = 0.45 }) => (
  <g stroke={CH.far} strokeWidth={1.4} opacity={opacity}>
    {Array.from({ length: 37 }, (_, i) => <path key={`v${i}`} d={`M ${i * 60 - 120} -200 V 1300`} />)}
    {Array.from({ length: 25 }, (_, i) => <path key={`h${i}`} d={`M -200 ${i * 60 - 120} H 2120`} />)}
  </g>
);

// ------------------------------------------------------------------ C-05 / C-06: small balls pour into a ball twice as wide
const BIG = { cx: 1240, cy: 600, r: 200 };
const MR = 16;
const REST: Pt[] = (() => {
  const out: Pt[] = [];
  const R = BIG.r - MR - 2;
  let row = 0;
  for (let y = BIG.cy + R; y > BIG.cy - R; y -= MR * 1.73) {
    const half = Math.sqrt(Math.max(0, R * R - (y - BIG.cy) ** 2));
    const off = row % 2 ? MR : 0;
    for (let x = BIG.cx - half + off; x <= BIG.cx + half; x += MR * 2) out.push([x, y]);
    row++;
  }
  return out.sort((a, b) => b[1] - a[1] || Math.abs(a[0] - BIG.cx) - Math.abs(b[0] - BIG.cx));
})();
const POUR_END = 150;
const SPAWN = (POUR_END - 24) / REST.length;
const SPOUT: Pt = [BIG.cx + 6, 168];

const PourScene: React.FC<{ T: number; t: number; f: number; tagAt?: number }> = ({ T, t, f, tagAt }) => {
  const g = 2.2;
  const solid = tagAt !== undefined ? ease(t, tagAt + 4, tagAt + 30) : 0;
  const bigPop = tagAt === undefined ? pop(t, 0, 12) : 1;
  const tilt = mix(58, 10, ease(T, POUR_END - 18, POUR_END + 6));
  return (
    <ShotStage fam="chalk" t={t} f={f}>
      <PaperGrid />
      <g>
        {/* the reference ball */}
        <GroundShadow x={560} y={812} rx={110} opacity={0.22} />
        <Ball cx={560} cy={700} r={100} />
        {/* the big one: outline, then marbles */}
        <GroundShadow x={BIG.cx} y={BIG.cy + BIG.r + 12} rx={210} opacity={0.2} />
        <g transform={`translate(${BIG.cx} ${BIG.cy}) scale(${bigPop}) translate(${-BIG.cx} ${-BIG.cy})`}>
          <circle cx={BIG.cx} cy={BIG.cy} r={BIG.r} fill={CHALK} opacity={0.55} />
          {REST.map((p, k) => {
            const age = T - k * SPAWN;
            if (age < 0) return null;
            const tau = Math.sqrt((2 * (p[1] - SPOUT[1])) / g);
            const sx = SPOUT[0] + (rnd(k * 5) - 0.5) * 22;
            let x: number, y: number;
            if (age < tau) {
              const a = age / tau;
              y = SPOUT[1] + 0.5 * g * age * age;
              x = mix(sx, p[0], a * a);
            } else {
              const b = age - tau;
              x = p[0];
              y = p[1] - Math.abs(Math.sin(b * 0.5)) * 10 * Math.exp(-b * 0.25);
            }
            return (
              <g key={k}>
                <circle cx={x} cy={y} r={MR} fill={TERRA} />
                <circle cx={x - 5} cy={y - 5} r={MR * 0.38} fill="#F2A07E" opacity={0.8} />
              </g>
            );
          })}
          {solid > 0 ? <g opacity={solid}><Ball cx={BIG.cx} cy={BIG.cy} r={BIG.r} /></g> : null}
          <circle cx={BIG.cx} cy={BIG.cy} r={BIG.r} fill="none" stroke={INK} strokeWidth={5} strokeDasharray="18 12" opacity={0.85 * (1 - solid * 0.7)} />
        </g>
        {/* the jar that pours */}
        <g transform={`translate(${SPOUT[0] - 40} ${SPOUT[1] - 20}) rotate(${tilt})`} opacity={mix(1, 0, ease(T, POUR_END, POUR_END + 14))}>
          <path d="M -70 -60 L 60 -60 L 50 50 Q 0 70 -60 50 Z" fill={mixHex(TERRA, INK, 0.2)} />
          <path d="M -70 -60 L 60 -60 L 56 -36 L -66 -36 Z" fill={CHALK} opacity={0.5} />
        </g>
        {solid > 0.5
          ? [0, 1, 2].map((k) => {
              const age = (t + k * 20) % 60;
              return <circle key={k} cx={BIG.cx} cy={BIG.cy} r={BIG.r + 8 + age * 3.2} fill="none" stroke={TERRA} strokeWidth={4} opacity={(1 - age / 60) * 0.5} />;
            })
          : null}
      </g>
      {tagAt !== undefined ? (
        <g transform={`translate(1580 640) scale(${pop(t, tagAt, 14)})`}>
          <text x={0} y={50} fontFamily={ST_FONT} fontWeight={900} fontSize={170} fill={INK}>×8</text>
        </g>
      ) : null}
    </ShotStage>
  );
};

// ------------------------------------------------------------------ C-03 / C-04: cubes
const A = 150;
const BX = 900, BY = 800;
const REF: Pt = [420, 800];
const DROPS: { i: number; j: number; k: number; t0: number }[] = [
  { i: 0, j: 1, k: 0, t0: 10 }, { i: 1, j: 1, k: 0, t0: 36 }, { i: 0, j: 0, k: 0, t0: 62 }, { i: 1, j: 0, k: 0, t0: 88 },
  { i: 0, j: 1, k: 1, t0: 124 }, { i: 1, j: 1, k: 1, t0: 150 }, { i: 0, j: 0, k: 1, t0: 176 }, { i: 1, j: 0, k: 1, t0: 202 },
];
const FALL = 14;

const CubeStudio: React.FC<{ t: number; f: number; draw: number; drops: boolean }> = ({ t, f, draw, drops }) => {
  const edges = cubeEdges(BX, BY, A * 2);
  const { d, head } = drawSegs(edges, draw);
  const landed = drops ? DROPS.filter((c) => t >= c.t0 + FALL).length : 0;
  const milestone = [8, 4, 2, 1].find((m) => landed >= m) ?? 0;
  const mAt = milestone ? DROPS[milestone - 1].t0 + FALL : 0;
  const order = drops ? [...DROPS].sort((a, b) => b.j - a.j || a.k - b.k || a.i - b.i) : [];
  return (
    <ShotStage fam="chalk" t={t} f={f}>
      <PaperGrid />
      <g>
        <GroundShadow x={REF[0] + A * 0.7} y={REF[1] + 6} rx={140} opacity={0.22} />
        <SugarCube x={REF[0]} y={REF[1]} a={A} />
        <GroundShadow x={BX + A * 1.3} y={BY + 8} rx={260} opacity={0.16} />
        {order.map((c, n) => {
          if (t < c.t0) return null;
          const p = lin(t, c.t0, c.t0 + FALL);
          const x = BX + c.i * A + c.j * A * CUBE_DX;
          const y = BY - c.k * A + c.j * A * CUBE_DY - 760 * (1 - p * p);
          const land = t - (c.t0 + FALL);
          const sq = land >= 0 && land < 10 ? Math.sin((land / 10) * Math.PI) * 0.12 : 0;
          return <SugarCube key={n} x={x} y={y} a={A} sx={1 + sq} sy={1 - sq} />;
        })}
        <path d={d} stroke={INK} strokeWidth={5} strokeDasharray="16 12" fill="none" strokeLinecap="round" opacity={drops ? 0.55 : 0.9} />
        {head ? (
          <g>
            <circle cx={head[0]} cy={head[1]} r={12} fill={INK} />
            <circle cx={head[0]} cy={head[1]} r={22} fill="none" stroke={INK} strokeWidth={2} opacity={0.35} />
          </g>
        ) : null}
      </g>
      {drops && milestone > 0 ? (
        <g transform={`translate(1600 470) scale(${0.85 + 0.15 * pop(t, mAt, 12)})`}>
          <rect x={-130} y={-120} width={260} height={230} rx={30} fill={INK} opacity={0.85} />
          <text x={0} y={52} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={170} fill={LIME}>{milestone}</text>
          <text x={0} y={92} textAnchor="middle" fontFamily={ST_FONT} fontWeight={800} fontSize={22} letterSpacing={3} fill={CHALK} opacity={0.85}>SMALL CUBES</text>
        </g>
      ) : null}
    </ShotStage>
  );
};

// ------------------------------------------------------------------ mountains (C-10)
const mtnPath = (cx: number, base: number, w: number, h: number) => {
  const py = base - h;
  return `M ${cx - w} ${base} C ${cx - w * 0.55} ${base - h * 0.2} ${cx - w * 0.3} ${py + h * 0.22} ${cx - 30} ${py + 14} Q ${cx} ${py - 8} ${cx + 34} ${py + 20} C ${cx + w * 0.3} ${py + h * 0.28} ${cx + w * 0.6} ${base - h * 0.2} ${cx + w} ${base} Z`;
};
const snowCap = (cx: number, py: number, k: number) =>
  `M ${cx - 62 * k} ${py + 70 * k} Q ${cx - 30 * k} ${py + 5} ${cx} ${py - 2} Q ${cx + 40 * k} ${py + 10} ${cx + 66 * k} ${py + 74 * k} Q ${cx + 20 * k} ${py + 54 * k} ${cx} ${py + 76 * k} Q ${cx - 24 * k} ${py + 50 * k} ${cx - 62 * k} ${py + 70 * k} Z`;

export const SHOTS_COLD: ShotMap = {
  // Lev's wind-up: rubs hands, leans back, hops up and catches the knob; the arm starts to move
  "C-01": ({ t, f }) => {
    const angle = t < 92 ? -18 : mix(-18, -26, ease(t, 92, 125));
    const hang = levOnLever(angle);
    const rub = Math.sin(t * 0.8);
    const hop = ease(t, 64, 86);
    let lx = 1110, ly = GROUND - 4, pose: "stand" | "pull" = "stand";
    let hands: { front: Pt; back: Pt } = { front: [30 + 9 * rub, -82 + 3 * Math.cos(t * 0.8)], back: [20 - 9 * rub, -86] };
    let lean = -5 + 4 * Math.sin(t / 7);
    if (t >= 64) {
      const h0 = levOnLever(-18);
      lx = mix(1110, h0.x, hop);
      ly = mix(GROUND - 4, hang.y, hop) - Math.sin(hop * Math.PI) * 70;
      pose = "pull";
      hands = { front: [mix(30, 48, hop), mix(-82, hang.hand[1], hop)], back: [mix(20, 38, hop), mix(-86, hang.hand[1] + 10, hop)] };
      lean = mix(8, -10, hop);
      if (t >= 86) {
        lx = hang.x;
        ly = hang.y - Math.sin(Math.max(0, t - 86) * 0.35) * 6 * Math.exp(-(t - 86) * 0.06);
        hands = { front: hang.hand, back: [hang.hand[0] - 10, hang.hand[1] + 10] };
      }
    }
    // two little spits (chalk droplets arcing onto the hands)
    const spit = (t0: number) => {
      const p = lin(t, t0, t0 + 10);
      if (p <= 0 || p >= 1) return null;
      const sx = lx + 30 * LS, sy = ly - 150 * LS;
      return <circle cx={sx + p * 14} cy={sy + p * 62 * LS - Math.sin(p * Math.PI) * 26} r={4} fill={CHALK} opacity={0.85} />;
    };
    return (
      <ShotStage fam="moss" t={t} f={f}>
        <g>
          <Earth cx={700} cy={500} r={165} />
        </g>
        <g>
          <Ledge ground={GROUND} />
          <Lever x={PIV[0]} y={PIV[1]} len={LEN} angle={angle} plate="SIZE ×2" glow={0.25 + 0.25 * ease(t, 86, 125)} />
          <Lev x={lx} y={ly} h={LEVH} frame={f} pose={pose} hands={hands} lean={lean} eyes={t < 40 ? "happy" : "squint"} wind={t >= 64 ? 0.9 : 0.4} shade="#9FB7A6" />
          {spit(6)}
          {spit(24)}
        </g>
      </ShotStage>
    );
  },

  // the pull: lever comes home, Earth swells to 2× past its chalk outline (key art I)
  "C-02": ({ t, f }) => {
    const angle = mix(-26, -38, ease(t, 0, 22));
    const hang = levOnLever(angle);
    const g = overshoot(lin(t, 14, 74));
    const R = 165 + 165 * g;
    const out = ease(t, 14, 30);
    return (
      <ShotStage fam="moss" t={t} f={f} counter={t >= 90 ? { label: "SIZE", value: "×2" } : undefined}>
        <g>
          {[0, 1, 2, 3, 4, 5].map((k) => {
            const age = t - (16 + k * 22);
            if (age < 0 || age > 64) return null;
            return <circle key={k} cx={700} cy={500} r={R + age * 5} fill="none" stroke={AIR} strokeWidth={5 - age * 0.05} opacity={(1 - age / 64) * 0.55} />;
          })}
          <Earth cx={700} cy={500} r={R} />
          <circle cx={700} cy={500} r={165} fill="none" stroke={CHALK} strokeWidth={5} strokeDasharray="18 12" opacity={0.95 * out} />
          <text x={700} y={508} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={30} letterSpacing={3} fill={CHALK} opacity={ease(t, 80, 96)}>OUR EARTH</text>
        </g>
        <g>
          <Ledge ground={GROUND} />
          <Lever x={PIV[0]} y={PIV[1]} len={LEN} angle={angle} plate="SIZE ×2" glow={0.5} />
          <Lev x={hang.x} y={hang.y} h={LEVH} frame={f} pose="pull" hands={{ front: hang.hand, back: [hang.hand[0] - 10, hang.hand[1] + 10] }} lean={-10} eyes={t > 90 ? "wide" : "squint"} wind={0.9} shade="#9FB7A6" />
        </g>
        {t < 90 ? <PopCounter label="SIZE" value="×2" k={pop(t, 76, 14)} /> : null}
      </ShotStage>
    );
  },

  // one sugar cube; a dashed cube twice as wide draws beside it
  "C-03": ({ t, f }) => <CubeStudio t={t} f={f} draw={ease(t, 10, 112)} drops={false} />,

  // eight small cubes drop into the big outline; lime count 1, 2, 4, 8
  "C-04": ({ t, f }) => <CubeStudio t={t} f={f} draw={1} drops />,

  // a ball and a ball twice as wide; small balls pour in
  "C-05": ({ t, f }) => <PourScene T={t} t={t} f={f} />,

  // the big ball fills to the brim; ×8
  "C-06": ({ t, f }) => <PourScene T={75 + t} t={t} f={f} tagAt={84} />,

  // big Earth with Lev on top; down-arrows rain; gravity rolls 1.0 → 2.0 g
  "C-07": ({ t, f }) => {
    const gk = ease(t, 24, 150);
    const gv = 1 + Math.round(gk * 10) / 10;
    const ER = 1500, ECY = 762 + ER;
    const surf = (x: number) => ECY - Math.sqrt(ER * ER - (x - 960) ** 2);
    const nOn = 12 + Math.round(16 * gk);
    return (
      <ShotStage fam="moss" t={t} f={f} counter={{ label: "SIZE", value: "×2", sub: `GRAVITY ${gv.toFixed(1)} g` }}>
        <g>
          <Earth cx={960} cy={ECY} r={ER} seed={5} />
          <defs><clipPath id="c07e"><circle cx={960} cy={ECY} r={ER} /></clipPath></defs>
          <g clipPath="url(#c07e)">
            <path d={smoothPath([[480, 1100], [560, 820], [760, 772], [980, 754], [1180, 790], [1300, 860], [1420, 1100]]) + " Z"} fill="#9BC283" />
            <path d={smoothPath([[160, 1100], [230, 960], [330, 930], [400, 1000], [380, 1100]]) + " Z"} fill="#7FAE72" />
            <path d={smoothPath([[1520, 1100], [1580, 930], [1700, 900], [1790, 980], [1760, 1100]]) + " Z"} fill="#7FAE72" />
          </g>
          {Array.from({ length: 28 }, (_, i) => {
            if (i >= nOn) return null;
            const x = 280 + (i % 14) * 92 + (rnd(i * 3) - 0.5) * 40 + (i >= 14 ? 46 : 0);
            const floor = surf(x) - 8;
            const span = floor + 140;
            const v = 9 + 9 * gk + rnd(i * 7) * 4;
            const y = ((t * v + rnd(i * 11) * span) % span) - 140;
            const len = 50 + 70 * gk;
            const o = Math.min(1, Math.max(0, (floor - y) / 90)) * 0.8;
            return <DownArrow key={i} x={x} y={y} len={len} w={9 + 4 * gk} color={CHALK} opacity={o} />;
          })}
          <g transform={`translate(960 762) scale(${1 + 0.05 * gk} ${1 - 0.09 * gk}) translate(-960 -762)`}>
            <Lev x={960} y={762} h={150} frame={f} pose="stand" lean={6 * gk} eyes={gk > 0.6 ? "squint" : "open"} tilt={-4 * gk} wind={-0.6} shade="#9FB7A6" />
          </g>
        </g>
        <g transform={`translate(1860 300) scale(${pop(t, 150, 12)}) translate(-1860 -300)`}>
          <STPill x={1860} y={300} text="OUR SUM" align="end" />
        </g>
      </ShotStage>
    );
  },

  // the lime Ladder slides up the right edge, rung labels pop, camera tilts up it
  "C-08": ({ t, f }) => {
    const slide = ease(t, 0, 32);
    const tilt = ease(t, 34, 100) * 230;
    const top = -280, bottom = 860;
    return (
      <ShotStage fam="moss" t={t} f={f} counter={{ label: "SIZE", value: "×2", sub: "GRAVITY 2.0 g" }}>
        <g transform={`translate(0 ${tilt * 0.4})`}>
          <Earth cx={560} cy={540} r={330} />
          <circle cx={560} cy={540} r={165} fill="none" stroke={CHALK} strokeWidth={5} strokeDasharray="18 12" opacity={0.8} />
        </g>
        <g transform={`translate(0 ${tilt})`}>
          <Ledge ground={GROUND} />
          <Lever x={1130} y={GROUND} len={LEN} angle={-38} plate="SIZE ×2" glow={0.3} />
          <Lev x={1330} y={GROUND - 4} h={190} frame={f} pose="stand" eyes="up" tilt={-16 - 6 * ease(t, 34, 100)} wind={0.5} shade="#9FB7A6" />
          <g transform={`translate(0 ${(1 - slide) * 1300})`}>
            <BigLadder x={1500} top={top} bottom={bottom} width={120} lit={-1} glow={0} frame={f} labelK={(i) => pop(t, 26 + i * 9, 12)} />
          </g>
        </g>
      </ShotStage>
    );
  },

  // teaser: an air band squashing onto a strip of ground
  "C-09": ({ t, f }) => {
    const H = mix(300, 105, ease(t, 6, 64));
    const ground = 812;
    return (
      <ShotStage fam="clay" t={t} f={f}>
        <Bloom x={960} y={800} r={760} color={CLAY.light} strength={0.6} spread={0.5} />
        <g>
          <path d={smoothPath([[-60, 780], [300, 730], [620, 760], [980, 700], [1320, 750], [1640, 720], [1980, 760]]) + " L 1980 1100 L -60 1100 Z"} fill={CLAY.far} opacity={0.7} />
        </g>
        <g>
          <HazeBand y={ground - 3 * H} h={3 * H} color={AIR} strength={0.45} />
          <g fill={AIR}>
            {Array.from({ length: 1500 }, (_, i) => {
              const u = -Math.log(1 - rnd(i * 7 + 1) * 0.985);
              const y = ground - 6 - u * H + (rnd(i * 13) - 0.5) * 6;
              if (y < 90) return null;
              return <circle key={i} cx={rnd(i * 3 + 2) * 1960 - 20} cy={y} r={3.4} opacity={0.9} />;
            })}
          </g>
          {[420, 960, 1500].map((x, i) => (
            <DownArrow key={x} x={x} y={ground - 2.6 * H - 30 + Math.sin(t / 5 + i) * 4} len={120} w={16} color={CHALK} opacity={0.85} />
          ))}
          <rect x={-60} y={ground} width={2040} height={320} fill={CLAY.near} />
          <path d={`M -60 ${ground + 2} H 1980`} stroke={CLAY.bounce} strokeWidth={5} opacity={0.7} />
        </g>
      </ShotStage>
    );
  },

  // teaser: a mountain sinking
  "C-10": ({ t, f }) => {
    const k = ease(t, 4, 58);
    const h = mix(560, 290, k) + Math.sin(Math.max(0, t - 58) * 0.5) * 8 * Math.exp(-Math.max(0, t - 58) * 0.12);
    const base = 880;
    const cx = 960;
    const sinking = t > 4 && t < 66;
    return (
      <ShotStage fam="clay" t={t} f={f}>
        <Bloom x={1300} y={720} r={700} color={CLAY.light} strength={0.55} spread={0.5} />
        <g>
          <path d={mtnPath(380, base, 360, mix(300, 190, k))} fill={CLAY.far} opacity={0.8} />
          <path d={mtnPath(1580, base, 400, mix(340, 210, k))} fill={CLAY.far} opacity={0.8} />
        </g>
        <g>
          <path d={mtnPath(cx, base, 540, 560)} fill="none" stroke={CHALK} strokeWidth={4} strokeDasharray="14 12" opacity={0.75} />
          <path d={mtnPath(cx, base, 540, h)} fill={CLAY.mid} />
          <path d={`M ${cx + 8} ${base - h + 16} C ${cx + 120} ${base - h * 0.7} ${cx + 330} ${base - h * 0.2} ${cx + 540} ${base} L ${cx + 80} ${base} C ${cx + 100} ${base - h * 0.4} ${cx + 40} ${base - h * 0.7} ${cx + 8} ${base - h + 16} Z`} fill={CLAY.near} opacity={0.3} />
          <path d={snowCap(cx, base - h, mix(1, 0.75, k))} fill="#FFF1E0" />
          {sinking
            ? [-1, 1].map((s) =>
                [0, 1, 2].map((j) => {
                  const age = (t * 1.2 + j * 9) % 27;
                  return <circle key={`${s}${j}`} cx={cx + s * (470 + age * 5)} cy={base - 10 - age * 1.6} r={14 + age * 1.6} fill={CLAY.dim} opacity={(1 - age / 27) * 0.6} />;
                }),
              )
            : null}
          <rect x={-60} y={base} width={2040} height={260} fill={CLAY.near} />
        </g>
      </ShotStage>
    );
  },

  // teaser: a fuel bar shoots up beside a little rocket, ×7
  "C-11": ({ t, f }) => {
    const base = 900;
    const unit = 64;
    const k1 = ease(t, 0, 12);
    const k2 = overshoot(lin(t, 18, 46));
    const hBar = unit * k1 + unit * 6 * k2;
    const top = base - hBar;
    const slosh = (x: number) => Math.sin(x / 18 + t * 0.4) * 6 * (t > 18 ? 1 : 0.3);
    const bx0 = 1150, bx1 = 1280;
    return (
      <ShotStage fam="moss" t={t} f={f}>
        <g>
          <rect x={-60} y={base} width={2040} height={260} fill={MOSS.near} />
          <path d={`M -60 ${base + 2} H 1980`} stroke={MOSS.bounce} strokeWidth={4} opacity={0.6} />
          <rect x={600} y={base - 14} width={200} height={14} rx={6} fill={MOSS.mid} />
          <g transform={`translate(${Math.sin(t * 1.3) * (t > 18 && t < 50 ? 2 : 0)} 0)`}>
            <Rocket x={700} base={base - 14} h={260} frame={f} />
          </g>
          {/* today's fuel (ghost) */}
          <rect x={960} y={base - unit * k1} width={130} height={unit * k1} rx={10} fill="none" stroke={CHALK} strokeWidth={4} strokeDasharray="12 9" opacity={0.85} />
          <text x={1025} y={base + 50} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={26} letterSpacing={3} fill={MOSS.dim}>TODAY</text>
          {/* the new bar */}
          <path d={`M ${bx0} ${base} L ${bx0} ${top + slosh(bx0)} ${Array.from({ length: 9 }, (_, i) => { const x = bx0 + ((i + 1) * (bx1 - bx0)) / 9; return `L ${x} ${top + slosh(x)}`; }).join(" ")} L ${bx1} ${base} Z`} fill={TERRA} />
          <rect x={bx0 + 14} y={top + 12} width={16} height={Math.max(0, hBar - 24)} rx={8} fill="#F2A07E" opacity={0.6} />
          {Array.from({ length: 8 }, (_, i) => {
            const age = (t * 2.2 + i * 17) % Math.max(1, hBar);
            return t > 46 ? <circle key={i} cx={bx0 + 30 + rnd(i) * 80} cy={base - 10 - age} r={4 + rnd(i * 3) * 3} fill="#F2A07E" opacity={0.7} /> : null;
          })}
          <path d={`M ${bx0 - 30} ${base - unit} H ${bx1 + 30}`} stroke={CHALK} strokeWidth={3} strokeDasharray="8 8" opacity={0.6 * k1} />
        </g>
        <g transform={`translate(1320 ${top + 70}) scale(${pop(t, 44, 14)})`}>
          <text x={0} y={30} fontFamily={ST_FONT} fontWeight={900} fontSize={150} fill={MOSS.text}>×7</text>
        </g>
        <g transform={`translate(1330 ${top + 150}) scale(${pop(t, 52, 12)})`}>
          <STPill x={0} y={0} text="OUR SUM" />
        </g>
      </ShotStage>
    );
  },

  // a big planet silhouette in a hazy, swirling gas shell; a chalk "?"
  "C-12": ({ t, f }) => {
    const cx = 880, cy = 560, R = 250, S = 370;
    const id = "c12shell";
    const bands = (alpha: number, sp: number) =>
      Array.from({ length: 11 }, (_, b) => {
        const y = cy - S + b * 70 + 10;
        const ph = t * sp * (b % 2 ? 1 : -1) * (0.7 + rnd(b) * 0.6);
        const pts: Pt[] = Array.from({ length: 23 }, (_, i) => {
          const x = cx - S - 100 + i * 45;
          return [x, y + Math.sin((x + ph) / 70 + b) * 16];
        });
        const back = pts.map(([x, y2]) => [x, y2 + 34 + Math.sin((x - ph) / 55 + b * 2) * 8] as Pt).reverse();
        return <path key={b} d={smoothPath(pts) + " L " + smoothPath(back).slice(1) + " Z"} fill={b % 3 === 0 ? AIR : OLIVE.light} opacity={alpha * (0.6 + rnd(b * 5) * 0.4)} />;
      });
    const q = pop(t, 96, 16);
    return (
      <ShotStage fam="olive" t={t} f={f}>
        <defs>
          <clipPath id={id}><circle cx={cx} cy={cy} r={S} /></clipPath>
          <radialGradient id={`${id}g`} cx="38%" cy="34%" r="70%">
            <stop offset={0.5} stopColor={OLIVE.shadow} stopOpacity={0} />
            <stop offset={1} stopColor={OLIVE.shadow} stopOpacity={0.7} />
          </radialGradient>
        </defs>
        <g>
          <Bloom x={cx} y={cy} r={S * 1.5} color={AIR} strength={0.35} spread={0.55} />
          <circle cx={cx} cy={cy} r={S} fill={OLIVE.far} opacity={0.75} />
          <g clipPath={`url(#${id})`}>{bands(0.2, 2.4)}</g>
          <circle cx={cx} cy={cy} r={R} fill={OLIVE.near} opacity={0.82} />
          <g clipPath={`url(#${id})`}>{bands(0.13, 3.4)}</g>
          <circle cx={cx} cy={cy} r={S} fill={`url(#${id}g)`} />
          <circle cx={cx} cy={cy} r={S + 3} fill="none" stroke={AIR} strokeWidth={4} opacity={0.4} />
          {[0, 1, 2].map((i) => (
            <ellipse key={i} cx={cx} cy={cy} rx={S + 40 + i * 30} ry={70 + i * 22} fill="none" stroke={OLIVE.light} strokeWidth={3} strokeDasharray="60 260" strokeDashoffset={-t * (5 + i * 2)} opacity={0.35} transform={`rotate(${-12 + i * 9} ${cx} ${cy})`} />
          ))}
        </g>
        <g transform={`translate(1470 ${640 + Math.sin(t / 14) * 10}) scale(${q}) rotate(${(1 - Math.min(1, q)) * -20})`}>
          <text x={0} y={0} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={330} fill={CHALK} opacity={0.95}>?</text>
        </g>
      </ShotStage>
    );
  },

  // Lev walks in and climbs onto the bottom rung ×1; it lights; the camera tilts up the ladder
  "C-13": ({ t, f }) => {
    const top = -260, bottom = 990, lx = 1150;
    const r0 = rungY(top, bottom, 0);
    const walk = lin(t, 0, 80);
    const climb = ease(t, 82, 128);
    let x = mix(380, 1062, walk), y = bottom - Math.abs(Math.sin(t * 0.42)) * 9 * (t < 80 ? 1 : 0);
    let pose: "stand" | "pull" = "stand";
    if (t >= 80) {
      x = mix(1062, lx - 8, climb);
      y = mix(bottom, r0, climb) - Math.sin(climb * Math.PI) * 16;
      pose = t < 130 ? "pull" : "stand";
    }
    const lit = t < 138 ? -1 : 0;
    const glow = t < 138 ? 0 : 0.6 + 1.2 * Math.max(0, 1 - (t - 138) / 18);
    const tilt = ease(t, 148, 222) * 210;
    return (
      <ShotStage fam="moss" t={t} f={f}>
        <g transform={`translate(0 ${tilt * 0.35})`}>
          <Earth cx={360} cy={300} r={110} />
        </g>
        <g transform={`translate(0 ${tilt})`}>
          <g>
            <path d={smoothPath([[-60, 1000], [400, 985], [900, 992], [1400, 984], [1980, 998]]) + " L 1980 1400 L -60 1400 Z"} fill={MOSS.near} />
            <path d={`M -60 ${bottom + 4} Q 960 ${bottom - 14} 1980 ${bottom + 4}`} stroke={MOSS.bounce} strokeWidth={4} fill="none" opacity={0.6} />
            <BigLadder x={lx} top={top} bottom={bottom} width={130} lit={lit} glow={glow} frame={f} />
            <Lev x={x} y={y} h={150} frame={f} pose={pose} hands={pose === "pull" ? { front: [22, -180], back: [12, -170] } : undefined} lean={t < 80 ? 5 : 0} eyes={t > 132 ? "up" : "open"} tilt={t > 132 ? -14 : 0} wind={t < 80 ? 0.8 : 0.4} shade="#9FB7A6" />
          </g>
        </g>
      </ShotStage>
    );
  },

  // chart SIZE → GRAVITY: a straight line draws; a lime dot slides along it
  "C-14": ({ t, f }) => {
    const ox = 380, oy = 860;
    const X = (s: number) => 380 + (s - 0.8) * 900;
    const Y = (g: number) => 860 - (g - 0.8) * 520;
    const line = partial([[X(1), Y(1)], [X(2), Y(2)]], ease(t, 16, 96));
    const ds = mix(1, 2, ease(t, 104, 200));
    const dk = pop(t, 100, 12);
    const px = X(ds), py = Y(ds);
    return (
      <ShotStage fam="chalk" t={t} f={f}>
        <PaperGrid opacity={0.35} />
        <text x={ox} y={150} fontFamily={ST_FONT} fontWeight={900} fontSize={54} fill={INK}>Same rock: the pull grows with the size</text>
        <g>
          <path d={`M ${ox} ${oy} H 1560 M ${ox} ${oy} V 190`} stroke={INK} strokeWidth={5} strokeLinecap="round" fill="none" />
          {[1, 1.5, 2].map((s) => (
            <g key={s}>
              <path d={`M ${X(s)} ${oy} v 16`} stroke={INK} strokeWidth={4} />
              <text x={X(s)} y={oy + 56} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={34} fill={INK}>{`×${s}`}</text>
              <path d={`M ${ox} ${Y(s)} h -16`} stroke={INK} strokeWidth={4} />
              <text x={ox - 28} y={Y(s) + 12} textAnchor="end" fontFamily={ST_FONT} fontWeight={900} fontSize={34} fill={INK}>{`${s} g`}</text>
            </g>
          ))}
          <text x={(ox + 1560) / 2} y={oy + 110} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={30} letterSpacing={4} fill={CH.dim}>SIZE</text>
          <text x={ox + 20} y={225} fontFamily={ST_FONT} fontWeight={900} fontSize={30} letterSpacing={4} fill={CH.dim}>GRAVITY</text>
          <path d={line.d} stroke={TERRA} strokeWidth={10} strokeLinecap="round" fill="none" />
          {t < 98 ? <circle cx={line.head[0]} cy={line.head[1]} r={12} fill={INK} /> : null}
          {dk > 0 ? (
            <g>
              <path d={`M ${px} ${py} V ${oy} M ${px} ${py} H ${ox}`} stroke={INK} strokeWidth={3} strokeDasharray="8 8" opacity={0.6} />
              <Bloom x={px} y={py} r={70} color={LIME} strength={0.7} />
              <circle cx={px} cy={py} r={22 * dk} fill={LIME} stroke={INK} strokeWidth={4} />
            </g>
          ) : null}
          <Lev x={1700} y={oy} h={190} frame={f} facing={-1} pose="point" eyes={t > 104 ? "happy" : "open"} tilt={8} wind={0.2} outline={INK} />
        </g>
      </ShotStage>
    );
  },

  // chapter beat: rung ×1.1 lights, "Ten percent bigger"
  "C-15": ({ t, d, f }) => (
    <ChapterBeat t={t} d={d} f={f} fam="sage" prev={0} next={1} eyebrow="FIRST RUNG" title="Ten percent bigger" after={{ label: "SIZE", value: "×1.1", sub: "GRAVITY 1.1 g" }} />
  ),
};
