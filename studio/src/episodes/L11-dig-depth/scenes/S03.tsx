// L11 scene l03 "The slowest race" (episodes/L11-dig-depth/script.md §3). Bespoke shots; episode-local props from S01.
// Numbers drawn, each a row in episodes/L11-dig-depth/sources.md:
//   21.7 % of the time drilling at 0-2 km, 3.1 % at 10-11.5 km (#11) · under 2 minutes an hour (#11 arithmetic) ·
//   about 1,000 m in 6 years (#13) · under 0.5 m a day (#13 arithmetic) · 23 cm hole (#3) · basalt expected ~7 km (#6).
import React from "react";
import { useCurrentFrame } from "remotion";
import { SceneTiming } from "../../../lib/timeline";
import { BONE, CornerTicks, GRAPHITE, Gauge, IF, Layer, P, ReferenceFigure, ScaleBar, Stage, bob, cameraAt, crawl, fmt, labelStyle, lit, mixHex, numStyle, ptsToPath, ramp, rnd, shade, specks, tint } from "../../../lib/illustrated";
import { Cue } from "./cue-types";
import { Bit, ClockPie, Crystals, Derrick, E, K, Land, LongSection, SEC, SecGauge, ShotDef, ShotFC, cueKit, lerp, playShots, rockTone, secY } from "./S01";

const l03Cues = (t: SceneTiming) => {
  const { at, p } = cueKit(t);
  return {
    fifth: p(0, "a fifth"),
    past: p(0, "Past ten", -4),
    three: p(0, "three percent"),
    hour: p(0, "In an average", -4),
    two: p(0, "less than two"),
    years: at(1) - 6,
    six: p(1, "six years"),
    half: p(1, "That's under", -4),
    widths: p(1, "About two", -4),
    report: p(1, "As one report", -4),
    harder: p(1, "got harder"),
    slow: at(2) - 6,
    found: p(2, "What they found", -4),
    map: p(2, "The map", -4),
    end: t.frames,
  };
};
type C3 = ReturnType<typeof l03Cues>;

// Shots 1-2 - the clock pies beside a depth ruler: 21.7 % near the top (0-2 km), then the camera drops to 10-11.5 km
// where the slice shrinks to a sliver, 3.1 % (#11)
const Clocks: React.FC<{ f: number; len: number; c: C3; deep: boolean }> = ({ f, len, c, deep }) => {
  const ppk = 70;
  const top = 200;
  const yA = top + 1 * ppk;
  const yB = top + 10.75 * ppk;
  const cam = deep
    ? cameraAt(f, [
        { f: 0, x: 960, y: yA + 260, zoom: 1.0 },
        { f: 26, x: 960, y: yB, zoom: 1.0 },
        { f: len + 10, x: 980, y: yB + 20, zoom: 1.1 },
      ])
    : cameraAt(f, [
        { f: 0, x: 900, y: yA + 120, zoom: 1.12 },
        { f: len + 10, x: 960, y: yA + 260, zoom: 1.0 },
      ]);
  const fillA = deep ? 0.217 : lerp(f, c.fifth - 8, c.fifth + 20, 0, 0.217);
  const fillB = deep ? lerp(f, c.three - c.past - 10, c.three - c.past + 16, 0.217, 0.031) : 0.217;
  const R = 230;
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={1}>
        <rect x={-1000} y={-1000} width={4000} height={1000 + top} fill={K.sky} />
        {Array.from({ length: 16 }, (_, i) => (
          <rect key={i} x={-1000} y={top + i * 1.5 * ppk} width={4000} height={1.5 * ppk + 1} fill={rockTone(i / 10, i)} />
        ))}
        <line x1={-1000} y1={top} x2={3000} y2={top} stroke={P.ink} strokeWidth={2.5} />
        {specks(f, 40, 1920, 1100, 71, 5).map((p, i) => (
          <circle key={i} cx={p.x} cy={top + 30 + p.y} r={p.r * 0.6} fill={tint(E.a, P.ink, 0.3)} opacity={0.45} />
        ))}
        <rect x={346} y={top} width={8} height={11.5 * ppk} fill={K.hole} />
        <line x1={350} y1={top - 20} x2={350} y2={top + 11.5 * ppk} stroke={K.alu} strokeWidth={3} />
        {/* bracket: which depth band each clock belongs to */}
        {[
          [0, 2, yA],
          [10, 11.5, yB],
        ].map(([a, b, y], i) => (
          <g key={i}>
            <path d={`M640 ${top + a * ppk} L660 ${top + a * ppk} L660 ${top + b * ppk} L640 ${top + b * ppk}`} fill="none" stroke={P.ink} strokeWidth={3} />
            <line x1={660} y1={y} x2={1000 - R - 20} y2={y} stroke={P.ink} strokeWidth={2} strokeDasharray="6 6" />
            <text x={630} y={y + 10} textAnchor="end" style={labelStyle(34, P.ink, 2)}>
              {i === 0 ? "0-2 km" : "10-11.5 km"}
            </text>
          </g>
        ))}
        <g transform={`translate(0 ${bob(f, 1, 3, 70)})`}>
          <ClockPie cx={1000} cy={yA} r={R} frac={fillA} f={f} />
          <text x={1000 + R + 50} y={yA + 30} style={numStyle(96, P.ink)} opacity={ramp(f, deep ? 0 : c.fifth - 4, deep ? 1 : c.fifth + 8)}>
            21.7 %
          </text>
        </g>
        <g transform={`translate(0 ${bob(f, 2, 3, 70)})`}>
          <ClockPie cx={1000} cy={yB} r={R} frac={fillB} f={f + 30} />
          <text x={1000 + R + 50} y={yB + 30} style={numStyle(96, P.ink)} opacity={deep ? ramp(f, c.three - c.past + 4, c.three - c.past + 16) : 0}>
            3.1 %
          </text>
        </g>
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};
const ShotClockTop: ShotFC<C3> = (p) => <Clocks {...p} deep={false} />;
const ShotClockDeep: ShotFC<C3> = (p) => <Clocks {...p} deep />;

