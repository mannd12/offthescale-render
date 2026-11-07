// Summit: the Everest-class massif this episode returns to (cold open C-01…C-10, scene 6 shots 6-01/6-02/6-12/6-14,
// closer Z-05…Z-07). A faceted slate ridge with a snow cap, a far range in haze, the sun as a Bloom, and a flat
// shelf at the peak where Tick stands. The massif is bespoke to L12 (not the v2 style frame's), so the three scenes
// that use it look like the same place. Numbers: none drawn here; the gauge carries 8,848.86 m (#1).
import React from "react";
import { Bloom, Embers, Facets, Family, Flock, Form, GroundShadow, HazeBand, Layer, Sky, Stars, Tick, TickProps, hazed, mixHex, ridgePath, roundPoly } from "../../lib/illustrated";
import { L12_COLORS } from "./families";

type Pt = [number, number];

/** World coordinates of the peak (Tick's feet when standing on the summit) and the summit dot. */
export const SUMMIT = { x: 940, y: 300 } as const;
/** Snow line (world y) on the massif: everything above is cap. */
export const SNOW_LINE = 470;

/** The massif skyline, left → right. Exported so builders can clip to it, put things on its flank or morph it. */
export const MASSIF: Pt[] = [
  [-600, 1120],
  [-260, 920],
  [40, 780],
  [300, 640],
  [540, 490],
  [720, 372],
  [850, 316],
  [905, 300],
  [975, 300],
  [1040, 334],
  [1130, 420],
  [1270, 536],
  [1450, 660],
  [1650, 776],
  [1900, 890],
  [2500, 1120],
];
export const FAR_RANGE: Pt[] = [
  [-400, 700],
  [-100, 640],
  [200, 672],
  [460, 600],
  [700, 650],
  [900, 612],
  [1150, 660],
  [1400, 596],
  [1640, 640],
  [1900, 606],
  [2320, 680],
];
export const FAR_RIDGE: Pt[] = [
  [-300, 790],
  [-60, 710],
  [180, 750],
  [420, 670],
  [600, 730],
  [830, 690],
  [1100, 740],
  [1380, 676],
  [1600, 734],
  [1840, 700],
  [2300, 770],
];

/** Snow cap = everything above `line`: the top edge follows the ridge, the bottom edge is the snow line clamped to
 *  the ridge, so it thins to nothing where the ridge dips under the line (STYLE-V2 §11 round 2). */
export const snowCap = (pts: Pt[], i0: number, i1: number, line: number, wobble = 14) => {
  const top = pts.slice(i0, i1 + 1);
  const bottom: Pt[] = top.map(([x, y], k): Pt => [x + (k === 0 ? 1 : k === top.length - 1 ? -1 : 0), Math.max(y, line + Math.sin(k * 1.7 + x * 0.013) * wobble + (k % 2 ? 20 : -8))]).reverse();
  return roundPoly([...top, ...bottom], 8);
};

/** y of the massif skyline at world x (for placing things on its flank). */
export const massifY = (x: number) => {
  for (let i = 0; i < MASSIF.length - 1; i++) {
    const [ax, ay] = MASSIF[i];
    const [bx, by] = MASSIF[i + 1];
    if (x >= ax && x <= bx) return ay + ((by - ay) * (x - ax)) / (bx - ax);
  }
  return 1120;
};

export type SummitProps = {
  f: number;
  family: Family;
  /** degrees toward the sun (storyboard: cold open sun right ~15° → light 8-15; scene 6 pre-dawn: sun under the horizon) */
  light?: number;
  /** sun position in world coordinates, or null for no disc (pre-dawn); the bloom still follows `sunGlow` */
  sun?: { x: number; y: number } | null;
  /** 0..1 strength of the sun's bloom (pre-dawn glow 0.3, sunrise crest 1.2) */
  sunGlow?: number;
  /** draw the sky + stars (off when the scene paints its own) */
  sky?: boolean;
  stars?: number;
  /** Tick on the summit shelf; false = no Tick; pass pose / expression / pxPerM (default 40) */
  tick?: Partial<TickProps> | false;
  /** the vermilion "you are here" summit dot with a pulse */
  spot?: boolean;
  /** warm fill from below (C-10, the base swells): 0..1 ember light on the massif's lower flank */
  emberFill?: number;
  /** spindrift embers off the cornice */
  spindrift?: boolean;
  /** draw the far range + ridge planes */
  far?: boolean;
};

/**
 * Renders the summit world as a set of Layers (far 0.2 / 0.32, massif 0.6): place it directly inside <Stage>, and add
 * your own near-plane Layer (depth 1) and snow (depth 1.25) around it. Camera: the peak is at SUMMIT; a mid shot of
 * Tick on the summit is roughly cam { x: 940, y: 330, zoom: 3 }.
 */
