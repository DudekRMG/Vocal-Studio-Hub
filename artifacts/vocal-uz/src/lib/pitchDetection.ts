const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"] as const;

/**
 * Maps a frequency (Hz) to the nearest musical note name using A4 = 440 Hz.
 * e.g. 82.41 → "E2", 440 → "A4"
 */
export function frequencyToNote(hz: number): string {
  const semitones = Math.round(12 * Math.log2(hz / 440));
  const midi = 69 + semitones;
  const octave = Math.floor(midi / 12) - 1;
  const noteIndex = ((midi % 12) + 12) % 12;
  return `${NOTE_NAMES[noteIndex]}${octave}`;
}

/**
 * Converts a frequency (Hz) to a MIDI note number (A4 = 69).
 */
export function frequencyToMidi(hz: number): number {
  return Math.round(69 + 12 * Math.log2(hz / 440));
}

/**
 * Returns a voice-type key based on the lowest note detected.
 * Classification is by MIDI note of the lowest pitch:
 *   ≤ 40 (E2)  → bass
 *   41-46       → baritone (F2-Bb2)
 *   47-51       → tenor (B2-Eb3)
 *   52-56       → contralto (E3-Ab3)
 *   57-61       → mezzo (A3-Db4)
 *   ≥ 62 (D4)  → soprano
 */
export function getVoiceTypeKey(
  lowestHz: number
): "bass" | "baritone" | "tenor" | "contralto" | "mezzo" | "soprano" {
  const midi = frequencyToMidi(lowestHz);
  if (midi <= 40) return "bass";
  if (midi <= 46) return "baritone";
  if (midi <= 51) return "tenor";
  if (midi <= 56) return "contralto";
  if (midi <= 61) return "mezzo";
  return "soprano";
}

/**
 * Detects the dominant pitch in a Float32Array audio buffer using the ACF2+
 * autocorrelation algorithm.
 *
 * @param buffer  Float32Array from AnalyserNode.getFloatTimeDomainData()
 * @param sampleRate  AudioContext sample rate (e.g. 44100)
 * @returns frequency in Hz, or -1 if no confident pitch was detected
 */
export function autocorrelate(buffer: Float32Array<ArrayBufferLike>, sampleRate: number): number {
  const SIZE = buffer.length;

  // Reject silence
  let rms = 0;
  for (let i = 0; i < SIZE; i++) rms += buffer[i] * buffer[i];
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01) return -1;

  // Trim leading / trailing near-silence to reduce autocorrelation noise
  let r1 = 0, r2 = SIZE - 1;
  const threshold = 0.2;
  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buffer[i]) < threshold) { r1 = i; break; }
  }
  for (let i = 1; i < SIZE / 2; i++) {
    if (Math.abs(buffer[SIZE - i]) < threshold) { r2 = SIZE - i; break; }
  }

  const buf = buffer.slice(r1, r2 + 1);
  const N = buf.length;

  // Compute full autocorrelation (ACF)
  const c = new Float32Array(N);
  for (let lag = 0; lag < N; lag++) {
    let sum = 0;
    for (let i = 0; i < N - lag; i++) sum += buf[i] * buf[i + lag];
    c[lag] = sum;
  }

  // Walk past the initial positive region (find first zero crossing)
  let d = 0;
  while (d < N && c[d] > 0) d++;
  if (d === N) return -1;

  // Find maximum correlation after the crossing
  let maxVal = -Infinity, maxLag = -1;
  for (let i = d; i < N; i++) {
    if (c[i] > maxVal) { maxVal = c[i]; maxLag = i; }
  }

  if (maxLag <= 0 || maxLag >= N - 1) return -1;

  // Parabolic interpolation for sub-sample lag precision
  const x1 = c[maxLag - 1], x2 = c[maxLag], x3 = c[maxLag + 1];
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  const refinedLag = a !== 0 ? maxLag - b / (2 * a) : maxLag;
  if (refinedLag <= 0) return -1;

  const freq = sampleRate / refinedLag;

  // Discard out-of-range frequencies (human singing voice: 60–1200 Hz)
  if (freq < 60 || freq > 1200) return -1;

  return freq;
}
