import { useLang } from "@/lib/langContext";
import { t } from "@/lib/i18n";
import { SeoHead } from "@/components/SeoHead";
import { BookingForm } from "@/components/BookingForm";

const blue = "#3b82f6";
const blueDim = "rgba(59,130,246,0.09)";
const blueFaint = "rgba(59,130,246,0.07)";
const indigo = "#4f46e5";
const bgBase = "#f0f2fa";
const bgCard = "#e8eaf5";
const bgCardAlt = "#e3e5f0";
const textPrimary = "#0f1016";
const textDivider = "rgba(0,0,0,0.07)";

const kidsContent = {
  ru: {
    heroTag: "Вокал для детей · 5–16 лет",
    heroTitle: "Голос начинается здесь.",
    heroSub: "Индивидуально. Безопасно. Интересно.",
    heroDesc:
      "Каждый ребёнок уникален. Именно поэтому здесь нет шаблонных программ — только индивидуальный подход, интерес ребёнка в основе обучения и техники, безопасные для растущего голоса.",

    aboutTitle: "Почему детский вокал — это особый подход?",
    aboutBody1:
      "Голосовой аппарат ребёнка продолжает развиваться до 18–20 лет. Это означает, что техники, безопасные для взрослого, могут быть противопоказаны ребёнку. И наоборот — правильно начатые занятия формируют крепкий фундамент на всю жизнь.",
    aboutBody2:
      "Дария работает с детьми более 7 лет. Она знает, как объяснить дыхание через игру, как удержать внимание ученика и как выстроить программу так, чтобы каждый урок был и полезным, и радостным.",
    aboutFeatures: [
      "Анатомически безопасные техники",
      "Обучение через игру и интерес",
      "Гибкий темп под каждого ученика",
      "Онлайн и офлайн",
      "Родители всегда в курсе прогресса",
      "Пробный урок без обязательств",
    ],

    ageGroupsTitle: "Подходы по возрасту",
    ageGroups: [
      {
        range: "5–8 лет",
        label: "Открытие",
        desc: "В этом возрасте главное — не техника, а интерес. Занятия строятся как игра: ритм, слух, первые песни по вкусу ребёнка. Никакого давления, только радость от голоса.",
        points: ["Развитие слуха через игру", "Ритм и координация", "Первые простые песни", "Дыхание в игровой форме"],
      },
      {
        range: "9–12 лет",
        label: "Основа",
        desc: "Самый продуктивный возраст для постановки голоса. Вводим технику — дыхание, резонаторы, интонацию. Стиль выбирает ученик: поп, рок, академика или что-то ещё.",
        points: ["Диафрагмальное дыхание", "Резонаторы и тембр", "Интонация и чистота", "Работа с любимыми песнями"],
      },
      {
        range: "13–16 лет",
        label: "Стиль",
        desc: "Подросткам интересны реальные стили. Работаем с тем, что нравится — поп, рок, металл (включая экстримальный вокал, если хочет). Всё в рамках того, что безопасно для этого возраста.",
        points: ["Стилистика и подача", "Диапазон и переход голоса", "Экстремальный вокал по запросу", "Уверенность на сцене"],
      },
    ],

    stylesTitle: "Что можно изучать",
    stylesSub: "Ребёнок сам решает, что ему интересно. Педагог адаптирует технику под стиль и возраст.",
    styles: [
      { name: "Поп-вокал", desc: "Чистый звук, интонация, подача. Самый универсальный старт." },
      { name: "Рок-вокал", desc: "Напор и характер. Работа с динамикой и выразительностью." },
      { name: "Академический вокал", desc: "Классическая постановка — сильнейший фундамент для любого стиля." },
      { name: "Экстремальный вокал", desc: "Для подростков 13+ по желанию. Только безопасные техники, строго под контролем педагога." },
      { name: "Эстрада и мюзикл", desc: "Яркая подача, сцена, харизма. Для тех, кто хочет выступать." },
      { name: "Авторский стиль", desc: "Ребёнок хочет петь своё? Помогаем найти и развить уникальный голос." },
    ],

    processTitle: "Как проходят занятия",
    processSteps: [
      { num: "01", title: "Знакомство и диагностика", desc: "На первом уроке знакомимся с ребёнком и его голосом. Никакого давления — просто разговор, игра и первые звуки." },
      { num: "02", title: "Выясняем интересы", desc: "Что любит слушать? Кем хочет быть? Чего боится? Ответы на эти вопросы формируют программу." },
      { num: "03", title: "Индивидуальная программа", desc: "Педагог составляет план обучения под конкретного ребёнка — с учётом возраста, голоса и интересов." },
      { num: "04", title: "Регулярные итоги", desc: "Раз в месяц — небольшой отчёт для родителей: прогресс, цели, следующий шаг." },
    ],

    safetyTitle: "Безопасность прежде всего",
    safetyBody1:
      "Детский голос — не уменьшенная копия взрослого. Связки, мышцы и резонаторы ребёнка находятся в процессе формирования. Неправильная нагрузка на этом этапе может навредить на годы.",
    safetyBody2:
      "Дария обучалась работе с детскими голосами отдельно и применяет только техники, безопасные для каждой возрастной группы. Если что-то не подходит ребёнку по возрасту — это честно объясняется родителям.",
    safetyPoints: [
      "Никаких техник, опасных для детских связок",
      "Нагрузка строго по возрасту и развитию",
      "Мутация голоса учитывается и отслеживается",
      "Прозрачность с родителями о ходе занятий",
    ],

    faqTitle: "Вопросы родителей",
    faqs: [
      { q: "С какого возраста можно начинать?", a: "С 5 лет. В этом возрасте занятия носят игровой характер и направлены прежде всего на развитие слуха и ритма." },
      { q: "Безопасно ли это для голоса ребёнка?", a: "Да, при правильном подходе. Занятия выстроены с учётом физиологии детского голосового аппарата. Опасные нагрузки исключены." },
      { q: "Можно ли заниматься онлайн?", a: "Да. Онлайн-занятия полностью поддерживаются. Для маленьких детей желательно присутствие родителя рядом." },
      { q: "Как быстро будет результат?", a: "Первые заметные изменения — через 4–6 занятий. Но темп у каждого ребёнка свой. Мы не торопим и не сравниваем." },
      { q: "Нужно ли музыкальное образование?", a: "Нет. Мы начинаем с нуля и выстраиваем всё с нуля. Нотная грамота не требуется." },
    ],

    ctaBanner: "Подарите ребёнку его голос.",
    ctaBannerSub: "Первый урок — знакомство. Никакого давления.",
    ctaBtn: "Записаться",
    bookTitle: "Записаться",
    bookTitleEm: "на детский вокал",
    bookIntro: "Напишите нам — обсудим возраст ребёнка, цели и формат занятий. Первый урок — пробный.",
  },
  en: {
    heroTag: "Kids Vocals · Ages 5–16",
    heroTitle: "Voice Starts Here.",
    heroSub: "Individual. Safe. Engaging.",
    heroDesc:
      "Every child is unique. That is why there are no cookie-cutter programmes here — only an individual approach, the child's interests at the centre, and techniques safe for a growing voice.",

    aboutTitle: "Why kids' vocal training is a different discipline",
    aboutBody1:
      "A child's vocal apparatus continues developing until age 18–20. This means techniques that are safe for an adult may be contraindicated for a child. Conversely, lessons started the right way build a strong foundation for life.",
    aboutBody2:
      "Dariya has worked with children for over 7 years. She knows how to explain breathing through play, how to keep a student's attention, and how to structure each lesson so it is both useful and joyful.",
    aboutFeatures: [
      "Anatomically safe techniques",
      "Learning through play and interest",
      "Flexible pace for every student",
      "Online and offline",
      "Parents kept informed on progress",
      "Trial lesson with no commitment",
    ],

    ageGroupsTitle: "Approach by age group",
    ageGroups: [
      {
        range: "Ages 5–8",
        label: "Discovery",
        desc: "At this age the priority is not technique — it is interest. Lessons are play-based: rhythm, ear training, first songs the child loves. No pressure, only the joy of using your voice.",
        points: ["Ear development through play", "Rhythm and coordination", "First simple songs", "Breathing as a game"],
      },
      {
        range: "Ages 9–12",
        label: "Foundation",
        desc: "The most productive age for voice placement. We introduce technique — breathing, resonators, intonation. The student chooses the style: pop, rock, classical, or something else.",
        points: ["Diaphragmatic breathing", "Resonators and tone", "Intonation and clarity", "Working on favourite songs"],
      },
      {
        range: "Ages 13–16",
        label: "Style",
        desc: "Teenagers want real styles. We work with what they love — pop, rock, metal (including extreme vocals if they want). Always within what is safe at this age.",
        points: ["Style and delivery", "Range and voice break", "Extreme vocals on request", "Stage confidence"],
      },
    ],

    stylesTitle: "What they can study",
    stylesSub: "The child decides what interests them. The teacher adapts the technique to the style and age.",
    styles: [
      { name: "Pop Vocals", desc: "Clean tone, intonation, delivery. The most universal starting point." },
      { name: "Rock Vocals", desc: "Drive and character. Working on dynamics and expression." },
      { name: "Classical Vocals", desc: "Classical placement — the strongest foundation for any style." },
      { name: "Extreme Vocals", desc: "For teens 13+ by request. Safe techniques only, strictly under the teacher's guidance." },
      { name: "Pop Stage & Musical", desc: "Bright delivery, stage presence, charisma. For those who want to perform." },
      { name: "Own Style", desc: "Does the child want to sing their own music? We help find and develop a unique voice." },
    ],

    processTitle: "How lessons work",
    processSteps: [
      { num: "01", title: "Introduction & Assessment", desc: "In the first lesson we get to know the child and their voice. No pressure — just conversation, play, and first sounds." },
      { num: "02", title: "Finding Interests", desc: "What do they love listening to? Who do they want to be? What are they nervous about? The answers shape the programme." },
      { num: "03", title: "Individual Programme", desc: "The teacher builds a study plan for this specific child — taking age, voice, and interests into account." },
      { num: "04", title: "Regular Progress Updates", desc: "Once a month — a short update for parents: progress made, goals ahead, next step." },
    ],

    safetyTitle: "Safety first",
    safetyBody1:
      "A child's voice is not a smaller adult voice. A child's vocal cords, muscles, and resonators are still forming. Incorrect load at this stage can cause harm that lasts for years.",
    safetyBody2:
      "Dariya trained separately in working with children's voices and uses only techniques that are safe for each age group. If something is not suitable for a child's age, this is explained honestly to the parents.",
    safetyPoints: [
      "No techniques harmful to children's vocal cords",
      "Load strictly matched to age and development",
      "Voice break is monitored and accommodated",
      "Full transparency with parents throughout",
    ],

    faqTitle: "Parents' Questions",
    faqs: [
      { q: "From what age can we start?", a: "From age 5. At this age lessons are play-based and focused primarily on ear development and rhythm." },
      { q: "Is it safe for my child's voice?", a: "Yes, with the right approach. Lessons are structured around children's vocal physiology. Harmful loads are excluded." },
      { q: "Can we do lessons online?", a: "Yes. Online is fully supported. For young children, it is helpful for a parent to be nearby during the lesson." },
      { q: "How quickly will we see results?", a: "The first noticeable changes come after 4–6 lessons. But every child has their own pace. We do not rush or compare." },
      { q: "Does my child need musical training?", a: "No. We start from zero and build everything from the ground up. Music reading is not required." },
    ],

    ctaBanner: "Give your child their voice.",
    ctaBannerSub: "First lesson is an introduction. No pressure.",
    ctaBtn: "Book a Lesson",
    bookTitle: "Book",
    bookTitleEm: "a kids' vocal lesson",
    bookIntro: "Write to us — we will discuss your child's age, goals, and lesson format. The first lesson is a trial.",
  },
};

