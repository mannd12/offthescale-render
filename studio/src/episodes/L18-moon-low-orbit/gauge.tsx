// L18 distance rail (BUILD.md §5 `DistGauge`, storyboard "the carrier"): a tall vertical rail marked in kilometres on a LOG
// scale, a warm-tan Moon token, five named marks with lamps, horizontal lines with a drawing head and a band between two
// marks. Not L17's ladder (no rungs, no stamps) and never a dial: "rung" is spoken, drawn as a mark on the rail.
// USAGE (f = the shot's frame; all coordinates are screen px at 1080p)
//   <DistGauge f family center={km at screen y = cy} decade?=300 px per ×10 · x?=1700 · top?=40 · bottom?=1040 · cy?=540
//              draw?={0..1 the rail draws up from the bottom with a lit head} · speed?={px/f of the streaming hatch;
//              sign = direction, + streams DOWN (camera rising)} · token?={km of the Moon token} tokenR?=30 · spin?
//              lit?={MarkId[] lamps on} · lines?={MarkId[] horizontal lines} lineDraw?={0..1} lineFrom?={x the lines run to}
//              band?={[MarkId, MarkId] amber band between two marks, stripes crawl 1.5 px/f} · side?="right"|"left"
//              labels?=true · numerals?=true (decade numerals 1,000 / 10,000 / 100,000 KM: SCALE_LABELS) · scale?=1 />
//   railY(km, center, decade?, cy?) → screen y of a km on the rail (place Tick, brackets, arrows against it)
//   MARKS.today | geo | fluid | stiff | station → { km, name, key, label }   (labels are data18 readouts, checked)
//   <MoonToken x y r f spin?={deg/f, default 3} rim?=1 />   the warm Moon disc used on the rail and in diagrams
//   <StopBadge f rung={1|2|3} family x?=80 y?=96 />   the compact RUNG ONE|TWO|THREE kicker on a plate: slides in over 8 f,
//          a shine crosses it, hides itself after 75 f (2.5 s). Draw it LAST, in <Layer depth={0}>
// Moving: whenever `center` changes the ticks stream past by themselves; `speed` adds a fine hatch that streams even on a
// held camera; lamps pulse; the line heads glow. Keep subjects left of x = 1720 where the side labels sit (side="right").
import React, { useId } from "react";
import { Family, IF2, Kicker, alpha, mixHex } from "../../lib/illustrated";
import { L18_COLORS } from "./families";
import { READ, ReadKey, assertAllowed } from "./data18";

const C = L18_COLORS;
const sid = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, "");
const cl = (v: number) => Math.max(0, Math.min(1, v));
const fr = (v: number) => v - Math.floor(v);

export type MarkId = "today" | "geo" | "fluid" | "stiff" | "station";
const kmLabel = (key: ReadKey) => {
  const t = READ[key].text.replace(/^ABOUT /, "").replace(/ FROM THE CENTER$/, "").replace(/^SURFACE /, "").replace(/ UP$/, "");
  return assertAllowed(t, "DistGauge mark");
};
export const MARKS: Record<MarkId, { km: number; name: string; key: ReadKey; label: string }> = {
  today: { km: 384400, name: "TODAY", key: "moonKm", label: kmLabel("moonKm") }, // #1
  geo: { km: 42164, name: "GEOSTATIONARY", key: "geoKm", label: kmLabel("geoKm") }, // #13
  fluid: { km: 18400, name: "FLUID LINE", key: "fluidKm", label: kmLabel("fluidKm") }, // #7 C
  stiff: { km: 9500, name: "STIFF LINE", key: "stiffKm", label: kmLabel("stiffKm") }, // #7 C
  station: { km: 400, name: "STATION", key: "stationKm", label: kmLabel("stationKm") }, // #3, #8
};
const MARK_ORDER: MarkId[] = ["today", "geo", "fluid", "stiff", "station"];

/** Screen y of `km` on the rail when km `center` sits at `cy`. */
export const railY = (km: number, center: number, decade = 300, cy = 540) => cy - (Math.log10(Math.max(1, km)) - Math.log10(Math.max(1, center))) * decade;

