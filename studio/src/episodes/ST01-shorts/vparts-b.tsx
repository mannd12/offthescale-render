// Vertical helpers for the ST01 Shorts sts05-sts08 (builder B). Canvas 1080x1920: hook band y 60-262, picture
// y 270-1250, captions y 1290-1590; keep x 930-1080 below y 1100 free of key content (YouTube's buttons).
import React from "react";
import { Bloom } from "../../lib/illustrated/light";
import { Motes, Stars } from "../../lib/illustrated/ambient";
import { rrect } from "../../lib/illustrated/shapes";
import { SW, SH, VShot } from "../../lib/suppose/vshort";
import { AIR, CHALK, INK, LIME, OCEAN, ST_FONT, SUPPOSE, SupposeFamily, TERRA } from "../../lib/suppose/palette";
import { Counter, Lever, STPill } from "../../lib/suppose/devices";
import { Earth } from "../../lib/suppose/frames";
import { Lev } from "../../lib/suppose/lev";
import { ease, lin, mix, pop } from "../ST01-earth-twice-as-big/shot";
import { VBack } from "./vparts";

export { ease, lin, mix, pop };
export type Pt = [number, number];
export const TAU = Math.PI * 2;
export const TERRA_LIT = "#E8987A";
export const TERRA_DEEP = "#8E3F24";

/** Backdrop + ambient life (stars on dark families, motes on light ones, a faint grid on chalk) + a slow push-in. */
export const VStage: React.FC<{ fam: SupposeFamily; t: number; d: number; f: number; push?: number; cy?: number; grid?: boolean; children: React.ReactNode }> = ({
  fam, t, d, f, push = 0.04, cy = 760, grid, children,
}) => {
  const F = SUPPOSE[fam];
  const s = 1 + push * Math.min(1, t / Math.max(1, d));
  return (
    <g>
      <VBack fam={fam} />
      {F.dark ? <Stars frame={f} n={150} w={SW} h={SH} color={F.light} seed={6} /> : <Motes frame={f} n={16} w={SW} h={SH} color={F.light} seed={9} />}
      {grid ?? fam === "chalk" ? (
        <g stroke={F.far} strokeWidth={1.4} opacity={0.55}>
          {Array.from({ length: 19 }, (_, i) => <path key={`v${i}`} d={`M ${i * 60} 0 V ${SH}`} />)}
          {Array.from({ length: 33 }, (_, i) => <path key={`h${i}`} d={`M 0 ${i * 60} H ${SW}`} />)}
        </g>
      ) : null}
      <g transform={`translate(540 ${cy}) scale(${s.toFixed(4)}) translate(-540 ${-cy})`}>{children}</g>
    </g>
  );
};

/** Text in the channel face. */
export const T: React.FC<{ x: number; y: number; size?: number; fill?: string; anchor?: "start" | "middle" | "end"; weight?: number; ls?: number; opacity?: number; children: React.ReactNode }> = ({
  x, y, size = 44, fill = CHALK, anchor = "middle", weight = 900, ls = 0, opacity = 1, children,
}) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={ST_FONT} fontWeight={weight} fontSize={size} letterSpacing={ls} fill={fill} opacity={opacity}>{children}</text>
);

/** The Counter, scaled up for the tall frame, top-right under the hook band. `k` = pop-in 0..1. */
export const VCounter: React.FC<{ label: string; value: string; sub?: string; k?: number; y?: number }> = ({ label, value, sub, k = 1, y = 285 }) =>
  k <= 0 ? null : (
    <g transform={`translate(1046 ${y}) scale(${(1.3 * Math.min(1.08, k)).toFixed(3)})`} opacity={Math.min(1, k * 1.5)}>
      <Counter x={0} y={0} label={label} value={value} sub={sub} size={84} />
    </g>
  );

/** An honesty pill sized for the tall frame. */
export const VPill: React.FC<{ x: number; y: number; text: string; dark?: boolean; k?: number; align?: "start" | "middle" | "end" }> = ({ x, y, text, dark = true, k = 1, align = "middle" }) =>
  k <= 0 ? null : (
    <g opacity={Math.min(1, k)}>
      <STPill x={x} y={y} text={text} dark={dark} align={align} size={28} />
    </g>
  );

/** Straight arrow with a filled head. */
export const VArrow: React.FC<{ x0: number; y0: number; x1: number; y1: number; color?: string; w?: number; head?: number; op?: number; dash?: string }> = ({
  x0, y0, x1, y1, color = CHALK, w = 12, head = 30, op = 1, dash,
}) => {
  const a = Math.atan2(y1 - y0, x1 - x0);
  const len = Math.hypot(x1 - x0, y1 - y0);
  if (len < 2) return null;
  const bx = x1 - Math.cos(a) * head * 0.8, by = y1 - Math.sin(a) * head * 0.8;
  const p1: Pt = [x1 - Math.cos(a - 0.5) * head, y1 - Math.sin(a - 0.5) * head];
  const p2: Pt = [x1 - Math.cos(a + 0.5) * head, y1 - Math.sin(a + 0.5) * head];
  return (
    <g opacity={op}>
      <path d={`M ${x0} ${y0} L ${bx} ${by}`} stroke={color} strokeWidth={w} strokeLinecap="round" strokeDasharray={dash} />
      <path d={`M ${x1} ${y1} L ${p1[0]} ${p1[1]} L ${p2[0]} ${p2[1]} Z`} fill={color} stroke={color} strokeWidth={4} strokeLinejoin="round" />
    </g>
  );
};

