import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useLang } from "@/lib/langContext";
import { t } from "@/lib/i18n";

export function Nav() {
  const { lang, setLang } = useLang();
  const tx = t[lang];
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  const isKids = location === "/kids";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-6 lg:px-12 py-5 transition-all duration-300 ${
        isKids
          ? "bg-[rgba(21,36,68,0.97)] border-b border-white/[0.1] backdrop-blur-[8px]"
          : scrolled ? "bg-[rgba(8,8,8,0.92)] border-b border-white/[0.08] backdrop-blur-[8px]" : "border-b border-transparent"
      }`}
    >
      <Link href={`${base}/`} className="flex-shrink-0">
        <img src="/logo.png" alt="Vocal.uz" className="h-9 w-auto" />
      </Link>

      <div className="hidden md:flex items-center gap-8">
        <ul className="flex gap-8 list-none m-0 p-0 items-center">
          <li>
            <Link
              href={`${base}/`}
              className={`text-[0.72rem] tracking-[0.14em] uppercase no-underline transition-colors duration-200 ${location === "/" ? "text-[#f0eeea]" : "text-[#888] hover:text-[#f0eeea]"}`}
            >
              {tx.nav.home}
            </Link>
          </li>
          <li>
            <Link
              href={`${base}/extreme`}
              className={`text-[0.72rem] tracking-[0.14em] uppercase no-underline transition-colors duration-200 ${location === "/extreme" ? "text-[#f0eeea]" : "text-[#888] hover:text-[#f0eeea]"}`}
            >
              {tx.nav.extreme}
            </Link>
          </li>
          <li>
            <Link
              href={`${base}/pop`}
              className={`text-[0.72rem] tracking-[0.14em] uppercase no-underline transition-colors duration-200 ${location === "/pop" ? "text-[#f0eeea]" : "text-[#888] hover:text-[#f0eeea]"}`}
            >
              {tx.nav.pop}
            </Link>
          </li>
          <li>
            <Link
              href={`${base}/karaoke`}
              className={`text-[0.72rem] tracking-[0.14em] uppercase no-underline transition-colors duration-200 ${location === "/karaoke" ? "text-[#c9a84c]" : "text-[#888] hover:text-[#c9a84c]"}`}
            >
              {tx.nav.karaoke}
            </Link>
          </li>
          <li>
            <Link
              href={`${base}/kids`}
              className={`text-[0.72rem] tracking-[0.14em] uppercase no-underline transition-colors duration-200 ${location === "/kids" ? "text-[#3b82f6]" : "text-[#888] hover:text-[#3b82f6]"}`}
            >
              {tx.nav.kids}
            </Link>
          </li>
        </ul>

        <div className="flex items-center border border-white/[0.08] overflow-hidden">
          <button
            onClick={() => setLang("ru")}
            className={`font-display text-[0.85rem] tracking-[0.12em] px-3 py-[0.45rem] border-none cursor-pointer transition-all duration-200 ${
              lang === "ru" ? "bg-[#f0eeea] text-[#080808]" : "bg-transparent text-[#555] hover:text-[#f0eeea]"
            }`}
          >
            RU
          </button>
          <button
            onClick={() => setLang("en")}
            className={`font-display text-[0.85rem] tracking-[0.12em] px-3 py-[0.45rem] border-none cursor-pointer transition-all duration-200 ${
              lang === "en" ? "bg-[#f0eeea] text-[#080808]" : "bg-transparent text-[#555] hover:text-[#f0eeea]"
            }`}
          >
            EN
          </button>
        </div>

        <Link
          href={`${base}/#booking`}
          className="text-[0.72rem] tracking-[0.14em] uppercase bg-[#e8002d] text-[#f0eeea] px-5 py-[0.65rem] no-underline transition-colors duration-200 hover:bg-[#ff1a3d] whitespace-nowrap"
        >
          {tx.nav.book}
        </Link>
      </div>

      {/* Mobile */}
      <div className="flex md:hidden items-center gap-3">
        <div className="flex items-center border border-white/[0.08] overflow-hidden">
          <button
            onClick={() => setLang("ru")}
            className={`font-display text-[0.85rem] tracking-[0.12em] px-2 py-1 border-none cursor-pointer transition-all duration-200 ${
              lang === "ru" ? "bg-[#f0eeea] text-[#080808]" : "bg-transparent text-[#555]"
            }`}
          >
            RU
          </button>
          <button
            onClick={() => setLang("en")}
            className={`font-display text-[0.85rem] tracking-[0.12em] px-2 py-1 border-none cursor-pointer transition-all duration-200 ${
              lang === "en" ? "bg-[#f0eeea] text-[#080808]" : "bg-transparent text-[#555]"
            }`}
          >
            EN
          </button>
        </div>
        <Link
          href={`${base}/#booking`}
          className="text-[0.65rem] tracking-[0.14em] uppercase bg-[#e8002d] text-[#f0eeea] px-3 py-2 no-underline"
        >
          {tx.nav.book}
        </Link>
      </div>
    </nav>
  );
}
