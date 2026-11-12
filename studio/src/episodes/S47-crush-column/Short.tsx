import React from "react";
import { Bubbles, CloudRack, Counter, Sky, Streamers, Tick, rnd } from "../../lib/illustrated";
import { buildTimeline, VoLine } from "../../lib/timeline";
import { C, Chips, EndShot, Glow, Plaque, Rain, T, W, H, Shot, ez, makeShort, mix, ramp } from "../S41-dig-plate/vkit";
import { Peak, Qmark, Ruler } from "../S46-peak-seafloor/kit46";
import vo from "./vo.json";

/**
 * S47 - a granite tower as tall as Everest (episodes/S47-crush-column). For L12, answered at 1:43. Vertical 1080x1920.
 * Numbers (sources.md): #7 granite crushes at 100-250 MPa; #9 100-250 MPa = 990-2,470 atmospheres (spoken/shown
 * "1,000 to 2,500 times air pressure"); #1 8,849 m; #9 rho g h = ~235 MPa at the base; crush height 3.8-9.4 km (shown
 * "4 to 9 km"). The isostatic root (how Everest stands) is withheld.
 */
export const timeline = buildTimeline(vo as VoLine[]);

const FONT = "'Outfit', sans-serif";
const BG = ["#0A3C4C", "#11707A", "#1FA69A"];
const GRANITE = ["#2A8FC4", "#4FB5DE", "#1B6FA8", "#7C3FA8"];
const BW = 400;
const BH = 128;

const Block: React.FC<{ x: number; y: number; i: number; stress?: number; f?: number; rot?: number; w?: number }> = ({ x, y, i, stress = 0, f = 0, rot = 0, w = BW }) => (
  <g transform={`rotate(${rot} ${x} ${y - BH / 2})`}>
    <path d={`M${x - w / 2} ${y - BH} L${x - w / 2 + 44} ${y - BH - 30} H${x + w / 2 + 44} L${x + w / 2} ${y - BH} Z`} fill={C.ice} stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
    <path d={`M${x + w / 2} ${y - BH} L${x + w / 2 + 44} ${y - BH - 30} V${y - 30} L${x + w / 2} ${y} Z`} fill="#1B4F86" stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
    <rect x={x - w / 2} y={y - BH} width={w} height={BH} rx={10} fill={GRANITE[i % GRANITE.length]} stroke={C.ink} strokeWidth={8} />
    {[0.25, 0.6].map((k, j) => (
      <path key={j} d={`M${x - w / 2 + 30} ${y - BH * k - 10} H${x + w / 2 - 30}`} stroke={C.foam} strokeWidth={6} strokeLinecap="round" opacity={0.4} />
    ))}
    {stress > 0 ? (
      <g opacity={stress * (0.65 + 0.35 * Math.sin(f / 3))}>
        <rect x={x - w / 2} y={y - BH} width={w} height={BH} rx={10} fill={C.verm} opacity={0.55} />
        {Array.from({ length: 8 }, (_, k) => (
          <path key={k} d={`M${x - w / 2 + 20 + k * (w / 8)} ${y - BH + 12} l30 ${BH - 24}`} stroke={C.amber} strokeWidth={8} strokeLinecap="round" />
        ))}
      </g>
    ) : null}
  </g>
);

const Floor: React.FC = () => <rect x={0} y={1190} width={W} height={110} fill={C.deep} />;

/** a - blocks slam down one after another, Tick hauls the next. */
const a: Shot = ({ f }) => (
  <g>
    <Sky stops={BG} x={0} y={0} w={W} h={H} />
    <Chips f={f} n={10} y0={100} y1={1100} color={C.mint} speed={8} opacity={0.4} seed={3} />
    <Floor />
    {Array.from({ length: 3 }, (_, i) => {
      const at = i * 12;
      const t = ramp(f, at, at + 9);
      const y = mix(-200, 1190 - i * BH, t * t);
      return f >= at ? <Block key={i} x={620} y={y} i={i} /> : null;
    })}
    <Tick x={200} y={1230} pxPerM={380} frame={f} pose="carry" expression="determined" facing={1} />
    <Plaque x={540} y={190} text="STACK GRANITE" size={96} bg={C.ink} fg={C.amber} />
  </g>
);

