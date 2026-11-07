// Kit v2 lighting (docs/STYLE-V2.md §2). Every scene has ONE light source with a direction and a colour (from its
// Family). Forms get a soft inner shadow on the side away from it and a rim light on the side toward it; light sources
// get a bloom; far planes sink into haze. All procedural SVG: radial gradients where possible (cheap, deterministic),
// Gaussian blur only for soft shadows and rims (small areas). Blur filters are defined once per Stage by <LightDefs>.
import React, { useId } from "react";
import { Family, alpha } from "./palette2";

/** Blur filters shared by every lit form in the SVG. Stage renders this once; standalone SVGs must include it. */
export const LightDefs: React.FC = () => (
  <defs>
    {[2, 4, 8, 16, 32].map((s) => (
      <filter key={s} id={`soft-${s}`} x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation={s} />
      </filter>
    ))}
  </defs>
);

/** Normalised light vector pointing TOWARD the light, from an angle in degrees (0 = right, 90 = down, 225 = upper left). */
export const lightVec = (deg: number): [number, number] => [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)];
/** The channel default: a low light from the upper left. Scenes with a visible source override it (sun, magma, moon). */
export const KEY_LIGHT = 225;

const safeId = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, "");

/** Full-frame (or boxed) vertical gradient from a family's sky stops, or custom stops. */
export const Sky: React.FC<{ family?: Family; stops?: string[]; x?: number; y?: number; w?: number; h?: number; angle?: number; opacity?: number }> = ({
  family,
  stops,
  x = -400,
  y = -400,
  w = 2720,
  h = 1880,
  angle = 90,
  opacity = 1,
}) => {
  const id = "sky" + safeId(useId());
  const s = stops ?? family?.sky ?? ["#000", "#333"];
  const rad = (angle * Math.PI) / 180;
  const dx = Math.cos(rad) * 0.5;
  const dy = Math.sin(rad) * 0.5;
  return (
    <g>
      <defs>
        <linearGradient id={id} x1={0.5 - dx} y1={0.5 - dy} x2={0.5 + dx} y2={0.5 + dy}>
          {s.map((c, i) => (
            <stop key={i} offset={s.length === 1 ? 0 : i / (s.length - 1)} stopColor={c} />
          ))}
        </linearGradient>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id})`} opacity={opacity} />
    </g>
  );
};

/**
 * Bloom around a light source: a radial falloff (no blur filter) plus an optional hot core disc.
 * `strength` scales the alpha; `spread` (0.2-0.6) is where the glow has faded to ~1/3.
 */
export const Bloom: React.FC<{ x: number; y: number; r: number; color: string; core?: number; coreColor?: string; strength?: number; spread?: number; squash?: number }> = ({
  x,
  y,
  r,
  color,
  core = 0,
  coreColor,
  strength = 1,
  spread = 0.35,
  squash = 1,
}) => {
  const id = "bloom" + safeId(useId());
  return (
    <g>
      <defs>
        <radialGradient id={id} cx="50%" cy="50%" r="50%">
          <stop offset={0} stopColor={color} stopOpacity={0.85 * strength} />
          <stop offset={spread} stopColor={color} stopOpacity={0.32 * strength} />
          <stop offset={0.72} stopColor={color} stopOpacity={0.08 * strength} />
          <stop offset={1} stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={x} cy={y} rx={r} ry={r * squash} fill={`url(#${id})`} />
      {core > 0 ? <circle cx={x} cy={y} r={core} fill={coreColor ?? color} /> : null}
    </g>
  );
};

/**
 * A lit form: fill + soft inner shadow on the side away from the light + rim light on the side toward it, both
 * clipped inside the shape. `light` = degrees toward the light (see lightVec). Pass `rim={false}` / `shadow={false}`
 * to drop either. `inset` is the shadow depth in px, `rimWidth` the rim thickness.
 */
export const Form: React.FC<{
  d: string;
  fill: string;
  light?: number;
  shadow?: string | false;
  shadowOpacity?: number;
  inset?: number;
  rim?: string | false;
  rimWidth?: number;
  rimOpacity?: number;
  /** optional flat shade band (hard two-tone) instead of a blurred one */
  hard?: boolean;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  children?: React.ReactNode;
}> = ({ d, fill, light = KEY_LIGHT, shadow, shadowOpacity = 0.5, inset = 14, rim, rimWidth = 3, rimOpacity = 0.75, hard = false, stroke, strokeWidth = 1.5, opacity = 1, children }) => {
  const id = "form" + safeId(useId());
  const [lx, ly] = lightVec(light);
  const blur = hard ? undefined : `url(#soft-${inset >= 24 ? 16 : inset >= 10 ? 8 : 4})`;
  return (
    <g opacity={opacity}>
      <clipPath id={id}>
        <path d={d} />
      </clipPath>
      <path d={d} fill={fill} />
      <g clipPath={`url(#${id})`}>
        {shadow ? (
          <path
            d={d}
            fill="none"
            stroke={shadow}
            strokeWidth={inset * 2}
            strokeLinejoin="round"
            transform={`translate(${(-lx * inset * 0.9).toFixed(1)} ${(-ly * inset * 0.9).toFixed(1)})`}
            filter={blur}
            opacity={shadowOpacity}
          />
        ) : null}
        {rim ? (
          <path
            d={d}
            fill="none"
            stroke={rim}
            strokeWidth={rimWidth * 2}
            strokeLinejoin="round"
            transform={`translate(${(lx * rimWidth * 1.1).toFixed(1)} ${(ly * rimWidth * 1.1).toFixed(1)})`}
            filter={hard ? undefined : "url(#soft-2)"}
            opacity={rimOpacity}
          />
        ) : null}
        {children}
      </g>
      {stroke ? <path d={d} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" /> : null}
    </g>
  );
};

/**
 * Facet shading for a ridge / skyline: every segment of `pts` whose outward (upward) normal faces away from the light
 * casts a soft shadow polygon down to `base`. Put it inside a Form's children (so it is clipped to the silhouette):
 * the flank away from the sun darkens as a whole, the lit flank stays the fill colour. Round 1 of the v2 frames
 * showed that an inner-shadow band alone leaves a big mountain reading flat.
 */
export const Facets: React.FC<{ pts: [number, number][]; base: number; light?: number; fill: string; opacity?: number; soft?: boolean }> = ({ pts, base, light = KEY_LIGHT, fill, opacity = 0.4, soft = true }) => {
  const [lx, ly] = lightVec(light);
  const out: { d: string; o: number }[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i];
    const [bx, by] = pts[i + 1];
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.hypot(dx, dy) || 1;
    // upward normal of the segment (screen y is down)
    let nx = dy / len;
    let ny = -dx / len;
    if (ny > 0) {
      nx = -nx;
      ny = -ny;
    }
    const facing = nx * lx + ny * ly; // > 0 faces the light
    if (facing < 0.05) out.push({ d: `M${ax} ${ay} L${bx} ${by} L${bx} ${base} L${ax} ${base} Z`, o: Math.min(1, 0.35 - facing) });
  }
  return (
    <g filter={soft ? "url(#soft-16)" : undefined} fill={fill}>
      {out.map((f, i) => (
        <path key={i} d={f.d} opacity={f.o * opacity} />
      ))}
    </g>
  );
};

