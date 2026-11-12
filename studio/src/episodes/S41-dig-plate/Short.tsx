import React from "react";
import { Bloom, Bubbles, Caustics, CloudRack, Counter, Embers, Emissive, Ripples, Risers, Sky, Stars, Streamers, Tick, pulse, rnd, seaSurface, smoothPath } from "../../lib/illustrated";
import { buildTimeline, VoLine } from "../../lib/timeline";
import { C, Chips, Derrick, EndShot, Glow, PlateTop, Plaque, Rain, Shot, Strata, T, W, H, ez, makeShort, mix, ramp } from "./vkit";
import vo from "./vo.json";

/**
 * S41 - a hole you could cover with a plate (episodes/S41-dig-plate). For L11, answered at 4:13. Vertical 1080x1920,
 * illustrated kit v2. 18 shots, one new composition every ~1.7 s. Every number is a row in sources.md (#1 #2 #3 #23 #24).
 * Hook (line 1) is an action: Tick carries a plate across the tundra and slams it over the hole.
 */
export const timeline = buildTimeline(vo as VoLine[]);

const DUSK = ["#0F3B4F", "#1E6678", "#E3813F", "#F6B45A"];
const NIGHT = ["#06222B", "#0A3C4C", "#11707A"];
const BANDS: [number, string][] = [
  [170, "#1E8A88"],
  [120, "#E3813F"],
  [200, "#146A6C"],
  [140, "#B04A18"],
  [160, "#2FBFA8"],
  [110, "#7A3418"],
];

const hills = (hy: number, amp: number, seed: number, bot: number) => {
  const pts: [number, number][] = [];
  for (let x = -60; x <= W + 120; x += 140) pts.push([x, hy - 40 - rnd(seed + x) * amp]);
  return `${smoothPath(pts)} L${W + 120} ${bot} L-60 ${bot} Z`;
};

/** The Kola tundra at dusk (sky, low gold sun, sliding cloud masses, hills, snow). `night` swaps to stars. */
const Tundra: React.FC<{ f: number; hy?: number; night?: boolean; speed?: number }> = ({ f, hy = 1000, night = false, speed = 1.8 }) => (
  <g>
    <Sky stops={night ? NIGHT : DUSK} x={0} y={0} w={W} h={hy + 60} />
    {night ? <Stars frame={f} n={80} w={W} h={hy - 150} color={C.foam} size={2.8} twinkle={0.7} seed={4} /> : <Bloom x={800} y={hy - 70} r={720} color={C.gold} strength={0.75} core={64} coreColor="#FFF1C2" />}
    <CloudRack f={f} n={4} x0={-420} x1={1500} y0={170} y1={hy - 300} size={118} speed={speed} body={night ? "#12586B" : "#2C8BA0"} under={night ? "#06222B" : "#0F3B4F"} top={night ? "#2FBFA8" : C.gold} seed={3} />
    {night ? <Streamers f={f} n={7} x0={-300} x1={1400} y0={180} y1={hy - 330} len={520} width={34} speed={2.4} color={C.green} opacity={0.4} slope={-0.05} seed={8} /> : null}
    <path d={hills(hy, 70, 5, hy + 80)} fill={night ? "#12586B" : "#3F7F8E"} />
    <path d={hills(hy + 40, 50, 9, hy + 120)} fill={night ? "#0E4658" : "#235A69"} />
    <rect x={0} y={hy} width={W} height={H - hy} fill={night ? "#2C8BA0" : C.ice} />
    <path d={`M0 ${hy + 6} Q270 ${hy - 10} 540 ${hy + 6} T1080 ${hy + 4}`} stroke={night ? "#66BEAD" : C.foam} strokeWidth={8} fill="none" />
  </g>
);

const dirty = (x: number, y: number, rx: number, ry: number, o = 1) => <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={C.ink} opacity={o} />;

