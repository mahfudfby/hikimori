// src/cv/CvButton.tsx: tombol "Unduh CV" (kecil, aman di bundel utama).
// Pengunjung: langsung mengunduh file CV (profile.cvUrl, diatur di CMS). Admin yang login: membuka builder /cv.
// (Dulu semua diarahkan ke /cv yang khusus admin, sehingga pengunjung/rekruter berakhir di halaman Login CMS.)
import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useContent } from '../content/ContentContext';
import { Icon } from '../components/ui';

export const CvDownloadButton: React.FC<{ className?: string; label?: string; style?: React.CSSProperties }> = ({ className = 'pill dark', label, style }) => {
  const { t } = useLang();
  const { isAdmin } = useAuth();
  const { content } = useContent();
  const text = label ?? t('Unduh CV', 'Download CV');
  const file = (content.profile.cvUrl || '').trim();
  const body = <><Icon name="download" size={16} />{text}</>;
  if (isAdmin) return <Link to="/cv" className={className} style={style}>{body}</Link>;
  if (!/^(https:\/\/|\/(?!\/))/i.test(file)) return null; // kosong / bukan https / bukan jalur lokal: jangan tampilkan tombol buntu
  const local = file.startsWith('/') && !file.startsWith('//');
  return (
    <a href={file} className={className} style={style}
      {...(local ? { download: '' } : { target: '_blank', rel: 'noopener noreferrer' })}>
      {body}
    </a>
  );
};
