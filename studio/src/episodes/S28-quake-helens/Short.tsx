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
 * S28 - about ten seconds (episodes/S28-quake-helens). For L06 (M5, 1:59). Vertical 1080x1920.
 * The eruption column `l06-msh` (portrait), labelled from frame 0 as what FOLLOWED. A clock counts to 10 on the hook.
 * Lines 3-4: a square drawn to scale by energy, 860 px a side for the largest US quake; the M5.1 is sqrt(1.4M) = 1,183
 * times smaller, 0.73 px, inside a ring (L06 #68). Magma and the bulge are never said or shown.
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

const SQ = { x: 60, y: 230, s: 860 };
const SPECK = SQ.s / 1183;

const trace = (frame: number, at: number) => {
  const pts: string[] = [];
  for (let i = 0; i <= 90; i++) {
    const x = 60 + (i / 90) * 860;
    const hit = i > 34 ? Math.exp(-(i - 34) / 14) : 0;
    const a = hit * 110 * Math.sin(i * 1.9 + frame / 3) * ease(frame, at, 8) + 3 * Math.sin(i * 0.7 + frame / 5);
    pts.push(`${i ? "L" : "M"}${x.toFixed(1)} ${(150 + a).toFixed(1)}`);
  }
  return pts.join(" ");
};

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const L = (i: number) => lineAt(t, i);

  const whereAt = L(1);
  const quakeAt = L(2);
  const scaleAt = L(3);
  const speckAt = L(4);
  const yetAt = L(5);
  const whatAt = L(6);
  const endAt = cue(t, 6, "That's magnitude");
  const end = ease(frame, endAt, 12);

  const count = Math.min(10, Math.floor(10 * smooth(frame, 0, whereAt - 6)));
  const photoOn = 1 - span(frame, scaleAt, yetAt, 12, 12);
  const dim = lerp(1, 0.45, ease(frame, whatAt, 12)) * lerp(1, 0.55, span(frame, quakeAt, scaleAt));
  const squareGrow = smooth(frame, scaleAt, scaleAt + 24);
  const ring = ease(frame, speckAt, 10);
  const ringR = lerp(160, 34 + 6 * Math.sin(frame / 7), smooth(frame, speckAt, speckAt + 28));

  const drawn = frame >= scaleAt && frame < yetAt;

  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1180, overflow: "hidden", opacity: photoOn }}>
        <Img src={staticFile("assets/l06-msh.jpg")} style={{ width: 1080, height: 1180, objectFit: "cover", objectPosition: `50% ${lerp(70, 30, smooth(frame, 0, quakeAt))}%`, transform: `scale(${lerp(1.0, 1.12, smooth(frame, 0, t.frames))})`, filter: `brightness(${dim})` }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 200, background: `linear-gradient(transparent, ${B.ink})` }} />
      </div>
      <Note x={40} y={156} rows={["real photo · the eruption that followed"]} size={26} opacity={photoOn * (1 - end)} />

      {/* hook clock */}
      <div style={{ position: "absolute", left: 40, top: 240, opacity: 1 - ease(frame, whereAt, 8) }}>
        <div style={{ fontFamily: F.headline, fontSize: 240, lineHeight: 1, color: B.gauge, whiteSpace: "nowrap", textShadow: "0 6px 30px rgba(0,0,0,0.9)" }}>+{count} SEC</div>
        <Card x={0} y={250} big={["THE MOUNTAIN SLIDES"]} size={88} bg={B.tease} ink={B.paper} opacity={ease(frame, Math.max(whereAt - 40, 0), 8)} />
        <div style={{ position: "absolute", left: 0, top: 380, width: 900, opacity: 0 }} />
      </div>
      <Note x={40} y={1096} rows={["clock not real time · about 10 s"]} size={22} color={B.mute} opacity={1 - ease(frame, whereAt, 8)} />

      {/* where and when */}
      <Card x={40} y={240} big={["MOUNT ST. HELENS", "18 MAY 1980 · 8:32 A.M."]} size={78} opacity={span(frame, whereAt, quakeAt)} />

      {/* the quake */}
      <div style={{ opacity: span(frame, quakeAt, scaleAt) }}>
        <Card x={40} y={240} big={["ONLY M5.1"]} size={170} />
        <svg width={1080} height={300} style={{ position: "absolute", left: 0, top: 640 }}>
          <path d={trace(frame, quakeAt + 10)} stroke={B.aqua} strokeWidth={6} fill="none" />
        </svg>
        <Note x={60} y={930} rows={["trace drawn, not the record"]} size={22} color={B.mute} />
      </div>

      {/* to scale by energy */}
      <div style={{ opacity: span(frame, scaleAt, yetAt, 12, 12) }}>
        <div style={{ position: "absolute", left: SQ.x + (SQ.s * (1 - squareGrow)) / 2, top: SQ.y + (SQ.s * (1 - squareGrow)) / 2, width: SQ.s * squareGrow, height: SQ.s * squareGrow, background: B.tease }} />
        <Note x={SQ.x + 20} y={SQ.y + 20} rows={["largest in US history", "about 1.4 million times the energy"]} size={26} opacity={ease(frame, scaleAt + 16, 8)} />
        <svg width={1080} height={1200} style={{ position: "absolute", left: 0, top: 0, opacity: ring }}>
          <rect x={SQ.x + SQ.s / 2 - SPECK / 2} y={SQ.y + SQ.s * 0.62} width={SPECK} height={SPECK} fill={B.paper} />
          <circle cx={SQ.x + SQ.s / 2} cy={SQ.y + SQ.s * 0.62} r={ringR} fill="none" stroke={B.paper} strokeWidth={5} />
        </svg>
        <Note x={SQ.x + SQ.s / 2 + 56} y={SQ.y + SQ.s * 0.62 - 26} rows={["M5.1 is in there"]} size={28} opacity={ease(frame, speckAt + 24, 8)} />
      </div>

      <Card x={40} y={240} big={["THEN THE ERUPTION"]} size={96} opacity={span(frame, cue(t, 5, "the volcano"), whatAt)} />
      <Card x={40} y={240} big={["WHAT WAS ALREADY", "INSIDE THE MOUNTAIN?"]} size={92} bg={B.tease} ink={B.paper} opacity={span(frame, whatAt, endAt)} />

      <div style={{ opacity: 1 - end }}>
        <CreditChip kind={drawn || (frame >= quakeAt && frame < scaleAt) ? "illustration" : "real"} source={drawn ? "squares to scale by energy" : frame >= quakeAt && frame < scaleAt ? "trace drawn · photo: USGS, A. Post" : "USGS, Austin Post, 1980"} left={40} bottom={1920 - 1216} />
      </div>
      <Captions t={t} hide={end} />
      <SeriesPill text="EVERY EARTHQUAKE MAGNITUDE" opacity={1 - end} />
      <EndCard opacity={end} series="EVERY EARTHQUAKE MAGNITUDE" line="magnitude 5: Mount St. Helens" />
    </AbsoluteFill>
  );
};

export const ShortS28: React.FC = () => <ShortFrame timeline={timeline} Body={Body} />;
