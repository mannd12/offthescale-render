// L19 the radio tape, its tickets, the ledger and the reel (BUILD.md §5 `tape.tsx`; storyboard §1 "Tickets and tags", F2).
// HEARD = a solid lemon #FFD65A ticket with a waveform icon and ink text; MODEL = a dashed sky-blue #3AA8E0 outline over a
// blue fill with a curve icon and #FFF6DC text. Word + shape + line style carry the meaning (never colour alone).
// USAGE (f = the shot's frame)
//   <TapeTrace f x y w h?=90 mode="wave"|"jagged"|"flat"|"dashed" speed?=26 angle?={deg} timer?={0..1 → 0:00..58:00}
//              head?={true: the printing head at the right end} amp?={trace amplitude, px} />
//       the tape scrolls LEFT at `speed` px/f under a head at its right end; sprocket holes ride with it, so a flat or dashed
//       tape still moves. Before the tape is full the printed part grows leftward from the head (f × speed px).
//   <TapeTicket x y word="HEARD"|"MODEL" f slam?={0..1: drops 120 px and lands with a squash} swing?={deg amplitude, 18 ≈ 6 deg/f}
//               size?=1 draw?={0..1 the MODEL outline drawing on, 5-09} />
//   <Ledger f x0 x1 y solidTo={0..1} marker?={0..1} pins?={positions 0..1} pinPop?={0..1 staggered pop} drift?={px/f, 5} />
//       one long tape pinned across the frame: solid and glowing where HEARD, dashed where MODEL
//   <Reel x y r?=70 f speed?=8 /> a tape basket turning at `speed` deg/f with the tape leaving it
import React from "react";
import { IF2, rnd } from "../../lib/illustrated";
import { L19_COLORS as C } from "./families";
import { assertAllowed, assertValue } from "./data19";
import { sm } from "./tags19";

const cl = (v: number) => Math.max(0, Math.min(1, v));

const traceY = (u: number, mode: "wave" | "jagged" | "flat" | "dashed", amp: number) => {
  if (mode === "flat" || mode === "dashed") return Math.sin(u / 23) * amp * 0.06;
  if (mode === "jagged") {
    const k = Math.floor(u / 18);
    const a = (rnd(k) - 0.5) * 2;
    const b = (rnd(k + 1) - 0.5) * 2;
    const t = u / 18 - k;
    return (a + (b - a) * t) * amp;
  }
  return (Math.sin(u / 38) * 0.7 + Math.sin(u / 13.5) * 0.3) * amp;
};

export const TapeTrace: React.FC<{
  f: number;
  x: number;
  y: number;
  w: number;
  h?: number;
  mode: "wave" | "jagged" | "flat" | "dashed";
  speed?: number;
  angle?: number;
  timer?: number;
  head?: boolean;
  amp?: number;
}> = ({ f, x, y, w, h = 90, mode, speed = 26, angle = 0, timer, head = true, amp }) => {
  const A = amp ?? h * 0.32;
  const ghost = mode === "dashed";
  const printed = Math.min(w, f * speed + 40);
  const x0 = x + w - printed;
  const off = f * speed;
  const pts: string[] = [];
  for (let s = 0; s <= printed; s += 10) {
    const xs = x + w - s;
    pts.push(`${xs.toFixed(1)},${(y + traceY(off + s, mode, A)).toFixed(1)}`);
  }
  const holes = Math.ceil(printed / 48) + 1;
  const mins = timer != null ? Math.round(58 * cl(timer)) : 0;
  if (timer != null && timer >= 1) assertValue(58, "TapeTrace timer");
  return (
    <g transform={angle ? `rotate(${angle} ${x + w} ${y})` : undefined}>
      {/* ribbon */}
      <rect x={x0 + 6} y={y - h / 2 + 10} width={printed} height={h} rx={10} fill="#1A0402" opacity={0.3} />
      <rect
        x={x0}
        y={y - h / 2}
        width={printed}
        height={h}
        rx={10}
        fill={ghost ? "rgba(58,168,224,0.22)" : C.heard}
        stroke={ghost ? C.model : C.lemonDeep}
        strokeWidth={ghost ? 5 : 3}
        strokeDasharray={ghost ? "22 14" : undefined}
      />
      {!ghost ? <rect x={x0} y={y - h / 2 + 6} width={printed} height={h * 0.18} rx={6} fill="#FFF0A0" opacity={0.55} /> : null}
      {/* sprocket holes ride with the tape */}
      {Array.from({ length: holes }, (_, i) => {
        const hx = x + w - ((i * 48 + (off % 48)) % (holes * 48));
        if (hx < x0 + 8 || hx > x + w - 8) return null;
        return (
          <g key={i}>
            <rect x={hx - 9} y={y - h / 2 + 7} width={18} height={11} rx={3} fill={ghost ? C.model : "#B07A10"} opacity={ghost ? 0.6 : 0.8} />
            <rect x={hx - 9} y={y + h / 2 - 18} width={18} height={11} rx={3} fill={ghost ? C.model : "#B07A10"} opacity={ghost ? 0.6 : 0.8} />
          </g>
        );
      })}
      {/* the trace */}
      <polyline points={pts.join(" ")} fill="none" stroke={ghost ? C.model : C.ink} strokeWidth={ghost ? 6 : 7} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={ghost ? "16 12" : undefined} />
      {/* head */}
      {head ? (
        <g>
          <rect x={x + w - 4} y={y - h * 0.85} width={42} height={h * 1.7} rx={12} fill={C.goldRim} />
          <rect x={x + w + 4} y={y - h * 0.7} width={10} height={h * 1.4} rx={5} fill={C.goldHot} />
          <circle cx={x + w} cy={y + traceY(off, mode, A)} r={10} fill={ghost ? C.model : C.glow} />
        </g>
      ) : null}
      {timer != null ? (
        <text x={x + w + 60} y={y + 18} style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 52, fill: C.heard }}>
          {`${mins}:00`}
        </text>
      ) : null}
    </g>
  );
};

