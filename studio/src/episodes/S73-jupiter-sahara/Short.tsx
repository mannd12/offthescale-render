import React from "react";
import { Sky, Tick } from "../../lib/illustrated";
import { buildTimeline, VoLine } from "../../lib/timeline";
import { EndShot, W, H, Shot, makeShort } from "../S41-dig-plate/vkit";
import { Qmark } from "../S46-peak-seafloor/kit46";
import { C, Plaque, ez, mix } from "../S61-record-peak/kit61";
import { L19_COLORS, familyOf } from "../L19-into-jupiter/families";
import { Limb } from "../L19-into-jupiter/scenes/a-parts";
import { DeckBands, DryPatch, FlatMap, Wisps } from "../L19-into-jupiter/decks";
import { Capsule, Canopy, Orbiter } from "../L19-into-jupiter/probe19";
import { TapeTicket } from "../L19-into-jupiter/tape";
import { StarsTint } from "../L19-into-jupiter/flows19";
import { Cactus, Magnifier, Tumbleweed, WaterDrop } from "../L19-into-jupiter/icons19";
import { AgencyPill, WordPill } from "../L19-into-jupiter/tags19";
import vo from "./vo.json";

/**
 * S73 - Dry spots cover under 1 % of Jupiter, and the probe fell right into one (episodes/S73-jupiter-sahara). For L19, answered at 3:56 (The desert).
 * Claims (sources.md, L19 rows 1, 4, 6, 10): 1995; drier than anticipated; one cloud structure of modest size where three layers are usually
 * described; a dry spot, a gap in the clouds; "the Sahara Desert of Jupiter"; dry spots cover less than 1 % of the atmosphere.
 * Withheld: how wet Jupiter is (100 times more water around a dry spot; Juno's 2.7 times the Sun): an orbiter and a drop with a "?", no numbers.
 */
export const timeline = buildTimeline(vo as VoLine[]);

const LIMB = familyOf("limb");
const SCOPE = familyOf("scope");
const CREST_COLS = ["#F28A1E", "#FFC247", "#E2571F", "#FFE066", "#F2A31B", "#B8431A"];

/** The cloud tops: decks scrolling up and shearing (L19's free mover). */
const Clouds: React.FC<{ f: number; speed?: number; ghost?: ("HIGH" | "MIDDLE" | "LOW")[]; ghostDraw?: number; fill?: number }> = ({ f, speed = 20, ghost, ghostDraw, fill }) => (
  <DeckBands f={f} speed={speed} shear={[18, -22, 24, -16, 20, -26]} x={-200} y={0} w={W + 400} h={H} colors={CREST_COLS} belt scale={1.6} ghost={ghost} ghostDraw={ghostDraw} fill={fill} />
);
const Space: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <Sky stops={LIMB.sky as unknown as string[]} x={0} y={0} w={W} h={H} />
    <StarsTint f={f} x={-200} y={-200} w={W + 400} h={H + 400} n={70} speed={6} seed={74} size={1.4} />
  </g>
);
/** Tick's station: L19's scope green with wide light bands sliding across. */
const Station: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <Sky stops={SCOPE.sky as unknown as string[]} x={0} y={0} w={W} h={H} />
    {Array.from({ length: 6 }, (_, i) => (
      <rect key={i} x={((i * 260 + f * 5) % 1560) - 260} y={0} width={180} height={H} fill="#FFE08A" opacity={0.1} transform="skewX(-10)" />
    ))}
  </g>
);
/** L19's Limb clips to its landscape frame (y -200..1280): shift it down for the vertical frame. */
const VLimb: React.FC<{ f: number; cy: number; R: number; seed?: number; dy?: number }> = ({ f, cy, R, seed = 1, dy = 640 }) => (
  <g transform={`translate(0 ${dy})`}>
    <Limb f={f} cx={540} cy={cy - dy} R={R} shear={[16, -20, 22, -18, 20, -22]} seed={seed} />
  </g>
);
const Probe: React.FC<{ f: number; x: number; y: number; r?: number; chips?: number }> = ({ f, x, y, r = 70, chips = 6 }) => (
  <g>
    <Canopy x={x} y={y} r={r} unfurl={1} f={f} />
    <Capsule x={x} y={y} r={r} f={f} chips={chips} tilt={Math.sin(f / 10) * 4} />
  </g>
);
const MAP = { x: 60, y: 430, w: 960, h: 640 };
const HOLE: [number, number] = [0.62, 0.55];

