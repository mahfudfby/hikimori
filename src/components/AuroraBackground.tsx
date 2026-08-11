// src/components/AuroraBackground.tsx
// Latar aurora lembut (cyan/navy) — CSS-only (transform+opacity, GPU-friendly),
// tanpa blur berat berulang. Dipakai di section hero halaman-halaman sekunder
// biar terasa cinematic & senada dengan hero Home, tapi tetap ringan.
import React from 'react';

interface Props {
  /** Intensitas blob: 'soft' untuk section kecil, 'full' untuk hero besar */
  variant?: 'soft' | 'full';
  className?: string;
}

const AuroraBackground: React.FC<Props> = ({ variant = 'soft', className }) => {
  const big = variant === 'full';
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <div
        className="aurora-blob-a"
        style={{
          position: 'absolute', top: big ? '-25%' : '-15%', left: '10%',
          width: big ? '50%' : '38%', height: big ? '60%' : '46%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14,165,192,0.16) 0%, transparent 72%)',
          filter: 'blur(46px)',
        }}
      />
      <div
        className="aurora-blob-b"
        style={{
          position: 'absolute', bottom: big ? '-20%' : '-12%', right: '8%',
          width: big ? '44%' : '32%', height: big ? '54%' : '40%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14,111,168,0.14) 0%, transparent 72%)',
          filter: 'blur(50px)',
        }}
      />
    </div>
  );
};

export default AuroraBackground;
