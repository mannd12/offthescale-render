// Suppose Then's own Remotion entry: keeps the second channel out of Off the Scale's Root.tsx.
// Render: node src/lib/suppose/render.mjs [id ...]  (public dir = studio/public)
import React from "react";
import { registerRoot, Still } from "remotion";
import { loadSupposeFonts } from "./fonts";
import { Composition } from "remotion";
import { FullST01, ST01Frames } from "../../episodes/ST01-earth-twice-as-big/Full";
import { STBanner, STChannelPicture, STKeyAir, STKeyGap, STKeyPull } from "./frames";

loadSupposeFonts();

const SupposeRoot: React.FC = () => (
  <>
    <Still id="st-key-pull" component={STKeyPull} width={1920} height={1080} />
    <Still id="st-key-air" component={STKeyAir} width={1920} height={1080} />
    <Still id="st-key-gap" component={STKeyGap} width={1920} height={1080} />
    <Still id="st-channel-picture" component={STChannelPicture} width={800} height={800} />
    <Still id="st-banner" component={STBanner} width={2560} height={1440} />
    <Composition id="ST01EarthTwice" component={FullST01} durationInFrames={ST01Frames} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(SupposeRoot);
