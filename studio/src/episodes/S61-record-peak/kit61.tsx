// Small drawing helpers shared by the L15 Shorts S61-S65 (episodes/S61..S65). Their shots are each Short's own
// drawings; this file only holds repeated pieces (a dial with a mark, sound rings, push arrows, a bar, the model chip,
// number formatting). The probe, balloon, station, stamp, limb and sky column are L15's own props.
import React from "react";
import { C, Plaque, T, ez, mix } from "../S41-dig-plate/vkit";
import { Dial } from "../S56-fall-clock/kit56";

export { BG_STUDIO, BG_DEEP, BG_NIGHT, FAM, Dial, Watch } from "../S56-fall-clock/kit56";

/** 1357.6 -> "1,357.6" */
export const fmt = (v: number, d = 0, grp = true) => v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d, useGrouping: grp });

/** The speed dial from kit56 plus a bold mark at fraction `m` of the scale (240 degree arc) and a label beside it. */
export const MarkedDial: React.FC<{ x: number; y: number; r: number; v: number; m: number; label: string; f: number; shake?: number; crossed?: number; color?: string }> = ({ x, y, r, v, m, label, f, shake = 0, crossed = 0, color }) => {
  const a = ((150 + 240 * m) * Math.PI) / 180;
  const p = (rr: number): [number, number] => [x + Math.cos(a) * rr, y + Math.sin(a) * rr];
  const [x1, y1] = p(r * 0.5);
  const [x2, y2] = p(r * 1.02);
  const [lx, ly] = p(r + 78);
  return (
    <g>
      <Dial x={x} y={y} r={r} v={v} f={f} shake={shake} color={color} />
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.cream} strokeWidth={14} strokeLinecap="round" />
      <T x={lx} y={ly + 16} text={label} size={50} color={C.cream} />
      {crossed > 0 ? (
        <g stroke={C.verm} strokeWidth={22} strokeLinecap="round" opacity={crossed}>
          <line x1={lx - 120} y1={ly - 60} x2={lx - 120 + 240 * crossed} y2={ly - 60 + 120 * crossed} />
          {crossed > 0.5 ? <line x1={lx + 120} y1={ly - 60} x2={lx + 120 - 240 * (crossed * 2 - 1)} y2={ly - 60 + 120 * (crossed * 2 - 1)} /> : null}
        </g>
      ) : null}
    </g>
  );
};

/** Expanding rings (a sound wave) from a point. */
export const Rings: React.FC<{ x: number; y: number; f: number; n?: number; period?: number; max?: number; color?: string; width?: number; opacity?: number }> = ({ x, y, f, n = 4, period = 44, max = 460, color = C.foam, width = 10, opacity = 0.8 }) => (
  <g fill="none" stroke={color} strokeWidth={width}>
    {Array.from({ length: n }, (_, i) => {
      const u = (((f + (i * period) / n) % period) + period) % period / period;
      return <circle key={i} cx={x} cy={y} r={u * max} opacity={opacity * (1 - u)} />;
    })}
  </g>
);

/** Arrows marching along y (dir -1 = up, 1 = down). */
export const Arrows: React.FC<{ x: number; y0: number; y1: number; f: number; dir?: 1 | -1; n?: number; size?: number; color?: string; speed?: number; opacity?: number }> = ({ x, y0, y1, f, dir = -1, n = 4, size = 70, color = C.amber, speed = 7, opacity = 0.95 }) => {
  const span = y1 - y0;
  return (
    <g stroke={color} strokeWidth={size * 0.24} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={opacity}>
      {Array.from({ length: n }, (_, i) => {
        const u = ((((i / n) * span + f * speed * dir) % span) + span) % span;
        const y = y0 + u;
        const tip = y + dir * size;
        const tail = y - dir * size * 0.7;
        const arm = tip - dir * size * 0.55;
        return <path key={i} d={`M${x} ${tail} V${tip} M${x - size * 0.55} ${arm} L${x} ${tip} L${x + size * 0.55} ${arm}`} />;
      })}
    </g>
  );
};

/** A horizontal bar: dark track and a coloured fill of fraction k. */
export const HBar: React.FC<{ x: number; y: number; w: number; k: number; h?: number; color?: string }> = ({ x, y, w, k, h = 76, color = C.amber }) => (
  <g>
    <rect x={x} y={y - h / 2} width={w} height={h} rx={h / 2} fill={C.ink} opacity={0.9} />
    <rect x={x + 8} y={y - h / 2 + 8} width={Math.max(h - 16, (w - 16) * Math.max(0, Math.min(1, k)))} height={h - 16} rx={(h - 16) / 2} fill={color} />
  </g>
);

/** The mandatory chip on every shot that shows a number from our own model (L15 sources row 20). */
export const ModelChip: React.FC<{ y?: number }> = ({ y = 78 }) => (
  <g>
    <rect x={300} y={y - 40} width={480} height={80} rx={40} fill={C.verm} />
    <T x={540} y={y + 17} text="OUR MODEL" size={52} color={C.cream} halo={C.verm} />
  </g>
);

/** A big number in a plaque that counts from `a` to `b` over [f0, f1] and then holds. */
export const Count: React.FC<{ x: number; y: number; f: number; a?: number; b: number; f0?: number; f1: number; d?: number; unit?: string; size?: number; fg?: string; w?: number; scale?: number; grp?: boolean }> = ({ x, y, f, a = 0, b, f0 = 0, f1, d = 0, unit = "", size = 120, fg = C.amber, w, scale = 1, grp = true }) => {
  const v = mix(a, b, ez(f, f0, f1));
  return <Plaque x={x} y={y} text={`${fmt(v, d, grp)}${unit}`} size={size} bg={C.ink} fg={fg} w={w} scale={scale} />;
};

export { C, Plaque, T, ez, mix };
