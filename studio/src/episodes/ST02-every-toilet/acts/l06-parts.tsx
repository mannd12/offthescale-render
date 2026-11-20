// ST02 acts l06/l07 helpers: text, plain cream toilets, the five-borough map, the supply bar, a pool, pipes with flowing
// blue-sage lines, stamps, cards, houses, a flip-in Counter and an 8-rung chapter beat. Pure functions of their props.
import React from "react";
import { BRASS, BRASS_DARK, CHALK, CHALK_SHADE, INK, LIME, LIME_DEEP, ST_FONT, SUPPOSE, SupposeFamily, TERRA } from "../../../lib/suppose/palette";
import { Bloom } from "../../../lib/illustrated/light";
import { rrect, smoothPath } from "../../../lib/illustrated/shapes";
import { rnd } from "../../../lib/illustrated/motion";
import { Cumulus } from "../../../lib/illustrated/props";
import { Lev } from "../../../lib/suppose/lev";
import { CounterSpec, LADDER_RUNGS, ShotStage, ease, mix, pop } from "../shot";

export type Pt = [number, number];
export const SAGE = SUPPOSE.sage;
export const CLAY = SUPPOSE.clay;
export const OLIVE = SUPPOSE.olive;
export const CH = SUPPOSE.chalk;
/** water is blue-sage lines */
export const WATER = "#7DB5B8";
export const WATER_DEEP = "#4F8E98";
export const WATER_LIT = "#C2E4DF";
export const CREAM = "#F6EED8";
export const CREAM_SHADE = "#D6C9AC";
export const TERRA_DARK = "#8A3A20";
export const TERRA_LIT = "#E8987A";
export const C88: CounterSpec = { label: "FLUSHES", value: "8.8 MILLION" };
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
/** 0→1→0 window: rises over [a, a+r], falls over [b-r, b] */
export const win = (t: number, a: number, b: number, r: number) => Math.min(ease(t, a, a + r), 1 - ease(t, b - r, b));
export const closedPath = (pts: Pt[]) => smoothPath([...pts, pts[0], pts[1]]) + " Z";

export const Txt: React.FC<{
  x: number; y: number; size?: number; fill?: string; anchor?: "start" | "middle" | "end"; weight?: number; op?: number; ls?: number;
  children: React.ReactNode;
}> = ({ x, y, size = 40, fill = INK, anchor = "start", weight = 900, op = 1, ls = 0, children }) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={ST_FONT} fontWeight={weight} fontSize={size} letterSpacing={ls} fill={fill} opacity={op}>
    {children}
  </text>
);

/** scale k about a point */
export const At: React.FC<{ x: number; y: number; k: number; children: React.ReactNode; op?: number }> = ({ x, y, k, children, op = 1 }) =>
  k <= 0.001 ? null : (
    <g transform={`translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})`} opacity={op}>
      {children}
    </g>
  );

