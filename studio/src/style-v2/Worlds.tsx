// Style frame v2 / 5: a planet lineup in the "void" family. Four worlds drawn to the same diameter scale, lit by a
// sun off the right edge (rim light on the right, inner shadow on the left), each with a bar for its tallest mountain.
// Numbers (docs/STYLE-V2.md §10): mean diameters Earth 12,742 km, Venus 12,104 km, Mars 6,779 km, Vesta ~525 km
// (NASA planetary fact sheets / Dawn); tallest peaks Everest 8,849 m, Maxwell Montes ~11 km above mean radius,
// Olympus Mons ~22 km, Rheasilvia central peak ~22 km (NASA; Dawn team gives 20-25 km, hence "~").
import React from "react";
import { useCurrentFrame } from "remotion";
import {
  Bloom,
  FAMILIES,
  Form,
  Headline,
  Kicker,
  Layer,
  Metric,
  Motes,
  P,
  Pill,
  Sky,
  Stage,
  Stars,
  Tick,
  blobPts,
  circlePath,
  loadIllustratedFonts,
  mixHex,
  roundPoly,
} from "../lib/illustrated";

loadIllustratedFonts();

const F = FAMILIES.void;
const SUNWARD = 352; // light toward the right, a touch up
const KM_PER_PX = 12742 / 260; // Earth = 260 px across

const WORLDS = [
  { name: "Venus", dia: 12104, x: 420, color: "#D9B47A", peak: 11, peakLabel: "~11 km", peakName: "Maxwell Montes" },
  { name: "Earth", dia: 12742, x: 820, color: "#3E7A86", peak: 8.849, peakLabel: "8.8 km", peakName: "Everest" },
  { name: "Mars", dia: 6779, x: 1180, color: "#C8763E", peak: 22, peakLabel: "~22 km", peakName: "Olympus Mons" },
  { name: "Vesta", dia: 525, x: 1440, color: "#8E8A80", peak: 22, peakLabel: "~22 km", peakName: "Rheasilvia" },
];

