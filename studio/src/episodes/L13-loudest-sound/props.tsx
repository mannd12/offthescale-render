// L13 shared props (BUILD.md §5). Shared props are allowed; the shots that use them stay bespoke (hard rule 1). Each
// package polishes the props in its column of BUILD.md §6; signatures are stable (ask before changing one).
// No numbers are drawn here. Maps and globe land are SCHEMATIC (F16): hand-placed outlines from lon/lat, not a dataset.
// Kit pieces to reuse rather than redraw: Plume (the Hunga / Krakatoa column), Cumulus, CloudRack, Tick.
import React, { useId } from "react";
import { Emissive, Family, Form, Hatch, Pill, Tick, TickProps, alpha, mixHex, rnd, roundPoly } from "../../lib/illustrated";
import { L13_COLORS, pillFill } from "./families";
import { SITES } from "./sound";

type Pt = [number, number];
const D2R = Math.PI / 180;
const poly = (pts: Pt[]) => "M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L") + " Z";

// ---------------------------------------------------------------------------------------------------------------
// Survey map
// ---------------------------------------------------------------------------------------------------------------

export type MapView = "sunda" | "indian" | "pacific";
export type MapBox = { x: number; y: number; w: number; h: number };
/** lon/lat window of each view (equirectangular; Pacific longitudes run past 180 so the date line is not a seam) */
const VIEWS: Record<MapView, { lon0: number; lon1: number; lat0: number; lat1: number }> = {
  sunda: { lon0: 101, lon1: 110, lat0: -8.6, lat1: -1.2 },
  indian: { lon0: 38, lon1: 128, lat0: -42, lat1: 26 },
  pacific: { lon0: 150, lon1: 250, lat0: -48, lat1: 72 },
};
const LAND_BY_VIEW: Record<MapView, Pt[][]> = {
  sunda: [
    // southern Sumatra
    [[100.5, -1], [103.8, -1], [104.7, -2.3], [106, -3], [105.8, -4.5], [105.9, -5.8], [105.2, -5.9], [104.5, -5.9], [103.4, -4.8], [102.2, -3.9], [101.2, -2.8], [100.5, -1.6]],
    // western Java
    [[105.2, -6.75], [105.6, -6], [106.1, -5.95], [106.8, -6.05], [108.3, -6.3], [110.5, -6.9], [110.6, -7.9], [108.8, -7.8], [107.3, -7.5], [106.4, -7.4], [105.5, -7]],
  ],
  indian: [
    [[36, 26], [38, 22], [42, 15], [43.5, 12], [51.2, 11.8], [51, 10.4], [48, 5], [42, -1], [40, -5], [39.5, -10], [40.5, -15], [37, -18], [35.5, -23], [33, -26], [30, -31], [30, 26]],
    [[49.3, -12], [50.5, -15.5], [49.5, -18], [47.5, -25], [45, -25.3], [43.5, -22], [44.5, -16.5], [47, -14.5]],
    [[36, 26], [56, 26], [57, 24], [59.5, 22.5], [57, 19], [52, 16], [45, 12.7], [43, 13], [39, 21]],
    [[62, 26], [68, 24], [70, 21], [72.8, 19], [74, 15], [76.5, 8.5], [77.5, 8.1], [80.2, 13], [80.3, 15.8], [82.5, 17], [87, 21.5], [92, 22], [92, 26]],
    [[79.8, 9.8], [81.2, 8.5], [81.9, 7.2], [81.6, 6.3], [80.6, 5.9], [79.8, 7]],
    [[92, 26], [92, 21], [94.4, 16], [97.7, 16.5], [98.5, 10], [100, 7], [100.6, 3], [103.4, 1.3], [104.2, 1.5], [103.5, 4], [102.3, 6.2], [100.8, 13.5], [105, 10], [109, 12], [109, 16], [108, 21.5], [110, 26]],
    [[95.3, 5.6], [97.5, 5.2], [100.4, 2.3], [103.8, -1], [106, -3], [105.9, -5.8], [104.5, -5.9], [102.2, -3.9], [100.5, -1.6], [98.7, 1.6], [95.5, 4.5]],
    [[105.2, -6.75], [106.1, -5.95], [108.3, -6.3], [110.5, -6.9], [112.6, -6.9], [114.5, -7.8], [114.4, -8.7], [111, -8.2], [108, -7.8], [105.5, -7]],
    [[109, 1.5], [109.6, -1], [110.2, -2.9], [114.5, -4], [116.2, -3.5], [116.8, -1], [118.9, 1], [117.8, 4.5], [119.2, 5.3], [117, 7], [115.5, 5], [113, 3.2], [111, 1.8]],
    [[119.5, -5.6], [120.5, -2.8], [119, -1], [119.8, 1], [124, 1], [121, 0.5], [122.3, -1], [121, -2], [122.5, -4.5], [121, -4.8]],
    [[113.5, -22], [114.2, -26], [115, -34], [117.5, -35], [123.5, -34], [130, -32], [130, -12], [126, -14], [123, -16.5], [121, -19.5], [117, -20.7]],
  ],
  pacific: [
    [[150, -20], [153.5, -25], [153, -31], [151, -34], [150, -37]],
    [[172.7, -34.4], [174.8, -36.8], [178.5, -37.7], [176.9, -39.6], [175, -41.6], [174.6, -39.8], [173.8, -39.2]],
    [[172.7, -40.5], [174.2, -41.7], [171.2, -44.4], [169, -46.6], [166.5, -46], [168.3, -44], [172.1, -41]],
    [[192, 65.5], [194, 66.5], [197, 68.9], [204, 71.3], [219, 69.6], [250, 69.5], [250, 24], [247.5, 23], [245.8, 27.7], [245, 31], [242.7, 32.6], [239.5, 35], [237.5, 38], [235.7, 40.4], [235.6, 43], [235.8, 46], [236.5, 48.4], [235.5, 50.6], [232, 54.5], [226, 57.5], [220.5, 59.8], [213, 60.5], [208.5, 59], [202.5, 57.5], [196, 55], [198, 58.5], [197.5, 60.5], [194.5, 61.8], [194.5, 64]],
    [[150, 59], [155, 59.5], [163, 60], [170, 60], [177, 62.5], [180, 65], [190, 65.8], [190, 67], [180, 69], [170, 70], [160, 69.5], [150, 71]],
    [[204, 20.2], [205.2, 19.6], [204.9, 18.9], [204.1, 19.3]],
  ],
};

