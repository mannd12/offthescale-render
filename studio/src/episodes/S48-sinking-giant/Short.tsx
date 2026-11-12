import React from "react";
import { Bubbles, Caustics, CloudRack, Counter, Sky, Streamers, Tick, seaSurface } from "../../lib/illustrated";
import { buildTimeline, VoLine } from "../../lib/timeline";
import { C, Chips, EndShot, Glow, Plaque, T, W, H, Shot, ez, makeShort, mix, ramp } from "../S41-dig-plate/vkit";
import { Peak, Qmark, Ruler } from "../S46-peak-seafloor/kit46";
import vo from "./vo.json";

/**
 * S48 - Mauna Kea, taller than Everest and sinking (episodes/S48-sinking-giant). For L12, answered at 4:24. Vertical
 * 1080x1920. Numbers (sources.md, L12 #13/#14): 4,205 m above sea, ~6,000 m below, total ~10,211 m, over a kilometre
 * more than Everest (#1: 8,849 m); Hilo sinking ~2.5 mm/yr; deepest drowned reef ~1,335 m. Scale in the cross-sections:
 * S px per metre (true to the numbers; the sinking shot is labelled EXAGGERATED). How it grows and why it sinks: withheld.
 */
export const timeline = buildTimeline(vo as VoLine[]);

const FONT = "'Outfit', sans-serif";
const S = 0.085; // px per metre in the cross-sections
const SEA_STOPS = ["#2A8FC4", "#1B6FA8", "#0A3C4C"];

const Shield: React.FC<{ x: number; y: number; w: number; h: number; fill?: string; shade?: string }> = ({ x, y, w, h, fill = "#7A3418", shade = "#4A140C" }) => {
  const d = `M${x - w / 2} ${y} C${x - w * 0.3} ${y - h * 0.1} ${x - w * 0.12} ${y - h * 0.75} ${x - w * 0.03} ${y - h * 0.97} Q${x} ${y - h * 1.01} ${x + w * 0.03} ${y - h * 0.97} C${x + w * 0.12} ${y - h * 0.75} ${x + w * 0.3} ${y - h * 0.1} ${x + w / 2} ${y} Z`;
  return (
    <g>
      <path d={d} fill={fill} stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
      <path d={`M${x + w * 0.03} ${y - h * 0.97} C${x + w * 0.12} ${y - h * 0.75} ${x + w * 0.3} ${y - h * 0.1} ${x + w / 2} ${y} L${x + w * 0.1} ${y} Z`} fill={shade} opacity={0.6} />
    </g>
  );
};

/** Sky above + ocean below `seaY`; surface waves move. */
const Ocean: React.FC<{ f: number; seaY: number; floorY?: number }> = ({ f, seaY, floorY }) => (
  <g>
    <Sky stops={["#4FB5DE", "#9BD6E8"]} x={0} y={0} w={W} h={Math.max(0, seaY + 30)} />
    <Sky stops={SEA_STOPS} x={0} y={seaY} w={W} h={H - seaY} />
    <Caustics f={f} x={0} y={seaY} w={W} h={Math.max(100, (floorY ?? 1250) - seaY)} rows={6} color={C.foam} width={9} opacity={0.22} speed={3} />
    <path d={seaSurface(f * 2.2, -40, 1120, seaY, 10, 240, 2, seaY + 50, 30)} fill="#7FD0E8" />
  </g>
);

