// L17 scene "l03" · One year: frost (storyboard §3 scene 3: 3-01…3-12, script lines 12-15; `frost` close-ups ↔ `studio`
// tank ↔ `night` wall and steel → `noon` tower). Shot components (hard cuts only; PUSH rows are phases of one component):
//   3-01           the crack half full of water; the thermometer drops; ice feathers across; Tick on the ICE lever
//   3-02           two boxes, same dots: water jostling, ice in a lattice, taller (ABOUT 9 % LESS DENSE)
//   3-03           ten blue cubes freeze in a tank; the lid lifts; Tick presses it down (ABOUT A TENTH MORE ROOM, OUR SUM)
//   3-04           the wall under a pale moon; clouds slide; frost fingers creep from the crack
//   3-05           KEY ART 2: the ice swells, two arrows pulse, the stone edges slide apart; Tick braced on the lever
//   3-06           the thaw: drips run, the old crack outline stays dashed in the wider gap; the sun arcs up
//   3-07           the season wheel; a tally stroke at every winter notch (class B: no numerals)
//   3-08           a branching crack network draws across the whole wall in steps (class B: no numerals)
//   3-09           a shoot pokes through the gap and unfurls two leaves
//   3-10 (+3-11, 3-12)  through the gap to the dark steel frame; a rust patch blooms, Tick scrapes; the lattice becomes
//                  the iron tower in noon light as the camera pulls back
// Numbers drawn (data17 READ): ABOUT 9 % LESS DENSE (iceDensity, row 4). ABOUT A TENTH MORE ROOM has no numeral (row 4, C).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Bloom, CycClouds, Cumulus, Form, Layer, Motes, Sky, Stage, Sway, Tick, alpha, mixHex, rnd, rrect, smoothPath, type Pt } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { READ } from "../data17";
import { CrackDraw, Flakes, StarsTint, crackDrawFor } from "../movers17";
import { RungBadge } from "../ladder";
import { OurSumPill, WordPill } from "../stamps17";
import { ShotDef, ShotFC, lineFrac, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { Arrow, C, ClipBox, ClipPath, FROST, Floor, Label, LatticePanel, LatticeTower, NIGHT, NOON, Phase, Pop, STUDIO, StoneWall, Thermo, Wheel, ez, lerp, lin, wrap } from "./a-parts";

export const cuesL03 = (t: SceneTiming) => {
  const { at } = cueKit(t);
  return {
    s01: 0,
    s02: lineFrac(t, 0, 0.4),
    s03: lineFrac(t, 0, 0.76),
    s04: at(1),
    s05: lineFrac(t, 1, 0.44),
    s06: at(2),
    s07: lineFrac(t, 2, 0.33),
    s08: lineFrac(t, 2, 0.65),
    s09: at(3),
    s10: lineFrac(t, 3, 0.26),
    s11: lineFrac(t, 3, 0.55), // phase
    s12: lineFrac(t, 3, 0.79), // phase (the morph)
    end: t.frames,
  };
};
export type CL03 = ReturnType<typeof cuesL03>;

// the cold stone of this scene (frost light: pale cyan-lit stone, deep-teal joints)
const STONE = { fill: "#A9C4C4", joint: "#1D4F60", lit: "#F4F8F0", shade: "#2F6F80" };
const NSTONE = { fill: "#3F6A70", joint: "#06151D", lit: "#9FC8C6", shade: "#0B2530" };

/** The crack in close-up: a jagged wedge between two stone faces, `gap` px wide at its mouth, centred on cx. */
const crackShape = (cx: number, top: number, bot: number, gap: number) => {
  const L: Pt[] = [];
  const R: Pt[] = [];
  for (let i = 0; i <= 10; i++) {
    const y = top + ((bot - top) * i) / 10;
    const w = gap * (1 - i / 12) + 6;
    const j = (rnd(i * 7 + 3) - 0.5) * 34;
    L.push([cx - w / 2 + j, y]);
    R.push([cx + w / 2 + j + (rnd(i * 5) - 0.5) * 14, y]);
  }
  return { L, R, d: "M" + [...L, ...R.reverse()].map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L") + " Z" };
};

/** The ICE lever Tick leans on: a post, a pivot and a warm orange handle (#FF9640, not vermilion: F9). */
const IceLever: React.FC<{ x: number; y: number; angle: number; s?: number }> = ({ x, y, angle, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Form d={rrect(-40, -180, 80, 180, 14)} fill="#2F6F80" light={225} shadow="#12323C" shadowOpacity={0.5} inset={10} rim="#D5F0F2" hard />
    <rect x={-30} y={-130} width={60} height={34} rx={8} fill="#F4F8F0" />
    <text x={0} y={-104} textAnchor="middle" style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 26, fill: "#12323C" }}>
      ICE
    </text>
    <g transform={`rotate(${angle} 0 -170)`}>
      <rect x={-10} y={-380} width={20} height={212} rx={10} fill="#12323C" />
      <circle cx={0} cy={-392} r={32} fill={C.lever} />
      <circle cx={-8} cy={-400} r={10} fill="#FFE0C0" />
    </g>
    <circle cx={0} cy={-170} r={16} fill="#12323C" />
  </g>
);

const FrostField: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <Sky family={FROST} />
    <Layer depth={0.2}>
      <Bloom x={1600} y={160} r={520} color="#FFF8E8" core={44} coreColor="#FFFFFF" strength={0.75} />
    </Layer>
    <Layer depth={0.9}>
      <Motes frame={f} n={30} w={1920} h={1080} color={alpha("#FFFFFF", 0.9)} seed={5} size={3} />
    </Layer>
  </g>
);

