// L18 sky pieces (BUILD.md §5 `SkyBowl`, `MoonFace`; storyboard 1-01..1-09, 2-09, 2-10, Z-08..Z-10). The sky Moon is a
// VECTOR disc with crater rings and a wrap-around tiled texture (it scrolls forever, never settles); no image, no named
// lunar features, no flag, no lander (F1, F3, Q11). The Moon is warm tan with a gold rim, never grey (F7).
// USAGE (f = the shot's frame)
//   <SkyBowl f family cx?=960 horizon?=900 R?=820 draw?={0..1 ticks drawn left → right} pointer?={deg} sweep?={deg: a bright
//            edge swept from 0 to here} wedge?={[deg0, deg1] arms + bracket + fill} wedgeFill?={0..1 fill front across it}
//            trail?={[deg0, deg1] glowing arc} numerals?=false (0 · 90 · 180 on the arc; they light as `pointer`/`sweep`
//            passes) labels?=true (W at the left horizon, E at the right: storyboard 2-09) clouds?={px/f apricot band} ground? />
//     angles: 0 = the left (W) horizon, 90 = straight up, 180 = the right (E) horizon. bowlPt(deg, cx, horizon, R) → [x, y]
//   <MoonFace f x y radius scroll?={px/f the craters slide} dir?={deg, 0 = moving right} grid?={faint map grid, slides
//            with the craters} terminator?={-1..1, x of the shadow edge across the disc; animate it} rim?=1 ghost?={0..1 colour
//            drains to a dashed outline marching 18 px/f} crack?={0..1 the crack draws, 50 px/f on a big disc}
//            separate?={px the halves drift apart} seed? />
// The crater set is tiled (tile ≈ radius × 0.6, ≥ 180 px; 4 soft maria per 3×3-tile super-tile), drawn only where the disc meets the frame, so a radius-1400
// sky Moon stays cheap.
import React, { useId } from "react";
import { Family, IF2, alpha, mixHex, rnd } from "../../lib/illustrated";
import { L18_COLORS } from "./families";
import { assertAllowed } from "./data18";

const C = L18_COLORS;
const sid = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, "");
const cl = (v: number) => Math.max(0, Math.min(1, v));
const D2R = Math.PI / 180;

export const bowlPt = (deg: number, cx: number, horizon: number, R: number): [number, number] => [cx - R * Math.cos(deg * D2R), horizon - R * Math.sin(deg * D2R)];
const arcD = (a0: number, a1: number, cx: number, hz: number, R: number) => {
  const [x0, y0] = bowlPt(a0, cx, hz, R);
  const [x1, y1] = bowlPt(a1, cx, hz, R);
  return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${R} ${R} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
};

