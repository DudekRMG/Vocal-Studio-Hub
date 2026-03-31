import { Link } from "wouter";
import { useLang } from "@/lib/langContext";
import { t } from "@/lib/i18n";
import { SeoHead } from "@/components/SeoHead";
import { BookingForm } from "@/components/BookingForm";
import { CourseStrip } from "@/components/CourseStrip";
import { useSanityContent } from "@/lib/useSanityContent";
import { StageCanvas } from "@/components/StageCanvas";

const PROMO_VIDEO_ID = "LXb3EKWsInQ";

export default function Home() {
  const { lang } = useLang();
  const tx = t[lang];
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const { content } = useSanityContent(lang);

  const teacherName = content?.hero?.teacherName || "Дария Свиридова";
  const bioLine1 = content?.about?.bio1 || tx.about.bio1;
  const bioLine2 = content?.about?.bio2 || tx.about.bio2;
  const bioLine3 = content?.about?.bio3 || tx.about.bio3;
  const statYearsStage = content?.about?.yearsOnStage || tx.about.stat1;
  const statYearsTeach = content?.about?.yearsTeaching || tx.about.stat2;
  const statStudents = content?.about?.studentsCount || tx.about.stat3;

  return (
    <>
      <SeoHead
        title={tx.seo.home.title}
        description={tx.seo.home.description}
        lang={lang}
        canonical="https://vocal.uz/"
        ogImage="/logo.png"
      />

      {/* ── HERO ── */}
      <section id="hero" className="relative flex flex-col bg-[#080808] overflow-x-hidden md:h-screen md:overflow-hidden">

        {/* Wrapper: canvas lives here so on mobile it's exactly 100svh tall —
            100svh is the stable small viewport (address bar visible) so the layout
            never reflowing when iOS Safari hides/shows its chrome on scroll */}
        <div className="relative flex flex-col min-h-[100svh] md:min-h-0 md:flex-1">

          {/* Stage canvas — constrained to this wrapper's height.
              mobileStepMult widens the mobile wave bundle by 20% on the home page. */}
          <StageCanvas className="absolute inset-0" mobileStepMult={1.2} />

          {/* Noise overlay */}
          <div
            className="absolute inset-0 z-[1] pointer-events-none opacity-[0.035]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: "120px",
            }}
          />

        {/* Text composition — purely centered; pt offsets for the fixed nav */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center pointer-events-none text-center px-6 pt-[4.75rem] md:pt-[calc(12vh_+_7rem)]">
          {/* Mobile-only: shift sign block 7% lower via exact CSS translate (no layout side-effects) */}
          <div className="[transform:translateY(7svh)] md:[transform:translateY(0)]">
            <div className="font-['Playfair_Display'] italic text-[clamp(1rem,1.8vw,1.35rem)] text-[rgba(240,238,234,0.65)] mb-4 leading-snug animate-[fadeUp_0.6s_0.3s_both]">
              {tx.hero.slogan}
            </div>

            <div className="text-[clamp(3.8rem,10.5vw,10rem)] leading-none tracking-[0.1em] text-[#f0eeea] uppercase animate-[fadeUp_0.7s_0.4s_both]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              VOCAL<span className="text-[#e8002d]">.</span>UZ
            </div>

            <div className="mt-5 text-[0.7rem] font-light uppercase tracking-[0.55em] text-[rgba(240,238,234,0.45)] animate-[fadeUp_0.6s_0.55s_both]">
              {tx.hero.motto}
            </div>
          </div>
        </div>

        {/* Professional tag + CTAs — mb-[7svh] lifts block 7% off wrapper bottom on mobile */}
        <div className="relative z-10 flex flex-col items-center gap-3 pointer-events-auto animate-[fadeUp_0.5s_0.5s_both] py-6 mb-[7svh] md:mb-0">
          <span className="text-[0.6rem] tracking-[0.22em] uppercase text-[rgba(240,238,234,0.35)] pointer-events-none">
            {tx.hero.training}
          </span>
          <div className="flex flex-row flex-wrap items-center justify-center gap-3">
            <a
              href="#booking"
              className="bg-[#e8002d] text-[#f0eeea] font-display text-[0.72rem] tracking-[0.16em] px-6 py-3.5 no-underline transition-all duration-200 hover:bg-[#ff1a3d] uppercase"
            >
              {tx.hero.ctaBook}
            </a>
            <a
              href="#about"
              className="border border-white/[0.18] text-[rgba(240,238,234,0.6)] font-display text-[0.72rem] tracking-[0.16em] px-6 py-3.5 no-underline transition-all duration-200 hover:border-white/40 hover:text-[#f0eeea] uppercase"
            >
              {tx.hero.ctaLearn}
            </a>
          </div>
        </div>

        </div>{/* end mobile-viewport wrapper */}

        {/* Course preview strip — min-h-[220px] on mobile aligns with landing page hero-bottom band height */}
        <div
          className="relative z-20 grid grid-cols-2 md:grid-cols-4 border-t border-white/[0.06] min-h-[220px] md:min-h-[160px]"
          style={{
            background: "rgba(8,8,8,0.6)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          {(
            [
              { num: "01", title: tx.nav.extreme, desc: tx.hero.stripDescs[0], color: "#e8002d", href: `${base}/extreme#hero-bottom`  },
              { num: "02", title: tx.nav.pop,     desc: tx.hero.stripDescs[1], color: "#9d4edd", href: `${base}/pop#hero-bottom`      },
              { num: "03", title: tx.nav.karaoke, desc: tx.hero.stripDescs[2], color: "#c9a84c", href: `${base}/karaoke#hero-bottom`  },
              { num: "04", title: tx.nav.kids,    desc: tx.hero.stripDescs[3], color: "#3b82f6", href: `${base}/kids#hero-bottom`     },
            ] as const
          ).map((c, i) => (
            <Link
              key={c.href}
              href={c.href}
              className={`px-5 pt-4 pb-5 md:pt-5 md:pb-6 no-underline group transition-all duration-300 hover:bg-white/[0.035]${i < 3 ? " border-r border-white/[0.05]" : ""}`}
            >
              <div
                className="text-[0.54rem] tracking-[0.28em] mb-2 font-display"
                style={{ color: c.color }}
              >
                {c.num}
              </div>
              <div className="text-[0.88rem] font-bold text-[rgba(240,238,234,0.88)] mb-2 leading-tight transition-colors duration-200 group-hover:text-[#f0eeea]">
                {c.title}
              </div>
              <div className="text-[0.75rem] text-[rgba(240,238,234,0.40)] leading-relaxed">
                {c.desc}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── DISCIPLINES ── */}
      <section id="disciplines" className="py-28 px-6 lg:px-12 bg-[#080808] border-t border-white/[0.08]">
        <div className="max-w-[1100px] mx-auto mb-16">
          <span className="text-[0.68rem] tracking-[0.28em] uppercase text-[#e8002d] block mb-4">
            {tx.disciplines.eyebrow}
          </span>
          <h2 className="font-display text-[clamp(3rem,5vw,5rem)] leading-[0.95] tracking-[0.02em]">
            {tx.disciplines.title}
            <em className="font-['Playfair_Display'] not-italic italic text-[0.7em] text-[rgba(240,238,234,0.45)] block mt-1">
              {tx.disciplines.titleEm}
            </em>
          </h2>
        </div>

        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-white/[0.08]">
          {/* Extreme card */}
          <div className="bg-[#080808] p-10 relative overflow-hidden group transition-colors duration-300 hover:bg-[#0d0a0a]">
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 60% 50% at 20% 80%, rgba(232,0,45,.08) 0%, transparent 70%)" }}
            />
            <span className="absolute top-8 right-8 font-display text-[5rem] leading-none text-[rgba(232,0,45,0.07)] z-0 pointer-events-none select-none">01</span>
            <div className="relative z-[1]">
              <span className="text-[0.65rem] tracking-[0.28em] uppercase text-[#e8002d] mb-6 block">{tx.disciplines.extremeTag}</span>
              <h3 className="font-display text-[clamp(2rem,3.5vw,3rem)] tracking-[0.03em] leading-[0.95] mb-6">
                {tx.disciplines.extremeTitle}
              </h3>
              <p className="text-[0.85rem] leading-[1.9] text-[rgba(240,238,234,0.45)] mb-8">
                {tx.disciplines.extremeBody}
              </p>
              <ul className="list-none m-0 p-0 flex flex-col gap-3 mb-10">
                {tx.disciplines.extremeList.map((item) => (
                  <li key={item} className="text-[0.78rem] text-[rgba(240,238,234,0.45)] flex items-center gap-4">
                    <span className="w-5 h-[1px] bg-[#e8002d] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={`${base}/extreme#hero-bottom`}
                className="group text-[0.72rem] tracking-[0.2em] uppercase text-[#e8002d] no-underline inline-flex items-center gap-3"
              >
                {tx.disciplines.extremeCta}
                <svg className="transition-transform duration-200 group-hover:translate-x-1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </div>

          {/* Pop card */}
          <div className="bg-[#0f0f0f] p-10 relative overflow-hidden group transition-colors duration-300 hover:bg-[#131313]">
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 60% 50% at 80% 20%, rgba(157,78,221,.09) 0%, transparent 70%)" }}
            />
            <span className="absolute top-8 right-8 font-display text-[5rem] leading-none z-0 pointer-events-none select-none" style={{ color: "rgba(157,78,221,0.1)" }}>02</span>
            <div className="relative z-[1]">
              <span className="text-[0.65rem] tracking-[0.28em] uppercase mb-6 block" style={{ color: "#9d4edd" }}>{tx.disciplines.popTag}</span>
              <h3 className="font-['Playfair_Display'] italic text-[clamp(1.8rem,3vw,2.8rem)] leading-[1] mb-6 text-[rgba(240,238,234,0.9)]">
                {tx.disciplines.popTitle}
              </h3>
              <p className="text-[0.85rem] leading-[1.9] text-[rgba(240,238,234,0.45)] mb-8">
                {tx.disciplines.popBody}
              </p>
              <ul className="list-none m-0 p-0 flex flex-col gap-3 mb-10">
                {tx.disciplines.popList.map((item) => (
                  <li key={item} className="text-[0.78rem] text-[rgba(240,238,234,0.45)] flex items-center gap-4">
                    <span className="w-5 h-[1px] flex-shrink-0" style={{ backgroundColor: "#9d4edd" }} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={`${base}/pop#hero-bottom`}
                className="group text-[0.72rem] tracking-[0.2em] uppercase no-underline inline-flex items-center gap-3"
                style={{ color: "#9d4edd" }}
              >
                {tx.disciplines.popCta}
                <svg className="transition-transform duration-200 group-hover:translate-x-1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </div>

          {/* Karaoke card */}
          <div className="bg-[#0c0b08] p-10 relative overflow-hidden group transition-colors duration-300 hover:bg-[#100e09]">
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 60% 50% at 50% 80%, rgba(201,168,76,.07) 0%, transparent 70%)" }}
            />
            <span className="absolute top-8 right-8 font-display text-[5rem] leading-none z-0 pointer-events-none select-none" style={{ color: "rgba(201,168,76,0.07)" }}>03</span>
            <div className="relative z-[1]">
              <span className="text-[0.65rem] tracking-[0.28em] uppercase mb-6 block" style={{ color: "#c9a84c" }}>{tx.disciplines.karaokeTag}</span>
              <h3 className="font-display text-[clamp(2rem,3.5vw,3rem)] tracking-[0.03em] leading-[0.95] mb-6">
                {tx.disciplines.karaokeTitle}
              </h3>
              <p className="text-[0.85rem] leading-[1.9] text-[rgba(240,238,234,0.45)] mb-8">
                {tx.disciplines.karaokeBody}
              </p>
              <ul className="list-none m-0 p-0 flex flex-col gap-3 mb-10">
                {tx.disciplines.karaokeList.map((item) => (
                  <li key={item} className="text-[0.78rem] text-[rgba(240,238,234,0.45)] flex items-center gap-4">
                    <span className="w-5 h-[1px] flex-shrink-0" style={{ backgroundColor: "#c9a84c" }} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={`${base}/karaoke#hero-bottom`}
                className="group text-[0.72rem] tracking-[0.2em] uppercase no-underline inline-flex items-center gap-3"
                style={{ color: "#c9a84c" }}
              >
                {tx.disciplines.karaokeCta}
                <svg className="transition-transform duration-200 group-hover:translate-x-1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Kids — full-width featured card */}
        <div className="max-w-[1100px] mx-auto mt-[1px]">
          <div
            className="relative overflow-hidden group transition-colors duration-300"
            style={{ backgroundColor: "#152444" }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#1a2e58")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#152444")}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 50% 80% at 80% 50%, rgba(59,130,246,0.12) 0%, transparent 70%)" }}
            />
            <div
              className="absolute top-8 md:top-1/2 right-8 md:-translate-y-1/2 font-display text-[5rem] md:text-[12rem] leading-none pointer-events-none select-none z-0"
              style={{ color: "rgba(59,130,246,0.07)" }}
            >
              04
            </div>
            <div className="px-10 py-12 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 items-center relative z-[1]">
              <div>
                <span className="text-[0.65rem] tracking-[0.28em] uppercase mb-4 block" style={{ color: "#3b82f6" }}>{tx.disciplines.kidsTag}</span>
                <h3 className="font-display text-[clamp(2.2rem,4vw,3.5rem)] tracking-[0.03em] leading-[0.95] mb-5 text-[#f0eeea]">
                  {tx.disciplines.kidsTitle}
                </h3>
                <p className="text-[0.88rem] leading-[1.9] text-[rgba(240,238,234,0.45)] max-w-[620px] mb-8">
                  {tx.disciplines.kidsBody}
                </p>
                <ul className="list-none m-0 p-0 grid grid-cols-2 gap-x-12 gap-y-3 mb-0">
                  {tx.disciplines.kidsList.map((item) => (
                    <li key={item} className="text-[0.78rem] text-[rgba(240,238,234,0.45)] flex items-center gap-3">
                      <span className="w-4 h-[1px] flex-shrink-0" style={{ backgroundColor: "#3b82f6" }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href={`${base}/kids#hero-bottom`}
                className="group flex-shrink-0 text-[0.72rem] tracking-[0.2em] uppercase no-underline inline-flex items-center gap-3 self-start md:self-center"
                style={{ color: "#3b82f6" }}
              >
                {tx.disciplines.kidsCta}
                <svg className="transition-transform duration-200 group-hover:translate-x-1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT / TEACHER ── */}
      <section id="about" className="py-28 px-6 lg:px-12 bg-[#0f0f0f] border-t border-white/[0.08]">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Photo */}
          <div className="relative">
            <div className="aspect-[3/4] overflow-hidden relative">
              <img
                src="/5.jpg"
                alt={lang === "ru" ? "Дария Свиридова — педагог по вокалу" : "Dariya Sviridova — vocal teacher"}
                className="w-full h-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/60 to-transparent pointer-events-none" />
            </div>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-[1px] bg-white/[0.08] mt-[1px]">
              {[
                { val: statYearsStage, label: tx.about.stat1Label },
                { val: statYearsTeach, label: tx.about.stat2Label },
                { val: statStudents, label: tx.about.stat3Label },
              ].map(({ val, label }) => (
                <div key={label} className="bg-[#080808] py-5 text-center">
                  <div className="font-display text-2xl text-[#e8002d]">{val}</div>
                  <div className="text-[0.65rem] tracking-[0.12em] uppercase text-[#555] mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Text */}
          <div>
            <span className="text-[0.68rem] tracking-[0.28em] uppercase text-[#e8002d] block mb-4">
              {tx.about.eyebrow}
            </span>
            <h2 className="font-display text-[clamp(3rem,5vw,5rem)] leading-[0.95] tracking-[0.02em]">
              {tx.about.title}
              <em className="font-['Playfair_Display'] not-italic italic text-[0.7em] text-[rgba(240,238,234,0.45)] block mt-1">
                {tx.about.titleEm}
              </em>
            </h2>
            <div className="w-10 h-[2px] bg-[#e8002d] my-8" />
            <p className="text-[0.9rem] leading-[1.9] text-[rgba(240,238,234,0.5)] mb-5">
              <strong className="text-[#f0eeea] font-normal">{bioLine1.split('.')[0]}.</strong>
              {bioLine1.substring(bioLine1.indexOf('.') + 1)}
            </p>
            <p className="text-[0.9rem] leading-[1.9] text-[rgba(240,238,234,0.5)] mb-5">{bioLine2}</p>
            <p className="text-[0.9rem] leading-[1.9] text-[rgba(240,238,234,0.5)] mb-10">{bioLine3}</p>
            <a
              href="#booking"
              className="inline-flex items-center gap-3 bg-[#e8002d] text-[#f0eeea] font-display text-[1rem] tracking-[0.15em] px-8 py-4 no-underline transition-all duration-200 hover:bg-[#ff1a3d] hover:gap-5 group"
            >
              {tx.about.cta}
              <svg className="transition-transform duration-200 group-hover:translate-x-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 px-6 lg:px-12 bg-[#e8002d] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "120px" }} />
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-[0.95] tracking-[0.02em] text-[#f0eeea]">
              {lang === "ru" ? "Ваш голос ждёт своего потенциала" : "Your voice is waiting for its potential"}
            </h2>
            <p className="text-[0.9rem] text-[rgba(240,238,234,0.75)] mt-3">
              {lang === "ru"
                ? "Запишитесь на пробный урок и начните менять свой голос уже сегодня."
                : "Book a trial lesson and start transforming your voice today."}
            </p>
          </div>
          <a
            href="#booking"
            className="flex-shrink-0 bg-[#f0eeea] text-[#080808] font-display text-[1.1rem] tracking-[0.15em] px-10 py-5 no-underline transition-all duration-200 hover:bg-white whitespace-nowrap inline-flex items-center gap-3 group"
          >
            {lang === "ru" ? "Записаться сейчас" : "Book Now"}
            <svg className="transition-transform duration-200 group-hover:translate-x-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
        </div>
      </section>

      {/* ── BOOKING ── */}
      <section id="booking" className="bg-[#141414] border-t border-white/[0.08]">
        {/* Row 1 — Full width heading */}
        <div className="pt-28 pb-12 px-6 lg:px-12">
          <div className="max-w-[1100px] mx-auto">
            <span className="text-[0.68rem] tracking-[0.28em] uppercase text-[#e8002d] block mb-4">
              {tx.booking.eyebrow}
            </span>
            <h2 className="font-display text-[clamp(3rem,5vw,5rem)] leading-[0.95] tracking-[0.02em]">
              {tx.booking.title}
              <em className="font-['Playfair_Display'] not-italic italic text-[0.7em] text-[rgba(240,238,234,0.45)] block mt-1">
                {tx.booking.titleEm}
              </em>
            </h2>
            <div className="w-10 h-[2px] bg-[#e8002d] my-8" />
            <p className="text-[0.9rem] leading-[1.9] text-[rgba(240,238,234,0.5)] mb-5">{tx.booking.intro1}</p>
            <p className="text-[0.9rem] leading-[1.9] text-[rgba(240,238,234,0.5)]">{tx.booking.intro2}</p>
          </div>
        </div>

        {/* Row 2 — 50/50 video | form */}
        <div className="pb-16 px-6 lg:px-12">
          <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${PROMO_VIDEO_ID}?rel=0&modestbranding=1`}
                title="Vocal.uz — Studio Preview"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <BookingForm />
          </div>
        </div>

        {/* Row 3 — Full width course strip with heading */}
        <div className="border-t border-white/[0.06] pt-12 pb-6 px-6 lg:px-12">
          <div className="max-w-[1100px] mx-auto mb-6">
            <span className="text-[0.62rem] tracking-[0.28em] uppercase text-[#e8002d] block mb-3">{tx.booking.coursesTitle}</span>
            <p className="text-[0.88rem] text-[rgba(240,238,234,0.45)] leading-relaxed">{tx.booking.coursesDesc}</p>
          </div>
        </div>
        <CourseStrip />
      </section>
    </>
  );
}
