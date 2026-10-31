import React from "react";
import { useCurrentFrame } from "remotion";
import { B, F } from "../../../brand/tokens";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { ease } from "../../../lib/ui";
import { heat } from "../gauge";
import { Big, Caption, Inset, Photo, PillTag, QuakeShell, Tag, lin, mix, span } from "./shell";

/** l09 · M9. Sources #37-42, #51, #68. Alaska 1964: four minutes, the coast moved, the far states, the bell, the ratio. */
export const M9: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const [L1, L2, L3, L4, L5, L6, L7, L8] = [1, 2, 3, 4, 5, 6, 7, 8].map((i) => lineAt(t, i));
  const rupt = within(t, 1, 0.28);
  const coast = within(t, 1, 0.62);
  const sloshed = within(t, 3, 0.18);
  const states = within(t, 3, 0.65);
  const compare = within(t, 5, 0.66);
  const notRec = within(t, 7, 0.82);
  const secs = lin(f, L7 + 10, within(t, 7, 0.45));
  const lit = Math.round(47 * lin(f, states, L4 - 4));
  const swayK = Math.sin((f - L4) / 9);
  const ringK = (i: number) => (((f - L5) / 50 + i / 4) % 1);
  const realOn = (f < L1) || (f >= L2 && f < L3);
  const m = f < L7 ? 9.2 : 9.2;
  return (
    <QuakeShell t={t} index={8} prevM={8.8} m={m} reading="M9.2" sub="480 Mt at M9" credit={f < L1 ? { kind: "real", source: "USGS, 1964" } : realOn ? { kind: "real", source: "USGS, A. Grantz, 1964" } : { kind: "illustration", source: "schematic, not to scale" }}>
      {/* line 0: the tracks */}
      {f < L1 + 2 ? <Photo id="l06-rail" a={0} b={L1} s0={1} s1={1.14} o0={[50, 85]} opacity={span(f, 0, L1 + 2)} /> : null}
      {f < L1 ? <PillTag x={1860} y={140} align="right" opacity={ease(f, 10, 10)}>Alaska Railroad tracks, near Turnagain Arm, 1964</PillTag> : null}
      {f < L1 ? <Big x={340} y={190} big="LARGEST IN U.S. HISTORY" size={68} opacity={ease(f, within(t, 0, 0.55), 10)} /> : null}
      {/* line 1: a clock and a growing rupture; shaking and rupture are separate numbers (#42) */}
      {f >= L1 && f < L2 + 2 ? (
        <div style={{ position: "absolute", inset: 0, opacity: span(f, L1, L2 + 2) }}>
          <Big x={340} y={170} big="ABOUT 4½ MINUTES" small="of shaking" size={72} />
          {f >= rupt ? (
            <>
              <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
                <line x1={360} x2={1760} y1={500} y2={500} stroke="rgba(255,255,255,0.25)" strokeWidth={22} strokeLinecap="round" />
                <line x1={360} x2={360 + 1400 * lin(f, rupt, coast - 4)} y1={500} y2={500} stroke={B.tease} strokeWidth={22} strokeLinecap="round" />
              </svg>
              <Tag x={360} y={420} size={42} color={B.tease}>about 900 km of fault, in about 4 minutes</Tag>
            </>
          ) : null}
          {f >= coast ? (
            <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
              <path d={`M360 840 H900 V${840 - 160 * ease(f, coast, 24)} H1200 V${840 + 50 * ease(f, coast + 40, 20)} H1760`} stroke={B.gauge} strokeWidth={10} fill="none" />
            </svg>
          ) : null}
          {f >= coast ? <Tag x={1050} y={Math.round(600)} align="center" size={38} color={B.gauge}>parts rose by more than 9 m</Tag> : null}
          {f >= coast + 40 ? <Tag x={1480} y={920} align="center" size={38} color={B.aqua}>others sank</Tag> : null}
        </div>
      ) : null}
      {/* line 2: aerial of the ground that moved */}
      {f >= L2 && f < L3 + 2 ? <Photo id="l06-lstreet" a={L2} b={L3} s0={1.02} s1={1.2} o0={[60, 60]} brightness={0.72} opacity={span(f, L2, L3 + 2)} /> : null}
      {f >= L2 && f < L3 ? <PillTag x={1860} y={140} align="right">L Street slide, Anchorage, 1964</PillTag> : null}
      {f >= L2 && f < L3 ? <Big x={340} y={190} big="AT LEAST 15 M SEAWARD" small="much of coastal Alaska" size={68} opacity={ease(f, L2 + 8, 10)} /> : null}
      {/* lines 3-4: distance, then 47 recorders, then the Needle */}
      {f >= L3 && f < L4 + 2 ? (
        <div style={{ position: "absolute", inset: 0, opacity: span(f, L3, L4 + 2) }}>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <path d={`M380 250 L ${380 + 1300 * ease(f, L3 + 6, 40)} ${250 + 240 * ease(f, L3 + 6, 40)}`} stroke={B.aqua} strokeWidth={8} strokeDasharray="20 12" />
            {f >= sloshed ? [0, 1, 2].map((i) => <path key={i} d={`M1500 ${510 + i * 26} q 40 ${Math.sin((f + i * 10) / 5) * 22} 80 0 t 80 0 t 80 0`} stroke={B.aqua} strokeWidth={6} fill="none" />) : null}
            {f >= states
              ? Array.from({ length: 47 }, (_, i) => <rect key={i} x={380 + (i % 24) * 58} y={700 + Math.floor(i / 24) * 74} width={46} height={58} rx={6} fill={i < lit ? B.gauge : "rgba(255,255,255,0.14)"} />)
              : null}
          </svg>
          <PillTag x={340} y={190} size={34} color={B.tease}>Alaska</PillTag>
          {f >= sloshed ? <PillTag x={1500} y={420} size={34} color={B.aqua} opacity={ease(f, sloshed, 10)}>Texas and Louisiana</PillTag> : null}
          {f >= states ? <Big x={380} y={560} big={`${lit} STATES`} small="" size={76} /> : null}
          {f >= states ? <Tag x={840} y={600} size={36} opacity={ease(f, states + 10, 10)}>water-level recorders registered it</Tag> : null}
        </div>
      ) : null}
      {f >= L4 && f < L5 + 2 ? (
        <div style={{ position: "absolute", inset: 0, opacity: span(f, L4, L5 + 2) }}>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <g transform={`rotate(${swayK * 2.2} 1300 900)`}>
              <rect x={1288} y={320} width={24} height={580} fill={B.paper} />
              <ellipse cx={1300} cy={320} rx={120} ry={30} fill={B.paper} />
              <path d="M1290 290 L1300 190 L1310 290 Z" fill={B.paper} />
            </g>
            <line x1={900} x2={1700} y1={900} y2={900} stroke="#9DB28A" strokeWidth={8} />
          </svg>
          <Big x={340} y={190} big="MORE THAN 1,900 KM AWAY" small="Seattle: the Space Needle swayed" size={60} />
        </div>
      ) : null}
      {/* line 5: the planet rings */}
      {f >= L5 && f < L6 + 2 ? (
        <div style={{ position: "absolute", inset: 0, opacity: span(f, L5, L6 + 2) }}>
          {f < compare ? (
            <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
              <circle cx={1100} cy={540} r={250 + 8 * Math.sin((f - L5) / 3)} fill="#14507A" stroke={B.aqua} strokeWidth={4} />
              {[0, 1, 2, 3].map((i) => <circle key={i} cx={1100} cy={540} r={250 + ringK(i) * 260} fill="none" stroke={B.gauge} strokeWidth={5} opacity={1 - ringK(i)} />)}
            </svg>
          ) : null}
          {f < compare ? <Big x={340} y={170} big="“RING LIKE A BELL”" small="U.S. Geological Survey" size={72} /> : null}
          {f >= compare ? <Big x={500} y={460} big="M5.1" small="Mount St. Helens" size={110} color={heat(5)} opacity={ease(f, compare, 8)} /> : null}
        </div>
      ) : null}
      {/* line 6: one square against 1.4 million: sides 1 and 1,183 at the same area scale */}
      {f >= L6 && f < L7 + 2 ? (
        <div style={{ position: "absolute", inset: 0, opacity: span(f, L6, L7 + 2) }}>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <rect x={320} y={980 - 1183 * ease(f, L6 + 6, 60)} width={1183 * ease(f, L6 + 6, 60)} height={1183 * ease(f, L6 + 6, 60)} fill={B.tease} />
            <rect x={1700} y={600} width={2} height={2} fill={B.paper} />
            <circle cx={1701} cy={601} r={26 + 4 * Math.sin((f - L6) / 6)} fill="none" stroke={B.paper} strokeWidth={4} />
          </svg>
          <PillTag x={1701} y={640} align="center" size={30}>M5.1</PillTag>
          <Big x={420} y={400} big="ABOUT 1.4 MILLION TIMES" small="the energy · M9.2" size={80} color={B.ink} ink={B.paper} opacity={ease(f, within(t, 6, 0.3), 10)} />
        </div>
      ) : null}
      {/* lines 7-8: Sumatra's clock, then the rank */}
      {f >= L7 && f < L8 + 2 ? (
        <div style={{ position: "absolute", inset: 0, opacity: span(f, L7, L8 + 2) }}>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <rect x={380} y={500} width={1400} height={70} rx={10} fill="rgba(255,255,255,0.14)" />
            <rect x={380} y={500} width={1400 * secs} height={70} rx={10} fill={B.aqua} />
          </svg>
          <Big x={380} y={230} big={`${Math.round(500 * secs)} SECONDS`} small="off Sumatra, 2004: a rupture still running" size={80} />
          {f >= within(t, 7, 0.5) ? <PillTag x={380} y={600} size={34} color={B.aqua} opacity={ease(f, within(t, 7, 0.5), 10)}>longer than any known earthquake</PillTag> : null}
          {f >= notRec ? <Caption bottom={190} size={80}>Neither is the record</Caption> : null}
        </div>
      ) : null}
      {f >= L8 ? (
        <div style={{ position: "absolute", inset: 0, opacity: ease(f, L8, 10) }}>
          <div style={{ position: "absolute", left: 480, top: 270, fontFamily: F.headline, fontSize: 130, lineHeight: 1.2, color: B.tease }}>#1 &nbsp;?</div>
          <div style={{ position: "absolute", left: 480, top: 470, fontFamily: F.headline, fontSize: 130, lineHeight: 1.2, color: B.paper }}>#2 &nbsp;ALASKA, M9.2</div>
          <Tag x={480} y={680} size={36}>with modern instruments</Tag>
        </div>
      ) : null}
    </QuakeShell>
  );
};

