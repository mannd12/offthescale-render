// Suppose Then style frames (= ST01 key art, Desktop\What If\episodes\ST01-earth-twice-as-big\storyboard-prep.md §1)
// and channel art (picture 800×800, banner 2560×1440). Stills: `f` is a fixed frame for ambient motion.
import React, { useId } from "react";
import { AbsoluteFill } from "remotion";
import { Stage } from "../illustrated/camera";
import { Bloom, LightDefs, Sky } from "../illustrated/light";
import { Stars } from "../illustrated/ambient";
import { blobPts, smoothPath } from "../illustrated/shapes";
import { rnd } from "../illustrated/motion";
import { AIR, CHALK, INK, LIME, OCEAN, ST_FONT, SUPPOSE, TERRA } from "./palette";
import { Lev } from "./lev";
import { Counter, Flag, Ladder, Lever, leverTip, STPill, Wordmark } from "./devices";

type Pt = [number, number];
const f = 40;
const closed = (pts: Pt[]) => smoothPath([...pts, pts[0], pts[1]]) + " Z";

/** A drawn Earth: lit ocean sphere, sage continents, a few cloud wisps, a terminator, a thin air rim. */
export const Earth: React.FC<{ cx: number; cy: number; r: number; seed?: number }> = ({ cx, cy, r, seed = 3 }) => {
  const id = "earth" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const lands: [number, number, number, number][] = [
    [-0.35, -0.3, 0.32, 1], [0.25, -0.05, 0.38, 2], [-0.15, 0.45, 0.22, 3], [0.45, 0.55, 0.16, 4], [-0.6, 0.2, 0.14, 5],
  ];
  return (
    <g>
      <defs>
        <radialGradient id={`${id}o`} cx="35%" cy="30%" r="75%">
          <stop offset={0} stopColor="#8ED0E2" />
          <stop offset={0.5} stopColor={OCEAN} />
          <stop offset={1} stopColor="#174B5E" />
        </radialGradient>
        <radialGradient id={`${id}t`} cx="20%" cy="18%" r="105%">
          <stop offset={0.55} stopColor="#06120E" stopOpacity={0} />
          <stop offset={1} stopColor="#06120E" stopOpacity={0.72} />
        </radialGradient>
        <clipPath id={`${id}c`}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      <Bloom x={cx} y={cy} r={r * 1.5} color={AIR} strength={0.35} spread={0.6} />
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id}o)`} />
      <g clipPath={`url(#${id}c)`}>
        {lands.map(([dx, dy, rr, s], i) => (
          <path key={i} d={closed(blobPts(cx + dx * r, cy + dy * r, rr * r, 9, seed * 10 + s, 0.32, 0.8))} fill={i % 2 ? "#7FAE72" : "#9BC283"} />
        ))}
        {[[-0.1, -0.55, 0.5], [0.3, 0.3, 0.42], [-0.45, 0.62, 0.3]].map(([dx, dy, w], i) => (
          <path key={i} d={`M ${cx + (dx - w / 2) * r} ${cy + dy * r} q ${w * r * 0.5} ${-r * 0.05} ${w * r} 0`} stroke={CHALK} strokeWidth={r * 0.022} strokeLinecap="round" fill="none" opacity={0.45} />
        ))}
        <circle cx={cx} cy={cy} r={r} fill={`url(#${id}t)`} />
      </g>
      <circle cx={cx} cy={cy} r={r + 3} fill="none" stroke={AIR} strokeWidth={5} opacity={0.6} />
    </g>
  );
};

