"""Static stretches in a rendered video (the storyboard rule is a visible change at least every ~8 s).
One frame per second, 160x90 grey; the mean absolute difference between consecutive seconds is the "change"
number (0-255 scale). Prints Markdown: runs of low change with their times, and their share of the runtime.
Usage: python static-probe.py <video.mp4> [min_seconds=8]"""
import subprocess, sys
import numpy as np

path = sys.argv[1]
MIN = int(sys.argv[2]) if len(sys.argv) > 2 else 8
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-vf", "fps=1,scale=160:90,format=gray", "-f", "rawvideo", "-"],
                     check=True, capture_output=True).stdout
a = np.frombuffer(raw, dtype=np.uint8).reshape(-1, 90, 160).astype(np.int16)
d = np.abs(a[1:] - a[:-1]).mean(axis=(1, 2))  # d[i] = change from second i to i+1
mm = lambda s: f"{s // 60}:{s % 60:02d}"
print(f"## Static stretches in {path.split('/')[-1]}: {len(a)} s, median change per second {np.median(d):.2f}")
for label, thr in (("frozen (change < 0.1)", 0.1), ("nearly static (change < 1.2)", 1.2)):
    print(f"### {label}, runs of {MIN} s or more")
    print("```")
    i, total = 0, 0
    while i < len(d):
        if d[i] < thr:
            j = i
            while j < len(d) and d[j] < thr: j += 1
            if j - i >= MIN:
                total += j - i
                print(f"{mm(i)}-{mm(j)}  {j - i:3d} s  mean change {d[i:j].mean():.2f}")
            i = j
        else: i += 1
    if not total: print("none")
    print("```")
    print(f"{total} s in such runs = {100 * total / len(d):.0f} % of the video")
