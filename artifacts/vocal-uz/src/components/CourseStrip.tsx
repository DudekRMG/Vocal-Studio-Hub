import { Link } from "wouter";
import { useLang } from "@/lib/langContext";
import { t } from "@/lib/i18n";

export type CourseKey = "extreme" | "pop" | "karaoke" | "kids";

const ALL_COURSES: { key: CourseKey; num: string; color: string; path: string }[] = [
  { key: "extreme", num: "01", color: "#e8002d", path: "/extreme" },
  { key: "pop",     num: "02", color: "#9d4edd", path: "/pop"     },
  { key: "karaoke", num: "03", color: "#c9a84c", path: "/karaoke" },
  { key: "kids",    num: "04", color: "#3b82f6", path: "/kids"    },
];

interface CourseStripProps {
  exclude?: CourseKey;
  isLight?: boolean;
}

export function CourseStrip({ exclude, isLight }: CourseStripProps) {
  const { lang } = useLang();
  const tx = t[lang];
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  const courses = exclude ? ALL_COURSES.filter((c) => c.key !== exclude) : ALL_COURSES;
  const count = courses.length;

  const titles: Record<CourseKey, string> = {
    extreme: tx.nav.extreme,
    pop:     tx.nav.pop,
    karaoke: tx.nav.karaoke,
    kids:    tx.nav.kids,
  };

  const borderColor = isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.06)";
  const hoverBg    = isLight ? "rgba(0,0,0,0.03)"   : "rgba(255,255,255,0.035)";
  const titleColor = isLight ? "rgba(15,16,22,0.88)" : "rgba(240,238,234,0.88)";
  const descColor  = isLight ? "rgba(15,16,22,0.40)" : "rgba(240,238,234,0.40)";
  const bg         = isLight ? "#f4f7fc"              : "#0d0d0d";

  const gridClass =
    count === 4
      ? "grid-cols-2 md:grid-cols-4"
      : count === 3
      ? "grid-cols-2 md:grid-cols-3"
      : count === 2
      ? "grid-cols-2"
      : "grid-cols-1";

  return (
    <div
      className={`grid gap-[1px] border-t ${gridClass}`}
      style={{ borderColor, backgroundColor: borderColor }}
    >
      {courses.map((c, i) => {
        const desc = tx.hero.stripDescs[ALL_COURSES.findIndex((a) => a.key === c.key)];
        const isLastOf3 = count === 3 && i === 2;
        return (
          <Link
            key={c.key}
            href={`${base}${c.path}#hero-bottom`}
            className={`px-5 pt-4 pb-5 md:pt-5 md:pb-6 no-underline group transition-all duration-300${isLastOf3 ? " col-span-2 md:col-span-1" : ""}`}
            style={{ backgroundColor: bg }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverBg)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = bg)}
          >
            <div className="text-[0.54rem] tracking-[0.28em] mb-2 font-display" style={{ color: c.color }}>
              {c.num}
            </div>
            <div className="text-[0.88rem] font-bold mb-2 leading-[1.45] transition-colors duration-200" style={{ color: titleColor }}>
              {titles[c.key]}
            </div>
            <div className="text-[0.75rem] leading-relaxed" style={{ color: descColor }}>
              {desc}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
