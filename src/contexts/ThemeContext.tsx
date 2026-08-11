// src/contexts/ThemeContext.tsx
// Context global untuk toggle tema: terang ('light') & gelap ('dark').
// Menyetel atribut data-theme di <html>, semua warna situs (CSS variables
// di index.css) otomatis mengikuti lewat selector [data-theme="..."].
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Mode = 'light' | 'dark';
const LS_THEME = 'hk_theme';

interface ThemeContextValue {
  mode: Mode;
  setMode: (m: Mode) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const readInitialMode = (): Mode => {
  try {
    const saved = localStorage.getItem(LS_THEME);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {}
  return 'light'; // default: putih/navy/cyan sesuai arahan
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<Mode>(readInitialMode);

  useEffect(() => {
    try { localStorage.setItem(LS_THEME, mode); } catch {}
    try { document.documentElement.setAttribute('data-theme', mode); } catch {}
  }, [mode]);

  const setMode = useCallback((m: Mode) => setModeState(m), []);
  const toggle = useCallback(() => setModeState(m => (m === 'light' ? 'dark' : 'light')), []);

  return (
    <ThemeContext.Provider value={{ mode, setMode, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme() harus dipakai di dalam <ThemeProvider>');
  return ctx;
};
