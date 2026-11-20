// Suppose Then vertical Shorts (1080x1920). A Short re-uses lines of a long episode's narration (no new TTS): `pick`
// names line numbers in the episode's vo.json, and the cloud render runs with episode=<that episode's slug>, so every
// take is already in the CI cache. Layout: hook band at the top (y 60-230), picture y 230-1260, captions y 1290-1590
// (Off the Scale's chunking), and an end card for the last END frames. Shots use ST01's ShotProps {t, d, f}.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { SceneTiming, VoLine, buildTimeline, lineAt, within } from "../timeline";
import { chunkLine } from "../../episodes/S07-deep-anglerfish/shortKit";
import { Sky } from "../illustrated/light";
import { loadSupposeFonts } from "./fonts";
import { Wordmark } from "./devices";
import { CHALK, INK, LIME, ST_FONT, SUPPOSE, SupposeFamily } from "./palette";

export const SW = 1080;
export const SH = 1920;
/** end card length (frames) after the last line */
export const END = 96;

export type VShotProps = { t: number; d: number; f: number };
export type VShot = React.FC<VShotProps>;

export type STShortCfg = {
  /** composition id, e.g. "sts01-short" */
  id: string;
  /** the long episode's vo.json */
  source: VoLine[];
  /** line numbers (0-based, in vo.json order) to play, in order */
  pick: number[];
  /** shots for each picked line: the line's span is split equally among them */
  shots: VShot[][];
  /** hook band text (one or two short rows), e.g. ["SUPPOSE EARTH WERE", "TWICE AS WIDE"] */
  hook: string[];
  /** end-card question rows (the teaser) */
  endQ: string[];
  fam?: SupposeFamily;
};

const Captions: React.FC<{ t: SceneTiming; end: number }> = ({ t, end }) => {
  const frame = useCurrentFrame();
  const out: React.ReactNode[] = [];
  t.lines.forEach((l, i) => {
    const chunks = chunkLine(l.text);
    chunks.forEach((c, j) => {
      const from = within(t, i, c.at);
      const to = j + 1 < chunks.length ? within(t, i, chunks[j + 1].at) : i + 1 < t.lines.length ? lineAt(t, i + 1) : end;
      if (frame < from || frame >= to) return;
      out.push(
        <div key={`${i}-${j}`} style={{ position: "absolute", left: 70, right: 150, top: 1290, height: 300, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <div style={{ fontFamily: ST_FONT, fontWeight: 800, fontSize: 62, lineHeight: 1.14, textWrap: "balance", color: CHALK, textShadow: `0 3px 0 ${INK}, 0 0 18px rgba(0,0,0,0.85), 0 6px 24px rgba(0,0,0,0.7)` }}>{c.text}</div>
        </div>,
      );
    });
  });
  return <>{out}</>;
};

const Hook: React.FC<{ rows: string[] }> = ({ rows }) => {
  const size = rows.length > 1 ? 64 : 76;
  const w = Math.max(...rows.map((r) => r.length)) * size * 0.7 + 110;
  const h = rows.length * (size + 10) + 44;
  return (
    <g>
      <rect x={540 - w / 2} y={70} width={w} height={h} rx={34} fill={INK} opacity={0.82} />
      <rect x={540 - w / 2} y={70} width={w} height={h} rx={34} fill="none" stroke={LIME} strokeWidth={4} opacity={0.9} />
      {rows.map((r, i) => (
        <text key={i} x={540} y={70 + 22 + (i + 1) * (size + 10) - 12} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={size} letterSpacing={1} fill={i === 0 ? LIME : CHALK}>{r}</text>
      ))}
    </g>
  );
};

const EndCard: React.FC<{ k: number; q: string[]; fam: SupposeFamily }> = ({ k, q, fam }) => {
  const F = SUPPOSE[fam];
  const bob = 14 * Math.abs(Math.sin(k / 7));
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, k / 8) }}>
      <svg width={SW} height={SH} viewBox={`0 0 ${SW} ${SH}`}>
        <Sky stops={[...F.sky]} x={0} y={0} w={SW} h={SH} />
        <rect x={0} y={0} width={SW} height={SH} fill={INK} opacity={F.dark ? 0.25 : 0.55} />
        <Wordmark x={540} y={430} size={128} />
        {q.map((r, i) => (
          <text key={i} x={540} y={680 + i * 96} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={80} fill={CHALK}>{r}</text>
        ))}
        <text x={540} y={680 + q.length * 96 + 80} textAnchor="middle" fontFamily={ST_FONT} fontWeight={800} fontSize={48} letterSpacing={2} fill={CHALK}>FULL VIDEO ON THE CHANNEL</text>
        <g transform={`translate(540 ${680 + q.length * 96 + 170 + bob})`}>
          <path d="M0 -40 V30 M-36 2 L0 40 L36 2" stroke={LIME} strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g transform={`translate(540 ${680 + q.length * 96 + 300}) scale(${1 + 0.04 * Math.sin(k / 5)})`}>
          <rect x={-330} y={-52} width={660} height={104} rx={52} fill={LIME} />
          <text x={0} y={20} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={58} fill={INK}>LIKE + SUBSCRIBE</text>
        </g>
        <text x={540} y={1760} textAnchor="middle" fontFamily={ST_FONT} fontWeight={800} fontSize={34} letterSpacing={3} fill={CHALK} opacity={0.8}>@SUPPOSETHEN</text>
      </svg>
    </AbsoluteFill>
  );
};

