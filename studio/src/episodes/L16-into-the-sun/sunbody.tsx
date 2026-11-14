// L16 Sun body pieces (BUILD.md §5). F5: the Sun never has a face, an outline or anything from Kurzgesagt. F6: the
// cutaway layers are in TRUE proportion (SUN_R, sources rows 17, 19, 20). Glows are radial gradients (no blur filters).
// USAGE (f = the shot's frame)
//   <SunLimb f cx cy R granules?=true bloom?=1 granSize?=70 drift?=5 />   the huge disc whose top edge fills the lower
//        frame: centre (cx, cy) usually far below the frame (e.g. cx 960, cy 3200, R 2600); granules boil on it
//   <CoronaHalo f cx cy R extent?=520 loops?=5 a0?=-150 a1?=-30 intensity?=1 rays?=true />   violet-magenta glow over
//        the limb with prominence loops rising/swaying ≈ 10 px/f between angles a0..a1 (deg, -90 = straight up)
//   <Alfven f cx cy R a0? a1? wobble?=40 spikes?=0 draw?=1 cross?={angle, age} color? fillInside? />   the wavy
//        boundary shell (wobble crest moves ≈ 7 px/f); spikes 0..1 = the spikes and valleys of 3-12; draw 0..1 dots
//        it on from a0; cross = the crossing flash (age = frames since the crossing)
//   <AlfvenFlat f x y h wobble? spikes? draw? />   the same boundary as a near-vertical line (ruler shots, 3-04…3-12)
//   <SunCutaway f cx cy r variant?="full|quarter" highlight? radius?={angle, draw} rotate?=4 labels? />   the Sun in true
//        layer proportions; rotate (°/f) spins the layer textures; transparent background (no Sky)
import React, { useId } from "react";
import { Bloom, alpha, mixHex, rnd, smoothPath, type Pt } from "../../lib/illustrated";
import { L16_COLORS, sunGradient } from "./families";
import { Granules, photonPath } from "./movers16";
import { SUN_R } from "./sundata";

const C = L16_COLORS;
const D2R = Math.PI / 180;
const sid = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, "");
const cl01 = (v: number) => Math.max(0, Math.min(1, v));

const RadialStops: React.FC<{ id: string; stops: [number, string][]; cx?: string; cy?: string; r?: string; op?: number[] }> = ({ id, stops, cx = "50%", cy = "50%", r = "50%", op }) => (
  <radialGradient id={id} cx={cx} cy={cy} r={r}>
    {stops.map(([o, c], i) => (
      <stop key={i} offset={o} stopColor={c} stopOpacity={op ? op[i] : 1} />
    ))}
  </radialGradient>
);

