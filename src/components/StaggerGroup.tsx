// src/components/StaggerGroup.tsx
// Entrance reveal cascading untuk grid/list (skill cards, dsb) — anak-anaknya
// muncul berurutan, bukan bareng, kesan lebih "cinematic". Ringan: cuma
// dijalankan sekali saat masuk viewport (whileInView + once).
import React from 'react';
import { motion } from 'framer-motion';

export const StaggerGroup: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  stagger?: number;
}> = ({ children, className, style, stagger = 0.08 }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.15 }}
    variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger } } }}
    className={className}
    style={style}
  >
    {children}
  </motion.div>
);

export const StaggerItem: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, className, style }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 26, scale: 0.97 },
      visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] } },
    }}
    className={className}
    style={style}
  >
    {children}
  </motion.div>
);
