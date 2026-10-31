import React from "react";
import { useCurrentFrame } from "remotion";
import { B, F } from "../../../brand/tokens";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { ease } from "../../../lib/ui";
import { heat } from "../gauge";
import { Big, Caption, Inset, Photo, PillTag, QuakeShell, Tag, lin, mix, span } from "./shell";

/** The volcano in section: magma swelling the north flank, which then slides away. Drawn, schematic. */
const Volcano: React.FC<{ swell: number; slide: number; opacity: number }> = ({ swell, slide, opacity }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity }}>
    <path d="M360 880 L900 300 L1000 300 L1200 620 L1200 880 Z" fill="#4A4038" />
    <path d={`M1000 880 C 980 700, 960 ${620 - swell * 60}, ${950 + swell * 40} ${520 - swell * 60} C ${1040 + swell * 70} ${560 - swell * 30}, 1040 720, 1060 880 Z`} fill="#E5602E" />
    <g transform={`translate(${slide * 500} ${slide * 300}) rotate(${slide * 14} 1250 700)`} opacity={1 - slide * 0.7}>
      <path d={`M1000 300 C ${1100 + swell * 70} ${420 - swell * 10}, ${1240 + swell * 80} 560, 1560 880 L1200 880 C 1180 700, 1090 500, 1000 300 Z`} fill="#6B5A4C" stroke="#2A221C" strokeWidth={3} />
    </g>
    <line x1={320} x2={1900} y1={880} y2={880} stroke="#9DB28A" strokeWidth={8} />
  </svg>
);

