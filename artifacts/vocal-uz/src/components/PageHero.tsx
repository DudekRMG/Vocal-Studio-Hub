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
  lightMode?: boolean;
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
  lightMode = false,
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

  const sectionBorder = lightMode ? "rgba(0,0,0,0.09)" : "rgba(255,255,255,0.06)";
  const sloganColor = lightMode ? "rgba(15,16,22,0.55)" : "rgba(240,238,234,0.65)";
  const titleColor = lightMode ? "#0f1016" : "#f0eeea";
  const mottoColor = lightMode ? "rgba(15,16,22,0.38)" : "rgba(240,238,234,0.45)";
  const trainingColor = lightMode ? "rgba(15,16,22,0.4)" : "rgba(240,238,234,0.35)";
  const ghostBorder = lightMode ? "rgba(15,16,22,0.18)" : "rgba(255,255,255,0.18)";
  const ghostText = lightMode ? "rgba(15,16,22,0.6)" : "rgba(240,238,234,0.6)";
  const ghostHoverText = lightMode ? "#0f1016" : "#f0eeea";
  const bandBg = lightMode ? "rgba(240,242,250,0.96)" : "rgba(4,4,4,0.92)";
  const bandBorder = lightMode ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.14)";
  const bandTagColor = titleColor;
  const bandSubColor = lightMode ? "rgba(15,16,22,0.5)" : "rgba(240,238,234,0.5)";
  const bandDescColor = lightMode ? "rgba(15,16,22,0.45)" : "rgba(240,238,234,0.45)";
  const bandGhostBorder = lightMode ? "rgba(15,16,22,0.22)" : "rgba(255,255,255,0.22)";
  const bandGhostText = lightMode ? "rgba(15,16,22,0.65)" : "rgba(240,238,234,0.65)";

  return (
    <section
      className="relative h-screen overflow-hidden flex flex-col"
      style={{ background: bgColor, borderBottom: `1px solid ${sectionBorder}` }}
    >
      <StageCanvas
        className="absolute inset-0"
        accentColor={accentColor}
        bgColor={bgColor}
        spotColorRgb={spotColorRgb}
      />

      <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.035]" style={noiseStyle} />

      {/* VOCAL.UZ text block */}
      <div
        className="relative z-10 flex-1 flex flex-col items-center justify-center pointer-events-none text-center px-6"
        style={{ paddingTop: "calc(12vh + 7rem)" }}
      >
        <div
          className="font-['Playfair_Display'] italic text-[clamp(1rem,1.8vw,1.35rem)] mb-4 leading-snug animate-[fadeUp_0.6s_0.3s_both]"
          style={{ color: sloganColor }}
        >
          {tx.hero.slogan}
        </div>

        <div
          className="text-[clamp(3.8rem,10.5vw,10rem)] leading-none tracking-[0.1em] uppercase animate-[fadeUp_0.7s_0.4s_both]"
          style={{ fontFamily: "'Bebas Neue', sans-serif", color: titleColor }}
        >
          VOCAL<span style={{ color: accentColor }}>.</span>UZ
        </div>

        <div
          className="mt-5 text-[0.7rem] font-light uppercase tracking-[0.55em] animate-[fadeUp_0.6s_0.55s_both]"
          style={{ color: mottoColor }}
        >
          {tx.hero.motto}
        </div>
      </div>

      {/* CTA band */}
      <div className="relative z-10 flex flex-col items-center gap-3 pointer-events-auto animate-[fadeUp_0.5s_0.5s_both] py-6">
        <span
          className="text-[0.6rem] tracking-[0.22em] uppercase pointer-events-none"
          style={{ color: trainingColor }}
        >
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
            className="font-display text-[0.72rem] tracking-[0.16em] px-6 py-3.5 no-underline transition-all duration-200 uppercase"
            style={{ border: `1px solid ${ghostBorder}`, color: ghostText }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = ghostHoverText; (e.currentTarget as HTMLElement).style.borderColor = lightMode ? "rgba(15,16,22,0.4)" : "rgba(255,255,255,0.4)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = ghostText; (e.currentTarget as HTMLElement).style.borderColor = ghostBorder; }}
          >
            {tx.hero.ctaLearn}
          </a>
        </div>
      </div>

      {/* Course bottom band */}
      <div
        className="relative z-20"
        style={{
          background: bandBg,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop: `1px solid ${bandBorder}`,
        }}
      >
        <div className="px-8 py-4 flex flex-col md:flex-row items-center md:items-stretch justify-between gap-4 max-w-6xl mx-auto">
          {/* Left: small colored label + big section name + italic sub */}
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
              className="font-display leading-none tracking-[0.03em]"
              style={{
                color: bandTagColor,
                fontSize: lang === "en"
                  ? "clamp(2.4rem, 4.5vw, 5rem)"
                  : "clamp(1.9rem, 3.5vw, 3.8rem)",
              }}
            >
              {courseTag}
            </div>
            <div
              className="font-['Playfair_Display'] italic text-[0.9rem] mt-1"
              style={{ color: bandSubColor }}
            >
              {courseSub}
            </div>
          </div>

          {/* Right: desc + Learn More */}
          <div className="flex flex-col items-center md:items-end justify-center gap-3 text-center md:text-right max-w-[360px] flex-shrink-0">
            <p className="text-[0.73rem] leading-[1.75]" style={{ color: bandDescColor }}>
              {courseDesc}
            </p>
            <a
              href="#course-content"
              onClick={scrollToContent}
              className="inline-flex items-center gap-2 no-underline transition-all duration-200 uppercase"
              style={{ fontFamily: "var(--font-display-family)", fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.14em", padding: "0.6rem 1.4rem", border: `1px solid ${bandGhostBorder}`, color: bandGhostText }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = lightMode ? "#0f1016" : "#f0eeea"; (e.currentTarget as HTMLElement).style.borderColor = lightMode ? "rgba(15,16,22,0.45)" : "rgba(255,255,255,0.45)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = bandGhostText; (e.currentTarget as HTMLElement).style.borderColor = bandGhostBorder; }}
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
