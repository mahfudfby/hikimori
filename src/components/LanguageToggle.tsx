// src/components/LanguageToggle.tsx
// Tombol mengambang permanen (bottom-left) untuk switch bahasa ID <-> EN.
// Posisi kiri-bawah supaya tidak bentrok dengan FloatingGear (admin) di kanan-bawah.
import React from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../contexts/LanguageContext';

const LanguageToggle: React.FC = () => {
  const { lang, toggle } = useLang();
  const [hovered, setHovered] = React.useState(false);

  const btnStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '1.5rem',
    left: '1.5rem',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    height: 44,
    padding: '0 14px',
    borderRadius: '999px',
    border: '1px solid rgba(245,166,35,0.35)',
    cursor: 'pointer',
    background: hovered ? 'rgba(245,166,35,0.16)' : 'rgba(10,10,10,0.85)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    boxShadow: hovered
      ? '0 8px 28px rgba(245,166,35,0.35), 0 0 0 3px rgba(245,166,35,0.12)'
      : '0 4px 16px rgba(0,0,0,0.35)',
    transition: 'all 0.25s ease',
    transform: hovered ? 'scale(1.05)' : 'scale(1)',
    fontFamily: 'var(--font-body)',
  };

  const pill = (code: string, active: boolean): React.CSSProperties => ({
    padding: '3px 9px',
    borderRadius: '999px',
    fontSize: '0.72rem',
    fontWeight: 800,
    letterSpacing: '0.5px',
    color: active ? 'var(--black)' : 'rgba(255,255,255,0.55)',
    background: active ? 'var(--amber)' : 'transparent',
    transition: 'all 0.2s ease',
  });

  return (
    <button
      onClick={toggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={lang === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
      aria-label="Toggle language"
      style={btnStyle}
    >
      <span aria-hidden="true" style={{ fontSize: '1.05rem', lineHeight: 1 }}>🌐</span>
      <motion.span layout style={pill('ID', lang === 'id')}>ID</motion.span>
      <motion.span layout style={pill('EN', lang === 'en')}>EN</motion.span>
    </button>
  );
};

export default LanguageToggle;
