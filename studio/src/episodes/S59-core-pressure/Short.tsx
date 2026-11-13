import React from "react";
import { Sky, Tick } from "../../lib/illustrated";
import { buildTimeline, VoLine } from "../../lib/timeline";
import { C, Chips, EndShot, Glow, Plaque, Strata, T, W, H, Shot, ez, makeShort, mix } from "../S41-dig-plate/vkit";
import { Qmark } from "../S46-peak-seafloor/kit46";
import { CutGlobe } from "../L14-earth-tunnel/cutglobe";
import { BG_DEEP, BG_EMBER, BG_STUDIO, Dial, FAM, Weights, Shaft } from "../S56-fall-clock/kit56";
import vo from "./vo.json";

/**
 * S59 - 3,400 tonnes on one square centimetre (episodes/S59-core-pressure). For L14, answered in the 6:04 chapter.
 * Vertical 1080x1920. Numbers (sources.md, L14 rows): #24 air about 1 kg on a cm2, 3.3 million atmospheres = about
 * 3,400 tonnes on a cm2, ratio 3.3 million; #17/#25 3.3 million atmospheres at the inner-core boundary (pressure only,
 * no temperature); #13 12,742 km; #14 Kola 12 km. How anyone measures it (diamonds, lasers, X-rays) is withheld.
 */
export const timeline = buildTimeline(vo as VoLine[]);

const fmt = (v: number) => Math.round(v).toLocaleString("en-US");

const Tile: React.FC<{ x: number; y: number; s: number; rot?: number }> = ({ x, y, s, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-s / 2} y={-s} width={s} height={s} rx={s * 0.08} fill={C.cream} stroke={C.ink} strokeWidth={s * 0.04} />
    <rect x={-s / 2 + s * 0.08} y={-s + s * 0.08} width={s * 0.84} height={s * 0.12} rx={s * 0.04} fill={C.amber} />
  </g>
);

const Table: React.FC = () => (
  <g>
    <rect x={0} y={960} width={W} height={50} fill={C.apricot} />
    <rect x={0} y={1010} width={W} height={320} fill={C.rust} />
  </g>
);

/** a - Tick slaps a square tile on the table. */
const a: Shot = ({ f, n }) => {
  const k = ez(f, 2, 12);
  return (
    <g>
      <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
      <Chips f={f} n={8} y0={160} y1={900} color={C.foam} speed={8} opacity={0.35} seed={3} />
      <Table />
      <Tile x={640} y={mix(420, 960, k)} s={260} rot={mix(18, 0, k)} />
      <Tick x={250} y={1250} pxPerM={340} frame={f} pose="press" expression="happy" facing={1} />
      <Plaque x={540} y={190} text="ONE TILE" size={120} bg={C.ink} fg={C.amber} scale={ez(f, 0, n - 4)} />
    </g>
  );
};

/** b - a bracket snaps around it: 1 CM across. */
const b: Shot = ({ f }) => {
  const k = ez(f, 0, 10);
  return (
    <g>
      <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
      <Glow x={540} y={700} r={560} color={C.gold} f={f} strength={0.5} />
      <Tile x={540} y={880} s={mix(420, 520, k)} />
      <path d={`M${540 - 260 * k} 960 v40 h${520 * k} v-40 M${540 - 260 * k} 1000 v0`} stroke={C.amber} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Plaque x={540} y={1130} text="1 CM" size={110} bg={C.ink} fg={C.amber} scale={ez(f, 6, 14)} />
      <Plaque x={540} y={190} text="ONE SQUARE CENTIMETRE" size={62} bg={C.ink} fg={C.cream} />
    </g>
  );
};

/** c - a light block lands on the tile: 1 kg. */
const c: Shot = ({ f }) => {
  const k = ez(f, 0, 10);
  return (
    <g>
      <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
      <Table />
      <Tile x={540} y={960} s={420} />
      <g transform={`translate(540 ${mix(300, 760, k)})`}>
        <rect x={-110} y={-90} width={220} height={90} rx={14} fill={C.orange} stroke={C.ink} strokeWidth={8} />
        <rect x={-90} y={-76} width={80} height={12} rx={6} fill={C.cream} opacity={0.5} />
      </g>
      <Plaque x={540} y={190} text="1 KG" size={170} bg={C.ink} fg={C.amber} w={560} scale={ez(f, 6, 14)} />
    </g>
  );
};

/** d - the air above pushes down on the tile. */
const d: Shot = ({ f }) => (
  <g>
    <Sky stops={["#2A8FC4", "#4FB5DE", "#9BD6E8"]} x={0} y={0} w={W} h={H} />
    <Table />
    <Tile x={540} y={960} s={300} />
    {[0, 1, 2, 3, 4].map((i) => {
      const y = ((f * 9 + i * 170) % 860) + 100;
      return <path key={i} d={`M${540 - 120 + (i % 2) * 40} ${y} l120 70 l120 -70`} stroke={C.foam} strokeWidth={26} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />;
    })}
    <Plaque x={540} y={190} text="THE AIR ABOVE" size={96} bg={C.ink} fg={C.cream} />
    <Plaque x={540} y={1130} text="ABOUT 1 KG" size={96} bg={C.ink} fg={C.amber} />
  </g>
);

