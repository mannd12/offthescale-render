import React from "react";
import { useCurrentFrame } from "remotion";
import { CaptionPop } from "../../../brand/kit";
import { B, F } from "../../../brand/tokens";
import { SceneTiming, lineAt, within } from "../../../lib/timeline";
import { ease } from "../../../lib/ui";
import { NumberCard, RungShell, Tag } from "./shell";

const MEME = ["Surface Web", "Bergie Web", "Deep Web", "Dark Web", "Marianas Web", "The Fog", "Primarch"];
const REAL = new Set([0, 2, 3]);
// rendered widths of the names at 48 px Anton (measured on the l4now frames), for the underlines and strikes
const MEME_W = [238, 214, 186, 178, 272, 145, 175];

/**
 * Cold open. Lines 0-4. The meme chart, redrawn, and made to move on every sentence: the camera starts on the tip
 * and pulls back on "enormous"; the seven names arrive on "seven or eight levels"; the bottom three are bracketed
 * "too dangerous to name"; on "a meme" four are stamped, the three real ones underlined, "the rest" struck; on "the
 * honest version" the fakes slide off, a dot goes down the real levels, stops at the myth line, then "keeps going"
 * with the camera through a berg that now runs off the bottom of the frame. Source #5 (the chart is a meme).
 * All drawing sits in one world layer (the camera); captions stay outside it (CSS trap: a transformed wrapper).
 */
export const ColdOpen: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const chartAt = within(t, 0, 0.04);
  const tipAt = within(t, 0, 0.48); // "the little tip you can search"
  const massAt = within(t, 0, 0.74); // "and the enormous dark mass underneath"
  const namesAt = within(t, 1, 0.2); // "...tells you there are seven or eight levels"
  const dangerAt = within(t, 1, 0.66); // "the bottom ones are too dangerous to name"
  const memeAt = within(t, 2, 0.26); // "Most of that picture is a meme."
  const threeAt = within(t, 2, 0.33); // "Three of the levels are real."
  const restAt = within(t, 2, 0.64); // "The rest were invented on a forum."
  const honestAt = within(t, 3, 0.06); // "So here is the honest version."
  const downAt = within(t, 3, 0.14); // "We go down the real levels,"
  const stopAt = within(t, 3, 0.27); // "we stop at the exact line where the myth begins"
  const goAt = within(t, 3, 0.55); // "— and then we keep going."
  const underAt = within(t, 3, 0.62); // "Because there is something under the dark web."
  const oneAt = lineAt(t, 4);
  const chart = ease(frame, chartAt, 14) * (1 - ease(frame, oneAt, 10));
  // camera: close on the tip (with a slow push), pulls back on "enormous"; pans down with the dot on "keep going"
  const pull = ease(frame, massAt, 40);
  const zoom = (1.55 + 0.08 * Math.min(1, Math.max(0, frame - chartAt) / (massAt - chartAt))) * (1 - pull) + pull;
  const pan = -270 * ease(frame, goAt, 50);
  const body = ease(frame, massAt, 36);
  const grow = ease(frame, goAt, 50);
  const fakesOff = ease(frame, honestAt, 24);
  // the dot: tip (y 300) to just above the myth line (y 584; below Dark Web's underline at 556-562) on "we go down",
  // then on through it to y 820 (screen y 550 after the pan, clear of the "?" below it)
  const dotY = 300 + 250 * ease(frame, downAt, 60) + 270 * ease(frame, goAt, 50);
  const dotOn = ease(frame, downAt - 6, 8) * (1 - ease(frame, oneAt, 8));
  const ROW_Y = (i: number) => 250 + i * 80;
  const BOT = 800 + 620 * grow;
  return (
    <RungShell t={t} index={-1} sceneId="cold" reading="the tip" sub="what you can search" plate={null} credit={{ kind: "illustration" }} chromeFrom={oneAt}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: chart, transform: `translateY(${pan}px) scale(${zoom})`, transformOrigin: "760px 300px" }}>
        <svg width={1920} height={1600} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <defs>
            <clipPath id="cold-body">
              <rect x={0} y={350} width={1920} height={1300 * body} />
            </clipPath>
            <clipPath id="cold-under">
              <rect x={0} y={584} width={1920} height={1100} />
            </clipPath>
          </defs>
          {/* the underwater mass fills downward on "enormous dark mass underneath"; on "keep going" it runs on off the frame */}
          <path d={`M620 350 L 900 350 L 960 420 L 920 700 L ${920 + 30 * grow} ${700 + 260 * grow} L 760 ${BOT} L ${600 - 30 * grow} ${700 + 260 * grow} L 600 700 L 560 420 Z`} fill="#0B3A5E" stroke="rgba(255,255,255,0.6)" strokeWidth={3} clipPath="url(#cold-body)" />
          {/* below the myth line the berg goes darker once we "keep going" */}
          <path d={`M560 420 L 960 420 L 920 700 L ${920 + 30 * grow} ${700 + 260 * grow} L 760 ${BOT} L ${600 - 30 * grow} ${700 + 260 * grow} L 600 700 Z`} fill="#04182A" opacity={0.75 * grow} clipPath="url(#cold-under)" />
          <path d="M700 250 L 820 250 L 900 350 L 620 350 Z" fill={B.paper} />
          {/* "the little tip you can search": the tip glows */}
          <path d="M700 250 L 820 250 L 900 350 L 620 350 Z" fill="none" stroke={B.gauge} strokeWidth={6} opacity={ease(frame, tipAt, 10) * (0.6 + 0.4 * Math.sin(frame / 5)) * (1 - ease(frame, namesAt, 10))} />
          {/* the waterline draws across first; it stops short of the labels column (x 1000) */}
          <line x1={480} y1={350} x2={480 + 500 * ease(frame, chartAt, 20)} y2={350} stroke={B.aqua} strokeWidth={3} />
          {/* "we stop at the exact line where the myth begins" */}
          <line x1={520} y1={584} x2={520 + 800 * ease(frame, stopAt, 24)} y2={584} stroke={B.tease} strokeWidth={6} strokeDasharray="16 10" />
          {/* "too dangerous to name": a bracket round the bottom three names */}
          <path d="M1290 575 h 22 v 210 h -22" stroke={B.tease} strokeWidth={5} fill="none" opacity={ease(frame, dangerAt, 10) * (1 - ease(frame, memeAt, 8))} />
          {/* the dot that goes down the real levels */}
          <circle cx={760} cy={dotY} r={20} fill={B.gauge} stroke={B.ink} strokeWidth={4} opacity={dotOn} />
          <circle cx={760} cy={dotY} r={20 + 14 * ((frame % 30) / 30)} fill="none" stroke={B.gauge} strokeWidth={3} opacity={dotOn * (1 - (frame % 30) / 30)} />
          {/* "there is something under the dark web": something, not a name */}
          <text x={760} y={1000} textAnchor="middle" fontFamily={F.headline} fontSize={150} fill={B.gauge} opacity={ease(frame, underAt, 12) * (0.88 + 0.12 * Math.sin(frame / 7))}>?</text>
        </svg>
        <Tag x={760} y={192} align="center" size={28} color={B.gauge} opacity={ease(frame, tipAt, 10) * (1 - ease(frame, honestAt, 10))}>the little tip you can search</Tag>
        <Tag x={1330} y={660} size={30} color={B.tease} opacity={ease(frame, dangerAt, 10) * (1 - ease(frame, memeAt, 8))}>too dangerous to name</Tag>
        {/* the myth line's label sits in the row the fake "Marianas Web" just left */}
        <Tag x={1000} y={598} size={30} color={B.tease} opacity={ease(frame, stopAt + 12, 10)}>where the myth begins</Tag>
        {MEME.map((m, i) => {
          const real = REAL.has(i);
          const k = [1, 4, 5, 6].indexOf(i);
          const stamped = !real && frame >= memeAt + k * 6;
          // a real name lights when the dot passes its row
          const lit = real && dotOn > 0 && dotY >= ROW_Y(i) + 20 ? 1 : 0;
          return (
            <div key={m} style={{ position: "absolute", left: 1000, top: ROW_Y(i), opacity: ease(frame, namesAt + i * 7, 8) * (real ? 1 : 1 - fakesOff), transform: `translateX(${(1 - ease(frame, namesAt + i * 7, 10)) * 60 + (real ? 0 : 220 * fakesOff)}px)`, fontFamily: F.headline, fontSize: 48, color: lit ? B.gauge : real || frame < memeAt ? B.paper : B.mute, whiteSpace: "nowrap" }}>
              {m}
              {/* "Three of the levels are real": underlined; "The rest were invented": struck */}
              {real ? <div style={{ position: "absolute", left: 0, top: 66, height: 6, borderRadius: 3, background: B.gauge, width: MEME_W[i] * ease(frame, threeAt + [0, 0, 6, 12][i], 10) }} /> : null}
              {!real ? <div style={{ position: "absolute", left: 0, top: 34, height: 6, borderRadius: 3, background: B.tease, width: MEME_W[i] * ease(frame, restAt + k * 5, 10) }} /> : null}
              {stamped ? <span style={{ marginLeft: 20, padding: "4px 14px", borderRadius: 8, background: B.tease, color: B.paper, fontFamily: F.ui, fontWeight: 800, fontSize: 30, transform: `rotate(-6deg) scale(${1.6 - 0.6 * ease(frame, memeAt + k * 6, 6)})`, display: "inline-block" }}>MEME</span> : null}
            </div>
          );
        })}
      </div>
      <div style={{ opacity: ease(frame, threeAt, 10) * (1 - ease(frame, honestAt, 8)) }}>
        <CaptionPop bottom={150} size={88} color={B.paper}>
          <span style={{ color: B.gauge }}>three</span> of these are real
        </CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, underAt, 10) * (1 - ease(frame, oneAt, 8)) }}>
        <CaptionPop bottom={150} size={80} color={B.paper}>
          there <span style={{ color: B.gauge }}>is</span> something under the dark web
        </CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, oneAt + 6, 10) }}>
        <CaptionPop bottom={150} size={84}>level one: the only part you have ever searched</CaptionPop>
      </div>
    </RungShell>
  );
};

