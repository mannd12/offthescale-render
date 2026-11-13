// `L15KitDemo`: one 1080p sheet (frames 0-114) laying out every L15 shared piece in motion across light and dark sky,
// then the chapter card (frames 115-149). Not part of the episode. Check it with stills 15 frames apart: every mover
// must visibly move between them. Numbers shown are jumpdata.ts values only (MODEL #20 with the OUR MODEL chip lit).
// USAGE: a reference for the package builders; read each panel's code for the props in use.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Family, IF2, Stage, Tick } from "../../lib/illustrated";
import { L15_COLORS, familyOf, skyAt, skyFamily } from "./families";
import { JUMPS, MODEL, SOUND, TEMP_READ, AIR_READ, atmAt, modelSpeedAt, pushAt } from "./jumpdata";
import { L15Gauges, airValue, speedValue } from "./L15Gauges";
import { AltRuler, Limb, SkyColumn } from "./sky";
import { AirCube, Balloon, Bracket, CardPanel, Chute, Flame, Jumper, Pin, Probe, Spiral, Stamp, Station, Stopwatch, Trace } from "./props";
import { L15Card } from "./L15Card";

export const L15_KIT_DEMO_FRAMES = 150;
const CARD_AT = 115;
const C = L15_COLORS;
const cl = (v: number) => Math.max(0, Math.min(1, v));

const Panel: React.FC<{ id: string; x: number; y: number; w: number; h: number; bg: string; label: string; ink?: string; children: React.ReactNode }> = ({ id, x, y, w, h, bg, label, ink = "#F2FBF7", children }) => (
  <g>
    <defs>
      <clipPath id={id}>
        <rect x={x} y={y} width={w} height={h} />
      </clipPath>
    </defs>
    <g clipPath={`url(#${id})`}>
      <rect x={x} y={y} width={w} height={h} fill={bg} />
      {children}
    </g>
    <rect x={x} y={y} width={w} height={h} fill="none" stroke="#000" strokeWidth={3} />
    <rect x={x + 6} y={y + 6} width={label.length * 9.6 + 16} height={26} rx={6} fill="rgba(0,0,0,0.45)" />
    <text x={x + 14} y={y + 25} style={{ fontFamily: IF2.label, fontSize: 16, letterSpacing: 1.5, fill: ink }}>
      {label}
    </text>
  </g>
);

