import React from "react";
import { useCurrentFrame } from "remotion";
import { B, F } from "../../../brand/tokens";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { ease } from "../../../lib/ui";
import { Big, Caption, Clip, Inset, Photo, Pill, Tag, VolcanoShell, lin, mix } from "./shell";

const PANEL = { x: 130, y: 200, w: 1280, h: 720 };

/** s7 · VEI 6. Sources #4, #6, #7, #31-33, #35, #36, #38. Gauge stays on Pinatubo throughout: Novarupta's rating is unverified (#37). */
export const Vei6: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const L1 = lineAt(t, 1);
  const L2 = lineAt(t, 2);
  const L3 = lineAt(t, 3);
  const L4 = lineAt(t, 4);
  const L5 = lineAt(t, 5);
  const L6 = lineAt(t, 6);
  const L7 = lineAt(t, 7);
  const rose = within(t, 0, 0.58);
  const so2 = within(t, 2, 0.32);
  const cool = within(t, 2, 0.62);
  const alaska = within(t, 4, 0.36);
  const wrong = within(t, 4, 0.62);
  const moved = within(t, 5, 0.55);
  const hours = within(t, 6, 0.42);
  const high = within(t, 6, 0.68);
  const KX = mix(1150, 1150, 0);
  const vent = mix(1150, 450, ease(f, moved, 30));
  const dip = lin(f, cool, L3 - 10);
  return (
    <VolcanoShell t={t} index={6} prevLit={5} lit={6} sub={f >= L4 ? "Pinatubo's reading" : undefined} credit={f < rose ? { kind: "real", source: "D. Harlow, USGS, 12 June 1991" } : f < L1 ? { kind: "real", source: "USGS CVO, 15 June 1991" } : f < L2 ? { kind: "illustration", source: "over a USGS photo" } : f < so2 ? { kind: "real", source: "W. Scott, USGS, 1992" } : f < L4 ? { kind: "illustration", source: "the dip, drawn from one figure" } : f < L6 ? { kind: "illustration", source: "not a map" } : f < L7 ? { kind: "real", source: "M. Fitz, NPS, 2011" } : { kind: "real", source: "R. McGimsey, 1991" }}>
      {f < rose ? <Photo id="l07-pina-jun12" a={0} b={rose} s0={1} s1={1.14} o0={[50, 25]} brightness={0.95} /> : null}
      {f < rose ? <Pill x={100} y={206} size={32}>12 June 1991: an early column, not the climax</Pill> : null}
      {f >= 12 && f < rose ? <Big x={100} y={270} big="COLOSSAL" small="every few hundred years" opacity={ease(f, 12, 10)} size={104} /> : null}
      {f >= rose && f < L2 ? <Photo id="l07-pina-jun15" a={rose} b={L2} s0={1.02} s1={1.2} o0={[50, 45]} brightness={f >= L1 ? 0.3 : 0.95} /> : null}
      {f >= rose && f < L1 ? <Pill x={100} y={206} size={32}>15 June 1991, from a distance</Pill> : null}
      {f >= rose + 6 && f < L1 ? <Big x={100} y={270} big="35 KM UP" small="Pinatubo, the Philippines" opacity={ease(f, rose + 6, 10)} size={104} /> : null}
      {/* line 1: the drawn typhoon turning the ash outward */}
      {f >= L1 && f < L2 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <g transform={`rotate(${f * 2.2} 800 560)`}>
            {[0, 1, 2, 3].map((i) => (
              <path key={i} d="M 800 560 C 950 480, 1040 540, 1060 660" transform={`rotate(${i * 90} 800 560)`} stroke={B.aqua} strokeWidth={22} fill="none" strokeLinecap="round" opacity={0.9} />
            ))}
          </g>
          <circle cx={800} cy={560} r={30 + 300 * lin(f, L1, L2)} fill="rgba(180,170,160,0.3)" />
        </svg>
      ) : null}
      {f >= L1 + 6 && f < L2 ? <Big x={100} y={210} big="A TYPHOON, BY CHANCE" small="spreading the ash in all directions" opacity={ease(f, L1 + 6, 10)} size={68} /> : null}
      {/* line 2-3: crater, gas, the dip */}
      {f >= L2 && f < so2 ? <div style={{ position: "absolute", inset: 0, background: B.ink }} /> : null}
      {f >= L2 && f < so2 ? <Inset id="l07-pina-caldera" x={260} y={200} w={1020} h={670} a={L2} b={so2} s0={1} s1={1.1} /> : null}
      {f >= L2 && f < so2 ? <Pill x={290} y={225} size={30}>The crater a year later: 2.5 km across</Pill> : null}
      {f >= so2 && f < L4 ? <div style={{ position: "absolute", inset: 0, background: "#0E141C" }} /> : null}
      {f >= so2 && f < cool + 10 ? <Big x={120} y={260} big="NEARLY 20 MILLION TONS" small="of sulfur dioxide" opacity={ease(f, so2, 10)} size={84} /> : null}
      {f >= cool && f < L4 ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <line x1={160} x2={1480} y1={540} y2={540} stroke="rgba(255,255,255,0.35)" strokeWidth={3} strokeDasharray="10 8" />
            <path d={`M 160 540 C ${mix(160, 520, dip)} 540, ${mix(160, 520, dip)} ${mix(540, 800, dip)}, ${mix(160, 820, dip)} ${mix(540, 800, dip)} C ${mix(160, 1120, dip)} ${mix(540, 800, dip)}, ${mix(160, 1120, dip)} 540, ${mix(160, 1480, dip)} 540`} stroke={B.aqua} strokeWidth={12} fill="none" />
          </svg>
          <Tag x={160} y={490} size={30}>1991</Tag>
          <Tag x={1480} y={490} size={30} align="right" opacity={dip}>1993</Tag>
          {dip > 0.5 ? <Big x={620} y={830} big="ABOUT 0.5 °C COOLER" small="the whole planet, for about two years" opacity={ease(f, cool + 30, 10)} size={60} color={B.aqua} /> : null}
          {f >= L3 ? <Big x={120} y={260} big="ONE VOLCANO" small="changed the global temperature" opacity={ease(f, L3, 10)} size={84} /> : null}
        </>
      ) : null}
      {/* line 4-5: the wrong mountain. Two marks, not a map; the vent marker slides across */}
      {f >= L4 && f < L6 ? (
        <>
          <div style={{ position: "absolute", inset: 0, background: "#141A20" }} />
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <rect x={0} y={760} width={1600} height={320} fill="#2C2622" />
            {f >= wrong ? <path d={`M ${KX - 240} 760 L ${KX - 70} ${mix(440, 560, ease(f, L5, 24))} L ${KX + 70} ${mix(440, 560, ease(f, L5, 24))} L ${KX + 240} 760 Z`} fill="#55483E" /> : null}
            {f >= wrong ? <path d="M 400 760 Q 450 700 500 760 Z" fill="#55483E" /> : null}
            {f >= wrong ? <path d={`M ${vent - 30} 400 h 60 l -30 42 Z`} fill={B.tease} /> : null}
            {f >= moved + 30 ? <line x1={500} x2={910} y1={830} y2={830} stroke={B.gauge} strokeWidth={6} /> : null}
          </svg>
          {f < wrong ? <Big x={120} y={260} big={f < alaska ? "NOT THE LARGEST OF THE 1900s" : "ALASKA, 1912"} opacity={ease(f, L4, 10)} size={88} /> : null}
          {f >= wrong ? <Tag x={KX} y={780} size={36} align="center">Mount Katmai</Tag> : null}
          {f >= moved ? <Tag x={450} y={780} size={36} align="center" color={B.tease} opacity={ease(f, moved, 10)}>Novarupta</Tag> : null}
          {f >= wrong ? <Pill x={vent} y={340} size={32} align="center" color={B.tease}>the vent</Pill> : null}
          {f >= wrong && f < L5 ? <Big x={120} y={210} big="ABOUT 40 YEARS BLAMING THE WRONG MOUNTAIN" opacity={ease(f, wrong, 10)} size={58} /> : null}
          {f >= moved + 30 ? <Tag x={705} y={845} size={32} align="center" color={B.gauge}>about 10 km</Tag> : null}
        </>
      ) : null}
      {/* line 6: the real place */}
      {f >= L6 && f < L7 ? <Photo id="l07-novarupta" a={L6} b={L7} s0={1} s1={1.16} o0={[52, 55]} /> : null}
      {f >= L6 && f < L7 ? <Pill x={100} y={206} size={30}>Novarupta's dome, photographed in 2011</Pill> : null}
      {f >= L6 + 4 && f < hours ? <Big x={100} y={270} big="ABOUT 13–15 km³" small="of magma" opacity={ease(f, L6 + 4, 10)} size={92} /> : null}
      {f >= hours && f < high ? <Big x={100} y={270} big="ABOUT 60 HOURS" opacity={ease(f, hours, 10)} size={92} /> : null}
      {f >= high && f < L7 ? <Big x={100} y={270} big="COLUMN 30+ KM" opacity={ease(f, high, 10)} size={92} /> : null}
      {f >= L7 ? <Photo id="l07-vtts" a={L7} b={t.frames} s0={1} s1={1.2} o0={[50, 60]} o1={[35, 60]} /> : null}
      {f >= L7 ? <Pill x={100} y={206} size={30} color={B.gauge}>Photo from 1991, not the steam years</Pill> : null}
      {f >= within(t, 7, 0.55) ? <Big x={100} y={270} big="VALLEY OF TEN THOUSAND SMOKES" opacity={ease(f, within(t, 7, 0.55), 10)} size={68} /> : null}
    </VolcanoShell>
  );
};

