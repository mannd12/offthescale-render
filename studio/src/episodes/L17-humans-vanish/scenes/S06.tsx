// L17 scene "l06" · One thousand years: Rome (storyboard §3 scene 6: 6-01…6-11, script lines 24-27; `noon` Rome ↔ `studio`
// lab and paper ↔ `night` our wall ↔ `dusk` the cliff). Shot components (hard cuts only; SLIDE rows are phases):
//   6-01          the generic domed building; Tick walks up with a hammer; the YEARS dial spins and stops on MILLENNIA
//   6-02          a magnifier slides across the mortar; white lumps pop into view (2023, LIME LUMPS)
//   6-03          close on a crack with a lump; a toolbox opens over it, crystal tools pop out
//   6-04          water runs in; calcium dots stream from the lump; a pale crust grows across the gap
//   6-05          the lab bench: the dropper drips on the lumpy block, its crack seals; Tick with a loupe (IN A LAB,
//                 SELF-HEALING POTENTIAL)
//   6-06          the split frame: the dome whole, our steel-barred wall fallen; the divider sweeps across
//   6-07          the paper on the board: pages turn; PROPOSES, TESTS, POINTS AT tick in turn
//   6-08          night: our wall's cracks reopen by an empty scaffold and a dry roller; Tick shrugs (NEEDS PEOPLE TO PATCH)
//   6-09          the crust seals a Roman crack, a sparkle runs along it; Tick tips his visor
//   6-10 (+6-11)  the THOUSANDS OF YEARS bar grows and stops short; the A THOUSAND rung lights; the tilt to the far cliff
// Numbers drawn (data17 READ): 2023 (romePaper, row 7). MILLENNIA and THOUSANDS OF YEARS are words (row 7, F3: no numeral).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bloom, CycClouds, Cumulus, Form, Layer, Motes, Puffs, ShadedRidge, Sky, Stage, Tick, alpha, mixHex, rnd, rrect } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { READ } from "../data17";
import { CrackDraw, DotStream, StarsTint, crackDrawFor } from "../movers17";
import { RungBadge, TimeLadder, YearsDial, rungValue } from "../ladder";
import { WordPill } from "../stamps17";
import { ShotDef, ShotFC, lineFrac, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { C, CREAM, ClipBox, DUSK, DomeHall, Floor, Hammer, Label, Loupe, NIGHT, NOON, Phase, Pop, STUDIO, ez, handAt, lerp, lin, wrap } from "./a-parts";

export const cuesL06 = (t: SceneTiming) => {
  const { at } = cueKit(t);
  return {
    s01: 0,
    s02: lineFrac(t, 0, 0.47),
    s03: at(1),
    s04: lineFrac(t, 1, 0.3),
    s05: lineFrac(t, 1, 0.67),
    s06: at(2),
    s07: lineFrac(t, 2, 0.26),
    s08: lineFrac(t, 2, 0.6),
    s09: at(3),
    s10: lineFrac(t, 3, 0.4),
    s11: lineFrac(t, 3, 0.72), // phase (slide)
    end: t.frames,
  };
};
export type CL06 = ReturnType<typeof cuesL06>;

const NoonSky: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <Sky family={NOON} />
    <Layer depth={0.15}>
      <Bloom x={1620} y={170} r={520} color="#FFF3C8" core={60} coreColor="#FFFBEA" strength={0.85} />
    </Layer>
    <Layer depth={0.3}>
      {[0, 1, 2].map((i) => (
        <Cumulus key={i} x={-500 + wrap(f * 2 + i * 950, 2800)} y={200 + i * 70} w={380 + i * 60} h={100 + i * 14} fill="#FFFFFF" shade="#CFEAE4" lit="#FFFFFF" seed={i + 11} frame={f} />
      ))}
    </Layer>
  </g>
);

