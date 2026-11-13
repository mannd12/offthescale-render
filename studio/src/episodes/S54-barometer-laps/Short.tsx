import React from "react";
import { Counter, Sky, Tick } from "../../lib/illustrated";
import { buildTimeline, VoLine } from "../../lib/timeline";
import { C, Chips, EndShot, Glow, Plaque, T, W, H, Shot, ez, makeShort, mix, ramp } from "../S41-dig-plate/vkit";
import { Burst, Clock, bob, shake } from "../S51-phantom-guns/kit51";
import { familyOf } from "../L13-loudest-sound/families";
import { Barograph, GlobeL13, GlobeRing, PassageCounter, Rings, SITES, Strip, passageBlips, passageRing } from "../L13-loudest-sound/sound";
import vo from "./vo.json";

/**
 * S54 - a wave round the Earth three and a half times (episodes/S54-barometer-laps). For L13, answered at 6:38. Vertical 1080x1920.
 * Numbers (sources.md, L13 rows): #6 not fewer than seven passages at many stations (4 out, 3 back), a lap about 36 h,
 * about five days, 3.5 laps, 674-726 mph (shown as the spoken ~670-730); #7 every recording barograph recorded it.
 * The 2022 twin (Hunga) and the 1883 volcano's name are withheld.
 */
export const timeline = buildTimeline(vo as VoLine[]);

const DUSK = familyOf("dusk");
const VOID = familyOf("void");
const SPACE = ["#03171D", "#062A33", "#0B4249"];
const SAFF = "#E0A93A";
const BONE = "#E6F5EA";
const Bg: React.FC<{ stops?: string[] }> = ({ stops = SPACE }) => <Sky stops={stops} x={0} y={0} w={W} h={H} />;

/** a1 - a brass barograph, paper scrolling, the pen steady; Tick leans in. */
const a1: Shot = ({ f }) => (
  <g>
    <Bg stops={["#0F3B4F", "#1E6678", "#F6B45A"]} />
    <Barograph f={f} x={200} y={380} w={680} h={280} speed={6} spikes={[]} scale={150} family={DUSK} start={-400} />
    <Tick x={540} y={1290} pxPerM={300} frame={f} pose="point" expression="thinking" facing={1} look={0.5} />
    <Plaque x={540} y={190} text="PENS ON PAPER" size={100} bg={C.ink} fg={C.amber} />
  </g>
);

/** a2 - smash-zoom on the pen as a spike jumps. */
const a2: Shot = ({ f, n }) => {
  const s = mix(1, 2.3, ez(f, 0, n - 4));
  return (
    <g>
      <Bg stops={["#0F3B4F", "#1E6678", "#F6B45A"]} />
      <g transform={`translate(760 740) scale(${s}) translate(-760 -740)`}>
        <Barograph f={f} x={200} y={640} w={680} h={300} speed={8} spikes={[{ at: 10, h: 1 }, { at: 18, h: 0.5 }]} scale={220} family={DUSK} start={-400} />
      </g>
      <Burst x={760} y={740} r0={90} r1={150} color={SAFF} n={12} width={10} opacity={ramp(f, 8, 12) * (1 - ramp(f, 16, 24))} />
    </g>
  );
};

/** a3 - paper spools out in a long curl; Tick pulls it. */
const a3: Shot = ({ f }) => (
  <g>
    <Bg stops={["#0F3B4F", "#1E6678", "#F6B45A"]} />
    <path d={`M540 -40 C ${300 + 60 * Math.sin(f / 5)} 300, ${800 - 60 * Math.sin(f / 6)} 600, 540 ${900 + 40 * Math.sin(f / 4)} S 300 1100 ${400 + 80 * Math.sin(f / 7)} 1200`} stroke="#F7EBCF" strokeWidth={180} fill="none" strokeLinecap="butt" />
    <path d={`M540 -40 C ${300 + 60 * Math.sin(f / 5)} 300, ${800 - 60 * Math.sin(f / 6)} 600, 540 ${900 + 40 * Math.sin(f / 4)} S 300 1100 ${400 + 80 * Math.sin(f / 7)} 1200`} stroke={C.ink} strokeWidth={10} fill="none" strokeDasharray="8 90" strokeDashoffset={-f * 14} />
    <Tick x={820} y={1250} pxPerM={400} frame={f} pose="heave" expression="determined" facing={-1} />
  </g>
);

