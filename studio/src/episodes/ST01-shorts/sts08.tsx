// STS08 (not-earth): ST01 lines [48, 49, 50]. Shot bodies only; layout rules in lib/suppose/vshort.tsx.
// WITHHOLDS the answer (what a twice-wide Earth would really be): these shots show only real, measured planets; nothing
// ties the gas-wrapped worlds back to our make-believe Earth. The dot wall is a SKETCH of Fulton et al. (2017).
// On screen (spoken here): 1.5, 2, 3 (widths in Earths); no other figures.
import React from "react";
import { VShot } from "../../lib/suppose/vshort";
import { Bloom, LightWash } from "../../lib/illustrated/light";
import { rnd } from "../../lib/illustrated/motion";
import { rrect, roundPoly, smoothPath } from "../../lib/illustrated/shapes";
import { AIR, BRASS, CHALK, INK, LIME, OCEAN, SUPPOSE, TERRA } from "../../lib/suppose/palette";
import { Lev } from "../../lib/suppose/lev";
import { PuffPlanet } from "../ST01-earth-twice-as-big/acts/l06-parts";
import { Chip, T, TERRA_LIT, VPill, VStage, ease, lin, mix, pop } from "./vparts-b";

const CF = SUPPOSE.chalk;
const OF = SUPPOSE.olive;

// ------------------------------------------------------------------ the dot wall, sketched for the tall frame
const AXIS = 1060;
const wxv = (w: number) => 120 + ((w - 0.5) / 3.5) * 800;
type Dot = { k: number; x: number; y: number; j: number; w: number; fill: string };
const WALLV: Dot[] = (() => {
  const out: Dot[] = [];
  let k = 0;
  for (let w = 0.55; w < 4; w += 0.1) {
    const n = Math.round(30 * Math.exp(-(((w - 1.3) / 0.28) ** 2)) + 27 * Math.exp(-(((w - 2.4) / 0.5) ** 2)) + 2 * Math.exp(-(((w - 3.4) / 0.6) ** 2)));
    for (let j = 0; j < n; j++) {
      k++;
      out.push({ k, x: wxv(w) + (rnd(k) - 0.5) * 5, y: AXIS - 14 - j * 17, j, w, fill: w < 1.75 ? TERRA : OCEAN });
    }
  }
  return out;
})();
const GX0 = wxv(1.5), GX1 = wxv(2.0), GCX = (GX0 + GX1) / 2;
const GAP_TOP = 470;

const WallFrame: React.FC<{ title?: number }> = ({ title = 1 }) => (
  <g>
    <g opacity={title}>
      <T x={540} y={340} size={46} fill={INK}>Small planets close to their stars</T>
      <VPill x={540} y={398} text="SKETCH" dark={false} />
    </g>
    <path d={`M 100 ${AXIS} H 940`} stroke={INK} strokeWidth={5} strokeLinecap="round" />
    {[1.5, 2, 3].map((w) => (
      <g key={w}>
        <path d={`M ${wxv(w)} ${AXIS} v 16`} stroke={INK} strokeWidth={4} />
        <T x={wxv(w)} y={AXIS + 56} size={38} fill={INK}>{w}</T>
      </g>
    ))}
    <T x={500} y={AXIS + 108} size={30} ls={2} fill={CF.dim}>WIDTH, IN EARTHS</T>
  </g>
);
const Dots: React.FC<{ lift?: (p: Dot) => number; grow?: (p: Dot) => number; f?: number }> = ({ lift, grow }) => (
  <g>
    {WALLV.map((p) => {
      const k = lift ? lift(p) : 0;
      const g = grow ? grow(p) : 0;
      return <circle key={p.k} cx={p.x} cy={p.y - k} r={8.2 + g} fill={p.fill} opacity={0.92} />;
    })}
  </g>
);

