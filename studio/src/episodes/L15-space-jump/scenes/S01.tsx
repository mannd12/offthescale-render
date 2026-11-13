// L15 scene "l01" (storyboard §3 scene 1: 1-01…1-16, script lines 5-12; `void` ruler night ↔ `petrol` chart ↔ dusk).
// Shot components (hard cuts only; continuous rows are phases): 1-01 (three answers) · 1-02+1-03+1-04 (the FAI line, the
// 50-mile line, the conversion to 80.5 km) · 1-05 (not a wall) · 1-06+1-07+1-08 (rounded, the calculation chart,
// McDowell's 80) · 1-09+1-10+1-11 (the two record balloons, the bars against 100 and 80) · 1-12 (a nickname) ·
// 1-13+1-14+1-15+1-16 (stratosphere, mesosphere, thermosphere, keep the nickname for the title).
// Numbers drawn, each with its sources.md row: 100 km (#1) · 50 MILES (#1) · 80.5 km (#3) · 2018 · 80 KM (#2) ·
// 38.97 km, 2012 (#4) · 41.4 km, 2014 (#8) · 50 KM, 85 KM (#10). The "limit by calculation" chart has no numeral and no
// year (#2 class B, F4). The ruler shows no tick numbers (only sourced flags).
import React from "react";
import { useCurrentFrame } from "remotion";
import { Bloom, CloudRack, Headline, IF2, Kicker, Layer, Motes, Stage, Tick, UnknownTag, alpha, cameraAt, impact, mixHex } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { BOUNDARY, JUMPS, LAYERS } from "../jumpdata";
import { AltRuler, RulerFlag, altY } from "../sky";
import { Balloon, Bracket, Jumper, Stamp } from "../props";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { C, CREAM, DUSK, INK, Ledge, NightColumn, PETROL, PillA, Pop, Slab, Strike, VOID, WallIcon, cl01, ez, lerp, path1, rollText } from "./a-parts";

export const cuesL01 = (t: SceneTiming) => {
  const { at, p } = cueKit(t);
  return {
    ask: 0, // 1-01
    fai: at(1), // 1-02
    miles: p(1, "The United States"), // 1-03 (phase)
    conv: at(2), // 1-04 (phase)
    wall: at(3), // 1-05
    round: p(3, "The hundred was"), // 1-06
    calc: p(3, "Later calculations"), // 1-07 (phase)
    mcd: p(3, "In 2018"), // 1-08 (phase)
    rec: at(4), // 1-09
    eus: p(4, "Alan Eustace"), // 1-10 (phase)
    half: at(5), // 1-11 (phase)
    nick: at(6), // 1-12
    strato: p(6, "Those jumps started"), // 1-13
    meso: at(7), // 1-14 (phase)
    thermo: p(7, "and then the thermosphere"), // 1-15 (phase)
    title: p(7, "We'll keep the nickname"), // 1-16 (phase)
    end: t.frames,
  };
};
export type C01 = ReturnType<typeof cuesL01>;

const RX = 150; // ruler spine x
const FAI_FLAG: RulerFlag = { altKm: BOUNDARY.fai, label: "FAI line", value: `${BOUNDARY.fai} km`, color: C.saffron }; // #1

/** Our own wing glyph (1-03; no insignia, F2): two swept wings round a small disc. */
const Wings: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[1, -1].map((d) => (
      <g key={d} transform={`scale(${d} 1)`}>
        <path d="M14 -6 C 50 -26 100 -40 150 -30 C 120 -18 90 -6 60 4 C 90 2 110 4 128 10 C 90 20 50 18 14 10 Z" fill={C.limb} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        <path d="M30 -8 C 70 -24 104 -30 132 -28" stroke={CREAM} strokeWidth={3} fill="none" opacity={0.7} />
      </g>
    ))}
    <circle cx={0} cy={2} r={20} fill={C.saffron} stroke={INK} strokeWidth={4} />
  </g>
);

// ================================================================================================================
// 1-01 · "three answers": the camera climbs the night ruler from Tick at its foot; three "?" tags pop at the top.
// MOVER: the climb (ticks and stars ≈ 16 px/f) + the tags popping in (stagger 12 f).
// ================================================================================================================
const ShotAsk: ShotFC<C01> = ({ f, len }) => {
  const bottom = path1(f, [[0, -1.2], [26, -0.8], [len, 34]]);
  const top = bottom + 40;
  const gy = altY(0, top, bottom);
  return (
    <Stage theme={VOID.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.006, panY: 0, frames: 200, seed: 1 }} vignette={0.3} grain={0.5}>
      <Layer depth={1}>
        <NightColumn f={f} altTop={top} altBottom={bottom} seed={21} />
        <AltRuler f={f} altTop={top} altBottom={bottom} x={RX} step={5} numbers={false} flags={false} />
        {gy < 1300 ? (
          <g>
            <path d={`M${330} ${gy} q -10 -50 20 -60 q 30 10 22 60 Z`} fill={C.saffron} stroke={INK} strokeWidth={3} />
            <Tick x={420} y={gy} pxPerM={110} frame={f} facing={-1} pose="hold" poseTo="stand" poseT={ez(f, 4, 16)} expression="thinking" look={0.9} headTilt={-16} />
          </g>
        ) : null}
      </Layer>
      <Layer depth={0}>
        <Kicker x={240} y={130} text="THE EDGE THAT ISN'T THERE" color={CREAM} size={28} />
        {[0, 1, 2].map((i) => {
          const k = ez(f, 10 + i * 12, 20 + i * 12);
          const s = k * (1 + 0.25 * Math.sin(Math.min(1, (f - 20 - i * 12) / 10) * Math.PI) * (f > 20 + i * 12 ? 1 : 0));
          return k > 0 ? (
            <g key={i} transform={`translate(${720 + i * 260} ${300 + Math.sin(f / 9 + i) * 10}) scale(${s.toFixed(3)})`}>
              <Bloom x={0} y={0} r={110} color={C.vermilion} core={0} strength={0.45} />
              <UnknownTag x={0} y={0} size={56} />
            </g>
          ) : null;
        })}
      </Layer>
    </Stage>
  );
};

