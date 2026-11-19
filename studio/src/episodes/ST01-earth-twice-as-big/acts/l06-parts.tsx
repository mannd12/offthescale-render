// ST01 act l06 helpers: the mass-width chart, the sketched dot wall, clay balls, pillows, rockets and a slow push.
// Pure functions of their props (rnd() only), drawn in 1920x1080 SVG units.
import React, { useId } from "react";
import { Bloom } from "../../../lib/illustrated/light";
import { Plume } from "../../../lib/illustrated/props";
import { rnd } from "../../../lib/illustrated/motion";
import { blobPts, roundPoly } from "../../../lib/illustrated/shapes";
import { AIR, BRASS, CHALK, INK, LIME, OCEAN, ST_FONT, SUPPOSE, TERRA } from "../../../lib/suppose/palette";

type Pt = [number, number];
const uid = (s: string) => s.replace(/[^a-zA-Z0-9]/g, "");

/** A slow camera push of the whole body around (cx, cy): scale 1 -> 1 + amt over the shot. */
export const Push: React.FC<{ t: number; d: number; amt?: number; cx?: number; cy?: number; children: React.ReactNode }> = ({ t, d, amt = 0.04, cx = 960, cy = 540, children }) => {
  const s = 1 + amt * Math.min(1, Math.max(0, t / Math.max(1, d)));
  return <g transform={`translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`}>{children}</g>;
};

/** Light chart grid used by the chalk chart shots (same look as the key art). */
export const Grid: React.FC<{ color: string }> = ({ color }) => (
  <g stroke={color} strokeWidth={1.4} opacity={0.6}>
    {Array.from({ length: 33 }, (_, i) => <path key={`v${i}`} d={`M ${i * 60} 0 V 1080`} />)}
    {Array.from({ length: 19 }, (_, i) => <path key={`h${i}`} d={`M 0 ${i * 60} H 1920`} />)}
  </g>
);

// ---------------------------------------------------------------- mass -> width chart
export const CH = { x0: 300, x1: 1560, y0: 900, y1: 240, mMax: 12, rMin: 0.6, rMax: 2.2 };
export const cx = (m: number) => CH.x0 + (m / CH.mMax) * (CH.x1 - CH.x0);
export const cy = (r: number) => CH.y0 - ((r - CH.rMin) / (CH.rMax - CH.rMin)) * (CH.y0 - CH.y1);
/** the rocky curve (storyboard-prep §2): R = M^(1/3.7) */
export const rocky = (m: number) => Math.pow(m, 1 / 3.7);
/** make-believe (same density): R = M^(1/3) */
export const mb = (m: number) => Math.pow(m, 1 / 3);
const M0 = 0.32;
const curve = (fn: (m: number) => number, a: number, b: number, n = 80) => {
  if (b <= a) return "";
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const m = a + ((b - a) * i) / n;
    pts.push(`${cx(m).toFixed(1)} ${cy(fn(m)).toFixed(1)}`);
  }
  return "M " + pts.join(" L ");
};

