// STS04 (rocket-fuel): ST01 lines [31, 32, 33, 34]. Shot bodies only; layout rules in lib/suppose/vshort.tsx.
// Numbers on screen (spoken here): escape 11.2 → 22.4 km/s ("about eleven", "more than twenty-two", OUR SUM),
// orbit 15.8 km/s (OUR SUM, "twice today's"), fuel 5× → 35× the empty rocket (IDEAL). Fuel drawn to scale.
import React from "react";
import { VShot } from "../../lib/suppose/vshort";
import { Bloom, GroundShadow } from "../../lib/illustrated/light";
import { arcPath, rrect } from "../../lib/illustrated/shapes";
import { AIR, BRASS, BRASS_DARK, CHALK, CHALK_SHADE, INK, ST_FONT, SUPPOSE, TERRA } from "../../lib/suppose/palette";
import { Lev, levHand } from "../../lib/suppose/lev";
import { STPill } from "../../lib/suppose/devices";
import { Earth } from "../../lib/suppose/frames";
import { Rocket, TERRA_DEEP, TERRA_LIT } from "../ST01-earth-twice-as-big/acts/l04-parts";
import { beats, ease, lin, mix, MossLedge, overshoot, Pop, Pt, rnd, T, Tag, TAU, VReadout, VStage } from "./vparts-a";

const C2 = { label: "SIZE", value: "×2" };
const MOSS = SUPPOSE.moss;

const BallR: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 20 }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={TERRA} />
    <circle cx={x - r * 0.3} cy={y - r * 0.35} r={r * 0.35} fill={TERRA_LIT} opacity={0.8} />
  </g>
);

// ------------------------------------------------------------------ line 31
/** Leaving would be the hardest part: a ball thrown up from the giant Earth arcs back down */
const ThrowBack: VShot = ({ t, d, f }) => {
  const ER = 1500, ECY = 1150 + ER;
  const surf = (x: number) => ECY - Math.sqrt(ER * ER - (x - 540) ** 2);
  const lx = 360, ly = surf(lx), lh = 210;
  const [hx, hy] = levHand(lx, ly, lh, [52, -150]);
  const arc = (u: number): Pt => {
    const ex = 760, ey = surf(ex) - 20;
    return [mix(hx, ex, u), mix(hy, ey, u) - 4 * 520 * u * (1 - u)];
  };
  const u = lin(t, 10, 62);
  const b = arc(u);
  const thud = t - 62;
  return (
    <VStage fam="moss" t={t} d={d} f={f} counter={C2}>
      <Earth cx={540} cy={ECY} r={ER} seed={7} />
      {u > 0 ? <path d={"M " + Array.from({ length: 31 }, (_, i) => arc((u * i) / 30).join(" ")).join(" L ")} stroke={AIR} strokeWidth={5} strokeDasharray="4 13" strokeLinecap="round" fill="none" opacity={0.75} /> : null}
      <Lev x={lx} y={ly} h={lh} frame={f} pose={t < 14 ? "point" : "stand"} hands={t < 14 ? { front: [52, -150] } : undefined} eyes={t > 50 ? "wide" : "up"} tilt={-10} wind={0.4} shade="#9FB7A6" />
      <BallR x={u > 0 ? b[0] : hx} y={u > 0 ? b[1] : hy} />
      {thud >= 0 && thud < 18 ? <ellipse cx={760} cy={surf(760) - 4} rx={20 + thud * 4} ry={6 + thud} fill="none" stroke={CHALK} strokeWidth={4} opacity={1 - thud / 18} /> : null}
    </VStage>
  );
};

