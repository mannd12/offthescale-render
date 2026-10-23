import React from "react";
import { AbsoluteFill } from "remotion";
import { loadBrandFonts } from "./fonts";
import { B, F } from "./tokens";

loadBrandFonts();

/**
 * Channel avatar, 800x800. Reads at 32 px in a comment thread: one shape (the gauge needle
 * swung past the end of its arc), one word. Ink on gauge-yellow so it pops beside thumbnails.
 */
export const BrandAvatar: React.FC = () => {
  const cx = 400;
  const cy = 430;
  const r = 250;
  const a0 = Math.PI * 1.2;
  const sweep = Math.PI * 1.4;
  const pt = (p: number, rr: number) => [cx + Math.cos(a0 - p * sweep) * rr, cy - Math.sin(a0 - p * sweep) * rr] as const;
  const arc = (from: number, to: number, rr: number) => {
    const [x1, y1] = pt(from, rr);
    const [x2, y2] = pt(to, rr);
    return `M${x1} ${y1} A${rr} ${rr} 0 ${(to - from) * sweep > Math.PI ? 1 : 0} 1 ${x2} ${y2}`;
  };
  // the needle points past the end of the arc: off the scale
  const [nx, ny] = pt(1.12, r + 30);
  return (
    <AbsoluteFill style={{ backgroundColor: B.gauge }}>
      <svg width={800} height={800} style={{ position: "absolute", inset: 0 }}>
        <path d={arc(0, 1, r)} stroke={B.ink} strokeWidth={44} fill="none" strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={B.tease} strokeWidth={30} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={44} fill={B.ink} />
      </svg>
    </AbsoluteFill>
  );
};

/**
 * Channel banner, 2048x1152. YouTube shows only the central 1235x338 "safe area" on every
 * device, so everything that matters sits inside it; the rest is a quiet ink field with the gauge.
 */
export const BrandBanner: React.FC = () => {
  const safe = { x: (2048 - 1235) / 2, y: (1152 - 338) / 2, w: 1235, h: 338 };
  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      {/* a faint scale across the whole banner: ticks getting denser to the right */}
      <svg width={2048} height={1152} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 40 }, (_, i) => {
          const x = 80 + i * 49;
          const tall = i % 5 === 0;
          return <line key={i} x1={x} y1={1152 - 80} x2={x} y2={1152 - 80 - (tall ? 60 : 28)} stroke={tall ? B.gauge : "rgba(255,255,255,0.28)"} strokeWidth={tall ? 6 : 3} />;
        })}
        <line x1={80} y1={1152 - 80} x2={1990} y2={1152 - 80} stroke="rgba(255,255,255,0.28)" strokeWidth={3} />
        <circle cx={1990} cy={1152 - 80} r={22} fill={B.tease} />
      </svg>
      <div style={{ position: "absolute", left: safe.x, top: safe.y, width: safe.w, height: safe.h, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: F.headline, fontSize: 170, lineHeight: 0.95, color: B.paper, whiteSpace: "nowrap", letterSpacing: 2 }}>OFF THE SCALE</div>
        <div style={{ marginTop: 16, fontFamily: F.ui, fontWeight: 800, fontSize: 38, letterSpacing: 4, color: B.gauge, whiteSpace: "nowrap" }}>EVERY LEVEL OF ___ EXPLAINED · REAL FOOTAGE</div>
      </div>
    </AbsoluteFill>
  );
};
