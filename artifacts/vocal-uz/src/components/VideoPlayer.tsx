import { useRef, useState, useEffect, useCallback } from "react";

type Phase = "idle" | "autoplaying" | "playing" | "paused" | "ended";

function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(hover: none) and (pointer: coarse)").matches
      : false
  );
  useEffect(() => {
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return mobile;
}

interface VideoPlayerProps {
  src: string;
}

export function VideoPlayer({ src }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isMobile = useIsMobile();

  const [phase, setPhase] = useState<Phase>("idle");
  const [muted, setMuted] = useState(true);

  const phaseRef = useRef<Phase>("idle");
  const mutedRef = useRef(true);
  const isMobileRef = useRef(isMobile);
  const scrollPausedPhaseRef = useRef<"autoplaying" | "playing" | null>(null);

  useEffect(() => { isMobileRef.current = isMobile; }, [isMobile]);
  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { mutedRef.current = muted; }, [muted]);

  const setPhaseSync = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);

  const setMutedSync = useCallback((m: boolean) => {
    mutedRef.current = m;
    setMuted(m);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const p = phaseRef.current;

        if (entry.isIntersecting) {
          if (p === "idle" && !isMobileRef.current) {
            video.muted = true;
            setMutedSync(true);
            video.play().catch(() => {});
            setPhaseSync("autoplaying");
          } else if (scrollPausedPhaseRef.current !== null) {
            video.play().catch(() => {});
            setPhaseSync(scrollPausedPhaseRef.current);
            scrollPausedPhaseRef.current = null;
          }
        } else {
          if (p === "autoplaying" || p === "playing") {
            scrollPausedPhaseRef.current = p;
            video.pause();
          } else {
            scrollPausedPhaseRef.current = null;
          }
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [setPhaseSync, setMutedSync]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onEnded = () => {
      scrollPausedPhaseRef.current = null;
      setPhaseSync("ended");
    };
    video.addEventListener("ended", onEnded);
    return () => video.removeEventListener("ended", onEnded);
  }, [setPhaseSync]);

  const handleFrameClick = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const p = phaseRef.current;

    if (p === "autoplaying") {
      video.muted = false;
      setMutedSync(false);
      setPhaseSync("playing");
    } else if (p === "playing") {
      video.pause();
      scrollPausedPhaseRef.current = null;
      setPhaseSync("paused");
    } else if (p === "paused") {
      video.play().catch(() => {});
      setPhaseSync("playing");
    }
  }, [setPhaseSync, setMutedSync]);

  const handleMuteToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    const next = !mutedRef.current;
    video.muted = next;
    setMutedSync(next);
  }, [setMutedSync]);

  const handleReplay = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = mutedRef.current;
    video.currentTime = 0;
    video.play().catch(() => {});
    setPhaseSync("playing");
  }, [setPhaseSync]);

  const handleMobilePlay = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    setMutedSync(false);
    video.play().catch(() => {});
    setPhaseSync("playing");
  }, [setPhaseSync, setMutedSync]);

  const showMuteBtn = phase === "autoplaying" || phase === "playing" || phase === "paused";
  const showReplay = phase === "ended";
  const showMobilePlay = isMobile && phase === "idle";

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-black"
      style={{ paddingBottom: "56.25%", cursor: phase === "idle" ? "default" : "pointer" }}
      onClick={handleFrameClick}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src={src}
        muted
        playsInline
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
      />

      {showMobilePlay && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/50 z-20"
          onClick={handleMobilePlay}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              border: "2px solid rgba(255,255,255,0.55)",
              backdropFilter: "blur(8px)",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 3 }}>
              <polygon points="5,3 21,12 5,21" />
            </svg>
          </div>
        </div>
      )}

      {showReplay && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/50 z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleReplay}
            aria-label="Replay"
            className="w-16 h-16 rounded-full flex items-center justify-center transition-opacity duration-150 hover:opacity-90"
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              border: "2px solid rgba(255,255,255,0.55)",
              backdropFilter: "blur(8px)",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 .49-3.31" />
            </svg>
          </button>
        </div>
      )}

      {showMuteBtn && (
        <button
          onClick={handleMuteToggle}
          aria-label={muted ? "Unmute" : "Mute"}
          className="absolute bottom-3 left-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-opacity duration-150 hover:opacity-90"
          style={{
            backgroundColor: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          {muted ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M11 5L6 9H2v6h4l5 4V5z" fill="white" />
              <line x1="22" y1="9" x2="16" y2="15" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <line x1="16" y1="9" x2="22" y2="15" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M11 5L6 9H2v6h4l5 4V5z" fill="white" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
