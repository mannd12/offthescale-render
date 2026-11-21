"""Suppose Then: captions.srt + chapter times from an episode's vo.json, using lib/timeline.ts's rules
(30 fps, 0.35 s lead-in at the top of each scene, a line's audio = ceil(seconds*30) frames, then pauseAfter).
Each line is split into sentences, then into cues of at most two rows of <= 42 characters; a cue's time is its share of
the line's characters. Usage (from studio/):
  python src/lib/suppose/captions.py src/episodes/ST02-every-toilet <out.srt>
Prints the start time of every scene (for the description's chapters)."""
import json, math, re, sys

FPS = 30
LEAD_IN = round(0.35 * FPS)
MAX = 42


def ts(frame):
    ms = round(frame / FPS * 1000)
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"


def rows(text):
    """greedy wrap into rows of <= MAX chars"""
    out, cur = [], ""
    for w in text.split():
        if cur and len(cur) + 1 + len(w) > MAX:
            out.append(cur)
            cur = w
        else:
            cur = f"{cur} {w}".strip()
    if cur:
        out.append(cur)
    return out


def cues_for(text):
    sents = re.split(r"(?<=[.?!])\s+", text.strip())
    cues = []
    for s in sents:
        r = rows(s)
        for i in range(0, len(r), 2):
            cues.append("\n".join(r[i:i + 2]))
    return cues


def main(ep, out):
    vo = json.load(open(f"{ep}/vo.json", encoding="utf8"))
    cursor, scene, starts, cues = 0, None, [], []
    for line in vo:
        if line["scene"] != scene:
            scene = line["scene"]
            starts.append((scene, cursor))
            cursor += LEAD_IN
        audio = math.ceil(line["seconds"] * FPS)
        parts = cues_for(line["text"])
        total = sum(len(p) for p in parts)
        t = cursor
        for p in parts:
            d = audio * len(p) / total
            cues.append((round(t), round(t + d), p))
            t += d
        cursor += audio + round(line["pauseAfter"] * FPS)
    with open(out, "w", encoding="utf8", newline="\n") as f:
        for i, (a, b, p) in enumerate(cues, 1):
            f.write(f"{i}\n{ts(a)} --> {ts(b)}\n{p}\n\n")
    print(f"{len(cues)} cues -> {out}")
    for name, fr in starts:
        s = fr // FPS
        print(f"{name}\t{s // 60}:{s % 60:02}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
