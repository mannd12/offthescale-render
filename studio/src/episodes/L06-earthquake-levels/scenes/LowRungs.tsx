import React from "react";
import { useCurrentFrame } from "remotion";
import { DiverSilhouette } from "../../../brand/kit";
import { B, F } from "../../../brand/tokens";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { ease } from "../../../lib/ui";
import { heat, tracePath, yOf } from "../gauge";
import { Big, Caption, Photo, PillTag, QuakeShell, Tag, clamp01, lin, mix, span } from "./shell";

/** cold · lines 0-3. Sources #1, #2, #54. 32 squares become one; M5 against M7 true to area; quick real cuts; back to flat. */
export const ColdOpen: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const L1 = lineAt(t, 1);
  const L2 = lineAt(t, 2);
  const L3 = lineAt(t, 3);
  const notTwice = within(t, 0, 0.62);
  const m7 = within(t, 1, 0.45);
  const five = within(t, 1, 0.62);
  const thousand = within(t, 1, 0.78);
  const realAt = within(t, 2, 0.14);
  const topAt = within(t, 2, 0.42);
  const planetAt = within(t, 2, 0.72);
  // line 2: the column climbs everything as the words say "climbing all of it"
  const climb = lin(f, L2, topAt);
  const m = f < L2 ? (f < L1 ? 5 : 5 + 2 * ease(f, m7, 20)) : f < L3 ? mix(7, 9.5, climb) : mix(9.5, 1, ease(f, L3, 30));
  // line 0: 32 squares arrive across the line, then close up into one block
  const shown = Math.floor(32 * lin(f, 12, notTwice - 25));
  const merge = ease(f, notTwice + 40, 24);
  const blocks = span(f, 0, L1 + 2);
  const size = 54;
  const gap = mix(8, 0, merge);
  const gx = 960 - (8 * size + 7 * gap) / 2 + 60;
  const gy = 360 - (4 * size + 3 * gap) / 2 + 60;
  const cuts = [
    { id: "l06-pipeline", label: "Trans-Alaska Pipeline, 2002", at: realAt, o: [50, 60] as [number, number] },
    { id: "l06-rail", label: "Alaska, 1964", at: mix(realAt, topAt, 0.5), o: [50, 80] as [number, number] },
  ];
  const photoOn = f >= realAt && f < topAt;
  const traceAmp = f < L3 ? 4 + 3 * lin(f, 0, L1) + (f > L2 ? 60 * climb : 0) : mix(70, 2, ease(f, L3, 40));
  const whichCut = f < cuts[1].at ? 0 : 1;
  return (
    <QuakeShell t={t} index={0} prevM={5} m={m} reading={f >= L3 ? `M${Math.round(m)}` : f >= L2 ? (f < topAt ? `M${m.toFixed(1)}` : "M9.5") : `M${Math.round(m)}`} sub="about 32×" subTop="EVERY TICK" title="THE SCALE" credit={photoOn ? { kind: "real", source: whichCut === 0 ? "USGS, 2002" : "USGS, 1964" } : { kind: "illustration", source: "energy, drawn · area to scale" }}>
      {photoOn ? <Photo id={cuts[whichCut].id} a={cuts[whichCut].at} b={cuts[whichCut].at + 90} s0={1.02} s1={1.14} o0={cuts[whichCut].o} /> : null}
      {photoOn ? <PillTag x={1860} y={146} align="right">{cuts[whichCut].label}</PillTag> : null}
      {/* the trace runs the whole frame width and answers each line */}
      {!photoOn && !(f >= topAt && f < L3) ? (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <path d={tracePath(f, 300, 1620, 880, traceAmp, 5)} stroke={B.aqua} strokeWidth={4} fill="none" opacity={0.85} />
        </svg>
      ) : null}
      {/* line 0: one block is 32 of the one below */}
      {blocks > 0 ? (
        <div style={{ position: "absolute", inset: 0, opacity: blocks }}>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            {Array.from({ length: Math.min(32, shown) }, (_, i) => (
              <rect key={i} x={gx + (i % 8) * (size + gap)} y={gy + Math.floor(i / 8) * (size + gap)} width={size} height={size} rx={merge > 0.9 ? 0 : 4} fill={B.gauge} stroke={merge > 0.9 ? B.gauge : B.ink} strokeWidth={2} />
            ))}
          </svg>
          {f >= 20 ? <Tag x={gx} y={gy - 52} color={B.gauge} size={36}>{f < notTwice - 25 ? `${shown} of the step below` : "one step up"}</Tag> : null}
          {f >= notTwice ? <Caption size={84} bottom={290} color={B.paper}>Not twice.</Caption> : null}
          {f >= notTwice + 35 ? <Caption size={108} bottom={160}>32 times</Caption> : null}
        </div>
      ) : null}
      {/* line 1: the two numbers look close; the areas are not */}
      {f >= L1 && f < L2 + 2 ? (
        <div style={{ position: "absolute", inset: 0, opacity: span(f, L1, L2 + 2) }}>
          {f < m7 ? <Caption bottom={460} size={76} color={B.paper}>The numbers on the news</Caption> : null}
          {f >= five ? <div style={{ position: "absolute", left: 340, top: 190, fontFamily: F.headline, fontSize: 170, lineHeight: 1.1, color: heat(5), opacity: ease(f, five, 10) }}>M5</div> : null}
          {f >= m7 ? <div style={{ position: "absolute", left: 340, top: 410, fontFamily: F.headline, fontSize: 170, lineHeight: 1.1, color: heat(7), opacity: ease(f, m7, 10) }}>M7</div> : null}
          {f >= m7 ? (
            <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
              {/* true to area: sides 16 and 16 x sqrt(1000) = 506 */}
              {f >= five ? <rect x={640} y={276} width={16} height={16} fill={heat(5)} /> : null}
              <rect x={1000} y={160 + 506 * (1 - ease(f, thousand - 10, 30))} width={506} height={506 * ease(f, thousand - 10, 30)} fill={heat(7)} />
            </svg>
          ) : null}
          {f >= thousand ? <Big x={1000} y={700} big="ABOUT 1,000 TIMES" small="the energy" opacity={ease(f, thousand, 10)} size={72} color={B.tease} ink={B.paper} /> : null}
        </div>
      ) : null}
      {/* line 2: the top of the climb, then the planet */}
      {f >= topAt && f < L3 ? <Big x={340} y={190} big="ONE NEARLY BROKE THE SCALE" size={76} color={B.tease} ink={B.paper} opacity={span(f, topAt, planetAt + 6)} /> : null}
      {f >= planetAt && f < L3 ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: ease(f, planetAt, 12) }}>
            <circle cx={1100} cy={520} r={260} fill="#14507A" stroke={B.aqua} strokeWidth={4} />
            <path d={Array.from({ length: 91 }, (_, i) => { const a = (i / 90) * 2 * Math.PI * 0.9 * lin(f, planetAt, L3); return `${i ? "L" : "M"}${(1100 + 290 * Math.sin(a)).toFixed(1)} ${(520 - 290 * Math.cos(a)).toFixed(1)}`; }).join(" ")} stroke={B.tease} strokeWidth={10} strokeDasharray="22 14" fill="none" />
          </svg>
          <Tag x={1100} y={840} align="center" color={B.tease} size={40}>the planet runs out of room</Tag>
        </>
      ) : null}
      {/* line 3: the column falls to the bottom and the trace goes nearly flat */}
      {f >= L3 ? <Caption size={84} bottom={320} color={B.paper}>The ones you will never notice</Caption> : null}
    </QuakeShell>
  );
};

