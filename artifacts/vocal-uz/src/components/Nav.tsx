import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { useLang } from "@/lib/langContext";
import { t } from "@/lib/i18n";

export function Nav() {
  const { lang, setLang } = useLang();
  const tx = t[lang];
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent | TouchEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [menuOpen]);

  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  const isKids = location === "/kids";
  const isPop = location === "/pop";
  const isKaraoke = location === "/karaoke";
  const isExtreme = location === "/extreme";

  const bookingId = isKids
    ? "book-kids"
    : isPop
    ? "book-pop"
    : isKaraoke
    ? "book-karaoke"
    : isExtreme
    ? "book-extreme"
    : "booking";

  const handleBookClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById(bookingId);
    if (el) {
      e.preventDefault();
      const nav = document.querySelector("nav");
      const navH = nav ? (nav as HTMLElement).offsetHeight : 0;
      const top = el.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  const navBookHref = isKids
    ? `${base}/kids#book-kids`
    : isPop
    ? `${base}/pop#book-pop`
    : isKaraoke
    ? `${base}/karaoke#book-karaoke`
    : isExtreme
    ? `${base}/extreme#book-extreme`
    : `${base}/#booking`;

  const navBookStyle: React.CSSProperties = isKids
    ? { background: "#3b82f6", color: "#ffffff", borderColor: "transparent" }
    : isPop
    ? { background: "#9d4edd", color: "#ffffff", borderColor: "transparent" }
    : isKaraoke
    ? { background: "#c9a84c", color: "#080808", borderColor: "transparent" }
    : { background: "#e8002d", color: "#f0eeea", borderColor: "transparent" };

  const barColor = isKids ? "#1a2535" : "#f0eeea";

  const navLinks = [
    { href: `${base}/`, label: tx.nav.home, active: location === "/" },
    { href: `${base}/extreme`, label: tx.nav.extreme, active: isExtreme },
    { href: `${base}/pop`, label: tx.nav.pop, active: isPop },
    { href: `${base}/karaoke`, label: tx.nav.karaoke, active: isKaraoke },
    { href: `${base}/kids`, label: tx.nav.kids, active: isKids },
  ];

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-[200] ${isKids ? "bg-white" : ""}`}
      style={{ transform: "translateZ(0)" }}
    >
      {/* Blur + background on a child div — keeps position:fixed stable on iOS Safari */}
      {!isKids && (
        <div
          className={`absolute inset-0 -z-10 border-b transition-all duration-300 ${
            scrolled
              ? "bg-[rgba(8,8,8,0.92)] backdrop-blur-[8px] border-white/[0.08]"
              : "border-transparent"
          }`}
        />
      )}

      {/* Main header row */}
      <div className="flex items-center justify-between px-6 lg:px-12 py-5">
        <Link href={`${base}/`} className="flex-shrink-0">
          <img src={isKaraoke ? "/logo_yellow.png" : "/logo.png"} alt="Vocal.uz" className="h-9 w-auto" />
        </Link>

        {/* Desktop nav */}
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
                className={`text-[0.72rem] tracking-[0.14em] uppercase no-underline transition-colors duration-200 ${isKids ? "text-[#1a2535]/50 hover:text-[#c9a84c]" : location === "/karaoke" ? "text-[#c9a84c]" : "text-[#888] hover:text-[#c9a84c]"}`}
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
            onClick={handleBookClick}
            className="text-[0.72rem] tracking-[0.14em] uppercase px-5 py-[0.65rem] no-underline transition-opacity duration-200 hover:opacity-85 whitespace-nowrap border"
            style={navBookStyle}
          >
            {tx.nav.book}
          </Link>
        </div>

        {/* Mobile right controls */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href={navBookHref}
            onClick={handleBookClick}
            className="text-[0.65rem] tracking-[0.14em] uppercase px-3 py-2 no-underline transition-opacity duration-200 hover:opacity-85 border whitespace-nowrap"
            style={navBookStyle}
          >
            {tx.nav.book}
          </Link>

          {/* Hamburger button */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex flex-col items-center justify-center w-9 h-9 gap-[5px] bg-transparent border-none cursor-pointer p-2 flex-shrink-0"
            aria-label="Toggle navigation menu"
          >
            <span
              className="block w-5 h-[1.5px] transition-all duration-300 origin-center"
              style={{
                backgroundColor: barColor,
                transform: menuOpen ? "rotate(45deg) translateY(6.5px)" : "none",
              }}
            />
            <span
              className="block w-5 h-[1.5px] transition-all duration-300"
              style={{
                backgroundColor: barColor,
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block w-5 h-[1.5px] transition-all duration-300 origin-center"
              style={{
                backgroundColor: barColor,
                transform: menuOpen ? "rotate(-45deg) translateY(-6.5px)" : "none",
              }}
            />
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}`}
        style={{ borderTop: menuOpen ? `1px solid ${isKids ? "rgba(26,37,53,0.1)" : "rgba(255,255,255,0.06)"}` : "none" }}
      >
        <div className={isKids ? "bg-white" : "bg-[rgba(8,8,8,0.97)] backdrop-blur-[8px]"}>
          <ul className="list-none m-0 p-0">
            {navLinks.map((link, i) => (
              <li
                key={link.href}
                style={{ borderBottom: `1px solid ${isKids ? "rgba(26,37,53,0.07)" : "rgba(255,255,255,0.05)"}` }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-6 py-4 text-right text-[0.72rem] tracking-[0.16em] uppercase no-underline transition-colors duration-200 ${
                    link.active
                      ? isKids ? "text-[#1a2535]" : "text-[#f0eeea]"
                      : isKids ? "text-[#1a2535]/45" : "text-[#666]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          {/* Language switcher inside dropdown — right-aligned to match menu items */}
          <div className="px-6 py-4 flex justify-end">
            <div className={`flex items-center overflow-hidden border w-fit ${isKids ? "border-[#1a2535]" : "border-white/[0.08]"}`}>
              <button
                onClick={() => { setLang("ru"); setMenuOpen(false); }}
                className={`font-display text-[0.85rem] tracking-[0.12em] px-3 py-[0.45rem] border-none cursor-pointer transition-all duration-200 ${
                  lang === "ru"
                    ? isKids ? "bg-[#1a2535] text-white" : "bg-[#f0eeea] text-[#080808]"
                    : isKids ? "bg-transparent text-[#1a2535]/50" : "bg-transparent text-[#555]"
                }`}
              >
                RU
              </button>
              <button
                onClick={() => { setLang("en"); setMenuOpen(false); }}
                className={`font-display text-[0.85rem] tracking-[0.12em] px-3 py-[0.45rem] border-none cursor-pointer transition-all duration-200 ${
                  lang === "en"
                    ? isKids ? "bg-[#1a2535] text-white" : "bg-[#f0eeea] text-[#080808]"
                    : isKids ? "bg-transparent text-[#1a2535]/50" : "bg-transparent text-[#555]"
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