/** l05 · M5. Sources #22-26. Two M5s, one mountain, one coast. */
export const M5: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const [L1, L2, L3, L4, L5, L6] = [1, 2, 3, 4, 5, 6].map((i) => lineAt(t, i));
  const where = within(t, 0, 0.62);
  const quake = within(t, 1, 0.3);
  const magma = within(t, 1, 0.62);
  const secs = lin(f, L2, within(t, 2, 0.2));
  const slide = ease(f, within(t, 2, 0.28), 40);
  const erupt = within(t, 2, 0.52);
  const power = within(t, 2, 0.8);
  const cross = span(f, magma - 6, erupt + 2);
  const plateOn = (f >= L1 && f < magma + 2) || (f >= erupt && f < L4 + 2);
  const counter = Math.min(10, Math.round(10 * secs));
  const rings = span(f, L4, L6 + 2);
  const ringK = (i: number) => (((f - L4) / 70 + i / 4) % 1);
  const m = f < L4 ? 5.1 : 5.8;
  const reads = f < L1 ? "M5" : f < L4 ? "M5.1" : "M5.8";
  const count = Math.round(150000 * lin(f, within(t, 4, 0.25), within(t, 4, 0.62)));
  return (
    <QuakeShell t={t} index={4} prevM={4} m={f < L1 ? 5 : m} reading={reads} sub="480 t at M5" credit={f >= L6 ? { kind: "real", source: "NPS, 2011" } : plateOn ? { kind: "real", source: "USGS, Austin Post, 1980" } : { kind: "illustration", source: "schematic, not to scale" }}>
      {/* line 0: the same number twice, with different questions behind it */}
      {f < L1 + 2 ? (
        <div style={{ position: "absolute", inset: 0, opacity: span(f, 0, L1 + 2) }}>
          <Big x={560} y={320} big="M5" size={200} />
          {f >= where ? <Big x={1100} y={320} big="M5" size={200} color={B.aqua} opacity={ease(f, where, 10)} /> : null}
          {f >= where ? <Tag x={1000} y={720} align="center" size={50} color={B.paper} opacity={ease(f, where + 6, 10)}>what it does depends on where</Tag> : null}
        </div>
      ) : null}
      {/* lines 1 and 2-3: the portrait photo, camera climbing from the mountain to the column */}
      {plateOn ? <Photo id="l06-msh" pos={`50% ${f < magma ? mix(92, 74, lin(f, L1, magma)) : mix(74, 28, lin(f, erupt, t.lines[4].at))}%`} a={L1} b={L4} s0={1} s1={1.03} /> : null}
      {plateOn ? <PillTag x={1860} y={140} align="right">Mount St. Helens: the eruption that followed, not the quake</PillTag> : null}
      {f >= quake && f < magma ? <Big x={340} y={190} big="8:32 A.M." small="18 May 1980 · M5.1" opacity={ease(f, quake, 10)} /> : null}
      {/* lines 1-2: inside the mountain */}
      {cross > 0 ? <Volcano swell={lin(f, magma, L2)} slide={slide} opacity={cross} /> : null}
      {cross > 0 ? <Big x={340} y={170} big={f < L2 ? "TWO MONTHS OF MAGMA" : counter < 10 ? `${counter} SECONDS` : "ABOUT 10 SECONDS"} small={f < L2 ? "swelling the north side" : "after the quake, the side slides"} size={72} opacity={cross} /> : null}
      {f >= power && f < L3 ? <Caption bottom={140} size={72} color={B.paper}>The earthquake didn't have the power</Caption> : null}
      {f >= L3 && f < L4 ? <Caption bottom={140} size={80}>It just pulled the trigger</Caption> : null}
      {/* lines 4-5: Virginia, rings spreading along a schematic coast from Florida to Canada */}
      {rings > 0 ? (
        <div style={{ position: "absolute", inset: 0, opacity: rings }}>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <line x1={760} x2={760} y1={170} y2={950} stroke={B.mute} strokeWidth={6} />
            {[0, 1, 2, 3].map((i) => (
              <circle key={i} cx={760} cy={540} r={ringK(i) * (f >= L5 ? 560 : 420)} fill="none" stroke={B.gauge} strokeWidth={5} opacity={1 - ringK(i)} />
            ))}
            <circle cx={760} cy={540} r={16} fill={B.tease} />
          </svg>
          <PillTag x={790} y={516} color={B.tease}>Virginia, 2011</PillTag>
          {f >= within(t, 4, 0.75) ? <PillTag x={700} y={170} align="right" opacity={ease(f, within(t, 4, 0.75), 10)}>Canada</PillTag> : null}
          {f >= within(t, 4, 0.75) ? <PillTag x={700} y={905} align="right" opacity={ease(f, within(t, 4, 0.75), 10)}>Florida</PillTag> : null}
          {f >= within(t, 4, 0.25) && f < L5 ? <Big x={1080} y={210} big={f < within(t, 4, 0.62) ? count.toLocaleString("en-US") : "NEARLY 150,000"} small="people reported feeling it" size={76} /> : null}
          {f >= L5 ? <Big x={1080} y={210} big="LIKELY FELT BY MORE" small="than any quake in North American history" size={68} color={B.tease} ink={B.paper} opacity={ease(f, L5, 10)} /> : null}
          {f >= within(t, 5, 0.6) ? <PillTag x={1080} y={420} size={34} color={B.gauge} opacity={ease(f, within(t, 5, 0.6), 10)}>older, harder rock carries the waves</PillTag> : null}
        </div>
      ) : null}
      {/* line 6: the crack on the Monument, camera pushes to it */}
      {f >= L6 ? <Photo id="l06-wm-crack" a={L6} b={t.frames} s0={1} s1={1.25} pos="50% 62%" o0={[50, 50]} o1={[48, 55]} opacity={ease(f, L6, 12)} /> : null}
      {f >= L6 ? <PillTag x={1860} y={140} align="right" opacity={ease(f, L6, 12)}>Washington Monument, photographed from a helicopter, 2011</PillTag> : null}
      {f >= within(t, 6, 0.6) ? <Big x={340} y={190} big="SINCE REPAIRED" size={64} color={B.aqua} opacity={ease(f, within(t, 6, 0.6), 10)} /> : null}
    </QuakeShell>
  );
};