/** our Earth; a ball hurled away for good (trail out of frame), repeated */
const Hurl: React.FC<{ t: number; f: number; R: number; cy: number; every?: number }> = ({ t, f, R, cy, every = 50 }) => {
  const k = Math.floor(t / every);
  const a = t - k * every;
  const p = lin(a, 0, every - 6);
  const sx = 540 + R * 0.5, sy = cy - R * 0.87;
  const P = (g: number): Pt => [sx + g * 440, sy - g * 640 - Math.sin(g * 2) * 40];
  return (
    <g>
      {[1, 2, 3, 4, 5].map((i) => {
        const [x, y] = P(Math.max(0, p - i * 0.03));
        return <circle key={i} cx={x} cy={y} r={18 - i * 2.5} fill={TERRA_LIT} opacity={0.5 - i * 0.08} />;
      })}
      <BallR x={P(p)[0]} y={P(p)[1]} r={18} />
    </g>
  );
};
const AwayToday: VShot = ({ t, d, f }) => (
  <VStage fam="olive" t={t} d={d} f={f}>
    <Earth cx={540} cy={1000} r={200} seed={4} />
    <T x={540} y={1250} size={40} ls={3}>OUR EARTH</T>
    <Lev x={500} y={802} h={110} frame={f} pose="point" hands={{ front: [60, -140] }} eyes="up" tilt={-10} wind={0.6} shade="#9FB7A6" />
    <Hurl t={t} f={f} R={200} cy={1000} />
    <Pop t={t} a={30} cx={540} cy={420}><Tag x={540} y={420} text="AWAY FOR GOOD" size={48} /></Pop>
  </VStage>
);
const EscTodayRead: VShot = ({ t, d, f }) => {
  return (
    <VStage fam="olive" t={t} d={d} f={f}>
      <Earth cx={540} cy={1000} r={160} seed={4} />
      <T x={540} y={1220} size={40} ls={3}>OUR EARTH</T>
      <Hurl t={t + 20} f={f} R={160} cy={1000} every={40} />
      <VReadout x={540} y={310} label="ESCAPE SPEED · TODAY" value={t >= 60 ? "11.2" : "?"} unit="km/s" />
    </VStage>
  );
};
const EscHere: VShot = ({ t, d, f }) => {
  const sw = overshoot(lin(t, 0, 34));
  const R = mix(160, 320, sw);
  const v = mix(11.2, 22.4, ease(t, 50, 80));
  return (
    <VStage fam="olive" t={t} d={d} f={f} counter={C2}>
      <Earth cx={540} cy={1040} r={R} seed={4} />
      <circle cx={540} cy={1040} r={160} fill="none" stroke={CHALK} strokeWidth={6} strokeDasharray="20 13" opacity={0.9 * ease(t, 10, 26)} />
      <VReadout x={540} y={310} label="ESCAPE SPEED · HERE" value={v.toFixed(1)} unit="km/s" />
      <T x={540} y={620} size={34} ls={3} weight={800} op={0.85}>TODAY 11.2 km/s</T>
      <Pop t={t} a={82} cx={540} cy={675}><STPill x={540} y={675} text="OUR SUM" align="middle" size={26} /></Pop>
    </VStage>
  );
};

