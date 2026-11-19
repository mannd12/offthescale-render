// L17 · the empty city (BUILD.md §5): the lit skyline (simple boxes in three depth rows) and the empty street. No people,
// no cars, no named buildings (F1). The skyline's own mover is its WINDOW WAVES: a bright band crossing the rows at
// 18-30 px/f (cold open), then a dark wave draining them top-down (1-07), the ghost sinking box by box (Z-02).
// USAGE (f = the shot's frame)
//   <Skyline f family ground?=880 x0?=-80 x1?=2000 seed?=1
//            lights?={0..1 share of windows lit, or [far, mid, near]} wave?={px/f of the bright band, 0 = off; default 22}
//            drain?={0..1: the dark front's position, top (0) → ground (1)} sink?={0..1: boxes sink in a stagger}
//            ghost?={true: outlines only (Z-02)} haze?={0..1 teal haze band that hangs over it (7-09, 7-11)} scale?=1 />
//     drain at 30 px/f: drainFor(f, startFrame, ground - top) gives the 0..1 value for that speed.
//   skylineTop(seed, ground, scale) → the y of the tallest box (to aim a tilt or place a label above it)
//   <Street f family y?=860 speed?=18 (px/f the lamp posts slide; + = leftwards, the dolly goes right) signal?={x of the
//            crossing signal, scrolls with the posts} period?=36 (frames per signal colour) lit?={0..1 lamps on} />
import React from "react";
import { Bloom, Family, alpha, mixHex, rnd } from "../../lib/illustrated";
import { L17_COLORS, WINDOW_TINTS } from "./families";

const C = L17_COLORS;
const cl01 = (v: number) => Math.max(0, Math.min(1, v));

type Box = { x: number; w: number; h: number; row: number; i: number };
const ROWS = [
  { hMin: 220, hMax: 420, wMin: 90, wMax: 170, cols: 0, scaleY: 0.92 }, // far: no windows, lit stripes
  { hMin: 200, hMax: 520, wMin: 80, wMax: 150, cols: 3, scaleY: 0.96 }, // mid
  { hMin: 140, hMax: 600, wMin: 110, wMax: 200, cols: 4, scaleY: 1 }, // near
];
const boxesFor = (seed: number, x0: number, x1: number, scale: number): Box[] => {
  const out: Box[] = [];
  ROWS.forEach((R, row) => {
    let x = x0 - rnd(seed * 31 + row) * 120;
    let i = 0;
    while (x < x1) {
      const w = (R.wMin + rnd(seed * 97 + row * 13 + i * 7) * (R.wMax - R.wMin)) * scale;
      const h = (R.hMin + rnd(seed * 53 + row * 17 + i * 11) ** 1.4 * (R.hMax - R.hMin)) * scale;
      out.push({ x, w, h, row, i });
      x += w + (row === 2 ? 18 + rnd(seed * 3 + i) * 40 : 6 + rnd(seed * 5 + i) * 18) * scale;
      i++;
    }
  });
  return out;
};
export const skylineTop = (seed = 1, ground = 880, scale = 1) => ground - Math.max(...boxesFor(seed, -80, 2000, scale).map((b) => b.h));
/** The drain value (0..1) for a dark front moving at `speed` px/f over a skyline of height `height`, starting at `start`. */
export const drainFor = (f: number, start: number, height: number, speed = 30) => cl01(((f - start) * speed) / (height + 80));