// Shot 3 - one average hour as sixty minute-cells: they light up idle grey one by one; under two of them were cutting (#11)
const ShotMinutes: ShotFC<C3> = ({ f, len, c }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.0 },
    { f: len + 10, x: 960, y: 540, zoom: 1.08 },
  ]);
  const t0 = c.two - c.hour;
  const n = Math.floor(lerp(f, 6, Math.max(20, t0 - 4), 0, 60));
  const x0 = 360;
  const y0 = 300;
  const cw = 120;
  const chh = 70;
  const hi = ramp(f, t0, t0 + 14);
  return (
    <Stage theme={GRAPHITE} cam={cam}>
      <Layer depth={0.4}>
        {specks(f, 30, 1920, 1080, 81, 8).map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r * 0.8} fill={P.chalkSoft} opacity={0.25} />
        ))}
      </Layer>
      <Layer depth={1}>
        {Array.from({ length: 60 }, (_, i) => {
          const col = i % 10;
          const row = Math.floor(i / 10);
          const x = x0 + col * cw;
          const y = y0 + row * (chh + 22);
          const on = i < n;
          const cutting = i < 2;
          const w = i === 1 ? (cw - 14) * 0.9 : cw - 14; // 1.9 minutes: the second cell is 90 % full
          return (
            <g key={i}>
              <rect x={x} y={y} width={cw - 14} height={chh} fill={P.graphiteLift} stroke={P.chalkSoft} strokeWidth={1.5} opacity={0.8} />
              {on && !cutting ? <rect x={x} y={y} width={cw - 14} height={chh} fill={tint(P.chalkSoft, P.graphite, 0.45)} /> : null}
              {cutting ? <rect x={x} y={y} width={w * Math.max(on ? 1 : 0, hi)} height={chh} fill={K.amber} /> : null}
            </g>
          );
        })}
        <text x={x0} y={y0 - 40} style={labelStyle(44, P.chalkSoft, 4)}>
          One hour
        </text>
        <g opacity={hi}>
          <line x1={x0 + 110} y1={y0 + chh + 4} x2={x0 + 110} y2={y0 + 6 * (chh + 22) + 30} stroke={K.amber} strokeWidth={3} strokeDasharray="6 6" />
          <text x={x0 + 130} y={y0 + 6 * (chh + 22) + 70} style={numStyle(76, P.chalk)}>
            {"< 2 min"}
          </text>
          <text x={x0 + 520} y={y0 + 6 * (chh + 22) + 66} style={labelStyle(40, K.amber, 4)}>
            Cutting rock
          </text>
        </g>
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// Shot 4 - six years flip past on a calendar strip while a ruler fills about 1,000 m (#13)
const ShotYears: ShotFC<C3> = ({ f, len, c }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 940, y: 540, zoom: 1.06 },
    { f: len + 10, x: 980, y: 560, zoom: 1.0 },
  ]);
  const s0 = c.six - c.years;
  const k = lerp(f, 4, Math.max(30, s0 + 10), 0, 1);
  const yr = Math.min(6, Math.floor(k * 6) + 1);
  const m = Math.round(1000 * k);
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={0.3}>
        {specks(f, 24, 1920, 1080, 91, 8).map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={tint(E.b, P.bone, 0.6)} opacity={0.5} />
        ))}
      </Layer>
      <Layer depth={1}>
        {/* calendar strip: six year cards, each turns over in sequence */}
        {Array.from({ length: 6 }, (_, i) => {
          const x = 220 + i * 190;
          const done = i < yr;
          const flip = done ? Math.min(1, (k * 6 - i) * 2) : 0;
          return (
            <g key={i}>
              <rect x={x + 8} y={358} width={160} height={200} fill={shade(P.boneDeep, 0.2)} />
              <rect x={x} y={350} width={160} height={200} fill={done ? lit(P.bone, 0.3) : P.boneDeep} stroke={P.ink} strokeWidth={2} />
              <rect x={x} y={350} width={160} height={46} fill={done ? K.steel : tint(K.steel, P.bone, 0.6)} />
              {[0, 1].map((r) => (
                <circle key={r} cx={x + 50 + r * 60} cy={350} r={8} fill={P.ink} />
              ))}
              <g transform={`translate(${x + 80} 500) scale(1 ${0.3 + 0.7 * flip})`}>
                <text x={0} y={0} textAnchor="middle" style={numStyle(80, done ? P.ink : P.inkSoft)} opacity={done ? 1 : 0.3}>
                  {i + 1}
                </text>
              </g>
            </g>
          );
        })}
        <text x={220} y={640} style={labelStyle(48, P.ink, 4)} opacity={ramp(f, s0 - 4, s0 + 8)}>
          6 years
        </text>
        <Gauge x={1560} y={250} height={600} value={m} max={1000} unit="m" theme={BONE} title="Deeper by" format={(v) => fmt(v)} readout readoutText={`${fmt(m)} m`} side="left" plate={0} unitCap={false} />
        <text x={1567} y={940} textAnchor="middle" style={labelStyle(34, P.inkSoft, 3)} opacity={ramp(f, s0, s0 + 10)}>
          About
        </text>
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 5 - "under half a metre a day": the figure beside a survey post; a day's progress reaches its knee; the sun crosses
const ShotDay: ShotFC<C3> = ({ f, len }) => {
  const G = 900;
  const ppm = 380; // figure 646 px
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.0 },
    { f: len + 10, x: 1000, y: 600, zoom: 1.08 },
  ]);
  const day = lerp(f, 0, len, 0, 1);
  const sunX = 200 + day * 1500;
  const sunY = 420 - Math.sin(day * Math.PI) * 260;
  const bar = lerp(f, 8, Math.min(len - 4, 70), 0, 0.46);
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={0.08}>
        <rect x={-1000} y={-1000} width={4000} height={1000 + G - 300} fill={K.skyHi} />
        <rect x={-1000} y={G - 300} width={4000} height={300} fill={K.sky} />
        <circle cx={sunX} cy={sunY} r={70} fill={K.sunRing} />
        <circle cx={sunX} cy={sunY} r={44} fill={K.sun} />
      </Layer>
      <Layer depth={0.5}>
        <rect x={-1000} y={G - 60} width={4000} height={70} fill={K.farLit} />
      </Layer>
      <Layer depth={1}>
        <rect x={-1000} y={G} width={4000} height={600} fill={K.tundra} />
        <rect x={-1000} y={G} width={4000} height={6} fill={lit(K.tundra, 0.3)} />
        <ReferenceFigure x={700} y={G} pxPerM={ppm} breath={f} look={0.5} />
        {/* survey post with the day's progress */}
        <rect x={1000} y={G - 1.2 * ppm} width={34} height={1.2 * ppm} fill={lit(P.bone, 0.3)} stroke={P.ink} strokeWidth={2} />
        <rect x={1000} y={G - bar * ppm} width={34} height={bar * ppm} fill={K.amber} />
        {Array.from({ length: 13 }, (_, i) => (
          <line key={i} x1={1034} y1={G - i * 0.1 * ppm} x2={1034 + (i % 5 === 0 ? 24 : 12)} y2={G - i * 0.1 * ppm} stroke={P.ink} strokeWidth={2} />
        ))}
        <text x={1080} y={G - 0.5 * ppm + 12} style={numStyle(56, P.ink)} opacity={ramp(f, 20, 34)}>
          {"< 0.5 m"}
        </text>
        <text x={1080} y={G - 0.5 * ppm + 62} style={labelStyle(36, P.inkSoft, 3)} opacity={ramp(f, 24, 38)}>
          A day
        </text>
      </Layer>
      <Layer depth={0}>
        <ScaleBar x={96} y={1000} px={ppm * 0.5} label="0.5 M" color={P.ink} font={IF.label} />
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 6 - 1:1 in the hole: the 23 cm bore, and a day's progress drawn as two bore-widths stacked (#3, #13)
const ShotWidths: ShotFC<C3> = ({ f, len }) => {
  const ppm = 1300; // 23 cm → 299 px
  const w = 0.23 * ppm;
  const cx = 960;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 520, zoom: 1.1 },
    { f: len + 10, x: 960, y: 560, zoom: 1.0 },
  ]);
  const yTop = 220;
  return (
    <Stage theme={GRAPHITE} cam={cam} vignette={0.3}>
      <Layer depth={1}>
        <Crystals x={-500} y={-400} w={2900} h={1900} cell={130} seed={95} f={f} />
        <rect x={-500} y={-400} width={2900} height={1900} fill={P.graphite} opacity={0.35} />
        <rect x={cx - w / 2} y={-400} width={w} height={yTop + 400 + 2 * w} fill={K.hole} />
        {/* fresh rock, the two widths below the old floor */}
        {[0, 1].map((i) => {
          const k = ramp(f, 8 + i * 14, 20 + i * 14);
          const y = yTop + i * w;
          return (
            <g key={i} opacity={k}>
              <circle cx={cx} cy={y + w / 2} r={w / 2 - 6} fill="none" stroke={K.amber} strokeWidth={6} strokeDasharray="18 10" strokeDashoffset={crawl(f, 0.8)} />
              <line x1={cx - w / 2} y1={y + w / 2} x2={cx + w / 2} y2={y + w / 2} stroke={K.amber} strokeWidth={3} />
              <text x={cx} y={y + w / 2 - 14} textAnchor="middle" style={numStyle(44, P.chalk)}>
                23 cm
              </text>
            </g>
          );
        })}
        <g opacity={ramp(f, 36, 48)}>
          <path d={`M${cx + w / 2 + 30} ${yTop} L${cx + w / 2 + 54} ${yTop} L${cx + w / 2 + 54} ${yTop + 2 * w} L${cx + w / 2 + 30} ${yTop + 2 * w}`} fill="none" stroke={P.chalk} strokeWidth={4} />
          <text x={cx + w / 2 + 80} y={yTop + w + 16} style={labelStyle(54, P.chalk, 4)}>
            One day
          </text>
        </g>
        {specks(f, 16, 600, 700, 97, 6).map((p, i) => (
          <circle key={i} cx={cx - 300 + p.x} cy={p.y} r={p.r * 0.6} fill={P.chalkSoft} opacity={0.5} />
        ))}
      </Layer>
      <Layer depth={0}>
        <ScaleBar x={96} y={1000} px={0.1 * ppm} label="10 CM" color={P.chalk} font={IF.label} />
        <CornerTicks color={P.chalk} />
      </Layer>
    </Stage>
  );
};

