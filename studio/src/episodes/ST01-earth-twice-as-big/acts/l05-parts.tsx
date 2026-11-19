// ST01 act l05 + closer: drawing parts (walker, treadmill, panels, ladder, stamp, forest, hanging lever, drift).
// Pure functions of props; no frame hooks.
import React from "react";
import { Bloom } from "../../../lib/illustrated/light";
import { blobPts, rrect, smoothPath } from "../../../lib/illustrated/shapes";
import { mixHex } from "../../../lib/illustrated/palette";
import { BRASS, BRASS_DARK, CHALK, INK, LIME, LIME_DEEP, ST_FONT, TERRA } from "../../../lib/suppose/palette";

type Pt = [number, number];
const rad = (d: number) => (d * Math.PI) / 180;
const closed = (pts: Pt[]) => smoothPath([...pts, pts[0], pts[1]]) + " Z";
export const TERRA_DARK = mixHex(TERRA, INK, 0.35);
export const TERRA_LIGHT = "#E8987A";

/** Slow camera drift for a body (ShotStage's drift needs <Layer>; this wraps the scene directly). */
// ShotStage now drifts the body in a camera Layer, so this only adds a tiny extra pan (k scales it; 0 = none).
export const Drift: React.FC<{ t: number; k?: number; dir?: 1 | -1; children: React.ReactNode }> = ({ t, k = 1, dir = 1, children }) => (
  <g transform={`translate(${(dir * 0.02 * t * k).toFixed(2)} 0)`}>{children}</g>
);

export const Txt: React.FC<{ x: number; y: number; size?: number; fill?: string; anchor?: "start" | "middle" | "end"; weight?: number; ls?: number; opacity?: number; children: React.ReactNode }> = ({
  x, y, size = 40, fill = INK, anchor = "middle", weight = 900, ls = 0, opacity = 1, children,
}) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={ST_FONT} fontWeight={weight} fontSize={size} letterSpacing={ls} fill={fill} opacity={opacity}>{children}</text>
);

// ------------------------------------------------------------------ the lime-line walker
/**
 * A lime line figure walking toward +x. `phase` drives the stride (radians); `hunch` 0..1 leans the torso and bends
 * the knees (strain, never a fall). `packs` = number of terracotta weights on the back; `drop` (per pack, 0..1) = how
 * far each has landed. Feet always meet y (the ground).
 */