/** l10 · M9.5. Sources #44-49, #52, #53, #62, #63, section F. The Valdivia photo did not clear (assets.md): USGS ShakeMap, plus Hilo, named. */
export const M95: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const [L1, L2, L3, L4, L5] = [1, 2, 3, 4, 5].map((i) => lineAt(t, i));
  const about = within(t, 0, 0.62);
  const slip = within(t, 1, 0.32);
  const tsu = within(t, 1, 0.78);
  const half = within(t, 3, 0.38);
  const add = within(t, 4, 0.2);
  const eq = within(t, 4, 0.66);
  const mapOn = f < tsu;
  const hilo = f >= tsu && f < L2 + 2;
  const ringK = (i: number) => (((f - L2) / 60 + i / 3) % 1);
  const low = Math.round(10 * lin(f, L5 + 10, L5 + 50));
  const cells = 10;
  return (
    <QuakeShell t={t} index={9} prevM={9.2} m={9.5} reading={f >= eq && f < L5 ? "M9.95" : "ABOUT 9.5"} sub={f >= eq && f < L5 ? "110 years, summed" : "2.7 Gt TNT"} subTop={f >= eq && f < L5 ? "EQUIVALENT" : "ABOUT"} credit={hilo ? { kind: "real", source: "U.S. Navy, via NOAA, 1960" } : mapOn ? { kind: "illustration", source: "USGS ShakeMap, a model" } : { kind: "illustration", source: "schematic" }}>
      {/* lines 0-1: modelled map; the rupture drawn beside it */}
      {mapOn ? <Inset id="l06-shakemap" x={1240} y={140} w={560} h={790} pos="50% 25%" a={0} b={tsu} s0={1} s1={1.12} origin="50% 40%" opacity={ease(f, 8, 12)} /> : null}
      {f < L1 ? <Big x={340} y={190} big="22 MAY 1960 · CHILE" small="largest ever recorded by instruments" size={66} opacity={ease(f, 12, 10)} /> : null}
      {f >= about && f < L1 ? <Big x={340} y={420} big="“ABOUT” IS HONEST" small="re-analysis: somewhere around 9.5" size={60} color={B.aqua} opacity={ease(f, about, 10)} /> : null}
      {f >= L1 && f < tsu ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <line x1={1180} x2={1180} y1={260} y2={260 + 560 * lin(f, L1, slip - 6)} stroke={B.tease} strokeWidth={22} strokeLinecap="round" />
          </svg>
          <Big x={340} y={210} big="900+ KM OF FAULT" size={80} color={B.tease} ink={B.paper} opacity={ease(f, L1 + 4, 10)} />
          {f >= slip ? <Big x={340} y={400} big="MORE THAN 30 M" small="the two sides moved, on one stretch" size={80} opacity={ease(f, slip, 10)} /> : null}
        </>
      ) : null}
      {/* tsunami: a damage picture that says plainly it is not Chile. Cropped low: the people higher in the photo stay out of frame */}
      {hilo ? (
        <>
          <Inset id="l06-hilo" x={1000} y={170} w={780} h={560} pos="50% 100%" s0={1} s1={1.08} a={tsu} b={L2} origin="40% 90%" opacity={ease(f, tsu, 10)} />
          <PillTag x={1000} y={748} size={30}>not Chile: Hilo, Hawaii, 1960, hit by this tsunami</PillTag>
          <Big x={340} y={250} big="EVERY OCEAN" small="its tsunami crossed them all" size={66} opacity={ease(f, tsu, 10)} />
        </>
      ) : null}
      {/* line 2: the planet ringing */}
      {f >= L2 && f < L3 + 2 ? (
        <div style={{ position: "absolute", inset: 0, opacity: span(f, L2, L3 + 2) }}>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <ellipse cx={1200} cy={530} rx={280 + 22 * Math.sin((f - L2) / 7)} ry={280 - 22 * Math.sin((f - L2) / 7)} fill="#14507A" stroke={B.aqua} strokeWidth={4} />
          </svg>
          <Big x={340} y={190} big="THE WHOLE PLANET RINGING" small="first observed, on a California strain recorder" size={54} />
        </div>
      ) : null}
      {/* line 3: a year of US electricity, the bar stops at "well over half", no false precision (#63: 54-72 %) */}
      {f >= L3 && f < L4 + 2 ? (
        <div style={{ position: "absolute", inset: 0, opacity: span(f, L3, L4 + 2) }}>
          <Big x={340} y={190} big="ABOUT 2.7 GIGATONS OF TNT" size={84} />
          {f >= half ? (
            <>
              <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
                <rect x={380} y={560} width={1400} height={110} rx={10} fill="rgba(255,255,255,0.14)" />
                <rect x={380} y={560} width={1400 * 0.54 * ease(f, half, 30)} height={110} rx={10} fill={B.gauge} />
                <rect x={380 + 1400 * 0.54} y={560} width={1400 * 0.18 * ease(f, half + 24, 20)} height={110} fill="rgba(255,200,61,0.45)" />
              </svg>
              <Tag x={380} y={490} size={40}>one year of all U.S. electricity</Tag>
              <Tag x={380} y={700} size={40} color={B.gauge} opacity={ease(f, half + 20, 10)}>well over half of it, in one event</Tag>
            </>
          ) : null}
        </div>
      ) : null}
      {/* lines 4-5: all quakes summed: ten cells; a tenth lit, then a fifth (#53) */}
      {f >= L4 ? (
        <div style={{ position: "absolute", inset: 0, opacity: ease(f, L4, 10) }}>
          {f >= add ? <Big x={340} y={170} big={f >= eq ? "ALL OF IT = ONE M9.95" : "EVERY QUAKE · ABOUT 110 YEARS"} size={68} /> : null}
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            {Array.from({ length: cells }, (_, i) => {
              const on = f >= L5 && ((i === 0 && low > 3) || (i === 1 && low > 8));
              return <rect key={i} x={380 + i * 142} y={430} width={128} height={260} rx={8} fill={on ? B.tease : "rgba(255,255,255,0.2)"} opacity={ease(f, L4 + 8 + i * 5, 8)} />;
            })}
          </svg>
          {f >= L5 ? <Caption bottom={210} size={76}>One quake: a tenth to a fifth of it all</Caption> : null}
        </div>
      ) : null}
    </QuakeShell>
  );
};