// ================================================================================================================
// 1-02 + 1-03 + 1-04 · the FAI line drawn at 100 km and pinned; the armed forces' 50-mile line drawn lower with our wing
// glyph; then it slides up to 80.5 km while the counter converts. MOVER: the lines' drawing heads (40 px/f) + the ruler
// scrolling (3-6 px/f) + the zoom out; then the cyan line sliding (12 px/f) + the counter + the push in.
// ================================================================================================================
const ShotLines: ShotFC<C01> = ({ f, len, c }) => {
  const P3 = c.miles - c.fai;
  const P4 = c.conv - c.fai;
  const mid = path1(f, [[0, 112], [P3, 96], [P3 + 90, 72], [P4, 70], [len, 74]]);
  const span = path1(f, [[0, 34], [P3, 34], [P3 + 40, 64], [len, 64]]);
  const top = mid + span / 2;
  const bottom = mid - span / 2;
  const d1 = ez(f, 6, 34);
  const d2 = ez(f, P3 + 30, P3 + 58);
  const slide = ez(f, P4 + 6, P4 + 50);
  const cyanAlt = lerp(LAYERS.stratoTop, BOUNDARY.usafKm, slide); // drawn at the "50" mark, then converted to 80.5 km (#3)
  const ly = altY(BOUNDARY.fai, top, bottom);
  const cy = altY(cyanAlt, top, bottom);
  const pinK = ez(f, 40, 56);
  const wing = ez(f, P3 + 50, P3 + 76);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: P4 + 50, x: 960, y: 540, zoom: 1.0 },
    { f: len + 10, x: 820, y: cy, zoom: 1.22 },
  ]);
  return (
    <Stage theme={VOID.theme} cam={cam} vignette={0.3} grain={0.5}>
      <Layer depth={1}>
        <NightColumn f={f} altTop={top} altBottom={bottom} seed={22} ground={false} drift={8} />
        <AltRuler
          f={f}
          altTop={top}
          altBottom={bottom}
          x={RX}
          step={10}
          numbers={false}
          flags={false}
          pins={[
            { altKm: BOUNDARY.fai, label: "", draw: d1, len: 1250 },
            { altKm: cyanAlt, label: "", draw: d2, len: 1250, color: C.limb },
          ]}
        />
        {/* Tick on a ledge just under the FAI line */}
        <Ledge x={RX + 10} y={ly + 150} w={190} />
        <Tick x={RX + 110} y={ly + 150} pxPerM={70} frame={f} facing={1} pose={f < 60 ? "point" : "hips"} expression={f < 60 ? "determined" : "proud"} look={0.5} squash={impact(f, 50, 0.1, 10)} />
        {f > P3 + 40 ? (
          <g transform={`translate(0 ${(-(1 - wing) * 140).toFixed(1)})`} opacity={wing}>
            <Wings x={760} y={cy - 54} s={0.8} />
          </g>
        ) : null}
        {slide > 0 && slide < 1 ? <Bloom x={900} y={cy} r={160} color={C.limb} core={0} strength={0.6} squash={0.35} /> : null}
      </Layer>
      <Layer depth={0}>
        <g transform={`translate(0 ${(ly - 60 - (1 - pinK) * 40).toFixed(1)})`}>
          <PillA x={480} y={0} text={`${BOUNDARY.fai} KM · THE FAI LINE` /* #1 */} F={VOID} dot={C.saffron} opacity={pinK * (1 - ez(f, P4, P4 + 12))} />
        </g>
        <PillA x={1000} y={cy - 60} text={`${BOUNDARY.usafMiles} MILES` /* #1 */} F={VOID} dot={C.limb} opacity={ez(f, P3 + 56, P3 + 70)} />
        {f > P4 ? (
          <Slab x={1080} y={cy + 140} value={(lerp(LAYERS.stratoTop, BOUNDARY.usafKm, slide)).toFixed(1) /* → 80.5 #3 */} unit="km" size={104} F={VOID} opacity={ez(f, P4, P4 + 10)} />
        ) : null}
      </Layer>
    </Stage>
  );
};

