// `l13-kit-demo`: one 1080p sheet (150 frames) laying out the L13 shared pieces on their families, so the foundation
// can be checked with a few stills 15 frames apart (every mover must visibly move between them). Not part of the
// episode. Numbers shown are the gauge's and meter's own rows (194 #11, everyday rungs #10, 203 #14, passages #6).
import React from "react";
import { useCurrentFrame } from "remotion";
import { Family, IF2, Stage, Tick } from "../../lib/illustrated";
import { familyOf, L13_COLORS } from "./families";
import { DB, EVERYDAY_MARKS, L13Gauge } from "./L13Gauge";
import { POWER, PowerMeter } from "./PowerMeter";
import { Barograph, GlobeL13, GlobeRing, PassageCounter, PressureWave, Rings, ShockFront, Strip, bataviaSpikes, passageBlips, passageRing } from "./sound";
import { ListeningTick, Palm, SurveyMap, SitePin, mapPoint } from "./props";

export const L13_KIT_DEMO_FRAMES = 150;

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

export const L13KitDemo: React.FC = () => {
  const f = useCurrentFrame();
  const petrol = familyOf("petrol");
  const ember = familyOf("ember");
  const dusk = familyOf("dusk");
  const voidF = familyOf("void");
  const noon = familyOf("noon");
  const studio = familyOf("studio");
  const pr = passageRing(0.6 + (f / 150) * 2.2);
  const globe = { cx: 960, cy: 905, R: 150, rot: 70 + f * 0.9, tilt: 14 };
  const kx = 60 + f * 6; // shock front: 6 px/f across its panel
  const map = { x: 655, y: 380, w: 300, h: 160 };
  return (
    <Stage theme={studio.theme} drift={false} grain={0} vignette={0}>
      <rect x={0} y={0} width={1920} height={1080} fill={studio.sky[1]} />
      {/* A: the wave on the flat line, clipped at the vacuum floor */}
      <Panel id="pA" x={0} y={0} w={640} h={360} F={petrol} label="PressureWave · clip at floor">
        <PressureWave f={f} y={170} x0={0} x1={640} amp={130} wavelength={300} floorY={280} clip fillAbove="rgba(47,191,168,0.25)" />
      </Panel>
      {/* B: rings + Tick listening */}
      <Panel id="pB" x={640} y={0} w={640} h={360} F={voidF} label="Rings · Tick listen">
        <Rings f={f} cx={700} cy={300} period={30} speed={7} maxR={620} width={4} />
        <Tick x={1100} y={330} pxPerM={150} frame={f} pose="listen" facing={-1} expression="surprised" />
        <ListeningTick x={1210} y={330} pxPerM={90} frame={f} perk={(f % 30) / 30} toward={-1} expression="thinking" seed={3} />
      </Panel>
      {/* C: steepening into one front + the survey map */}
      <Panel id="pC" x={0} y={360} w={640} h={360} F={petrol} label="PressureWave · steepen 1 (one front)">
        <PressureWave f={f} y={560} x0={0} x1={640} amp={110} wavelength={260} steepen={1} phase={-200} color={L13_COLORS.saffron} />
        <PressureWave f={f} y={660} x0={0} x1={640} amp={40} wavelength={160} steepen={0.7} speed={4} width={3} line={false} />
      </Panel>
      {/* D: shock front with bending palm silhouettes */}
      <Panel id="pD" x={640} y={360} w={640} h={360} F={ember} label="ShockFront · Palm (bend)">
        <SurveyMap view="sunda" {...map} family={noon} frame={f} />
        <SitePin x={mapPoint("sunda", map, "krakatoa")[0]} y={mapPoint("sunda", map, "krakatoa")[1]} kind="source" size={7} frame={f} />
        <Palm x={1000} y={720} h={240} f={f} sway={20} silhouette="#1A0604" bend={Math.max(0, Math.min(1, (640 + kx - 1000) / 120))} seed={2} />
        <Palm x={1190} y={720} h={200} f={f} sway={20} seed={4} />
        <ShockFront f={f} x={640 + kx} y={360} height={360} trail={260} />
      </Panel>
      {/* E: barograph with Batavia's nine table heights (#5, F7) + a station strip with seven blips (#6) */}
      <Panel id="pE" x={0} y={720} w={640} h={360} F={dusk} label="Barograph (Batavia #5) · Strip (7 blips #6)">
        <Barograph f={f} x={80} y={780} w={470} h={120} speed={4} spikes={bataviaSpikes(10, 6)} family={dusk} />
        <Strip f={f} x={60} y={990} w={520} h={60} speed={5} spikes={passageBlips(0, 18)} rot={-3} />
      </Panel>
      {/* F: globe + great-circle front + passage counter */}
      <Panel id="pF" x={640} y={720} w={640} h={360} F={voidF} label="GlobeL13 · GlobeRing · PassageCounter">
        <GlobeL13 {...globe} family={voidF}>
          <GlobeRing globe={globe} d={pr.d} color={pr.outward ? L13_COLORS.saffron : L13_COLORS.bone} back />
        </GlobeL13>
        <PassageCounter x={1150} y={1000} n={pr.passage} family={voidF} size={64} />
      </Panel>
      {/* right column: POWER meter (gold, F4) and the dB gauge (vermilion, ceiling 194 labelled, chevrons, spin) */}
      <PowerMeter x={1450} y={690} r={105} value={Math.min(POWER.saturnV, 150 + f * 0.6)} family={studio} frame={f} />
      <L13Gauge family={studio} value={DB.ceiling} frame={f} ceiling={{ v: DB.ceiling }} labelled overflow marks={EVERYDAY_MARKS} base="AIR · re 20 µPa" spin={f < 50 ? 1 : Math.max(0, 1 - (f - 50) / 40)} tremble={f > 100 ? 3 : 0} />
    </Stage>
  );
};
