// LEV, Suppose Then's host (STYLE.md §2): chalk-white, round head, two dot eyes, no mouth, a lime scarf whose ends
// trail with motion. Expression comes from the eyes, head tilt and posture. Distinct from Tick (no suit, visor, lamp,
// backpack or staff; white not vermilion; a pear body on short legs). Pure function of props + frame.
import React from "react";
import { CHALK, CHALK_SHADE, INK, LIME, LIME_DEEP } from "./palette";

type Pt = [number, number];
export type LevPose = "stand" | "pull" | "point" | "shrug" | "sit" | "lean-on";
export type LevEyes = "open" | "wide" | "happy" | "squint" | "closed" | "up";

export type LevProps = {
  x: number;
  /** feet (ground line) */
  y: number;
  /** total height in px */
  h: number;
  frame?: number;
  facing?: 1 | -1;
  pose?: LevPose;
  eyes?: LevEyes;
  /** head tilt degrees (+ = toward facing side) */
  tilt?: number;
  /** whole-body lean degrees (+ = forward) */
  lean?: number;
  /** wind on the scarf, -1..1 (+ blows the tails backward, away from facing) */
  wind?: number;
  /** override hand targets (local units, facing +x, origin at feet, 170 units tall) */
  hands?: { front?: Pt; back?: Pt };
  /** shadow colour on the side away from the light */
  shade?: string;
  /** thin outline so Lev reads on light backgrounds */
  outline?: string;
  seed?: number;
  /** false hides both arms (close-ups where the shoulder caps read as lumps) */
  arms?: boolean;
};

const SH_Y = -104;
const HEAD: Pt = [2, -142];
const HEAD_R = 30;

const HANDS: Record<LevPose, { front: Pt; back: Pt }> = {
  stand: { front: [24, -58], back: [-24, -58] },
  pull: { front: [46, -128], back: [40, -120] },
  point: { front: [64, -122], back: [-22, -60] },
  shrug: { front: [44, -96], back: [-44, -96] },
  sit: { front: [26, -50], back: [-14, -52] },
  "lean-on": { front: [40, -92], back: [-24, -60] },
};

/** two-segment arm from shoulder to hand, elbow pushed out by `bend` */
const armPath = (s: Pt, h: Pt, bend: number) => {
  const mx = (s[0] + h[0]) / 2, my = (s[1] + h[1]) / 2;
  const dx = h[0] - s[0], dy = h[1] - s[1];
  const len = Math.hypot(dx, dy) || 1;
  const k = Math.max(0, 40 - len) * 0.5 + 6;
  const ex = mx + (-dy / len) * k * bend, ey = my + (dx / len) * k * bend;
  return `M ${s[0]} ${s[1]} Q ${ex} ${ey} ${h[0]} ${h[1]}`;
};

