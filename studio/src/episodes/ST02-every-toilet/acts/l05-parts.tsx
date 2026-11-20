// ST02 act l05 (the stagger): drawing parts for the MODEL diagrams (street lines feeding a main, flow curves, pumps).
// Pure functions of props. Travel times here are a model, not data: every picture that uses them carries MODEL.
import React from "react";
import { Bloom } from "../../../lib/illustrated/light";
import { rrect } from "../../../lib/illustrated/shapes";
import { CHALK, INK, LIME, OCEAN, SUPPOSE, SupposeFamily } from "../../../lib/suppose/palette";
import { Plant, polyD, polyLen, Pt, Toilet, Txt, WATER } from "./l04-parts";

/** the street-line diagram (chalk): a short line from the street corner, a long one from the far end, both into a main */
export const PD = {
  mainY: 800,
  mainX0: 110,
  mainX1: 1600,
  near: { toilet: [1250, 520] as Pt, path: [[1250, 530], [1250, 800]] as Pt[] },
  far: { toilet: [340, 300] as Pt, path: [[340, 310], [340, 470], [660, 470], [660, 620], [960, 620], [960, 800]] as Pt[] },
};
export const NEAR_LEN = polyLen(PD.near.path);
export const FAR_LEN = polyLen(PD.far.path);

export const Pipe: React.FC<{ pts: Pt[]; w: number; t: number; flow?: number; k?: number; outline?: string; wall?: string; water?: string }> = ({
  pts, w, t, flow = 1, k = 1, outline = INK, wall = CHALK, water = WATER,
}) => {
  if (k <= 0) return null;
  const L = polyLen(pts);
  const dash = `${L * k} ${L + 10}`;
  return (
    <g>
      <path d={polyD(pts)} stroke={outline} strokeWidth={w + 8} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash} />
      <path d={polyD(pts)} stroke={wall} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash} />
      {flow > 0 && k >= 1 ? (
        <path d={polyD(pts)} stroke={water} strokeWidth={w * 0.32} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="22 18" strokeDashoffset={-t * 2.4 * flow} opacity={0.9} />
      ) : null}
    </g>
  );
};

/** the whole street-line diagram; reveal 0..1 for each piece; `flash` 0..1 lights a lime dot over each toilet */
export const PipeDiagram: React.FC<{ t: number; main?: number; near?: number; far?: number; flash?: number; labels?: number; opacity?: number }> = ({
  t, main = 1, near = 1, far = 1, flash = 0, labels = 1, opacity = 1,
}) => {
  const mainPts: Pt[] = [[PD.mainX0, PD.mainY], [PD.mainX1, PD.mainY]];
  const F = SUPPOSE.chalk;
  return (
    <g opacity={opacity}>
      {/* street level ground stubs under each toilet */}
      {near > 0 ? <path d={rrect(PD.near.toilet[0] - 110, PD.near.toilet[1], 220, 14, 7)} fill={F.mid} opacity={near} /> : null}
      {far > 0 ? <path d={rrect(PD.far.toilet[0] - 110, PD.far.toilet[1], 220, 14, 7)} fill={F.mid} opacity={far} /> : null}
      <Pipe pts={PD.far.path} w={22} t={t} k={far} />
      <Pipe pts={PD.near.path} w={22} t={t} k={near} />
      <Pipe pts={mainPts} w={44} t={t} k={main} />
      {main > 0.9 ? <Plant x={PD.mainX1 + 120} y={PD.mainY + 40} s={0.85} t={t} /> : null}
      {near > 0.3 ? <g opacity={Math.min(1, near * 2)}><Toilet x={PD.near.toilet[0] - 6} y={PD.near.toilet[1]} s={0.9} /></g> : null}
      {far > 0.05 ? <g opacity={Math.min(1, far * 6)}><Toilet x={PD.far.toilet[0] - 6} y={PD.far.toilet[1]} s={0.9} /></g> : null}
      {flash > 0
        ? [PD.near.toilet, PD.far.toilet].map(([x, y], i) => (
            <g key={i}>
              <Bloom x={x} y={y - 160} r={80} color={LIME} strength={flash * 0.7} />
              <circle cx={x} cy={y - 160} r={16} fill={LIME} stroke={INK} strokeWidth={3} opacity={flash} />
            </g>
          ))
        : null}
      <g opacity={labels}>
        {near > 0.5 ? <Txt x={PD.near.toilet[0] + 90} y={PD.near.toilet[1] - 50} size={30} anchor="start" ls={2} fill={F.text}>STREET CORNER</Txt> : null}
        {far > 0.2 ? <Txt x={PD.far.toilet[0] + 90} y={PD.far.toilet[1] - 50} size={30} anchor="start" ls={2} fill={F.text}>FAR END</Txt> : null}
        {main > 0.5 ? <Txt x={PD.mainX0 + 20} y={PD.mainY + 76} size={30} anchor="start" ls={4} fill={F.dim}>MAIN</Txt> : null}
        {main > 0.9 ? <Txt x={PD.mainX1 + 120} y={PD.mainY + 96} size={22} ls={2} fill={F.dim}>TO THE PLANT</Txt> : null}
      </g>
    </g>
  );
};

/** a water packet (racing dot) */
export const Packet: React.FC<{ p: Pt; r?: number; glow?: number }> = ({ p, r = 18, glow = 0 }) => (
  <g>
    {glow > 0 ? <Bloom x={p[0]} y={p[1]} r={r * 4} color={OCEAN} strength={glow} /> : null}
    <circle cx={p[0]} cy={p[1]} r={r} fill={OCEAN} stroke={INK} strokeWidth={3.5} />
    <circle cx={p[0] - r * 0.3} cy={p[1] - r * 0.3} r={r * 0.3} fill={CHALK} opacity={0.6} />
  </g>
);

/** a bell curve with fixed area: peak height scales as 1/width (lowers the peak, same total) */
export const bell = (u: number, c: number, s: number, a0: number, s0: number) => a0 * (s0 / s) * Math.exp(-(((u - c) / s) ** 2));
export const curvePts = (x: number, y: number, w: number, h: number, fn: (u: number) => number, n = 200): Pt[] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const u = i / n;
    return [x + u * w, y + h - Math.min(1.02, fn(u)) * h] as Pt;
  });
export const ChartAxes: React.FC<{ x: number; y: number; w: number; h: number; fam: SupposeFamily; ylabel: string }> = ({ x, y, w, h, fam, ylabel }) => {
  const F = SUPPOSE[fam];
  return (
    <g>
      <path d={`M ${x} ${y} V ${y + h} H ${x + w}`} stroke={F.dim} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Txt x={x} y={y - 24} size={26} ls={3} anchor="start" fill={F.dim}>{ylabel}</Txt>
      <Txt x={x + w} y={y + h + 46} size={24} ls={3} anchor="end" fill={F.dim}>TIME →</Txt>
    </g>
  );
};

/** a tiny pump station (base at y) */
export const PumpHouse: React.FC<{ x: number; y: number; on: number; fam: SupposeFamily }> = ({ x, y, on, fam }) => {
  const F = SUPPOSE[fam];
  const c = on > 0.5 ? "#C9643F" : F.far;
  return (
    <g>
      <path d={`M ${x - 16} ${y} V ${y - 18} L ${x} ${y - 30} L ${x + 16} ${y - 18} V ${y} Z`} fill={c} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <rect x={x - 5} y={y - 14} width={10} height={14} rx={2} fill={on > 0.5 ? CHALK : F.near} opacity={0.4 + on * 0.6} />
    </g>
  );
};
