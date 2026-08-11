// src/components/SpotlightCard.tsx
// Highlight cyan yang mengikuti posisi kursor di dalam kartu — efek populer
// di website portfolio modern. Performant: posisi disimpan lewat CSS custom
// property langsung ke DOM (bukan React state), jadi tidak memicu re-render
// React sama sekali saat mouse bergerak. Otomatis nonaktif di perangkat
// sentuh (tidak ada kursor sungguhan di HP).
import React, { useRef } from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const SpotlightCard: React.FC<Props> = ({ children, className, style }) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <div ref={ref} onMouseMove={handleMove} className={`spotlight-card ${className || ''}`} style={style}>
      {children}
    </div>
  );
};

export default SpotlightCard;
