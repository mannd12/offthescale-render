import React from "react";
import { useCurrentFrame } from "remotion";
import { B, F } from "../../../brand/tokens";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { ease } from "../../../lib/ui";
import { heat } from "../gauge";
import { Big, Caption, Clip, Credit, Photo, Pill, Tag, VolcanoShell, lin, mix, span } from "./shell";

const FILM = "USGS / D. Swanson, 1980, 16 mm";

/** cold · lines 0-3. Sources #3, #8, #11-15. Fountains, a score of zero, lava struck off, tenfold squares, the top. */
export const ColdOpen: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const L1 = lineAt(t, 1);
  const L2 = lineAt(t, 2);
  const L3 = lineAt(t, 3);
  const fountains = within(t, 0, 0.36);
  const vol = within(t, 0, 0.62);
  const measures = within(t, 2, 0.22);
  const tenfold = within(t, 2, 0.62);
  const seen = within(t, 3, 0.45);
  // squares: each side 3.16 times the last, so each area is ten times the last
  const sides = [10, 32, 100, 316];
  const shown = f < tenfold ? 0 : Math.min(4, 1 + Math.floor(lin(f, tenfold, L3 - 15) * 4));
  // the staircase is empty until the words "scores a zero", runs the whole way on "zero to eight", settles for the climb
  const lit = f < L1 + 10 ? -1 : f < tenfold ? 0 : f < L3 ? mix(0, 8, lin(f, tenfold, L3 - 10)) : f < seen ? 8 : 8;
  const credit: Credit = f < L1 ? { kind: "real", source: "USGS / L. Gallant, 2022" } : f < L2 ? { kind: "real", source: "Civil Air Patrol via USGS, 2022" } : f < measures ? { kind: "real", source: "USGS / L. Gallant, 2022" } : f < L3 ? { kind: "illustration", source: "areas to scale" } : { kind: "real", source: FILM };
  return (
    <VolcanoShell t={t} index={0} cold lit={lit} reading={f < L1 + 10 ? "SCORE: ?" : f < tenfold ? "SCORE: 0" : f < L3 ? "0 TO 8" : "0 TO 8"} sub={f < L1 + 10 ? "the official scale" : f < tenfold ? "the official scale" : "each step about ten times"} credit={credit}>
      {f < L1 ? <Clip id="l07-clip-fountains" seconds={16} /> : null}
      {f >= L1 && f < L2 ? <Photo id="l07-ml-aerial" a={L1} b={L2} s0={1} s1={1.14} o0={[40, 55]} brightness={0.95} /> : null}
      {f >= L2 && f < L3 ? <Clip id="l07-clip-fountains" seconds={16} brightness={mix(0.92, 0.18, ease(f, measures, 20))} /> : null}
      {f >= 20 && f < L1 ? <Pill x={100} y={196} size={34}>Mauna Loa, Hawaii, 2022</Pill> : null}
      {f >= fountains && f < vol ? <Big x={100} y={270} big="20 M FOUNTAINS" opacity={ease(f, fountains, 10)} size={72} /> : null}
      {f >= vol && f < L1 ? <Big x={100} y={270} big="ABOUT 145 MILLION m³" small="of lava and ash, in about two weeks" opacity={ease(f, vol, 10)} size={76} /> : null}
      {f >= L1 + 6 && f < L2 ? <Caption size={120} bottom={200} color={B.paper}>Score: 0</Caption> : null}
      {/* line 2: lava struck off; what counts arrives */}
      {f >= L2 && f < tenfold ? (
        <div style={{ position: "absolute", left: 120, top: 300, opacity: span(f, L2, tenfold + 4) }}>
          <div style={{ position: "relative", display: "inline-block", fontFamily: F.headline, fontSize: 130, color: B.paper }}>
            LAVA
            <div style={{ position: "absolute", left: -10, top: 86, height: 14, width: `${ease(f, L2 + 8, 14) * 106}%`, background: B.tease, borderRadius: 7 }} />
          </div>
          {f >= measures ? <div style={{ fontFamily: F.headline, fontSize: 96, color: B.gauge, opacity: ease(f, measures, 10), whiteSpace: "nowrap" }}>ROCK AND ASH IN THE AIR</div> : null}
        </div>
      ) : null}
      {f >= tenfold && f < L3 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {sides.slice(0, shown).map((s, i) => {
            const x = 120 + sides.slice(0, i).reduce((a, b) => a + b + 60, 0);
            return <rect key={s} x={x} y={820 - s} width={s} height={s} fill={heat(i * 2 + 1)} stroke={B.ink} strokeWidth={2} />;
          })}
        </svg>
      ) : null}
      {f >= tenfold && f < L3 ? <Big x={120} y={210} big="EACH STEP: ABOUT 10 TIMES" opacity={ease(f, tenfold, 10)} size={64} /> : null}
      {/* line 3: real eruptions, then the top */}
      {f >= L3 ? <Clip id="l07-clip-column" seconds={16} scale={1.24} /> : null}
      {f >= L3 && f < seen ? <Pill x={100} y={196} size={32}>St. Helens 1980, one of the real eruptions ahead</Pill> : null}
      {f >= seen ? <Big x={100} y={250} big="THE TOP: NEVER SEEN" small="this film is level 5, not the top" opacity={ease(f, seen, 10)} size={84} color={B.tease} ink={B.paper} /> : null}
    </VolcanoShell>
  );
};

