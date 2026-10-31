import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { CreditChip } from "../../brand/kit";
import { B, F } from "../../brand/tokens";
import { SceneTiming, VoLine, buildTimeline, lineAt } from "../../lib/timeline";
import { ease, lerp } from "../../lib/ui";
import { Captions, Card, EndCard, Note, SeriesPill, ShortFrame, cue, smooth, span } from "../S07-deep-anglerfish/shortKit";
import vo from "./vo.json";

loadBrandFonts();

/**
 * S34 - the modest one (episodes/S34-volcano-modest). For L07 (Level 4, 2:44). Vertical 1080x1920.
 * The plume over farmland, then a field of 300 dots (one per airport) that go out across the week; a satellite inset for
 * the plumes; five lit tiles with fog above them. How many levels are above is never shown or said.
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

const COLS = 20;
const ROWS = 15;
const GAP = 43;

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const L = (i: number) => lineAt(t, i);

  const nameAt = L(1);
  const dotsAt = L(2);
  const flightsAt = L(3);
  const paxAt = cue(t, 3, "and seven");
  const plumeAt = L(4);
  const levelAt = L(5);
  const askAt = L(6);
  const endAt = cue(t, 6, "That's in");
  const end = ease(frame, endAt, 12);

  const out = smooth(frame, dotsAt + 6, plumeAt - 10);
  const flights = Math.round(100 * smooth(frame, flightsAt + 2, paxAt));
  const dimDots = frame >= dotsAt && frame < plumeAt;
  const chip = frame >= dotsAt && frame < plumeAt ? { kind: "illustration" as const, source: "300 dots drawn · photo: Boaworm, CC BY 3.0" } : frame >= plumeAt && frame < levelAt ? { kind: "real" as const, source: "NASA, Apr 2010 · Boaworm, CC BY 3.0" } : frame >= levelAt ? { kind: "illustration" as const, source: "tiles drawn · photo: Boaworm, CC BY 3.0" } : { kind: "real" as const, source: "Boaworm, CC BY 3.0, Apr 2010" };

  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1180, overflow: "hidden" }}>
        <Img src={staticFile("assets/l07-eyja-plume.jpg")} style={{ width: 1080, height: 1180, objectFit: "cover", objectPosition: "60% 40%", transform: `scale(${lerp(1, 1.22, smooth(frame, 0, dotsAt))})`, transformOrigin: "65% 35%", filter: `brightness(${dimDots || frame >= levelAt ? 0.3 : frame >= plumeAt ? 0.5 : 0.95})` }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 200, background: `linear-gradient(transparent, ${B.ink})` }} />
      </div>

      <Note x={40} y={214} rows={["scientists call it “modest”"]} size={36} color={B.gauge} opacity={1 - ease(frame, nameAt, 10)} />
      <Card x={40} y={290} big={["300+ AIRPORTS CLOSED"]} size={92} bg={B.tease} ink={B.paper} opacity={1 - ease(frame, nameAt, 10)} />

      <Card x={40} y={210} big={["EYJAFJALLAJÖKULL"]} small={["Iceland, 2010 · real photo, from the farmland"]} size={100} opacity={span(frame, nameAt, dotsAt)} />

      {/* one dot, one airport */}
      <svg width={1080} height={700} style={{ position: "absolute", left: 0, top: 440, opacity: span(frame, dotsAt, plumeAt) }}>
        {Array.from({ length: COLS * ROWS }, (_, i) => {
          const c = i % COLS;
          const r = Math.floor(i / COLS);
          // a fixed scatter, so they go out across the field and not in a wipe
          const when = ((i * 83) % 300) / 300;
          const gone = out > when;
          return <circle key={i} cx={70 + c * GAP} cy={30 + r * GAP} r={14} fill={gone ? "rgba(255,255,255,0.14)" : B.gauge} />;
        })}
      </svg>
      <Note x={60} y={1110} rows={["one dot = one airport · 300 shown"]} size={26} opacity={span(frame, dotsAt, plumeAt)} />
      <Card x={40} y={210} big={["ABOUT TWO DOZEN", "COUNTRIES · ONE WEEK"]} size={84} opacity={span(frame, dotsAt, flightsAt)} />
      <Card x={40} y={210} big={[`${flights === 100 ? "100,000+" : `${flights},000`} FLIGHTS`]} small={["cancelled"]} size={92} bg={B.tease} ink={B.paper} opacity={span(frame, flightsAt, paxAt)} />
      <Card x={40} y={210} big={["7 MILLION PASSENGERS"]} small={["affected"]} size={86} opacity={span(frame, paxAt, plumeAt)} />

      {/* the plume from orbit */}
      <div style={{ position: "absolute", left: 200, top: 340, width: 620, height: 760, overflow: "hidden", borderRadius: 12, border: `4px solid ${B.paper}`, opacity: span(frame, plumeAt, levelAt) }}>
        <Img src={staticFile("assets/l07-eyja-sat.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 20%", transform: `scale(${lerp(1, 1.16, smooth(frame, plumeAt, levelAt))})`, transformOrigin: "55% 20%" }} />
      </div>
      <Card x={40} y={210} big={["PLUMES 3-10 km · ~¼ km³"]} size={78} opacity={span(frame, plumeAt, levelAt)} />

      {/* the rung, nothing readable above it */}
      <div style={{ opacity: span(frame, levelAt, endAt) }}>
        {[0, 1, 2, 3, 4].map((n) => (
          <div key={n} style={{ position: "absolute", left: 90, top: 1000 - n * 118, width: 200, height: 104, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: n === 4 ? B.gauge : "rgba(5,14,24,0.86)", color: n === 4 ? B.ink : B.mute, fontFamily: F.headline, fontSize: 70, opacity: ease(frame, levelAt + 2 + n * 4, 6) }}>{n}</div>
        ))}
        <div style={{ position: "absolute", left: 60, top: 170, width: 260, height: 300, background: `linear-gradient(rgba(255,90,79,0), rgba(255,90,79,0.65))`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.headline, fontSize: 170, color: B.paper, opacity: ease(frame, levelAt + 24, 10) }}>?</div>
      </div>
      <Card x={360} y={760} big={["LEVEL 4"]} size={140} opacity={span(frame, levelAt, askAt)} />
      <Card x={340} y={500} big={["HOW MANY", "LEVELS ARE", "ABOVE THIS?"]} size={100} bg={B.tease} ink={B.paper} opacity={span(frame, askAt, endAt)} />

      <div style={{ opacity: 1 - end }}>
        <CreditChip kind={chip.kind} source={chip.source} left={40} bottom={1920 - 1216} />
      </div>
      <Captions t={t} hide={end} />
      <SeriesPill text="EVERY LEVEL OF VOLCANIC ERUPTION" opacity={1 - end} />
      <EndCard opacity={end} series="EVERY LEVEL OF VOLCANIC ERUPTION" line="level 4: the modest one" />
    </AbsoluteFill>
  );
};

export const ShortS34: React.FC = () => <ShortFrame timeline={timeline} Body={Body} />;
