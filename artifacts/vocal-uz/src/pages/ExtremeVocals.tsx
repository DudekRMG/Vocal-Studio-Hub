import { Link } from "wouter";
import { useLang } from "@/lib/langContext";
import { t } from "@/lib/i18n";
import { SeoHead } from "@/components/SeoHead";
import { BookingForm } from "@/components/BookingForm";

const extremeContent = {
  ru: {
    heroTag: "Экстремальный вокал",
    heroTitle: "Гроул. Скрим. Фрай.",
    heroSub: "Техника, которой можно научиться безопасно",
    heroDesc:
      "Многие думают, что экстремальный вокал — это просто крик. Это не так. Это отдельная вокальная дисциплина со своей физиологией, техниками и безопасными практиками. Мы учим петь тяжёлую музыку без вреда для голоса.",
    whatTitle: "Что такое экстремальный вокал?",
    whatBody:
      "Экстремальный вокал — собирательное название для различных техник, используемых в металле, хардкоре и родственных жанрах. В отличие от чистого вокала, здесь задействованы ложные голосовые складки, специфические резонаторы и особые положения гортани.",
    whatBody2:
      "Правильно поставленный экстремальный вокал не причиняет вреда и может использоваться годами. Неправильная техника приводит к травмам голосовых связок. Именно поэтому постановка голоса с педагогом критически важна.",
    techniquesTitle: "Техники",
    techniques: [
      {
        name: "Гроул",
        desc: "Базовая техника экстремального вокала. Низкий, «рычащий» звук, образуемый через ложные голосовые складки. Используется в дэт-метале, дум-метале.",
      },
      {
        name: "Дэт-гроул",
        desc: "Более тёмный и глубокий вариант гроула. Требует хорошей диафрагмальной опоры и контроля дыхания. Характерен для брутального дэт-метала.",
      },
      {
        name: "Скрим",
        desc: "Высокий, пронзительный звук с резким призвуком. Используется в металкоре, пост-хардкоре и блэк-метале. Требует точной работы с резонаторами.",
      },
      {
        name: "Блэк-скрим",
        desc: "Специфическая техника блэк-метала: шипящий, «холодный» тембр. Формируется через особое положение языка и мягкого нёба.",
      },
      {
        name: "Фрай / Вокал-фрай",
        desc: "Техника с минимальным воздушным потоком. Создаёт характерный «жареный» призвук. Применяется как самостоятельно, так и в сочетании с другими техниками.",
      },
      {
        name: "Пигги",
        desc: "Особая техника со специфическим «хрюкающим» тембром. Используется в брутальном дэт-метале и slam. Требует специфической работы с гортанью.",
      },
    ],
    processTitle: "Как проходят занятия",
    processSteps: [
      {
        num: "01",
        title: "Диагностика голоса",
        desc: "На первом занятии анализируем ваш голосовой аппарат, выявляем особенности, обсуждаем цели. Никакого давления — только честная картина.",
      },
      {
        num: "02",
        title: "Дыхание и опора",
        desc: "Любой экстремальный вокал строится на правильном диафрагмальном дыхании. Это фундамент, без которого ничего не работает.",
      },
      {
        num: "03",
        title: "Базовая техника",
        desc: "Постепенно осваиваем выбранные техники: от простых к сложным. Каждый шаг контролируется на предмет безопасности.",
      },
      {
        num: "04",
        title: "Стилистика и подача",
        desc: "Работаем над тембром, динамикой и выразительностью. Экстремальный вокал должен звучать не просто громко — он должен звучать убедительно.",
      },
    ],
    faqTitle: "Часто задаваемые вопросы",
    faqs: [
      {
        q: "Экстремальный вокал вредит голосу?",
        a: "Правильная техника — нет. Неправильная — да. Именно поэтому начинать нужно с педагогом, а не по видео из интернета.",
      },
      {
        q: "Нужна ли музыкальная подготовка?",
        a: "Нет. Мы работаем со студентами любого уровня, включая тех, кто никогда не занимался вокалом.",
      },
      {
        q: "Как быстро будут результаты?",
        a: "Первые ощутимые результаты — через 4–8 занятий. Скорость прогресса индивидуальна и зависит от регулярности занятий.",
      },
      {
        q: "Можно ли заниматься онлайн?",
        a: "Да, мы проводим как очные, так и онлайн-занятия. Формат не влияет на качество обучения.",
      },
    ],
    ctaBanner: "Готовы найти свой звук?",
    ctaBannerSub: "Запишитесь на пробный урок по экстремальному вокалу.",
    ctaBtn: "Записаться",
    bookTitle: "Пробный урок",
    bookTitleEm: "по экстремальному вокалу",
    bookIntro: "Первый урок — это знакомство. Разбираемся с вашим голосом, ставим реалистичные цели, объясняем, как всё работает физиологически.",
  },
  en: {
    heroTag: "Extreme Vocals",
    heroTitle: "Growl. Scream. Fry.",
    heroSub: "Technique you can learn safely",
    heroDesc:
      "Many people think extreme vocals are just screaming. They are not. This is a separate vocal discipline with its own physiology, techniques, and safe practices. We teach you to sing heavy music without damaging your voice.",
    whatTitle: "What are extreme vocals?",
    whatBody:
      "Extreme vocals is an umbrella term for various techniques used in metal, hardcore, and related genres. Unlike clean singing, they involve the false vocal folds, specific resonators, and particular laryngeal positions.",
    whatBody2:
      "Properly placed extreme vocals cause no harm and can be used for years. Incorrect technique leads to vocal cord injuries. That is why voice placement with a teacher is critically important.",
    techniquesTitle: "Techniques",
    techniques: [
      {
        name: "Growl",
        desc: "The fundamental extreme vocal technique. A low, 'growling' sound produced through the false vocal folds. Used in death metal and doom metal.",
      },
      {
        name: "Death Growl",
        desc: "A darker, deeper variant of growl. Requires strong diaphragmatic support and breath control. Characteristic of brutal death metal.",
      },
      {
        name: "Scream",
        desc: "A high, piercing sound with a sharp edge. Used in metalcore, post-hardcore, and black metal. Requires precise resonator work.",
      },
      {
        name: "Black Metal Scream",
        desc: "A specific black metal technique: a hissing, 'cold' timbre. Formed through a particular position of the tongue and soft palate.",
      },
      {
        name: "Fry / Vocal Fry",
        desc: "A technique using minimal airflow. Creates a characteristic 'fried' tone. Used both independently and combined with other techniques.",
      },
      {
        name: "Piggy",
        desc: "A specific technique with a characteristic 'grunt' timbre. Used in brutal death metal and slam. Requires specific laryngeal work.",
      },
    ],
    processTitle: "How lessons work",
    processSteps: [
      {
        num: "01",
        title: "Voice Assessment",
        desc: "In the first lesson we analyse your vocal apparatus, identify its characteristics, and discuss your goals. No pressure — just an honest picture.",
      },
      {
        num: "02",
        title: "Breathing and Support",
        desc: "All extreme vocals are built on correct diaphragmatic breathing. This is the foundation without which nothing works.",
      },
      {
        num: "03",
        title: "Core Technique",
        desc: "We gradually master the chosen techniques: from simple to complex. Every step is monitored for safety.",
      },
      {
        num: "04",
        title: "Style and Performance",
        desc: "We work on timbre, dynamics, and expressiveness. Extreme vocals should not just sound loud — they should sound convincing.",
      },
    ],
    faqTitle: "Frequently Asked Questions",
    faqs: [
      {
        q: "Does extreme vocal damage your voice?",
        a: "Correct technique does not. Incorrect technique does. That is why you should start with a teacher, not internet videos.",
      },
      {
        q: "Do I need musical training?",
        a: "No. We work with students of any level, including those who have never done any vocal training.",
      },
      {
        q: "How quickly will I see results?",
        a: "The first noticeable results come after 4–8 lessons. The speed of progress is individual and depends on the regularity of practice.",
      },
      {
        q: "Can I take lessons online?",
        a: "Yes, we offer both in-person and online lessons. The format does not affect the quality of training.",
      },
    ],
    ctaBanner: "Ready to find your sound?",
    ctaBannerSub: "Book a trial lesson in extreme vocals.",
    ctaBtn: "Book Now",
    bookTitle: "Trial Lesson",
    bookTitleEm: "in Extreme Vocals",
    bookIntro: "The first lesson is about getting to know you. We assess your voice, set realistic goals, and explain how everything works physiologically.",
  },
};

