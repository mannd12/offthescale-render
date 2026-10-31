import React from "react";
import { AbsoluteFill } from "remotion";
import { loadBrandFonts } from "../../brand/fonts";
import { DiverSilhouette } from "../../brand/kit";
import { B, F } from "../../brand/tokens";

loadBrandFonts();

/**
 * L04 thumbnail: the INK card (owner: alternate colours; 2 = white, 3 = yellow, 4 = dark).
 * The famous iceberg, redrawn — but with a red dashed MYTH LINE cut across it and the "you" dot
 * below the line, on the sea floor. Text adds to the title instead of repeating it.
 */
export const ThumbL04: React.FC = () => {
  // top = 78 (was 40): the tip figure's head was clipped at y = 0 (now ~21 px clear); cx 990 (was 1010) keeps the
  // "7 LEVELS" pill off the berg's top edge; h 612 (was 640) keeps the tip clear of the bottom edge.
  const cx = 990;
  const top = 78;
  const h = 612;
  const path = `M${cx - 50} ${top} L${cx + 50} ${top} L${cx + 150} ${top + h * 0.25} L${cx + 120} ${top + h * 0.7} L${cx} ${top + h} L${cx - 120} ${top + h * 0.7} L${cx - 150} ${top + h * 0.25} Z`;
  const yWater = top + h * 0.14;
  const yMyth = top + h * 0.46;
  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <clipPath id="thumb-ice">
            <path d={path} />
          </clipPath>
          <linearGradient id="thumb-deep" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2FD8F5" />
            <stop offset="50%" stopColor="#0B3A5E" />
            <stop offset="100%" stopColor="#03080F" />
          </linearGradient>
        </defs>
        <path d={path} fill="url(#thumb-deep)" />
        <rect x={cx - 160} y={top} width={320} height={yWater - top} fill={B.paper} clipPath="url(#thumb-ice)" />
        <path d={path} fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth={5} />
        <line x1={cx - 190} y1={yWater} x2={cx + 190} y2={yWater} stroke={B.aqua} strokeWidth={5} />
        <line x1={cx - 230} y1={yMyth} x2={cx + 230} y2={yMyth} stroke={B.tease} strokeWidth={12} strokeDasharray="28 18" />
        <circle cx={cx} cy={top + h * 0.95} r={22} fill={B.gauge} stroke={B.ink} strokeWidth={5} />
      </svg>
      <div style={{ position: "absolute", left: cx - 232, top: yMyth - 62, padding: "6px 16px 8px", borderRadius: 10, background: B.tease, color: B.paper, fontFamily: F.ui, fontWeight: 800, fontSize: 28, letterSpacing: 2 }}>MYTH LINE</div>
      <DiverSilhouette size={72} color={B.paper} style={{ position: "absolute", left: cx - 36, top: top - 60 }} />
      <div style={{ position: "absolute", left: 60, top: 60, fontFamily: F.headline, fontSize: 168, lineHeight: 0.92, color: B.paper, whiteSpace: "nowrap" }}>
        THE
        <br />
        ICEBERG
        <br />
        <span style={{ color: B.tease }}>IS WRONG</span>
      </div>
      {/* sub-line was Inter 32 (23-px caps, unreadable at 168 px); now Anton 74 = ~64-px caps, same words on two lines */}
      <div style={{ position: "absolute", left: 64, top: 540, fontFamily: F.headline, fontSize: 74, lineHeight: 0.98, color: B.aqua, letterSpacing: 1, whiteSpace: "nowrap" }}>
        3 LEVELS ARE REAL
        <br />
        4 ARE A MACHINE
      </div>
      <div style={{ position: "absolute", right: 28, top: 26, padding: "10px 22px 12px", borderRadius: 16, background: B.gauge, color: B.ink, fontFamily: F.ui, fontWeight: 800, fontSize: 30, transform: "rotate(-4deg)" }}>7 LEVELS</div>
    </AbsoluteFill>
  );
};

/**
 * L04 thumbnail C (2026-10-30): thumbnail A's iceberg with the four-word headline only, enlarged; the two sub-lines
 * and the pill took it past the five-word rule (docs/THUMBNAILS.md §3).
 */
