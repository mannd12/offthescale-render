"""Cut batched TTS takes back into one WAV per narration line, using WORD TIMESTAMPS, not guesses.

Runs on the CI runner (never the owner's PC): faster-whisper transcribes each raw chunk in
public/<slug>/vo/chunks/ with per-word timings, the script text is aligned to what was actually
heard (difflib on normalised tokens), and each cut goes in the quietest spot between the last
word of one line and the first word of the next. A line is only accepted when most of its words
were heard in order; a chunk with any doubtful line is left unsplit (raw audio kept, reported),
never guessed. The same alignment doubles as audio QA: every line gets a heard-vs-script
coverage score, and anything under 0.9 is listed in out/tts-qa.md for the owner to listen to.

Why not silence-only splitting: tested 2026-09-25 on synthetic takes - it mis-cut by 5 s and
still passed its own plausibility checks. Alignment can't drift silently.

Usage: python scripts/align_split.py <episode-slug> [--model base.en]
"""
import difflib
import json
import os
import re
import sys
import wave
from array import array

from num2words import num2words

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
slug = sys.argv[1]
model_name = sys.argv[sys.argv.index("--model") + 1] if "--model" in sys.argv else "base.en"
vo_dir = os.path.join(ROOT, "public", slug, "vo")
chunk_dir = os.path.join(vo_dir, "chunks")
out_dir = os.path.join(ROOT, "out")
os.makedirs(out_dir, exist_ok=True)

# A cut is placed from the NEIGHBOURS' anchor words, so a line only needs its own first/last words
# heard to be cut safely. Rare words (Latin names spelled phonetically in `say`, e.g.
# "Mala-COSS-tee-us") legitimately lower coverage - first real run 2026-09-25 rejected a whole
# 4-minute chunk over one such line (0.64). So: anchored + >= MIN_COVERAGE -> cut; below LISTEN ->
# cut but flagged LOW for the owner's ear; unanchored -> reject the chunk.
MIN_COVERAGE = 0.4
LISTEN = 0.7
QA_FLAG = 0.9  # below this, list the line for the owner to listen to
PAD = 0.06  # seconds of silence kept at each edge of a line
WIN = 0.01


def norm_tokens(text):
    t = text.lower().replace("%", " percent ").replace("&", " and ").replace("×", " times ")
    t = re.sub(r"(\d),(\d{3})", r"\1\2", t)  # 1,228 -> 1228
    t = re.sub(r"(\d),(\d{3})", r"\1\2", t)

    def spell(m):
        s = m.group(0)
        try:
            return " " + num2words(float(s) if "." in s else int(s)) + " "
        except Exception:
            return " " + s + " "

    t = re.sub(r"\d+(\.\d+)?", spell, t)
    t = re.sub(r"[^a-z0-9' ]+", " ", t.replace("-", " "))
    return [w.strip("'") for w in t.split() if w.strip("'")]


def read_wav(path):
    with wave.open(path, "rb") as w:
        rate, ch, width = w.getframerate(), w.getnchannels(), w.getsampwidth()
        raw = w.readframes(w.getnframes())
    assert width == 2, "expected 16-bit PCM"
    a = array("h")
    a.frombytes(raw)
    if ch > 1:
        a = a[::ch]
    return rate, a


def write_wav(path, rate, samples):
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(rate)
        w.writeframes(samples.tobytes())


def envelope(samples, rate):
    n = max(1, int(rate * WIN))
    env = []
    for i in range(0, len(samples), n):
        seg = samples[i : i + n]
        env.append((sum(x * x for x in seg) / max(1, len(seg))) ** 0.5 / 32768)
    return env


