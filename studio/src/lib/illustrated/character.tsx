// Kit v2 character: TICK, the surveyor (docs/STYLE-V2.md §5). The Reference Figure grown into a character: still a
// 1.7 m vermilion person drawn to the scene's scale, so it stays our honest ruler, but now with a bone visor that
// carries two eyes, brows and a mouth (expressions), mitten hands, boots, a headlamp, a backpack and a survey staff
// striped like the gauge. Round-headed, capsule-bodied, no beak, no feathers, no wings: it is a person in a suit,
// not a bird or a blob. Everything is a pure function of props + frame.
import React from "react";
import { P, mixHex } from "./palette";
import { rnd } from "./motion";
import { LightCone } from "./light";

export const TICK_METRES = 1.7;

export type Expression = "neutral" | "happy" | "surprised" | "worried" | "thinking" | "proud" | "scared" | "sleepy" | "determined";
export type Pose = "stand" | "point" | "wave" | "think" | "cheer" | "hold" | "hips" | "shrug" | "cover-ears" | "sit";

type Pt = [number, number];
const TAU = Math.PI * 2;
const deg = (a: number) => (a * Math.PI) / 180;

// ---- proportions, in a 170-unit box (100 units = 1 m), origin at the feet, facing +x ---------------------------
const HIP: Pt = [0, -46];
const SHOULDER_Y = -106;
const SHOULDER_X = 26;
const HEAD: Pt = [0, -151];
const HEAD_R = 31;
const LEG = 20; // thigh and shin
const ARM1 = 24;
const ARM2 = 24;

/** Deterministic blink: 0 open .. 1 closed. One blink every ~3-5 s, 6 frames long, with an occasional double. */
export const blink = (frame: number, seed = 1) => {
  const period = 100 + Math.floor(rnd(seed) * 60);
  const t = (frame + Math.floor(rnd(seed + 3) * period)) % period;
  const dbl = rnd(seed + Math.floor(frame / period)) > 0.8;
  const one = (s: number) => (t >= s && t < s + 6 ? Math.sin(((t - s) / 6) * Math.PI) : 0);
  return Math.max(one(0), dbl ? one(10) : 0);
};

type Face = { browL: [number, number]; browR: [number, number]; eye: number; mouth: "smile" | "grin" | "o" | "frown" | "flat" | "smirk" | "wobble" | "line"; tilt: number };
// brow = [lift (units, up is +), angle (deg; + = outer end up)]
const FACES: Record<Expression, Face> = {
  neutral: { browL: [0, 0], browR: [0, 0], eye: 1, mouth: "smile", tilt: 0 },
  happy: { browL: [2, 4], browR: [2, 4], eye: 0.85, mouth: "grin", tilt: -3 },
  surprised: { browL: [6, 6], browR: [6, 6], eye: 1.3, mouth: "o", tilt: 2 },
  worried: { browL: [3, -14], browR: [3, -14], eye: 1, mouth: "frown", tilt: 3 },
  thinking: { browL: [5, 8], browR: [-1, -4], eye: 0.8, mouth: "flat", tilt: 5 },
  proud: { browL: [-1, 6], browR: [-1, 6], eye: 0.9, mouth: "smirk", tilt: -4 },
  scared: { browL: [7, -16], browR: [7, -16], eye: 1.25, mouth: "wobble", tilt: 0 },
  sleepy: { browL: [0, 0], browR: [0, 0], eye: 0.45, mouth: "line", tilt: 6 },
  determined: { browL: [-2, 14], browR: [-2, 14], eye: 0.85, mouth: "line", tilt: -2 },
};

