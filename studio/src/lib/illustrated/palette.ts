// "Survey chart" palette for the illustrated format (docs/KURZGESAGT-STUDY.md §6, docs/STYLE-ILLUSTRATED.md).
// Flat and matte: no gradients, no glow. One soft vignette per frame is the only tonal ramp allowed.
// VERMILION is reserved for the gauge, the Reference Figure and "you are here". Nothing else may use it.

export const P = {
  bone: "#F1EADB", // base for Earth and everyday scenes
  boneDeep: "#E4DBC7", // a second paper tone for panels / sky bands on bone
  ink: "#23262A", // line work and text on bone
  inkSoft: "#6B6A63", // secondary labels on bone
  graphite: "#1E2327", // base for space and depth scenes
  graphiteLift: "#2A3136", // panels on graphite
  chalk: "#E9E2D2", // line work and text on graphite
  chalkSoft: "#9A9C97", // secondary labels on graphite
  vermilion: "#E4572E", // SIGNAL: gauge, Reference Figure, "you are here" only
} as const;

/** Per-episode two-colour pair. Pick one per video; tints of the pair carry every subject. */
export type Pair = { a: string; b: string; name: string };
export const PAIRS = {
  earth: { name: "slate + amber", a: "#56656F", b: "#D49A3A" },
  ocean: { name: "ochre + sea-glass", a: "#C2913F", b: "#7FAE9F" },
  sky: { name: "storm + straw", a: "#4D5A78", b: "#D8C27A" },
} as const satisfies Record<string, Pair>;

/** Theme for a frame: everything a prop needs to draw on bone or on graphite. */
export type Theme = { bg: string; panel: string; line: string; text: string; dim: string; dark: boolean };
export const BONE: Theme = { bg: P.bone, panel: P.boneDeep, line: P.ink, text: P.ink, dim: P.inkSoft, dark: false };
export const GRAPHITE: Theme = { bg: P.graphite, panel: P.graphiteLift, line: P.chalk, text: P.chalk, dim: P.chalkSoft, dark: true };

// accepts #RRGGBB and #RGB (a 3-digit "#000" used to parse as NaN and paint black, 2026-11-11 fix)
const hex = (c: string) => {
  const h = c.length === 4 ? "#" + c[1] + c[1] + c[2] + c[2] + c[3] + c[3] : c;
  return [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
};
const toHex = (v: number[]) => "#" + v.map((x) => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, "0")).join("");

/** Flat mix of two colours (k = 0 → a, 1 → b). Use for tints/shades instead of gradients. */
export const mixHex = (a: string, b: string, k: number) => {
  const A = hex(a);
  const B = hex(b);
  return toHex(A.map((x, i) => x + (B[i] - x) * k));
};
/** Tint toward the frame base: k = 0 → colour, 1 → base. */
export const tint = (c: string, base: string, k: number) => mixHex(c, base, k);

// Two-tone flat shading (2026-11-05 art upgrade). The light always comes from the upper LEFT (a low sun):
// left / top faces take lit(), right / under faces take shade(). Two flat tones per form, never a ramp.
const SHADOW_INK = "#15191C";
const LIGHT_PAPER = "#FFFBF2";
/** Shadow side of a form: the colour pushed toward a cool near-black (k ≈ 0.2-0.4). */
export const shade = (c: string, k = 0.28) => mixHex(c, SHADOW_INK, k);
/** Lit side of a form: the colour pushed toward warm paper white (k ≈ 0.15-0.35). */
export const lit = (c: string, k = 0.22) => mixHex(c, LIGHT_PAPER, k);
