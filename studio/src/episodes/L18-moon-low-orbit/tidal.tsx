// L18 tidal pieces (BUILD.md §5 `tidal.tsx`; storyboard 3-08..3-14, 4-03..4-13, 5-02..5-15, 6-05..6-16, 7-05..7-07, 8-18, Z-10).
// The ball is the Moon as a diagram (warm tan, F7); arrows are pulls toward the Earth; bars are scale factors from OUR SUM
// (row 10), never a tide height (F6); the ring is the MODEL's answer (no size, no lifetime: Q5).
// USAGE (f = the shot's frame; `dir` = degrees toward the Earth, 180 = the Earth is to the LEFT)
//   <TidalBall x y r f stretch?={0..1 round → egg} near?={px arrow on the near side} far?={px on the far side} dir?=180
//              selfPull?={inward arrows, pulsing} patch?={0..1 a near-side patch lifts away} crack?={0..1 crack draws across}
//              separate?={px the halves drift apart} spin?={px/f craters slide, default 2} material?="rock"|"fluid"
//              tags?={NEAR / FAR words} />   arrow ratios the storyboard asks for: today 1.02, 3-13 1.18 (no numeral), 5-05 2.29
//   <PullArrows x y near far f dir?=180 stack?={0..1: copies of the far arrow stack end to end along the near one (5-05b)} />
//   <PullBar x y={base} h={full px height} t={0..1 grow} f readKey?={"pull760"|"pull9000"|"pull66k"|"pull92k"…: ×counter
//            rolls to READ[key].value} w?=110 color? label? />   stripes climb the bar for ever (no settle at t = 1)
//   <Fracture x y length rotate?=0 draw={0..1} separate?={px} seed? color? width? branches?=3 />   crack with a lit head
//   fractureDraw(f, start, length, pxPerFrame?=50) → the draw value for a 50 px/f head
//   <Beads x y f stretch={0..1 smear → string of beads} n?=21 length?=520 angle?=0 speed?={px/f the string travels} />
//   <DebrisRing cx cy f radius n?=90 speed?={deg/f, 1.4} spread?={0..1: a clump at `start` → a full ring} clump?={0..1 small
//              clusters form} tilt?=0.28 thickness?=26 part?="all"|"back"|"front" start?={deg} />  sandwich the Earth: back, Earth, front
import React, { useId } from "react";
import { Counter, IF2, alpha, mixHex, rnd } from "../../lib/illustrated";
import { L18_COLORS, PILL_TEXT } from "./families";
import { READ, ReadKey, assertValue } from "./data18";

const C = L18_COLORS;
const sid = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, "");
const cl = (v: number) => Math.max(0, Math.min(1, v));
const fr = (v: number) => v - Math.floor(v);
const D2R = Math.PI / 180;

/** An arrow from (x0,y0) to (x1,y1): a thick shaft with an outline and a head. */
export const Arrow18: React.FC<{ x0: number; y0: number; x1: number; y1: number; color: string; width?: number; outline?: string }> = ({ x0, y0, x1, y1, color, width = 16, outline = "#2A0E04" }) => {
  const L = Math.hypot(x1 - x0, y1 - y0);
  if (L < 2) return null;
  const ux = (x1 - x0) / L;
  const uy = (y1 - y0) / L;
  const hl = Math.min(L * 0.6, width * 2.4);
  const bx = x1 - ux * hl;
  const by = y1 - uy * hl;
  const nx = -uy;
  const ny = ux;
  const head = `M${x1} ${y1} L${bx + nx * width * 1.5} ${by + ny * width * 1.5} L${bx - nx * width * 1.5} ${by - ny * width * 1.5} Z`;
  return (
    <g>
      <line x1={x0} y1={y0} x2={bx} y2={by} stroke={outline} strokeWidth={width + 7} strokeLinecap="round" />
      <path d={head} fill={outline} stroke={outline} strokeWidth={7} strokeLinejoin="round" />
      <line x1={x0} y1={y0} x2={bx} y2={by} stroke={color} strokeWidth={width} strokeLinecap="round" />
      <path d={head} fill={color} />
    </g>
  );
};

const ballPath = (rx: number, ry: number, f: number, wob: number) => {
  const pts: string[] = [];
  for (let k = 0; k <= 48; k++) {
    const a = (k / 48) * Math.PI * 2;
    const w = 1 + wob * (Math.sin(a * 3 + f * 0.22) * 0.5 + Math.sin(a * 5 - f * 0.31) * 0.5);
    pts.push(`${(Math.cos(a) * rx * w).toFixed(1)} ${(Math.sin(a) * ry * w).toFixed(1)}`);
  }
  return "M" + pts.join(" L") + " Z";
};

