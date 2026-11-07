// Style frame v2 / 3: a pressure wave crossing a night ocean from an erupting island; Tick on the near shore with
// hands over ears, a lighthouse sweeping, a ship riding the swell. Previews "how loud can a sound get?". Numbers on
// the frame: 194 dB = the pressure amplitude of one atmosphere, the ceiling for an undistorted sound wave in air at
// sea level (physics: 20 µPa reference, 101,325 Pa peak → 20·log10(101325/0.00002) ≈ 194); Krakatoa 1883 was heard
// on Rodrigues Island, ~4,800 km away (Royal Society, "The Eruption of Krakatoa", 1888). See docs/STYLE-V2.md §10.
import React from "react";
import { useCurrentFrame } from "remotion";
import {
  Bloom,
  Embers,
  FAMILIES,
  Form,
  Gauge,
  GroundShadow,
  Headline,
  Kicker,
  Layer,
  LightCone,
  Motes,
  P,
  Pill,
  Plume,
  UnknownTag,
  Ripples,
  Sky,
  Stage,
  Stars,
  Bobber,
  Tick,
  alpha,
  cameraAt,
  flicker,
  hazed,
  loadIllustratedFonts,
  mixHex,
  roundPoly,
  seaSurface,
} from "../lib/illustrated";

loadIllustratedFonts();

const F = FAMILIES.petrol;
const HORIZON = 600;
const ISLAND = { x: 1460, y: HORIZON };
const MOON = { x: 820, y: 170 };