/** 1 · The surface web. Lines 0-9. Sources #14, #15 (Google: crawlers, the index "like the back of a book",
 *  hundreds of billions of pages / >100,000,000 GB, indexing not guaranteed); #1 (Bergman 2001). */
export const Surface: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const typeAt = within(t, 0, 0.3);
  const crawlAt = lineAt(t, 1);
  const indexAt = lineAt(t, 2);
  const bigAt = lineAt(t, 3);
  const cutAt = lineAt(t, 4);
  const bookAt = lineAt(t, 5);
  const feelsAt = lineAt(t, 6);
  const bergmanAt = lineAt(t, 7); // "In 2001 a researcher..."
  const nameAt = within(t, 7, 0.12); // "named Michael Bergman"
  const deepAt = within(t, 7, 0.5); // "— 'the deep web' —"
  const estAt = within(t, 7, 0.58); // "and estimated it at something like"
  const fiveAt = within(t, 7, 0.74); // "five hundred times"
  const oneEstAt = within(t, 8, 0.05); // "That was one estimate,"
  const quarterAt = within(t, 8, 0.15); // "a quarter of a century ago"
  const nobodyAt = within(t, 8, 0.33); // "and nobody has properly measured it since"
  const pointAt = within(t, 8, 0.58); // "But the point survives:"
  const smallAt = within(t, 8, 0.86); // "...is the small part."
  const teaseAt = lineAt(t, 9);
  const bergOut = 1 - ease(frame, teaseAt, 8);
  const typed = "how deep is the internet".slice(0, Math.max(0, Math.floor((frame - typeAt) / 3)));
  const box = ease(frame, typeAt - 10, 10) * (1 - ease(frame, crawlAt, 8));
  const web = ease(frame, crawlAt, 12) * (1 - ease(frame, bigAt, 8));
  const index = ease(frame, indexAt, 12) * (1 - ease(frame, bigAt, 8));
  const cards = ease(frame, bigAt, 12) * (1 - ease(frame, bookAt, 8));
  // six pages, the links between them, and a crawler that hops link to link (one hop every 1.2 s)
  const PAGES: [number, number][] = [[200, 320], [470, 300], [640, 450], [220, 520], [470, 620], [660, 640]];
  const LINKS: [number, number][] = [[0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 5]];
  const WALK = [0, 1, 4, 3, 0, 1, 2, 5, 4];
  const hop = Math.max(0, (frame - crawlAt) / 36);
  const seg = Math.floor(hop);
  const u = hop - seg;
  const pa = PAGES[WALK[seg % WALK.length]];
  const pb = PAGES[WALK[(seg + 1) % WALK.length]];
  const cx = pa[0] + 70 + (pb[0] - pa[0]) * u;
  const cy = pa[1] + 50 + (pb[1] - pa[1]) * u;
  const ENTRIES = ["cable . . . . 12, 48, 301", "iceberg . . . . 7, 93", "onion . . . . 5, 230", "peering . . . . 48, 112"];
  return (
    <RungShell t={t} index={0} sceneId="l01" reading="SURFACE" sub="what search engines see" plate={null} credit={{ kind: "illustration" }}>
      {/* a search box types and returns results */}
      <div style={{ position: "absolute", left: 200, top: 340, width: 1200, opacity: box }}>
        <div style={{ height: 96, borderRadius: 48, background: B.paper, display: "flex", alignItems: "center", padding: "0 40px", fontFamily: F.ui, fontWeight: 500, fontSize: 40, color: B.ink }}>
          {typed}
          <span style={{ marginLeft: 4, opacity: frame % 20 < 10 ? 1 : 0 }}>|</span>
        </div>
        {[0, 1, 2, 3].map((k) => (
          <div key={k} style={{ marginTop: 22, height: 56, borderRadius: 12, background: "rgba(255,255,255,0.14)", width: `${92 - k * 12}%`, opacity: ease(frame, typeAt + 80 + k * 8, 8) }} />
        ))}
      </div>
      <Tag x={200} y={290} opacity={box} color={B.mute}>if you can type it and get it back, it is here</Tag>
      {/* the crawler: pages, links, a dot that follows them; then the index it writes into */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: web }}>
        {LINKS.map(([a, b], i) => (
          <line key={i} x1={PAGES[a][0] + 70} y1={PAGES[a][1] + 50} x2={PAGES[b][0] + 70} y2={PAGES[b][1] + 50} stroke="rgba(255,255,255,0.35)" strokeWidth={4} strokeDasharray="10 12" opacity={ease(frame, crawlAt + 10 + i * 4, 8)} />
        ))}
        {PAGES.map(([x, y], i) => (
          <g key={i} opacity={ease(frame, crawlAt + i * 5, 8)}>
            <rect x={x} y={y} width={140} height={100} rx={10} fill="rgba(255,255,255,0.12)" stroke={B.paper} strokeWidth={3} />
            {[0, 1, 2].map((k) => <rect key={k} x={x + 18} y={y + 22 + k * 22} width={104 - k * 26} height={8} rx={4} fill="rgba(255,255,255,0.45)" />)}
          </g>
        ))}
        <circle cx={cx} cy={cy} r={16} fill={B.gauge} stroke={B.ink} strokeWidth={3} opacity={ease(frame, crawlAt + 20, 8)} />
        {/* what it reads flows into the index */}
        <path d="M 800 500 L 880 500" stroke={B.gauge} strokeWidth={6} opacity={index} />
        <path d="M 866 486 L 890 500 L 866 514 Z" fill={B.gauge} opacity={index} />
      </svg>
      <Tag x={200} y={790} opacity={web} color={B.aqua} size={28}>crawlers download pages and follow the links</Tag>
      <div style={{ position: "absolute", left: 900, top: 300, width: 460, height: 400, borderRadius: 16, background: B.paper, boxShadow: "0 8px 28px rgba(0,0,0,0.5)", opacity: index, padding: "22px 30px" }}>
        <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 24, letterSpacing: 3, color: B.mute }}>INDEX</div>
        {ENTRIES.map((e, i) => (
          <div key={e} style={{ fontFamily: F.headline, fontSize: 40, color: B.ink, marginTop: 18, whiteSpace: "nowrap", opacity: ease(frame, indexAt + 15 + i * 10, 8) }}>{e}</div>
        ))}
      </div>
      <Tag x={900} y={720} opacity={index} color={B.gauge} size={26}>like the back of a book</Tag>
      {/* the size of that book */}
      <div style={{ position: "absolute", left: 200, top: 330, opacity: cards }}>
        {/* NumberCard's look, but its sub-line arrives in three parts as each is said (#14, #15):
            "hundreds of billions of pages" (0.12) · "well over a hundred million gigabytes" (0.37) · "thousands of computers" (0.85) */}
        <div style={{ position: "absolute", left: 0, top: 0, padding: "10px 22px 12px", borderRadius: 16, background: B.gauge, color: B.ink, boxShadow: "0 8px 28px rgba(0,0,0,0.5)" }}>
          <div style={{ fontFamily: F.headline, fontSize: 80, lineHeight: 1, whiteSpace: "nowrap", opacity: ease(frame, within(t, 3, 0.1), 8) }}>hundreds of billions</div>
          <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 29, marginTop: 4, letterSpacing: 1, whiteSpace: "nowrap" }}>
            <span style={{ opacity: ease(frame, within(t, 3, 0.2), 8) }}>OF PAGES</span>
            <span style={{ opacity: ease(frame, within(t, 3, 0.4), 8) }}> · WELL OVER 100,000,000 GB</span>
            <span style={{ opacity: ease(frame, within(t, 3, 0.85), 8) }}> · THOUSANDS OF COMPUTERS</span>
          </div>
        </div>
        {/* size 68 (was 56): its sub-line was 20 px, under the 24 px floor */}
        <div style={{ position: "absolute", left: 0, top: 190, opacity: ease(frame, cutAt, 10) }}>
          <NumberCard x={0} y={0} big="indexing isn't guaranteed" small="NOT EVERY PAGE GOOGLE READS MAKES THE CUT" size={68} color={B.paper} />
        </div>
      </div>
      <div style={{ opacity: ease(frame, bookAt, 10) * (1 - ease(frame, feelsAt, 8)) }}>
        <CaptionPop bottom={150} size={72} color={B.paper}>
          you aren't searching the internet. <span style={{ color: B.gauge }}>you're searching a book index.</span>
        </CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, feelsAt, 10) * (1 - ease(frame, bergmanAt, 8)) }}>
        <CaptionPop bottom={150} size={88} color={B.paper}>
          it feels like everything. <span style={{ color: B.gauge }}>it isn't.</span>
        </CaptionPop>
      </div>
      {/* lines 7-8 (source #1, Bergman 2001): his paper on the left; on the right his ratio drawn as an iceberg, one
          square above a waterline and five hundred below. Content stays left of x 1320 (the SURFACE readout chip). */}
      <div style={{ position: "absolute", left: 200, top: 190, width: 420, padding: "22px 28px", borderRadius: 12, background: B.paper, boxShadow: "0 8px 28px rgba(0,0,0,0.5)", opacity: ease(frame, bergmanAt, 10) * bergOut, transform: `translateY(${(1 - ease(frame, bergmanAt, 14)) * 40}px)` }}>
        <div style={{ fontFamily: F.headline, fontSize: 72, lineHeight: 1, color: B.ink }}>2001</div>
        {/* "a researcher named Michael Bergman published the paper" */}
        <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 26, letterSpacing: 1.5, color: "#3A4A5C", marginTop: 8, opacity: ease(frame, nameAt, 10) }}>MICHAEL BERGMAN</div>
        {/* "that gave the layer below its name — 'the deep web'" */}
        <div style={{ opacity: ease(frame, deepAt, 10) }}>
          <div style={{ height: 3, background: "#C9D3DC", margin: "14px 0 10px" }} />
          <div style={{ fontFamily: F.ui, fontWeight: 800, fontSize: 24, letterSpacing: 1.5, color: "#3A4A5C" }}>NAMED IT</div>
          <div style={{ fontFamily: F.headline, fontSize: 52, lineHeight: 1.1, color: B.teaseInk, whiteSpace: "nowrap" }}>“the deep web”</div>
        </div>
      </div>
      {/* "That was one estimate": stamped on the paper */}
      <div style={{ position: "absolute", left: 420, top: 212, padding: "4px 14px", border: `4px solid ${B.teaseInk}`, borderRadius: 8, background: "rgba(255,255,255,0.92)", fontFamily: F.ui, fontWeight: 800, fontSize: 26, letterSpacing: 1.5, color: B.teaseInk, whiteSpace: "nowrap", opacity: ease(frame, oneEstAt, 6) * bergOut, transform: `rotate(-8deg) scale(${1.5 - 0.5 * ease(frame, oneEstAt, 8)})` }}>ONE ESTIMATE</div>
      <Tag x={200} y={470} size={26} color={B.tease} opacity={ease(frame, quarterAt, 10) * bergOut}>a quarter of a century ago</Tag>
      {/* "five hundred times the size of the searchable web": no digits on screen before the words */}
      <div style={{ position: "absolute", left: 200, top: 520, fontFamily: F.headline, fontSize: 96, lineHeight: 1, color: B.gauge, whiteSpace: "nowrap", opacity: ease(frame, fiveAt, 8) * bergOut, transform: `scale(${1.25 - 0.25 * ease(frame, fiveAt, 10)})`, transformOrigin: "0 50%" }}>≈ 500 times</div>
      <Tag x={200} y={628} size={26} color={B.paper} opacity={ease(frame, fiveAt + 6, 10) * bergOut}>the searchable web</Tag>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: ease(frame, bergmanAt, 10) * bergOut }}>
        {/* the waterline and the one square above it (the searchable web) */}
        <line x1={720} y1={334} x2={720 + 600 * ease(frame, bergmanAt, 20)} y2={334} stroke={B.aqua} strokeWidth={4} />
        <rect x={1008} y={300} width={24} height={24} rx={3} fill={B.gauge} opacity={ease(frame, nameAt, 8)} />
        {/* "the part you can search is the small part": the one square pulses */}
        <circle cx={1020} cy={312} r={22 + 14 * ((frame % 24) / 24)} fill="none" stroke={B.gauge} strokeWidth={4} opacity={ease(frame, pointAt, 8) * (1 - (frame % 24) / 24)} />
        {/* "estimated it at something like five hundred times": 25 x 20 = 500 squares fill in, row by row, below the line */}
        {Array.from({ length: 500 }, (_, k) => {
          const r = Math.floor(k / 25);
          const c = k % 25;
          const on = ease(frame, estAt + r * 2.4 + (c % 5) * 0.3, 6);
          // "nobody has properly measured it since": the 500 go to outlines; back on "the point survives"
          const doubt = ease(frame, nobodyAt, 12) * (1 - ease(frame, pointAt, 12));
          return <rect key={k} x={720 + c * 24} y={350 + r * 24} width={20} height={20} rx={2} fill="#1E5A86" fillOpacity={1 - 0.8 * doubt} stroke="#5E8DB3" strokeWidth={doubt > 0 ? 1.5 : 0} opacity={on} />;
        })}
      </svg>
      <Tag x={990} y={298} size={26} align="right" color={B.gauge} opacity={ease(frame, nameAt, 10) * (1 - ease(frame, smallAt, 8)) * bergOut}>the searchable web</Tag>
      <Tag x={990} y={298} size={26} align="right" color={B.gauge} opacity={ease(frame, smallAt, 10) * bergOut}>the small part</Tag>
      <div style={{ position: "absolute", left: 720, top: 520, width: 600, textAlign: "center", fontFamily: F.headline, fontSize: 60, lineHeight: 1.1, color: B.paper, textShadow: "0 4px 18px rgba(0,0,0,0.95)", opacity: ease(frame, nobodyAt, 10) * (1 - ease(frame, pointAt, 10)) }}>
        nobody has properly
        <br />
        measured it since
      </div>
      <div style={{ opacity: ease(frame, teaseAt, 8) }}>
        <CaptionPop bottom={150} size={80} color={B.paper}>
          next: where most of <span style={{ color: B.gauge }}>your</span> life online actually is
        </CaptionPop>
      </div>
    </RungShell>
  );
};