export const TidalBall: React.FC<{
  x: number;
  y: number;
  r: number;
  f: number;
  stretch?: number;
  near?: number;
  far?: number;
  dir?: number;
  selfPull?: boolean;
  patch?: number;
  crack?: number;
  separate?: number;
  spin?: number;
  material?: "rock" | "fluid";
  tags?: boolean;
}> = ({ x, y, r, f, stretch = 0, near = 0, far = 0, dir = 180, selfPull = false, patch = 0, crack = 0, separate = 0, spin = 2, material = "rock", tags = false }) => {
  const id = "tb" + sid(useId());
  const s = cl(stretch);
  const rx = r * (1 + 0.38 * s);
  const ry = r * (1 - 0.16 * s);
  const shift = -r * 0.12 * s; // toward the Earth (local −x)
  const fluid = material === "fluid";
  const d = ballPath(rx, ry, f, fluid ? 0.035 : 0);
  const off = fr((f * spin) / (r * 0.9)) * r * 0.9;
  const craters = Array.from({ length: 10 }, (_, i) => ({ u: rnd(i * 7 + 2), v: rnd(i * 13 + 4) - 0.5, s: 0.08 + rnd(i * 5) * 0.12 }));
  const sep = separate;
  const surface = (
    <g>
      <path d={d} fill={`url(#${id}g)`} />
      <g clipPath={`url(#${id}c)`}>
        {fluid
          ? [0, 1, 2].map((k) => {
              const rr = fr(f / 40 + k / 3) * rx * 1.2;
              return <ellipse key={k} cx={rx * 0.15} cy={0} rx={rr} ry={rr * (ry / rx)} fill="none" stroke={C.moonGlow} strokeWidth={4} opacity={0.6 * (1 - rr / (rx * 1.2))} />;
            })
          : [-1, 0, 1, 2].flatMap((t) =>
              craters.map((c, i) => {
                const cx = -rx * 1.2 + (c.u + t) * r * 0.9 + off;
                const cr = c.s * r;
                return (
                  <g key={`${t}-${i}`}>
                    <circle cx={cx} cy={c.v * ry * 1.6} r={cr} fill={C.moonCrater} opacity={0.6} />
                    <circle cx={cx - cr * 0.15} cy={c.v * ry * 1.6 - cr * 0.15} r={cr * 0.78} fill="none" stroke={C.moonGlow} strokeWidth={Math.max(1.5, r * 0.018)} opacity={0.85} />
                  </g>
                );
              }),
            )}
        {fluid ? <ellipse cx={-rx * 0.35} cy={-ry * 0.45} rx={rx * 0.3} ry={ry * 0.14} fill="#FFFFFF" opacity={0.35} /> : null}
      </g>
      <path d={d} fill="none" stroke={C.moonRim} strokeWidth={Math.max(3, r * 0.035)} />
    </g>
  );
  const halfNear = `M0 ${-r * 2} L${-r * 3} ${-r * 2} L${-r * 3} ${r * 2} L0 ${r * 2} Z`;
  const halfFar = `M0 ${-r * 2} L${r * 3} ${-r * 2} L${r * 3} ${r * 2} L0 ${r * 2} Z`;
  const crackPts = Array.from({ length: 7 }, (_, k) => [(rnd(k * 11 + 3) - 0.5) * r * 0.18, -ry * 1.05 + (k / 6) * ry * 2.1] as [number, number]);
  const crackD = "M" + crackPts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L");
  return (
    <g transform={`translate(${x} ${y}) rotate(${dir - 180})`}>
      <defs>
        <radialGradient id={id + "g"} cx="0.36" cy="0.32" r="0.8">
          <stop offset="0" stopColor={fluid ? "#FFD27A" : C.moonLit} />
          <stop offset="0.62" stopColor={C.moonMid} />
          <stop offset="1" stopColor={C.moonShade} />
        </radialGradient>
        <clipPath id={id + "c"}>
          <path d={d} />
        </clipPath>
        <clipPath id={id + "n"}>
          <path d={halfNear} />
        </clipPath>
        <clipPath id={id + "f"}>
          <path d={halfFar} />
        </clipPath>
        <clipPath id={id + "p"}>
          <path d={`M${-rx * 1.1} ${-ry * 0.32} L${-rx * 0.72} ${-ry * 0.32} L${-rx * 0.66} ${ry * 0.32} L${-rx * 1.1} ${ry * 0.32} Z`} />
        </clipPath>
      </defs>
      <ellipse cx={0} cy={0} rx={rx * 1.25} ry={ry * 1.25} fill={C.moonRim} opacity={0.14} />
      <g transform={`translate(${shift} 0)`}>
        {sep > 0 ? (
          <g>
            <g clipPath={`url(#${id}n)`} transform={`translate(${-sep} 0)`}>
              {surface}
            </g>
            <g clipPath={`url(#${id}f)`} transform={`translate(${sep * 0.4} 0)`}>
              {surface}
            </g>
          </g>
        ) : patch > 0 ? (
          <g>
            <g>{surface}</g>
            <path d={`M${-rx * 1.1} ${-ry * 0.32} L${-rx * 0.72} ${-ry * 0.32} L${-rx * 0.66} ${ry * 0.32} L${-rx * 1.1} ${ry * 0.32} Z`} fill={C.moonCrater} clipPath={`url(#${id}c)`} />
            <g clipPath={`url(#${id}p)`} transform={`translate(${(-patch * r * 0.9).toFixed(1)} ${(Math.sin(f / 6) * 3).toFixed(1)}) rotate(${(-patch * 14).toFixed(1)} ${-rx} 0)`}>
              {surface}
            </g>
          </g>
        ) : (
          surface
        )}
        {crack > 0 && sep <= 0 ? <path d={crackD} fill="none" stroke="#3A1606" strokeWidth={Math.max(4, r * 0.05)} strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - cl(crack)} /> : null}
        {crack > 0 && crack < 1 && sep <= 0
          ? (() => {
              const t = cl(crack) * 6;
              const k = Math.min(5, Math.floor(t));
              const hx = crackPts[k][0] + (crackPts[k + 1][0] - crackPts[k][0]) * (t - k);
              const hy = crackPts[k][1] + (crackPts[k + 1][1] - crackPts[k][1]) * (t - k);
              return <circle cx={hx} cy={hy} r={Math.max(8, r * 0.08)} fill={C.moonRim} />;
            })()
          : null}
        {selfPull
          ? Array.from({ length: 10 }, (_, k) => {
              const a = (k / 10) * Math.PI * 2;
              const pulse = 0.5 + 0.5 * Math.sin(f * 0.35 - k * 0.6);
              const r0 = 1.42 + 0.18 * pulse;
              return <Arrow18 key={k} x0={Math.cos(a) * rx * r0} y0={Math.sin(a) * ry * r0} x1={Math.cos(a) * rx * 1.06} y1={Math.sin(a) * ry * 1.06} color={C.model} width={Math.max(5, r * 0.06)} outline="#0B2A33" />;
            })
          : null}
        {near > 0 ? <Arrow18 x0={-rx} y0={0} x1={-rx - near} y1={0} color={C.lever} width={Math.max(8, r * 0.12)} /> : null}
        {far > 0 ? <Arrow18 x0={rx - r * 0.06} y0={0} x1={rx - r * 0.06 - far} y1={0} color={C.lever} width={Math.max(8, r * 0.12)} /> : null}
        {tags ? (
          <g style={{ fontFamily: IF2.label, fontSize: Math.max(20, r * 0.2), letterSpacing: 2 }}>
            <text x={-rx} y={-ry - r * 0.16} textAnchor="middle" fill={PILL_TEXT} stroke="#2A0E04" strokeWidth={6} paintOrder="stroke" transform={`rotate(${180 - dir} ${-rx} ${-ry - r * 0.16})`}>
              NEAR
            </text>
            <text x={rx} y={-ry - r * 0.16} textAnchor="middle" fill={PILL_TEXT} stroke="#2A0E04" strokeWidth={6} paintOrder="stroke" transform={`rotate(${180 - dir} ${rx} ${-ry - r * 0.16})`}>
              FAR
            </text>
          </g>
        ) : null}
      </g>
    </g>
  );
};