export const WorldsScene: React.FC = () => {
  const f = useCurrentFrame();
  const cy = 500;
  const barBase = 880;
  const barScale = 9; // px per km of mountain height
  return (
    <Stage theme={F.theme} vignette={0.3}>
      <Layer depth={0.05}>
        <Sky family={F} />
        <Stars frame={f} n={260} w={1920} h={1080} color={F.text} seed={21} size={1.3} twinkle={0.7} />
        {/* the sun, off frame right */}
        <Bloom x={2050} y={420} r={900} color={F.light} strength={0.45} spread={0.2} />
        <Bloom x={2050} y={420} r={300} color="#FFF4D6" strength={0.9} spread={0.4} />
        {/* a thin dust band */}
        <Motes frame={f} n={60} x={0} y={300} w={1920} h={400} color={F.light} seed={14} size={1.6} drift={10} />
      </Layer>
      <Layer depth={0.6}>
        {WORLDS.map((w, i) => {
          const r = Math.max(4, w.dia / KM_PER_PX / 2);
          const d = circlePath(w.x, cy, r);
          const bob = Math.sin(f / 140 + i) * 4;
          return (
            <g key={w.name} transform={`translate(0 ${bob.toFixed(2)})`}>
              <Bloom x={w.x + r * 0.3} y={cy} r={r * 1.6} color={F.light} strength={0.16} spread={0.45} />
              <Form d={d} fill={w.color} light={SUNWARD} shadow={F.shadow} inset={Math.max(6, r * 0.55)} shadowOpacity={0.85} rim={F.light} rimWidth={Math.max(1.5, r * 0.035)} rimOpacity={0.9}>
                {w.name === "Earth" ? (
                  <g fill="#6E9A6A" opacity={0.95}>
                    <path d={roundPoly(blobPts(w.x - 40, cy - 50, 46, 9, 3, 0.3, 1.2), 18)} />
                    <path d={roundPoly(blobPts(w.x + 50, cy + 10, 36, 8, 5, 0.3, 1.4), 14)} />
                    <path d={roundPoly(blobPts(w.x - 20, cy + 80, 28, 8, 8, 0.3, 0.8), 12)} />
                    <ellipse cx={w.x} cy={cy - r + 10} rx={r * 0.6} ry={12} fill="#F4EFE6" />
                    <path d={roundPoly(blobPts(w.x + 10, cy - 20, 60, 10, 11, 0.25, 0.3), 20)} fill="#FFFFFF" opacity={0.5} transform={`rotate(-20 ${w.x} ${cy})`} />
                  </g>
                ) : null}
                {w.name === "Mars" ? (
                  <g>
                    <path d={roundPoly(blobPts(w.x - 20, cy + 10, 34, 8, 2, 0.35, 0.7), 12)} fill={mixHex(w.color, "#000", 0.25)} opacity={0.7} />
                    <ellipse cx={w.x} cy={cy - r + 6} rx={r * 0.35} ry={7} fill="#F4EFE6" opacity={0.9} />
                    <circle cx={w.x - 36} cy={cy - 26} r={9} fill={mixHex(w.color, "#000", 0.35)} />
                    <circle cx={w.x - 36} cy={cy - 26} r={3} fill={mixHex(w.color, "#000", 0.6)} />
                  </g>
                ) : null}
                {w.name === "Venus" ? (
                  <g fill="#C9A066" opacity={0.6}>
                    {[-60, -20, 25, 70].map((dy, k) => (
                      <path key={k} d={`M${w.x - r} ${cy + dy} q${r * 0.5} ${-18 - k * 4} ${r} 0 q${r * 0.5} ${18 + k * 4} ${r} 0`} fill="none" stroke="#C9A066" strokeWidth={10} opacity={0.5} />
                    ))}
                  </g>
                ) : null}
              </Form>
              {w.name === "Vesta" ? <path d={roundPoly(blobPts(w.x, cy, r + 1, 8, 4, 0.25), 3)} fill={w.color} /> : null}
              {/* mountain bar */}
              <rect x={w.x - 9} y={barBase - w.peak * barScale} width={18} height={w.peak * barScale} rx={4} fill={P.vermilion} />
              <rect x={w.x - 9} y={barBase - w.peak * barScale} width={6} height={w.peak * barScale} rx={3} fill={mixHex(P.vermilion, "#fff", 0.25)} />
              <Metric x={w.x} y={barBase - w.peak * barScale - 18} value={w.peakLabel} size={30} color={F.text} align="middle" />
              <text x={w.x} y={barBase + 34} textAnchor="middle" style={{ fontFamily: "'Outfit','Inter',sans-serif", fontWeight: 800, fontSize: 26, fill: F.text, letterSpacing: -0.3 }}>
                {w.name}
              </text>
              <text x={w.x} y={barBase + 60} textAnchor="middle" style={{ fontFamily: "'Outfit','Inter',sans-serif", fontWeight: 500, fontSize: 18, fill: F.dim }}>
                {w.peakName}
              </text>
            </g>
          );
        })}
        <line x1={300} y1={barBase} x2={1560} y2={barBase} stroke={F.dim} strokeWidth={1.5} opacity={0.6} />
        <Pill x={1440} y={cy - 40} text="Vesta · 525 km" fill={mixHex(F.sky[0], F.text, 0.15)} color={F.text} dot={F.second} size={16} align="middle" />
      </Layer>
      {/* Tick floating, not to scale, with a dry pill */}
      <Layer depth={1}>
        <Tick x={1680} y={700 + Math.sin(f / 90) * 10} pxPerM={64} frame={f} pose="cheer" expression="happy" tilt={-14 + Math.sin(f / 120) * 4} look={-0.5} facing={-1} seed={5} />
        <Pill x={1680} y={760} text="not to scale" fill={mixHex(F.sky[0], F.text, 0.15)} color={F.dim} size={15} align="middle" />
      </Layer>
      <Layer depth={0}>
        <Kicker x={120} y={128} text="Four worlds, one diameter scale" color={F.dim} size={20} />
        <Headline x={120} y={250} lines={["Tallest mountain", "on each world"]} size={88} color={F.text} accent={F.second} />
      </Layer>
    </Stage>
  );
};
