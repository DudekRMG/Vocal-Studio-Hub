import { useRef, useState, useEffect, useCallback } from "react";

interface AudioPlayerProps {
  src: string;
  label: string;
  variant: "before" | "after";
  accentColor: string;
  isKids?: boolean;
}

function formatTime(secs: number): string {
  if (!isFinite(secs) || isNaN(secs)) return "--:--";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function AudioPlayer({ src, label, variant, accentColor, isKids = false }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  const isEmpty = !src;
  const isBefore = variant === "before";

  const bgColor = isBefore
    ? (isKids ? "#dde0f0" : "#141414")
    : (isKids ? `${accentColor}1a` : `${accentColor}18`);

  const borderColor = isBefore
    ? (isKids ? "rgba(0,0,0,0.09)" : "rgba(255,255,255,0.07)")
    : `${accentColor}55`;

  const btnBg = isBefore
    ? (isKids ? "#bcc0d8" : "#2a2a2a")
    : accentColor;

  const btnIconColor = isBefore
    ? (isKids ? "#6a7090" : "#666")
    : "#fff";

  const trackBg = isBefore
    ? (isKids ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.08)")
    : (isKids ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)");

  const fillColor = isBefore
    ? (isKids ? "#9da2c0" : "#3a3a3a")
    : accentColor;

  const labelColor = isBefore
    ? (isKids ? "rgba(15,16,22,0.45)" : "rgba(240,238,234,0.4)")
    : (isKids ? "rgba(15,16,22,0.65)" : "rgba(240,238,234,0.65)");

  const timeColor = isBefore
    ? (isKids ? "rgba(15,16,22,0.3)" : "rgba(240,238,234,0.28)")
    : (isKids ? "rgba(15,16,22,0.45)" : "rgba(240,238,234,0.45)");

  useEffect(() => {
    if (!src) return;
    const audio = new Audio(src);
    audio.preload = "metadata";
    audioRef.current = audio;

    const onTimeUpdate = () => {
      setCurrent(audio.currentTime);
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    };
    const onLoaded = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      setPlaying(false);
      setProgress(0);
      setCurrent(0);
      audio.currentTime = 0;
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnded);
      audioRef.current = null;
    };
  }, [src]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || isEmpty) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [playing, isEmpty]);

  const handleScrub = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || isEmpty || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * audio.duration;
    setProgress(ratio);
  }, [isEmpty]);

  return (
    <div
      className="flex items-center gap-3 px-4 py-[0.65rem] select-none"
      style={{
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        opacity: isEmpty ? 0.45 : 1,
        cursor: isEmpty ? "default" : "auto",
      }}
    >
      <button
        onClick={togglePlay}
        disabled={isEmpty}
        aria-label={playing ? "Pause" : "Play"}
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-none transition-opacity duration-150 hover:opacity-85 disabled:cursor-not-allowed"
        style={{ backgroundColor: btnBg, cursor: isEmpty ? "not-allowed" : "pointer" }}
      >
        {playing ? (
          <svg width="9" height="9" viewBox="0 0 24 24" fill={btnIconColor}>
            <rect x="5" y="4" width="5" height="16" rx="1" />
            <rect x="14" y="4" width="5" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="9" height="9" viewBox="0 0 24 24" fill={btnIconColor}>
            <polygon points="6,3 20,12 6,21" />
          </svg>
        )}
      </button>

      <span
        className="text-[0.7rem] tracking-[0.03em] flex-shrink-0 whitespace-nowrap"
        style={{ color: labelColor, minWidth: "7rem" }}
      >
        {label}
      </span>

      <div
        className="flex-1 h-[3px] relative cursor-pointer"
        style={{ backgroundColor: trackBg }}
        onClick={handleScrub}
      >
        <div
          className="absolute inset-y-0 left-0"
          style={{ width: `${progress * 100}%`, backgroundColor: fillColor }}
        />
      </div>

      <span
        className="text-[0.65rem] flex-shrink-0 tabular-nums"
        style={{ color: timeColor }}
      >
        {isEmpty || duration === 0 ? "--:--" : formatTime(current)}
      </span>
    </div>
  );
}
