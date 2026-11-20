// Vertical helpers for the ST01 Shorts sts01-sts04 (builder A). Pure functions of their props; drawn on the 1080x1920
// canvas (picture y 230-1260, captions below; keep x 930-1080 under y 1100 free).
import React from "react";
import { Bloom, LightDefs, Sky } from "../../lib/illustrated/light";
import { Motes, Stars } from "../../lib/illustrated/ambient";
import { smoothPath } from "../../lib/illustrated/shapes";
import { rnd } from "../../lib/illustrated/motion";
import { VShot, SW, SH } from "../../lib/suppose/vshort";
import { AIR, CHALK, INK, ST_FONT, SUPPOSE, SupposeFamily, TERRA } from "../../lib/suppose/palette";
import { Counter } from "../../lib/suppose/devices";
import { ease, lin, mix, pop } from "../ST01-earth-twice-as-big/shot";

export { ease, lin, mix, pop };
export type Pt = [number, number];
export type CSpec = { label: string; value: string; sub?: string };
export const TAU = Math.PI * 2;

/** Split one line's shot into beats at line-local frames `cuts` (cuts[0] = 0). Each beat gets its own t/d and the
 * kit's cut pop + flash, so a beat reads as a new shot. */
export const beats = (cuts: number[], shots: VShot[]): VShot => ({ t, d, f }) => {
  let k = 0;
  for (let i = 0; i < cuts.length; i++) if (t >= cuts[i]) k = i;
  const t0 = cuts[k];
  const t1 = k + 1 < cuts.length ? cuts[k + 1] : d;
  const lt = t - t0;
  const S = shots[k];
  const pp = k > 0 ? 1 + 0.035 * Math.pow(Math.max(0, 1 - lt / 9), 2) : 1;
  return (
    <g>
      <g transform={`translate(540 760) scale(${pp}) translate(-540 -760)`}>
        <S key={k} t={lt} d={Math.max(1, t1 - t0)} f={f} />
      </g>
      {k > 0 && lt < 4 ? <rect x={0} y={0} width={SW} height={SH} fill={CHALK} opacity={0.25 * (1 - lt / 4)} /> : null}
    </g>
  );
};

/** graph-paper grid for the chalk family */
export const PaperGrid: React.FC = () => (
  <g stroke={SUPPOSE.chalk.far} strokeWidth={1.6} opacity={0.55}>
    {Array.from({ length: 20 }, (_, i) => <path key={`v${i}`} d={`M ${i * 60} 0 V ${SH}`} />)}
    {Array.from({ length: 33 }, (_, i) => <path key={`h${i}`} d={`M 0 ${i * 60} H ${SW}`} />)}
  </g>
);

/** Backdrop + ambient life + a slow push-in (zoom 0..1 scales the push), with an optional top-right Counter. */
export const VStage: React.FC<{ fam: SupposeFamily; t: number; d: number; f: number; counter?: CSpec; push?: number; children: React.ReactNode }> = ({
  fam, t, d, f, counter, push = 1, children,
}) => {
  const F = SUPPOSE[fam];
  const z = 1 + push * 0.04 * (t / Math.max(1, d));
  return (
    <g>
      <LightDefs />
      <Sky stops={[...F.sky]} x={0} y={0} w={SW} h={SH} />
      {fam === "chalk" ? <PaperGrid /> : null}
      {F.dark ? <Stars frame={f} n={120} w={SW} h={1300} color={F.light} seed={4} /> : <Motes frame={f} n={14} w={SW} h={1250} color={F.light} seed={7} />}
      <g transform={`translate(540 760) scale(${z}) translate(-540 -760)`}>{children}</g>
      {counter ? <Counter x={1052} y={286} label={counter.label} value={counter.value} sub={counter.sub} size={96} /> : null}
    </g>
  );
};

/** Nunito text */
export const T: React.FC<{ x: number; y: number; size?: number; fill?: string; anchor?: "start" | "middle" | "end"; weight?: number; op?: number; ls?: number; children: React.ReactNode }> = ({
  x, y, size = 44, fill = CHALK, anchor = "middle", weight = 900, op = 1, ls = 0, children,
}) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={ST_FONT} fontWeight={weight} fontSize={size} letterSpacing={ls} fill={fill} opacity={op}>{children}</text>
);

/** Something that pops in (scale about cx,cy) from frame a. */
export const Pop: React.FC<{ t: number; a: number; cx: number; cy: number; n?: number; children: React.ReactNode }> = ({ t, a, cx, cy, n = 12, children }) => {
  const k = pop(t, a, n);
  if (k <= 0) return null;
  return <g transform={`translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})`}>{children}</g>;
};