/** Screen position of a lon/lat inside a map box. */
export const mapXY = (view: MapView, box: MapBox, lon: number, lat: number): Pt => {
  const v = VIEWS[view];
  const lo = view === "pacific" && lon < 0 ? lon + 360 : lon;
  return [box.x + ((lo - v.lon0) / (v.lon1 - v.lon0)) * box.w, box.y + ((v.lat1 - lat) / (v.lat1 - v.lat0)) * box.h];
};
/** Screen position of a named site (sound.tsx SITES: krakatoa, batavia, rodriguez, perth, ceylon, tonga, alaska). */
export const mapPoint = (view: MapView, box: MapBox, site: keyof typeof SITES): Pt => mapXY(view, box, SITES[site].lon, SITES[site].lat);

export const SurveyMap: React.FC<MapBox & { view: MapView; family?: Family; frame?: number; schematic?: boolean; sea?: string; land?: string; hatch?: boolean; desaturate?: number; children?: React.ReactNode }> = ({
  view,
  x,
  y,
  w,
  h,
  family,
  frame = 0,
  schematic = true,
  sea = L13_COLORS.sea,
  land = L13_COLORS.land,
  hatch = true,
  desaturate = 0,
  children,
}) => {
  const id = "map" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const box = { x, y, w, h };
  const grey = (c: string) => (desaturate > 0 ? mixHex(c, "#9AA3A4", desaturate) : c);
  const shapes = LAND_BY_VIEW[view].map((pts) => pts.map(([lo, la]) => mapXY(view, box, lo, la)));
  const shade = mixHex(land, "#5A3412", 0.35);
  const k = mapXY(view, box, SITES.krakatoa.lon, SITES.krakatoa.lat);
  const cone = view === "sunda" ? Math.max(10, w * 0.018) : 0;
  return (
    <g>
      <defs>
        <clipPath id={`${id}c`}>
          <rect x={x} y={y} width={w} height={h} />
        </clipPath>
      </defs>
      <Hatch id={`${id}h`} color={alpha("#FFFFFF", 0.28)} gap={16} angle={-30} width={1.6} />
      <g clipPath={`url(#${id}c)`}>
        <rect x={x} y={y} width={w} height={h} fill={grey(sea)} />
        {hatch ? <rect x={x - 40 + ((frame * 0.4) % 16)} y={y} width={w + 80} height={h} fill={`url(#${id}h)`} /> : null}
        {/* coast shadow (offset down-right), then the land, then a lit coast edge */}
        {shapes.map((p, i) => (
          <path key={`s${i}`} d={roundPoly(p, Math.max(2, w * 0.004))} fill={alpha("#1F4F4C", 0.28)} transform="translate(6 8)" />
        ))}
        {shapes.map((p, i) => (
          <path key={i} d={roundPoly(p, Math.max(2, w * 0.004))} fill={grey(land)} stroke={grey(shade)} strokeWidth={2} />
        ))}
        {view === "sunda" ? (
          <g>
            <ellipse cx={k[0]} cy={k[1] + cone * 0.35} rx={cone * 1.5} ry={cone * 0.45} fill={grey(shade)} />
            <path d={`M${k[0] - cone * 1.3} ${k[1] + cone * 0.4} L${k[0] - cone * 0.25} ${k[1] - cone * 0.9} L${k[0] + cone * 0.25} ${k[1] - cone * 0.9} L${k[0] + cone * 1.3} ${k[1] + cone * 0.4} Z`} fill={grey(mixHex(land, "#7A4A20", 0.25))} />
            <path d={`M${k[0] - cone * 0.25} ${k[1] - cone * 0.9} L${k[0] + cone * 0.25} ${k[1] - cone * 0.9} L${k[0] + cone * 1.3} ${k[1] + cone * 0.4} L${k[0] + cone * 0.2} ${k[1] + cone * 0.4} Z`} fill={grey(shade)} opacity={0.7} />
          </g>
        ) : null}
        {children}
      </g>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={alpha("#1F4F4C", 0.6)} strokeWidth={2} />
      {schematic ? <Pill x={x + w - 14} y={y + h - 24} text="SCHEMATIC" fill={family ? pillFill(family) : alpha("#1F4F4C", 0.72)} color={family?.dark === false ? "#FFF3C8" : family?.text ?? "#FFF3C8"} size={14} align="end" /> : null}
    </g>
  );
};

/** A map / globe pin: a dot on a short stem with a ring; vermilion only for Rodriguez ("you are here"), saffron for
 *  Krakatoa (storyboard §1). `pulse` (frame) breathes the ring. */