// ------------------------------------------------------------------ line 32
const Orbit: React.FC<{ t: number; f: number; cx: number; cy: number; r: number; per: number }> = ({ t, f, cx, cy, r, per }) => {
  const R = r * 1.3;
  const th = (t / per) * TAU - 1.2;
  const rx = cx + R * Math.cos(th), ry = cy + R * Math.sin(th);
  const deg = (th * 180) / Math.PI;
  return (
    <g>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={CHALK} strokeWidth={3} strokeDasharray="6 12" opacity={0.5} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={arcPath(cx, cy, R, deg - 70 + i * 22, deg - 50 + i * 22 + 2)} stroke={TERRA_LIT} strokeWidth={8 - i} fill="none" strokeLinecap="round" opacity={0.2 + i * 0.22} />
      ))}
      <Rocket x={rx} y={ry} h={80} rot={deg + 180} flame={1} frame={f} />
    </g>
  );
};
const OrbitA: VShot = ({ t, d, f }) => {
  return (
    <VStage fam="olive" t={t} d={d} f={f}>
      <Earth cx={540} cy={950} r={250} seed={6} />
      <Orbit t={t} f={f} cx={540} cy={950} r={250} per={120} />
      <VReadout x={540} y={310} label="ORBIT SPEED · HERE" value={t >= 90 ? "15.8" : "?"} unit="km/s" w={720} size={130} />
    </VStage>
  );
};
const OrbitB: VShot = ({ t, d, f }) => (
  <VStage fam="olive" t={t} d={d} f={f}>
    <Earth cx={540} cy={950} r={250} seed={6} />
    <circle cx={540} cy={950} r={125} fill="none" stroke={CHALK} strokeWidth={5} strokeDasharray="16 11" opacity={0.85} />
    <Orbit t={t + 110} f={f} cx={540} cy={950} r={250} per={120} />
    <VReadout x={540} y={310} label="ORBIT SPEED · HERE" value="15.8" unit="km/s" w={720} size={130} />
    <Pop t={t} a={8} cx={540} cy={588}><STPill x={540} y={588} text="OUR SUM" align="middle" size={26} /></Pop>
    <Pop t={t} a={60} cx={540} cy={1220}><Tag x={540} y={1220} text="TWICE TODAY'S" size={44} /></Pop>
  </VStage>
);

/** rockets pay for speed in a cruel way: the tank above a little rocket swells while Lev watches */
const Cruel: VShot = ({ t, d, f }) => {
  const G = 1150;
  const H = mix(120, 620, ease(t, 6, d - 6));
  const wob = Math.sin(t / 6) * 1.2;
  return (
    <VStage fam="moss" t={t} d={d} f={f}>
      <MossLedge y={G} />
      <path d={rrect(500, G - 6, 260, 22, 8)} fill={BRASS_DARK} />
      <Rocket x={630} y={G - 6} h={110} />
      <g transform={`rotate(${wob} 630 ${G - 120})`}>
        <path d={rrect(630 - 90, G - 126 - H, 180, H, 50)} fill={TERRA} />
        <path d={rrect(630 + 18, G - 110 - H, 50, H - 30, 25)} fill={TERRA_DEEP} opacity={0.45} />
        <path d={rrect(630 - 70, G - 100 - H, 24, H - 50, 12)} fill={TERRA_LIT} opacity={0.6} />
        {[0.3, 0.7].map((u) => <path key={u} d={rrect(630 - 96, G - 126 - H + H * u, 192, 18, 8)} fill={BRASS} opacity={0.9} />)}
        <T x={630} y={G - 126 - H / 2 + 14} size={40} ls={3}>FUEL</T>
      </g>
      <Lev x={300} y={G - 4} h={220} frame={f} pose={t > d * 0.6 ? "shrug" : "stand"} eyes={t > d * 0.4 ? "wide" : "up"} tilt={-12} wind={0.3} shade="#9FB7A6" />
    </VStage>
  );
};

