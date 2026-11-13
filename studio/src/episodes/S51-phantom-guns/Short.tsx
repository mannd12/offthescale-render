import React from "react";
import { Counter, Sky, Tick } from "../../lib/illustrated";
import { buildTimeline, VoLine } from "../../lib/timeline";
import { C, Chips, EndShot, Glow, Plaque, T, W, H, Shot, ez, makeShort, mix } from "../S41-dig-plate/vkit";
import { Qmark } from "../S46-peak-seafloor/kit46";
import { familyOf } from "../L13-loudest-sound/families";
import { Cannon, Jetty, ListeningTick, MapBox, Notebook, Palm, SitePin, SurveyMap, mapPoint } from "../L13-loudest-sound/props";
import { GlobeL13, GlobeRing, Rings, SITES } from "../L13-loudest-sound/sound";
import { Burst, Clock, Cross, bob, shake } from "./kit51";
import vo from "./vo.json";

/**
 * S51 - heavy guns, three thousand miles away (episodes/S51-phantom-guns). For L13, answered at 4:19. Vertical 1080x1920.
 * Numbers (sources.md, L13 rows): #1 27 Aug 1883, booms until 3 p.m., almost 3,000 miles (4,780 km); #13 about four hours;
 * #4 Perth ~3,000 km; #3 nearly 1/13 of the globe. What made the sound is withheld (no volcano is drawn or named).
 */
export const timeline = buildTimeline(vo as VoLine[]);

const DUSK = familyOf("dusk");
const VOID = familyOf("void");
const DAWN = ["#0F3B4F", "#1E6678", "#E3813F", "#F6B45A"];
const SEA = "#1F8F8A";
const MAP: MapBox = { x: 40, y: 280, w: 1000, h: 756 };
const SRC = mapPoint("indian", MAP, "krakatoa");
const ROD = mapPoint("indian", MAP, "rodriguez");
const arcPath = (a: [number, number], b: [number, number], lift = 150) => `M${a[0]} ${a[1]} Q${(a[0] + b[0]) / 2} ${Math.min(a[1], b[1]) - lift} ${b[0]} ${b[1]}`;
const ARC = arcPath(ROD, SRC);
const quad = (a: [number, number], b: [number, number], lift: number, t: number): [number, number] => {
  const c: [number, number] = [(a[0] + b[0]) / 2, Math.min(a[1], b[1]) - lift];
  const u = 1 - t;
  return [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]];
};

const Shore: React.FC<{ f: number; stops?: string[] }> = ({ f, stops = DAWN }) => (
  <g>
    <Sky stops={stops} x={0} y={0} w={W} h={H} />
    <Glow x={820} y={930} r={560} color={C.gold} f={f} strength={0.75} />
    <rect x={0} y={1040} width={W} height={900} fill={SEA} />
    <Chips f={f} n={12} y0={1060} y1={1250} color={C.foam} speed={5} opacity={0.45} seed={3} width={8} />
  </g>
);

/** a1 - Tick on the jetty, ears east, sound rings sweeping in from the right. */
const a1: Shot = ({ f }) => (
  <g>
    <Shore f={f} />
    <Palm x={90} y={1300} h={1000} f={f} sway={40} period={56} bend={0.4} seed={2} trunk="#6B4428" frond="#2F8F6E" frondDark="#1D5A4A" />
    <Jetty x={540} y={1200} w={900} family={DUSK} posts={7} postH={140} f={f} />
    <Rings f={f} cx={1500} cy={760} period={16} speed={14} maxR={1200} width={10} color={C.amber} arc={[150, 210]} glow={false} />
    <ListeningTick x={560} y={1200} pxPerM={380} frame={f} perk={Math.min(1, f / 14)} toward={1} />
    <Plaque x={540} y={190} text="LISTEN" size={110} bg={C.ink} fg={C.amber} scale={1 + 0.05 * Math.sin(f / 4)} />
  </g>
);