// ice feathers: dendrite strokes growing across a water surface from x0 to x1 at `speed` px/f
const IceFeathers: React.FC<{ x0: number; x1: number; y: number; head: number; color?: string }> = ({ x0, x1, y, head, color = "#FFFFFF" }) => {
  const hx = Math.min(x1, x0 + head);
  const n = Math.floor((hx - x0) / 26);
  return (
    <g stroke={color} strokeLinecap="round" fill="none">
      <line x1={x0} y1={y} x2={hx} y2={y} strokeWidth={6} />
      {Array.from({ length: n }, (_, i) => {
        const x = x0 + 20 + i * 26;
        const L = 16 + rnd(i * 3) * 22;
        return (
          <g key={i} strokeWidth={3.5}>
            <line x1={x} y1={y} x2={x + L * 0.6} y2={y - L} />
            <line x1={x} y1={y} x2={x + L * 0.6} y2={y + L * 0.7} />
          </g>
        );
      })}
      {hx < x1 ? <circle cx={hx} cy={y} r={9} fill="#FFFFFF" stroke="none" /> : null}
    </g>
  );
};

// ================================================================================================================
// 3-01 · the crack half full of blue water; the thermometer drops through FREEZING (14 px/f); ice feathers across (12 px/f);
// Tick leans on the ICE lever
// ================================================================================================================
const ShotFreeze: ShotFC<CL03> = ({ f }) => {
  const cr = crackShape(1040, 120, 1020, 280);
  return (
    <Stage theme={FROST.theme} cam={{ x: 960 + f * 0.6, y: 540, zoom: 1.02 + f * 0.0009 }} vignette={0.12} grain={0.5}>
      <FrostField f={f} />
      <Layer depth={1}>
        <StoneWall x={620} y={60} w={1400} h={1020} rows={5} seed={3} {...STONE} />
        <path d={cr.d} fill="#12323C" />
        <ClipPath d={cr.d}>
          <rect x={700} y={560} width={700} height={520} fill="#3FA9C8" />
          <rect x={700} y={556} width={700} height={8} fill="#BFF0F2" />
          <IceFeathers x0={760} x1={1320} y={560} head={Math.max(0, f - 20) * 12} />
        </ClipPath>
        <Thermo x={1560} y={900} h={520} level={0.8 - 0.55 * lin(f, 10, 50) - 0.15 * lin(f, 50, 130)} ink="#12323C" />
        <IceLever x={430} y={980} angle={-18 + 6 * Math.sin(f / 18)} />
        <Tick x={300} y={980} pxPerM={200} frame={f} facing={1} pose="lean" expression="thinking" look={0.5} />
        <Floor y={980} color="#7FBFD0" foot="#2F6F80" lip="#FFFFFF" x={-600} w={1280} />
      </Layer>
      <Layer depth={0}>
        <RungBadge f={f} rung={2} family={FROST} />
      </Layer>
    </Stage>
  );
};