export const PullArrows: React.FC<{ x: number; y: number; near: number; far: number; f: number; dir?: number; stack?: number; width?: number }> = ({ x, y, near, far, f, dir = 180, stack = 0, width = 18 }) => {
  const n = Math.max(0, Math.floor(near / Math.max(1, far)));
  const st = cl(stack) * (n + 0.6);
  return (
    <g transform={`translate(${x} ${y}) rotate(${dir - 180})`}>
      <Arrow18 x0={0} y0={0} x1={-near} y1={0} color={C.lever} width={width} />
      <Arrow18 x0={0} y0={90} x1={-far} y1={90} color={C.amber} width={width} />
      {Array.from({ length: n }, (_, k) => {
        const t = cl(st - k);
        if (t <= 0) return null;
        const x0 = -k * far;
        const slide = (1 - t) * 90;
        const bob = Math.sin(f * 0.3 + k) * 3;
        return (
          <g key={k} opacity={t} transform={`translate(0 ${(-70 - slide * 0 + bob).toFixed(1)})`}>
            <g transform={`translate(0 ${(slide * 1.0).toFixed(1)})`}>
              <Arrow18 x0={x0} y0={0} x1={x0 - far} y1={0} color={C.amber} width={width * 0.8} />
            </g>
          </g>
        );
      })}
      {st > n ? <rect x={-near} y={-86} width={near - n * far} height={32} rx={8} fill="none" stroke={C.moonRim} strokeWidth={4} strokeDasharray="8 6" strokeDashoffset={-f * 2} /> : null}
    </g>
  );
};