/** every extra bit of speed multiplies the fuel: the curve, drawn to scale (fuel = e^(v/4.41) − 1) */
const Curve: VShot = ({ t, d, f }) => {
  const X = (v: number) => 150 + v * 48;
  const Y = (v: number) => 1120 - (Math.exp(v / 4.41) - 1) * 18;
  const vEnd = 16.2 * ease(t, 4, d - 20);
  const d0 = "M " + Array.from({ length: 60 }, (_, i) => (vEnd * i) / 59).map((v) => `${X(v).toFixed(1)} ${Y(v).toFixed(1)}`).join(" L ");
  const marks: [number, string, number][] = [[7.9, "TODAY", 50], [15.8, "HERE", 96]];
  return (
    <VStage fam="chalk" t={t} d={d} f={f}>
      <path d="M 150 300 V 1120 H 960" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <T x={555} y={1190} size={38} fill={INK} ls={4}>SPEED</T>
      <text x={105} y={710} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={38} letterSpacing={4} fill={INK} transform="rotate(-90 105 710)">FUEL NEEDED</text>
      {marks.map(([v, lab, at]) => {
        const o = ease(t, at, at + 12);
        return o > 0 ? (
          <g key={lab} opacity={o}>
            <path d={`M ${X(v)} 1120 V ${Y(v)}`} stroke={INK} strokeWidth={3} strokeDasharray="8 8" strokeDashoffset={-t * 1.6} />
            <circle cx={X(v)} cy={Y(v)} r={14} fill={TERRA} />
            <T x={X(v) - 26} y={Y(v) - 4} size={38} fill={TERRA_DEEP} anchor="end" ls={2}>{lab}</T>
          </g>
        ) : null;
      })}
      <path d={d0} stroke={TERRA} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Bloom x={X(vEnd)} y={Y(vEnd)} r={60} color={TERRA} strength={0.5 + 0.3 * Math.sin(t / 4)} />
      <circle cx={X(vEnd)} cy={Y(vEnd)} r={14 + Math.sin(t / 3) * 2} fill={TERRA_DEEP} />
      <Lev x={860} y={1118} h={170} frame={f} facing={-1} pose="point" hands={{ front: [62, -150 + Math.sin(t / 6) * 6] }} eyes="up" tilt={-8} wind={0.2} outline={INK} />
    </VStage>
  );
};

// ------------------------------------------------------------------ line 33: the fuel tube (one tick = one empty rocket)
const PAD = 1150, U = 150, RX = 330, BX = 470, BW = 150;
const fuelS = (L: number) => Math.min(1.5, 820 / (L + 60));
/** pad, rocket and fuel tube, zoomed so the fuel always fits (scale about the pad centre) */
const FuelScene: React.FC<{ t: number; L: number; children?: React.ReactNode }> = ({ t, L, children }) => {
  const s = fuelS(L);
  const fy = PAD - L;
  const wob = (x: number) => Math.sin(x / 18 + t / 4) * 5;
  const surf = `M ${BX} ${fy + wob(0)} ` + Array.from({ length: 9 }, (_, i) => `L ${BX + (i + 1) * (BW / 9)} ${fy + wob((i + 1) * 15)}`).join(" ");
  const n = Math.ceil(L / U);
  const ws = 1 / Math.sqrt(s);
  return (
    <g transform={`translate(540 ${PAD}) scale(${s}) translate(-540 ${-PAD})`}>
      <path d={`M -4000 ${PAD + 10} H 5000 V ${PAD + 4000} H -4000 Z`} fill={MOSS.near} />
      <path d={`M -4000 ${PAD + 10} H 5000`} stroke={MOSS.bounce} strokeWidth={6 / s} />
      <path d={rrect(240, PAD - 6, 420, 24, 8)} fill={BRASS_DARK} />
      <Rocket x={RX} y={PAD - 6} h={U} />
      {L > 2 ? (
        <g>
          <path d={`M ${BX - 10} ${fy - 30} L ${BX - 10} ${PAD} L ${BX + BW + 10} ${PAD} L ${BX + BW + 10} ${fy - 30}`} stroke={CHALK} strokeWidth={6 * ws} fill="none" opacity={0.8} />
          <path d={`${surf} L ${BX + BW} ${PAD} L ${BX} ${PAD} Z`} fill={AIR} opacity={0.92} />
          <path d={surf} stroke="#E6F7FB" strokeWidth={5} fill="none" />
          {Array.from({ length: 12 }, (_, i) => {
            const span = Math.max(1, L - 30);
            const by = PAD - 10 - (((t * (3 + rnd(i) * 2)) / s + rnd(i + 9) * 900) % span);
            return <circle key={i} cx={BX + 30 + rnd(i * 7) * (BW - 50)} cy={by} r={(4 + rnd(i * 3) * 4) * ws} fill="#E6F7FB" opacity={0.6} />;
          })}
          {Array.from({ length: n }, (_, i) => {
            const y = PAD - (i + 1) * U;
            const major = (i + 1) % 5 === 0;
            return <path key={i} d={`M ${BX + BW + 14} ${y} h ${major ? 40 : 20}`} stroke={CHALK} strokeWidth={(major ? 6 : 4) * ws} strokeLinecap="round" opacity={0.85} />;
          })}
          <path d={`M ${RX + 30} ${PAD - 6 - U} H ${BX - 14}`} stroke={CHALK} strokeWidth={3 * ws} strokeDasharray="8 8" opacity={0.6} />
        </g>
      ) : null}
      {children}
    </g>
  );
};

