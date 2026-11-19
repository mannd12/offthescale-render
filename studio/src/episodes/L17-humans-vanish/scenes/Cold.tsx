// L17 scene "cold" · the empty city, the balance scale, the ladder (storyboard §3 cold open: C-01…C-12, script lines 0-3;
// `night` skyline and street ↔ `dusk` balance scale ↔ `night` ladder; the ONE DAY RungCard). Shot components (hard cuts
// only; PUSH rows are phases of one component):
//   C-01 (+C-02)        the time camera on its rail before the lit skyline; the push into the empty street
//   C-03 (+C-04)        the skyline slides onto the giant scale; the beam swings, settles level (KEY ART 1 at 348)
//   C-05                plates drop on both pans; both counters roll to 1.1 TRILLION TONNES (ABOUT)
//   C-06                the city stack doubles twice as the 20-YEARS ring turns
//   C-07                the tilt up the tall box tower; Tick shades his visor
//   C-08                the top boxes crumble into dots; slabs slide away
//   C-09                the KEEP FIXING ribbon unrolls; repair tags pin on
//   C-10 (+C-11, C-12)  Tick turns the YEARS dial, the ladder draws, the lights go out; the climb; the ONE DAY card
// Numbers drawn (all data17 READ): 1.1 (massTonnes, row 1, + ABOUT) · 20 (doubling, row 1). Dial/rung words are scale labels.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bloom, Conifer, Form, Layer, Metric, Motes, Puffs, ShadedRidge, Sky, Stage, Stratus, Tick, Vignette, alpha, mixHex, rnd, rrect } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { READ } from "../data17";
import { Rail, TimeCamera } from "../rig";
import { Skyline, Street, drainFor } from "../city";
import { DotStream, StarsTint } from "../movers17";
import { RUNGS, RungCard, TimeLadder, YearsDial, rungValue } from "../ladder";
import { AboutPill, WordPill } from "../stamps17";
import { ShotDef, ShotFC, lineFrac, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { BoxStack, C, CREAM, ClipBox, DUSK, Floor, Label, NIGHT, Phase, Pop, Slam, Wheel, ez, lerp, lin, rollText, wrap } from "./a-parts";

const D2R = Math.PI / 180;

export const cuesCold = (t: SceneTiming) => {
  const { at } = cueKit(t);
  return {
    c01: 0,
    c02: lineFrac(t, 0, 0.49), // phase
    c03: at(1),
    c04: lineFrac(t, 1, 0.23), // phase
    c05: lineFrac(t, 1, 0.59),
    c06: at(2),
    c07: lineFrac(t, 2, 0.35),
    c08: lineFrac(t, 2, 0.55),
    c09: lineFrac(t, 2, 0.75),
    c10: at(3),
    c11: lineFrac(t, 3, 0.35), // phase
    c12: lineFrac(t, 3, 0.75), // phase (the card)
    end: t.frames,
  };
};
export type CCold = ReturnType<typeof cuesCold>;

// ================================================================================================================
// the dusk world behind the scale: apricot sun upper left, three hill planes with haze, a warm floor
// ================================================================================================================
const DuskWorld: React.FC<{ f: number; floor?: number }> = ({ f, floor = 930 }) => (
  <g>
    <Layer depth={0.15}>
      <Bloom x={360} y={250} r={520} color="#FFCF73" core={60} coreColor="#FFF2C8" strength={0.9} />
      <Stratus x={-200 + wrap(f * 1.6, 2600) - 300} y={300} w={760} h={60} fill={alpha("#FFD9A8", 0.5)} lit="#FFF2C8" />
      <Stratus x={900 + wrap(f * 1.2, 2600) - 1300} y={200} w={560} h={46} fill={alpha("#FFD9A8", 0.4)} lit="#FFF2C8" />
    </Layer>
    <Layer depth={0.3} haze={{ color: DUSK.haze, amount: 0.45 }}>
      <ShadedRidge pts={[[-400, 720], [100, 640], [420, 690], [780, 610], [1180, 680], [1560, 600], [2000, 670], [2400, 640]]} base={1100} fill={DUSK.far} shadow={mixHex(DUSK.far, "#082028", 0.3)} />
    </Layer>
    <Layer depth={0.55} haze={{ color: DUSK.haze, amount: 0.2 }}>
      <ShadedRidge pts={[[-400, 820], [200, 760], [640, 800], [1100, 740], [1500, 800], [2000, 760], [2400, 800]]} base={1200} fill={DUSK.mid} shadow={mixHex(DUSK.mid, "#082028", 0.35)} />
      {[180, 360, 1620, 1780].map((x, i) => (
        <Conifer key={i} x={x} y={790 + (i % 2) * 14} h={110 + (i % 2) * 30} litColor="#3F8E7E" shadeColor="#1C4F50" sway={Math.sin(f / 40 + i) * 2} />
      ))}
    </Layer>
    <Layer depth={1}>
      <Floor y={floor} color="#2C5A5A" lip="#F6B45A" foot="#0F3540" />
    </Layer>
  </g>
);

// the heap of living things on the right pan: leaves, small trees, a whale, ants (shuffling: small, fast offsets)
const LifeHeap: React.FC<{ x: number; y: number; f: number; s?: number }> = ({ x, y, f, s = 1 }) => {
  const sh = (i: number, a = 6) => Math.sin(f / 4 + i * 1.9) * a;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-170 0 Q-150 -90 -60 -120 Q0 -150 60 -118 Q150 -90 170 0 Z" fill="#2F7F6E" />
      <path d="M-150 -10 Q-130 -80 -60 -104 Q0 -128 50 -106" fill="none" stroke="#8FD2A0" strokeWidth={5} opacity={0.6} />
      {/* the whale: a teal back with a lit ridge and a fluke */}
      <g transform={`translate(${sh(1, 3)} ${-120 + sh(2, 2)})`}>
        <path d="M-90 0 Q-60 -52 20 -48 Q80 -44 96 -10 L130 -36 L124 4 L96 4 Q40 20 -60 14 Q-92 10 -90 0 Z" fill="#2F6F80" />
        <path d="M-80 -8 Q-50 -44 20 -42" fill="none" stroke="#9FE8E0" strokeWidth={5} opacity={0.8} />
        <circle cx={-56} cy={-10} r={4} fill="#06151D" />
      </g>
      {/* two small trees */}
      {[-120, 112].map((tx, i) => (
        <g key={i} transform={`translate(${tx + sh(3 + i, 2)} ${-60}) rotate(${sh(5 + i, 3)})`}>
          <rect x={-5} y={-8} width={10} height={40} fill="#6A4020" />
          <path d="M0 -80 L36 -6 L-36 -6 Z" fill="#3F8E5E" />
          <path d="M0 -80 L-36 -6 L0 -6 Z" fill="#5FB07A" />
        </g>
      ))}
      {/* leaves */}
      {Array.from({ length: 16 }, (_, i) => {
        const lx = -150 + rnd(i * 7 + 3) * 300 + sh(i, 5);
        const ly = -30 - rnd(i * 5 + 1) * 90 + sh(i + 9, 4);
        return <ellipse key={i} cx={lx} cy={ly} rx={14} ry={7} fill={i % 3 ? "#8FC26A" : "#C9D86A"} transform={`rotate(${(i * 47 + f * 2) % 180} ${lx} ${ly})`} />;
      })}
      {/* ants marching along the heap's rim (4 px/f) */}
      {Array.from({ length: 10 }, (_, i) => {
        const u = wrap(f * 0.012 + i / 10, 1);
        const ax = -160 + u * 320;
        const ay = -Math.sin(u * Math.PI) * 112 - 8;
        return <ellipse key={i} cx={ax} cy={ay} rx={7} ry={4} fill="#14262E" />;
      })}
    </g>
  );
};

