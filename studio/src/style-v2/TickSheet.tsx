// Style frame v2 / 4: Tick's character sheet. A close-up (head and shoulders) on warm paper with soft shadows, then
// a grid of expressions and poses at a readable size, and the suit swatches. docs/STYLE-V2.md §5.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Expression, FAMILIES, GroundShadow, Headline, IF2, Kicker, Layer, Pose, Sky, Stage, Tick, loadIllustratedFonts, mixHex, P } from "../lib/illustrated";

loadIllustratedFonts();

const F = FAMILIES.studio;

const CELLS: { e: Expression; p: Pose; label: string; walk?: boolean; lamp?: boolean; staff?: boolean }[] = [
  { e: "neutral", p: "stand", label: "neutral" },
  { e: "happy", p: "wave", label: "happy · wave" },
  { e: "surprised", p: "point", label: "surprised · point" },
  { e: "worried", p: "hold", label: "worried · hold", staff: true },
  { e: "thinking", p: "think", label: "thinking" },
  { e: "proud", p: "hips", label: "proud" },
  { e: "scared", p: "cover-ears", label: "scared" },
  { e: "determined", p: "stand", label: "determined · walk", walk: true },
  { e: "sleepy", p: "sit", label: "sleepy · sit" },
  { e: "happy", p: "cheer", label: "cheer" },
  { e: "neutral", p: "shrug", label: "shrug" },
  { e: "surprised", p: "stand", label: "lamp on", lamp: true },
  // v2.1: the L12 storyboard's poses
  { e: "thinking", p: "crouch-reach", label: "crouch · reach" },
  { e: "determined", p: "carry", label: "carry" },
  { e: "happy", p: "press", label: "press" },
  { e: "worried", p: "heave", label: "heave" },
];

export const TickSheetScene: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage theme={F.theme} vignette={0.1} grain={0.5}>
      <Layer depth={0.05}>
        <Sky family={F} />
        {/* faint survey grid on the paper */}
        <g stroke={F.mid} strokeWidth={1} opacity={0.18}>
          {Array.from({ length: 24 }, (_, i) => (
            <line key={"v" + i} x1={i * 80 + 40} y1={0} x2={i * 80 + 40} y2={1080} />
          ))}
          {Array.from({ length: 14 }, (_, i) => (
            <line key={"h" + i} x1={0} y1={i * 80 + 40} x2={1920} y2={i * 80 + 40} />
          ))}
        </g>
      </Layer>
      <Layer depth={1}>
        {/* big close-up: head and shoulders; drawn at 4.6 px per cm so the face fills ~500 px */}
        <circle cx={400} cy={600} r={330} fill={mixHex(F.far, F.light, 0.35)} />
        <circle cx={400} cy={600} r={330} fill="none" stroke={F.mid} strokeWidth={2} opacity={0.5} />
        <g clipPath="url(#sheet-clip)">
          <clipPath id="sheet-clip">
            <circle cx={400} cy={600} r={326} />
          </clipPath>
          <Tick x={410} y={1360} pxPerM={520} frame={f} expression="happy" pose="stand" look={0.4} seed={7} />
        </g>
        <Kicker x={96} y={1000} text="Tick · the surveyor · 1.7 m, drawn to scale" color={F.dim} size={18} />
        {/* the grid */}
        {CELLS.map((c, i) => {
          const col = i % 4;
          const row = Math.floor(i / 4);
          const x = 880 + col * 240;
          const y = 392 + row * 206;
          return (
            <g key={i}>
              <GroundShadow x={x} y={y + 2} rx={38} color={F.shadow} opacity={0.3} blur={8} />
              <Tick x={x} y={y} pxPerM={92} frame={f} expression={c.e} pose={c.p} walk={c.walk ? f / 48 : undefined} lamp={c.lamp} staff={c.staff} seed={i + 3} look={0.3} slump={c.label === "carry" ? 0.5 : 0} />
              <text x={x} y={y + 34} textAnchor="middle" style={{ fontFamily: IF2.display, fontWeight: 500, fontSize: 18, fill: F.dim, letterSpacing: 0.5 }}>
                {c.label}
              </text>
            </g>
          );
        })}
      </Layer>
      <Layer depth={0}>
        <Kicker x={880} y={92} text="Character sheet" color={F.dim} size={20} />
        <Headline x={880} y={196} lines={["Meet Tick"]} size={80} color={F.text} accent={P.vermilion} rule={false} />
        {/* swatches: a column at the right edge */}
        {[
          ["#E4572E", "suit"],
          ["#F7EFDF", "visor"],
          ["#F2E6CF", "mitts"],
          ["#1E2226", "ink"],
          [mixHex("#E4572E", "#15191C", 0.32), "shade"],
        ].map(([c, n], i) => (
          <g key={n}>
            <rect x={1790} y={300 + i * 96} width={70} height={40} rx={10} fill={c} stroke={F.mid} strokeWidth={1.5} />
            <text x={1825} y={366 + i * 96} textAnchor="middle" style={{ fontFamily: IF2.display, fontWeight: 500, fontSize: 17, fill: F.dim }}>
              {n}
            </text>
          </g>
        ))}
      </Layer>
    </Stage>
  );
};
