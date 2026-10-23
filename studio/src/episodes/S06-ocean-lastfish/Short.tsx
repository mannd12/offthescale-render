import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { CreditChip, Gauge } from "../../brand/kit";
import { B, F } from "../../brand/tokens";
import { SceneTiming, VoLine, buildTimeline, lineAt, within } from "../../lib/timeline";
import { ease } from "../../lib/ui";
import vo from "./vo.json";

loadBrandFonts();

/**
 * S06 - "where the fish run out" (episodes/S06-ocean-lastfish). Cliffhanger for L01 level 11 (13:05):
 * the deepest fish ever filmed (8,336 m) sits right at the ~8,200-8,400 m wall - and the wall is not
 * the pressure crushing them. So what stops a fish? (TMAO is never named.)
 * Vertical 1080x1920; everything important in x 70-930 and above y 1,600 (Shorts UI).
 * Lines: 0 no fish below a certain depth · 1 8,336 m, 2022, Izu-Ogasawara · 2 deepest fish ever seen ·
 * 3 the wall 8,200-8,400 m · 4 the ocean keeps going 2.6 km · 5 not the crush · 6 what stops a fish? · 7 end.
 * The bottom (10,935 m) is never named or labelled - it is S01's cliff and L01's level 12. So this gauge
 * has NO stop labels; it is a close-up of the deep (top = 6,000 m, unlabelled), with the wall stretched
 * so it reads on a phone, and the track below the wall stays hidden until "It keeps going".
 * snailfish-hadal is CC BY 4.0 and NOT the record fish (6,025 m, Atacama Trench): the chip and a block
 * under the picture say so from its first frame. rov-coral is Retriever Seamount, not a trench.
 */
const LINES = vo as VoLine[];
export const timeline = buildTimeline(LINES);

const W = 1080;
const PLATE_H = 1180;
const G_TOP = 250;
const G_H = 860; // track ends at y 1,110, clear of a two-line credit chip

/** piecewise: 6,000 m -> 0, 8,200 -> 0.42, 8,400 -> 0.58, 10,935 -> 1 */
const posOf = (m: number) => {
  const pts: [number, number][] = [[6000, 0], [8200, 0.42], [8400, 0.58], [10935, 1]];
  const d = Math.max(6000, Math.min(10935, m));
  for (let i = 1; i < pts.length; i++) {
    if (d <= pts[i][0]) {
      const [m0, p0] = pts[i - 1];
      const [m1, p1] = pts[i];
      return p0 + ((d - m0) / (m1 - m0)) * (p1 - p0);
    }
  }
  return 1;
};
const yOf = (m: number) => G_TOP + posOf(m) * G_H;

const cue = (t: SceneTiming, i: number, word: string) => {
  const text = t.lines[i].text;
  const k = text.indexOf(word);
  if (k < 0) throw new Error(`S06 cue: "${word}" is not in line ${i}`);
  return within(t, i, k / text.length);
};

/**
 * Burned-in captions, at most 2 lines at 60 px: each line is cut into chunks of <= ~42 characters -
 * whole sentences where they fit, long sentences into balanced parts (no one-word orphans) - and each
 * chunk is timed by where its first character sits in the line.
 */
const chunks = (text: string, max = 42) => {
  const parts: string[] = [];
  let buf = "";
  const flush = () => {
    if (buf) parts.push(buf);
    buf = "";
  };
  for (const s of text.split(/(?<=[.?!])\s+/)) {
    if (s.length > max) {
      flush();
      const k = Math.ceil(s.length / max);
      const target = s.length / k;
      let cur = "";
      let made = 0;
      for (const w of s.replace(/ —/g, "\u00a0—").split(" ")) {
        const next = cur ? `${cur} ${w}` : w;
        if (cur && made < k - 1 && (next.length > max || Math.abs(cur.length - target) < Math.abs(next.length - target))) {
          parts.push(cur);
          cur = w;
          made++;
        } else cur = next;
      }
      buf = cur; // the tail may share a caption with a short next sentence
    } else if (buf && `${buf} ${s}`.length <= max) buf = `${buf} ${s}`;
    else {
      flush();
      buf = s;
    }
  }
  flush();
  let at = 0;
  return parts.map((p) => {
    const c = { text: p.replace(/\u00a0/g, " "), from: at / text.length };
    at += p.length + 1;
    return c;
  });
};