/** 0 "Walk in with a plate" - the hook starts moving on frame 1. */
const s0: Shot = ({ f, n }) => {
  const x = mix(-160, 520, ez(f, 0, n));
  const ph = f / 26;
  return (
    <g>
      <Tundra f={f} hy={1060} />
      <Chips f={f} n={14} y0={1080} y1={1250} color={C.foam} speed={16} opacity={0.6} seed={2} />
      <g>
        <line x1={0} x2={W} y1={250} y2={250} stroke={C.gold} strokeWidth={6} strokeDasharray="30 22" strokeDashoffset={-f * 3} opacity={0.9} />
        <Plaque x={540} y={250} text="ARCTIC CIRCLE" size={50} bg={C.ink} fg={C.gold} />
        <Plaque x={540} y={350} text="KOLA PENINSULA" size={62} bg={C.sea} fg={C.cream} />
      </g>
      <Tick x={x} y={1190} pxPerM={430} frame={f} walk={ph} pose="carry" expression="determined" facing={1} lamp={false} />
      <g transform={`translate(${x + 176} ${1190 - 408 + 10 * Math.sin(ph * 6.28)}) rotate(-6)`}>
        <ellipse rx={64} ry={18} fill={C.cream} />
        <ellipse rx={44} ry={11} fill={C.foam} stroke={C.sky} strokeWidth={3} />
      </g>
    </g>
  );
};

/** 1 The plate slam: it drops onto a hole in the snow, with a puff. */
const s1: Shot = ({ f, n }) => {
  const land = 15;
  const fall = ez(f, 0, land);
  const y = mix(120, 1170, fall * fall);
  const sq = f >= land ? 1 + 0.25 * Math.max(0, 1 - (f - land) / 8) : 1;
  const ex = Math.max(0, f - land);
  return (
    <g>
      <Tundra f={f} hy={900} speed={2.4} />
      <Chips f={f} n={18} y0={950} y1={1260} color={C.foam} speed={20} opacity={0.6} seed={6} />
      {dirty(380, 1200, 92, 26, 0.95)}
      <Tick x={760} y={1180} pxPerM={560} frame={f} facing={-1} pose={f < land ? "heave" : "cheer"} expression={f < land ? "determined" : "proud"} />
      <g transform={`translate(380 ${y}) rotate(${(1 - fall) * 700}) scale(${sq} ${1 / sq})`}>
        <ellipse rx={82} ry={26} fill={C.cream} />
        <ellipse rx={56} ry={15} fill={C.foam} stroke={C.sky} strokeWidth={4} />
      </g>
      {f >= land ? <Ripples frame={ex * 3} cx={380} cy={1200} rx={320} ry={70} period={20} count={1} color={C.foam} width={14} strength={0.9} /> : null}
      {f >= land
        ? Array.from({ length: 10 }, (_, i) => (
            <circle key={i} cx={380 + Math.cos(i * 0.63) * ex * 14} cy={1190 - Math.abs(Math.sin(i * 0.63)) * ex * 20 + ex * ex * 0.6} r={Math.max(2, 14 - ex * 0.5)} fill={C.foam} opacity={Math.max(0, 1 - ex / 18)} />
          ))
        : null}
    </g>
  );
};

/** 2 Plate lifts off the hole (top-down) and we fall into it. */
const s2: Shot = ({ f, n }) => {
  const lift = ez(f, 4, 22);
  const zoom = 1 + 14 * Math.pow(ramp(f, 22, n), 2.2);
  return (
    <g>
      <Sky stops={["#2A8FC4", "#4FB5DE", "#9BD6E8"]} x={0} y={0} w={W} h={H} />
      <Chips f={f} n={14} y0={150} y1={1250} color={C.foam} speed={18} opacity={0.7} seed={11} />
      <Streamers f={f} n={8} x0={-200} x1={1300} y0={200} y1={1200} len={420} width={22} speed={11} color={C.cream} opacity={0.5} slope={0.03} seed={4} />
      <g transform={`translate(540 700) scale(${zoom}) translate(-540 -700)`}>
        <circle cx={540} cy={700} r={262} fill={C.ink} />
        <circle cx={540} cy={700} r={230} fill="#0A3C4C" />
        <Glow x={540} y={700} r={200} color={C.orange} f={f} strength={0.6} />
        <circle cx={540} cy={700} r={120 + 6 * Math.sin(f / 4)} fill="none" stroke={C.gold} strokeWidth={5} opacity={0.5 * ez(f, 8, 22)} />
        <g transform={`translate(${540 + 380 * lift} ${700 - 360 * lift}) scale(${1 + 0.4 * lift})`}>
          <PlateTop x={0} y={0} r={300} rot={lift * 120} />
        </g>
      </g>
    </g>
  );
};

