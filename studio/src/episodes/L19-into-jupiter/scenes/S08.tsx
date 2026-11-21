// L19 scene "l08" (storyboard §3 "8 · What we heard, and what we modelled", script lines 44-53). Package B.
// ShotDefs (hard cuts; PUSH / SLIDE rows are phases): 8-01 · 8-02 · 8-03 · 8-04 · 8-05 · 8-06 · 8-07 (+8-08, SLIDE) · 8-09 · 8-10 ·
// 8-11 · 8-12 · 8-13 · 8-14 · 8-15 · 8-16 · 8-17 · 8-18 · 8-19 · 8-20 · 8-21 · 8-22 (+8-23, PUSH).
// l08 is 105 s: the honest board is broken by furnace (8-13-8-15, 8-23), limb (8-08) and deepdeck (8-18) cutaways.
// Numbers drawn (all data19 READ): 156 KM (#4 A; Q8 "about", no "at most") 8-02, 8-16-8-18, 8-21 · 330 MPH, JAN 1996 (#4 A) 8-06,
// 8-07, 8-09 · 170 M/S, 1997 (#5 A) 8-07, 8-09; the two bars are drawn TO SCALE against each other (D2: 330 mph = 148 m/s vs 170 m/s) ·
// MORE THAN 1,300 EARTHS (#8 A, 1,321 by volume; the Earth discs are drawn to scale, r = R / 10.97) 8-11 · 2.7 TIMES with whiskers
// +2.4 / -1.7 in proportion (#7 A) 8-12 · 63 % (#12 A, a model's best fit) 8-15 · ABOUT 200 KM (#3 A) 8-17, 8-21 · 23 ATM, OVER 300 F
// (#2 A) 8-20. 8-19 (REFERENCE SITES) shows NO numerals (Q9 softened): two smudged "?" chips.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Bloom, Embers, IF2, Kicker, Layer, Motes, Stage, Tick } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { familyOf } from "../families";
import { READ } from "../data19";
import { Ledger, TapeTicket } from "../tape";
import { DeckBands, DryPatch, WindStreaks } from "../decks";
import { Canopy, Capsule, Orbiter } from "../probe19";
import { Fog, Section } from "../interior";
import { AboutPill, AgencyPill, ErrorBar, QuestionTag, WordPill } from "../tags19";
import { Sparks, StarsTint } from "../flows19";
import { EarthDot } from "../icons19";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import {
  BandField19,
  Bracket19,
  C,
  CheckPen,
  DRIFT,
  DarkSky,
  FamSky,
  Floor,
  GlowBands,
  INK,
  Label,
  LedgerIcon,
  Limb,
  MarkLines,
  Num,
  Planet,
  Pop,
  Readout,
  Sheet,
  Slam,
  ValueBar,
  cl,
  drawn,
  ez,
  fr,
  lin,
  mod,
  rnd,
  runOf,
  sm,
} from "./b-parts";

export const cuesL08 = (t: SceneTiming) => {
  const { at, frac } = cueKit(t);
  return {
    s801: 0,
    s802: frac(0, 0.48),
    s803: at(1),
    s804: frac(1, 0.45),
    s805: frac(1, 0.75),
    s806: at(2),
    s807: at(3),
    s808: frac(3, 0.4),
    s809: frac(3, 0.72),
    s810: at(4),
    s811: frac(4, 0.2),
    s812: frac(4, 0.62),
    s813: at(5),
    s814: frac(5, 0.3),
    s815: frac(5, 0.68),
    s816: at(6),
    s817: frac(6, 0.38),
    s818: frac(6, 0.7),
    s819: at(7),
    s820: frac(7, 0.5),
    s821: at(8),
    s822: at(9),
    s823: frac(9, 0.5),
    end: t.frames,
  };
};
export type C08 = ReturnType<typeof cuesL08>;

const SC = familyOf("scope");
const FU = familyOf("furnace");
const LI = familyOf("limb");
const DD = familyOf("deepdeck");
const SOLID = 0.45; // where the HEARD stretch of the ledger ends (the probe's 156 km); the rest is MODEL

/** The emerald station board: sky, sliding tone bands, the ledger tape across the top (drifting = the tape scrolling). */
const Board: React.FC<{ f: number; y?: number; marker?: number; drift?: number; tape?: boolean }> = ({ f, y = 130, marker, drift = 24, tape = true }) => (
  <>
    <Layer depth={0.1}>
      <FamSky name="scope" />
      <BandField19 f={f} k="scope" />
    </Layer>
    {tape ? (
      <Layer depth={0.8}>
        <Ledger f={f} x0={-60} x1={1980} y={y} solidTo={SOLID} marker={marker} drift={drift} pins={[0.06, 0.25, 0.45, 0.7, 0.92]} />
      </Layer>
    ) : null}
  </>
);
const Furnace: React.FC<{ f: number; glow?: number }> = ({ f, glow = 0.32 }) => (
  <>
    <Layer depth={0.1}>
      <DarkSky name="furnace" />
      <BandField19 f={f} k="furnace" />
    </Layer>
    <Layer depth={0.5}>
      <GlowBands f={f} speed={20} opacity={glow} />
    </Layer>
  </>
);
const Dust: React.FC<{ f: number; seed: number }> = ({ f, seed }) => (
  <Layer depth={1.2}>
    <Motes frame={f} n={14} w={1920} h={1080} color="#FFE7A0" seed={seed} size={3} drift={20} />
  </Layer>
);