const Caption: React.FC<{ text: string; opacity: number }> = ({ text, opacity }) => (
  <div style={{ position: "absolute", left: 70, width: 860, top: 1250, height: 330, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", opacity }}>
    <div style={{ fontFamily: F.caption, fontWeight: 600, fontSize: 60, lineHeight: 1.12, textWrap: "balance", color: B.paper, textShadow: "0 3px 0 #0B1B2B, 0 0 18px rgba(0,0,0,0.9), 0 6px 24px rgba(0,0,0,0.8)" }}>{text}</div>
  </div>
);

const Chip: React.FC<{ source: string; kind: "real" | "illustration"; opacity: number }> = ({ source, kind, opacity }) => (
  <div style={{ position: "absolute", left: 70, width: 860, top: 0, height: 1216, opacity }}>
    <CreditChip source={source} kind={kind} left={0} bottom={0} />
  </div>
);

/** a drawn fish outline (faces left) */
const FishOutline: React.FC<{ x: number; y: number; w: number; frame: number; opacity: number; fill?: string }> = ({ x, y, w, frame, opacity, fill = "rgba(255,255,255,0.08)" }) => {
  const tail = Math.sin(frame / 5) * 5;
  return (
    <svg width={w} height={w * 0.55} viewBox="0 0 200 110" style={{ position: "absolute", left: x, top: y, opacity, overflow: "visible" }}>
      <path d={`M152 55 L196 ${24 + tail} L186 55 L196 ${86 + tail} Z`} fill={fill} stroke={B.paper} strokeWidth={4} strokeLinejoin="round" />
      <path d="M18 55 C 48 14, 128 10, 160 52 C 128 98, 48 98, 18 55 Z" fill={fill} stroke={B.paper} strokeWidth={4} />
      <circle cx={44} cy={48} r={6} fill={B.paper} />
    </svg>
  );
};

const Body: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const n = t.lines.length;
  const L = (i: number) => lineAt(t, i);
  const win = (a: number, b: number, fin = 10, fout = 8) => ease(frame, a, fin) * (1 - ease(frame, b, fout));
  const endAt = L(7);
  const end = ease(frame, endAt, 12);

  // line 0: falling with no number shown ("? m"); line 1: the number arrives with its words
  const depth = 6200 + 1800 * ease(frame, 1, Math.max(20, L(1))) + 336 * ease(frame, L(1), 24);
  const reading = frame >= L(1) ? "8,336 m" : "? m";
  const keepsAt = cue(t, 4, "It keeps going");
  const moreAt = cue(t, 4, "two and a half");
  const reveal = ease(frame, keepsAt, 30);
  const wallTop = yOf(8200);
  const wallBot = yOf(8400);
  const fishY = yOf(8336);

  const zoom = (from: number, to: number) => 1.03 + 0.07 * Math.min(1, Math.max(0, (frame - from) / Math.max(1, to - from)));
  const rovOn = win(L(4), L(5), 12, 10);
  const snailOn = win(L(1), L(3), 10, 10);

  // the wall band: on from "hit a wall" (line 3), off for line 4, back for 5-6
  const wallAt = cue(t, 3, "hit a wall");
  const wallOn = Math.max(win(wallAt, L(4), 10, 10), win(L(5), endAt, 10, 10) * (frame >= L(6) ? 0.6 : 1));
  const spread = Math.max(ease(frame, wallAt, 20), frame >= L(5) ? 1 : 0);
  const lockAt = cue(t, 3, "eight thousand four hundred");

  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      {rovOn > 0 ? (
        <Img src={staticFile("assets/rov-coral.jpg")} style={{ position: "absolute", top: 0, left: 0, width: W, height: PLATE_H, objectFit: "cover", opacity: rovOn, transform: `scale(${zoom(L(4), L(5))})`, filter: "brightness(0.42)" }} />
      ) : null}
      <div style={{ position: "absolute", top: PLATE_H - 300, left: 0, right: 0, height: 300, background: `linear-gradient(transparent, ${B.ink})` }} />
      <div style={{ position: "absolute", top: PLATE_H, left: 0, right: 0, bottom: 0, background: B.ink }} />

      {/* series pill */}
      <div style={{ position: "absolute", top: 90, left: 70, padding: "12px 26px", borderRadius: 999, background: B.gauge, color: B.ink, fontFamily: F.ui, fontWeight: 800, fontSize: 32, letterSpacing: 1, opacity: 1 - end }}>EVERY LEVEL OF THE OCEAN</div>

      {/* line 3 onward: the wall, 8,200-8,400 m, across the frame */}
      {wallOn > 0 ? (
        <>
          <div style={{ position: "absolute", left: 336, top: wallTop, width: 594 * spread, height: wallBot - wallTop, background: "rgba(255,90,79,0.3)", borderTop: `4px solid ${B.tease}`, borderBottom: `${frame >= lockAt ? 8 : 3}px solid ${B.tease}`, opacity: wallOn }} />
          <div style={{ position: "absolute", left: 400, top: wallTop + 10, fontFamily: F.ui, fontWeight: 800, fontSize: 30, color: B.paper, whiteSpace: "nowrap", opacity: wallOn * ease(frame, cue(t, 3, "eight thousand two hundred"), 8) }}>≈ 8,200 m</div>
          <div style={{ position: "absolute", left: 400, top: wallBot - 46, fontFamily: F.ui, fontWeight: 800, fontSize: 30, color: B.paper, whiteSpace: "nowrap", opacity: wallOn * ease(frame, lockAt, 8) }}>≈ 8,400 m</div>
        </>
      ) : null}
      <div style={{ position: "absolute", left: 380, top: wallTop - 120, fontFamily: F.headline, fontSize: 100, lineHeight: 1, color: B.tease, whiteSpace: "nowrap", opacity: win(wallAt, L(4), 8, 10) }}>THE WALL</div>
      <div style={{ position: "absolute", left: 380, top: 220, fontFamily: F.ui, fontWeight: 800, fontSize: 40, letterSpacing: 1.5, color: B.paper, whiteSpace: "nowrap", opacity: win(L(3), L(4), 10, 10) }}>RIGHT AT THE EDGE</div>

      {/* the gauge; below the wall the track stays hidden until "It keeps going" */}
      <div style={{ position: "absolute", left: 0, top: 0, opacity: 1 - end }}>
        <Gauge x={30} top={G_TOP} height={G_H} stops={[]} position={posOf(depth)} reading={reading} />
        <div style={{ position: "absolute", left: 312, top: wallBot + 14 + (G_TOP + G_H - wallBot) * reveal, width: 26, height: Math.max(0, (G_TOP + G_H + 6 - wallBot - 14) * (1 - reveal)), background: B.ink }} />
        {/* the revealed track is greyed: nothing below is claimed except its length */}
        <div style={{ position: "absolute", left: 318, top: wallBot + 14, width: 12, height: (G_TOP + G_H - wallBot - 14) * reveal, borderRadius: 6, background: "rgba(140,160,179,0.85)" }} />
        {/* line 2: every fish ever seen is above the pointer */}
        <div style={{ position: "absolute", left: 316, top: G_TOP, width: 16, height: fishY - G_TOP, borderRadius: 8, background: B.gauge, boxShadow: `0 0 24px ${B.gauge}`, opacity: win(L(2), L(3), 10, 10) * 0.85 }} />
        <div style={{ position: "absolute", left: 70, width: 220, top: 380, textAlign: "right", fontFamily: F.ui, fontWeight: 800, fontSize: 28, lineHeight: 1.2, letterSpacing: 1, color: B.gauge, textShadow: "0 2px 10px rgba(0,0,0,0.9)", opacity: win(L(2), L(3), 10, 10) }}>
          <div>↑</div>
          <div>EVERY FISH</div>
          <div>EVER SEEN</div>
        </div>
      </div>

      {/* line 0: the line no fish has been found below - its depth withheld; a drawn fish sinks to it */}
      {(() => {
        const on = win(0, L(1), 1, 8);
        if (on <= 0) return null;
        const lineY = 700;
        const stop = cue(t, 0, "no fish has ever been found");
        const fy = 300 + (lineY - 130 - 300) * ease(frame, 1, Math.max(20, stop));
        return (
          <>
            <div style={{ position: "absolute", left: 336, top: lineY - 3, width: 594, height: 6, background: B.tease, opacity: on }} />
            <div style={{ position: "absolute", left: 380, top: lineY + 16, fontFamily: F.ui, fontWeight: 800, fontSize: 36, letterSpacing: 1.5, color: B.tease, whiteSpace: "nowrap", opacity: on }}>NO FISH BELOW · ? m</div>
            <FishOutline x={520} y={fy + Math.sin(frame / 10) * 4} w={230} frame={frame} opacity={on} />
          </>
        );
      })()}

      {/* lines 1-2: the record, with a picture that is NOT the record fish (said on it from frame one) */}
      {snailOn > 0 ? (
        <>
          <div style={{ position: "absolute", left: 360, top: 230, width: 570, height: 321, borderRadius: 18, overflow: "hidden", opacity: snailOn, boxShadow: "0 10px 30px rgba(0,0,0,0.6)" }}>
            <Img src={staticFile("assets/snailfish-hadal.png")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom(L(1), L(3))})` }} />
          </div>
          <div style={{ position: "absolute", left: 360, top: 562, width: 570, fontFamily: F.ui, fontWeight: 800, fontSize: 24, lineHeight: 1.25, letterSpacing: 1, color: B.paper, opacity: snailOn }}>
            SHOWN: A HADAL SNAILFISH AT 6,025 m · NOT THE RECORD FISH
          </div>
        </>
      ) : null}
      <div style={{ position: "absolute", left: 360, top: 660, opacity: win(L(1), L(3), 8, 10) }}>
        <div style={{ display: "inline-block", padding: "8px 22px 12px", borderRadius: 16, background: B.gauge, color: B.ink, boxShadow: "0 8px 28px rgba(0,0,0,0.6)" }}>
          <div style={{ fontFamily: F.headline, fontSize: 100, lineHeight: 1, whiteSpace: "nowrap" }}>8,336 m</div>
        </div>
        <div style={{ marginTop: 12, fontFamily: F.ui, fontWeight: 800, fontSize: 26, letterSpacing: 1.5, color: B.paper, whiteSpace: "nowrap", opacity: ease(frame, cue(t, 1, "in a trench"), 8) }}>IZU-OGASAWARA TRENCH · 2022</div>
        {(() => {
          const s = ease(frame, L(2), 12);
          return (
            <div style={{ marginTop: 14, fontFamily: F.headline, fontSize: 64 + 14 * s, lineHeight: 1, color: B.gauge, whiteSpace: "nowrap", opacity: s }}>
              <div>DEEPEST FISH</div>
              <div>EVER FILMED</div>
            </div>
          );
        })()}
      </div>

      {/* line 4: the ocean keeps going - only its length is given, the end is not labelled */}
      {(() => {
        const on = win(keepsAt, L(5), 10, 10);
        if (on <= 0) return null;
        const more = ease(frame, moreAt, 10);
        const bottom = G_TOP + G_H;
        return (
          <>
            <div style={{ position: "absolute", left: 350, top: fishY, width: 6, height: (bottom - fishY) * reveal, background: B.paper, opacity: on }} />
            <div style={{ position: "absolute", left: 350, top: fishY - 3, width: 26, height: 6, background: B.paper, opacity: on }} />
            <div style={{ position: "absolute", left: 350, top: bottom - 3, width: 26, height: 6, background: B.paper, opacity: on * reveal }} />
            <div style={{ position: "absolute", left: 400, top: 840, opacity: on * more }}>
              <div style={{ fontFamily: F.headline, fontSize: 110, lineHeight: 1, color: B.paper, whiteSpace: "nowrap" }}>2.6 km</div>
              <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 44, letterSpacing: 2, color: B.paper, whiteSpace: "nowrap" }}>MORE ↓</div>
            </div>
          </>
        );
      })()}
      <div style={{ position: "absolute", left: 380, top: 200, fontFamily: F.ui, fontWeight: 800, fontSize: 44, lineHeight: 1.15, letterSpacing: 1.5, color: B.paper, whiteSpace: "nowrap", textShadow: "0 2px 10px rgba(0,0,0,0.9)", opacity: win(L(4), L(5), 10, 10) }}><div>THE OCEAN</div><div>DOESN'T STOP</div></div>

      {/* line 5: not a crushing limit - a drawn press, struck out */}
      {(() => {
        const on = win(L(5), L(6), 10, 10);
        if (on <= 0) return null;
        const press = Math.sin(frame / 6) * 10;
        const strike = ease(frame, cue(t, 5, "pressure crushing"), 8);
        const cy = (wallTop + wallBot) / 2;
        return (
          <>
            <svg width={300} height={340} viewBox="0 0 300 340" style={{ position: "absolute", left: 520, top: cy - 170, opacity: on }}>
              <rect x={40} y={20 + press} width={220} height={40} rx={8} fill={B.mute} />
              <path d={`M150 ${66 + press} V ${130 + press} M128 ${108 + press} L150 ${132 + press} L172 ${108 + press}`} stroke={B.paper} strokeWidth={8} fill="none" strokeLinecap="round" />
              <rect x={40} y={280 - press} width={220} height={40} rx={8} fill={B.mute} />
              <path d={`M150 ${274 - press} V ${210 - press} M128 ${232 - press} L150 ${208 - press} L172 ${232 - press}`} stroke={B.paper} strokeWidth={8} fill="none" strokeLinecap="round" />
              <path d="M30 320 L270 20" stroke={B.tease} strokeWidth={18} strokeLinecap="round" strokeDasharray={400} strokeDashoffset={400 * (1 - strike)} />
            </svg>
            <div style={{ position: "absolute", left: 380, top: wallBot + 120, fontFamily: F.headline, fontSize: 88, lineHeight: 1, color: B.tease, whiteSpace: "nowrap", opacity: on * ease(frame, cue(t, 5, "isn't"), 8) }}>NOT THE CRUSH</div>
          </>
        );
      })()}

      {/* line 6: the fish at the wall, and the question */}
      {(() => {
        const on = win(L(6), endAt, 10, 10);
        if (on <= 0) return null;
        const q = ease(frame, cue(t, 6, "what stops"), 8);
        return (
          <>
            <FishOutline x={520} y={wallTop - 150 + Math.sin(frame / 10) * 6} w={280} frame={frame} opacity={on} />
            <div style={{ position: "absolute", left: 610, top: wallTop - 160, fontFamily: F.headline, fontSize: 130, lineHeight: 1, color: B.gauge, opacity: on * q * (0.7 + 0.3 * Math.sin(frame / 5)) }}>?</div>
            <div style={{ position: "absolute", left: 380, top: 200, fontFamily: F.headline, fontSize: 96, lineHeight: 1, color: B.paper, whiteSpace: "nowrap", opacity: on * q }}>
              <div>WHAT STOPS</div>
              <div>A FISH?</div>
            </div>
          </>
        );
      })()}

      {/* credit chips: what each picture really is */}
      <Chip kind="illustration" source="drawn" opacity={win(0, L(1), 1, 8)} />
      <Chip kind="real" source="Linley et al. 2022 (CC BY 4.0) · hadal snailfish, 6,025 m, Atacama Trench · not the record fish" opacity={win(L(1), L(3), 8, 8)} />
      <Chip kind="illustration" source="drawn" opacity={win(L(3), L(4), 8, 8)} />
      <Chip kind="real" source="NOAA Ocean Exploration · ROV on Retriever Seamount, 2014 (not a trench)" opacity={win(L(4), L(5), 8, 8)} />
      <Chip kind="illustration" source="drawn" opacity={win(L(5), endAt, 8, 8)} />

      {/* burned-in captions, at most two lines at a time */}
      {t.lines.map((l, i) => {
        if (i === n - 1) return null;
        const next = lineAt(t, i + 1);
        return chunks(l.text).map((c, k, all) => {
          const from = within(t, i, c.from);
          const to = k + 1 < all.length ? within(t, i, all[k + 1].from) : next;
          const on = ease(frame, from, 6) * (1 - ease(frame, to, 5));
          return on > 0 ? <Caption key={`${i}-${k}`} text={c.text} opacity={on} /> : null;
        });
      })}

      {/* line 7: end card */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: end, background: B.ink }}>
        <div style={{ fontFamily: F.headline, fontSize: 150, lineHeight: 0.95, color: B.paper, whiteSpace: "nowrap" }}>OFF THE</div>
        <div style={{ fontFamily: F.headline, fontSize: 150, lineHeight: 0.95, color: B.gauge, whiteSpace: "nowrap" }}>SCALE</div>
        <div style={{ marginTop: 50, fontFamily: F.ui, fontWeight: 800, fontSize: 34, letterSpacing: 3, color: B.gauge }}>EVERY LEVEL OF THE OCEAN</div>
        <div style={{ marginTop: 16, fontFamily: F.caption, fontWeight: 600, fontSize: 56, color: B.paper, textAlign: "center", whiteSpace: "nowrap" }}>the answer: level 11</div>
        <div style={{ marginTop: 4, fontFamily: F.caption, fontWeight: 600, fontSize: 56, color: B.paper, textAlign: "center", whiteSpace: "nowrap" }}>the last fish</div>
        <div style={{ marginTop: 40, fontFamily: F.caption, fontWeight: 600, fontSize: 64, color: B.gauge }}>full video on the channel</div>
        <svg width={120} height={140} viewBox="0 0 120 140" style={{ marginTop: 10 + 10 * Math.sin(frame / 6) }}>
          <path d="M60 10 V118 M18 78 L60 124 L102 78" stroke={B.gauge} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ marginTop: 50, fontFamily: F.ui, fontWeight: 800, fontSize: 30, letterSpacing: 3, color: B.mute }}>@OFFTHESCALETV</div>
      </div>
    </AbsoluteFill>
  );
};

export const ShortS06: React.FC = () => (
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
