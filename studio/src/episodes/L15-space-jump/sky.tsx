// L15 vertical sky (BUILD.md §5): the episode's world. Everything is keyed to ALTITUDE, so a shot that moves its camera
// by changing `altTop`/`altBottom` per frame gets the default mover for free: the ruler's ticks, the layer bands and the
// star field all stream past at the camera's px/frame (BUILD §0: 14-28 px/f while climbing or falling).
// USAGE
//   <SkyColumn f altTop altBottom x? y? w? h? bands? aurora? ground? stars? drift? streak? night? />
//       the skyAt() gradient for that span; tinted stars fade in from 25 km (two parallax layers, offset by altitude:
//       they stream when the altitudes move; `drift` px/f adds a constant stream for a locked camera; `streak` px draws
//       them as vertical streaks); `bands` = layer tints at 12/50/85 km; `aurora` = rippling ribbons above 85 km;
//       `ground` = the dune sliver at 0 km (visible when altBottom < ~3 km); `night` darkens the ground for C-01
//   <AltRuler f altTop altBottom x side? y? h? step? flags? pins? band? color? />
//       vertical ruler: ticks + km numbers scroll with the altitudes; `flags` = landmark flags (default FLAGS: 12, 50, 80,
//       85, 100, 400 km; words from the table, numbers only where sourced); `pins` = [{ altKm, label, draw 0..1, len? }]
//       saffron lines drawn across the frame; `band` = { from, to, wipe 0..1, label? } a highlighted altitude span
//   <Limb f cy R? cx? slide?=8 rim? cities? />  the planet's curve: cyan rim over an ember-saffron city-glow band, a
//       surface hatch sliding at `slide` px/f; `cy` = the top of the arc at cx; R ≈ 2600 reads as a horizon from orbit
//   altY(alt, altTop, altBottom, y?, h?) / yAlt(...)  map between altitude and screen y for the same span
import React, { useId } from "react";
import { Bloom, IF2, alpha, labelCase, mixHex, rnd, smoothPath, type Pt } from "../../lib/illustrated";
import { L15_COLORS, LAYER_TOPS, STRATUM, skyStops } from "./families";
import { BOUNDARY, LAYERS, ORBIT } from "./jumpdata";

const C = L15_COLORS;
const sid = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, "");
const cl01 = (v: number) => Math.max(0, Math.min(1, v));
const sm = (t: number) => {
  const u = cl01(t);
  return u * u * (3 - 2 * u);
};

/** Screen y of an altitude for a frame span [altTop at y, altBottom at y + h]. */
export const altY = (alt: number, altTop: number, altBottom: number, y = 0, h = 1080) => y + ((altTop - alt) / (altTop - altBottom)) * h;
/** Altitude at a screen y (inverse of altY). */
export const yAlt = (sy: number, altTop: number, altBottom: number, y = 0, h = 1080) => altTop - ((sy - y) / h) * (altTop - altBottom);

// ---------------------------------------------------------------------------------------------------------------
// SkyColumn
// ---------------------------------------------------------------------------------------------------------------

export type SkyColumnProps = {
  f: number;
  altTop: number;
  altBottom: number;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  /** layer tints (0..1 opacity scale, true = 1) */
  bands?: boolean | number;
  /** aurora ribbons above 85 km (0..1, true = 1) */
  aurora?: boolean | number;
  /** the dune sliver at 0 km */
  ground?: boolean;
  /** star layers (default on) */
  stars?: boolean;
  /** constant star stream px/f (positive = stars move UP, as when falling); added to the altitude-driven offset */
  drift?: number;
  /** star streak length px (0 = dots); use 20-60 while the camera falls fast */
  streak?: number;
  /** pre-dawn: darker ground, an apricot horizon line */
  night?: boolean;
  seed?: number;
};

