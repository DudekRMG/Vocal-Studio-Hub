import { useLocation } from "wouter";
import { useLang } from "@/lib/langContext";
import { t } from "@/lib/i18n";

export function Footer() {
  const { lang } = useLang();
  const tx = t[lang];
  const [location] = useLocation();
  const isKids = location === "/kids";
  const isKaraoke = location === "/karaoke";
  const isPop = location === "/pop";

  return (
    <footer className={`${isKids ? "bg-[#1e2d4a] border-t border-white/[0.1]" : "bg-[#080808] border-t border-white/[0.08]"} py-14 px-6 lg:px-12`}>
      <div className="max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          <div>
            <img src={isKaraoke ? "/logo_yellow.png" : isPop ? "/logo_purple.png" : isKids ? "/logo_blue.png" : "/logo.png"} alt="Vocal.uz" className="h-10 w-auto mb-4" />
            <p className="text-[0.82rem] text-[#555] tracking-[0.06em]">{tx.footer.tagline}</p>
          </div>

          <div>
            <p className="text-[0.65rem] tracking-[0.25em] uppercase text-[#555] mb-4">
              {lang === "ru" ? "Контакты" : "Contact"}
            </p>
            <a
              href="tel:+998338622589"
              className="text-[#f0eeea] text-[0.9rem] no-underline hover:text-[#e8002d] transition-colors duration-200 block mb-3"
            >
              {tx.footer.phone}
            </a>
            <div className="flex gap-4 mt-4">
              {[
                { label: "Telegram", path: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" },
                { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                { label: "Facebook", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
              ].map(({ label, path }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 border border-white/[0.08] flex items-center justify-center text-[#555] hover:text-[#f0eeea] hover:border-white/20 transition-all duration-200"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d={path} /></svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[0.65rem] tracking-[0.25em] uppercase text-[#555] mb-4">
              {lang === "ru" ? "Навигация" : "Navigation"}
            </p>
            <ul className="list-none m-0 p-0 flex flex-col gap-2">
              {[
                { href: "/", label: t[lang].nav.home },
                { href: "/extreme", label: t[lang].nav.extreme },
                { href: "/pop", label: t[lang].nav.pop },
                { href: "/karaoke", label: t[lang].nav.karaoke },
                { href: "/kids", label: t[lang].nav.kids },
              ].map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-[0.82rem] text-[#888] no-underline hover:text-[#f0eeea] transition-colors duration-200"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.08] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[0.72rem] text-[#555] tracking-[0.06em]">
            © {new Date().getFullYear()} Vocal.uz. {tx.footer.rights}.
          </p>
          <p className="text-[0.65rem] text-[#333] tracking-[0.08em]">
            vocal.uz
          </p>
        </div>
      </div>
    </footer>
  );
}