// ------------------------------------------------------------------ line 48 · shot 1: a stranger clue (Lev at a telescope)
const Clue: VShot = ({ t, d, f }) => {
  const G = 1090;
  const ang = mix(-18, -52, ease(t, 4, 46));
  const apex: [number, number] = [650, 930];
  const q = pop(t, 40, 16);
  return (
    <VStage fam="olive" t={t} d={d} f={f} push={0.04} cy={760}>
      <Bloom x={760} y={520} r={460} color={OF.bounce} strength={0.3 * ease(t, 36, 56)} />
      {[0, 1, 2].map((i) => {
        const age = t - 42 - i * 14;
        return age > 0 && age < 50 ? <circle key={i} cx={780} cy={500} r={90 + age * 4} fill="none" stroke={CHALK} strokeWidth={4} opacity={(1 - age / 50) * 0.5} /> : null;
      })}
      {q > 0 ? (
        <g transform={`translate(780 500) scale(${q.toFixed(3)}) rotate(${Math.sin(t / 9) * 6})`}>
          <T x={0} y={80} size={240} fill={CHALK}>?</T>
        </g>
      ) : null}
      <path d={smoothPath([[-40, G + 20], [300, G - 30], [640, G - 10], [900, G - 50], [1120, G - 20]]) + " L 1120 1920 L -40 1920 Z"} fill={OF.near} />
      <path d={smoothPath([[-40, G + 20], [300, G - 30], [640, G - 10], [900, G - 50], [1120, G - 20]])} stroke={OF.bounce} strokeWidth={4} fill="none" opacity={0.5} />
      {/* tripod + tube */}
      {[-70, 0, 70].map((dx) => <path key={dx} d={`M ${apex[0]} ${apex[1]} L ${apex[0] + dx} ${G - 18}`} stroke={INK} strokeWidth={10} strokeLinecap="round" />)}
      <g transform={`translate(${apex[0]} ${apex[1]}) rotate(${ang})`}>
        <path d={rrect(-110, -30, 330, 60, 24)} fill={TERRA} stroke={INK} strokeWidth={5} />
        <path d={rrect(200, -40, 50, 80, 14)} fill={BRASS} stroke={INK} strokeWidth={5} />
        <path d={rrect(-150, -18, 50, 36, 10)} fill={BRASS} stroke={INK} strokeWidth={4} />
        <path d={`M -90 -14 H 180`} stroke={TERRA_LIT} strokeWidth={8} strokeLinecap="round" opacity={0.7} />
      </g>
      <circle cx={apex[0]} cy={apex[1]} r={14} fill={INK} />
      <Lev x={430} y={G - 22} h={220} frame={f} pose="point" hands={{ front: [62, -150] }} eyes="up" tilt={-12} wind={0.4} shade="#AFB79A" />
    </VStage>
  );
};

// ------------------------------------------------------------------ line 48 · shot 2: thousands of planets, measured
const Thousands: VShot = ({ t, d, f }) => {
  const N = 1500;
  const cols = [TERRA, OCEAN, AIR, OF.light, BRASS];
  const span = Math.max(30, d - 20);
  const dots: React.ReactNode[] = [];
  for (let i = 0; i < N; i++) {
    const at = 4 + span * Math.sqrt(rnd(i * 3 + 1));
    if (t < at) continue;
    const a = rnd(i * 5 + 2) * Math.PI * 2;
    const rr = Math.sqrt(rnd(i * 7 + 3));
    const x = 540 + Math.cos(a) * rr * 470;
    const y = 740 + Math.sin(a) * rr * 380;
    const age = t - at;
    const r = (2.2 + rnd(i * 11) * 3) * pop(t, at, 8);
    dots.push(
      <g key={i}>
        {age < 10 ? <circle cx={x} cy={y} r={4 + age * 1.8} fill="none" stroke={OF.light} strokeWidth={1.6} opacity={(1 - age / 10) * 0.7} /> : null}
        <circle cx={x} cy={y} r={r} fill={cols[i % 5]} opacity={0.6 + 0.4 * Math.sin(f / 9 + i)} />
      </g>,
    );
  }
  return (
    <VStage fam="olive" t={t} d={d} f={f} push={0.06} cy={740}>
      <Bloom x={540} y={740} r={620} color={OF.bounce} strength={0.25} spread={0.5} />
      {dots}
      <g opacity={ease(t, 10, 24)}>
        <T x={540} y={340} size={50} ls={2}>THOUSANDS OF PLANETS</T>
        <T x={540} y={396} size={34} ls={2} fill={OF.dim}>AROUND OTHER STARS</T>
      </g>
    </VStage>
  );
};

