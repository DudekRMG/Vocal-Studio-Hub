import type { CSSProperties, ReactNode } from "react";
import { StageCanvas } from "./StageCanvas";

interface PageHeroProps {
  accentColor?: string;
  heroTag: string;
  heroTitle: ReactNode;
  heroSub: string;
  heroDesc: string;
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
  heroTag,
  heroTitle,
  heroSub,
  heroDesc,
  ctaHref,
  ctaLabel,
  ctaBg,
  ctaText = "#f0eeea",
}: PageHeroProps) {
  const btnBg = ctaBg ?? accentColor;

  return (
    <section className="relative h-screen overflow-hidden border-b border-white/[0.06]" style={{ background: "#080808" }}>
      <StageCanvas className="absolute inset-0" accentColor={accentColor} />

      <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.035]" style={noiseStyle} />

      {/* Text composition: tag → title → sub */}
      <div
        className="absolute z-10 left-0 right-0 top-0 flex flex-col items-center justify-start pointer-events-none text-center px-6"
        style={{ height: "66vh", paddingTop: "34vh" }}
      >
        <span
          className="text-[0.58rem] tracking-[0.28em] uppercase mb-3 block animate-[fadeUp_0.6s_0.2s_both]"
          style={{ color: accentColor }}
        >
          {heroTag}
        </span>

        <div className="font-display text-[clamp(2.6rem,6.5vw,6.5rem)] leading-none tracking-[0.03em] text-[#f0eeea] animate-[fadeUp_0.7s_0.35s_both]">
          {heroTitle}
        </div>

        <div className="mt-4 font-['Playfair_Display'] italic text-[clamp(0.9rem,1.5vw,1.15rem)] text-[rgba(240,238,234,0.5)] animate-[fadeUp_0.6s_0.5s_both]">
          {heroSub}
        </div>
      </div>

      {/* Desc + CTA below waves */}
      <div
        className="absolute z-10 left-0 right-0 flex flex-col items-center gap-4 pointer-events-auto px-6 text-center animate-[fadeUp_0.5s_0.55s_both]"
        style={{ top: "70vh" }}
      >
        <p className="text-[0.8rem] leading-[1.85] text-[rgba(240,238,234,0.38)] max-w-[480px]">
          {heroDesc}
        </p>
        <a
          href={ctaHref}
          className="inline-flex items-center gap-3 font-display text-[0.88rem] tracking-[0.15em] px-8 py-4 no-underline transition-all duration-200 group uppercase"
          style={{ backgroundColor: btnBg, color: ctaText }}
          onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.12)")}
          onMouseLeave={e => (e.currentTarget.style.filter = "")}
        >
          {ctaLabel}
          <svg className="transition-transform duration-200 group-hover:translate-x-1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </section>
  );
}