/** b - the tower climbs fast. */
const b: Shot = ({ f }) => {
  const cnt = Math.min(8, 3 + Math.floor(f / 5));
  return (
    <g>
      <Sky stops={BG} x={0} y={0} w={W} h={H} />
      <Chips f={f} n={10} y0={100} y1={1100} color={C.mint} speed={-9} opacity={0.4} seed={6} />
      <Floor />
      {Array.from({ length: cnt }, (_, i) => (
        <Block key={i} x={620} y={1190 - i * BH + (i === cnt - 1 ? -Math.max(0, 40 - (f % 5) * 12) : 0)} i={i} />
      ))}
      <Tick x={220 + 70 * Math.sin(f / 8)} y={1230} pxPerM={380} frame={f} pose="heave" expression="happy" facing={1} />
    </g>
  );
};

/** c - weight arrows pour down the tower. */
const c: Shot = ({ f }) => (
  <g>
    <Sky stops={BG} x={0} y={0} w={W} h={H} />
    <Floor />
    {Array.from({ length: 8 }, (_, i) => (
      <Block key={i} x={540} y={1190 - i * BH} i={i} stress={i === 0 ? 1 : 0} f={f} />
    ))}
    {[0, 1, 2, 3].map((k) => {
      const y = 140 + ((f * 7 + k * 270) % 1080);
      return <path key={k} d={`M120 ${y} v120 m-34 -34 l34 40 l34 -40`} stroke={C.amber} strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />;
    })}
    {[0, 1, 2, 3].map((k) => {
      const y = 140 + ((f * 7 + k * 270 + 130) % 1080);
      return <path key={k} d={`M960 ${y} v120 m-34 -34 l34 40 l34 -40`} stroke={C.amber} strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />;
    })}
  </g>
);

/** d - close on the bottom block as it takes the load. */
const d: Shot = ({ f }) => (
  <g>
    <Sky stops={["#7A3418", "#B04A18", "#E3813F"]} x={0} y={0} w={W} h={H} />
    <Glow x={540} y={900} r={760} color={C.gold} f={f} strength={0.6} period={14} />
    <g transform="translate(-60 -180) scale(1.25)">
      <Block x={500} y={1000} i={0} stress={1} f={f} w={520} />
      <Block x={500} y={872} i={1} w={520} />
    </g>
    {[0, 1, 2].map((k) => {
      const y = 100 + ((f * 9 + k * 300) % 900);
      return <path key={k} d={`M${200 + k * 340} ${y} v100 m-34 -30 l34 40 l34 -40`} stroke={C.cream} strokeWidth={20} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
    })}
    <Plaque x={540} y={1130} text="THE BOTTOM CARRIES ALL" size={58} bg={C.ink} fg={C.amber} />
  </g>
);

/** Half-circle dial, 0..300 MPa, red band 100..250. value in MPa. */
const Dial: React.FC<{ x: number; y: number; r: number; value: number; f: number; shake?: number }> = ({ x, y, r, value, f, shake = 0 }) => {
  const ang = (v: number) => Math.PI * (1 - v / 300);
  const arc = (v0: number, v1: number, rr: number) => `M${x + Math.cos(ang(v0)) * rr} ${y - Math.sin(ang(v0)) * rr} A${rr} ${rr} 0 0 1 ${x + Math.cos(ang(v1)) * rr} ${y - Math.sin(ang(v1)) * rr}`;
  const v = value + shake * Math.sin(f * 1.7);
  return (
    <g>
      <path d={arc(0, 300, r)} stroke={C.ink} strokeWidth={70} fill="none" strokeLinecap="round" />
      <path d={arc(0, 100, r)} stroke={C.green} strokeWidth={46} fill="none" />
      <path d={arc(100, 250, r)} stroke={C.verm} strokeWidth={46} fill="none" />
      <path d={arc(250, 300, r)} stroke={C.amber} strokeWidth={46} fill="none" />
      <line x1={x} y1={y} x2={x + Math.cos(ang(v)) * (r + 30)} y2={y - Math.sin(ang(v)) * (r + 30)} stroke={C.cream} strokeWidth={20} strokeLinecap="round" />
      <circle cx={x} cy={y} r={34} fill={C.cream} stroke={C.ink} strokeWidth={8} />
    </g>
  );
};

