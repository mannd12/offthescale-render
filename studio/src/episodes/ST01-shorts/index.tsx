// Suppose Then Shorts cut from ST01's narration (no new TTS: render with episode=ST01-earth-twice-as-big).
// Plan and per-Short notes: Desktop\What If\episodes\ST01-earth-twice-as-big\shorts.md
import { VoLine } from "../../lib/timeline";
import { makeSTShort } from "../../lib/suppose/vshort";
import vo from "../ST01-earth-twice-as-big/vo.json";
import { SHOTS_01 } from "./sts01";
import { SHOTS_02 } from "./sts02";
import { SHOTS_03 } from "./sts03";
import { SHOTS_04 } from "./sts04";
import { SHOTS_05 } from "./sts05";
import { SHOTS_06 } from "./sts06";
import { SHOTS_07 } from "./sts07";
import { SHOTS_08 } from "./sts08";

export const ST01_SHORTS = [
  makeSTShort({ id: "sts01-short", source: vo as VoLine[], pick: [0, 1, 2], shots: SHOTS_01, hook: ["SUPPOSE EARTH WERE", "TWICE AS WIDE"], endQ: ["SO WHAT", "BREAKS FIRST?"], fam: "moss" }),
  makeSTShort({ id: "sts02-short", source: vo as VoLine[], pick: [12, 13, 14, 15], shots: SHOTS_02, hook: ["SUPPOSE EARTH WERE", "A QUARTER BIGGER"], endQ: ["AND WHAT HAPPENS", "TO THE AIR?"], fam: "sage" }),
  makeSTShort({ id: "sts03-short", source: vo as VoLine[], pick: [26, 29, 30], shots: SHOTS_03, hook: ["SUPPOSE EARTH WERE", "TWICE AS WIDE"], endQ: ["COULD A ROCKET", "STILL LEAVE?"], fam: "olive" }),
  makeSTShort({ id: "sts04-short", source: vo as VoLine[], pick: [31, 32, 33, 34], shots: SHOTS_04, hook: ["SUPPOSE EARTH WERE", "TWICE AS WIDE"], endQ: ["WHICH SIZE", "WOULD YOU PICK?"], fam: "moss" }),
  makeSTShort({ id: "sts05-short", source: vo as VoLine[], pick: [0, 2, 35], shots: SHOTS_05, hook: ["SUPPOSE EARTH WERE", "TWICE AS WIDE"], endQ: ["WHAT ELSE", "WOULD CHANGE?"], fam: "olive" }),
  makeSTShort({ id: "sts06-short", source: vo as VoLine[], pick: [37, 38, 39], shots: SHOTS_06, hook: ["HOW STRONG CAN", "GRAVITY GET?"], endQ: ["THE ANSWER IS", "IN THE FULL VIDEO"], fam: "clay" }),
  makeSTShort({ id: "sts07-short", source: vo as VoLine[], pick: [0, 23, 24], shots: SHOTS_07, hook: ["SUPPOSE EARTH WERE", "TWICE AS WIDE"], endQ: ["HOW TALL WOULD", "EVEREST BE?"], fam: "sage" }),
  makeSTShort({ id: "sts08-short", source: vo as VoLine[], pick: [48, 49, 50], shots: SHOTS_08, hook: ["A PLANET TWICE", "AS WIDE AS EARTH"], endQ: ["SO WHAT WOULD", "IT REALLY BE?"], fam: "moss" }),
];
