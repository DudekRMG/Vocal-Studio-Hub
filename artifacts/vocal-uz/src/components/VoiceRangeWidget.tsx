import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLang } from "@/lib/langContext";
import { t } from "@/lib/i18n";
import {
  autocorrelate,
  frequencyToNote,
  frequencyToMidi,
  computeTessitura,
  classifyVoice,
  validateSession,
  type VoiceClassification,
  type SessionValidation,
} from "@/lib/pitchDetection";

const MAX_DURATION = 5000;
const TESSITURA_DURATION = 8000;
const SAMPLE_INTERVAL = 50;
const CIRC = 276; // 2π × 44 ≈ 276.46

type Step = "closed" | "mic-check" | "mic-error" | "low" | "high" | "tessitura" | "results" | "form" | "success";
type RecordState = "idle" | "recording" | "done";
type MicError = "" | "denied" | "unsupported" | "general";

interface VoiceRangeWidgetProps {
  accentColor: string;
  pageName: string;
  lightMode?: boolean;
  triggerBorder?: string;
  triggerColor?: string;
  triggerHoverBorder?: string;
  triggerHoverColor?: string;
}

export function VoiceRangeWidget({
  accentColor,
  pageName,
  lightMode = false,
  triggerBorder,
  triggerColor,
  triggerHoverBorder,
  triggerHoverColor,
}: VoiceRangeWidgetProps) {
  const { lang } = useLang();
  const tx = t[lang].voiceWidget;

  const tBorder      = triggerBorder      ?? accentColor;
  const tColor       = triggerColor       ?? accentColor;
  const tHoverBorder = triggerHoverBorder ?? accentColor;
  const tHoverColor  = triggerHoverColor  ?? (lightMode ? "#0f1016" : "#f0eeea");

  const [step, setStep]               = useState<Step>("closed");
  const [micError, setMicError]       = useState<MicError>("");

  const [lowRecordState,  setLowRecordState]  = useState<RecordState>("idle");
  const [lowNote,  setLowNote]   = useState<string | null>(null);
  const [lowHz,    setLowHz]     = useState<number | null>(null);
  const [lowError, setLowError]  = useState<"" | "no-pitch">("");

  const [highRecordState, setHighRecordState] = useState<RecordState>("idle");
  const [highNote, setHighNote]  = useState<string | null>(null);
  const [highHz,   setHighHz]    = useState<number | null>(null);
  const [highError, setHighError] = useState<"" | "no-pitch" | "invalid-range">("");

  const [tessituraRecordState, setTessituraRecordState] = useState<RecordState>("idle");
  const [tessituraNote,        setTessituraNote]        = useState<string | null>(null);
  const [tessituraError,       setTessituraError]       = useState<"" | "no-pitch">("");

  const [recordProgress, setRecordProgress] = useState(0);
  const [currentPitch,   setCurrentPitch]   = useState<string | null>(null);

  const [name,         setName]        = useState("");
  const [contact,      setContact]     = useState("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "error">("idle");

  const audioCtxRef     = useRef<AudioContext | null>(null);
  const streamRef       = useRef<MediaStream | null>(null);
  const analyserRef     = useRef<AnalyserNode | null>(null);
  const bufferRef       = useRef<Float32Array<ArrayBuffer> | null>(null);
  const isRecordingRef  = useRef(false);
  const recordingForRef = useRef<"low" | "high" | "tessitura">("low");
  const pitchSamplesRef = useRef<number[]>([]);
  const recordStartRef  = useRef(0);
  const lastSampleRef   = useRef(0);
  const rafRef          = useRef(0);
  const touchActiveRef  = useRef(false);
  const lowHzRef              = useRef<number | null>(null);
  const lowPitchSamplesRef    = useRef<number[]>([]);
  const highPitchSamplesRef   = useRef<number[]>([]);
  const tessituralPitchSamplesRef = useRef<number[]>([]);
  const sessionRef            = useRef(0);

  useEffect(() => {
    if (step !== "closed") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [step]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      audioCtxRef.current?.close().catch(() => {});
    };
  }, []);

  useEffect(() => {
    const isAnyRecording = lowRecordState === "recording" || highRecordState === "recording" || tessituraRecordState === "recording";
    if (!isAnyRecording) return;
    const stop = () => {
      if (isRecordingRef.current && recordingForRef.current !== "tessitura") finishRecordingRef.current();
    };
    document.addEventListener("mouseup", stop);
    document.addEventListener("touchend", stop);
    return () => {
      document.removeEventListener("mouseup", stop);
      document.removeEventListener("touchend", stop);
    };
  }, [lowRecordState, highRecordState, tessituraRecordState]);

  function releaseAudio() {
    cancelAnimationFrame(rafRef.current);
    isRecordingRef.current = false;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    analyserRef.current = null;
    bufferRef.current = null;
  }

  async function requestMic(sessionId: number) {
    interface ExtendedWindow extends Window {
      AudioContext: typeof AudioContext;
      webkitAudioContext: typeof AudioContext;
    }
    const w = window as Partial<ExtendedWindow>;
    const AC = w.AudioContext ?? w.webkitAudioContext;
    if (!AC || !navigator?.mediaDevices?.getUserMedia) {
      if (sessionRef.current !== sessionId) return;
      setMicError("unsupported");
      setStep("mic-error");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      if (sessionRef.current !== sessionId) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      streamRef.current = stream;
      const ctx = new AC();
      audioCtxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;
      bufferRef.current = new Float32Array(analyser.fftSize);
      ctx.createMediaStreamSource(stream).connect(analyser);
      setStep("low");
    } catch (err: unknown) {
      if (sessionRef.current !== sessionId) return;
      const errName = err instanceof Error ? err.name : "";
      if (errName === "NotAllowedError" || errName === "PermissionDeniedError") {
        setMicError("denied");
      } else {
        setMicError("general");
      }
      setStep("mic-error");
    }
  }

  const finishRecordingRef = useRef<() => void>(() => {});
  finishRecordingRef.current = function finishRecording() {
    cancelAnimationFrame(rafRef.current);
    isRecordingRef.current = false;

    const which   = recordingForRef.current;
    const samples = [...pitchSamplesRef.current];
    pitchSamplesRef.current = [];
    setRecordProgress(0);
    setCurrentPitch(null);

    if (samples.length === 0) {
      if (which === "low") {
        setLowRecordState("idle");
        setLowError("no-pitch");
      } else if (which === "high") {
        setHighRecordState("idle");
        setHighError("no-pitch");
      } else {
        setTessituraRecordState("idle");
        setTessituraError("no-pitch");
      }
      return;
    }

    // Tessitura branch: discard first 1.5 s (settling phase), then compute the
    // statistical median of the remaining samples for the display note.
    // trimmed samples are stored and fed exclusively to computeTessitura().
    if (which === "tessitura") {
      // Discard first 1.5 s ("settling" phase), then take the statistical median.
      const TRIM_HEAD = Math.floor(1500 / SAMPLE_INTERVAL); // 30 samples
      const trimmed = samples.length > TRIM_HEAD ? samples.slice(TRIM_HEAD) : samples;
      const sortedTrimmed = [...trimmed].sort((a, b) => a - b);
      const mid = Math.floor(sortedTrimmed.length / 2);
      const medianHz = sortedTrimmed.length % 2 === 0
        ? (sortedTrimmed[mid - 1] + sortedTrimmed[mid]) / 2
        : sortedTrimmed[mid];
      tessituralPitchSamplesRef.current = trimmed;
      setTessituraNote(frequencyToNote(medianHz));
      setTessituraError("");
      setTessituraRecordState("done");
      return;
    }

    const sorted = [...samples].sort((a, b) => a - b);

    let stable: number;
    if (which === "low") {
      // Discard bottom 10% (sub-harmonics / noise spikes), take the minimum of what's left
      const trimStart = Math.max(1, Math.floor(sorted.length * 0.10));
      const trimmed = sorted.slice(trimStart);
      stable = trimmed.length > 0 ? trimmed[0] : sorted[0];
    } else {
      // Discard top 10% (falsetto squeaks / noise spikes), take the maximum of what's left
      const trimEnd = Math.floor(sorted.length * 0.90);
      const trimmed = sorted.slice(0, trimEnd);
      stable = trimmed.length > 0 ? trimmed[trimmed.length - 1] : sorted[sorted.length - 1];
    }

    const note = frequencyToNote(stable);
    const hz   = Math.round(stable);

    if (which === "low") {
      lowPitchSamplesRef.current = samples;
      lowHzRef.current = hz;
      setLowNote(note);
      setLowHz(hz);
      setLowError("");
      setLowRecordState("done");
    } else {
      if (lowHzRef.current !== null && stable <= lowHzRef.current) {
        setHighRecordState("idle");
        setHighError("invalid-range");
      } else {
        highPitchSamplesRef.current = samples;
        setHighNote(note);
        setHighHz(hz);
        setHighError("");
        setHighRecordState("done");
      }
    }
  };

  function startRecording(which: "low" | "high" | "tessitura") {
    if (isRecordingRef.current) return;
    recordingForRef.current = which;
    isRecordingRef.current  = true;
    pitchSamplesRef.current = [];
    recordStartRef.current  = performance.now();
    lastSampleRef.current   = 0;

    if (which === "low") {
      setLowRecordState("recording");
      setLowError("");
    } else if (which === "high") {
      setHighRecordState("recording");
      setHighError("");
    } else {
      setTessituraRecordState("recording");
      setTessituraError("");
    }
    setRecordProgress(0);
    setCurrentPitch(null);

    const loop = () => {
      if (!isRecordingRef.current) return;
      const elapsed = performance.now() - recordStartRef.current;
      const activeDuration = recordingForRef.current === "tessitura" ? TESSITURA_DURATION : MAX_DURATION;
      setRecordProgress(Math.min(elapsed / activeDuration, 1));

      const analyser = analyserRef.current;
      const buf      = bufferRef.current;
      const ctx      = audioCtxRef.current;
      if (analyser && buf && ctx) {
        const now = performance.now();
        if (now - lastSampleRef.current >= SAMPLE_INTERVAL) {
          lastSampleRef.current = now;
          analyser.getFloatTimeDomainData(buf);
          const freq = autocorrelate(buf, ctx.sampleRate);
          if (freq !== null) {
            pitchSamplesRef.current.push(freq);
            setCurrentPitch(frequencyToNote(freq));
          }
        }
      }
      if (elapsed >= activeDuration) {
        finishRecordingRef.current();
        return;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }

  function open() {
    sessionRef.current += 1;
    const sessionId = sessionRef.current;
    setStep("mic-check");
    setMicError("");
    requestMic(sessionId);
  }

  function close() {
    sessionRef.current += 1;
    releaseAudio();
    setStep("closed");
    setMicError("");
    setLowRecordState("idle");       setLowNote(null);       setLowHz(null);      setLowError("");
    setHighRecordState("idle");      setHighNote(null);      setHighHz(null);     setHighError("");
    setTessituraRecordState("idle"); setTessituraNote(null); setTessituraError("");
    lowHzRef.current = null;
    lowPitchSamplesRef.current      = [];
    highPitchSamplesRef.current     = [];
    tessituralPitchSamplesRef.current = [];
    setRecordProgress(0); setCurrentPitch(null);
    setName(""); setContact(""); setSubmitStatus("idle");
  }

  function handleHoldStart(which: "low" | "high" | "tessitura") {
    startRecording(which);
  }

  function handleHoldEnd() {
    if (isRecordingRef.current && recordingForRef.current !== "tessitura") finishRecordingRef.current();
  }

  function handleTouchStart(which: "low" | "high" | "tessitura", e: React.TouchEvent) {
    e.preventDefault();
    touchActiveRef.current = true;
    startRecording(which);
  }

  function handleTouchEnd(e: React.TouchEvent) {
    e.preventDefault();
    touchActiveRef.current = false;
    if (isRecordingRef.current && recordingForRef.current !== "tessitura") finishRecordingRef.current();
  }

  function resetLow() {
    cancelAnimationFrame(rafRef.current);
    isRecordingRef.current = false;
    setLowRecordState("idle");
    setLowNote(null);
    setLowHz(null);
    setLowError("");
    lowHzRef.current = null;
    lowPitchSamplesRef.current  = [];
    highPitchSamplesRef.current = [];
    setRecordProgress(0);
    setCurrentPitch(null);
  }

  function resetHigh() {
    cancelAnimationFrame(rafRef.current);
    isRecordingRef.current = false;
    setHighRecordState("idle");
    setHighNote(null);
    setHighHz(null);
    setHighError("");
    highPitchSamplesRef.current = [];
    setRecordProgress(0);
    setCurrentPitch(null);
  }

  function resetTessitura() {
    cancelAnimationFrame(rafRef.current);
    isRecordingRef.current = false;
    setTessituraRecordState("idle");
    setTessituraNote(null);
    setTessituraError("");
    tessituralPitchSamplesRef.current = [];
    setRecordProgress(0);
    setCurrentPitch(null);
  }

  function resetAll() {
    cancelAnimationFrame(rafRef.current);
    isRecordingRef.current = false;
    setLowRecordState("idle");       setLowNote(null);       setLowHz(null);      setLowError("");
    setHighRecordState("idle");      setHighNote(null);      setHighHz(null);     setHighError("");
    setTessituraRecordState("idle"); setTessituraNote(null); setTessituraError("");
    lowHzRef.current = null;
    lowPitchSamplesRef.current        = [];
    highPitchSamplesRef.current       = [];
    tessituralPitchSamplesRef.current = [];
    setRecordProgress(0);
    setCurrentPitch(null);
    setStep("low");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitStatus("sending");

    const stableLowMidi  = lowHz  ? frequencyToMidi(lowHz)  : 60;
    const stableHighMidi = highHz ? frequencyToMidi(highHz) : 72;

    const submitValidation   = validateSession(stableLowMidi, stableHighMidi);
    const validationWarnings = submitValidation.valid ? [] : submitValidation.errorKeys;

    if (!submitValidation.valid) {
      setStep("results");
      setSubmitStatus("idle");
      return;
    }

    const tessituraSourceSamples = tessituralPitchSamplesRef.current.length > 0
      ? tessituralPitchSamplesRef.current
      : null;
    const tessituraMidi = tessituraSourceSamples
      ? computeTessitura(tessituraSourceSamples)
      : (stableLowMidi + stableHighMidi) / 2;
    const span          = stableHighMidi - stableLowMidi;
    const classification = classifyVoice(stableLowMidi, tessituraMidi, span);

    const voiceTypeName = tx.voiceTypes[classification.primary].name;
    const runnerUpName  = tx.voiceTypes[classification.runnerUp].name;
    const rangeOctaves  = (lowHz && highHz)
      ? parseFloat((Math.log2(highHz / lowHz)).toFixed(2))
      : 0;
    const tessHz  = 440 * Math.pow(2, (tessituraMidi - 69) / 12);
    const tessNote = frequencyToNote(tessHz);

    try {
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${base}/api/voice-range`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact,
          lowestNote:         lowNote,
          lowestHz:           lowHz,
          highestNote:        highNote,
          highestHz:          highHz,
          rangeOctaves,
          rangeSpan:          span,
          voiceType:          voiceTypeName,
          tessitura:          tessNote,
          confidenceLevel:    classification.confidence,
          runnerUp:           runnerUpName,
          validationWarnings,
          page:               pageName,
          timestamp:          new Date().toLocaleString(lang === "ru" ? "ru-RU" : "en-US"),
          lang,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("success");
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    }
  }

  const stableLowMidi  = lowHz  ? frequencyToMidi(lowHz)  : null;
  const stableHighMidi = highHz ? frequencyToMidi(highHz) : null;

  const validation: SessionValidation | null = (stableLowMidi !== null && stableHighMidi !== null)
    ? validateSession(stableLowMidi, stableHighMidi)
    : null;

  const renderTessituraSource = tessituralPitchSamplesRef.current.length > 0
    ? tessituralPitchSamplesRef.current
    : null;

  const classification: VoiceClassification | null = (
    validation?.valid && stableLowMidi !== null && stableHighMidi !== null
  )
    ? classifyVoice(
        stableLowMidi,
        renderTessituraSource
          ? computeTessitura(renderTessituraSource)
          : (stableLowMidi + stableHighMidi) / 2,
        stableHighMidi - stableLowMidi,
      )
    : null;

  const voiceTypeKey  = classification?.primary ?? "soprano";
  const voiceTypeData = tx.voiceTypes[voiceTypeKey];

  const confidenceQualifier = (() => {
    if (!classification) return "";
    if (classification.confidence === "medium") return `${tx.qualifierMedium} `;
    if (classification.confidence === "low")    return `${tx.qualifierLow} `;
    return "";
  })();

  const rangeOctavesDisplay = (lowHz && highHz)
    ? Math.log2(highHz / lowHz).toFixed(1)
    : "—";

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.14)",
    color: "#f0eeea",
    padding: "0.65rem 0.9rem",
    fontSize: "0.88rem",
    outline: "none",
    borderRadius: 0,
    boxSizing: "border-box",
  };

  function HoldButton({ which }: { which: "low" | "high" | "tessitura" }) {
    const rs = which === "low" ? lowRecordState : which === "high" ? highRecordState : tessituraRecordState;
    const isRecording = rs === "recording";
    return (
      <div style={{ position: "relative", width: 100, height: 100, margin: "0 auto" }}>
        <svg width={100} height={100} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <circle cx={50} cy={50} r={43} fill={accentColor} fillOpacity={isRecording ? 0.18 : 0} style={{ transition: "fill-opacity 0.15s" }} />
          <circle cx={50} cy={50} r={44} fill="none" stroke={accentColor} strokeWidth={2} opacity={isRecording ? 0 : 0.25} style={{ transition: "opacity 0.15s" }} />
          {isRecording && (
            <circle
              cx={50} cy={50} r={44}
              fill="none"
              stroke={accentColor}
              strokeWidth={3}
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * recordProgress}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              style={{ transition: "stroke-dashoffset 0.05s linear" }}
            />
          )}
        </svg>
        <button
          style={{
            position: "absolute", top: 6, left: 6, width: 88, height: 88,
            borderRadius: "50%",
            border: `2px solid ${isRecording ? "transparent" : accentColor}`,
            background: "transparent",
            color: accentColor,
            fontSize: "1.6rem",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            userSelect: "none",
            WebkitUserSelect: "none",
            touchAction: "none",
            zIndex: 1,
          }}
          onMouseDown={() => !touchActiveRef.current && handleHoldStart(which)}
          onMouseUp={() => !touchActiveRef.current && handleHoldEnd()}
          onMouseLeave={() => !touchActiveRef.current && handleHoldEnd()}
          onTouchStart={(e) => handleTouchStart(which, e)}
          onTouchEnd={(e) => handleTouchEnd(e)}
          onTouchCancel={(e) => handleTouchEnd(e)}
        >
          🎤
        </button>
      </div>
    );
  }

  function renderContent() {
    if (step === "mic-check") {
      return (
        <div style={{ textAlign: "center", padding: "16px 0 8px" }}>
          <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}>
            <svg width="48" height="58" viewBox="0 0 48 58" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Ribbon capsule — tall narrow rectangle */}
              <rect x="17" y="3" width="14" height="28" rx="2" stroke="rgba(240,238,234,0.7)" strokeWidth="1.8" fill="none"/>
              {/* Horizontal slats inside capsule */}
              <line x1="19" y1="9"  x2="29" y2="9"  stroke="rgba(240,238,234,0.3)" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="19" y1="13" x2="29" y2="13" stroke="rgba(240,238,234,0.3)" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="19" y1="17" x2="29" y2="17" stroke="rgba(240,238,234,0.3)" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="19" y1="21" x2="29" y2="21" stroke="rgba(240,238,234,0.3)" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="19" y1="25" x2="29" y2="25" stroke="rgba(240,238,234,0.3)" strokeWidth="1.2" strokeLinecap="round"/>
              {/* Side brackets */}
              <line x1="10" y1="10" x2="17" y2="10" stroke="rgba(240,238,234,0.6)" strokeWidth="1.6" strokeLinecap="round"/>
              <line x1="10" y1="10" x2="10" y2="24" stroke="rgba(240,238,234,0.6)" strokeWidth="1.6" strokeLinecap="round"/>
              <line x1="10" y1="24" x2="17" y2="24" stroke="rgba(240,238,234,0.6)" strokeWidth="1.6" strokeLinecap="round"/>
              <line x1="31" y1="10" x2="38" y2="10" stroke="rgba(240,238,234,0.6)" strokeWidth="1.6" strokeLinecap="round"/>
              <line x1="38" y1="10" x2="38" y2="24" stroke="rgba(240,238,234,0.6)" strokeWidth="1.6" strokeLinecap="round"/>
              <line x1="31" y1="24" x2="38" y2="24" stroke="rgba(240,238,234,0.6)" strokeWidth="1.6" strokeLinecap="round"/>
              {/* Short handle */}
              <rect x="21" y="31" width="6" height="12" rx="1.5" stroke="rgba(240,238,234,0.7)" strokeWidth="1.6" fill="none"/>
              {/* Stand rod */}
              <line x1="24" y1="43" x2="24" y2="51" stroke="rgba(240,238,234,0.7)" strokeWidth="1.8" strokeLinecap="round"/>
              {/* Base */}
              <line x1="15" y1="51" x2="33" y2="51" stroke="rgba(240,238,234,0.7)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <p style={{ color: "rgba(240,238,234,0.6)", fontSize: "0.88rem", lineHeight: 1.6, margin: 0 }}>
            {tx.stepMicText}
          </p>
        </div>
      );
    }

    if (step === "mic-error") {
      const msg =
        micError === "denied"      ? tx.micDenied      :
        micError === "unsupported" ? tx.micUnsupported :
        tx.micGeneral;
      return (
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          <div style={{ fontSize: "2rem", marginBottom: 16 }}>🚫</div>
          <p style={{ color: "rgba(240,238,234,0.6)", fontSize: "0.85rem", lineHeight: 1.7, margin: "0 0 24px" }}>
            {msg}
          </p>
          {micError !== "unsupported" && (
            <button
              onClick={() => { sessionRef.current += 1; const sid = sessionRef.current; setStep("mic-check"); setMicError(""); requestMic(sid); }}
              style={{
                background: accentColor, color: "#fff", border: "none",
                padding: "0.6rem 1.4rem", cursor: "pointer", fontSize: "0.8rem",
                fontFamily: "var(--font-display-family)", letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              {tx.tryAgain}
            </button>
          )}
        </div>
      );
    }

    if (step === "low" || step === "high") {
      const isLow = step === "low";
      const rs    = isLow ? lowRecordState : highRecordState;
      const note  = isLow ? lowNote  : highNote;
      const err   = isLow ? lowError : highError;

      return (
        <div style={{ animation: "vrFadeIn 0.2s both" }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 20, justifyContent: "center" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                width: 24, height: 3,
                background: (isLow ? i === 0 : i === 1) ? accentColor : "rgba(255,255,255,0.18)",
                borderRadius: 2,
                transition: "background 0.3s",
              }} />
            ))}
          </div>

          <p style={{
            textAlign: "center",
            color: "rgba(240,238,234,0.75)",
            fontSize: "0.88rem",
            lineHeight: 1.7,
            margin: "0 0 28px",
          }}>
            {isLow ? tx.holdInstructionLow : tx.holdInstructionHigh}
          </p>

            {rs !== "done" && (
            <>
              <HoldButton which={isLow ? "low" : "high"} />
              <p style={{
                textAlign: "center",
                color: rs === "recording" ? accentColor : "rgba(240,238,234,0.35)",
                fontSize: "0.72rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                marginTop: 12,
              }}>
                {rs === "recording" ? (currentPitch ?? tx.recording) : tx.holdLabel}
              </p>
            </>
          )}

          {/* Error messages */}
          {err === "no-pitch" && rs !== "recording" && (
            <p style={{
              textAlign: "center",
              color: "#e8002d",
              fontSize: "0.8rem",
              marginTop: 14,
              lineHeight: 1.5,
            }}>
              {tx.noPitchError}
            </p>
          )}
          {err === "invalid-range" && rs !== "recording" && (
            <p style={{
              textAlign: "center",
              color: "#e8002d",
              fontSize: "0.8rem",
              marginTop: 14,
              lineHeight: 1.5,
            }}>
              {tx.invalidRangeError}
            </p>
          )}

          {/* Detected note + confirm / re-record */}
          {rs === "done" && note && (
            <div style={{ textAlign: "center", animation: "vrFadeIn 0.25s both" }}>
              <div style={{
                fontSize: "3.5rem",
                fontFamily: "var(--font-display-family)",
                letterSpacing: "0.05em",
                color: accentColor,
                lineHeight: 1,
                marginBottom: 4,
              }}>
                {note}
              </div>
              <p style={{ color: "rgba(240,238,234,0.4)", fontSize: "0.72rem", margin: "0 0 24px" }}>
                {tx.detectedNote} {note}
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  onClick={() => isLow ? resetLow() : resetHigh()}
                  style={{
                    border: "1px solid rgba(255,255,255,0.18)",
                    color: "rgba(240,238,234,0.6)",
                    background: "transparent",
                    padding: "0.55rem 1.2rem",
                    cursor: "pointer",
                    fontSize: "0.72rem",
                    fontFamily: "var(--font-display-family)",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    transition: "border-color 0.2s, color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.4)";
                    (e.currentTarget as HTMLButtonElement).style.color = "#f0eeea";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.18)";
                    (e.currentTarget as HTMLButtonElement).style.color = "rgba(240,238,234,0.6)";
                  }}
                >
                  {tx.reRecord}
                </button>
                <button
                  onClick={() => {
                    if (isLow) setStep("high");
                    else setStep("tessitura");
                  }}
                  style={{
                    background: accentColor,
                    color: "#fff",
                    border: "none",
                    padding: "0.55rem 1.4rem",
                    cursor: "pointer",
                    fontSize: "0.72rem",
                    fontFamily: "var(--font-display-family)",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
                >
                  {tx.confirm}
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (step === "tessitura") {
      return (
        <div style={{ textAlign: "center", animation: "vrFadeIn 0.25s both" }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 20, justifyContent: "center" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                width: 24, height: 3,
                background: i === 2 ? accentColor : "rgba(255,255,255,0.18)",
                borderRadius: 2,
                transition: "background 0.3s",
              }} />
            ))}
          </div>
          <p style={{
            color: "rgba(240,238,234,0.55)",
            fontSize: "0.78rem",
            lineHeight: 1.7,
            marginBottom: 24,
            maxWidth: 300,
            marginLeft: "auto",
            marginRight: "auto",
          }}>
            {tx.holdInstructionTessitura}
          </p>

          {tessituraRecordState !== "done" && (
            <>
              <HoldButton which="tessitura" />
              {tessituraRecordState === "recording" && (
                <>
                  {currentPitch && (
                    <div style={{ marginTop: 14, fontSize: "0.72rem", letterSpacing: "0.18em", color: accentColor }}>
                      {currentPitch}
                    </div>
                  )}
                  <div style={{
                    marginTop: 10,
                    fontSize: "0.65rem",
                    letterSpacing: "0.14em",
                    color: "rgba(240,238,234,0.4)",
                    maxWidth: 240,
                    margin: "10px auto 0",
                    lineHeight: 1.6,
                  }}>
                    {tx.tessituraAutoFinish}
                  </div>
                </>
              )}
              {tessituraError === "no-pitch" && (
                <p style={{ marginTop: 14, color: "#e88", fontSize: "0.72rem", letterSpacing: "0.14em" }}>
                  {tx.noPitchError}
                </p>
              )}
            </>
          )}

          {tessituraRecordState === "done" && tessituraNote && (
            <>
              <div style={{ fontSize: "2rem", marginBottom: 8 }}>✓</div>
              <div style={{
                fontSize: "0.72rem",
                letterSpacing: "0.22em",
                color: "rgba(240,238,234,0.6)",
                textTransform: "uppercase",
                marginBottom: 24,
              }}>
                {tx.tessituraDetectedLabel}
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button
                  onClick={() => resetTessitura()}
                  style={{
                    background: "transparent",
                    color: "rgba(240,238,234,0.6)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    padding: "0.55rem 1.2rem",
                    cursor: "pointer",
                    fontSize: "0.72rem",
                    fontFamily: "var(--font-display-family)",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  {tx.reRecord}
                </button>
                <button
                  onClick={() => setStep("results")}
                  style={{
                    background: accentColor,
                    color: "#fff",
                    border: "none",
                    padding: "0.55rem 1.4rem",
                    cursor: "pointer",
                    fontSize: "0.72rem",
                    fontFamily: "var(--font-display-family)",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  {tx.confirm}
                </button>
              </div>
            </>
          )}
        </div>
      );
    }

    if (step === "results") {
      if (validation && !validation.valid) {
        return (
          <div style={{ textAlign: "center", animation: "vrFadeIn 0.25s both" }}>
            <div style={{ fontSize: "2rem", marginBottom: 14 }}>⚠️</div>
            <p style={{
              color: "rgba(240,238,234,0.5)",
              fontSize: "0.68rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}>
              {tx.validationTitle}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              {validation.errorKeys.map((key) => (
                <p key={key} style={{
                  color: "rgba(240,238,234,0.65)",
                  fontSize: "0.84rem",
                  lineHeight: 1.6,
                  margin: 0,
                }}>
                  {tx.validationErrors[key]}
                </p>
              ))}
            </div>
            <button
              onClick={resetAll}
              style={{
                background: accentColor,
                color: "#fff",
                border: "none",
                padding: "0.7rem 2rem",
                cursor: "pointer",
                fontSize: "0.78rem",
                fontFamily: "var(--font-display-family)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
            >
              {tx.validationRetry}
            </button>
          </div>
        );
      }

      return (
        <div style={{ textAlign: "center", animation: "vrFadeIn 0.25s both" }}>
          <p style={{
            color: "rgba(240,238,234,0.4)",
            fontSize: "0.68rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            marginBottom: 12,
          }}>
            {tx.resultsTitle}
          </p>
          <div style={{
            fontSize: "clamp(2.8rem, 8vw, 4rem)",
            fontFamily: "var(--font-display-family)",
            letterSpacing: "0.04em",
            color: accentColor,
            lineHeight: 1,
            marginBottom: 8,
          }}>
            {confidenceQualifier}{voiceTypeData.name}
          </div>
          {classification && classification.confidence === "low" && (
            <p style={{
              color: "rgba(240,238,234,0.45)",
              fontSize: "0.75rem",
              lineHeight: 1.5,
              margin: "0 0 12px",
              fontStyle: "italic",
            }}>
              {tx.qualifierLowFootnote}
            </p>
          )}
          <p style={{
            color: "rgba(240,238,234,0.65)",
            fontSize: "0.88rem",
            lineHeight: 1.65,
            margin: "0 0 24px",
          }}>
            {voiceTypeData.desc}
          </p>
          <p style={{
            color: "rgba(240,238,234,0.4)",
            fontSize: "0.78rem",
            lineHeight: 1.65,
            margin: "0 0 28px",
            fontStyle: "italic",
          }}>
            {tx.disclaimer}
          </p>
          <button
            onClick={() => setStep("form")}
            style={{
              background: accentColor,
              color: "#fff",
              border: "none",
              padding: "0.7rem 2rem",
              cursor: "pointer",
              fontSize: "0.78rem",
              fontFamily: "var(--font-display-family)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
          >
            {tx.continueBtn}
          </button>
          <p style={{
            color: "rgba(240,238,234,0.35)",
            fontSize: "0.72rem",
            lineHeight: 1.6,
            margin: "20px 0 0",
            fontStyle: "italic",
          }}>
            {tx.disclaimerFooter}
          </p>
        </div>
      );
    }

    if (step === "form") {
      return (
        <div style={{ animation: "vrFadeIn 0.25s both" }}>
          <p style={{
            color: "rgba(240,238,234,0.4)",
            fontSize: "0.73rem",
            lineHeight: 1.65,
            marginBottom: 20,
            textAlign: "center",
          }}>
            {tx.formSubtitle}
          </p>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              <input
                required
                value={name}
                onChange={(e) => { setName(e.target.value); setSubmitStatus("idle"); }}
                placeholder={tx.namePlaceholder}
                style={inputStyle}
              />
              <input
                required
                value={contact}
                onChange={(e) => { setContact(e.target.value); setSubmitStatus("idle"); }}
                placeholder={tx.contactPlaceholder}
                style={inputStyle}
              />
            </div>
            {submitStatus === "error" && (
              <p style={{ color: "#e8002d", fontSize: "0.78rem", marginBottom: 12, textAlign: "center" }}>
                {tx.errorMsg}
              </p>
            )}
            <button
              type="submit"
              disabled={submitStatus === "sending"}
              style={{
                width: "100%",
                background: accentColor,
                color: "#fff",
                border: "none",
                padding: "0.75rem 1rem",
                cursor: submitStatus === "sending" ? "not-allowed" : "pointer",
                fontSize: "0.78rem",
                fontFamily: "var(--font-display-family)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                opacity: submitStatus === "sending" ? 0.7 : 1,
                transition: "opacity 0.2s",
              }}
            >
              {submitStatus === "sending" ? tx.sending : tx.ctaButton}
            </button>
          </form>
        </div>
      );
    }

    if (step === "success") {
      return (
        <div style={{ textAlign: "center", padding: "8px 0", animation: "vrFadeIn 0.25s both" }}>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>✅</div>
          <div style={{
            fontSize: "1.4rem",
            fontFamily: "var(--font-display-family)",
            letterSpacing: "0.04em",
            color: accentColor,
            marginBottom: 12,
          }}>
            {tx.successTitle}
          </div>
          <p style={{ color: "rgba(240,238,234,0.55)", fontSize: "0.85rem", lineHeight: 1.65, margin: 0 }}>
            {tx.successText}
          </p>
        </div>
      );
    }

    return null;
  }

  function getTitle(): string {
    if (step === "mic-check")  return tx.stepMicTitle;
    if (step === "mic-error")  return tx.stepMicTitle;
    if (step === "low")        return tx.stepLowTitle;
    if (step === "high")       return tx.stepHighTitle;
    if (step === "tessitura")  return tx.stepTessituraTitle;
    if (step === "results")    return "";
    if (step === "form")       return tx.formTitle;
    if (step === "success")    return "✓";
    return "";
  }

  return (
    <>
      {/* ── Trigger button ── */}
      <button
        className="font-display uppercase"
        onClick={open}
        style={{
          fontSize: "0.72rem",
          letterSpacing: "0.16em",
          padding: "calc(0.875rem - 1px) calc(1.5rem - 1px)",
          border: `1px solid ${tBorder}`,
          color: tColor,
          background: "transparent",
          cursor: "pointer",
          whiteSpace: "nowrap",
          transition: "color 0.2s, border-color 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = tHoverColor;
          (e.currentTarget as HTMLButtonElement).style.borderColor = tHoverBorder;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = tColor;
          (e.currentTarget as HTMLButtonElement).style.borderColor = tBorder;
        }}
      >
        {tx.trigger}
      </button>

      {step !== "closed" && createPortal(
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 10000,
            overflowY: "auto",
            background: "rgba(0,0,0,0.82)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            padding: 16,
            animation: "vrFadeIn 0.15s both",
            display: "flex",
            alignItems: "flex-start",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 440,
              margin: "auto",
              background: "#111111",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "18px 28px 28px",
              boxSizing: "border-box",
            }}
          >
            {/* Close button */}
            <button
              onClick={close}
              style={{
                position: "absolute", top: 14, right: 14,
                width: 30, height: 30,
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.14)",
                color: "rgba(240,238,234,0.5)",
                cursor: "pointer",
                fontSize: "1rem",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "color 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#f0eeea";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.4)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "rgba(240,238,234,0.5)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.14)";
              }}
            >
              ×
            </button>

            {/* Step title */}
            {step !== "success" && getTitle() !== "" && (
              <p style={{
                color: "rgba(240,238,234,0.35)",
                fontSize: "0.65rem",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                margin: "0 0 20px",
                paddingRight: 36,
              }}>
                {getTitle()}
              </p>
            )}

            {/* Content */}
            {renderContent()}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
