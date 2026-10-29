import React from "react";
import { AbsoluteFill, Loop, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { CreditChip } from "../../brand/kit";
import { B, F } from "../../brand/tokens";
import { FPS, SceneTiming, VoLine, buildTimeline, lineAt } from "../../lib/timeline";
import { ease, lerp } from "../../lib/ui";
import { Captions, Card, EndCard, Note, SeriesPill, ShortFrame, cue, currentLine, smooth, span } from "../S07-deep-anglerfish/shortKit";
import vo from "./vo.json";

loadBrandFonts();

/**
 * S13 - the cheetah number you've heard (episodes/S13-speed-cheetah; storyboard.md). For L03, Every Level of Speed
 * (level 3, the fastest animal on land, 1:35). Vertical 1080x1920.
 * Layout: the Rozi clip in a 16:9 window at the top (x 0-1080, y 210-818, NOT cropped to vertical, so the running cat
 * stays in frame), a "lab bench" of drawings below it (x 90-900, y 850-1150): a drawn collar with three readouts and a
 * run counter, then two bars. Chip y ~1,170-1,216, captions y 1,290-1,590 (shortKit). Nothing past x = 930, nothing in
 * the bottom 300 px.
 * Lines: 0 forget the number - almost none from a wild hunt · 1 study (2013), five wild cheetahs, Botswana · 2 position /
 * speed / acceleration, 367 runs · 3 a top speed, lower than you've heard (number REDACTED) · 4 most hunts nowhere near
 * it · 5 how fast, really? -> end card on "full video".
 * Honesty: the clip is a ZOO cheetah chasing a lure in slow motion (Commons, HAV0Xunderscore, CC0) - not one of the
 * collared wild cheetahs; a note on the picture says so for the whole Short. The collar, readouts and bars are drawn;
 * the bars only say "top" vs "most hunts: moderate" (Wilson et al. 2013) and are marked not to scale. The measured top
 * speed (93 km/h, L03 #3) is never shown: it is the answer, at L03 1:35.
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

const CLIP = { top: 210, h: 608 };
/** the clip is trimmed to 8 s (manifest cheetah-rozi, in 0 / out 8); a few frames short, as L03's shell does */
const CLIP_LOOP = 8 * FPS - 3;
const BAR = { x: 100, w: 760, h: 56 };
const RUNS = 367; // L03 #3

const Collar: React.FC<{ frame: number; opacity: number }> = ({ frame, opacity }) => (
  <svg width={300} height={260} viewBox="0 0 300 260" style={{ position: "absolute", left: 70, top: 870, opacity }}>
    {/* a drawn collar: a strap seen at an angle, with the logger box on it */}
    <ellipse cx={150} cy={130} rx={120} ry={70} fill="none" stroke="#C9A36A" strokeWidth={26} />
    <ellipse cx={150} cy={130} rx={120} ry={70} fill="none" stroke="#8E6F43" strokeWidth={4} strokeDasharray="10 12" />
    <rect x={98} y={168} width={104} height={64} rx={12} fill="#1E2A36" stroke={B.paper} strokeWidth={3} />
    <circle cx={180} cy={186} r={7} fill={B.tease} opacity={0.4 + 0.6 * Math.abs(Math.sin(frame / 6))} />
    <path d="M 120 214 h 30" stroke={B.mute} strokeWidth={4} strokeLinecap="round" />
  </svg>
);

const Readout: React.FC<{ x: number; y: number; label: string; on: number; frame: number }> = ({ x, y, label, on, frame }) => (
  <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 14, opacity: 0.25 + 0.75 * on }}>
    <div style={{ width: 18, height: 18, borderRadius: 9, background: on > 0.5 ? B.gauge : B.mute, boxShadow: on > 0.5 ? `0 0 ${10 + 6 * Math.sin(frame / 5)}px ${B.gauge}` : "none" }} />
    <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 34, letterSpacing: 2, color: on > 0.5 ? B.paper : B.mute, whiteSpace: "nowrap" }}>{label}</div>
  </div>
);

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const cur = currentLine(t, frame);
  const L = (i: number) => lineAt(t, i);

  const heardAt = cue(t, 0, "you've heard");
  const noneAt = cue(t, 0, "Almost none");
  const studyAt = cue(t, 1, "A study");
  const fiveAt = cue(t, 1, "five wild cheetahs");
  const botsAt = cue(t, 1, "Botswana");
  const readAt = [cue(t, 2, "position"), cue(t, 2, "speed and"), cue(t, 2, "acceleration")];
  const countAt = cue(t, 2, "three hundred");
  const huntsAt = cue(t, 2, "most of them");
  const topAt = cue(t, 3, "a top speed");
  const lowerAt = cue(t, 3, "lower than");
  const mostAt = cue(t, 4, "most of the hunts");
  const nearAt = cue(t, 4, "anywhere near");
  const reallyAt = cue(t, 5, "how fast");
  const endAt = cue(t, 5, "the full video");
  const end = ease(frame, endAt, 12);

  // line 0: the number you've heard, as a blank tag, then the stamp
  const heard = span(frame, heardAt, L(1));
  const stamp = ease(frame, noneAt, 8);
  // lines 1-2: the collar bench
  const bench = span(frame, studyAt, L(3));
  const runs = Math.round(RUNS * smooth(frame, countAt, huntsAt));
  // lines 3-4: the bars (lengths illustrative: only "top" vs "most hunts" is a claim)
  const bars = span(frame, topAt, reallyAt);
  const topW = BAR.w * smooth(frame, topAt, topAt + 24);
  const mostW = 0.46 * BAR.w * smooth(frame, mostAt, mostAt + 24);

  const chip =
    cur === 0
      ? { kind: "real" as const, source: "HAV0Xunderscore · CC0 · zoo cheetah, slow motion" }
      : cur <= 2
        ? { kind: "illustration" as const, source: "collar drawn · clip: HAV0Xunderscore, CC0" }
        : { kind: "illustration" as const, source: "bars not to scale · clip: HAV0Xunderscore" };

  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      {/* the clip, 16:9, uncropped: a zoo cheetah after a lure, slow motion */}
      <div style={{ position: "absolute", left: 0, top: CLIP.top, width: 1080, height: CLIP.h, overflow: "hidden", opacity: 1 - end }}>
        <Loop durationInFrames={CLIP_LOOP}>
          <OffthreadVideo src={staticFile("assets/cheetah-rozi.mp4")} muted style={{ width: 1080, height: CLIP.h, objectFit: "cover", filter: `brightness(${lerp(0.95, 0.6, ease(frame, L(3), 12))})` }} />
        </Loop>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 120, background: `linear-gradient(transparent, ${B.ink})` }} />
      </div>
      <Note x={40} y={CLIP.top + 18} rows={["shown: a zoo cheetah chasing a lure"]} opacity={1 - end} size={22} color={B.paper} />

      {/* line 0: the popular number, left blank on purpose; then the stamp */}
      <Card x={90} y={880} big={["??? KM/H"]} small={["the number you've heard"]} size={96} bg={B.paper} opacity={heard} />
      <div style={{ position: "absolute", left: 280, top: 560, padding: "6px 22px", border: `7px solid ${B.tease}`, borderRadius: 14, color: B.tease, fontFamily: F.headline, fontSize: 72, lineHeight: 1.05, letterSpacing: 2, whiteSpace: "nowrap", background: "rgba(5,14,24,0.7)", transform: `rotate(-6deg) scale(${lerp(1.4, 1, stamp)})`, opacity: stamp * heard }}>
        <div>ALMOST NONE</div>
        <div>FROM A WILD HUNT</div>
      </div>

      {/* lines 1-2: the collar, its three readouts and the run counter */}
      <Collar frame={frame} opacity={bench} />
      <Card x={400} y={862} big={["5 WILD CHEETAHS"]} size={64} opacity={span(frame, fiveAt, readAt[0])} />
      <Note x={400} y={968} rows={["Botswana · published 2013"]} opacity={span(frame, botsAt, readAt[0])} color={B.gauge} />
      <Note x={400} y={968} rows={["study published 2013"]} opacity={span(frame, studyAt, botsAt)} color={B.gauge} />
      <div style={{ opacity: span(frame, readAt[0] - 4, L(3)) }}>
        <Readout x={400} y={862} label="POSITION" on={ease(frame, readAt[0], 6)} frame={frame} />
        <Readout x={400} y={912} label="SPEED" on={ease(frame, readAt[1], 6)} frame={frame} />
        <Readout x={400} y={962} label="ACCELERATION" on={ease(frame, readAt[2], 6)} frame={frame} />
        <div style={{ position: "absolute", left: 400, top: 1020, display: "flex", alignItems: "baseline", gap: 16, opacity: ease(frame, countAt, 8) }}>
          <div style={{ fontFamily: F.headline, fontSize: 104, lineHeight: 1, color: B.gauge, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{runs}</div>
          <div style={{ fontFamily: F.headline, fontSize: 56, lineHeight: 1, color: B.paper, whiteSpace: "nowrap" }}>RUNS</div>
        </div>
      </div>

      {/* lines 3-4: the top speed (redacted) and where most hunts sat */}
      <div style={{ opacity: bars }}>
        <Note x={BAR.x - 10} y={858} rows={["top speed recorded"]} color={B.gauge} />
        <div style={{ position: "absolute", left: BAR.x, top: 906, width: topW, height: BAR.h, borderRadius: 10, background: B.gauge }} />
        <div style={{ position: "absolute", left: BAR.x + BAR.w - 230, top: 900, width: 230, height: BAR.h + 12, borderRadius: 10, background: B.tease, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.headline, fontSize: 46, color: B.paper, whiteSpace: "nowrap", opacity: ease(frame, topAt + 20, 8) }}>?? KM/H</div>
        <Note x={BAR.x - 10} y={980} rows={["lower than the one you've heard"]} opacity={ease(frame, lowerAt, 8) * (1 - ease(frame, mostAt, 8))} color={B.paper} />
        <Note x={BAR.x - 10} y={980} rows={["most hunts"]} opacity={ease(frame, mostAt, 8)} color={B.aqua} />
        <div style={{ position: "absolute", left: BAR.x, top: 1028, width: mostW, height: BAR.h, borderRadius: 10, background: B.aqua, opacity: ease(frame, mostAt, 6) }} />
        <Note x={BAR.x + 0.46 * BAR.w + 24} y={1036} rows={["moderate speeds"]} opacity={ease(frame, nearAt, 8)} color={B.aqua} />
      </div>

      {/* line 5: the question */}
      <Card x={90} y={900} big={["HOW FAST, REALLY?"]} size={92} opacity={span(frame, reallyAt, endAt)} />

      <div style={{ opacity: 1 - end }}>
        <CreditChip kind={chip.kind} source={chip.source} left={40} bottom={1920 - 1216} />
      </div>

      <Captions t={t} hide={end} />
      <SeriesPill text="EVERY LEVEL OF SPEED" opacity={1 - end} />
      <Note x={40} y={156} rows={["level 3 · the fastest animal on land"]} opacity={1 - end} color={B.gauge} size={24} />
      <EndCard opacity={end} series="EVERY LEVEL OF SPEED" line="level 3: the fastest animal on land" />
    </AbsoluteFill>
  );
};

export const ShortS13: React.FC = () => <ShortFrame timeline={timeline} Body={Body} />;