/** s1 · VEI 0. Sources #1, #2, #5, #14, #15. Lava river; a 38-year gap; no instrument, a judgement. */
export const Vei0: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const L1 = lineAt(t, 1);
  const L2 = lineAt(t, 2);
  const L3 = lineAt(t, 3);
  const lavaAt = within(t, 0, 0.56);
  const crawl = within(t, 0, 0.74);
  const enormous = within(t, 1, 0.56);
  const noInst = within(t, 2, 0.42);
  const built = within(t, 2, 0.7);
  const judge = within(t, 2, 0.9);
  const gap = lin(f, L1 + 5, enormous - 8);
  return (
    <VolcanoShell t={t} index={0} prevLit={0} lit={0} credit={f < L1 ? { kind: "real", source: f < lavaAt ? "Civil Air Patrol via USGS, 2022" : "USGS overflight, 30 Nov 2022" } : f < L2 ? { kind: "illustration", source: "bar over a USGS clip, J. Schmith, Dec 2022" } : { kind: "illustration", source: "over a dimmed USGS clip" }}>
      {f < lavaAt ? <Photo id="l07-ml-aerial" a={0} b={lavaAt} s0={1.02} s1={1.22} o0={[45, 55]} o1={[70, 50]} brightness={0.95} /> : null}
      {f < lavaAt ? <Big x={100} y={230} big="NON-EXPLOSIVE" small="under 10,000 m³ of ash and rock" opacity={ease(f, 10, 10)} size={96} /> : null}
      {f >= lavaAt && f < L1 ? <Clip id="l07-clip-flow" seconds={24} box={{ x: 130, y: 210, w: 1280, h: 720 }} scale={1.42} /> : null}
      {f >= crawl && f < L1 ? <Big x={150} y={230} big="ABOUT 130 METRES AN HOUR" opacity={ease(f, crawl, 10)} size={58} /> : null}
      {/* line 1: the gap draws on, 1984 to 2022 */}
      {f >= L1 && f < L2 ? <Clip id="l07-clip-wide" seconds={21} box={{ x: 130, y: 200, w: 1280, h: 720 }} /> : null}
      {f >= L1 && f < L2 ? (
        <div style={{ position: "absolute", left: 170, top: 810, width: 1200, opacity: 1 }}>
          <div style={{ height: 16, background: "rgba(5,14,24,0.85)", borderRadius: 8 }}>
            <div style={{ height: 16, width: `${gap * 100}%`, background: B.gauge, borderRadius: 8 }} />
          </div>
          <Pill x={0} y={-58} size={30}>1984</Pill>
          {gap > 0.97 ? <Pill x={1200} y={-58} size={30} align="right">2022</Pill> : null}
          <Pill x={600} y={-58} size={34} align="center" color={B.gauge} opacity={ease(f, within(t, 1, 0.26), 10)}>38 years, the longest on record</Pill>
        </div>
      ) : null}
      {f >= enormous && f < L2 ? <Big x={170} y={230} big="ENORMOUS. STILL A ZERO." opacity={ease(f, enormous, 10)} size={72} /> : null}
      {/* lines 2-3: who made it, and that nothing measures it directly */}
      {f >= L2 ? <Clip id="l07-clip-fountains" seconds={16} brightness={0.16} /> : null}
      {f >= L2 + 4 ? <div style={{ position: "absolute", left: 120, top: 210, fontFamily: F.headline, fontSize: 92, color: B.paper, whiteSpace: "nowrap", opacity: ease(f, L2 + 4, 10) }}>1982 · NEWHALL AND SELF</div> : null}
      {f >= noInst ? (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: ease(f, noInst, 10) }}>
          {/* a dial with a line through it */}
          <circle cx={300} cy={540} r={110} fill="none" stroke={B.paper} strokeWidth={10} />
          <line x1={300} y1={540} x2={300 + Math.cos(f / 6) * 80} y2={540 + Math.sin(f / 6) * 80} stroke={B.paper} strokeWidth={8} />
          <line x1={190} y1={650} x2={410} y2={430} stroke={B.tease} strokeWidth={18} strokeLinecap="round" />
        </svg>
      ) : null}
      {f >= noInst ? <div style={{ position: "absolute", left: 470, top: 470, fontFamily: F.headline, fontSize: 118, color: B.tease, whiteSpace: "nowrap", opacity: ease(f, noInst, 10) }}>NO INSTRUMENT</div> : null}
      {f >= built ? <Tag x={120} y={720} size={46} opacity={ease(f, built, 10)}>measurements + observations</Tag> : null}
      {f >= judge ? <Big x={120} y={790} big="THEN A JUDGEMENT" opacity={ease(f, judge, 10)} size={Math.round(mix(84, 112, ease(f, L3, 20)))} /> : null}
    </VolcanoShell>
  );
};