/** e - the dial swings into the red band. */
const e: Shot = ({ f, n }) => (
  <g>
    <Sky stops={BG} x={0} y={0} w={W} h={H} />
    <Chips f={f} n={10} y0={100} y1={1100} color={C.mint} speed={8} opacity={0.4} seed={4} />
    <Dial x={540} y={780} r={380} value={mix(0, 175, ez(f, 0, n - 4))} f={f} />
    <Plaque x={540} y={1040} text="GRANITE CRUSHES" size={86} bg={C.verm} fg={C.cream} />
    <Plaque x={540} y={190} text="PRESSURE" size={110} bg={C.ink} fg={C.amber} />
  </g>
);

/** f - counters roll to the band's two ends. */
const f_: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 6);
  return (
    <g>
      <Sky stops={["#7A3418", "#B04A18", "#E3813F"]} x={0} y={0} w={W} h={H} />
      <Glow x={540} y={640} r={800} color={C.gold} f={f} strength={0.7} period={20} />
      <rect x={100} y={260} width={880} height={720} rx={80} fill={C.ink} opacity={0.94} />
      <Counter x={330} y={560} value={100 * k} max={100} size={190} color={C.amber} align="middle" digits={3} />
      <T x={540} y={650} text="TO" size={70} color={C.cream} />
      <Counter x={400} y={860} value={250 * k} max={250} size={190} color={C.amber} align="middle" digits={3} />
      <text x={640} y={860} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 90, fill: C.cream }}>
        MPa
      </text>
    </g>
  );
};

/** g - the block is squeezed and crushes. */
const g: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 4);
  return (
    <g>
      <Sky stops={["#7A3418", "#B04A18", "#E4572E"]} x={0} y={0} w={W} h={H} />
      <Chips f={f} n={12} y0={100} y1={1100} color={C.gold} speed={10} opacity={0.5} seed={7} />
      <rect x={90} y={300 + 160 * k} width={900} height={90} rx={30} fill={C.ink} />
      <rect x={90} y={1030 - 0} width={900} height={90} rx={30} fill={C.ink} />
      <g transform={`translate(540 ${1030}) scale(${1 + 0.35 * k} ${1 - 0.5 * k}) translate(-540 -1030)`}>
        <Block x={500} y={1030} i={0} stress={1} f={f} w={560} />
      </g>
      {k > 0.5 ? <path d={`M300 ${980 - 60 * k} l60 -50 l-30 -40 l70 -50`} stroke={C.cream} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
      <Plaque x={540} y={190} text="CRUSHES" size={150} bg={C.verm} fg={C.cream} />
    </g>
  );
};

/** h - a tiny air balloon against the giant pressure count. */
const h: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 10);
  return (
    <g>
      <Sky stops={["#2A8FC4", "#4FB5DE", "#9BD6E8"]} x={0} y={0} w={W} h={H} />
      <CloudRack f={f} n={3} x0={-400} x1={1500} y0={100} y1={700} size={100} speed={5} body={C.cream} under={C.ice} top="#FFFFFF" seed={4} />
      <g transform={`translate(260 ${760 + 14 * Math.sin(f / 8)})`}>
        <ellipse rx={90} ry={110} fill={C.verm} stroke={C.ink} strokeWidth={8} />
        <path d="M0 110 L-14 150 H14 Z" fill={C.verm} stroke={C.ink} strokeWidth={6} />
        <path d="M-40 -50 q20 -40 50 -40" stroke={C.cream} strokeWidth={10} fill="none" strokeLinecap="round" />
        <T x={0} y={20} text="1×" size={64} color={C.cream} />
      </g>
      <Plaque x={720} y={500} text="1,000 TO 2,500 ×" size={74} bg={C.ink} fg={C.amber} />
      <Counter x={720} y={820} value={2500 * k} max={2500} size={170} color={C.amber} align="middle" />
      <T x={720} y={950} text="AIR PRESSURE" size={64} />
    </g>
  );
};

