// L17 · the time ladder (BUILD.md §5): the YEARS dial, the nine-rung ladder, the compact rung badge and the full-frame
// rung card. Rung labels are TIME SCALES, not claims (F12); the order and speed of the early rungs is ours (row 19,
// stamped MODEL on the board). Vermilion only on the dial needle and the rung glow (storyboard §1).
// USAGE (f = the shot's frame)
//   RUNGS[i]                 → { label: "DAY" … "A MILLION", word: "ONE DAY" … "ONE MILLION YEARS" } for i = 0..8
//   rungValue(i)             → the dial value 0..1 of rung i (evenly spaced: the dial is log-ish, one sector per rung)
//   <YearsDial x y r?=150 value={0..1} word?="MILLENNIA" family f rattle?={0..1} plate?="dark"|"light" title?="YEARS" />
//       needle vermilion, end-stops saffron; `word` sits in the window under the hub (default: the nearest rung's
//       word; numerals are checked: only "10,000 YEARS" / "100,000 YEARS" pass, BUILD.md §5). `rattle` shakes the needle
//       at an end-stop (Z-01). Animate `value` yourself: 4 deg/f ≈ 0.0167 of value per frame.
//   <TimeLadder x?=1820 y0?=70 y1?=1010 f family draw?={0..1 drawing head, bottom up} lit?={0..9 rungs glowing, fractional
//       = the next one lighting} glow?={rung index pulsing} stamps?={[{ rung, kind, age?, ghost? }]} labels?="left"|"right"|"none"
//       width?=70 size?=1 (type scale; the board's full page uses ~1.6) scroll?={px, content moves up} />
//       The HUD version (C-10..C-12, scene 10, closer) lives on a depth-0 Layer at frame right, x ≈ 1760-1880.
//   <RungBadge f rung family x?=70 y?=96 from?={rung the needle rolls from} />   the first 2.5 s of every rung scene
//   <RungCard family kicker title t={0..1 over the card} frame rung from? behind?={(frame) => node} ladder? />
//       a full-frame <Stage>: field, `behind` (your set), the YEARS dial rolling `from` → `rung`, the rail ticks
//       (14 px/f), the HUD ladder with the rung glowing, then the type on ChapterCard's in/out curve (text rises 24 px).
import React from "react";
import { Family, IF2, Kicker, Sky, Stage, Vignette, alpha, labelCase, rnd } from "../../lib/illustrated";
import { L17_COLORS, STAR_TINTS } from "./families";
import { assertAllowed } from "./data17";
import { Stamp17, type StampKind } from "./stamps17";

const C = L17_COLORS;
const cl01 = (v: number) => Math.max(0, Math.min(1, v));
const sm = (t: number, a = 0, b = 1) => {
  const u = cl01((t - a) / (b - a));
  return u * u * (3 - 2 * u);
};

export const RUNGS = [
  { label: "DAY", word: "ONE DAY" },
  { label: "WEEK", word: "ONE WEEK" },
  { label: "YEAR", word: "ONE YEAR" },
  { label: "TEN YEARS", word: "TEN YEARS" },
  { label: "A HUNDRED", word: "A HUNDRED YEARS" },
  { label: "A THOUSAND", word: "A THOUSAND YEARS" },
  { label: "TEN THOUSAND", word: "TEN THOUSAND YEARS" },
  { label: "A HUNDRED THOUSAND", word: "A HUNDRED THOUSAND YEARS" },
  { label: "A MILLION", word: "ONE MILLION YEARS" },
] as const;
export const rungValue = (i: number) => cl01(i / (RUNGS.length - 1));
const nearestRung = (v: number) => Math.round(cl01(v) * (RUNGS.length - 1));