/** Soft ground-contact shadow under a prop (a blurred ellipse). */
export const GroundShadow: React.FC<{ x: number; y: number; rx: number; ry?: number; color?: string; opacity?: number; blur?: 4 | 8 | 16 }> = ({
  x,
  y,
  rx,
  ry,
  color = "#000",
  opacity = 0.28,
  blur = 8,
}) => <ellipse cx={x} cy={y} rx={rx} ry={ry ?? rx * 0.28} fill={color} opacity={opacity} filter={`url(#soft-${blur})`} />;

/** A cone of light (headlamp, lighthouse, window spill): a polygon fading along its axis. */
export const LightCone: React.FC<{ x: number; y: number; angle: number; length: number; spread?: number; color: string; strength?: number }> = ({
  x,
  y,
  angle,
  length,
  spread = 22,
  color,
  strength = 0.5,
}) => {
  const id = "cone" + safeId(useId());
  const a = (angle * Math.PI) / 180;
  const s = (spread * Math.PI) / 180;
  const ex = x + Math.cos(a) * length;
  const ey = y + Math.sin(a) * length;
  const p1 = [x + Math.cos(a - s) * length, y + Math.sin(a - s) * length];
  const p2 = [x + Math.cos(a + s) * length, y + Math.sin(a + s) * length];
  return (
    <g>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={x} y1={y} x2={ex} y2={ey}>
          <stop offset={0} stopColor={color} stopOpacity={strength} />
          <stop offset={0.55} stopColor={color} stopOpacity={strength * 0.3} />
          <stop offset={1} stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={`M${x} ${y} L${p1[0].toFixed(1)} ${p1[1].toFixed(1)} L${p2[0].toFixed(1)} ${p2[1].toFixed(1)} Z`} fill={`url(#${id})`} />
    </g>
  );
};

/** Atmospheric haze band: a horizontal gradient wash from transparent (top) to the haze colour (bottom), for horizons. */
export const HazeBand: React.FC<{ y: number; h: number; color: string; strength?: number; x?: number; w?: number; up?: boolean }> = ({
  y,
  h,
  color,
  strength = 0.5,
  x = -400,
  w = 2720,
  up = false,
}) => {
  const id = "haze" + safeId(useId());
  return (
    <g>
      <defs>
        <linearGradient id={id} x1={0} y1={up ? 1 : 0} x2={0} y2={up ? 0 : 1}>
          <stop offset={0} stopColor={color} stopOpacity={0} />
          <stop offset={1} stopColor={color} stopOpacity={strength} />
        </linearGradient>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id})`} />
    </g>
  );
};

/** Hot-spot wash: light falling on a surface (radial, elliptical), e.g. magma light on a cave wall, lamp on the ground. */
export const LightWash: React.FC<{ x: number; y: number; rx: number; ry: number; color: string; strength?: number }> = ({ x, y, rx, ry, color, strength = 0.4 }) => {
  const id = "wash" + safeId(useId());
  return (
    <g>
      <defs>
        <radialGradient id={id} cx="50%" cy="50%" r="50%">
          <stop offset={0} stopColor={color} stopOpacity={strength} />
          <stop offset={0.6} stopColor={color} stopOpacity={strength * 0.25} />
          <stop offset={1} stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={`url(#${id})`} />
    </g>
  );
};

/** Darkening at the edges of a scene (SVG-side vignette, so it can live under HUD layers). */
export const Vignette: React.FC<{ color?: string; strength?: number }> = ({ color = "#000", strength = 0.35 }) => {
  const id = "vig" + safeId(useId());
  return (
    <g>
      <defs>
        <radialGradient id={id} cx="50%" cy="48%" r="68%">
          <stop offset={0.55} stopColor={color} stopOpacity={0} />
          <stop offset={1} stopColor={color} stopOpacity={strength} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${id})`} />
    </g>
  );
};

/** rgba helper re-exported for scene code */
export { alpha };
