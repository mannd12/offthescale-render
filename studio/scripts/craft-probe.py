"""Craft metrics for a rendered video, compared with the measured Kurzgesagt targets (docs/ART-PROCESS.md section 2).
Samples 10 frames per second at 192x108. Prints Markdown:
  - cuts per 30 s (hard visual changes: frame-to-frame difference spikes), per window and overall
  - motion coverage (share of the frame that moves from one sample to the next; "alive" = > 3 %)
  - colour: mean saturation, value spread (dark/light range), share of near-grey frames
  - longest gap between cuts
  - MB per minute of the file
Usage: python craft-probe.py <video.mp4>"""
import os, subprocess, sys
import numpy as np

path = sys.argv[1]
W, H, FPS = 192, 108, 10
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-vf", f"fps={FPS},scale={W}:{H},format=rgb24",
                      "-f", "rawvideo", "-"], check=True, capture_output=True).stdout
rgb = np.frombuffer(raw, dtype=np.uint8).reshape(-1, H, W, 3).astype(np.float32) / 255
n = len(rgb)
secs = n / FPS
grey = rgb.mean(axis=3)
diff = np.abs(grey[1:] - grey[:-1])                      # per-pixel change between samples
mean_d = diff.mean(axis=(1, 2))
moving = (diff > 0.04).mean(axis=(1, 2))                 # share of pixels that visibly move

# A cut = a change spike well above the local motion level (median of the surrounding second), and big in absolute terms.
cuts = []
for i in range(len(mean_d)):
    lo, hi = max(0, i - FPS), min(len(mean_d), i + FPS + 1)
    local = np.median(mean_d[lo:hi])
    if mean_d[i] > 0.06 and mean_d[i] > 4 * max(local, 0.004) and (not cuts or i - cuts[-1] >= FPS // 2):
        cuts.append(i)
cut_t = np.array(cuts) / FPS

mx = rgb.max(axis=3); mn = rgb.min(axis=3)
sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0).mean(axis=(1, 2))
val_lo = np.percentile(mx.reshape(n, -1), 5, axis=1)
val_hi = np.percentile(mx.reshape(n, -1), 95, axis=1)
mm = lambda s: f"{int(s) // 60}:{int(s) % 60:02d}"

print(f"## Craft probe: {os.path.basename(path)} ({mm(secs)}, {os.path.getsize(path) / 1e6 / (secs / 60):.0f} MB/min)")
print("| Metric | Ours | Target (K measured) |")
print("|---|---|---|")
print(f"| Cuts per 30 s (overall) | {len(cuts) / secs * 30:.1f} | 7-14 (a new composition every ~2-4 s) |")
wins = [((cut_t >= a) & (cut_t < a + 30)).sum() for a in range(0, int(secs) - 29, 30)]
if wins:
    print(f"| Cuts per 30 s (min / median / max window) | {min(wins)} / {int(np.median(wins))} / {max(wins)} | min >= 5 |")
gaps = np.diff(np.concatenate([[0], cut_t, [secs]]))
print(f"| Longest gap between cuts | {gaps.max():.1f} s at {mm(np.concatenate([[0], cut_t])[gaps.argmax()])} | <= 8 s (camera moves fill it) |")
alive = (moving > 0.03).mean()
print(f"| Samples with > 3 % of the frame moving | {100 * alive:.0f} % | >= 90 % (nothing frozen) |")
print(f"| Median moving share of frame | {100 * np.median(moving):.1f} % | 5-25 % (ambient + subject, not noise) |")
print(f"| Mean saturation | {sat.mean():.2f} | 0.35-0.6 (rich, not grey) |")
print(f"| Near-grey samples (sat < 0.15) | {100 * (sat < 0.15).mean():.0f} % | <= 10 % |")
print(f"| Value range (5th-95th pct, median) | {np.median(val_lo):.2f}-{np.median(val_hi):.2f} | wide: dark scenes with bright accents |")
print()
print("Windows (cuts per 30 s): " + " ".join(f"{mm(a * 30)}:{w}" for a, w in enumerate(wins)))
