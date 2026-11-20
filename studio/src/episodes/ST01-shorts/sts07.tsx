// STS07 (short-mountains): ST01 lines [0, 23, 24]. Shot bodies only; layout rules in lib/suppose/vshort.tsx.
// On screen (spoken here): ×2 (twice as wide), ~2/5 g (two fifths), ~3× (three times as tall). Heights drawn to scale:
// twice the gravity → half-height mountains (height limit ∝ 1/g); Mars pull arrow = 2/5 of Earth's; Olympus = 3 Everests.
import React from "react";
import { VShot } from "../../lib/suppose/vshort";
import { Bloom, GroundShadow } from "../../lib/illustrated/light";
import { smoothPath } from "../../lib/illustrated/shapes";
import { CHALK, INK, SUPPOSE, TERRA } from "../../lib/suppose/palette";
import { Earth } from "../../lib/suppose/frames";
import { Lev } from "../../lib/suppose/lev";
import { Mars, Mountain, mtnPath } from "../ST01-earth-twice-as-big/acts/l03-parts";
import { OpenPull, OpenSame, T, TERRA_LIT, VArrow, VPill, VStage, ease, lin, mix, pop } from "./vparts-b";

const CLAY = SUPPOSE.clay;
const TERRA_DARK = "#8A3A20";
const LEV_SHADE = "#D8B8A2";

const Ground: React.FC<{ y: number }> = ({ y }) => (
  <g>
    <path d={smoothPath([[-40, y - 90], [260, y - 130], [560, y - 80], [860, y - 120], [1120, y - 90]]) + ` L 1120 1920 L -40 1920 Z`} fill={CLAY.far} opacity={0.55} />
    <rect x={-40} y={y} width={1160} height={900} fill={CLAY.near} />
  </g>
);

const Puff: React.FC<{ x: number; y: number; a: number }> = ({ x, y, a }) =>
  a < 0 || a > 30 ? null : (
    <g opacity={1 - a / 30}>
      {[-1, 0, 1].map((s) => <circle key={s} cx={x + s * a * 2.4} cy={y - a * 1.2 - Math.abs(s) * 6} r={12 + a * 0.9} fill={CLAY.light} />)}
    </g>
  );

// ------------------------------------------------------------------ line 23 · shot 1: the mountains change too (sink to half)
const MountainsSink: VShot = ({ t, d, f }) => {
  const G = 1100;
  const k = ease(t, 14, 84);
  const peaks: [number, number, number, number][] = [[260, 300, 560, 0], [860, 280, 610, 10], [560, 360, 430, 20]];
  return (
    <VStage fam="clay" t={t} d={d} f={f} push={0.03} cy={900}>
      <Bloom x={540} y={G} r={700} color={CLAY.light} strength={0.55} />
      <Ground y={G} />
      {peaks.map(([cx, w, py, sd], i) => {
        const pk = mix(py, G - (G - py) / 2, k);
        return (
          <g key={i}>
            <path d={mtnPath(cx, w, G, py, sd)} fill="none" stroke={CHALK} strokeWidth={5} strokeDasharray="16 11" opacity={0.6 * ease(t, 10, 26)} />
            <Mountain cx={cx} w={w} ground={G} peakY={pk} seed={sd} fill={i === 2 ? CLAY.mid : CLAY.far} />
          </g>
        );
      })}
      <rect x={-40} y={G} width={1160} height={200} fill={CLAY.near} />
      <Lev x={330} y={G + 2} h={150} frame={f} eyes="up" tilt={-10} shade={LEV_SHADE} />
      <g opacity={ease(t, 50, 64)}>
        <T x={560} y={360} size={42} ls={2}>STRONGER PULL</T>
        <VArrow x0={560} y0={385} x1={560} y1={385 + 90 * ease(t, 50, 80)} color={CHALK} w={12} head={30} />
      </g>
    </VStage>
  );
};