/** A moon disc with a phase (0 = new, 0.5 = full, 1 = new again), lit from the right while waxing. */
export const MoonDisc: React.FC<{ x: number; y: number; r: number; phase?: number; ghost?: boolean }> = ({ x, y, r, phase = 0.5, ghost }) => {
  if (ghost) return <circle cx={x} cy={y} r={r} fill={CHALK} fillOpacity={0.1} stroke={CHALK} strokeWidth={3} strokeDasharray="8 6" opacity={0.75} />;
  const p = ((phase % 1) + 1) % 1;
  const lit = 0.5 - 0.5 * Math.cos(p * TAU); // 0..1..0
  const waxing = p < 0.5;
  // terminator ellipse half-width: +r (new) .. 0 (half) .. -r (full)
  const k = r * (1 - 2 * lit);
  const sweepOuter = waxing ? 1 : 0;
  const d = `M ${x} ${y - r} A ${r} ${r} 0 0 ${sweepOuter} ${x} ${y + r} A ${Math.abs(k)} ${r} 0 0 ${(k > 0) === waxing ? 0 : 1} ${x} ${y - r} Z`;
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#3F4528" stroke={CHALK} strokeWidth={2} strokeOpacity={0.35} />
      <path d={d} fill="#E4E2CF" />
    </g>
  );
};

/** A full Moon ball (craters, soft shade). */
export const MoonBall: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill="#E4E2CF" />
    <path d={`M ${x + r * 0.2} ${y - r * 0.98} A ${r} ${r} 0 0 1 ${x + r * 0.2} ${y + r * 0.98} A ${r * 1.1} ${r * 1.1} 0 0 0 ${x + r * 0.2} ${y - r * 0.98} Z`} fill="#A9AC86" opacity={0.6} />
    <circle cx={x - r * 0.3} cy={y - r * 0.2} r={r * 0.18} fill="#C2C0A8" />
    <circle cx={x + r * 0.1} cy={y + r * 0.35} r={r * 0.12} fill="#C2C0A8" />
  </g>
);

/** Rounded chip (a label tag with a coloured dot). */
export const Chip: React.FC<{ x: number; y: number; text: string; dot: string; k: number; size?: number }> = ({ x, y, text, dot, k, size = 40 }) => {
  if (k <= 0) return null;
  const w = text.length * size * 0.64 + 96;
  const h = size + 34;
  return (
    <g transform={`translate(${x} ${y}) scale(${k.toFixed(3)})`}>
      <path d={rrect(-w / 2, -h / 2, w, h, h / 2)} fill={INK} opacity={0.72} />
      <path d={rrect(-w / 2, -h / 2, w, h, h / 2)} fill="none" stroke={CHALK} strokeWidth={3} opacity={0.6} />
      <circle cx={-w / 2 + 38} cy={0} r={15} fill={dot} />
      <T x={-w / 2 + 66} y={size * 0.35} size={size} anchor="start">{text}</T>
    </g>
  );
};

// ================================================================== shared opener (ST01 line 0) for sts05 and sts07
// "Suppose Earth were twice as wide. Same rock, same oceans, same air, just twice the planet."
const MOSS = SUPPOSE.moss;
const GROUND = 1130;
const PIV: Pt = [770, GROUND];
const LLEN = 200, LSC = 1.25;
const LEVH = 230, LS = LEVH / 170;
const tipAt = (angle: number): Pt => {
  const a = (angle * Math.PI) / 180;
  return [PIV[0] + LSC * Math.sin(a) * LLEN, PIV[1] - LSC * (40 + Math.cos(a) * LLEN)];
};
/** Lev hanging on the knob: feet drop to the ground as the knob comes down */
const hangOn = (angle: number) => {
  const tip = tipAt(angle);
  const feet = Math.min(GROUND - 4, tip[1] + 182 * LS);
  return { x: tip[0] - 48 * LS, y: feet, hand: [48, (tip[1] - feet) / LS] as Pt };
};
const overshoot = (k: number) => (k <= 0 ? 0 : k >= 1 ? 1 : 1 - Math.pow(1 - k, 3) + Math.sin(k * Math.PI) * 0.07);

const LedgeV: React.FC = () => (
  <g>
    <path d={`M -20 ${SH} L -20 ${GROUND + 10} Q 60 ${GROUND - 8} 200 ${GROUND - 6} L 900 ${GROUND - 12} Q 1040 ${GROUND - 6} 1100 ${GROUND + 20} L 1100 ${SH} Z`} fill={MOSS.near} />
    <path d={`M 20 ${GROUND} Q 500 ${GROUND - 18} 1060 ${GROUND - 4}`} stroke={MOSS.bounce} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.8} />
  </g>
);