export const Skyline: React.FC<{
  f: number;
  family: Family;
  ground?: number;
  x0?: number;
  x1?: number;
  seed?: number;
  lights?: number | [number, number, number];
  wave?: number;
  drain?: number;
  sink?: number;
  ghost?: boolean;
  haze?: number;
  scale?: number;
}> = ({ f, family: F, ground = 880, x0 = -80, x1 = 2000, seed = 1, lights = 0.75, wave = 22, drain = 0, sink = 0, ghost = false, haze = 0, scale = 1 }) => {
  const boxes = boxesFor(seed, x0, x1, scale);
  const top = ground - Math.max(...boxes.map((b) => b.h));
  const span = ground - top + 80;
  const front = top - 40 + cl01(drain) * span;
  const lit = (row: number) => (Array.isArray(lights) ? lights[row] : lights);
  const W = x1 - x0 + 600;
  const bandX = (row: number) => (((f * wave + row * 420) % W) + W) % W + x0 - 300;
  const plane = [F.far, F.mid, mixHex(F.near, F.mid, 0.35)];
  const nBox = boxes.length;
  const sinkOf = (b: Box) => {
    const order = rnd(seed * 71 + b.row * 29 + b.i * 3);
    return cl01((sink * 1.7 - order * 0.7) / 1) * (b.h + 10);
  };
  const cid = `skyclip${seed}`;
  return (
    <g>
      <defs>
        <clipPath id={cid}>
          <rect x={x0 - 400} y={-2000} width={x1 - x0 + 800} height={ground + 2000} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${cid})`}>
        {boxes.map((b) => {
          const dy = sink > 0 ? sinkOf(b) : 0;
          const y = ground - b.h * ROWS[b.row].scaleY + dy;
          const h = b.h * ROWS[b.row].scaleY;
          const fill = plane[b.row];
          if (ghost)
            return (
              <rect key={`${b.row}-${b.i}`} x={b.x} y={y} width={b.w} height={h + 4} rx={3} fill={alpha(F.light, 0.06)} stroke={alpha(F.text, 0.45)} strokeWidth={2.5} strokeDasharray="10 8" />
            );
          const bx = bandX(b.row);
          const els: React.ReactNode[] = [
            <rect key="b" x={b.x} y={y} width={b.w} height={h + 4} fill={fill} />,
            // lit edge on the left (key light from the city glow) and a darker right flank
            <rect key="l" x={b.x} y={y} width={4} height={h} fill={alpha(F.light, b.row === 2 ? 0.28 : 0.16)} />,
            <rect key="r" x={b.x + b.w * 0.72} y={y} width={b.w * 0.28} height={h + 4} fill={alpha(F.shadow, 0.28)} />,
          ];
          if (b.row === 0) {
            // far row: three thin lit stripes per box, dimmed by the drain front
            for (let k = 0; k < 3; k++) {
              const sy = y + 30 + k * ((h - 50) / 3);
              const on = rnd(seed * 7 + b.i * 5 + k) < lit(0) && sy > front;
              const near = Math.exp(-(((b.x + b.w / 2 - bx) / 160) ** 2));
              els.push(<rect key={`s${k}`} x={b.x + 10} y={sy} width={b.w - 20} height={4} fill={on ? WINDOW_TINTS[k % 4] : alpha(F.text, 0.08)} opacity={on ? 0.35 + 0.55 * near : 1} />);
            }
          } else {
            const cols = ROWS[b.row].cols;
            const cw = (b.w - 20) / cols;
            const rows = Math.floor((h - 26) / (b.row === 2 ? 34 : 28));
            for (let r = 0; r < rows; r++)
              for (let c = 0; c < cols; c++) {
                const wx = b.x + 12 + c * cw;
                const wy = y + 18 + r * (b.row === 2 ? 34 : 28);
                const k = seed * 1009 + b.row * 401 + b.i * 37 + r * 7 + c;
                const on = rnd(k) < lit(b.row);
                const drained = wy < front + (rnd(k + 3) - 0.5) * 70;
                const ww = cw * 0.52;
                const wh = b.row === 2 ? 16 : 12;
                if (!on || drained) {
                  els.push(<rect key={`w${r}-${c}`} x={wx} y={wy} width={ww} height={wh} fill={alpha(F.shadow, 0.55)} />);
                  continue;
                }
                const near = Math.exp(-(((wx - bx) / 130) ** 2));
                const col = near > 0.5 ? "#FFE6A8" : WINDOW_TINTS[(r + c + b.i) % 4];
                els.push(<rect key={`w${r}-${c}`} x={wx} y={wy} width={ww} height={wh} fill={col} opacity={0.62 + 0.38 * near} />);
                if (near > 0.6) els.push(<rect key={`g${r}-${c}`} x={wx - 5} y={wy - 5} width={ww + 10} height={wh + 10} rx={4} fill={C.amber} opacity={0.22 * near} />);
              }
          }
          return <g key={`${b.row}-${b.i}`}>{els}</g>;
        })}
      </g>
      {/* the street-glow under the skyline while it is lit */}
      {!ghost ? <rect x={x0} y={ground - 60} width={x1 - x0} height={70} fill={C.amber} opacity={0.1 * (1 - cl01(drain)) * (nBox > 0 ? 1 : 0)} /> : null}
      {haze > 0 ? (
        <g opacity={cl01(haze)}>
          <defs>
            <linearGradient id={`skyhaze${seed}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2FBFA8" stopOpacity={0} />
              <stop offset="0.45" stopColor="#2FBFA8" stopOpacity={0.32} />
              <stop offset="1" stopColor="#7FE0D8" stopOpacity={0.12} />
            </linearGradient>
          </defs>
          <rect x={x0} y={top - 260} width={x1 - x0} height={ground - top + 200} fill={`url(#skyhaze${seed})`} />
          {/* slow rolling crests on the haze band (10 px/f), so it reads as air, not a filter */}
          {Array.from({ length: 6 }, (_, i) => {
            const cx = ((((f * 10 + i * 420) % 2520) + 2520) % 2520) - 300;
            return <ellipse key={i} cx={cx} cy={top - 150 + (i % 2) * 40} rx={260} ry={34} fill="#7FE0D8" opacity={0.12} />;
          })}
        </g>
      ) : null}
    </g>
  );
};