export const Arrow: React.FC<{ x0: number; y0: number; x1: number; y1: number; color: string; w?: number; head?: number; op?: number; dash?: string }> = ({
  x0, y0, x1, y1, color, w = 10, head = 26, op = 1, dash,
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

// ------------------------------------------------------------------ a plain cream toilet (side view, no detail)
/** feet at (x,y); `tank` stretches the tank (1 = modern, ~1.8 = an old five-gallon one); `water` 0..1 shows a cutaway level. */
export const Toilet: React.FC<{ x: number; y: number; s?: number; tank?: number; line?: string; op?: number; facing?: 1 | -1; water?: number; f?: number }> = ({
  x, y, s = 1, tank = 1, line = INK, op = 1, facing = 1, water, f = 0,
}) => {
  const th = 54 * tank;
  const lw = 2.4 / s;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * facing} ${s})`} opacity={op}>
      <ellipse cx={4} cy={2} rx={44} ry={6} fill="#000" opacity={0.16} />
      {/* tank */}
      <rect x={-48} y={-60 - th} width={32} height={th} rx={6} fill={CREAM} stroke={line} strokeWidth={lw} strokeOpacity={0.55} />
      {water !== undefined ? (
        <g>
          <rect x={-44} y={-60 - th * water * 0.92} width={24} height={th * water * 0.92 - 4} rx={3} fill={WATER} opacity={0.9} />
          <path d={`M -44 ${-60 - th * water * 0.92 + Math.sin(f / 5) * 1.5} h 24`} stroke={WATER_LIT} strokeWidth={2.5 / s} />
        </g>
      ) : null}
      <rect x={-52} y={-68 - th} width={40} height={10} rx={4} fill={CREAM} stroke={line} strokeWidth={lw} strokeOpacity={0.55} />
      <rect x={-17} y={-54 - th * 0.72} width={9} height={5} rx={2.5} fill={CREAM_SHADE} />
      {/* bowl + pedestal */}
      <path d="M -22 -62 L 46 -62 Q 50 -40 30 -28 L 18 -8 L 22 0 L -16 0 L -12 -8 Q -24 -30 -22 -62 Z" fill={CREAM} stroke={line} strokeWidth={lw} strokeOpacity={0.55} strokeLinejoin="round" />
      <path d="M 30 -62 L 46 -62 Q 50 -40 30 -28 L 18 -8 L 22 0 L 10 0 L 14 -10 Q 34 -34 30 -62 Z" fill={CREAM_SHADE} opacity={0.7} />
      <rect x={-25} y={-69} width={74} height={8} rx={4} fill={CREAM} stroke={line} strokeWidth={lw} strokeOpacity={0.55} />
    </g>
  );
};

// ------------------------------------------------------------------ the five boroughs (stylised), squares = buildings
export const MAP_DX = 110, MAP_DY = 70;
const raw: Pt[][] = [
  // Manhattan
  [[700, 170], [735, 190], [730, 300], [700, 450], [670, 600], [640, 650], [622, 630], [640, 480], [665, 330], [685, 200]],
  // Bronx
  [[752, 160], [900, 120], [1050, 150], [1075, 260], [980, 320], [850, 330], [765, 300], [748, 230]],
  // Queens
  [[790, 420], [900, 360], [1040, 340], [1200, 380], [1330, 480], [1320, 640], [1220, 700], [1060, 690], [930, 640], [860, 560], [800, 500]],
  // Brooklyn
  [[660, 700], [760, 640], [860, 615], [960, 670], [1050, 720], [1070, 820], [980, 890], [840, 905], [720, 870], [655, 790]],
  // Staten Island
  [[260, 780], [380, 700], [500, 720], [560, 800], [520, 900], [420, 950], [300, 935], [240, 870]],
];
export const BOROUGHS: Pt[][] = raw.map((p) => p.map(([x, y]) => [x + MAP_DX, y + MAP_DY] as Pt));
export const BOROUGH_PATHS = BOROUGHS.map(closedPath);
const inPoly = (p: Pt, poly: Pt[]) => {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};
export const MAP_ORIGIN: Pt = [700 + MAP_DX, 420 + MAP_DY];
export type Sq = { x: number; y: number; s: number; dist: number; i: number };
export const SQUARES: Sq[] = (() => {
  const out: Sq[] = [];
  let i = 0;
  for (let gy = 100; gy < 1040; gy += 23) {
    for (let gx = 200; gx < 1500; gx += 23) {
      i++;
      const x = gx + (rnd(i * 3.1) - 0.5) * 8, y = gy + (rnd(i * 5.7) - 0.5) * 8;
      if (!BOROUGHS.some((b) => inPoly([x, y], b))) continue;
      if (rnd(i * 1.9) < 0.18) continue;
      out.push({ x, y, s: 9 + rnd(i * 2.3) * 5, dist: Math.hypot(x - MAP_ORIGIN[0], y - MAP_ORIGIN[1]), i });
    }
  }
  return out;
})();

/** The map; `flash(sq)` gives 0..1 brightness per square, `drop(sq)` 0..1 a blue-sage line under it. */
export const NycMap: React.FC<{ f: number; flash?: (q: Sq) => number; drop?: (q: Sq) => number; squareOp?: number }> = ({ f, flash, drop, squareOp = 0.85 }) => (
  <g>
    <path d={closedPath([[150, 200], [600, 130], [1150, 120], [1560, 330], [1600, 760], [1300, 1060], [700, 1080], [170, 1040], [110, 600]])} fill={WATER} opacity={0.35} />
    {[0, 1, 2].map((k) => (
      <path key={k} d={smoothPath([[200, 300 + k * 260], [500, 280 + k * 260 + Math.sin(f / 20 + k) * 8], [900, 310 + k * 260], [1400, 290 + k * 260]])} stroke={WATER_LIT} strokeWidth={3} fill="none" strokeDasharray="30 40" strokeDashoffset={-f * 0.8} opacity={0.5} />
    ))}
    {BOROUGH_PATHS.map((d, i) => (
      <g key={i}>
        <path d={d} fill={SAGE.near} opacity={0.35} transform="translate(6 8)" />
        <path d={d} fill={SAGE.mid} stroke={SAGE.near} strokeWidth={4} />
      </g>
    ))}
    {SQUARES.map((q) => {
      const k = flash ? flash(q) : 0;
      const dp = drop ? drop(q) : 0;
      return (
        <g key={q.i}>
          {dp > 0.02 ? <path d={`M ${q.x} ${q.y + q.s / 2 + 2} v ${10 * dp}`} stroke={WATER_DEEP} strokeWidth={3} strokeLinecap="round" opacity={dp} /> : null}
          <rect x={q.x - q.s / 2} y={q.y - q.s / 2} width={q.s} height={q.s} rx={2} fill={k > 0.5 ? "#FFFDF0" : CREAM} opacity={squareOp + (1 - squareOp) * k} />
          {k > 0.05 ? <rect x={q.x - q.s / 2 - 3 * k} y={q.y - q.s / 2 - 3 * k} width={q.s + 6 * k} height={q.s + 6 * k} rx={3} fill="none" stroke="#FFFDF0" strokeWidth={2} opacity={k} /> : null}
        </g>
      );
    })}
  </g>
);

// ------------------------------------------------------------------ supply bar (one day of supply) + its sliver
export const BAR = { x: 1300, w: 180, base: 920, H: 640 };
/** p = grown fraction; sliver in px (lime, at the base); glow 0..1 */
export const SupplyBar: React.FC<{ p?: number; sliver?: number; glow?: number; f: number; labels?: number; small?: boolean; ink?: string; dim?: string }> = ({ p = 1, sliver = 0, glow = 0, f, labels = 1, small, ink = SAGE.text, dim = SAGE.dim }) => {
  const { x, w, base, H } = BAR;
  const h = H * p;
  return (
    <g>
      <rect x={x + 12} y={base - h + 12} width={w} height={h} rx={14} fill={INK} opacity={0.18} />
      {h > 4 ? (
        <g>
          <path d={rrect(x, base - h, w, h, 14)} fill={WATER_DEEP} />
          <path d={rrect(x, base - h, w * 0.4, h, 14)} fill={WATER} opacity={0.55} />
          {Array.from({ length: Math.floor(h / 46) }, (_, i) => {
            const yy = base - 30 - i * 46 - ((f * 0.6) % 46);
            return yy > base - h + 10 ? <path key={i} d={`M ${x + 24} ${yy} h ${w - 48}`} stroke={WATER_LIT} strokeWidth={3} strokeLinecap="round" opacity={0.45} /> : null;
          })}
          <path d={rrect(x, base - h, w, h, 14)} fill="none" stroke={INK} strokeWidth={3} opacity={0.5} />
        </g>
      ) : null}
      {sliver > 0 ? (
        <g>
          {glow > 0 ? <Bloom x={x + w / 2} y={base - sliver / 2} r={160} color={LIME} strength={glow} squash={0.45} /> : null}
          <rect x={x} y={base - sliver} width={w} height={sliver} fill={LIME} />
          <rect x={x} y={base - sliver} width={w} height={Math.min(3, sliver)} fill="#F2FFB0" opacity={0.8} />
        </g>
      ) : null}
      <rect x={x - 60} y={base} width={w + 120} height={14} rx={7} fill={INK} opacity={0.35} />
      {labels > 0.01 ? (
        <g opacity={labels}>
          <Txt x={x - 26} y={base - H + 40} anchor="end" size={30} ls={3} fill={dim}>ONE DAY OF SUPPLY</Txt>
          {small ? null : <Txt x={x - 26} y={base - H + 88} anchor="end" size={40} fill={ink}>MORE THAN 1 BILLION GAL</Txt>}
          <path d={`M ${x - 18} ${base - H + 4} h 14`} stroke={INK} strokeWidth={3} opacity={0.5} />
        </g>
      ) : null}
    </g>
  );
};

// ------------------------------------------------------------------ an above-ground pool, cutaway, filling
export const Pool: React.FC<{ x: number; y: number; w: number; h: number; level: number; f: number }> = ({ x, y, w, h, level, f }) => {
  const wl = y + h - (h - 14) * level;
  const wave = (k: number) =>
    smoothPath(Array.from({ length: 9 }, (_, i) => [x + 10 + (i * (w - 20)) / 8, wl + Math.sin(f / 6 + i * 1.3 + k) * 4] as Pt));
  return (
    <g>
      <ellipse cx={x + w / 2} cy={y + h + 8} rx={w * 0.56} ry={16} fill="#000" opacity={0.16} />
      <path d={rrect(x, y, w, h, 18)} fill={CHALK} opacity={0.9} />
      {/* tiles */}
      {Array.from({ length: Math.floor(w / 46) }, (_, i) => <path key={`v${i}`} d={`M ${x + 46 * (i + 1)} ${y + 10} V ${y + h - 6}`} stroke={CHALK_SHADE} strokeWidth={2} />)}
      {Array.from({ length: Math.floor(h / 46) }, (_, i) => <path key={`h${i}`} d={`M ${x + 6} ${y + 46 * (i + 1)} H ${x + w - 6}`} stroke={CHALK_SHADE} strokeWidth={2} />)}
      {level > 0.01 ? (
        <g>
          <path d={`${wave(0)} L ${x + w - 10} ${y + h - 8} L ${x + 10} ${y + h - 8} Z`} fill={WATER} opacity={0.92} />
          <path d={wave(0)} stroke={WATER_LIT} strokeWidth={5} fill="none" />
          {Array.from({ length: 5 }, (_, i) => {
            const yy = wl + 30 + i * 38;
            return yy < y + h - 18 ? <path key={i} d={`M ${x + 40 + ((f * 2 + i * 70) % (w - 200))} ${yy} h ${90 + (i % 2) * 40}`} stroke={WATER_LIT} strokeWidth={3} strokeLinecap="round" opacity={0.6} /> : null;
          })}
        </g>
      ) : null}
      <path d={rrect(x, y, w, h, 18)} fill="none" stroke={INK} strokeWidth={4} opacity={0.55} />
      <rect x={x - 16} y={y - 14} width={w + 32} height={20} rx={10} fill={TERRA} />
      <rect x={x - 16} y={y - 14} width={w + 32} height={7} rx={3.5} fill={TERRA_LIT} opacity={0.7} />
      {/* ladder */}
      <path d={`M ${x + w - 70} ${y - 60} q 0 -26 22 -26 q 22 0 22 26 V ${y + 70} M ${x + w - 40} ${y - 60} q 0 -26 22 -26 q 22 0 22 26 V ${y + 70}`} stroke={CHALK_SHADE} strokeWidth={8} fill="none" strokeLinecap="round" />
    </g>
  );
};

// ------------------------------------------------------------------ pipe along a path with flowing blue-sage lines
export const Pipe: React.FC<{ d: string; r: number; f: number; speed?: number; wall?: string; inner?: string; flow?: string; flowOp?: number; dash?: string; hl?: number }> = ({
  d, r, f, speed = 3, wall = INK, inner = "#2A3420", flow = WATER, flowOp = 0.95, dash, hl = 0,
}) => (
  <g>
    {hl > 0.01 ? <path d={d} stroke={CHALK} strokeWidth={2 * r + 26} fill="none" strokeLinecap="round" opacity={0.22 * hl} /> : null}
    <path d={d} stroke={wall} strokeWidth={2 * r + 8} fill="none" strokeLinecap="round" />
    <path d={d} stroke={inner} strokeWidth={2 * r} fill="none" strokeLinecap="round" />
    <path d={d} stroke={flow} strokeWidth={Math.max(2.5, r * 0.32)} fill="none" strokeLinecap="round" strokeDasharray={dash ?? `${r * 1.6 + 10} ${r * 1.1 + 10}`} strokeDashoffset={-f * speed} opacity={flowOp} />
    {r > 14 ? <path d={d} stroke={flow} strokeWidth={Math.max(2, r * 0.16)} fill="none" strokeLinecap="round" strokeDasharray={`${r + 8} ${r * 2 + 16}`} strokeDashoffset={-f * speed * 1.3 + r} opacity={flowOp * 0.6} transform={`translate(0 ${r * 0.45})`} /> : null}
  </g>
);

// ------------------------------------------------------------------ stamp slam (a = frames since the slam)
export const Stamp: React.FC<{ x: number; y: number; text: string; a: number; rot?: number; color?: string; size?: number; scale?: number }> = ({
  x, y, text, a, rot = -8, color = TERRA, size = 50, scale = 1,
}) => {
  if (a < 0) return null;
  const s = mix(2.6, 1, ease(a, 0, 8)) * scale;
  const w = text.length * size * 0.66 + 80, h = size * 2.3;
  return (
    <g>
      {[0, 1, 2].map((i) => {
        const e = a - 8 - i * 9;
        if (e < 0 || e > 36) return null;
        return <rect key={i} x={x - w / 2 - e * 4} y={y - h / 2 - e * 3} width={w + e * 8} height={h + e * 6} rx={24 + e * 2} fill="none" stroke={color} strokeWidth={5} opacity={1 - e / 36} transform={`rotate(${rot} ${x} ${y})`} />;
      })}
      <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={a < 8 ? 0.6 + 0.4 * (a / 8) : 1}>
        <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={20} fill={CHALK} opacity={0.92} />
        <rect x={-w / 2 + 12} y={-h / 2 + 12} width={w - 24} height={h - 24} rx={14} fill="none" stroke={color} strokeWidth={8} />
        <Txt x={0} y={size * 0.36} anchor="middle" size={size} fill={color} ls={3}>{text}</Txt>
      </g>
    </g>
  );
};

// ------------------------------------------------------------------ small terracotta-roof house
export const House: React.FC<{ x: number; y: number; s?: number; seed?: number; lit?: number }> = ({ x, y, s = 1, seed = 1, lit = 0 }) => {
  const w = 70 + rnd(seed) * 30, h = 50 + rnd(seed * 3) * 25;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-w / 2} y={-h} width={w} height={h} fill={CHALK} stroke={INK} strokeWidth={2} strokeOpacity={0.4} />
      <rect x={w / 2 - 18} y={-h} width={18} height={h} fill={CHALK_SHADE} opacity={0.6} />
      <path d={`M ${-w / 2 - 10} ${-h} L 0 ${-h - 38} L ${w / 2 + 10} ${-h} Z`} fill={rnd(seed * 7) > 0.5 ? TERRA : TERRA_DARK} />
      <rect x={-w / 4 - 9} y={-h + 14} width={18} height={16} rx={2} fill={lit > 0 ? "#FFE7A8" : SAGE.dim} opacity={0.55 + 0.45 * lit} />
      <rect x={w / 4 - 9} y={-h + 14} width={18} height={16} rx={2} fill={lit > 0 ? "#FFE7A8" : SAGE.dim} opacity={0.55 + 0.45 * lit} />
    </g>
  );
};

// ------------------------------------------------------------------ a label card (one big figure + a small line)
export const Card: React.FC<{ x: number; y: number; big: string; small?: string; k: number; w?: number; dark?: boolean; size?: number; swatch?: string }> = ({
  x, y, big, small, k, w, dark = true, size = 70, swatch,
}) => {
  if (k <= 0.01) return null;
  const cw = w ?? Math.max(big.length * size * 0.68 + (swatch ? 24 : 0), (small ?? "").length * 15) + 70;
  const h = size + (small ? 70 : 40);
  return (
    <g transform={`translate(${x + mix(-40, 0, k)} ${y})`} opacity={k}>
      <rect x={0} y={0} width={cw} height={h} rx={22} fill={dark ? INK : CHALK} opacity={0.82} />
      <rect x={0} y={0} width={cw} height={h} rx={22} fill="none" stroke={dark ? CHALK : INK} strokeOpacity={0.3} strokeWidth={2} />
      {swatch ? <rect x={26} y={size * 0.2 + 12} width={14} height={size * 0.8} rx={7} fill={swatch} /> : null}
      <Txt x={swatch ? 58 : 34} y={size + 14} size={size} fill={dark ? CHALK : INK}>{big}</Txt>
      {small ? <Txt x={swatch ? 58 : 34} y={size + 50} size={21} ls={2} fill={dark ? CHALK : INK} op={0.8}>{small}</Txt> : null}
    </g>
  );
};

// ------------------------------------------------------------------ Counter that rolls in (same geometry as devices' Counter)
export const FlipCounter: React.FC<{ k: number; f: number; spec?: CounterSpec }> = ({ k, f, spec = C88 }) => {
  const x = 1860, y = 60, size = 92;
  const w = Math.max(spec.value.length * size * 0.58, spec.label.length * 15) + 56;
  const h = size + 62;
  const box = pop(k * 12, 0, 4);
  const land = ease(k, 0.45, 1);
  return (
    <g transform={`translate(${x - w / 2} ${y + h / 2}) scale(${Math.min(1, box)}) translate(${-(x - w / 2)} ${-(y + h / 2)})`}>
      <defs>
        <clipPath id="l06flip"><rect x={x - w} y={y + 44} width={w} height={size + 8} /></clipPath>
      </defs>
      <rect x={x - w} y={y} width={w} height={h} rx={22} fill={INK} opacity={0.62} />
      <rect x={x - w} y={y} width={w} height={h} rx={22} fill="none" stroke={LIME} strokeOpacity={0.35} strokeWidth={2} />
      <text x={x - 28} y={y + 38} textAnchor="end" fontFamily={ST_FONT} fontWeight={800} fontSize={22} letterSpacing={3} fill={CHALK} opacity={0.8}>{spec.label}</text>
      <g clipPath="url(#l06flip)">
        {Array.from({ length: 7 }, (_, i) => {
          const yy = y + 44 + (((f * 26 + i * 40) % 280) - 40);
          return <rect key={i} x={x - w + 40 + (i % 3) * 30} y={yy} width={w - 120 - (i % 2) * 80} height={14} rx={7} fill={LIME} opacity={0.5 * (1 - land)} />;
        })}
        <text x={x - 24} y={y + 38 + size * 0.92 + (1 - land) * 110} textAnchor="end" fontFamily={ST_FONT} fontWeight={900} fontSize={size} fill={LIME} opacity={land}>{spec.value}</text>
      </g>
    </g>
  );
};

// ------------------------------------------------------------------ chapter beat on the 8-rung ladder
const rungY = (top: number, bottom: number, i: number, n: number) => bottom - ((bottom - top) / (n + 0.5)) * (i + 0.5);
export const BigLadder: React.FC<{ x: number; top: number; bottom: number; width?: number; lit: number; glow?: number; frame: number; light?: boolean; font?: number }> = ({
  x, top, bottom, width = 130, lit, glow = 1, frame, light = false, font = 30,
}) => {
  const rungs = LADDER_RUNGS, n = rungs.length, thick = 10;
  const xl = x - width / 2, xr = x + width / 2;
  return (
    <g>
      {light ? (
        <g stroke={INK} strokeWidth={thick + 6} strokeLinecap="round" opacity={0.28}>
          <path d={`M ${xl} ${bottom + 24} L ${xl} ${top}`} />
          <path d={`M ${xr} ${bottom + 24} L ${xr} ${top}`} />
        </g>
      ) : null}
      <path d={`M ${xl} ${bottom + 24} L ${xl} ${top}`} stroke={LIME} strokeWidth={thick} strokeLinecap="round" />
      <path d={`M ${xr} ${bottom + 24} L ${xr} ${top}`} stroke={LIME} strokeWidth={thick} strokeLinecap="round" />
      {rungs.map((r, i) => {
        const ry = rungY(top, bottom, i, n);
        const on = i <= lit, cur = i === lit;
        const lx = xl - 30;
        return (
          <g key={i}>
            {cur && glow > 0 ? <Bloom x={x} y={ry} r={width * 1.3} color={LIME} strength={glow * (0.55 + 0.15 * Math.sin(frame / 7))} /> : null}
            {light ? <path d={`M ${xl} ${ry} L ${xr} ${ry}`} stroke={INK} strokeWidth={thick + 4} strokeLinecap="round" opacity={on ? 0.25 : 0.12} /> : null}
            <path d={`M ${xl} ${ry} L ${xr} ${ry}`} stroke={on ? LIME : LIME_DEEP} strokeWidth={cur ? thick + 3 : thick - 1} strokeLinecap="round" opacity={on ? 1 : 0.45} />
            <g transform={`translate(${lx} ${ry})`}>
              {cur ? (
                <>
                  <rect x={-r.length * font * 0.66 - 26} y={-font * 0.78} width={r.length * font * 0.66 + 40} height={font * 1.5} rx={font * 0.75} fill={INK} opacity={0.82} />
                  <text x={0} y={font * 0.36} textAnchor="end" fontFamily={ST_FONT} fontWeight={900} fontSize={font * 1.05} fill={LIME}>{r}</text>
                </>
              ) : (
                <text x={0} y={font * 0.36} textAnchor="end" fontFamily={ST_FONT} fontWeight={800} fontSize={font * 0.85} fill={light ? INK : CHALK} opacity={on ? 0.95 : 0.55}>{r}</text>
              )}
            </g>
          </g>
        );
      })}
    </g>
  );
};

export const ChapterBeat: React.FC<{ t: number; d: number; f: number; fam: SupposeFamily; prev: number; next: number; eyebrow: string; title: string; counter?: CounterSpec }> = ({
  t, d, f, fam, prev, next, eyebrow, title, counter,
}) => {
  const F = SUPPOSE[fam];
  const top = 270, bottom = 1000, lx = 1420;
  const litAt = Math.min(60, d * 0.26);
  const climb = ease(t, litAt * 0.3, litAt);
  const lit = t < litAt ? prev : next;
  const glow = t < litAt ? 0.6 : 0.6 + 1.4 * Math.max(0, 1 - (t - litAt) / 20);
  const yPrev = rungY(top, bottom, prev, 8), yNext = rungY(top, bottom, next, 8);
  const levY = mix(yPrev, yNext, climb) - Math.sin(climb * Math.PI * 2) * 10;
  const tx = mix(-1100, 150, ease(t, 0, Math.min(24, d * 0.12)));
  const ul = ease(t, litAt * 0.5, litAt * 1.5);
  const cloudX = (t * 1.6) % 2400;
  const hop = t > litAt ? Math.abs(Math.sin((t - litAt) / 9)) * 8 * Math.exp(-(t - litAt) / 40) : 0;
  return (
    <ShotStage fam={fam} t={t} f={f} counter={counter}>
      <Bloom x={420} y={300} r={700} color={F.light} strength={0.55} spread={0.5} />
      {!F.dark ? (
        <>
          <Cumulus x={1700 - cloudX} y={380} w={360} h={130} fill={CHALK} shade={CHALK_SHADE} lit={F.light} seed={3} frame={f} opacity={0.8} />
          <Cumulus x={2600 - cloudX} y={260} w={260} h={96} fill={CHALK} shade={CHALK_SHADE} lit={F.light} seed={8} frame={f} opacity={0.7} />
        </>
      ) : null}
      <path d={smoothPath([[-60, 1000], [400, 980], [900, 995], [1400, 985], [1980, 1000]]) + " L 1980 1120 L -60 1120 Z"} fill={F.mid} />
      <path d={smoothPath([[-60, 1040], [600, 1028], [1300, 1040], [1980, 1032]]) + " L 1980 1120 L -60 1120 Z"} fill={F.near} />
      <BigLadder x={lx} top={top} bottom={bottom} width={130} lit={lit} glow={glow} frame={f} light={!F.dark} />
      <Lev x={lx - 8} y={levY - hop} h={150} frame={f} pose="pull" hands={{ front: [22, -178], back: [12, -168] }} eyes={t > litAt + 4 ? "happy" : "up"} tilt={-6} wind={0.5} outline={F.dark ? undefined : INK} />
      <g transform={`translate(${tx} 0)`}>
        <text x={0} y={440} fontFamily={ST_FONT} fontWeight={900} fontSize={34} letterSpacing={6} fill={F.dim}>{eyebrow}</text>
        <text x={0} y={570} fontFamily={ST_FONT} fontWeight={900} fontSize={100} fill={F.text}>{title}</text>
        <path d={`M 4 602 L ${4 + 620 * ul} 602`} stroke={TERRA} strokeWidth={12} strokeLinecap="round" opacity={ul > 0 ? 1 : 0} />
      </g>
    </ShotStage>
  );
};

// ------------------------------------------------------------------ pump impeller (spinning) in a brass housing
export const Pump: React.FC<{ x: number; y: number; f: number; s?: number; spin?: number; glow?: number }> = ({ x, y, f, s = 1, spin = 1, glow = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {glow > 0.01 ? <Bloom x={0} y={0} r={150} color={BRASS} strength={glow * 0.8} /> : null}
    <rect x={-80} y={-64} width={160} height={128} rx={20} fill={BRASS_DARK} />
    <rect x={-72} y={-56} width={144} height={40} rx={12} fill={BRASS} opacity={0.4} />
    <circle cx={0} cy={0} r={42} fill={INK} opacity={0.7} />
    <g transform={`rotate(${f * 9 * spin})`}>
      {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d="M 0 0 Q 18 -12 36 0" stroke={BRASS} strokeWidth={7} fill="none" strokeLinecap="round" transform={`rotate(${i * 60})`} />)}
    </g>
    <circle cx={0} cy={0} r={9} fill={BRASS} />
  </g>
);