/** a - the shield rises through the sea with Tick on the peak. */
const a: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 6);
  const seaY = 640;
  const floor = seaY + 6006 * S;
  const hh = 10211 * S * k;
  return (
    <g>
      <Ocean f={f} seaY={seaY} />
      <CloudRack f={f} n={3} x0={-400} x1={1500} y0={120} y1={440} size={100} speed={5} body={C.cream} under={C.ice} top="#FFFFFF" seed={2} />
      <Shield x={540} y={floor} w={1700} h={hh} />
      <rect x={0} y={seaY} width={W} height={floor - seaY} fill="#2A8FC4" opacity={0.28} />
      <Tick x={540} y={floor - hh + 14} pxPerM={170} frame={f} pose="cheer" expression="happy" facing={1} />
      <Plaque x={540} y={1160} text="TALLER THAN EVEREST" size={64} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** b - base to top beside Everest: more than a kilometre taller. */
const b: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 8);
  const base = 1130;
  return (
    <g>
      <Sky stops={["#1B6FA8", "#2A8FC4", "#4FB5DE"]} x={0} y={0} w={W} h={H} />
      <Chips f={f} n={10} y0={100} y1={1000} color={C.foam} speed={8} opacity={0.4} seed={4} />
      <Shield x={400} y={base} w={800} h={10211 * S * k} />
      <Peak x={830} y={base} w={400} h={8849 * S * k} body={C.orange} shade={C.rust} />
      <rect x={0} y={base} width={W} height={200} fill={C.deep} />
      <path d={`M80 ${base - 8849 * S} H${920}`} stroke={C.cream} strokeWidth={6} strokeDasharray="22 14" strokeDashoffset={-f * 3} opacity={ramp(f, 14, 20)} />
      <Plaque x={400} y={base + 70} text="MAUNA KEA" size={50} bg={C.ink} fg={C.cream} />
      <Plaque x={830} y={base + 70} text="EVEREST" size={50} bg={C.ink} fg={C.cream} />
      <Plaque x={540} y={190} text="OVER 1 KM TALLER" size={86} bg={C.ink} fg={C.amber} opacity={ramp(f, 16, 24)} />
    </g>
  );
};

/** c - Mauna Kea, Hawaii: the island tip with Tick climbing. */
const c: Shot = ({ f }) => {
  const seaY = 700;
  const floor = seaY + 6006 * S;
  const climb = ez(f, 0, 50);
  return (
    <g>
      <Ocean f={f} seaY={seaY} />
      <CloudRack f={f} n={3} x0={-400} x1={1500} y0={100} y1={420} size={100} speed={5} body={C.cream} under={C.ice} top="#FFFFFF" seed={3} />
      <Shield x={540} y={floor} w={1700} h={10211 * S} />
      <rect x={0} y={seaY} width={W} height={floor - seaY} fill="#2A8FC4" opacity={0.28} />
      <Tick x={mix(250, 540, climb)} y={mix(seaY - 20, floor - 10211 * S + 14, climb)} pxPerM={170} frame={f} pose="point" expression="happy" facing={1} walk={f / 14} />
      <Plaque x={540} y={190} text="MAUNA KEA" size={120} bg={C.ink} fg={C.amber} />
      <Plaque x={540} y={1090} text="HAWAII" size={80} bg={C.ink} fg={C.cream} />
    </g>
  );
};

/** d - the summit gauge counts up to 4,205 m above the sea. */
const d: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 6);
  const seaY = 1000;
  return (
    <g>
      <Ocean f={f} seaY={seaY} />
      <Ruler f={f} x={110} y0={100} y1={seaY - 20} speed={4} step={90} />
      <Shield x={640} y={seaY + 520} w={1500} h={4205 * S + 520} />
      <path d={`M150 ${seaY} V${seaY - 4205 * S * k} M120 ${seaY - 4205 * S * k} H190`} stroke={C.cream} strokeWidth={10} fill="none" strokeLinecap="round" />
      <rect x={260} y={190} width={640} height={220} rx={46} fill={C.ink} opacity={0.94} />
      <Counter x={510} y={350} value={4205 * k} max={4205} size={120} color={C.amber} align="middle" />
      <text x={760} y={350} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64, fill: C.cream }}>
        m
      </text>
    </g>
  );
};

/** e - on the summit, clouds below, "only". */
const e: Shot = ({ f }) => (
  <g>
    <Sky stops={["#1B6FA8", "#4FB5DE", "#E6F8FF"]} x={0} y={0} w={W} h={H} />
    <CloudRack f={f} n={5} x0={-400} x1={1500} y0={780} y1={1180} size={150} speed={7} body={C.cream} under={C.ice} top="#FFFFFF" seed={6} />
    <Shield x={540} y={1500} w={2200} h={560} />
    <Tick x={540} y={960} pxPerM={300} frame={f} pose="cheer" expression="happy" facing={1} />
    <Plaque x={540} y={190} text="ONLY 4,205 M ABOVE SEA" size={64} bg={C.ink} fg={C.amber} />
    <Streamers f={f} n={6} x0={-300} x1={1400} y0={250} y1={700} len={380} width={18} speed={6} color={C.foam} opacity={0.5} slope={0.02} seed={5} />
  </g>
);