export const SitePin: React.FC<{ x: number; y: number; kind: "here" | "source" | "plain"; size?: number; frame?: number; color?: string }> = ({ x, y, kind, size = 14, frame = 0, color }) => {
  const c = color ?? (kind === "here" ? L13_COLORS.vermilion : kind === "source" ? L13_COLORS.saffron : "#1F4F4C");
  const ring = size * (1.4 + 0.5 * ((frame % 40) / 40));
  return (
    <g>
      <circle cx={x} cy={y} r={ring} fill="none" stroke={c} strokeWidth={2.5} opacity={1 - (frame % 40) / 40} />
      <path d={`M${x} ${y} L${x} ${y - size * 2.2}`} stroke={mixHex(c, "#000", 0.3)} strokeWidth={3} />
      <circle cx={x} cy={y - size * 2.2} r={size} fill={c} stroke={mixHex(c, "#000", 0.3)} strokeWidth={2} />
      <circle cx={x - size * 0.3} cy={y - size * 2.5} r={size * 0.3} fill="#FFFFFF" opacity={0.6} />
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Island props
// ---------------------------------------------------------------------------------------------------------------

/** Palm: curved trunk + seven two-tone fronds that sway (`sway` px at the crown, `period` frames). `silhouette` paints
 *  it in one colour (3-14's foreground palms bending as the front passes: drive `bend` 0..1). */
export const Palm: React.FC<{ x: number; y: number; h: number; f?: number; sway?: number; period?: number; lean?: number; bend?: number; trunk?: string; frond?: string; frondDark?: string; silhouette?: string; seed?: number; opacity?: number }> = ({
  x,
  y,
  h,
  f = 0,
  sway = 30,
  period = 80,
  lean = 0.12,
  bend = 0,
  trunk = "#6B4428",
  frond = "#2F8F6E",
  frondDark = "#1D5A4A",
  silhouette,
  seed = 1,
  opacity = 1,
}) => {
  const s = Math.sin((f / period) * Math.PI * 2 + seed * 1.7) * sway + Math.sin((f / (period * 0.37)) * Math.PI * 2 + seed) * sway * 0.25;
  const topX = x + lean * h + s * 0.45 + bend * h * 0.35;
  const topY = y - h + bend * h * 0.08;
  const midX = x + lean * h * 0.3 + s * 0.12 + bend * h * 0.08;
  const w0 = h * 0.055;
  const w1 = h * 0.03;
  const tk = silhouette ?? trunk;
  const trunkD = `M${x - w0} ${y} Q${midX - w0} ${y - h * 0.5} ${topX - w1} ${topY} L${topX + w1} ${topY} Q${midX + w0} ${y - h * 0.5} ${x + w0} ${y} Z`;
  const angles = [-168, -138, -108, -72, -38, -8, 22];
  return (
    <g opacity={opacity}>
      <path d={trunkD} fill={tk} />
      {!silhouette
        ? [0.2, 0.38, 0.56, 0.74].map((k) => {
            const tx = x + (topX - x) * k + (midX - (x + topX) / 2) * 4 * k * (1 - k);
            const ty = y - (y - topY) * k;
            return <path key={k} d={`M${tx - w0 * (1 - k * 0.45)} ${ty} q${w0} ${h * 0.012} ${2 * w0 * (1 - k * 0.45)} 0`} stroke={mixHex(trunk, "#000", 0.3)} strokeWidth={2} fill="none" />;
          })
        : null}
      {angles.map((a0, i) => {
        const a = (a0 + s * 0.35 + bend * 55 + Math.sin(f / 9 + i) * 2) * D2R;
        const L = h * (0.42 + 0.08 * rnd(seed * 7 + i));
        const ex = topX + Math.cos(a) * L;
        const ey = topY + Math.sin(a) * L * 0.75 + L * 0.28;
        const cx1 = topX + Math.cos(a) * L * 0.5;
        const cy1 = topY + Math.sin(a) * L * 0.5 - L * 0.22;
        const nx = -Math.sin(a) * L * 0.09;
        const ny = Math.cos(a) * L * 0.09;
        const upper = `M${topX} ${topY} Q${cx1 - nx} ${cy1 - ny} ${ex} ${ey} Q${cx1} ${cy1 + L * 0.02} ${topX} ${topY} Z`;
        const lower = `M${topX} ${topY} Q${cx1} ${cy1 + L * 0.02} ${ex} ${ey} Q${cx1 + nx} ${cy1 + ny + L * 0.04} ${topX} ${topY} Z`;
        return (
          <g key={i}>
            <path d={upper} fill={silhouette ?? frond} />
            <path d={lower} fill={silhouette ?? frondDark} />
          </g>
        );
      })}
      <circle cx={topX} cy={topY + h * 0.02} r={h * 0.035} fill={silhouette ?? mixHex(trunk, "#000", 0.35)} />
    </g>
  );
};

/** Jetty: a plank deck on posts standing in the water; posts throw little ripples that slide with `f`. */
export const Jetty: React.FC<{ x: number; y: number; w: number; family: Family; posts?: number; postH?: number; deck?: number; f?: number; wood?: string }> = ({ x, y, w, family: F, posts = 6, postH = 90, deck = 16, f = 0, wood = "#8A5A34" }) => {
  const dark = mixHex(wood, F.shadow, 0.5);
  const waterY = y + postH * 0.62;
  return (
    <g>
      {Array.from({ length: posts }, (_, i) => {
        const px = x + 10 + (i * (w - 30)) / Math.max(1, posts - 1);
        return (
          <g key={i}>
            <rect x={px} y={y} width={12} height={postH} fill={dark} />
            <rect x={px} y={y} width={4} height={postH} fill={mixHex(wood, F.light, 0.2)} opacity={0.6} />
            {[0, 1].map((k) => {
              const ph = ((f * 0.6 + i * 9 + k * 20) % 40) / 40;
              return <ellipse key={k} cx={px + 6} cy={waterY} rx={10 + ph * 26} ry={3 + ph * 5} fill="none" stroke={alpha(F.light, 0.7)} strokeWidth={2} opacity={1 - ph} />;
            })}
          </g>
        );
      })}
      <rect x={x} y={y - deck} width={w} height={deck} fill={wood} />
      <rect x={x} y={y - deck} width={w} height={4} fill={mixHex(wood, F.light, 0.35)} />
      {Array.from({ length: Math.floor(w / 26) }, (_, i) => (
        <line key={i} x1={x + 26 * (i + 1)} y1={y - deck} x2={x + 26 * (i + 1)} y2={y} stroke={dark} strokeWidth={1.5} opacity={0.7} />
      ))}
    </g>
  );
};

/** Notebook: an open notebook (x, y = spine centre). `turn` 0..1 turns the right page over; `flutter` 0..1 makes the
 *  free pages lift and riffle (C-03 "pages flutter"); ruled lines, a few ink scribbles (no legible text). */
export const Notebook: React.FC<{ x: number; y: number; w: number; h: number; turn?: number; flutter?: number; f?: number; paper?: string; ink?: string; cover?: string; tilt?: number }> = ({
  x,
  y,
  w,
  h,
  turn = 0,
  flutter = 0,
  f = 0,
  paper = "#F7EBCF",
  ink = "#3A4A50",
  cover = "#7A3A22",
  tilt = 0,
}) => {
  const half = w / 2;
  const page = (dir: 1 | -1, k: number, lift: number) => {
    // a page from the spine to the edge at horizontal fraction k (cos of the turn angle), lifted at the outer edge
    const ex = x + dir * half * k;
    return `M${x} ${y - h / 2} L${ex} ${y - h / 2 - lift} L${ex} ${y + h / 2 - lift * 0.4} L${x} ${y + h / 2} Z`;
  };
  const lines = (dir: 1 | -1) =>
    Array.from({ length: 7 }, (_, i) => {
      const yy = y - h / 2 + h * (0.18 + i * 0.11);
      const len = (0.55 + 0.35 * rnd(i * 3 + (dir > 0 ? 1 : 7))) * (half - 24);
      return <line key={i} x1={x + dir * 14} y1={yy} x2={x + dir * (14 + len)} y2={yy} stroke={ink} strokeWidth={2.2} strokeLinecap="round" opacity={0.55} />;
    });
  const fl = flutter * (0.5 + 0.5 * Math.sin(f / 2.3));
  const t = Math.max(0, Math.min(1, turn + fl * 0.18));
  const k = Math.cos(t * Math.PI);
  const lift = Math.sin(t * Math.PI) * h * 0.18 + fl * h * 0.05;
  return (
    <g transform={tilt ? `rotate(${tilt} ${x} ${y})` : undefined}>
      <rect x={x - half - 8} y={y - h / 2 - 6} width={w + 16} height={h + 14} rx={6} fill={cover} />
      <path d={page(-1, 1, 0)} fill={paper} />
      {lines(-1)}
      <path d={page(1, 1, 0)} fill={mixHex(paper, "#000", 0.04)} />
      {lines(1)}
      {/* the turning page and, while fluttering, two riffling leaves under it */}
      {fl > 0.02
        ? [0.3, 0.6].map((q, i) => {
            const kk = Math.cos(Math.min(1, fl * q * (1.2 + 0.4 * Math.sin(f / 1.7 + i))) * Math.PI * 0.4);
            return <path key={i} d={page(1, kk, fl * h * 0.06 * (i + 1))} fill={mixHex(paper, "#000", 0.06 + i * 0.03)} />;
          })
        : null}
      {t > 0.001 ? <path d={page(k >= 0 ? 1 : -1, Math.abs(k), lift)} fill={k >= 0 ? mixHex(paper, "#FFFFFF", 0.15) : mixHex(paper, "#000", 0.08)} stroke={alpha(ink, 0.25)} strokeWidth={1.5} /> : null}
      <line x1={x} y1={y - h / 2} x2={x} y2={y + h / 2} stroke={alpha(ink, 0.35)} strokeWidth={2} />
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Machines
// ---------------------------------------------------------------------------------------------------------------

/** Saturn V (x = centre line, y = base, h = full height): stacked cylinders in three tonal steps (lit, mid, shade
 *  bands; the lit side faces `light`, default upper-left), black roll stripes, five engine bells, the escape tower. */
export const SaturnV: React.FC<{ x: number; y: number; h: number; family: Family; light?: number }> = ({ x, y, h, family: F, light = 225 }) => {
  const litLeft = Math.cos(light * D2R) < 0;
  const W1 = h * 0.092; // S-IC / S-II diameter
  const W2 = h * 0.06; // S-IVB
  const white = "#F4F1E8";
  const black = "#23262A";
  const band = (y0: number, y1: number, w: number, c: string, key: string) => {
    const lit = mixHex(c, F.light, 0.35);
    const mid = c;
    const sh = mixHex(c, F.shadow, 0.42);
    const [a, b2, cc] = litLeft ? [lit, mid, sh] : [sh, mid, lit];
    return (
      <g key={key}>
        <rect x={x - w / 2} y={y0} width={w * 0.34} height={y1 - y0} fill={a} />
        <rect x={x - w / 2 + w * 0.34} y={y0} width={w * 0.33} height={y1 - y0} fill={b2} />
        <rect x={x - w / 2 + w * 0.67} y={y0} width={w * 0.33} height={y1 - y0} fill={cc} />
      </g>
    );
  };
  const Y = (k: number) => y - h * k;
  return (
    <g>
      {/* engine bells */}
      {[-0.32, -0.16, 0, 0.16, 0.32].map((k, i) => (
        <path key={i} d={`M${x + k * W1 * 1.5 - W1 * 0.07} ${Y(0.035)} L${x + k * W1 * 1.5 + W1 * 0.07} ${Y(0.035)} L${x + k * W1 * 1.5 + W1 * 0.11} ${y} L${x + k * W1 * 1.5 - W1 * 0.11} ${y} Z`} fill={mixHex(black, F.light, 0.15)} />
      ))}
      {/* fins */}
      <path d={`M${x - W1 / 2} ${Y(0.1)} L${x - W1 * 0.85} ${Y(0.02)} L${x - W1 / 2} ${Y(0.035)} Z`} fill={black} />
      <path d={`M${x + W1 / 2} ${Y(0.1)} L${x + W1 * 0.85} ${Y(0.02)} L${x + W1 / 2} ${Y(0.035)} Z`} fill={black} />
      {band(Y(0.38), Y(0.035), W1, white, "s1")}
      {/* S-IC roll pattern: black blocks low on the stage */}
      <rect x={x - W1 / 2} y={Y(0.11)} width={W1 * 0.5} height={h * 0.07} fill={black} opacity={0.9} />
      <rect x={x} y={Y(0.32)} width={W1 * 0.5} height={h * 0.05} fill={black} opacity={0.9} />
      <rect x={x - W1 / 2} y={Y(0.395)} width={W1} height={h * 0.015} fill={black} />
      {band(Y(0.6), Y(0.395), W1, white, "s2")}
      <rect x={x - W1 / 2} y={Y(0.615)} width={W1} height={h * 0.015} fill={black} />
      {/* taper to the third stage */}
      <path d={`M${x - W1 / 2} ${Y(0.615)} L${x - W2 / 2} ${Y(0.64)} L${x + W2 / 2} ${Y(0.64)} L${x + W1 / 2} ${Y(0.615)} Z`} fill={mixHex(white, F.shadow, 0.15)} />
      {band(Y(0.78), Y(0.64), W2, white, "s3")}
      <rect x={x - W2 / 2} y={Y(0.79)} width={W2} height={h * 0.012} fill={black} />
      {/* spacecraft cone + escape tower */}
      <path d={`M${x - W2 / 2} ${Y(0.79)} L${x - W2 * 0.22} ${Y(0.88)} L${x + W2 * 0.22} ${Y(0.88)} L${x + W2 / 2} ${Y(0.79)} Z`} fill={mixHex(white, F.light, 0.2)} />
      <path d={`M${x + W2 * 0.05} ${Y(0.79)} L${x + W2 * 0.22} ${Y(0.88)} L${x + W2 / 2} ${Y(0.79)} Z`} fill={mixHex(white, F.shadow, 0.35)} />
      <rect x={x - W2 * 0.06} y={Y(0.97)} width={W2 * 0.12} height={h * 0.09} fill={mixHex(black, F.light, 0.25)} />
      <path d={`M${x - W2 * 0.06} ${Y(0.97)} L${x} ${Y(1)} L${x + W2 * 0.06} ${Y(0.97)} Z`} fill={black} />
    </g>
  );
};

/** Bulb (power is the bulb's wattage, brightness its pressure at a distance, #14): glass, glowing filament, screw base,
 *  rays that rotate and lengthen with `on` (0..1). */
export const Bulb: React.FC<{ x: number; y: number; r: number; family: Family; on?: number; f?: number; rays?: number; color?: string }> = ({ x, y, r, family: F, on = 1, f = 0, rays = 12, color = L13_COLORS.gold }) => {
  const glass = mixHex(color, "#FFFBEA", 0.65 - on * 0.25);
  const base = mixHex(F.shadow, "#9A9A94", 0.5);
  return (
    <g>
      {on > 0.02
        ? Array.from({ length: rays }, (_, i) => {
            const a = ((i / rays) * 360 + f * 1.2) * D2R;
            if (Math.sin(a) > 0.6) return null;
            const r0 = r * 1.2;
            const r1 = r0 + r * (0.3 + 0.7 * on) * (0.75 + 0.25 * Math.sin(f / 5 + i));
            return <line key={i} x1={x + Math.cos(a) * r0} y1={y + Math.sin(a) * r0} x2={x + Math.cos(a) * r1} y2={y + Math.sin(a) * r1} stroke={color} strokeWidth={r * 0.08} strokeLinecap="round" opacity={on} />;
          })
        : null}
      <circle cx={x} cy={y} r={r * 1.3} fill={alpha(color, 0.35 * on)} filter="url(#soft-32)" />
      <path d={`M${x - r * 0.6} ${y + r * 0.65} Q${x - r * 0.3} ${y + r * 0.95} ${x - r * 0.3} ${y + r * 1.25} L${x + r * 0.3} ${y + r * 1.25} Q${x + r * 0.3} ${y + r * 0.95} ${x + r * 0.6} ${y + r * 0.65} Z`} fill={glass} />
      <circle cx={x} cy={y} r={r} fill={glass} stroke={mixHex(color, "#000", 0.3)} strokeWidth={2.5} />
      <Emissive d={`M${x - r * 0.25} ${y + r * 0.7} L${x - r * 0.25} ${y} L${x - r * 0.12} ${y - r * 0.18} L${x} ${y} L${x + r * 0.12} ${y - r * 0.18} L${x + r * 0.25} ${y} L${x + r * 0.25} ${y + r * 0.7}`} color={L13_COLORS.saffron} core="#FFF6D8" width={Math.max(2, r * 0.04)} strength={0.3 + on} glow={8} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={x - r * 0.34} y={y + r * (1.25 + i * 0.14)} width={r * 0.68} height={r * 0.1} rx={r * 0.04} fill={i % 2 ? mixHex(base, "#000", 0.25) : base} />
      ))}
      <path d={`M${x - r * 0.62} ${y - r * 0.5} A${r * 0.8} ${r * 0.8} 0 0 1 ${x - r * 0.1} ${y - r * 0.82}`} fill="none" stroke="#FFFFFF" strokeWidth={r * 0.07} strokeLinecap="round" opacity={0.7} />
    </g>
  );
};

/** JetEngine, front view: cowl with a lit rim, a spinning fan (blades rotate `rpm` degrees/frame, default 14) and the
 *  spinner's white spiral. */
export const JetEngine: React.FC<{ x: number; y: number; r: number; f?: number; rpm?: number; family: Family; light?: number }> = ({ x, y, r, f = 0, rpm = 14, family: F, light = 225 }) => {
  const cowl = "#5E6B72";
  const rot = f * rpm;
  const [lx, ly] = [Math.cos(light * D2R), Math.sin(light * D2R)];
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={mixHex(cowl, F.shadow, 0.25)} />
      <circle cx={x + lx * r * 0.04} cy={y + ly * r * 0.04} r={r * 0.97} fill="none" stroke={mixHex(cowl, F.light, 0.5)} strokeWidth={r * 0.05} />
      <circle cx={x} cy={y} r={r * 0.84} fill="#1A2024" />
      <g transform={`rotate(${rot.toFixed(1)} ${x} ${y})`}>
        {Array.from({ length: 18 }, (_, i) => {
          const a = (i / 18) * 360;
          return (
            <path
              key={i}
              transform={`rotate(${a} ${x} ${y})`}
              d={`M${x + r * 0.2} ${y - r * 0.03} Q${x + r * 0.5} ${y - r * 0.16} ${x + r * 0.82} ${y - r * 0.12} L${x + r * 0.82} ${y + r * 0.04} Q${x + r * 0.5} ${y + r * 0.02} ${x + r * 0.2} ${y + r * 0.05} Z`}
              fill={i % 2 ? "#8C979C" : "#9FAAAE"}
            />
          );
        })}
        <circle cx={x} cy={y} r={r * 0.22} fill="#C9CFD1" />
        <path d={`M${x} ${y} m${r * 0.02} 0 a${r * 0.05} ${r * 0.05} 0 1 1 ${-r * 0.08} ${r * 0.02} a${r * 0.12} ${r * 0.12} 0 1 1 ${r * 0.2} ${-r * 0.05}`} fill="none" stroke="#FFFFFF" strokeWidth={r * 0.035} strokeLinecap="round" />
      </g>
    </g>
  );
};

