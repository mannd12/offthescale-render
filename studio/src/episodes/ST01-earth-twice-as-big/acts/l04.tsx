// ST01 act "l04" (4 · Twice as big, shots 4-01..4-23): shot bodies keyed by storyboard id. Numbers only from
// storyboard-prep.md §2; props terracotta, lime only for signals (Counter, Ladder, scarf, the 2× EARTH tag).
import React, { useId } from "react";
import { Bloom } from "../../../lib/illustrated/light";
import { Stars } from "../../../lib/illustrated/ambient";
import { arcPath, blobPts, rrect, smoothPath } from "../../../lib/illustrated/shapes";
import { rnd } from "../../../lib/illustrated/motion";
import { AIR, BRASS, BRASS_DARK, CHALK, CHALK_SHADE, INK, LIME, OCEAN, ST_FONT, SUPPOSE, TERRA } from "../../../lib/suppose/palette";
import { Lev, levHand } from "../../../lib/suppose/lev";
import { Ladder, Lever, leverTip, STPill } from "../../../lib/suppose/devices";
import { Earth } from "../../../lib/suppose/frames";
import { ease, lin, mix, pop, ShotMap, ShotStage } from "../shot";
import {
  AirDots, Big, Bucket, C2, CLAY_GROUND, CLAY_PEAK, ClayBack, ClayFloor, Cube, flankAt, Mountain, Pt, Puffs, PX_KM, Readout, Rocket,
  Push, SAND, SlideFlag, TERRA_DEEP, TERRA_LIT,
} from "./l04-parts";

const TAU = Math.PI * 2;
const ACT_RUNGS = ["×1", "×1.1", "×1.25", "×1.5", "×2", ""];
const closed = (pts: Pt[]) => smoothPath([...pts, pts[0], pts[1]]) + " Z";

// ---------------------------------------------------------------- sage outdoor set (4-03..4-05)
const SAGE_G = 860;
const SageSet: React.FC<{ scroll?: number }> = ({ scroll = 0 }) => {
  const fam = SUPPOSE.sage;
  const far = ((-scroll * 0.25) % 1200 + 1200) % 1200;
  return (
    <g>
      <Bloom x={1500} y={260} r={420} color={fam.light} strength={0.6} />
      <g transform={`translate(${far - 1200} 0)`}>
        {[0, 1, 2].map((k) => (
          <path key={k} d={`M ${k * 1200 - 60} 700 C ${k * 1200 + 200} 600 ${k * 1200 + 420} 640 ${k * 1200 + 600} 690 C ${k * 1200 + 800} 740 ${k * 1200 + 1000} 620 ${k * 1200 + 1260} 690 L ${k * 1200 + 1260} 1100 L ${k * 1200 - 60} 1100 Z`} fill={fam.far} />
        ))}
      </g>
      <path d={`M -60 ${SAGE_G - 40} C 400 ${SAGE_G - 90} 1300 ${SAGE_G - 60} 1980 ${SAGE_G - 50} L 1980 1100 L -60 1100 Z`} fill={fam.mid} />
      <rect x={-60} y={SAGE_G} width={2040} height={240} fill={fam.near} />
      <path d={`M -60 ${SAGE_G} L 1980 ${SAGE_G}`} stroke={fam.bounce} strokeWidth={5} opacity={0.8} />
      {/* tufts and stones scroll with the walk */}
      {Array.from({ length: 9 }, (_, i) => {
        const x = ((i * 260 - scroll) % 2340 + 2340) % 2340 - 210;
        const big = i % 3 === 0;
        return big ? (
          <ellipse key={i} cx={x} cy={SAGE_G + 30 + (i % 2) * 40} rx={34} ry={13} fill={fam.shadow} opacity={0.5} />
        ) : (
          <path key={i} d={`M ${x - 18} ${SAGE_G + 2} Q ${x - 14} ${SAGE_G - 26} ${x - 6} ${SAGE_G + 2} Q ${x} ${SAGE_G - 34} ${x + 6} ${SAGE_G + 2} Q ${x + 14} ${SAGE_G - 24} ${x + 18} ${SAGE_G + 2} Z`} fill={fam.mid} />
        );
      })}
    </g>
  );
};

/** ghost second Lev, riding piggyback (sit pose), translucent chalk */
const Ghost: React.FC<{ x: number; y: number; h: number; f: number; op?: number }> = ({ x, y, h, f, op = 0.5 }) => (
  <g opacity={op}>
    <Lev x={x} y={y} h={h} frame={f + 20} pose="sit" eyes="happy" seed={3} shade="#D9EAD0" wind={0.5} />
  </g>
);

// ---------------------------------------------------------------- land-and-sea tile (4-08)
const Tile: React.FC<{ x: number; y: number; s: number; f: number; seed: number }> = ({ x, y, s, f, seed }) => {
  const id = "l04tile" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <path d={rrect(x, y, s, s, 26)} />
        </clipPath>
        <linearGradient id={id + "g"} x1="0" y1="0" x2="1" y2="1">
          <stop offset={0} stopColor="#6FB9CF" />
          <stop offset={1} stopColor={OCEAN} />
        </linearGradient>
      </defs>
      <path d={rrect(x + 8, y + 14, s, s, 26)} fill="#3D5E46" opacity={0.3} />
      <g clipPath={`url(#${id})`}>
        <rect x={x} y={y} width={s} height={s} fill={`url(#${id}g)`} />
        {Array.from({ length: 7 }, (_, i) => {
          const wx = x + ((i * 97 + f * 1.8) % (s + 80)) - 40;
          const wy = y + 30 + ((i * 53) % (s - 40));
          return <path key={i} d={`M ${wx} ${wy} q 12 -6 24 0`} stroke={AIR} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.7} />;
        })}
        <path d={closed(blobPts(x + s * 0.36, y + s * 0.42, s * 0.25, 9, 31, 0.3, 0.9))} fill="#9BC283" />
        <path d={closed(blobPts(x + s * 0.72, y + s * 0.72, s * 0.14, 8, 44, 0.3, 0.8))} fill="#7FAE72" />
        <path d={closed(blobPts(x + s * 0.32, y + s * 0.4, s * 0.1, 7, 52, 0.3, 0.8))} fill="#7FAE72" />
        {/* cloud wisps drifting over */}
        <ellipse cx={x + ((f * 2.2 + seed * 90) % (s + 200)) - 100} cy={y + s * 0.25} rx={60} ry={14} fill={CHALK} opacity={0.6} />
        <ellipse cx={x + ((f * 2.2 + seed * 90 + 150) % (s + 200)) - 100} cy={y + s * 0.8} rx={44} ry={10} fill={CHALK} opacity={0.5} />
      </g>
      <path d={rrect(x, y, s, s, 26)} fill="none" stroke={CHALK} strokeWidth={5} />
    </g>
  );
};

// ---------------------------------------------------------------- big-Earth horizon (4-14, 4-15)
const BIG = { cx: 960, cy: 2300, r: 1500 };
const surfY = (x: number) => BIG.cy - Math.sqrt(BIG.r * BIG.r - (x - BIG.cx) * (x - BIG.cx));
const rotAbout = (p: Pt, o: Pt, deg: number): Pt => {
  const a = (deg * Math.PI) / 180, dx = p[0] - o[0], dy = p[1] - o[1];
  return [o[0] + dx * Math.cos(a) - dy * Math.sin(a), o[1] + dx * Math.sin(a) + dy * Math.cos(a)];
};
const surfTilt = (x: number) => (Math.asin((x - BIG.cx) / BIG.r) * 180) / Math.PI;