// ------------------------------------------------------------------ line 23 · shot 2: the bottom of a mountain gives way
const BaseGives: VShot = ({ t, d, f }) => {
  const g = 1080;
  const k1 = ease(t, 6, 50);
  const k2 = ease(t, 50, 100);
  const W = 400 + 90 * k2, peak = 430 + 70 * k2;
  const pts: [number, number][] = [
    [540 - W, g], [540 - W * 0.82, g - 90 - 30 * k2], [540 - W * 0.52, g - 290 + 30 * k2], [540 - W * 0.22, peak + 120], [540, peak],
    [540 + W * 0.22, peak + 120], [540 + W * 0.52, g - 290 + 30 * k2], [540 + W * 0.82, g - 90 - 30 * k2], [540 + W, g],
  ];
  const body = smoothPath(pts) + " Z";
  const downs: [number, number][] = [];
  for (let r = 0; r < 4; r++) for (let c = -r; c <= r; c++) downs.push([540 + c * 100, peak + 140 + r * 130]);
  return (
    <VStage fam="clay" t={t} d={d} f={f} push={0.03} cy={800}>
      <Bloom x={540} y={g} r={700} color={CLAY.light} strength={0.5} />
      <defs><clipPath id="s07cut"><path d={body} /></clipPath></defs>
      <rect x={-40} y={g} width={1160} height={900} fill={CLAY.near} />
      <path d={body} fill={CLAY.far} />
      <g clipPath="url(#s07cut)">
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={smoothPath([[0, g - 40 - i * 75], [300, g - 60 - i * 75 + 20 * k2], [780, g - 50 - i * 75 + 20 * k2], [1080, g - 40 - i * 75]])} stroke={CLAY.mid} strokeWidth={10} fill="none" opacity={0.6} />
        ))}
      </g>
      <path d={body} fill="none" stroke={CLAY.near} strokeWidth={8} />
      <path d={`M ${540 - 60} ${peak + 46} Q 540 ${peak - 16} ${540 + 60} ${peak + 46} Q 540 ${peak + 32} ${540 - 60} ${peak + 46} Z`} fill="#FFF1E0" />
      {downs.map(([ax, ay], i) => {
        const depth = (ay - peak) / (g - peak);
        const L = (26 + 64 * depth) * k1;
        return <VArrow key={i} x0={ax} y0={ay - L} x1={ax} y1={ay} color={TERRA} w={8 + 4 * depth} head={22} op={L > 3 ? 0.95 : 0} />;
      })}
      {[-1, 1].map((s) => (
        <g key={s}>
          <VArrow x0={540 + s * (W - 200)} y0={g - 50} x1={540 + s * (W - 200 + 160 * k2 + 20)} y1={g - 50} color={TERRA_DARK} w={14} head={34} op={k2 > 0.02 ? 1 : 0} />
          <path d={`M ${540 + s * (W - 90)} ${g} l ${s * 30} 34 l ${s * -8} 34 l ${s * 40} 40`} stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" strokeDasharray="160" strokeDashoffset={160 * (1 - ease(t, 70, 104))} />
          <path d={`M ${540 + s * (W - 30)} ${g + 2} q ${s * 50} ${-30 * k2} ${s * 120} 0`} fill={CLAY.near} />
          <Puff x={540 + s * W} y={g} a={t - 55} />
        </g>
      ))}
      <T x={540} y={350} size={46} ls={3}>TOO MUCH WEIGHT</T>
    </VStage>
  );
};

// ------------------------------------------------------------------ line 23 · shot 3: stronger gravity, shorter mountains
const TwoPeaks: VShot = ({ t, d, f }) => {
  const G = 1060, H = 520, w = 220;
  const k = ease(t, 16, 80);
  const pR = mix(G - H, G - H / 2, k);
  const arrowL = 110;
  return (
    <VStage fam="clay" t={t} d={d} f={f} push={0.03} cy={800}>
      <Bloom x={540} y={G} r={700} color={CLAY.light} strength={0.5} />
      <rect x={-40} y={G} width={1160} height={900} fill={CLAY.near} />
      <path d={`M 540 ${G + 30} V 330`} stroke={CHALK} strokeWidth={4} strokeDasharray="10 12" opacity={0.4} />
      {/* left: our Earth */}
      <Mountain cx={290} w={w} ground={G} peakY={G - H} seed={0} />
      <VArrow x0={290} y0={330} x1={290} y1={330 + arrowL} color={CHALK} w={14} head={34} />
      <T x={290} y={G + 70} size={40}>EARTH</T>
      {/* right: twice as wide, twice the pull */}
      <path d={mtnPath(790, w, G, G - H, 10)} fill="none" stroke={CHALK} strokeWidth={5} strokeDasharray="16 11" opacity={0.6} />
      <Mountain cx={790} w={w} ground={G} peakY={pR} seed={10} />
      <VArrow x0={790} y0={330} x1={790} y1={330 + arrowL * (1 + k)} color={TERRA_LIT} w={14 + 6 * k} head={34 + 6 * k} />
      <T x={790} y={G + 70} size={40}>×2 EARTH</T>
      <g opacity={ease(t, 70, 86)}>
        <T x={790} y={pR - 30} size={40} fill={CHALK}>SHORTER</T>
      </g>
    </VStage>
  );
};

