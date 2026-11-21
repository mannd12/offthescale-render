// ST02 thumbnail (package.md): "SAME SECOND" (second word lime) + one cream toilet split down the middle into two
// states: left quiet (full tank, still water), right flushing (tank draining, lime swirl in the bowl). A pressure gauge
// top-right with its needle in the red, and the measured 761,719 under it. Faint New York map bottom-left. Moss night.
// Drawn in 1920×1080 units, delivered at 1280×720. At 168 px wide the toilet, the gauge and "SAME" must read.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Bloom, LightDefs, Sky } from "../../lib/illustrated/light";
import { Stars } from "../../lib/illustrated/ambient";
import { CHALK, INK, LIME, ST_FONT, SUPPOSE } from "../../lib/suppose/palette";
import { loadSupposeFonts } from "../../lib/suppose/fonts";
import { Toilet } from "./acts/cold-parts";
import { Gauge } from "./acts/l02-parts";
import { NYCMap } from "./acts/l04-parts";

const swirl = (cx: number, cy: number, r: number, turns: number) => {
  const pts: string[] = [];
  const n = 90;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = t * turns * Math.PI * 2;
    const rr = r * (1 - t * 0.85);
    pts.push(`${i ? "L" : "M"} ${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr * 0.42).toFixed(1)}`);
  }
  return pts.join(" ");
};

export const STThumbST02: React.FC<{ word?: string; word2?: string; label?: string; sub?: string }> = ({
  word = "SAME",
  word2 = "SECOND",
  label = "761,719",
  sub = "FLUSHES IN 15 MIN · NYC",
}) => {
  loadSupposeFonts();
  const fam = SUPPOSE.moss;
  const T = { x: 960, y: 1010, s: 2.35 };
  const split = T.x - 20 * T.s; // through the tank, so both halves of the tank show their water
  const bowl = { x: T.x + 22 * T.s, y: T.y - 150 * T.s }; // bowl rim, local (22, -150)
  const g = { x: 1660, y: 420, r: 150 };
  return (
    <AbsoluteFill style={{ background: fam.sky[0] }}>
      <svg width={1280} height={720} viewBox="0 0 1920 1080">
        <LightDefs />
        <defs>
          <clipPath id="st02-left"><rect x={0} y={0} width={split} height={1080} /></clipPath>
          <clipPath id="st02-right"><rect x={split} y={0} width={1920 - split} height={1080} /></clipPath>
        </defs>
        <Sky family={fam} x={0} y={0} w={1920} h={1080} />
        <rect x={0} y={0} width={1920} height={1080} fill={INK} opacity={0.35} />
        <Stars frame={20} n={90} w={1920} h={1080} color={fam.light} seed={7} size={2} />
        <NYCMap x={-60} y={600} s={0.45} fam="moss" opacity={0.4} />
        {/* floor */}
        <rect x={0} y={T.y} width={1920} height={1080 - T.y} fill={INK} opacity={0.5} />
        {/* left half: quiet, tank full, water still */}
        <g clipPath="url(#st02-left)">
          <Toilet x={T.x} y={T.y} s={T.s} level={0.92} frame={0} slosh={0} />
        </g>
        {/* right half: flushing, tank draining, handle down */}
        <g clipPath="url(#st02-right)">
          <Toilet x={T.x} y={T.y} s={T.s} level={0.22} frame={12} slosh={9} handle={1} flash={0.15} />
          <Bloom x={bowl.x + 60} y={bowl.y + 30} r={230} color={LIME} strength={0.45} spread={0.7} />
          <path d={swirl(bowl.x + 40, bowl.y + 26, 150, 2.4)} stroke={LIME} strokeWidth={13} fill="none" strokeLinecap="round" />
        </g>
        {/* the split line */}
        <path d={`M ${split} ${T.y - 312 * T.s} V ${T.y + 6}`} stroke={CHALK} strokeWidth={5} strokeDasharray="18 14" opacity={0.75} />
        {/* gauge, needle in the red */}
        <Gauge cx={g.x} cy={g.y} r={g.r} angle={108} danger={0.75} />
        <text x={g.x} y={g.y + g.r + 120} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={Math.min(108, 480 / (label.length * 0.6))} fill={CHALK} stroke={INK} strokeWidth={9} paintOrder="stroke">{label}</text>
        <text x={g.x} y={g.y + g.r + 172} textAnchor="middle" fontFamily={ST_FONT} fontWeight={800} fontSize={34} letterSpacing={2} fill={CHALK} opacity={0.85}>{sub}</text>
        {/* the words */}
        <text x={64} y={215} fontFamily={ST_FONT} fontWeight={900} fontSize={190} fill={CHALK} stroke={INK} strokeWidth={11} paintOrder="stroke">
          {word} <tspan fill={LIME}>{word2}</tspan>
        </text>
      </svg>
    </AbsoluteFill>
  );
};
export const STThumbST02B: React.FC = () => <STThumbST02 word="WHOLE" word2="CITY" label="8.8 MILLION" sub="PEOPLE · ONE CITY" />;