/** l06 · M6. Sources #8-11, #16, #19, #27, #28. One number, many shakings; depth; a chasm that isn't. */
export const M6: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const [L1, L2, L3, L4, L5, L6, L7] = [1, 2, 3, 4, 5, 6, 7].map((i) => lineAt(t, i));
  const twoScales = within(t, 0, 0.68);
  const nis = within(t, 2, 0.72);
  const soft = within(t, 3, 0.68);
  const napa = within(t, 4, 0.2);
  const noChasm = within(t, 4, 0.6);
  const fives = within(t, 6, 0.28);
  const fours = within(t, 6, 0.4);
  const threes = within(t, 6, 0.5);
  const hundred = within(t, 6, 0.72);
  const reading = f >= L2 && f < L4 ? (f < nis ? "M6.7" : f < L3 ? "M6.8" : f < soft ? "M6.7" : "M6.9") : "M6";
  const gaugeM = f >= L2 && f < L4 ? (f < nis ? 6.7 : f < L3 ? 6.8 : f < soft ? 6.7 : 6.9) : f >= L4 && f < L5 ? 6 : 6;
  const shakeOn = span(f, 0, L2 + 2);
  const sect = span(f, L3, soft + 2);
  const credit = f >= L2 && f < L3 ? { kind: "real" as const, source: "FEMA, R. A. Eplett, 1994" } : f >= soft && f < L4 ? { kind: "real" as const, source: "USGS, J. K. Nakata, 1989" } : f >= napa && f < L5 ? { kind: "real" as const, source: "USGS, 2014" } : { kind: "illustration" as const, source: "schematic" };
  const intensity = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
  const slideK = Math.sin((f - L5) / 22);
  return (
    <QuakeShell t={t} index={5} prevM={5.8} m={gaugeM} reading={reading} sub="15 kt at M6" credit={credit}>
      {/* lines 0-1: one number at the centre; rings that fade with distance */}
      {shakeOn > 0 ? (
        <div style={{ position: "absolute", inset: 0, opacity: shakeOn }}>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            {[380, 300, 220, 140, 70].map((r, i) => (
              <circle key={r} cx={1000} cy={510} r={r * ease(f, 20 + i * 10, 30)} fill={["#1C4D73", "#2E8C9A", "#D8B83A", "#E58A35", "#E0483C"][i]} opacity={0.85} />
            ))}
          </svg>
          <Tag x={1000} y={486} align="center" size={46} color={B.paper}>one magnitude</Tag>
          {f >= 70 ? <PillTag x={1420} y={210} size={32} opacity={ease(f, 70, 10)}>shaking varies by place</PillTag> : null}
          {f >= twoScales && f < L1 ? <Caption bottom={140} size={68} color={B.paper}>Two different things, two scales</Caption> : null}
          {f >= L1 ? (
            <div style={{ position: "absolute", left: 420, right: 160, top: 880, display: "flex", gap: 6, height: 62 }}>
              {intensity.map((n, i) => (
                <div key={n} style={{ flex: 1, background: heat(1 + i * 0.75), opacity: ease(f, L1 + 10 + i * 12, 8), borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.headline, fontSize: 34, color: B.ink }}>{n}</div>
              ))}
            </div>
          ) : null}
          {f >= L1 ? <PillTag x={420} y={824} size={28} opacity={ease(f, L1 + 4, 10)}>the shaking scale · one large quake can span all of it</PillTag> : null}
        </div>
      ) : null}
      {/* line 2: Northridge */}
      {f >= L2 && f < L3 ? <Photo id="l06-northridge" a={L2} b={L3} s0={1.02} s1={1.14} o0={[60, 45]} opacity={ease(f, L2, 10)} /> : null}
      {f >= L2 && f < L3 ? <PillTag x={1860} y={140} align="right">Northridge, 1994 · M6.7</PillTag> : null}
      {f >= within(t, 2, 0.3) && f < L3 ? <Big x={340} y={190} big="M6.7 SHOOK HARDER" small="and over a wider area" size={68} opacity={ease(f, within(t, 2, 0.3), 10)} /> : null}
      {f >= nis && f < L3 ? <Big x={340} y={350} big="THAN M6.8" small="Nisqually, 2001" size={68} color={B.aqua} opacity={ease(f, nis, 10)} /> : null}
      {/* line 3: depth to scale, 0 to 36 miles = y 300 to 840 (15 px a mile) */}
      {sect > 0 ? (
        <div style={{ position: "absolute", inset: 0, opacity: sect }}>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <rect x={420} y={300} width={1400} height={560} fill="#3A2F28" />
            <line x1={420} x2={1820} y1={300} y2={300} stroke="#9DB28A" strokeWidth={8} />
            <rect x={560} y={300 + 3 * 15} width={420} height={8 * 15 * lin(f, L3, L3 + 30)} rx={8} fill={B.tease} />
            <rect x={1260} y={300 + 30 * 15} width={420} height={6 * 15 * lin(f, L3 + 25, L3 + 55)} rx={8} fill={B.aqua} />
          </svg>
          <Tag x={770} y={232} align="center" size={38} color={B.tease}>M6.7 Northridge</Tag>
          <Tag x={1470} y={232} align="center" size={38} color={B.aqua}>M6.8 Nisqually</Tag>
          <Tag x={770} y={480} align="center" size={36}>3 to 11 miles down</Tag>
          {f >= L3 + 25 ? <Tag x={1470} y={680} align="center" size={36}>30 to 36 miles down</Tag> : null}
        </div>
      ) : null}
      {f >= soft && f < L4 ? <Photo id="l06-loma" a={soft} b={L4} s0={1.02} s1={1.16} o0={[35, 70]} opacity={ease(f, soft, 10)} /> : null}
      {f >= soft && f < L4 ? <PillTag x={1860} y={140} align="right">San Francisco, M6.9 Loma Prieta, 1989: a different quake</PillTag> : null}
      {f >= soft + 6 && f < L4 ? <Big x={340} y={190} big="SOFT GROUND SHAKES MORE" small="than solid rock" size={64} /> : null}
      {/* line 4: the movie chasm, struck out, then the real rupture */}
      {f >= L4 && f < napa + 4 ? (
        <div style={{ position: "absolute", inset: 0, opacity: span(f, L4, napa + 4) }}>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <path d="M700 180 L860 400 L780 560 L960 780 L900 950 L1320 950 L1240 760 L1360 560 L1180 380 L1260 180 Z" fill="#050A10" stroke={B.tease} strokeWidth={6} />
            <line x1={620} x2={1400} y1={200} y2={920} stroke={B.tease} strokeWidth={22} />
          </svg>
          <Tag x={480} y={240} align="center" size={46} color={B.tease}>the movies</Tag>
        </div>
      ) : null}
      {f >= napa && f < L5 + 2 ? (
        <>
          <Inset id="l06-napa" x={760} y={170} w={880} h={657} a={napa} b={L5} s1={1.12} origin="35% 60%" opacity={span(f, napa, L5 + 2)} />
          <PillTag x={340} y={190} size={30} opacity={span(f, napa, L5 + 2)}>South Napa, 2014 · M6</PillTag>
          {f >= noChasm ? <Big x={340} y={280} big="NOT A CHASM" size={64} color={B.tease} ink={B.paper} opacity={ease(f, noChasm, 10)} /> : null}
        </>
      ) : null}
      {/* line 5: the two sides slide past each other, seen from above */}
      {f >= L5 && f < L6 + 2 ? (
        <div style={{ position: "absolute", inset: 0, opacity: span(f, L5, L6 + 2) }}>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <rect x={320} y={190 + slideK * -6} width={1600} height={350} fill="#7A6A3E" transform={`translate(${slideK * 110} 0)`} />
            <rect x={320} y={546} width={1600} height={350} fill="#6B6030" transform={`translate(${-slideK * 110} 0)`} />
            {Array.from({ length: 12 }, (_, i) => (
              <g key={i}>
                <line x1={380 + i * 130 + slideK * 110} x2={380 + i * 130 + slideK * 110} y1={380} y2={540} stroke="rgba(255,255,255,0.65)" strokeWidth={8} />
                <line x1={380 + i * 130 - slideK * 110} x2={380 + i * 130 - slideK * 110} y1={546} y2={706} stroke="rgba(255,255,255,0.65)" strokeWidth={8} />
              </g>
            ))}
          </svg>
          <Caption bottom={160} size={72}>They slide past each other</Caption>
        </div>
      ) : null}
      {/* lines 6-7: one block, three ways to fill it (#19) */}
      {f >= L6 ? (
        <div style={{ position: "absolute", inset: 0, opacity: ease(f, L6, 10) }}>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <rect x={360} y={300} width={300} height={300} fill={heat(6)} />
            {f >= hundred
              ? Array.from({ length: 100 }, (_, i) => <circle key={i} cx={1000 + (i % 25) * 32} cy={700 + Math.floor(i / 25) * 32} r={11 * ease(f, hundred + i * 0.6, 6)} fill={B.tease} />)
              : null}
          </svg>
          <Tag x={510} y={240} align="center" size={40} color={heat(6)}>one M6</Tag>
          {[
            [fives, "32 MAGNITUDE 5s", 240],
            [fours, "1,000 MAGNITUDE 4s", 370],
            [threes, "32,000 MAGNITUDE 3s", 500],
          ].map(([at, text, y]) =>
            f >= (at as number) ? <div key={text as string} style={{ position: "absolute", left: 760, top: y as number, fontFamily: F.headline, fontSize: 92, lineHeight: 1.1, color: B.paper, opacity: ease(f, at as number, 10), whiteSpace: "nowrap" }}>{text as string}</div> : null,
          )}
          {f >= hundred ? <PillTag x={360} y={740} size={32} color={B.tease} opacity={ease(f, hundred, 10)}>about 100 a year, in the upper sixes</PillTag> : null}
          {f >= L7 ? <Caption bottom={130} size={72} >Each step up: rarer</Caption> : null}
        </div>
      ) : null}
    </QuakeShell>
  );
};

