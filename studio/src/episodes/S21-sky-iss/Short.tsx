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
 * S21 - one centimetre (episodes/S21-sky-iss). For L05, Every Level of the Sky (level 8, 5:06). Vertical 1080x1920.
 * Layout: the whole ISS (`l05-iss`, NASA 2011) is the top band (y 0-700). Below it a desk globe drawn TO TRUE SCALE:
 * r 330 px stands for 15 cm, so 415 km = 330 x 415 / 6,371 = 21.5 px (L05 #29, #30), and the top half rises into
 * y 820-1150. On line 4 two gravity bars replace it (100 % ground, about 90 % at the station, L05 #32).
 * The answer (free fall) is never drawn or said. Physics only.
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

const PLATE_H = 700;
const GLOBE = { x: 485, y: 1150, r: 330 };
const GAP_PX = (GLOBE.r * 415) / 6371; // true scale, #29 #30
const BAR = { x: 90, w: 800 };

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const cur = currentLine(t, frame);
  const L = (i: number) => lineAt(t, i);

  const stationAt = cue(t, 0, "That's where");
  const edgeAt = cue(t, 1, "far edge");
  const shrinkAt = cue(t, 2, "shrink");
  const acrossAt = cue(t, 2, "thirty centimetres");
  const cmAt = cue(t, 3, "about one centimetre");
  const gravAt = cue(t, 4, "gravity");
  const ninetyAt = cue(t, 4, "about ninety percent");
  const whyAt = cue(t, 5, "So why");
  const endAt = cue(t, 5, "the full video");
  const end = ease(frame, endAt, 12);

  const km = Math.round(415 * smooth(frame, 4, stationAt));
  // the globe rises from below the chip line; it leaves when the bars arrive
  const globe = ease(frame, shrinkAt, 16) * (1 - ease(frame, gravAt, 10));
  const rise = lerp(320, 0, smooth(frame, shrinkAt, acrossAt + 6));
  const sy = GLOBE.y - GLOBE.r - GAP_PX;
  const pulse = 1 + 0.25 * Math.abs(Math.sin(frame / 8));
  const bars = span(frame, gravAt, endAt);
  const fillG = smooth(frame, gravAt + 4, gravAt + 22);
  const fillS = 0.9 * smooth(frame, ninetyAt - 10, ninetyAt + 14);

  const chip = cur < 2 ? { kind: "real" as const, source: "NASA, 2011" } : { kind: "illustration" as const, source: cur < 4 ? "globe to scale · photo: NASA, 2011" : "bars drawn · photo: NASA, 2011" };

  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: PLATE_H, overflow: "hidden", opacity: 1 - end }}>
        <Img src={staticFile("assets/l05-iss.jpg")} style={{ width: 1080, height: PLATE_H, objectFit: "cover", transform: `scale(${1.02 + 0.14 * smooth(frame, 0, L(2))})`, transformOrigin: "50% 55%", filter: `brightness(${lerp(1, 0.5, ease(frame, whyAt, 12))})` }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 170, background: `linear-gradient(transparent, ${B.ink})` }} />
      </div>
      <Note x={40} y={214} rows={["real photo · the station, from a departing shuttle"]} opacity={1 - end} size={22} />

      <Card x={40} y={276} big={[`${km} KM`]} small={["above the ground"]} size={104} opacity={span(frame, 2, shrinkAt)} />
      <Note x={40} y={470} rows={["the far edge of everything?"]} opacity={span(frame, edgeAt, shrinkAt)} color={B.gauge} size={30} />

      {/* the globe, true scale */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1160, overflow: "hidden", opacity: globe }}>
        <svg width={1080} height={1160} style={{ position: "absolute", left: 0, top: rise }}>
          <defs>
            <radialGradient id="s21globe" cx="0.42" cy="0.2" r="0.85">
              <stop offset="0" stopColor="#6FC0EE" />
              <stop offset="0.65" stopColor="#1F5C8F" />
              <stop offset="1" stopColor="#0A2238" />
            </radialGradient>
          </defs>
          <circle cx={GLOBE.x} cy={GLOBE.y} r={GLOBE.r} fill="url(#s21globe)" />
          <g opacity={ease(frame, cmAt - 8, 10)}>
            <circle cx={GLOBE.x} cy={sy} r={15 * pulse} fill="none" stroke={B.gauge} strokeWidth={4} />
            <rect x={GLOBE.x - 7} y={sy - 3} width={14} height={6} rx={2} fill={B.paper} />
            {/* the bracket: from the station down to the surface, off to the side so the gap stays visible */}
            <line x1={GLOBE.x + 40} y1={sy} x2={GLOBE.x + 76} y2={sy} stroke={B.gauge} strokeWidth={4} />
            <line x1={GLOBE.x + 40} y1={GLOBE.y - GLOBE.r} x2={GLOBE.x + 76} y2={GLOBE.y - GLOBE.r} stroke={B.gauge} strokeWidth={4} />
            <line x1={GLOBE.x + 58} y1={sy} x2={GLOBE.x + 58} y2={GLOBE.y - GLOBE.r} stroke={B.gauge} strokeWidth={4} />
          </g>
        </svg>
        <Note x={90} y={742} rows={["desk globe · 30 cm across"]} opacity={ease(frame, acrossAt, 8)} size={24} />
        <Note x={600} y={1000} rows={["drawn to scale"]} opacity={ease(frame, acrossAt, 8)} color={B.mute} size={20} />
      </div>
      <Card x={590} y={742} big={["ABOUT 1 CM"]} size={62} opacity={span(frame, cmAt, gravAt)} />

      {/* the gravity bars */}
      <div style={{ opacity: bars }}>
        <Note x={BAR.x - 10} y={750} rows={["gravity on the ground"]} size={26} />
        <div style={{ position: "absolute", left: BAR.x, top: 808, width: BAR.w, height: 78, borderRadius: 12, background: "rgba(255,255,255,0.1)" }} />
        <div style={{ position: "absolute", left: BAR.x, top: 808, width: BAR.w * fillG, height: 78, borderRadius: 12, background: B.paper }} />
        <Note x={BAR.x - 10} y={926} rows={["gravity at the station"]} size={26} />
        <div style={{ position: "absolute", left: BAR.x, top: 984, width: BAR.w, height: 78, borderRadius: 12, background: "rgba(255,255,255,0.1)" }} />
        <div style={{ position: "absolute", left: BAR.x, top: 984, width: BAR.w * fillS, height: 78, borderRadius: 12, background: B.gauge }} />
        <Note x={BAR.x - 10} y={1080} rows={["about 90 %"]} opacity={ease(frame, ninetyAt, 8)} color={B.gauge} size={36} />
      </div>

      <Card x={40} y={290} big={["SO WHY DOES", "EVERYONE FLOAT?"]} size={92} opacity={span(frame, whyAt, endAt)} bg={B.tease} ink={B.paper} />

      <div style={{ opacity: 1 - end }}>
        <CreditChip kind={chip.kind} source={chip.source} left={40} bottom={1920 - 1216} />
      </div>

      <Captions t={t} hide={end} />
      <SeriesPill text="EVERY LEVEL OF THE SKY" opacity={1 - end} />
      <Note x={40} y={156} rows={["level 8 · the space station"]} opacity={1 - end} color={B.gauge} size={24} />
      <EndCard opacity={end} series="EVERY LEVEL OF THE SKY" line="level 8: the space station" />
    </AbsoluteFill>
  );
};

export const ShortS21: React.FC = () => <ShortFrame timeline={timeline} Body={Body} />;