/** Build a Short: returns the component, its frame count, and the timing (for TIMING notes). */
export const makeSTShort = (cfg: STShortCfg) => {
  const { source, pick, shots, hook, endQ, fam = "moss" } = cfg;
  if (shots.length !== pick.length) throw new Error(`${cfg.id}: ${shots.length} shot lists for ${pick.length} lines`);
  const vo: VoLine[] = pick.map((n, k) => {
    const l = source[n];
    if (!l) throw new Error(`${cfg.id}: no line ${n}`);
    return { ...l, scene: "short", index: k, pauseAfter: k === pick.length - 1 ? 0.4 : Math.min(l.pauseAfter, 0.45) };
  });
  const timeline = buildTimeline(vo);
  const sc = timeline.scenes[0];
  const talkEnd = timeline.totalFrames;
  const frames = talkEnd + END;

  const C: React.FC = () => {
    loadSupposeFonts();
    const frame = useCurrentFrame();
    let i = 0;
    for (let k = 0; k < sc.lines.length; k++) if (frame >= lineAt(sc, k)) i = k;
    const start = i === 0 ? 0 : lineAt(sc, i);
    const end = i + 1 < sc.lines.length ? lineAt(sc, i + 1) : talkEnd;
    const list = shots[i];
    const seg = (end - start) / list.length;
    const k = Math.max(0, Math.min(list.length - 1, Math.floor((frame - start) / seg)));
    const s0 = Math.round(start + k * seg);
    const d = Math.round(start + (k + 1) * seg) - s0;
    const t = frame - s0;
    const popS = 1 + 0.035 * Math.pow(Math.max(0, 1 - t / 9), 2) + t * 0.00015;
    return (
      <AbsoluteFill style={{ backgroundColor: INK }}>
        {frame < talkEnd ? (
          <>
            <svg width={SW} height={SH} viewBox={`0 0 ${SW} ${SH}`} style={{ position: "absolute", inset: 0 }}>
              <g transform={`translate(540 760) scale(${popS}) translate(-540 -760)`}>
                {React.createElement(list[k], { key: `${i}-${k}`, t, d, f: frame })}
              </g>
              <Hook rows={hook} />
            </svg>
            <AbsoluteFill style={{ background: `rgba(243,245,234,${0.25 * Math.max(0, 1 - t / 4)})`, pointerEvents: "none" }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 1200, bottom: 0, background: `linear-gradient(rgba(19,36,29,0), rgba(19,36,29,0.72) 26%, rgba(19,36,29,0.8))` }} />
            <Captions t={sc} end={talkEnd} />
          </>
        ) : (
          <EndCard k={frame - talkEnd} q={endQ} fam={fam} />
        )}
        {sc.lines
          .filter((l) => !l.estimated)
          .map((l) => (
            <Sequence key={l.file} from={l.from} durationInFrames={l.audioFrames + 3}>
              <Audio src={staticFile(l.file)} />
            </Sequence>
          ))}
      </AbsoluteFill>
    );
  };
  return { id: cfg.id, C, frames, w: SW, h: SH, timeline };
};