/** Cannon on a field carriage (side view; x, y = ground under the wheel; `s` px per metre). `recoil` 0..1 slides it
 *  back, `flash` 0..1 draws the saffron muzzle burst. */
export const Cannon: React.FC<{ x: number; y: number; s: number; family: Family; facing?: 1 | -1; recoil?: number; flash?: number }> = ({ x, y, s, family: F, facing = 1, recoil = 0, flash = 0 }) => {
  const bronze = "#5A4A3A";
  const wood = "#8A5A34";
  const wr = 0.62 * s;
  const ox = x - facing * recoil * 0.45 * s;
  const ang = -9;
  return (
    <g transform={`translate(${ox} ${y}) scale(${facing} 1)`}>
      <path d={`M${-1.6 * s} 0 L${0.2 * s} ${-0.75 * s} L${0.4 * s} ${-0.55 * s} L${-1.4 * s} ${0.02 * s} Z`} fill={mixHex(wood, F.shadow, 0.3)} />
      <g transform={`rotate(${ang} 0 ${-wr - 0.12 * s})`}>
        <path d={`M${-0.9 * s} ${-wr - 0.34 * s} L${1.9 * s} ${-wr - 0.22 * s} L${1.9 * s} ${-wr + 0.02 * s} L${-0.9 * s} ${-wr + 0.1 * s} Z`} fill={bronze} />
        <path d={`M${-0.9 * s} ${-wr - 0.34 * s} L${1.9 * s} ${-wr - 0.22 * s} L${1.9 * s} ${-wr - 0.14 * s} L${-0.9 * s} ${-wr - 0.22 * s} Z`} fill={mixHex(bronze, F.light, 0.35)} />
        <circle cx={-0.95 * s} cy={-wr - 0.12 * s} r={0.14 * s} fill={bronze} />
        {flash > 0.01 ? (
          <g opacity={flash}>
            <circle cx={2.3 * s} cy={-wr - 0.1 * s} r={0.9 * s * flash} fill={alpha(L13_COLORS.saffron, 0.5)} filter="url(#soft-16)" />
            <path d={`M${1.95 * s} ${-wr - 0.25 * s} L${3.1 * s} ${-wr - 0.55 * s} L${2.6 * s} ${-wr - 0.1 * s} L${3.3 * s} ${-wr + 0.25 * s} L${1.95 * s} ${-wr + 0.05 * s} Z`} fill={L13_COLORS.saffronCore} />
          </g>
        ) : null}
      </g>
      <g transform={`rotate(${(-recoil * 40).toFixed(1)} 0 ${-wr})`}>
        <circle cx={0} cy={-wr} r={wr} fill="none" stroke={mixHex(wood, F.shadow, 0.2)} strokeWidth={0.1 * s} />
        {Array.from({ length: 6 }, (_, i) => (
          <line key={i} x1={0} y1={-wr} x2={Math.cos((i * 60 * Math.PI) / 180) * wr} y2={-wr + Math.sin((i * 60 * Math.PI) / 180) * wr} stroke={wood} strokeWidth={0.06 * s} />
        ))}
        <circle cx={0} cy={-wr} r={0.1 * s} fill={mixHex(wood, "#000", 0.4)} />
      </g>
    </g>
  );
};