/** The waveform (HEARD) and curve (MODEL) icons. */
const TicketIcon: React.FC<{ word: "HEARD" | "MODEL"; x: number; y: number; s: number }> = ({ word, x, y, s }) =>
  word === "HEARD" ? (
    <polyline
      points={[0, 1, 2, 3, 4, 5, 6, 7, 8].map((k) => `${x + k * s * 0.11},${y + [0, -0.3, 0.25, -0.45, 0.4, -0.2, 0.3, -0.1, 0][k] * s}`).join(" ")}
      fill="none"
      stroke={C.ink}
      strokeWidth={s * 0.09}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  ) : (
    <path d={`M${x} ${y + s * 0.3} C${x + s * 0.3} ${y + s * 0.3} ${x + s * 0.4} ${y - s * 0.4} ${x + s * 0.88} ${y - s * 0.35}`} fill="none" stroke={C.modelLabel} strokeWidth={s * 0.09} strokeLinecap="round" strokeDasharray={`${s * 0.14} ${s * 0.08}`} />
  );

export const TapeTicket: React.FC<{ x: number; y: number; word: "HEARD" | "MODEL"; f: number; slam?: number; swing?: number; size?: number; draw?: number }> = ({
  x,
  y,
  word,
  f,
  slam = 1,
  swing = 0,
  size = 1,
  draw = 1,
}) => {
  const s = sm(slam);
  if (s <= 0) return null;
  const W = 300 * size;
  const H = 120 * size;
  const drop = (1 - s) * -120 * size;
  const land = slam >= 1 ? 0 : Math.max(0, Math.sin(Math.PI * cl((slam - 0.75) / 0.25)));
  const sx = 1 + land * 0.08;
  const sy = 1 - land * 0.1;
  const rot = swing * Math.sin(f * 0.33);
  const heard = word === "HEARD";
  const n = 7 * size; // notch radius
  const outline = `M${-W / 2 + n} ${-H / 2} H${W / 2 - n} A${n} ${n} 0 0 0 ${W / 2} ${-H / 2 + n} V${-n} A${n} ${n} 0 0 0 ${W / 2} ${n} V${H / 2 - n} A${n} ${n} 0 0 0 ${W / 2 - n} ${H / 2} H${-W / 2 + n} A${n} ${n} 0 0 0 ${-W / 2} ${H / 2 - n} V${n} A${n} ${n} 0 0 0 ${-W / 2} ${-n} V${-H / 2 + n} A${n} ${n} 0 0 0 ${-W / 2 + n} ${-H / 2} Z`;
  const perim = 2 * (W + H);
  return (
    <g transform={`translate(${x} ${y + drop}) rotate(${rot.toFixed(2)} 0 ${-H / 2 - 30 * size}) scale(${sx} ${sy})`} opacity={Math.min(1, s * 1.6)}>
      {swing ? <line x1={0} y1={-H / 2} x2={0} y2={-H / 2 - 30 * size} stroke={C.goldRim} strokeWidth={4 * size} /> : null}
      <path d={outline} fill="#1A0402" opacity={0.3} transform={`translate(${6 * size} ${9 * size})`} />
      <path d={outline} fill={heard ? C.heard : C.model} opacity={heard ? 1 : 0.92 * cl(draw * 1.4)} />
      <path
        d={outline}
        fill="none"
        stroke={heard ? C.lemonDeep : C.modelLabel}
        strokeWidth={heard ? 4 * size : 6 * size}
        strokeDasharray={heard ? undefined : draw < 1 ? `${perim * cl(draw)} ${perim}` : `${16 * size} ${10 * size}`}
      />
      <TicketIcon word={word} x={-W / 2 + 26 * size} y={0} s={70 * size} />
      <text x={-W / 2 + 120 * size} y={H * 0.2} style={{ fontFamily: IF2.label, fontSize: 56 * size, letterSpacing: 6 * size, fill: heard ? C.ink : C.modelLabel }}>
        {word}
      </text>
    </g>
  );
};

