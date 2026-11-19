// ST01 act "l01": shot bodies keyed by storyboard id (see ../shotlist.ts and the storyboard). 1-01..1-10, family sage.
import React from "react";
import { ShotMap, ShotStage, ease, lin, mix, pop, CounterSpec } from "../shot";
import { Bloom, LightWash } from "../../../lib/illustrated/light";
import { blobPts, rrect, smoothPath } from "../../../lib/illustrated/shapes";
import { rnd } from "../../../lib/illustrated/motion";
import { mixHex } from "../../../lib/illustrated/palette";
import { CHALK, INK, OCEAN, ST_FONT, SUPPOSE, TERRA } from "../../../lib/suppose/palette";
import { Lev, levHand } from "../../../lib/suppose/lev";
import { STPill } from "../../../lib/suppose/devices";
import { Earth } from "../../../lib/suppose/frames";
import { ChapterBeat, closedPath, House, Pt, Tree } from "./cold-parts";
import { Backpack, BathScale, BeachScene, Bike, GroceryBag, PuffyCoat, SAND, Stopwatch, Tag, TERRA_DK } from "./l01-parts";

const S = SUPPOSE.sage;
const C11: CounterSpec = { label: "SIZE", value: "×1.1", sub: "GRAVITY 1.1 g" };
const overshoot = (k: number) => (k <= 0 ? 0 : k >= 1 ? 1 : 1 - Math.pow(1 - k, 3) + Math.sin(k * Math.PI) * 0.08);

// ------------------------------------------------------------------ 1-04 map continents (map-local units, 1000 × 560)
const LANDS: { x: number; y: number; r: number; seed: number; sq: number }[] = [
  { x: 210, y: 190, r: 120, seed: 11, sq: 0.9 }, { x: 300, y: 400, r: 80, seed: 12, sq: 1.2 }, { x: 560, y: 210, r: 105, seed: 13, sq: 0.8 },
  { x: 600, y: 390, r: 90, seed: 14, sq: 1.1 }, { x: 830, y: 260, r: 110, seed: 15, sq: 0.85 }, { x: 860, y: 450, r: 55, seed: 16, sq: 0.9 },
];
const landD = LANDS.map((l) => closedPath(blobPts(l.x, l.y, l.r, 10, l.seed, 0.3, l.sq)));

const coastY = (x: number) => 600 + Math.sin(x / 170) * 70 + Math.sin(x / 63 + 1) * 36 + Math.sin(x / 31 + 2) * 16;

