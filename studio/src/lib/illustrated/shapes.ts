// Kit v2 shape helpers: rounded ("cut paper") polygons, organic blobs, resampling and morphing between outlines.
// v1 drew hard polygons; v2 rounds every corner a little so forms read as objects, not as chart glyphs.
import { rnd } from "./motion";

export type Pt = [number, number];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Polygon with rounded corners (quadratic bends at each vertex). `r` is the corner radius in px; it is clamped to
 * half the shorter adjacent edge so short edges stay honest. Closed by default; `closed = false` leaves ends square.
 */
export const roundPoly = (pts: Pt[], r = 12, closed = true) => {
  const n = pts.length;
  if (n < 3) return "M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L");
  const seg: string[] = [];
  const last = closed ? n : n - 1;
  const first = closed ? 0 : 1;
  const cornerPts = (i: number) => {
    const p = pts[(i - 1 + n) % n];
    const c = pts[i];
    const q = pts[(i + 1) % n];
    const d1 = Math.hypot(c[0] - p[0], c[1] - p[1]);
    const d2 = Math.hypot(q[0] - c[0], q[1] - c[1]);
    const rr = Math.min(r, d1 / 2, d2 / 2);
    const a: Pt = [c[0] + ((p[0] - c[0]) / d1) * rr, c[1] + ((p[1] - c[1]) / d1) * rr];
    const b: Pt = [c[0] + ((q[0] - c[0]) / d2) * rr, c[1] + ((q[1] - c[1]) / d2) * rr];
    return { a, b, c };
  };
  if (!closed) seg.push(`M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`);
  for (let i = first; i < last; i++) {
    const { a, b, c } = cornerPts(i);
    if (i === first && closed) seg.push(`M${a[0].toFixed(1)} ${a[1].toFixed(1)}`);
    else seg.push(`L${a[0].toFixed(1)} ${a[1].toFixed(1)}`);
    seg.push(`Q${c[0].toFixed(1)} ${c[1].toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`);
  }
  if (closed) seg.push("Z");
  else seg.push(`L${pts[n - 1][0].toFixed(1)} ${pts[n - 1][1].toFixed(1)}`);
  return seg.join(" ");
};

/** Catmull-Rom smooth curve through points (open), for soft hills and sea surfaces. */
export const smoothPath = (pts: Pt[], tension = 0.5) => {
  if (pts.length < 2) return "";
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1: Pt = [p1[0] + ((p2[0] - p0[0]) * tension) / 3, p1[1] + ((p2[1] - p0[1]) * tension) / 3];
    const c2: Pt = [p2[0] - ((p3[0] - p1[0]) * tension) / 3, p2[1] - ((p3[1] - p1[1]) * tension) / 3];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
};

/** Points of an organic blob: a circle with low-frequency radius noise. Pair with roundPoly(…, big r). */
export const blobPts = (cx: number, cy: number, r: number, n = 10, seed = 1, wobble = 0.18, squashY = 1): Pt[] =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const rr = r * (1 + (rnd(seed * 13 + i) - 0.5) * 2 * wobble);
    return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * squashY];
  });

/** Resample a closed polyline to exactly `n` points spaced evenly along its perimeter (for morphing). */
export const resample = (pts: Pt[], n: number): Pt[] => {
  const m = pts.length;
  const lens: number[] = [];
  let total = 0;
  for (let i = 0; i < m; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % m];
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    lens.push(l);
    total += l;
  }
  const out: Pt[] = [];
  let seg = 0;
  let acc = 0;
  for (let k = 0; k < n; k++) {
    const target = (k / n) * total;
    while (seg < m - 1 && acc + lens[seg] < target) {
      acc += lens[seg];
      seg++;
    }
    const a = pts[seg];
    const b = pts[(seg + 1) % m];
    const t = lens[seg] === 0 ? 0 : (target - acc) / lens[seg];
    out.push([lerp(a[0], b[0], t), lerp(a[1], b[1], t)]);
  }
  return out;
};

/** Morph between two closed outlines (any point counts); t = 0 → a, 1 → b. */
export const morphPts = (a: Pt[], b: Pt[], t: number, n?: number): Pt[] => {
  const k = n ?? Math.max(a.length, b.length, 24);
  const A = resample(a, k);
  const B = resample(b, k);
  // align start points so the morph does not twist: choose the rotation of B nearest to A[0]
  let best = 0;
  let bd = Infinity;
  for (let i = 0; i < k; i++) {
    const d = Math.hypot(B[i][0] - A[0][0], B[i][1] - A[0][1]);
    if (d < bd) {
      bd = d;
      best = i;
    }
  }
  return A.map((p, i) => {
    const q = B[(i + best) % k];
    return [lerp(p[0], q[0], t), lerp(p[1], q[1], t)];
  });
};

/** Circular arc path (degrees, clockwise on screen). */
export const arcPath = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const r0 = (a0 * Math.PI) / 180;
  const r1 = (a1 * Math.PI) / 180;
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  return `M${(cx + Math.cos(r0) * r).toFixed(1)} ${(cy + Math.sin(r0) * r).toFixed(1)} A${r} ${r} 0 ${large} 1 ${(cx + Math.cos(r1) * r).toFixed(1)} ${(cy + Math.sin(r1) * r).toFixed(1)}`;
};

/** A rounded-rect path (so it can be used anywhere a `d` is needed, e.g. in Form). */
export const rrect = (x: number, y: number, w: number, h: number, r: number) => {
  const rr = Math.min(r, w / 2, h / 2);
  return `M${x + rr} ${y} H${x + w - rr} Q${x + w} ${y} ${x + w} ${y + rr} V${y + h - rr} Q${x + w} ${y + h} ${x + w - rr} ${y + h} H${x + rr} Q${x} ${y + h} ${x} ${y + h - rr} V${y + rr} Q${x} ${y} ${x + rr} ${y} Z`;
};

/** A circle as a path. */
export const circlePath = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy} A${r} ${r} 0 1 0 ${cx + r} ${cy} A${r} ${r} 0 1 0 ${cx - r} ${cy} Z`;

/** A mountain / hill silhouette: ridge points over a base line, corners softened. */
export const ridgePath = (pts: Pt[], base: number, r = 10) => roundPoly([[pts[0][0], base], ...pts, [pts[pts.length - 1][0], base]], r);
