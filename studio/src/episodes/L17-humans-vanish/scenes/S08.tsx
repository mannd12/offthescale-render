// L17 scene "l08" (storyboard §3 "8 · One hundred thousand years: the tunnel", script lines 32-35). Package B.
// Shot components (hard cuts; PUSH rows are phases): 8-01 (+8-02: the walk down the bedrock ramp, then the chamber with
// the SAFETY CASE binder and its three bars) · 8-03 · 8-04 · 8-05 · 8-06 · 8-07 · 8-08 (the ONE MILLION YEARS RungCard).
// Numbers drawn (data17 READ): 1.8 BILLION YEARS OLD (#10 A, 8-01). Words only: THOUSANDS, HUNDREDS OF THOUSANDS, UP TO A
// MILLION, the POSIVA chip (#10 A); A PLAN (#10 A, 8-05); DEEP SEALED BURIED IN ROCK (#10 A, 8-07). The 8-06 dial word
// 100,000 YEARS is a SCALE_LABEL (no claim). 8-04 follows the 2026-11-16 line: three ice-sheet ghosts slide over while a
// scan line sweeps intact rock (no "suitable" claim drawn).
import React from "react";
import { useCurrentFrame } from "remotion";
import { Bloom, Layer, Motes, Stage, Tick, cameraAt, walkPhase } from "../../../lib/illustrated";
import { SceneTiming } from "../../../lib/timeline";
import { cueKit } from "../cues";
import { familyOf } from "../families";
import { READ } from "../data17";
import { RungBadge, RungCard, YearsDial, rungValue } from "../ladder";
import { TimeCamera } from "../rig";
import { SourceChip, TagStamp } from "../stamps17";
import { DotStream } from "../movers17";
import { ShotDef, ShotFC, playShots } from "../shots";
import { Cue, SFX, cutHit } from "./cue-types";
import { Big, C, CREAM, FamSky, INK, Label, Pop, RollDec, Rings, Strata, TextPlate, alpha, drawn, ez, lin, mixHex, mod, path1, rnd } from "./b-parts";

export const cuesL08 = (t: SceneTiming) => {
  const { at, frac } = cueKit(t);
  return {
    tunnel: 0, // 8-01
    binder: at(1), // 8-02 (phase)
    ice: frac(1, 0.54), // 8-03
    ghosts: at(2), // 8-04
    plan: frac(2, 0.46), // 8-05
    watch: frac(2, 0.75), // 8-06
    words: at(3), // 8-07
    rise: frac(3, 0.5), // 8-08
    end: t.frames,
  };
};
export type C08 = ReturnType<typeof cuesL08>;

const DEEP = familyOf("deep");
const NOON = familyOf("noon");
const ROCK = ["#5A2A1E", "#3A1812", "#4A1C16", "#2E1114", "#6A3020", "#3A1812"];

/** A lantern hanging from (x, y), swinging by `ang` degrees; its glow lights the tunnel. */
const Lantern: React.FC<{ x: number; y: number; ang: number; len?: number; glow?: number }> = ({ x, y, ang, len = 46, glow = 1 }) => {
  const a = (ang * Math.PI) / 180;
  const lx = x + Math.sin(a) * len;
  const ly = y + Math.cos(a) * len;
  return (
    <g>
      <Bloom x={lx} y={ly} r={420} color={C.lantern} strength={0.55 * glow} />
      <line x1={x} y1={y} x2={lx} y2={ly - 14} stroke="#2A160C" strokeWidth={3} />
      <rect x={lx - 13} y={ly - 16} width={26} height={34} rx={6} fill={C.lantern} stroke="#7A4A2E" strokeWidth={3} />
      <rect x={lx - 16} y={ly - 20} width={32} height={7} rx={3} fill="#7A4A2E" />
      <circle cx={lx} cy={ly + 1} r={7} fill="#FFFFFF" opacity={0.85} />
    </g>
  );
};