/** Ink tag with a chalk outline: one short line of text, readable over anything. */
export const Tag: React.FC<{ x: number; y: number; text: string; size?: number; dark?: boolean; color?: string }> = ({ x, y, text, size = 36, dark = true, color }) => {
  const w = text.length * size * 0.66 + 50;
  const h = size + 30;
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h / 2} fill={dark ? INK : CHALK} opacity={dark ? 0.8 : 0.92} />
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h / 2} fill="none" stroke={dark ? CHALK : INK} strokeWidth={3} opacity={0.85} />
      <T x={x} y={y + size * 0.36} size={size} fill={color ?? (dark ? CHALK : INK)} ls={2}>{text}</T>
    </g>
  );
};

/** Fat arrow from (x0,y0) to (x1,y1). */
export const Arrow: React.FC<{ x0: number; y0: number; x1: number; y1: number; color: string; w?: number; head?: number; op?: number; dash?: string }> = ({
  x0, y0, x1, y1, color, w = 14, head = 36, op = 1, dash,
}) => {
  const len = Math.hypot(x1 - x0, y1 - y0);
  if (len < 2) return null;
  const ux = (x1 - x0) / len, uy = (y1 - y0) / len;
  const hb = Math.min(head, len * 0.6);
  const bx = x1 - ux * hb, by = y1 - uy * hb;
  const px = -uy * hb * 0.62, py = ux * hb * 0.62;
  return (
    <g opacity={op}>
      <path d={`M ${x0} ${y0} L ${bx} ${by}`} stroke={color} strokeWidth={w} strokeLinecap="round" strokeDasharray={dash} fill="none" />
      <path d={`M ${x1} ${y1} L ${bx + px} ${by + py} L ${bx - px} ${by - py} Z`} fill={color} stroke={color} strokeWidth={w * 0.4} strokeLinejoin="round" />
    </g>
  );
};

/** Sage outdoor ground: far hills, lawn at y, dark lip; runs to the bottom of the canvas. */
export const SageLand: React.FC<{ y: number; seed?: number; scroll?: number }> = ({ y, seed = 1, scroll = 0 }) => {
  const S = SUPPOSE.sage;
  const sx = -((scroll * 0.3) % 360);
  return (
    <g>
      <path d={smoothPath([[-80 + sx, y - 140], [180 + sx, y - 220 - seed * 8], [460 + sx, y - 160], [760 + sx, y - 240], [1060 + sx, y - 170], [1340 + sx, y - 210], [1500 + sx, y - 150]]) + ` L 1500 ${y + 40} L -80 ${y + 40} Z`} fill={S.far} />
      <path d={smoothPath([[-60, y - 30], [300, y - 60], [700, y - 25], [1140, y - 50]]) + ` L 1140 ${SH} L -60 ${SH} Z`} fill={S.mid} />
      <path d={smoothPath([[-60, y - 30], [300, y - 60], [700, y - 25], [1140, y - 50]])} stroke={S.bounce} strokeWidth={6} fill="none" opacity={0.9} />
      <path d={smoothPath([[-60, y + 80], [400, y + 60], [800, y + 90], [1140, y + 66]]) + ` L 1140 ${SH} L -60 ${SH} Z`} fill={S.near} />
      {Array.from({ length: 9 }, (_, i) => {
        const gx = ((60 + i * 140 + rnd(seed * 31 + i) * 60 - scroll) % 1260 + 1260) % 1260 - 90;
        const gy = y + 6 + rnd(seed * 17 + i) * 44;
        return <path key={i} d={`M ${gx} ${gy} q 4 -16 2 -26 M ${gx + 9} ${gy} q 2 -12 7 -19`} stroke={S.near} strokeWidth={4} strokeLinecap="round" fill="none" opacity={0.55} />;
      })}
    </g>
  );
};

/** Dark ledge (moss) with its top edge at y. */
export const MossLedge: React.FC<{ y: number }> = ({ y }) => {
  const M = SUPPOSE.moss;
  return (
    <g>
      <path d={`M -40 ${y + 10} Q 200 ${y - 14} 540 ${y - 8} Q 880 ${y - 2} 1120 ${y + 12} L 1120 ${SH} L -40 ${SH} Z`} fill={M.near} />
      <path d={`M -40 ${y + 10} Q 200 ${y - 14} 540 ${y - 8} Q 880 ${y - 2} 1120 ${y + 12}`} stroke={M.bounce} strokeWidth={6} fill="none" opacity={0.8} />
      <path d={`M 80 ${y + 60} Q 260 ${y + 46} 440 ${y + 66} M 560 ${y + 120} Q 760 ${y + 104} 960 ${y + 124}`} stroke={M.mid} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.6} />
    </g>
  );
};