/** 3 The measure: a tape across the hole, 23 cm. */
const s3: Shot = ({ f, n }) => {
  const k = ez(f, 2, 22);
  return (
    <g>
      <Sky stops={["#2A8FC4", "#4FB5DE", "#9BD6E8"]} x={0} y={0} w={W} h={H} />
      <Chips f={f} n={16} y0={150} y1={1250} color={C.foam} speed={15} opacity={0.65} seed={13} dir={-1} />
      <circle cx={540} cy={680} r={262} fill={C.ink} />
      <circle cx={540} cy={680} r={236} fill="#0A3C4C" />
      <Glow x={540} y={720} r={170} color={C.orange} f={f} strength={0.5} />
      <g transform="translate(0 680)">
        <rect x={278} y={-34} width={(262 * 2) * k} height={68} rx={8} fill={C.amber} />
        {Array.from({ length: 24 }, (_, i) => {
          const tx = 278 + i * 22;
          return tx < 278 + 524 * k ? <rect key={i} x={tx} y={i % 2 ? -34 : -34} width={5} height={i % 5 === 0 ? 40 : 24} fill={C.ink} /> : null;
        })}
        <path d="M278 -66 V-98 M802 -66 V-98" stroke={C.cream} strokeWidth={8} opacity={k} />
      </g>
      <Plaque x={540} y={420} text="23 CM" size={110} bg={C.ink} fg={C.amber} scale={0.7 + 0.3 * ez(f, 8, 20)} />
      <T x={540} y={1050} text="ACROSS" size={78} opacity={ez(f, 14, 24)} />
    </g>
  );
};

/** 4 Falling down the bore: rock bands rush up, the depth counter races. */
const s4: Shot = ({ f, n }) => {
  const v = 12262 * ez(f, 0, n - 4);
  return (
    <g>
      <Strata f={f} speed={26} bands={BANDS} amp={22} />
      <Strata f={f} speed={40} bands={BANDS.map(([h, c], i) => [h * 0.8, BANDS[(i + 3) % 6][1]] as [number, string])} x0={-40} x1={170} amp={18} seed={5} />
      <Strata f={f} speed={40} bands={BANDS.map(([h, c], i) => [h * 0.8, BANDS[(i + 3) % 6][1]] as [number, string])} x0={910} x1={1120} amp={18} seed={7} />
      <rect x={522} y={0} width={36} height={H} fill={C.ink} />
      <rect x={532} y={0} width={5} height={H} fill={C.gold} opacity={0.6} />
      <Chips f={f} n={10} y0={100} y1={1200} color={C.gold} speed={6} opacity={0.35} seed={2} len={90} width={8} />
      <rect x={110} y={210} width={860} height={230} rx={44} fill={C.ink} opacity={0.92} />
      <Counter x={430} y={375} value={v} max={12262} size={130} color={C.amber} align="middle" />
      <text x={820} y={375} style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 70, fill: C.cream }}>
        m
      </text>
      <T x={540} y={1100} text="DEEP" size={96} opacity={ez(f, 6, 16)} />
    </g>
  );
};