export const MassChart: React.FC<{
  f: number;
  /** 0..1: how much of the rocky curve (M0 -> 8) is drawn */
  draw: number;
  /** 0..1 opacity of the dashed make-believe curve */
  mbOn?: number;
  /** 0..1 the hatched BEYOND THE FIT zone */
  beyond?: number;
  /** 0..1 how far the dashed extension past 8 is drawn (8 -> 12) */
  ext?: number;
  labels?: number;
}> = ({ f, draw, mbOn = 0, beyond = 0, ext = 0, labels = 1 }) => {
  const fam = SUPPOSE.chalk;
  const id = "hatch" + uid(useId());
  const mEnd = M0 + (8 - M0) * draw;
  const head: Pt = [cx(mEnd), cy(rocky(mEnd))];
  const bx = cx(8);
  return (
    <g>
      <defs>
        <pattern id={id} width={26} height={26} patternUnits="userSpaceOnUse" patternTransform={`rotate(45) translate(${(f * 0.6) % 26} 0)`}>
          <rect width={26} height={26} fill={fam.dim} opacity={0.06} />
          <path d="M 0 0 V 26" stroke={fam.dim} strokeWidth={6} opacity={0.35} />
        </pattern>
      </defs>
      {/* beyond the fit */}
      {beyond > 0 ? (
        <g opacity={beyond}>
          <rect x={bx} y={CH.y1 - 20} width={(CH.x1 - bx) * beyond + 1} height={CH.y0 - CH.y1 + 20} fill={`url(#${id})`} />
          <path d={`M ${bx} ${CH.y1 - 20} V ${CH.y0}`} stroke={fam.dim} strokeWidth={3} strokeDasharray="10 10" />
          <rect x={(bx + CH.x1) / 2 - 175} y={CH.y1 - 14} width={350} height={60} rx={30} fill={CHALK} opacity={0.92} />
          <text x={(bx + CH.x1) / 2} y={CH.y1 + 28} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={34} letterSpacing={2} fill={INK}>BEYOND THE FIT</text>
        </g>
      ) : null}
      {/* axes */}
      <path d={`M ${CH.x0} ${CH.y1 - 30} V ${CH.y0} H ${CH.x1 + 30}`} stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {[1, 2, 4, 8].map((m) => (
        <g key={m}>
          <path d={`M ${cx(m)} ${CH.y0} v 14`} stroke={INK} strokeWidth={3} />
          <text x={cx(m)} y={CH.y0 + 48} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={30} fill={INK}>{m}</text>
        </g>
      ))}
      {[1, 1.5, 2].map((r) => (
        <g key={r}>
          <path d={`M ${CH.x0} ${cy(r)} h -14`} stroke={INK} strokeWidth={3} />
          <path d={`M ${CH.x0} ${cy(r)} H ${CH.x1}`} stroke={INK} strokeWidth={1.5} opacity={0.12} />
          <text x={CH.x0 - 26} y={cy(r) + 10} textAnchor="end" fontFamily={ST_FONT} fontWeight={900} fontSize={30} fill={INK}>{r}</text>
        </g>
      ))}
      <text x={(CH.x0 + CH.x1) / 2} y={CH.y0 + 98} textAnchor="middle" fontFamily={ST_FONT} fontWeight={800} fontSize={26} letterSpacing={2} fill={fam.dim}>MASS, IN EARTHS</text>
      <text x={0} y={0} transform={`translate(${CH.x0 - 110} ${(CH.y0 + CH.y1) / 2}) rotate(-90)`} textAnchor="middle" fontFamily={ST_FONT} fontWeight={800} fontSize={26} letterSpacing={2} fill={fam.dim}>WIDTH, IN EARTHS</text>
      {/* make-believe curve */}
      {mbOn > 0 ? (
        <g opacity={mbOn}>
          <path d={curve(mb, M0, 8)} stroke={fam.dim} strokeWidth={5} strokeDasharray="14 12" fill="none" strokeLinecap="round" />
          <text x={cx(8) - 24} y={cy(2) - 26} textAnchor="end" fontFamily={ST_FONT} fontWeight={900} fontSize={28} fill={fam.dim}>MAKE-BELIEVE</text>
        </g>
      ) : null}
      {/* dashed extension past the fit */}
      {ext > 0 ? <path d={curve(rocky, 8, 8 + 4 * ext, 30)} stroke={TERRA} strokeWidth={6} strokeDasharray="4 14" fill="none" strokeLinecap="round" opacity={0.8} /> : null}
      {/* the rocky curve */}
      {draw > 0 ? (
        <g>
          <path d={curve(rocky, M0, mEnd)} stroke={TERRA} strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.25} />
          <path d={curve(rocky, M0, mEnd)} stroke={TERRA} strokeWidth={7} fill="none" strokeLinecap="round" />
          {draw < 1 ? (
            <g>
              <Bloom x={head[0]} y={head[1]} r={46} color={TERRA} strength={0.7} />
              <circle cx={head[0]} cy={head[1]} r={11} fill={TERRA} />
              <circle cx={head[0] - 3} cy={head[1] - 3} r={4} fill={CHALK} opacity={0.8} />
            </g>
          ) : null}
        </g>
      ) : null}
      {labels > 0 && draw > 0.6 ? (
        <text x={cx(3)} y={cy(rocky(3)) + 74} fontFamily={ST_FONT} fontWeight={900} fontSize={30} fill={TERRA} opacity={labels * Math.min(1, (draw - 0.6) * 4)}>ROCK AND IRON, LIKE EARTH</text>
      ) : null}
      {/* Earth itself: 1 mass, 1 width */}
      <circle cx={cx(1)} cy={cy(1)} r={9} fill={OCEAN} stroke={CHALK} strokeWidth={3} />
    </g>
  );
};