// ================================================================================================================
// 3-02 · two boxes with the same dots: water (packed, jostling 10 px/f) and ice (a lattice, the box rising 14 px/f)
// ================================================================================================================
const ShotBoxes: ShotFC<CL03> = ({ f }) => {
  const grow = ez(f, 18, 26);
  const boxH = 420;
  const iceH = boxH * (1 + 0.09 * grow) + 6 * Math.sin(f / 5) * grow;
  const dots = (x: number, y: number, w: number, h: number, ice: boolean) =>
    Array.from({ length: 30 }, (_, i) => {
      const col = i % 5;
      const row = Math.floor(i / 5);
      const lx = x + 40 + (col + 0.5) * ((w - 80) / 5);
      const ly = y + h - 36 - row * ((h - 72) / 6);
      const jx = ice ? Math.sin(f / 6 + i) * 2 : Math.sin(f * 0.9 + i * 2.1) * 12;
      const jy = ice ? Math.cos(f / 6 + i) * 2 : Math.cos(f * 0.8 + i * 1.7) * 10;
      const px = ice ? lx : x + 40 + rnd(i * 7) * (w - 80);
      const py = ice ? ly : y + h * 0.18 + rnd(i * 11) * (h * 0.76);
      return { x: px + jx, y: py + jy };
    });
  const W = { x: 380, y: 980 - boxH, w: 480, h: boxH };
  const I = { x: 1060, y: 980 - iceH, w: 480, h: iceH };
  const wd = dots(W.x, W.y, W.w, W.h, false);
  const id = dots(I.x, I.y, I.w, I.h, true);
  return (
    <Pop f={f}>
      <Stage theme={FROST.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.015, panY: 0, frames: 150, seed: 2 }} vignette={0.12} grain={0.5}>
        <FrostField f={f} />
        <Layer depth={1}>
          <Floor y={980} color="#7FBFD0" foot="#2F6F80" lip="#FFFFFF" />
          {[W, I].map((b, k) => (
            <g key={k}>
              <rect x={b.x + 10} y={b.y + 14} width={b.w} height={b.h} rx={20} fill="#12323C" opacity={0.2} />
              <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={20} fill={k ? "#E8F8F8" : "#9FD8E6"} stroke="#12323C" strokeWidth={6} />
            </g>
          ))}
          {id.map((p, i) =>
            i % 5 < 4 ? <line key={"h" + i} x1={p.x} y1={p.y} x2={id[i + 1].x} y2={id[i + 1].y} stroke="#7FBFD0" strokeWidth={4} /> : null,
          )}
          {id.map((p, i) => (i + 5 < id.length ? <line key={"v" + i} x1={p.x} y1={p.y} x2={id[i + 5].x} y2={id[i + 5].y} stroke="#7FBFD0" strokeWidth={4} /> : null))}
          {wd.map((p, i) => (
            <circle key={"w" + i} cx={p.x} cy={p.y} r={17} fill={C.waterDeep} />
          ))}
          {id.map((p, i) => (
            <circle key={"i" + i} cx={p.x} cy={p.y} r={17} fill={C.waterDeep} />
          ))}
          <Label x={W.x + W.w / 2} y={1040} text="water" size={30} color="#12323C" />
          <Label x={I.x + I.w / 2} y={1040} text="ice" size={30} color="#12323C" />
        </Layer>
        <Layer depth={0}>
          <WordPill x={120} y={110} text={READ.iceDensity.text} size={28} appear={ez(f, 12, 24)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 3-03 · ten blue cubes in a clear tank; they lock into a lattice (stagger 4 f) and the lid lifts (20 px/f) on a bulge;
// Tick presses the lid down and it pops up (surprised)
// ================================================================================================================
const ShotTank: ShotFC<CL03> = ({ f }) => {
  const T = { x: 620, y: 520, w: 640, h: 380 };
  const freeze = (i: number) => ez(f, 14 + i * 4, 22 + i * 4);
  const lift = Math.min(70, Math.max(0, f - 52) * 20) + (f > 70 ? Math.sin((f - 70) / 3) * 6 * Math.exp(-(f - 70) / 20) : 0);
  const lidY = T.y - lift;
  return (
    <Pop f={f}>
      <Stage theme={STUDIO.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.02, panY: 0, frames: 120, seed: 3 }} vignette={0.12} grain={0.5}>
        <Sky family={STUDIO} />
        <Layer depth={0.2}>
          <CycClouds f={f} y={110} n={4} seed={6} />
        </Layer>
        <Layer depth={1}>
          <Floor y={900} color={STUDIO.mid} lip="#FFE6A8" foot={STUDIO.near} />
          <ellipse cx={T.x + T.w / 2} cy={905} rx={380} ry={24} fill={STUDIO.shadow} opacity={0.3} />
          <rect x={T.x} y={T.y} width={T.w} height={T.h} rx={14} fill="#DFF6F6" opacity={0.35} stroke="#1E4A5C" strokeWidth={6} />
          {Array.from({ length: 10 }, (_, i) => {
            const col = i % 5;
            const row = Math.floor(i / 5);
            const fr = freeze(i);
            const cx = T.x + 30 + col * 118;
            const cy = T.y + T.h - 30 - (row + 1) * 112 - fr * 12 * row;
            return <Form key={i} d={rrect(cx, cy, 104, 104, 12)} fill={mixHex("#2F8FC0", "#E8F8F8", fr)} light={225} shadow="#1E4A5C" shadowOpacity={0.4} inset={10} rim="#FFFFFF" hard />;
          })}
          {/* the bulge: one more cube's worth of ice rising under the lid */}
          <path d={`M${T.x + 20} ${T.y + 40} Q${T.x + T.w / 2} ${lidY - 40 + 40} ${T.x + T.w - 20} ${T.y + 40} Z`} fill="#E8F8F8" opacity={ez(f, 40, 56)} />
          <g transform={`rotate(${lift > 0 ? -4 : 0} ${T.x} ${lidY})`}>
            <Form d={rrect(T.x - 20, lidY - 30, T.w + 40, 34, 10)} fill="#2F7F6E" light={225} shadow="#0F3540" shadowOpacity={0.5} inset={8} rim="#BFF5EA" hard />
          </g>
          <Tick x={1440} y={960} pxPerM={270} frame={f} facing={-1} pose={f < 52 ? "press" : "shrug"} expression={f < 52 ? "determined" : "surprised"} look={-0.2} />
        </Layer>
        <Layer depth={0}>
          <WordPill x={120} y={110} text={READ.tenthRoom.text} size={26} appear={ez(f, 20, 32)} />
          <OurSumPill x={120} y={176} size={26} appear={ez(f, 28, 40)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// frost fingers: white branching strokes creeping out from the crack edges (`head` px)
const FrostFingers: React.FC<{ cx: number; y0: number; y1: number; head: number; color?: string }> = ({ cx, y0, y1, head, color = "#E8F8F8" }) => (
  <g stroke={color} strokeLinecap="round" fill="none" opacity={0.9}>
    {Array.from({ length: 10 }, (_, i) => {
      const side = i % 2 ? 1 : -1;
      const y = y0 + ((y1 - y0) * (i + 0.5)) / 10;
      const L = Math.min(head * (0.7 + rnd(i) * 0.6), 260);
      const pts: Pt[] = [];
      for (let k = 0; k <= 5; k++) pts.push([cx + side * (40 + (L * k) / 5), y + Math.sin(k * 1.3 + i) * 14]);
      return (
        <g key={i}>
          <path d={smoothPath(pts)} strokeWidth={5} />
          {pts.slice(1).map((p, k) => (
            <line key={k} x1={p[0]} y1={p[1]} x2={p[0] + side * 14} y2={p[1] - 18} strokeWidth={3} />
          ))}
        </g>
      );
    })}
  </g>
);

// ================================================================================================================
// 3-04 · the wall under a pale moon at night: clouds slide across the moon (10 px/f); frost fingers creep (12 px/f)
// ================================================================================================================
const ShotNightWall: ShotFC<CL03> = ({ f }) => {
  const cr = crackShape(980, 380, 1060, 120);
  return (
    <Pop f={f}>
      <Stage theme={NIGHT.theme} cam={{ x: 960 + f * 0.5, y: 540, zoom: 1.02 + f * 0.0008 }} vignette={0.36} grain={0.5}>
        <Sky family={NIGHT} />
        <Layer depth={0.1}>
          <StarsTint f={f} n={90} speed={1} h={420} seed={7} />
          <Bloom x={1460} y={200} r={300} color="#D5F0F2" strength={0.5} />
          <circle cx={1460} cy={200} r={70} fill="#E8F4EE" />
          <circle cx={1440} cy={186} r={14} fill="#BFD8D4" />
        </Layer>
        <Layer depth={0.3}>
          {[0, 1, 2].map((i) => (
            <Cumulus key={i} x={-600 + wrap(f * 10 + i * 900, 2900)} y={250 + i * 30} w={520} h={130} fill="#14414F" shade="#0D2B38" lit="#6F9FA6" seed={i + 2} frame={f} />
          ))}
        </Layer>
        <Layer depth={1}>
          <StoneWall x={-200} y={380} w={2400} h={700} rows={4} seed={5} {...NSTONE} />
          <path d={cr.d} fill="#020B10" />
          <ClipPath d={cr.d}>
            <rect x={800} y={720} width={400} height={400} fill="#1D5F7A" />
            <rect x={800} y={716} width={400} height={6} fill="#7FD0E8" />
          </ClipPath>
          <FrostFingers cx={985} y0={420} y1={1020} head={Math.max(0, f - 10) * 12} />
          <Motes frame={f} n={20} w={1920} h={1080} color={alpha("#D5F0F2", 0.6)} seed={9} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 3-05 · KEY ART 2: the ice block swells in the crack; two big arrows from the ice to the wall pulse (18 px/f); the stone
// edges slide apart (2 px/f); Tick braced on the ICE lever (the one warm accent on cold teal)
// ================================================================================================================
const ShotPush: ShotFC<CL03> = ({ f }) => {
  const spread = Math.min(140, f * 2);
  const cx = 1120;
  const cr = crackShape(cx, 120, 1060, 180 + spread);
  const pulse = 0.62 + 0.38 * Math.abs(Math.sin(f / 9));
  const bulge = 40 + spread * 0.4 + 10 * Math.sin(f / 9);
  const leftShift = -spread / 2;
  const rightShift = spread / 2;
  const iceTop = 430 - bulge;
  return (
    <Pop f={f}>
      <Stage theme={FROST.theme} cam={{ x: 980 + f * 0.5, y: 540, zoom: 1.03 + f * 0.0008 }} vignette={0.14} grain={0.5}>
        <FrostField f={f} />
        <Layer depth={0.35} haze={{ color: FROST.haze, amount: 0.5 }}>
          <rect x={-400} y={760} width={2720} height={400} fill="#7FBFD0" />
          {Array.from({ length: 8 }, (_, i) => (
            <path key={i} d={`M${-300 + i * 320} 780 l120 -180 l120 180 Z`} fill="#5FA0B4" />
          ))}
        </Layer>
        <Layer depth={1}>
          <g transform={`translate(${leftShift} 0)`}>
            <ClipBox x={-400} y={0} w={cx + 400 - 4} h={1200}>
              <StoneWall x={560} y={60} w={1600} h={1060} rows={5} seed={8} {...STONE} />
            </ClipBox>
          </g>
          <g transform={`translate(${rightShift} 0)`}>
            <ClipBox x={cx + 4} y={0} w={1200} h={1200}>
              <StoneWall x={560} y={60} w={1600} h={1060} rows={5} seed={8} {...STONE} />
            </ClipBox>
          </g>
          <path d={cr.d} fill="#12323C" />
          <ClipPath d={cr.d}>
            <rect x={cx - 400} y={iceTop} width={800} height={800} fill="#D5F0F2" />
            {Array.from({ length: 9 }, (_, i) => (
              <line key={i} x1={cx - 200 + i * 50} y1={iceTop} x2={cx - 260 + i * 50} y2={1060} stroke="#9FD8E6" strokeWidth={6} />
            ))}
          </ClipPath>
          {/* the ice dome bulging out of the crack mouth */}
          <path d={`M${cx - 110 - spread / 2} 440 Q${cx} ${iceTop - 40} ${cx + 110 + spread / 2} 440 Z`} fill="#E8F8F8" stroke="#7FBFD0" strokeWidth={5} />
          <ellipse cx={cx - 30} cy={iceTop + 10} rx={40} ry={10} fill="#FFFFFF" opacity={0.9} />
          <Arrow x1={cx - 60} y1={640} x2={cx - 520} y2={640} width={46} color="#FFFFFF" outline="#12323C" grow={pulse} />
          <Arrow x1={cx + 60} y1={640} x2={cx + 520} y2={640} width={46} color="#FFFFFF" outline="#12323C" grow={pulse} />
          <IceLever x={470} y={1000} angle={-34 + 3 * Math.sin(f / 7)} s={1.05} />
          <Tick x={300} y={1000} pxPerM={230} frame={f} facing={1} pose="heave" expression="determined" look={0.4} />
          <Floor y={1000} color="#7FBFD0" foot="#2F6F80" lip="#FFFFFF" x={-600} w={1200} />
          {/* foreground icicles along the top edge */}
          {Array.from({ length: 14 }, (_, i) => (
            <path key={i} d={`M${-40 + i * 150} -10 l26 0 l-13 ${70 + rnd(i * 3) * 90} Z`} fill="#E8F8F8" stroke="#7FBFD0" strokeWidth={3} />
          ))}
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 3-06 · the thaw: the ice melts and drips run (14 px/f); the old crack outline stays dashed inside the wider gap; a sun
// disc arcs up (10 px/f)
// ================================================================================================================
const ShotThaw: ShotFC<CL03> = ({ f }) => {
  const old = crackShape(1040, 160, 1040, 160);
  const wide = crackShape(1040, 160, 1040, 280);
  const sunX = 300 + f * 8;
  const sunY = 520 - Math.sin(Math.min(1, f / 160) * Math.PI * 0.6) * 380;
  const melt = ez(f, 0, 90);
  return (
    <Pop f={f}>
      <Stage theme={FROST.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.015, panY: 0, frames: 150, seed: 4 }} vignette={0.12} grain={0.5}>
        <Sky family={FROST} />
        <Layer depth={0.2}>
          <Bloom x={sunX} y={sunY} r={360} color="#FFF3C8" core={70} coreColor="#FFFBEA" strength={0.9} />
        </Layer>
        <Layer depth={1}>
          <StoneWall x={560} y={100} w={1500} h={980} rows={5} seed={3} {...STONE} />
          <path d={wide.d} fill="#12323C" />
          <ClipPath d={wide.d}>
            <rect x={700} y={420 + melt * 300} width={700} height={800} fill="#D5F0F2" opacity={1 - melt * 0.6} />
            <rect x={700} y={760} width={700} height={400} fill="#3FA9C8" opacity={melt} />
          </ClipPath>
          <path d={old.d} fill="none" stroke="#FFF8E8" strokeWidth={5} strokeDasharray="16 12" />
          {Array.from({ length: 5 }, (_, i) => {
            const y = 300 + wrap(f * 14 + i * 140, 700);
            return <ellipse key={i} cx={1000 + (i - 2) * 22} cy={y} rx={12} ry={20} fill="#BFF0F2" />;
          })}
          <Motes frame={f} n={24} w={1920} h={1080} color={alpha("#FFFFFF", 0.9)} seed={6} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 3-07 · the season wheel turns (8 deg/f); at every winter notch a tally stroke draws on the wall (40 px/f)
// ================================================================================================================
const ShotSeasons: ShotFC<CL03> = ({ f }) => {
  const ang = f * 8;
  return (
    <Pop f={f}>
      <Stage theme={FROST.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.02, panY: 0, frames: 140, seed: 5 }} vignette={0.12} grain={0.5}>
        <FrostField f={f} />
        <Layer depth={1}>
          <StoneWall x={860} y={140} w={1300} h={940} rows={5} seed={11} {...STONE} />
          {Array.from({ length: 4 }, (_, i) => {
            const k = Math.min(1, Math.max(0, (f - 4 - i * 45) / 5));
            return k > 0 ? <line key={i} x1={1180 + i * 90} y1={380} x2={1180 + i * 90 + 20 * k} y2={380 + 220 * k} stroke="#12323C" strokeWidth={22} strokeLinecap="round" /> : null;
          })}
          <g>
            <circle cx={480} cy={560} r={300} fill="#12323C" opacity={0.2} />
            {(["#D5F0F2", "#8FC26A", "#F2B544", C.rust] as const).map((col, q) => (
              <path
                key={q}
                d={`M480 560 L${480 + Math.cos(((q * 90 - 135 + ang) * Math.PI) / 180) * 280} ${560 + Math.sin(((q * 90 - 135 + ang) * Math.PI) / 180) * 280} A280 280 0 0 1 ${480 + Math.cos(((q * 90 - 45 + ang) * Math.PI) / 180) * 280} ${560 + Math.sin(((q * 90 - 45 + ang) * Math.PI) / 180) * 280} Z`}
                fill={col}
                stroke="#12323C"
                strokeWidth={5}
              />
            ))}
            <Wheel x={480} y={560} r={120} angle={ang} notches={4} hot={[0]} fill="#F4F8F0" />
            <Label x={480} y={250} text="winter" size={30} color="#12323C" />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 3-08 · a branching crack network draws itself across the whole wall in steps (50 px/f); the edges step apart; pull back
// ================================================================================================================
const ShotNetwork: ShotFC<CL03> = ({ f }) => {
  const cracks = [
    { x: 160, y: 300, r: 12, s: 3, L: 900, st: 0 },
    { x: 1700, y: 220, r: 160, s: 5, L: 800, st: 20 },
    { x: 600, y: 900, r: -24, s: 7, L: 1000, st: 40 },
    { x: 1200, y: 980, r: -70, s: 9, L: 700, st: 60 },
    { x: 980, y: 120, r: 96, s: 11, L: 760, st: 80 },
    { x: 260, y: 640, r: -8, s: 13, L: 900, st: 100 },
  ];
  return (
    <Pop f={f}>
      <Stage theme={FROST.theme} cam={{ x: 960, y: 540, zoom: 1.3 - 0.28 * ez(f, 0, 160) }} vignette={0.12} grain={0.5}>
        <FrostField f={f} />
        <Layer depth={1}>
          <StoneWall x={-300} y={-200} w={2520} h={1480} rows={7} seed={21} {...STONE} />
          {cracks.map((k, i) => (
            <CrackDraw
              key={i}
              x={k.x}
              y={k.y}
              rotate={k.r}
              seed={k.s}
              length={k.L}
              draw={crackDrawFor(f, k.st, k.L, 50)}
              widen={Math.floor(Math.max(0, f - k.st) / 30) * 0.25}
              color="#12323C"
              width={8}
              branches={4}
            />
          ))}
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 3-09 · a gap in the wall's lower corner; a shoot pokes through (12 px/f) and unfurls two leaves (6 deg/f)
// ================================================================================================================
const ShotShoot: ShotFC<CL03> = ({ f }) => {
  const h = Math.min(420, Math.max(0, f - 6) * 12);
  const leaf = Math.min(60, Math.max(0, f - 40) * 6) / 60;
  const base = { x: 900, y: 1000 };
  const tipX = base.x + Math.sin(h / 120) * 40;
  const tipY = base.y - h;
  const sway = Math.sin(f / 16) * 4;
  return (
    <Pop f={f}>
      <Stage theme={FROST.theme} cam={{ x: 960 + f * 0.6, y: 560, zoom: 1.04 + f * 0.0009 }} vignette={0.14} grain={0.5}>
        <FrostField f={f} />
        <Layer depth={1}>
          <StoneWall x={-200} y={60} w={2400} h={1000} rows={5} seed={14} {...STONE} />
          <path d="M640 1060 L700 760 L860 700 L1080 740 L1180 900 L1240 1060 Z" fill="#12323C" />
          <path d="M700 1060 L740 800 L870 750 L1050 790 L1130 920 L1170 1060 Z" fill="#1D4F60" />
          <rect x={-200} y={1040} width={2400} height={60} fill="#5A4030" />
          <Sway frame={f} x={base.x} y={base.y} amp={3}>
            <path d={`M${base.x} ${base.y} Q${base.x - 20} ${base.y - h / 2} ${tipX} ${tipY}`} fill="none" stroke="#3F8E5E" strokeWidth={16} strokeLinecap="round" />
            {leaf > 0 ? (
              <g>
                <path d={`M${tipX} ${tipY} q${-90 * leaf} ${-30 * leaf} ${-150 * leaf} ${30 * leaf} q${70 * leaf} ${40 * leaf} ${150 * leaf} ${-30 * leaf}`} fill="#8FC26A" stroke="#3F8E5E" strokeWidth={4} transform={`rotate(${sway} ${tipX} ${tipY})`} />
                <path d={`M${tipX} ${tipY} q${90 * leaf} ${-30 * leaf} ${150 * leaf} ${30 * leaf} q${-70 * leaf} ${40 * leaf} ${-150 * leaf} ${-30 * leaf}`} fill="#5FB07A" stroke="#3F8E5E" strokeWidth={4} transform={`rotate(${-sway} ${tipX} ${tipY})`} />
              </g>
            ) : (
              <circle cx={tipX} cy={tipY} r={12} fill="#8FC26A" />
            )}
          </Sway>
        </Layer>
      </Stage>
    </Pop>
  );
};

// the dark steel frame behind the wall: I-beams with a light sweep running along them
const SteelFrame: React.FC<{ sweep: number; rust?: number; rustAt?: Pt }> = ({ sweep, rust = 0, rustAt }) => (
  <g>
    {[200, 560, 920].map((y, i) => (
      <g key={i}>
        <rect x={-400} y={y - 40} width={2720} height={80} fill="#26525F" />
        <rect x={-400} y={y - 40} width={2720} height={14} fill="#3F7F8E" />
        <rect x={-400} y={y + 26} width={2720} height={14} fill="#14414F" />
        <ellipse cx={wrap(sweep + i * 500, 2720) - 400} cy={y - 30} rx={220} ry={8} fill={C.amber} opacity={0.75} />
      </g>
    ))}
    {[180, 780, 1380].map((x, i) => (
      <g key={i}>
        <rect x={x - 40} y={-200} width={80} height={1500} fill="#1B414C" />
        <rect x={x - 40} y={-200} width={12} height={1500} fill="#3F7F8E" />
      </g>
    ))}
    {rust > 0 && rustAt ? (
      <g>
        <ellipse cx={rustAt[0]} cy={rustAt[1]} rx={rust * 1.3} ry={rust * 0.36} fill={C.rust} />
        <ellipse cx={rustAt[0]} cy={rustAt[1]} rx={rust * 0.8} ry={rust * 0.2} fill="#8F4420" />
        {Array.from({ length: 8 }, (_, i) => (
          <circle key={i} cx={rustAt[0] + (rnd(i * 3) - 0.5) * rust * 2} cy={rustAt[1] + (rnd(i * 5) - 0.5) * rust * 0.5} r={6 + rnd(i) * 8} fill={C.lever} opacity={0.7} />
        ))}
      </g>
    ) : null}
  </g>
);

// ================================================================================================================
// 3-10 + 3-11 + 3-12 · through the gap (26 px/f) into the dark steel frame, light sweeping the beams (24 px/f); a rust patch
// blooms (10 px/f), flakes fall (12 px/f), Tick scrapes; the beam's lattice wipes (30 px/f) into the tower in noon light
// and the camera pulls back to the whole tower
// ================================================================================================================
const ShotSteel: ShotFC<CL03> = ({ f, c }) => {
  const T11 = c.s11 - c.s10;
  const T12 = c.s12 - c.s10;
  const through = ez(f, 0, 50);
  const A = (
    <Stage theme={NIGHT.theme} cam={{ x: 960, y: 540, zoom: 1 + f * 0.002 }} vignette={0.4} grain={0.5}>
      <Sky family={NIGHT} />
      <Layer depth={1}>
        <SteelFrame sweep={f * 24} />
        <Bloom x={960} y={560} r={500} color={C.amber} strength={0.2} />
        <Motes frame={f} n={20} w={1920} h={1080} color={alpha(C.amber, 0.5)} seed={12} />
      </Layer>
      {through < 1 ? (
        <g transform={`translate(960 900) scale(${1 + through * 7}) translate(-960 -900)`} opacity={1 - ez(f, 36, 50)}>
          <path d="M-400 -400 L2320 -400 L2320 1480 L-400 1480 Z M720 1080 L760 780 L900 720 L1060 760 L1150 900 L1200 1080 Z" fill={NSTONE.fill} fillRule="evenodd" />
          <path d="M-400 760 L2320 760 M-400 500 L2320 500 M-400 240 L2320 240" stroke={NSTONE.joint} strokeWidth={14} />
        </g>
      ) : null}
    </Stage>
  );
  const g = Math.max(0, f - T11);
  const rust = Math.min(170, 20 + g * 10);
  const B = (
    <Stage theme={NIGHT.theme} shotFrame={g} drift={{ zoom: 1.04, panX: 0.012, panY: 0, frames: 140, seed: 7 }} vignette={0.4} grain={0.5}>
      <Sky family={NIGHT} />
      <Layer depth={1}>
        <g transform="translate(960 540) scale(1.6) translate(-960 -540)">
          <SteelFrame sweep={f * 24} rust={rust} rustAt={[1080, 560]} />
        </g>
        <Flakes f={g} x={1000} y={600} w={500} h={480} n={36} speed={12} color={C.rust} seed={4} />
        <Bloom x={1100} y={560} r={420} color={C.amber} strength={0.25} />
        <rect x={-200} y={950} width={2400} height={200} fill="#06151D" />
        <Tick x={760} y={960} pxPerM={250} frame={g} facing={1} pose="press" expression="worried" look={0.3} />
      </Layer>
    </Stage>
  );
  const h = Math.max(0, f - T12);
  const wipeX = Math.min(2100, -100 + h * 30);
  const pull = ez(h, 40, 125);
  const Cc = (
    <AbsoluteFill>
      <AbsoluteFill>{B}</AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `inset(0 ${Math.max(0, 1920 - wipeX)}px 0 0)` }}>
        <Stage theme={NOON.theme} cam={{ x: 960, y: lerp(260, 560, pull), zoom: Math.exp(Math.log(3.2) * (1 - pull)) }} vignette={0.1} grain={0.5}>
          <Sky family={NOON} />
          <Layer depth={0.3}>
            <Bloom x={1500} y={200} r={500} color="#FFF3C8" strength={0.7} />
            <Cumulus x={200 + h * 1.5} y={300} w={420} h={110} fill="#FFFFFF" shade="#CFEAE4" lit="#FFFFFF" seed={3} frame={h} />
          </Layer>
          <Layer depth={1}>
            <Floor y={1000} color={NOON.mid} foot={NOON.near} lip="#FFF3C8" />
            <LatticeTower x={960} base={1000} h={920} ink="#3A3020" fill="#C9A27A" />
          </Layer>
        </Stage>
      </AbsoluteFill>
      {wipeX > 0 && wipeX < 1920 ? (
        <AbsoluteFill>
          <svg width={1920} height={1080} style={{ position: "absolute" }}>
            <rect x={wipeX - 6} y={0} width={12} height={1080} fill="#FFF3C8" />
            <LatticePanel x={wipeX - 160} y={420} w={160} h={220} cells={1} ink="#3A3020" width={10} />
          </svg>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
  if (f >= T12) return Cc;
  return <Phase f={f} at={T11 - 6} dur={12} kind="push" a={A} b={B} />;
};

// ================================================================================================================

export const SceneL03: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL03(t);
  const shots: ShotDef<CL03>[] = [
    { from: 0, S: ShotFreeze, id: "3-01" },
    { from: c.s02, S: ShotBoxes, id: "3-02" },
    { from: c.s03, S: ShotTank, id: "3-03" },
    { from: c.s04, S: ShotNightWall, id: "3-04" },
    { from: c.s05, S: ShotPush, id: "3-05" },
    { from: c.s06, S: ShotThaw, id: "3-06" },
    { from: c.s07, S: ShotSeasons, id: "3-07" },
    { from: c.s08, S: ShotNetwork, id: "3-08" },
    { from: c.s09, S: ShotShoot, id: "3-09" },
    { from: c.s10, S: ShotSteel, id: "3-10" }, // + 3-11, 3-12
  ];
  return <AbsoluteFill>{playShots(f, shots, c, t.frames)}</AbsoluteFill>;
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL03 = (t: SceneTiming): Cue[] => {
  const c = cuesL03(t);
  const run = (at: number, n: number, gap: number, vol = 0.08): Cue[] => Array.from({ length: n }, (_, i) => ({ at: at + i * gap, file: SFX.click, vol, dur: 8 }));
  return [
    { at: 8, file: SFX.click, vol: 0.12, dur: 8 },
    { at: 20, file: SFX.swirl, vol: 0.12, dur: 60 },
    ...cutHit(c.s02),
    { at: c.s02 + 18, file: SFX.pop, vol: 0.14, dur: 16 },
    ...cutHit(c.s03),
    { at: c.s03 + 52, file: SFX.popLong, vol: 0.16, dur: 30 },
    ...cutHit(c.s04),
    { at: c.s04, file: SFX.wind, vol: 0.1, dur: c.s05 - c.s04, fadeIn: 20, fadeOut: 20 },
    ...cutHit(c.s05),
    { at: c.s05 + 4, file: SFX.rumble, vol: 0.24, dur: c.s06 - c.s05, fadeIn: 10, fadeOut: 30 },
    ...cutHit(c.s06),
    ...cutHit(c.s07),
    ...run(c.s07 + 4, 4, 45, 0.12),
    ...cutHit(c.s08),
    { at: c.s08 + 4, file: SFX.debris, vol: 0.16, dur: 120, fadeOut: 30 },
    ...cutHit(c.s09),
    { at: c.s09 + 40, file: SFX.pop, vol: 0.14, dur: 16 },
    ...cutHit(c.s10),
    { at: c.s10 + 2, file: SFX.deepWhoosh, vol: 0.22, dur: 70 },
    { at: c.s12, file: SFX.whoosh, vol: 0.18, dur: 50 },
  ];
};
