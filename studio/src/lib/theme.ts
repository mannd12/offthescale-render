export const C = {
  bg: "#0a0e1a",
  bg2: "#111831",
  panel: "#161d38",
  line: "#2a3358",
  text: "#e9edf7",
  dim: "#8490b3",
  cyan: "#5ee7ff",
  amber: "#ffb454",
  pink: "#ff6ac1",
  green: "#7dffa0",
  violet: "#a78bfa",
  red: "#ff6b6b",
} as const;

export const FONT = {
  sans: "'Segoe UI', 'Inter', system-ui, sans-serif",
  mono: "'Cascadia Code', 'Cascadia Mono', Consolas, monospace",
} as const;

export const TOKEN_COLORS = [C.cyan, C.amber, C.pink, C.green, C.violet];
