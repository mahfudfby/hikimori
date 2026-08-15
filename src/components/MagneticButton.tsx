// src/components/MagneticButton.tsx
// Tombol yang sedikit "ketarik" ke arah kursor pas didekati, balik ke
// posisi semula pas dijauhin. Pakai useSpring dari framer-motion (GPU
// transform, ringan). Otomatis nonaktif di perangkat sentuh.
import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface Props {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Seberapa kuat tarikannya, 0.2–0.5 biasanya pas */
  strength?: number;
}

const MagneticButton: React.FC<Props> = ({ children, className, style, strength = 0.3 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });

  const isTouch = typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches;

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY, display: 'inline-block', ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default MagneticButton;