/** Even with a perfect rocket, burning hydrogen: Lev rolls a hydrogen tank to the pad */
const Perfect: VShot = ({ t, d, f }) => {
  const x = mix(860, 690, ease(t, 0, 60));
  const rot = ((x - 860) / 50) * (180 / Math.PI);
  return (
    <VStage fam="moss" t={t} d={d} f={f}>
      <FuelScene t={t} L={0}>
        <Bloom x={RX - 14} y={PAD - 80} r={90} color={CHALK} strength={0.3 + 0.2 * Math.sin(t / 5)} />
        <g transform={`rotate(${rot} ${x} ${PAD - 50})`}>
          <circle cx={x} cy={PAD - 50} r={46} fill={CHALK_SHADE} stroke={INK} strokeWidth={3} />
          <circle cx={x} cy={PAD - 50} r={32} fill="none" stroke={INK} strokeWidth={2} opacity={0.4} />
        </g>
        <T x={x} y={PAD - 40} size={30} fill={INK}>H₂</T>
        <Lev x={x + 76} y={PAD - 2} h={130} frame={f} facing={-1} pose="stand" lean={14} hands={{ front: [56, -80], back: [44, -76] }} eyes="squint" wind={0.6} shade="#9FB7A6" />
      </FuelScene>
      <Pop t={t} a={30} cx={540} cy={480}><Tag x={540} y={480} text="A PERFECT ROCKET" size={48} /></Pop>
      <Pop t={t} a={44} cx={540} cy={560}><STPill x={540} y={560} text="IDEAL" align="middle" size={28} /></Pop>
    </VStage>
  );
};
const Fill5: VShot = ({ t, d, f }) => {
  const L = 5 * U * ease(t, 6, 96);
  const s = fuelS(L);
  const tx = 540 + (BX + BW + 70 - 540) * s;
  return (
    <VStage fam="moss" t={t} d={d} f={f} push={0}>
      <FuelScene t={t} L={L}>
        <T x={RX} y={PAD + 60} size={30} ls={2} weight={800}>ROCKET</T>
        <T x={BX + BW / 2} y={PAD + 60} size={30} ls={2} weight={800}>FUEL</T>
      </FuelScene>
      <Pop t={t} a={96} cx={tx + 100} cy={560}>
        <T x={tx} y={600} size={150} anchor="start">5×</T>
        <T x={tx} y={650} size={30} anchor="start" ls={2} weight={800}>THE EMPTY</T>
        <T x={tx} y={688} size={30} anchor="start" ls={2} weight={800}>ROCKET, TODAY</T>
        <STPill x={tx + 4} y={738} text="IDEAL" size={26} />
      </Pop>
    </VStage>
  );
};
const Fill35: VShot = ({ t, d, f }) => {
  const L = mix(5 * U, 35 * U, ease(t, 4, d - 24));
  return (
    <VStage fam="moss" t={t} d={d} f={f} push={0}>
      <FuelScene t={t} L={L} />
      <Pop t={t} a={d - 22} cx={760} cy={560}>
        <T x={660} y={600} size={150} anchor="start">35×</T>
        <T x={660} y={650} size={30} anchor="start" ls={2} weight={800}>THE EMPTY</T>
        <T x={660} y={688} size={30} anchor="start" ls={2} weight={800}>ROCKET, HERE</T>
        <STPill x={664} y={738} text="IDEAL" size={26} />
      </Pop>
      <g opacity={0.95}>
        <Rocket x={120} y={1236} h={56} />
        <T x={170} y={1228} size={30} anchor="start" ls={1} weight={800}>= ONE TICK</T>
      </g>
    </VStage>
  );
};


