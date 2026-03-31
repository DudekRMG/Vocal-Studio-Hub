import type { CSSProperties, ReactNode } from "react";
import { StageCanvas } from "./StageCanvas";
import { useLang } from "@/lib/langContext";
import { t } from "@/lib/i18n";

interface PageHeroProps {
  accentColor?: string;
  bgColor?: string;
  spotColorRgb?: string;
  courseTag: string;
  courseTitle: ReactNode;
  courseSub: string;
  courseDesc: string;
  ctaHref: string;
  ctaLabel: string;
  ctaBg?: string;
  ctaText?: string;
}

const noiseStyle: CSSProperties = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
  backgroundSize: "120px",
};

export function PageHero({
  accentColor = "#e8002d",
  bgColor = "#080808",
  spotColorRgb,
  courseTag,
  courseTitle,
  courseSub,
  courseDesc,
  ctaHref,
  ctaLabel,
  ctaBg,
  ctaText = "#f0eeea",
}: PageHeroProps) {
  const { lang } = useLang();
  const tx = t[lang];
  const btnBg = ctaBg ?? accentColor;

  const scrollToContent = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("course-content");
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <section
      className="relative h-screen overflow-hidden flex flex-col border-b border-white/[0.06]"
      style={{ background: bgColor }}
    >
      <StageCanvas
        className="absolute inset-0"
        accentColor={accentColor}
        bgColor={bgColor}
        spotColorRgb={spotColorRgb}
      />

      <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.035]" style={noiseStyle} />

      {/* VOCAL.UZ text block — same as home */}
      <div
        className="relative z-10 flex-1 flex flex-col items-center justify-center pointer-events-none text-center px-6"
        style={{ paddingTop: "calc(12vh + 7rem)" }}
      >
        <div className="font-['Playfair_Display'] italic text-[clamp(1rem,1.8vw,1.35rem)] text-[rgba(240,238,234,0.65)] mb-4 leading-snug animate-[fadeUp_0.6s_0.3s_both]">
          {tx.hero.slogan}
        </div>

        <div
          className="text-[clamp(3.8rem,10.5vw,10rem)] leading-none tracking-[0.1em] text-[#f0eeea] uppercase animate-[fadeUp_0.7s_0.4s_both]"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          VOCAL<span style={{ color: accentColor }}>.</span>UZ
        </div>

        <div className="mt-5 text-[0.7rem] font-light uppercase tracking-[0.55em] text-[rgba(240,238,234,0.45)] animate-[fadeUp_0.6s_0.55s_both]">
          {tx.hero.motto}
        </div>
      </div>

      {/* CTA band — identical to home page */}
      <div className="relative z-10 flex flex-col items-center gap-3 pointer-events-auto animate-[fadeUp_0.5s_0.5s_both] py-6">
        <span className="text-[0.6rem] tracking-[0.22em] uppercase text-[rgba(240,238,234,0.35)] pointer-events-none">
          {tx.hero.training}
        </span>
        <div className="flex flex-row flex-wrap items-center justify-center gap-3">
          <a
            href={ctaHref}
            className="no-underline transition-all duration-200 hover:opacity-90 uppercase"
            style={{ backgroundColor: btnBg, color: ctaText, fontFamily: "var(--font-display-family)", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.16em", padding: "0.875rem 1.5rem" }}
          >
            {ctaLabel}
          </a>
          <a
            href="#course-content"
            onClick={scrollToContent}
            className="border border-white/[0.18] text-[rgba(240,238,234,0.6)] font-display text-[0.72rem] tracking-[0.16em] px-6 py-3.5 no-underline transition-all duration-200 hover:border-white/40 hover:text-[#f0eeea] uppercase"
          >
            {tx.hero.ctaLearn}
          </a>
        </div>
      </div>

      {/* Course bottom band */}
      <div
        className="relative z-20 border-t border-white/[0.14]"
        style={{
          background: "rgba(4,4,4,0.92)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <div className="px-8 py-4 flex flex-col md:flex-row items-center md:items-stretch justify-between gap-4 max-w-6xl mx-auto">
          {/* Left: slogan (small colored) + section name (huge) + sub */}
          <div className="flex flex-col gap-1.5 text-center md:text-left min-w-0">
            <span
              className="font-display tracking-[0.24em] block"
              style={{
                color: accentColor,
                fontSize: lang === "en" ? "0.95rem" : "0.75rem",
              }}
            >
              {courseTitle}
            </span>
            <div
              className="font-display leading-none tracking-[0.03em] text-[#f0eeea]"
              style={{
                fontSize: lang === "en"
                  ? "clamp(2.4rem, 4.5vw, 5rem)"
                  : "clamp(1.9rem, 3.5vw, 3.8rem)",
              }}
            >
              {courseTag}
            </div>
            <div className="font-['Playfair_Display'] italic text-[0.9rem] text-[rgba(240,238,234,0.5)] mt-1">
              {courseSub}
            </div>
          </div>

          {/* Right: desc + Learn More */}
          <div className="flex flex-col items-center md:items-end justify-center gap-3 text-center md:text-right max-w-[360px] flex-shrink-0">
            <p className="text-[0.73rem] leading-[1.75] text-[rgba(240,238,234,0.45)]">
              {courseDesc}
            </p>
            <a
              href="#course-content"
              onClick={scrollToContent}
              className="inline-flex items-center gap-2 border border-white/[0.22] text-[rgba(240,238,234,0.65)] no-underline transition-all duration-200 hover:border-white/45 hover:text-[#f0eeea] uppercase"
              style={{ fontFamily: "var(--font-display-family)", fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.14em", padding: "0.6rem 1.4rem" }}
            >
              {tx.hero.ctaLearn}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
