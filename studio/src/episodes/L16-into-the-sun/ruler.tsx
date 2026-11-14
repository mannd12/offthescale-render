// RadiiRuler: the horizontal ruler in SOLAR RADII ABOVE THE SURFACE (BUILD.md §5). The Sun is at the LEFT end (r = 0 =
// SURFACE); the ruler runs right, out toward Earth. NOT L15's vertical AltRuler (F11). Ticks are unnumbered (only the
// three flags carry figures, all from sundata.ts): SURFACE · ABOUT 9 · 18.8 ALFVÉN.
// The ruler is the episode's free mover: whenever the probe or camera moves, its ticks stream at `speed` px/f.
// USAGE (f = the shot's frame)
//   <RadiiRuler f y pxPerR? origin? speed? flags? pins? brackets? scaleBreak? limb? color? x0? x1? />
//     origin   screen x of the SURFACE (r = 0) at f = 0 (default 180)
//     speed    px/f the whole ruler moves (+ = rightward: the camera flying IN toward the Sun); 14-28 keeps it alive
//     pxPerR   px per solar radius (default 80: ABOUT 9 sits ≈ 710 px right of the surface)
//     pins     [{ r, label, draw 0..1, h? }] a leader rising from the ruler at r radii to a chip (label via assertAllowed)
//     brackets [{ r0, r1, label?, draw 0..1 }] a span drawn under the ruler
//     scaleBreak r at which to draw a "//" break (NOT TO SCALE beyond it, F6)
//     limb     draw the limb's edge rising at the surface end (a gold arc; full Sun pieces are in sunbody.tsx)
//   rAtX(x, f, origin, speed, pxPerR) / xAtR(r, f, origin, speed, pxPerR)  helpers for placing the probe on the ruler
import React from "react";
import { IF2, alpha, labelCase } from "../../lib/illustrated";
import { L16_COLORS } from "./families";
import { RADII, assertAllowed } from "./sundata";

const C = L16_COLORS;
const cl01 = (v: number) => Math.max(0, Math.min(1, v));
const sm = (t: number) => {
  const u = cl01(t);
  return u * u * (3 - 2 * u);
};

export const xAtR = (r: number, f: number, origin = 180, speed = 0, pxPerR = 80) => origin + f * speed + r * pxPerR;
export const rAtX = (x: number, f: number, origin = 180, speed = 0, pxPerR = 80) => (x - origin - f * speed) / pxPerR;

export type RulerPin = { r: number; label: string; draw: number; h?: number };
export type RulerBracket = { r0: number; r1: number; label?: string; draw: number };