/** Two-bone IK: joint between `a` and `b` with segment lengths l1, l2; `bend` = +1 bends toward +x side. */
const ik = (a: Pt, b: Pt, l1: number, l2: number, bend: 1 | -1): { j: Pt; end: Pt } => {
  let dx = b[0] - a[0];
  let dy = b[1] - a[1];
  let d = Math.hypot(dx, dy);
  const max = l1 + l2 - 0.5;
  if (d > max) {
    dx *= max / d;
    dy *= max / d;
    d = max;
  }
  const end: Pt = [a[0] + dx, a[1] + dy];
  const x1 = (d * d + l1 * l1 - l2 * l2) / (2 * d);
  const h = Math.sqrt(Math.max(0, l1 * l1 - x1 * x1));
  const ux = dx / d;
  const uy = dy / d;
  // perpendicular; choose the one whose x points to `bend`
  let nx = uy;
  let ny = -ux;
  if ((bend > 0 && nx < 0) || (bend < 0 && nx > 0)) {
    nx = -nx;
    ny = -ny;
  }
  return { j: [a[0] + ux * x1 + nx * h, a[1] + uy * x1 + ny * h], end };
};

export type TickProps = {
  x: number;
  /** y of the feet (ground line) */
  y: number;
  /** pixels per metre; Tick is TICK_METRES tall at this scale */
  pxPerM: number;
  /** the current frame, for blink, breathing, idle sway */
  frame?: number;
  facing?: 1 | -1;
  expression?: Expression;
  pose?: Pose;
  /** walk phase in strides (frame / framesPerStride); undefined = standing */
  walk?: number;
  /** head turn -1..1 (toward the back .. ahead) */
  look?: number;
  /** headlamp on: draws the lamp lit plus a light cone in `lampColor` */
  lamp?: boolean;
  lampColor?: string;
  /** survey staff (a striped ruler with a flag) in the front hand */
  staff?: boolean;
  /** suit colour (default vermilion) and visor colour */
  color?: string;
  visor?: string;
  /** seed for blink timing when several Ticks share a frame */
  seed?: number;
  /** whole-body rotation in degrees (floating in space, leaning into wind) */
  tilt?: number;
  /** extra squash/stretch {sx, sy} around the feet (from squash()/impact()) */
  squash?: { sx: number; sy: number };
  /** thin outline for tiny sizes on busy backgrounds */
  outline?: string;
};

/** Hand targets (local units, facing +x) per pose; `f` = frame for small idle motion. */
const handTargets = (pose: Pose, f: number, walkPh?: number): { front: Pt; back: Pt; frontBend: 1 | -1; backBend: 1 | -1 } => {
  const idle = Math.sin(f / 37) * 1.5;
  const swing = walkPh === undefined ? 0 : Math.sin(walkPh * TAU);
  switch (pose) {
    case "point":
      return { front: [68, -124 + idle], back: [-30, -62], frontBend: 1, backBend: -1 };
    case "wave":
      return { front: [44 + Math.sin(f / 5) * 6, -168 + Math.abs(Math.sin(f / 5)) * 4], back: [-30, -62], frontBend: 1, backBend: -1 };
    case "think":
      return { front: [14, -134 + idle * 0.5], back: [-10, -70], frontBend: 1, backBend: -1 };
    case "cheer":
      return { front: [46, -176 + idle], back: [-46, -176 - idle], frontBend: 1, backBend: -1 };
    case "hold":
      return { front: [36, -104], back: [-30, -62], frontBend: 1, backBend: -1 };
    case "hips":
      return { front: [34, -74], back: [-34, -74], frontBend: 1, backBend: -1 };
    case "shrug":
      return { front: [52, -98 + idle], back: [-52, -98 - idle], frontBend: -1, backBend: 1 };
    case "cover-ears":
      return { front: [28, -150], back: [-26, -150], frontBend: 1, backBend: -1 };
    case "sit":
      return { front: [30, -62], back: [-8, -66], frontBend: 1, backBend: -1 };
    case "stand":
    default:
      return {
        front: [32 + swing * 14 + idle * 0.3, -62 - Math.abs(swing) * 6],
        back: [-32 - swing * 14 - idle * 0.3, -62 - Math.abs(swing) * 6],
        frontBend: 1,
        backBend: -1,
      };
  }
};