const Ball: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 16 }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={TERRA} />
    <circle cx={x - r * 0.3} cy={y - r * 0.35} r={r * 0.35} fill={TERRA_LIT} opacity={0.8} />
  </g>
);

// ---------------------------------------------------------------- fuel tube (4-18, 4-19)
const U = 110; // the empty rocket's height = one unit of fuel
const PAD = 880;
const BX = 860, BW = 130;
const FuelTube: React.FC<{ L: number; f: number; top: number }> = ({ L, f, top }) => {
  const fy = PAD - L;
  const wob = (x: number) => Math.sin(x / 18 + f / 4) * 5;
  const surf = `M ${BX} ${fy + wob(0)} ` + Array.from({ length: 9 }, (_, i) => `L ${BX + (i + 1) * (BW / 9)} ${fy + wob((i + 1) * 15)}`).join(" ");
  const ticks = Math.floor((PAD - top) / U);
  return (
    <g>
      <rect x={BX - 10} y={top} width={BW + 20} height={PAD - top} rx={20} fill={INK} opacity={0.35} />
      <path d={`${surf} L ${BX + BW} ${PAD} L ${BX} ${PAD} Z`} fill={AIR} opacity={0.9} />
      <path d={surf} stroke="#E6F7FB" strokeWidth={5} fill="none" />
      <rect x={BX + 14} y={fy + 10} width={18} height={Math.max(0, L - 20)} rx={9} fill="#E6F7FB" opacity={0.35} />
      {Array.from({ length: 14 }, (_, i) => {
        const span = Math.max(1, L - 30);
        const by = PAD - 10 - ((f * (2.2 + rnd(i) * 1.5) + rnd(i + 9) * 900) % span);
        return <circle key={i} cx={BX + 30 + rnd(i * 7) * (BW - 50) + Math.sin(f / 6 + i) * 4} cy={by} r={4 + rnd(i * 3) * 4} fill="#E6F7FB" opacity={0.6} />;
      })}
      {/* one tick per empty rocket's worth of fuel */}
      {Array.from({ length: ticks }, (_, i) => {
        const y = PAD - (i + 1) * U;
        const major = (i + 1) % 5 === 0;
        return <path key={i} d={`M ${BX + BW + 10} ${y} h ${major ? 34 : 18}`} stroke={CHALK} strokeWidth={major ? 5 : 3} strokeLinecap="round" opacity={0.85} />;
      })}
      <rect x={BX - 10} y={top} width={BW + 20} height={PAD - top} rx={20} fill="none" stroke={CHALK} strokeWidth={5} opacity={0.8} />
    </g>
  );
};
const PadSet: React.FC = () => {
  const fam = SUPPOSE.moss;
  return (
    <g>
      <path d={`M -60 ${PAD + 20} C 500 ${PAD} 1400 ${PAD + 10} 1980 ${PAD + 24} L 1980 1600 L -60 1600 Z`} fill={fam.near} />
      <path d={`M -60 ${PAD + 20} C 500 ${PAD} 1400 ${PAD + 10} 1980 ${PAD + 24}`} stroke={fam.bounce} strokeWidth={5} fill="none" opacity={0.7} />
      <path d={rrect(600, PAD - 6, 440, 26, 8)} fill={BRASS_DARK} />
      <path d={rrect(606, PAD - 4, 428, 8, 4)} fill={BRASS} opacity={0.6} />
    </g>
  );
};