/** f - the camera dives down the flank: sea level rushes up, depth counter rolls. */
const f_: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 4);
  const sy = mix(300, -1500, k);
  return (
    <g>
      <Sky stops={["#2A8FC4", "#1B6FA8", "#0A3C4C", "#06222B"]} x={0} y={0} w={W} h={H} />
      <rect x={0} y={sy - 40} width={W} height={50} fill="#7FD0E8" />
      <Ruler f={f} x={80} y0={80} y1={1230} speed={-24} step={110} />
      <Ruler f={f} x={880} y0={80} y1={1230} speed={-24} step={110} />
      <Shield x={540} y={mix(2200, 2200, k)} w={1900} h={2100} fill="#7A3418" shade="#4A140C" />
      <Bubbles frame={f} x0={80} x1={1000} y={1200} n={22} color={C.foam} seed={4} rise={4} size={10} />
      <Tick x={760} y={mix(500, 760, k)} pxPerM={200} frame={f} pose="stand" expression="surprised" facing={-1} tilt={-8} />
      <rect x={110} y={250} width={620} height={210} rx={44} fill={C.ink} opacity={0.94} />
      <Counter x={330} y={400} value={6000 * k} max={6000} size={110} color={C.amber} align="middle" />
      <text x={560} y={400} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 60, fill: C.cream }}>
        m
      </text>
    </g>
  );
};

/** g - the ocean floor at last. */
const g: Shot = ({ f }) => (
  <g>
    <Sky stops={["#1B6FA8", "#0A3C4C", "#06222B"]} x={0} y={0} w={W} h={H} />
    <Caustics f={f} x={0} y={0} w={W} h={600} rows={6} color={C.sky} width={9} opacity={0.25} speed={3} />
    <Bubbles frame={f} x0={80} x1={1000} y={1000} n={26} color={C.foam} seed={9} rise={4} size={10} />
    <path d="M-40 980 Q200 930 420 980 T820 970 T1120 990 V1300 H-40 Z" fill="#1FA69A" />
    <path d="M-40 1060 Q300 1020 560 1070 T1120 1060 V1300 H-40 Z" fill="#146A6C" />
    <Shield x={540} y={1000} w={1500} h={500} />
    <Tick x={850} y={1020 + 12 * Math.sin(f / 7)} pxPerM={260} frame={f} pose="point" expression="surprised" facing={-1} />
    <Plaque x={540} y={190} text="OCEAN FLOOR" size={110} bg={C.ink} fg={C.amber} />
    <Plaque x={540} y={350} text="+6,000 M BELOW" size={72} bg={C.ink} fg={C.cream} />
  </g>
);

/** h - the two gauges slide together. */
const h: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 4);
  const mid = 640;
  return (
    <g>
      <Sky stops={["#1B6FA8", "#2A8FC4", "#4FB5DE"]} x={0} y={0} w={W} h={H} />
      <Chips f={f} n={10} y0={100} y1={1100} color={C.foam} speed={8} opacity={0.4} seed={12} />
      <rect x={0} y={mid} width={W} height={H - mid} fill="#1B6FA8" />
      <rect x={440} y={mid - 4205 * S * 1.0 - mix(220, 0, k)} width={200} height={4205 * S} rx={50} fill={C.ink} />
      <rect x={462} y={mid - 4205 * S - mix(220, 0, k) + 14} width={156} height={4205 * S - 28} rx={36} fill={C.amber} />
      <rect x={440} y={mid + mix(220, 0, k)} width={200} height={6006 * S} rx={50} fill={C.ink} />
      <rect x={462} y={mid + mix(220, 0, k) + 14} width={156} height={6006 * S - 28} rx={36} fill={C.sky} />
      <T x={800} y={mid - 190} text="4,205 M" size={60} align="start" />
      <T x={800} y={mid + 300} text="~6,000 M" size={60} align="start" />
      <Glow x={540} y={mid} r={220} color={C.gold} f={f} strength={0.7} period={12} />
    </g>
  );
};