export const Walker: React.FC<{ x: number; y: number; s: number; phase: number; hunch?: number; packs?: number; drop?: number[]; frame?: number }> = ({
  x, y, s, phase, hunch = 0, packs = 0, drop = [], frame = 0,
}) => {
  const L1 = 52, L2 = 50;
  const stride = 0.48 - hunch * 0.14;
  const lean = rad(5 + hunch * 26);
  const leg = (p: number) => {
    const a = stride * Math.sin(p);
    const b = 0.12 + hunch * 0.28 + 0.6 * Math.max(0, Math.cos(p));
    const knee: Pt = [L1 * Math.sin(a), L1 * Math.cos(a)];
    const foot: Pt = [knee[0] + L2 * Math.sin(a - b), knee[1] + L2 * Math.cos(a - b)];
    return { knee, foot };
  };
  const A = leg(phase), B = leg(phase + Math.PI);
  const hipY = -Math.max(A.foot[1], B.foot[1]);
  const hip: Pt = [0, hipY];
  const add = (p: Pt, q: Pt): Pt => [p[0] + q[0], p[1] + q[1]];
  const u: Pt = [Math.sin(lean), -Math.cos(lean)];
  const n: Pt = [-Math.cos(lean), -Math.sin(lean)];
  const T = 72;
  const sh: Pt = [hip[0] + u[0] * T, hip[1] + u[1] * T];
  const head: Pt = [sh[0] + Math.sin(lean * 1.25) * 30, sh[1] - Math.cos(lean * 1.25) * 30];
  const arm = (p: number) => {
    const a = -0.42 * Math.sin(p) * (1 - hunch * 0.5) + lean * 0.5;
    const el: Pt = [sh[0] + 38 * Math.sin(a), sh[1] + 38 * Math.cos(a)];
    const hd: Pt = [el[0] + 34 * Math.sin(a + 0.7), el[1] + 34 * Math.cos(a + 0.7)];
    return `M ${sh[0]} ${sh[1]} L ${el[0]} ${el[1]} L ${hd[0]} ${hd[1]}`;
  };
  const legPath = (l: { knee: Pt; foot: Pt }) => {
    const k = add(hip, l.knee), f = add(hip, l.foot);
    return `M ${hip[0]} ${hip[1]} L ${k[0]} ${k[1]} L ${f[0]} ${f[1]} l 16 0`;
  };
  const back = [legPath(B), arm(phase)];
  const front = [`M ${hip[0]} ${hip[1]} L ${sh[0]} ${sh[1]}`, legPath(A), arm(phase + Math.PI)];
  const line = (d: string, key: string, dim = false) => (
    <g key={key}>
      <path d={d} stroke={INK} strokeWidth={15} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={d} stroke={dim ? LIME_DEEP : LIME} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </g>
  );
  const sweat = hunch > 0.45 ? (frame % 30) / 30 : -1;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={4} cy={3} rx={46} ry={7} fill="#000" opacity={0.16} />
      {back.map((d, i) => line(d, "b" + i, true))}
      {Array.from({ length: packs }, (_, i) => {
        const k = drop[i] ?? 1;
        if (k <= 0) return null;
        const c: Pt = [hip[0] + u[0] * (22 + i * 21) + n[0] * 22, hip[1] + u[1] * (22 + i * 21) + n[1] * 22 - (1 - k) * 260];
        return (
          <g key={"p" + i} transform={`translate(${c[0]} ${c[1]}) rotate(${(lean * 180) / Math.PI})`} opacity={Math.min(1, k * 3)}>
            <rect x={-19} y={-10} width={38} height={20} rx={7} fill={TERRA} stroke={INK} strokeWidth={3} />
            <rect x={-13} y={-7} width={18} height={5} rx={2.5} fill={TERRA_LIGHT} opacity={0.8} />
          </g>
        );
      })}
      {front.map((d, i) => line(d, "f" + i))}
      <circle cx={head[0]} cy={head[1]} r={17} fill={LIME} stroke={INK} strokeWidth={3.5} />
      {sweat >= 0 ? (
        <g opacity={1 - sweat}>
          <path d={`M ${head[0] - 22} ${head[1] - 12 + sweat * 18} q -4 6 0 9 q 4 -3 0 -9 Z`} fill={CHALK} stroke={INK} strokeWidth={1.5} />
          <path d={`M ${head[0] + 6} ${head[1] - 26 + sweat * 10} q -3 5 0 7 q 3 -2 0 -7 Z`} fill={CHALK} stroke={INK} strokeWidth={1.5} />
        </g>
      ) : null}
    </g>
  );
};

/** A treadmill: belt stripes scroll toward -x at `speed` px/frame (scene units). Faces +x (console at the front). */
export const Treadmill: React.FC<{ x: number; y: number; w?: number; t: number; speed?: number }> = ({ x, y, w = 560, t, speed = 5 }) => {
  const x0 = x - w / 2, x1 = x + w / 2;
  const stripes: React.ReactNode[] = [];
  const gap = 46;
  const off = (((-t * speed) % gap) + gap) % gap;
  for (let sx = x0 + 18 + off; sx < x1 - 18; sx += gap) stripes.push(<path key={sx} d={`M ${sx} ${y + 4} h 18`} stroke={CHALK} strokeWidth={4} strokeLinecap="round" opacity={0.55} />);
  return (
    <g>
      <ellipse cx={x} cy={y + 44} rx={w * 0.58} ry={16} fill="#000" opacity={0.14} />
      {/* console + upright */}
      <path d={`M ${x1 - 40} ${y + 6} L ${x1 + 14} ${y - 300}`} stroke={INK} strokeWidth={22} strokeLinecap="round" />
      <path d={`M ${x1 - 40} ${y + 6} L ${x1 + 14} ${y - 300}`} stroke={TERRA_DARK} strokeWidth={14} strokeLinecap="round" />
      <path d={`M ${x1 + 12} ${y - 262} L ${x1 - 170} ${y - 240}`} stroke={INK} strokeWidth={14} strokeLinecap="round" />
      <path d={`M ${x1 + 12} ${y - 262} L ${x1 - 170} ${y - 240}`} stroke={TERRA} strokeWidth={7} strokeLinecap="round" />
      <path d={rrect(x1 - 54, y - 350, 120, 64, 16)} fill={TERRA} stroke={INK} strokeWidth={4} />
      <path d={rrect(x1 - 40, y - 338, 92, 26, 9)} fill={INK} opacity={0.75} />
      {/* deck */}
      <path d={rrect(x0, y - 6, w, 42, 21)} fill={TERRA} stroke={INK} strokeWidth={4} />
      <path d={rrect(x0 + 14, y + 18, w - 28, 10, 5)} fill={TERRA_LIGHT} opacity={0.55} />
      <path d={rrect(x0 + 10, y - 6, w - 20, 16, 8)} fill={INK} />
      {stripes}
      <circle cx={x0 + 22} cy={y + 15} r={9} fill={INK} />
      <circle cx={x1 - 22} cy={y + 15} r={9} fill={INK} />
    </g>
  );
};