// ---------------------------------------------------------------- calendar (4-22)
const CAL = { x: 660, y: 260, w: 480, h: 560 };
const CalPage: React.FC<{ value?: string; lines?: boolean }> = ({ value, lines }) => (
  <g>
    <path d={rrect(CAL.x, CAL.y + 80, CAL.w, CAL.h - 80, 24)} fill={CHALK} />
    <path d={rrect(CAL.x, CAL.y + CAL.h - 30, CAL.w, 30, 14)} fill={CHALK_SHADE} opacity={0.7} />
    {value ? (
      <>
        <text x={CAL.x + CAL.w / 2} y={CAL.y + 400} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={210} fill={INK}>{value}</text>
        <text x={CAL.x + CAL.w / 2} y={CAL.y + 480} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={52} letterSpacing={6} fill={TERRA_DEEP}>DAYS</text>
      </>
    ) : null}
    {lines
      ? [0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${CAL.x + 60} ${CAL.y + 170 + i * 64} H ${CAL.x + CAL.w - 60}`} stroke={CHALK_SHADE} strokeWidth={6} strokeLinecap="round" />)
      : null}
  </g>
);

const MoonBall: React.FC<{ x: number; y: number; r: number; ghost?: boolean }> = ({ x, y, r, ghost }) =>
  ghost ? (
    <circle cx={x} cy={y} r={r} fill={CHALK} fillOpacity={0.12} stroke={CHALK} strokeWidth={3} strokeDasharray="8 6" opacity={0.75} />
  ) : (
    <g>
      <circle cx={x} cy={y} r={r} fill="#E4E2CF" />
      <path d={`M ${x + r * 0.2} ${y - r * 0.98} A ${r} ${r} 0 0 1 ${x + r * 0.2} ${y + r * 0.98} A ${r * 1.1} ${r * 1.1} 0 0 0 ${x + r * 0.2} ${y - r * 0.98} Z`} fill="#A9AC86" opacity={0.6} />
      <circle cx={x - r * 0.3} cy={y - r * 0.2} r={r * 0.18} fill="#C2C0A8" />
      <circle cx={x + r * 0.1} cy={y + r * 0.35} r={r * 0.12} fill="#C2C0A8" />
    </g>
  );

// ======================================================================================================== shots
export const SHOTS_L04: ShotMap = {
  // ---- 4-01 KEY ART 1: Lev hauls the lever to its last notch; the globe swells to 2×
  "4-01": ({ t, f }) => {
    const ground = 880;
    const ang = mix(-6, -38, ease(t, 2, 38));
    const tip = leverTip(1350, ground, 240, ang);
    const levH = 210, s = levH / 170;
    const hand: Pt = [48, (tip[1] - ground) / s];
    const levX = tip[0] - hand[0] * s;
    const sw = ease(t, 22, 72);
    const r = 165 + 165 * sw + Math.sin(lin(t, 60, 100) * Math.PI) * 8;
    const fam = SUPPOSE.moss;
    return (
      <ShotStage fam="moss" t={t} f={f} counter={C2}>
        <Push t={t}>
          <Earth cx={700} cy={500} r={r} />
          {[0, 1, 2, 3].map((i) => {
            if (t < 24 + i * 13) return null;
            const age = (t - 24 - i * 13) % 52;
            return <circle key={i} cx={700} cy={500} r={r + age * 3.2} fill="none" stroke={AIR} strokeWidth={4 * (1 - age / 52)} opacity={(1 - age / 52) * 0.55} />;
          })}
          <circle cx={700} cy={500} r={165} fill="none" stroke={CHALK} strokeWidth={5} strokeDasharray="18 12" opacity={0.95 * ease(t, 20, 40)} />
          <text x={700} y={508} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={30} letterSpacing={3} fill={CHALK} opacity={ease(t, 30, 50)}>OUR EARTH</text>
          <path d={`M 1010 1100 L 1030 ${ground + 20} Q 1040 ${ground - 4} 1080 ${ground - 6} L 1560 ${ground - 10} Q 1610 ${ground - 8} 1620 ${ground + 30} L 1640 1100 Z`} fill={fam.near} />
          <path d={`M 1040 ${ground - 2} Q 1300 ${ground - 16} 1600 ${ground - 6}`} stroke={fam.bounce} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.8} />
          <Lever x={1350} y={ground} len={240} angle={ang} plate="SIZE ×2" glow={0.3 + 0.3 * ease(t, 30, 45)} />
          <Lev x={levX} y={ground - 4} h={levH} frame={f} pose="pull" hands={{ front: hand, back: [hand[0] - 10, hand[1] + 10] }} lean={-10} eyes={t < 40 ? "squint" : "wide"} wind={0.9} shade="#9FB7A6" />
          <Ladder x={1800} top={330} bottom={1010} rungs={ACT_RUNGS} lit={t < 40 ? 3 : 4} frame={f} />
        </Push>
      </ShotStage>
    );
  },

  // ---- 4-02 eight cubes on a scale; the pull arrow doubles
  "4-02": ({ t, f }) => {
    const s = 95, a = s * 0.866, b = s * 0.5, x0 = 760, y0 = 360;
    const cubes: { i: number; j: number; k: number }[] = [];
    for (let k = 0; k < 2; k++) for (const [i, j] of [[0, 0], [1, 0], [0, 1], [1, 1]]) cubes.push({ i, j, k });
    const grow = ease(t, 30, 66);
    const L = 170 * (1 + grow);
    const ax = 1240, ay = 300;
    const bobA = grow >= 1 ? Math.sin(t / 3.4) * 6 : 0;
    const needle = mix(-55, 15, grow) + Math.sin(t / 2.6) * 3;
    return (
      <ShotStage fam="chalk" t={t} f={f} counter={C2}>
        <Push t={t}>
          <ellipse cx={x0} cy={760} rx={300} ry={20} fill="#6B8061" opacity={0.3} />
          <path d={rrect(x0 - 260, 640, 520, 110, 34)} fill={TERRA} />
          <path d={rrect(x0 - 260, 640, 520, 30, 15)} fill={TERRA_LIT} opacity={0.6} />
          <circle cx={x0} cy={700} r={34} fill={CHALK} stroke={TERRA_DEEP} strokeWidth={4} />
          <path d={`M ${x0} 700 L ${x0 + Math.sin((needle * Math.PI) / 180) * 26} ${700 - Math.cos((needle * Math.PI) / 180) * 26}`} stroke={INK} strokeWidth={5} strokeLinecap="round" />
          <path d={rrect(x0 - 240, 620, 480, 24, 12)} fill={CHALK_SHADE} />
          {cubes.map((c, n) => {
            const p = pop(t, 2 + n * 3.5, 10);
            if (p <= 0) return null;
            const cx = x0 + (c.i - c.j) * a;
            const cy = y0 + (c.i + c.j) * b - c.k * s + 8 - (1 - Math.min(1, p)) * 80;
            return <Cube key={n} x={cx} y={cy} s={s} op={Math.min(1, p * 1.5)} hi={c.k === 1} />;
          })}
          <Big x={300} y={560} size={170} fill={INK} opacity={ease(t, 26, 36)}>×8</Big>
          <text x={300} y={610} textAnchor="middle" fontFamily={ST_FONT} fontWeight={800} fontSize={28} letterSpacing={4} fill={SUPPOSE.chalk.dim} opacity={ease(t, 26, 36)}>THE MASS</text>
          <text x={ax} y={ay - 30} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={34} letterSpacing={4} fill={INK}>PULL</text>
          <path d={`M ${ax} ${ay} L ${ax} ${ay + L - 40 + bobA}`} stroke={TERRA} strokeWidth={30} strokeLinecap="round" />
          <path d={`M ${ax - 46} ${ay + L - 52 + bobA} L ${ax} ${ay + L + 16 + bobA} L ${ax + 46} ${ay + L - 52 + bobA} Z`} fill={TERRA} stroke={TERRA} strokeWidth={10} strokeLinejoin="round" />
          <path d={`M ${ax + 50} ${ay + 170} H ${ax + 130}`} stroke={INK} strokeWidth={4} strokeDasharray="10 8" opacity={ease(t, 34, 44) * 0.8} />
          <text x={ax + 140} y={ay + 180} fontFamily={ST_FONT} fontWeight={800} fontSize={26} letterSpacing={2} fill={SUPPOSE.chalk.dim} opacity={ease(t, 34, 44)}>TODAY</text>
        </Push>
      </ShotStage>
    );
  },

  // ---- 4-03 Lev lifts a bucket; a ghost second bucket appears
  "4-03": ({ t, f }) => {
    const x = 820, h = 280, s = h / 170;
    const lift = ease(t, 6, 40);
    const shake = lift >= 1 ? Math.sin(t * 1.3) * 3 : 0;
    const handL: Pt = [44, mix(-71, -108, lift) + shake / s];
    const [hx, hy] = levHand(x, SAGE_G, h, handL);
    const g = ease(t, 44, 76);
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C2}>
        <Push t={t}>
          <SageSet />
          <Lev x={x} y={SAGE_G} h={h} frame={f} pose="stand" hands={{ front: handL, back: [handL[0] - 12, handL[1] + 8] }} lean={-5} eyes={lift < 0.3 ? "open" : "squint"} wind={0.4} outline={INK} />
          <Bucket x={hx + 2} y={hy - 2} s={1.15} slosh={Math.sin(t / 4) * 4} />
          {g > 0 ? <Bucket x={hx + 70 + Math.sin(t / 5) * 3} y={hy + 16} s={1.15} ghost={g * (0.75 + 0.2 * Math.sin(t / 6))} /> : null}
          {lift > 0.6 ? <Puffs x={x + 50 * s} y={SAGE_G - 150 * s} f={t} color={SUPPOSE.sage.dim} /> : null}
        </Push>
      </ShotStage>
    );
  },

  // ---- 4-04 a ghost second Lev hops onto Lev's back; Lev staggers
  "4-04": ({ t, f }) => {
    const x = 900, h = 280, s = h / 170;
    const hop = ease(t, 0, 24);
    const home: Pt = [x - 40 * s, SAGE_G - 78 * s];
    const start: Pt = [x - 420, SAGE_G];
    const gx = mix(start[0], home[0], hop);
    const gy = mix(start[1], home[1], hop) - Math.sin(hop * Math.PI) * 220;
    const since = Math.max(0, t - 24);
    const st = t >= 24 ? Math.exp(-since / 16) : 0;
    const lean = st * 9 * Math.sin(since / 2.4) + (t >= 24 ? 4 : 0);
    const sx = st * 14 * Math.sin(since / 3.1 + 1);
    const sq = t >= 24 ? 1 - 0.08 * st : 1;
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C2}>
        <Push t={t}>
          <SageSet />
          <g transform={`translate(${x + sx} ${SAGE_G}) scale(${1 + (1 - sq) * 0.5} ${sq}) translate(${-x} ${-SAGE_G})`}>
            <g transform={`rotate(${lean * 0.6} ${x} ${SAGE_G})`}>
              <Ghost x={gx} y={gy} h={h * 0.92} f={f} op={0.55} />
            </g>
            <Lev x={x} y={SAGE_G} h={h} frame={f} pose={t < 24 ? "stand" : "shrug"} lean={lean} eyes={t < 22 ? "up" : "wide"} tilt={t < 22 ? -10 : 0} wind={0.4} outline={INK} />
          </g>
        </Push>
      </ShotStage>
    );
  },

  // ---- 4-05 Lev walks slowly carrying the ghost; the ground scrolls
  "4-05": ({ t, f }) => {
    const x = 900, h = 280, s = h / 170;
    const ph = (t / 15) * Math.PI;
    const bob = -Math.abs(Math.sin(ph)) * 9;
    const rock = Math.sin(ph) * 3;
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C2}>
        <Push t={t}>
          <SageSet scroll={t * 3.2} />
          <g transform={`translate(0 ${bob}) rotate(${rock} ${x} ${SAGE_G})`}>
            <g transform={`translate(0 ${Math.sin(ph + 0.8) * 4})`}>
              <Ghost x={x - 40 * s} y={SAGE_G - 78 * s} h={h * 0.92} f={f} op={0.55} />
            </g>
            <Lev x={x} y={SAGE_G} h={h} frame={f} pose="stand" hands={{ front: [20, -96], back: [-30, -88] }} lean={7} eyes="squint" tilt={6} wind={0.7} outline={INK} />
          </g>
          <Puffs x={x + 54 * s} y={SAGE_G - 148 * s + bob} f={t} color={SUPPOSE.sage.dim} />
        </Push>
      </ShotStage>
    );
  },

  // ---- 4-06 the beach again: the sightline draws out to 6.6 km
  "4-06": ({ t, f }) => {
    const fam = SUPPOSE.sage;
    const hz = (x: number) => 640 - 16 * Math.sin((x / 1920) * Math.PI);
    const lx = 300, ly = 752, lh = 120, s = lh / 170;
    const eye: Pt = [lx + 16 * s, ly - 145 * s];
    const end: Pt = [1600, hz(1600) - 2];
    const p = ease(t, 10, 58);
    const hx = mix(eye[0], end[0], p), hy = mix(eye[1], end[1], p);
    const lab = pop(t, 54, 12);
    const sea = (dy: number) => `M -60 ${hz(-60) + dy} ${Array.from({ length: 21 }, (_, i) => `L ${-60 + i * 102} ${hz(-60 + i * 102) + dy}`).join(" ")} L 1980 1100 L -60 1100 Z`;
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C2}>
        <Push t={t}>
          <Bloom x={1300} y={420} r={380} color={fam.light} strength={0.7} />
          <path d={sea(0)} fill={OCEAN} />
          <path d={sea(40)} fill="#5AA3C0" opacity={0.5} />
          {Array.from({ length: 18 }, (_, i) => {
            const wy = 680 + (i % 6) * 62;
            const wx = ((i * 331 - t * (1.6 + (i % 3) * 0.6)) % 2200 + 2200) % 2200 - 140;
            return <path key={i} d={`M ${wx} ${wy} q 22 -8 44 0`} stroke={AIR} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.6} />;
          })}
          <path d="M -60 770 C 200 740 480 760 700 820 C 840 860 920 950 960 1100 L -60 1100 Z" fill={SAND} />
          <path d="M -60 770 C 200 740 480 760 700 820 C 840 860 920 950 960 1100" stroke={CHALK} strokeWidth={6 + Math.sin(t / 5) * 2} fill="none" opacity={0.75} />
          <Lev x={lx} y={ly} h={lh} frame={f} pose="stand" eyes="open" wind={0.6} outline={INK} />
          <path d={`M ${eye[0]} ${eye[1]} L ${hx} ${hy}`} stroke={CHALK} strokeWidth={5} strokeDasharray="18 12" strokeDashoffset={-t * 2} strokeLinecap="round" />
          <circle cx={hx} cy={hy} r={9} fill={CHALK} />
          {p >= 1 ? <circle cx={end[0]} cy={end[1]} r={10 + ((t * 1.2) % 40)} fill="none" stroke={CHALK} strokeWidth={4} opacity={1 - ((t * 1.2) % 40) / 40} /> : null}
          {lab > 0 ? (
            <g transform={`translate(960 600) scale(${lab}) translate(-960 -600)`}>
              <Big x={960} y={590} size={120} fill={INK}>6.6 km</Big>
              <STPill x={960} y={730} text="OUR SUM" align="middle" />
            </g>
          ) : null}
        </Push>
      </ShotStage>
    );
  },

  // ---- 4-07 pull back: this Earth's gentle curve vs the old chalk curve
  "4-07": ({ t, f }) => {
    const z = mix(3.2, 1, ease(t, 0, 104));
    const P: Pt = [960, 600];
    return (
      <ShotStage fam="moss" t={t} f={f} counter={C2}>
        <g transform={`translate(${P[0]} ${P[1]}) scale(${z}) translate(${-P[0]} ${-P[1]})`}>
          <Earth cx={960} cy={600 + 1500} r={1500} seed={6} />
          <circle cx={960} cy={600 + 750} r={750} fill="none" stroke={CHALK} strokeWidth={5 / z} strokeDasharray={`${18 / z} ${12 / z}`} opacity={0.95} />
          <Lev x={960} y={598} h={60} frame={f} pose="stand" eyes="up" wind={0.5} shade="#9FB7A6" />
        </g>
        <text x={330} y={800} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={32} letterSpacing={3} fill={CHALK} opacity={ease(t, 80, 100)}>OUR EARTH</text>
        <text x={1480} y={560} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={32} letterSpacing={3} fill={LIME} opacity={ease(t, 86, 106)}>2× EARTH</text>
      </ShotStage>
    );
  },

  // ---- 4-08 one land-and-sea tile becomes four
  "4-08": ({ t, f }) => {
    const S = 300, G = 330, ox = 640, oy = 230;
    const sp = ease(t, 36, 96);
    const intro = pop(t, 0, 18);
    const shift = (1 - sp) * (G / 2);
    const lab = pop(t, 96, 14);
    const pos: Pt[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const c = ox + G / 2 + S / 2 - G / 2 + G / 2, cyy = oy + G / 2 + S / 2;
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C2}>
        <Push t={t}>
          <g transform={`translate(${c} ${cyy}) scale(${intro * mix(1.25, 1, sp)}) translate(${-c} ${-cyy})`}>
            {pos
              .map(([i, j], n) => {
                if (n > 0 && sp <= 0) return null;
                const x = ox + i * G * sp + shift;
                const y = oy + j * G * sp + shift;
                return (
                  <g key={n} opacity={n === 0 ? 1 : Math.min(1, sp * 3)}>
                    <Tile x={x} y={y} s={S} f={f + n * 37} seed={n} />
                  </g>
                );
              })
              .reverse()}
          </g>
          {lab > 0 ? (
            <g transform={`translate(1580 520) scale(${lab}) translate(-1580 -520)`}>
              <Big x={1580} y={570} size={220} fill={SUPPOSE.sage.text}>×4</Big>
              <text x={1580} y={640} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={36} letterSpacing={5} fill={SUPPOSE.sage.dim}>LAND AND SEA</text>
            </g>
          ) : null}
        </Push>
      </ShotStage>
    );
  },

  // ---- 4-09 the air band over the right range squashes down to a sliver
  "4-09": ({ t, f }) => {
    const k = mix(1, 0.5, ease(t, 16, 130));
    return (
      <ShotStage fam="clay" t={t} f={f} counter={C2}>
        <Push t={t}>
          <ClayBack f={f} />
          <AirDots side="L" k={1} f={f} />
          <AirDots side="R" k={k} f={f} />
          <Mountain cx={520} />
          <Mountain cx={1400} seed={20} />
          <ClayFloor />
          <Lev x={1090} y={CLAY_GROUND + 2} h={120} frame={f} pose="stand" eyes="up" tilt={-14} wind={0.3} shade="#D8B8A2" />
        </Push>
      </ShotStage>
    );
  },

  // ---- 4-10 KEY ART 2, left: 1/3 of the air at the summit
  "4-10": ({ t, f }) => (
    <ShotStage fam="clay" t={t} f={f} counter={C2}>
      <Push t={t}>
        <ClayBack f={f} />
        <AirDots side="L" k={1} f={f} />
        <AirDots side="R" k={0.5} f={f} />
        <Mountain cx={520} />
        <Mountain cx={1400} seed={20} />
        <ClayFloor />
        <SlideFlag x={520} y={CLAY_PEAK} big="1/3" small="OF THE AIR LEFT UP HERE" frame={f} card={ease(t, 8, 34)} pole={ease(t, 0, 12)} />
        <Lev x={1090} y={CLAY_GROUND + 2} h={120} frame={f} pose="point" hands={{ front: [60, -126] }} eyes="up" tilt={-14} wind={0.3} shade="#D8B8A2" facing={-1} />
      </Push>
    </ShotStage>
  ),

  // ---- 4-11 KEY ART 2 complete: 1/8 at the same height on 2× Earth
  "4-11": ({ t, f }) => (
    <ShotStage fam="clay" t={t} f={f} counter={C2}>
      <Push t={t}>
        <ClayBack f={f} />
        <AirDots side="L" k={1} f={f} />
        <AirDots side="R" k={0.5} f={f} />
        <Mountain cx={520} />
        <Mountain cx={1400} seed={20} />
        <ClayFloor />
        <SlideFlag x={520} y={CLAY_PEAK} big="1/3" small="OF THE AIR LEFT UP HERE" frame={f} card={1} />
        <SlideFlag x={1400} y={CLAY_PEAK} big="1/8" small="SAME HEIGHT, 2× EARTH" frame={f} side={-1} card={ease(t, 6, 32)} pole={ease(t, 0, 10)} />
        {pop(t, 36, 12) > 0 ? (
          <g transform={`translate(1384 54) scale(${pop(t, 36, 12)}) translate(-1384 -54)`}>
            <STPill x={1384} y={54} text="OUR SUM" align="end" />
          </g>
        ) : null}
        <Lev x={1090} y={CLAY_GROUND + 2} h={120} frame={f} pose="stand" eyes="up" tilt={-14 + Math.sin(t / 12) * 6} wind={0.3} shade="#D8B8A2" />
      </Push>
    </ShotStage>
  ),

  // ---- 4-12 on the right, a flag climbs to 5 km: already as thin as the left summit
  "4-12": ({ t, f }) => {
    const y5 = CLAY_GROUND - 5 * PX_KM;
    const cy = mix(CLAY_GROUND - 6, y5, ease(t, 12, 120));
    const [fx, fy] = flankAt(1400, 380, cy);
    const arrived = ease(t, 116, 140);
    return (
      <ShotStage fam="clay" t={t} f={f} counter={C2}>
        <Push t={t}>
          <ClayBack f={f} />
          <AirDots side="L" k={1} f={f} />
          <AirDots side="R" k={0.5} f={f} />
          <Mountain cx={520} />
          <Mountain cx={1400} seed={20} />
          <ClayFloor />
          <SlideFlag x={520} y={CLAY_PEAK} big="1/3" small="OF THE AIR LEFT UP HERE" frame={f} card={1} />
          <path d={`M ${fx} ${fy} H 1820`} stroke={CHALK} strokeWidth={4} strokeDasharray="14 10" strokeDashoffset={-t * 2} opacity={arrived * 0.85} />
          <circle cx={fx} cy={fy} r={7} fill={INK} />
          <SlideFlag x={fx} y={fy} big="5 km" small="ALREADY 1/3 OF THE AIR" frame={f} side={-1} card={arrived} />
          <Lev x={965} y={CLAY_GROUND + 2} h={120} frame={f} pose="stand" eyes="up" tilt={mix(0, -16, ease(t, 10, 120))} wind={0.3} shade="#D8B8A2" />
        </Push>
      </ShotStage>
    );
  },

  // ---- 4-13 the right mountain shrinks to half
  "4-13": ({ t, f }) => {
    const k = mix(1, 0.5, ease(t, 12, 90));
    const peak = CLAY_GROUND - (CLAY_GROUND - CLAY_PEAK) * k;
    return (
      <ShotStage fam="clay" t={t} f={f} counter={C2}>
        <Push t={t}>
          <ClayBack f={f} />
          <AirDots side="L" k={1} f={f} />
          <AirDots side="R" k={0.5} f={f} />
          <Mountain cx={520} />
          <Mountain cx={1400} seed={20} ghost />
          <Mountain cx={1400} seed={20} k={k} />
          <ClayFloor />
          <text x={1400} y={peak - 60} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={52} letterSpacing={3} fill={CHALK} opacity={ease(t, 70, 90)}>HALF AS TALL</text>
          <Lev x={965} y={CLAY_GROUND + 2} h={120} frame={f} pose="shrug" eyes={t > 80 ? "wide" : "up"} tilt={mix(-16, 0, ease(t, 12, 90))} wind={0.3} shade="#D8B8A2" />
        </Push>
      </ShotStage>
    );
  },

  // ---- 4-14 a ball thrown up from the giant Earth arcs back down; beat 2: a harder throw, still back down
  "4-14": ({ t, f }) => {
    const lx = 700, ly = surfY(lx);
    const lh = 130;
    const up = (a: number) => t >= a - 8 && t < a + 4;
    const handL: Pt = up(15) || up(120) ? [52, -146] : [40, -96];
    const [hx, hy] = rotAbout(levHand(lx, ly, lh, [52, -146]), [lx, ly], surfTilt(lx));
    const arc = (dx: number, H: number) => (tau: number): Pt => {
      const yl = surfY(hx + dx) - 16;
      return [hx + dx * tau, hy + (yl - hy) * tau - 4 * H * tau * (1 - tau)];
    };
    const A1 = arc(330, 300), A2 = arc(430, 560);
    const t1 = lin(t, 15, 75), t2 = lin(t, 120, 215);
    const roll = ease(t, 215, 250) * 60;
    const trail = (A: (u: number) => Pt, upTo: number) =>
      `M ${A(0).join(" ")} ` + Array.from({ length: 30 }, (_, i) => `L ${A((upTo * (i + 1)) / 30).join(" ")}`).join(" ");
    const b1 = A1(t1);
    const b2: Pt = t2 >= 1 ? [A2(1)[0] + roll, surfY(A2(1)[0] + roll) - 16] : A2(t2);
    const thud = (at: number, p: Pt) => {
      const a = t - at;
      return a >= 0 && a < 16 ? <ellipse cx={p[0]} cy={p[1] + 14} rx={16 + a * 3} ry={5 + a * 0.6} fill="none" stroke={CHALK} strokeWidth={3} opacity={1 - a / 16} /> : null;
    };
    return (
      <ShotStage fam="moss" t={t} f={f} counter={C2}>
        <Push t={t}>
          <Earth cx={BIG.cx} cy={BIG.cy} r={BIG.r} seed={7} />
          {t1 > 0 ? <path d={trail(A1, t1)} stroke={AIR} strokeWidth={4} strokeDasharray="4 12" strokeLinecap="round" fill="none" opacity={t >= 120 ? 0.35 : 0.7} /> : null}
          {t2 > 0 ? <path d={trail(A2, t2)} stroke={AIR} strokeWidth={4} strokeDasharray="4 12" strokeLinecap="round" fill="none" opacity={0.7} /> : null}
          <g transform={`rotate(${surfTilt(lx)} ${lx} ${ly})`}>
            <Lev x={lx} y={ly} h={lh} frame={f} pose="point" hands={{ front: handL }} eyes="up" tilt={-10} wind={0.4} shade="#9FB7A6" />
          </g>
          {t >= 15 ? <Ball x={b1[0]} y={b1[1]} /> : <Ball x={hx} y={hy} />}
          {t >= 100 ? <Ball x={t2 > 0 ? b2[0] : hx} y={t2 > 0 ? b2[1] : hy} /> : null}
          {thud(75, A1(1))}
          {thud(215, A2(1))}
        </Push>
      </ShotStage>
    );
  },

  // ---- 4-15 readout: ESCAPE SPEED rolls 11.2 → 22.4 km/s
  "4-15": ({ t, f }) => {
    const v = mix(11.2, 22.4, ease(t, 8, 104));
    const lx = 1350, ly = surfY(lx);
    const [hx, hy] = rotAbout(levHand(lx, ly, 130, [44, -150]), [lx, ly], surfTilt(lx));
    const go = lin(t, 112, 160);
    const P = (g: number): Pt => [mix(hx, 1520, g), mix(hy, -120, Math.pow(g, 0.9))];
    const done = pop(t, 104, 12);
    return (
      <ShotStage fam="moss" t={t} f={f} counter={C2}>
        <Push t={t}>
          <Earth cx={BIG.cx} cy={BIG.cy} r={BIG.r} seed={7} />
          <g transform={`rotate(${surfTilt(lx)} ${lx} ${ly})`}>
            <Lev x={lx} y={ly} h={130} frame={f} pose="point" hands={{ front: [44, -150] }} eyes={go > 0 ? "wide" : "up"} tilt={-12} wind={0.5} shade="#9FB7A6" />
          </g>
          {go > 0 && go < 1 ? (
            <g>
              {[1, 2, 3, 4, 5].map((i) => {
                const [x, y] = P(Math.max(0, go - i * 0.03));
                return <circle key={i} cx={x} cy={y} r={14 - i * 2} fill={TERRA_LIT} opacity={0.5 - i * 0.08} />;
              })}
              <Ball x={P(go)[0]} y={P(go)[1]} />
            </g>
          ) : go <= 0 ? <Ball x={hx} y={hy} /> : null}
        </Push>
        <Readout x={960} y={110} label="ESCAPE SPEED" value={v.toFixed(1)} unit="km/s" w={640} />
        <text x={960} y={470} textAnchor="middle" fontFamily={ST_FONT} fontWeight={800} fontSize={30} letterSpacing={3} fill={SUPPOSE.moss.dim}>TODAY 11.2 km/s</text>
        {done > 0 ? (
          <g transform={`translate(960 530) scale(${done}) translate(-960 -530)`}>
            <STPill x={960} y={530} text="OUR SUM" align="middle" />
          </g>
        ) : null}
      </ShotStage>
    );
  },

  // ---- 4-16 a little rocket circles an orbit ring; beat 2: the Earth swells, the rocket flies twice as fast
  "4-16": ({ t, f }) => {
    const cx = 600, cy = 560;
    const sw = ease(t, 120, 156);
    const r = mix(170, 340, sw);
    const R = r * 1.3;
    const th = (t / 110) * TAU;
    const rx = cx + R * Math.cos(th), ry = cy + R * Math.sin(th);
    const deg = (th * 180) / Math.PI;
    const after = t >= 140;
    const swap = pop(t, 140, 12);
    return (
      <ShotStage fam="olive" t={t} f={f} counter={C2}>
        <Push t={t}>
          <Earth cx={cx} cy={cy} r={r} seed={4} />
          {sw > 0.5 ? <circle cx={cx} cy={cy} r={170} fill="none" stroke={CHALK} strokeWidth={4} strokeDasharray="16 11" opacity={ease(t, 150, 170) * 0.9} /> : null}
          <circle cx={cx} cy={cy} r={R} fill="none" stroke={CHALK} strokeWidth={3} strokeDasharray="6 12" opacity={0.45} />
          {[0, 1, 2].map((i) => (
            <path key={i} d={arcPath(cx, cy, R, deg - 70 + i * 22, deg - 50 + i * 22 + 2)} stroke={TERRA_LIT} strokeWidth={7 - i} fill="none" strokeLinecap="round" opacity={0.2 + i * 0.22} />
          ))}
          <Rocket x={rx} y={ry} h={62} rot={deg + 180} flame={1} frame={t} />
        </Push>
        <g transform={`translate(1400 470) scale(${after ? swap : 1}) translate(-1400 -470)`}>
          <Readout x={1400} y={320} label={after ? "ORBIT SPEED · 2× EARTH" : "ORBIT SPEED · TODAY"} value={after ? "15.8" : "7.9"} unit="km/s" w={640} />
        </g>
        {after ? (
          <g opacity={ease(t, 146, 160)}>
            <text x={1400} y={680} textAnchor="middle" fontFamily={ST_FONT} fontWeight={800} fontSize={30} letterSpacing={3} fill={SUPPOSE.olive.dim}>TODAY 7.9 km/s</text>
            <STPill x={1400} y={740} text="OUR SUM" align="middle" />
          </g>
        ) : null}
      </ShotStage>
    );
  },

  // ---- 4-17 curve: fuel vs speed, bending up steeply; beat 2: today's and the 2× Earth marks
  "4-17": ({ t, f }) => {
    const fam = SUPPOSE.chalk;
    const X = (v: number) => 300 + v * 70.6;
    const Y = (v: number) => 900 - (Math.exp(v / 4.41) - 1) * 19.4;
    const vEnd = 16.4 * ease(t, 6, 104);
    const pts = Array.from({ length: 60 }, (_, i) => (vEnd * i) / 59);
    const d = "M " + pts.map((v) => `${X(v).toFixed(1)} ${Y(v).toFixed(1)}`).join(" L ");
    const marks: [number, string, number][] = [[7.9, "TODAY", 112], [15.8, "2× EARTH", 126]];
    return (
      <ShotStage fam="chalk" t={t} f={f} counter={C2}>
        <Push t={t}>
          <g stroke={fam.far} strokeWidth={1.4} opacity={0.5}>
            {Array.from({ length: 21 }, (_, i) => <path key={i} d={`M ${300 + i * 60} 120 V 900`} />)}
            {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M 300 ${900 - i * 60} H 1500`} />)}
          </g>
          <path d="M 300 120 V 900 H 1520" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <text x={900} y={1000} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={30} letterSpacing={4} fill={INK}>SPEED, km/s</text>
          <text x={240} y={520} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={30} letterSpacing={4} fill={INK} transform="rotate(-90 240 520)">FUEL NEEDED</text>
          {marks.map(([v, lab, at]) => {
            const o = ease(t, at, at + 14);
            return o > 0 ? (
              <g key={lab} opacity={o}>
                <path d={`M ${X(v)} 900 V ${Y(v)}`} stroke={INK} strokeWidth={3} strokeDasharray="8 8" strokeDashoffset={-t * 1.6} />
                <path d={`M ${X(v)} 900 v 16`} stroke={INK} strokeWidth={4} />
                <text x={X(v)} y={950} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={30} fill={INK}>{v.toFixed(1)}</text>
                <circle cx={X(v)} cy={Y(v)} r={12} fill={TERRA} />
                <text x={X(v) - 24} y={Y(v) - 18} textAnchor="end" fontFamily={ST_FONT} fontWeight={900} fontSize={28} letterSpacing={2} fill={TERRA_DEEP}>{lab}</text>
              </g>
            ) : null;
          })}
          <path d={d} stroke={TERRA} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <Bloom x={X(vEnd)} y={Y(vEnd)} r={60} color={TERRA} strength={0.5 + 0.3 * Math.sin(t / 4)} />
          <circle cx={X(vEnd)} cy={Y(vEnd)} r={13 + Math.sin(t / 3) * 2} fill={TERRA_DEEP} />
          <Lev x={1700} y={900} h={170} frame={f} facing={-1} pose="point" hands={{ front: [60, -130 + Math.sin(t / 6) * 6] }} eyes="up" tilt={6} wind={0.2} outline={INK} />
        </Push>
      </ShotStage>
    );
  },

  // ---- 4-18 rocket on a pad; the fuel tube fills to 5× the empty rocket
  "4-18": ({ t, f }) => {
    const L = 5 * U * ease(t, 10, 96);
    const lab = pop(t, 96, 12);
    return (
      <ShotStage fam="moss" t={t} f={f} counter={C2}>
        <Push t={t}>
          <PadSet />
          <Rocket x={740} y={PAD - 6} h={U} />
          <path d={`M 760 ${PAD - 6 - U} H ${BX - 12}`} stroke={CHALK} strokeWidth={3} strokeDasharray="8 8" opacity={0.6} />
          <FuelTube L={L} f={t} top={180} />
          <Lev x={470} y={PAD + 12} h={110} frame={f} pose="stand" eyes="up" tilt={-8 - ease(t, 10, 96) * 10} wind={0.4} shade="#9FB7A6" />
          {lab > 0 ? (
            <g transform={`translate(1090 420) scale(${lab}) translate(-1090 -420)`}>
              <Big x={1090} y={440} size={160} anchor="start">5×</Big>
              <text x={1094} y={492} fontFamily={ST_FONT} fontWeight={900} fontSize={32} letterSpacing={3} fill={CHALK}>THE EMPTY ROCKET</text>
              <STPill x={1094} y={548} text="IDEAL" />
            </g>
          ) : null}
        </Push>
      </ShotStage>
    );
  },

  // ---- 4-19 the fuel keeps rising off the top; the camera tilts up after it to 35×
  "4-19": ({ t, f }) => {
    const L = mix(5 * U, 35 * U, ease(t, 6, 146));
    const oy = Math.max(0, L - 600);
    const lab = pop(t, 146, 12);
    const fam = SUPPOSE.moss;
    const sy = (oy * 0.2) % 1080;
    return (
      <ShotStage fam="moss" t={t} f={f} counter={C2} drift={0.4}>
        <g transform={`translate(0 ${sy})`}>
          <Stars frame={f} n={70} w={1920} h={1080} color={fam.light} seed={21} size={2.2} />
          <Stars frame={f} n={70} y={-1080} w={1920} h={1080} color={fam.light} seed={21} size={2.2} />
        </g>
        <g transform={`translate(0 ${oy})`}>
          <PadSet />
          <Rocket x={740} y={PAD - 6} h={U} />
          <FuelTube L={L} f={t} top={PAD - 36 * U - 60} />
          <text x={BX + BW + 56} y={PAD - 5 * U + 10} fontFamily={ST_FONT} fontWeight={900} fontSize={34} fill={CHALK} opacity={0.8}>5×</text>
        </g>
        <g opacity={0.9}>
          <Rocket x={110} y={1000} h={70} />
          <path d="M 160 978 h 34" stroke={CHALK} strokeWidth={4} strokeLinecap="round" />
          <text x={210} y={988} fontFamily={ST_FONT} fontWeight={800} fontSize={26} letterSpacing={2} fill={CHALK}>ONE TICK = THE EMPTY ROCKET</text>
        </g>
        {lab > 0 ? (
          <g transform={`translate(1090 300) scale(${lab}) translate(-1090 -300)`}>
            <Big x={1090} y={340} size={170} anchor="start" fill={CHALK}>35×</Big>
            <text x={1094} y={394} fontFamily={ST_FONT} fontWeight={900} fontSize={32} letterSpacing={3} fill={CHALK}>THE EMPTY ROCKET</text>
            <STPill x={1094} y={450} text="IDEAL" />
          </g>
        ) : null}
      </ShotStage>
    );
  },

  // ---- 4-20 Lev beside a tiny rocket under a towering, wobbling tank; shrugs
  "4-20": ({ t, f }) => {
    const ground = 900;
    const rh = 70, tb = ground - rh - 8;
    const wob = Math.sin(t / 9) * 1.6 + Math.sin(t / 4.3) * 0.4;
    const k = 0.5 - 0.5 * Math.cos(t / 9);
    const front: Pt = [mix(24, 46, k), mix(-58, -100, k)];
    const back: Pt = [mix(-24, -46, k), mix(-58, -100, k)];
    const fam = SUPPOSE.moss;
    const TW = 280, TH = 690;
    return (
      <ShotStage fam="moss" t={t} f={f} counter={C2}>
        <Push t={t}>
          <path d={`M -60 ${ground} C 500 ${ground - 16} 1400 ${ground - 8} 1980 ${ground + 6} L 1980 1100 L -60 1100 Z`} fill={fam.near} />
          <path d={`M -60 ${ground} C 500 ${ground - 16} 1400 ${ground - 8} 1980 ${ground + 6}`} stroke={fam.bounce} strokeWidth={5} fill="none" opacity={0.7} />
          <ellipse cx={1000} cy={ground + 6} rx={200} ry={16} fill="#000" opacity={0.25} />
          <g transform={`translate(1000 ${ground}) scale(1 ${1 - 0.03 * k}) translate(-1000 ${-ground})`}>
            <Rocket x={1000} y={ground} h={rh} />
          </g>
          <g transform={`rotate(${wob} 1000 ${tb})`}>
            <path d={`M 1000 ${tb} L 920 ${tb - 40} M 1000 ${tb} L 1080 ${tb - 40}`} stroke={INK} strokeWidth={8} strokeLinecap="round" />
            <path d={rrect(1000 - TW / 2, tb - 40 - TH, TW, TH, 64)} fill={TERRA} />
            <ellipse cx={1000} cy={tb - 40 - TH + 10} rx={TW * 0.36} ry={16} fill={TERRA_LIT} opacity={0.5} />
            <path d={rrect(1000 + TW * 0.12, tb - 40 - TH + 30, TW * 0.36, TH - 60, 70)} fill={TERRA_DEEP} opacity={0.45} />
            <path d={rrect(1000 - TW * 0.38, tb - 40 - TH + 60, 34, TH - 120, 17)} fill={TERRA_LIT} opacity={0.6} />
            {[0.22, 0.5, 0.78].map((u) => (
              <path key={u} d={rrect(1000 - TW / 2 - 6, tb - 40 - TH + TH * u, TW + 12, 22, 10)} fill={BRASS} opacity={0.9} />
            ))}
          </g>
          <Lev x={700} y={ground - 2} h={130} frame={f} pose="stand" hands={{ front, back }} eyes={k > 0.6 ? "closed" : "open"} tilt={k * 12} wind={0.3} shade="#9FB7A6" />
        </Push>
      </ShotStage>
    );
  },

  // ---- 4-21 the Moon races round the giant Earth; beat 2: today's Moon, ghosted, at its old pace
  "4-21": ({ t, f }) => {
    const cx = 900, cy = 560, rx = 620, ry = 250;
    const th = (t / 80) * TAU - 1;
    const th2 = (t / 226) * TAU - 1;
    const at = (a: number): Pt => [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
    const g = ease(t, 106, 126);
    const moon = (a: number, ghost: boolean) => {
      const [x, y] = at(a);
      const sc = 0.82 + 0.18 * Math.sin(a);
      return <MoonBall x={x} y={y} r={46 * sc} ghost={ghost} />;
    };
    const trail = [1, 2, 3, 4, 5, 6].map((i) => {
      const [x, y] = at(th - i * 0.09);
      return <circle key={i} cx={x} cy={y} r={36 - i * 4} fill="#E4E2CF" opacity={0.28 - i * 0.04} />;
    });
    const behind = (a: number) => Math.sin(a) < 0;
    return (
      <ShotStage fam="olive" t={t} f={f} counter={C2}>
        <Push t={t}>
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={CHALK} strokeWidth={3} strokeDasharray="6 12" opacity={0.4} />
          {behind(th) ? <g>{trail}{moon(th, false)}</g> : null}
          {g > 0 && behind(th2) ? <g opacity={g}>{moon(th2, true)}</g> : null}
          <Earth cx={cx} cy={cy} r={230} seed={8} />
          {!behind(th) ? <g>{trail}{moon(th, false)}</g> : null}
          {g > 0 && !behind(th2) ? <g opacity={g}>{moon(th2, true)}</g> : null}
          {g > 0 ? (
            <text x={at(th2)[0]} y={at(th2)[1] - 66} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={26} letterSpacing={3} fill={SUPPOSE.olive.dim} opacity={g}>TODAY'S PACE</text>
          ) : null}
        </Push>
      </ShotStage>
    );
  },

  // ---- 4-22 the calendar flips 27 → 9.7 days
  "4-22": ({ t, f }) => {
    const F0 = 16, P = 13, N = 6;
    const idx = Math.floor((t - F0) / P);
    const flipping = t >= F0 && idx < N;
    const p = flipping ? (t - F0 - idx * P) / P : 0;
    const done = t >= F0 + N * P;
    const under = done ? <CalPage value="9.7" /> : t < F0 ? <CalPage value="27" /> : idx === N - 1 ? <CalPage value="9.7" /> : <CalPage lines />;
    const top = flipping ? (idx === 0 ? <CalPage value="27" /> : <CalPage lines />) : null;
    const mth = (t / 60) * TAU;
    const mx = 900 + 390 * Math.cos(mth), my = 540 + 410 * Math.sin(mth);
    const fin = pop(t, F0 + N * P, 12);
    return (
      <ShotStage fam="olive" t={t} f={f} counter={C2}>
        <Push t={t}>
          <ellipse cx={900} cy={540} rx={390} ry={410} fill="none" stroke={CHALK} strokeWidth={3} strokeDasharray="6 12" opacity={0.3} />
          <path d={rrect(CAL.x + 10, CAL.y + 20, CAL.w, CAL.h, 24)} fill="#000" opacity={0.3} />
          {under}
          {top ? (
            <g transform={`translate(${CAL.x + CAL.w / 2 + p * 240} ${CAL.y + 80 - p * 90}) rotate(${p * 18}) scale(1 ${Math.max(0.02, Math.cos(p * Math.PI * 0.5))}) translate(${-(CAL.x + CAL.w / 2)} ${-(CAL.y + 80)})`} opacity={p < 0.55 ? 1 : 1 - (p - 0.55) * 2.2}>
              {top}
            </g>
          ) : null}
          <path d={rrect(CAL.x, CAL.y, CAL.w, 100, 24)} fill={TERRA} />
          <text x={CAL.x + CAL.w / 2} y={CAL.y + 66} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={30} letterSpacing={3} fill={CHALK}>ONE LAP OF THE MOON</text>
          {[CAL.x + 110, CAL.x + CAL.w - 110].map((x) => <rect key={x} x={x - 10} y={CAL.y - 26} width={20} height={52} rx={10} fill={INK} />)}
          <MoonBall x={mx} y={my} r={30} />
          {fin > 0 ? (
            <g opacity={Math.min(1, fin)}>
              <STPill x={900} y={900} text="OUR SUM" align="middle" />
              <text x={1360} y={480} fontFamily={ST_FONT} fontWeight={800} fontSize={28} letterSpacing={3} fill={SUPPOSE.olive.dim}>TODAY</text>
              <text x={1360} y={550} fontFamily={ST_FONT} fontWeight={900} fontSize={64} fill={SUPPOSE.olive.text}>27 DAYS</text>
              <path d={`M 1350 532 L ${1350 + 270 * ease(t, F0 + N * P + 6, F0 + N * P + 20)} 528`} stroke={TERRA} strokeWidth={8} strokeLinecap="round" />
            </g>
          ) : null}
        </Push>
      </ShotStage>
    );
  },

  // ---- 4-23 Lev climbs onto the ×2 rung, puffing; the rung above is blank
  "4-23": ({ t, f }) => {
    const LX = 1080, top = 120, bottom = 1000;
    const step = (bottom - top) / (ACT_RUNGS.length + 0.5);
    const ry = (i: number) => bottom - step * (i + 0.5);
    const c = ease(t, 8, 46) * 0.5 + ease(t, 58, 100) * 0.5;
    const climbing = t < 102;
    const feet = mix(ry(3), ry(4), c) - 4;
    const h = 150, s = h / 170;
    const reach = climbing ? Math.sin(t / 5) * 8 : 0;
    const hands = climbing
      ? { front: [22, (ry(5) - feet) / s + 10 + reach] as Pt, back: [-10, (ry(5) - feet) / s + 18 - reach] as Pt }
      : { front: [30, -92] as Pt, back: [-26, -70] as Pt };
    const blank = ease(t, 116, 140);
    return (
      <ShotStage fam="moss" t={t} f={f} counter={C2}>
        <Push t={t}>
          <Earth cx={480} cy={560} r={330} seed={3} />
          <circle cx={480} cy={560} r={165} fill="none" stroke={CHALK} strokeWidth={5} strokeDasharray="18 12" opacity={0.85} />
          <Ladder x={LX} top={top} bottom={bottom} rungs={ACT_RUNGS} lit={4} frame={f} width={170} />
          {blank > 0 ? (
            <g opacity={blank * (0.55 + 0.35 * Math.sin(t / 6))}>
              <path d={rrect(LX - 110, ry(5) - 34, 220, 68, 34)} fill="none" stroke={CHALK} strokeWidth={4} strokeDasharray="12 10" strokeDashoffset={-t * 2} />
            </g>
          ) : null}
          <Lev x={LX} y={feet} h={h} frame={f} pose="stand" hands={hands} lean={climbing ? 4 : 0} eyes={climbing ? "squint" : t < 140 ? "closed" : "up"} tilt={climbing ? 0 : t < 140 ? 6 : -14} wind={0.5} shade="#9FB7A6" />
          {t > 40 ? <Puffs x={LX + 40 * s} y={feet - 150 * s} f={t} /> : null}
        </Push>
      </ShotStage>
    );
  },
};
