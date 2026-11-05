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
 * S38 - colder than Pluto (episodes/S38-temperature-pluto). For L08 (Level 3, 2:12). Vertical 1080x1920.
 * Pluto (New Horizons) and its average; a drawn trip back from the edge to the Earth and Moon (not to scale); the real
 * Hermite mosaic (names burned in by the source); a drawn thermometer where everything below Pluto's mark is a question.
 * Hermite's -248 (#24) is never said or shown; #24 is a 2010 statement and the Short dates it.
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

const Trip: React.FC<{ k: number; opacity: number }> = ({ k, opacity }) => {
  const frame = useCurrentFrame();
  const y = 760;
  const px = 860;
  const ex = 280;
  const dot = lerp(px, ex, k);
  return (
    <div style={{ opacity }}>
      <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={110} x2={px} y1={y} y2={y} stroke="rgba(255,255,255,0.22)" strokeWidth={6} strokeDasharray="14 18" />
        <circle cx={110} cy={y} r={60} fill={B.gauge} />
        <circle cx={ex} cy={y} r={30} fill={B.aqua} />
        <circle cx={ex + 52} cy={y - 34} r={12} fill={B.paper} />
        <circle cx={px} cy={y} r={20} fill={B.mute} />
        <circle cx={dot} cy={y} r={46 + 6 * Math.sin(frame / 5)} fill="none" stroke={B.tease} strokeWidth={8} />
      </svg>
      <Note x={40} y={y + 80} rows={["the Sun"]} size={30} />
      <Note x={ex - 90} y={y - 140} rows={["Earth and Moon"]} size={30} />
      <Note x={px - 70} y={y + 80} rows={["Pluto"]} size={30} />
      <Note x={40} y={y + 190} rows={["drawn · not to scale"]} size={26} />
    </div>
  );
};