/** a - 1995: a probe dropped into Jupiter's clouds and started measuring the air. */
const a1: Shot = ({ f, n }) => (
  <g>
    <Space f={f} />
    <VLimb f={f} cy={2450} R={1500} />
    <Probe f={f} x={540} y={mix(520, 760, ez(f, 0, n))} r={62} chips={0} />
    <Plaque x={540} y={190} text="JUPITER, 1995" size={96} bg={C.ink} fg={C.amber} />
  </g>
);
const a2: Shot = ({ f, n }) => (
  <g>
    <Clouds f={f} />
    <Wisps f={f} x={0} y={0} w={W} h={1300} n={10} speed={26} />
    <Probe f={f} x={540} y={780} r={110} chips={6 * ez(f, 0, Math.round(n * 0.7))} />
    <Plaque x={540} y={190} text="MEASURING THE AIR" size={80} bg={C.ink} fg={C.amber} />
  </g>
);

/** b - the air was drier than anyone expected. */
const Card: React.FC<{ x: number; label: string; drop: number; f: number }> = ({ x, label, drop, f }) => (
  <g>
    <rect x={x - 200} y={520} width={400} height={560} rx={36} fill="#FFF6DC" stroke={L19_COLORS.goldRim} strokeWidth={8} />
    <Plaque x={x} y={600} text={label} size={44} bg={C.ink} fg={C.cream} />
    <WaterDrop x={x} y={860 + Math.sin(f / 9) * 8} size={drop} />
  </g>
);
const b1: Shot = ({ f, n }) => (
  <g>
    <Station f={f} />
    <Card x={300} label="EXPECTED" drop={300} f={f} />
    <Card x={780} label="FOUND" drop={mix(300, 110, ez(f, 4, Math.round(n * 0.7)))} f={f} />
    <Plaque x={540} y={190} text="DRIER" size={110} bg={C.ink} fg={C.amber} />
    <Plaque x={540} y={350} text="THAN EXPECTED" size={60} bg={C.ink} fg={C.cream} />
  </g>
);
const b2: Shot = ({ f, n }) => (
  <g>
    <Station f={f} />
    <Card x={540} label="FOUND" drop={110} f={f} />
    <TapeTicket x={540} y={1000} word="HEARD" f={f} slam={ez(f, 2, Math.round(n * 0.3))} swing={10} size={1.1} />
    <Plaque x={540} y={190} text="DRIER THAN EXPECTED" size={70} bg={C.ink} fg={C.amber} />
    <Plaque x={540} y={340} text="MEASURED IN THE AIR" size={50} bg={C.ink} fg={C.cream} />
  </g>
);

/** c - three layers usually described; it found just one, of modest size. */
const c1: Shot = ({ f, n }) => (
  <g>
    <Clouds f={f} speed={8} ghost={["HIGH", "MIDDLE", "LOW"]} ghostDraw={ez(f, 0, Math.round(n * 0.6))} />
    <Plaque x={540} y={190} text="THREE LAYERS" size={96} bg={C.ink} fg={C.amber} />
    <Plaque x={540} y={340} text="USUALLY DESCRIBED" size={56} bg={C.ink} fg={C.cream} />
  </g>
);
const c2: Shot = ({ f, n }) => (
  <g>
    <Clouds f={f} speed={8} ghost={["HIGH", "MIDDLE", "LOW"]} ghostDraw={1} fill={ez(f, 0, Math.round(n * 0.5))} />
    <Plaque x={540} y={190} text="ONE FOUND" size={110} bg={C.ink} fg={C.amber} />
    <Plaque x={540} y={350} text="OF MODEST SIZE" size={60} bg={C.ink} fg={C.cream} />
  </g>
);

