import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/langContext";
import { t } from "@/lib/i18n";
import { formatPhone } from "@/lib/phoneFormat";
import {
  autocorrelate,
  frequencyToNote,
  frequencyToMidi,
  computeTessitura,
  classifyVoice,
  validateSession,
  noteToRussian,
  type VoiceClassification,
  type SessionValidation,
} from "@/lib/pitchDetection";

const MAX_DURATION = 5000;
const TESSITURA_DURATION = 8000;
const SAMPLE_INTERVAL = 50;
const CIRC = 276; // 2π × 44 ≈ 276.46

type Step = "closed" | "mic-check" | "mic-error" | "low" | "high" | "tessitura" | "sex" | "results" | "form" | "success";
type RecordState = "idle" | "recording" | "done";
type MicError = "" | "denied" | "unsupported" | "general";

interface VoiceRangeWidgetProps {
  accentColor: string;
  pageName: string;
  lightMode?: boolean;
  inline?: boolean;
  sectionId?: string;
}

interface HoldButtonProps {
  which: "low" | "high" | "tessitura";
  accentColor: string;
  recordState: RecordState;
  ringRef: React.RefObject<SVGCircleElement | null>;
  touchActiveRef: React.MutableRefObject<boolean>;
  onHoldStart: (which: "low" | "high" | "tessitura") => void;
  onHoldEnd: () => void;
  onTouchStart: (which: "low" | "high" | "tessitura", e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

function HoldButton({ which, accentColor, recordState, ringRef, touchActiveRef, onHoldStart, onHoldEnd, onTouchStart, onTouchEnd }: HoldButtonProps) {
  const isRecording = recordState === "recording";
  return (
    <div style={{ position: "relative", width: 100, height: 100, margin: "0 auto" }}>
      <svg width={100} height={100} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <circle cx={50} cy={50} r={43} fill={accentColor} fillOpacity={isRecording ? 0.18 : 0} style={{ transition: "fill-opacity 0.15s" }} />
        <circle cx={50} cy={50} r={44} fill="none" stroke={accentColor} strokeWidth={2} opacity={isRecording ? 0 : 0.25} style={{ transition: "opacity 0.15s" }} />
        {isRecording && (
          <circle
            ref={ringRef}
            cx={50} cy={50} r={44}
            fill="none"
            stroke={accentColor}
            strokeWidth={3}
            strokeDasharray={CIRC}
            strokeDashoffset={0}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
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
        onMouseDown={() => !touchActiveRef.current && onHoldStart(which)}
        onMouseUp={() => !touchActiveRef.current && onHoldEnd()}
        onMouseLeave={() => !touchActiveRef.current && onHoldEnd()}
        onTouchStart={(e) => onTouchStart(which, e)}
        onTouchEnd={(e) => onTouchEnd(e)}
        onTouchCancel={(e) => onTouchEnd(e)}
      >
        🎤
      </button>
    </div>
  );
}

export function VoiceRangeWidget({
  accentColor,
  pageName,
  lightMode = false,
  inline = false,
  sectionId,
}: VoiceRangeWidgetProps) {
  const { lang } = useLang();
  const tx = t[lang].voiceWidget;

  /* Letter-spacing for body-font (DM Sans) labels — Cyrillic glyphs are
     inherently wider than Latin so the English values look stretched in Russian. */
  const lsXl = lang === "ru" ? "0.07em" : "0.24em";  // step title header
  const lsLg = lang === "ru" ? "0.07em" : "0.22em";  // section labels / resultsTitle
  const lsMd = lang === "ru" ? "0.07em" : "0.18em";  // hold-label / live pitch display

  function displayNote(note: string | null): string {
    if (!note) return "—";
    if (lang !== "ru") return note;
    return `${note} (${noteToRussian(note)})`;
  }

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

  const [currentPitch,   setCurrentPitch]   = useState<string | null>(null);

  const [biologicalSex, setBiologicalSex] = useState<"male" | "female" | null>(null);

  const [name,         setName]        = useState("");
  const [contact,      setContact]     = useState("");
  const [contactError, setContactError] = useState("");
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
  const ringRef         = useRef<SVGCircleElement>(null);
  const touchActiveRef  = useRef(false);
  const lowHzRef              = useRef<number | null>(null);
  const lowPitchSamplesRef    = useRef<number[]>([]);
  const highPitchSamplesRef   = useRef<number[]>([]);
  const tessituralPitchSamplesRef = useRef<number[]>([]);
  const sessionRef            = useRef(0);
  const prevStepRef           = useRef<Step>("closed");

  // Scroll on first open:
  //   Mobile  → panel top sits ~48 px below the viewport top
  //   Desktop → section bottom aligns with viewport bottom (original behaviour)
  useEffect(() => {
    const wasOpen = prevStepRef.current !== "closed";
    prevStepRef.current = step;
    if (!inline || wasOpen || step === "closed" || !sectionId) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Mobile layout = below the site's md breakpoint (75rem = 1200px)
        const isMobile = window.innerWidth < 1200;
        if (isMobile) {
          const panel = document.querySelector(`#${sectionId} [data-widget-panel]`) as HTMLElement | null;
          if (panel) {
            const headerHeight = (document.querySelector("nav") as HTMLElement | null)?.offsetHeight ?? 76;
            const rect = panel.getBoundingClientRect();
            const target = window.scrollY + rect.top - headerHeight - 48;
            if (target > 0) window.scrollTo({ top: target, behavior: "smooth" });
          }
        } else {
          const section = document.getElementById(sectionId);
          if (!section) return;
          const rect = section.getBoundingClientRect();
          const target = window.scrollY + rect.bottom - window.innerHeight;
          if (target > window.scrollY) {
            window.scrollTo({ top: target, behavior: "smooth" });
          }
        }
      });
    });
  }, [step, sectionId, inline]);

