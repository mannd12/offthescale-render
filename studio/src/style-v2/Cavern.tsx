// Style frame v2 / 2 (v2.1 rebuild): "Where rock starts to flow", 12 km down. A MID SHOT: Tick is large in frame (the
// rule in docs/STYLE-V2.md §5: one shot per scene where Tick fills ≥ 40 % of the height, so the acting reads on a
// phone). Accuracy: Kola SG-3's bottom was ~180 °C SOLID rock under such pressure that it deforms and squeezes into the
// 23-cm hole (episodes/L11-dig-depth/sources.md #1, #9); nothing glows, nothing is molten. So the only light is Tick's
// headlamp; heat is shown by the gauge, by shimmer in the air and by the rock bulging into the borehole slot beside Tick.
// The hole is drawn at true scale (23 cm ≈ 60 px at 260 px/m); Tick stands in a cutaway of the rock, not in the hole.
import React from "react";
import { useCurrentFrame } from "remotion";
import {
  Banding,
  Bloom,
  Emissive,
  FAMILIES,
  Form,
  Gauge,
  GroundShadow,
  Headline,
  Kicker,
  Layer,
  Leader,
  LightWash,
  Motes,
  Pill,
  Risers,
  Sky,
  Stage,
  Tick,
  TickProps,
  alpha,
  cameraAt,
  flicker,
  loadIllustratedFonts,
  mixHex,
  roundPoly,
} from "../lib/illustrated";

loadIllustratedFonts();

const F = FAMILIES.ember;
const PPM = 260;
const GROUND = 1000;
const LAMP = { x: 560 + 24 * 2.6, y: GROUND - 176 * 2.6 }; // Tick's headlamp in world px (Tick at x = 560)
const HOLE_X = 1180;
const HOLE_W = 0.23 * PPM;

export type CavernProps = { f0?: number; tick?: Partial<TickProps>; title?: boolean; camKeys?: { f: number; x: number; y: number; zoom: number }[]; grain?: number };

