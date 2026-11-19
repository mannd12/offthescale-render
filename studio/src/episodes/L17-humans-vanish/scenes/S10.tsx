// L17 scene "l10" (storyboard §3 "10 · What we saw, and what we modelled", script lines 42-51). Package B.
// The one bright plate room: the teal evidence board (Board) in its ochre frame, paper sheets, two stamp families
// (SEEN green hexagon, MODEL slate-teal square, the four MODEL-colour tags). F15: every shot has a stamp slam, a drawing
// head or a sliding sheet; none longer than 7.8 s.
// Shot components (hard cuts; PUSH / SLIDE rows are phases): 10-01 (+10-02) · 10-03 · 10-04 · 10-05 · 10-06 · 10-07 ·
// 10-08 · 10-09 · 10-10 · 10-11 · 10-12 (+10-13, 10-14, 10-15: the ladder page) · 10-16 (+10-17, 10-18, 10-19) · 10-20 ·
// 10-21 · 10-22 · 10-23 · 10-24 · 10-25 · 10-26 · 10-27.
// Numbers drawn (data17 READ): 3.3 MILLION YEARS (#12 A, 10-03) · 116,000 PEOPLE LEFT (#16 A, 10-05) · 4,200 KM2 (#16 A,
// 10-06) · MORE THAN 7 TIMES (#16 A, 10-08) · 2024 (#15 A, 10-26). Words only: SIMILAR ×4 (#16), the stamps (#5 #6 #7 #8
// #10 #11 #12 #19), NO CLOCK, FROM HOW THEY WORK (#2 #3 #19), HUNDREDS OF YEARS? (#17, a rumour: no numeral, F3), QUICKLY,
// NOT AT ALL + NOAA chip (#17), ANTHROPOCENE, NOT YET, APPROVED, WILL STAY IN USE (#15, no vote tally).
// F10: Chernobyl is a circle, a counter, dark house icons, bars and animals; no people, no hazard symbol, no cause.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Bloom, Kicker, Layer, Stage, Tick, cameraAt } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { familyOf } from "../families";
import { READ } from "../data17";
import { TimeLadder } from "../ladder";
import { Board, SeenStamp, Sheet, SourceChip, Stamp17, TagStamp, WordPill, type StampKind } from "../stamps17";
import { BottleIcon, DomeIcon, EiffelIcon, GearIcon, LampIcon, PrintIcon, PumpIcon, StoneIcon } from "../icons17";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { Animal, Big, C, CREAM, ClockFace, Eye, House, INK, Label, Num, Pop, RollDec, RollInt, Slam, StudioCyc, TextPlate, alpha, clamp01, drawn, ez, lin, mixHex, mod, path1, rnd, rungY } from "./b-parts";

export const cuesL10 = (t: SceneTiming) => {
  const { at, frac } = cueKit(t);
  return {
    honest: 0, // 10-01
    rome: frac(0, 0.3), // 10-02 (phase)
    tools: frac(0, 0.65), // 10-03
    place: at(1), // 10-04
    zone: at(2), // 10-05
    area: frac(2, 0.51), // 10-06
    bars: at(3), // 10-07
    wolves: frac(3, 0.64), // 10-08
    nature: at(4), // 10-09
    decades: frac(4, 0.35), // 10-10
    chips: frac(4, 0.64), // 10-11
    ladder: at(5), // 10-12
    eiffel: frac(5, 0.24), // 10-13 (phase)
    rust: frac(5, 0.5), // 10-14 (phase)
    romeSeen: frac(5, 0.86), // 10-15 (phase)
    mountain: at(6), // 10-16
    tunnel: frac(6, 0.26), // 10-17 (phase)
    prints: frac(6, 0.51), // 10-18 (phase)
    tools2: frac(6, 0.78), // 10-19 (phase)
    early: at(7), // 10-20
    clock: frac(7, 0.25), // 10-21
    work: frac(7, 0.6), // 10-22
    plastic: at(8), // 10-23
    bottles: frac(8, 0.48), // 10-24
    name: at(9), // 10-25
    vote: frac(9, 0.3), // 10-26
    stay: frac(9, 0.67), // 10-27
    end: t.frames,
  };
};
export type C10 = ReturnType<typeof cuesL10>;

const STUDIO = familyOf("studio");
const ST = STUDIO.theme;

// ---------------------------------------------------------------------------------------------------------------
// the ladder page (10-01..10-03, 10-12..10-20): one tall board in content coordinates; the camera slides rung to rung
// ---------------------------------------------------------------------------------------------------------------
const LY0 = -1250;
const LY1 = 1000;
const LX = 760;
const ry = (i: number) => rungY(LY0, LY1, i);
type Slot = { key: string; rung: number; x: number; kind: StampKind };
const SLOTS: Slot[] = [
  { key: "0", rung: 0, x: 1230, kind: "model" },
  { key: "1", rung: 1, x: 1230, kind: "model" },
  { key: "2", rung: 2, x: 1230, kind: "model" },
  { key: "3", rung: 3, x: 1230, kind: "seen" },
  { key: "4g", rung: 4, x: 1230, kind: "seen" },
  { key: "4", rung: 4, x: 1420, kind: "model" },
  { key: "5", rung: 5, x: 1230, kind: "seen" },
  { key: "6", rung: 6, x: 1280, kind: "ESTIMATE" },
  { key: "7", rung: 7, x: 1280, kind: "A PLAN" },
  { key: "8a", rung: 8, x: 1280, kind: "BEST GUESS" },
  { key: "8b", rung: 8, x: 1730, kind: "seen" },
];
const camOn = (key: string, zoom = 1) => {
  const s = SLOTS.find((q) => q.key === key)!;
  return { x: s.x - 40, y: ry(s.rung) + 20, zoom };
};

/** A saffron ledge bolted to the board, for Tick. */
const Ledge: React.FC<{ x: number; y: number; w?: number }> = ({ x, y, w = 220 }) => (
  <g>
    <rect x={x - w / 2 + 6} y={y + 8} width={w} height={22} rx={8} fill="#04161C" opacity={0.25} />
    <rect x={x - w / 2} y={y} width={w} height={22} rx={8} fill={C.saffron} />
    <rect x={x - w / 2} y={y} width={w} height={6} rx={3} fill="#FFE6A8" />
    {[-0.35, 0.35].map((u, i) => (
      <circle key={i} cx={x + u * w} cy={y + 12} r={5} fill={C.saffronDeep} />
    ))}
  </g>
);