const Sheet: React.FC<{ f: number }> = ({ f }) => {
  const studio = familyOf("studio");
  const dusk = familyOf("dusk");
  const PW = 413;
  const PH = 540;
  // B: camera falling 58 → 33 km, 6 km tall window (≈ 19.5 px/f)
  const bTop = 58 - f * 0.217;
  // right cluster: the model fall from 100 km, alt sweeping down (drawing only; readouts are table values)
  const alt = 100 - (f / 114) * 100;
  const T = atmAt(alt).tC;
  return (
    <g>
      {/* A · 0-6 km, locked: ground, balloon inflating and rising 9 px/f, jumper on the gondola, ruler */}
      <Panel id="kA" x={0} y={0} w={PW} h={PH} bg={skyAt(0)} label="A SkyColumn 0-6 km · ground · Balloon · AltRuler">
        <SkyColumn f={f} altTop={6} altBottom={-0.4} x={0} y={0} w={PW} h={PH} />
        <AltRuler f={f} altTop={6} altBottom={-0.4} x={30} y={0} h={PH} step={1} flags={false} color="#0E2A3E" />
        <Balloon x={250} y={470 - f * 2.6} size={220} f={f} inflate={cl(f / 110)} variant="gondola" payload={<Jumper x={0} y={0} h={34} f={f} pose="stand" />} />
      </Panel>
      {/* B · falling 58 → 33 km: stars fade in from 25 km, bands, ruler + flags streaming ≈ 19 px/f, probe with trail */}
      <Panel id="kB" x={PW} y={0} w={PW} h={PH} bg={skyAt(45)} label="B falling 58→33 km · bands · stars · Probe trail">
        <SkyColumn f={f} altTop={bTop} altBottom={bTop - 6} x={PW} y={0} w={PW} h={PH} bands streak={18} />
        <AltRuler f={f} altTop={bTop} altBottom={bTop - 6} x={PW + 30} y={0} h={PH} step={2} />
        <Probe x={PW + 270} y={260} size={120} f={f} variant="plain" trail={110} />
      </Panel>
      {/* C · 78-118 km locked: aurora, 100 km flag, a pin line drawing, probe spinning */}
      <Panel id="kC" x={PW * 2} y={0} w={PW} h={PH} bg={skyAt(100)} label="C 78-118 km · aurora · pin · Probe spin">
        <SkyColumn f={f} altTop={118} altBottom={78} x={PW * 2} y={0} w={PW} h={PH} bands={0.8} aurora drift={6} />
        <AltRuler f={f} altTop={118} altBottom={78} x={PW * 2 + 30} y={0} h={PH} step={10} pins={[{ altKm: 100, label: "edge?", draw: cl(f / 60), len: 360 }]} />
        <Probe x={PW * 2 + 280} y={380} size={100} f={f} variant="spin" />
      </Panel>
      {/* D · orbit: Limb sliding 8 px/f, Station glint, probe floating beside it, thruster flame */}
      <Panel id="kD" x={0} y={PH} w={PW} h={PH} bg={skyAt(400)} label="D orbit · Limb · Station · Probe float · Flame">
        <SkyColumn f={f} altTop={430} altBottom={380} x={0} y={PH} w={PW} h={PH} drift={3} ground={false} />
        <Limb f={f} cy={PH + 410} R={1400} cx={PW / 2} w={PW} />
        <Station x={170 + f * 0.6} y={PH + 190} size={230} f={f} />
        <Probe x={330} y={PH + 300} size={80} f={f} variant="float" tilt={90} lamp={false} />
        <Flame x={292} y={PH + 300} angle={180} len={90} f={f} on={cl((f - 30) / 10) * (1 - cl((f - 90) / 10))} />
      </Panel>
      {/* E · studio: jump card with a hanging silhouette under a beam balloon, drogue opening, stopwatch rolling to 4:20 */}
      <Panel id="kE" x={PW} y={PH} w={PW} h={PH} bg={studio.sky[1]} label="E CardPanel · Jumper hang · Chute · Stopwatch" ink="#0E2A3E">
        <CardPanel x={PW + 20} y={PH + 46} w={230} h={470} f={f} title="Eustace" sub={`${JUMPS.eustace.year} · no capsule`} appear={cl(f / 12)}>
          <Balloon x={97} y={260 - f * 0.6} size={130} f={f} variant="beam" payload={<Jumper x={0} y={0} h={60} f={f} pose="hang" />} />
        </CardPanel>
        <Chute x={PW + 330} y={PH + 330} size={90} f={f} open={cl((f - 10) / 40)} cross={cl((f - 70) / 20)} />
        <Jumper x={PW + 330} y={PH + 392} h={60} f={f} pose="drop" />
        <Stopwatch x={PW + 330} y={PH + 460} r={52} f={f} end={JUMPS.baumgartner.freefallS} t={cl(f / 100)} />
      </Panel>
      {/* F · void: trace drawing with peak tick, bracket, stamp slam, villain spiral, air cube swarm, pin */}
      <Panel id="kF" x={PW * 2} y={PH} w={PW} h={PH} bg={skyAt(70)} label="F Trace · Bracket · Stamp · Spiral · AirCube · Pin">
        <Spiral x={PW * 2 + 300} y={PH + 150} r={90} f={f} />
        <Trace
          pts={Array.from({ length: 30 }, (_, i) => [PW * 2 + 30 + i * 12, PH + 330 - Math.sin((i / 29) * Math.PI * 0.85) * 170] as [number, number])}
          head={cl(f / 90)}
          f={f}
          peak={14}
          peakLabel="peak"
          end="our model"
          ghost={0.3}
        />
        <Bracket x1={PW * 2 + 40} y1={PH + 380} x2={PW * 2 + 260} y2={PH + 380} draw={cl((f - 20) / 40)} label={`${JUMPS.baumgartner.gapS} s`} />
        <AirCube x={PW * 2 + 280} y={PH + 400} size={90} n={30} f={f} />
        <Stamp x={PW * 2 + 140} y={PH + 470} text="off the scale" age={f - 60} size={30} />
        <Pin x={PW * 2 + 60} y={PH + 230} text="sound" draw={cl((f - 5) / 30)} dx={70} dy={-50} />
      </Panel>
      {/* G · the cluster, dark plates on the bright studio: speed rising past the sea-level SOUND mark, air thinning */}
      <rect x={1240} y={0} width={340} height={790} fill={studio.sky[1]} />
      <g transform="translate(1252 70) scale(0.88)">
        <L15Gauges
          family={studio}
          frame={f}
          x={0}
          y={0}
          speed={{ value: cl(f / 80) * 1.0, soundT: TEMP_READ.sea, max: 1100, soundReadout: SOUND.sea, ghost: 0.45, pinned: f > 85 }}
          air={{ value: airValue((f / 114) * 40), readout: AIR_READ.sea, roll: cl(f / 30) }}
          push={{ value: (f / 114) * 1.4 }}
          cold={{ value: atmAt((f / 114) * 40).tC, readout: TEMP_READ.sea }}
        />
      </g>
      {/* H · the cluster, light plates on the dark sky: OUR MODEL lit, the fall from 100 km */}
      <rect x={1580} y={0} width={340} height={790} fill={skyAt(70)} />
      <g transform="translate(1592 70) scale(0.88)">
        <L15Gauges
          family={skyFamily(70)}
          frame={f}
          x={0}
          y={0}
          model
          speed={{ value: speedValue(modelSpeedAt(alt)), soundT: T, max: 1100, readout: MODEL.v40, roll: cl(f / 60), mach: MODEL.mach40 }}
          air={{ value: airValue(alt), readout: AIR_READ.at40g, lt: true, unit: "g/m³" }}
          push={{ value: pushAt(alt), readout: MODEL.pushPeakShown, approx: true, pinned: f > 100 }}
          cold={{ value: T, readout: TEMP_READ.at20, roll: 1 }}
        />
      </g>
      {/* I · dusk strip: Jumper poses (≤ 120 px, no face), main chute, Tick at the ruler foot */}
      <Panel id="kI" x={1240} y={790} w={680} h={290} bg={dusk.sky[1]} label="I Jumper poses · main Chute · Tick">
        <rect x={1240} y={1000} width={680} height={80} fill={C.dune3} />
        {(["stand", "step", "hang", "spin", "drop"] as const).map((p, i) => (
          <g key={p}>
            {p === "hang" ? <rect x={1300 + i * 95 - 30} y={870} width={60} height={6} rx={3} fill={C.saffron} /> : null}
            <Jumper x={1300 + i * 95} y={p === "hang" ? 876 : 1000} h={100} f={f} pose={p} color={i % 2 ? C.saffron : C.teal} />
            <text x={1300 + i * 95} y={1040} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 15, letterSpacing: 1.5, fill: "#F2FBF7" }}>
              {p.toUpperCase()}
            </text>
          </g>
        ))}
        <Chute x={1790} y={990 - Math.sin(f / 20) * 10} size={110} f={f} open={1} kind="main" />
        <Tick x={1870} y={1000} pxPerM={42} frame={f} pose="point" expression="surprised" />
      </Panel>
    </g>
  );
};

export const L15KitDemo: React.FC = () => {
  const f = useCurrentFrame();
  if (f >= CARD_AT) {
    const cf = f - CARD_AT;
    return <L15Card family={familyOf("void") as Family} kicker="— Off the Scale · The Edge" title="What If You Jumped From the Edge of Space?" t={0.3 + (cf / 35) * 0.4} frame={cf} />;
  }
  return (
    <Stage theme={familyOf("studio").theme} drift={false} grain={0} vignette={0}>
      <Sheet f={f} />
    </Stage>
  );
};