export const PullBar: React.FC<{ x: number; y: number; h: number; t: number; f: number; readKey?: ReadKey; w?: number; color?: string; label?: string; textColor?: string }> = ({
  x,
  y,
  h,
  t,
  f,
  readKey,
  w = 110,
  color = C.amber,
  label,
  textColor = PILL_TEXT,
}) => {
  const id = "pb" + sid(useId());
  const e = cl(t);
  const k = 1 - Math.pow(1 - e, 3);
  const bh = Math.max(4, h * k);
  const top = y - bh;
  const target = readKey ? assertValue(READ[readKey].value ?? 0, `PullBar ${readKey}`) : 0;
  const stripeOff = fr(f / 12) * 40;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={x} y={top} width={w} height={bh} rx={10} />
        </clipPath>
      </defs>
      <rect x={x - 6} y={top - 6} width={w + 12} height={bh + 12} rx={14} fill={alpha(color, 0.2)} />
      <rect x={x} y={top} width={w} height={bh} rx={10} fill={color} />
      <g clipPath={`url(#${id})`}>
        {Array.from({ length: Math.ceil(bh / 40) + 3 }, (_, i) => {
          const yy = y + 40 - i * 40 - stripeOff;
          return <line key={i} x1={x - 20} y1={yy + 30} x2={x + w + 20} y2={yy - 30} stroke={mixHex(color, "#FFFFFF", 0.35)} strokeWidth={10} opacity={0.55} />;
        })}
      </g>
      <rect x={x} y={top} width={w} height={14} rx={7} fill={mixHex(color, "#FFFFFF", 0.45)} />
      {readKey ? (
        <g>
          <text x={x + w / 2 - 6} y={top - 26} textAnchor="end" style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 54, fill: textColor }}>
            ×
          </text>
          <Counter x={x + w / 2} y={top - 26} value={target * k} max={target} size={54} color={textColor} />
        </g>
      ) : null}
      {label ? (
        <text x={x + w / 2} y={y + 40} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 24, letterSpacing: 2, fill: textColor }}>
          {label}
        </text>
      ) : null}
    </g>
  );
};

/** The draw value for a crack head moving at `pxPerFrame` from frame `start`. */
export const fractureDraw = (f: number, start: number, length: number, pxPerFrame = 50) => cl(((f - start) * pxPerFrame) / Math.max(1, length));

export const Fracture: React.FC<{ x: number; y: number; length: number; rotate?: number; draw: number; separate?: number; seed?: number; color?: string; width?: number; branches?: number }> = ({
  x,
  y,
  length,
  rotate = 0,
  draw,
  separate = 0,
  seed = 1,
  color = "#3A1606",
  width = 7,
  branches = 3,
}) => {
  const N = 10;
  const pts: [number, number][] = Array.from({ length: N + 1 }, (_, k) => [(k / N) * length, k === 0 ? 0 : (rnd(seed * 17 + k) - 0.5) * length * 0.09]);
  const D = cl(draw);
  const upto = D * N;
  const kk = Math.min(N - 1, Math.floor(upto));
  const t = upto - kk;
  const shown = pts.slice(0, kk + 1);
  const head: [number, number] = [pts[kk][0] + (pts[kk + 1][0] - pts[kk][0]) * t, pts[kk][1] + (pts[kk + 1][1] - pts[kk][1]) * t];
  const line = (o: number) => "M" + [...shown, head].map((p) => `${p[0].toFixed(1)} ${(p[1] + o).toFixed(1)}`).join(" L");
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      {separate > 0 ? (
        <g>
          <path d={line(-separate / 2)} fill="none" stroke={color} strokeWidth={width} strokeLinejoin="round" />
          <path d={line(separate / 2)} fill="none" stroke={color} strokeWidth={width} strokeLinejoin="round" />
          <path d={`${line(-separate / 2)} L${head[0]} ${head[1] + separate / 2} ${[...shown].reverse().map((p) => `L${p[0]} ${p[1] + separate / 2}`).join(" ")} Z`} fill="#1A0A04" opacity={0.85} />
        </g>
      ) : (
        <path d={line(0)} fill="none" stroke={color} strokeWidth={width} strokeLinejoin="round" strokeLinecap="round" />
      )}
      {Array.from({ length: branches }, (_, b) => {
        const at = Math.floor(((b + 1) / (branches + 1)) * N);
        if (at > upto) return null;
        const g = cl((upto - at) / 2);
        const [bx, by] = pts[at];
        const ang = (rnd(seed * 23 + b) > 0.5 ? 1 : -1) * (30 + rnd(seed * 29 + b) * 30);
        const bl = length * 0.18 * g;
        return <line key={b} x1={bx} y1={by} x2={bx + Math.cos(ang * D2R) * bl} y2={by + Math.sin(ang * D2R) * bl} stroke={color} strokeWidth={width * 0.6} strokeLinecap="round" />;
      })}
      {D > 0 && D < 1 ? (
        <g>
          <circle cx={head[0]} cy={head[1]} r={width * 3.4} fill={C.moonRim} opacity={0.3} />
          <circle cx={head[0]} cy={head[1]} r={width * 1.3} fill={C.moonRim} />
        </g>
      ) : null}
    </g>
  );
};

