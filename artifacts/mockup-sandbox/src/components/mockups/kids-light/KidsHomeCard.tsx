const accent = "#1d4ed8";
const accentGlow = "rgba(29,78,216,0.06)";
const indigo = "#5b45e0";
const bg = "#faf8f4";
const cardBg = "#ffffff";
const border = "rgba(0,0,0,0.07)";
const textPrimary = "#16161a";
const textMuted = "rgba(22,22,26,0.5)";

export function KidsHomeCard() {
  const items = [
    "Полностью индивидуальная программа",
    "Обучение через интерес ребёнка",
    "Безопасные техники для каждого возраста",
    "Поп, рок и другие стили — по желанию",
    "Опытный педагог с детьми",
  ];

  return (
    <div style={{ background: bg, padding: "0", fontFamily: "'DM Sans', sans-serif" }}>
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          backgroundColor: cardBg,
          borderBottom: `1px solid ${border}`,
          transition: "background-color 0.3s",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 50% 80% at 80% 50%, ${accentGlow} 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "2rem",
            transform: "translateY(-50%)",
            fontFamily: "'Bebas Neue', 'Oswald', sans-serif",
            fontSize: "10rem",
            lineHeight: 1,
            color: "rgba(29,78,216,0.04)",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          04
        </div>

        <div
          style={{
            padding: "3rem 2.5rem",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "2.5rem",
            alignItems: "center",
            position: "relative",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "1rem",
                color: accent,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Вокал для детей · 5–16 лет
            </span>
            <h3
              style={{
                fontFamily: "'Bebas Neue', 'Oswald', sans-serif",
                fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
                letterSpacing: "0.03em",
                lineHeight: 0.95,
                marginBottom: "1.2rem",
                color: textPrimary,
              }}
            >
              Голос начинается здесь.
            </h3>
            <p
              style={{
                fontSize: "0.88rem",
                lineHeight: 1.9,
                color: textMuted,
                maxWidth: "560px",
                marginBottom: "1.8rem",
              }}
            >
              Индивидуальная программа для каждого ребёнка. Педагог находит подход, опирается на интересы ученика и выстраивает обучение по его возможностям и темпу. Безопасно, интересно, с реальным результатом.
            </p>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap", gap: "0.6rem 2.5rem" }}>
              {items.map((item) => (
                <li key={item} style={{ fontSize: "0.78rem", color: textMuted, display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ width: "1rem", height: "1px", flexShrink: 0, backgroundColor: accent, display: "inline-block" }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <a
            href="#"
            style={{
              flexShrink: 0,
              fontSize: "0.72rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              color: accent,
              alignSelf: "center",
              fontFamily: "'DM Sans', sans-serif",
              whiteSpace: "nowrap",
            }}
          >
            Подробнее о детском вокале
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
        </div>
      </div>
    </div>
  );
}
