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
 * S30 - below zero (episodes/S30-quake-negative). For L06 (the limit, 7:48). Vertical 1080x1920.
 * A zoom-out through nested squares, to scale by energy: area x32 a step (L06 #1), so side x sqrt(32) = 5.66. The square
 * of the magnitude being read fills the frame; everything smaller shrinks inside it. Readings from the gauge table
 * (sources §F); M-1 is that table / 1,000 (#2). The climb cuts after M9; an unlabelled dashed outline asks the question.
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

const STEP = Math.sqrt(32);
const FRAME_S = 640;
const C = { x: 470, y: 730 };
const LEVELS = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const COLOUR = (m: number) => {
  const k = (m + 1) / 10;
  const r = Math.round(lerp(0x3c, 0xff, k));
  const g = Math.round(lerp(0xa8, 0x5a, k));
  const b = Math.round(lerp(0xe0, 0x4f, k));
  return `rgb(${r},${g},${b})`;
};
const label = (m: number) => (m < 0 ? `M−${-m}` : `M${m}`);

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const L = (i: number) => lineAt(t, i);

  const realAt = L(1);
  const tntAt = L(2);
  const climbAt = L(3);
  const a1 = L(4);
  const a3 = cue(t, 4, "Magnitude three");
  const a5 = cue(t, 4, "Magnitude five");
  const a7 = L(5);
  const a9 = cue(t, 5, "Magnitude nine");
  const stopAt = L(6);
  const whereAt = L(7);
  const endAt = cue(t, 7, "That's in");
  const end = ease(frame, endAt, 12);

  // the reading: -1 until the climb, then to each spoken value
  const stops: [number, number][] = [
    [climbAt + 6, -1],
    [a1 - 2, 0],
    [a1 + 14, 1],
    [a3 + 14, 3],
    [a5 + 14, 5],
    [a7 + 14, 7],
    [a9 + 14, 9],
  ];
  let m = -1;
  for (let i = 0; i + 1 < stops.length; i++) {
    const [f0, m0] = stops[i];
    const [f1, m1] = stops[i + 1];
    if (frame >= f0) m = lerp(m0, m1, smooth(frame, f0, f1));
  }
  const shown = Math.round(m);
  const reading: Record<number, string> = { [-1]: "ABOUT HALF A GRAM OF TNT", 1: "ABOUT HALF A KILO", 3: "ABOUT 480 KILOS", 5: "ABOUT 480 TONNES", 7: "ABOUT 480 KILOTONS", 9: "ABOUT 480 MEGATONS" };

  // after M9 the squares keep shrinking toward an outline nobody has labelled
  const past = smooth(frame, stopAt, whereAt) * 0.55;
  const photo = 1 - ease(frame, tntAt, 12);
  const open = smooth(frame, tntAt, climbAt);
  const squares = ease(frame, tntAt, 12);
  const dashed = ease(frame, stopAt, 12);
  const atTop = m > 8.98;

  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      {/* the opening: a museum instrument, said to be one */}
      {photo > 0 ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1180, overflow: "hidden", opacity: photo }}>
          <Img src={staticFile("assets/l06-milne.jpg")} style={{ width: 1080, height: 1180, objectFit: "cover", objectPosition: "50% 50%", transform: `scale(${lerp(1.0, 1.1, smooth(frame, 0, tntAt))})`, filter: "brightness(0.82)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 200, background: `linear-gradient(transparent, ${B.ink})` }} />
        </div>
      ) : null}
      <Note x={40} y={156} rows={["real photo · museum seismograph, no quake on it"]} size={24} opacity={photo} />
      <Card x={40} y={230} big={[label(-1)]} small={["a negative magnitude"]} size={280} opacity={1 - ease(frame, realAt + 6 < tntAt ? tntAt : realAt + 6, 8)} />
      <Note x={40} y={640} rows={["not felt by any person"]} size={36} color={B.gauge} opacity={span(frame, realAt, tntAt)} />

      {/* the squares: each to scale by energy */}
      <svg width={1080} height={1200} style={{ position: "absolute", left: 0, top: 0, opacity: squares * (1 - ease(frame, endAt, 8)) }}>
        <defs>
          <clipPath id="s30win">
            <rect x={40} y={340} width={860} height={780} rx={18} />
          </clipPath>
        </defs>
        <g clipPath="url(#s30win)">
        {[...LEVELS].reverse().map((k) => {
          const s = FRAME_S * Math.pow(STEP, k - m - past) * lerp(0.42, 1, open);
          if (s < 0.5 || s > 3200) return null;
          return <rect key={k} x={C.x - s / 2} y={C.y - s / 2} width={s} height={s} fill={COLOUR(k)} stroke="rgba(5,14,24,0.55)" strokeWidth={3} />;
        })}
        </g>
        {dashed > 0 ? (
          <rect x={C.x - 380} y={C.y - 380} width={760} height={760} fill="none" stroke={B.paper} strokeWidth={8} strokeDasharray="30 20" opacity={dashed} />
        ) : null}
      </svg>

      {/* the reading */}
      <div style={{ position: "absolute", left: 40, top: 200, opacity: squares * (1 - ease(frame, stopAt, 10)) }}>
        <div style={{ fontFamily: F.headline, fontSize: 170, lineHeight: 1, color: B.paper, whiteSpace: "nowrap", textShadow: "0 6px 26px rgba(0,0,0,0.9)" }}>{label(shown)}</div>
        <div style={{ marginTop: 6, display: "inline-block", padding: "6px 16px", borderRadius: 10, background: "rgba(5,14,24,0.86)", fontFamily: F.ui, fontWeight: 800, fontSize: 40, letterSpacing: 1, color: B.gauge, whiteSpace: "nowrap", opacity: reading[shown] ? 1 : 0 }}>{reading[shown] ?? ""}</div>
      </div>
      <Note x={40} y={1090} rows={["each step: about ×32"]} size={32} color={B.gauge} opacity={span(frame, climbAt, stopAt)} />

      <Card x={40} y={200} big={["NO UPPER LIMIT", "ON THE SCALE"]} size={100} opacity={span(frame, stopAt, whereAt)} />
      <Card x={40} y={200} big={["SO WHERE DOES", "IT ACTUALLY STOP?"]} size={100} bg={B.tease} ink={B.paper} opacity={span(frame, whereAt, endAt)} />
      <div style={{ position: "absolute", left: C.x - 60, top: C.y - 120, fontFamily: F.headline, fontSize: 200, color: B.paper, opacity: span(frame, whereAt, endAt), textShadow: "0 6px 26px rgba(0,0,0,0.9)", display: atTop ? "block" : "none" }}>?</div>

      <div style={{ opacity: 1 - end }}>
        <CreditChip kind={photo > 0.5 ? "real" : "illustration"} source={photo > 0.5 ? "Auckland Museum, CC BY 4.0" : "squares to scale by energy"} left={40} bottom={1920 - 1216} />
      </div>
      <Captions t={t} hide={end} />
      <SeriesPill text="EVERY EARTHQUAKE MAGNITUDE" opacity={1 - end} />
      <EndCard opacity={end} series="EVERY EARTHQUAKE MAGNITUDE" line="the limit of the scale" />
    </AbsoluteFill>
  );
};

export const ShortS30: React.FC = () => <ShortFrame timeline={timeline} Body={Body} />;
