// L17 scene "l04" · Ten years: the paint (storyboard §3 scene 4: 4-01…4-10, script lines 16-19; `noon` Eiffel plates →
// `dusk` at the schedule break → `night` joint and wall). Shot components (hard cuts only; PUSH/SLIDE rows are phases):
//   4-01 (+4-02)  the tower in clean lines; Tick swings on a painter's rope; the calendar flips, 136 YEARS; then the
//                 twenty coat stripes drop onto the stack (REPAINTED 20 TIMES)
//   4-03 (+4-04)  the timeline of twenty ticks, the bracket hopping (ABOUT ONCE EVERY 7 YEARS); the coats as strata
//   4-05          the 60 T bucket tips and pours; Tick holds its rope (60 T PER REPAINT)
//   4-06          the flakes lift off and pile at the tower's feet (ABOUT 15 TONNES)
//   4-07          the repaint wheel turns; the flakes keep falling
//   4-08          dusk: three repaint cards crossed off; the sun slides
//   4-09          night, close on a joint: paint strips curl away, bare iron shows (OUR REASONING)
//   4-10          the lattice wipes into a concrete wall with a grid of steel bars
// Numbers drawn (data17 READ, row 5): 136 YEARS (eiffelYears) · 20 (repaints) · ABOUT ONCE EVERY 7 YEARS (everySeven) ·
// 60 T (paintBucket) · 60 T PER REPAINT (paintTonnes) · ABOUT 15 TONNES (wearTonnes). The tower has no colour claim (F7).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bloom, Cumulus, Form, Layer, Metric, Motes, Sky, Stage, Tick, alpha, mixHex, rnd, rrect } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { READ } from "../data17";
import { Flakes, StarsTint } from "../movers17";
import { RungBadge } from "../ladder";
import { ReasoningPill, WordPill } from "../stamps17";
import { ShotDef, ShotFC, lineFrac, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { C, CREAM, DUSK, FlipCalendar, Floor, Label, LatticePanel, LatticeTower, MetricA, NIGHT, NOON, Phase, Pop, RebarBlock, Wheel, ez, lerp, lin, rollText, wrap } from "./a-parts";

const D2R = Math.PI / 180;
const INKT = "#3A3020"; // the tower's line ink (clean line art, no colour claim: F7)

export const cuesL04 = (t: SceneTiming) => {
  const { at } = cueKit(t);
  return {
    s01: 0,
    s02: lineFrac(t, 0, 0.31), // phase (push)
    s03: lineFrac(t, 0, 0.54),
    s04: lineFrac(t, 0, 0.76), // phase (slide)
    s05: lineFrac(t, 1, 0.01),
    s06: at(2),
    s07: lineFrac(t, 2, 0.5),
    s08: at(3),
    s09: lineFrac(t, 3, 0.32),
    s10: lineFrac(t, 3, 0.67),
    end: t.frames,
  };
};
export type CL04 = ReturnType<typeof cuesL04>;

const NoonField: React.FC<{ f: number; sun?: [number, number] }> = ({ f, sun = [1560, 180] }) => (
  <g>
    <Sky family={NOON} />
    <Layer depth={0.15}>
      <Bloom x={sun[0]} y={sun[1]} r={520} color="#FFF3C8" core={60} coreColor="#FFFBEA" strength={0.8} />
    </Layer>
    <Layer depth={0.3}>
      {[0, 1, 2].map((i) => (
        <Cumulus key={i} x={-500 + wrap(f * 1.8 + i * 900, 2800)} y={220 + i * 70} w={380 + i * 60} h={100 + i * 14} fill="#FFFFFF" shade="#CFEAE4" lit="#FFFFFF" seed={i + 4} frame={f} />
      ))}
    </Layer>
  </g>
);

// a painter's brush (held at a point, angled)
const Brush: React.FC<{ x: number; y: number; s?: number; angle?: number; paint?: string }> = ({ x, y, s = 1, angle = -20, paint = "#E0A93A" }) => (
  <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${s})`}>
    <rect x={-5} y={-50} width={10} height={44} rx={4} fill="#7A4A20" />
    <rect x={-14} y={-8} width={28} height={12} rx={3} fill="#5A6E72" />
    <path d="M-14 4 L14 4 L10 34 L-10 34 Z" fill={paint} />
  </g>
);

// ================================================================================================================
// 4-01 + 4-02 · the tower fills the frame; Tick swings on a painter's rope (4 deg/f); the calendar pages flip (30 px/f);
// the counter rolls to 136 YEARS; push to the base: twenty coat stripes drop onto a stack (30 px/f, stagger 4 f), 20
// ================================================================================================================
const COATS = ["#E0A93A", "#2F7F6E", "#C98A2E", "#5FB09A", "#E3813F", "#2A6E78", "#F2B544", "#3F8E5E", "#9C6A16", "#7FD0E8"];
const ShotRope: ShotFC<CL04> = ({ f, c }) => {
  const T2 = c.s02 - c.s01;
  const swing = 20 * Math.sin(f * 0.2);
  const anchor = { x: 1080, y: 230 };
  const rope = 430;
  const tx = anchor.x + Math.sin(swing * D2R) * rope;
  const ty = anchor.y + Math.cos(swing * D2R) * rope;
  const k = ez(f, 10, 90);
  const A = (
    <Stage theme={NOON.theme} cam={{ x: 980, y: 560, zoom: 1.02 + f * 0.0008 }} vignette={0.1} grain={0.5}>
      <NoonField f={f} />
      <Layer depth={1}>
        <Floor y={1020} color={NOON.mid} foot={NOON.near} lip="#FFF3C8" />
        <LatticeTower x={980} base={1030} h={1150} ink={INKT} />
        <line x1={anchor.x} y1={anchor.y} x2={tx} y2={ty - 150} stroke="#5A4A30" strokeWidth={5} />
        <g transform={`rotate(${-swing * 0.5} ${tx} ${ty - 150})`}>
          <rect x={tx - 50} y={ty - 20} width={100} height={14} rx={6} fill="#7A4A20" />
          <line x1={tx - 46} y1={ty - 14} x2={tx} y2={ty - 150} stroke="#5A4A30" strokeWidth={3} />
          <line x1={tx + 46} y1={ty - 14} x2={tx} y2={ty - 150} stroke="#5A4A30" strokeWidth={3} />
          <Tick x={tx} y={ty - 18} pxPerM={90} frame={f} facing={1} pose="cheer" expression="proud" />
          <Brush x={tx + 40} y={ty - 160} s={0.9} angle={-30} />
        </g>
        <FlipCalendar x={1560} y={900} w={240} page={f / 8} words={["", "", ""]} band="#E0A93A" />
      </Layer>
      <Layer depth={0}>
        <RungBadge f={f} rung={3} family={NOON} />
        <Metric x={130} y={1000} value={rollText(READ.eiffelYears.value!, k)} unit="YEARS" size={120} color={C.ink} />
      </Layer>
    </Stage>
  );
  const g = Math.max(0, f - T2);
  const nDropped = Math.min(20, Math.max(0, (g - 6) / 4));
  const B = (
    <Stage theme={NOON.theme} shotFrame={g} drift={{ zoom: 1.05, panX: 0.02, panY: 0, frames: 120, seed: 2 }} vignette={0.1} grain={0.5}>
      <NoonField f={f} />
      <Layer depth={1}>
        <Floor y={980} color={NOON.mid} foot={NOON.near} lip="#FFF3C8" />
        <g transform="translate(960 980) scale(2.2) translate(-960 -980)">
          <LatticeTower x={960} base={1000} h={1150} ink={INKT} reveal={0.32} />
        </g>
        {Array.from({ length: 20 }, (_, i) => {
          const land = 960 - (i + 1) * 22;
          const u = nDropped - i;
          if (u <= 0) return null;
          const y = u >= 1 ? land : lerp(-100, land, u);
          return <Form key={i} d={rrect(1340, y, 360, 20, 8)} fill={COATS[i % COATS.length]} light={225} shadow="#1F4F4C" shadowOpacity={0.4} inset={4} rim="#FFFFFF" hard />;
        })}
      </Layer>
      <Layer depth={0}>
        <Label x={130} y={150} text="repainted" size={32} color={C.ink} align="start" />
        <Metric x={130} y={290} value={rollText(READ.repaints.value!, nDropped / 20)} unit="TIMES" size={130} color={C.ink} />
      </Layer>
    </Stage>
  );
  return <Phase f={f} at={T2 - 6} dur={14} kind="push" a={A} b={B} />;
};

// ================================================================================================================
// 4-03 + 4-04 · a timeline of twenty ticks; a bracket hops along it (28 px/f) lighting each stripe (ABOUT ONCE EVERY 7
// YEARS); slide to the iron skin in cutaway: twenty coats build outward as strata (12 px/f) while a brush sweeps (20 px/f)
// ================================================================================================================
const ShotTimeline: ShotFC<CL04> = ({ f, c }) => {
  const T4 = c.s04 - c.s03;
  const hop = Math.min(19, Math.floor(f / 3));
  const hopK = (f % 3) / 3;
  const x0 = 220;
  const gap = 78;
  const bx = x0 + (hop + (f / 3 >= 19 ? 0 : hopK)) * gap - gap / 2;
  const A = (
    <Stage theme={NOON.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.015, panY: 0, frames: 140, seed: 3 }} vignette={0.1} grain={0.5}>
      <NoonField f={f} />
      <Layer depth={1}>
        <Floor y={900} color={NOON.mid} foot={NOON.near} lip="#FFF3C8" />
        <rect x={x0 - 40} y={590} width={20 * gap + 20} height={16} rx={8} fill={C.ink} />
        {Array.from({ length: 20 }, (_, i) => {
          const lit = i <= hop;
          return (
            <g key={i}>
              <rect x={x0 + i * gap - 18} y={480} width={36} height={110} rx={8} fill={lit ? COATS[i % COATS.length] : alpha(C.ink, 0.15)} />
              <rect x={x0 + i * gap - 3} y={590} width={6} height={40} fill={C.ink} />
            </g>
          );
        })}
        <path d={`M${bx - 30} 440 L${bx - 30} 420 L${bx + gap + 30} 420 L${bx + gap + 30} 440`} fill="none" stroke={C.ink} strokeWidth={8} strokeLinejoin="round" transform={`translate(0 ${-Math.sin(hopK * Math.PI) * 30})`} />
      </Layer>
      <Layer depth={0}>
        <WordPill x={120} y={110} text={READ.everySeven.text} size={28} appear={ez(f, 6, 18)} />
      </Layer>
    </Stage>
  );
  const g = Math.max(0, f - T4);
  const coats = Math.min(20, g / 1.2);
  const brushY = 260 + Math.abs(((g * 20) % 1100) - 550) + 0;
  const front = 700 + coats * 14;
  const B = (
    <Stage theme={NOON.theme} shotFrame={g} drift={{ zoom: 1.05, panX: 0.02, panY: 0, frames: 120, seed: 4 }} vignette={0.1} grain={0.5}>
      <NoonField f={f} />
      <Layer depth={1}>
        {/* the iron skin in section: a dark plate, then the coats as strata */}
        <Form d={rrect(380, 120, 320, 900, 10)} fill="#5A6E72" light={225} shadow="#1F4F4C" shadowOpacity={0.5} inset={20} rim="#CFE6EA" hard />
        {Array.from({ length: Math.ceil(coats) }, (_, i) => {
          const w = i === Math.floor(coats) ? (coats - i) * 14 : 14;
          return <rect key={i} x={700 + i * 14} y={120} width={w} height={900} fill={COATS[i % COATS.length]} />;
        })}
        <rect x={front - 2} y={120} width={4} height={900} fill="#FFFFFF" opacity={0.6} />
        <Brush x={front + 40} y={brushY} s={2.6} angle={-80} paint={COATS[Math.floor(coats) % COATS.length]} />
      </Layer>
    </Stage>
  );
  return <Phase f={f} at={T4 - 6} dur={15} kind="slide" a={A} b={B} />;
};

// ================================================================================================================
// 4-05 · the 60 T bucket tips (6 deg/f) and paint pours down the tower (22 px/f); Tick holds the bucket rope, straining
// ================================================================================================================
const ShotBucket: ShotFC<CL04> = ({ f }) => {
  const tip = Math.min(70, Math.max(0, f - 8) * 6);
  const pour = Math.max(0, f - 20) * 22;
  const B = { x: 1040, y: 260 };
  return (
    <Pop f={f}>
      <Stage theme={NOON.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.012, panY: 0, frames: 120, seed: 5 }} vignette={0.1} grain={0.5}>
        <NoonField f={f} />
        <Layer depth={1}>
          <Floor y={1000} color={NOON.mid} foot={NOON.near} lip="#FFF3C8" />
          <g transform="translate(1200 1000) scale(1.6) translate(-1200 -1000)">
            <LatticeTower x={1200} base={1000} h={900} ink={INKT} reveal={0.6} />
          </g>
          {/* the stream */}
          {tip > 30 ? <path d={`M${B.x + 120} ${B.y + 40} Q${B.x + 170} ${B.y + 120} ${B.x + 160} ${Math.min(1000, B.y + 80 + pour)}`} fill="none" stroke="#E0A93A" strokeWidth={34} strokeLinecap="round" /> : null}
          {tip > 30 ? <path d={`M${B.x + 120} ${B.y + 40} Q${B.x + 166} ${B.y + 120} ${B.x + 154} ${Math.min(1000, B.y + 80 + pour)}`} fill="none" stroke="#FFE6A8" strokeWidth={8} strokeLinecap="round" opacity={0.7} /> : null}
          {/* the bucket on its rope */}
          <line x1={B.x - 400} y1={0} x2={B.x} y2={B.y - 90} stroke="#5A4A30" strokeWidth={5} />
          <g transform={`rotate(${tip} ${B.x} ${B.y})`}>
            <path d={`M${B.x - 90} ${B.y - 80} L${B.x + 90} ${B.y - 80} L${B.x + 70} ${B.y + 80} L${B.x - 70} ${B.y + 80} Z`} fill="#5A6E72" stroke="#1F4F4C" strokeWidth={6} />
            <ellipse cx={B.x} cy={B.y - 80} rx={90} ry={18} fill="#E0A93A" />
            <path d={`M${B.x - 90} ${B.y - 80} Q${B.x} ${B.y - 190} ${B.x + 90} ${B.y - 80}`} fill="none" stroke="#1F4F4C" strokeWidth={6} />
            <Label x={B.x} y={B.y + 20} text={READ.paintBucket.text} size={44} color={CREAM} weight={800} />
          </g>
          {/* the rope down to Tick */}
          <line x1={B.x - 60} y1={B.y + 70} x2={560} y2={760} stroke="#5A4A30" strokeWidth={6} />
          <Tick x={480} y={1000} pxPerM={270} frame={f} facing={1} pose="heave" expression="determined" look={0.6} />
        </Layer>
        <Layer depth={0}>
          <WordPill x={120} y={110} text={READ.paintTonnes.text} size={28} appear={ez(f, 10, 22)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 4-06 · a pale fog of flakes lifts off the tower (10-16 px/f) and piles at its feet; the pile grows (ABOUT 15 TONNES)
// ================================================================================================================
const ShotFlakes: ShotFC<CL04> = ({ f, len }) => (
  <Pop f={f}>
    <Stage theme={NOON.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.015, panY: 0.01, frames: 130, seed: 6 }} vignette={0.1} grain={0.5}>
      <NoonField f={f} />
      <Layer depth={1}>
        <Floor y={980} color={NOON.mid} foot={NOON.near} lip="#FFF3C8" />
        <LatticeTower x={1020} base={980} h={900} ink={INKT} />
        <Flakes f={f} x={700} y={150} w={640} h={830} n={80} speed={14} color="#F2D8A8" pile={{ x: 1020, y: 980, w: 760, grow: lin(f, 0, len) }} seed={3} />
        <Flakes f={f + 30} x={760} y={150} w={520} h={830} n={50} speed={11} color="#E0A93A" seed={7} />
      </Layer>
      <Layer depth={0}>
        <MetricA x={130} y={1000} value={READ.wearTonnes.text} size={100} color={C.ink} scrim={alpha("#FFFBEA", 0.7)} opacity={ez(f, 8, 20)} />
      </Layer>
    </Stage>
  </Pop>
);

// ================================================================================================================
// 4-07 · the repaint wheel turns (6 deg/f), one notch per repaint; the flakes keep falling (10 px/f)
// ================================================================================================================
const ShotSchedule: ShotFC<CL04> = ({ f }) => (
  <Pop f={f}>
    <Stage theme={NOON.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.02, panY: 0, frames: 140, seed: 7 }} vignette={0.1} grain={0.5}>
      <NoonField f={f} />
      <Layer depth={1}>
        <Floor y={980} color={NOON.mid} foot={NOON.near} lip="#FFF3C8" />
        <LatticeTower x={1460} base={980} h={760} ink={INKT} />
        <Flakes f={f} x={1180} y={240} w={560} h={740} n={50} speed={10} color="#F2D8A8" seed={9} />
        <Wheel x={640} y={560} r={300} angle={f * 6} notches={20} hot={[0, 5, 10, 15]} fill={C.paper} />
        <g transform={`rotate(${f * 6} 640 560)`}>
          {Array.from({ length: 20 }, (_, i) => {
            const a = ((i / 20) * 360 - 90) * D2R;
            return <circle key={i} cx={640 + Math.cos(a) * 340} cy={560 + Math.sin(a) * 340} r={14} fill={COATS[i % COATS.length]} />;
          })}
        </g>
      </Layer>
    </Stage>
  </Pop>
);

// ================================================================================================================
// 4-08 · dusk: three repaint cards crossed off one by one (40 px/f, stagger 10 f); the sun disc slides (12 px/f)
// ================================================================================================================
const ShotSkip: ShotFC<CL04> = ({ f }) => {
  const sunX = 300 + f * 12;
  return (
    <Pop f={f}>
      <Stage theme={DUSK.theme} cam={{ x: 960 + f * 0.6, y: 540, zoom: 1.02 + f * 0.0008 }} vignette={0.24} grain={0.5}>
        <Sky family={DUSK} />
        <Layer depth={0.15}>
          <Bloom x={sunX} y={720} r={420} color="#FFCF73" core={80} coreColor="#FFF2C8" strength={0.95} />
        </Layer>
        <Layer depth={0.5}>
          <LatticeTower x={1580} base={1000} h={720} ink="#14262E" fill="#3F7F8E" />
        </Layer>
        <Layer depth={1}>
          <Floor y={980} color="#0F3540" foot="#082028" lip="#F6B45A" />
          {[0, 1, 2].map((i) => {
            const x = 330 + i * 340;
            const k = lin(f, 14 + i * 10, 14 + i * 10 + 7);
            return (
              <g key={i}>
                <Form d={rrect(x - 130, 330, 260, 300, 18)} fill={C.paper} light={225} shadow="#9C6A16" shadowOpacity={0.4} inset={12} rim="#FFFFFF" hard />
                <rect x={x - 130} y={330} width={260} height={56} rx={18} fill="#E0A93A" />
                <Brush x={x} y={540} s={1.6} angle={-30} />
                {k > 0 ? <line x1={x - 110} y1={350} x2={x - 110 + 220 * k} y2={350 + 260 * k} stroke="#082028" strokeWidth={18} strokeLinecap="round" /> : null}
                {k > 0 ? <line x1={x + 110} y1={350} x2={x + 110 - 220 * k} y2={350 + 260 * k} stroke="#082028" strokeWidth={18} strokeLinecap="round" /> : null}
              </g>
            );
          })}
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 4-09 · night, close on a lattice joint: paint strips peel and curl away (20 px/f); flakes fall (12 px/f); bare iron shows
// ================================================================================================================
const ShotPeel: ShotFC<CL04> = ({ f }) => (
  <Pop f={f}>
    <Stage theme={NIGHT.theme} cam={{ x: 960 + f * 0.6, y: 540, zoom: 1.04 + f * 0.0009 }} vignette={0.38} grain={0.5}>
      <Sky family={NIGHT} />
      <Layer depth={0.1}>
        <StarsTint f={f} n={80} speed={2} seed={13} />
      </Layer>
      <Layer depth={1}>
        <Bloom x={960} y={540} r={620} color={C.amber} strength={0.22} />
        <LatticePanel x={-100} y={300} w={2200} h={480} cells={5} ink="#3F5A60" width={44} />
        {/* the paint coat on the beam peeling in strips that curl up and off */}
        {Array.from({ length: 7 }, (_, i) => {
          const st = 6 + i * 12;
          const u = Math.max(0, f - st);
          const x = 300 + i * 200;
          const curl = Math.min(220, u * 20);
          return (
            <g key={i}>
              <rect x={x} y={276} width={170} height={48} fill={u > 0 ? "#6E5040" : "#C98A2E"} />
              {u > 0 ? (
                <path d={`M${x} 280 q${curl * 0.4} ${-curl * 0.9} ${curl * 0.9} ${-curl * 0.4} l${-10} 40 q${-curl * 0.4} ${curl * 0.2} ${-curl * 0.9 + 170} ${curl * 0.4 + 0}`} fill="#C98A2E" stroke="#7A4A20" strokeWidth={3} opacity={1 - Math.min(1, u / 60)} />
              ) : null}
            </g>
          );
        })}
        <Flakes f={f} x={200} y={320} w={1500} h={760} n={50} speed={12} color="#C98A2E" seed={11} />
      </Layer>
      <Layer depth={0}>
        <ReasoningPill x={120} y={110} size={26} appear={ez(f, 10, 22)} />
      </Layer>
    </Stage>
  </Pop>
);

// ================================================================================================================
// 4-10 · the lattice melts by wipe (30 px/f) into a concrete wall in cutaway with a grid of steel bars; dust drifts
// ================================================================================================================
const ShotToConcrete: ShotFC<CL04> = ({ f }) => {
  const wipeX = Math.min(2000, f * 30);
  return (
    <Pop f={f}>
      <Stage theme={NIGHT.theme} cam={{ x: 960 + f * 0.5, y: 540, zoom: 1.03 + f * 0.0008 }} vignette={0.38} grain={0.5}>
        <Sky family={NIGHT} />
        <Layer depth={0.1}>
          <StarsTint f={f} n={70} speed={2} seed={15} />
        </Layer>
        <Layer depth={1}>
          <g opacity={1 - ez(f, 40, 70)}>
            <LatticePanel x={-100} y={300} w={2200} h={480} cells={5} ink="#3F5A60" width={44} />
          </g>
          <defs>
            <clipPath id="l17a-wipe410">
              <rect x={-200} y={-200} width={wipeX + 200} height={1600} />
            </clipPath>
          </defs>
          <g clipPath="url(#l17a-wipe410)">
            <RebarBlock x={140} y={160} w={1640} h={780} bars={4} glint={-200 + f * 24} concrete="#8F8670" steel="#6E8C96" seed={4} />
            {Array.from({ length: 5 }, (_, i) => (
              <rect key={i} x={340 + i * 320} y={190} width={30} height={720} rx={15} fill="#6E8C96" opacity={0.9} />
            ))}
          </g>
          <rect x={wipeX - 6} y={0} width={12} height={1080} fill={C.amber} opacity={wipeX < 1920 ? 0.8 : 0} />
          <Motes frame={f} n={40} w={1920} h={1080} color={alpha("#E8D9C0", 0.7)} seed={16} drift={30} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================

export const SceneL04: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL04(t);
  const shots: ShotDef<CL04>[] = [
    { from: 0, S: ShotRope, id: "4-01" }, // + 4-02
    { from: c.s03, S: ShotTimeline, id: "4-03" }, // + 4-04
    { from: c.s05, S: ShotBucket, id: "4-05" },
    { from: c.s06, S: ShotFlakes, id: "4-06" },
    { from: c.s07, S: ShotSchedule, id: "4-07" },
    { from: c.s08, S: ShotSkip, id: "4-08" },
    { from: c.s09, S: ShotPeel, id: "4-09" },
    { from: c.s10, S: ShotToConcrete, id: "4-10" },
  ];
  return <AbsoluteFill>{playShots(f, shots, c, t.frames)}</AbsoluteFill>;
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL04 = (t: SceneTiming): Cue[] => {
  const c = cuesL04(t);
  const run = (at: number, n: number, gap: number, vol = 0.08): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 8 }));
  return [
    ...run(10, 10, 8),
    { at: c.s02 - 6, file: SFX.whoosh, vol: 0.12, dur: 40 },
    ...run(c.s02 + 6, 20, 4, 0.06),
    ...cutHit(c.s03),
    ...run(c.s03 + 2, 6, 9, 0.1),
    { at: c.s04 - 4, file: SFX.swirl, vol: 0.14, dur: 50 },
    ...cutHit(c.s05),
    { at: c.s05 + 20, file: SFX.pop, vol: 0.14, dur: 16 },
    ...cutHit(c.s06),
    ...cutHit(c.s07),
    { at: c.s07 + 4, file: SFX.click, vol: 0.12, dur: 8 },
    ...cutHit(c.s08),
    ...run(c.s08 + 14, 3, 10, 0.12),
    ...cutHit(c.s09),
    { at: c.s09 + 6, file: SFX.debris, vol: 0.14, dur: 90, fadeOut: 30 },
    ...cutHit(c.s10),
    { at: c.s10 + 2, file: SFX.swirl, vol: 0.16, dur: 60 },
  ];
};