/** A band of rock with one tiny burst deep inside it, the surface and a person on top. */
const RockSection: React.FC<{ f: number; burstAt: number; reach: number; felt?: boolean; opacity?: number }> = ({ f, burstAt, reach, felt = false, opacity = 1 }) => {
  const Y = 360;
  const k = ((f - burstAt) % 45) / 45;
  return opacity <= 0 ? null : (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <rect x={300} y={Y} width={1620} height={560} fill="#3A2F28" />
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M300 ${Y + 90 + i * 110} C 800 ${Y + 60 + i * 120}, 1300 ${Y + 130 + i * 100}, 1920 ${Y + 80 + i * 112}`} stroke="rgba(255,255,255,0.1)" strokeWidth={3} fill="none" />
        ))}
        <line x1={300} x2={1920} y1={Y} y2={Y} stroke="#9DB28A" strokeWidth={8} />
        {f >= burstAt
          ? [0, 0.33, 0.66].map((p) => {
              const q = (k + p) % 1;
              return <circle key={p} cx={1100} cy={760} r={10 + q * reach} fill="none" stroke={B.gauge} strokeWidth={4} opacity={1 - q} />;
            })
          : null}
        {f >= burstAt ? <circle cx={1100} cy={760} r={10} fill={B.gauge} /> : null}
      </svg>
      <div style={{ position: "absolute", left: 1060, top: Y - 92 }}>
        <DiverSilhouette size={90} color={felt ? B.tease : B.paper} />
      </div>
    </div>
  );
};

/** l01 · M1. Sources #12, #13, section F. A burst in rock nobody notices; the instrument that does; below zero; the question. */
export const M1: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const L1 = lineAt(t, 1);
  const L2 = lineAt(t, 2);
  const rockAt = within(t, 0, 0.5);
  const nobody = within(t, 0, 0.74);
  const inst = within(t, 0, 0.86);
  const zero = within(t, 1, 0.3);
  const minus = within(t, 1, 0.47);
  const up = within(t, 2, 0.5);
  const photo = span(f, inst, L1 + 4);
  const line = ease(f, L1 + 2, 14);
  // number line: M2 at 1600 ... -1 at 520, 360 px per step, sliding along as it reads downward
  const mX = (m: number) => 880 + m * 360;
  const needle = f < zero ? 1 : f < minus ? mix(1, 0, ease(f, zero, 18)) : f < L2 ? mix(0, -1, ease(f, minus, 22)) : mix(-1, 2.2, ease(f, up, 40));
  return (
    <QuakeShell t={t} index={0} prevM={1} m={1} reading={f >= minus && f < L2 ? "M−1" : "M1"} sub={f >= minus && f < L2 ? "below zero" : undefined} subTop={f >= minus && f < L2 ? "READING" : "ABOUT"} credit={photo > 0.5 ? { kind: "real", source: "Milne-Shaw seismograph · Auckland Museum · CC BY 4.0" } : { kind: "illustration", source: "not to scale" }}>
      <RockSection f={f} burstAt={rockAt} reach={120} opacity={1 - ease(f, inst, 10)} />
      {f < inst ? <Big x={340} y={190} big="HALF A KILO OF TNT" small="about, spread through rock" size={72} opacity={ease(f, 14, 12)} /> : null}
      {f >= nobody && f < inst + 6 ? <PillTag x={1190} y={270} size={36} color={B.gauge}>feels nothing</PillTag> : null}
      <Photo id="l06-milne" opacity={photo} a={inst} b={L1 + 10} s0={1} s1={1.12} o0={[42, 45]} brightness={0.75} />
      {photo > 0 ? <PillTag x={1860} y={146} align="right" size={28} opacity={photo}>a seismograph, museum piece · not recording this quake</PillTag> : null}
      {photo > 0 ? <Caption bottom={140} size={72}>Only instruments feel it</Caption> : null}
      {/* line 1-2: the number line runs through zero */}
      {line > 0 ? (
        <div style={{ position: "absolute", inset: 0, opacity: line }}>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <line x1={420} x2={1800} y1={560} y2={560} stroke={B.paper} strokeWidth={6} />
            {[-1, 0, 1, 2].map((m) => (
              <line key={m} x1={mX(m)} x2={mX(m)} y1={530} y2={590} stroke={B.paper} strokeWidth={6} />
            ))}
            <path d={`M${mX(needle)} 520 l-22 -40 h44 z`} fill={B.gauge} />
            <path d={tracePath(f, 420, 1380, 800, 4 + Math.max(0, needle) * 6, 5)} stroke={B.aqua} strokeWidth={3} fill="none" opacity={0.7} />
          </svg>
          {[-1, 0, 1, 2].map((m) => (
            <div key={m} style={{ position: "absolute", left: mX(m) - 90, width: 180, top: 600, textAlign: "center", fontFamily: F.headline, fontSize: 74, color: m < 0 ? B.aqua : m === 0 ? B.paper : B.mute, opacity: m < 0 ? ease(f, minus, 10) : 1 }}>
              {m < 0 ? `M−${-m}` : `M${m}`}
            </div>
          ))}
          {f >= zero && f < L2 ? <Tag x={mX(0)} y={250} align="center" size={46} color={B.aqua}>it goes below zero</Tag> : null}
          {f >= minus && f < L2 ? <Tag x={mX(-1)} y={720} align="center" size={32} opacity={ease(f, minus + 20, 10)}>far too small to feel</Tag> : null}
          {f >= up ? <div style={{ position: "absolute", left: 1500, top: 180, fontFamily: F.headline, fontSize: 200, lineHeight: 1.1, color: B.tease, opacity: ease(f, up, 12), transform: `scale(${1 + 0.05 * Math.sin(f / 7)})` }}>?</div> : null}
          {f >= up ? <Tag x={1000} y={270} align="center" size={60} color={B.tease} opacity={ease(f, up, 12)}>how high can it go?</Tag> : null}
        </div>
      ) : null}
    </QuakeShell>
  );
};

/** l02 · M2. Sources #14, #15, section F. Dots of a Yellowstone year landing over a real geyser basin; nobody notices. */
export const M2: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const L1 = lineAt(t, 1);
  const L2 = lineAt(t, 2);
  const nothing = within(t, 0, 0.62);
  const ys = within(t, 1, 0.22);
  const count = within(t, 1, 0.42);
  const most = within(t, 1, 0.78);
  const photo = ease(f, L1 - 4, 14);
  const n = Math.floor(240 * lin(f, L1, t.frames));
  const dots = React.useMemo(() => Array.from({ length: 240 }, (_, i) => ({ x: 330 + ((i * 677) % 1540), y: 170 + ((i * 397) % 720), r: 4 + (i % 4) * 1.6 })), []);
  return (
    <QuakeShell t={t} index={1} prevM={1} m={2} credit={photo > 0.5 ? { kind: "illustration", source: "dots drawn over an NPS photo · not positions" } : { kind: "illustration", source: "not to scale" }}>
      <Photo id="l06-jet" opacity={photo} a={L1} b={t.frames} s0={1.02} s1={1.16} o0={[50, 62]} o1={[62, 56]} brightness={0.62} />
      {f < L1 ? (
        <>
          <RockSection f={f} burstAt={10} reach={220} />
          <Big x={340} y={190} big="ABOUT 15 KG OF TNT" size={76} opacity={ease(f, 12, 12)} />
          {f >= nothing ? <PillTag x={1190} y={270} size={36} color={B.gauge}>generally: nothing</PillTag> : null}
        </>
      ) : null}
      {photo > 0 ? <PillTag x={1860} y={146} align="right" opacity={ease(f, ys, 10)}>Yellowstone · Jet Geyser, recent photo · no quake visible</PillTag> : null}
      {photo > 0 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {dots.slice(0, n).map((d, i) => {
            const born = L1 + (i / 240) * (t.frames - L1);
            return <circle key={i} cx={d.x} cy={d.y} r={d.r + 12 * clamp01(1 - (f - born) / 12)} fill={i % 7 === 0 ? B.gauge : B.aqua} opacity={0.85 * ease(f, born, 4)} />;
          })}
        </svg>
      ) : null}
      {f >= count ? <Big x={340} y={190} big="1,500 TO 2,500" small="earthquakes in a typical year" opacity={ease(f, count, 10)} size={84} /> : null}
      {f >= most ? <PillTag x={340} y={356} size={34} color={B.gauge} opacity={ease(f, most, 10)}>most: magnitude 2 or smaller</PillTag> : null}
      {f >= L2 ? (
        <>
          <div style={{ position: "absolute", left: 1100, top: 760, opacity: ease(f, L2, 12) }}>
            <DiverSilhouette size={130} color={B.paper} />
          </div>
          <PillTag x={1240} y={800} size={34} opacity={ease(f, L2 + 16, 10)}>and you never know</PillTag>
        </>
      ) : null}
    </QuakeShell>
  );
};

/** l03 · M3. Sources #14, #17, #18. The felt line runs out of the column; 10,000 squares; 500,000 against 100,000. */
export const M3: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const L1 = lineAt(t, 1);
  const L2 = lineAt(t, 2);
  const sev = within(t, 1, 0.62);
  const felt = within(t, 2, 0.34);
  const below = within(t, 2, 0.68);
  const LINE = yOf(3);
  const lineW = ease(f, 20, 40);
  const cup = span(f, 0, L1 + 2);
  const shake = Math.sin(f * 1.3) * (1 + 3 * lin(f, 30, 90));
  const grid = span(f, L1, L2 + 2);
  const bars = ease(f, L2, 14) * (1 - ease(f, below + 70, 14));
  return (
    <QuakeShell t={t} index={2} prevM={2} m={3} credit={{ kind: "illustration", source: "cup drawn · squares and bars to scale" }}>
      {/* line 0: the cup on a table, ripples growing */}
      {cup > 0 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: cup }}>
          <g transform={`translate(${1060 + shake} 340)`}>
            <path d="M-120 0 H120 V120 Q120 200 40 200 H-40 Q-120 200 -120 120 Z" fill={B.paper} />
            <path d="M120 40 Q200 40 200 100 Q200 160 120 150" stroke={B.paper} strokeWidth={18} fill="none" />
            <ellipse cx={0} cy={2} rx={120} ry={26} fill="#5A3A22" />
            {[0, 1, 2].map((i) => (
              <ellipse key={i} cx={0} cy={2} rx={20 + (((f / 2 + i * 15) % 45) / 45) * 96} ry={4 + (((f / 2 + i * 15) % 45) / 45) * 20} fill="none" stroke="#C49A6C" strokeWidth={3} />
            ))}
          </g>
          <rect x={700} y={540} width={760} height={24} rx={6} fill="#8A6A48" />
        </svg>
      ) : null}
      {/* the line where people start to notice */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={92} x2={92 + 1828 * lineW} y1={LINE} y2={LINE} stroke={B.tease} strokeWidth={5} strokeDasharray="20 12" opacity={1} />
      </svg>
      {f >= 30 ? <PillTag x={1860} y={LINE - 56} align="right" color={B.tease} size={32} opacity={ease(f, 30, 10)}>roughly where people start to notice</PillTag> : null}
      {/* line 1: 10,000 squares, a few rows lit (several hundred; no exact figure is sourced, so no count is shown) */}
      {grid > 0 ? (
        <div style={{ position: "absolute", inset: 0, opacity: grid }}>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <defs>
              <pattern id="l06waffle" width={5} height={5} patternUnits="userSpaceOnUse">
                <rect width={4} height={4} fill="rgba(255,255,255,0.32)" />
              </pattern>
              <pattern id="l06waffleHot" width={5} height={5} patternUnits="userSpaceOnUse">
                <rect width={4} height={4} fill={B.tease} />
              </pattern>
            </defs>
            <rect x={700} y={180} width={500} height={500 * lin(f, L1, L1 + 50)} fill="url(#l06waffle)" />
            {f >= sev ? <rect x={700} y={180} width={500 * ease(f, sev, 20)} height={20} fill="url(#l06waffleHot)" /> : null}
          </svg>
          <Big x={340} y={180} big="ABOUT 10,000" small="a year" opacity={ease(f, L1 + 10, 10)} size={60} />
          <PillTag x={340} y={320} size={28}>Southern California</PillTag>
          {f >= sev ? <PillTag x={1220} y={170} size={32} color={B.tease} opacity={ease(f, sev, 10)}>only several hundred: above M3</PillTag> : null}
        </div>
      ) : null}
      {/* line 2: the world's list, bars to scale */}
      {bars > 0 ? (
        <div style={{ position: "absolute", inset: 0, opacity: bars }}>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <rect x={340} y={260} width={1450 * ease(f, L2 + 10, 30)} height={90} fill={B.aqua} />
            {f >= felt ? <rect x={340} y={490} width={290 * ease(f, felt, 20)} height={90} fill={B.gauge} /> : null}
          </svg>
          <Tag x={340} y={200} size={44} color={B.aqua}>about 500,000 detectable, worldwide, per year</Tag>
          {f >= felt ? <Tag x={340} y={430} size={44} color={B.gauge} opacity={ease(f, felt, 10)}>about 100,000 felt at all</Tag> : null}
        </div>
      ) : null}
      {f >= below + 40 ? <Caption bottom={380} size={72} color={B.paper}>Most of it: below this line</Caption> : null}
    </QuakeShell>
  );
};

/** l04 · M4. Sources #17, #18, #19, #21, section F. Rings reach the neighbours; Norris; 1,000 squares become one M6. */
export const M4: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const L1 = lineAt(t, 1);
  const L2 = lineAt(t, 2);
  const feel = within(t, 0, 0.3);
  const yel = within(t, 0, 0.52);
  const eight = within(t, 0, 0.75);
  const thousand = within(t, 2, 0.3);
  const merge = within(t, 2, 0.62);
  const photo = span(f, yel - 4, L1 + 2);
  const grid = ease(f, L2, 12);
  const cols = 40;
  const n = Math.floor(1000 * lin(f, L2 + 4, merge - 8));
  const m6 = ease(f, merge, 26);
  const size = 16;
  const gap = mix(3, 0, m6);
  const gx = 1100 - (cols * (size + gap)) / 2;
  return (
    <QuakeShell t={t} index={3} prevM={3} m={f >= eight && f < L1 ? 4.8 : 4} reading={f >= eight && f < L1 ? "M4.8" : "M4"} sub={f >= eight && f < L1 ? "15 t at M4" : undefined} credit={photo > 0.5 ? { kind: "real", source: "Yellowstone NPS · no quake visible" } : { kind: "illustration", source: "not to scale" }}>
      {f < yel + 6 ? (
        <>
          <RockSection f={f} burstAt={14} reach={420} felt={f >= feel} />
          <Big x={340} y={190} big="ABOUT 15 TONNES OF TNT" size={72} opacity={ease(f, 18, 12)} />
          {f >= feel ? <PillTag x={1190} y={270} size={36} color={B.tease}>felt by people in the area</PillTag> : null}
        </>
      ) : null}
      <Photo id="l06-norris" opacity={photo} a={yel} b={L1 + 10} s0={1.02} s1={1.15} o0={[70, 50]} o1={[40, 58]} />
      {photo > 0 ? <PillTag x={1860} y={146} align="right" opacity={photo}>Norris Geyser Basin · recent photo, not the quake</PillTag> : null}
      {f >= eight && f < L1 ? <Big x={340} y={190} big="M4.8" small="among Yellowstone's largest in recent years" size={92} opacity={ease(f, eight, 10)} /> : null}
      {/* line 1: the Southern California count again, far smaller */}
      {f >= L1 && f < L2 + 2 ? (
        <div style={{ position: "absolute", inset: 0, opacity: span(f, L1, L2 + 2) }}>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            {Array.from({ length: 20 }, (_, i) => (
              <rect key={i} x={480 + i * 66} y={520 - 30 * ease(f, L1 + i * 3, 10)} width={50} height={50} rx={6} fill={i < 15 ? B.gauge : "rgba(255,200,61,0.45)"} opacity={ease(f, L1 + i * 3, 10)} />
            ))}
          </svg>
          <Big x={480} y={250} big="ABOUT 15 TO 20 A YEAR" small="above M4, Southern California" size={72} opacity={ease(f, L1 + 8, 10)} />
        </div>
      ) : null}
      {/* line 2: a thousand of these, one magnitude 6 */}
      {grid > 0 ? (
        <div style={{ position: "absolute", inset: 0, opacity: grid }}>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            {Array.from({ length: n }, (_, i) => (
              <rect key={i} x={gx + (i % cols) * (size + gap)} y={350 + Math.floor(i / cols) * (size + gap)} width={size} height={size} fill={m6 > 0.5 ? heat(6) : heat(4)} />
            ))}
          </svg>
          {f >= thousand ? <Big x={340} y={190} big="1,000 OF THESE" small={f >= merge ? "= the energy of one magnitude 6" : undefined} size={72} opacity={ease(f, thousand, 10)} /> : null}
          {f >= merge + 30 ? <PillTag x={1100} y={850} align="center" size={34} opacity={ease(f, merge + 30, 10)}>two steps away</PillTag> : null}
        </div>
      ) : null}
    </QuakeShell>
  );
};
