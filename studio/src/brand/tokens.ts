// Brand kit tokens for the "Every LEVEL of nature" channel. Name-free on purpose: the owner is
// still choosing the channel name. Shared frame only - every episode's visuals stay bespoke.
export const B = {
  ink: "#0B1B2B", // deep navy: text on light, chrome on footage
  paper: "#FFFFFF",
  gauge: "#FFC83D", // warm yellow: the gauge, progress, emphasis
  aqua: "#19C3E6",
  tease: "#FF5A4F", // coral: the "?????" level and warnings
  teaseInk: "#D42E24", // darker coral for TEXT on white: 5.0:1 (tease on white is only 3.1:1)
  mute: "#8CA0B3",
} as const;

export const F = {
  headline: "'Anton', 'Arial Narrow', sans-serif",
  ui: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  caption: "'Fredoka', 'Inter', sans-serif",
} as const;

export type Level = {
  id: string;
  /** short all-caps name shown in the title bar and on tiles */
  name: string;
  /** what the gauge reads for this level, already formatted */
  reading: string;
  /** id of an image in assets/manifest.json, or null for the mystery tile */
  image: string | null;
  ext?: "jpg" | "png";
  /** tiles only: frame a small subject inside the photo (the plate itself is untouched) */
  tileCrop?: { scale: number; origin: string; brightness?: number };
  /** short text drawn on ink when there is no image (and it is not the mystery tile) */
  glyph?: string;
};