/** s8 · VEI 7. Sources #6, #26, #39-41, #43, #44. Nothing filmed; the hole it left, labelled from its first frame. */
export const Vei7: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const L1 = lineAt(t, 1);
  const L2 = lineAt(t, 2);
  const L3 = lineAt(t, 3);
  const L4 = lineAt(t, 4);
  const L5 = lineAt(t, 5);
  const L6 = lineAt(t, 6);
  const tamb = within(t, 0, 0.27);
  const vol = within(t, 0, 0.7);
  const hole = within(t, 1, 0.3);
  const fades = within(t, 4, 0.25);
  const mazama = within(t, 5, 0.42);
  const lake = within(t, 6, 0.42);
  const blocks = Math.floor(150 * lin(f, L1 + 4, hole));
  const fill = lin(f, lake, t.frames - 40);
  const peak = 1 - ease(f, L2 + 30, 40);
  const fall = lin(f, L4, fades);
  return (
    <VolcanoShell t={t} index={7} prevLit={6} lit={7} sub={f >= mazama && f < L6 + 1 ? "Tambora's reading" : f >= L6 ? "Tambora's reading" : undefined} credit={f < tamb ? { kind: "illustration", source: "no picture exists" } : f < L2 ? { kind: "real", source: "NASA JSC, ISS020-E-6563, 2009" } : f < L3 ? { kind: "illustration", source: "a drawn peak" } : f < L4 ? { kind: "real", source: "Tisquesusa, CC BY 4.0, 2017" } : f < L5 ? { kind: "illustration", source: "ash and sea, drawn" } : f < L6 ? { kind: "real", source: "M. Doukas, USGS" } : f < lake + 200 ? { kind: "illustration", source: "the caldera, drawn" } : { kind: "real", source: "M. Doukas, USGS" }}>
      {f < tamb ? <div style={{ position: "absolute", inset: 0, background: "#07090D" }} /> : null}
      {f < tamb ? <div style={{ position: "absolute", left: 120, top: 400, fontFamily: F.headline, fontSize: 130, color: B.paper, opacity: ease(f, 8, 12), whiteSpace: "nowrap" }}>NO PHOTOGRAPHS</div> : null}
      {f >= tamb && f < L2 ? <Photo id="l07-tam-iss" a={tamb} b={L2} s0={1.0} s1={1.3} o0={[49, 55]} brightness={1} /> : null}
      {f >= tamb && f < L2 ? <Pill x={100} y={206} size={32} color={B.gauge}>Tambora, Indonesia. Photographed in 2009, long afterward</Pill> : null}
      {f >= vol && f < L1 ? <Big x={100} y={270} big="150+ km³" small="history's largest explosive eruption" opacity={ease(f, vol, 10)} size={100} /> : null}
      {f >= L1 && f < hole ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <rect x={90} y={270} width={700} height={500} rx={12} fill="rgba(5,14,24,0.88)" />
            {Array.from({ length: Math.min(150, blocks) }, (_, i) => <rect key={i} x={110 + (i % 15) * 44} y={290 + Math.floor(i / 15) * 46} width={38} height={38} fill={B.gauge} />)}
          </svg>
          <Tag x={100} y={785} size={32} color={B.gauge}>{blocks >= 149 ? "150+ St. Helens, 1980" : `${blocks} St. Helens, 1980`}</Tag>
        </>
      ) : null}
      {f >= hole && f < L2 ? <Big x={100} y={270} big="6 KM WIDE" small="more than 1 km deep" opacity={ease(f, hole, 10)} size={96} /> : null}
      {/* line 2: the peak falls away */}
      {f >= L2 && f < L3 ? (
        <>
          <div style={{ position: "absolute", inset: 0, background: "#10151C" }} />
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <path d={`M 140 880 L ${780 - 170 * (1 - peak)} ${mix(620, 300, peak)} L ${780 + 170 * (1 - peak)} ${mix(620, 300, peak)} L 1420 880 Z`} fill="#4A3D35" />
            {peak > 0 ? <path d="M 780 300 l -14 -12 h 28 z" fill={B.gauge} opacity={peak} /> : null}
          </svg>
          <Big x={120} y={210} big="AROUND 4,000 M BEFORE" small="an estimate" opacity={ease(f, L2 + 4, 10)} size={72} />
        </>
      ) : null}
      {/* line 3: the rim, panning */}
      {f >= L3 && f < L4 ? <Photo id="l07-tam-pano" a={L3} b={L4} s0={1} s1={1} pos={`${mix(5, 95, lin(f, L3, L4))}% 50%`} brightness={0.92} /> : null}
      {f >= L3 && f < L4 ? <Pill x={100} y={206} size={30} color={B.gauge}>The caldera in 2017</Pill> : null}
      {f >= L3 + 6 && f < L4 ? <Big x={100} y={270} big="1816: THE YEAR WITHOUT A SUMMER" opacity={ease(f, L3 + 6, 10)} size={68} /> : null}
      {/* line 4: ash into the sea */}
      {f >= L4 && f < L5 ? (
        <>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#17202B 0%, #17202B 52%, #0F3E5C 52%, #082538 100%)" }} />
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            {Array.from({ length: 80 }, (_, i) => {
              const x = 90 + ((i * 73) % 1450);
              const y = 200 + ((i * 41 + f * 3) % 760);
              return <circle key={i} cx={x} cy={y} r={5} fill="#B5AEA6" opacity={y > 560 ? Math.max(0, 1 - (y - 560) / 400) : 1} />;
            })}
          </svg>
          <Big x={100} y={220} big="MOST OF IT FELL IN THE SEA" opacity={ease(f, L4 + 4, 10) * (fall > 0 ? 1 : 0)} size={72} />
          {f >= fades ? <Big x={100} y={880} big="ALMOST NO TRACE IN THE ROCK" opacity={ease(f, fades, 10)} size={58} color={B.tease} ink={B.paper} /> : null}
        </>
      ) : null}
      {/* line 5-6: Crater Lake. Fills as the words say so */}
      {f >= L5 && f < L6 ? <Photo id="l07-crater" a={L5} b={L6} s0={1} s1={1.18} o0={[50, 52]} /> : null}
      {f >= L5 + 4 && f < mazama ? <Big x={100} y={220} big="EVERY FEW THOUSAND YEARS" small="roughly" opacity={ease(f, L5 + 4, 10)} size={74} /> : null}
      {f >= mazama && f < L6 ? <Big x={100} y={220} big="MOUNT MAZAMA" small="about 7,700 years ago, about 50 km³ of magma" opacity={ease(f, mazama, 10)} size={84} /> : null}
      {f >= L6 && f < t.frames - 40 ? (
        <>
          <div style={{ position: "absolute", inset: 0, background: "#10151C" }} />
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <path d="M 100 500 L 400 460 L 500 860 L 1100 860 L 1200 460 L 1500 500 L 1500 1000 L 100 1000 Z" fill="#4A3D35" />
            <clipPath id="l07hole"><path d="M 400 460 L 500 860 L 1100 860 L 1200 460 Z" /></clipPath>
            <rect x={380} y={860 - 340 * fill} width={840} height={340 * fill} fill="#1E6FA8" clipPath="url(#l07hole)" />
            <line x1={1260} x2={1260} y1={460} y2={860} stroke={B.gauge} strokeWidth={6} />
          </svg>
          <Tag x={1280} y={640} size={34} color={B.gauge}>1,200 m</Tag>
          {f >= lake ? <Big x={100} y={210} big={`${Math.round(300 * fill)} YEARS OF WATER`} size={64} color={B.aqua} /> : null}
        </>
      ) : null}
      {f >= t.frames - 40 ? <Photo id="l07-crater" a={t.frames - 40} b={t.frames} s0={1.1} s1={1.0} /> : null}
      {f >= t.frames - 40 ? <Big x={100} y={220} big="CRATER LAKE" opacity={ease(f, t.frames - 40, 8)} size={92} /> : null}
    </VolcanoShell>
  );
};

