// ST02 act "l05" (5 · The stagger): shot bodies keyed by storyboard id (../shotlist.ts).
// This act is a MODEL: every travel-time picture carries the MODEL pill or the TIMES NOT SOURCED stamp. Clock readouts
// (Counter sub) are only 1 SECOND, 10 SECONDS, 1 MINUTE, 10 MINUTES. Other numbers: 761,719 and 96 PUMP STATIONS.
import React from "react";
import { ease, lin, mix, pop, ShotMap, ShotStage } from "../shot";
import { Bloom } from "../../../lib/illustrated/light";
import { rrect } from "../../../lib/illustrated/shapes";
import { mixHex } from "../../../lib/illustrated/palette";
import { rnd } from "../../../lib/illustrated/motion";
import { AIR, CHALK, INK, LIME, OCEAN, SUPPOSE, TERRA } from "../../../lib/suppose/palette";
import { Lev } from "../../../lib/suppose/lev";
import { STPill } from "../../../lib/suppose/devices";
import {
  along, Arrow, Basin, ChapterBeat, Chevron, CREAM, FLUSHES, Hills, MAP_DOTS, NYCMap, polyD, polyLen, Pt, Sign, slamShake, Stamp,
  Stopwatch, TERRA_DARK, Toilet, Txt, WATER,
} from "./l04-parts";
import { bell, ChartAxes, curvePts, FAR_LEN, NEAR_LEN, Packet, PD, PipeDiagram, PumpHouse } from "./l05-parts";

const CHK = SUPPOSE.chalk;
const OLV = SUPPOSE.olive;
const SAGE = SUPPOSE.sage;
const clock = (s: string) => FLUSHES("761,719", "CLOCK " + s);
const C1S = clock("1 SECOND");
const C10S = clock("10 SECONDS");
const C761 = FLUSHES();
const Model: React.FC<{ dark?: boolean; x?: number; y?: number; k?: number }> = ({ dark = false, x = 80, y = 90, k = 1 }) => (
  <g opacity={k}><STPill x={x} y={y} text="MODEL" dark={dark} size={26} /></g>
);

/** where a racing packet is: along its branch, then along the main toward the plant */
const packetAt = (path: Pt[], len: number, s: number): Pt => {
  if (s <= len) return along(path, s);
  return [Math.min(PD.mainX1 + 40, path[path.length - 1][0] + (s - len)), PD.mainY];
};