/** i - the total reads 10,211 m; the Everest bar is shorter. */
const i_: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 6);
  const base = 1150;
  return (
    <g>
      <Sky stops={["#1B6FA8", "#2A8FC4", "#4FB5DE"]} x={0} y={0} w={W} h={H} />
      <Chips f={f} n={10} y0={100} y1={1100} color={C.foam} speed={-8} opacity={0.4} seed={6} />
      <rect x={250 - 90} y={base - 10211 * S * k} width={180} height={10211 * S * k} rx={50} fill={C.ink} />
      <rect x={250 - 68} y={base - 10211 * S * k + 14} width={136} height={Math.max(0, 10211 * S * k - 28)} rx={36} fill={C.amber} />
      <rect x={810 - 90} y={base - 8849 * S * k} width={180} height={8849 * S * k} rx={50} fill="none" stroke={C.cream} strokeWidth={8} strokeDasharray="22 14" strokeDashoffset={-f * 3} />
      <Plaque x={250} y={base + 70} text="MAUNA KEA" size={44} bg={C.ink} fg={C.cream} />
      <Plaque x={810} y={base + 70} text="EVEREST" size={44} bg={C.ink} fg={C.cream} />
      <rect x={310} y={220} width={720} height={230} rx={50} fill={C.ink} opacity={0.94} />
      <Counter x={560} y={390} value={10211 * k} max={10211} size={120} color={C.amber} align="middle" />
      <text x={880} y={390} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64, fill: C.cream }}>
        m
      </text>
    </g>
  );
};

/** j - a tide gauge: the water creeps up its scale. */
const j: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 2);
  return (
    <g>
      <Ocean f={f} seaY={mix(820, 620, k)} />
      <CloudRack f={f} n={3} x0={-400} x1={1500} y0={100} y1={420} size={90} speed={4} body={C.cream} under={C.ice} top="#FFFFFF" seed={8} />
      <rect x={700} y={300} width={110} height={930} rx={26} fill={C.cream} stroke={C.ink} strokeWidth={10} />
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} x={700} y={340 + i * 90} width={i % 2 ? 60 : 90} height={10} rx={5} fill={C.ink} />
      ))}
      <rect x={560} y={mix(820, 620, k) - 8} width={250} height={14} rx={7} fill={C.amber} />
      <Plaque x={300} y={190} text="HILO" size={120} bg={C.ink} fg={C.amber} />
      <Plaque x={300} y={380} text="TIDE GAUGE" size={64} bg={C.ink} fg={C.cream} />
    </g>
  );
};

/** k - 2.5 mm a year: down arrows rain over the plaque. */
const k_: Shot = ({ f }) => (
  <g>
    <Sky stops={["#1B6FA8", "#2A8FC4", "#4FB5DE"]} x={0} y={0} w={W} h={H} />
    <Chips f={f} n={12} y0={100} y1={1100} color={C.foam} speed={8} opacity={0.35} seed={14} />
    {[0, 1, 2, 3, 4].map((i) => {
      const y = 120 + ((f * 8 + i * 230) % 1100);
      return <path key={i} d={`M${130 + i * 205} ${y} v140 m-44 -40 l44 50 l44 -50`} stroke={C.amber} strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />;
    })}
    <rect x={110} y={420} width={860} height={420} rx={70} fill={C.ink} opacity={0.95} />
    <T x={540} y={640} text="2.5 MM" size={190} color={C.amber} />
    <T x={540} y={780} text="EVERY YEAR" size={90} color={C.cream} />
  </g>
);

/** l - the island sinks (exaggerated). */
const l: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 2);
  const seaY = 640;
  const sink = 150 * k;
  return (
    <g>
      <Ocean f={f} seaY={seaY} />
      <CloudRack f={f} n={3} x0={-400} x1={1500} y0={100} y1={420} size={100} speed={5} body={C.cream} under={C.ice} top="#FFFFFF" seed={11} />
      <Shield x={540} y={seaY + 520 + sink} w={1700} h={4205 * S + 520} />
      <Tick x={540} y={seaY - 4205 * S + sink + 14} pxPerM={170} frame={f} pose="stand" expression="worried" facing={1} />
      <path d="M900 700 v200 m-50 -60 l50 70 l50 -70" stroke={C.amber} strokeWidth={24} fill="none" strokeLinecap="round" strokeLinejoin="round" transform={`translate(0 ${28 * Math.sin(f / 5)})`} />
      <Plaque x={540} y={1130} text="SINKING (EXAGGERATED)" size={56} bg={C.ink} fg={C.cream} />
    </g>
  );
};

