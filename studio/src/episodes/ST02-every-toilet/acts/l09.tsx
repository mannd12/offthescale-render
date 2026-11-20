// ST02 act "l09" (What it really means, 9-01..9-14 + end card E-01): shot bodies keyed by storyboard id. Numbers on
// screen: 761,719 · 60,722 · 1.6 GAL (measured); 14 / 44 / 547 MILLION GAL [OUR SUM]; 1.23 / 3.34 MILLION L (one
// England match, not converted); the Counter rolling 341.8 MILLION → 0. Timings are fractions of d.
import React from "react";
import { ShotMap, ShotStage, ease, lin, mix, pop } from "../shot";
import { Bloom } from "../../../lib/illustrated/light";
import { rnd } from "../../../lib/illustrated/motion";
import { rrect, Pt } from "../../../lib/illustrated/shapes";
import { mixHex } from "../../../lib/illustrated/palette";
import { AIR, CHALK, INK, SUPPOSE, TERRA } from "../../../lib/suppose/palette";
import { Lev } from "../../../lib/suppose/lev";
import { Counter, Ladder, Lever, leverTip, STPill, Wordmark } from "../../../lib/suppose/devices";
import {
  about, Card, CREAM, fmtFlushes, House, Kettle, Knob, PaperGrid, Panel, Reservoir, rollLog, Spark, Stamp, Toilet, TV, Txt,
  USLand, WATER, WATER_DEEP, WATER_LIGHT, WaterTower,
} from "./l08-parts";
import { Blobs } from "./l08";

const CH = SUPPOSE.chalk;
const SAGE = SUPPOSE.sage;
const MOSS = SUPPOSE.moss;

// ------------------------------------------------------------------ the split board (9-01..9-05)
const PL = { x: 100, y: 120, w: 740, h: 840 };
const PR = { x: 1080, y: 120, w: 740, h: 840 };
const TINT_L = "#FBFCF4";
const TINT_R = mixHex(TERRA, "#FFFFFF", 0.86);
const CW = 320, CHh = 210;
const CARDS = [
  { x: 130, y: 270, big: "761,719", small: "NYC", size: 64 },
  { x: 470, y: 270, big: "60,722", small: "SEATTLE", size: 64 },
  { x: 130, y: 540, big: "NO CHANGE", small: "MIAMI", size: 46 },
  { x: 470, y: 540, big: "1.6 GAL", small: "STANDARD", size: 64 },
];
const CHIPS = ["14 MILLION GAL", "44 MILLION GAL", "547 MILLION GAL"];
const CHIP_Y = (i: number) => 300 + i * 122;
const JUDGE_L = { x: 260, y: 790 }, JUDGE_R = { x: 1240, y: 790 };

const MeasuredCards: React.FC<{ k: (i: number) => number }> = ({ k }) => (
  <g>{CARDS.map((c, i) => <Card key={i} x={c.x} y={c.y} w={CW} h={CHh} big={c.big} small={c.small} k={k(i)} rot={(i % 2 ? 1.5 : -1.5)} bigSize={c.size} />)}</g>
);
const Chip: React.FC<{ i: number; k: number; glow?: number }> = ({ i, k, glow = 0 }) => {
  if (k <= 0) return null;
  const x = PR.x + PR.w / 2, y = CHIP_Y(i);
  return (
    <g transform={about(x, y + 50, k)}>
      <path d={rrect(x - 320 + 6, y + 8, 640, 100, 50)} fill="#000" opacity={0.1} />
      <path d={rrect(x - 320, y, 640, 100, 50)} fill={mixHex("#FFFDF4", TERRA, glow * 0.25)} stroke={INK} strokeWidth={3.5} />
      <Txt x={x} y={y + 72} size={60}>{CHIPS[i]}</Txt>
    </g>
  );
};
const JudgeCard: React.FC<{ x: number; y: number; k?: number; rot?: number }> = ({ x, y, k = 1, rot = 0 }) => (
  <Card x={x} y={y} w={420} h={150} big="JUDGMENT" small="BURST-PIPE WARNINGS" k={k} rot={rot} bigSize={56} />
);
const Board: React.FC<{ slide?: number; dimL?: number; dimR?: number; children?: React.ReactNode }> = ({ slide = 1, dimL = 0, dimR = 0, children }) => (
  <g>
    <g transform={`translate(${(1 - slide) * -1000} 0)`}><Panel {...PL} title="MEASURED" tint={TINT_L} /></g>
    <g transform={`translate(${(1 - slide) * 1000} 0)`}><Panel {...PR} title="OUR MODEL" tint={TINT_R} /></g>
    {children}
    {dimL > 0 ? <path d={rrect(PL.x, PL.y, PL.w, PL.h, 30)} fill={CH.sky[0]} opacity={dimL} /> : null}
    {dimR > 0 ? <path d={rrect(PR.x, PR.y, PR.w, PR.h, 30)} fill={CH.sky[0]} opacity={dimR} /> : null}
  </g>
);
/** Lev in the gap between the panels */
const GapLev: React.FC<{ f: number; facing: 1 | -1; eyes?: "open" | "happy" | "wide" | "up"; pose?: "stand" | "point" | "shrug"; tilt?: number; s?: number; hands?: { front?: Pt; back?: Pt } }> = ({
  f, facing, eyes = "open", pose = "stand", tilt = 0, s = 1, hands,
}) => (
  <g transform={about(960, 960, s)}>
    <Lev x={960} y={960} h={190} frame={f} facing={facing} pose={pose} eyes={eyes} tilt={tilt} outline={INK} wind={0.25} hands={hands} />
  </g>
);

