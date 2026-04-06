import { useRef, useState, useEffect, useCallback, useId } from "react";
import { notifyAudioPlay, subscribeAudioPlay } from "@/lib/audioManager";

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
  const id = useId();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  const isEmpty = !src;
  const isBefore = variant === "before";

  const bgColor = isBefore
    ? (isKids ? "#e9f0fd" : "#1c1c1c")
    : (isKids ? `${accentColor}50` : `${accentColor}2e`);

  const borderColor = isBefore
    ? (isKids ? "rgba(59,130,246,0.25)" : "rgba(255,255,255,0.13)")
    : `${accentColor}88`;

  const btnBg = isBefore
    ? (isKids ? "#8896b8" : "#424242")
    : accentColor;

  const btnIconColor = isBefore
    ? (isKids ? "#ffffff" : "#c0c0c0")
    : "#fff";

  const trackBg = isBefore
    ? (isKids ? "rgba(59,130,246,0.18)" : "rgba(255,255,255,0.13)")
    : (isKids ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.18)");

  const fillColor = isBefore
    ? (isKids ? "#5b8ef5" : "#606060")
    : accentColor;

  const labelColor = isBefore
    ? (isKids ? "rgba(15,16,22,0.65)" : "rgba(240,238,234,0.62)")
    : (isKids ? "rgba(15,16,22,0.82)" : "rgba(240,238,234,0.88)");

  const timeColor = isBefore
    ? (isKids ? "rgba(15,16,22,0.42)" : "rgba(240,238,234,0.45)")
    : (isKids ? "rgba(15,16,22,0.62)" : "rgba(240,238,234,0.68)");

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

  useEffect(() => {
    return subscribeAudioPlay(id, () => {
      const audio = audioRef.current;
      if (audio && !audio.paused) {
        audio.pause();
        setPlaying(false);
      }
    });
  }, [id]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || isEmpty) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      notifyAudioPlay(id);
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [playing, isEmpty, id]);

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
        className="text-[0.65rem] flex-shrink-0 tabular-nums whitespace-nowrap"
        style={{ color: timeColor }}
      >
        {isEmpty || duration === 0
          ? "--:-- / --:--"
          : `${formatTime(current)} / ${formatTime(duration)}`}
      </span>
    </div>
  );
}