export const MoonToken: React.FC<{ x: number; y: number; r: number; f: number; spin?: number; rim?: number }> = ({ x, y, r, f, spin = 3, rim = 1 }) => {
  const id = "mt" + sid(useId());
  const a = (f * spin * Math.PI) / 180;
  const craters = [
    [0.35, 0.3, 0.22],
    [0.62, 2.2, 0.16],
    [0.5, 4.1, 0.13],
    [0.2, 5.2, 0.1],
  ];
  return (
    <g>
      <defs>
        <radialGradient id={id + "g"} cx="0.36" cy="0.32" r="0.75">
          <stop offset="0" stopColor={C.moonLit} />
          <stop offset="0.6" stopColor={C.moonMid} />
          <stop offset="1" stopColor={C.moonShade} />
        </radialGradient>
        <radialGradient id={id + "b"} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.55" stopColor={C.moonRim} stopOpacity={0.55 * rim} />
          <stop offset="1" stopColor={C.moonRim} stopOpacity={0} />
        </radialGradient>
        <clipPath id={id + "c"}>
          <circle cx={x} cy={y} r={r} />
        </clipPath>
      </defs>
      <circle cx={x} cy={y} r={r * 1.7} fill={`url(#${id}b)`} />
      <circle cx={x} cy={y} r={r} fill={`url(#${id}g)`} />
      <g clipPath={`url(#${id}c)`}>
        {craters.map(([d, ph, s], i) => {
          const ca = a + ph;
          const cx = x + Math.cos(ca) * d * r * 1.1;
          const cy = y + Math.sin(ca) * d * r * 0.8;
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r={s * r} fill={C.moonCrater} opacity={0.75} />
              <circle cx={cx - s * r * 0.2} cy={cy - s * r * 0.2} r={s * r * 0.8} fill="none" stroke={C.moonLit} strokeWidth={Math.max(1, r * 0.04)} opacity={0.8} />
            </g>
          );
        })}
      </g>
      <circle cx={x} cy={y} r={r} fill="none" stroke={C.moonRim} strokeWidth={Math.max(2, r * 0.08)} opacity={0.9 * rim} />
    </g>
  );
};