/** s2 · VEI 1. Sources #5, #6, #7, #16-18. 1,400 years drawn to scale under the bursts. */
export const Vei1: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const L1 = lineAt(t, 1);
  const L2 = lineAt(t, 2);
  const textbook = within(t, 0, 0.26);
  const years = within(t, 0, 0.6);
  const since = within(t, 1, 0.16);
  const light = within(t, 1, 0.46);
  const style = within(t, 1, 0.78);
  const X0 = 120;
  const W = 1380;
  const k = lin(f, years, L1 - 10); // the 1,400-year bar draws on
  const pops = 46;
  return (
    <VolcanoShell t={t} index={1} prevLit={0} lit={1} credit={f < years ? { kind: "real", source: "kuhnmi, CC BY 2.0, 2015" } : f < L1 ? { kind: "illustration", source: "bar over a photo by kuhnmi, CC BY 2.0, 2015" } : f < L2 ? { kind: "illustration", source: "bar over a photo by de:User:Man77, CC BY 3.0, 2011" } : { kind: "illustration", source: "over a photo by kuhnmi, CC BY 2.0, 2015" }}>
      {f < L1 ? <Photo id="l07-strom-kuhnmi" a={0} b={L1} s0={1.0} s1={1.2} o0={[60, 62]} pos="50% 60%" brightness={1} /> : null}
      {f >= L1 && f < L2 ? <Photo id="l07-strom-day" a={L1} b={L2} s0={1.0} s1={1.15} o0={[52, 25]} pos="50% 30%" /> : null}
      {f >= L2 ? <Photo id="l07-strom-kuhnmi" a={L2} b={t.frames} s0={1.15} s1={1.0} o0={[60, 62]} pos="50% 60%" brightness={0.55} /> : null}
      {f < textbook ? <Big x={100} y={230} big="GENTLE" small="the official word" opacity={ease(f, 8, 10)} size={110} /> : null}
      {f >= textbook && f < L2 ? <Pill x={100} y={206} size={34} opacity={1}>Stromboli, an island off Italy</Pill> : null}
      {/* the bar: at least 1,400 years, a tick for each small burst, never past today */}
      {f >= years && f < L2 ? (
        <div style={{ position: "absolute", inset: 0 }}>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <rect x={X0 - 20} y={780} width={W + 40} height={110} rx={14} fill="rgba(5,14,24,0.82)" />
            <rect x={X0} y={830} width={W * (f < L1 ? k : 1)} height={8} fill={B.gauge} />
            {Array.from({ length: pops }, (_, i) => {
              const x = X0 + (W * i) / (pops - 1);
              if (x > X0 + W * (f < L1 ? k : 1)) return null;
              const up = 14 + 12 * Math.abs(Math.sin(f / 5 + i * 1.7));
              return <line key={i} x1={x} x2={x} y1={830} y2={830 - up} stroke={B.tease} strokeWidth={4} />;
            })}
            {f >= since ? <rect x={X0 + W * (1 - 94 / 1400)} y={818} width={W * (94 / 1400)} height={32} fill={B.tease} opacity={ease(f, since, 10)} /> : null}
          </svg>
          <Tag x={X0} y={846} size={28} color={B.gauge}>at least 1,400 years, almost continuous</Tag>
          {f >= since ? <Pill x={X0 + W} y={720} size={32} align="right" color={B.tease} opacity={ease(f, since, 10)}>unbroken since 1932</Pill> : null}
        </div>
      ) : null}
      {f >= light && f < style ? <Big x={100} y={280} big="LIGHTHOUSE OF THE MEDITERRANEAN" opacity={ease(f, light, 10)} size={64} /> : null}
      {f >= style && f < L2 ? <Big x={100} y={280} big="“STROMBOLIAN”" small="a whole style of eruption" opacity={ease(f, style, 10)} size={84} /> : null}
      {/* line 2: how often; a day strip fills */}
      {f >= L2 ? <Big x={100} y={230} big="LEVELS 0 AND 1" small="roughly every day, somewhere on Earth" opacity={ease(f, L2, 10)} size={90} /> : null}
      {f >= L2 + 10
        ? Array.from({ length: 7 }, (_, i) => (
            <div key={i} style={{ position: "absolute", left: 110 + i * 190, top: 620, width: 170, height: 110, borderRadius: 12, background: i < lin(f, L2 + 10, t.frames - 12) * 7 ? B.gauge : "rgba(5,14,24,0.8)", color: B.ink, fontFamily: F.headline, fontSize: 46, textAlign: "center", lineHeight: "110px" }}>{i < lin(f, L2 + 10, t.frames - 12) * 7 ? "DAY" : ""}</div>
          ))
        : null}
    </VolcanoShell>
  );
};

