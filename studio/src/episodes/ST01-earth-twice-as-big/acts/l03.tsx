// ST01 act "l03" · 3 · Half again as big (clay dusk → moss). Shot bodies keyed by storyboard id (3-01..3-14).
import React from "react";
import { ShotMap, ShotStage, ease, lin, mix, pop } from "../shot";
import { Lev } from "../../../lib/suppose/lev";
import { Lever, STPill, leverTip } from "../../../lib/suppose/devices";
import { Earth } from "../../../lib/suppose/frames";
import { CHALK, INK, LIME, SUPPOSE, TERRA } from "../../../lib/suppose/palette";
import { Bloom, GroundShadow } from "../../../lib/illustrated/light";
import { arcPath, smoothPath } from "../../../lib/illustrated/shapes";
import { Arrow, C15, CLAY, Puff, TERRA_DARK, TERRA_LIT, Txt, leanPt } from "./l02-parts";
import { AirDots, Bracket, Column, Mars, Mountain, mtnPath } from "./l03-parts";

const G = 900; // ground line for the column shots
const H0 = 380; // 8.5 km on screen
const H1 = H0 / 1.5; // 5.7 km on screen
const CX = 900, CW = 320, TOP = 110;
const BX = CX + CW / 2 + 44; // bracket x

const Backdrop: React.FC<{ ground?: number }> = ({ ground = G }) => (
  <g>
    <Bloom x={960} y={ground} r={760} color={CLAY.light} strength={0.5} spread={0.5} />
    <path d={smoothPath([[-60, ground - 150], [240, ground - 230], [520, ground - 170], [820, ground - 260], [1160, ground - 180], [1480, ground - 250], [1990, ground - 170]]) + ` L 1990 ${ground + 10} L -60 ${ground + 10} Z`} fill={CLAY.far} opacity={0.6} />
    <rect x={-60} y={ground} width={2040} height={300} fill={CLAY.near} />
  </g>
);

const ColumnAir: React.FC<{ H: number; f: number; level?: number; cx?: number; w?: number; n?: number; seed?: number }> = ({ H, f, level, cx = CX, w = CW, n = 1000, seed = 3 }) => (
  <Column cx={cx} w={w} top={TOP} ground={G}>
    <AirDots x0={cx - w / 2 + 14} x1={cx + w / 2 - 14} ground={G} H={H} n={n} seed={seed} top={TOP + 10} frame={f} op={level !== undefined ? (y) => (y > level ? 0.16 : 1) : undefined} />
  </Column>
);

/** Lev climbing a terracotta pole beside the column; feet at y. */
const Climber: React.FC<{ y: number; f: number; t: number; moving: boolean }> = ({ y, f, t, moving }) => {
  const sw = moving ? Math.sin(t / 3.2) * 16 : 0;
  return (
    <Lev x={CX - CW / 2 - 70} y={y} h={110} frame={f} pose="pull" eyes={moving ? "squint" : "happy"} tilt={-6} wind={0.5}
      hands={{ front: [40, -140 + sw], back: [36, -140 - sw] }} shade="#D8B8A2" />
  );
};
const Pole: React.FC = () => (
  <g>
    <rect x={CX - CW / 2 - 38} y={TOP - 20} width={14} height={G - TOP + 20} rx={7} fill={TERRA_DARK} />
    {Array.from({ length: 14 }, (_, i) => <rect key={i} x={CX - CW / 2 - 46} y={TOP + i * 58} width={30} height={10} rx={5} fill={TERRA} />)}
  </g>
);
const ThirdTag: React.FC<{ y: number; k: number; pill?: boolean }> = ({ y, k, pill }) =>
  k > 0 ? (
    <g transform={`translate(${BX + 40} ${y}) scale(${k})`}>
      <Txt x={0} y={26} size={76} fill={CHALK}>×1/3</Txt>
      {pill ? <STPill x={196} y={0} text="ROUGHLY" /> : null}
    </g>
  ) : null;

