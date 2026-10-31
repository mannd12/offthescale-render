import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { CreditChip } from "../../brand/kit";
import { B } from "../../brand/tokens";
import { SceneTiming, VoLine, buildTimeline, lineAt } from "../../lib/timeline";
import { ease, lerp } from "../../lib/ui";
import { Captions, Card, EndCard, Note, SeriesPill, ShortFrame, cue, smooth, span } from "../S07-deep-anglerfish/shortKit";
import vo from "./vo.json";

loadBrandFonts();

/**
 * S29 - Texas sloshed (episodes/S29-quake-alaska). For L06 (M9, 5:50). Vertical 1080x1920.
 * Line 1 `l06-rail`, line 2 `l06-lstreet`, both real and named. From line 3 a schematic globe (no coastline, so nothing
 * pretends to be a map): rings run out from Alaska, reach a water tank at Texas/Louisiana, a 47-state counter (L06 #38;
 * which states is not drawn), the swaying tower at Seattle (#40). On line 6 the whole globe rings (#39).
 * The magnitude is withheld: it is the question.
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

const G = { x: 470, y: 760, r: 370 };
const AK = { x: 270, y: 500 };
const SEA = { x: 350, y: 690 };
const TX = { x: 560, y: 960 };

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const L = (i: number) => lineAt(t, i);

  const yearAt = L(1);
  const globeAt = L(2);
  const statesAt = L(3);
  const seaAt = L(4);
  const bellAt = L(5);
  const howAt = L(6);
  const endAt = cue(t, 6, "The number's");
  const end = ease(frame, endAt, 12);

  const count = Math.round(47 * smooth(frame, statesAt + 6, seaAt - 8));
  const bell = ease(frame, bellAt, 10);
  const ringWob = 1 + bell * 0.022 * Math.sin(frame / 2.2);
  const rings = [0, 1, 2, 3].map((i) => ((frame + i * 22) % 88) / 88);
  const sway = Math.sin(frame / 7) * 5 * ease(frame, seaAt, 10);
  const slosh = (frame: number, i: number) => `M0 ${40 + i * 16} q 30 ${Math.sin((frame + i * 9) / 5) * 22} 60 0 t 60 0 t 60 0 t 60 0`;
  const globe = ease(frame, globeAt, 14);

  const chip = frame < yearAt ? { kind: "real" as const, source: "Alaska Railroad, 1964" } : frame < globeAt ? { kind: "real" as const, source: "A. Grantz, 1964" } : { kind: "illustration" as const, source: "schematic, not a map" };

  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      {frame < globeAt + 16 ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1180, overflow: "hidden", opacity: 1 - globe }}>
          <Img src={staticFile(frame < yearAt ? "assets/l06-rail.jpg" : "assets/l06-lstreet.jpg")} style={{ width: 1080, height: 1180, objectFit: "cover", objectPosition: "50% 70%", transform: `scale(${frame < yearAt ? lerp(1.02, 1.16, smooth(frame, 0, yearAt)) : lerp(1.02, 1.18, smooth(frame, yearAt, globeAt))}) translateX(${frame < 30 ? Math.sin(frame * 1.6) * 8 * (1 - frame / 30) : 0}px)`, filter: "brightness(0.9)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 200, background: `linear-gradient(transparent, ${B.ink})` }} />
        </div>
      ) : null}
      <Card x={40} y={214} big={["ALASKA QUAKE.", "WATER MOVED IN TEXAS."]} size={92} opacity={1 - ease(frame, yearAt, 8)} />
      <Note x={40} y={156} rows={["real photo · damaged tracks, Alaska, 1964"]} size={24} opacity={1 - ease(frame, yearAt, 6)} />
      <Note x={40} y={156} rows={["real photo · L Street slide, Anchorage, 1964"]} size={24} opacity={span(frame, yearAt, globeAt)} />
      <Card x={40} y={214} big={["MARCH 1964", "LARGEST IN US HISTORY"]} size={92} opacity={span(frame, yearAt, globeAt)} />

      {/* the schematic globe */}
      <svg width={1080} height={1200} style={{ position: "absolute", left: 0, top: 0, opacity: globe * (1 - ease(frame, endAt, 8)) }}>
        <defs>
          <radialGradient id="s29globe" cx="0.4" cy="0.3" r="0.85">
            <stop offset="0" stopColor="#3C86BC" />
            <stop offset="0.7" stopColor="#174466" />
            <stop offset="1" stopColor="#0A2238" />
          </radialGradient>
          <clipPath id="s29clip">
            <circle cx={G.x} cy={G.y} r={G.r} />
          </clipPath>
        </defs>
        <g transform={`translate(${G.x} ${G.y}) scale(${ringWob}) translate(${-G.x} ${-G.y})`}>
          <circle cx={G.x} cy={G.y} r={G.r} fill="url(#s29globe)" />
          <g clipPath="url(#s29clip)">
            {rings.map((p, i) => (
              <circle key={i} cx={AK.x} cy={AK.y} r={p * 720} fill="none" stroke={B.gauge} strokeWidth={6} opacity={(1 - p) * 0.9 * (1 - bell)} />
            ))}
          </g>
          <circle cx={AK.x} cy={AK.y} r={18} fill={B.tease} />
          <circle cx={TX.x} cy={TX.y} r={14} fill={B.aqua} />
          {frame >= seaAt ? <circle cx={SEA.x} cy={SEA.y} r={12} fill={B.paper} /> : null}
        </g>
        {/* the bell: rings round the whole planet */}
        {rings.map((p, i) => (
          <circle key={`b${i}`} cx={G.x} cy={G.y} r={G.r + p * 170} fill="none" stroke={B.gauge} strokeWidth={8} opacity={bell * (1 - p)} />
        ))}
        {/* the tank: water sloshing, at the Texas dot */}
        <g transform={`translate(${TX.x + 40} ${TX.y - 40})`} opacity={span(frame, globeAt + 10, statesAt)}>
          <rect x={-8} y={0} width={256} height={110} rx={12} fill="rgba(5,14,24,0.86)" />
          {[0, 1, 2].map((i) => (
            <path key={i} d={slosh(frame, i)} stroke={B.aqua} strokeWidth={6} fill="none" />
          ))}
        </g>
        {/* the tower, at Seattle */}
        <g transform={`translate(${SEA.x + 70} ${SEA.y + 60}) rotate(${sway})`} opacity={span(frame, seaAt, bellAt)}>
          <path d="M-5 0 L-3 -120 L3 -120 L5 0 Z" fill={B.paper} />
          <ellipse cx={0} cy={-122} rx={30} ry={9} fill={B.paper} />
          <path d="M-2 -130 L0 -170 L2 -130 Z" fill={B.paper} />
        </g>
      </svg>
      <Note x={AK.x - 110} y={AK.y - 76} rows={["Alaska"]} size={30} color={B.tease} opacity={globe * (1 - bell)} />
      <Note x={TX.x + 34} y={TX.y + 82} rows={["Texas, Louisiana"]} size={28} color={B.aqua} opacity={span(frame, globeAt + 10, statesAt)} />
      <Card x={40} y={214} big={["WATER SLOSHED"]} size={92} opacity={span(frame, globeAt, statesAt)} />
      <Card x={40} y={214} big={[`${count} STATES`]} small={["water-level recorders registered it"]} size={120} opacity={span(frame, statesAt, seaAt)} />
      <Card x={40} y={214} big={["THE SPACE NEEDLE SWAYED"]} small={["seattle · more than 1,200 miles away"]} size={72} opacity={span(frame, seaAt, bellAt)} />
      <Card x={40} y={214} big={["RANG LIKE A BELL"]} small={["usgs: the entire earth"]} size={110} opacity={span(frame, bellAt, howAt)} />
      <Card x={40} y={214} big={["HOW BIG DOES", "A QUAKE HAVE TO BE?"]} size={92} bg={B.tease} ink={B.paper} opacity={span(frame, howAt, endAt)} />

      <div style={{ opacity: 1 - end }}>
        <CreditChip kind={chip.kind} source={chip.source} left={40} bottom={1920 - 1216} />
      </div>
      <Captions t={t} hide={end} />
      <SeriesPill text="EVERY EARTHQUAKE MAGNITUDE" opacity={1 - end} />
      <EndCard opacity={end} series="EVERY EARTHQUAKE MAGNITUDE" line="the quake that rang the planet" />
    </AbsoluteFill>
  );
};

export const ShortS29: React.FC = () => <ShortFrame timeline={timeline} Body={Body} />;