/** The lime signal dot on the chart with dashed guides to both axes and a ring pulse. */
export const ChartDot: React.FC<{ m: number; r: number; f: number; guides?: number }> = ({ m, r, f, guides = 1 }) => {
  const x = cx(m), y = cy(r);
  const ring = (f % 30) / 30;
  return (
    <g>
      {guides > 0 ? (
        <g opacity={guides}>
          <path d={`M ${x} ${y} V ${CH.y0}`} stroke={INK} strokeWidth={3} strokeDasharray="8 10" opacity={0.55} />
          <path d={`M ${x} ${y} H ${CH.x0}`} stroke={INK} strokeWidth={3} strokeDasharray="8 10" opacity={0.55} />
        </g>
      ) : null}
      <circle cx={x} cy={y} r={18 + ring * 34} fill="none" stroke={LIME} strokeWidth={4} opacity={(1 - ring) * 0.9} />
      <Bloom x={x} y={y} r={60} color={LIME} strength={0.6} />
      <circle cx={x} cy={y} r={17} fill={LIME} stroke={INK} strokeWidth={3} />
    </g>
  );
};

// ---------------------------------------------------------------- the sketched dot wall (= STKeyGap's data)
export const WALL_AXIS = 880;
export const wx = (w: number) => 200 + ((w - 0.5) / 3.5) * 1260;
export type WallDot = { k: number; x: number; y: number; j: number; w: number; fill: string };
export const WALL: WallDot[] = (() => {
  const out: WallDot[] = [];
  let k = 0;
  for (let w = 0.55; w < 4; w += 0.1) {
    const n = Math.round(30 * Math.exp(-(((w - 1.3) / 0.28) ** 2)) + 27 * Math.exp(-(((w - 2.4) / 0.5) ** 2)) + 2 * Math.exp(-(((w - 3.4) / 0.6) ** 2)));
    for (let j = 0; j < n; j++) {
      k++;
      out.push({ k, x: wx(w) + (rnd(k) - 0.5) * 6, y: WALL_AXIS - 16 - j * 15.5, j, w, fill: w < 1.75 ? TERRA : OCEAN });
    }
  }
  return out;
})();
export const GAP_X0 = wx(1.5), GAP_X1 = wx(2.0), GAP_CX = (GAP_X0 + GAP_X1) / 2;

export const WallFrame: React.FC<{ title?: number }> = ({ title = 1 }) => {
  const fam = SUPPOSE.chalk;
  return (
    <g>
      <Grid color={fam.far} />
      <g opacity={title}>
        <text x={200} y={110} fontFamily={ST_FONT} fontWeight={900} fontSize={44} fill={INK}>Small planets close to their stars</text>
        <text x={200} y={156} fontFamily={ST_FONT} fontWeight={800} fontSize={26} fill={fam.dim}>sketched from the pattern in 2,025 Kepler planets (Fulton et al. 2017), sorted by width</text>
      </g>
      <path d={`M 180 ${WALL_AXIS} H 1500`} stroke={INK} strokeWidth={4} strokeLinecap="round" />
      {[1, 1.5, 2, 3, 4].map((w) => (
        <g key={w}>
          <path d={`M ${wx(w)} ${WALL_AXIS} v 14`} stroke={INK} strokeWidth={3} />
          <text x={wx(w)} y={WALL_AXIS + 48} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={28} fill={INK}>{w}</text>
        </g>
      ))}
      <text x={840} y={WALL_AXIS + 92} textAnchor="middle" fontFamily={ST_FONT} fontWeight={800} fontSize={24} letterSpacing={2} fill={fam.dim}>WIDTH, IN EARTHS</text>
    </g>
  );
};

// ---------------------------------------------------------------- props
/** A grey clay ball: lit sphere (gradient), sitting on `bottom`, squashed by sx/sy. */
export const ClayBall: React.FC<{ x: number; bottom: number; r: number; sx?: number; sy?: number }> = ({ x, bottom, r, sx = 1, sy = 1 }) => {
  const id = "clay" + uid(useId());
  const rx = r * sx, ry = r * sy;
  const c = bottom - ry;
  return (
    <g>
      <defs>
        <radialGradient id={id} cx="36%" cy="30%" r="80%">
          <stop offset={0} stopColor="#E3E7DC" />
          <stop offset={0.55} stopColor="#AEB5A8" />
          <stop offset={1} stopColor="#6F786C" />
        </radialGradient>
      </defs>
      <ellipse cx={x} cy={bottom + 4} rx={rx * 1.05} ry={14} fill="#000" opacity={0.18} />
      <ellipse cx={x} cy={c} rx={rx} ry={ry} fill={`url(#${id})`} />
      <ellipse cx={x - rx * 0.35} cy={c - ry * 0.4} rx={rx * 0.2} ry={ry * 0.13} fill={CHALK} opacity={0.5} />
      {/* thumb dents */}
      <path d={`M ${x + rx * 0.1} ${c + ry * 0.2} q ${rx * 0.12} ${ry * 0.06} ${rx * 0.22} 0`} stroke="#6F786C" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.5} />
    </g>
  );
};