// Shot 7 - "each extra metre got harder": the bit grinds through metre bands that grow denser; each tick arrives later
const ShotHarder: ShotFC<C3> = ({ f, len }) => {
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 480, zoom: 1.0 },
    { f: len + 10, x: 960, y: 560, zoom: 1.15 },
  ]);
  // metre ticks arrive at growing gaps
  const times = [0, 18, 40, 68, 104, 150];
  const n = times.filter((x) => f >= x).length;
  const prog = n + Math.min(1, (f - times[Math.max(0, n - 1)]) / ((times[n] ?? 999) - times[Math.max(0, n - 1)]));
  const bitY = 520 + prog * 18;
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={1}>
        {Array.from({ length: 24 }, (_, i) => {
          const y = -600 + i * 80;
          return (
            <g key={i}>
              <rect x={-600} y={y} width={3200} height={80} fill={rockTone(0.1 + i * 0.035, i)} />
              <line x1={-600} y1={y} x2={2600} y2={y} stroke={P.ink} strokeWidth={1.5} opacity={0.4} />
              {Array.from({ length: 4 + i * 2 }, (_, j) => (
                <line key={j} x1={(rnd(i * 50 + j) * 3200) - 600} y1={y + 10 + rnd(j + i) * 60} x2={(rnd(i * 50 + j) * 3200) - 580} y2={y + 4 + rnd(j + i) * 60} stroke={tint(E.a, P.ink, 0.3)} strokeWidth={2} opacity={0.5} />
              ))}
            </g>
          );
        })}
        <rect x={830} y={-600} width={260} height={1220 + prog * 18} fill={K.hole} />
        <rect x={944} y={-600} width={32} height={bitY - 600 + 180} fill={K.alu} />
        <g transform={`translate(${Math.sin(f * 2.2) * 2} 0)`}>
          <Bit x={960} y={bitY + 200} s={1.05} spin={f * (1 - prog * 0.12)} />
        </g>
        {Array.from({ length: n }, (_, i) => (
          <g key={i} opacity={Math.min(1, (f - times[i]) / 6)}>
            <line x1={1180} y1={220 + i * 70} x2={1230} y2={220 + i * 70} stroke={P.ink} strokeWidth={4} />
            <text x={1250} y={234 + i * 70} style={numStyle(40, P.ink)}>
              +1 m
            </text>
          </g>
        ))}
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 8 - "slow, they could live with": the rig at dusk-light, figure waiting, clouds crawling, the pipe still turning
const ShotSlow: ShotFC<C3> = ({ f, len }) => {
  const G = 780;
  const cam = cameraAt(f, [
    { f: 0, x: 1000, y: 560, zoom: 1.12 },
    { f: len + 10, x: 940, y: 540, zoom: 1.0 },
  ]);
  return (
    <Stage theme={BONE} cam={cam}>
      <Land f={f * 0.6 + 1300} G={G - 100} seed={22} sunX={1500} />
      <Layer depth={1}>
        <rect x={-700} y={G - 100} width={3400} height={1000} fill={K.tundra} />
        <rect x={-700} y={G} width={3400} height={1000} fill={mixHex(K.tundra, E.b, 0.12)} />
        <Derrick x={900} G={G} h={500} spin={f * 0.4} />
        {/* long shadows fall right, away from the low sun at the left */}
        <path d={ptsToPath([[1330, G], [1900, G + 40], [1900, G + 70], [1260, G + 10]]) + " Z"} fill={shade(K.tundra, 0.2)} />
        <ReferenceFigure x={1420} y={G + 4} pxPerM={18} breath={f} look={-0.6} facing={-1} />
        <path d={ptsToPath([[1420, G + 4], [1560, G + 18], [1560, G + 24], [1420, G + 10]]) + " Z"} fill={shade(K.tundra, 0.25)} />
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 9 - "what they found on the way down": the long section; the tip descends toward the "Basalt?" line at 7 km (#6)
const ShotDescend: ShotFC<C3> = ({ f, len }) => {
  const tip = lerp(f, 0, len + 6, 4.6, 6.75);
  const cam = cameraAt(f, [
    { f: 0, x: 980, y: 480, zoom: 1.15 },
    { f: len + 10, x: 1040, y: secY(6.6), zoom: 1.6 },
  ]);
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={1}>
        <LongSection f={f} drill={tip} basalt={1} />
        <SecGauge value={tip} />
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

// Shot 10 - "the map was wrong": close on the line; the tip touches it and the bold line starts to break up
const ShotMap: ShotFC<C3> = ({ f, len }) => {
  const tip = lerp(f, 0, 20, 6.75, 7.05);
  const cam = cameraAt(f, [
    { f: 0, x: 1240, y: secY(6.9), zoom: 2.3 },
    { f: len + 10, x: 1260, y: secY(7), zoom: 2.5 },
  ]);
  const brk = ramp(f, 22, len);
  return (
    <Stage theme={BONE} cam={cam}>
      <Layer depth={1}>
        <LongSection f={f} drill={tip} basalt={1} struck={brk * 0.35} />
        {f > 18
          ? [0, 1, 2].map((i) => {
              const r = ((f - 18 + i * 10) % 30) * 2.4;
              return <circle key={i} cx={SEC.HX} cy={secY(7)} r={r} fill="none" stroke={P.ink} strokeWidth={2} opacity={1 - r / 72} />;
            })
          : null}
      </Layer>
      <Layer depth={0}>
        <CornerTicks color={P.ink} />
      </Layer>
    </Stage>
  );
};

export const SceneL03: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = l03Cues(t);
  const shots: ShotDef<C3>[] = [
    { from: 0, S: ShotClockTop },
    { from: c.past, S: ShotClockDeep },
    { from: c.hour, S: ShotMinutes },
    { from: c.years, S: ShotYears },
    { from: c.half, S: ShotDay },
    { from: c.widths, S: ShotWidths },
    { from: c.report, S: ShotHarder },
    { from: c.slow, S: ShotSlow },
    { from: c.found, S: ShotDescend },
    { from: c.map, S: ShotMap },
  ];
  return playShots(f, shots, c, t.frames);
};

export const soundL03 = (t: SceneTiming): Cue[] => {
  const c = l03Cues(t);
  return [
    { at: 2, file: "mixkit-2356-ui-pop-dry.mp3", vol: 0.24, dur: 20 },
    { at: c.fifth + 10, file: "mixkit-2568-ui-click-tone.mp3", vol: 0.3, dur: 20 },
    { at: c.past - 2, file: "mixkit-2604-whoosh-deep-air.mp3", vol: 0.26, dur: 60 },
    { at: c.three + 8, file: "mixkit-2568-ui-click-tone.mp3", vol: 0.3, dur: 20 },
    { at: c.hour - 2, file: "mixkit-1489-whoosh-air.mp3", vol: 0.2, dur: 50 },
    ...Array.from({ length: 10 }, (_, i) => ({ at: c.hour + 10 + i * Math.max(2, Math.floor((c.two - c.hour - 16) / 10)), file: "mixkit-2568-ui-click-tone.mp3", vol: 0.08, dur: 8 })),
    { at: c.two, file: "mixkit-2358-ui-pop-long.mp3", vol: 0.28, dur: 20 },
    { at: c.years - 2, file: "mixkit-1493-whoosh-swirl.mp3", vol: 0.22, dur: 50 },
    ...Array.from({ length: 6 }, (_, i) => ({ at: c.years + 8 + Math.round(((c.six - c.years + 6) * i) / 6), file: "mixkit-2356-ui-pop-dry.mp3", vol: 0.14, dur: 14 })),
    { at: c.half - 2, file: "mixkit-1489-whoosh-air.mp3", vol: 0.22, dur: 50 },
    { at: c.half, file: "mixkit-2658-wind-ambience.mp3", vol: 0.1, dur: c.widths - c.half + 4, fadeIn: 6, fadeOut: 6 },
    { at: c.widths - 2, file: "mixkit-2604-whoosh-deep-air.mp3", vol: 0.22, dur: 50 },
    { at: c.widths + 10, file: "mixkit-2568-ui-click-tone.mp3", vol: 0.24, dur: 16 },
    { at: c.widths + 24, file: "mixkit-2568-ui-click-tone.mp3", vol: 0.24, dur: 16 },
    { at: c.report, file: "mixkit-855-drill-electric.mp3", vol: 0.1, dur: c.slow - c.report, fadeIn: 6, fadeOut: 10 },
    ...[18, 40, 68, 104, 150].filter((x) => x < c.slow - c.report).map((x) => ({ at: c.report + x, file: "mixkit-2568-ui-click-tone.mp3", vol: 0.2, dur: 14 })),
    { at: c.slow - 2, file: "mixkit-2658-wind-ambience.mp3", vol: 0.14, trim: 30, dur: c.found - c.slow + 6, fadeIn: 8, fadeOut: 8 },
    { at: c.found - 4, file: "mixkit-1493-whoosh-swirl.mp3", vol: 0.24, dur: 50 },
    { at: c.found, file: "mixkit-2297-rumble-bass-hum.mp3", vol: 0.26, dur: c.map - c.found + 30, fadeIn: 10, fadeOut: 14 },
    { at: c.map + 18, file: "mixkit-1686-boom-underground-echo.mp3", vol: 0.4, dur: 100 },
  ];
};