export const SkyBowl: React.FC<{
  f: number;
  family: Family;
  cx?: number;
  horizon?: number;
  R?: number;
  draw?: number;
  pointer?: number;
  sweep?: number;
  wedge?: [number, number];
  wedgeFill?: number;
  trail?: [number, number];
  numerals?: boolean;
  labels?: boolean;
  clouds?: number;
  ground?: string;
}> = ({ f, family: F, cx = 960, horizon = 900, R = 820, draw = 1, pointer, sweep, wedge, wedgeFill = 0, trail, numerals = false, labels = true, clouds = 0, ground }) => {
  const id = "sb" + sid(useId());
  const reach = cl(draw) * 180;
  const litTo = Math.max(pointer ?? -1, sweep ?? -1);
  const ticks: React.ReactNode[] = [];
  for (let d = 0; d <= 180; d += 5) {
    if (d > reach + 0.01) break;
    const major = d % 30 === 0;
    const [x0, y0] = bowlPt(d, cx, horizon, R);
    const [x1, y1] = bowlPt(d, cx, horizon, R - (major ? 34 : d % 10 === 0 ? 20 : 11));
    const on = d <= litTo;
    ticks.push(<line key={d} x1={x0} y1={y0} x2={x1} y2={y1} stroke={on ? C.moonRim : alpha(F.text, 0.7)} strokeWidth={major ? 5 : 3} strokeLinecap="round" />);
  }
  const nums = numerals
    ? [0, 90, 180].map((d) => {
        if (d > reach + 0.01) return null;
        const [nx, ny] = bowlPt(d, cx, horizon, R - 70);
        const on = d <= litTo;
        const txt = assertAllowed(`${d}°`, "SkyBowl numeral");
        return (
          <text key={"n" + d} x={nx + (d === 0 ? 18 : d === 180 ? -18 : 0)} y={ny + (d === 90 ? 10 : -8)} textAnchor={d === 0 ? "start" : d === 180 ? "end" : "middle"} style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: on ? 40 : 32, fill: on ? C.moonRim : alpha(F.text, 0.75) }}>
            {txt}
          </text>
        );
      })
    : null;
  const gnd = ground ?? F.near;
  return (
    <g>
      <defs>
        <linearGradient id={id + "g"} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={mixHex(gnd, F.light, 0.18)} />
          <stop offset="1" stopColor={gnd} />
        </linearGradient>
        <radialGradient id={id + "h"} cx="0.5" cy="1" r="0.6">
          <stop offset="0" stopColor={F.sky[F.sky.length - 1]} stopOpacity={0.9} />
          <stop offset="1" stopColor={F.sky[F.sky.length - 1]} stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* horizon glow */}
      <ellipse cx={cx} cy={horizon} rx={R * 1.4} ry={R * 0.45} fill={`url(#${id}h)`} />
      {/* the apricot cloud band, drifting and wrapping */}
      {clouds !== 0
        ? Array.from({ length: 7 }, (_, i) => {
            const span = 2600;
            const bx = ((((rnd(i * 3 + 1) * span + f * clouds * (0.7 + 0.5 * rnd(i))) % span) + span) % span) - 340;
            const by = horizon - 60 - rnd(i * 5 + 2) * 170;
            const bw = 220 + rnd(i * 7) * 260;
            return <rect key={"c" + i} x={bx} y={by} width={bw} height={26 + rnd(i * 9) * 22} rx={20} fill={i % 2 ? "#FFC65C" : "#F59A3B"} opacity={0.55} />;
          })
        : null}
      {/* the arc itself */}
      <path d={arcD(0, Math.max(0.01, reach), cx, horizon, R)} fill="none" stroke={alpha(F.text, 0.55)} strokeWidth={3} strokeDasharray="10 8" />
      {sweep != null && sweep > 0 ? (
        <g>
          <path d={arcD(0, Math.min(180, sweep), cx, horizon, R)} fill="none" stroke={C.moonRim} strokeWidth={9} strokeLinecap="round" />
          <circle cx={bowlPt(Math.min(180, sweep), cx, horizon, R)[0]} cy={bowlPt(Math.min(180, sweep), cx, horizon, R)[1]} r={26} fill={C.moonRim} opacity={0.45} />
        </g>
      ) : null}
      {trail ? <path d={arcD(trail[0], trail[1], cx, horizon, R * 0.72)} fill="none" stroke={C.moonRim} strokeWidth={18} strokeLinecap="round" opacity={0.5} /> : null}
      {ticks}
      {nums}
      {wedge
        ? (() => {
            const [a0, a1] = wedge;
            const [x0, y0] = bowlPt(a0, cx, horizon, R);
            const [x1, y1] = bowlPt(a1, cx, horizon, R);
            const fillA = a0 + (a1 - a0) * cl(wedgeFill);
            const [fx, fy] = bowlPt(fillA, cx, horizon, R);
            return (
              <g>
                <path d={`M${cx} ${horizon} L${x0} ${y0} ${arcD(a0, a1, cx, horizon, R).replace(/^M[^A]+/, "")} Z`} fill={alpha(C.moonRim, 0.16)} />
                {wedgeFill > 0 ? <path d={`M${cx} ${horizon} L${x0} ${y0} ${arcD(a0, fillA, cx, horizon, R).replace(/^M[^A]+/, "")} Z`} fill={alpha(C.amber, 0.45)} /> : null}
                {wedgeFill > 0 && wedgeFill < 1 ? <line x1={cx} y1={horizon} x2={fx} y2={fy} stroke={C.moonRim} strokeWidth={6} /> : null}
                <line x1={cx} y1={horizon} x2={x0} y2={y0} stroke={C.moonRim} strokeWidth={6} strokeLinecap="round" />
                <line x1={cx} y1={horizon} x2={x1} y2={y1} stroke={C.moonRim} strokeWidth={6} strokeLinecap="round" />
                <path d={arcD(a0, a1, cx, horizon, R + 34)} fill="none" stroke={C.moonRim} strokeWidth={7} strokeLinecap="round" />
                {[a0, a1].map((a, i) => {
                  const [p0x, p0y] = bowlPt(a, cx, horizon, R + 18);
                  const [p1x, p1y] = bowlPt(a, cx, horizon, R + 50);
                  return <line key={i} x1={p0x} y1={p0y} x2={p1x} y2={p1y} stroke={C.moonRim} strokeWidth={7} strokeLinecap="round" />;
                })}
              </g>
            );
          })()
        : null}
      {pointer != null ? (
        (() => {
          const [px, py] = bowlPt(pointer, cx, horizon, R - 10);
          return (
            <g>
              <line x1={cx} y1={horizon} x2={px} y2={py} stroke={C.amber} strokeWidth={7} strokeLinecap="round" />
              <circle cx={px} cy={py} r={14} fill={C.amber} />
              <circle cx={px} cy={py} r={30} fill={C.amber} opacity={0.3} />
            </g>
          );
        })()
      ) : null}
      {/* the ground: a flat plane, lit edge (no shore, no ocean: F6) */}
      <rect x={-400} y={horizon} width={2720} height={700} fill={`url(#${id}g)`} />
      <rect x={-400} y={horizon - 2} width={2720} height={5} fill={mixHex(F.light, gnd, 0.3)} />
      <circle cx={cx} cy={horizon} r={10} fill={C.amber} />
      {labels ? (
        <g style={{ fontFamily: IF2.label, fontSize: 38, letterSpacing: 2 }}>
          <text x={cx - R + 6} y={horizon + 52} textAnchor="middle" fill={F.text}>
            W
          </text>
          <text x={cx + R - 6} y={horizon + 52} textAnchor="middle" fill={F.text}>
            E
          </text>
        </g>
      ) : null}
    </g>
  );
};