// ================================================================================================================
// 1-05 · "Neither one is a wall": the FAI line turns to dashed wobbling ink; a brick wall is drawn, then crossed out.
// MOVER: dashes marching (4 px/f) + wobble (6 px/f) + the wall building + the cross-out stroke (40 px/f).
// ================================================================================================================
const ShotWall: ShotFC<C01> = ({ f, len }) => {
  const top = 116 + f * 0.05;
  const bottom = top - 36;
  const ly = altY(BOUNDARY.fai, top, bottom);
  const wob = (i: number) =>
    Array.from({ length: 24 }, (_, k) => `${k ? "L" : "M"}${RX + k * 76} ${(ly + Math.sin(k * 0.8 + f / 4 + i * 2) * (8 + i * 6) * ez(f, 4, 20)).toFixed(1)}`).join(" ");
  const wall = { x: 760, y: ly - 230, w: 420, h: 230 };
  const x1 = ez(f, 40, 52);
  const x2 = ez(f, 52, 64);
  return (
    <Pop f={f}>
      <Stage theme={VOID.theme} shotFrame={f} drift={{ zoom: 1.08, panX: 0.012, panY: 0, frames: 160, seed: 2 }} vignette={0.3} grain={0.5}>
        <Layer depth={1}>
          <NightColumn f={f + 100} altTop={top} altBottom={bottom} seed={23} ground={false} drift={4} />
          {[0, 1].map((i) => (
            <path key={i} d={wob(i)} fill="none" stroke={C.saffron} strokeWidth={7 - i * 2} strokeDasharray="24 14" strokeDashoffset={-f * 4 - i * 11} strokeLinecap="round" opacity={1 - i * 0.35} />
          ))}
          <AltRuler f={f} altTop={top} altBottom={bottom} x={RX} step={10} numbers={false} flags={[FAI_FLAG]} />
          <WallIcon x={wall.x} y={wall.y} w={wall.w} h={wall.h} draw={ez(f, 4, 36)} />
          <Strike x1={wall.x - 40} y1={wall.y - 30} x2={wall.x + wall.w + 40} y2={wall.y + wall.h + 30} k={x1} w={22} />
          <Strike x1={wall.x + wall.w + 40} y1={wall.y - 30} x2={wall.x - 40} y2={wall.y + wall.h + 30} k={x2} w={22} />
          <Ledge x={RX + 10} y={ly + 220} w={190} />
          <Tick x={RX + 110} y={ly + 220} pxPerM={80} frame={f} facing={1} pose="shrug" expression="happy" look={Math.sin(f / 3) * 0.8 * ez(f, 20, 40)} headTilt={8} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 1-06 + 1-07 + 1-08 · Tick rings the 100 in chalk ("rounded"); a faded calculation chart slides in, its curve landing a
// dotted marker just under the line (no numeral, no year: #2 class B); then McDowell's pin lands on the 80 mark, a
// notebook page flips and the 80 line draws. MOVER: chalk head (30 px/f), chart slide (20 px/f) + curve head (16 px/f),
// pin drop (30 px/f) + page flip + the 80 line (40 px/f), over a ruler scrolling 2-5 px/f.
// ================================================================================================================
const ShotLimit: ShotFC<C01> = ({ f, len, c }) => {
  const P7 = c.calc - c.round;
  const P8 = c.mcd - c.round;
  const mid = path1(f, [[0, 101], [P7, 98], [P8, 90], [len, 87]]);
  const span = path1(f, [[0, 34], [P7, 34], [P8, 44], [len, 44]]);
  const top = mid + span / 2;
  const bottom = mid - span / 2;
  const ly = altY(BOUNDARY.fai, top, bottom);
  const my = altY(BOUNDARY.mcdowell, top, bottom);
  // chalk ellipse round the FAI flag chip
  const ex = RX + 70 + 150;
  const chalk = ez(f, 4, 44);
  const L = 2 * Math.PI * 190;
  const chartIn = ez(f, P7, P7 + 30);
  const chartX = lerp(1960, 1000, chartIn);
  const curveK = ez(f, P7 + 20, P8 - 6);
  const curvePts = Array.from({ length: 21 }, (_, i) => {
    const u = i / 20;
    return [40 + u * 520, 380 - Math.pow(u, 0.7) * 300 + Math.sin(u * 7) * 10] as [number, number];
  });
  const shownPts = curvePts.slice(0, Math.max(2, Math.round(curveK * 20) + 1));
  const markerK = ez(f, P8 - 30, P8 - 14);
  const markerY = lerp(ly - 200, ly + 60, markerK);
  const pinDrop = ez(f, P8 + 4, P8 + 22);
  const flip = ez(f, P8 + 20, P8 + 44);
  const d80 = ez(f, P8 + 10, P8 + 40);
  const petrolK = ez(f, P7, P7 + 20) * (1 - ez(f, P8, P8 + 20));
  return (
    <Pop f={f}>
      <Stage theme={VOID.theme} shotFrame={f} drift={{ zoom: 1.06, panX: 0.01, panY: 0, frames: 300, seed: 3 }} vignette={0.3} grain={0.5}>
        <Layer depth={1}>
          <NightColumn f={f} altTop={top} altBottom={bottom} seed={24} ground={false} tint={PETROL.sky[1]} tintK={0.35 * petrolK} />
          <AltRuler
            f={f}
            altTop={top}
            altBottom={bottom}
            x={RX}
            step={10}
            numbers={false}
            flags={[FAI_FLAG]}
            pins={[{ altKm: BOUNDARY.mcdowell, label: "", draw: d80, len: 1200, color: C.limb }]}
          />
          {/* chalk ring round the 100 (drawn, then rubbed round and round) */}
          <ellipse cx={ex} cy={ly} rx={190} ry={62} fill="none" stroke={CREAM} strokeWidth={7} strokeLinecap="round" strokeDasharray={`${L * chalk} ${L}`} strokeDashoffset={-f * 6} opacity={0.9 * (1 - ez(f, P8 - 10, P8 + 10))} />
          <ellipse cx={ex + 4} cy={ly + 3} rx={182} ry={56} fill="none" stroke={CREAM} strokeWidth={3} strokeDasharray="30 22" strokeDashoffset={f * 8} opacity={0.5 * chalk * (1 - ez(f, P8 - 10, P8 + 10))} />
          <Ledge x={RX + 10} y={ly + 200} w={200} />
          <Tick x={RX + 120} y={ly + 200} pxPerM={80} frame={f} facing={1} staff pose="point" poseTo="stand" poseT={ez(f, P7 - 10, P7 + 10)} expression={f < P8 ? "thinking" : "happy"} look={f < P8 ? 0.6 : -0.4} squash={impact(f, P8 + 22, 0.1, 10)} />
          {/* the faded calculation chart: a curve and a dotted marker, no numerals */}
          {chartIn > 0 ? (
            <g transform={`translate(${chartX.toFixed(1)} ${(ly - 160).toFixed(1)}) rotate(-2)`} opacity={1 - ez(f, P8 + 10, P8 + 30) * 0.65}>
              <rect x={8} y={12} width={620} height={440} rx={18} fill="#000" opacity={0.25} />
              <rect x={0} y={0} width={620} height={440} rx={18} fill={mixHex(PETROL.light, PETROL.far, 0.35)} stroke={PETROL.near} strokeWidth={4} />
              {Array.from({ length: 6 }, (_, i) => (
                <line key={i} x1={40} y1={60 + i * 64} x2={580} y2={60 + i * 64} stroke={PETROL.mid} strokeWidth={2} opacity={0.35} />
              ))}
              <line x1={40} y1={400} x2={590} y2={400} stroke={PETROL.near} strokeWidth={4} />
              <line x1={40} y1={400} x2={40} y2={40} stroke={PETROL.near} strokeWidth={4} />
              <path d={"M" + shownPts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L")} fill="none" stroke={C.saffronDeep} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
              {curveK > 0 && curveK < 1 ? <circle cx={shownPts[shownPts.length - 1][0]} cy={shownPts[shownPts.length - 1][1]} r={11} fill={C.saffronCore} stroke={C.saffronDeep} strokeWidth={3} /> : null}
            </g>
          ) : null}
          {markerK > 0 ? (
            <g opacity={1 - ez(f, P8 + 10, P8 + 30)}>
              <line x1={RX} y1={markerY} x2={chartX + 40} y2={markerY} stroke={C.saffronCore} strokeWidth={5} strokeDasharray="6 12" strokeDashoffset={-f * 3} />
              <circle cx={RX} cy={markerY} r={12} fill={C.saffronCore} />
            </g>
          ) : null}
          {/* McDowell's pin and notebook */}
          {f > P8 ? (
            <g>
              <g transform={`translate(${760} ${(my - (1 - pinDrop) * 520).toFixed(1)})`}>
                <line x1={0} y1={0} x2={0} y2={-70} stroke={CREAM} strokeWidth={5} />
                <circle cx={0} cy={-78} r={20} fill={C.vermilion} stroke={INK} strokeWidth={3} />
                <rect x={30} y={-150} width={300} height={66} rx={14} fill={alpha("#04121A", 0.8)} stroke={C.limb} strokeWidth={3} />
                <text x={180} y={-106} textAnchor="middle" style={{ fontFamily: IF2.display, fontWeight: 800, fontSize: 34, fill: CREAM }}>
                  McDowell
                </text>
              </g>
              <g transform={`translate(1180 ${(my - 300).toFixed(1)})`} opacity={ez(f, P8 + 8, P8 + 18)}>
                <rect x={0} y={0} width={200} height={260} rx={8} fill={CREAM} stroke={INK} strokeWidth={4} />
                {Array.from({ length: 7 }, (_, i) => (
                  <line key={i} x1={20} y1={40 + i * 30} x2={180} y2={40 + i * 30} stroke={C.limb} strokeWidth={3} opacity={0.6} />
                ))}
                <g transform={`translate(200 0) scale(${(1 - 2 * flip).toFixed(3)} 1)`}>
                  <rect x={0} y={0} width={200} height={260} rx={8} fill={mixHex(CREAM, C.limb, 0.15 + 0.2 * Math.abs(1 - 2 * flip))} stroke={INK} strokeWidth={4} />
                </g>
              </g>
            </g>
          ) : null}
        </Layer>
        <Layer depth={0}>
          <PillA x={ex + 220} y={ly - 70} text="ROUNDED" F={VOID} dot={CREAM} opacity={ez(f, 20, 32) * (1 - ez(f, P7, P7 + 10))} />
          <PillA x={980} y={ly - 220} text="LIMIT BY CALCULATION" F={PETROL} dot={C.saffron} opacity={ez(f, P7 + 16, P7 + 28) * (1 - ez(f, P8, P8 + 10))} />
          <PillA x={760} y={my + 70} text={`${BOUNDARY.mcdowellYear} · ${BOUNDARY.mcdowell} KM` /* #2 */} F={VOID} dot={C.limb} opacity={ez(f, P8 + 24, P8 + 36)} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 1-09 + 1-10 + 1-11 · the record balloons rise on the ruler and stop well short of the lines (38.97 km #4, 41.4 km #8);
// then the scene darkens and two bars grow from the ground against the full 100 and 80 bars. MOVER: balloons rising +
// counters rolling + cirrus 2.4 px/f + the ruler scrolling; then bars growing (16-24 px/f) + bracket + the pull back.
// ================================================================================================================
const ShotRecords: ShotFC<C01> = ({ f, len, c }) => {
  const P10 = c.eus - c.rec;
  const P11 = c.half - c.rec;
  const mid = path1(f, [[0, 46], [P10, 50], [P11, 52], [len, 56]]);
  const span = path1(f, [[0, 112], [P11, 112], [len, 128]]);
  const top = mid + span / 2;
  const bottom = mid - span / 2;
  const A = (a: number) => altY(a, top, bottom);
  const b1 = JUMPS.baumgartner.exitKm * ez(f, 4, P10 - 12); // #4
  const b2 = JUMPS.eustace.exitKm * ez(f, P10 + 4, P11 - 16); // #8
  const dark = ez(f, P11, P11 + 24);
  const g = f - P11;
  const bar = (k: number) => ez(g, 8 + k * 14, 40 + k * 14);
  const gy = A(0);
  const duskStops = ["#0B1140", "#1D3F9E", "#6A3E86", "#E3813F"];
  return (
    <Stage theme={DUSK.theme} cam={cameraAt(f, [{ f: 0, x: 960, y: 540, zoom: 1.06 }, { f: P11, x: 960, y: 520, zoom: 1.1 }, { f: len, x: 960, y: 540, zoom: 1.0 }])} vignette={0.25} grain={0.5}>
      <Layer depth={1}>
        <defs>
          <linearGradient id="l01dusk" x1="0" y1="0" x2="0" y2="1">
            {duskStops.map((s, i) => (
              <stop key={i} offset={i / 3} stopColor={s} />
            ))}
          </linearGradient>
        </defs>
        <rect x={-300} y={-300} width={2520} height={1700} fill="url(#l01dusk)" />
        <g opacity={dark}>
          <NightColumn f={f} altTop={top} altBottom={bottom} seed={25} ground={false} />
        </g>
        <Motes frame={f} n={20} x={0} y={60} w={1920} h={800} color={alpha(C.starGold, 0.9)} seed={4} size={3.5} drift={30} />
        <g opacity={1 - dark}>
          <CloudRack f={f} n={5} x0={-700} x1={2700} y0={A(10) - 60} y1={A(4)} size={70} speed={2.4} body={alpha("#F3A35C", 0.8)} under={alpha("#7A3A20", 0.5)} top={alpha("#FFE0A8", 0.7)} seed={12} flat={1.8} />
        </g>
        <path d={`M-300 ${gy} Q 500 ${gy - 20} 1100 ${gy + 6} Q 1700 ${gy + 22} 2300 ${gy - 8} L2300 ${gy + 900} L-300 ${gy + 900} Z`} fill={mixHex(C.dune3, "#140A24", 0.5 + 0.2 * dark)} />
        <rect x={-300} y={gy - 8} width={2600} height={8} fill={C.cityGlow} opacity={0.6} />
        <AltRuler
          f={f}
          altTop={top}
          altBottom={bottom}
          x={RX}
          step={10}
          numbers={false}
          flags={[
            { altKm: BOUNDARY.mcdowell, label: `${BOUNDARY.mcdowell} km`, color: C.limb }, // #2
            { altKm: BOUNDARY.fai, label: `${BOUNDARY.fai} km`, color: C.saffron }, // #1
          ]}
          pins={[
            { altKm: BOUNDARY.mcdowell, label: "", draw: 1, len: 1300, color: C.limb },
            { altKm: BOUNDARY.fai, label: "", draw: 1, len: 1300 },
          ]}
        />
        {/* bars from the ground to each balloon, and the full 100 and 80 bars (1-11) */}
        {g > 0 ? (
          <g>
            {[
              { x: 620, to: JUMPS.baumgartner.exitKm, col: C.saffron, k: bar(0) },
              { x: 920, to: JUMPS.eustace.exitKm, col: C.saffron, k: bar(1) },
            ].map((b, i) => (
              <rect key={i} x={b.x - 26} y={A(b.to * b.k)} width={52} height={gy - A(b.to * b.k)} rx={8} fill={b.col} opacity={0.9} />
            ))}
            {[
              { x: 1180, to: BOUNDARY.fai, col: C.saffron, k: bar(2) },
              { x: 1300, to: BOUNDARY.mcdowell, col: C.limb, k: bar(3) },
            ].map((b, i) => (
              <g key={i}>
                <rect x={b.x - 30} y={A(b.to * b.k)} width={60} height={gy - A(b.to * b.k)} rx={8} fill="none" stroke={b.col} strokeWidth={6} />
                <rect x={b.x - 30} y={A(JUMPS.eustace.exitKm * b.k * (i === 0 ? 1 : JUMPS.baumgartner.exitKm / JUMPS.eustace.exitKm))} width={60} height={gy - A(JUMPS.eustace.exitKm * b.k * (i === 0 ? 1 : JUMPS.baumgartner.exitKm / JUMPS.eustace.exitKm))} rx={8} fill={b.col} opacity={0.55} />
              </g>
            ))}
            <Bracket x1={1400} y1={gy} x2={1400} y2={A(BOUNDARY.fai / 2)} draw={ez(g, 64, 96)} />
          </g>
        ) : null}
        <Balloon x={620} y={A(b1)} size={220} f={f} variant="capsule" payload={<Jumper x={0} y={0} h={34} f={f} pose="stand" color={C.saffron} />} />
        {f > P10 - 6 ? <Balloon x={920} y={A(b2)} size={220} f={f + 40} variant="beam" opacity={ez(f, P10 - 6, P10 + 4)} payload={<Jumper x={0} y={0} h={40} f={f} pose="hang" />} /> : null}
        {g > 0 ? <Tick x={1560} y={gy} pxPerM={90} frame={f} facing={-1} staff pose="point" expression="proud" look={0.6} /> : null}
      </Layer>
      <Layer depth={0}>
        {f < P10 + 10 ? (
          <g opacity={1 - ez(f, P10 - 8, P10)}>
            <Slab x={1040} y={330} value={rollText(JUMPS.baumgartner.exitKm, ez(f, 4, P10 - 12), 2) /* 38.97 #4 */} unit="km" size={100} F={DUSK} />
            <PillA x={1010} y={420} text={`BAUMGARTNER ${JUMPS.baumgartner.year}`} F={DUSK} dot={C.saffron} opacity={ez(f, 10, 22)} />
          </g>
        ) : null}
        {f > P10 && g < 10 ? (
          <g opacity={ez(f, P10, P10 + 8) * (1 - ez(g, 0, 10))}>
            <Slab x={1040} y={330} value={rollText(JUMPS.eustace.exitKm, ez(f, P10 + 4, P11 - 16), 1) /* 41.4 #8 */} unit="km" size={100} F={DUSK} />
            <PillA x={1010} y={420} text={`EUSTACE ${JUMPS.eustace.year}`} F={DUSK} dot={C.saffron} opacity={ez(f, P10 + 10, P10 + 22)} />
          </g>
        ) : null}
        {g > 0 ? (
          <g>
            <PillA x={1130} y={150} text={`LESS THAN HALF OF ${BOUNDARY.fai}` /* #9 */} F={VOID} dot={C.saffron} opacity={ez(g, 30, 44)} />
            <PillA x={1130} y={230} text={`ABOUT HALF OF ${BOUNDARY.mcdowell}` /* #9 */} F={VOID} dot={C.limb} opacity={ez(g, 64, 78)} />
          </g>
        ) : null}
      </Layer>
    </Stage>
  );
};

// ================================================================================================================
// 1-12 · "a nickname": the words "EDGE OF SPACE" in quotes drop in; a saffron NICKNAME stamp slams across.
// MOVER: quote marks sliding (20 px/f) + the words dropping + the stamp slam (40 px/f) + the push in + stars drifting.
// ================================================================================================================
const ShotNickname: ShotFC<C01> = ({ f, len }) => {
  const drop = ez(f, 0, 16);
  const q = ez(f, 6, 26);
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 540, zoom: 1.0 },
    { f: len + 10, x: 960, y: 560, zoom: 1.14 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={VOID.theme} cam={cam} vignette={0.3} grain={0.5}>
        <Layer depth={0.5}>
          <NightColumn f={f} altTop={120} altBottom={70} seed={26} ground={false} drift={14} />
        </Layer>
        <Layer depth={1}>
          <g transform={`translate(960 ${(560 - (1 - drop) * 260).toFixed(1)})`} opacity={drop}>
            <text x={0} y={0} textAnchor="middle" style={{ fontFamily: IF2.display, fontWeight: 800, fontSize: 130, letterSpacing: 4, fill: CREAM }}>
              EDGE OF SPACE
            </text>
          </g>
          <text x={lerp(-200, 90, q)} y={560} style={{ fontFamily: IF2.display, fontWeight: 800, fontSize: 220, fill: C.saffron }}>
            “
          </text>
          <text x={lerp(2100, 1740, q)} y={560} style={{ fontFamily: IF2.display, fontWeight: 800, fontSize: 220, fill: C.saffron }}>
            ”
          </text>
          <Stamp x={1000} y={700} text="NICKNAME" age={f - 30} size={78} rotate={-7} />
          <Ledge x={1340} y={930} w={220} />
          <Tick x={1450} y={930} pxPerM={90} frame={f} facing={-1} pose={f > 40 ? "press" : "stand"} expression="happy" look={0.4} headTilt={10} squash={impact(f, 44, 0.1, 10)} />
        </Layer>
        <Layer depth={0}>
          <g opacity={ez(f, 2, 14)}>
            <Headline x={120} y={180} lines={["A nickname"]} size={84} color={CREAM} accent={C.saffron} />
          </g>
        </Layer>
      </Stage>
    </Pop>
  );
};

// ================================================================================================================
// 1-13 … 1-16 · the layers: a teal band wipes up the ruler to the stratosphere's top (50 km #10), an indigo band on to
// 85 km (#10), aurora ribbons above; then the nickname card shrinks onto the ruler's top and a REAL NUMBERS tag thumps.
// MOVER: band wipes (14 px/f) + the climb (ruler 6-14 px/f) + aurora rippling (5 px/f) + the card shrinking (14 px/f).
// ================================================================================================================
const ShotLayers: ShotFC<C01> = ({ f, len, c }) => {
  const P14 = c.meso - c.strato;
  const P15 = c.thermo - c.strato;
  const P16 = c.title - c.strato;
  const mid = path1(f, [[0, 30], [P14, 46], [P15, 72], [P16, 96], [len, 100]]);
  const span = path1(f, [[0, 62], [P14, 70], [P15, 82], [len, 82]]);
  const top = mid + span / 2;
  const bottom = mid - span / 2;
  const A = (a: number) => altY(a, top, bottom);
  const w1 = ez(f, 6, 70);
  const w2 = ez(f, P14 + 4, P14 + 70);
  const aur = ez(f, P15 - 6, P15 + 20);
  const petrolK = 1 - ez(f, P14 - 10, P14 + 20) + ez(f, P16, P16 + 20);
  const g = f - P16;
  const shrink = ez(g, 0, 40);
  const ribbons = [
    { c: C.teal, o: 0.5, ph: 0, amp: 1, w: 38 },
    { c: C.limb, o: 0.38, ph: 2.1, amp: 0.8, w: 26 },
    { c: C.vermilion, o: 0.75, ph: 4.2, amp: 0.6, w: 4 },
  ];
  const ay = A(100);
  return (
    <Stage theme={VOID.theme} cam={cameraAt(f, [{ f: 0, x: 960, y: 540, zoom: 1.0 }, { f: len, x: 940, y: 520, zoom: 1.06 }])} vignette={0.3} grain={0.5}>
      <Layer depth={1}>
        <NightColumn f={f} altTop={top} altBottom={bottom} seed={27} tint={PETROL.sky[1]} tintK={0.3 * Math.min(1, petrolK)} />
        {aur > 0 ? (
          <g opacity={aur}>
            {ribbons.map((r, j) => {
              const pts = Array.from({ length: 19 }, (_, i) => {
                const px = -100 + (2120 * i) / 18;
                return `${i ? "L" : "M"}${px.toFixed(1)} ${(ay - 60 - j * 40 + Math.sin(px / 170 + f / 6 + r.ph) * 40 * r.amp + Math.sin(px / 61 - f / 4 + r.ph) * 10).toFixed(1)}`;
              }).join(" ");
              return (
                <g key={j}>
                  {r.w > 10 ? <path d={pts} fill="none" stroke={r.c} strokeWidth={r.w * 2.6} opacity={r.o * 0.3} strokeLinecap="round" /> : null}
                  <path d={pts} fill="none" stroke={r.c} strokeWidth={r.w} opacity={r.o} strokeLinecap="round" />
                </g>
              );
            })}
          </g>
        ) : null}
        <AltRuler f={f} altTop={top} altBottom={bottom} x={RX} step={10} numbers={false} flags={false} band={{ from: 12, to: LAYERS.stratoTop, wipe: w1, color: C.strato }} />
        {f > P14 ? <AltRuler f={f} altTop={top} altBottom={bottom} x={RX} step={10} numbers={false} flags={false} band={{ from: LAYERS.stratoTop, to: LAYERS.mesoTop, wipe: w2, color: C.meso }} /> : null}
        {[
          { a: LAYERS.stratoTop, k: ez(f, 60, 74), col: C.strato },
          { a: LAYERS.mesoTop, k: ez(f, P14 + 60, P14 + 74), col: mixHex(C.meso, CREAM, 0.3) },
        ].map((t, i) => (
          <line key={i} x1={RX - 40} y1={A(t.a)} x2={RX - 40 + 400 * t.k} y2={A(t.a)} stroke={t.col} strokeWidth={6} strokeLinecap="round" />
        ))}
        {g > 0 ? (
          <g>
            <Ledge x={RX + 10} y={A(top - 22)} w={200} />
            <Tick x={RX + 120} y={A(top - 22)} pxPerM={80} frame={f} facing={1} staff pose="point" poseTo="stand" poseT={ez(g, 30, 50)} expression="happy" look={g < 40 ? 0.6 : -0.8} />
          </g>
        ) : null}
      </Layer>
      <Layer depth={0}>
        <PillA x={560} y={A(31)} text="STRATOSPHERE" F={PETROL} dot={C.strato} opacity={ez(f, 24, 36) * (1 - ez(f, P14, P14 + 10))} />
        <PillA x={600} y={A(LAYERS.stratoTop) - 50} text={`${LAYERS.stratoTop} KM` /* #10 */} F={PETROL} opacity={ez(f, 66, 78) * (1 - ez(f, P14, P14 + 10))} />
        <PillA x={560} y={A(67)} text="MESOSPHERE" F={VOID} dot={C.meso} opacity={ez(f, P14 + 24, P14 + 36) * (1 - ez(f, P15, P15 + 10))} />
        <PillA x={600} y={A(LAYERS.mesoTop) - 50} text={`${LAYERS.mesoTop} KM` /* #10 */} F={VOID} opacity={ez(f, P14 + 66, P14 + 78) * (1 - ez(f, P15, P15 + 10))} />
        <PillA x={760} y={ay - 210} text="THERMOSPHERE" F={VOID} dot={C.vermilion} opacity={ez(f, P15 + 10, P15 + 22) * (1 - ez(f, P16, P16 + 10))} />
        {g > 0 ? (
          <g>
            <g transform={`translate(${lerp(960, 560, shrink).toFixed(1)} ${lerp(540, 170, shrink).toFixed(1)}) scale(${lerp(1.5, 0.62, shrink).toFixed(3)})`} opacity={ez(g, 0, 8)}>
              <rect x={-330} y={-80} width={660} height={160} rx={24} fill={alpha("#04121A", 0.86)} stroke={C.saffron} strokeWidth={4} />
              <text x={0} y={22} textAnchor="middle" style={{ fontFamily: IF2.display, fontWeight: 800, fontSize: 64, fill: CREAM }}>
                “Edge of Space”
              </text>
            </g>
            <Stamp x={980} y={190} text="REAL NUMBERS" age={g - 34} size={44} rotate={-5} />
          </g>
        ) : null}
      </Layer>
    </Stage>
  );
};

// ================================================================================================================

export const SceneL01: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL01(t);
  const shots: ShotDef<C01>[] = [
    { from: 0, S: ShotAsk, id: "1-01" },
    { from: c.fai, S: ShotLines, id: "1-02" }, // + 1-03, 1-04
    { from: c.wall, S: ShotWall, id: "1-05" },
    { from: c.round, S: ShotLimit, id: "1-06" }, // + 1-07, 1-08
    { from: c.rec, S: ShotRecords, id: "1-09" }, // + 1-10, 1-11
    { from: c.nick, S: ShotNickname, id: "1-12" },
    { from: c.strato, S: ShotLayers, id: "1-13" }, // + 1-14, 1-15, 1-16
  ];
  return playShots(f, shots, c, t.frames);
};

export const soundL01 = (t: SceneTiming): Cue[] => {
  const c = cuesL01(t);
  return [
    ...[0, 12, 24].map((o) => ({ at: c.ask + 10 + o, file: SFX.pop, vol: 0.16, dur: 20 })),
    ...cutHit(c.fai),
    { at: c.fai + 6, file: SFX.swirl, vol: 0.14, dur: 40 },
    { at: c.fai + 50, file: SFX.click, vol: 0.14, dur: 12 },
    { at: c.miles + 30, file: SFX.click, vol: 0.14, dur: 12 },
    ...Array.from({ length: 6 }, (_, i) => ({ at: c.conv + 6 + i * 7, file: SFX.click, vol: 0.08, dur: 8 })),
    ...cutHit(c.wall),
    { at: c.wall + 40, file: SFX.pop, vol: 0.2, dur: 20 },
    ...cutHit(c.round),
    { at: c.round + 4, file: SFX.swirl, vol: 0.12, dur: 40 },
    ...Array.from({ length: 5 }, (_, i) => ({ at: c.calc + 20 + i * 8, file: SFX.click, vol: 0.07, dur: 8 })),
    { at: c.mcd + 22, file: SFX.popLong, vol: 0.18, dur: 30 },
    ...cutHit(c.rec),
    ...Array.from({ length: 6 }, (_, i) => ({ at: c.rec + 10 + i * 9, file: SFX.click, vol: 0.07, dur: 8 })),
    ...Array.from({ length: 6 }, (_, i) => ({ at: c.eus + 10 + i * 9, file: SFX.click, vol: 0.07, dur: 8 })),
    { at: c.half + 38, file: SFX.pop, vol: 0.16, dur: 20 },
    { at: c.half + 72, file: SFX.pop, vol: 0.16, dur: 20 },
    ...cutHit(c.nick),
    { at: c.nick + 30, file: SFX.popLong, vol: 0.22, dur: 30 },
    ...cutHit(c.strato),
    { at: c.strato + 6, file: SFX.swirl, vol: 0.12, dur: 40 },
    { at: c.meso + 4, file: SFX.swirl, vol: 0.12, dur: 40 },
    { at: c.thermo, file: SFX.swirl, vol: 0.12, dur: 40 },
    { at: c.title + 34, file: SFX.pop, vol: 0.2, dur: 20 },
  ];
};