/** s3 · VEI 2. Sources #6, #7, #19, #20. The dome time-lapse; squeezed out, not thrown. */
export const Vei2: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const L1 = lineAt(t, 1);
  const L2 = lineAt(t, 2);
  const L3 = lineAt(t, 3);
  const helens = within(t, 0, 0.62);
  const vol = within(t, 1, 0.5);
  const count = Math.round(93 * lin(f, L1 + 10, vol));
  const squeeze = lin(f, L2 + 8, L3 - 6);
  return (
    <VolcanoShell t={t} index={2} prevLit={1} lit={2} credit={f < L1 ? { kind: "real", source: "E. Endo, USGS, Nov 2004" } : f < L2 ? { kind: "real", source: "USGS time-lapse, sped up" } : f < L3 ? { kind: "illustration", source: "not to scale" } : { kind: "real", source: "USGS time-lapse, sped up" }}>
      {f < L1 ? <Photo id="l07-msh-night" a={0} b={L1} s0={1} s1={1.32} o0={[60, 40]} o1={[62, 40]} brightness={1} /> : null}
      {f < helens ? <Big x={100} y={230} big="EXPLOSIVE" small="roughly every week" opacity={ease(f, 8, 10)} size={110} /> : null}
      {f >= helens && f < L1 ? <Big x={100} y={230} big="MOUNT ST. HELENS" small="2004 to 2008, glowing new dome at night" opacity={ease(f, helens, 10)} size={84} /> : null}
      {(f >= L1 && f < L2) || f >= L3 ? <Clip id="l07-clip-dome" seconds={41} box={{ x: 130, y: 200, w: 1280, h: 720 }} brightness={1} /> : null}
      {f >= L1 + 10 && f < L2 ? <Pill x={160} y={225} size={32}>Time-lapse dated 2005; the 93 million is the July 2007 total</Pill> : null}
      {f >= L1 + 10 && f < L2 ? <Big x={160} y={290} big={f < vol ? `${count} MILLION m³` : "93 MILLION m³"} small="of dome by July 2007" size={70} /> : null}
      {/* line 2: same material, two exits */}
      {f >= L2 && f < L3 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <path d="M 200 800 L 620 400 L 700 400 L 1120 800 Z" fill="#3A302C" />
          <path d={`M 620 400 Q 660 ${400 - 190 * squeeze} 700 400 Z`} fill={B.tease} />
        </svg>
      ) : null}
      {f >= L2 && f < L3 ? <Big x={100} y={210} big="SQUEEZED OUT" small="not thrown" opacity={ease(f, L2 + 6, 10)} size={92} /> : null}
      {f >= L2 && f < L3 ? <Big x={1000} y={560} big="COUNTS AS 2" opacity={ease(f, L2 + 16, 10)} size={78} /> : null}
      {f >= L3 + 4 ? <Big x={160} y={240} big="SAME MOUNTAIN. REMEMBER THIS." small="it comes back three levels higher" opacity={ease(f, L3 + 4, 10)} size={68} color={B.tease} ink={B.paper} /> : null}
    </VolcanoShell>
  );
};