type Crater = { u: number; v: number; r: number; k: number };
// kit-r1: 16 even craters with a lit upper-left rim read as BUBBLES. A crater is a hollow: dark floor, the shadow on the
// inner wall nearest the light (upper left), the lit wall opposite (lower right). Fewer, with a wide size range.
// kit-r2 (main-session review): evenly spaced round craters on a flat tan disc read as SWISS CHEESE. The face now has
// 3-4 large soft burnt-umber maria (a darker stop of the tan, irregular, soft-edged), about half the craters, thin rims.
const CRATERS: Crater[] = Array.from({ length: 5 }, (_, i) => ({ u: rnd(i * 7 + 3), v: rnd(i * 11 + 5), r: 0.03 + 0.13 * Math.pow(rnd(i * 13 + 1), 2.2), k: rnd(i * 17 + 2) }));
/** Maria per super-tile (u, v, size as fractions of the super-tile; seed for the outline). */
const MARIA = [
  { u: 0.24, v: 0.28, s: 0.2, seed: 3 },
  { u: 0.6, v: 0.2, s: 0.13, seed: 7 },
  { u: 0.5, v: 0.6, s: 0.24, seed: 11 },
  { u: 0.14, v: 0.74, s: 0.11, seed: 17 },
];
const MARE = "#A85A26"; // burnt-umber stop of the regolith tan (chroma 0.51: dark, never grey)
/** An irregular closed blob (smoothed through 11 jittered points). */
const blobD = (cx: number, cy: number, rr: number, seed: number) => {
  const n = 11;
  const pts = Array.from({ length: n }, (_, k) => {
    const a = (k / n) * Math.PI * 2;
    const q = rr * (0.72 + 0.5 * rnd(seed * 13 + k)) * (k % 2 ? 1 : 0.9);
    return [cx + Math.cos(a) * q * 1.25, cy + Math.sin(a) * q * 0.85];
  });
  const mid = (a: number[], b: number[]) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  let d = "";
  for (let k = 0; k < n; k++) {
    const p0 = pts[k];
    const p1 = pts[(k + 1) % n];
    const m0 = mid(pts[(k + n - 1) % n], p0);
    const m1 = mid(p0, p1);
    d += (k === 0 ? `M${m0[0].toFixed(1)} ${m0[1].toFixed(1)}` : "") + ` Q${p0[0].toFixed(1)} ${p0[1].toFixed(1)} ${m1[0].toFixed(1)} ${m1[1].toFixed(1)}`;
  }
  return d + " Z";
};