export const SkyColumn: React.FC<SkyColumnProps> = ({ f, altTop, altBottom, x = 0, y = 0, w = 1920, h = 1080, bands = false, aurora = false, ground = true, stars = true, drift = 0.4, streak = 0, night = false, seed = 5 }) => {
  const id = "skyc" + sid(useId());
  const stops = skyStops(altTop, altBottom);
  const pxPerKm = h / (altTop - altBottom);
  const A = (a: number) => altY(a, altTop, altBottom, y, h);
  const midAlt = (altTop + altBottom) / 2;
  const bandK = bands === true ? 1 : bands === false ? 0 : bands;
  const auroraK = aurora === true ? 1 : aurora === false ? 0 : aurora;
  const starLayer = (depth: number, n: number, size: number, sd: number) => {
    const tile = h + 200;
    const off = midAlt * pxPerKm * depth + f * drift * depth * 2;
    return Array.from({ length: n }, (_, i) => {
      const sx = x + rnd(sd * 7 + i) * w;
      const base = rnd(sd * 11 + i) * tile;
      const sy = y - 100 + ((((base - off) % tile) + tile) % tile);
      const a = yAlt(sy, altTop, altBottom, y, h);
      const vis = sm((a - 25) / 25); // stars fade in from 25 km
      if (vis <= 0.01) return null;
      const col = rnd(sd * 13 + i) > 0.55 ? C.starGold : C.starTeal;
      const r = size * (0.5 + rnd(sd * 3 + i) * 1.1);
      const tw = 0.6 + 0.4 * Math.sin(f / (8 + rnd(sd * 17 + i) * 18) + i);
      return streak > 0 ? (
        <line key={i} x1={sx} y1={sy} x2={sx} y2={sy + streak * depth} stroke={col} strokeWidth={r * 1.3} strokeLinecap="round" opacity={vis * tw} />
      ) : (
        <circle key={i} cx={sx} cy={sy} r={r} fill={col} opacity={vis * tw} />
      );
    });
  };
  const groundY = A(0);
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={x} y={y} width={w} height={h} />
        </clipPath>
        <linearGradient id={id + "g"} x1="0" y1="0" x2="0" y2="1">
          {stops.map((c, i) => (
            <stop key={i} offset={i / (stops.length - 1)} stopColor={c} />
          ))}
        </linearGradient>
      </defs>
      <g clipPath={`url(#${id})`}>
        <rect x={x} y={y} width={w} height={h} fill={`url(#${id}g)`} />
        {bandK > 0
          ? (
              [
                [0, LAYER_TOPS.tropo, STRATUM.tropo, 0.1],
                [LAYER_TOPS.tropo, LAYER_TOPS.strato, STRATUM.strato, 0.14],
                [LAYER_TOPS.strato, LAYER_TOPS.meso, STRATUM.meso, 0.2],
                [LAYER_TOPS.meso, 140, STRATUM.thermo, 0.18],
              ] as [number, number, string, number][]
            ).map(([a0, a1, c, o], i) => {
              const top = A(a1);
              const bot = A(a0);
              if (bot < y || top > y + h) return null;
              return (
                <g key={i}>
                  <rect x={x} y={top} width={w} height={bot - top} fill={c} opacity={o * bandK} />
                  <line x1={x} y1={top} x2={x + w} y2={top} stroke={mixHex(c, "#FFFFFF", 0.35)} strokeWidth={2} opacity={0.55 * bandK} strokeDasharray="14 10" strokeDashoffset={-f * 2} />
                </g>
              );
            })
          : null}
        {stars ? (
          <g>
            {starLayer(0.35, 70, 1.4, seed)}
            {starLayer(0.7, 40, 2.2, seed + 9)}
          </g>
        ) : null}
        {auroraK > 0 ? <Aurora f={f} x={x} w={w} yTop={A(118)} yBot={A(92)} k={auroraK} /> : null}
        {ground && groundY < y + h + 40 ? <Ground f={f} x={x} w={w} y={groundY} bottom={y + h} night={night} pxPerKm={pxPerKm} /> : null}
      </g>
    </g>
  );
};

/** Aurora ribbons (above 85 km): teal curtains rippling at ~5 px/f with one thin vermilion thread (F11 allows it). */
const Aurora: React.FC<{ f: number; x: number; w: number; yTop: number; yBot: number; k: number }> = ({ f, x, w, yTop, yBot, k }) => {
  const ribbons = [
    { c: C.teal, o: 0.42, ph: 0, amp: 1 },
    { c: C.limb, o: 0.3, ph: 2.1, amp: 0.8 },
    { c: C.vermilion, o: 0.5, ph: 4.2, amp: 0.6, thin: true },
  ];
  const hh = yBot - yTop;
  return (
    <g opacity={k}>
      {ribbons.map((r, j) => {
        const pts: Pt[] = [];
        for (let i = 0; i <= 18; i++) {
          const px = x + (w * i) / 18;
          pts.push([px, yTop + hh * (0.45 + 0.12 * j) + Math.sin(px / 170 + f / 6 + r.ph) * 26 * r.amp + Math.sin(px / 61 - f / 4 + r.ph) * 9]);
        }
        const d = smoothPath(pts, 0.5);
        return r.thin ? (
          <path key={j} d={d} fill="none" stroke={r.c} strokeWidth={3} opacity={r.o} />
        ) : (
          <g key={j}>
            <path d={d} fill="none" stroke={r.c} strokeWidth={hh * 0.38} opacity={r.o * 0.35} strokeLinecap="round" />
            <path d={d} fill="none" stroke={r.c} strokeWidth={hh * 0.12} opacity={r.o} strokeLinecap="round" />
          </g>
        );
      })}
    </g>
  );
};

