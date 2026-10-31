// src/components/LogoMark.tsx — logo Hikimori (PNG transparan di Cloudinary, teks putih + glow).
// Logo dirancang untuk latar gelap → secara default dibungkus "badge" gelap agar terbaca di tema terang.
import React from 'react';

const SRC = 'v1793385513/1EF88D88-4DEB-4541-A073-0ED603FFF1CA_hyknub.png';
const BASE = 'https://res.cloudinary.com/dl4pyan8v/image/upload';
// Logo penuh (HK + HIKIMORI + tagline), sisi transparan dipangkas; rasio ±4.46 : 1
export const LOGO_FULL = (h: number) => `${BASE}/e_trim/f_auto,q_auto,h_${h}/${SRC}`;
// Ikon HK saja (dipotong dari logo penuh); rasio ±2.26 : 1
export const LOGO_MARK = (h: number) => `${BASE}/c_crop,x_15,y_245,w_860,h_410/e_trim/f_auto,q_auto,h_${h}/${SRC}`;

const RATIO = { full: 535 / 120, mark: 361 / 160 };

const LogoMark: React.FC<{ height?: number; className?: string; title?: string; variant?: 'full' | 'mark'; bare?: boolean }> =
  ({ height = 28, className, title = 'Hikimori', variant = 'full', bare }) => {
    const url = variant === 'full' ? LOGO_FULL : LOGO_MARK;
    const img = (
      <img src={url(height * 2)} srcSet={`${url(height * 2)} 2x, ${url(height * 3)} 3x`} alt={title}
        height={height} width={Math.round(height * RATIO[variant])} decoding="async" style={{ display: 'block', height, width: 'auto' }} />
    );
    return bare ? img : <span className={`logo-badge ${className || ''}`}>{img}</span>;
  };

export default LogoMark;
