// ST02 act "l08" (The country, 8-01..8-05): shot bodies keyed by storyboard id (../shotlist.ts). Numbers on screen:
// 341.8 MILLION (Census estimate; also the Counter), 547 MILLION GAL [OUR SUM], 82 GAL, ABOUT 2 % [OUR SUM].
// Every timing is a fraction of the shot length d (voice timings are estimates).
import React from "react";
import { ShotMap, ShotStage, ease, mix, pop } from "../shot";
import { Bloom } from "../../../lib/illustrated/light";
import { rnd } from "../../../lib/illustrated/motion";
import { rrect, Pt } from "../../../lib/illustrated/shapes";
import { mixHex } from "../../../lib/illustrated/palette";
import { CHALK, INK, LIME, SUPPOSE } from "../../../lib/suppose/palette";
import { Lev } from "../../../lib/suppose/lev";
import { STPill } from "../../../lib/suppose/devices";
import {
  about, BLOBS, blobD, CREAM, fmtFlushes, PaperGrid, rollLog, Txt, US_BOX, US_PATH, USLand, WATER, WATER_DEEP, WATER_LIGHT,
} from "./l08-parts";

const SAGE = SUPPOSE.sage;
const CH = SUPPOSE.chalk;
const LAND = mixHex(SAGE.far, "#FFFFFF", 0.45);
const COUNTRY = { label: "FLUSHES", value: "341.8 MILLION" };
const xFrac = (x: number) => (x - US_BOX.x0) / (US_BOX.x1 - US_BOX.x0);

/** the blobs: k = scale per blob, glow = brightness 0..1 per blob, ring = expanding ring age 0..1 (<0 none) */
export const Blobs: React.FC<{ f: number; k: (i: number) => number; glow?: (i: number) => number; ring?: (i: number) => number; rScale?: (i: number) => number; dim?: number }> = ({
  f, k, glow, ring, rScale, dim = 0,
}) => (
  <g>
    {BLOBS.map((b, i) => {
      const s = k(i);
      if (s <= 0) return null;
      const gl = glow ? glow(i) : 0;
      const rr = b.r * (rScale ? rScale(i) : 1);
      const wob = 0.04 * Math.sin(f / 11 + b.seed);
      const rg = ring ? ring(i) : -1;
      const fill = mixHex(mixHex(WATER, WATER_LIGHT, gl), WATER_DEEP, dim);
      return (
        <g key={i} transform={about(b.x, b.y, s)}>
          <path d={blobD(b.x, b.y + 3, rr, b.seed, wob)} fill={WATER_DEEP} opacity={0.35} />
          <path d={blobD(b.x, b.y, rr, b.seed, wob)} fill={fill} stroke={WATER_DEEP} strokeWidth={2} />
          {rr > 10 && dim < 0.5 ? <path d={`M ${b.x - rr * 0.45} ${b.y - rr * 0.15} h ${rr * 0.6}`} stroke={WATER_LIGHT} strokeWidth={3} strokeLinecap="round" opacity={0.8} /> : null}
          {rg >= 0 && rg < 1 ? <circle cx={b.x} cy={b.y} r={rr + 4 + rg * 14} fill="none" stroke={WATER_LIGHT} strokeWidth={3} opacity={(1 - rg) * 0.9} /> : null}
        </g>
      );
    })}
  </g>
);

/** blue-sage water filling the country outline up to `level` (y), with a moving surface */
const PoolFill: React.FC<{ level: number; f: number; amp?: number; opacity?: number }> = ({ level, f, amp = 8, opacity = 1 }) => {
  const surf: Pt[] = Array.from({ length: 41 }, (_, i) => {
    const x = US_BOX.x0 - 20 + (i / 40) * (US_BOX.x1 - US_BOX.x0 + 40);
    return [x, level + Math.sin(i * 0.7 + f / 7) * amp + Math.sin(i * 0.23 - f / 13) * amp * 0.6];
  });
  const line = surf.map((p) => p.join(" ")).join(" L ");
  return (
    <g opacity={opacity}>
      <clipPath id="l08pool"><path d={US_PATH} /></clipPath>
      <g clipPath="url(#l08pool)">
        <path d={`M ${line} L ${US_BOX.x1 + 20} 1000 L ${US_BOX.x0 - 20} 1000 Z`} fill={WATER} />
        <path d={`M ${line}`} stroke={WATER_LIGHT} strokeWidth={6} fill="none" />
        {Array.from({ length: 14 }, (_, j) => {
          const y = level + 40 + j * 44;
          const off = ((f * (1.2 + (j % 3) * 0.4) + j * 90) % 300) - 150;
          return (
            <g key={j} opacity={0.55}>
              {[0, 1, 2, 3, 4].map((q) => <path key={q} d={`M ${US_BOX.x0 + q * 270 + off + (j % 2) * 120} ${y} h ${90 + rnd(j * 7 + q) * 60}`} stroke={WATER_LIGHT} strokeWidth={4} strokeLinecap="round" />)}
            </g>
          );
        })}
      </g>
    </g>
  );
};