/** a2 - the guns Tick imagines: a big cannon fires, flash and recoil. */
const a2: Shot = ({ f }) => {
  const k = Math.max(0, 1 - f / 16);
  return (
    <g transform={shake(f, 0, 14, 16)}>
      <Sky stops={["#4B2A8C", "#E4572E", "#FFC83D"]} x={0} y={0} w={W} h={H} />
      <Chips f={f} n={12} y0={100} y1={1100} color={C.gold} speed={-12} opacity={0.5} seed={4} />
      <Burst x={820} y={760} r0={100 + 180 * (1 - k)} r1={260 + 220 * (1 - k)} color={C.amber} opacity={k} />
      <Cannon x={330} y={1180} s={260} family={DUSK} facing={1} recoil={k * 0.6} flash={k} />
      <rect x={0} y={1180} width={W} height={120} fill={C.brick} />
      <Plaque x={540} y={190} text="HEAVY GUNS" size={110} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** a3 - Tick close up, ears turning east, a "?" bobbing. */
const a3: Shot = ({ f }) => (
  <g>
    <Shore f={f} stops={["#1E6678", "#E3813F", "#F6B45A"]} />
    <Rings f={f} cx={1300} cy={800} period={14} speed={16} maxR={1300} width={12} color={C.amber} arc={[150, 210]} glow={false} />
    <ListeningTick x={500} y={1260} pxPerM={560} frame={f} perk={0.5 + 0.5 * Math.sin(f / 5)} toward={1} />
    <T x={800} y={420 + bob(f, 24, 18)} text="?" size={260} color={C.amber} />
  </g>
);

/** a4 - the thought bubble: a cannon recoiling every beat, far away. */
const a4: Shot = ({ f }) => {
  const k = Math.max(0, 1 - (f % 22) / 14);
  return (
    <g>
      <Shore f={f} stops={["#0F3B4F", "#1E6678", "#F6B45A"]} />
      <Jetty x={300} y={1230} w={640} family={DUSK} posts={5} postH={120} f={f} />
      <Tick x={250} y={1230} pxPerM={430} frame={f} pose="listen" expression="thinking" facing={1} />
      <circle cx={760} cy={560} r={330} fill={C.cream} stroke={C.ink} strokeWidth={12} />
      <circle cx={470} cy={900} r={36} fill={C.cream} stroke={C.ink} strokeWidth={10} />
      <circle cx={400} cy={1000} r={22} fill={C.cream} stroke={C.ink} strokeWidth={10} />
      <g transform="translate(560 640) scale(0.42)">
        <Cannon x={0} y={0} s={230} family={DUSK} facing={1} recoil={k * 0.5} flash={k} />
      </g>
    </g>
  );
};

/** b1 - a notebook, pages turning, the date stamped on it. */
const b1: Shot = ({ f }) => (
  <g>
    <Sky stops={["#E3813F", "#F6B45A", "#FFCF73"]} x={0} y={0} w={W} h={H} />
    <Chips f={f} n={10} y0={120} y1={1150} color={C.cream} speed={8} opacity={0.45} seed={6} />
    <Notebook x={540} y={760} w={920} h={600} turn={((f % 34) / 34) * 1.2} flutter={1} f={f} tilt={-6} />
    <Plaque x={540} y={250} text="27 AUGUST 1883" size={78} bg={C.ink} fg={C.amber} scale={ez(f, 0, 8)} />
    <Tick x={880} y={1240} pxPerM={330} frame={f} pose="hold" expression="determined" facing={-1} />
  </g>
);

/** b2 - the year counter rolls up to 1883. */
const b2: Shot = ({ f, n }) => {
  const v = 1883 * ez(f, 0, n - 6);
  return (
    <g>
      <Sky stops={["#4B2A8C", "#7C3FA8", "#E4572E"]} x={0} y={0} w={W} h={H} />
      <Chips f={f} n={12} y0={100} y1={1100} color={C.gold} speed={10} opacity={0.4} seed={8} />
      <rect x={90} y={380} width={900} height={560} rx={80} fill={C.ink} opacity={0.94} />
      <T x={540} y={790} text={`${Math.round(v)}`} size={300} color={C.amber} />
      <T x={540} y={900} text="AUGUST 27" size={84} color={C.cream} />
      <Tick x={900} y={1290} pxPerM={220} frame={f} pose="cheer" expression="surprised" facing={-1} />
    </g>
  );
};

/** c1 - a clock sweeps; a boom mark pops onto the timeline every few hours, last at 3 PM. */
const c1: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 2);
  return (
    <g>
      <Sky stops={["#1E6678", "#E3813F", "#F6B45A"]} x={0} y={0} w={W} h={H} />
      <Clock x={540} y={640} r={380} a={mix(0.1, 0.9, k)} />
      <rect x={90} y={1130} width={900} height={36} rx={18} fill={C.ink} />
      {[0, 1, 2, 3, 4].map((i) => {
        const on = k * 5 > i + 0.2;
        return <circle key={i} cx={150 + i * 195} cy={1148} r={on ? 40 + 6 * Math.sin(f / 3 + i) : 20} fill={on ? C.amber : C.mint} stroke={C.ink} strokeWidth={8} />;
      })}
      <T x={930} y={1090} text="3 PM" size={64} color={C.amber} />
    </g>
  );
};