const Stations: React.FC<{ f: number; src: [number, number]; r: number }> = ({ f, src, r }) => (
  <g>
    {Array.from({ length: 5 }, (_, row) =>
      Array.from({ length: 4 }, (_, col) => {
        const x = 150 + col * 260 + (row % 2) * 70;
        const y = 560 + row * 140;
        const d = Math.hypot(x - src[0], y - src[1]);
        const hit = r > d;
        const pop = hit ? Math.max(0, 1 - (r - d) / 160) : 0;
        return <circle key={`${row}-${col}`} cx={x} cy={y - 40 * pop} r={hit ? 30 + 18 * pop : 20} fill={hit ? SAFF : C.mint} stroke={C.ink} strokeWidth={8} />;
      }),
    )}
  </g>
);

/** b1 - a flash on a far corner; a ring races out across a field of stations lighting up. */
const b1: Shot = ({ f }) => {
  const src: [number, number] = [90, 420];
  return (
    <g>
      <Bg />
      <Chips f={f} n={10} y0={100} y1={1200} color={C.mint} speed={4} opacity={0.2} seed={2} />
      <Rings f={f} cx={src[0]} cy={src[1]} period={26} speed={22} maxR={1700} width={14} color={SAFF} glow={false} />
      <Stations f={f} src={src} r={f * 22} />
      <Glow x={src[0]} y={src[1]} r={240} color={C.gold} f={f} strength={0.9} period={10} />
      <Plaque x={540} y={190} text="ONE HUGE EXPLOSION" size={72} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** b2 - four recording strips, each pen jumping in turn. */
const b2: Shot = ({ f }) => (
  <g>
    <Bg stops={["#0F3B4F", "#1E6678", "#1FA69A"]} />
    {[0, 1, 2, 3].map((i) => (
      <Strip key={i} f={f} x={90} y={300 + i * 230} w={900} h={150} speed={7} spikes={[{ at: 10 + i * 7, h: 0.85 }]} scale={110} start={-300} />
    ))}
    <Tick x={540} y={1270} pxPerM={330} frame={f} pose="cheer" expression="surprised" facing={1} />
  </g>
);

const G = { cx: 540, cy: 760, R: 430, tilt: 18 };
const GlobeScene: React.FC<{ f: number; rot: number; rings?: { d: number; color: string }[]; children?: React.ReactNode; extra?: React.ReactNode }> = ({ f, rot, rings = [], children, extra }) => (
  <g>
    <Bg />
    <Chips f={f} n={10} y0={100} y1={1200} color={C.foam} speed={4} opacity={0.18} seed={12} />
    <GlobeL13 {...G} rot={rot} family={VOID} schematic={false}>
      {rings.map((r, i) => (
        <GlobeRing key={i} globe={{ ...G, rot }} src={SITES.krakatoa} d={r.d} color={r.color} width={14} />
      ))}
      {children}
    </GlobeL13>
    {extra}
  </g>
);

/** c1 - the globe turns; the ring leaves the source and sweeps toward the far side. */
const c1: Shot = ({ f, n }) => {
  const p = passageRing(ez(f, 0, n) * 1);
  return <GlobeScene f={f} rot={105 - f * 1.4} rings={[{ d: p.d, color: p.color }]} extra={<T x={540} y={1250} text="OUT" size={110} color={SAFF} />} />;
};

/** c2 - the ring converges on the far side; Tick braces. */
const c2: Shot = ({ f, n }) => {
  const p = passageRing(1 + ez(f, 0, n));
  return (
    <GlobeScene f={f} rot={-75} rings={[{ d: p.d, color: p.color }]} extra={<Tick x={540} y={640} pxPerM={210} frame={f} pose="shield" expression="scared" facing={1} />} />
  );
};

/** c3 - a second spike lands on the strip as the returning ring arrives. */
const c3: Shot = ({ f }) => (
  <g>
    <Bg stops={["#0F3B4F", "#1E6678", "#1FA69A"]} />
    <Strip f={f} x={40} y={620} w={1000} h={420} speed={16} spikes={[{ at: 2, h: 0.9 }, { at: 22, h: 0.9 }]} scale={330} start={-300} paper="#F7EBCF" />
    <Plaque x={540} y={1230} text="AGAIN" size={150} bg={C.ink} fg={C.amber} scale={ez(f, 18, 26)} />
    <Plaque x={540} y={260} text="FROM THE OTHER WAY" size={68} bg={C.ink} fg={C.cream} />
  </g>
);

/** d1 - blips fill a strip one by one; the counter rolls 1 to 7. */
const d1: Shot = ({ f }) => {
  const count = Math.max(0, Math.min(7, Math.floor((f - 4) / 5) + 1));
  return (
    <g>
      <Bg stops={["#0F3B4F", "#1E6678", "#1FA69A"]} />
      <Strip f={f} x={40} y={700} w={1000} h={380} speed={9} spikes={passageBlips(4, 5, 7, 0.9)} scale={290} start={-300} />
      <Counter x={540} y={500} value={count} max={7} size={260} color={C.amber} align="middle" digits={1} />
    </g>
  );
};

/** d2 - the counter slams on 7 with a flash. */
const d2: Shot = ({ f }) => (
  <g transform={shake(f, 0, 12, 14)}>
    <Bg stops={["#4B2A8C", "#E4572E", "#FFC83D"]} />
    <Burst x={540} y={700} r0={320} r1={520} n={18} color={C.amber} width={20} rot={f * 3} opacity={0.9} />
    <T x={540} y={900} text="7" size={720} color={C.amber} />
    <Plaque x={540} y={190} text="AT LEAST SEVEN" size={96} bg={C.ink} fg={C.cream} />
    <Tick x={150} y={1270} pxPerM={330} frame={f} pose="cheer" expression="happy" facing={1} />
  </g>
);

/** e1 - four saffron rings go out. */
const e1: Shot = ({ f, n }) => {
  const p = passageRing(ez(f, 0, n) * 4);
  return (
    <GlobeScene f={f} rot={105 - f * 0.8} rings={[{ d: p.d, color: p.color }]} extra={<PassageCounter x={540} y={1180} n={Math.floor(ez(f, 0, n) * 4 - 0.01) + 1} family={VOID} label="OUT" size={150} color={SAFF} />} />
  );
};

/** e2 - three bone rings come back from the other side. */
const e2: Shot = ({ f, n }) => {
  const p = passageRing(4 + ez(f, 0, n) * 3);
  return (
    <GlobeScene f={f} rot={-75 + f * 0.8} rings={[{ d: p.d, color: p.color }]} extra={<PassageCounter x={540} y={1180} n={Math.floor(ez(f, 0, n) * 3 - 0.01) + 1} family={VOID} label="BACK" size={150} color={BONE} />} />
  );
};

/** e3 - the tally: four out, three back; Tick counts. */
const e3: Shot = ({ f, n }) => (
  <g>
    <Bg />
    {Array.from({ length: 7 }, (_, i) => {
      const on = ramp(f, 3 + i * 4, 7 + i * 4);
      return <rect key={i} x={80 + i * 135} y={900 - 360 * on} width={100} height={360 * on} rx={30} fill={i < 4 ? SAFF : BONE} stroke={C.ink} strokeWidth={8} />;
    })}
    <T x={310} y={420} text="4 OUT" size={110} color={SAFF} />
    <T x={780} y={420} text="3 BACK" size={110} color={BONE} />
    <Tick x={540} y={1290} pxPerM={240} frame={f} pose="point" expression="determined" facing={1} tilt={bob(f, 14, 3)} />
  </g>
);

/** f1 - a clock sweeps around a small globe: one lap. */
const f1: Shot = ({ f, n }) => {
  const k = ez(f, 0, n);
  const p = passageRing(k);
  return <GlobeScene f={f} rot={105 - f * 1.2} rings={[{ d: p.d, color: p.color }]} extra={<Clock x={850} y={1230} r={130} a={k} />} />;
};

/** f2 - 36 hours, rolling. */
const f2: Shot = ({ f, n }) => (
  <g>
    <Bg stops={["#4B2A8C", "#7C3FA8", "#E4572E"]} />
    <rect x={90} y={380} width={900} height={560} rx={80} fill={C.ink} opacity={0.94} />
    <Counter x={540} y={760} value={36 * ez(f, 0, n - 6)} max={36} size={320} color={C.amber} align="middle" digits={2} />
    <T x={540} y={880} text="HOURS PER LAP" size={86} color={C.cream} />
    <Clock x={880} y={1200} r={120} a={ez(f, 0, n)} />
  </g>
);

/** g1 - a strip of five days, seven ticks dropping in. */
const g1: Shot = ({ f }) => (
  <g>
    <Bg stops={["#0F3B4F", "#1E6678", "#1FA69A"]} />
    {[0, 1, 2, 3, 4].map((i) => (
      <g key={i}>
        <rect x={50 + i * 195} y={560} width={175} height={300} rx={30} fill={C.cream} stroke={C.ink} strokeWidth={8} />
        <rect x={50 + i * 195} y={560} width={175} height={70} rx={30} fill={C.verm} />
        <T x={137 + i * 195} y={800} text={`${i + 1}`} size={130} color={C.ink} halo={C.cream} />
      </g>
    ))}
    {Array.from({ length: 7 }, (_, i) => {
      const on = ramp(f, i * 3, i * 3 + 5);
      return <circle key={i} cx={110 + i * 140} cy={mix(300, 960, on)} r={34} fill={i < 4 ? SAFF : BONE} stroke={C.ink} strokeWidth={8} opacity={on > 0 ? 1 : 0} />;
    })}
    <Plaque x={540} y={190} text="ABOUT FIVE DAYS" size={92} bg={C.ink} fg={C.amber} />
    <Tick x={930} y={1290} pxPerM={200} frame={f} pose="point" expression="happy" facing={-1} />
  </g>
);

/** g2 - a spiral of laps wraps round the globe. */
const g2: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 2);
  const pts = Array.from({ length: 160 }, (_, i) => {
    const t = (i / 159) * 3.5 * k;
    const r = 120 + t * 80;
    return `${i ? "L" : "M"}${540 + Math.cos(t * Math.PI * 2 - Math.PI / 2) * r} ${700 + Math.sin(t * Math.PI * 2 - Math.PI / 2) * r}`;
  }).join(" ");
  return (
    <g>
      <Bg />
      <circle cx={540} cy={700} r={110} fill="#1F8F8A" stroke={C.cream} strokeWidth={8} />
      <path d={pts} stroke={SAFF} strokeWidth={22} fill="none" strokeLinecap="round" />
      <Tick x={880} y={1270} pxPerM={330} frame={f} pose="point" expression="surprised" facing={-1} />
    </g>
  );
};