export const Street: React.FC<{ f: number; family: Family; y?: number; speed?: number; signal?: number; period?: number; lit?: number; gap?: number }> = ({
  f,
  family: F,
  y = 860,
  speed = 18,
  signal = 1300,
  period = 36,
  lit = 1,
  gap = 420,
}) => {
  const travel = f * speed;
  const off = ((travel % gap) + gap) % gap;
  const n = Math.ceil(2200 / gap) + 2;
  const sx = signal - travel;
  const phase = Math.floor(f / period) % 3; // green → amber → red
  const sigCols = ["#2FBF71", C.amber, C.vermilion];
  const tar = mixHex(F.near, "#0B2530", 0.4);
  return (
    <g>
      {/* bare tarmac, kerb and lane dashes (the dashes slide with the dolly) */}
      <rect x={-200} y={y} width={2400} height={1080 - y + 200} fill={tar} />
      <rect x={-200} y={y - 10} width={2400} height={12} fill={mixHex(F.mid, "#CFE6E2", 0.25)} />
      {Array.from({ length: Math.ceil(2400 / 180) + 2 }, (_, i) => {
        const dx = -200 + i * 180 - ((travel * 1.4) % 180);
        return <rect key={i} x={dx} y={y + 110} width={96} height={10} rx={3} fill="#E8F2EE" opacity={0.35} />;
      })}
      {/* lamp posts: pole, arm, lamp with a radial bloom and a pool on the tarmac */}
      {Array.from({ length: n }, (_, i) => {
        const px = -200 + i * gap - off;
        return (
          <g key={i}>
            <ellipse cx={px + 70} cy={y + 60} rx={140} ry={28} fill={C.amber} opacity={0.14 * lit} />
            <rect x={px - 6} y={y - 380} width={12} height={380} fill={mixHex(F.far, "#0B2530", 0.3)} />
            <rect x={px - 6} y={y - 380} width={3} height={380} fill={alpha(F.light, 0.35)} />
            <path d={`M${px} ${y - 376} Q${px + 40} ${y - 410} ${px + 84} ${y - 392}`} fill="none" stroke={mixHex(F.far, "#0B2530", 0.3)} strokeWidth={8} strokeLinecap="round" />
            <rect x={px + 66} y={y - 394} width={40} height={14} rx={5} fill={lit > 0 ? "#FFE6A8" : "#33505A"} />
            {lit > 0 ? <Bloom x={px + 86} y={y - 380} r={110} color={C.amber} strength={0.75 * lit} /> : null}
          </g>
        );
      })}
      {/* the crossing signal: pole + three lamps; one lit at a time */}
      {sx > -200 && sx < 2200 ? (
        <g>
          <rect x={sx - 7} y={y - 300} width={14} height={300} fill="#0B2530" />
          <rect x={sx - 32} y={y - 420} width={64} height={150} rx={12} fill="#0B2530" stroke={alpha(F.text, 0.3)} strokeWidth={2} />
          {[0, 1, 2].map((k) => {
            const on = 2 - k === phase ? 1 : 0;
            const col = sigCols[2 - k];
            return (
              <g key={k}>
                <circle cx={sx} cy={y - 395 + k * 46} r={17} fill={on ? col : alpha(col, 0.18)} />
                {on ? <Bloom x={sx} y={y - 395 + k * 46} r={70} color={col} strength={0.8} /> : null}
              </g>
            );
          })}
        </g>
      ) : null}
    </g>
  );
};
