// Style frame v2 / 2: a cavern deep underground, lit from below by heat. The only light source is the magma, so rim
// light sits on the UNDERSIDE of every rock (light = 90, toward the floor). Tick stands on a ledge with the headlamp
// on. Number on the frame: 180 °C at the bottom of Kola SG-3 (episodes/L11-dig-depth/sources.md #1).
import React from "react";
import { useCurrentFrame } from "remotion";
import {
  Bloom,
  Bubbles,
  Embers,
  FAMILIES,
  Form,
  Gauge,
  GroundShadow,
  Headline,
  Kicker,
  Layer,
  LightWash,
  Motes,
  Ripples,
  Sky,
  Stage,
  Tick,
  TickProps,
  blobPts,
  cameraAt,
  flicker,
  hazed,
  loadIllustratedFonts,
  mixHex,
  pulse,
  rnd,
  roundPoly,
} from "../lib/illustrated";

loadIllustratedFonts();

const F = FAMILIES.ember;
const UP = 90; // light comes from below

export type CavernProps = { f0?: number; tick?: Partial<TickProps>; title?: boolean; camKeys?: { f: number; x: number; y: number; zoom: number }[] };

/** stalactite row: jagged rounded teeth hanging from y0 */
const teeth = (x0: number, x1: number, y0: number, seed: number, minH: number, maxH: number, up = false): [number, number][] => {
  const pts: [number, number][] = [[x0, y0]];
  for (let x = x0, i = 0; x < x1; i++) {
    const w = 60 + rnd(seed + i) * 90;
    const h = minH + rnd(seed * 3 + i) * (maxH - minH);
    pts.push([x + w * 0.5, up ? y0 - h : y0 + h]);
    x += w;
    pts.push([x, y0 + (rnd(seed * 7 + i) - 0.5) * 20]);
  }
  pts.push([x1, y0]);
  return pts;
};