// ------------------------------------------------------------------ a ladder that reads on light and dark families
export const RungLadder: React.FC<{
  x: number; top: number; bottom: number; labels: string[]; lit: number; frame: number; light?: boolean; width?: number;
  labelSize?: number; pulse?: (i: number) => number; opacity?: number; popLabel?: number;
}> = ({ x, top, bottom, labels, lit, frame, light = false, width = 64, labelSize = 26, pulse, opacity = 1, popLabel = 1 }) => {
  const n = labels.length;
  const step = (bottom - top) / (n + 0.5);
  const lx = x - width / 2 - 22;
  const rail = (rx: number) => (
    <g>
      {light ? <path d={`M ${rx} ${bottom + 20} L ${rx} ${top}`} stroke={INK} strokeWidth={13} strokeLinecap="round" /> : null}
      <path d={`M ${rx} ${bottom + 20} L ${rx} ${top}`} stroke={LIME} strokeWidth={7} strokeLinecap="round" />
    </g>
  );
  return (
    <g opacity={opacity}>
      {rail(x - width / 2)}
      {rail(x + width / 2)}
      {labels.map((r, i) => {
        const ry = bottom - step * (i + 0.5);
        const on = i <= lit;
        const cur = i === lit;
        const p = pulse ? pulse(i) : cur ? 0.5 + 0.2 * Math.sin(frame / 8) : 0;
        const ls = cur ? labelSize * 1.2 * (i === lit ? popLabel : 1) : labelSize;
        return (
          <g key={i}>
            {p > 0 ? <Bloom x={x} y={ry} r={width * 1.1} color={LIME} strength={p} /> : null}
            {light ? <path d={`M ${x - width / 2} ${ry} L ${x + width / 2} ${ry}`} stroke={INK} strokeWidth={cur ? 16 : 13} strokeLinecap="round" opacity={on ? 1 : 0.3} /> : null}
            <path d={`M ${x - width / 2} ${ry} L ${x + width / 2} ${ry}`} stroke={on ? LIME : LIME_DEEP} strokeWidth={cur ? 10 : 7} strokeLinecap="round" opacity={on ? 1 : 0.4} />
            {r && ls > 0.5 ? (
              <text x={lx} y={ry + ls * 0.34} textAnchor="end" fontFamily={ST_FONT} fontWeight={cur ? 900 : 800} fontSize={ls}
                fill={light ? INK : cur ? LIME : CHALK} opacity={on ? 1 : 0.4}>{r}</text>
            ) : null}
          </g>
        );
      })}
    </g>
  );
};
export const rungY = (top: number, bottom: number, n: number, i: number) => bottom - ((bottom - top) / (n + 0.5)) * (i + 0.5);