// a drawn thermometer from -200 down to absolute zero (-273.15), to scale
const TY = (c: number) => 470 + ((-200 - c) / 73.15) * 600;
const Thermo: React.FC<{ q: number; opacity: number }> = ({ q, opacity }) => {
  const frame = useCurrentFrame();
  const blink = 0.55 + 0.45 * Math.abs(Math.sin(frame / 8));
  return (
    <div style={{ opacity }}>
      <svg width={1080} height={1180} style={{ position: "absolute", left: 0, top: 0 }}>
        <rect x={420} y={TY(-200) - 20} width={90} height={TY(-273.15) - TY(-200) + 20} rx={45} fill="rgba(255,255,255,0.08)" stroke={B.paper} strokeWidth={6} />
        <rect x={436} y={TY(-232)} width={58} height={TY(-273.15) - TY(-232)} rx={22} fill={B.tease} opacity={q * blink} />
        <line x1={380} x2={560} y1={TY(-232)} y2={TY(-232)} stroke={B.paper} strokeWidth={8} />
        <line x1={380} x2={560} y1={TY(-273.15)} y2={TY(-273.15)} stroke={B.mute} strokeWidth={8} />
      </svg>
      <Note x={580} y={TY(-232) - 26} rows={["Pluto · −232 °C"]} size={34} />
      <Note x={580} y={TY(-273.15) - 26} rows={["absolute zero"]} size={30} color={B.mute} />
      <div style={{ position: "absolute", left: 600, top: (TY(-232) + TY(-273.15)) / 2 - 70, fontFamily: F.headline, fontSize: 140, lineHeight: 1, color: B.tease, opacity: q }}>?</div>
    </div>
  );
};

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const L = (i: number) => lineAt(t, i);

  const guessAt = L(1);
  const avgAt = cue(t, 1, "It averages");
  const homeAt = L(2);
  const moonAt = L(3);
  const hermAt = cue(t, 3, "in a crater");
  const saidAt = L(4);
  const askAt = L(5);
  const endAt = cue(t, 5, "The full video");
  const end = ease(frame, endAt, 12);

  const pluto = frame < homeAt;
  const herm = frame >= moonAt && frame < askAt;
  const chip = pluto
    ? { kind: "real" as const, source: "NASA/JHU APL/SwRI/Alex Parker · New Horizons, 2015" }
    : herm
      ? { kind: "real" as const, source: "NASA/GSFC/Arizona State University · LRO" }
      : { kind: "illustration" as const, source: frame >= askAt ? "drawn to scale" : "drawn · not to scale" };

  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1180, overflow: "hidden", opacity: 1 - ease(frame, homeAt, 10) }}>
        <Img src={staticFile("assets/l08-pluto.jpg")} style={{ width: 1080, height: 1180, objectFit: "cover", objectPosition: "45% 50%", transform: `scale(${lerp(1.05, 1.35, smooth(frame, 0, homeAt))})`, filter: `brightness(${frame >= guessAt ? 0.6 : 0.8})` }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 200, background: `linear-gradient(transparent, ${B.ink})` }} />
      </div>
      <Note x={40} y={1080} rows={["real photo · Pluto, New Horizons, 2015"]} size={28} opacity={1 - ease(frame, homeAt, 10)} />

      <Card x={40} y={260} big={["COLDER THAN", "PLUTO"]} small={["reported by NASA, 2010"]} size={150} opacity={1 - ease(frame, guessAt, 10)} />
      <Card x={40} y={260} big={["AS COLD AS", "IT GETS?"]} size={130} opacity={span(frame, guessAt, avgAt)} />
      <Card x={40} y={260} big={["−232 °C"]} small={["Pluto's average"]} size={170} opacity={span(frame, avgAt, homeAt)} />

      <Trip k={smooth(frame, homeAt + 8, moonAt - 6)} opacity={span(frame, homeAt, moonAt)} />
      <Card x={40} y={260} big={["MUCH CLOSER", "TO HOME"]} size={120} opacity={span(frame, homeAt, moonAt)} />

      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1180, overflow: "hidden", opacity: span(frame, moonAt, askAt) }}>
        <Img src={staticFile("assets/l08-hermite.jpg")} style={{ width: 1080, height: 1180, objectFit: "cover", objectPosition: "50% 25%", transform: `scale(${lerp(1.1, 1.35, smooth(frame, moonAt, askAt))})`, transformOrigin: "50% 25%", filter: `brightness(${frame >= saidAt ? 0.55 : 0.9})` }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 200, background: `linear-gradient(transparent, ${B.ink})` }} />
      </div>
      <Note x={40} y={1080} rows={["real photo · the Moon · names on the original"]} size={26} opacity={span(frame, moonAt, askAt)} />
      <Card x={40} y={760} big={["OUR OWN MOON"]} size={100} opacity={span(frame, moonAt + 4, hermAt)} />
      <Card x={40} y={760} big={["HERMITE CRATER"]} size={100} opacity={span(frame, hermAt, saidAt)} />
      <Card x={40} y={690} big={["THE COLDEST NASA", "HAD MEASURED", "IN THE SOLAR SYSTEM"]} small={["as of 2010"]} size={88} opacity={span(frame, saidAt, askAt)} />

      <Thermo q={ease(frame, askAt + 14, 10)} opacity={span(frame, askAt, endAt)} />
      <Card x={40} y={180} big={["HOW COLD IS IT", "IN THERE?"]} size={104} bg={B.tease} ink={B.paper} opacity={span(frame, askAt, endAt)} />

      <div style={{ opacity: 1 - end }}>
        <CreditChip kind={chip.kind} source={chip.source} left={40} bottom={1920 - 1216} />
      </div>
      <Captions t={t} hide={end} />
      <SeriesPill text="EVERY LEVEL OF TEMPERATURE" opacity={1 - end} />
      <EndCard opacity={end} series="EVERY LEVEL OF TEMPERATURE" line="the place colder than Pluto" />
    </AbsoluteFill>
  );
};

export const ShortS38: React.FC = () => <ShortFrame timeline={timeline} Body={Body} />;