// ------------------------------------------------------------------ line 23 · shot 4: Mars rolls in (the other side of the rule)
const MarsRolls: VShot = ({ t, d, f }) => {
  const g = 1080, r = 190;
  const p = lin(t, 0, 44);
  const x = mix(1300, 690, 1 - (1 - p) ** 3);
  const rot = ((x - 1300) / r) * (180 / Math.PI);
  const settle = t > 44 ? Math.sin((t - 44) / 3) * 6 * Math.exp(-(t - 44) / 10) : 0;
  const k = ease(t, 56, 76);
  return (
    <VStage fam="clay" t={t} d={d} f={f} push={0.03} cy={850}>
      <Bloom x={600} y={g} r={700} color={CLAY.light} strength={0.5} />
      <Ground y={g} />
      <GroundShadow x={x} y={g + 4} rx={r * 0.9} ry={18} opacity={0.35} />
      {[0, 1, 2].map((i) => <Puff key={i} x={x + r * 0.7} y={g} a={p < 1 ? (t + i * 9) % 27 : 99} />)}
      <Mars cx={x + settle} cy={g - r} r={r} rot={rot + settle} />
      <T x={x} y={g + 70} size={52} ls={4} opacity={ease(t, 30, 44)}>MARS</T>
      <Lev x={250} y={g + 2} h={200} frame={f} pose="point" eyes="wide" tilt={6} wind={0.3} shade={LEV_SHADE} />
      <g opacity={k}>
        <VArrow x0={690} y0={g - 2 * r - 120} x1={690} y1={g - 2 * r - 120 + 70 * k} color={CHALK} w={14} head={32} />
        <T x={690} y={g - 2 * r - 140} size={44} ls={2}>LESS PULL</T>
      </g>
    </VStage>
  );
};

// ------------------------------------------------------------------ line 24 · shot 1: about two fifths of our gravity
const MarsPull: VShot = ({ t, d, f }) => {
  const E = { x: 290, y: 500, r: 130 };
  const M = { x: 790, y: 500, r: 69 }; // Mars is about 0.53 Earth widths
  const L = 440;
  const kE = ease(t, 6, 36), kM = ease(t, 22, 52);
  const y0 = 680;
  return (
    <VStage fam="clay" t={t} d={d} f={f} push={0.03} cy={760}>
      <Bloom x={540} y={700} r={620} color={CLAY.light} strength={0.45} />
      <Earth cx={E.x} cy={E.y} r={E.r} seed={3} />
      <Mars cx={M.x} cy={M.y} r={M.r} rot={t * 1.5} />
      <T x={E.x} y={E.y - E.r - 26} size={42} ls={3}>EARTH</T>
      <T x={M.x} y={M.y - E.r - 26} size={42} ls={3}>MARS</T>
      <path d={`M 140 ${y0} H 940`} stroke={CHALK} strokeWidth={4} strokeDasharray="10 10" opacity={0.35} />
      <path d={`M 140 ${y0 + L} H 940`} stroke={CHALK} strokeWidth={4} strokeDasharray="10 10" opacity={0.35} />
      <VArrow x0={E.x} y0={y0} x1={E.x} y1={y0 + L * kE + 1} color={CHALK} w={22} head={50} />
      <VArrow x0={M.x} y0={y0} x1={M.x} y1={y0 + L * 0.4 * kM + 1} color={TERRA_LIT} w={22} head={50} />
      <g transform={`translate(${M.x} ${y0 + L * 0.4 + 120}) scale(${pop(t, 50, 14).toFixed(3)})`}>
        <T x={0} y={0} size={96}>~2/5</T>
        <VPill x={0} y={60} text="ROUGHLY" />
      </g>
    </VStage>
  );
};