/** The rung icons (left of the stamps). */
const RungIcons: React.FC<{ f: number; rust: number; ruler: number; dashes: number }> = ({ f, rust, ruler, dashes }) => {
  const ix = 1010;
  return (
    <g>
      <LampIcon x={ix} y={ry(0)} size={150} lit={0.4 + 0.3 * Math.abs(Math.sin(f / 9))} />
      <PumpIcon x={ix} y={ry(1)} size={130} f={f} running />
      {/* YEAR: a wall square with a frost crack */}
      <g>
        <rect x={ix - 70} y={ry(2) - 70} width={140} height={140} rx={10} fill="#C9D8D8" stroke={INK} strokeWidth={4} />
        <path d={`M${ix - 60} ${ry(2) - 40} l40 30 l-10 30 l50 20 l30 50`} fill="none" stroke={INK} strokeWidth={6} />
        <path d={`M${ix - 60} ${ry(2) - 40} l40 30 l-10 30 l50 20 l30 50`} fill="none" stroke="#7FD0E8" strokeWidth={2} />
      </g>
      <EiffelIcon x={ix} y={ry(3)} size={200} />
      {/* A HUNDRED: a concrete square, a bar, the rust blot spreading */}
      <g>
        <rect x={ix - 80} y={ry(4) - 75} width={160} height={150} rx={10} fill={C.concrete} stroke={INK} strokeWidth={4} />
        <rect x={ix - 80} y={ry(4) - 8} width={160} height={16} fill={C.steel} />
        <ellipse cx={ix} cy={ry(4)} rx={14 + 60 * rust} ry={10 + 34 * rust} fill={C.rust} opacity={0.9} />
        <ellipse cx={ix - 6} cy={ry(4) - 4} rx={6 + 34 * rust} ry={4 + 16 * rust} fill="#D86A2A" opacity={0.8} />
      </g>
      <DomeIcon x={ix} y={ry(5)} size={170} />
      {/* TEN THOUSAND: a short ruler sliding into place */}
      <g transform={`translate(${(1 - ruler) * 120} 0)`}>
        <rect x={ix - 90} y={ry(6) - 26} width={180} height={52} rx={6} fill={C.saffron} stroke={INK} strokeWidth={3} />
        {Array.from({ length: 10 }, (_, i) => (
          <line key={i} x1={ix - 80 + i * 18} y1={ry(6) - 26} x2={ix - 80 + i * 18} y2={ry(6) - (i % 5 ? 12 : 2)} stroke={INK} strokeWidth={3} />
        ))}
      </g>
      {/* A HUNDRED THOUSAND: a dashed tunnel icon */}
      <g>
        <path d={`M${ix - 90} ${ry(7) - 60} L${ix + 10} ${ry(7) + 10} L${ix + 90} ${ry(7) + 10} M${ix + 20} ${ry(7) + 10} L${ix + 20} ${ry(7) + 60} M${ix + 70} ${ry(7) + 10} L${ix + 70} ${ry(7) + 60}`} fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" opacity={0.2} />
        <path
          d={`M${ix - 90} ${ry(7) - 60} L${ix + 10} ${ry(7) + 10} L${ix + 90} ${ry(7) + 10} M${ix + 20} ${ry(7) + 10} L${ix + 20} ${ry(7) + 60} M${ix + 70} ${ry(7) + 10} L${ix + 70} ${ry(7) + 60}`}
          fill="none"
          stroke={C.tealDeep}
          strokeWidth={8}
          strokeDasharray="14 10"
          strokeLinecap="round"
          clipPath="url(#l10dashclip)"
        />
        <clipPath id="l10dashclip">
          <rect x={ix - 100} y={ry(7) - 80} width={200 * dashes} height={160} />
        </clipPath>
      </g>
      <PrintIcon x={ix} y={ry(8)} size={170} rotate={-90} />
      <StoneIcon x={1520} y={ry(8)} size={150} />
    </g>
  );
};

const LadderWorld: React.FC<{
  f: number;
  slams?: Record<string, number>;
  ghosts?: boolean;
  draw?: number;
  rust?: number;
  ruler?: number;
  dashes?: number;
  header?: number;
  tick?: { x: number; y: number; pose: React.ComponentProps<typeof Tick>["pose"]; expression: React.ComponentProps<typeof Tick>["expression"]; facing?: 1 | -1; nod?: number; opacity?: number; pencil?: boolean };
}> = ({ f, slams = {}, ghosts = false, draw = 1, rust = 0.4, ruler = 1, dashes = 1, header = 1, tick }) => {
  const dTop = LY0 - 120;
  const dH = (LY1 + 60 - dTop) * clamp01(draw);
  return (
    <g>
      <Board x={140} y={-1850} w={1820} h={2950} f={f}>
        {/* the header sheets: the two stamp families as a legend */}
        <Sheet x={180} y={90} w={760} h={360} f={f} title="WHAT WE SAW" band="green" appear={header} stamp={{ kind: "seen" }}>
          <Label x={30} y={80} text="A SOURCE SAW IT" size={30} color={INK} />
        </Sheet>
        <Sheet x={1000} y={90} w={760} h={360} f={f} title="WHAT WE MODELLED" band="slate" appear={clamp01(header * 1.6 - 0.6)} stamp={{ kind: "model" }}>
          <Label x={30} y={80} text="OUR REASONING" size={30} color={INK} />
        </Sheet>
      </Board>
      <clipPath id="l10ladderclip">
        <rect x={-200} y={dTop} width={2400} height={dH} />
      </clipPath>
      <g clipPath="url(#l10ladderclip)">
        <TimeLadder x={LX} y0={LY0} y1={LY1} f={f} family={STUDIO} labels="left" width={150} size={2.0} />
        <RungIcons f={f} rust={rust} ruler={ruler} dashes={dashes} />
      </g>
      {draw > 0 && draw < 1 ? (
        <g>
          <circle cx={LX - 75} cy={dTop + dH} r={14} fill={C.saffronCore} />
          <circle cx={LX + 75} cy={dTop + dH} r={14} fill={C.saffronCore} />
          <circle cx={LX - 75} cy={dTop + dH} r={30} fill={C.saffron} opacity={0.35} />
          <circle cx={LX + 75} cy={dTop + dH} r={30} fill={C.saffron} opacity={0.35} />
        </g>
      ) : null}
      {SLOTS.map((s) => {
        const at = slams[s.key];
        const age = at === undefined ? undefined : f - at;
        const y = ry(s.rung);
        if (age !== undefined && age >= 0) return <Stamp17 key={s.key} x={s.x} y={y} kind={s.kind} age={age} f={f} size={150} rotate={-6} />;
        if (ghosts || s.key === "4g") return <Stamp17 key={s.key} x={s.x} y={y} kind={s.kind} ghost f={f} size={150} rotate={-6} />;
        return null;
      })}
      {tick ? (
        <g opacity={tick.opacity ?? 1}>
          <Ledge x={tick.x} y={tick.y} />
          <Tick x={tick.x} y={tick.y} pxPerM={150} frame={f} facing={tick.facing ?? -1} pose={tick.pose} expression={tick.expression} headTilt={tick.nod ? Math.sin(tick.nod * Math.PI * 2) * 10 : 0} />
          {tick.pencil ? <rect x={tick.x - 30} y={tick.y - 230} width={8} height={44} rx={3} fill={C.saffron} transform={`rotate(30 ${tick.x - 26} ${tick.y - 210})`} /> : null}
        </g>
      ) : null}
    </g>
  );
};

/** Ticks on ledges beside a rung (x right of the stamps). */
const tickAt = (rung: number, x = 1600) => ({ x, y: ry(rung) + 120 });

// ===============================================================================================================
// 10-01 + 10-02 · wide on the board: the two header sheets slide up (20 px/f) and the ladder draws itself down the page
// (30 px/f on screen); Tick pins the sheets. Kicker '— WHAT WE SAW · WHAT WE MODELLED'. Phase 10-02: the camera pushes
// to A THOUSAND (the ladder sliding, ~20 px/f) and a SEEN stamp slams beside the dome; Tick, on a ledge, nods. #7 A.
// ===============================================================================================================
const ShotHonest: ShotFC<C10> = ({ f, c }) => {
  const p2 = c.rome - c.honest;
  const wide = { x: 1050, y: -380, zoom: 0.37 };
  const cam = cameraAt(f, [
    { f: 0, ...wide, zoom: 0.35 },
    { f: p2, ...wide },
    { f: p2 + 30, ...camOn("5") },
    { f: p2 + 200, ...camOn("5", 1.06) },
  ]);
  const t2 = tickAt(5);
  return (
    <Stage theme={ST} cam={cam} vignette={0.1} grain={0.45}>
      <StudioCyc f={f} floor={1300} />
      <Layer depth={1}>
        <LadderWorld
          f={f}
          draw={lin(f, 18, 18 + 2420 * 0.37 / 30)}
          header={ez(f, 2, 22)}
          slams={{ "5": p2 + 36 }}
          tick={f > p2 + 14 ? { ...t2, pose: f < p2 + 36 ? "press" : "stand", expression: f > p2 + 40 ? "happy" : "determined", nod: lin(f, p2 + 44, p2 + 70), opacity: ez(f, p2 + 14, p2 + 26) } : undefined}
        />
      </Layer>
      <Layer depth={0}>
        <g opacity={1 - ez(f, p2 - 6, p2 + 6)}>
          <Kicker x={80} y={90} text="WHAT WE SAW · WHAT WE MODELLED" color={INK} size={30} />
          <ellipse cx={1660} cy={1030} rx={110} ry={14} fill="#000" opacity={0.18} />
          <Tick x={1660} y={1025} pxPerM={250} frame={f} facing={-1} pose={f < 40 ? "press" : "point"} expression="neutral" look={0.6} />
        </g>
      </Layer>
    </Stage>
  );
};

