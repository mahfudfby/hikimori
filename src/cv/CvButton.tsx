// src/cv/CvButton.tsx: tombol "Unduh CV" (kecil, aman di bundel utama). Membuka halaman /cv.
import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../contexts/LanguageContext';
import { Icon } from '../components/ui';

export const CvDownloadButton: React.FC<{ className?: string; label?: string; style?: React.CSSProperties }> = ({ className = 'pill dark', label, style }) => {
  const { t } = useLang();
  return <Link to="/cv" className={className} style={style}><Icon name="download" size={16} />{label ?? t('Unduh CV', 'Download CV')}</Link>;
};