// ===============================================================================================================
// 8-01 + 8-02 · a cutaway of the bedrock; Tick walks the ramp down with a lantern (the camera tracks him: rock and
// tunnel ribs slide past, near ribs at depth 2.4 ≈ 17 px/f); the lantern swings (6 deg/f peak). Kicker (RungBadge) and
// '1.8 BILLION YEARS OLD' (#10 A). Phase 8-02: the ramp levels into a chamber; Tick opens the SAFETY CASE binder; three
// bars grow along a time strip (30 px/f, stagger 12 f): THOUSANDS · HUNDREDS OF THOUSANDS · UP TO A MILLION; POSIVA chip.
// ===============================================================================================================
const SLOPE = 0.58;
const RAMP_END = 1050;
const groundY = (x: number) => (x < RAMP_END ? x * SLOPE : RAMP_END * SLOPE);
const ShotTunnel: ShotFC<C08> = ({ f, c }) => {
  const p2 = c.binder - c.tunnel;
  const stopAt = p2 + 26;
  const vx = 7.2;
  const tx = Math.min(f, stopAt) * vx;
  const ty = groundY(tx);
  const walking = f < stopAt;
  const cam = { x: tx + 260 + 120 * ez(f, stopAt - 30, stopAt + 30), y: ty - 140 + 40 * ez(f, stopAt - 30, stopAt + 30), zoom: 1 + 0.08 * ez(f, stopAt, stopAt + 120) };
  const ppm = 170;
  const swing = Math.sin(f / 5.5) * (walking ? 16 : 9);
  // hand position (hold pose front hand, facing +x): [36, -104] local units, 100 units = 1 m
  const hx = tx + 36 * (ppm / 100);
  const hy = ty - 104 * (ppm / 100);
  const tunnelPath = (off: number) => `M-1200 ${-1200 * SLOPE + off} L${RAMP_END} ${RAMP_END * SLOPE + off} L3200 ${RAMP_END * SLOPE + off}`;
  const bx = RAMP_END + 380;
  const by = groundY(bx);
  const open = ez(f, stopAt - 4, stopAt + 14);
  const g = f - p2;
  const bars = [
    { w: 260, label: "THOUSANDS" },
    { w: 560, label: "HUNDREDS OF THOUSANDS" },
    { w: 860, label: "UP TO A MILLION" },
  ];
  return (
    <Stage theme={DEEP.theme} cam={cam} vignette={0.35} grain={0.5}>
      <Layer depth={0.05}>
        <FamSky name="deep" />
      </Layer>
      <Layer depth={0.6}>
        <Strata y0={-1600} depth={4000} palette={ROCK} seed={12} x0={-1600} x1={3600} minH={80} maxH={220} />
      </Layer>
      <Layer depth={1}>
        {/* the tunnel bore: a dark band along the ramp, its floor, its ceiling */}
        <path d={tunnelPath(-150)} fill="none" stroke="#120607" strokeWidth={330} strokeLinejoin="round" />
        <path d={tunnelPath(-150)} fill="none" stroke="#2A0F10" strokeWidth={300} strokeLinejoin="round" />
        <path d={tunnelPath(0)} fill="none" stroke="#5A2A1E" strokeWidth={14} strokeLinejoin="round" />
        <path d={tunnelPath(-300)} fill="none" stroke="#4A1C16" strokeWidth={12} strokeLinejoin="round" />
        {/* the chamber: a rounded room past the ramp's end, small side chambers */}
        <rect x={RAMP_END + 80} y={by - 380} width={900} height={390} rx={140} fill="#2A0F10" />
        {[0, 1, 2].map((i) => (
          <rect key={i} x={RAMP_END + 1050 + i * 220} y={by - 230} width={150} height={230} rx={60} fill="#1A0A0C" stroke="#4A1C16" strokeWidth={6} />
        ))}
        {/* support ribs every 220 px along the ramp */}
        {Array.from({ length: 16 }, (_, i) => {
          const rx = -800 + i * 220;
          const ry = groundY(Math.max(-1200, rx));
          const gy = rx < RAMP_END ? rx * SLOPE : RAMP_END * SLOPE;
          return <path key={i} d={`M${rx} ${gy} L${rx} ${(rx < RAMP_END ? ry : gy) - 300} `} stroke="#6A3020" strokeWidth={14} opacity={0.8} />;
        })}
        {/* the binder on a crate */}
        <rect x={bx - 70} y={by - 90} width={140} height={90} rx={8} fill="#6A3020" />
        <rect x={bx - 70} y={by - 90} width={140} height={10} fill="#8F4420" />
        <g transform={`translate(${bx} ${by - 92})`}>
          <rect x={-60} y={-14} width={120} height={14} rx={3} fill="#1C6E78" />
          <g transform={`scale(1 ${1 - open}) translate(0 0)`}>
            <rect x={-60} y={-28} width={120} height={14} rx={3} fill="#2FBFA8" />
          </g>
          {open > 0.5
            ? Array.from({ length: 3 }, (_, k) => {
                const ph = mod((g + k * 7) / 21, 1);
                const sx = Math.cos(ph * Math.PI);
                return <rect key={k} x={0} y={-60} width={56 * sx} height={46} fill={C.paper} stroke="#C9B48A" strokeWidth={1.5} transform="rotate(0)" />;
              })
            : null}
          {open > 0.5 ? <rect x={-56} y={-60} width={56} height={46} fill={C.paper} stroke="#C9B48A" strokeWidth={1.5} /> : null}
          <Label x={0} y={-36} text="SAFETY CASE" size={11} color={INK} align="middle" opacity={1 - open} />
        </g>
        <ellipse cx={tx + 8} cy={ty + 4} rx={60} ry={10} fill="#000" opacity={0.35} />
        <Tick x={tx} y={ty} pxPerM={ppm} frame={f} pose="hold" walk={walking ? walkPhase(f, 22) : undefined} expression={walking ? "neutral" : "thinking"} look={walking ? 0.2 : -0.1} tilt={walking ? 6 : 0} />
        <Lantern x={hx} y={hy} ang={swing} />
      </Layer>
      <Layer depth={2.4}>
        {/* near rock edges framing the bore (foreground parallax) */}
        {Array.from({ length: 9 }, (_, i) => {
          const x = -400 + i * 520 + rnd(i * 3) * 120;
          const y = x * SLOPE * 0.75 + 520;
          return <path key={i} d={`M${x} ${y} l120 -60 l160 40 l40 220 l-320 30 Z`} fill="#0C0405" opacity={0.92} />;
        })}
      </Layer>
      <Layer depth={0}>
        <RungBadge f={f} rung={7} family={DEEP} from={6} />
        <g opacity={ez(f, 20, 34) * (1 - ez(f, p2 - 14, p2))}>
          <TextPlate x={1060} y={830} w={790} h={160} color="#1A0A0C" opacity={0.78} />
          <RollDec x={1095} y={942} value={READ.bedrockAge.value! /* #10 A */} k={ez(f, 24, 70)} unit="BILLION YEARS OLD" size={96} color={CREAM} unitColor={C.lantern} who="8-01 bedrock" />
        </g>
        {g > -10 ? (
          <g opacity={ez(g, -10, 4)}>
            <TextPlate x={120} y={120} w={1000} h={330} color="#1A0A0C" opacity={0.78} />
            <line x1={170} y1={410} x2={1080} y2={410} stroke="#E0B49A" strokeWidth={4} />
            {bars.map((b, i) => {
              const k = lin(g, 8 + i * 12, 8 + i * 12 + b.w / 30);
              return (
                <g key={i}>
                  <rect x={170} y={180 + i * 74} width={b.w * k} height={40} rx={8} fill={[C.amber, C.saffron, C.lantern][i]} />
                  <Label x={180 + b.w * k + 14} y={210 + i * 74} text={b.label} size={22} color={CREAM} opacity={ez(g, 8 + i * 12 + b.w / 30 - 4, 8 + i * 12 + b.w / 30 + 4)} />
                </g>
              );
            })}
            <SourceChip x={170} y={155} name="POSIVA" size={18} appear={ez(g, 2, 12)} />
          </g>
        ) : null}
      </Layer>
    </Stage>
  );
};

