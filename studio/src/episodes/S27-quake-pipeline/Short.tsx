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
 * S27 - fourteen feet (episodes/S27-quake-pipeline). For L06 (M7, 3:57). Vertical 1080x1920.
 * The photo `l06-pipeline` fills y 0-1180. On line 2 a plan-view panel slides up: two blocks of ground, the far one
 * sliding along the fault, the pipe bending across it without breaking (L06 #32; not to scale). On line 5 a small
 * 1970s-to-2002 line. The prediction and the shoes (#33) are never explained.
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

const PANEL = { x: 60, y: 560, w: 840, h: 560 };
const FAULT_Y = 280;
const SHIFT = 190; // px, not to scale

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const L = (i: number) => lineAt(t, i);

  const shiftAt = L(2);
  const heldAt = L(3);
  const breakAt = cue(t, 3, "But the pipe");
  const lookAt = L(4);
  const planAt = L(5);
  const howAt = L(6);
  const endAt = cue(t, 6, "That's magnitude");
  const end = ease(frame, endAt, 12);

  const panel = span(frame, shiftAt, heldAt);
  const d = SHIFT * smooth(frame, shiftAt + 14, shiftAt + 62);
  const zoom = lookAt <= frame ? lerp(1.04, 1.32, smooth(frame, lookAt, howAt)) : lerp(1, 1.04, smooth(frame, 0, lookAt));
  const dim = lerp(1, 0.42, ease(frame, howAt, 12));
  const line = span(frame, planAt, howAt + 2);
  const lineFill = smooth(frame, planAt + 6, planAt + 50);

  const chip = frame >= shiftAt && frame < heldAt ? { kind: "illustration" as const, source: "the shift, drawn, not to scale" } : frame >= planAt && frame < howAt ? { kind: "illustration" as const, source: "line drawn · photo: USGS, 2002" } : { kind: "real" as const, source: "USGS, Nov 2002" };

  // pipe across the fault: straight, then an S between the two sides as the far side moves
  const cx = PANEL.w / 2 - 90;
  const pipe = `M${cx} ${PANEL.h - 20} L${cx} ${FAULT_Y + 70} C${cx} ${FAULT_Y + 10}, ${cx + d} ${FAULT_Y - 10}, ${cx + d} ${FAULT_Y - 70} L${cx + d} 20`;

  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1180, overflow: "hidden" }}>
        <Img src={staticFile("assets/l06-pipeline.jpg")} style={{ width: 1080, height: 1180, objectFit: "cover", objectPosition: "50% 50%", transform: `scale(${zoom})`, transformOrigin: "45% 55%", filter: `brightness(${dim})` }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 200, background: `linear-gradient(transparent, ${B.ink})` }} />
      </div>

      <Card x={40} y={210} big={["ABOUT 14 FEET. NOT BROKEN."]} size={80} opacity={1 - ease(frame, L(1), 10)} />
      <Note x={40} y={214} rows={["real photo · Trans-Alaska Pipeline", "M7.9 · November 2002"]} size={28} opacity={span(frame, L(1), shiftAt)} />
      <Card x={40} y={330} big={["M7.9"]} size={110} opacity={span(frame, L(1) + 12, shiftAt)} />

      {/* plan view */}
      <div style={{ position: "absolute", left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h, overflow: "hidden", borderRadius: 18, opacity: panel, background: "#2A3A2E", boxShadow: "0 10px 40px rgba(0,0,0,0.7)" }}>
        <svg width={PANEL.w} height={PANEL.h} style={{ position: "absolute", left: 0, top: 0 }}>
          <g transform={`translate(${d} 0)`}>
            <rect x={-400} y={0} width={PANEL.w + 800} height={FAULT_Y} fill="#4A5A3C" />
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <line key={i} x1={-300 + i * 180} y1={40} x2={-260 + i * 180} y2={FAULT_Y - 30} stroke="rgba(255,255,255,0.14)" strokeWidth={6} />
            ))}
          </g>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line key={i} x1={i * 180 - 40} y1={FAULT_Y + 40} x2={i * 180} y2={PANEL.h - 30} stroke="rgba(255,255,255,0.1)" strokeWidth={6} />
          ))}
          <line x1={0} y1={FAULT_Y} x2={PANEL.w} y2={FAULT_Y} stroke={B.tease} strokeWidth={8} strokeDasharray="26 14" />
          <path d={pipe} stroke={B.paper} strokeWidth={26} fill="none" strokeLinecap="round" />
          <path d={pipe} stroke="#8CA0B3" strokeWidth={10} fill="none" strokeLinecap="round" />
        </svg>
        <div style={{ position: "absolute", left: cx + SHIFT + 40, top: 40, fontFamily: F.headline, fontSize: 84, color: B.gauge, whiteSpace: "nowrap", opacity: ease(frame, shiftAt + 40, 10) }}>~14 FT</div>
        <div style={{ position: "absolute", left: cx + SHIFT + 44, top: 136, fontFamily: F.ui, fontWeight: 800, fontSize: 28, color: B.paper, letterSpacing: 1, whiteSpace: "nowrap", opacity: ease(frame, shiftAt + 40, 10) }}>SIDEWAYS</div>
        <div style={{ position: "absolute", left: cx + 70, top: PANEL.h - 170, fontFamily: F.ui, fontWeight: 800, fontSize: 28, color: B.paper, letterSpacing: 1, whiteSpace: "nowrap", opacity: ease(frame, cue(t, 2, "two and a half"), 10) }}>+ 2.5 ft VERTICALLY</div>
        <div style={{ position: "absolute", left: 20, top: FAULT_Y + 14, fontFamily: F.ui, fontWeight: 800, fontSize: 24, color: B.tease, letterSpacing: 1, whiteSpace: "nowrap" }}>THE FAULT</div>
      </div>

      <Card x={40} y={330} big={["A FEW SUPPORTS DAMAGED"]} size={68} bg="rgba(5,14,24,0.86)" ink={B.paper} opacity={span(frame, heldAt, lookAt)} />
      <Card x={40} y={440} big={["THE PIPE: NOT BROKEN"]} size={84} opacity={span(frame, breakAt, lookAt)} />
      <Note x={40} y={214} rows={["the zigzag, up on its supports"]} size={32} color={B.gauge} opacity={span(frame, lookAt, howAt)} />

      {/* then and the quake */}
      <svg width={1080} height={400} style={{ position: "absolute", left: 0, top: 800, opacity: line }}>
        <line x1={90} y1={180} x2={880} y2={180} stroke="rgba(255,255,255,0.3)" strokeWidth={10} />
        <line x1={90} y1={180} x2={90 + 790 * lineFill} y2={180} stroke={B.gauge} strokeWidth={10} />
        <circle cx={90} cy={180} r={20} fill={B.gauge} />
        <circle cx={880} cy={180} r={20} fill={lineFill > 0.98 ? B.tease : "rgba(255,255,255,0.3)"} />
      </svg>
      <Note x={50} y={850} rows={["1970s · planned"]} size={32} opacity={line} />
      <Note x={650} y={850} rows={["2002 · the quake"]} size={32} color={B.tease} opacity={line * ease(frame, planAt + 44, 8)} />

      <Card x={40} y={330} big={["HOW DID THEY KNOW,", "DECADES AHEAD?"]} size={100} bg={B.tease} ink={B.paper} opacity={span(frame, howAt, endAt)} />

      <div style={{ opacity: 1 - end }}>
        <CreditChip kind={chip.kind} source={chip.source} left={40} bottom={1920 - 1216} />
      </div>
      <Captions t={t} hide={end} />
      <SeriesPill text="EVERY EARTHQUAKE MAGNITUDE" opacity={1 - end} />
      <EndCard opacity={end} series="EVERY EARTHQUAKE MAGNITUDE" line="magnitude 7: the pipeline" />
    </AbsoluteFill>
  );
};

export const ShortS27: React.FC = () => <ShortFrame timeline={timeline} Body={Body} />;