  // Release mic as soon as we reach results — keeps it alive for re-recording
  // on any earlier step (including tessitura re-do)
  useEffect(() => {
    if (step === "results" || step === "success") {
      releaseAudio();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => {
    if (inline) return;
    if (step !== "closed") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [step, inline]);

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

      // When the OS revokes mic access (e.g. screen lock on mobile), all
      // tracks end. Detect this and reset so the user can re-grant permission.
      stream.getAudioTracks().forEach((track) => {
        track.addEventListener("ended", () => {
          if (sessionRef.current !== sessionId) return;
          releaseAudio();
          setMicError("denied");
          setStep("mic-error");
        });
      });

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
    setCurrentPitch(null);

    const loop = () => {
      if (!isRecordingRef.current) return;
      const elapsed = performance.now() - recordStartRef.current;
      const activeDuration = recordingForRef.current === "tessitura" ? TESSITURA_DURATION : MAX_DURATION;
      if (ringRef.current) ringRef.current.style.strokeDashoffset = String(CIRC * (elapsed / activeDuration));

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
    setCurrentPitch(null);
    setBiologicalSex(null);
    setName(""); setContact(""); setContactError(""); setSubmitStatus("idle");
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
    setCurrentPitch(null);
  }

  function resetTessitura() {
    cancelAnimationFrame(rafRef.current);
    isRecordingRef.current = false;
    setTessituraRecordState("idle");
    setTessituraNote(null);
    setTessituraError("");
    tessituralPitchSamplesRef.current = [];
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
    setCurrentPitch(null);
    setBiologicalSex(null);
    // Audio was released when we entered "results" — re-request the mic
    // before returning to step 1 so recording isn't silent.
    sessionRef.current += 1;
    const sessionId = sessionRef.current;
    setMicError("");
    setStep("mic-check");
    requestMic(sessionId);
  }

  function handleSmsPreview() {
    const stableLowMidi2  = lowHz  ? frequencyToMidi(lowHz)  : 60;
    const stableHighMidi2 = highHz ? frequencyToMidi(highHz) : 72;
    const tessSource = tessituralPitchSamplesRef.current.length > 0
      ? tessituralPitchSamplesRef.current : null;
    const tessMidi = tessSource
      ? computeTessitura(tessSource)
      : (stableLowMidi2 + stableHighMidi2) / 2;
    const tessHz2  = 440 * Math.pow(2, (tessMidi - 69) / 12);
    const tessNote2 = frequencyToNote(tessHz2);
    const span2 = stableHighMidi2 - stableLowMidi2;
    const cls = classifyVoice(stableLowMidi2, tessMidi, span2, biologicalSex ?? undefined);
    const vtName = tx.voiceTypes[cls.primary].name;
    const ruName  = tx.voiceTypes[cls.runnerUp].name;
    const octStr  = (lowHz && highHz) ? Math.log2(highHz / lowHz).toFixed(1) : "—";
    const isRu    = lang === "ru";
    const confLabel = cls.confidence === "high"   ? (isRu ? "высокая" : "high")
                    : cls.confidence === "medium" ? (isRu ? "средняя" : "medium")
                    :                               (isRu ? "низкая"  : "low");
    const sexLabel  = biologicalSex === "male"   ? (isRu ? "Мужской" : "Male")
                    : biologicalSex === "female" ? (isRu ? "Женский" : "Female")
                    : "—";
    const ts = new Date().toLocaleString(isRu ? "ru-RU" : "en-US");

    const row = (label: string, value: string) =>
      `<tr><td class="lbl">${label}</td><td class="val">${value}</td></tr>`;

    const runnerUpRow = cls.confidence !== "high"
      ? row(isRu ? "Ближайший вариант" : "Runner-up", `${ruName}`)
      : "";

    const html = `<!DOCTYPE html>
<html lang="${isRu ? "ru" : "en"}">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${isRu ? "Анализ голоса — vocal.uz" : "Voice Analysis — vocal.uz"}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#0f1016;color:#f0eeea;font-family:system-ui,sans-serif;padding:32px 20px;max-width:520px;margin:0 auto}
    h1{font-size:1rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(240,238,234,.4);margin-bottom:28px}
    .brand{color:#e8002d;margin-right:4px}
    table{width:100%;border-collapse:collapse;margin-bottom:24px}
    tr{border-bottom:1px solid rgba(255,255,255,.07)}
    td{padding:10px 0;font-size:.9rem;line-height:1.5;vertical-align:top}
    .lbl{color:rgba(240,238,234,.45);width:45%;padding-right:12px}
    .val{color:#f0eeea;font-weight:500}
    .section{margin-bottom:8px;font-size:.65rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(240,238,234,.28);padding-top:20px}
    .voice{font-size:2.2rem;letter-spacing:.04em;color:#e8002d;margin:16px 0 6px}
    .note{font-size:.72rem;color:rgba(240,238,234,.35);font-style:italic;margin-top:24px}
  </style>
</head>
<body>
  <h1><span class="brand">VOCAL.UZ</span> · ${isRu ? "Анализ голоса" : "Voice Analysis"}</h1>

  <div class="section">${isRu ? "Личные данные" : "Personal"}</div>
  <table>
    ${row(isRu ? "Имя" : "Name", name || "—")}
    ${row(isRu ? "Телефон" : "Phone", contact || "—")}
    ${row(isRu ? "Пол" : "Sex", sexLabel)}
  </table>

  <div class="section">${isRu ? "Диапазон" : "Vocal Range"}</div>
  <table>
    ${row(isRu ? "Нижняя нота" : "Lowest note", `${lowNote ? (isRu ? `${lowNote} (${noteToRussian(lowNote)})` : lowNote) : "—"} — ${lowHz ?? "—"} ${isRu ? "Гц" : "Hz"}`)}
    ${row(isRu ? "Верхняя нота" : "Highest note", `${highNote ? (isRu ? `${highNote} (${noteToRussian(highNote)})` : highNote) : "—"} — ${highHz ?? "—"} ${isRu ? "Гц" : "Hz"}`)}
    ${row(isRu ? "Тесситура" : "Tessitura", isRu ? `${tessNote2} (${noteToRussian(tessNote2)})` : tessNote2)}
    ${row(isRu ? "Диапазон" : "Range", `${octStr} ${isRu ? "окт." : "oct."} / ${span2} ${isRu ? "полутонов" : "semitones"}`)}
  </table>

  <div class="section">${isRu ? "Результат" : "Result"}</div>
  <div class="voice">${vtName}</div>
  <table>
    ${row(isRu ? "Достоверность" : "Confidence", confLabel)}
    ${runnerUpRow}
  </table>

  <div class="section">${isRu ? "Сессия" : "Session"}</div>
  <table>
    ${row(isRu ? "Страница" : "Page", pageName)}
    ${row(isRu ? "Время" : "Time", ts)}
  </table>

  <p class="note">${isRu ? "Предварительный результат — сформирован виджетом vocal.uz." : "Preliminary result generated by the vocal.uz widget."}</p>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url  = URL.createObjectURL(blob);
    window.open(url, "_blank");
  }

  function handleContactKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.ctrlKey || e.metaKey) return;
    if (e.key === "Backspace") {
      e.preventDefault();
      const cur = contact.replace(/\D/g, "");
      const next = cur.slice(0, -1);
      setContact(next ? formatPhone(next) : "");
      setContactError("");
      setSubmitStatus("idle");
      return;
    }
    if (e.key === "Delete") { e.preventDefault(); return; }
    if (["ArrowLeft", "ArrowRight", "Tab", "Home", "End", "Enter"].includes(e.key)) return;
    if (/^\d$/.test(e.key)) {
      e.preventDefault();
      const cur = contact.replace(/\D/g, "");
      if (cur.length >= 15) return;
      setContact(formatPhone(cur + e.key));
      setContactError("");
      setSubmitStatus("idle");
      return;
    }
    e.preventDefault();
  }

  function handleContactChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    const newDigits = newValue.replace(/\D/g, "").slice(0, 15);
    const oldDigits = contact.replace(/\D/g, "");
    let finalDigits: string;
    if (newDigits.length < oldDigits.length) {
      finalDigits = newDigits;
    } else if (newDigits.length === oldDigits.length && newValue !== contact) {
      finalDigits = oldDigits.slice(0, -1);
    } else {
      finalDigits = newDigits;
    }
    setContact(finalDigits ? formatPhone(finalDigits) : "");
    setContactError("");
    setSubmitStatus("idle");
  }

  function handleContactPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    const filtered = text.replace(/[^\d()\-\s]/g, "");
    const digits = filtered.replace(/\D/g, "").slice(0, 15);
    setContact(digits ? formatPhone(digits) : "");
    setContactError("");
    setSubmitStatus("idle");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const digits = contact.replace(/\D/g, "");
    if (digits.length < 7) {
      setContactError(lang === "ru" ? "Введите корректный номер телефона" : "Please enter a valid phone number");
      return;
    }
    setContactError("");
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
    const classification = classifyVoice(stableLowMidi, tessituraMidi, span, biologicalSex ?? undefined);

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
          lowestNote:         lowNote && lang === "ru" ? `${lowNote} (${noteToRussian(lowNote)})` : lowNote,
          lowestHz:           lowHz,
          highestNote:        highNote && lang === "ru" ? `${highNote} (${noteToRussian(highNote)})` : highNote,
          highestHz:          highHz,
          rangeOctaves,
          rangeSpan:          span,
          voiceType:          voiceTypeName,
          tessitura:          lang === "ru" ? `${tessNote} (${noteToRussian(tessNote)})` : tessNote,
          confidenceLevel:    classification.confidence,
          runnerUp:           runnerUpName,
          validationWarnings,
          sex:                biologicalSex ?? undefined,
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
        biologicalSex ?? undefined,
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

  // ── Inline design tokens — adapt to banner darkness ───────────────────────
  // lightMode=true  → light banner (Express Karaoke)  → dark widget
  // lightMode=false → dark banner (all others)         → cream widget
  const IC_panelBg  = lightMode ? "#080808"                 : "#F5F0E8";
  const IC_panelBdr = lightMode ? "rgba(255,255,255,0.10)"  : "rgba(15,16,22,0.18)";
  const IC_text1    = lightMode ? "rgba(255,255,255,0.85)"  : "#0f1016";
  const IC_text2    = lightMode ? "rgba(255,255,255,0.65)"  : "rgba(15,16,22,0.80)";
  const IC_text3    = lightMode ? "rgba(255,255,255,0.45)"  : "rgba(15,16,22,0.65)";
  const IC_text4    = lightMode ? "rgba(255,255,255,0.32)"  : "rgba(15,16,22,0.50)";
  const IC_dash     = lightMode ? "rgba(255,255,255,0.18)"  : "rgba(15,16,22,0.14)";
  const IC_ghost    = lightMode ? "rgba(255,255,255,0.22)"  : "rgba(15,16,22,0.18)";
  const IC_ghostFg  = lightMode ? "rgba(255,255,255,0.70)"  : "rgba(15,16,22,0.60)";
  const IC_ghostHB  = lightMode ? "rgba(255,255,255,0.50)"  : "rgba(15,16,22,0.40)";
  const IC_hoverFg  = lightMode ? "#f0eeea"                 : "#1a1a1a";
  const IC_inputBg  = lightMode ? "rgba(255,255,255,0.07)"  : "rgba(15,16,22,0.05)";
  const IC_inputClr = lightMode ? "#f0eeea"                 : "#1a1a1a";
  // ──────────────────────────────────────────────────────────────────────────

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: IC_inputBg,
    border: `1px solid ${IC_ghost}`,
    color: IC_inputClr,
    padding: "0.65rem 0.9rem",
    fontSize: "0.88rem",
    outline: "none",
    borderRadius: 0,
    boxSizing: "border-box",
  };

  function renderContent() {
    if (step === "mic-check") {
      return (
        <div style={{ textAlign: "center", padding: "16px 0 8px" }}>
          <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}>
            <svg width="48" height="58" viewBox="0 0 48 58" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Ribbon capsule — tall narrow rectangle */}
              <rect x="17" y="3" width="14" height="28" rx="2" stroke={accentColor} strokeWidth="1.8" fill="none"/>
              {/* Horizontal slats inside capsule */}
              <line x1="19" y1="9"  x2="29" y2="9"  stroke={IC_dash} strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="19" y1="13" x2="29" y2="13" stroke={IC_dash} strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="19" y1="17" x2="29" y2="17" stroke={IC_dash} strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="19" y1="21" x2="29" y2="21" stroke={IC_dash} strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="19" y1="25" x2="29" y2="25" stroke={IC_dash} strokeWidth="1.2" strokeLinecap="round"/>
              {/* Side brackets */}
              <line x1="10" y1="10" x2="17" y2="10" stroke={accentColor} strokeWidth="1.6" strokeLinecap="round"/>
              <line x1="10" y1="10" x2="10" y2="24" stroke={accentColor} strokeWidth="1.6" strokeLinecap="round"/>
              <line x1="10" y1="24" x2="17" y2="24" stroke={accentColor} strokeWidth="1.6" strokeLinecap="round"/>
              <line x1="31" y1="10" x2="38" y2="10" stroke={accentColor} strokeWidth="1.6" strokeLinecap="round"/>
              <line x1="38" y1="10" x2="38" y2="24" stroke={accentColor} strokeWidth="1.6" strokeLinecap="round"/>
              <line x1="31" y1="24" x2="38" y2="24" stroke={accentColor} strokeWidth="1.6" strokeLinecap="round"/>
              {/* Short handle */}
              <rect x="21" y="31" width="6" height="12" rx="1.5" stroke={accentColor} strokeWidth="1.6" fill="none"/>
              {/* Stand rod */}
              <line x1="24" y1="43" x2="24" y2="51" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round"/>
              {/* Base */}
              <line x1="15" y1="51" x2="33" y2="51" stroke={accentColor} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <p style={{ color: IC_text2, fontSize: "0.88rem", lineHeight: 1.6, margin: 0 }}>
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
          <p style={{ color: IC_text2, fontSize: "0.85rem", lineHeight: 1.7, margin: "0 0 24px" }}>
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
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{
                width: 24, height: 3,
                background: (isLow ? i === 0 : i === 1) ? accentColor : IC_dash,
                borderRadius: 2,
                transition: "background 0.3s",
              }} />
            ))}
          </div>

          <p style={{
            textAlign: "center",
            color: IC_text1,
            fontSize: "0.88rem",
            lineHeight: 1.7,
            margin: "0 0 28px",
          }}>
            {isLow ? tx.holdInstructionLow : tx.holdInstructionHigh}
          </p>

            {rs !== "done" && (
            <>
              <HoldButton
                which={isLow ? "low" : "high"}
                accentColor={accentColor}
                recordState={rs}
                ringRef={ringRef}
                touchActiveRef={touchActiveRef}
                onHoldStart={handleHoldStart}
                onHoldEnd={handleHoldEnd}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              />
              <p style={{
                textAlign: "center",
                color: rs === "recording" ? accentColor : IC_text4,
                fontSize: "0.72rem",
                letterSpacing: lsMd,
                textTransform: "uppercase",
                marginTop: 12,
              }}>
                {rs === "recording" ? (currentPitch ? displayNote(currentPitch) : tx.recording) : tx.holdLabel}
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
                marginBottom: lang === "ru" ? 2 : 4,
              }}>
                {note}
              </div>
              {lang === "ru" && note && (
                <div style={{ color: accentColor, fontSize: "1.3rem", fontFamily: "var(--font-display-family)", letterSpacing: "0.04em", marginBottom: 4, opacity: 0.8 }}>
                  {noteToRussian(note)}
                </div>
              )}
              <p style={{ color: IC_text3, fontSize: "0.72rem", margin: "0 0 24px" }}>
                {tx.detectedNote} {displayNote(note)}
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  onClick={() => isLow ? resetLow() : resetHigh()}
                  style={{
                    border: `1px solid ${IC_ghost}`,
                    color: IC_ghostFg,
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
                    (e.currentTarget as HTMLButtonElement).style.borderColor = IC_ghostHB;
                    (e.currentTarget as HTMLButtonElement).style.color = IC_hoverFg;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = IC_ghost;
                    (e.currentTarget as HTMLButtonElement).style.color = IC_ghostFg;
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
                  {tx.confirmMobile && tx.confirmMobile !== tx.confirm ? (
                    <>
                      <span className="md:hidden">{tx.confirmMobile}</span>
                      <span className="hidden md:inline">{tx.confirm}</span>
                    </>
                  ) : tx.confirm}
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
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{
                width: 24, height: 3,
                background: i === 2 ? accentColor : IC_dash,
                borderRadius: 2,
                transition: "background 0.3s",
              }} />
            ))}
          </div>
          <p style={{
            color: IC_text2,
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
              <HoldButton
                which="tessitura"
                accentColor={accentColor}
                recordState={tessituraRecordState}
                ringRef={ringRef}
                touchActiveRef={touchActiveRef}
                onHoldStart={handleHoldStart}
                onHoldEnd={handleHoldEnd}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              />
              {tessituraRecordState === "recording" && (
                <>
                  {currentPitch && (
                    <div style={{ marginTop: 14, fontSize: "0.72rem", letterSpacing: lsMd, color: accentColor }}>
                      {displayNote(currentPitch)}
                    </div>
                  )}
                  <div style={{
                    marginTop: 10,
                    fontSize: "0.65rem",
                    letterSpacing: "0.14em",
                    color: IC_text3,
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
              <div style={{ fontSize: "2rem", marginBottom: 8, color: accentColor }}>✓</div>
              <div style={{
                fontSize: "0.72rem",
                letterSpacing: lsLg,
                color: IC_text2,
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
                    color: IC_ghostFg,
                    border: `1px solid ${IC_ghost}`,
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
                  onClick={() => setStep("sex")}
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
                  {tx.confirmMobile && tx.confirmMobile !== tx.confirm ? (
                    <>
                      <span className="md:hidden">{tx.confirmMobile}</span>
                      <span className="hidden md:inline">{tx.confirm}</span>
                    </>
                  ) : tx.confirm}
                </button>
              </div>
            </>
          )}
        </div>
      );
    }

    if (step === "sex") {
      return (
        <div style={{ textAlign: "center", animation: "vrFadeIn 0.25s both" }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 20, justifyContent: "center" }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{
                width: 24, height: 3,
                background: i === 3 ? accentColor : IC_dash,
                borderRadius: 2,
                transition: "background 0.3s",
              }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 8 }}>
            {(["male", "female"] as const).map((option) => (
              <button
                key={option}
                onClick={() => { setBiologicalSex(option); setStep("results"); }}
                style={{
                  flex: 1,
                  maxWidth: 160,
                  padding: "1.1rem 0.5rem",
                  background: "transparent",
                  border: `1px solid ${IC_ghost}`,
                  color: IC_ghostFg,
                  fontSize: "0.9rem",
                  fontFamily: "var(--font-display-family)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "border-color 0.2s, color 0.2s, background 0.2s",
                }}
                onMouseEnter={(e) => {
                  const btn = e.currentTarget as HTMLButtonElement;
                  btn.style.borderColor = accentColor;
                  btn.style.color = accentColor;
                }}
                onMouseLeave={(e) => {
                  const btn = e.currentTarget as HTMLButtonElement;
                  btn.style.borderColor = IC_ghost;
                  btn.style.color = IC_ghostFg;
                }}
              >
                {option === "male" ? tx.sexOptionMale : tx.sexOptionFemale}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (step === "results") {
      if (validation && !validation.valid) {
        return (
          <div style={{ textAlign: "center", animation: "vrFadeIn 0.25s both" }}>
            <div style={{ fontSize: "2rem", marginBottom: 14 }}>⚠️</div>
            <p style={{
              color: IC_text3,
              fontSize: "0.68rem",
              letterSpacing: lsLg,
              textTransform: "uppercase",
              marginBottom: 16,
            }}>
              {tx.validationTitle}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              {validation.errorKeys.map((key) => (
                <p key={key} style={{
                  color: IC_text1,
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
            color: IC_text3,
            fontSize: "0.68rem",
            letterSpacing: lsLg,
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
              color: IC_text3,
              fontSize: "0.75rem",
              lineHeight: 1.5,
              margin: "0 0 12px",
              fontStyle: "italic",
            }}>
              {tx.qualifierLowFootnote}
            </p>
          )}
          <p style={{
            color: IC_text1,
            fontSize: "0.88rem",
            lineHeight: 1.65,
            margin: "0 0 24px",
          }}>
            {voiceTypeData.desc}
          </p>
          <p style={{
            color: IC_text3,
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
            color: IC_text4,
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
            color: IC_text3,
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
                type="tel"
                required
                value={contact}
                onChange={handleContactChange}
                onKeyDown={handleContactKeyDown}
                onPaste={handleContactPaste}
                placeholder={tx.contactPlaceholder}
                style={inputStyle}
              />
              {contactError && (
                <p style={{ color: "#e8002d", fontSize: "0.73rem", margin: "-4px 0 4px 2px" }}>
                  {contactError}
                </p>
              )}
            </div>
            {submitStatus === "error" && (
              <p style={{ color: "#e8002d", fontSize: "0.78rem", marginBottom: 12, textAlign: "center" }}>
                {tx.errorMsg}
              </p>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="submit"
                disabled={submitStatus === "sending"}
                style={{
                  flex: 1,
                  background: accentColor,
                  color: "#fff",
                  border: "none",
                  padding: "0.75rem 0.5rem",
                  cursor: submitStatus === "sending" ? "not-allowed" : "pointer",
                  fontSize: "0.72rem",
                  fontFamily: "var(--font-display-family)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  opacity: submitStatus === "sending" ? 0.7 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                {submitStatus === "sending" ? tx.sending : tx.ctaButton}
              </button>
              <button
                type="button"
                onClick={handleSmsPreview}
                style={{
                  flex: 1,
                  background: "transparent",
                  color: IC_ghostFg,
                  border: `1px solid ${IC_ghost}`,
                  padding: "0.75rem 0.5rem",
                  cursor: "pointer",
                  fontSize: "0.72rem",
                  fontFamily: "var(--font-display-family)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  transition: "border-color 0.2s, color 0.2s",
                }}
                onMouseEnter={(e) => {
                  const btn = e.currentTarget as HTMLButtonElement;
                  btn.style.borderColor = IC_ghostHB;
                  btn.style.color = IC_hoverFg;
                }}
                onMouseLeave={(e) => {
                  const btn = e.currentTarget as HTMLButtonElement;
                  btn.style.borderColor = IC_ghost;
                  btn.style.color = IC_ghostFg;
                }}
              >
                {tx.smsButton}
              </button>
            </div>
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
          <p style={{ color: IC_text2, fontSize: "0.85rem", lineHeight: 1.65, margin: 0 }}>
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
    if (step === "sex")        return tx.stepSexTitle;
    if (step === "results")    return "";
    if (step === "form")       return tx.formTitle;
    if (step === "success")    return "✓";
    return "";
  }

  const txIV = t[lang].inlineVoice;

  if (inline) {
    const startColor      = lightMode ? "#080808" : "#f0eeea";
    const startBorder     = lightMode ? "rgba(8,8,8,0.50)"   : "rgba(240,238,234,0.50)";
    const startHoverColor = startColor;

    const waveBarSm = ([
      [2, 0.82, 0.00], [3, 1.10, 0.08], [5, 0.70, 0.16], [7, 1.25, 0.04],
      [8, 0.90, 0.20], [8, 1.15, 0.12], [7, 0.75, 0.28], [5, 1.30, 0.36],
      [3, 0.85, 0.44], [2, 1.05, 0.24], [4, 0.78, 0.32], [6, 1.20, 0.40],
    ] as [number, number, number][]);

    if (step === "closed") {
      const lgScale = 1.5;
      return (
        <button
          className="font-display uppercase"
          onClick={open}
          style={{
            width: "100%",
            maxWidth: 400,
            display: "block",
            margin: "0 auto",
            background: "transparent",
            color: startColor,
            border: `1px solid ${startBorder}`,
            padding: `calc(1.25rem - 1px) calc(2.5rem - 1px)`,
            fontSize: "1.1rem",
            letterSpacing: "0.15em",
            cursor: "pointer",
            position: "relative",
            transition: "color 0.2s, border-color 0.2s",
          }}
          onMouseEnter={(e) => {
            const b = e.currentTarget as HTMLButtonElement;
            b.style.color = startHoverColor;
            b.style.borderColor = startHoverColor;
          }}
          onMouseLeave={(e) => {
            const b = e.currentTarget as HTMLButtonElement;
            b.style.color = startColor;
            b.style.borderColor = startBorder;
          }}
        >
          {txIV.startBtn}
          <span aria-hidden="true" style={{
            position: "absolute",
            bottom: Math.round(4 * lgScale),
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: Math.round(2 * lgScale),
            alignItems: "center",
            height: Math.round(8 * lgScale),
            pointerEvents: "none",
          }}>
            {waveBarSm.map(([h, dur, delay], i) => (
              <span key={i} style={{
                display: "inline-block",
                width: Math.round(2 * lgScale),
                height: Math.round(h * lgScale),
                background: startColor,
                opacity: 0.5,
                borderRadius: 999,
                animation: `vrWaveBar ${dur}s ${delay}s ease-in-out infinite`,
              }} />
            ))}
          </span>
        </button>
      );
    }

    return (
      <div style={{ maxWidth: 480, width: "100%", margin: "0 auto", animation: "vrFadeIn 0.2s both", textAlign: "left" }}>
        <div
          data-widget-panel
          style={{
            position: "relative",
            background: IC_panelBg,
            borderTop: `2px solid ${accentColor}`,
            borderRight: `1px solid ${IC_panelBdr}`,
            borderBottom: `1px solid ${IC_panelBdr}`,
            borderLeft: `1px solid ${IC_panelBdr}`,
            padding: "18px 28px 28px",
            boxSizing: "border-box",
            minHeight: 420,
            display: "flex",
            flexDirection: "column",
            fontFamily: lang === "ru" ? "'Inter', sans-serif" : undefined,
            letterSpacing: lang === "ru" ? 0 : undefined,
          }}
        >
          {/* Reset button — returns to idle start state */}
          <button
            onClick={close}
            style={{
              position: "absolute", top: 14, right: 14,
              width: 30, height: 30,
              background: "transparent",
              border: `1px solid ${IC_ghost}`,
              color: IC_text3,
              cursor: "pointer",
              fontSize: "1rem",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "color 0.2s, border-color 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = IC_hoverFg;
              (e.currentTarget as HTMLButtonElement).style.borderColor = IC_ghostHB;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = IC_text3;
              (e.currentTarget as HTMLButtonElement).style.borderColor = IC_ghost;
            }}
          >
            ×
          </button>

          {/* Step title */}
          {step !== "success" && getTitle() !== "" && (
            <p style={{
              color: IC_text4,
              fontSize: "0.65rem",
              letterSpacing: lsXl,
              textTransform: "uppercase",
              margin: "0 0 20px",
              paddingRight: 36,
              flexShrink: 0,
            }}>
              {getTitle()}
            </p>
          )}

          {/* Content — centered vertically in the remaining space */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {renderContent()}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