export const Tick: React.FC<TickProps> = ({
  x,
  y,
  pxPerM,
  frame = 0,
  facing = 1,
  expression = "neutral",
  pose = "stand",
  walk,
  look = 0,
  lamp = false,
  lampColor = "#FFE9B8",
  staff = false,
  color = P.vermilion,
  visor = "#F7EFDF",
  seed = 1,
  tilt = 0,
  squash,
  outline,
}) => {
  const s = pxPerM / 100;
  const ink = "#1E2226";
  const suitShade = mixHex(color, "#15191C", 0.32);
  const suitLit = mixHex(color, "#FFFBF2", 0.18);
  const mitt = "#F2E6CF";
  const boot = mixHex(color, "#15191C", 0.55);
  const face = FACES[expression];
  const bl = blink(frame, seed);
  const breath = 1 + 0.012 * Math.sin((frame / 95) * TAU + seed);
  const idleSway = walk === undefined ? Math.sin(frame / 53 + seed) * 0.6 : 0;
  const stroke = outline ? { stroke: outline, strokeWidth: 1.6 / s, strokeLinejoin: "round" as const } : {};

  // ---- legs ---------------------------------------------------------------------------------------------------
  const sitting = pose === "sit";
  const SIT_DROP = 24;
  const ph = walk === undefined ? 0 : walk * TAU;
  const stride = 17;
  const liftH = 9;
  const legFor = (side: 1 | -1): { hip: Pt; knee: Pt; foot: Pt; lifted: number } => {
    const p = ph + (side > 0 ? 0 : Math.PI);
    const hip: Pt = [HIP[0] + side * 9, HIP[1]];
    if (sitting) {
      // the whole body drops by SIT_DROP (see below), so feet aim SIT_DROP above the ground line here
      const foot: Pt = [hip[0] + 28 + side * 4, -6 - SIT_DROP];
      const { j } = ik(hip, foot, LEG, LEG, 1);
      return { hip, knee: j, foot, lifted: 0 };
    }
    if (walk === undefined) {
      const foot: Pt = [hip[0] + side * 4, -7];
      const { j } = ik(hip, foot, LEG, LEG, 1);
      return { hip, knee: j, foot, lifted: 0 };
    }
    const fx = hip[0] + Math.sin(p) * stride;
    const lifted = Math.max(0, Math.cos(p));
    const fy = -7 - lifted * liftH;
    const { j } = ik(hip, [fx, fy], LEG, LEG, 1);
    return { hip, knee: j, foot: [fx, fy], lifted };
  };
  const legBack = legFor(-1);
  const legFront = legFor(1);
  // body bob: highest when legs pass (|sin|=0 → legs under body ... use double-frequency cosine)
  const bobY = walk === undefined ? 0 : -2.5 * Math.abs(Math.cos(ph)) - 1;
  const walkSquash = walk === undefined ? { sx: 1, sy: 1 } : { sx: 1 - 0.025 * Math.cos(2 * ph), sy: 1 + 0.025 * Math.cos(2 * ph) };
  const sq = squash ?? { sx: 1, sy: 1 };

  // ---- arms ---------------------------------------------------------------------------------------------------
  const ht = handTargets(pose, frame, walk);
  const shF: Pt = [SHOULDER_X, SHOULDER_Y];
  const shB: Pt = [-SHOULDER_X, SHOULDER_Y];
  const armF = ik(shF, ht.front, ARM1, ARM2, ht.frontBend);
  const armB = ik(shB, ht.back, ARM1, ARM2, ht.backBend);
  // the staff goes to whichever hand is free: the back hand when the front one points, waves, cheers or covers an ear
  const staffHand = pose === "point" || pose === "wave" || pose === "cheer" || pose === "cover-ears" || pose === "shrug" || pose === "think" ? armB.end : armF.end;

  // ---- face ---------------------------------------------------------------------------------------------------
  const eyeScale = Math.max(0.06, face.eye * (1 - bl));
  const lookX = look * 4;
  const mouthY = -140;
  const mouth = (() => {
    const cx = 4 + lookX;
    switch (face.mouth) {
      case "grin":
        return <path d={`M${cx - 9} ${mouthY - 1} Q${cx} ${mouthY + 11} ${cx + 9} ${mouthY - 1} Z`} fill={ink} />;
      case "o":
        return <ellipse cx={cx} cy={mouthY + 2} rx={4} ry={5} fill={ink} />;
      case "frown":
        return <path d={`M${cx - 6} ${mouthY + 3} Q${cx} ${mouthY - 3} ${cx + 6} ${mouthY + 3}`} fill="none" stroke={ink} strokeWidth={2.4} strokeLinecap="round" />;
      case "flat":
        return <path d={`M${cx - 4} ${mouthY + 1} L${cx + 7} ${mouthY}`} fill="none" stroke={ink} strokeWidth={2.4} strokeLinecap="round" />;
      case "smirk":
        return <path d={`M${cx - 6} ${mouthY} Q${cx + 2} ${mouthY + 6} ${cx + 9} ${mouthY - 3}`} fill="none" stroke={ink} strokeWidth={2.4} strokeLinecap="round" />;
      case "wobble":
        return <path d={`M${cx - 8} ${mouthY + 2} q3 -4 6 0 t6 0 t6 0`} fill="none" stroke={ink} strokeWidth={2.2} strokeLinecap="round" />;
      case "line":
        return <path d={`M${cx - 5} ${mouthY + 1} L${cx + 6} ${mouthY + 1}`} fill="none" stroke={ink} strokeWidth={2.4} strokeLinecap="round" />;
      case "smile":
      default:
        return <path d={`M${cx - 7} ${mouthY - 1} Q${cx} ${mouthY + 6} ${cx + 8} ${mouthY - 1}`} fill="none" stroke={ink} strokeWidth={2.4} strokeLinecap="round" />;
    }
  })();
  const brow = (ex: number, [liftB, ang]: [number, number], mirror: 1 | -1) => (
    <path
      d={`M${ex - 5} ${-160 - liftB} L${ex + 5} ${-160 - liftB}`}
      stroke={ink}
      strokeWidth={2.6}
      strokeLinecap="round"
      transform={`rotate(${-ang * mirror} ${ex} ${-160 - liftB})`}
    />
  );
  const eyeL = -5 + lookX;
  const eyeR = 11 + lookX;

  const limb = (a: Pt, j: Pt, b: Pt, w: number, c: string) => (
    <path d={`M${a[0]} ${a[1]} L${j[0].toFixed(1)} ${j[1].toFixed(1)} L${b[0].toFixed(1)} ${b[1].toFixed(1)}`} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
  );
  const bootAt = (foot: Pt, c: string) => <rect x={foot[0] - 11} y={foot[1] - 4} width={26} height={11} rx={5} fill={c} {...stroke} />;

  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt + idleSway}) scale(${s * facing} ${s}) scale(${sq.sx * walkSquash.sx} ${sq.sy * walkSquash.sy})`}>
      {/* staff: behind everything, in the front hand */}
      {staff ? (
        <g transform={`translate(${staffHand[0] + 6} 0)`}>
          <rect x={-2.5} y={-168} width={5} height={168} rx={2} fill="#EFE6D2" />
          {Array.from({ length: 10 }, (_, i) => (
            <rect key={i} x={-2.5} y={-168 + i * 17 + 8} width={5} height={4} fill={i % 2 ? ink : color} />
          ))}
          <path d="M2.5 -168 L26 -160 L2.5 -152 Z" fill={color} />
        </g>
      ) : null}
      <g transform={`translate(0 ${(bobY + (sitting ? SIT_DROP : 0)).toFixed(2)})`}>
        {/* back leg and back arm: shade tone */}
        {limb(legBack.hip, legBack.knee, legBack.foot, 13, suitShade)}
        {bootAt(legBack.foot, mixHex(boot, "#000", 0.2))}
        {pose !== "cover-ears" ? limb(shB, armB.j, armB.end, 12, suitShade) : null}
        {pose !== "cover-ears" ? <circle cx={armB.end[0]} cy={armB.end[1]} r={8.5} fill={mixHex(mitt, "#000", 0.18)} {...stroke} /> : null}
        {/* backpack on the back (behind the torso, toward -x) */}
        <rect x={-44} y={-110} width={26} height={54} rx={10} fill={suitShade} {...stroke} />
        <rect x={-40} y={-116} width={16} height={10} rx={4} fill={suitShade} />
        {/* torso with breathing */}
        <g transform={`translate(0 -40) scale(1 ${breath}) translate(0 40)`}>
          <rect x={-27} y={sitting ? -118 : -124} width={54} height={sitting ? 80 : 88} rx={22} fill={color} {...stroke} />
          <rect x={-27} y={-124} width={14} height={70} rx={7} fill={suitLit} opacity={0.55} transform="translate(5 8)" />
          <rect x={6} y={-110} width={21} height={66} rx={9} fill={suitShade} opacity={0.55} />
          {/* chest tag: a small bone square with a vermilion tick (brand mark) */}
          <rect x={6} y={-98} width={12} height={12} rx={2} fill={mitt} />
          <path d="M8 -92 L11 -89 L16 -96" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        </g>
        {/* head */}
        <g transform={`rotate(${face.tilt + look * 4} 0 ${HEAD[1] + 20})`}>
          <circle cx={HEAD[0]} cy={HEAD[1]} r={HEAD_R} fill={color} {...stroke} />
          <path d={`M${-HEAD_R + 4} ${HEAD[1] - 6} A${HEAD_R} ${HEAD_R} 0 0 1 ${HEAD[0] - 2} ${HEAD[1] - HEAD_R + 1}`} fill="none" stroke={suitLit} strokeWidth={4} strokeLinecap="round" opacity={0.7} />
          {/* visor: a bone plate toward the facing side */}
          <rect x={-18 + lookX * 0.6} y={-168} width={44} height={36} rx={15} fill={visor} />
          <rect x={-18 + lookX * 0.6} y={-168} width={44} height={36} rx={15} fill="none" stroke={suitShade} strokeWidth={2} opacity={0.5} />
          {/* eyes */}
          <g transform={`translate(${eyeL} -151) scale(1 ${eyeScale}) translate(${-eyeL} 151)`}>
            <circle cx={eyeL} cy={-151} r={4.6} fill={ink} />
            <circle cx={eyeL + 1.6} cy={-153} r={1.5} fill="#fff" />
          </g>
          <g transform={`translate(${eyeR} -151) scale(1 ${eyeScale}) translate(${-eyeR} 151)`}>
            <circle cx={eyeR} cy={-151} r={4.6} fill={ink} />
            <circle cx={eyeR + 1.6} cy={-153} r={1.5} fill="#fff" />
          </g>
          {brow(eyeL, face.browL, -1)}
          {brow(eyeR, face.browR, 1)}
          {mouth}
          {/* headlamp: on the helmet, front-top */}
          <circle cx={20} cy={-176} r={7} fill={ink} />
          <circle cx={21} cy={-176} r={4.2} fill={lamp ? lampColor : mixHex(visor, "#000", 0.35)} />
          {lamp ? <circle cx={21} cy={-176} r={11} fill={lampColor} opacity={0.35} /> : null}
          {/* antenna nub */}
          <path d={`M-14 -180 L-18 -190`} stroke={ink} strokeWidth={2.4} strokeLinecap="round" />
          <circle cx={-18.5} cy={-191.5} r={3} fill={ink} />
        </g>
        {/* front arm, front leg */}
        {limb(legFront.hip, legFront.knee, legFront.foot, 13, color)}
        {bootAt(legFront.foot, boot)}
        {limb(shF, armF.j, armF.end, 12, color)}
        <circle cx={armF.end[0]} cy={armF.end[1]} r={8.5} fill={mitt} {...stroke} />
        {pose === "cover-ears" ? (
          <>
            {limb(shB, armB.j, armB.end, 12, suitShade)}
            <circle cx={armB.end[0]} cy={armB.end[1]} r={8.5} fill={mixHex(mitt, "#000", 0.18)} />
          </>
        ) : null}
      </g>
      {lamp ? <LightCone x={24} y={-176} angle={look * 18 + 4} length={260} spread={16} color={lampColor} strength={0.5} /> : null}
    </g>
  );
};

/** Walk helper: strides per frame → phase. ~0.55 strides/s at 30 fps reads as a calm walk. */
export const walkPhase = (frame: number, framesPerStride = 54, offset = 0) => frame / framesPerStride + offset;
/** Horizontal distance covered by Tick per frame at a given pxPerM (so feet do not slide): stride ≈ 0.34 m. */
export const walkSpeed = (pxPerM: number, framesPerStride = 54) => (0.68 * pxPerM) / framesPerStride;
