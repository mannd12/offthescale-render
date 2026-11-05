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
 * S36 - colder than space (episodes/S36-temperature-space). For L08 (cold open 0:00, answered in full at Level 11, 6:00).
 * Vertical 1080x1920. A real LHC magnet (on display in Belgrade, and it says so), the false-colour sky map, the site from
 * orbit, then a drawn ring and a to-scale thermometer from 0 to 3 K. Helium runs round the ring; one point on it starts to
 * glow. What happens there (collisions) and how hot it gets (#56, #58's figure) are never said or shown.
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

// to-scale thermometer, 0 K at the bottom, 3 K at the top
const TH = { x: 250, top: 330, bottom: 1030 };
const ky = (k: number) => TH.bottom - ((TH.bottom - TH.top) * k) / 3;

const Thermo: React.FC<{ level: number; ring: number; opacity: number }> = ({ level, ring, opacity }) => (
  <div style={{ opacity }}>
    <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0 }}>
      <rect x={TH.x} y={TH.top - 20} width={80} height={TH.bottom - TH.top + 20} rx={40} fill="rgba(255,255,255,0.08)" stroke={B.paper} strokeWidth={6} />
      <rect x={TH.x + 14} y={ky(level)} width={52} height={TH.bottom - ky(level)} rx={20} fill={B.aqua} />
      {[0, 1, 2, 3].map((k) => (
        <line key={k} x1={TH.x - 30} x2={TH.x} y1={ky(k)} y2={ky(k)} stroke={B.mute} strokeWidth={4} />
      ))}
      <line x1={TH.x + 80} x2={TH.x + 150} y1={ky(2.7)} y2={ky(2.7)} stroke={B.paper} strokeWidth={6} />
      <line x1={TH.x + 80} x2={TH.x + 150} y1={ky(1.9)} y2={ky(1.9)} stroke={B.gauge} strokeWidth={6} opacity={ring} />
      <line x1={TH.x - 30} x2={TH.x + 150} y1={ky(0)} y2={ky(0)} stroke={B.tease} strokeWidth={6} />
    </svg>
    <Note x={TH.x + 170} y={ky(2.7) - 28} rows={["outer space · 2.7 K"]} size={34} />
    <Note x={TH.x + 170} y={ky(1.9) - 28} rows={["the magnets · 1.9 K"]} size={34} color={B.gauge} opacity={ring} />
    <Note x={TH.x + 170} y={ky(0) - 28} rows={["absolute zero · 0 K"]} size={34} color={B.tease} />
    <Note x={50} y={TH.bottom + 40} rows={["drawn to scale · 0 to 3 K"]} size={28} />
  </div>
);