/** 5 Off the scale: the gauge fills past its end, chevrons pop, Tick stares. */
const s5: Shot = ({ f, n }) => {
  const fill = ez(f, 0, 12);
  const pop = ez(f, 12, 22);
  return (
    <g>
      <Sky stops={["#0A3C4C", "#11707A", "#1FA69A"]} x={0} y={0} w={W} h={H} />
      <Strata f={f} speed={9} bands={BANDS.map(([h, c]) => [h, c] as [number, string])} amp={26} y0={0} y1={H} seed={9} />
      <rect x={0} y={0} width={W} height={H} fill={C.ink} opacity={0.55} />
      <rect x={150} y={200} width={110} height={940} rx={55} fill="#0A3C4C" stroke={C.cream} strokeWidth={6} />
      <rect x={160} y={1130 - 920 * fill} width={90} height={920 * fill} rx={45} fill={C.verm} />
      {[0, 1].map((i) => (
        <path key={i} d={`M150 ${170 - i * 70 + (1 - pop) * 60} L205 ${110 - i * 70 + (1 - pop) * 60} L260 ${170 - i * 70 + (1 - pop) * 60}`} stroke={C.amber} strokeWidth={26} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={pop} />
      ))}
      <Plaque x={600} y={330} text="12,262 M" size={110} bg={C.ink} fg={C.amber} scale={0.7 + 0.3 * pop} />
      <T x={600} y={470} text="OFF THE SCALE" size={66} color={C.cream} opacity={pop} />
      <Tick x={780} y={1150} pxPerM={330} frame={f} expression="surprised" pose="shield" facing={-1} />
    </g>
  );
};

const HX = 700; // the bore, a tall column (width exaggerated)
const GY = 300;
const PXM = 1000 / 15000; // 15 km = 1,000 px
const HOLE_BOT = GY + 12262 * PXM;
const SEA_H = 10935 * PXM;

const BoreScene: React.FC<{ f: number; children?: React.ReactNode; speed?: number }> = ({ f, children, speed = 5 }) => (
  <g>
    <Sky stops={["#1E6678", "#4FB5DE", "#F6B45A"]} x={0} y={0} w={W} h={GY + 30} />
    <CloudRack f={f} n={3} x0={-400} x1={1500} y0={40} y1={GY - 40} size={90} speed={2.4} body={C.cream} under={C.ice} top="#FFFFFF" seed={5} />
    <rect x={0} y={GY} width={W} height={H - GY} fill="#146A6C" />
    <Strata f={f} speed={speed} bands={BANDS} y0={GY} amp={20} />
    {children}
  </g>
);

/** 6 The ocean slides into the bore. */
const s6: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 3);
  const top = mix(GY - SEA_H, GY, k);
  const col = `M${HX - 90} ${top} L${HX + 90} ${top} L${HX + 90} ${top + SEA_H} L${HX - 90} ${top + SEA_H} Z`;
  return (
    <g>
      <BoreScene f={f} speed={8}>
        <rect x={HX - 100} y={GY} width={200} height={12262 * PXM} rx={20} fill={C.ink} />
        <clipPath id="s41c6">
          <rect x={HX - 90} y={GY} width={180} height={HOLE_BOT - GY} />
        </clipPath>
        <g clipPath="url(#s41c6)">
          <path d={col} fill={C.sea} />
          <path d={seaSurface(f * 2, HX - 90, HX + 90, top, 9, 120, 2, top + 40, 15)} fill="#7FD0E8" />
          <Bubbles frame={f} x0={HX - 70} x1={HX + 70} y={top + SEA_H - 20} n={18} color={C.foam} seed={4} rise={3} size={6} />
        </g>
        <T x={300} y={GY + 190} text="OCEAN" size={74} color={C.foam} opacity={ez(f, 4, 12)} />
        <T x={300} y={GY + 268} text="DEEPEST POINT" size={42} color={C.cream} opacity={ez(f, 4, 12)} />
        <Plaque x={300} y={HOLE_BOT + 4} text="WIDTH NOT TO SCALE" size={30} bg={C.ink} fg={C.cream} />
      </BoreScene>
    </g>
  );
};

