import { Link } from "wouter";
import { useLang } from "@/lib/langContext";
import { t } from "@/lib/i18n";
import { SeoHead } from "@/components/SeoHead";
import { BookingForm } from "@/components/BookingForm";
import { useSanityContent } from "@/lib/useSanityContent";

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
      <section
        id="hero"
        className="min-h-screen grid grid-cols-1 md:grid-cols-2 relative overflow-hidden"
      >
        {/* Noise overlay */}
        <div
          className="fixed inset-0 z-[9999] pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "120px",
          }}
        />

        {/* Left — Extreme */}
        <div className="bg-[#080808] flex flex-col justify-end px-8 lg:px-12 pt-36 pb-28 relative overflow-hidden border-r border-white/[0.08]">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 70% 60% at 30% 60%, rgba(232,0,45,.09) 0%, transparent 70%)" }}
          />
          <div
            className="absolute top-1/2 -left-6 -translate-y-1/2 -rotate-90 font-display text-[18vw] text-[rgba(232,0,45,0.04)] pointer-events-none whitespace-nowrap leading-none"
            style={{ transformOrigin: "left center" }}
          >
            EXTREME
          </div>
          <span className="text-[0.68rem] tracking-[0.25em] uppercase text-[#e8002d] mb-5 animate-[fadeUp_0.6s_0.5s_both]">
            {tx.hero.tagLeft}
          </span>
          <h1 className="font-display text-[clamp(3.5rem,8vw,7.5rem)] leading-[0.9] tracking-[0.02em] animate-[fadeUp_0.7s_0.65s_both]">
            {tx.hero.titleLeft1}
            <span className="block text-[#e8002d]">{tx.hero.titleLeft2}</span>
          </h1>
          <p className="mt-7 text-[0.85rem] leading-[1.8] text-[rgba(240,238,234,0.45)] max-w-[320px] animate-[fadeUp_0.6s_0.9s_both]">
            {tx.hero.descLeft}
          </p>
          <div className="mt-10 animate-[fadeUp_0.6s_1.1s_both]">
            <Link
              href={`${base}/extreme`}
              className="inline-flex items-center gap-3 text-[0.72rem] tracking-[0.2em] uppercase text-[#e8002d] no-underline transition-all duration-200 hover:gap-5"
            >
              {lang === "ru" ? "Подробнее" : "Learn more"}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>

        {/* Right — Pop */}
        <div className="bg-[#0f0f0f] flex flex-col justify-end px-8 lg:px-12 pt-36 pb-28 relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 60% 50% at 70% 40%, rgba(240,238,234,.04) 0%, transparent 70%)" }}
          />
          <div
            className="absolute top-1/2 -right-6 rotate-90 font-['Playfair_Display'] italic text-[16vw] text-[rgba(240,238,234,0.025)] pointer-events-none whitespace-nowrap leading-none"
            style={{ transformOrigin: "right center" }}
          >
            Pop
          </div>
          <span className="text-[0.68rem] tracking-[0.25em] uppercase text-[#555] mb-5 animate-[fadeUp_0.6s_0.8s_both]">
            {tx.hero.tagRight}
          </span>
          <h2 className="font-['Playfair_Display'] italic text-[clamp(3rem,6.5vw,6.5rem)] leading-[0.95] animate-[fadeUp_0.7s_0.95s_both]">
            {tx.hero.titleRight1}
            <span className="block text-[rgba(240,238,234,0.45)]">{tx.hero.titleRight2}</span>
          </h2>
          <p className="mt-7 text-[0.85rem] leading-[1.8] text-[rgba(240,238,234,0.45)] max-w-[320px] animate-[fadeUp_0.6s_1.15s_both]">
            {tx.hero.descRight}
          </p>
          <div className="mt-10 animate-[fadeUp_0.6s_1.3s_both]">
            <Link
              href={`${base}/pop`}
              className="inline-flex items-center gap-3 text-[0.72rem] tracking-[0.2em] uppercase text-[#f0eeea] no-underline transition-all duration-200 hover:gap-5"
            >
              {lang === "ru" ? "Подробнее" : "Learn more"}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>

        {/* Center brand */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 text-center animate-[fadeIn_0.8s_0.3s_both]">
          <div className="font-display text-[clamp(1.4rem,3vw,2.4rem)] tracking-[0.25em] text-[#f0eeea] bg-[#080808] px-6 py-2 border border-white/[0.08] whitespace-nowrap">
            {tx.hero.brand}<span className="text-[#e8002d]">{tx.hero.brandDot}</span>{tx.hero.brandUz}
          </div>
          <span className="block mt-0 text-[0.65rem] tracking-[0.22em] uppercase text-[#555] bg-[#080808] px-4 py-[0.35rem] border border-white/[0.08] border-t-0">
            {tx.hero.teacher}
          </span>
        </div>

        {/* CTA strip */}
        <div className="absolute bottom-0 left-0 right-0 z-10 grid grid-cols-2 h-16">
          <a
            href="#booking"
            className="bg-[#e8002d] px-8 flex items-center justify-between no-underline transition-colors duration-200 hover:bg-[#ff1a3d] group"
          >
            <span className="font-display text-[1.15rem] tracking-[0.1em] text-[#f0eeea]">
              {tx.hero.ctaBook}
            </span>
            <span className="text-[#f0eeea] transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
          <a
            href="#about"
            className="bg-[#141414] border-t border-white/[0.08] px-8 flex items-center justify-between no-underline transition-colors duration-200 hover:bg-[#1a1a1a] group"
          >
            <span className="font-display text-[1.15rem] tracking-[0.1em] text-[#f0eeea]">
              {tx.hero.ctaLearn}
            </span>
            <span className="text-[rgba(240,238,234,0.7)] transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
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

        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-white/[0.08]">
          {/* Extreme card */}
          <div className="bg-[#080808] p-14 relative overflow-hidden group transition-colors duration-300 hover:bg-[#0d0a0a]">
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 60% 50% at 20% 80%, rgba(232,0,45,.08) 0%, transparent 70%)" }}
            />
            <span className="absolute top-8 right-10 font-display text-[6rem] leading-none text-[rgba(232,0,45,0.07)]">01</span>
            <span className="text-[0.65rem] tracking-[0.28em] uppercase text-[#e8002d] mb-6 block">{tx.disciplines.extremeTag}</span>
            <h3 className="font-display text-[clamp(2.5rem,4.5vw,4rem)] tracking-[0.03em] leading-[0.95] mb-6">
              {tx.disciplines.extremeTitle}
            </h3>
            <p className="text-[0.88rem] leading-[1.9] text-[rgba(240,238,234,0.45)] mb-8 max-w-[400px]">
              {tx.disciplines.extremeBody}
            </p>
            <ul className="list-none m-0 p-0 flex flex-col gap-3 mb-10">
              {tx.disciplines.extremeList.map((item) => (
                <li key={item} className="text-[0.8rem] text-[rgba(240,238,234,0.45)] flex items-center gap-4">
                  <span className="w-5 h-[1px] bg-[#e8002d] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href={`${base}/extreme`}
              className="text-[0.72rem] tracking-[0.2em] uppercase text-[#e8002d] no-underline inline-flex items-center gap-3 transition-all duration-200 hover:gap-5"
            >
              {tx.disciplines.extremeCta}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>

          {/* Pop card */}
          <div className="bg-[#0f0f0f] p-14 relative overflow-hidden group transition-colors duration-300 hover:bg-[#131313]">
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 60% 50% at 80% 20%, rgba(240,238,234,.04) 0%, transparent 70%)" }}
            />
            <span className="absolute top-8 right-10 font-display text-[6rem] leading-none text-[rgba(240,238,234,0.04)]">02</span>
            <span className="text-[0.65rem] tracking-[0.28em] uppercase text-[#555] mb-6 block">{tx.disciplines.popTag}</span>
            <h3 className="font-['Playfair_Display'] italic text-[clamp(2.2rem,4vw,3.5rem)] leading-[1] mb-6 text-[rgba(240,238,234,0.9)]">
              {tx.disciplines.popTitle}
            </h3>
            <p className="text-[0.88rem] leading-[1.9] text-[rgba(240,238,234,0.45)] mb-8 max-w-[400px]">
              {tx.disciplines.popBody}
            </p>
            <ul className="list-none m-0 p-0 flex flex-col gap-3 mb-10">
              {tx.disciplines.popList.map((item) => (
                <li key={item} className="text-[0.8rem] text-[rgba(240,238,234,0.45)] flex items-center gap-4">
                  <span className="w-5 h-[1px] bg-[#555] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href={`${base}/pop`}
              className="text-[0.72rem] tracking-[0.2em] uppercase text-[#f0eeea] no-underline inline-flex items-center gap-3 transition-all duration-200 hover:gap-5"
            >
              {tx.disciplines.popCta}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
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
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "120px" }} />
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
      <section id="booking" className="py-28 px-6 lg:px-12 bg-[#141414] border-t border-white/[0.08]">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-20 items-start">
          <div>
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
            <p className="text-[0.9rem] leading-[1.9] text-[rgba(240,238,234,0.5)] mb-8">{tx.booking.intro2}</p>
            <div className="flex flex-col gap-3">
              {tx.booking.perks.map((perk) => (
                <div key={perk} className="flex items-center gap-4 text-[0.82rem] text-[rgba(240,238,234,0.5)]">
                  <span className="w-[6px] h-[6px] rounded-full bg-[#e8002d] flex-shrink-0" />
                  {perk}
                </div>
              ))}
            </div>
          </div>
          <BookingForm />
        </div>
      </section>
    </>
  );
}
