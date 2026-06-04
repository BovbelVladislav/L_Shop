import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n';
import type { LangType } from '../i18n';

interface LanguageContextProps {
  lang: LangType;
  t: typeof translations['en'];
  setLanguage: (lang: LangType) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const getCookie = (name: string): string | null => {
  const matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : null;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<LangType>('en');

  useEffect(() => {
    const savedLang = getCookie('store_lang') as LangType;
    if (savedLang && (savedLang === 'be' || savedLang === 'en')) {
      setLang(savedLang);
    }
  }, []);

  const setLanguage = (newLang: LangType) => {
    document.cookie = `store_lang=${newLang}; path=/;`; // Сессионная кука
    setLang(newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLang must be used within LanguageProvider');
  return context;
};