/** e - the tile hangs from a cable and goes down the shaft. */
const e: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
    <Shaft f={f} x={540} w={300} y0={250} y1={1250} speed={22} />
    <path d={`M540 250 V${760 + Math.sin(f / 5) * 16}`} stroke={C.cream} strokeWidth={8} />
    <Tile x={540} y={960 + Math.sin(f / 5) * 16} s={220} />
    <Plaque x={540} y={190} text="NOW GO DOWN" size={100} bg={C.ink} fg={C.amber} />
  </g>
);

/** f - strata rushing past. */
const f_: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
    <Strata f={f} speed={26} bands={[[220, "#C45A2A"], [140, "#9C3A1C"], [260, "#E3813F"], [180, "#FF9A3C"]]} y0={250} y1={1250} amp={20} seed={3} />
    <rect x={410} y={250} width={260} height={1000} fill={C.ink} opacity={0.5} />
    <Tile x={540} y={900} s={200} />
    <Plaque x={540} y={190} text="DEEPER AND DEEPER" size={74} bg={C.ink} fg={C.cream} />
  </g>
);

/** g - arrival at the edge of the solid iron ball. */
const g: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 4);
  return (
    <g>
      <Sky stops={BG_EMBER} x={0} y={0} w={W} h={H} />
      <CutGlobe cx={540} cy={680} R={420} f={f} family={FAM} probe={mix(-0.6, -0.2, k)} line={{ to: mix(-0.6, -0.2, k) }} highlight={{ layer: "inner", k: 0.5 + 0.3 * Math.sin(f / 5) }} />
      <Plaque x={540} y={190} text="SOLID IRON BALL" size={90} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** h - the pressure dial spins up. */
const h: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 2);
  return (
    <g>
      <Sky stops={BG_EMBER} x={0} y={0} w={W} h={H} />
      <Glow x={540} y={640} r={640} color={C.gold} f={f} strength={0.6} />
      <Dial x={540} y={640} r={340} v={k} shake={k > 0.9 ? 0.03 : 0} f={f} />
      <Plaque x={540} y={190} text="PRESSURE" size={130} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** i - 3.3 million atmospheres rolls in. */
const i_: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 8);
  return (
    <g>
      <Sky stops={BG_EMBER} x={0} y={0} w={W} h={H} />
      <Glow x={540} y={620} r={640} color={C.gold} f={f} strength={0.7} />
      <Plaque x={540} y={520} text={(3.3 * k).toFixed(1)} size={330} bg={C.ink} fg={C.amber} w={720} />
      <Plaque x={540} y={860} text="MILLION" size={120} bg={C.ink} fg={C.cream} />
      <Plaque x={540} y={1070} text="ATMOSPHERES" size={92} bg={C.ink} fg={C.cream} />
    </g>
  );
};

/** j - weights pile up on the tile, climbing past the top of the frame. */
const j: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 2);
  return (
    <g>
      <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
      <Weights x={540} base={1190} count={14 * k} w={420} />
      <Tile x={540} y={1260} s={160} />
      <Tick x={150} y={1250} pxPerM={300} frame={f} pose="point" expression="surprised" facing={1} />
      <Plaque x={540} y={190} text="~3,400 TONNES" size={98} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** k - the tower shakes on its one small tile. */
const k_: Shot = ({ f }) => (
  <g transform={`translate(${Math.sin(f * 2.3) * 5} 0)`}>
    <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
    <Weights x={540} base={1190} count={14} w={420} />
    <Tile x={540} y={1260} s={160} />
    <Plaque x={540} y={190} text="ON THIS ONE TILE" size={84} bg={C.ink} fg={C.cream} />
  </g>
);

/** l - a grid of one-tonne blocks fills the frame. */
const l: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 4);
  const lit = Math.floor(k * 120);
  return (
    <g>
      <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
      {Array.from({ length: 120 }, (_, i) => (
        <rect key={i} x={70 + (i % 10) * 96} y={290 + Math.floor(i / 10) * 74} width={84} height={62} rx={10} fill={i <= lit ? (i % 2 ? C.orange : C.rust) : C.ink} opacity={i <= lit ? 1 : 0.35} stroke={C.cream} strokeWidth={3} />
      ))}
      <Plaque x={540} y={190} text="ONE-TONNE BLOCKS" size={80} bg={C.ink} fg={C.cream} />
    </g>
  );
};

