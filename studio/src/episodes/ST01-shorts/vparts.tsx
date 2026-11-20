// Shared vertical helpers for the ST01 Shorts (builders may add here; keep each helper small and documented).
import React from "react";
import { Sky } from "../../lib/illustrated/light";
import { VShot, SW, SH } from "../../lib/suppose/vshort";
import { CHALK, ST_FONT, SUPPOSE, SupposeFamily } from "../../lib/suppose/palette";

/** Family backdrop over the whole canvas. */
export const VBack: React.FC<{ fam: SupposeFamily }> = ({ fam }) => <Sky stops={[...SUPPOSE[fam].sky]} x={0} y={0} w={SW} h={SH} />;

export const vplaceholder = (label: string, fam: SupposeFamily): VShot => () => (
  <g>
    <VBack fam={fam} />
    <text x={540} y={760} textAnchor="middle" fontFamily={ST_FONT} fontWeight={900} fontSize={56} fill={CHALK}>{label}</text>
  </g>
);
