// Small drawing helpers shared by the L16 Shorts S66 and S67 (episodes/S66, S67). Their shots are each Short's own
// drawings; this file only holds repeated pieces: a saturated Sun limb (no magenta, no violet), an ember sky, a two-tone
// bar that grows up from a baseline, and the "OUR SUM" chip for our own arithmetic. The probe is L16's own prop.
import React, { useId } from "react";
import { Bloom, Sky } from "../../lib/illustrated";
import { C, Chips, H, T, W, ez, mix } from "../S41-dig-plate/vkit";
import { BG_EMBER } from "../S56-fall-clock/kit56";

export { BG_EMBER };

/** The Sun's limb: a huge disc whose top edge sits at y = top. Gold inside, amber, tangerine, vermilion rim. */
export const SunLimb: React.FC<{ f: number; top?: number; R?: number; cx?: number; glow?: number }> = ({ f, top = 1060, R = 1500, cx = 540, glow = 0.75 }) => {
  const id = "sl" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const cy = top + R;
  return (
    <g>
      <defs>
        <radialGradient id={id} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#FFF3C4" />
          <stop offset="0.8" stopColor="#FFC83D" />
          <stop offset="0.93" stopColor="#F58A1F" />
          <stop offset="1" stopColor="#E4572E" />
        </radialGradient>
      </defs>
      <Bloom x={cx} y={top + 60} r={620 + 24 * Math.sin(f / 11)} color="#FFC83D" strength={glow} />
      <circle cx={cx} cy={cy} r={R} fill={`url(#${id})`} />
      <Chips f={f} n={8} y0={top + 50} y1={Math.min(H, top + 400)} color="#FFF3C4" speed={4} opacity={0.35} seed={11} len={70} width={9} />
    </g>
  );
};

/** Ember sky + the Sun's limb along the bottom, with a few drifting glints higher up. */
export const SunScene: React.FC<{ f: number; top?: number; glints?: boolean }> = ({ f, top = 1060, glints = true }) => (
  <g>
    <Sky stops={BG_EMBER} x={0} y={0} w={W} h={H} />
    {glints ? <Chips f={f} n={10} y0={120} y1={Math.max(300, top - 100)} color={C.gold} speed={4} opacity={0.28} seed={4} len={50} width={6} /> : null}
    <SunLimb f={f} top={top} />
  </g>
);

/** A rounded two-tone bar growing UP from a baseline (centre x, baseline y, height h). */
export const UpBar: React.FC<{ x: number; base: number; w: number; h: number; color?: string }> = ({ x, base, w, h, color = C.amber }) => (
  <g>
    <rect x={x - w / 2} y={base - Math.max(0, h)} width={w} height={Math.max(0, h)} rx={w * 0.28} fill={C.ink} />
    <rect x={x - w * 0.34} y={base - Math.max(0, h) + (h > 24 ? 8 : 0)} width={w * 0.68} height={Math.max(0, h - (h > 24 ? 16 : 0))} rx={w * 0.2} fill={color} />
  </g>
);

/** The mandatory chip on every shot showing a number that is our own arithmetic. */
export const OurSum: React.FC<{ y?: number }> = ({ y = 78 }) => (
  <g>
    <rect x={330} y={y - 40} width={420} height={80} rx={40} fill={C.verm} />
    <T x={540} y={y + 17} text="OUR SUM" size={52} color={C.cream} halo={C.verm} />
  </g>
);

export { ez, mix };
