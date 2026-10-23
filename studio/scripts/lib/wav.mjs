// Minimal WAV helper shared by the narration scripts.

/** Seconds of audio in a PCM WAV, read from its fmt/data chunks (tolerates a 0 / oversized data size). */
export const wavSeconds = (buf) => {
  let p = 12;
  let rate = 24000;
  let channels = 1;
  let bits = 16;
  while (p + 8 <= buf.length) {
    const id = buf.toString("ascii", p, p + 4);
    let size = buf.readUInt32LE(p + 4);
    if (id === "fmt ") {
      channels = buf.readUInt16LE(p + 10);
      rate = buf.readUInt32LE(p + 12);
      bits = buf.readUInt16LE(p + 22);
    }
    if (id === "data") {
      if (size === 0 || p + 8 + size > buf.length) size = buf.length - (p + 8);
      return size / (rate * channels * (bits / 8));
    }
    p += 8 + size + (size % 2);
  }
  throw new Error("no data chunk in WAV");
};