export const DistGauge: React.FC<{
  f: number;
  family: Family;
  center: number;
  decade?: number;
  x?: number;
  top?: number;
  bottom?: number;
  cy?: number;
  draw?: number;
  speed?: number;
  token?: number;
  tokenR?: number;
  spin?: number;
  lit?: MarkId[];
  lines?: MarkId[];
  lineDraw?: number;
  lineFrom?: number;
  band?: [MarkId, MarkId];
  side?: "right" | "left";
  labels?: boolean;
  numerals?: boolean;
  scale?: number;
}> = ({
  f,
  family: F,
  center,
  decade = 300,
  x = 1700,
  top = 40,
  bottom = 1040,
  cy = 540,
  draw = 1,
  speed = 0,
  token,
  tokenR = 30,
  spin = 3,
  lit = [],
  lines = [],
  lineDraw = 1,
  lineFrom = 160,
  band,
  side = "right",
  labels = true,
  numerals = true,
  scale = 1,
}) => {
  const id = "dg" + sid(useId());
  const y = (km: number) => railY(km, center, decade, cy);
  const headY = bottom - cl(draw) * (bottom - top);
  const s = scale;
  const sgn = side === "right" ? 1 : -1;
  const anchor = side === "right" ? "start" : "end";
  const railW = 16 * s;
  const tickCol = C.amber;
  // log ticks: 1..9 × 10^k for k = 1..6
  const ticks: React.ReactNode[] = [];
  for (let k = 1; k <= 6; k++)
    for (let m = 1; m <= 9; m++) {
      const km = m * Math.pow(10, k);
      const ty = y(km);
      if (ty < top - 10 || ty > bottom + 10) continue;
      const major = m === 1;
      const len = (major ? 34 : m === 5 ? 20 : 12) * s;
      ticks.push(<line key={`t${k}-${m}`} x1={x - len} y1={ty} x2={x + len} y2={ty} stroke={tickCol} strokeWidth={(major ? 4 : 2.5) * s} strokeLinecap="round" opacity={major ? 1 : 0.8} />);
      if (major && numerals && k >= 3 && k <= 5) {
        const txt = assertAllowed(Math.pow(10, k).toLocaleString("en-US"), "DistGauge decade");
        ticks.push(
          <text key={`n${k}`} x={x - sgn * 44 * s} y={ty + 7 * s} textAnchor={side === "right" ? "end" : "start"} style={{ fontFamily: IF2.num, fontWeight: 700, fontSize: 19 * s, fill: alpha(F.text, 0.78) }}>
            {txt}
          </text>,
        );
      }
    }
  // streaming hatch (fine dashes inside the rail), moves at `speed` px/f even when the camera holds
  const gap = 26 * s;
  const off = fr((f * speed) / gap) * gap;
  const hatch: React.ReactNode[] = [];
  for (let hy = top - gap + off; hy < bottom + gap; hy += gap) hatch.push(<line key={hy.toFixed(1)} x1={x - railW * 0.32} y1={hy} x2={x + railW * 0.32} y2={hy} stroke={F.light} strokeWidth={2.5 * s} opacity={0.6} />);
  // band between two marks
  let bandEl: React.ReactNode = null;
  if (band) {
    const ya = y(MARKS[band[0]].km);
    const yb = y(MARKS[band[1]].km);
    const y0 = Math.min(ya, yb);
    const h = Math.abs(yb - ya);
    const st = fr(f / 16) * 32;
    bandEl = (
      <g>
        <defs>
          <clipPath id={id + "band"}>
            <rect x={x - 70 * s} y={y0} width={140 * s} height={h} rx={8} />
          </clipPath>
        </defs>
        <rect x={x - 70 * s} y={y0} width={140 * s} height={h} rx={8} fill={alpha(C.amber, 0.32)} />
        <g clipPath={`url(#${id}band)`}>
          {Array.from({ length: Math.ceil(h / 32) + 6 }, (_, i) => {
            const yy = y0 - 64 + i * 32 + st;
            return <line key={i} x1={x - 80 * s} y1={yy + 40} x2={x + 80 * s} y2={yy - 40} stroke={C.lever} strokeWidth={9} opacity={0.5} />;
          })}
        </g>
        <rect x={x - 70 * s} y={y0} width={140 * s} height={h} rx={8} fill="none" stroke={C.lever} strokeWidth={3} />
      </g>
    );
  }
  return (
    <g>
      <defs>
        <clipPath id={id + "c"}>
          <rect x={x - 400} y={headY} width={800} height={bottom - headY + 2} />
        </clipPath>
        <linearGradient id={id + "r"} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={mixHex(F.mid, F.light, 0.25)} />
          <stop offset="0.5" stopColor={F.mid} />
          <stop offset="1" stopColor={mixHex(F.near, "#000000", 0.2)} />
        </linearGradient>
      </defs>
      {bandEl}
      {/* horizontal lines at marks (drawn from the rail outward to `lineFrom`) with a glowing head */}
      {lines.map((m) => {
        const ly = y(MARKS[m].km);
        const x1 = x - (x - lineFrom) * cl(lineDraw);
        const col = m === "stiff" ? C.lever : m === "fluid" ? C.model : m === "station" ? C.amber : C.moonRim;
        return (
          <g key={m}>
            <line x1={x} y1={ly} x2={x1} y2={ly} stroke={col} strokeWidth={6 * s} strokeLinecap="round" strokeDasharray={m === "fluid" ? `${22 * s} ${12 * s}` : undefined} />
            {lineDraw > 0 && lineDraw < 1 ? <circle cx={x1} cy={ly} r={11 * s} fill={col} opacity={0.95} /> : null}
            {lineDraw > 0 && lineDraw < 1 ? <circle cx={x1} cy={ly} r={26 * s} fill={col} opacity={0.25} /> : null}
          </g>
        );
      })}
      <g clipPath={`url(#${id}c)`}>
        <rect x={x - railW / 2 - 6 * s} y={top - 20} width={railW + 12 * s} height={bottom - top + 40} rx={railW} fill={alpha(F.light, 0.12)} />
        <rect x={x - railW / 2} y={top - 20} width={railW} height={bottom - top + 40} rx={railW / 2} fill={`url(#${id}r)`} stroke={C.amber} strokeWidth={2 * s} />
        {hatch}
        {ticks}
        {/* named marks: a plate, a lamp, the name and the km readout */}
        {MARK_ORDER.map((m, i) => {
          const M = MARKS[m];
          const my = y(M.km);
          if (my < top - 40 || my > bottom + 40) return null;
          const on = lit.includes(m);
          const pulse = 0.75 + 0.25 * Math.sin(f / 5 + i);
          const lx = x + sgn * 30 * s;
          return (
            <g key={m}>
              <line x1={x - 46 * s} y1={my} x2={x + 46 * s} y2={my} stroke={on ? C.moonRim : C.amber} strokeWidth={7 * s} strokeLinecap="round" />
              {on ? <circle cx={x} cy={my} r={40 * s * pulse} fill={C.amber} opacity={0.3} /> : null}
              <circle cx={x} cy={my} r={11 * s} fill={on ? "#FFE7A0" : mixHex(C.amber, F.near, 0.55)} stroke={C.amber} strokeWidth={3 * s} />
              {labels ? (
                <g>
                  <text x={lx + sgn * 26 * s} y={my - 6 * s} textAnchor={anchor} style={{ fontFamily: IF2.label, fontSize: 24 * s, letterSpacing: 1.6 * s, fill: on ? "#FFE7A0" : F.text }}>
                    {M.name}
                  </text>
                  <text x={lx + sgn * 26 * s} y={my + 22 * s} textAnchor={anchor} style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 21 * s, fill: on ? C.amber : alpha(F.text, 0.85) }}>
                    {M.label}
                  </text>
                </g>
              ) : null}
            </g>
          );
        })}
      </g>
      {/* the drawing head */}
      {draw < 1 ? (
        <g>
          <circle cx={x} cy={headY} r={30 * s} fill={F.light} opacity={0.3} />
          <circle cx={x} cy={headY} r={12 * s} fill={F.light} />
        </g>
      ) : null}
      {token != null ? <MoonToken x={x} y={y(token)} r={tokenR} f={f} spin={spin} /> : null}
    </g>
  );
};

