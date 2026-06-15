// src/components/PageTransition.tsx
import React from 'react';
import { motion } from 'framer-motion';

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -24 }}
    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
  >
    {children}
  </motion.div>
);

export default PageTransition;