def quietest_cut(env, t0, t1):
    """Middle of the longest quiet run inside [t0, t1] (seconds); falls back to the midpoint."""
    a, b = int(t0 / WIN), max(int(t0 / WIN) + 1, int(t1 / WIN))
    window = env[a:b]
    if not window:
        return (t0 + t1) / 2
    thr = max(0.004, sorted(env)[int(len(env) * 0.9)] * 0.06)
    best, best_len, run_start = None, 0, None
    for i, v in enumerate(window + [1.0]):
        if v < thr and run_start is None:
            run_start = i
        elif v >= thr and run_start is not None:
            if i - run_start > best_len:
                best, best_len = (run_start + i) / 2, i - run_start
            run_start = None
    if best is None:  # no silence at all: cut at the quietest window
        best = min(range(len(window)), key=lambda i: window[i])
    return (a + best) * WIN


def tighten(env, rate, samples, t0, t1):
    thr = max(0.004, sorted(env)[int(len(env) * 0.9)] * 0.06)
    a, b = int(t0 / WIN), int(t1 / WIN)
    while a < b and env[a] < thr:
        a += 1
    while b > a and env[b - 1] < thr:
        b -= 1
    s = max(int(t0 * rate), int((a * WIN - PAD) * rate))
    e = min(int(t1 * rate), int((b * WIN + PAD) * rate))
    return samples[s:e]