/** GasHolder: the Batavia gasworks gasometer (x = centre, y = ground). A lattice guide frame and the rising bell
 *  (`fill` 0..1 = bell height; the bell's top edge is a defined mover when `fill` animates). */
export const GasHolder: React.FC<{ x: number; y: number; w: number; h: number; family: Family; fill?: number; light?: number }> = ({ x, y, w, h, family: F, fill = 0.8, light = 15 }) => {
  const iron = "#4F5E62";
  const bell = "#6F8A86";
  const litRight = Math.cos(light * D2R) > 0;
  const top = y - h * (0.15 + 0.75 * Math.max(0, Math.min(1, fill)));
  const cols = 6;
  const bw = w * 0.86;
  const lit = mixHex(bell, F.light, 0.38);
  const sh = mixHex(bell, F.shadow, 0.4);
  return (
    <g>
      {/* bell: three tonal bands, a shallow dome */}
      <rect x={x - bw / 2} y={top} width={bw / 3} height={y - top} fill={litRight ? sh : lit} />
      <rect x={x - bw / 6} y={top} width={bw / 3} height={y - top} fill={bell} />
      <rect x={x + bw / 6} y={top} width={bw / 3} height={y - top} fill={litRight ? lit : sh} />
      <path d={`M${x - bw / 2} ${top} Q${x} ${top - h * 0.08} ${x + bw / 2} ${top} Z`} fill={mixHex(bell, F.light, 0.2)} />
      {[0.25, 0.5, 0.75].map((k) => (
        <line key={k} x1={x - bw / 2} y1={top + (y - top) * k} x2={x + bw / 2} y2={top + (y - top) * k} stroke={sh} strokeWidth={2} opacity={0.6} />
      ))}
      {/* guide frame: columns + lattice rings */}
      {Array.from({ length: cols }, (_, i) => {
        const cx = x - w / 2 + (i * w) / (cols - 1);
        return <rect key={i} x={cx - 5} y={y - h} width={10} height={h} fill={iron} />;
      })}
      {[0.33, 0.66, 1].map((k) => (
        <rect key={k} x={x - w / 2 - 4} y={y - h * k} width={w + 8} height={7} fill={mixHex(iron, F.light, 0.15)} />
      ))}
      {Array.from({ length: cols - 1 }, (_, i) => {
        const a = x - w / 2 + (i * w) / (cols - 1);
        const b = x - w / 2 + ((i + 1) * w) / (cols - 1);
        return (
          <g key={i} stroke={iron} strokeWidth={2.5} opacity={0.75}>
            <line x1={a} y1={y - h} x2={b} y2={y - h * 0.66} />
            <line x1={b} y1={y - h} x2={a} y2={y - h * 0.66} />
            <line x1={a} y1={y - h * 0.66} x2={b} y2={y - h * 0.33} />
            <line x1={b} y1={y - h * 0.66} x2={a} y2={y - h * 0.33} />
          </g>
        );
      })}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Creatures and spacecraft
// ---------------------------------------------------------------------------------------------------------------

/** SpermWhale: `view` "side" (x, y = centre; `len` = body length px; flukes beat with `f`) or "nose" (nose-on, for
 *  8-05: `len` sets the scale, the head's blunt face fills ~0.3 len). Faceted: a lit back plane, mid flank, dark belly. */
export const SpermWhale: React.FC<{ x: number; y: number; len: number; view?: "side" | "nose"; family: Family; f?: number; color?: string; facing?: 1 | -1 }> = ({ x, y, len, view = "side", family: F, f = 0, color = "#55646E", facing = 1 }) => {
  const lit = mixHex(color, F.light, 0.3);
  const sh = mixHex(color, F.shadow, 0.5);
  const beat = Math.sin(f / 9) * 0.5;
  if (view === "nose") {
    const W = len * 0.3;
    const H = len * 0.27;
    const head = roundPoly([[x - W / 2, y - H / 2], [x + W / 2, y - H / 2], [x + W * 0.46, y + H * 0.32], [x - W * 0.46, y + H * 0.32]], W * 0.22);
    return (
      <g>
        {/* flukes far behind (small), flippers either side, then the blunt face */}
        <path d={`M${x - W * 0.9} ${y - H * 0.2 + beat * H * 0.2} Q${x} ${y - H * 0.05} ${x + W * 0.9} ${y - H * 0.2 + beat * H * 0.2} L${x + W * 0.7} ${y - H * 0.05} Q${x} ${y + H * 0.05} ${x - W * 0.7} ${y - H * 0.05} Z`} fill={sh} opacity={0.75} />
        <path d={`M${x - W * 0.42} ${y + H * 0.22} Q${x - W * 0.85} ${y + H * 0.5 + beat * 6} ${x - W * 0.95} ${y + H * 0.62 + beat * 6} Q${x - W * 0.6} ${y + H * 0.5} ${x - W * 0.38} ${y + H * 0.34} Z`} fill={sh} />
        <path d={`M${x + W * 0.42} ${y + H * 0.22} Q${x + W * 0.85} ${y + H * 0.5 - beat * 6} ${x + W * 0.95} ${y + H * 0.62 - beat * 6} Q${x + W * 0.6} ${y + H * 0.5} ${x + W * 0.38} ${y + H * 0.34} Z`} fill={sh} />
        <Form d={head} fill={color} light={270} shadow={F.shadow} inset={W * 0.08} shadowOpacity={0.5} rim={F.light} rimWidth={Math.max(2, W * 0.015)} rimOpacity={0.7} bounce={F.bounce}>
          <path d={`M${x - W * 0.36} ${y - H * 0.42} L${x + W * 0.36} ${y - H * 0.42} L${x + W * 0.3} ${y - H * 0.12} L${x - W * 0.3} ${y - H * 0.12} Z`} fill={lit} opacity={0.55} />
        </Form>
        {/* the narrow lower jaw under the head */}
        <path d={`M${x - W * 0.14} ${y + H * 0.3} L${x + W * 0.14} ${y + H * 0.3} L${x + W * 0.08} ${y + H * 0.52} L${x - W * 0.08} ${y + H * 0.52} Z`} fill={mixHex(color, "#E8E4DA", 0.45)} />
        <circle cx={x - W * 0.47} cy={y + H * 0.12} r={Math.max(2, W * 0.025)} fill="#101418" />
        <circle cx={x + W * 0.47} cy={y + H * 0.12} r={Math.max(2, W * 0.025)} fill="#101418" />
      </g>
    );
  }
  const L = len;
  const T = L * 0.17; // body depth
  const pts: Pt[] = [
    [0.5, -0.5], // snout top (blunt box head)
    [0.5, 0.25],
    [0.42, 0.48],
    [0.15, 0.5], // jaw line back
    [-0.1, 0.42],
    [-0.32, 0.18],
    [-0.42, 0.04], // tail stock
    [-0.42, -0.06],
    [-0.28, -0.22],
    [-0.15, -0.36], // dorsal hump
    [-0.08, -0.4],
    [0.2, -0.52],
  ];
  const P = (u: number, v: number): Pt => [x + facing * u * L, y + v * T * 2];
  const body = roundPoly(pts.map(([u, v]) => P(u, v)), T * 0.25);
  const tail = P(-0.42, -0.01);
  const fl = beat * T * 0.9;
  return (
    <g>
      <path d={`M${tail[0]} ${tail[1]} Q${tail[0] - facing * L * 0.05} ${tail[1] + fl * 0.5} ${tail[0] - facing * L * 0.1} ${tail[1] - T * 0.55 + fl} L${tail[0] - facing * L * 0.07} ${tail[1] + fl * 0.6} L${tail[0] - facing * L * 0.1} ${tail[1] + T * 0.55 + fl} Q${tail[0] - facing * L * 0.05} ${tail[1] + fl * 0.5} ${tail[0]} ${tail[1]} Z`} fill={sh} />
      <Form d={body} fill={color} light={270} shadow={F.shadow} inset={T * 0.22} shadowOpacity={0.5} rim={F.light} rimWidth={Math.max(2, T * 0.05)} rimOpacity={0.75} bounce={F.bounce}>
        <path d={roundPoly([P(0.48, -0.48), P(0.2, -0.5), P(-0.08, -0.38), P(-0.3, -0.18), P(-0.1, -0.2), P(0.48, -0.3)], T * 0.1)} fill={lit} opacity={0.5} />
      </Form>
      <path d={`M${P(0.44, 0.42)[0]} ${P(0.44, 0.42)[1]} L${P(0.1, 0.44)[0]} ${P(0.1, 0.44)[1]}`} stroke={mixHex(color, "#E8E4DA", 0.4)} strokeWidth={Math.max(2, T * 0.06)} strokeLinecap="round" />
      <path d={`M${P(0.14, 0.32)[0]} ${P(0.14, 0.32)[1]} q${-facing * L * 0.05} ${T * 0.35 + beat * 4} ${-facing * L * 0.09} ${T * 0.45}`} stroke={sh} strokeWidth={Math.max(3, T * 0.12)} strokeLinecap="round" fill="none" />
      <circle cx={P(0.2, 0.22)[0]} cy={P(0.2, 0.22)[1]} r={Math.max(2, T * 0.05)} fill="#101418" />
    </g>
  );
};

/** Rover (Perseverance-like, schematic): x, y = ground at the middle wheel, `s` px per metre. Six wheels turn with
 *  `f` (`roll` px/frame of travel), mast with a camera head, rocker-bogie legs. */
export const Rover: React.FC<{ x: number; y: number; s: number; family: Family; f?: number; roll?: number; facing?: 1 | -1 }> = ({ x, y, s, family: F, f = 0, roll = 0, facing = 1 }) => {
  const white = "#EDE7DA";
  const dark = "#3A3632";
  const wr = 0.26 * s;
  const spin = ((f * roll) / Math.max(1, wr)) * (180 / Math.PI);
  const wheels = [-1.2, 0, 1.2];
  return (
    <g transform={`translate(${x} ${y}) scale(${facing} 1)`}>
      <path d={`M${-1.2 * s} ${-wr} L${-0.5 * s} ${-0.75 * s} L${0} ${-wr} M${-0.5 * s} ${-0.75 * s} L${0.5 * s} ${-0.75 * s} L${1.2 * s} ${-wr}`} stroke={dark} strokeWidth={0.06 * s} fill="none" strokeLinejoin="round" />
      <rect x={-1.3 * s} y={-1.35 * s} width={2.6 * s} height={0.6 * s} rx={0.08 * s} fill={white} />
      <rect x={-1.3 * s} y={-0.95 * s} width={2.6 * s} height={0.2 * s} fill={mixHex(white, F.shadow, 0.35)} />
      <rect x={-1.25 * s} y={-1.45 * s} width={1.1 * s} height={0.12 * s} fill={mixHex(dark, F.light, 0.25)} />
      <rect x={0.95 * s} y={-2.25 * s} width={0.07 * s} height={0.9 * s} fill={dark} />
      <rect x={0.75 * s} y={-2.45 * s} width={0.5 * s} height={0.22 * s} rx={0.04 * s} fill={white} />
      <circle cx={1.15 * s} cy={-2.34 * s} r={0.06 * s} fill={dark} />
      {wheels.map((k) => (
        <g key={k} transform={`rotate(${spin.toFixed(1)} ${k * s} ${-wr})`}>
          <circle cx={k * s} cy={-wr} r={wr} fill={dark} />
          <circle cx={k * s} cy={-wr} r={wr * 0.62} fill={mixHex(dark, F.light, 0.35)} />
          {[0, 60, 120].map((a) => (
            <line key={a} x1={k * s + Math.cos(a * D2R) * wr * 0.9} y1={-wr + Math.sin(a * D2R) * wr * 0.9} x2={k * s - Math.cos(a * D2R) * wr * 0.9} y2={-wr - Math.sin(a * D2R) * wr * 0.9} stroke={dark} strokeWidth={0.04 * s} />
          ))}
        </g>
      ))}
    </g>
  );
};

/** Satellite (no flags, no agency marks, F18): gold-foil body, two solar wings, a dish; `rot` degrees + slow wobble. */
export const Satellite: React.FC<{ x: number; y: number; s: number; family: Family; f?: number; rot?: number }> = ({ x, y, s, family: F, f = 0, rot = 0 }) => {
  const foil = "#C9A24A";
  const panel = "#1F4F7A";
  const r = rot + Math.sin(f / 40) * 3;
  const wing = (dir: 1 | -1) => (
    <g>
      <line x1={dir * s * 0.3} y1={0} x2={dir * s * 0.45} y2={0} stroke="#9A9A94" strokeWidth={s * 0.04} />
      <rect x={dir > 0 ? s * 0.45 : -s * 1.45} y={-s * 0.22} width={s} height={s * 0.44} fill={panel} />
      {[0.25, 0.5, 0.75].map((k) => (
        <line key={k} x1={(dir > 0 ? s * 0.45 : -s * 1.45) + s * k} y1={-s * 0.22} x2={(dir > 0 ? s * 0.45 : -s * 1.45) + s * k} y2={s * 0.22} stroke={mixHex(panel, F.light, 0.4)} strokeWidth={1.5} />
      ))}
      <line x1={dir > 0 ? s * 0.45 : -s * 1.45} y1={0} x2={dir > 0 ? s * 1.45 : -s * 0.45} y2={0} stroke={mixHex(panel, F.light, 0.4)} strokeWidth={1.5} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) rotate(${r.toFixed(2)})`}>
      {wing(1)}
      {wing(-1)}
      <rect x={-s * 0.3} y={-s * 0.35} width={s * 0.6} height={s * 0.7} rx={s * 0.05} fill={foil} />
      <rect x={-s * 0.3} y={-s * 0.35} width={s * 0.2} height={s * 0.7} fill={mixHex(foil, F.light, 0.4)} opacity={0.7} />
      <rect x={s * 0.1} y={-s * 0.35} width={s * 0.2} height={s * 0.7} fill={mixHex(foil, F.shadow, 0.35)} opacity={0.7} />
      <ellipse cx={0} cy={s * 0.5} rx={s * 0.24} ry={s * 0.08} fill="#E6E2D8" />
      <line x1={0} y1={s * 0.35} x2={0} y2={s * 0.48} stroke="#9A9A94" strokeWidth={s * 0.03} />
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Tick, listening
// ---------------------------------------------------------------------------------------------------------------

/** Tick in the kit's `listen` pose (character.tsx: back mitten cupped behind the head, head tilted toward it), with an
 *  optional `perk` 0..1 reaction (a small hop + lean toward the sound when a ring arrives). Use `toward` = the side the
 *  sound comes from (Tick faces it). Never `cover-ears` (F17). */
export const ListeningTick: React.FC<Omit<TickProps, "pose"> & { perk?: number; toward?: 1 | -1 }> = ({ perk = 0, toward, facing, y, tilt = 0, ...p }) => {
  const k = Math.max(0, Math.min(1, perk));
  const hop = Math.sin(k * Math.PI) * p.pxPerM * 0.08;
  const fc = toward ?? facing ?? 1;
  return <Tick {...p} y={y - hop} facing={fc} pose="listen" tilt={tilt + fc * 6 * Math.sin(k * Math.PI)} />;
};