export default function KidsVocals() {
  const { lang } = useLang();
  const tx = t[lang];
  const c = kidsContent[lang];

  return (
    <>
      <SeoHead
        title={tx.seo.kids.title}
        description={tx.seo.kids.description}
        lang={lang}
        canonical="https://vocal.uz/kids"
      />

      {/* ── HERO ── */}
      <section
        className="min-h-[70vh] flex flex-col justify-end px-6 lg:px-12 pt-36 pb-20 relative overflow-hidden border-b"
        style={{ backgroundColor: bgBase, borderColor: "rgba(0,0,0,0.07)" }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 70% 60% at 20% 60%, ${blueDim} 0%, transparent 70%)` }} />
        <div
          className="absolute top-1/2 -left-6 -translate-y-1/2 -rotate-90 font-display text-[22vw] pointer-events-none whitespace-nowrap leading-none"
          style={{ color: blueFaint, transformOrigin: "left center" }}
        >
          KIDS
        </div>
        <div className="max-w-[1100px] mx-auto w-full">
          <span className="text-[0.68rem] tracking-[0.28em] uppercase block mb-5" style={{ color: blue }}>{c.heroTag}</span>
          <h1 className="font-display text-[clamp(4rem,10vw,9rem)] leading-[0.85] tracking-[0.02em] mb-6 text-[#0f1016]">{c.heroTitle}</h1>
          <p className="font-['Playfair_Display'] italic text-[clamp(1.2rem,2.5vw,1.8rem)] text-[rgba(15,16,22,0.45)] mb-8 max-w-[500px]">{c.heroSub}</p>
          <p className="text-[0.9rem] leading-[1.9] text-[rgba(15,16,22,0.45)] max-w-[520px] mb-10">{c.heroDesc}</p>
          <a
            href="#book-kids"
            className="inline-flex items-center gap-3 text-white font-display text-[1.1rem] tracking-[0.15em] px-10 py-5 no-underline transition-all duration-200 group"
            style={{ backgroundColor: blue }}
            onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.15)")}
            onMouseLeave={e => (e.currentTarget.style.filter = "")}
          >
            {lang === "ru" ? "Записаться на пробный урок" : "Book a Trial Lesson"}
            <svg className="transition-transform duration-200 group-hover:translate-x-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
        </div>
      </section>

      {/* ── ABOUT THE APPROACH ── */}
      <section className="py-28 px-6 lg:px-12 border-b" style={{ backgroundColor: bgCard, borderColor: "rgba(0,0,0,0.07)" }}>
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
          <div>
            <span className="text-[0.68rem] tracking-[0.28em] uppercase block mb-4" style={{ color: blue }}>
              {lang === "ru" ? "О подходе" : "The Approach"}
            </span>
            <h2 className="font-display text-[clamp(2.5rem,4vw,4rem)] leading-[0.95] tracking-[0.02em] mb-8 text-[#0f1016]">{c.aboutTitle}</h2>
            <div className="w-10 h-[2px] mb-8" style={{ backgroundColor: blue }} />
            <p className="text-[0.9rem] leading-[1.9] text-[rgba(15,16,22,0.5)] mb-5">{c.aboutBody1}</p>
            <p className="text-[0.9rem] leading-[1.9] text-[rgba(15,16,22,0.5)]">{c.aboutBody2}</p>
          </div>
          <div className="grid grid-cols-2 gap-[1px]" style={{ backgroundColor: "rgba(0,0,0,0.07)" }}>
            {c.aboutFeatures.map((item) => (
              <div key={item} className="p-6 flex items-center" style={{ backgroundColor: bgCardAlt }}>
                <span className="w-3 h-[1px] mr-4 flex-shrink-0" style={{ backgroundColor: blue }} />
                <span className="text-[0.82rem] text-[rgba(15,16,22,0.6)]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AGE GROUPS ── */}
      <section className="py-28 px-6 lg:px-12 border-b" style={{ backgroundColor: bgBase, borderColor: "rgba(0,0,0,0.07)" }}>
        <div className="max-w-[1100px] mx-auto">
          <h2 className="font-display text-[clamp(2.5rem,4vw,4rem)] leading-[0.95] tracking-[0.02em] mb-16 text-[#0f1016]">{c.ageGroupsTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px]" style={{ backgroundColor: "rgba(0,0,0,0.07)" }}>
            {c.ageGroups.map((group, i) => (
              <div key={group.range} className="p-10 relative group hover:opacity-95 transition-opacity" style={{ backgroundColor: i % 2 === 0 ? bgCard : bgCardAlt }}>
                <div className="font-display text-[4rem] leading-none absolute top-4 right-6 pointer-events-none" style={{ color: "rgba(59,130,246,0.12)" }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="font-display text-[0.8rem] tracking-[0.2em] mb-2" style={{ color: indigo }}>{group.range}</div>
                <h3 className="font-display text-[1.8rem] tracking-[0.05em] mb-4" style={{ color: blue }}>{group.label}</h3>
                <p className="text-[0.85rem] leading-[1.8] text-[rgba(15,16,22,0.5)] mb-6">{group.desc}</p>
                <ul className="list-none m-0 p-0 flex flex-col gap-2">
                  {group.points.map((pt) => (
                    <li key={pt} className="text-[0.78rem] text-[rgba(15,16,22,0.45)] flex items-center gap-3">
                      <span className="w-4 h-[1px] flex-shrink-0" style={{ backgroundColor: blue }} />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STYLES ── */}
      <section className="py-28 px-6 lg:px-12 border-b" style={{ backgroundColor: bgCard, borderColor: "rgba(0,0,0,0.07)" }}>
        <div className="max-w-[1100px] mx-auto">
          <h2 className="font-display text-[clamp(2.5rem,4vw,4rem)] leading-[0.95] tracking-[0.02em] mb-4 text-[#0f1016]">{c.stylesTitle}</h2>
          <p className="text-[0.9rem] leading-[1.9] text-[rgba(15,16,22,0.4)] mb-14 max-w-[560px]">{c.stylesSub}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px]" style={{ backgroundColor: "rgba(0,0,0,0.07)" }}>
            {c.styles.map((style, i) => (
              <div key={style.name} className="p-10 relative group hover:brightness-110 transition-all duration-300" style={{ backgroundColor: bgCard }}>
                <span className="font-display text-[5rem] leading-none absolute top-4 right-6 pointer-events-none" style={{ color: "rgba(59,130,246,0.10)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-[1.5rem] tracking-[0.05em] mb-4" style={{ color: blue }}>{style.name}</h3>
                <p className="text-[0.85rem] leading-[1.8] text-[rgba(15,16,22,0.45)]">{style.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="py-28 px-6 lg:px-12 border-b" style={{ backgroundColor: bgCardAlt, borderColor: "rgba(0,0,0,0.07)" }}>
        <div className="max-w-[1100px] mx-auto">
          <h2 className="font-display text-[clamp(2.5rem,4vw,4rem)] leading-[0.95] tracking-[0.02em] mb-16 text-[#0f1016]">{c.processTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px]" style={{ backgroundColor: "rgba(0,0,0,0.07)" }}>
            {c.processSteps.map((step) => (
              <div key={step.num} className="p-10" style={{ backgroundColor: bgCardAlt }}>
                <div className="font-display text-[3.5rem] leading-none mb-6" style={{ color: "rgba(59,130,246,0.30)" }}>{step.num}</div>
                <h3 className="font-display text-[1.15rem] tracking-[0.08em] mb-4 text-[#0f1016]">{step.title}</h3>
                <p className="text-[0.82rem] leading-[1.8] text-[rgba(15,16,22,0.45)]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SAFETY ── */}
      <section className="py-28 px-6 lg:px-12 border-b" style={{ backgroundColor: bgBase, borderColor: "rgba(0,0,0,0.07)" }}>
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
          <div>
            <span className="text-[0.68rem] tracking-[0.28em] uppercase block mb-4" style={{ color: blue }}>
              {lang === "ru" ? "Безопасность" : "Safety"}
            </span>
            <h2 className="font-display text-[clamp(2.5rem,4vw,4rem)] leading-[0.95] tracking-[0.02em] mb-8 text-[#0f1016]">{c.safetyTitle}</h2>
            <div className="w-10 h-[2px] mb-8" style={{ backgroundColor: blue }} />
            <p className="text-[0.9rem] leading-[1.9] text-[rgba(15,16,22,0.5)] mb-5">{c.safetyBody1}</p>
            <p className="text-[0.9rem] leading-[1.9] text-[rgba(15,16,22,0.5)]">{c.safetyBody2}</p>
          </div>
          <div className="flex flex-col gap-[1px]" style={{ backgroundColor: "rgba(0,0,0,0.07)" }}>
            {c.safetyPoints.map((point) => (
              <div key={point} className="flex items-start gap-5 p-7" style={{ backgroundColor: bgCard }}>
                <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center mt-[2px]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={blue} strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <p className="text-[0.88rem] leading-[1.7] text-[rgba(15,16,22,0.6)]">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-28 px-6 lg:px-12 border-b" style={{ backgroundColor: bgCard, borderColor: "rgba(0,0,0,0.07)" }}>
        <div className="max-w-[800px] mx-auto">
          <h2 className="font-display text-[clamp(2.5rem,4vw,4rem)] leading-[0.95] tracking-[0.02em] mb-16 text-[#0f1016]">{c.faqTitle}</h2>
          <div className="flex flex-col gap-[1px]" style={{ backgroundColor: "rgba(0,0,0,0.07)" }}>
            {c.faqs.map((faq) => (
              <div key={faq.q} className="px-10 py-8" style={{ backgroundColor: bgCard }}>
                <h3 className="font-display text-[1.15rem] tracking-[0.05em] text-[#0f1016] mb-3">{faq.q}</h3>
                <p className="text-[0.88rem] leading-[1.8] text-[rgba(15,16,22,0.5)]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 px-6 lg:px-12 relative overflow-hidden" style={{ backgroundColor: "#c9a84c" }}>
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "120px" }} />
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-[0.95] text-[#080808]">{c.ctaBanner}</h2>
            <p className="text-[0.9rem] text-[rgba(8,8,8,0.65)] mt-3">{c.ctaBannerSub}</p>
          </div>
          <a
            href="#book-kids"
            className="flex-shrink-0 bg-[#0f1016] text-[#f0eeea] font-display text-[1.1rem] tracking-[0.15em] px-10 py-5 no-underline transition-colors duration-200 hover:bg-[#1a1a1a] whitespace-nowrap inline-flex items-center gap-3 group"
          >
            {c.ctaBtn}
            <svg className="transition-transform duration-200 group-hover:translate-x-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
        </div>
      </section>

      {/* ── BOOKING ── */}
      <section id="book-kids" className="py-28 px-6 lg:px-12 border-t" style={{ backgroundColor: "#07091e", borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-20 items-start">
          <div>
            <span className="text-[0.68rem] tracking-[0.28em] uppercase block mb-4" style={{ color: blue }}>{tx.booking.eyebrow}</span>
            <h2 className="font-display text-[clamp(3rem,5vw,5rem)] leading-[0.95] tracking-[0.02em] text-[#f0eeea]">
              {c.bookTitle}
              <em className="font-['Playfair_Display'] not-italic italic text-[0.7em] text-[rgba(240,238,234,0.45)] block mt-1">{c.bookTitleEm}</em>
            </h2>
            <div className="w-10 h-[2px] my-8" style={{ backgroundColor: blue }} />
            <p className="text-[0.9rem] leading-[1.9] text-[rgba(240,238,234,0.5)]">{c.bookIntro}</p>
          </div>
          <BookingForm variant="kids" />
        </div>
      </section>
    </>
  );
}
