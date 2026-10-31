import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { CreditChip } from "../../brand/kit";
import { B, F } from "../../brand/tokens";
import { SceneTiming, VoLine, buildTimeline, lineAt } from "../../lib/timeline";
import { ease } from "../../lib/ui";
import { Captions, Card, EndCard, Note, SeriesPill, ShortFrame, cue, smooth, span } from "../S07-deep-anglerfish/shortKit";
import vo from "./vo.json";

loadBrandFonts();

/**
 * S26 - less than one magnitude ten (episodes/S26-quake-total). For L06 (M9.5, 6:56). Vertical 1080x1920.
 * One tall glass column drawn TO SCALE BY ENERGY: the dashed lid is one M10, and blocks pour in until the fill stops at
 * 10^(1.5 x -0.05) = 0.84 of it (M9.95, L06 #52). Then one band at the bottom lights: solid to 10 %, striped to 20 % of
 * the fill (#53). The quake is never named. All drawn.
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

const COL = { x: 90, w: 480, top: 450, bottom: 1150 };
const COL_H = COL.bottom - COL.top;
const FILL_H = COL_H * 0.841;

// fixed pseudo-random blocks (no Math.random: frames must render the same every time)
const BLOCKS = Array.from({ length: 90 }, (_, i) => ({
  x: ((i * 137) % 100) / 100,
  s: 10 + ((i * 61) % 34),
  at: i / 90,
  c: ["#6FC0EE", "#FFC83D", "#FF8A3D", "#FF5A4F"][(i * 7) % 4],
}));

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const L = (i: number) => lineAt(t, i);

  const totalAt = L(2);
  const faultAt = L(3);
  const oneAt = cue(t, 4, "One single");
  const whichAt = L(5);
  const endAt = cue(t, 5, "That's in");
  const end = ease(frame, endAt, 12);

  const fill = smooth(frame, 0, totalAt + 10);
  const fillPx = FILL_H * fill;
  const band = ease(frame, oneAt, 14);
  const pulse = 0.72 + 0.28 * Math.abs(Math.sin(frame / 9));
  const pourEnd = totalAt + 10;

  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      <Card x={40} y={210} big={["110 YEARS OF QUAKES", "< ONE MAGNITUDE 10"]} size={92} opacity={1 - ease(frame, whichAt, 8)} />
      <Card x={40} y={210} big={["WHICH ONE WAS IT?", "COULD A 10 HAPPEN?"]} size={92} bg={B.tease} ink={B.paper} opacity={span(frame, whichAt, endAt)} />

      {/* the column */}
      <div style={{ position: "absolute", left: COL.x, top: COL.top, width: COL.w, height: COL_H, overflow: "hidden", background: "rgba(255,255,255,0.05)" }}>
        {BLOCKS.map((b, i) => {
          const start = b.at * pourEnd * 0.92;
          const p = (frame - start) / 26;
          if (p < 0 || p > 1) return null;
          const landed = COL_H - fillPx - b.s;
          return <div key={i} style={{ position: "absolute", left: b.x * (COL.w - b.s), top: -b.s + (landed + b.s) * p * p, width: b.s, height: b.s, borderRadius: 3, background: b.c }} />;
        })}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: fillPx, background: "linear-gradient(#FF8A3D, #6FC0EE)", opacity: 1 - 0.68 * band }} />
        {/* the one quake: a tenth (solid), up to a fifth (striped) */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: FILL_H * 0.1, background: B.tease, opacity: band * pulse }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: FILL_H * 0.1, height: FILL_H * 0.1, background: `repeating-linear-gradient(135deg, ${B.tease} 0 16px, transparent 16px 32px)`, opacity: band * pulse }} />
      </div>
      {/* the lid: one M10 */}
      <svg width={1080} height={1200} style={{ position: "absolute", left: 0, top: 0 }}>
        <rect x={COL.x} y={COL.top} width={COL.w} height={COL_H} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={4} />
        <line x1={COL.x - 10} y1={COL.top} x2={COL.x + COL.w + 26} y2={COL.top} stroke={B.gauge} strokeWidth={8} strokeDasharray="22 14" />
        <line x1={COL.x + COL.w} y1={COL.bottom - fillPx} x2={COL.x + COL.w + 26} y2={COL.bottom - fillPx} stroke={B.paper} strokeWidth={5} opacity={ease(frame, totalAt, 10)} />
      </svg>

      <Note x={590} y={COL.top - 24} rows={["one M10"]} color={B.gauge} size={32} />
      <Note x={590} y={COL.top + 44} rows={["no known fault", "can produce it"]} size={24} opacity={ease(frame, faultAt, 10)} />
      <Note x={590} y={COL.bottom - FILL_H - 8 + 60} rows={["all of them", "≈ M9.95"]} size={32} opacity={ease(frame, totalAt, 10) * (1 - ease(frame, oneAt, 8))} />
      <Note x={590} y={760} rows={["about 500,000", "detectable a year"]} size={26} opacity={span(frame, L(1), totalAt)} />
      <div style={{ position: "absolute", left: 590, top: 960, opacity: band }}>
        <div style={{ fontFamily: F.headline, fontSize: 76, lineHeight: 1.02, color: B.tease, whiteSpace: "nowrap" }}>ONE QUAKE</div>
        <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 28, letterSpacing: 1, color: B.paper, whiteSpace: "nowrap" }}>A TENTH TO A FIFTH</div>
        <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 28, letterSpacing: 1, color: B.paper, whiteSpace: "nowrap" }}>OF THE WHOLE TOTAL</div>
      </div>

      <div style={{ opacity: 1 - end }}>
        <CreditChip kind="illustration" source="drawn to scale by energy" left={40} bottom={1920 - 1216} />
      </div>

      <Captions t={t} hide={end} />
      <SeriesPill text="EVERY EARTHQUAKE MAGNITUDE" opacity={1 - end} />
      <EndCard opacity={end} series="EVERY EARTHQUAKE MAGNITUDE" line="the biggest one, and the limit" />
    </AbsoluteFill>
  );
};

export const ShortS26: React.FC = () => <ShortFrame timeline={timeline} Body={Body} />;