// ===============================================================================================================
// 10-03 · A MILLION: SEEN slams beside the chipped stone; the counter rolls to 3.3 MILLION YEARS (#12 A). The camera
// slides along the rung to the stone.
// ===============================================================================================================
const ShotTools: ShotFC<C10> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, ...camOn("8a"), x: 1300 },
    { f: 24, ...camOn("8b") },
    { f: len, ...camOn("8b", 1.06) },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={ST} cam={cam} vignette={0.1} grain={0.45}>
        <StudioCyc f={f} floor={1300} />
        <Layer depth={1}>
          <LadderWorld f={f} slams={{ "5": -200, "8b": 26 }} />
        </Layer>
        <Layer depth={0}>
          <TextPlate x={80} y={830} w={940} h={170} color="#1E4A5C" opacity={0.85} />
          <RollDec x={120} y={950} value={READ.lomekwi.value! /* #12 A */} k={ez(f, 20, 70)} unit="MILLION YEARS" size={110} who="10-03 tools" />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// the zone sheet (10-04..10-06, 10-09): a circle, a notebook, the house grid, the animals
// ---------------------------------------------------------------------------------------------------------------
const ZC = { x: 640, y: 560, r: 300 };
const HOUSES = (() => {
  const out: { x: number; y: number }[] = [];
  for (let gx = -4; gx <= 4; gx++)
    for (let gy = -4; gy <= 4; gy++) {
      const x = ZC.x + gx * 68 + (gy % 2 ? 34 : 0);
      const y = ZC.y + gy * 62 + 20;
      if (Math.hypot(x - ZC.x, y - ZC.y - 10) < ZC.r - 50) out.push({ x, y });
    }
  return out;
})();
const Notebook: React.FC<{ f: number; x: number; y: number; speed?: number }> = ({ f, x, y, speed = 1 }) => {
  const ph = mod((f * speed) / 14, 1);
  const sx = Math.cos(ph * Math.PI);
  return (
    <g>
      <rect x={x - 220} y={y - 150} width={440} height={300} rx={12} fill="#04161C" opacity={0.18} transform="translate(8 12)" />
      <rect x={x - 220} y={y - 150} width={440} height={300} rx={12} fill={C.tealDeep} />
      <rect x={x - 205} y={y - 138} width={200} height={276} fill={C.paper} />
      <rect x={x + 5} y={y - 138} width={200} height={276} fill={C.paper} />
      {Array.from({ length: 7 }, (_, i) => (
        <g key={i}>
          <line x1={x - 190} x2={x - 30} y1={y - 100 + i * 34} y2={y - 100 + i * 34} stroke={C.water} strokeWidth={2} opacity={0.4} />
          <line x1={x + 20} x2={x + 180} y1={y - 100 + i * 34} y2={y - 100 + i * 34} stroke={C.water} strokeWidth={2} opacity={0.4} />
          <rect x={x + 22} y={y - 112 + i * 34} width={60 + rnd(i * 3) * 90} height={8} rx={4} fill={INK} opacity={0.5} />
        </g>
      ))}
      <path d={`M${x} ${y - 138} L${x + 200 * sx} ${y - 138 - 20 * Math.sin(ph * Math.PI)} L${x + 200 * sx} ${y + 138 - 20 * Math.sin(ph * Math.PI)} L${x} ${y + 138} Z`} fill={sx > 0 ? "#FFFDF6" : "#EDE3CC"} stroke="#C9B48A" strokeWidth={2} />
    </g>
  );
};
const ZoneBoard: React.FC<{ f: number; children: React.ReactNode }> = ({ f, children }) => (
  <Board x={80} y={60} w={1760} h={960} f={f}>
    <Sheet x={70} y={60} w={1620} h={850} f={f} title="WHAT WE SAW" band="green" />
    <g transform="translate(-80 -60)">{children}</g>
  </Board>
);
const ZoneShot: React.FC<{ f: number; seed: number; children: React.ReactNode; push?: number }> = ({ f, seed, children, push = 0.04 }) => (
  <Pop f={f}>
    <Stage theme={ST} shotFrame={f} drift={{ zoom: 1 + push, panX: 0.008, panY: 0, frames: 220, seed }} vignette={0.1} grain={0.45}>
      <StudioCyc f={f} floor={1100} />
      <Layer depth={1}>
        <ZoneBoard f={f}>{children}</ZoneBoard>
      </Layer>
    </Stage>
  </Pop>
);
const circleD = `M${ZC.x} ${ZC.y - ZC.r} A${ZC.r} ${ZC.r} 0 1 1 ${ZC.x - 0.01} ${ZC.y - ZC.r}`;

// 10-04 · a plain circle labelled ONE PLACE draws (40 px/f); the notebook beside it flips pages (30 px/f). #16 A.
const ShotPlace: ShotFC<C10> = ({ f }) => (
  <ZoneShot f={f} seed={3}>
    <path d={circleD} fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" {...drawn(lin(f, 6, 6 + (2 * Math.PI * ZC.r) / 40))} />
    <circle cx={ZC.x} cy={ZC.y} r={ZC.r} fill={C.seen} opacity={0.06 * ez(f, 40, 60)} />
    <Label x={ZC.x} y={ZC.y + 14} text="ONE PLACE" size={44} color={INK} align="middle" opacity={ez(f, 30, 44)} />
    <Notebook f={f} x={1360} y={520} />
  </ZoneShot>
);

// 10-05 · CHERNOBYL EXCLUSION ZONE: the house icons go dark in a wave (24 px/f); the counter rolls to 116,000 PEOPLE LEFT
// (#16 A). No people, no hazard symbol (F10).
const ShotZone: ShotFC<C10> = ({ f }) => {
  const wave = ZC.x - ZC.r - 40 + Math.max(0, f - 12) * 24 * 0.55;
  return (
    <ZoneShot f={f} seed={5}>
      <circle cx={ZC.x} cy={ZC.y} r={ZC.r} fill={C.seen} opacity={0.06} />
      <circle cx={ZC.x} cy={ZC.y} r={ZC.r} fill="none" stroke={INK} strokeWidth={10} />
      {HOUSES.map((h, i) => {
        const lit = clamp01((h.x + (h.y - ZC.y) * 0.4 - wave) / 60);
        return <House key={i} x={h.x} y={h.y} size={46} lit={lit} />;
      })}
      <rect x={ZC.x - 330} y={ZC.y - ZC.r - 78} width={660} height={56} rx={28} fill={C.paper} />
      <Label x={ZC.x} y={ZC.y - ZC.r - 38} text="CHERNOBYL EXCLUSION ZONE" size={32} color={INK} align="middle" />
      <Notebook f={f} x={1360} y={420} speed={0.5} />
      <TextPlate x={1010} y={700} w={760} h={170} color="#1E4A5C" opacity={0.88} />
      <RollInt x={1040} y={815} value={READ.zonePeople.value! /* #16 A */} k={ez(f, 8, 80)} unit="PEOPLE LEFT" size={96} who="10-05 people" />
    </ZoneShot>
  );
};