const Ring: React.FC<{ draw: number; flow: number; glow: number; opacity: number }> = ({ draw, flow, glow, opacity }) => {
  const frame = useCurrentFrame();
  const R = 260;
  const CY = 800;
  const C = 2 * Math.PI * R;
  const pulse = 0.75 + 0.25 * Math.sin(frame / 5);
  return (
    <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0, opacity }}>
      <circle cx={540} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={44} />
      <circle cx={540} cy={CY} r={R} fill="none" stroke={B.paper} strokeWidth={20} strokeDasharray={`${C * draw} ${C}`} transform={`rotate(-90 540 ${CY})`} strokeLinecap="round" />
      {/* helium: short aqua dashes running round the ring */}
      <circle cx={540} cy={CY} r={R} fill="none" stroke={B.aqua} strokeWidth={10} strokeDasharray="26 40" strokeDashoffset={-frame * 3} opacity={flow} />
      {/* the hot point on the ring */}
      <circle cx={540 + R * Math.cos(-0.6)} cy={CY + R * Math.sin(-0.6)} r={30 + 70 * glow * pulse} fill={B.tease} opacity={glow * 0.55} />
      <circle cx={540 + R * Math.cos(-0.6)} cy={CY + R * Math.sin(-0.6)} r={22 * glow} fill={B.gauge} opacity={glow} />
    </svg>
  );
};

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const L = (i: number) => lineAt(t, i);

  const spaceAt = L(1);
  const mapAt = cue(t, 1, "The oldest light");
  const twoSevenAt = cue(t, 1, "two point seven");
  const goAt = L(2);
  const ringAt = cue(t, 2, "There's a ring");
  const magAt = L(3);
  const colderAt = cue(t, 3, "Colder than");
  const heAt = L(4);
  const weeksAt = cue(t, 4, "and weeks");
  const hotAt = L(5);
  const askAt = L(6);
  const endAt = cue(t, 6, "The full video");
  const end = ease(frame, endAt, 12);

  const draw = smooth(frame, ringAt, ringAt + 40);
  const level = lerp(2.7, 1.9, smooth(frame, colderAt + 6, colderAt + 40));
  const tonnes = Math.round(120 * smooth(frame, heAt + 4, weeksAt));
  const glow = smooth(frame, hotAt + 10, hotAt + 50);
  const ringOn = frame >= ringAt && frame < magAt ? 1 : frame >= heAt ? 1 : 0;

  const chip =
    frame < spaceAt
      ? { kind: "real" as const, source: "MaGIc2laNTern · CC BY 3.0" }
      : frame < mapAt
        ? { kind: "illustration" as const, source: "drawn" }
        : frame < goAt
          ? { kind: "illustration" as const, source: "ESA and the Planck Collaboration · CC BY 4.0" }
          : frame < ringAt
            ? { kind: "real" as const, source: "NASA/METI/AIST/Japan Space Systems, ASTER" }
            : frame < magAt
              ? { kind: "illustration" as const, source: "ring drawn · not to scale" }
              : frame < colderAt
                ? { kind: "real" as const, source: "MaGIc2laNTern · CC BY 3.0" }
                : frame < heAt
                  ? { kind: "illustration" as const, source: "drawn to scale" }
                  : { kind: "illustration" as const, source: "ring drawn · not to scale" };

  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      {/* the magnet photo: hook and line 3 */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1180, overflow: "hidden", opacity: frame < spaceAt + 8 ? 1 - ease(frame, spaceAt, 8) : span(frame, magAt, colderAt) }}>
        <Img src={staticFile("assets/l08-dipole-close.jpg")} style={{ width: 1080, height: 1180, objectFit: "cover", objectPosition: "45% 50%", transform: `scale(${frame < magAt ? lerp(1.05, 1.25, smooth(frame, 0, spaceAt)) : lerp(1.25, 1.05, smooth(frame, magAt, colderAt))})`, filter: `brightness(${frame < magAt ? 0.5 : 0.7})` }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 200, background: `linear-gradient(transparent, ${B.ink})` }} />
      </div>
      <Note x={40} y={1060} rows={["real photo · a magnet from the ring, on display", "in Belgrade · not in the tunnel"]} size={26} opacity={frame < spaceAt ? 1 - ease(frame, spaceAt, 8) : span(frame, magAt, colderAt)} />

      <Card x={40} y={260} big={["COLDER THAN", "OUTER SPACE."]} size={140} opacity={1 - ease(frame, spaceAt, 10)} />
      <Card x={40} y={600} big={["ON EARTH"]} size={120} bg={B.tease} ink={B.paper} opacity={1 - ease(frame, spaceAt, 10)} />

      {/* space is not at zero; the oldest light */}
      <Card x={40} y={260} big={["SPACE ISN'T AT", "ABSOLUTE ZERO"]} size={104} opacity={span(frame, spaceAt, mapAt)} />
      <div style={{ position: "absolute", left: 40, top: 330, width: 1000, height: 500, borderRadius: 18, overflow: "hidden", opacity: span(frame, mapAt, goAt) }}>
        <Img src={staticFile("assets/l08-cmb.jpg")} style={{ width: 1000, height: 500, objectFit: "cover", transform: `scale(${lerp(1, 1.18, smooth(frame, mapAt, goAt))})` }} />
      </div>
      <Note x={40} y={250} rows={["false-colour map · the oldest light in the universe"]} size={28} opacity={span(frame, mapAt, goAt)} />
      <Card x={40} y={880} big={["2.7 K"]} small={["about 2.7 degrees above absolute zero"]} size={150} opacity={span(frame, twoSevenAt, goAt)} />

      {/* the site from orbit */}
      <div style={{ position: "absolute", left: 90, top: 330, width: 900, height: 811, borderRadius: 18, overflow: "hidden", opacity: span(frame, goAt, ringAt) }}>
        <Img src={staticFile("assets/l08-aster.jpg")} style={{ width: 900, height: 811, objectFit: "cover", transform: `scale(${lerp(1, 1.15, smooth(frame, goAt, ringAt))})` }} />
      </div>
      <Note x={40} y={220} rows={["real satellite photo, from orbit", "the circle is on the original"]} size={28} opacity={span(frame, goAt, ringAt)} />

      {/* the ring, drawn */}
      <Ring draw={draw} flow={smooth(frame, heAt, heAt + 20)} glow={glow} opacity={ringOn} />
      <Card x={40} y={210} big={["27 km RING"]} small={["underground · France-Switzerland border"]} size={120} opacity={span(frame, ringAt + 6, magAt)} />

      <Card x={40} y={230} big={["ITS MAGNETS: 1.9 K"]} size={110} opacity={span(frame, magAt, colderAt)} />
      <Thermo level={level} ring={ease(frame, colderAt + 30, 10)} opacity={span(frame, colderAt, heAt)} />
      <Card x={40} y={180} big={["COLDER THAN SPACE"]} size={100} bg={B.aqua} opacity={span(frame, colderAt, heAt)} />

      <Card x={40} y={210} big={[`${tonnes} TONNES`]} small={["of helium"]} size={130} bg={B.aqua} opacity={span(frame, heAt, hotAt)} />
      <Card x={40} y={1000} big={["WEEKS TO COOL DOWN"]} size={80} opacity={span(frame, weeksAt, hotAt)} />

      <Card x={40} y={210} big={["FAR HOTTER", "THAN THE SUN"]} size={120} bg={B.tease} ink={B.paper} opacity={span(frame, hotAt + 6, askAt)} />
      <Card x={40} y={210} big={["WHAT IS IT?", "HOW HOT?"]} size={130} bg={B.tease} ink={B.paper} opacity={span(frame, askAt, endAt)} />

      <div style={{ opacity: 1 - end }}>
        <CreditChip kind={chip.kind} source={chip.source} left={40} bottom={1920 - 1216} />
      </div>
      <Captions t={t} hide={end} />
      <SeriesPill text="EVERY LEVEL OF TEMPERATURE" opacity={1 - end} />
      <EndCard opacity={end} series="EVERY LEVEL OF TEMPERATURE" line="the ring colder than space" />
    </AbsoluteFill>
  );
};

export const ShortS36: React.FC = () => <ShortFrame timeline={timeline} Body={Body} />;