/** 7 Challenger Deep: close on the water column. */
const s7: Shot = ({ f }) => (
  <g>
    <Sky stops={["#2A8FC4", "#1B6FA8", "#0A3C4C"]} x={0} y={0} w={W} h={H} />
    <rect x={190} y={200} width={700} height={1000} rx={48} fill="#1B6FA8" />
    <rect x={190} y={200} width={700} height={1000} rx={48} fill="none" stroke={C.ink} strokeWidth={26} />
    <Caustics2 f={f} />
    <Bubbles frame={f} x0={230} x1={850} y={1180} n={34} color={C.foam} seed={9} rise={4} size={11} />
    <Plaque x={540} y={470} text="10,935 M" size={120} bg={C.ink} fg={C.amber} />
    <T x={540} y={640} text="CHALLENGER DEEP" size={74} />
    <T x={540} y={730} text="THE OCEAN'S DEEPEST POINT" size={40} color={C.foam} />
  </g>
);
const Caustics2: React.FC<{ f: number }> = ({ f }) => <Caustics f={f} x={210} y={220} w={660} h={960} rows={7} color={C.foam} width={9} opacity={0.38} speed={3.2} />;

/** 8 The kilometre left over. */
const s8: Shot = ({ f }) => {
  const top = GY;
  return (
    <g>
      <BoreScene f={f} speed={7}>
        <rect x={HX - 100} y={GY} width={200} height={12262 * PXM} rx={20} fill={C.ink} />
        <rect x={HX - 90} y={top} width={180} height={SEA_H} fill={C.sea} />
        <path d={seaSurface(f * 2, HX - 90, HX + 90, top, 7, 120, 2, top + 40, 15)} fill="#7FD0E8" />
        <Bubbles frame={f} x0={HX - 70} x1={HX + 70} y={top + SEA_H} n={14} color={C.foam} seed={4} rise={3} size={6} />
        <g opacity={0.55 + 0.45 * Math.abs(Math.sin(f / 5))}>
          <rect x={HX - 90} y={GY + SEA_H} width={180} height={HOLE_BOT - GY - SEA_H} fill={C.amber} opacity={0.35} />
          <path d={`M${HX + 130} ${GY + SEA_H} h26 V${HOLE_BOT} h-26`} stroke={C.amber} strokeWidth={10} fill="none" strokeLinecap="round" />
        </g>
        <Plaque x={300} y={GY + SEA_H + 50} text="1 KM+" size={96} bg={C.ink} fg={C.amber} />
        <T x={300} y={GY + SEA_H + 170} text="TO SPARE" size={64} />
        <Tick x={190} y={900 + 0} pxPerM={300} frame={f} pose="point" expression="happy" />
      </BoreScene>
    </g>
  );
};

/** 9 Zoom out to the crust: the hole is a short scratch near the top. */
const s9: Shot = ({ f, n }) => {
  const z = mix(4.2, 1, ez(f, 0, n - 4));
  const CB = 1160; // crust base
  const tip = 250 + (CB - 250) * (12262 / 40000);
  return (
    <g>
      <Sky stops={["#4FB5DE", "#9BD6E8"]} x={0} y={0} w={W} h={260} />
      <g transform={`translate(540 250) scale(${z}) translate(-540 -250)`}>
        <rect x={0} y={250} width={W} height={CB - 250} fill="#146A6C" />
        <Strata f={f} speed={3} bands={BANDS} y0={250} y1={CB} amp={26} seed={3} />
        <rect x={0} y={CB} width={W} height={H - CB} fill={C.orange} />
        <Glow x={540} y={CB + 60} r={600} color={C.gold} f={f} strength={0.8} period={40} />
        <rect x={528} y={250} width={24} height={tip - 250} rx={12} fill={C.ink} />
        <circle cx={540} cy={tip} r={18 + 7 * Math.sin(f / 3)} fill={C.amber} />
        <circle cx={540} cy={tip} r={50 + 12 * Math.sin(f / 3)} fill={C.amber} opacity={0.3} />
      </g>
      <g opacity={ez(f, 10, 20)}>
        <path d={`M900 250 h40 V${CB} h-40`} stroke={C.cream} strokeWidth={8} fill="none" strokeLinecap="round" />
        <Plaque x={760} y={720} text="CRUST ~40 KM" size={60} bg={C.ink} fg={C.cream} />
        <Plaque x={330} y={tip + 4} text="12 KM" size={70} bg={C.ink} fg={C.amber} />
      </g>
      <Chips f={f} n={10} y0={260} y1={1150} color={C.gold} speed={5} opacity={0.3} seed={2} />
    </g>
  );
};

