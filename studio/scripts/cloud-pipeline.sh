#!/usr/bin/env bash
# The studio's render machine since 2026-10-16: a Claude Code cloud session (Anthropic's servers, part of the
# owner's plan - private, $0, no load on the owner's PC). Same steps as .github/workflows/render.yml, which stays
# as the fallback. Dependencies come from .claude/hooks/session-start.sh.
#
#   bash scripts/cloud-pipeline.sh assets                                  fetch fonts + licensed images/clips
#   bash scripts/cloud-pipeline.sh voice   <episode-slug>                   Gemini narration -> per-line WAVs + vo.json
#   bash scripts/cloud-pipeline.sh frames  <compId> <f1,f2,...> [outDir]    review stills (half size, JPEG)
#   bash scripts/cloud-pipeline.sh video   <compId> <output> [--preview]    render -> static probe -> loudness gate
#   bash scripts/cloud-pipeline.sh publish <file>                           upload to the private "renders" release
#
# Needs, in the cloud environment's settings (owner): network access to commons.wikimedia.org,
# upload.wikimedia.org, images-assets.nasa.gov, oceanexplorer.noaa.gov, cdn.jsdelivr.net,
# generativelanguage.googleapis.com, huggingface.co; environment variables GEMINI_API_KEY (voice) and
# GH_TOKEN (a fine-grained token, contents read/write on this repo only - for `publish`).
set -euo pipefail
cd "$(dirname "$0")/.."
export NODE_USE_ENV_PROXY=1
[ -f /root/.ccr/ca-bundle.crt ] && export NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt
PY=.venv-tts/bin/python
[ -x "$PY" ] || PY=python3
# Playwright's Chromium is pre-installed in cloud sessions; Remotion would otherwise download its own
BROWSER=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell 2>/dev/null | tail -1 || true)
browser_flag() { [ -n "$BROWSER" ] && echo "--browser-executable=$BROWSER"; }

cmd="${1:-}"
shift || true
case "$cmd" in
  assets)
    node scripts/fetch-assets.mjs
    ;;
  voice)
    ep="$1"
    [ -n "${GEMINI_API_KEY:-}" ] || { echo "GEMINI_API_KEY is not set (environment settings, owner)"; exit 1; }
    partial=0
    node scripts/tts-gemini.mjs "$ep" || { rc=$?; [ $rc -eq 3 ] && partial=1 || exit $rc; }
    PATH="$(dirname "$PY"):$PATH" "$PY" scripts/align_split.py "$ep"
    node scripts/tts-gemini.mjs "$ep" --manifest || { rc=$?; [ $rc -eq 3 ] && partial=1 || exit $rc; }
    [ -f out/tts-qa.md ] && cat out/tts-qa.md
    if [ $partial -eq 1 ]; then echo "narration PARTIAL: the free daily quota ran out - run again after midnight Pacific"; exit 3; fi
    echo "vo.json updated: commit src/episodes/$ep/vo.json, then re-check frames (timings move with new takes)"
    ;;
  frames)
    comp="$1" list="$2" out="${3:-out/frames/$1}"
    node scripts/frames-local.mjs "$comp" "$out" "$list" ${BROWSER:+--browser "$BROWSER"}
    ;;
  video)
    comp="$1" out="$2" preview="${3:-}"
    npx tsc --noEmit
    mkdir -p out
    if [ "$preview" = "--preview" ]; then
      npx remotion render src/index.ts "$comp" "out/$out.mp4" --scale=0.5 --crf=30 --concurrency=100% $(browser_flag)
    else
      npx remotion render src/index.ts "$comp" "out/$out.mp4" --crf=20 --concurrency=100% $(browser_flag)
      bash scripts/loudness-fix.sh "out/$out.mp4"
    fi
    "$PY" -m pip show numpy > /dev/null 2>&1 || "$PY" -m pip install -q numpy
    "$PY" scripts/static-probe.py "out/$out.mp4" || echo "static probe failed"
    ffprobe -v error -show_entries stream=codec_type,width,height:format=duration,size -of compact "out/$out.mp4"
    ;;
  publish)
    f="$1"
    [ -n "${GH_TOKEN:-}" ] || { echo "GH_TOKEN is not set (environment settings, owner) - $f stays in studio/out"; exit 1; }
    gh release upload renders "$f" --clobber --repo mannd12/channel-studio
    ;;
  *)
    sed -n '2,16p' "$0"
    exit 1
    ;;
esac