/** g3 - the big 3½. */
const g3: Shot = ({ f }) => (
  <g>
    <Bg stops={["#4B2A8C", "#E4572E", "#FFC83D"]} />
    <Burst x={540} y={700} r0={360} r1={520} n={16} color={C.amber} width={18} rot={f * 2} opacity={0.8} />
    <T x={540} y={880} text="3½" size={560} color={C.amber} />
    <T x={540} y={1060} text="TIMES ROUND THE EARTH" size={62} color={C.cream} />
  </g>
);

/** h1 - a speedometer sweeps. */
const h1: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 4);
  const a = mix(-120, 100, k) * (Math.PI / 180);
  return (
    <g>
      <Bg stops={["#0F3B4F", "#1E6678", "#F6B45A"]} />
      <circle cx={540} cy={700} r={400} fill={C.ink} stroke={C.cream} strokeWidth={14} />
      {Array.from({ length: 12 }, (_, i) => {
        const t = ((mix(-120, 100, i / 11) * Math.PI) / 180) - Math.PI / 2;
        return <path key={i} d={`M${540 + Math.cos(t) * 330} ${700 + Math.sin(t) * 330} L${540 + Math.cos(t) * 380} ${700 + Math.sin(t) * 380}`} stroke={C.cream} strokeWidth={12} strokeLinecap="round" />;
      })}
      <path d={`M540 700 L${540 + Math.sin(a) * 320} ${700 - Math.cos(a) * 320}`} stroke={C.verm} strokeWidth={22} strokeLinecap="round" />
      <circle cx={540} cy={700} r={34} fill={C.amber} />
      <T x={540} y={1000} text="MILES AN HOUR" size={60} color={C.cream} />
    </g>
  );
};

