import { useLang } from "@/lib/langContext";
import { t } from "@/lib/i18n";
import { SeoHead } from "@/components/SeoHead";
import { BookingForm } from "@/components/BookingForm";

const karaokeContent = {
  ru: {
    heroTag: "Экспресс-курс · 12 уроков",
    heroTitle: "Пой уже сегодня.",
    heroSub: "С нуля до первого выступления",
    heroDesc:
      "Этот курс создан для тех, кто хочет петь — но не знает, с чего начать. За 12 занятий вы освоите всё необходимое: дыхание, интонацию, работу с микрофоном и уверенность на сцене.",
    whatTitle: "Для кого этот курс?",
    whatBody:
      "Экспресс-карaoке — это не курс для «профессионалов будущего». Это курс для людей, которые хотят петь в удовольствие, уверенно держаться с микрофоном и перестать бояться зрителей.",
    whatBody2:
      "Если вы думаете, что у вас нет слуха, голоса или таланта — вы ошибаетесь. Голос — это навык. И за 12 уроков мы покажем вам это.",
    forWhomTitle: "Кому подойдёт",
    forWhom: [
      {
        icon: "🎤",
        title: "Абсолютным новичкам",
        desc: "Вы никогда не занимались вокалом и хотите начать с нуля. Курс построен именно для этого.",
      },
      {
        icon: "🎶",
        title: "Любителям карaoке",
        desc: "Вы любите петь в компаниях, но хотите делать это увереннее и чище.",
      },
      {
        icon: "🎯",
        title: "Тем, кто хочет быстрый результат",
        desc: "12 уроков — это интенсив. Фокус на практике, а не теории. Каждое занятие — реальный прогресс.",
      },
    ],
    curriculumTitle: "Программа 12 уроков",
    curriculum: [
      {
        num: "01",
        title: "Знакомство с голосом",
        desc: "Диагностика. Разбираемся с вашим голосовым аппаратом: что есть, что развить. Первые звуки.",
      },
      {
        num: "02",
        title: "Дыхание и опора",
        desc: "Диафрагмальное дыхание — основа всего. Учимся дышать певчески с первого занятия.",
      },
      {
        num: "03",
        title: "Резонаторы и тембр",
        desc: "Включаем грудной и головной резонатор. Начинаем работу над своим уникальным тембром.",
      },
      {
        num: "04",
        title: "Интонация",
        desc: "Учимся слышать себя и попадать в ноты. Простые упражнения, которые работают сразу.",
      },
      {
        num: "05",
        title: "Первая песня",
        desc: "Выбираем простую песню по вашему вкусу и начинаем работу над ней. Практика с первой недели.",
      },
      {
        num: "06",
        title: "Артикуляция и дикция",
        desc: "Текст должен быть понятен. Работаем над чёткостью речи и певческой артикуляцией.",
      },
      {
        num: "07",
        title: "Микрофонная техника",
        desc: "Учимся работать с микрофоном: расстояние, динамика, обратная связь. Карaoке — это прежде всего микрофон.",
      },
      {
        num: "08",
        title: "Динамика и нюансировка",
        desc: "Тихо и громко, мягко и жёстко. Учимся управлять динамикой и делать исполнение живым.",
      },
      {
        num: "09",
        title: "Ритм и фраза",
        desc: "Пение — это музыка. Работаем с ритмическим рисунком и вокальной фразировкой.",
      },
      {
        num: "10",
        title: "Стилистика и подача",
        desc: "Добавляем характер. Учимся петь с эмоцией и создавать образ в песне.",
      },
      {
        num: "11",
        title: "Сценическая уверенность",
        desc: "Как держаться перед публикой. Взгляд, поза, жесты — всё, что делает выступление убедительным.",
      },
      {
        num: "12",
        title: "Финальное выступление",
        desc: "Исполняете подготовленную программу. Разбор, обратная связь, план на будущее.",
      },
    ],
    faqTitle: "Часто задаваемые вопросы",
    faqs: [
      {
        q: "Нужен ли музыкальный слух?",
        a: "Нет. Слух — это навык, и он развивается в процессе занятий. Приходите с любым уровнем.",
      },
      {
        q: "Сколько длится один урок?",
        a: "45–60 минут. Оптимальный формат для продуктивной работы без переутомления.",
      },
      {
        q: "Можно ли заниматься онлайн?",
        a: "Да. Онлайн-формат полностью поддерживается. Качество занятий не страдает.",
      },
      {
        q: "Что будет после 12 уроков?",
        a: "Вы сможете уверенно петь на любительском уровне. Если захотите продолжить — перейдёте на курс поп-вокала с индивидуальной программой.",
      },
      {
        q: "Нужно ли что-то покупать для занятий?",
        a: "Нет. Всё необходимое обсуждается на первом занятии. Микрофон не обязателен, но желателен.",
      },
    ],
    ctaBanner: "Готовы начать?",
    ctaBannerSub: "12 уроков — и вы поёте уверенно.",
    ctaBtn: "Записаться на курс",
    bookTitle: "Записаться",
    bookTitleEm: "на экспресс-курс",
    bookIntro:
      "Напишите нам — обсудим расписание, формат и детали курса. Первое занятие — знакомство и диагностика голоса.",
  },
  en: {
    heroTag: "Express Course · 12 Lessons",
    heroTitle: "Sing Today.",
    heroSub: "From zero to your first performance",
    heroDesc:
      "This course is built for people who want to sing but do not know where to start. In 12 lessons you will master everything you need: breathing, intonation, microphone technique, and stage confidence.",
    whatTitle: "Who is this course for?",
    whatBody:
      "Express Karaoke is not a course for future professionals. It is a course for people who want to sing with pleasure, handle a microphone with confidence, and stop being afraid of an audience.",
    whatBody2:
      "If you think you have no ear, no voice, or no talent — you are wrong. Voice is a skill. And in 12 lessons we will prove that to you.",
    forWhomTitle: "Who it is for",
    forWhom: [
      {
        icon: "🎤",
        title: "Complete Beginners",
        desc: "You have never done any vocal training and want to start from scratch. This course is built exactly for that.",
      },
      {
        icon: "🎶",
        title: "Karaoke Lovers",
        desc: "You love singing in company but want to do it more confidently and with a cleaner tone.",
      },
      {
        icon: "🎯",
        title: "Fast Results Seekers",
        desc: "12 lessons is an intensive. The focus is on practice, not theory. Every lesson brings real progress.",
      },
    ],
    curriculumTitle: "12-Lesson Programme",
    curriculum: [
      {
        num: "01",
        title: "Voice Assessment",
        desc: "Diagnosis. We examine your vocal apparatus — what is there, what to develop. First sounds.",
      },
      {
        num: "02",
        title: "Breathing and Support",
        desc: "Diaphragmatic breathing is the foundation of everything. We start singing breath placement from lesson one.",
      },
      {
        num: "03",
        title: "Resonators and Timbre",
        desc: "We engage chest and head resonators. We begin building your unique vocal tone.",
      },
      {
        num: "04",
        title: "Intonation",
        desc: "Learning to hear yourself and hit the notes. Simple exercises that deliver results immediately.",
      },
      {
        num: "05",
        title: "First Song",
        desc: "We choose a simple song you like and begin working on it. Practical performance from week one.",
      },
      {
        num: "06",
        title: "Articulation and Diction",
        desc: "Lyrics must be understood. We work on speech clarity and singing articulation.",
      },
      {
        num: "07",
        title: "Microphone Technique",
        desc: "Learning to work with a microphone: distance, dynamics, feedback. Karaoke is first and foremost a microphone.",
      },
      {
        num: "08",
        title: "Dynamics and Nuance",
        desc: "Soft and loud, gentle and powerful. Learning to control dynamics and make a performance feel alive.",
      },
      {
        num: "09",
        title: "Rhythm and Phrasing",
        desc: "Singing is music. We work on rhythmic patterns and vocal phrasing.",
      },
      {
        num: "10",
        title: "Style and Delivery",
        desc: "Adding character. Learning to sing with emotion and build a persona within a song.",
      },
      {
        num: "11",
        title: "Stage Confidence",
        desc: "How to carry yourself in front of an audience. Eye contact, posture, gesture — everything that makes a performance convincing.",
      },
      {
        num: "12",
        title: "Final Performance",
        desc: "You perform your prepared programme. Debrief, feedback, and a plan for the future.",
      },
    ],
    faqTitle: "Frequently Asked Questions",
    faqs: [
      {
        q: "Do I need a musical ear?",
        a: "No. Ear is a skill and it develops through lessons. Come at any level.",
      },
      {
        q: "How long is each lesson?",
        a: "45–60 minutes. The optimal format for productive work without fatigue.",
      },
      {
        q: "Can I take lessons online?",
        a: "Yes. Online format is fully supported. Lesson quality does not suffer.",
      },
      {
        q: "What happens after 12 lessons?",
        a: "You will be able to sing confidently at an amateur level. If you want to continue, you move on to the pop vocal course with an individual programme.",
      },
      {
        q: "Do I need to buy anything?",
        a: "No. Everything is discussed in the first lesson. A microphone is not required but is recommended.",
      },
    ],
    ctaBanner: "Ready to start?",
    ctaBannerSub: "12 lessons — and you sing with confidence.",
    ctaBtn: "Enrol in the Course",
    bookTitle: "Enrol",
    bookTitleEm: "in Express Karaoke",
    bookIntro:
      "Write to us — we will discuss the schedule, format, and course details. The first lesson is an introduction and voice assessment.",
  },
};