/** i - bars: air is a stub, granite's limit is a tower. */
const i_: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 6);
  return (
    <g>
      <Sky stops={BG} x={0} y={0} w={W} h={H} />
      <Chips f={f} n={10} y0={100} y1={1100} color={C.mint} speed={8} opacity={0.4} seed={11} />
      <rect x={140} y={1180 - 24} width={200} height={24} rx={10} fill={C.sky} />
      <rect x={560} y={1180 - 880 * k} width={240} height={880 * k} rx={34} fill={C.ink} />
      <rect x={574} y={1180 - 880 * k + 12} width={212} height={Math.max(0, 880 * k - 24)} rx={24} fill={C.verm} />
      <Glow x={680} y={1180 - 880 * k} r={200} color={C.gold} f={f} strength={0.8} period={10} />
      <T x={240} y={1100} text="AIR" size={70} />
      <T x={680} y={260} text="GRANITE'S LIMIT" size={58} color={C.cream} opacity={ramp(f, 8, 18)} />
      <Tick x={900} y={1230} pxPerM={260} frame={f} pose="shield" expression="surprised" facing={-1} />
    </g>
  );
};

/** j - the tower shoots up, ruler streaming. */
const j: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 3);
  return (
    <g>
      <Sky stops={["#2A8FC4", "#4FB5DE", "#9BD6E8"]} x={0} y={0} w={W} h={H} />
      <Ruler f={f} x={90} y0={80} y1={1230} speed={-30} step={110} />
      <Ruler f={f} x={900} y0={80} y1={1230} speed={-30} step={110} />
      <CloudRack f={f} n={4} x0={-400} x1={1500} y0={100} y1={1000} size={110} speed={7} body={C.cream} under={C.ice} top="#FFFFFF" seed={5} />
      <g transform={`translate(0 ${-mix(0, 1400, k)})`}>
        {Array.from({ length: 22 }, (_, i) => (
          <Block key={i} x={540} y={1190 - i * BH} i={i} />
        ))}
      </g>
      <Plaque x={540} y={190} text="AS TALL AS EVEREST" size={72} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** k - the gauge reads 8,849 m; Tick tilts back to look up. */
const k_: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 6);
  return (
    <g>
      <Sky stops={["#1B6FA8", "#2A8FC4", "#4FB5DE"]} x={0} y={0} w={W} h={H} />
      <Ruler f={f} x={110} y0={80} y1={1230} speed={-6} step={100} len={120} />
      <Ruler f={f} x={850} y0={80} y1={1230} speed={-6} step={100} len={120} />
      <rect x={110} y={250} width={860} height={250} rx={54} fill={C.ink} opacity={0.94} />
      <Counter x={440} y={430} value={8849 * k} max={8849} size={150} color={C.amber} align="middle" />
      <text x={760} y={430} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, fill: C.cream }}>
        m
      </text>
      <Tick x={540} y={1230} pxPerM={430} frame={f} pose="lean" expression="surprised" facing={1} tilt={-6 * k} />
    </g>
  );
};

/** l - the needle swings up and trembles near 235. */
const l: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 10);
  return (
    <g>
      <Sky stops={BG} x={0} y={0} w={W} h={H} />
      <Chips f={f} n={10} y0={100} y1={1100} color={C.mint} speed={8} opacity={0.4} seed={2} />
      <Dial x={540} y={780} r={380} value={mix(0, 235, k)} f={f} shake={k > 0.95 ? 5 : 0} />
      <rect x={160} y={870} width={760} height={230} rx={50} fill={C.ink} opacity={0.94} />
      <Counter x={400} y={1040} value={235 * k} max={235} size={130} color={C.amber} align="middle" />
      <text x={640} y={1040} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 70, fill: C.cream }}>
        MPa
      </text>
      <Plaque x={540} y={190} text="BOTTOM BLOCK" size={96} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** m - the bottom block glows under the load. */
