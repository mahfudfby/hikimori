// src/components/CursorGlow.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CursorGlow: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const over = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      setHovering(
        el.tagName === 'BUTTON' ||
        el.tagName === 'A' ||
        el.closest('button') !== null ||
        el.closest('a') !== null ||
        el.classList.contains('float-hover')
      );
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
    };
  }, []);

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        animate={{ x: pos.x, y: pos.y, scale: hovering ? 2.5 : 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.1 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: 'var(--amber)',
          pointerEvents: 'none',
          zIndex: 9999,
          translateX: '-50%',
          translateY: '-50%',
          mixBlendMode: 'screen',
          opacity: 0.8,
        }}
      />
      {/* Trailing glow */}
      <motion.div
        animate={{ x: pos.x, y: pos.y, scale: hovering ? 2 : 1 }}
        transition={{ type: 'spring', stiffness: 150, damping: 20, mass: 0.5 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '1.5px solid rgba(245,166,35,0.4)',
          pointerEvents: 'none',
          zIndex: 9998,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </>
  );
};

export default CursorGlow;