export const RadiiRuler: React.FC<{
  f: number;
  y: number;
  pxPerR?: number;
  origin?: number;
  speed?: number;
  flags?: boolean;
  pins?: RulerPin[];
  brackets?: RulerBracket[];
  scaleBreak?: number;
  limb?: boolean;
  color?: string;
  /** visible screen span */
  x0?: number;
  x1?: number;
  /** minor tick step in radii (major every 2 minors) */
  step?: number;
}> = ({ f, y, pxPerR = 80, origin = 180, speed = 0, flags = true, pins = [], brackets = [], scaleBreak, limb = false, color = "#FFF4E0", x0 = -40, x1 = 1960, step = 0.5 }) => {
  const X = (r: number) => xAtR(r, f, origin, speed, pxPerR);
  const rL = Math.max(0, (x0 - X(0)) / pxPerR);
  const rR = (x1 - X(0)) / pxPerR;
  const ticks: React.ReactNode[] = [];
  if (rR > 0) {
    const first = Math.ceil(rL / step);
    const last = Math.floor(rR / step);
    for (let k = first; k <= last && k - first < 400; k++) {
      const r = k * step;
      if (scaleBreak != null && r > scaleBreak) break;
      const major = k % 2 === 0;
      const xx = X(r);
      ticks.push(<line key={k} x1={xx} y1={y - (major ? 26 : 14)} x2={xx} y2={y} stroke={color} strokeWidth={major ? 4 : 2.5} opacity={major ? 0.95 : 0.6} />);
    }
  }
  const xs = Math.max(x0, X(0));
  const xe = scaleBreak != null ? Math.min(x1, X(scaleBreak)) : x1;
  const flagList: [number, string, string][] = [
    [0, "SURFACE", C.gold],
    [RADII.pass, "ABOUT 9", C.saffron],
    [RADII.alfven, "18.8 ALFVÉN", C.gold],
  ];
  return (
    <g>
      {limb ? (
        <g>
          <path d={`M${X(0) - 420} ${y + 600} Q ${X(0) - 40} ${y + 40} ${X(0)} ${y - 520}`} fill="none" stroke={C.gold} strokeWidth={18} opacity={0.9} />
          <path d={`M${X(0) - 420} ${y + 600} Q ${X(0) - 40} ${y + 40} ${X(0)} ${y - 520} L ${X(0) - 900} ${y - 520} L ${X(0) - 900} ${y + 600} Z`} fill={alpha(C.amber, 0.85)} />
        </g>
      ) : null}
      {/* the rail */}
      {xe > xs ? <rect x={xs} y={y - 3} width={xe - xs} height={6} rx={3} fill={color} /> : null}
      {xe > xs ? <rect x={xs} y={y + 4} width={xe - xs} height={10} fill={alpha("#000000", 0.18)} /> : null}
      {ticks}
      {scaleBreak != null ? (
        <g stroke={color} strokeWidth={5} strokeLinecap="round">
          <line x1={X(scaleBreak) + 6} y1={y + 18} x2={X(scaleBreak) + 22} y2={y - 18} />
          <line x1={X(scaleBreak) + 20} y1={y + 18} x2={X(scaleBreak) + 36} y2={y - 18} />
        </g>
      ) : null}
      {scaleBreak != null ? (
        <text x={X(scaleBreak) + 50} y={y + 8} style={{ fontFamily: IF2.label, fontSize: 18, letterSpacing: 2.5, fill: alpha(color, 0.8) }}>
          {labelCase("not to scale")}
        </text>
      ) : null}
      {/* brackets under the rail */}
      {brackets.map((b, i) => {
        const a = X(b.r0);
        const e = X(b.r1);
        const t = sm(b.draw);
        const xe2 = a + (e - a) * t;
        const yy = y + 40;
        if (b.label) assertAllowed(b.label, "RadiiRuler bracket");
        return (
          <g key={"b" + i} stroke={C.saffron} strokeLinecap="round" fill="none">
            <line x1={a} y1={yy - 12} x2={a} y2={yy + 12} strokeWidth={4} />
            <line x1={a} y1={yy} x2={xe2} y2={yy} strokeWidth={4} />
            {t > 0 && t < 1 ? <circle cx={xe2} cy={yy} r={8} fill={C.saffronCore} strokeWidth={2} /> : null}
            {t >= 1 ? <line x1={e} y1={yy - 12} x2={e} y2={yy + 12} strokeWidth={4} /> : null}
            {b.label && t > 0.6 ? (
              <text x={(a + e) / 2} y={yy + 40} textAnchor="middle" stroke="none" opacity={sm((t - 0.6) / 0.4)} style={{ fontFamily: IF2.num, fontWeight: 800, fontSize: 28, fill: C.saffronCore }}>
                {b.label}
              </text>
            ) : null}
          </g>
        );
      })}
      {/* flags (the only numerals on the ruler) */}
      {flags
        ? flagList.map(([r, label, col]) => {
            const xx = X(r);
            if (xx < x0 - 200 || xx > x1 + 50) return null;
            if (scaleBreak != null && r > scaleBreak) return null;
            assertAllowed(label, "RadiiRuler flag");
            const w = label.length * 12.5 + 26;
            const wave = Math.sin(f / 6 + r) * 3;
            return (
              <g key={label}>
                <line x1={xx} y1={y} x2={xx} y2={y - 78} stroke={col} strokeWidth={4} />
                <path d={`M${xx} ${y - 78} l${w} ${wave} l0 34 l${-w} ${-wave} Z`} fill={col} />
                <text x={xx + 12} y={y - 54 + wave * 0.5} style={{ fontFamily: IF2.label, fontSize: 19, letterSpacing: 1.8, fill: C.ink }}>
                  {label}
                </text>
              </g>
            );
          })
        : null}
      {/* pins */}
      {pins.map((p, i) => {
        const xx = X(p.r);
        const t = sm(p.draw);
        const h = (p.h ?? 160) * Math.min(1, t * 1.4);
        const txt = assertAllowed(labelCase(p.label), "RadiiRuler pin");
        const w = txt.length * 12.6 + 28;
        const a = sm((t - 0.6) / 0.4);
        return (
          <g key={"p" + i}>
            <circle cx={xx} cy={y} r={8} fill={C.saffron} />
            <line x1={xx} y1={y} x2={xx} y2={y - h} stroke={C.saffron} strokeWidth={3} />
            {a > 0 ? (
              <g opacity={a}>
                <rect x={xx - w / 2} y={y - h - 40} width={w} height={36} rx={18} fill={alpha(C.indigo, 0.8)} stroke={C.saffron} strokeWidth={2} />
                <text x={xx} y={y - h - 15} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 19, letterSpacing: 2, fill: C.saffronCore }}>
                  {txt}
                </text>
              </g>
            ) : null}
          </g>
        );
      })}
    </g>
  );
};