// ------------------------------------------------------------------ line 24 · shot 2: Olympus Mons, about three Everests tall
const Olympus: VShot = ({ t, d, f }) => {
  const g = 1110, eH = 190, ex = 210, ox = 660;
  const H = 3 * eH * ease(t, 4, 44);
  const ever = (dy: number) =>
    `M ${ex - 120} ${g - dy} L ${ex - 52} ${g - dy - 112} L ${ex - 30} ${g - dy - 96} L ${ex} ${g - dy - eH} L ${ex + 30} ${g - dy - 118} L ${ex + 52} ${g - dy - 132} L ${ex + 120} ${g - dy} Z`;
  const vol = `M ${ox - 470} ${g} C ${ox - 330} ${g - 0.3 * H} ${ox - 190} ${g - H} ${ox - 70} ${g - H} Q ${ox} ${g - H + 22} ${ox + 70} ${g - H} C ${ox + 190} ${g - H} ${ox + 330} ${g - 0.3 * H} ${ox + 470} ${g} Z`;
  return (
    <VStage fam="clay" t={t} d={d} f={f} push={0.03} cy={850}>
      <Bloom x={540} y={g} r={760} color={CLAY.light} strength={0.5} />
      <rect x={-40} y={g} width={1160} height={900} fill={CLAY.near} />
      <path d={vol} fill={TERRA} />
      <path d={`M ${ox - 470} ${g} C ${ox - 330} ${g - 0.3 * H} ${ox - 190} ${g - H} ${ox - 70} ${g - H} C ${ox - 160} ${g - H * 0.6} ${ox - 260} ${g - 0.2 * H} ${ox - 290} ${g} Z`} fill={TERRA_LIT} opacity={0.45} />
      <path d={vol} fill="none" stroke={TERRA_DARK} strokeWidth={5} />
      <path d={ever(0)} fill={CLAY.mid} stroke={CLAY.near} strokeWidth={4} />
      <path d={`M ${ex - 30} ${g - eH + 56} L ${ex} ${g - eH} L ${ex + 30} ${g - eH + 52} L ${ex + 8} ${g - eH + 42} Z`} fill="#FFF1E0" />
      {[1, 2].map((i) => {
        const k = pop(t, 40 + (i - 1) * 10, 12);
        return k > 0 ? <path key={i} d={ever(eH * i)} fill="none" stroke={CHALK} strokeWidth={4} strokeDasharray="12 9" opacity={0.85} transform={`translate(${ex} ${g - eH * i}) scale(${k}) translate(${-ex} ${-(g - eH * i)})`} /> : null;
      })}
      <path d={`M ${ex + 20} ${g - 3 * eH} H ${mix(ex + 20, ox - 70, ease(t, 58, 72))}`} stroke={CHALK} strokeWidth={4} strokeDasharray="8 10" opacity={0.8} />
      <T x={ex} y={g + 60} size={34} ls={2}>EVEREST</T>
      <T x={ox} y={g + 60} size={34} ls={2}>MARS' BIGGEST VOLCANO</T>
      <g transform={`translate(${ex + 10} ${g - 3 * eH - 70}) scale(${pop(t, 62, 14).toFixed(3)})`}>
        <T x={0} y={0} size={96}>~3×</T>
        <VPill x={180} y={-30} text="ROUGHLY" />
      </g>
    </VStage>
  );
};

// ------------------------------------------------------------------ line 24 · shot 3: gravity is part of the reason
const arcPath = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p = (a: number) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M ${x0} ${y0} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
};
const Reason: VShot = ({ t, d, f }) => {
  const cx = 540, cy = 720, r = 280;
  const a0 = -90, span = 130 * ease(t, 6, 50);
  const mid = ((a0 + span / 2) * Math.PI) / 180;
  return (
    <VStage fam="clay" t={t} d={d} f={f} push={0.03} cy={720}>
      <Bloom x={cx} y={cy} r={600} color={CLAY.light} strength={0.45} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={INK} strokeWidth={80} opacity={0.25} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={CHALK} strokeWidth={10} strokeDasharray="26 24" strokeDashoffset={-t * 3} opacity={0.5} />
      {span > 1 ? <path d={arcPath(cx, cy, r, a0, a0 + span)} stroke={TERRA} strokeWidth={80} fill="none" strokeLinecap="round" /> : null}
      {span > 1 ? <path d={arcPath(cx, cy, r + 22, a0 + 4, a0 + span - 4)} stroke={TERRA_LIT} strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.6} /> : null}
      <T x={cx} y={cy - 4} size={64} ls={2}>THE</T>
      <T x={cx} y={cy + 66} size={64} ls={2}>REASON</T>
      <g opacity={ease(t, 30, 44)}>
        <T x={830} y={390} size={46} ls={3}>GRAVITY</T>
      </g>
      <g opacity={ease(t, 60, 74)}>
        <T x={cx} y={cy + r + 120} size={56} ls={2} fill={CLAY.text}>PART OF IT</T>
      </g>
    </VStage>
  );
};

export const SHOTS_07: VShot[][] = [
  [OpenPull, OpenSame],
  [MountainsSink, BaseGives, TwoPeaks, MarsRolls],
  [MarsPull, Olympus, Reason],
];
