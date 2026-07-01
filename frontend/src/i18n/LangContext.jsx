import { createContext, useContext, useState } from 'react';
import { translations } from './translations.js';

const LangContext = createContext();

export function LangProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');

  function changeLang(code) {
    setLang(code);
    localStorage.setItem('lang', code);
  }

  const t = (key) => translations[lang]?.[key] || translations.en[key] || key;

  return (
    <LangContext.Provider value={{ lang, changeLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
