// `l14-kit-demo`: one 1080p sheet (150 frames) laying out the L14 shared pieces on their families, so the foundation can
// be checked with stills 15 frames apart (every mover must visibly move between them). Not part of the episode.
// Numbers shown are GAUGE rows only (8 km/s #2, ~180 °C #14, 6,000 ± 500 °C and 3.3 million atm #17, 1.09 g #3).
import React from "react";
import { useCurrentFrame } from "remotion";
import { Family, IF2, Stage } from "../../lib/illustrated";
import { familyOf } from "./families";
import { BIG_HEAT_MAX, GAUGE, L14Gauges, STOP, pullValue } from "./L14Gauges";
import { AirHaze, IronFlow, Shimmer, StrataWall } from "./tunnel";
import { CutGlobe, oscillate } from "./cutglobe";
import { ClockFace, HatchLid, HazardBand, Probe, Rig, SpringWeight } from "./props";
import { LayerRings } from "./L14Card";

export const L14_KIT_DEMO_FRAMES = 150;

const Panel: React.FC<{ id: string; x: number; y: number; w: number; h: number; F: Family; label: string; children: React.ReactNode }> = ({ id, x, y, w, h, F, label, children }) => (
  <g>
    <defs>
      <clipPath id={id}>
        <rect x={x} y={y} width={w} height={h} />
      </clipPath>
    </defs>
    <g clipPath={`url(#${id})`}>
      <rect x={x} y={y} width={w} height={h} fill={F.sky[0]} />
      <rect x={x} y={y + h * 0.55} width={w} height={h * 0.45} fill={F.sky[1]} opacity={0.5} />
      {children}
    </g>
    <rect x={x} y={y} width={w} height={h} fill="none" stroke="#000" strokeWidth={3} />
    <text x={x + 14} y={y + 28} style={{ fontFamily: IF2.label, fontSize: 18, letterSpacing: 2, fill: F.text }}>
      {label}
    </text>
  </g>
);

const cl = (v: number) => Math.max(0, Math.min(1, v));

export const L14KitDemo: React.FC = () => {
  const f = useCurrentFrame();
  const petrol = familyOf("petrol");
  const iron = familyOf("iron");
  const voidF = familyOf("void");
  const dusk = familyOf("dusk");
  const studio = familyOf("studio");
  const ember = familyOf("ember");
  return (
    <Stage theme={studio.theme} drift={false} grain={0} vignette={0}>
      <rect x={0} y={0} width={1920} height={1080} fill={studio.sky[1]} />
      {/* A: the tunnel, surface and crust/mantle seams crossing near f 17-21, haze, scraping probe, ruler */}
      <Panel id="pA" x={0} y={0} w={620} h={540} F={petrol} label="StrataWall 18 px/f · AirHaze · Probe scrape">
        <StrataWall f={f} family={petrol} depth={-150} pxPerKm={2} speed={18} anchorY={270} cx={300} gap={220} x0={0} x1={620} lamp={{ y: 250 }} hatch="taffy" ruler={585} wobble={cl((f - 60) / 60) * 0.6} />
        <AirHaze f={f} x={200} w={200} y0={0} y1={540} speed={14} density={cl(f / 150)} crystals={f > 75 ? 0.6 : 0} />
        <Probe x={300 + (f > 60 ? 40 : 0)} y={230} size={130} f={f} variant={f > 60 ? "scrape" : "plain"} side={1} />
      </Panel>
      {/* B: the iron sea: ribbons streaming, shimmer, lit probe + cabin probe */}
      <Panel id="pB" x={620} y={0} w={620} h={540} F={iron} label="IronFlow · Shimmer · Probe lit / cabin">
        <IronFlow f={f} x0={620} x1={1240} y0={0} y1={540} speed={11} />
        <Shimmer f={f} x={620} y={0} w={620} h={540} rows={6} speed={4} />
        <Probe x={800} y={250} size={150} f={f} variant="lit" />
        <Probe x={1080} y={300} size={230} f={f} variant="cabin" lamp={false} tilt={18} flutter={0} />
      </Panel>
      {/* C: the cut-away globe to scale, the probe oscillating on the diameter, ray fan, spin, shadow wedge */}
      <Panel id="pC" x={0} y={540} w={620} h={540} F={voidF} label="CutGlobe · probe oscillate · rays · spin">
        <CutGlobe cx={310} cy={820} R={220} f={f} family={voidF} probe={oscillate(f / 60)} trail={0.25} line={{ to: -1 + 2 * cl(f / 50) }} rays={(f % 75) / 75} shadow={0.6} spin ruler />
      </Panel>
      {/* D: the card rings (dusk), hatch + rig, spring weight, clock, hazard band */}
      <Panel id="pD" x={620} y={540} w={620} h={540} F={dusk} label="LayerRings · HatchLid · Rig · Spring · Clock · Hazard">
        <LayerRings f={f} cx={1180} cy={1060} maxR={700} width={34} />
        <HatchLid x={760} y={1000} r={70} open={cl(f / 30)} family={dusk} f={f} />
        <Rig x={760} y={990} h={200} f={f} cableTo={980} />
        <SpringWeight x={980} y={600} stretch={150 + Math.sin((f / 66) * Math.PI * 2) * 70} probe f={f} />
        <ClockFace x={1150} y={700} r={60} minutes={f * 0.4} ring={f / 150} family={dusk} />
        <HazardBand x={640} y={1046} w={580} h={26} f={f} />
      </Panel>
      {/* E: the gauge cluster, DARK plates on the bright studio (left) and LIGHT plates on void/ember (right) */}
      <rect x={1240} y={0} width={340} height={1080} fill={studio.sky[0]} />
      <rect x={1580} y={0} width={340} height={540} fill={voidF.sky[0]} />
      <rect x={1580} y={540} width={340} height={540} fill={ember.sky[0]} />
      <g transform="translate(1248 70) scale(0.95)">
        <L14Gauges
          family={studio}
          frame={f}
          x={0}
          y={0}
          speed={{ value: cl(f / 90), stop: STOP.speed, readout: GAUGE.speedPeak, roll: cl(f / 90), pinned: f > 100 }}
          heat={{ value: 0.25 + 0.75 * cl(f / 70), readout: GAUGE.kola, approx: true, roll: cl(f / 60), pinned: f > 70, broken: cl((f - 95) / 45) }}
          pressure={{ value: cl(f / 120), appear: cl(f / 20) }}
          pull={{ value: pullValue(1) * (1 - cl(f / 140)), stop: STOP.pull }}
        />
      </g>
      <g transform="translate(1588 70) scale(0.95)">
        <L14Gauges
          family={voidF}
          frame={f}
          x={0}
          y={0}
          rattle={f > 100 ? 0.6 : 0}
          speed={{ value: 1, stop: STOP.speed, pinned: true }}
          heat={{ value: (GAUGE.boundaryT / BIG_HEAT_MAX) * cl(f / 80), big: true, readout: GAUGE.boundaryT, tol: GAUGE.tol, roll: cl(f / 80) }}
          pressure={{ value: cl(f / 60), readout: GAUGE.boundaryP, roll: cl(f / 90), pinned: f > 60 }}
          pull={{ value: 0, unknown: true }}
        />
      </g>
    </Stage>
  );
};