// 10-06 · the circle fills with a faint hatch (a front spreading at 24 px/f) and the area slams in: 4,200 KM2 (#16 A).
const ShotArea: ShotFC<C10> = ({ f }) => {
  const front = ZC.y - ZC.r + Math.max(0, f - 6) * 24;
  return (
    <ZoneShot f={f} seed={7}>
      <clipPath id="l10hatch">
        <circle cx={ZC.x} cy={ZC.y} r={ZC.r} />
      </clipPath>
      <g clipPath="url(#l10hatch)">
        <rect x={ZC.x - ZC.r} y={ZC.y - ZC.r} width={2 * ZC.r} height={Math.max(0, front - (ZC.y - ZC.r))} fill={C.seen} opacity={0.14} />
        {Array.from({ length: 26 }, (_, i) => {
          const x = ZC.x - ZC.r - 300 + i * 34 + mod(f * 1.5, 34);
          return <line key={i} x1={x} y1={ZC.y - ZC.r} x2={x + 400} y2={ZC.y + ZC.r} stroke={C.seenDeep} strokeWidth={4} opacity={0.5} clipPath="url(#l10hatchFront)" />;
        })}
        <clipPath id="l10hatchFront">
          <rect x={ZC.x - ZC.r} y={ZC.y - ZC.r} width={2 * ZC.r} height={Math.max(0, front - (ZC.y - ZC.r))} />
        </clipPath>
        <line x1={ZC.x - ZC.r} x2={ZC.x + ZC.r} y1={front} y2={front} stroke={C.seen} strokeWidth={6} opacity={front < ZC.y + ZC.r ? 1 : 0} />
      </g>
      {HOUSES.map((h, i) => (
        <House key={i} x={h.x} y={h.y} size={46} lit={0} />
      ))}
      <circle cx={ZC.x} cy={ZC.y} r={ZC.r} fill="none" stroke={INK} strokeWidth={10} />
      <rect x={ZC.x - 330} y={ZC.y - ZC.r - 78} width={660} height={56} rx={28} fill={C.paper} />
      <Label x={ZC.x} y={ZC.y - ZC.r - 38} text="CHERNOBYL EXCLUSION ZONE" size={32} color={INK} align="middle" />
      <Notebook f={f} x={1360} y={420} />
      <Slam age={f - 22} x={1390} y={770} ring={C.seen} size={220}>
        <TextPlate x={1030} y={690} w={720} h={160} color="#1E4A5C" opacity={0.9} />
        <Num x={1390} y={805} text={READ.zoneArea.text /* #16 A */} size={104} align="middle" who="10-06 area" />
      </Slam>
    </ZoneShot>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// the counts chart (10-07, 10-08): paired bars ZONE / RESERVES for elk, roe deer, red deer, wild boar; then wolves
// ---------------------------------------------------------------------------------------------------------------
const GROUPS = [
  { name: "ELK", kind: "elk" as const },
  { name: "ROE DEER", kind: "roe" as const },
  { name: "RED DEER", kind: "red" as const },
  { name: "WILD BOAR", kind: "boar" as const },
];
const BASE = 700;
const BH = 300;
const gx = (i: number) => 300 + i * 290;
const WX = 1460;
const WR = 60; // wolves' reserve bar height (its own scale)
const ChartBoard: React.FC<{ f: number; grow: (i: number, which: 0 | 1) => number; similar: (i: number) => number; wolf: number; trot: number; wolfOnly?: boolean }> = ({ f, grow, similar, wolf, trot, wolfOnly = false }) => (
  <Board x={80} y={60} w={1760} h={960} f={f}>
    <Sheet x={70} y={60} w={1620} h={850} f={f} title="ANIMAL COUNTS" band="teal" />
    <g transform="translate(-80 -60)">
      {/* legend */}
      <rect x={260} y={232} width={30} height={30} rx={6} fill={C.tealDeep} />
      <Label x={302} y={258} text="ZONE" size={24} color={INK} />
      <rect x={420} y={232} width={30} height={30} rx={6} fill="#C98A2E" />
      <Label x={462} y={258} text="NEARBY RESERVES" size={24} color={INK} />
      <line x1={230} x2={1300} y1={BASE} y2={BASE} stroke={INK} strokeWidth={4} />
      {GROUPS.map((g, i) => (
        <g key={g.name} opacity={wolfOnly ? 0.45 : 1}>
          {[0, 1].map((w) => {
            const h = BH * grow(i, w as 0 | 1);
            return <rect key={w} x={gx(i) + w * 100} y={BASE - h} width={90} height={h} rx={8} fill={w ? "#C98A2E" : C.tealDeep} />;
          })}
          <Label x={gx(i) + 95} y={BASE + 42} text={g.name} size={24} color={INK} align="middle" />
          <g opacity={ez(similar(i), 0, 1)} transform={`translate(0 ${(1 - ez(similar(i), 0, 1)) * 14})`}>
            <rect x={gx(i) + 5} y={BASE - BH - 74} width={180} height={50} rx={25} fill={C.seen} />
            <Label x={gx(i) + 95} y={BASE - BH - 40} text="SIMILAR" size={24} color="#FFFFFF" align="middle" />
          </g>
        </g>
      ))}
      {/* wolves, on their own scale beyond the divider */}
      <line x1={1340} x2={1340} y1={300} y2={BASE + 40} stroke={INK} strokeWidth={3} strokeDasharray="10 10" opacity={0.5} />
      <line x1={1380} x2={1700} y1={BASE} y2={BASE} stroke={INK} strokeWidth={4} />
      <rect x={WX + 100} y={BASE - WR} width={90} height={WR} rx={8} fill="#C98A2E" opacity={wolf > 0 || wolfOnly ? 1 : 0.35} />
      <rect x={WX} y={BASE - WR * 7.3 * wolf} width={90} height={WR * 7.3 * wolf} rx={8} fill={C.tealDeep} />
      <Label x={WX + 95} y={BASE + 42} text="WOLVES" size={24} color={INK} align="middle" />
      {/* animals trotting along the strip under the chart */}
      <clipPath id="l10strip">
        <rect x={180} y={770} width={1560} height={180} />
      </clipPath>
      <g clipPath="url(#l10strip)">
        {(wolfOnly ? (["wolf", "wolf"] as const) : (["elk", "roe", "red", "boar", "wolf"] as const)).map((k, i, arr) => {
          const span = 1900;
          const x = mod(i * (span / arr.length) + trot, span) + 40;
          return <Animal key={i} kind={k} x={x} y={920} size={k === "elk" ? 150 : 120} phase={trot / 70 + i * 0.3} />;
        })}
      </g>
    </g>
  </Board>
);
const ShotBars: ShotFC<C10> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 900, y: 560, zoom: 1.02 },
    { f: len, x: 1000, y: 540, zoom: 1.06 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={ST} cam={cam} vignette={0.1} grain={0.45}>
        <StudioCyc f={f} floor={1100} />
        <Layer depth={1}>
          <ChartBoard f={f} grow={(i, w) => lin(f, 8 + (i * 2 + w) * 10, 8 + (i * 2 + w) * 10 + 10)} similar={(i) => lin(f, 40 + i * 18, 52 + i * 18)} wolf={0} trot={f * 14} />
        </Layer>
      </Stage>
    </Pop>
  );
};
const ShotWolves: ShotFC<C10> = ({ f, len }) => {
  const k = lin(f, 10, 10 + (WR * 7.3) / 40);
  const cam = cameraAt(f, [
    { f: 0, x: 1150, y: 560, zoom: 1.08 },
    { f: len, x: 1260, y: 470, zoom: 1.22 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={ST} cam={cam} vignette={0.1} grain={0.45}>
        <StudioCyc f={f} floor={1100} />
        <Layer depth={1}>
          <ChartBoard f={f} grow={() => 1} similar={() => 1} wolf={k} trot={f * 16} />
        </Layer>
        <Layer depth={0}>
          <TextPlate x={70} y={80} w={860} h={150} color="#1E4A5C" opacity={0.88} />
          <Big x={110} y={185} text={READ.wolves.text /* #16 A */} size={88} />
          <ellipse cx={1720} cy={1026} rx={100} ry={14} fill="#000" opacity={0.2} />
          <Tick x={1720} y={1020} pxPerM={230} frame={f} facing={-1} pose="stand" expression={k > 0.5 ? "surprised" : "thinking"} look={0.2 + 0.7 * k} headTilt={-18 * k} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// 10-09 · the circle fills green and a SEEN stamp slams; deer, boar and wolves walk among the empty houses (an
// illustration, not a count: F10). #16 A.
const ShotNature: ShotFC<C10> = ({ f }) => {
  const fill = ez(f, 4, 30);
  const walkers: { k: "red" | "boar" | "wolf" | "roe" | "elk"; y: number; v: number }[] = [
    { k: "red", y: ZC.y - 120, v: 12 },
    { k: "boar", y: ZC.y + 10, v: 14 },
    { k: "wolf", y: ZC.y + 140, v: 16 },
    { k: "roe", y: ZC.y + 240, v: 13 },
  ];
  return (
    <ZoneShot f={f} seed={9}>
      <circle cx={ZC.x} cy={ZC.y} r={ZC.r * (0.2 + 0.8 * fill)} fill={C.seen} opacity={0.5} />
      <circle cx={ZC.x} cy={ZC.y} r={ZC.r} fill={C.seen} opacity={0.12} />
      <clipPath id="l10walk">
        <circle cx={ZC.x} cy={ZC.y} r={ZC.r - 6} />
      </clipPath>
      <g clipPath="url(#l10walk)">
        {HOUSES.map((h, i) => (
          <House key={i} x={h.x} y={h.y} size={46} lit={0} body="#BFAE88" />
        ))}
        {walkers.map((w, i) => {
          const span = 2 * ZC.r + 260;
          const x = ZC.x - ZC.r - 130 + mod(i * 170 + f * w.v, span);
          return <Animal key={i} kind={w.k} x={x} y={w.y} size={w.k === "boar" ? 100 : 110} phase={(f * w.v) / 70} />;
        })}
      </g>
      <circle cx={ZC.x} cy={ZC.y} r={ZC.r} fill="none" stroke={INK} strokeWidth={10} />
      <rect x={ZC.x - 330} y={ZC.y - ZC.r - 78} width={660} height={56} rx={28} fill={C.paper} />
      <Label x={ZC.x} y={ZC.y - ZC.r - 38} text="CHERNOBYL EXCLUSION ZONE" size={32} color={INK} align="middle" />
      <Notebook f={f} x={1360} y={420} speed={0.6} />
      <SeenStamp x={1360} y={780} age={f - 20} size={190} />
    </ZoneShot>
  );
};

// 10-10 · the circle shrinks to a dot against a long time ruler (zoom-out) as the ruler's ticks stream past (20 px/f).
const ShotDecades: ShotFC<C10> = ({ f, len }) => {
  const e = ez(f, 2, 50);
  const r = ZC.r * (1 - e) + 12 * e;
  const cx = ZC.x * (1 - e) + 260 * e;
  const cy = ZC.y * (1 - e) + 700 * e;
  const off = f * 20;
  return (
    <Pop f={f}>
      <Stage theme={ST} shotFrame={f} drift={{ zoom: 1.03, panX: 0, panY: 0, frames: 200, seed: 11 }} vignette={0.1} grain={0.45}>
        <StudioCyc f={f} floor={1100} />
        <Layer depth={1}>
          <Board x={80} y={60} w={1760} h={960} f={f}>
            <Sheet x={70} y={60} w={1620} h={850} f={f} title="ONE PLACE, A FEW DECADES" band="green" />
            <g transform="translate(-80 -60)">
              <line x1={220} x2={1760} y1={700} y2={700} stroke={INK} strokeWidth={6} opacity={e} />
              {Array.from({ length: 34 }, (_, i) => {
                const x = 240 + mod(i * 48 - off, 1520);
                return <line key={i} x1={x} x2={x} y1={700} y2={700 + (i % 5 ? 22 : 44)} stroke={INK} strokeWidth={i % 5 ? 3 : 5} opacity={e} />;
              })}
              <circle cx={cx} cy={cy} r={r} fill={C.seen} opacity={0.7} />
              <circle cx={cx} cy={cy} r={r} fill="none" stroke={INK} strokeWidth={Math.max(4, 10 * (1 - e))} />
              <Label x={260} y={790} text="A FEW DECADES" size={26} color={INK} align="start" opacity={ez(f, 40, 54)} />
              <path d="M1760 700 l-22 -12 l0 24 Z" fill={INK} opacity={e} />
              <Label x={1740} y={660} text="A MILLION YEARS" size={30} color={C.tealDeep} align="end" opacity={ez(f, 50, 64)} />
            </g>
          </Board>
        </Layer>
      </Stage>
    </Pop>
  );
};

// 10-11 · three chips slide in and are marked: ANIMALS (tick), CONCRETE (cross), A MILLION YEARS (cross); marks draw at
// 40 px/f; a deer keeps trotting across the ANIMALS chip.
const ShotChips: ShotFC<C10> = ({ f }) => {
  const chips = [
    { text: "ANIMALS", ok: true },
    { text: "CONCRETE", ok: false },
    { text: "A MILLION YEARS", ok: false },
  ];
  return (
    <Pop f={f}>
      <Stage theme={ST} shotFrame={f} drift={{ zoom: 1.04, panX: 0.01, panY: 0, frames: 200, seed: 13 }} vignette={0.1} grain={0.45}>
        <StudioCyc f={f} floor={1100} />
        <Layer depth={1}>
          <Board x={80} y={60} w={1760} h={960} f={f}>
            <g transform="translate(-80 -60)">
              {chips.map((ch, i) => {
                const s = 6 + i * 28;
                const dx = Math.max(0, 640 - (f - s) * 24 * 1.4);
                if (f < s) return null;
                const y = 230 + i * 250;
                const mk = lin(f, s + 22, s + 22 + 4);
                return (
                  <g key={i} transform={`translate(${dx} 0)`}>
                    <rect x={330} y={y - 80} width={1260} height={170} rx={85} fill="#04161C" opacity={0.2} transform="translate(8 12)" />
                    <rect x={330} y={y - 80} width={1260} height={170} rx={85} fill={C.paper} />
                    <rect x={330} y={y - 80} width={170} height={170} rx={85} fill={ch.ok ? C.seen : C.model} />
                    {ch.ok ? (
                      <path d={`M370 ${y + 4} l40 40 l70 -86`} fill="none" stroke="#FFFFFF" strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" {...drawn(mk)} />
                    ) : (
                      <g>
                        <path d={`M375 ${y - 40} l80 80`} fill="none" stroke="#FFFFFF" strokeWidth={18} strokeLinecap="round" {...drawn(lin(f, s + 22, s + 26))} />
                        <path d={`M455 ${y - 40} l-80 80`} fill="none" stroke="#FFFFFF" strokeWidth={18} strokeLinecap="round" {...drawn(lin(f, s + 26, s + 30))} />
                      </g>
                    )}
                    <Label x={560} y={y + 22} text={ch.text} size={58} color={INK} />
                    {i === 0 ? (
                      <g>
                        <clipPath id="l10chip0">
                          <rect x={1060} y={y - 78} width={500} height={166} rx={60} />
                        </clipPath>
                        <g clipPath="url(#l10chip0)">
                          <Animal kind="roe" x={1040 + mod(f * 12, 560)} y={y + 70} size={120} phase={f / 6} />
                        </g>
                      </g>
                    ) : null}
                  </g>
                );
              })}
            </g>
          </Board>
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 10-12 → 10-15 · the whole ladder page with ghost stamp outlines; the camera scrolls down it (about 17 px/f, the
// ladder streaming past), then slides rung to rung (20 px/f): TEN YEARS gets SEEN beside the tower (#5 A); A HUNDRED a
// faint SEEN outline for the mechanism and a MODEL stamp on the timing while the rust blot spreads (#6 A, #19); A
// THOUSAND gets SEEN beside the dome (#7 A) and Tick nods.
// ===============================================================================================================
const ShotLadder: ShotFC<C10> = ({ f, len, c }) => {
  const p13 = c.eiffel - c.ladder;
  const p14 = c.rust - c.ladder;
  const p15 = c.romeSeen - c.ladder;
  const cam = cameraAt(f, [
    { f: 0, x: 1150, y: ry(8) - 120, zoom: 0.82 },
    { f: p13, ...camOn("3") },
    { f: p14, ...camOn("3") },
    { f: p14 + 13, ...camOn("4"), x: 1260 },
    { f: p15, ...camOn("4"), x: 1260 },
    { f: p15 + 13, ...camOn("5") },
    { f: len, ...camOn("5", 1.04) },
  ]);
  const slams = { "3": p13 + 10, "4": p14 + 22, "5": p15 + 14 };
  return (
    <Pop f={f}>
      <Stage theme={ST} cam={cam} vignette={0.1} grain={0.45}>
        <StudioCyc f={f} floor={1300} />
        <Layer depth={1}>
          <LadderWorld
            f={f}
            ghosts
            slams={slams}
            rust={0.15 + 0.85 * lin(f, p14, p14 + 60)}
            tick={f > p15 - 10 ? { ...tickAt(5), pose: "stand", expression: f > p15 + 16 ? "happy" : "neutral", nod: lin(f, p15 + 18, p15 + 44), opacity: ez(f, p15 - 10, p15) } : undefined}
          />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 10-16 → 10-19 · up the top of the ladder: TEN THOUSAND gets ESTIMATE beside a short ruler sliding in (#8 A); A
// HUNDRED THOUSAND gets A PLAN beside a dashed tunnel drawing itself (#10 A); A MILLION gets BEST GUESS beside the print
// (#11 A), then the camera slides along the rung and SEEN slams beside the chipped stone (#12 A); Tick nods, pencil up.
// ===============================================================================================================
const ShotTop: ShotFC<C10> = ({ f, len, c }) => {
  const p17 = c.tunnel - c.mountain;
  const p18 = c.prints - c.mountain;
  const p19 = c.tools2 - c.mountain;
  const cam = cameraAt(f, [
    { f: 0, ...camOn("6"), y: ry(6) + 140 },
    { f: 12, ...camOn("6") },
    { f: p17, ...camOn("6") },
    { f: p17 + 13, ...camOn("7") },
    { f: p18, ...camOn("7") },
    { f: p18 + 13, ...camOn("8a") },
    { f: p19, ...camOn("8a") },
    { f: p19 + 22, ...camOn("8b") },
    { f: len, ...camOn("8b", 1.04) },
  ]);
  const slams = { "3": -400, "4": -400, "5": -400, "6": 16, "7": p17 + 14, "8a": p18 + 14, "8b": p19 + 24 };
  return (
    <Pop f={f}>
      <Stage theme={ST} cam={cam} vignette={0.1} grain={0.45}>
        <StudioCyc f={f} floor={1300} />
        <Layer depth={1}>
          <LadderWorld
            f={f}
            ghosts
            slams={slams}
            rust={1}
            ruler={ez(f, 0, 12)}
            dashes={lin(f, p17, p17 + 200 / 30)}
            tick={f > p19 + 6 ? { ...tickAt(8, 1880), pose: "hold", expression: "happy", nod: lin(f, p19 + 28, p19 + 54), opacity: ez(f, p19 + 6, p19 + 16), pencil: true } : undefined}
          />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 10-20 · the early rungs: three MODEL stamps slam on DAY, WEEK and YEAR in a stagger (10 f) (#19); the camera pushes.
// ===============================================================================================================
const ShotEarly: ShotFC<C10> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 1080, y: ry(1) + 30, zoom: 0.88 },
    { f: len, x: 1110, y: ry(1) + 10, zoom: 0.98 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={ST} cam={cam} vignette={0.1} grain={0.45}>
        <StudioCyc f={f} floor={1300} />
        <Layer depth={1}>
          <LadderWorld f={f} ghosts slams={{ "0": 10, "1": 20, "2": 30, "3": -400 }} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// studio-floor plates (10-21 .. 10-27): the board behind, Tick on the floor in front
// ---------------------------------------------------------------------------------------------------------------
const FloorSet: React.FC<{ f: number; children: React.ReactNode }> = ({ f, children }) => (
  <>
    <StudioCyc f={f} floor={930} />
    <Layer depth={0.7}>
      <Board x={140} y={90} w={1640} h={760} f={f} pins />
    </Layer>
    <Layer depth={1}>{children}</Layer>
  </>
);

// 10-21 · Tick holds up a clock whose hands spin free (12 deg/f), then shrugs; a wall tag NO CLOCK rusts (10 px/f). #19.
const ShotClock: ShotFC<C10> = ({ f, len }) => {
  const shrug = ez(f, len - 50, len - 34);
  const tx = 760;
  const ty = 960;
  const lift = f < len - 50 ? 1 : 1 - shrug * 0.5;
  return (
    <Pop f={f}>
      <Stage theme={ST} shotFrame={f} drift={{ zoom: 1.04, panX: 0.008, panY: 0, frames: 200, seed: 15 }} vignette={0.12} grain={0.45}>
        <FloorSet f={f}>
          <ellipse cx={tx} cy={ty + 6} rx={130} ry={16} fill="#000" opacity={0.2} />
          <Tick x={tx} y={ty} pxPerM={300} frame={f} pose="heave" poseTo="shrug" poseT={shrug} expression="worried" look={0.4} />
          <ClockFace x={tx + 110} y={ty - 560 * lift - 60 * (1 - lift)} r={100} hour={f * 12} minute={f * 30} />
          {/* the wall tag */}
          <g transform={`rotate(${Math.sin(f / 10) * 2} 1340 360)`}>
            <line x1={1340} y1={300} x2={1340} y2={360} stroke={INK} strokeWidth={3} />
            <rect x={1130} y={360} width={420} height={230} rx={22} fill={C.concrete} stroke={INK} strokeWidth={4} />
            <ellipse cx={1250} cy={500} rx={30 + 110 * lin(f, 6, 6 + 110 / 10)} ry={18 + 50 * lin(f, 6, 6 + 110 / 10)} fill={C.rust} opacity={0.85} />
            <ellipse cx={1240} cy={494} rx={14 + 60 * lin(f, 6, 6 + 110 / 10)} ry={8 + 24 * lin(f, 6, 6 + 110 / 10)} fill="#D86A2A" opacity={0.8} />
            <Label x={1340} y={440} text="NO CLOCK" size={48} color={INK} align="middle" />
          </g>
        </FloorSet>
      </Stage>
    </Pop>
  );
};

// 10-22 · two cards GRID and PUMPS, gears turning (10 deg/f); an eye crossed out (40 px/f). Pill 'FROM HOW THEY WORK'.
const ShotWork: ShotFC<C10> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.0 },
    { f: len, x: 990, y: 540, zoom: 1.08 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={ST} cam={cam} vignette={0.12} grain={0.45}>
        <StudioCyc f={f} floor={1100} />
        <Layer depth={1}>
          <Board x={80} y={60} w={1760} h={960} f={f}>
            <Sheet x={80} y={150} w={560} h={620} f={f} title="THE GRID" band="slate" appear={ez(f, 0, 10)}>
              <GearIcon x={190} y={210} size={210} f={f} speed={10} />
              <GearIcon x={370} y={370} size={150} f={f} speed={-14} fill={C.teal} teeth={8} />
            </Sheet>
            <Sheet x={700} y={150} w={560} h={620} f={f} title="THE PUMPS" band="slate" appear={ez(f, 6, 16)}>
              <GearIcon x={200} y={260} size={240} f={f} speed={-10} />
              <PumpIcon x={400} y={400} size={150} f={f} />
            </Sheet>
            <g transform="translate(-80 -60)">
              <rect x={1400} y={300} width={330} height={300} rx={24} fill={C.paper} />
              <Eye x={1565} y={450} size={200} slash={lin(f, 30, 30 + 300 / 40)} />
            </g>
          </Board>
        </Layer>
        <Layer depth={0}>
          <WordPill x={110} y={1000} text="FROM HOW THEY WORK" size={34} fill={alpha("#1E4A5C", 0.9)} dot={C.saffron} appear={ez(f, 40, 52)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// 10-23 · a speech balloon floats up and bobs (8 px/f) as HUNDREDS OF YEARS types on (40 px/f), the "?" in vermilion
// (a rumour you "may hear": no numeral, F3); Tick points at it, brow up. #17 A.
const ShotBalloon: ShotFC<C10> = ({ f }) => {
  const text = "HUNDREDS OF YEARS";
  const n = Math.max(0, Math.min(text.length, Math.floor((f - 14) * 1.1)));
  const by = Math.max(330, 900 - f * 22) + Math.sin(f / 7) * 28;
  const bx = 1110;
  return (
    <Pop f={f}>
      <Stage theme={ST} shotFrame={f} drift={{ zoom: 1.04, panX: -0.008, panY: 0, frames: 200, seed: 17 }} vignette={0.12} grain={0.45}>
        <FloorSet f={f}>
          <g>
            <path d={`M${bx - 470} ${by - 130} h940 a40 40 0 0 1 40 40 v180 a40 40 0 0 1 -40 40 h-700 l-90 80 l10 -80 h-150 a40 40 0 0 1 -40 -40 v-180 a40 40 0 0 1 40 -40 Z`} fill="#04161C" opacity={0.18} transform="translate(8 12)" />
            <path d={`M${bx - 470} ${by - 130} h940 a40 40 0 0 1 40 40 v180 a40 40 0 0 1 -40 40 h-700 l-90 80 l10 -80 h-150 a40 40 0 0 1 -40 -40 v-180 a40 40 0 0 1 40 -40 Z`} fill={C.paper} stroke={INK} strokeWidth={5} />
            <Label x={bx - 420} y={by + 24} text={text.slice(0, n)} size={62} color={INK} />
            {n >= text.length ? <text x={bx + 400} y={by + 34} style={{ fontFamily: "'Outfit','Inter',sans-serif", fontWeight: 800, fontSize: 110, fill: C.vermilion }}>?</text> : null}
          </g>
          <ellipse cx={400} cy={936} rx={120} ry={16} fill="#000" opacity={0.2} />
          <Tick x={400} y={930} pxPerM={300} frame={f} pose="point" expression="thinking" look={0.6} headTilt={-10} />
        </FloorSet>
      </Stage>
    </Pop>
  );
};

// 10-24 · two bottles: one crumbles to dots fast, the other stays whole; tags QUICKLY and NOT AT ALL slide in (24 px/f);
// source chip NOAA (#17 A).
const ShotBottles: ShotFC<C10> = ({ f }) => {
  const p = lin(f, 8, 60);
  const lx = 620;
  const rx = 1300;
  const by = 640;
  const H = 360;
  const cut = by - H / 2 + H * p;
  return (
    <Pop f={f}>
      <Stage theme={ST} shotFrame={f} drift={{ zoom: 1.04, panX: 0.008, panY: 0, frames: 200, seed: 19 }} vignette={0.12} grain={0.45}>
        <FloorSet f={f}>
          <rect x={300} y={830} width={1320} height={30} rx={10} fill={C.saffronDeep} />
          <rect x={300} y={830} width={1320} height={8} rx={4} fill={C.saffron} />
          <clipPath id="l10crumble">
            <rect x={lx - 200} y={cut} width={400} height={H + 40} />
          </clipPath>
          <g clipPath="url(#l10crumble)">
            <BottleIcon x={lx} y={by} size={H} />
          </g>
          {Array.from({ length: 60 }, (_, i) => {
            const u = (i + rnd(i * 3)) / 60;
            const birth = 8 + u * 52;
            const age = f - birth;
            if (age < 0) return null;
            const x0 = lx - 70 + rnd(i * 7) * 140;
            const y0 = by - H / 2 + H * u;
            const y = Math.min(826, y0 + age * 20 * 0.6 + age * age * 0.3);
            const x = x0 + (rnd(i * 11) - 0.5) * age * 4;
            return <circle key={i} cx={x} cy={y} r={5 + rnd(i * 5) * 5} fill="#7FC8D8" opacity={y >= 826 ? 0.7 : 0.95} />;
          })}
          <BottleIcon x={rx} y={by} size={H} />
          <g transform={`translate(${Math.max(0, 600 - (f - 30) * 24 * 1.4)} 0)`} opacity={f > 30 ? 1 : 0}>
            <WordPill x={lx} y={930} text="QUICKLY" size={34} align="middle" fill={alpha("#1E4A5C", 0.9)} />
          </g>
          <g transform={`translate(${Math.max(0, 600 - (f - 52) * 24 * 1.4)} 0)`} opacity={f > 52 ? 1 : 0}>
            <WordPill x={rx} y={930} text="NOT AT ALL" size={34} align="middle" fill={alpha("#1E4A5C", 0.9)} />
          </g>
          <SourceChip x={1580} y={180} name="NOAA" size={22} appear={ez(f, 10, 22)} />
        </FloorSet>
      </Stage>
    </Pop>
  );
};

// 10-25 · a layer-cake card: layers slide in (14 px/f, staggered) and a blank name tag swings from it (5 deg/f peak);
// Tick scratches his visor. #15 A.
const ShotName: ShotFC<C10> = ({ f }) => {
  const layers = ["#8F5A36", "#A8703E", "#6E4630", "#94603A", "#F2B544"];
  const sw = Math.sin(f / 7) * 18;
  return (
    <Pop f={f}>
      <Stage theme={ST} shotFrame={f} drift={{ zoom: 1.04, panX: 0.008, panY: 0, frames: 200, seed: 21 }} vignette={0.12} grain={0.45}>
        <FloorSet f={f}>
          <rect x={760} y={180} width={760} height={620} rx={20} fill="#04161C" opacity={0.2} transform="translate(8 12)" />
          <rect x={760} y={180} width={760} height={620} rx={20} fill={C.paper} />
          {layers.map((col, i) => {
            const h = i === 4 ? 40 : 100;
            const y = 740 - (i < 4 ? (i + 1) * 100 : 400 + 40);
            const s = 4 + i * 16;
            const dx = Math.max(0, 420 - (f - s) * 14 * 1.4);
            return f >= s ? <rect key={i} x={820 + dx} y={y} width={640} height={h} rx={10} fill={col} /> : null;
          })}
          {/* the blank tag swinging from the bright top layer */}
          <g transform={`rotate(${sw} 1440 300)`} opacity={ez(f, 70, 80)}>
            <line x1={1440} y1={300} x2={1440} y2={420} stroke={INK} strokeWidth={4} />
            <rect x={1360} y={420} width={160} height={110} rx={16} fill={C.paper} stroke={INK} strokeWidth={5} />
            <circle cx={1440} cy={440} r={8} fill={INK} />
            <line x1={1385} y1={490} x2={1495} y2={490} stroke={INK} strokeWidth={4} strokeDasharray="10 8" opacity={0.5} />
          </g>
          <ellipse cx={420} cy={936} rx={120} ry={16} fill="#000" opacity={0.2} />
          <Tick x={420} y={930} pxPerM={300} frame={f} pose="think" expression="thinking" look={0.5} headTilt={6} />
        </FloorSet>
      </Stage>
    </Pop>
  );
};

// 10-26 · a gavel-shaped icon strikes a pad marked ANTHROPOCENE twice (30 deg/f), rings spread; NOT YET slams; pill
// 2024 (#15 A).
const ShotVote: ShotFC<C10> = ({ f }) => {
  const strike = (t0: number) => {
    const u = f - t0;
    if (u < 0) return 0;
    if (u < 4) return (u / 4) * 70;
    if (u < 8) return 70 - ((u - 4) / 4) * 70;
    return 0;
  };
  const ang = -40 + Math.max(strike(12), strike(40));
  const px = 760;
  const py = 700;
  return (
    <Pop f={f}>
      <Stage theme={ST} shotFrame={f} drift={{ zoom: 1.04, panX: -0.008, panY: 0, frames: 200, seed: 23 }} vignette={0.12} grain={0.45}>
        <FloorSet f={f}>
          {/* the pad */}
          <rect x={px - 300} y={py} width={600} height={90} rx={14} fill={C.saffronDeep} />
          <rect x={px - 300} y={py} width={600} height={70} rx={14} fill={C.saffron} />
          <Label x={px} y={py + 48} text="ANTHROPOCENE" size={38} color={INK} align="middle" />
          {[16, 44].map((t0, i) => (f >= t0 ? <g key={i}>{f - t0 < 24 ? <ellipse cx={px} cy={py} rx={60 + (f - t0) * 14} ry={(60 + (f - t0) * 14) * 0.25} fill="none" stroke={C.saffronCore} strokeWidth={5} opacity={1 - (f - t0) / 24} /> : null}</g> : null))}
          {/* the gavel, pivoting at its handle end */}
          <g transform={`rotate(${ang} ${px + 420} ${py - 40})`}>
            <rect x={px + 40} y={py - 52} width={380} height={24} rx={12} fill="#7A4A2E" />
            <rect x={px - 60} y={py - 120} width={130} height={160} rx={22} fill="#8F4420" />
            <rect x={px - 60} y={py - 120} width={130} height={30} rx={12} fill={C.saffron} />
            <rect x={px - 60} y={py + 10} width={130} height={30} rx={12} fill={C.saffron} />
          </g>
          <TagStamp x={1380} y={420} word="NOT YET" age={f - 58} size={210} f={f} />
          <WordPill x={1220} y={640} text={READ.vote.text /* #15 A */} size={44} fill={alpha("#1E4A5C", 0.9)} appear={ez(f, 6, 16)} />
        </FloorSet>
      </Stage>
    </Pop>
  );
};

// 10-27 · an APPROVED mark lands (a check drawn at 40 px/f + the word slammed), then a strip WILL STAY IN USE slides in
// (24 px/f); Tick sets his pencil down and looks at the board (hold 1.5 s). The HUD ladder's rungs light in a sweep.
const ShotStay: ShotFC<C10> = ({ f, len }) => {
  const lit = mod(f / 7, 11);
  return (
    <Pop f={f}>
      <Stage theme={ST} shotFrame={f} drift={{ zoom: 1.05, panX: 0.008, panY: 0, frames: 240, seed: 25 }} vignette={0.12} grain={0.45}>
        <FloorSet f={f}>
          <rect x={400} y={210} width={1000} height={340} rx={22} fill={C.paper} />
          <rect x={400} y={210} width={1000} height={60} rx={22} fill={C.tealDeep} />
          <Label x={430} y={252} text="THE ANTHROPOCENE VOTE" size={26} color="#FFF8EC" />
          <path d="M470 420 l60 60 l120 -150" fill="none" stroke={C.seen} strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" {...drawn(lin(f, 8, 8 + 280 / 40))} />
          <Slam age={f - 16} x={1000} y={440} ring={C.seen} size={200}>
            <Big x={1000} y={470} text="APPROVED" size={110} color={C.seenDeep} align="middle" />
          </Slam>
          <g transform={`translate(${Math.max(0, 900 - (f - 50) * 24 * 1.6)} 0)`} opacity={f > 50 ? 1 : 0}>
            <WordPill x={440} y={640} text="WILL STAY IN USE" size={48} fill={alpha("#1E4A5C", 0.92)} dot={C.saffron} />
          </g>
          <ellipse cx={1500} cy={936} rx={120} ry={16} fill="#000" opacity={0.2} />
          <Tick x={1500} y={930} pxPerM={290} frame={f} facing={-1} pose={f < len - 70 ? "hold" : "stand"} expression={f < len - 70 ? "thinking" : "neutral"} look={0.3} />
          {f < len - 70 ? <rect x={1500 - 36 * 2.9 - 4} y={930 - 104 * 2.9 - 30} width={10} height={60} rx={4} fill={C.saffron} transform={`rotate(20 ${1500 - 36 * 2.9} ${930 - 104 * 2.9})`} /> : <rect x={1380} y={924} width={70} height={10} rx={4} fill={C.saffron} />}
        </FloorSet>
        <Layer depth={0}>
          <TimeLadder f={f} family={STUDIO} lit={lit > 9 ? 9 : lit} glow={Math.floor(lit) % 9} labels="none" x={1830} width={56} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================

export const SceneL10: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL10(t);
  const shots: ShotDef<C10>[] = [
    { from: 0, S: ShotHonest, id: "10-01" }, // + 10-02 (PUSH)
    { from: c.tools, S: ShotTools, id: "10-03" },
    { from: c.place, S: ShotPlace, id: "10-04" },
    { from: c.zone, S: ShotZone, id: "10-05" },
    { from: c.area, S: ShotArea, id: "10-06" },
    { from: c.bars, S: ShotBars, id: "10-07" },
    { from: c.wolves, S: ShotWolves, id: "10-08" },
    { from: c.nature, S: ShotNature, id: "10-09" },
    { from: c.decades, S: ShotDecades, id: "10-10" },
    { from: c.chips, S: ShotChips, id: "10-11" },
    { from: c.ladder, S: ShotLadder, id: "10-12" }, // + 10-13, 10-14, 10-15 (SLIDE)
    { from: c.mountain, S: ShotTop, id: "10-16" }, // + 10-17, 10-18, 10-19 (SLIDE)
    { from: c.early, S: ShotEarly, id: "10-20" },
    { from: c.clock, S: ShotClock, id: "10-21" },
    { from: c.work, S: ShotWork, id: "10-22" },
    { from: c.plastic, S: ShotBalloon, id: "10-23" },
    { from: c.bottles, S: ShotBottles, id: "10-24" },
    { from: c.name, S: ShotName, id: "10-25" },
    { from: c.vote, S: ShotVote, id: "10-26" },
    { from: c.stay, S: ShotStay, id: "10-27" },
  ];
  return playShots(f, shots, c, c.end);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). Stamps: click then boom at 0.3. */
export const soundL10 = (t: SceneTiming): Cue[] => {
  const c = cuesL10(t);
  const stamp = (at: number, vol = 0.3): Cue[] => [
    { at: at - 1, file: SFX.click, vol: 0.12, dur: 8 },
    { at, file: SFX.boom, vol: vol * 0.7, dur: 80, fadeOut: 30 },
  ];
  const run = (at: number, n: number, gap = 5, vol = 0.06): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 6 }));
  return [
    { at: 8, file: SFX.click, vol: 0.1, dur: 8 },
    { at: 20, file: SFX.click, vol: 0.1, dur: 8 },
    ...stamp(c.rome + 36),
    ...cutHit(c.tools),
    ...stamp(c.tools + 26),
    ...cutHit(c.place),
    { at: c.place + 30, file: SFX.pop, vol: 0.14, dur: 14 },
    ...cutHit(c.zone),
    ...run(c.zone + 8, 12, 5),
    ...cutHit(c.area),
    { at: c.area + 22, file: SFX.pop, vol: 0.16, dur: 14 },
    ...cutHit(c.bars),
    ...run(c.bars + 8, 4, 20, 0.08),
    ...cutHit(c.wolves),
    { at: c.wolves + 12, file: SFX.boom, vol: 0.2, dur: 90, fadeOut: 30 },
    ...cutHit(c.nature),
    ...stamp(c.nature + 20),
    ...cutHit(c.decades),
    ...cutHit(c.chips),
    ...[0, 1, 2].map((i) => ({ at: c.chips + 28 + i * 28, file: SFX.click, vol: 0.12, dur: 8 })),
    ...cutHit(c.ladder),
    { at: c.ladder + 2, file: SFX.swirl, vol: 0.16, dur: 60 },
    ...stamp(c.eiffel + 10),
    ...stamp(c.rust + 22),
    ...stamp(c.romeSeen + 14),
    ...cutHit(c.mountain),
    ...stamp(c.mountain + 16),
    ...stamp(c.tunnel + 14),
    ...stamp(c.prints + 14),
    ...stamp(c.tools2 + 24),
    ...cutHit(c.early),
    ...stamp(c.early + 10, 0.24),
    ...stamp(c.early + 20, 0.24),
    ...stamp(c.early + 30, 0.24),
    ...cutHit(c.clock),
    ...run(c.clock + 4, 10, 4, 0.05),
    ...cutHit(c.work),
    { at: c.work + 30, file: SFX.click, vol: 0.12, dur: 8 },
    ...cutHit(c.plastic),
    { at: c.plastic + 8, file: SFX.pop, vol: 0.14, dur: 14 },
    ...cutHit(c.bottles),
    { at: c.bottles + 10, file: SFX.debris, vol: 0.12, dur: 70, fadeOut: 20 },
    ...cutHit(c.name),
    ...cutHit(c.vote),
    { at: c.vote + 16, file: SFX.click, vol: 0.14, dur: 8 },
    { at: c.vote + 44, file: SFX.click, vol: 0.14, dur: 8 },
    ...stamp(c.vote + 58),
    ...cutHit(c.stay),
    { at: c.stay + 16, file: SFX.pop, vol: 0.16, dur: 14 },
    { at: c.stay + 50, file: SFX.popLong, vol: 0.14, dur: 30 },
  ];
};

