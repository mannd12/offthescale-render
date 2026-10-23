import React from "react";
import { Composition, Still } from "remotion";
import { FPS, HEIGHT, WIDTH } from "./lib/timeline";
import { Episode01, timeline as ep01 } from "./episodes/01-how-i-write/Episode";
import { ThumbA, ThumbB } from "./episodes/01-how-i-write/Thumbs";
import { BrandAvatar, BrandBanner } from "./brand/ChannelArt";
import { BrandFrame, BrandFrameTease, BrandShort, BrandThumbA, BrandThumbB, BrandThumbHero } from "./brand/BrandStills";
import { EpisodeL01, SampleL01, sampleTimeline, timeline as l01 } from "./episodes/L01-ocean-levels/Episode";
import { ThumbL01, ThumbL01C } from "./episodes/L01-ocean-levels/Thumbs";
import { EpisodeL03, timeline as l03 } from "./episodes/L03-speed-levels/Episode";
import { EpisodeL02, timeline as l02 } from "./episodes/L02-deep-sea-types/Episode";
import { ThumbL02, ThumbL02B } from "./episodes/L02-deep-sea-types/Thumbs";
import { ThumbL03, ThumbL03B } from "./episodes/L03-speed-levels/Thumbs";
import { EpisodeL04, timeline as l04 } from "./episodes/L04-internet-levels/Episode";
import { ThumbL04, ThumbL04B } from "./episodes/L04-internet-levels/Thumbs";
import { ShortS01, timeline as s01 } from "./episodes/S01-ocean-cliff/Short";
import { ShortS02, timeline as s02 } from "./episodes/S02-internet-myth/Short";
import { ShortS03, timeline as s03 } from "./episodes/S03-ocean-red/Short";
import { ShortS04, timeline as s04 } from "./episodes/S04-ocean-tubeworm/Short";
import { ShortS05, timeline as s05 } from "./episodes/S05-ocean-whale/Short";
import { ShortS06, timeline as s06 } from "./episodes/S06-ocean-lastfish/Short";
import { SkitX01, timeline as x01 } from "./episodes/X01-skit-sharks/Skit";

export const Root: React.FC = () => (
  <>
    {/* L01 - Every Level of the Ocean. `l01-sample` = cold open + level 1, the 30-s checkpoint. */}
    <Composition id="l01" component={EpisodeL01} durationInFrames={l01.totalFrames} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="l01-sample" component={SampleL01} durationInFrames={sampleTimeline.totalFrames} fps={FPS} width={WIDTH} height={HEIGHT} />

    {/* L02 - Every Type of Deep-Sea Creature (word test; script draft 2.1, estimated timings) */}
    <Composition id="l02" component={EpisodeL02} durationInFrames={l02.totalFrames} fps={FPS} width={WIDTH} height={HEIGHT} />

    {/* L03 - Every Level of Speed (genre test; script draft 2, estimated timings) */}
    <Composition id="l03" component={EpisodeL03} durationInFrames={l03.totalFrames} fps={FPS} width={WIDTH} height={HEIGHT} />

    {/* L04 - Every Level of the Internet (tech test; script draft 1.1, estimated timings) */}
    <Composition id="l04" component={EpisodeL04} durationInFrames={l04.totalFrames} fps={FPS} width={WIDTH} height={HEIGHT} />

    {/* S01 - the first Short (cliffhanger for L01), vertical, under 60 s */}
    <Composition id="s01-short" component={ShortS01} durationInFrames={s01.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s02-short" component={ShortS02} durationInFrames={s02.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s03-short" component={ShortS03} durationInFrames={s03.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s04-short" component={ShortS04} durationInFrames={s04.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s05-short" component={ShortS05} durationInFrames={s05.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s06-short" component={ShortS06} durationInFrames={s06.totalFrames} fps={FPS} width={1080} height={1920} />
    {/* experiment, owner 2026-10-23: animated two-character skit pilot (episodes/X01-skit-sharks) */}
    <Composition id="x01-skit" component={SkitX01} durationInFrames={x01.totalFrames} fps={FPS} width={1080} height={1920} />

    <Still id="l01-thumb" component={ThumbL01} width={1280} height={720} />
    <Still id="l01-thumb-c" component={ThumbL01C} width={1280} height={720} />
    <Still id="l02-thumb" component={ThumbL02} width={1280} height={720} />
    <Still id="l03-thumb" component={ThumbL03} width={1280} height={720} />
    <Still id="l04-thumb" component={ThumbL04} width={1280} height={720} />
    <Still id="l02-thumb-b" component={ThumbL02B} width={1280} height={720} />
    <Still id="l03-thumb-b" component={ThumbL03B} width={1280} height={720} />
    <Still id="l04-thumb-b" component={ThumbL04B} width={1280} height={720} />

    {/* Brand kit for the "Every LEVEL of nature" channel (checkpoint 1 stills) */}
    <Still id="brand-frame" component={BrandFrame} width={1920} height={1080} />
    <Still id="brand-frame-tease" component={BrandFrameTease} width={1920} height={1080} />
    <Still id="brand-thumb-a" component={BrandThumbA} width={1280} height={720} />
    <Still id="brand-thumb-b" component={BrandThumbB} width={1280} height={720} />
    <Still id="brand-thumb-hero" component={BrandThumbHero} width={1280} height={720} />
    <Still id="brand-avatar" component={BrandAvatar} width={800} height={800} />
    <Still id="brand-banner" component={BrandBanner} width={2048} height={1152} />
    <Still id="brand-short" component={BrandShort} width={1080} height={1920} />

    {/* Shelved first concept - kept as a reference implementation */}
    <Composition id="ep01" component={Episode01} durationInFrames={ep01.totalFrames} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Still id="ep01-thumb-a" component={ThumbA} width={1280} height={720} />
    <Still id="ep01-thumb-b" component={ThumbB} width={1280} height={720} />
  </>
);