/** 10 Ring gauge: not even a third. */
const s10: Shot = ({ f, n }) => {
  const k = ez(f, 0, n - 6);
  const R = 300;
  const a = (-Math.PI / 2) + k * Math.PI * 2 * (12262 / 40000);
  const cx = 540;
  const cy = 640;
  const big = k * (12262 / 40000) > 0.5 ? 1 : 0;
  return (
    <g>
      <Sky stops={["#146A6C", "#1FA69A", "#66BEAD"]} x={0} y={0} w={W} h={H} />
      <g transform={`translate(${cx} ${cy}) rotate(${f * 1.2})`} opacity={0.35}>
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d={`M0 0 L${700 * Math.cos((i * Math.PI) / 6 - 0.12)} ${700 * Math.sin((i * Math.PI) / 6 - 0.12)} L${700 * Math.cos((i * Math.PI) / 6 + 0.12)} ${700 * Math.sin((i * Math.PI) / 6 + 0.12)} Z`} fill={C.gold} />
        ))}
      </g>
      <circle cx={cx} cy={cy} r={R} fill={C.ink} />
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="#0A3C4C" strokeWidth={70} />
      <path d={`M${cx} ${cy - R} A${R} ${R} 0 ${big} 1 ${cx + R * Math.cos(a)} ${cy + R * Math.sin(a)}`} stroke={C.amber} strokeWidth={70} fill="none" strokeLinecap="round" />
      <circle cx={cx + R * Math.cos(a)} cy={cy + R * Math.sin(a)} r={46 + 8 * Math.sin(f / 3)} fill={C.cream} opacity={0.8} />
      <T x={cx} y={cy - 110} text="NOT EVEN" size={84} />
      <T x={cx} y={cy + 60} text="1/3" size={170} color={C.amber} />
      <T x={cx} y={1100} text="OF THE CRUST" size={78} opacity={ez(f, 10, 20)} />
    </g>
  );
};

/** 11 Twenty years: the rig works through a time-lapse. */
const s11: Shot = ({ f, n }) => {
  const yrs = 20 * ez(f, 2, n - 3);
  const sunA = ez(f, 0, n) * Math.PI;
  return (
    <g>
      <Sky stops={["#1E6678", "#4FB5DE", "#F6B45A"]} x={0} y={0} w={W} h={1100} />
      <Bloom x={540 - Math.cos(sunA) * 440} y={700 - Math.sin(sunA) * 440} r={380} color={C.gold} strength={0.9} core={64} coreColor="#FFF1C2" />
      <CloudRack f={f} n={5} x0={-420} x1={1500} y0={240} y1={800} size={120} speed={7} body={C.cream} under={C.ice} top="#FFFFFF" seed={2} />
      <rect x={0} y={1000} width={W} height={H - 1000} fill={C.ice} />
      <Chips f={f} n={14} y0={1030} y1={1260} color={C.foam} speed={20} opacity={0.6} seed={5} />
      <Derrick f={f * 2} x={300} y={1040} s={1.9} />
      <rect x={470} y={230} width={540} height={290} rx={46} fill={C.ink} opacity={0.92} />
      <Counter x={650} y={430} value={yrs} max={20} size={170} color={C.amber} align="middle" digits={2} />
      <text x={760} y={440} style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 56, fill: C.cream }}>
        YEARS
      </text>
      <T x={740} y={580} text="ABOUT" size={50} color={C.cream} />
    </g>
  );
};