// the balance scale: post, pivot pin, beam rotated `theta` degrees (+ = right end down), two pans on strings
const PIV = { x: 960, y: 520 };
const HALF = 640;
const panAt = (theta: number, side: -1 | 1, drop = 0): [number, number] => [PIV.x + side * HALF * Math.cos(theta * D2R), PIV.y + side * HALF * Math.sin(theta * D2R) + 200 + drop];
const Scale: React.FC<{ theta: number; floor: number; left?: React.ReactNode; right?: React.ReactNode; bobL?: number; bobR?: number }> = ({ theta, floor, left, right, bobL = 0, bobR = 0 }) => {
  const [lx, ly] = panAt(theta, -1, bobL);
  const [rx, ry] = panAt(theta, 1, bobR);
  const pan = (x: number, y: number, content: React.ReactNode) => (
    <g>
      <line x1={x} y1={y - 200} x2={x - 170} y2={y} stroke="#3A2A14" strokeWidth={5} />
      <line x1={x} y1={y - 200} x2={x + 170} y2={y} stroke="#3A2A14" strokeWidth={5} />
      {content}
      <Form d={`M${x - 200} ${y} L${x + 200} ${y} Q${x + 170} ${y + 60} ${x} ${y + 64} Q${x - 170} ${y + 60} ${x - 200} ${y} Z`} fill="#C98A2E" light={225} shadow="#5A3010" shadowOpacity={0.6} inset={14} rim="#FFE6A8" hard />
    </g>
  );
  return (
    <g>
      <ellipse cx={PIV.x} cy={floor + 6} rx={260} ry={26} fill="#082028" opacity={0.4} />
      <Form d={`M${PIV.x - 36} ${floor} L${PIV.x - 18} ${PIV.y + 30} L${PIV.x + 18} ${PIV.y + 30} L${PIV.x + 36} ${floor} Z`} fill="#9C6A16" light={225} shadow="#3A2008" shadowOpacity={0.6} inset={12} rim="#FFE6A8" hard />
      <Form d={rrect(PIV.x - 150, floor - 40, 300, 46, 14)} fill="#7A4A20" light={225} shadow="#2A1408" shadowOpacity={0.6} inset={10} rim="#F6B45A" hard />
      {pan(lx, ly, left)}
      {pan(rx, ry, right)}
      <g transform={`rotate(${theta.toFixed(2)} ${PIV.x} ${PIV.y})`}>
        <Form d={rrect(PIV.x - HALF - 20, PIV.y - 18, HALF * 2 + 40, 36, 18)} fill="#E0A93A" light={225} shadow="#7A4A10" shadowOpacity={0.55} inset={10} rim="#FFF2C8" hard />
        <circle cx={PIV.x - HALF} cy={PIV.y} r={14} fill="#7A4A20" />
        <circle cx={PIV.x + HALF} cy={PIV.y} r={14} fill="#7A4A20" />
      </g>
      <circle cx={PIV.x} cy={PIV.y} r={30} fill="#7A4A20" />
      <circle cx={PIV.x} cy={PIV.y} r={14} fill="#FFE6A8" />
    </g>
  );
};

