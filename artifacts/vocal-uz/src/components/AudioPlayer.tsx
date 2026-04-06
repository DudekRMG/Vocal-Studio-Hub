import { useRef, useState, useEffect, useCallback, useId } from "react";
import { notifyAudioPlay, subscribeAudioPlay } from "@/lib/audioManager";

interface AudioPlayerProps {
  src: string;
  label: string;
  variant: "before" | "after";
  accentColor: string;
  isKids?: boolean;
  onEnded?: () => void;
  playTrigger?: number;
}

function formatTime(secs: number): string {
  if (!isFinite(secs) || isNaN(secs)) return "--:--";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function AudioPlayer({ src, label, variant, accentColor, isKids = false, onEnded, playTrigger }: AudioPlayerProps) {
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

  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;

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
    const handleEnded = () => {
      setPlaying(false);
      setProgress(0);
      setCurrent(0);
      audio.currentTime = 0;
      onEndedRef.current?.();
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", handleEnded);
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

  const prevTriggerRef = useRef<number>(0);
  useEffect(() => {
    if (!playTrigger || playTrigger === prevTriggerRef.current) return;
    prevTriggerRef.current = playTrigger;
    const audio = audioRef.current;
    if (audio) {
      notifyAudioPlay(id);
      audio.currentTime = 0;
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [playTrigger, id]);

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

  const isDraggingRef = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const trackRectRef = useRef<DOMRect | null>(null);

  const seekToClientX = useCallback((clientX: number) => {
    const audio = audioRef.current;
    const rect = trackRectRef.current;
    if (!audio || !rect || isEmpty || !audio.duration) return;
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    audio.currentTime = ratio * audio.duration;
    setProgress(ratio);
  }, [isEmpty]);

  const handlePointerDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isEmpty) return;
    isDraggingRef.current = true;
    trackRectRef.current = e.currentTarget.getBoundingClientRect();
    seekToClientX(e.clientX);
  }, [isEmpty, seekToClientX]);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (isEmpty) return;
    isDraggingRef.current = true;
    trackRectRef.current = e.currentTarget.getBoundingClientRect();
    seekToClientX(e.touches[0].clientX);
  }, [isEmpty, seekToClientX]);

  useEffect(() => {
    const stopDrag = () => { isDraggingRef.current = false; };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      seekToClientX(e.clientX);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();
      seekToClientX(e.touches[0].clientX);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", stopDrag);
    window.addEventListener("touchcancel", stopDrag);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", stopDrag);
      window.removeEventListener("touchcancel", stopDrag);
    };
  }, [seekToClientX]);

  return (
    <div
      className="flex flex-wrap md:flex-nowrap items-center gap-x-3 gap-y-2 md:gap-y-0 px-4 py-3 md:py-[0.65rem] select-none"
      style={{
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        opacity: isEmpty ? 0.45 : 1,
        cursor: isEmpty ? "default" : "auto",
      }}
    >
      {/* order-1 on mobile and desktop */}
      <button
        onClick={togglePlay}
        disabled={isEmpty}
        aria-label={playing ? "Pause" : "Play"}
        className="order-1 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-none transition-opacity duration-150 hover:opacity-85 disabled:cursor-not-allowed"
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

      {/* order-2 always */}
      <span
        className="order-2 text-[0.7rem] tracking-[0.03em] flex-shrink-0 whitespace-nowrap"
        style={{ color: labelColor, minWidth: "7rem" }}
      >
        {label}
      </span>

      {/* mobile: order-3 + ml-auto → pushes to right end of row 1; desktop: order-4 (after track) */}
      <span
        className="order-3 md:order-4 ml-auto md:ml-0 text-[0.65rem] flex-shrink-0 tabular-nums whitespace-nowrap"
        style={{ color: timeColor }}
      >
        {isEmpty || duration === 0
          ? "--:-- / --:--"
          : `${formatTime(current)} / ${formatTime(duration)}`}
      </span>

      {/* mobile: order-4 + w-full → own row at bottom; desktop: order-3 + flex-1 → inline */}
      <div
        ref={trackRef}
        className="order-4 md:order-3 w-full md:flex-1 md:w-auto h-[5px] md:h-[3px] relative cursor-pointer"
        style={{ backgroundColor: trackBg }}
        onMouseDown={handlePointerDown}
        onTouchStart={handleTouchStart}
      >
        <div
          className="absolute inset-y-0 left-0"
          style={{ width: `${progress * 100}%`, backgroundColor: fillColor }}
        />
      </div>
    </div>
  );
}