/** The ground sliver at 0 km: three dune ridges with a slow sideways hatch; apricot horizon line at night. */
const Ground: React.FC<{ f: number; x: number; w: number; y: number; bottom: number; night: boolean; pxPerKm: number }> = ({ f, x, w, y, bottom, night, pxPerKm }) => {
  const dk = night ? 0.55 : 0;
  const cols = [C.dune1, C.dune2, C.dune3].map((c) => mixHex(c, "#1A1030", dk));
  const depth = Math.max(60, Math.min(420, pxPerKm * 0.6));
  const ridge = (yy: number, amp: number, wl: number, ph: number) => {
    const pts: Pt[] = [];
    for (let i = 0; i <= 16; i++) {
      const px = x - 40 + ((w + 80) * i) / 16;
      pts.push([px, yy + Math.sin(px / wl + ph) * amp + Math.sin(px / (wl * 0.43) + ph * 2) * amp * 0.35]);
    }
    return smoothPath(pts, 0.5) + ` L${x + w + 40} ${bottom + 400} L${x - 40} ${bottom + 400} Z`;
  };
  return (
    <g>
      {night ? <rect x={x} y={y - 26} width={w} height={26} fill={C.cityGlow} opacity={0.55} /> : <rect x={x} y={y - 30} width={w} height={30} fill={C.cloud} opacity={0.35} />}
      <path d={ridge(y, 10, 260, 0.4)} fill={cols[0]} />
      <path d={ridge(y + depth * 0.28, 14, 200, 1.7)} fill={cols[1]} />
      <path d={ridge(y + depth * 0.6, 18, 150, 3.1)} fill={cols[2]} />
      {Array.from({ length: 10 }, (_, i) => {
        const span = w + 300;
        const hx = x - 150 + ((((rnd(i * 7) * span + f * 1.2) % span) + span) % span);
        const hy = y + depth * (0.12 + 0.75 * rnd(i * 3));
        return <path key={i} d={`M${hx} ${hy} q 30 -6 60 0`} stroke={mixHex(cols[1], "#FFFFFF", 0.25)} strokeWidth={3} fill="none" opacity={0.5} />;
      })}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// AltRuler
// ---------------------------------------------------------------------------------------------------------------

export type RulerFlag = { altKm: number; label: string; /** number shown beside the word (only sourced values) */ value?: string; color?: string };
/** Landmark flags. Numbers only where sources.md has them (12 km = troposphere: word only, row 10 F3). */
export const FLAGS: RulerFlag[] = [
  { altKm: LAYER_TOPS.tropo, label: "troposphere", color: STRATUM.tropo },
  { altKm: LAYERS.stratoTop, label: "stratosphere", value: `${LAYERS.stratoTop} km`, color: STRATUM.strato }, // #10
  { altKm: BOUNDARY.mcdowell, label: "50 miles", value: `${BOUNDARY.mcdowell} km`, color: C.saffron }, // #1-3
  { altKm: LAYERS.mesoTop, label: "mesosphere", value: `${LAYERS.mesoTop} km`, color: STRATUM.meso }, // #10
  { altKm: BOUNDARY.fai, label: "Kármán line", value: `${BOUNDARY.fai} km`, color: C.saffron }, // #1
  { altKm: ORBIT.drawKm, label: "space station", color: C.limb }, // #16 (shown as a range in scene text: 370-460 km)
];

export type RulerPin = { altKm: number; label: string; draw: number; len?: number; color?: string };

export const AltRuler: React.FC<{
  f: number;
  altTop: number;
  altBottom: number;
  /** screen x of the ruler spine */
  x: number;
  side?: "left" | "right";
  y?: number;
  h?: number;
  /** km between labelled ticks (default: picked from the span) */
  step?: number;
  flags?: boolean | RulerFlag[];
  pins?: RulerPin[];
  band?: { from: number; to: number; wipe: number; label?: string; color?: string };
  color?: string;
  /** km numbers on the labelled ticks (default on) */
  numbers?: boolean;
}> = ({ f, altTop, altBottom, x, side = "left", y = 0, h = 1080, step, flags = true, pins = [], band, color = C.bone, numbers = true }) => {
  const span = altTop - altBottom;
  const st = step ?? ([1, 2, 5, 10, 20, 50, 100].find((s) => span / s <= 8) ?? 100);
  const minor = st / 5;
  const A = (a: number) => altY(a, altTop, altBottom, y, h);
  const dir = side === "left" ? 1 : -1; // ticks point into the frame
  const k0 = Math.ceil(altBottom / minor);
  const k1 = Math.floor(altTop / minor);
  const flagList = flags === true ? FLAGS : flags === false ? [] : flags;
  const flagYs = flagList.map((fl) => A(fl.altKm));
  const ticks: React.ReactNode[] = [];
  for (let k = Math.max(0, k0); k <= k1; k++) {
    const a = +(k * minor).toFixed(4);
    const ty = A(a);
    const major = Math.abs(a / st - Math.round(a / st)) < 1e-6;
    ticks.push(<line key={k} x1={x} y1={ty} x2={x + dir * (major ? 34 : 16)} y2={ty} stroke={color} strokeWidth={major ? 4 : 2.5} opacity={major ? 1 : 0.7} />);
    if (major && numbers && !flagYs.some((fy) => Math.abs(fy - ty) < 26))
      ticks.push(
        <text key={"t" + k} x={x + dir * 44} y={ty + 8} textAnchor={side === "left" ? "start" : "end"} style={{ fontFamily: IF2.num, fontWeight: 700, fontSize: 22, fill: color, fontVariantNumeric: "tabular-nums" }}>
          {Math.round(a).toLocaleString("en-US")}
          <tspan style={{ fontSize: 15, fontWeight: 500 }}> km</tspan>
        </text>,
      );
  }
  return (
    <g>
      {band ? (() => {
        const top = A(band.to);
        const bot = A(band.from);
        const wy = bot - (bot - top) * sm(band.wipe);
        const bc = band.color ?? C.saffron;
        return (
          <g>
            <rect x={side === "left" ? x - 30 : x} y={wy} width={30} height={bot - wy} fill={bc} opacity={0.85} />
            <rect x={side === "left" ? x : x - 600} y={wy} width={600} height={bot - wy} fill={bc} opacity={0.12} />
            {band.label && band.wipe > 0.5 ? (
              <text x={x - dir * 40} y={(top + bot) / 2} textAnchor={side === "left" ? "end" : "start"} opacity={sm((band.wipe - 0.5) / 0.5)} style={{ fontFamily: IF2.label, fontSize: 22, letterSpacing: 3, fill: bc }}>
                {labelCase(band.label)}
              </text>
            ) : null}
          </g>
        );
      })() : null}
      <line x1={x} y1={y - 20} x2={x} y2={y + h + 20} stroke={color} strokeWidth={5} strokeLinecap="round" />
      {ticks}
      {flagList.map((fl, i) => {
        const fy = A(fl.altKm);
        if (fy < y - 40 || fy > y + h + 40) return null;
        const fc = fl.color ?? C.saffron;
        const wave = Math.sin(f / 7 + i) * 4;
        const fx = x + dir * 10;
        const label = labelCase(fl.label);
        const w = label.length * 12 + 40 + (fl.value ? fl.value.length * 13 + 14 : 0);
        const x0 = side === "left" ? fx + 60 : fx - 60 - w;
        return (
          <g key={i}>
            <line x1={x} y1={fy} x2={fx + dir * 60} y2={fy} stroke={fc} strokeWidth={4} />
            <path d={`M${x0} ${fy - 17} L${x0 + w} ${fy - 17 + wave * 0.4} L${x0 + w - dir * 0} ${fy + 17 + wave * 0.4} L${x0} ${fy + 17} Z`} fill={alpha("#04121A", 0.7)} stroke={fc} strokeWidth={2} />
            <circle cx={x0 + 16} cy={fy} r={6} fill={fc} />
            <text x={x0 + 30} y={fy + 7} style={{ fontFamily: IF2.label, fontSize: 19, letterSpacing: 2, fill: "#F2FBF7" }}>
              {label}
              {fl.value ? (
                <tspan dx={10} style={{ fontFamily: IF2.num, fontWeight: 800, fill: mixHex(fc, "#FFFFFF", 0.35) }}>
                  {fl.value}
                </tspan>
              ) : null}
            </text>
          </g>
        );
      })}
      {pins.map((p, i) => {
        const py = A(p.altKm);
        const L = (p.len ?? 900) * sm(p.draw);
        const pc = p.color ?? C.saffron;
        const ex = x + dir * L;
        return (
          <g key={"p" + i}>
            <line x1={x} y1={py} x2={ex} y2={py} stroke={pc} strokeWidth={5} strokeLinecap="round" />
            {p.draw > 0 && p.draw < 1 ? <Bloom x={ex} y={py} r={34} color={C.saffronCore} strength={0.8} /> : null}
            {p.draw > 0 && p.draw < 1 ? <circle cx={ex} cy={py} r={8} fill={C.saffronCore} /> : null}
            {p.draw > 0.3 ? (
              <text x={x + dir * 46} y={py - 14} textAnchor={side === "left" ? "start" : "end"} opacity={sm((p.draw - 0.3) / 0.3)} style={{ fontFamily: IF2.label, fontSize: 22, letterSpacing: 3, fill: pc }}>
                {labelCase(p.label)}
              </text>
            ) : null}
          </g>
        );
      })}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Limb
// ---------------------------------------------------------------------------------------------------------------

export const Limb: React.FC<{ f: number; cy: number; R?: number; cx?: number; slide?: number; rim?: number; cities?: boolean; w?: number }> = ({
  f,
  cy,
  R = 2600,
  cx = 960,
  slide = 8,
  rim = 1,
  cities = true,
  w = 1920,
}) => {
  const id = "limb" + sid(useId());
  const ccy = cy + R; // planet centre
  // surface hatch: short arcs following the curve, sliding sideways at `slide` px/f
  const hatch: React.ReactNode[] = [];
  const spanX = w + 600;
  for (let i = 0; i < 26; i++) {
    const hx = cx - spanX / 2 + ((((rnd(i * 7 + 1) * spanX + f * slide) % spanX) + spanX) % spanX);
    const dx = hx - cx;
    const top = ccy - Math.sqrt(Math.max(0, R * R - dx * dx));
    const dd = 20 + rnd(i * 3) * 160;
    const hy = top + dd;
    const len = 80 + rnd(i * 5) * 140;
    hatch.push(<path key={i} d={`M${hx - len / 2} ${hy + (len * len) / (8 * R)} Q ${hx} ${hy - (len * len) / (8 * R)} ${hx + len / 2} ${hy + (len * len) / (8 * R)}`} stroke={mixHex(C.planet, C.limb, 0.35)} strokeWidth={4} fill="none" opacity={0.6} />);
  }
  const lights: React.ReactNode[] = [];
  if (cities)
    for (let i = 0; i < 40; i++) {
      const hx = cx - spanX / 2 + ((((rnd(i * 11 + 4) * spanX + f * slide) % spanX) + spanX) % spanX);
      const dx = hx - cx;
      const top = ccy - Math.sqrt(Math.max(0, R * R - dx * dx));
      const hy = top + 24 + rnd(i * 13) * 70;
      const tw = 0.6 + 0.4 * Math.sin(f / 5 + i * 1.7);
      lights.push(<circle key={i} cx={hx} cy={hy} r={2 + rnd(i * 17) * 2.5} fill={rnd(i) > 0.4 ? C.cityGlow : C.saffronCore} opacity={tw} />);
    }
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <circle cx={cx} cy={ccy} r={R} />
        </clipPath>
        <radialGradient id={id + "g"} cx={cx} cy={ccy} r={R} gradientUnits="userSpaceOnUse">
          <stop offset={0.9} stopColor={C.planetDeep} />
          <stop offset={0.975} stopColor={C.planet} />
          <stop offset={0.993} stopColor={mixHex(C.cityGlow, C.planet, 0.35)} />
          <stop offset={1} stopColor={C.cityGlow} />
        </radialGradient>
      </defs>
      {/* the atmosphere's glow above the rim */}
      <circle cx={cx} cy={ccy} r={R + 26} fill="none" stroke={C.limb} strokeWidth={50} opacity={0.12 * rim} />
      <circle cx={cx} cy={ccy} r={R + 8} fill="none" stroke={C.limb} strokeWidth={14} opacity={0.3 * rim} />
      <circle cx={cx} cy={ccy} r={R} fill={`url(#${id}g)`} />
      <g clipPath={`url(#${id})`}>
        {hatch}
        {lights}
      </g>
      <circle cx={cx} cy={ccy} r={R} fill="none" stroke={C.limb} strokeWidth={5} opacity={rim} />
    </g>
  );
};
