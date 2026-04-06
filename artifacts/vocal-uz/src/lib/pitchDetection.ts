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

type VoiceTypeKey = "bass" | "baritone" | "tenor" | "contralto" | "mezzo" | "soprano";

/**
 * Expected MIDI ranges for each classical voice type.
 * low = comfortable lowest note, high = comfortable highest note.
 *
 *   Bass        E2 (40) – E4 (64)
 *   Baritone    A2 (45) – A4 (69)
 *   Tenor       C3 (48) – C5 (72)
 *   Contralto   E3 (52) – E5 (76)
 *   Mezzo       A3 (57) – A5 (81)
 *   Soprano     C4 (60) – C6 (84)
 */
const VOICE_RANGES: Record<VoiceTypeKey, { low: number; high: number }> = {
  bass:      { low: 40, high: 64 },
  baritone:  { low: 45, high: 69 },
  tenor:     { low: 48, high: 72 },
  contralto: { low: 52, high: 76 },
  mezzo:     { low: 57, high: 81 },
  soprano:   { low: 60, high: 84 },
};

/**
 * Classifies voice type from the measured lowest note and, when available,
 * the measured highest note.
 *
 * Scoring: weighted sum of absolute MIDI distances from each voice type's
 * expected low and high. The lowest note carries 60% weight (more reliable —
 * falsetto can artificially inflate the high note).
 *
 * When highestHz is omitted or null, classification falls back to the lowest
 * note only (legacy behaviour).
 */
export function getVoiceTypeKey(
  lowestHz: number,
  highestHz?: number | null,
): VoiceTypeKey {
  const measuredLow  = frequencyToMidi(lowestHz);
  const measuredHigh = highestHz != null ? frequencyToMidi(highestHz) : null;

  const LOW_WEIGHT  = measuredHigh != null ? 0.6 : 1.0;
  const HIGH_WEIGHT = 0.4;

  let bestKey: VoiceTypeKey = "soprano";
  let bestScore = Infinity;

  for (const [key, range] of Object.entries(VOICE_RANGES) as [VoiceTypeKey, { low: number; high: number }][]) {
    const lowDist  = Math.abs(measuredLow - range.low);
    const highDist = measuredHigh != null ? Math.abs(measuredHigh - range.high) : 0;
    const score    = LOW_WEIGHT * lowDist + HIGH_WEIGHT * highDist;
    if (score < bestScore) { bestScore = score; bestKey = key; }
  }

  return bestKey;
}

/**
 * Detects the dominant pitch in a Float32Array audio buffer using the ACF2+
 * autocorrelation algorithm.
 *
 * @param buffer  Float32Array from AnalyserNode.getFloatTimeDomainData()
 * @param sampleRate  AudioContext sample rate (e.g. 44100)
 * @returns frequency in Hz, or null if no confident pitch was detected
 */
export function autocorrelate(buffer: Float32Array<ArrayBufferLike>, sampleRate: number): number | null {
  const SIZE = buffer.length;

  // Reject silence
  let rms = 0;
  for (let i = 0; i < SIZE; i++) rms += buffer[i] * buffer[i];
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01) return null;

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
  if (d === N) return null;

  // Find maximum correlation after the crossing
  let maxVal = -Infinity, maxLag = -1;
  for (let i = d; i < N; i++) {
    if (c[i] > maxVal) { maxVal = c[i]; maxLag = i; }
  }

  if (maxLag <= 0 || maxLag >= N - 1) return null;

  // Parabolic interpolation for sub-sample lag precision
  const x1 = c[maxLag - 1], x2 = c[maxLag], x3 = c[maxLag + 1];
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  const refinedLag = a !== 0 ? maxLag - b / (2 * a) : maxLag;
  if (refinedLag <= 0) return null;

  const freq = sampleRate / refinedLag;

  // Discard out-of-range frequencies (human singing voice: 60–1200 Hz)
  if (freq < 60 || freq > 1200) return null;

  return freq;
}