export const Lev: React.FC<LevProps> = ({
  x, y, h, frame = 0, facing = 1, pose = "stand", eyes = "open", tilt = 0, lean = 0, wind = 0.4, hands,
  shade = CHALK_SHADE, outline, seed = 1, arms = true,
}) => {
  const s = h / 170;
  const breathe = Math.sin(frame / 22 + seed) * 1.2;
  const ht = { ...HANDS[pose], ...hands };
  const sit = pose === "sit";
  const hipY = sit ? -30 : -46;
  // blink: a 4-frame close every ~3.5 s, offset by seed
  const bt = (frame + seed * 37) % 105;
  const blink = eyes !== "closed" && bt < 4;
  const eyeState: LevEyes = blink ? "closed" : eyes;
  const stroke = outline ?? "none";
  const ow = outline ? 2.2 / s : 0;

  // scarf tails: two strands trailing back (−x), waving with frame and wind
  const tail = (len: number, ph: number, y0: number) => {
    const pts: Pt[] = [];
    for (let i = 0; i <= 6; i++) {
      const t = i / 6;
      const wv = Math.sin(frame / 6 - t * 3.2 + ph) * (4 + t * 9) * (0.4 + Math.abs(wind));
      pts.push([-14 - t * len * (0.55 + wind * 0.45), y0 + t * (28 - wind * 26) + wv]);
    }
    return pts;
  };
  const strand = (pts: Pt[], w0: number, w1: number) => {
    const top = pts.map(([px, py], i) => [px, py - (w0 + (w1 - w0) * (i / 6)) / 2] as Pt);
    const bot = pts.map(([px, py], i) => [px, py + (w0 + (w1 - w0) * (i / 6)) / 2] as Pt).reverse();
    const all = [...top, ...bot];
    return "M " + all.map((p) => p.join(" ")).join(" L ") + " Z";
  };

  const eye = (ex: number) => {
    const ey = HEAD[1] - 3;
    switch (eyeState) {
      case "closed":
        return <path d={`M ${ex - 4} ${ey} Q ${ex} ${ey + 2.5} ${ex + 4} ${ey}`} stroke={INK} strokeWidth={2.6} fill="none" strokeLinecap="round" />;
      case "happy":
        return <path d={`M ${ex - 4.5} ${ey + 1.5} Q ${ex} ${ey - 4} ${ex + 4.5} ${ey + 1.5}`} stroke={INK} strokeWidth={2.8} fill="none" strokeLinecap="round" />;
      case "squint":
        return <ellipse cx={ex} cy={ey} rx={4} ry={1.8} fill={INK} />;
      case "wide":
        return (
          <g>
            <circle cx={ex} cy={ey} r={5.4} fill={INK} />
            <circle cx={ex + 1.6} cy={ey - 1.8} r={1.6} fill={CHALK} />
          </g>
        );
      case "up":
        return <circle cx={ex + 1} cy={ey - 4} r={4} fill={INK} />;
      default:
        return (
          <g>
            <circle cx={ex} cy={ey} r={4.2} fill={INK} />
            <circle cx={ex + 1.3} cy={ey - 1.4} r={1.2} fill={CHALK} />
          </g>
        );
    }
  };

  const shL: Pt = [-17, SH_Y + breathe * 0.4];
  const shR: Pt = [17, SH_Y + breathe * 0.4];

  return (
    <g transform={`translate(${x} ${y}) scale(${s * facing} ${s})`}>
      {/* ground shadow */}
      <ellipse cx={0} cy={2} rx={34} ry={6} fill="#000" opacity={0.22} />
      <g transform={`rotate(${lean} 0 ${hipY})`}>
        {/* back arm */}
        {arms ? <><path d={armPath(shL, ht.back, -1)} stroke={shade} strokeWidth={11} strokeLinecap="round" fill="none" />
        <circle cx={ht.back[0]} cy={ht.back[1]} r={7} fill={shade} /></> : null}
        {/* legs */}
        {sit ? (
          <>
            <path d={`M -10 ${hipY} Q 14 ${hipY + 2} 30 ${hipY + 10} L 32 2`} stroke={shade} strokeWidth={13} strokeLinecap="round" fill="none" />
            <path d={`M 8 ${hipY} Q 30 ${hipY + 2} 44 ${hipY + 10} L 46 2`} stroke={CHALK} strokeWidth={13} strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <path d={`M -9 ${hipY} L -12 -3`} stroke={shade} strokeWidth={13} strokeLinecap="round" />
            <path d={`M 9 ${hipY} L 13 -3`} stroke={CHALK} strokeWidth={13} strokeLinecap="round" />
            <ellipse cx={-10} cy={-3} rx={10} ry={5.5} fill={shade} />
            <ellipse cx={17} cy={-3} rx={10} ry={5.5} fill={CHALK} />
          </>
        )}
        {/* body: a soft pear, lit from the upper left; the shade crescent sits on the right */}
        <path
          d={`M -19 ${-114 + breathe} Q -30 ${-112 + breathe} -31 -90 L -33 ${hipY - 10} Q -33 ${hipY + 4} -16 ${hipY + 4} L 16 ${hipY + 4} Q 33 ${hipY + 4} 33 ${hipY - 10} L 31 -90 Q 30 ${-112 + breathe} 19 ${-114 + breathe} Z`}
          fill={CHALK}
          stroke={stroke}
          strokeWidth={ow}
        />
        <path d={`M 22 ${-108 + breathe} Q 31 -96 32 -80 L 33 ${hipY - 10} Q 33 ${hipY + 4} 16 ${hipY + 4} L 8 ${hipY + 4} Q 26 ${hipY - 6} 24 -84 Z`} fill={shade} opacity={0.75} />
        {/* scarf tails (behind the head, in front of the body) */}
        <path d={strand(tail(70, seed, -114 + breathe), 11, 7)} fill={LIME_DEEP} />
        <path d={strand(tail(58, seed + 1.7, -110 + breathe), 10, 6)} fill={LIME} />
        {/* head */}
        <g transform={`rotate(${tilt} ${HEAD[0]} ${HEAD[1] + 20})`}>
          <circle cx={HEAD[0]} cy={HEAD[1] + breathe} r={HEAD_R} fill={CHALK} stroke={stroke} strokeWidth={ow} />
          <path d={`M ${HEAD[0] + 12} ${HEAD[1] - 26 + breathe} A ${HEAD_R} ${HEAD_R} 0 0 1 ${HEAD[0] + 14} ${HEAD[1] + 27 + breathe} A 34 34 0 0 0 ${HEAD[0] + 12} ${HEAD[1] - 26 + breathe} Z`} fill={shade} opacity={0.7} />
          <g transform={`translate(0 ${breathe})`}>
            {eye(HEAD[0] + 9)}
            {eye(HEAD[0] + 22)}
          </g>
        </g>
        {/* scarf wrap at the neck */}
        <path d={`M -21 ${-119 + breathe} Q 0 ${-111 + breathe} 22 ${-119 + breathe} L 23 ${-107 + breathe} Q 0 ${-99 + breathe} -22 ${-107 + breathe} Z`} fill={LIME} />
        <path d={`M -21 ${-110 + breathe} Q 0 ${-102 + breathe} 22 ${-110 + breathe}`} stroke={LIME_DEEP} strokeWidth={2.4} fill="none" opacity={0.8} />
        {/* front arm */}
        {arms ? <><path d={armPath(shR, ht.front, 1)} stroke={CHALK} strokeWidth={11} strokeLinecap="round" fill="none" />
        <circle cx={ht.front[0]} cy={ht.front[1]} r={7.5} fill={CHALK} /></> : null}
      </g>
    </g>
  );
};

/** where a hand ends up in scene coordinates (to put the lever handle exactly in Lev's grip) */
export const levHand = (x: number, y: number, h: number, local: Pt, facing: 1 | -1 = 1): Pt => [x + local[0] * (h / 170) * facing, y + local[1] * (h / 170)];
