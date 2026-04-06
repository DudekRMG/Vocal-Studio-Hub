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

export type VoiceTypeKey = "bass" | "baritone" | "tenor" | "contralto" | "mezzo" | "soprano";
export type VoiceConfidence = "high" | "medium" | "low";

export interface VoiceClassification {
  primary: VoiceTypeKey;
  confidence: VoiceConfidence;
  runnerUp: VoiceTypeKey;
}

export type ValidationErrorKey = "narrow" | "wide" | "reversed" | "tooLow";

export interface SessionValidation {
  valid: boolean;
  errorKeys: ValidationErrorKey[];
}

/**
 * Voice profiles: three independent acoustic signals per voice type.
 * All values are MIDI note numbers. Middle C = C4 = 60.
 *
 *   Bass        low E2(40)    tessitura C2–A2(36–45)    span 14–26 st
 *   Baritone    low D2–A2(38–45)  tessitura G2–E3(43–52)   span 16–28 st
 *   Tenor       low G2–D3(43–50)  tessitura C3–A3(48–57)   span 18–30 st
 *   Contralto   low E2–C3(40–48)  tessitura A2–G3(45–55)   span 16–28 st
 *   Mezzo       low A2–F3(45–53)  tessitura E3–D4(52–62)   span 18–30 st
 *   Soprano     low D3–Bb3(50–58) tessitura A3–G4(57–67)   span 20–32 st
 */
interface VoiceProfile {
  key: VoiceTypeKey;
  lowRange: { min: number; max: number };
  tessituraRange: { min: number; max: number };
  spanRange: { min: number; max: number };
}

const VOICE_PROFILES: VoiceProfile[] = [
  { key: "bass",      lowRange: { min: 36, max: 40 }, tessituraRange: { min: 36, max: 45 }, spanRange: { min: 14, max: 26 } },
  { key: "baritone",  lowRange: { min: 38, max: 45 }, tessituraRange: { min: 43, max: 52 }, spanRange: { min: 16, max: 28 } },
  { key: "tenor",     lowRange: { min: 43, max: 50 }, tessituraRange: { min: 48, max: 57 }, spanRange: { min: 18, max: 30 } },
  { key: "contralto", lowRange: { min: 40, max: 48 }, tessituraRange: { min: 45, max: 55 }, spanRange: { min: 16, max: 28 } },
  { key: "mezzo",     lowRange: { min: 45, max: 53 }, tessituraRange: { min: 52, max: 62 }, spanRange: { min: 18, max: 30 } },
  { key: "soprano",   lowRange: { min: 50, max: 58 }, tessituraRange: { min: 57, max: 67 }, spanRange: { min: 20, max: 32 } },
];

/**
 * Multi-signal voice type classifier.
 *
 * Signals and weights:
 *   40% — stable low note  (trimmed minimum of the low recording session)
 *   45% — tessitura        (median MIDI of all samples from both sessions — most diagnostic)
 *   15% — range span       (semitones between stable low and stable high)
 *
 * Partial credit is awarded for near-misses within 2 semitones (low note)
 * or 3 semitones (tessitura).
 *
 * Returns the best-fit voice type key, a confidence level, and the runner-up.
 */
export function classifyVoice(
  stableLowMidi: number,
  tessituraMidi: number,
  spanSemitones: number,
): VoiceClassification {
  const scored = VOICE_PROFILES.map((profile) => {
    let score = 0;
    let matchedSignals = 0;

    // Signal 1: Stable low note (40%)
    if (stableLowMidi >= profile.lowRange.min && stableLowMidi <= profile.lowRange.max) {
      score += 40;
      matchedSignals++;
    } else {
      const distLow = Math.min(
        Math.abs(stableLowMidi - profile.lowRange.min),
        Math.abs(stableLowMidi - profile.lowRange.max),
      );
      if (distLow <= 2) score += 40 * (1 - distLow / 4);
    }

    // Signal 2: Tessitura (45%)
    if (tessituraMidi >= profile.tessituraRange.min && tessituraMidi <= profile.tessituraRange.max) {
      score += 45;
      matchedSignals++;
    } else {
      const distTess = Math.min(
        Math.abs(tessituraMidi - profile.tessituraRange.min),
        Math.abs(tessituraMidi - profile.tessituraRange.max),
      );
      if (distTess <= 3) score += 45 * (1 - distTess / 6);
    }

    // Signal 3: Range span (15%)
    if (spanSemitones >= profile.spanRange.min && spanSemitones <= profile.spanRange.max) {
      score += 15;
      matchedSignals++;
    }

    return { key: profile.key, score, matchedSignals };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];
  const second = scored[1];
  const delta = best.score - second.score;

  let confidence: VoiceConfidence;
  if (best.score >= 80 && delta >= 20 && best.matchedSignals === 3) {
    confidence = "high";
  } else if (best.score >= 55 && delta >= 10) {
    confidence = "medium";
  } else {
    confidence = "low";
  }

  return {
    primary: best.key,
    confidence,
    runnerUp: second.key,
  };
}

/**
 * Sanity-checks a recording session before classifying.
 * Returns a list of error keys for any implausible conditions found.
 *
 *   reversed — low MIDI is higher than high MIDI (sessions swapped)
 *   narrow   — span < 8 semitones (too short to classify reliably)
 *   wide     — span > 40 semitones (likely recording artifact)
 *   tooLow   — stable low is below C2 (MIDI 36), likely sub-harmonic noise
 */
export function validateSession(
  stableLowMidi: number,
  stableHighMidi: number,
): SessionValidation {
  const span = stableHighMidi - stableLowMidi;
  const errorKeys: ValidationErrorKey[] = [];

  if (stableLowMidi > stableHighMidi) {
    errorKeys.push("reversed");
  } else if (span < 8) {
    errorKeys.push("narrow");
  }
  if (span > 40) errorKeys.push("wide");
  if (stableLowMidi < 36) errorKeys.push("tooLow");

  return { valid: errorKeys.length === 0, errorKeys };
}

/**
 * Computes the tessitura (natural comfortable centre pitch) from a pool of
 * pitch readings in Hz taken across both recording sessions.
 *
 * Uses the median of the MIDI representation — more robust than the mean for
 * skewed pitch distributions.
 *
 * Returns a fractional MIDI value (convert back to Hz for note name lookup).
 */
export function computeTessitura(allSamplesHz: number[]): number {
  if (allSamplesHz.length === 0) return 60;
  const midiValues = allSamplesHz.map((hz) => 69 + 12 * Math.log2(hz / 440));
  const sorted = [...midiValues].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
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