/** 12 Then they stopped: lights out, a stamp slams down. */
const s12: Shot = ({ f, n }) => {
  const slam = ez(f, 6, 14);
  const sc = mix(3, 1, slam);
  const shake = f > 14 && f < 24 ? Math.sin(f * 3) * (24 - f) * 0.6 : 0;
  return (
    <g>
      <Tundra f={f} hy={1040} night speed={2.6} />
      <Derrick f={f} x={320} y={1060} s={1.8} on={f < 8} body="#0E4658" />
      <Tick x={800} y={1180} pxPerM={430} frame={f} expression="sleepy" pose="shrug" slump={0.6} facing={-1} />
      <g transform={`translate(${540 + shake} 330) rotate(-8) scale(${sc})`} opacity={slam}>
        <rect x={-360} y={-100} width={720} height={200} rx={36} fill={C.ink} stroke={C.amber} strokeWidth={12} />
        <text x={0} y={52} textAnchor="middle" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 136, fill: C.amber, letterSpacing: 4 }}>
          STOPPED
        </text>
      </g>
      {f > 14 ? <Ripples frame={(f - 14) * 3} cx={540} cy={560} rx={620} ry={400} period={14} count={1} color={C.gold} width={10} strength={0.8} /> : null}
    </g>
  );
};

const EARTH: [number, string][] = [
  [560, "#1FA69A"],
  [548, "#E3813F"],
  [330, "#FFCF73"],
  [170, "#FFC83D"],
];

/** 13 Not out of planet: the globe is vast, the hole a scratch. */
const s13: Shot = ({ f, n }) => {
  const zoom = mix(0.82, 1.0, ez(f, 0, n));
  return (
    <g>
      <Sky stops={["#06222B", "#0A3C4C", "#11707A"]} x={0} y={0} w={W} h={H} />
      <Stars frame={f} n={90} w={W} h={H - 300} color={C.foam} size={3.2} twinkle={0.75} seed={7} />
      <Streamers f={f} n={6} x0={-300} x1={1400} y0={100} y1={1100} len={500} width={30} speed={3} color={C.teal} opacity={0.3} slope={0.04} seed={3} />
      <g transform={`translate(540 640) scale(${zoom}) translate(-540 -640)`}>
        <circle cx={540} cy={640} r={470} fill="#1E8A88" />
        <circle cx={540} cy={640} r={440} fill={C.orange} />
        <circle cx={540} cy={640} r={280} fill={C.gold} />
        <circle cx={540} cy={640} r={145} fill={C.amber} />
        <g transform={`rotate(${f * 1.4} 540 640)`}>
          {Array.from({ length: 8 }, (_, i) => (
            <path key={i} d="M540 240 q 40 -24 80 0" stroke={C.cream} strokeWidth={14} fill="none" strokeLinecap="round" transform={`rotate(${i * 45} 540 640)`} opacity={0.8} />
          ))}
        </g>
        <g transform={`rotate(${-f * 2.2} 540 640)`} opacity={0.65}>
          <circle cx={540} cy={640} r={215} fill="none" stroke={C.cream} strokeWidth={14} strokeDasharray="60 90" strokeLinecap="round" />
        </g>
        <circle cx={540} cy={172} r={22 + 10 * Math.sin(f / 3)} fill="none" stroke={C.cream} strokeWidth={6} />
        <rect x={538} y={172} width={4} height={8} fill={C.ink} />
      </g>
      <T x={540} y={1215} text="THE HOLE: A SCRATCH" size={64} opacity={ez(f, 8, 18)} />
    </g>
  );
};