const WORD = ["", "ONE", "TWO", "THREE"] as const;

export const StopBadge: React.FC<{ f: number; rung: 1 | 2 | 3; family: Family; x?: number; y?: number }> = ({ f, rung, family: F, x = 80, y = 96 }) => {
  if (f < 0 || f >= 75) return null;
  const inT = cl(f / 8);
  const outT = cl((75 - f) / 10);
  const o = Math.min(inT, outT);
  const w = 330;
  const shine = fr(f / 40) * (w + 120) - 60;
  const id = "sb" + sid(useId());
  return (
    <g opacity={o} transform={`translate(${(-(1 - inT) * 60).toFixed(1)} 0)`}>
      <defs>
        <clipPath id={id}>
          <rect x={x - 20} y={y - 44} width={w} height={68} rx={34} />
        </clipPath>
      </defs>
      <rect x={x - 20} y={y - 44} width={w} height={68} rx={34} fill={alpha(F.shadow, 0.78)} stroke={C.amber} strokeWidth={3} />
      <g clipPath={`url(#${id})`}>
        <rect x={x - 20 + shine} y={y - 50} width={40} height={80} fill="#FFFFFF" opacity={0.18} transform={`skewX(-20)`} />
      </g>
      <Kicker x={x} y={y} text={`RUNG ${WORD[rung]}`} color={C.amber} size={30} />
      {/* three pips, the current one lit */}
      {[1, 2, 3].map((k) => (
        <circle key={k} cx={x + w - 90 + k * 18} cy={y - 10} r={6} fill={k <= rung ? C.amber : alpha(C.amber, 0.25)} />
      ))}
    </g>
  );
};
