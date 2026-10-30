// src/components/LogoMark.tsx — monogram HK Hikimori sebagai SVG (tajam, transparan, tanpa crop lingkaran).
// Bentuk: "H" yang pecah jadi piksel di sisi kiri + "K" (chevron) di dalam kotak membulat bergradasi biru.
// Markup yang sama dipakai di intro (public/index.html) — kalau diubah, samakan keduanya.
import React from 'react';

export const HK_PIXELS: [number, number, number, number][] = [
  // x, y, size, opacity — piksel "pecahan" di kiri huruf H
  [30, 22, 10, 0.95], [16, 34, 8, 0.7], [34, 44, 9, 0.85], [6, 52, 6, 0.45], [22, 60, 8, 0.75],
  [36, 70, 7, 0.9], [12, 78, 9, 0.55], [28, 88, 8, 0.8], [2, 96, 5, 0.35], [18, 104, 7, 0.6],
  [34, 112, 9, 0.9], [10, 120, 6, 0.4], [26, 128, 6, 0.65],
];

const LogoMark: React.FC<{ height?: number; className?: string; title?: string; mono?: boolean }> = ({ height = 28, className, title = 'Hikimori', mono }) => {
  const id = React.useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 260 150" height={height} width={(height * 260) / 150} className={className} role="img" aria-label={title}>
      <defs>
        <linearGradient id={`hkg${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2a46ff" />
          <stop offset="1" stopColor="#9aabff" />
        </linearGradient>
      </defs>
      <g fill="currentColor">
        {HK_PIXELS.map(([x, y, s, o], i) => <rect key={i} x={x} y={y} width={s} height={s} opacity={o} />)}
        <rect x="46" y="16" width="26" height="118" rx="2" />
        <rect x="106" y="16" width="26" height="118" rx="2" />
        <rect x="70" y="62" width="38" height="26" />
      </g>
      <rect x="148" y="12" width="104" height="126" rx="20" fill="none" stroke={mono ? 'currentColor' : `url(#hkg${id})`} strokeWidth="7" />
      <polygon points="214,34 234,34 192,75 234,116 214,116 172,75" fill="currentColor" />
      <rect x="226" y="120" width="16" height="6" rx="2" fill="currentColor" />
    </svg>
  );
};

export default LogoMark;