/** A puffy pillow sitting on `bottom` (width w, height h). */
export const Pillow: React.FC<{ x: number; bottom: number; w: number; h: number; fill: string; seam: string }> = ({ x, bottom, w, h, fill, seam }) => {
  const x0 = x - w / 2, x1 = x + w / 2, yt = bottom - h, yb = bottom, ym = (yt + yb) / 2;
  const b = Math.min(18, h * 0.22);
  const d = `M ${x0 + 14} ${yt + 6} Q ${x} ${yt - b} ${x1 - 14} ${yt + 6} Q ${x1 + 16} ${ym} ${x1 - 14} ${yb - 6} Q ${x} ${yb + b * 0.6} ${x0 + 14} ${yb - 6} Q ${x0 - 16} ${ym} ${x0 + 14} ${yt + 6} Z`;
  return (
    <g>
      <path d={d} fill={fill} stroke={INK} strokeWidth={3} strokeOpacity={0.35} />
      <path d={`M ${x0 + 30} ${yt + h * 0.32} Q ${x - w * 0.15} ${yt + 2} ${x + w * 0.1} ${yt + h * 0.18}`} stroke={CHALK} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.55} />
      <path d={`M ${x0 + 26} ${ym} Q ${x} ${ym + h * 0.08} ${x1 - 26} ${ym}`} stroke={seam} strokeWidth={3} fill="none" strokeDasharray="7 7" opacity={0.6} />
      {[x0 + 12, x1 - 12].map((cxx, i) => (
        <path key={i} d={`M ${cxx} ${yt + 10} l ${i ? 10 : -10} -10 M ${cxx} ${yb - 10} l ${i ? 10 : -10} 10`} stroke={INK} strokeWidth={3} strokeLinecap="round" opacity={0.3} />
      ))}
    </g>
  );
};

/** A storybook rocket standing on (x, base): fins, chalk body with terracotta bands, porthole, nose cone. */
export const Rocket: React.FC<{ x: number; base: number; s?: number; bodyH?: number; rot?: number; fuel?: boolean; w?: number; capH?: number }> = ({
  x, base, s = 1, bodyH = 220, rot = 0, fuel = false, w = 90, capH = 110,
}) => {
  const hw = w / 2;
  const top = -bodyH;
  const capW = fuel ? hw * 0.7 : hw;
  return (
    <g transform={`translate(${x} ${base}) rotate(${rot}) scale(${s})`}>
      {/* fins */}
      <path d={roundPoly([[-hw + 4, -96], [-hw - 42, 8], [-hw + 4, -8]], 8)} fill={TERRA} />
      <path d={roundPoly([[hw - 4, -96], [hw + 42, 8], [hw - 4, -8]], 8)} fill="#9B5139" />
      {/* nozzle */}
      <path d={roundPoly([[-hw * 0.55, -4], [hw * 0.55, -4], [hw * 0.75, 22], [-hw * 0.75, 22]], 5)} fill={INK} opacity={0.85} />
      {/* body / tank */}
      <path d={roundPoly([[-hw, 0], [-hw, top], [hw, top], [hw, 0]], 16)} fill={fuel ? TERRA : CHALK} />
      <path d={roundPoly([[hw * 0.35, -4], [hw * 0.35, top + 4], [hw - 2, top + 4], [hw - 2, -4]], 12)} fill={INK} opacity={0.16} />
      <path d={`M ${-hw * 0.6} ${top + 12} V ${-12}`} stroke={CHALK} strokeWidth={6} strokeLinecap="round" opacity={fuel ? 0.35 : 0.8} />
      {fuel ? (
        <g>
          {Array.from({ length: Math.max(1, Math.floor(bodyH / 70)) }, (_, i) => (
            <path key={i} d={`M ${-hw} ${-36 - i * 70} H ${hw}`} stroke="#9B5139" strokeWidth={5} />
          ))}
        </g>
      ) : (
        <g>
          <rect x={-hw} y={-52} width={w} height={20} fill={TERRA} />
          <rect x={-hw} y={top + 30} width={w} height={14} fill={TERRA} />
          <circle cx={0} cy={top + bodyH * 0.42} r={hw * 0.42} fill={INK} />
          <circle cx={0} cy={top + bodyH * 0.42} r={hw * 0.3} fill={AIR} />
          <circle cx={-hw * 0.1} cy={top + bodyH * 0.42 - hw * 0.1} r={hw * 0.1} fill={CHALK} opacity={0.8} />
        </g>
      )}
      {/* nose / capsule */}
      <path d={`M ${-capW} ${top + 2} C ${-capW} ${top - capH * 0.6} ${-capW * 0.3} ${top - capH * 0.95} 0 ${top - capH} C ${capW * 0.3} ${top - capH * 0.95} ${capW} ${top - capH * 0.6} ${capW} ${top + 2} Z`} fill={fuel ? CHALK : TERRA} />
      <path d={`M ${capW * 0.2} ${top - capH * 0.9} C ${capW * 0.7} ${top - capH * 0.6} ${capW * 0.9} ${top - capH * 0.3} ${capW} ${top + 2} L ${capW * 0.35} ${top + 2} Z`} fill={INK} opacity={0.15} />
    </g>
  );
};