/** s9 · VEI 8. Sources #4, #6, #7, #11, #45-47, #49, #50. Rock the ash left; blocks true to area against St. Helens. */
export const Vei8: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const L1 = lineAt(t, 1);
  const L2 = lineAt(t, 2);
  const L3 = lineAt(t, 3);
  const L4 = lineAt(t, 4);
  const L5 = lineAt(t, 5);
  const L6 = lineAt(t, 6);
  const more = within(t, 0, 0.28);
  const nobody = within(t, 0, 0.55);
  const twoPoint = within(t, 1, 0.56);
  const pools = within(t, 2, 0.0);
  const canyon = within(t, 2, 0.36);
  const others = within(t, 2, 0.74);
  const toba = within(t, 4, 0.38);
  const u = 10;
  const side = (km3: number) => u * Math.sqrt(km3);
  const target = f < twoPoint ? 1000 : f < others ? 2500 : 5000;
  const prev = f < twoPoint ? 1 : f < others ? 1000 : 2500;
  const cue = f < twoPoint ? L1 : f < others ? twoPoint : others;
  const s = mix(side(prev), side(target), ease(f, cue, 24));
  const inBlocks = f >= L1 && f < L3;
  const reading = f >= twoPoint && f < others ? "2,450 km³" : undefined;
  return (
    <VolcanoShell t={t} index={8} prevLit={7} lit={8} reading={reading} sub={reading ? "2.1 million years ago" : undefined} credit={f < L1 ? { kind: "real", source: "J. Peaco, NPS, 2015" } : f < L3 ? { kind: "illustration", source: "areas to scale, by ash" } : f < toba ? { kind: "real", source: "J. Peaco, NPS" } : f < L5 ? { kind: "illustration", source: "ASTER satellite, false colour" } : f < L6 ? { kind: "real", source: "J. Peaco, NPS" } : { kind: "real", source: "USGS / J. Schmith, 2022" }}>
      {f < L1 ? <Photo id="l07-tuff" a={0} b={L1} s0={1} s1={1.24} o0={[40, 35]} brightness={0.9} /> : null}
      {f < L1 ? <Pill x={100} y={206} size={32}>Lava Creek Tuff, Yellowstone: rock that one left behind</Pill> : null}
      {f >= 8 && f < more ? <Big x={100} y={270} big="MEGA-COLOSSAL" opacity={ease(f, 8, 10)} size={110} /> : null}
      {f >= more && f < nobody ? <Big x={100} y={270} big="1,000+ km³" small="of ash" opacity={ease(f, more, 10)} size={110} /> : null}
      {f >= nobody && f < L1 ? <Big x={100} y={270} big="NOBODY HAS SEEN ONE" opacity={ease(f, nobody, 10)} size={96} color={B.tease} ink={B.paper} /> : null}
      {inBlocks ? <div style={{ position: "absolute", inset: 0, background: "#10151C" }} /> : null}
      {inBlocks ? (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <rect x={120} y={940 - u} width={u} height={u} fill={B.paper} />
          <rect x={200} y={940 - s} width={s} height={s} fill="#C8201A" opacity={0.92} />
        </svg>
      ) : null}
      {inBlocks ? <Tag x={110} y={948} size={26}>St. Helens 1980</Tag> : null}
      {f >= L1 && f < twoPoint ? <Big x={560} y={230} big="631,000 YEARS AGO" small="about 1,000 times St. Helens, by ash" opacity={ease(f, L1 + 4, 10)} size={66} /> : null}
      {f >= twoPoint && f < L2 ? <Big x={760} y={230} big="2.1 MILLION YEARS AGO" small="about 2,500 times" opacity={ease(f, twoPoint, 10)} size={60} /> : null}
      {f >= pools && f < canyon ? <Big x={1040} y={230} big="1,000 km³ IS" small="400 million Olympic pools" opacity={ease(f, pools, 10)} size={56} color={B.aqua} /> : null}
      {f >= canyon && f < others ? <Big x={1040} y={230} big="1,000 km³ IS" small="a quarter of the Grand Canyon" opacity={ease(f, canyon, 10)} size={56} color={B.aqua} /> : null}
      {f >= others && f < L3 ? <Big x={980} y={230} big="OTHERS: ABOUT 5,000" opacity={ease(f, others, 10)} size={56} color={B.paper} /> : null}
      {f >= L3 && f < toba ? <Photo id="l07-tuff-cliff" a={L3} b={toba} s0={1} s1={1.18} o0={[60, 50]} brightness={0.6} /> : null}
      {f >= L3 && f < L4 ? <Caption size={90} bottom={320} color={B.paper}>No single largest</Caption> : null}
      {f >= L4 && f < toba ? <Big x={100} y={230} big="EVERY FEW TENS OF THOUSANDS OF YEARS" small="roughly" opacity={ease(f, L4, 10)} size={60} /> : null}
      {f >= toba && f < L5 ? <Photo id="l07-toba" a={toba} b={L5} s0={1} s1={1.3} o0={[45, 45]} pos="50% 45%" brightness={0.9} /> : null}
      {f >= toba && f < L5 ? <Pill x={100} y={206} size={30} color={B.gauge}>Toba's caldera, false-colour satellite image</Pill> : null}
      {f >= toba + 6 && f < L5 ? <Big x={100} y={270} big="HUMANITY “DID NOT SUFFER GREATLY”" small="what archaeology suggests, says the USGS" opacity={ease(f, toba + 6, 10)} size={62} /> : null}
      {f >= L5 && f < L6 ? <Photo id="l07-tuff" a={L5} b={L6} s0={1.24} s1={1.04} o0={[60, 45]} brightness={0.42} /> : null}
      {f >= L5 + 4 && f < L6 ? (
        <div style={{ position: "absolute", left: 120, top: 280, width: 1360, padding: "26px 34px", borderRadius: 16, background: "rgba(5,14,24,0.9)", fontFamily: F.ui, fontWeight: 800, fontSize: 56, lineHeight: 1.2, color: B.paper, opacity: ease(f, L5 + 4, 10) }}>
          Yellowstone “shows no signs” of heading that way. The chance in the next few thousand years: <span style={{ color: B.gauge }}>“exceedingly low”</span>.
          <div style={{ fontSize: 30, color: B.mute, marginTop: 14 }}>U.S. Geological Survey</div>
        </div>
      ) : null}
      {f >= L6 ? <Clip id="l07-clip-wide" seconds={21} box={PANEL} /> : null}
      {f >= L6 ? <Pill x={160} y={224} size={30} color={B.gauge}>Mauna Loa, not Yellowstone: lava like this scores near zero</Pill> : null}
      {f >= L6 + 16 ? <Big x={160} y={290} big="MOST LIKELY NEXT: LAVA" small="at Yellowstone, says the USGS" opacity={ease(f, L6 + 16, 10)} size={66} /> : null}
    </VolcanoShell>
  );
};