export const MoonFace: React.FC<{
  f: number;
  x: number;
  y: number;
  radius: number;
  scroll?: number;
  dir?: number;
  grid?: boolean;
  terminator?: number;
  rim?: number;
  ghost?: number;
  crack?: number;
  separate?: number;
  seed?: number;
}> = ({ f, x, y, radius: r, scroll = 0, dir = 0, grid = false, terminator, rim = 1, ghost = 0, crack = 0, separate = 0, seed = 1 }) => {
  const id = "mf" + sid(useId());
  const T = Math.max(180, r * 0.6);
  const ux = Math.cos(dir * D2R);
  const uy = Math.sin(dir * D2R);
  const M = T * 3; // the maria super-tile (wraps with the same scroll)
  const mox = (((ux * f * scroll) % M) + M) % M;
  const moy = (((uy * f * scroll) % M) + M) % M;
  const ox = (((ux * f * scroll) % T) + T) % T;
  const oy = (((uy * f * scroll) % T) + T) % T;
  // visible box (disc ∩ a generous frame)
  const bx0 = Math.max(x - r, -300);
  const bx1 = Math.min(x + r, 2220);
  const by0 = Math.max(y - r, -300);
  const by1 = Math.min(y + r, 1380);
  const g = cl(ghost);
  const maria: React.ReactNode[] = [];
  if (r >= 30 && bx1 > bx0 && by1 > by0) {
    for (let i = Math.floor((bx0 - x - mox) / M) - 1; i <= Math.ceil((bx1 - x - mox) / M); i++)
      for (let j = Math.floor((by0 - y - moy) / M) - 1; j <= Math.ceil((by1 - y - moy) / M); j++)
        MARIA.forEach((m, k) => {
          const mx = x + mox + i * M + m.u * M;
          const my = y + moy + j * M + m.v * M;
          const mr = m.s * M;
          if (mx + mr * 1.6 < bx0 || mx - mr * 1.6 > bx1 || my + mr < by0 || my - mr > by1) return;
          maria.push(
            <g key={`m${i}-${j}-${k}`}>
              <path d={blobD(mx, my, mr * 1.18, m.seed + seed)} fill={`url(#${id}m)`} opacity={0.55} />
              <path d={blobD(mx + mr * 0.05, my, mr * 0.92, m.seed + seed + 5)} fill={`url(#${id}m)`} opacity={0.75} />
            </g>,
          );
        });
  }
  const tiles: React.ReactNode[] = [];
  if (r >= 40 && bx1 > bx0 && by1 > by0) {
    const i0 = Math.floor((bx0 - x - ox) / T) - 1;
    const i1 = Math.ceil((bx1 - x - ox) / T) + 1;
    const j0 = Math.floor((by0 - y - oy) / T) - 1;
    const j1 = Math.ceil((by1 - y - oy) / T) + 1;
    for (let i = i0; i <= i1; i++)
      for (let j = j0; j <= j1; j++) {
        const tx = x + ox + i * T;
        const ty = y + oy + j * T;
        CRATERS.forEach((c, k) => {
          const cxp = tx + c.u * T;
          const cyp = ty + c.v * T;
          const cr = c.r * T * (0.8 + 0.4 * rnd(seed * 31 + ((i * 7 + j * 13) & 15)));
          if (cxp + cr < bx0 || cxp - cr > bx1 || cyp + cr < by0 || cyp - cr > by1) return;
          tiles.push(
            <g key={`${i}-${j}-${k}`}>
              <circle cx={cxp} cy={cyp} r={cr} fill={c.k > 0.5 ? C.moonMid : C.moonShade} opacity={0.7} />
              <path d={`M${cxp - cr * 0.98} ${cyp + cr * 0.2} A${cr} ${cr} 0 0 1 ${cxp + cr * 0.2} ${cyp - cr * 0.98} A${cr * 0.9} ${cr * 0.9} 0 0 0 ${cxp - cr * 0.98} ${cyp + cr * 0.2} Z`} fill={C.moonCrater} opacity={0.7} />
              <path d={`M${cxp + cr * 0.95} ${cyp - cr * 0.3} A${cr} ${cr} 0 0 1 ${cxp - cr * 0.3} ${cyp + cr * 0.95}`} fill="none" stroke={C.moonGlow} strokeWidth={Math.max(1.5, cr * 0.05)} strokeLinecap="round" opacity={0.85} />
            </g>,
          );
        });
      }
  }
  const gridEls: React.ReactNode[] = [];
  if (grid && r >= 40) {
    const G = T / 2;
    for (let k = Math.floor((bx0 - x - ox) / G) - 1; k <= Math.ceil((bx1 - x - ox) / G) + 1; k++) {
      const X = x + ox + k * G;
      gridEls.push(<line key={"gx" + k} x1={X} y1={by0} x2={X} y2={by1} stroke={C.moonRim} strokeWidth={2} opacity={0.28} />);
    }
    for (let k = Math.floor((by0 - y - oy) / G) - 1; k <= Math.ceil((by1 - y - oy) / G) + 1; k++) {
      const Y = y + oy + k * G;
      gridEls.push(<line key={"gy" + k} x1={bx0} y1={Y} x2={bx1} y2={Y} stroke={C.moonRim} strokeWidth={2} opacity={0.28} />);
    }
  }
  // the crack: a jagged line through the centre, left to right
  const cpts: [number, number][] = Array.from({ length: 9 }, (_, k) => {
    const s = k / 8;
    return [x - r * 1.05 + s * r * 2.1, y + (k === 0 || k === 8 ? 0 : (rnd(seed * 19 + k) - 0.5) * r * 0.3) + (s - 0.5) * r * 0.25];
  });
  const crackD = "M" + cpts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L");
  const halfTop = `${crackD} L${x + r * 1.2} ${y - r * 1.3} L${x - r * 1.2} ${y - r * 1.3} Z`;
  const halfBot = `${crackD} L${x + r * 1.2} ${y + r * 1.3} L${x - r * 1.2} ${y + r * 1.3} Z`;
  const termX = terminator != null ? x + terminator * r : null;
  const body = (
    <g>
      <circle cx={x} cy={y} r={r} fill={`url(#${id}g)`} />
      <g clipPath={`url(#${id}c)`}>
        {maria}
        {tiles}
        {gridEls}
        {termX != null ? (
          <g>
            {/* kit-r1: a straight terminator read as a seam; it is a curved edge (half an ellipse) with a soft band */}
            <path d={`M${x + r * 1.2} ${y - r * 1.1} L${termX} ${y - r * 1.1} A${r * 0.35} ${r * 1.1} 0 0 1 ${termX} ${y + r * 1.1} L${x + r * 1.2} ${y + r * 1.1} Z`} fill="#8A3E14" opacity={0.5} />
            <path d={`M${x + r * 1.2} ${y - r * 1.1} L${termX + r * 0.06} ${y - r * 1.1} A${r * 0.35} ${r * 1.1} 0 0 1 ${termX + r * 0.06} ${y + r * 1.1} L${x + r * 1.2} ${y + r * 1.1} Z`} fill="#6A2A0C" opacity={0.3} />
          </g>
        ) : null}
      </g>
    </g>
  );
  const sep = separate;
  return (
    <g>
      <defs>
        <radialGradient id={id + "g"} cx="0.38" cy="0.34" r="0.78">
          <stop offset="0" stopColor={C.moonLit} />
          <stop offset="0.62" stopColor={C.moonMid} />
          <stop offset="1" stopColor={C.moonShade} />
        </radialGradient>
        <radialGradient id={id + "b"} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.6" stopColor={C.moonRim} stopOpacity={0.5 * rim} />
          <stop offset="1" stopColor={C.moonRim} stopOpacity={0} />
        </radialGradient>
        <clipPath id={id + "c"}>
          <circle cx={x} cy={y} r={r} />
        </clipPath>
        <radialGradient id={id + "m"} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={MARE} />
          <stop offset="0.6" stopColor={MARE} stopOpacity={0.85} />
          <stop offset="1" stopColor={MARE} stopOpacity={0} />
        </radialGradient>
        <clipPath id={id + "t"}>
          <path d={halfTop} />
        </clipPath>
        <clipPath id={id + "u"}>
          <path d={halfBot} />
        </clipPath>
      </defs>
      <circle cx={x} cy={y} r={r * 1.25} fill={`url(#${id}b)`} opacity={1 - g} />
      <g opacity={1 - g}>
        {sep > 0 ? (
          <g>
            <g clipPath={`url(#${id}t)`} transform={`translate(${(-sep * 0.3).toFixed(1)} ${(-sep).toFixed(1)}) rotate(${(-sep * 0.02).toFixed(2)} ${x} ${y})`}>
              {body}
            </g>
            <g clipPath={`url(#${id}u)`} transform={`translate(${(sep * 0.3).toFixed(1)} ${sep.toFixed(1)}) rotate(${(sep * 0.02).toFixed(2)} ${x} ${y})`}>
              {body}
            </g>
          </g>
        ) : (
          body
        )}
        <circle cx={x} cy={y} r={r} fill="none" stroke={C.moonRim} strokeWidth={Math.max(3, r * 0.02)} opacity={0.95 * rim} />
      </g>
      {crack > 0 ? (
        <g>
          <path d={crackD} fill="none" stroke="#3A1606" strokeWidth={Math.max(4, r * 0.022)} strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - cl(crack)} />
          {crack < 1
            ? (() => {
                const s = cl(crack) * 8;
                const k = Math.min(7, Math.floor(s));
                const t = s - k;
                const hx = cpts[k][0] + (cpts[k + 1][0] - cpts[k][0]) * t;
                const hy = cpts[k][1] + (cpts[k + 1][1] - cpts[k][1]) * t;
                return (
                  <g>
                    <circle cx={hx} cy={hy} r={Math.max(10, r * 0.03)} fill={C.moonRim} />
                    <circle cx={hx} cy={hy} r={Math.max(26, r * 0.07)} fill={C.moonRim} opacity={0.3} />
                  </g>
                );
              })()
            : null}
        </g>
      ) : null}
      {g > 0 ? <circle cx={x} cy={y} r={r} fill="none" stroke={C.moonRim} strokeWidth={Math.max(4, r * 0.012)} strokeDasharray="26 18" strokeDashoffset={-f * 18} opacity={g} /> : null}
    </g>
  );
};