export const SHOTS_L03: ShotMap = {
  // Air has weight too… the stronger the pull, the more tightly the air is squeezed. (range at dusk; air squashes)
  "3-01": ({ t, f }) => {
    const H = mix(330, 220, ease(t, 10, 95));
    return (
      <ShotStage fam="clay" t={t} f={f} counter={C15}>
        <Bloom x={960} y={860} r={680} color={CLAY.light} strength={0.55} spread={0.5} />
        <path d={smoothPath([[-50, 760], [200, 690], [420, 730], [700, 650], [980, 720], [1250, 660], [1520, 720], [1760, 640], [1980, 700]]) + " L 1980 1100 L -50 1100 Z"} fill={CLAY.far} opacity={0.75} />
        <AirDots x0={0} x1={1920} ground={G} H={H} n={2300} seed={1} top={110} frame={f} jig={1.5} r={3.2} />
        <Mountain cx={420} w={360} ground={G} peakY={380} />
        <Mountain cx={1020} w={420} ground={G} peakY={320} seed={20} />
        <Mountain cx={1580} w={330} ground={G} peakY={420} seed={10} />
        <rect x={-60} y={G} width={2040} height={200} fill={CLAY.near} />
        <Arrow x0={1250} y0={170} x1={1250} y1={170 + 70 + 30 * ease(t, 10, 95)} color={CHALK} w={10} op={0.75} />
        <Arrow x0={680} y0={190} x1={680} y1={190 + 70 + 30 * ease(t, 10, 95)} color={CHALK} w={10} op={0.75} />
        <Lev x={760} y={G + 2} h={108} frame={f} eyes="up" tilt={-12} wind={0.3} shade="#D8B8A2" />
      </ShotStage>
    );
  },

  // The planet pulls it down… (dot column, weight arrows pressing)
  "3-02": ({ t, f }) => {
    const k = ease(t, 10, 120);
    const H = mix(H0, H1, k);
    return (
      <ShotStage fam="clay" t={t} f={f} counter={C15}>
        <Backdrop />
        <ColumnAir H={H} f={f} cx={960} w={360} n={1100} />
        {[860, 960, 1060].map((ax, i) =>
          [0, 1].map((j) => {
            const ph = ((t * 2.6 + j * 60 + i * 20) % 120) / 120;
            const y0 = 20 + ph * 130;
            return <Arrow key={`${i}${j}`} x0={ax} y0={y0} x1={ax} y1={y0 + 50 + 40 * k} color={TERRA} w={12} head={26} op={Math.sin(ph * Math.PI)} />;
          }),
        )}
        <Txt x={960} y={G + 80} anchor="middle" size={40} fill={CHALK} ls={4}>AIR</Txt>
        <Lev x={1240} y={G + 2} h={110} frame={f} facing={-1} eyes="open" tilt={8} wind={0.2} shade="#D8B8A2" />
      </ShotStage>
    );
  },

  // On Earth today, the air thins out over about eight and a half kilometres. (bracket draws)
  "3-03": ({ t, f }) => {
    const p = ease(t, 10, 115);
    const sweep = t > 125 ? ((t - 125) % 50) / 50 : -1;
    return (
      <ShotStage fam="clay" t={t} f={f}>
        <Backdrop />
        <ColumnAir H={H0} f={f} />
        {sweep >= 0 ? <rect x={CX - CW / 2 + 6} y={G - H0 * sweep} width={CW - 12} height={H0 * sweep} fill={LIME} opacity={0.12 * (1 - sweep * 0.5)} /> : null}
        <Bracket x={BX} y0={G} y1={G - H0} p={p} />
        <Txt x={BX + 30} y={G - 6} size={34} fill={CHALK} op={ease(t, 8, 20)}>0</Txt>
        <g transform={`translate(${BX + 34} ${G - H0 + 14}) scale(${pop(t, 112, 14)})`}>
          <Txt x={0} y={20} size={72} fill={LIME}>8.5 km</Txt>
        </g>
        <Lev x={CX - CW / 2 - 110} y={G + 2} h={110} frame={f} eyes="up" tilt={-10} shade="#D8B8A2" />
      </ShotStage>
    );
  },

  // Scientists call it the scale height. (stamp slam)
  "3-04": ({ t, f }) => {
    const s = t < 4 ? 0 : mix(2.6, 1, ease(t, 4, 12));
    const shake = t > 12 ? Math.sin(t * 2.6) * 12 * Math.exp(-(t - 12) / 5) : 0;
    const sx = 1390, sy = G - H0 / 2;
    return (
      <ShotStage fam="clay" t={t} f={f}>
        <g transform={`translate(${shake} ${shake * 0.4})`}>
          <Backdrop />
          <ColumnAir H={H0} f={f} />
          <Bracket x={BX} y0={G} y1={G - H0} />
          <Txt x={BX + 34} y={G - H0 + 34} size={72} fill={LIME}>8.5 km</Txt>
          {[0, 1, 2].map((i) => {
            const a = t - 12 - i * 10;
            if (a < 0 || a > 40) return null;
            return <rect key={i} x={sx - 250 - a * 4} y={sy - 70 - a * 3} width={500 + a * 8} height={140 + a * 6} rx={30 + a * 2} fill="none" stroke={TERRA_LIT} strokeWidth={6} opacity={1 - a / 40} transform={`rotate(-8 ${sx} ${sy})`} />;
          })}
          {s > 0 ? (
            <g transform={`translate(${sx} ${sy}) rotate(-8) scale(${s})`} opacity={Math.min(1, s < 1.01 ? 1 : 0.6)}>
              <rect x={-250} y={-70} width={500} height={140} rx={24} fill={CHALK} opacity={0.9} />
              <rect x={-236} y={-56} width={472} height={112} rx={16} fill="none" stroke={TERRA} strokeWidth={8} />
              <Txt x={0} y={18} anchor="middle" size={50} fill={TERRA} ls={2}>SCALE HEIGHT</Txt>
            </g>
          ) : null}
          <Lev x={CX - CW / 2 - 110} y={G + 2} h={110} frame={f} eyes={t > 12 && t < 30 ? "wide" : "open"} tilt={-6} shade="#D8B8A2" />
        </g>
      </ShotStage>
    );
  },

  // Climb one scale height, and only about a third of the air is left above you.
  "3-05": ({ t, f }) => {
    const k = ease(t, 10, 108);
    const y = G - H0 * k;
    return (
      <ShotStage fam="clay" t={t} f={f}>
        <Backdrop />
        <ColumnAir H={H0} f={f} level={y} />
        <path d={`M ${CX - CW / 2 - 20} ${y} H ${CX + CW / 2 + 20}`} stroke={LIME} strokeWidth={6} strokeDasharray="16 10" opacity={k > 0.02 ? 1 : 0} />
        <Bracket x={BX} y0={G} y1={G - H0} op={0.85} />
        <Pole />
        <Climber y={y} f={f} t={t} moving={t > 10 && t < 108} />
        <ThirdTag y={G - H0 - 4} k={pop(t, 108, 14)} pill />
      </ShotStage>
    );
  },

  // Climb another, and a third of that third.
  "3-06": ({ t, f }) => {
    const k = ease(t, 6, 90);
    const y = G - H0 - (H0 - 40) * k;
    return (
      <ShotStage fam="clay" t={t} f={f}>
        <Backdrop />
        <ColumnAir H={H0} f={f} level={y} />
        <path d={`M ${CX - CW / 2 - 20} ${y} H ${CX + CW / 2 + 20}`} stroke={LIME} strokeWidth={6} strokeDasharray="16 10" />
        <Bracket x={BX} y0={G} y1={G - H0} op={0.6} />
        <Bracket x={BX} y0={G - H0} y1={G - 2 * H0} p={ease(t, 0, 60)} />
        <Pole />
        <Climber y={y} f={f} t={t} moving={t > 6 && t < 90} />
        <ThirdTag y={G - H0 - 4} k={1} />
        <ThirdTag y={G - 2 * H0 + 20} k={pop(t, 90, 14)} />
      </ShotStage>
    );
  },

  // On this planet, at the same temperature, that height shrinks to under six.
  "3-07": ({ t, f }) => {
    const k = ease(t, 15, 105);
    const H = mix(H0, H1, k);
    return (
      <ShotStage fam="clay" t={t} f={f} counter={C15}>
        <Backdrop />
        <ColumnAir H={H} f={f} />
        {[840, 960].map((ax, i) => {
          const ph = ((t * 2.4 + i * 60) % 120) / 120;
          const y0 = 10 + ph * 100;
          return <Arrow key={i} x0={ax} y0={y0} x1={ax} y1={y0 + 60} color={TERRA} w={12} head={26} op={Math.sin(ph * Math.PI) * 0.9} />;
        })}
        <Bracket x={BX + 40} y0={G} y1={G - H0} dash="14 12" color={CHALK} op={0.5 * ease(t, 15, 30)} />
        <Txt x={BX + 80} y={G - H0 + 26} size={44} fill={CHALK} op={ease(t, 15, 30) * 0.6}>8.5 km today</Txt>
        <Bracket x={BX} y0={G} y1={G - H} />
        <Txt x={BX + 30} y={G - H0 + 34} size={72} fill={LIME} op={1 - ease(t, 10, 22)}>8.5 km</Txt>
        <g transform={`translate(${BX + 80} ${G - H1 + 20}) scale(${pop(t, 104, 14)})`}>
          <Txt x={0} y={20} size={72} fill={LIME}>5.7 km</Txt>
          <STPill x={310} y={-4} text="OUR SUM" />
        </g>
      </ShotStage>
    );
  },

  // The air at the bottom feels about the same. Climb a little, and it disappears fast.
  "3-08": ({ t, f }) => {
    const L = G - H0 * ease(t, 20, 135);
    const cols: [number, number, string, string][] = [[560, H0, "TODAY", CHALK], [1360, H1, "×1.5", LIME]];
    return (
      <ShotStage fam="clay" t={t} f={f} counter={C15}>
        <Backdrop />
        {cols.map(([cx, H, label, c], i) => (
          <g key={i}>
            <ColumnAir H={H} f={f} cx={cx} w={300} n={900} seed={5} level={L} />
            <Txt x={cx} y={G + 80} anchor="middle" size={44} fill={c} ls={3}>{label}</Txt>
          </g>
        ))}
        <path d={`M 380 ${L} H 1540`} stroke={LIME} strokeWidth={6} strokeDasharray="16 10" />
        <rect x={900} y={L - 4} width={120} height={14} rx={7} fill={LIME} />
        <Lev x={960} y={L - 4} h={96} frame={f} eyes={L < G - 200 ? "wide" : "open"} facing={1} tilt={10} wind={0.4} shade="#D8B8A2" />
      </ShotStage>
    );
  },

  // The mountains change too. (peaks shrink in place, snow caps slide down)
  "3-09": ({ t, f }) => {
    const k = ease(t, 15, 125);
    const peaks: [number, number, number, number][] = [[420, 360, 330, 0], [1000, 420, 270, 20], [1560, 330, 360, 10]];
    return (
      <ShotStage fam="clay" t={t} f={f} counter={C15}>
        <Bloom x={960} y={860} r={680} color={CLAY.light} strength={0.55} spread={0.5} />
        <path d={smoothPath([[-50, 780], [300, 720], [700, 760], [1100, 700], [1500, 750], [1980, 710]]) + " L 1980 1100 L -50 1100 Z"} fill={CLAY.far} opacity={0.7} />
        <AirDots x0={0} x1={1920} ground={G} H={220} n={1500} seed={2} top={110} frame={f} jig={1.5} r={3} />
        {peaks.map(([cx, w, py, sd], i) => {
          const pk = mix(py, G - (G - py) / 1.5, k);
          return (
            <g key={i}>
              <Mountain cx={cx} w={w} ground={G} peakY={pk} seed={sd} />
              <path d={mtnPath(cx, w, G, py, sd)} fill="none" stroke={CHALK} strokeWidth={4} strokeDasharray="14 10" opacity={0.55 * ease(t, 15, 35)} />
            </g>
          );
        })}
        <rect x={-60} y={G} width={2040} height={200} fill={CLAY.near} />
        <Lev x={740} y={G + 2} h={100} frame={f} eyes="up" tilt={-8} shade="#D8B8A2" />
      </ShotStage>
    );
  },

  // Rock can only hold up so much weight before the bottom gives way. (cutaway; base squishes outward)
  "3-10": ({ t, f }) => {
    const g = 860;
    const k1 = ease(t, 10, 80);
    const k2 = ease(t, 95, 185);
    const W = 600 + 150 * k2, peak = 230 + 90 * k2;
    const pts: [number, number][] = [
      [960 - W, g], [960 - W * 0.82, g - 100 - 30 * k2], [960 - W * 0.52, g - 300 + 30 * k2], [960 - W * 0.22, peak + 120], [960, peak],
      [960 + W * 0.22, peak + 120], [960 + W * 0.52, g - 300 + 30 * k2], [960 + W * 0.82, g - 100 - 30 * k2], [960 + W, g],
    ];
    const body = smoothPath(pts) + " Z";
    const downs: [number, number][] = [];
    for (let r = 0; r < 4; r++) for (let c = -r; c <= r; c++) downs.push([960 + c * 150, peak + 150 + r * 130]);
    return (
      <ShotStage fam="clay" t={t} f={f}>
        <Bloom x={960} y={g} r={760} color={CLAY.light} strength={0.5} />
        <defs>
          <clipPath id="l03cut"><path d={body} /></clipPath>
        </defs>
        <rect x={-60} y={g} width={2040} height={300} fill={CLAY.near} />
        <path d={body} fill={CLAY.far} />
        <g clipPath="url(#l03cut)">
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} d={smoothPath([[300, g - 40 - i * 75], [700, g - 60 - i * 75 + 20 * k2], [1220, g - 50 - i * 75 + 20 * k2], [1620, g - 40 - i * 75]])} stroke={CLAY.mid} strokeWidth={10} fill="none" opacity={0.6} />
          ))}
        </g>
        <path d={body} fill="none" stroke={CLAY.near} strokeWidth={8} />
        {/* snow cap */}
        <path d={`M ${960 - 70} ${peak + 50} Q 960 ${peak - 18} ${960 + 70} ${peak + 50} Q 960 ${peak + 34} ${960 - 70} ${peak + 50} Z`} fill="#FFF1E0" />
        {/* pressure: longer the deeper */}
        {downs.map(([ax, ay], i) => {
          const depth = (ay - peak) / (g - peak);
          const L = (30 + 70 * depth) * k1;
          return <Arrow key={i} x0={ax} y0={ay - L} x1={ax} y1={ay} color={TERRA} w={9 + 4 * depth} head={22} dash={`${20} ${10}`} op={0.95} />;
        })}
        <g>
          {[-1, 1].map((s) => (
            <Arrow key={s} x0={960 + s * (W - 260)} y0={g - 60} x1={960 + s * (W - 260 + 200 * k2 + 20)} y1={g - 60} color={TERRA_DARK} w={14} head={34} op={k2 > 0.02 ? 1 : 0} />
          ))}
        </g>
        {/* the base gives way: cracks + ground ridges */}
        {[-1, 1].map((s) => (
          <g key={s}>
            <path d={`M ${960 + s * (W - 120)} ${g} l ${s * 40} 40 l ${s * -10} 40 l ${s * 50} 50`} stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" strokeDasharray="200" strokeDashoffset={200 * (1 - ease(t, 130, 190))} />
            <path d={`M ${960 + s * (W - 40)} ${g + 2} q ${s * 60} ${-36 * k2} ${s * 140} 0`} fill={CLAY.near} />
          </g>
        ))}
        {t > 95 && t < 125 ? <Puff x={960 - W} y={g} a={t - 95} k={1} color={CLAY.light} /> : null}
        {t > 95 && t < 125 ? <Puff x={960 + W} y={g} a={t - 95} k={1} color={CLAY.light} /> : null}
      </ShotStage>
    );
  },

  // Mars shows the opposite side of that rule. (a little Mars rolls in)
  "3-11": ({ t, f }) => {
    const g = 880, r = 150;
    const p = lin(t, 0, 46);
    const x = mix(2160, 1200, 1 - (1 - p) ** 3);
    const rot = ((x - 2160) / r) * (180 / Math.PI);
    const settle = t > 46 ? Math.sin((t - 46) / 3) * 6 * Math.exp(-(t - 46) / 10) : 0;
    return (
      <ShotStage fam="clay" t={t} f={f}>
        <Bloom x={1100} y={g} r={700} color={CLAY.light} strength={0.5} />
        <path d={smoothPath([[-50, g - 120], [400, g - 170], [900, g - 110], [1400, g - 160], [1980, g - 120]]) + ` L 1980 1100 L -50 1100 Z`} fill={CLAY.far} opacity={0.6} />
        <rect x={-60} y={g} width={2040} height={300} fill={CLAY.near} />
        <GroundShadow x={x} y={g + 4} rx={r * 0.9} ry={16} opacity={0.35} />
        {[0, 1, 2].map((i) => <Puff key={i} x={x + r * 0.7} y={g} a={((t + i * 9) % 27) * (p < 1 ? 1 : 0) + (p < 1 ? 0 : 99)} k={0.6} color={CLAY.light} life={27} />)}
        <Mars cx={x + settle} cy={g - r} r={r} rot={rot + settle} />
        <Lev x={620} y={g + 2} h={124} frame={f} pose="point" eyes="wide" tilt={6} wind={0.3} shade="#D8B8A2" />
      </ShotStage>
    );
  },

  // About two fifths of our gravity; its biggest volcano stands roughly three times as tall as Everest.
  "3-12": ({ t, f }) => {
    const g = 900, eH = 170, ex = 470, ox = 1260;
    const H = 3 * eH * ease(t, 15, 105);
    const ever = (dy: number) =>
      `M ${ex - 160} ${g - dy} L ${ex - 70} ${g - dy - 100} L ${ex - 40} ${g - dy - 84} L ${ex} ${g - dy - eH} L ${ex + 40} ${g - dy - 104} L ${ex + 70} ${g - dy - 120} L ${ex + 160} ${g - dy} Z`;
    const vol = `M ${ox - 600} ${g} C ${ox - 420} ${g - 0.3 * H} ${ox - 240} ${g - H} ${ox - 90} ${g - H} Q ${ox} ${g - H + 26} ${ox + 90} ${g - H} C ${ox + 240} ${g - H} ${ox + 420} ${g - 0.3 * H} ${ox + 600} ${g} Z`;
    return (
      <ShotStage fam="clay" t={t} f={f}>
        <Bloom x={960} y={g} r={780} color={CLAY.light} strength={0.5} />
        <rect x={-60} y={g} width={2040} height={300} fill={CLAY.near} />
        <path d={vol} fill={TERRA} />
        <path d={`M ${ox - 600} ${g} C ${ox - 420} ${g - 0.3 * H} ${ox - 240} ${g - H} ${ox - 90} ${g - H} C ${ox - 200} ${g - H * 0.6} ${ox - 330} ${g - 0.2 * H} ${ox - 360} ${g} Z`} fill={TERRA_LIT} opacity={0.45} />
        <path d={vol} fill="none" stroke={TERRA_DARK} strokeWidth={5} />
        <path d={ever(0)} fill={CLAY.mid} stroke={CLAY.near} strokeWidth={4} />
        <path d={`M ${ex - 34} ${g - eH + 60} L ${ex} ${g - eH} L ${ex + 34} ${g - eH + 56} L ${ex + 10} ${g - eH + 44} Z`} fill="#FFF1E0" />
        {[1, 2].map((i) => {
          const k = pop(t, 112 + (i - 1) * 22, 14);
          return k > 0 ? <path key={i} d={ever(eH * i)} fill="none" stroke={CHALK} strokeWidth={4} strokeDasharray="12 9" opacity={0.85} transform={`translate(${ex} ${g - eH * i}) scale(${k}) translate(${-ex} ${-(g - eH * i)})`} /> : null;
        })}
        <path d={`M ${ex + 20} ${g - 3 * eH} H ${mix(ex + 20, ox - 90, ease(t, 160, 190))}`} stroke={CHALK} strokeWidth={4} strokeDasharray="8 10" opacity={0.8} />
        <g transform={`translate(${ex} ${g - 3 * eH - 70}) scale(${pop(t, 165, 14)})`}>
          <Txt x={0} y={0} anchor="middle" size={96} fill={CHALK}>~3×</Txt>
          <STPill x={110} y={-30} text="ROUGHLY" />
        </g>
        <Txt x={ex} y={g + 64} anchor="middle" size={34} fill={CHALK} ls={3}>EVEREST</Txt>
        <Txt x={ox} y={g + 64} anchor="middle" size={34} fill={CHALK} ls={3} op={ease(t, 30, 45)}>OLYMPUS MONS</Txt>
        <g opacity={ease(t, 10, 24)}>
          <rect x={1460} y={70} width={380} height={90} rx={24} fill={INK} opacity={0.6} />
          <Txt x={1650} y={130} anchor="middle" size={48} fill={CHALK}>MARS · ~2/5 g</Txt>
        </g>
      </ShotStage>
    );
  },

  // Gravity isn't the whole reason, but it's part of it. (ring "THE REASON", GRAVITY fills part)
  "3-13": ({ t, f }) => {
    const cx = 960, cy = 540, r = 270;
    const a0 = -90, span = 130 * ease(t, 8, 58);
    const mid = ((a0 + span / 2) * Math.PI) / 180;
    return (
      <ShotStage fam="clay" t={t} f={f}>
        <Bloom x={cx} y={cy} r={620} color={CLAY.light} strength={0.45} />
        <path d={smoothPath([[-50, 960], [400, 900], [900, 950], [1400, 890], [1980, 940]]) + " L 1980 1100 L -50 1100 Z"} fill={CLAY.near} opacity={0.8} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={INK} strokeWidth={70} opacity={0.25} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={CHALK} strokeWidth={10} strokeDasharray="26 24" strokeDashoffset={-t * 3} opacity={0.5} />
        {span > 1 ? <path d={arcPath(cx, cy, r, a0, a0 + span)} stroke={TERRA} strokeWidth={70} fill="none" strokeLinecap="round" /> : null}
        {span > 1 ? <path d={arcPath(cx, cy, r + 18, a0 + 4, a0 + span - 4)} stroke={TERRA_LIT} strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.6} /> : null}
        <Txt x={cx} y={cy + 24} anchor="middle" size={58} fill={CHALK} ls={2}>THE REASON</Txt>
        <g opacity={ease(t, 30, 44)}>
          <Txt x={cx + Math.cos(mid) * (r + 80)} y={cy + Math.sin(mid) * (r + 80)} anchor="start" size={48} fill={CHALK} ls={3}>GRAVITY</Txt>
        </g>
      </ShotStage>
    );
  },

  // Now pull the lever all the way. (moss; Lev grabs the lever with both hands)
  "3-14": ({ t, f }) => {
    const fam = SUPPOSE.moss;
    const ground = 880;
    const pivot: [number, number] = [1250, ground];
    const len = 180, h = 200, s = h / 170;
    const angle = mix(-18, -32, ease(t, 46, 88));
    const tip = leverTip(pivot[0], pivot[1], len, angle);
    const levX = 1110;
    const lean = mix(2, -12, ease(t, 40, 80));
    const grab = ease(t, 26, 44);
    const rub = Math.sin(t / 2.2) * 8 * (1 - grab);
    const target = leanPt((tip[0] - levX) / s, (tip[1] - (ground - 4)) / s, -lean);
    const front: [number, number] = [mix(28 + rub, target[0], grab), mix(-84, target[1], grab)];
    const back: [number, number] = [mix(14 - rub, target[0] - 8, grab), mix(-82, target[1] + 8, grab)];
    return (
      <ShotStage fam="moss" t={t} f={f} counter={C15} ladder={3}>
        <Earth cx={560} cy={470} r={260} />
        <circle cx={560} cy={470} r={173} fill="none" stroke={CHALK} strokeWidth={4} strokeDasharray="16 12" opacity={0.8} />
        <path d={`M 860 1100 L 880 ${ground + 20} Q 890 ${ground - 4} 930 ${ground - 6} L 1500 ${ground - 10} Q 1550 ${ground - 8} 1560 ${ground + 30} L 1580 1100 Z`} fill={fam.near} />
        <path d={`M 890 ${ground - 2} Q 1200 ${ground - 16} 1540 ${ground - 6}`} stroke={fam.bounce} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.8} />
        <Lever x={pivot[0]} y={pivot[1]} len={len} angle={angle} plate="SIZE ×2" glow={0.3 + 0.4 * ease(t, 46, 88)} />
        <Lev x={levX} y={ground - 4} h={h} frame={f} pose="pull" hands={{ front, back }} lean={lean} eyes={grab < 0.5 ? "happy" : "squint"} wind={0.4 + 0.5 * grab} shade="#9FB7A6" />
      </ShotStage>
    );
  },
};
