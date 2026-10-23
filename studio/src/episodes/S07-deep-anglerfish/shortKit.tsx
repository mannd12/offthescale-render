import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { B, F } from "../../brand/tokens";
import { SceneTiming, buildTimeline, lineAt, within } from "../../lib/timeline";
import { ease } from "../../lib/ui";

/**
 * Shared frame for the Shorts S07-S12 (the five L02 Shorts and S12 for L03): the burned-in caption, the series pill,
 * L02's type rail (turned vertical), the end card and the Short wrapper. Brand chrome only - every Short's BODY
 * (layout, drawings, motion) is its own file (hard rule 1). Lives in S07's folder because each builder may only write
 * inside its own Shorts' folders; it can move to src/brand later.
 *
 * Shorts safe area (S01's rules): nothing important past x = 930 (YouTube's buttons own the right edge) and nothing
 * in the bottom 300 px (y >= 1,620). Layout used by all six: pill y 90-150, type label y 160-192, rail x 40-140 /
 * y 230-1,112, credit chip y ~1,170-1,216, caption band y 1,290-1,590.
 */

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** linear 0..1 between frames a and b */
export const lin = (frame: number, a: number, b: number) => (b <= a ? (frame >= b ? 1 : 0) : clamp01((frame - a) / (b - a)));
/** smooth 0..1 between a and b (cubic in-out) */
export const smooth = (frame: number, a: number, b: number) => interpolate(lin(frame, a, b), [0, 1], [0, 1], { easing: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2) });

/**
 * Frame (scene-relative) where `phrase` begins inside line i - estimated from its character position in the line, so
 * the cue re-syncs when the real voice replaces the estimated timings. Throws if the phrase is not in the line, so a
 * script edit can never leave a visual silently cued to the wrong words.
 */
export const cue = (t: SceneTiming, i: number, phrase: string) => {
  const l = t.lines[Math.min(i, t.lines.length - 1)];
  const k = l.text.indexOf(phrase);
  if (k < 0) throw new Error(`cue: "${phrase}" is not in line ${i} ("${l.text}")`);
  return within(t, i, k / l.text.length);
};

/** The line playing at `frame` (scene-relative). */
export const currentLine = (t: SceneTiming, frame: number) => {
  let cur = 0;
  for (let i = 0; i < t.lines.length; i++) if (frame >= lineAt(t, i)) cur = i;
  return cur;
};

/** on between frames a and b (eased in over `fin`, out over `fout`) */
export const span = (frame: number, a: number, b: number, fin = 10, fout = 8) => ease(frame, a, fin) * (1 - ease(frame, b, fout));

// ---------------------------------------------------------------------------------------------------------------
// Caption: the spoken line itself, in chunks of at most 40 characters so it never runs past two lines at 60 px
// (band x 70-930, y 1,290-1,590). Chunks split at clause ends first, then between words; each chunk comes up at its
// estimated position in the line and leaves when the next one starts.
// ---------------------------------------------------------------------------------------------------------------
const MAX_CHUNK = 40;

export const chunkLine = (text: string, max = MAX_CHUNK): { text: string; at: number }[] => {
  const clauses = text.split(/(?<=[,;:.?!—])\s+/).filter(Boolean);
  const pieces: string[] = [];
  for (const c of clauses) {
    if (c.length <= max) {
      pieces.push(c);
      continue;
    }
    const words = c.split(/\s+/);
    const n = Math.ceil(c.length / max);
    const target = c.length / n;
    let buf = "";
    for (const w of words) {
      if (buf && (buf.length + 1 + w.length > max || buf.length >= target)) {
        pieces.push(buf);
        buf = w;
      } else buf = buf ? `${buf} ${w}` : w;
    }
    if (buf) pieces.push(buf);
  }
  // merge neighbours while they fit
  const out: string[] = [];
  for (const p of pieces) {
    const last = out[out.length - 1];
    if (last && last.length + 1 + p.length <= max) out[out.length - 1] = `${last} ${p}`;
    else out.push(p);
  }
  let pos = 0;
  return out.map((s) => {
    const k = text.indexOf(s, pos);
    const at = Math.max(0, k) / text.length;
    pos = Math.max(pos, k + s.length);
    return { text: s, at };
  });
};

