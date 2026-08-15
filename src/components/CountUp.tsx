// src/components/CountUp.tsx
// Angka statistik animasi menghitung naik dari 0 pas masuk viewport.
// Ringan: cuma jalan sekali (once:true), pakai requestAnimationFrame
// bawaan framer-motion punya animate(), bukan setInterval manual.
import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';

interface Props {
  /** Nilai akhir, boleh string mengandung prefix/suffix: "21", "3+", "100%" */
  value: string;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

const CountUp: React.FC<Props> = ({ value, duration = 1.4, className, style }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState('0');

  // Pisahkan angka inti dari prefix/suffix (mis. "3+" -> num=3, suffix="+")
  const match = value.match(/^([^\d]*)(\d+(?:[.,]\d+)?)([^\d]*)$/);
  const prefix = match?.[1] ?? '';
  const numStr = match?.[2] ?? '0';
  const suffix = match?.[3] ?? '';
  const target = parseFloat(numStr.replace(',', '.'));
  const decimals = numStr.includes('.') || numStr.includes(',') ? 1 : 0;

  useEffect(() => {
    if (!inView || isNaN(target)) { setDisplay(value); return; }
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  if (isNaN(target)) {
    return <span ref={ref} className={className} style={style}>{value}</span>;
  }

  return (
    <motion.span ref={ref} className={className} style={style}>
      {prefix}{display}{suffix}
    </motion.span>
  );
};

export default CountUp;