export const ThumbL04C: React.FC = () => {
  const cx = 1010;
  const top = 60;
  const h = 640;
  const path = `M${cx - 55} ${top} L${cx + 55} ${top} L${cx + 170} ${top + h * 0.25} L${cx + 135} ${top + h * 0.7} L${cx} ${top + h} L${cx - 135} ${top + h * 0.7} L${cx - 170} ${top + h * 0.25} Z`;
  const yWater = top + h * 0.14;
  const yMyth = top + h * 0.46;
  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <clipPath id="thumbc-ice">
            <path d={path} />
          </clipPath>
          <linearGradient id="thumbc-deep" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2FD8F5" />
            <stop offset="50%" stopColor="#0B3A5E" />
            <stop offset="100%" stopColor="#03080F" />
          </linearGradient>
        </defs>
        <path d={path} fill="url(#thumbc-deep)" />
        <rect x={cx - 180} y={top} width={360} height={yWater - top} fill={B.paper} clipPath="url(#thumbc-ice)" />
        <path d={path} fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth={5} />
        <line x1={cx - 230} y1={yMyth} x2={cx + 230} y2={yMyth} stroke={B.tease} strokeWidth={14} strokeDasharray="30 18" />
      </svg>
      <div style={{ position: "absolute", left: 50, top: 66, fontFamily: F.headline, fontSize: 196, lineHeight: 0.98, color: B.paper, whiteSpace: "nowrap" }}>
        THE
        <br />
        ICEBERG
        <br />
        <span style={{ color: B.tease }}>IS WRONG</span>
      </div>
    </AbsoluteFill>
  );
};

/**
 * L04 thumbnail B (Test & Compare, as planned in publish.md): same berg, one idea - THE MYTH LINE.
 * The berg is bigger and centred; the red dashed line cuts it with the words on it, and below the
 * line the berg turns into a yellow cable running to the sea floor (what's really down there).
 */
export const ThumbL04B: React.FC = () => {
  const cx = 860;
  const top = 50;
  const h = 640;
  const path = `M${cx - 60} ${top} L${cx + 60} ${top} L${cx + 190} ${top + h * 0.25} L${cx + 150} ${top + h * 0.7} L${cx} ${top + h} L${cx - 150} ${top + h * 0.7} L${cx - 190} ${top + h * 0.25} Z`;
  const yWater = top + h * 0.14;
  const yMyth = top + h * 0.46;
  return (
    <AbsoluteFill style={{ backgroundColor: B.ink }}>
      <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <clipPath id="thumbb-ice">
            <path d={path} />
          </clipPath>
          <linearGradient id="thumbb-deep" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2FD8F5" />
            <stop offset="50%" stopColor="#0B3A5E" />
            <stop offset="100%" stopColor="#03080F" />
          </linearGradient>
        </defs>
        <path d={path} fill="url(#thumbb-deep)" />
        <rect x={cx - 200} y={top} width={400} height={yWater - top} fill={B.paper} clipPath="url(#thumbb-ice)" />
        <path d={path} fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth={5} />
        {/* below the myth line: the cable, down to the sea floor */}
        <path d={`M${cx} ${yMyth + 20} C ${cx - 60} ${yMyth + 140}, ${cx + 70} ${yMyth + 220}, ${cx} ${top + h - 30} L ${cx + 330} ${top + h - 30}`} stroke={B.gauge} strokeWidth={14} fill="none" strokeLinecap="round" />
        <line x1={0} y1={yMyth} x2={1280} y2={yMyth} stroke={B.tease} strokeWidth={14} strokeDasharray="34 20" />
      </svg>
      <div style={{ position: "absolute", left: 40, top: yMyth - 170, fontFamily: F.headline, fontSize: 150, lineHeight: 1, color: B.tease, whiteSpace: "nowrap" }}>MYTH LINE</div>
      <div style={{ position: "absolute", left: 44, top: yMyth + 26, fontFamily: F.ui, fontWeight: 800, fontSize: 34, letterSpacing: 2, color: B.paper, lineHeight: 1.3 }}>
        THE MEME MADE UP
        <br />
        EVERYTHING BELOW.
        <br />
        <span style={{ color: B.gauge }}>THE REAL BOTTOM →</span>
      </div>
      <div style={{ position: "absolute", right: 40, top: 34, padding: "10px 22px 12px", borderRadius: 16, background: B.gauge, color: B.ink, fontFamily: F.ui, fontWeight: 800, fontSize: 30, transform: "rotate(-4deg)" }}>7 LEVELS</div>
    </AbsoluteFill>
  );
};