/** d - a dry spot, a gap in the clouds. */
const d1: Shot = ({ f, n }) => (
  <g>
    <Space f={f} />
    <FlatMap f={f} x={MAP.x} y={MAP.y} w={MAP.w} h={MAP.h} speed={18} hole={ez(f, 0, Math.round(n * 0.5))} holeAt={HOLE} />
    <Magnifier x={MAP.x + HOLE[0] * MAP.w + Math.sin(f / 9) * 12} y={MAP.y + HOLE[1] * MAP.h} size={360} rotate={-15} />
    <Tick x={190} y={1260} pxPerM={170} frame={f} pose="point" expression="surprised" facing={1} />
    <Plaque x={540} y={190} text="A DRY SPOT" size={110} bg={C.ink} fg={C.amber} />
  </g>
);
const d2: Shot = ({ f, n }) => (
  <g>
    <Clouds f={f} speed={4} />
    <DryPatch f={f} x={540} y={780} r={230} open={ez(f, 0, Math.round(n * 0.6))} />
    <Plaque x={540} y={190} text="A GAP IN THE CLOUDS" size={70} bg={C.ink} fg={C.amber} />
  </g>
);

/** e - "the Sahara Desert of Jupiter" (the scientists' joke: cactus and tumbleweed, L19 F14). */
const e1: Shot = ({ f }) => (
  <g>
    <Clouds f={f} speed={4} />
    <DryPatch f={f} x={540} y={800} r={250} open={1} props />
    <Plaque x={540} y={190} text="THE SAHARA" size={110} bg={C.ink} fg={C.amber} />
    <Plaque x={540} y={350} text="OF JUPITER" size={80} bg={C.ink} fg={C.cream} />
  </g>
);
const e2: Shot = ({ f }) => (
  <g>
    <Clouds f={f} speed={6} />
    <DryPatch f={f} x={540} y={820} r={330} open={1} />
    <Cactus x={460} y={980} size={300} />
    <Tumbleweed x={((f * 9) % 1300) - 110} y={1020} size={120} rotate={f * 9} />
    <AgencyPill x={540} y={440} agency="NASA SAYS (1997)" size={36} align="middle" />
    <Plaque x={540} y={190} text="THE SAHARA OF JUPITER" size={66} bg={C.ink} fg={C.amber} />
  </g>
);

/** f - dry spots cover less than 1 % of the atmosphere: a 10 x 10 grid, less than one cell lit. */
const Grid: React.FC<{ f: number; k: number }> = ({ f, k }) => {
  const s = 74;
  const g = 6;
  const x0 = 540 - (10 * (s + g) - g) / 2;
  const y0 = 420;
  return (
    <g>
      {Array.from({ length: 100 }, (_, i) => {
        const cx = x0 + (i % 10) * (s + g);
        const cy = y0 + Math.floor(i / 10) * (s + g);
        return <rect key={i} x={cx} y={cy} width={s} height={s} rx={10} fill={i % 2 ? "#F2A31B" : "#E8731C"} opacity={0.85} />;
      })}
      {/* the dry part: a square of 0.8 x 0.8 of one cell (0.64 % of the grid, "less than one percent") */}
      <rect x={x0 + 9 * (s + g) + s * 0.1} y={y0 + 6 * (s + g) + s * 0.1} width={s * 0.8 * k} height={s * 0.8 * k} rx={6} fill="#8E1A18" />
      <circle cx={x0 + 9 * (s + g) + s / 2} cy={y0 + 6 * (s + g) + s / 2} r={(s * 0.75 + 6 * Math.sin(f / 5)) * k} fill="none" stroke={L19_COLORS.heard} strokeWidth={8} />
    </g>
  );
};
const f1: Shot = ({ f, n }) => (
  <g>
    <Space f={f} />
    <Grid f={f} k={ez(f, 2, Math.round(n * 0.5))} />
    <Plaque x={540} y={190} text="UNDER 1 %" size={120} bg={C.ink} fg={C.amber} />
  </g>
);
const f2: Shot = ({ f }) => (
  <g>
    <Space f={f} />
    <Grid f={f} k={1} />
    <Plaque x={540} y={190} text="UNDER 1 %" size={120} bg={C.ink} fg={C.amber} />
    <Plaque x={540} y={345} text="OF THE ATMOSPHERE" size={52} bg={C.ink} fg={C.cream} />
  </g>
);