/** s10 · The closer. Sources #2, #9, #10, #26, #31, #48, #51. The scale's own doubts, then back to the opening fountains. */
export const Closer: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const L1 = lineAt(t, 1);
  const L2 = lineAt(t, 2);
  const L3 = lineAt(t, 3);
  const L4 = lineAt(t, 4);
  const tonga = within(t, 0, 0.2);
  const lower = within(t, 0, 0.78);
  const nine = within(t, 3, 0.2);
  const sevens = within(t, 3, 0.6);
  const lets = within(t, 4, 0.3);
  const zero = within(t, 4, 0.62);
  const k = 12.5; // px per km, true to the two heights
  const hT = 58 * k * ease(f, tonga + 10, 30);
  const hP = 35 * k * ease(f, tonga + 30, 30);
  const yrs = lin(f, L1 + 10, L2 - 10);
  const litNow = f < zero ? 8 : mix(8, 0, ease(f, zero, 40));
  return (
    <VolcanoShell t={t} index={9} lit={litNow} reading={f < zero ? "?" : "SCORE: 0"} sub={f < zero ? "still a judgement" : "Mauna Loa, 2022"} open={f >= L3 && f < zero ? ease(f, L3, 14) : 0} credit={f < L1 ? { kind: f < tonga ? "illustration" : "real", source: f < tonga ? "the scale" : "NASA / K. Barron, 2022" } : f < L3 ? { kind: "illustration", source: "to scale" } : f < L4 ? { kind: "illustration", source: "the top of the scale" } : { kind: "real", source: "USGS / L. Gallant, 2022" }}>
      {f < tonga ? <div style={{ position: "absolute", inset: 0, background: "#10151C" }} /> : null}
      {f < tonga ? <Caption size={108} bottom={420} color={B.paper}>A judgement</Caption> : null}
      {f >= tonga && f < L1 ? <Photo id="l07-tonga-iss" a={tonga} b={L1} s0={1} s1={1.12} o0={[50, 60]} brightness={0.75} /> : null}
      {f >= tonga && f < L1 ? <Pill x={100} y={206} size={30}>Hunga Tonga's plume, from the space station</Pill> : null}
      {f >= tonga && f < L1 ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <rect x={900} y={960 - hT} width={110} height={hT} fill={B.tease} />
            <rect x={1120} y={960 - hP} width={110} height={hP} fill={B.gauge} />
          </svg>
          <Tag x={955} y={966} size={30} align="center" color={B.tease}>58 km</Tag>
          <Tag x={1175} y={966} size={30} align="center" color={B.gauge}>35 km</Tag>
          {f >= lower ? <Big x={100} y={270} big="TONGA: LEVEL 5, FOR NOW" small="Pinatubo: level 6, and shorter" opacity={ease(f, lower, 10)} size={68} /> : null}
        </>
      ) : null}
      {/* line 1: Parícutin, nine years drip by; line 2: Kīlauea's lava */}
      {f >= L1 && f < L3 ? <div style={{ position: "absolute", inset: 0, background: "#10151C" }} /> : null}
      {f >= L1 && f < L2 ? (
        <>
          <div style={{ position: "absolute", left: 120, top: 520, display: "flex", gap: 14 }}>
            {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ width: 138, height: 200, borderRadius: 10, background: i < yrs * 9 ? B.gauge : "rgba(255,255,255,0.1)", fontFamily: F.headline, fontSize: 46, lineHeight: "200px", textAlign: "center", color: B.ink }}>{i < yrs * 9 ? `Y${i + 1}` : ""}</div>)}
          </div>
          <Big x={120} y={230} big="PARÍCUTIN: 1.3 km³, A FOUR" small="enough for a five, but slowly, over nine years" opacity={ease(f, L1 + 4, 10)} size={72} />
        </>
      ) : null}
      {f >= L2 && f < L3 ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <rect x={120} y={620} width={60} height={60} fill={B.paper} />
            <rect x={260} y={680 - 190 * ease(f, L2 + 10, 40) * 1.0} width={1200 * ease(f, L2 + 10, 40)} height={190 * ease(f, L2 + 10, 40)} fill="#FF7A3D" />
          </svg>
          <Tag x={110} y={695} size={26}>St. Helens</Tag>
          <Tag x={260} y={695} size={30} color="#FF7A3D">Kīlauea's vent: more than 10 times, as lava</Tag>
          <Big x={120} y={230} big="STILL RATED LOW, AT THE TIME" opacity={ease(f, within(t, 2, 0.6), 10)} size={72} />
        </>
      ) : null}
      {/* line 3: the open top */}
      {f >= L3 && f < L4 ? <Photo id="l07-tuff-cliff" a={L3} b={L4} s0={1} s1={1.14} o0={[60, 50]} brightness={0.3} /> : null}
      {f >= L3 && f < nine ? <Caption size={96} bottom={420} color={B.paper}>Even the top is unsettled</Caption> : null}
      {f >= nine && f < sevens ? <Big x={120} y={320} big="TOBA: POSSIBLY A 9" opacity={ease(f, nine, 10)} size={104} color={B.tease} ink={B.paper} /> : null}
      {f >= sevens && f < L4 ? <Big x={120} y={320} big="SOME 8s: SEVERAL 7s IN A ROW?" opacity={ease(f, sevens, 10)} size={78} /> : null}
      {/* line 4: back where it started */}
      {f >= L4 ? <Clip id="l07-clip-fountains" seconds={16} brightness={f < zero ? 0.6 : 0.95} /> : null}
      {f >= L4 && f < lets ? <Big x={100} y={250} big="NOT HOW BIG" opacity={ease(f, L4, 10)} size={110} /> : null}
      {f >= lets && f < zero ? <Caption size={92} bottom={300} color={B.gauge}>How suddenly the ground lets go</Caption> : null}
      {f >= zero ? <Caption size={118} bottom={260} color={B.paper}>And this scored a zero</Caption> : null}
    </VolcanoShell>
  );
};
