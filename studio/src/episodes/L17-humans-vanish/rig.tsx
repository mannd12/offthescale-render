// L17 · Tick's time camera and its rail (BUILD.md §5): the cold open's camera on a tripod (C-01, C-10, C-11), the capped
// camera of 8-06 and the closer's rail (Z-01). Ours: a boxy survey camera with a saffron bezel, no real brand or insignia.
// USAGE (f = the shot's frame)
//   <TimeCamera x y={ground under the tripod} size?=220 (body width px) f facing?=1|-1 capped? dial?={{ value, word? }}
//               family reel?=true tally?=true />   the reel on top turns 6 deg/f while recording (not capped); the red
//               tally lamp blinks; `dial` hangs a small YearsDial on the side plate (the "dial plate hook")
//   cameraLens(x, y, size, facing) → [lx, ly] the lens centre (for a light cone or a match cut)
//   <Rail f y x0?=-60 x1?=1980 speed?=14 (px/f; + = ticks stream left, as when the camera pushes right) family
//         gap?=64 flag?={{ at: px along the rail at f = 0, label?: "ONE DAY" }} />   two thin rails + sleepers + a
//         bigger tick every 5th; the flag rides with the ticks (it leaves frame when the push passes it)
import React from "react";
import { Family, IF2, alpha, labelCase } from "../../lib/illustrated";
import { L17_COLORS } from "./families";
import { YearsDial } from "./ladder";
import { assertAllowed } from "./data17";

const C = L17_COLORS;

export const cameraLens = (x: number, y: number, size = 220, facing: 1 | -1 = 1): [number, number] => {
  const bodyY = y - size * 1.25;
  return [x + facing * size * 0.72, bodyY + size * 0.32];
};

export const TimeCamera: React.FC<{
  x: number;
  y: number;
  size?: number;
  f: number;
  facing?: 1 | -1;
  capped?: boolean;
  dial?: { value: number; word?: string };
  family: Family;
  reel?: boolean;
  tally?: boolean;
}> = ({ x, y, size = 220, f, facing = 1, capped = false, dial, family: F, reel = true, tally = true }) => {
  const s = size;
  const bodyH = s * 0.62;
  const bodyY = y - s * 1.25; // top of the body
  const body = "#173A44";
  const bodyLit = "#2A5C66";
  const leg = F.dark ? "#3F6A70" : "#2A4A52";
  const spin = capped ? 0 : f * 6;
  const blink = tally && !capped && Math.floor(f / 12) % 2 === 0;
  return (
    <g transform={`translate(${x} 0) scale(${facing} 1)`}>
      {/* ground shadow */}
      <ellipse cx={0} cy={y + 4} rx={s * 0.6} ry={s * 0.06} fill="#020B10" opacity={0.3} />
      {/* tripod: three legs from the head */}
      {[
        [-s * 0.5, y],
        [s * 0.5, y],
        [s * 0.08, y + 2],
      ].map(([lx, ly], i) => (
        <g key={i}>
          <line x1={0} y1={bodyY + bodyH + s * 0.06} x2={lx} y2={ly} stroke={leg} strokeWidth={s * 0.045} strokeLinecap="round" />
          <circle cx={lx} cy={ly} r={s * 0.03} fill={C.saffronDeep} />
        </g>
      ))}
      <rect x={-s * 0.07} y={bodyY + bodyH} width={s * 0.14} height={s * 0.1} rx={s * 0.02} fill={C.saffronDeep} />
      {/* reels on top */}
      {reel
        ? [-0.22, 0.2].map((dx, i) => (
            <g key={i} transform={`translate(${dx * s} ${bodyY - s * 0.14}) rotate(${spin * (i ? 1 : 1.2)})`}>
              <circle r={s * 0.17} fill={body} stroke={bodyLit} strokeWidth={s * 0.02} />
              {[0, 120, 240].map((a) => (
                <circle key={a} cx={Math.cos((a * Math.PI) / 180) * s * 0.09} cy={Math.sin((a * Math.PI) / 180) * s * 0.09} r={s * 0.04} fill={F.dark ? "#06151D" : "#0F2A33"} />
              ))}
              <circle r={s * 0.03} fill={C.saffron} />
            </g>
          ))
        : null}
      {/* body: shadow side, lit top edge, saffron trim */}
      <rect x={-s * 0.5 + 6} y={bodyY + 8} width={s} height={bodyH} rx={s * 0.08} fill="#020B10" opacity={0.3} />
      <rect x={-s * 0.5} y={bodyY} width={s} height={bodyH} rx={s * 0.08} fill={body} />
      <rect x={-s * 0.5} y={bodyY} width={s} height={bodyH * 0.22} rx={s * 0.06} fill={bodyLit} />
      <rect x={-s * 0.5} y={bodyY + bodyH - s * 0.06} width={s} height={s * 0.06} fill={C.saffron} />
      {/* side plate (the dial hook) */}
      <rect x={-s * 0.4} y={bodyY + bodyH * 0.3} width={s * 0.5} height={bodyH * 0.5} rx={s * 0.04} fill={alpha(C.paper, 0.14)} stroke={alpha(C.paper, 0.4)} strokeWidth={2} />
      {/* tally lamp */}
      <circle cx={s * 0.36} cy={bodyY + s * 0.1} r={s * 0.035} fill={blink ? C.vermilion : "#5A2A22"} />
      {blink ? <circle cx={s * 0.36} cy={bodyY + s * 0.1} r={s * 0.08} fill={C.vermilion} opacity={0.25} /> : null}
      {/* lens barrel */}
      <rect x={s * 0.5} y={bodyY + s * 0.17} width={s * 0.16} height={s * 0.3} rx={s * 0.03} fill={bodyLit} />
      <rect x={s * 0.64} y={bodyY + s * 0.12} width={s * 0.1} height={s * 0.4} rx={s * 0.03} fill={body} stroke={C.saffron} strokeWidth={s * 0.02} />
      {capped ? (
        <g>
          <rect x={s * 0.72} y={bodyY + s * 0.1} width={s * 0.08} height={s * 0.44} rx={s * 0.035} fill={C.saffronDeep} />
          <line x1={s * 0.76} y1={bodyY + s * 0.54} x2={s * 0.6} y2={bodyY + s * 0.62} stroke={C.saffronDeep} strokeWidth={s * 0.012} />
        </g>
      ) : (
        <g>
          <ellipse cx={s * 0.74} cy={bodyY + s * 0.32} rx={s * 0.035} ry={s * 0.17} fill="#7FE0D8" opacity={0.85} />
          <ellipse cx={s * 0.745} cy={bodyY + s * 0.27} rx={s * 0.012} ry={s * 0.05} fill="#FFFFFF" opacity={0.8} />
        </g>
      )}
      {dial ? (
        <g transform={`translate(${-s * 0.15} ${bodyY + bodyH * 0.55}) scale(${facing} 1) translate(${s * 0.15} ${-(bodyY + bodyH * 0.55)})`}>
          <YearsDial x={-s * 0.15} y={bodyY + bodyH * 0.55} r={s * 0.16} value={dial.value} word={dial.word} family={F} f={f} title="" />
        </g>
      ) : null}
    </g>
  );
};

