// Vertical-Short helpers for the illustrated look (L11 Shorts S41-S45). Lives in S41's folder because each builder may
// only write inside its own Shorts' folders (same arrangement as S07/shortKit). Brand/layout helpers only: every
// Short's shots are its own drawings. 1080x1920 canvas; captions in the bottom third (y 1290-1590) from shortKit.
import React, { useId } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SceneTiming, buildTimeline, lineAt } from "../../lib/timeline";
import { Captions, ShortFrame } from "../S07-deep-anglerfish/shortKit";
import { Bloom, HaloText, IF2, LightDefs, Sky, lane, rnd, smoothPath } from "../../lib/illustrated";
import { loadBrandFonts } from "../../brand/fonts";

loadBrandFonts();

export const W = 1080;
export const H = 1920;
export type ShotCtx = { f: number; n: number; p: number };
export type Shot = (c: ShotCtx) => React.ReactNode;

/** Palette used across the five L11 Shorts (family colours from palette2, plus the brand signals). */
export const C = {
  ink: "#06222B",
  deep: "#0A3C4C",
  petrol: "#11707A",
  teal: "#1FA69A",
  mint: "#66BEAD",
  sea: "#2A8FC4",
  sky: "#4FB5DE",
  ice: "#9BD6E8",
  foam: "#E6F8FF",
  cream: "#FFF4DE",
  gold: "#FFCF73",
  amber: "#FFC83D",
  apricot: "#F6B45A",
  orange: "#E3813F",
  rust: "#B04A18",
  brick: "#7A3418",
  maroon: "#4A140C",
  verm: "#E4572E",
  green: "#3FBF8A",
};

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const ramp = (f: number, a: number, b: number) => clamp((f - a) / Math.max(1, b - a));
export const ez = (f: number, a: number, b: number) => {
  const x = ramp(f, a, b);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * The Short body: line i's span (from its start to the next line's start; the last line to the end) is divided equally
 * among that line's shots, so the cut rhythm follows the voice. Every cut gets a scale pop and a brief light flash.
 */
export const makeShort = (timeline: ReturnType<typeof buildTimeline>, lines: Shot[][], scrim = true) => {
  const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
    const frame = useCurrentFrame();
    if (lines.length !== t.lines.length) throw new Error(`shots: ${lines.length} lines of shots for ${t.lines.length} voice lines`);
    let i = 0;
    for (let k = 0; k < t.lines.length; k++) if (frame >= lineAt(t, k)) i = k;
    const start = i === 0 ? 0 : lineAt(t, i);
    const end = i + 1 < t.lines.length ? lineAt(t, i + 1) : t.frames;
    const shots = lines[i];
    const seg = (end - start) / shots.length;
    const k = clamp(Math.floor((frame - start) / seg), 0, shots.length - 1);
    const s0 = Math.round(start + k * seg);
    const n = Math.round(start + (k + 1) * seg) - s0;
    const f = frame - s0;
    const pop = 1 + 0.045 * Math.pow(Math.max(0, 1 - f / 9), 2) + f * 0.0002;
    return (
      <AbsoluteFill style={{ backgroundColor: C.ink }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
          <LightDefs />
          <g transform={`translate(540 800) scale(${pop}) translate(-540 -800)`}>{/* a component (not a plain call), keyed per shot: shots may use hooks such as useId (React error 310 otherwise) */}
            {React.createElement(shots[k] as React.FC<{ f: number; n: number; p: number }>, { key: `${i}-${k}`, f, n, p: f / n })}</g>
        </svg>
        <AbsoluteFill style={{ background: `rgba(255,248,230,${0.32 * Math.max(0, 1 - f / 4)})`, pointerEvents: "none" }} />
        {scrim ? <div style={{ position: "absolute", left: 0, right: 0, top: 1180, bottom: 0, background: "linear-gradient(rgba(4,28,38,0), rgba(4,28,38,0.7) 28%, rgba(4,28,38,0.78))" }} /> : null}
        <Captions t={t} />
      </AbsoluteFill>
    );
  };
  return () => <ShortFrame timeline={timeline} Body={Body} />;
};

// ------------------------------------------------------------------------------------------------------------------
// drawing helpers
// ------------------------------------------------------------------------------------------------------------------
export const Backdrop: React.FC<{ stops: string[] }> = ({ stops }) => <Sky stops={stops} x={0} y={0} w={W} h={H} />;

