// Type for the illustrated format, using the fonts already bundled in public/fonts (OFL, fetched by
// scripts/fetch-assets.mjs): Anton = condensed grotesque for labels and all-caps chapter titles;
// Inter 800 with tabular numerals for counters and gauge readouts. Call loadBrandFonts() at module load.
import type React from "react";
export { loadBrandFonts as loadIllustratedFonts } from "../../brand/fonts";

export const IF = {
  label: "'Anton', 'Arial Narrow', sans-serif",
  num: "'Inter', 'Helvetica Neue', Arial, sans-serif",
} as const;

/** All-caps condensed label (one or two words; never a sentence). */
export const labelStyle = (size: number, color: string, spacing = 2): React.CSSProperties => ({
  fontFamily: IF.label,
  fontSize: size,
  letterSpacing: spacing,
  fill: color,
  color,
  textTransform: "uppercase",
});

/** Counter / readout numerals: heavy, tabular, so a rolling counter does not jitter sideways. */
export const numStyle = (size: number, color: string): React.CSSProperties => ({
  fontFamily: IF.num,
  fontWeight: 800,
  fontSize: size,
  fontVariantNumeric: "tabular-nums",
  fill: color,
  color,
});

/** 12262 → "12,262" (thin, fixed formatting so frames and narration agree). */
export const fmt = (v: number, digits = 0) => v.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