export const Summit: React.FC<SummitProps> = ({ f, family: F, light = 10, sun = { x: 1560, y: 560 }, sunGlow = 1, sky = true, stars = 70, tick = {}, spot = false, emberFill = 0, spindrift = true, far = true }) => {
  const snow = L12_COLORS.snow;
  const ppm = tick && tick.pxPerM ? tick.pxPerM : 40;
  const glowAt = sun ?? { x: 1560, y: 640 };
  return (
    <>
      {sky ? (
        <Layer depth={0.05}>
          <Sky family={F} />
          {stars > 0 && F.dark ? <Stars frame={f} n={stars} x={0} y={0} w={1920} h={420} color={F.text} seed={2} size={1.4} twinkle={0.7} /> : null}
          <Bloom x={glowAt.x} y={glowAt.y} r={680} color={F.light} strength={0.55 * sunGlow} spread={0.28} squash={0.7} />
          {sun ? <Bloom x={sun.x} y={sun.y} r={170} color="#FFF1C8" strength={Math.min(1, 0.95 * sunGlow)} spread={0.42} core={48} coreColor="#FFF8E0" /> : null}
        </Layer>
      ) : null}
      {far ? (
        <>
          <Layer depth={0.2} haze={{ color: F.haze, amount: 0.45 }}>
            <Form d={ridgePath(FAR_RANGE, 1300, 40)} fill={hazed(F, F.far, 0.1)} light={light} shadow={F.shadow} inset={36} shadowOpacity={0.3} rim={F.light} rimWidth={4} rimOpacity={0.7} bounce={F.bounce}>
              <Facets pts={FAR_RANGE} base={1300} light={light} fill={F.shadow} opacity={0.3} />
            </Form>
          </Layer>
          <Layer depth={0.32} haze={{ color: F.haze, amount: 0.24 }}>
            <Form d={ridgePath(FAR_RIDGE, 1300, 26)} fill={F.far} light={light} shadow={F.shadow} inset={26} shadowOpacity={0.45} rim={F.light} rimWidth={3} rimOpacity={0.6} bounce={F.bounce}>
              <Facets pts={FAR_RIDGE} base={1300} light={light} fill={F.shadow} opacity={0.35} />
            </Form>
            <HazeBand y={660} h={300} color={F.haze} strength={0.3} />
            <Flock frame={f} x={-140} y={560} vx={1.1} n={6} size={9} color={F.shadow} seed={3} />
          </Layer>
        </>
      ) : null}
      {/* the massif: lit flank, base, shadow flank (three clean tonal planes) + the snow cap above SNOW_LINE */}
      <Layer depth={0.6} haze={{ color: F.haze, amount: 0.07 }}>
        <Form d={ridgePath(MASSIF, 1300, 14)} fill={F.mid} light={light} shadow={F.shadow} inset={30} shadowOpacity={0.5} rim={F.light} rimWidth={4} rimOpacity={0.9} bounce={F.bounce}>
          <Facets pts={MASSIF} base={1300} light={light} fill={F.shadow} opacity={0.5} />
          <Facets pts={MASSIF} base={1300} light={light} fill={mixHex(F.mid, F.light, 0.5)} opacity={0.4} lit />
          {emberFill > 0 ? <HazeBand y={700} h={600} color="#FF7A30" strength={0.55 * emberFill} /> : null}
          <path d={snowCap(MASSIF, 3, 12, SNOW_LINE, 16)} fill={mixHex("#F4EFE6", F.light, 0.18)} />
          <path d={snowCap(MASSIF, 5, 10, 372, 10)} fill={snow} />
          <Facets pts={MASSIF.slice(3, 13)} base={SNOW_LINE} light={light} fill={mixHex(F.mid, F.shadow, 0.3)} opacity={0.22} depth={140} />
        </Form>
        {spindrift ? <Embers frame={f} x0={900} x1={1000} y={SUMMIT.y - 6} n={18} color="#FFFFFF" seed={9} rise={0.3} life={70} size={1.8} wiggle={30} /> : null}
        {spot ? (
          <g>
            <circle cx={SUMMIT.x} cy={SUMMIT.y - 4} r={9 + Math.sin(f / 9) * 1.5} fill="#E4572E" />
            <circle cx={SUMMIT.x} cy={SUMMIT.y - 4} r={14 + ((f * 0.5) % 22)} fill="none" stroke="#E4572E" strokeWidth={2} opacity={1 - ((f * 0.5) % 22) / 22} />
          </g>
        ) : null}
        {tick !== false ? (
          <g>
            <GroundShadow x={SUMMIT.x + 3} y={SUMMIT.y + 1} rx={ppm * 0.42} color={F.shadow} opacity={0.45} blur={4} />
            <Tick x={SUMMIT.x} y={SUMMIT.y} pxPerM={ppm} frame={f} pose="stand" expression="neutral" look={0.5} outline={F.shadow} {...tick} />
          </g>
        ) : null}
      </Layer>
    </>
  );
};