// ---------------------------------------------------------------- I · the pull (moss)
export const STKeyPull: React.FC = () => {
  const fam = SUPPOSE.moss;
  const ground = 880;
  const pivot: Pt = [1350, ground];
  const tip = leverTip(pivot[0], pivot[1], 240, -38);
  const levH = 210, s = levH / 170;
  const hand: Pt = [48, (tip[1] - ground) / s];
  const levX = tip[0] - hand[0] * s;
  return (
    <Stage theme={fam.theme} drift={false} vignette={0.3}>
      <Sky family={fam} />
      <Stars frame={f} n={220} w={1920} h={1080} color={fam.light} seed={4} />
      {/* Earth grown past its old outline */}
      <Earth cx={700} cy={500} r={330} />
      <circle cx={700} cy={500} r={165} fill="none" stroke={CHALK} strokeWidth={5} strokeDasharray="18 12" opacity={0.95} />
      <text x={700} y={500 + 8} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={30} letterSpacing={3} fill={CHALK}>OUR EARTH</text>
      {/* ledge */}
      <path d={`M 1010 1100 L 1030 ${ground + 20} Q 1040 ${ground - 4} 1080 ${ground - 6} L 1560 ${ground - 10} Q 1610 ${ground - 8} 1620 ${ground + 30} L 1640 1100 Z`} fill={fam.near} />
      <path d={`M 1040 ${ground - 2} Q 1300 ${ground - 16} 1600 ${ground - 6}`} stroke={fam.bounce} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.8} />
      <path d={`M 1060 ${ground + 40} Q 1200 ${ground + 30} 1330 ${ground + 46} M 1180 ${ground + 110} Q 1330 ${ground + 96} 1480 ${ground + 112}`} stroke={fam.mid} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.6} />
      <Lever x={pivot[0]} y={pivot[1]} len={240} angle={-38} plate="SIZE ×2" glow={0.5} />
      <Lev x={levX} y={ground - 4} h={levH} frame={f} pose="pull" hands={{ front: hand, back: [hand[0] - 10, hand[1] + 10] }} lean={-10} eyes="squint" wind={0.9} shade="#9FB7A6" />
      <Ladder x={1800} top={330} bottom={1010} rungs={["×1", "×1.1", "×1.25", "×1.5", "×2", ""]} lit={4} frame={f} />
      <Counter label="SIZE" value="×2" sub="GRAVITY 2.0 g" />
    </Stage>
  );
};

// ---------------------------------------------------------------- II · the climb (clay)
const airDots = (x0: number, x1: number, ground: number, H: number, seed: number) => {
  const out: React.ReactNode[] = [];
  let i = 0;
  for (let y = ground - 6; y > 140; y -= 13) {
    for (let x = x0; x < x1; x += 13) {
      i++;
      const p = Math.exp(-(ground - y) / H);
      if (rnd(seed * 997 + i) < p * 0.85) out.push(<circle key={i} cx={x + (rnd(i * 3 + seed) - 0.5) * 9} cy={y + (rnd(i * 5 + seed) - 0.5) * 9} r={2.6} />);
    }
  }
  return out;
};

export const STKeyAir: React.FC = () => {
  const fam = SUPPOSE.clay;
  const ground = 900;
  const peakY = 330;
  const mtn = (cx: number, w: number, seed: number) =>
    `M ${cx - w} ${ground} C ${cx - w * 0.55} ${ground - 120} ${cx - w * 0.3} ${peakY + 120} ${cx - 30} ${peakY + 14} Q ${cx} ${peakY - 8} ${cx + 34} ${peakY + 20} C ${cx + w * 0.3} ${peakY + 150 + seed} ${cx + w * 0.6} ${ground - 110} ${cx + w} ${ground} Z`;
  return (
    <Stage theme={fam.theme} drift={false} vignette={0.22}>
      <Sky family={fam} />
      <Bloom x={960} y={860} r={620} color={fam.light} strength={0.55} spread={0.5} />
      <path d={smoothPath([[-50, 760], [200, 690], [420, 730], [700, 650], [980, 720], [1250, 660], [1520, 720], [1760, 640], [1980, 700]]) + " L 1980 1100 L -50 1100 Z"} fill={fam.far} opacity={0.75} />
      {/* air: dots thin with height; scale height 8.5 km vs 4.25 km (same vertical scale) */}
      <g fill={AIR} opacity={0.85}>{airDots(120, 900, ground, 547, 1)}</g>
      <g fill={AIR} opacity={0.85}>{airDots(1020, 1800, ground, 274, 2)}</g>
      <path d={mtn(520, 380, 0)} fill={fam.mid} />
      <path d={mtn(1400, 380, 20)} fill={fam.mid} />
      {/* snow caps + lit flanks */}
      {[520, 1400].map((cx) => (
        <g key={cx}>
          <path d={`M ${cx - 62} ${peakY + 70} Q ${cx - 30} ${peakY + 5} ${cx} ${peakY - 2} Q ${cx + 40} ${peakY + 10} ${cx + 66} ${peakY + 74} Q ${cx + 20} ${peakY + 54} ${cx} ${peakY + 76} Q ${cx - 24} ${peakY + 50} ${cx - 62} ${peakY + 70} Z`} fill="#FFF1E0" />
          <path d={`M ${cx + 8} ${peakY + 16} C ${cx + 120} ${peakY + 160} ${cx + 250} ${ground - 110} ${cx + 380} ${ground} L ${cx + 60} ${ground} C ${cx + 90} ${ground - 200} ${cx + 40} ${peakY + 200} ${cx + 8} ${peakY + 16} Z`} fill={fam.near} opacity={0.28} />
        </g>
      ))}
      <rect x={-50} y={ground} width={2020} height={200} fill={fam.near} />
      <text x={520} y={ground + 70} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={36} letterSpacing={3} fill={CHALK}>OUR EARTH</text>
      <text x={1400} y={ground + 70} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={36} letterSpacing={3} fill={LIME}>2× EARTH</text>
      <Flag x={520} y={peakY} big="1/3" small="OF THE AIR LEFT UP HERE" frame={f} />
      <Flag x={1400} y={peakY} big="1/8" small="SAME HEIGHT, 2× EARTH" frame={f} side={-1} />
      <STPill x={1400 - 16} y={peakY - 276} text="OUR SUM" align="end" />
      <Lev x={1090} y={ground + 2} h={120} frame={f} pose="stand" eyes="up" tilt={-14} wind={0.3} shade="#D8B8A2" />
      <Counter label="SIZE" value="×2" sub="GRAVITY 2.0 g" />
    </Stage>
  );
};