// ================================================================================================================
// C-01 + C-02 · the time camera on its rail before the lit skyline (rail ticks 12 px/f, the window wave 18 px/f, an
// amber cloud band 10 px/f); then the push into the empty street (lamp posts 18 px/f, the signal cycling, windows lit).
// ================================================================================================================
const ShotOpen: ShotFC<CCold> = ({ f, c }) => {
  const T2 = c.c02 - c.c01;
  const g = f - T2;
  const A = (
    <Stage theme={NIGHT.theme} cam={{ x: 960 + f * 0.9, y: 540 - f * 0.3, zoom: 1 + f * 0.0009 }} vignette={0.32} grain={0.5}>
      <Sky family={NIGHT} />
      <Layer depth={0.08}>
        <StarsTint f={f} n={90} speed={2} h={560} seed={3} />
      </Layer>
      <Layer depth={0.3}>
        <Bloom x={1000} y={700} r={900} color={C.amber} strength={0.32} squash={0.4} />
        <Stratus x={-500 + f * 10} y={330} w={1100} h={70} fill={alpha("#E3813F", 0.55)} lit="#FFCF73" />
        <Stratus x={600 + f * 10} y={250} w={700} h={50} fill={alpha("#E3813F", 0.4)} lit="#FFCF73" />
      </Layer>
      <Layer depth={0.45}>
        <Skyline f={f} family={NIGHT} ground={790} scale={0.85} lights={0.92} wave={18} seed={2} />
      </Layer>
      <Layer depth={1}>
        <Floor y={820} color="#0B2530" lip={C.amber} foot="#020B10" />
        <Rail f={f} y={905} speed={12} family={NIGHT} />
        <TimeCamera x={1120} y={890} size={230} f={f} family={NIGHT} dial={{ value: 0 }} />
        <Tick x={860} y={892} pxPerM={170} frame={f} facing={1} pose="hold" expression="neutral" look={0.3} />
        <Motes frame={f} n={26} w={1920} h={800} color={alpha(C.amber, 0.6)} seed={4} />
      </Layer>
    </Stage>
  );
  const B = (
    <Stage theme={NIGHT.theme} cam={{ x: 960 + Math.max(0, g) * 1.2, y: 540, zoom: 1.05 }} vignette={0.32} grain={0.5}>
      <Sky family={NIGHT} />
      <Layer depth={0.1}>
        <StarsTint f={f} n={70} speed={2} h={380} seed={6} />
      </Layer>
      <Layer depth={0.4}>
        <Skyline f={f} family={NIGHT} ground={720} scale={1.05} lights={0.95} wave={20} seed={5} />
        <Bloom x={960} y={640} r={900} color={C.amber} strength={0.3} squash={0.4} />
      </Layer>
      <Layer depth={1}>
        <Street f={Math.max(0, g)} family={NIGHT} y={860} speed={18} signal={1250} period={30} />
        <Motes frame={f} n={20} w={1920} h={800} color={alpha(C.amber, 0.6)} seed={8} />
      </Layer>
    </Stage>
  );
  return <Phase f={f} at={T2 - 6} dur={14} kind="push" a={A} b={B} />;
};

