// A simple 2-D camera and soft-parallax layers for illustrated scenes.
// World coordinates are 1920x1080 "design pixels" with the camera's default view centred on (960, 540).
// <Stage> owns one SVG; every <Layer> inside reads the camera and applies it scaled by its depth, so a
// pan or push-in moves the foreground more than the background (parallax) with no per-scene maths.
import React, { createContext, useContext, useId } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Theme } from "./palette";
import { PaperGrain } from "./texture";
import { LightDefs } from "./light";

export type Cam = { x: number; y: number; zoom: number };
export const REST: Cam = { x: 960, y: 540, zoom: 1 };
const CamCtx = createContext<Cam>(REST);

export type CamKey = Cam & { f: number };
/**
 * Camera path through keyframes. Position eases in/out; zoom is interpolated in log space, so a
 * zoom from 1 to 1000 spends equal time on each power of ten (the "zoom out by a decade" move).
 */
export const cameraAt = (frame: number, keys: CamKey[]): Cam => {
  if (keys.length === 1 || frame <= keys[0].f) return keys[0];
  const last = keys[keys.length - 1];
  if (frame >= last.f) return last;
  const i = keys.findIndex((k, j) => j < keys.length - 1 && frame >= k.f && frame < keys[j + 1].f);
  const a = keys[i];
  const b = keys[i + 1];
  const t = interpolate(frame, [a.f, b.f], [0, 1], { easing: Easing.inOut(Easing.cubic) });
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    zoom: Math.exp(Math.log(a.zoom) + (Math.log(b.zoom) - Math.log(a.zoom)) * t),
  };
};

export type Drift = { zoom?: number; panX?: number; panY?: number; frames?: number; seed?: number; from?: Cam };
/**
 * Default camera drift (kit v2.1, study item 1: "the camera never rests"): a slow push from `from` to zoom × `zoom`
 * with a pan of `panX`/`panY` × frame width/height over `frames` frames, eased at both ends. The pan direction
 * alternates with `seed`, so consecutive shots do not all drift the same way. A shot with no explicit camera path gets
 * this automatically from <Stage>; pass `drift={false}` for a deliberately locked frame (chapter cards, insets).
 */
export const driftCam = (frame: number, d: Drift = {}): Cam => {
  // defaults measured against the craft probe (v2.1 round 1: a 6 % push over 8 s did not register at 192×108):
  // ~1.5 %/s of zoom and ~1.2 %/s of pan is the slowest camera the probe still sees as "alive".
  // The drift NEVER stops: it eases in over the first 20 frames, then runs linearly (the zoom is capped at 2× its
  // per-`frames` amount so a long hold does not run away). `frame` must be the SHOT's frame (Stage shotFrame), not the
  // composition's, or a shot that starts late is born with its drift already finished (v2.1 round 2 lesson).
  const { zoom = 1.12, panX = 0.1, panY = 0.03, frames = 240, seed = 1, from = REST } = d;
  const f = Math.max(0, frame);
  const easeIn = f < 20 ? (f / 20) * (f / 20) * (3 - 2 * (f / 20)) : 1;
  const lin = f / frames;
  const e = (f < 20 ? easeIn * lin : lin) ;
  const ez = Math.min(2, e);
  const dir = seed % 2 === 0 ? -1 : 1;
  return {
    x: from.x + dir * panX * 1920 * e,
    y: from.y + (seed % 3 === 0 ? -1 : 1) * panY * 1080 * ez,
    zoom: Math.exp(Math.log(from.zoom) + Math.log(zoom) * ez),
  };
};

/**
 * One full-frame scene: flat base colour, one SVG with the camera, one soft vignette (the only ramp allowed), and the
 * paper/grain print texture on top (`grain` = strength multiplier, 0 = off). Without `cam`, the camera drifts
 * (`drift`, see driftCam) so no shot is ever still.
 */
export const Stage: React.FC<{
  theme: Theme;
  cam?: Cam;
  drift?: Drift | false;
  /** the shot's own frame (0 at the shot's first frame) for the default drift; defaults to the composition frame */
  shotFrame?: number;
  vignette?: number;
  grain?: number;
  grainStep?: number;
  children: React.ReactNode;
  overlay?: React.ReactNode;
}> = ({ theme, cam: camProp, drift, shotFrame, vignette = 0.16, grain = 1, grainStep = 0, children, overlay }) => {
  const frame = useCurrentFrame();
  const cam = camProp ?? (drift === false ? REST : driftCam(shotFrame ?? frame, drift ?? {}));
  return (
  <AbsoluteFill style={{ background: theme.bg }}>
    <CamCtx.Provider value={cam}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <LightDefs />
        {children}
      </svg>
    </CamCtx.Provider>
    {vignette > 0 ? (
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 75% 70% at 50% 48%, rgba(0,0,0,0) 62%, rgba(${theme.dark ? "0,0,0" : "60,45,25"},${vignette}) 100%)`,
          pointerEvents: "none",
        }}
      />
    ) : null}
    {overlay}
    {grain > 0 ? <PaperGrain frame={frame} dark={theme.dark} amount={grain} step={grainStep} /> : null}
  </AbsoluteFill>
  );
};

/**
 * A parallax layer. depth 1 = moves exactly with the camera (the subject plane); 0.3 = far background
 * (moves 30 %); 1.3 = foreground (overshoots); 0 = screen-locked HUD (gauge, labels).
 * `haze` (kit v2) washes the whole layer toward a colour: atmospheric depth for far planes
 * ({ color: family.haze, amount: 0.15-0.5 }, more the farther the plane).
 */
export const Layer: React.FC<{ depth?: number; children: React.ReactNode; opacity?: number; haze?: { color: string; amount: number } }> = ({ depth = 1, children, opacity = 1, haze }) => {
  const cam = useContext(CamCtx);
  const hazeId = "haze" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const z = Math.pow(cam.zoom, depth);
  const dx = (cam.x - 960) * depth;
  const dy = (cam.y - 540) * depth;
  const hz = haze && haze.amount > 0;
  return (
    <g opacity={opacity} transform={`translate(960 540) scale(${z}) translate(${-960 - dx} ${-540 - dy})`}>
      {hz ? (
        // tint only where this layer has pixels: flood the haze colour, keep it inside the layer's alpha, merge on top
        <filter id={hazeId} x="-5%" y="-5%" width="110%" height="110%">
          <feFlood floodColor={haze.color} floodOpacity={haze.amount} result="h" />
          <feComposite in="h" in2="SourceAlpha" operator="in" result="hin" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="hin" />
          </feMerge>
        </filter>
      ) : null}
      {hz ? <g filter={`url(#${hazeId})`}>{children}</g> : children}
    </g>
  );
};

export const useCam = () => useContext(CamCtx);
