// src/contexts/LanguageContext.tsx
// Context global untuk toggle bahasa situs: Bahasa Indonesia ('id') & English ('en').
// Persisten via localStorage, dipakai oleh helper hook useTr() di semua halaman.
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Lang = 'id' | 'en';
const LS_LANG = 'hk_lang';

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  /** t(textId, textEn) → mengembalikan string sesuai bahasa aktif */
  t: (id: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const readInitialLang = (): Lang => {
  try {
    const saved = localStorage.getItem(LS_LANG);
    if (saved === 'id' || saved === 'en') return saved;
  } catch {}
  return 'id';
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(readInitialLang);

  useEffect(() => {
    try { localStorage.setItem(LS_LANG, lang); } catch {}
    try { document.documentElement.lang = lang; } catch {}
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggle = useCallback(() => setLangState(l => (l === 'id' ? 'en' : 'id')), []);
  const t = useCallback((id: string, en: string) => (lang === 'en' ? en : id), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang() harus dipakai di dalam <LanguageProvider>');
  return ctx;
};

/** Alias singkat: const { t } = useTr(); {t('Teks ID','Text EN')} */
export const useTr = () => {
  const { t, lang } = useLang();
  return { t, lang };
};