export const CavernScene: React.FC<CavernProps> = ({ f0 = 0, tick, title = true, camKeys, grain = 0.5 }) => {
  const f = useCurrentFrame() + f0;
  const cam = camKeys ? cameraAt(f, camKeys) : undefined;
  const lampFl = flicker(f, 5, 0.08);
  // light direction for the rock: toward the lamp (upper left of the hole)
  const toLamp = (x: number, y: number) => (Math.atan2(LAMP.y - y, LAMP.x - x) * 180) / Math.PI;
  const rockBase = F.mid;
  const rockDark = mixHex(F.near, F.shadow, 0.3);
  const squeeze = 10 + 4 * Math.sin(f / 70); // the plastic bulge breathes very slowly
  // the borehole slot: walls bulge inward at mid-height (the "rock like plastic" squeeze)
  const slot = roundPoly(
    [
      [HOLE_X - HOLE_W / 2, -200],
      [HOLE_X + HOLE_W / 2, -200],
      [HOLE_X + HOLE_W / 2, 420],
      [HOLE_X + HOLE_W / 2 - squeeze, 560],
      [HOLE_X + HOLE_W / 2 - squeeze * 1.3, 640],
      [HOLE_X + HOLE_W / 2 - squeeze * 0.4, 760],
      [HOLE_X + HOLE_W / 2, GROUND + 100],
      [HOLE_X - HOLE_W / 2, GROUND + 100],
      [HOLE_X - HOLE_W / 2 + squeeze * 0.5, 780],
      [HOLE_X - HOLE_W / 2 + squeeze * 1.4, 660],
      [HOLE_X - HOLE_W / 2 + squeeze * 0.9, 540],
      [HOLE_X - HOLE_W / 2, 420],
    ],
    10,
  );
  return (
    <Stage theme={F.theme} cam={cam} drift={{ zoom: 1.05, panX: 0.02, frames: 300, seed: 2 }} vignette={0.34} grain={grain}>
      <Layer depth={0.05}>
        <Sky family={F} />
      </Layer>
      {/* the rock face behind Tick: banded, lit only where the lamp reaches */}
      <Layer depth={0.5}>
        <rect x={-400} y={-300} width={2720} height={1700} fill={rockDark} />
        <Banding x={-400} y={-300} w={2720} h={1700} color={rockBase} family={F} bands={16} seed={4} tilt={-3} opacity={0.28} />
        {/* fracture lines and a few knots of darker rock */}
        {[
          [120, 80, 420, 600],
          [1500, -100, 1760, 520],
          [1700, 700, 2100, 1000],
          [-100, 500, 300, 980],
        ].map(([x1, y1, x2, y2], i) => (
          <path key={i} d={`M${x1} ${y1} q${(x2 - x1) * 0.4} ${(y2 - y1) * 0.6} ${x2 - x1} ${y2 - y1}`} fill="none" stroke={F.shadow} strokeWidth={4} opacity={0.75} strokeLinecap="round" />
        ))}
        {[
          [260, 300, 40],
          [1620, 820, 54],
          [1900, 260, 34],
        ].map(([x, y, r], i) => (
          <ellipse key={i} cx={x} cy={y} rx={r * 1.6} ry={r} fill={mixHex(rockBase, F.shadow, 0.35)} opacity={0.6} transform={`rotate(-8 ${x} ${y})`} />
        ))}
        <LightWash x={LAMP.x + 260} y={LAMP.y + 120} rx={720} ry={520} color={F.light} strength={0.5 * lampFl} />
        <LightWash x={LAMP.x} y={LAMP.y} rx={300} ry={300} color="#FFE3A8" strength={0.35 * lampFl} />
      </Layer>
      {/* the slot of the borehole, cut into the rock, walls bulging inward */}
      <Layer depth={0.8}>
        <Form d={roundPoly([[HOLE_X - 220, -300], [HOLE_X + 260, -300], [HOLE_X + 300, GROUND + 100], [HOLE_X - 260, GROUND + 100]], 60)} fill={rockBase} light={toLamp(HOLE_X, 500)} shadow={F.shadow} inset={40} shadowOpacity={0.5} rim={F.light} rimWidth={3} rimOpacity={0.6 * lampFl} bounce={F.bounce}>
          <Banding x={HOLE_X - 300} y={-300} w={600} h={1400} color={rockBase} family={F} bands={14} seed={9} tilt={-2} opacity={0.3} />
        </Form>
        <path d={slot} fill={F.shadow} />
        {/* the bulge lips catch the lamp */}
        <path d={`M${HOLE_X - HOLE_W / 2 + squeeze * 0.9} 540 Q${HOLE_X - HOLE_W / 2 + squeeze * 1.9} 660 ${HOLE_X - HOLE_W / 2 + squeeze * 0.5} 780`} fill="none" stroke={F.light} strokeWidth={3} opacity={0.75 * lampFl} strokeLinecap="round" />
        <path d={`M${HOLE_X + HOLE_W / 2 - squeeze} 560 Q${HOLE_X + HOLE_W / 2 - squeeze * 1.8} 640 ${HOLE_X + HOLE_W / 2 - squeeze * 0.4} 760`} fill="none" stroke={mixHex(F.light, F.shadow, 0.5)} strokeWidth={2} opacity={0.5} strokeLinecap="round" />
        {/* drill string hanging in the slot */}
        <rect x={HOLE_X - 9} y={-300} width={18} height={820} rx={4} fill={mixHex(F.dim, F.shadow, 0.5)} />
        <rect x={HOLE_X - 9} y={-300} width={6} height={820} fill={mixHex(F.dim, F.light, 0.2)} opacity={0.6} />
        {[-120, 60, 240, 420].map((y) => (
          <rect key={y} x={HOLE_X - 12} y={y} width={24} height={14} rx={3} fill={mixHex(F.dim, F.shadow, 0.3)} />
        ))}
        {/* heat shimmer rising from the hot rock (thin wavering lines, not glow) */}
        <Risers frame={f} x0={HOLE_X - 200} x1={HOLE_X + 240} y={GROUND} n={14} color={F.light} seed={12} rise={0.5} life={140} size={1.2} wiggle={9} />
      </Layer>
      {/* floor and Tick, large */}
      <Layer depth={1}>
        <Form d={roundPoly([[-400, GROUND], [2320, GROUND - 8], [2320, 1400], [-400, 1400]], 10)} fill={mixHex(F.near, F.mid, 0.3)} light={toLamp(700, GROUND)} shadow={F.shadow} inset={30} shadowOpacity={0.5} rim={F.light} rimWidth={3} rimOpacity={0.5 * lampFl} bounce={F.bounce} />
        <LightWash x={LAMP.x + 320} y={GROUND} rx={560} ry={60} color={F.light} strength={0.3 * lampFl} />
        <GroundShadow x={590} y={GROUND + 2} rx={PPM * 0.42} ry={PPM * 0.1} color={F.shadow} opacity={0.55} blur={16} />
        <Tick x={560} y={GROUND} pxPerM={PPM} frame={f} pose="hold" expression="worried" lamp staff look={0.9} seed={2} {...tick} />
        <Bloom x={LAMP.x} y={LAMP.y} r={120} color="#FFE9B8" strength={0.7 * lampFl} spread={0.3} />
        <Emissive d={`M${LAMP.x} ${LAMP.y} l6 0`} color="#FFF3D0" width={6} strength={0.8 * lampFl} glow={8} />
        <Motes frame={f} n={26} x={LAMP.x} y={LAMP.y - 100} w={700} h={400} color={F.light} seed={6} size={2.2} />
      </Layer>
      <Layer depth={0}>
        <Leader from={[HOLE_X - HOLE_W / 2 + 14, 660]} to={[HOLE_X - 150, 560]} color={F.text} elbow={false} />
        <Pill x={HOLE_X - 150} y={560} text="rock squeezing in" fill={alpha(F.shadow, 0.72)} color={F.text} dot={F.light} size={19} align="end" />
        <Pill x={HOLE_X} y={GROUND + 44} text="23 cm" fill={alpha(F.shadow, 0.72)} color={F.text} size={17} align="middle" />
        {title ? (
          <g>
            <Kicker x={120} y={128} text="12 km down · 180 °C" color={F.dim} size={20} />
            <Headline x={120} y={250} lines={["Where rock", "starts to flow"]} size={92} color={F.text} accent={F.light} shadow={F.shadow} />
          </g>
        ) : null}
        <Gauge x={1760} y={160} height={520} value={180} max={200} unit="°C" theme={F.theme} direction="up" title="HEAT" side="left" plate={110} readout readoutText="180 °C" format={(v) => `${v}°`} />
      </Layer>
    </Stage>
  );
};