/** Roman concrete in close-up: warm mortar with dark aggregate and white lime lumps (`lumps` 0..1 shows them). */
const RomanFace: React.FC<{ x: number; y: number; w: number; h: number; seed?: number; lumps?: number; lumpAge?: number }> = ({ x, y, w, h, seed = 1, lumps = 1, lumpAge }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill="#D9C7A0" />
    {Array.from({ length: 70 }, (_, i) => {
      const ax = x + rnd(seed * 7 + i) * w;
      const ay = y + rnd(seed * 11 + i) * h;
      const r = 10 + rnd(seed * 3 + i) * 26;
      return <ellipse key={i} cx={ax} cy={ay} rx={r} ry={r * 0.7} fill={mixHex("#8F7A5A", "#5A4A30", rnd(i))} opacity={0.75} transform={`rotate(${i * 37} ${ax} ${ay})`} />;
    })}
    {Array.from({ length: 22 }, (_, i) => {
      const lx = x + rnd(seed * 19 + i) * w;
      const ly = y + rnd(seed * 23 + i) * h;
      const age = lumpAge === undefined ? 99 : lumpAge - i * 8;
      const s = age < 0 ? 0 : age < 6 ? age / 6 + Math.sin((age / 6) * Math.PI) * 0.3 : 1;
      if (s <= 0 || lumps <= 0) return null;
      return (
        <g key={i} opacity={lumps}>
          <ellipse cx={lx} cy={ly} rx={16 * s} ry={12 * s} fill="#FFFBEA" stroke="#C9B88A" strokeWidth={2} />
          <ellipse cx={lx - 4 * s} cy={ly - 4 * s} rx={5 * s} ry={3 * s} fill="#FFFFFF" />
        </g>
      );
    })}
  </g>
);

// ================================================================================================================
// 6-01 · the generic domed building in sunlight; Tick walks up with a tiny hammer; the YEARS dial spins (24 deg/f) and
// stops on MILLENNIA; cloud shadows slide across (10 px/f)
// ================================================================================================================
const ShotRome: ShotFC<CL06> = ({ f }) => {
  const settle = rungValue(5);
  const v = settle + 0.36 * Math.sin(f * 0.3) * Math.exp(-f / 45);
  const tx = Math.min(760, 180 + f * 4.5);
  const walking = tx < 760;
  const [hx, hy] = handAt(tx, 960, 200, 1, [36, -104]);
  return (
    <Stage theme={NOON.theme} cam={{ x: 980 + f * 0.6, y: 540, zoom: 1.02 + f * 0.0008 }} vignette={0.1} grain={0.5}>
      <NoonSky f={f} />
      <Layer depth={1}>
        <Floor y={940} color={NOON.mid} foot={NOON.near} lip="#FFF3C8" />
        <DomeHall x={1180} base={940} w={980} />
        {[0, 1].map((i) => (
          <ellipse key={i} cx={-400 + wrap(f * 10 + i * 1300, 2800)} cy={960} rx={420} ry={50} fill="#1F4F4C" opacity={0.2} />
        ))}
        <Tick x={tx} y={962} pxPerM={200} frame={f} facing={1} pose={walking ? "stand" : "hold"} walk={walking ? f / 14 : undefined} expression="proud" look={0.3} />
        <Hammer x={hx} y={hy} s={1.8} angle={walking ? -20 : -50 + Math.sin(f / 4) * 10} />
      </Layer>
      <Layer depth={0}>
        <RungBadge f={f} rung={5} family={NOON} />
        <YearsDial x={1640} y={250} r={130} value={v} word={f > 70 ? "MILLENNIA" : undefined} family={NOON} f={f} plate="light" />
      </Layer>
    </Stage>
  );
};