export default function ExtremeVocals() {
  const { lang } = useLang();
  const tx = t[lang];
  const c = extremeContent[lang];
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <>
      <SeoHead
        title={tx.seo.extreme.title}
        description={tx.seo.extreme.description}
        lang={lang}
        canonical="https://vocal.uz/extreme"
      />

      {/* ── HERO ── */}
      <section className="min-h-[70vh] flex flex-col justify-end px-6 lg:px-12 pt-36 pb-20 bg-[#080808] relative overflow-hidden border-b border-white/[0.08]">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 60% at 20% 60%, rgba(232,0,45,.1) 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 -left-6 -translate-y-1/2 -rotate-90 font-display text-[22vw] text-[rgba(232,0,45,0.04)] pointer-events-none whitespace-nowrap leading-none" style={{ transformOrigin: "left center" }}>
          EXTREME
        </div>
        <div className="max-w-[1100px] mx-auto w-full">
          <span className="text-[0.68rem] tracking-[0.28em] uppercase text-[#e8002d] block mb-5">{c.heroTag}</span>
          <h1 className="font-display text-[clamp(4rem,10vw,9rem)] leading-[0.85] tracking-[0.02em] mb-6">{c.heroTitle}</h1>
          <p className="font-['Playfair_Display'] italic text-[clamp(1.2rem,2.5vw,1.8rem)] text-[rgba(240,238,234,0.45)] mb-8 max-w-[500px]">{c.heroSub}</p>
          <p className="text-[0.9rem] leading-[1.9] text-[rgba(240,238,234,0.45)] max-w-[520px] mb-10">{c.heroDesc}</p>
          <a
            href="#book-extreme"
            className="inline-flex items-center gap-3 bg-[#e8002d] text-[#f0eeea] font-display text-[1.1rem] tracking-[0.15em] px-10 py-5 no-underline transition-all duration-200 hover:bg-[#ff1a3d] group"
          >
            {lang === "ru" ? "Записаться на пробный урок" : "Book a Trial Lesson"}
            <svg className="transition-transform duration-200 group-hover:translate-x-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
        </div>
      </section>

      {/* ── WHAT IS ── */}
      <section className="py-28 px-6 lg:px-12 bg-[#0f0f0f] border-b border-white/[0.08]">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-[0.68rem] tracking-[0.28em] uppercase text-[#e8002d] block mb-4">
              {lang === "ru" ? "О направлении" : "About"}
            </span>
            <h2 className="font-display text-[clamp(2.5rem,4vw,4rem)] leading-[0.95] tracking-[0.02em] mb-8">{c.whatTitle}</h2>
            <div className="w-10 h-[2px] bg-[#e8002d] mb-8" />
            <p className="text-[0.9rem] leading-[1.9] text-[rgba(240,238,234,0.5)] mb-5">{c.whatBody}</p>
            <p className="text-[0.9rem] leading-[1.9] text-[rgba(240,238,234,0.5)]">{c.whatBody2}</p>
          </div>
          <div className="grid grid-cols-2 gap-[1px] bg-white/[0.08]">
            {["Growl", "Scream", "Fry", "Piggy", lang === "ru" ? "Безопасная техника" : "Safe technique", lang === "ru" ? "Индивидуальный подход" : "Individual approach"].map((item) => (
              <div key={item} className="bg-[#141414] p-6 flex items-center">
                <span className="w-3 h-[1px] bg-[#e8002d] mr-4 flex-shrink-0" />
                <span className="text-[0.82rem] text-[rgba(240,238,234,0.6)]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECHNIQUES ── */}
      <section className="py-28 px-6 lg:px-12 bg-[#080808] border-b border-white/[0.08]">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="font-display text-[clamp(2.5rem,4vw,4rem)] leading-[0.95] tracking-[0.02em] mb-16">{c.techniquesTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-white/[0.08]">
            {c.techniques.map((tech, i) => (
              <div key={tech.name} className="bg-[#080808] p-10 relative group hover:bg-[#0d0a0a] transition-colors duration-300">
                <span className="font-display text-[5rem] leading-none text-[rgba(232,0,45,0.06)] absolute top-4 right-6">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-display text-[1.8rem] tracking-[0.05em] mb-4 text-[#e8002d]">{tech.name}</h3>
                <p className="text-[0.85rem] leading-[1.8] text-[rgba(240,238,234,0.45)]">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="py-28 px-6 lg:px-12 bg-[#141414] border-b border-white/[0.08]">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="font-display text-[clamp(2.5rem,4vw,4rem)] leading-[0.95] tracking-[0.02em] mb-16">{c.processTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-white/[0.08]">
            {c.processSteps.map((step) => (
              <div key={step.num} className="bg-[#141414] p-10">
                <div className="font-display text-[3.5rem] leading-none text-[rgba(232,0,45,0.2)] mb-6">{step.num}</div>
                <h3 className="font-display text-[1.2rem] tracking-[0.08em] mb-4 text-[#f0eeea]">{step.title}</h3>
                <p className="text-[0.82rem] leading-[1.8] text-[rgba(240,238,234,0.45)]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-28 px-6 lg:px-12 bg-[#0f0f0f] border-b border-white/[0.08]">
        <div className="max-w-[800px] mx-auto">
          <h2 className="font-display text-[clamp(2.5rem,4vw,4rem)] leading-[0.95] tracking-[0.02em] mb-16">{c.faqTitle}</h2>
          <div className="flex flex-col gap-[1px] bg-white/[0.08]">
            {c.faqs.map((faq) => (
              <div key={faq.q} className="bg-[#0f0f0f] px-10 py-8">
                <h3 className="font-display text-[1.15rem] tracking-[0.05em] text-[#f0eeea] mb-3">{faq.q}</h3>
                <p className="text-[0.88rem] leading-[1.8] text-[rgba(240,238,234,0.5)]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 px-6 lg:px-12 bg-[#e8002d] relative overflow-hidden">
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-[0.95] text-[#f0eeea]">{c.ctaBanner}</h2>
            <p className="text-[0.9rem] text-[rgba(240,238,234,0.75)] mt-3">{c.ctaBannerSub}</p>
          </div>
          <a href="#book-extreme" className="flex-shrink-0 bg-[#f0eeea] text-[#080808] font-display text-[1.1rem] tracking-[0.15em] px-10 py-5 no-underline hover:bg-white whitespace-nowrap inline-flex items-center gap-3 group transition-colors duration-200">
            {c.ctaBtn}
            <svg className="transition-transform duration-200 group-hover:translate-x-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
        </div>
      </section>

      {/* ── BOOKING ── */}
      <section id="book-extreme" className="py-28 px-6 lg:px-12 bg-[#141414] border-t border-white/[0.08]">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-20 items-start">
          <div>
            <span className="text-[0.68rem] tracking-[0.28em] uppercase text-[#e8002d] block mb-4">{t[lang].booking.eyebrow}</span>
            <h2 className="font-display text-[clamp(3rem,5vw,5rem)] leading-[0.95] tracking-[0.02em]">
              {c.bookTitle}
              <em className="font-['Playfair_Display'] not-italic italic text-[0.7em] text-[rgba(240,238,234,0.45)] block mt-1">{c.bookTitleEm}</em>
            </h2>
            <div className="w-10 h-[2px] bg-[#e8002d] my-8" />
            <p className="text-[0.9rem] leading-[1.9] text-[rgba(240,238,234,0.5)]">{c.bookIntro}</p>
          </div>
          <BookingForm />
        </div>
      </section>
    </>
  );
}