/** l07 · M7. Sources #16, #29-34. A landscape rearranged, a geyser field woken, a pipeline on its shoes. */
export const M7: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const [L1, L2, L3, L4, L5, L6] = [1, 2, 3, 4, 5, 6].map((i) => lineAt(t, i));
  const rearr = within(t, 0, 0.5);
  const six = within(t, 1, 0.65);
  const lake = within(t, 2, 0.72);
  const n289 = within(t, 3, 0.2);
  const n160 = within(t, 3, 0.62);
  const moved = within(t, 4, 0.5);
  const held = within(t, 4, 0.86);
  const shoes = within(t, 5, 0.5);
  const few = within(t, 5, 0.78);
  const pipeLine = within(t, 5, 0.9);
  const reading = f >= L1 && f < L4 ? "M7.3" : f >= L4 && f < shoes ? "M7.9" : "M7";
  const m = f >= L1 && f < L4 ? 7.3 : f >= L4 && f < L6 ? 7.9 : 7;
  const count = Math.round(289 * lin(f, n289 - 10, n289 + 30));
  const pipeOn = f >= L4;
  const diagram = span(f, shoes - 6, few + 2);
  const credit = f < L1 ? { kind: "real" as const, source: "USGS, I. J. Witkind, 1959" } : f < L2 ? { kind: "real" as const, source: "USGS, J. R. Stacy, 1959" } : f < L3 ? { kind: "real" as const, source: "Jstuby, 1997 · CC0" } : f < L4 ? { kind: "real" as const, source: "Yellowstone NPS" } : diagram > 0.5 ? { kind: "illustration" as const, source: "the support, drawn" } : f >= moved && f < held ? { kind: "illustration" as const, source: "arrow over a USGS photo, 2002" } : { kind: "real" as const, source: "USGS, 2002" };
  return (
    <QuakeShell t={t} index={6} prevM={6} m={m} reading={reading} sub="480 kt at M7" credit={credit}>
      {/* line 0: the highway in the lake */}
      {f < L1 + 2 ? <Photo id="l06-hwy287" a={0} b={L1} s0={1.0} s1={1.14} o0={[60, 70]} opacity={span(f, 0, L1 + 2)} /> : null}
      {f < L1 ? <PillTag x={1860} y={140} align="right" opacity={ease(f, 12, 10)}>Highway 287, Hebgen Lake, Montana, 1959</PillTag> : null}
      {f < L1 ? <Big x={340} y={190} big="10 TO 15 A YEAR" size={68} opacity={ease(f, 16, 10)} /> : null}
      {f >= rearr && f < L1 ? <Caption bottom={140} size={72} color={B.paper}>It rearranges the landscape</Caption> : null}
      {/* line 1: the scarp, 1,000 px: an inset, with its height named */}
      {f >= L1 && f < L2 + 2 ? (
        <>
          <Inset id="l06-scarp" x={900} y={150} w={760} h={760} a={L1} b={L2} s0={1} s1={1.2} origin="70% 30%" opacity={span(f, L1, L2 + 2)} />
          <PillTag x={340} y={190} size={30}>Hebgen Lake fault scarp, 1959</PillTag>
          {f >= six ? <Big x={340} y={280} big="UP TO ABOUT 6 M" small="of fault scarp" size={76} opacity={ease(f, six, 10)} /> : null}
        </>
      ) : null}
      {/* line 2: landslide and lake */}
      {f >= L2 && f < L3 + 2 ? <Photo id="l06-quakelake" a={L2} b={L3} s0={1.0} s1={1.16} o0={[80, 40]} o1={[45, 60]} opacity={span(f, L2, L3 + 2)} /> : null}
      {f >= L2 && f < L3 ? <PillTag x={1860} y={140} align="right">the landslide and the lake it made, photographed in 1997</PillTag> : null}
      {f >= within(t, 2, 0.1) && f < L3 ? <Big x={340} y={190} big="LARGEST QUAKE-TRIGGERED SLIDE" small="in recorded North American history" size={60} opacity={ease(f, within(t, 2, 0.1), 10)} /> : null}
      {f >= lake && f < L3 ? <Caption bottom={140} size={72}>It dammed a river and made a lake</Caption> : null}
      {/* line 3: springs. A geyser that is NOT one of them, and says so */}
      {f >= L3 && f < L4 + 2 ? <Photo id="l06-riverside" a={L3} b={L4} s0={1.0} s1={1.16} o0={[70, 60]} opacity={span(f, L3, L4 + 2)} /> : null}
      {f >= L3 && f < L4 ? <PillTag x={1860} y={140} align="right">Riverside Geyser, recent photo · not one of the 1959 springs</PillTag> : null}
      {f >= n289 - 10 && f < L4 ? <Big x={340} y={190} big={`AT LEAST ${count}`} small="springs erupted as geysers, next day" size={84} opacity={ease(f, n289 - 10, 8)} /> : null}
      {f >= n160 && f < L4 ? <Big x={340} y={370} big="160" small="with no record of ever erupting" size={84} color={B.tease} ink={B.paper} opacity={ease(f, n160, 8)} /> : null}
      {/* lines 4-6: the pipeline */}
      {pipeOn ? <Photo id="l06-pipeline" a={L4} b={L5} s0={1.0} s1={1.18} o0={[35, 65]} opacity={ease(f, L4, 10)} /> : null}
      {pipeOn && f < shoes ? <PillTag x={1860} y={140} align="right">Trans-Alaska Pipeline at the Denali Fault, Nov 2002</PillTag> : null}
      {f >= moved && f < held ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <path d={`M700 840 H${700 + 620 * ease(f, moved, 24)} m-40 -30 l40 30 l-40 30`} stroke={B.gauge} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <Big x={340} y={190} big="ABOUT 4 M SIDEWAYS" small="the ground under the pipe · M7.9" size={68} opacity={ease(f, moved, 8)} />
        </>
      ) : null}
      {f >= held && f < L5 ? <Big x={340} y={190} big="THE PIPE DIDN'T BREAK" size={84} color={B.aqua} opacity={ease(f, held, 8)} /> : null}
      {f >= L5 && f < shoes ? <Big x={340} y={190} big="1970s: FAULT PREDICTED" small="where it was, how big it could get" size={64} opacity={ease(f, L5, 10)} /> : null}
      {diagram > 0 ? (
        <div style={{ position: "absolute", inset: 0, opacity: diagram, background: "rgba(5,14,24,0.86)" }}>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <rect x={420} y={640} width={1300} height={40} fill="#9AA7B3" />
            {[560, 1580].map((x) => <rect key={x} x={x} y={680} width={40} height={200} fill="#6B7884" />)}
            <g transform={`translate(${Math.sin((f - shoes) / 16) * 300} 0)`}>
              <rect x={960} y={600} width={150} height={40} rx={8} fill={B.gauge} />
              <circle cx={1035} cy={470} r={130} fill="#C7CFD6" stroke="#6B7884" strokeWidth={6} />
            </g>
          </svg>
          <PillTag x={400} y={560} size={34} color={B.gauge}>sliding shoe</PillTag>
          <PillTag x={400} y={700} size={34}>long steel beam</PillTag>
        </div>
      ) : null}
      {f >= few && f < pipeLine ? <Big x={340} y={190} big="A FEW SUPPORTS DAMAGED" size={68} color={B.tease} ink={B.paper} opacity={ease(f, few, 8)} /> : null}
      {f >= pipeLine && f < L6 ? <Big x={340} y={190} big="THE PIPELINE HELD" size={84} color={B.aqua} opacity={ease(f, pipeLine, 8)} /> : null}
      {f >= L6 ? <Caption bottom={140} size={72}>Alaska: an M7 almost every year</Caption> : null}
    </QuakeShell>
  );
};