export const Captions: React.FC<{ t: SceneTiming; hide?: number; top?: number }> = ({ t, hide = 0, top = 1290 }) => {
  const frame = useCurrentFrame();
  const n = t.lines.length;
  const items: React.ReactNode[] = [];
  t.lines.forEach((l, i) => {
    const chunks = chunkLine(l.text);
    chunks.forEach((c, j) => {
      const from = within(t, i, c.at);
      // (the last chunk of the last line holds to the end: interpolate() needs a finite frame, so use one past the scene)
      const to = j + 1 < chunks.length ? within(t, i, chunks[j + 1].at) : i + 1 < n ? lineAt(t, i + 1) : t.frames + 30;
      const on = ease(frame, from, 5) * (1 - ease(frame, to, 4));
      if (on <= 0) return;
      items.push(
        <div key={`${i}-${j}`} style={{ position: "absolute", left: 70, right: 150, top, height: 300, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", opacity: on * (1 - hide) }}>
          <div style={{ fontFamily: F.caption, fontWeight: 600, fontSize: 60, lineHeight: 1.14, textWrap: "balance", color: B.paper, textShadow: "0 3px 0 #0B1B2B, 0 0 18px rgba(0,0,0,0.9), 0 6px 24px rgba(0,0,0,0.8)" }}>{c.text}</div>
        </div>,
      );
    });
  });
  return <>{items}</>;
};

// ---------------------------------------------------------------------------------------------------------------
// Chrome
// ---------------------------------------------------------------------------------------------------------------
export const SeriesPill: React.FC<{ text: string; opacity?: number }> = ({ text, opacity = 1 }) => (
  <div style={{ position: "absolute", top: 90, left: 40, padding: "12px 26px", borderRadius: 999, background: B.gauge, color: B.ink, fontFamily: F.ui, fontWeight: 800, fontSize: 32, letterSpacing: 1, whiteSpace: "nowrap", opacity }}>{text}</div>
);

/** Upper-case a label but keep units after a number as written ("45 cm", "1½ ft", "700 nm", "1.3 s"). */
export const upperKeepUnits = (s: string) => s.toUpperCase().replace(/([\d½][\d,.½]*\s?)(CM|NM|KM|M|IN|FT|S|MIN)\b/g, (_, n: string, u: string) => n + u.toLowerCase());

/** A note on its own dark scrim: what a photo really is. 26 px, uppercase (units kept), one line each row. */
export const Note: React.FC<{ x: number; y: number; rows: string[]; opacity?: number; color?: string; size?: number }> = ({ x, y, rows, opacity = 1, color = B.paper, size = 26 }) => (
  <div style={{ position: "absolute", left: x, top: y, padding: "8px 16px", borderRadius: 12, background: "rgba(5,14,24,0.86)", fontFamily: F.ui, fontWeight: 800, fontSize: size, lineHeight: 1.3, letterSpacing: 1.2, color, whiteSpace: "nowrap", opacity }}>
    {rows.map((r) => (
      <div key={r}>{upperKeepUnits(r)}</div>
    ))}
  </div>
);

/** A headline card (Anton) with an optional small line under it - each row is one line, never wrapped. */
export const Card: React.FC<{ x: number; y: number; big: string[]; small?: string[]; opacity?: number; bg?: string; ink?: string; size?: number }> = ({ x, y, big, small, opacity = 1, bg = B.gauge, ink = B.ink, size = 84 }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity, padding: "12px 26px 16px", borderRadius: 18, background: bg, color: ink, boxShadow: "0 8px 28px rgba(0,0,0,0.6)" }}>
    {big.map((b) => (
      <div key={b} style={{ fontFamily: F.headline, fontSize: size, lineHeight: 1.02, whiteSpace: "nowrap" }}>{b}</div>
    ))}
    {small?.map((s) => (
      <div key={s} style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 26, marginTop: 6, letterSpacing: 1, whiteSpace: "nowrap", textTransform: "uppercase" }}>{s}</div>
    ))}
  </div>
);

// ---------------------------------------------------------------------------------------------------------------
// The type rail: L02's TYPE 1 -> 8 gauge turned into eight stacked tiles on the left edge (numbers only - no photo
// thumbnails, so no tile can show an animal it does not describe; L02 #12: species depths unverified, so no depth).
// ---------------------------------------------------------------------------------------------------------------
export const TYPE_NAMES = ["THE LURE", "THE RED TORCH", "THE TRAP MOUTH", "THE GLASS BODY", "THE GIANT", "THE FASTER", "THE DRIFTER", "THE BONE-EATER"];
const RAIL_TOP = 230;
const TILE_H = 98;
const TILE_GAP = 14;

