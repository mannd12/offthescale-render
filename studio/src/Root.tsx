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
import { EpisodeL09, timeline as l09 } from "./episodes/L09-asteroid-levels/Episode";
import { ThumbL09 } from "./episodes/L09-asteroid-levels/Thumbs";
import { EpisodeL10, timeline as l10 } from "./episodes/L10-rocket-levels/Episode";
import { ThumbL10 } from "./episodes/L10-rocket-levels/Thumbs";
import { L11Style1, L11Style2, L11Style3, L11Style4 } from "./episodes/L11-dig-depth/StyleFrames";
import { ThumbL11, ThumbL11B } from "./episodes/L11-dig-depth/Thumb";
import { TestL11, l11TestFrames } from "./episodes/L11-dig-depth/Episode";
import { FullL11, l11Frames } from "./episodes/L11-dig-depth/Full";
import { FullL12, KeyArt1, KeyArt2, KeyArt3, KeyArt4, l12Frames } from "./episodes/L12-mountain-limit/Full";
import { ThumbL12, ThumbL12B } from "./episodes/L12-mountain-limit/Thumb";
import { ThumbL14, ThumbL14B } from "./episodes/L14-earth-tunnel/Thumb";
import { ThumbL15, ThumbL15B } from "./episodes/L15-space-jump/Thumb";
import { ThumbL13, ThumbL13B } from "./episodes/L13-loudest-sound/Thumb";
import { FullL14, KeyArt1 as KeyArtL14a, KeyArt2 as KeyArtL14b, KeyArt3 as KeyArtL14c, l14Frames } from "./episodes/L14-earth-tunnel/Full";
import { L14KitDemo, L14_KIT_DEMO_FRAMES } from "./episodes/L14-earth-tunnel/KitDemo";
import { FullL15SPACEJUMP, L15SpaceJumpFrames } from "./episodes/L15-space-jump/Full";
import { L15KitDemo, L15_KIT_DEMO_FRAMES } from "./episodes/L15-space-jump/KitDemo";
import { FullL13, KeyArt1 as KeyArtL13a, KeyArt2 as KeyArtL13b, KeyArt3 as KeyArtL13c, l13Frames } from "./episodes/L13-loudest-sound/Full";
import { L13KitDemo, L13_KIT_DEMO_FRAMES } from "./episodes/L13-loudest-sound/KitDemo";
import { DuskScene } from "./style-v2/Dusk";
import { CavernScene } from "./style-v2/Cavern";
import { SoundSeaScene } from "./style-v2/SoundSea";
import { TickSheetScene } from "./style-v2/TickSheet";
import { WorldsScene } from "./style-v2/Worlds";
import { CityScene } from "./style-v2/City";
import { MOTION_TEST_FRAMES, MotionTest } from "./style-v2/MotionTest";
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
import { ShortS26, timeline as s26 } from "./episodes/S26-quake-total/Short";
import { ShortS27, timeline as s27 } from "./episodes/S27-quake-pipeline/Short";
import { ShortS28, timeline as s28 } from "./episodes/S28-quake-helens/Short";
import { ShortS29, timeline as s29 } from "./episodes/S29-quake-alaska/Short";
import { ShortS30, timeline as s30 } from "./episodes/S30-quake-negative/Short";
import { ShortS31, timeline as s31 } from "./episodes/S31-volcano-quiet/Short";
import { ShortS32, timeline as s32 } from "./episodes/S32-volcano-twoscores/Short";
import { ShortS33, timeline as s33 } from "./episodes/S33-volcano-wrongmountain/Short";
import { ShortS34, timeline as s34 } from "./episodes/S34-volcano-modest/Short";
import { ShortS35, timeline as s35 } from "./episodes/S35-volcano-unseen/Short";
import { ShortS36, timeline as s36 } from "./episodes/S36-temperature-space/Short";
import { ShortS37, timeline as s37 } from "./episodes/S37-temperature-dropped/Short";
import { ShortS38, timeline as s38 } from "./episodes/S38-temperature-pluto/Short";
import { ShortS39, timeline as s39 } from "./episodes/S39-temperature-corona/Short";
import { ShortS40, timeline as s40 } from "./episodes/S40-temperature-negative/Short";
import { ShortS41, timeline as s41 } from "./episodes/S41-dig-plate/Short";
import { ShortS42, timeline as s42 } from "./episodes/S42-dig-minutes/Short";
import { ShortS43, timeline as s43 } from "./episodes/S43-dig-basalt/Short";
import { ShortS44, timeline as s44 } from "./episodes/S44-dig-heat/Short";
import { ShortS45, timeline as s45 } from "./episodes/S45-dig-atlantis/Short";
import { ShortS46, timeline as s46 } from "./episodes/S46-peak-seafloor/Short";
import { ShortS47, timeline as s47 } from "./episodes/S47-crush-column/Short";
import { ShortS48, timeline as s48 } from "./episodes/S48-sinking-giant/Short";
import { ShortS49, timeline as s49 } from "./episodes/S49-giant-volcano/Short";
import { ShortS50, timeline as s50 } from "./episodes/S50-too-tall-world/Short";
import { ShortS56, timeline as s56 } from "./episodes/S56-fall-clock/Short";
import { ShortS57, timeline as s57 } from "./episodes/S57-air-tunnel/Short";
import { ShortS58, timeline as s58 } from "./episodes/S58-sideways-wall/Short";
import { ShortS59, timeline as s59 } from "./episodes/S59-core-pressure/Short";
import { ShortS60, timeline as s60 } from "./episodes/S60-tunnel-ending/Short";
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

    {/* L09 - Every Size of Asteroid (script draft 1, estimated timings) */}
    <Composition id="l09" component={EpisodeL09} durationInFrames={l09.totalFrames} fps={FPS} width={WIDTH} height={HEIGHT} />

    {/* L10 - Every Level of Rocket (script draft 1, estimated timings) */}
    <Composition id="l10" component={EpisodeL10} durationInFrames={l10.totalFrames} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="l11-test" component={TestL11} durationInFrames={l11TestFrames} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="l11" component={FullL11} durationInFrames={l11Frames} fps={FPS} width={WIDTH} height={HEIGHT} />
    {/* L12 - Why can't mountains get much taller than Everest? Illustrated (kit v2.1), story-led; episodes/L12-mountain-limit/BUILD.md */}
    <Composition id="l12" component={FullL12} durationInFrames={l12Frames} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Still id="l12-key-1" component={KeyArt1} width={WIDTH} height={HEIGHT} />
    <Still id="l12-key-2" component={KeyArt2} width={WIDTH} height={HEIGHT} />
    <Still id="l12-key-3" component={KeyArt3} width={WIDTH} height={HEIGHT} />
    <Still id="l12-key-4" component={KeyArt4} width={WIDTH} height={HEIGHT} />
    <Composition id="l14" component={FullL14} durationInFrames={l14Frames} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Still id="l14-key-1" component={KeyArtL14a} width={WIDTH} height={HEIGHT} />
    <Still id="l14-key-2" component={KeyArtL14b} width={WIDTH} height={HEIGHT} />
    <Still id="l14-key-3" component={KeyArtL14c} width={WIDTH} height={HEIGHT} />
    <Composition id="l14-kit-demo" component={L14KitDemo} durationInFrames={L14_KIT_DEMO_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="L15SpaceJump" component={FullL15SPACEJUMP} durationInFrames={L15SpaceJumpFrames} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="L15KitDemo" component={L15KitDemo} durationInFrames={L15_KIT_DEMO_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="l13" component={FullL13} durationInFrames={l13Frames} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Still id="l13-key-1" component={KeyArtL13a} width={WIDTH} height={HEIGHT} />
    <Still id="l13-key-2" component={KeyArtL13b} width={WIDTH} height={HEIGHT} />
    <Still id="l13-key-3" component={KeyArtL13c} width={WIDTH} height={HEIGHT} />
    <Composition id="l13-kit-demo" component={L13KitDemo} durationInFrames={L13_KIT_DEMO_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Still id="l14-thumb" component={ThumbL14} width={1280} height={720} />
    <Still id="l14-thumb-b" component={ThumbL14B} width={1280} height={720} />
    <Still id="l15-thumb" component={ThumbL15} width={1280} height={720} />
    <Still id="l15-thumb-b" component={ThumbL15B} width={1280} height={720} />
    <Still id="l13-thumb" component={ThumbL13} width={1280} height={720} />
    <Still id="l13-thumb-b" component={ThumbL13B} width={1280} height={720} />
    <Still id="l12-thumb" component={ThumbL12} width={1280} height={720} />
    <Still id="l12-thumb-b" component={ThumbL12B} width={1280} height={720} />

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
    <Composition id="s26-short" component={ShortS26} durationInFrames={s26.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s27-short" component={ShortS27} durationInFrames={s27.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s28-short" component={ShortS28} durationInFrames={s28.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s29-short" component={ShortS29} durationInFrames={s29.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s30-short" component={ShortS30} durationInFrames={s30.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s31-short" component={ShortS31} durationInFrames={s31.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s32-short" component={ShortS32} durationInFrames={s32.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s33-short" component={ShortS33} durationInFrames={s33.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s34-short" component={ShortS34} durationInFrames={s34.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s35-short" component={ShortS35} durationInFrames={s35.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s36-short" component={ShortS36} durationInFrames={s36.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s37-short" component={ShortS37} durationInFrames={s37.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s38-short" component={ShortS38} durationInFrames={s38.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s39-short" component={ShortS39} durationInFrames={s39.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s40-short" component={ShortS40} durationInFrames={s40.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s41-short" component={ShortS41} durationInFrames={s41.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s42-short" component={ShortS42} durationInFrames={s42.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s43-short" component={ShortS43} durationInFrames={s43.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s44-short" component={ShortS44} durationInFrames={s44.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s45-short" component={ShortS45} durationInFrames={s45.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s46-short" component={ShortS46} durationInFrames={s46.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s47-short" component={ShortS47} durationInFrames={s47.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s48-short" component={ShortS48} durationInFrames={s48.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s49-short" component={ShortS49} durationInFrames={s49.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s50-short" component={ShortS50} durationInFrames={s50.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s56-short" component={ShortS56} durationInFrames={s56.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s57-short" component={ShortS57} durationInFrames={s57.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s58-short" component={ShortS58} durationInFrames={s58.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s59-short" component={ShortS59} durationInFrames={s59.totalFrames} fps={FPS} width={1080} height={1920} />
    <Composition id="s60-short" component={ShortS60} durationInFrames={s60.totalFrames} fps={FPS} width={1080} height={1920} />
    {/* experiment, owner 2026-10-23: animated two-character skit pilot (episodes/X01-skit-sharks) */}
    <Composition id="x01-skit" component={SkitX01} durationInFrames={x01.totalFrames} fps={FPS} width={1080} height={1920} />

    <Still id="l10-thumb" component={ThumbL10} width={1280} height={720} />
    <Still id="l09-thumb" component={ThumbL09} width={1280} height={720} />
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

    {/* L11 - How deep can we dig? Illustrated-format style frames (look test) */}
    <Still id="l11-style-1" component={L11Style1} width={1920} height={1080} />
    <Still id="l11-style-2" component={L11Style2} width={1920} height={1080} />
    <Still id="l11-style-3" component={L11Style3} width={1920} height={1080} />
    <Still id="l11-style-4" component={L11Style4} width={1920} height={1080} />
    <Still id="l11-thumb" component={ThumbL11} width={1280} height={720} />
    <Still id="l11-thumb-b" component={ThumbL11B} width={1280} height={720} />

    {/* Kit v2 "lit world" style frames (docs/STYLE-V2.md) + the 8-s motion test */}
    <Still id="v2-style-1" component={DuskScene} width={1920} height={1080} />
    <Still id="v2-style-2" component={CavernScene} width={1920} height={1080} />
    <Still id="v2-style-3" component={SoundSeaScene} width={1920} height={1080} />
    <Still id="v2-style-4" component={TickSheetScene} width={1920} height={1080} />
    <Still id="v2-style-5" component={WorldsScene} width={1920} height={1080} />
    <Still id="v2-style-6" component={CityScene} width={1920} height={1080} />
    <Composition id="v2-motion-test" component={MotionTest} durationInFrames={MOTION_TEST_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />

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