// ------------------------------------------------------------------ line 48 · shot 3: the small close-in ones sort by width
const WallForms: VShot = ({ t, d, f }) => {
  const gap = ease(t, d * 0.72, d * 0.9);
  return (
    <VStage fam="chalk" t={t} d={d} f={f} push={0.02}>
      <WallFrame title={ease(t, 0, 14)} />
      {gap > 0 ? <rect x={GX0} y={GAP_TOP + (AXIS - 10 - GAP_TOP) * (1 - gap)} width={GX1 - GX0} height={(AXIS - 10 - GAP_TOP) * gap} fill={LIME} opacity={0.16} /> : null}
      {WALLV.map((p) => {
        const land = 4 + p.j * 2.1 + rnd(p.k * 7) * 18;
        const start = land - 18;
        if (t < start) return null;
        const q = Math.min(1, (t - start) / 18);
        const y = mix(420, p.y, Math.pow(q, 1.4));
        return <circle key={p.k} cx={p.x} cy={y} r={8.2} fill={p.fill} opacity={0.92 * Math.min(1, q * 5)} />;
      })}
      <g opacity={ease(t, d * 0.85, d * 0.95)}>
        <T x={GCX} y={GAP_TOP - 20} size={40} fill={INK}>A GAP</T>
      </g>
    </VStage>
  );
};

// ------------------------------------------------------------------ line 49 · shot 1: plenty small, plenty two to three times
const Humps: VShot = ({ t, d, f }) => {
  const sL = lin(t, 4, 50), sR = lin(t, 56, 110);
  const hl = (p: Dot) => (p.w < 1.5 ? ease(t, 4, 24) : p.w > 1.95 ? ease(t, 56, 76) : 0);
  return (
    <VStage fam="chalk" t={t} d={d} f={f} push={0.02}>
      <WallFrame />
      {sL > 0 && sL < 1 ? <LightWash x={mix(wxv(0.6), wxv(1.5), sL)} y={850} rx={120} ry={300} color={CF.light} strength={0.9} /> : null}
      {sR > 0 && sR < 1 ? <LightWash x={mix(wxv(1.95), wxv(3.3), sR)} y={880} rx={150} ry={280} color={CF.light} strength={0.9} /> : null}
      <Dots lift={(p) => hl(p) * 3 * Math.sin(f / 6 + p.j * 0.6)} grow={(p) => hl(p) * 1.2} />
      <g transform={`translate(300 480) scale(${Math.min(1.04, pop(t, 10, 14)).toFixed(3)})`}>
        <T x={0} y={0} size={38} fill={TERRA}>SMALLER THAN 1.5</T>
      </g>
      <g transform={`translate(660 540) scale(${Math.min(1.04, pop(t, 62, 14)).toFixed(3)})`}>
        <T x={0} y={0} size={38} fill={OCEAN}>2 TO 3 TIMES AS WIDE</T>
      </g>
    </VStage>
  );
};