// ===============================================================================================================
// 8-01 · THE LEDGER: Tick (≥ 40 %) pins a long tape across the frame; it slides in (30 px/f), pins pop (6 f), a glow runs along the
//        solid part (28 px/f)
// ===============================================================================================================
const Shot801: ShotFC<C08> = ({ f }) => {
  const x1 = 120 + Math.min(1700, f * 30);
  const heave = Math.sin(f * 0.35);
  return (
    <Pop f={f}>
      <Stage theme={SC.theme} shotFrame={f} drift={DRIFT(81)} vignette={0.14} grain={0.5}>
        <Board f={f} tape={false} />
        <Layer depth={1}>
          <Ledger f={f} x0={120} x1={x1} y={420} solidTo={SOLID} drift={28} pins={[0.04, 0.3, 0.6, 0.9]} pinPop={lin(f, 20, 60)} />
          <Floor y={1010} />
          <Tick x={1620} y={1014} pxPerM={262} frame={f} facing={-1} pose="heave" expression="determined" look={-0.5} tilt={-4 * heave} />
        </Layer>
        <Dust f={f} seed={81} />
        <Layer depth={0}>
          <Kicker x={90} y={110} text="— THE LEDGER" color={C.heard} size={28} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 8-02 · 156 KM: a marker slides (30 px/f) along the tape to the end of the solid part; the dashes march past it (24 px/f)
// ===============================================================================================================
const Shot802: ShotFC<C08> = ({ f, len }) => {
  const m = SOLID * ez(f, 2, 2 + (SOLID * 2040) / 30);
  return (
    <Pop f={f}>
      <Stage theme={SC.theme} shotFrame={f} drift={DRIFT(82)} vignette={0.14} grain={0.5}>
        <Board f={f} tape={false} />
        <Layer depth={1}>
          <Ledger f={f} x0={-60} x1={1980} y={560} solidTo={SOLID} marker={m} drift={24} pins={[0.06, 0.25, 0.45, 0.7, 0.92]} />
          <Bloom x={-60 + 2040 * m} y={560} r={260} color={C.heard} strength={0.45} />
          <TapeTicket x={-60 + 2040 * SOLID - 180} y={790} word="HEARD" f={f} slam={lin(f, 30, 42)} swing={10} size={0.9} />
        </Layer>
        <Dust f={f} seed={82} />
        <Layer depth={0}>
          <Readout x={70} y={60} value={READ.km156.value! /* #4 A */} k={ez(f, 2, 2 + (SOLID * 2040) / 30)} unit="KM" size={92} w={480} plate={SC.shadow} appear={lin(f, 0, 10)} who="8-02 156" />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 8-03 / 8-04 · the HEARD sheet: pins to the ledger (Tick proud); five icons pop in turn (8 f) — wind, temperature, pressure, helium,
//        a thin cloud; 8-04 the dry-air icon drops in (30 px/f) and the six rattle; the tape scrolls
// ===============================================================================================================
const ICONS = ["wind", "temp", "press", "helium", "cloud", "dry"] as const;
const HeardSheet: React.FC<{ f: number; n: number; rattle?: number; dropAt?: number; swing?: number }> = ({ f, n, rattle = 0, dropAt, swing = 10 }) => (
  <Sheet x={1000} y={240} w={1100} h={600} f={f} swing={swing} kind="heard">
    <TapeTicket x={200} y={90} word="HEARD" f={f} size={0.7} />
    {ICONS.slice(0, n).map((k, i) => {
      const cx = 140 + (i % 3) * 400;
      const cy = 270 + Math.floor(i / 3) * 190;
      const jx = rattle * Math.sin(f * 1.7 + i * 2);
      const jy = rattle * Math.cos(f * 1.3 + i);
      const drop = dropAt != null && i === 5 ? -600 * (1 - ez(f, dropAt, dropAt + 600 / 30)) : 0;
      return <LedgerIcon key={k} kind={k} x={cx + 60 + jx} y={cy + jy + drop} s={1.2} f={f} />;
    })}
  </Sheet>
);
const Shot803: ShotFC<C08> = ({ f }) => {
  const n = Math.min(5, Math.floor(Math.max(0, f - 12) / 8) + (f >= 12 ? 1 : 0));
  return (
    <Pop f={f}>
      <Stage theme={SC.theme} shotFrame={f} drift={DRIFT(83)} vignette={0.14} grain={0.5}>
        <Board f={f} />
        <Layer depth={1}>
          <HeardSheet f={f} n={n} />
          {ICONS.slice(0, n).map((k, i) => {
            const at = 12 + i * 8;
            const cx = 1000 - 550 + 140 + (i % 3) * 400 + 60;
            const cy = 252 + 270 + Math.floor(i / 3) * 190;
            return f - at < 14 ? <circle key={k} cx={cx} cy={cy} r={60 + (f - at) * 6} fill="none" stroke={C.goldHot} strokeWidth={6} opacity={1 - (f - at) / 14} /> : null;
          })}
          <Floor y={1010} />
          <Tick x={250} y={1014} pxPerM={210} frame={f} facing={1} pose="point" expression="proud" look={0.5} />
        </Layer>
        <Dust f={f} seed={83} />
      </Stage>
    </Pop>
  );
};
const Shot804: ShotFC<C08> = ({ f }) => (
  <Pop f={f}>
    <Stage theme={SC.theme} shotFrame={f} drift={DRIFT(84)} vignette={0.14} grain={0.5}>
      <Board f={f} marker={SOLID} />
      <Layer depth={1}>
        <HeardSheet f={f} n={6} rattle={8} dropAt={2} swing={6} />
      </Layer>
      <Dust f={f} seed={84} />
    </Stage>
  </Pop>
);

// ===============================================================================================================
// 8-05 · "Even that evolved": the sheet's marks shimmer and slide out (26 px/f) as the next page turns in (10 deg/f)
// ===============================================================================================================
const Shot805: ShotFC<C08> = ({ f, len }) => {
  const out = ez(f, 4, len);
  const turn = 1 - ez(f, 6, len * 0.85);
  return (
    <Pop f={f}>
      <Stage theme={SC.theme} shotFrame={f} drift={DRIFT(85)} vignette={0.14} grain={0.5}>
        <Board f={f} />
        <Layer depth={1}>
          <g transform={`translate(${-1400 * out} 0)`}>
            <Sheet x={900} y={260} w={1000} h={600} f={f} swing={4} kind="heard">
              <MarkLines x={90} y={120} w={820} n={10} f={f} slide={f * 26 * 0.3} gap={44} />
            </Sheet>
          </g>
          <g transform={`translate(${1500 * turn} 0) rotate(${-50 * turn} 1000 300)`}>
            <Sheet x={1000} y={260} w={1000} h={600} f={f} swing={4} phase={1} kind="apricot">
              <MarkLines x={90} y={120} w={820} n={10} f={f} gap={44} />
            </Sheet>
          </g>
        </Layer>
        <Dust f={f} seed={85} />
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 8-06 (8.0 s, movers to the last frame) · JAN 1996: on an apricot sheet a bar grows to 330 MPH; its top wavers (±10 px); the sheet
//        flaps (8 deg/f); wind streaks tear past behind it (30 px/f); the tape scrolls
// ===============================================================================================================
const PX_PER_MS = 3.6; // D2: one scale for both bars (330 mph = 148 m/s → 533 px; 170 m/s → 612 px)
const BAR_BASE = 960;
const Shot806: ShotFC<C08> = ({ f, len }) => {
  const grow = ez(f, 6, len * 0.55);
  return (
    <Pop f={f}>
      <Stage theme={SC.theme} shotFrame={f} drift={DRIFT(86)} vignette={0.14} grain={0.5}>
        <Board f={f} />
        <Layer depth={0.9}>
          <g opacity={0.55}>
            <WindStreaks f={f} bands={[{ y: 260, h: 140, dir: 1 }, { y: 460, h: 140, dir: -1 }, { y: 660, h: 140, dir: 1 }]} speed={30} x={-100} w={2120} color="#FFE08A" />
          </g>
        </Layer>
        <Layer depth={1}>
          <Sheet x={1060} y={250} w={760} h={760} f={f} swing={14} kind="apricot" title="JAN 1996">
            <MarkLines x={60} y={150} w={300} n={8} f={f} gap={50} />
          </Sheet>
          <ValueBar x={1240} base={BAR_BASE} w={220} h={148 * PX_PER_MS} k={grow} f={f} color={C.lever} waver={10} />
        </Layer>
        <Dust f={f} seed={86} />
        <Layer depth={0}>
          <Readout x={70} y={280} value={READ.mph330.value! /* #4 A */} k={grow} unit="MPH" size={100} w={520} plate={SC.shadow} appear={lin(f, 0, 12)} who="8-06 330" />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 8-07 · 1997: a taller bar grows (34 px/f) beside the old one, to the same scale; the old bar fades to a dashed ghost; the sheets
//        slide (18 px/f). SLIDE → 8-08.
// ===============================================================================================================
const Shot807: ShotFC<C08> = ({ f, len }) => {
  const grow = lin(f, 4, 4 + (170 * PX_PER_MS) / 34);
  const slide = 18 * f;
  return (
    <Stage theme={SC.theme} shotFrame={f} drift={DRIFT(87)} vignette={0.14} grain={0.5}>
      <Board f={f} />
      <Layer depth={1}>
        <g transform={`translate(${-Math.min(slide, 300)} 0)`}>
          <Sheet x={1060} y={250} w={760} h={760} f={f} swing={6} kind="apricot" title="JAN 1996" />
        </g>
        <g transform={`translate(${Math.max(0, 600 - slide)} 0)`}>
          <Sheet x={1420} y={230} w={760} h={780} f={f} swing={6} phase={2} kind="heard" title="1997" />
        </g>
        <ValueBar x={960} base={BAR_BASE} w={200} h={148 * PX_PER_MS} k={1} f={f} color={C.lever} waver={4} dashed={f > 20} opacity={1 - 0.45 * lin(f, 10, len)} />
        <ValueBar x={1240} base={BAR_BASE} w={220} h={170 * PX_PER_MS} k={grow} f={f} color={C.glow} waver={4} />
        <Label x={1060} y={BAR_BASE + 50} text="MPH" size={28} color={INK} align="middle" />
        <Label x={1350} y={BAR_BASE + 50} text="M/S" size={28} color={INK} align="middle" />
      </Layer>
      <Dust f={f} seed={87} />
      <Layer depth={0}>
        <Readout x={70} y={280} value={READ.wind170.value! /* #5 A */} k={grow} unit="M/S" size={100} w={520} plate={SC.shadow} appear={lin(f, 0, 12)} who="8-07 170" />
      </Layer>
    </Stage>
  );
};

// ===============================================================================================================
// 8-08 · limb cutaway: a generic old spacecraft glides past (24 px/f); speed ticks slide along the bands and line up; the limb's
//        bands slide (16-22 px/f). AGREES + VOYAGER IMAGES
// ===============================================================================================================
const Shot808: ShotFC<C08> = ({ f }) => (
  <Stage theme={LI.theme} shotFrame={f} drift={DRIFT(88)} vignette={0.24} grain={0.5}>
    <Layer depth={0.1}>
      <DarkSky name="limb" />
      <BandField19 f={f} k="limb" />
    </Layer>
    <Layer depth={0.3}>
      <StarsTint f={f} x={-200} y={-200} w={2320} h={1480} n={90} speed={10} seed={88} />
    </Layer>
    <Layer depth={1}>
      <Limb f={f} cx={960} cy={2050} r={1500} shear={[20, -16, 22, -18, 16, -20]} />
      {Array.from({ length: 12 }, (_, i) => {
        const x = -100 + mod(i * 180 + f * 30, 12 * 180);
        return <path key={i} d={`M${x} 610 L${x + 60} 610 M${x + 44} 594 L${x + 62} 610 L${x + 44} 626`} stroke={C.heard} strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.85} />;
      })}
      <Orbiter x={-200 + f * 24} y={300 + Math.sin(f * 0.04) * 20} kind="voyager" f={f} size={1.1} aim={60} />
    </Layer>
    <Layer depth={0}>
      <WordPill x={90} y={110} text="AGREES" size={38} F={LI} appear={lin(f, 20, 32)} />
      <WordPill x={330} y={110} text="VOYAGER IMAGES" size={38} F={LI} appear={lin(f, 4, 16)} />
    </Layer>
  </Stage>
);
const Run807 = runOf<C08>((c) => [
  { at: c.s807, S: Shot807 },
  { at: c.s808, S: Shot808, dir: "down", blend: 16 },
]);

// ===============================================================================================================
// 8-09 · "The numbers moved": two number cards slide past each other on a track (30 px/f, looping); a check pen scribbles (36 px/f)
// ===============================================================================================================
const NumCard: React.FC<{ x: number; y: number; text: string; color: string; who: string }> = ({ x, y, text, color, who }) => (
  <g>
    <rect x={x - 260 + 8} y={y - 90 + 10} width={520} height={180} rx={30} fill="#002A1A" opacity={0.3} />
    <rect x={x - 260} y={y - 90} width={520} height={180} rx={30} fill={color} stroke={C.lemonDeep} strokeWidth={5} />
    <Num x={x} y={y + 34} text={text} size={96} color={INK} align="middle" who={who} />
  </g>
);
const Shot809: ShotFC<C08> = ({ f }) => {
  const span = 2600;
  const a = -500 + mod(f * 30, span);
  const b = 2100 - mod(f * 30 + 900, span);
  return (
    <Pop f={f}>
      <Stage theme={SC.theme} shotFrame={f} drift={DRIFT(89)} vignette={0.14} grain={0.5}>
        <Board f={f} />
        <Layer depth={1}>
          <rect x={-200} y={480} width={2320} height={20} rx={10} fill="#004A2E" />
          <rect x={-200} y={760} width={2320} height={20} rx={10} fill="#004A2E" />
          <NumCard x={a} y={400} text={READ.mph330.text /* #4 A */} color={C.apricot} who="8-09 330" />
          <NumCard x={b} y={680} text={READ.wind170.text /* #5 A */} color={C.heard} who="8-09 170" />
          <CheckPen x={1500} y={930} k={fr(f / 22) * 1.2} s={0.45} />
        </Layer>
        <Dust f={f} seed={89} />
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 8-10 · ONE SPOT: the dry patch pinned over a planet outline (the pin slams 30 px/f); the planet's bands slide under it; the
//        sheet swings; Tick pins the patch
// ===============================================================================================================
const Shot810: ShotFC<C08> = ({ f }) => {
  const pinY = 470 - 600 * (1 - ez(f, 4, 24));
  return (
    <Pop f={f}>
      <Stage theme={SC.theme} shotFrame={f} drift={DRIFT(90)} vignette={0.14} grain={0.5}>
        <Board f={f} />
        <Layer depth={1}>
          <Sheet x={860} y={220} w={900} h={760} f={f} swing={8} kind="heard">
            <Planet cx={450} cy={410} r={300} f={f} shear={[20, -16, 22, -18]} />
            <DryPatch f={f} x={520} y={440} r={70} open={1} />
          </Sheet>
          <circle cx={930} cy={pinY} r={26} fill={C.lever} stroke={C.ink} strokeWidth={4} />
          <line x1={930} y1={pinY} x2={930} y2={pinY + 40} stroke={C.ink} strokeWidth={6} />
          <Floor y={1010} />
          <Tick x={1560} y={1014} pxPerM={230} frame={f} facing={-1} pose="press" expression="determined" look={-0.6} />
        </Layer>
        <Dust f={f} seed={90} />
        <Layer depth={0}>
          <WordPill x={90} y={290} text="ONE SPOT" size={44} F={SC} appear={lin(f, 4, 16)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 8-11 · MORE THAN 1,300 EARTHS: Earth discs drawn TO SCALE (r = R / 10.97, row 8 volume) stamp across the planet outline row by
//        row (the head runs 60 px/f); the counter rolls; the dry patch pulses; the camera pulls back
// ===============================================================================================================
const Shot811: ShotFC<C08> = ({ f, len }) => {
  const R = 400;
  const cx = 820;
  const cy = 600;
  const er = R / 10.97; // row 8: 1,321 Earths by volume → radius ratio ∛1,321 = 10.97
  const dx = er * 2.05;
  const dy = er * 1.78;
  const pts: [number, number][] = [];
  for (let row = 0, y = cy - R + er; y < cy + R; row++, y += dy)
    for (let x = cx - R + er + (row % 2) * dx * 0.5; x < cx + R; x += dx) if (Math.hypot(x - cx, y - cy) < R - er * 0.9) pts.push([x, y]);
  const head = f * 60;
  return (
    <Pop f={f}>
      <Stage theme={SC.theme} cam={{ x: 960, y: 560, zoom: 1.18 - 0.14 * ez(f, 0, len) }} vignette={0.14} grain={0.5}>
        <Board f={f} />
        <Layer depth={1}>
          <Planet cx={cx} cy={cy} r={R} f={f} shear={[18, -16, 20, -14]} dim={0.15} />
          {pts.map(([x, y], i) => {
            const at = i * (2 * R) / 60 / 1.0; // raster order: about 2R px of head per row of discs
            const age = head - i * 26;
            if (age < 0) return null;
            const s = age < 60 ? 1.4 - 0.4 * sm(age / 60) : 1;
            return <EarthDot key={i} x={x} y={y} size={er * 2 * s} f={f + (at % 7)} />;
          })}
          <circle cx={cx + 90} cy={cy + 40} r={36 + 8 * Math.sin(f * 0.3)} fill="none" stroke={C.heard} strokeWidth={6} />
        </Layer>
        <Dust f={f} seed={91} />
        <Layer depth={0}>
          <Readout x={1240} y={300} value={READ.earths1300.value! /* #8 A (1,321) */} k={lin(f, 4, len * 0.85)} pre="MORE THAN" unit="EARTHS" size={84} w={600} plate={SC.shadow} appear={lin(f, 0, 10)} who="8-11 1,300" />
          <WordPill x={1250} y={500} text="BY VOLUME" size={30} F={SC} appear={lin(f, 20, 32)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 8-12 · WIDE ERROR BARS: Juno's water bar (2.7, whiskers +2.4 / -1.7 in proportion) pins beside the dry patch; whiskers extend
//        (40 px/f); the bar wobbles (6 px/f); its sheet slides in (24 px/f)
// ===============================================================================================================
const Shot812: ShotFC<C08> = ({ f, len }) => {
  const sx = Math.max(0, 900 - f * 24);
  const k = 100; // px per "times"
  return (
    <Pop f={f}>
      <Stage theme={SC.theme} shotFrame={f} drift={DRIFT(92)} vignette={0.14} grain={0.5}>
        <Board f={f} />
        <Layer depth={1}>
          <Sheet x={480} y={260} w={640} h={700} f={f} swing={5} kind="heard">
            <Planet cx={320} cy={330} r={220} f={f} shear={[20, -16, 22, -18]} />
            <DryPatch f={f} x={360} y={360} r={56} open={1} />
          </Sheet>
          <g transform={`translate(${sx} 0)`}>
            <Sheet x={1300} y={240} w={640} h={760} f={f} swing={5} phase={2} kind="apricot">
              <ErrorBar x={320} y={680} f={f} value={2.7 * k + 6 * Math.sin(f * 0.5)} grow={lin(f, 6, 22)} whisk={lin(f, 22, 22 + 240 / 40)} up={2.4 * k} down={1.7 * k} label={READ.water27.text} />
            </Sheet>
          </g>
        </Layer>
        <Dust f={f} seed={92} />
        <Layer depth={0}>
          <WordPill x={1000} y={130} text="WIDE ERROR BARS" size={40} F={SC} appear={lin(f, 24, 36)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 8-13 · Third, the models: a dashed blue MODEL sheet pins over the glowing interior; gravity points pop in (4 f) and a fit curve
//        draws through them (40 px/f); Tick pins it from the station ledge
// ===============================================================================================================
const FitPts: [number, number][] = [
  [90, 470],
  [190, 420],
  [290, 390],
  [390, 330],
  [490, 300],
  [590, 250],
  [690, 230],
  [790, 190],
];
const Shot813: ShotFC<C08> = ({ f }) => {
  const curve = "M60 490 C250 410 480 300 820 175";
  return (
    <Pop f={f}>
      <Stage theme={FU.theme} shotFrame={f} drift={DRIFT(93)} vignette={0.24} grain={0.5}>
        <Furnace f={f} />
        <Layer depth={0.8}>
          <Section f={f} cx={960} cy={1350} radius={950} layers={["gas", "liquid", "metal"]} core="dilute" swirl={0.8} />
        </Layer>
        <Layer depth={1}>
          <Sheet x={820} y={150} w={960} h={600} f={f} swing={6} kind="model">
            <TapeTicket x={170} y={70} word="MODEL" f={f} size={0.6} />
            {FitPts.map(([x, y], i) => (f >= 6 + i * 4 ? <circle key={i} cx={x + 60} cy={y} r={14 * Math.min(1, (f - 6 - i * 4) / 4)} fill={C.heard} stroke={INK} strokeWidth={3} /> : null))}
            <path d={curve} transform="translate(60 0)" fill="none" stroke={C.modelLabel} strokeWidth={8} strokeLinecap="round" {...drawn(lin(f, 20, 20 + 900 / 40))} />
          </Sheet>
          <Floor y={1010} />
          <Tick x={1600} y={1014} pxPerM={210} frame={f} facing={-1} pose="press" expression="determined" look={-0.6} />
          <Embers frame={f} x0={100} x1={1500} y={1060} n={24} color={C.goldHot} seed={93} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 8-14 · DIFFERENT ASSUMPTIONS: three fuzzy cores morph through different sizes (radius ±14 px/f); dots churn; the glow flows
// ===============================================================================================================
const Shot814: ShotFC<C08> = ({ f }) => (
  <Pop f={f}>
    <Stage theme={FU.theme} shotFrame={f} drift={DRIFT(94)} vignette={0.24} grain={0.5}>
      <Furnace f={f} />
      <Layer depth={1}>
        {[0, 1, 2].map((i) => {
          const cx = 360 + i * 600;
          const r = 170 + 70 * Math.sin(f * 0.11 + i * 2.1);
          return (
            <g key={i}>
              <circle cx={cx} cy={600} r={270} fill={C.liquid} opacity={0.9} />
              <circle cx={cx} cy={600} r={240} fill={C.gold} />
              <circle cx={cx} cy={600} r={270} fill="none" stroke={C.goldRim} strokeWidth={6} />
              <Fog f={f + i * 30} cx={cx} cy={600} r={r} n={50} spread={1} speed={16} />
            </g>
          );
        })}
        <Embers frame={f} x0={100} x1={1800} y={1080} n={24} color={C.goldHot} seed={94} />
      </Layer>
      <Layer depth={0}>
        <WordPill x={90} y={130} text="DIFFERENT ASSUMPTIONS" size={40} F={FU} appear={lin(f, 4, 16)} />
      </Layer>
    </Stage>
  </Pop>
);

// ===============================================================================================================
// 8-15 · 63 %, BEST FIT, NOT A READING: the 63 % ring is stamped dashed (36 px/f), the dots churn, the tag drops in (28 px/f)
// ===============================================================================================================
const Shot815: ShotFC<C08> = ({ f }) => {
  const R = 440;
  const cx = 1020;
  const cy = 600;
  const rr = R * 0.63;
  const k = lin(f, 4, 4 + (2 * Math.PI * rr) / 36);
  const segs = 40;
  const tagY = 980 - 700 * (1 - ez(f, 30, 30 + 700 / 28));
  return (
    <Pop f={f}>
      <Stage theme={FU.theme} shotFrame={f} drift={DRIFT(95)} vignette={0.24} grain={0.5}>
        <Furnace f={f} />
        <Layer depth={1}>
          <Bloom x={cx} y={cy} r={640} color={C.glow} strength={0.35} />
          <Section f={f} cx={cx} cy={cy} radius={R} layers={["gas", "liquid", "metal"]} core="dilute" swirl={1.2} />
          {Array.from({ length: segs }, (_, i) => {
            if (i / segs > k) return null;
            const a0 = -Math.PI / 2 + (i / segs) * Math.PI * 2;
            const a1 = a0 + (Math.PI * 2) / segs * 0.6;
            return <path key={i} d={`M${cx + Math.cos(a0) * rr} ${cy + Math.sin(a0) * rr} A${rr} ${rr} 0 0 1 ${cx + Math.cos(a1) * rr} ${cy + Math.sin(a1) * rr}`} stroke={C.model} strokeWidth={12} fill="none" strokeLinecap="round" />;
          })}
          <WordPill x={cx} y={tagY} text="BEST FIT, NOT A READING" size={36} F={FU} align="middle" />
        </Layer>
        <Layer depth={0}>
          <Readout x={70} y={60} value={READ.r63.value! /* #12 A */} k={k} unit="%" size={92} w={330} appear={lin(f, 0, 10)} who="8-15 63" />
          <TapeTicket x={260} y={330} word="MODEL" f={f} slam={lin(f, 8, 20)} swing={10} size={0.8} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 8-16 / 8-17 · NASA's two pages: page 1 slides in (30 px/f) and reads 156 KM; page 2 reads ABOUT 200 KM; a ruler draws between the
//        two numbers (40 px/f); the pages flutter (8 deg/f)
// ===============================================================================================================
const Page: React.FC<{ f: number; x: number; phase: number; text: string; who: string; pill: string; check?: number }> = ({ f, x, phase, text, who, pill, check }) => (
  <Sheet x={x} y={260} w={660} h={620} f={f} swing={12} phase={phase} kind="apricot">
    <WordPill x={40} y={70} text={pill} size={28} fill={C.modelLabel} color={INK} dot={C.belt} />
    <MarkLines x={40} y={140} w={560} n={4} f={f} gap={40} />
    <Num x={330} y={420} text={text} size={text.length > 7 ? 78 : 110} color={INK} align="middle" who={who} />
    <MarkLines x={40} y={480} w={560} n={3} f={f} gap={40} />
    {check != null ? <CheckPen x={520} y={360} k={check} s={0.7} /> : null}
  </Sheet>
);
const Shot816: ShotFC<C08> = ({ f }) => {
  const p1 = -800 + Math.min(1400, f * 30);
  const p2 = 2700 - Math.min(1400, Math.max(0, f - 40) * 30);
  return (
    <Pop f={f}>
      <Stage theme={SC.theme} shotFrame={f} drift={DRIFT(96)} vignette={0.14} grain={0.5}>
        <Board f={f} />
        <Layer depth={1}>
          <Page f={f} x={p1} phase={0} text={READ.km156.text /* #4 A */} who="8-16 156" pill="NASA PAGE 1" />
          <Page f={f} x={p2} phase={2} text="" who="8-16 page 2" pill="NASA PAGE 2" />
        </Layer>
        <Dust f={f} seed={96} />
      </Stage>
    </Pop>
  );
};
const Shot817: ShotFC<C08> = ({ f }) => (
  <Pop f={f}>
    <Stage theme={SC.theme} shotFrame={f} drift={DRIFT(97)} vignette={0.14} grain={0.5}>
      <Board f={f} />
      <Layer depth={1}>
        <Page f={f} x={600} phase={0} text={READ.km156.text /* #4 A */} who="8-17 156" pill="NASA PAGE 1" />
        <Page f={f} x={1300} phase={2} text={READ.km200.text /* #3 A */} who="8-17 200" pill="NASA PAGE 2" />
        <Bracket19 x0={720} y0={920} x1={1180} y1={920} k={lin(f, 8, 8 + 460 / 40)} color={C.heard} />
      </Layer>
      <Dust f={f} seed={97} />
    </Stage>
  </Pop>
);

// ===============================================================================================================
// 8-18 · deepdeck cutaway, USED: the probe under its canopy, its six chips lighting one by one (8 f) and pulsing; a check draws over
//        the 156 KM page pinned beside it (44 px/f); the decks scroll up (18 px/f)
// ===============================================================================================================
const Shot818: ShotFC<C08> = ({ f }) => (
  <Pop f={f}>
    <Stage theme={DD.theme} shotFrame={f} drift={DRIFT(98)} vignette={0.2} grain={0.5}>
      <Layer depth={0.1}>
        <FamSky name="deepdeck" />
      </Layer>
      <Layer depth={0.4}>
        <DeckBands f={f} speed={18} shear={[16, -14, 20, -18]} x={-400} y={-300} w={2720} h={1680} colors={["#F26A1E", "#D8381C", "#C0301A", "#F28A1E", "#A02418"]} belt />
      </Layer>
      <Layer depth={1}>
        <Bloom x={620} y={480} r={420} color={C.heard} strength={0.3 + 0.1 * Math.sin(f * 0.6)} />
        <Canopy x={620} y={500} r={140} unfurl={1} f={f} />
        <Capsule x={620} y={500} r={140} f={f} chips={Math.min(6, Math.max(0, (f - 4) / 8))} />
        <Sheet x={1340} y={220} w={620} h={560} f={f} swing={8} kind="apricot">
          <Num x={310} y={330} text={READ.km156.text /* #4 A */} size={110} color={INK} align="middle" who="8-18 156" />
          <CheckPen x={460} y={300} k={lin(f, 40, 40 + 380 / 44)} s={0.8} />
        </Sheet>
      </Layer>
      <Layer depth={0}>
        <WordPill x={1180} y={900} text="USED" size={44} F={DD} appear={lin(f, 40, 52)} />
      </Layer>
    </Stage>
  </Pop>
);

// ===============================================================================================================
// 8-19 · REFERENCE SITES (no numerals, Q9): the sheet slides in (30 px/f); two smudged "?" chips flicker (±6 px); the tape scrolls
// ===============================================================================================================
const Smudge: React.FC<{ x: number; y: number; f: number; seed: number }> = ({ x, y, f, seed }) => {
  const jx = 6 * Math.sin(f * 0.9 + seed);
  const jy = 6 * Math.cos(f * 0.7 + seed * 2);
  return (
    <g transform={`translate(${x + jx} ${y + jy})`}>
      {[0, 1, 2, 3].map((k) => (
        <rect key={k} x={-150 + (rnd(seed * 9 + k) - 0.5) * 40} y={-80 + (rnd(seed * 5 + k) - 0.5) * 24} width={300} height={160} rx={40} fill={C.lever} opacity={0.22} />
      ))}
      <rect x={-130} y={-70} width={260} height={140} rx={36} fill={C.apricot} stroke={C.lever} strokeWidth={5} strokeDasharray="14 10" />
      <text x={-6} y={44} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 120, fill: INK, opacity: 0.35 }}>
        ?
      </text>
      <text x={6} y={40} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: 120, fill: INK }}>
        ?
      </text>
    </g>
  );
};
const Shot819: ShotFC<C08> = ({ f }) => {
  const sx = Math.max(0, 1300 - f * 30);
  return (
    <Pop f={f}>
      <Stage theme={SC.theme} shotFrame={f} drift={DRIFT(99)} vignette={0.14} grain={0.5}>
        <Board f={f} />
        <Layer depth={1}>
          <g transform={`translate(${sx} 0)`}>
            <Sheet x={960} y={260} w={1100} h={640} f={f} swing={6} kind="apricot">
              <MarkLines x={60} y={150} w={980} n={2} f={f} gap={44} />
              <Smudge x={300} y={420} f={f} seed={1} />
              <Smudge x={800} y={420} f={f} seed={2} />
            </Sheet>
          </g>
        </Layer>
        <Dust f={f} seed={99} />
        <Layer depth={0}>
          <WordPill x={90} y={290} text="REFERENCE SITES" size={40} F={SC} appear={lin(f, 4, 16)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 8-20 · NASA's own wording: the NASA page reads 23 ATM, OVER 300 F; a check stamps it (44 px/f); the pages slide (18 px/f)
// ===============================================================================================================
const Shot820: ShotFC<C08> = ({ f }) => {
  const away = Math.min(1600, f * 18);
  return (
    <Pop f={f}>
      <Stage theme={SC.theme} shotFrame={f} drift={DRIFT(100)} vignette={0.14} grain={0.5}>
        <Board f={f} />
        <Layer depth={1}>
          <g transform={`translate(${-away} 0)`} opacity={0.75}>
            <Sheet x={560} y={300} w={760} h={560} f={f} swing={6} kind="apricot">
              <Smudge x={380} y={300} f={f} seed={3} />
            </Sheet>
          </g>
          <g transform={`translate(${Math.max(0, 500 - f * 18)} 0)`}>
            <Sheet x={1120} y={240} w={980} h={680} f={f} swing={6} phase={1} kind="heard">
              <Num x={490} y={290} text="23 ATM" size={130} color={INK} align="middle" who="8-20 23 atm (#2 A)" />
              <Num x={490} y={470} text="OVER 300 F" size={110} color={INK} align="middle" who="8-20 300 F (#2 A)" />
              <CheckPen x={860} y={560} k={lin(f, 20, 20 + 380 / 44)} s={0.6} />
            </Sheet>
          </g>
        </Layer>
        <Dust f={f} seed={100} />
        <Layer depth={0}>
          <AgencyPill x={90} y={290} agency="NASA SAYS" size={34} appear={lin(f, 4, 16)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 8-21 · ABOUT, and the range: a range bar from 156 to 200 grows its whiskers outward (36 px/f); the ABOUT tag drops in (28 px/f);
//        Tick (≥ 40 %) writes ABOUT on his card; the tape scrolls
// ===============================================================================================================
const Shot821: ShotFC<C08> = ({ f }) => {
  const xa = 300;
  const xb = 1200;
  const mid = (xa + xb) / 2;
  const k = lin(f, 4, 4 + (xb - xa) / 2 / 36);
  const tagY = 520 - 500 * (1 - ez(f, 24, 24 + 500 / 28));
  const write = lin(f, 40, 90);
  return (
    <Pop f={f}>
      <Stage theme={SC.theme} shotFrame={f} drift={DRIFT(101)} vignette={0.14} grain={0.5}>
        <Board f={f} />
        <Layer depth={1}>
          <rect x={xa - 40} y={640} width={xb - xa + 80} height={14} rx={7} fill="#004A2E" />
          <rect x={mid - (mid - xa) * k} y={610} width={(xb - xa) * k} height={74} rx={18} fill={C.heard} stroke={C.lemonDeep} strokeWidth={4} />
          {k >= 1
            ? [xa, xb].map((x) => <rect key={x} x={x - 7} y={580} width={14} height={134} rx={6} fill={C.lever} />)
            : null}
          <Num x={xa} y={780} text={READ.km156.text /* #4 A */} size={60} color={INK} align="middle" who="8-21 156" />
          <Num x={xb} y={780} text={READ.km200.text /* #3 A */} size={60} color={INK} align="middle" who="8-21 200" />
          <AboutPill x={mid} y={tagY} size={48} align="middle" />
          <Floor y={1010} />
          <g transform={`rotate(${-6 + 2 * Math.sin(f * 0.2)} 1450 640)`}>
            <rect x={1340} y={560} width={240} height={150} rx={16} fill={C.apricot} stroke={C.lever} strokeWidth={4} />
            <clipPath id="b821">
              <rect x={1360} y={570} width={200 * write} height={130} />
            </clipPath>
            <g clipPath="url(#b821)">
              <Label x={1460} y={655} text="ABOUT" size={46} color={INK} align="middle" />
            </g>
          </g>
          <Tick x={1640} y={1014} pxPerM={262} frame={f} facing={-1} pose="hold" expression="happy" look={-0.7} headTilt={4 * Math.sin(f * 0.3)} />
        </Layer>
        <Dust f={f} seed={102} />
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 8-22 · "the probe's descent is known": the solid tape glows (30 px/f) and the marker slides back to its end (28 px/f); the
//        camera pulls back. PUSH → 8-23.
// ===============================================================================================================
const Shot822: ShotFC<C08> = ({ f, len }) => {
  const m = 0.9 - (0.9 - SOLID) * ez(f, 2, 2 + ((0.9 - SOLID) * 2040) / 28);
  return (
    <Stage theme={SC.theme} cam={{ x: 960, y: 540, zoom: 1.16 - 0.12 * ez(f, 0, len) }} vignette={0.14} grain={0.5}>
      <Board f={f} tape={false} />
      <Layer depth={1}>
        <Bloom x={-60 + 2040 * SOLID * 0.5} y={520} r={700} color={C.heard} strength={0.35 + 0.15 * Math.sin(f * 0.4)} />
        <Ledger f={f} x0={-60} x1={1980} y={520} solidTo={SOLID} marker={m} drift={30} pins={[0.06, 0.25, 0.45, 0.7, 0.92]} />
      </Layer>
      <Dust f={f} seed={103} />
    </Stage>
  );
};

// ===============================================================================================================
// 8-23 · "not settled": below the tape the dashed part gets a big "?" (bobbing) and the glowing interior fills the frame; the dashes
//        march (28 px/f); Tick shrugs from the station ledge
// ===============================================================================================================
const Shot823: ShotFC<C08> = ({ f }) => (
  <Stage theme={FU.theme} shotFrame={f} drift={DRIFT(104)} vignette={0.24} grain={0.5}>
    <Furnace f={f} glow={0.36} />
    <Layer depth={0.8}>
      <Section f={f} cx={900} cy={1400} radius={1000} layers={["gas", "liquid", "metal"]} core="dilute" swirl={0.9} />
    </Layer>
    <Layer depth={1}>
      <Ledger f={f} x0={-60} x1={1980} y={150} solidTo={0.3} drift={28} pins={[0.06, 0.3, 0.7]} />
      <QuestionTag x={1140} y={420} f={f} size={170} />
      <Floor y={1010} />
      <Tick x={1640} y={1014} pxPerM={220} frame={f} facing={-1} pose="shrug" expression="neutral" look={-0.4} />
      <Sparks f={f} x={800} y={1100} w={600} h={700} n={20} speed={22} angle={-90} seed={104} />
    </Layer>
  </Stage>
);
const Run822 = runOf<C08>((c) => [
  { at: c.s822, S: Shot822 },
  { at: c.s823, S: Shot823, dir: "up", blend: 18 },
]);

const popped = (R: ShotFC<C08>): ShotFC<C08> => {
  const S: ShotFC<C08> = (p) => (
    <Pop f={p.f}>
      <R {...p} />
    </Pop>
  );
  return S;
};

// ===============================================================================================================

export const SceneL08: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL08(t);
  const shots: ShotDef<C08>[] = [
    { from: c.s801, S: Shot801, id: "8-01" },
    { from: c.s802, S: Shot802, id: "8-02" },
    { from: c.s803, S: Shot803, id: "8-03" },
    { from: c.s804, S: Shot804, id: "8-04" },
    { from: c.s805, S: Shot805, id: "8-05" },
    { from: c.s806, S: Shot806, id: "8-06" },
    { from: c.s807, S: popped(Run807), id: "8-07" }, // + 8-08 (SLIDE)
    { from: c.s809, S: Shot809, id: "8-09" },
    { from: c.s810, S: Shot810, id: "8-10" },
    { from: c.s811, S: Shot811, id: "8-11" },
    { from: c.s812, S: Shot812, id: "8-12" },
    { from: c.s813, S: Shot813, id: "8-13" },
    { from: c.s814, S: Shot814, id: "8-14" },
    { from: c.s815, S: Shot815, id: "8-15" },
    { from: c.s816, S: Shot816, id: "8-16" },
    { from: c.s817, S: Shot817, id: "8-17" },
    { from: c.s818, S: Shot818, id: "8-18" },
    { from: c.s819, S: Shot819, id: "8-19" },
    { from: c.s820, S: Shot820, id: "8-20" },
    { from: c.s821, S: Shot821, id: "8-21" },
    { from: c.s822, S: popped(Run822), id: "8-22" }, // + 8-23 (PUSH)
  ];
  return playShots(f, shots, c, c.end);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL08 = (t: SceneTiming): Cue[] => {
  const c = cuesL08(t);
  const run = (at: number, n: number, gap = 8, vol = 0.06): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 6 }));
  const hit = (at: number, file: string, vol = 0.12, dur = 10): Cue[] => [...cutHit(at), { at: at + 4, file, vol, dur }];
  return [
    ...hit(0, SFX.pop, 0.16, 20),
    ...run(20, 4, 10, 0.06),
    ...hit(c.s802, SFX.click),
    ...cutHit(c.s803),
    ...run(c.s803 + 12, 5, 8, 0.07),
    ...hit(c.s804, SFX.click),
    ...hit(c.s805, SFX.whoosh, 0.12, 50),
    ...hit(c.s806, SFX.click),
    ...hit(c.s807, SFX.click),
    { at: c.s808 + 2, file: SFX.chime, vol: 0.14, dur: 90, fadeOut: 30 },
    ...hit(c.s809, SFX.click),
    ...hit(c.s810, SFX.pop, 0.16, 20),
    ...cutHit(c.s811),
    ...run(c.s811 + 6, 8, 8, 0.05),
    ...hit(c.s812, SFX.click),
    ...hit(c.s813, SFX.click),
    ...hit(c.s814, SFX.swirl, 0.14, 60),
    ...hit(c.s815, SFX.chime, 0.14, 90),
    ...hit(c.s816, SFX.whoosh, 0.12, 50),
    ...hit(c.s817, SFX.click),
    ...cutHit(c.s818),
    { at: c.s818 + 4, file: SFX.click, vol: 0.12, dur: 8 },
    { at: c.s818 + 42, file: SFX.pop, vol: 0.14, dur: 20 },
    ...hit(c.s819, SFX.whoosh, 0.12, 50),
    ...hit(c.s820, SFX.click),
    ...hit(c.s821, SFX.click),
    ...hit(c.s822, SFX.click),
    { at: c.s823, file: SFX.rumble, vol: 0.12, dur: 110, fadeIn: 10, fadeOut: 30 },
  ];
};