/** Heavy display text with a dark halo (Outfit 800): legible over any saturated field at phone size. */
export const T: React.FC<{ x: number; y: number; text: string; size?: number; color?: string; halo?: string; align?: "start" | "middle" | "end"; opacity?: number; upper?: boolean; spacing?: number }> = ({ x, y, text, size = 72, color = C.cream, halo = C.ink, align = "middle", opacity = 1, upper = true, spacing = 1 }) => (
  <g opacity={opacity}>
    <HaloText x={x} y={y} text={text} color={color} halo={halo} size={size} font={IF2.display} weight={800} align={align} spacing={spacing} upper={upper} />
  </g>
);

/** A solid rounded plaque with centred text: numbers on a field that never fights the picture. */
export const Plaque: React.FC<{ x: number; y: number; text: string; size?: number; bg?: string; fg?: string; opacity?: number; w?: number; rot?: number; scale?: number }> = ({ x, y, text, size = 64, bg = C.ink, fg = C.amber, opacity = 1, w, rot = 0, scale = 1 }) => {
  const ww = w ?? text.length * size * 0.6 + size * 0.9;
  const hh = size * 1.5;
  return (
    <g opacity={opacity} transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`}>
      <rect x={-ww / 2} y={-hh / 2} width={ww} height={hh} rx={hh * 0.28} fill={bg} />
      <text x={0} y={size * 0.36} textAnchor="middle" style={{ fontFamily: IF2.display, fontWeight: 800, fontSize: size, fill: fg, letterSpacing: 1 }}>
        {text}
      </text>
    </g>
  );
};

/** Wavy-edged horizontal rock bands scrolling UP (the view descending): defined edges, so the motion reads at 96x54. */
export const Strata: React.FC<{ f: number; speed: number; bands: [number, string][]; x0?: number; x1?: number; y0?: number; y1?: number; amp?: number; seed?: number }> = ({ f, speed, bands, x0 = -40, x1 = W + 40, y0 = 0, y1 = H, amp = 16, seed = 1 }) => {
  const id = "st" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const P = bands.reduce((s, b) => s + b[0], 0);
  const off = (((f * speed) % P) + P) % P;
  const out: React.ReactNode[] = [];
  let y = y0 - off;
  let k = 0;
  while (y < y1 + 60) {
    const [h, col] = bands[k % bands.length];
    const pts: [number, number][] = [];
    for (let x = x0; x <= x1 + 60; x += 120) pts.push([x, y + Math.sin(x / 140 + (k % bands.length) * 1.9 + seed) * amp + Math.sin(x / 53 + k * 1.3) * amp * 0.35]);
    out.push(<path key={k} d={`${smoothPath(pts)} L${x1 + 60} ${y + h + amp * 2} L${x0} ${y + h + amp * 2} Z`} fill={col} />);
    y += h;
    k++;
  }
  return (
    <g>
      <clipPath id={id}>
        <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} />
      </clipPath>
      <g clipPath={`url(#${id})`}>{out}</g>
    </g>
  );
};

/** Dust / rock-chip streamers across a box (defined strokes, 2-4 px per frame). */
export const Chips: React.FC<{ f: number; n?: number; y0?: number; y1?: number; color?: string; speed?: number; dir?: 1 | -1; seed?: number; len?: number; width?: number; opacity?: number }> = ({ f, n = 14, y0 = 0, y1 = H, color = C.foam, speed = 9, dir = 1, seed = 3, len = 160, width = 10, opacity = 0.55 }) => (
  <g>
    {lane(f, n, -240, W + 240, speed, seed, dir).map((p, i) => {
      const y = y0 + rnd(seed * 31 + i) * (y1 - y0);
      const L = len * (0.5 + rnd(seed * 7 + i));
      return <rect key={i} x={p.x - L / 2} y={y} width={L} height={width * (0.6 + rnd(i + seed) * 0.9)} rx={width} fill={color} opacity={opacity * (0.5 + 0.5 * Math.sin(Math.PI * p.phase))} />;
    })}
  </g>
);

/** Vertical streaks (falling or rising), same idea as Chips but along y. */
export const Rain: React.FC<{ f: number; n?: number; x0?: number; x1?: number; color?: string; speed?: number; dir?: 1 | -1; seed?: number; len?: number; width?: number; opacity?: number }> = ({ f, n = 16, x0 = 0, x1 = W, color = C.foam, speed = 14, dir = 1, seed = 5, len = 200, width = 9, opacity = 0.5 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const sp = speed * (0.7 + rnd(seed * 3 + i) * 0.6);
      const y = ((((rnd(seed * 9 + i) * (H + 400) + f * sp * dir) % (H + 400)) + (H + 400)) % (H + 400)) - 200;
      const L = len * (0.5 + rnd(seed * 5 + i));
      return <rect key={i} x={x0 + rnd(seed * 13 + i) * (x1 - x0)} y={y} width={width * (0.6 + rnd(i * 3 + seed))} height={L} rx={width} fill={color} opacity={opacity} />;
    })}
  </g>
);