export default function KaraokeCourse() {
  const { lang } = useLang();
  const tx = t[lang];
  const c = karaokeContent[lang];

  const gold = "#c9a84c";
  const goldDim = "rgba(201,168,76,0.08)";
  const goldFaint = "rgba(201,168,76,0.06)";

  return (
    <>
      <SeoHead
        title={tx.seo.karaoke.title}
        description={tx.seo.karaoke.description}
        lang={lang}
        canonical="https://vocal.uz/karaoke"
      />

      {/* ── HERO ── */}
      <section className="min-h-[70vh] flex flex-col justify-end px-6 lg:px-12 pt-36 pb-20 bg-[#080808] relative overflow-hidden border-b border-white/[0.08]">
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 70% 60% at 20% 60%, ${goldDim} 0%, transparent 70%)` }} />
        <div
          className="absolute top-1/2 -left-6 -translate-y-1/2 -rotate-90 font-display text-[22vw] pointer-events-none whitespace-nowrap leading-none"
          style={{ color: goldFaint, transformOrigin: "left center" }}
        >
          KARAOKE
        </div>
        <div className="max-w-[1100px] mx-auto w-full">
          <span className="text-[0.68rem] tracking-[0.28em] uppercase block mb-5" style={{ color: gold }}>{c.heroTag}</span>
          <h1 className="font-display text-[clamp(4rem,10vw,9rem)] leading-[0.85] tracking-[0.02em] mb-6">{c.heroTitle}</h1>
          <p className="font-['Playfair_Display'] italic text-[clamp(1.2rem,2.5vw,1.8rem)] text-[rgba(240,238,234,0.45)] mb-8 max-w-[500px]">{c.heroSub}</p>
          <p className="text-[0.9rem] leading-[1.9] text-[rgba(240,238,234,0.45)] max-w-[520px] mb-10">{c.heroDesc}</p>
          <a
            href="#book-karaoke"
            className="inline-flex items-center gap-3 text-[#080808] font-display text-[1.1rem] tracking-[0.15em] px-10 py-5 no-underline transition-all duration-200 group"
            style={{ backgroundColor: gold }}
            onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.15)")}
            onMouseLeave={e => (e.currentTarget.style.filter = "")}
          >
            {lang === "ru" ? "Записаться на курс" : "Enrol in Course"}
            <svg className="transition-transform duration-200 group-hover:translate-x-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
        </div>
      </section>

      {/* ── WHAT IS ── */}
      <section className="py-28 px-6 lg:px-12 bg-[#0f0f0f] border-b border-white/[0.08]">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-[0.68rem] tracking-[0.28em] uppercase block mb-4" style={{ color: gold }}>
              {lang === "ru" ? "О курсе" : "About"}
            </span>
            <h2 className="font-display text-[clamp(2.5rem,4vw,4rem)] leading-[0.95] tracking-[0.02em] mb-8">{c.whatTitle}</h2>
            <div className="w-10 h-[2px] mb-8" style={{ backgroundColor: gold }} />
            <p className="text-[0.9rem] leading-[1.9] text-[rgba(240,238,234,0.5)] mb-5">{c.whatBody}</p>
            <p className="text-[0.9rem] leading-[1.9] text-[rgba(240,238,234,0.5)]">{c.whatBody2}</p>
          </div>
          <div className="grid grid-cols-2 gap-[1px] bg-white/[0.08]">
            {[
              lang === "ru" ? "12 уроков" : "12 lessons",
              lang === "ru" ? "С нуля" : "From zero",
              lang === "ru" ? "Любой возраст" : "Any age",
              lang === "ru" ? "Онлайн / Офлайн" : "Online / Offline",
              lang === "ru" ? "Быстрый результат" : "Fast results",
              lang === "ru" ? "Индивидуально" : "Individual approach",
            ].map((item) => (
              <div key={item} className="bg-[#141414] p-6 flex items-center">
                <span className="w-3 h-[1px] mr-4 flex-shrink-0" style={{ backgroundColor: gold }} />
                <span className="text-[0.82rem] text-[rgba(240,238,234,0.6)]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR WHOM ── */}
      <section className="py-28 px-6 lg:px-12 bg-[#080808] border-b border-white/[0.08]">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="font-display text-[clamp(2.5rem,4vw,4rem)] leading-[0.95] tracking-[0.02em] mb-16">{c.forWhomTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-white/[0.08]">
            {c.forWhom.map((item) => (
              <div key={item.title} className="bg-[#080808] p-10 group hover:bg-[#0d0c09] transition-colors duration-300">
                <div className="text-3xl mb-6">{item.icon}</div>
                <h3 className="font-display text-[1.4rem] tracking-[0.05em] mb-4" style={{ color: gold }}>{item.title}</h3>
                <p className="text-[0.85rem] leading-[1.8] text-[rgba(240,238,234,0.45)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CURRICULUM ── */}
      <section className="py-28 px-6 lg:px-12 bg-[#0f0f0f] border-b border-white/[0.08]">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="font-display text-[clamp(2.5rem,4vw,4rem)] leading-[0.95] tracking-[0.02em] mb-16">{c.curriculumTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-white/[0.08]">
            {c.curriculum.map((lesson) => (
              <div key={lesson.num} className="bg-[#0f0f0f] p-8 relative group hover:bg-[#131109] transition-colors duration-300">
                <div
                  className="font-display text-[4rem] leading-none absolute top-4 right-6 pointer-events-none"
                  style={{ color: goldFaint }}
                >
                  {lesson.num}
                </div>
                <div className="font-display text-[0.9rem] tracking-[0.15em] mb-3" style={{ color: gold }}>
                  {lang === "ru" ? `Урок ${lesson.num}` : `Lesson ${lesson.num}`}
                </div>
                <h3 className="font-display text-[1.25rem] tracking-[0.04em] mb-3 text-[#f0eeea]">{lesson.title}</h3>
                <p className="text-[0.82rem] leading-[1.8] text-[rgba(240,238,234,0.45)]">{lesson.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-28 px-6 lg:px-12 bg-[#141414] border-b border-white/[0.08]">
        <div className="max-w-[800px] mx-auto">
          <h2 className="font-display text-[clamp(2.5rem,4vw,4rem)] leading-[0.95] tracking-[0.02em] mb-16">{c.faqTitle}</h2>
          <div className="flex flex-col gap-[1px] bg-white/[0.08]">
            {c.faqs.map((faq) => (
              <div key={faq.q} className="bg-[#141414] px-10 py-8">
                <h3 className="font-display text-[1.15rem] tracking-[0.05em] text-[#f0eeea] mb-3">{faq.q}</h3>
                <p className="text-[0.88rem] leading-[1.8] text-[rgba(240,238,234,0.5)]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 px-6 lg:px-12 relative overflow-hidden" style={{ backgroundColor: gold }}>
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "120px" }} />
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-[0.95] text-[#080808]">{c.ctaBanner}</h2>
            <p className="text-[0.9rem] text-[rgba(8,8,8,0.65)] mt-3">{c.ctaBannerSub}</p>
          </div>
          <a
            href="#book-karaoke"
            className="flex-shrink-0 bg-[#080808] text-[#f0eeea] font-display text-[1.1rem] tracking-[0.15em] px-10 py-5 no-underline transition-colors duration-200 hover:bg-[#1a1a1a] whitespace-nowrap inline-flex items-center gap-3 group"
          >
            {c.ctaBtn}
            <svg className="transition-transform duration-200 group-hover:translate-x-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
        </div>
      </section>

      {/* ── BOOKING ── */}
      <section id="book-karaoke" className="py-28 px-6 lg:px-12 bg-[#141414] border-t border-white/[0.08]">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-20 items-start">
          <div>
            <span className="text-[0.68rem] tracking-[0.28em] uppercase block mb-4" style={{ color: gold }}>{t[lang].booking.eyebrow}</span>
            <h2 className="font-display text-[clamp(3rem,5vw,5rem)] leading-[0.95] tracking-[0.02em]">
              {c.bookTitle}
              <em className="font-['Playfair_Display'] not-italic italic text-[0.7em] text-[rgba(240,238,234,0.45)] block mt-1">{c.bookTitleEm}</em>
            </h2>
            <div className="w-10 h-[2px] my-8" style={{ backgroundColor: gold }} />
            <p className="text-[0.9rem] leading-[1.9] text-[rgba(240,238,234,0.5)]">{c.bookIntro}</p>
          </div>
          <BookingForm />
        </div>
      </section>
    </>
  );
}