// ------------------------------------------------------------------ the match line (9-07, 9-08)
const bump = (u: number, c: number, w: number) => Math.exp(-(((u - c) / w) ** 2));
const H1 = 1.23 / 3.34;
const demand = (u: number) => 0.035 * Math.sin(u * 37) * Math.sin(u * 11 + 1) + H1 * bump(u, 0.42, 0.035) + bump(u, 0.9, 0.04);
const linePts = (x0: number, x1: number, base: number, H: number, u1: number, n = 220): Pt[] => {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const u = (i / n) * u1;
    out.push([x0 + (x1 - x0) * u, base - H * Math.max(-0.02, demand(u))]);
  }
  return out;
};
const ptsD = (p: Pt[]) => (p.length ? "M " + p.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(" L ") : "");

// ------------------------------------------------------------------ the lever pull-back (9-12) and lean (9-14)
const PIV: Pt = [1400, 920];
const LEN = 170;
const LH = 250, LS = LH / 170;

// ------------------------------------------------------------------ pipes of different lengths (9-13)
type Leaf = { pts: Pt[]; len: number; house: Pt };
const ROOT: Pt = [960, 560];
const LEAVES: Leaf[] = (() => {
  const out: Leaf[] = [];
  for (let k = 0; k < 9; k++) {
    const a = (k / 9) * Math.PI * 2 + rnd(k * 3) * 0.4;
    const L1 = 150 + rnd(k * 5) * 120;
    const B: Pt = [ROOT[0] + Math.cos(a) * L1 * 1.6, ROOT[1] + Math.sin(a) * L1 * 0.85];
    const nb = 2 + (rnd(k * 7) > 0.5 ? 1 : 0);
    for (let j = 0; j < nb; j++) {
      const a2 = a + (j - (nb - 1) / 2) * 0.55;
      const L2 = 60 + rnd(k * 11 + j) * 220;
      let hx = B[0] + Math.cos(a2) * L2 * 1.6, hy = B[1] + Math.sin(a2) * L2 * 0.85;
      hx = Math.max(140, Math.min(1780, hx));
      hy = Math.max(150, Math.min(960, hy));
      const house: Pt = [hx, hy];
      const corner: Pt = [hx, B[1]];
      const pts: Pt[] = [house, corner, B, ROOT];
      let len = 0;
      for (let q = 1; q < pts.length; q++) len += Math.hypot(pts[q][0] - pts[q - 1][0], pts[q][1] - pts[q - 1][1]);
      out.push({ pts, len, house });
    }
  }
  return out;
})();
const along = (pts: Pt[], s: number): Pt => {
  let rem = s;
  for (let q = 1; q < pts.length; q++) {
    const seg = Math.hypot(pts[q][0] - pts[q - 1][0], pts[q][1] - pts[q - 1][1]);
    if (rem <= seg) {
      const k = rem / seg;
      return [mix(pts[q - 1][0], pts[q][0], k), mix(pts[q - 1][1], pts[q][1], k)];
    }
    rem -= seg;
  }
  return pts[pts.length - 1];
};

// ------------------------------------------------------------------ the knobs (9-09, 9-11)
const KNOB_LABELS = ["OLDER TOILETS", "NARROW PIPE", "ONE-TANK TOWN"];

