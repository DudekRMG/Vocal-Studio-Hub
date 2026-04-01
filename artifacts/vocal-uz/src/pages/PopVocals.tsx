import { useLang } from "@/lib/langContext";
import { t } from "@/lib/i18n";
import { SeoHead } from "@/components/SeoHead";
import { BookingForm } from "@/components/BookingForm";
import { CourseStrip } from "@/components/CourseStrip";
import { PageHero } from "@/components/PageHero";

const PROMO_VIDEO_ID = "LXb3EKWsInQ";

export default function PopVocals() {
  const { lang } = useLang();
  const tx = t[lang];

  const isRu = lang === "ru";

  const hero = {
    tag: isRu ? "Поп-вокал" : "Pop Vocals",
    title: isRu ? "Чисто. Уверенно." : "Clean. Confident.",
    titleRed: isRu ? "Выразительно." : "Expressive.",
    sub: isRu ? "Голос как профессиональный инструмент" : "Voice as a professional instrument",
    desc: isRu
      ? "Поп-вокал — фундамент певческого мастерства. Дыхание, опора, резонаторы, тембр и артикуляция — всё это формирует голос, которым можно не просто петь, а говорить."
      : "Pop vocals are the foundation of singing mastery. Breathing, support, resonators, timbre, and articulation — they shape a voice that does not just sing, but speaks.",
  };

  const what = {
    eyebrow: isRu ? "О направлении" : "About",
    title: isRu ? "Что даёт поп-вокал?" : "What do pop vocal lessons give you?",
    body1: isRu
      ? "Занятия поп-вокалом решают сразу несколько задач: они ставят певческий аппарат, расширяют диапазон, улучшают тембр и развивают музыкальность. Это база, которая нужна всем: от начинающих до тех, кто уже поёт."
      : "Pop vocal lessons solve several problems at once: they place the singing apparatus, expand range, improve timbre, and develop musicality. It is a foundation that everyone needs: from beginners to those who already sing.",
    body2: isRu
      ? "Многие певцы годами поют «как получается», не понимая, почему голос устаёт, «ломается» или не звучит так, как хочется. Правильная техника решает эти проблемы системно."
      : "Many singers spend years singing 'as best they can', not understanding why the voice gets tired, 'breaks', or does not sound as desired. Correct technique solves these problems systematically.",
  };

  const pillars = [
    {
      icon: "◉",
      title: isRu ? "Дыхание" : "Breathing",
      desc: isRu
        ? "Диафрагмальное дыхание и певческая опора — основа всего. Без этого ни техника, ни тембр не работают так, как должны."
        : "Diaphragmatic breathing and singing support are the basis of everything. Without this, neither technique nor timbre works as it should.",
    },
    {
      icon: "◎",
      title: isRu ? "Резонаторы" : "Resonators",
      desc: isRu
        ? "Учимся использовать грудной, головной и смешанный резонаторы. Именно они формируют тот самый «полный» певческий звук."
        : "We learn to use chest, head, and mixed resonators. These are what form that 'full' singing sound.",
    },
    {
      icon: "◈",
      title: isRu ? "Тембр" : "Timbre",
      desc: isRu
        ? "Работаем над характером звука: яркость, тёплость, «открытость» или «глубина». Ваш тембр — ваша индивидуальность."
        : "We work on the character of the sound: brightness, warmth, 'openness' or 'depth'. Your timbre is your individuality.",
    },
    {
      icon: "◆",
      title: isRu ? "Диапазон" : "Range",
      desc: isRu
        ? "Постепенно расширяем рабочий диапазон без форсажа. Правильно поставленный голос способен расти в обе стороны."
        : "We gradually expand the working range without forcing. A properly placed voice can grow in both directions.",
    },
  ];

  const forWhom = [
    {
      title: isRu ? "Начинающие" : "Beginners",
      desc: isRu
        ? "Если вы никогда не занимались вокалом, но хотите научиться петь — это ваш старт. Мы выстроим всё с нуля."
        : "If you have never had vocal training but want to learn to sing — this is your starting point. We build everything from scratch.",
    },
    {
      title: isRu ? "Любители" : "Hobbyists",
      desc: isRu
        ? "Поёте для себя, в хоре или на вечеринках? Занятия помогут петь чище, увереннее и без усилий."
        : "Singing for yourself, in a choir, or at parties? Lessons will help you sing cleaner, more confidently, and effortlessly.",
    },
    {
      title: isRu ? "Музыканты" : "Musicians",
      desc: isRu
        ? "Играете на инструменте и хотите добавить вокал? Поставим голос и объясним, как совмещать инструмент и пение."
        : "Playing an instrument and want to add vocals? We will place your voice and explain how to combine instrument and singing.",
    },
    {
      title: isRu ? "Профессионалы" : "Professionals",
      desc: isRu
        ? "Уже выступаете, но хотите отшлифовать технику или расширить диапазон? Работаем на любом уровне."
        : "Already performing but want to refine technique or expand range? We work at any level.",
    },
  ];

  const programSteps = [
    {
      num: "01",
      title: isRu ? "Диагностика и знакомство" : "Assessment and Introduction",
      desc: isRu
        ? "Слушаем ваш голос, определяем тип и диапазон, обсуждаем цели. Вместе строим индивидуальный план."
        : "We listen to your voice, determine its type and range, and discuss goals. Together we build an individual plan.",
    },
    {
      num: "02",
      title: isRu ? "Постановка дыхания" : "Breath Placement",
      desc: isRu
        ? "Формируем правильную певческую опору. Это фундамент, на котором будет строиться всё остальное."
        : "We form correct singing support. This is the foundation on which everything else will be built.",
    },
    {
      num: "03",
      title: isRu ? "Работа с резонаторами" : "Resonator Work",
      desc: isRu
        ? "Учимся управлять звуком через резонаторы. Голос становится объёмнее, мягче и более управляемым."
        : "We learn to control sound through resonators. The voice becomes fuller, softer, and more controllable.",
    },
    {
      num: "04",
      title: isRu ? "Репертуар и подача" : "Repertoire and Performance",
      desc: isRu
        ? "Работаем на конкретных песнях из вашего репертуара. Техника в контексте живой музыки."
        : "We work on specific songs from your repertoire. Technique in the context of real music.",
    },
  ];

  const faqs = [
    {
      q: isRu ? "У меня нет слуха. Можно научиться петь?" : "I have no ear for music. Can I learn to sing?",
      a: isRu
        ? "Слух — это навык, а не врождённое качество. В большинстве случаев он хорошо поддаётся развитию при правильном подходе."
        : "Ear is a skill, not an innate quality. In most cases it responds well to development with the right approach.",
    },
    {
      q: isRu ? "Как часто нужно заниматься?" : "How often should I have lessons?",
      a: isRu
        ? "Оптимально — 1–2 раза в неделю плюс короткие самостоятельные практики. Регулярность важнее длительности."
        : "Ideally 1–2 times per week plus short independent practice sessions. Regularity matters more than duration.",
    },
    {
      q: isRu ? "Когда будут первые результаты?" : "When will I see the first results?",
      a: isRu
        ? "Качество звука и уверенность улучшаются уже после 3–5 занятий. Значительный прогресс виден через 2–3 месяца."
        : "Sound quality and confidence improve after just 3–5 lessons. Significant progress is visible within 2–3 months.",
    },
    {
      q: isRu ? "Какую музыку будем изучать?" : "What music will we study?",
      a: isRu
        ? "Любую, которую вы хотите петь. Мы работаем с вашим репертуаром, не навязываем чужой."
        : "Whatever you want to sing. We work with your repertoire, not someone else's.",
    },
  ];

  const ctaBannerText = isRu ? "Найдите свой голос" : "Find your voice";
  const ctaBannerSub = isRu ? "Запишитесь на пробный урок по поп-вокалу." : "Book a trial pop vocal lesson.";
  const ctaBtn = isRu ? "Записаться" : "Book Now";
  const bookTitle = isRu ? "Пробный урок" : "Trial Lesson";
  const bookTitleEm = isRu ? "по поп-вокалу" : "in Pop Vocals";
  const bookIntro = isRu
    ? "На пробном уроке мы познакомимся с вашим голосом, определим точку отсчёта и составим план работы. Урок ни к чему не обязывает."
    : "In the trial lesson we will get to know your voice, establish a starting point, and create a work plan. The lesson comes with no obligation.";

  const bookHeroLabel = isRu ? "Пробный урок" : "Book a Trial Lesson";
  const forWhomTitle = isRu ? "Кому подходит?" : "Who is this for?";
  const programTitle = isRu ? "Программа занятий" : "Lesson Programme";
  const faqTitle = isRu ? "Часто задаваемые вопросы" : "Frequently Asked Questions";

  return (
    <>
      <SeoHead
        title={tx.seo.pop.title}
        description={tx.seo.pop.description}
        lang={lang}
        canonical="https://vocal.uz/pop"
      />

      {/* ── HERO ── */}
      <PageHero
        accentColor="#9d4edd"
        courseTag={hero.tag}
        courseTitle={<>{hero.title} <span style={{ color: "#9d4edd" }}>{hero.titleRed}</span></>}
        courseSub={hero.sub}
        courseDesc={hero.desc}
        ctaHref="#book-pop"
        ctaLabel={bookHeroLabel}
        ctaBg="#9d4edd"
        ctaText="#ffffff"
        mobileTrainingLabel={lang === "ru" ? "Курс поп-вокала" : "Pop Vocals Course"}
      />

      {/* ── WHAT IS ── */}
      <section id="course-content" className="py-28 px-6 lg:px-12 bg-[#080808] border-b border-white/[0.08]">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-[0.68rem] tracking-[0.28em] uppercase text-[#9d4edd] block mb-4">{what.eyebrow}</span>
            <h2 className="font-['Playfair_Display'] italic text-[clamp(2.2rem,4vw,3.5rem)] leading-[1.2] mb-8">{what.title}</h2>
            <div className="w-10 h-[2px] bg-[#9d4edd] mb-8" />
            <p className="text-[0.9rem] leading-[1.9] text-[rgba(240,238,234,0.5)] mb-5">{what.body1}</p>
            <p className="text-[0.9rem] leading-[1.9] text-[rgba(240,238,234,0.5)]">{what.body2}</p>
          </div>
          <div className="grid grid-cols-2 gap-[1px] bg-white/[0.08]">
            {pillars.map((p) => (
              <div key={p.title} className="bg-[#0f0f0f] p-5 md:p-8">
                <div className="text-2xl mb-4" style={{ color: "#9d4edd" }}>{p.icon}</div>
                <h3 className="font-display text-[1.2rem] tracking-[0.08em] mb-3 text-[#f0eeea]">{p.title}</h3>
                <p className="text-[0.8rem] leading-[1.7] text-[rgba(240,238,234,0.4)]">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR WHOM ── */}
      <section className="py-28 px-6 lg:px-12 bg-[#141414] border-b border-white/[0.08]">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="font-['Playfair_Display'] italic text-[clamp(2.5rem,4vw,4rem)] leading-[1.2] mb-16">{forWhomTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-white/[0.08]">
            {forWhom.map((item) => (
              <div key={item.title} className="bg-[#141414] p-10">
                <h3 className="font-display text-[1.4rem] tracking-[0.08em] mb-4" style={{ color: "#9d4edd" }}>{item.title}</h3>
                <p className="text-[0.85rem] leading-[1.8] text-[rgba(240,238,234,0.45)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROGRAMME ── */}
      <section className="py-28 px-6 lg:px-12 bg-[#0f0f0f] border-b border-white/[0.08]">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="font-['Playfair_Display'] italic text-[clamp(2.5rem,4vw,4rem)] leading-[1.2] mb-16">{programTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-white/[0.08]">
            {programSteps.map((step) => (
              <div key={step.num} className="bg-[#0f0f0f] p-10">
                <div className="font-display text-[3.5rem] leading-none mb-6" style={{ color: "rgba(157,78,221,0.3)" }}>{step.num}</div>
                <h3 className="font-display text-[1.2rem] tracking-[0.08em] mb-4 text-[#f0eeea]">{step.title}</h3>
                <p className="text-[0.82rem] leading-[1.8] text-[rgba(240,238,234,0.45)]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-28 px-6 lg:px-12 bg-[#080808] border-b border-white/[0.08]">
        <div className="max-w-[800px] mx-auto">
          <h2 className="font-['Playfair_Display'] italic text-[clamp(2.5rem,4vw,4rem)] leading-[1.2] mb-16">{faqTitle}</h2>
          <div className="flex flex-col gap-[1px] bg-white/[0.08]">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-[#080808] px-10 py-8">
                <h3 className="font-['Playfair_Display'] italic text-[1.1rem] leading-[1.5] text-[#f0eeea] mb-3">{faq.q}</h3>
                <p className="text-[0.88rem] leading-[1.8] text-[rgba(240,238,234,0.5)]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 px-6 lg:px-12 relative overflow-hidden" style={{ backgroundColor: "#9d4edd" }}>
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-['Playfair_Display'] italic text-[clamp(2rem,4vw,3.5rem)] leading-[1.2] text-white">{ctaBannerText}</h2>
            <p className="text-[0.9rem] text-[rgba(255,255,255,0.75)] mt-3">{ctaBannerSub}</p>
          </div>
          <a
            href="#book-pop"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById("book-pop");
              if (!el) return;
              const nav = document.querySelector("nav");
              const navH = nav ? (nav as HTMLElement).offsetHeight : 0;
              window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - navH, behavior: "smooth" });
            }}
            className="flex-shrink-0 bg-white text-[#9d4edd] font-display text-[1.1rem] tracking-[0.15em] px-10 py-5 no-underline hover:bg-[#f0eeea] whitespace-nowrap inline-flex items-center gap-3 group transition-colors duration-200"
          >
            {ctaBtn}
            <svg className="transition-transform duration-200 group-hover:translate-x-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
        </div>
      </section>

      {/* ── BOOKING ── */}
      <section id="book-pop" className="bg-[#141414] border-t border-white/[0.08]">
        {/* Row 1 — Full width heading */}
        <div className="pt-28 pb-12 px-6 lg:px-12">
          <div className="max-w-[1100px] mx-auto">
            <span className="text-[0.68rem] tracking-[0.28em] uppercase text-[#9d4edd] block mb-4">{tx.booking.eyebrow}</span>
            <h2 className="font-['Playfair_Display'] italic text-[clamp(2.5rem,4vw,4rem)] leading-[1.2]">
              {bookTitle}
              <em className="not-italic text-[0.7em] text-[rgba(240,238,234,0.45)] block mt-1 italic">{bookTitleEm}</em>
            </h2>
            <div className="w-10 h-[2px] bg-[#9d4edd] my-8" />
            <p className="text-[0.9rem] leading-[1.9] text-[rgba(240,238,234,0.5)]">{bookIntro}</p>
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
            <BookingForm accentColor="#9d4edd" />
          </div>
        </div>

        {/* Row 3 — Full width course strip with heading */}
        <div className="border-t border-white/[0.06] pt-12 pb-6 px-6 lg:px-12">
          <div className="max-w-[1100px] mx-auto mb-6">
            <span className="text-[0.62rem] tracking-[0.28em] uppercase block mb-3" style={{ color: "#9d4edd" }}>{tx.booking.moreOptions}</span>
            <p className="text-[0.88rem] text-[rgba(240,238,234,0.45)] leading-relaxed">{tx.booking.moreOptionsDesc}</p>
          </div>
        </div>
        <CourseStrip exclude="pop" />
      </section>
    </>
  );
}