/** 14 Something fought back: the tip glows, a crack runs up the bore. */
const s14: Shot = ({ f, n }) => {
  const k = ez(f, 4, n - 2);
  const crack = "M540 1060 L584 920 L508 820 L574 700 L496 580 L556 460 L520 340";
  const sx = Math.sin(f * 2.1) * 6 * ramp(f, 4, 20);
  return (
    <g transform={`translate(${sx} 0)`}>
      <Sky stops={["#2B0C08", "#6A2210", "#B04A18"]} x={0} y={0} w={W} h={H} />
      <Strata f={f} speed={5} bands={[[170, "#B04A18"], [120, "#7A3418"], [190, "#E3813F"], [140, "#6A2210"]]} amp={22} seed={6} />
      <rect x={0} y={0} width={W} height={H} fill={C.maroon} opacity={0.25} />
      <rect x={516} y={0} width={48} height={1060} rx={24} fill={C.ink} />
      <Glow x={540} y={1060} r={560} color={C.gold} f={f} strength={1} period={16} />
      <circle cx={540} cy={1060} r={64 + 8 * Math.sin(f / 2)} fill={C.amber} />
      <circle cx={540} cy={1060} r={34} fill="#FFF1C2" />
      <path d={crack} fill="none" stroke={C.ink} strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1200" strokeDashoffset={1200 * (1 - k)} />
      <Emissive d={crack} color={C.gold} core="#FFF1C2" width={7} opacity={k} strength={1} />
      <Embers frame={f} x0={380} x1={700} y={1100} n={34} color={C.amber} seed={3} rise={4.5} />
      <Streamers f={f} n={8} x0={-200} x1={1300} y0={300} y1={1100} len={330} width={22} speed={5} color={C.gold} opacity={0.25} slope={-0.2} seed={7} />
    </g>
  );
};

/** 15 What stopped it? A huge question over fast rock. */
const s15: Shot = ({ f }) => {
  const s = 1 + 0.06 * Math.sin(f / 4);
  return (
    <g>
      <Sky stops={["#2B0C08", "#B04A18", "#E3813F"]} x={0} y={0} w={W} h={H} />
      <Strata f={f} speed={22} bands={[[150, "#B04A18"], [110, "#E3813F"], [170, "#7A3418"], [120, "#F6B45A"]]} amp={24} seed={2} />
      <rect x={0} y={150} width={W} height={1050} fill={C.ink} opacity={0.4} />
      <g transform={`translate(540 640) scale(${s})`}>
        <text x={0} y={250} textAnchor="middle" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 760, fill: C.amber, stroke: C.ink, strokeWidth: 30, paintOrder: "stroke" }}>
          ?
        </text>
      </g>
      <T x={540} y={1100} text="WHAT STOPPED IT?" size={86} />
    </g>
  );
};

/** 16 Tick at the lip of the hole, thinking. */
const s16: Shot = ({ f, n }) => (
  <g>
    <Tundra f={f} hy={980} speed={2.2} />
    <Chips f={f} n={16} y0={1010} y1={1260} color={C.foam} speed={18} opacity={0.6} seed={9} />
    {dirty(300, 1180, 130, 34, 0.95)}
    <Tick x={780} y={1170} pxPerM={540} frame={f} expression="thinking" pose="think" facing={-1} />
    <Risers frame={f} x0={230} x1={370} y={1150} n={5} color={C.amber} rise={5} life={60} size={14} wiggle={20} glow />
    <g>
      {[0, 1, 2].map((i) => {
        const age = (f * 1.0 + i * 20) % 60;
        return (
          <text key={i} x={300 + (i - 1) * 90 + Math.sin(age / 8 + i) * 20} y={1100 - age * 9} textAnchor="middle" opacity={Math.min(1, age / 8) * (1 - age / 60)} style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 130, fill: C.amber, stroke: C.ink, strokeWidth: 10, paintOrder: "stroke" }}>
            ?
          </text>
        );
      })}
    </g>
  </g>
);

/** 17 End card. */
const s17: Shot = ({ f }) => <EndShot f={f} stops={["#2B0C08", "#B04A18", "#E3813F"]} q={["WHAT STOPPED THE", "DEEPEST HOLE EVER DUG?"]} size={62} />;

export const ShortS41 = makeShort(timeline, [[s0, s1, s2], [s3, s4, s5], [s6, s7, s8], [s9, s10], [s11, s12], [s13, s14], [s15, s16, s17]]);
