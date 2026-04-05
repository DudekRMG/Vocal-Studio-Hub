import { useLang } from "@/lib/langContext";
import { t } from "@/lib/i18n";
import { AudioPlayer } from "./AudioPlayer";

interface TestimonialItem {
  featured: boolean;
  name: string;
  initials: string;
  avatarColor: string;
  durationLabel: string;
  quote: string;
  beforeLabel: string;
  afterLabel: string;
  beforeSrc: string;
  afterSrc: string;
}

interface Props {
  accentColor: string;
  variant?: "kids";
}

export function TestimonialsSection({ accentColor, variant }: Props) {
  const { lang } = useLang();
  const tx = t[lang].testimonials;
  const isKids = variant === "kids";

  const sectionBg = isKids ? "#e8eaf5" : "#0a0a0a";
  const featuredBg = isKids ? "#dde0f5" : "#111116";
  const featuredBorder = isKids ? "rgba(0,0,0,0.09)" : `${accentColor}30`;
  const cardBg = isKids ? "#e0e3f2" : "#141414";
  const dividerColor = isKids ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.07)";
  const textPrimary = isKids ? "#0f1016" : "#f0eeea";
  const textMuted = isKids ? "rgba(15,16,22,0.5)" : "rgba(240,238,234,0.5)";
  const textQuote = isKids ? "rgba(15,16,22,0.72)" : "rgba(240,238,234,0.72)";

  const items = tx.items as TestimonialItem[];
  const featured = items.find((i) => i.featured);
  const gridItems = items.filter((i) => !i.featured);

  return (
    <section
      className="py-28 px-6 lg:px-12 border-t border-b"
      style={{ backgroundColor: sectionBg, borderColor: dividerColor }}
    >
      <div className="max-w-[1100px] mx-auto">

        {/* ── Heading ── */}
        <div className="text-center mb-14 max-w-[560px] mx-auto">
          <span
            className="text-[0.68rem] tracking-[0.28em] uppercase block mb-4"
            style={{ color: accentColor }}
          >
            {tx.eyebrow}
          </span>
          <h2
            className="font-['Playfair_Display'] italic text-[clamp(2.2rem,4vw,3.5rem)] leading-[1.2]"
            style={{ color: textPrimary }}
          >
            {tx.heading}
          </h2>
          <p className="text-[0.88rem] mt-3 leading-[1.7]" style={{ color: textMuted }}>
            {tx.subheading}
          </p>
        </div>

        {/* ── Featured card ── */}
        {featured && (
          <div
            className="mb-[1px] p-8 md:p-10"
            style={{
              backgroundColor: featuredBg,
              border: `1px solid ${featuredBorder}`,
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left: avatar + quote */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-display text-[0.9rem] text-white"
                    style={{ backgroundColor: featured.avatarColor }}
                  >
                    {featured.initials}
                  </div>
                  <div>
                    <div
                      className="font-semibold text-[0.95rem] leading-none mb-1"
                      style={{ color: textPrimary }}
                    >
                      {featured.name}
                    </div>
                    <div
                      className="text-[0.72rem] tracking-[0.06em]"
                      style={{ color: accentColor }}
                    >
                      {featured.durationLabel}
                    </div>
                  </div>
                </div>
                <p
                  className="font-['Playfair_Display'] italic text-[1.05rem] leading-[1.7]"
                  style={{ color: textQuote }}
                >
                  {featured.quote}
                </p>
              </div>

              {/* Right: audio players */}
              <div className="flex flex-col gap-3">
                <AudioPlayer
                  src={featured.beforeSrc}
                  label={featured.beforeLabel}
                  variant="before"
                  accentColor={accentColor}
                  isKids={isKids}
                />
                <AudioPlayer
                  src={featured.afterSrc}
                  label={featured.afterLabel}
                  variant="after"
                  accentColor={accentColor}
                  isKids={isKids}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── 2-column grid ── */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-[1px]"
          style={{ backgroundColor: dividerColor }}
        >
          {gridItems.map((item) => (
            <div
              key={item.name}
              className="p-8 flex flex-col gap-5"
              style={{ backgroundColor: cardBg }}
            >
              {/* Avatar + name */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-display text-[0.8rem] text-white"
                  style={{ backgroundColor: item.avatarColor }}
                >
                  {item.initials}
                </div>
                <div>
                  <div
                    className="font-semibold text-[0.88rem] leading-none mb-1"
                    style={{ color: textPrimary }}
                  >
                    {item.name}
                  </div>
                  <div
                    className="text-[0.7rem]"
                    style={{ color: textMuted }}
                  >
                    {item.durationLabel}
                  </div>
                </div>
              </div>

              {/* Quote */}
              <p
                className="font-['Playfair_Display'] italic text-[0.9rem] leading-[1.7]"
                style={{ color: textQuote }}
              >
                {item.quote}
              </p>

              {/* Players */}
              <div className="flex flex-col gap-2">
                <AudioPlayer
                  src={item.beforeSrc}
                  label={item.beforeLabel}
                  variant="before"
                  accentColor={accentColor}
                  isKids={isKids}
                />
                <AudioPlayer
                  src={item.afterSrc}
                  label={item.afterLabel}
                  variant="after"
                  accentColor={accentColor}
                  isKids={isKids}
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
