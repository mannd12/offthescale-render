// Style frame v2 / 2: a cavern deep underground, lit from below by heat. The only light source is the magma, so rim
// light sits on the UNDERSIDE of every rock (light = 90, toward the floor) and the tops of ledges fall into shadow.
// Tick stands on a rock shelf with the headlamp on. Number on the frame: 180 °C at the bottom of Kola SG-3
// (episodes/L11-dig-depth/sources.md #1).
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

export type CavernProps = { f0?: number; tick?: Partial<TickProps>; title?: boolean; camKeys?: { f: number; x: number; y: number; zoom: number }[]; grain?: number };

/** stalactite row: rounded, varied teeth hanging from y0 (wide shoulders, blunt tips) */
const teeth = (x0: number, x1: number, y0: number, seed: number, minH: number, maxH: number): [number, number][] => {
  const pts: [number, number][] = [[x0, y0 - 200]];
  for (let x = x0, i = 0; x < x1; i++) {
    const w = 90 + rnd(seed + i) * 120;
    const h = minH + rnd(seed * 3 + i) * (maxH - minH);
    pts.push([x, y0 + (rnd(seed * 7 + i) - 0.5) * 24]);
    pts.push([x + w * 0.38, y0 + h * 0.75]);
    pts.push([x + w * 0.5, y0 + h]);
    pts.push([x + w * 0.62, y0 + h * 0.7]);
    x += w;
  }
  pts.push([x1, y0 - 200]);
  return pts;
};

