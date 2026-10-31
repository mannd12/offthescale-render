import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { CreditChip } from "../../brand/kit";
import { B } from "../../brand/tokens";
import { SceneTiming, VoLine, buildTimeline, lineAt } from "../../lib/timeline";
import { ease, lerp } from "../../lib/ui";
import { Captions, Card, EndCard, Note, SeriesPill, ShortFrame, cue, currentLine, smooth, span } from "../S07-deep-anglerfish/shortKit";
import vo from "./vo.json";

loadBrandFonts();

/**
 * S23 - higher than the ocean is deep (episodes/S23-sky-vulture). For L05 (levels 4-5, 2:06). Vertical 1080x1920.
 * Layout: a Rüppell's griffon (`l05-vulture`, C. Moning, CC BY 4.0: NOT the 1973 bird, said on the picture from frame 0)
 * is the top band (y 0-600). Below, from line 3, a to-scale mirror: sea level at y 880, 1 km = 22 px, the vulture's
 * 11,300 m up, Challenger Deep's 10,935 m down (L05 #9, #11). On line 4 the depth bar's reflection rises beside the
 * vulture's to show the 365 m left over. Line 5 adds a "???" rung above, marked not to scale: nothing above is named.
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

const PLATE_H = 600;
const SEA = 880;
const PX_KM = 22;
const UP = 11.3 * PX_KM; // #9
const DOWN = 10.935 * PX_KM; // #11
const COL = { up: 180, ghost: 300, w: 100 };

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const cur = currentLine(t, frame);
  const L = (i: number) => lineAt(t, i);

  const hitAt = cue(t, 0, "A passenger plane");
  const altAt = cue(t, 1, "eleven thousand");
  const safeAt = cue(t, 2, "The plane landed");
  const recAt = cue(t, 2, "no bird");
  const flipAt = cue(t, 3, "Now flip");
  const deepAt = cue(t, 3, "The deepest point");
  const numAt = cue(t, 3, "ten thousand");
  const moreAt = cue(t, 4, "three hundred");
  const topAt = cue(t, 5, "wasn't anywhere");
  const whatAt = cue(t, 6, "So what's");
  const endAt = cue(t, 6, "the full video");
  const end = ease(frame, endAt, 12);

  const metres = Math.round(11300 * smooth(frame, altAt, L(2) - 4) / 100) * 100;
  const upGrow = smooth(frame, flipAt - 4, deepAt);
  const downGrow = smooth(frame, deepAt, numAt + 10);
  const ghost = smooth(frame, moreAt - 14, moreAt + 6);
  const mirror = ease(frame, flipAt - 6, 10);
  const dim = ease(frame, topAt, 12);
  const mystery = span(frame, topAt, endAt);

  const chip = cur < 3 ? { kind: "real" as const, source: "Christoph Moning, CC BY 4.0" } : { kind: "illustration" as const, source: "bars to scale · photo: C. Moning, CC BY 4.0" };

  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: PLATE_H + (1 - mirror) * 500, overflow: "hidden", opacity: 1 - end }}>
        <Img src={staticFile("assets/l05-vulture.jpg")} style={{ width: 1080, height: "100%", objectFit: "cover", objectPosition: "50% 35%", transform: `scale(${1.02 + 0.08 * smooth(frame, 0, flipAt)})`, transformOrigin: "50% 40%", filter: `brightness(${lerp(1, 0.4, dim)})` }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 170, background: `linear-gradient(transparent, ${B.ink})` }} />
      </div>
      <Note x={40} y={214} rows={["a rüppell's vulture · not the 1973 bird"]} opacity={1 - end} size={24} />

      <Card x={40} y={850} big={["1973 · OVER ABIDJAN"]} small={["passenger plane meets vulture"]} size={76} opacity={span(frame, hitAt, altAt)} bg={B.paper} />
      <Card x={40} y={850} big={[`${metres.toLocaleString("en-US")} M`]} small={["altitude"]} size={120} opacity={span(frame, altAt, safeAt)} />
      <Card x={40} y={850} big={["HIGHEST BIRD ON RECORD"]} small={["the plane landed safely"]} size={72} opacity={span(frame, recAt, flipAt - 6)} />
      <Note x={40} y={880} rows={["the plane landed safely"]} opacity={span(frame, safeAt, recAt)} color={B.gauge} size={34} />

      {/* the mirror, to scale */}
      <div style={{ opacity: mirror * (1 - end) }}>
        <div style={{ position: "absolute", left: 0, width: 1080, top: SEA, height: DOWN + 30, background: "rgba(31,92,143,0.28)" }} />
        <div style={{ position: "absolute", left: COL.up, top: SEA - UP * upGrow, width: COL.w, height: UP * upGrow, background: B.gauge, borderRadius: "10px 10px 0 0" }} />
        <div style={{ position: "absolute", left: COL.up, top: SEA, width: COL.w, height: DOWN * downGrow, background: B.aqua, borderRadius: "0 0 10px 10px" }} />
        {/* the depth bar's reflection, risen beside the bird's bar */}
        <div style={{ position: "absolute", left: COL.ghost, top: SEA - DOWN * ghost, width: COL.w, height: DOWN * ghost, background: B.aqua, opacity: 0.85, borderRadius: "10px 10px 0 0" }} />
        <div style={{ position: "absolute", left: 40, width: 860, top: SEA - 2, height: 4, background: B.paper }} />
        <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0, opacity: ease(frame, moreAt, 8) }}>
          <line x1={COL.up - 60} y1={SEA - UP} x2={COL.ghost + COL.w + 50} y2={SEA - UP} stroke={B.tease} strokeWidth={3} strokeDasharray="8 6" />
          <line x1={COL.up - 60} y1={SEA - DOWN} x2={COL.ghost + COL.w + 50} y2={SEA - DOWN} stroke={B.tease} strokeWidth={3} strokeDasharray="8 6" />
        </svg>
        <Note x={440} y={SEA - 52} rows={["sea level"]} color={B.paper} size={22} />
        <Note x={440} y={SEA - UP + 30} rows={["the vulture · 11,300 m"]} opacity={upGrow} color={B.gauge} size={28} />
        <Note x={440} y={SEA + DOWN - 66} rows={["challenger deep · 10,935 m"]} opacity={ease(frame, numAt, 8)} color={B.aqua} size={28} />
        <Note x={440} y={SEA + 20} rows={["bars to scale"]} color={B.mute} size={20} />
      </div>
      <Card x={440} y={SEA - UP - 96} big={["365 M HIGHER"]} size={68} opacity={span(frame, moreAt, topAt)} bg={B.tease} ink={B.paper} />

      {/* what's above: unnamed, unmeasured */}
      <div style={{ opacity: mystery }}>
        <div style={{ position: "absolute", left: COL.up, top: 290, width: COL.w, height: SEA - UP - 296, background: `repeating-linear-gradient(0deg, ${B.tease} 0 26px, transparent 26px 44px)`, opacity: 0.65 + 0.35 * Math.abs(Math.sin(frame / 7)) }} />
        <Note x={330} y={440} rows={["???"]} color={B.tease} size={44} />
        <Note x={330} y={520} rows={["not to scale"]} color={B.mute} size={20} />
      </div>
      <Card x={330} y={290} big={["AND ABOVE THAT?"]} size={78} opacity={span(frame, whatAt, endAt)} bg={B.tease} ink={B.paper} />

      <div style={{ opacity: 1 - end }}>
        <CreditChip kind={chip.kind} source={chip.source} left={40} bottom={1920 - 1216} />
      </div>

      <Captions t={t} hide={end} />
      <SeriesPill text="EVERY LEVEL OF THE SKY" opacity={1 - end} />
      <Note x={40} y={156} rows={["level 3 · the highest bird"]} opacity={1 - end} color={B.gauge} size={24} />
      <EndCard opacity={end} series="EVERY LEVEL OF THE SKY" line="level 4: what flies higher" />
    </AbsoluteFill>
  );
};

export const ShortS23: React.FC = () => <ShortFrame timeline={timeline} Body={Body} />;