/** m - the block count rolls to 3,400. */
const m: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 8);
  return (
    <g>
      <Sky stops={BG_STUDIO} x={0} y={0} w={W} h={H} />
      <Glow x={540} y={620} r={640} color={C.gold} f={f} strength={0.6} />
      <Plaque x={540} y={540} text={fmt(3400 * k)} size={300} bg={C.ink} fg={C.amber} w={800} />
      <Plaque x={540} y={880} text="BLOCKS OF 1 TONNE" size={84} bg={C.ink} fg={C.cream} />
      <Tile x={540} y={1190} s={170} />
    </g>
  );
};

/** n - the tower beside a single 1 kg block. */
const n_: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
    <Weights x={300} base={1190} count={14} w={340} />
    <g transform="translate(800 1190)">
      <rect x={-70} y={-60} width={140} height={60} rx={10} fill={C.orange} stroke={C.ink} strokeWidth={6} />
    </g>
    <T x={800} y={1090} text="1 KG" size={64} color={C.amber} />
    <Plaque x={540} y={190} text="INSIDE VS SURFACE" size={78} bg={C.ink} fg={C.cream} />
  </g>
);

/** o - 3.3 million times the air. */
const o: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 8);
  return (
    <g>
      <Sky stops={BG_EMBER} x={0} y={0} w={W} h={H} />
      <Glow x={540} y={620} r={640} color={C.gold} f={f} strength={0.7} />
      <Plaque x={540} y={520} text={`${(3.3 * k).toFixed(1)} MILLION`} size={150} bg={C.ink} fg={C.amber} w={900} />
      <Plaque x={540} y={800} text="TIMES" size={150} bg={C.ink} fg={C.cream} />
      <Plaque x={540} y={1030} text="THE AIR AT THE SURFACE" size={58} bg={C.ink} fg={C.cream} />
    </g>
  );
};

/** p - the dial's needle slams the stop and the face cracks. */
const p: Shot = ({ f, n }) => {
  const k = ez(f, 0, 8);
  const crack = ez(f, 10, 18);
  return (
    <g transform={`translate(${f > 8 ? Math.sin(f * 3) * 6 : 0} 0)`}>
      <Sky stops={BG_EMBER} x={0} y={0} w={W} h={H} />
      <Dial x={540} y={640} r={mix(330, 390, ez(f, 14, n - 2))} v={mix(0.7, 1, k)} shake={0.05} f={f} />
      <path d={`M540 640 L${540 + 200 * crack} ${640 - 300 * crack} L${540 + 120 * crack} ${640 - 120 * crack} L${540 + 330 * crack} ${640 - 100 * crack}`} stroke={C.cream} strokeWidth={10} fill="none" strokeLinejoin="round" opacity={crack} />
      <Plaque x={540} y={190} text="OFF THE SCALE" size={96} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** q - the planet with the tiny 12 km notch at the top. */
const q: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
    <CutGlobe cx={540} cy={700} R={430} f={f} family={FAM} notch={1} />
    <circle cx={540} cy={270} r={34 + 10 * Math.sin(f / 3)} fill="none" stroke={C.amber} strokeWidth={10} />
    <Tick x={980} y={1250} pxPerM={230} frame={f} pose="point" expression="neutral" facing={-1} />
    <Plaque x={540} y={1180} text="DEEPEST HOLE: 12 KM" size={64} bg={C.ink} fg={C.amber} />
  </g>
);

/** r - the dotted line to the middle: 12,742 km. */
const r_: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 4);
  return (
    <g>
      <Sky stops={BG_DEEP} x={0} y={0} w={W} h={H} />
      <CutGlobe cx={540} cy={690} R={420} f={f} family={FAM} notch={1} line={{ to: mix(-1, 1, k) }} />
      <Plaque x={540} y={190} text="OF 12,742 KM" size={110} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** s - the unanswered question beside the tile. */
const s_: Shot = ({ f }) => (
  <g>
    <Sky stops={BG_EMBER} x={0} y={0} w={W} h={H} />
    <Chips f={f} n={12} y0={150} y1={1150} color={C.gold} speed={7} opacity={0.35} seed={6} />
    <Tile x={300} y={1000} s={260} />
    <Qmark f={f} x={700} y={900} size={640} />
    <Plaque x={540} y={190} text="HOW DO WE KNOW?" size={90} bg={C.ink} fg={C.amber} />
  </g>
);

const t_: Shot = ({ f }) => (
  <EndShot f={f} stops={["#2B0C08", "#7A2A0E", "#C2561A"]} q={["HOW DO WE", "KNOW?"]}>
    <Tile x={950} y={1300} s={120} />
  </EndShot>
);

export const ShortS59 = makeShort(timeline, [[a, b], [c, d], [e, f_, g], [h, i_], [j, k_], [l, m], [n_, o], [p], [q, r_], [s_, t_]]);