export const SHOTS_L08: ShotMap = {
  // US map; the local water blobs pop in west → east while the Counter rolls up to 341.8 MILLION; then a flush sweep
  "8-01": ({ t, d, f }) => {
    const grow = (i: number) => {
      const b = BLOBS[i];
      const at = d * (0.04 + 0.46 * xFrac(b.x) + rnd(b.seed) * 0.05);
      return pop(t, at, 12);
    };
    const roll = ease(t, d * 0.04, d * 0.55);
    const sweep = (t - d * 0.62) / (d * 0.22);
    const swAt = (i: number) => sweep - xFrac(BLOBS[i].x);
    const glow = (i: number) => {
      const q = swAt(i);
      return q > 0 && q < 0.25 ? Math.sin((q / 0.25) * Math.PI) : 0.12 * Math.max(0, Math.sin(f / 9 + BLOBS[i].seed));
    };
    const ring = (i: number) => (swAt(i) > 0 ? swAt(i) / 0.3 : -1);
    return (
      <ShotStage fam="sage" t={t} f={f} ladder={7} counter={{ label: "FLUSHES", value: fmtFlushes(rollLog(8.8e6, 341.8e6, roll)) }}>
        <g transform={about(760, 600, mix(0.96, 1, ease(t, 0, d * 0.5)))}>
          <USLand fill={LAND} />
          <Blobs f={f} k={grow} glow={glow} ring={ring} />
        </g>
        <g opacity={ease(t, d * 0.08, d * 0.16)}>
          <Txt x={150} y={160} size={62} anchor="start" fill={SAGE.text}>341.8 MILLION PEOPLE</Txt>
        </g>
        <g opacity={ease(t, d * 0.18, d * 0.26)}>
          <STPill x={152} y={214} text="CENSUS ESTIMATE" dark={false} />
        </g>
      </ShotStage>
    );
  },

  // one pool for the whole country: the outline fills with water, enormous; Lev looks up at it
  "8-02": ({ t, d, f }) => {
    const level = mix(US_BOX.y1 + 10, 330, ease(t, d * 0.03, d * 0.62));
    const slosh = 8 + 6 * ease(t, d * 0.55, d * 0.75);
    const lev = pop(t, d * 0.45, 14);
    return (
      <ShotStage fam="sage" t={t} f={f} counter={COUNTRY}>
        <USLand fill={LAND} />
        <PoolFill level={level} f={f} amp={slosh} />
        <path d={US_PATH} fill="none" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        <g opacity={ease(t, d * 0.1, d * 0.2)}>
          <Txt x={150} y={160} size={66} anchor="start" fill={SAGE.text}>547 MILLION GAL</Txt>
        </g>
        <g opacity={ease(t, d * 0.22, d * 0.3)}>
          <STPill x={152} y={214} text="OUR SUM" dark={false} />
        </g>
        {lev > 0 ? (
          <g transform={about(1560, 960, lev)}>
            <Lev x={1560} y={960} h={190} frame={f} facing={-1} pose="stand" eyes="wide" tilt={-14} outline={INK} wind={0.3} />
          </g>
        ) : null}
      </ShotStage>
    );
  },

  // the pool splits into the many separate blobs
  "8-03": ({ t, d, f }) => {
    const k = ease(t, d * 0.12, d * 0.72);
    const r = (i: number) => mix(98 / BLOBS[i].r, 1, k);
    return (
      <ShotStage fam="sage" t={t} f={f} counter={COUNTRY}>
        <USLand fill={LAND} />
        <PoolFill level={330} f={f} amp={14} opacity={1 - ease(t, 0, d * 0.3)} />
        <clipPath id="l08split"><path d={US_PATH} /></clipPath>
        <g clipPath="url(#l08split)">
          <Blobs f={f} k={() => 1} rScale={r} glow={() => 0.15 * (1 - k)} />
        </g>
        <path d={US_PATH} fill="none" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        <g opacity={ease(t, d * 0.45, d * 0.62)}>
          <Txt x={150} y={160} size={66} anchor="start" fill={SAGE.text}>NOT ONE PIPE</Txt>
        </g>
      </ShotStage>
    );
  },

  // each blob flashes on its own rhythm, none touch; then the camera leans in: each has its own pipes and town
  "8-04": ({ t, d, f }) => {
    const per = (i: number) => 38 + Math.floor(rnd(BLOBS[i].seed * 3) * 50);
    const ph = (i: number) => ((t + Math.floor(rnd(BLOBS[i].seed * 5) * 90)) % per(i)) / per(i);
    const on = ease(t, d * 0.03, d * 0.1);
    const glow = (i: number) => Math.max(0, 1 - ph(i) * 4) * on;
    const ring = (i: number) => (on > 0.5 && ph(i) < 0.4 ? ph(i) * 2.5 : -1);
    const z = ease(t, d * 0.42, d * 0.6);
    const fx = mix(760, 1150, z), fy = mix(600, 470, z), s = mix(1, 2.3, z);
    const towns = ease(t, d * 0.5, d * 0.62);
    return (
      <ShotStage fam="sage" t={t} f={f} counter={COUNTRY}>
        <g transform={`translate(${mix(760, 900, z)} ${mix(600, 640, z)}) scale(${s}) translate(${-fx} ${-fy})`}>
          <USLand fill={LAND} sw={4 / s} />
          {/* each system's own pipes to its own little town */}
          <g opacity={towns}>
            {BLOBS.map((b, i) => (
              <g key={i}>
                {[0, 1, 2].map((q) => {
                  const a = rnd(b.seed * 7 + q) * Math.PI * 2;
                  const L = b.r + 14 + rnd(b.seed + q) * 10;
                  const hx = b.x + Math.cos(a) * L, hy = b.y + Math.sin(a) * L * 0.8;
                  return (
                    <g key={q}>
                      <path d={`M ${b.x} ${b.y} L ${hx} ${hy}`} stroke={WATER_DEEP} strokeWidth={2.4} strokeLinecap="round" />
                      <path d={`M ${b.x} ${b.y} L ${hx} ${hy}`} stroke={WATER_LIGHT} strokeWidth={1.4} strokeDasharray="3 5" strokeDashoffset={-t * 0.6} strokeLinecap="round" />
                      <rect x={hx - 3.5} y={hy - 3.5} width={7} height={7} rx={1.5} fill={CREAM} stroke={INK} strokeWidth={1} />
                    </g>
                  );
                })}
              </g>
            ))}
          </g>
          <Blobs f={f} k={() => 1} glow={glow} ring={ring} />
        </g>
        <g opacity={ease(t, d * 0.06, d * 0.14)}>
          <path d={rrect(120, 100, 860, 92, 26)} fill={CHALK} opacity={0.85} />
          <Txt x={150} y={164} size={52} anchor="start" fill={SAGE.text} ls={1}>EACH CITY, ITS OWN SUPPLY</Txt>
        </g>
      </ShotStage>
    );
  },

  // one day of home use as a bar of water; a pulsing lime sliver at its end = the whole flush; then it spreads into many pipes
  "8-05": ({ t, d, f }) => {
    const X0 = 200, X1 = 1500, BY = 470, BH = 130;
    const fill = ease(t, d * 0.04, d * 0.22);
    const sliverIn = pop(t, d * 0.28, 14);
    const pulse = 0.5 + 0.5 * Math.sin(f / 6);
    const SW = (X1 - X0) * 0.02;
    const spread = ease(t, d * 0.55, d * 0.64);
    const N = 18;
    const pipeX = (j: number) => 250 + (j * (1450 - 250)) / (N - 1);
    const PY = 850;
    const lev = pop(t, d * 0.78, 14);
    return (
      <ShotStage fam="chalk" t={t} f={f} counter={COUNTRY}>
        <PaperGrid color={CH.far} />
        {/* the bar */}
        <Txt x={X0} y={BY - 30} size={42} anchor="start" ls={2}>ONE DAY OF HOME USE</Txt>
        <Txt x={X1} y={BY + BH + 52} size={34} anchor="end" weight={800} fill={CH.dim} opacity={ease(t, d * 0.12, d * 0.2)}>82 GAL EACH</Txt>
        <path d={rrect(X0, BY, X1 - X0, BH, 24)} fill={CHALK} stroke={INK} strokeWidth={4} />
        <clipPath id="l08bar"><path d={rrect(X0 + 6, BY + 6, X1 - X0 - 12, BH - 12, 19)} /></clipPath>
        <g clipPath="url(#l08bar)">
          <rect x={X0} y={BY} width={(X1 - X0) * fill} height={BH} fill={WATER} />
          {Array.from({ length: 3 }, (_, j) => (
            <g key={j}>
              {Array.from({ length: 9 }, (_, q) => {
                const x = X0 + ((q * 170 + f * (1.5 + j * 0.5)) % (X1 - X0 + 170)) - 85;
                return x < X0 + (X1 - X0) * fill - 40 ? <path key={q} d={`M ${x} ${BY + 34 + j * 32} h 70`} stroke={WATER_LIGHT} strokeWidth={5} strokeLinecap="round" opacity={0.7} /> : null;
              })}
            </g>
          ))}
          {sliverIn > 0 ? <rect x={X1 - SW - 6} y={BY} width={SW + 6} height={BH} fill={LIME} opacity={Math.min(1, sliverIn) * (0.75 + 0.25 * pulse)} /> : null}
        </g>
        <path d={rrect(X0, BY, X1 - X0, BH, 24)} fill="none" stroke={INK} strokeWidth={4} />
        {sliverIn > 0 ? (
          <g>
            <Bloom x={X1 - SW / 2} y={BY + BH / 2} r={90} color={LIME} strength={0.35 + 0.3 * pulse} />
            <path d={`M ${X1 - SW / 2} ${BY - 4} L ${X1 - SW / 2} ${BY - 60}`} stroke={INK} strokeWidth={4} strokeLinecap="round" opacity={Math.min(1, sliverIn)} />
            <g transform={about(1400, 360, Math.min(1.05, sliverIn))}>
              <Txt x={1400} y={392} size={104}>ABOUT 2 %</Txt>
            </g>
          </g>
        ) : null}
        <g opacity={ease(t, d * 0.36, d * 0.44)}>
          <STPill x={1400} y={286} text="OUR SUM" dark={false} align="middle" />
        </g>
        {/* spread across many pipes: drops leave the sliver for many separate pipes */}
        {spread > 0 ? (
          <g>
            {Array.from({ length: N }, (_, j) => {
              const px = pipeX(j);
              const at = d * 0.6 + j * (d * 0.012);
              const k = ease(t, at, at + d * 0.09);
              const sx = X1 - SW / 2, sy = BY + BH;
              const cx = mix(sx, px, 0.5), cy = sy + 160;
              const bx = (1 - k) ** 2 * sx + 2 * (1 - k) * k * cx + k * k * px;
              const by = (1 - k) ** 2 * sy + 2 * (1 - k) * k * cy + k * k * (PY - 30);
              const arrived = t > at + d * 0.09;
              return (
                <g key={j} opacity={spread}>
                  <path d={`M ${px} ${PY - 30} L ${px} ${PY + 70}`} stroke={INK} strokeWidth={16} strokeLinecap="round" />
                  <path d={`M ${px} ${PY - 30} L ${px} ${PY + 70}`} stroke={WATER} strokeWidth={9} strokeLinecap="round" />
                  <path d={`M ${px} ${PY - 30} L ${px} ${PY + 70}`} stroke={WATER_LIGHT} strokeWidth={3} strokeDasharray="6 10" strokeDashoffset={-t * 1.4} strokeLinecap="round" opacity={arrived ? 1 : 0} />
                  {k > 0 && k < 1 ? <circle cx={bx} cy={by} r={8} fill={WATER} stroke={INK} strokeWidth={2.5} /> : null}
                  {arrived ? <circle cx={px} cy={PY - 30} r={10 + 2 * Math.sin(f / 5 + j)} fill={WATER_LIGHT} stroke={INK} strokeWidth={2.5} /> : null}
                </g>
              );
            })}
          </g>
        ) : null}
        {lev > 0 ? (
          <g transform={about(1700, 960, lev)}>
            <Lev x={1700} y={960} h={180} frame={f} facing={-1} pose="point" hands={{ front: [66, -128] }} eyes="happy" tilt={6} outline={INK} wind={0.2} />
          </g>
        ) : null}
      </ShotStage>
    );
  },
};