export const SHOTS_L09: ShotMap = {
  // split screen: MEASURED (left) and OUR MODEL (right) slide in; Lev between looks one way, then the other
  "9-01": ({ t, d, f }) => {
    const slide = ease(t, 0, d * 0.3);
    const lev = pop(t, d * 0.28, 14);
    const right = t > d * 0.62;
    return (
      <ShotStage fam="chalk" t={t} f={f}>
        <PaperGrid color={CH.far} />
        <Board slide={slide}>
          {[0, 1, 2].map((i) => (
            <path key={i} d={rrect(PR.x + 60, CHIP_Y(i), PR.w - 120, 100, 50)} fill="none" stroke={INK} strokeWidth={3} strokeDasharray="14 12" opacity={0.3 * ease(t, d * 0.4 + i * 8, d * 0.5 + i * 8)} />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={rrect(CARDS[i].x, CARDS[i].y, CW, CHh, 18)} fill="none" stroke={INK} strokeWidth={3} strokeDasharray="14 12" opacity={0.3 * ease(t, d * 0.35 + i * 6, d * 0.45 + i * 6)} />
          ))}
        </Board>
        {lev > 0 ? <GapLev f={f} s={lev} facing={right ? 1 : -1} eyes={right ? "open" : "up"} tilt={right ? 8 : 4} /> : null}
      </ShotStage>
    );
  },

  // left: the measured cards pin on one by one
  "9-02": ({ t, d, f }) => {
    const k = (i: number) => pop(t, d * (0.06 + i * 0.18), 14);
    const nod = Math.sin(t / 7) * 4 * ease(t, d * 0.75, d * 0.8);
    return (
      <ShotStage fam="chalk" t={t} f={f}>
        <PaperGrid color={CH.far} />
        <Board>
          {[0, 1, 2].map((i) => (
            <path key={i} d={rrect(PR.x + 60, CHIP_Y(i), PR.w - 120, 100, 50)} fill="none" stroke={INK} strokeWidth={3} strokeDasharray="14 12" opacity={0.3} />
          ))}
          <MeasuredCards k={k} />
        </Board>
        <GapLev f={f} facing={-1} eyes={t > d * 0.75 ? "happy" : "open"} tilt={6 + nod} pose={t > d * 0.1 && t < d * 0.7 ? "point" : "stand"} hands={{ front: [64, -110] }} />
      </ShotStage>
    );
  },

  // right: OUR SUM chips pop; then the stamp ONE FLUSH EACH
  "9-03": ({ t, d, f }) => {
    const k = (i: number) => pop(t, d * (0.08 + i * 0.13), 14);
    const stamp = lin(t, d * 0.58, d * 0.58 + 8);
    const wave = (t - d * 0.72) / 18;
    return (
      <ShotStage fam="chalk" t={t} f={f}>
        <PaperGrid color={CH.far} />
        <Board dimL={0.35}>
          <MeasuredCards k={() => 1} />
          <g opacity={ease(t, d * 0.44, d * 0.5)}><STPill x={PR.x + PR.w / 2} y={264} text="OUR SUM" dark={false} align="middle" /></g>
          {[0, 1, 2].map((i) => <Chip key={i} i={i} k={k(i)} glow={t > d * 0.72 ? Math.max(0, 1 - Math.abs(((wave % 4) + 4) % 4 - i)) : 0} />)}
          <Stamp x={PR.x + PR.w / 2} y={715} text="ONE FLUSH EACH" k={stamp} />
        </Board>
        <GapLev f={f} facing={1} eyes={stamp >= 1 && t < d * 0.7 ? "wide" : "open"} tilt={8} />
      </ShotStage>
    );
  },

  // the JUDGMENT card lifts out of the measured side and lands on the model side
  "9-04": ({ t, d, f }) => {
    const k = ease(t, d * 0.22, d * 0.62);
    const x = mix(JUDGE_L.x, JUDGE_R.x, k);
    const y = mix(JUDGE_L.y, JUDGE_R.y, k) - Math.sin(k * Math.PI) * 220;
    const land = t > d * 0.62 ? Math.sin(Math.min(1, (t - d * 0.62) / 10) * Math.PI) * 6 : 0;
    return (
      <ShotStage fam="chalk" t={t} f={f}>
        <PaperGrid color={CH.far} />
        <Board dimL={0.35}>
          <MeasuredCards k={() => 1} />
          <STPill x={PR.x + PR.w / 2} y={264} text="OUR SUM" dark={false} align="middle" />
          {[0, 1, 2].map((i) => <Chip key={i} i={i} k={1} />)}
          <Stamp x={PR.x + PR.w / 2} y={715} text="ONE FLUSH EACH" k={1} />
        </Board>
        <GapLev f={f} facing={k > 0.5 ? 1 : -1} eyes="up" tilt={k > 0.05 && k < 0.95 ? -10 : 6} />
        <JudgeCard x={x} y={y + land} k={pop(t, 0, 12)} rot={Math.sin(k * Math.PI) * -8} />
      </ShotStage>
    );
  },

  // the judgment card glows; then a blank card NO TOILET COUNT: a pencil crosses it out; NOT USED
  "9-05": ({ t, d, f }) => {
    const glow = t < d * 0.28 ? 0.5 + 0.5 * Math.sin(f / 5) : 0;
    const dim = ease(t, d * 0.24, d * 0.32);
    const card = ease(t, d * 0.26, d * 0.36);
    const s1 = ease(t, d * 0.4, d * 0.54), s2 = ease(t, d * 0.58, d * 0.7);
    const B = { x0: 660, y0: 470, x1: 1260, y1: 700 };
    const head: Pt = t < d * 0.56 ? [mix(B.x0, B.x1, s1), mix(B.y1, B.y0, s1)] : [mix(B.x0, B.x1, s2), mix(B.y0, B.y1, s2)];
    const pin = ease(t, d * 0.34, d * 0.4) * (1 - ease(t, d * 0.72, d * 0.8));
    const pencilAt: Pt = t < d * 0.4 ? [mix(1600, B.x0, ease(t, d * 0.3, d * 0.4)), mix(1000, B.y1, ease(t, d * 0.3, d * 0.4))] : t > d * 0.72 ? [mix(B.x1, 1700, ease(t, d * 0.72, d * 0.8)), mix(B.y1, 1050, ease(t, d * 0.72, d * 0.8))] : head;
    const lev = pop(t, d * 0.76, 14);
    const cy = mix(1200, 0, card);
    return (
      <ShotStage fam="chalk" t={t} f={f}>
        <PaperGrid color={CH.far} />
        <Board dimL={0.35 + dim * 0.3} dimR={dim * 0.55}>
          <MeasuredCards k={() => 1} />
          <STPill x={PR.x + PR.w / 2} y={264} text="OUR SUM" dark={false} align="middle" />
          {[0, 1, 2].map((i) => <Chip key={i} i={i} k={1} />)}
          <Stamp x={PR.x + PR.w / 2} y={715} text="ONE FLUSH EACH" k={1} />
          {glow > 0 ? <Bloom x={JUDGE_R.x + 210} y={JUDGE_R.y + 75} r={300} color={TERRA} strength={0.35 * glow} /> : null}
          <JudgeCard x={JUDGE_R.x} y={JUDGE_R.y} />
        </Board>
        {card > 0 ? (
          <g transform={`translate(0 ${cy}) rotate(${(1 - card) * 6} 960 540)`}>
            <path d={rrect(560 + 10, 250 + 14, 800, 600, 30)} fill="#000" opacity={0.14} />
            <path d={rrect(560, 250, 800, 600, 30)} fill="#FFFDF4" stroke={INK} strokeWidth={4} />
            <Txt x={960} y={350} size={62}>NO TOILET COUNT</Txt>
            <Txt x={960} y={418} size={28} ls={3} weight={800} fill={CH.dim}>TOILETS IN THE COUNTRY</Txt>
            <path d={rrect(B.x0, B.y0, B.x1 - B.x0, B.y1 - B.y0, 18)} fill="none" stroke={INK} strokeWidth={4} strokeDasharray="18 14" opacity={0.5} />
            <Txt x={960} y={635} size={160} fill={CH.dim} opacity={0.45}>?</Txt>
            {s1 > 0 ? <path d={`M ${B.x0} ${B.y1} L ${mix(B.x0, B.x1, s1)} ${mix(B.y1, B.y0, s1)}`} stroke={INK} strokeWidth={11} strokeLinecap="round" /> : null}
            {s2 > 0 ? <path d={`M ${B.x0} ${B.y0} L ${mix(B.x0, B.x1, s2)} ${mix(B.y0, B.y1, s2)}`} stroke={INK} strokeWidth={11} strokeLinecap="round" /> : null}
            <g opacity={ease(t, d * 0.74, d * 0.8)}><STPill x={960} y={790} text="NOT USED" dark={false} align="middle" size={26} /></g>
          </g>
        ) : null}
        {pin > 0 || (t > d * 0.3 && t < d * 0.8) ? (
          <g transform={`translate(${pencilAt[0]} ${pencilAt[1]}) rotate(-35)`}>
            <path d="M 0 0 L 22 -16 L 22 16 Z" fill={CREAM} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
            <path d="M 0 0 L 8 -6 L 8 6 Z" fill={INK} />
            <path d={rrect(22, -16, 230, 32, 6)} fill={TERRA} stroke={INK} strokeWidth={3} />
            <path d={rrect(28, -10, 210, 7, 3)} fill="#F2A07E" opacity={0.7} />
            <path d={rrect(252, -16, 34, 32, 8)} fill={mixHex(TERRA, CHALK, 0.6)} stroke={INK} strokeWidth={3} />
          </g>
        ) : null}
        {lev > 0 ? (
          <g transform={about(960, 1020, lev)}>
            <Lev x={960} y={1020} h={150} frame={f} facing={-1} pose="shrug" eyes="happy" tilt={-8} outline={INK} wind={0.2} />
          </g>
        ) : null}
      </ShotStage>
    );
  },

  // TV PICKUP: the show ends, kettles go on, the power line sparks (electricity); then water's own version
  "9-06": ({ t, d, f }) => {
    const GY = 880;
    const ket = (i: number) => pop(t, d * (0.3 + i * 0.05), 14);
    const steam = (i: number) => ease(t, d * (0.34 + i * 0.05), d * (0.4 + i * 0.05));
    const elec = ease(t, d * 0.42, d * 0.5);
    const water = ease(t, d * 0.66, d * 0.76);
    const KX = [1000, 1240, 1480];
    const SOCK: Pt = [1720, 640];
    const spk = elec * (1 - water * 0.7);
    return (
      <ShotStage fam="sage" t={t} f={f}>
        <rect x={-100} y={GY} width={2120} height={300} fill={SAGE.near} opacity={0.35} />
        <path d={`M -100 ${GY} H 2020`} stroke={INK} strokeWidth={5} />
        <g opacity={1 - water * 0.82}>
          <TV x={540} y={GY} w={480} frame={f} screen={SAGE.light} glow={0.7 + 0.3 * Math.sin(f / 4)} />
          {/* the wall socket and cables */}
          <g opacity={elec}>
            <path d={rrect(SOCK[0] - 50, SOCK[1] - 60, 100, 120, 18)} fill={CHALK} stroke={INK} strokeWidth={4} />
            <circle cx={SOCK[0] - 16} cy={SOCK[1]} r={8} fill={INK} />
            <circle cx={SOCK[0] + 16} cy={SOCK[1]} r={8} fill={INK} />
            {KX.map((x, i) => (
              <path key={i} d={`M ${x - 60} ${GY - 10} Q ${x - 70} ${GY + 40} ${x + 100} ${GY + 40} L ${SOCK[0]} ${GY + 40} L ${SOCK[0]} ${SOCK[1] + 60}`} stroke={INK} strokeWidth={6} fill="none" strokeLinejoin="round" />
            ))}
            {KX.map((x, i) => (
              <path key={`p${i}`} d={`M ${x - 60} ${GY - 10} Q ${x - 70} ${GY + 40} ${x + 100} ${GY + 40} L ${SOCK[0]} ${GY + 40} L ${SOCK[0]} ${SOCK[1] + 60}`} stroke={mixHex(TERRA, "#FFF1C4", 0.6)} strokeWidth={3} fill="none" strokeDasharray="10 40" strokeDashoffset={t * 4 + i * 15} />
            ))}
          </g>
          {spk > 0 ? (
            <g opacity={spk}>
              <Bloom x={SOCK[0]} y={SOCK[1] - 100} r={110} color={SAGE.light} strength={0.6 + 0.4 * Math.sin(f / 2)} />
              <Spark x={SOCK[0]} y={SOCK[1] - 100} r={44 + 8 * Math.sin(f / 2.5)} rot={f * 9} />
            </g>
          ) : null}
          {KX.map((x, i) => (ket(i) > 0 ? <g key={i} transform={about(x, GY, ket(i))}><Kettle x={x} y={GY} s={0.9} frame={f} steam={steam(i)} seed={i} /></g> : null))}
        </g>
        <g opacity={(1 - water) * ease(t, d * 0.04, d * 0.12)}>
          <Txt x={150} y={170} size={72} anchor="start" fill={SAGE.text}>TV PICKUP</Txt>
          <g opacity={elec}><STPill x={152} y={232} text="ELECTRICITY" dark={false} /></g>
        </g>
        {water > 0 ? (
          <g>
            <g opacity={water}><Txt x={150} y={170} size={72} anchor="start" fill={SAGE.text}>WATER'S OWN VERSION</Txt></g>
            <g transform={about(1240, 560, pop(t, d * 0.68, 16))}>
              {[0, 1, 2].map((k) => {
                const age = ((t + k * 20) % 60) / 60;
                return <ellipse key={k} cx={1240} cy={860} rx={90 + age * 220} ry={20 + age * 50} fill="none" stroke={WATER} strokeWidth={5} opacity={(1 - age) * 0.8} />;
              })}
              <path d="M 1240 330 C 1300 430 1370 520 1370 600 A 130 130 0 0 1 1110 600 C 1110 520 1180 430 1240 330 Z" fill={WATER} stroke={INK} strokeWidth={5} />
              <path d="M 1180 560 Q 1170 620 1205 665" stroke={WATER_LIGHT} strokeWidth={14} fill="none" strokeLinecap="round" />
            </g>
          </g>
        ) : null}
      </ShotStage>
    );
  },

  // one England match: a demand line draws, with a small bump at half-time and a big one after extra time
  "9-07": ({ t, d, f }) => {
    const X0 = 200, X1 = 1700, BASE = 860, H = 360;
    const u1 = lin(t, d * 0.08, d * 0.88);
    const pts = linePts(X0, X1, BASE, H, u1);
    const headP = pts[pts.length - 1];
    const l1 = pop(t, d * (0.08 + 0.8 * 0.43), 14);
    const l2 = pop(t, d * (0.08 + 0.8 * 0.91), 14);
    const ball: Pt = [1580 + Math.sin(f / 23) * 150, 240 + Math.sin(f / 17 + 1) * 70];
    return (
      <ShotStage fam="sage" t={t} f={f}>
        <g opacity={ease(t, 0, d * 0.06)}>
          <Txt x={150} y={170} size={66} anchor="start" fill={SAGE.text}>ONE ENGLAND MATCH</Txt>
        </g>
        {/* the pitch */}
        <g transform={`${about(1580, 240, pop(t, 4, 14))} translate(1490 225) scale(0.86) translate(-1580 -240)`}>
          <path d={rrect(1360, 120, 440, 240, 18)} fill={SAGE.near} stroke={INK} strokeWidth={4} />
          {[0, 1, 2, 3].map((k) => <rect key={k} x={1360 + k * 110} y={124} width={55} height={232} fill="#FFFFFF" opacity={0.05} />)}
          <g stroke={CHALK} strokeWidth={4} fill="none" opacity={0.85}>
            <path d={rrect(1376, 136, 408, 208, 6)} />
            <path d="M 1580 136 V 344" />
            <circle cx={1580} cy={240} r={40} />
            <path d="M 1376 190 h 50 v 100 h -50 M 1784 190 h -50 v 100 h 50" />
          </g>
          <circle cx={ball[0]} cy={ball[1]} r={11} fill={CHALK} stroke={INK} strokeWidth={3} />
        </g>
        {/* the graph */}
        <path d={`M ${X0} ${BASE} H ${X1}`} stroke={INK} strokeWidth={3} strokeDasharray="12 10" opacity={0.55} />
        <Txt x={X0} y={BASE + 50} size={26} anchor="start" ls={2} weight={800} fill={SAGE.dim}>NORMAL DEMAND</Txt>
        {[[0.42, "HALF-TIME"], [0.9, "AFTER EXTRA TIME"]].map(([u, s]) => (
          <g key={s as string} opacity={ease(t, d * 0.1, d * 0.18)}>
            <path d={`M ${X0 + (X1 - X0) * (u as number)} ${BASE + 6} v 18`} stroke={INK} strokeWidth={4} />
            <Txt x={X0 + (X1 - X0) * (u as number)} y={BASE + 60} size={28} ls={1.5} weight={900} fill={SAGE.text}>{s as string}</Txt>
          </g>
        ))}
        <path d={ptsD(pts)} stroke={WATER_DEEP} strokeWidth={13} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        <path d={ptsD(pts)} stroke={WATER} strokeWidth={7} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        {u1 > 0 && u1 < 1 ? (
          <g>
            <circle cx={headP[0]} cy={headP[1]} r={24 + 4 * Math.sin(f / 4)} fill={WATER_LIGHT} opacity={0.5} />
            <circle cx={headP[0]} cy={headP[1]} r={12} fill={WATER} stroke={INK} strokeWidth={3} />
          </g>
        ) : null}
        {l1 > 0 ? (
          <g transform={about(X0 + (X1 - X0) * 0.42, BASE - H * H1 - 40, l1)}>
            <Txt x={X0 + (X1 - X0) * 0.42} y={BASE - H * H1 - 40} size={50}>1.23 MILLION L</Txt>
          </g>
        ) : null}
        {l2 > 0 ? (
          <g transform={about(1500, BASE - H - 40, l2)}>
            <Txt x={1500} y={BASE - H - 40} size={56}>3.34 MILLION L</Txt>
          </g>
        ) : null}
      </ShotStage>
    );
  },

  // the litres card; stamp NOT CONVERTED TO FLUSHES; then a steady pipe (the system coped) and Lev
  "9-08": ({ t, d, f }) => {
    const card = ease(t, 0, d * 0.1);
    const stamp = lin(t, d * 0.3, d * 0.3 + 8);
    const pipe = ease(t, d * 0.55, d * 0.63);
    const lev = pop(t, d * 0.58, 14);
    const X0 = 400, X1 = 1340, BASE = 600, H = 240;
    const pts = linePts(X0, X1, BASE, H, 1, 160);
    const draw = ease(t, d * 0.04, d * 0.2);
    return (
      <ShotStage fam="chalk" t={t} f={f}>
        <PaperGrid color={CH.far} />
        <g transform={`translate(0 ${(1 - card) * 700})`}>
          <path d={rrect(300 + 10, 170 + 14, 1140, 620, 30)} fill="#000" opacity={0.12} />
          <path d={rrect(300, 170, 1140, 620, 30)} fill="#FFFDF4" stroke={INK} strokeWidth={4} />
          <Txt x={870} y={240} size={30} ls={3} weight={800} fill={CH.dim}>ONE WATER COMPANY · ONE MATCH</Txt>
          <path d={`M ${X0} ${BASE} H ${X1}`} stroke={INK} strokeWidth={3} strokeDasharray="12 10" opacity={0.5} />
          <path d={ptsD(pts.slice(0, Math.max(1, Math.round(pts.length * draw))))} stroke={WATER} strokeWidth={8} fill="none" strokeLinejoin="round" strokeLinecap="round" />
          <g opacity={ease(t, d * 0.12, d * 0.18)}><Txt x={X0 + (X1 - X0) * 0.42} y={BASE - H * H1 - 30} size={44}>1.23 MILLION L</Txt></g>
          <g opacity={ease(t, d * 0.18, d * 0.24)}><Txt x={X0 + (X1 - X0) * 0.84} y={BASE - H - 30} size={44} anchor="end">3.34 MILLION L</Txt></g>
          <Stamp x={870} y={712} text="NOT CONVERTED TO FLUSHES" k={stamp} size={40} rot={-3} />
        </g>
        {pipe > 0 ? (
          <g opacity={pipe}>
            <path d="M 160 900 H 1440" stroke={INK} strokeWidth={34} strokeLinecap="round" />
            <path d="M 160 900 H 1440" stroke={WATER} strokeWidth={24} strokeLinecap="round" />
            <path d="M 160 900 H 1440" stroke={WATER_LIGHT} strokeWidth={6} strokeDasharray="30 30" strokeDashoffset={-t * 3} strokeLinecap="round" />
            <Txt x={800} y={985} size={30} ls={3} weight={900} fill={CH.text}>THE SYSTEM COPED</Txt>
          </g>
        ) : null}
        {lev > 0 ? (
          <g transform={about(1630, 960, lev)}>
            <Lev x={1630} y={960} h={200} frame={f} facing={-1} pose="point" hands={{ front: [66, -140] }} eyes={t > d * 0.8 ? "happy" : "open"} tilt={-6} outline={INK} wind={0.2} />
          </g>
        ) : null}
      </ShotStage>
    );
  },

  // three knobs: OLDER TOILETS turns (a bigger tank), then NARROW PIPE (trouble on one street), then ONE-TANK TOWN twitches
  "9-09": ({ t, d, f }) => {
    const v1 = ease(t, d * 0.15, d * 0.36);
    const v2 = ease(t, d * 0.45, d * 0.66);
    const v3 = 0.28 * Math.sin(Math.PI * lin(t, d * 0.8, d * 0.95));
    const KX = [420, 960, 1500];
    const KY = 440;
    const kp = (i: number) => pop(t, d * 0.02 + i * 6, 14);
    const active = t < d * 0.42 ? 0 : t < d * 0.75 ? 1 : 2;
    const vs = [v1, v2, v3];
    const pw = mix(40, 12, v2);
    return (
      <ShotStage fam="chalk" t={t} f={f}>
        <PaperGrid color={CH.far} />
        <g opacity={ease(t, 0, d * 0.06)}><Txt x={960} y={170} size={60}>WHAT WOULD CHANGE THE ANSWER?</Txt></g>
        {KX.map((x, i) => (
          <g key={i} transform={about(x, KY, kp(i))}>
            {i === active && t > d * 0.12 ? <Bloom x={x} y={KY} r={220} color={TERRA} strength={0.25 + 0.1 * Math.sin(f / 6)} /> : null}
            <Knob x={x} y={KY} r={115} v={vs[i]} label={KNOB_LABELS[i]} hot={i === active ? 1 : 0} />
          </g>
        ))}
        {/* 1: an older toilet, bigger tank */}
        <g opacity={kp(0)}>
          <Toilet x={420} y={930} s={mix(0.95, 1.3, v1)} />
          <g opacity={ease(t, d * 0.3, d * 0.36)}><STPill x={420} y={722} text="OUR WORST CASE" dark={false} align="middle" size={18} /></g>
        </g>
        {/* 2: a pipe narrows; one street lights */}
        <g opacity={kp(1)}>
          <path d={`M 800 860 H 1120`} stroke={INK} strokeWidth={pw + 8} strokeLinecap="round" />
          <path d={`M 800 860 H 1120`} stroke={WATER} strokeWidth={pw} strokeLinecap="round" />
          <path d={`M 800 860 H 1120`} stroke={WATER_LIGHT} strokeWidth={3} strokeDasharray="12 16" strokeDashoffset={-t * mix(3, 1, v2)} />
          {[860, 960, 1060].map((hx, j) => (
            <g key={j}>
              {j === 2 && v2 > 0.5 ? <Bloom x={hx} y={900} r={90} color={TERRA} strength={(v2 - 0.5) * 1.2 * (0.7 + 0.3 * Math.sin(f / 5))} /> : null}
              <House x={hx} y={950} s={0.8} lit={j === 2 ? v2 : 0} />
            </g>
          ))}
        </g>
        {/* 3: a one-tank town */}
        <g opacity={kp(2)} transform="translate(1500 950) scale(0.55) translate(-1500 -950)">
          <WaterTower x={1500} y={950} w={170} level={0.75 - v3 * 0.6} />
        </g>
      </ShotStage>
    );
  },

  // the one-tank town vs the big reservoir: each flush, the town's tank dips more
  "9-10": ({ t, d, f }) => {
    const GY = 880;
    const dip = (a: number) => (t < a ? 0 : ease(t, a, a + 14) * (1 - ease(t, a + 14, a + d * 0.28)));
    const w = dip(d * 0.15) + dip(d * 0.58);
    const town = 0.82 - 0.42 * w;
    const res = 0.78 - 0.03 * w;
    const flow = w > 0.05;
    return (
      <ShotStage fam="sage" t={t} f={f}>
        <rect x={-100} y={GY} width={2120} height={300} fill={SAGE.near} opacity={0.4} />
        <path d={`M -100 ${GY} H 2020`} stroke={INK} strokeWidth={5} />
        {/* city skyline behind the reservoir */}
        {[960, 1040, 1150, 1235, 1340, 1430, 1530, 1600].map((x, i) => {
          const w = 70 + rnd(i * 7) * 50;
          const h = 110 + rnd(i * 3) * 160;
          const top = 640 - h;
          return (
            <g key={i}>
              <path d={rrect(x, top, w, h + 20, 4)} fill={mixHex(SAGE.near, SAGE.mid, 0.4)} stroke={INK} strokeWidth={3} />
              {i % 3 === 1 ? <path d={`M ${x + w / 2} ${top} v -36`} stroke={INK} strokeWidth={4} strokeLinecap="round" /> : null}
              {Array.from({ length: Math.floor(h / 40) }, (_, r) => [0, 1].map((c) => {
                const on = rnd(i * 31 + r * 5 + c + Math.floor((f + i * 11) / 45)) > 0.35;
                return <rect key={`${r}-${c}`} x={x + 14 + c * (w - 42)} y={top + 16 + r * 40} width={14} height={16} rx={2} fill={CREAM} opacity={on ? 0.85 : 0.25} />;
              }))}
            </g>
          );
        })}
        <Reservoir x={1320} y={640} w={800} h={220} level={res} frame={f} />
        <WaterTower x={500} y={GY} w={170} level={town} />
        {[300, 380, 640, 720].map((x, i) => <House key={i} x={x} y={GY} s={0.95} lit={flow ? 0.4 : 0} />)}
        {flow ? [300, 380, 640, 720].map((x, i) => (
          <path key={i} d={`M 500 ${GY - 10} L ${x} ${GY - 10}`} stroke={WATER} strokeWidth={6} strokeDasharray="14 14" strokeDashoffset={-t * 3} opacity={Math.min(1, w * 2)} />
        )) : null}
        <g opacity={ease(t, 0, d * 0.08)}>
          <Txt x={500} y={300} size={46} ls={2}>ONE-TANK TOWN</Txt>
          <Txt x={1320} y={300} size={46} ls={2}>BIG RESERVOIR</Txt>
        </g>
      </ShotStage>
    );
  },

  // all the knobs turn up; the water line still stays far below the flood line
  "9-11": ({ t, d, f }) => {
    const BANK = 800;
    const KX = [560, 960, 1360];
    const v = (i: number) => ease(t, d * (0.05 + i * 0.1), d * (0.3 + i * 0.1));
    const all = (v(0) + v(1) + v(2)) / 3;
    const wl = 965 - 22 * all;
    const surf = Array.from({ length: 41 }, (_, i) => [60 + i * 45, wl + Math.sin(i * 0.8 + f / 6) * 5] as Pt);
    const chan = "M 40 850 L 1880 850 L 1840 1010 L 80 1010 Z";
    return (
      <ShotStage fam="sage" t={t} f={f}>
        <rect x={-100} y={BANK} width={2120} height={400} fill={SAGE.near} opacity={0.4} />
        <path d={`M -100 ${BANK} H 2020`} stroke={INK} strokeWidth={5} />
        {KX.map((x, i) => <Knob key={i} x={x} y={330} r={72} v={v(i)} label={KNOB_LABELS[i]} hot={v(i) > 0.95 ? 1 : 0} />)}
        {[260, 420, 580, 900, 1060, 1380, 1540].map((x, i) => <House key={i} x={x} y={BANK} s={1} />)}
        {/* the river channel: water rises a little, nowhere near the houses */}
        <clipPath id="l09chan"><path d={chan} /></clipPath>
        <path d={chan} fill={mixHex(SAGE.near, INK, 0.25)} opacity={0.55} />
        <g clipPath="url(#l09chan)">
          <path d={`M ${surf.map((p) => p.join(" ")).join(" L ")} L 1900 1020 L 20 1020 Z`} fill={WATER} />
          <path d={`M ${surf.map((p) => p.join(" ")).join(" L ")}`} stroke={WATER_LIGHT} strokeWidth={4} fill="none" />
        </g>
        <path d={chan} fill="none" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        <path d={`M 80 ${BANK + 14} H 1840`} stroke={TERRA} strokeWidth={6} strokeDasharray="26 18" />
        <Txt x={1780} y={BANK - 108} size={30} anchor="end" ls={3} fill={TERRA}>FLOOD LINE</Txt>
        <path d={`M 1740 ${BANK - 96} v 96`} stroke={TERRA} strokeWidth={4} strokeLinecap="round" />
        <g opacity={ease(t, d * 0.45, d * 0.55)}><Txt x={960} y={150} size={64} fill={SAGE.text}>STILL NO FLOOD</Txt></g>
      </ShotStage>
    );
  },

  // Lev pushes the lever back; the map dims; the toilets refill; the Counter rolls back down to 0
  "9-12": ({ t, d, f }) => {
    const push = ease(t, d * 0.08, d * 0.58);
    const ang = mix(38, 0, push);
    const tip = leverTip(PIV[0], PIV[1], LEN, ang);
    const lx = tip[0] + 64 * LS, ly = PIV[1] - 20;
    const hy = (tip[1] - ly) / LS;
    const roll = ease(t, d * 0.15, d * 0.75);
    const value = roll >= 1 ? "0" : fmtFlushes(rollLog(341.8e6, 1, roll));
    const dim = ease(t, d * 0.15, d * 0.7);
    const done = t > d * 0.62;
    return (
      <ShotStage fam="moss" t={t} f={f} counter={{ label: "FLUSHES", value }}>
        <g transform="translate(40 -20) scale(0.74)">
          <USLand fill={MOSS.mid} stroke={MOSS.near} sw={5} opacity={mix(1, 0.6, dim)} />
          <Blobs f={f} k={() => 1} dim={dim * 0.8} glow={(i) => (1 - dim) * 0.5 * (0.5 + 0.5 * Math.sin(f / 7 + i))} />
        </g>
        <rect x={-100} y={920} width={2120} height={300} fill={MOSS.near} />
        <path d="M -100 920 H 2020" stroke={MOSS.bounce} strokeWidth={4} opacity={0.6} />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const k = ease(t, d * (0.3 + i * 0.07), d * (0.48 + i * 0.07));
          return <Toilet key={i} x={180 + i * 150} y={1000} s={0.7} fill={k} flash={k >= 1 ? Math.max(0, 1 - (t - d * (0.48 + i * 0.07)) / 10) : 0} />;
        })}
        <Lev x={lx} y={ly} h={LH} frame={f} facing={-1} pose="pull" lean={3} eyes={done ? "happy" : "squint"} tilt={done ? 6 : -4}
          hands={{ front: [64, hy], back: [56, hy + 10] }} shade="#9FB7A6" wind={0.5} />
        <Lever x={PIV[0]} y={PIV[1]} len={LEN} angle={ang} plate="ALL FLUSH: NOW" glow={0.4 * (1 - push)} />
      </ShotStage>
    );
  },

  // night map: from every house a glow runs down its own pipe; different lengths, different arrival times
  "9-13": ({ t, d, f }) => {
    const W = Math.max(60, d / 2.2);
    const tw = t % W;
    const vel = 9;
    const maxLen = Math.max(...LEAVES.map((l) => l.len));
    const velW = Math.max(vel, (maxLen / (W * 0.85)));
    return (
      <ShotStage fam="moss" t={t} f={f}>
        {/* faint street grid */}
        <g stroke={MOSS.far} strokeWidth={1.5} opacity={0.25}>
          {Array.from({ length: 20 }, (_, i) => <path key={`v${i}`} d={`M ${i * 100 + 10} 0 V 1080`} />)}
          {Array.from({ length: 12 }, (_, i) => <path key={`h${i}`} d={`M 0 ${i * 100 + 40} H 1920`} />)}
        </g>
        {LEAVES.map((l, i) => <path key={i} d={ptsD(l.pts)} stroke={WATER_DEEP} strokeWidth={7} fill="none" strokeLinejoin="round" strokeLinecap="round" opacity={0.9} />)}
        {LEAVES.map((l, i) => {
          const s = tw * velW;
          const flash = Math.max(0, 1 - tw / 12);
          const out: React.ReactNode[] = [];
          out.push(<g key={`h${i}`}><House x={l.house[0]} y={l.house[1] + 20} s={0.55} lit={flash} /></g>);
          if (s < l.len) {
            for (let q = 0; q < 5; q++) {
              const p = along(l.pts, Math.max(0, s - q * 14));
              out.push(<circle key={`g${i}-${q}`} cx={p[0]} cy={p[1]} r={9 - q * 1.4} fill={AIR} opacity={0.9 - q * 0.17} />);
            }
          }
          return <g key={i}>{out}</g>;
        })}
        {/* the root: each arrival is a separate small ring */}
        <Bloom x={ROOT[0]} y={ROOT[1]} r={160} color={AIR} strength={0.3 + 0.08 * Math.sin(f / 6)} />
        {LEAVES.map((l, i) => {
          const age = tw - l.len / velW;
          return age > 0 && age < 30 ? <circle key={i} cx={ROOT[0]} cy={ROOT[1]} r={46 + age * 3} fill="none" stroke={AIR} strokeWidth={3} opacity={(1 - age / 30) * 0.6} /> : null;
        })}
        <circle cx={ROOT[0]} cy={ROOT[1]} r={46} fill={WATER} stroke={WATER_LIGHT} strokeWidth={5} />
        <path d={`M ${ROOT[0] - 22} ${ROOT[1]} h 44`} stroke={WATER_LIGHT} strokeWidth={5} strokeLinecap="round" opacity={0.8} />
      </ShotStage>
    );
  },

  // Lev leans on the lever and looks out of the frame; the Counter blinks
  "9-14": ({ t, d, f }) => {
    const LX = 1150, GY = 900, SC = 0.8, L = 120;
    const tipY = GY - (40 + L) * SC;
    const H = 240, S = H / 170;
    const blink = Math.floor(t / 15) % 2 === 0 ? 1 : 0.5;
    const look = t > d * 0.55;
    return (
      <ShotStage fam="moss" t={t} f={f}>
        {/* distant city */}
        {Array.from({ length: 16 }, (_, i) => {
          const x = 60 + i * 115;
          const h = 90 + rnd(i * 5) * 200;
          return (
            <g key={i}>
              <path d={rrect(x, GY - h, 96, h + 10, 6)} fill={MOSS.mid} />
              {[0, 1, 2].map((q) => {
                const on = rnd(i * 13 + q + Math.floor((f + i * 7) / 40)) > 0.55;
                return on ? <rect key={q} x={x + 18 + (q % 2) * 40} y={GY - h + 26 + q * 34} width={18} height={14} rx={3} fill={MOSS.light} opacity={0.5} /> : null;
              })}
            </g>
          );
        })}
        <rect x={-100} y={GY} width={2120} height={300} fill={MOSS.near} />
        <path d={`M -100 ${GY} H 2020`} stroke={MOSS.bounce} strokeWidth={4} opacity={0.6} />
        <Lev x={LX + 46 * S} y={GY - 8} h={H} frame={f} facing={-1} pose="lean-on" lean={5 + Math.sin(f / 30) * 1.5} eyes={look ? "up" : "open"} tilt={look ? -10 : 4}
          hands={{ front: [46, (tipY - (GY - 8)) / S] }} shade="#9FB7A6" wind={0.6 + 0.3 * Math.sin(f / 20)} />
        <Lever x={LX} y={GY} len={L} angle={0} plate="ALL FLUSH: NOW" scale={SC} glow={0.2} />
        <g opacity={blink}><Counter x={1830} label="FLUSHES" value="0" /></g>
      </ShotStage>
    );
  },

  // end card: the wordmark; the Ladder's rungs light in turn
  "E-01": ({ t, d, f }) => {
    const lit = Math.min(7, Math.floor(lin(t, d * 0.08, d * 0.78) * 8) - (t < d * 0.08 ? 1 : 0));
    const fade = ease(t, 0, Math.min(16, d * 0.15));
    return (
      <ShotStage fam="moss" t={t} f={f} drift={0.5}>
        <g opacity={fade}>
          <Bloom x={820} y={540} r={620} color={MOSS.bounce} strength={0.3} />
          <Wordmark x={820} y={590} size={150} />
          <Ladder x={1580} top={230} bottom={860} rungs={["", "", "", "", "", "", "", ""]} lit={lit} frame={f} width={84} />
        </g>
      </ShotStage>
    );
  },
};