// ---------------------------------------------------------------------------------------------------------------
// SunLimb
// ---------------------------------------------------------------------------------------------------------------
export const SunLimb: React.FC<{ f: number; cx: number; cy: number; R: number; granules?: boolean; bloom?: number; granSize?: number; drift?: number; seed?: number }> = ({
  f,
  cx,
  cy,
  R,
  granules = true,
  bloom = 1,
  granSize = 70,
  drift = 5,
  seed = 1,
}) => {
  const id = "limb" + sid(useId());
  const top = cy - R;
  // the visible part of the disc: from its top edge to the frame bottom (cap the granule band to it)
  const bandTop = Math.max(-200, top);
  const bandH = Math.max(0, 1280 - bandTop);
  const circle = `M${cx - R} ${cy} a${R} ${R} 0 1 0 ${2 * R} 0 a${R} ${R} 0 1 0 ${-2 * R} 0 Z`;
  return (
    <g>
      <defs>
        <RadialStops id={id} stops={sunGradient(R)} />
        <RadialStops id={id + "b"} stops={[[0, C.gold], [R / (R + 420), C.amber], [(R + 140) / (R + 420), C.magenta], [1, C.violet]]} op={[0.9, 0.75, 0.3, 0]} />
      </defs>
      {bloom > 0 ? <circle cx={cx} cy={cy} r={R + 420} fill={`url(#${id}b)`} opacity={bloom * (0.92 + 0.08 * Math.sin(f / 11))} /> : null}
      <circle cx={cx} cy={cy} r={R} fill={`url(#${id})`} />
      {granules && bandH > 0 ? (
        <Granules f={f} x={cx - Math.min(R, 1400)} y={bandTop} w={Math.min(2 * R, 2800)} h={Math.min(bandH, 700)} size={granSize} drift={drift} clip={circle} seed={seed} colors={[alpha(C.tangerine, 0), C.amber, C.whiteGold]} opacity={0.5} />
      ) : null}
      {/* limb darkening: the rim band (tangerine → magenta) over the granules, no outline */}
      <circle cx={cx} cy={cy} r={R - 30} fill="none" stroke={C.tangerine} strokeWidth={60} opacity={0.35} />
      <circle cx={cx} cy={cy} r={R - 8} fill="none" stroke={C.magenta} strokeWidth={16} opacity={0.45} />
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// CoronaHalo
// ---------------------------------------------------------------------------------------------------------------
export const CoronaHalo: React.FC<{ f: number; cx: number; cy: number; R: number; extent?: number; loops?: number; a0?: number; a1?: number; intensity?: number; rays?: boolean; seed?: number }> = ({
  f,
  cx,
  cy,
  R,
  extent = 520,
  loops = 5,
  a0 = -150,
  a1 = -30,
  intensity = 1,
  rays = true,
  seed = 2,
}) => {
  const id = "halo" + sid(useId());
  const Rt = R + extent;
  const k = R / Rt;
  return (
    <g>
      <defs>
        <RadialStops id={id} stops={[[0, C.shieldRim], [k, C.shieldRim], [k + (1 - k) * 0.18, C.magenta], [k + (1 - k) * 0.55, C.violet], [1, C.violet]]} op={[0, 0.85, 0.6, 0.28, 0]} />
      </defs>
      <circle cx={cx} cy={cy} r={Rt} fill={`url(#${id})`} opacity={intensity} />
      {/* streamer rays: long soft wedges turning slowly (shimmer) */}
      {rays
        ? Array.from({ length: 9 }, (_, i) => {
            const a = (a0 + ((a1 - a0) * (i + 0.5)) / 9 + Math.sin(f / 40 + i) * 3) * D2R;
            const L = extent * (0.7 + 0.5 * rnd(seed * 7 + i)) * (0.9 + 0.1 * Math.sin(f / 13 + i));
            const w = 0.05 + 0.03 * rnd(seed * 3 + i);
            const p = (aa: number, rr: number): string => `${(cx + Math.cos(aa) * rr).toFixed(1)} ${(cy + Math.sin(aa) * rr).toFixed(1)}`;
            return <path key={"r" + i} d={`M${p(a - w, R)} L${p(a, R + L)} L${p(a + w, R)} Z`} fill={i % 2 ? C.magenta : C.gold} opacity={0.18 * intensity} />;
          })
        : null}
      {/* prominence loops: arches on the limb, height breathing ≈ 10 px/f at the crest */}
      {Array.from({ length: loops }, (_, i) => {
        const am = (a0 + ((a1 - a0) * (i + 0.5)) / Math.max(1, loops)) * D2R;
        const half = (4 + 3 * rnd(seed * 11 + i)) * D2R;
        const h0 = extent * (0.22 + 0.22 * rnd(seed * 13 + i));
        const h = h0 * (0.7 + 0.3 * Math.sin(f / 9 + i * 1.7));
        const sway = Math.sin(f / 14 + i) * 0.03;
        const pa = (aa: number, rr: number): Pt => [cx + Math.cos(aa) * rr, cy + Math.sin(aa) * rr];
        const s = pa(am - half, R - 6);
        const e = pa(am + half, R - 6);
        const top = pa(am + sway, R + h);
        const c1 = pa(am - half * 1.2 + sway, R + h * 1.25);
        const c2 = pa(am + half * 1.2 + sway, R + h * 1.25);
        const d = `M${s[0].toFixed(1)} ${s[1].toFixed(1)} Q${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${top[0].toFixed(1)} ${top[1].toFixed(1)} Q${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${e[0].toFixed(1)} ${e[1].toFixed(1)}`;
        return (
          <g key={"l" + i}>
            <path d={d} fill="none" stroke={C.magenta} strokeWidth={26} strokeLinecap="round" opacity={0.45 * intensity} />
            <path d={d} fill="none" stroke={C.gold} strokeWidth={9} strokeLinecap="round" opacity={0.9 * intensity} />
          </g>
        );
      })}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Alfvén boundary (an arc around the Sun's centre) and its flat form for the ruler shots
// ---------------------------------------------------------------------------------------------------------------
const boundaryR = (th: number, f: number, R: number, wobble: number, spikes: number, seed: number) => {
  const w = wobble * (0.6 * Math.sin(th * 9 + f * 0.18) + 0.4 * Math.sin(th * 23 - f * 0.11 + seed));
  // spikes: sharp narrow excursions (triangle-wave peaks) that come and go
  const sp = spikes > 0 ? spikes * wobble * 2.2 * Math.pow(Math.max(0, Math.sin(th * 31 + f * 0.07 + seed * 2)), 8) * (Math.sin(th * 5 + seed) > 0 ? 1 : -1) : 0;
  return R + w + sp;
};

export const Alfven: React.FC<{
  f: number;
  cx: number;
  cy: number;
  R: number;
  a0?: number;
  a1?: number;
  wobble?: number;
  spikes?: number;
  draw?: number;
  cross?: { angle: number; age: number };
  color?: string;
  fillInside?: boolean;
  seed?: number;
}> = ({ f, cx, cy, R, a0 = -170, a1 = -10, wobble = 40, spikes = 0, draw = 1, cross, color = C.gold, fillInside = false, seed = 1 }) => {
  const n = 120;
  const end = a0 + (a1 - a0) * cl01(draw);
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((end - a0) * i) / n;
    const th = a * D2R;
    const r = boundaryR(th, f, R, wobble, spikes, seed);
    pts.push([cx + Math.cos(th) * r, cy + Math.sin(th) * r]);
  }
  const d = smoothPath(pts, 0.5);
  const head = pts[pts.length - 1];
  const flash = cross && cross.age >= 0 && cross.age < 30 ? cross : null;
  return (
    <g>
      {fillInside && draw >= 1 ? <path d={`${d} L${cx} ${cy} Z`} fill={alpha(C.magenta, 0.12)} /> : null}
      <path d={d} fill="none" stroke={color} strokeWidth={22} opacity={0.18} strokeLinecap="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={6} strokeDasharray="2 16" strokeDashoffset={-f * 2} strokeLinecap="round" />
      {draw > 0 && draw < 1 ? <circle cx={head[0]} cy={head[1]} r={10} fill={C.saffronCore} stroke={C.saffron} strokeWidth={3} /> : null}
      {flash
        ? (() => {
            const th = flash.angle * D2R;
            const r = boundaryR(th, f, R, wobble, spikes, seed);
            const px = cx + Math.cos(th) * r;
            const py = cy + Math.sin(th) * r;
            const u = flash.age / 30;
            return (
              <g>
                <Bloom x={px} y={py} r={60 + u * 220} color={C.whiteGold} strength={1 - u} />
                <circle cx={px} cy={py} r={20 + u * 260} fill="none" stroke={C.whiteGold} strokeWidth={8 * (1 - u) + 1} opacity={1 - u} />
              </g>
            );
          })()
        : null}
    </g>
  );
};

/** The boundary as a near-vertical wavy line at x (ruler shots); crest motion ≈ 7 px/f at wobble 40. */
export const AlfvenFlat: React.FC<{ f: number; x: number; y?: number; h?: number; wobble?: number; spikes?: number; draw?: number; color?: string; seed?: number }> = ({
  f,
  x,
  y = 0,
  h = 1080,
  wobble = 40,
  spikes = 0,
  draw = 1,
  color = C.gold,
  seed = 1,
}) => {
  const n = 60;
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const u = (i / n) * cl01(draw);
    const th = u * 3.2;
    const dx = boundaryR(th, f, 0, wobble, spikes, seed);
    pts.push([x + dx, y + u * h]);
  }
  const d = smoothPath(pts, 0.5);
  return (
    <g>
      <path d={d} fill="none" stroke={color} strokeWidth={24} opacity={0.18} strokeLinecap="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={6} strokeDasharray="2 16" strokeDashoffset={-f * 2} strokeLinecap="round" />
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// SunCutaway (true layer proportions)
// ---------------------------------------------------------------------------------------------------------------
export type SunLayer = "core" | "radiative" | "convective" | "photosphere";

export const SunCutaway: React.FC<{
  f: number;
  cx: number;
  cy: number;
  r: number;
  variant?: "full" | "quarter";
  /** the quarter wedge: start angle (deg, screen) of the 90° cut; default -90 (the upper-right quarter) */
  wedge?: number;
  highlight?: SunLayer | null;
  radius?: { angle: number; draw: number; color?: string };
  /** texture spin, °/f */
  rotate?: number;
  /** small layer labels (words, no numerals) */
  labels?: boolean;
  labelColor?: string;
  seed?: number;
}> = ({ f, cx, cy, r, variant = "full", wedge = -90, highlight = null, radius, rotate = 4, labels = false, labelColor = "#FFF8EC", seed = 1 }) => {
  const id = "cut" + sid(useId());
  const rc = r * SUN_R.core;
  const rr = r * SUN_R.radiative;
  const pulse = 0.5 + 0.5 * Math.sin(f / 5);
  const hl = (l: SunLayer) => (highlight === l ? 1 : highlight ? 0.55 : 1);
  const ring = (l: SunLayer, r0: number, r1: number) =>
    highlight === l ? <circle cx={cx} cy={cy} r={(r0 + r1) / 2} fill="none" stroke={C.whiteGold} strokeWidth={r1 - r0} opacity={0.18 + 0.14 * pulse} /> : null;
  const wedgePath = (a: number) => {
    const p = (aa: number): string => `${(cx + Math.cos(aa * D2R) * (r + 2)).toFixed(1)} ${(cy + Math.sin(aa * D2R) * (r + 2)).toFixed(1)}`;
    return `M${cx} ${cy} L${p(a)} A${r + 2} ${r + 2} 0 0 1 ${p(a + 90)} Z`;
  };
  const rot = f * rotate;
  // convection: small rolling cells around the 0.7-1.0 band (counter-rotating pairs)
  const nConv = Math.max(10, Math.min(28, Math.round((2 * Math.PI * ((rr + r) / 2)) / ((r - rr) * 1.1))));
  const conv = Array.from({ length: nConv }, (_, i) => {
    const a = (i / nConv) * 360 + rot * 0.25;
    const rm = (rr + r) / 2;
    const ccx = cx + Math.cos(a * D2R) * rm;
    const ccy = cy + Math.sin(a * D2R) * rm;
    const cr = (r - rr) * 0.36;
    const spin = (i % 2 ? 1 : -1) * rot * 2;
    return (
      <g key={"cv" + i} transform={`rotate(${spin.toFixed(1)} ${ccx.toFixed(1)} ${ccy.toFixed(1)})`}>
        <circle cx={ccx} cy={ccy} r={cr} fill={i % 2 ? alpha(C.magenta, 0.45) : alpha(C.tangerine, 0.4)} />
        <path d={`M${(ccx + cr * 0.75).toFixed(1)} ${ccy.toFixed(1)} A${cr * 0.75} ${cr * 0.75} 0 1 1 ${ccx.toFixed(1)} ${(ccy - cr * 0.75).toFixed(1)}`} fill="none" stroke={C.whiteGold} strokeWidth={Math.max(2, r * 0.012)} strokeLinecap="round" opacity={0.85} />
      </g>
    );
  });
  // radiative: a faint zigzag ray crawling outward (rotating with the texture)
  const zig = photonPath(0, 0, rr * 0.96, 0, Math.max(10, r * 0.05), seed).map(([x, y]) => [x, y * 0.6] as Pt);
  const body = (
    <g>
      {/* convective zone 0.7-1.0 */}
      <circle cx={cx} cy={cy} r={r} fill={C.tangerine} opacity={hl("convective")} />
      <g opacity={hl("convective")}>{conv}</g>
      {ring("convective", rr, r)}
      {/* radiative zone 0.2-0.7 */}
      <circle cx={cx} cy={cy} r={rr} fill={C.honey} opacity={hl("radiative")} />
      <circle cx={cx} cy={cy} r={rr} fill="none" stroke={"#4A1D78"} strokeWidth={Math.max(2, r * 0.01)} opacity={0.5} />
      {Array.from({ length: 3 }, (_, k) => (
        <path
          key={"z" + k}
          d={"M" + zig.filter(([x]) => x > rc * 1.05 || k > 9).map(([x, y]) => `${(cx + x).toFixed(1)} ${(cy + y).toFixed(1)}`).join(" L")}
          transform={`rotate(${(rot * 0.6 + k * 120).toFixed(1)} ${cx} ${cy})`}
          fill="none"
          stroke="#6A2BB0"
          strokeWidth={Math.max(1.5, r * 0.008)}
          opacity={0.55 * hl("radiative")}
        />
      ))}
      {ring("radiative", rc, rr)}
      {/* core 0-0.2 */}
      <circle cx={cx} cy={cy} r={rc * (1.35 + 0.08 * pulse)} fill={alpha(C.whiteGold, 0.35)} />
      <circle cx={cx} cy={cy} r={rc} fill={C.whiteGold} opacity={hl("core")} />
      <circle cx={cx} cy={cy} r={rc * 0.55} fill="#FFFFFF" opacity={0.6 + 0.3 * pulse} />
      {ring("core", 0, rc)}
      {/* photosphere rim */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.gold} strokeWidth={Math.max(3, r * 0.02)} opacity={highlight === "photosphere" ? 0.7 + 0.3 * pulse : 0.85} />
      {highlight === "photosphere" ? <circle cx={cx} cy={cy} r={r + r * 0.03} fill="none" stroke={C.whiteGold} strokeWidth={r * 0.03} opacity={0.3 + 0.3 * pulse} /> : null}
    </g>
  );
  return (
    <g>
      <defs>
        <clipPath id={id + "w"}>
          <path d={wedgePath(wedge)} />
        </clipPath>
        <RadialStops id={id + "s"} stops={sunGradient(r)} />
      </defs>
      <Bloom x={cx} y={cy} r={r * 1.35} color={C.amber} strength={0.55} />
      {variant === "full" ? (
        body
      ) : (
        <g>
          {/* the uncut sphere (surface), then the quarter wedge showing the layers */}
          <circle cx={cx} cy={cy} r={r} fill={`url(#${id}s)`} />
          <Granules f={f} x={cx - r} y={cy - r} w={2 * r} h={2 * r} size={Math.max(18, r * 0.12)} drift={2} clip={`M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z`} colors={[alpha(C.amber, 0), C.amber, C.whiteGold]} opacity={0.45} />
          <g clipPath={`url(#${id}w)`}>{body}</g>
          <path d={wedgePath(wedge)} fill="none" stroke={mixHex(C.whiteGold, C.gold, 0.5)} strokeWidth={Math.max(2, r * 0.01)} opacity={0.8} />
        </g>
      )}
      {radius
        ? (() => {
            const a = radius.angle * D2R;
            const L = r * cl01(radius.draw);
            const ex = cx + Math.cos(a) * L;
            const ey = cy + Math.sin(a) * L;
            const col = radius.color ?? C.saffron;
            return (
              <g>
                <line x1={cx} y1={cy} x2={ex} y2={ey} stroke={C.ink} strokeWidth={10} strokeLinecap="round" opacity={0.35} />
                <line x1={cx} y1={cy} x2={ex} y2={ey} stroke={col} strokeWidth={6} strokeLinecap="round" />
                <circle cx={cx} cy={cy} r={8} fill={col} />
                {radius.draw > 0 && radius.draw < 1 ? <circle cx={ex} cy={ey} r={11} fill={C.saffronCore} stroke={col} strokeWidth={3} /> : null}
              </g>
            );
          })()
        : null}
      {labels
        ? (
            [
              ["core", 0, rc * 0.2],
              ["radiative zone", (rc + rr) / 2, 0],
              ["convection zone", (rr + r) / 2, 0],
            ] as [string, number, number][]
          ).map(([t, at, dy], i) => (
            <text key={t} x={cx - at} y={cy + dy + 8 + (i === 0 ? rc * 0.05 : 0)} textAnchor="middle" style={{ fontFamily: "'Anton', sans-serif", fontSize: Math.max(14, r * 0.055), letterSpacing: 2, fill: i === 1 ? "#3A1060" : labelColor }}>
              {t.toUpperCase()}
            </text>
          ))
        : null}
    </g>
  );
};