// ---------------------------------------------------------------------------------------------------------------
// YearsDial
// ---------------------------------------------------------------------------------------------------------------
const SWEEP = 240;
const A0 = 90 + (360 - SWEEP) / 2; // bottom-left, screen-clockwise
export const YearsDial: React.FC<{
  x: number;
  y: number;
  r?: number;
  value: number;
  word?: string;
  family: Family;
  f: number;
  rattle?: number;
  plate?: "dark" | "light";
  title?: string;
}> = ({ x, y, r = 150, value, word, family: F, f, rattle = 0, plate = F.dark ? "dark" : "light", title = "YEARS" }) => {
  const shown = labelCase(word ?? RUNGS[nearestRung(value)].word);
  assertAllowed(shown, "YearsDial word");
  const jit = rattle * (Math.sin(f * 2.3) * 2.6 + Math.sin(f * 5.1) * 1.2);
  const v = cl01(value);
  const ang = A0 + v * SWEEP + jit;
  const pt = (deg: number, rr: number): [number, number] => [x + Math.cos((deg * Math.PI) / 180) * rr, y + Math.sin((deg * Math.PI) / 180) * rr];
  const face = plate === "dark" ? "#0B2530" : C.paper;
  const ink = plate === "dark" ? "#FFF4E0" : C.ink;
  const dimInk = plate === "dark" ? "#9FC8C6" : "#4F6E7A";
  const [nx, ny] = pt(ang, r * 0.8);
  const [tx, ty] = pt(ang + 180, r * 0.16);
  const arc = (d0: number, d1: number, rr: number) => {
    const [ax, ay] = pt(d0, rr);
    const [bx, by] = pt(d1, rr);
    return `M${ax.toFixed(1)} ${ay.toFixed(1)} A${rr} ${rr} 0 ${d1 - d0 > 180 ? 1 : 0} 1 ${bx.toFixed(1)} ${by.toFixed(1)}`;
  };
  const ww = Math.max(r * 0.9, shown.length * r * 0.075 + r * 0.2);
  return (
    <g>
      {/* plate: drop shadow, saffron bezel with a lit edge, face */}
      <circle cx={x + r * 0.04} cy={y + r * 0.07} r={r * 1.1} fill="#020B10" opacity={0.35} />
      <circle cx={x} cy={y} r={r * 1.1} fill={C.saffronDeep} />
      <circle cx={x} cy={y} r={r * 1.06} fill={C.saffron} />
      <path d={arc(190, 300, r * 1.075)} fill="none" stroke="#FFF2C8" strokeWidth={r * 0.03} strokeLinecap="round" opacity={0.8} />
      <circle cx={x} cy={y} r={r * 0.98} fill={face} />
      {/* the travelled arc (bone) and the rung sectors */}
      <path d={arc(A0, A0 + SWEEP, r * 0.86)} fill="none" stroke={alpha(ink, 0.18)} strokeWidth={r * 0.07} strokeLinecap="round" />
      <path d={arc(A0, Math.max(A0 + 0.5, A0 + v * SWEEP), r * 0.86)} fill="none" stroke={alpha(C.amber, 0.8)} strokeWidth={r * 0.07} strokeLinecap="round" />
      {RUNGS.map((_, i) => {
        const d = A0 + rungValue(i) * SWEEP;
        const [ax, ay] = pt(d, r * 0.7);
        const [bx, by] = pt(d, r * 0.95);
        return <line key={i} x1={ax} y1={ay} x2={bx} y2={by} stroke={ink} strokeWidth={i === 0 || i === 8 ? r * 0.035 : r * 0.022} strokeLinecap="round" opacity={0.85} />;
      })}
      {Array.from({ length: 33 }, (_, k) => {
        const d = A0 + (k / 32) * SWEEP;
        const [ax, ay] = pt(d, r * 0.8);
        const [bx, by] = pt(d, r * 0.88);
        return <line key={k} x1={ax} y1={ay} x2={bx} y2={by} stroke={dimInk} strokeWidth={r * 0.01} opacity={0.6} />;
      })}
      {/* saffron end-stops */}
      {[A0 - 7, A0 + SWEEP + 7].map((d, i) => {
        const [sx, sy] = pt(d, r * 0.86);
        return <circle key={i} cx={sx} cy={sy} r={r * 0.065} fill={C.saffron} stroke={C.saffronDeep} strokeWidth={r * 0.015} />;
      })}
      {/* end labels: words, no numerals */}
      {(() => {
        const [lx, ly] = pt(A0 - 6, r * 0.55);
        const [mx, my] = pt(A0 + SWEEP + 6, r * 0.55);
        const st: React.CSSProperties = { fontFamily: IF2.label, fontSize: r * 0.1, letterSpacing: r * 0.012, fill: dimInk };
        return (
          <g>
            <text x={lx} y={ly + r * 0.04} textAnchor="middle" style={st}>
              DAY
            </text>
            <text x={mx} y={my + r * 0.04} textAnchor="middle" style={st}>
              MILLION
            </text>
          </g>
        );
      })()}
      <text x={x} y={y - r * 0.36} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: r * 0.13, letterSpacing: r * 0.04, fill: dimInk }}>
        {title}
      </text>
      {/* word window */}
      <rect x={x - ww / 2} y={y + r * 0.34} width={ww} height={r * 0.26} rx={r * 0.06} fill={plate === "dark" ? "#020B10" : "#E9DCC4"} stroke={alpha(ink, 0.3)} strokeWidth={1.5} />
      <text x={x} y={y + r * 0.52} textAnchor="middle" style={{ fontFamily: IF2.label, fontSize: r * 0.15, letterSpacing: r * 0.012, fill: plate === "dark" ? C.amber : C.ink }}>
        {shown}
      </text>
      {/* needle: vermilion with a short tail, hub */}
      <line x1={tx} y1={ty} x2={nx} y2={ny} stroke="#020B10" strokeWidth={r * 0.06} strokeLinecap="round" opacity={0.3} transform={`translate(${r * 0.02} ${r * 0.03})`} />
      <line x1={tx} y1={ty} x2={nx} y2={ny} stroke={C.vermilion} strokeWidth={r * 0.045} strokeLinecap="round" />
      <circle cx={x} cy={y} r={r * 0.085} fill={C.vermilion} />
      <circle cx={x - r * 0.02} cy={y - r * 0.02} r={r * 0.03} fill="#FFE2D6" />
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// TimeLadder
// ---------------------------------------------------------------------------------------------------------------
export type LadderStamp = { rung: number; kind: StampKind; age?: number; ghost?: boolean };
export const TimeLadder: React.FC<{
  x?: number;
  y0?: number;
  y1?: number;
  f: number;
  family: Family;
  draw?: number;
  lit?: number;
  glow?: number;
  stamps?: LadderStamp[];
  labels?: "left" | "right" | "none";
  width?: number;
  size?: number;
  scroll?: number;
}> = ({ x = 1820, y0 = 70, y1 = 1010, f, family: F, draw = 1, lit = 0, glow, stamps = [], labels = "left", width = 70, size = 1, scroll = 0 }) => {
  const n = RUNGS.length;
  const gap = (y1 - y0) / (n - 1 + 0.6);
  const ry = (i: number) => y1 - gap * 0.3 - i * gap; // rung 0 (DAY) at the bottom
  const d = cl01(draw);
  const headY = y1 - (y1 - y0) * d;
  const rail = F.dark ? "#E8F2EE" : C.ink;
  const railDim = F.dark ? alpha("#E8F2EE", 0.35) : alpha(C.ink, 0.35);
  const fs = 17 * size;
  return (
    <g transform={`translate(0 ${-scroll})`}>
      {/* the rails: a faint full-length guide, the solid part drawn up to the head */}
      {[-width / 2, width / 2].map((dx, k) => (
        <g key={k}>
          <line x1={x + dx} y1={y0} x2={x + dx} y2={y1} stroke={railDim} strokeWidth={2} strokeDasharray="4 8" opacity={d < 1 ? 1 : 0} />
          <line x1={x + dx} y1={y1} x2={x + dx} y2={headY} stroke={rail} strokeWidth={5 * Math.max(1, size * 0.8)} strokeLinecap="round" />
        </g>
      ))}
      {RUNGS.map((r, i) => {
        const y = ry(i);
        if (y < headY - 1) return null;
        const litK = cl01(lit - i);
        const pulse = glow === i ? 0.5 + 0.5 * Math.sin(f / 5) : 0;
        const g = Math.max(litK, pulse);
        const lx = labels === "left" ? x - width / 2 - 16 : x + width / 2 + 16;
        return (
          <g key={i}>
            {g > 0 ? <line x1={x - width / 2} y1={y} x2={x + width / 2} y2={y} stroke={C.vermilion} strokeWidth={22 * size} strokeLinecap="round" opacity={0.28 * g} /> : null}
            <line x1={x - width / 2} y1={y} x2={x + width / 2} y2={y} stroke={g > 0.5 ? C.vermilion : rail} strokeWidth={6 * Math.max(1, size * 0.8)} strokeLinecap="round" />
            {g > 0 ? <circle cx={x} cy={y} r={(5 + 4 * g) * size} fill="#FFE2D6" opacity={g} /> : null}
            {labels !== "none" ? (
              <text
                x={lx}
                y={y + fs * 0.36}
                textAnchor={labels === "left" ? "end" : "start"}
                style={{ fontFamily: IF2.label, fontSize: fs, letterSpacing: fs * 0.12, fill: g > 0.5 ? (F.dark ? C.saffronCore : C.ink) : F.dark ? alpha("#E8F2EE", 0.85) : alpha(C.ink, 0.8) }}
              >
                {r.label}
              </text>
            ) : null}
          </g>
        );
      })}
      {d > 0 && d < 1 ? (
        <g>
          <circle cx={x - width / 2} cy={headY} r={9} fill={C.saffronCore} />
          <circle cx={x + width / 2} cy={headY} r={9} fill={C.saffronCore} />
          <circle cx={x - width / 2} cy={headY} r={20} fill={C.saffron} opacity={0.3} />
          <circle cx={x + width / 2} cy={headY} r={20} fill={C.saffron} opacity={0.3} />
        </g>
      ) : null}
      {stamps.map((s, k) => {
        const y = ry(s.rung);
        if (y < headY - 1) return null;
        const ss = 64 * size;
        const sx = labels === "left" ? x + width / 2 + ss * (s.kind === "seen" || s.kind === "model" ? 0.75 : 1.5) : x - width / 2 - ss * 1.4;
        return <Stamp17 key={k} x={sx} y={y} kind={s.kind} age={s.age} ghost={s.ghost} f={f} size={ss} rotate={-6} />;
      })}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// RungBadge: a compact dial + kicker for the first 2.5 s of a rung scene
// ---------------------------------------------------------------------------------------------------------------
export const RungBadge: React.FC<{ f: number; rung: number; family: Family; x?: number; y?: number; from?: number }> = ({ f, rung, family: F, x = 70, y = 96, from }) => {
  if (f > 78) return null;
  const a = sm(f, 0, 8) * (1 - sm(f, 64, 76));
  const v0 = rungValue(from ?? Math.max(0, rung - 1));
  const v = v0 + (rungValue(rung) - v0) * sm(f, 4, 26);
  const r = 46;
  return (
    <g opacity={a} transform={`translate(0 ${((1 - sm(f, 0, 8)) * -12).toFixed(1)})`}>
      <YearsDial x={x + r} y={y} r={r} value={v} family={F} f={f} title="" word={RUNGS[rung].label} />
      <Kicker x={x + r * 2 + 30} y={y + 9} text={RUNGS[rung].word} color={F.text} size={26} />
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// RungCard: the full-frame card (C-12, 5-09, 8-08)
// ---------------------------------------------------------------------------------------------------------------
/** Rail ticks scrolling along the card's floor line (the camera's rail; 14 px/f by default). */
export const RailTicks: React.FC<{ f: number; y: number; x0?: number; x1?: number; speed?: number; color: string; gap?: number }> = ({ f, y, x0 = -40, x1 = 1960, speed = 14, color, gap = 60 }) => {
  const off = (f * speed) % gap;
  const n = Math.ceil((x1 - x0) / gap) + 1;
  return (
    <g>
      <line x1={x0} y1={y} x2={x1} y2={y} stroke={color} strokeWidth={4} opacity={0.75} />
      {Array.from({ length: n }, (_, i) => {
        const tx = x0 + i * gap - off;
        const big = (i + Math.floor((f * speed) / gap)) % 5 === 0;
        return <line key={i} x1={tx} y1={y} x2={tx} y2={y + (big ? 26 : 14)} stroke={color} strokeWidth={big ? 4 : 2.5} opacity={0.75} />;
      })}
    </g>
  );
};

const TintStars: React.FC<{ f: number; n?: number; seed?: number }> = ({ f, n = 90, seed = 5 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const tw = 0.45 + 0.55 * Math.abs(Math.sin(f / (9 + (i % 7) * 3) + i));
      return <circle key={i} cx={rnd(seed * 13 + i) * 1920} cy={rnd(seed * 29 + i) * 820} r={1 + (i % 3) * 0.7} fill={STAR_TINTS[i % STAR_TINTS.length]} opacity={tw} />;
    })}
  </g>
);

export const RungCard: React.FC<{
  family: Family;
  kicker?: string;
  title: string;
  t: number;
  frame: number;
  rung: number;
  from?: number;
  behind?: (frame: number) => React.ReactNode;
  ladder?: boolean;
}> = ({ family: F, kicker = "Off the Scale", title, t, frame, rung, from, behind, ladder = true }) => {
  assertAllowed(title, "RungCard title");
  const inA = sm(t, 0, 0.18);
  const outA = 1 - sm(t, 0.85, 1);
  const a = inA * outA;
  const rise = (1 - inA) * 24;
  const v0 = rungValue(from ?? Math.max(0, rung - 1));
  // the needle rolls from `from` to the rung; on the first card (from = rung = DAY) it swings up the dial and back
  const k = sm(t, 0.05, 0.55);
  const swing = v0 === rungValue(rung) ? 0.32 * Math.sin(Math.PI * k) : 0;
  const v = v0 + (rungValue(rung) - v0) * k + swing;
  const ink = F.text;
  // "ONE DAY: THE LIGHTS" breaks after the colon; otherwise wrap at 18 characters
  const lines: string[] = [];
  if (title.includes(": ")) {
    const k = title.indexOf(": ");
    lines.push(title.slice(0, k + 1), title.slice(k + 2));
  } else {
    let cur = "";
    for (const w of title.split(" ")) {
      if ((cur + " " + w).trim().length > 18 && cur) {
        lines.push(cur.trim());
        cur = w;
      } else cur = (cur + " " + w).trim();
    }
    if (cur) lines.push(cur);
  }
  const size = lines.length > 2 ? 84 : 100;
  const y0 = 450 - ((lines.length - 1) * size * 0.98) / 2 + size * 0.35;
  return (
    <Stage theme={F.theme} drift={false} vignette={F.dark ? 0.3 : 0.1} grain={0.4}>
      <Sky family={F} />
      {F.dark ? <TintStars f={frame} /> : null}
      {behind ? behind(frame) : null}
      <Vignette color={F.shadow} strength={F.dark ? 0.3 : 0.12} />
      {/* a soft scrim behind the type so it reads on any set */}
      <g opacity={a}>
        <radialGradient id="l17cardScrim" cx="0.28" cy="0.45" r="0.55">
          <stop offset="0" stopColor={F.shadow} stopOpacity={F.dark ? 0.55 : 0.35} />
          <stop offset="1" stopColor={F.shadow} stopOpacity={0} />
        </radialGradient>
        <rect x={0} y={0} width={1920} height={1080} fill="url(#l17cardScrim)" />
      </g>
      <RailTicks f={frame} y={930} color={F.dark ? "#CFE6E2" : alpha(C.ink, 0.7)} />
      <YearsDial x={1360} y={520} r={210} value={v} family={F} f={frame} plate={F.dark ? "dark" : "light"} word={RUNGS[rung].word} />
      {ladder ? <TimeLadder f={frame} family={F} lit={rung + 0.0001} glow={rung} labels="left" x={1835} /> : null}
      <g opacity={a} transform={`translate(0 ${rise.toFixed(2)})`}>
        <Kicker x={160} y={y0 - size * 1.05} text={kicker} color={F.dim} size={24} />
        {lines.map((l, i) => (
          <text key={i} x={160} y={y0 + i * size * 0.98} style={{ fontFamily: IF2.display, fontWeight: 800, fontSize: size, letterSpacing: -size * 0.03, fill: ink }}>
            {l}
          </text>
        ))}
        <rect x={160} y={y0 + (lines.length - 1) * size * 0.98 + 34} width={60} height={6} rx={3} fill={C.vermilion} />
      </g>
    </Stage>
  );
};