export const TypeRail: React.FC<{
  /** 1-8 */
  current: number;
  opacity?: number;
  /** 0..1: the 8th tile turns from "???" into TYPE 8 (S11) */
  reveal8?: number;
  /** a tile (1-8) that flickers - the next type being teased (S09) */
  flicker?: number;
  /** a tile (1-8) lit with its name withheld: the label reads "TYPE n · ???" */
  litHidden?: number;
  /** 0..1 across the end card: the tiles light one after another, once */
  wave?: number;
  /** label row opacity (it hides under the end card) */
  label?: number;
}> = ({ current, opacity = 1, reveal8 = 0, flicker, litHidden, wave = 0, label = 1 }) => {
  const frame = useCurrentFrame();
  const shown = litHidden ?? current;
  const name = litHidden ? "???" : current === 8 && reveal8 < 0.5 ? "???" : TYPE_NAMES[current - 1];
  return (
    <div style={{ opacity }}>
      <div style={{ position: "absolute", left: 40, top: 160, fontFamily: F.ui, fontWeight: 800, fontSize: 26, letterSpacing: 2, color: B.gauge, whiteSpace: "nowrap", textShadow: "0 2px 10px rgba(0,0,0,0.9)", opacity: label }}>
        TYPE {shown} · {name}
      </div>
      {TYPE_NAMES.map((_, k) => {
        const n = k + 1;
        const waveOn = wave > 0 && wave * 9 > n ? 1 : 0;
        const lit = n === shown || waveOn > 0;
        const mystery = n === 8 && reveal8 < 0.5 && !waveOn;
        const flick = flicker === n ? 0.5 + 0.5 * Math.abs(Math.sin(frame / 4)) : 0;
        return (
          <div key={n} style={{ position: "absolute", left: 40, top: RAIL_TOP + k * (TILE_H + TILE_GAP), width: 100, height: TILE_H, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box", background: lit ? B.gauge : mystery ? B.tease : "rgba(5,14,24,0.74)", outline: lit || mystery ? "none" : `3px solid rgba(255,255,255,${0.22 + 0.7 * flick})`, color: lit ? B.ink : mystery ? B.paper : B.mute, fontFamily: F.headline, fontSize: mystery ? 38 : 54, lineHeight: 1 }}>
            {mystery ? "???" : n}
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// End card (brand outro, shared like S01's): wordmark, series, one line about the long video, arrow, handle.
// ---------------------------------------------------------------------------------------------------------------
export const EndCard: React.FC<{ opacity: number; series: string; line: string }> = ({ opacity, series, line }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity, background: B.ink }}>
    <div style={{ fontFamily: F.headline, fontSize: 150, lineHeight: 0.95, color: B.paper, whiteSpace: "nowrap" }}>OFF THE</div>
    <div style={{ fontFamily: F.headline, fontSize: 150, lineHeight: 0.95, color: B.gauge, whiteSpace: "nowrap" }}>SCALE</div>
    <div style={{ marginTop: 50, fontFamily: F.ui, fontWeight: 800, fontSize: 34, letterSpacing: 3, color: B.gauge, whiteSpace: "nowrap" }}>{series}</div>
    <div style={{ marginTop: 16, fontFamily: F.caption, fontWeight: 600, fontSize: 52, color: B.paper, textAlign: "center", whiteSpace: "nowrap" }}>{line}</div>
    <div style={{ marginTop: 40, fontFamily: F.caption, fontWeight: 600, fontSize: 64, color: B.gauge }}>full video on the channel</div>
    <svg width={120} height={140} viewBox="0 0 120 140" style={{ marginTop: 10 }}>
      <path d="M60 10 V118 M18 78 L60 124 L102 78" stroke={B.gauge} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div style={{ marginTop: 60, fontFamily: F.ui, fontWeight: 800, fontSize: 30, letterSpacing: 3, color: B.mute }}>@OFFTHESCALETV</div>
  </div>
);

/** Fade from the plate to ink at the bottom of the picture area (y 0 - plateH). */
export const PlateFade: React.FC<{ plateH?: number }> = ({ plateH = 1180 }) => (
  <>
    <div style={{ position: "absolute", top: plateH - 360, left: 0, right: 0, height: 360, background: `linear-gradient(transparent, ${B.ink})` }} />
    <div style={{ position: "absolute", top: plateH, left: 0, right: 0, bottom: 0, background: B.ink }} />
  </>
);

/** The Short wrapper, as S01: one Sequence per scene, and the narration (skipped while timings are estimated). */
export const ShortFrame: React.FC<{ timeline: ReturnType<typeof buildTimeline>; Body: React.FC<{ t: SceneTiming }> }> = ({ timeline, Body }) => (
  <AbsoluteFill style={{ backgroundColor: B.ink }}>
    {timeline.scenes.map((s) => (
      <Sequence key={s.id} from={s.from} durationInFrames={s.frames} name={s.id}>
        <Body t={s} />
      </Sequence>
    ))}
    {timeline.scenes.flatMap((s) =>
      s.lines
        .filter((l) => !l.estimated)
        .map((l) => (
          <Sequence key={l.file} from={l.from} durationInFrames={l.audioFrames + 3} name={`vo ${s.id} ${l.index}`}>
            <Audio src={staticFile(l.file)} />
          </Sequence>
        )),
    )}
  </AbsoluteFill>
);
