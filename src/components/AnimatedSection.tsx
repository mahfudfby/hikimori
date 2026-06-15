// src/components/AnimatedSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

type Direction = 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale';

interface Props {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  threshold?: number;
}

const variants: Record<Direction, { hidden: object; visible: object }> = {
  up: {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  },
  down: {
    hidden: { opacity: 0, y: -60 },
    visible: { opacity: 1, y: 0 },
  },
  left: {
    hidden: { opacity: 0, x: -80 },
    visible: { opacity: 1, x: 0 },
  },
  right: {
    hidden: { opacity: 0, x: 80 },
    visible: { opacity: 1, x: 0 },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
};

const AnimatedSection: React.FC<Props> = ({
  children,
  direction = 'up',
  delay = 0,
  className,
  style,
  threshold = 0.15,
}) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants[direction]}
      transition={{ duration: 0.7, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
