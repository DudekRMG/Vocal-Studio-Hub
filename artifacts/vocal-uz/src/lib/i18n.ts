export type Lang = "ru" | "en";

export function detectLanguage(): Lang {
  const nav = navigator.language || (navigator as any).userLanguage || "";
  if (nav.toLowerCase().startsWith("en")) return "en";
  return "ru";
}

export const t = {
  ru: {
    nav: {
      home: "Главная",
      extreme: "Экстремальный вокал",
      pop: "Поп-вокал",
      karaoke: "Экспресс-Карaoке",
      book: "Записаться",
    },
    hero: {
      tagLeft: "Экстремальный вокал",
      titleLeft1: "Сила",
      titleLeft2: "и техника",
      descLeft:
        "Гроул, скрим, фрай — освойте технику экстремального вокала без вреда для голоса. Научитесь петь тяжёлую музыку правильно.",
      tagRight: "Поп-вокал",
      titleRight1: "Голос",
      titleRight2: "как инструмент",
      descRight:
        "Работа над тембром, диапазоном и артикуляцией. Научитесь петь чисто, уверенно и выразительно.",
      brand: "VOCAL",
      brandDot: ".",
      brandUz: "UZ",
      teacher: "Дария Свиридова",
      ctaBook: "Записаться на пробный урок",
      ctaLearn: "Узнать больше",
    },
    disciplines: {
      eyebrow: "Направления",
      title: "Три курса,",
      titleEm: "один голос",
      extremeTag: "Экстремальный вокал",
      extremeTitle: "Гроул. Скрим. Фрай.",
      extremeBody:
        "Экстремальный вокал — это не просто крик. Это техника, которой можно научиться безопасно. Уроки строятся на физиологии голосового аппарата: резонаторы, дыхание, положение гортани.",
      extremeList: [
        "Гроул и дэт-гроул",
        "Скрим и блэк-скрим",
        "Фрай и вокал-фрай",
        "Пигги и другие техники",
        "Безопасная постановка голоса",
      ],
      extremeCta: "Подробнее об экстремальном вокале",
      popTag: "Поп-вокал",
      popTitle: "Чисто. Уверенно. Выразительно.",
      popBody:
        "Поп-вокал — это основа, на которой строится всё. Работа с дыханием, опорой, резонаторами и тембром. Подойдёт как начинающим, так и тем, кто хочет отшлифовать технику.",
      popList: [
        "Постановка певческого дыхания",
        "Расширение диапазона",
        "Работа с микрофоном",
        "Стилистика и подача",
        "Запись и работа в студии",
      ],
      popCta: "Подробнее о поп-вокале",
      karaokeTag: "Экспресс-курс · 12 уроков",
      karaokeTitle: "Пой уже сегодня.",
      karaokeBody:
        "Интенсивный курс для тех, кто хочет быстро освоить основы и выйти на любительский уровень. 12 уроков — от нуля до первого выступления в карaoке.",
      karaokeList: [
        "Дыхание и опора с первого урока",
        "Интонация и чистота звука",
        "Работа с микрофоном",
        "Сценическая уверенность",
        "Готовность к карaoке",
      ],
      karaokeCta: "Подробнее о курсе",
    },
    about: {
      eyebrow: "Преподаватель",
      title: "Дария",
      titleEm: "Свиридова",
      bio1:
        "Вокалистка, педагог и автор методики безопасного экстремального вокала. Более 10 лет на сцене и 7 лет педагогической практики.",
      bio2:
        "Специализируется на постановке голоса для тяжёлой музыки и поп-вокале. Каждый ученик получает индивидуальный подход и чёткое понимание того, что происходит с голосом.",
      bio3:
        "Работала с вокалистами групп, выступавших на крупных площадках СНГ. Авторская программа сочетает классические вокальные техники с современными подходами к экстремальному вокалу.",
      stat1: "10+",
      stat1Label: "лет на сцене",
      stat2: "7+",
      stat2Label: "лет педагогики",
      stat3: "200+",
      stat3Label: "учеников",
      cta: "Записаться к Дарии",
    },
    booking: {
      eyebrow: "Запись",
      title: "Начните",
      titleEm: "сегодня",
      intro1:
        "Первый урок — пробный. Это знакомство с вашим голосом, целями и уровнем подготовки. Никакого давления, только честная обратная связь.",
      intro2:
        "После пробного урока вы получите персональный план занятий и понимание, чего ожидать от обучения.",
      perks: [
        "Пробный урок без обязательств",
        "Индивидуальная программа",
        "Онлайн и офлайн форматы",
        "Гибкое расписание",
      ],
      namePlaceholder: "Ваше имя",
      phonePlaceholder: "Телефон или Telegram",
      emailPlaceholder: "Email (необязательно)",
      goalPlaceholder: "Выберите направление",
      goalOptions: [
        { value: "extreme", label: "Экстремальный вокал" },
        { value: "pop", label: "Поп-вокал" },
        { value: "karaoke", label: "Экспресс-карaoке (12 уроков)" },
        { value: "both", label: "Несколько направлений" },
        { value: "other", label: "Другое" },
      ],
      messagePlaceholder: "Расскажите о себе (необязательно)",
      submit: "Отправить заявку",
      submitting: "Отправляем...",
      note: "Отвечаем в течение 24 часов",
      successTitle: "Заявка отправлена!",
      successMsg: "Мы свяжемся с вами в ближайшее время.",
      errorMsg: "Не удалось отправить. Попробуйте ещё раз.",
    },
    footer: {
      tagline: "Ваш голос — ваш инструмент",
      phone: "+998 33 862-25-89",
      rights: "Все права защищены",
    },
    seo: {
      home: {
        title: "Vocal.uz — Уроки вокала в Ташкенте | Дария Свиридова",
        description:
          "Уроки экстремального вокала, поп-вокала и экспресс-карaoке в Ташкенте. Авторская методика безопасной постановки голоса. Запишитесь на пробный урок.",
      },
      extreme: {
        title: "Экстремальный вокал — Vocal.uz | Гроул, Скрим, Фрай",
        description:
          "Обучение экстремальному вокалу: гроул, скрим, фрай, блэк-скрим. Безопасная постановка голоса. Запишитесь на урок в Ташкенте.",
      },
      pop: {
        title: "Поп-вокал — Vocal.uz | Уроки вокала в Ташкенте",
        description:
          "Уроки поп-вокала в Ташкенте: постановка дыхания, расширение диапазона, работа с микрофоном. Для начинающих и продолжающих.",
      },
      karaoke: {
        title: "Экспресс-карaoке — Vocal.uz | 12 уроков с нуля до сцены",
        description:
          "Интенсивный курс вокала для начинающих: 12 уроков, дыхание, интонация, микрофон и уверенность на сцене. Запишитесь в Ташкенте.",
      },
    },
  },
  en: {
    nav: {
      home: "Home",
      extreme: "Extreme Vocals",
      pop: "Pop Vocals",
      karaoke: "Express Karaoke",
      book: "Book a Lesson",
    },
    hero: {
      tagLeft: "Extreme Vocals",
      titleLeft1: "Power",
      titleLeft2: "& Technique",
      descLeft:
        "Growl, scream, fry — master extreme vocal techniques without damaging your voice. Learn to sing heavy music the right way.",
      tagRight: "Pop Vocals",
      titleRight1: "Voice",
      titleRight2: "as an Instrument",
      descRight:
        "Work on tone, range, and articulation. Learn to sing cleanly, confidently, and expressively.",
      brand: "VOCAL",
      brandDot: ".",
      brandUz: "UZ",
      teacher: "Dariya Sviridova",
      ctaBook: "Book a Trial Lesson",
      ctaLearn: "Learn More",
    },
    disciplines: {
      eyebrow: "Disciplines",
      title: "Three Courses,",
      titleEm: "One Voice",
      extremeTag: "Extreme Vocals",
      extremeTitle: "Growl. Scream. Fry.",
      extremeBody:
        "Extreme vocals are not just screaming. It is a technique that can be learned safely. Lessons are built on vocal physiology: resonators, breathing, laryngeal positioning.",
      extremeList: [
        "Growl and death growl",
        "Scream and black metal scream",
        "Fry and vocal fry",
        "Piggy and other techniques",
        "Safe voice placement",
      ],
      extremeCta: "More about extreme vocals",
      popTag: "Pop Vocals",
      popTitle: "Clean. Confident. Expressive.",
      popBody:
        "Pop vocals are the foundation everything else is built on. Work on breathing, support, resonators, and tone. Suitable for beginners and those looking to refine their technique.",
      popList: [
        "Singing breath placement",
        "Range expansion",
        "Microphone technique",
        "Style and performance",
        "Recording and studio work",
      ],
      popCta: "More about pop vocals",
      karaokeTag: "Express Course · 12 Lessons",
      karaokeTitle: "Sing Today.",
      karaokeBody:
        "An intensive course for those who want to master the basics fast and reach amateur level. 12 lessons — from zero to your first karaoke performance.",
      karaokeList: [
        "Breathing and support from lesson one",
        "Intonation and clean tone",
        "Microphone technique",
        "Stage confidence",
        "Karaoke-ready performance",
      ],
      karaokeCta: "More about the course",
    },
    about: {
      eyebrow: "Your Teacher",
      title: "Dariya",
      titleEm: "Sviridova",
      bio1:
        "Vocalist, teacher and author of a safe extreme vocal method. Over 10 years on stage and 7 years of teaching experience.",
      bio2:
        "Specialises in voice placement for heavy music and pop vocals. Every student receives an individual approach and a clear understanding of what is happening to their voice.",
      bio3:
        "Has worked with vocalists of bands that performed at major venues across the CIS. The original programme combines classical vocal techniques with modern approaches to extreme vocals.",
      stat1: "10+",
      stat1Label: "years on stage",
      stat2: "7+",
      stat2Label: "years teaching",
      stat3: "200+",
      stat3Label: "students",
      cta: "Book with Dariya",
    },
    booking: {
      eyebrow: "Book a Lesson",
      title: "Start",
      titleEm: "Today",
      intro1:
        "The first lesson is a trial. It is a chance to get to know your voice, your goals, and your level. No pressure — just honest feedback.",
      intro2:
        "After the trial lesson you will receive a personalised study plan and a clear picture of what to expect from training.",
      perks: [
        "Trial lesson with no commitment",
        "Individual programme",
        "Online and offline formats",
        "Flexible schedule",
      ],
      namePlaceholder: "Your name",
      phonePlaceholder: "Phone or Telegram",
      emailPlaceholder: "Email (optional)",
      goalPlaceholder: "Choose a discipline",
      goalOptions: [
        { value: "extreme", label: "Extreme Vocals" },
        { value: "pop", label: "Pop Vocals" },
        { value: "karaoke", label: "Express Karaoke (12 lessons)" },
        { value: "both", label: "Multiple disciplines" },
        { value: "other", label: "Other" },
      ],
      messagePlaceholder: "Tell us about yourself (optional)",
      submit: "Send Inquiry",
      submitting: "Sending...",
      note: "We respond within 24 hours",
      successTitle: "Inquiry sent!",
      successMsg: "We will get in touch with you shortly.",
      errorMsg: "Failed to send. Please try again.",
    },
    footer: {
      tagline: "Your voice is your instrument",
      phone: "+998 33 862-25-89",
      rights: "All rights reserved",
    },
    seo: {
      home: {
        title: "Vocal.uz — Singing Lessons in Tashkent | Dariya Sviridova",
        description:
          "Extreme vocal, pop vocal, and express karaoke lessons in Tashkent. Safe voice placement method. Book a trial lesson today.",
      },
      extreme: {
        title: "Extreme Vocals — Vocal.uz | Growl, Scream, Fry Lessons",
        description:
          "Extreme vocal training: growl, scream, fry, black metal vocals. Safe technique. Book a lesson in Tashkent.",
      },
      pop: {
        title: "Pop Vocals — Vocal.uz | Singing Lessons in Tashkent",
        description:
          "Pop vocal lessons in Tashkent: breath placement, range expansion, microphone technique. For beginners and advanced singers.",
      },
      karaoke: {
        title: "Express Karaoke Course — Vocal.uz | 12 Lessons from Zero to Stage",
        description:
          "Intensive vocal course for beginners: 12 lessons covering breathing, intonation, microphone technique and stage confidence. Book in Tashkent.",
      },
    },
  },
};