const m: Shot = ({ f }) => (
  <g>
    <Sky stops={["#7A3418", "#B04A18", "#E3813F"]} x={0} y={0} w={W} h={H} />
    <Glow x={540} y={820} r={780} color={C.gold} f={f} strength={0.8} period={12} />
    <g transform="translate(-50 -170) scale(1.2)">
      <Block x={500} y={1000} i={0} stress={1} f={f} w={520} />
      <Block x={500} y={872} i={1} w={520} />
      <Block x={500} y={744} i={2} w={520} />
    </g>
    {[0, 1, 2].map((k) => {
      const y = 100 + ((f * 10 + k * 300) % 800);
      return <path key={k} d={`M${180 + k * 360} ${y} v100 m-34 -30 l34 40 l34 -40`} stroke={C.cream} strokeWidth={20} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
    })}
    <Plaque x={540} y={1130} text="~235 MPa" size={100} bg={C.ink} fg={C.amber} scale={1 + 0.05 * Math.sin(f / 4)} />
  </g>
);

/** n - at the edge of the band, a crack zigzags through; Tick throws up both arms. */
const n_: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 10);
  return (
    <g transform={`translate(${f < 30 ? Math.sin(f * 3) * 5 : 0} 0)`}>
      <Sky stops={["#7A3418", "#B04A18", "#E4572E"]} x={0} y={0} w={W} h={H} />
      <Dial x={540} y={520} r={300} value={235 + 8 * Math.sin(f * 1.7)} f={f} />
      <g transform="translate(0 -20)">
        <Block x={540} y={1130} i={0} stress={0.8} f={f} w={560} />
        <path d={`M440 ${1130 - 128} L${480} ${1130 - 128 + 40 * k} L430 ${1130 - 128 + 70 * k} L500 ${1130 - 128 + 128 * k}`} stroke={C.ink} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <Tick x={940} y={1250} pxPerM={300} frame={f} pose="cheer" expression="scared" facing={-1} />
      <Plaque x={400} y={880} text="THE LIMIT" size={92} bg={C.verm} fg={C.cream} scale={1 + 0.05 * Math.sin(f / 3)} />
    </g>
  );
};

/** o - the crack spreads and the tower sags. */
const o: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 2);
  return (
    <g>
      <Sky stops={BG} x={0} y={0} w={W} h={H} />
      <Chips f={f} n={10} y0={100} y1={1100} color={C.mint} speed={8} opacity={0.4} seed={8} />
      <Floor />
      {Array.from({ length: 8 }, (_, i) => (
        <Block key={i} x={540 + i * 12 * k} y={1190 - i * BH * (1 - 0.18 * k)} i={i} rot={i * 1.1 * k} stress={i === 0 ? 1 : 0} f={f} />
      ))}
      <path d={`M300 1150 L360 1100 L320 1060 L420 1010 L380 960 L460 920`} stroke={C.cream} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={ramp(f, 0, 10)} strokeDasharray="800" strokeDashoffset={800 * (1 - ez(f, 0, n - 4))} />
    </g>
  );
};

/** p - the gauge: a crush band marks 4 to 9 km. */
const p: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 6);
  const y = (km: number) => 1180 - km * 100;
  return (
    <g>
      <Sky stops={["#1B6FA8", "#2A8FC4", "#4FB5DE"]} x={0} y={0} w={W} h={H} />
      <Chips f={f} n={10} y0={100} y1={1100} color={C.foam} speed={8} opacity={0.35} seed={9} />
      <rect x={200} y={y(9.4) } width={150} height={y(0) - y(9.4)} rx={40} fill={C.ink} />
      <rect x={216} y={y(9.4 * k + 0.001) } width={118} height={Math.max(0, y(0) - y(9.4 * k))} rx={30} fill={C.deep} />
      <rect x={216} y={y(9.4 * k)} width={118} height={Math.max(0, y(3.8 * k) - y(9.4 * k))} rx={30} fill={C.verm} />
      {[0, 2, 4, 6, 8].map((km) => (
        <g key={km}>
          <rect x={360} y={y(km) - 4} width={50} height={8} rx={4} fill={C.cream} />
          <T x={470} y={y(km) + 18} text={`${km}`} size={50} color={C.cream} align="start" />
        </g>
      ))}
      <Plaque x={720} y={y(6.6)} text="GIVES WAY" size={74} bg={C.verm} fg={C.cream} opacity={ramp(f, 10, 18)} />
      <Plaque x={720} y={y(6.6) + 130} text="4 TO 9 KM" size={96} bg={C.ink} fg={C.amber} opacity={ramp(f, 14, 22)} />
    </g>
  );
};