export const SoundSeaScene: React.FC<{ f0?: number }> = ({ f0 = 0 }) => {
  const f = useCurrentFrame() + f0;
  const cam = cameraAt(f, [{ f: 0, x: 960, y: 540, zoom: 1 }, { f: 600, x: 950, y: 545, zoom: 1.04 }]);
  const erupt = flicker(f, 7, 0.3);
  const beam = (f * 1.1) % 360;
  const ppm = 84;
  const shoreY = 930;
  const lavaLight = 270; // the cone is lit by its own vent, straight above it
  return (
    <Stage theme={F.theme} vignette={0.28} grain={0.5}>
      <Layer depth={0.05}>
        <Sky family={F} />
        <Stars frame={f} n={120} w={1920} h={560} color={F.light} seed={4} size={1.5} twinkle={0.75} />
        <Bloom x={MOON.x} y={MOON.y} r={340} color={F.light} strength={0.5} spread={0.25} core={54} coreColor="#F2F7EE" />
        <circle cx={MOON.x - 14} cy={MOON.y - 8} r={9} fill={mixHex(F.light, F.sky[1], 0.25)} opacity={0.6} />
        <circle cx={MOON.x + 16} cy={MOON.y + 14} r={6} fill={mixHex(F.light, F.sky[1], 0.25)} opacity={0.6} />
        {/* eruption glow on the sky */}
        <Bloom x={ISLAND.x} y={ISLAND.y - 150} r={620} color={F.second} strength={0.5 * erupt} spread={0.22} squash={0.8} />
      </Layer>
      {/* the island and its column, far */}
      <Layer depth={0.3} haze={{ color: F.haze, amount: 0.2 }}>
        {/* ash column: a cauliflower plume lit from below by the vent, leaning with the wind */}
        <Plume x={ISLAND.x} y={ISLAND.y - 150} h={520} r0={22} fill={hazed(F, "#5A4A44", 0.22)} shade={hazed(F, "#2E2424", 0.12)} lit={mixHex(F.second, "#FFD9A8", 0.35)} light={90} seed={4} frame={f} lean={-0.12} levels={8} />
        <Bloom x={ISLAND.x - 20} y={ISLAND.y - 330} r={260} color={F.second} strength={0.25 * erupt} spread={0.3} />
        <Bloom x={ISLAND.x} y={ISLAND.y - 162} r={150} color="#FFB060" strength={0.95 * erupt} spread={0.35} core={16} coreColor="#FFF0C0" />
        <Embers frame={f} x0={ISLAND.x - 30} x1={ISLAND.x + 30} y={ISLAND.y - 160} n={34} color="#FFB060" seed={12} rise={2.4} life={80} size={3} wiggle={26} />
        {/* the cone: a proper stratovolcano profile standing above the horizon, with its foot shore */}
        <Form d={roundPoly([[ISLAND.x - 420, ISLAND.y + 14], [ISLAND.x - 300, ISLAND.y - 30], [ISLAND.x - 150, ISLAND.y - 70], [ISLAND.x - 40, ISLAND.y - 150], [ISLAND.x - 16, ISLAND.y - 162], [ISLAND.x + 16, ISLAND.y - 162], [ISLAND.x + 40, ISLAND.y - 150], [ISLAND.x + 170, ISLAND.y - 64], [ISLAND.x + 320, ISLAND.y - 26], [ISLAND.x + 440, ISLAND.y + 14]], 12)} fill={hazed(F, F.near, 0.2)} light={lavaLight} shadow={F.shadow} inset={26} shadowOpacity={0.4} rim={F.second} rimWidth={4} rimOpacity={0.8 * erupt}>
          <path d={`M${ISLAND.x - 40} ${ISLAND.y - 150} L${ISLAND.x - 150} ${ISLAND.y - 70} L${ISLAND.x - 300} ${ISLAND.y - 30} L${ISLAND.x - 420} ${ISLAND.y + 14} L${ISLAND.x - 40} ${ISLAND.y + 14} Z`} fill={F.shadow} opacity={0.45} />
        </Form>
        <Bloom x={ISLAND.x} y={ISLAND.y - 150} r={60} color="#FFB060" strength={0.8 * erupt} spread={0.4} />
        {/* lava tongue down the flank */}
        <path d={`M${ISLAND.x + 8} ${ISLAND.y - 158} q30 50 22 100 q-6 30 10 60`} fill="none" stroke="#FFB060" strokeWidth={5} strokeLinecap="round" opacity={0.9 * erupt} />
      </Layer>
      {/* sea: three bands of swell, the moon's glitter, the sound front */}
      <Layer depth={0.5} haze={{ color: F.haze, amount: 0.12 }}>
        <rect x={-400} y={HORIZON} width={2720} height={700} fill={F.far} />
        <path d={seaSurface(f, -400, 2320, HORIZON + 40, 4, 300, 1.0, 1500, 30)} fill={mixHex(F.far, F.mid, 0.5)} />
        <path d={seaSurface(f, -400, 2320, HORIZON + 150, 7, 260, 1.3, 1500, 30)} fill={F.mid} />
        {/* moon glitter path */}
        <Motes frame={f} n={70} x={MOON.x - 120} y={HORIZON + 10} w={240} h={320} color={F.light} seed={9} size={2.4} drift={20} glow={false} />
        {/* the pressure wave: rings racing out from the island across the water, with air arcs above */}
        <Ripples frame={f} cx={ISLAND.x} cy={ISLAND.y + 10} rx={1500} ry={330} period={46} count={6} color={F.light} width={4} strength={0.85} />
        <Ripples frame={f} cx={ISLAND.x} cy={ISLAND.y - 20} rx={1500} ry={900} period={46} count={6} color={F.second} width={2} strength={0.25} dash="10 14" />
      </Layer>
      {/* the ship on the swell */}
      <Layer depth={0.72}>
        <Bobber frame={f} x={1000} y={760} amp={6} roll={3} period={120} seed={2}>
          <Form d={roundPoly([[930, 748], [1090, 748], [1070, 776], [950, 776]], 6)} fill={F.near} light={300} shadow={F.shadow} inset={8} rim={F.light} rimWidth={2} rimOpacity={0.7} />
          <rect x={985} y={722} width={44} height={28} rx={4} fill={mixHex(F.near, F.light, 0.2)} />
          <rect x={1000} y={700} width={10} height={24} fill={F.near} />
          <circle cx={1005} cy={736} r={3.5} fill="#FFD98A" opacity={0.9} />
          <circle cx={1017} cy={736} r={3.5} fill="#FFD98A" opacity={0.9} />
          <circle cx={1005} cy={698} r={3} fill={P.vermilion} opacity={0.5 + 0.5 * Math.sin(f / 8)} />
        </Bobber>
        <path d={seaSurface(f, -400, 2320, 790, 9, 220, 1.6, 1500, 30)} fill={mixHex(F.mid, F.near, 0.35)} />
      </Layer>
      {/* near shore: rocks, lighthouse, Tick */}
      <Layer depth={1}>
        <Form d={roundPoly([[-300, shoreY - 40], [120, shoreY - 70], [520, shoreY - 30], [820, shoreY + 10], [900, shoreY + 60], [760, shoreY + 200], [-300, shoreY + 200]], 36)} fill={F.near} light={300} shadow={F.shadow} inset={30} shadowOpacity={0.5} rim={F.light} rimWidth={4} rimOpacity={0.7} />
        {/* lighthouse */}
        <Form d={roundPoly([[150, shoreY - 68], [196, shoreY - 68], [186, shoreY - 300], [160, shoreY - 300]], 4)} fill={mixHex(F.text, F.near, 0.35)} light={300} shadow={F.shadow} inset={10} rim={F.light} rimWidth={2} />
        {[0, 1, 2].map((i) => (
          <rect key={i} x={156} y={shoreY - 130 - i * 60} width={34} height={16} fill={P.vermilion} opacity={0.9} />
        ))}
        <rect x={154} y={shoreY - 330} width={38} height={32} rx={4} fill={F.shadow} />
        <circle cx={173} cy={shoreY - 314} r={9} fill="#FFF0C0" />
        <LightCone x={173} y={shoreY - 314} angle={beam} length={900} spread={7} color="#FFF0C0" strength={0.55} />
        <LightCone x={173} y={shoreY - 314} angle={beam + 180} length={900} spread={7} color="#FFF0C0" strength={0.55} />
        <GroundShadow x={560} y={shoreY - 26} rx={ppm * 0.4} color={F.shadow} opacity={0.5} />
        <Tick x={560} y={shoreY - 28} pxPerM={ppm} frame={f} pose="cover-ears" expression="scared" look={0.9} seed={3} tilt={-4} />
      </Layer>
      <Layer depth={1.3}>
        <Form d={roundPoly([[-300, 1200], [-300, 980], [-100, 960], [60, 1000], [120, 1200]], 40)} fill={mixHex(F.near, "#000", 0.3)} light={300} shadow={F.shadow} inset={30} rim={F.light} rimWidth={3} rimOpacity={0.5} />
        <Motes frame={f} n={20} x={0} y={300} w={1920} h={700} color={F.light} seed={11} size={1.8} />
      </Layer>
      <Layer depth={0}>
        <Kicker x={120} y={128} text="Off the Scale · Sound" color={F.dim} size={20} />
        <Headline x={120} y={250} lines={["How loud can", "a sound get?"]} size={92} color={F.text} accent={F.second} shadow={F.shadow} />
        <Pill x={1080} y={372} text="Krakatoa 1883 · heard 4,800 km away" fill={alpha(F.shadow, 0.72)} color={F.text} dot={F.second} size={19} align="start" />
        {/* the gauge shows the physical CEILING as a mark; Krakatoa's own value is the question, not a claim */}
        <Gauge x={1760} y={160} height={520} value={0} max={250} unit="dB" theme={F.theme} direction="up" title="LOUDNESS" side="left" plate={150} readout={false} marker={false} marks={[{ v: 194, label: "194 ceiling" }]} format={(v) => `${v}`} />
        <UnknownTag x={1767} y={160 + 520 * (1 - 130 / 250)} size={24} />
        <Pill x={1598} y={160 + 520 * (1 - 130 / 250)} text="Krakatoa?" fill={alpha(F.shadow, 0.72)} color={F.text} size={17} align="end" />
      </Layer>
    </Stage>
  );
};