/** l08 · M8. Sources #3-7, #16, #35, #36. Headlines say Richter; two needles part at 8.3; the rupture is the measure; a day. */
export const M8: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const [L1, L2, L3, L4, L5, L6] = [1, 2, 3, 4, 5, 6].map((i) => lineAt(t, i));
  const breaks = within(t, 0, 0.45);
  const local = within(t, 2, 0.72);
  const stuck = within(t, 3, 0.5);
  const sixth = within(t, 5, 0.55);
  const small = within(t, 6, 0.55);
  // lines 3-4: a true value climbing past where the old needle sticks
  const truth = 7 + 2.5 * lin(f, L3 + 10, L5);
  const old = Math.min(8.3, truth);
  const nY = (m: number) => 880 - (m - 7) * 240;
  const plate = f >= L5;
  const clockOn = f >= L6;
  const c8 = f < L1 ? 8 : f < L5 ? 8 : 8.8;
  return (
    <QuakeShell t={t} index={7} prevM={7} m={c8} reading={f >= L5 ? "M8.8" : "M8"} sub="15 Mt at M8" credit={plate && !clockOn ? { kind: "real", source: "USGS, Concepción, 2010" } : { kind: "illustration", source: "schematic, not to scale" }}>
      {/* line 0: a calendar row, a mark every year or two */}
      {f < L1 + 2 ? (
        <div style={{ position: "absolute", inset: 0, opacity: span(f, 0, L1 + 2) }}>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            {Array.from({ length: 12 }, (_, i) => (
              <g key={i} opacity={ease(f, 6 + i * 5, 8)}>
                <rect x={400 + i * 120} y={360} width={100} height={100} rx={8} fill="rgba(255,255,255,0.14)" />
                {[1, 3, 4, 6, 8, 9, 11].includes(i) ? <circle cx={450 + i * 120} cy={410} r={32} fill={B.tease} /> : null}
              </g>
            ))}
          </svg>
          <Tag x={400} y={290} size={46} color={B.tease}>M8: once every year or two</Tag>
          {f >= breaks ? <Caption bottom={240} size={80} color={B.paper}>The famous scale breaks down</Caption> : null}
        </div>
      ) : null}
      {/* line 1: the ticker */}
      {f >= L1 && f < L2 + 2 ? (
        <div style={{ position: "absolute", inset: 0, opacity: span(f, L1, L2 + 2) }}>
          <div style={{ position: "absolute", left: 340, right: 80, top: 330, height: 180, background: B.tease, display: "flex", alignItems: "center", overflow: "hidden" }}>
            <div style={{ fontFamily: F.headline, fontSize: 110, color: B.paper, whiteSpace: "nowrap", transform: `translateX(${1400 - (f - L1) * 16}px)` }}>ON THE RICHTER SCALE · ON THE RICHTER SCALE</div>
          </div>
          <Tag x={1100} y={560} align="center" size={34}>the name news reports still use, usually for something else</Tag>
        </div>
      ) : null}
      {/* line 2: 1935, California only */}
      {f >= L2 && f < L3 + 2 ? (
        <div style={{ position: "absolute", inset: 0, opacity: span(f, L2, L3 + 2) }}>
          <Big x={420} y={210} big="1935" small="Charles Richter introduces magnitude" size={130} />
          <Big x={420} y={490} big="CALIFORNIA ONLY" small="near one kind of instrument" size={84} color={B.aqua} opacity={ease(f, within(t, 2, 0.4), 10)} />
          {f >= local ? <Big x={1000} y={700} big="RARELY USED NOW" small="except for small local quakes" size={72} color={B.tease} ink={B.paper} opacity={ease(f, local, 10)} /> : null}
        </div>
      ) : null}
      {/* lines 3-4: the old needle stops at 8.3, the new one keeps rising; to the sourced reading only */}
      {f >= L3 && f < L5 + 2 ? (
        <div style={{ position: "absolute", inset: 0, opacity: span(f, L3, L5 + 2) }}>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            {[7, 7.5, 8, 8.5, 9, 9.5].map((m) => (
              <g key={m}>
                <line x1={470} x2={1280} y1={nY(m)} y2={nY(m)} stroke="rgba(255,255,255,0.22)" strokeWidth={3} />
              </g>
            ))}
            <rect x={570} y={nY(old)} width={200} height={880 - nY(old)} fill={B.tease} />
            {f >= L4 ? <rect x={990} y={nY(truth)} width={200} height={880 - nY(truth)} fill={B.aqua} opacity={ease(f, L4, 10)} /> : null}
            <line x1={470} x2={1280} y1={nY(8.3)} y2={nY(8.3)} stroke={B.gauge} strokeWidth={5} strokeDasharray="16 10" opacity={ease(f, stuck, 10)} />
          </svg>
          {[7, 8, 9].map((m) => <Tag key={m} x={455} y={nY(m) - 22} align="right" size={36}>{m}</Tag>)}
          <Tag x={670} y={896} align="center" size={32} color={B.tease}>a wave-based scale</Tag>
          {f >= L4 ? <Tag x={1090} y={896} align="center" size={32} color={B.aqua} opacity={ease(f, L4, 10)}>moment magnitude</Tag> : null}
          {f >= stuck ? <PillTag x={1310} y={nY(8.3) - 26} size={32} color={B.gauge} opacity={ease(f, stuck, 10)}>stops climbing near 8.3</PillTag> : null}
          {f >= L4 ? <PillTag x={1310} y={700} size={32} color={B.aqua} opacity={ease(f, L4 + 16, 10)}>based on the rupture itself</PillTag> : null}
        </div>
      ) : null}
      {/* lines 5-6: Concepción, then the day */}
      {plate && !clockOn ? <Photo id="l06-concepcion" a={L5} b={L6} s0={1.0} s1={1.14} o0={[60, 45]} opacity={ease(f, L5, 10)} /> : null}
      {plate && !clockOn ? <PillTag x={1860} y={140} align="right">Concepción, Chile, 15 March 2010, after the M8.8</PillTag> : null}
      {f >= sixth && !clockOn ? <Big x={340} y={190} big="M8.8" small="tied for sixth largest ever recorded" size={84} opacity={ease(f, sixth, 10)} /> : null}
      {clockOn ? (
        <div style={{ position: "absolute", inset: 0, opacity: ease(f, L6, 10) }}>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <circle cx={1100} cy={500} r={280} fill="#14507A" stroke={B.aqua} strokeWidth={4} />
            {Array.from({ length: 24 }, (_, i) => (
              <line key={i} x1={1100 + 250 * Math.sin((i * Math.PI) / 12)} y1={500 - 250 * Math.cos((i * Math.PI) / 12)} x2={1100 + 280 * Math.sin((i * Math.PI) / 12)} y2={500 - 280 * Math.cos((i * Math.PI) / 12)} stroke={B.paper} strokeWidth={4} />
            ))}
            <line x1={1100} y1={500} x2={1100 + 240 * Math.sin((f - L6) / 40)} y2={500 - 240 * Math.cos((f - L6) / 40)} stroke={B.gauge} strokeWidth={10} strokeLinecap="round" />
          </svg>
          <Big x={340} y={190} big="A LITTLE OVER A MILLIONTH" small="of a second off Earth's day" size={64} opacity={ease(f, within(t, 6, 0.2), 10)} />
          {f >= small ? <PillTag x={1100} y={830} align="center" size={36} color={B.gauge} opacity={ease(f, small, 10)}>calculated · far too small to measure directly</PillTag> : null}
        </div>
      ) : null}
    </QuakeShell>
  );
};