export const CavernScene: React.FC<CavernProps> = ({ f0 = 0, tick, title = true, camKeys }) => {
  const f = useCurrentFrame() + f0;
  const cam = cameraAt(f, camKeys ?? [{ f: 0, x: 960, y: 540, zoom: 1 }, { f: 600, x: 940, y: 560, zoom: 1.05 }]);
  const magmaY = 850;
  const glow = flicker(f, 3, 0.18);
  const ledgeY = 700;
  const ppm = 96;
  const ceiling = teeth(-300, 2300, -40, 11, 120, 300);
  const farCeiling = teeth(-300, 2300, 20, 5, 80, 220);
  const magma = mixHex(F.light, F.second, 0.35);

  return (
    <Stage theme={F.theme} vignette={0.3}>
      <Layer depth={0.05}>
        <Sky family={F} />
        {/* heat glow rising from the floor */}
        <Bloom x={960} y={magmaY + 80} r={900} color={F.light} strength={0.45 * glow} spread={0.25} squash={0.55} />
      </Layer>
      {/* far wall and far ceiling, hazed in hot dark air */}
      <Layer depth={0.25} haze={{ color: F.haze, amount: 0.35 }}>
        <rect x={-400} y={-200} width={2720} height={1500} fill={hazed(F, F.far, 0.2)} />
        <LightWash x={960} y={magmaY} rx={1100} ry={520} color={F.light} strength={0.5 * glow} />
        <Form d={roundPoly(farCeiling, 30)} fill={hazed(F, F.mid, 0.25)} light={UP} shadow={F.shadow} inset={30} shadowOpacity={0.4} rim={F.light} rimWidth={3} rimOpacity={0.45} />
        {/* far pillars */}
        {[200, 760, 1500].map((x, i) => (
          <Form key={i} d={roundPoly([[x - 70, -100], [x + 60, -100], [x + 90, 1200], [x - 110, 1200]], 50)} fill={hazed(F, F.mid, 0.3)} light={UP} shadow={F.shadow} inset={30} shadowOpacity={0.5} rim={F.light} rimWidth={4} rimOpacity={0.5} />
        ))}
      </Layer>
      {/* mid: the ceiling with stalactites, crystals */}
      <Layer depth={0.55} haze={{ color: F.haze, amount: 0.12 }}>
        <Form d={roundPoly(ceiling, 26)} fill={F.mid} light={UP} shadow={F.shadow} inset={34} shadowOpacity={0.55} rim={F.light} rimWidth={4} rimOpacity={0.75} />
        {[
          [330, 210],
          [980, 250],
          [1580, 180],
        ].map(([x, y], i) => {
          const p = pulse(f, 50 + i * 9, 0.25, i + 4);
          return (
            <g key={i} opacity={0.5 + 0.5 * (p - 0.75)}>
              <path d={`M${x} ${y} l-10 -26 l10 -16 l10 16 Z`} fill={mixHex(F.second, "#fff", 0.3)} />
              <path d={`M${x} ${y} l-10 -26 l10 -16 Z`} fill={F.second} opacity={0.6} />
            </g>
          );
        })}
        {/* drips: a drop forms, falls, and the next forms */}
        {[520, 1210, 1760].map((x, i) => {
          const per = 90 + i * 20;
          const t = (f + i * 31) % per;
          const y0 = 240 + i * 10;
          const dropY = t < 40 ? y0 + t * 0.15 : y0 + 6 + ((t - 40) * (t - 40)) / 6;
          return dropY < magmaY ? <ellipse key={i} cx={x} cy={dropY} rx={3} ry={t < 40 ? 3 + t * 0.06 : 5} fill={mixHex(F.text, F.light, 0.4)} opacity={0.8} /> : null;
        })}
      </Layer>
      {/* magma lake with ripples and bubbles */}
      <Layer depth={0.8}>
        <rect x={-400} y={magmaY} width={2720} height={400} fill={magma} />
        <rect x={-400} y={magmaY} width={2720} height={400} fill={F.second} opacity={0.35 * glow} />
        <LightWash x={700} y={magmaY + 60} rx={520} ry={70} color="#FFF0B0" strength={0.6 * glow} />
        <Ripples frame={f} cx={700} cy={magmaY + 40} rx={320} ry={34} period={70} count={4} color="#FFE7A6" width={2.5} strength={0.55} />
        <Ripples frame={f} cx={1400} cy={magmaY + 70} rx={260} ry={28} period={90} count={3} color="#FFE7A6" width={2} strength={0.45} />
        <Bubbles frame={f} x0={200} x1={1700} y={magmaY + 60} n={10} color="#FFD36A" seed={8} rise={0.06} life={120} size={6} />
        {/* dark crust plates floating */}
        {[
          [420, 20, 1],
          [1120, 26, 2],
          [1620, 16, 3],
        ].map(([x, r, s], i) => (
          <path key={i} d={roundPoly(blobPts(x + Math.sin(f / 200 + s) * 10, magmaY + 60 + s * 12, r * 4, 8, s, 0.3, 0.3), 14)} fill={F.near} opacity={0.85} />
        ))}
      </Layer>
      {/* the ledge with Tick; near rocks */}
      <Layer depth={1}>
        <Form d={roundPoly([[-300, ledgeY], [860, ledgeY], [1010, ledgeY + 40], [1080, ledgeY + 140], [1000, ledgeY + 260], [700, ledgeY + 330], [-300, ledgeY + 380]], 40)} fill={F.near} light={UP} shadow={F.shadow} inset={30} shadowOpacity={0.5} rim={F.light} rimWidth={5} rimOpacity={0.9} />
        <LightWash x={760} y={ledgeY + 290} rx={420} ry={60} color={F.light} strength={0.35 * glow} />
        <GroundShadow x={620} y={ledgeY + 2} rx={ppm * 0.4} color={F.shadow} opacity={0.5} />
        <Tick x={620} y={ledgeY} pxPerM={ppm} frame={f} pose="hold" expression="worried" lamp staff look={0.8} seed={2} {...tick} />
        {/* stalagmites on the ledge */}
        {[
          [150, 70, 1],
          [330, 110, 2],
        ].map(([x, h, s], i) => (
          <Form key={i} d={roundPoly([[x - 28, ledgeY + 2], [x - 6, ledgeY - h], [x + 8, ledgeY - h * 0.9], [x + 30, ledgeY + 2]], 10)} fill={mixHex(F.near, F.mid, 0.4)} light={UP} shadow={F.shadow} inset={10} rim={F.light} rimWidth={3} rimOpacity={0.8} />
        ))}
      </Layer>
      {/* foreground rock frame and embers */}
      <Layer depth={1.3}>
        <Form d={roundPoly([[1500, 1200], [1560, 760], [1700, 620], [1900, 560], [2300, 540], [2300, 1200]], 50)} fill={F.near} light={UP} shadow={F.shadow} inset={40} shadowOpacity={0.6} rim={F.light} rimWidth={5} rimOpacity={0.85} />
        <Form d={roundPoly([[-300, 1200], [-300, 300], [-120, 380], [-40, 560], [60, 700], [40, 1200]], 50)} fill={F.near} light={UP} shadow={F.shadow} inset={40} shadowOpacity={0.6} rim={F.light} rimWidth={5} rimOpacity={0.7} />
        <Embers frame={f} x0={100} x1={1800} y={magmaY + 40} n={48} color={F.second} seed={3} rise={1.5} life={130} size={2.6} wiggle={16} />
        <Motes frame={f} n={30} x={0} y={100} w={1920} h={700} color={F.light} seed={6} size={2.2} />
      </Layer>
      <Layer depth={0}>
        {title ? (
          <g>
            <Kicker x={120} y={128} text="12 km down" color={F.dim} size={20} />
            <Headline x={120} y={250} lines={["Where rock", "starts to flow"]} size={92} color={F.text} accent={F.light} shadow={F.shadow} />
          </g>
        ) : null}
        <Gauge x={1760} y={160} height={520} value={180} max={200} unit="°C" theme={F.theme} direction="up" title="HEAT" side="left" plate={110} readout readoutText="180 °C" format={(v) => `${v}°`} />
      </Layer>
    </Stage>
  );
};