/** q - the tower collapses: blocks tumble. */
const q: Shot = ({ f }) => (
  <g>
    <Sky stops={["#7A3418", "#B04A18", "#E4572E"]} x={0} y={0} w={W} h={H} />
    <Chips f={f} n={14} y0={100} y1={1150} color={C.gold} speed={11} opacity={0.5} seed={5} />
    <Floor />
    {Array.from({ length: 6 }, (_, i) => {
      const t = f * (0.9 + 0.15 * i);
      const dx = (i % 2 ? 1 : -1) * Math.min(260, t * 2.6) * (0.5 + rnd(i));
      const y = Math.min(1190 - (i % 3) * 60, 1190 - i * BH + t * t * 0.06);
      return <Block key={i} x={540 + dx} y={y} i={i} rot={(i % 2 ? 1 : -1) * Math.min(80, t * 1.6)} w={320} />;
    })}
    <rect x={0} y={1130} width={W} height={20} fill={C.gold} opacity={0.5 * (1 - ramp(f, 0, 50))} />
    <Plaque x={540} y={190} text="IT GIVES WAY" size={96} bg={C.verm} fg={C.cream} />
  </g>
);

/** r - the ghost of the cracked tower; real Everest rises behind it. */
const r_: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 4);
  return (
    <g>
      <Sky stops={["#2A8FC4", "#4FB5DE", "#9BD6E8"]} x={0} y={0} w={W} h={H} />
      <CloudRack f={f} n={4} x0={-400} x1={1500} y0={300} y1={1000} size={110} speed={6} body={C.cream} under={C.ice} top="#FFFFFF" seed={7} />
      <Peak x={640} y={1230} w={1000} h={mix(300, 1000, k)} body="#E3813F" shade="#B04A18" />
      <g opacity={0.45}>
        {Array.from({ length: 5 }, (_, i) => (
          <Block key={i} x={250} y={1230 - i * BH} i={i} w={300} />
        ))}
      </g>
      <Plaque x={540} y={190} text="EVEREST IS TALLER" size={80} bg={C.ink} fg={C.amber} />
    </g>
  );
};

/** s - Tick looks from one to the other; a question mark hangs. */
const s_: Shot = ({ f }) => (
  <g>
    <Sky stops={["#2A8FC4", "#4FB5DE", "#9BD6E8"]} x={0} y={0} w={W} h={H} />
    <Streamers f={f} n={8} x0={-300} x1={1400} y0={150} y1={900} len={400} width={22} speed={5} color={C.foam} opacity={0.5} slope={0.04} seed={3} />
    <Peak x={700} y={1230} w={1000} h={1000} body="#E3813F" shade="#B04A18" />
    <Tick x={250} y={1230} pxPerM={430} frame={f} pose="think" expression="thinking" facing={1} look={Math.sin(f / 14)} />
    <Qmark f={f} x={760} y={560} size={440} />
    <Plaque x={540} y={190} text="AND IT STANDS" size={90} bg={C.ink} fg={C.amber} />
  </g>
);

/** t - the unanswered question. */
const t_: Shot = ({ f }) => (
  <g>
    <Sky stops={BG} x={0} y={0} w={W} h={H} />
    <Rain f={f} n={12} color={C.mint} speed={6} len={120} width={9} opacity={0.4} seed={2} />
    <Bubbles frame={f} x0={80} x1={1000} y={1150} n={14} color={C.foam} seed={3} rise={3} size={9} />
    <Peak x={300} y={1260} w={900} h={700} body="#E3813F" shade="#B04A18" />
    <Qmark f={f} x={680} y={900} size={640} />
    <Plaque x={540} y={190} text="HOW DOES IT STAND?" size={80} bg={C.ink} fg={C.amber} />
  </g>
);

const u: Shot = ({ f }) => (
  <EndShot f={f} stops={BG} q={["HOW DOES EVEREST", "STAY STANDING?"]}>
    <Peak x={975} y={1200} w={200} h={150} body={C.orange} shade={C.rust} />
  </EndShot>
);

export const ShortS47 = makeShort(timeline, [[a, b], [c, d], [e, f_, g], [h, i_], [j, k_], [l, m], [n_], [o, p, q], [r_, s_], [t_, u]]);