/** Spinning-light drill rig (derrick): lattice tower, a travelling block that bobs, a beacon. Foot at (x, y); `s` scales. */
export const Derrick: React.FC<{ f: number; x: number; y: number; s?: number; body?: string; lit?: string; on?: boolean; flip?: boolean }> = ({ f, x, y, s = 1, body = C.deep, lit = C.gold, on = true, flip = false }) => {
  const blockY = -250 + (on ? 70 * Math.abs(Math.sin(f / 12)) : 0);
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d="M-70 0 L-18 -420 L18 -420 L70 0 Z" fill={body} />
      {[-120, -200, -280, -350].map((yy, i) => (
        <path key={i} d={`M${-70 + (-yy / 420) * 52} ${yy} L${70 - (-yy / 420) * 52} ${yy + 60} M${70 - (-yy / 420) * 52} ${yy} L${-70 + (-yy / 420) * 52} ${yy + 60}`} stroke={C.teal} strokeWidth={5} />
      ))}
      <rect x={-5} y={-420} width={10} height={blockY + 420} fill={C.cream} opacity={0.8} />
      <rect x={-26} y={blockY} width={52} height={40} rx={8} fill={C.orange} />
      <circle cx={0} cy={-440} r={20 + (on ? 5 * Math.sin(f / 4) : 0)} fill={on ? lit : C.deep} />
      {on ? <circle cx={0} cy={-440} r={46} fill={lit} opacity={0.25 + 0.15 * Math.sin(f / 4)} /> : null}
      <rect x={-120} y={-34} width={90} height={34} rx={10} fill={C.rust} />
      <rect x={60} y={-50} width={110} height={50} rx={10} fill={C.brick} />
    </g>
  );
};

/** A circular bevelled "dinner plate" seen from above (rim ring + well), r in px. */
export const PlateTop: React.FC<{ x: number; y: number; r: number; rot?: number }> = ({ x, y, r, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <circle r={r} fill={C.cream} />
    <circle r={r * 0.9} fill="none" stroke={C.ice} strokeWidth={r * 0.05} />
    <circle r={r * 0.62} fill={C.foam} stroke={C.sky} strokeWidth={r * 0.04} />
    <path d={`M${-r * 0.82} ${-r * 0.2} A${r * 0.85} ${r * 0.85} 0 0 1 ${-r * 0.2} ${-r * 0.82}`} stroke="#FFFFFF" strokeWidth={r * 0.06} fill="none" strokeLinecap="round" />
  </g>
);

/** A soft glow pulse for something hot or switched on. */
export const Glow: React.FC<{ x: number; y: number; r: number; color: string; f: number; strength?: number; period?: number }> = ({ x, y, r, color, f, strength = 0.8, period = 24 }) => (
  <Bloom x={x} y={y} r={r * (1 + 0.1 * Math.sin((f / period) * Math.PI * 2))} color={color} strength={strength * (0.85 + 0.15 * Math.sin((f / period) * Math.PI * 2))} />
);

/** End card: wordmark, the unanswered question, and a bouncing arrow to the full video. `bg` = sky stops. */
export const EndShot: React.FC<{ f: number; stops: string[]; q: string[]; accent?: string; size?: number; children?: React.ReactNode }> = ({ f, stops, q, accent = C.amber, size = 76, children }) => (
  <g>
    <Backdrop stops={stops} />
    <Glow x={540} y={700} r={760} color={C.gold} f={f} strength={0.55} />
    {children}
    <Chips f={f} n={10} y0={160} y1={1180} color={C.gold} speed={7} opacity={0.35} seed={9} />
    <T x={540} y={360} text="OFF THE" size={150} color={C.cream} />
    <T x={540} y={520} text="SCALE" size={170} color={accent} />
    {q.map((l, i) => (
      <T key={i} x={540} y={720 + i * (size + 12)} text={l} size={size} color={C.cream} />
    ))}
    <g transform={`translate(540 ${1000 + 26 * Math.abs(Math.sin(f / 7))})`}>
      <path d="M0 -60 V50 M-50 8 L0 62 L50 8" stroke={accent} strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </g>
);