/** c2 - Tick, ears up, a ring pulsing in at every boom; fingers counting. */
const c2: Shot = ({ f }) => (
  <g>
    <Shore f={f} stops={["#0F3B4F", "#E3813F", "#F6B45A"]} />
    <Rings f={f} cx={1250} cy={780} period={20} speed={18} maxR={1300} width={14} color={C.amber} arc={[150, 210]} glow={false} />
    <Tick x={420} y={1250} pxPerM={520} frame={f} pose="listen" expression="surprised" facing={1} tilt={4 * Math.sin(f / 5)} />
    <Plaque x={540} y={190} text="EVERY FEW HOURS" size={72} bg={C.ink} fg={C.amber} />
  </g>
);

/** d1 - the guns get a big NO GUNS cross. */
const d1: Shot = ({ f }) => (
  <g transform={shake(f, 8, 12, 14)}>
    <Sky stops={["#4B2A8C", "#7C3FA8", "#E4572E"]} x={0} y={0} w={W} h={H} />
    <Chips f={f} n={10} y0={100} y1={1100} color={C.gold} speed={9} opacity={0.4} seed={9} />
    <g transform="translate(0 40)">
      <Cannon x={300} y={1130} s={270} family={DUSK} facing={1} />
    </g>
    <Cross x={540} y={760} r={300} k={ez(f, 4, 14)} />
    <Plaque x={540} y={190} text="NO GUNS" size={130} bg={C.ink} fg={C.amber} scale={ez(f, 0, 8)} />
  </g>
);

const MapBase: React.FC<{ f: number; arc?: number; box?: MapBox }> = ({ f, arc = 1, box = MAP }) => {
  const a = mapPoint("indian", box, "rodriguez");
  const b = mapPoint("indian", box, "krakatoa");
  return (
    <g>
      <Sky stops={["#0A3C4C", "#11707A", "#1FA69A"]} x={0} y={0} w={W} h={H} />
      <SurveyMap view="indian" {...box} family={VOID} frame={f} schematic={false} sea="#1B8590" land="#D9A24E" />
      <path d={arcPath(a, b)} fill="none" stroke={C.amber} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={`${arc} 1`} opacity={0.95} />
      <SitePin x={a[0]} y={a[1]} kind="here" size={22} frame={f} />
      {arc > 0.97 ? <SitePin x={b[0]} y={b[1]} kind="source" size={22} frame={f} color={C.amber} /> : null}
    </g>
  );
};

/** d2 - pull out to the Indian Ocean: a dashed arc sweeps east from the island to the unknown dot. */
const d2: Shot = ({ f, n }) => (
  <g>
    <MapBase f={f} arc={ez(f, 2, n - 3)} />
    <T x={540} y={190} text="THE ISLAND  ->  ???" size={72} color={C.amber} />
    <Tick x={230} y={1260} pxPerM={330} frame={f} pose="point" expression="worried" facing={1} />
  </g>
);

/** d3 - the distance counter rolls up to almost 3,000 miles. */
const d3: Shot = ({ f, n }) => {
  const v = 3000 * ez(f, 0, n - 6);
  const box: MapBox = { x: 40, y: 830, w: 1000, h: 340 };
  return (
    <g>
      <MapBase f={f} box={box} arc={1} />
      <rect x={90} y={200} width={900} height={560} rx={80} fill={C.ink} opacity={0.92} />
      <T x={540} y={330} text="ALMOST" size={84} color={C.cream} />
      <Counter x={540} y={590} value={v} max={3000} size={250} color={C.amber} align="middle" digits={4} />
      <T x={540} y={710} text="MILES AWAY" size={80} color={C.cream} />
    </g>
  );
};

