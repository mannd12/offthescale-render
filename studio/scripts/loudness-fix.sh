#!/usr/bin/env bash
# Loudness gate for a final MP4, run on the CI runner (never the owner's PC).
# YouTube turns loud uploads down but never turns quiet ones up; its reference is about -14 LUFS
# (docs/research-deep-2026-09/08-production-audio-visual.md). The Gemini voice path applies no gain,
# so every final is measured here and, when outside -15..-13 LUFS integrated or above -1 dBTP,
# re-mastered in place with a two-pass loudnorm. The video stream is copied, never re-encoded.
# Usage: bash scripts/loudness-fix.sh <file.mp4>   (appends a line to $GITHUB_STEP_SUMMARY when set)
set -euo pipefail
f="$1"
TARGET_I=-14 TARGET_TP=-1.5 TARGET_LRA=11

measure() { # prints the loudnorm JSON block of a measuring pass
  ffmpeg -hide_banner -nostats -i "$1" -map 0:a:0 -af "loudnorm=I=$TARGET_I:TP=$TARGET_TP:LRA=$TARGET_LRA:print_format=json" -f null - 2>&1 |
    sed -n '/^{/,/^}/p'
}
field() { echo "$1" | sed -n "s/.*\"$2\" : \"\\(.*\\)\".*/\\1/p"; }
inside() { awk -v i="$1" -v tp="$2" 'BEGIN { exit !(i >= -15 && i <= -13 && tp <= -1) }'; }

m=$(measure "$f")
I=$(field "$m" input_i) TP=$(field "$m" input_tp)
case "$I" in "" | *inf*) echo "::error::could not measure $f (got '$I')"; exit 1 ;; esac
line="$(basename "$f"): measured $I LUFS integrated, $TP dBTP true peak"
if inside "$I" "$TP"; then
  echo "$line - inside -15..-13 LUFS / <= -1 dBTP, left as is"
  [ -n "${GITHUB_STEP_SUMMARY:-}" ] && echo "loudness: $line, unchanged" >> "$GITHUB_STEP_SUMMARY"
  exit 0
fi

echo "$line - re-mastering to $TARGET_I LUFS"
tmp="${f%.mp4}.loudnorm.mp4"
ffmpeg -hide_banner -nostats -y -i "$f" -map 0:v:0 -map 0:a:0 -c:v copy \
  -af "loudnorm=I=$TARGET_I:TP=$TARGET_TP:LRA=$TARGET_LRA:measured_I=$I:measured_TP=$TP:measured_LRA=$(field "$m" input_lra):measured_thresh=$(field "$m" input_thresh):offset=$(field "$m" target_offset):linear=true" \
  -c:a aac -b:a 384k -ar 48000 -ac 2 -movflags +faststart "$tmp"

m2=$(measure "$tmp")
I2=$(field "$m2" input_i) TP2=$(field "$m2" input_tp)
d1=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
d2=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$tmp")
awk -v a="$d1" -v b="$d2" 'BEGIN { exit !((a - b) < 0.5 && (b - a) < 0.5) }' || { echo "::error::duration changed ($d1 -> $d2)"; exit 1; }
inside "$I2" "$TP2" || { echo "::error::after re-mastering: $I2 LUFS, $TP2 dBTP - still outside the gate"; exit 1; }
mv "$tmp" "$f"
echo "$(basename "$f"): now $I2 LUFS, $TP2 dBTP"
[ -n "${GITHUB_STEP_SUMMARY:-}" ] && echo "loudness: $line -> re-mastered to $I2 LUFS, $TP2 dBTP (video copied)" >> "$GITHUB_STEP_SUMMARY"
exit 0
