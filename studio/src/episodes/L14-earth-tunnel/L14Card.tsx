// L14Card: a chapter card that draws a MOVING layer behind its type (the kit ChapterCard paints its own field over
// everything beneath, so it can't). Same type and in/out curve as the kit card: text rises 24 px and fades in over the
// first 18 % of `t`, holds, fades out over the last 15 %; title wrapped at 22 chars, 104 px (84 for 3+ lines).
// Default background mover: LayerRings, concentric strata-coloured rings launched every 40 f that cross the frame at
// ~4.4 px/f (storyboard C-10). Pass `behind` to draw any other moving layer instead (it gets the frame).
import React from "react";
import { Family, IF2, Kicker, Motes, Sky, Stage, Stars, Vignette, alpha } from "../../lib/illustrated";
import { L14_COLORS } from "./families";

const sm = (t: number, a = 0, b = 1) => {
  const u = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return u * u * (3 - 2 * u);
};

/** Concentric strata rings expanding from (cx, cy): one launched every `every` frames, growing at `speed` px/f. */
export const LayerRings: React.FC<{ f: number; cx?: number; cy?: number; every?: number; speed?: number; width?: number; colors?: string[]; maxR?: number; opacity?: number }> = ({
  f,
  cx = 1640,
  cy = 900,
  every = 40,
  speed = 4.4,
  width = 46,
  colors = [L14_COLORS.crust, L14_COLORS.mantle, L14_COLORS.outer, L14_COLORS.inner],
  maxR = 2100,
  opacity = 0.85,
}) => {
  const life = maxR / speed;
  const n = Math.ceil(life / every) + 1;
  const k0 = Math.floor(f / every);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const k = k0 - i;
        const age = f - k * every;
        const r = age * speed;
        if (r <= 0 || r > maxR) return null;
        const c = colors[((k % colors.length) + colors.length) % colors.length];
        const o = opacity * Math.min(1, r / 60) * (1 - Math.max(0, (r - maxR * 0.7) / (maxR * 0.3)));
        return <circle key={k} cx={cx} cy={cy} r={r} fill="none" stroke={c} strokeWidth={width * (0.7 + 0.3 * Math.min(1, r / 400))} opacity={o} />;
      })}
      <circle cx={cx} cy={cy} r={34} fill={L14_COLORS.innerCore} opacity={opacity} />
    </g>
  );
};

export const L14Card: React.FC<{
  family: Family;
  kicker?: string;
  title: string;
  /** 0..1 over the card's life */
  t: number;
  /** the card's own frame (drives the background mover) */
  frame: number;
  sub?: string;
  align?: "start" | "middle";
  /** the moving layer behind the type; default LayerRings */
  behind?: (frame: number) => React.ReactNode;
  /** a scrim behind the type so it reads over the mover (0..1, default 0.45) */
  scrim?: number;
}> = ({ family: F, kicker, title, t, frame, sub, align = "start", behind, scrim = 0.45 }) => {
  const inA = sm(t, 0, 0.18);
  const outA = 1 - sm(t, 0.85, 1);
  const a = inA * outA;
  const rise = (1 - inA) * 24;
  const x = align === "start" ? 160 : 960;
  const words = title.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > 22 && cur) {
      lines.push(cur.trim());
      cur = w;
    } else cur = (cur + " " + w).trim();
  }
  if (cur) lines.push(cur);
  const size = lines.length > 2 ? 84 : 104;
  const y0 = 540 - ((lines.length - 1) * size * 0.98) / 2 + size * 0.35;
  return (
    <Stage theme={F.theme} drift={false} vignette={F.dark ? 0.3 : 0.1} grain={0.4}>
      <Sky family={F} />
      {F.dark ? <Stars frame={frame} n={70} w={1920} h={1080} color={F.text} seed={31} size={1.3} twinkle={0.7} /> : null}
      {behind ? behind(frame) : <LayerRings f={frame} />}
      <Motes frame={frame} n={30} w={1920} h={1080} color={F.light} seed={37} size={3.2} drift={30} />
      <Vignette color={F.shadow} strength={F.dark ? 0.35 : 0.12} />
      {scrim > 0 ? (
        <g opacity={a}>
          <radialGradient id="l14cardScrim" cx="0.3" cy="0.5" r="0.6">
            <stop offset="0" stopColor={F.shadow} stopOpacity={scrim} />
            <stop offset="1" stopColor={F.shadow} stopOpacity={0} />
          </radialGradient>
          <rect x={0} y={0} width={1920} height={1080} fill="url(#l14cardScrim)" />
        </g>
      ) : null}
      <g opacity={a} transform={`translate(0 ${rise.toFixed(2)})`}>
        {kicker ? <Kicker x={x} y={y0 - size * 1.05} text={kicker} color={F.dim} size={24} /> : null}
        {lines.map((l, i) => (
          <text key={i} x={x} y={y0 + i * size * 0.98} textAnchor={align} style={{ fontFamily: IF2.display, fontWeight: 800, fontSize: size, letterSpacing: -size * 0.03, fill: F.text }}>
            {l}
          </text>
        ))}
        <rect x={align === "start" ? x : x - 30} y={y0 + (lines.length - 1) * size * 0.98 + 34} width={60} height={6} rx={3} fill={F.accent} />
        {sub ? (
          <text x={x} y={y0 + (lines.length - 1) * size * 0.98 + 84} textAnchor={align} style={{ fontFamily: IF2.display, fontWeight: 500, fontSize: 30, fill: alpha(F.dim, 1) }}>
            {sub}
          </text>
        ) : null}
      </g>
    </Stage>
  );
};