// ------------------------------------------------------------------ line 49 · shot 2: far fewer in between
const Gap: VShot = ({ t, d, f }) => {
  const gap = ease(t, 4, 30);
  const br = ease(t, 20, 50);
  const bw = GX1 - GX0;
  return (
    <VStage fam="chalk" t={t} d={d} f={f} push={0.04} cy={820}>
      <WallFrame />
      <rect x={GX0} y={GAP_TOP + (AXIS - 10 - GAP_TOP) * (1 - gap)} width={bw} height={(AXIS - 10 - GAP_TOP) * gap} fill={LIME} opacity={0.14 + 0.06 * Math.sin(f / 10) * gap} />
      {gap > 0.99 ? <path d={`M ${GX0} ${GAP_TOP} V ${AXIS - 10} M ${GX1} ${GAP_TOP} V ${AXIS - 10}`} stroke={INK} strokeWidth={3} strokeDasharray="10 12" strokeDashoffset={-t * 2} opacity={0.6} /> : null}
      <Dots lift={(p) => (p.w >= 1.5 && p.w < 2 ? 4 * Math.abs(Math.sin(f / 5 + p.j)) : 0)} grow={(p) => (p.w < 1.5 || p.w >= 2 ? -2.5 * ease(t, 10, 30) : 1.5)} />
      {br > 0 ? <path d={`M ${GX0} ${GAP_TOP + 70} v -18 H ${GX0 + bw * br} ${br > 0.98 ? "v 18" : ""}`} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
      <g transform={`translate(${GCX} ${GAP_TOP + 26}) scale(${Math.min(1.04, pop(t, 44, 14)).toFixed(3)})`}>
        <T x={0} y={0} size={48} fill={INK}>FAR FEWER</T>
      </g>
    </VStage>
  );
};

// ------------------------------------------------------------------ a measured planet (no answer drawn on it: just a lit ball)
const Planet: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <g>
    <defs>
      <radialGradient id="s08pl" cx="36%" cy="30%" r="78%">
        <stop offset={0} stopColor="#CFE7EE" />
        <stop offset={0.5} stopColor="#7DB3C6" />
        <stop offset={1} stopColor="#2E5E70" />
      </radialGradient>
    </defs>
    <circle cx={x} cy={y} r={r} fill="url(#s08pl)" />
    {[-0.35, 0, 0.32].map((dy, i) => (
      <path key={i} d={`M ${x - r * Math.sqrt(1 - dy * dy) * 0.92} ${y + dy * r} Q ${x} ${y + dy * r + r * 0.08} ${x + r * Math.sqrt(1 - dy * dy) * 0.92} ${y + dy * r}`} stroke={CHALK} strokeWidth={r * 0.05} fill="none" opacity={0.25} />
    ))}
  </g>
);

const SCALE = { x: 540, top: 750, bot: 1180, platY: 740 };
const ScaleBody: React.FC<{ dial: React.ReactNode; sq?: number }> = ({ dial, sq = 0 }) => (
  <g>
    <path d={roundPoly([[210, SCALE.top], [870, SCALE.top], [900, SCALE.bot], [180, SCALE.bot]], 34)} fill={CHALK} stroke={INK} strokeWidth={5} />
    <rect x={230} y={SCALE.platY - 6 + sq * 30} width={620} height={28} rx={14} fill={INK} opacity={0.85} />
    {dial}
  </g>
);

// ------------------------------------------------------------------ line 50 · shot 1: weigh a close-in planet 1.5 Earths wide or more
const Weigh: VShot = ({ t, d, f }) => {
  const rise = ease(t, 6, 44);
  const src: [number, number] = [wxv(1.9), AXIS - 14 - 17 * 4];
  const R = 150;
  const drop = ease(t, 70, 92);
  const x = mix(src[0], 540, rise);
  const y = drop > 0 ? mix(570, SCALE.platY - R, drop * drop) : mix(src[1], 570, rise);
  const r = mix(8.2, R, ease(t, 8, 50));
  const fade = 1 - ease(t, 4, 40);
  const scaleIn = ease(t, 50, 72);
  const sq = t > 92 && t < 104 ? Math.sin(((t - 92) / 12) * Math.PI) * 0.06 : 0;
  return (
    <VStage fam="chalk" t={t} d={d} f={f} push={0.02}>
      <g opacity={fade}>
        <WallFrame title={0} />
        <Dots />
      </g>
      <g transform={`translate(0 ${(1 - scaleIn) * 60})`} opacity={scaleIn}>
        <ScaleBody sq={sq} dial={<circle cx={540} cy={975} r={150} fill="#FFFFF4" stroke={INK} strokeWidth={5} />} />
      </g>
      <Planet x={x} y={y} r={r} />
      <g opacity={ease(t, 20, 36)}>
        <T x={540} y={330} size={40} fill={INK}>CLOSE-IN PLANETS</T>
        <T x={540} y={384} size={40} fill={INK}>1.5 EARTHS WIDE OR BIGGER</T>
      </g>
    </VStage>
  );
};

