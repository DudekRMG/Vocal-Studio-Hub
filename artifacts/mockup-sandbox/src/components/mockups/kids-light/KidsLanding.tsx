const accent = "#1d4ed8";
const accentLight = "rgba(29,78,216,0.07)";
const accentFaint = "rgba(29,78,216,0.04)";
const indigo = "#5b45e0";
const bg = "#faf8f4";
const cardBg = "#ffffff";
const cardAlt = "#f5f2eb";
const border = "rgba(0,0,0,0.07)";
const textPrimary = "#16161a";
const textSec = "#6b6560";
const textMuted = "rgba(22,22,26,0.44)";
const gold = "#c9a84c";

const c = {
  heroTag: "Вокал для детей · 5–16 лет",
  heroTitle: "Голос начинается здесь.",
  heroSub: "Индивидуально. Безопасно. Интересно.",
  heroDesc:
    "Каждый ребёнок уникален. Именно поэтому здесь нет шаблонных программ — только индивидуальный подход, интерес ребёнка в основе обучения и техники, безопасные для растущего голоса.",

  aboutTitle: "Почему детский вокал — это особый подход?",
  aboutBody1:
    "Голосовой аппарат ребёнка продолжает развиваться до 18–20 лет. Это означает, что техники, безопасные для взрослого, могут быть противопоказаны ребёнку.",
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

  ageGroups: [
    { range: "5–8 лет", label: "Открытие", desc: "В этом возрасте главное — не техника, а интерес. Занятия строятся как игра: ритм, слух, первые песни по вкусу ребёнка. Никакого давления, только радость от голоса.", points: ["Развитие слуха через игру", "Ритм и координация", "Первые простые песни", "Дыхание в игровой форме"] },
    { range: "9–12 лет", label: "Основа", desc: "Самый продуктивный возраст для постановки голоса. Вводим технику — дыхание, резонаторы, интонацию. Стиль выбирает ученик.", points: ["Диафрагмальное дыхание", "Резонаторы и тембр", "Интонация и чистота", "Работа с любимыми песнями"] },
    { range: "13–16 лет", label: "Стиль", desc: "Подросткам интересны реальные стили. Работаем с тем, что нравится — поп, рок, металл. Всё в рамках безопасного для этого возраста.", points: ["Стилистика и подача", "Диапазон и переход голоса", "Экстремальный вокал по запросу", "Уверенность на сцене"] },
  ],

  styles: [
    { name: "Поп-вокал", desc: "Чистый звук, интонация, подача. Самый универсальный старт." },
    { name: "Рок-вокал", desc: "Напор и характер. Работа с динамикой и выразительностью." },
    { name: "Академический вокал", desc: "Классическая постановка — сильнейший фундамент для любого стиля." },
    { name: "Экстремальный вокал", desc: "Для подростков 13+ по желанию. Только безопасные техники." },
    { name: "Эстрада и мюзикл", desc: "Яркая подача, сцена, харизма. Для тех, кто хочет выступать." },
    { name: "Авторский стиль", desc: "Ребёнок хочет петь своё? Помогаем найти уникальный голос." },
  ],

  processSteps: [
    { num: "01", title: "Знакомство и диагностика", desc: "На первом уроке знакомимся с ребёнком и его голосом. Никакого давления — просто разговор, игра и первые звуки." },
    { num: "02", title: "Выясняем интересы", desc: "Что любит слушать? Кем хочет быть? Ответы формируют программу." },
    { num: "03", title: "Индивидуальная программа", desc: "Педагог составляет план под конкретного ребёнка — с учётом возраста, голоса и интересов." },
    { num: "04", title: "Регулярные итоги", desc: "Раз в месяц — краткий отчёт для родителей: прогресс, цели, следующий шаг." },
  ],

  safetyPoints: [
    "Никаких техник, опасных для детских связок",
    "Нагрузка строго по возрасту и развитию",
    "Мутация голоса учитывается и отслеживается",
    "Прозрачность с родителями о ходе занятий",
  ],

  faqs: [
    { q: "С какого возраста можно начинать?", a: "С 5 лет. В этом возрасте занятия носят игровой характер и направлены прежде всего на развитие слуха и ритма." },
    { q: "Безопасно ли это для голоса ребёнка?", a: "Да, при правильном подходе. Занятия выстроены с учётом физиологии детского голосового аппарата." },
    { q: "Можно ли заниматься онлайн?", a: "Да. Для маленьких детей желательно присутствие родителя рядом." },
    { q: "Как быстро будет результат?", a: "Первые заметные изменения — через 4–6 занятий. Темп у каждого свой." },
    { q: "Нужно ли музыкальное образование?", a: "Нет. Мы начинаем с нуля. Нотная грамота не требуется." },
  ],
};