export const SHOTS_L05: ShotMap = {
  // every toilet flashes at once (lime dots); the Counter gains its clock: 1 SECOND
  "5-01": ({ t, d, f }) => {
    const tF = d * 0.14;
    const since = t - tF;
    const pulse = since < 0 ? 0 : 0.35 + 0.65 * Math.exp(-since / 14) + 0.25 * Math.max(0, Math.cos((since / 24) * Math.PI * 2)) * Math.exp(-since / 120);
    const ring = since < 0 ? -1 : (since % 36) / 36;
    const trunks = ease(t, d * 0.55, d * 0.85);
    const TR: Pt[][] = [
      [[600, 80], [560, 170], [470, 230], [420, 400], [380, 540]],
      [[900, 420], [760, 450], [640, 470], [560, 520], [470, 600]],
      [[650, 720], [560, 700], [460, 660]],
      [[200, 860], [190, 760], [250, 690]],
    ];
    const head = pop(t, tF + 6, 14);
    return (
      <ShotStage fam="chalk" t={t} f={f} counter={since >= 0 ? C1S : C761}>
        <Bloom x={640} y={540} r={620} color={CHK.light} strength={0.7} />
        <NYCMap x={170} y={110} s={0.88} fam="chalk">
          {TR.map((tr, i) => {
            const L = polyLen(tr);
            return trunks > 0 ? <path key={i} d={polyD(tr)} stroke={WATER} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${L * trunks} ${L + 10}`} /> : null;
          })}
          {MAP_DOTS.map((dd, i) => (
            <g key={i}>
              {ring >= 0 && i % 3 === 0 ? <circle cx={dd.x} cy={dd.y} r={8 + ring * 30} fill="none" stroke={LIME} strokeWidth={3} opacity={(1 - ring) * 0.8} /> : null}
              <rect x={dd.x - 7} y={dd.y - 7} width={14} height={14} rx={3} fill={pulse > 0.3 ? LIME : CREAM} stroke={INK} strokeWidth={pulse > 0.3 ? 2.4 : 1.4}
                opacity={pulse > 0 ? 0.55 + 0.45 * pulse : 0.7} />
            </g>
          ))}
        </NYCMap>
        {head > 0 ? (
          <g transform={`translate(1210 560) scale(${head}) translate(-1210 -560)`}>
            <Txt x={1210} y={580} size={88} anchor="start" fill={CHK.text}>ALL AT ONCE</Txt>
          </g>
        ) : null}
        <Model x={1216} y={650} k={ease(t, tF + 14, tF + 30)} />
      </ShotStage>
    );
  },

  // diagram: a short street line and a long one feeding a main; flow dashes
  "5-02": ({ t, d, f }) => {
    const main = ease(t, d * 0.02, d * 0.2);
    const near = ease(t, d * 0.2, d * 0.34);
    const far = ease(t, d * 0.36, d * 0.62);
    const flash = t > d * 0.66 ? 0.5 + 0.5 * Math.sin((t - d * 0.66) / 4) : 0;
    return (
      <ShotStage fam="chalk" t={t} f={f} counter={C1S}>
        <Bloom x={860} y={520} r={680} color={CHK.light} strength={0.7} />
        <PipeDiagram t={t} main={main} near={near} far={far} flash={flash} />
        <Model />
      </ShotStage>
    );
  },

  // the far dot arrives later than the near one
  "5-03": ({ t, d, f }) => {
    const t0 = d * 0.08;
    const v = FAR_LEN / Math.max(1, d * 0.72 - t0);
    const s = Math.max(0, (t - t0) * v);
    const pN = packetAt(PD.near.path, NEAR_LEN, s), pF = packetAt(PD.far.path, FAR_LEN, s);
    const tN = t0 + NEAR_LEN / v, tFar = t0 + FAR_LEN / v;
    const kN = pop(t, tN, 14), kF = pop(t, tFar, 14);
    const Mark: React.FC<{ x: number; k: number; label: string; at: number }> = ({ x, k, label, at }) =>
      k <= 0 ? null : (
        <g>
          <circle cx={x} cy={PD.mainY} r={30 + (t - at) * 4} fill="none" stroke={OCEAN} strokeWidth={5} opacity={Math.max(0, 1 - (t - at) / 16)} />
          <g transform={`translate(${x} ${PD.mainY + 90}) scale(${k})`}>
            <path d={rrect(-86, -30, 172, 56, 28)} fill={INK} opacity={0.85} />
            <Txt x={0} y={9} size={28} ls={3} fill={CHALK}>{label}</Txt>
          </g>
        </g>
      );
    return (
      <ShotStage fam="chalk" t={t} f={f} counter={C1S}>
        <Bloom x={860} y={520} r={680} color={CHK.light} strength={0.7} />
        <PipeDiagram t={t} flash={t < t0 + 12 ? 1 - lin(t, t0, t0 + 12) : 0} labels={1} />
        <Mark x={PD.near.path[1][0]} k={kN} label="FIRST" at={tN} />
        <Mark x={PD.far.path[PD.far.path.length - 1][0]} k={kF} label="LATER" at={tFar} />
        {pF[0] < PD.mainX1 + 30 ? <Packet p={pF} glow={0.3} /> : null}
        {pN[0] < PD.mainX1 + 30 ? <Packet p={pN} glow={0.3} /> : null}
        <Lev x={560} y={1010} h={150} frame={f} pose="point" eyes={t < tN ? "open" : t < tFar ? "up" : "happy"} tilt={-8} wind={0.3} outline={INK} hands={{ front: [62, -132 + Math.sin(t / 6) * 4] }} />
        <Model />
      </ShotStage>
    );
  },

  // underground sewer lines; dots stretch into a ribbon; clock 10 SECONDS
  "5-04": ({ t, d, f }) => {
    const G = 330, MY = 830;
    // each lateral meanders inside its own column (no crossings); more meanders = a longer line = a later arrival
    const zig = [0, 6, 2, 8, 4, 1, 7, 3, 5, 0, 6, 2];
    const branches = Array.from({ length: 12 }, (_, i) => {
      const bx = 150 + i * 122;
      const n = zig[i];
      const pts: Pt[] = [[bx, G + 10]];
      let cx = bx;
      for (let k = 1; k <= n; k++) {
        const yk = G + 10 + ((MY - 40 - G) * k) / (n + 1);
        pts.push([cx, yk]);
        cx = cx === bx ? bx + 72 : bx;
        pts.push([cx, yk]);
      }
      pts.push([cx, MY]);
      return { pts, len: polyLen(pts), bx };
    });
    const maxLen = Math.max(...branches.map((b) => b.len));
    const t0 = d * 0.08;
    const v = maxLen / Math.max(1, d * 0.6 - t0);
    const s = Math.max(0, (t - t0) * v);
    const onMain = branches.filter((b) => s > b.len).map((b) => b.pts[b.pts.length - 1][0] + (s - b.len));
    const rx0 = onMain.length ? Math.min(...onMain) : 0, rx1 = onMain.length ? Math.max(...onMain) : 0;
    const flash = t > t0 - 6 && t < t0 + 18 ? 1 - lin(t, t0, t0 + 18) : 0;
    return (
      <ShotStage fam="olive" t={t} f={f} counter={t < d * 0.32 ? C1S : C10S}>
        {/* street and buildings */}
        {branches.map((b, i) => {
          const h = 90 + rnd(i * 7 + 1) * 120;
          return (
            <g key={"b" + i}>
              <path d={rrect(b.bx - 48, G - h, 96, h + 4, 6)} fill={i % 2 ? OLV.mid : OLV.far} />
              {[0, 1].map((r) => <rect key={r} x={b.bx - 28 + r * 34} y={G - h + 20} width={22} height={26} rx={3} fill={CREAM} opacity={0.35 + 0.2 * Math.sin(f / 13 + i + r)} />)}
              {flash > 0 ? <circle cx={b.bx} cy={G - h - 26} r={12} fill={LIME} opacity={flash} /> : null}
            </g>
          );
        })}
        <rect x={-80} y={G} width={2080} height={800} fill={mixHex(OLV.mid, OLV.shadow, 0.55)} />
        <path d={`M -80 ${G} H 2000`} stroke={OLV.bounce} strokeWidth={6} opacity={0.7} />
        {branches.map((b, i) => (
          <g key={"p" + i}>
            <path d={polyD(b.pts)} stroke={OLV.shadow} strokeWidth={22} fill="none" strokeLinejoin="round" strokeLinecap="round" />
            <path d={polyD(b.pts)} stroke={OLV.far} strokeWidth={14} fill="none" strokeLinejoin="round" strokeLinecap="round" />
          </g>
        ))}
        <path d={`M 60 ${MY} H 1960`} stroke={OLV.shadow} strokeWidth={56} strokeLinecap="round" />
        <path d={`M 60 ${MY} H 1960`} stroke={OLV.far} strokeWidth={44} strokeLinecap="round" />
        <path d={`M 60 ${MY} H 1960`} stroke={WATER} strokeWidth={8} strokeDasharray="20 18" strokeDashoffset={-t * 3} opacity={0.5} />
        <Txt x={120} y={MY + 76} size={24} ls={4} anchor="start" fill={OLV.dim}>SEWER MAIN</Txt>
        {onMain.length ? (
          <g>
            <path d={`M ${rx0} ${MY} H ${Math.max(rx0 + 1, rx1)}`} stroke={AIR} strokeWidth={30} strokeLinecap="round" opacity={0.45} />
            <Bloom x={(rx0 + rx1) / 2} y={MY} r={Math.max(80, (rx1 - rx0) / 2)} color={AIR} strength={0.3} squash={0.3} />
          </g>
        ) : null}
        {branches.map((b, i) => {
          if (t < t0) return null;
          const p: Pt = s <= b.len ? along(b.pts, s) : [b.pts[b.pts.length - 1][0] + (s - b.len), MY];
          return p[0] > 1980 ? null : <circle key={"d" + i} cx={p[0]} cy={p[1]} r={13} fill={AIR} stroke={OLV.shadow} strokeWidth={3} />;
        })}
        <Model dark />
      </ShotStage>
    );
  },

  // a sharp spike melts into a smooth curve
  "5-05": ({ t, d, f }) => {
    const X = 220, Y = 300, W = 1340, H = 520;
    const m = ease(t, d * 0.12, d * 0.78);
    const s0 = 0.022;
    const sg = mix(s0, 0.16, m), c = mix(0.2, 0.44, m);
    const fn = (u: number) => bell(u, c, sg, 0.95, s0);
    const pts = curvePts(X, Y, W, H, fn);
    const ghost = curvePts(X, Y, W, H, (u) => bell(u, 0.2, s0, 0.95, s0));
    const area = polyD(pts) + ` L ${X + W} ${Y + H} L ${X} ${Y + H} Z`;
    const top = pts.reduce((a, p) => (p[1] < a[1] ? p : a), pts[0]);
    return (
      <ShotStage fam="chalk" t={t} f={f} counter={C10S}>
        <Bloom x={860} y={520} r={680} color={CHK.light} strength={0.7} />
        <ChartAxes x={X} y={Y} w={W} h={H} fam="chalk" ylabel="FLOW AT THE PLANT" />
        {m > 0.02 ? <path d={polyD(ghost)} stroke={INK} strokeWidth={4} strokeDasharray="12 10" fill="none" opacity={0.35} /> : null}
        <path d={area} fill={WATER} opacity={0.75} />
        <path d={polyD(pts)} stroke={OCEAN} strokeWidth={8} fill="none" strokeLinejoin="round" />
        {[0, 1, 2].map((i) => {
          const u = ((t * 1.3 + i * 50) % 150) / 150;
          const x = X + u * W;
          const y = Y + H - fn(u) * H * 0.5;
          return fn(u) > 0.05 ? <circle key={i} cx={x} cy={y} r={7} fill={CHALK} opacity={0.8} /> : null;
        })}
        <g opacity={1 - ease(t, d * 0.2, d * 0.32)}>
          <Txt x={X + 0.2 * W + 60} y={Y + 40} size={40} anchor="start" fill={CHK.text}>SPIKE</Txt>
        </g>
        {pop(t, d * 0.76, 14) > 0 ? (
          <g transform={`translate(${top[0]} ${top[1] - 60}) scale(${pop(t, d * 0.76, 14)})`}>
            <Txt x={0} y={0} size={46} fill={CHK.text}>SMOOTH CURVE</Txt>
          </g>
        ) : null}
        <Lev x={1730} y={960} h={160} frame={f} facing={-1} pose="stand" eyes={m > 0.5 ? "happy" : "open"} tilt={-6} wind={0.3} outline={INK} />
        <Model />
      </ShotStage>
    );
  },

  // stamp: TIMES NOT SOURCED · OUR MODEL; Lev shrugs
  "5-06": ({ t, d, f }) => {
    const at = d * 0.06;
    const sh = slamShake(t, at);
    const shr = t > at + 20 ? Math.pow(Math.max(0, Math.sin(((t - at - 20) / 50) * Math.PI)), 0.6) : 0;
    const lerp = (a: Pt, b: Pt, k: number): Pt => [mix(a[0], b[0], k), mix(a[1], b[1], k)];
    const qs: Pt[] = [[560, 330], [1520, 420], [760, 920]];
    return (
      <ShotStage fam="chalk" t={t} f={f} counter={C10S}>
        <g transform={`translate(${sh} ${sh * 0.3})`}>
          <Bloom x={900} y={480} r={680} color={CHK.light} strength={0.7} />
          <PipeDiagram t={t} opacity={0.35} labels={0} />
          {qs.map((p, i) => {
            const k = pop(t, d * (0.4 + i * 0.12), 14);
            return k > 0 ? (
              <g key={i} transform={`translate(${p[0]} ${p[1]}) scale(${k}) translate(${-p[0]} ${-p[1]})`}>
                <Stopwatch x={p[0]} y={p[1]} r={46} k={0} q dark={false} />
              </g>
            ) : null;
          })}
          <Stamp x={880} y={560} t={t} at={at} text="TIMES NOT SOURCED" color={TERRA_DARK} size={92} rot={-6} sub="OUR MODEL" />
          <Lev x={1560} y={1020} h={200} frame={f} facing={-1} pose="stand" outline={INK} eyes={shr > 0.4 ? "closed" : "open"} tilt={shr * 12}
            hands={{ front: lerp([24, -58], [50, -104], shr), back: lerp([-24, -58], [-50, -104], shr) }} wind={0.25} />
        </g>
        <Model />
      </ShotStage>
    );
  },

  // the water side: every tank asks for water at once (arrows all at t = 0)
  "5-07": ({ t, d, f }) => {
    const G = 750, MY = 940;
    const tF = d * 0.1;
    const fill = ease(t, tF + 4, d * 0.42);
    const lvl = t < tF ? 1 : t < tF + 6 ? 1 - lin(t, tF, tF + 6) : fill;
    const firing = t > tF && t < d * 0.44;
    const houses = Array.from({ length: 6 }, (_, i) => ({ x: 200 + i * 250, h: 220 + rnd(i * 5 + 2) * 40 }));
    const chart = ease(t, d * 0.46, d * 0.6);
    const block = ease(t, d * 0.56, d * 0.66);
    const CX = 150, CY = 210, CW = 820, CHh = 120;
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C1S}>
        <Bloom x={1300} y={260} r={560} color={SAGE.light} strength={0.6} />
        <rect x={-80} y={G} width={2080} height={500} fill={SAGE.near} />
        <path d={`M -80 ${G} H 2000`} stroke={SAGE.bounce} strokeWidth={5} opacity={0.6} />
        {/* the water main */}
        <path d={`M -60 ${MY} H 1980`} stroke={INK} strokeWidth={44} />
        <path d={`M -60 ${MY} H 1980`} stroke={TERRA} strokeWidth={34} />
        <path d={`M -60 ${MY} H 1980`} stroke={WATER} strokeWidth={10} strokeDasharray="24 18" strokeDashoffset={-t * (firing ? 6 : 2)} />
        {houses.map((hs, i) => {
          const tx = hs.x - 40;
          const up: Pt[] = [[tx, MY - 18], [tx, G - 80], [hs.x - 16, G - 80]];
          return (
            <g key={i}>
              <path d={rrect(hs.x - 90, G - hs.h, 180, hs.h, 10)} fill={i % 2 ? SAGE.far : mixHex(SAGE.far, CHALK, 0.35)} stroke={INK} strokeWidth={3} />
              <path d={`M ${hs.x - 104} ${G - hs.h + 4} L ${hs.x} ${G - hs.h - 60} L ${hs.x + 104} ${G - hs.h + 4} Z`} fill={TERRA_DARK} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
              {/* cutaway: tank + bowl only */}
              <path d={rrect(hs.x - 66, G - 190, 132, 180, 12)} fill={mixHex(SAGE.sky[2], CHALK, 0.5)} stroke={INK} strokeWidth={3} />
              <path d={polyD(up)} stroke={INK} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d={polyD(up)} stroke={TERRA} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <Toilet x={hs.x + 30} y={G - 14} s={0.92} cut level={lvl} />
              {firing
                ? [0, 1].map((j) => {
                    const u = ((t - tF) * 0.05 + j * 0.5) % 1;
                    return <Chevron key={j} x={tx} y={mix(MY - 30, G - 70, u)} a={-90} s={20} color={OCEAN} opacity={Math.sin(u * Math.PI)} />;
                  })
                : null}
              {t > tF && t < tF + 16 ? <circle cx={tx} cy={MY} r={20 + (t - tF) * 4} fill="none" stroke={OCEAN} strokeWidth={5} opacity={1 - (t - tF) / 16} /> : null}
            </g>
          );
        })}
        {/* demand chart: one block at the very start */}
        <g opacity={chart}>
          <path d={rrect(CX - 40, CY - 70, CW + 80, CHh + 140, 22)} fill={CHALK} opacity={0.75} />
          <ChartAxes x={CX} y={CY} w={CW} h={CHh} fam="sage" ylabel="WATER ASKED FOR" />
          <path d={rrect(CX + 8, CY + CHh - CHh * 0.92 * block, 60, CHh * 0.92 * block, 6)} fill={OCEAN} />
          <path d={`M ${CX + 68} ${CY + CHh - 4} H ${CX + CW}`} stroke={OCEAN} strokeWidth={6} opacity={block} />
          <Txt x={CX + 100} y={CY + 52} size={40} anchor="start" fill={SAGE.text} opacity={ease(t, d * 0.64, d * 0.72)}>ALL AT THE START</Txt>
          <Txt x={CX + 100} y={CY + 94} size={26} ls={3} anchor="start" fill={SAGE.dim} opacity={ease(t, d * 0.7, d * 0.78)}>NO STAGGER</Txt>
        </g>
        <Lev x={1760} y={G} h={170} frame={f} facing={-1} pose={t > tF ? "point" : "stand"} eyes={t > tF && t < tF + 30 ? "wide" : "open"} tilt={-4} wind={0.4} outline={INK} />
        <Model x={80} y={90} />
      </ShotStage>
    );
  },

  // Hillview fills ahead of the game
  "5-08": ({ t, d, f }) => {
    const ground = 900;
    const level = mix(0.32, 0.86, ease(t, d * 0.05, d * 0.85));
    const inPipe: Pt[] = [[-40, 560], [180, 560], [330, 600], [470, 626]];
    const L = polyLen(inPipe);
    const markK = ease(t, d * 0.4, d * 0.5);
    const headK = pop(t, d * 0.1, 14);
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C761}>
        <Bloom x={1300} y={240} r={560} color={SAGE.light} strength={0.6} />
        <Hills fam="sage" ground={ground} t={t} f={f} />
        <path d={polyD(inPipe)} stroke={INK} strokeWidth={42} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={polyD(inPipe)} stroke={TERRA} strokeWidth={32} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <Basin x={1000} y={660} rx={520} ry={150} level={level} t={t} fam="sage" mark={markK > 0 ? 0.32 : undefined} />
        {Array.from({ length: 8 }, (_, i) => {
          const s = (t * 5 + i * (L / 8)) % L;
          const [px, py] = along(inPipe, s), [qx, qy] = along(inPipe, s + 4);
          return <Chevron key={i} x={px} y={py} a={(Math.atan2(qy - py, qx - px) * 180) / Math.PI} s={16} color={CHALK} />;
        })}
        {[0, 1, 2, 3].map((i) => {
          const u = ((t * 2.6 + i * 30) % 120) / 120;
          return <Arrow key={i} x0={mix(380, 580, u)} y0={mix(610, 655, u)} x1={mix(380, 580, u) + 70} y1={mix(610, 655, u) + 10} color={OCEAN} w={9} head={22} opacity={Math.sin(u * Math.PI)} />;
        })}
        {markK > 0 ? (
          <g opacity={markK}>
            <path d="M 1471 750 L 1610 524" stroke={TERRA_DARK} strokeWidth={4} />
            <path d={rrect(1560, 470, 170, 54, 27)} fill={TERRA} stroke={INK} strokeWidth={3} />
            <Txt x={1645} y={507} size={28} ls={3} fill={CHALK}>EXTRA</Txt>
          </g>
        ) : null}
        <Sign x={330} y={ground + 70} text="HILLVIEW RESERVOIR" size={30} />
        {headK > 0 ? (
          <g transform={`translate(130 230) scale(${headK}) translate(-130 -230)`}>
            <Txt x={130} y={250} size={84} anchor="start" fill={SAGE.text}>AHEAD OF THE GAME</Txt>
          </g>
        ) : null}
      </ShotStage>
    );
  },

  // Hillview as a holding tank: drawing down for the daily peak, then recovering
  "5-09": ({ t, d, f }) => {
    const u = lin(t, 0, d);
    const G = 560;
    const g1 = (c: number, s: number) => Math.exp(-(((u - c) / s) ** 2));
    const demand = 0.3 + 0.9 * g1(0.33, 0.08) + 0.9 * g1(0.68, 0.07);
    const level = 0.82 - 0.38 * g1(0.37, 0.09) - 0.38 * g1(0.72, 0.08);
    const tank = { x0: 380, x1: 1180, b0: 470, b1: 1090, bot: 920 };
    const wy = mix(tank.bot, G + 20, level);
    const wl = mix(tank.b0, tank.x0, (tank.bot - wy) / (tank.bot - G)), wr = mix(tank.b1, tank.x1, (tank.bot - wy) / (tank.bot - G));
    const sunA = mix(Math.PI * 0.95, Math.PI * 0.05, u);
    const sun: Pt = [960 + Math.cos(sunA) * 760, 520 - Math.sin(sunA) * 360];
    const out: Pt[] = [[1090, 880], [1300, 880], [1300, 720], [1500, 720]];
    const OL = polyLen(out);
    const peakTag = Math.max(g1(0.35, 0.06), g1(0.7, 0.05));
    const end = ease(t, d * 0.86, d * 0.94);
    const levEyes = level < 0.6 ? "wide" : u > 0.85 ? "happy" : "open";
    return (
      <ShotStage fam="sage" t={t} f={f} counter={C761}>
        <Bloom x={sun[0]} y={sun[1]} r={240} color="#FFF1BE" strength={0.8} />
        <circle cx={sun[0]} cy={sun[1]} r={46} fill="#FFF1BE" />
        <Hills fam="sage" ground={G + 40} t={t} f={f} clouds={false} />
        {/* ground cut-away */}
        <rect x={-80} y={G} width={2080} height={600} fill={mixHex(SAGE.near, SAGE.shadow, 0.3)} />
        <path d={`M -80 ${G} H 2000`} stroke={SAGE.bounce} strokeWidth={6} opacity={0.7} />
        <path d={`M ${tank.x0} ${G} L ${tank.b0} ${tank.bot} H ${tank.b1} L ${tank.x1} ${G} Z`} fill={mixHex(CHALK, SAGE.far, 0.5)} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        <path d={`M ${wl} ${wy} L ${tank.b0} ${tank.bot} H ${tank.b1} L ${wr} ${wy} Z`} fill={OCEAN} />
        <path d={`M ${wl} ${wy} H ${wr}`} stroke={AIR} strokeWidth={6} />
        {[0, 1, 2].map((i) => {
          const k = ((t * 1.2 + i * 70) % 210) / 210;
          const x = mix(wl + 40, wr - 140, k);
          return <path key={i} d={`M ${x} ${wy + 30 + i * 40} q 30 -8 60 0 t 60 0`} stroke={AIR} strokeWidth={4} fill="none" opacity={0.5 * Math.sin(k * Math.PI)} />;
        })}
        <path d={`M ${tank.x0} ${G} L ${tank.b0} ${tank.bot} H ${tank.b1} L ${tank.x1} ${G}`} fill="none" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        {/* inflow + outflow */}
        <path d={`M -40 650 H ${tank.x0 + 30}`} stroke={INK} strokeWidth={30} />
        <path d={`M -40 650 H ${tank.x0 + 30}`} stroke={TERRA} strokeWidth={22} />
        {[0, 1, 2, 3].map((i) => <Chevron key={i} x={((t * 2 + i * 105) % 420) - 30} y={650} a={0} s={13} color={CHALK} />)}
        <path d={polyD(out)} stroke={INK} strokeWidth={30} fill="none" strokeLinejoin="round" />
        <path d={polyD(out)} stroke={TERRA} strokeWidth={22} fill="none" strokeLinejoin="round" />
        {Array.from({ length: 5 }, (_, i) => {
          const s = (t * (2 + demand * 5) + i * (OL / 5)) % OL;
          const [px, py] = along(out, s), [qx, qy] = along(out, s + 4);
          return <Chevron key={i} x={px} y={py} a={(Math.atan2(qy - py, qx - px) * 180) / Math.PI} s={10 + demand * 5} color={CHALK} />;
        })}
        {/* the city it feeds */}
        {Array.from({ length: 6 }, (_, i) => {
          const x = 1480 + i * 66, h = 120 + rnd(i * 9 + 4) * 150;
          return (
            <g key={i}>
              <path d={rrect(x, G - h, 58, h + 4, 5)} fill={i % 2 ? SAGE.near : mixHex(SAGE.near, SAGE.mid, 0.4)} />
              <rect x={x + 14} y={G - h + 18} width={14} height={18} rx={2} fill={CREAM} opacity={0.4 + 0.5 * demand * (0.5 + 0.5 * Math.sin(f / 9 + i))} />
            </g>
          );
        })}
        <path d={`M 1500 720 H 1860 M 1560 720 V ${G} M 1700 720 V ${G} M 1820 720 V ${G}`} stroke={TERRA} strokeWidth={10} fill="none" />
        {peakTag > 0.15 ? (
          <g opacity={Math.min(1, peakTag * 1.6)} transform={`translate(1380 810)`}>
            <path d={rrect(0, -32, 236, 60, 30)} fill={INK} opacity={0.85} />
            <Txt x={118} y={10} size={28} ls={3} fill={CHALK}>DAILY PEAK</Txt>
          </g>
        ) : null}
        <Sign x={250} y={G + 2} text="HILLVIEW" size={30} />
        <Txt x={130} y={250} size={84} anchor="start" fill={SAGE.text} opacity={ease(t, d * 0.03, d * 0.1) * (1 - end)}>HOLDING TANK</Txt>
        <Txt x={130} y={250} size={84} anchor="start" fill={SAGE.text} opacity={end}>BUILT FOR RUSHES</Txt>
        <Lev x={1230} y={G + 2} h={150} frame={f} facing={-1} pose="sit" eyes={levEyes} tilt={level < 0.6 ? 8 : -4} wind={0.3} outline={INK} />
      </ShotStage>
    );
  },

  // clock 1 MINUTE → 10 MINUTES; the ribbon is a low wide hill; 96 PUMP STATIONS
  "5-10": ({ t, d, f }) => {
    const X = 220, Y = 290, W = 1380, H = 400;
    const m = ease(t, d * 0.1, d * 0.8);
    const s0 = 0.07;
    const sg = mix(s0, 0.3, m);
    const fn = (u: number) => bell(u, 0.5, sg, 0.95, s0);
    const pts = curvePts(X, Y, W, H, fn);
    const area = polyD(pts) + ` L ${X + W} ${Y + H} L ${X} ${Y + H} Z`;
    const peakY = Y + H - fn(0.5) * H;
    const sub = t < d * 0.45 ? "1 MINUTE" : "10 MINUTES";
    const lit = lin(t, d * 0.05, d * 0.9);
    return (
      <ShotStage fam="olive" t={t} f={f} counter={clock(sub)}>
        <Bloom x={900} y={480} r={680} color={OLV.bounce} strength={0.25} />
        <ChartAxes x={X} y={Y} w={W} h={H} fam="olive" ylabel="FLOW AT THE PLANT" />
        <path d={polyD(curvePts(X, Y, W, H, (u) => bell(u, 0.5, s0, 0.95, s0)))} stroke={CHALK} strokeWidth={3} strokeDasharray="10 10" fill="none" opacity={0.3 * Math.min(1, m * 4)} />
        <path d={area} fill={WATER} opacity={0.65} />
        <path d={polyD(pts)} stroke={AIR} strokeWidth={7} fill="none" strokeLinejoin="round" />
        <path d={`M ${X} ${peakY} H ${X + W}`} stroke={TERRA} strokeWidth={4} strokeDasharray="14 10" />
        <Txt x={X + W - 10} y={peakY - 16} size={28} ls={3} anchor="end" fill={OLV.text}>PEAK ↓</Txt>
        <Txt x={X + W / 2} y={Y + H - 30} size={34} ls={3} fill={INK} opacity={ease(t, d * 0.7, d * 0.82)}>SAME TOTAL</Txt>
        {/* the pumps that move it */}
        {Array.from({ length: 96 }, (_, i) => {
          const c = i % 24, r = Math.floor(i / 24);
          const on = rnd(i * 13 + 2) < lit * 1.05 ? 1 : 0.2;
          return <PumpHouse key={i} x={X + 30 + c * 57} y={850 + r * 46} on={on * (0.75 + 0.25 * Math.sin(f / 6 + i))} fam="olive" />;
        })}
        <g opacity={ease(t, d * 0.15, d * 0.3)}><STPill x={X} y={794} text="96 PUMP STATIONS" size={24} /></g>
        <Model dark />
      </ShotStage>
    );
  },

  // chapter beat: rung ALL OF NEW YORK
  "5-11": ({ t, d, f }) => <ChapterBeat t={t} d={d} f={f} fam="sage" prev={4} next={5} eyebrow="NEXT RUNG" title="All of New York" counter={clock("10 MINUTES")} />,
};