/**
 * 2 · The deep web. Lines 0-4. Descriptive (no numeric claims; source #2). Six locked cards; a search engine's
 * crawler dot bounces off them ("can't reach"); each card flips to its name as it is named; on "behind a login"
 * each gets a lock badge; "every video puts a skull on this level" puts one up, "you use it every day" strikes it.
 */
export const Deep: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  const cardsAt = within(t, 0, 0.03);
  // "everything a search engine can't reach" (0.14-0.3); not before scene frame 112, when the title bar's tile strip
  // (down to y ≈ 200 until frame 110) has folded away
  const reachAt = Math.max(within(t, 0, 0.14), 112);
  const boringAt = within(t, 0, 0.38); // "and almost all of it is boring"
  // each card flips as it is named: inbox, bank, records, paywall, database (line 0), then the form (line 1)
  const NAMED = [within(t, 0, 0.43), within(t, 0, 0.52), within(t, 0, 0.64), within(t, 0, 0.79), within(t, 0, 0.91), within(t, 1, 0.66)];
  const sinisterAt = lineAt(t, 2);
  const yoursAt = within(t, 2, 0.58); // "It's hidden because it's yours"
  const loginAt = within(t, 2, 0.92); // "and it sits behind a login"
  const skullAt = within(t, 3, 0.28); // "Every video puts a skull on this level."
  const everyAt = within(t, 3, 0.64); // "You use it every day."
  const teaseAt = lineAt(t, 4);
  const items = ["your inbox", "your bank page", "patient records", "a paywall", "a company database", "a form's result"];
  // the crawler: drops onto the top edge of the third card (x 1190, y 300) with a red cross, then keeps bouncing
  // off it (one bounce a second) until the line about why it is hidden
  const fall = ease(frame, reachAt, 14);
  const hop = Math.abs(Math.sin((Math.PI * Math.max(0, frame - reachAt - 14)) / 30));
  const dotY = 170 + 118 * fall - 80 * hop;
  const crawler = ease(frame, reachAt - 4, 6) * (1 - ease(frame, sinisterAt, 10));
  return (
    <RungShell t={t} index={1} sceneId="l02" reading="DEEP" sub="behind a login" plate={null} credit={{ kind: "illustration" }}>
      <div style={{ position: "absolute", left: 200, top: 300, display: "grid", gridTemplateColumns: "repeat(3, 380px)", gap: 20, opacity: 1 - ease(frame, teaseAt, 8) }}>
        {items.map((it, i) => {
          const on = ease(frame, cardsAt + i * 5, 10);
          const flip = ease(frame, NAMED[i], 12);
          const badge = ease(frame, loginAt + i * 4, 8);
          return (
            <div key={it} style={{ position: "relative", height: 150, borderRadius: 18, background: flip > 0.5 ? B.paper : "rgba(255,255,255,0.1)", outline: `3px solid ${flip > 0.5 ? B.gauge : "rgba(255,255,255,0.35)"}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 16, opacity: on, transform: `rotateY(${flip * 180}deg)` }}>
              <span style={{ fontFamily: F.headline, fontSize: 40, color: flip > 0.5 ? B.ink : B.mute, transform: `rotateY(${flip * 180}deg)` }}>{flip > 0.5 ? it : "🔒"}</span>
              {/* "behind a login": a lock badge pops onto the corner of each named card */}
              {flip > 0.5 ? <span style={{ position: "absolute", left: 10, top: 8, fontSize: 30, opacity: badge, transform: `rotateY(180deg) scale(${1.6 - 0.6 * badge})` }}>🔒</span> : null}
            </div>
          );
        })}
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: crawler }}>
        <circle cx={1190} cy={dotY} r={18} fill={B.gauge} stroke={B.ink} strokeWidth={4} />
        <g opacity={ease(frame, reachAt + 12, 4) * (1 - ease(frame, reachAt + 40, 10))} stroke={B.tease} strokeWidth={8} strokeLinecap="round">
          <line x1={1160} y1={250} x2={1220} y2={290} />
          <line x1={1220} y1={250} x2={1160} y2={290} />
        </g>
      </svg>
      <Tag x={200} y={190} size={30} color={B.aqua} opacity={ease(frame, reachAt, 10) * (1 - ease(frame, sinisterAt, 10))}>what a search engine can't reach</Tag>
      <Tag x={200} y={236} size={26} color={B.mute} opacity={ease(frame, boringAt, 10) * (1 - ease(frame, sinisterAt, 10))}>almost all of it: boring</Tag>
      {/* "Every video puts a skull on this level." — "You use it every day.": the skull goes up, then is struck */}
      <div style={{ position: "absolute", left: 200, top: 160, fontSize: 110, lineHeight: 1, opacity: ease(frame, skullAt, 8) * (1 - ease(frame, teaseAt, 8)), transform: `scale(${1.4 - 0.4 * ease(frame, skullAt, 10)})`, transformOrigin: "50% 50%" }}>💀</div>
      <div style={{ position: "absolute", left: 186, top: 212, width: 150 * ease(frame, everyAt, 10), height: 12, borderRadius: 6, background: B.tease, transform: "rotate(-14deg)", transformOrigin: "0 50%", opacity: 1 - ease(frame, teaseAt, 8) }} />
      <div style={{ opacity: ease(frame, yoursAt, 10) * (1 - ease(frame, lineAt(t, 3), 8)) }}>
        <CaptionPop bottom={150} size={88}>hidden because it's yours</CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, lineAt(t, 3), 10) * (1 - ease(frame, teaseAt, 8)) }}>
        <CaptionPop bottom={150} size={80} color={B.paper}>
          every video puts a skull on this level. <span style={{ color: B.gauge }}>you use it every day.</span>
        </CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, teaseAt, 8) }}>
        <CaptionPop bottom={150} size={84} color={B.paper}>
          next: the one that <span style={{ color: B.gauge }}>earned</span> the skull
        </CaptionPop>
      </div>
    </RungShell>
  );
};

/**
 * 3 · The dark web. Lines 0-9. Sources #3, #4, #16 (at least three relays). Onion routing, then the Tor history as a
 * strip of years along the top (y 180) with one panel below it per event, swapped as each is told; then the uses.
 * Content stays left of x 1340 (the DARK readout chip sits at x ≈ 1396-1592, y ≈ 460-544).
 */
export const Dark: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  // lines 0-2: the relays
  const hopsAt = within(t, 0, 0.5); // "...can't reach with a normal browser at all"
  const relaysAt = within(t, 1, 0.36); // "through at least three other computers"
  const encryptAt = within(t, 1, 0.48); // "encrypting it at each step"
  const watchAt = within(t, 1, 0.67); // "so that nobody watching the network can tell who is talking to whom"
  const torAt = within(t, 2, 0.34); // "The best-known version is called Tor."
  // line 3-4: 1995, the Naval Research Laboratory, three names, the question, "onion routing"
  const nrlAt = lineAt(t, 3); // "In 1995,"
  const navalAt = within(t, 3, 0.15); // "at the U.S. Naval Research Laboratory"
  const NAMES: [string, number][] = [["David Goldschlag", within(t, 3, 0.26)], ["Michael Reed", within(t, 3, 0.33)], ["Paul Syverson", within(t, 3, 0.4)]];
  const askAt = within(t, 3, 0.47); // "asked whether internet connections could be built"
  const whomAt = within(t, 3, 0.69); // "that didn't reveal who was talking to whom"
  const wireAt = within(t, 3, 0.84); // "even to someone monitoring the wire"
  const onionAt = within(t, 4, 0.5); // "Their answer was 'onion routing.'"
  // line 5: October 2002, about a dozen computers by the end of 2003
  const liveAt = lineAt(t, 5); // "In October 2002 the Tor network went live,"
  const goesAt = within(t, 5, 0.17);
  const codeAt = within(t, 5, 0.28); // "with its code released free and open"
  const y2003At = within(t, 5, 0.44); // "By the end of 2003"
  const dozenAt = within(t, 5, 0.62); // "it had about a dozen volunteer computers"
  const usAt = within(t, 5, 0.78); // "mostly in America"
  const deAt = within(t, 5, 0.9); // "and one in Germany"
  // line 6: 2007 bridges, the Arab Spring
  const y2007At = lineAt(t, 6); // "By 2007"
  const bridgeAt = within(t, 6, 0.14); // "it was building bridges"
  const pastAt = within(t, 6, 0.3); // "to get people past government firewalls"
  const arabAt = within(t, 6, 0.5); // "by the Arab Spring,"
  const blockedAt = within(t, 6, 0.73); // "how people in blocked countries"
  const openAt = within(t, 6, 0.9); // "reached the open web"
  // line 7-8: the uses
  const usesAt = lineAt(t, 7);
  const crimAt = within(t, 7, 0.13); // "Yes, the same anonymity protects criminals"
  const stopAt = within(t, 7, 0.36); // "and that is the part the other videos stop at"
  const navyAt = within(t, 7, 0.56); // "But the network was built by the Navy,"
  const fundAt = within(t, 7, 0.6); // "funded by a digital-rights group,"
  const journoAt = within(t, 7, 0.8); // "and used by journalists and dissidents."
  const toolAt = within(t, 7, 0.93); // "It's a tool."
  const whatAt = lineAt(t, 8); // "What people do with it is what people do."
  const teaseAt = lineAt(t, 9);

  const hops = ease(frame, hopsAt, 12) * (1 - ease(frame, nrlAt, 8));
  const packet = ((frame - encryptAt) / 90) % 1;
  const strip = ease(frame, nrlAt, 12) * (1 - ease(frame, usesAt, 10));
  const panelA = ease(frame, nrlAt, 10) * (1 - ease(frame, liveAt, 10));
  const panelB = ease(frame, liveAt, 10) * (1 - ease(frame, within(t, 6, 0.1), 10));
  const panelC = ease(frame, within(t, 6, 0.1), 10) * (1 - ease(frame, usesAt, 10));
  const panelD = ease(frame, usesAt, 10) * (1 - ease(frame, teaseAt, 8));
  // the top row (y 190) clears before the title bar's tile strip comes back down (20 frames before line 9)
  const panelDTop = ease(frame, usesAt, 10) * (1 - ease(frame, teaseAt - 24, 8));
  // the strip: not to scale; the ring slides to each year as it is said
  const YEARS: [number, string, number][] = [[200, "1995", nrlAt], [430, "Oct 2002", liveAt], [660, "2003", y2003At], [900, "2007", y2007At], [1150, "2010–11", arabAt]];
  const ringX = YEARS.reduce((x, [yx, , at], k) => (k === 0 ? yx : x + (yx - YEARS[k - 1][0]) * ease(frame, at, 20)), 0);
  // the 1995 question: two ends of a wire; after "onion routing" a wrapped packet runs along it
  const onionX = 334 + (((frame - onionAt) % 60) / 60) * 732;
  // 2007 / Arab Spring: a bridge over a firewall, people crossing it to the open web
  const bez = (u: number) => ({ x: (1 - u) ** 2 * 400 + 2 * u * (1 - u) * 730 + u ** 2 * 1040, y: (1 - u) ** 2 * 600 + 2 * u * (1 - u) * 100 + u ** 2 * 600 });
  return (
    <RungShell t={t} index={2} sceneId="l03" reading="DARK" sub="Tor · onion routing" plate={null} credit={{ kind: "illustration" }}>
      {/* lines 0-2: you, the site; three relays pop in as they are named; a packet that loses one layer at each */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: hops }}>
        {[200, 480, 760, 1040, 1320].map((x, i) => {
          const on = i === 0 || i === 4 ? 1 : ease(frame, relaysAt + (i - 1) * 8, 8);
          return (
            <g key={i} opacity={on}>
              <circle cx={x} cy={560} r={46 * (i === 0 || i === 4 ? 1 : 0.6 + 0.4 * on)} fill={i === 0 || i === 4 ? B.gauge : "#3A4A5C"} stroke={B.paper} strokeWidth={3} />
              {i < 4 ? <line x1={x + 46} y1={560} x2={x + 234} y2={560} stroke="rgba(255,255,255,0.4)" strokeWidth={4} strokeDasharray="10 12" /> : null}
            </g>
          );
        })}
        {(() => {
          const px = 200 + packet * 1120;
          const layers = 3 - Math.min(3, Math.floor(packet * 3.01));
          return (
            <g opacity={ease(frame, encryptAt, 8)}>
              {[3, 2, 1].map((k) => (k <= layers ? <circle key={k} cx={px} cy={560} r={14 + k * 9} fill="none" stroke={B.aqua} strokeWidth={4} opacity={0.9 - k * 0.2} /> : null))}
              <circle cx={px} cy={560} r={12} fill={B.paper} />
            </g>
          );
        })()}
        {/* "nobody watching the network": an eye over the wire between relays 2 and 3 */}
        <g opacity={ease(frame, watchAt, 10)}>
          <path d="M 860 492 Q 900 462 940 492 Q 900 522 860 492 Z" fill={B.paper} stroke={B.ink} strokeWidth={3} />
          <circle cx={900} cy={492} r={10} fill={B.ink} />
        </g>
      </svg>
      <Tag x={160} y={640} opacity={ease(frame, hopsAt, 10) * hops} color={B.gauge}>you</Tag>
      {["relay 1", "relay 2", "relay 3"].map((r, i) => (
        <Tag key={r} x={430 + i * 280} y={640} opacity={ease(frame, relaysAt + i * 8, 8) * hops} color={B.mute}>{r}</Tag>
      ))}
      <Tag x={1270} y={640} opacity={ease(frame, hopsAt, 10) * hops} color={B.gauge}>the site</Tag>
      <Tag x={200} y={410} opacity={hops} color={B.aqua} size={30}>
        <span style={{ opacity: ease(frame, relaysAt, 8) }}>at least 3 relays</span>
        <span style={{ opacity: ease(frame, encryptAt, 8) }}> · one layer peeled at each</span>
        <span style={{ opacity: ease(frame, watchAt, 8) }}> · none sees both ends</span>
      </Tag>
      {/* "The best-known version is called Tor." */}
      <div style={{ position: "absolute", left: 200, top: 240, fontFamily: F.headline, fontSize: 110, lineHeight: 1, color: B.gauge, opacity: ease(frame, torAt, 8) * hops, transform: `scale(${1.3 - 0.3 * ease(frame, torAt, 10)})`, transformOrigin: "0 50%" }}>Tor</div>

      {/* the years strip */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: strip }}>
        <line x1={200} y1={180} x2={200 + 1100 * ease(frame, nrlAt, 30)} y2={180} stroke={B.mute} strokeWidth={6} />
        {YEARS.map(([x, y, at]) => (
          <circle key={y} cx={x} cy={180} r={11} fill={B.gauge} opacity={ease(frame, at, 8)} />
        ))}
        <circle cx={ringX} cy={180} r={22} fill="none" stroke={B.gauge} strokeWidth={4} />
      </svg>
      {YEARS.map(([x, y, at]) => (
        <div key={y} style={{ position: "absolute", left: x - 11, top: 198, fontFamily: F.headline, fontSize: 40, lineHeight: 1.1, color: B.paper, whiteSpace: "nowrap", opacity: ease(frame, at, 10) * strip }}>{y}</div>
      ))}

      {/* panel A, 1995: the lab, its three researchers (as named), the question, and "onion routing" */}
      <div style={{ position: "absolute", left: 200, top: 290, fontFamily: F.headline, fontSize: 56, lineHeight: 1.1, color: B.paper, whiteSpace: "nowrap", opacity: ease(frame, navalAt, 10) * panelA }}>U.S. Naval Research Laboratory</div>
      <div style={{ position: "absolute", left: 200, top: 380, display: "flex", gap: 16, opacity: panelA }}>
        {NAMES.map(([n, at]) => (
          <div key={n} style={{ padding: "8px 20px", borderRadius: 12, background: "rgba(255,255,255,0.12)", outline: `3px solid ${B.gauge}`, fontFamily: F.headline, fontSize: 40, color: B.paper, whiteSpace: "nowrap", opacity: ease(frame, at, 8), transform: `translateY(${(1 - ease(frame, at, 10)) * 24}px)` }}>{n}</div>
        ))}
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: ease(frame, askAt, 10) * panelA }}>
        <line x1={334} y1={620} x2={1066} y2={620} stroke={B.paper} strokeWidth={5} />
        <circle cx={300} cy={620} r={34} fill={B.gauge} stroke={B.paper} strokeWidth={3} />
        <circle cx={1100} cy={620} r={34} fill={B.gauge} stroke={B.paper} strokeWidth={3} />
        {/* "even to someone monitoring the wire" */}
        <g opacity={ease(frame, wireAt, 8)}>
          <path d="M 440 572 Q 480 542 520 572 Q 480 602 440 572 Z" fill={B.paper} stroke={B.ink} strokeWidth={3} />
          <circle cx={480} cy={572} r={10} fill={B.ink} />
          <line x1={480} y1={590} x2={480} y2={612} stroke={B.paper} strokeWidth={3} strokeDasharray="4 4" />
        </g>
        {/* "Their answer was 'onion routing'": three layers wrap the message, and it runs along the wire */}
        <g opacity={ease(frame, onionAt, 6)}>
          {[3, 2, 1].map((k) => (
            <circle key={k} cx={onionX} cy={620} r={14 + k * 9} fill="none" stroke={B.aqua} strokeWidth={4} opacity={ease(frame, onionAt + (3 - k) * 5, 6) * (0.9 - k * 0.2)} />
          ))}
          <circle cx={onionX} cy={620} r={12} fill={B.paper} />
        </g>
      </svg>
      <Tag x={700} y={500} align="center" size={30} color={B.paper} opacity={ease(frame, whomAt, 10) * panelA}>who was talking to whom?</Tag>
      <Tag x={480} y={660} align="center" size={28} color={B.mute} opacity={ease(frame, wireAt, 10) * (1 - ease(frame, onionAt, 8)) * panelA}>monitoring the wire</Tag>
      <div style={{ position: "absolute", left: 200, top: 680, width: 1000, textAlign: "center", fontFamily: F.headline, fontSize: 80, lineHeight: 1, color: B.gauge, opacity: ease(frame, onionAt, 8) * panelA, transform: `scale(${1.25 - 0.25 * ease(frame, onionAt, 10)})` }}>onion routing</div>

      {/* panel B, Oct 2002 - 2003: Tor goes live, free and open; about a dozen volunteer computers */}
      <div style={{ position: "absolute", left: 200, top: 280, fontFamily: F.headline, fontSize: 80, lineHeight: 1, color: B.paper, whiteSpace: "nowrap", opacity: ease(frame, goesAt, 10) * panelB }}>Tor goes live</div>
      <Tag x={200} y={380} size={30} color={B.aqua} opacity={ease(frame, codeAt, 10) * panelB}>code released free and open</Tag>
      <Tag x={200} y={470} size={30} color={B.paper} opacity={ease(frame, dozenAt, 10) * panelB}>about a dozen volunteer computers</Tag>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: panelB }}>
        {Array.from({ length: 12 }, (_, k) => {
          const de = k === 11;
          const move = de ? ease(frame, deAt, 16) : 0;
          return <circle key={k} cx={230 + k * 70 + 150 * move} cy={580} r={22} fill={de && move > 0 ? B.aqua : "#3A4A5C"} stroke={B.paper} strokeWidth={3} opacity={ease(frame, dozenAt + k * 3, 6)} />;
        })}
      </svg>
      <Tag x={580} y={624} align="center" size={28} color={B.mute} opacity={ease(frame, usAt, 10) * panelB}>mostly in America</Tag>
      <Tag x={1150} y={624} align="center" size={28} color={B.aqua} opacity={ease(frame, deAt + 8, 10) * panelB}>one in Germany</Tag>

      {/* panel C, 2007 - 2010-11: a bridge over a government firewall; then people crossing it to the open web */}
      <Tag x={200} y={276} size={30} color={B.gauge} opacity={panelC}>
        <span style={{ opacity: ease(frame, bridgeAt, 8) }}>bridges</span>
        <span style={{ opacity: ease(frame, pastAt, 8) }}> past government firewalls</span>
      </Tag>
      <Tag x={200} y={322} size={28} color={B.aqua} opacity={ease(frame, arabAt, 10) * panelC}>the Arab Spring</Tag>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: panelC }}>
        {/* the firewall: brick rows */}
        {Array.from({ length: 8 }, (_, r) => (
          <g key={r}>
            {(r % 2 ? [0, 1, 2] : [0, 1]).map((c) => (
              <rect key={c} x={690 + c * 40 - (r % 2 ? 20 : 0) + (r % 2 && c === 0 ? 20 : 0)} y={404 + r * 30} width={r % 2 && c !== 1 ? 18 : 38} height={26} rx={3} fill="#B8433B" stroke="#6E211C" strokeWidth={2} />
            ))}
          </g>
        ))}
        <path d="M 400 600 Q 730 100 1040 600" pathLength={1} stroke={B.gauge} strokeWidth={8} fill="none" strokeDasharray="1 1" strokeDashoffset={1 - ease(frame, bridgeAt, 30)} strokeLinecap="round" />
        {/* blocked countries: people on the near side */}
        {[300, 350, 400].map((x, i) => (
          <circle key={x} cx={x - 40} cy={610 - (i % 2) * 14} r={18} fill={B.paper} opacity={ease(frame, blockedAt + i * 4, 8)} />
        ))}
        {/* the open web: a globe on the far side */}
        <g opacity={ease(frame, bridgeAt, 10)}>
          <circle cx={1110} cy={560} r={60} fill="none" stroke={B.aqua} strokeWidth={5} />
          <ellipse cx={1110} cy={560} rx={26} ry={60} fill="none" stroke={B.aqua} strokeWidth={3} />
          <line x1={1050} y1={560} x2={1170} y2={560} stroke={B.aqua} strokeWidth={3} />
        </g>
        {/* from "the Arab Spring": travellers cross, one every second */}
        {[0, 1, 2].map((k) => {
          const u = (((frame - arabAt) / 90 + k / 3) % 1 + 1) % 1;
          const p = bez(u);
          return <circle key={k} cx={p.x} cy={p.y} r={14} fill={B.paper} stroke={B.ink} strokeWidth={3} opacity={ease(frame, arabAt + k * 30, 6)} />;
        })}
      </svg>
      <Tag x={320} y={650} align="center" size={28} color={B.paper} opacity={ease(frame, blockedAt, 10) * panelC}>blocked countries</Tag>
      <Tag x={1110} y={650} align="center" size={28} color={B.aqua} opacity={ease(frame, openAt, 10) * panelC}>the open web</Tag>

      {/* panel D, the uses: criminals first, at the line where other videos stop; below it, the rest of the story */}
      <div style={{ position: "absolute", left: 200, top: 190, padding: "8px 22px", borderRadius: 12, background: B.tease, fontFamily: F.headline, fontSize: 48, color: B.paper, whiteSpace: "nowrap", opacity: ease(frame, crimAt, 8) * panelDTop }}>criminals</div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: panelD }}>
        <line x1={200} y1={300} x2={200 + 1100 * ease(frame, stopAt, 20)} y2={300} stroke={B.tease} strokeWidth={5} strokeDasharray="14 10" />
      </svg>
      <Tag x={460} y={208} size={28} color={B.tease} opacity={ease(frame, stopAt, 10) * panelDTop}>where the other videos stop</Tag>
      {([["built by the Navy", navyAt], ["funded by a digital-rights group", fundAt], ["used by journalists and dissidents", journoAt]] as [string, number][]).map(([u, at], i) => (
        <div key={u} style={{ position: "absolute", left: 200, top: 330 + i * 92, padding: "8px 22px", borderRadius: 12, background: B.paper, fontFamily: F.headline, fontSize: 48, color: B.ink, whiteSpace: "nowrap", opacity: ease(frame, at, 8) * panelD, transform: `translateX(${(1 - ease(frame, at, 10)) * -40}px)` }}>{u}</div>
      ))}
      <div style={{ position: "absolute", left: 200, top: 620, fontFamily: F.headline, fontSize: 84, lineHeight: 1, color: B.gauge, whiteSpace: "nowrap", opacity: ease(frame, toolAt, 8) * panelD, transform: `scale(${1.2 - 0.2 * ease(frame, toolAt, 10)})`, transformOrigin: "0 50%" }}>it's a tool.</div>
      <div style={{ opacity: ease(frame, whatAt, 10) * (1 - ease(frame, teaseAt, 8)) }}>
        <CaptionPop bottom={150} size={80} color={B.paper}>
          {/* broken by hand: left to wrap, "do." was an orphan on the second line */}
          what people do with it
          <br />
          is <span style={{ color: B.gauge }}>what people do.</span>
        </CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, teaseAt, 8) }}>
        <CaptionPop bottom={150} size={84} color={B.tease}>that's the whole real iceberg. here's where the others keep going.</CaptionPop>
      </div>
    </RungShell>
  );
};

/** — · The myth line. Lines 0-4. Source #5. The gauge stops at the red line; the names are struck through; then "look down". */
export const Myth: React.FC<{ t: SceneTiming }> = ({ t }) => {
  const frame = useCurrentFrame();
  // each name as it is read out: "'Marianas Web.' 'The Fog.' 'The Primarch System.'"
  const NAME_AT = [within(t, 0, 0.32), within(t, 0, 0.4), within(t, 0, 0.47)];
  const noneAt = lineAt(t, 1); // "None of them exist."
  const pictureAt = within(t, 1, 0.18); // "They come from a picture — an iceberg chart —"
  const spreadAt = within(t, 1, 0.35); // "that spread on forums in the early 2010s,"
  const madeAt = within(t, 1, 0.58); // "and the names were made up as it spread."
  const noLayerAt = within(t, 1, 0.75); // "There is no verifiable layer below the dark web."
  const rumourAt = lineAt(t, 2);
  const downAt = lineAt(t, 3);
  const finishedAt = within(t, 3, 0.6); // "Except — the iceberg isn't finished. Look down."
  const lookAt = within(t, 3, 0.8); // "Look down." ends the line: the lower berg drops in on that beat
  const machineAt = lineAt(t, 4);
  const reveal = ease(frame, lookAt, 24);
  const names = ["Marianas Web", "The Fog", "The Primarch System"];
  return (
    <RungShell t={t} index={2} done sceneId="myth" reading="? ? ?" sub="the myth line" plate={null} credit={{ kind: "illustration" }}>
      <div style={{ position: "absolute", left: 200, top: 300, opacity: 1 - ease(frame, downAt, 10) }}>
        {names.map((n, i) => (
          <div key={n} style={{ position: "relative", width: "fit-content", fontFamily: F.headline, fontSize: 96, color: B.mute, lineHeight: 1.2, opacity: ease(frame, NAME_AT[i], 10), whiteSpace: "nowrap" }}>
            {n}
            <div style={{ position: "absolute", left: 0, right: 0, top: "52%", height: 12, background: B.tease, opacity: ease(frame, noneAt + i * 8, 6) }} />
          </div>
        ))}
      </div>
      <div style={{ opacity: ease(frame, noneAt, 10) * (1 - ease(frame, noLayerAt, 8)) }}>
        <CaptionPop bottom={150} size={96} color={B.tease}>none of these exist</CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, noLayerAt, 10) * (1 - ease(frame, downAt, 8)) }}>
        <CaptionPop bottom={150} size={68} color={B.paper}>
          <span style={{ color: B.tease }}>no verifiable layer</span> below the dark web
        </CaptionPop>
      </div>
      {/* line 1 (source #5, KYM: first parody iceberg 2011, Reddit 2012): the picture, then copies of it fanning out as
          it "spread"; three cards 200 x 250 at x 1080-1340, y 330-640, right of the longest name (ends x ≈ 1010) */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: 1 - ease(frame, downAt, 10) }}>
        {[0, 1, 2].map((k) => {
          const on = ease(frame, k === 0 ? pictureAt : spreadAt + (k - 1) * 10, 10);
          const x = 1080 + 30 * k * on;
          const y = 330 + 30 * k * on;
          return (
            <g key={k} opacity={on} transform={`rotate(${(k - 1) * 4} ${x + 100} ${y + 125})`}>
              <rect x={x} y={y} width={200} height={250} rx={8} fill="#132A40" stroke={B.mute} strokeWidth={3} />
              <line x1={x + 16} y1={y + 70} x2={x + 184} y2={y + 70} stroke={B.aqua} strokeWidth={2} />
              <path d={`M${x + 52} ${y + 46} L ${x + 76} ${y + 46} L ${x + 88} ${y + 70} L ${x + 40} ${y + 70} Z`} fill={B.paper} />
              <path d={`M${x + 40} ${y + 70} L ${x + 88} ${y + 70} L ${x + 96} ${y + 150} L ${x + 64} ${y + 232} L ${x + 32} ${y + 150} Z`} fill="#0B3A5E" stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
              {[0, 1, 2, 3, 4, 5].map((r) => (
                <rect key={r} x={x + 110} y={y + 44 + r * 30} width={70 - (r % 3) * 12} height={8} rx={4} fill={r > 2 ? B.tease : "rgba(255,255,255,0.5)"} />
              ))}
            </g>
          );
        })}
      </svg>
      <Tag x={200} y={680} opacity={ease(frame, spreadAt, 10) * (1 - ease(frame, downAt, 8))} color={B.mute} size={26}>an iceberg chart · forums, early 2010s</Tag>
      <Tag x={200} y={722} opacity={ease(frame, madeAt, 10) * (1 - ease(frame, downAt, 8))} color={B.mute} size={26}>the names were made up as it spread</Tag>
      {/* line 2: "Even the blogs that promote the idea call it a rumour." #5: promotional blogs frame it as "myth or secret" */}
      <Tag x={200} y={764} opacity={ease(frame, rumourAt, 10) * (1 - ease(frame, downAt, 8))} color={B.gauge} size={26}>even the blogs that promote it: "myth or secret"</Tag>
      {/* the myth line first; on "Look down." the rest of the berg drops in below it. The berg is symmetric about
          x 700 with the labels centred on that axis, so its edges never cut a label; the tip (y 700) stays above the
          two-line captions (tops ≈ 728). */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: ease(frame, downAt, 12) }}>
        <defs>
          <clipPath id="myth-reveal">
            <rect x={0} y={330} width={1920} height={380 * reveal} />
          </clipPath>
        </defs>
        <line x1={200} y1={330} x2={1100} y2={330} stroke={B.tease} strokeWidth={5} strokeDasharray="14 10" />
        <path d="M300 330 L 1100 330 L 1040 520 L 700 700 L 360 520 Z" fill="#0B3A5E" stroke="rgba(255,255,255,0.5)" strokeWidth={3} clipPath="url(#myth-reveal)" />
        {/* a chevron that bobs under the line until the reveal */}
        <path d={`M670 ${372 + 10 * Math.sin(frame / 6)} l 30 26 l 30 -26`} stroke={B.gauge} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={ease(frame, downAt + 10, 10) * (1 - reveal)} />
      </svg>
      {["a room", "a building", "a beach", "a cable"].map((n, i) => (
        <Tag key={n} x={700} y={360 + i * 72} size={40} align="center" color={i === 3 ? B.gauge : B.paper} opacity={ease(frame, lookAt + 12 + i * 12, 10)}>{n}</Tag>
      ))}
      <Tag x={200} y={290} size={26} color={B.tease} opacity={ease(frame, downAt, 12)}>THE MYTH LINE · where the websites stop</Tag>
      <div style={{ opacity: ease(frame, finishedAt, 10) * (1 - ease(frame, machineAt, 8)) }}>
        <CaptionPop bottom={150} size={90} color={B.paper}>
          {/* broken by hand: left to wrap, "down." was an orphan on the second line */}
          the iceberg isn't finished.
          <br />
          <span style={{ color: B.gauge }}>look down.</span>
        </CaptionPop>
      </div>
      <div style={{ opacity: ease(frame, machineAt, 10) }}>
        <CaptionPop bottom={150} size={80} color={B.paper}>
          it's a <span style={{ color: B.gauge }}>machine</span>. and it goes to the bottom of the sea.
        </CaptionPop>
      </div>
    </RungShell>
  );
};