/** s11 · the limit. Sources #54-58. Earth as a disc whose rim is 40,000 km: fault length becomes angle, so 80,000 km is two laps. */
export const Limit: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const [L1, L2, L3, L4, L5] = [1, 2, 3, 4, 5].map((i) => lineAt(t, i));
  const planet = within(t, 1, 0.62);
  const noFault = within(t, 2, 0.8);
  const sa = within(t, 3, 0.58);
  const circ = within(t, 4, 0.6);
  const CX = 1100;
  const CY = 560;
  const R = 300;
  const disc = ease(f, planet, 16);
  /** arc for a length in km; rr grows with each lap, so a second lap stands outside the first */
  const arc = (km: number, rr: number) => {
    const turns = km / 40000;
    const pts: string[] = [];
    const n = Math.max(2, Math.round(turns * 120));
    for (let i = 0; i <= n; i++) {
      const a = (i / n) * turns * 2 * Math.PI;
      const r = rr + (a / (2 * Math.PI)) * 62;
      pts.push(`${i ? "L" : "M"}${(CX + r * Math.sin(a)).toFixed(1)} ${(CY - r * Math.cos(a)).toFixed(1)}`);
    }
    return pts.join(" ");
  };
  const km10 = 14000 * lin(f, L2 + 6, within(t, 2, 0.4));
  const sAm = 6400 * lin(f, L3 + 4, sa - 8);
  const sAnd = 1400 * lin(f, sa, sa + 30);
  const km105 = 80000 * lin(f, L4 + 16, circ + 10);
  const flash = f >= L5 ? Math.floor(((f - within(t, 5, 0.32)) / Math.max(1, within(t, 5, 0.7) - within(t, 5, 0.32))) * 3) : -1;
  const m = f < L2 ? 9.5 : 10;
  const read = f < L2 ? "M9.5" : f < L3 ? "M10?" : f < sa ? "M9.86" : f < L4 ? "M8.5" : f < L5 ? "M10.5?" : "M10?";
  const gaugeM = f < L2 ? 9.5 : f < L3 ? 10 : f < sa ? 9.86 : f < L4 ? 8.47 : 10;
  return (
    <QuakeShell t={t} index={10} prevM={9.5} m={mix(m, gaugeM, 1)} reading={read} sub={f < L2 ? "the record" : f < L3 ? "no known fault" : f < sa ? "S. America, whole" : f < L4 ? "San Andreas, all" : f < L5 ? "off this column" : "no known fault"} subTop={f < L2 ? "SO FAR" : f >= L3 && f < L4 ? "AT MOST" : "HYPOTHETICAL"} credit={{ kind: "illustration", source: "a drawing · fault lengths to scale on the rim" }}>
      {f < L1 ? <Caption bottom={460} size={110}>How high can it go?</Caption> : null}
      {f >= L1 && f < planet ? <Caption bottom={460} size={84} color={B.paper}>The scale has no upper limit</Caption> : null}
      {disc > 0 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: disc }}>
          <circle cx={CX} cy={CY} r={R} fill="#14507A" stroke={B.aqua} strokeWidth={4} />
          <path d={`M${CX - 180} ${CY - 120} q 80 -80 170 -30 q 60 60 -20 110 q -90 40 -150 -20 z`} fill="#2E6B47" opacity={0.8} />
          <path d={`M${CX + 60} ${CY + 60} q 90 -30 130 40 q 0 70 -80 90 q -70 -30 -50 -130 z`} fill="#2E6B47" opacity={0.8} />
          {f >= L2 && f < L3 ? <path d={arc(km10, R + 18)} stroke={B.tease} strokeWidth={14} fill="none" strokeDasharray="30 12" /> : null}
          {f >= L3 && f < L4 ? <path d={arc(sAm, R + 18)} stroke={B.gauge} strokeWidth={14} fill="none" /> : null}
          {f >= sa && f < L4 ? <path d={arc(sAnd, R + 60)} stroke={B.aqua} strokeWidth={14} fill="none" /> : null}
          {f >= L4 && f < L5 ? <path d={arc(km105, R + 18)} stroke={B.tease} strokeWidth={12} fill="none" strokeDasharray="30 12" /> : null}
          {f >= L5 ? <path d={arc(80000, R + 18)} stroke={B.tease} strokeWidth={12} fill="none" strokeDasharray="30 12" opacity={0.35 + 0.65 * Math.abs(Math.sin((f - L5) / 12))} /> : null}
        </svg>
      ) : null}
      {f >= planet && f < L2 ? <Tag x={CX} y={200} align="center" size={56} color={B.tease}>the limit is the planet</Tag> : null}
      {f >= L2 && f < L3 ? <Big x={340} y={190} big="M10: ABOUT 14,000 KM" small="slipping 30 m on average" size={60} color={B.tease} ink={B.paper} /> : null}
      {f >= noFault && f < L3 ? <PillTag x={340} y={350} size={36} color={B.tease} opacity={ease(f, noFault, 10)}>no known fault can do it</PillTag> : null}
      {f >= L3 && f < L4 ? <PillTag x={340} y={190} size={34} color={B.gauge}>all of South America's subduction zone: about 9.86</PillTag> : null}
      {f >= sa && f < L4 ? <PillTag x={340} y={270} size={34} color={B.aqua} opacity={ease(f, sa, 10)}>all of the San Andreas: about 8½</PillTag> : null}
      {f >= L4 && f < L5 ? <Big x={340} y={190} big="M10.5: ABOUT 80,000 KM" size={60} color={B.tease} ink={B.paper} opacity={ease(f, L4 + 10, 10)} /> : null}
      {f >= circ && f < L5 ? <PillTag x={340} y={320} size={36} opacity={ease(f, circ, 10)}>Earth's circumference: 40,000 km</PillTag> : null}
      {f >= L5 && f < within(t, 5, 0.32) ? <Caption bottom={120} size={76}>It doesn't fit on the planet</Caption> : null}
      {flash >= 0 && f >= within(t, 5, 0.32) && f < within(t, 5, 0.72) ? <div style={{ position: "absolute", left: 340 + Math.min(2, flash) * 60, top: 190 + Math.min(2, flash) * 150, fontFamily: F.headline, fontSize: 96, lineHeight: 1.1, color: heat(5 + Math.min(2, flash) * 2) }}>32 TIMES</div> : null}
      {f >= within(t, 5, 0.72) ? <Caption bottom={100} size={84} color={B.tease}>The number runs out of world</Caption> : null}
    </QuakeShell>
  );
};