/** e1 - 4,800 km: a big counter over the glowing arc. */
const e1: Shot = ({ f, n }) => {
  const v = 4800 * ez(f, 0, n - 6);
  return (
    <g>
      <MapBase f={f} arc={1} />
      <rect x={90} y={1090} width={900} height={190} rx={60} fill={C.ink} opacity={0.94} />
      <Counter x={430} y={1230} value={v} max={4800} size={130} color={C.amber} align="middle" digits={4} />
      <T x={800} y={1220} text="KM" size={90} color={C.cream} />
    </g>
  );
};

/** e2 - a sound ring races east along the arc while a small clock turns. */
const e2: Shot = ({ f, n }) => {
  const t = ez(f, 0, n - 2);
  const p = quad(ROD, SRC, 150, t);
  return (
    <g>
      <MapBase f={f} arc={1} />
      <Rings f={f} cx={p[0]} cy={p[1]} period={10} speed={9} maxR={200} width={9} color={C.foam} glow={false} />
      <circle cx={p[0]} cy={p[1]} r={26} fill={C.cream} stroke={C.ink} strokeWidth={8} />
      <Clock x={200} y={1120} r={120} a={t / 3} />
      <T x={640} y={1140} text="HOURS PASS" size={70} color={C.cream} />
    </g>
  );
};

/** e3 - the clock stops on about four hours; Tick stares. */
const e3: Shot = ({ f, n }) => (
  <g>
    <Sky stops={["#0F3B4F", "#1E6678", "#E3813F"]} x={0} y={0} w={W} h={H} />
    <Clock x={540} y={640} r={380} a={mix(0, 1 / 3, ez(f, 0, n - 8))} />
    <Plaque x={500} y={1030} text="ABOUT 4 HOURS" size={72} bg={C.ink} fg={C.amber} scale={ez(f, 6, 14)} />
    <Tick x={930} y={1290} pxPerM={200} frame={f} pose="point" expression="surprised" facing={-1} />
  </g>
);

/** Zoomed map for the Perth beats: Perth at (700, 1000), the source up and left. */
const ZB: MapBox = { x: -1033, y: -278, w: 2000, h: 1500 };
const PERTH = mapPoint("indian", ZB, "perth");
const ZSRC = mapPoint("indian", ZB, "krakatoa");
const ZoomMap: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <Sky stops={["#0A3C4C", "#11707A", "#1FA69A"]} x={0} y={0} w={W} h={H} />
    <SurveyMap view="indian" {...ZB} family={VOID} frame={f} schematic={false} sea="#1B8590" land="#D9A24E" />
  </g>
);

/** f1 - Perth, a pin pulsing. */
const f1: Shot = ({ f }) => (
  <g>
    <ZoomMap f={f} />
    <SitePin x={PERTH[0]} y={PERTH[1]} kind="plain" size={30} frame={f} color={C.verm} />
    <Rings f={f} cx={ZSRC[0]} cy={ZSRC[1]} period={18} speed={12} maxR={900} width={10} color={C.amber} glow={false} />
    <Plaque x={540} y={190} text="PERTH" size={130} bg={C.ink} fg={C.amber} scale={ez(f, 0, 8)} />
  </g>
);

/** f2 - the ring reaches Perth, the pin jumps. */
const f2: Shot = ({ f }) => {
  const hit = f > 12 ? Math.max(0, 1 - (f - 12) / 12) : 0;
  return (
    <g>
      <ZoomMap f={f} />
      <Rings f={f} cx={ZSRC[0]} cy={ZSRC[1]} period={14} speed={16} maxR={1000} width={12} color={C.amber} glow={false} />
      <g transform={`translate(0 ${-50 * hit})`}>
        <SitePin x={PERTH[0]} y={PERTH[1]} kind="plain" size={30} frame={f} color={C.verm} />
      </g>
      <Burst x={PERTH[0]} y={PERTH[1] - 70} r0={50} r1={50 + 130 * (1 - hit)} color={C.amber} opacity={hit} />
      <T x={540} y={260} text="~3,000 KM" size={110} color={C.amber} />
    </g>
  );
};