/** m - a staircase of drowned reefs down the flank. */
const m: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 10);
  return (
    <g>
      <Sky stops={["#1B6FA8", "#0A3C4C", "#06222B"]} x={0} y={0} w={W} h={H} />
      <Caustics f={f} x={0} y={0} w={W} h={900} rows={7} color={C.sky} width={9} opacity={0.25} speed={3} />
      <Bubbles frame={f} x0={80} x1={1000} y={1200} n={20} color={C.foam} seed={5} rise={3} size={9} />
      {Array.from({ length: 6 }, (_, i) => {
        const on = ez(f, i * 5, i * 5 + 10);
        return (
          <g key={i} opacity={on}>
            <rect x={80 + i * 140} y={300 + i * 150} width={420} height={120} rx={36} fill={i % 2 ? C.orange : C.verm} stroke={C.ink} strokeWidth={8} />
            {[0, 1, 2, 3].map((j) => (
              <circle key={j} cx={130 + i * 140 + j * 100} cy={300 + i * 150 + 20} r={28} fill={C.apricot} stroke={C.ink} strokeWidth={5} />
            ))}
          </g>
        );
      })}
      <Plaque x={540} y={190} text="OLD CORAL REEFS" size={80} bg={C.ink} fg={C.amber} opacity={ramp(f, 0, 6)} />
      <Glow x={900} y={1100 * k + 100} r={150} color={C.gold} f={f} strength={0.5} />
    </g>
  );
};

/** n - Tick swims down the stairs. */
const n_: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 2);
  return (
    <g>
      <Sky stops={["#1B6FA8", "#0A3C4C", "#06222B"]} x={0} y={0} w={W} h={H} />
      <Bubbles frame={f} x0={80} x1={1000} y={1200} n={24} color={C.foam} seed={7} rise={4} size={10} />
      <Streamers f={f} n={6} x0={-300} x1={1400} y0={150} y1={1000} len={360} width={16} speed={4} color={C.sky} opacity={0.3} slope={0.05} seed={9} />
      {Array.from({ length: 5 }, (_, i) => (
        <rect key={i} x={80 + i * 170} y={420 + i * 170} width={400} height={110} rx={34} fill={i % 2 ? C.orange : C.verm} stroke={C.ink} strokeWidth={8} />
      ))}
      <Tick x={mix(200, 760, k)} y={mix(400, 1000, k)} pxPerM={210} frame={f} pose="stand" expression="surprised" facing={1} walk={f / 10} tilt={20} />
      <Plaque x={mix(300, 800, k)} y={mix(230, 800, k)} text="465,000 YEARS" size={50} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** o - the depth counter: 1,335 m down. */
const o: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 6);
  return (
    <g>
      <Sky stops={["#1B6FA8", "#0A3C4C", "#06222B"]} x={0} y={0} w={W} h={H} />
      <Ruler f={f} x={110} y0={80} y1={1230} speed={-12} step={100} len={130} />
      <Ruler f={f} x={840} y0={80} y1={1230} speed={-12} step={100} len={130} />
      <Bubbles frame={f} x0={80} x1={1000} y={1200} n={20} color={C.foam} seed={2} rise={4} size={10} />
      <rect x={110} y={300} width={860} height={380} rx={70} fill={C.ink} opacity={0.95} />
      <Counter x={430} y={570} value={1335 * k} max={1335} size={190} color={C.amber} align="middle" />
      <text x={760} y={570} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 90, fill: C.cream }}>
        m
      </text>
      <T x={540} y={830} text="UNDERWATER NOW" size={84} color={C.cream} />
      <T x={540} y={950} text="ONCE AT THE SURFACE" size={56} color={C.amber} />
    </g>
  );
};

/** p - taller, yet sinking: the question over the shield. */
const p: Shot = ({ f }) => {
  const seaY = 700;
  return (
    <g>
      <Ocean f={f} seaY={seaY} />
      <Shield x={400} y={seaY + 520} w={1500} h={4205 * S + 520} />
      <Qmark f={f} x={800} y={760} size={560} />
      <path d="M860 900 v200 m-50 -60 l50 70 l50 -70" stroke={C.amber} strokeWidth={24} fill="none" strokeLinecap="round" strokeLinejoin="round" transform={`translate(0 ${28 * Math.sin(f / 5)})`} />
      <Plaque x={540} y={190} text="TALLER, YET SINKING?" size={72} bg={C.ink} fg={C.amber} />
    </g>
  );
};

const q: Shot = ({ f }) => (
  <EndShot f={f} stops={["#1B6FA8", "#0A3C4C", "#06222B"]} q={["HOW SO TALL?", "WHAT PULLS IT UNDER?"]} size={66}>
    <Shield x={900} y={1220} w={420} h={170} />
  </EndShot>
);

export const ShortS48 = makeShort(timeline, [[a, b], [c, d, e], [f_, g], [h, i_], [j, k_, l], [m, n_, o], [p, q]]);