/** expanding rings (ripples) from a circle of radius r */
export const Rings: React.FC<{ cx: number; cy: number; r: number; t: number; t0: number; n?: number; color?: string }> = ({ cx, cy, r, t, t0, n = 4, color = AIR }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      if (t < t0 + i * 12) return null;
      const age = (t - t0 - i * 12) % 50;
      return <circle key={i} cx={cx} cy={cy} r={r + age * 3.4} fill="none" stroke={color} strokeWidth={5 * (1 - age / 50)} opacity={(1 - age / 50) * 0.55} />;
    })}
  </g>
);

/** Width bracket (dimension line) from x0 to x1 at y with a label under it. */
export const Bracket: React.FC<{ x0: number; x1: number; y: number; label: string; color?: string; p?: number; size?: number }> = ({ x0, x1, y, label, color = CHALK, p = 1, size = 40 }) => {
  if (p <= 0.08) return null;
  const m = (x0 + x1) / 2, hw = ((x1 - x0) / 2) * p;
  return (
    <g>
      <path d={`M ${m - hw} ${y - 18} V ${y + 18} M ${m + hw} ${y - 18} V ${y + 18} M ${m - hw} ${y} H ${m + hw}`} stroke={color} strokeWidth={6} strokeLinecap="round" fill="none" />
      <g opacity={lin(p, 0.6, 1)}>
        <T x={m} y={y + size + 22} size={size} fill={color} ls={2}>{label}</T>
      </g>
    </g>
  );
};

/** Ink readout: small label, big value + unit. (x, y) = top centre. */
export const VReadout: React.FC<{ x: number; y: number; label: string; value: string; unit?: string; w?: number; size?: number }> = ({ x, y, label, value, unit, w = 760, size = 150 }) => {
  const h = size + 110;
  return (
    <g>
      <rect x={x - w / 2} y={y} width={w} height={h} rx={30} fill={INK} opacity={0.72} />
      <rect x={x - w / 2} y={y} width={w} height={h} rx={30} fill="none" stroke={CHALK} strokeOpacity={0.3} strokeWidth={3} />
      <T x={x} y={y + 50} size={34} ls={4} op={0.9} weight={800}>{label}</T>
      <text x={x} y={y + 50 + size * 0.95} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={size} fill={CHALK}>
        {value}
        {unit ? <tspan fontSize={size * 0.34} fontWeight={800} dx={14}>{unit}</tspan> : null}
      </text>
    </g>
  );
};

/** A summit flag sized for the phone: pole + terracotta pennant + a card above with a big figure and one small line. */
export const VFlag: React.FC<{ x: number; y: number; big: string; small: string; f: number; card: number; pole?: number; cardX?: number }> = ({
  x, y, big, small, f, card, pole = 1, cardX,
}) => {
  const wv = Math.sin(f / 7) * 6;
  const ph = 110 * pole;
  const cw = Math.max(big.length * 58, small.length * 17.5) + 50;
  const cx = (cardX ?? x) - cw / 2;
  const dy = (1 - card) * -50;
  return (
    <g>
      <path d={`M ${x} ${y} L ${x} ${y - ph}`} stroke={INK} strokeWidth={6} strokeLinecap="round" />
      {pole > 0.3 ? <path d={`M ${x} ${y - ph} Q ${x + 44} ${y - ph + 8 + wv} ${x + 80} ${y - ph + 18 + wv * 1.4} Q ${x + 44} ${y - ph + 30 + wv * 0.5} ${x} ${y - ph + 40} Z`} fill={TERRA} /> : null}
      {card > 0 ? (
        <g transform={`translate(0 ${dy})`} opacity={Math.min(1, card * 1.4)}>
          <rect x={cx} y={y - 300} width={cw} height={160} rx={24} fill={INK} opacity={0.82} />
          <T x={cx + cw / 2} y={y - 196} size={96}>{big}</T>
          <T x={cx + cw / 2} y={y - 160} size={27} weight={800} ls={1}>{small}</T>
        </g>
      ) : null}
    </g>
  );
};

/** breath puffs drifting up from (x, y) */
export const Breath: React.FC<{ x: number; y: number; t: number; k?: number; color?: string }> = ({ x, y, t, k = 1, color = CHALK }) => (
  <g>
    {[0, 1, 2].map((i) => {
      const a = ((t + i * 16) % 48) / 48;
      return <circle key={i} cx={x + a * 60 * k} cy={y - a * 54 * k} r={(8 + a * 14) * k} fill={color} opacity={(1 - a) * 0.7} />;
    })}
  </g>
);

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const overshoot = (k: number) => (k <= 0 ? 0 : k >= 1 ? 1 : 1 - Math.pow(1 - k, 3) + Math.sin(k * Math.PI) * 0.08);
export { Bloom, rnd, smoothPath };
