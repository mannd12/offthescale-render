// ST01 thumbnail (package.md): two states + one number. Left our small Earth "1×", right a huge Earth "2×" with a thin,
// tight glowing air band; "8× HEAVIER" in lime; Lev tiny at the bottom straining on the lever. Moss night.
// Drawn in 1920×1080 units, delivered at 1280×720. At 168 px wide only the two globes and "8×" must read.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Bloom, LightDefs, Sky } from "../illustrated/light";
import { Stars } from "../illustrated/ambient";
import { Earth } from "./frames";
import { Lev } from "./lev";
import { Lever, leverTip } from "./devices";
import { AIR, CHALK, INK, LIME, ST_FONT, SUPPOSE } from "./palette";
import { loadSupposeFonts } from "./fonts";

export const STThumbST01: React.FC<{ text?: string }> = ({ text = "8× HEAVIER" }) => {
  loadSupposeFonts();
  const fam = SUPPOSE.moss;
  const big = { x: 1330, y: 610, r: 460 };
  const small = { x: 330, y: 610, r: 230 }; // exactly half the width: the label says 2×
  const ground = 1040;
  const pivot: [number, number] = [790, ground];
  const tip = leverTip(pivot[0], pivot[1], 150, -36);
  const levH = 130, s = levH / 170;
  const hand: [number, number] = [46, (tip[1] - ground) / s];
  const [word, ...rest] = text.split(" ");
  return (
    <AbsoluteFill style={{ background: fam.sky[0] }}>
      <svg width={1280} height={720} viewBox="0 0 1920 1080">
        <LightDefs />
        <Sky family={fam} x={0} y={0} w={1920} h={1080} />
        <Stars frame={20} n={140} w={1920} h={1080} color={fam.light} seed={3} size={2.2} />
        {/* the big one: tight bright air band */}
        <Bloom x={big.x} y={big.y} r={big.r * 1.22} color={AIR} strength={0.55} spread={0.75} />
        <Earth cx={big.x} cy={big.y} r={big.r} seed={4} />
        <circle cx={big.x} cy={big.y} r={big.r + 9} fill="none" stroke={AIR} strokeWidth={14} opacity={0.75} />
        {/* our one */}
        <Earth cx={small.x} cy={small.y} r={small.r} seed={3} />
        {/* size labels */}
        <text x={small.x - 20} y={small.y + 45} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={130} fill={CHALK} stroke={INK} strokeWidth={8} paintOrder="stroke">1×</text>
        <text x={big.x - 30} y={big.y + 75} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={230} fill={CHALK} stroke={INK} strokeWidth={10} paintOrder="stroke">2×</text>
        {/* the number */}
        <text x={60} y={170} fontFamily={ST_FONT} fontWeight={900} fontSize={170} fill={LIME} stroke={INK} strokeWidth={10} paintOrder="stroke">
          {word} <tspan fill={CHALK}>{rest.join(" ")}</tspan>
        </text>
        {/* Lev on the lever, small, bottom-left */}
        <Lever x={pivot[0]} y={pivot[1]} len={150} angle={-36} plate="SIZE ×2" scale={1} glow={0.4} />
        <Lev x={tip[0] - hand[0] * s} y={ground - 4} h={levH} frame={30} pose="pull" hands={{ front: hand, back: [hand[0] - 10, hand[1] + 10] }} lean={-12} eyes="squint" wind={0.9} shade="#9FB7A6" />
      </svg>
    </AbsoluteFill>
  );
};
export const STThumbST01B: React.FC = () => <STThumbST01 text="2× GRAVITY" />;