export const CavernScene: React.FC<CavernProps> = ({ f0 = 0, tick, title = true, camKeys, grain = 0.5 }) => {
  const f = useCurrentFrame() + f0;
  const cam = cameraAt(f, camKeys ?? [{ f: 0, x: 960, y: 540, zoom: 1 }, { f: 600, x: 940, y: 560, zoom: 1.05 }]);
  const magmaY = 870;
  const glow = flicker(f, 3, 0.18);
  const ledgeY = 700;
  const ppm = 104;
  const ceiling = teeth(-300, 2300, -20, 11, 120, 260);
  const farCeiling = teeth(-300, 2300, 30, 5, 80, 200);
  const magma = mixHex(F.light, F.second, 0.3);
  const rippleC = mixHex(F.light, "#7A2A00", 0.45);
  const ledge: [number, number][] = [
    [-300, ledgeY],
    [300, ledgeY - 6],
    [700, ledgeY],
    [900, ledgeY + 10],
    [1000, ledgeY + 60],
    [1030, ledgeY + 130],
    [960, ledgeY + 200],
    [700, ledgeY + 230],
    [300, ledgeY + 215],
    [-300, ledgeY + 240],
  ];

  return (
    <Stage theme={F.theme} vignette={0.3} grain={grain}>
      <Layer depth={0.05}>
        <Sky family={F} />
        {/* heat glow rising from the floor */}
        <Bloom x={960} y={magmaY + 60} r={1000} color={F.light} strength={0.5 * glow} spread={0.22} squash={0.5} />
      </Layer>
      {/* far wall and far ceiling, hazed in hot dark air */}
      <Layer depth={0.25} haze={{ color: F.haze, amount: 0.32 }}>
        <rect x={-400} y={-200} width={2720} height={1500} fill={hazed(F, F.far, 0.1)} />
        <LightWash x={960} y={magmaY} rx={1200} ry={560} color={F.light} strength={0.55 * glow} />
        <Form d={roundPoly(farCeiling, 36)} fill={hazed(F, F.mid, 0.2)} light={UP} shadow={F.shadow} inset={30} shadowOpacity={0.45} rim={F.light} rimWidth={3} rimOpacity={0.5} />
        {/* far pillars: wider at the foot, lit from below */}
        {[180, 760, 1480].map((x, i) => (
          <Form key={i} d={roundPoly([[x - 60, -100], [x + 50, -100], [x + 70, 500], [x + 130, 1200], [x - 150, 1200], [x - 80, 500]], 60)} fill={hazed(F, F.mid, 0.25)} light={UP} shadow={F.shadow} inset={34} shadowOpacity={0.55} rim={F.light} rimWidth={5} rimOpacity={0.6} />
        ))}
      </Layer>
      {/* mid: the ceiling with stalactites, crystals, drips */}
      <Layer depth={0.55} haze={{ color: F.haze, amount: 0.1 }}>
        <Form d={roundPoly(ceiling, 34)} fill={F.mid} light={UP} shadow={F.shadow} inset={36} shadowOpacity={0.6} rim={F.light} rimWidth={5} rimOpacity={0.85} />
        {[
          [330, 190],
          [980, 230],
          [1580, 160],
        ].map(([x, y], i) => {
          const p = pulse(f, 50 + i * 9, 0.25, i + 4);
          return (
            <g key={i} opacity={0.5 + 0.5 * (p - 0.75)}>
              <path d={`M${x} ${y} l-12 -30 l12 -18 l12 18 Z`} fill={mixHex(F.second, "#fff", 0.3)} />
              <path d={`M${x} ${y} l-12 -30 l12 -18 Z`} fill={F.second} opacity={0.6} />
              <Bloom x={x} y={y - 20} r={40} color={F.second} strength={0.5 * p} spread={0.3} />
            </g>
          );
        })}
        {[520, 1210, 1760].map((x, i) => {
          const per = 90 + i * 20;
          const t = (f + i * 31) % per;
          const y0 = 250 + i * 10;
          const dropY = t < 40 ? y0 + t * 0.15 : y0 + 6 + ((t - 40) * (t - 40)) / 6;
          return dropY < magmaY ? <ellipse key={i} cx={x} cy={dropY} rx={3} ry={t < 40 ? 3 + t * 0.06 : 5} fill={mixHex(F.text, F.light, 0.4)} opacity={0.8} /> : null;
        })}
      </Layer>
      {/* magma lake with a hot centre, ripples, bubbles and crust plates */}
      <Layer depth={0.8}>
        <rect x={-400} y={magmaY} width={2720} height={400} fill={magma} />
        <LightWash x={1100} y={magmaY + 70} rx={700} ry={90} color="#FFF4C4" strength={0.8 * glow} />
        <LightWash x={-100} y={magmaY + 120} rx={500} ry={120} color="#7A2A00" strength={0.4} />
        <LightWash x={2000} y={magmaY + 120} rx={500} ry={120} color="#7A2A00" strength={0.4} />
        <Ripples frame={f} cx={760} cy={magmaY + 46} rx={340} ry={36} period={70} count={4} color={rippleC} width={2.6} strength={0.6} />
        <Ripples frame={f} cx={1420} cy={magmaY + 80} rx={280} ry={30} period={90} count={3} color={rippleC} width={2.2} strength={0.5} />
        <Bubbles frame={f} x0={200} x1={1700} y={magmaY + 70} n={10} color="#FFE48C" seed={8} rise={0.06} life={120} size={6} />
        {[
          [420, 20, 1],
          [1120, 26, 2],
          [1620, 16, 3],
        ].map(([x, r, s], i) => (
          <path key={i} d={roundPoly(blobPts(x + Math.sin(f / 200 + s) * 10, magmaY + 70 + s * 12, r * 4, 8, s, 0.3, 0.3), 14)} fill={F.near} opacity={0.85} />
        ))}
      </Layer>
      {/* the shelf with Tick; stalagmites */}
      <Layer depth={1}>
        <Form d={roundPoly(ledge, 40)} fill={mixHex(F.near, F.mid, 0.35)} light={UP} shadow={F.shadow} inset={34} shadowOpacity={0.55} rim={F.light} rimWidth={6} rimOpacity={0.95}>
          <LightWash x={700} y={ledgeY + 240} rx={700} ry={90} color={F.light} strength={0.45 * glow} />
        </Form>
        <GroundShadow x={620} y={ledgeY + 2} rx={ppm * 0.4} color={F.shadow} opacity={0.5} />
        <Tick x={620} y={ledgeY} pxPerM={ppm} frame={f} pose="hold" expression="worried" lamp staff look={0.8} seed={2} {...tick} />
        {[
          [150, 70, 1],
          [330, 110, 2],
        ].map(([x, h, s], i) => (
          <Form key={i} d={roundPoly([[x - 30, ledgeY + 2], [x - 6, ledgeY - h], [x + 8, ledgeY - h * 0.9], [x + 32, ledgeY + 2]], 10)} fill={mixHex(F.near, F.mid, 0.5)} light={UP} shadow={F.shadow} inset={10} rim={F.light} rimWidth={3} rimOpacity={0.8} />
        ))}
      </Layer>
      {/* foreground rock frame and embers */}
      <Layer depth={1.3}>
        <Form d={roundPoly([[1560, 1200], [1600, 800], [1720, 640], [1900, 580], [2300, 560], [2300, 1200]], 60)} fill={F.near} light={UP} shadow={F.shadow} inset={40} shadowOpacity={0.6} rim={F.light} rimWidth={6} rimOpacity={0.9} />
        <Form d={roundPoly([[-300, 1200], [-300, 300], [-140, 380], [-60, 560], [20, 760], [-20, 1200]], 50)} fill={F.near} light={UP} shadow={F.shadow} inset={40} shadowOpacity={0.6} rim={F.light} rimWidth={5} rimOpacity={0.7} />
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
