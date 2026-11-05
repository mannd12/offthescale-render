import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { CreditChip } from "../../brand/kit";
import { B, F } from "../../brand/tokens";
import { SceneTiming, VoLine, buildTimeline, lineAt } from "../../lib/timeline";
import { ease, lerp } from "../../lib/ui";
import { Captions, Card, EndCard, Note, SeriesPill, ShortFrame, cue, lin, smooth, span } from "../S07-deep-anglerfish/shortKit";
import vo from "./vo.json";

loadBrandFonts();

/**
 * S37 - dropped (episodes/S37-temperature-dropped). For L08 (Level 1, 0:33). Vertical 1080x1920.
 * A drawn tower with a cloud of dots; the 1995 condensate image only as "a different cloud" (labelled from its first frame);
 * a stopwatch and a to-scale 2-second bar where the untreated cloud is lost at 0.16 s; then the floor at -273.15 with a dot
 * hovering above it. The 38 pK figure (#9) and the lens (#12) are never said or shown. The tower is not to scale and the
 * cloud never falls its whole height in the 2 s (110 m takes longer than that), so the drop is drawn as a short slide.
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

const TW = { x: 690, w: 170, top: 250, bottom: 1110 };
// deterministic cloud: 46 dots in a disc
const DOTS = Array.from({ length: 46 }, (_, i) => {
  const a = i * 2.39996;
  const r = Math.sqrt((i + 0.5) / 46);
  return { dx: Math.cos(a) * r, dy: Math.sin(a) * r };
});

const Cloud: React.FC<{ cx: number; cy: number; spread: number; fade: number }> = ({ cx, cy, spread, fade }) => (
  <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0, opacity: fade }}>
    {DOTS.map((d, i) => (
      <circle key={i} cx={cx + d.dx * 46 * spread} cy={cy + d.dy * 46 * spread} r={7} fill={B.aqua} />
    ))}
  </svg>
);

const Tower: React.FC<{ opacity: number; height: number }> = ({ opacity, height }) => (
  <div style={{ opacity }}>
    <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0 }}>
      <rect x={TW.x} y={TW.top} width={TW.w} height={TW.bottom - TW.top} rx={14} fill="rgba(255,255,255,0.06)" stroke={B.paper} strokeWidth={8} />
      <path d={`M${TW.x - 20} ${TW.top} L${TW.x + TW.w / 2} ${TW.top - 70} L${TW.x + TW.w + 20} ${TW.top}`} fill="none" stroke={B.paper} strokeWidth={8} strokeLinejoin="round" />
      <line x1={TW.x - 40} x2={TW.x - 40} y1={TW.top} y2={TW.top + (TW.bottom - TW.top) * height} stroke={B.gauge} strokeWidth={8} />
      <line x1={TW.x - 60} x2={TW.x - 20} y1={TW.top} y2={TW.top} stroke={B.gauge} strokeWidth={8} opacity={height > 0 ? 1 : 0} />
      <line x1={TW.x - 60} x2={TW.x - 20} y1={TW.bottom} y2={TW.bottom} stroke={B.gauge} strokeWidth={8} opacity={height >= 1 ? 1 : 0} />
      <line x1={TW.x - 80} x2={TW.x + TW.w + 80} y1={TW.bottom + 8} y2={TW.bottom + 8} stroke={B.mute} strokeWidth={6} />
    </svg>
  </div>
);

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const L = (i: number) => lineAt(t, i);

  const atomsAt = L(1);
  const towerAt = L(2);
  const fallAt = L(3);
  const lostAt = L(4);
  const thinAt = cue(t, 4, "thinned out");
  const seenAt = L(5);
  const zeroAt = L(6);
  const neverAt = cue(t, 6, "and nothing");
  const askAt = L(7);
  const endAt = cue(t, 7, "The full video");
  const end = ease(frame, endAt, 12);

  const towerOn = frame < atomsAt ? 1 - ease(frame, atomsAt, 8) : span(frame, towerAt, zeroAt);
  // the cloud: waits at the top, then slides down over the watched two seconds (drawn, not to scale)
  const drop = smooth(frame, fallAt, seenAt + 40);
  const cy = TW.top + 60 + 420 * drop * drop;
  // the untreated cloud (line 4) thins out and vanishes; the treated one (line 5) stays tight
  const spread = frame >= thinAt && frame < seenAt ? lerp(1, 4.2, smooth(frame, thinAt, thinAt + 30)) : 1;
  const thinFade = frame >= thinAt && frame < seenAt ? 1 - smooth(frame, thinAt + 10, thinAt + 34) : 1;
  const bob = frame < fallAt ? 6 * Math.sin(frame / 9) : 0;
  // stopwatch: real time across the watched fall
  const secs = frame < fallAt ? 0 : frame < lostAt ? 2 * lin(frame, fallAt, fallAt + 60) : frame < seenAt ? Math.max(0, Math.min(0.16, (frame - thinAt) / 30)) : 2 * lin(frame, seenAt, seenAt + 60);
  const BAR = 560;
  const barFill = frame < seenAt ? lin(frame, thinAt, thinAt + 5) * 0.08 : 0.08 + 0.92 * lin(frame, seenAt, seenAt + 60);

  const chip =
    frame >= atomsAt && frame < towerAt
      ? { kind: "illustration" as const, source: "NIST/JILA, 1995 · false colour · not this experiment" }
      : frame >= zeroAt
        ? { kind: "illustration" as const, source: "drawn" }
        : frame >= lostAt
          ? { kind: "illustration" as const, source: "drawn · the bar is to scale, the tower is not" }
          : { kind: "illustration" as const, source: "drawn · not to scale" };

  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      <Tower opacity={towerOn} height={frame < towerAt ? 0 : smooth(frame, cue(t, 2, "a hundred"), cue(t, 2, "a hundred") + 30)} />
      <div style={{ opacity: towerOn }}>
        <Cloud cx={TW.x + TW.w / 2} cy={cy + bob} spread={spread} fade={thinFade} />
      </div>
      <Note x={TW.x - 180} y={540} rows={["110 m"]} size={34} color={B.gauge} opacity={span(frame, cue(t, 2, "a hundred") + 20, zeroAt)} />

      <Card x={40} y={260} big={["DROPPED."]} small={["the coldest thing ever reported"]} size={150} opacity={1 - ease(frame, atomsAt, 10)} />

      {/* a different cloud of atoms, labelled */}
      <div style={{ position: "absolute", left: 0, top: 200, width: 1080, height: 760, overflow: "hidden", opacity: span(frame, atomsAt, towerAt) }}>
        <Img src={staticFile("assets/l08-bec.jpg")} style={{ width: 1080, height: 760, objectFit: "cover", transform: `scale(${lerp(1.02, 1.15, smooth(frame, atomsAt, towerAt))})`, filter: "brightness(0.8)" }} />
      </div>
      <Note x={40} y={980} rows={["real data image · a different cloud of atoms, 1995", "not this experiment · false colour"]} size={28} opacity={span(frame, atomsAt, towerAt)} />
      <Card x={40} y={240} big={["~100,000 ATOMS"]} small={["rubidium · Germany, 2021"]} size={116} opacity={span(frame, atomsAt + 6, towerAt)} />

      <Card x={40} y={260} big={["A 110 m", "TOWER"]} size={130} opacity={span(frame, towerAt, fallAt)} />

      {/* stopwatch and the to-scale 2-second bar */}
      <div style={{ opacity: span(frame, fallAt, zeroAt) }}>
        <div style={{ position: "absolute", left: 40, top: 260, padding: "12px 26px", borderRadius: 18, background: "rgba(5,14,24,0.9)", fontFamily: F.headline, fontSize: 150, lineHeight: 1, color: frame >= thinAt && frame < seenAt && secs >= 0.16 ? B.tease : B.paper, fontVariantNumeric: "tabular-nums" }}>{secs.toFixed(2)} s</div>
        <Note x={40} y={460} rows={["free fall, watched"]} size={30} />
      </div>
      <div style={{ opacity: span(frame, lostAt, zeroAt) }}>
        <div style={{ position: "absolute", left: 40, top: 620, width: BAR, height: 50, borderRadius: 8, background: "rgba(255,255,255,0.14)" }} />
        <div style={{ position: "absolute", left: 40, top: 620, width: BAR * barFill, height: 50, borderRadius: 8, background: frame < seenAt ? B.tease : B.aqua }} />
        <Note x={40} y={690} rows={["0 s"]} size={26} />
        <Note x={40 + BAR - 70} y={690} rows={["2 s"]} size={26} />
        <Card x={40} y={760} big={["LOST AT ~1/6 s"]} small={["without the trick"]} size={70} bg={B.tease} ink={B.paper} opacity={ease(frame, thinAt + 20, 10) * (1 - ease(frame, seenAt, 8))} />
        <Card x={40} y={760} big={["SEEN ALL THE WAY"]} small={["with it"]} size={70} bg={B.aqua} opacity={ease(frame, seenAt + 8, 10)} />
      </div>

      {/* the floor */}
      <div style={{ opacity: span(frame, zeroAt, endAt) }}>
        <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0 }}>
          <line x1={40} x2={930} y1={940} y2={940} stroke={B.tease} strokeWidth={12} />
          <circle cx={560} cy={lerp(700, 860, smooth(frame, zeroAt, askAt)) + 6 * Math.sin(frame / 7)} r={34} fill={B.aqua} />
        </svg>
        <Note x={40} y={960} rows={["absolute zero"]} size={34} color={B.tease} />
        <Card x={40} y={260} big={["−273.15 °C"]} size={150} opacity={1 - ease(frame, askAt, 8)} />
        <Card x={40} y={500} big={["NEVER REACHED"]} size={90} bg={B.tease} ink={B.paper} opacity={span(frame, neverAt, askAt)} />
        <Card x={40} y={260} big={["HOW CLOSE", "DID THEY GET?"]} size={124} bg={B.tease} ink={B.paper} opacity={ease(frame, askAt, 10)} />
      </div>

      <div style={{ opacity: 1 - end }}>
        <CreditChip kind={chip.kind} source={chip.source} left={40} bottom={1920 - 1216} />
      </div>
      <Captions t={t} hide={end} />
      <SeriesPill text="EVERY LEVEL OF TEMPERATURE" opacity={1 - end} />
      <EndCard opacity={end} series="EVERY LEVEL OF TEMPERATURE" line="the coldest thing ever reported" />
    </AbsoluteFill>
  );
};

export const ShortS37: React.FC = () => <ShortFrame timeline={timeline} Body={Body} />;
