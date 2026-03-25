import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Lang, detectLanguage } from "./i18n";

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LangContext = createContext<LangContextValue>({ lang: "ru", setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ru");

  useEffect(() => {
    const detected = detectLanguage();
    setLang(detected);
    document.body.dataset.lang = detected;
  }, []);

  const handleSetLang = (l: Lang) => {
    setLang(l);
    document.body.dataset.lang = l;
  };

  return <LangContext.Provider value={{ lang, setLang: handleSetLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