export const SHOTS_L01: ShotMap = {
  // sunny town street; Lev walks with a grocery bag; street scrolls past
  "1-01": ({ t, f }) => {
    const base = 880;
    const lx = 860, lh = 150, ls = lh / 170;
    const ly = 930 - Math.abs(Math.sin(t * 0.42)) * 8;
    const hand = levHand(lx, ly, lh, [30, -84]);
    const period = 2380;
    const wrap = (x: number, p: number) => ((x % p) + p) % p;
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C11}>
        <Bloom x={1480} y={190} r={420} color={S.light} strength={0.9} core={60} coreColor="#FFFBEA" />
        <g>
          <path d={smoothPath([[-100, 720], [300, 650], [700, 690], [1100, 630], [1500, 680], [2020, 640]].map(([x, y]) => [x - wrap(t * 0.8, 400), y] as Pt)) + " L 2100 1100 L -500 1100 Z"} fill={S.far} />
        </g>
        <g>
          {Array.from({ length: 7 }, (_, i) => {
            const x = wrap(i * 340 - t * 4, period) - 300;
            const w = 230 + rnd(i * 3) * 70;
            const h = 170 + rnd(i * 5) * 90;
            return <House key={i} x={x} base={base} w={w} h={h} seed={i + 2} />;
          })}
        </g>
        <g>
          <rect x={-60} y={base} width={2040} height={70} fill={mixHex(S.sky[2], INK, 0.08)} />
          <path d={`M -60 ${base} H 1980`} stroke={S.near} strokeWidth={4} opacity={0.5} />
          {Array.from({ length: 14 }, (_, i) => {
            const x = wrap(i * 160 - t * 7, 2240) - 160;
            return <path key={i} d={`M ${x} ${base + 6} L ${x + 30} ${base + 64}`} stroke={S.near} strokeWidth={3} opacity={0.25} />;
          })}
          <rect x={-60} y={base + 70} width={2040} height={200} fill={S.near} />
          {Array.from({ length: 4 }, (_, i) => {
            const x = wrap(i * 620 + 200 - t * 7, 2480) - 240;
            return <Tree key={i} x={x} y={base + 4} h={250} seed={i + 30} frame={f} />;
          })}
          {Array.from({ length: 3 }, (_, i) => {
            const x = wrap(i * 820 + 520 - t * 7, 2460) - 200;
            return (
              <g key={`p${i}`}>
                <path d={`M ${x} ${base + 4} V ${base - 260} q 0 -26 30 -26 h 26`} stroke={INK} strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.75} />
                <circle cx={x + 58} cy={base - 280} r={11} fill={S.light} />
              </g>
            );
          })}
          <GroceryBag hx={hand[0]} hy={hand[1]} s={ls * 1.7} swing={Math.sin(t * 0.42) * 7} />
          <Lev x={lx} y={ly} h={lh} frame={f} pose="stand" hands={{ front: [30, -84] }} lean={4 + Math.sin(t * 0.84) * 2} eyes="happy" wind={0.8} outline={INK} />
        </g>
      </ShotStage>
    );
  },

  // backpack, bike, Lev on three bathroom scales; needles tick up; +10 % tags pop
  "1-02": ({ t, f }) => {
    const floor = 880;
    const xs = [420, 960, 1500];
    const lands = [18, 60, 102];
    const top = floor - 100;
    const needle = (k: number) => {
      const L = lands[k];
      if (t < L) return -100;
      const a = t - L;
      const toOld = -100 + 90 * (1 - Math.exp(-a * 0.35) * Math.cos(a * 0.6));
      const tick = ease(t, L + 18, L + 24) * 9 + Math.sin(Math.max(0, t - L - 24) * 0.9) * 2.5 * Math.exp(-Math.max(0, t - L - 24) * 0.2) * (t > L + 24 ? 1 : 0);
      return toOld + tick;
    };
    const drop = (k: number) => {
      const p = lin(t, lands[k] - 16, lands[k]);
      return -(1 - p * p) * 900;
    };
    // Lev hops onto scale 3 from the floor beside it
    const hop = ease(t, lands[2] - 14, lands[2]);
    const levX = mix(1270, 1500, hop);
    const bounce = t > 126 ? Math.abs(Math.sin((t - 126) * 0.32)) * 10 * Math.exp(-(t - 126) * 0.03) : 0;
    const levY = mix(floor - 4, top, hop) - Math.sin(hop * Math.PI) * 90 - bounce;
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C11}>
        <LightWash x={900} y={420} rx={900} ry={420} color={S.light} strength={0.5} />
        <g>
          <rect x={-60} y={floor} width={2040} height={260} fill={S.mid} />
          {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M ${i * 140 - 80} ${floor} L ${i * 180 - 360} 1100`} stroke={S.near} strokeWidth={3} opacity={0.3} />)}
          <path d={`M -60 ${floor + 60} H 1980`} stroke={S.near} strokeWidth={3} opacity={0.3} />
          <path d={`M -60 ${floor} H 1980`} stroke={S.near} strokeWidth={4} opacity={0.6} />
          {xs.map((x, k) => <BathScale key={k} cx={x} base={floor} needle={needle(k)} ghost={t >= lands[k] + 16 ? -10 : undefined} />)}
          <g transform={`translate(0 ${drop(0)})`}>{t >= lands[0] - 16 ? <Backpack cx={xs[0]} base={top} /> : null}</g>
          <g transform={`translate(0 ${drop(1)})`}>{t >= lands[1] - 16 ? <Bike cx={xs[1]} base={top} spin={t * 6} /> : null}</g>
          <Lev x={levX} y={levY} h={190} frame={f} pose={t > lands[2] + 22 ? "shrug" : "stand"} eyes={t > lands[2] + 22 ? "happy" : "open"} tilt={t > lands[2] ? 14 : 0} wind={0.4} outline={INK} />
        </g>
        <Tag x={xs[0]} y={top - 220} text="+10 %" k={pop(t, lands[0] + 20, 12)} />
        <Tag x={xs[1]} y={top - 220} text="+10 %" k={pop(t, lands[1] + 20, 12)} />
        <Tag x={xs[2]} y={top - 270 - bounce} text="+10 %" k={pop(t, lands[2] + 20, 12)} />
      </ShotStage>
    );
  },

  // Lev in a puffy coat (it flies on and puffs up), then shrugs
  "1-03": ({ t, f }) => {
    const x = 960, y = 1000, h = 460;
    const sh = ease(t, 62, 74);
    const meh = t > 74 ? Math.sin((t - 74) * 0.45) * 4 * Math.exp(-(t - 74) * 0.04) : 0;
    const hands: { front: Pt; back: Pt } = {
      front: [mix(24, 46, sh), mix(-58, -98, sh) + meh],
      back: [mix(-24, -46, sh), mix(-58, -98, sh) + meh],
    };
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C11}>
        <LightWash x={960} y={520} rx={760} ry={460} color={S.light} strength={0.6} />
        <g>
          <path d={`M -60 ${y - 4} H 1980 V 1200 H -60 Z`} fill={S.mid} />
          <path d={`M -60 ${y - 4} H 1980`} stroke={S.near} strokeWidth={5} opacity={0.5} />
        </g>
        <g>
          <Lev x={x} y={y} h={h} frame={f} pose="stand" hands={hands} eyes={t > 70 ? "happy" : t > 14 ? "wide" : "open"} tilt={sh * 10 + Math.sin(t / 16) * 2} wind={0.35} outline={INK} />
          <PuffyCoat x={x} y={y} h={h} frame={f} t={t} hands={hands} inAt={6} />
        </g>
      </ShotStage>
    );
  },

  // flat map of continents stretches like dough; LAND +21 %
  "1-04": ({ t, f }) => {
    const mx = 200, my = 170, mw = 1000, mh = 560;
    const kx = overshoot(lin(t, 20, 96));
    const ky = overshoot(lin(t, 28, 104));
    const sx = 1 + 0.1 * kx, sy = 1 + 0.1 * ky;
    const corner: Pt = [mx + mw * sx, my + mh * sy];
    const lh = 230, ls = lh / 170, feet = 960;
    const pulling = t < 110;
    const hy = (corner[1] - feet) / ls;
    const levX = corner[0] + 46 * ls;
    const shine = (t - 120) * 24 - 300;
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C11}>
        <LightWash x={700} y={460} rx={800} ry={420} color={S.light} strength={0.5} />
        <g>
          <path d={`M -60 ${feet - 4} H 1980 V 1200 H -60 Z`} fill={S.mid} />
        </g>
        <g>
          <defs>
            <clipPath id="l104map"><rect x={0} y={0} width={mw} height={mh} rx={26} /></clipPath>
          </defs>
          {/* ghost of the old map */}
          <g transform={`translate(${mx} ${my}) scale(${sx} ${sy})`}>
            <rect x={0} y={0} width={mw} height={mh} rx={26} fill={OCEAN} />
            <g clipPath="url(#l104map)">
              {landD.map((d, i) => <path key={i} d={d} fill={i % 2 ? "#7FAE72" : "#9BC283"} />)}
              {t > 120 ? <path d={`M ${shine} -50 L ${shine + 120} -50 L ${shine - 80} ${mh + 50} L ${shine - 200} ${mh + 50} Z`} fill={CHALK} opacity={0.22} /> : null}
            </g>
            <rect x={0} y={0} width={mw} height={mh} rx={26} fill="none" stroke={CHALK} strokeWidth={8 / sx} />
          </g>
          <path d={rrect(mx, my, mw, mh, 26)} fill="none" stroke={INK} strokeWidth={4} strokeDasharray="14 10" opacity={0.45} />
          <Lev x={levX} y={feet} h={lh} frame={f} facing={-1} pose={pulling ? "pull" : "stand"} hands={pulling ? { front: [46, hy], back: [38, hy + 10] } : undefined} lean={pulling ? -12 * kx : 0} eyes={pulling ? "squint" : "happy"} wind={0.6} outline={INK} />
        </g>
        <g transform={`translate(${mx} 900) scale(${pop(t, 112, 14)})`}>
          <text x={0} y={30} fontFamily={ST_FONT} fontWeight={900} fontSize={88} fill={S.text}>LAND +21 %</text>
        </g>
        <g transform={`translate(${mx + 580} 900) scale(${pop(t, 122, 12)})`}>
          <STPill x={0} y={0} text="OUR SUM" dark={false} />
        </g>
      </ShotStage>
    );
  },

  // coastline draws longer; forest trees pop up along it
  "1-05": ({ t, f }) => {
    const head = mix(-40, 2560, ease(t, 0, 150));
    const hx = Math.min(head, 2000);
    const pts: Pt[] = [];
    for (let x = -40; x <= hx; x += 20) pts.push([x, coastY(x)]);
    if (pts.length < 2) pts.push([hx, coastY(hx)]);
    const all: Pt[] = Array.from({ length: 103 }, (_, i) => [-40 + i * 20, coastY(-40 + i * 20)] as Pt);
    const land = `M -40 -60 L ${all.map((p) => p.join(" ")).join(" L ")} L 2000 -60 Z`;
    const coast = smoothPath(pts);
    const foam = pts.map(([x, y], i) => [x, y + 22 + Math.sin(t / 7 + i * 0.6) * 6] as Pt);
    const trees: React.ReactNode[] = [];
    [0, 1, 2].forEach((row) => {
      for (let k = 0; k < 24; k++) {
        const x = k * 88 + 10 + rnd(k * 7 + row * 31) * 40 + row * 30;
        const y = coastY(x) - 60 - row * 150 - rnd(k * 3 + row) * 50;
        if (y < 40 || (x > 1540 && y < 300)) continue;
        const kk = overshoot(Math.max(0, Math.min(1, (head - x - 30 - row * 260) / 70)));
        trees.push(<Tree key={`${row}-${k}`} x={x} y={y} h={110 + rnd(k + row * 9) * 40} seed={k + row * 40} frame={f} k={kk} />);
      }
    });
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C11}>
        <rect x={-100} y={-100} width={2120} height={1280} fill={OCEAN} />
        <LightWash x={700} y={300} rx={1100} ry={600} color="#8ED0E2" strength={0.45} />
        <g>
          {Array.from({ length: 18 }, (_, i) => {
            const x = ((i * 233 + t * 1.6) % 2100) - 100;
            const y = 760 + (i % 6) * 55;
            return <path key={i} d={`M ${x} ${y} q 22 -8 44 0`} stroke={CHALK} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.4} />;
          })}
          <path d={land} fill={S.mid} />
          <path d={coast} stroke={SAND} strokeWidth={26} fill="none" strokeLinecap="round" />
          <path d={smoothPath(foam)} stroke={CHALK} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.8} />
          {trees}
          {head < 2000 ? (
            <g>
              <circle cx={hx} cy={coastY(hx)} r={26} fill="none" stroke={INK} strokeWidth={3} opacity={0.35} />
              <circle cx={hx} cy={coastY(hx)} r={13} fill={INK} />
            </g>
          ) : null}
        </g>
      </ShotStage>
    );
  },

  // two arcs (small ball, bigger ball), Lev on each; the bigger one flattens, its sightline reaches further
  "1-06": ({ t, f }) => {
    const top = 640;
    const r1 = 300;
    const r2 = mix(300, 540, ease(t, 70, 215));
    const e = 92;
    const lev = (cx: number, r: number, key: string, draw: number) => {
      const th = Math.acos(r / (r + e));
      const P: Pt = [cx + r * Math.sin(th), top + r - r * Math.cos(th)];
      const E: Pt = [cx + 10, top - e];
      const D: Pt = [mix(E[0], P[0], draw), mix(E[1], P[1], draw)];
      return (
        <g key={key}>
          <path d={`M ${E[0]} ${E[1]} L ${D[0]} ${D[1]}`} stroke={INK} strokeWidth={5} strokeDasharray="1 13" strokeLinecap="round" opacity={0.8} />
          {draw >= 1 ? (
            <g>
              <path d={`M ${P[0]} ${P[1]} L ${P[0] + 16} ${P[1] - 50}`} stroke={TERRA_DK} strokeWidth={4} strokeLinecap="round" />
              <path d={`M ${P[0] + 16} ${P[1] - 50} l 34 6 l -28 18 Z`} fill={TERRA} transform={`rotate(${Math.sin(t / 6) * 6} ${P[0] + 16} ${P[1] - 50})`} />
            </g>
          ) : null}
          <Lev x={cx} y={top} h={110} frame={f} seed={key === "a" ? 1 : 3} pose="stand" eyes="open" wind={0.4} outline={INK} />
        </g>
      );
    };
    const draw = ease(t, 20, 60);
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C11}>
        <Bloom x={960} y={260} r={700} color={S.light} strength={0.5} />
        <g>
          <Earth cx={500} cy={top + r1} r={r1} seed={3} />
          <Earth cx={1360} cy={top + r2} r={r2} seed={6} />
          {lev(500, r1, "a", draw)}
          {lev(1360, r2, "b", draw)}
        </g>
      </ShotStage>
    );
  },

  // beach: Lev looks out; dotted sightline runs to the horizon; 4.7 km
  "1-07": ({ t, f }) => (
    <ShotStage fam="sage" t={t} f={f} counter={C11}>
      <Bloom x={1500} y={300} r={600} color={S.light} strength={0.6} />
      <g>
        <BeachScene t={t} f={f} end={1480} draw={ease(t, 20, 110)} label={{ k: pop(t, 118, 14), pill: pop(t, 130, 12) }} />
      </g>
    </ShotStage>
  ),

  // the horizon pushes a little further out (no number); a boat rises into view beyond the old point
  "1-08": ({ t, f }) => (
    <ShotStage fam="sage" t={t} f={f} counter={C11}>
      <Bloom x={1500} y={300} r={600} color={S.light} strength={0.6} />
      <g>
        <BeachScene t={t} f={f} end={mix(1480, 1580, ease(t, 14, 84))} draw={1} ghostAt={1480} boat={ease(t, 86, 140)} />
      </g>
    </ShotStage>
  ),

  // stopwatch over the town; nothing breaks; Lev shrugs
  "1-09": ({ t, f }) => {
    const base = 900;
    const sh = ease(t, 48, 60);
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C11}>
        <Bloom x={960} y={380} r={520} color={S.light} strength={0.6} />
        <g>
          <path d={smoothPath([[-100, 760], [400, 700], [900, 740], [1400, 690], [2020, 730]]) + " L 2100 1100 L -100 1100 Z"} fill={S.far} />
        </g>
        <g>
          <g transform={`translate(0 ${Math.sin(t / 10) * 6})`}>
            <Stopwatch cx={960} cy={400} r={190} hand={t * 12} tick={Math.max(0, 1 - (t % 30) / 6)} />
          </g>
          {[[60, 240, 200], [330, 200, 250], [560, 260, 180], [1260, 220, 230], [1500, 260, 190], [1770, 220, 240]].map(([x, w, h], i) => (
            <House key={i} x={x} base={base} w={w} h={h} seed={i + 11} />
          ))}
          <rect x={-60} y={base} width={2040} height={260} fill={S.near} />
          <path d={`M -60 ${base} H 1980`} stroke={S.mid} strokeWidth={5} opacity={0.7} />
          <Lev x={1080} y={base + 2} h={170} frame={f} pose={sh > 0.5 ? "shrug" : "stand"} eyes={sh > 0.5 ? "happy" : "up"} tilt={sh > 0.5 ? 10 + Math.sin(t / 8) * 3 : -12} wind={0.4} outline={INK} />
        </g>
      </ShotStage>
    );
  },

  // chapter beat: rung ×1.25 lights, "A quarter bigger"
  "1-10": ({ t, d, f }) => (
    <ChapterBeat t={t} d={d} f={f} fam="sage" prev={1} next={2} eyebrow="NEXT RUNG" title="A quarter bigger" before={C11} after={{ label: "SIZE", value: "×1.25", sub: "GRAVITY 1.25 g" }} />
  ),
};

