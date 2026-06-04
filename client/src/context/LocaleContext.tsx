import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Language } from '../locales/i18n';
import { translate, getAvailableLanguages } from '../locales/i18n';

interface LocaleContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  availableLanguages: Language[];
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedLanguage = sessionStorage.getItem('locale') as Language | null;
    if (savedLanguage && getAvailableLanguages().includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    } else {
      const browserLang = navigator.language.split('-')[0].toLowerCase() as Language;
      if (getAvailableLanguages().includes(browserLang)) {
        setLanguageState(browserLang);
      }
    }
    setIsLoaded(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    sessionStorage.setItem('locale', lang);
  };

  const t = (key: string) => translate(key, language);

  if (!isLoaded) {
    return <>{children}</>;
  }

  return (
    <LocaleContext.Provider
      value={{
        language,
        setLanguage,
        t,
        availableLanguages: getAvailableLanguages()
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
}
