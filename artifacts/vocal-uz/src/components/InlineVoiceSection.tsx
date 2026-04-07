import React from "react";
import { useLang } from "@/lib/langContext";
import { t } from "@/lib/i18n";
import { RevealSection } from "@/components/RevealSection";
import { VoiceRangeWidget } from "@/components/VoiceRangeWidget";

const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

interface InlineVoiceSectionProps {
  accentColor: string;
  pageName: string;
  bookingHref: string;
  bookLabel: string;
  subheading: string;
  sectionId?: string;
  isLightTheme?: boolean;
  onBookClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function InlineVoiceSection({
  accentColor,
  pageName,
  bookingHref,
  bookLabel,
  subheading,
  sectionId,
  isLightTheme = false,
  onBookClick,
}: InlineVoiceSectionProps) {
  const { lang } = useLang();
  const txIV = t[lang].inlineVoice;

  const textPrimary  = isLightTheme ? "#080808" : "#f0eeea";
  const textSub      = isLightTheme ? "rgba(8,8,8,0.65)" : "rgba(240,238,234,0.75)";
  const btnBg        = isLightTheme ? "#080808" : "#f0eeea";
  const btnText      = isLightTheme ? "#f0eeea" : "#080808";
  const btnHoverBg   = isLightTheme ? "#1a1a1a" : "#ffffff";

  return (
    <RevealSection>
      <section
        id={sectionId}
        className="py-20 px-6 lg:px-12 relative overflow-hidden"
        style={{ backgroundColor: accentColor }}
      >
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{ backgroundImage: NOISE, backgroundSize: "120px" }}
        />

        <div className="max-w-[1100px] mx-auto text-center relative">
          {/* Eyebrow */}
          <span
            className="text-[0.68rem] tracking-[0.28em] uppercase block mb-5"
            style={{ color: textSub }}
          >
            {txIV.eyebrow}
          </span>

          {/* Main heading */}
          <h2
            className="font-display text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[1.1] tracking-[0.02em] mb-4"
            style={{ color: textPrimary }}
          >
            {txIV.heading}
          </h2>

          {/* Per-page subheading (old banner h2) */}
          <p
            className="text-[1.05rem] leading-[1.5] mb-3 italic"
            style={{ color: textSub }}
          >
            {subheading}
          </p>

          {/* Motivational body */}
          <p
            className="text-[0.88rem] leading-[1.75] mb-12 max-w-[560px] mx-auto"
            style={{ color: textSub }}
          >
            {txIV.body}
          </p>

          {/* Inline voice widget */}
          <div className="mb-10">
            <VoiceRangeWidget
              inline
              accentColor={accentColor}
              pageName={pageName}
              lightMode={isLightTheme}
            />
          </div>

          {/* Book a lesson button */}
          <a
            href={bookingHref}
            onClick={onBookClick}
            className="font-display text-[1.1rem] tracking-[0.15em] px-10 py-5 no-underline whitespace-nowrap inline-flex items-center justify-center gap-3 group transition-colors duration-200"
            style={{ backgroundColor: btnBg, color: btnText }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = btnHoverBg; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = btnBg; }}
          >
            {bookLabel}
            <svg
              className="transition-transform duration-200 group-hover:translate-x-1"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>
    </RevealSection>
  );
}