// ================================================================================================================
// C-03 + C-04 · the skyline slides off the street onto the scale's left pan (24 px/f); the beam swings from right-down to
// left-down (3 deg/f), Tick ducks; then the beam settles toward level (damped), both pans bob, Tick sits on the pivot.
// ================================================================================================================
const thetaAt = (f: number, land: number) => {
  if (f < land) return 12 + Math.sin(f / 6) * 0.8;
  if (f < land + 8) return lerp(12, -10, (f - land) / 8);
  const u = f - land - 8;
  return -10 * Math.exp(-u / 70) * Math.cos(u * 0.1) + 1.4 * Math.sin(f * 0.12);
};
const ShotScale: ShotFC<CCold> = ({ f, c }) => {
  const T4 = c.c04 - c.c03;
  const land = 38;
  const th = thetaAt(f, land);
  const thPrev = thetaAt(f - 1, land);
  const floor = 930;
  const [lx, ly] = panAt(th, -1);
  const slide = lin(f, 0, land);
  const stackX = lerp(-420, lx, slide);
  const stackY = lerp(floor - 20, ly, Math.pow(slide, 2));
  const bob = (side: number) => Math.sin(f / 3.2 + side) * 7 * Math.exp(-Math.max(0, f - land) / 90);
  // Tick: ducks under the beam (C-03), hops onto the pivot at T4, sits and gets bounced by the beam (C-04)
  const hop = ez(f, T4 - 12, T4 + 4);
  const tx = lerp(1180, PIV.x + 6, hop);
  const ty = lerp(floor, PIV.y - 26, hop) - Math.sin(hop * Math.PI) * 120 - (hop >= 1 ? Math.abs(th - thPrev) * 6 : 0);
  return (
    <Stage theme={DUSK.theme} cam={{ x: 960 - f * 0.6, y: 560, zoom: 1.02 + f * 0.0004 }} vignette={0.22} grain={0.5}>
      <Sky family={DUSK} />
      <DuskWorld f={f} floor={floor} />
      <Layer depth={1}>
        <Scale
          theta={th}
          floor={floor}
          bobL={bob(0)}
          bobR={bob(2)}
          left={slide >= 1 ? <BoxStack x={lx} base={ly + bob(0)} w={240} n={7} f={f} seed={3} sway={3} /> : null}
          right={<LifeHeap x={panAt(th, 1)[0]} y={panAt(th, 1)[1] + bob(2)} f={f} s={1} />}
        />
        {slide < 1 ? <BoxStack x={stackX} base={stackY} w={240} n={7} f={f} seed={3} sway={3} /> : null}
        <Tick
          x={tx}
          y={ty}
          pxPerM={hop >= 1 ? 120 : 150}
          frame={f}
          facing={hop >= 1 ? 1 : -1}
          pose={hop >= 1 ? "sit" : "crouch"}
          expression="surprised"
          look={hop >= 1 ? 0.5 : -0.3}
        />
        <Motes frame={f} n={24} w={1920} h={900} color={alpha("#FFE6A8", 0.7)} seed={11} />
      </Layer>
    </Stage>
  );
};