function Divider() {
  return <div style={{ height: "1px", backgroundColor: border, width: "100%" }} />;
}

export function KidsLanding() {
  return (
    <div style={{ background: bg, fontFamily: "'DM Sans', sans-serif", color: textPrimary, minWidth: 0 }}>

      {/* ── HERO ── */}
      <section
        style={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "9rem 3rem 5rem",
          position: "relative",
          overflow: "hidden",
          borderBottom: `1px solid ${border}`,
          backgroundColor: cardBg,
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 70% 60% at 20% 60%, ${accentLight} 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "-1.5rem",
            transform: "translateY(-50%) rotate(-90deg) translateX(-50%)",
            transformOrigin: "left center",
            fontFamily: "'Bebas Neue', 'Oswald', sans-serif",
            fontSize: "22vw",
            lineHeight: 1,
            color: accentFaint,
            pointerEvents: "none",
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        >
          KIDS
        </div>
        <div style={{ maxWidth: "1100px", margin: "0 auto", width: "100%", position: "relative" }}>
          <span style={{ fontSize: "0.68rem", letterSpacing: "0.28em", textTransform: "uppercase", display: "block", marginBottom: "1.2rem", color: accent }}>{c.heroTag}</span>
          <h1 style={{ fontFamily: "'Bebas Neue', 'Oswald', sans-serif", fontSize: "clamp(4rem,10vw,8rem)", lineHeight: 0.88, letterSpacing: "0.02em", marginBottom: "1.5rem", color: textPrimary }}>{c.heroTitle}</h1>
          <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "clamp(1.2rem,2.5vw,1.6rem)", color: textSec, marginBottom: "1.8rem", maxWidth: "480px" }}>{c.heroSub}</p>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.9, color: textMuted, maxWidth: "520px", marginBottom: "2.5rem" }}>{c.heroDesc}</p>
          <a
            href="#"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              backgroundColor: accent,
              color: "#ffffff",
              fontFamily: "'Bebas Neue', 'Oswald', sans-serif",
              fontSize: "1.1rem",
              letterSpacing: "0.15em",
              padding: "1.1rem 2.5rem",
              textDecoration: "none",
            }}
          >
            Записаться на пробный урок
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
        </div>
      </section>

      {/* ── ABOUT THE APPROACH ── */}
      <section style={{ padding: "5rem 3rem", borderBottom: `1px solid ${border}`, backgroundColor: bg }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>
          <div>
            <span style={{ fontSize: "0.68rem", letterSpacing: "0.28em", textTransform: "uppercase", display: "block", marginBottom: "1rem", color: accent }}>О подходе</span>
            <h2 style={{ fontFamily: "'Bebas Neue', 'Oswald', sans-serif", fontSize: "clamp(2.5rem,4vw,3.8rem)", lineHeight: 0.95, letterSpacing: "0.02em", marginBottom: "2rem", color: textPrimary }}>{c.aboutTitle}</h2>
            <div style={{ width: "2.5rem", height: "2px", backgroundColor: accent, marginBottom: "2rem" }} />
            <p style={{ fontSize: "0.9rem", lineHeight: 1.9, color: textSec, marginBottom: "1.2rem" }}>{c.aboutBody1}</p>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.9, color: textSec }}>{c.aboutBody2}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", backgroundColor: border }}>
            {c.aboutFeatures.map((item) => (
              <div key={item} style={{ padding: "1.4rem", display: "flex", alignItems: "center", backgroundColor: cardAlt }}>
                <span style={{ width: "0.75rem", height: "1px", marginRight: "1rem", flexShrink: 0, backgroundColor: accent, display: "inline-block" }} />
                <span style={{ fontSize: "0.82rem", color: textSec }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AGE GROUPS ── */}
      <section style={{ padding: "5rem 3rem", borderBottom: `1px solid ${border}`, backgroundColor: cardBg }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Bebas Neue', 'Oswald', sans-serif", fontSize: "clamp(2.5rem,4vw,3.8rem)", lineHeight: 0.95, letterSpacing: "0.02em", marginBottom: "3.5rem", color: textPrimary }}>Подходы по возрасту</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", backgroundColor: border }}>
            {c.ageGroups.map((group, i) => (
              <div key={group.range} style={{ padding: "2.5rem", position: "relative", backgroundColor: i % 2 === 0 ? cardAlt : cardBg }}>
                <div style={{ fontFamily: "'Bebas Neue', 'Oswald', sans-serif", fontSize: "4rem", lineHeight: 1, position: "absolute", top: "1rem", right: "1.5rem", color: accentFaint, userSelect: "none" }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div style={{ fontFamily: "'Bebas Neue', 'Oswald', sans-serif", fontSize: "0.8rem", letterSpacing: "0.2em", marginBottom: "0.5rem", color: indigo }}>{group.range}</div>
                <h3 style={{ fontFamily: "'Bebas Neue', 'Oswald', sans-serif", fontSize: "1.8rem", letterSpacing: "0.05em", marginBottom: "1rem", color: accent }}>{group.label}</h3>
                <p style={{ fontSize: "0.85rem", lineHeight: 1.8, color: textSec, marginBottom: "1.5rem" }}>{group.desc}</p>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {group.points.map((pt) => (
                    <li key={pt} style={{ fontSize: "0.78rem", color: textMuted, display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span style={{ width: "1rem", height: "1px", flexShrink: 0, backgroundColor: accent, display: "inline-block" }} />
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
      <section style={{ padding: "5rem 3rem", borderBottom: `1px solid ${border}`, backgroundColor: bg }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Bebas Neue', 'Oswald', sans-serif", fontSize: "clamp(2.5rem,4vw,3.8rem)", lineHeight: 0.95, letterSpacing: "0.02em", marginBottom: "1rem", color: textPrimary }}>Что можно изучать</h2>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.9, color: textSec, marginBottom: "3.5rem", maxWidth: "560px" }}>Ребёнок сам решает, что ему интересно. Педагог адаптирует технику под стиль и возраст.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", backgroundColor: border }}>
            {c.styles.map((style, i) => (
              <div key={style.name} style={{ padding: "2.5rem", position: "relative", backgroundColor: cardBg }}>
                <span style={{ fontFamily: "'Bebas Neue', 'Oswald', sans-serif", fontSize: "5rem", lineHeight: 1, position: "absolute", top: "1rem", right: "1.5rem", color: accentFaint, userSelect: "none" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 style={{ fontFamily: "'Bebas Neue', 'Oswald', sans-serif", fontSize: "1.5rem", letterSpacing: "0.05em", marginBottom: "1rem", color: accent }}>{style.name}</h3>
                <p style={{ fontSize: "0.85rem", lineHeight: 1.8, color: textSec }}>{style.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section style={{ padding: "5rem 3rem", borderBottom: `1px solid ${border}`, backgroundColor: cardAlt }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Bebas Neue', 'Oswald', sans-serif", fontSize: "clamp(2.5rem,4vw,3.8rem)", lineHeight: 0.95, letterSpacing: "0.02em", marginBottom: "3.5rem", color: textPrimary }}>Как проходят занятия</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", backgroundColor: border }}>
            {c.processSteps.map((step) => (
              <div key={step.num} style={{ padding: "2.5rem", backgroundColor: cardAlt }}>
                <div style={{ fontFamily: "'Bebas Neue', 'Oswald', sans-serif", fontSize: "3.5rem", lineHeight: 1, marginBottom: "1.5rem", color: "rgba(29,78,216,0.18)" }}>{step.num}</div>
                <h3 style={{ fontFamily: "'Bebas Neue', 'Oswald', sans-serif", fontSize: "1.15rem", letterSpacing: "0.08em", marginBottom: "1rem", color: textPrimary }}>{step.title}</h3>
                <p style={{ fontSize: "0.82rem", lineHeight: 1.8, color: textSec }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SAFETY ── */}
      <section style={{ padding: "5rem 3rem", borderBottom: `1px solid ${border}`, backgroundColor: cardBg }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>
          <div>
            <span style={{ fontSize: "0.68rem", letterSpacing: "0.28em", textTransform: "uppercase", display: "block", marginBottom: "1rem", color: accent }}>Безопасность</span>
            <h2 style={{ fontFamily: "'Bebas Neue', 'Oswald', sans-serif", fontSize: "clamp(2.5rem,4vw,3.8rem)", lineHeight: 0.95, letterSpacing: "0.02em", marginBottom: "2rem", color: textPrimary }}>Безопасность прежде всего</h2>
            <div style={{ width: "2.5rem", height: "2px", backgroundColor: accent, marginBottom: "2rem" }} />
            <p style={{ fontSize: "0.9rem", lineHeight: 1.9, color: textSec, marginBottom: "1.2rem" }}>
              Детский голос — не уменьшенная копия взрослого. Связки, мышцы и резонаторы ребёнка находятся в процессе формирования. Неправильная нагрузка на этом этапе может навредить на годы.
            </p>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.9, color: textSec }}>
              Дария обучалась работе с детскими голосами отдельно и применяет только техники, безопасные для каждой возрастной группы.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px", backgroundColor: border }}>
            {c.safetyPoints.map((point) => (
              <div key={point} style={{ display: "flex", alignItems: "center", gap: "1.2rem", padding: "1.5rem 1.8rem", backgroundColor: bg }}>
                <div style={{ width: "1.25rem", height: "1.25rem", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <span style={{ fontSize: "0.88rem", color: textSec }}>{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "5rem 3rem", borderBottom: `1px solid ${border}`, backgroundColor: bg }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Bebas Neue', 'Oswald', sans-serif", fontSize: "clamp(2.5rem,4vw,3.8rem)", lineHeight: 0.95, letterSpacing: "0.02em", marginBottom: "3.5rem", color: textPrimary }}>Вопросы родителей</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px", backgroundColor: border }}>
            {c.faqs.map((faq) => (
              <div key={faq.q} style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "3rem", padding: "2rem 2.5rem", backgroundColor: cardBg, alignItems: "start" }}>
                <p style={{ fontSize: "0.95rem", fontWeight: 600, color: textPrimary, lineHeight: 1.5 }}>{faq.q}</p>
                <p style={{ fontSize: "0.88rem", lineHeight: 1.8, color: textSec }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ padding: "5rem 3rem", position: "relative", overflow: "hidden", backgroundColor: gold }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.05, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "120px" }} />
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem" }}>
          <div>
            <h2 style={{ fontFamily: "'Bebas Neue', 'Oswald', sans-serif", fontSize: "clamp(2rem,4vw,3.5rem)", lineHeight: 0.95, color: "#16161a" }}>Подарите ребёнку его голос.</h2>
            <p style={{ fontSize: "0.9rem", color: "rgba(22,22,26,0.6)", marginTop: "0.75rem" }}>Первый урок — знакомство. Никакого давления.</p>
          </div>
          <a
            href="#"
            style={{
              flexShrink: 0,
              backgroundColor: "#16161a",
              color: "#faf8f4",
              fontFamily: "'Bebas Neue', 'Oswald', sans-serif",
              fontSize: "1.1rem",
              letterSpacing: "0.15em",
              padding: "1.1rem 2.5rem",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              whiteSpace: "nowrap",
            }}
          >
            Записаться
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
        </div>
      </section>

    </div>
  );
}
