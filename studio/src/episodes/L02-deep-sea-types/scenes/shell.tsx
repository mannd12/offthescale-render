import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { CreditChip, Gauge, TopBar, levelImage } from "../../../brand/kit";
import { B, F } from "../../../brand/tokens";
import { SceneTiming } from "../../../lib/timeline";
import { LEVELS, LEVELS_REVEALED, PROBLEMS, SERIES, SOLVES, STOPS, typePos } from "../ladder";

export { NumberCard, Tag } from "../../../brand/kit";

/** The three-problem strip: the running motif of this episode. Lit problems are the ones this type answers. */
export const Problems: React.FC<{ lit: number[]; opacity?: number; x?: number; y?: number; pulse?: number }> = ({ lit, opacity = 1, x = 160, y = 250, pulse = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, display: "flex", gap: 16, opacity }}>
    {PROBLEMS.map((p, i) => (
      <div key={p} style={{ padding: "12px 26px", borderRadius: 999, fontFamily: F.ui, fontWeight: 800, fontSize: 34, transform: lit.includes(i) ? `scale(${1 + 0.05 * pulse})` : undefined, letterSpacing: 1.5, textTransform: "uppercase", background: lit.includes(i) ? B.gauge : "rgba(5,14,24,0.72)", color: lit.includes(i) ? B.ink : B.mute, outline: lit.includes(i) ? "none" : "2px solid rgba(255,255,255,0.25)" }}>
        {p}
      </div>
    ))}
  </div>
);

export const RungShell: React.FC<{
  t: SceneTiming;
  index: number;
  plate: { image: string; ext?: "jpg" | "png" } | { clip: string } | null;
  brightness?: number;
  credit: { kind: "real" | "illustration"; source?: string };
  teaseFrom?: number;
  revealAt?: number;
  chromeFrom?: number;
  /** show the three-problem strip (default on, lit per SOLVES) */
  problems?: boolean;
  /** camera move on the photo, from the scene (push in on what the line names). Default: a slow 8 % drift. */
  plateMove?: { scale: number; origin: string };
  /** "contain" shows the whole photo as a band (for a wide strip that "cover" would crop to its middle); `platePosition` is its object-position */
  plateFit?: "cover" | "contain";
  platePosition?: string;
  children?: React.ReactNode;
}> = ({ t, index, plate, brightness = 0.8, credit, teaseFrom, revealAt = -1, chromeFrom = 0, problems = true, plateMove, plateFit = "cover", platePosition = "50% 50%", children }) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, frame / t.frames);
  const lastAt = t.lines[t.lines.length - 1].at;
  // no "?????" end-teaser on the last rung: there is no ninth type
  const isLast = index === LEVELS.length - 1;
  const tease = (!isLast && frame >= (teaseFrom ?? t.frames - 75)) || frame < revealAt;
  const compact = Math.min(1, Math.max(0, (frame - 90) / 20)) * (1 - Math.min(1, Math.max(0, (frame - (lastAt - 20)) / 20)));
  const chrome = chromeFrom > 0 ? Math.min(1, Math.max(0, (frame - chromeFrom) / 15)) : 1;
  const id = LEVELS[index].id;
  const levels = revealAt >= 0 && frame >= revealAt ? LEVELS_REVEALED : LEVELS;
  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      {plate && "clip" in plate ? (
        <OffthreadVideo src={staticFile(`assets/${plate.clip}.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${brightness})` }} />
      ) : plate ? (
        <Img src={levelImage({ id: plate.image, name: "", reading: "", image: plate.image, ext: plate.ext })!} style={{ width: "100%", height: "100%", objectFit: plateFit, objectPosition: platePosition, transform: `scale(${plateMove?.scale ?? 1 + 0.08 * progress})`, transformOrigin: plateMove?.origin ?? "50% 45%", filter: `brightness(${brightness})` }} />
      ) : (
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 45% 40%, #10304A 0%, #0B1B2B 55%, #050E18 100%)" }} />
      )}
      <AbsoluteFill style={{ background: "linear-gradient(transparent 55%, rgba(5,14,24,0.72))" }} />
      {children}
      <div style={{ opacity: chrome }}>
        <TopBar series={SERIES} levels={levels} current={index} progress={progress} teasing={tease} compact={compact} unit="TYPE" />
        <Gauge x={1580} top={250} height={700} stops={STOPS} position={typePos(index + 1)} reading={`TYPE ${index + 1}`} sub={levels[index].name.toUpperCase()} />
        {problems ? <Problems lit={SOLVES[id] ?? []} opacity={Math.min(1, Math.max(0, (frame - 30) / 15))} pulse={frame > 30 && frame < 120 ? Math.abs(Math.sin((frame - 30) / 8)) : 0} /> : null}
        <CreditChip kind={credit.kind} source={credit.source} />
      </div>
    </AbsoluteFill>
  );
};