/** Exhaust: a flickering flame plus a downward Plume of smoke from (x, y). */
export const Exhaust: React.FC<{ x: number; y: number; f: number; h: number; r0?: number; flame?: number; seed?: number; grow?: number }> = ({ x, y, f, h, r0 = 26, flame = 1, seed = 3, grow = 1 }) => {
  const fl = 1 + Math.sin(f * 1.7) * 0.12 + (rnd(f * 3 + seed) - 0.5) * 0.18;
  const fh = 110 * flame * fl;
  return (
    <g>
      <g transform={`translate(${x} ${y}) scale(1 -1)`}>
        <Plume x={0} y={-20} h={h} r0={r0} fill="#FFE2BE" shade="#E8B08A" lit="#FFF6E6" light={90} seed={seed} frame={f * 6} t={grow} lean={(Math.sin(f / 20) * 0.06)} levels={7} opacity={0.95} />
      </g>
      <Bloom x={x} y={y + fh * 0.4} r={fh * 1.1} color="#FFD7A8" strength={0.8 * flame} />
      <path d={`M ${x - 26 * flame} ${y} Q ${x - 20 * flame} ${y + fh * 0.6} ${x} ${y + fh} Q ${x + 20 * flame} ${y + fh * 0.6} ${x + 26 * flame} ${y} Z`} fill={BRASS} />
      <path d={`M ${x - 14 * flame} ${y} Q ${x - 10 * flame} ${y + fh * 0.4} ${x} ${y + fh * 0.62} Q ${x + 10 * flame} ${y + fh * 0.4} ${x + 14 * flame} ${y} Z`} fill="#FFF6E6" />
    </g>
  );
};

/** A gas-wrapped planet: rock core, optional water shell, wobbling gas blanket. */
export const PuffPlanet: React.FC<{ x: number; y: number; core: number; gas: number; water?: number; f: number }> = ({ x, y, core, gas, water = 0, f }) => {
  const wob = (r: number, seed: number) => {
    const pts = blobPts(x, y, r, 14, seed, 0.035).map(([px, py], i): Pt => {
      const a = (i / 14) * Math.PI * 2;
      const k = Math.sin(f / 14 + i * 1.3 + seed) * r * 0.018;
      return [px + Math.cos(a) * k, py + Math.sin(a) * k];
    });
    return roundPoly(pts, r * 0.4);
  };
  return (
    <g>
      {gas > core ? (
        <g>
          <Bloom x={x} y={y} r={gas * 1.5} color={AIR} strength={0.8} spread={0.55} />
          <path d={wob(gas, 3)} fill={AIR} opacity={0.5} />
          <path d={wob(core + (gas - core) * 0.72, 5)} fill={AIR} opacity={0.5} />
          <path d={wob(core + (gas - core) * 0.42, 7)} fill={AIR} opacity={0.45} />
        </g>
      ) : null}
      {water > core ? <circle cx={x} cy={y} r={water} fill={OCEAN} /> : null}
      {water > core ? <circle cx={x - water * 0.25} cy={y - water * 0.28} r={water * 0.45} fill="#8ED0E2" opacity={0.35} /> : null}
      <circle cx={x} cy={y} r={core} fill={TERRA} />
      <circle cx={x + core * 0.22} cy={y + core * 0.2} r={core * 0.75} fill="#9B5139" opacity={0.45} />
      <circle cx={x - core * 0.3} cy={y - core * 0.32} r={core * 0.32} fill="#E8987A" opacity={0.7} />
    </g>
  );
};
