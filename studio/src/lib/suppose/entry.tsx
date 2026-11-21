// Suppose Then's own Remotion entry: keeps the second channel out of Off the Scale's Root.tsx.
// Render: node src/lib/suppose/render.mjs [id ...]  (public dir = studio/public)
import React from "react";
import { registerRoot, Still } from "remotion";
import { loadSupposeFonts } from "./fonts";
import { Composition } from "remotion";
import { FullST01, ST01Frames } from "../../episodes/ST01-earth-twice-as-big/Full";
import { FullST02, ST02Frames } from "../../episodes/ST02-every-toilet/Full";
import { ST01_SHORTS } from "../../episodes/ST01-shorts";
import { STThumbST01, STThumbST01B } from "./thumb";
import { STThumbST02, STThumbST02B } from "../../episodes/ST02-every-toilet/thumb";
import { STBanner, STChannelPicture, STKeyAir, STKeyGap, STKeyPull } from "./frames";

loadSupposeFonts();

const SupposeRoot: React.FC = () => (
  <>
    <Still id="st-key-pull" component={STKeyPull} width={1920} height={1080} />
    <Still id="st-key-air" component={STKeyAir} width={1920} height={1080} />
    <Still id="st-key-gap" component={STKeyGap} width={1920} height={1080} />
    <Still id="st-channel-picture" component={STChannelPicture} width={800} height={800} />
    <Still id="st-banner" component={STBanner} width={2560} height={1440} />
    <Still id="st01-thumb-a" component={STThumbST01} width={1280} height={720} />
    <Still id="st01-thumb-b" component={STThumbST01B} width={1280} height={720} />
    <Still id="st02-thumb-a" component={STThumbST02} width={1280} height={720} />
    <Still id="st02-thumb-b" component={STThumbST02B} width={1280} height={720} />
    <Composition id="ST01EarthTwice" component={FullST01} durationInFrames={ST01Frames} fps={30} width={1920} height={1080} />
    <Composition id="ST02EveryToilet" component={FullST02} durationInFrames={ST02Frames} fps={30} width={1920} height={1080} />
    {ST01_SHORTS.map((s) => (
      <Composition key={s.id} id={s.id} component={s.C} durationInFrames={s.frames} fps={30} width={s.w} height={s.h} />
    ))}
  </>
);

registerRoot(SupposeRoot);
