// src/components/GlobalScrollBackground.tsx
// Lapisan background dekoratif yang bergerak parallax mengikuti scroll —
// baik scroll ke bawah maupun ke atas (posisinya murni fungsi dari scrollY,
// jadi otomatis mengikuti dua arah). Fixed di belakang semua konten,
// zero pengaruh ke layout. Ringan: cuma 2 elemen blur, transform-only
// (GPU), scroll listener ditangani framer-motion (passive + rAF-batched).
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const GlobalScrollBackground: React.FC = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, (v) => v * -0.1);
  const y2 = useTransform(scrollY, (v) => v * -0.05);
  const rotate = useTransform(scrollY, (v) => v * 0.01);

  return (
    <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: -1, overflow: 'hidden', pointerEvents: 'none' }}>
      <motion.div
        style={{
          position: 'absolute', top: '8%', left: '-12%', width: '46%', height: '46%',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,192,0.07) 0%, transparent 70%)',
          filter: 'blur(70px)', y: y1, rotate,
        }}
      />
      <motion.div
        style={{
          position: 'absolute', bottom: '5%', right: '-10%', width: '42%', height: '42%',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,111,168,0.06) 0%, transparent 70%)',
          filter: 'blur(80px)', y: y2,
        }}
      />
    </div>
  );
};

export default GlobalScrollBackground;