/** f3 - Tick on the Perth coast, ears turned north-west. */
const f3: Shot = ({ f }) => (
  <g>
    <ZoomMap f={f} />
    <Rings f={f} cx={ZSRC[0]} cy={ZSRC[1]} period={14} speed={16} maxR={1100} width={12} color={C.amber} glow={false} />
    <rect x={0} y={1180} width={W} height={200} fill="#D9A24E" />
    <ListeningTick x={620} y={1260} pxPerM={430} frame={f} perk={0.5 + 0.5 * Math.sin(f / 6)} toward={-1} />
    <Plaque x={540} y={190} text="THEY HEARD IT TOO" size={70} bg={C.ink} fg={C.amber} />
  </g>
);

const G = { cx: 540, cy: 760, R: 430, tilt: 18 };
const CAP = 0.562; // angular radius of a cap that is 1/13 of the sphere: cos d = 1 - 2/13
const GlobeScene: React.FC<{ f: number; rot: number; d: number; extra?: React.ReactNode }> = ({ f, rot, d, extra }) => (
  <g>
    <Sky stops={["#03171D", "#062A33", "#0B4249"]} x={0} y={0} w={W} h={H} />
    <Chips f={f} n={10} y0={100} y1={1200} color={C.foam} speed={4} opacity={0.2} seed={12} />
    <GlobeL13 {...G} rot={rot} family={VOID} schematic={false}>
      {[1, 0.78, 0.56, 0.34].map((s, i) => (
        <GlobeRing key={i} globe={{ ...G, rot }} src={SITES.krakatoa} d={Math.max(0.02, d * s)} color={C.amber} width={i === 0 ? 14 : 7} opacity={i === 0 ? 1 : 0.55} />
      ))}
    </GlobeL13>
    {extra}
  </g>
);

/** g1 - the globe; a heard-area spreads from the source. */
const g1: Shot = ({ f, n }) => <GlobeScene f={f} rot={105 - f * 0.4} d={CAP * ez(f, 0, n - 2)} />;

/** g2 - the fraction stamps on. */
const g2: Shot = ({ f }) => (
  <GlobeScene f={f} rot={100 - f * 0.4} d={CAP} extra={<Plaque x={540} y={1090} text="1/13" size={200} bg={C.ink} fg={C.amber} w={620} scale={ez(f, 0, 8)} />} />
);

/** g3 - the globe turns with the area pulsing; Tick on top. */
const g3: Shot = ({ f }) => (
  <GlobeScene f={f} rot={95 - f * 1.2} d={CAP * (1 + 0.04 * Math.sin(f / 3))} extra={<Tick x={300} y={500} pxPerM={190} frame={f} pose="cheer" expression="surprised" facing={1} tilt={-14} />} />
);

/** g4 - the edge of the area stretches round the curve. */
const g4: Shot = ({ f }) => (
  <GlobeScene f={f} rot={70 - f * 1.4} d={CAP * (1 + 0.06 * Math.sin(f / 4))} extra={<T x={540} y={1160} text="NEARLY A THIRTEENTH" size={76} color={C.amber} />} />
);

/** h1 - the question over the glowing source. */
const h1: Shot = ({ f }) => (
  <g>
    <Sky stops={["#0A3C4C", "#11707A", "#1FA69A"]} x={0} y={0} w={W} h={H} />
    <Glow x={540} y={820} r={800} color={C.gold} f={f} strength={0.7} />
    <Rings f={f} cx={540} cy={900} period={18} speed={14} maxR={1000} width={12} color={C.amber} glow={false} />
    <circle cx={540} cy={900} r={46 + 6 * Math.sin(f / 4)} fill={C.amber} stroke={C.ink} strokeWidth={10} />
    <Qmark f={f} x={540} y={800} size={760} />
    <Plaque x={540} y={190} text="WHAT MADE IT?" size={96} bg={C.ink} fg={C.amber} />
  </g>
);

const h2: Shot = ({ f }) => <EndShot f={f} stops={["#0A3C4C", "#11707A", "#1FA69A"]} q={["WHAT MADE", "THE SOUND?"]} />;

export const ShortS51 = makeShort(timeline, [[a1, a2, a3, a4], [b1, b2], [c1, c2], [d1, d2, d3], [e1, e2, e3], [f1, f2, f3], [g1, g2, g3, g4], [h1, h2]]);
