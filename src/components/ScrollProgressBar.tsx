// src/components/ScrollProgressBar.tsx
// Garis tipis di paling atas halaman yang terisi sesuai posisi scroll.
// Murah: 1 elemen, transform scaleX terikat ke scrollYProgress (GPU).
import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });

  return (
    <motion.div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 3,
        transformOrigin: '0% 50%', scaleX,
        background: 'linear-gradient(90deg, var(--amber), var(--accent2))',
        zIndex: 10000, pointerEvents: 'none',
      }}
    />
  );
};

export default ScrollProgressBar;
