// A simple 2-D camera and soft-parallax layers for illustrated scenes.
// World coordinates are 1920x1080 "design pixels" with the camera's default view centred on (960, 540).
// <Stage> owns one SVG; every <Layer> inside reads the camera and applies it scaled by its depth, so a
// pan or push-in moves the foreground more than the background (parallax) with no per-scene maths.
import React, { createContext, useContext } from "react";
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

/**
 * One full-frame scene: flat base colour, one SVG with the camera, one soft vignette (the only ramp allowed), and the
 * paper/grain print texture on top (`grain` = strength multiplier, 0 = off).
 */
export const Stage: React.FC<{ theme: Theme; cam?: Cam; vignette?: number; grain?: number; grainStep?: number; children: React.ReactNode; overlay?: React.ReactNode }> = ({
  theme,
  cam = REST,
  vignette = 0.16,
  grain = 1,
  grainStep = 0,
  children,
  overlay,
}) => {
  const frame = useCurrentFrame();
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
  const z = Math.pow(cam.zoom, depth);
  const dx = (cam.x - 960) * depth;
  const dy = (cam.y - 540) * depth;
  return (
    <g opacity={opacity} transform={`translate(960 540) scale(${z}) translate(${-960 - dx} ${-540 - dy})`}>
      {children}
      {haze && haze.amount > 0 ? <rect x={-6000} y={-6000} width={14000} height={14000} fill={haze.color} opacity={haze.amount} style={{ mixBlendMode: "normal" }} /> : null}
    </g>
  );
};

export const useCam = () => useContext(CamCtx);