const E0 = { cx: 540, cy: 560, r: 140 };

/** Line 0, shot 1: Lev hops onto the SIZE ×2 lever and rides it down; the Earth swells to twice the width. */
export const OpenPull: VShot = ({ t, d, f }) => {
  const hopA = 22, hopB = 40, pullA = 44, pullB = 70;
  const angle = t < pullA ? 18 : mix(18, -40, ease(t, pullA, pullB));
  const hang = hangOn(angle);
  const hop = ease(t, hopA, hopB);
  const rub = Math.sin(t * 0.8);
  let lx = 560, ly = GROUND - 4;
  let pose: "stand" | "pull" = "stand";
  let hands: { front: Pt; back: Pt } = { front: [30 + 9 * rub, -82], back: [20 - 9 * rub, -86] };
  if (t >= hopA) {
    const h0 = hangOn(18);
    lx = mix(560, h0.x, hop);
    ly = mix(GROUND - 4, h0.y, hop) - Math.sin(hop * Math.PI) * 60;
    pose = "pull";
    hands = { front: [mix(30, 48, hop), mix(-82, h0.hand[1], hop)], back: [mix(20, 38, hop), mix(-86, h0.hand[1] + 10, hop)] };
    if (t >= hopB) {
      lx = hang.x;
      ly = hang.y;
      hands = { front: hang.hand, back: [hang.hand[0] - 10, hang.hand[1] + 10] };
    }
  }
  const g = overshoot(lin(t, 62, 108));
  const R = E0.r * (1 + g);
  const shake = t > 50 && t < 66 ? Math.sin(t * 2.2) * 4 : 0;
  return (
    <VStage fam="moss" t={t} d={d} f={f} push={0.03}>
      {[0, 1, 2, 3].map((k) => {
        const age = t - (64 + k * 16);
        if (age < 0 || age > 60) return null;
        return <circle key={k} cx={E0.cx} cy={E0.cy} r={R + age * 5} fill="none" stroke={AIR} strokeWidth={5} opacity={(1 - age / 60) * 0.5} />;
      })}
      <Earth cx={E0.cx + shake} cy={E0.cy} r={R} />
      {g > 0.05 ? <circle cx={E0.cx} cy={E0.cy} r={E0.r} fill="none" stroke={CHALK} strokeWidth={5} strokeDasharray="18 12" opacity={0.9 * ease(t, 66, 80)} /> : null}
      <LedgeV />
      <Lever x={PIV[0]} y={PIV[1]} len={LLEN} angle={angle} plate="SIZE ×2" scale={LSC} glow={0.2 + 0.5 * ease(t, pullA, pullB)} />
      <Lev x={lx} y={ly} h={LEVH} frame={f} pose={pose} hands={hands} lean={t >= hopB ? -10 : -4 + 4 * Math.sin(t / 7)} eyes={t > 90 ? "wide" : t > hopA ? "squint" : "happy"} wind={t >= hopA ? 0.9 : 0.4} shade="#9FB7A6" />
      <VCounter label="SIZE" value="×2" k={pop(t, 96, 14)} />
    </VStage>
  );
};

/** Line 0, shot 2: the big Earth turns; SAME ROCK / SAME OCEANS / SAME AIR pop; the old outline shows "twice". */
export const OpenSame: VShot = ({ t, d, f }) => {
  const cx = 540, cy = 640, R = 280;
  const items: [string, string, number][] = [["SAME ROCK", TERRA, 2], ["SAME OCEANS", OCEAN, 14], ["SAME AIR", AIR, 30]];
  return (
    <VStage fam="moss" t={t} d={d} f={f} push={0.05} cy={640}>
      <Bloom x={cx} y={cy} r={R * 1.7} color={AIR} strength={0.25 + 0.08 * Math.sin(f / 9)} />
      <Earth cx={cx} cy={cy} r={R} seed={4} />
      <circle cx={cx} cy={cy} r={R / 2} fill="none" stroke={CHALK} strokeWidth={5} strokeDasharray="18 12" strokeDashoffset={-t * 1.5} opacity={0.9} />
      <T x={cx} y={cy + 12} size={34} ls={3} opacity={ease(t, 0, 10)}>OUR EARTH</T>
      {[0, 1].map((k) => {
        const age = (t + k * 45) % 90;
        return <circle key={k} cx={cx} cy={cy} r={R + 8 + age * 2.2} fill="none" stroke={AIR} strokeWidth={4} opacity={(1 - age / 90) * 0.4} />;
      })}
      {items.map(([s, c, at], i) => (
        <Chip key={s} x={i === 1 ? 540 : i === 0 ? 300 : 780} y={i === 1 ? 1110 : 1030} text={s} dot={c} k={pop(t, at, 14)} size={36} />
      ))}
      <VCounter label="SIZE" value="×2" k={1 + 0.06 * Math.sin(Math.min(1, lin(t, 70, 90)) * Math.PI)} />
    </VStage>
  );
};