def main():
    if not os.path.isdir(chunk_dir):
        print(f"{slug}: no chunks to split")
        return 0
    from faster_whisper import WhisperModel

    model = None
    qa_rows, rejected, split_lines = [], [], 0
    for name in sorted(os.listdir(chunk_dir)):
        if not name.endswith(".json"):
            continue
        meta = json.load(open(os.path.join(chunk_dir, name), encoding="utf-8"))
        lines = meta["lines"]
        if all(os.path.exists(os.path.join(vo_dir, l["file"])) for l in lines):
            continue  # already split
        wav_path = os.path.join(chunk_dir, name[:-5] + ".wav")
        if not os.path.exists(wav_path):
            continue
        if model is None:
            model = WhisperModel(model_name, device="cpu", compute_type="int8")
        rate, samples = read_wav(wav_path)
        env = envelope(samples, rate)
        segs, _ = model.transcribe(wav_path, language="en", word_timestamps=True, condition_on_previous_text=False, beam_size=5)
        heard = []  # (token, start, end)
        for s in segs:
            for w in s.words or []:
                for tok in norm_tokens(w.word):
                    heard.append((tok, w.start, w.end))
        script_toks, owner = [], []
        for k, l in enumerate(lines):
            toks = norm_tokens(l["spoken"])
            script_toks += toks
            owner += [k] * len(toks)
        sm = difflib.SequenceMatcher(None, script_toks, [h[0] for h in heard], autojunk=False)
        match = {}
        for blk in sm.get_matching_blocks():
            for i in range(blk.size):
                match[blk.a + i] = blk.b + i
        # per line: matched script-token positions, coverage, first/last heard times
        info = []
        for k in range(len(lines)):
            idx = [i for i, o in enumerate(owner) if o == k]
            m = [i for i in idx if i in match]
            cov = len(m) / max(1, len(idx))
            # a line is one continuous stretch of speech: if its matched words jump over a RE-READ, keep only
            # the longest run (2026-09-30, L02 l07-05). A re-read is long: the jump must skip > 4 s of audio AND
            # > 8 heard words. A shorter jump is just a number the recogniser wrote differently ("nineteen
            # sixty-seven" heard as "1967") - splitting there cut five L03 lines mid-sentence (2026-10-01).
            runs, cur = [], m[:1]
            for i in m[1:]:
                skipped = match[i] - match[cur[-1]] - 1
                gap_s = heard[match[i]][1] - heard[match[cur[-1]]][2]
                if skipped > 8 and gap_s > 4.0:
                    runs.append(cur)
                    cur = [i]
                else:
                    cur.append(i)
            if cur:
                runs.append(cur)
            if len(runs) > 1:
                m = max(runs, key=len)
                print(f"::warning::{slug} {lines[k]['file']}: its words were heard in {len(runs)} separate stretches (a re-read) - kept the longest")
            first = heard[match[m[0]]][1] if m else None
            last = heard[match[m[-1]]][2] if m else None
            # head/tail anchors: the line's first/last heard word sits within 3 tokens of its start/end
            head_ok = bool(m) and (m[0] - idx[0]) <= 3
            tail_ok = bool(m) and (idx[-1] - m[-1]) <= 3
            anchored = head_ok and tail_ok
            heard_text = " ".join(heard[match[i]][0] for i in m)
            info.append({"cov": cov, "first": first, "last": last, "anchored": anchored, "head_ok": head_ok, "tail_ok": tail_ok, "heard": heard_text})
        # A BOUNDARY is safe if either side is anchored: the cut goes in the longest quiet run between
        # line k's last heard word and line k+1's first heard word, so an unheard phonetic tail
        # ("…a molecule called TMAO") or head is fine as long as its neighbour is solid (2026-09-25:
        # two L01 chunks were rejected over exactly this). Only a boundary with BOTH sides unheard is
        # ambiguous. The chunk's own first and last edges need no anchor.
        bad = [k for k, x in enumerate(info) if x["cov"] < MIN_COVERAGE or x["first"] is None]
        bad += [k for k in range(len(lines) - 1) if not (info[k]["tail_ok"] or info[k + 1]["head_ok"]) and k not in bad]
        order_bad = [k for k in range(len(lines) - 1) if info[k]["last"] is not None and info[k + 1]["first"] is not None and info[k]["last"] > info[k + 1]["first"] + 0.05]
        if bad or order_bad:
            rejected.append({"chunk": name[:-5], "lines": [lines[k]["file"] for k in bad], "order": order_bad, "coverage": [round(info[k]["cov"], 2) for k in bad], "heard": [info[k]["heard"][:160] for k in bad], "anchored": [info[k]["anchored"] for k in bad]})
            print(f"::warning::{slug} chunk {name[:-5]} NOT split: {len(bad)} line(s) below coverage/anchor, {len(order_bad)} order problem(s) - raw kept")
            continue
        total = len(samples) / rate
        # EXTRA SPEECH between two lines (2026-09-30): the model sometimes re-reads earlier paragraphs. L02's
        # l07-05 take carried ~37 s of repeated narration after its own words, because the whole repeat sat
        # between that line's last heard word and the next line's first. Words heard in a gap that match no
        # script token are not ours: the gap is dropped, the line ends after its own last word and the next
        # line starts just before its first.
        matched_heard = set(match.values())
        starts, ends = [0.0], []
        for k in range(len(lines) - 1):
            a, b = info[k]["last"], info[k + 1]["first"]
            extra = [h for j, h in enumerate(heard) if j not in matched_heard and h[1] >= a - 0.05 and h[2] <= b + 0.05]
            # ...or the model simply said this line (or the next) twice: the unscripted words ARE the line
            # (2026-10-01: L02 l07-07 "The drifters have a giant of their own, too." was spoken twice, 4.8 s).
            ex = [h[0] for h in extra]
            def repeats(k2):
                toks = [script_toks[i] for i, o in enumerate(owner) if o == k2]
                return len(ex) >= 4 and difflib.SequenceMatcher(None, ex, toks[-len(ex) - 2:] if k2 == k else toks[: len(ex) + 2], autojunk=False).ratio() >= 0.8
            if (len(extra) > 8 and b - a > 4.0) or repeats(k) or repeats(k + 1):  # a re-read, not a mis-heard number or a long pause
                ends.append(quietest_cut(env, a, min(b, a + 0.8)))
                starts.append(quietest_cut(env, max(a, b - 0.8), b))
                print(f"::warning::{slug} {lines[k]['file']}: dropped {b - a:.1f} s of extra speech after it ({len(extra)} unscripted words: {' '.join(h[0] for h in extra[:12])}...)")
            else:
                c = quietest_cut(env, a, b)
                ends.append(c)
                starts.append(c)
        ends.append(total)
        segs_out = [tighten(env, rate, samples, starts[k], ends[k]) for k in range(len(lines))]
        # DOUBLE TAKE (2026-10-01): the model sometimes says a short line twice in a row, and the recogniser,
        # listening to the whole chunk, writes it down once - so nothing above can see it (L02 l07-07, "The
        # drifters have a giant of their own, too.", 4.8 s for 9 words). A take far slower than the chunk's
        # pace is listened to on its own; if the line is heard twice, the take is cut after the first.
        ntok = [sum(1 for o in owner if o == k) for k in range(len(lines))]
        paces = sorted(len(segs_out[k]) / rate / ntok[k] for k in range(len(lines)) if ntok[k] >= 5)
        pace = paces[len(paces) // 2] if paces else None
        for k, l in enumerate(lines):
            seg = segs_out[k]
            if pace and ntok[k] >= 5 and len(seg) / rate / ntok[k] > 1.6 * pace:
                tmp = os.path.join(chunk_dir, "_probe.wav")
                write_wav(tmp, rate, seg)
                ws, _ = model.transcribe(tmp, language="en", word_timestamps=True, condition_on_previous_text=False, beam_size=5)
                hw = [(tok, w.start, w.end) for sgm in ws for w in (sgm.words or []) for tok in norm_tokens(w.word)]
                os.remove(tmp)
                toks = [script_toks[i] for i, o in enumerate(owner) if o == k]
                ht = [h[0] for h in hw]
                if len(ht) >= 1.6 * len(toks):
                    j = min(range(len(toks) - 2, min(len(ht) - 2, len(toks) + 3)), key=lambda j: -(difflib.SequenceMatcher(None, ht[:j], toks, autojunk=False).ratio() + difflib.SequenceMatcher(None, ht[j:], toks, autojunk=False).ratio()), default=None)
                    if j is not None and difflib.SequenceMatcher(None, ht[:j], toks, autojunk=False).ratio() >= 0.7 and difflib.SequenceMatcher(None, ht[j:], toks, autojunk=False).ratio() >= 0.7:
                        senv = envelope(seg, rate)
                        cut = quietest_cut(senv, hw[j - 1][2], hw[j][1])
                        seg = tighten(senv, rate, seg, 0.0, cut)
                        print(f"::warning::{slug} {l['file']}: the line was spoken twice ({len(segs_out[k]) / rate:.1f} s) - kept the first take ({len(seg) / rate:.1f} s)")
            write_wav(os.path.join(vo_dir, l["file"]), rate, seg)
            split_lines += 1
            qa_rows.append((l["file"], info[k]["cov"], len(seg) / rate, l["spoken"], info[k]["heard"]))
        print(f"{slug} chunk {name[:-5]}: {len(lines)} lines split, min coverage {min(x['cov'] for x in info):.2f}")

    # QA report for the owner's listening pass
    with open(os.path.join(out_dir, "tts-qa.md"), "a", encoding="utf-8") as f:
        f.write(f"\n## {slug}\n\n{split_lines} line(s) split this run; {len(rejected)} chunk(s) rejected.\n\n")
        flagged = [r for r in qa_rows if r[1] < QA_FLAG]
        if flagged:
            f.write("Lines where the recogniser heard < 90 % of the script words - **listen to these**:\n\n| take | coverage | seconds | script | heard |\n|---|---|---|---|---|\n")
            for file, cov, sec, spoken, heard_text in flagged:
                f.write(f"| {file}{' **LOW**' if cov < LISTEN else ''} | {cov:.2f} | {sec:.1f} | {spoken[:90]} | {heard_text[:90]} |\n")
        else:
            f.write("Every split line matched ≥ 90 % of its script words.\n")
        for r in rejected:
            f.write(f"\n- REJECTED chunk `{r['chunk']}`: lines {r['lines']} coverage {r['coverage']} anchored {r['anchored']}, order issues {r['order']}\n  heard: {r['heard']}\n")
    json.dump({"slug": slug, "split": split_lines, "rejected": rejected, "lines": [{"file": r[0], "coverage": round(r[1], 3), "seconds": round(r[2], 2)} for r in qa_rows]}, open(os.path.join(out_dir, f"tts-align-{slug}.json"), "w", encoding="utf-8"), indent=1)
    return 0


if __name__ == "__main__":
    sys.exit(main())