// ------------------------------------------------------------------ line 34
/** A space program here is a very expensive dream: a tiny rocket under a tank 35× its size (to scale); Lev shrugs */
const Dream: VShot = ({ t, d, f }) => {
  const G = 1170, rh = 24, TW = 190, TH = rh * 35;
  const fam = SUPPOSE.sage;
  const tb = G - rh - 4;
  const wob = Math.sin(t / 9) * 1.4;
  const k = 0.5 - 0.5 * Math.cos(t / 9);
  return (
    <VStage fam="sage" t={t} d={d} f={f}>
      <Bloom x={200} y={420} r={300} color={fam.light} strength={0.6} />
      <path d={`M -40 ${G} C 300 ${G - 14} 800 ${G - 6} 1120 ${G + 6} L 1120 1920 L -40 1920 Z`} fill={fam.near} />
      <path d={`M -40 ${G} C 300 ${G - 14} 800 ${G - 6} 1120 ${G + 6}`} stroke={fam.bounce} strokeWidth={6} fill="none" opacity={0.7} />
      <GroundShadow x={640} y={G + 4} rx={140} opacity={0.25} />
      <Rocket x={640} y={G} h={rh} />
      <g transform={`rotate(${wob} 640 ${tb})`}>
        <path d={`M 640 ${tb} L 590 ${tb - 20} M 640 ${tb} L 690 ${tb - 20}`} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <path d={rrect(640 - TW / 2, tb - 20 - TH, TW, TH, 60)} fill={TERRA} />
        <path d={rrect(640 + TW * 0.12, tb - TH + 10, TW * 0.36, TH - 60, 50)} fill={TERRA_DEEP} opacity={0.45} />
        <path d={rrect(640 - TW * 0.38, tb - TH + 40, 26, TH - 120, 13)} fill={TERRA_LIT} opacity={0.6} />
        {[0.25, 0.55, 0.85].map((u) => <path key={u} d={rrect(640 - TW / 2 - 6, tb - 20 - TH + TH * u, TW + 12, 18, 8)} fill={BRASS} opacity={0.9} />)}
      </g>
      <T x={700} y={G - 4} size={30} anchor="start" fill={INK} ls={2}>← ROCKET</T>
      <Lev x={300} y={G - 2} h={230} frame={f} pose="stand" hands={{ front: [mix(24, 46, k), mix(-58, -100, k)], back: [mix(-24, -46, k), mix(-58, -100, k)] }} eyes={k > 0.6 ? "closed" : "up"} tilt={k * 12} wind={0.3} shade="#B9CBB0" outline={INK} />
      {/* the dream: a thought cloud with a rocket rising out of it */}
      <g transform={`translate(0 ${-t * 0.6})`} opacity={ease(t, 10, 30)}>
        {[[330, 860, 14], [300, 800, 22]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={CHALK} />)}
        <ellipse cx={250} cy={660} rx={150} ry={100} fill={CHALK} />
        <ellipse cx={170} cy={640} rx={70} ry={60} fill={CHALK} />
        <ellipse cx={330} cy={630} rx={70} ry={60} fill={CHALK} />
        <Rocket x={250} y={720 - 50 * ease(t, 20, 120)} h={90} flame={1} frame={f} />
      </g>
    </VStage>
  );
};

export const SHOTS_04: VShot[][] = [
  [beats([0, 85, 187, 302], [ThrowBack, AwayToday, EscTodayRead, EscHere])],
  [beats([0, 110, 262, 356], [OrbitA, OrbitB, Cruel, Curve])],
  [beats([0, 105, 247], [Perfect, Fill5, Fill35])],
  [Dream],
];