// ------------------------------------------------------------------ line 50 · shot 2: too light to be solid rock and iron
const dir = (a: number): [number, number] => [Math.cos((a * Math.PI) / 180), Math.sin((a * Math.PI) / 180)];
const TooLight: VShot = ({ t, d, f }) => {
  const R = 150;
  const target = 218;
  const tt = Math.max(0, t - 4);
  const ang = target + 100 * Math.exp(-tt / 30) * Math.cos(tt / 5.5) + Math.sin(t / 5) * 2;
  const dX = 540, dY = 975, dR = 180;
  const [nx, ny] = dir(ang);
  const arc = (a0: number, a1: number, rr: number) => {
    const [x0, y0] = dir(a0), [x1, y1] = dir(a1);
    return `M ${dX + x0 * rr} ${dY + y0 * rr} A ${rr} ${rr} 0 0 1 ${dX + x1 * rr} ${dY + y1 * rr}`;
  };
  const head = ease(t, 60, 76);
  return (
    <VStage fam="chalk" t={t} d={d} f={f} push={0.02}>
      <ScaleBody
        dial={
          <g>
            <circle cx={dX} cy={dY} r={dR} fill="#FFFFF4" stroke={INK} strokeWidth={6} />
            <path d={arc(196, 250, 150)} stroke={AIR} strokeWidth={26} fill="none" />
            <path d={arc(290, 344, 150)} stroke={TERRA} strokeWidth={26} fill="none" />
            {Array.from({ length: 17 }, (_, i) => {
              const [ux, uy] = dir(190 + i * 10);
              return <path key={i} d={`M ${dX + ux * 128} ${dY + uy * 128} L ${dX + ux * 142} ${dY + uy * 142}`} stroke={INK} strokeWidth={4} />;
            })}
            <T x={dX - 85} y={dY + 92} size={34} fill={OCEAN}>LIGHT</T>
            <T x={dX + 85} y={dY + 74} size={32} fill={TERRA}>ROCK +</T>
            <T x={dX + 85} y={dY + 110} size={32} fill={TERRA}>IRON</T>
            <path d={`M ${dX} ${dY} L ${dX + nx * 150} ${dY + ny * 150}`} stroke={INK} strokeWidth={9} strokeLinecap="round" />
            <circle cx={dX} cy={dY} r={18} fill={INK} />
          </g>
        }
      />
      <Planet x={540} y={SCALE.platY - R} r={R} />
      <g transform={`translate(540 360) scale(${Math.min(1.04, pop(t, 60, 14)).toFixed(3)})`} opacity={head > 0 ? 1 : 0}>
        <path d={rrect(-400, -56, 800, 80, 40)} fill={INK} opacity={0.85} />
        <T x={0} y={0} size={46}>TOO LIGHT FOR SOLID ROCK</T>
      </g>
    </VStage>
  );
};

// ------------------------------------------------------------------ line 50 · shot 3: wrapped in something lighter
const Wrapped: VShot = ({ t, d, f }) => {
  const core = 120;
  const gas = core + 190 * ease(t, 8, 60);
  const water = mix(core, core + 50, ease(t, 70, 100));
  return (
    <VStage fam="olive" t={t} d={d} f={f} push={0.03} cy={640}>
      <PuffPlanet x={540} y={630} core={core} gas={gas} water={water} f={f} />
      <Chip x={240} y={1030} text="ROCK" dot={TERRA} k={pop(t, 2, 14)} size={38} />
      <Chip x={620} y={1030} text="THICK GAS" dot={AIR} k={pop(t, 28, 14)} size={38} />
      <Chip x={540} y={1115} text="MAYBE WATER" dot={OCEAN} k={pop(t, 82, 14)} size={38} />
    </VStage>
  );
};

export const SHOTS_08: VShot[][] = [
  [Clue, Thousands, WallForms],
  [Humps, Gap],
  [Weigh, TooLight, Wrapped],
];