/** The honest ledger: one long tape across the frame. */
export const Ledger: React.FC<{ f: number; x0: number; x1: number; y: number; solidTo: number; marker?: number; pins?: number[]; pinPop?: number; drift?: number; label?: string }> = ({
  f,
  x0,
  x1,
  y,
  solidTo,
  marker,
  pins = [],
  pinPop = 1,
  drift = 5,
  label,
}) => {
  const W = x1 - x0;
  const xs = x0 + W * cl(solidTo);
  const h = 70;
  const off = (f * drift) % 60;
  const glow = 0.5 + 0.5 * Math.sin(f * 0.2);
  return (
    <g>
      <defs>
        <clipPath id={`ledger-solid-${Math.round(x0)}-${Math.round(y)}`}>
          <rect x={x0} y={y - h} width={xs - x0} height={h * 2} />
        </clipPath>
      </defs>
      <rect x={x0 + 6} y={y - h / 2 + 10} width={W} height={h} rx={12} fill="#002A1A" opacity={0.35} />
      {/* MODEL stretch */}
      <rect x={xs} y={y - h / 2} width={Math.max(0, x1 - xs)} height={h} rx={12} fill="rgba(58,168,224,0.3)" stroke={C.model} strokeWidth={5} strokeDasharray="22 14" strokeDashoffset={-f * drift} />
      {/* HEARD stretch with a moving glow band */}
      <rect x={x0 - 14} y={y - h / 2 - 14} width={Math.max(0, xs - x0) + 28} height={h + 28} rx={24} fill={C.heard} opacity={0.18 + 0.12 * glow} />
      <rect x={x0} y={y - h / 2} width={Math.max(0, xs - x0)} height={h} rx={12} fill={C.heard} />
      <g clipPath={`url(#ledger-solid-${Math.round(x0)}-${Math.round(y)})`}>
        {Array.from({ length: Math.ceil(W / 60) + 2 }, (_, i) => (
          <rect key={i} x={x0 - 60 + i * 60 + off} y={y - h / 2} width={26} height={h} fill="#FFF0A0" opacity={0.35} transform={`skewX(-20)`} />
        ))}
      </g>
      {/* sprocket holes along the whole tape (they drift) */}
      {Array.from({ length: Math.ceil(W / 60) + 1 }, (_, i) => {
        const hx = x0 + ((i * 60 + off) % W);
        const solid = hx < xs;
        return <rect key={i} x={hx} y={y - h / 2 + 6} width={18} height={10} rx={3} fill={solid ? "#B07A10" : C.model} opacity={0.75} />;
      })}
      {label ? (
        <text x={x0 + 20} y={y + 14} style={{ fontFamily: IF2.label, fontSize: 36, letterSpacing: 4, fill: C.ink }}>
          {assertAllowed(label, "Ledger label")}
        </text>
      ) : null}
      {marker != null ? (
        <g transform={`translate(${x0 + W * cl(marker)} ${y - h / 2 - 8})`}>
          <path d="M-26 -46 L26 -46 L0 0 Z" fill={C.goldRim} />
          <path d="M-14 -38 L14 -38 L0 -10 Z" fill={C.goldHot} />
        </g>
      ) : null}
      {pins.map((p, i) => {
        const k = sm(pinPop * (pins.length + 1) - i);
        if (k <= 0) return null;
        const px = x0 + W * cl(p);
        return (
          <g key={i} transform={`translate(${px} ${y - h / 2 - 4}) scale(${0.6 + 0.4 * k + (k < 1 ? Math.sin(k * Math.PI) * 0.3 : 0)})`}>
            <circle cx={3} cy={5} r={16} fill="#1A0402" opacity={0.3} />
            <circle r={16} fill={C.lever} />
            <circle cx={-5} cy={-5} r={5} fill="#FFE8B0" />
          </g>
        );
      })}
    </g>
  );
};

/** A tape basket that turns (the station's reel). */
export const Reel: React.FC<{ x: number; y: number; r?: number; f: number; speed?: number }> = ({ x, y, r = 70, f, speed = 8 }) => (
  <g>
    <circle cx={x + 5} cy={y + 8} r={r} fill="#002A1A" opacity={0.35} />
    <circle cx={x} cy={y} r={r} fill={C.goldRim} />
    <circle cx={x} cy={y} r={r * 0.8} fill={C.heard} />
    <g transform={`rotate(${(f * speed) % 360} ${x} ${y})`}>
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <rect key={k} x={x - r * 0.07} y={y - r * 0.78} width={r * 0.14} height={r * 0.6} rx={r * 0.05} fill={C.lemonDeep} transform={`rotate(${k * 60} ${x} ${y})`} />
      ))}
      <circle cx={x + r * 0.5} cy={y} r={r * 0.12} fill={C.ink} />
    </g>
    <circle cx={x} cy={y} r={r * 0.18} fill={C.ink} />
  </g>
);
