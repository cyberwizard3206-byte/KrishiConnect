import { createContext, useCallback, useContext, useState, useEffect, type ReactNode } from 'react';
import { translations, type Language, type TranslationKey } from '@/translations';

export type { TranslationKey, Language };

const STORAGE_KEY = 'krishiconnect-lang';

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  hasChosen: boolean;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function getStoredLanguage(): Language | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && Object.prototype.hasOwnProperty.call(translations, stored)) return stored as Language;
  return null;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => getStoredLanguage() ?? 'en');
  const [hasChosen, setHasChosenState] = useState<boolean>(() => getStoredLanguage() !== null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang === 'haryanvi' ? 'bgc' : lang;
  }, [lang]);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    setHasChosenState(true);
  }, []);

  const t = useCallback(
    (key: TranslationKey) => translations[lang][key] ?? translations.en[key] ?? key,
    [lang],
  );

  return <LanguageContext.Provider value={{ lang, setLang, t, hasChosen }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
