// src/components/ThemeToggle.tsx
// Tombol mengambang permanen untuk switch tema Terang <-> Gelap.
// Posisi di atas LanguageToggle (kiri-bawah) supaya tidak numpuk.
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { mode, toggle } = useTheme();
  const [hovered, setHovered] = React.useState(false);
  const isDark = mode === 'dark';

  const btnStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '5.2rem',
    left: '1.5rem',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    borderRadius: '999px',
    border: '1px solid rgba(14,124,158,0.35)',
    cursor: 'pointer',
    background: hovered ? 'rgba(14,124,158,0.16)' : 'var(--black-2)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    boxShadow: hovered
      ? '0 8px 28px rgba(14,124,158,0.35), 0 0 0 3px rgba(14,124,158,0.12)'
      : '0 4px 16px rgba(0,0,0,0.18)',
    transition: 'all 0.25s ease',
    transform: hovered ? 'scale(1.05)' : 'scale(1)',
    fontSize: '1.2rem',
    lineHeight: 1,
  };

  return (
    <button
      onClick={toggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={isDark ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'}
      aria-label="Toggle theme"
      style={btnStyle}
    >
      <span aria-hidden="true">{isDark ? '☀️' : '🌙'}</span>
    </button>
  );
};

export default ThemeToggle;
