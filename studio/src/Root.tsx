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
import { ThumbL03, ThumbL03B, ThumbL03C } from "./episodes/L03-speed-levels/Thumbs";
import { EpisodeL04, timeline as l04 } from "./episodes/L04-internet-levels/Episode";
import { ThumbL04, ThumbL04B, ThumbL04C } from "./episodes/L04-internet-levels/Thumbs";
import { EpisodeL05, timeline as l05 } from "./episodes/L05-sky-levels/Episode";
import { ThumbL05 } from "./episodes/L05-sky-levels/Thumbs";
import { EpisodeL06, timeline as l06 } from "./episodes/L06-earthquake-levels/Episode";
import { ThumbL06 } from "./episodes/L06-earthquake-levels/Thumbs";
import { EpisodeL08, timeline as l08 } from "./episodes/L08-temperature-levels/Episode";
import { ThumbL08 } from "./episodes/L08-temperature-levels/Thumbs";
import { EpisodeL07, timeline as l07 } from "./episodes/L07-volcano-levels/Episode";
import { ThumbL07 } from "./episodes/L07-volcano-levels/Thumbs";
import { ShortS01, timeline as s01 } from "./episodes/S01-ocean-cliff/Short";
import { ShortS02, timeline as s02 } from "./episodes/S02-internet-myth/Short";
import { ShortS03, timeline as s03 } from "./episodes/S03-ocean-red/Short";
import { ShortS04, timeline as s04 } from "./episodes/S04-ocean-tubeworm/Short";
import { ShortS05, timeline as s05 } from "./episodes/S05-ocean-whale/Short";
import { ShortS06, timeline as s06 } from "./episodes/S06-ocean-lastfish/Short";
import { ShortS07, timeline as s07 } from "./episodes/S07-deep-anglerfish/Short";
import { ShortS08, timeline as s08 } from "./episodes/S08-deep-redtorch/Short";
import { ShortS09, timeline as s09 } from "./episodes/S09-deep-isopod/Short";
import { ShortS10, timeline as s10 } from "./episodes/S10-deep-larvacean/Short";
import { ShortS11, timeline as s11 } from "./episodes/S11-deep-boneeater/Short";
import { ShortS12, timeline as s12 } from "./episodes/S12-speed-sun/Short";
import { ShortS13, timeline as s13 } from "./episodes/S13-speed-cheetah/Short";
import { ShortS14, timeline as s14 } from "./episodes/S14-speed-blackbird/Short";
import { ShortS15, timeline as s15 } from "./episodes/S15-speed-apollo10/Short";
import { ShortS16, timeline as s16 } from "./episodes/S16-speed-sunrises/Short";
import { ShortS17, timeline as s17 } from "./episodes/S17-internet-navy/Short";
import { ShortS18, timeline as s18 } from "./episodes/S18-internet-anchors/Short";
import { ShortS19, timeline as s19 } from "./episodes/S19-internet-frankfurt/Short";
import { ShortS20, timeline as s20 } from "./episodes/S20-internet-pleiades/Short";
import { ShortS21, timeline as s21 } from "./episodes/S21-sky-iss/Short";
import { ShortS22, timeline as s22 } from "./episodes/S22-sky-line/Short";
import { ShortS23, timeline as s23 } from "./episodes/S23-sky-vulture/Short";
import { ShortS24, timeline as s24 } from "./episodes/S24-sky-gps/Short";
import { ShortS25, timeline as s25 } from "./episodes/S25-sky-air/Short";
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

    {/* L06 - Every Earthquake Magnitude Explained (script draft 1, estimated timings) */}
    <Composition id="l06" component={EpisodeL06} durationInFrames={l06.totalFrames} fps={FPS} width={WIDTH} height={HEIGHT} />

    {/* L07 - Every Level of Volcanic Eruption (script draft 1, estimated timings) */}
    <Composition id="l07" component={EpisodeL07} durationInFrames={l07.totalFrames} fps={FPS} width={WIDTH} height={HEIGHT} />

    {/* L05 - Every Level of the Sky (script draft 1, estimated timings) */}
    <Composition id="l05" component={EpisodeL05} durationInFrames={l05.totalFrames} fps={FPS} width={WIDTH} height={HEIGHT} />

    {/* L08 - Every Level of Temperature (script draft 1, estimated timings) */}
    <Composition id="l08" component={EpisodeL08} durationInFrames={l08.totalFrames} fps={FPS} width={WIDTH} height={HEIGHT} />

    {/* S01 - the first Short (cliffhanger for L01), vertical, under 60 s */}
    <Composition id="s01-short" component={ShortS01} durationInFrames={s01.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s02-short" component={ShortS02} durationInFrames={s02.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s03-short" component={ShortS03} durationInFrames={s03.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s04-short" component={ShortS04} durationInFrames={s04.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s05-short" component={ShortS05} durationInFrames={s05.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s06-short" component={ShortS06} durationInFrames={s06.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s07-short" component={ShortS07} durationInFrames={s07.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s08-short" component={ShortS08} durationInFrames={s08.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s09-short" component={ShortS09} durationInFrames={s09.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s10-short" component={ShortS10} durationInFrames={s10.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s11-short" component={ShortS11} durationInFrames={s11.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s12-short" component={ShortS12} durationInFrames={s12.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s13-short" component={ShortS13} durationInFrames={s13.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s14-short" component={ShortS14} durationInFrames={s14.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s15-short" component={ShortS15} durationInFrames={s15.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s16-short" component={ShortS16} durationInFrames={s16.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s17-short" component={ShortS17} durationInFrames={s17.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s18-short" component={ShortS18} durationInFrames={s18.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s19-short" component={ShortS19} durationInFrames={s19.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s20-short" component={ShortS20} durationInFrames={s20.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s21-short" component={ShortS21} durationInFrames={s21.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s22-short" component={ShortS22} durationInFrames={s22.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s23-short" component={ShortS23} durationInFrames={s23.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s24-short" component={ShortS24} durationInFrames={s24.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s25-short" component={ShortS25} durationInFrames={s25.totalFrames} fps={FPS} width={1080} height={1920} />
    {/* experiment, owner 2026-10-23: animated two-character skit pilot (episodes/X01-skit-sharks) */}
    <Composition id="x01-skit" component={SkitX01} durationInFrames={x01.totalFrames} fps={FPS} width={1080} height={1920} />

    <Still id="l07-thumb" component={ThumbL07} width={1280} height={720} />
    <Still id="l06-thumb" component={ThumbL06} width={1280} height={720} />
    <Still id="l08-thumb" component={ThumbL08} width={1280} height={720} />
    <Still id="l05-thumb" component={ThumbL05} width={1280} height={720} />
    <Still id="l01-thumb" component={ThumbL01} width={1280} height={720} />
    <Still id="l01-thumb-c" component={ThumbL01C} width={1280} height={720} />
    <Still id="l02-thumb" component={ThumbL02} width={1280} height={720} />
    <Still id="l03-thumb" component={ThumbL03} width={1280} height={720} />
    <Still id="l04-thumb" component={ThumbL04} width={1280} height={720} />
    <Still id="l02-thumb-b" component={ThumbL02B} width={1280} height={720} />
    <Still id="l03-thumb-b" component={ThumbL03B} width={1280} height={720} />
    <Still id="l04-thumb-b" component={ThumbL04B} width={1280} height={720} />
    <Still id="l03-thumb-c" component={ThumbL03C} width={1280} height={720} />
    <Still id="l04-thumb-c" component={ThumbL04C} width={1280} height={720} />

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