export const Rail: React.FC<{
  f: number;
  y: number;
  x0?: number;
  x1?: number;
  speed?: number;
  family: Family;
  gap?: number;
  flag?: { at: number; label?: string };
}> = ({ f, y, x0 = -60, x1 = 1980, speed = 14, family: F, gap = 64, flag }) => {
  const col = F.dark ? "#CFE6E2" : alpha(C.ink, 0.75);
  const travel = f * speed;
  const off = ((travel % gap) + gap) % gap;
  const base = Math.floor(travel / gap);
  const n = Math.ceil((x1 - x0) / gap) + 2;
  const label = flag?.label ? labelCase(flag.label) : undefined;
  if (label) assertAllowed(label, "Rail flag");
  const fx = flag ? x0 + flag.at - travel : 0;
  return (
    <g>
      <line x1={x0} y1={y} x2={x1} y2={y} stroke={col} strokeWidth={4} opacity={0.85} />
      <line x1={x0} y1={y + 18} x2={x1} y2={y + 18} stroke={col} strokeWidth={2.5} opacity={0.5} />
      {Array.from({ length: n }, (_, i) => {
        const tx = x0 + i * gap - off;
        const big = (((i + base) % 5) + 5) % 5 === 0;
        return <line key={i} x1={tx} y1={y - (big ? 10 : 4)} x2={tx} y2={y + (big ? 30 : 20)} stroke={col} strokeWidth={big ? 4 : 2.5} opacity={big ? 0.9 : 0.6} />;
      })}
      {flag && fx > x0 - 200 && fx < x1 + 200 ? (
        <g>
          <line x1={fx} y1={y} x2={fx} y2={y - 90} stroke={col} strokeWidth={3} />
          <path d={`M${fx} ${y - 90} L${fx + 46} ${y - 78} L${fx} ${y - 64} Z`} fill={C.saffron} />
          {label ? (
            <text x={fx + 8} y={y - 100} style={{ fontFamily: IF2.label, fontSize: 18, letterSpacing: 2, fill: col }}>
              {label}
            </text>
          ) : null}
        </g>
      ) : null}
    </g>
  );
};