export const Beads: React.FC<{ x: number; y: number; f: number; stretch: number; n?: number; length?: number; angle?: number; speed?: number; size?: number }> = ({ x, y, f, stretch, n = 21, length = 520, angle = 0, speed = 0, size = 12 }) => {
  const s = cl(stretch);
  const travel = f * speed;
  const a = angle * D2R;
  return (
    <g transform={`translate(${x + Math.cos(a) * travel} ${y + Math.sin(a) * travel}) rotate(${angle})`}>
      {/* the smear: present at low stretch, fading as beads separate */}
      <ellipse cx={length * 0.5 * s * 0.5} cy={0} rx={size * 2 + length * 0.5 * s} ry={size * (1.6 - s)} fill={C.comet} opacity={0.5 * (1 - s) + 0.1} />
      {Array.from({ length: n }, (_, i) => {
        const u = i / (n - 1);
        const bx = u * length * s;
        const wob = Math.sin(f * 0.25 + i * 0.9) * size * 0.4 * s;
        const r = size * (0.7 + 0.5 * rnd(i * 3 + 1));
        return (
          <g key={i}>
            <circle cx={bx} cy={wob} r={r * 2.2} fill={C.starAqua} opacity={0.18 * s} />
            <circle cx={bx} cy={wob} r={r} fill={i % 2 ? C.comet : "#FFE7A0"} />
          </g>
        );
      })}
    </g>
  );
};

export const DebrisRing: React.FC<{
  cx: number;
  cy: number;
  f: number;
  radius: number;
  n?: number;
  speed?: number;
  spread?: number;
  clump?: number;
  tilt?: number;
  thickness?: number;
  part?: "all" | "back" | "front";
  start?: number;
  colors?: string[];
}> = ({ cx, cy, f, radius, n = 90, speed = 1.4, spread = 1, clump = 0, tilt = 0.28, thickness = 26, part = "all", start = 0, colors = [C.moonGlow, C.moonLit, C.moonMid, C.starApricot] }) => {
  const N = Math.min(160, n);
  const sp = cl(spread);
  const K = 7;
  return (
    <g>
      {Array.from({ length: N }, (_, i) => {
        const rr = radius + (rnd(i * 5 + 1) - 0.5) * thickness * 2;
        const w = speed * Math.pow(radius / rr, 1.5); // inner pieces lap faster: the ring spreads by itself
        let ang = start + (rnd(i * 7 + 2) - 0.5) * 360 * sp + f * w;
        if (clump > 0) {
          const home = start + (Math.floor(rnd(i * 11 + 3) * K) / K) * 360 + f * speed;
          const da = ((((ang - home) % 360) + 540) % 360) - 180;
          ang = home + da * (1 - clump * 0.85);
        }
        const a = ang * D2R;
        const py = Math.sin(a);
        if (part === "back" && py > 0) return null;
        if (part === "front" && py <= 0) return null;
        const size = 2.5 + rnd(i * 13) * 4;
        return <circle key={i} cx={cx + Math.cos(a) * rr} cy={cy + py * rr * tilt} r={size * (0.75 + 0.25 * (py + 1))} fill={colors[i % colors.length]} opacity={0.75 + 0.25 * py} />;
      })}
    </g>
  );
};