// ================================================================================================================
// 6-02 · a magnifier slides across the wall surface (20 px/f); white lime lumps pop into view under it (stagger 8 f)
// ================================================================================================================
const ShotLumps: ShotFC<CL06> = ({ f }) => {
  const mx = 300 + Math.min(1300, f * 20);
  return (
    <Pop f={f}>
      <Stage theme={NOON.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.012, panY: 0, frames: 160, seed: 2 }} vignette={0.12} grain={0.5}>
        <NoonSky f={f} />
        <Layer depth={1}>
          <RomanFace x={-200} y={120} w={2400} h={1000} seed={3} lumps={0.25} />
          <Loupe x={mx} y={560} r={250}>
            <g transform={`translate(${mx} 560) scale(1.8) translate(${-mx} -560)`}>
              <RomanFace x={-200} y={120} w={2400} h={1000} seed={3} lumpAge={f - 6} />
            </g>
          </Loupe>
        </Layer>
        <Layer depth={0}>
          <WordPill x={120} y={110} text={READ.romePaper.text} size={28} appear={ez(f, 6, 18)} />
          <WordPill x={120} y={176} text="lime lumps" size={28} dot="#FFFBEA" appear={ez(f, 30, 42)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 6-03 · close on a crack with a white lump; a toolbox pops open over it (lid 8 deg/f); crystal tools pop out (stagger 6 f)
// ================================================================================================================
const ShotKit: ShotFC<CL06> = ({ f }) => {
  const lid = Math.min(110, Math.max(0, f - 14) * 8);
  const box = { x: 1060, y: 420 };
  return (
    <Pop f={f}>
      <Stage theme={NOON.theme} cam={{ x: 960 + f * 0.5, y: 540, zoom: 1.04 + f * 0.0009 }} vignette={0.12} grain={0.5}>
        <NoonSky f={f} />
        <Layer depth={1}>
          <RomanFace x={-200} y={-100} w={2400} h={1300} seed={7} lumps={0.4} />
          <path d="M-100 700 L400 660 L760 720 L1100 640 L1500 700 L2100 660" fill="none" stroke="#3A2A1E" strokeWidth={30} strokeLinecap="round" />
          <ellipse cx={980} cy={660} rx={90} ry={66} fill="#FFFBEA" stroke="#C9B88A" strokeWidth={4} />
          <ellipse cx={960} cy={640} rx={30} ry={18} fill="#FFFFFF" />
          {/* the toolbox over the lump */}
          <g opacity={ez(f, 2, 10)}>
            <Form d={rrect(box.x - 170, box.y - 60, 340, 150, 18)} fill="#2F7F6E" light={315} shadow="#0F3540" shadowOpacity={0.5} inset={12} rim="#BFF5EA" hard />
            <g transform={`rotate(${-lid} ${box.x - 170} ${box.y - 60})`}>
              <Form d={rrect(box.x - 176, box.y - 100, 352, 46, 12)} fill="#3F8E7E" light={315} shadow="#0F3540" shadowOpacity={0.5} inset={8} rim="#BFF5EA" hard />
              <rect x={box.x - 40} y={box.y - 124} width={80} height={26} rx={10} fill="none" stroke="#0F3540" strokeWidth={8} />
            </g>
            {[0, 1, 2, 3].map((i) => {
              const age = f - 26 - i * 6;
              if (age < 0) return null;
              const up = Math.min(1, age / 8);
              const tx = box.x - 110 + i * 74;
              const ty = box.y - 60 - up * (90 + i * 16);
              return (
                <g key={i} transform={`translate(${tx} ${ty}) rotate(${(i - 1.5) * 14}) scale(${0.6 + 0.4 * up})`}>
                  <path d="M0 -46 L22 -10 L12 40 L-12 40 L-22 -10 Z" fill="#E8F8F8" stroke="#7FBFD0" strokeWidth={4} />
                  <path d="M0 -46 L-22 -10 L0 0 Z" fill="#FFFFFF" />
                </g>
              );
            })}
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 6-04 · water runs into the crack (16 px/f); calcium dots stream out of the lump (18 px/f); a pale crust grows across the
// gap (14 px/f)
// ================================================================================================================
const ShotCalcium: ShotFC<CL06> = ({ f }) => {
  const crust = Math.min(900, Math.max(0, f - 20) * 14);
  return (
    <Pop f={f}>
      <Stage theme={NOON.theme} cam={{ x: 960 + f * 0.5, y: 540, zoom: 1.05 + f * 0.0009 }} vignette={0.12} grain={0.5}>
        <NoonSky f={f} />
        <Layer depth={1}>
          <RomanFace x={-200} y={-100} w={2400} h={1300} seed={9} lumps={0.4} />
          {/* the crack: a dark channel across the frame */}
          <path d="M-100 560 L300 520 L620 580 L980 520 L1340 580 L1700 530 L2100 570 L2100 650 L1700 610 L1340 660 L980 600 L620 660 L300 600 L-100 640 Z" fill="#2A1E14" />
          {/* water running along it */}
          {Array.from({ length: 10 }, (_, i) => {
            const x = -100 + wrap(f * 16 + i * 230, 2300);
            return <ellipse key={i} cx={x} cy={585 + Math.sin(x / 140) * 22} rx={60} ry={12} fill="#3FA9C8" opacity={0.85} />;
          })}
          {/* the lump at the crack's lip */}
          <ellipse cx={700} cy={470} rx={110} ry={80} fill="#FFFBEA" stroke="#C9B88A" strokeWidth={4} />
          <ellipse cx={676} cy={446} rx={34} ry={20} fill="#FFFFFF" />
          <DotStream f={f} from={[700, 500]} to={[1500, 590]} n={60} speed={18} spread={40} color="#FFFFFF" size={9} seed={4} />
          {/* the crust growing across the gap */}
          <ClipBox x={600} y={500} w={crust} h={200}>
            <path d="M600 560 L980 520 L1340 580 L1700 530 L1700 620 L1340 660 L980 600 L600 650 Z" fill="#F4F0E0" stroke="#C9B88A" strokeWidth={4} />
          </ClipBox>
          {crust > 0 && crust < 900 ? <circle cx={600 + crust} cy={585} r={20} fill="#FFFFFF" opacity={0.9} /> : null}
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 6-05 · the lab bench: three sample blocks; the dropper drips on the one with lumps (20 px/f); its crack seals in
// time-lapse (14 px/f); Tick peers through a loupe
// ================================================================================================================
const ShotLab: ShotFC<CL06> = ({ f }) => {
  const seal = Math.min(1, Math.max(0, f - 30) / 60);
  const dropY = 220 + wrap(f * 20, 260);
  const blocks = [560, 900, 1240];
  return (
    <Pop f={f}>
      <Stage theme={STUDIO.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.015, panY: 0, frames: 150, seed: 3 }} vignette={0.12} grain={0.5}>
        <Sky family={STUDIO} />
        <Layer depth={0.2}>
          <CycClouds f={f} y={100} n={4} seed={9} />
        </Layer>
        <Layer depth={1}>
          <Floor y={960} color={STUDIO.mid} lip="#FFE6A8" foot={STUDIO.near} />
          <Form d={rrect(340, 600, 1180, 60, 14)} fill="#C98A2E" light={225} shadow="#5A3010" shadowOpacity={0.5} inset={10} rim="#FFE6A8" hard />
          <rect x={380} y={660} width={40} height={300} fill="#9C6A16" />
          <rect x={1440} y={660} width={40} height={300} fill="#9C6A16" />
          {blocks.map((bx, i) => (
            <g key={i}>
              <Form d={rrect(bx - 120, 430, 240, 170, 14)} fill={i === 1 ? "#D9C7A0" : "#B9B09A"} light={225} shadow="#5A3A20" shadowOpacity={0.5} inset={12} rim="#FFF6E6" hard />
              {i === 1 ? [0, 1, 2, 3].map((k) => <ellipse key={k} cx={bx - 70 + k * 46} cy={470 + (k % 2) * 90} rx={12} ry={9} fill="#FFFBEA" stroke="#C9B88A" strokeWidth={2} />) : null}
              <path d={`M${bx - 120} 520 L${bx - 40} 505 L${bx + 30} 530 L${bx + 120} 512`} fill="none" stroke="#3A2A1E" strokeWidth={i === 1 ? 14 * (1 - seal) + 0.1 : 14} strokeLinecap="round" />
              {i === 1 && seal > 0 ? <path d={`M${bx - 120} 520 L${bx - 120 + 240 * seal} ${520 - 4 * seal}`} stroke="#F4F0E0" strokeWidth={10} strokeLinecap="round" /> : null}
            </g>
          ))}
          {/* the dropper over the lumpy block */}
          <rect x={884} y={60} width={32} height={140} rx={10} fill="#BFF0F2" stroke="#1E4A5C" strokeWidth={4} />
          <rect x={874} y={30} width={52} height={44} rx={14} fill="#E0A93A" />
          <ellipse cx={900} cy={dropY} rx={12} ry={18} fill="#3FA9C8" />
          <Tick x={1660} y={960} pxPerM={270} frame={f} facing={-1} pose="think" expression="thinking" look={-0.4} />
          {(() => {
            const [hx, hy] = handAt(1660, 960, 270, -1, [14, -134]);
            return <Loupe x={hx - 70} y={hy - 70} r={52} />;
          })()}
        </Layer>
        <Layer depth={0}>
          <WordPill x={120} y={110} text="in a lab" size={26} appear={ez(f, 6, 18)} />
          <WordPill x={120} y={176} text="self-healing potential" size={26} dot="#F4F0E0" appear={ez(f, 40, 52)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 6-06 · the split frame: the dome whole on the left, our steel-barred wall fallen on the right; the divider sweeps across
// (24 px/f); dust on the right (12 px/f)
// ================================================================================================================
const ShotSplit: ShotFC<CL06> = ({ f }) => {
  const div = Math.max(960, 1920 - f * 24);
  return (
    <Pop f={f}>
      <Stage theme={NOON.theme} shotFrame={f} drift={{ zoom: 1.03, panX: 0.01, panY: 0, frames: 130, seed: 4 }} vignette={0.1} grain={0.5}>
        <NoonSky f={f} />
        <Layer depth={1}>
          <Floor y={900} color={NOON.mid} foot={NOON.near} lip="#FFF3C8" />
          <ClipBox x={-200} y={-200} w={div + 200} h={1500}>
            <DomeHall x={500} base={900} w={720} />
          </ClipBox>
          <ClipBox x={div} y={-200} w={1400} h={1500}>
            <rect x={div} y={-200} width={1400} height={1500} fill="#E3C08A" opacity={0.25} />
            {/* our wall, fallen: slabs at angles with bars sticking out */}
            {[0, 1, 2, 3, 4].map((i) => (
              <g key={i} transform={`rotate(${[-14, 22, -30, 8, 40][i]} ${1180 + i * 130} ${820 - (i % 2) * 60})`}>
                <Form d={rrect(1100 + i * 130, 760 - (i % 2) * 60, 200, 110, 10)} fill="#8F8670" light={315} shadow="#3A2A1E" shadowOpacity={0.5} inset={10} rim="#FFF6E6" hard />
                <rect x={1080 + i * 130} y={808 - (i % 2) * 60} width={240} height={12} rx={6} fill={C.rust} />
              </g>
            ))}
            <rect x={1500} y={460} width={30} height={440} fill="#8F8670" />
            <rect x={1490} y={420} width={10} height={480} fill={C.rust} />
            {[0, 1, 2].map((i) => (
              <Puffs key={i} frame={f} x={1200 + i * 200} y={800} color={alpha("#E8D9C0", 0.7)} period={14} size={30} rise={0.8} drift={2} life={50} seed={i + 3} />
            ))}
          </ClipBox>
          <rect x={div - 8} y={-200} width={16} height={1500} fill="#FFFBEA" />
          <rect x={div - 3} y={-200} width={6} height={1500} fill="#1E2A2E" opacity={0.6} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 6-07 · the paper on the board: pages turn (40 px/f); three boxes PROPOSES, TESTS, POINTS AT tick in turn (stagger 14 f)
// ================================================================================================================
const ShotPaper: ShotFC<CL06> = ({ f }) => {
  const P = { x: 560, y: 180, w: 520, h: 680 };
  const turn = (f % 24) / 24;
  const pagesLeft = f < 72;
  const boxes = ["proposes", "tests", "points at"];
  return (
    <Pop f={f}>
      <Stage theme={STUDIO.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.015, panY: 0, frames: 170, seed: 5 }} vignette={0.12} grain={0.5}>
        <Sky family={STUDIO} />
        <Layer depth={0.2}>
          <CycClouds f={f} y={90} n={4} seed={10} />
        </Layer>
        <Layer depth={1}>
          <Floor y={960} color={STUDIO.mid} lip="#FFE6A8" foot={STUDIO.near} />
          <Form d={rrect(200, 120, 1520, 800, 26)} fill="#2A6E78" light={225} shadow="#1E4A5C" shadowOpacity={0.5} inset={16} rim="#BFE3D6" />
          <rect x={200} y={120} width={1520} height={800} rx={26} fill="none" stroke="#C98A2E" strokeWidth={14} />
          {/* the paper: a stack with a page turning */}
          <rect x={P.x + 10} y={P.y + 12} width={P.w} height={P.h} rx={10} fill="#1E4A5C" opacity={0.3} />
          <rect x={P.x} y={P.y} width={P.w} height={P.h} rx={10} fill={C.paper} />
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={P.x + 50} y={P.y + 90 + i * 44} width={P.w - 100 - (i % 3) * 60} height={12} rx={6} fill="#7C9BA6" opacity={0.6} />
          ))}
          <rect x={P.x + 50} y={P.y + 40} width={P.w - 160} height={26} rx={8} fill="#1E4A5C" />
          {pagesLeft ? (
            <g transform={`translate(${P.x} 0) scale(${(1 - 2 * turn).toFixed(3)} 1) translate(${-P.x} 0)`}>
              <rect x={P.x} y={P.y} width={P.w} height={P.h} rx={10} fill={turn < 0.5 ? "#FFFBF0" : "#E9DCC4"} stroke="#C9B88A" strokeWidth={2} />
            </g>
          ) : null}
          <circle cx={P.x + P.w / 2} cy={P.y - 6} r={16} fill="#E4A93A" />
          {boxes.map((b, i) => {
            const age = f - 20 - i * 14;
            const y = 300 + i * 190;
            return (
              <g key={i}>
                <Form d={rrect(1180, y - 60, 440, 120, 20)} fill={C.paper} light={225} shadow="#1E4A5C" shadowOpacity={0.35} inset={10} rim="#FFFFFF" hard />
                <rect x={1210} y={y - 32} width={64} height={64} rx={12} fill="none" stroke="#1E4A5C" strokeWidth={6} />
                {age >= 0 ? <path d={`M1222 ${y} l16 18 l32 -40`} fill="none" stroke={C.seen} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" transform={`translate(1242 ${y}) scale(${Math.min(1, age / 6)}) translate(-1242 ${-y})`} /> : null}
                <Label x={1300} y={y + 12} text={b} size={32} color={C.ink} align="start" />
              </g>
            );
          })}
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 6-08 · night: our wall's cracks reopen (40 px/f) beside an empty scaffold and a dry paint roller; dust trickles (14 px/f);
// Tick stands by the roller and shrugs (NEEDS PEOPLE TO PATCH)
// ================================================================================================================
const ShotOurWall: ShotFC<CL06> = ({ f }) => {
  const cracks = [
    { x: 760, y: 200, r: 80, s: 4, L: 600, st: 4 },
    { x: 1100, y: 160, r: 100, s: 6, L: 700, st: 20 },
    { x: 1400, y: 300, r: 120, s: 8, L: 560, st: 40 },
  ];
  return (
    <Pop f={f}>
      <Stage theme={NIGHT.theme} cam={{ x: 960 + f * 0.4, y: 540, zoom: 1.02 + f * 0.0006 }} vignette={0.38} grain={0.5}>
        <Sky family={NIGHT} />
        <Layer depth={0.1}>
          <StarsTint f={f} n={80} speed={1.5} h={180} seed={19} />
        </Layer>
        <Layer depth={1}>
          <rect x={560} y={120} width={1500} height={800} fill="#26525F" />
          {Array.from({ length: 5 }, (_, i) => (
            <rect key={i} x={560} y={120 + i * 160} width={1500} height={6} fill="#3F7F8E" opacity={0.6} />
          ))}
          {cracks.map((k, i) => (
            <CrackDraw key={i} x={k.x} y={k.y} rotate={k.r} seed={k.s} length={k.L} draw={crackDrawFor(f, k.st, k.L, 40)} widen={ez(f, k.st + 20, k.st + 60) * 0.6} color="#020B10" width={9} branches={3} />
          ))}
          <DotStream f={f} from={[1100, 300]} to={[1100, 920]} n={40} speed={14} spread={500} color="#9FC8C6" size={6} gravity={1} seed={7} />
          {/* the empty scaffold */}
          <g stroke="#5FA0A8" strokeWidth={12} strokeLinecap="round">
            <line x1={260} y1={920} x2={260} y2={300} />
            <line x1={520} y1={920} x2={520} y2={300} />
            <line x1={240} y1={520} x2={540} y2={520} />
            <line x1={240} y1={320} x2={540} y2={320} />
            <line x1={260} y1={920} x2={520} y2={520} strokeWidth={6} />
          </g>
          <rect x={230} y={500} width={330} height={20} rx={6} fill="#7A4A20" />
          <rect x={-200} y={920} width={2400} height={300} fill="#06151D" />
          {/* the dry roller in its empty tray */}
          <rect x={640} y={890} width={160} height={30} rx={8} fill="#3F7F8E" />
          <rect x={660} y={840} width={120} height={40} rx={20} fill="#C9B88A" />
          <path d="M780 860 L840 860 L840 760" fill="none" stroke="#14414F" strokeWidth={10} />
          <Bloom x={420} y={560} r={360} color={C.amber} strength={0.35} />
          <Tick x={880} y={922} pxPerM={240} frame={f} facing={-1} pose="shrug" expression="worried" look={0.2} />
        </Layer>
        <Layer depth={0}>
          <WordPill x={120} y={110} text="needs people to patch" size={26} appear={ez(f, 10, 22)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 6-09 · the crust seals a Roman wall crack (14 px/f), a sparkle running along its edge (30 px/f); Tick tips his visor
// ================================================================================================================
const ShotSeal: ShotFC<CL06> = ({ f }) => {
  const crust = Math.min(1300, f * 14);
  const sp = 200 + wrap(f * 30, 1400);
  return (
    <Pop f={f}>
      <Stage theme={NOON.theme} cam={{ x: 960 + f * 0.5, y: 540, zoom: 1.03 + f * 0.0008 }} vignette={0.1} grain={0.5}>
        <NoonSky f={f} />
        <Layer depth={1}>
          <Floor y={980} color={NOON.mid} foot={NOON.near} lip="#FFF3C8" />
          <RomanFace x={160} y={120} w={1300} h={860} seed={13} lumps={0.8} />
          <path d="M160 500 L460 470 L760 530 L1060 480 L1460 520" fill="none" stroke="#2A1E14" strokeWidth={26} strokeLinecap="round" />
          <ClipBox x={160} y={400} w={crust} h={200}>
            <path d="M160 500 L460 470 L760 530 L1060 480 L1460 520" fill="none" stroke="#F4F0E0" strokeWidth={30} strokeLinecap="round" />
          </ClipBox>
          {sp < 160 + crust ? (
            <g>
              <circle cx={sp} cy={500 + Math.sin(sp / 160) * 20} r={26} fill="#FFFFFF" opacity={0.5} />
              <path d={`M${sp} ${480 + Math.sin(sp / 160) * 20} l6 14 l14 6 l-14 6 l-6 14 l-6 -14 l-14 -6 l14 -6 Z`} fill="#FFFFFF" />
            </g>
          ) : null}
          <Tick x={1660} y={982} pxPerM={250} frame={f} facing={-1} pose={f > 40 ? "wipe-brow" : "stand"} expression="happy" look={-0.3} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 6-10 + 6-11 · the THOUSANDS OF YEARS bar grows from the left (30 px/f) and stops short of a far wall; the A THOUSAND rung
// lights; slide to dusk: the camera tilts up past the dome (22 px/f) to a granite cliff rising on the horizon (20 px/f)
// ================================================================================================================
const ShotRuler: ShotFC<CL06> = ({ f, c }) => {
  const T11 = c.s11 - c.s10;
  const bar = Math.min(980, f * 30);
  const A = (
    <Stage theme={STUDIO.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.012, panY: 0, frames: 150, seed: 6 }} vignette={0.12} grain={0.5}>
      <Sky family={STUDIO} />
      <Layer depth={0.2}>
        <CycClouds f={f} y={90} n={4} seed={12} />
      </Layer>
      <Layer depth={1}>
        <Floor y={900} color={STUDIO.mid} lip="#FFE6A8" foot={STUDIO.near} />
        <Form d={rrect(1460, 200, 60, 700, 12)} fill="#1E4A5C" light={225} shadow="#0F3540" shadowOpacity={0.5} inset={10} rim="#BFE3D6" hard />
        <Form d={rrect(200, 500, Math.max(20, bar), 110, 20)} fill="#E0A93A" light={225} shadow="#9C6A16" shadowOpacity={0.5} inset={12} rim="#FFF2C8" hard />
        {Array.from({ length: Math.floor(bar / 60) }, (_, i) => (
          <rect key={i} x={220 + i * 60} y={500} width={5} height={i % 5 ? 30 : 56} fill="#5A3010" />
        ))}
        {bar > 500 ? <Label x={240} y={580} text="thousands of years" size={34} color="#3A2008" align="start" /> : null}
        <line x1={200 + bar} y1={470} x2={1460} y2={470} stroke="#1E4A5C" strokeWidth={5} strokeDasharray="14 12" opacity={bar >= 980 ? 0.8 : 0} />
      </Layer>
      <Layer depth={0}>
        <TimeLadder f={f} family={STUDIO} lit={5 + ez(f, 30, 50)} glow={5} labels="left" x={1780} />
      </Layer>
    </Stage>
  );
  const g = Math.max(0, f - T11);
  const camY = 540 - Math.min(700, g * 22);
  const cliff = Math.min(300, g * 20);
  const B = (
    <Stage theme={DUSK.theme} cam={{ x: 960, y: camY, zoom: 1 }} vignette={0.26} grain={0.5}>
      <Sky family={DUSK} />
      <Layer depth={0.15}>
        <Bloom x={1500} y={-60} r={600} color="#FFCF73" core={60} coreColor="#FFF2C8" strength={0.85} />
      </Layer>
      <Layer depth={0.5}>
        <g transform={`translate(0 ${300 - cliff})`}>
          <ShadedRidge pts={[[-400, 60], [200, 40], [480, -320], [700, -380], [980, -360], [1180, -300], [1360, 20], [2400, 40]]} base={900} fill="#8F7A6A" shadow="#5A4A44" />
          {Array.from({ length: 8 }, (_, i) => (
            <line key={i} x1={520 + i * 90} y1={-300 + (i % 3) * 20} x2={500 + i * 92} y2={40} stroke="#5A4A44" strokeWidth={4} opacity={0.5} />
          ))}
        </g>
      </Layer>
      <Layer depth={1}>
        <rect x={-400} y={560} width={2720} height={900} fill="#2C5A5A" />
        <DomeHall x={1180} base={900} w={760} fill="#E8D2A8" shade="#9C7A5A" lit="#FFE6C0" />
        <Floor y={900} color="#2C5A5A" lip="#F6B45A" foot="#0F3540" />
        <Tick x={500} y={902} pxPerM={200} frame={g} facing={1} pose="point" expression="determined" look={0.7} headTilt={-14} />
      </Layer>
    </Stage>
  );
  return <Phase f={f} at={T11 - 6} dur={15} kind="slide" a={A} b={B} />;
};

// ================================================================================================================

export const SceneL06: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL06(t);
  const shots: ShotDef<CL06>[] = [
    { from: 0, S: ShotRome, id: "6-01" },
    { from: c.s02, S: ShotLumps, id: "6-02" },
    { from: c.s03, S: ShotKit, id: "6-03" },
    { from: c.s04, S: ShotCalcium, id: "6-04" },
    { from: c.s05, S: ShotLab, id: "6-05" },
    { from: c.s06, S: ShotSplit, id: "6-06" },
    { from: c.s07, S: ShotPaper, id: "6-07" },
    { from: c.s08, S: ShotOurWall, id: "6-08" },
    { from: c.s09, S: ShotSeal, id: "6-09" },
    { from: c.s10, S: ShotRuler, id: "6-10" }, // + 6-11
  ];
  return <AbsoluteFill>{playShots(f, shots, c, t.frames)}</AbsoluteFill>;
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL06 = (t: SceneTiming): Cue[] => {
  const c = cuesL06(t);
  const run = (at: number, n: number, gap: number, vol = 0.08): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 8 }));
  return [
    { at: 10, file: SFX.chime, vol: 0.14, dur: 90, fadeOut: 30 },
    ...cutHit(c.s02),
    { at: c.s02 + 10, file: SFX.pop, vol: 0.12, dur: 16 },
    ...cutHit(c.s03),
    { at: c.s03 + 16, file: SFX.pop, vol: 0.14, dur: 16 },
    ...cutHit(c.s04),
    ...cutHit(c.s05),
    { at: c.s05 + 10, file: SFX.click, vol: 0.12, dur: 8 },
    ...cutHit(c.s06),
    { at: c.s06 + 2, file: SFX.whoosh, vol: 0.16, dur: 50 },
    ...cutHit(c.s07),
    ...run(c.s07 + 20, 3, 14, 0.12),
    ...cutHit(c.s08),
    { at: c.s08 + 6, file: SFX.debris, vol: 0.14, dur: 100, fadeOut: 30 },
    ...cutHit(c.s09),
    { at: c.s09 + 20, file: SFX.chime, vol: 0.14, dur: 90, fadeOut: 30 },
    ...cutHit(c.s10),
    { at: c.s10 + 30, file: SFX.click, vol: 0.12, dur: 8 },
    { at: c.s11 - 4, file: SFX.whoosh, vol: 0.12, dur: 40 },
    { at: c.s11 + 10, file: SFX.riser, vol: 0.12, dur: 70, fadeIn: 6, fadeOut: 12 },
  ];
};