/** h2 - the range lands: ~670-730 MPH. */
const h2: Shot = ({ f }) => (
  <g transform={shake(f, 0, 10, 12)}>
    <Bg stops={["#4B2A8C", "#E4572E", "#FFC83D"]} />
    <Chips f={f} n={16} y0={100} y1={1200} color={C.gold} speed={26} opacity={0.5} seed={3} len={300} />
    <rect x={50} y={420} width={980} height={440} rx={80} fill={C.ink} opacity={0.94} />
    <T x={540} y={680} text="670-730" size={220} color={C.amber} />
    <T x={540} y={800} text="MPH" size={100} color={C.cream} />
    <Tick x={900} y={1290} pxPerM={230} frame={f} pose="cheer" expression="surprised" facing={-1} />
  </g>
);

/** i1 - 2022 stamped over the globe, two tallies side by side, the second blank. */
const i1: Shot = ({ f }) => (
  <GlobeScene
    f={f}
    rot={105 - f * 0.9}
    rings={[{ d: passageRing(((f / 40) % 1) * 1).d, color: SAFF }]}
    extra={
      <g>
        <Plaque x={540} y={250} text="2022" size={200} bg={C.ink} fg={C.amber} w={520} scale={ez(f, 0, 8)} />
        <T x={540} y={1210} text="4 OUT + 3 BACK" size={80} color={C.cream} />
        <T x={540} y={1330} text="AGAIN?" size={90} color={C.amber} />
      </g>
    }
  />
);

const i2: Shot = ({ f }) => <EndShot f={f} stops={["#03171D", "#0B4249", "#1FA69A"]} q={["2022: WHAT", "MADE IT?"]} />;

export const ShortS54 = makeShort(timeline, [[a1, a2, a3], [b1, b2], [c1, c2, c3], [d1, d2], [e1, e2, e3], [f1, f2], [g1, g2, g3], [h1, h2], [i1, i2]]);