// ================================================================================================================
// C-05 · close on the two pans: a plate drops on each (30 px/f), both counters roll 0 → 1.1 (TRILLION TONNES, ABOUT)
// ================================================================================================================
const ShotPlates: ShotFC<CCold> = ({ f }) => {
  const k = ez(f, 26, 84);
  const plateY = (d: number) => Math.min(0, -600 + Math.max(0, f - d) * 30);
  const bob = (d: number) => (f > d + 20 ? Math.sin((f - d - 20) / 3) * 9 * Math.exp(-(f - d - 20) / 30) : 0);
  const pan = (x: number, d: number, word: string, child: React.ReactNode) => {
    const y = 700 + bob(d);
    return (
      <g>
        <line x1={x} y1={y - 420} x2={x - 260} y2={y} stroke="#3A2A14" strokeWidth={7} />
        <line x1={x} y1={y - 420} x2={x + 260} y2={y} stroke="#3A2A14" strokeWidth={7} />
        {child}
        <g transform={`translate(0 ${plateY(d)})`}>
          <Form d={rrect(x - 200, y - 150, 400, 140, 22)} fill="#FFF6E6" light={225} shadow="#9C6A16" shadowOpacity={0.5} inset={14} rim="#FFFFFF" hard />
          <Metric x={x} y={y - 64} value={rollText(READ.massTonnes.value!, k, 1)} size={84} color={C.ink} align="middle" />
          <Label x={x} y={y - 26} text="trillion tonnes" size={20} color="#4F6E7A" />
        </g>
        <Form d={`M${x - 300} ${y} L${x + 300} ${y} Q${x + 260} ${y + 90} ${x} ${y + 96} Q${x - 260} ${y + 90} ${x - 300} ${y} Z`} fill="#C98A2E" light={225} shadow="#5A3010" shadowOpacity={0.6} inset={16} rim="#FFE6A8" hard />
        <Label x={x} y={y + 150} text={word} size={28} color={CREAM} />
      </g>
    );
  };
  return (
    <Pop f={f}>
      <Stage theme={DUSK.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0.02, panY: 0.01, frames: 160, seed: 2 }} vignette={0.24} grain={0.5}>
        <Sky family={DUSK} />
        <Layer depth={0.2}>
          <Bloom x={300} y={220} r={480} color="#FFCF73" core={50} coreColor="#FFF2C8" strength={0.85} />
        </Layer>
        <Layer depth={0.5} haze={{ color: DUSK.haze, amount: 0.3 }}>
          <ShadedRidge pts={[[-300, 860], [300, 800], [800, 850], [1300, 790], [1800, 850], [2300, 810]]} base={1200} fill={DUSK.far} shadow={mixHex(DUSK.far, "#082028", 0.3)} />
        </Layer>
        <Layer depth={1}>
          <rect x={-200} y={260} width={2400} height={30} rx={15} fill="#E0A93A" />
          {pan(520, 6, "built", null)}
          {pan(1400, 14, "alive", null)}
          <AboutPill x={960} y={150} size={28} align="middle" appear={ez(f, 70, 86)} />
          <Motes frame={f} n={24} w={1920} h={900} color={alpha("#FFE6A8", 0.7)} seed={12} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// C-06 · the city stack doubles in two big stages as the 20-YEARS ring turns (6 deg/f); blocks drop on (30 px/f); tilt up
// ================================================================================================================
const ShotDouble: ShotFC<CCold> = ({ f }) => {
  const n = 6 + 6 * lin(f, 28, 58) + 12 * lin(f, 88, 128);
  const top = 960 - n * 104;
  const camY = Math.min(540, lerp(540, top + 360, ez(f, 30, 150)));
  const ringA = f * 6;
  return (
    <Pop f={f}>
      <Stage theme={DUSK.theme} cam={{ x: 980, y: camY, zoom: 1 }} vignette={0.24} grain={0.5}>
        <Sky family={DUSK} />
        <Layer depth={0.2}>
          <Bloom x={420} y={260} r={500} color="#FFCF73" core={50} coreColor="#FFF2C8" strength={0.85} />
        </Layer>
        <Layer depth={0.5} haze={{ color: DUSK.haze, amount: 0.3 }}>
          <ShadedRidge pts={[[-300, 900], [300, 840], [800, 880], [1300, 820], [1800, 880], [2300, 840]]} base={1400} fill={DUSK.far} shadow={mixHex(DUSK.far, "#082028", 0.3)} />
        </Layer>
        <Layer depth={1}>
          <Floor y={960} color="#2C5A5A" lip="#F6B45A" foot="#0F3540" />
          <Form d={rrect(780, 940, 400, 40, 12)} fill="#C98A2E" light={225} shadow="#5A3010" shadowOpacity={0.6} inset={10} rim="#FFE6A8" hard />
          <BoxStack x={980} base={942} w={300} n={n} f={f} seed={7} sway={3} drop={150} boxH={96} />
          <Motes frame={f} n={24} x={0} y={-1400} w={1920} h={2400} color={alpha("#FFE6A8", 0.7)} seed={13} />
        </Layer>
        <Layer depth={0}>
          <Wheel x={300} y={760} r={150} angle={ringA} notches={4} hot={[0]} fill={C.paper} />
          <Label x={300} y={772} text="20 years" size={30} color={C.ink} />
          <WordPill x={120} y={110} text={READ.doubling.text} size={26} appear={ez(f, 8, 20)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// C-07 · the camera tilts up the tall tower of boxes (24 px/f); boxes sway; Tick at the foot shades his visor, looks up
// ================================================================================================================
const ShotTall: ShotFC<CCold> = ({ f }) => {
  const camY = 540 - Math.max(0, f - 14) * 24;
  return (
    <Pop f={f}>
      <Stage theme={DUSK.theme} cam={{ x: 980, y: camY, zoom: 1 }} vignette={0.24} grain={0.5}>
        <Sky family={DUSK} />
        <Layer depth={0.15}>
          <Bloom x={380} y={240} r={520} color="#FFCF73" core={50} coreColor="#FFF2C8" strength={0.8} />
        </Layer>
        <Layer depth={0.4}>
          {[220, 1640].map((x, i) => (
            <BoxStack key={i} x={x} base={1000} w={180} n={14 + i * 4} f={f} seed={20 + i} sway={2} tone="#3F7F8E" lit={0.4} />
          ))}
        </Layer>
        <Layer depth={1}>
          <Floor y={980} color="#2C5A5A" lip="#F6B45A" foot="#0F3540" />
          <BoxStack x={1020} base={982} w={340} n={34} f={f} seed={9} sway={6} boxH={100} />
          <Tick x={700} y={984} pxPerM={190} frame={f} facing={1} pose="wipe-brow" expression="thinking" look={0.2} headTilt={-12} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// C-08 · the tower's top boxes crumble at the edges into dots blowing right (18 px/f); slabs slide away (20 px/f)
// ================================================================================================================
const ShotCrumble: ShotFC<CCold> = ({ f }) => {
  const slabs = [0, 1, 2, 3];
  return (
    <Pop f={f}>
      <Stage theme={DUSK.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.02, panY: 0.01, frames: 150, seed: 3 }} vignette={0.24} grain={0.5}>
        <Sky family={DUSK} />
        <Layer depth={0.2}>
          <Bloom x={360} y={260} r={500} color="#FFCF73" core={50} coreColor="#FFF2C8" strength={0.8} />
          <Stratus x={-200 + f * 3} y={240} w={800} h={60} fill={alpha("#FFD9A8", 0.45)} lit="#FFF2C8" />
        </Layer>
        <Layer depth={1}>
          <ClipBox x={-200} y={-200} w={2400} h={1480}>
            <BoxStack x={900} base={1300} w={380} n={9 - 2.2 * lin(f, 10, 80)} f={f} seed={9} sway={4} boxH={110} />
          </ClipBox>
          {slabs.map((i) => {
            const st = 8 + i * 16;
            const u = Math.max(0, f - st);
            const sx = 960 + i * 40 + u * 20;
            const sy = 340 + i * 60 + u * u * 0.08;
            return (
              <g key={i} transform={`rotate(${u * (1.5 + i * 0.4)} ${sx} ${sy})`} opacity={u > 0 ? 1 : 0}>
                <Form d={rrect(sx - 90, sy - 34, 180, 68, 10)} fill={mixHex("#2F6F80", i % 2 ? "#E3813F" : "#5A6E72", 0.35)} light={225} shadow="#06151D" shadowOpacity={0.5} inset={10} rim="#FFE6C0" hard />
              </g>
            );
          })}
          <DotStream f={f} from={[860, 360]} to={[2100, 200]} n={80} speed={18} spread={120} color="#FFE6C0" size={7} seed={4} />
          <DotStream f={f} from={[1000, 460]} to={[2100, 420]} n={50} speed={16} spread={90} color="#E3813F" size={6} seed={5} />
          <Puffs frame={f} x={980} y={420} color={alpha("#FFE6C0", 0.6)} period={14} size={30} rise={0.4} drift={4} life={50} seed={3} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// C-09 · a long ribbon of KEEP FIXING unrolls down the tower (40 px/f); small repair tags slam on (40 px/f)
// ================================================================================================================
const ShotRibbon: ShotFC<CCold> = ({ f }) => {
  const L = Math.min(1500, f * 40);
  const tags = [
    [700, 380, 14],
    [1280, 520, 30],
    [760, 700, 46],
    [1240, 860, 62],
    [820, 980, 78],
  ];
  return (
    <Pop f={f}>
      <Stage theme={DUSK.theme} cam={{ x: 980, y: 560 + f * 1.4, zoom: 1.02 + f * 0.0008 }} vignette={0.24} grain={0.5}>
        <Sky family={DUSK} />
        <Layer depth={0.2}>
          <Bloom x={360} y={260} r={500} color="#FFCF73" core={50} coreColor="#FFF2C8" strength={0.8} />
        </Layer>
        <Layer depth={1}>
          <BoxStack x={990} base={1500} w={420} n={16} f={f} seed={9} sway={3} boxH={110} />
          {/* the ribbon: a paper band hanging from the top, the words repeating along it */}
          <ClipBox x={880} y={-100} w={220} h={L + 100}>
            <rect x={900} y={-100} width={180} height={1700} rx={12} fill="#FFF6E6" />
            <rect x={900} y={-100} width={14} height={1700} fill="#E0A93A" />
            <rect x={1066} y={-100} width={14} height={1700} fill="#E0A93A" />
            {Array.from({ length: 6 }, (_, i) => (
              <text key={i} x={990} y={40 + i * 270} textAnchor="middle" transform={`rotate(90 990 ${40 + i * 270})`} style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 52, letterSpacing: 2, fill: C.ink }}>
                KEEP FIXING
              </text>
            ))}
          </ClipBox>
          <circle cx={990} cy={L - 100 + 10} r={46} fill="#E0A93A" />
          <circle cx={990} cy={L - 100 + 10} r={20} fill="#9C6A16" />
          {tags.map(([x, y, d], i) => (
            <Slam key={i} x={x} y={y} age={f - d}>
              <g>
                <rect x={x - 80} y={y - 30} width={160} height={60} rx={12} fill="#E0A93A" stroke="#9C6A16" strokeWidth={4} />
                <circle cx={x - 52} cy={y} r={9} fill="#9C6A16" />
                <path d={`M${x - 26} ${y + 14} l28 -28 m-6 -4 a12 12 0 1 0 14 14`} fill="none" stroke={C.ink} strokeWidth={7} strokeLinecap="round" />
                <rect x={x + 18} y={y - 6} width={46} height={12} rx={5} fill={C.ink} opacity={0.7} />
              </g>
            </Slam>
          ))}
          <Motes frame={f} n={24} w={1920} h={1400} color={alpha("#FFE6A8", 0.7)} seed={14} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// C-10 + C-11 + C-12 · Tick turns the YEARS dial (needle 4 deg/f), the HUD ladder draws up the right side (40 px/f), the
// skyline's windows go out (18 px/f); the camera climbs the ladder (rung labels 26 px/f, glows lighting); the ONE DAY card
// ================================================================================================================
const RUNG_GAP = 440;
const ShotLadder: ShotFC<CCold> = ({ f, len, c }) => {
  const T11 = c.c11 - c.c10;
  const T12 = c.c12 - c.c10;
  const v = lin(f, 18, 78);
  const rattle = f > 78 ? 1 : 0;
  const A = (
    <Stage theme={NIGHT.theme} cam={{ x: 960 + f * 0.5, y: 540, zoom: 1 + f * 0.0008 }} vignette={0.34} grain={0.5}>
      <Sky family={NIGHT} />
      <Layer depth={0.1}>
        <StarsTint f={f} n={90} speed={2} h={600} seed={9} />
      </Layer>
      <Layer depth={0.45}>
        <Skyline f={f} family={NIGHT} ground={800} scale={0.9} lights={0.9} wave={18} drain={drainFor(f, 10, 520, 18)} seed={2} />
      </Layer>
      <Layer depth={1}>
        <Floor y={830} color="#0B2530" lip={C.amber} foot="#020B10" />
        <Bloom x={760} y={520} r={420} color={C.amber} strength={0.35} />
        <YearsDial x={760} y={500} r={230} value={v} family={NIGHT} f={f} rattle={rattle} />
        <Tick x={430} y={880} pxPerM={210} frame={f} facing={1} pose="heave" expression="determined" look={0.4} />
        <Motes frame={f} n={20} w={1920} h={800} color={alpha(C.amber, 0.5)} seed={15} />
      </Layer>
      <Layer depth={0}>
        <TimeLadder f={f} family={NIGHT} draw={lin(f, 6, 6 + 940 / 40)} lit={0} />
      </Layer>
    </Stage>
  );
  const g = Math.max(0, f - T11);
  const camY = 540 - g * 26;
  const B = (
    <Stage theme={NIGHT.theme} cam={{ x: 1100, y: camY, zoom: 1 }} vignette={0.34} grain={0.5}>
      <Sky family={NIGHT} />
      <StarsTint f={g} n={110} speed={10} vertical dir={1} seed={12} />
      <Layer depth={1}>
        {[1240, 1600].map((rx, k) => (
          <line key={k} x1={rx} y1={1100} x2={rx} y2={900 - RUNG_GAP * 9} stroke="#E8F2EE" strokeWidth={10} strokeLinecap="round" />
        ))}
        {RUNGS.map((r, i) => {
          const y = 900 - i * RUNG_GAP;
          const screenY = y - camY + 540;
          const litK = Math.max(0, Math.min(1, (700 - screenY) / 80));
          return (
            <g key={i}>
              {litK > 0 ? <line x1={1240} y1={y} x2={1600} y2={y} stroke={C.vermilion} strokeWidth={46} strokeLinecap="round" opacity={0.25 * litK} /> : null}
              <line x1={1240} y1={y} x2={1600} y2={y} stroke={litK > 0.5 ? C.vermilion : "#E8F2EE"} strokeWidth={12} strokeLinecap="round" />
              {litK > 0 ? <circle cx={1420} cy={y} r={14 * litK} fill="#FFE2D6" /> : null}
              <Label x={1200} y={y + 14} text={r.label} size={40} color={litK > 0.5 ? C.saffronCore : alpha("#E8F2EE", 0.85)} align="end" />
            </g>
          );
        })}
      </Layer>
      <Layer depth={0}>
        <Bloom x={560} y={700} r={320} color={C.amber} strength={0.3} />
        <TimeCamera x={600} y={860} size={200} f={g} family={NIGHT} dial={{ value: rungValue(Math.min(8, g / 18)) }} />
        <Tick x={380} y={862} pxPerM={170} frame={g} facing={1} pose="point" expression={g > 60 ? "happy" : "surprised"} look={0.8} headTilt={-10} />
      </Layer>
    </Stage>
  );
  const kCard = (f - T12) / Math.max(1, len - T12);
  const Card = (
    <RungCard
      family={NIGHT}
      title="ONE DAY: THE LIGHTS"
      t={Math.max(0, kCard)}
      frame={f}
      rung={0}
      from={0}
      behind={(fr) => (
        <Layer depth={0.5}>
          <Skyline f={fr} family={NIGHT} ground={860} scale={0.8} lights={0.12} wave={14} seed={2} />
        </Layer>
      )}
    />
  );
  if (f >= T12 - 8) return <Phase f={f} at={T12 - 8} dur={12} kind="fade" a={B} b={Card} />;
  return <Phase f={f} at={T11 - 8} dur={14} kind="push" a={A} b={B} />;
};

// ================================================================================================================

export const SceneCold: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesCold(t);
  const shots: ShotDef<CCold>[] = [
    { from: 0, S: ShotOpen, id: "C-01" }, // + C-02
    { from: c.c03, S: ShotScale, id: "C-03" }, // + C-04
    { from: c.c05, S: ShotPlates, id: "C-05" },
    { from: c.c06, S: ShotDouble, id: "C-06" },
    { from: c.c07, S: ShotTall, id: "C-07" },
    { from: c.c08, S: ShotCrumble, id: "C-08" },
    { from: c.c09, S: ShotRibbon, id: "C-09" },
    { from: c.c10, S: ShotLadder, id: "C-10" }, // + C-11, C-12
  ];
  return <AbsoluteFill>{playShots(f, shots, c, t.frames)}</AbsoluteFill>;
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundCold = (t: SceneTiming): Cue[] => {
  const c = cuesCold(t);
  const run = (at: number, n: number, gap: number, vol = 0.08): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 8 }));
  return [
    { at: 0, file: SFX.rumble, vol: 0.12, dur: c.c03, fadeIn: 30, fadeOut: 30 },
    { at: c.c02 - 6, file: SFX.whoosh, vol: 0.12, dur: 40 },
    ...cutHit(c.c03),
    { at: c.c03 + 10, file: SFX.whoosh, vol: 0.16, dur: 50 },
    { at: c.c03 + 40, file: SFX.pop, vol: 0.14, dur: 16 },
    { at: c.c04 + 6, file: SFX.pop, vol: 0.12, dur: 16 },
    ...cutHit(c.c05),
    { at: c.c05 + 26, file: SFX.boom, vol: 0.26, dur: 90, fadeOut: 30 },
    ...cutHit(c.c06),
    ...run(c.c06 + 28, 6, 5),
    ...run(c.c06 + 88, 8, 5),
    ...cutHit(c.c07),
    ...cutHit(c.c08),
    { at: c.c08 + 6, file: SFX.debris, vol: 0.16, dur: 80, fadeOut: 20 },
    ...cutHit(c.c09),
    ...run(c.c09 + 14, 5, 16, 0.1),
    ...cutHit(c.c10),
    { at: c.c10 + 10, file: SFX.riser, vol: 0.12, dur: 70, fadeIn: 6, fadeOut: 12 },
    { at: c.c11 - 6, file: SFX.whoosh, vol: 0.16, dur: 50 },
    { at: c.c12 + 4, file: SFX.click, vol: 0.12, dur: 8 },
    { at: c.c12 + 8, file: SFX.boom, vol: 0.3, dur: 120, fadeOut: 40 },
  ];
};