// ---------------------------------------------------------------- III · the reality check (chalk)
const wx = (w: number) => 200 + ((w - 0.5) / 3.5) * 1260;
export const STKeyGap: React.FC = () => {
  const fam = SUPPOSE.chalk;
  const axisY = 880;
  const dots: React.ReactNode[] = [];
  let k = 0;
  for (let w = 0.55; w < 4; w += 0.1) {
    const n = Math.round(30 * Math.exp(-(((w - 1.3) / 0.28) ** 2)) + 27 * Math.exp(-(((w - 2.4) / 0.5) ** 2)) + 2 * Math.exp(-(((w - 3.4) / 0.6) ** 2)));
    for (let j = 0; j < n; j++) {
      k++;
      dots.push(<circle key={k} cx={wx(w) + (rnd(k) - 0.5) * 6} cy={axisY - 16 - j * 15.5} r={6.4} fill={w < 1.75 ? TERRA : OCEAN} opacity={0.92} />);
    }
  }
  const gx0 = wx(1.5), gx1 = wx(2.0), pcx = (gx0 + gx1) / 2;
  return (
    <Stage theme={fam.theme} drift={false} vignette={0.08}>
      <Sky family={fam} />
      <g stroke={fam.far} strokeWidth={1.4} opacity={0.6}>
        {Array.from({ length: 33 }, (_, i) => <path key={`v${i}`} d={`M ${i * 60} 0 V 1080`} />)}
        {Array.from({ length: 19 }, (_, i) => <path key={`h${i}`} d={`M 0 ${i * 60} H 1920`} />)}
      </g>
      <text x={200} y={110} fontFamily={ST_FONT} fontWeight={900} fontSize={44} fill={INK}>Small planets close to their stars</text>
      <text x={200} y={156} fontFamily={ST_FONT} fontWeight={800} fontSize={26} fill={fam.dim}>sketched from the pattern in 2,025 Kepler planets (Fulton et al. 2017), sorted by width</text>
      {dots}
      <text x={290} y={560} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={28} fill={TERRA}>MOSTLY ROCK</text>
      <text x={1060} y={440} textAnchor="start" fontFamily={ST_FONT} fontWeight={900} fontSize={28} fill={OCEAN}>MOSTLY WRAPPED IN GAS</text>
      <STPill x={1060} y={488} text="ROUGHLY" dark={false} />
      {/* axis */}
      <path d={`M 180 ${axisY} H 1500`} stroke={INK} strokeWidth={4} strokeLinecap="round" />
      {[1, 1.5, 2, 3, 4].map((w) => (
        <g key={w}>
          <path d={`M ${wx(w)} ${axisY} v 14`} stroke={INK} strokeWidth={3} />
          <text x={wx(w)} y={axisY + 48} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={28} fill={INK}>{w}</text>
        </g>
      ))}
      <text x={840} y={axisY + 92} textAnchor="middle" fontFamily={ST_FONT} fontWeight={800} fontSize={24} letterSpacing={2} fill={fam.dim}>WIDTH, IN EARTHS</text>
      {/* the gap */}
      <rect x={gx0} y={330} width={gx1 - gx0} height={axisY - 340} fill={LIME} opacity={0.12} />
      <path d={`M ${gx0} 560 v -16 H ${gx1} v 16`} stroke={LIME} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <text x={pcx} y={528} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={30} fill={INK}>THE GAP</text>
      {/* one planet from the gap, puffed with gas */}
      <path d={`M ${pcx} ${axisY - 30} L ${pcx} 470`} stroke={INK} strokeWidth={2.5} strokeDasharray="6 8" opacity={0.7} />
      <Bloom x={pcx} y={330} r={190} color={AIR} strength={0.9} spread={0.55} />
      <circle cx={pcx} cy={330} r={118} fill={AIR} opacity={0.55} />
      <circle cx={pcx} cy={330} r={92} fill={AIR} opacity={0.5} />
      <circle cx={pcx} cy={330} r={56} fill={TERRA} />
      <circle cx={pcx - 16} cy={312} r={18} fill="#E8987A" opacity={0.7} />
      <text x={pcx + 140} y={300} fontFamily={ST_FONT} fontWeight={900} fontSize={30} fill={INK}>rock inside,</text>
      <text x={pcx + 140} y={338} fontFamily={ST_FONT} fontWeight={900} fontSize={30} fill={INK}>a deep sky around it</text>
      <Lev x={1690} y={axisY} h={190} frame={f} facing={-1} pose="point" hands={{ front: [70, -150] }} eyes="open" tilt={10} wind={0.2} outline={INK} />
    </Stage>
  );
};

