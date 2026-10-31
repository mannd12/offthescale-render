import React from "react";
import { B } from "../../brand/tokens";

const rnd = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

export const RING_FRONT = { x: 700, y: 755 };

/**
 * The video's spine: THE ring. One drawing with one geometry, used in the cold open, level 2, level 11 and the recap,
 * so it is visibly the same machine. Cold magnets in aqua all round; the beams run opposite ways and meet at the front.
 * Drawn because CERN's own imagery is not CC-BY (assets.md). Not to scale.
 */
export const Ring: React.FC<{ frame: number; draw?: number; cold?: number; beams?: number; flash?: number; opacity?: number; x?: number; y?: number; k?: number }> = ({ frame, draw = 1, cold = 1, beams = 0, flash = 0, opacity = 1, x = 0, y = 0, k = 1 }) => {
  if (opacity <= 0) return null;
  const cx = 700;
  const cy = 540;
  const rx = 470;
  const ry = 215;
  const path = `M${cx} ${cy + ry} A${rx} ${ry} 0 1 1 ${cx} ${cy - ry} A${rx} ${ry} 0 1 1 ${cx} ${cy + ry}`;
  const at = (a: number) => [cx + Math.sin(a) * rx, cy + Math.cos(a) * ry] as const; // a=0 is the front, where the beams meet
  const L = 2300; // a little over the ellipse's length, for the draw-on
  const sweep = (frame * 0.09) % (Math.PI * 2);
  const done = draw >= 1 ? 1 : 0;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity, overflow: "visible" }}>
      <g transform={`translate(${x} ${y}) translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})`}>
        <path d={path} fill="rgba(25,195,230,0.05)" stroke="#2A4A63" strokeWidth={58} strokeDasharray={`${L * draw} ${L}`} />
        {/* the magnets: a long chain of short cold segments */}
        <path d={path} fill="none" stroke={cold > 0.5 ? B.aqua : "#8CA0B3"} strokeWidth={30} strokeDasharray="44 10" opacity={done * (0.55 + 0.35 * cold + 0.06 * Math.sin(frame / 14))} />
        <path d={path} fill="none" stroke="#0B1B2B" strokeWidth={8} opacity={done * 0.8} />
        {/* four detectors: the same four blocks every time */}
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((a) => {
          const [px, py] = at(a);
          return <rect key={a} x={px - 34} y={py - 34} width={68} height={68} rx={12} fill="#16283A" stroke={B.paper} strokeWidth={4} opacity={done} />;
        })}
        {beams > 0
          ? [1, -1].map((dir) =>
              [0, 1, 2, 3, 4, 5].map((j) => {
                const [px, py] = at(dir * (sweep - j * 0.045));
                return <circle key={`${dir}${j}`} cx={px} cy={py} r={13 - j * 1.6} fill={dir > 0 ? B.gauge : B.tease} opacity={beams * (1 - j * 0.15)} />;
              }),
            )
          : null}
        {flash > 0 ? (
          <g>
            <defs><radialGradient id="l08-flash"><stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" /><stop offset="0.45" stopColor={B.gauge} stopOpacity="0.5" /><stop offset="1" stopColor={B.tease} stopOpacity="0" /></radialGradient></defs>
            <circle cx={cx} cy={cy + ry} r={70 + 130 * flash} fill="url(#l08-flash)" />
            {Array.from({ length: 22 }, (_, i) => {
              const a = rnd(i) * Math.PI * 2;
              const r = 70 + rnd(i + 40) * 130 + ((frame * (1 + rnd(i + 90) * 3)) % 50);
              return <line key={i} x1={cx + Math.cos(a) * 30} y1={cy + ry + Math.sin(a) * 30} x2={cx + Math.cos(a) * r} y2={cy + ry + Math.sin(a) * r} stroke={i % 2 ? B.tease : B.gauge} strokeWidth={4} opacity={flash} />;
            })}
          </g>
        ) : null}
      </g>
    </svg>
  );
};
