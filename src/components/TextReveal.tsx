// src/components/TextReveal.tsx
// Teks (biasanya heading) muncul kata-per-kata dengan sedikit blur→fokus
// saat masuk viewport — kesan cinematic, bukan cuma fade sekaligus.
// Ringan: satu whileInView di container, stagger anak lewat variants
// (bukan observer per kata).
import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  /** Jarak antar kata muncul (detik) */
  stagger?: number;
  as?: 'span' | 'div';
}

const TextReveal: React.FC<Props> = ({ text, className, style, stagger = 0.06, as = 'span' }) => {
  const words = text.split(' ');
  const Tag = motion[as];
  return (
    <Tag
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger } } }}
      className={className}
      style={{ display: 'inline-block', ...style }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 14, filter: 'blur(6px)' },
            visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
          }}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {word}{i < words.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </Tag>
  );
};

export default TextReveal;