// ---------------------------------------------------------------- channel picture (800×800; YouTube crops a circle)
export const STChannelPicture: React.FC = () => {
  const fam = SUPPOSE.moss;
  return (
    <AbsoluteFill style={{ background: fam.sky[0] }}>
      <svg width={800} height={800} viewBox="0 0 800 800">
        <LightDefs />
        <Sky family={fam} x={0} y={0} w={800} h={800} />
        <Stars frame={f} n={40} w={800} h={420} color={fam.light} seed={9} size={2.4} />
        <Bloom x={400} y={360} r={360} color={LIME} strength={0.22} spread={0.5} />
        <Lev x={392} y={1060} h={780} frame={10} pose="stand" arms={false} eyes="open" tilt={6} wind={0.7} shade="#AFC4B5" />
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- banner (2560×1440; safe area 1546×423 in the centre)
export const STBanner: React.FC = () => {
  const fam = SUPPOSE.moss;
  const ground = 912;
  const pivot: Pt = [800, ground];
  const tip = leverTip(pivot[0], pivot[1], 200, -36);
  const levH = 170, s = levH / 170;
  const hand: Pt = [46, (tip[1] - ground) / s];
  return (
    <AbsoluteFill style={{ background: fam.sky[0] }}>
      <svg width={2560} height={1440} viewBox="0 0 2560 1440">
        <LightDefs />
        <Sky family={fam} x={0} y={0} w={2560} h={1440} />
        <Stars frame={f} n={260} w={2560} h={1440} color={fam.light} seed={12} />
        <Earth cx={700} cy={2330} r={1420} seed={5} />
        <Bloom x={2460} y={260} r={260} color={fam.light} strength={0.25} />
        <Lever x={pivot[0]} y={pivot[1]} len={200} angle={-36} plate="SUPPOSE" scale={1} glow={0.4} />
        <Lev x={tip[0] - hand[0] * s} y={ground - 4} h={levH} frame={f} pose="pull" hands={{ front: hand, back: [hand[0] - 10, hand[1] + 10] }} lean={-10} eyes="squint" wind={0.9} shade="#9FB7A6" />
        <Wordmark x={1300} y={730} size={150} />
        <text x={1300} y={810} textAnchor="middle" fontFamily={ST_FONT} fontWeight={800} fontSize={44} fill={fam.text} opacity={0.85}>Pull one lever. Climb the consequences.</text>
        <Ladder x={1950} top={540} bottom={925} rungs={["", "", "", ""]} lit={2} frame={f} width={56} />
      </svg>
    </AbsoluteFill>
  );
};