// ------------------------------------------------------------------ stamp
/** A rubber stamp that slams in at frame `at`: big → 1 with a short bounce. */
export const Stamp: React.FC<{ x: number; y: number; t: number; at: number; text: string; color: string; size?: number; rot?: number; sub?: string }> = ({
  x, y, t, at, text, color, size = 64, rot = -8, sub,
}) => {
  const k = (t - at) / 7;
  if (k <= 0) return null;
  const sc = k < 1 ? 2.6 - 1.6 * k * k : 1 + Math.sin(Math.min(1, (t - at - 7) / 8) * Math.PI) * -0.05;
  const w = Math.max(text.length * size * 0.74, (sub ?? "").length * size * 0.38 * 0.78) + 70;
  const h = size * 1.45 + (sub ? size * 0.55 : 0);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${sc})`} opacity={Math.min(1, k * 1.4)}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={18} fill={CHALK} opacity={0.82} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={18} fill="none" stroke={color} strokeWidth={8} />
      <rect x={-w / 2 + 12} y={-h / 2 + 12} width={w - 24} height={h - 24} rx={10} fill="none" stroke={color} strokeWidth={3} />
      <text x={0} y={(sub ? -size * 0.12 : size * 0.35)} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={size} letterSpacing={3} fill={color}>{text}</text>
      {sub ? <text x={0} y={size * 0.62} textAnchor="middle" fontFamily={ST_FONT} fontWeight={800} fontSize={size * 0.38} letterSpacing={2} fill={color}>{sub}</text> : null}
    </g>
  );
};
/** scene shake after a slam at `at` */
export const slamShake = (t: number, at: number) => {
  const u = t - at - 7;
  if (u < 0 || u > 12) return 0;
  return Math.sin(u * 2.4) * 7 * (1 - u / 12);
};

// ------------------------------------------------------------------ split-screen panels
export const PANEL = { L: { x: 80, w: 860 }, R: { x: 980, w: 860 }, y: 150, h: 830 };
export const Panels: React.FC<{ k: number; active?: "L" | "R" | "both"; fill: string; edge: string; left: React.ReactNode; right: React.ReactNode; dimColor: string }> = ({
  k, active = "both", fill, edge, left, right, dimColor,
}) => {
  const lx = -1000 * (1 - k), rx = 1000 * (1 - k);
  const panel = (px: number, content: React.ReactNode, dim: boolean, key: string) => (
    <g key={key}>
      <path d={rrect(px, PANEL.y + 10, 860, PANEL.h, 34)} fill="#000" opacity={0.08} />
      <path d={rrect(px, PANEL.y, 860, PANEL.h, 34)} fill={fill} stroke={edge} strokeWidth={3} />
      <g>{content}</g>
      {dim ? <path d={rrect(px, PANEL.y, 860, PANEL.h, 34)} fill={dimColor} opacity={0.55} /> : null}
    </g>
  );
  return (
    <g>
      <g transform={`translate(${lx} 0)`}>{panel(PANEL.L.x, left, active === "R", "l")}</g>
      <g transform={`translate(${rx} 0)`}>{panel(PANEL.R.x, right, active === "L", "r")}</g>
    </g>
  );
};

/** a bone (shaft with knobbed ends) from y0 to y1, drawn outlined */
const boneShapes = (x: number, y0: number, y1: number, w: number) => [
  <rect key="s" x={x - w / 2} y={y0} width={w} height={y1 - y0} rx={w / 2} />,
  <circle key="a" cx={x - w * 0.45} cy={y0 + 4} r={w * 0.72} />,
  <circle key="b" cx={x + w * 0.45} cy={y0 + 4} r={w * 0.72} />,
  <circle key="c" cx={x - w * 0.45} cy={y1 - 4} r={w * 0.72} />,
  <circle key="d" cx={x + w * 0.45} cy={y1 - 4} r={w * 0.72} />,
];
export const Bone: React.FC<{ x: number; y0: number; y1: number; w?: number }> = ({ x, y0, y1, w = 34 }) => (
  <g>
    <g fill={INK} stroke={INK} strokeWidth={9}>{boneShapes(x, y0, y1, w)}</g>
    <g fill={CHALK}>{boneShapes(x, y0, y1, w)}</g>
    <rect x={x - w * 0.32} y={y0 + 18} width={w * 0.22} height={y1 - y0 - 36} rx={w * 0.11} fill="#C7D2BE" />
  </g>
);

export const Arrow: React.FC<{ x0: number; y0: number; x1: number; y1: number; color?: string; w?: number; head?: number }> = ({ x0, y0, x1, y1, color = INK, w = 9, head = 22 }) => {
  const a = Math.atan2(y1 - y0, x1 - x0);
  const bx = x1 - Math.cos(a) * head * 0.8, by = y1 - Math.sin(a) * head * 0.8;
  const p1: Pt = [x1 - Math.cos(a - 0.5) * head, y1 - Math.sin(a - 0.5) * head];
  const p2: Pt = [x1 - Math.cos(a + 0.5) * head, y1 - Math.sin(a + 0.5) * head];
  return (
    <g>
      <path d={`M ${x0} ${y0} L ${bx} ${by}`} stroke={color} strokeWidth={w} strokeLinecap="round" />
      <path d={`M ${x1} ${y1} L ${p1[0]} ${p1[1]} L ${p2[0]} ${p2[1]} Z`} fill={color} stroke={color} strokeWidth={4} strokeLinejoin="round" />
    </g>
  );
};

/** inverted pendulum leg: planted foot at (fx, fy), rod length L, angle th (rad, + = toward +x) */
export const PendulumLeg: React.FC<{ fx: number; fy: number; L: number; th: number }> = ({ fx, fy, L, th }) => {
  const bx = fx + Math.sin(th) * L, by = fy - Math.cos(th) * L;
  return (
    <g>
      <path d={`M ${fx} ${fy} L ${bx} ${by}`} stroke={INK} strokeWidth={34} strokeLinecap="round" />
      <path d={`M ${fx} ${fy} L ${bx} ${by}`} stroke={CHALK} strokeWidth={22} strokeLinecap="round" />
      <path d={rrect(fx - 34, fy - 8, 84, 26, 13)} fill={TERRA} stroke={INK} strokeWidth={4} />
      <circle cx={fx} cy={fy} r={10} fill={INK} />
      <circle cx={bx} cy={by} r={48} fill={TERRA} stroke={INK} strokeWidth={5} />
      <circle cx={bx - 14} cy={by - 16} r={14} fill={TERRA_LIGHT} opacity={0.75} />
    </g>
  );
};

// ------------------------------------------------------------------ heavy-world forest
export const SquatTree: React.FC<{ x: number; y: number; w: number; h: number; seed: number; frame: number; trunk: string; leaf: string; leafLit: string; leafDark: string }> = ({
  x, y, w, h, seed, frame, trunk, leaf, leafLit, leafDark,
}) => {
  const a = Math.sin(frame / 38 + seed * 1.7) * 2.2;
  const cy = y - h - w * 0.12;
  return (
    <g transform={`rotate(${a.toFixed(3)} ${x} ${y})`}>
      <ellipse cx={x} cy={y + 4} rx={w * 0.55} ry={w * 0.06} fill="#000" opacity={0.15} />
      <path d={`M ${x - w * 0.17} ${y} Q ${x - w * 0.12} ${y - h * 0.6} ${x - w * 0.1} ${y - h - 10} L ${x + w * 0.1} ${y - h - 10} Q ${x + w * 0.12} ${y - h * 0.6} ${x + w * 0.17} ${y} Z`} fill={trunk} />
      <path d={closed(blobPts(x, cy + w * 0.05, w * 0.52, 11, seed, 0.12, 0.5))} fill={leafDark} />
      <path d={closed(blobPts(x - w * 0.02, cy, w * 0.5, 11, seed + 3, 0.12, 0.46))} fill={leaf} />
      <path d={closed(blobPts(x - w * 0.16, cy - w * 0.08, w * 0.24, 8, seed + 7, 0.15, 0.5))} fill={leafLit} opacity={0.8} />
    </g>
  );
};

/** a low, wide animal waddling toward +x; p = gait phase */
export const Waddler: React.FC<{ x: number; y: number; s: number; p: number; body?: string; belly?: string; facing?: 1 | -1 }> = ({ x, y, s, p, body = TERRA, belly = TERRA_LIGHT, facing = 1 }) => {
  const roll = Math.sin(p) * 6;
  const bob = Math.abs(Math.sin(p)) * 4;
  const legs = [-48, -20, 20, 48];
  return (
    <g transform={`translate(${x} ${y}) scale(${s * facing} ${s})`}>
      <ellipse cx={0} cy={3} rx={84} ry={9} fill="#000" opacity={0.16} />
      {legs.map((lx, i) => {
        const up = Math.max(0, Math.sin(p + (i % 2) * Math.PI)) * 8;
        return <rect key={i} x={lx - 10} y={-30 - up} width={20} height={30} rx={9} fill={TERRA_DARK} />;
      })}
      <g transform={`translate(0 ${-bob}) rotate(${roll} 0 -40)`}>
        <ellipse cx={0} cy={-48} rx={80} ry={34} fill={body} stroke={INK} strokeWidth={3} />
        <ellipse cx={-6} cy={-34} rx={58} ry={14} fill={belly} opacity={0.85} />
        <ellipse cx={-14} cy={-66} rx={40} ry={9} fill={TERRA_LIGHT} opacity={0.55} />
        <circle cx={84} cy={-38} r={22} fill={body} stroke={INK} strokeWidth={3} />
        <circle cx={92} cy={-44} r={4} fill={INK} />
        <path d={`M 70 -58 q 6 -12 14 -4`} stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
};

/** a tall, slim tree outline (our world), dashed, for the stockier comparison */
export const TallTreeOutline: React.FC<{ x: number; y: number; w: number; h: number; color: string }> = ({ x, y, w, h, color }) => {
  const cy = y - h * 0.62;
  return (
    <g fill="none" stroke={color} strokeWidth={5} strokeDasharray="16 11" strokeLinecap="round">
      <path d={`M ${x - w * 0.07} ${y} L ${x - w * 0.05} ${y - h * 0.4} M ${x + w * 0.07} ${y} L ${x + w * 0.05} ${y - h * 0.4}`} />
      <ellipse cx={x} cy={cy} rx={w * 0.32} ry={h * 0.36} />
    </g>
  );
};

// ------------------------------------------------------------------ the lever, hung on a hook
/** knob on the hook at (hx, hy); swings by `angle` degrees about the hook */
export const HangingLever: React.FC<{ hx: number; hy: number; angle: number; plate: string; dy?: number }> = ({ hx, hy, angle, plate, dy = 0 }) => {
  const arm = 190;
  const pw = Math.max(150, plate.length * 21 + 44);
  const top = hy + 22 + arm;
  return (
    <g transform={`translate(0 ${dy}) rotate(${angle} ${hx} ${hy})`}>
      <path d={`M ${hx} ${hy + 22} L ${hx} ${top + 4}`} stroke={BRASS_DARK} strokeWidth={22} strokeLinecap="round" />
      <path d={`M ${hx} ${hy + 22} L ${hx} ${top + 4}`} stroke={BRASS} strokeWidth={14} strokeLinecap="round" />
      <path d={`M ${hx - 3} ${hy + 26} L ${hx - 3} ${top}`} stroke="#FFF1C4" strokeWidth={3.5} strokeLinecap="round" opacity={0.6} />
      <circle cx={hx} cy={hy + 14} r={24} fill={TERRA} />
      <circle cx={hx - 7} cy={hy + 6} r={8} fill={TERRA_LIGHT} opacity={0.75} />
      <rect x={hx - pw / 2} y={top} width={pw} height={64} rx={14} fill={BRASS_DARK} />
      <rect x={hx - pw / 2 + 6} y={top + 4} width={pw - 12} height={30} rx={10} fill={BRASS} opacity={0.35} />
      <rect x={hx - pw / 2 + 12} y={top + 10} width={pw - 24} height={44} rx={9} fill="#F6E7B8" stroke={BRASS_DARK} strokeWidth={2} />
      <text x={hx} y={top + 41} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={27} letterSpacing={1.5} fill={INK}>{plate}</text>
    </g>
  );
};