// ===============================================================================================================
// 8-03 · ice sheets slide over the surface above the tunnel, pull back and return (three passes, ~25 px/f edges);
// below, the tunnel stays dark and dry with one lantern glow. #10 A.
// ===============================================================================================================
const IceSheet: React.FC<{ edge: number; y: number; thick: number; f: number; ghost?: boolean; opacity?: number }> = ({ edge, y, thick, f, ghost = false, opacity = 1 }) => {
  const d = `M-600 ${y} L-600 ${y - thick} L${edge - thick * 1.3} ${y - thick} Q${edge} ${y - thick * 0.9} ${edge + 30} ${y} Z`;
  if (ghost) return <path d={d} fill={alpha(C.ice, 0.18 * opacity)} stroke={C.ice} strokeWidth={5} strokeDasharray="18 12" opacity={opacity} />;
  return (
    <g opacity={opacity}>
      <path d={d} fill="#CFEFF2" />
      <path d={`M-600 ${y - thick} L${edge - thick * 1.3} ${y - thick} Q${edge} ${y - thick * 0.9} ${edge + 30} ${y}`} fill="none" stroke="#FFFFFF" strokeWidth={8} />
      {Array.from({ length: 8 }, (_, i) => {
        const cx = edge - 120 - i * 190;
        return cx > -600 ? <path key={i} d={`M${cx} ${y - thick + 14} l-30 ${thick * 0.55}`} stroke="#7FD0E8" strokeWidth={5} opacity={0.7} /> : null;
      })}
      <rect x={-600} y={y - 24} width={edge + 560} height={24} fill="#7FBFD0" opacity={0.6} />
      <Motes frame={f} n={10} x={Math.max(-600, edge - 900)} y={y - thick - 80} w={900} h={80} color="#FFFFFF" seed={4} size={3} drift={20} />
    </g>
  );
};
const ShotIce: ShotFC<C08> = ({ f }) => {
  const surf = 400;
  const edge = 520 + 900 * (0.5 - 0.5 * Math.cos((f / 55) * Math.PI * 2 + 0.2));
  return (
    <Pop f={f}>
      <Stage theme={DEEP.theme} shotFrame={f} drift={{ zoom: 1.04, panX: 0.006, panY: 0, frames: 200, seed: 3 }} vignette={0.35} grain={0.5}>
        <Layer depth={0.05}>
          <rect x={-600} y={-600} width={3200} height={1100} fill="#0A1A22" />
          <rect x={-600} y={200} width={3200} height={220} fill="#14303A" opacity={0.8} />
        </Layer>
        <Layer depth={1}>
          <Strata y0={surf} depth={1200} palette={ROCK} seed={21} minH={70} maxH={160} />
          <rect x={-600} y={surf - 6} width={3200} height={12} fill="#6A3020" />
          {/* the repository far below: dark, dry, one lantern */}
          <rect x={560} y={820} width={900} height={110} rx={50} fill="#120607" stroke="#4A1C16" strokeWidth={6} />
          <line x1={1010} y1={420} x2={1010} y2={820} stroke="#120607" strokeWidth={50} />
          <Bloom x={1300} y={880} r={200} color={C.lantern} strength={0.6} />
          <circle cx={1300} cy={880} r={9} fill={C.lantern} />
          <IceSheet edge={edge} y={surf} thick={190} f={f} />
        </Layer>
        <Layer depth={1.2}>
          <Motes frame={f} n={14} w={1920} h={1080} color="#E0B49A" seed={9} size={3} drift={20} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 8-04 · a rock section: three ice-sheet ghosts (dashed) slide over it in turn (16 px/f) while a scan line sweeps the
// rock beneath (30 px/f) and it stays whole (the 2026-11-16 line: checked against future ice ages). #10 A.
// ===============================================================================================================
const ShotScan: ShotFC<C08> = ({ f }) => {
  const surf = 330;
  const sx = mod(f * 30, 2200) - 140;
  return (
    <Pop f={f}>
      <Stage theme={DEEP.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.008, panY: 0, frames: 200, seed: 5 }} vignette={0.35} grain={0.5}>
        <Layer depth={0.05}>
          <rect x={-600} y={-600} width={3200} height={1000} fill="#0A1A22" />
        </Layer>
        <Layer depth={1}>
          <Strata y0={surf} depth={1300} palette={ROCK} seed={33} minH={60} maxH={140} />
          <rect x={-600} y={surf - 6} width={3200} height={12} fill="#6A3020" />
          <rect x={700} y={700} width={560} height={90} rx={45} fill="#120607" stroke="#6A3020" strokeWidth={6} />
          {[0, 1, 2].map((i) => {
            const s = 6 + i * 48;
            const k = f - s;
            if (k < 0 || k > 80) return null;
            return <IceSheet key={i} edge={-200 + k * 16 * 1.4} y={surf} thick={170 - i * 20} f={f} ghost opacity={Math.min(1, k / 8, (80 - k) / 14)} />;
          })}
          {/* the scan line and its glow, sweeping the intact rock */}
          <rect x={sx - 60} y={surf + 10} width={120} height={900} fill={C.lantern} opacity={0.12} />
          <line x1={sx} y1={surf + 10} x2={sx} y2={1200} stroke={C.lantern} strokeWidth={6} />
          <circle cx={sx} cy={surf + 10} r={12} fill={C.saffronCore} />
          <path d={`M${Math.max(-600, sx - 400)} ${surf + 30} L${sx} ${surf + 30}`} stroke={C.lantern} strokeWidth={3} strokeDasharray="6 10" opacity={0.6} />
        </Layer>
        <Layer depth={1.2}>
          <Motes frame={f} n={14} w={1920} h={1080} color="#E0B49A" seed={11} size={3} drift={20} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 8-05 · an A PLAN tag stamps beside a dashed tunnel outline that draws itself (30 px/f); Tick stamps it, steps back.
// ===============================================================================================================
const PLAN_D = "M260 300 L760 590 L1180 590 M820 590 L820 760 M960 590 L960 760 M1100 590 L1100 760 M760 590 L760 760 L1180 760 L1180 590";
const ShotPlan: ShotFC<C08> = ({ f }) => (
  <Pop f={f}>
    <Stage theme={DEEP.theme} shotFrame={f} drift={{ zoom: 1.05, panX: -0.008, panY: 0, frames: 200, seed: 7 }} vignette={0.35} grain={0.5}>
      <Layer depth={0.05}>
        <FamSky name="deep" />
      </Layer>
      <Layer depth={0.6}>
        <Strata y0={-200} depth={1600} palette={ROCK} seed={41} minH={90} maxH={200} />
      </Layer>
      <Layer depth={1}>
        <Bloom x={760} y={200} r={700} color={C.lantern} strength={0.32} />
        <path d={PLAN_D} fill="none" stroke={C.lantern} strokeWidth={12} strokeDasharray="22 16" strokeLinecap="round" opacity={0.25} />
        <path d={PLAN_D} fill="none" stroke={C.lantern} strokeWidth={8} strokeLinecap="round" {...drawn(lin(f, 0, 64))} />
        <ellipse cx={1520} cy={986} rx={120} ry={16} fill="#000" opacity={0.35} />
        <Tick x={1520 + 40 * ez(f, 40, 60)} y={980} pxPerM={280} frame={f} facing={-1} pose={f < 36 ? "press" : "stand"} expression={f < 40 ? "determined" : "proud"} />
      </Layer>
      <Layer depth={0}>
        <TagStamp x={1160} y={330} word="A PLAN" age={f - 30} size={170} f={f} />
      </Layer>
    </Stage>
  </Pop>
);

// ===============================================================================================================
// 8-06 · the capped camera on its tripod beside the YEARS dial at 100,000 YEARS; the needle ticks toward the next mark
// and slips back, never reaching it. Tick beside the dial, hands out. MOVER: needle ticks (4.8° per tick) + push.
// ===============================================================================================================
const ShotWatch: ShotFC<C08> = ({ f, len }) => {
  const n = Math.floor(f / 7);
  const local = f - n * 7;
  const seq = [0, 1, 2, 3, 4, 2, 1, 2, 3, 4, 5, 3, 1, 2, 3, 4];
  const s0 = seq[n % seq.length];
  const s1 = seq[(n + 1) % seq.length];
  const step = s0 + (s1 - s0) * Math.min(1, local / 2);
  const v = rungValue(7) + step * 0.018;
  const cam = cameraAt(f, [
    { f: 0, x: 960, y: 560, zoom: 1.0 },
    { f: len, x: 1010, y: 540, zoom: 1.12 },
  ]);
  return (
    <Pop f={f}>
      <Stage theme={DEEP.theme} cam={cam} vignette={0.35} grain={0.5}>
        <Layer depth={0.05}>
          <FamSky name="deep" />
        </Layer>
        <Layer depth={0.5}>
          <Strata y0={-300} depth={1800} palette={ROCK} seed={45} minH={90} maxH={220} />
        </Layer>
        <Layer depth={1}>
          <rect x={-600} y={900} width={3200} height={400} fill="#1A0A0C" />
          <Bloom x={900} y={600} r={620} color={C.lantern} strength={0.3} />
          <TimeCamera x={480} y={910} size={240} f={f} family={DEEP} capped facing={1} />
          <ellipse cx={880} cy={916} rx={100} ry={14} fill="#000" opacity={0.35} />
          <Tick x={880} y={910} pxPerM={240} frame={f} pose="shrug" expression="thinking" look={0.4} />
          <YearsDial x={1420} y={480} r={260} value={v} family={DEEP} f={f} plate="dark" word="100,000 YEARS" />
        </Layer>
        <Layer depth={1.3}>
          <DotStream f={f} from={[960, -80]} to={[960, 1160]} n={30} speed={14} spread={980} color="#E0B49A" size={3} seed={13} />
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 8-07 · four words slide in over the tunnel (24 px/f, stagger 10 f) as a plug door slides shut (18 px/f); a seal
// ring pulses round the door; dust falls. Words: DEEP · SEALED · BURIED · IN ROCK (#10 A).
// ===============================================================================================================
const ShotSeal: ShotFC<C08> = ({ f }) => {
  const doorX = 1840 - 560 * ez(f, 10, 10 + 560 / 18);
  const shut = doorX <= 1300;
  const words = ["DEEP", "SEALED", "BURIED", "IN ROCK"];
  return (
    <Pop f={f}>
      <Stage theme={DEEP.theme} shotFrame={f} drift={{ zoom: 1.05, panX: 0.008, panY: 0, frames: 200, seed: 9 }} vignette={0.35} grain={0.5}>
        <Layer depth={0.05}>
          <FamSky name="deep" />
        </Layer>
        <Layer depth={0.6}>
          <Strata y0={-300} depth={1800} palette={ROCK} seed={51} minH={80} maxH={200} />
        </Layer>
        <Layer depth={1}>
          {/* the tunnel mouth: a round bore, lit inside */}
          <circle cx={1280} cy={540} r={300} fill="#120607" />
          <Bloom x={1280} y={600} r={280} color={C.lantern} strength={0.45 * (shut ? 0.3 : 1)} />
          <circle cx={1280} cy={540} r={300} fill="none" stroke="#6A3020" strokeWidth={24} />
          {/* the plug door, sliding left over the bore */}
          <g transform={`translate(${doorX - 1280} 0)`}>
            <circle cx={1280} cy={540} r={290} fill="#8F4420" />
            <circle cx={1280} cy={540} r={250} fill="#B9653A" />
            <circle cx={1280} cy={540} r={250} fill="none" stroke={C.saffron} strokeWidth={10} />
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const a = (i / 6) * Math.PI * 2;
              return <circle key={i} cx={1280 + Math.cos(a) * 205} cy={540 + Math.sin(a) * 205} r={14} fill={C.saffronDeep} />;
            })}
            <rect x={1180} y={520} width={200} height={40} rx={20} fill="#6A3020" />
          </g>
          {shut ? <Rings f={f - 42} cx={1280} cy={540} r0={300} every={22} speed={8} maxR={480} color={C.lantern} width={6} /> : null}
        </Layer>
        <Layer depth={1.3}>
          <DotStream f={f} from={[960, -80]} to={[960, 1160]} n={26} speed={15} spread={980} color="#E0B49A" size={3} seed={17} />
        </Layer>
        <Layer depth={0}>
          {words.map((w, i) => {
            const s = 6 + i * 10;
            const k = ez(f, s, s + 14);
            return <Big key={w} x={120 - (1 - k) * 340} y={290 + i * 160} text={w} size={128} color={i === 3 ? C.lantern : CREAM} opacity={k} />;
          })}
        </Layer>
      </Stage>
    </Pop>
  );
};

// ===============================================================================================================
// 8-08 · "Now let's climb the last rung": the ground opens and the camera pops up into daylight (rock sliding down out
// of frame at 28 px/f), then clouds slide; RungCard ONE MILLION YEARS (hold 1.5 s), dial rolling, the top rung glows.
// ===============================================================================================================
const ShotRise: ShotFC<C08> = ({ f, len }) => (
  <RungCard
    family={NOON}
    kicker="Off the Scale"
    title="ONE MILLION YEARS"
    t={f / len}
    frame={f}
    rung={8}
    from={7}
    behind={(fr) => {
      const off = Math.min(fr, 46) * 28;
      return (
        <g>
          {Array.from({ length: 3 }, (_, i) => {
            const w = 460 + rnd(i * 7) * 220;
            const x = mod(i * 900 + 200 - fr * 9, 2700) - 500;
            return <ellipse key={i} cx={x} cy={180 + i * 90} rx={w / 2} ry={w * 0.13} fill="#FFF8EA" opacity={0.85} />;
          })}
          <path d={`M-100 ${880 + off * 0.2} Q500 ${820 + off * 0.2} 1000 ${870 + off * 0.2} T2100 ${850 + off * 0.2} L2100 1200 L-100 1200 Z`} fill={NOON.mid} opacity={ez(fr, 20, 50)} />
          <g transform={`translate(0 ${off})`}>
            <Strata y0={-120} depth={1400} palette={ROCK} seed={61} minH={90} maxH={200} x0={-200} x1={2200} />
          </g>
        </g>
      );
    }}
  />
);

// ===============================================================================================================

export const SceneL08: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const f = useCurrentFrame();
  const c = cuesL08(t);
  const shots: ShotDef<C08>[] = [
    { from: 0, S: ShotTunnel, id: "8-01" }, // + 8-02 (PUSH)
    { from: c.ice, S: ShotIce, id: "8-03" },
    { from: c.ghosts, S: ShotScan, id: "8-04" },
    { from: c.plan, S: ShotPlan, id: "8-05" },
    { from: c.watch, S: ShotWatch, id: "8-06" },
    { from: c.words, S: ShotSeal, id: "8-07" },
    { from: c.rise, S: ShotRise, id: "8-08" },
  ];
  return playShots(f, shots, c, c.end);
};

/** Spot SFX (scene-relative frames). Files: studio/public/audio/LICENSES.md (Mixkit). */
export const soundL08 = (t: SceneTiming): Cue[] => {
  const c = cuesL08(t);
  return [
    { at: 0, file: SFX.rumble, vol: 0.12, dur: 150, fadeIn: 10, fadeOut: 40 },
    ...[0, 1, 2].map((i) => ({ at: c.binder + 8 + i * 12, file: SFX.click, vol: 0.1, dur: 8 })),
    ...cutHit(c.ice),
    { at: c.ice + 4, file: SFX.wind, vol: 0.14, dur: 150, fadeIn: 10, fadeOut: 40 },
    ...cutHit(c.ghosts),
    ...cutHit(c.plan),
    { at: c.plan + 30, file: SFX.click, vol: 0.12, dur: 8 },
    { at: c.plan + 32, file: SFX.boom, vol: 0.3 * 0.7, dur: 90, fadeOut: 30 },
    ...cutHit(c.watch),
    ...cutHit(c.words),
    ...[0, 1, 2, 3].map((i) => ({ at: c.words + 6 + i * 10, file: SFX.click, vol: 0.1, dur: 8 })),
    { at: c.words + 36, file: SFX.uBoom, vol: 0.16, dur: 90, fadeOut: 30 },
    ...cutHit(c.rise),
    { at: c.rise, file: SFX.riser, vol: 0.18, dur: 90, fadeOut: 20 },
    { at: c.rise + 40, file: SFX.boom, vol: 0.3, dur: 120, fadeOut: 40 },
  ];
};