/** g - out of a whole planet, one rare patch. */
const g1: Shot = ({ f, n }) => {
  const z = ez(f, 0, Math.round(n * 0.7));
  return (
    <g>
      <Space f={f} />
      <FlatMap f={f} x={MAP.x} y={MAP.y} w={MAP.w} h={MAP.h} speed={18} hole={1} holeAt={HOLE} />
      <Magnifier x={mix(MAP.x + HOLE[0] * MAP.w, 900, z)} y={mix(MAP.y + HOLE[1] * MAP.h, 1160, z)} size={mix(360, 200, z)} rotate={-15} />
      <WordPill x={540} y={360} text="ONE SPOT" size={48} F={LIMB} align="middle" />
      <Plaque x={540} y={190} text="ONE RARE PATCH" size={90} bg={C.ink} fg={C.amber} />
    </g>
  );
};
const g2: Shot = ({ f }) => (
  <g>
    <Space f={f} />
    <VLimb f={f} cy={1050} R={600} seed={3} dy={300} />
    <circle cx={640} cy={760} r={16} fill={L19_COLORS.heard} />
    <circle cx={640} cy={760} r={46 + 8 * Math.sin(f / 5)} fill="none" stroke={L19_COLORS.heard} strokeWidth={8} />
    <Plaque x={540} y={190} text="OUT OF A WHOLE PLANET" size={64} bg={C.ink} fg={C.amber} />
  </g>
);

/** h - how much water does the rest hold? Another spacecraft went to find out. (withheld: the answer) */
const h1: Shot = ({ f }) => (
  <g>
    <Space f={f} />
    <VLimb f={f} cy={2500} R={1500} seed={5} />
    <Orbiter x={-160 + f * 9} y={640} kind="juno" f={f} size={0.9} dish="rings" aim={90} />
    <WaterDrop x={800} y={460 + Math.sin(f / 8) * 12} size={180} />
    <Qmark f={f} x={930} y={420} size={200} />
    <Plaque x={540} y={190} text="ANOTHER SPACECRAFT" size={70} bg={C.ink} fg={C.amber} />
  </g>
);
const h2: Shot = ({ f }) => (
  <g>
    <Clouds f={f} speed={10} />
    <WaterDrop x={460} y={760 + Math.sin(f / 7) * 14} size={420} />
    <Qmark f={f} x={760} y={720} size={380} />
    <Plaque x={540} y={190} text="HOW WET IS JUPITER?" size={74} bg={C.ink} fg={C.amber} />
  </g>
);

const end: Shot = ({ f }) => (
  <EndShot f={f} stops={LIMB.sky as unknown as string[]} q={["HOW WET IS", "JUPITER?"]}>
    <Cactus x={940} y={1300} size={150} />
  </EndShot>
);

export const ShortS73 = makeShort(timeline, [[a1, a2], [b1, b2], [c1, c2], [d1, d2], [e1, e2], [f1, f2], [g1, g2], [h1, h2], [end]]);
