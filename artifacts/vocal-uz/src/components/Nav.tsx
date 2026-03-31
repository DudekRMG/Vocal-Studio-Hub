import React, { useEffect, useState } from "react";
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
  const isPop = location === "/pop";
  const isKaraoke = location === "/karaoke";

  const navBookHref = isKids
    ? `${base}/kids#book-kids`
    : isPop
    ? `${base}/pop#book-pop`
    : isKaraoke
    ? `${base}/karaoke#book-karaoke`
    : `${base}/#booking`;

  const navBookStyle: React.CSSProperties = isKids
    ? { background: "transparent", color: "#1a2535", borderColor: "#1a2535" }
    : isPop
    ? { background: "#9d4edd", color: "#ffffff", borderColor: "transparent" }
    : isKaraoke
    ? { background: "#c9a84c", color: "#080808", borderColor: "transparent" }
    : { background: "#e8002d", color: "#f0eeea", borderColor: "transparent" };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-6 lg:px-12 py-5 transition-all duration-300 ${
        isKids
          ? "bg-white"
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
              className={`text-[0.72rem] tracking-[0.14em] uppercase no-underline transition-colors duration-200 ${isKids ? "text-[#1a2535]/50 hover:text-[#1a2535]" : location === "/" ? "text-[#f0eeea]" : "text-[#888] hover:text-[#f0eeea]"}`}
            >
              {tx.nav.home}
            </Link>
          </li>
          <li>
            <Link
              href={`${base}/extreme`}
              className={`text-[0.72rem] tracking-[0.14em] uppercase no-underline transition-colors duration-200 ${isKids ? "text-[#1a2535]/50 hover:text-[#1a2535]" : location === "/extreme" ? "text-[#f0eeea]" : "text-[#888] hover:text-[#f0eeea]"}`}
            >
              {tx.nav.extreme}
            </Link>
          </li>
          <li>
            <Link
              href={`${base}/pop`}
              className={`text-[0.72rem] tracking-[0.14em] uppercase no-underline transition-colors duration-200 ${isKids ? "text-[#1a2535]/50 hover:text-[#1a2535]" : location === "/pop" ? "text-[#f0eeea]" : "text-[#888] hover:text-[#f0eeea]"}`}
            >
              {tx.nav.pop}
            </Link>
          </li>
          <li>
            <Link
              href={`${base}/karaoke`}
              className={`text-[0.72rem] tracking-[0.14em] uppercase no-underline transition-colors duration-200 ${isKids ? "text-[#1a2535]/50 hover:text-[#1a2535]" : location === "/karaoke" ? "text-[#c9a84c]" : "text-[#888] hover:text-[#c9a84c]"}`}
            >
              {tx.nav.karaoke}
            </Link>
          </li>
          <li>
            <Link
              href={`${base}/kids`}
              className={`text-[0.72rem] tracking-[0.14em] uppercase no-underline transition-colors duration-200 ${location === "/kids" ? (isKids ? "text-[#1a2535] font-semibold" : "text-[#3b82f6]") : "text-[#888] hover:text-[#3b82f6]"}`}
            >
              {tx.nav.kids}
            </Link>
          </li>
        </ul>

        <div className={`flex items-center overflow-hidden border ${isKids ? "border-[#1a2535]" : "border-white/[0.08]"}`}>
          <button
            onClick={() => setLang("ru")}
            className={`font-display text-[0.85rem] tracking-[0.12em] px-3 py-[0.45rem] border-none cursor-pointer transition-all duration-200 ${
              lang === "ru"
                ? isKids ? "bg-[#1a2535] text-white" : "bg-[#f0eeea] text-[#080808]"
                : isKids ? "bg-transparent text-[#1a2535]/50 hover:text-[#1a2535]" : "bg-transparent text-[#555] hover:text-[#f0eeea]"
            }`}
          >
            RU
          </button>
          <button
            onClick={() => setLang("en")}
            className={`font-display text-[0.85rem] tracking-[0.12em] px-3 py-[0.45rem] border-none cursor-pointer transition-all duration-200 ${
              lang === "en"
                ? isKids ? "bg-[#1a2535] text-white" : "bg-[#f0eeea] text-[#080808]"
                : isKids ? "bg-transparent text-[#1a2535]/50 hover:text-[#1a2535]" : "bg-transparent text-[#555] hover:text-[#f0eeea]"
            }`}
          >
            EN
          </button>
        </div>

        <Link
          href={navBookHref}
          className="text-[0.72rem] tracking-[0.14em] uppercase px-5 py-[0.65rem] no-underline transition-opacity duration-200 hover:opacity-85 whitespace-nowrap border"
          style={navBookStyle}
        >
          {tx.nav.book}
        </Link>
      </div>

      {/* Mobile */}
      <div className="flex md:hidden items-center gap-3">
        <div className={`flex items-center overflow-hidden border ${isKids ? "border-[#1a2535]" : "border-white/[0.08]"}`}>
          <button
            onClick={() => setLang("ru")}
            className={`font-display text-[0.85rem] tracking-[0.12em] px-2 py-1 border-none cursor-pointer transition-all duration-200 ${
              lang === "ru"
                ? isKids ? "bg-[#1a2535] text-white" : "bg-[#f0eeea] text-[#080808]"
                : isKids ? "bg-transparent text-[#1a2535]/50" : "bg-transparent text-[#555]"
            }`}
          >
            RU
          </button>
          <button
            onClick={() => setLang("en")}
            className={`font-display text-[0.85rem] tracking-[0.12em] px-2 py-1 border-none cursor-pointer transition-all duration-200 ${
              lang === "en"
                ? isKids ? "bg-[#1a2535] text-white" : "bg-[#f0eeea] text-[#080808]"
                : isKids ? "bg-transparent text-[#1a2535]/50" : "bg-transparent text-[#555]"
            }`}
          >
            EN
          </button>
        </div>
        <Link
          href={navBookHref}
          className="text-[0.65rem] tracking-[0.14em] uppercase px-3 py-2 no-underline transition-opacity duration-200 hover:opacity-85 border"
          style={navBookStyle}
        >
          {tx.nav.book}
        </Link>
      </div>
    </nav>
  );
}
